// Quyển 2: dữ liệu cổ trùng, địch, nhân vật (nguồn: NGUYEN_TAC_Q2.md, số chương VN ghi trong mô tả khi cần).
// Nạp sau core.js. Chỉ bổ sung vào các bảng có sẵn của Quyển 1.

Object.assign(GU,{
  thiennguyen:{n:'Thiên Nguyên Bảo Liên',r:3,food:0,fn:'tự dưỡng',t:'passive',income:6,p:900,d:'Hoa sen ngọc sinh nguyên thạch. Mỗi lượt nhả ra 6 nguyên thạch. Bảo vật lấy từ Thanh Mao Sơn.'},
  dausuat:{n:'Đâu Suất Hoa',r:3,food:0,fn:'tự dưỡng',t:'passive',p:400,d:'Cổ chứa đồ. Trong hoa còn thuốc phàm, băng vải, nồi sắt, than, thịt khô mang từ Thanh Mao Sơn.'},
  boigiap:{n:'Bối Giáp Cổ',r:2,food:3,fn:'vảy cá',t:'guard',cost:9,p:130,d:'Hình xăm vảy sau lưng hóa thành mai: giảm 55% sát thương trong 2 lượt. Lấy từ cá sấu vương (VN 213).'},
  ngacluc:{n:'Ngạc Lực Cổ',r:2,food:4,fn:'thịt cá sấu',t:'passive',atk:7,p:150,d:'Lực cắn của cá sấu. Mọi đòn +7. Xương chưa đủ cứng thì dùng lâu sẽ tổn thương.'},
  tichhoi:{n:'Tích Hôi Cổ',r:3,food:4,fn:'tro than',t:'heal',healAmt:60,cost:14,p:320,d:'Cổ trị liệu Tam chuyển của cá sấu dung nham: tro nóng phủ vết thương, hồi 60 khí huyết.'},
  tieuloi:{n:'Tiêu Lôi Thổ Đậu',r:2,food:3,fn:'đất bùn',t:'attack',dmg:44,cost:12,aoe:1,p:160,d:'Hạt đậu đất nổ khi bị giẫm. Chôn thành bãi bẫy thì giết được cả đoàn người. Đất toàn xương thì vô dụng.'},
  cotthuong:{n:'Cốt Thương Cổ',r:2,food:3,fn:'sữa suối xương',t:'attack',dmg:34,cost:10,pierce:1,p:160,d:'Mũi thương xương bắn ra từ lòng bàn tay, xuyên giáp. Truyền thừa Hôi Cốt Tài Tử (VN 239).'},
  loatoan:{n:'Loa Toàn Cốt Thương',r:3,food:5,fn:'sữa suối xương',t:'attack',dmg:56,cost:16,pierce:1,p:400,d:'Cốt thương xoắn ốc. Bắn xong tan thành bụi trắng, không để lại dấu vết.'},
  cotthu:{n:'Cốt Thứ Cổ',r:3,food:5,fn:'tủy xương',t:'guard',cost:14,reflect:.35,p:420,d:'Xương đâm gai ra khỏi da: giảm sát thương và phản 35% sát thương. Tự làm mình bị thương.'},
  ngoccot:{n:'Ngọc Cốt Cổ',r:2,food:3,fn:'ngọc vụn',t:'passive',hp:25,p:140,d:'Xương hóa ngọc. Khí huyết tối đa +25. Luyện hóa đau tới ngất.'},
  thietcot:{n:'Thiết Cốt Cổ',r:3,food:4,fn:'thiết vụn',t:'passive',hp:40,atk:3,p:360,d:'Xương hóa sắt. Khí huyết tối đa +40, mọi đòn +3.'},
  votucdieu:{n:'Vô Túc Điểu',r:3,food:5,fn:'gió trời',t:'passive',fleeMod:.5,p:500,d:'Chim không chân, một ngày vạn dặm, chạm đất là chết. Chạy trốn dễ hơn nhiều.'},
  cotnhuc:{n:'Cốt Nhục Đoàn Viên',r:3,food:0,fn:'tình nghĩa',t:'passive',cult:.45,p:0,d:'Cổ hiếm luyện từ máu thịt người sống. Mượn không khiếu của người thân cận để tu luyện: tu luyện +45%. Lộ ra là cả thiên hạ truy sát.'},
  khieukhieu:{n:'Khiêu Khiêu Thảo',r:2,food:2,fn:'nước mưa',t:'passive',fleeMod:.25,p:90,d:'Cỏ bật nhảy. Chạy trốn dễ hơn.'},
  thanhnhiet:{n:'Thanh Nhiệt Cổ',r:1,food:2,fn:'lá bạc hà',t:'heal',healAmt:25,cure:1,cost:6,p:50,d:'Giải thi độc và nhiệt độc, hồi 25 khí huyết.'},
});
// Chợ theo chương
const Q2_SHOP={
  bachcot:['trilieu','dongbi','hungluc','ngocbi','thanhnhiet','khieukhieu','tuutrung'],
  thuongdoi:['trilieu','thanhnhiet','khieukhieu','thietbi','bachngoc','hacthi','tuutrung','xaloi1','xaloi2','liemtuc'],
};

