// Dữ liệu tĩnh: cảnh giới, cổ trùng, kẻ địch, nhân vật, ký ức.

// Hàm asset(): tất cả đường dẫn ảnh đi qua đây.
// Nếu assets/local/manifest.js tồn tại (chỉ trên máy), dùng ảnh cá nhân.
// Trên link công khai, manifest.js không có → dùng tranh CC0 mặc định.
function asset(path){
  const m=window.LOCAL_ASSETS;
  return 'assets/'+(m&&m[path]?m[path]:path);
}
const CH=['','Nhất','Nhị','Tam','Tứ','Ngũ','Lục'];
const GIAI=['Sơ','Trung','Cao','Đỉnh'];
const ESS=[null,{n:'thanh đồng',c:'#5fae8a'},{n:'xích thiết',c:'#c8664e'},{n:'bạch ngân',c:'#c9d3d6'}];
const MAXE=[0,50,100,180];
const NEED=[null,[80,95,110,130],[220,260,300,340],[300,340,380,420]];
const TUAN=['Thượng tuần','Trung tuần','Hạ tuần'];
const ATTR={tamco:'Tâm cơ',satphat:'Sát phạt',ngo:'Ngộ tính'};

// t: attack | guard | heal | passive | use | fate
const GU={
  xuanthu:{n:'Xuân Thu Thiền',r:6,food:0,fn:'quang âm',t:'fate',d:'Bản mệnh cổ, Lục chuyển. Khi ngươi chết, nó nghịch chuyển quang âm, đưa ngươi về lễ khai khiếu. Tu vi, nguyên thạch, cổ trùng đều mất, chỉ ký ức còn lại.'},
  nguyetquang:{n:'Nguyệt Quang Cổ',r:1,food:2,fn:'nguyệt lan',t:'attack',dmg:12,cost:6,p:25,d:'Phóng nguyệt nhận lam nhạt chém địch.'},
  tuutrung:{n:'Tửu Trùng',r:1,food:3,fn:'rượu',t:'passive',cult:.5,p:45,d:'Tinh luyện chân nguyên. Tu luyện +50%.'},
  tuvi:{n:'Tứ Vị Tửu Trùng',r:3,food:5,fn:'tứ vị tửu',t:'passive',cult:1.2,p:150,d:'Tửu trùng đã hấp thu chua, ngọt, đắng, cay. Tu luyện +120%.'},
  bachthi:{n:'Bạch Thỉ Cổ',r:1,food:2,fn:'thịt thú',t:'passive',atk:3,p:30,d:'Sức một con heo rừng. Mọi đòn +3.'},
  hacthi:{n:'Hắc Thỉ Cổ',r:1,food:3,fn:'thịt thú',t:'passive',atk:5,p:55,d:'Sức heo đen. Mọi đòn +5.'},
  ngocbi:{n:'Ngọc Bì Cổ',r:1,food:3,fn:'ngọc thạch vụn',t:'guard',cost:5,p:45,d:'Da hóa ngọc: giảm 60% sát thương trong 2 lượt.'},
  thietbi:{n:'Thiết Bì Cổ',r:2,food:4,fn:'thiết vụn',t:'guard',cost:10,p:120,d:'Da hóa thiết giáp, giảm 65% sát thương trong 2 lượt.'},
  thienbong:{n:'Thiên Bồng Cổ',r:3,food:7,fn:'thịt thú',t:'guard',cost:22,p:360,d:'Bảo hộ chí bảo Tam chuyển: giảm 80% sát thương trong 3 lượt, phản 25% sát thương.'},
  trilieu:{n:'Trị Liệu Cổ',r:1,food:2,fn:'thảo dược',t:'heal',cost:8,p:40,d:'Hồi phục khí huyết trong chiến đấu.'},
  huyetnguyet:{n:'Huyết Nguyệt Cổ',r:2,food:5,fn:'máu tươi',t:'attack',dmg:32,cost:14,p:140,d:'Nguyệt nhận nhuốm máu, xé toạc thân địch.'},
  nguyetmang:{n:'Nguyệt Mang Cổ',r:2,food:4,fn:'nguyệt lan',t:'attack',dmg:42,cost:16,pierce:1,p:160,d:'Nguyệt nhận lam biếc kéo dài, xuyên thủng mọi giáp trụ.'},
  uguang:{n:'U Quang Cổ',r:1,food:2,fn:'nguyệt lan',t:'passive',p:60,d:'Ánh sáng lam lân tinh mờ ảo, nguyên liệu hợp luyện Nguyệt Mang Cổ.'},
  diathinh:{n:'Địa Thính Nhục Nhĩ Thảo',r:2,food:4,fn:'thịt tươi',t:'passive',p:140,scout:1,d:'Cấy vào tai, thính lực tăng vọt. Giúp nhận biết cơ duyên trên núi và né tránh phục kích.'},
  cuongnham:{n:'Cương Nham Cổ',r:1,food:2,fn:'khoáng thạch',t:'guard',cost:6,p:50,d:'Da hóa nham thạch thô ráp, giảm 50% sát thương trong 2 lượt.'},
  huyetlo:{n:'Huyết Lô Cổ',r:4,food:0,fn:'máu người cùng huyết mạch',t:'fate',p:500,d:'Tứ chuyển bí cổ của Huyết Hải lão tổ. Luyện chết người cùng huyết mạch trong lò máu để nâng vĩnh viễn tư chất không khiếu.'},
  bachngoc:{n:'Bạch Ngọc Cổ',r:2,food:4,fn:'bạch ngọc vụn',t:'guard',cost:9,p:150,d:'Toàn thân phủ một lớp bạch ngọc sáng như sứ: giảm 60% sát thương trong 2 lượt. Cổ phòng ngự Nhị chuyển.'},
  hungluc:{n:'Hùng Lực Cổ',r:1,food:3,fn:'thịt thú',t:'passive',atk:6,p:65,d:'Cổ sức mạnh của Hùng gia, ban sức một con gấu. Mọi đòn +6.'},
  liemtuc:{n:'Liễm Tức Cổ',r:1,food:2,fn:'sương đêm',t:'passive',p:70,d:'Thu liễm khí tức, xóa dấu vết. Hiềm nghi mỗi tuần giảm thêm 5.'},
  xaloi1:{n:'Thanh Đồng Xá Lợi Cổ',r:1,food:0,fn:'không cần',t:'use',p:150,d:'Dùng một lần: Nhất chuyển tăng một tiểu cảnh giới.'},
  xaloi2:{n:'Xích Thiết Xá Lợi Cổ',r:2,food:0,fn:'không cần',t:'use',p:260,d:'Dùng một lần: Nhị chuyển tăng một tiểu cảnh giới.'},

  // Cổ trùng mới từ Cổ Chân Nhân (thuvienanime)
  tieuguang:{n:'Tiểu Quang Cổ',r:1,food:2,fn:'cánh hoa',t:'passive',atk:4,p:35,d:'Phụ trợ quang đạo của Cổ Nguyệt tộc. Tăng uy lực cho mọi đòn công kích nguyệt nhận thêm +4.'},
  toanphong:{n:'Toàn Phong Cổ',r:1,food:2,fn:'phong sương',t:'attack',dmg:16,cost:7,p:40,d:'Bắn ra luồng gió xoáy làm chao đảo kẻ địch. Có thể hợp luyện thành Nguyệt Toàn Cổ.'},
  dongbi:{n:'Đồng Bì Cổ',r:1,food:3,fn:'quặng đồng',t:'guard',cost:5,p:40,d:'Da hóa đồng bì: giảm 55% sát thương trong 2 lượt. Tiêu chuẩn của Cổ sư cận chiến.'},
  thanhti:{n:'Thanh Ti Cổ',r:1,food:2,fn:'nước mưa',t:'guard',cost:6,p:35,d:'Phóng ra tơ xanh quấn thân phòng hộ, giảm 50% sát thương trong 2 lượt.'},
  nguyettoan:{n:'Nguyệt Toàn Cổ',r:2,food:4,fn:'nguyệt lan và gió',t:'attack',dmg:38,cost:13,pierce:1,p:155,d:'Tuyệt kỹ của Cổ Nguyệt Thanh Thư. Nguyệt nhận bích lục lượn vòng cung, xuyên thủng mọi giáp trụ.'},
  nguyetngan:{n:'Nguyệt Ngân Cổ',r:2,food:4,fn:'ngân khoáng',t:'attack',dmg:40,cost:14,p:150,d:'Nguyệt nhận ánh bạc sắc lạnh, tầm phóng xa gấp đôi, chém nát hộ thể địch.'},
  nguyetnghe:{n:'Nguyệt Nghê Thường',r:2,food:4,fn:'cánh hoa',t:'guard',cost:10,p:160,d:'Khăn lụa ánh trăng dệt bằng nguyệt quang và ngọc bì: giảm 65% sát thương trong 2 lượt.'},
  bangdao:{n:'Băng Đao Cổ',r:2,food:4,fn:'băng sương',t:'attack',dmg:36,cost:12,slow:.2,p:145,d:'Cổ trùng cận chiến của Bạch Ngưng Băng. Chém ra đao băng sắc lạnh, hàn khí làm suy yếu đòn công của địch.'},
  thuytrao:{n:'Thủy Tráo Cổ',r:2,food:3,fn:'nước suối ngọt',t:'guard',cost:8,p:135,d:'Màn cầu nước chảy xiết phân tán xung lực: giảm 60% sát thương trong 2 lượt, tiêu hao chân nguyên cực thấp.'},
  anlan:{n:'Ẩn Lân Cổ',r:2,food:3,fn:'vảy cá',t:'passive',scout:1,fleeMod:.2,p:140,d:'Cổ trùng trinh sát Bạch gia. Phủ một lớp vảy tàng hình hòa vào cảnh vật, tăng tỉ lệ trốn thoát và giảm hiềm nghi.'},
  hoalo:{n:'Hỏa Lô Cổ',r:2,food:4,fn:'than lửa',t:'guard',cost:9,reflect:.2,p:130,d:'Cổ bảo hộ của Cổ Nguyệt Xích Sơn. Hỏa khí ấm áp xua tan hàn khí, giảm 50% sát thương và phản 20% sát thương lửa.'},
  cuudiep:{n:'Cửu Diệp Sinh Cơ Thảo',r:2,food:0,fn:'chân nguyên',t:'heal',healAmt:50,cure:1,cost:14,p:280,d:'Kỳ trân của Hoa Tửu. Mỗi tuần tự ngưng kết một phiến Sinh Cơ Diệp (linh dược). Trong chiến đấu hồi 50 khí huyết và giải độc.'},
  cuxikimngo:{n:'Cứ Xỉ Kim Ngô',r:3,food:6,fn:'thịt tươi và thiết khí',t:'attack',dmg:58,cost:20,bleed:3,p:380,d:'Rết khổng lồ răng cưa vàng kim của Hoa Tửu Hành Giả. Hai hàng răng cưa xoay tàn khốc, xẻ toạc giáp thịt địch gây Chảy Máu dữ dội.'},
  mokmi:{n:'Mộc Mị Cổ',r:3,food:5,fn:'lá cổ thụ',t:'guard',cost:18,p:350,d:'Cấm cổ của Cổ Nguyệt tộc. Cổ sư tạm thời hóa thân Thụ Tinh: giảm 85% sát thương và phản 30% chấn động trong 3 lượt.'},
  daosihuyetbuc:{n:'Đao Sí Huyết Bức Cổ',r:3,food:6,fn:'máu tươi',t:'attack',dmg:52,cost:18,lifesteal:.35,p:420,d:'Bầy dơi cánh đao huyết sắc của Huyết Hải lão tổ. Bắn ra đàn dơi cắn xé địch, hút 35% sát thương gây ra phản bổ khí huyết.'},
  xaloi3:{n:'Bạch Ngân Xá Lợi Cổ',r:3,food:0,fn:'không cần',t:'use',p:480,d:'Dùng một lần: Tam chuyển tăng trực tiếp một tiểu cảnh giới.'},
};

