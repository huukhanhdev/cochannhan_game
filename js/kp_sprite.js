// Sprite key-pose dùng chung (sandbox + battle chính).
// Nạp assets/chibi_kp/<id>/manifest.json và các sheet ngang do tools/keypose_import.py tạo.
// Không tự phát animation: nơi dùng tự chọn frame theo trạng thái (để dừng trận là hình dừng theo).
// TÍCH HỢP: battle.js hiện có bản loadKP/kpFlash riêng; khi chuyển sang dùng file này, nạp
// <script src="js/kp_sprite.js"> trước battle.js rồi thay loadKP(id) → KPSprite.load(id),
// kpFlash(s) → KPSprite.flash(s).
const KPSprite=(function(){
  const cache={};
  function load(id,reviewDir){
    const dir=reviewDir||'assets/chibi_kp/'+id+'/';
    if(reviewDir&&!/^(previews|assets)\/[a-zA-Z0-9_/-]+\/$/.test(reviewDir))return Promise.resolve(null);   // bộ hình khác (SB_SPRITES) nằm trong assets/
    if(cache[dir])return cache[dir];
    return cache[dir]=fetch(dir+'manifest.json').then(r=>r.ok?r.json():null).then(man=>{
      if(!man)return null;
      const [fw,fh]=man.frame_size;
      return Promise.all(Object.entries(man.actions).map(([act,c])=>new Promise(res=>{
        const im=new Image();
        im.onload=()=>{
          const base=PIXI.BaseTexture.from(im,{scaleMode:PIXI.SCALE_MODES.NEAREST});
          res([act,Object.assign({},c,{tex:Array.from({length:c.frames},(_,i)=>new PIXI.Texture(base,new PIXI.Rectangle(i*fw,0,fw,fh)))})]);
        };
        im.onerror=()=>res(null);
        im.src=dir+c.sheet;
      }))).then(list=>{
        const clips={};list.forEach(x=>{if(x)clips[x[0]]=x[1]});
        return clips.idle?{id,man,clips}:null;
      });
    }).catch(()=>null);
  }
  // Frame theo thời gian đã trôi (giây) của một clip; loop thì quay vòng, không thì giữ frame cuối
  function frameAt(clip,sec){
    const d=clip.durations_ms,tot=d.reduce((a,b)=>a+b,0);let t=sec*1000;
    t=clip.loop?t%tot:Math.min(t,tot-1);
    let i=0;while(i<d.length-1&&t>=d[i]){t-=d[i];i++}
    return i;
  }
  // Nháy màu (trúng đòn) bằng ColorMatrix: alpha 0..1, tint là màu phủ
  function flash(sprite,strength){
    const F=PIXI.ColorMatrixFilter||PIXI.filters.ColorMatrixFilter,f=new F(),k=strength??.55;let A=0,tint=0xffffff;
    const set=()=>{const r=(tint>>16&255)/255,g=(tint>>8&255)/255,b=(tint&255)/255,a=A*k;
      f.matrix=[1-a,0,0,0,r*a, 0,1-a,0,0,g*a, 0,0,1-a,0,b*a, 0,0,0,1,0];sprite.filters=a>0.01?[f]:null};
    return {get alpha(){return A},set alpha(v){A=Math.max(0,Math.min(1,v));set()},get tint(){return tint},set tint(v){tint=v;set()}};
  }
  // Sprite pixel offsets are visual only; mirror X, keep floor/hitbox in world space.
  function offset(man,clip,index){
    const o=clip?.frameOffsets?.[index]||[0,0];
    return [o[0]||0,(o[1]||0)-(clip?.hoverOffset??man.hoverOffset??0)];
  }
  function anchor(man,clip,index,name='hand'){
    const p=clip?.anchors?.[name]?.[index];
    if(!p)return null;
    const [dx,dy]=offset(man,clip,index),[px,py]=man.pivot_px;
    return [p[0]-px+dx,p[1]-py+dy];
  }
  return {load,frameAt,flash,offset,anchor};
})();