Object.assign(EN,{
  toatien:{n:'Bầy cá Toa Tiễn',hp:50,atk:[5,9],st:[6,12],bl:1,i:'Cả bầy cá đầu nhọn như mũi tên lao lên từ dòng nước đục, húc vỡ bè gỗ.'},
  casauvuong:{n:'Cá sấu vương sáu chân',hp:150,atk:[11,17],st:[30,45],bl:3,drop:1,i:'Bách thú vương của sông Hoàng Long. Sáu chân quẫy nước, mõm dài hơn thân người.'},
  casaunham:{n:'Cá sấu dung nham',hp:170,atk:[14,21],st:[30,45],bl:2,drop:1,i:'Da đỏ như sắt nung. Nó phun cầu dung nham, rồi rút vào cột lửa để che thân.'},
  hienvien:{n:'Hiên Viên Thần Kê',hp:700,atk:[34,48],st:[0,0],bl:0,i:'Vạn thú vương loài chim, lông ngũ sắc. Mỗi lần nó vung cánh là một dải cầu vồng. Thứ này không phải để đánh.'},
  ongdoc:{n:'Bầy ong độc',hp:60,atk:[6,10],st:[3,8],bl:0,i:'Tiếng vo ve dày như mưa. Cả tổ ong kéo ra trả thù.'},
  thuyhoa:{n:'Trần Thúy Hoa',hp:150,atk:[12,18],st:[40,60],bl:1,drop:1,i:'Nữ ma tu áo vá, mặt xanh vì trúng độc mãng xà. Bà ta cười, chân khẽ dịch về phía bãi đất mới xới.'},
  khicuongtru:{n:'Khí Cương Trư',hp:120,atk:[11,17],st:[14,22],bl:2,i:'Heo rừng lông dựng như kim, quanh mình có một lớp khí cương. Cả gia đình nó kéo tới.'},
  gauden:{n:'Gấu đen trưởng thành',hp:150,atk:[13,20],st:[18,28],bl:2,i:'Gấu đen đứng thẳng trên hai chân, cao gấp rưỡi người.'},
  cotthu:{n:'Cốt thú Bạch Cốt Sơn',hp:130,atk:[12,18],st:[20,30],bl:1,i:'Thú toàn thân là xương trắng, lang thang giữa rừng xương.'},
  bachchienliep:{n:'Bách Chiến Liệp',hp:180,atk:[14,21],st:[30,45],bl:1,drop:.5,i:'Cao thủ trẻ nhất Bách gia, Nhị chuyển. Hắn muốn Bách Liên nhìn thấy hắn thắng.'},
  thietgiadoi:{n:'Đội truy tung Thiết gia',hp:200,atk:[15,22],st:[40,60],bl:1,drop:.6,i:'Năm cổ sư áo sắt, dẫn đầu là một công tử trẻ. Họ đang đuổi theo tàn dư ma đạo từ Thanh Mao Sơn.'},
  bachchienon:{n:'Gia lão Bách Chiến Ôn',hp:420,atk:[26,36],st:[60,90],bl:2,i:'Ông nội Bách Chiến Liệp, Tứ chuyển. Quanh người lão là Hỏa Nhân cổ: ngọn lửa hình người sẵn sàng đồng quy vu tận.'},
  phihau:{n:'Phỉ Hầu',hp:150,atk:[13,19],st:[20,30],bl:2,i:'Khỉ khổng lồ cao một trượng, lông vàng vằn đen, cánh tay trên to gấp đôi đùi người.'},
  cuongdienlang:{n:'Cuồng Điện Lang',hp:140,atk:[13,19],st:[18,26],bl:1,wolf:1,i:'Sói điện dẫn đầu bầy, mắt trắng dã vì điện chạy khắp thân.'},
  phituong:{n:'Bạch Vũ Phi Tượng',hp:320,atk:[24,32],st:[40,60],bl:3,i:'Voi phủ lông trắng, bay được. Ngà dài một trượng. Nó bổ nhào xuống đoàn người như một tảng tuyết.'},
  auphi:{n:'Âu Phi',hp:110,atk:[10,15],st:[20,30],bl:1,i:'Con trai Âu Dương Công, Nhị chuyển sơ kỳ. Hắn đạp cửa lều như chỗ không người.'},
  auduongcong:{n:'Âu Dương Công',hp:300,atk:[20,28],st:[60,90],bl:2,drop:.6,i:'Tam chuyển sơ kỳ, phó thủ lĩnh thương đội. Hắn tới đòi mạng cho con.'},
  bachmao:{n:'Bầy cương thi Bạch Mao',hp:100,atk:[10,15],st:[6,12],bl:0,i:'Xác chết lông trắng, chậm chạp, sợ nắng. Chúng được thả ra để làm cạn chân nguyên của người sống.'},
  hacmao:{n:'Cương thi Hắc Mao',hp:180,atk:[16,23],st:[20,30],bl:1,i:'Cương thi uống máu nhiều năm, lông đen, nhanh như báo.'},
});
Object.assign(EAI,{
  toatien:{sk:'charge',fast:1},casauvuong:{def:3,sk:'rage',boss:1},casaunham:{def:2,sk:'regen'},hienvien:{def:4,sk:'thunder',boss:1},
  ongdoc:{sk:'poison',fast:1},thuyhoa:{sk:'poison'},khicuongtru:{def:2,sk:'charge'},gauden:{def:2,sk:'rage'},cotthu:{def:3,sk:'regen'},
  bachchienliep:{sk:'charge'},thietgiadoi:{def:2,sk:'suppress'},bachchienon:{def:3,sk:'rage',boss:1},phihau:{sk:'rage'},
  cuongdienlang:{sk:'howl',fast:1},phituong:{def:3,sk:'charge',boss:1},auphi:{sk:'charge'},auduongcong:{def:2,sk:'suppress',boss:1},
  bachmao:{sk:'poison'},hacmao:{sk:'drain',fast:1},
});
Object.assign(ART,{
  toatien:{g:'鱼',sc:'forest',c:'#9fc7e8'},casauvuong:{g:'鳄',sc:'forest',c:'#8fa870'},casaunham:{g:'炎',sc:'fire',c:'#e0764e'},hienvien:{g:'鸡',sc:'forest',c:'#e8c86a'},
  ongdoc:{g:'蜂',sc:'forest',c:'#e8c86a'},thuyhoa:{g:'翠',sc:'forest',c:'#9fd6a8'},khicuongtru:{g:'猪',sc:'forest',c:'#d2ab82'},gauden:{g:'熊',sc:'forest',c:'#b3a695'},
  cotthu:{g:'骨',sc:'snow',c:'#e8e2d6'},bachchienliep:{g:'百',sc:'village',c:'#d6b890'},thietgiadoi:{g:'铁',sc:'village',c:'#aeb8c2'},bachchienon:{g:'火',sc:'fire',c:'#e0764e'},
  phihau:{g:'猴',sc:'forest',c:'#d8b060'},cuongdienlang:{g:'狼',sc:'forest',c:'#9fc7e8'},phituong:{g:'象',sc:'snow',c:'#eef2f4'},auphi:{g:'欧',sc:'village',c:'#b890d6'},
  auduongcong:{g:'欧',sc:'village',c:'#b890d6'},bachmao:{g:'尸',sc:'blood',c:'#e8e2d6'},hacmao:{g:'尸',sc:'blood',c:'#7a6f86'},
});
Object.assign(PORTRAIT,{toatien:'p_boar',casauvuong:'p_bear',casaunham:'p_bear',ongdoc:'p_boar',thuyhoa:'p_cultivator',khicuongtru:'p_boar',gauden:'p_bear',
  cotthu:'p_bear',bachchienliep:'p_cultivator',thietgiadoi:'p_giave',bachchienon:'p_gialao',phihau:'p_bear',cuongdienlang:'p_wolf',phituong:'p_bear',
  auphi:'p_cultivator',auduongcong:'p_gialao',bachmao:'p_blood',hacmao:'p_blood',hienvien:'p_wolfking'});