const SHOP=['nguyetquang','tuutrung','bachthi','hacthi','ngocbi','trilieu','cuongnham','hungluc','tieuguang','toanphong','dongbi','thanhti'];
const CARAVAN=['xaloi1','xaloi2','xaloi3','hacthi','thietbi','diathinh','uguang','tuutrung','ngocbi','trilieu','liemtuc','hungluc','tieuguang','toanphong','dongbi','thanhti','nguyetngan','thuytrao','bangdao','hoalo','anlan'];
const WILD=['bachthi','ngocbi','trilieu','nguyetquang','cuongnham','toanphong','dongbi','thanhti'];

// Công thức hợp luyện cổ trùng
const RECIPES=[
  {id:'tuvi',from:'tuutrung',st:30,wine:1,bl:0,ch:.65,d:'Tửu Trùng + 1 tứ vị tửu + 30 nguyên thạch'},
  {id:'huyetnguyet',from:'nguyetquang',st:60,wine:0,bl:6,ch:.55,d:'Nguyệt Quang Cổ + 6 huyết khí + 60 nguyên thạch'},
  {id:'nguyetmang',from:'nguyetquang',st:50,wine:0,bl:0,extraGu:'uguang',ch:.65,d:'Nguyệt Quang Cổ + U Quang Cổ + 50 nguyên thạch'},
  {id:'nguyettoan',from:'nguyetquang',st:55,wine:0,bl:0,extraGu:'toanphong',ch:.65,d:'Nguyệt Quang Cổ + Toàn Phong Cổ + 55 nguyên thạch'},
  {id:'nguyetngan',from:'nguyetquang',st:50,wine:0,bl:0,extraGu:'cuongnham',ch:.65,d:'Nguyệt Quang Cổ + Cương Nham Cổ + 50 nguyên thạch'},
  {id:'nguyetnghe',from:'ngocbi',st:55,wine:0,bl:0,extraGu:'nguyetquang',ch:.65,d:'Ngọc Bì Cổ + Nguyệt Quang Cổ + 55 nguyên thạch'},
  {id:'thietbi',from:'ngocbi',st:40,wine:0,bl:0,ch:.7,d:'Ngọc Bì Cổ + 40 nguyên thạch'},
  {id:'thuytrao',from:'trilieu',st:45,wine:0,bl:0,extraGu:'ngocbi',ch:.7,d:'Trị Liệu Cổ + Ngọc Bì Cổ + 45 nguyên thạch'},
  {id:'bangdao',from:'nguyetquang',st:60,wine:0,bl:3,extraGu:'cuongnham',ch:.6,d:'Nguyệt Quang Cổ + Cương Nham Cổ + 3 huyết khí + 60 nguyên thạch'},
  {id:'anlan',from:'liemtuc',st:50,wine:0,bl:0,extraGu:'ngocbi',ch:.65,d:'Liễm Tức Cổ + Ngọc Bì Cổ + 50 nguyên thạch'},
  {id:'thienbong',from:'thietbi',st:100,wine:0,bl:0,extraGu:'hacthi',ch:.6,d:'Thiết Bì Cổ + Hắc Thỉ Cổ + 100 nguyên thạch'},
  {id:'cuxikimngo',from:'thietbi',st:120,wine:0,bl:5,extraGu:'hacthi',ch:.55,d:'Thiết Bì Cổ + Hắc Thỉ Cổ + 5 huyết khí + 120 nguyên thạch'},
  {id:'mokmi',from:'thanhti',st:110,wine:0,bl:0,extraGu:'cuongnham',ch:.55,d:'Thanh Ti Cổ + Cương Nham Cổ + 110 nguyên thạch'},
];

