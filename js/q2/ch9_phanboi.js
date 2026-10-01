// Quyển 2 · Chương 2.9: Phản bội, Xuân Thu Thiền lần ba, Định Tiên Du (canon VN 486–517)
// Lần đầu vào điện luyện cổ, người chơi gần như chắc chắn bị Bạch Ngưng Băng bán: Định Tinh cổ, Vô Cực Sưu Tỏa.
// Thiền đã hồi phục: tự bạo, quay về đầu chương, học ký ức 'q2_phanboi' và mở các lựa chọn mới.
// Thiền chưa hồi phục: bị bắt về Trấn Ma Tháp (kết thua có chủ đích).

Object.assign(MEM,{
  q2_phanboi:{n:'Điện luyện cổ',d:'Bạch Ngưng Băng thông đồng với Thiết gia. Định Tinh cổ nằm ở cẳng tay trái. Phúc địa không giữ nổi: dù không bị phản bội, liên quân bên ngoài cũng sẽ tràn vào.'},
});
Object.assign(GU,{
  dinhtiendu:{n:'Định Tiên Du',r:6,food:0,fn:'tiên nguyên',t:'fate',p:0,d:'Một trong tứ đại di động tiên cổ. Trong ba hơi thở đưa người tới bất kỳ nơi nào trên Ngũ Vực, chỉ cần nhớ rõ cảnh ấy.'},
});
Object.assign(EN,{
  lienquan:{n:'Liên quân chính ma',hp:2600,atk:[60,80],st:[0,0],bl:0,i:'Thiết Nhược Nam dẫn đầu, Tứ lão Thiết gia, Tiêu Mang, các gia tộc chính đạo, cả ma đạo. Cả điện luyện cổ chật kín người muốn giết ngươi.'},
  bainuboss:{n:'Bạch Ngưng Băng',hp:1300,atk:[44,60],st:[0,0],bl:2,i:'Băng Tinh bổn mệnh, Băng Bạo, đao băng. Nàng đã học từ ngươi cách đánh không phí một phần chân nguyên.'},
});
Object.assign(EAI,{lienquan:{def:8,sk:'suppress',boss:1},bainuboss:{def:3,sk:'freeze',boss:1}});
Object.assign(ART,{lienquan:{g:'众',sc:'blood',c:'#aeb8c2'},bainuboss:{g:'冰',sc:'snow',c:'#bfe3ff'}});
Object.assign(PORTRAIT,{lienquan:'p_baitruonglao',bainuboss:'p_bai'});
Object.assign(NPC,{tieuhotien:{n:'Tiểu Hồ Tiên',d:'Địa linh Hồ Tiên phúc địa, bé gái tai và đuôi hồ ly tuyết'}});
if(typeof NPC_META!=='undefined')Object.assign(NPC_META,{tieuhotien:'狐'});

