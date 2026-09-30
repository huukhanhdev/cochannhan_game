// Quyển 2: lực đạo (canon VN 320–390). Nạp sau data2.js.
// - Mỗi cổ lực cho một hư ảnh thú. Đòn quyền có thể hiện hư ảnh: mỗi hư ảnh làm quyền mạnh thêm.
// - Toàn Lực Ứng Phó: quyền chắc chắn hiện đủ hư ảnh (bình thường chỉ 25%).
// - Khổ Lực: càng mất máu, quyền càng nặng.
// - Khí Lực: hư ảnh hóa thực, đánh từ xa (sát thương theo số hư ảnh).
// - Tự Lực Cánh Sinh: hồi máu theo số hư ảnh.
// - Hư ảnh vĩnh viễn (S.f.luc): mài bằng Âm Vân và Dương Vân cổ, trả bằng tuổi thọ.

Object.assign(GU.bachthi,{beast:'Trư'});Object.assign(GU.hacthi,{beast:'Trư'});Object.assign(GU.hungluc,{beast:'Hùng'});Object.assign(GU.ngacluc,{beast:'Ngạc'});
Object.assign(GU,{
  nguluc:{n:'Thanh Ngưu Lực Cổ',r:2,food:4,fn:'cỏ xanh',t:'passive',atk:7,beast:'Ngưu',p:180,d:'Sức kéo và lực húc của trâu xanh. Mọi đòn +7, thêm hư ảnh Ngưu.'},
  maluc:{n:'Tuấn Mã Lực Cổ',r:2,food:4,fn:'cỏ khô',t:'passive',atk:6,fleeMod:.1,beast:'Mã',p:170,d:'Sức bật và độ bền của ngựa chiến ngàn dặm. Mọi đòn +6, chạy dễ hơn, thêm hư ảnh Mã.'},
  quyluc:{n:'Thạch Quy Phụ Lực Cổ',r:3,food:5,fn:'đá vụn',t:'passive',atk:9,beast:'Quy',p:320,d:'Thể lực trầm tĩnh như rùa đá cõng bia. Mọi đòn +9, thêm hư ảnh Quy.'},
  tuongluc:{n:'Bạch Tượng Bổn Lực Cổ',r:3,food:6,fn:'lá chuối',t:'passive',atk:10,beast:'Tượng',p:420,d:'Sức voi trắng nghiền nát vạn vật. Mọi đòn +10, thêm hư ảnh Tượng.'},
  mangluc:{n:'Hắc Mãng Triền Lực Cổ',r:3,food:6,fn:'trứng rắn',t:'passive',atk:9,beast:'Mãng',p:400,d:'Sức siết của trăn đen. Mọi đòn +9, thêm hư ảnh Mãng.'},
  toanluc:{n:'Toàn Lực Ứng Phó',r:3,food:6,fn:'thịt thú tươi',t:'passive',p:900,d:'Cổ lực đạo thượng cổ đã tuyệt tích. Mọi quyền đều hiện đủ hư ảnh thú lực.'},
  kholuc:{n:'Khổ Lực Cổ',r:4,food:8,fn:'máu tươi',t:'passive',p:1600,d:'Càng bị thương nặng, càng đau, lực càng lớn. Mất bao nhiêu phần trăm khí huyết thì mọi đòn nặng thêm bấy nhiêu, tối đa 80%.'},
  khiluc:{n:'Khí Lực Cổ',r:3,food:5,fn:'gió núi',t:'attack',cost:18,pierce:1,p:1200,get dmg(){return 20+11*beastCount()},d:'Tôi luyện từ Phong Khí Cổ, sinh lực chi khí kình: hư ảnh vô hình hóa thực, lao ra xa công sát. Sát thương theo số hư ảnh.'},
  tulucsinh:{n:'Tự Lực Cánh Sinh',r:3,food:5,fn:'thịt tươi',t:'heal',cost:14,p:450,get healAmt(){return 30+10*beastCount()},d:'Cổ trị liệu lực đạo độc nhất: lực càng lớn, hồi phục càng nhanh. Hồi khí huyết theo sức mạnh và số hư ảnh.'},
  phongkhi:{n:'Phong Khí Cổ',r:4,food:6,fn:'gió',t:'passive',p:1000,d:'Bướm xanh lam lục, cổ thiên nhiên. Gia tốc khí kình, gieo thói quen vào cả một quần thể. Nguyên liệu nghịch luyện Khí Lực Cổ.'},
  kimcuong:{n:'Kim Cương Cổ',r:3,food:6,fn:'kim khoáng',t:'guard',cost:16,p:420,d:'Kim quang bất hoại, cứng hơn cả Thiên Bồng, chống đòn nghiền nát. Chỉ nhận 25% sát thương trong 2 lượt.'},
  trucxung:{n:'Trực Xung Cổ',r:2,food:3,fn:'thịt thú',stun:1,t:'attack',dmg:30,cost:10,p:170,d:'Cường hành đột phá: lao thẳng như sao băng, húc văng mọi thứ trên đường. Địch choáng 1 lượt.'},
  thetdoc:{n:'Thề Độc Cổ',r:3,food:0,fn:'máu hai bên',t:'passive',p:300,d:'Khế ước huyết thệ. Hai bên làm trái lời thề thì độc huyết ăn mòn, hóa vũng máu.'},
  noikhong:{n:'Nói Không Giữ Lời Cổ',r:3,food:3,fn:'lời nói dối',t:'passive',p:0,d:'Hợp luyện từ Xú Thí Cổ, Phạn Đại Thảo và bùn đất. Bội ước Thề Độc mà không trúng độc.'},
  amduongvan:{n:'Âm Vân và Dương Vân Cổ',r:3,food:5,fn:'hơi nước',refine:0.25,t:'passive',p:500,d:'Mây đen và mây trắng tương giao, mưa âm dương thanh lọc cặn bã. Luyện cổ +25%. Dùng để mài hư ảnh thú lực thành vĩnh viễn, trả bằng tuổi thọ.'},
});
Object.assign(SHIELD_RED,{kimcuong:.25});Object.assign(CD,{khiluc:2,tulucsinh:3,kimcuong:3,trucxung:1});

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
  // Khổ Lực tính chung trong dmgMult (engine.js)
  if(hasGu('kholuc')&&S.hp<maxHp()*.9)t+=(t?' ':'')+'Khổ Lực: càng đau, quyền càng nặng.';
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
