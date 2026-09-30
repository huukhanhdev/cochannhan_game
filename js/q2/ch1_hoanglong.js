// Quyển 2 · Chương 2.1: Sông Hoàng Long (canon VN 207–227)
// Xuôi sông sau khi Thanh Mao Sơn diệt vong. Cổ chết đói, thuốc cạn, Bạch Ngưng Băng chưa quen thân nữ.

function loseGu(k){const i=S.gu.findIndex(g=>g.k===k);if(i>=0)S.gu.splice(i,1)}
function baiRel(n){rel('bainu',n)}

// Ở cạnh Bạch Ngưng Băng: dạy nàng đánh tiết kiệm chân nguyên (kinh nghiệm 500 năm, VN 212)
function baiLesson(){
  S.f.baiLes=(S.f.baiLes||0)+1;baiRel(6);
  const n=S.f.baiLes;
  if(n===1)log('Ngươi chỉ cho nàng: đòn nào cũng dốc hết chân nguyên là thói quen của người được gia tộc nuôi. Bạch Ngưng Băng cau mày nhưng vẫn nghe.','sys');
  else if(n===2)log('Nàng tập ra đòn vừa đủ. Chân nguyên Giáp 9 thành không còn cuồn cuộn như Bắc Minh Băng Phách, nàng phải học tính từng phần.','sys');
  else if(n===3){log('Bạch Ngưng Băng đã quen với thân thể mới. Trong trận, nàng không còn phí sức. (Nàng yểm trợ tốt hơn.)','good');baiRel(6)}
  else log('Hai người luyện đao bên bờ sông tới tối.','sys');
  if(Math.random()<.3){S.satphat++;log('Đối luyện với nàng mài giũa bản năng. Sát phạt +1.','good')}
}

