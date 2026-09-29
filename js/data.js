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
};

const SHOP=['nguyetquang','tuutrung','bachthi','hacthi','ngocbi','trilieu','cuongnham','hungluc'];
const CARAVAN=['xaloi1','xaloi2','hacthi','thietbi','diathinh','uguang','tuutrung','ngocbi','trilieu','liemtuc','hungluc'];
const WILD=['bachthi','ngocbi','trilieu','nguyetquang','cuongnham'];

// Công thức hợp luyện cổ trùng
const RECIPES=[
  {id:'tuvi',from:'tuutrung',st:30,wine:1,bl:0,ch:.65,d:'Tửu Trùng + 1 tứ vị tửu + 30 nguyên thạch'},
  {id:'huyetnguyet',from:'nguyetquang',st:60,wine:0,bl:6,ch:.55,d:'Nguyệt Quang Cổ + 6 huyết khí + 60 nguyên thạch'},
  {id:'nguyetmang',from:'nguyetquang',st:50,wine:0,bl:0,extraGu:'uguang',ch:.65,d:'Nguyệt Quang Cổ + U Quang Cổ + 50 nguyên thạch'},
  {id:'thietbi',from:'ngocbi',st:40,wine:0,bl:0,ch:.7,d:'Ngọc Bì Cổ + 40 nguyên thạch'},
  {id:'thienbong',from:'thietbi',st:100,wine:0,bl:0,extraGu:'hacthi',ch:.6,d:'Thiết Bì Cổ + Hắc Thỉ Cổ + 100 nguyên thạch'},
];

// Sát Chiêu Sơ Giai (Combo Gu)
const COMBOS=[
  {id:'hung_tram',n:'Hùng Lực Nguyệt Trảm',req:['hungluc','nguyetquang'],cost:14,dmg:34,stun:1,d:'Sức gấu dồn vào nguyệt nhận, chém choáng kẻ địch 1 lượt.'},
  {id:'huyet_tram',n:'Huyết Nguyệt Trảm',req:['huyetnguyet','hacthi'],cost:22,dmg:56,bleed:3,d:'Nguyệt nhận đẫm máu mang cự lực, gây Chảy Máu liên tục 3 lượt.'},
  {id:'man_luc',n:'Man Lực Húc Kích',req:['bachthi','ngocbi'],cost:12,dmg:28,stun:1,shield:2,d:'Da ngọc va chạm toàn lực, làm choáng kẻ địch 1 lượt và nhận giáp.'},
  {id:'nguyet_xa',n:'Nguyệt Mang Xuyên Kích',req:['nguyetmang'],cost:20,dmg:66,pierce:1,d:'Bắn luồng nguyệt mang cực hạn xuyên thấu mọi phòng thủ.'},
  {id:'thien_khue',n:'Thiên Bồng Hộ Thể',req:['thienbong'],cost:25,shield:3,reflect:.35,d:'Triệu hoán hư ảnh bạch trư bảo hộ, phản phệ sát thương dữ dội.'},
];

// Phường Đoán Thạch (Thương đội)
const STONES_GAMBLE=[
  {id:'thach_re',n:'Bình Nhược Thạch',price:15,dc:10,goodP:.45,d:'Đá sông nhẵn bóng, lớp ngoài bình thường. Rẻ nhưng rủi ro cao.'},
  {id:'thach_truc',n:'Thanh Trúc Thạch',price:40,dc:13,goodP:.6,d:'Hóa thạch rễ trúc ngàn năm, tỏa ra linh khí thoang thoảng.'},
  {id:'thach_huyet',n:'Huyết Tinh Cổ Thạch',price:85,dc:15,goodP:.75,d:'Đá cổ màu đỏ sẫm khai quật từ cổ mộ. Thường chứa cổ trùng quý hiếm.'},
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
const DIFF={hp:1.15,atk:1.15,furyTurn:8};
// Hồi chiêu (lượt) sau khi dùng; cổ tấn công yếu dùng liên tục được, cổ mạnh phải chờ
const CD={nguyetquang:0,huyetnguyet:2,nguyetmang:2,ngocbi:3,cuongnham:3,thietbi:3,bachngoc:3,thienbong:4,trilieu:3,herb:2};
const COMBO_CD=4;
// Giảm sát thương khi hộ thể (tỉ lệ còn nhận)
const SHIELD_RED={ngocbi:.4,cuongnham:.5,thietbi:.35,bachngoc:.35,thienbong:.2};
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