// Sát Chiêu Sơ Giai (Combo Gu)
const COMBOS=[
  {id:'hung_tram',n:'Hùng Lực Nguyệt Trảm',req:['hungluc','nguyetquang'],cost:14,dmg:34,stun:1,d:'Sức gấu dồn vào nguyệt nhận, chém choáng kẻ địch 1 lượt.'},
  {id:'huyet_tram',n:'Huyết Nguyệt Trảm',req:['huyetnguyet','hacthi'],cost:22,dmg:56,bleed:3,d:'Nguyệt nhận đẫm máu mang cự lực, gây Chảy Máu liên tục 3 lượt.'},
  {id:'man_luc',n:'Man Lực Húc Kích',req:['bachthi','ngocbi'],cost:12,dmg:28,stun:1,shield:2,d:'Da ngọc va chạm toàn lực, làm choáng kẻ địch 1 lượt và nhận giáp.'},
  {id:'nguyet_xa',n:'Nguyệt Mang Xuyên Kích',req:['nguyetmang'],cost:20,dmg:66,pierce:1,d:'Bắn luồng nguyệt mang cực hạn xuyên thấu mọi phòng thủ.'},
  {id:'thien_khue',n:'Thiên Bồng Hộ Thể',req:['thienbong'],cost:25,shield:3,reflect:.35,d:'Triệu hoán hư ảnh bạch trư bảo hộ, phản phệ sát thương dữ dội.'},
  {id:'nguyet_toan_xa',n:'Nguyệt Toàn Xuyên Kích',req:['nguyettoan','hungluc'],cost:22,dmg:62,pierce:1,stun:1,d:'Nguyệt nhận bích lục mang cự lực xé gió, xuyên giáp và làm choáng địch 1 lượt.'},
  {id:'bang_trao_ho',n:'Băng Lam Thủy Thuẫn',req:['bangdao','thuytrao'],cost:18,shield:2,reflect:.25,d:'Màn nước kết băng, giảm 75% sát thương trong 2 lượt và phản băng thương.'},
  {id:'kim_ngo_tram',n:'Kim Ngô Phệ Thể',req:['cuxikimngo','hacthi'],cost:26,dmg:78,bleed:4,d:'Cưa rết vàng khổng lồ kết hợp cự lực xé toạc thân thể địch, gây Chảy Máu dữ dội.'},
  {id:'huyet_duc_phong',n:'Huyết Bức Thực Khí',req:['daosihuyetbuc','huyetnguyet'],cost:24,dmg:68,lifesteal:.4,d:'Đàn dơi đao huyết sắc tắm trong nguyệt ảnh đỏ rực, hút 40% sát thương hồi phục khí huyết.'},
];

// Phường Đoán Thạch (Thương đội)
const STONE_WEEKLY=2; // mỗi tuần quầy chỉ bán 2 khối đá
const STONES_GAMBLE=[
  {id:'thach_re',n:'Bình Nhược Thạch',price:15,dc:10,goodP:.5,d:'Đá sông nhẵn bóng, lớp ngoài bình thường. Rẻ nhưng rủi ro cao.'},
  {id:'thach_truc',n:'Thanh Trúc Thạch',price:40,dc:13,goodP:.6,d:'Hóa thạch rễ trúc ngàn năm, tỏa ra linh khí thoang thoảng.'},
  {id:'thach_huyet',n:'Huyết Tinh Cổ Thạch',price:85,dc:15,goodP:.66,d:'Đá cổ màu đỏ sẫm khai quật từ cổ mộ. Thường chứa cổ trùng quý hiếm.'},
];

