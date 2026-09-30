// Quyển 2: lực đạo (canon VN 320–390). Nạp sau data2.js.
// - Mỗi cổ lực cho một hư ảnh thú. Đòn quyền có thể hiện hư ảnh: mỗi hư ảnh làm quyền mạnh thêm.
// - Toàn Lực Ứng Phó: quyền chắc chắn hiện đủ hư ảnh (bình thường chỉ 25%).
// - Khổ Lực: càng mất máu, quyền càng nặng.
// - Khí Lực: hư ảnh hóa thực, đánh từ xa (sát thương theo số hư ảnh).
// - Tự Lực Cánh Sinh: hồi máu theo số hư ảnh.
// - Hư ảnh vĩnh viễn (S.f.luc): mài bằng Âm Vân và Dương Vân cổ, trả bằng tuổi thọ.

Object.assign(GU.bachthi,{beast:'Trư'});Object.assign(GU.hacthi,{beast:'Trư'});Object.assign(GU.hungluc,{beast:'Hùng'});Object.assign(GU.ngacluc,{beast:'Ngạc'});
Object.assign(GU,{
  nguluc:{n:'Thanh Ngưu Lực Cổ',r:2,food:4,fn:'cỏ xanh',t:'passive',atk:6,beast:'Ngưu',p:180,d:'Sức trâu xanh. Mọi đòn +6, thêm hư ảnh trâu.'},
  maluc:{n:'Tuấn Mã Lực Cổ',r:2,food:4,fn:'cỏ khô',t:'passive',atk:5,fleeMod:.1,beast:'Mã',p:170,d:'Sức ngựa phi. Mọi đòn +5, chạy dễ hơn, thêm hư ảnh ngựa.'},
  quyluc:{n:'Thạch Quy Phụ Lực Cổ',r:3,food:5,fn:'đá vụn',t:'passive',atk:5,hp:30,beast:'Quy',p:320,d:'Sức rùa đá cõng núi. Mọi đòn +5, khí huyết +30, thêm hư ảnh rùa.'},
  tuongluc:{n:'Bạch Tượng Bổn Lực Cổ',r:3,food:6,fn:'lá chuối',t:'passive',atk:9,beast:'Tượng',p:420,d:'Sức voi trắng. Mọi đòn +9, thêm hư ảnh voi.'},
  mangluc:{n:'Hắc Mãng Triền Lực Cổ',r:3,food:6,fn:'trứng rắn',t:'passive',atk:8,beast:'Mãng',p:400,d:'Sức trăn đen siết mồi. Mọi đòn +8, thêm hư ảnh trăn.'},
  toanluc:{n:'Toàn Lực Ứng Phó',r:3,food:6,fn:'thịt thú tươi',t:'passive',p:900,d:'Cổ truyền kỳ hình kỳ lân bọ giáp. Mỗi quyền đều hiện đủ hư ảnh thú lực. Nằm trong một viên đá Tinh Thần (VN 334).'},
  kholuc:{n:'Khổ Lực Cổ',r:4,food:8,fn:'máu tươi',t:'passive',p:1600,d:'Tứ chuyển. Càng bị thương, càng đau, lực càng lớn. Quyền nặng thêm theo khí huyết đã mất.'},
  khiluc:{n:'Khí Lực Cổ',r:3,food:5,fn:'gió núi',t:'attack',cost:18,pierce:1,p:1200,get dmg(){return 20+11*beastCount()},d:'Khí đạo thượng cổ đã tuyệt. Cho hư ảnh thú bám vào, hóa thực, đánh từ xa. Sát thương theo số hư ảnh.'},
  tulucsinh:{n:'Tự Lực Cánh Sinh',r:3,food:5,fn:'thịt tươi',t:'heal',cost:14,p:450,get healAmt(){return 30+10*beastCount()},d:'Gián nâu đen. Lực càng mạnh, trị càng tốt, chỉ tự chữa. Dùng quá sức thì tự rách cơ.'},
  phongkhi:{n:'Phong Khí Cổ',r:4,food:6,fn:'gió',t:'passive',p:1000,d:'Bướm xanh lam lục, cổ thiên nhiên. Gieo một thói quen vào cả một quần thể. Nguyên liệu nghịch luyện Khí Lực Cổ.'},
  kimcuong:{n:'Kim Cương Cổ',r:3,food:6,fn:'kim khoáng',t:'guard',cost:16,p:420,d:'Thân phủ kim quang: chỉ nhận 30% sát thương trong 2 lượt.'},
  trucxung:{n:'Trực Xung Cổ',r:2,food:3,fn:'thịt thú',t:'attack',dmg:36,cost:10,p:170,d:'Lao thẳng về phía trước với toàn bộ sức nặng.'},
  thetdoc:{n:'Thề Độc Cổ',r:3,food:0,fn:'máu hai bên',t:'passive',p:300,d:'Khế ước huyết thệ. Vi phạm thì hóa bãi máu.'},
  noikhong:{n:'Nói Không Giữ Lời Cổ',r:3,food:3,fn:'lời nói dối',t:'passive',p:0,d:'Miễn nhiễm Thề Độc Cổ. Luyện từ A Thỉ cổ, Xú Thí cổ và bùn Hắc Tất (VN 323).'},
  amduongvan:{n:'Âm Vân và Dương Vân Cổ',r:3,food:5,fn:'hơi nước',t:'passive',p:500,d:'Mây đen để ngồi, mây trắng trên đầu, sinh sét lam. Dùng để mài một hư ảnh thành vĩnh viễn, trả bằng tuổi thọ.'},
});
Object.assign(SHIELD_RED,{kimcuong:.3});Object.assign(CD,{khiluc:2,tulucsinh:3,kimcuong:3,trucxung:1});

