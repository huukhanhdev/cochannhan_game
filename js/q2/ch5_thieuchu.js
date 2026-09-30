// Quyển 2 · Chương 2.5: Thiếu chủ (canon VN 391–406)
// Độc quyền cổ vào truyền thừa, đưa Thương Tâm Từ lên thiếu chủ, thu người cho nàng, lên Tứ chuyển.

CHAPTERS.q2_thieuchu={n:'Thiếu chủ',title:'Quyển hai · Chương năm · Thiếu chủ',unit:'tháng',turns:6,bg:'bg_village',cap:4,
  intro:'Còn nửa năm trước khi Tam Vương truyền thừa mở. Trước khi đi, ngươi còn nợ Tâm Từ một lời hứa.',
  ask:'Tháng này làm gì?',shop:Q2_SHOP.thanh,
  canon:{1:'q2_tc_tin',2:'q2_tc_phe',3:'q2_tc_com',4:'q2_tc_vedh',5:'q2_tc_chutoan',6:'q2_tc_ket'},
  side:['q2_tc_trao','q2_tc_tuutrung','q2_tc_nhatphi','q2_tc_dochat'],
  spots:[
    {id:'ttpho',x:18,y:56,g:'街',n:'Dạo phố',d:'Tửu lâu, Phong Vũ lâu, chuyện trong thành.',loc:'tt_pho',evP:.8,quiet:'Phố xá đông đúc.'},
    {id:'dienvo',x:52,y:34,g:'武',n:'Diễn võ trường',d:'Leo hạng.',run:dvFight,show:()=>S.f.dvReg},
    {id:'tttamtu',x:34,y:72,g:'慈',n:'Phủ Thương Tâm Từ',d:'Bàn việc với Tâm Từ.',run:tamtuCity},
    {id:'baicanh',x:70,y:70,g:'冰',n:'Nam Thu Uyển',d:'Bạch Ngưng Băng.',run:baiLesson},
    {id:'tuluyen',x:84,y:52,g:'修',n:'Bế quan',d:'Dồn chân nguyên vào tu vi.'},
    {id:'nghi',x:10,y:34,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
    {id:'market',minor:1,x:40,y:88,g:'市',n:'Chợ',d:'Mua bán cổ'},
    {id:'gamble',minor:1,x:60,y:88,g:'石',n:'Phường đổ thạch',d:'Đổ thạch'},
    {id:'refine',minor:1,x:90,y:24,g:'炉',n:'Lò luyện',d:'Luyện cổ'},
  ]};

Object.assign(NPC,{
  traophong:{n:'Thương Trào Phong',d:'Thiếu chủ phe thứ ba, kiếp trước là đối thủ lớn nhất của Tâm Từ'},
  hungdai:{n:'Ba anh em họ Hùng',d:'Giữ nửa lệnh bài chữ "Cơm" của ông nội'},
  veduchinh:{n:'Vệ Đức Hinh',d:'Nữ nô, đang mang thai giọt máu duy nhất của chồng'},
  chutoan:{n:'Chu Toàn',d:'Chưởng quỹ giỏi nhất của Nhai Tí, từng là tộc trưởng Chu gia'},
});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{traophong:'潮',hungdai:'熊',veduchinh:'卫',chutoan:'周'});
Object.assign(GU,{
  ngukhuyen:{n:'Ngự Khuyển Cổ',r:1,food:0,fn:'không cần',t:'passive',p:30,d:'Nô đạo, hình ngọc thạch đầu chó, thu phục chó hoang cấp thấp. Chìa khóa vào Khuyển Vương truyền thừa.'},
  chihac:{n:'Chỉ Hạc Cổ',r:1,food:0,fn:'không cần',t:'passive',p:30,d:'Tín đạo, hạc giấy chỉ lối trong mê trận luyện cổ. Chìa khóa vào Tín Vương truyền thừa.'},
  baodan:{n:'Bạo Đản Cổ',r:1,food:0,fn:'không cần',dmg:35,cost:8,aoe:1,bleed:2,t:'attack',p:30,d:'Viêm đạo, quả trứng đỏ ném ra nổ thành biển lửa, thiêu cả chướng ngại. Chìa khóa vào Bạo Vương truyền thừa. Địch cháy 2 lượt.'},
  cuunhan:{n:'Cửu Nhãn Tửu Trùng',r:4,food:8,fn:'chín loại rượu',pow:0.5,t:'passive',cult:1.6,p:1400,d:'Đỉnh của dòng Tửu Trùng, chín mắt phát quang. Tinh luyện chân nguyên Tứ chuyển lên Tinh Kim. Tu luyện +160%, uy lực chiêu +50%.'},
  dochat:{n:'Độc Hạt Cổ',r:3,food:4,fn:'độc trùng',t:'attack',dmg:30,cost:14,bleed:4,p:380,d:'Bọ cạp bài tiết hạt thỉ đen kịch độc, ăn mòn kinh mạch. Địch trúng độc 4 lượt.'},
});

