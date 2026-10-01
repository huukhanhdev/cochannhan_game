// Quyển 2 · Chương 2.2: Bạch Cốt Sơn và Bách gia (canon VN 228–257)
// Mạo danh "Cổ Nguyệt Phương Chính", đại săn, truyền thừa Hôi Cốt Tài Tử, Cốt Nhục Đoàn Viên, trốn bằng Vô Túc Điểu.

CHAPTERS.q2_bachcot={n:'Bạch Cốt Sơn',title:'Quyển hai · Chương hai · Bạch Cốt Sơn',unit:'tuần',turns:10,bg:'scene_bach_cot',cap:2,
  intro:'Bách gia dựng trại dưới chân núi xương. Láng giềng của họ là Phương gia, Liêu gia, Phạm gia.',
  ask:'Tuần này làm gì?',shop:Q2_SHOP.bachcot,
  canon:{1:'q2_bc_toi',2:'q2_bc_maodanh',3:'q2_bc_daisan',4:'q2_bc_tiec',5:'q2_bc_dausan',6:'q2_bc_thietgia',7:'q2_bc_hang',8:'q2_bc_sanh',9:'q2_bc_suho',10:'q2_bc_tron'},
  side:['q2_bc_lolang','q2_bc_daokho'],
  spots:[
    {id:'bctt',x:48,y:46,g:'骨',n:'Dò các nhánh truyền thừa',d:'Sảnh giả, cơ quan, cốt thú trong hầm. Bách gia bám sau lưng.',loc:'bc_tt',evP:.7,foes:['cotthu'],foeP:.6,show:()=>S.f.inHoiCot},
    {id:'bctrai',show:()=>!S.f.inHoiCot,x:20,y:58,g:'寨',n:'Trại Bách gia',d:'Tiệc rượu, dò la, đấu đá.',loc:'bc_trai',evP:.75,quiet:'Người Bách gia cười nói với ngươi, mắt thì không cười.'},
    {id:'bcsan',show:()=>!S.f.inHoiCot,x:50,y:70,g:'猎',n:'Đồng săn',d:'Săn thú, lấy nguyên thạch.',loc:'bc_san',foes:['khicuongtru','gauden'],evP:.4,foeP:.8},
    {id:'bcnui',show:()=>!S.f.inHoiCot,x:66,y:30,g:'骨',n:'Sườn Bạch Cốt Sơn',d:'Rừng xương, cốt thú, suối sữa.',loc:'bc_nui',foes:['cotthu'],evP:.5,foeP:.8},
    {id:'baicanh',x:36,y:36,g:'冰',n:'Ở cạnh Bạch Ngưng Băng',d:'Bàn mưu, luyện đao.',run:baiLesson},
    {id:'tuluyen',x:82,y:58,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:10,y:34,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'market',show:()=>!S.f.inHoiCot,minor:1,x:28,y:80,g:'市',n:'Chợ Bách gia',d:'Mua bán'},
    {id:'refine',show:()=>!S.f.inHoiCot,minor:1,x:90,y:26,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
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
      eff:()=>{
        S.f.thietNo=1;S.susp+=20;S.stones+=40;meet('daokho');later('q2_bc_daokho2',1,2);
        if(typeof storySetOutcome==='function') storySetOutcome('tiep_ngao_thien','slain_by_mine',{choiceText:'Dùng Tiêu Lôi Thổ Đậu nổ chết thiếu chủ Thiết gia Thiết Ngạo Thiên',isLech:false,note:'Thiết Đao Khổ sống sót thề báo thù, gieo mầm truy sát.'});
        return 'Hơn trăm hạt đậu nổ cùng lúc. Thiết Ngạo Thiên chết không còn nguyên xác. Chỉ Thiết Đao Khổ sống nhờ một con cổ biến thân. Ngươi nhặt túi của người chết: +40 nguyên thạch. Hiềm nghi +20.';
      }},
    {t:'Tránh xa đội Thiết gia',eff:()=>{S.tamco++;return 'Chuyện của họ, để họ tự lo. Tâm cơ +1.'}},
    {t:'Đánh úp một mình tên đi cuối',tag:'ma',drift:6,eff:()=>{fight2('thietgiadoi',{after:'q2_bc_thiet',mod:.75});return 'Ngươi chọn kẻ tụt lại xa nhất.'}},
  ]},
