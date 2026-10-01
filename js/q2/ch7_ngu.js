// Quyển 2 · Chương 2.7: Ngũ chuyển giáng lâm (canon VN 450–465)
// Thiết Mộ Bạch quét Tam Xoa, Ô Cật, Khổ Mặc, Cừu Cửu, Tiêu Mang. Phương Nguyên ẩn nhẫn, gom nguyên thạch.
// Cảnh xen Trung Châu: Hồ Tiên phúc địa mở, Phương Chính và Phượng Kim Hoàng leo Đãng Hồn Sơn.

CHAPTERS.q2_ngu={n:'Ngũ chuyển giáng lâm',title:'Quyển hai · Chương bảy · Ngũ chuyển giáng lâm',unit:'tuần',turns:8,bg:'scene_tam_xoa_mountain',cap:4,
  intro:'Tin Thiết Bá Tu chết lan khắp Nam Cương. Những kẻ thật sự đứng trên đỉnh bắt đầu để mắt tới Tam Xoa Sơn.',
  ask:'Tuần này làm gì?',
  canon:{1:'q2_ng_hotien',2:'q2_ng_nhuocnam',3:'q2_ng_mobach',4:'q2_ng_dangHon',5:'q2_ng_suybai',6:'q2_ng_ocat',7:'q2_ng_tieumang',8:'q2_ng_ket'},
  side:['q2_ng_phong','q2_ng_ruou','q2_ng_cuucuu'],
  spots:[
    {id:'ngan',x:24,y:62,g:'隐',n:'Ẩn nấp',d:'Thu liễm khí tức, xóa dấu vết.',run:()=>{S.susp=Math.max(0,S.susp-20);S.tamco+=Math.random()<.25?1:0;log('Ngươi nằm im trong hang. Chính đạo lùng sục qua đầu. Hiềm nghi −20.','sys')}},
    {id:'ngnui',x:62,y:40,g:'山',n:'Sườn núi',d:'Ma tu bị chính đạo đuổi, chém giết lẫn nhau.',loc:'tx_nui',foes:['matutx','matuNgu'],evP:.5,foeP:.75},
    {id:'nggom',x:44,y:78,g:'石',n:'Buôn bán ngầm',d:'Bán tin, bán cổ cho ma tu bị kẹt.',run:()=>{const n=rand(30,70);S.stones+=n;S.susp+=5;log(`Bán cổ và tin cho đám ma tu bị kẹt. +${n} nguyên thạch. Hiềm nghi +5.`,'gold')}},
    {id:'baicanh',x:34,y:36,g:'冰',n:'Hang núi',d:'Ở cạnh Bạch Ngưng Băng.',run:baiLesson},
    {id:'tuluyen',x:84,y:56,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:12,y:40,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'refine',minor:1,x:90,y:22,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EN,{
  matuNgu:{n:'Ma tu Tứ chuyển',hp:420,atk:[26,36],st:[80,120],bl:1,drop:.4,i:'Ma tu Tứ chuyển bị chính đạo đuổi khỏi Tam Xoa, đang tìm kẻ yếu hơn để trút giận.'},
  mobachtruy:{n:'Thiết Mộ Bạch',hp:3000,atk:[70,95],st:[0,0],bl:0,i:'Cựu tộc trưởng Thiết gia, Ngũ chuyển đỉnh phong, thiên tài Kim đạo. Kim quang của lão áp đảo cả dãy núi.'},
});
Object.assign(EAI,{matuNgu:{def:3,sk:'suppress'},mobachtruy:{def:10,sk:'thunder',boss:1}});
Object.assign(ART,{matuNgu:{g:'魔',sc:'forest',c:'#b890d6'},mobachtruy:{g:'金',sc:'forest',c:'#e0c060'}});
Object.assign(PORTRAIT,{matuNgu:'p_madutam',mobachtruy:'p_baitruonglao'});
Object.assign(DROP_POOL,{matuNgu:['kimcuong','tuongluc','mangluc','quyluc','hoathu']});
Object.assign(NPC,{
  mobach:{n:'Thiết Mộ Bạch',d:'Cựu tộc trưởng Thiết gia, Ngũ chuyển đỉnh, Kim đạo'},
  ocat:{n:'Vu Quỷ Ô Cật',d:'Ngũ chuyển đỉnh, Hồn đạo và Nô đạo, tử thù Thiết Mộ Bạch'},
  khomac:{n:'Khổ Mặc',d:'Ma đầu Ngũ chuyển, Cốt đạo'},
  cuucuu:{n:'Cừu Cửu',d:'Sát Nhân Quỷ Y: cứu một mạng phải giết một mạng'},
  tieumang:{n:'Tiêu Mang',d:'Tiêu gia, Tứ đỉnh, Quang đạo'},
  phongthienngu:{n:'Phong Thiên Ngữ',d:'Thiên tài luyện đạo Phong gia'},
  kimhoang:{n:'Phượng Kim Hoàng',d:'Thiên chi kiêu nữ Linh Duyên Trai, Trung Châu'},
});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{mobach:'铁',ocat:'巫',khomac:'骨',cuucuu:'医',tieumang:'光',phongthienngu:'风',kimhoang:'凰'});

Object.assign(EV,{
q2_ng_hotien:{canon:1,title:'Trung Châu · Thiên Thê Sơn',hint:'Hồ Tiên phúc địa mở',g:'狐',who:'phuongchinh',sc:'snow',
  text:()=>'Cách vạn dặm, ở Trung Châu, Thiên Thê Sơn mở Hồ Tiên phúc địa, truyền thừa của một Cổ Tiên Lục chuyển. Mười đại cổ phái cử đệ tử dưới ba mươi tuổi tới tranh. Thử thách: không dùng cổ, leo núi Đãng Hồn, ngọn núi hồng ngọc thổi ra gió làm rung hồn phách. Ai chạm vào Địa linh trên đỉnh trước thì là chủ. Trong số đó có Phương Chính, người ngươi tưởng đã chết.',
  choices:[{t:'(Ngươi không biết chuyện này)',eff:()=>{meet('phuongchinh');meet('kimhoang');S.f.hoTienMo=1;return 'Phương Chính mang theo hồn Thiên Hạc Thượng Nhân. Phượng Kim Hoàng, con gái hai Cổ Tiên, đứng đầu hàng.'}}]},
q2_ng_dangHon:{canon:1,title:'Trung Châu · Đãng Hồn Sơn',hint:'Leo Đãng Hồn',g:'魂',who:'kimhoang',sc:'snow',
  text:()=>'Tiếng chuông Đãng Hồn làm hồn phách rạn nứt. Ngụy Vô Thương ngã, Cổ Đình ngã. Phượng Kim Hoàng thức tỉnh Mộng Dực Tiên Cổ trong giấc mộng và bay vượt lên. Phương Chính được hồn sư phụ gánh bớt áp lực, bám sát phía sau.',
  choices:[{t:'(Cảnh này sẽ quan trọng về sau)',eff:()=>{S.f.dangHonNho=1;return 'Hình ảnh đỉnh Đãng Hồn Sơn: một ngọn núi hồng ngọc, một bé gái tai hồ ly trắng.'}}]},
q2_ng_nhuocnam:{canon:1,title:'Tiểu Thần Bộ',hint:'Nhược Nam lột xác',g:'若',who:'nhuocnam',
  text:()=>'Sau cú sốc mất Bá Tu, Thiết Nhược Nam cắt tóc, ánh mắt lạnh như sắt. Nàng thề báo thù cho cha và các trưởng lão, bỏ hẳn ảo tưởng chính nghĩa ngây thơ.',
  choices:[{t:'Ghi nhớ',eff:()=>{meet('nhuocnam');rel('nhuocnam',-40);S.f.nhuocnamLotXac=1;return 'Kẻ thù nguy hiểm nhất là kẻ thù đã học được bài học.'}}]},
q2_ng_mobach:{canon:1,title:'Thiết Mộ Bạch giáng lâm',hint:'Ngũ chuyển tới',g:'金',who:'mobach',
  text:()=>'Kim quang Ngũ chuyển đỉnh phong phủ kín Tam Xoa Sơn. Thiết Mộ Bạch, cựu tộc trưởng Thiết gia, đuổi sạch ma tu, độc chiếm ba cột sáng cho chính đạo. Lão đích thân dạy Nhược Nam nô đạo.',
  choices:()=>[
    {t:'Ẩn nhẫn, quan sát',canon:1,check:['tamco',15],bonus:()=>hasGu('liemtuc')?4:0,ok:()=>{meet('mobach');S.tamco++;return 'Ngươi thấy: thời gian mở Tam Vương ngày càng ngắn, ba cột sáng mờ dần. Phúc địa đang suy bại. Tâm cơ +1.'},fail:()=>{meet('mobach');fight('mobachtruy',{spare:.4,spareT:'Một ngón tay kim quang quét qua. Ngươi còn sống vì lão không coi ngươi đáng một đòn thứ hai.'});return 'Kim quang quét qua hang ngươi trốn.'}},
    {t:'Rời Tam Xoa một thời gian',drift:6,eff:()=>{meet('mobach');S.stones+=50;S.f.roiTamXoa=1;return 'Ngươi đi buôn ở mấy trại quanh núi. +50 nguyên thạch.'}},
  ]},
q2_ng_suybai:{canon:1,title:'Phúc địa suy bại',hint:'Cột sáng mờ dần',g:'衰',
  text:()=>'Ba cột sáng mờ nhạt dần. Tiên nguyên của phúc địa gần cạn, vách ngăn rạn nứt vì thiên kiếp liên miên. Không bao lâu nữa nó sẽ tan rã, chôn theo mọi thứ bên trong.',
  choices:[{t:'Nghĩ xem cái chết của một phúc địa mang lại gì',eff:()=>{S.ngo++;S.f.suyBai=1;return 'Ngộ tính +1.'}}]},
q2_ng_ocat:{canon:1,title:'Vu Quỷ Ô Cật',hint:'Ma đạo phản kích',g:'巫',who:'ocat',
  text:()=>'Bầu trời biến sắc, mây đen cuồn cuộn, tiếng quỷ khóc thần gào. Vu Quỷ Ô Cật, Ngũ chuyển đỉnh, tử thù Thiết Mộ Bạch, đập bàn tay mây đen xuống. Hai người giao chiến trên chín tầng mây. Sau đó Khổ Mặc cốt đạo và Cừu Cửu Sát Nhân Quỷ Y lần lượt tới.',
  choices:[{t:'Nhân lúc hỗn loạn, cướp túi của kẻ chết',tag:'ma',eff:()=>{meet('ocat');meet('khomac');meet('cuucuu');S.stones+=rand(80,140);return 'Cá lớn đánh nhau, cá nhỏ nhặt xác.'}},{t:'Nằm im',eff:()=>{meet('ocat');meet('khomac');meet('cuucuu');S.tamco++;return 'Tâm cơ +1.'}}]},
q2_ng_tieumang:{canon:1,title:'Tiêu Mang',hint:'Vách phúc địa rạn',g:'光',who:'tieumang',
  text:()=>'Tiêu gia phái Tiêu Mang, Tứ đỉnh quang đạo, kiêu căng. Sát chiêu ánh sáng của hắn có thể xuyên thủng vách không gian. Các cự đầu tranh nhau từng ải: Thiết Mộ Bạch vào Bạo Vương, Ô Cật chiếm Khuyển Vương, Khổ Mặc và Cừu Cửu vào Tín Vương.',
  choices:[{t:'Nhìn kỹ ánh sáng của hắn',eff:()=>{meet('tieumang');S.f.tieuMangNho=1;return 'Một thứ ánh sáng đủ sức làm lửa luyện tiên cổ. Ngươi nhớ nó.'}}]},
q2_ng_ket:{canon:1,title:'Tiếng gọi trong sương',hint:'Vào phúc địa',g:'龟',
  text:()=>'Ngươi lẻn vào sâu trong truyền thừa, qua khe nứt mà các cự đầu bỏ qua. Giữa màn sương xám, một giọng nói vang lên trong đầu ngươi.',
  choices:[{t:'Đi theo giọng nói',eff:()=>{chapEnd('q2_baquy');return 'Chương bảy kết thúc.'}}]},

q2_ng_phong:{title:'Phong Thiên Ngữ',g:'风',cond:()=>S.turn>=3,
  text:()=>'Tin đồn: Phong Thiên Ngữ, thiên tài luyện đạo Phong gia, vượt ải Tín Vương xuất sắc. Viêm Quân của Viêm gia bế quan tu Hư đạo thái cổ sau khi nghe tin về ngươi.',
  choices:[{t:'Ghi nhớ tên Phong Thiên Ngữ',eff:()=>{meet('phongthienngu');return 'Một đại sư luyện đạo. Sẽ có lúc cần.'}}]},
q2_ng_ruou:{title:'Rượu cực phẩm',g:'酒',cond:()=>(S.f.ruou||0)<4&&S.turn>=2,
  text:()=>'Một thương nhân lén bán rượu cực phẩm cho cổ sư bị kẹt ở Tam Xoa. Chuyện Nhân Tổ nói: người uống đủ bốn loại rượu cực phẩm thiên địa sẽ thai nghén Thần Du cổ.',
  choices:[{t:'Mua (80 thạch)',req:()=>S.stones>=80,reqT:'Cần 80 nguyên thạch',eff:()=>{S.stones-=80;S.f.ruou=(S.f.ruou||0)+1;return `Rượu cực phẩm: ${S.f.ruou}/4.`}},{t:'Thôi',eff:()=>'Ngươi đi qua.'}]},
q2_ng_cuucuu:{title:'Quỷ Y',g:'医',who:'cuucuu',cond:()=>S.met.cuucuu&&S.turn>=6,
  text:()=>'Cừu Cửu chữa cho một ma tu, rồi giết một người khác ngay trước mặt hắn để trả giá. Cứu một mạng phải giết một mạng.',
  choices:[{t:'Tránh xa lão',eff:()=>'Lão nhìn theo ngươi, mỉm cười.'}]},
q2r_ng_ruou2:{loc:'tx_nui',title:'Hũ rượu trong xác',g:'酒',cond:()=>(S.f.ruou||0)<4&&S.book===2&&S.chap==='q2_ngu',text:()=>'Trong túi một cổ sư chết có một hũ rượu cực phẩm còn niêm phong.',
  choices:[{t:'Lấy',eff:()=>{S.f.ruou=(S.f.ruou||0)+1;return `Rượu cực phẩm: ${S.f.ruou}/4.`}}]},
});