const EN={
  heorung:{n:'Heo rừng Thanh Mao',hp:32,atk:[4,8],st:[4,9],bl:1,i:'Một con heo rừng nanh vàng lao ra từ bụi trúc.'},
  dienlang:{n:'Điện Lang',hp:52,atk:[6,11],st:[8,14],bl:1,wolf:1,i:'Điện Lang lông xám, móng lóe điện quang, gầm gừ chắn lối.'},
  hachung:{n:'Hắc Hùng',hp:85,atk:[9,15],st:[14,22],bl:2,i:'Hắc Hùng đứng thẳng, cao gấp đôi người.'},
  tanbinh:{n:'Cổ sư lưu lạc',hp:60,atk:[8,13],st:[20,32],bl:1,drop:.35,i:'Một Cổ sư ma đạo áo rách chặn đường, mắt đầy tham lam.'},
  hoctro:{n:'Đám học trò Nhất chuyển',hp:55,atk:[5,9],st:[18,28],bl:0,i:'Ba bốn học trò rút cổ, vừa sợ vừa giận.'},
  macbac:{n:'Cổ Nguyệt Mạc Bắc',hp:62,atk:[7,11],st:[8,15],bl:0,i:'Mạc Bắc của Mạc gia hất hàm: "Bính đẳng mà cũng dám ngông?"'},
  cosusay:{n:'Cổ sư say rượu',hp:40,atk:[4,8],st:[3,8],bl:0,i:'Gã Cổ sư say khướt đập vỡ bàn, rút cổ ra.'},
  hunggia:{n:'Cổ sư Hùng gia',hp:85,atk:[8,13],st:[20,30],bl:1,drop:.3,i:'Cổ sư Hùng gia lùi một bước, tay đặt lên túi cổ.'},
  sontac:{n:'Sơn tặc Cổ sư',hp:60,atk:[6,10],st:[10,18],bl:1,i:'Bọn sơn tặc từ hai bên vách núi nhảy xuống.'},
  baitrinhsat:{n:'Trinh sát Bạch gia',hp:110,atk:[10,15],st:[25,35],bl:1,i:'Trinh sát Bạch gia áo trắng đứng trên cành cây, cười lạnh.'},
  kimsinh:{n:'Giả Kim Sinh',hp:95,atk:[8,13],st:[40,60],bl:2,drop:.6,i:'Giả Kim Sinh nhận ra có điều bất thường, quay phắt lại.'},
  tuukhoi:{n:'Tửu Khôi thủ động',hp:100,atk:[9,15],st:[0,0],bl:0,i:'Con rối ghép từ những vò rượu vỡ tự đứng dậy canh cửa động.'},
  dlbay:{n:'Bầy Điện Lang',hp:140,atk:[9,14],st:[30,40],bl:2,wolf:1,i:'Hàng chục đôi mắt xanh lục tràn qua tường trại.'},
  loiquan:{n:'Lôi Quan Lang',hp:170,atk:[11,17],st:[40,55],bl:3,wolf:1,i:'Lôi Quan Lang, sừng lôi điện trên đầu, bước ra khỏi màn mưa.'},
  langvuong:{n:'Lôi Quan Lang Vương',hp:260,atk:[15,23],st:[90,120],bl:6,wolf:1,i:'Sói chúa gầm lên. Sấm sét cuồn cuộn quanh thân nó.'},
  gialao:{n:'Học đường gia lão',hp:330,atk:[19,29],st:[120,160],bl:4,i:'Gia lão phất tay áo. Không khí trong từ đường đông cứng.'},
  bai:{n:'Bạch Ngưng Băng',hp:300,atk:[18,28],st:[0,0],bl:0,i:'Hàn khí lan ra. Bạch Ngưng Băng mỉm cười như gặp được món đồ chơi mới.'},
  huyetkhoi:{n:'Huyết khôi',hp:210,atk:[13,21],st:[40,60],bl:6,i:'Máu dưới đáy hang cuộn lên, ngưng thành hình người.'},
  baicosu:{n:'Cổ sư Bạch gia',hp:150,atk:[12,18],st:[30,45],bl:2,i:'Cổ sư Bạch gia xông vào con hẻm, băng tiễn bay rợp trời.'},
  baitruonglao:{n:'Gia lão Bạch gia',hp:360,atk:[18,27],st:[100,140],bl:5,i:'Một gia lão Bạch gia Tam chuyển chặn con đường cuối cùng xuống núi.'},
};

const NPC={
  phuongchinh:{n:'Phương Chính',d:'Em trai, Giáp đẳng'},
  caumo:{n:'Cậu mợ',d:'Giữ di sản cha mẹ'},
  tramthuy:{n:'Trầm Thúy',d:'Tỳ nữ, ngả theo Phương Chính'},
  thanhthu:{n:'Cổ Nguyệt Thanh Thư',d:'Con nuôi tộc trưởng, tiểu tổ trưởng'},
  tiexueleng:{n:'Thiết Huyết Lãnh',d:'Thần bổ Thiết gia'},
  nhuocnam:{n:'Thiết Nhược Nam',d:'Con gái Thiết Huyết Lãnh'},
  giaphu:{n:'Giả Phú',d:'Chủ thương đội'},
  kimsinh:{n:'Giả Kim Sinh',d:'Em trai Giả Phú'},
  bai:{n:'Bạch Ngưng Băng',d:'Thiên tài Bạch gia'},
  toctruong:{n:'Cổ Nguyệt Bác',d:'Tộc trưởng'},
  xichluyen:{n:'Cổ Nguyệt Xích Luyện',d:'Gia lão Xích gia, quyền cao chức trọng'},
  mactran:{n:'Cổ Nguyệt Mạc Trần',d:'Gia lão Mạc gia, tính khí nóng nảy'},
  xichthanh:{n:'Cổ Nguyệt Xích Thành',d:'Cháu Xích Luyện, tư chất giả mạo'},
};