q2_bc_hang:{canon:1,title:'Hang gai xương',hint:'Lối vào truyền thừa',g:'洞',
  text:()=>'Trong một hang trên núi, những gai xương xoắn ốc mọc chi chít. Xoay đúng gai to nhất thì cửa mở: truyền thừa của Hôi Cốt Tài Tử. Bách Sinh và Bách Hoa đứng sau lưng ngươi. Người được truyền thừa "chọn" thường có vận khí.',
  choices:()=>[
    {t:'Bắt hai đứa nhỏ đi cùng, đuổi gia lão Bách gia ra',tag:'ma',canon:1,dao:10,eff:()=>{S.f.inHoiCot=1;S.f.bachSinh=1;S.susp+=10;learn('q2_hoicot');return 'Bách Sinh cắn răng che cho em. Nữ tộc trưởng nhìn thấy qua khói ghi hình, nhưng không dám động vào con tin.'}},
    {t:'Vào một mình với Bạch Ngưng Băng',eff:()=>{S.f.inHoiCot=1;learn('q2_hoicot');return 'Không có con tin, Bách gia sẽ theo sát sau lưng.'}},
  ]},
// Truyền thừa Hôi Cốt Tài Tử (VN 239–244). Nhánh theo lựa chọn: tham hay không ở sảnh hai, dập đầu thật hay đạp hài cốt,
// có mang Bách Sinh và Bách Hoa theo hay không (hai đứa "được truyền thừa chọn", gõ răng ra cổ quý).
q2_bc_sanh:{canon:1,title:'Truyền thừa Hôi Cốt Tài Tử',hint:'Chọn cổ truyền thừa',g:'骨',
  scene:{
    start:'sua',budget:2,
    nodes:{
      sua:{
        talk:[
          ['','Xoay đúng gai xương to nhất, cửa đá mở. Sảnh đầu: một vạc suối sữa trắng đục, hàng trăm Cốt Thương Cổ và vài chục Loa Toàn Cốt Thương bơi lờ đờ.'],
          ['bainu','Nhiều thế này, ngươi định lấy hết?']
        ],
        choices:[
          {t:'Kéo gai xoắn thấp nhất, luyện hóa hết rồi đập nát phần còn lại',tag:'ma',canon:1,eff:()=>{gainGu('cotthuong');gainGu('loatoan');S.stones+=20;S.f.bcHuy=1;return 'Hơn hai trăm Cốt Thương và hơn hai mươi Loa Toàn vào không khiếu trong vài khắc, nhờ Xuân Thu Thiền và Bảo Liên. Phần còn lại ngươi đập nát. Bách gia tới sau sẽ không còn gì.'},go:'cot'},
          {t:'Chỉ lấy vừa đủ dùng, để lại cho người sau',tag:'chinh',eff:()=>{gainGu('cotthuong');return 'Ngươi lấy một ít Cốt Thương. Vạc sữa vẫn đầy.'},go:'cot'},
        ]
      },
      cot:{
        talk:[['','Sảnh hai: ba cột xương, mỗi cột đỡ một con cổ Tam chuyển. Dòng chữ khắc: "Chọn một."'],['','Lặc Cốt Thuẫn: hai hàng xương sườn che ngực, gần như không tốn chân nguyên. Phi Cốt Thuẫn: ba khiên xương bay quanh người. Ti Cốt Dực: cánh xương dọc cẳng tay, ra đòn nhanh hơn.']],
        choices:[
          {t:'Nhìn kỹ chân các cột xương',stay:1,check:['ngo',11],say:'Chân mỗi cột có một rãnh máu nối xuống dưới nền. Lấy một con thì rãnh đóng. Lấy nhiều hơn thì mật đạo phía sau sẽ đổi hướng.',flag:'biet_cot'},
          {t:'Chọn Phi Cốt Thuẫn',canon:1,eff:()=>{gainGu('phicotthuan');return 'Ba khiên xương bay lên, xoay quanh người ngươi.'},go:'haicot'},
          {t:'Chọn Lặc Cốt Thuẫn',eff:()=>{gainGu('lacotthuan');return 'Hai hàng xương sườn mọc ra trước ngực, cứng như sắt.'},go:'haicot'},
          {t:'Chọn Ti Cốt Dực',eff:()=>{gainGu('ticotduc');return 'Cánh xương mọc dọc cẳng tay. Nắm đấm nhẹ hẳn đi.'},go:'haicot'},
          {t:'Tham, lấy cả ba',tag:'ma',eff:()=>{gainGu('phicotthuan');gainGu('lacotthuan');gainGu('ticotduc');S.f.bcTham=1;return 'Ba cột xương cùng đổ. Dưới nền vang lên tiếng đá chuyển. Mật đạo phía sau đã đổi hướng.'},go:'haicot'},
        ]
      },
      haicot:{
        talk:()=>[['','Sảnh ba: một bộ hài cốt ngồi xếp bằng, trước mặt là Hôi Cốt Cự Thư. Chữ trên vách: người kế thừa phải dập đầu ba cái.'],...(S.f.bcTham?[['','Nền đá dưới hài cốt đã nứt từ lúc ba cột xương đổ. Mật đạo sâu nhất sẽ không mở nữa.']]:[])],
        choices:()=>[
          {t:'Dập đầu ba tiếng vang, rồi đứng yên, không động vào hài cốt',canon:1,check:['tamco',12],bonus:()=>mem('q2_hoicot')?5:0,
            ok:()=>{if(S.f.bcTham){gainGu('thanhnhiet');return 'Chỉ mật đạo thứ nhất mở. Trong hốc có một con Thanh Nhiệt Cổ và cuốn cốt thư.'}gainGu('cotthu');return 'Mật đạo thứ hai, sâu hơn, mở ra. Ngươi đạp nát hài cốt rồi mới đi. Trong hốc: Cốt Thứ Cổ.'},
            fail:()=>{gainGu('thanhnhiet');return 'Ngươi liếc hài cốt một lần. Chỉ mật đạo thứ nhất mở: Thanh Nhiệt Cổ và cuốn cốt thư.'},go:'bicac'},
          {t:'Đạp nát hài cốt, lục cự thư',tag:'ma',eff:()=>{S.stones+=15;return 'Cự thư toàn bí phương. Không mật đạo nào mở. Ngươi phải tự tìm cầu thang. +15 nguyên thạch vụn trong hài cốt.'},go:'bicac'},
        ]
      },
      bicac:{
        talk:()=>[
          ['','Cầu thang nghìn thước dẫn tới Nhục Nang Bí Các: vách thịt ấm, đầy những cái miệng đang cười. Một hàm răng ngọc mười chiếc treo giữa phòng. Sách nhỏ ghi: gõ răng tùy duyên để lấy cổ.'],
          ['bainu','Để ta.'],
          ['','Bạch Ngưng Băng gõ bừa. Một bộ răng ngọc rơi vào tay nàng: Nhục Bạch Cốt, cổ trị liệu Tam chuyển.'],
          ...(S.f.bachSinh?[['','Bách Sinh và Bách Hoa đứng nép vào vách thịt. Hai đứa trẻ "được truyền thừa chọn". Người có vận gõ răng thì ra cổ tốt.']]:[['','Không có ai khác. Gõ đúng thứ tự năm chiếc thì mới ra thứ quý.']])
        ],
        choices:()=>[
          ...(S.f.bachSinh?[{t:'Đá tỉnh hai đứa nhỏ, bắt chúng gõ răng',tag:'ma',canon:1,eff:()=>{gainGu('nhucbachcot');gainGu('votucdieu');gainGu('ngoccot');gainGu('thietcot');baiRel(-3);return 'Bách Hoa gõ ra Vô Túc Điểu và Thiết Cốt Cổ. Bách Sinh cắn răng che em, gõ ra Ngọc Cốt Cổ. Bạch Ngưng Băng tát nó một cái khi nó định cắn ngươi.'}}]:[]),
          {t:'Tự gõ, theo nhịp trên bức vách',check:['ngo',13],bonus:()=>mem('q2_hoicot')?5:0,
            ok:()=>{gainGu('nhucbachcot');gainGu('votucdieu');return 'Năm tiếng gõ đúng thứ tự. Một con chim xương không chân rơi xuống: Vô Túc Điểu.'},
            fail:()=>{gainGu('nhucbachcot');gainGu('ngoccot');return 'Ngươi gõ sai nhịp. Chỉ rơi ra Ngọc Cốt Cổ. Không có đường bay ra khỏi núi.'}},
          {t:'Không tham, đi tiếp',eff:()=>{gainGu('nhucbachcot');return 'Ngươi để Bạch Ngưng Băng giữ Nhục Bạch Cốt rồi đi tiếp.'}},
        ]
      },
    }
  }},