CHAPTERS.q2_phanboi={n:'Điện luyện cổ',title:'Quyển hai · Chương chín · Điện luyện cổ',unit:'ngày',turns:3,bg:'bg_blood',cap:4,
  intro:'Đại điện trung tâm phúc địa. Vạc luyện cổ sôi sùng sục. Ngoài vách, thiên kiếp và liên quân.',
  ask:'Hôm nay làm gì?',
  canon:{1:'q2_pb_vay',2:'q2_pb_luyen',3:'q2_pb_sup'},
  spots:[
    {id:'baicanh',x:40,y:70,g:'冰',n:'Bạch Ngưng Băng',d:'Nàng đứng ở trận nhãn.',run:()=>{log('Bạch Ngưng Băng không nhìn ngươi. Nàng nhìn cánh cửa điện.','sys')}},
    {id:'tuluyen',x:80,y:56,g:'修',n:'Điều tức',d:'Dồn chân nguyên.'},
    {id:'nghi',x:14,y:44,g:'息',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
  ]};

// Thiền lần ba: tự bạo, quay về đầu chương, giữ ký ức
function thienLan3(){
  learn('q2_phanboi');
  const raw=META.chapSave&&META.chapSave.q2_phanboi;if(!raw)return 'Quang âm không có chỗ để quay về.';
  const lg=S.log,oldMem=S.mem,oldCb=S.combos,oldStory=S.story;
  S=JSON.parse(raw);
  S.log=lg;S.snaps=[];S.mem=Object.assign({},S.mem,oldMem);S.combos=Object.assign({},S.combos,oldCb);
  if(oldStory){
    S.story=oldStory;
    if(Array.isArray(S.story.pending)) S.story.pending=[];
  }
  if(typeof storySetOutcome==='function') storySetOutcome('cicada_rewind3','rewind3_executed',{choiceText:'Tự bạo không khiếu kích hoạt Xuân Thu Thiền lần 3 nghịch chuyển quang âm',isLech:false,note:'Lần thứ 3 chuyển sinh, mang theo ký ức tử cục phản kích lật bàn.'});
  S.cicada={charge:0};S.rewinds=(S.rewinds||0)+1;S.f.thien3=1;
  if(window.SFX)SFX.cicada();
  log('Ngươi tự bạo không khiếu và toàn thân, dùng cả sinh mệnh lẫn linh hồn đẩy Xuân Thu Thiền lao vào Quang Âm Chi Hà.','big');
  log('Ngươi bừng tỉnh trong điện luyện cổ. Bạch Ngưng Băng vẫn đứng chờ hiệu lệnh, chưa kịp phản bội.','big');
  cicadaSnap();
  return 'Lần thứ ba.';
}
// Điểm chuẩn bị cho Định Tiên Du
function dinhTienBonus(){return ((S.f.ruou||0)>=4?5:(S.f.ruou||0))+(S.f.phongNo?5:0)+(S.f.tieuMangNho?3:0)+(S.f.tienNguyen?2:0)+(S.f.thanDuTale?2:0)+(S.f.cuucuu?2:0)}

Object.assign(EV,{
q2_pb_vay:{canon:1,title:'Quần hùng vây phúc địa',hint:'Liên quân ngoài vách',g:'围',
  text:()=>'Các cự đầu Ngũ chuyển mất tích làm bên ngoài tin có ma đầu tác quái. Tiêu Mang cùng các gia tộc chính đạo dùng sát chiêu quang đạo oanh vào khe nứt không gian. Địa linh Bá Quy mỗi lúc một yếu, thân đá vỡ vụn từng mảng.'+(S.f.thien3?' Ngươi đã thấy tất cả những điều này một lần rồi.':''),
  choices:[{t:'Chuẩn bị',eff:()=>'Còn một ngày.'},{t:'Kiểm tra tay trái',req:()=>mem('q2_phanboi'),reqT:'Chưa có lý do',eff:()=>{S.f.thayDinhTinh=1;return 'Dưới da cẳng tay trái có một điểm sáng nhỏ như hạt gạo. Định Tinh cổ. Nàng cấy nó vào trong một lần truyền chân nguyên.'}}]},
q2_pb_luyen:{canon:1,title:'Luyện tiên cổ',hint:'Điện luyện cổ',g:'鼎',who:'bainu',
  text:()=>'Phong Thiên Ngữ đứng bên vạc, Địa linh dốc tiên nguyên, hàng triệu nguyên thạch hóa bột, tinh huyết của các cự đầu hòa quyện. Bạch Ngưng Băng đứng ở trận nhãn, truyền chân nguyên tuyết ngân giữ nhiệt độ.'+(mem('q2_phanboi')?' Ngươi nhớ khoảnh khắc nàng ngừng tay.':''),
  choices:()=>[
    {t:'Luyện Đệ Nhị Không Khiếu cổ',canon:1,eff:()=>{S.evq.push('q2_pb_phanboi');return 'Phôi thai tiên cổ dần thành hình.'}},
    ...(mem('q2_phanboi')?[
      {t:'Bỏ Đệ Nhị Không Khiếu, chuyển sang luyện Định Tiên Du',canon:1,mem:'q2_phanboi',eff:()=>{S.evq.push('q2_pb_dinhtien');return 'Phúc địa không giữ nổi. Thứ ngươi cần không phải một không khiếu thứ hai, mà là một con đường ra.'}},
      {t:'Cắt Định Tinh cổ khỏi tay trái rồi luyện tiếp',mem:'q2_phanboi',drift:10,eff:()=>{S.hp=Math.max(1,S.hp-40);S.evq.push('q2_pb_catdinh');return 'Máu chảy. Khí huyết −40. Bạch Ngưng Băng thấy.'}},
      {t:'Giết Bạch Ngưng Băng trước',tag:'ma',mem:'q2_phanboi',drift:15,eff:()=>{fight('bainuboss',{after:'q2_pb_gietbai',flee:false,spare:.15,spareAfter:'q2_pb_bailui',spareT:'Nàng lùi ra cửa điện, cười lạnh. Liên quân tràn vào.'});return 'Nàng không ngạc nhiên.'}},
    ]:[]),
  ]},
q2_pb_phanboi:{title:'Phản bội',g:'叛',who:'bainu',sc:'snow',
  text:()=>'Đúng lúc phôi thai tiên cổ sắp thành, Bạch Ngưng Băng ngừng truyền chân nguyên, lùi lại, cười lạnh. Định Tinh cổ trên tay trái ngươi sáng rực. Từ ngoài khe nứt hư không, Tứ lão Thiết gia phát động Vô Cực Sưu Tỏa: xích sắt khóa tứ chi, đâm xuyên không khiếu. Vách phúc địa nổ tung. Thiết Nhược Nam dẫn liên quân tràn vào, kể từng tội: Thanh Mao Sơn, Thiết Huyết Lãnh, Thiết Bá Tu, Thiết Mộc, Thiết Đao Khổ. Phôi thai Đệ Nhị Không Khiếu sắp nổ vì thiếu chân nguyên.',
  choices:[
    {t:'Tự bạo, đẩy Xuân Thu Thiền vào Quang Âm Chi Hà',req:()=>cicadaReady(),reqT:'Xuân Thu Thiền chưa hồi phục',eff:()=>{
      if(typeof storySetOutcome==='function') storySetOutcome('bai_betrayal','star_pinned_trapped',{choiceText:'Bạch Ngưng Băng kích hoạt Định Tinh Cổ liên thủ Thiết gia vây hãm',isLech:false,note:'Rơi vào tử cục tuyệt cảnh của kiếp này, phôi thai tiên cổ rạn nứt.'});
      return thienLan3();
    }},
    {t:'Chịu trói',eff:()=>{
      if(typeof storySetOutcome==='function') storySetOutcome('bai_betrayal','star_pinned_trapped',{choiceText:'Bạch Ngưng Băng kích hoạt Định Tinh Cổ liên thủ Thiết gia vây hãm',isLech:false,note:'Rơi vào tử cục tuyệt cảnh của kiếp này, phôi thai tiên cổ rạn nứt.'});
      learn('q2_phanboi');q2Ending('q2_tranmathap');return 'Nhược Nam tuyên bố: đưa ngươi về Trấn Ma Tháp, chịu muôn kiếp tra tấn.';
    }},
  ]},
q2_pb_catdinh:{title:'Không có xích',g:'锁',who:'bainu',
  text:()=>'Vô Cực Sưu Tỏa bắn ra từ hư không nhưng không có tọa độ để bám. Xích sắt quất trượt. Bạch Ngưng Băng vẫn ngừng tay: phôi thai lung lay. Vách phúc địa nổ tung, liên quân tràn vào.',
  choices:[{t:'Mở đường máu',eff:()=>{fight('lienquan',{after:'q2_pb_thoat',flee:false,spare:.3,spareAfter:'q2_pb_thoat',spareT:hasGu('cotduc')?'Ngươi bung Cốt Dực, bay qua khe nứt đúng lúc phúc địa sụp.':'Phôi thai nổ tung, hất văng tất cả. Ngươi lăn ra khỏi khe nứt.'});return 'Phôi thai Đệ Nhị Không Khiếu phía sau lưng bắt đầu rạn.'}}]},
q2_pb_dinhtien:{title:'Định Tiên Du',g:'蝶',
  text:()=>`Chuyện Nhân Tổ: Thần Du cổ, thai nghén trong người đã uống đủ bốn loại rượu cực phẩm, là tiền thân của Định Tiên Du, tiên cổ truyền tống. Cần: Thần Du cổ${(S.f.ruou||0)>=4?' (ngươi đã uống đủ bốn loại rượu)':` (rượu cực phẩm ${S.f.ruou||0}/4)`}, lông người lông, lá trà bích ngọc, tiên nguyên cuối của Bá Quy, một đại sư luyện đạo${S.f.phongNo?' (Phong Thiên Ngữ)':' (không có)'}, và một ngọn lửa ánh sáng đủ mạnh${S.f.tieuMangNho?' (ánh sáng của Tiêu Mang)':''}.`,
  choices:()=>[
    {t:'Chờ ánh sáng của Tiêu Mang, ép Phong Thiên Ngữ hiến tế vào lửa, luyện',canon:1,check:['ngo',24],bonus:dinhTienBonus,ok:()=>{S.evq.push('q2_pb_tho');return 'Tiêu Mang bên ngoài bắn thủng trần điện, một luồng cực quang rọi xuống. Ngươi mượn nó làm lửa. Địa linh dốc giọt tiên nguyên cuối. Phong Thiên Ngữ bước vào lửa.'},fail:()=>{S.evq.push('q2_pb_sup');return 'Lửa không đủ. Phôi thai tan thành tro.'}},
    {t:'Bỏ, chạy trước khi phúc địa sụp',eff:()=>{S.evq.push('q2_pb_sup');return 'Không có đường ra nào khác.'}},
  ]},
q2_pb_tho:{title:'Minh triều thành tiên',g:'诗',
  text:()=>'Giữa kim quang, ngươi cất giọng:\n"Thanh Mao sơn thượng ngạo phong tuyết,\nHoàng Long giang bạn độc bộ hành.\nTam Xoa đỉnh thượng mưu thâm toán,\nBá Quy điện tiền đoạt thiên công.\nKim triêu tạm thả giương cánh khứ,\nMinh triều thành tiên quất Phượng Hoàng!"\nMột con bướm ngọc bích bay ra, đậu trên tay ngươi: Định Tiên Du. Bạch Ngưng Băng, Thiết Nhược Nam và quần hùng vừa ùa vào đứng sững.',
  choices:()=>[
    {t:'Nghĩ tới đỉnh Đãng Hồn Sơn, nơi có một bé gái tai hồ ly',canon:1,req:()=>S.f.dangHonNho,reqT:'Chưa từng "thấy" nơi này',eff:()=>{
      gainGu('dinhtiendu');
      if(typeof storySetOutcome==='function') storySetOutcome('dinhtiendu_refined','immortal_gu_born',{choiceText:'Mượn thần quang Tiêu Mang và sinh mệnh Phong Thiên Ngữ luyện thành Tiên Cổ Lục Chuyển Định Tiên Du',isLech:false,note:'Tiên cổ cái thế xuất thế, chấn động thiên địa.'});
      S.evq.push('q2_pb_hotien');return 'Thân ảnh ngươi tan vào hư không ngay trước mắt họ. Sau lưng, Tam Vương phúc địa nổ tung, sụp đổ, chôn vùi mọi dấu tích.';
    }},
    {t:'Nghĩ tới Thương gia thành',eff:()=>{gainGu('dinhtiendu');q2Ending('q2_dinhtien_thanh');return 'Ngươi hiện ra giữa phố Thương gia thành.'}},
    {t:'Nghĩ tới Thanh Mao Sơn',eff:()=>{gainGu('dinhtiendu');q2Ending('q2_dinhtien_thanhmao');return 'Chỉ còn băng và tro.'}},
  ]},
q2_pb_hotien:{title:'Đỉnh Đãng Hồn Sơn',g:'狐',who:'kimhoang',sc:'snow',
  text:()=>'Trung Châu. Phượng Kim Hoàng nằm kiệt sức cách Địa linh Tiểu Hồ Tiên chỉ một bước chân. Hư không dao động, một thiếu niên Nam Cương đáp xuống.',
  choices:[
    {t:'Tát văng Phượng Kim Hoàng, đặt tay lên đầu Địa linh',tag:'ma',canon:1,eff:()=>{
      meet('tieuhotien');meet('kimhoang');rel('kimhoang',-100);
      if(typeof storySetOutcome==='function') storySetOutcome('hotien_claimed','hotien_master',{choiceText:'Định Tiên Du truyền tống tới đỉnh Đãng Hồn Sơn, đoạt Hồ Tiên Phúc Địa',isLech:false,note:'Tát văng Phượng Kim Hoàng, tiếp quản 78.5 quả Thanh Đề Tiên Nguyên, kết thúc hoàn mỹ Quyển 2!'});
      q2Ending('q2_hotien');return 'Tiểu Hồ Tiên vui mừng nhận chủ. Bên ngoài Thiên Thê Sơn, các Cổ Tiên mười đại phái và Phương Chính chết lặng.';
    }},
    {t:'Bước qua nàng, chạm vào Địa linh',eff:()=>{meet('tieuhotien');meet('kimhoang');q2Ending('q2_hotien');return 'Tiểu Hồ Tiên nhận chủ.'}},
  ]},
q2_pb_sup:{canon:1,title:'Phúc địa sụp đổ',hint:'Phúc địa sụp',g:'崩',cond:()=>!S.over,
  text:()=>'Vách phúc địa vỡ toang. Thiên kiếp đổ vào. Liên quân tràn qua khe nứt. Chỉ còn một con đường: xuyên qua họ.',
  choices:[{t:'Mở đường máu',eff:()=>{fight('lienquan',{after:'q2_pb_thoat',flee:false,spare:.3,spareAfter:'q2_pb_thoat',spareT:hasGu('cotduc')?'Ngươi bung Cốt Dực, bay qua khe nứt đúng lúc phúc địa sụp.':'Một mảng vách đổ xuống giữa ngươi và liên quân.'});return 'Máu và ánh sáng.'}}]},
});

Object.assign(AFTER,{
  q2_pb_gietbai:()=>{S.f.gietBai=1;log('Bạch Ngưng Băng ngã xuống tuyết của chính nàng. Không còn Định Tinh cổ nào sáng lên. Liên quân vẫn tràn vào.','big');S.evq.push('q2_pb_sup')},
  q2_pb_bailui:()=>{S.evq.push('q2_pb_sup')},
  q2_pb_thoat:()=>{q2Ending(S.f.gietBai?'q2_doc':'q2_thoat')},
});
Object.assign(ENDINGS,{
  q2_hotien:{t:'Chủ nhân Hồ Tiên phúc địa',d:'Nam Cương mất dấu Tiểu Thú Vương. Ở Trung Châu, một thiếu niên lạ mặt đoạt truyền thừa Hồ Tiên ngay trước mũi mười đại phái, tiếp quản bảy mươi tám quả rưỡi Thanh Đề Tiên Nguyên. Kết Quyển hai. Còn tiếp: Quyển ba, Trung Châu.'},
  q2_tranmathap:{t:'Trấn Ma Tháp',d:'Xuân Thu Thiền chưa hồi phục. Ngươi bị Vô Cực Sưu Tỏa khóa chặt, giải về Trấn Ma Tháp của Thiết gia. Lần sau, hãy để dành Thiền cho khoảnh khắc này.'},
  q2_thoat:{t:'Kẻ sống sót của Tam Xoa',d:'Phúc địa Tam Vương sụp đổ. Ngươi thoát ra, tay trắng, mang theo một thù mới: Bạch Ngưng Băng. Nam Cương truy nã Tiểu Thú Vương.'},
  q2_doc:{t:'Một mình',d:'Ngươi giết Bạch Ngưng Băng trước khi nàng kịp phản bội, rồi xé đường máu ra khỏi phúc địa đang sụp. Không ai còn đứng cạnh ngươi.'},
  q2_dinhtien_thanh:{t:'Định Tiên Du · Thương gia thành',d:'Ngươi có tiên cổ truyền tống, nhưng chọn quay về nơi quen. Thương gia thành đón Tiểu Thú Vương như một bóng ma. Hồ Tiên phúc địa rơi vào tay Phượng Kim Hoàng.'},
  q2_dinhtien_thanhmao:{t:'Định Tiên Du · Thanh Mao Sơn',d:'Ngươi đứng giữa băng và tro nơi mọi chuyện bắt đầu. Định Tiên Du trên tay, cả thiên hạ trước mặt.'},
});