// Ký ức mang qua các kiếp (nhận được khi đã trải qua sự kiện)
const MEM={
  hoatuu:{n:'Đường vào động phủ Hoa Tửu',d:'Biết lối vào và cách giải trận pháp cửa động.'},
  giasan:{n:'Điểm yếu của cậu',d:'Biết cậu đã lén bán ruộng trà của cha mẹ. Đòi gia sản dễ hơn.'},
  jks:{n:'Thói quen Giả Kim Sinh',d:'Biết hắn tham lam và hay đi một mình. Dụ hắn dễ hơn, đánh hắn mạnh hơn.'},
  langtrieu:{n:'Nhịp lang triều',d:'Đã thấy sói tràn qua tường. Sát thương lên sói +25%.'},
  bai:{n:'Nỗi lòng Bạch Ngưng Băng',d:'Biết hắn khao khát tự do và thể chất đang giết hắn.'},
  huyethai:{n:'Cửa sinh trong huyết động',d:'Biết điểm yếu của huyết khôi. Huyết khôi yếu đi 25%.'},
  doanthach:{n:'Kinh nghiệm mổ thạch Giả gia',d:'Nhìn thấu vân đá cổ. Tỷ lệ đoán thạch thành công +35%.'},
  xichgia:{n:'Nắm thóp Cổ Nguyệt Xích Thành',d:'Biết rõ Xích Thành khai khiếu giả tạo nhờ ông nội truyền công. Dễ dàng tống tiền Xích Luyện.'},
  huyetlo:{n:'Bí mật lăng mộ Nhất Đại',d:'Biết thủy tổ Cổ Nguyệt nuôi con cháu làm nguyên liệu cho Huyết Lô Cổ.'},
  tiexue:{n:'Thủ đoạn của Thiết Huyết Lãnh',d:'Biết cách thần bổ truy án. Chối tội và đổ tội dễ hơn.'},
};

// Tranh cổ trùng (Canva AI) trong assets/gu/g_<khóa>.jpg
// Còn thiếu tranh: nguyetmang, uguang, cuongnham, huyetlo, xaloi1, xaloi2, hungluc, liemtuc (dùng chữ thư pháp tạm)
const GU_IMG=new Set(['xuanthu','nguyetquang','tuutrung','tuvi','bachthi','hacthi','ngocbi','bachngoc','huyetnguyet','diathinh',
  'thietbi','thienbong','trilieu']);
function guImgUrl(k){return GU_IMG.has(k)?asset(`gu/g_${k}.jpg`):''}
// Ô hình cổ trùng; glyph là chữ dự phòng khi chưa có tranh
function guEmblem(k,glyph,cls){
  const u=guImgUrl(k);
  return u?`<span class="gu-img ${cls||''}" style="background-image:url('${u}')" role="img" aria-label="${GU[k]?GU[k].n:''}"></span>`
          :`<span class="glyph-ico ${cls||''}">${glyph||'蛊'}</span>`;
}

/* ---------- Chiến đấu: hệ số khó, hồi chiêu, kiểu đánh của địch ---------- */
const DIFF={hp:1.32,atk:1.32,furyTurn:8};
// Hồi chiêu (lượt) sau khi dùng; cổ tấn công yếu dùng liên tục được, cổ mạnh phải chờ
const CD={nguyetquang:0,toanphong:2,huyetnguyet:2,nguyetmang:2,nguyettoan:2,nguyetngan:2,bangdao:2,cuxikimngo:2,daosihuyetbuc:2,ngocbi:3,dongbi:3,thanhti:3,cuongnham:3,thietbi:3,bachngoc:3,thuytrao:3,hoalo:3,nguyetnghe:3,cuudiep:3,thienbong:4,mokmi:4,trilieu:3,herb:2};
const COMBO_CD=4;
// Giảm sát thương khi hộ thể (tỉ lệ còn nhận)
const SHIELD_RED={ngocbi:.4,dongbi:.45,thanhti:.5,cuongnham:.5,thietbi:.35,bachngoc:.35,thuytrao:.4,hoalo:.5,nguyetnghe:.35,thienbong:.2,mokmi:.15};
// def: giáp trừ thẳng mỗi đòn (xuyên giáp bỏ qua); sk: chiêu riêng; boss: có giai đoạn 2; noflee: không cho chạy
const EAI={
  heorung:{sk:'charge'},
  dienlang:{sk:'howl'},
  hachung:{def:2,sk:'rage'},
  tanbinh:{sk:'poison'},
  hoctro:{},
  macbac:{sk:'drain'},
  cosusay:{},
  hunggia:{def:2,sk:'rage'},
  sontac:{sk:'poison'},
  baitrinhsat:{def:2,sk:'freeze'},
  kimsinh:{def:1,sk:'drain'},
  tuukhoi:{def:1,sk:'regen',regen:.06},
  dlbay:{sk:'howl'},
  loiquan:{def:3,sk:'thunder'},
  langvuong:{def:4,sk:'thunder',boss:1},
  gialao:{def:5,sk:'suppress',boss:1,noflee:1},
  bai:{def:5,sk:'freeze',boss:1},
  huyetkhoi:{def:2,sk:'regen',regen:.1,boss:1},
  baicosu:{def:3,sk:'freeze'},
  baitruonglao:{def:5,sk:'suppress',boss:1,noflee:1},
  madutam:{def:5,sk:'drain',boss:1,noflee:1},
  giave:{def:2,sk:'poison',noflee:1},
};
const SK={
  charge:{n:'Húc thẳng',i:'Chuẩn bị húc thẳng (×1.7)'},
  howl:{n:'Tru gọi bầy',i:'Tru gọi bầy: mỗi lần gọi, đòn mạnh thêm 15%'},
  rage:{n:'Cuồng bạo',i:'Cuồng bạo: đòn ×1.5, tự tăng lực'},
  poison:{n:'Độc cổ',i:'Phóng độc cổ: trúng độc 3 lượt'},
  freeze:{n:'Hàn băng phong cổ',i:'Hàn băng: phong ấn một con cổ 2 lượt'},
  drain:{n:'Hút chân nguyên',i:'Hút chân nguyên của ngươi'},
  regen:{n:'Tái tụ',i:'Tái tụ thân thể: hồi 12% máu'},
  thunder:{n:'Lôi bạo',i:'Lôi bạo: đòn ×1.6, xuyên hộ thể'},
  suppress:{n:'Uy áp',i:'Uy áp: cổ tốn gấp rưỡi chân nguyên 2 lượt'},
};
EN.madutam={n:'Huyết Thủ ma tu',hp:380,atk:[22,32],st:[150,200],bl:6,i:'Một ma tu Tam chuyển áo đỏ thẫm ngồi trên tảng đá, tay nhuộm máu tới khuỷu. Hắn liếc ngươi như nhìn một bữa ăn.'};
EN.giave={n:'Hộ vệ Giả gia',hp:165,atk:[12,18],st:[70,100],bl:3,drop:.5,i:'Hộ vệ Nhị chuyển của Giả Phú chặn đường. "Thiếu gia nhà ta chết không nhắm mắt."'};
MEM.tukiep={n:'Lộ trình Huyết Thủ ma tu',d:'Biết ma tu Tam chuyển ẩn trong núi và con đường hắn hay đi. Có thể tránh.'};
MEM.giave={n:'Sát thủ Giả gia',d:'Biết Giả Phú sẽ phái hộ vệ trả thù. Có thể bày bẫy trước.'};

