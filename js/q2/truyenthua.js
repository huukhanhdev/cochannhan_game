// Quyển 2: Tam Vương truyền thừa theo ải (canon VN 424–441). Nạp sau luc.js.
// Luật phúc địa: thời gian bên trong gấp ba; chỉ dùng được cổ chìa khóa (trừ Xuân Thu Thiền);
// mỗi lần mở, mỗi người chỉ vào mỗi truyền thừa một lần; rút lui giữa chừng thì không vào lại được.

/* ---------- Khuyển Vương: bầy chó đấu bầy chó ---------- */
// S.f.kv={ai, cho, done}. Thời gian trong phúc địa gấp ba: mỗi lượt thử tối đa 8 ải. Thắng thì thu thêm chó, thua thì mất chó.
function kvState(){return S.f.kv=S.f.kv||{ai:0,cho:27,done:0}}
const KV_MARK={10:'q2_kv_han',20:'q2_kv_daidien',30:'q2_kv_thuong'};
function kvStep(){
  const k=kvState();
  if(k.done){log('Mỗi lần mở, mỗi người chỉ vào Khuyển Vương một lần. Ngươi đã ra rồi.','sys');return}
  if(!hasGu('ngukhuyen')){log('Không có Ngự Khuyển cổ, cột sáng vàng không nhận ngươi.','danger');return}
  for(let i=0;i<8;i++){
    const need=14+k.ai*1.7,pow=k.cho*(1+(S.tamco-8)*.04)*(k.ai<20?1:.9);
    const p=clamp(pow/need*.62,.12,.95);
    k.ai++;
    if(Math.random()<p){const g=rand(2,5)+(k.ai>=20?2:0);k.cho+=g;S.stones+=4+Math.floor(k.ai/5);log(`Ải ${k.ai}: bầy chó của ngươi thắng, thu thêm ${g} con. Còn ${k.cho} con.`,'good')}
    else{const l=rand(2,4)+Math.floor(k.ai/10);k.cho-=l;log(`Ải ${k.ai}: thua, mất ${l} con. Còn ${Math.max(0,k.cho)} con.`,'danger')}
    if(k.cho<=0){k.done=1;log('Bầy chó chết sạch. Truyền thừa đẩy ngươi ra ngoài.','danger');return}
    if(KV_MARK[k.ai]){S.evq.push(KV_MARK[k.ai]);return}
  }
}
/* ---------- Tín Vương: luyện cổ đấu người lông ---------- */
// S.f.tv={ai, nl, done}. Hai mươi ải đầu nịnh là thắng; từ ải 30 người lông khôn hơn, phải luyện thật.
// Nguyên liệu dư tích lũy qua các ải (bí mật kiếp trước hơn một năm sau mới lộ).
function tvState(){return S.f.tv=S.f.tv||{ai:0,nl:0,done:0}}
const TV_MARK={20:'q2_tv_khon',32:'q2_tv_thuylung',40:'q2_tv_ra'};
function tvStep(){
  const t=tvState();
  if(t.done){log('Ngươi đã ra khỏi Tín Vương truyền thừa lần này.','sys');return}
  if(!hasGu('chihac')){log('Không có Chỉ Hạc cổ, cột sáng lam không nhận ngươi.','danger');return}
  for(let i=0;i<8;i++){
    t.ai++;
    const easy=t.ai<=20,p=easy?clamp(.55+(S.tamco-10)*.04,.3,.95):clamp(.35+(S.ngo-8)*.04+t.nl*.01,.15,.9);
    if(Math.random()<p){t.nl+=rand(1,2);log(easy?`Ải ${t.ai}: ngươi tâng bốc người lông tới mức hắn luyện hỏng. Thắng.`:`Ải ${t.ai}: luyện thành trước người lông.`,'good')}
    else{S.hp=Math.max(1,S.hp-rand(10,20));log(`Ải ${t.ai}: luyện hỏng, lò nổ. Khí huyết giảm.`,'danger');if(S.hp<=maxHp()*.2){t.done=1;log('Ngươi bị đẩy ra khỏi truyền thừa.','danger');return}}
    if(TV_MARK[t.ai]){S.evq.push(TV_MARK[t.ai]);return}
  }
}

