// Quyển 2 · Chương 2.8: Địa linh Bá Quy (canon VN 466–485)
// Địa linh muốn luyện Đệ Nhị Không Khiếu cổ trước khi phúc địa sụp. Trong phúc địa, nó khóa được cổ phàm
// và truyền tống tự do: Phương Nguyên lần lượt ám sát các cự đầu Ngũ chuyển.

// Trận ám sát: Địa linh khóa cổ địch; tâm cơ thành thì địch yếu hẳn, hụt thì địch kịp phản ứng một phần
function assassinate(k,after,dc){
  const r=roll('tamco',dc,(S.f.baquyTin||0));log(r.text,'roll');
  fight(k,{after,flee:false,mod:r.ok?.42:.7,spare:.15,spareAfter:'q2_bq_hut',spareT:'Địa linh kéo ngươi đi bằng một cú truyền tống trước khi đòn cuối rơi xuống.'});
  return r.ok?'Địa linh cắt đứt liên kết cổ trùng và đóng băng chân nguyên của hắn. Ngươi xuất hiện ngay sau lưng.':'Địa linh khóa chậm một nhịp. Hắn quay lại kịp.';
}
// Đổ nguyên thạch vào vạc: tiến độ gom 3000 vạn (quy đổi trong game: 1500 viên)
const BQ_NEED=1500;
function bqVac(){
  const n=Math.min(S.stones,200);
  if(!n){log('Ngươi không còn nguyên thạch để đổ vào vạc.','sys');return}
  S.stones-=n;S.f.bqThach=(S.f.bqThach||0)+n;
  log(`Đổ ${n} nguyên thạch vào vạc. Nguyên liệu Đệ Nhị Không Khiếu: ${Math.min(100,Math.round(S.f.bqThach/BQ_NEED*100))}%.`,'gold');
}
function bqSan(){
  log('Địa linh truyền tống ngươi tới một góc kín của phúc địa, sau lưng một cổ sư Tứ chuyển đang lạc đường.','sys');
  fight('matuNgu',{mod:.7,after:'q2_bq_san'});
}