q2_bc_suho:{canon:1,title:'Kim tự tháp sư hổ',hint:'Cốt Nhục Đoàn Viên',g:'肉',
  text:()=>'Sảnh lớn nhất, sáu mẫu, giữa là kim tự tháp xương và tượng đầu sư hổ mắt hồng ngọc: "Song Tử đồng tâm, Tam Linh hợp nhất." Ngươi và Bạch Ngưng Băng đặt tay lên, cửa không mở. Hai người không đồng tâm. Lò luyện bên trong cần huyết nhục tươi.'+(S.f.bachSinh?' Bách Sinh và Bách Hoa đứng co ro trong góc.':''),
  choices:()=>[
    ...(S.f.bachSinh?[{t:'Ném Bách Sinh và Bách Hoa vào lò, rồi cắt thịt mình và nàng',tag:'ma',canon:1,dao:25,eff:()=>{
      S.f.bachSinhChet=1;gainGu('cotnhuc');baiRel(-5);S.hp=Math.max(1,S.hp-30);S.susp+=15;
      if(typeof storySetOutcome==='function') storySetOutcome('cotnhuc','refined_with_twins',{choiceText:'Hiến tế Bách Sinh, Bách Hoa và máu thịt bản thân luyện thành Cốt Nhục Đoàn Viên Cổ',isLech:false,note:'Đoạt được cổ song tu tuyệt phẩm, bóp chết Song Tinh Bách gia.'});
      return 'Hai đứa trẻ không phải cổ sư, lửa chưa đủ. Ngươi cắt thịt mình, Bạch Ngưng Băng cắn răng cắt thịt nàng. Lửa hóa đỏ tím. Cốt Nhục Đoàn Viên thành hình: cổ đổi được thiên hạ. Ngươi vừa bóp chết "chính đạo song tinh" của Bách gia.';
    }}]:[]),
    {t:'Chỉ dùng máu thịt của mình và nàng',drift:8,check:['ngo',14],ok:()=>{gainGu('cotnhuc');S.hp=Math.max(1,S.hp-45);baiRel(8);return 'Lửa cháy yếu nhưng đủ. Cốt Nhục Đoàn Viên thành hình. Khí huyết −45.'},fail:()=>{S.hp=Math.max(1,S.hp-40);S.stones+=20;return 'Lửa tắt. Ngươi chỉ vơ được ít nguyên thạch quanh tháp. Khí huyết −40.'}},
    {t:'Bỏ tháp, rời truyền thừa',eff:()=>{S.stones+=20;return 'Ngươi mang theo những gì đã có.'}},
  ]},
