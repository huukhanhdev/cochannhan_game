// Điều khiển sandbox E: trận luôn chạy, không có bảng chọn hay bước xác nhận.
//   Chuột phải mặt đất: đi · chuột phải / trái vào địch: đuổi tới tầm rồi đánh thường
//   Cảm ứng: commit pointerup ngón chính; Nguyệt chọn rồi chạm điểm, Lướt dùng ngay theo hướng đi.
//   Nút Dừng và S dùng cùng stop(cancel:true), xóa hướng phím đang giữ.
//   Q W E R D: cổ trùng theo ô, phóng ngay về phía con trỏ · Space: lướt về phía con trỏ
//   Phím mũi tên: giữ để đi liên tục, dùng chung lệnh move với chuột nên cùng tốc độ và biên sân;
//   chéo được chuẩn hóa (không nhanh hơn đi thẳng); thả hết phím thì dừng. Space lướt theo hướng phím nếu đang giữ.
//   Huỷ chiêu: chuột phải / lần bấm mới phím mũi tên / S khi đang lấy đà (không mất chân nguyên, chưa vào hồi chiêu);
//   giữ phím mũi tên KHÔNG tự huỷ, chỉ xếp lệnh đi sau khi ra chiêu.
//   1: vật phẩm · S: dừng · click nút trên thanh kỹ năng: như bấm phím (nhắm về phía địch)
// Phím gắn với ô (key trong kit), không gắn với tên cổ.
// TÍCH HỢP: dùng nguyên file; campaign đổi phím qua SBInput.keys (bước đổi phím sau).
const SBInput=(function(){
  let B,msg='',msgAt=-9,aim=null,onChange=()=>{},hoverSkill=null,selectedSkill=null,binding=null;
  const api={
    get selected(){return selectedSkill},
    cancelAim(){selectedSkill=null;SBView.setHover(hoverSkill);onChange()},
    stop(){api.cancelAim();for(const k in held)held[k]=false;kbMoving=false;say(SBSim.issue(B,B.ids.player,{skill:'stop',cancel:true}))},
    touchCast(id){
      if(B.over)return;const p=B.actors[B.ids.player],s=p.sk[id];if(!s)return;
      const r=SBSim.check(B,p,{skill:id});if(!r.ok&&!r.busy){say(r);return}
      if(s.kind==='proj'){selectedSkill=s;SBView.setHover(s);onChange();return}
      api.cancelAim();
      if(s.kind==='dash'){
        const d=arrowDir(),m=p.move;let dx=d?.x??(m?m.x-p.x:0),dz=d?.z??(m?m.z-p.z:0);
        if(Math.hypot(dx,dz)<1){dx=Math.sign(p.x-B.actors[B.ids.enemy].x)||-p.face;dz=0}
        const n=Math.hypot(dx,dz),dist=s.dist||190;
        let x=Math.max(B.arena.X0,Math.min(B.arena.X1,p.x+dx/n*dist)),z=Math.max(0,Math.min(B.arena.Z1,p.z+dz/n*dist));
        if(Math.hypot(x-p.x,z-p.z)<2)z=p.z>B.arena.Z1/2?0:B.arena.Z1;
        say(SBSim.issue(B,B.ids.player,{skill:id,x,z}));return;
      }
      api.cast(id,true);
    },
    get msg(){return B&&B.t-msgAt<2.2?msg:''},get hover(){return hoverSkill},
    init(battle,cb){B=battle;onChange=cb||onChange;bind()},
    cast(id,fromButton){
      api.cancelAim();
      const p=B.actors[B.ids.player],b=B.actors[B.ids.enemy];
      let pt=fromButton||!aim?{x:b.x,z:b.z}:aim;
      const d=arrowDir();if(id==='dash'&&d)pt={x:p.x+d.x*200,z:p.z+d.z*200};   // lướt theo hướng phím mũi tên
      say(SBSim.issue(B,B.ids.player,{skill:id,x:pt.x,z:pt.z}));
    },
    setHover(s){hoverSkill=s;SBView.setHover(selectedSkill||s);onChange()},
  };
  function say(r){if(r&&!r.ok){msg=r.reason;msgAt=B.t}else if(r&&r.queued){msg='Đã nhận lệnh, ra ngay khi rảnh tay';msgAt=B.t}onChange()}
  // Phím mũi tên: hướng đang giữ (đơn vị thế giới, đã chuẩn hóa)
  const held={arrowleft:false,arrowright:false,arrowup:false,arrowdown:false};let kbMoving=false;
  const LOOK=60;                                   // đặt đích trước mặt 60 đơn vị, cập nhật mỗi khung hình
  function arrowDir(){
    const x=(held.arrowright?1:0)-(held.arrowleft?1:0),z=(held.arrowdown?1:0)-(held.arrowup?1:0);
    if(!x&&!z)return null;const n=Math.hypot(x,z);return {x:x/n,z:z/n};
  }
  // Gọi mỗi khung hình từ vòng chính
  api.tick=function(){
    if(!B)return;if(B.over){api.cancelAim();return}
    const p=B.actors[B.ids.player],d=arrowDir();
    if(!d){if(kbMoving){kbMoving=false;if(p.state==='move'&&!p.chase)SBSim.issue(B,B.ids.player,{skill:'stop'})}return}
    const tx=Math.max(B.arena.X0,Math.min(B.arena.X1,p.x+d.x*LOOK)),tz=Math.max(0,Math.min(B.arena.Z1,p.z+d.z*LOOK));
    if(Math.hypot(tx-p.x,tz-p.z)<2){if(kbMoving&&p.state==='move'){kbMoving=false;SBSim.issue(B,B.ids.player,{skill:'stop'})}return}   // đã chạm biên
    kbMoving=true;SBSim.issue(B,B.ids.player,{skill:'move',x:tx,z:tz});
  };
  function key(ev){
    if(ev.target&&/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)||ev.metaKey||ev.ctrlKey||ev.altKey)return;
    if(B.over)return;
    const k=ev.key.toLowerCase();
    if(k in held){
      api.cancelAim();ev.preventDefault();
      if(!ev.repeat&&!held[k]){held[k]=true;const d=arrowDir(),p=B.actors[B.ids.player];      // lần bấm mới: huỷ chiêu đang lấy đà
        if(d&&p.state==='act')say(SBSim.issue(B,B.ids.player,{skill:'move',x:p.x+d.x*60,z:p.z+d.z*60,cancel:true}))}
      held[k]=true;return}
    if(k==='s'){ev.preventDefault();api.stop();return}
    const s=B.actors[B.ids.player].kit.skills.find(x=>x.key===k);
    if(!s)return;
    ev.preventDefault();if(ev.repeat)return;
    api.cast(s.id,false);
  }
  function bind(){
    binding?.abort();binding=new AbortController();const opt={signal:binding.signal};
    const reset=()=>{api.cancelAim();for(const k in held)held[k]=false;kbMoving=false;
      if(B.actors[B.ids.player].state==='move')SBSim.issue(B,B.ids.player,{skill:'stop'});};
    addEventListener('keydown',key,opt);
    addEventListener('keyup',ev=>{const k=ev.key.toLowerCase();if(k in held)held[k]=false},opt);
    addEventListener('blur',reset,opt);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()},opt);
    const cv=SBView.app.view;let finger=null;
    cv.addEventListener('contextmenu',ev=>ev.preventDefault(),opt);
    cv.addEventListener('pointermove',ev=>{if(ev.pointerType!=='mouse')return;const w=SBView.toWorld(ev.clientX,ev.clientY);aim=w.inGround?{x:w.x,z:Math.max(0,Math.min(B.arena.Z1,w.z))}:aim},opt);
    cv.addEventListener('pointerleave',()=>{aim=null},opt);
    function commit(ev,touch){
      if(B.over)return;
      if(touch&&selectedSkill){
        const w=SBView.toWorld(ev.clientX,ev.clientY);if(!w.inGround){say({ok:false,reason:'Chạm vào sân để nhắm chiêu'});return}
        const r=SBSim.issue(B,B.ids.player,{skill:selectedSkill.id,x:w.x,z:w.z});
        say(r);if(r.ok)api.cancelAim();return;
      }
      api.cancelAim();
      const onFoe=SBView.hitActor(ev.clientX,ev.clientY)===B.ids.enemy;
      if(onFoe&&(touch||ev.button===0||ev.button===2)){say(SBSim.issue(B,B.ids.player,{skill:'atk'}));return}
      if(touch||ev.button===2){const w=SBView.toWorld(ev.clientX,ev.clientY);if(!w.inGround)return;
        say(SBSim.issue(B,B.ids.player,{skill:'move',x:w.x,z:w.z,cancel:true}));SBView.pingGround(w);}
    }
    cv.addEventListener('pointerdown',ev=>{
      if(B.over||ev.isPrimary===false)return;
      if(ev.pointerType==='touch'||ev.pointerType==='pen'){ev.preventDefault();finger=ev.pointerId;cv.setPointerCapture?.(finger);return}
      commit(ev,false);
    },opt);
    cv.addEventListener('pointerup',ev=>{if(ev.pointerId!==finger)return;finger=null;ev.preventDefault();commit(ev,true)},opt);
    cv.addEventListener('pointercancel',ev=>{if(ev.pointerId===finger)finger=null},opt);
  }
  api.destroy=()=>{binding?.abort();api.cancelAim()};
  return api;
})();