Object.assign(EV,{
q2_tc_tin:{canon:1,title:'Ba cột sáng',hint:'Cổ vào truyền thừa',g:'王',
  text:()=>'Tin lan ra: vào cột vàng của Khuyển Vương cần luyện hóa Ngự Khuyển cổ; cột lam của Tín Vương cần Chỉ Hạc cổ; cột đỏ của Bạo Vương cần Bạo Đản cổ. Ba thứ cổ Nhất chuyển rẻ mạt. Ngươi biết trước từ kiếp trước.',
  choices:()=>[
    {t:'Mua gần hết hàng trong thành trước khi giá lên, giữ lại mỗi loại một con',canon:1,req:()=>S.stones>=60,reqT:'Cần 60 nguyên thạch',eff:()=>{S.stones-=60;gainGu('ngukhuyen',true);gainGu('chihac',true);gainGu('baodan',true);S.f.docQuyen=1;later('q2_tc_banlai',1,2);return 'Một tháng sau, giá mỗi con tăng gấp trăm lần.'}},
    {t:'Chỉ mua đủ dùng',req:()=>S.stones>=15,reqT:'Cần 15 nguyên thạch',eff:()=>{S.stones-=15;gainGu('ngukhuyen',true);gainGu('chihac',true);gainGu('baodan',true);return 'Mỗi loại một con, đủ vào ba cột sáng.'}},
    {t:'Nhờ Tâm Từ ứng trước tiền',req:()=>S.met.tamtu,reqT:'Cần quen Tâm Từ',eff:()=>{rel('tamtu',-5);gainGu('ngukhuyen',true);gainGu('chihac',true);gainGu('baodan',true);return 'Nàng không hỏi ngươi cần làm gì.'}},
  ]},
q2_tc_banlai:{title:'Giá lên trời',g:'商',
  text:()=>'Cả Nam Cương đổ về Tam Xoa. Ngự Khuyển, Chỉ Hạc, Bạo Đản cổ giờ đắt như vàng. Kho của ngươi còn đầy.',
  choices:[{t:'Bán ra',eff:()=>{S.stones+=500;S.danh+=5;return '+500 nguyên thạch.'}},{t:'Bán qua cửa hàng của Tâm Từ, chia lãi cho nàng',eff:()=>{S.stones+=350;rel('tamtu',20);return '+350 nguyên thạch. Tâm Từ nhận được tiếng thơm "biết đón gió".'}}]},
q2_tc_phe:{canon:1,title:'Ba phe thiếu chủ',hint:'Chọn phe cho Tâm Từ',g:'派',who:'tamtu',
  text:()=>'Yến Phi phong Tâm Từ làm thiếu chủ tập sự. Thiếu chủ chia ba phe: phe một và phe hai đang đấu nhau; phe ba của Thương Trào Phong đứng ngoài. Kiếp trước, Trào Phong là đối thủ lớn nhất của Tâm Từ.',
  choices:()=>[
    {t:'Để nàng tự chọn',canon:1,eff:()=>{meet('traophong');rel('tamtu',10);S.f.pheTrao=1;S.tamco++;return 'Tâm Từ chọn phe Trào Phong: theo phe một hay phe hai đều đắc tội với phe kia. Ngươi gật gù. Nàng đã biết nghĩ. Tâm cơ +1.'}},
    {t:'Bảo nàng theo phe mạnh nhất',eff:()=>{rel('tamtu',-5);S.f.pheManh=1;return 'Nàng nghe theo, nhưng bị cuốn vào cuộc chiến của người khác.'}},
  ]},
q2_tc_com:{canon:1,title:'Lệnh bài chữ Cơm',hint:'Ba anh em họ Hùng',g:'饭',who:'hungdai',
  text:()=>'Ngày lễ trên Thượng Thiên Nhai, ba anh em họ Hùng bán hàng rong. Ngươi biết: ba trăm năm trước ông nội họ để lại nửa lệnh bài sắt chữ "Cơm", dặn con cháu theo người nào ghép được nửa kia.',
  choices:()=>[
    {t:'Tát thằng em, ép rồi giả vờ không ép, cuối cùng ném nửa lệnh bài còn lại ra',tag:'ma',canon:1,eff:()=>{meet('hungdai');rel('tamtu',15);S.f.hungDai=1;return '"Đều là ăn cả. Chính đạo ăn mà còn khóc nước mắt cá sấu." Hai nửa lệnh bài ghép lại, bốc lên hư ảnh lửa. Ba anh em quỳ xuống nhận Tâm Từ làm chủ hai mươi năm.'}},
    {t:'Bỏ tiền mua lòng họ',req:()=>S.stones>=80,reqT:'Cần 80 nguyên thạch',eff:()=>{S.stones-=80;meet('hungdai');S.f.hungDai=1;return 'Họ theo Tâm Từ, nhưng theo vì tiền.'}},
  ]},
q2_tc_vedh:{canon:1,title:'Nữ vệ quân',hint:'Vệ Đức Hinh',g:'卫',who:'veduchinh',
  text:()=>'Ở chợ nô lệ, Vệ Đức Hinh cầm đầu một nhóm nữ nô. Bà đang mang thai, giọt máu duy nhất của người chồng đã chết.',
  choices:()=>[
    {t:'Mua cả nhóm, nói riêng với bà ở đình hồ: ta chỉ cần tài năng',canon:1,req:()=>S.stones>=50,reqT:'Cần 50 nguyên thạch',eff:()=>{S.stones-=50;meet('veduchinh');rel('veduchinh',30);S.f.veQuan=1;return 'Tâm Từ có một đội nữ vệ quân. Vệ Đức Hinh không hỏi vì sao ngươi biết chuyện đứa con.'}},
    {t:'Bỏ qua',eff:()=>'Ngươi đi tiếp.'},
  ]},
q2_tc_chutoan:{canon:1,title:'Chu Toàn',hint:'Quân thần tương ngộ',g:'周',who:'chutoan',
  text:()=>'Chu Toàn, chưởng quỹ giỏi nhất của Nhai Tí, hơn trăm tuổi, từng là tộc trưởng Chu gia Tứ chuyển. Nhất Phàm tung tin Chu Toàn sắp theo phe khác. Ngươi đạp cửa cửa hàng, Bạch Ngưng Băng ném năm trăm thạch "tiền phạt ứng trước" vào mặt đội trưởng thành vệ.',
  choices:()=>[
    {t:'Đánh Chu Toàn trước mặt đám đông, để Tâm Từ ra xin tha',tag:'ma',canon:1,eff:()=>{meet('chutoan');rel('tamtu',20);rel('chutoan',20);S.f.chuToan=1;S.danh+=15;return 'Tâm Từ xin tha, kể (bịa) chuyện Chu Toàn gánh chí phục dựng Chu gia, lời trăng trối của vợ lão. Tin đồn của Nhất Phàm hóa thành màn "quân thần tương ngộ". Chu Toàn quỳ trước Tâm Từ.'}},
    {t:'Mời Chu Toàn một chén, nói chuyện Chu gia',check:['tamco',16],ok:()=>{meet('chutoan');rel('chutoan',30);S.f.chuToan=1;return 'Lão uống cạn chén, nhìn ngươi rất lâu. "Được."'},fail:()=>{meet('chutoan');rel('chutoan',-10);return 'Lão cười nhạt: "Tiểu bối miệng còn hôi sữa."'}},
  ]},
q2_tc_ket:{canon:1,title:'Tứ chuyển',hint:'Lên đường Tam Xoa',g:'四',who:'bainu',
  text:()=>'Tâm Từ đứng vững ở ghế thiếu chủ. Kinh doanh tình báo diễn võ khai trương, bảy ngày từ ba mươi vạn lên bốn mươi lăm vạn. Đêm trước khi đi, Bạch Ngưng Băng bơm chân nguyên Hoàng Kim vào khiếu ngươi theo Thề Độc.'+(S.chuyen>=3&&S.giai>=3?' Bích khiếu của ngươi đã căng tới cực hạn.':''),
  choices:()=>[
    {t:'Phá bích khiếu, lên Tứ chuyển',canon:1,eff:()=>{if(S.chuyen===3&&S.giai===3){S.chuyen=4;S.giai=0;S.prog=0;S.hp=maxHp();S.ess=maxEss();log('Màng không khiếu hóa ánh bạc. Chân nguyên Đạm Kim. Tứ chuyển: nhiều tộc trưởng cả đời chỉ tới đây.','big')}else{S.prog+=300;levelUp();log('Chưa đủ để phá bích khiếu, nhưng tu vi tăng vọt.','good')}baiRel(5);chapEnd('q2_tamxoa');return 'Chương năm kết thúc.'}},
  ]},

q2_tc_trao:{title:'Cấm khu',g:'潮',who:'traophong',cond:()=>S.met.traophong,
  text:()=>'Trào Phong can: diễn võ trường là cấm khu. Từng có thiếu chủ mở sòng bạc ở đó, hai ngày lãi năm mươi vạn, ngày thứ ba bị niêm phong, cách chức, lưu đày.',
  choices:[{t:'"Không mở sòng bạc. Bán tình báo."',eff:()=>{rel('traophong',10);S.stones+=40;return 'Trào Phong nhíu mày rồi gật đầu. +40 nguyên thạch từ mối làm ăn đầu tiên.'}}]},
q2_tc_tuutrung:{title:'Chuỗi Tửu trùng',g:'酒',cond:()=>hasGu('tuutrung')||hasGu('tuvi'),
  text:()=>'Tửu Trùng thêm rượu tứ vị thành Tứ Vị; gom đủ chín loại rượu thì luyện được Cửu Nhãn Tửu Trùng, tinh luyện chân nguyên lên một tiểu cảnh.',
  choices:[{t:'Gom rượu, luyện Cửu Nhãn (200 thạch)',req:()=>S.stones>=200,reqT:'Cần 200 nguyên thạch',check:['ngo',14],ok:()=>{S.stones-=200;loseGu(hasGu('tuvi')?'tuvi':'tuutrung');gainGu('cuunhan');return 'Cửu Nhãn Tửu Trùng mở chín con mắt.'},fail:()=>{S.stones-=200;return 'Mẻ rượu hỏng.'}},{t:'Để sau',eff:()=>'Ngươi cất Tửu Trùng đi.'}]},
q2_tc_nhatphi:{title:'Thương Nhất Phi',g:'飞',cond:()=>S.turn>=2,
  text:()=>'Thương Nhất Phi, mũi ưng, mắt nhỏ sắc, mẹ là biểu muội Yến Phi, nhận hết người của Nhai Tí "giữ hộ". Hắn chặn đường cửa hàng của Tâm Từ.',
  choices:[{t:'Đập phá cửa hàng của hắn',tag:'ma',eff:()=>{S.susp+=10;S.stones+=50;return 'Tiền bồi thường chảy vào túi ngươi. Hiềm nghi +10.'}},{t:'Để Tâm Từ lo',eff:()=>{rel('tamtu',5);return 'Nàng lo được.'}}]},
q2_tc_dochat:{title:'Lồng bọ cạp',g:'蝎',cond:()=>S.turn>=3,
  text:()=>'Một gã bán hàng lừa người mua. Trong lồng có Độc Hạt cổ Tam chuyển, gã tưởng là bọ cạp thường.',
  choices:[{t:'Đạp gã bất tỉnh, ném 50 thạch "khỏi thối", mua cả lồng',tag:'ma',req:()=>S.stones>=50,reqT:'Cần 50',eff:()=>{S.stones-=50;gainGu('dochat');return 'Phạt 49 thạch vì đánh người. Ngươi ném 50.'}},{t:'Đi qua',eff:()=>'Ngươi không để ý.'}]},
});