// Hư ảnh đang có: từ cổ lực và hư ảnh vĩnh viễn
function beastList(){
  const b=new Set(S.gu.map(g=>GU[g.k]&&GU[g.k].beast).filter(Boolean));
  for(const x of (S.f&&S.f.luc)||[])b.add(x);
  return [...b];
}
function beastCount(){return S?beastList().length:0}
// Hệ số đòn quyền. Trả {m, t}: m là hệ số, t là câu kể (nếu hiện hư ảnh)
function lucStrike(){
  const bs=beastList();let m=1,t='';
  if(bs.length){
    const sure=hasGu('toanluc'),p=sure?1:.25;
    if(Math.random()<p){m+=.5*bs.length;t=`Hư ảnh ${bs.join(', ')} hiện trên đầu ngươi.`}
  }
  if(hasGu('kholuc')){const lost=1-S.hp/maxHp();if(lost>.1){m*=1+lost*1.2;t+=(t?' ':'')+'Khổ Lực: càng đau, quyền càng nặng.'}}
  return {m,t};
}
function lucPrefer(){return hasGu('toanluc')&&beastCount()>=2}
function lucName(){return beastCount()?(hasGu('toanluc')?'Toàn lực':'Quyền lực đạo'):'Đánh tay'}
function lucShow(){const n=beastCount();return n&&hasGu('toanluc')?Math.round(baseAtk()*(1+.5*n)):baseAtk()}
// Mài một hư ảnh thành vĩnh viễn: mất cổ lực đó nhưng giữ hư ảnh
function lucEngrave(k){
  const b=GU[k]&&GU[k].beast;if(!b)return false;
  S.f.luc=S.f.luc||[];if(!S.f.luc.includes(b))S.f.luc.push(b);
  loseGu(k);S.f.tho=(S.f.tho||0)+3;
  log(`Âm Vân và Dương Vân nghiền hư ảnh ${b} vào xương thịt. Từ nay nó theo ngươi mãi. Mất ba tháng tuổi thọ.`,'big');
  return true;
}
