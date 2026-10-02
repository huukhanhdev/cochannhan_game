#!/usr/bin/env python3
"""Nhập FX bằng rect tường minh; không đo mặt/căn chân/resize pose.
python3 tools/fx_import.py source.png --spec spec.json [--output previews/fx-import/id]
Xuất vào thư mục review; --approve mới được ghi assets/battle_fx/<id>.
"""
import argparse,json,re
from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage

def unkey(im,rgb,tol):
    """Xóa nền theo ngưỡng: ảnh AI không bao giờ có nền đúng một mã màu (nén, khử răng cưa).
    Pixel cách màu key ≤ tol (tổng |ΔR|+|ΔG|+|ΔB|) thành trong suốt; dải 2px quanh vùng đã xóa
    được khử ám màu key (chỉ khi pixel ngả hẳn về key), không đụng phần trong FX."""
    a=np.asarray(im).astype(np.int16);key=np.array(rgb,np.int16)
    near=np.abs(a[...,:3]-key).sum(-1)<=tol
    a[...,3]=np.where(near,0,a[...,3])
    edge=~near&ndimage.binary_dilation(near,iterations=2)
    # ám key = các kênh mạnh của key vượt kênh yếu của key; kéo về phía kênh yếu
    hi=[i for i in range(3) if key[i]>=128];lo=[i for i in range(3) if key[i]<128]
    if hi and lo:
        cast=a[...,hi].min(-1)-a[...,lo].max(-1)
        m=edge&(cast>40)
        for i in hi:a[...,i]=np.where(m,a[...,i]-(cast*.8).astype(np.int16),a[...,i])
    return Image.fromarray(np.clip(a,0,255).astype(np.uint8))

def build(source,spec,out):
    ident=spec['id']
    if not re.fullmatch(r'fx_[a-z0-9_]+',ident): raise ValueError('id phải bắt đầu fx_')
    rects=spec['rects'];w,h=spec['frame_size'];pivot=spec['pivot_px'];timing=spec['durations_ms']
    if not 1<=len(rects)<=16 or len(rects)!=len(timing): raise ValueError('Cần 1–16 rect và timing tương ứng')
    if any(not isinstance(v,int) or v<=0 for v in [w,h,*timing]): raise ValueError('Kích thước/timing phải là số nguyên dương')
    if len(pivot)!=2 or not all(isinstance(v,int) for v in pivot) or not (0<=pivot[0]<=w and 0<=pivot[1]<=h): raise ValueError('Pivot không hợp lệ')
    if spec.get('blend','normal') not in ['normal','add']: raise ValueError('Blend không hợp lệ')
    loop=spec.get('loopFrames',False)
    if not isinstance(loop,bool): raise ValueError('loopFrames phải boolean')
    im=Image.open(source).convert('RGBA');frames=[]
    key=spec.get('key_color');rgb=tuple(bytes.fromhex(key.lstrip('#'))) if key else None
    if rgb and len(rgb)!=3: raise ValueError('key_color phải RGB hex')
    tol=spec.get('key_tolerance',90)
    if not isinstance(tol,int) or not 0<=tol<=255: raise ValueError('key_tolerance phải số nguyên 0–255')
    if rgb: im=unkey(im,rgb,tol)
    for rect in rects:
        if len(rect)!=4 or any(not isinstance(v,int) for v in rect): raise ValueError('Rect phải 4 số nguyên')
        x,y,rw,rh=rect
        if rw!=w or rh!=h or min(x,y)<0 or x+w>im.width or y+h>im.height: raise ValueError('Rect sai kích thước/tràn source')
        frame=im.crop((x,y,x+w,y+h))
        if not frame.getchannel('A').getbbox(): raise ValueError('Frame rỗng sau xóa key')
        frames.append(frame)
    out=Path(out);out.mkdir(parents=True,exist_ok=True)
    sheet=Image.new('RGBA',(w*len(frames),h))
    for i,frame in enumerate(frames):
        frame.save(out/f'{ident}_{i+1:02}.png');sheet.paste(frame,(i*w,0))
    sheet.save(out/'sheet.png')
    manifest={'id':ident,'sheet':'sheet.png','frame_size':[w,h],'pivot_px':pivot,'frames':len(frames),'durations_ms':timing,'loopFrames':loop,'blend':spec.get('blend','normal'),'anchor':spec.get('anchor','hand'),'source':str(source),'status':'review'}
    (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    return manifest

def main():
    a=argparse.ArgumentParser();a.add_argument('source',type=Path);a.add_argument('--spec',required=True,type=Path);a.add_argument('--output',type=Path);a.add_argument('--approve',action='store_true');args=a.parse_args()
    spec=json.loads(args.spec.read_text());ident=spec['id'];root=Path(__file__).resolve().parent.parent
    if not re.fullmatch(r'fx_[a-z0-9_]+',ident): raise ValueError('id không hợp lệ')
    out=args.output or root/'previews/fx-import'/ident
    if args.approve:
        if not (root/'previews/fx-import'/ident/'manifest.json').exists():
            print(f'Cảnh báo: chưa có bản review previews/fx-import/{ident}; nên chạy không --approve và xem trước.')
        out=root/'assets/battle_fx'/ident
    elif out.resolve().is_relative_to((root/'assets').resolve()): raise ValueError('Xuất assets cần --approve sau duyệt')
    manifest=build(args.source,spec,out)
    if args.approve:
        manifest['status']='approved';(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(f'{ident}: {manifest["frames"]} frames → {out}')
if __name__=='__main__': main()
