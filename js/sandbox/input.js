// Điều khiển sandbox E: trận luôn chạy, không có bảng chọn hay bước xác nhận.
//   Chuột phải mặt đất: đi · chuột phải / trái vào địch: đuổi tới tầm rồi đánh thường
//   Cảm ứng: chạm mặt đất để đi, chạm địch để đuổi đánh; chỉ nhận ngón chính.
//   Q W E R D: cổ trùng theo ô, phóng ngay về phía con trỏ · Space: lướt về phía con trỏ
//   Phím mũi tên: giữ để đi liên tục, dùng chung lệnh move với chuột nên cùng tốc độ và biên sân;
//   chéo được chuẩn hóa (không nhanh hơn đi thẳng); thả hết phím thì dừng. Space lướt theo hướng phím nếu đang giữ.
//   Huỷ chiêu: chuột phải / lần bấm mới phím mũi tên / S khi đang lấy đà (không mất chân nguyên, chưa vào hồi chiêu);
//   giữ phím mũi tên KHÔNG tự huỷ, chỉ xếp lệnh đi sau khi ra chiêu.
//   1: vật phẩm · S: dừng · click nút trên thanh kỹ năng: như bấm phím (nhắm về phía địch)
// Phím gắn với ô (key trong kit), không gắn với tên cổ.
// TÍCH HỢP: dùng nguyên file; campaign đổi phím qua SBInput.keys (bước đổi phím sau).
const SBInput=(function(){
  let B,msg='',msgAt=-9,aim=null,onChange=()=>{},hoverSkill=null;
  const api={
    get msg(){return B&&B.t-msgAt<2.2?msg:''},get hover(){return hoverSkill},
    init(battle,cb){B=battle;onChange=cb||onChange;bind()},
    cast(id,fromButton){
      const p=B.actors.pn,b=B.actors.bnb;
      let pt=fromButton||!aim?{x:b.x,z:b.z}:aim;
      const d=arrowDir();if(id==='dash'&&d)pt={x:p.x+d.x*200,z:p.z+d.z*200};   // lướt theo hướng phím mũi tên
      say(SBSim.issue(B,'pn',{skill:id,x:pt.x,z:pt.z}));
    },
    setHover(s){hoverSkill=s;SBView.setHover(s);onChange()},
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
    if(!B||B.over)return;
    const p=B.actors.pn,d=arrowDir();
    if(!d){if(kbMoving){kbMoving=false;if(p.state==='move'&&!p.chase)SBSim.issue(B,'pn',{skill:'stop'})}return}
    const tx=Math.max(SBSim.X0,Math.min(SBSim.X1,p.x+d.x*LOOK)),tz=Math.max(0,Math.min(SBSim.Z1,p.z+d.z*LOOK));
    if(Math.hypot(tx-p.x,tz-p.z)<2){if(kbMoving&&p.state==='move'){kbMoving=false;SBSim.issue(B,'pn',{skill:'stop'})}return}   // đã chạm biên
    kbMoving=true;SBSim.issue(B,'pn',{skill:'move',x:tx,z:tz});
  };
  function key(ev){
    if(ev.target&&/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)||ev.metaKey||ev.ctrlKey||ev.altKey)return;
    if(B.over)return;
    const k=ev.key.toLowerCase();
    if(k in held){
      ev.preventDefault();
      if(!ev.repeat&&!held[k]){held[k]=true;const d=arrowDir(),p=B.actors.pn;      // lần bấm mới: huỷ chiêu đang lấy đà
        if(d&&p.state==='act')say(SBSim.issue(B,'pn',{skill:'move',x:p.x+d.x*60,z:p.z+d.z*60,cancel:true}))}
      held[k]=true;return}
    if(k==='s'){ev.preventDefault();SBSim.issue(B,'pn',{skill:'stop',cancel:true});return}
    const s=B.actors.pn.kit.skills.find(x=>x.key===k);
    if(!s)return;
    ev.preventDefault();if(ev.repeat)return;
    api.cast(s.id,false);
  }
  function bind(){
    addEventListener('keydown',key);
    addEventListener('keyup',ev=>{const k=ev.key.toLowerCase();if(k in held)held[k]=false});
    addEventListener('blur',()=>{for(const k in held)held[k]=false});
    const cv=SBView.app.view;
    cv.addEventListener('contextmenu',ev=>ev.preventDefault());
    cv.addEventListener('pointermove',ev=>{if(ev.pointerType!=='mouse')return;const w=SBView.toWorld(ev.clientX,ev.clientY);aim=w.inGround?{x:w.x,z:Math.max(0,Math.min(SBSim.Z1,w.z))}:aim});
    cv.addEventListener('pointerleave',()=>{aim=null});
    cv.addEventListener('pointerdown',ev=>{
      if(B.over||ev.isPrimary===false)return;
      const touch=ev.pointerType==='touch'||ev.pointerType==='pen';
      if(touch)ev.preventDefault();
      const onFoe=SBView.hitActor(ev.clientX,ev.clientY)==='bnb';
      if(onFoe&&(touch||ev.button===0||ev.button===2)){say(SBSim.issue(B,'pn',{skill:'atk'}));return}
      if(touch||ev.button===2){
        const w=SBView.toWorld(ev.clientX,ev.clientY);if(!w.inGround)return;
        say(SBSim.issue(B,'pn',{skill:'move',x:w.x,z:w.z,cancel:true}));SBView.pingGround(w);
      }
    });
  }
  return api;
})();