CHAPTERS.q2_hoanglong={n:'Sông Hoàng Long',title:'Quyển hai · Chương một · Sông Hoàng Long',unit:'tuần',turns:9,bg:'bg_forest',cap:1,
  intro:'Bè gỗ trôi theo dòng Hoàng Long, xa dần Thanh Mao Sơn đã chìm trong băng.',
  ask:'Tuần này làm gì?',
  canon:{1:'q2_hl_be',2:'q2_hl_codoi',3:'q2_hl_muon',4:'q2_hl_casau',6:'q2_hl_phonghan',7:'q2_hl_dungnham',8:'q2_hl_thuyhoa',9:'q2_hl_ket'},
  side:['q2_hl_guong','q2_hl_thuoc','q2_hl_nhanto'],
  spots:[
    {id:'bosong',x:28,y:62,g:'河',n:'Bờ sông',d:'Bắt cá, dò đường thủy. Thú dữ dưới nước.',loc:'hl_song',foes:['toatien','ongdoc'],quiet:'Nước sông đục ngầu, không có gì ngoài rong rêu.'},
    {id:'rungven',x:62,y:38,g:'林',n:'Rừng ven sông',d:'Tìm cổ hoang và thảo dược.',loc:'hl_rung',foes:['khicuongtru','ongdoc'],quiet:'Rừng im ắng. Ngươi hái được ít lá thuốc.'},
    {id:'baicanh',x:46,y:74,g:'冰',n:'Ở cạnh Bạch Ngưng Băng',d:'Dạy nàng đánh tiết kiệm chân nguyên.',run:baiLesson},
    {id:'tuluyen',x:80,y:62,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:14,y:40,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'refine',minor:1,x:88,y:28,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(EV,{
q2_hl_be:{canon:1,title:'Bè gỗ trên sông Hoàng Long',hint:'Cá Toa Tiễn',g:'河',sc:'tide',who:'bainu',
  text:()=>'Mặt sông bỗng sủi bọt. Cả bầy cá đầu nhọn như mũi tên lao lên húc vào bè. Bạch Ngưng Băng ngồi ở đầu bè, tóc bạc xõa xuống vai, thân thể mảnh hơn trước nhiều. Nàng vẫn chưa quen việc mình đã thành nữ nhân.',
  choices:()=>[
    {t:'Đứng chắn trước nàng, đánh bầy cá',canon:1,eff:()=>{baiRel(8);fight('toatien',{after:'q2_toatien'});return 'Ngươi rút cổ. Nàng nhìn lưng ngươi, không nói gì.'}},
    {t:'Để nàng tự lo, ngươi giữ bè',tag:'ma',eff:()=>{baiRel(-5);S.hp-=15;S.herbs=Math.max(0,S.herbs-1);return 'Bè vỡ một góc. Hai người lội vào bờ, mất một gốc linh dược. Nàng lạnh lùng lau vết máu trên tay.'}},
  ]},
q2_hl_codoi:{canon:1,title:'Cổ trùng chết đói',hint:'Cổ chết đói',g:'饿',
  text:()=>{const n=S.gu.filter(g=>g.h>0).length;return `Nguyên thạch không đủ nuôi tất cả. Trong không khiếu, ${n?'mấy con cổ mang từ Thanh Mao Sơn':'đám cổ trùng'} bắt đầu lịm đi. Đâu Suất Hoa còn chứa thuốc phàm, băng vải, nồi sắt, thịt khô.`},
  choices:()=>[
    {t:'Bỏ mặc cổ yếu, giữ nguyên thạch cho Tửu trùng và Bảo Liên',canon:1,eff:()=>{const dead=S.gu.filter(g=>g.h>0&&GU[g.k].t!=='fate');dead.forEach(g=>loseGu(g.k));S.tamco++;return dead.length?`Ngươi để ${dead.map(g=>GU[g.k].n).join(', ')} chết. Năm trăm năm ma đầu biết thứ gì đáng giữ. Tâm cơ +1.`:'Không có con nào đáng tiếc. Tâm cơ +1.'}},
    {t:'Bỏ 20 nguyên thạch nuôi cho hết',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',eff:()=>{S.stones-=20;S.gu.forEach(g=>g.h=0);return 'Cổ trùng no. Túi nguyên thạch vơi hẳn.'}},
    {t:'Lấy đồ trong Đâu Suất Hoa bán cho thuyền buôn đi ngang',check:['tamco',12],ok:()=>{S.stones+=18;S.herbs++;return 'Nồi sắt và than đổi được 18 nguyên thạch, thêm một gốc linh dược.'},fail:()=>{S.stones+=6;return 'Thuyền buôn ép giá. Chỉ được 6 nguyên thạch.'}},
  ]},
q2_hl_muon:{canon:1,title:'Cho mượn cổ',hint:'Cho Bạch Ngưng Băng mượn cổ',g:'借',who:'bainu',
  text:()=>'Bạch Ngưng Băng mất gần hết cổ khi tự bạo. Theo luật cổ sư, chủ cổ có thể cho người khác mượn, đổi ý lúc nào thì lấy lại lúc ấy. Nàng không xin. Nàng chỉ nhìn.',
  choices:()=>[
    {t:'Cho mượn một con cổ phòng ngự',canon:1,req:()=>S.gu.some(g=>GU[g.k].t==='guard'),reqT:'Cần một cổ phòng ngự',eff:()=>{const g=S.gu.find(x=>GU[x.k].t==='guard');loseGu(g.k);S.f.baiMuon=g.k;baiRel(15);return `Ngươi đưa ${GU[g.k].n} cho nàng. "Mượn thôi." Nàng gật đầu. Trong trận nàng sẽ đỡ cho ngươi.`}},
    {t:'Không cho. Đồ của ta là của ta',tag:'ma',eff:()=>{baiRel(-8);S.tamco++;return 'Nàng cười nhạt. Tâm cơ +1.'}},
    {t:'Dạy nàng bắt cổ hoang thay vì mượn',check:['ngo',11],ok:()=>{baiRel(10);S.ngo++;return 'Hai người bắt được một con cổ băng nhỏ dưới tảng đá. Nàng giữ nó. Ngộ tính +1.'},fail:()=>{baiRel(2);return 'Không bắt được gì. Nàng không trách.'}},
  ]},
q2_hl_casau:{canon:1,title:'Cá sấu vương sáu chân',hint:'Cá sấu vương',g:'鳄',sc:'tide',
  text:()=>'Một khúc gỗ mục trôi ngược dòng. Không phải gỗ: đó là lưng một con cá sấu dài ba trượng, sáu chân quẫy nước. Bách thú vương của sông Hoàng Long.'+(mem('q2_casau')?' Ngươi nhớ: nó chỉ mở mõm khi cắn, và vết thương của nó không tự khép.':''),
  choices:()=>[
    {t:'Giết nó. Trên người nó có cổ',canon:1,eff:()=>{fight2('casauvuong',{after:'q2_casau',mod:mem('q2_casau')?.85:1});return 'Nước sông nổi sóng.'}},
    {t:'Lên bờ đi đường vòng',eff:()=>{S.hp-=10;return 'Hai ngày lội bùn. Khí huyết −10.'}},
  ]},
q2_hl_phonghan:{canon:1,title:'Sáu ngày phong hàn',hint:'Bạch Ngưng Băng ngã bệnh',g:'病',who:'bainu',
  text:()=>'Thân thể mới của Bạch Ngưng Băng không chịu nổi gió sông. Nàng sốt sáu ngày liền. Người từng mang Bắc Minh Băng Phách giờ run lên vì lạnh.',
  choices:()=>[
    {t:'Ở lại chăm nàng: nấu canh nấm, đắp áo',canon:1,eff:()=>{baiRel(20);S.f.baiNo=1;return 'Sáu ngày. Khi nàng tỉnh, trên người có thêm một lớp áo ấm của ngươi. Nàng im lặng rất lâu. Ma đầu có thể được kính phục, không thể được thần phục; nhưng nàng đã bắt đầu tin.'}},
    {t:'Bỏ nàng lại, ngươi đi trước',tag:'ma',drift:6,eff:()=>{baiRel(-25);S.f.baiAway=1;later('q2_hl_baive',1,2);return 'Ngươi đi. Không có nàng, đường sông lặng hơn và nguy hiểm hơn.'}},
    {t:'Dùng thuốc trong Đâu Suất Hoa rồi đi tiếp',req:()=>S.herbs>=1,reqT:'Cần 1 linh dược',eff:()=>{S.herbs--;baiRel(8);return 'Thuốc hạ sốt. Nàng tỉnh sau hai ngày, không hỏi ngươi đã làm gì.'}},
  ]},
q2_hl_baive:{title:'Nàng đuổi kịp',g:'冰',who:'bainu',
  text:()=>'Bạch Ngưng Băng đuổi kịp ngươi bên một khúc quanh, mặt còn xanh xao. "Dương cổ còn trong tay ngươi. Ta đi đâu được."',
  choices:[{t:'Gật đầu',eff:()=>{S.f.baiAway=0;return 'Hai người lại đi cùng nhau. Khoảng cách giữa họ xa hơn trước.'}}]},
q2_hl_dungnham:{canon:1,title:'Hiên Viên Thần Kê',hint:'Thần Kê càn quét',g:'鸡',sc:'fire',
  text:()=>'Cá sấu dung nham trong đầm phun cầu lửa vào ngươi. Rồi trời bỗng có cầu vồng. Hiên Viên Thần Kê, vạn thú vương loài chim, lao xuống đầm. Nó giết cả cá sấu lẫn bầy vượn chỉ trong mấy nhịp cánh.',
  choices:()=>[
    {t:'Nấp, chờ Thần Kê bay đi rồi nhặt xác cá sấu',canon:1,check:['tamco',12],ok:()=>{gainGu('tichhoi');S.stones+=25;return 'Thần Kê bay đi. Trong xác cá sấu dung nham còn Tích Hôi Cổ, cổ trị liệu Tam chuyển. Hợp với ngươi. +25 nguyên thạch.'},fail:()=>{fight2('casaunham',{after:'q2_dungnham'});return 'Một con cá sấu dung nham còn sống bò ra khỏi đầm, lao về phía ngươi.'}},
    {t:'Đánh cá sấu dung nham trước khi Thần Kê tới',eff:()=>{fight2('casaunham',{after:'q2_dungnham',mod:1.1});return 'Ngươi phải thắng thật nhanh.'}},
    {t:'Khiêu khích Thần Kê',tag:'ma',drift:4,eff:()=>{fight('hienvien',{spare:.3,spareT:'Thần Kê hất ngươi văng xuống đầm rồi bỏ đi. Nó không coi ngươi là đối thủ.'});return 'Điên rồ.'}},
  ]},
q2_hl_thuyhoa:{canon:1,title:'Nữ ma tu trong rừng',hint:'Trần Thúy Hoa',g:'翠',who:'thuyhoa',
  text:()=>'Lần theo vết máu, ngươi gặp một nữ ma tu áo vá, mặt xanh vì trúng độc mãng xà. Bà ta ngồi dựa gốc cây, khẩn khoản gọi Bạch Ngưng Băng lại gần.'+(mem('q2_thuyhoa')||S.f.thuyhoaClue?' Ngươi nhớ bãi đất mới xới quanh chỗ bà ta ngồi.':''),
  choices:()=>[
    {t:'Giả vờ rút lui, để bà ta yên tâm ở lại, rồi quay lại',canon:1,check:['tamco',13],bonus:()=>mem('q2_thuyhoa')?5:0,
      ok:()=>{meet('thuyhoa');learn('q2_thuyhoa');fight2('thuyhoa',{after:'q2_thuyhoa',mod:.75});return 'Ngươi quay lại vào lúc nửa đêm, bước đúng những chỗ đất cứng. Bà ta chưa kịp kích nổ bãi bẫy.'},
      fail:()=>{meet('thuyhoa');S.hp-=25;fight2('thuyhoa',{after:'q2_thuyhoa'});return 'Một hạt đậu nổ dưới chân. Khí huyết −25.'}},
    {t:'Tha cho bà ta, đổi lấy tin tức',tag:'chinh',drift:6,eff:()=>{meet('thuyhoa');rel('thuyhoa',30);learn('q2_thuyhoa');S.f.thuyhoaSong=1;gainGu('tieuloi');return 'Trần Thúy Hoa kể chuyện mình: nông phụ rơi xuống hang, nhặt được truyền thừa trên thi thể, làng bị Sơn Báo diệt. Bà ta để lại cho ngươi một nắm Tiêu Lôi Thổ Đậu và chỉ đường tới Bạch Cốt Sơn.'}},
    {t:'Bảo Bạch Ngưng Băng tới gần như bà ta muốn',tag:'ma',eff:()=>{meet('thuyhoa');baiRel(-10);S.f.baiHurt=1;later('q2_hl_baihoi',2,2);fight('thuyhoa',{after:'q2_thuyhoa',mod:.8,solo:1});return 'Bãi bẫy nổ dưới chân nàng. Ngươi nhân lúc bà ta phân tâm lao vào.'}},
  ]},
q2_hl_baihoi:{title:'Vết bỏng',g:'冰',who:'bainu',
  text:()=>'Vết bỏng trên chân Bạch Ngưng Băng đã lên da non. Nàng biết ngươi cố ý.',
  choices:[{t:'Không giải thích',eff:()=>{S.f.baiHurt=0;return 'Nàng cũng không hỏi.'}}]},
q2_hl_ket:{canon:1,title:'Bóng núi trắng',hint:'Tới Bạch Cốt Sơn',g:'骨',
  text:()=>'Cuối sông, giữa đồng bằng mọc lên một ngọn núi trắng xóa. Lại gần mới thấy: đá núi toàn là xương. Bạch Cốt Sơn.',
  choices:[{t:'Đi về phía núi',eff:()=>{chapEnd('q2_bachcot');return 'Chương một kết thúc.'}}]},

// chuyện bên lề
q2_hl_guong:{title:'Mặt nước',g:'镜',who:'bainu',cond:()=>S.turn>=2,
  text:()=>'Bạch Ngưng Băng ngồi rất lâu bên mặt nước, nhìn gương mặt không phải của mình.',
  choices:[
    {t:'"Thân thể chỉ là công cụ. Dùng được là được."',tag:'ma',eff:()=>{baiRel(10);return 'Nàng quay lại nhìn ngươi. "Ngươi nói như ma đầu."'}},
    {t:'Để nàng một mình',eff:()=>{baiRel(3);return 'Sáng hôm sau nàng buộc tóc gọn gàng, không nhắc lại chuyện đó.'}},
  ]},
q2_hl_thuoc:{title:'Thuốc sắp cạn',g:'药',who:'bainu',cond:()=>S.turn>=4,
  text:()=>'Thuốc phàm trong Đâu Suất Hoa gần hết. Ngực bó chặt làm Bạch Ngưng Băng khó thở khi chạy, nàng định cắt bỏ cho gọn.',
  choices:[
    {t:'Bảo nàng quấn băng vải, đừng làm chuyện ngu',eff:()=>{baiRel(6);return 'Nàng bực bội nghe theo.'}},
    {t:'Mặc kệ',eff:()=>'Nàng quấn băng. Ngươi không nói gì.'},
  ]},
q2_hl_nhanto:{title:'Chuyện Nhân Tổ bên lửa',g:'人',cond:()=>S.turn>=5,
  text:()=>'Đêm bên đống lửa, ngươi kể chuyện Nhân Tổ: con trai Thái Nhật Dương Mãng là mắt trái, con gái Cổ Nguyệt Âm Hoang là mắt phải. Dương Mãng muốn bay, và chết vì bay.',
  choices:[
    {t:'"Muốn thứ gì thì phải trả giá."',eff:()=>{S.ngo++;return 'Ngộ tính +1.'}},
    {t:'Kể tiếp chuyện Thần Du cổ, con cổ chỉ bay khi người say',eff:()=>{S.f.thanDuTale=1;S.tamco++;return 'Bạch Ngưng Băng nghe tới ngủ gật. Ngươi thì nhớ rất rõ. Tâm cơ +1.'}},
  ]},

// sự kiện theo nơi chốn
q2r_hl_ca:{loc:'hl_song',title:'Bắt cá',g:'鱼',text:()=>'Nước cạn, cá quẫy đầy vũng.',
  choices:[{t:'Bắt cá ăn, đổi nguyên thạch ở thuyền buôn',eff:()=>{S.stones+=rand(6,12);S.hp=Math.min(maxHp(),S.hp+10);return 'Được bữa no và ít nguyên thạch.'}}]},
q2r_hl_xac:{loc:'hl_song',title:'Xác trôi sông',g:'尸',text:()=>'Một xác cổ sư áo sắt mắc vào rễ cây. Trên thắt lưng còn túi.',
  choices:[
    {t:'Lục túi',eff:()=>{S.stones+=rand(10,20);S.susp+=5;if(Math.random()<.35){const k=pick(WILD);gainGu(k,true);return `Được nguyên thạch và một con ${GU[k].n} còn sống. Áo sắt: người Thiết gia.`}return 'Được ít nguyên thạch. Áo sắt: người Thiết gia.'}},
    {t:'Đẩy xác trôi đi',eff:()=>'Không dính líu gì tới Thiết gia là tốt nhất.'},
  ]},
q2r_hl_thietgia:{loc:'hl_song',once:1,title:'Thuyền áo sắt',g:'铁',text:()=>'Một chiếc thuyền lớn xuôi dòng. Trên mũi thuyền là một công tử Thiết gia cùng thuộc hạ. Họ đang truy tàn dư ma đạo từ Thanh Mao Sơn.',
  choices:[
    {t:'Nấp trong lau sậy',check:['tamco',11],ok:()=>'Thuyền đi qua.',fail:()=>{S.susp+=15;return 'Một thuộc hạ liếc về phía lau sậy. Hắn nhớ mặt ngươi.'}},
    {t:'Lên thuyền xin quá giang, mạo danh con cháu gia tộc bị nạn',tag:'ma',check:['tamco',14],ok:()=>{S.stones+=20;return 'Công tử tin, còn cho 20 nguyên thạch lộ phí. Hắn nói sẽ tới Bạch Cốt Sơn.'},fail:()=>{fight2('thietgiadoi',{});return 'Hắn nhìn thấy vết máu Huyết Lô trên tay áo ngươi.'}},
  ]},
q2r_hl_nam:{loc:'hl_rung',title:'Nấm rừng',g:'菇',text:()=>'Một bãi nấm trắng dưới gốc cổ thụ.',
  choices:[{t:'Nấu canh cho cả hai',eff:()=>{baiRel(4);S.hp=Math.min(maxHp(),S.hp+15);return 'Bạch Ngưng Băng ăn hết bát. Khí huyết +15.'}}]},
q2r_hl_cohoang:{loc:'hl_rung',title:'Cổ hoang',g:'蛊',text:()=>'Có tiếng sột soạt trong bụi. Một con cổ hoang.',
  choices:[{t:'Bắt',check:['ngo',11],ok:()=>{const k=pick(WILD);gainGu(k,true);return `Bắt được ${GU[k].n}.`},fail:()=>'Nó chui vào kẽ đá.'}]},
q2r_hl_tro:{loc:'hl_rung',once:1,title:'Tro lửa',g:'火',text:()=>'Một đống tro lửa của một người, chừng nửa tháng. Gia tộc đi săn luôn theo nhóm năm người; người đi một mình thường là ma đạo.',
  choices:[{t:'Ghi nhớ, lần theo sau',eff:()=>{S.f.thuyhoaClue=1;S.tamco++;return 'Có kẻ ma đạo quanh đây. Tâm cơ +1.'}}]},
});

Object.assign(AFTER,{
  q2_toatien:()=>{S.stones+=6;log('Xác cá chất đầy bè. Bạch Ngưng Băng nhóm lửa.','good')},
  q2_casau:()=>{gainGu('boigiap');gainGu('ngacluc');learn('q2_casau');S.danh+=5;log('Trên người cá sấu vương có hai con cổ: Bối Giáp Cổ và Ngạc Lực Cổ.','big')},
  q2_dungnham:()=>{gainGu('tichhoi');log('Trong xác cá sấu dung nham còn Tích Hôi Cổ.','big')},
  q2_thuyhoa:()=>{gainGu('tieuloi');S.stones+=30;log('Trên người Trần Thúy Hoa có một túi Tiêu Lôi Thổ Đậu và ít nguyên thạch. Bà ta lấy truyền thừa từ một thi thể; giờ tới lượt ngươi.','big')},
});
