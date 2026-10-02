// Máy điều khiển Bạch Ngưng Băng: kiêu ngạo, thích áp sát (ch 133–135). Nghĩ mỗi ~0,4 giây, không
// phản xạ từng khung hình. a.intent dùng để hiện biểu tượng ý đồ trên đầu.
// Thứ tự: thoát thân khi nguy (Sương Yêu, 1 lần) → né Nguyệt Mang đang lấy đà → Lốc băng nhận →
// Thủy Tráo khi bị dồn → băng nhận khi trong tầm → áp sát.
// TÍCH HỢP: giữ nguyên file; campaign chọn mức khó qua SBAI.level.
(function(root){
  const LEVEL={
    de:{think:.6,jitter:.25,dodge:.15,dmgK:.85,gap:.15},
    thuong:{think:.4,jitter:.15,dodge:.4,dmgK:1,gap:.35},
    kho:{think:.18,jitter:.06,dodge:.7,dmgK:1.2,gap:.55}};
  const SBAI={level:'thuong',LEVEL,
    tick(B,dt){
      const Sim=root.SBSim;
      for(const a of Object.values(B.actors)){
        if(!a.ai||a.state==='ko'||B.over)continue;
        a.aiT=(a.aiT??.6)-dt;if(a.aiT>0)continue;
        const L=LEVEL[SBAI.level]||LEVEL.thuong;a.aiT=L.think+B.rng()*L.jitter;
        const t=a.id==='pn'?B.actors.bnb:B.actors.pn;
        if(t.state==='ko')continue;
        const dist=Math.hypot(t.x-a.x,t.z-a.z),ok=id=>a.sk[id]&&Sim.check(B,a,{skill:id}).ok;
        // né: đối thủ đang lấy đà đạn nhắm về phía mình
        const ta=t.act;
        // Boss Khó đọc động tác đã diễn ra, không tự né trước khi có cảnh báo.
        // Lách khỏi đòn rết/chộp rồi trở lại đánh; giữ một đích né cho mỗi hid, tránh zigzag.
        if(SBAI.level==='kho'&&(a.state==='idle'||a.state==='move')&&ta&&ta.phase==='startup'&&ta.t>=.2&&
          (ta.s.kind==='melee'||ta.s.kind==='grab')&&Sim.inMelee(t,a,ta.s,false)){
          if(a.evadeHid!==ta.hid){a.evadeHid=ta.hid;a.evadeZ=Math.max(0,Math.min(Sim.Z1,t.z+(a.z>Sim.Z1/2?-1:1)*(ta.s.depth+30)))}
          a.intent='dodge';Sim.issue(B,a.id,{skill:'move',x:a.x,z:a.evadeZ});continue;
        }
        if(ta&&ta.phase==='startup'&&ta.s.kind==='proj'&&Math.abs(ta.aim.z-a.z)<50&&ok('dash')&&B.rng()<L.dodge){
          const dz=a.z>Sim.Z1/2?-1:1;a.intent='dodge';Sim.issue(B,a.id,{skill:'dash',x:a.x-Math.sign(t.x-a.x)*30,z:a.z+dz*160});continue}
        if(a.state!=='idle'&&a.state!=='move')continue;
        if(a.hp<a.maxHp*.3&&ok('suongyeu')&&dist<220){a.intent='escape';Sim.issue(B,a.id,{skill:'suongyeu'});continue}
        // Ép người chơi chọn vị trí hồi máu/phóng đạn; không thêm cổ hoặc sát thương tức thì.
        if(SBAI.level==='kho'&&ta&&ta.phase==='startup'&&ta.t>=.15&&
          (ta.s.kind==='heal'||ta.s.kind==='proj')&&dist>150&&dist<330&&ok('dash')){
          a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:t.x-Math.sign(t.x-a.x)*80,z:t.z});continue;
        }
        // Không phí Lốc khóa đất lên mục tiêu đang chạy ở mức Khó; áp sát chờ thời cơ.
        if(ok('locbangnhan')&&dist<a.sk.locbangnhan.castRange&&B.t-(a.lastBig??-2)>8&&
          (SBAI.level!=='kho'||t.state!=='move')){
          a.lastBig=B.t;a.intent='big';Sim.issue(B,a.id,{skill:'locbangnhan'});continue}
        if(ok('thuytrao')&&!a.shield&&dist<180&&a.hp<a.maxHp*.65&&B.rng()<.6){a.intent='guard';Sim.issue(B,a.id,{skill:'thuytrao'});continue}
        // áp sát bằng lướt khi đối thủ giữ khoảng cách (thả diều): buộc người chơi canh vị trí
        if(dist>170&&dist<330&&ok('dash')&&B.rng()<L.gap){a.intent='near';Sim.issue(B,a.id,{skill:'dash',x:t.x-Math.sign(t.x-a.x)*80,z:t.z});continue}
        a.intent=Sim.inMelee(a,t,a.sk.atk,true)?'melee':'near';
        Sim.issue(B,a.id,{skill:'atk'});
      }
    }};
  if(typeof module!=='undefined')module.exports=SBAI;else root.SBAI=SBAI;
})(this);