Object.assign(GU,{
  xaloi4:{n:'Hoàng Kim Xá Lợi Cổ',r:4,food:0,fn:'không cần',t:'use',p:1200,d:'Dùng một lần: Tứ chuyển tăng một tiểu cảnh giới. Phần thưởng ải 40 Tín Vương.'},
  thuylung:{n:'Thủy Lung Cổ',r:3,food:3,fn:'nước',t:'passive',p:300,d:'Phun cầu nước hơn hai mét giam cổ hoang hoặc đối thủ đã kiệt sức để bắt sống.'},
  cotduc:{n:'Cốt Dực Cổ',r:4,food:8,fn:'tủy xương',t:'passive',fleeMod:.6,p:2000,d:'Cánh xương mọc xuyên sống lưng, bay tự do ba chiều. Trong trận chuỗi, địch cận chiến khó với tới; chạy trốn dễ hơn nhiều.'},
  tinhthietcot:{n:'Tinh Thiết Cốt Cổ',r:4,food:6,fn:'thiết tinh',t:'passive',hp:140,atk:5,p:1400,d:'Xương cứng hơn Thiết Cốt nhiều lần, chịu va đập của hàng chục thú lực. Khí huyết tối đa +140, mọi đòn +5.'},
  lientrongdongbi:{n:'Đồng Bì Cổ (tắm đồng)',r:3,food:5,fn:'đồng nóng chảy',armor:0.2,t:'passive',p:350,d:'Ngâm mình trong vạc đồng nóng chảy, ép cổ vào da thịt thành biểu bì đồng vĩnh viễn. Giảm 20% mọi sát thương nhận vào.'},
});


/* ---------- Bạo Vương: phòng trứng nổ ---------- */
// S.f.bv={ai, egg, fuse, done}. Mỗi phòng có một ổ Bạo Đản với ngòi ẩn 1–3 nhịp.
// Lao qua khi ngòi còn dài thì an toàn; ngòi ngắn thì nổ vào mặt. Ném Bạo Đản kích nổ trước thì chắc ăn nhưng tốn trứng.
// Dò nhịp nổ (lựa chọn phụ) tốn tâm cơ tạm thời, cho biết ngòi dài ngắn. Mỗi lượt đi 3 phòng.
function bvState(){return S.f.bv=S.f.bv||{ai:0,egg:3,fuse:0,done:0,left:0}}
const BV_REWARD={10:'q2_bv_thuong10',20:'q2_bv_thuong20',30:'q2_bv_thuong30'};
function bvStep(){
  const b=bvState();
  if(b.done){log('Ngươi đã ra khỏi Bạo Vương truyền thừa lần này.','sys');return}
  if(!hasGu('baodan')){log('Không có Bạo Đản cổ, cột sáng đỏ không nhận ngươi.','danger');return}
  b.left=3;bvRoom();
}
function bvRoom(){const b=bvState();b.ai++;b.fuse=rand(1,3);b.peek=0;S.evq.push('q2_bv_ai')}
// Kết một phòng: phần thưởng, mốc, phòng kế
function bvNext(){
  const b=bvState();
  if(S.hp<=maxHp()*.15){b.done=1;log('Lửa nổ hất ngươi ra ngoài cột sáng. Bạo Vương truyền thừa đóng lại với ngươi.','danger');return}
  if(b.ai%3===0){b.egg++;log('Nhặt được một Bạo Đản còn nguyên trong đống tro.','good')}
  if(BV_REWARD[b.ai]){S.evq.push(BV_REWARD[b.ai]);b.left=0;return}
  if(--b.left>0)bvRoom();
}
function bvBoom(mult){const d=Math.round(maxHp()*(.1+bvState().ai*.006)*mult);S.hp=Math.max(1,S.hp-d);return d}

Object.assign(GU,{
  hoathu:{n:'Hỏa Thủ Cổ',r:3,food:5,fn:'than hồng',bleed:2,t:'attack',dmg:45,cost:15,p:400,d:'Hai bàn tay hóa vuốt lửa, đốt da thịt và chân nguyên đối phương. Địch cháy 2 lượt.'},
  nhamngac:{n:'Nham Ngạc Lực Cổ',r:3,food:6,fn:'đá nóng chảy',t:'passive',atk:12,beast:'Nham Ngạc',p:600,d:'Nâng cấp từ Ngạc Lực: cá sấu nham thạch khổng lồ, quật đuôi nát đá. Mọi đòn +12, thêm hư ảnh Nham Ngạc.'},
  baoviem:{n:'Bạo Viêm Cổ',r:4,food:8,fn:'lưu huỳnh',pierce:1,t:'attack',dmg:85,cost:24,aoe:1,p:1500,d:'Cầu lửa nổ như thiên thạch, xé màng bảo hộ của cổ sư Tứ chuyển. Quét cả vùng, xuyên giáp.'},
});
Object.assign(CD,{hoathu:2,baoviem:3});