/* ---------- Mệnh cách: chọn 1 trong 3 đầu mỗi kiếp ---------- */
// ap(): áp dụng lên S mới. Mỗi mệnh cách có cả lợi lẫn hại.
const TRAITS={
  yeuot:{n:'Thân thể yếu ớt',g:'弱',up:'Ngộ tính +2',down:'Khí huyết tối đa −20%',ap:()=>{S.ngo+=2;S.mod.hp=.8}},
  satkhi:{n:'Sát khí nặng',g:'煞',up:'Sát phạt +3',down:'Danh vọng −10, hiềm nghi khởi điểm 20',ap:()=>{S.satphat+=3;S.danh-=10;S.susp=20}},
  ngheo:{n:'Nghèo rớt mồng tơi',g:'贫',up:'Tâm cơ +1, Ngộ tính +1',down:'Khởi đầu 0 nguyên thạch',ap:()=>{S.tamco++;S.ngo++;S.stones=0}},
  macghet:{n:'Mạc gia ghi hận',g:'仇',up:'Sát phạt +2',down:'Mạc Trần thù địch, Mạc Bắc hay gây sự',ap:()=>{S.satphat+=2;rel('mactran',-40);S.f.macHate=1}},
  thanhthu:{n:'Được Thanh Thư quý mến',g:'书',up:'Vào tiểu tổ từ đầu (nhiệm vụ +50%)',down:'Đạo tâm nghiêng chính, khó lừa người',ap:()=>{rel('thanhthu',30);S.f.team=1;S.dao=-15;S.tamco--}},
  mui:{n:'Mũi đánh hơi rượu',g:'嗅',up:'Thám hiểm hậu sơn +4',down:'Nuôi cổ tốn thêm 1 thạch mỗi tuần',ap:()=>{S.f.hsBonus=4;S.mod.food=1}},
  hanthe:{n:'Thể chất hàn âm',g:'寒',up:'Chân nguyên tối đa +15%',down:'Khí huyết tối đa −10%',ap:()=>{S.mod.ess=1.15;S.mod.hp=.9}},
  thiensat:{n:'Sao Thiên Sát chiếu mệnh',g:'煞',up:'Thắng trận +40% nguyên thạch',down:'Gặp tinh anh gấp đôi',ap:()=>{S.mod.win=1.4;S.mod.elite=2}},
  motsach:{n:'Mọt sách',g:'书',up:'Ngộ tính +3',down:'Sát phạt −2',ap:()=>{S.ngo+=3;S.satphat=Math.max(0,S.satphat-2)}},
  canhgiac:{n:'Trực giác hiểm nguy',g:'警',up:'Bỏ chạy +15%, Tâm cơ +1',down:'Chân nguyên tối đa −10%',ap:()=>{S.mod.flee=.15;S.tamco++;S.mod.ess=.9}},
};
// Thương tích lâu dài: lấy khi trận kết thúc mà khí huyết dưới 25%
const INJURY={
  tay:{n:'Gãy tay',d:'Sát phạt −3'},
  noi:{n:'Nội thương',d:'Chân nguyên hồi một nửa'},
  kinh:{n:'Kinh mạch tổn hại',d:'Tu luyện −30%'},
};

/* ---------- Thiên cơ: biến cố thiên hạ, mỗi kiếp bốc 2 ---------- */
const WORLD={
  dathan:{n:'Đại hạn',g:'旱',d:'Nguyệt lan khan hiếm: Nguyệt Quang Cổ ăn gấp đôi. Linh dược rẻ còn một nửa.'},
  muadam:{n:'Mưa dầm',g:'雨',d:'Hậu sơn trơn trượt, thám hiểm khó hơn. Cổ hoang bò ra nhiều hơn.'},
  thuongsom:{n:'Thương đội đến sớm',g:'商',d:'Giả gia lên núi sớm 3 tuần so với ký ức.'},
  langsom:{n:'Lang triều đến sớm',g:'狼',d:'Sói tràn tới sớm 2 tuần so với ký ức.'},
  hunggia:{n:'Hùng gia gây hấn',g:'熊',d:'Cổ sư Hùng gia lảng vảng khắp núi. Đánh nhau nhiều, chiến lợi phẩm cũng nhiều.'},
  dichco:{n:'Dịch cổ',g:'疫',d:'Cổ trùng yếu ớt: mỗi con ăn thêm 1 thạch mỗi tuần. Chợ hạ giá 20%.'},
  matu:{n:'Ma tu lảng vảng',g:'魔',d:'Huyết Thủ ma tu xuất hiện sớm và thường xuyên hơn.'},
  linhmach:{n:'Linh mạch dâng trào',g:'脉',d:'Thiên địa linh khí dồi dào: tu luyện +15%. Thú rừng rơi ít nguyên thạch hơn.'},
  hocnghiem:{n:'Học đường siết chặt',g:'规',d:'Chặn cổng học đường bị nghi gấp đôi. Trợ cấp tháng thêm 4 thạch.'},
  pcthientai:{n:'Phương Chính khai ngộ',g:'正',d:'Em trai tiến bộ thần tốc, gia tộc dồn tài nguyên cho hắn. Trợ cấp của ngươi giảm 4 thạch.'},
};
// Trọng số sự kiện ngẫu nhiên thay đổi theo thiên cơ
const WORLD_WEIGHT={muadam:{r_cohoang:2.5},hunggia:{r_hunggia:3},matu:{r_tukiep:3}};
// Bí tàng: mỗi kiếp giấu 2 cái ở nơi và thời điểm ngẫu nhiên
const CACHE={
  dicot:{n:'Di cốt Cổ sư Nhị chuyển',rumor:'một Cổ sư Nhị chuyển chết già trong núi, túi cổ chưa ai nhặt'},
  tinhthach:{n:'Mạch nguyên thạch lộ thiên',rumor:'đất sạt để lộ một mạch nguyên thạch'},
  linhduoc:{n:'Vườn linh dược hoang',rumor:'có người thấy một vườn linh dược không chủ'},
  bikip:{n:'Bút ký luyện cổ của tiền bối',rumor:'một tiền bối luyện cổ để lại bút ký trước khi mất tích'},
};
const LOC_NAME={nui:'núi Thanh Mao',hauson:'hậu sơn',trai:'sơn trại',nhiemvu:'con đường tuần tra của nhiệm vụ đường'};