Object.assign(DROP_POOL,{casauvuong:['boigiap','ngacluc'],casaunham:['tichhoi'],thuyhoa:['tieuloi'],bachchienliep:['hungluc','dongbi'],
  thietgiadoi:['thietbi','liemtuc'],auduongcong:['thietbi','bachngoc','trilieu']});

Object.assign(NPC,{
  bainu:{n:'Bạch Ngưng Băng',d:'Sống lại thành nữ. Đi cùng ngươi vì Dương cổ'},
  thuyhoa:{n:'Trần Thúy Hoa',d:'Nông phụ nhặt được truyền thừa ma đạo'},
  bachtoc:{n:'Nữ tộc trưởng Bách gia',d:'Muốn biết nguyên tuyền Cổ Nguyệt ở đâu'},
  bachlien:{n:'Bách Liên',d:'Hoa khôi Bách gia, dùng cổ gây lo âu'},
  bachchienliep:{n:'Bách Chiến Liệp',d:'Cao thủ trẻ Bách gia'},
  daokho:{n:'Thiết Đao Khổ',d:'Đao khách Thiết gia, chính trực'},
  truongthon:{n:'Lão Trương',d:'Trưởng thôn phàm nhân dưới chân Tử U'},
  tamtu:{n:'Thương Tâm Từ',d:'Phó thủ lĩnh thương đội, phàm nhân không tư chất'},
  tieudiep:{n:'Tiểu Điệp',d:'Nha hoàn của Tâm Từ'},
  truongtru:{n:'Trương Trụ',d:'Cổ sư trị liệu Tam chuyển, hộ vệ của Tâm Từ'},
  auduongcong:{n:'Âu Dương Công',d:'Phó thủ lĩnh thương đội, Tam chuyển'},
  dinhhao:{n:'Đinh Hạo',d:'Thôn phu nhặt được truyền thừa cương thi'},
});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{bainu:'冰',thuyhoa:'翠',bachtoc:'百',bachlien:'莲',bachchienliep:'猎',daokho:'刀',truongthon:'村',tamtu:'慈',tieudiep:'蝶',truongtru:'柱',auduongcong:'欧',dinhhao:'尸'});
if(typeof WHO_ART!=='undefined')WHO_ART.bainu='art/p_bai.jpg';

