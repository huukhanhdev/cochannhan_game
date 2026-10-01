// Quyển 2 · Chương 2.6: Tam Xoa Sơn (canon VN 407–449)
// Lập hung danh, Khuyển Vương, bỏ mặc Bạch Ngưng Băng bị vây, Tín Vương, Cốt Dực, lấy một đối bảy, Thiết Bá Tu.

CHAPTERS.q2_tamxoa={n:'Tam Xoa Sơn',title:'Quyển hai · Chương sáu · Tam Xoa Sơn',unit:'tuần',turns:14,bg:'scene_tam_xoa_mountain',cap:4,
  intro:'Tam Xoa Sơn nằm giữa Tả gia và Xa gia. Ba trăm năm trước Vương gia bị Ô gia diệt; ba đứa con sống sót thành Khuyển Vương, Tín Vương, Bạo Vương, rồi đánh thẳng vào Ô gia. Truyền thừa của họ nằm trong một phúc địa Cổ Tiên đã mục nát.',
  ask:'Tuần này làm gì?',
  canon:{1:'q2_tx_toi',2:'q2_tx_himi',3:'q2_tx_tiet',4:'q2_tx_mo',6:'q2_tx_baivay',11:'q2_tx_vien',12:'q2_tx_bay',13:'q2_tx_batu',14:'q2_tx_ket'},
  side:['q2_tx_manhcuong','q2_tx_tudinh','q2_tx_lynhan','q2_tx_cotduc'],
  spots:[
    {id:'txvang',x:30,y:34,g:'犬',n:'Cột sáng vàng',d:'Khuyển Vương truyền thừa: bầy chó đấu bầy chó.',run:kvStep,show:()=>S.f.txMo&&!kvState().done},
    {id:'txlam',x:52,y:26,g:'信',n:'Cột sáng lam',d:'Tín Vương truyền thừa: luyện cổ đấu người lông.',run:tvStep,show:()=>S.f.txTv&&!tvState().done},
    {id:'txdo',x:74,y:24,g:'爆',n:'Cột sáng đỏ',d:'Bạo Vương truyền thừa: phòng trứng nổ.',run:bvStep,show:()=>S.f.txMo&&hasGu('baodan')&&!bvState().done},
    {id:'txnui',x:70,y:56,g:'山',n:'Sườn núi',d:'Cổ sư khắp Nam Cương đổ về. Kẻ yếu bị giết cướp cổ.',loc:'tx_nui',foes:['matutx'],evP:.55,foeP:.7},
    {id:'baicanh',x:40,y:72,g:'冰',n:'Hang núi',d:'Ở cạnh Bạch Ngưng Băng.',run:baiLesson,show:()=>!S.f.baiVay},
    {id:'tuluyen',x:84,y:40,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:12,y:52,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'refine',minor:1,x:90,y:20,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EN,{
  matutx:{n:'Ma tu giết cướp',hp:260,atk:[20,28],st:[40,70],bl:1,drop:.35,i:'Một ma tu Tam chuyển đỉnh rình trên sườn núi, chờ kẻ lạc đàn.'},
  hoanhmi:{n:'Hoành Mi Bạo Quân',hp:420,atk:[24,34],st:[80,120],bl:2,drop:.5,i:'Ma tu Tứ chuyển mày ngang, tiếng tăm hung bạo. Hắn muốn thử cái gọi là Tiểu Thú Vương.'},
  tiettamtu:{n:'Tiết Tam Tứ',hp:480,atk:[26,36],st:[90,130],bl:2,drop:.5,i:'Nữ cường giả bị gia tộc lớn hãm hại lưu đày, từng giết thú vương lấy cổ. Hư ảnh Bưu trên đầu: Xung Thiên Hổ.'},
  hanbatluu:{n:'Hàn Bất Lưu',hp:280,atk:[18,26],st:[50,80],bl:1,drop:.4,i:'Cổ sư Thủy đạo Tam đỉnh, bầy chó của hắn đông hơn bầy chó của ngươi.'},
  daidienvan:{n:'Đại Điện Văn',hp:360,atk:[22,30],st:[60,90],bl:2,wolf:1,i:'Bách thú vương loài chó, to gấp đôi, lông lam đậm có điện. Nó phun Điện Tương cổ ký sinh.'},
  thiettuyenhoa:{n:'Thiết Tuyến Hoa và Thiết Mộc',hp:400,atk:[20,28],st:[60,90],bl:1,i:'Tuyến Hoa giương Tán Liên cổ: đóa sen vàng đen thành chiếc dù chắn trước người. Sau lưng nàng, y sư Thiết Mộc sẵn sàng chữa thương.'},
  thietdaokho2:{n:'Thiết Đao Khổ',hp:420,atk:[28,38],st:[70,100],bl:1,i:'Tấn Ảnh, Thủ Nhận, Thiết Thủ, Liên Trảm, Tốc Chiến Phong, Đao Khí. Đao khách chỉ còn một mắt, dốc toàn lực.'},
  thietngaokhai:{n:'Thiết Ngạo Khai',hp:220,atk:[16,22],st:[40,60],bl:1,i:'Trinh sát Tam cao, mặt ngái ngủ. Hắn định chạy về Tam Xoa báo tin.'},
  thietbatu:{n:'Thiết Bá Tu',hp:1050,atk:[34,46],st:[300,400],bl:3,i:'"Bá Vương Đương Thời". Bá Lực cổ Tứ chuyển, Thổ Bá Vương cổ Ngũ chuyển hút sức từ đất. Ông ta ôm Thiết Nhược Nam trong tay, vừa chạy vừa đỡ đòn cho nàng.'},
  tulao:{n:'Tứ lão Thiết gia',hp:1400,atk:[40,54],st:[0,0],bl:0,i:'Bốn lão già áo sắt, sát chiêu Vô Cực Sưu Tỏa: gieo Tỏa cổ lên người ai thì người đó bay tới chín tầng mây cũng bị bắt về.'},
});
Object.assign(EAI,{matutx:{sk:'suppress'},hoanhmi:{def:3,sk:'rage',boss:1},tiettamtu:{def:2,sk:'charge',boss:1},hanbatluu:{sk:'howl'},daidienvan:{def:2,sk:'thunder',boss:1},
  thiettuyenhoa:{def:4,sk:'regen'},thietdaokho2:{sk:'charge',fast:1},thietngaokhai:{sk:'poison',fast:1},thietbatu:{def:5,sk:'regen',boss:1,regen:.06},tulao:{def:6,sk:'suppress',boss:1}});
Object.assign(ART,{matutx:{g:'魔',sc:'forest',c:'#b890d6'},hoanhmi:{g:'眉',sc:'forest',c:'#c8664e'},tiettamtu:{g:'虎',sc:'forest',c:'#e0a060'},hanbatluu:{g:'寒',sc:'forest',c:'#9fc7e8'},
  daidienvan:{g:'犬',sc:'forest',c:'#6fa0e0'},thiettuyenhoa:{g:'莲',sc:'forest',c:'#d8c070'},thietdaokho2:{g:'刀',sc:'forest',c:'#aeb8c2'},thietngaokhai:{g:'蚊',sc:'forest',c:'#aeb8c2'},
  thietbatu:{g:'霸',sc:'forest',c:'#c9a86a'},tulao:{g:'铁',sc:'forest',c:'#aeb8c2'}});
Object.assign(PORTRAIT,{matutx:'p_madutam',hoanhmi:'p_madutam',tiettamtu:'p_cultivator',hanbatluu:'p_cultivator',daidienvan:'p_wolfking',thiettuyenhoa:'p_giave',
  thietdaokho2:'p_giave',thietngaokhai:'p_giave',thietbatu:'p_gialao',tulao:'p_gialao'});
Object.assign(DROP_POOL,{matutx:['kimcuong','trucxung','tuongluc','mangluc'],hoanhmi:['mangluc','tuongluc'],tiettamtu:['quyluc','tuongluc'],hanbatluu:['thietbi']});
Object.assign(NPC,{
  himi:{n:'Hồ Mị Nhi',d:'Mị đạo, cháu của Mai Hoa bà bà'},
  lynhan:{n:'Lý Nhàn',d:'Ẩn hình, xảo trá'},
  dichhoa:{n:'Dịch Hỏa',d:'Tứ đỉnh, Liệu Nguyên Hỏa cổ'},
  batu:{n:'Thiết Bá Tu',d:'Trụ cột Thiết gia, Bá Vương Đương Thời'},
});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{himi:'媚',lynhan:'闲',dichhoa:'火',batu:'霸'});
Object.assign(MEM,{
  q2_tietamtu:{n:'Ba đòn của Tiết Tam Tứ',d:'Đòn thứ ba nàng bay lên ba trăm trượng rồi lao xuống. Né sang bên là nàng tự đâm xuống đất.'},
  q2_thietgia7:{n:'Đội bảy người Thiết gia',d:'Trinh sát Thiết Ngạo Khai sẽ chạy báo tin. Phá cổ viễn chiến của họ trước, rồi bay lên.'},
  q2_batu:{n:'Gánh nặng của Bá Tu',d:'Thiết Bá Tu phải ôm Thiết Nhược Nam. Đánh vào nàng thì ông ta phải đỡ.'},
});
Object.assign(DEATH_MEM,{tiettamtu:'q2_tietamtu',thietdaokho2:'q2_thietgia7',thiettuyenhoa:'q2_thietgia7',thietbatu:'q2_batu'});

// Trận chuỗi "lấy một đối bảy": khí huyết không hồi giữa các đợt. Có Cốt Dực thì bay lên, địch cận chiến khó với tới.
function flyMod(){return hasGu('cotduc')?.78:1}

Object.assign(EV,{
q2_tx_toi:{canon:1,title:'Tiểu Thú Vương tới Tam Xoa',hint:'Lập hung danh',g:'山',
  text:()=>'Bốn cường giả Tứ chuyển đỉnh trấn bốn hướng Tam Xoa Sơn. Trên sườn núi, cổ sư khắp Nam Cương chen nhau. Yếu thì ẩn nhẫn, mạnh thì lập hung danh: thanh danh đôi khi mạnh hơn vũ khí. Hoành Mi Bạo Quân chặn đường ngươi.',
  choices:()=>[
    {t:'Giết hắn trước mặt mọi người, giết luôn kẻ đứng xem',tag:'ma',canon:1,dao:15,eff:()=>{fight('hoanhmi',{after:'q2_tx_hoanhmi'});return 'Hoành Mi sợ Khổ Lực: càng đánh ngươi càng mạnh.'}},
    {t:'Tránh, tìm hang ẩn nấp',eff:()=>{S.tamco++;return 'Ngươi đợi người khác dọn đường. Tâm cơ +1.'}},
  ]},
q2_tx_himi:{canon:1,title:'Hồ Mị Nhi',hint:'Mị đạo',g:'媚',who:'himi',
  text:()=>'Hồ Mị Nhi, cháu của Mai Hoa bà bà, uốn mình trên tảng đá: "Nhiều tiền bối chính ma muốn thử hai người. Chỉ mong ngươi sống mà xuống núi." Trên người nàng có cổ của Mai Hoa bà bà; giết nàng là rước họa.',
  choices:()=>[
    {t:'Cười nhạt, không để ý',canon:1,eff:()=>{meet('himi');meet('lynhan');S.tamco++;return 'Sau lưng nàng, Lý Nhàn đứng như cái bóng. Tâm cơ +1.'}},
    {t:'Dọa nàng',tag:'ma',eff:()=>{meet('himi');rel('himi',-20);S.susp+=10;return 'Nàng cười khanh khách rồi biến mất.'}},
  ]},
q2_tx_tiet:{canon:1,title:'Ba đòn của Tiết Tam Tứ',hint:'Tiết Tam Tứ',g:'虎',
  text:()=>'Tiết Tam Tứ thách ngươi. Ngươi đề nghị luật: ta đứng yên cho ngươi đánh ba đòn, rồi tới lượt ta.'+(mem('q2_tietamtu')?' Ngươi nhớ đòn thứ ba.':''),
  choices:()=>[
    {t:'Đòn thứ ba, né sang bên, bội ước, lao vào tung hư ảnh',tag:'ma',canon:1,dao:15,eff:()=>{fight('tiettamtu',{after:'q2_tx_tiet',mod:.7});return 'Nàng đâm xuống tạo hố ba trượng, choáng váng. Đám đông mắng: ti tiện, vô sỉ. "Ta nhận thua, rồi sao?"'}},
    {t:'Đứng yên chịu đủ ba đòn, giữ lời',tag:'chinh',drift:6,eff:()=>{S.hp=Math.max(1,S.hp-Math.round(maxHp()*.5));fight('tiettamtu',{after:'q2_tx_tiet'});return 'Khí huyết mất một nửa. Khổ Lực trong khiếu ngươi đang cười.'}},
    {t:'Từ chối',eff:()=>{S.danh-=10;return 'Danh vọng −10.'}},
  ]},
q2_tx_mo:{canon:1,title:'Cột sáng mở',hint:'Truyền thừa mở',g:'王',
  text:()=>'Ba cột sáng mở. Luật phúc địa: thời gian bên trong gấp ba; chỉ dùng được Ngự Khuyển cổ trong cột vàng, Chỉ Hạc cổ trong cột lam, Bạo Đản cổ trong cột đỏ. Trừ Xuân Thu Thiền: cổ tiên Lục chuyển, mỗi con độc nhất, không quy tắc nào trói được. Chết trong phúc địa thì không kịp tự hủy cổ, nên giết người đoạt cổ tràn lan.',
  choices:()=>[
    {t:'Vào cột vàng',canon:1,eff:()=>{S.f.txMo=1;return 'Hai mươi bảy con chó ra đón ngươi.'}},
  ]},
q2_tx_baivay:{canon:1,title:'Bạch Ngưng Băng bị vây',hint:'Tứ lão Thiết gia',g:'铁',who:'bainu',
  text:()=>'Tin tới: Bạch Ngưng Băng giết một cổ sư Thiết gia trong truyền thừa. Thiết Tú Hoa cổ trong hồn phách người Thiết gia để lại mùi trên kẻ giết. Tứ lão Thiết gia nhốt nàng trong Thiết Quỹ. Cột sáng lam của Tín Vương ở ngay bên cạnh.',
  choices:()=>[
    {t:'Bước vào Tín Vương ngay trước mắt nàng',tag:'ma',canon:1,dao:15,eff:()=>{S.f.baiVay=1;S.f.baiAway=1;S.f.txTv=1;baiRel(-20);return 'Bạch Ngưng Băng nhìn theo, giận tím mặt. Thiên hạ thấy ngươi lạnh lùng. Nàng hút hết sự chú ý của Thiết gia; còn ngươi có thời gian vượt nàng.'}},
    {t:'Liều cứu nàng',tag:'chinh',drift:12,eff:()=>{S.f.txTv=1;fight('tulao',{after:'q2_tx_cuubai',spare:.3,spareAfter:'q2_tx_cuubai_hong',spareT:'Một sợi xích sắt từ hư không siết lấy ngươi rồi thả ra. Tứ lão cười: chưa tới lúc.'});return 'Bốn lão già cùng quay lại.'}},
  ]},
q2_tx_vien:{canon:1,title:'Viện binh Thiết gia',hint:'Thiết Bá Tu tới',g:'霸',who:'batu',
  text:()=>'Lý Nhàn báo cho Hồ Mị Nhi: viện binh Thiết gia sắp tới. Thiết Phách Tu, người đời gọi Thiết Bá Tu, "Bá Vương Đương Thời", đi cùng Thiết Nhược Nam, giờ đã Tứ chuyển. Theo sau là Thiết Mộc, Thiết Ngạo Khai, Thiết Đao Khổ, Thiết Tuyến Hoa. Nhược Nam tới vì biết chuyện Thanh Mao Sơn còn ẩn tình.',
  choices:()=>[
    {t:'Chặn đường, "đánh viện binh"',tag:'ma',canon:1,eff:()=>{meet('batu');meet('nhuocnam');S.f.chanVien=1;learn('q2_thietgia7');return 'Ngươi tiết lộ bí mật thần thâu Lục Toản Phong lẻn vào Trấn Ma Tháp để làm họ rối. "Thiết gia là cái thá gì. Con đường vắng này hợp để giết các ngươi."'}},
    {t:'Tránh mặt, để họ đi qua',drift:10,eff:()=>{meet('batu');S.f.tranhVien=1;return 'Đội Thiết gia tới Tam Xoa nguyên vẹn.'}},
  ]},
q2_tx_bay:{canon:1,title:'Lấy một đối bảy',hint:'Một đối bảy',g:'七',cond:()=>S.f.chanVien,
  text:()=>'Bảy người Thiết gia dàn trận "cái túi". Thiết Nhược Nam quỳ một gối, cỏ quanh nàng bện thành Đằng Giáp Thảo Binh. Thiết Bá Tu đứng chắn trước nàng.'+(hasGu('cotduc')?' Sau lưng ngươi, Cốt Dực chờ được bung ra.':''),
  choices:()=>[
    {t:'Lao vào, đánh Thiết Tuyến Hoa và Thiết Mộc trước',canon:1,eff:()=>{fight('thiettuyenhoa',{after:'q2_bay1',flee:false,mod:flyMod(),spare:.15,spareAfter:'q2_bay_lui',spareT:'Ngươi vỗ cánh bay lên, rút khỏi trận.'});return hasGu('cotduc')?'Ngươi bung Cốt Dực. Thiết gia tưởng ngươi không biết bay.':'Ngươi xông vào giữa trận.'}},
  ]},
q2_bay2:{title:'Đao khách một mắt',g:'刀',
  text:()=>'Thiết Tuyến Hoa ngã, đầu lìa khỏi cổ. Thiết Mộc bị xé hai tay rồi đập nát đầu. Ngươi ngửa đầu cười, máu người dính đầy áo. Thiết Đao Khổ lao lên, dốc hết cổ tấn công.',
  choices:[
    {t:'Đón đòn, chờ hắn cạn chân nguyên',eff:()=>{fight('thietdaokho2',{after:'q2_bay2',flee:false,mod:flyMod(),spare:.15,spareAfter:'q2_bay_lui',spareT:'Ngươi bay lên, bỏ trận.'});return 'Hắn là cổ sư Tam chuyển. Chân nguyên của hắn không đủ cho cả trận.'}},
    {t:'Bay lên, rút lui',eff:()=>{AFTER.q2_bay_lui();return 'Ngươi rời trận.'}},
  ]},
q2_bay3:{title:'Kẻ chạy báo tin',g:'蚊',
  text:()=>'Thiết Đao Khổ bị bẻ gãy cổ. Thiết Ngạo Khai, trinh sát, đã quay đầu chạy về Tam Xoa báo tin. Nhược Nam thất khiếu chảy máu, dồn mấy nghìn thảo binh vào ngươi.',
  choices:[
    {t:'Đuổi theo Thiết Ngạo Khai',eff:()=>{fight('thietngaokhai',{after:'q2_bay3',flee:false,mod:flyMod()});return hasGu('cotduc')?'Trên không, hắn chạy đâu cũng thấy.':'Hắn chạy nhanh.'}},
    {t:'Để hắn chạy',drift:4,eff:()=>{S.f.ngaoKhaiThoat=1;S.susp+=20;S.evq.push('q2_bay4');return 'Hiềm nghi +20. Tứ lão sẽ biết.'}},
  ]},
q2_bay4:{title:'Còn hai người',g:'霸',who:'batu',
  text:()=>'Chỉ còn Thiết Nhược Nam, điên dại lẩm bẩm "ta sẽ giết ngươi", và Thiết Bá Tu. Bá Tu gào: "Tội ác tày trời!" Ngươi cười: giết người khác không ai nói; giết người Thiết gia thì thành tội ác tày trời. Tội nghiệt này ngươi thích.',
  choices:[
    {t:'Dừng tay, hồi nguyên thạch, chờ Bá Tu bỏ chạy',eff:()=>{S.ess=Math.min(maxEss(),S.ess+Math.round(maxEss()*.4));S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.2));learn('q2_batu');return 'Bá Tu nhận ra điều đáng sợ nhất ở ngươi là tâm trí. Ông ta ôm Nhược Nam chạy về Tam Xoa.'}},
  ]},
q2_tx_batu:{canon:1,title:'Bá Vương Đương Thời',hint:'Thiết Bá Tu',g:'霸',who:'batu',cond:()=>S.f.chanVien&&!S.f.bayLui,
  text:()=>'Thiết Bá Tu ôm Thiết Nhược Nam chạy về Tam Xoa. Ngươi vỗ Cốt Dực truy kích trên không, trút thú ảnh Lôi Trư, Nham Ngạc xuống. Nhược Nam mất kiểm soát, thành gánh nặng chí mạng: Bá Tu phải lấy thân mình đỡ đòn cho nàng.'+(mem('q2_batu')?' Ngươi nhớ: đánh vào nàng thì ông ta phải đỡ.':''),
  choices:()=>[
    {t:'Truy kích, nhắm vào Nhược Nam',tag:'ma',canon:1,eff:()=>{fight('thietbatu',{after:'q2_tx_batu',mod:(mem('q2_batu')?.82:.92)*flyMod(),spare:.15,spareAfter:'q2_tx_batu_hong',spareT:'Tứ lão Thiết gia xuất hiện ở chân trời. Ngươi quay cánh bỏ đi.'});return 'Bá Tu không dám đứng lại đánh bằng Thổ Bá Vương.'}},
    {t:'Để họ đi',eff:()=>{S.f.batuSong=1;return 'Bá Tu và Nhược Nam về tới Tam Xoa.'}},
  ]},
q2_tx_ket:{canon:1,title:'Danh chấn Nam Cương',hint:'Tiếng tăm lan truyền',g:'名',
  text:()=>S.f.batuChet?'Gần Tam Xoa, Thiết Bá Tu dùng tàn lực kích hoạt Thiết Quỹ cổ, giam kín Nhược Nam để bảo vệ nàng, rồi chết. Tứ lão hủy Thiết Quỹ đang nhốt Bạch Ngưng Băng để giữ Thiết Quỹ của Nhược Nam. Nàng bay tới bên ngươi. Tin Tiểu Thú Vương một mình giết Bá Vương Đương Thời chấn động khắp Nam Cương.':'Thế cục Tam Xoa vẫn căng như dây đàn. Người ta bàn tán về Tiểu Thú Vương, về đôi cánh xương sắt của hắn.',
  choices:[{t:'Về hang tĩnh dưỡng, chờ kỳ mở kế tiếp',eff:()=>{S.f.baiVay=0;S.f.baiAway=0;chapEnd('q2_ngu');return 'Chương sáu kết thúc.'}}]},

// truyền thừa
q2_kv_han:{title:'Hàn Bất Lưu',g:'寒',
  text:()=>'Ải 10. Hàn Bất Lưu dẫn bầy chó đông hơn chặn đường ngươi, đòi ngươi quỳ làm nô.',
  choices:[
    {t:'Phá trận chó của hắn, rồi giết hắn',tag:'ma',eff:()=>{fight('hanbatluu',{after:'q2_kv_han'});return 'Hắn quỳ xin làm nô. Ngươi đòi gieo Nô Lệ cổ. Hắn không chịu.'}},
    {t:'Tránh',eff:()=>{kvState().cho-=4;return 'Mất 4 con chó để thoát.'}},
  ]},
q2_kv_daidien:{title:'Đại Điện Văn',g:'犬',
  text:()=>'Từ ải 20 có bách thú vương. Đại Điện Văn to gấp đôi, lông lam đậm tóe điện. Bắt giặc phải bắt vua.',
  choices:[
    {t:'Dồn toàn lực bắt nó',check:['tamco',14],ok:()=>{kvState().cho+=15;S.f.daiDienVan=1;return 'Đại Điện Văn cúi đầu. Bầy chó điện của nó theo ngươi. +15 con.'},fail:()=>{fight('daidienvan',{after:'q2_kv_dien'});return 'Nó phun Điện Tương cổ ký sinh vào ngươi.'}},
    {t:'Rời truyền thừa, mang phần thưởng đã có',eff:()=>{kvState().done=1;S.stones+=80;return 'Nhiều người rời vì ổn thỏa. +80 nguyên thạch.'}},
  ]},
q2_kv_thuong:{title:'Phần thưởng ải 30',g:'赏',
  text:()=>'Phần thưởng mỗi hướng hiện ra trước. Sau ải 30, thú vương mang đầy cổ ký sinh; qua ải nào cũng phải xem vận.',
  choices:[
    {t:'Hướng chó Xác Thối: Bạch Ngân Xá Lợi Cổ',eff:()=>{gainGu('xaloi3');kvState().done=1;return 'Ngươi lấy phần thưởng rồi ra.'}},
    {t:'Hướng Đồng Bì: tắm đồng nóng chảy, lấy Tinh Thiết Cốt',eff:()=>{gainGu('tinhthietcot');gainGu('lientrongdongbi');S.hp=Math.max(1,S.hp-40);kvState().done=1;return 'Ngươi tắm trong đồng nóng chảy. Khí huyết −40. Da đồng, xương sắt đen.'}},
  ]},
q2_tv_khon:{title:'Người lông khôn lên',g:'毛',
  text:()=>'Ải 20. Chuyện Nhân Tổ: Thái Nhật Dương Mãng bị người lông trói làm thuốc dẫn luyện Vĩnh Sinh cổ; Hư Vinh cổ làm người lông tự đốt lông mình vì muốn có tóc đỏ như lửa. Từ đây người lông khôn hơn: nịnh không còn đủ.',
  choices:[{t:'Tiếp tục',eff:()=>{S.ngo++;S.f.thanDuTale=1;return 'Ngươi nhớ kỹ Thần Du cổ: con cổ thai nghén trong người đã uống đủ bốn loại rượu cực phẩm, chỉ bay khi say. Ngộ tính +1.'}},{t:'Rút ra',eff:()=>{tvState().done=1;S.stones+=60;return '+60 nguyên thạch.'}}]},
q2_tv_thuylung:{title:'Thủy Lung cổ',g:'水',
  text:()=>'Ải 32. Người lông luyện hỏng dưới tay ngươi, sét trời đánh hắn thành than. Phần thưởng: Thủy Lung cổ bắt cổ hoang.',
  choices:[{t:'Nhận, đi tiếp',eff:()=>{gainGu('thuylung',true);return 'Còn tám ải tới ải 40.'}}]},
q2_tv_ra:{title:'Ải 40',g:'赏',
  text:()=>'Ải 40: được dùng một cổ luyện đạo của mình, và được chọn rời truyền thừa với phần thưởng lớn: Hoàng Kim Xá Lợi, Vô Túc Điểu, nguyên thạch.',
  choices:[{t:'Nhận thưởng, rời truyền thừa',eff:()=>{gainGu('xaloi4');S.f.votucTv=1;S.stones+=200;tvState().done=1;return 'Cột sáng giờ chỉ còn to bằng miệng chén. Ngươi ra ngoài. Hoàng Kim Xá Lợi và Vô Túc Điểu trong tay.'}}]},

// bên lề
q2_tx_manhcuong:{title:'Hang của Mãng Cuồng',g:'蟒',cond:()=>S.turn>=2,
  text:()=>'Mãng Cuồng, Tam cao, thân trên vảy rắn, đang ở một hang giữa sườn núi. Thấy ngươi, hắn lập tức khúm núm nhường hang.',
  choices:[{t:'Nhận hang, bắt hắn canh cửa',tag:'ma',eff:()=>{S.f.hangMang=1;S.hp=maxHp();return 'Có chỗ ở kín đáo. Kẻ nào tới gây sự là đưa tới để lập uy.'}}]},
q2_tx_tudinh:{title:'Bốn Tứ đỉnh',g:'四',cond:()=>S.turn>=3,
  text:()=>'Long Thanh Thiên ở phía đông, da xanh biếc, mắt lửa lục, độc đạo. Ba người kia cũng không kém. Dịch Hỏa, người có Liệu Nguyên Hỏa cổ, và Bách Tuế Đồng Tử mộc đạo kiêng dè nhau.',
  choices:[{t:'Ghi nhớ',eff:()=>{meet('dichhoa');S.tamco++;return 'Tâm cơ +1.'}}]},
q2_tx_lynhan:{title:'Không Thương, Thương Không',g:'空',who:'lynhan',cond:()=>S.met.lynhan&&S.turn>=5,
  text:()=>'Lý Nhàn khoe Thương Không cổ Tứ chuyển của Đông Hải. Ngươi buột miệng nói ra cả chuỗi hợp luyện của nó, tới cả Thiên Tỉnh cổ. Hắn nhìn ngươi, mắt lóe lên.',
  choices:[{t:'Mỉm cười',eff:()=>{rel('lynhan',-10);return 'Hắn sẽ báo cho Hồ Mị Nhi.'}}]},
q2_tx_cotduc:{title:'Cốt Dực',g:'翼',cond:()=>S.f.votucTv&&!hasGu('cotduc'),
  text:()=>'Vô Túc Điểu, hoa Cửu Cung, đá Vấn Đỉnh, Kim Ô Lưu Tinh, cỏ Hàn Băng. Mười tám vạn nguyên thạch nguyên liệu. Luyện thành, gai xương từ sống lưng sẽ xuyên thịt mọc thành cánh.',
  choices:[
    {t:'Luyện Cốt Dực (180 thạch)',req:()=>S.stones>=180,reqT:'Cần 180 nguyên thạch',check:['ngo',13],bonus:()=>hasGu('tinhthietcot')?3:0,ok:()=>{
      S.stones-=180;gainGu('cotduc');
      if(typeof storySetOutcome==='function') storySetOutcome('cotduc_refined','iron_wings_crafted',{choiceText:'Luyện thành Cốt Dực Cổ từ Vô Túc Điểu và xương sắt đen',isLech:false,note:'Sở hữu đôi cánh bay ba chiều, nắm giữ ưu thế không chiến tuyệt đối.'});
      return 'Đôi cánh sắt đen. Át chủ bài mới.';
    },fail:()=>{S.stones-=90;return 'Thất bại, mất nửa nguyên liệu. Có thể thử lại.'}},
    {t:'Để sau',eff:()=>'Ngươi cất Vô Túc Điểu đi.'},
  ]},
q2r_tx_xac:{loc:'tx_nui',title:'Xác trên sườn núi',g:'尸',text:()=>'Một cổ sư chết chưa lâu, túi cổ còn nguyên.',
  choices:[{t:'Lấy',eff:()=>{S.stones+=rand(20,40);if(Math.random()<.3){const k=pick(['kimcuong','tuongluc','mangluc','quyluc']);gainGu(k,true);return `Được nguyên thạch và ${GU[k].n}.`}return 'Được nguyên thạch.'}}]},
q2r_tx_ruou:{loc:'tx_nui',title:'Rượu Kim Cương Hầu',g:'酒',text:()=>'Một ma tu bán rượu Kim Cương Hầu, một trong bốn loại rượu cực phẩm.',
  choices:[{t:'Mua (60 thạch)',req:()=>S.stones>=60,reqT:'Cần 60',eff:()=>{S.stones-=60;S.f.ruou=(S.f.ruou||0)+1;return `Rượu cực phẩm: ${S.f.ruou}/4.`}},{t:'Thôi',eff:()=>'Ngươi đi qua.'}]},
});