Object.assign(EV,{
q2_bv_ai:{title:'Phòng trứng nổ',g:'爆',sc:'fire',
  text:()=>{const b=bvState();return `Ải ${b.ai} của Bạo Vương. Giữa phòng là một ổ Bạo Đản đỏ rực, ngòi lửa đang cháy. Cửa ra ở phía bên kia.`+(b.peek?` Ngươi đã dò: ngòi ${['','rất ngắn, sắp nổ','còn nửa','còn dài'][b.fuse]}.`:'')+` Còn ${b.egg} Bạo Đản trong tay.`},
  choices:()=>{const b=bvState();return [
    ...(!b.peek?[{t:'Dò nhịp nổ trước (tâm cơ)',stay:'p'+b.ai,check:['tamco',12],ok:()=>{b.peek=1;return `Ngòi ${['','rất ngắn','còn nửa','còn dài'][b.fuse]}.`},fail:()=>{b.peek=1;b.fuse=Math.max(1,b.fuse-1);return 'Ngươi dò lâu quá, ngòi cháy ngắn thêm.'}}]:[]),
    {t:'Lao qua ngay',eff:()=>{if(b.fuse>=2){bvNext();return 'Ngươi qua cửa trước khi ổ trứng nổ tung sau lưng.'}const d=bvBoom(2.2);bvNext();return `Ổ trứng nổ vào mặt ngươi. Khí huyết −${d}.`}},
    {t:'Ném một Bạo Đản kích nổ trước',req:()=>b.egg>0,reqT:'Hết Bạo Đản',eff:()=>{b.egg--;const d=bvBoom(.4);bvNext();return `Hai vụ nổ triệt tiêu nhau. Chỉ sém da. Khí huyết −${d}.`}},
    {t:'Chờ nổ xong rồi mới đi',eff:()=>{const d=b.fuse===3?bvBoom(1.3):bvBoom(.8);bvNext();return `Chờ quá lâu, lửa lan khắp phòng. Khí huyết −${d}.`}},
    {t:'Rời Bạo Vương truyền thừa',eff:()=>{b.done=1;b.left=0;S.stones+=10*b.ai;return `Ngươi ra ngoài với ${10*b.ai} nguyên thạch nhặt dọc đường.`}},
  ]}},
q2_bv_thuong10:{title:'Hỏa Thủ',g:'火',sc:'fire',
  text:()=>'Ải 10. Trên bệ đá có một con Hỏa Thủ cổ, lòng bàn tay nó còn ấm.',
  choices:[{t:'Lấy, đi tiếp',eff:()=>{gainGu('hoathu');return 'Viêm đạo trong tay lực tu.'}},{t:'Lấy, rời truyền thừa',eff:()=>{gainGu('hoathu');bvState().done=1;return 'Ngươi ra ngoài.'}}]},
q2_bv_thuong20:{title:'Hư ảnh Nham Ngạc',g:'鳄',sc:'fire',
  text:()=>'Ải 20. Hồ dung nham, một con cá sấu dung nham khổng lồ nằm im như đá. Bóng của nó có thể thành hư ảnh của ngươi.',
  choices:[{t:'Nhảy xuống hồ, thu hư ảnh',eff:()=>{const d=bvBoom(1.5);gainGu('nhamngac');return `Da ngươi phồng rộp. Khí huyết −${d}. Hư ảnh Nham Ngạc theo ngươi.`}},{t:'Rời đi',eff:()=>{bvState().done=1;S.stones+=150;return '+150 nguyên thạch.'}}]},
q2_bv_thuong30:{title:'Bạo Viêm',g:'炎',sc:'fire',
  text:()=>'Ải 30. Bạo Vương ra tay là núi lở. Di sản của ông ta nằm giữa một quả cầu lửa đang thở.',
  choices:[{t:'Ôm lấy nó',eff:()=>{const d=bvBoom(2);gainGu('baoviem');bvState().done=1;return `Khí huyết −${d}. Bạo Viêm cổ Tứ chuyển. Cột sáng đỏ đẩy ngươi ra ngoài.`}}]},
});