Object.assign(MEM,{
  q2_casau:{n:'Yếu huyệt cá sấu vương',d:'Nó chỉ mở mõm ra khi cắn. Huyết Nguyệt làm nó chảy máu không ngừng.'},
  q2_thuyhoa:{n:'Bãi bẫy của Trần Thúy Hoa',d:'Bà ta chôn Tiêu Lôi Thổ Đậu quanh chỗ ngồi. Đừng bước theo đường bà ta chỉ.'},
  q2_hoicot:{n:'Mật đạo Hôi Cốt Tài Tử',d:'Biết sảnh nào là giả, biết cách gõ răng mở bí các.'},
  q2_bachgia:{n:'Mưu kế Bách gia',d:'Bách gia muốn dò nguyên tuyền của Cổ Nguyệt. Họ cho mồi rồi chờ.'},
  q2_thuongdoi:{n:'Thương đội liên hiệp',d:'Biết ai trong đoàn là người của Trần gia, ai của Trương gia.'},
  q2_dinhhao:{n:'Tâm sự của Đinh Hạo',d:'Biết Đinh Hạo nhận truyền thừa của Cương Vương đời hai và sợ bị đại sư huynh tìm tới.'},
});
Object.assign(DEATH_MEM,{casauvuong:'q2_casau',thuyhoa:'q2_thuyhoa',auduongcong:'q2_thuongdoi',hacmao:'q2_dinhhao'});
Object.assign(SHIELD_RED,{boigiap:.45,cotthu:.6});
Object.assign(CD,{boigiap:3,cotthu:3,tichhoi:3,thanhnhiet:3,cotthuong:1,loatoan:2,tieuloi:2});
