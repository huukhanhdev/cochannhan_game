// Quyển 2 · Chương 2.3: Thương đội (canon VN 251–294)
// Giả phàm nhân Hắc Thổ và Bạch Vân, kết giao Thương Tâm Từ, buôn bán, ám sát trong đoàn, Đinh Hạo và cương thi.

// Lều Thương Tâm Từ: quan hệ với nàng mở các chuyện buôn bán về sau
function tamtuVisit(){
  meet('tamtu');rel('tamtu',6);
  const r=S.rel.tamtu;
  if(r<20)log('Tâm Từ phát bánh cho gia nô như mọi tối. Nàng hỏi thăm vết thương của ngươi.','sys');
  else if(r<40)log('Tâm Từ kể chuyện mẹ nàng họ Trương, chuyện tộc nhân Thương gia khinh nàng là con riêng. Tiểu Điệp đứng sau lườm ngươi.','sys');
  else{log('Tâm Từ đưa ngươi xem sổ hàng. Nàng tính nhanh hơn cả lão tổng quản. "Phàm nhân cũng có sức mạnh của phàm nhân."','good');if(!S.f.tamtuSo){S.f.tamtuSo=1;S.tamco++;log('Tâm cơ +1.','good')}}
}
// Buôn bán dọc đường: kinh nghiệm trăm năm làm thủ lĩnh thương đội ở kiếp trước
function tradeRun(){
  const p=chance('tamco',12,(S.rel.tamtu||0)>=30?3:0);
  if(Math.random()*100<p){const n=rand(15,30)+((S.rel.tamtu||0)>=30?10:0);S.stones+=n;log(`Mua rẻ ở trại này, bán đắt ở trại sau. Lời ${n} nguyên thạch.`,'gold')}
  else{const n=rand(4,10);S.stones=Math.max(0,S.stones-n);log(`Hàng ế. Lỗ ${n} nguyên thạch.`,'danger')}
}

