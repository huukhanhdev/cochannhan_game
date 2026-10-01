// Quyển 2 · Chương 2.4: Thương gia thành (canon VN 295–390)
// Bán bí phương, gia yến, Tố Thủ y sư, lực đạo, đá Tinh Thần (ký ức sai), Lý Nhiên, diễn võ trường, đấu giá, hạ bệ Thương Nhai Tí.

Q2_SHOP.thanh=['hacthi','hungluc','nguluc','maluc','quyluc','tuongluc','mangluc','kimcuong','trucxung','tulucsinh','thietbi','bachngoc','trilieu','thanhnhiet','liemtuc','xaloi2','xaloi3','tuutrung','thienbong'];

/* ---------- diễn võ trường ---------- */
// Leo từ nội thành 5 (hạng 0–9) lên nội thành 4 (10–19) và nội thành 3 (20–29). Đối thủ có tên ở các mốc hạng.
var DV_NAMED={4:'thanghung',9:'lyhao',14:'chubat',19:'daokhodv',24:'viemdot'};
function dvRank(){return S.f.dvRank||0}
function dvZone(){const r=dvRank();return r<10?5:r<20?4:3}
function dvFight(){
  const r=dvRank(),named=DV_NAMED[r];
  S.f.dvFights=(S.f.dvFights||0)+1;
  if(named){fight(named,{after:'q2_dv_win',spare:named==='daokhodv'?0:.2,spareAfter:'q2_dv_thua',spareT:'Trọng tài bước vào giữa sàn: trận đấu kết thúc. Ngươi được khiêng xuống.'});log(`Diễn võ trường nội thành ${dvZone()}: ${EN[named].n} bước lên sàn. Khán đài chật kín.`,'big');return}
  const mod=.8+r*.035;
  fight('dvmatu',{after:'q2_dv_win',mod,scale:1,spare:.2,spareAfter:'q2_dv_thua',spareT:'Ngươi giơ tay nhận thua. Trọng tài dừng trận.'});
  log(`Diễn võ trường nội thành ${dvZone()}, trận thứ ${r+1}.`,'sys');
}
// Phong Vũ lâu, Thực Thiên Lâu, phố xá
function tamtuCity(){
  meet('tamtu');rel('tamtu',5);
  const isAlly = typeof storyHasOutcome === 'function' && storyHasOutcome('tamtu_route','ally');
  if(S.f.dvReg&&(S.rel.tamtu||0)>=40&&!S.f.tamtuTinBao){
    S.f.tamtuTinBao=1;
    log('Tâm Từ gợi ý: tình báo diễn võ trường đáng giá hơn vàng. Nàng muốn làm ăn thứ đó.','good');
    return;
  }
  if(isAlly && !S.f.tamtuAllyGreet){
    S.f.tamtuAllyGreet = 1;
    log('Tâm Từ đón tiếp ngươi thân tình: "Hắc Thổ ca ca, ở Thương gia thành nếu có việc gì cần, cứ phân phó muội."','good');
  }
  log(pick(['Tâm Từ kể chuyện trong phủ: các anh chị em nàng không ai coi nàng là người Thương gia.','Tiểu Điệp pha trà, lần này không lườm ngươi.','Tâm Từ đưa ngươi xem sổ sách của một cửa hàng lỗ vốn. Ngươi chỉ ra ba chỗ gian lận.']),'sys');
  if(Math.random()<.4){
    const bonusStones = isAlly ? 30 : 20;
    S.stones+=bonusStones;
    log(`Nàng chia cho ngươi ${bonusStones} nguyên thạch tiền lãi.`,'gold');
  }
}

