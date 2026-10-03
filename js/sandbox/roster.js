// Registry roster cho sandbox (KE_HOACH_DUA_ROSTER_VAO_BATTLE §2.1, §3, §9.2).
//  · characters: mọi id roster + trạng thái. Chỉ nhân vật có dossier đã validate mới có profile/kit; còn lại hiện "chờ".
//  · profiles: bộ chiêu cố định theo MỐC TRẬN (boss) hoặc preset thử nghiệm (PN). Khóa = profile id, KHÔNG phải actor id:
//    matchup() sao chép kit vào hai slot p1/p2 nên cùng một profile đứng được hai bên (đấu gương).
//  · Hình: kit chỉ ghi visual; thư mục sprite lấy từ SB_SPRITES (đổi bộ hình không sửa file này).
//  · PN trong campaign KHÔNG dùng preset ở đây: bộ chiêu dựng từ save (S.gu, tu vi, trạng thái, vật phẩm) — người dùng chốt 03/10.
//    pn_demo chỉ để thử sandbox khi không có save, là chuyển thể (không gọi là bộ cổ canon).
// Thêm nhân vật: (1) dossier docs/roster/<id>.md có mục kit, Orange validate; (2) thêm profile ở PROFILES với src từng chiêu;
// (3) characters[id].profiles=[...]; (4) node tools/sandbox_regression.cjs kiểm mọi profile.
(function(root){
  // Nạp sau kits.js và sprites.js (trình duyệt: thẻ script; node: tools/sandbox_sim.cjs gắn lên global).
  const KITS=root.SB_KITS,SPR=root.SB_SPRITES;
  if(!KITS||!SPR)throw new Error('roster.js cần nạp sau kits.js và sprites.js');

  // Lợn rừng Thanh Mao (dossier docs/roster/heo_rung.md, Orange validate G1 03/10). Không có cổ (ch.70–71).
  // Thú không có chân nguyên: ess 0, mọi đòn cost 0. Số liệu là game.
  const HEO_RUNG={n:'Lợn rừng',hp:120,ess:0,essRegen:0,speed:240,ai:{style:'charge'},
    atk:{id:'atk',n:'Hất nanh',icon:'牙',kind:'melee',clip:['atk'],startup:.45,active:.10,recovery:.40,cd:0,cost:0,range:110,depth:44,dmg:14,
      src:'VN ch.71: trọng thương vẫn có thể hất tung, nanh đâm · số liệu game',d:'Hất nanh trắng về phía trước.'},
    skills:[
      {key:'q',id:'lao',n:'Lao húc',icon:'猪',kind:'rush',clip:['sk_charge','atk'],startup:.65,active:.45,recovery:.60,cd:5,cost:0,
        dist:380,hitR:70,depth:40,dmg:24,knock:70,tags:['gapclose','burst'],
        src:'VN ch.70: lao mạnh, đổi hướng kém, PN né sang bên thì đâm gãy cây · ch.80: PN đỡ bằng vai vẫn lùi ba bước → khóa hướng + đẩy lùi (game)',
        d:'Hạ đầu lao thẳng theo hướng đã khóa; trúng thì đẩy lùi. Né sang bên là tránh được.'},
    ]};

  // ── Đợt 1 (B1, Orange đọc thay Blue 03/10; dossier ở docs/roster/<id>.md mục "Kit battle") ──
  // Số liệu là game. NPC người: khí huyết/chân nguyên theo công thức campaign (SB_GU.campaignMax) với chuyển/giai/tư chất
  // ghi ở profile; tư chất có nguồn thì ghi chương, không có thì ghi game.
  const GUD=()=>typeof GU!=='undefined'?GU:root.GU;
  const SBG=()=>root.SB_GU;
  const human=(chuyen,giai,tuchat)=>{const m=SBG().campaignMax({chuyen,giai,tuchat,gu:[]},GUD());return {hp:m.maxHp(),ess:m.maxEss()}};
  const gu=(k,o)=>Object.assign(JSON.parse(JSON.stringify(SBG().GU_SKILL[k](GUD()[k]))),o||{});
  const fist=o=>Object.assign({id:'atk',n:'Đánh tay',icon:'拳',kind:'melee',clip:['atk','attack'],startup:.14,active:.08,recovery:.28,cd:0,cost:0,range:85,depth:44,dmg:9,light:true,
    src:'game: đấm tay không như PN (học viên học cận chiến, VN ch.24)'},o||{});
  const NQ_CLIP=['sk_nguyet','sk_drain','cast','atk'];

  // Ngọc Nhãn Thạch Hầu (VN ch.79–80). Không cổ. Ở trong hốc cột đá, bị động mới lao ra; đuôi giúp lật người né giữa không trung.
  const THACH_HAU={n:'Ngọc Nhãn Thạch Hầu',hp:50,ess:0,essRegen:0,speed:300,ai:{stand:150},
    atk:{id:'atk',n:'Cào',icon:'爪',kind:'melee',clip:['atk'],startup:.35,active:.08,recovery:.35,cd:0,cost:0,range:80,depth:40,dmg:9,
      src:'VN ch.79: lao ra "đánh về phía" PN; cào/cắn là art (truyện không tả đòn)'},
    skills:[
      {key:'q',id:'vo',n:'Phóng vồ',icon:'猴',kind:'rush',clip:['sk_ambush','atk'],startup:.5,active:.3,recovery:.45,cd:3.5,cost:0,dist:240,hitR:60,depth:40,dmg:14,knock:30,tags:['gapclose'],
        src:'VN ch.79: "vèo một tiếng" phóng ra từ hốc đá đánh về phía PN · số liệu game',d:'Phóng người vồ thẳng theo hướng đã khóa.'},
      {key:' ',id:'dash',n:'Lật người',icon:'尾',kind:'dash',clip:['move'],startup:.04,active:.16,recovery:.1,cd:2.2,cost:0,dist:110,
        src:'VN ch.79: đuôi cực linh hoạt, kéo thân lật người giữa không trung, né được hai nguyệt nhận',d:'Lật người tránh đạn.'},
    ]};
  // Điện lang thường (VN ch.127, 130). Không cổ. Rất nhanh, nhìn bằng mắt (khứu giác kém, ch.127); nhào cắn.
  const DIEN_LANG={n:'Điện lang',hp:70,ess:0,essRegen:0,speed:320,
    atk:{id:'atk',n:'Cắn xé',icon:'牙',kind:'melee',clip:['atk'],startup:.35,active:.08,recovery:.35,cd:0,cost:0,range:90,depth:42,dmg:10,
      src:'VN ch.130: bầy sói "há mồm cắn xé", móng vuốt · số liệu game'},
    skills:[
      {key:'q',id:'vo',n:'Nhào cắn',icon:'狼',kind:'rush',clip:['roar','atk'],startup:.5,active:.3,recovery:.45,cd:4,cost:0,dist:260,hitR:64,depth:40,dmg:16,knock:20,tags:['gapclose'],
        src:'VN ch.130: bốn chân nhảy lên, nhào về phía PN, há miệng đầy răng nanh · số liệu game',d:'Nhảy nhào cắn theo hướng đã khóa.'},
    ]};
  // Lôi Quan Đầu Lang, vạn thú vương (VN ch.114, 127, 163–164). Đối thủ trong truyện: tộc trưởng Cổ Nguyệt Bác + gia lão, không phải PN.
  const LOI_QUAN={n:'Lôi Quan Đầu Lang',hp:600,ess:0,essRegen:0,speed:260,regen:4,
    story:{phases:[{id:'tru',at:.5,do:'enrage',speed:2,dmgMul:1.15,n:'Tru lên: tốc độ tăng gấp bội'}],
      src:'VN ch.164: đánh lâu thì ngửa mặt tru lên, toàn thân lóe điện, tốc độ tăng gấp bội · ngưỡng 50% là game'},
    atk:{id:'atk',n:'Cắn',icon:'牙',kind:'melee',clip:['atk'],startup:.65,active:.1,recovery:.5,cd:0,cost:0,range:150,depth:60,dmg:40,
      src:'VN ch.164: cắn một nhát xé đôi gia lão hóa vượn trắng · số liệu game'},
    skills:[
      {key:'q',id:'loigiap',n:'Giáp lôi điện',icon:'雷',kind:'buff',clip:['sk_thunder','idle'],startup:.15,active:.05,recovery:.2,cd:10,cost:0,group:'shield',red:.6,dur:2.5,tint:0x9fd8ff,tags:['guard'],
        src:'VN ch.164: lúc nguyệt nhận tím chém tới, toàn thân sáng lên hộ giáp lôi điện · số liệu game',d:'Hộ giáp sấm điện giảm 60% sát thương.'},
      {key:'w',id:'dientuong',n:'Điện tương',icon:'電',kind:'proj',clip:['sk_thunder','atk'],startup:.7,active:.05,recovery:.45,cd:6,cost:0,speed:380,range:420,dmg:18,count:5,spread:.2,fx:'thunder',tags:['poke'],
        src:'VN ch.164: đuôi liên tục vẫy, phun từng đám điện tương màu lam đẩy lùi cổ sư · số liệu game',d:'Phun quạt năm đám điện tương.'},
    ],
    notes:'Điện Nhãn cổ trong mắt (ch.127) nhìn thấu Ẩn Lân: bị động. Hồi máu do cổ trị liệu ký sinh (ch.164): regen 4/s.'};
  // Hắc Hùng: gấu đen thường, bị Ngự Hùng cổ điều khiển (Hùng Kiêu Mạn ch.146; PN ch.151). Không cổ riêng.
  const HAC_HUNG={n:'Hắc Hùng',hp:160,ess:0,essRegen:0,speed:220,
    atk:{id:'atk',n:'Vả gấu',icon:'掌',kind:'melee',clip:['atk'],startup:.55,active:.1,recovery:.45,cd:0,cost:0,range:110,depth:50,dmg:18,
      src:'VN ch.151: chân gấu vung ra rít gió, một cú vỗ gãy cổ người · số liệu game'},
    skills:[
      {key:'q',id:'lao',n:'Lao tới',icon:'熊',kind:'rush',clip:['sk_rage','atk'],startup:.65,active:.4,recovery:.6,cd:6,cost:0,dist:280,hitR:70,depth:46,dmg:20,knock:50,tags:['gapclose'],
        src:'VN ch.150: gấu ngựa gào rú xông vào Cuồng Điện Lang · số liệu game',d:'Gầm rồi lao thẳng.'},
    ]};
  // Học viên khóa PN, kỳ khảo hạch cuối năm (VN ch.82–83). Nhất chuyển; hai cổ mỗi người (ch.82).
  const MAC_BAC=()=>Object.assign({n:'Cổ Nguyệt Mạc Bắc',essRegen:1.2,speed:255,ai:{stand:210}},human(1,2,70),{
    atk:fist(),skills:[gu('nguyetquang',{key:'q',clip:NQ_CLIP,src:'VN ch.82–83: Mạc Bắc đấu bằng nguyệt nhận, vừa bắn vừa di chuyển · số liệu game'})],
    passive:'Hoàng Lạc Thiên Ngưu (VN ch.63 chọn; ch.82 đánh lâu không đỏ mặt không thở gấp): sức chịu đựng → hồi chân nguyên 1,2/s (game)',
    src:'Tư chất Ất (VN ch.4); Nhất chuyển ở ch.82–83 (thách đấu vượt cấp PC Nhị chuyển); giai là game'});
  const XICH_THANH=()=>Object.assign({n:'Cổ Nguyệt Xích Thành',essRegen:0,speed:255,ai:{stand:240}},human(1,2,44),{
    atk:fist(),skills:[gu('nguyetquang',{key:'q',clip:NQ_CLIP,src:'VN ch.82: nguyệt nhận trúng ngực đối thủ · số liệu game'}),
      {key:' ',id:'dash',n:'Long Hoàn Khúc Khúc',icon:'跳',kind:'dash',clip:['move'],startup:.05,active:.2,recovery:.15,cd:1.2,cost:4,dist:230,
        src:'VN ch.82–83: hai chân lóe đỏ cam, nhảy một cái lui mười thước; mỗi lần dùng tốn chân nguyên (ch.83) · số liệu game',d:'Nhảy xa né, tốn chân nguyên.'}],
    src:'Tư chất thật là Bính, biểu hiện giả Ất (VN ch.4); Nhất chuyển ch.82–83; dáng thấp bé mặt rỗ (ch.4)'});
  const PHUONG_CHINH=()=>Object.assign({n:'Phương Chính',essRegen:0,speed:265,ai:{stand:150,style:'midrange'}},human(2,0,88),{
    atk:fist({dmg:10,src:'VN ch.84: Phương Chính có kỹ năng cơ bản vững chắc · số liệu game'}),
    skills:[gu('nguyetquang',{key:'q',clip:['sk_nguyet','atk'],src:'VN ch.83: áp sát còn sáu thước rồi mới bắn Nguyệt Quang · số liệu game'}),
      gu('ngocbi',{key:'w',clip:['sk_nguyetnghe','idle'],src:'VN ch.76, 98: sở hữu Ngọc Bì (ch.84 hoảng nên quên dùng) · số liệu game'}),
      {key:' ',id:'dash',n:'Lộn người',icon:'翻',kind:'dash',clip:['move'],startup:.05,active:.18,recovery:.14,cd:2.5,cost:0,dist:120,
        src:'VN ch.83: lộn người về phía trước, nguyệt nhận lướt qua, tiếp tục xông lên · thân pháp, không phải cổ',d:'Lộn người né đạn.'}],
    src:'Tư chất Giáp (VN ch.4, 82); Nhị chuyển ở ch.83; số tư chất 88 là game'});
  // Cổ Nguyệt Thanh Thư đấu BNB (VN ch.140–142). Nhị chuyển dùng Mộc Mị để đấu cổ sư Tam chuyển (ch.139).
  const THANH_THU=()=>Object.assign({n:'Cổ Nguyệt Thanh Thư',essRegen:0,speed:265,ai:{stand:230}},human(2,2,60),{
    atk:fist({dmg:10}),
    skills:[
      {key:'q',id:'thanhdang',n:'Thanh Đằng',icon:'藤',kind:'grab',clip:['sk_tungcham','atk'],startup:.5,active:.1,recovery:.45,cd:5,cost:8,range:260,depth:50,dmg:14,pull:120,tags:['control','wood'],
        src:'VN ch.104: lòng bàn tay mọc cành dài mười lăm thước dùng như roi · ch.140: dây leo quấn eo kéo người · số liệu game',d:'Dây leo quấn và kéo đối thủ lại.'},
      {key:'w',id:'tungcham',n:'Tùng Châm',icon:'松',kind:'proj',clip:['sk_tungcham','atk'],startup:.45,active:.05,recovery:.35,cd:4,cost:10,speed:420,range:380,dmg:6,count:7,spread:.1,fx:'wood',tags:['poke','wood'],
        src:'VN ch.104, 141: vung tóc bắn ra vô số lá thông xanh, xuyên thủng hình nộm · số liệu game',d:'Mưa lá thông xòe quạt.'},
      gu('nguyettoan',{key:'e',clip:['sk_nguyettoan','atk'],src:'VN ch.104: Nguyệt Toàn cổ, ấn trăng non lòng bàn tay trái · cơ chế theo data.js · số liệu game'}),
      {key:'r',id:'mocmi',n:'Mộc Mị',icon:'木',kind:'transform',clip:['sk_nguyettoan','idle'],startup:.8,active:.05,recovery:.3,cd:40,cost:0,dur:12,tag:'wood',dmgMul:1.4,essRegen:6,regen:3,drainPct:.02,floor:.4,tags:['power'],
        src:'VN ch.126, 141: hóa yêu tinh cây, hút nguyên khí thiên nhiên (chân nguyên dồi dào), vết thương khép nhanh, cổ hệ mộc mạnh lên; dùng quá thì hóa gỗ mà chết · số liệu game',
        d:'Hóa yêu tinh cây 12s: hồi chân nguyên và máu, Thanh Đằng/Tùng Châm mạnh hơn; khí huyết tối đa giảm dần.'},
      {key:'1',id:'leaf',n:'Sinh Cơ Diệp',icon:'葉',kind:'heal',clip:['idle'],startup:.55,active:.05,recovery:.3,cd:8,cost:0,uses:1,amt:50,
        src:'VN ch.141: Sinh Cơ Diệp trên người Thanh Thư cũng hưởng lợi khi hóa yêu tinh cây · số lá là game'},
    ],
    src:'Nhị chuyển (VN ch.139); tư chất không rõ → 60 là game'});
  // BNB sau khi nổ tay (VN ch.140–143): mất Sương Yêu, còn Lam Điểu (ch.140), Băng Trùy năm mũi (ch.141), Thủy Tráo, Lốc.
  const BNB_CH140=()=>{const k=JSON.parse(JSON.stringify(KITS.bnb));
    k.skills=k.skills.filter(x=>x.id!=='suongyeu');delete k.story;
    k.skills.push({key:'e',id:'bangtruy',n:'Băng Trùy',icon:'錐',kind:'proj',clip:['cast','attack'],startup:.55,active:.05,recovery:.35,cd:5,cost:12,speed:450,range:420,dmg:9,count:5,spread:.08,fx:'ice',tags:['poke'],
      src:'VN ch.141: hư không ngưng kết năm mũi khoan băng, chỉ tay bắn ra (Q1, sau nổ tay) · số liệu game',d:'Năm mũi khoan băng.'});
    k.start={hp:Math.round(k.hp*.7),ess:k.ess,oneArm:true,detonated:true};
    k.src='VN ch.140: hi sinh Sương Yêu thì chỉ còn Lam Điểu Băng Quan (cổ tam chuyển); cụt tay phải ch.139; máu đầu trận 70% là game';
    return k};
  // ── Nhân vật thiết kế game (người dùng chốt 03/10): không có trong truyện, theo sự kiện campaign. src:'game'. ──
  // Chỉ số gốc lấy từ js/data.js (EN/EAI) để khớp campaign; nhịp/tầm đánh là số liệu sandbox.
  // Tửu Khôi: động Hoa Tửu tầng 4 "Bể đá ngầm" (events.js hs_dong): hũ rượu vỡ tự đứng dậy, trận pháp thủ hộ.
  const TUU_KHOI={n:'Tửu Khôi',hp:100,ess:0,essRegen:0,speed:170,regen:2,
    atk:{id:'atk',n:'Vung tay vò',icon:'酒',kind:'melee',clip:['atk'],startup:.6,active:.1,recovery:.45,cd:0,cost:0,range:100,depth:46,dmg:10,
      src:'game: EN.tuukhoi atk 9–15 (js/data.js), rối ghép từ vò rượu vỡ'},
    skills:[
      {key:'q',id:'manhvo',n:'Văng mảnh vò',icon:'瓮',kind:'proj',clip:['sk_regen','atk'],startup:.7,active:.05,recovery:.4,cd:5,cost:0,speed:360,range:300,dmg:6,count:3,spread:.15,fx:'fire',tags:['poke'],
        src:'game: thiết kế cho rối vò rượu',d:'Văng ba mảnh vò vỡ.'},
    ],
    notes:'Tái tụ: EAI.tuukhoi regen .06 khí huyết/lượt → regen 2/s (game).'};
  // Huyết Khôi: lăng mộ Nhất Đại (events.js c_huyetdong): máu dưới đáy hang ngưng thành hình người.
  // Điểm yếu thiết kế sẵn trong campaign (js/rt.js RT_WEAK.huyetkhoi): đang chảy máu thì không tái tụ.
  const HUYET_KHOI={n:'Huyết Khôi',hp:210,ess:0,essRegen:0,speed:200,regen:4,regenNoBleed:true,
    atk:{id:'atk',n:'Huyết thủ',icon:'血',kind:'melee',clip:['atk'],startup:.6,active:.1,recovery:.45,cd:0,cost:0,range:120,depth:50,dmg:16,
      src:'game: EN.huyetkhoi atk 13–21'},
    skills:[
      {key:'q',id:'huyettrieu',n:'Huyết triều',icon:'潮',kind:'aoe',clip:['sk_regen','atk'],startup:1,active:.15,recovery:.6,cd:7,cost:0,castRange:300,radius:100,dmg:26,armor:true,tags:['control'],
        src:'game: máu đáy hang dâng lên tại chỗ đối thủ',d:'Vòng máu dâng lên sau 1 giây.'},
    ],
    notes:'Tái tụ 4/s (EAI regen .1), ngừng khi đang chảy máu: dùng đòn gây chảy máu (Cứ Xỉ, Huyết Nguyệt) để hạ.'};
  // Huyết Thủ ma tu (EN.madutam): ma tu Tam chuyển áo đỏ thẫm, tay nhuộm máu tới khuỷu, sự kiện r_tukiep/d_huyetthu.
  // Lối đánh hút máu (EAI.madutam sk:'drain'); điểm yếu: cổ trị liệu làm đòn hút trượt (RT_WEAK.madutam).
  const MADUTAM=()=>Object.assign({n:'Huyết Thủ ma tu',essRegen:0,speed:270,ai:{stand:150}},human(3,1,50),{hp:380,
    atk:{id:'atk',n:'Huyết trảo',icon:'爪',kind:'melee',clip:['atk'],startup:.45,active:.08,recovery:.4,cd:0,cost:0,range:100,depth:46,dmg:16,drain:.5,
      src:'game: EN.madutam atk 22–32, hút máu (EAI drain)'},
    skills:[
      {key:'q',id:'lao',n:'Lao vồ',icon:'魔',kind:'rush',clip:['move','atk'],startup:.6,active:.3,recovery:.5,cd:5,cost:12,dist:320,hitR:64,depth:42,dmg:22,knock:30,drain:.5,tags:['gapclose'],
        src:'game',d:'Lao tới vồ, hút máu.'},
      {key:'w',id:'huyetthu',n:'Huyết thủ ấn',icon:'印',kind:'melee',clip:['sk_drain','atk'],startup:.8,active:.12,recovery:.5,cd:7,cost:20,range:130,depth:52,dmg:36,drain:.6,armor:true,tags:['burst'],
        src:'game: tên theo "Huyết Thủ"; không phải Huyết Thủ Ấn của Thương Yến Phi (truyện)',d:'Bàn tay máu đánh mạnh, hút máu, không bị ngắt khi lấy đà.'},
    ],
    src:'game: Tam chuyển (EN.madutam), hp 380 theo data.js'});

  // Hình nộm thử trạng thái (KE_HOACH_TRANG_THAI_HIEU_UNG S3): mỗi phím gây một trạng thái. Sát thương gần 0, máu lớn.
  // Chơi bên hình nộm để gây trạng thái lên PN máy; hoặc để hình nộm máy bắn lên bạn. Thông số khống chế là thử nghiệm (src game).
  const HINH_NOM={n:'Hình nộm thử trạng thái',hp:5000,ess:0,essRegen:0,speed:200,ai:{style:'tester'},
    atk:{id:'atk',n:'Gõ nhẹ',icon:'木',kind:'melee',clip:['atk'],startup:.4,active:.08,recovery:.3,cd:0,cost:0,range:90,depth:44,dmg:1,src:'game: hình nộm thử'},
    skills:[
      {key:'q',id:'thu_choang',n:'Thử choáng',icon:'暈',kind:'proj',clip:['atk'],startup:.45,active:.05,recovery:.3,cd:3,cost:0,speed:420,range:600,dmg:1,fx:'fire',tags:['poke'],
        applies:[{st:'stun',dur:.8}],src:'game: choáng 0,8s (thử 0,6–1s)',d:'Choáng 0,8s: không làm gì được, ngắt chiêu.'},
      {key:'w',id:'thu_troi',n:'Thử trói',icon:'縛',kind:'proj',clip:['atk'],startup:.45,active:.05,recovery:.3,cd:3,cost:0,speed:420,range:600,dmg:1,fx:'wood',tags:['poke'],
        applies:[{st:'root',dur:1.5}],src:'game: trói 1,5s',d:'Trói 1,5s: không đi/lướt, vẫn ra chiêu.'},
      {key:'e',id:'thu_phongcam',n:'Thử phong cấm',icon:'封',kind:'proj',clip:['atk'],startup:.45,active:.05,recovery:.3,cd:3,cost:0,speed:420,range:600,dmg:1,fx:'blood',tags:['poke'],
        applies:[{st:'seal',dur:2}],src:'game: phong cấm 2s',d:'Phong cấm 2s: không dùng cổ, vẫn đánh tay/vật phẩm.'},
    ]};

  // Preset PN theo cảnh = save giả, dựng bằng cùng adapter với campaign (SB_GU.pnKitFromSave). Chỉ dùng trong sandbox.
  const PN_SCENE={
    ch70:{chuyen:1,giai:2,tuchat:44,herbs:0,stones:3,gu:['xuanthu','tuutrung','nguyetquang','tieuguang'],
      src:'VN ch.70: năm cổ (Xuân Thu Thiền, Tửu Trùng, Nguyệt Quang, Tiểu Quang, Bạch Thỉ chưa dùng), chưa có cổ phòng ngự, chân nguyên cao giai'},
    ch79:{chuyen:1,giai:3,tuchat:44,herbs:0,stones:3,gu:['xuanthu','tuutrung','nguyetquang','tieuguang','bachthi','ngocbi'],
      src:'VN ch.79–80: Bạch Thỉ đã dùng (ch.70–71), Ngọc Bì (ch.63, 79); giai đỉnh phong là game'},
    ch84:{chuyen:2,giai:0,tuchat:44,herbs:0,stones:3,gu:['xuanthu','tuutrung','nguyetquang','tieuguang','bachthi','ngocbi'],
      src:'VN ch.81 Nhị chuyển sơ giai; ch.82 PN có sáu cổ; ch.84 dùng Nguyệt Quang'},
    // Hắc Thỉ đã đổi lấy Ngư Lân ở ch.127 (Blue kiểm chéo 03/10): không còn trong túi; sức trư đã luyện vào thân → bodyAtk.
    ch130:{chuyen:2,giai:1,tuchat:44,herbs:1,stones:3,bodyAtk:5,gu:['xuanthu','tuvi','nguyetmang','bachngoc','bachthi','anlan','cuudiep'],
      src:'VN ch.130: Nhị chuyển trung giai, Bạch Ngọc, sức hai trư, Ẩn Lân; Nguyệt Mang (ch.106), Tứ Vị (ch.105), Cửu Diệp (ch.102); Hắc Thỉ đã đổi ở ch.127, lực trư thứ hai đã luyện vào thân (bodyAtk); số lá là game'},
  };
  const pnScene=id=>()=>{const S=JSON.parse(JSON.stringify(PN_SCENE[id]));S.gu=S.gu.map(k=>({k,h:0}));S.hp=undefined;S.ess=undefined;
    const k=SBG().pnKitFromSave(S,Object.assign({GU:GUD()},SBG().campaignMax(S,GUD())));delete k.start;k.src=PN_SCENE[id].src;return k};

  const PROFILES={
    pn_demo:{char:'phuong_nguyen',kit:()=>KITS.pn,label:'Phương Nguyên (demo)',ch:'—',status:'demo',
      note:'Bộ chiêu sandbox cũ, chuyển thể; không phải bộ cổ ở một cảnh cụ thể. Campaign dựng từ save.'},
    bnb_q1:{char:'bach_ngung_bang_nam',kit:()=>KITS.bnb,label:'Bạch Ngưng Băng (Q1)',ch:'134–143',vs:'pn_demo',status:'kit'},
    heo_rung_q1:{char:'heo_rung',kit:()=>HEO_RUNG,label:'Lợn rừng',ch:'70–71, 80',vs:'pn_ch70',status:'kit'},
    pn_ch70:{char:'phuong_nguyen',kit:pnScene('ch70'),label:'Phương Nguyên · ch.70',ch:'70',status:'preset',note:'Preset sandbox (save giả theo truyện); campaign dùng save thật.'},
    pn_ch79:{char:'phuong_nguyen',kit:pnScene('ch79'),label:'Phương Nguyên · ch.79',ch:'79–80',status:'preset',note:'Preset sandbox.'},
    pn_ch84:{char:'phuong_nguyen',kit:pnScene('ch84'),label:'Phương Nguyên · ch.84',ch:'84',status:'preset',note:'Preset sandbox.'},
    pn_ch130:{char:'phuong_nguyen',kit:pnScene('ch130'),label:'Phương Nguyên · ch.130',ch:'130',status:'preset',note:'Preset sandbox.'},
    thach_hau_q1:{char:'thach_hau',kit:()=>THACH_HAU,label:'Ngọc Nhãn Thạch Hầu',ch:'79–80',vs:'pn_ch79',status:'kit'},
    dien_lang_q1:{char:'dien_lang',kit:()=>DIEN_LANG,label:'Điện lang',ch:'127–130',vs:'pn_ch130',status:'kit'},
    dian_lang_boss_q1:{char:'dian_lang_boss',kit:()=>LOI_QUAN,label:'Lôi Quan Đầu Lang',ch:'163–164',status:'kit',
      note:'Truyện: tộc trưởng + gia lão vây đánh, PN không đấu. Chênh cấp vạn thú vương: chỉ để thử.'},
    hac_hung_q1:{char:'hac_hung',kit:()=>HAC_HUNG,label:'Hắc Hùng',ch:'146–151',vs:'dien_lang_q1',status:'kit',note:'Cặp truyện: gấu Hùng gia đấu bầy điện lang (ch.146).'},
    mac_bac_ch83:{char:'mac_bac',kit:MAC_BAC,label:'Mạc Bắc · khảo hạch',ch:'82–83',vs:'phuong_chinh_ch83',status:'kit'},
    xich_thanh_ch83:{char:'xich_thanh',kit:XICH_THANH,label:'Xích Thành · khảo hạch',ch:'82–83',vs:'phuong_chinh_ch83',status:'kit'},
    phuong_chinh_ch83:{char:'phuong_chinh',kit:PHUONG_CHINH,label:'Phương Chính · khảo hạch',ch:'83–84',vs:'pn_ch84',status:'kit',note:'Cặp truyện: thắng Mạc Bắc, Xích Thành (ch.83), thua PN (ch.84).'},
    thanh_thu_ch141:{char:'thanh_thu',kit:THANH_THU,label:'Thanh Thư · Mộc Mị',ch:'140–142',vs:'bnb_q1_ch140',status:'kit'},
    tuu_khoi_game:{char:'tuu_khoi',kit:()=>TUU_KHOI,label:'Tửu Khôi (thiết kế game)',ch:'—',vs:'pn_ch84',status:'kit',note:'Động Hoa Tửu tầng 4; tái tụ.'},
    huyet_khoi_game:{char:'huyet_khoi',kit:()=>HUYET_KHOI,label:'Huyết Khôi (thiết kế game)',ch:'—',vs:'pn_demo',status:'kit',note:'Lăng mộ Nhất Đại; chảy máu thì không tái tụ (PN demo có Cứ Xỉ gây chảy máu).'},
    huyet_thu_game:{char:'huyet_thu_ma_tu',kit:MADUTAM,label:'Huyết Thủ ma tu (thiết kế game)',ch:'—',vs:'pn_ch70',status:'kit',note:'Tam chuyển gặp sớm: thường thua (đúng sự kiện). Cổ trị liệu làm đòn hút trượt.'},
    hinh_nom:{char:'hinh_nom',tool:true,kit:()=>HINH_NOM,label:'Hình nộm thử trạng thái',ch:'—',vs:'pn_demo',status:'kit',note:'Thử choáng/trói/phong cấm; chơi bên hình nộm để gây lên PN.'},
    bnb_q1_ch140:{char:'bach_ngung_bang_nam',kit:BNB_CH140,label:'Bạch Ngưng Băng (Q1, sau nổ tay)',ch:'140–143',vs:'thanh_thu_ch141',status:'kit'},
  };

  // st: kit = có profile · cho_dossier = chờ Blue đọc truyện/dossier · khong_dau = NPC hoặc thiếu clip chiến đấu · cho_quyet = người dùng chưa chốt.
  // seen: cổ/đòn đã đọc được (điểm xuất phát, CHƯA thành chiêu) — chi tiết và nguồn ở plan §4.
  const C=(n,batch,ch,st,seen,more)=>Object.assign({n,batch,ch,st,seen,visual:null,profiles:[]},more||{});
  const characters={
    phuong_nguyen:C('Phương Nguyên',0,'—','kit','Campaign: dựng từ save; sandbox có preset theo cảnh',{profiles:['pn_demo','pn_ch70','pn_ch79','pn_ch84','pn_ch130']}),
    bach_ngung_bang_nam:C('Bạch Ngưng Băng (nam, Q1)',0,'134–143','kit','Băng nhận, Thủy Tráo, Sương Yêu, Lốc, Lam Điểu',{profiles:['bnb_q1','bnb_q1_ch140']}),
    heo_rung:C('Lợn rừng',1,'70–71','kit','Không cổ: lao húc, hất nanh',{profiles:['heo_rung_q1']}),
    thach_hau:C('Ngọc Nhãn Thạch Hầu',1,'79','kit','Không cổ; đuôi linh hoạt, lật người né',{profiles:['thach_hau_q1']}),
    dien_lang:C('Điện Lang',1,'130–160','kit','Thú: cắn, vồ',{profiles:['dien_lang_q1']}),
    dian_lang_boss:C('Lôi Quan Đầu Lang',1,'112–165','kit','Sói đầu đàn; lôi điện ?',{profiles:['dian_lang_boss_q1']}),
    hac_hung:C('Hắc Hùng',1,'146–152','kit','Gấu thường bị Ngự Hùng điều khiển',{profiles:['hac_hung_q1']}),
    mac_bac:C('Cổ Nguyệt Mạc Bắc',1,'4–82','kit','Hoàng Lạc Thiên Ngưu; Nguyệt Quang ?',{profiles:['mac_bac_ch83']}),
    xich_thanh:C('Cổ Nguyệt Xích Thành',1,'4–83','kit','Long Hoàn Khúc Khúc; Nguyệt Quang ?',{profiles:['xich_thanh_ch83']}),
    co_kim_sinh:C('Cổ Kim Sinh',1,'42–47','khong_dau','Nhất chuyển tư chất Đinh; bị PN bắn hai nguyệt nhận ám sát ch.46, không giao chiến, không có cổ chiến đấu'),
    phuong_chinh:C('Phương Chính',1,'98–106','kit','Nguyệt Quang, Ngọc Bì (ch.98)',{profiles:['phuong_chinh_ch83']}),
    hoc_duong_gia_lao:C('Học đường gia lão',1,'4–27','khong_dau','Tam chuyển, dạy Nguyệt Quang (ch.22); không giao chiến trong truyện. Boss gia lão của campaign là thiết kế game'),
    thanh_thu:C('Cổ Nguyệt Thanh Thư',1,'139–143','kit','Thanh Đằng, Tùng Châm, Nguyệt Toàn, Mộc Mị',{profiles:['thanh_thu_ch141']}),
    thiet_huyet_lanh:C('Thiết Huyết Lãnh',2,'184–198','cho_dossier','Chính Khí, Thiên Địa Hoành Âm, Trấn Ma Thiết Tác'),
    nhat_dai_boss:C('Cổ Nguyệt Nhất Đại',2,'186–198','cho_dossier','Dơi máu, Huyết Quỷ Thi'),
    thiet_nhuoc_nam:C('Thiết Nhược Nam',2,'170–192','cho_dossier','Kim Châm ? (chưa rõ mốc)'),
    cuong_thi:C('Cương thi Bạch Mao',2,'288–292','cho_dossier','Không cổ riêng (Cản Thi)'),
    ca_sau_dung_nham:C('Cá sấu dung nham',3,'217–218','cho_dossier','Dung Nham Tạc Liệt, Viêm Trụ, Tích Hôi'),
    hien_vien_than_ke:C('Hiên Viên Thần Kê',3,'217–218','khong_dau','Chỉ có clip idle/warn'),
    ca_sau_sau_chan:C('Cá sấu sáu chân',3,'191–213','cho_dossier','Chờ dossier (Huyết Cuồng ch.191 là của nhện, không phải cá sấu — Blue kiểm 03/10)'),
    tran_thuy_hoa:C('Trần Thúy Hoa',3,'222–224','cho_dossier','Tiêu Lôi Thổ Đậu'),
    thiet_dao_kho:C('Thiết Đao Khổ',3,'229–248','cho_dossier','?'),
    bach_lien:C('Bách Liên',3,'233–350','cho_dossier','Liên Y'),
    bach_chien_liep:C('Bách Chiến Liệp',3,'233–350','cho_dossier','?'),
    bach_chien_on:C('Bách Chiến Ôn',3,'248','cho_dossier','?'),
    phi_hau:C('Phỉ Hầu',3,'265–286','cho_dossier','Thú ?'),
    phi_tuong:C('Bạch Vũ Phi Tượng',3,'276–286','cho_dossier','Thú: húc ngà, bay'),
    au_duong_cong:C('Âu Dương Công',3,'282–283','cho_dossier','?'),
    bach_ngung_bang_nu:C('Bạch Ngưng Băng (nữ, Q2)',4,'374–379','cho_dossier','Băng Trùy, Băng Nhận Phong Bạo'),
    viem_dot:C('Viêm Đột',4,'374–379','cho_dossier','Bàn Tay Lửa, Rắn Lửa, Nhiên Du'),
    cu_khai_bi:C('Cự Khai Bi',4,'381–385','cho_dossier','Quán Lực, Áo Giáp Ngà Voi, Rồng Đi Hổ Bước'),
    hoanh_mi:C('Hoành Mi Bạo Quân',4,'415','cho_dossier','Bạo Lực'),
    tiet_tam_tu:C('Tiết Tam Tứ',4,'417–439','cho_dossier','?'),
    han_bat_luu:C('Hàn Bất Lưu',4,'425–427','cho_dossier','Trận cấm cổ (ch.426)'),
    thiet_ba_tu:C('Thiết Phách Tu',4,'444–448','cho_dossier','Bá Lực, Thổ Bá Vương'),
    thiet_mo_bach:C('Thiết Mộ Bạch',4,'462–464','cho_dossier','Điểm Kim, Kim Thang, Kim Châm'),
    vu_quy:C('Vu Quỷ',4,'462–474','cho_dossier','Ô Thất'),
    ba_quy_spirit:C('Bá Quy địa linh',0,'468–478','khong_dau','NPC'),
    // Thiết kế game (batch 5), người dùng chốt 03/10. Hình tạm: sprite gộp cũ tuu_khoi_huyet_khoi cho cả hai khôi (alias ở SB_SPRITES).
    huyet_thu_ma_tu:C('Huyết Thủ ma tu',5,'—','kit','Ma tu Tam chuyển hút máu (sự kiện r_tukiep); không phải Thương Yến Phi',{profiles:['huyet_thu_game']}),
    hinh_nom:C('Hình nộm thử trạng thái',0,'—','kit','Công cụ thử, không phải nhân vật',{profiles:['hinh_nom']}),
    tuu_khoi:C('Tửu Khôi',5,'—','kit','Rối vò rượu, tái tụ (động Hoa Tửu tầng 4)',{profiles:['tuu_khoi_game']}),
    huyet_khoi:C('Huyết Khôi',5,'—','kit','Người máu, tái tụ, chảy máu thì không tái tụ (lăng mộ Nhất Đại)',{profiles:['huyet_khoi_game']}),
  };
  for(const [id,c] of Object.entries(characters))c.visual=c.visual||id;
  // Tỉ lệ thân tương đối (PN = 1), bảng thử của Blue 03/10 (docs/roster/BLUE_REVIEW_DOT_1_VA_BNB_166.md). Chỉ đổi hình, không đổi hitbox.
  // Sprite cũ (chibi_kp) đã chuẩn hóa diện tích lúc import nên size áp trên nền đó; khi đổi bộ hình mới phải đo lại.
  const SIZE={phuong_chinh:.95,xich_thanh:.8,thiet_huyet_lanh:1.15,tran_thuy_hoa:.95,thach_hau:.54};
  for(const [id,v] of Object.entries(SIZE))if(characters[id])characters[id].size=v;

  const clone=o=>JSON.parse(JSON.stringify(o));
  // Gắn hình cho một kit (profile cố định hoặc kit dựng từ save): visual của nhân vật → thư mục theo bộ hình đang chọn.
  function dress(kit,charId,pid){
    const ch=characters[charId];if(!ch)throw new Error('Không có nhân vật '+charId);
    kit.n=kit.n||ch.n;kit.profile=pid;kit.char=charId;
    kit.visual=ch.visual;const r=SPR.resolve(ch.visual);kit.sprite=ch.visual;kit.spriteDir=r.dir;kit.spriteSet=r.set;
    if(ch.size&&kit.size==null)kit.size=ch.size;
    return kit;
  }
  // Kit sẵn dùng cho sim: bản sao + visual/sprite đã resolve. Profile sai → lỗi (không âm thầm dùng PN/BNB).
  function resolve(pid){
    const P=PROFILES[pid];if(!P)throw new Error('Không có profile '+pid);
    return dress(clone(P.kit()),P.char,pid);
  }
  // Hai slot actor riêng (p1 = người chơi, p2 = đối thủ) dù cùng profile. Tham số là profile id hoặc kit đã dress.
  function matchup(p,e){
    const k=x=>typeof x==='string'?resolve(x):x;
    return {kits:{p1:k(p),p2:k(e)},ids:{player:'p1',enemy:'p2'}};
  }
  function profileList(){return Object.entries(PROFILES).map(([id,P])=>Object.assign({id},P,{kit:undefined,name:characters[P.char].n}))}
  const SB_ROSTER={characters,PROFILES,resolve,dress,matchup,profileList};
  if(typeof module!=='undefined')module.exports=SB_ROSTER;else root.SB_ROSTER=SB_ROSTER;
})(this);