CHAPTERS.q2_thuongdoi={n:'Thương đội',title:'Quyển hai · Chương ba · Thương đội',unit:'tuần',turns:12,bg:'bg_village',cap:2,
  intro:'Dưới chân núi Tử U có một thôn phàm nhân. Tường đá thấp, người trong thôn không ưa người lạ.',
  ask:'Tuần này làm gì trong đoàn?',shop:Q2_SHOP.thuongdoi,
  start:()=>{S.stones=Math.max(S.stones,20)},
  canon:{1:'q2_td_thon',2:'q2_td_vao',3:'q2_td_tamtu',5:'q2_td_phihau',6:'q2_td_kimgia',7:'q2_td_duthu',8:'q2_td_phituong',9:'q2_td_auphi',10:'q2_td_cuongthi',12:'q2_td_thuongluong'},
  side:['q2_td_tieudiep','q2_td_tranham','q2_td_chiahang','q2_td_hoihop'],
  spots:[
    {id:'tddoan',x:22,y:60,g:'队',n:'Trong đoàn',d:'Gia nô, cổ sư các nhà, tin đồn.',loc:'td_doan',evP:.75,quiet:'Đoàn nghỉ chân. Ai lo việc nấy.'},
    {id:'tdleu',x:44,y:42,g:'慈',n:'Lều Thương Tâm Từ',d:'Trò chuyện với Tâm Từ.',run:tamtuVisit},
    {id:'tdduong',x:68,y:30,g:'路',n:'Đi trước dò đường',d:'Thú dữ trên đường núi. Nguyên thạch và danh vọng.',loc:'td_duong',foes:['phihau','cuongdienlang','khicuongtru'],evP:.45,foeP:.8},
    {id:'tdbuon',x:62,y:66,g:'商',n:'Buôn bán',d:'Mua ở trại này, bán ở trại sau.',run:tradeRun},
    {id:'baicanh',x:34,y:78,g:'冰',n:'Ở cạnh Bạch Ngưng Băng',d:'Vợ chồng son trong mắt người khác.',run:baiLesson},
    {id:'tuluyen',x:84,y:58,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:10,y:36,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'market',minor:1,x:50,y:84,g:'市',n:'Chợ thương đội',d:'Mua bán'},
    {id:'refine',minor:1,x:90,y:24,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EV,{
q2_td_thon:{canon:1,title:'Thôn phàm nhân',hint:'Giả làm phàm nhân',g:'村',who:'truongthon',
  text:()=>'Muốn tới Thương gia thành thì phải trà trộn vào thương đội. Người lạ không được nhận, trừ khi có trưởng thôn bảo lãnh. Trưởng thôn là cổ sư Nhất chuyển duy nhất ở đây.',
  choices:()=>[
    {t:'Đốt mặt, cắt tai, giả phàm nhân bị bỏng; Bạch Ngưng Băng cắt tóc nhuộm đen',canon:1,dao:8,eff:()=>{meet('truongthon');rel('truongthon',15);S.f.giaPham=1;S.hp=Math.max(1,S.hp-20);return 'Không ai nhìn ra hai người vừa từ Bạch Cốt Sơn chạy tới. Một bà lão trong thôn còn tưởng hai người là vợ chồng son. Khí huyết −20.'}},
    {t:'Bán lá Tử Phong giá cao cho trưởng thôn để lấy lòng',check:['tamco',12],ok:()=>{meet('truongthon');rel('truongthon',20);S.stones+=10;return 'Lão Trương mua, cười rồi viết thư bảo lãnh.'},fail:()=>{meet('truongthon');S.stones=Math.max(0,S.stones-5);return 'Lão ép giá, nhưng vẫn bảo lãnh.'}},
  ]},
q2_td_vao:{canon:1,title:'Hắc Thổ và Bạch Vân',hint:'Vào thương đội',g:'队',
  text:()=>'Thương đội là liên hiệp nhiều gia tộc: thủ lĩnh do bầu, dưới có nhiều phó thủ lĩnh. Hai người mang tên giả Hắc Thổ và vợ Bạch Vân, vào làm gia nô. Tối đầu tiên, Sấu Hầu tới "thăm dò người mới", sau lưng là nhóm của Cường ca.',
  choices:()=>[
    {t:'Nhịn, ghi nhớ từng mặt',canon:1,eff:()=>{S.tamco++;S.f.cuongcaNo=1;return 'Sấu Hầu giật túi đồ của ngươi rồi cười bỏ đi. Tâm cơ +1.'}},
    {t:'Đánh gục cả nhóm ngay đêm đó',tag:'ma',eff:()=>{S.susp+=10;S.danh+=5;S.stones+=6;return 'Ngươi đá Sấu Hầu vào nồi canh. Cả nhóm gia nô nằm la liệt. Hiềm nghi +10: gia nô sao đánh được như vậy?'}},
  ]},
q2_td_tamtu:{canon:1,title:'Máu trước lều',hint:'Tới lều Thương Tâm Từ',g:'血',who:'tamtu',
  text:()=>'Người phó thủ lĩnh tối nào cũng phát bánh cho gia nô là một cô gái phàm nhân không có tư chất. Ngươi nhận ra nàng: Thương Tâm Từ, con riêng của tộc trưởng Thương gia, lần đầu theo thương đội. Kiếp trước nàng là một nhân vật lớn.',
  choices:()=>[
    {t:'Ném nguyên thạch cho nhóm Cường ca tranh nhau, tự rạch mình rồi đẫm máu tới gõ cửa lều nàng',canon:1,dao:10,eff:()=>{meet('tamtu');meet('tieudiep');meet('truongtru');rel('tamtu',25);S.hp=Math.max(1,S.hp-25);S.f.tamtuThuong=1;return 'Lão tổng quản bắt được Cường ca cầm nguyên thạch, tát cả nhóm. Còn ngươi, người đầy máu, quỳ trước lều Tâm Từ. Trương Trụ, cổ sư trị liệu Tam chuyển, được gọi tới chữa. Tâm Từ nhìn ngươi rất lâu. Khí huyết −25.'}},
    {t:'Tới xin làm việc cho nàng, nói thật mình biết buôn bán',check:['tamco',13],ok:()=>{meet('tamtu');meet('tieudiep');rel('tamtu',15);return 'Tâm Từ đồng ý thử. Tiểu Điệp khó chịu ra mặt.'},fail:()=>{meet('tamtu');meet('tieudiep');rel('tieudiep',-10);return 'Tiểu Điệp đuổi ngươi ra.'}},
  ]},
q2_td_phihau:{canon:1,title:'Vật tay với Phỉ Hầu',hint:'Núi Phỉ Hầu',g:'猴',
  text:()=>'Núi Phỉ Hầu sương dày. Bầy khỉ khổng lồ chặn đường đòi "phí": chúng thích lụa và thích vật tay. Giả gia che than tinh phẩm dưới lụa. Giả Bình, gầy như que củi, có Song Hùng lực, đã thắng hai ván.',
  choices:()=>[
    {t:'Vật tay với Phỉ Hầu bằng sức Ngạc lực',canon:1,check:['satphat',13],bonus:()=>hasGu('ngacluc')?5:0,ok:()=>{S.danh+=12;S.stones+=20;S.prog+=40;levelUp();return 'Khỉ lớn buông tay trước. Cả đoàn reo hò. Hùng lực đánh, Mã lực chạy, Ngạc lực cắn: vật tay là chuyện của cổ tay. Danh vọng +12, tu vi +40.'},fail:()=>{fight2('phihau',{after:'q2_td_hau'});return 'Ngươi thua, con khỉ đòi thêm. Bầy khỉ nổi giận.'}},
    {t:'Đứng xem, học cách người khác dùng lực',eff:()=>{S.ngo++;return 'Ngươi nhớ kỹ gân tay của Giả Bình khi hắn dùng Bàn Cân cổ. Ngộ tính +1.'}},
  ]},
q2_td_kimgia:{canon:1,title:'Cỏ của Kim gia',hint:'Buôn cỏ Kim gia',g:'金',who:'tamtu',
  text:()=>'Qua núi Hoàng Kim, một tiểu thiếu chủ Kim gia lén bán mấy xe cỏ. Ngươi biết: tộc trưởng Kim gia trồng loại cỏ này bốn năm để giữ bí mật một kế hoạch. Họ sẽ quay lại mua với bất cứ giá nào.',
  choices:()=>[
    {t:'Mượn tiền Tâm Từ mua hết ba xe, bán dần cho người khác để Kim gia không cướp được',canon:1,check:['tamco',14],bonus:()=>(S.rel.tamtu||0)>=30?4:0,ok:()=>{S.stones+=380;rel('tamtu',15);S.danh+=10;return 'Sáng hôm sau thân vệ Kim gia tìm tới. Ba nghìn, năm nghìn, bảy nghìn... ngươi chốt ở tám nghìn. Chia đôi với Tâm Từ, phần của ngươi đổi ra được 380 nguyên thạch. Nàng nhìn ngươi như nhìn một ông thầy.'},fail:()=>{S.stones+=90;return 'Kim gia ép giá. Vẫn lời 90 nguyên thạch.'}},
    {t:'Báo cho Kim gia để lấy lòng',tag:'chinh',eff:()=>{S.stones+=40;S.danh+=5;return 'Kim gia tặng 40 nguyên thạch cảm tạ.'}},
  ]},
q2_td_duthu:{canon:1,title:'Thú dữ theo đoàn',hint:'Dụ thú tấn công',g:'兽',who:'bainu',
  text:()=>'Qua núi Khiếu Nguyệt, núi Bạch Hổ, thương đội bị thú tấn công liên tục: sói xám, sói điện, sói tuyết, cú mèo lạnh. Hàng của Trương gia "mất nhiều nhất". Bạch Ngưng Băng hỏi thẳng: có phải ngươi dụ thú tới?',
  choices:()=>[
    {t:'"Phải." Hàng mất là hàng của kẻ khác, hàng quý đã nằm trong tay Tâm Từ',tag:'ma',canon:1,dao:12,eff:()=>{baiRel(8);S.stones+=60;S.susp+=10;return 'Nàng im lặng một lúc rồi cười. Trong đoàn còn ít người hơn, và người nào cũng cần Hắc Thổ. +60 nguyên thạch.'}},
    {t:'Chối, rồi đi đánh thú bảo vệ đoàn',eff:()=>{fight2('cuongdienlang',{after:'q2_td_soi'});return 'Ba con cuồng điện lang dẫn chín con điện lang.'}},
  ]},
q2_td_phituong:{canon:1,title:'Bạch Vũ Phi Tượng',hint:'Núi Tượng Nha',g:'象',sc:'snow',who:'truongtru',
  text:()=>'Núi Tượng Nha: chân núi mưa rừng, đỉnh núi tuyết phủ. Một con voi lông trắng bay được bổ nhào xuống đoàn. Giữa hỗn loạn, Trương Trụ đứng ngay trước mặt ngươi, quay lưng lại. Hắn là người duy nhất trong đoàn đủ sức phá vỡ kế hoạch của ngươi.',
  choices:()=>[
    {t:'Bắn hai Loa Toàn Cốt Thương vào lưng Trương Trụ, để voi giẫm nát xác',tag:'ma',canon:1,dao:20,req:()=>hasGu('loatoan')||hasGu('cotthuong'),reqT:'Cần cổ cốt thương',eff:()=>{S.f.truongtruChet=1;S.susp+=10;later('q2_td_tamtunghi',1,2);fight2('phituong',{after:'q2_td_voi'});return 'Cốt thương tan thành bụi trắng sau khi bắn. Không dấu vết. Còn con voi thì vẫn ở đó.'}},
    {t:'Cùng Trương Trụ đánh voi',tag:'chinh',eff:()=>{rel('truongtru',15);fight2('phituong',{after:'q2_td_voi',mod:.85});return 'Trương Trụ phóng quang cầu trắng cầm máu cho ngươi giữa trận.'}},
  ]},
q2_td_auphi:{canon:1,title:'Âu Phi',hint:'Âu Phi xông lều',g:'欧',who:'tamtu',
  text:()=>'Âu Phi, con Âu Dương Công, đạp cửa lều Tâm Từ đòi chiếm nàng, tát Tiểu Điệp ngã xuống đất.',
  choices:()=>[
    {t:'Đá văng hắn, một quyền đấm lõm mặt',canon:1,tag:'ma',eff:()=>{rel('tamtu',20);rel('tieudiep',25);fight('auphi',{after:'q2_td_auphi'});return 'Hắn chưa kịp rút cổ.'}},
    {t:'Đứng chắn trước Tâm Từ, gọi người',tag:'chinh',eff:()=>{rel('tamtu',10);S.f.auphiSong=1;return 'Âu Phi bị kéo đi. Hắn nhìn ngươi, nhớ mặt.'}},
  ]},
q2_td_cuongthi:{canon:1,title:'Đêm cương thi',hint:'Đinh Hạo',g:'尸',sc:'blood',who:'dinhhao',
  text:()=>'Đêm ở núi Huyết Lệ, hàng nghìn cương thi Bạch Mao vây đoàn. Sau chúng là Hắc Mao. Kẻ điều khiển là Đinh Hạo, một thôn phu bị thương đội bỏ làm mồi, trốn vào hang và nhặt được truyền thừa cương thi.'+(mem('q2_dinhhao')?' Ngươi nhớ: hắn nhận truyền thừa của Cương Vương đời hai, và sợ bị đại sư huynh tìm tới.':''),
  choices:()=>[
    {t:'Phá vây, tìm Đinh Hạo, mạo danh đại đệ tử "Hắc Thổ" của Cương Vương đời hai',canon:1,check:['tamco',15],bonus:()=>mem('q2_dinhhao')?6:0,
      ok:()=>{meet('dinhhao');learn('q2_dinhhao');S.stones+=650;S.danh+=20;return 'Đinh Hạo quỳ xuống gọi "đại sư huynh", nộp mười ba nghìn nguyên thạch tích góp và năm xác cổ sư Tam chuyển. Đổi ra được 650 nguyên thạch. Cương thi rút đi. Cả đoàn tưởng Hắc Thổ đại nhân một mình đánh lui ma tu.'},
      fail:()=>{meet('dinhhao');fight2('hacmao',{after:'q2_td_hacmao'});return 'Hắn không tin. Một con Hắc Mao lao tới.'}},
    {t:'Giữ đoàn, đánh cương thi tới sáng',tag:'chinh',eff:()=>{fight2('bachmao',{after:'q2_td_bachmao'});return 'Bạch Mao chậm và sợ nắng. Chỉ cần sống tới sáng.'}},
  ]},
q2_td_thuongluong:{canon:1,title:'Núi Thương Lượng',hint:'Tới Thương gia thành',g:'商',who:'tamtu',
  text:()=>'Qua núi Huyết Lệ, Thiên Quật, Cự Nhân, Lục Tảo, cuối cùng là núi Thương Lượng. Trước cổng thành, Tâm Từ quay lại nhìn ngươi. Nàng chưa biết thân phận thật của Hắc Thổ, hoặc đã biết mà không nói.',
  choices:()=>[
    {t:'Chia tay trước cổng, hẹn sẽ gặp lại',canon:1,eff:()=>{rel('tamtu',10);q2Ending('q2_thuongluong');return 'Thương gia thành: thế lực buôn bán số một Nam Cương. Chính đạo, nhưng là nơi ma đạo tiêu thụ tang vật.'}},
    {t:'Đi cùng nàng vào thành',eff:()=>{rel('tamtu',15);S.f.cungTamTu=1;q2Ending('q2_thuongluong');return 'Tiểu Điệp lườm, nhưng không phản đối.'}},
  ]},

// bên lề
q2_td_tieudiep:{title:'Tiểu Điệp',g:'蝶',who:'tieudiep',cond:()=>S.met.tamtu,
  text:()=>'Tiểu Điệp chặn ngươi sau lều: "Tiểu thư tốt bụng, không có nghĩa là ai cũng được lợi dụng."',
  choices:[
    {t:'"Ngươi trung thành. Tốt."',eff:()=>{rel('tieudiep',10);return 'Nàng đỏ mặt, không biết là giận hay ngượng.'}},
    {t:'Phớt lờ',eff:()=>{rel('tieudiep',-5);return 'Nàng giậm chân bỏ đi.'}},
  ]},
q2_td_tranham:{title:'Trần Hâm',g:'陈',cond:()=>S.turn>=4,
  text:()=>'Trần Hâm, người Trần gia, hay đi ngang lều ngươi, mắt dò xét. Hắn nghe được gì đó.',
  choices:[
    {t:'Mua chuộc hắn',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',eff:()=>{S.stones-=20;S.susp=Math.max(0,S.susp-10);return 'Trần Hâm nhận tiền. Hiềm nghi −10.'}},
    {t:'Ghi nhớ, để sau xử lý',eff:()=>{S.f.tranHam=1;return 'Ngươi thêm một cái tên vào danh sách.'}},
  ]},
q2_td_chiahang:{title:'Hàng vô chủ',g:'货',cond:()=>S.f.truongtruChet||S.turn>=9,
  text:()=>'Sau những trận thú tấn công, đoàn họp chia hàng của người chết. Trần gia muốn phần lớn.',
  choices:[
    {t:'Đứng về phía Tâm Từ',eff:()=>{rel('tamtu',8);S.stones+=25;return 'Phe Tâm Từ được một phần. +25 nguyên thạch.'}},
    {t:'Để hai nhà cãi nhau, lén lấy phần tốt nhất',tag:'ma',check:['tamco',13],ok:()=>{S.stones+=50;return '+50 nguyên thạch.'},fail:()=>{S.susp+=12;return 'Trần Song Toàn để ý tới ngươi. Hiềm nghi +12.'}},
  ]},
q2_td_hoihop:{title:'Ẩn gia lão Trương gia',g:'张',who:'tamtu',cond:()=>(S.rel.tamtu||0)>=30&&S.turn>=6,
  text:()=>'Đoàn còn ít người, lòng người không đủ. Tâm Từ giới thiệu ngươi và Bạch Vân trước cả đoàn: "ẩn gia lão Trương gia, làm nhiệm vụ bí mật."',
  choices:[{t:'Nhận vai',eff:()=>{S.danh+=15;S.f.anGiaLao=1;return 'Từ nay không ai dám bắt nạt Hắc Thổ. Danh vọng +15.'}}]},
q2_td_tamtunghi:{title:'Câu hỏi của Tâm Từ',g:'慈',who:'tamtu',
  text:()=>'Tâm Từ an ủi Tiểu Điệp: "Trương Trụ thúc có thể không về." Tối đó nàng mang cả hai rương nguyên thạch tích trữ tới lều ngươi, nói là "xin lỗi".',
  choices:[
    {t:'Nhận, không nói gì',tag:'ma',eff:()=>{S.stones+=120;rel('tamtu',5);return 'Nàng biết. Nàng chọn ăn ý với người thông minh. +120 nguyên thạch.'}},
    {t:'Trả lại',eff:()=>{rel('tamtu',20);return 'Nàng nhìn ngươi, rồi cất rương đi.'}},
  ]},

// nơi chốn
q2r_td_gianoc:{loc:'td_doan',title:'Gia nô ăn mày',g:'奴',text:()=>'Một gia nô gầy trơ xương xin miếng ăn.',
  choices:[
    {t:'Đạp hắn ra',tag:'ma',eff:()=>{S.dao=clamp(S.dao+3,-100,100);return 'Phàm nhân mệnh tiện. Không ai trong đoàn thấy lạ.'}},
    {t:'Cho nửa cái bánh',eff:()=>{S.danh+=2;return 'Hắn dập đầu.'}},
  ]},
q2r_td_cobac:{loc:'td_doan',title:'Chiếu bạc',g:'赌',text:()=>'Đám hộ vệ bày chiếu bạc bên đống lửa.',
  choices:[{t:'Đặt 10 nguyên thạch',req:()=>S.stones>=10,reqT:'Cần 10 nguyên thạch',check:['tamco',12],ok:()=>{S.stones+=12;return 'Thắng 12.'},fail:()=>{S.stones-=10;return 'Thua 10.'}},{t:'Đứng xem',eff:()=>'Ngươi nhớ được ai hay thua.'}]},
q2r_td_mo:{loc:'td_duong',title:'Bùn vàng',g:'金',text:()=>'Suối dưới núi Hoàng Kim lọc ra vàng. Vàng chỉ là phụ liệu luyện cổ, nhưng vẫn bán được.',
  choices:[{t:'Đãi vàng',eff:()=>{S.stones+=rand(8,15);return 'Được ít vàng vụn.'}}]},
q2r_td_tuyet:{loc:'td_duong',title:'Cú mèo lạnh',g:'鸮',text:()=>'Một bầy thú hình báo, mặt cú, mắt xanh rình trên cành.',
  choices:[{t:'Đánh',eff:()=>{fight2('cuongdienlang',{mod:.9});return 'Chúng lao xuống.'}},{t:'Tránh',check:['tamco',11],ok:()=>'Ngươi dẫn đoàn đi đường khác.',fail:()=>{fight2('cuongdienlang',{});return 'Không tránh kịp.'}}]},
});

Object.assign(AFTER,{
  q2_td_hau:()=>{S.stones+=10;log('Bầy khỉ rút đi.','good')},
  q2_td_soi:()=>{S.danh+=10;S.stones+=20;log('Đoàn giữ được hàng. Danh vọng +10.','good')},
  q2_td_voi:()=>{S.stones+=40;S.danh+=10;S.prog+=60;levelUp();log('Bạch Vũ Phi Tượng gục trên tuyết. Ngà voi bán được giá. Tu vi +60.','big')},
  q2_td_auphi:()=>{S.f.auphiChet=1;later('q2_td_auduong',0,1);log('Âu Phi chết với gương mặt lõm vào trong.','danger')},
  q2_td_hacmao:()=>{S.stones+=30;log('Hắc Mao đổ xuống. Đinh Hạo bỏ chạy vào đêm.','good')},
  q2_td_bachmao:()=>{S.danh+=15;S.stones+=20;log('Trời sáng. Bạch Mao rút vào hang. Đoàn nhớ ơn ngươi.','good')},
  q2_td_auduong_win:()=>{S.stones+=90;S.danh+=20;log('Âu Dương Công gục ngã. Ngươi hô lên "Giả gia làm!" để kéo mọi người vào. Trần Song Toàn nhìn ngươi: chỉ có thực lực mới là chân lý.','big')},
});
Object.assign(EV,{
q2_td_auduong:{title:'Âu Dương Công báo thù',g:'欧',who:'auduongcong',
  text:()=>'Âu Dương Công, Tam chuyển sơ kỳ, tới đòi mạng cho con. Ngươi vẫn giữ sẵn chân nguyên mượn từ Bạch Ngưng Băng trong khiếu.',
  choices:[
    {t:'Đánh',eff:()=>{meet('auduongcong');fight2('auduongcong',{after:'q2_td_auduong_win'});return 'Hắn không ngờ một gia nô có cổ Tam chuyển.'}},
    {t:'Chạy vào lều Tâm Từ nhờ che chở',check:['tamco',14],ok:()=>{rel('tamtu',5);S.susp+=10;return 'Tâm Từ đứng ra. Âu Dương Công không dám động trước mặt người Thương gia.'},fail:()=>{fight2('auduongcong',{after:'q2_td_auduong_win',mod:1.1});return 'Hắn đuổi kịp.'}},
  ]},
});

ENDINGS.q2_thuongluong={t:'Trước cổng Thương gia thành',d:'Từ Thanh Mao Sơn, qua sông Hoàng Long, Bạch Cốt Sơn, tới Thương gia thành. Tên giả Hắc Thổ, trong tay có Cốt Nhục Đoàn Viên và hơn trăm nguyên thạch. Còn tiếp: Thương gia thành, diễn võ trường, Tam Vương truyền thừa.'};
