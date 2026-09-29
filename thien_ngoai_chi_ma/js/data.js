// Dữ liệu tĩnh: Thiên Ngoại Chi Ma - Cổ Giới Dị Hồn
const CH=['','Nhất','Nhị','Tam','Tứ','Ngũ','Lục'];
const GIAI=['Sơ','Trung','Cao','Đỉnh'];
const ESS=[null,{n:'thanh đồng',c:'#5fae8a'},{n:'xích thiết',c:'#c8664e'},{n:'bạch ngân',c:'#c9d3d6'}];
const MAXE=[0,60,120,200];
const NEED=[null,[50,65,80,100],[130,150,175,210],[320,360,400,450]];
const TUAN=['Thượng tuần','Trung tuần','Hạ tuần'];
const ATTR={tamco:'Tâm cơ',satphat:'Sát phạt',ngo:'Ngộ tính'};

// Thân phận xuất thân
const ORIGINS={
  cuyet:{
    id:'cuyet',n:'Chi phụ Cổ Nguyệt',icon:'🏯',clan:'Cổ Nguyệt',
    d:'Sinh ra trong sơn trại Cổ Nguyệt, gia cảnh bình thường. Cùng tham dự lễ khai khiếu với Phương Nguyên và Phương Chính.',
    stones:25,bonusAttr:{tamco:1},initGu:'kiemquang'
  },
  baigia:{
    id:'baigia',n:'Đệ tử Bạch gia',icon:'❄️',clan:'Bạch gia',
    d:'Thiếu niên Bạch gia sơn trại. Gia tộc giàu có về tài nguyên Băng đạo, đồng tộc với quái vật Bạch Ngưng Băng.',
    stones:45,bonusAttr:{ngo:1},initGu:'hanbang'
  },
  hunggia:{
    id:'hunggia',n:'Dũng sĩ Hùng gia',icon:'🐻',clan:'Hùng gia',
    d:'Gia tộc sùng bái Lực đạo và sức mạnh của gấu. Thể phách cường tráng, tính tình bộc trực hung hãn.',
    stones:20,bonusAttr:{satphat:2},initGu:'truluc'
  },
  tantu:{
    id:'tantu',n:'Thiếu niên thương đội',icon:'🐪',clan:'Tán tu',
    d:'Con nuôi của một cổ sư phàm nhân trong Thương đội Giả gia. Lang bạt khắp nơi, am hiểu mua bán trao đổi.',
    stones:75,bonusAttr:{tamco:2},initGu:'kimcham'
  }
};

// Thiên phú Thiên Ngoại Chi Ma
const OTHERWORLDLY_PERKS={
  science:{
    id:'science',n:'Tư Duy Khoa Học',icon:'💡',
    d:'Mang tri thức Trái Đất về vật lý, hóa học, sinh học. Ngộ tính +3, tỉ lệ sáng tạo sát chiêu và luyện cổ +20%.'
  },
  soul:{
    id:'soul',n:'Hồn Phách Dị Giới',icon:'🌌',
    d:'Linh hồn không thuộc về thế giới này. Kháng 50% sát thương hồn phách và ảo ảnh, ý chí bất khuất.'
  },
  spoilers:{
    id:'spoilers',n:'Tri Thức Tiền Tri (Biết Kịch Bản)',icon:'📜',
    d:'Đã từng đọc tiểu thuyết Cổ Chân Nhân! Biết rõ Phương Nguyên là ai, biết bí mật Hoa Tửu Hành Giả và lang triều.'
  }
};

