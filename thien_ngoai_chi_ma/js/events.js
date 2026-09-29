// Kịch bản sự kiện: Thiên Ngoại Chi Ma - Cổ Giới Dị Hồn
const CANON={
  1:'tn_khaikhieu',
  3:'tn_phuongnguyen_gate',
  5:'tn_hoatuu_secret',
  8:'tn_thuongdoi_jks',
  11:'tn_dieutra',
  15:'tn_bai_encounter',
  18:'tn_langtrieu_start',
  21:'tn_lang_king',
  24:'tn_huyetdong',
  27:'tn_final_escape'
};
const FINAL_TURN=27;

const EV={
/* ================= MỐC CỐT TRUYỆN CHÍNH ================= */
tn_khaikhieu:{canon:1,title:'Lễ Khai Khiếu Thanh Mao Sơn',hint:'Lễ khai khiếu',
  text:()=>`Đêm rằm tháng giêng, dưới dòng sông ngầm từ đường, đàn Hy Vọng Cổ bay lượn như đom đóm. Gia lão xướng danh: "Cổ Nguyệt Phương Chính, Giáp đẳng!" Tiếng hò reo vang dội. Kế đó: "Cổ Nguyệt Phương Nguyên, Bính đẳng bốn mươi tư phần." Phương Nguyên chỉ lạnh lùng bước ra. Giờ tới lượt ngươi — ${S.name}, linh hồn xuyên không từ dị giới, bước vào biển hoa.`,
  choices:()=>[
    {t:'Vận chuyển ý chí dị giới, cưỡng ép Hy Vọng Cổ khai khiếu',eff:()=>{
      const p = S.perk === 'science' ? 15 : S.perk === 'soul' ? 20 : 10;
      S.tuchat = clamp(Math.round(55 + Math.random()*25 + p), 50, 92);
      S.ess = Math.round(maxEss() * 0.5);
      return `Không khiếu bùng sáng rực rỡ! Gia lão sững sờ: "${S.name}, ${talentName(S.tuchat)}!" Ánh mắt Phương Nguyên khẽ liếc qua ngươi.`;
    }},
    {t:'Bình thản tiếp nhận, giấu bớt hào quang',eff:()=>{
      S.tuchat = 62; // Ất đẳng vừa phải
      S.tamco += 2;
      return 'Không khiếu mở ra: Ất đẳng (62%). Đủ để không bị xem thường, cũng không bị gia tộc lôi kéo quá sớm. Tâm cơ +2.';
    }},
  ],
  post:()=>{gainGu(ORIGINS[S.origin].initGu, true);log(`Học đường phát cho ngươi một con ${GU[ORIGINS[S.origin].initGu].n}. Ngươi lập tức luyện hóa thành công.`,'good')}},

tn_phuongnguyen_gate:{canon:1,title:'Phương Nguyên Chặn Cổng',hint:'Phương Nguyên chặn cổng',
  text:()=>'Tan học, trước cổng học đường, một thiếu niên áo xám khoanh tay đứng chắn đường. Là Phương Nguyên. Hắn vừa đánh ngã ba học trò, đưa tay ra trước mặt ngươi: "Năm viên nguyên thạch. Đưa ra thì được qua."',
  choices:()=>[
    ...(S.perk==='spoilers'?[{
      t:'Nói khẽ: "Năm trăm năm ma đầu uy chấn giang hồ, giờ lại đi cướp tiền của học trò nhỏ?"',tag:'ma',
      eff:()=>{
        meet('phuongnguyen');
        S.suspPN = (S.suspPN||0) + 40;
        rel('phuongnguyen', 15);
        S.danh += 10;
        return 'Phương Nguyên đồng tử co rút mãnh liệt! Hắn nhìn chằm chằm vào ngươi trong ba nhịp thở, rồi chậm rãi thu tay: "Thú vị... Ngươi rốt cuộc là ai?" Hắn cho ngươi đi qua mà không lấy một viên thạch. (Hiềm nghi Phương Nguyên +40)';
      }
    }]:[]),
    {t:'Rút cổ trùng, quyết đấu xem ai mạnh hơn',eff:()=>{
      meet('phuongnguyen');
      fight('hoctro',{scale:1.2,after:'pn_duel'});
      return 'Ngươi không muốn cúi đầu, lập tức kích hoạt cổ trùng nghênh chiến!';
    }},
    {t:'Nộp 5 nguyên thạch cho êm chuyện',req:()=>S.stones>=5,reqT:'Cần 5 nguyên thạch',eff:()=>{
      meet('phuongnguyen');
      S.stones -= 5;
      rel('phuongnguyen', 5);
      return 'Ngươi ném túi thạch sang. Phương Nguyên đón lấy, không nói một lời, nhường đường. Cúi đầu trước kẻ mạnh tạm thời là sự nhẫn nại cần thiết.';
    }},
    {t:'Đề xuất: "Ta và ngươi chia nhau hai bên cổng cướp bóc"',tag:'ma',check:['tamco',11],
      ok:()=>{
        meet('phuongnguyen');
        S.f.pnPartner = 1;
        S.stones += 15;
        rel('phuongnguyen', 20);
        return 'Phương Nguyên nhếch mép: "Khá lắm." Hai người chia nhau trấn giữ, cướp sạch đám học trò còn lại (+15 nguyên thạch). Phương Nguyên bắt đầu xem ngươi là đồng loại.';
      },
      fail:()=>{
        meet('phuongnguyen');
        S.hp -= 15;
        S.stones = Math.max(0, S.stones - 5);
        return 'Phương Nguyên vung tay đánh ngã ngươi: "Chưa đủ tư cách hợp tác với ta." Bị cướp 5 nguyên thạch và mất 15 máu.';
      }}
  ]},

tn_hoatuu_secret:{canon:1,title:'Khe Đá Hoa Tửu',hint:'Cơ duyên Hoa Tửu Hành Giả',
  text:()=>'Theo dã sử sơn trại, tại khe đá hậu sơn có mùi hoa tửu thoang thoảng. Đây chính là nơi Hoa Tửu Hành Giả giấu con Tửu Trùng quý giá. Nhưng ngươi biết Phương Nguyên cũng đang lùng sục nơi này.',
  choices:()=>[
    {t:'Đến sớm một bước, dùng rượu thơm bắt lấy Tửu Trùng',req:()=>S.stones>=5,reqT:'Cần 5 nguyên thạch mua rượu',check:['ngo',10],
      ok:()=>{
        S.stones -= 5;
        gainGu('tuutrung');
        S.f.stoleWine = 1;
        S.suspPN = (S.suspPN||0) + 20;
        return 'Một con sâu béo tròn trắng muốt chui vào vò rượu! Ngươi luyện hóa thành công: Tửu Trùng! Phương Nguyên đến sau chỉ thấy cặn rượu, sát khí bốc lên ngùn ngụt.';
      },
      fail:()=>{
        S.stones -= 5;
        return 'Tửu Trùng quá nhanh nhẹn chui tọt vào hang đá sâu. Ngươi chưa bắt được nó.';
      }},
    {t:'Âm thầm theo dõi Phương Nguyên, chờ hắn mở đường vào động',check:['tamco',12],
      ok:()=>{
        S.f.hsBonus = 5;
        S.tamco++;
        return 'Ngươi nhìn thấy Phương Nguyên cẩn thận giải từng lớp trận pháp cửa động. Con đường vào di sản Hoa Tửu đã được ghi nhớ.';
      },
      fail:()=>{
        S.suspPN = (S.suspPN||0) + 25;
        return 'Phương Nguyên cảnh giác cực cao, hắn phát hiện có bóng người bám theo liền biến mất vào rừng trúc. (Hiềm nghi Phương Nguyên +25)';
      }},
    {t:'Mặc kệ, chuyên tâm rèn luyện tu vi của mình',eff:()=>{
      S.prog += 25;
      return 'Không dính vào nhân quả của nhân vật chính là cách an toàn nhất. Tu vi +25.';
    }}
  ]},

tn_thuongdoi_jks:{canon:1,title:'Án Mạng Giả Kim Sinh',hint:'Giả Kim Sinh xuất hiện',
  text:()=>'Thương đội Giả gia lên núi. Giả Kim Sinh tham lam đòi mua cổ trùng của Phương Nguyên nhưng bị cự tuyệt. Đêm hôm đó, ngươi thấy Phương Nguyên dụ Giả Kim Sinh vào sâu trong rừng trúc.',
  choices:()=>[
    {t:'Âm thầm hỗ trợ Phương Nguyên xử lý dấu vết hiện trường',tag:'ma',check:['tamco',12],
      ok:()=>{
        S.f.helpedKill = 1;
        S.stones += 50;
        rel('phuongnguyen', 35);
        return 'Ngươi dùng tri thức hiện đại xử lý vết máu và mùi hương. Phương Nguyên nhìn ngươi thật sâu, chia cho ngươi 50 nguyên thạch: "Ngươi hiểu chuyện đấy."';
      },
      fail:()=>{
        S.susp += 20;
        return 'Dấu vết bị xáo trộn, suýt nữa bị trinh sát thương đội phát giác.';
      }},
    {t:'Tống tiền Phương Nguyên ngay tại hiện trường',tag:'ma',check:['satphat',14],
      ok:()=>{
        S.stones += 80;
        rel('phuongnguyen', -20);
        S.suspPN = (S.suspPN||0) + 30;
        return 'Ngươi bước ra khỏi bóng tối, ép Phương Nguyên chia 80 nguyên thạch. Phương Nguyên cười lạnh đưa tiền, ánh mắt ánh lên sát ý băng hàn.';
      },
      fail:()=>{
        fight('phuongnguyen_boss',{mod:0.8,after:'pn_betray'});
        return 'Phương Nguyên không nói hai lời, lập tức tung Nguyệt Quang Cổ nhằm thẳng cổ họng ngươi!';
      }},
    {t:'Lặng lẽ quay về sơn trại, coi như không thấy gì',eff:()=>{
      S.tamco += 2;
      return 'Biết quá nhiều điều trong thế giới ma đạo này rất dễ mất mạng. Tâm cơ +2.';
    }}
  ]},

tn_dieutra:{canon:1,title:'Giả Phú Điều Tra',hint:'Giả Phú truy sát',
  text:()=>'Giả Phú phẫn nộ yêu cầu gia tộc mở cuộc điều tra toàn diện về sự mất tích của em trai. Tất cả thiếu niên cổ sư đều bị thẩm vấn.',
  choices:()=>[
    {t:'Dùng tư duy logic phản biện, hướng mũi dùi sang Hùng gia',check:['tamco',13],
      ok:()=>{
        S.tamco++;
        S.danh += 5;
        return 'Lý lẽ của ngươi kín kẽ không tì vết, khiến Giả Phú chuyển toàn bộ nghi ngờ sang sơn trại Hùng gia!';
      },
      fail:()=>{
        S.susp += 30;
        return 'Lời khai có điểm sơ hở khiến Giả Phú chú ý tới ngươi. Hiềm nghi +30.';
      }},
    {t:'Im lặng để Phương Nguyên tự mình diễn xuất',eff:()=>{
      return 'Phương Nguyên với kinh nghiệm 500 năm đã dễ dàng qua mặt ban điều tra.';
    }}
  ]},

tn_bai_encounter:{canon:1,title:'Kỳ Phùng Bạch Ngưng Băng',hint:'Gặp Bạch Ngưng Băng',
  text:()=>'Tuyết rơi giữa ngày hè. Bạch Ngưng Băng, thiên tài mang Bắc Minh Băng Phách Thể, một thân áo trắng chặn đường ngươi. "Nghe nói sơn trại này xuất hiện một kẻ thú vị không kém gì Cổ Nguyệt Phương Nguyên."',
  choices:()=>[
    {t:'Rút cổ nghênh chiến, đấu tay đôi với thiên tài Bạch gia',eff:()=>{
      meet('bai');
      fight('bai_boss',{after:'meet_bai'});
      return 'Bạch Ngưng Băng mỉm cười hưng phấn, hàn khí lập tức bao trùm bán kính mười trượng!';
    }},
    {t:'Nói với hắn về sự hư vô của sinh mệnh và con đường thoát chết',check:['ngo',13],
      ok:()=>{
        meet('bai');
        rel('bai', 40);
        S.ngo++;
        return 'Bạch Ngưng Băng ngẩn người, đôi mắt lam lóe lên sự chấn động: "Ngươi... hiểu ta hơn cả lũ đồng tộc ngu xuẩn." Hắn quay người rời đi.';
      },
      fail:()=>{
        meet('bai');
        fight('bai_boss',{after:'meet_bai'});
        return 'Bạch Ngưng Băng cười khẩy: "Nói nhảm nhiều quá, chết đi!"';
      }},
    {t:'Né tránh phong mang, lẩn vào bụi trúc',check:['satphat',11],
      ok:()=>'Ngươi dùng thân pháp luồn lách thoát khỏi tầm mắt hắn.',
      fail:()=>{
        meet('bai');
        fight('bai_boss',{mod:0.8,after:'meet_bai'});
        return 'Băng sương phong tỏa đường lui, ngươi buộc phải nghênh chiến!';
      }}
  ]},

tn_langtrieu_start:{canon:1,title:'Lang Triều Đổ Bộ',hint:'Lang triều bùng nổ',
  text:()=>'Hàng ngàn tiếng sói tru xé toạc màn đêm. Điện Lang tràn qua tường trại như thác lũ. Tộc trưởng ra lệnh toàn thể Cổ sư lên tường phòng thủ.',
  choices:[
    {t:'Trấn giữ cổng thành cùng tiểu tổ Thanh Thư',tag:'chinh',eff:()=>{
      meet('thanhthu');
      S.danh += 15;
      fight('dienlang',{scale:1.3,after:'lang_win'});
      return 'Ngươi sát cánh cùng Thanh Thư, bảo vệ phàm nhân và đồng tộc!';
    }},
    {t:'Đi săn sói lẻ, thu thập điện nha và nguyên thạch',eff:()=>{
      S.stones += 35;
      fight('dienlang',{scale:1.1,after:'lang_win'});
      return 'Hỗn loạn là bậc thang danh vọng và tài nguyên (+35 nguyên thạch).';
    }},
    {t:'Tìm Phương Nguyên xem hắn đang mưu tính điều gì',tag:'ma',eff:()=>{
      meet('phuongnguyen');
      rel('phuongnguyen', 15);
      fight('dienlang',{scale:1.1,after:'lang_win'});
      return 'Phương Nguyên đang lạnh lùng tận dụng xác đồng tộc chắn cửa.';
    }}
  ]},

tn_lang_king:{canon:1,title:'Lôi Quan Lang Vương Xuất Hiện',hint:'Quyết chiến Lang Vương',
  text:()=>'Sấm chớp rạch nát bầu trời đêm. Lôi Quan Lang Vương khổng lồ giẫm nát tường phòng ngự, hai gia lão Tam chuyển đã vong mạng.',
  choices:[
    {t:'Hợp lực cùng Phương Nguyên và Bạch Ngưng Băng vây giết Lang Vương',tag:'ma',eff:()=>{
      S.f.killKing = 1;
      fight('langvuong',{mod:0.85,after:'king_dead'});
      return 'Ba người mang ba dã tâm khác nhau cùng hướng mũi nhọn về phía vương giả bầy sói!';
    }},
    {t:'Tự mình xông lên chém Lang Vương cứu viện gia tộc',tag:'chinh',eff:()=>{
      S.f.killKing = 1;
      fight('langvuong',{scale:1.2,after:'king_dead'});
      return 'Dũng khí ngút trời, ngươi lao vào tâm bão sấm sét!';
    }}
  ]},

tn_huyetdong:{canon:1,title:'Huyết Động Lão Tổ Mở Cửa',hint:'Bí tàng Huyết Hải',
  text:()=>'Sạt lở để lộ lối vào Huyết Hải truyền thừa. Mùi máu tanh nồng bốc lên nghi ngút.',
  choices:[
    {t:'Cùng Phương Nguyên thăm dò di tích',tag:'ma',check:['tamco',13],
      ok:()=>{
        gainGu('toannhan');
        S.stones += 100;
        rel('phuongnguyen', 25);
        return 'Hai người chia đôi di tích! Ngươi nhận Toàn Nhận Cổ và 100 nguyên thạch!';
      },
      fail:()=>{
        fight('huyetkhoi',{after:'huyet_loot'});
        return 'Huyết khôi thức giấc, hai người bị chia cắt!';
      }},
    {t:'Tự mình độc chiếm cửa sinh',eff:()=>{
      fight('huyetkhoi',{after:'huyet_loot'});
      return 'Ngươi phi thân vào sâu trong động máu!';
    }}
  ]},

tn_final_escape:{canon:1,title:'Bão Tuyết Diệt Vong Thanh Mao Sơn',hint:'Đêm tận thế',
  text:()=>'Bạch Ngưng Băng tự bạo Bắc Minh Băng Phách Thể, biến cả ngọn núi Thanh Mao thành khối băng vạn trượng! Sơn trại sụp đổ, người chết vô số. Phương Nguyên đang đạp băng mở đường máu rời đi.',
  choices:[
    {t:'Đồng hành cùng Phương Nguyên xông ra khỏi núi, bước vào giang hồ',tag:'ma',req:()=>(S.rel.phuongnguyen||0)>=15,reqT:'Phương Nguyên coi ngươi là đồng minh',eff:()=>{
      S.over = 'win';
      S.ending = 'pn_ally';
    }},
    {t:'Dẫn dắt những người sống sót lập nên thế lực mới của riêng mình',tag:'chinh',eff:()=>{
      S.over = 'win';
      S.ending = 'leader';
    }},
    {t:'Một mình một ngựa tiêu sái độc hành, khát vọng bước lên đỉnh cao Tiên nhân',eff:()=>{
      S.over = 'win';
      S.ending = 'solo';
    }}
  ]}
};