CHAPTERS.q2_baquy={n:'Địa linh Bá Quy',title:'Quyển hai · Chương tám · Địa linh Bá Quy',unit:'ngày',turns:10,bg:'bg_blood',cap:4,
  intro:'Trong phúc địa, thời gian trôi gấp ba. Mỗi ngày bên trong là ba ngày bên ngoài.',
  ask:'Hôm nay làm gì?',
  canon:{1:'q2_bq_lo',2:'q2_bq_chapniem',3:'q2_bq_lynhan',5:'q2_bq_mobach',7:'q2_bq_ocat',8:'q2_bq_cuucuu',9:'q2_bq_phong',10:'q2_bq_ket'},
  side:['q2_bq_baihoi','q2_bq_ruou','q2_bq_tiennguyen'],
  spots:[
    {id:'bqsan',x:30,y:40,g:'杀',n:'Săn trong phúc địa',d:'Địa linh đưa ngươi tới sau lưng kẻ lạc đường.',run:bqSan},
    {id:'bqvac',x:56,y:62,g:'鼎',n:'Vạc luyện cổ',d:`Đổ nguyên thạch vào vạc (cần ${BQ_NEED}).`,run:bqVac},
    {id:'baicanh',x:40,y:76,g:'冰',n:'Ở cạnh Bạch Ngưng Băng',d:'Nàng giúp truyền chân nguyên. Nàng đang nghĩ gì?',run:()=>{baiLesson();if(Math.random()<.3)log('Bạch Ngưng Băng nhìn tay trái ngươi hơi lâu. Có lẽ ngươi tưởng tượng.','sys')}},
    {id:'tuluyen',x:84,y:52,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:12,y:44,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'refine',minor:1,x:90,y:22,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EN,{
  lynhanbq:{n:'Lý Nhàn',hp:520,atk:[26,36],st:[200,300],bl:1,drop:.6,i:'Biệt Tích Ẩn Hình cổ không cứu được hắn trong phúc địa. Túi Thương Không cổ của hắn đầy của cải.'},
  thietmobach:{n:'Thiết Mộ Bạch',hp:1500,atk:[46,62],st:[600,800],bl:3,i:'Thiết Mộ Bạch đang ngồi suy ngẫm cổ trận trong ải sâu của Bạo Vương. Kim quang quanh lão tắt dần khi Địa linh khóa cổ.'},
  ocat:{n:'Vu Quỷ Ô Cật',hp:1400,atk:[44,60],st:[500,700],bl:3,i:'Ô Cật đang điều khiển bầy chó trong Khuyển Vương. Quyền khống chế bị Địa linh tước mất, lão quay lại nhìn ngươi.'},
  khomac:{n:'Khổ Mặc',hp:1300,atk:[46,60],st:[500,700],bl:3,i:'Ma đầu cốt đạo, xương trắng mọc ra khỏi da như áo giáp.'},
  cuucuu:{n:'Cừu Cửu',hp:1100,atk:[36,50],st:[300,500],bl:2,i:'Sát Nhân Quỷ Y. Không còn cổ trùng, lão chỉ còn đôi tay gầy guộc.'},
});
Object.assign(EAI,{lynhanbq:{sk:'poison',fast:1},thietmobach:{def:6,sk:'thunder',boss:1},ocat:{def:4,sk:'drain',boss:1},khomac:{def:7,sk:'rage',boss:1},cuucuu:{def:3,sk:'regen',boss:1}});
Object.assign(ART,{lynhanbq:{g:'闲',sc:'blood',c:'#aeb8c2'},thietmobach:{g:'金',sc:'blood',c:'#e0c060'},ocat:{g:'巫',sc:'blood',c:'#7a6f86'},khomac:{g:'骨',sc:'blood',c:'#e8e2d6'},cuucuu:{g:'医',sc:'blood',c:'#9fd6a8'}});
Object.assign(PORTRAIT,{lynhanbq:'p_cultivator',thietmobach:'p_baitruonglao',ocat:'p_madutam',khomac:'p_blood',cuucuu:'p_elder'});
Object.assign(DROP_POOL,{lynhanbq:['kimcuong','liemtuc']});
Object.assign(GU,{
  kimquang:{n:'Kim Quang Cổ',r:5,food:10,fn:'kim tinh',t:'attack',dmg:110,cost:30,pierce:1,p:3000,d:'Ngũ chuyển kim đạo của Thiết Mộ Bạch. Hóa thành kim quang xuyên thủng mọi giáp.'},
  hoangkimnhan:{n:'Hoàng Kim Nhãn',r:5,food:8,fn:'kim tinh',t:'passive',atk:10,p:2500,d:'Ngũ chuyển. Mắt vàng nhìn thấu sơ hở. Mọi đòn +10.'},
  nole:{n:'Nô Lệ Cổ',r:4,food:4,fn:'ý chí người khác',t:'passive',p:1200,d:'Gieo vào ai thì kẻ đó thành nô lệ.'},
  hondao:{n:'Hồn cổ của Ô Cật',r:5,food:8,fn:'hồn phách',t:'guard',cost:24,p:2500,d:'Hồn phách Ngũ chuyển bọc thân: chỉ nhận 25% sát thương trong 2 lượt.'},
});
Object.assign(SHIELD_RED,{hondao:.25});Object.assign(CD,{kimquang:2,hondao:3});
Object.assign(NPC,{baquy:{n:'Địa linh Bá Quy',d:'Rùa đá rêu phong, chấp niệm của chủ nhân phúc địa Tam Vương'}});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{baquy:'龟'});
Object.assign(MEM,{q2_mobach:{n:'Ải sâu của Bạo Vương',d:'Thiết Mộ Bạch ngồi quay lưng về lối vào phía tây khi suy ngẫm cổ trận.'}});
Object.assign(DEATH_MEM,{thietmobach:'q2_mobach'});

Object.assign(EV,{
q2_bq_lo:{canon:1,title:'Địa linh Bá Quy',hint:'Rùa đá trong sương',g:'龟',who:'baquy',
  text:()=>'Một con rùa đá khổng lồ, mai phủ rêu, cất tiếng trong đầu ngươi. Nó là Địa linh, linh thể chấp niệm của chủ nhân phúc địa. Nó tìm ngươi vì trên người ngươi có bí phương Đệ Nhị Không Khiếu cổ.',
  choices:()=>[
    {t:'Nhận hợp tác',canon:1,eff:()=>{meet('baquy');rel('baquy',30);S.f.baquy=1;S.f.baquyTin=2;return 'Tam Vương khi xưa chỉ là ba đệ tử kế thừa thất bại. Mục đích thật của phúc địa là luyện Đệ Nhị Không Khiếu cổ: tiên cổ Lục chuyển cho cổ sư một không khiếu thứ hai.'}},
    {t:'Đòi nó trả giá trước',tag:'ma',check:['tamco',15],ok:()=>{meet('baquy');S.f.baquy=1;S.f.baquyTin=1;S.stones+=200;return 'Nó mở kho còn sót của phúc địa. +200 nguyên thạch.'},fail:()=>{meet('baquy');S.f.baquy=1;S.f.baquyTin=0;return 'Nó im lặng rất lâu rồi mới đồng ý.'}},
  ]},
q2_bq_chapniem:{canon:1,title:'Chấp niệm',hint:'Nguyên liệu tiên cổ',g:'鼎',who:'baquy',
  text:()=>`Phúc địa đã mục nát, tiên nguyên cạn, vách ngăn bị thiên kiếp oanh tạc. Luyện Đệ Nhị Không Khiếu cần ba nghìn vạn nguyên thạch (quy ra ${BQ_NEED} viên), cộng huyết nhục, không khiếu và cổ trùng của cường giả. Trong phúc địa, Địa linh khóa được cổ phàm của bất kỳ ai và truyền tống tự do.`,
  choices:[{t:'Lập danh sách: Lý Nhàn, Thiết Mộ Bạch, Ô Cật, Khổ Mặc',eff:()=>{S.tamco++;return 'Tâm cơ +1.'}}]},
q2_bq_lynhan:{canon:1,title:'Kẻ đầu tiên',hint:'Lý Nhàn',g:'闲',who:'lynhan',
  text:()=>'Lý Nhàn đang lạc trong truyền thừa. Biệt Tích Ẩn Hình cổ vô dụng trước Địa linh.',
  choices:[{t:'Ám sát',tag:'ma',canon:1,eff:()=>assassinate('lynhanbq','q2_bq_lynhan',12)},{t:'Tha, để hắn làm tai mắt',drift:6,eff:()=>{S.f.lynhanSong=1;S.stones+=100;return 'Hắn dâng một nửa túi Thương Không. +100 nguyên thạch.'}}]},
q2_bq_mobach:{canon:1,title:'Ám sát Thiết Mộ Bạch',hint:'Thiết Mộ Bạch',g:'金',who:'mobach',
  text:()=>'Thiết Mộ Bạch ngồi trong ải sâu của Bạo Vương, suy ngẫm cổ trận.'+(mem('q2_mobach')?' Ngươi nhớ: lão quay lưng về lối phía tây.':''),
  choices:()=>[
    {t:'Để Địa linh khóa lão, xuất hiện sau lưng, đập nát đầu',tag:'ma',canon:1,eff:()=>assassinate('thietmobach','q2_bq_mobach',mem('q2_mobach')?13:16)},
    {t:'Bỏ qua lão, quá nguy hiểm',drift:10,eff:()=>{S.f.mobachSong=1;return 'Thiết Mộ Bạch sẽ còn sống khi phúc địa sụp.'}},
  ]},
q2_bq_ocat:{canon:1,title:'Vu Quỷ và Khổ Mặc',hint:'Ô Cật, Khổ Mặc',g:'巫',who:'ocat',
  text:()=>'Ba cự đầu Ngũ chuyển biến mất không dấu vết khiến bên ngoài hoang mang. Ô Cật đang điều khiển bầy chó; Khổ Mặc ở không xa.',
  choices:()=>[
    {t:'Hạ Ô Cật',tag:'ma',canon:1,eff:()=>assassinate('ocat','q2_bq_ocat',15)},
    {t:'Hạ Khổ Mặc trước, kẻ yếu hơn',tag:'ma',eff:()=>assassinate('khomac','q2_bq_khomac',14)},
  ]},
q2_bq_cuucuu:{canon:1,title:'Sát Nhân Quỷ Y',hint:'Cừu Cửu',g:'医',who:'cuucuu',
  text:()=>'Cừu Cửu bị tước cổ trùng. Lão quỳ xuống trước ngươi, khai ra thân phận: môn đồ bí mật của Sinh Tử Môn, thế lực ma đạo viễn cổ gắn với Nhân Tổ truyện và Cổ Tiên.',
  choices:[
    {t:'Tha, biến lão thành con cờ',canon:1,eff:()=>{meet('cuucuu');S.f.cuucuu=1;S.tamco++;return 'Lão dâng bí mật để đổi mạng. Tâm cơ +1.'}},
    {t:'Giết, lấy xác làm nguyên liệu',tag:'ma',eff:()=>{fight('cuucuu',{mod:.5,after:'q2_bq_cuucuu'});return 'Lão cười: cứu một mạng phải giết một mạng.'}},
  ]},
q2_bq_phong:{canon:1,title:'Thợ luyện chính',hint:'Phong Thiên Ngữ',g:'风',who:'phongthienngu',
  text:()=>'Phong Thiên Ngữ vượt Tín Vương xuất sắc và lọt vào tầm ngắm. Địa linh khống chế hắn. Một thiên tài luyện đạo là thứ không thể thiếu cho tiên cổ.',
  choices:[
    {t:'Gieo Nô Lệ cổ',tag:'ma',canon:1,eff:()=>{meet('phongthienngu');S.f.phongNo=1;return 'Phong Thiên Ngữ thành thợ luyện chính của ngươi.'}},
    {t:'Thuyết phục hắn hợp tác',check:['tamco',16],ok:()=>{meet('phongthienngu');rel('phongthienngu',20);S.f.phongNo=1;return 'Hắn đồng ý, vì tò mò hơn là vì sợ.'},fail:()=>{meet('phongthienngu');S.f.phongNo=1;return 'Cuối cùng vẫn phải dùng Nô Lệ cổ.'}},
  ]},
q2_bq_ket:{canon:1,title:'Vạc sôi',hint:'Chuẩn bị luyện',g:'鼎',who:'baquy',
  text:()=>`Nguyên liệu trong vạc: ${Math.min(100,Math.round((S.f.bqThach||0)/BQ_NEED*100))}%. Bên ngoài, thiên kiếp đánh nứt vách phúc địa. Tiêu Mang và các gia tộc chính đạo tụ tập, dùng quang đạo oanh vào khe nứt. Thân đá của Địa linh bắt đầu vỡ vụn.`,
  choices:[{t:'Vào điện luyện cổ',eff:()=>{if((S.f.bqThach||0)<BQ_NEED){const bu=Math.min(S.stones,BQ_NEED-(S.f.bqThach||0));S.stones-=bu;S.f.bqThach=(S.f.bqThach||0)+bu;log(`Đổ nốt ${bu} nguyên thạch còn lại.`,'gold')}chapEnd('q2_phanboi');return 'Chương tám kết thúc.'}}]},

q2_bq_baihoi:{title:'Hỏi han',g:'冰',who:'bainu',cond:()=>S.turn>=4,
  text:()=>'Bạch Ngưng Băng hỏi, như vô tình: nếu luyện thành Đệ Nhị Không Khiếu, ngươi còn cần Thề Độc với nàng nữa không.',
  choices:[
    {t:'"Không. Dương cổ sẽ trả."',eff:()=>{baiRel(5);return 'Nàng gật đầu. Không tin.'}},
    {t:'"Thề Độc không trói được ta."',tag:'ma',eff:()=>{baiRel(-15);S.f.baiNghi=1;return 'Nàng mỉm cười. Ngươi vừa nói một câu thật.'}},
  ]},
q2_bq_ruou:{title:'Rượu trong xác cự đầu',g:'酒',cond:()=>(S.f.ruou||0)<4&&(S.f.giet_mobach||S.f.giet_ocat),
  text:()=>'Trong túi của cự đầu có một hũ rượu cực phẩm.',
  choices:[{t:'Lấy',eff:()=>{S.f.ruou=(S.f.ruou||0)+1;return `Rượu cực phẩm: ${S.f.ruou}/4.`}}]},
q2_bq_tiennguyen:{title:'Tiên nguyên cuối',g:'元',who:'baquy',cond:()=>S.turn>=6,
  text:()=>'Địa linh còn vài giọt tiên nguyên cuối cùng. Nó giữ chúng cho lúc luyện.',
  choices:[{t:'Biết vậy',eff:()=>{S.f.tienNguyen=1;return 'Tiên nguyên: thứ duy nhất nuôi được tiên cổ.'}}]},
});

Object.assign(AFTER,{
  q2_bq_san:()=>{const n=rand(80,150);S.stones+=n;log(`Túi của kẻ lạc đường: ${n} nguyên thạch.`,'gold')},
  q2_bq_hut:()=>{S.f.bqHut=(S.f.bqHut||0)+1;log('Cự đầu kia thoát được. Phúc địa ngày càng nguy hiểm.','danger')},
  q2_bq_lynhan:()=>{S.stones+=300;log('Lý Nhàn bị lột sạch gia tài. +300 nguyên thạch.','big')},
  q2_bq_mobach:()=>{S.f.giet_mobach=1;S.stones+=400;gainGu('kimquang');gainGu('hoangkimnhan');S.danh+=30;log('Thiết Mộ Bạch, Ngũ chuyển đỉnh phong, chết không kịp quay đầu. Kim Quang cổ, Hoàng Kim Nhãn về tay ngươi; không khiếu và huyết nhục của lão vào vạc.','big');S.f.bqThach=(S.f.bqThach||0)+300},
  q2_bq_ocat:()=>{S.f.giet_ocat=1;S.stones+=300;gainGu('hondao');S.f.bqThach=(S.f.bqThach||0)+250;S.evq.push('q2_bq_khomac2');log('Ô Cật chết tại chỗ. Ngươi thu hồn phách và hồn đạo cổ của lão.','big')},
  q2_bq_khomac:()=>{S.f.giet_khomac=1;S.stones+=300;S.f.bqThach=(S.f.bqThach||0)+250;log('Khổ Mặc bị đánh nát xương tủy.','big')},
  q2_bq_cuucuu:()=>{S.f.bqThach=(S.f.bqThach||0)+150;log('Quỷ Y chết. Sinh Tử Môn mất một môn đồ, và sẽ không quên.','danger')},
});
Object.assign(EV,{
q2_bq_khomac2:{title:'Khổ Mặc',g:'骨',who:'khomac',
  text:()=>'Khổ Mặc cảm thấy Ô Cật biến mất. Lão đi tìm, đúng về phía ngươi.',
  choices:[{t:'Để Địa linh khóa lão',tag:'ma',eff:()=>assassinate('khomac','q2_bq_khomac',15)},{t:'Tránh',eff:()=>{S.f.khomacSong=1;return 'Khổ Mặc đi qua.'}}]},
});
