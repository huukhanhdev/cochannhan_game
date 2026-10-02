#!/usr/bin/env python3
"""Read-only roster audit and contact sheets; visual approval is manual, not inferred from metrics."""
from pathlib import Path
import json,math
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent.parent;out=root/'previews/roster-validation-v01';ids=json.loads((root/'assets/chibi_kp/index.json').read_text());report=[]
out.mkdir(parents=True,exist_ok=True)
for id in ids:
 p=root/'assets/chibi_kp'/id;m=json.loads((p/'manifest.json').read_text());fw,fh=m['frame_size'];px,py=m['pivot_px'];issues=[];clips={}
 if m['id']!=id:issues.append('id mismatch')
 if not (0<=px<fw and 0<=py<fh):issues.append('pivot outside canvas')
 for a,c in m['actions'].items():
  im=Image.open(p/c['sheet']).convert('RGBA');n=c['frames'];frames=[]
  if im.size!=(fw*n,fh):issues.append(a+': sheet dimension')
  if c.get('hand') and not (0<=c['hand'][0]<fw and 0<=c['hand'][1]<fh):issues.append(a+': hand outside canvas')
  if n!=len(c['durations_ms']) or any(t<=0 for t in c['durations_ms']):issues.append(a+': timing')
  for i in range(n):
   f=im.crop((fw*i,0,fw*(i+1),fh));mask=f.getchannel('A').point(lambda a:255 if a>=100 else 0);b=mask.getbbox()
   if not b:issues.append(a+': empty '+str(i));continue
   x0,y0,x1,y1=b;edge=min(x0,y0,fw-x1,fh-y1);green=sum(1 for r,g,b,a in f.getdata() if a>=100 and g>r*1.5 and g>b*1.5 and g>150)
   frames.append({'bbox':list(b),'width':x1-x0,'height':y1-y0,'floor':y1-1,'edge_margin':edge,'green_pixels':green})
   if edge<=1:issues.append(f'{a}/F{i+1}: near canvas edge {edge}px')
  clips[a]={'frames':frames,'hand':c.get('hand'),'source':c.get('source'),'scale':c.get('scale')}
 # all exact source frames .65 with explicit floor; reference at top
 scale=.65;cw=max(600,math.ceil(fw*3*scale)+16);ch=math.ceil(fh*scale)+42;cols=2;rows=math.ceil(len(clips)/cols)
 atlas=Image.new('RGB',(cw*cols,rows*ch+190),(40,44,53));d=ImageDraw.Draw(atlas);d.text((10,5),id+' | '+str((fw,fh))+' pivot '+str((px,py)),fill='white')
 ref=root/'assets/chibi_ref'/(id+'.png')
 if ref.exists():
  r=Image.open(ref).convert('RGBA');r.thumbnail((170,165),Image.Resampling.NEAREST);atlas.paste(r,(12,24),r);d.text((190,50),'Reference asset (art identity)',fill='white')
 for k,(a,c) in enumerate(m['actions'].items()):
  x=(k%cols)*cw;y=190+(k//cols)*ch;d.text((x+8,y+2),a+' / '+str(c['frames'])+' frames',fill='white');im=Image.open(p/c['sheet']).convert('RGBA')
  for i in range(c['frames']):
   f=im.crop((fw*i,0,fw*(i+1),fh)).resize((round(fw*scale),round(fh*scale)),Image.Resampling.NEAREST);xx=x+8+i*(round(fw*scale)+4);yy=y+24
   atlas.paste(f,(xx,yy),f);d.line((xx,yy+py*scale,xx+fw*scale,yy+py*scale),fill=(180,65,65));d.line((xx+px*scale,yy,xx+px*scale,yy+fh*scale),fill=(65,70,80))
 atlas.save(out/(id+'.png'));report.append({'id':id,'frame_size':[fw,fh],'pivot':[px,py],'structural_issues':issues,'clips':clips,'reference_exists':ref.exists()})
(out/'metrics.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print('IDs',len(ids),'clips',sum(len(x['clips']) for x in report),'frames',sum(len(c['frames']) for x in report for c in x['clips'].values()))
for x in report:
 if x['structural_issues']:print(x['id'],x['structural_issues'])