// Cổ trùng
const GU={
  dihon:{n:'Dị Giới Hồn Ấn',r:1,food:0,fn:'không cần',t:'fate',d:'Bản mệnh cổ dị giới. Không tiêu hao nguyên thạch, giúp cảm ứng sát ý và phá vỡ sự thao túng của Túc Mệnh.'},
  
  // Kiếm đạo & Kim đạo
  kiemquang:{n:'Kiếm Quang Cổ',r:1,food:2,fn:'nguyệt lan',t:'attack',dmg:14,cost:6,p:30,d:'Phóng ra tia kiếm khí sắc lẹm, chém địch từ xa.'},
  kimcham:{n:'Kim Châm Cổ',r:1,food:2,fn:'quặng sắt',t:'attack',dmg:18,cost:8,pierce:1,p:45,d:'Bắn ra chùm kim châm bằng kim loại, xuyên thủng giáp nhẹ.'},
  toannhan:{n:'Toàn Nhận Cổ',r:2,food:4,fn:'quặng sắt',t:'attack',dmg:38,cost:14,p:150,d:'Lưỡi cưa sắt xoay tròn quanh cổ tay, xé rách da thịt trong cận chiến.'},
  kimthieng:{n:'Kim Quang Cổ',r:2,food:4,fn:'quặng vàng vụn',t:'attack',dmg:45,cost:18,pierce:1,p:180,d:'Kiếm mang hoàng kim uy lực kinh người.'},

  // Lực đạo
  truluc:{n:'Trư Lực Cổ',r:1,food:2,fn:'thịt thú',t:'passive',atk:4,p:30,d:'Ban cho cổ sư sức mạnh một con heo rừng. Mọi đòn đánh +4 sát thương.'},
  hungluc:{n:'Hùng Lực Cổ',r:1,food:3,fn:'thịt thú',t:'passive',atk:7,p:60,d:'Ban cho sức mạnh loài gấu đen. Mọi đòn đánh +7 sát thương.'},
  thietcot:{n:'Thiết Cốt Cổ',r:2,food:4,fn:'sắt gỉ',t:'guard',cost:10,p:130,d:'Xương cốt cứng như gang thép, giảm 65% sát thương nhận vào.'},
  nguuluc:{n:'Ngưu Lực Cổ',r:2,food:5,fn:'thảo mộc',t:'passive',atk:14,p:160,d:'Sức mạnh trâu rừng cuồn cuộn trong huyết quản.'},

  // Lôi & Phong đạo
  dienlang:{n:'Điện Lang Cổ',r:1,food:3,fn:'thịt sói',t:'attack',dmg:16,cost:7,p:40,d:'Phóng luồng điện quang làm tê liệt đối thủ.'},
  tatphong:{n:'Tật Phong Cổ',r:1,food:2,fn:'gió núi',t:'passive',fleeMod:.25,p:35,d:'Thân nhẹ như gió, dễ dàng né tránh và chạy trốn.'},
  loidinh:{n:'Lôi Đinh Cổ',r:2,food:4,fn:'quặng sét',t:'attack',dmg:36,cost:15,stun:1,p:160,d:'Đinh sét xuyên phá, gây choáng kẻ địch.'},

  // Băng & Thủy đạo
  hanbang:{n:'Hàn Băng Cổ',r:1,food:2,fn:'nước đá',t:'attack',dmg:13,cost:6,p:30,d:'Bắn băng tiễn gây tê buốt, giảm tốc độ đối thủ.'},
  banggiap:{n:'Băng Giáp Cổ',r:2,food:4,fn:'tuyết lạnh',t:'guard',cost:12,p:140,d:'Phủ lớp giáp băng quanh thân, giảm 60% sát thương và phản băng tiễn.'},

  // Phụ trợ & Cổ kinh điển
  tuutrung:{n:'Tửu Trùng',r:1,food:3,fn:'rượu',t:'passive',cult:.5,p:50,d:'Tinh luyện chân nguyên. Tốc độ tu luyện +50%.'},
  trilieu:{n:'Trị Liệu Cổ',r:1,food:2,fn:'thảo dược',t:'heal',cost:8,p:40,d:'Hồi phục khí huyết nhanh chóng trong chiến đấu.'},
  ngocbi:{n:'Ngọc Bì Cổ',r:1,food:3,fn:'ngọc thạch vụn',t:'guard',cost:5,p:45,d:'Da hóa ngọc bích, giảm 60% sát thương 2 lượt.'},
  xaloi1:{n:'Thanh Đồng Xá Lợi Cổ',r:1,food:0,fn:'không cần',t:'use',p:150,d:'Tăng một tiểu cảnh giới Nhất chuyển.'},
  xaloi2:{n:'Xích Thiết Xá Lợi Cổ',r:2,food:0,fn:'không cần',t:'use',p:260,d:'Tăng một tiểu cảnh giới Nhị chuyển.'},
};

const SHOP=['kiemquang','kimcham','truluc','dienlang','tatphong','hanbang','trilieu','ngocbi'];
const CARAVAN=['xaloi1','xaloi2','toannhan','hungluc','thietcot','tuutrung','loidinh','banggiap'];
const WILD=['kiemquang','truluc','dienlang','hanbang','trilieu'];

// Công thức hợp luyện
const RECIPES=[
  {id:'toannhan',from:'kimcham',st:50,extraGu:'kimcham',ch:.65,d:'Kim Châm Cổ + Kim Châm Cổ + 50 nguyên thạch'},
  {id:'thietcot',from:'truluc',st:60,extraGu:'hungluc',ch:.6,d:'Trư Lực Cổ + Hùng Lực Cổ + 60 nguyên thạch'},
  {id:'loidinh',from:'dienlang',st:70,ch:.65,d:'Điện Lang Cổ + 70 nguyên thạch quặng sét'},
  {id:'banggiap',from:'hanbang',st:60,extraGu:'ngocbi',ch:.7,d:'Hàn Băng Cổ + Ngọc Bì Cổ + 60 nguyên thạch'},
];