const AFTER={
  pn_duel:()=>{log('Phương Nguyên nhìn ngươi với ánh mắt ngạc nhiên: "Có chút bản lĩnh." Hắn xoay người bỏ đi.','big')},
  pn_betray:()=>{S.hp=1;log('Phương Nguyên trọng thương bỏ chạy vào bóng đêm, ngươi suýt mất mạng!','danger')},
  meet_bai:()=>{rel('bai',20);log('Bạch Ngưng Băng gạt máu bên môi: "Hay lắm, ta sẽ còn tìm ngươi!"','good')},
  lang_win:()=>{S.stones+=30;S.danh+=10;log('Đợt sói bị đánh lui. Nhận 30 nguyên thạch thưởng.','gold')},
  king_dead:()=>{S.stones+=150;S.danh+=30;gainGu('loidinh');log('Lôi Quan Lang Vương ngã xuống! Ngươi đoạt được Lôi Đinh Cổ và 150 nguyên thạch!','big')},
  huyet_loot:()=>{gainGu('toannhan');S.stones+=100;log('Đoạt được di sản Toàn Nhận Cổ từ huyết động!','good')},
};

const ENDINGS={
  pn_ally:{t:'Ma Đầu Song Hành',d:'Ngươi và Cổ Nguyệt Phương Nguyên sóng vai rời khỏi Thanh Mao Sơn đang đóng băng. Hai kẻ mang linh hồn vượt thời không bước vào đại lục rộng lớn, mở ra thiên hạ đại loạn.'},
  leader:{t:'Tân Vương Cổ Nguyệt',d:'Ngươi giải cứu tàn dư các gia tộc, dùng tri thức dị giới xây dựng lại một thế lực quật khởi giữa thế giới tàn khốc.'},
  solo:{t:'Độc Hành Thiên Ngoại Ma',d:'Không ràng buộc, không bằng hữu. Ngươi cầm trong tay Cổ trùng, ngẩng đầu nhìn trời cao chín vạn dặm: "Đời này, ta muốn trường sinh!"'}
};
