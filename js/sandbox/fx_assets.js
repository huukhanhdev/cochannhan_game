// FX tùy chọn đã duyệt. Không đọc state hoặc tạo damage; thiếu asset giữ Graphics fallback.
const SBFxAssets=(()=>{
  const clips={};
  async function load(){await Promise.all(['fx_cuxi','fx_cuongthu','fx_ice_impact'].map(async id=>{
    try{
      const dir='assets/battle_fx/'+id+'/',r=await fetch(dir+'manifest.json');if(!r.ok)return;
      const m=await r.json(),[w,h]=m.frame_size||[],[px,py]=m.pivot_px||[];
      if(m.status!=='approved'||!Number.isInteger(m.frames)||m.frames<1||m.frames>16||
        ![w,h].every(v=>Number.isInteger(v)&&v>0)||!Array.isArray(m.durations_ms)||m.durations_ms.length!==m.frames||
        !m.durations_ms.every(v=>Number.isFinite(v)&&v>0)||!['normal','add'].includes(m.blend)||typeof m.loopFrames!=='boolean'||![px,py].every(Number.isFinite)||px<0||px>w||py<0||py>h||
        typeof m.sheet!=='string'||m.sheet.includes('..')||m.sheet.includes(':')||m.sheet.startsWith('/'))return;
      const sheet=await PIXI.Assets.load(dir+m.sheet);if(sheet.width!==w*m.frames||sheet.height!==h)return;
      sheet.baseTexture.scaleMode=PIXI.SCALE_MODES.NEAREST;
      clips[id]={m,textures:Array.from({length:m.frames},(_,i)=>new PIXI.Texture(sheet.baseTexture,new PIXI.Rectangle(i*w,0,w,h))),duration:m.durations_ms.reduce((a,b)=>a+b,0)/1000};
    }catch(e){/* thiếu hoặc sai file: fallback */}
  }))}
  function create(id){const c=clips[id];if(!c)return null;const s=new PIXI.Sprite(c.textures[0]);
    s.anchor.set(c.m.pivot_px[0]/c.m.frame_size[0],c.m.pivot_px[1]/c.m.frame_size[1]);
    s.blendMode=c.m.blend==='add'?PIXI.BLEND_MODES.ADD:PIXI.BLEND_MODES.NORMAL;
    return {sprite:s,duration:c.duration,frame(age){let ms=age*1000;
      if(c.m.loopFrames)ms%=c.duration*1000;let i=0;while(i<c.m.frames-1&&ms>=c.m.durations_ms[i]){ms-=c.m.durations_ms[i];i++}s.texture=c.textures[i]}};
  }
  return {load,create};
})();