// Sát Chiêu
const COMBOS=[
  {id:'kiem_bao',n:'Kiếm Phong Bạo Kích',req:['kiemquang','tatphong'],cost:16,dmg:48,pierce:1,d:'Gió cuốn kiếm khí tạo thành lốc xoáy sắc bén.'},
  {id:'hung_thiet',n:'Man Hùng Liệt Địa',req:['hungluc','thietcot'],cost:18,dmg:52,stun:1,d:'Cự lực gấu đen dộng đất làm rung chuyển, gây choáng 1 lượt.'},
  {id:'loi_cham',n:'Lôi Châm Phá Giáp',req:['dienlang','kimcham'],cost:18,dmg:55,stun:1,pierce:1,d:'Kim châm mang điện xuyên thủng phòng ngự.'},
  {id:'bang_phong',n:'Hàn Băng Phong Tỏa',req:['hanbang','banggiap'],cost:20,dmg:44,shield:3,reflect:.25,d:'Băng tuyết hộ thể vừa đóng băng vừa phản sát thương.'},
];

const EN={
  heorung:{n:'Heo rừng Thanh Mao',hp:35,atk:[4,8],st:[4,10],bl:1,i:'Một con heo rừng mắt đỏ lao ra từ bụi rậm.'},
  dienlang:{n:'Điện Lang',hp:54,atk:[6,12],st:[8,15],bl:1,wolf:1,i:'Điện Lang lông xám, nanh vuốt lóe ánh sét.'},
  hachung:{n:'Hắc Hùng khổng lồ',hp:100,atk:[10,16],st:[15,25],bl:2,i:'Gấu đen khổng lồ gầm vang, vả móng vuốt ngàn cân.'},
  tanbinh:{n:'Ma đạo Cổ sư lưu lạc',hp:75,atk:[8,14],st:[20,35],bl:1,drop:.35,i:'Một Cổ sư áo rách nhìn ngươi với ánh mắt thèm thuồng.'},
  hoctro:{n:'Thiếu niên Cổ sư',hp:50,atk:[5,9],st:[15,25],bl:0,i:'Thiếu niên đồng trang lứa rút cổ trùng ra so tài.'},
  macbac:{n:'Cổ Nguyệt Mạc Bắc',hp:65,atk:[7,12],st:[10,18],bl:0,i:'Mạc Bắc hất cằm: "Kẻ ngoại lai mà cũng dám ngông?"'},
  baitrinhsat:{n:'Trinh sát Bạch gia',hp:115,atk:[10,16],st:[25,40],bl:1,i:'Trinh sát áo trắng phi thân qua ngọn trúc.'},
  loiquan:{n:'Lôi Quan Lang',hp:175,atk:[12,18],st:[45,60],bl:3,wolf:1,i:'Lôi Quan Lang bờm tích tụ điện quang dữ dội.'},
  langvuong:{n:'Lôi Quan Lang Vương',hp:280,atk:[16,25],st:[90,130],bl:6,wolf:1,i:'Lang Vương gầm rống, sấm chớp giáng xuống xung quanh.'},
  tuukhoi:{n:'Tửu Khôi canh động',hp:135,atk:[9,16],st:[0,0],bl:0,i:'Thực thể bằng vò rượu chuyển động bảo vệ bí mật Hoa Tửu.'},
  huyetkhoi:{n:'Huyết khôi đáy vực',hp:220,atk:[14,22],st:[40,65],bl:6,i:'Huyết dịch ngưng tụ thành hình nhân sát khí ngút trời.'},
  phuongnguyen_boss:{n:'Cổ Nguyệt Phương Nguyên',hp:320,atk:[18,28],st:[100,150],bl:5,i:'Phương Nguyên nheo mắt nhìn ngươi. Hắn không nói lời thừa, rút Nguyệt Quang Cổ xuất chiêu đoạt mạng!'},
  bai_boss:{n:'Bạch Ngưng Băng',hp:310,atk:[18,27],st:[0,0],bl:0,i:'Bạch Ngưng Băng cười lạnh: "Ngươi cũng thú vị đấy, tiếp chiêu của ta xem!"'},
};

// Danh sách NPC và thông số quan hệ
const NPC={
  phuongnguyen:{n:'Phương Nguyên',title:'Ma Đầu Trọng Sinh',d:'500 năm kinh nghiệm ma đạo. Duy lý, vô tình, coi trời bằng vung.',susp:0,rel:0},
  bai:{n:'Bạch Ngưng Băng',title:'Bắc Minh Băng Phách',d:'Thiên tài Bạch gia, lạnh lùng, tìm kiếm kích thích sinh tử.',rel:0},
  phuongchinh:{n:'Phương Chính',title:'Giáp Đẳng Thiên Tài',d:'Em trai Phương Nguyên, tính tình đơn thuần bộc trực.',rel:10},
  thanhthu:{n:'Cổ Nguyệt Thanh Thư',title:'Đội Trưởng Hiền Từ',d:'Gia tộc trung thành, luôn che chở hậu bối.',rel:10},
  giaphu:{n:'Giả Phú',title:'Chủ Thương Đội',d:'Thương nhân giảo quyệt, đề cao chữ tín và lợi nhuận.',rel:0},
  toctruong:{n:'Cổ Nguyệt Bác',title:'Tộc Trưởng',d:'Lão mưu thâm toán, đặt gia tộc lên trên hết.',rel:0},
};