q2_bc_tron:{canon:1,title:'Vách núi',hint:'Trốn khỏi Bạch Cốt Sơn',g:'逃',sc:'fire',
  text:()=>'Bách gia chặn cửa ra. Nữ tộc trưởng phóng Hàn Ngư cổ, một gia lão bóp vỡ cổ trong khiếu ngươi từ xa. Gia lão Bách Chiến Ôn bước ra, Hỏa Nhân cổ cháy quanh người.'+(S.f.bachSinhChet?' Họ đã biết hai đứa trẻ chết thế nào.':''),
  choices:()=>[
    {t:'Chạy ra vách núi, cưỡi Vô Túc Điểu',canon:1,need:{gu:'votucdieu',t:'Cần Vô Túc Điểu (Bách Hoa gõ ra ở Nhục Nang Bí Các)'},eff:()=>{
      S.f.inHoiCot=0;S.f.votuc=1;
      if(typeof storySetOutcome==='function') storySetOutcome('escape_bachcot','escape_votucdieu',{choiceText:'Cưỡi Vô Túc Điểu bay vạn dặm trốn thoát khỏi Bạch Cốt Sơn',isLech:false,note:'Bị bỏng mặt rơi xuống núi Tử U, tạo lớp ngụy trang phàm nhân tự nhiên.'});
      later('q2_bc_roi',0,0);
      return 'Vô Túc Điểu một ngày vạn dặm, không có chân, chạm đất là chết. Không bay thì chết.';
    }},
    {t:'Nhảy vực theo Bạch Ngưng Băng, bật Khiêu Khiêu Thảo',need:{gu:'khieukhieu'},check:['satphat',13],ok:()=>{S.f.inHoiCot=0;S.hp=Math.max(1,S.hp-40);chapEnd('q2_thuongdoi');return 'Rễ lò xo bật ngươi qua khe vực. Hai người lăn xuống sườn núi, gãy mấy chiếc xương sườn. Khí huyết −40.'},fail:()=>{S.hp=Math.max(1,S.hp-30);fight2('bachchienon',{after:'q2_bc_on',spare:.25,spareAfter:'q2_bc_on_hong',spareT:'Hỏa Nhân cổ lao tới. Bạch Ngưng Băng kéo ngươi nhảy khỏi vách núi.'});return 'Nhảy hụt. Khí huyết −30. Bách Chiến Ôn đã tới.'}},
    {t:'Đánh mở đường',eff:()=>{S.f.inHoiCot=0;fight2('bachchienon',{after:'q2_bc_on',spare:.25,spareAfter:'q2_bc_on_hong',spareT:'Hỏa Nhân cổ lao tới định đồng quy vu tận. Bạch Ngưng Băng kéo ngươi nhảy khỏi vách núi.'});return 'Lửa và xương va nhau.'}},
  ]},