CHAPTERS.q2_thanh={n:'Thương gia thành',title:'Quyển hai · Chương bốn · Thương gia thành',unit:'tháng',turns:14,bg:'scene_shang_city',cap:3,
  intro:'Thương gia thành đào vào lòng núi Thương Lượng, mười bốn tầng đường, năm khu. Khu ngoài có khách điếm nửa viên thạch một đêm; khu trong là con cháu Thương gia.',
  ask:'Tháng này làm gì?',shop:Q2_SHOP.thanh,
  start:()=>{
    let bonus = 200;
    if(S.f && S.f.tuKinhLenh){
      bonus += 300;
      log('Nhờ mang Tử Kinh Lệnh của Thương Tâm Từ / Thương gia tộc trưởng, ngươi được đặc quyền ngụ tại Nam Thu Uyển và cấp thêm 300 nguyên thạch chi tiêu!','good');
      if(typeof storySetOutcome==='function') storySetOutcome('tu_kinh_lenh_applied','nam_thu_uyen',{choiceText:'Hưởng đặc quyền Tử Kinh Lệnh tại Nam Thu Uyển',isLech:false,note:'Bố trí phủ đệ và hỗ trợ vốn ban đầu tại Thương gia thành.'});
    }
    S.stones+=bonus;
    log(`Bán Cốt Thương, Loa Toàn và mấy con cổ dư: thu được tổng cộng ${bonus} nguyên thạch.`,'gold');
  },
  canon:{1:'q2_tt_nhaiti1',2:'q2_tt_giayen',3:'q2_tt_lucdao',4:'q2_tt_tinhthan',5:'q2_tt_lynhien',6:'q2_tt_dienvo',7:'q2_tt_bachgia',8:'q2_tt_amvan',9:'q2_tt_nhuocnam',10:'q2_tt_daugia',11:'q2_tt_nhaiti2',12:'q2_tt_viemdot',13:'q2_tt_cukhaibi',14:'q2_tt_ket'},
  side:['q2_tt_nguyuong','q2_tt_baogioi','q2_tt_noikhong','q2_tt_lyhao','q2_tt_tucgia'],
  spots:[
    {id:'ttpho',x:18,y:56,g:'街',n:'Dạo phố',d:'Tửu lâu, Phong Vũ lâu, chuyện trong thành.',loc:'tt_pho',evP:.8,quiet:'Phố xá đông đúc. Không ai để ý tới một gã lạ mặt.'},
    {id:'dienvo',x:52,y:34,g:'武',n:'Diễn võ trường',d:'Leo hạng. Thắng thì có nguyên thạch và danh vọng.',run:dvFight,show:()=>S.f.dvReg},
    {id:'tttamtu',x:34,y:72,g:'慈',n:'Phủ Thương Tâm Từ',d:'Gặp Tâm Từ.',run:tamtuCity,show:()=>S.met.tamtu},
    {id:'baicanh',x:70,y:70,g:'冰',n:'Nam Thu Uyển',d:'Bạch Ngưng Băng luyện đao. Nàng cũng leo diễn võ.',run:baiLesson},
    {id:'tuluyen',x:84,y:52,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:10,y:34,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'market',minor:1,x:40,y:88,g:'市',n:'Chợ khu Tạp đẳng',d:'Mua bán cổ'},
    {id:'gamble',minor:1,x:60,y:88,g:'石',n:'Phường đổ thạch',d:'Đổ thạch'},
    {id:'refine',minor:1,x:90,y:24,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EN,{
  dvmatu:{n:'Ma tu diễn võ',hp:120,atk:[11,16],st:[20,35],bl:1,drop:.25,i:'Một ma tu lên sàn diễn võ, mắt dán vào túi cổ của ngươi. Luật diễn võ: giết đối thủ thì được toàn bộ đồ trên người.'},
  thanghung:{n:'Thang Hùng',hp:260,atk:[16,24],st:[60,90],bl:1,drop:.5,i:'Lực tu Hùng lực. Hùng Hào cổ biến tay chân thành gấu, trên đầu hiện hư ảnh đầu gấu gầm.'},
  lyhao:{n:'Lý Hảo',hp:230,atk:[15,22],st:[60,90],bl:1,drop:.5,i:'Đàn ông trang điểm, áo hoa, Tam chuyển. Từng là lực tu tụt hạng, giờ dùng Di Hình cổ: đánh không trúng hắn.'},
  chubat:{n:'Chu Bát',hp:360,atk:[18,26],st:[90,130],bl:2,drop:.5,i:'Hạng tám nội thành 4. Béo như heo, da dày như thiết giáp, mỗi đòn đánh vào hắn đều phản chấn.'},
  daokhodv:{n:'Thiết Đao Khổ',hp:320,atk:[22,30],st:[80,120],bl:1,i:'Đao khách Thiết gia, một mắt đã mù. Hắn đăng ký diễn võ để giết ngươi một cách hợp lệ.'},
  viemdot:{n:'Viêm Đột',hp:420,atk:[22,32],st:[120,160],bl:2,drop:.6,i:'Tứ chuyển, tư chất Ất. Hỏa Thủ cổ, Nhiên Du cổ, sát chiêu Hỏa Hải Song Giao Sát.'},
  cukhaibi:{n:'Cự Khai Bi',hp:720,atk:[30,42],st:[250,350],bl:3,i:'Tứ chuyển, người của Thương Yến Phi. Quán Lực cổ tích lực rồi bộc phát, Long Đảm cổ, Kiên Cường cổ che sơ hở.'},
});
Object.assign(EAI,{dvmatu:{sk:'charge'},thanghung:{def:2,sk:'rage'},lyhao:{sk:'charge',fast:1},chubat:{def:5,sk:'rage'},daokhodv:{sk:'charge',boss:1},viemdot:{def:2,sk:'thunder',boss:1},cukhaibi:{def:4,sk:'rage',boss:1}});
Object.assign(ART,{dvmatu:{g:'魔',sc:'village',c:'#b890d6'},thanghung:{g:'熊',sc:'village',c:'#b3a695'},lyhao:{g:'花',sc:'village',c:'#e0a0c8'},chubat:{g:'猪',sc:'village',c:'#d2ab82'},
  daokhodv:{g:'刀',sc:'village',c:'#aeb8c2'},viemdot:{g:'炎',sc:'fire',c:'#e0764e'},cukhaibi:{g:'巨',sc:'village',c:'#c9a86a'}});
Object.assign(PORTRAIT,{dvmatu:'p_cultivator',thanghung:'p_bear',lyhao:'p_cultivator',chubat:'p_boar',daokhodv:'p_giave',viemdot:'p_madutam',cukhaibi:'p_gialao'});
Object.assign(DROP_POOL,{dvmatu:['hacthi','hungluc','dongbi','trucxung','nguluc','maluc'],thanghung:['hungluc'],lyhao:['maluc'],chubat:['tuongluc','quyluc'],viemdot:['mangluc']});
Object.assign(NPC,{
  yenphi:{n:'Thương Yến Phi',d:'Tộc trưởng Thương gia, Ngũ chuyển. Tóc lửa, huyết diễm'},
  nguyuong:{n:'Ngụy Ương',d:'Gia lão Thương gia, quản Phong Vũ lâu'},
  tothu:{n:'Tố Thủ y sư',d:'Ngũ chuyển trị liệu, một trong tứ đại y sư Nam Cương'},
  nhaiti:{n:'Thương Nhai Tí',d:'Thiếu chủ Thương gia, sa đọa tửu sắc'},
  lynhien:{n:'Lý Nhiên',d:'Gián điệp Vũ gia nằm vùng tám năm'},
  nhuocnam:{n:'Thiết Nhược Nam',d:'Con gái Thiết Huyết Lãnh'},
});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{yenphi:'飞',nguyuong:'央',tothu:'素',nhaiti:'崖',lynhien:'然'});
Object.assign(MEM,{
  q2_tinhthan:{n:'Đá kê chân',d:'Viên đá Tinh Thần kê chân quầy đá không chứa gì. Cổ truyền kỳ nằm ở chỗ khác. Ký ức 500 năm cũng có lúc sai.'},
  q2_lynhien:{n:'Bí mật của Lý Nhiên',d:'Lý Nhiên là gián điệp Vũ gia. Vợ con hắn bán đậu hũ đối diện quán Phú Thái Tường.'},
  q2_nhaiti:{n:'Kẽ hở Thề Độc',d:'Thề Độc chỉ cấm tiết lộ cho người thứ ba chưa biết. Người đã biết trước khi thề thì không tính.'},
  q2_cukhaibi:{n:'Sơ hở của Cự Khai Bi',d:'Quán Lực cổ phải tích lực. Kiên Cường cổ che sơ hở bằng khí vô hình, đoán được thì đánh được.'},
});
Object.assign(DEATH_MEM,{cukhaibi:'q2_cukhaibi'});

Object.assign(EV,{
q2_tt_tukinhvao:{title:'Tử Kinh nhập thành',hint:'Tử Kinh Lệnh phát huy tác dụng',g:'紫',who:'tamtu',
  text:()=>'Lệnh bài gỗ tử kinh vừa đưa ra, thành vệ đổi hẳn sắc mặt. Hai người được dẫn qua khu Tạp đẳng tới Nam Thu Uyển; lời hứa trước cổng thành đã biến thành chỗ đứng thật sự giữa Thương gia thành.',
  choices:[{t:'Cất kỹ Tử Kinh Lệnh',canon:1,eff:()=>{if(typeof storyAddJournal==='function')storyAddJournal('Tử Kinh Lệnh đưa ngươi vào Nam Thu Uyển.','consequence','tu_kinh',{title:'Tử Kinh nhập thành',isLech:false});return 'Một lựa chọn trong thương đội đã theo ngươi tới tận thành.'}}]},
q2_tt_nhaiti1:{canon:1,title:'Thiếu chủ đòi chia',hint:'Thương Nhai Tí',g:'崖',who:'nhaiti',
  text:()=>'Ngươi bán hàng xong chưa kịp ra khỏi cửa tiệm. Chưởng quầy đã báo qua gương đồng cho Thương Nhai Tí, thiếu chủ mười tám tuổi quản cả khu này. Hắn biết chuyện Bách gia, biết Thiết gia đang tìm hai người, và đòi năm mươi vạn.',
  choices:()=>[
    {t:'Nhẫn nhịn, hứa hẹn cho qua',canon:1,eff:()=>{meet('nhaiti');rel('nhaiti',-10);S.tamco++;S.f.nhaitiThu=1;return 'Ngươi cúi đầu. Kẻ nắm chuôi dao là kẻ kiên nhẫn nhất. Tâm cơ +1.'}},
    {t:'Cười, bảo hắn cứ đi báo',tag:'ma',eff:()=>{meet('nhaiti');rel('nhaiti',-30);S.susp+=15;return 'Nhai Tí đỏ mặt bỏ đi. Hiềm nghi +15.'}},
  ]},
q2_tt_giayen:{canon:1,title:'Gia yến Thương gia',hint:'Bán bí phương',g:'宴',who:'yenphi',
  text:()=>'Thương Yến Phi, tộc trưởng Ngũ chuyển tóc lửa, mời hai người dự gia yến. Ngươi có trong tay một bí phương Thương gia thèm muốn.'+(S.f.matBong?' Tố Thủ y sư ở tiệc có thể chữa gương mặt bỏng của ngươi.':''),
  choices:()=>[
    {t:'Bán bí phương, ép giá tới chín mươi vạn, ký Thề Độc với Bạch Ngưng Băng chia đôi',canon:1,check:['tamco',14],ok:()=>{meet('yenphi');meet('tothu');meet('nguyuong');rel('yenphi',15);S.stones+=450;gainGu('thetdoc',true);S.f.theDocBai=1;S.hp=maxHp();return 'Chín mươi vạn. Chia đôi, phần ngươi đổi ra 450 nguyên thạch. Tố Thủ chữa lành mặt và tai. Bạch Ngưng Băng tẩy lớp ngụy trang: cả gia yến lặng đi. Hai người ký Thề Độc: nàng giúp ngươi lên Tứ chuyển đỉnh, ngươi trả Dương cổ.'},fail:()=>{meet('yenphi');meet('tothu');S.stones+=250;return 'Yến Phi không để bị ép. Vẫn được 250 nguyên thạch.'}},
    {t:'Không bán, giữ bí phương làm con bài',eff:()=>{meet('yenphi');rel('yenphi',-10);S.tamco++;return 'Yến Phi mỉm cười. Ngươi biết bà ta không quen bị từ chối.'}},
  ]},
q2_tt_lucdao:{canon:1,title:'Chọn đạo',hint:'Lực đạo',g:'力',who:'nguyuong',
  text:()=>'Ngụy Ương dẫn ngươi đi chọn con đường chính. Lực đạo rẻ, dễ vào, khó xuất sắc: ma tu nghèo dùng làm bước đệm. Ngươi có lý do khác: vài năm nữa Tam Vương truyền thừa mở ra.',
  choices:()=>[
    {t:'Chọn Lực đạo',canon:1,eff:()=>{S.f.lucDao=1;gainGu('nguluc',true);return 'Ngụy Ương lắc đầu, nhưng vẫn giúp ngươi mua một con Thanh Ngưu Lực Cổ. Hư ảnh thú trên đầu càng nhiều, quyền càng nặng.'}},
    {t:'Theo kiếm đạo, mua Kiếm Ảnh cổ',eff:()=>{gainGu('nguyetngan',true);return 'Một con cổ tấn công tầm xa, ổn định.'}},
  ]},
q2_tt_tinhthan:{canon:1,title:'Viên đá kê chân',hint:'Đá Tinh Thần',g:'石',
  text:()=>'Ở quầy đổ thạch khu Tạp đẳng, một viên đá Tinh Thần hình cục gạch bị dùng làm đá kê chân quầy. Kiếp trước, một cổ sư vấp phải nó, tức giận mua về cắt, và ra một con cổ truyền kỳ.'+(mem('q2_tinhthan')?' Nhưng ngươi đã từng cắt nó. Nó rỗng.':''),
  choices:()=>[
    {t:'Theo ký ức, mua viên đá kê chân rồi cắt',canon:1,mem:'q2_tinhthan',eff:()=>{S.stones=Math.max(0,S.stones-40);learn('q2_tinhthan');S.f.tinhthanRong=1;return 'Viên đá rỗng. Ký ức năm trăm năm của ngươi sai. Viên đá khác, mua cùng lúc, ra Kiếm Ảnh cổ; nhưng cổ truyền kỳ không có ở đây. Vậy nó ở đâu?'}},
    {t:'Mua đá rác cho năm lão sư phó giải, quan sát xem ai để ý tới viên đá',check:['ngo',13],bonus:()=>mem('q2_tinhthan')?6:0,ok:()=>{S.stones=Math.max(0,S.stones-30);S.f.tinhthanRong=1;S.f.lynhienNghi=1;return 'Không ai để ý tới viên đá. Chỉ có một gã tên Lý Nhiên, tháng nào cũng ghé quầy này, mắt không bao giờ nhìn đá.'},fail:()=>{S.stones=Math.max(0,S.stones-30);return 'Toàn đá rác.'}},
  ]},
q2_tt_lynhien:{canon:1,title:'Lý Nhiên',hint:'Gián điệp Vũ gia',g:'然',who:'lynhien',
  text:()=>'Lý Nhiên, cổ sư sa đọa, ngày nào cũng ngồi một chỗ trong quán Phú Thái Tường. Cửa sổ chỗ hắn ngồi nhìn thẳng ra một tiệm đậu hũ.'+(mem('q2_lynhien')?' Ngươi nhớ: đó là tiệm của vợ con hắn.':''),
  choices:()=>[
    {t:'Theo dõi hai mươi ngày, dùng Linh Quang Nhất Thiểm cổ thôi diễn',canon:1,check:['ngo',14],bonus:()=>(S.f.lynhienNghi?4:0)+(mem('q2_lynhien')?8:0),ok:()=>{meet('lynhien');learn('q2_lynhien');S.f.lynhienNam=1;return 'Lý Nhiên là gián điệp Vũ gia, nằm vùng tám năm, giả sa đọa. Viên đá chứa cổ truyền kỳ đang nằm trong tay hắn. Ngươi điều khiển hắn đi vòng quanh thành rồi ngồi vào đúng chỗ của hắn.'},fail:()=>{meet('lynhien');S.stones=Math.max(0,S.stones-30);return 'Hai mươi ngày không ra gì. Mất 30 nguyên thạch tiền cổ thôi diễn.'}},
    {t:'Bỏ qua',eff:()=>'Ngươi không nghĩ thêm về viên đá.'},
  ]},
q2_tt_dienvo:{canon:1,title:'Diễn võ trường',hint:'Đăng ký diễn võ',g:'武',who:'nguyuong',
  text:()=>'Ngụy Ương, vốn là ma tu xuất thân từ diễn võ trường, dẫn ngươi tới xem. Đánh từ khu 5 lên khu 3, giữ được mười tám trận là được thiếu chủ chiêu mộ. Luật: giết đối thủ thì được toàn bộ đồ trên người.'+(S.f.lynhienNam?' Lý Nhiên đang chờ ngươi ở cửa.':''),
  choices:()=>[
    ...(S.f.lynhienNam?[{t:'Ép Lý Nhiên ký Thề Độc, dàn dựng một trận, "cược" ra cổ truyền kỳ',tag:'ma',canon:1,eff:()=>{
      S.f.dvReg=1;gainGu('toanluc');S.stones=Math.max(0,S.stones-80);S.danh+=15;
      if(typeof storySetOutcome==='function') storySetOutcome('toan_luc_ung_pho','acquired_canon',{choiceText:'Dàn dựng cược ra Toàn Lực Ứng Phó Cổ từ Lý Nhiên',isLech:false,note:'Sở hữu cổ hạch tâm tối thượng của Lực đạo.'});
      return 'Ngươi giả làm nội ứng của một gia tộc khác, nhìn tiệm đậu hũ bằng ánh mắt "ta cũng có người nhà". Lý Nhiên ký Thề Độc, ngươi miễn nhiễm. Ba ngày sau ngươi "cược" ra Toàn Lực Ứng Phó. Trả hắn 20 vạn, nợ 12 vạn. Cả thành truyền nhau: Hắc Thổ ân oán rõ ràng.';
    }}]:[]),
    {t:'Đăng ký diễn võ (500 thạch, được mượn Đằng Tấn cổ ghi hồ sơ)',eff:()=>{S.f.dvReg=1;S.stones=Math.max(0,S.stones-25);return 'Tên ngươi lên bảng nội thành 5.'}},
  ]},
q2_tt_bachgia:{canon:1,title:'Đội truy bắt Bách gia',hint:'Bách gia tới thành',g:'百',who:'daokho',
  text:()=>'Gia lão Bách Phong dẫn đội truy bắt tới thành, đi cùng Thiết Đao Khổ. Tử Kinh lệnh che chở ngươi, họ không bắt được. Đao Khổ đề xuất đăng ký diễn võ để giết ngươi hợp lệ.',
  choices:()=>[
    {t:'Đòi Bách gia ba trăm vạn phí bịt miệng, dọa bán tin cho Phong Vũ lâu',tag:'ma',canon:1,check:['tamco',15],ok:()=>{
      S.stones+=300;rel('daokho',-20);S.f.bachgiaRut=1;
      if(typeof storySetOutcome==='function') storySetOutcome('bach_blackmail','extorted_300w',{choiceText:'Tống tiền Bách gia 300 vạn nguyên thạch phí bịt miệng',isLech:false,note:'Bách gia nộp tiền rút quân, Thiết Đao Khổ bị cô lập.'});
      return 'Ta cũng là người bị hại: Bách gia cướp truyền thừa, truy sát ta rơi xuống Tử U. Bách Phong trả trước năm mươi vạn trong một ngày, rồi rút khỏi thành. Bách gia bỏ Thiết Đao Khổ lại một mình. +300 nguyên thạch.';
    },fail:()=>{S.stones+=80;S.susp+=15;return 'Bách Phong chỉ trả một phần. Hiềm nghi +15.'}},
    {t:'Tránh mặt',eff:()=>{S.susp+=10;return 'Họ vẫn ở đó.'}},
  ]},
q2_tt_amvan:{canon:1,title:'Mài hư ảnh',hint:'Âm Vân Dương Vân',g:'云',
  text:()=>'Âm Vân và Dương Vân cổ: ngồi trên mây đen, mây trắng trên đầu sinh sét lam. Sét mài hư ảnh thú vào xương thịt. Mất cổ lực, giữ hư ảnh mãi mãi. Mỗi lần mài mất ba tháng tuổi thọ.',
  choices:()=>{
    const ls=S.gu.filter(g=>GU[g.k].beast&&!((S.f.luc||[]).includes(GU[g.k].beast)));
    return [
      ...ls.slice(0,3).map(g=>({t:`Mài hư ảnh ${GU[g.k].beast} (từ ${GU[g.k].n})`,canon:1,eff:()=>{lucEngrave(g.k);return 'Xương cốt ngươi kêu răng rắc cả đêm.'}})),
      {t:'Mua Âm Vân Dương Vân cổ để dùng dần (80 thạch)',req:()=>S.stones>=80,reqT:'Cần 80 nguyên thạch',eff:()=>{S.stones-=80;gainGu('amduongvan',true);S.f.amvan=1;return 'Lần sau có cổ lực mới thì mài tiếp.'}},
      {t:'Không mài',eff:()=>'Tuổi thọ cũng là tài nguyên.'},
    ];
  }},
q2_tt_nhuocnam:{canon:1,title:'Khách tới Nam Thu Uyển',hint:'Thiết Nhược Nam',g:'若',who:'nhuocnam',
  text:()=>'Thiết Nhược Nam, Tam chuyển cao giai, Giáp đẳng, cho Thiết Đao Khổ mười vạn chữa mắt ở chỗ Tố Thủ, rồi ba lần tới Nam Thu Uyển. Nàng hỏi về Thanh Mao Sơn, về Huyết Hải truyền thừa. "Cha ta chết trong tay Phương Nguyên. Nếu hắn còn sống, ta sẽ giết hắn."',
  choices:()=>[
    {t:'Kể cho nàng nghe một phiên bản khác của Thanh Mao Sơn',canon:1,check:['tamco',15],ok:()=>{meet('nhuocnam');rel('nhuocnam',10);S.f.nhuocnamTin=1;return 'Nàng tin "Phương Chính" trước mặt chỉ là người sống sót. Nàng không biết mình đang ngồi uống trà với kẻ thù.'},fail:()=>{meet('nhuocnam');rel('nhuocnam',-10);S.susp+=20;return 'Nàng nhìn ngươi lâu hơn cần thiết. Hiềm nghi +20.'}},
    {t:'Tránh gặp',eff:()=>{meet('nhuocnam');S.susp+=10;return 'Nàng để lại danh thiếp. Hiềm nghi +10.'}},
  ]},
q2_tt_daugia:{canon:1,title:'Hội đấu giá',hint:'Khổ Lực và Phong Khí',g:'拍',who:'nhaiti',
  text:()=>'Tự gia sập nguyên tuyền, nhập Thương gia, đem gia sản ra đấu giá. Lô 13 là Khổ Lực cổ Tứ chuyển. Đối thủ: Nhai Tí, Thương Bí Hý, Cự Khai Bi. Ngụy Ương cho ngươi mượn gần trăm vạn.',
  choices:()=>[
    {t:'Đẩy giá cho Nhai Tí mua Khổ Lực với giá gấp đôi, rồi mua Phong Khí cổ',canon:1,check:['tamco',14],ok:()=>{meet('nhaiti');rel('nhaiti',-20);S.stones=Math.max(0,S.stones-150);gainGu('phongkhi',true);S.f.nhaitiNo=1;return 'Nhai Tí mua Khổ Lực tám mươi mốt vạn, gấp đôi giá, rồi mới biết mình bị lừa. Ngươi lấy Phong Khí cổ, cổ thiên nhiên chưa ai tìm ra bí phương. Nghịch luyện nó sẽ ra Khí Lực.'},fail:()=>{S.stones=Math.max(0,S.stones-200);gainGu('phongkhi',true);return 'Ngươi mua được Phong Khí cổ, nhưng đắt.'}},
    {t:'Tranh Khổ Lực bằng mọi giá',req:()=>S.stones>=320,reqT:'Cần 320 nguyên thạch',eff:()=>{S.stones-=320;gainGu('kholuc',true);return 'Khổ Lực cổ về tay ngươi. Cả hội trường nhìn '+(S.f.matBong?'gã mặt bỏng':'gã tán tu')+' mới nổi.'}},
  ]},
q2_tt_nhaiti2:{canon:1,title:'Kẽ hở của Thề Độc',hint:'Hạ bệ Nhai Tí',g:'誓',who:'nhaiti',
  text:()=>'Nhai Tí từng ép ngươi ký Thề Độc không tiết lộ bí mật của hắn cho "người thứ ba không biết". Nhưng ngươi đã kể cho Bạch Ngưng Băng trước khi thề.'+(hasGu('phongkhi')?' Phong Khí cổ trong khiếu ngươi chờ được nghịch luyện.':''),
  choices:()=>[
    {t:'Để Bạch Ngưng Băng tung tin; nói với Nhai Tí "thật ra ta là người lương thiện"',tag:'ma',canon:1,eff:()=>{learn('q2_nhaiti');S.f.nhaitiDo=1;S.stones+=200;if(!hasGu('kholuc'))gainGu('kholuc');storySetOutcome('lucdao_trinity','trinity_assembled','Hạ bệ Nhai Tí đoạt Khổ Lực cổ, phục hưng Lực Đạo viễn cổ');return 'Nhai Tí lật bàn, Thề Độc làm hắn chảy máu mũi. Ngươi giả vờ tha rồi quay đi; hắn dâng cả Khổ Lực cổ để cầu xin. Yến Phi phán: Nhai Tí mất chức thiếu chủ, bị đày vào đội bắt nô ba năm. Nhưng bà ta giận người ngoài dám tính kế con mình.'}},
    ...(hasGu('phongkhi')?[{t:'Nghịch luyện Phong Khí thành Khí Lực cổ',check:['ngo',15],ok:()=>{loseGu('phongkhi');gainGu('khiluc');storySetOutcome('lucdao_trinity','trinity_assembled','Nghịch luyện Phong Khí thành công tạo ra Khí Lực cổ, phục hưng Lực Đạo viễn cổ');return 'Khí đạo thượng cổ đã tuyệt, sống lại trong tay ngươi. Hư ảnh thú hóa thực.'},fail:()=>{loseGu('phongkhi');S.stones+=60;return 'Luyện hỏng. Phong Khí cổ tan. Bán xác cổ được 60 nguyên thạch.'}}]:[]),
  ]},
q2_tt_viemdot:{canon:1,title:'Bạch Ngưng Băng và Viêm Đột',hint:'Trận của Bạch Ngưng Băng',g:'炎',who:'bainu',
  text:()=>'Viêm Đột, Tứ chuyển, tư chất Ất, đấu với Bạch Ngưng Băng. Hắn đốt biển lửa bằng Nhiên Du cổ, gọi hai con giao lửa. Nàng hóa Băng Tinh xông lên. Nàng sẽ thua, và hắn sẽ đòi Băng Tinh cổ bổn mệnh của nàng.',
  choices:()=>[
    {t:'Dạy nàng giả yếu rồi bộc phát, phá móng giao, nhận thua đúng lúc',canon:1,eff:()=>{baiRel(15);S.f.baiViem=1;return 'Nàng nhận thua sau khi làm Viêm Đột mất một Hỏa Xà và hai Hỏa Thủ. Hắn đòi Băng Tinh cổ; nàng thất khiếu chảy máu vẫn không đưa. Nàng học được thứ các trưởng lão Bạch gia chưa từng dạy.'}},
    {t:'Tự lên sàn thách Viêm Đột thay nàng',eff:()=>{baiRel(10);fight('viemdot',{after:'q2_tt_viem',spare:.2,spareT:'Trọng tài dừng trận. Viêm Đột cười lớn.'});return 'Biển lửa bùng lên.'}},
    {t:'Mặc nàng',tag:'ma',eff:()=>{baiRel(-15);S.f.baiMat=1;return 'Nàng mất Băng Tinh cổ. Từ đó ánh mắt nàng nhìn ngươi khác đi.'}},
  ]},
q2_tt_cukhaibi:{canon:1,title:'Đại trận cuối',hint:'Cự Khai Bi',g:'巨',sc:'village',
  text:()=>'Trận cuối của ngươi ở diễn võ trường. Cự Khai Bi, Tứ chuyển, người của Yến Phi, có mật lệnh: thắng thì đòi Thiên Nguyên Bảo Liên. Khán đài hơn vạn người.'+(mem('q2_cukhaibi')?' Ngươi nhớ: Kiên Cường cổ che sơ hở của hắn bằng khí vô hình.':''),
  choices:()=>[
    {t:'Lên sàn',canon:1,eff:()=>{fight('cukhaibi',{after:'q2_tt_cukhai',mod:mem('q2_cukhaibi')?.88:1,spare:.15,spareAfter:'q2_tt_cukhai_thua',spareT:'Cự Khai Bi dừng tay trước đòn cuối. Hắn không được lệnh giết ngươi.'});return 'Tám hư ảnh thú là cực hạn thân thể. Hôm nay phải vượt qua.'}},
    {t:'Rút tên khỏi trận',eff:()=>{S.danh-=20;return 'Khán đài la ó. Danh vọng −20.'}},
  ]},
q2_tt_ket:{canon:1,title:'Tin từ Tam Xoa Sơn',hint:'Tam Vương truyền thừa',g:'王',
  text:()=>'Tin lan khắp thành: ở Tam Xoa Sơn, giữa Tả gia và Xa gia, ba cột sáng vàng, lam, đỏ vừa mọc lên. Tam Vương truyền thừa sắp mở. Đúng ngày như kiếp trước.',
  choices:[{t:'Chuẩn bị',eff:()=>{chapEnd('q2_thieuchu');return 'Chương bốn kết thúc.'}}]},

// bên lề
q2_tt_nguyuong:{title:'Huynh đệ',g:'央',who:'nguyuong',cond:()=>S.turn>=3,
  text:()=>'Ngụy Ương rót rượu: "Nhìn ngươi, ta thấy mình ngày xưa." Hắn giảng: Nhất tới Ngũ chuyển là phàm, Lục tới Cửu chuyển là tiên, bất tử.',
  choices:[{t:'Nâng chén',eff:()=>{rel('nguyuong',15);S.ngo++;return 'Ngộ tính +1.'}},{t:'Hỏi về Phong Vũ lâu',eff:()=>{rel('nguyuong',5);S.f.phongvu=1;return 'Hắn cười: "Ở đây cái gì cũng mua được, kể cả tin."'}}]},
q2_tt_baogioi:{title:'Hoạt Bảo Môn',g:'门',cond:()=>S.turn>=4,
  text:()=>'Bảo Giới: một cánh cửa đỏ khổng lồ có mặt người biết nói, tính trẻ con, gọi Yến Phi là "Tiểu Phi Phi". Nó chỉ đổi bảo cho ai chịu móc mũi cho nó.',
  choices:[
    {t:'Móc mũi, đổi Huyết Lô cổ lấy thứ khác',req:()=>hasGu('huyetlo'),reqT:'Cần Huyết Lô cổ',eff:()=>{loseGu('huyetlo');gainGu('xaloi3');S.stones+=150;return 'Cánh cửa cười khanh khách. Đổi được Bạch Ngân Xá Lợi và 150 nguyên thạch.'}},
    {t:'Móc mũi, hỏi nó chuyện Cổ Tiên',eff:()=>{S.ngo++;return 'Nó kể lung tung. Có vài câu đáng nhớ. Ngộ tính +1.'}},
    {t:'Không móc',eff:()=>'Cánh cửa lè lưỡi.'},
  ]},
q2_tt_noikhong:{title:'A Thỉ cổ',g:'言',cond:()=>S.turn>=4&&!hasGu('noikhong'),
  text:()=>'Chuỗi hợp luyện: Xú Thí cổ, bùn Hắc Tất, Thảo Túi Cơm ra A Thỉ cổ; thêm vài thứ nữa ra Nói Không Giữ Lời cổ: miễn nhiễm Thề Độc.',
  choices:[
    {t:'Luyện (60 thạch)',req:()=>S.stones>=60,reqT:'Cần 60 nguyên thạch',check:['ngo',12],ok:()=>{S.stones-=60;gainGu('noikhong');return 'Từ nay Thề Độc không trói được ngươi.'},fail:()=>{S.stones-=60;return 'Thất bại. A Thỉ cổ làm ngươi đau bụng ba ngày.'}},
    {t:'Để sau',eff:()=>'Chưa cần.'},
  ]},
q2_tt_lyhao:{title:'Tình báo diễn võ',g:'报',who:'lynhien',cond:()=>S.f.dvReg&&S.met.lynhien,
  text:()=>'Lý Nhiên gửi tình báo về đối thủ sắp tới: ai dùng cổ gì, ai sợ gì.',
  choices:[{t:'Nhận',eff:()=>{S.f.dvTin=1;S.tamco++;return 'Tâm cơ +1.'}}]},
q2_tt_tucgia:{title:'Nhà Tự gia',g:'风',cond:()=>S.turn>=8,
  text:()=>'Tự gia ở núi Cụ Phong, gió thổi quanh năm, trụ mấy trăm năm. Bão phá nguyên tuyền, cả nhà nhập Thương gia, bán gia sản.',
  choices:[{t:'Mua đồ cũ của họ giá rẻ',req:()=>S.stones>=40,reqT:'Cần 40 nguyên thạch',eff:()=>{S.stones-=40;const k=pick(['maluc','nguluc','quyluc']);gainGu(k,true);return `Được ${GU[k].n}.`}},{t:'Thôi',eff:()=>'Ngươi đi tiếp.'}]},

// phố
q2r_tt_tuulau:{loc:'tt_pho',title:'Thực Thiên Lâu',g:'酒',text:()=>'Tửu lâu số một thành. Đầu bếp ở đây dùng cổ để nấu.',
  choices:[{t:'Ăn một bữa (10 thạch)',req:()=>S.stones>=10,reqT:'Cần 10',eff:()=>{S.stones-=10;S.hp=maxHp();return 'Khí huyết đầy.'}},{t:'Nghe chuyện bàn bên',eff:()=>{S.tamco+=Math.random()<.3?1:0;return 'Người ta bàn về Tiểu Thú Vương mới nổi ở diễn võ.'}}]},
q2r_tt_phongvu:{loc:'tt_pho',title:'Phong Vũ lâu',g:'报',text:()=>'Tổ chức tình báo của Thương gia bán đủ loại tin.',
  choices:[{t:'Mua tin (20 thạch)',req:()=>S.stones>=20,reqT:'Cần 20',eff:()=>{S.stones-=20;S.susp=Math.max(0,S.susp-15);return 'Biết ai đang dò la về ngươi. Hiềm nghi −15.'}},{t:'Bán tin về Bách gia',eff:()=>{S.stones+=25;return '+25 nguyên thạch.'}}]},
q2r_tt_ancuop:{loc:'tt_pho',title:'Hẻm tối',g:'暗',text:()=>'Ba tên ma tu chặn trong hẻm, muốn cướp '+(S.f.matBong?'gã mặt bỏng':'gã tán tu lạ mặt')+'.',
  choices:[{t:'Đánh',eff:()=>{fight('dvmatu',{scale:1,mod:.9});return 'Chúng chọn nhầm người.'}},{t:'Ném 15 thạch rồi đi',req:()=>S.stones>=15,reqT:'Cần 15',eff:()=>{S.stones-=15;return 'Chúng cười hô hố.'}}]},
q2r_tt_cocho:{loc:'tt_pho',title:'Sạp cổ vỉa hè',g:'蛊',text:()=>'Một sạp bán cổ lực giá rẻ, không rõ nguồn gốc.',
  choices:[{t:'Mua một con (60 thạch)',req:()=>S.stones>=60,reqT:'Cần 60',check:['ngo',12],ok:()=>{S.stones-=60;const k=pick(['nguluc','maluc','hungluc','hacthi','trucxung']);gainGu(k,true);return `Được ${GU[k].n} khỏe mạnh.`},fail:()=>{S.stones-=60;return 'Con cổ chết sau hai ngày.'}},{t:'Đi qua',eff:()=>'Ngươi không tin hàng vỉa hè.'}]},
});

Object.assign(AFTER,{
  q2_dv_win:()=>{S.f.dvRank=dvRank()+1;const r=S.f.dvRank;S.danh+=3;S.stones+=10+r*2;log(`Thắng. Hạng diễn võ ${r}${r===10||r===20?`, lên nội thành ${dvZone()}`:''}. +${10+r*2} nguyên thạch.`,'good');
    if(r===10){S.danh+=10;log('Danh hiệu: "người mới mạnh nhất lịch sử".','big')}
    if(r===20){S.danh+=15;log('Danh hiệu: "ngôi sao phục hưng lực đạo". Người ta bắt đầu gọi ngươi là Tiểu Thú Vương.','big');S.f.tieuThuVuong=1}},
  q2_dv_thua:()=>{S.danh=Math.max(0,S.danh-3);log('Thua một trận. Hạng không đổi.','danger')},
  q2_tt_viem:()=>{S.danh+=25;S.stones+=120;baiRel(15);log('Viêm Đột ngã. Cả diễn võ trường đứng dậy.','big')},
  q2_tt_cukhai:()=>{S.danh+=40;S.stones+=300;S.f.cukhaiThang=1;learn('q2_cukhaibi');storySetOutcome('cu_khai_bi','defeated_canon','Đánh bại Cự Khai Bi tại diễn võ trường nội thành, vang danh Tiểu Thú Vương');log('Cự Khai Bi quỳ một gối trên sàn. Tiểu Thú Vương. Thương gia hơn mười năm chưa có gia lão khác họ, giờ họ phải nghĩ lại.','big')},
  q2_tt_cukhai_thua:()=>{S.danh+=15;log('Ngươi thua trận cuối nhưng không mất Bảo Liên. Cả thành vẫn nhớ tám hư ảnh thú trên đầu ngươi.','big')},
});
