// Điều khiển sandbox E: trận luôn chạy, không có bảng chọn hay bước xác nhận.
//   Chuột phải mặt đất: đi · chuột phải / trái vào địch: đuổi tới tầm rồi đánh thường
//   Q W E R D: cổ trùng theo ô, phóng ngay về phía con trỏ · Space: lướt về phía con trỏ
//   1: vật phẩm · S: dừng · click nút trên thanh kỹ năng: như bấm phím (nhắm về phía địch)
// Phím gắn với ô (key trong kit), không gắn với tên cổ.
// TÍCH HỢP: dùng nguyên file; campaign đổi phím qua SBInput.keys (bước đổi phím sau).
const SBInput=(function(){
  let B,msg='',msgAt=-9,aim=null,onChange=()=>{},hoverSkill=null;
  const api={
    get msg(){return B&&B.t-msgAt<2.2?msg:''},get hover(){return hoverSkill},
    init(battle,cb){B=battle;onChange=cb||onChange;bind()},
    cast(id,fromButton){
      const p=B.actors.pn,b=B.actors.bnb,pt=fromButton||!aim?{x:b.x,z:b.z}:aim;
      say(SBSim.issue(B,'pn',{skill:id,x:pt.x,z:pt.z}));
    },
    setHover(s){hoverSkill=s;SBView.setHover(s);onChange()},
  };
  function say(r){if(r&&!r.ok){msg=r.reason;msgAt=B.t}else if(r&&r.queued){msg='Đã nhận lệnh, ra ngay khi rảnh tay';msgAt=B.t}onChange()}
  function key(ev){
    if(ev.target&&/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)||ev.metaKey||ev.ctrlKey||ev.altKey)return;
    if(B.over)return;
    const k=ev.key.toLowerCase();
    if(k==='s'){ev.preventDefault();SBSim.issue(B,'pn',{skill:'stop'});return}
    const s=B.actors.pn.kit.skills.find(x=>x.key===k);
    if(!s)return;
    ev.preventDefault();if(ev.repeat)return;
    api.cast(s.id,false);
  }
  function bind(){
    addEventListener('keydown',key);
    const cv=SBView.app.view;
    cv.addEventListener('contextmenu',ev=>ev.preventDefault());
    cv.addEventListener('mousemove',ev=>{const w=SBView.toWorld(ev.clientX,ev.clientY);aim=w.inGround?{x:w.x,z:Math.max(0,Math.min(SBSim.Z1,w.z))}:aim});
    cv.addEventListener('mouseleave',()=>{aim=null});
    cv.addEventListener('mousedown',ev=>{
      if(B.over)return;
      const onFoe=SBView.hitActor(ev.clientX,ev.clientY)==='bnb';
      if(onFoe&&(ev.button===0||ev.button===2)){say(SBSim.issue(B,'pn',{skill:'atk'}));return}
      if(ev.button===2){
        const w=SBView.toWorld(ev.clientX,ev.clientY);if(!w.inGround)return;
        say(SBSim.issue(B,'pn',{skill:'move',x:w.x,z:w.z}));SBView.pingGround(w);
      }
    });
  }
  return api;
})();