q2_bc_roi:{title:'Núi Tử U',g:'紫',
  text:()=>'Bách Chiến Ôn đuổi theo trên không, Hỏa Nhân cổ cháy rực. Ngươi điều khiển chim lượn vòng cho hắn đuổi hụt tới khi hắn tự bạo. Lửa táp qua: toàn thân ngươi bỏng, mặt cháy nham nhở. Vô Túc Điểu kiệt sức, rơi xuống rừng tím núi Tử U. Nó chạm đất và chết.',
  choices:[{t:'Tìm đường ra trước khi trời tối',eff:()=>{S.f.matBong=1;loseGu('votucdieu');chapEnd('q2_thuongdoi');return 'Chương hai kết thúc.'}}]},

// bên lề
q2_bc_lolang:{title:'Cổ lo âu',g:'莲',who:'bachlien',cond:()=>S.turn>=3&&!S.f.inHoiCot,
  text:()=>'Bách Liên ngồi xuống cạnh ngươi, rót rượu. Tự nhiên ngươi thấy bồn chồn, muốn nói ra điều gì đó.',
  choices:[
    {t:'Nhận ra cổ gây lo âu, giả vờ lo đúng chỗ nàng muốn',check:['tamco',13],ok:()=>{rel('bachlien',10);S.f.bachLua=1;return 'Ngươi "lỡ lời" rằng tộc trưởng Cổ Nguyệt sắp tới. Bách gia sẽ chờ.'},fail:()=>{S.susp+=8;return 'Ngươi nói nhiều hơn mình muốn. Hiềm nghi +8.'}},
    {t:'Đứng dậy bỏ đi',eff:()=>'Nàng nhìn theo.'},
  ]},
