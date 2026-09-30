// Quyển 2 · Chương 2.2: Bạch Cốt Sơn và Bách gia (canon VN 228–257)
// Mạo danh "Cổ Nguyệt Phương Chính", đại săn, truyền thừa Hôi Cốt Tài Tử, Cốt Nhục Đoàn Viên, trốn bằng Vô Túc Điểu.

CHAPTERS.q2_bachcot={n:'Bạch Cốt Sơn',title:'Quyển hai · Chương hai · Bạch Cốt Sơn',unit:'tuần',turns:10,bg:'bg_snow',cap:2,
  intro:'Bách gia dựng trại dưới chân núi xương. Láng giềng của họ là Phương gia, Liêu gia, Phạm gia.',
  ask:'Tuần này làm gì?',shop:Q2_SHOP.bachcot,
  canon:{1:'q2_bc_toi',2:'q2_bc_maodanh',3:'q2_bc_daisan',4:'q2_bc_tiec',5:'q2_bc_dausan',6:'q2_bc_thietgia',7:'q2_bc_hang',8:'q2_bc_sanh',9:'q2_bc_suho',10:'q2_bc_tron'},
  side:['q2_bc_lolang','q2_bc_daokho'],
  spots:[
    {id:'bctrai',x:20,y:58,g:'寨',n:'Trại Bách gia',d:'Tiệc rượu, dò la, đấu đá.',loc:'bc_trai',evP:.75,quiet:'Người Bách gia cười nói với ngươi, mắt thì không cười.'},
    {id:'bcsan',x:50,y:70,g:'猎',n:'Đồng săn',d:'Săn thú, lấy nguyên thạch.',loc:'bc_san',foes:['khicuongtru','gauden'],evP:.4,foeP:.8},
    {id:'bcnui',x:66,y:30,g:'骨',n:'Sườn Bạch Cốt Sơn',d:'Rừng xương, cốt thú, suối sữa.',loc:'bc_nui',foes:['cotthu'],evP:.5,foeP:.8},
    {id:'baicanh',x:36,y:36,g:'冰',n:'Ở cạnh Bạch Ngưng Băng',d:'Bàn mưu, luyện đao.',run:baiLesson},
    {id:'tuluyen',x:82,y:58,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:10,y:34,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'market',minor:1,x:28,y:80,g:'市',n:'Chợ Bách gia',d:'Mua bán'},
    {id:'refine',minor:1,x:90,y:26,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EV,{
q2_bc_toi:{canon:1,title:'Khí Cương Trư',hint:'Tới Bạch Cốt Sơn',g:'猪',
  text:()=>'Một gia đình Khí Cương Trư đuổi theo hai người tới tận chân núi. Trên sườn núi xương, một đội áo sắt đang tìm hố cổ thảo: người Thiết gia đã tới trước.',
  choices:()=>[
    {t:'Quay lại đánh đàn heo',eff:()=>{fight2('khicuongtru',{after:'q2_bc_tru'});return 'Heo con mang cổ Nhất chuyển. Không nên bỏ phí.'}},
    {t:'Dẫn đàn heo về phía đội Thiết gia',tag:'ma',canon:1,check:['tamco',12],ok:()=>{S.stones+=15;S.f.thietMatNguoi=1;return 'Đàn heo xông vào đội áo sắt. Ngươi nhặt được túi nguyên thạch một người đánh rơi. +15.'},fail:()=>{fight2('khicuongtru',{after:'q2_bc_tru'});return 'Đàn heo không đổi hướng.'}},
  ]},
q2_bc_maodanh:{canon:1,title:'Thiếu chủ Cổ Nguyệt',hint:'Mạo danh',g:'名',who:'bachtoc',
  text:()=>'Người Bách gia chặn đường hỏi lai lịch. Ngươi cần một cái tên đủ nặng để được mời vào trại mà không bị lục soát.',
  choices:()=>[
    {t:'"Cổ Nguyệt Phương Chính, thiếu chủ Cổ Nguyệt. Tộc trưởng và gia lão đang tới sau."',canon:1,check:['tamco',13],
      ok:()=>{meet('bachtoc');rel('bachtoc',15);S.f.maodanh=1;S.danh+=10;return 'Nữ tộc trưởng Bách gia đích thân ra đón, mời dự tiệc. Bạch Ngưng Băng đóng vai hộ vệ. Trong mắt bà ta là một câu hỏi: nguyên tuyền của Cổ Nguyệt ở đâu.'},
      fail:()=>{meet('bachtoc');S.f.maodanh=1;S.susp+=15;return 'Họ mời vào, nhưng cử người canh cửa lều. Hiềm nghi +15.'}},
    {t:'Tự xưng tán tu đi ngang',eff:()=>{S.stones-=Math.min(S.stones,10);return 'Bách gia thu phí qua đường 10 nguyên thạch, cho ở trại ngoài.'}},
  ]},
q2_bc_daisan:{canon:1,title:'Đại săn bảy ngày',hint:'Đại săn',g:'猎',
  text:()=>'Bách gia mở đại săn bảy ngày, khách cũng được dự. Ai săn được con mồi lớn nhất có thưởng. Đất Bạch Cốt Sơn toàn là xương: Tiêu Lôi Thổ Đậu chôn xuống vô dụng.',
  choices:()=>[
    {t:'Săn gấu đen trưởng thành trên đồng, nơi còn đất thật',canon:1,eff:()=>{fight2('gauden',{after:'q2_bc_gau'});return 'Ngươi dụ nó ra khỏi rừng xương.'}},
    {t:'Để Bạch Ngưng Băng săn, ngươi quan sát Bách gia',eff:()=>{S.tamco++;learn('q2_bachgia');return 'Ngươi đếm được số gia lão, chỗ đặt trạm gác, và thấy Bách Liên nhìn ngươi quá lâu. Tâm cơ +1.'}},
  ]},
q2_bc_tiec:{canon:1,title:'Tiệc của Bách gia',hint:'Bách Chiến Liệp gây sự',g:'宴',who:'bachchienliep',
  text:()=>'Tiệc nhỏ cho những người săn giỏi: Bách Mạch Đình gầy gò, Bách Thảo Suất, hoa khôi Bách Liên, và Bách Chiến Liệp. Chiến Liệp nhìn thấy Bách Liên ngồi cạnh ngươi.',
  choices:()=>[
    {t:'Nhận lời thách, đổi thành đấu săn theo đội năm người',canon:1,eff:()=>{meet('bachchienliep');meet('bachlien');S.f.dausan=1;return 'Đội ngươi: Bạch Ngưng Băng, Bách Liên, Bách Thịnh Cảnh và một người nữa. Rõ ràng là Bách gia sắp đặt.'}},
    {t:'Đánh hắn ngay trong tiệc',tag:'ma',eff:()=>{meet('bachchienliep');fight2('bachchienliep',{after:'q2_bc_liep',solo:1,spare:.3,spareT:'Nữ tộc trưởng quát dừng tay. Chiến Liệp thu cổ, cười khinh.'});return 'Bàn tiệc đổ nhào.'}},
    {t:'Nhún nhường cho qua',eff:()=>{S.danh-=5;S.tamco++;return 'Ngươi nâng chén nhận thua. Danh vọng −5, tâm cơ +1.'}},
  ]},
q2_bc_dausan:{canon:1,title:'Đấu săn',hint:'Đấu săn theo đội',g:'猎',who:'bachlien',
  text:()=>'Bách gia "cho thêm mồi": Chiến Liệp vừa bắt được Du Long Điệp cổ Tam chuyển. Đội ngươi phải lên Bạch Cốt Sơn săn cốt thú mới thắng nổi. Bách Liên còn kéo thêm hai đứa nhỏ, Bách Sinh và Bách Hoa, đi cùng.',
  choices:()=>[
    {t:'Lên núi săn cốt thú',canon:1,eff:()=>{meet('bachlien');fight2('cotthu',{after:'q2_bc_cotthu'});return 'Rừng xương trắng lóa dưới nắng.'}},
    {t:'Nhờ Bách Liên dẫn đường, dò xem nàng muốn gì',check:['tamco',13],ok:()=>{learn('q2_bachgia');S.f.bachlienLo=1;return 'Nàng lén dùng một con cổ gây lo âu trong mười bước quanh người, chờ ngươi để lộ lo lắng khi nhắc tới Bạch Cốt Sơn. Ngươi mỉm cười. Ngươi biết Bách gia muốn gì.'},fail:()=>{S.susp+=10;return 'Ngươi thấy bồn chồn khó hiểu cả buổi. Hiềm nghi +10.'}},
  ]},
q2_bc_thietgia:{canon:1,title:'Hố Tiêu Lôi',hint:'Đội Thiết gia',g:'铁',
  text:()=>'Đội Thiết gia đã mất người vì cá sấu và Hiên Viên Thần Kê. Họ đi tìm hố cổ thảo trên sườn dốc, nơi còn đất thật. Công tử Thiết Ngạo Thiên dẫn đầu.'+(hasGu('tieuloi')?' Trong không khiếu ngươi, Tiêu Lôi Thổ Đậu khẽ động.':''),
  choices:()=>[
    {t:'Chôn Tiêu Lôi Thổ Đậu quanh hố, chờ họ tới',tag:'ma',canon:1,dao:12,req:()=>hasGu('tieuloi'),reqT:'Cần Tiêu Lôi Thổ Đậu',
      eff:()=>{S.f.thietNo=1;S.susp+=20;S.stones+=40;meet('daokho');later('q2_bc_daokho2',1,2);return 'Hơn trăm hạt đậu nổ cùng lúc. Thiết Ngạo Thiên chết không còn nguyên xác. Chỉ Thiết Đao Khổ sống nhờ một con cổ biến thân. Ngươi nhặt túi của người chết: +40 nguyên thạch. Hiềm nghi +20.'}},
    {t:'Tránh xa đội Thiết gia',eff:()=>{S.tamco++;return 'Chuyện của họ, để họ tự lo. Tâm cơ +1.'}},
    {t:'Đánh úp một mình tên đi cuối',tag:'ma',drift:6,eff:()=>{fight2('thietgiadoi',{after:'q2_bc_thiet',mod:.75});return 'Ngươi chọn kẻ tụt lại xa nhất.'}},
  ]},
q2_bc_hang:{canon:1,title:'Hang gai xương',hint:'Lối vào truyền thừa',g:'洞',
  text:()=>'Trong một hang trên núi, những gai xương xoắn ốc mọc chi chít. Xoay đúng gai to nhất thì cửa mở: truyền thừa của Hôi Cốt Tài Tử. Bách Sinh và Bách Hoa đứng sau lưng ngươi. Người được truyền thừa "chọn" thường có vận khí.',
  choices:()=>[
    {t:'Bắt hai đứa nhỏ đi cùng, đuổi gia lão Bách gia ra',tag:'ma',canon:1,dao:10,eff:()=>{S.f.bachSinh=1;S.susp+=10;learn('q2_hoicot');return 'Bách Sinh cắn răng che cho em. Nữ tộc trưởng nhìn thấy qua khói ghi hình, nhưng không dám động vào con tin.'}},
    {t:'Vào một mình với Bạch Ngưng Băng',eff:()=>{learn('q2_hoicot');return 'Không có con tin, Bách gia sẽ theo sát sau lưng.'}},
  ]},
q2_bc_sanh:{canon:1,title:'Sảnh suối sữa',hint:'Chọn cổ truyền thừa',g:'骨',
  text:()=>'Sảnh đầu: vạc suối sữa nuôi hàng trăm Cốt Thương. Sảnh hai: ba cột xương, mỗi cột một con cổ Tam chuyển. Chỉ được chọn một.',
  choices:()=>[
    {t:'Luyện hóa hết Cốt Thương, hủy phần còn lại, chọn Cốt Thứ cổ',canon:1,eff:()=>{gainGu('cotthuong');gainGu('loatoan');gainGu('cotthu');S.stones+=30;S.susp+=5;return 'Hơn hai trăm Cốt Thương vào không khiếu trong vài khắc nhờ Xuân Thu Thiền và Bảo Liên. Phần còn lại ngươi đập nát, không để lại cho Bách gia. Cột thứ ba: Cốt Thứ cổ.'}},
    {t:'Chọn Ngọc Cốt và Thiết Cốt, cổ làm xương cứng',eff:()=>{gainGu('cotthuong');gainGu('ngoccot');gainGu('thietcot');return 'Xương cứng thì mới dùng được Ngạc Lực lâu dài.'}},
    {t:'Dập đầu trước hài cốt chủ nhân, chờ mật đạo',check:['ngo',13],bonus:()=>mem('q2_hoicot')?5:0,ok:()=>{gainGu('cotthuong');gainGu('cotthu');gainGu('ngoccot');return 'Mật đạo thứ hai mở. Ngươi đạp nát hài cốt, lấy thêm Ngọc Cốt cổ.'},fail:()=>{gainGu('cotthuong');return 'Không có gì xảy ra. Chỉ còn Cốt Thương.'}},
  ]},
q2_bc_suho:{canon:1,title:'Kim tự tháp sư hổ',hint:'Cốt Nhục Đoàn Viên',g:'肉',
  text:()=>'Sảnh lớn nhất, sáu mẫu, giữa là kim tự tháp xương và tượng đầu sư hổ mắt hồng ngọc: "Song Tử đồng tâm, Tam Linh hợp nhất." Ngươi và Bạch Ngưng Băng đặt tay lên, cửa không mở. Hai người không đồng tâm. Lò luyện bên trong cần huyết nhục tươi.'+(S.f.bachSinh?' Bách Sinh và Bách Hoa đứng co ro trong góc.':''),
  choices:()=>[
    ...(S.f.bachSinh?[{t:'Ném Bách Sinh và Bách Hoa vào lò, rồi cắt thịt mình và nàng',tag:'ma',canon:1,dao:25,eff:()=>{S.f.bachSinhChet=1;gainGu('cotnhuc');baiRel(-5);S.hp=Math.max(1,S.hp-30);S.susp+=15;return 'Hai đứa trẻ không phải cổ sư, lửa chưa đủ. Ngươi cắt thịt mình, Bạch Ngưng Băng cắn răng cắt thịt nàng. Lửa hóa đỏ tím. Cốt Nhục Đoàn Viên thành hình: cổ đổi được thiên hạ. Ngươi vừa bóp chết "chính đạo song tinh" của Bách gia.'}}]:[]),
    {t:'Chỉ dùng máu thịt của mình và nàng',drift:8,check:['ngo',14],ok:()=>{gainGu('cotnhuc');S.hp=Math.max(1,S.hp-45);baiRel(8);return 'Lửa cháy yếu nhưng đủ. Cốt Nhục Đoàn Viên thành hình. Khí huyết −45.'},fail:()=>{S.hp=Math.max(1,S.hp-40);S.stones+=20;return 'Lửa tắt. Ngươi chỉ vơ được ít nguyên thạch quanh tháp. Khí huyết −40.'}},
    {t:'Bỏ tháp, rời truyền thừa',eff:()=>{S.stones+=20;return 'Ngươi mang theo những gì đã có.'}},
  ]},
q2_bc_tron:{canon:1,title:'Vách núi',hint:'Trốn khỏi Bạch Cốt Sơn',g:'逃',sc:'fire',
  text:()=>'Bách gia chặn cửa ra. Nữ tộc trưởng phóng Hàn Ngư cổ, một gia lão bóp vỡ cổ trong khiếu ngươi từ xa. Gia lão Bách Chiến Ôn bước ra, Hỏa Nhân cổ cháy quanh người.'+(S.f.bachSinhChet?' Họ đã biết hai đứa trẻ chết thế nào.':''),
  choices:()=>[
    {t:'Chạy ra vách núi, cưỡi Vô Túc Điểu',canon:1,eff:()=>{gainGu('votucdieu');S.f.votuc=1;later('q2_bc_roi',0,0);return 'Vô Túc Điểu một ngày vạn dặm, không có chân, chạm đất là chết. Không bay thì chết.'}},
    {t:'Đánh mở đường',eff:()=>{fight2('bachchienon',{after:'q2_bc_on',spare:.25,spareAfter:'q2_bc_on_hong',spareT:'Hỏa Nhân cổ lao tới định đồng quy vu tận. Bạch Ngưng Băng kéo ngươi nhảy khỏi vách núi.'});return 'Lửa và xương va nhau.'}},
  ]},
q2_bc_roi:{title:'Núi Tử U',g:'紫',
  text:()=>'Vô Túc Điểu kiệt sức, rơi xuống rừng tím núi Tử U. Nó chạm đất và chết. Ban ngày rừng này yên, ban đêm thì không.',
  choices:[{t:'Tìm đường ra trước khi trời tối',eff:()=>{loseGu('votucdieu');chapEnd('q2_thuongdoi');return 'Chương hai kết thúc.'}}]},

// bên lề
q2_bc_lolang:{title:'Cổ lo âu',g:'莲',who:'bachlien',cond:()=>S.turn>=3,
  text:()=>'Bách Liên ngồi xuống cạnh ngươi, rót rượu. Tự nhiên ngươi thấy bồn chồn, muốn nói ra điều gì đó.',
  choices:[
    {t:'Nhận ra cổ gây lo âu, giả vờ lo đúng chỗ nàng muốn',check:['tamco',13],ok:()=>{rel('bachlien',10);S.f.bachLua=1;return 'Ngươi "lỡ lời" rằng tộc trưởng Cổ Nguyệt sắp tới. Bách gia sẽ chờ.'},fail:()=>{S.susp+=8;return 'Ngươi nói nhiều hơn mình muốn. Hiềm nghi +8.'}},
    {t:'Đứng dậy bỏ đi',eff:()=>'Nàng nhìn theo.'},
  ]},
q2_bc_daokho:{title:'Người Thiết gia',g:'刀',who:'daokho',cond:()=>S.turn>=4,
  text:()=>'Một đao khách Thiết gia ghé trại. Hắn kể: ba trại ở Thanh Mao Sơn đã diệt, có ma tu chạy thoát, Thiết gia đang truy.',
  choices:[{t:'Nghe rồi đi',eff:()=>{meet('daokho');S.tamco++;return 'Tên hắn là Thiết Đao Khổ. Tâm cơ +1.'}}]},
q2_bc_daokho2:{title:'Đao khách sống sót',g:'刀',who:'daokho',
  text:()=>'Thiết Đao Khổ sống sót sau vụ nổ, bị Bách gia giữ lại. Hắn chính trực: sẽ xác nhận trước khi trả thù.',
  choices:[{t:'Ghi nhớ gương mặt hắn',eff:()=>{rel('daokho',-20);return 'Sớm muộn gì hắn cũng tới tìm ngươi.'}}]},

// nơi chốn
q2r_bc_ruou:{loc:'bc_trai',title:'Giả say',g:'酒',text:()=>'Tiệc rượu kéo dài. Doanh trại canh gác nghiêm ngặt.',
  choices:[{t:'Giả say, đi lạc để thử đường',check:['tamco',12],ok:()=>{S.tamco++;return 'Ngươi thuộc hết đường trong trại. Tâm cơ +1.'},fail:()=>{S.susp+=8;return 'Lính gác đưa ngươi về lều, không tin ngươi say. Hiềm nghi +8.'}}]},
q2r_bc_gialao:{loc:'bc_trai',title:'Gia lão thăm dò',g:'老',text:()=>'Một gia lão Bách gia hỏi han về Cổ Nguyệt, về nguyên tuyền, về đường núi.',
  choices:[
    {t:'Nói nửa thật nửa giả',check:['tamco',12],ok:()=>{S.stones+=15;return 'Lão tặng 15 nguyên thạch "làm quà gặp mặt".'},fail:()=>{S.susp+=10;return 'Lão nhíu mày. Hiềm nghi +10.'}},
    {t:'Từ chối khéo',eff:()=>'Lão cười rồi đi.'},
  ]},
q2r_bc_bay:{loc:'bc_san',title:'Bẫy thú',g:'猎',text:()=>'Dấu chân thú dày đặc quanh một vũng nước.',
  choices:[{t:'Đặt bẫy',check:['satphat',10],ok:()=>{S.stones+=rand(10,18);S.blood++;return 'Được thú và huyết khí.'},fail:()=>'Thú không tới.'}]},
q2r_bc_suoi:{loc:'bc_nui',title:'Suối sữa xương',g:'泉',text:()=>'Giữa rừng xương có một khe nước trắng như sữa. Cốt Thương uống thứ này mà sống.',
  choices:[{t:'Múc đầy bình',eff:()=>{S.f.suaXuong=(S.f.suaXuong||0)+3;S.gu.forEach(g=>{if(['cotthuong','loatoan','cotthu'].includes(g.k))g.h=0});return 'Cổ xương no nê.'}}]},
});

Object.assign(AFTER,{
  q2_bc_tru:()=>{S.stones+=10;if(Math.random()<.5){const k=pick(WILD);gainGu(k,true);log(`Heo con mang ${GU[k].n}.`,'good')}},
  q2_bc_gau:()=>{gainGu('xaloi1');S.danh+=10;log('Bách gia thưởng người săn giỏi: Thanh Đồng Xá Lợi Cổ.','big')},
  q2_bc_liep:()=>{S.danh+=8;rel('bachchienliep',-30);log('Bách Chiến Liệp nằm dưới đất. Bách Liên nhìn ngươi bằng ánh mắt khác.','good')},
  q2_bc_cotthu:()=>{S.stones+=20;S.danh+=6;log('Đội ngươi mang về xương cốt thú. Bách gia nhìn nhau.','good')},
  q2_bc_thiet:()=>{S.susp+=10;S.stones+=20;log('Người Thiết gia chết không kịp kêu. Thiết gia sẽ đếm lại quân số.','danger')},
  q2_bc_on:()=>{S.stones+=60;S.danh+=15;chapEnd('q2_thuongdoi');log('Bách Chiến Ôn ngã. Hỏa Nhân cổ tắt trước khi kịp nổ. Ngươi rời Bạch Cốt Sơn bằng đường chính.','big')},
  q2_bc_on_hong:()=>{chapEnd('q2_thuongdoi');S.hp=Math.max(1,Math.round(maxHp()*.3));log('Hai người rơi xuống rừng tím núi Tử U, sống sót.','big')},
});