// Quyển một, hồi cuối
EN.tiexueleng={n:'Thiết Huyết Lãnh',hp:620,atk:[30,44],st:[0,0],bl:0,i:'Thần bổ Ngũ chuyển rút đao. Chỉ riêng sát khí đã đè nặng lên vai ngươi.'};
EN.nhatdai={n:'Huyết Cương · Cổ Nguyệt Nhất Đại',hp:520,atk:[26,38],st:[200,260],bl:10,i:'Thủy tổ Cổ Nguyệt bò ra khỏi hồ máu, da thịt đỏ au, hai mắt không có con ngươi.'};
EAI.tiexueleng={def:8,sk:'suppress',boss:1};
EAI.nhatdai={def:6,sk:'regen',regen:.08,boss:1,noflee:1};

/* ================= Bản 13: mở rộng nội dung ================= */
// Cổ trùng mới. Trường mới: stun (choáng địch), chill (giảm lực địch), heal (lượng hồi riêng), cure (giải độc hết)
Object.assign(GU,{
  sinhco:{n:'Sinh Cơ Diệp',r:1,food:1,fn:'sương sớm',t:'heal',cost:5,heal:[14,8],cure:1,p:30,d:'Chiếc lá xanh non, dán lên vết thương là lành. Hồi ít hơn Trị Liệu Cổ nhưng rẻ, giải độc hoàn toàn.'},
});
SHOP.push('sinhco');
WILD.push('sinhco');

RECIPES.push(
  {id:'bachngoc',from:'ngocbi',st:45,wine:0,bl:0,extraGu:'cuongnham',ch:.6,d:'Ngọc Bì Cổ + Cương Nham Cổ + 45 nguyên thạch'},
  {id:'trilieu',from:'sinhco',st:10,wine:0,bl:0,hb:3,ch:.75,d:'Sinh Cơ Diệp + 3 linh dược + 10 nguyên thạch'},
);

COMBOS.push(
  {id:'thuy_nguyet',n:'Thủy Nguyệt Hộ Trảm',req:['thuytrao','nguyetquang'],cost:13,dmg:26,shield:2,d:'Nguyệt nhận chém qua màn nước, vừa đánh vừa hộ thể 2 lượt.'},
  {id:'bang_huyet',n:'Băng Huyết Song Trảm',req:['bangdao','huyetnguyet'],cost:24,dmg:62,bleed:2,chill:.2,d:'Băng đao và huyết nhận cùng chém xuống: chảy máu 2 lượt, giảm 20% lực đánh của địch.'},
);
Object.assign(CD,{sinhco:2});
STONES_GAMBLE.push({id:'thach_bang',n:'Hàn Ngọc Cổ Thạch',price:130,dc:17,goodP:.7,d:'Khối đá lạnh buốt đào từ sườn tuyết Bạch gia. Rủi ro cao, nhưng có thể chứa cổ Nhị chuyển.'});

// Kẻ địch mới
Object.assign(EN,{
  docxa:{n:'Trúc Diệp Thanh',hp:38,atk:[5,9],st:[6,10],bl:1,i:'Con rắn xanh biếc như lá trúc lao ra từ bụi rậm, nanh nhỏ độc.'},
  bao:{n:'Kim Tiền Báo',hp:70,atk:[8,14],st:[12,20],bl:2,i:'Kim Tiền Báo đốm vàng rình trên cành, lưng cong như dây cung.'},
  hauquan:{n:'Bầy khỉ hầu nhi tửu',hp:60,atk:[5,10],st:[5,12],bl:1,i:'Mấy chục con khỉ say rượu ném đá, vừa kêu vừa nhe răng.'},
  hunglam:{n:'Hùng Lâm',hp:200,atk:[13,20],st:[60,85],bl:3,drop:.6,i:'Hùng Lâm của Hùng gia xắn tay áo lộ bắp tay như thân cây: "Người Cổ Nguyệt các ngươi, ai đỡ nổi ta ba quyền?"'},
  sontacvuong:{n:'Độc Nhãn sơn tặc vương',hp:170,atk:[12,18],st:[55,80],bl:3,drop:.5,i:'Tên sơn tặc một mắt cầm thanh đao mẻ, sau lưng là cả hang ổ.'},
  bachmaon:{n:'Bạch Mao Hùng Vương',hp:230,atk:[14,22],st:[50,70],bl:4,i:'Con gấu lông trắng to như ngọn đồi nhỏ, mắt đỏ ngầu vì bị đánh thức giữa kỳ ngủ đông.'},
  tramthuysat:{n:'Sát thủ Trầm Thúy thuê',hp:120,atk:[10,16],st:[30,45],bl:2,i:'Kẻ bịt mặt nhảy xuống từ mái tửu lâu. Trên chuôi đao buộc một sợi dây đỏ của Trầm Thúy.'},
  macnhan:{n:'Cổ Nguyệt Mạc Nhan',hp:90,atk:[8,13],st:[15,25],bl:0,i:'Mạc Nhan vung roi, mắt tóe lửa: "Dám làm nhục Mạc gia, hôm nay ta dạy ngươi phép tắc."'},
  phuongchinh:{n:'Phương Chính',hp:190,atk:[12,19],st:[0,0],bl:0,i:'Phương Chính rút Nguyệt Quang Cổ, tay run nhưng mắt không lùi: "Ca ca, đệ không để huynh đi tiếp con đường này."'},
});
Object.assign(EAI,{
  docxa:{sk:'poison'},
  bao:{sk:'charge'},
  hauquan:{sk:'howl'},
  hunglam:{def:3,sk:'rage',boss:1},
  sontacvuong:{def:2,sk:'poison',boss:1},
  bachmaon:{def:3,sk:'rage',boss:1},
  tramthuysat:{def:1,sk:'poison',noflee:1},
  phuongchinh:{def:2,sk:'drain',boss:1},
  macnhan:{def:1,sk:'poison'},
});
// Kẻ địch rơi cổ theo loại (thay cho rơi ngẫu nhiên trong SHOP)
const DROP_POOL={
  baitrinhsat:['bangdao','anlan','thuytrao'],baicosu:['bangdao','bangdao','anlan'],
  hunggia:['hungluc','hungluc','bachthi'],hunglam:['hungluc','hacthi'],
  tanbinh:['toanphong','sinhco','liemtuc'],sontacvuong:['dongbi','liemtuc','sinhco'],
  giave:['liemtuc','thietbi','dongbi'],kimsinh:['dongbi','liemtuc'],hoctro:['nguyetquang','thanhti'],macnhan:['thanhti','tieuguang'],
};