q2_bc_daokho:{title:'Người Thiết gia',g:'刀',who:'daokho',cond:()=>S.turn>=4&&!S.f.inHoiCot,
  text:()=>'Một đao khách Thiết gia ghé trại. Hắn kể: ba trại ở Thanh Mao Sơn đã diệt, có ma tu chạy thoát, Thiết gia đang truy.',
  choices:[{t:'Nghe rồi đi',eff:()=>{meet('daokho');S.tamco++;return 'Tên hắn là Thiết Đao Khổ. Tâm cơ +1.'}}]},
q2_bc_daokho2:{title:'Đao khách sống sót',g:'刀',who:'daokho',
  text:()=>'Thiết Đao Khổ sống sót sau vụ nổ, bị Bách gia giữ lại. Hắn chính trực: sẽ xác nhận trước khi trả thù.',
  choices:[{t:'Ghi nhớ gương mặt hắn',eff:()=>{rel('daokho',-20);return 'Sớm muộn gì hắn cũng tới tìm ngươi.'}}]},

// nơi chốn
// trong truyền thừa (VN 243: nhiều nhánh có sảnh giống hệt để đánh lừa)
q2r_tt_sanhgia:{loc:'bc_tt',title:'Sảnh giống hệt',g:'骨',text:()=>'Ngươi rẽ vào một nhánh khác. Cuối đường là một sảnh y hệt sảnh ba: hài cốt, cự thư, chữ khắc bảo dập đầu.',
  choices:[
    {t:'Soi kỹ vết mòn trên nền đá',check:['ngo',12],ok:()=>{S.tamco++;return 'Nền không mòn. Chưa ai từng quỳ ở đây: sảnh giả. Ngươi quay ra. Tâm cơ +1.'},fail:()=>{S.hp=Math.max(1,S.hp-20);return 'Ngươi quỳ xuống. Nền đá sụp, gai xương đâm lên. Khí huyết −20.'}},
    {t:'Không phí thời gian, quay lại',eff:()=>'Ngươi quay lại lối cũ.'},
  ]},
q2r_tt_bachgia:{loc:'bc_tt',title:'Tiếng bước chân phía sau',g:'足',text:()=>'Có tiếng bước chân nhẹ phía sau. Người Bách gia đang bám theo, chờ ngươi mở hết cửa cho họ.'+(S.f.bachSinh?' Họ không dám lại gần vì hai đứa nhỏ đang trong tay ngươi.':''),
  choices:()=>[
    {t:'Phục kích kẻ đi đầu',tag:'ma',eff:()=>{fight2('bachchienliep',{spare:.3,spareT:'Bách Chiến Liệp lùi vào bóng tối.'});return 'Ngươi nấp sau một khúc quanh.'}},
    {t:'Đánh sập một đoạn hành lang sau lưng',check:['satphat',12],ok:()=>{S.susp=Math.max(0,S.susp-5);return 'Đá xương đổ xuống. Bách gia mất nửa ngày mới đào qua.'},fail:()=>{S.hp=Math.max(1,S.hp-15);return 'Đá đổ trúng vai ngươi. Khí huyết −15.'}},
  ]},
q2r_tt_cotthu:{loc:'bc_tt',title:'Hầm cốt thú',g:'兽',text:()=>'Một hầm tối sâu hoắm, tiếng xương va lách cách. Cốt thú làm tổ dưới đó, giữa đống xương có ánh ngọc.',
  choices:[
    {t:'Xuống hầm',eff:()=>{fight2('cotthu',{});return 'Cốt thú trườn ra khỏi đống xương.'}},
    {t:'Dùng Cốt Thương bắn từ miệng hầm',req:()=>hasGu('cotthuong'),reqT:'Cần Cốt Thương Cổ',check:['satphat',11],ok:()=>{S.stones+=18;return 'Mấy phát Cốt Thương xuyên qua đống xương. Ngươi xuống nhặt nguyên thạch vụn. +18.'},fail:()=>{fight2('cotthu',{});return 'Cốt thú lao lên theo tiếng động.'}},
  ]},
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
  q2_bc_on_hong:()=>{S.f.matBong=1;chapEnd('q2_thuongdoi');S.hp=Math.max(1,Math.round(maxHp()*.3));log('Hai người rơi xuống rừng tím núi Tử U, sống sót.','big')},
});