Object.assign(AFTER,{
  q2_tx_hoanhmi:()=>{
    S.danh+=20;S.f.hungDanh=1;
    if(typeof storySetOutcome==='function') storySetOutcome('tamxoa_reputation','hoanhmi_slain',{choiceText:'Chém đầu Hoành Mi Bạo Quân trước mặt quần hùng lập hung danh',isLech:false,note:'Tiểu Thú Vương danh chấn Tam Xoa Sơn, không ai dám khinh nhờn.'});
    log('Hoành Mi nát dưới sáu thú ảnh thực thể. Ngươi giết luôn Kim Thành Ân đứng xem. Không ai trên sườn núi dám nhìn thẳng vào ngươi.','big');
  },
  q2_tx_tiet:()=>{S.danh+=15;learn('q2_tietamtu');log('Tiết Tam Tứ gục. Thành tín chỉ là công cụ.','big')},
  q2_kv_han:()=>{kvState().cho+=8;log('Bầy chó của Hàn Bất Lưu thành của ngươi. +8 con.','good')},
  q2_kv_dien:()=>{kvState().cho+=6;log('Đại Điện Văn chết. Bầy chó điện tan rã, ngươi thu được một phần.','good')},
  q2_tx_cuubai:()=>{S.f.baiVay=0;S.f.baiAway=0;baiRel(30);log('Ngươi xé mở Thiết Quỹ. Bạch Ngưng Băng nhìn ngươi như nhìn một người lạ.','big')},
  q2_tx_cuubai_hong:()=>{S.f.baiVay=1;S.f.baiAway=1;baiRel(10);log('Nàng vẫn bị nhốt, nhưng đã thấy ngươi quay lại.','sys')},
  q2_bay1:()=>{S.evq.push('q2_bay2')},
  q2_bay2:()=>{S.evq.push('q2_bay3')},
  q2_bay3:()=>{S.evq.push('q2_bay4')},
  q2_bay_lui:()=>{S.f.bayLui=1;log('Ngươi bay đi. Thiết gia đếm xác người của mình.','danger')},
  q2_tx_batu:()=>{
    S.f.batuChet=1;S.danh+=40;S.stones+=200;
    if(typeof storySetOutcome==='function') storySetOutcome('thiet_ba_tu','batu_slain_canon',{choiceText:'Truy sát hạ gục Thiết Bá Tu ("Bá Vương Đương Thời")',isLech:false,note:'Một mình đồ sát đội viện binh Thiết gia, Thiết Bá Tu tử trận, danh chấn Nam Cương.'});
    log('Thiết Bá Tu toàn thân nát bấy. Trong gang tấc cuối cùng ông ta dùng Thiết Quỹ cổ giam kín Nhược Nam.','big');
  },
  q2_tx_batu_hong:()=>{S.f.batuSong=1},
});
ENDINGS.q2_tieuthuvuong={t:'Tiểu Thú Vương',d:'Một mình giết đội bảy người Thiết gia. Khắp Nam Cương gọi ngươi là Đệ nhất tân tinh Ma đạo. Còn tiếp: Ngũ chuyển giáng lâm Tam Xoa, Địa linh Bá Quy, Bạch Ngưng Băng phản bội, Xuân Thu Thiền lần ba.'};