Object.assign(NPC,{
  hunglam:{n:'Hùng Lâm',d:'Cổ sư trẻ nổi danh của Hùng gia'},
  thuongtam:{n:'Lão Tam',d:'Lão thợ săn phàm nhân'},
  macnhan:{n:'Cổ Nguyệt Mạc Nhan',d:'Cháu gái Mạc Trần, kiêu căng hiếu thắng'},
  xichson:{n:'Cổ Nguyệt Xích Sơn',d:'Cổ sư Tam chuyển mạnh nhất Xích gia'},
});

Object.assign(MEM,{
  hunglam:{n:'Quyền pháp Hùng Lâm',d:'Biết Hùng Lâm ra đòn thứ ba luôn hở sườn trái. Đánh hắn dễ hơn.'},
  sontac:{n:'Hang ổ Độc Nhãn',d:'Biết lối tắt vào hang sơn tặc. Nhiệm vụ diệt sơn tặc dễ hơn.'},
  tramthuy:{n:'Sợi dây đỏ của Trầm Thúy',d:'Biết Trầm Thúy có thể thuê sát thủ. Có thể ra tay trước.'},
  hauquan:{n:'Rượu của bầy khỉ',d:'Biết hốc cây nơi bầy khỉ giấu hầu nhi tửu. Bắt Tửu Trùng dễ hơn.'},
  bachmaon:{n:'Hang gấu ngủ đông',d:'Biết hang Bạch Mao Hùng Vương và mật gấu trăm năm bên trong.'},
  nhuocnam:{n:'Lòng dạ Thiết Nhược Nam',d:'Biết cô gái này thẳng thắn, ghét dối trá, nhưng trọng ân tình.'},
});

// Mệnh cách mới
Object.assign(TRAITS,{
  thosan:{n:'Con nhà thợ săn',g:'猎',up:'Sát phạt +2, thắng trận thú rừng thêm huyết khí',down:'Tâm cơ −1',ap:()=>{S.satphat+=2;S.tamco=Math.max(0,S.tamco-1);S.f.hunter=1}},
  tuulau:{n:'Lớn lên trong tửu lâu',g:'酒',up:'Khởi đầu có 1 vò tứ vị tửu, thám hiểm hậu sơn +2',down:'Danh vọng −5',ap:()=>{S.wine++;S.f.hsBonus=(S.f.hsBonus||0)+2;S.danh-=5}},
  hieuhoc:{n:'Hiếu học',g:'学',up:'Học đường: 50% ngộ tính +1 (thay 30%)',down:'Khởi đầu ít hơn 10 nguyên thạch',ap:()=>{S.f.studious=1;S.stones=Math.max(0,S.stones-10)}},
  kimthu:{n:'Bàn tay luyện cổ',g:'炼',up:'Luyện cổ +15%',down:'Khí huyết tối đa −10%',ap:()=>{S.f.refineBonus=(S.f.refineBonus||0)+15;S.mod.hp=(S.mod.hp||1)*.9}},
  giangho:{n:'Lời lẽ giang hồ',g:'舌',up:'Tâm cơ +2',down:'Hiềm nghi khởi điểm 10',ap:()=>{S.tamco+=2;S.susp=Math.max(S.susp,10)}},
});

// Thiên cơ mới
Object.assign(WORLD,{
  daotac:{n:'Sơn tặc hoành hành',g:'贼',d:'Nhiệm vụ đường liên tục gặp sơn tặc. Thưởng nhiệm vụ +30%.'},
  hanthu:{n:'Hàn khí sớm',g:'冰',d:'Bạch gia thời tiết lạnh bất thường. Cổ sư Bạch gia xuất hiện sớm, Băng Đao Cổ dễ kiếm hơn.'},
  thuhoach:{n:'Được mùa nguyệt lan',g:'兰',d:'Nguyệt lan mọc đầy núi: Nguyệt Quang Cổ ăn miễn phí 1 tuần mỗi tháng. Chợ bán thêm một món.'},
  hunglam:{n:'Hùng Lâm xuất sơn',g:'熊',d:'Hùng Lâm, Cổ sư trẻ nổi danh của Hùng gia, đi khắp núi tìm người so tài.'},
});
Object.assign(WORLD_WEIGHT,{
  daotac:{r_sontacphuc:3,r_hotong:2},
  hanthu:{r_baitrinhsat:2,r_bangtuyet:3},
  hunglam:{r_hunglam:4},
});

Object.assign(CACHE,{
  hauquan:{n:'Hốc rượu của bầy khỉ',rumor:'bầy khỉ trên núi giấu cả hốc cây đầy hầu nhi tửu'},
  tocong:{n:'Tổ cổ hoang',rumor:'có một tổ cổ hoang đang nở trong vách đá'},
});

// Mở rộng hình minh họa và biểu tượng
Object.assign(INJURY,{
  mat:{n:'Mờ một mắt',d:'Ngộ tính −2'},
});
// Cổ trùng trong lòng đá theo loại đá
const STONE_POOL={
  thach_re:['nguyetquang','cuongnham','bachthi','dongbi','thanhti','sinhco'],
  thach_truc:['uguang','tuutrung','cuongnham','bachthi','toanphong','tieuguang','thuytrao','bangdao'],
  thach_huyet:['huyetnguyet','thietbi','diathinh','cuxikimngo','daosihuyetbuc'],
  thach_bang:['bangdao','bachngoc','thietbi','nguyetnghe','hoalo'],
};
// Nơi có thể giấu từng loại bí tàng (mặc định: bất kỳ)
const CACHE_LOCS={hauquan:['nui','hauson'],tocong:['nui','hauson','nhiemvu']};
// Thú rừng (mệnh cách Con nhà thợ săn nhận thêm huyết khí)
const BEASTS=new Set(['heorung','dienlang','hachung','docxa','bao','bachmaon','dlbay','loiquan','langvuong','hauquan']);
