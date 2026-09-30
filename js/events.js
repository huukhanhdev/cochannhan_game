// Sự kiện. Mỗi tuần = 10 ngày, 3 tuần một tháng.
// Lựa chọn: {t, tag:'ma'|'chinh', canon, check:[thuộc tính, độ khó], bonus(), req(), reqT, ok(), fail(), eff()}
// canon:true = lựa chọn giống Phương Nguyên trong nguyên tác.

// Lang triều gộp còn 2 tuần (PR-5): Lang Vương (c_lang3) tới cuối tuần 20, là đại sự chờ sau cảnh Thanh Thư
// Mốc có cond là mốc nhân quả: thiếu nhân thì tuần đó không có mốc (xem KE_HOACH_PR5.md, phần D).
// Đại sự bắt buộc (không cond): khai khiếu, khảo hạch, thương đội, Bạch gia tuần tra, gặp Bạch Ngưng Băng, lang triều, lăng mộ lộ ra, Huyết Cương, trận cuối.
const CANON={1:'c_khaikhieu',3:'c_giasan',4:'c_conghocduong',6:'c_khaohach',8:'c_tramthuy',10:'c_thuongdoi',11:'c_kimsinh',
  13:'c_dieutra',15:'c_thuongdoiroi',16:'c_baigia',17:'c_bai',19:'c_lang1',20:'c_lang2',22:'c_luancong',
  23:'c_thiet',24:'c_huyetdong',25:'c_thietvay',26:'c_nhatdai',27:'c_final'};
const FINAL_TURN=27;

function langMod(){
  let m=S.chuyen<2?1.3:1;
  // Đã cùng tổ khác đánh bầy sói trước lang triều: quen cách sói đánh
  if(S.f.hungPlot)m*=.9;
  return m;
}

// Canon VN 131–138: Hùng Chiên dùng Cường Thủ Cổ cướp cổ của Lang Vương, chết trong lang triều. Phương Nguyên nhặt được con cổ.
function loseGuQ1(k){const i=S.gu.findIndex(g=>g.k===k);if(i>=0)S.gu.splice(i,1)}
// Canon VN 204: Huyết Lô xung đột Thạch Khiếu, không khiếu trở lại quang mô
// Lang triều gộp (PR-5): Lang Vương tới cuối tuần 20. Trước trận, gia tộc phát linh dược cho người giữ tường.
function langRally(){if(S.f.langRally===S.turn)return;S.f.langRally=S.turn;S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.2));S.ess=Math.min(maxEss(),S.ess+Math.round(maxEss()*.2));log('Gia lão phát linh dược cho mọi người trên tường trại. Khí huyết và chân nguyên hồi phục một phần.','good')}
// Chuỗi Cổ Kim Sinh (KE_HOACH_NHANH_TRUYEN.md, mục 2).
// Quả: một cờ cho cả chuỗi. dead · escaped · reported · extort
function jksSet(v){S.f.jks=v;if(v==='dead')S.f.killedJKS=1;if(v==='escaped')S.f.jksEscaped=1;if(v==='reported'||v==='extort'||v==='escaped')S.f.jksHate=1}
function jksIs(...v){return v.includes(S.f.jks||(S.f.killedJKS?'dead':S.f.jksEscaped?'escaped':''))}
// Thế giới nhớ việc ngươi làm: một câu phản ứng chèn vào chuyện phụ ở sơn trại, học đường, nhiệm vụ đường.
// Chỉ rút từ những trạng thái đã thật sự xảy ra.
const REMARKS=[
  [()=>jksIs('dead'),['Mấy người bán hàng vẫn thì thầm về thiếu gia Cổ gia mất tích trên núi.','Có kẻ đồn khe đá sau núi đêm nào cũng có tiếng khóc.']],
  [()=>jksIs('escaped'),['Người ta xì xào: Cổ Kim Sinh kể khắp nơi rằng bị một học trò Cổ Nguyệt phục kích.']],
  [()=>jksIs('reported'),['Người tộc nhân bị Cổ Kim Sinh lừa hôm trước gặp ngươi là cúi đầu cảm tạ.']],
  [()=>jksIs('extort'),['Cổ Kim Sinh thấy ngươi ở chợ là quay mặt đi chỗ khác.']],
  [()=>S.f.qingshuDead,['Tộc trưởng Cổ Nguyệt Bác già đi trông thấy từ sau lang triều.','Gốc cây mọc lên từ xác Thanh Thư đã trổ lá non.']],
  [()=>S.f.qingshuAlive,['Thanh Thư đi ngang qua, khẽ gật đầu với ngươi. Vết băng trên vai hắn chưa lành hẳn.']],
  [()=>S.f.pcHate,['Phương Chính đi ngang qua, cụt một tay áo. Hắn không nhìn ngươi.']],
  [()=>S.f.pcAlly,['Phương Chính từ xa vẫy tay gọi "ca ca", làm mấy học trò khác trố mắt.']],
  [()=>S.f.tramthuySpy&&!S.f.tramthuyGone,['Trầm Thúy lướt qua, khẽ liếc ngươi rồi cúi đầu. Tối nay sẽ có tin.']],
  [()=>S.f.tramthuyGone,['Không ai còn nhắc tới Trầm Thúy nữa.']],
  [()=>S.f.tuulau===2,['Khách trong tửu lâu của ngươi đông hơn hẳn từ khi đổi chủ.']],
  [()=>S.f.tlBan&&S.f.tlBan!=='khong'&&!S.f.tuulau,['Tửu lâu của cha mẹ ngươi giờ treo biển nhà cậu. Khách thưa hẳn.']],
  [()=>S.f.tieuTam==='chet',['Người ta tìm thấy xương tiểu tổ Tiêu Tam trong rừng. Ai cũng nói họ xui xẻo gặp bầy sói.']],
  [()=>S.f.tieuTam==='cuu',['Tiêu Tam đi ngang, gật đầu với ngươi một cái, không nói gì.']],
  [()=>S.f.benhXa==='cuu',['Hoa Hân chống nạng đi ngang, cúi đầu chào ngươi thật sâu.']],
  [()=>S.f.benhXa==='cuop',['Người trong trại bàn tán: tiểu tổ Bệnh Xà chết hết, túi cổ cũng không còn.']],
  [()=>S.f.vuongNhi==='chet',['Lão thợ săn Vương vẫn ngồi đầu ngõ chờ con trai về.']],
  [()=>S.susp>=60,['Vài gia đinh nhìn ngươi rồi thì thầm với nhau. Hiềm nghi quanh ngươi đã thành chuyện cả trại biết.']],
  [()=>S.danh>=50,['Mấy học trò khóa dưới đứng dậy nhường chỗ khi ngươi đi qua.']],
];
function remark(id){
  if(!S||!EV[id]||!['trai','hocduong','nhiemvu'].includes(EV[id].loc))return '';
  const pool=REMARKS.filter(r=>{try{return r[0]()}catch(e){return false}}).flatMap(r=>r[1]);
  if(!pool.length)return '';
  // cố định theo tuần và sự kiện để không đổi câu mỗi lần vẽ lại
  let h=S.turn*31;for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;
  return h%100<45?pool[h%pool.length]:'';
}
function thachKhieuClash(){if(!hasGu('thachkhieu')&&!S.f.thachkhieu)return;loseGuQ1('thachkhieu');S.f.thachkhieu=0;log('Huyết Lô xung đột với Thạch Khiếu: vách đá trong không khiếu vỡ vụn, trở lại quang mô. Thạch Khiếu tan biến.','danger')}
function cuongThuDrop(){if(hasGu('cuongthu'))return;gainGu('cuongthu',true);log('Dọn xác sau trận, ngươi gặp một con bọ cánh cứng đen, đầu mọc càng sắt, đang bò quanh thi thể Hùng Chiên: Cường Thủ Cổ. Khí tức Xuân Thu Thiền tràn ra, ngươi luyện hóa nó trong nháy mắt.','good')}

const EV={
/* ================= NGUYÊN TÁC ================= */
c_khaikhieu:{canon:1,title:'Lễ khai khiếu',hint:'Lễ khai khiếu',
  who:'gialao',
  scene:{
    start:'bien_hoa',budget:2,
    nodes:{
      bien_hoa:{
        talk:[
          ['gialao','Tất cả thiếu niên bước vào biển hoa! Hy Vọng Cổ sẽ khai phá không khiếu cho các ngươi!'],
          ['','Mười mấy thiếu niên Cổ Nguyệt nín thở bước vào biển hoa dạ quang lung linh dưới lòng đất.'],
          ['','Từng đốm sáng bay vào bụng các thiếu niên. Bỗng từ đường bùng lên ánh hào quang chói lòa!'],
          ['gialao','Phương Chính... Chân nguyên hải chín phần tám! Giáp đẳng! Giáp đẳng tuyệt đỉnh!']
        ],
        choices:[
          {t:'Dò xét phản ứng của gia lão và tộc trưởng',stay:1,flag:'soi_toctruong',say:'Tộc trưởng Cổ Nguyệt Bác kích động đứng bật dậy, ánh mắt sáng rực. Đã bao năm sơn trại mới lại xuất hiện Giáp đẳng!'},
          {t:'Quan sát biểu cảm ngơ ngác của Phương Chính',stay:1,flag:'soi_emtrai',talk:[['phuongchinh','Đệ... đệ là Giáp đẳng thật sao ca ca? Đệ không còn là cái bóng của huynh nữa rồi...']]},
          {t:'Bước vào biển hoa, tới lượt bản thân',go:'den_luot'}
        ]
      },
      den_luot:{
        talk:[
          ['','Ngươi bước tới giữa biển hoa. Đốm sáng tụ lại trong bụng, không khiếu hé mở, hiện ra biển đồng xanh nhạt.'],
          ['gialao','Phương Nguyên... Chân nguyên hải bốn mươi bốn phần. Bính đẳng.'],
          ['','Cả từ đường lặng đi trong chớp mắt, rồi tiếng xì xào cười nhạo rộ lên như ong vỡ tổ: "Thiên tài ngâm thơ từ nhỏ hóa ra chỉ là Bính đẳng!"']
        ],
        choices:[
          {t:'Lãnh đạm bước ra. Tiếng cười hôm nay chẳng đáng một viên nguyên thạch',canon:1,go:'nhan_lanh'},
          {t:'Nở nụ cười chân thành, vỗ vai chúc mừng Phương Chính',tag:'chinh',go:'ket_than'},
          {t:'Liếc nhìn Phương Chính bằng ánh mắt băng hàn thấu xương',tag:'ma',go:'de_doa'}
        ]
      },
      nhan_lanh:{
        talk:[
          ['','Năm trăm năm làm ma đầu dạy ngươi biết nhẫn. Phàm nhân thiển cận chỉ nhìn tư chất, há biết tâm cơ mới định đoạt càn khôn.']
        ],
        eff:()=>{S.tamco++;}
      },
      ket_than:{
        talk:[
          ['phuongchinh','Ca ca... đệ... đệ không ngờ mình lại hơn huynh. Đệ sẽ bảo vệ huynh!'],
          ['','Phương Chính rưng rưng xúc động. Tộc trưởng và các gia lão nhìn hai huynh đệ gật đầu tán thưởng.']
        ],
        eff:()=>{rel('phuongchinh',20);S.danh+=8;S.f.pcThan=1;}
      },
      de_doa:{
        talk:[
          ['phuongchinh','Ca... ca ca... sao huynh lại nhìn đệ như thế...'],
          ['','Hào quang Giáp đẳng vừa bốc lên lập tức bị ánh mắt rợn người của Phương Nguyên dập tắt. Phương Chính rụt cổ sợ hãi, vết thương tâm lý khắc sâu.']
        ],
        eff:()=>{rel('phuongchinh',-25);S.tamco+=2;S.f.pcSo=1;}
      }
    }
  },
  post:()=>{gainGu('nguyetquang',true);log('Học đường phát cho mỗi học trò một con Nguyệt Quang Cổ. Ngươi luyện hóa nó chỉ trong một đêm.','good')}},

c_giasan:{canon:1,title:'Di sản cha mẹ',hint:'Đòi lại di sản',
  who:'caumo',
  scene:{
    start:'phong_khach',budget:2,
    nodes:{
      phong_khach:{
        talk:[
          ['caumo','Phương Nguyên à, cháu mới Nhất chuyển Sơ kỳ, giữ tửu lâu với ruộng trà làm sao kham nổi? Cậu mợ giữ hộ là vì muốn tốt cho hai đứa thôi!'],
          ['','Cậu Đống Thổ mặt mày giả nhân giả nghĩa, mợ ngồi bên cạnh quạt phành phạch. Tỳ nữ Trầm Thúy đứng sau bưng trà, mắt lúng liếng dò xét.']
        ],
        choices:[
          {t:'Uống chén trà, quan sát thái độ Trầm Thúy',stay:1,flag:'soi_tramthuy',talk:[['tramthuy','...Khế ước mợ cất kỹ lắm, thiếu gia chớ dại làm căng...']]},
          {t:'Gặng hỏi về sổ sách thu chi tửu lâu năm qua',stay:1,flag:'soi_sosach',say:'Cậu ấp úng lảng sang chuyện khác. Rõ ràng tửu lâu sinh lời cả trăm thạch mỗi tháng nhưng lão chưa từng chia một cắc.'},
          {t:'Đem gia quy tộc luật ra đe dọa, đòi lại tửu lâu',tag:'ma',canon:1,go:'doi_manh'},
          {t:'Mua chuộc Trầm Thúy lấy khế ước giấu trong buồng',hidden:'soi_tramthuy',req:()=>S.stones>=10,reqT:'Cần 10 nguyên thạch mua chuộc',go:'mua_chuoc'},
          {t:'Đề nghị phân chia hòa hoãn: nhận tửu lâu, để lại ruộng trà',tag:'chinh',go:'hoa_hoan'},
          {t:'Theo ký ức: vạch trần chuyện cậu lén bán ba mẫu ruộng trà',mem:'giasan',go:'nho_ruongtra'}
        ]
      },
      doi_manh:{
        talk:[
          ['','Ngươi đập bàn đứng phắt dậy, sát khí lạnh lẽo tỏa ra: "Tộc quy định rõ, con cái mười sáu tuổi khai khiếu được thừa kế gia sản. Cậu mợ muốn để ta mời hình đường gia lão tới kiểm tra sao?"']
        ],
        check:['tamco',11],bonus:()=>mem('giasan')?8:0,
        okGo:'doi_thanhcong',failGo:'doi_thatbai'
      },
      doi_thanhcong:{
        talk:[
          ['caumo','Ngươi... đồ nghiệt chủng bất hiếu! Cầm lấy khế ước rồi xéo đi!'],
          ['','Cậu mặt cắt không còn hạt máu, ném tập khế ước tửu lâu lên bàn.']
        ],
        eff:()=>{S.f.tuulau=2;rel('caumo',-50);learn('giasan');return 'Tửu lâu hoàn toàn về tay ngươi: mỗi tuần +6 nguyên thạch.';}
      },
      doi_thatbai:{
        talk:[
          ['caumo','Hừ! Trứng mà đòi khôn hơn vịt! Ngươi thích kiện cáo thì cứ lên tộc trưởng!'],
          ['','Mợ khóc lóc bù lu bù loa khắp ngõ xóm. Ngươi chỉ vớt vát được một phần nhỏ tửu lâu.']
        ],
        eff:()=>{S.f.tuulau=1;rel('caumo',-30);S.danh-=5;learn('giasan');return 'Chỉ đòi được nửa phần: mỗi tuần +3 nguyên thạch. Tiếng xấu đồn xa.';}
      },
      mua_chuoc:{
        talk:[
          ['tramthuy','Tạ ơn thiếu gia! Mợ giấu khế ước dưới gầm sập buồng trong, chìa khóa treo sau gương đồng!'],
          ['','Trầm Thúy nhận 10 viên nguyên thạch, lén lấy trộm khế ước đưa cho ngươi. Ngươi ung dung cầm khế ước đi đăng ký sang tên tại sơn trại mà không tốn một lời cãi vã.']
        ],
        eff:()=>{S.stones-=10;S.f.tuulau=2;S.f.tramthuySpy=1;rel('tramthuy',25);return 'Nắm trọn tửu lâu (+6 thạch/tuần) mà cậu mợ không kịp trở tay, còn thu phục được Trầm Thúy!';}
      },
      hoa_hoan:{
        talk:[
          ['caumo','Được... nể tình phụ mẫu ngươi, tửu lâu cho ngươi tự quản, còn ruộng trà để cậu mợ canh tác.'],
          ['','Hai bên đạt được thỏa hiệp. Danh tiếng ngươi không bị sứt mẻ.']
        ],
        eff:()=>{S.f.tuulau=1;rel('caumo',5);S.danh+=6;return 'Tửu lâu về tay (+4 thạch/tuần), giữ được hòa khí.';}
      },
      nho_ruongtra:{
        talk:[
          ['','Ngươi lật bài ngửa: "Ba mẫu ruộng trà hướng đông cậu lén bán cho lái buôn ngoài núi lấy sáu mươi thạch, tưởng ta không biết sao?"']
        ],
        eff:()=>{
          if(!varShifted('giasan')){S.f.tuulau=2;rel('caumo',-50);return 'Đúng như ký ức: cậu tái mặt, không cãi được nửa câu, dâng trọn tửu lâu!';}
          rel('caumo',-30);S.susp+=15;return 'Lần này cậu đã làm giấy tờ hợp pháp từ trước. Ngươi không ép được lão, hiềm nghi +15.';
        }
      }
    }
  }},

c_conghocduong:{canon:1,title:'Cổng học đường',hint:'Chặn cổng học đường',
  who:'hoctro',
  scene:{
    start:'cong_hoc',budget:2,
    nodes:{
      cong_hoc:{
        talk:[
          ['','Chuông tan học vang lên. Đám thiếu niên hớn hở bước ra cổng, trên tay tung tẩy túi nguyên thạch vừa được học đường trợ cấp.'],
          ['','Học đường gia lão đứng trên bao lơn lầu hai, ung dung vuốt râu ngắm cảnh như thể mù điếc trước mọi chuyện xảy ra dưới cổng.']
        ],
        choices:[
          {t:'Quan sát kẻ nào nhát gan và nhiều tiền nhất',stay:1,flag:'soi_moc',say:'Đám công tử Mạc gia rủng rỉnh tiền túi, còn đám con nhà nghèo thì run rẩy ôm khư khư từng viên thạch.'},
          {t:'Bước ra giữa cổng, chặn đường cướp nguyên thạch',tag:'ma',canon:1,go:'cuop_cong'},
          {t:'Mở dịch vụ "bảo kê": thu phí che chở đám học trò nghèo khỏi Mạc gia',go:'bao_ke'},
          {t:'Theo ký ức: chặn đúng ba kẻ nhát gan bỏ chạy',mem:'gate',go:'nho_cong'},
          {t:'Lặng lẽ rời đi, không dính líu',go:'ve'}
        ]
      },
      cuop_cong:{
        talk:[
          ['','Phương Nguyên đứng sừng sững giữa cổng đá, tay áo phần phật: "Mỗi người để lại một viên nguyên thạch phí qua cổng. Không nộp thì ở lại luyện tay."'],
          ['hoctro','Phương Nguyên! Ngươi điên rồi! Bính đẳng mà dám cướp của bọn ta? Huynh đệ, xông lên!']
        ],
        fight:{foe:'hoctro',win:'cuop_thang',flee:'cuop_thua'}
      },
      cuop_thang:{
        talk:[
          ['','Một đòn quét ngã hai tên, Nguyệt Nhận sượt qua gò má tên cầm đầu để lại vệt máu. Đám thiếu niên hoảng loạn vứt lại túi thạch chạy thục mạng.']
        ],
        eff:()=>{S.stones+=16;S.f.gate=1;learn('gate');later('q_hoctrophuc',3,6,'gate');S.dao=clamp(S.dao+6,-100,100);S.danh-=4;return '+16 nguyên thạch! Từ nay mỗi tuần có thể chặn cổng cướp bóc.';}
      },
      cuop_thua:{
        talk:[
          ['','Đám đông ùa tới, ngươi tạm lách mình lùi vào con hẻm bên cạnh.']
        ]
      },
      bao_ke:{
        talk:[
          ['','Ngươi đứng cạnh cổng, ngoắc tay gọi mấy đứa học trò nghèo: "Mạc Bắc sắp chặn đường các ngươi. Đưa ta nửa viên, ta bảo đảm các ngươi về nhà an toàn."'],
          ['hoctro','Thật... thật sao Phương Nguyên ca?']
        ],
        eff:()=>{S.stones+=8;S.f.gateProtect=1;S.danh+=4;S.tamco++;return 'Thu 8 nguyên thạch phí bảo kê. Đám học trò nghèo cảm kích, danh vọng +4!';}
      },
      nho_cong:{
        talk:[
          ['','Ngươi nhớ rõ tên nào có tật hay giấu thạch trong ống giày.']
        ],
        eff:()=>{
          if(!varShifted('gate')){S.stones+=14;S.f.gate=1;return 'Chặn đúng 3 kẻ giàu nhất, thu 14 nguyên thạch trước khi chúng kịp phản ứng!';}
          fight('hoctro',{mod:1.15,sceneWin:'cuop_thang',sceneFlee:'cuop_thua'});
          return 'Lần này Mạc Bắc đã liên minh từ trước, chặn đường ngươi!';
        }
      },
      ve:{
        talk:[
          ['','Ngươi rảo bước về phòng trọ, trong đầu tính toán lượng chân nguyên cần thiết để nuôi Nguyệt Quang Cổ.']
        ]
      }
    }
  }},

c_khaohach:{canon:1,title:'Khảo hạch tháng hai',hint:'Học đường khảo hạch',
  who:'gialao',
  scene:{
    start:'vo_dai',budget:2,
    nodes:{
      vo_dai:{
        talk:[
          ['gialao','Khảo hạch tháng hai bắt đầu! Ai bắn bia chuẩn nhất và tu vi cao nhất sẽ nhận phần thưởng: Thanh Đồng Xá Lợi Cổ!'],
          ['','Tấm bia cỏ dựng cách ba mươi bước. Phương Chính bước lên, Nguyệt Nhận liên hoàn xé gió cắm phập vào tâm bia!'],
          ['gialao','Phương Chính: mười điểm trọn vẹn, tu vi Nhất chuyển Trung giai!']
        ],
        choices:[
          {t:'Quan sát bia cỏ và góc gió thổi qua võ đài',stay:1,flag:'soi_gio',say:'Gió đông bắc thổi mạnh qua góc võ đài, nếu không tính độ lệch thì đường cong Nguyệt Nhận sẽ bị dạt.'},
          {t:'Toàn lực xuất thủ đoạt hạng nhất',go:'doat_nhat'},
          {t:'Cố tình bắn trượt, giấu tài mức trung bình',canon:1,go:'giau_tai'},
          {t:'Thách đấu trực tiếp bia của Phương Chính',go:'thach_dau'}
        ]
      },
      doat_nhat:{
        talk:[
          ['','Ngươi bước lên vạch, vận chân nguyên xanh nhạt, ba đạo Nguyệt Nhận bay theo quỹ đạo hình vòng cung tuyệt mỹ xé tan hồng tâm!']
        ],
        check:['satphat',12],bonus:()=>(S.sc&&S.sc.flags&&S.sc.flags.soi_gio)?4:0,
        okGo:'nhat_thanhcong',failGo:'nhat_thatbai'
      },
      nhat_thanhcong:{
        talk:[
          ['gialao','Kỹ xảo xạ kích xuất thần nhập hóa! Hạng nhất khảo hạch: Cổ Nguyệt Phương Nguyên!'],
          ['','Cả trường ồ lên kinh ngạc. Gia lão trao tận tay ngươi viên Thanh Đồng Xá Lợi Cổ lấp lánh ánh kim!']
        ],
        eff:()=>{gainGu('xaloi1');S.danh+=15;S.susp+=5;return 'Đoạt Thanh Đồng Xá Lợi Cổ! Danh vọng +15.';}
      },
      nhat_thatbai:{
        talk:[
          ['','Chân nguyên Bính đẳng có hạn khiến nhát thứ ba hơi chệch tâm. Ngươi dừng ở hạng nhì.']
        ],
        eff:()=>{S.stones+=10;S.danh+=5;return 'Hạng nhì: nhận 10 nguyên thạch an ủi.';}
      },
      giau_tai:{
        talk:[
          ['','Ngươi cố ý để đòn thứ ba lệch hồng tâm nửa tấc. Kết quả: trung bình khá, nhận 5 nguyên thạch. Không ai nghi ngờ kẻ Bính đẳng này.']
        ],
        eff:()=>{S.tamco++;S.stones+=5;return 'Tâm cơ +1, +5 nguyên thạch.';}
      },
      thach_dau:{
        talk:[
          ['','Ngươi chém thẳng một đòn chẻ đôi mũi Nguyệt Nhận của Phương Chính đang cắm trên bia! Cả võ đài nín thở!']
        ],
        eff:()=>{rel('phuongchinh',-15);S.satphat+=2;S.danh+=10;S.stones+=10;return 'Sát phạt +2, danh vọng +10. Phương Chính tái mặt hoảng hốt.';}
      }
    }
  }},

c_tramthuy:{canon:1,title:'Tỳ nữ Trầm Thúy',hint:'Trầm Thúy trở mặt',
  who:'tramthuy',
  scene:{
    start:()=>S.f.tramthuySpy&&!S.f.tramthuyGone?'bao_tin':'chen_tra',budget:2,
    nodes:{
      chen_tra:{
        talk:[
          ['','Trầm Thúy hầu hạ hai anh em ngươi từ thuở nhỏ. Thuở ngươi còn được xưng là thần đồng, nàng luôn đon đả bưng nước rót trà, dịu dàng săn sóc.'],
          ['','Nhưng từ sau Khai khiếu đại điển, khi Phương Chính lộ ra tư chất Giáp đẳng còn ngươi chỉ là Bính đẳng, ánh mắt nàng đã đổi khác hoàn toàn.'],
          ['tramthuy','Phương Nguyên thiếu gia... đây là trà hoa cúc của ngài. Nước sôi vừa cạn, thiếu gia uống tạm. Ta còn phải sang phòng nhị thiếu gia ủi y phục...']
        ],
        choices:[
          {t:'Cầm chén trà lên nếm thử',stay:1,flag:'tra_nguoi',say:'Chén trà nguội ngắt, bã trà nổi lềnh bềnh. Trầm Thúy đứng nép bên cửa, mắt cứ lén nhìn về phía sương phòng của Phương Chính.'},
          {t:'Mặc kệ, kẻ thiển cận lòng dạ hẹp hòi không đáng bận tâm',tag:'chinh',canon:1,go:'mac_ke'},
          {t:'Lợi dụng nàng làm tai mắt bên cạnh Phương Chính',go:'cai_cam'},
          {t:'Quát tháo dằn mặt nàng trước mặt cả phủ',tag:'ma',go:'dan_mat'},
          {t:'Dụ dỗ bằng tiền tài và lời hứa tương lai',hidden:'tra_nguoi',req:()=>S.stones>=8,reqT:'Cần 8 nguyên thạch',go:'du_do'},
          {t:'Nhắc nàng chuyện khế ước năm xưa: nàng đã bán mợ một lần, giờ bán thêm lần nữa',need:{chose:'c_giasan:mua_chuoc',t:'Cần đã mua chuộc Trầm Thúy ở vụ gia sản'},tag:'ma',
            eff:()=>{meet('tramthuy');rel('tramthuy',10);S.f.tramthuySpy=1;S.tamco++;return 'Trầm Thúy tái mặt. Nàng biết ngươi nắm thóp mình. Từ nay mọi chuyện bên phòng Phương Chính đều tới tai ngươi. Tâm cơ +1.'}}
        ]
      },
      bao_tin:{
        talk:[
          ['tramthuy','Thiếu gia... nô tỳ có chuyện phải báo. Phu nhân đang cùng cậu viết đơn kiện, nói thiếu gia cưỡng đoạt di sản, bất hiếu với trưởng bối.'],
          ['','Nàng rút trong tay áo ra một tờ giấy chép vội: tên mấy người cậu mợ định gọi làm chứng.'],
          ['tramthuy','Nô tỳ đã chọn theo thiếu gia thì không quay đầu nữa.']
        ],
        choices:[
          {t:'Nhận danh sách, thưởng nàng 5 nguyên thạch',req:()=>S.stones>=5,reqT:'Cần 5 nguyên thạch',eff:()=>{S.stones-=5;rel('tramthuy',15);S.f.ttWarn=1;return 'Có danh sách này, lần tới cậu mợ kiện ngươi sẽ không bất ngờ được nữa.'}},
          {t:'Nhận danh sách, dặn nàng tiếp tục theo dõi Phương Chính',tag:'ma',eff:()=>{S.f.ttWarn=1;S.tamco++;return 'Trầm Thúy gật đầu. Từ nay ngươi biết trước từng bước của cả nhà cậu và của Phương Chính. Tâm cơ +1.'}},
          {t:'Nghi ngờ nàng chơi hai mang, dọa nàng',tag:'ma',eff:()=>{rel('tramthuy',-25);S.f.tramthuySpy=0;later('q_tramthuyhan',4,6,'!tramthuyGone');return 'Trầm Thúy tái mặt, lùi ra cửa. Ngươi mất một tai mắt, và có thêm một kẻ thù.'}},
        ]
      },
      mac_ke:{
        talk:[
          ['','Ngươi ung dung nhấp một ngụm trà nguội rồi đặt xuống, sắc mặt không một gợn sóng.'],
          ['','Năm trăm năm gió tanh mưa máu kiếp trước, ngươi đã thấy quá nhiều hạng người đón gió đổi chiều thế này. Kẻ tầm thường như hạt bụi ven đường, sao làm lung lay chí lớn ma đầu?']
        ],
        eff:()=>{meet('tramthuy');rel('tramthuy',-10);S.tamco++;return 'Năm trăm năm tâm tính ma đầu: không bận tâm kẻ nhỏ mọn. Tâm cơ +1.';}
      },
      cai_cam:{
        talk:[
          ['','Ngươi nhìn thẳng vào mắt nàng, nở nụ cười thâm trầm: "Trầm Thúy, đệ đệ ta tính tình nhút nhát, có ngươi ở cạnh chăm sóc ta cũng yên tâm. Chỉ là mỗi tuần, ngươi nhớ ghé qua kể cho ta nghe đệ ấy tu luyện tới đâu rồi."']
        ],
        check:['tamco',11],
        okGo:'cai_thanhcong',failGo:'cai_thatbai'
      },
      cai_thanhcong:{
        talk:[
          ['tramthuy','Thiếu gia yên tâm... có tin gì của nhị thiếu gia, nô tỳ nhất định bẩm báo trước tiên!'],
          ['','Nàng khúm núm cúi đầu, nhận lấy túi trà thơm ngươi tiện tay thưởng cho.']
        ],
        eff:()=>{meet('tramthuy');S.f.tramthuySpy=1;rel('tramthuy',15);return 'Cài cắm Trầm Thúy thành công: mọi động tĩnh tu luyện của Phương Chính đều lọt vào tai ngươi!';}
      },
      cai_thatbai:{
        talk:[
          ['tramthuy','Nô tỳ... nô tỳ chỉ là phận tỳ nữ hầu hạ nhị thiếu gia, không dám làm kẻ dòm ngó!'],
          ['','Trầm Thúy giật mình lùi lại rồi chạy vội sang phòng Phương Chính mách nước.']
        ],
        eff:()=>{meet('tramthuy');rel('tramthuy',-20);rel('phuongchinh',-10);return 'Trầm Thúy mách lại với Phương Chính. Em trai nhìn ngươi đầy đề phòng.';}
      },
      dan_mat:{
        talk:[
          ['','Ngươi hất tung chén trà xuống nền đá vỡ tan tành! Tiếng gốm sứ vỡ vụn làm Trầm Thúy rụng rời chân tay.'],
          ['','Ngươi bước tới, giọng lạnh như băng tuyết: "Lũ hạ nhân mắt chó xem thường người khác. Dù ta Bính đẳng, giết một tỳ nữ như ngươi gia tộc cũng chẳng thèm phạt nửa câu!"'],
          ['tramthuy','Thiếu gia tha mạng... tha mạng! Nô tỳ biết tội rồi!']
        ],
        eff:()=>{meet('tramthuy');rel('tramthuy',-30);S.danh-=3;S.tamco++;later('q_tramthuyhan',5,8,'!tramthuyGone');return 'Trầm Thúy sợ mất mật, từ đó không dám hỗn hào, nhưng ngấm ngầm ôm hận.';}
      },
      du_do:{
        talk:[
          ['','Ngươi lấy ra tám khối nguyên thạch sáng lấp lánh đặt lên bàn: "Phương Chính có Giáp đẳng nhưng chưa làm chủ gia tộc được đâu. Tiền này cho ngươi may áo mới. Làm việc cho ai mới có lợi, chắc ngươi tự hiểu."'],
          ['tramthuy','(Mắt sáng rực, vội vã nhét thạch vào ngực áo) Thiếu gia quả nhiên thấu tình đạt lý... Nô tỳ xin hết lòng vì ngài!']
        ],
        eff:()=>{meet('tramthuy');S.stones-=8;S.f.tramthuySpy=1;rel('tramthuy',35);return 'Dùng 8 nguyên thạch mua chuộc trọn vẹn Trầm Thúy: trung thành tuyệt đối, thành tai mắt đắc lực!';}
      }
    }
  }
},

c_thuongdoi:{canon:1,title:'Thương đội Cổ gia',hint:'Thương đội Cổ Phú đến',
  text:()=>'Tiếng chuông lạc đà vang dưới chân núi. Thương đội Cổ gia do Cổ Phú dẫn đầu lên Thanh Mao Sơn, mang theo cổ trùng hiếm từ khắp nơi và mở quầy mổ thạch.'+(mem('doanthach')?' Ký ức kiếp trước giúp ngươi nhìn thấu vân đá.':''),
  choices:[
    {t:'Đến xem hàng và dạo chợ thương đội',eff:()=>{if(window.SFX)SFX.bell();S.f.caravan=1;meet('giaphu');meet('kimsinh');rollShop();return 'Chợ thương đội mở cửa, có cả Xá Lợi Cổ và quầy mổ thạch.'}},
    {t:'Tiến thẳng vào quầy mổ thạch',eff:()=>{if(window.SFX)SFX.bell();S.f.caravan=1;meet('giaphu');meet('kimsinh');rollShop();S.panel='gamble';return 'Ngươi rảo bước tới chỗ những khối đá hóa thạch cổ trùng.'}},
  ]},

// Đối chiếu nguyên tác (novelwiki, ch 40–46): Phương Nguyên mổ thạch rồi bán cổ cho Cổ Kim Sinh; ở tửu quán thấy hắn lừa một tộc nhân,
// Cổ Phú ra dàn xếp; Phương Nguyên chủ động tìm Kim Sinh lúc say, bày chuyện về bức vách hình của Hoa Tửu Hành Giả, dụ tới hang,
// vách hình lộ truyền thừa, giết hắn để giữ bí mật. Kết cục ghi vào S.f.jks: dead · escaped · reported · extort · (không dính vào).
c_kimsinh:{canon:1,title:'Cổ Kim Sinh',hint:'Cổ Kim Sinh ở tửu quán',cond:()=>!S.f.jksDone,
  post:()=>{S.f.jksDone=1},
  who:'kimsinh',
  scene:{
    start:'tuu_quan',budget:2,
    nodes:{
      tuu_quan:{
        talk:()=>[
          ['','Tửu quán gần chợ thương đội đông nghịt. Cổ Kim Sinh, em trai thủ lĩnh thương đội Cổ Phú, đang ép một tộc nhân Cổ Nguyệt điểm chỉ vào tờ giấy nợ gian.'],
          ...(S.f.stoneGu&&GU[S.f.stoneGu]?[['','Hắn nhận ra ngươi: hôm trước chính hắn trả giá con '+GU[S.f.stoneGu].n+' ngươi mổ được ở quầy đá.']]:[]),
          ['giaphu','Đủ rồi, Kim Sinh. Xin lỗi vị huynh đài, Cổ gia bồi thường.'],
          ['','Cổ Phú dàn xếp xong rồi bỏ đi. Kim Sinh ngồi lại, gọi thêm rượu, vừa uống vừa chửi anh trai.']
        ],
        choices:()=>[
          {t:'Quan sát Kim Sinh',stay:1,check:['tamco',10],flag:'say',ok:()=>'Tửu lượng hắn kém, lại tham. Nhắc tới kho báu là mắt hắn sáng lên.',fail:()=>'Hắn chỉ là một gã say.'},
          {t:'Hỏi chuyện người tộc nhân bị lừa',stay:1,flag:'chung',say:'Người kia rút ra tờ giấy nợ: chữ ký giả, con dấu cũng giả. Chứng cứ nằm ngay đây.'},
          {t:'Ngồi xuống cạnh hắn, kể về bức vách hình của Hoa Tửu Hành Giả',canon:1,go:'du'},
          {t:'Vạch trần trò lừa trước mặt Cổ Phú',hidden:'chung',go:'vach_tran'},
          {t:'Riêng tư nói cho hắn biết ngươi có chứng cứ',hidden:'chung',go:'ton_tien'},
          {t:'Uống hết chén trà rồi về',eff:()=>'Chuyện nhà Cổ gia, không phải chuyện của ngươi.'},
        ]
      },
      du:{
        talk:[['','Ngươi hạ giọng: trong núi sau trại có một bức vách khắc hình, di tích của Hoa Tửu Hành Giả năm xưa. Ngươi biết cách mở, nhưng cần người có tiền chia lời.'],['kimsinh','Hoa Tửu Hành Giả? Ma đầu Ngũ chuyển? ...Đi, đi ngay đêm nay!']],
        check:['tamco',11],bonus:()=>(S.sc&&S.sc.flags.say?4:0)+(mem('jks')?6:0),okGo:'vach_hinh',failGo:'bi_thay'
      },
      bi_thay:{
        talk:[['','Hai người rời quán lúc canh ba. Mấy gia đinh thương đội ngồi ở góc đã thấy ngươi dìu hắn ra cửa.']],
        choices:[{t:'Vẫn đi tới khe đá',eff:()=>{S.susp+=15;later('q_giapho',2,4,'killedJKS');return 'Hiềm nghi +15.'},go:'vach_hinh'},{t:'Đổi ý, đưa hắn về lều thương đội',eff:()=>'Kim Sinh lè nhè đòi đi tiếp, rồi ngủ gục.'}]
      },
      vach_hinh:{
        talk:[['','Khe đá trong rừng trúc. Ngươi chạm vào vách, những nét khắc bắt đầu chuyển động, rồi mở ra lối vào di tàng của Hoa Tửu Hành Giả.'],['kimsinh','Của ta! Một nửa... không, tất cả là của ta!']],
        choices:[
          {t:'Giết hắn tại chỗ, giữ bí mật',canon:1,dao:12,eff:()=>{
            S.f.hsBonus=(S.f.hsBonus||0)+2;const v=(S.var||{}).kimsinh;
            if(v==='trap'){S.susp+=20;fight('giave',{after:'jkstrap',mod:.8,canFlee:true});return 'Có người của Cổ gia bám theo từ tửu quán!'}
            if(v==='guard'){fight('kimsinh',{after:'kimsinh',mod:1.25,terrain:'khe'});return 'Một gã hộ vệ áo đen đã theo hắn từ đầu. Hai đánh một.'}
            fight('kimsinh',{after:'kimsinh',mod:mem('jks')?.75:1,terrain:'khe',ambush:mem('jks'),adv:mem('jks')?'Ngươi biết hắn quay lưng lúc nào':''});return 'Ngươi đứng sau lưng hắn trong bóng tối.'}},
          {t:'Để hắn đi trước vào hang, mặc cơ quan tự xử',dao:10,check:['ngo',12],ok:()=>{jksSet('dead');learn('jks');S.stones+=35;S.f.hsBonus=(S.f.hsBonus||0)+2;return 'Cơ quan cửa động kẹp chặt hắn. Ngươi không cần ra tay. Túi hắn còn 35 nguyên thạch.'},fail:()=>{jksSet('escaped');S.susp+=15;return 'Hắn thoát khỏi cơ quan, hoảng loạn chạy về thương đội. Hắn sẽ kể với Cổ Phú. Hiềm nghi +15.'}},
          {t:'Trói hắn, ép ký giấy nợ làm tai mắt trong thương đội',check:['tamco',14],ok:()=>{jksSet('extort');S.stones+=30;S.f.hsBonus=(S.f.hsBonus||0)+2;later('q_jksthem',3,5,'!killedJKS');return 'Kim Sinh run rẩy ký. Hắn biết nếu nói ra, anh hắn sẽ biết chuyện giấy nợ gian. +30 nguyên thạch.'},fail:()=>{jksSet('escaped');S.susp+=15;return 'Hắn giằng được dây, chạy mất. Hiềm nghi +15.'}},
        ]
      },
      vach_tran:{
        talk:[['','Ngươi đứng dậy, đặt tờ giấy nợ gian lên bàn trước mặt Cổ Phú vừa quay lại.'],['giaphu','...Kim Sinh, đây là chữ của ngươi?']],
        check:['tamco',12],bonus:()=>S.chosen&&S.chosen.c_conghocduong&&S.chosen.c_conghocduong.includes('bao_ke')?4:0,okGo:'vach_ok',failGo:'vach_hong'
      },
      vach_ok:{talk:[['giaphu','Cổ gia xin lỗi cả trại. Kim Sinh, về lều!'],['','Kim Sinh bị anh tát giữa quán, nhìn ngươi đầy thù hận.']],
        eff:()=>{jksSet('reported');S.danh+=8;rel('toctruong',5);rel('kimsinh',-30);later('q_jksthu',3,5,'!killedJKS');return 'Danh vọng +8. Cả trại biết ngươi đứng ra bênh tộc nhân.'}},
      vach_hong:{talk:[['giaphu','Chữ ký này ai làm giả chẳng được. Tiểu huynh đệ đừng gây chuyện.']],
        eff:()=>{S.susp+=8;rel('kimsinh',-15);return 'Cổ Phú bênh em. Ngươi mất mặt. Hiềm nghi +8.'}},
      ton_tien:{talk:[['kimsinh','...Ngươi muốn bao nhiêu?']],
        eff:()=>{jksSet('extort');S.stones+=40;later('q_jksthem',3,5,'!killedJKS');return 'Kim Sinh nộp 40 nguyên thạch cho ngươi im miệng. Hắn sẽ không quên.'}},
    }
  }
},

c_dieutra:{canon:1,title:'Cổ Phú điều tra',hint:'Cổ Phú điều tra',cond:()=>jksIs('dead','escaped'),
  text:()=>(jksIs('escaped')?'Cổ Phú dẫn Cổ Kim Sinh mặt mũi bầm dập tới nghị sự đường: "Học trò Cổ Nguyệt phục kích em ta ở khe đá!" Tộc trưởng cho gọi ngươi tới đối chất.':'Cổ Phú lần theo dấu vết em trai tới tận Cổ Nguyệt sơn trại, yêu cầu gia tộc giao người. Những ai có mặt ở chợ hôm đó bị gọi tới từng người.')+' Cổ sư tra án của Cổ gia mang theo Túc Tích Cổ lần dấu chân và Trúc Quân Tử dò lời nói dối.',
  choices:()=>[
    {t:'Bình thản chối bỏ',canon:1,check:['tamco',14],bonus:()=>mem('jks')?4:0,
      ok:()=>{S.susp+=10;return 'Ngươi trả lời không một kẽ hở. Cổ Phú nhìn ngươi rất lâu rồi cho đi.'},
      fail:()=>{S.susp+=40;S.danh-=10;return 'Một câu trả lời hơi chậm. Cổ Phú không có chứng cứ, nhưng cả trại bắt đầu xì xào. Hiềm nghi +40.'}},
    {t:'Đẩy nghi ngờ sang Hùng gia',tag:'ma',dao:10,check:['tamco',16],
      ok:()=>{S.susp=Math.max(0,S.susp-10);S.tamco++;return 'Ngươi "vô tình" để lộ một mảnh áo Hùng gia. Cổ Phú đổi hướng. Tâm cơ +1.'},
      fail:()=>{S.susp+=50;return 'Lời vu khống quá vụng. Cổ Phú cười lạnh. Hiềm nghi +50.'}},
    {t:'Nhờ gia tộc che chở',req:()=>S.danh>=40,reqT:'Cần danh vọng 40',eff:()=>{S.susp+=15;S.danh-=10;return 'Tộc trưởng từ chối giao người. Ngươi nợ gia tộc một ân tình.'}},
    ...(jksIs('escaped')?[{t:'Nhận là hiểu lầm, đền 40 nguyên thạch cho yên chuyện',req:()=>S.stones>=40,reqT:'Cần 40 nguyên thạch',eff:()=>{S.stones-=40;S.danh-=5;S.susp=Math.max(0,S.susp-10);return 'Cổ Phú nhận thạch, vỗ vai em trai. Chuyện khép lại, nhưng cả trại biết ngươi có tật giật mình. Danh vọng −5.'}}]:[]),
  ]},

c_thuongdoiroi:{title:'Thương đội xuống núi',hint:'Thương đội rời đi',cond:()=>S.f.caravan,
  text:()=>'Thương đội Cổ gia thu dọn hàng hóa, chuẩn bị xuống núi.'+({dead:' Cổ Phú ngoái lại nhìn sơn trại, ánh mắt âm trầm. Hắn sẽ quay lại, và không đi một mình.',escaped:' Cổ Kim Sinh ngồi trên lưng lạc đà, ngoái lại cười nham hiểm với ngươi.',extort:' Cổ Kim Sinh không dám nhìn về phía ngươi. Túi hắn nhẹ hơn lúc lên núi.',reported:' Cổ Kim Sinh bị anh trai quản chặt, nhổ nước bọt về phía cổng trại.'}[S.f.jks]||''),
  choices:[{t:'Tiễn thương đội',eff:()=>{S.f.caravan=0;rollShop();return 'Chợ thương đội đóng cửa.'}}]},

c_baigia:{canon:1,title:'Bạch gia lấn đất',hint:'Bạch gia gây hấn',
  text:()=>'Bạch gia sơn trại bên kia núi bắt đầu lấn sang bãi nguyệt lan của Cổ Nguyệt. Gia tộc điều các tiểu tổ đi tuần biên giới.'+((S.var||{}).baigia==='phuc'&&S.tamco>=10?' Ngươi để ý dấu chân trên đường tuần quá gọn gàng, như có người cố tình xóa.':''),
  choices:()=>[
    ...(mem('baigia')?[{t:'Theo ký ức, phục kích trinh sát ở khe suối',mem:'baigia',eff:()=>{
      if(!varShifted('baigia')){fight('baitrinhsat',{after:'baigia',mod:.8});return 'Trinh sát Bạch gia đi đúng con đường ngươi nhớ.'}
      fight('baitrinhsat',{after:'baigia',mod:1.15});return 'Khe suối trống không. Bạch gia đã đổi đường, và giờ ba mặt đều là áo trắng.'}}]:[]),
    {t:'Theo tiểu tổ của Thanh Thư đi tuần',tag:'chinh',eff:()=>{meet('thanhthu');rel('thanhthu',10);fight('baitrinhsat',{after:'baigia'});return 'Thanh Thư dặn: "Đừng liều. Gặp người Bạch gia thì báo tin trước."'}},
    {t:'Đi tuần một mình, tùy cơ mà làm',eff:()=>{if((S.var||{}).baigia==='phuc'){fight('baitrinhsat',{after:'baigia',mod:1.15});return 'Ngươi tách đội đúng lúc Bạch gia giăng lưới. Ba mặt đều là áo trắng.'}fight('baitrinhsat',{after:'baigia'});return 'Ngươi tách khỏi đội tuần.'}},
    {t:'Viện cớ bế quan',eff:()=>{S.danh-=5;S.prog+=20;S.f.skipPatrol=1;later('q_baigiatrach',2,4,'skipPatrol');return 'Ngươi ở nhà tu luyện. Tu vi +20, danh vọng −5.'}},
  ]},

c_bai:{canon:1,title:'Bạch Ngưng Băng',hint:'Gặp Bạch Ngưng Băng',
  who:'bai',
  post:()=>{if(!S.f.kimngoSched&&!hasGu('cuxikimngo')){S.f.kimngoSched=1;later('c_kimngo',1,1)}},
  scene:{
    start:'tuyet_roi',budget:2,
    nodes:{
      tuyet_roi:{
        talk:[
          ['','Tuyết rơi trắng xóa giữa trưa hè oi ả. Từng bông tuyết lạnh thấu xương lướt qua tán thông rậm rạp.'],
          ['','Trên đỉnh tảng đá phủ băng, một thiếu niên áo trắng như tuyết, tóc bạc bay lòa xòa trong gió buốt, đôi mắt lam biếc sâu thẳm như hồ băng nghìn năm đang cúi nhìn ngươi.'],
          ['bai','Ngươi là Cổ Nguyệt Phương Nguyên? Nghe nói trại Cổ Nguyệt có một kẻ thú vị, không màng danh lợi cũng chẳng sợ hãi ai.']
        ],
        choices:[
          {t:'Lặng lẽ quan sát khí tức quanh người hắn',stay:1,flag:'soi_bai',say:()=>((S.var||{}).bai==='satý'?'Hàn khí quanh người hắn cô đặc lại thành từng lưỡi băng nhọn hoắt. Không phải tò mò, mà là sát ý lạnh lẽo!':(mem('bai')?'Biển chân nguyên trong không khiếu hắn tràn trề đến mức nứt toác kinh mạch. Hắn biết rõ thể chất này sẽ giết chết hắn trước tuổi hai mươi!':'Hàn khí Tam chuyển đỉnh phong tỏa ra bức người, nhưng trong đáy mắt hắn chỉ toàn là sự chán chường vô tận.'))},
          {t:'Nói với hắn về sự hư vô của sinh tử và tự do đích thực',tag:'chinh',canon:1,go:'luan_dao'},
          {t:'Theo ký ức: nói thẳng về thể chất Bắc Minh Băng Phách đang giết hắn',mem:'bai',go:'nho_thechat'},
          {t:'Rút Nguyệt Quang Cổ, sẵn sàng liều mình một trận sinh tử',tag:'ma',go:'quyet_chien'},
          {t:'Lùi bước, lợi dụng địa hình rừng rậm để thoát thân',go:'lui_buoc'},
          {t:'Tiếp tục giả làm kẻ Bính đẳng tầm thường như ở kỳ khảo hạch',need:{chose:'c_khaohach:giau_tai',t:'Cần đã giấu tài ở kỳ khảo hạch'},
            eff:()=>{meet('bai');S.tamco++;return 'Ngươi cúi đầu, lúng túng như mọi học trò Bính đẳng. Bạch Ngưng Băng nhìn một lúc rồi ngáp dài: "Tưởng thú vị lắm." Hắn bỏ đi. Không ai trên núi này biết ngươi thật sự là ai. Tâm cơ +1.'}}
        ]
      },
      luan_dao:{
        talk:[
          ['','Ngươi bình thản đứng giữa màn tuyết, tà áo khẽ bay: "Sống trên đời, ai cũng bị gông cùm trói buộc. Người tầm thường bị danh lợi trói, kẻ ngạo nghễ như ngươi lại bị chính sự kiêu hãnh và cái chết của mình giam cầm. Ta sống vì con đường của ta, sống hay chết có gì phải sợ hãi?"']
        ],
        check:['tamco',14],bonus:()=>(mem('bai')?8:0)+((S.var||{}).bai==='satý'?-3:0),
        okGo:'luan_dao_ok',failGo:'luan_dao_fail'
      },
      luan_dao_ok:{
        talk:[
          ['','Bạch Ngưng Băng sững người, đôi mắt lam biếc lóe lên tia sáng rực rỡ như chưa từng thấy trước đây.'],
          ['bai','...Ha ha! Hay! Hay lắm! "Sống vì con đường của ta"! Đám Cổ sư trên núi này toàn một lũ giòi bọ hèn hạ, chỉ có ngươi mới hiểu được cái chết rực rỡ là thế nào!'],
          ['','Hắn vung tay áo thu lại hàn khí, quay gót bước vào màn tuyết: "Sống cho tốt. Ta sẽ chờ xem ngươi đi được bao xa!"']
        ],
        eff:()=>{meet('bai');rel('bai',35);learn('bai');S.tamco+=2;return 'Bạch Ngưng Băng coi ngươi là tri kỷ sinh tử! Hắn thu lại sát ý rời đi. Tâm cơ +2.';}
      },
      luan_dao_fail:{
        talk:[
          ['bai','Nói thì hay lắm, nhưng thực lực không đủ thì đạo lý chỉ là lời sủa của kẻ hèn! Để ta xem ngươi chịu được mấy kiếm!']
        ],
        eff:()=>{
          meet('bai');learn('bai');
          fight('bai',{after:'bai',spare:(S.var||{}).bai!=='satý'?.3:0,spareT:'Bạch Ngưng Băng dừng tay giữa trận: "Đánh dở tệ. Nhưng lời ngươi nói khiến ta không muốn giết ngươi quá sớm." Hắn phất tay áo bỏ đi.'});
          return 'Hàn khí đóng băng cả mặt đất, Bạch Ngưng Băng vung băng đao chém tới!';
        }
      },
      nho_thechat:{
        talk:[
          ['','Ngươi nhìn thẳng vào mắt hắn: "Bắc Minh Băng Phách Thể. Mười thành tư chất, tinh bích không khiếu nứt vỡ từng ngày. Ngươi chỉ còn sống không quá ba năm nữa."'],
          ['bai','(Sắc mặt biến đổi hoàn toàn, hàn khí ngưng trệ) Ngươi... làm sao ngươi biết bí mật tuyệt đối của Bạch gia ta?!']
        ],
        eff:()=>{
          meet('bai');
          if(!varShifted('bai')){
            rel('bai',45);learn('bai');S.tamco+=2;
            return 'Bạch Ngưng Băng rúng động tâm can! Chưa một ai nhìn thấu hắn đến tận cùng như thế. Hắn lùi lại nhìn ngươi đầy kiêng dè và tò mò. Tâm cơ +2.';
          }
          fight('bai',{after:'bai'});
          return 'Nhưng kiếp này sát ý của hắn quá nặng! Bí mật bị vạch trần càng khiến hắn muốn giết ngươi diệt khẩu!';
        }
      },
      quyet_chien:{
        talk:[
          ['','Ngươi cười lạnh rút cổ, chân nguyên dồn vào lòng bàn tay: "Muốn thử xem thú vị thế nào sao? Đao kiếm không có mắt, chớ hối hận!"'],
          ['bai','Tốt! Khí phách lắm! Rất hợp ý ta!']
        ],
        eff:()=>{
          meet('bai');
          const tomo=(S.var||{}).bai!=='satý';
          fight('bai',{after:'bai',spare:tomo?.3:0,spareT:'Bạch Ngưng Băng thu kiếm: "Khá lắm! Hôm nay dừng ở đây. Lần sau hãy cho ta thấy nhiều hơn nữa!"'});
          return tomo?'Bạch Ngưng Băng mỉm cười điên cuồng, rút băng đao nghênh chiến!':'Bạch Ngưng Băng tràn ngập sát ý, bão tuyết cuốn phăng cây cối!';
        }
      },
      lui_buoc:{
        talk:[
          ['','Ngươi phán đoán chênh lệch tu vi Nhất/Nhị chuyển so với Tam chuyển đỉnh phong, lập tức thả khói xoay người lao xuống sườn dốc!']
        ],
        check:['satphat',11],
        okGo:'lui_ok',failGo:'lui_fail'
      },
      lui_ok:{
        talk:[
          ['','Ngươi luồn lách qua khe đá bụi rậm biến mất. Bạch Ngưng Băng đứng trên tảng đá nhìn theo, khóe môi khẽ nhếch: "Chạy nhanh đấy... nhưng núi này nhỏ lắm."']
        ],
        eff:()=>{meet('bai');return 'Thoát thân an toàn khỏi tầm mắt Bạch Ngưng Băng!';}
      },
      lui_fail:{
        talk:[
          ['','Băng tuyết đóng cứng lối đi sau lưng. Bạch Ngưng Băng đã xuất hiện ngay trước mặt: "Chưa giao lưu xong đã vội đi đâu?"']
        ],
        eff:()=>{meet('bai');fight('bai',{after:'bai'});return 'Đường lui bị chặn đứng, buộc phải rút cổ nghênh chiến!';}
      }
    }
  }
},

c_lang1:{canon:1,title:'Lang triều',hint:'Lang triều bắt đầu',
  post:()=>{if(EV.npc_pc_3.cond())S.evq.push('npc_pc_3')},
  text:()=>'Đêm đó, tiếng sói tru át cả tiếng gió. Lang triều ập đến. Tộc trưởng ra lệnh: mọi Cổ sư lên tường trại.'+(S.f.hungPlot?' Ngươi đã đánh với bầy sói này trước, biết chúng hay vòng ra sau đội hình.':'')+(S.f.soiCuop?' Ngươi còn nhớ mùi huyết khí đã dụ bầy sói hôm trước. Đêm nay chúng quay lại, đông gấp trăm.':'')+(S.ngo>=9?((S.var||{}).lang==='tay'?' Tiếng tru vọng về từ phía tây dày đặc hơn hẳn.':' Tiếng tru dồn về phía cổng bắc.'):'')+(S.chuyen<2?' Ngươi chưa đạt Nhị chuyển nên bị xếp vào đội cảm tử.':''),
  choices:()=>[
    ...(mem('langtrieu')?[{t:'Theo ký ức, dồn người giữ cổng bắc từ trước',mem:'langtrieu',tag:'chinh',eff:()=>{S.danh+=8;
      if(!varShifted('lang')){fight('dlbay',{after:'lang',flee:false,mod:langMod()*.8});return 'Sói dồn về cổng bắc, đúng như ký ức. Tường đã chắn sẵn.'}
      fight('dlbay',{after:'lang',flee:false,mod:langMod()*1.15});return 'Sói không tới cổng bắc. Chúng tràn qua góc tây, nơi ngươi vừa rút người đi.'}}]:[]),
    {t:'Giữ cổng chính cùng tộc nhân',tag:'chinh',eff:()=>{S.danh+=10;fight('dlbay',{after:'lang',flee:false,mod:langMod()*.9});return 'Ngươi đứng vào hàng đầu. Hai bên là tộc nhân, sói không vây được ngươi.'}},
    {t:'Xin trấn giữ góc tây, nơi sói ít hơn',canon:1,check:['tamco',12],
      ok:()=>{if((S.var||{}).lang==='tay'){fight('dlbay',{after:'lang',flee:false,mod:langMod()*1.15});return 'Kiếp này sói không đi đường cũ. Góc tây chính là mũi nhọn của lang triều.'}fight('dlbay',{after:'lang',flee:false,mod:langMod()*.9});return 'Góc tây quả nhiên ít sói.'},
      fail:()=>{fight('dlbay',{after:'lang',flee:false,mod:langMod()*1.1});return 'Góc tây là nơi tường thấp nhất. Sói tràn vào như nước.'}},
    {t:'Nhân lúc hỗn loạn, xử lý đối thủ Mạc gia',tag:'ma',dao:15,drift:6,eff:()=>{S.stones+=40;S.susp+=10;fight('dlbay',{after:'lang',flee:false,mod:langMod()*.85});return 'Giữa bóng tối, một tên Mạc gia "bị sói cắn chết". Túi thạch của hắn giờ là của ngươi (+40). Ngươi đứng sau lưng đám đông, chỉ đánh những con sói lọt qua.'}},
  ]},

c_lang2:{canon:1,title:'Hàn khí giữa lang triều',hint:'Thanh Thư và Bạch Ngưng Băng',cond:()=>!S.f.tideDone,
  who:'thanhthu',
  // Gộp lang triều (PR-5): sau cảnh này, Lang Vương thành đại sự còn chờ của chính tuần này; hết việc thì nó công trại
  post:()=>{if(!S.f.tideDone&&EV.c_lang3)S.pend='c_lang3'},
  scene:{
    start:'tuyet_lang',budget:2,
    nodes:{
      tuyet_lang:{
        talk:()=>[
          ['','Đêm thứ mười của lang triều. Tuyết rơi giữa mùa hè. Hàn khí Bắc Minh Băng Phách Thể cắn trả, Bạch Ngưng Băng phát cuồng, băng tiễn giết cả sói lẫn người.'],
          ['','Cổ Nguyệt Thanh Thư, con nuôi của tộc trưởng, đứng chắn trước đám tộc nhân bị thương. Trong tay hắn là Mộc Mị Cổ, cấm cổ đổi sinh mệnh lấy sức mạnh.'],
          ...((S.rel.thanhthu||0)>=20?[['thanhthu','Phương Nguyên, dẫn mọi người lui. Đừng ngoái lại.']]:[['thanhthu','Tất cả lui ra sau ta!']]),
          ['bai','Ha ha ha! Lạnh quá... lạnh quá! Ai cũng được, đánh với ta!']
        ],
        choices:()=>[
          {t:'Nhìn kỹ cách Bạch Ngưng Băng ra đòn',stay:1,flag:'soi_bai',say:'Mỗi lần băng tiễn rời tay, hắn khựng lại nửa nhịp, ngón tay tím tái. Hàn khí đang giết chính hắn: sau mỗi đòn là một khe hở.'},
          {t:'Nhìn Thanh Thư',stay:1,flag:'soi_tt',say:()=>(S.rel.thanhthu||0)>=30?'Thanh Thư nắm Mộc Mị Cổ đến trắng bệch cả đốt tay. Hắn chưa muốn dùng. Hắn đang chờ một lý do để không phải dùng.':'Thanh Thư đã quyết. Ánh mắt ấy ngươi từng thấy ở năm trăm năm trước, trên mặt những kẻ biết mình sắp chết.'},
          {t:'Đứng sau quan sát, chờ thời',tag:'ma',canon:1,dao:10,go:'cho_thoi'},
          {t:'Xông lên cùng Thanh Thư, không để hắn phải dùng cấm cổ',tag:'chinh',drift:12,go:'xong_len'},
          {t:'Đánh vào nửa nhịp hàn khí khựng lại',hidden:'soi_bai',tag:'chinh',drift:12,go:'danh_han'},
          {t:'Giữ tay Thanh Thư: "Đừng dùng thứ đó. Ta với ngươi đủ."',hidden:'soi_tt',req:()=>(S.rel.thanhthu||0)>=30,reqT:'Cần Thanh Thư tin ngươi (quan hệ 30)',tag:'chinh',drift:12,go:'can_mocmi'},
          {t:'Lợi dụng hỗn loạn đoạt cổ của Thanh Thư',tag:'ma',dao:20,check:['tamco',13],
            ok:()=>{meet('thanhthu');S.f.qingshuDead=1;S.f.baiWeak=1;S.stones+=60;gainGu('trilieu');gainGu('hacthi');gainGu('thachkhieu');S.susp+=10;return 'Khi thụ nhân gục xuống, ngươi là người đầu tiên chạm vào xác hắn. Túi cổ của Thanh Thư giờ là của ngươi. Nguyệt Toàn Cổ đã chết theo chủ. Hiềm nghi +10.'},
            fail:()=>{meet('thanhthu');S.f.qingshuDead=1;S.f.baiWeak=1;S.susp+=30;S.danh-=15;return 'Có người thấy ngươi lục xác Thanh Thư. Cả trại căm phẫn. Hiềm nghi +30.'}},
        ]
      },
      cho_thoi:{
        talk:[
          ['thanhthu','...Cha nuôi, con đi trước.'],
          ['','Thanh Thư nuốt Mộc Mị Cổ. Da hắn nứt thành vỏ cây, rễ đâm xuống tuyết. Thụ nhân khổng lồ ôm chặt Bạch Ngưng Băng, mặc băng tiễn xuyên qua thân mình.'],
          ['','Khi tiếng gào cuối cùng tắt, chỉ còn một cái cây đứng giữa tường trại.']
        ],
        eff:()=>{meet('thanhthu');S.f.qingshuDead=1;S.f.baiWeak=1;S.stones+=40;gainGu('trilieu');gainGu('thachkhieu',true);return 'Ngươi lặng lẽ nhặt túi cổ hắn đánh rơi (+40 nguyên thạch, Trị Liệu Cổ). Giữa đống đá vỡ còn một con cổ vuông như viên xúc xắc, xám trắng: Thạch Khiếu Cổ. Ngươi luyện hóa nó, cất vào ngực. Bạch Ngưng Băng bị thương nặng.'}
      },
      xong_len:{
        talk:[['','Ngươi lao vào bão tuyết. Thanh Thư khựng lại, rồi cất Mộc Mị Cổ đi.'],['thanhthu','Ngươi điên rồi! ...Được, cùng đánh!']],
        eff:()=>{meet('thanhthu');fight('bai',{after:'cuuthanhthu',flee:false,mod:.7,spare:.25,spareAfter:'cuuthanhthu_hong',spareT:'Ngươi ngã xuống tuyết. Thanh Thư lao tới kéo ngươi ra sau lưng, rồi lặng lẽ rút Mộc Mị Cổ.'});return ''}
      },
      danh_han:{
        talk:[['','Ngươi không đỡ băng tiễn. Ngươi đếm. Một đòn, khựng. Hai đòn, khựng. Tới đòn thứ ba, nguyệt nhận của ngươi đã đợi sẵn ở khe hở.'],['bai','...Ngươi nhìn ra rồi à? Thú vị!']],
        eff:()=>{meet('thanhthu');fight('bai',{after:'cuuthanhthu',flee:false,mod:.55,spare:.3,spareAfter:'cuuthanhthu_hong',spareT:'Khe hở khép lại nhanh hơn ngươi tính. Thanh Thư lao tới kéo ngươi ra sau lưng, rồi lặng lẽ rút Mộc Mị Cổ.'});return ''}
      },
      can_mocmi:{
        talk:[['thanhthu','Phương Nguyên... ngươi chắc chứ?'],['','Hắn nhìn ngươi rất lâu, rồi cất Mộc Mị Cổ vào ngực áo. Dây leo từ tay hắn quấn lấy chân Bạch Ngưng Băng, mở đường cho nguyệt nhận của ngươi.']],
        eff:()=>{meet('thanhthu');rel('thanhthu',10);fight('bai',{after:'cuuthanhthu',flee:false,mod:.6,spare:.3,spareAfter:'cuuthanhthu_hong',spareT:'Ngươi ngã xuống tuyết. Thanh Thư nhìn ngươi, thở dài, rồi rút Mộc Mị Cổ.'});return ''}
      },
    }
  }},

c_lang3:{canon:1,title:'Lang Vương',hint:'Lôi Quan Lang Vương',cond:()=>!S.f.tideDone,
  text:()=>'Vạn lang vương Lôi Quan Lang đích thân công trại. Hai gia lão Tam chuyển đã ngã. Sấm sét rạch ngang trời. Gia lão còn sống chuyền tay nhau túi linh dược cuối cùng.',
  choices:[
    {t:'Liều chết với Lang Vương',tag:'chinh',eff:()=>{langRally();S.f.fightKing=1;fight('langvuong',{after:'lang3',flee:false,mod:langMod(),spare:.2,spareAfter:'lang3_hong',spareT:'Lôi Quang đánh ngươi văng khỏi tường trại. Trước khi Lang Vương kịp lao tới, hai gia lão cùng lúc chắn trước mặt ngươi.'});return 'Ngươi xông thẳng vào tâm bão.'}},
    {t:'Để các gia lão đối phó, ngươi dọn sói lẻ',canon:1,check:['tamco',13],
      ok:()=>{langRally();fight('loiquan',{after:'lang3',flee:false,mod:langMod()});return 'Ngươi chọn trận đánh mình thắng được.'},
      fail:()=>{langRally();S.f.fightKing=1;fight('langvuong',{after:'lang3',flee:false,mod:langMod(),spare:.2,spareAfter:'lang3_hong',spareT:'Lôi Quang đánh ngươi văng khỏi tường trại. Trước khi Lang Vương kịp lao tới, hai gia lão cùng lúc chắn trước mặt ngươi.'});return 'Lang Vương đổi hướng, lao thẳng về phía ngươi.'}},
  ]},

c_luancong:{canon:1,title:'Sơn trại hoang tàn',hint:'Sau lang triều',cond:()=>S.f.tideDone,
  text:()=>'Lang triều tan. Sơn trại hoang tàn, nguyên tuyền cạn kiệt, trợ cấp từ nay giảm hẳn.'+(S.f.qingshuDead?' Tộc trưởng Cổ Nguyệt Bác đứng lặng trước gốc cây mọc lên từ xác con nuôi.':'')+(S.f.qingshuAlive?' Thanh Thư còn sống nhờ ngươi. Cả trại nhìn ngươi bằng ánh mắt khác.':'')+(S.f.fightKing?' Tin ngươi đối đầu Lang Vương đã truyền khắp trại.':''),
  post:()=>{if(!S.f.baolienSeen){S.f.baolienSeen=1;later('c_baolien',0,1);later('c_muon',1,1)}},
  choices:()=>[
    {t:'Vào kho gia tộc chọn Đâu Suất Hoa',canon:1,req:()=>!hasGu('dausuat'),reqT:'Đã có Đâu Suất Hoa',eff:()=>{gainGu('dausuat');return 'Giữa đống cổ tầm thường có một cây thảo cổ Tam chuyển đỏ như đèn lồng, ba lá mập chỉ ba hướng: Đâu Suất Hoa. Chứa được thức ăn cho cổ, cất được cả nguyên thạch. Ngươi chọn ngay.'}},
    {t:'Nhận 60 nguyên thạch',eff:()=>{S.stones+=60;return '+60 nguyên thạch.'}},
    {t:'Nhận một con Ngọc Bì Cổ',eff:()=>{gainGu('ngocbi');return 'Nhận Ngọc Bì Cổ.'}},
    {t:'Xin Xích Thiết Xá Lợi Cổ',need:{danh:50},eff:()=>{gainGu('xaloi2');return 'Tộc trưởng gật đầu. Nhận Xích Thiết Xá Lợi Cổ.'}},
    {t:'Xin Nguyệt Nghê Thường của học đường',req:()=>S.danh>=35,reqT:'Cần danh vọng 35',eff:()=>{gainGu('nguyetnghe');return 'Học đường gia lão trao cho ngươi dải lụa dệt từ nguyệt quang. Nhận Nguyệt Nghê Thường.'}},
    ...(S.f.qingshuDead?[{t:'Đêm khuya, đào hạt cổ dưới gốc cây Thanh Thư hóa thành',tag:'ma',dao:10,drift:4,eff:()=>{S.susp+=12;later('q_tocnghi',2,4);gainGu('mokmi');return 'Giữa rễ cây còn một con cổ xanh thẫm đang ngủ: Mộc Mị Cổ, cấm cổ đã nuốt sinh mệnh Thanh Thư. Hiềm nghi +12.'}}]:[]),
  ]},

// Canon VN 162–189: dưới nguyên tuyền Cổ Nguyệt có một gốc Thiên Nguyên Bảo Liên chưa hiện thực thể. Phương Nguyên lén đổ nguyên thạch nuôi nó, đợi lúc sơn trại sụp đổ thì đoạt.
c_baolien:{title:'Thiên Nguyên Bảo Liên',hint:'Bí mật nguyên tuyền',
  text:()=>'Nguyên tuyền cạn sau lang triều. Nhìn qua vách thủy tinh dưới đáy, ngươi thấy một bóng sen mờ nhạt đang ngủ: Thiên Nguyên Bảo Liên. Nó sinh ra nguyên thạch, lên Lục chuyển còn quý không kém Xuân Thu Thiền. Muốn nó hiện thực thể thì phải đổ nguyên thạch vào, và nếu phế nguyên tuyền thì không bao giờ trồng lại được.',
  choices:()=>[
    {t:'Lén đổ nguyên thạch nuôi Bảo Liên, chờ ngày sơn trại sụp đổ thì đoạt',canon:1,tag:'ma',dao:8,eff:()=>{const n=Math.min(S.stones,40);S.stones-=n;S.f.baolien=1;return `Ngươi thả ${n} nguyên thạch xuống nước. Bóng sen rõ thêm một chút. Ngươi nhớ kỹ chỗ này.`}},
    {t:'Báo cho tộc trưởng',tag:'chinh',drift:8,eff:()=>{S.danh+=10;S.stones+=30;return 'Tộc trưởng Cổ Nguyệt Bác sững người, rồi thưởng ngươi 30 nguyên thạch và dặn giữ kín. Bảo Liên giờ là của gia tộc.'}},
    {t:'Để đó',eff:()=>'Ngươi quay đi. Có những thứ chưa đến lúc chạm vào.'},
  ]},

// Canon VN 128–129: lời khắc trên cửa động Hoa Tửu cảnh báo con rết vàng, chỉ cách dùng Địa Thính tránh họa
c_kimngo:{title:'Lời khắc trên cửa đá',hint:'Rết vàng trong động',cond:()=>!hasGu('cuxikimngo'),
  text:()=>'Một nhánh động Hoa Tửu mới lộ ra sau trận tuyết. Trên cửa đá khắc: "Kim ngô trong động là họa sát thân, dùng địa thính tránh được hung tai." Trong bóng tối vang lên tiếng lách cách thưa thớt: một con rết đang bò.',
  choices:()=>[
    {t:'Dùng Địa Thính Nhục Nhĩ Thảo nghe đường nó bò, đón đầu luyện hóa',canon:1,req:()=>hasGu('diathinh'),reqT:'Cần Địa Thính Nhục Nhĩ Thảo',check:['tamco',9],bonus:()=>S.chuyen>=2?4:0,
      ok:()=>{S.f.hsKimngo=1;gainGu('cuxikimngo');return 'Tai thịt nghe rõ từng nhịp chân. Ngươi đón nó ở khúc quanh, rót chân nguyên luyện hóa trước khi nó kịp há hai hàng răng cưa: Cứ Xỉ Kim Ngô, Rết Vàng Răng Cưa.'},
      fail:()=>{S.hp-=25;later('c_kimngo',2,3);return 'Ngươi nghe chậm một nhịp. Răng cưa vàng xẻ một đường trên vai rồi rút vào vách. Khí huyết −25. Nó vẫn còn trong động.'}},
    {t:'Không có tai nghe đường, liều mò vào',check:['satphat',15],bonus:()=>S.wine>=1?5:0,
      ok:()=>{S.f.hsKimngo=1;gainGu('cuxikimngo');return 'Ngươi dùng rượu dụ nó ra, luyện hóa lúc nó còn say: Cứ Xỉ Kim Ngô.'},
      fail:()=>{S.hp-=40;return 'Con rết dài mấy trượng quật ngươi văng khỏi cửa động. Khí huyết −40.'}},
    {t:'Đánh dấu cửa động, để sau',eff:()=>{later('c_kimngo',3,4);return 'Ngươi lấp đá che cửa.'}},
  ]},

// Canon VN 155 "Mượn": lên gia lão, mượn nguyên thạch và Tịnh Thủy cổ của khố phòng để hợp luyện Thiên Bồng
c_muon:{title:'Mượn',hint:'Mượn khố phòng',cond:()=>!hasGu('thienbong'),
  text:()=>'Sau lang triều, gia tộc thiếu người. Kẻ sống sót có công được ghi chiến công, mở kho bí phương, được mượn nguyên thạch. Ngươi tới gặp lão gia lão giữ khố phòng.'+(hasGu('bachngoc')?' Bạch Ngọc Cổ trong không khiếu chỉ còn thiếu một con cổ phòng ngự hành thủy là thành Thiên Bồng.':''),
  choices:()=>[
    {t:'Mượn nguyên thạch và một con Tịnh Thủy cổ, ghi giấy nợ, hợp luyện Thiên Bồng',canon:1,tag:'ma',dao:5,req:()=>hasGu('bachngoc')||hasGu('ngocbi')||hasGu('bachthi'),reqT:'Cần Bạch Ngọc, Ngọc Bì hoặc Bạch Thỉ',eff:()=>{
      ['bachngoc','ngocbi','bachthi'].forEach(k=>{if(hasGu(k))loseGuQ1(k)});
      gainGu('thienbong');S.f.noKho=1;S.danh-=5;rel('mactran',-10);
      return 'Lão gia lão tức run râu, nhưng tộc quy là tộc quy. Ngươi hợp luyện liền mấy lượt trong một đêm. Quầng sáng trong nổi giữa không trung: Thiên Bồng Cổ, giáp hư ảo trắng óng. Giấy nợ thì để đó.'}},
    {t:'Chỉ mượn nguyên thạch',eff:()=>{S.stones+=50;S.f.noKho=1;return 'Lão đếm cho ngươi 50 nguyên thạch, mặt như đưa đám.'}},
    {t:'Không mượn',eff:()=>'Ngươi không muốn nợ ai.'},
  ]},

// Đại sự bắt buộc: thần bổ lên núi vì thư Tiên Hạc Môn báo có truyền thừa Huyết Hải; tra án Cổ Kim Sinh chỉ là cớ phụ.
// Nhân quả chỉ ở chỗ: đã giết Kim Sinh thì hắn để mắt tới ngươi (tieHunt); không thì hắn lùng truyền thừa (tieToTomb) và vẫn gặp Huyết Cương.
c_thiet:{canon:1,title:'Thần bổ nhập cuộc',hint:'Thiết Huyết Lãnh',
  post:()=>{if(!S.f.killedJKS&&!S.f.tieGone)S.f.tieToTomb=1;if(S.f.vuongLao){S.susp+=S.f.vuongLao===2?18:10;log(S.f.vuongLao===2?'Thiết Nhược Nam lần ra vụ cả nhà Vương lão hán bị giết, và dấu vết dẫn về phía ngươi. Hiềm nghi +18.':'Lão Vương đã kể với Thiết Nhược Nam về gã học trò mua tấm bản đồ. Hiềm nghi +10.','danger')}},
  who:'tiexueleng',
  scene:{
    start:'than_bo',budget:2,
    nodes:{
      than_bo:{
        talk:()=>[
          ['','Thương đội Cổ gia quay lại. Đi cùng họ là thần bổ Thiết Huyết Lãnh của Thiết gia, Ngũ chuyển, và con gái hắn, Thiết Nhược Nam.'],
          ['','Tiên Hạc Môn gửi thư cho Thiết gia: trên Thanh Mao Sơn có dấu vết truyền thừa Huyết Hải. Thần bổ tới vì chuyện đó. Vụ Cổ Kim Sinh chỉ là cái cớ để lên núi.'],
          ...(S.f.killedJKS?[['tiexueleng','Một thiếu gia Cổ gia biến mất trên núi của các ngươi. Ta không cần ai giải thích. Ta chỉ cần nhìn.'],['','Ánh mắt hắn lướt qua đám thiếu niên, dừng trên người ngươi một nhịp.']]
            :jksIs('escaped')?[['kimsinh','Thần bổ đại nhân, chính là hắn! Hắn phục kích ta ở khe đá!'],['tiexueleng','Ngươi còn đứng đây mà kể được, tức là chưa ai chết. Án phục kích, ta ghi lại.'],['','Hắn liếc ngươi một cái rồi quay sang chuyện Huyết Hải. Nhưng tên ngươi đã nằm trong sổ.']]
            :[['tiexueleng','Huyết đạo ở đâu thì máu chảy ở đó. Ai thấy dấu vết lạ, báo ta.'],['','Ngươi không dính gì tới Cổ Kim Sinh. Nhưng một thần bổ Ngũ chuyển đi săn truyền thừa Huyết Hải trên núi là chuyện chẳng lành.']]),
          ...(mem('tiexue')?[['','Ký ức kiếp trước: hắn truy án bằng dấu vết máu và lời khai mâu thuẫn.']]:[])
        ],
        choices:()=>[
          {t:'Quan sát cách thần bổ tra án',stay:1,flag:'soi_thiet',say:'Hắn không hỏi ai. Hắn nhìn giày, nhìn móng tay, nhìn ai tránh ánh mắt hắn. Nhược Nam đi sau, ghi chép tất cả. Muốn qua mặt hắn thì phải qua mặt cô gái kia trước.'},
          {t:'Giữ bình tĩnh, sống như thường',canon:1,go:'binh_than'},
          {t:'Xin tộc trưởng bảo lãnh: chính ngươi đã vạch trần Kim Sinh lừa tộc nhân',need:{chose:'c_kimsinh:vach_tran',t:'Cần đã vạch trần trò lừa của Cổ Kim Sinh'},tag:'chinh',
            eff:()=>{meet('tiexueleng');meet('nhuocnam');rel('toctruong',5);S.susp=Math.max(0,S.susp-20);return 'Tộc trưởng Cổ Nguyệt Bác đích thân nói với thần bổ: đứa trẻ này từng đứng ra bênh tộc nhân trước mặt Cổ gia. Thiết Huyết Lãnh gạch tên ngươi khỏi sổ. Hiềm nghi −20.'}},
          {t:'Tiếp cận Thiết Nhược Nam dò la',go:'do_la'},
          ...(S.f.killedJKS?[{t:'Xóa nốt dấu vết còn sót ở khe đá',check:['ngo',12],bonus:()=>S.sc&&S.sc.flags.soi_thiet?3:0,
            ok:()=>{meet('tiexueleng');meet('nhuocnam');S.f.tieHunt=1;S.susp=Math.max(0,S.susp-10);return 'Ngươi xóa sạch vết máu cuối cùng trên đá. Hiềm nghi −10.'},
            fail:()=>{meet('tiexueleng');meet('nhuocnam');S.f.tieHunt=1;S.susp+=20;return 'Ngươi vừa đến khe đá thì thấy bóng Thiết Nhược Nam. Nàng đã thấy ngươi. Hiềm nghi +20.'}}]:[]),
          ...((S.f.hs||0)>=5||S.f.huyethai?[{t:'Để một vệt huyết văn "tình cờ" lọt vào mắt thần bổ',tag:'ma',drift:8,go:'nghi_binh'}]:[]),
        ]
      },
      binh_than:{
        talk:[['','Ngươi vẫn đi học, vẫn tu luyện, vẫn chào gia lão như mọi ngày.']],
        eff:()=>{meet('tiexueleng');meet('nhuocnam');if(S.f.killedJKS){S.f.tieHunt=1;S.susp+=15;return 'Nhưng vòng vây đã bắt đầu. Hiềm nghi +15, và sẽ tăng dần mỗi tuần.'}if(jksIs('escaped')){S.susp+=15;return 'Thần bổ ghi tên ngươi vì lời tố của Cổ Kim Sinh. Hiềm nghi +15.'}return ''}
      },
      do_la:{
        talk:[['nhuocnam','Ngươi là ai? Cha ta không cho ta nói chuyện với người trong trại.'],['','Nàng nói vậy, nhưng không bỏ đi.']],
        check:['tamco',13],bonus:()=>S.sc&&S.sc.flags.soi_thiet?3:0,okGo:'do_la_ok',failGo:'do_la_lo'
      },
      do_la_ok:{
        talk:[['nhuocnam','...Cha ta nói kẻ giết người luôn quay lại chỗ cũ. Ông ấy đang chờ ở khe đá.']],
        eff:()=>{meet('tiexueleng');meet('nhuocnam');rel('nhuocnam',15);S.f.tieIntel=1;if(S.f.killedJKS)S.f.tieHunt=1;return 'Nhược Nam ngây thơ hơn cha nàng nhiều. Ngươi biết được cha nàng đang tìm gì.'}
      },
      do_la_lo:{
        talk:[['nhuocnam','Ngươi hỏi nhiều quá. Ta sẽ kể với cha.']],
        eff:()=>{meet('tiexueleng');meet('nhuocnam');if(S.f.killedJKS)S.f.tieHunt=1;S.susp+=10;return 'Thiết Huyết Lãnh ghi tên ngươi vào sổ. Hiềm nghi +10.'}
      },
      nghi_binh:{
        talk:[['','Ngươi nhớ thông đạo huyết văn sau bể đá ngầm. Một mảnh đá dính huyết văn được đặt đúng chỗ thần bổ sẽ đi qua.'],['tiexueleng','...Huyết đạo? Trên núi này?'],['','Hắn quay người đi về phía hậu sơn. Án một thiếu gia mất tích bỗng nhỏ đi rất nhiều.']],
        eff:()=>{meet('tiexueleng');meet('nhuocnam');S.f.tieToTomb=1;S.f.tieHunt=0;S.susp=Math.max(0,S.susp-30);return 'Thần bổ đổi mục tiêu sang lăng mộ. Hiềm nghi −30.'}
      },
    }
  }},

c_huyetdong:{canon:1,title:'Lăng mộ Cổ Nguyệt Nhất Đại',hint:'Huyết động',
  text:()=>((S.f.hs||0)>=5?'Tầng sâu nhất của động Hoa Tửu không phải ngõ cụt. Sau bể đá ngầm là thông đạo phong ấn bằng huyết văn, dẫn xuống lăng mộ bí mật của thủy tổ Cổ Nguyệt Nhất Đại.':'Dư chấn sau lang triều làm sạt vách núi sau động Hoa Tửu, lộ ra một thông đạo đỏ sẫm dẫn xuống lăng mộ của thủy tổ Cổ Nguyệt Nhất Đại.')+' Huyết khí nồng nặc. Thủy tổ của Cổ Nguyệt hóa ra là môn đồ một nhánh của Huyết Hải lão tổ.'+((S.var||{}).huyethai==='bay'&&S.ngo>=9?' Máu dưới đáy mộ đang sôi. Cấm chế đã bị ai đó chạm vào trước ngươi.':'')+(mem('huyethai')?' Ngươi nhớ rõ: dưới đáy mộ có Huyết Lô Cổ và một lối thoát ngầm ra khỏi núi.':''),
  choices:()=>[
    {t:'Một mình xuống lăng mộ',tag:'ma',canon:1,req:()=>S.chuyen>=2,reqT:'Cần Nhị chuyển',eff:()=>{fight('huyetkhoi',{after:'huyethai',mod:(mem('huyethai')?.75:1)*((S.var||{}).huyethai==='bay'?1.35:1)*((S.f.hs||0)>=5?.85:1)});return (S.var||{}).huyethai==='bay'?'Cấm chế đã tỉnh. Huyết khôi lần này mạnh hơn nhiều.':'Ngươi bước xuống bậc đá ướt máu.'}},
    ...(mem('huyethai')?[{t:'Theo ký ức, đi thẳng qua cửa sinh',mem:'huyethai',tag:'ma',req:()=>S.chuyen>=2,reqT:'Cần Nhị chuyển',eff:()=>{
      if(!varShifted('huyethai')){fight('huyetkhoi',{after:'huyethai',mod:.7});return 'Cửa sinh vẫn ở chỗ cũ. Huyết khôi chỉ kịp ngưng một nửa thân thể.'}
      fight('huyetkhoi',{after:'huyethai',mod:1.15});return 'Cấm chế đã tỉnh từ trước. Cửa sinh trong ký ức giờ là cửa tử.'}}]:[]),
    {t:'Báo cho gia tộc',tag:'chinh',drift:10,eff:()=>{S.danh+=15;S.stones+=40;return 'Gia tộc phong tỏa lăng mộ. Ngươi được thưởng 40 nguyên thạch, danh vọng +15.'}},
    {t:'Lấp cửa, coi như chưa thấy',eff:()=>{S.tamco++;return 'Có những thứ chưa đến lúc chạm vào. Tâm cơ +1.'}},
  ]},

c_thietvay:{canon:1,title:'Vòng vây siết chặt',hint:'Thiết Huyết Lãnh truy án',cond:()=>S.f.tieHunt&&!S.f.tieGone,
  who:'tiexueleng',
  scene:{
    start:'truoc_cua',budget:1,
    nodes:{
      truoc_cua:{
        talk:()=>[
          ['','Thiết Huyết Lãnh lần tới đúng khe đá nơi Cổ Kim Sinh bỏ mạng. Chiều nay hắn đứng trước cửa nhà ngươi, không nói một lời.'],
          ...(S.f.tieIntel?[['','Nhờ Nhược Nam, ngươi biết hắn vẫn chưa có chứng cứ.']]:[]),
          ['tiexueleng','Ta hỏi một lần. Đêm Cổ Kim Sinh mất tích, ngươi ở đâu?']
        ],
        choices:()=>[
          {t:'Nhìn tay hắn',stay:1,flag:'soi_dao',say:'Tay hắn không đặt trên chuôi đao. Hắn đang hỏi, chưa phải đang bắt. Chối khéo thì còn đường.'},
          {t:'Để lộ lối vào lăng mộ Nhất Đại cho hắn',canon:1,req:()=>S.f.huyethai,reqT:'Cần đã vào lăng mộ',eff:()=>{S.f.tieToTomb=1;S.susp=Math.max(0,S.susp-30);learn('tiexue');return 'Thần bổ ngửi thấy mùi huyết đạo nồng nặc hơn cả một vụ án mạng. Hắn bỏ ngươi lại, đi thẳng xuống lăng mộ.'}},
          {t:'Chối bỏ đến cùng',check:['tamco',17],bonus:()=>(S.f.tieIntel?5:0)+(mem('tiexue')?6:0)+(S.sc&&S.sc.flags.soi_dao?3:0),
            ok:()=>{S.susp+=5;learn('tiexue');return 'Hắn nhìn ngươi rất lâu, rồi quay đi. Chưa phải lúc.'},
            fail:()=>{learn('tiexue');fight('tiexueleng',{after:'tiefight'});return 'Thiết Huyết Lãnh rút đao. "Không cần chứng cứ nữa."'}},
          {t:'Đổ tội cho Hùng gia',tag:'ma',dao:10,drift:8,check:['tamco',16],bonus:()=>S.f.tieIntel?4:0,
            ok:()=>{S.f.tieGone=1;S.f.tieFate='left';S.susp=Math.max(0,S.susp-20);learn('tiexue');return 'Chứng cứ giả khớp đến từng chi tiết. Thiết Huyết Lãnh rời sơn trại, đi về phía Hùng gia.'},
            fail:()=>{learn('tiexue');fight('tiexueleng',{after:'tiefight'});return 'Hắn cười lạnh: "Ngươi nghĩ ta là Cổ Phú à?"'}},
          {t:'Qua Nhược Nam, đưa hắn bằng chứng huyết đạo của thủy tổ',tag:'chinh',drift:10,need:{rel:['nhuocnam',15]},req:()=>!!(S.f.huyethai||(S.f.hs||0)>=5),reqT:'Cần đã thấy huyết văn trong động',go:'dong_minh'},
        ]
      },
      dong_minh:{
        talk:[
          ['nhuocnam','Cha, người này có thứ cha cần xem.'],
          ['','Ngươi đặt mảnh đá huyết văn lên bàn. Thiết Huyết Lãnh lật nó trong tay rất lâu.'],
          ['tiexueleng','Huyết Hải lão tổ... Một thiếu gia chết không đáng để ta nhìn thêm. Còn thứ này thì có. Khi nó tỉnh, ngươi đứng cạnh ta.']
        ],
        eff:()=>{S.f.tieAlly=1;S.f.tieToTomb=1;S.f.tieHunt=0;S.susp=Math.max(0,S.susp-30);rel('nhuocnam',10);learn('tiexue');return 'Thần bổ tạm gác vụ án. Hắn sẽ đứng cùng ngươi khi Huyết Cương thức tỉnh. Hiềm nghi −30.'}
      },
    }
  }},

c_nhatdai:{canon:1,title:'Huyết Cương thức tỉnh',hint:'Cổ Nguyệt Nhất Đại',
  who:'nhatdai',
  scene:{
    start:'huyet_cuong',budget:1,
    nodes:{
      huyet_cuong:{
        talk:()=>[
          ['','Máu dưới lăng mộ sôi trào. Cổ Nguyệt Nhất Đại sống dậy thành Huyết Cương.'],
          ['nhatdai','Ba trăm năm! Ba trăm năm ta nuôi các ngươi như nuôi lợn trong chuồng. Đến ngày rồi, con cháu của ta.'],
          ['','Trên trời, vạn con Phi Hạc Mỏ Thiết che kín mây: Hạc Tai. Thiên Hạc Thượng Nhân của Tiên Hạc Môn Trung Châu, sư đệ năm xưa bị Nhất Đại ám toán cướp truyền thừa Huyết Hải, cưỡi Phi Hạc Vương tìm tới đòi nợ.'],
          ...(S.f.tieGone?[['','Trên ngực Huyết Cương còn hằn hai con cổ gia truyền Thiết gia: Trấn Ma Thiết Tác và Phù Để Trừu Tân, hậu thủ Thiết Huyết Lãnh để lại trước khi chết.']]:[]),
          ...((S.f.tieHunt||S.f.tieToTomb)&&!S.f.tieGone?[['tiexueleng',S.f.tieAlly?'Đứng cạnh ta, tiểu tử. Như đã hẹn.':'Lui ra. Thứ này là việc của ta.']]:[])
        ],
        choices:()=>{
          const tie=(S.f.tieHunt||S.f.tieToTomb)&&!S.f.tieGone;
          const al=[S.f.pcAlly&&'Phương Chính',S.f.qingshuAlive&&'Thanh Thư'].filter(Boolean);
          return [
            {t:'Nhìn kỹ ngực Huyết Cương',stay:1,flag:'soi_nd',eff:()=>{S.f.soiNd=1},say:'Huyết Cương mạnh, nhưng mỗi lần gào lên là một dòng máu trào ra từ vết nứt giữa ngực, chỗ quan tài vỡ đã đâm vào. Đánh vào đó.'},
            ...(tie?[
              {t:'Để thần bổ và Huyết Cương đồng quy vu tận',tag:'ma',canon:1,eff:()=>{S.f.tieGone=1;S.f.tieFate='dead_nd';S.f.tieHunt=0;S.susp=Math.max(0,S.susp-40);S.stones+=50;return 'Hai kẻ mạnh nhất Thanh Mao Sơn cùng ngã xuống trong biển máu. Không còn ai truy án. Ngươi nhặt được túi thạch rơi bên xác thần bổ (+50).'}},
              {t:'Liên thủ với Thiết Huyết Lãnh',tag:'chinh',drift:10,eff:()=>{fight('nhatdai',{after:'nhatdai_lienthu',flee:false,mod:(S.f.tieAlly?.45:.55)*(S.sc&&S.sc.flags.soi_nd?.85:1),allies:['tiexueleng']});return 'Thần bổ liếc ngươi, gật đầu. Hai người cùng lao vào Huyết Cương.'}},
            ]:[
              {t:'Đối đầu Huyết Cương',eff:()=>{fight('nhatdai',{after:'nhatdai',flee:false,mod:S.sc&&S.sc.flags.soi_nd?.85:1,spare:.2,spareAfter:'nhatdai_hong',spareT:'Huyết Cương hất ngươi văng vào vách đá như hất một con sâu. Hắn còn bận nuốt máu cả tộc, không buồn quay lại.'});return 'Không ai khác đứng giữa ngươi và thủy tổ.'}},
            ]),
            ...(al.length?[{t:`Gọi ${al.join(' và ')} cùng đánh`,tag:'chinh',go:'dong_minh'}]:[]),
            ...(hasGu('huyetlo')?[{t:'Theo ký ức, dẫn máu Huyết Cương vào lò trước khi hắn tỉnh hẳn',need:{mem:'huyetlo'},tag:'ma',dao:25,check:['tamco',15],bonus:()=>(S.f.hs||0)>=5?3:0,
              ok:()=>{S.f.preLo=1;S.tuchat=Math.max(S.tuchat,80);S.hp=maxHp();S.ess=maxEss();return 'Ngươi biết thủy tổ sẽ tỉnh lúc nào, và biết lò máu cần gì. Huyết Cương còn chưa mở mắt, máu của hắn đã chảy ngược vào Huyết Lô Cổ. Tư chất vọt lên Ất đẳng 80%.'},
              fail:()=>{fight('nhatdai',{after:'nhatdai',flee:false,mod:1.15});return 'Lò máu rung lên quá sớm. Huyết Cương mở mắt, giận dữ vì bị đánh thức.'}}]:[]),
            {t:'Trốn vào thông đạo ngầm, chờ bão qua',req:()=>S.f.huyethai,reqT:'Cần biết lối trong lăng mộ',eff:()=>{S.f.hide=1;return 'Ngươi nép trong thông đạo, nghe tiếng gào thét phía trên suốt một đêm.'}},
            {t:'Bỏ chạy khỏi sơn trại',check:['satphat',15],ok:()=>{S.f.hide=1;return 'Ngươi chạy thoát khỏi vùng máu.'},fail:()=>{fight('nhatdai',{after:'nhatdai',flee:false,mod:.8,spare:.2,spareAfter:'nhatdai_hong',spareT:'Một bàn tay máu quét qua, ngươi lăn xuống dốc. Huyết Cương không đuổi theo con mồi nhỏ.'});return 'Huyết Cương nhìn thấy ngươi. Nó cười.'}},
          ];
        }
      },
      dong_minh:{
        talk:()=>[
          ...(S.f.pcAlly?[['phuongchinh','Ca ca, đệ ở đây!']]:[]),
          ...(S.f.qingshuAlive?[['thanhthu','Lần này đến lượt ta đứng cạnh ngươi.']]:[]),
          ['','Nguyệt nhận, dây leo, tiếng hét. Lần đầu tiên trong năm trăm năm, có người lao vào trận vì ngươi.']
        ],
        eff:()=>{const n=(S.f.pcAlly?1:0)+(S.f.qingshuAlive?1:0)+((S.f.tieHunt||S.f.tieToTomb)&&!S.f.tieGone?1:0);
          fight('nhatdai',{allies:[S.f.pcAlly&&'phuongchinh',S.f.qingshuAlive&&'thanhthu',(S.f.tieHunt||S.f.tieToTomb)&&!S.f.tieGone&&'tiexueleng'].filter(Boolean),after:(S.f.tieHunt||S.f.tieToTomb)&&!S.f.tieGone?'nhatdai_lienthu':'nhatdai',flee:false,mod:Math.max(.4,1-.15*n)*(S.sc&&S.sc.flags.soi_nd?.85:1),spare:.25,spareAfter:'nhatdai_hong',spareT:'Huyết Cương hất văng cả ba người. Các ngươi kéo nhau lăn xuống dốc, còn sống.'});
          return `${n} người cùng ngươi đối đầu thủy tổ.`}
      },
    }
  }},

c_final:{canon:1,title:'Thanh Mao Sơn diệt vong',hint:'Kết cục quyển một',
  post:()=>{if(S.f.baolien&&!hasGu('thiennguyen')){gainGu('thiennguyen',true);log('Giữa hỗn loạn, ngươi lặn xuống nguyên tuyền, phá vách thủy tinh nhổ Thiên Nguyên Bảo Liên. Nguyên tuyền Cổ Nguyệt phế từ đây.','big')}},
  // Giữ đủ mọi lối ra đang có (mỗi lối là một kết cục). Thêm một lượt dò xét: thấy khe nứt băng phía nam thì các đường chạy dễ hơn.
  scene:{
    start:'bang_phong',budget:1,
    nodes:{
      bang_phong:{
        talk:()=>[
          ['','Bạch gia và Hùng gia thừa cơ tập kích. Cổ Nguyệt tộc tan tác trong biển lửa.'],
          ['bai','Phương Nguyên! Ngươi nói đúng... chết rực rỡ mới là sống!'],
          ['','Bạch Ngưng Băng tự bạo Bắc Minh Băng Phách Thể. Một vòng băng trắng lan ra, nuốt cả Thanh Mao Sơn.'],
          ...(hasGu('huyetlo')?[['','Huyết Lô Cổ trong không khiếu rung lên, khát máu đồng tộc.']]:[]),
          ...(S.chuyen<3?[['','Ngươi chưa đạt Tam chuyển. Đường sống rất hẹp.']]:[])
        ],
        choices:()=>{
          const eMod=S.sc&&S.sc.flags.soi_bang?.9:1;
          return [
            {t:'Tìm chỗ băng mỏng nhất',stay:1,flag:'soi_bang',say:'Phía nam, nơi nguyên tuyền cạn, băng đóng chậm hơn. Có một khe nứt đủ cho một người đi qua. Đường chạy nào cũng dễ hơn nếu đi lối đó.'},
            ...(S.f.pcAlly?[{t:'Cùng Phương Chính phá vây, bảo vệ nhau rời núi',tag:'chinh',eff:()=>{fight('baitruonglao',{after:'end_songhung',flee:false,mod:finalMod()*.98*eMod,allies:['phuongchinh']});return 'Hai huynh đệ Phương Nguyên - Phương Chính lưng tựa lưng, nguyệt nhận lam xích hòa quyện chém tan vòng vây!'}}]:[]),
            ...(S.f.qingshuAlive?[{t:'Cùng Thanh Thư bảo vệ tộc nhân thoát khỏi biển lửa và băng giá',tag:'chinh',eff:()=>{fight('baitruonglao',{after:'end_thanhthu',flee:false,mod:finalMod()*.94*eMod,allies:['thanhthu']});return 'Thanh Thư tung dây leo mở đường, ngươi bọc hậu. Tộc nhân hướng về hai người như hai vầng thái dương mới của bộ tộc!'}}]:[]),
            {t:'Nhảy xuống vực, cược Xuân Thu Thiền lần hai dù nó chưa hồi phục',tag:'ma',canon:1,dao:40,need:{gu:'xuanthu'},go:'thien_a'},
            {t:'Tế Huyết Lô Cổ bằng máu tộc nhân, rồi mở đường máu',tag:'ma',dao:40,need:{gu:'huyetlo'},go:'te_lo'},
            ...(S.f.baiAlly&&!hasGu('huyetlo')?[{t:'Cùng Bạch Ngưng Băng xé vòng vây Bạch gia',tag:'ma',eff:()=>{fight('baitruonglao',{after:'end_bai',flee:false,mod:finalMod()*.9,allies:['bai']});return 'Bạch Ngưng Băng quay lưng với chính gia tộc mình. Băng tiễn và nguyệt nhận cùng mở một con đường.'}}]:[]),
            ...(S.f.preLo?[{t:'Mang lò máu đã no rời núi',tag:'ma',eff:()=>{fight('baitruonglao',{after:'end_tienlo',flee:false,mod:finalMod()*.6});return 'Huyết Lô Cổ còn ấm máu thủy tổ. Chân nguyên của ngươi cuồn cuộn như chưa từng có.'}}]:[]),
            ...(mem('bai')&&!S.f.baiAlly&&(S.rel.bai||0)>=20?[{t:'Theo ký ức kiếp trước, bán đường vào trại cho Bạch gia',mem:'bai',tag:'ma',dao:30,check:['tamco',18],bonus:()=>mem('langtrieu')?3:0,
              ok:()=>{fight('baitruonglao',{after:'end_phantoc',flee:false,mod:finalMod()*.9});return 'Ngươi biết đêm nay Bạch gia sẽ tới, và biết cổng nào không ai canh. Ngươi mở cổng cho họ. Gia lão Bạch gia vẫn muốn thử xem kẻ bán tộc có đáng giữ lời hứa không.'},
              fail:()=>{fight('baitruonglao',{after:'end_ma',flee:false,mod:finalMod()*1.15});return 'Gia lão Bạch gia nghe xong liền cười: "Kẻ bán tộc thì giữ lại làm gì?"'}}]:[]),
            {t:'Mở đường máu thoát khỏi núi',tag:'ma',eff:()=>{fight('baitruonglao',{after:'end_ma',flee:false,mod:finalMod()*eMod});return 'Ngươi quay lưng với biển lửa và băng giá.'}},
            {t:'Dẫn tộc nhân còn sống thoát ra',tag:'chinh',eff:()=>{fight('baitruonglao',{after:'end_chinh',flee:false,mod:finalMod()*eMod});return 'Ngươi dẫn mấy chục phụ nữ, trẻ em về phía con đường mòn phía đông.'}},
            {t:'Lẻn qua thông đạo ngầm ra khỏi núi',req:()=>S.f.huyethai,reqT:'Cần biết lối trong lăng mộ',check:['tamco',14],bonus:()=>(S.f.hide?4:0)+(S.sc&&S.sc.flags.soi_bang?2:0),
              ok:()=>{S.f.endTunnel=1;S.over='win';S.ending='ma';return 'Thông đạo dẫn ra một khe núi phía nam, xa khỏi vùng băng giá.'},
              fail:()=>{fight('baitruonglao',{after:'end_ma',flee:false,mod:finalMod()});return 'Cửa ra đã bị gia lão Bạch gia chặn trước.'}},
          ];
        }
      },
      te_lo:{art:'scene_blood_skull_refine',
        talk:[['','Ngươi đặt Huyết Lô Cổ giữa biển máu. Máu của cả tộc Cổ Nguyệt, người sống lẫn người chết, chảy ngược vào lò như trăm con suối đỏ.'],['','Không khiếu của ngươi rộng ra từng tấc. Chân nguyên cuồn cuộn: Bính đẳng 44% vọt lên Giáp đẳng 99%. Gia lão Bạch gia chặn lối xuống núi.']],
        eff:()=>{thachKhieuClash();S.tuchat=99;S.danh=0;S.ess=maxEss();S.hp=maxHp();fight('baitruonglao',{after:'end_huyetlo',flee:false,mod:finalMod()*.7});return 'Máu của cả tộc chảy vào lò. Tư chất Giáp đẳng 99%.'}},
      // Xuân Thu Thiền lần hai: chắc chắn thành công (câu "dưới một phần mười" là lời dẫn, không phải xúc xắc)
      thien_a:{
        talk:[
          ['','Ngươi đốt cả tu vi lẫn cổ trùng làm động lực, cược vào con Thiền chưa hồi phục, dưới một phần mười cơ hội.'],
          ['','Con ve vàng vỗ cánh một lần, yếu ớt. Quang âm chỉ lùi một đoạn ngắn: ngươi lại đứng trong lồng máu, Bạch Mi còn quấn quanh người.'],
          ['nhatdai','Bảo Liên đâu? Đưa đây, ta tha cho ngươi làm con cháu tốt.']
        ],
        choices:[{t:'Giả vờ dâng Bảo Liên, rồi dùng Song Trư chi lực ném hắn ra khỏi lồng',go:'thien_b'}]
      },
      thien_b:{
        talk:[
          ['','Nhất Đại vừa cúi xuống, ngươi túm lấy hắn ném văng khỏi lồng máu. Đàn Phi Hạc Mỏ Thiết lao xuống như mưa đá.'],
          ['','Huyết Lô Cổ và cặp Âm Dương Chuyển Thân Cổ còn phong ấn rơi vào tay ngươi. Giữa biển băng, tượng băng Bạch Ngưng Băng vẫn còn một hơi thở.']
        ],
        choices:[{t:'Đánh Âm cổ vào tượng băng, giữ Dương cổ trong tay',go:'thien_c'}]
      },
      thien_c:{
        talk:[
          ['','Âm cổ chui vào tượng băng. Băng tan. Người thở dốc trên tuyết là một thiếu nữ tóc bạc, mắt lam.'],
          ['','Máu tộc nhân chảy vào Huyết Lô. Không khiếu của ngươi rộng ra: tư chất lên chín thành. Gia lão Bạch gia đã tới trước mặt.']
        ],
        eff:()=>{
          S.cicada=S.cicada||{};S.cicada.charge=0;S.rewinds=(S.rewinds||0)+1;
          if(!hasGu('huyetlo'))gainGu('huyetlo',true);gainGu('amduong',true);thachKhieuClash();
          S.tuchat=Math.max(S.tuchat,90);S.danh=0;S.ess=maxEss();S.hp=maxHp();
          fight('baitruonglao',{after:'end_thien2',flee:false,mod:finalMod()*.7});
          return 'Huyết Lô và Âm Dương Chuyển Thân đã trong tay. Mở đường máu rời núi.'}
      },
    }
  }},

x_thamvan:{title:'Thẩm vấn ở từ đường',
  text:()=>'Học đường gia lão triệu ngươi tới từ đường. "Quá nhiều chuyện mờ ám dính tới ngươi, Phương Nguyên."',
  choices:()=>[
    {t:'Biện bạch',check:['tamco',15],ok:()=>{S.susp=55;return 'Gia lão không bắt bẻ được gì. Hiềm nghi giảm xuống 55.'},fail:()=>{fight('gialao',{after:'elder',flee:false});return 'Gia lão đứng dậy. "Vậy để cổ trùng nói thay."'}},
    {t:'Dâng 80 nguyên thạch bịt miệng',req:()=>S.stones>=80,reqT:'Cần 80 nguyên thạch',eff:()=>{S.stones-=80;S.susp=45;return 'Gia lão cất túi thạch. "Lần sau cẩn thận."'}},
    {t:'Ra tay trước',tag:'ma',dao:15,eff:()=>{fight('gialao',{after:'elder',flee:false});return 'Không ai ngờ một học trò dám động thủ trong từ đường.'}},
  ]},

/* ================= ĐỘNG HOA TỬU (theo tầng) ================= */
hs_khe:{title:'Tầng một · Cửa hang',
  text:()=>'Sau núi có một khe đá hẹp, gió lùa ra mùi rượu thoang thoảng. Tửu Trùng thích hầu nhi tửu, thứ rượu khỉ ủ trong hốc cây.'+(mem('hoatuu')?' Ngươi biết rất rõ: sâu bên trong là động phủ Hoa Tửu Hành Giả, chia thành nhiều tầng thử thách.':''),
  choices:()=>[
    {t:'Đặt một vò hầu nhi tửu làm mồi',canon:1,req:()=>S.stones>=5,reqT:'Cần 5 nguyên thạch mua rượu',check:['ngo',9],bonus:()=>(S.f.hsBonus||0)+(mem('hoatuu')?5:0),
      ok:()=>{S.stones-=5;gainGu('tuutrung');S.f.hs=1;return 'Một con sâu trắng mập bò ra, chui vào vò rượu. Ngươi luyện hóa nó: Tửu Trùng!'},
      fail:()=>{S.stones-=5;return 'Tửu Trùng uống cạn vò rượu rồi chui mất. Lần sau cần kiên nhẫn hơn.'}},
    {t:'Để sau',eff:()=>'Ngươi ghi nhớ vị trí khe đá.'},
  ]},
hs_bich:{title:'Tầng hai · Vách đá vôi',
  text:()=>'Sâu hơn là một vách đá vôi trắng. Chữ khắc trên vách là đề thi của Hoa Tửu Hành Giả, lời giải chỉ xuống nền đất dưới chân.',
  choices:[
    {t:'Giải đề trên vách',canon:1,check:['ngo',12],bonus:()=>(S.f.hsBonus||0)+(mem('hoatuu')?5:0),
      ok:()=>{S.f.hs=2;gainGu('bachthi');return 'Ngươi đào đúng chỗ lời giải chỉ. Dưới lớp đất là một con cổ trắng như lợn con: Bạch Thỉ Cổ. Hoa Tửu Hành Giả để sẵn nó cho kẻ có Ngọc Bì, vì hai con hợp luyện thành Bạch Ngọc Cổ.'},
      fail:()=>{S.hp-=12;return 'Đá vôi sụp một mảng, ngươi bị thương (−12 khí huyết). Đề vẫn chưa giải được.'}},
    {t:'Quay về',eff:()=>''},
  ]},
hs_ngam:{title:'Tầng ba · Lòng đất',
  text:()=>'Dưới lòng đất có một khoảnh đất ẩm, mọc một cây Địa Thính Nhục Nhĩ Thảo. Muốn dung hợp nó làm cổ trinh sát, phải tự chặt một bên tai của mình cho nó mọc thay vào.',
  choices:[
    {t:'Tự chặt tai, dung hợp Địa Thính Nhục Nhĩ Thảo',canon:1,dao:6,tag:'ma',eff:()=>{S.hp=Math.max(1,S.hp-20);S.f.hs=3;S.f.noEar=1;gainGu('diathinh');return 'Một nhát dao, máu chảy dài xuống cổ (−20 khí huyết). Tai thịt mọc ra thay chỗ, âm thanh cả ngọn núi ùa vào đầu ngươi.'}},
    {t:'Bỏ qua, đi tiếp xuống dưới',eff:()=>{S.f.hs=3;return 'Ngươi không cần nghe thấy mọi thứ.'}},
  ]},
hs_dong:{title:'Tầng bốn · Bể đá ngầm',
  text:()=>'Bể đá ngầm chứa đầy hũ rượu quý. Giữa bể là bí phương hợp luyện Tứ Vị Tửu Trùng. Những hũ rượu vỡ quanh bể chợt động đậy: trận pháp thủ hộ của Hoa Tửu Hành Giả.',
  choices:()=>[
    {t:'Giải trận pháp',canon:1,check:['tamco',13],bonus:()=>(mem('hoatuu')?10:0)+(S.f.hsBonus||0),
      ok:()=>{fight('tuukhoi',{after:'hoatuu'});return 'Trận pháp tắt, nhưng Tửu Khôi đã tỉnh.'},
      fail:()=>{S.hp-=25;return 'Trận pháp phản kích. Khí huyết −25.'}},
    {t:'Phá bằng sức',check:['satphat',15],
      ok:()=>{fight('tuukhoi',{after:'hoatuu',mod:1.2});return 'Ngươi đập vỡ trận nhãn. Tửu Khôi gầm lên.'},
      fail:()=>{S.hp-=30;return 'Trận pháp không suy suyển. Khí huyết −30.'}},
    {t:'Quay về chuẩn bị thêm',eff:()=>''},
  ]},
hs_mo:{title:'Tầng sâu nhất · Thông đạo huyết văn',
  text:()=>S.turn<22?'Sau bể đá là một thông đạo bị phong ấn bằng huyết văn đỏ sẫm. Phong ấn còn quá mạnh, chưa thể phá. Có lẽ phải đợi thứ gì đó làm nó lung lay.':'Huyết văn trên phong ấn đã nhạt đi sau những chấn động của lang triều. Thông đạo này dẫn xuống lăng mộ của thủy tổ Cổ Nguyệt.',
  choices:()=>[
    ...(S.turn<22?[{t:'Ghi nhớ rồi quay về',eff:()=>'Ngươi đánh dấu chỗ này.'}]
      :[{t:'Phá phong ấn, ghi nhớ lối vào',eff:()=>{S.f.hs=5;return 'Phong ấn vỡ. Ngươi biết lối vào lăng mộ trước bất kỳ ai.'}}]),
    // Kỳ trân Hoa Tửu Hành Giả để lại bên bể đá
    ...(!S.f.hsCuudiep?[{t:'Lục soát mạch nước bên bể đá',check:['ngo',14],bonus:()=>S.f.hsBonus||0,
      ok:()=>{S.f.hsCuudiep=1;gainGu('cuudiep');return 'Nơi mạch nước rỉ ra, một cây cỏ chín lá xanh biếc đang tỏa sinh cơ: Cửu Diệp Sinh Cơ Thảo, kỳ trân Hoa Tửu Hành Giả trồng lại.'},
      fail:()=>{S.f.hsCuudiep=1;gainGu('sinhco');return 'Cây cỏ chín lá đã héo gần hết. Ngươi chỉ cứu được một phiến Sinh Cơ Diệp.'}}]:[]),
    ...(!S.f.hsKimngo?[{t:'Đọc lời khắc trên cửa đá: "kim ngô trong động là họa sát thân, dùng địa thính tránh hung tai". Nghe đường bò của con rết rồi luyện hóa nó',canon:1,req:()=>S.chuyen>=2&&hasGu('diathinh'),reqT:'Cần Nhị chuyển và Địa Thính Nhục Nhĩ Thảo',check:['tamco',12],bonus:()=>S.wine>=1?4:0,
      ok:()=>{S.f.hsKimngo=1;gainGu('cuxikimngo');return 'Tai thịt nghe rõ từng nhịp chân của con rết vàng dài mấy trượng. Ngươi đón nó ở khúc quanh, rót chân nguyên luyện hóa trước khi nó kịp há hai hàng răng cưa: Cứ Xỉ Kim Ngô, Rết Vàng Răng Cưa của Hoa Tửu Hành Giả.'},
      fail:()=>{S.hp-=30;return 'Ngươi nghe chậm một nhịp. Hai hàng răng cưa vàng kim xẻ một đường trên tay ngươi rồi rút vào khe đá. Khí huyết −30.'}}]:[]),
  ]},

/* ================= NGẪU NHIÊN: HỌC ĐƯỜNG ================= */
r_giangbai:{loc:'hocduong',w:3,title:'Giảng đường',
  text:[()=>'Gia lão giảng về cấu trúc không khiếu: quang mạc, bích khiếu, chân nguyên hải.',
    ()=>'Hôm nay gia lão giảng về cách nuôi cổ: mỗi con một món ăn, bỏ đói ba tuần là chết.',
    ()=>'Gia lão giảng chuyện luyện cổ: hợp hai con thành một, thành thì được, bại thì mất cả hai.'],
  choices:[
    {t:'Chăm chú nghe',check:['ngo',10],ok:()=>{S.prog+=20;return 'Mấy chỗ ngươi còn mơ hồ nay đã sáng rõ. Tu vi +20.'},fail:()=>'Toàn chuyện ngươi biết từ năm trăm năm trước.'},
    {t:'Hỏi một câu hóc búa',check:['ngo',14],ok:()=>{S.ngo++;S.danh+=3;return 'Gia lão sững người rồi gật đầu tán thưởng. Ngộ tính +1.'},fail:()=>{S.danh-=2;return 'Gia lão cho rằng ngươi cố tỏ ra hiểu biết. Danh vọng −2.'}},
  ]},
r_pctienbo:{loc:'hocduong',w:2,title:'Phương Chính',
  text:()=>'Phương Chính vừa lên tiểu cảnh giới mới. Bạn học vây quanh tâng bốc. Hắn liếc sang ngươi, vừa đắc ý vừa áy náy.',
  choices:[
    {t:'Chỉ điểm hắn một mẹo điều khiển chân nguyên',tag:'chinh',eff:()=>{rel('phuongchinh',15);S.danh+=3;if(!S.f.pcDoQueued){S.f.pcDoQueued=1;later('q_pcdo',4,8,'!pcHate')}return 'Phương Chính ngơ ngác, rồi mắt sáng lên.'}},
    {t:'Mỉa mai hắn một câu',tag:'ma',eff:()=>{rel('phuongchinh',-15);S.tamco++;return 'Phương Chính đỏ mặt. Hắn sẽ còn nhớ câu này rất lâu.'}},
    {t:'Làm như không thấy, về chỗ ngồi thiền',eff:()=>{S.prog+=8;return 'Tu vi +8.'}},
  ]},
r_thachdau:{loc:'hocduong',w:2,title:'Thách đấu',
  text:()=>'Mạc Bắc chặn ngươi ở hành lang, đòi so tài trước mặt cả lớp.',
  choices:[
    {t:'Nhận lời',eff:()=>{fight('macbac',{after:'duel',scale:1});return 'Bạn học dạt ra thành vòng tròn.'}},
    {t:'Từ chối',eff:()=>{S.danh-=3;return 'Tiếng cười chế giễu sau lưng. Danh vọng −3.'}},
  ]},
r_tangthu:{loc:'hocduong',w:2,title:'Tàng thư các',
  text:()=>'Tàng thư các học đường vắng người. Trên giá có dã sử sơn trại và bút ký luyện cổ.',
  choices:()=>[
    {t:'Đọc dã sử về Hoa Tửu Hành Giả',req:()=>!S.f.hoatuu,reqT:'Đã nhận truyền thừa',eff:()=>{S.f.hsBonus=(S.f.hsBonus||0)+3;return 'Trăm năm trước, ma tu Hoa Tửu Hành Giả trọng thương chạy vào hậu sơn rồi mất tích. Thám hiểm hậu sơn dễ hơn.'}},
    {t:'Đọc bút ký luyện cổ',check:['ngo',12],ok:()=>{S.ngo++;S.f.refineBonus=(S.f.refineBonus||0)+8;return 'Ngộ tính +1. Tỉ lệ luyện cổ +8%.'},fail:()=>'Chữ viết quá tối nghĩa.'},
  ]},
r_cohoanghd:{loc:'hocduong',w:1,title:'Thực hành luyện cổ',
  text:()=>'Buổi thực hành: mỗi học trò được thử luyện hóa một con cổ hoang do học đường bắt về.',
  choices:[
    {t:'Dốc toàn lực luyện hóa',check:['ngo',11],ok:()=>{gainGu(pick(WILD));return 'Luyện hóa thành công, con cổ là của ngươi.'},fail:()=>{S.hp-=10;return 'Cổ hoang phản kháng, ngươi bị cắn một nhát. Khí huyết −10.'}},
    {t:'Nhường lượt cho người khác',tag:'chinh',eff:()=>{S.danh+=3;return 'Danh vọng +3.'}},
  ]},
r_phephai:{loc:'hocduong',w:1,once:1,title:'Mạc gia và Xích gia',
  text:()=>'Trong Cổ Nguyệt, hai phe Mạc gia và Xích gia tranh nhau thế lực. Cả hai đều cho người tới lôi kéo ngươi.',
  choices:[
    {t:'Theo Mạc gia',eff:()=>{S.f.phe='Mạc gia';return 'Mỗi tháng Mạc gia chu cấp thêm 6 nguyên thạch.'}},
    {t:'Theo Xích gia',eff:()=>{S.f.phe='Xích gia';return 'Mỗi tháng Xích gia chu cấp thêm 6 nguyên thạch.'}},
    {t:'Không theo phe nào',eff:()=>{S.tamco++;return 'Đứng ngoài mới thấy rõ ván cờ. Tâm cơ +1.'}},
  ]},

/* ================= NGẪU NHIÊN: SƠN TRẠI ================= */
r_xichthanh:{loc:'trai',w:2,once:1,title:'Bí mật của Xích Thành',
  text:()=>'Đi qua hoa viên Xích gia, ngươi tình cờ thấy Cổ Nguyệt Xích Luyện đang lén truyền chân nguyên cho Xích Thành. Xích Thành vốn chỉ là Bính đẳng, nhưng bị ông nội làm giả thành Ất đẳng để giữ ghế gia lão!'+(mem('xichgia')?' Ngươi đã nắm rõ bí mật này từ kiếp trước.':''),
  choices:()=>[
    {t:'Lộ diện bắt thóp, tống tiền Xích Luyện',tag:'ma',canon:1,check:['tamco',12],bonus:()=>mem('xichgia')?8:0,
      ok:()=>{
        S.f.blackmailXich=1;learn('xichgia');S.stones+=40;rel('xichluyen',-20);
        return 'Xích Luyện mặt xám ngoét, đành chấp nhận mỗi tuần cống nạp 10 nguyên thạch để bịt miệng. Nhận ngay 40 nguyên thạch!';
      },
      fail:()=>{
        rel('xichluyen',-30);S.susp+=15;
        return 'Xích Luyện đe dọa ngược lại ngươi. Ngươi đành tạm lui. Hiềm nghi +15.';
      }},
    {t:'Báo tin cho gia lão Mạc Trần của Mạc gia',tag:'ma',eff:()=>{
      meet('mactran');rel('mactran',30);rel('xichluyen',-40);S.stones+=60;S.danh+=8;
      return 'Mạc Trần vỗ bàn đắc ý, thưởng ngay 60 nguyên thạch để nắm thóp Xích gia!';
    }},
    {t:'Lặng lẽ quan sát, chờ thời cơ',eff:()=>{S.tamco+=2;learn('xichgia');return 'Nắm điểm yếu kẻ khác là con dao găm giấu trong tay áo. Tâm cơ +2.'}}
  ]},

r_tuulau:{loc:'trai',w:2,cond:()=>S.f.tuulau,title:'Tửu lâu gia sản',
  scene:{
    start:'quan_ly',budget:2,
    nodes:{
      quan_ly:{
        talk:[
          ['','Tửu lâu cha mẹ để lại dưới chân núi khách khứa nườm nượp, mùi rượu nếp thơm nồng lan tỏa ra tận đầu ngõ.'],
          ['','Chưởng quầy cúi chào khi thấy ngươi bước vào: "Đại thiếu gia đến chơi! Hôm nay buôn bán rất khá, nhưng đằng kia có gã Cổ sư say mèm đập bàn quát tháo."']
        ],
        choices:[
          {t:'Kiểm tra sổ sách và thu tiền lời hôm nay',stay:1,flag:'soi_so',say:'Sổ sách ghi chép cẩn thận: trừ chi phí mua rượu ủ và gạo, hôm nay tửu lâu thặng dư được 8 nguyên thạch.'},
          {t:'Thu lấy 8 nguyên thạch lợi nhuận hôm nay',hidden:'soi_so',eff:()=>{S.stones+=8;return 'Bỏ túi 8 nguyên thạch lợi nhuận ròng!';}},
          {t:'Xông tới dạy cho gã Cổ sư say rượu một bài học',tag:'ma',go:'danh_say'},
          {t:'Mời gã say một vò rượu ngon, khéo léo dò hỏi tin tức',tag:'chinh',req:()=>S.stones>=3,reqT:'Cần 3 nguyên thạch',go:'moi_ruou'},
          {t:'Lắng nghe khách buôn đàm đạo ở góc quán',go:'nghe_ngong'}
        ]
      },
      danh_say:{
        talk:[
          ['','Ngươi bước tới nắm cổ áo gã say nhấc bổng lên: "Muốn quỵt tiền ở tửu lâu của họ Cổ Nguyệt ta?"'],
          ['cosusay','Thằng ranh con miệng còn hôi sữa... dám động vào lão tử?']
        ],
        fight:{foe:'cosusay',win:'thang_say',flee:'thua_say'}
      },
      thang_say:{
        talk:[
          ['','Ngươi ném gã say lăn lóc ra ngoài đường bụi bặm. Cả tửu lâu vỗ tay rầm rộ, đám thực khách vội vã rút tiền trả sòng phẳng.']
        ],
        eff:()=>{S.stones+=10;S.danh+=4;return 'Dẹp loạn gọn gàng: thu 10 nguyên thạch tiền bồi thường, danh vọng +4!';}
      },
      thua_say:{
        talk:[
          ['','Hỗn chiến làm vỡ vài cái bàn gỗ, gã say lảo đảo lách ra cửa trốn mất.']
        ]
      },
      moi_ruou:{
        talk:[
          ['','Ngươi đặt vò rượu nếp ngon xuống bàn, cười nhạt: "Vị huynh đài này khẩu khí hào sảng, vò này ta mời."'],
          ['cosusay','(Gã say hớp một ngụm lớn, mắt sáng lên) Hảo huynh đệ! Ta vừa từ Hùng gia sơn trại sang... nghe nói đám gấu bên đó đang bí mật thu mua độc thảo...']
        ],
        eff:()=>{S.stones-=3;S.tamco+=2;S.danh+=2;return 'Tốn 3 thạch mời rượu, đổi lấy tin tức tình báo Hùng gia và danh tiếng trượng nghĩa!';}
      },
      nghe_ngong:{
        talk:[
          ['','Ngươi ngồi vào bàn góc khuất, rót chén trà nghe đám thương lái rì rầm bàn tán chuyện giá dược thảo và lang triều năm nay.']
        ],
        eff:()=>{S.tamco++;return 'Thu thập được nhiều tin đồn hữu ích từ giang hồ. Tâm cơ +1.';}
      }
    }
  }
},
r_moboinho:{loc:'trai',w:2,cond:()=>(S.rel.caumo||0)<0,title:'Lời đồn',
  text:()=>'Mợ đi khắp trại kể rằng ngươi vô ơn, bất hiếu, cướp của cậu.',
  choices:[
    {t:'Đưa sổ sách ra trước tộc nhân',check:['tamco',13],ok:()=>{S.danh+=5;rel('caumo',-10);return 'Sổ sách cho thấy ai mới là kẻ tham. Mợ im bặt. Danh vọng +5.'},fail:()=>{S.danh-=8;return 'Chẳng ai buồn đọc sổ sách. Danh vọng −8.'}},
    {t:'Mặc kệ',eff:()=>{S.danh-=4;return 'Danh vọng −4.'}},
  ]},
r_bancola:{loc:'trai',w:2,title:'Người bán cổ lạ',
  text:()=>'Một phàm nhân lén lút chìa ra chiếc hộp gỗ: "Cổ trùng quý, chỉ 20 nguyên thạch."',
  choices:()=>[
    {t:'Mua luôn',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',eff:()=>{S.stones-=20;if(Math.random()<.55){gainGu(pick(SHOP));return 'Hàng thật!'}return 'Con cổ đã chết từ lâu, chỉ được quét sơn bóng. Mất 20 nguyên thạch.'}},
    {t:'Xem thật kỹ trước',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',check:['ngo',12],ok:()=>{S.stones-=20;gainGu(pick(SHOP));return 'Ngươi nhận ra hàng thật, mua với giá hời.'},fail:()=>'Không phân biệt được, ngươi bỏ đi.'},
    {t:'Bỏ đi',eff:()=>''},
  ]},
r_treem:{loc:'trai',w:1,title:'Đứa trẻ phàm nhân',
  text:()=>'Một đứa trẻ phàm nhân gầy gò đứng nhìn chằm chằm vào bánh bao trong tay ngươi.',
  choices:[
    {t:'Cho nó 3 nguyên thạch',tag:'chinh',eff:()=>{S.stones-=3;S.danh+=2;return 'Đứa trẻ cúi đầu lạy.'}},
    {t:'Thuê nó làm tai mắt',tag:'ma',eff:()=>{S.stones-=2;S.f.eyes=1;S.tamco++;return 'Từ nay trại có thêm một đôi mắt của ngươi. Tâm cơ +1.'}},
    {t:'Đi thẳng',tag:'ma',dao:3,eff:()=>''},
  ]},
r_thanhthu:{loc:'trai',w:1,once:1,title:'Thanh Thư mời',
  text:()=>'Cổ Nguyệt Thanh Thư, Cổ sư trẻ nổi tiếng hiền hậu, mời ngươi vào tiểu tổ của hắn.',
  choices:[
    {t:'Nhận lời',tag:'chinh',eff:()=>{rel('thanhthu',20);S.f.team=1;return 'Nhiệm vụ gia tộc từ nay thưởng thêm 50%.'}},
    {t:'Từ chối khéo',eff:()=>{meet('thanhthu');S.tamco++;return 'Làm một mình thì không phải chia phần. Tâm cơ +1.'}},
  ]},
r_toctruong:{loc:'trai',w:2,once:1,cond:()=>S.danh>=40,title:'Tộc trưởng triệu kiến',
  text:()=>'Tộc trưởng Cổ Nguyệt Bác cho người gọi ngươi. "Gia tộc cần những người trẻ như ngươi."',
  choices:[
    {t:'Xin một con cổ',eff:()=>{rel('toctruong',10);gainGu(pick(['ngocbi','hacthi','cuongnham']));return 'Tộc trưởng ban cổ.'}},
    {t:'Xin nguyên thạch',eff:()=>{rel('toctruong',10);S.stones+=50;return '+50 nguyên thạch.'}},
  ]},
r_tindon:{loc:'trai',w:1,cond:()=>!S.f.hoatuu,title:'Chuyện cũ trong tửu quán',
  text:()=>'Một ông lão say rượu kể: năm xưa có tên ma tu thích uống hoa tửu đánh vào sơn trại, bị thương rồi trốn ra hậu sơn.',
  choices:[{t:'Mời ông lão thêm vò rượu',eff:()=>{S.stones-=2;S.f.hsBonus=(S.f.hsBonus||0)+3;return 'Ông lão kể thêm vị trí khe đá. Thám hiểm hậu sơn dễ hơn.'}}]},
r_choden:{loc:'trai',w:1,cond:()=>S.dao>=20,title:'Chợ đen',
  text:()=>'Tai mắt của ngươi báo có chợ đen họp lúc nửa đêm ở nhà kho bỏ hoang.',
  choices:()=>[
    {t:'Mua Thanh Đồng Xá Lợi Cổ (110 thạch)',req:()=>S.stones>=110&&S.chuyen===1,reqT:'Cần 110 nguyên thạch, Nhất chuyển',eff:()=>{S.stones-=110;gainGu('xaloi1');return 'Hàng không rõ nguồn gốc, nhưng là hàng thật.'}},
    {t:'Mua 4 phần huyết khí (20 thạch)',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',eff:()=>{S.stones-=20;S.blood+=4;return '+4 huyết khí.'}},
    {t:'Rời đi',eff:()=>''},
  ]},

/* ================= NGẪU NHIÊN: NÚI THANH MAO ================= */
r_cohoang:{loc:'nui',w:3,title:'Cổ hoang',
  text:()=>'Trong khe đá có tiếng rì rì. Một con cổ hoang đang ẩn mình.',
  choices:[
    {t:'Chộp lấy bằng tay không',check:['satphat',12],ok:()=>{gainGu(pick(WILD));return 'Ngươi tóm được nó và luyện hóa ngay tại chỗ.'},fail:()=>{S.hp-=15;return 'Cổ hoang phản kích. Khí huyết −15.'}},
    {t:'Dùng nguyên thạch dụ ra',req:()=>S.stones>=10,reqT:'Cần 10 nguyên thạch',check:['ngo',10],ok:()=>{S.stones-=10;gainGu(pick(WILD));return 'Nó bò ra gặm nguyên thạch. Luyện hóa thành công.'},fail:()=>{S.stones-=10;return 'Nó ăn xong rồi chạy mất. −10 nguyên thạch.'}},
  ]},
r_thosan:{loc:'nui',w:2,title:'Thợ săn gặp nạn',
  text:()=>'Tiếng kêu cứu. Một thợ săn phàm nhân bị Hắc Hùng dồn vào vách đá.',
  choices:[
    {t:'Cứu người',tag:'chinh',eff:()=>{fight('hachung',{scale:1,after:'thosan'});return 'Ngươi lao ra chắn trước mặt người thợ săn.'}},
    {t:'Chờ gấu mệt rồi mới ra tay',tag:'ma',dao:10,eff:()=>{fight('hachung',{scale:1,mod:.7});return 'Tiếng kêu im bặt. Con gấu no nê, chậm chạp hẳn.'}},
    {t:'Bỏ đi',tag:'ma',dao:4,eff:()=>''},
  ]},
r_hunggia:{loc:'nui',w:2,cond:()=>S.turn>=5,title:'Cổ sư Hùng gia',
  text:()=>'Một Cổ sư Hùng gia đi lạc qua ranh giới, bị thương ở chân.',
  choices:[
    {t:'Giết, lấy túi cổ',tag:'ma',eff:()=>{fight('hunggia',{scale:1,mod:.85});return 'Hắn thấy sát khí trong mắt ngươi.'}},
    {t:'Đổi tin tức lấy đường về',check:['tamco',12],ok:()=>{S.stones+=15;S.tamco++;return 'Hắn trả 15 nguyên thạch và kể chuyện nội bộ Hùng gia. Tâm cơ +1.'},fail:()=>'Hắn không tin ngươi, khập khiễng bỏ đi.'},
    {t:'Chỉ đường cho hắn',tag:'chinh',eff:()=>'Hắn cảm ơn rồi đi.'},
  ]},
r_xaccosu:{loc:'nui',w:1,title:'Xác Cổ sư',
  text:()=>'Trong hang nhỏ có bộ xương khô mặc áo Cổ sư, bên cạnh là một túi da đã mục.',
  choices:[
    {t:'Lục soát',check:['ngo',11],ok:()=>{S.stones+=25;let t='+25 nguyên thạch.';if(Math.random()<.3){gainGu(pick(SHOP));t+=' Còn một con cổ ngủ đông.'}return t},fail:()=>{S.hp-=20;return 'Độc cổ trong túi còn sống. Khí huyết −20.'}},
    {t:'Chôn cất',tag:'chinh',eff:()=>{S.ess=Math.min(maxEss(),S.ess+15);return 'Lòng ngươi tĩnh lại. Chân nguyên +15.'}},
  ]},
r_suongdoc:{loc:'nui',w:1,title:'Sương độc',
  text:()=>'Sương tím tràn xuống thung lũng. Bên kia có một bãi linh dược.',
  choices:[
    {t:'Nín thở băng qua',check:['satphat',11],ok:()=>{S.herbs+=2;return '+2 linh dược.'},fail:()=>{S.hp-=20;return 'Hít phải sương độc. Khí huyết −20.'}},
    {t:'Đi đường vòng',eff:()=>''},
  ]},
r_nguyetlan:{loc:'nui',w:1,title:'Bãi nguyệt lan hoang',
  text:()=>'Một bãi nguyệt lan mọc hoang, cánh hoa ánh lam dưới trăng.',
  choices:[{t:'Hái đầy túi',eff:()=>{S.f.freeMoon=3;return 'Đủ cho Nguyệt Quang Cổ ăn 3 tuần.'}}]},
r_dausoi:{loc:'nui',w:3,cond:()=>S.turn>=(S.tideT||19)-7&&S.turn<(S.tideT||19),title:'Dấu chân sói',
  text:()=>'Dấu chân sói dày đặc bất thường, hướng về phía sơn trại.',
  choices:[
    {t:'Báo cho gia tộc',tag:'chinh',eff:()=>{S.danh+=5;return 'Danh vọng +5.'}},
    {t:'Âm thầm chuẩn bị',eff:()=>{S.f.wolfPrep=1;return 'Ngươi nghiên cứu cách Điện Lang săn mồi. Sát thương lên sói +15% trong kiếp này.'}},
  ]},
r_baitrinhsat:{loc:'nui',w:2,cond:()=>S.turn>=14&&S.turn<25,title:'Áo trắng trong rừng',
  text:()=>'Một trinh sát Bạch gia đang vẽ bản đồ địa hình Cổ Nguyệt.',
  choices:[
    {t:'Tấn công',eff:()=>{fight('baitrinhsat',{after:'baigia'});return 'Ngươi rút Nguyệt Quang Cổ.'}},
    {t:'Bám theo, xem hắn đi đâu',check:['tamco',13],ok:()=>{S.danh+=8;return 'Ngươi phát hiện trạm gác bí mật của Bạch gia, báo về gia tộc. Danh vọng +8.'},fail:()=>{fight('baitrinhsat',{});return 'Hắn phát hiện ra ngươi.'}},
  ]},
r_heobachthi:{loc:'nui',w:1,title:'Heo rừng lưng trắng',
  text:()=>'Một con heo rừng lưng trắng, trên lưng có con cổ đang ký sinh.',
  choices:[{t:'Săn nó',eff:()=>{fight('heorung',{scale:1,after:'bachthi'});return ''}},{t:'Bỏ qua',eff:()=>''}]},

/* ================= KỲ NGỘ THEO NƠI CHỐN (mỗi tuần 3 việc nên mỗi nơi cần nhiều chuyện) =================
   Sự kiện có chain:1 là bước sau của một chuyện nhiều bước: không rút ngẫu nhiên, chỉ tới qua thenEv() hoặc later(). */
/* ---- Học đường ---- */
k_hd_sachcu:{loc:'hocduong',w:2,title:'Bút ký dưới gầm bàn',
  text:()=>'Dọn chỗ ngồi, ngươi lôi ra một cuốn bút ký sờn gáy của khóa học trò nào đó mấy chục năm trước. Lề sách chi chít chữ nhỏ ghi cách nuôi Nguyệt Quang Cổ.',
  choices:[
    {t:'Đọc kỹ từng dòng chú thích',check:['ngo',11],ok:()=>{S.ngo++;return 'Người viết là kẻ có tâm. Vài mẹo nhỏ khớp với điều ngươi biết từ năm trăm năm trước. Ngộ tính +1.'},fail:()=>{S.prog+=10;return 'Phần lớn là chuyện ngươi đã biết. Tu vi +10.'}},
    {t:'Bán cho mấy đứa con nhà gia lão',tag:'ma',eff:()=>{S.stones+=12;S.danh-=2;return '"Bút ký của tiền bối đấy." Chúng tranh nhau trả giá. +12 nguyên thạch, danh vọng −2.'}},
    {t:'Nộp lên tàng thư các',tag:'chinh',eff:()=>{S.danh+=4;rel('toctruong',3);return 'Gia lão coi thư khen một câu. Danh vọng +4.'}},
  ]},
k_hd_gialaosay:{loc:'hocduong',w:1,once:1,cond:()=>S.turn>=3,title:'Gia lão say rượu',
  who:'gialao',
  scene:{
    start:'hien',budget:2,
    nodes:{
      hien:{
        talk:[
          ['gialao','Tụi nhỏ bây giờ... chỉ biết bắn Nguyệt Nhận cho thẳng. Hồi ta còn trẻ...'],
          ['','Lão lắc đầu quầy quậy, vò rượu đã cạn quá nửa, tỏa ra mùi men nồng nặc dưới bóng hiên giảng đường.']
        ],
        choices:[
          {t:'Lắng nghe lão lẩm bẩm',stay:1,flag:'nghe_say',say:'Lão lè nhè về thời kỳ lang triều mấy chục năm trước, bàn tay đầy vết sẹo rung lên bần bật.'},
          {t:'Rót thêm rượu, ngồi nghe lão kể',req:()=>S.stones>=5,reqT:'Cần 5 nguyên thạch mua rượu',eff:()=>{S.stones-=5;return 'Ngươi mang tới một vò rượu gạo. Mắt lão sáng rực lên.';},go:'uong_ruou'},
          {t:'Cúi chào rồi đi',go:'ve'}
        ]
      },
      uong_ruou:{
        talk:[
          ['gialao','Ngươi là đứa Bính đẳng Phương Nguyên hả? Khà khà, tư chất kém thì phải biết tiết kiệm chân nguyên!'],
          ['gialao','Nguyệt Nhận không cần bắn mạnh, chỉ cần bắn đúng lúc địch vừa thở ra. Đời này chẳng đứa nào chịu nghe ta nói!']
        ],
        choices:[
          {t:'Hỏi lão cách canh nhịp thở',check:['ngo',11],
            ok:()=>{S.prog+=35;S.ngo++;rel('toctruong',2);return 'Lão giảng say sưa tới nửa đêm. Nhiều chỗ còn tinh tế hơn trí nhớ của ngươi. Tu vi +35, ngộ tính +1.'},
            fail:()=>{S.prog+=15;return 'Lão lạc đề sang chuyện tình năm xưa, rồi ngủ gục. Tu vi +15.'},
            go:'xong'},
          {t:'Dò hỏi chuyện nội bộ gia lão đoàn',check:['tamco',12],
            ok:()=>{S.tamco++;return 'Lão lè nhè kể phe Xích và phe Mạc đang ngấm ngầm tranh ghế trưởng lão. Tâm cơ +1.'},
            fail:()=>{S.danh-=2;return 'Lão chợt tỉnh rượu, nhìn ngươi đầy nghi ngờ. Danh vọng −2.'},
            go:'xong'}
        ]
      },
      xong:{
        talk:[
          ['gialao','Uống... uống tiếp... mai còn lên lớp...'],
          ['','Lão già gục xuống bàn đá ngáy khò khò. Ngươi thu dọn rồi rời khỏi học đường.']
        ]
      },
      ve:{
        talk:[
          ['','Gia lão say khướt chẳng buồn ngẩng đầu nhìn theo, tiếp tục ngửa cổ dốc vò rượu cạn.']
        ]
      }
    }
  }},
k_hd_detthi:{loc:'hocduong',w:1,once:1,cond:()=>S.turn>=3&&S.turn<6,title:'Tờ giấy rơi',
  text:()=>'Trên lối đi sau giảng đường có một tờ giấy bị gió thổi tới chân ngươi. Nét chữ của gia lão: danh sách đề mục cho kỳ khảo hạch sắp tới.',
  choices:[
    {t:'Ghi nhớ rồi để lại chỗ cũ',check:['tamco',10],ok:()=>{S.prog+=25;S.tamco++;return 'Ngươi biết phải luyện gì cho kỳ khảo hạch. Tu vi +25, tâm cơ +1.'},fail:()=>{S.susp+=8;return 'Một tên học trò đứng xa trông thấy ngươi cầm tờ giấy. Hiềm nghi +8.'}},
    {t:'Bán đề cho Mạc Bắc',tag:'ma',eff:()=>{S.stones+=20;S.susp+=6;later('k_hd_detthi2',1,2);return 'Mạc Bắc trả 20 nguyên thạch không mặc cả. Hiềm nghi +6.'}},
    {t:'Trả lại cho gia lão',tag:'chinh',eff:()=>{S.danh+=6;return 'Gia lão nhìn ngươi hồi lâu rồi gật đầu. Danh vọng +6.'}},
  ]},
k_hd_detthi2:{chain:1,loc:'hocduong',who:'macnhan',title:'Đề thi bị lộ',
  text:()=>'Cả học đường xôn xao: Mạc Bắc làm bài quá tốt, gia lão nghi có kẻ lộ đề. Mạc Nhan chặn ngươi ở hành lang: "Đệ ta mua đề của ngươi phải không? Nói thật thì ta bỏ qua."',
  choices:[
    {t:'Chối phắt',check:['tamco',12],ok:()=>{S.tamco++;return 'Mạc Nhan không bắt được chứng cứ, hậm hực bỏ đi. Tâm cơ +1.'},fail:()=>{rel('macnhan',-20);S.susp+=10;return '"Được lắm." Nàng nhớ mặt ngươi rồi. Hiềm nghi +10.'}},
    {t:'Đổ cho Xích Thành',tag:'ma',check:['tamco',13],ok:()=>{rel('xichthanh',-15);rel('macnhan',5);S.dao=clamp(S.dao+5,-100,100);return 'Mạc Nhan nửa tin nửa ngờ, nhưng mũi dùi đã chuyển sang Xích gia.'},fail:()=>{fight('macnhan',{scale:1});return 'Nàng không tin, rút cổ ra ngay giữa hành lang.'}},
  ]},
k_hd_domdom:{loc:'hocduong',w:1,cond:()=>!hasGu('tieuguang'),title:'Đom đóm trong vườn thuốc',
  text:()=>'Đêm, vườn thuốc sau học đường lập lòe ánh sáng. Không phải đom đóm: là một bầy Tiểu Quang Cổ hoang đang ăn sương đọng trên lá.',
  choices:[
    {t:'Chộp con sáng nhất',check:['satphat',11],ok:()=>{gainGu('tieuguang');return 'Con cổ nhỏ vùng vẫy rồi nằm yên trong lòng bàn tay. Luyện hóa thành công.'},fail:()=>{S.hp-=8;return 'Cả bầy tản ra, chích ngươi mấy phát. Khí huyết −8.'}},
    {t:'Rải nguyên thạch vụn dụ chúng',req:()=>S.stones>=6,reqT:'Cần 6 nguyên thạch',check:['ngo',9],ok:()=>{S.stones-=6;gainGu('tieuguang');return 'Một con bò tới gặm đá vụn. Ngươi luyện hóa nó.'},fail:()=>{S.stones-=6;return 'Chúng ăn sạch rồi bay mất. −6 nguyên thạch.'}},
    {t:'Để yên',eff:()=>'Ngươi đứng xem một lúc rồi về ngủ.'},
  ]},
k_hd_hocngheo:{loc:'hocduong',w:1,once:1,title:'Học trò nghèo',
  who:'hoctro',
  scene:{
    start:'hoc_tro',budget:2,
    nodes:{
      hoc_tro:{
        talk:[
          ['','Dưới chân tường rêu học đường, một thiếu niên Đinh đẳng gầy gò, áo vá chằng vá đụp thập thò nhìn quanh rồi níu lấy tay áo ngươi.'],
          ['hoctro','Phương Nguyên ca ca... xin huynh thương tình cho đệ mượn mười khối nguyên thạch! Cổ trùng bản mệnh của đệ đã nhịn đói ba hôm, sắp chết héo rồi... Sang tháng đệ trả gấp đôi!']
        ],
        choices:[
          {t:'Gặng hỏi xem hắn nuôi cổ gì mà tốn kém thế',stay:1,flag:'hoi_co',say:'Hắn ngập ngừng xòe tay: là một con Thạch Bì Cổ hạ phẩm ăn bùn khoáng, nhưng do chân nguyên cặn bã của Đinh đẳng nên cổ hấp thụ rất kém.'},
          {t:'Cho mượn mười khối nguyên thạch cứu ngặt',tag:'chinh',req:()=>S.stones>=10,reqT:'Cần 10 nguyên thạch',go:'cho_muon'},
          {t:'Bắt nộp 4 thạch trợ cấp trước, thu làm chân chạy canh chừng học đường',tag:'ma',go:'chan_chay'},
          {t:'Chỉ điểm bí quyết nuôi cổ Đinh đẳng không tốn kém',hidden:'hoi_co',check:['ngo',10],go:'chi_diem'},
          {t:'Gạt tay bước đi, kẻ yếu không có quyền tồn tại',tag:'ma',go:'gat_tay'}
        ]
      },
      cho_muon:{
        talk:[
          ['','Ngươi ném túi mười khối nguyên thạch vào lòng hắn.'],
          ['hoctro','Đa tạ Phương Nguyên ca ca cứu mạng! Sau này có nhảy vào dầu sôi lửa bỏng, tiểu đệ cũng không chối từ!']
        ],
        eff:()=>{S.stones-=10;S.f.hocngheo=1;later('k_hd_hocngheo2',3,5,'hocngheo');S.danh+=2;return 'Cho mượn 10 nguyên thạch cứu nguy. Danh vọng +2.';}
      },
      chan_chay:{
        talk:[
          ['','Ngươi bóp chặt cổ tay hắn: "Muốn mượn tiền? Đưa bốn khối trợ cấp hôm nay của ngươi đây làm tin. Từ nay mỗi ngày đi theo làm chân chạy canh chừng học đường cho ta!"'],
          ['hoctro','Vâng... vâng, tiểu đệ xin nghe theo đại ca phân phó!']
        ],
        eff:()=>{S.f.hocngheo=2;S.stones+=4;later('k_hd_hocngheo2',3,5,'hocngheo');S.tamco++;return 'Thu 4 nguyên thạch làm tin, biến hắn thành chân chạy canh chừng học đường!';}
      },
      chi_diem:{
        talk:[
          ['','Ngươi nhặt hòn đá vụn gõ nhẹ lên vỏ con Thạch Bì Cổ, chỉ ra chỗ tích tụ tạp chất trong kinh mạch nó.'],
          ['','Thiếu niên làm theo lời chỉ dẫn, con cổ lập tức hồi sinh sức sống, không cần nuốt thêm thạch vụn.'],
          ['hoctro','Trời ơi... Phương Nguyên ca thật là thần nhân! Đệ không dám quên ơn này!']
        ],
        eff:()=>{S.danh+=5;S.f.hocngheo=3;later('k_hd_hocngheo2',3,5,'hocngheo');S.ngo++;return 'Chỉ điểm nuôi cổ mà không tốn một xu! Ngộ tính +1, danh vọng +5.';}
      },
      gat_tay:{
        talk:[
          ['','Ngươi lạnh lùng giật tay áo lại: "Tự sinh tự diệt, đó là quy luật đất trời. Ngươi không nuôi nổi cổ thì đừng làm Cổ sư nữa."'],
          ['','Thiếu niên bẽ bàng lủi vào bóng tối. Ngươi không buồn ngoái lại.']
        ],
        eff:()=>{return 'Không bận tâm kẻ yếu. Tiếp tục tu luyện.';}
      }
    }
  }
},
k_hd_hocngheo2:{chain:1,loc:'hocduong',title:'Món nợ cũ',
  who:'hoctro',
  text:()=>{
    if(S.f.hocngheo===1) return 'Tên học trò Đinh đẳng tìm tới, mặt mày tươi tỉnh: "Con cổ của đệ sống rồi, còn săn được heo rừng!" Hắn đặt vào tay ngươi một túi vải.';
    if(S.f.hocngheo===2) return 'Tên học trò Đinh đẳng lén lút tới: "Phương huynh, mấy hôm nay có người hỏi về huynh. Đệ nghe thấy hết."';
    return 'Tên học trò Đinh đẳng cúi gập người trước ngươi: "Nhờ bí quyết của huynh mà cổ của đệ tiến bộ vượt bậc! Đệ biếu huynh một vò Hầu Nhi Tửu đệ nhặt được trên núi."';
  },
  choices:()=>{
    if(S.f.hocngheo===1) return [
      {t:'Nhận túi 20 nguyên thạch trả nợ',eff:()=>{S.stones+=20;S.danh+=3;return '+20 nguyên thạch. Hắn kể với ai cũng khen Phương huynh tốt bụng. Danh vọng +3.';}},
      {t:'Bảo hắn giữ lại, đổi lấy một lời hứa tương trợ',tag:'chinh',eff:()=>{S.danh+=6;S.f.hocngheoAlly=1;return 'Hắn thề sau này ngươi cần gì cứ nói. Danh vọng +6.';}}
    ];
    if(S.f.hocngheo===2) return [
      {t:'Nghe hắn báo cáo tình hình các thế lực trong học đường',eff:()=>{S.susp=Math.max(0,S.susp-15);S.tamco+=2;return 'Biết trước kẻ nào đang nghi mình, kịp xóa dấu vết. Hiềm nghi −15, tâm cơ +2.';}}
    ];
    return [
      {t:'Nhận vò rượu Hầu Nhi',eff:()=>{S.wine=(S.wine||0)+1;S.danh+=4;return 'Nhận 1 vò Hầu Nhi Tửu hảo hạng! Danh vọng +4.';}},
      {t:'Nhận hắn làm đệ tử ngoại môn',tag:'ma',eff:()=>{S.f.hocngheoAlly=1;S.danh+=5;S.tamco++;return 'Có thêm một tay chân trung thành trong học đường. Danh vọng +5, tâm cơ +1.';}}
    ];
  }
},
k_hd_pcluyendem:{loc:'hocduong',w:1,cond:()=>S.turn>=4&&S.turn<(S.tideT||19),who:'phuongchinh',title:'Phương Chính luyện đêm',
  text:()=>'Sân học đường tối om, chỉ có Phương Chính còn ở lại. Nguyệt Nhận của nó cứ bắn lệch khỏi cọc gỗ. Nó nghiến răng: "Thêm một lần nữa..." rồi quỵ xuống vì cạn chân nguyên.',
  choices:[
    {t:'Chỉ cho nó cách dồn chân nguyên',tag:'chinh',eff:()=>{rel('phuongchinh',12);return 'Phương Chính sững sờ nghe anh trai giảng giải. Lần bắn sau trúng hồng tâm. Nó ngước lên, không biết nên cười hay khóc.'}},
    {t:'Đứng trong bóng tối quan sát cách gia lão dạy riêng cho Giáp đẳng',check:['ngo',12],ok:()=>{S.prog+=30;return 'Những gì gia lão dạy riêng cho thiên tài, ngươi đều ghi nhớ. Tu vi +30.'},fail:()=>'Toàn chuyện cơ bản. Ngươi quay về.'},
    {t:'"Giáp đẳng mà chỉ có thế?"',tag:'ma',eff:()=>{rel('phuongchinh',-12);S.tamco++;return 'Phương Chính cúi gằm mặt. Tâm cơ +1.'}},
  ]},

/* ---- Sơn trại ---- */
k_tr_bicuong:{loc:'trai',w:1,once:1,title:'Lão bán bí phương',
  text:()=>'Một lão già lưng còng trải tấm vải rách ở góc chợ, bày một mảnh da dê cũ: "Bí phương luyện cổ thời thượng cổ. Hai mươi khối, không bớt."',
  choices:[
    {t:'Xem kỹ mảnh da',eff:()=>{thenEv('k_tr_bicuong2');return 'Ngươi ngồi xổm xuống, lật mặt sau mảnh da.'}},
    {t:'Dọa lão giao ra',tag:'ma',check:['satphat',11],ok:()=>{S.dao=clamp(S.dao+4,-100,100);S.prog+=20;return 'Lão run rẩy dâng mảnh da. Chỉ là bí phương nuôi Bạch Thỉ Cổ, nhưng có vài câu đáng nghĩ. Tu vi +20.'},fail:()=>{S.danh-=5;return 'Lão la lên, cả chợ quay lại nhìn. Danh vọng −5.'}},
    {t:'Bỏ đi',eff:()=>''},
  ]},
k_tr_bicuong2:{chain:1,loc:'trai',title:'Lão bán bí phương',
  text:()=>'Mực trên da dê mới quá, nhưng nét vẽ con cổ lại đúng kiểu cổ phương năm trăm năm sau ngươi từng thấy. Lão già đang nhìn ngươi chằm chằm.',
  choices:[
    {t:'Trả hai mươi khối',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',check:['ngo',12],ok:()=>{S.stones-=20;S.ngo++;S.prog+=30;return 'Đồ chép lại, nhưng chép từ bản thật. Ngộ tính +1, tu vi +30.'},fail:()=>{S.stones-=20;return 'Về nhà nghiền ngẫm mới biết bị lừa. −20 nguyên thạch.'}},
    {t:'"Lão chép từ đâu ra?"',check:['tamco',12],ok:()=>{S.tamco++;const c=(S.cache||[]).find(c=>!c.done&&!c.rumor&&S.turn<=c.to);if(c){c.rumor=1;return `Lão thở dài, kể có thấy bản gốc trong hang của một Cổ sư chết ở ${LOC_NAME[c.loc]}. Tâm cơ +1.`}return 'Lão chỉ lắc đầu, nhưng ánh mắt lão nói nhiều hơn lời. Tâm cơ +1.'},fail:()=>'Lão cuộn vội mảnh da, bỏ đi.'},
  ]},
k_tr_dabo:{loc:'trai',w:1,title:'Tảng đá bị bỏ',
  text:()=>'Sau quầy đoán thạch có một đống đá bị chê, chờ đem đi đổ. Một tảng có vân đá chạy ngược, ai cũng cho là đá chết.',
  choices:[
    {t:'Xin tảng vân ngược, bổ ra',check:['ngo',12],ok:()=>{if(Math.random()<.5){gainGu(pick(WILD));return 'Bên trong có một con cổ đang ngủ. Luyện hóa thành công.'}S.stones+=18;return 'Lõi đá là một cục nguyên thạch tinh khiết. +18 nguyên thạch.'},fail:()=>'Chỉ là vôi vụn.'},
    {t:'Đi qua',eff:()=>''},
  ]},
k_tr_sayruou:{loc:'trai',w:2,title:'Kẻ say trong tửu quán',
  text:()=>'Một Cổ sư ngoại tộc say mềm, đập bàn đòi thêm rượu, rồi túm cổ áo tiểu nhị. Tay kia hắn khoe một túi nguyên thạch căng phồng.',
  choices:[
    {t:'Đánh hắn ra khỏi quán',eff:()=>{fight('cosusay',{scale:1});return 'Ngươi đứng dậy. Cả quán im phăng phắc.'}},
    {t:'Mời hắn một chén, dò chuyện',check:['tamco',11],ok:()=>{const c=(S.cache||[]).find(c=>!c.done&&!c.rumor&&S.turn<=c.to);if(c){c.rumor=1;return `Hắn khoe vừa thoát chết ở ${LOC_NAME[c.loc]}: "Có đồ tốt, nhưng ta không dám quay lại!"`}S.tamco++;return 'Hắn kể một tràng chuyện giang hồ vô bổ. Tâm cơ +1.'},fail:()=>{S.stones=Math.max(0,S.stones-4);return 'Hắn uống hết rượu của ngươi rồi ngủ gục. −4 nguyên thạch.'}},
    {t:'Đợi hắn ngủ gục rồi móc túi',tag:'ma',check:['satphat',12],ok:()=>{S.stones+=22;S.dao=clamp(S.dao+5,-100,100);return '+22 nguyên thạch. Sáng mai hắn sẽ chẳng nhớ gì.'},fail:()=>{S.susp+=12;fight('cosusay',{scale:1});return 'Hắn chợt tỉnh. Hiềm nghi +12.'}},
  ]},
k_tr_songbac:{loc:'trai',w:1,cond:()=>S.dao>=0,title:'Sòng bạc ngầm',
  text:()=>'Dưới hầm nhà kho có sòng bạc lén lút của mấy tên hộ vệ. Chúng đổ xúc xắc ăn tiền bằng nguyên thạch, và vừa để ý tới ngươi.',
  choices:[
    {t:'Chơi vài ván, đọc tay kẻ cầm cái',req:()=>S.stones>=10,reqT:'Cần 10 nguyên thạch',check:['tamco',13],ok:()=>{S.stones+=25;return 'Ngươi nhìn ra hắn giấu hạt xúc xắc trong tay áo, và đặt cửa ngược lại. +25 nguyên thạch.'},fail:()=>{S.stones-=10;return 'Nhà cái luôn thắng. −10 nguyên thạch.'}},
    {t:'Báo cho Hình đường',tag:'chinh',eff:()=>{S.danh+=6;rel('toctruong',4);return 'Sòng bạc bị dẹp. Danh vọng +6, mấy tên hộ vệ ghi hận.'}},
    {t:'Đòi tiền bịt miệng',tag:'ma',check:['satphat',12],ok:()=>{S.stones+=15;S.f.songbac=1;return 'Chúng miễn cưỡng nộp 15 khối, hứa tháng nào cũng có phần.'},fail:()=>{fight('sontac',{scale:1});return 'Một tên rút cổ ra. "Thằng nhãi Bính đẳng dám dọa bọn ta?"'}},
  ]},
k_tr_benhdich:{loc:'trai',w:1,cond:()=>S.turn>=5,title:'Làng phàm nhân đổ bệnh',
  text:()=>'Khu nhà phàm nhân dưới chân trại có người sốt cao, ho ra máu. Một bà lão quỳ bên đường xin Cổ sư nào đi qua cứu cháu mình.',
  choices:()=>[
    ...(hasGu('trilieu')?[{t:'Dùng Trị Liệu Cổ chữa cho đứa bé',tag:'chinh',req:()=>S.ess>=20,reqT:'Cần 20 chân nguyên',eff:()=>{S.ess-=20;S.danh+=8;S.herbs++;return 'Đứa bé hạ sốt. Cả xóm dúi cho ngươi một gốc linh dược quý. Danh vọng +8, +1 linh dược.'}}]:[]),
    {t:'Cho một gốc linh dược',tag:'chinh',req:()=>S.herbs>=1,reqT:'Cần 1 linh dược',eff:()=>{S.herbs--;S.danh+=5;return 'Bà lão dập đầu mãi không thôi. Danh vọng +5.'}},
    {t:'Bán linh dược cho họ với giá cao',tag:'ma',req:()=>S.herbs>=1,reqT:'Cần 1 linh dược',eff:()=>{S.herbs--;S.stones+=16;S.danh-=4;return 'Cả xóm dốc hết của cải. +16 nguyên thạch, danh vọng −4.'}},
    {t:'Đi qua',eff:()=>''},
  ]},
k_tr_lukhach:{loc:'trai',w:1,once:1,cond:()=>!S.f.hoatuu,title:'Lữ khách hỏi đường',
  text:()=>'Một Cổ sư áo xám ngồi một mình ở góc tửu quán, mời ngươi uống chén trà: "Tiểu huynh đệ, nghe nói sau núi Cổ Nguyệt có khe đá thơm mùi rượu? Chỉ đường cho ta, ta trả hậu."',
  choices:[
    {t:'Chỉ sai đường, sang phía biên giới Hùng gia',tag:'ma',check:['tamco',11],ok:()=>{S.tamco++;return 'Hắn cảm ơn rồi đi. Nếu may, người Hùng gia sẽ lo liệu hắn. Tâm cơ +1.'},fail:()=>{later('k_tr_lukhach2',1,2);return 'Hắn cười nhạt. Có vẻ hắn không tin.'}},
    {t:'Nói không biết',eff:()=>{later('k_tr_lukhach2',2,3);return 'Hắn gật đầu, nhưng mắt vẫn dõi theo ngươi khi ngươi rời quán.'}},
    {t:'Hỏi hắn nghe tin đó từ đâu',check:['tamco',13],ok:()=>{S.f.hsBonus=(S.f.hsBonus||0)+2;return 'Hắn lỡ lời: có tấm bản đồ cũ vẽ tầng hai của động. Ngươi nhớ kỹ từng chi tiết hắn kể. Thám hiểm hậu sơn +2.'},fail:()=>{later('k_tr_lukhach2',1,2);return 'Hắn khựng lại, rồi đổi chủ đề.'}},
  ]},
k_tr_lukhach2:{chain:1,loc:'trai',title:'Bóng áo xám',
  text:()=>'Chiều tối, trên đường mòn về nhà, Cổ sư áo xám bước ra từ bụi trúc: "Ngươi biết khe đá đó. Dẫn ta đi, hoặc ta tự tìm trên xác ngươi."',
  choices:[
    {t:'Đánh',eff:()=>{fight('tanbinh',{scale:1});return 'Ngươi không nói thêm lời nào.'}},
    {t:'Dẫn hắn vào tầng có bẫy',check:['tamco',13],ok:()=>{S.stones+=30;S.dao=clamp(S.dao+8,-100,100);return 'Trận pháp nuốt chửng hắn. Ngươi nhặt túi nguyên thạch hắn đánh rơi. +30 nguyên thạch.'},fail:()=>{fight('tanbinh',{scale:1,mod:1.15});return 'Hắn nhận ra ngươi dẫn sai đường.'}},
  ]},

/* ---- Núi Thanh Mao ---- */
k_nui_gioxoay:{loc:'nui',w:1,cond:()=>!hasGu('toanphong'),title:'Gió xoáy trong khe',
  text:()=>'Giữa khe núi lặng gió, lá khô cứ xoay tròn một chỗ. Có con Toàn Phong Cổ đang làm tổ bên dưới.',
  choices:[
    {t:'Thò tay vào giữa vòng xoáy',check:['satphat',12],ok:()=>{gainGu('toanphong');return 'Gió cứa rát cánh tay, nhưng ngươi đã tóm được nó.'},fail:()=>{S.hp-=18;return 'Lưỡi gió cắt một đường dài trên tay. Khí huyết −18.'}},
    {t:'Chặn gió bằng tảng đá rồi đào',check:['ngo',11],ok:()=>{gainGu('toanphong');return 'Hết gió, con cổ lộ ra, lờ đờ như cá mắc cạn. Luyện hóa thành công.'},fail:()=>'Nó chui xuống kẽ đá, mất dạng.'},
  ]},
k_nui_toxanh:{loc:'nui',w:1,cond:()=>!hasGu('thanhti'),title:'Tơ xanh trên cành',
  text:()=>'Giữa rừng trúc có những sợi tơ xanh căng giữa các thân cây, óng ánh như sương. Ai đó đã giăng bẫy Thanh Ti Cổ ở đây rồi bỏ đi.',
  choices:[
    {t:'Lần theo sợi tơ',check:['ngo',11],ok:()=>{gainGu('thanhti');return 'Cuối sợi tơ là một con Thanh Ti Cổ đang cuộn mình. Luyện hóa thành công.'},fail:()=>{S.hp-=10;return 'Tơ quấn vào chân, ngươi ngã nhào xuống dốc. Khí huyết −10.'}},
    {t:'Rình kẻ giăng bẫy quay lại',check:['tamco',12],ok:()=>{S.stones+=15;S.tamco++;return 'Một thợ săn phàm nhân. Hắn chia cho ngươi phần tiền bán cổ để được yên. +15 nguyên thạch.'},fail:()=>'Cả buổi chẳng ai tới.'},
  ]},
k_nui_bovodong:{loc:'nui',w:1,cond:()=>!hasGu('dongbi'),title:'Con bọ vỏ đồng',
  text:()=>'Dưới gốc cây sét đánh có con bọ vỏ ánh đồng đang gặm đá. Đồng Bì Cổ, loại cổ phòng ngự rẻ mà bền.',
  choices:[
    {t:'Dụ bằng nguyên thạch',req:()=>S.stones>=8,reqT:'Cần 8 nguyên thạch',eff:()=>{S.stones-=8;gainGu('dongbi');return 'Nó bò theo mùi nguyên thạch vào lòng bàn tay ngươi. −8 nguyên thạch.'}},
    {t:'Bắt sống',check:['satphat',11],ok:()=>{gainGu('dongbi');return 'Vỏ nó cứng thật, nhưng chẳng biết chạy.'},fail:()=>{S.hp-=8;return 'Nó cắn một phát rồi chui vào hốc cây. Khí huyết −8.'}},
  ]},
k_nui_suoinong:{loc:'nui',w:1,title:'Suối nước ấm',
  text:()=>'Sau vách núi phía đông có một dòng suối bốc hơi ấm. Dưới đáy suối lấp lánh gì đó.',
  choices:[
    {t:'Ngâm mình dưỡng thương',eff:()=>{S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.4));S.ess=Math.min(maxEss(),S.ess+15);return 'Hơi ấm thấm vào tận xương. Khí huyết hồi phục nhiều, chân nguyên +15.'}},
    {t:'Lặn xuống đáy',check:['satphat',12],ok:()=>{S.herbs+=2;S.stones+=6;return 'Rễ linh dược mọc quanh mạch nước nóng. +2 linh dược, +6 nguyên thạch.'},fail:()=>{S.hp-=15;return 'Dòng nước ngầm kéo ngươi vào vách đá. Khí huyết −15.'}},
  ]},
k_nui_soicon:{loc:'nui',w:1,cond:()=>S.turn<(S.tideT||19),title:'Sói con lạc bầy',
  text:()=>'Một con Điện Lang con kẹt chân trong khe đá, kêu ư ử. Bộ lông nó thỉnh thoảng lóe tia điện nhỏ.',
  choices:[
    {t:'Giết lấy huyết khí',tag:'ma',eff:()=>{S.blood+=2;return '+2 huyết khí.'}},
    {t:'Thả ra rồi bám theo nó về hang',check:['tamco',12],ok:()=>{thenEv('k_nui_soicon2');return 'Nó khập khiễng chạy về phía bắc. Ngươi lặng lẽ theo sau.'},fail:()=>'Nó lẩn vào bụi rậm, mất dấu.'},
    {t:'Bỏ đi',eff:()=>''},
  ]},
k_nui_soicon2:{chain:1,loc:'nui',title:'Hang Điện Lang',
  text:()=>'Hang sói nằm sau thác nước. Ngươi đếm được ít nhất ba con trưởng thành, cả đám đang gặm xương. Trên vách hang, những vết cào mới toanh đều quay về phía sơn trại Cổ Nguyệt.',
  choices:[
    {t:'Ghi nhớ đường sói đi, báo về trại',tag:'chinh',eff:()=>{S.f.wolfPrep=1;S.danh+=5;return 'Ngươi đã hiểu cách bầy sói di chuyển. Sát thương lên sói +15% trong kiếp này, danh vọng +5.'}},
    {t:'Đánh úp con đầu đàn lúc nó ra uống nước',eff:()=>{fight('dienlang',{scale:1,elite:true});return 'Ngươi chờ đến lúc nó rời bầy.'}},
  ]},
k_nui_mach:{loc:'nui',w:1,title:'Mạch nguyên thạch lộ thiên',
  text:()=>'Cơn mưa đêm qua làm sạt một mảng đồi, lộ ra những vệt nguyên thạch trắng đục. Chỗ này sát ranh giới với Hùng gia.',
  choices:[
    {t:'Đào nhanh rồi đi',eff:()=>{const n=rand(12,20);S.stones+=n;if(Math.random()<.35){fight('hunggia',{scale:1});return `+${n} nguyên thạch. Tiếng đục đá đã gọi người Hùng gia tới.`}return `+${n} nguyên thạch.`}},
    {t:'Đánh dấu, báo cho nhiệm vụ đường',tag:'chinh',eff:()=>{S.danh+=6;S.stones+=6;return 'Gia tộc thưởng công phát hiện mạch đá. Danh vọng +6, +6 nguyên thạch.'}},
  ]},
k_nui_ansi:{loc:'nui',w:1,once:1,cond:()=>S.turn>=6,title:'Nhà tranh trong mây',
  scene:{
    start:'leu',budget:2,
    nodes:{
      leu:{
        talk:[
          ['','Lưng chừng núi có một túp lều tranh mộc mạc ẩn trong màn sương mù.'],
          ['','Một ông lão tóc bạc ngồi đánh cờ một mình. Quanh lều yên tĩnh đến lạ, cổ trùng trong không khiếu của ngươi cũng ngoan ngoãn nằm im.']
        ],
        choices:[
          {t:'Đứng xa quan sát bàn cờ đá',stay:1,flag:'soi_co',say:'Thế cờ tàn khốc liệt, quân đen như rồng bị vây tứ phía, sát khí ẩn giấu tầng tầng.'},
          {t:'Bước tới ngồi xuống xem cờ',go:'xem_co'},
          {t:'Lặng lẽ quay lưng rời đi',go:'ve'}
        ]
      },
      xem_co:{
        talk:[
          ['','Ông lão không ngẩng đầu lên, ngón tay gầy guộc khẽ gõ lên mặt bàn cờ đá.'],
          ['','"Quân đen bị vây, chỉ còn một nước sống," ông lão cất giọng trầm đục. "Người trẻ tuổi, nếu là ngươi, ngươi bỏ quân nào?"']
        ],
        choices:[
          {t:'"Bỏ con cờ đang được bảo vệ nhiều nhất."',check:['ngo',13],
            ok:()=>{gainGu(pick(['uguang','liemtuc']));S.ngo++;return 'Ông lão bật cười sảng khoái, đẩy về phía ngươi chiếc hộp gỗ. "Ma đạo mà hiểu cờ." Trong hộp là một con cổ trùng. Ngộ tính +1.';},
            fail:()=>{S.prog+=15;return '"Không sai, nhưng lòng tham chưa dứt." Lão phất tay tiễn khách. Tu vi +15.';},
            go:'ket_co'},
          {t:'"Không bỏ quân nào. Lật bàn."',tag:'ma',eff:()=>{S.tamco++;S.dao=clamp(S.dao+4,-100,100);return 'Ông lão nhìn ngươi rất lâu. "Năm trăm năm sau, ngươi cũng sẽ nói vậy." Khi ngươi chớp mắt, túp lều đã biến mất như sương khói. Tâm cơ +1.';},go:'ket_co'}
        ]
      },
      ket_co:{
        talk:[
          ['','Gió núi Thanh Mao thổi qua ngọn trúc, trước mắt ngươi chỉ còn lại phiến đá phủ rêu xanh.']
        ]
      },
      ve:{
        talk:[
          ['','Ngươi quay bước xuống núi, trong lòng thoảng qua cảm giác đã bỏ lỡ một cơ duyên.']
        ]
      }
    }
  }},
k_nui_vaysuoi:{loc:'nui',w:1,cond:()=>S.turn>=10&&!hasGu('anlan'),title:'Vảy cá dưới khe',
  text:()=>'Dưới khe suối trong vắt có thứ gì đó lấp lánh như vảy cá, nhưng nhìn kỹ lại chẳng thấy gì. Ẩn Lân Cổ: loại cổ ẩn thân hiếm gặp.',
  choices:[
    {t:'Ngồi yên chờ nó lộ ra',check:['ngo',14],ok:()=>{gainGu('anlan');return 'Ba canh giờ không động đậy. Rồi nó tự bơi vào lòng bàn tay ngươi. Luyện hóa thành công.'},fail:()=>'Trời tối. Nó vẫn chưa lộ ra.'},
    {t:'Chặn dòng suối',check:['satphat',13],ok:()=>{gainGu('anlan');return 'Nước cạn, con cổ không còn chỗ trốn.'},fail:()=>{S.hp-=12;return 'Đá trượt, ngươi ngã xuống lòng suối. Khí huyết −12.'}},
  ]},

/* ---- Nhiệm vụ đường ---- */
k_nv_thue:{loc:'nhiemvu',w:2,title:'Thu tô làng phàm nhân',
  text:()=>'Nhiệm vụ đường giao ngươi xuống làng phàm nhân thu tô năm nay. Trưởng làng run run: "Mùa này mất mùa, xin Cổ sư đại nhân thư thả."',
  choices:[
    {t:'Thu đúng số, cho khất phần còn lại',tag:'chinh',eff:()=>{AFTER.nv();S.danh+=3;return 'Dân làng nhớ ơn.'}},
    {t:'Thu đủ, còn thu thêm phần riêng',tag:'ma',eff:()=>{AFTER.nv();S.stones+=12;S.susp+=4;return 'Ngươi bỏ túi thêm 12 khối. Hiềm nghi +4.'}},
  ]},
k_nv_mattich:{loc:'nhiemvu',w:1,once:1,cond:()=>S.turn>=4,title:'Học trò mất tích',
  text:()=>'Một học trò khóa dưới đi hái trà không về. Mẹ nó khóc ngất ở nhiệm vụ đường. Chẳng ai muốn nhận việc vào rừng lúc chiều tối.',
  choices:[
    {t:'Nhận việc',eff:()=>{thenEv('k_nv_mattich2');return 'Ngươi nhận lệnh bài, đi về phía đồi trà.'}},
    {t:'Không phải việc của mình',eff:()=>''},
  ]},
k_nv_mattich2:{chain:1,loc:'nhiemvu',title:'Hang báo',
  text:()=>'Trên đồi trà có dấu chân báo và vệt máu kéo dài. Trong hang đá, đứa nhỏ nép sát vách, còn sống. Ở cửa hang, một con Kim Tiền Báo đang liếm vuốt.',
  choices:[
    {t:'Lao vào đánh',tag:'chinh',eff:()=>{fight('bao',{scale:1,after:'nv'});S.danh+=6;return 'Danh vọng +6 nếu cứu được người.'}},
    {t:'Ném thịt dụ báo đi chỗ khác',check:['tamco',11],ok:()=>{AFTER.nv();S.danh+=8;return 'Ngươi bế đứa nhỏ ra trong lúc báo mải ăn. Danh vọng +8.'},fail:()=>{fight('bao',{scale:1});return 'Con báo không mắc lừa.'}},
  ]},
k_nv_thuhung:{loc:'nhiemvu',w:1,cond:()=>S.turn>=8,who:'hunglam',title:'Thư gửi Hùng gia',
  text:()=>'Nhiệm vụ đường giao ngươi đưa một phong thư niêm phong tới trạm gác Hùng gia. Hùng Lâm đứng chờ ở ranh giới, khoanh tay: "Cổ Nguyệt gửi con nít đi đưa thư à?"',
  choices:[
    {t:'Đưa thư, không nói thêm',eff:()=>{AFTER.nv();return 'Hùng Lâm giật lấy phong thư, hừ một tiếng.'}},
    {t:'Lén đọc thư trước khi giao',check:['tamco',12],ok:()=>{AFTER.nv();S.tamco++;S.f.hungSecret=1;return 'Hai tộc đang bàn chuyện đổi mảnh rừng phía nam. Biết trước, sau này có lúc dùng được. Tâm cơ +1.'},fail:()=>{S.susp+=10;rel('hunglam',-10);return 'Dấu niêm bị lệch. Hùng Lâm nhận ra. Hiềm nghi +10.'}},
    {t:'Khiêu khích Hùng Lâm',tag:'ma',eff:()=>{rel('hunglam',-15);fight('hunglam',{mod:.7});return '"Hùng gia chỉ còn loại như ngươi ra đón khách?"'}},
  ]},
k_nv_khoco:{loc:'nhiemvu',w:1,once:1,cond:()=>S.turn>=5,title:'Kiểm kê kho cổ',
  text:()=>'Ngươi được cử phụ kiểm kê kho cổ trùng của gia tộc. Trong một hũ ghi "Bạch Thỉ Cổ, chết" có một con đang thở rất khẽ: Liễm Tức Cổ, loại cổ biết giả chết.',
  choices:[
    {t:'Giấu nó vào tay áo',tag:'ma',check:['tamco',13],ok:()=>{gainGu('liemtuc');return 'Sổ sách vẫn ghi "chết". Không ai biết.'},fail:()=>{S.susp+=20;S.danh-=6;return 'Người giữ kho bắt gặp. Hiềm nghi +20, danh vọng −6.'}},
    {t:'Báo lại cho người giữ kho',tag:'chinh',eff:()=>{S.danh+=6;AFTER.nv();return 'Ghi công cẩn thận. Danh vọng +6.'}},
  ]},
k_nv_sanheo:{loc:'nhiemvu',w:2,title:'Săn heo rừng theo tổ',
  text:()=>'Nhiệm vụ đường gom mấy học trò lại, giao săn một đàn heo rừng đang phá ruộng trà. Mấy đứa kia nhìn nhau, đợi xem ai xông lên trước.',
  choices:[
    {t:'Dẫn đầu',eff:()=>{fight('heorung',{scale:1,elite:Math.random()<.3,after:'nv'});S.danh+=3;return 'Ngươi xông lên trước. Danh vọng +3.'}},
    {t:'Để bọn chúng lên trước, ngươi nhặt công',tag:'ma',check:['tamco',10],ok:()=>{AFTER.nv();return 'Heo gục, ngươi đâm nhát cuối. Công lao ghi tên ngươi.'},fail:()=>{S.danh-=4;return 'Cả tổ biết ngươi trốn việc. Danh vọng −4.'}},
  ]},

/* ---- Hậu sơn: khi chưa tới lúc xuống tầng sâu hơn ---- */
k_hs_haunhi:{loc:'hauson',w:2,title:'Bầy khỉ canh rượu',
  text:()=>'Ở cửa khe, một bầy khỉ đang chuyền tay nhau vò hầu nhi tửu. Con đầu đàn nhe răng khi thấy ngươi.',
  choices:[
    {t:'Đuổi bầy khỉ',eff:()=>{fight('hauquan',{scale:1});return ''}},
    {t:'Đổi trái cây lấy rượu',req:()=>S.stones>=4,reqT:'Cần 4 nguyên thạch',eff:()=>{S.stones-=4;S.wine++;return 'Con đầu đàn nhận quả, ném lại một vò rượu. +1 tứ vị tửu.'}},
  ]},
k_hs_tiengvong:{loc:'hauson',w:2,title:'Tiếng vọng trong khe',
  text:()=>'Gió lùa qua khe đá tạo thành những tiếng vọng lúc trầm lúc bổng, như có người đang ngâm thơ.',
  choices:[
    {t:'Ngồi nghe cho ra quy luật',check:['ngo',11],ok:()=>{S.f.hsBonus=(S.f.hsBonus||0)+2;return 'Đó là nhịp của trận pháp bên trong. Thám hiểm hậu sơn +2.'},fail:()=>'Chỉ là tiếng gió.'},
    {t:'Dưỡng thần trong khe',eff:()=>{S.ess=Math.min(maxEss(),S.ess+20);return 'Chân nguyên +20.'}},
  ]},
k_hs_vorruou:{loc:'hauson',w:1,title:'Vò rượu vỡ',
  text:()=>'Giữa đá vụn có mấy vò rượu cũ nứt vỡ, rượu đã khô thành lớp cặn đỏ quánh. Mùi thơm vẫn nồng.',
  choices:[
    {t:'Vét cặn rượu',eff:()=>{if(Math.random()<.5){S.wine++;return 'Đủ để làm một vò tứ vị tửu. +1 tứ vị tửu.'}S.hp-=8;return 'Mảnh sành cứa vào tay. Khí huyết −8.'}},
    {t:'Để yên, cho Tửu Trùng ngửi',req:()=>hasGu('tuutrung'),reqT:'Cần Tửu Trùng',eff:()=>{S.prog+=20;return 'Tửu Trùng no say, chân nguyên trong không khiếu tinh luyện thêm một lượt. Tu vi +20.'}},
  ]},

/* ================= Mốc nguyên tác bổ sung (NGUYEN_TAC_Q1.md: ch 66, 87–97, 107–112, 114–116, 147–150) =================
   Mỗi cảnh bật cờ mà về sau có sự kiện đọc: tlBan, hungPlot, soiCuop, vuongNhi, benhXa. */

// Ch 111–112 (đã đối chiếu): Phương Nguyên bán tửu lâu và trúc lâu cho cậu lấy nguyên thạch, mua Xích Thiết Xá Lợi Cổ của thương đội Cổ Phú.
k_tr_banlai:{loc:'trai',w:4,once:1,cond:()=>S.f.tuulau&&S.turn>=9&&!S.f.tlBan,title:'Bán lại gia nghiệp',who:'caumo',
  scene:{
    start:'tra',budget:2,
    nodes:{
      tra:{
        talk:()=>[
          ['','Cậu Cổ Nguyệt Đống Thổ tới tửu lâu, tự tay rót trà cho ngươi. Mợ đứng sau, cười gượng.'],
          ['caumo','Nguyên nhi, cháu còn nhỏ, lại bận tu luyện, trông quán làm gì cho mệt. Tửu lâu với trúc lâu, cậu mợ mua lại hết, trả cháu một khoản nguyên thạch. Người một nhà cả.'],
          ...(S.f.caravan?[['','Ngươi nhớ quầy thương đội Cổ Phú đang bày một con Xích Thiết Xá Lợi Cổ. Muốn lên Nhị chuyển đỉnh phong nhanh thì cần nó, mà nó đắt.']]:[]),
          ...(S.f.tramthuySpy&&!S.f.tramthuyGone?[['','Trầm Thúy đứng pha trà sau quầy, khẽ lắc đầu với ngươi.']]:[])
        ],
        choices:()=>[
          {t:'Hỏi cậu lấy tiền ở đâu ra',stay:1,check:['tamco',11],flag:'no_mac',ok:()=>'Cậu ấp úng. Mợ lỡ miệng: tiền vay của Mạc gia, giấy nợ còn nằm trong rương nhà cậu.',fail:()=>'Cậu cười xòa: "Tiền dành dụm cả đời."'},
          {t:'Hỏi cậu còn cất giữ gì của cha mẹ',stay:1,flag:'ngocbi',say:'Mợ buột miệng: trong rương có con Ngọc Bì Cổ, của cha ngươi để lại. Cậu trừng mắt với bà.'},
          ...(S.f.caravan&&!hasGu('xaloi2')?[{t:'Bán cả tửu lâu lẫn trúc lâu, cầm tiền tới thương đội mua Xích Thiết Xá Lợi Cổ',canon:1,go:'xaloi'}]:[]),
          {t:'Mặc cả: một trăm hai mươi khối, không bớt',check:['tamco',13],okGo:'giacao',failGo:'giathap'},
          {t:'Bán, nhưng đổi lấy con Ngọc Bì Cổ của cha cộng sáu mươi khối',hidden:'ngocbi',go:'ngocbi'},
          {t:'Bán, nhưng đổi lấy tờ giấy nợ của Mạc gia cộng năm mươi khối',hidden:'no_mac',tag:'ma',go:'giayno'},
          ...(S.f.tramthuySpy&&!S.f.tramthuyGone?[{t:'Bán, nhưng Trầm Thúy phải theo ngươi, cộng bảy mươi khối',go:'tramthuy'}]:[]),
          {t:'Không bán. Tửu lâu là của cha mẹ',tag:'chinh',go:'khongban'},
        ]
      },
      xaloi:{talk:[['','Cậu mợ trả tiền nhanh đến mức ngươi biết họ đã chờ ngày này từ lâu. Ngay chiều hôm đó, ngươi đặt cả túi nguyên thạch lên quầy thương đội Cổ Phú.'],['giaphu','Xích Thiết Xá Lợi? Tiểu huynh đệ có mắt nhìn.']],
        eff:()=>{S.f.tuulau=0;S.f.tlBan='xaloi';gainGu('xaloi2');S.stones+=20;rel('caumo',-5);later('q_tlchay',4,7);return 'Tửu lâu và trúc lâu về tay cậu mợ. Ngươi mua Xích Thiết Xá Lợi Cổ, còn dư 20 nguyên thạch.'}},
      giacao:{talk:[['caumo','...Một trăm hai mươi thì một trăm hai mươi!'],['','Mợ run tay đếm từng viên. Cậu nhìn ngươi như nhìn người lạ.']],
        eff:()=>{S.stones+=120;S.f.tuulau=0;S.f.tlBan='gia';rel('caumo',-10);later('q_tlchay',4,7);return 'Bán tửu lâu: +120 nguyên thạch. Từ nay không còn tiền tửu lâu mỗi tuần.'}},
      giathap:{talk:[['caumo','Trẻ con mà đòi giá đó? Bảy mươi, không hơn. Không bán thì thôi.']],
        choices:[{t:'Bảy mươi cũng được',eff:()=>{S.stones+=70;S.f.tuulau=0;S.f.tlBan='re';later('q_tlchay',4,7);return 'Bán tửu lâu: +70 nguyên thạch.'}},{t:'Thôi, không bán',go:'khongban'}]},
      ngocbi:{talk:[['','Cậu đỏ mặt mở rương. Trong một hộp gỗ lót lụa, Ngọc Bì Cổ vẫn còn sống, được nuôi cẩn thận suốt mấy năm.'],['caumo','...Cha cháu dặn giữ cho cháu. Cậu định đợi cháu lớn.']],
        eff:()=>{gainGu('ngocbi');S.stones+=60;S.f.tuulau=0;S.f.tlBan='ngocbi';rel('caumo',10);return 'Nhận Ngọc Bì Cổ và 60 nguyên thạch. Tửu lâu về tay cậu mợ.'}},
      giayno:{talk:[['','Cậu tái mặt, nhưng vẫn đưa tờ giấy nợ Mạc gia ra. Có nó trong tay, Mạc gia sẽ phải nể ngươi vài phần.']],
        eff:()=>{S.stones+=50;S.f.tuulau=0;S.f.tlBan='giayno';S.f.giayNoMac=1;rel('caumo',-20);return '+50 nguyên thạch và giấy nợ Mạc gia. Cậu mợ giờ nợ Mạc gia mà không còn gì để cầm cố.'}},
      tramthuy:{talk:[['tramthuy','Thiếu gia...'],['','Cậu mợ nhìn nhau rồi gật đầu. Một tỳ nữ, đổi lấy cả tửu lâu, với họ là món hời.']],
        eff:()=>{S.stones+=70;S.f.tuulau=0;S.f.tlBan='tramthuy';S.f.eyes=1;rel('tramthuy',30);return '+70 nguyên thạch. Trầm Thúy về hẳn bên ngươi.'}},
      khongban:{talk:[['caumo','Được, được lắm. Cháu nhớ lời hôm nay.']],
        eff:()=>{S.f.tlBan='khong';rel('caumo',-15);later('q_tlpha',3,5,'tuulau');return 'Cậu mợ ra về, mặt hằm hằm.'}},
    }
  }},
q_tlchay:{title:'Tửu lâu đổi chủ',who:'caumo',cond:()=>!S.f.tuulau,
  text:()=>'Tửu lâu vào tay cậu mợ chưa được bao lâu thì ế khách. '+(S.f.tlBan==='giayno'?'Mạc gia tới đòi nợ, cậu mợ không còn gì để trả.':'Mợ đứng chửi đổng giữa phố, nói ngươi bán cho họ một cái quán chết.'),
  choices:()=>[
    ...(S.f.giayNoMac?[{t:'Mang giấy nợ tới gặp Mạc Trần, bán lại cho lão',tag:'ma',eff:()=>{S.stones+=40;S.f.giayNoMac=0;rel('mactran',15);return 'Mạc Trần trả 40 nguyên thạch và coi ngươi là người biết điều.'}},
      {t:'Dùng giấy nợ ép cậu mợ nộp tiền hằng tháng',tag:'ma',check:['tamco',12],ok:()=>{S.f.tuulau=1;return 'Cậu mợ cúi đầu: tửu lâu vẫn tên họ, nhưng mỗi tuần nộp cho ngươi một phần.'},fail:()=>{rel('caumo',-20);S.danh-=5;return 'Cậu mợ khóc lóc khắp trại. Danh vọng −5.'}}]:[]),
    {t:'Mặc kệ',eff:()=>'Chuyện của họ.'},
  ]},
q_tlpha:{title:'Tửu lâu bị phá',who:'caumo',cond:()=>S.f.tuulau,
  text:()=>'Đêm qua có kẻ đập vỡ vò rượu, xé sổ sách của tửu lâu. Hàng xóm thấy người của cậu mợ lảng vảng.',
  choices:[
    {t:'Tới nhà cậu làm cho ra lẽ',tag:'ma',check:['satphat',12],ok:()=>{rel('caumo',-20);S.stones+=15;return 'Cậu đền 15 nguyên thạch, hứa không tái phạm.'},fail:()=>{S.danh-=5;return 'Không có chứng cứ. Cậu mợ quay ra kể ngươi bất hiếu. Danh vọng −5.'}},
    {t:'Tự sửa lại, thuê người canh đêm',req:()=>S.stones>=10,reqT:'Cần 10 nguyên thạch',eff:()=>{S.stones-=10;return 'Tửu lâu mở cửa lại sau ba ngày.'}},
  ]},

// Ch 94–95, 132–134 (đã đối chiếu): Phương Nguyên dụ bầy sói vào tiểu tổ đối thủ trong tộc, trừ khử họ và lấy cổ, lấy chiến công.
k_nui_dusoi:{loc:'nui',w:4,once:1,cond:()=>S.turn>=(S.tideT||19)-4&&S.turn<(S.tideT||19)+2,title:'Tiểu tổ Tiêu Tam',
  scene:{
    start:'rung',budget:2,
    nodes:{
      rung:{
        talk:()=>[
          ['','Tiểu tổ của Tiêu Tam đi tuần cùng hướng với ngươi. Tiêu Tam là kẻ từng cấu kết với cậu ngươi để trì hoãn chuyện chia gia sản. Túi cổ bên hông cả nhóm căng phồng, chiến công của họ dẫn đầu khóa này.'],
          ['','Cách đó không xa, một bầy Điện Lang đang lang thang theo mùi máu.'],
          ...(hasGu('diathinh')?[['','Địa Thính Nhục Nhĩ Thảo trên tai ngươi khẽ rung. Ngươi nghe rõ họ đang bàn chuyện gì.']]:[])
        ],
        choices:()=>[
          {t:hasGu('diathinh')?'Lắng nghe bằng Địa Thính Nhục Nhĩ Thảo':'Bò lại gần nghe lén',stay:1,flag:'nghe',check:['tamco',hasGu('diathinh')?6:12],ok:()=>'Tiêu Tam dặn người trong tổ: tuần sau đi nhận thưởng thì khai công lao về mình, còn gã học trò Bính đẳng họ Phương thì đẩy đi canh chỗ nguy hiểm nhất.',fail:()=>{S.hp=Math.max(1,S.hp-10);return 'Cành khô gãy dưới chân. Ngươi lùi lại kịp, nhưng bị gai cào rách vai. Khí huyết −10.'}},
          {t:'Rắc huyết khí lên lối họ đi, dụ bầy sói tới',canon:1,dao:15,need:{blood:2},check:['tamco',12],bonus:()=>S.sc&&S.sc.flags.nghe?3:0,okGo:'soi_an',failGo:'soi_quay'},
          {t:'Báo cho Tiêu Tam có bầy sói phía trước, rồi cùng tổ đánh',go:'cung'},
          {t:'Nhân lúc bầy sói tới, đứng ngoài chờ nhặt chiến công',hidden:'nghe',check:['tamco',13],ok:()=>{S.f.soiCuop=1;S.danh+=6;S.stones+=20;return 'Bầy sói xé nát đội hình của Tiêu Tam. Ngươi ra tay đúng lúc hạ con đầu đàn, công lao ghi tên ngươi. Danh vọng +6, +20 nguyên thạch.'},fail:()=>{fight('dlbay',{scale:1});return 'Bầy sói nhìn thấy ngươi trước.'}},
          {t:'Lặng lẽ rút đi',eff:()=>'Chuyện của Hùng gia, để Hùng gia lo.'},
        ]
      },
      soi_an:{talk:[['','Ngươi rắc huyết khí dọc lối mòn rồi rút lên cây. Chưa tới nửa canh giờ, bầy Điện Lang ùa tới theo mùi máu. Tiếng thét của tiểu tổ Tiêu Tam tắt dần.'],['','Khi bầy sói đi qua, ngươi xuống nhặt túi cổ nằm giữa đống xương, rồi mang tai sói về nhiệm vụ đường đổi chiến công.']],
        eff:()=>{S.blood-=2;S.f.soiCuop=1;S.f.tieuTam='chet';S.stones+=45;S.danh+=5;gainGu(pick(['cuongnham','hacthi','bachthi','trilieu']));S.susp+=8;return 'Túi cổ của tiểu tổ Tiêu Tam: +45 nguyên thạch và một con cổ. Chiến công đổi được danh vọng +5. Hiềm nghi +8.'}},
      soi_quay:{talk:[['','Gió đổi chiều. Bầy sói ngửi thấy mùi máu trên tay ngươi trước.']],
        eff:()=>{S.blood-=2;fight('dlbay',{scale:1});return 'Bầy Điện Lang quay sang ngươi!'}},
      cung:{talk:[['','Tiêu Tam nhìn ngươi nghi ngờ, nhưng vẫn cho cả tổ quay lại đội hình. Bầy sói lao tới.']],eff:()=>{S.f.tieuTam='cuu';S.f.hungPlot=1;fight('dlbay',{scale:1,mod:.8,after:'lang_cung'});return 'Có người đứng cạnh, bầy sói không vây được ngươi.'}},
    }
  }},

// Ch 65–68 (đã đối chiếu): Vương Nhị là thợ săn; Phương Nguyên giết hắn rồi giết cả lão Vương và con gái để lấy tấm bản đồ da thú. Ch 175: Thiết Nhược Nam vạch trần.
k_nui_vuongnhi:{loc:'nui',w:3,once:1,cond:()=>S.turn>=5&&S.turn<=14,title:'Tấm bản đồ da thú',
  text:()=>'Vương Nhị, thợ săn phàm nhân, khoe trong quán rượu rằng nhà hắn giữ một tấm bản đồ da thú đời ông để lại: vẽ đường tới vách đá phía bắc, nơi có bầy Ngọc Nhãn Thạch Hầu. Cổ trên người khỉ đá bán được giá cao.',
  choices:[
    {t:'Mua lại tấm bản đồ',req:()=>S.stones>=25,reqT:'Cần 25 nguyên thạch',eff:()=>{S.stones-=25;S.f.banDoDa=1;S.f.vuongNhi='mua';return 'Vương Nhị đếm tiền, dúi tấm da thú cho ngươi. Hắn sẽ kể cho cả trại nghe ngươi mua nó.'}},
    {t:'Theo hắn về nhà, chờ đêm xuống rồi lấy',canon:1,dao:15,drift:6,check:['tamco',12],ok:()=>{S.f.banDoDa=1;S.f.vuongNhi='chet';S.susp+=6;later('q_vuonglaohan',2,4,'!tieGone');return 'Vương Nhị không kịp kêu. Tấm bản đồ không ở trên người hắn mà ở trong nhà. Hiềm nghi +6.'},fail:()=>{S.f.vuongNhi='nghi';S.susp+=10;return 'Vương Nhị phát hiện có người theo, chạy vào nhà đóng cửa. Hiềm nghi +10.'}},
    {t:'Rủ hắn cùng đi săn khỉ đá, chia đôi',check:['tamco',10],ok:()=>{S.f.banDoDa=1;S.f.vuongNhi='ban';return 'Vương Nhị đồng ý dẫn đường. Có thêm một người biết chỗ, nhưng không ai phải chết.'},fail:()=>'Hắn cười khẩy: “Cổ sư mà chia đôi với thợ săn? Ai tin.”'},
    {t:'Không quan tâm',eff:()=>'Chuyện của phàm nhân.'},
  ]},
q_vuonglaohan:{title:'Nhà Vương lão hán',
  text:()=>'Lão thợ săn Vương đi khắp trại hỏi ai thấy con trai lão. Tấm bản đồ da thú vẫn nằm trong rương nhà lão, con gái lão canh bên cạnh.',
  choices:[
    {t:'Vào nhà lão lấy bản đồ, không để lại ai',canon:1,dao:20,eff:()=>{S.f.banDoDa=1;S.f.vuongLao=2;S.susp+=15;return 'Nhà Vương lão hán không còn ai. Tấm bản đồ da thú giờ ở trong tay ngươi. Hiềm nghi +15.'}},
    {t:'Mua bản đồ từ lão bằng giá cao',req:()=>S.stones>=30,reqT:'Cần 30 nguyên thạch',eff:()=>{S.stones-=30;S.f.banDoDa=1;S.f.vuongLao=1;return 'Lão bán, tay run run. Lão nhìn ngươi rất lâu. Lão sẽ kể với bất kỳ ai chịu nghe.'}},
    {t:'Bỏ qua tấm bản đồ',eff:()=>{S.f.vuongLao=1;S.susp+=6;return 'Lão vẫn đi hỏi khắp nơi. Hiềm nghi +6.'}},
  ]},

// Ch 87–97: tiểu tổ Bệnh Xà gần như chết hết.
k_nv_benhxa:{loc:'nhiemvu',w:3,once:1,cond:()=>S.turn>=8&&S.turn<18,title:'Tiểu tổ Bệnh Xà',
  text:()=>'Nhiệm vụ đường cử ngươi đi đón tiểu tổ Bệnh Xà về. Ngươi tới nơi chỉ thấy xác người và rắn. Người sống sót duy nhất là Hoa Hân, chân bị rắn độc cắn thâm đen, đang lê về phía ngươi. Bên cạnh là mấy túi cổ của người chết.',
  choices:[
    {t:'Cõng Hoa Hân về trại',tag:'chinh',eff:()=>{S.f.benhXa='cuu';S.danh+=10;rel('toctruong',5);fight('docxa',{scale:1.3});return 'Rắn độc còn quanh đây. Ngươi phải đánh để mở đường. Danh vọng +10.'}},
    {t:'Lấy túi cổ của người chết, bỏ lại Hoa Hân',tag:'ma',dao:20,drift:6,eff:()=>{S.f.benhXa='cuop';S.stones+=35;gainGu(pick(['trilieu','bachthi','nguyetquang']));S.susp+=10;return 'Ngươi nhặt túi cổ rồi quay đi. Tiếng gọi sau lưng tắt dần. +35 nguyên thạch. Hiềm nghi +10.'}},
    {t:'Cho Hoa Hân một gốc linh dược, lấy nửa số túi cổ làm công',req:()=>S.herbs>=1,reqT:'Cần 1 linh dược',eff:()=>{S.herbs--;S.f.benhXa='chia';S.stones+=18;return 'Hoa Hân gật đầu, không nói gì. Hai người cùng về trại. +18 nguyên thạch.'}},
  ]},

// Ch 114–116: giết Thạch Hầu Vương, lấy Ẩn Thạch cổ. Ẩn Thạch hợp với vảy cá thành Ẩn Lân.
k_nui_thachhau:{loc:'nui',w:2,once:1,cond:()=>(S.turn>=10||S.f.banDoDa)&&!hasGu('anlan'),title:'Thạch Hầu Vương',
  text:()=>'Trên vách đá phía bắc, một con khỉ đá to gấp ba người ngồi giữa bầy khỉ. Trên đỉnh đầu nó có một con cổ xám như hòn sỏi: Ẩn Thạch Cổ, thứ giúp nó hòa vào vách núi.',
  choices:[
    {t:'Tìm chỗ vách đá lõm để dụ nó xuống, rồi đánh',eff:()=>{fight('thachhau',{scale:1,after:'thachhau',terrain:'khe',adv:'Dụ Thạch Hầu Vương xuống khe hẹp'});return 'Thạch Hầu Vương gầm lên, nhảy xuống khe.'}},
    {t:'Rình lúc nó ngủ, cắt lấy Ẩn Thạch',check:['tamco',14],bonus:()=>S.f.banDoDa?4:0,ok:()=>{S.f.anThach=1;return 'Ngươi lấy được Ẩn Thạch Cổ mà nó không kịp tỉnh. Giờ chỉ cần một mảnh vảy cá là hợp thành Ẩn Lân.'},fail:()=>{fight('thachhau',{scale:1.2,after:'thachhau'});return 'Nó mở mắt.'}},
    {t:'Để lại',eff:()=>'Ngươi ghi nhớ chỗ này.'},
  ]},
k_nui_nguulan:{loc:'nui',w:3,once:1,cond:()=>S.f.anThach&&!hasGu('anlan'),title:'Vảy cá dưới suối',
  text:()=>'Dưới suối lạnh có một con cá vảy bạc lớn, vảy lấp lánh như gương. Ẩn Thạch Cổ trong không khiếu ngươi khẽ động.',
  choices:[{t:'Bắt cá, hợp luyện Ẩn Thạch với vảy cá',check:['ngo',11],ok:()=>{S.f.anThach=0;gainGu('anlan');return 'Ẩn Thạch nuốt vảy cá, hóa thành Ẩn Lân Cổ.'},fail:()=>'Cá quẫy mạnh, trốn mất. Lần sau.'}]},

/* ================= BÍ TÀNG: mỗi kiếp một chỗ khác ================= */
x_cache:{title:'Kỳ ngộ',
  text:()=>{const c=S.cache[S.curCache];return {
    dicot:'Dưới gốc tùng cổ có bộ xương khô mặc áo Cổ sư, tay còn nắm chặt túi cổ. Xung quanh rải rác xác côn trùng đã chết, có lẽ độc cổ của hắn vẫn còn canh giữ.',
    tinhthach:'Trận sạt lở đêm qua để lộ một mạch nguyên thạch lấp lánh trong vách đá. Chưa ai phát hiện.',
    linhduoc:'Sau bụi gai rậm là một vườn linh dược hoang, cây nào cũng đã trăm năm tuổi. Có dấu chân thú lớn quanh vườn.',
    bikip:'Trong hốc đá có một hộp gỗ mục, bên trong là bút ký luyện cổ của một tiền bối vô danh.',
    hauquan:'Hốc cây cổ thụ sâu hoắm, bên trong xếp đầy vò rượu khỉ ủ. Bầy khỉ đang ngủ say trên cành.',
    tocong:'Vách đá lỗ chỗ như tổ ong. Từ mỗi lỗ nhỏ vang ra tiếng rì rì: một tổ cổ hoang đang nở.',
  }[c.kind]},
  choices:()=>{const c=S.cache[S.curCache],done=()=>{c.done=1};return {
    dicot:[{t:'Lấy túi cổ',check:['ngo',11],ok:()=>{done();const k=pick(CARAVAN.filter(k=>k.indexOf('xaloi')<0));gainGu(k);S.stones+=40;return `Độc cổ trong túi đã chết từ lâu. Ngươi thu ${GU[k].n} và 40 nguyên thạch.`},fail:()=>{done();S.hp=Math.max(1,S.hp-25);S.stones+=40;return 'Độc cổ còn sống, cắn trúng tay ngươi (−25 khí huyết). Cổ trong túi bị nó ăn mất, chỉ còn 40 nguyên thạch.'}},
           {t:'Đốt cả túi cho an toàn',eff:()=>{done();S.stones+=20;return 'Lửa bén, độc cổ cháy rụi. Tro còn lại vài viên nguyên thạch (+20).'}}],
    tinhthach:[{t:'Đào hết trong một đêm',eff:()=>{done();const n=rand(60,100);S.stones+=n;S.susp+=5;return `+${n} nguyên thạch. Sáng ra có người thấy vết đào (hiềm nghi +5).`}},
               {t:'Báo cho gia tộc',tag:'chinh',eff:()=>{done();S.danh+=12;S.stones+=25;return 'Gia tộc thưởng 25 nguyên thạch, danh vọng +12.'}}],
    linhduoc:[{t:'Hái sạch',eff:()=>{done();S.herbs+=4;fight('hachung',{scale:1});return 'Ngươi hái được 4 gốc linh dược thì chủ nhân của vườn trở về.'}},
              {t:'Hái vài gốc rồi rút',check:['tamco',11],ok:()=>{done();S.herbs+=2;return '+2 linh dược, lặng lẽ rời đi.'},fail:()=>{done();S.herbs+=2;fight('hachung',{scale:1});return 'Cành khô gãy dưới chân. Có tiếng gầm sau lưng.'}}],
    hauquan:[{t:'Ôm hết rượu đi',eff:()=>{done();S.wine+=2;fight('hauquan',{scale:1});return '+2 tứ vị tửu. Bầy khỉ thức giấc.'}},
             {t:'Lấy một vò rồi rút',check:['tamco',10],ok:()=>{done();S.wine++;S.f.hsBonus=(S.f.hsBonus||0)+2;return '+1 tứ vị tửu. Hậu sơn +2.'},fail:()=>{done();fight('hauquan',{scale:1});return 'Một con khỉ mở mắt.'}}],
    tocong:[{t:'Luyện hóa con cổ mạnh nhất trong tổ',check:['ngo',12],ok:()=>{done();const k=pick(['toanphong','dongbi','thanhti','tieuguang']);gainGu(k);return `Luyện hóa thành công ${GU[k].n}.`},fail:()=>{done();S.hp=Math.max(1,S.hp-20);gainGu(pick(WILD));return 'Cả tổ nổi giận (−20 khí huyết). Ngươi chỉ kịp chộp một con.'}},
            {t:'Hốt vài con nhỏ bán ở chợ',eff:()=>{done();S.stones+=35;return 'Bán cổ non được 35 nguyên thạch.'}}],
    bikip:[{t:'Nghiền ngẫm bút ký',check:['ngo',10],ok:()=>{done();S.ngo++;S.f.refineBonus=(S.f.refineBonus||0)+12;return 'Ngộ tính +1. Tỉ lệ luyện cổ +12%.'},fail:()=>{done();S.f.refineBonus=(S.f.refineBonus||0)+6;return 'Chữ viết quá khó hiểu, chỉ lĩnh hội được đôi phần (luyện cổ +6%).'}}],
  }[c.kind]}},
r_tinbitang:{loc:'trai',w:3,cond:()=>(S.cache||[]).some(c=>!c.done&&!c.rumor&&S.turn<=c.to),title:'Tin đồn trong tửu quán',
  text:()=>{const c=S.cache.find(c=>!c.done&&!c.rumor&&S.turn<=c.to);return `Mấy gã thợ săn ngà ngà say thì thầm: ${CACHE[c.kind].rumor}, đâu đó quanh ${LOC_NAME[c.loc]}.`},
  choices:()=>[{t:'Mời thêm vò rượu để hỏi cho rõ',req:()=>S.stones>=3,reqT:'Cần 3 nguyên thạch',eff:()=>{const c=S.cache.find(c=>!c.done&&!c.rumor&&S.turn<=c.to);c.rumor=1;S.stones-=3;return `Theo lời họ, nên đến ${LOC_NAME[c.loc]} trong khoảng tháng ${Math.ceil(c.from/3)} đến tháng ${Math.ceil(c.to/3)}.`}},
               {t:'Nghe cho vui',eff:()=>''}]},

/* ================= TỬ KIẾP: trận không chạy được ================= */
r_tukiep:{loc:'nui',w:2,cond:()=>S.turn>=(W('matu')?5:8)&&!S.f.tukiepDone,title:'Huyết Thủ ma tu',
  text:()=>'Mùi máu tanh nồng trong gió. Trên tảng đá giữa khe núi, một ma tu Tam chuyển áo đỏ thẫm đang gặm dở một thi thể Cổ sư. Hắn ngẩng lên, nhìn thẳng vào ngươi.'+(mem('tukiep')?' Ký ức kiếp trước gào thét: kiếp trước ngươi đã chết ở chính chỗ này.':''),
  choices:()=>[
    ...(mem('tukiep')?[{t:'Theo ký ức, lùi lại trước khi hắn kịp nhìn thấy',eff:()=>{S.f.tukiepDone=1;S.stones+=30;return 'Ngươi vòng qua sườn tây, nhặt được túi thạch của một nạn nhân cũ (+30). Hắn không hề biết ngươi đã đến.'}}]:[]),
    {t:'Quỳ xuống, dâng hết nguyên thạch và một con cổ',check:['tamco',14],
      ok:()=>{S.f.tukiepDone=1;learn('tukiep');S.stones=0;const i=S.gu.findIndex(g=>GU[g.k].t!=='fate');if(i>=0){log(`Mất ${GU[S.gu[i].k].n}.`,'danger');S.gu.splice(i,1)}return 'Hắn cười khẩy, nhận đồ rồi phẩy tay. Ngươi sống, nhưng trắng tay.'},
      fail:()=>{S.f.tukiepDone=1;learn('tukiep');fight('madutam',{after:'tukiep',flee:false});return 'Hắn nhận đồ, rồi vẫn đứng dậy. "Thịt Cổ sư trẻ mới ngon."'}},
    {t:'Liều chết',eff:()=>{S.f.tukiepDone=1;learn('tukiep');fight('madutam',{after:'tukiep',flee:false});return 'Ngươi biết khoảng cách giữa hai bên. Nhưng không còn đường nào khác.'}},
    {t:'Quay đầu bỏ chạy',check:['satphat',17],
      ok:()=>{S.f.tukiepDone=1;learn('tukiep');S.hp=Math.max(1,S.hp-30);return 'Một móng vuốt máu sượt qua lưng (−30 khí huyết), nhưng ngươi lăn xuống vực suối và thoát.'},
      fail:()=>{S.f.tukiepDone=1;learn('tukiep');fight('madutam',{after:'tukiep',flee:false});return 'Chưa chạy được mười bước, bóng đỏ đã chắn trước mặt.'}},
  ]},
x_giave:{title:'Cổ gia báo thù',
  text:()=>'Đêm không trăng. Ba bóng người áo đen chặn ngươi ở con hẻm sau tửu lâu. Kẻ cầm đầu là hộ vệ Nhị chuyển của Cổ Phú. Cổ Phú chưa từng tin lời ngươi.'+(mem('giave')?' Ngươi đã chờ sẵn đêm này.':''),
  choices:()=>[
    ...(mem('giave')?[{t:'Kích hoạt bẫy độc đã giăng từ trước',check:['tamco',12],bonus:()=>4,
      ok:()=>{fight('giave',{after:'giave',flee:false,mod:.6});return 'Hai tên ngã xuống vì độc. Chỉ còn kẻ cầm đầu, đang thở dốc.'},
      fail:()=>{fight('giave',{after:'giave',flee:false,mod:.85});return 'Bẫy chỉ hạ được một tên.'}}]:[]),
    {t:'Nghênh chiến',eff:()=>{learn('giave');fight('giave',{after:'giave',flee:false});return 'Không có đường lui trong con hẻm cụt.'}},
    {t:'Hô hoán cầu cứu tộc nhân',check:['tamco',15],
      ok:()=>{learn('giave');S.f.giaveDone=1;S.danh+=5;return 'Tộc nhân Cổ Nguyệt ùa ra. Bọn áo đen tháo chạy. Nhưng giờ cả trại đều biết Cổ gia nhắm vào ngươi.'},
      fail:()=>{learn('giave');fight('giave',{after:'giave',flee:false,mod:1.1});return 'Tiếng hô tắt nghẹn. Lưỡi dao đã kề cổ.'}},
  ]},

/* ================= NGẪU NHIÊN: NHIỆM VỤ ================= */
r_hotong:{loc:'nhiemvu',w:2,title:'Hộ tống hái trà',
  text:()=>'Ngươi hộ tống phàm nhân lên đồi trà. Sơn tặc phục sẵn ở khúc quanh.',
  choices:[
    {t:'Đánh',eff:()=>{fight('sontac',{scale:1,after:'nv'});return ''}},
    {t:'Bỏ phàm nhân lại, tự lui',tag:'ma',eff:()=>{S.danh-=8;return 'Vài phàm nhân chết. Danh vọng −8.'}},
  ]},
r_dietoso:{loc:'nhiemvu',w:2,title:'Diệt ổ Điện Lang',
  text:()=>'Gia tộc giao nhiệm vụ diệt một ổ Điện Lang gần ruộng trà.',
  choices:[{t:'Xuất phát',eff:()=>{fight('dienlang',{scale:1,after:'nv'});return ''}}]},
r_canhgac:{loc:'nhiemvu',w:1,title:'Canh gác đêm',
  text:()=>'Ca gác đêm trên tường trại, gió lạnh thấu xương.',
  choices:[
    {t:'Canh gác nghiêm túc',tag:'chinh',eff:()=>{S.danh+=5;return 'Danh vọng +5.'}},
    {t:'Lén ngồi tu luyện',eff:()=>{S.prog+=20;if(Math.random()<.3){S.danh-=5;return 'Tu vi +20, nhưng bị bắt gặp. Danh vọng −5.'}return 'Tu vi +20.'}},
  ]},
r_thunguyetlan:{loc:'nhiemvu',w:1,title:'Thu hoạch nguyệt lan',
  text:()=>'Ngươi được giao thu hoạch nguyệt lan cho kho gia tộc.',
  choices:[
    {t:'Giấu bớt một phần',tag:'ma',eff:()=>{S.f.freeMoon=3;S.susp+=5;return 'Đủ cho Nguyệt Quang Cổ ăn 3 tuần. Hiềm nghi +5.'}},
    {t:'Làm đúng phận sự',tag:'chinh',eff:()=>{S.danh+=3;return 'Danh vọng +3.'}},
  ]},

/* ================= TUYẾN TRUYỆN NPC (ĐỢT 4) ================= */

// --- 1. Tuyến Phương Chính ---
npc_pc_1:{title:'Hào quang của Phương Chính',hint:'Phương Chính được khen thưởng',cond:()=>S.turn>=5&&S.turn<=7&&!(S.f.npc_pc_1),
  text:()=>{
    S.npcProg.phuongchinh=2;
    const r=(S.var||{}).phuongchinh_route;
    if(r==='kieu_ngao'){
      return 'Phương Chính được học đường gia lão biểu dương trước toàn thể học trò, ban thưởng một con Nguyệt Quang Cổ thượng phẩm và 20 nguyên thạch. Tan học, hắn nghênh ngang bước tới trước mặt ngươi: "Ca ca, người Bính đẳng vĩnh viễn không thể hiểu được cảm giác này đâu. Ngươi có nhận thua chưa?"';
    }else{
      return 'Phương Chính được học đường gia lão biểu dương, nhận thưởng Nguyệt Quang Cổ và nguyên thạch. Trái với vẻ hân hoan của gia tộc, hắn bối rối đứng đợi ngươi ở góc hành lang: "Ca ca... đệ không cố ý vượt mặt huynh. Chỗ nguyên thạch này, đệ muốn chia cho huynh..."';
    }
  },
  choices:()=>[
    ...((S.var||{}).phuongchinh_route==='kieu_ngao'?[
      {t:'Tát cho một bạt tai tỉnh ngộ',tag:'ma',check:['satphat',11],
        ok:()=>{rel('phuongchinh',-20);S.tamco++;return 'Một cái tát giòn giã vang lên. Sát khí năm trăm năm ma đạo khiến Phương Chính nghẹn thở, ôm má lùi lại đầy kinh hãi. Tâm cơ +1, quan hệ −20.'},
        fail:()=>{rel('phuongchinh',-15);return 'Phương Chính né được, tức giận quát: "Ngươi ghen tị với ta!" Quan hệ −15.'}},
      {t:'Khen ngợi giả lả, lừa lấy 6 nguyên thạch',tag:'ma',check:['tamco',12],
        ok:()=>{S.stones+=6;rel('phuongchinh',10);return 'Vài câu tán dương ngọt ngào làm Phương Chính nở mũi, vui vẻ móc túi đưa ngươi 6 nguyên thạch (+6 thạch).'},
        fail:()=>{rel('phuongchinh',-10);return 'Hắn cười nhạt: "Muốn lừa thạch của ta sao? Đừng hòng." Quan hệ −10.'}},
      {t:'Lãnh đạm bước qua như người xa lạ',eff:()=>'Ngươi không thèm nhìn hắn lấy một cái. Sự khinh bỉ câm lặng còn làm hắn nhục nhã hơn bất kỳ lời mắng nhiếc nào.'}
    ]:[
      {t:'Vỗ vai nhận lấy thạch, chỉ điểm hắn vài mẹo chân nguyên',tag:'chinh',eff:()=>{S.stones+=5;rel('phuongchinh',20);S.danh+=4;return 'Phương Chính rạng rỡ hẳn lên. Lời chỉ điểm của ngươi mở ra bí quyết điều khiển chân nguyên cho hắn (+5 thạch, quan hệ +20).'}},
      {t:'Nghiêm nghị từ chối, khuyên hắn tự lập',eff:()=>{rel('phuongchinh',15);S.tamco++;return 'Phương Chính ngẩn người, càng thêm kính sợ sự trầm ổn của ngươi (quan hệ +15, Tâm cơ +1).'}},
      {t:'Cướp sạch túi thạch rồi đuổi hắn đi',tag:'ma',eff:()=>{S.stones+=10;rel('phuongchinh',-25);S.susp+=8;S.dao+=8;return 'Ngươi giật phắt túi 10 nguyên thạch: "Đồ ngu, trong giới Cổ sư không có chỗ cho sự thương hại." (+10 thạch, quan hệ −25, hiềm nghi +8).'}},
    ])
  ],
  post:()=>{S.f.npc_pc_1=1;}},

npc_pc_2:{title:'Tiến cảnh Nhị chuyển',hint:'Phương Chính tiến cảnh',cond:()=>S.turn>=14&&S.turn<=16&&S.f.npc_pc_1&&!(S.f.npc_pc_2),
  text:()=>{
    S.npcProg.phuongchinh=3;
    const v=S.rel.phuongchinh||0;
    if(v>=20){
      return 'Phương Chính đột phá Nhất chuyển đỉnh phong, chuẩn bị xung kích Nhị chuyển. Hắn mang theo một bình thảo dược tới '+(S.f.tuulau?'tửu lâu':'nhà')+' tìm ngươi: "Ca ca, đệ sắp ra ngoài săn dã thú. Xin huynh chỉ dẫn thêm kinh nghiệm chiến đấu."';
    }else{
      return 'Dưới sự nâng đỡ của gia lão, Phương Chính tiến bộ vượt bậc. Hắn chặn đường ngươi, mang theo hộ vệ: "Phương Nguyên, ngươi hành sự tà dị, danh tiếng bôi nhọ Cổ Nguyệt. Liệu hồn đừng để ta bắt gặp ngươi làm điều phi pháp."';
    }
  },
  choices:()=>[
    ...((S.rel.phuongchinh||0)>=20?[
      {t:'Truyền dạy tâm pháp săn thú và đối phó lang bầy',tag:'chinh',eff:()=>{rel('phuongchinh',20);S.danh+=4;S.herbs+=1;return 'Hai anh em cùng trao đổi suốt đêm. Phương Chính tặng ngươi 1 phần linh dược (+1 linh dược, quan hệ +20).'}},
      {t:'Đề nghị hắn cùng lập tiểu tổ săn thú',eff:()=>{rel('phuongchinh',25);S.f.pcTeam=1;return 'Phương Chính mừng rỡ đồng ý. Tình cảm huynh đệ thêm gắn kết (quan hệ +25).'}}
    ]:[
      {t:'Cười gằn, dùng sát khí áp chế hắn',check:['tamco',13],
        ok:()=>{rel('phuongchinh',-15);S.tamco++;return 'Phương Chính giật mình lùi lại, tay run rẩy khi đối diện với đôi mắt ma đạo thâm sâu (Tâm cơ +1).'},
        fail:()=>{rel('phuongchinh',-20);fight('hoctro',{scale:1});return 'Phương Chính tức giận ra lệnh cho bạn học cùng vây đánh ngươi.'}},
      {t:'Nhún vai rời đi, không buồn đôi co',eff:()=>{rel('phuongchinh',-5);return 'Ngươi xem hắn như không khí. Phương Chính tức tối dậm chân.'}}
    ])
  ],
  post:()=>{S.f.npc_pc_2=1;}},

// Đi kèm lang triều: c_lang1 đẩy vào ngay sau trận giữ tường (không chờ tuần trống)
npc_pc_3:{title:'Phương Chính ngộ nạn',hint:'Phương Chính bị sói bao vây',cond:()=>S.turn>=18&&S.turn<=21&&!S.f.tideDone&&S.f.npc_pc_2&&!(S.f.npc_pc_3),
  text:()=>'Giữa đêm lang triều gầm rú, một góc tường phía tây sụp đổ. Tiểu tổ Phương Chính bị bầy Điện Lang hung hãn xé rách đội hình. Phương Chính máu me đầy mặt, một con Lôi Quan Lang nhe nanh lao tới hắn. Hắn tuyệt vọng nhìn về phía ngươi!',
  choices:()=>[
    {t:'Lao vào bão sói cứu đệ đệ',tag:'chinh',eff:()=>{
      fight('dienlang',{after:'cuu_pc',flee:false,scale:1.2});
      return 'Ngươi vung nguyệt nhận chém đôi con sói đang vồ tới Phương Chính!';
    }},
    {t:'Khoanh tay đứng nhìn, chờ gia lão tới',eff:()=>{
      S.npcProg.phuongchinh=4;rel('phuongchinh',-40);S.f.pcHate=1;
      return 'Gia lão kịp thời chạy đến cứu, nhưng Phương Chính đã bị sói cắn đứt một cánh tay. Ánh mắt hắn nhìn ngươi tràn ngập hận thù thấu xương (quan hệ −40).';
    }},
    {t:'Lợi dụng lúc sói dồn vào hắn, lén cướp kho thảo dược trại',tag:'ma',dao:15,check:['tamco',14],
      ok:()=>{S.npcProg.phuongchinh=4;rel('phuongchinh',-40);S.f.pcHate=1;S.herbs+=2;S.stones+=20;S.susp+=15;return 'Phương Chính bị trọng thương, còn ngươi vét được 2 linh dược và 20 nguyên thạch trong kho (+2 dược, +20 thạch, hiềm nghi +15).'},
      fail:()=>{S.npcProg.phuongchinh=4;rel('phuongchinh',-40);S.f.pcHate=1;S.susp+=30;return 'Ngươi bị gia lão phát hiện mưu đồ lúc rút lui. Hiềm nghi +30.'}}
  ],
  post:()=>{S.f.npc_pc_3=1;}},

// --- 2. Tuyến Cổ Nguyệt Thanh Thư ---
npc_tt_1:{title:'Tiểu tổ Thanh Thư',hint:'Thanh Thư chiêu mộ',cond:()=>S.turn>=7&&S.turn<=9&&!(S.f.npc_tt_1),
  text:()=>{
    S.npcProg.thanhthu=1;meet('thanhthu');
    const r=(S.var||{}).thanhthu_route;
    if(r==='trach_nhiem'){
      return 'Cổ Nguyệt Thanh Thư, thiên tài Nhị chuyển đỉnh phong, con nuôi tộc trưởng, tìm gặp ngươi ở võ trường: "Phương Nguyên, ta thấy ngươi xuất thủ dứt khoát, tâm tính trầm ổn. Tiểu tổ của ta đang khuyết một vị trí. Ngươi có muốn cùng ta gánh vác tương lai gia tộc?"';
    }else{
      return 'Cổ Nguyệt Thanh Thư ngồi một mình dưới hiên trà, ánh mắt đượm buồn: "Phương Nguyên, người trong tộc đều nhìn ta bằng sự ngưỡng mộ của con nuôi tộc trưởng. Nhưng chỉ có ngươi là nhìn ta bằng ánh mắt phẳng lặng không thiên vị. Ta cần một người như ngươi trong tiểu tổ."';
    }
  },
  choices:()=>[
    {t:'Gia nhập tiểu tổ Thanh Thư',tag:'chinh',eff:()=>{
      S.f.team=1;rel('thanhthu',20);S.danh+=8;
      return 'Ngươi gia nhập tiểu tổ mạnh nhất của thế hệ trẻ. Từ nay phần thưởng nhiệm vụ +50%, danh vọng +8.';
    }},
    {t:'Từ chối, giữ vị thế độc hành ma tu',tag:'ma',eff:()=>{
      rel('thanhthu',10);S.tamco++;
      return 'Thanh Thư khẽ thở dài: "Tiếc thật, nhưng ta tôn trọng chí hướng của ngươi." Tâm cơ +1.';
    }}
  ],
  post:()=>{S.f.npc_tt_1=1;}},

npc_tt_2:{title:'Tuần tra biên giới',hint:'Thanh Thư tuần tra',cond:()=>S.turn>=12&&S.turn<=14&&S.f.npc_tt_1&&!(S.f.npc_tt_2),
  text:()=>'Tiểu tổ Thanh Thư tuần tra biên giới tiếp giáp Hùng gia. Ba Cổ sư Hùng gia hung hãn lấn chiếm bãi khai thác nguyên thạch, lớn tiếng lăng mạ Cổ Nguyệt tộc. Thanh Thư nắm chặt Đằng Mạn Cổ, trầm giọng: "Phương Nguyên, yểm trợ cho ta!"',
  choices:()=>[
    {t:'Hợp lực cùng Thanh Thư giáp công',tag:'chinh',eff:()=>{
      fight('hunggia',{scale:1.15,mod:.85,after:'tt_fight',flee:false});
      return 'Dây leo của Thanh Thư trói chặt chân địch, nguyệt nhận của ngươi xé toạc phòng tuyến!';
    }},
    {t:'Bọc hậu đánh lén cướp đoạt cổ trùng của địch',tag:'ma',check:['tamco',13],
      ok:()=>{rel('thanhthu',10);S.stones+=15;return 'Đòn đánh lén kết liễu tên đầu lĩnh Hùng gia. Ngươi thu được 15 nguyên thạch (+15 thạch)!'},
      fail:()=>{fight('hunggia',{scale:1.25,after:'tt_fight',flee:false});return 'Đòn đánh lén trượt mục tiêu, kẻ địch quay lại phản công dữ dội!'}}
  ],
  post:()=>{S.f.npc_tt_2=1;}},

npc_tt_3:{title:'Đêm trăng đàm đạo',hint:'Tâm sự với Thanh Thư',cond:()=>S.turn>=16&&S.turn<=18&&S.f.npc_tt_2&&!(S.f.npc_tt_3),
  text:()=>{
    S.npcProg.thanhthu=3;
    return 'Gió đêm Thanh Mao Sơn xào xạc rặng trúc. Thanh Thư rót cho ngươi một chén thanh trà: "Phương Nguyên, lang triều sắp tới. Ta có cảm giác kiếp này mình khó lòng sống sót qua mùa đông. Nếu ta ngã xuống, mong ngươi hãy bảo vệ gia tộc này thay ta."';
  },
  choices:()=>[
    {t:'"Sơn trại đáng để huynh dốc cạn tính mạng sao? Hãy sống vì mình."',tag:'ma',eff:()=>{
      rel('thanhthu',15);S.tamco++;
      return 'Thanh Thư ngẩn người, chén trà trên tay khẽ run. Lời ma ngôn của ngươi như gieo một tia nghi vấn vào tín ngưỡng chính đạo của hắn. Tâm cơ +1, quan hệ +15.';
    }},
    {t:'"Có ta ở đây, huynh đệ chúng ta nhất định cùng sống sót."',tag:'chinh',eff:()=>{
      rel('thanhthu',25);S.danh+=6;
      return 'Thanh Thư mỉm cười ấm áp, nâng chén cạn trà: "Đa tạ ngươi, Phương Nguyên!" Quan hệ +25, danh vọng +6.';
    }}
  ],
  post:()=>{S.f.npc_tt_3=1;}},

npc_tt_6:{title:'Câu hỏi của Thanh Thư',hint:'Thanh Thư nghi ngờ',who:'thanhthu',cond:()=>S.turn>=21&&S.turn<=23&&S.f.qingshuAlive&&!S.f.npc_tt_6,
  text:()=>'Thanh Thư mời ngươi ra bờ suối, tay còn quấn băng. Hắn im lặng rất lâu rồi hỏi: "Đêm đó ngươi biết ta sẽ dùng Mộc Mị Cổ. Ngươi biết trước khi ta rút nó ra. Làm sao ngươi biết?"',
  choices:[
    {t:'"Ta thấy tay huynh nắm chặt cái hộp đó cả tối."',check:['tamco',12],ok:()=>{rel('thanhthu',15);return 'Thanh Thư bật cười: "Ra là vậy. Ta tưởng ngươi biết bói." Hắn tin. Quan hệ +15.'},fail:()=>{rel('thanhthu',-5);S.susp+=5;return 'Thanh Thư gật đầu, nhưng ánh mắt hắn không tin. Hiềm nghi +5.'}},
    {t:'Nói một nửa sự thật: "Ta từng thấy người dùng nó, và thấy họ chết."',tag:'chinh',eff:()=>{rel('thanhthu',25);S.f.ttTrust=1;return 'Thanh Thư im lặng rất lâu. "Cảm ơn ngươi đã không để ta thành cái cây đó." Từ đó hắn tin ngươi hơn bất kỳ ai. Quan hệ +25.'}},
    {t:'"Huynh còn sống là được. Hỏi nhiều làm gì."',tag:'ma',eff:()=>{rel('thanhthu',-10);S.tamco++;return 'Thanh Thư thở dài, không hỏi nữa. Nhưng từ đó hắn giữ khoảng cách. Tâm cơ +1.'}},
  ],
  post:()=>{S.f.npc_tt_6=1}},
npc_tt_4:{title:'Kế thừa Thanh Thư',hint:'Thanh Thư trao phó',cond:()=>S.turn>=24&&S.turn<=25&&S.f.qingshuAlive&&!(S.f.npc_tt_4),
  text:()=>{
    S.npcProg.thanhthu=4;
    return 'Sau khi được ngươi cứu thoát khỏi bàn tay tử thần của Bạch Ngưng Băng, Thanh Thư mang thương tích quấn băng trắng khắp người đến gặp ngươi. Hắn đưa ra gia tộc lệnh bài của tộc trưởng: "Phương Nguyên, ngươi cứu mạng ta, lại cứu cả bộ tộc. Ta đã nói rõ với phụ thân, ngươi hoàn toàn trong sạch trong mọi vụ án!"';
  },
  choices:()=>[
    {t:'Nhận lệnh bài, cùng Thanh Thư thống lĩnh tộc nhân',tag:'chinh',eff:()=>{
      S.susp=Math.max(0,S.susp-30);S.danh+=20;S.stones+=30;
      return 'Hiềm nghi giảm mạnh (−30), gia tộc khen thưởng 30 nguyên thạch (+30 thạch, danh vọng +20)!';
    }}
  ],
  post:()=>{S.f.npc_tt_4=1;}},

// --- 3. Tuyến Bạch Ngưng Băng ---
npc_bai_1:{title:'Bóng trắng trên sườn tuyết',hint:'Bạch Ngưng Băng dò xét',cond:()=>S.turn>=14&&S.turn<=16&&!(S.f.npc_bai_1),
  text:()=>{
    S.npcProg.bai=1;meet('bai');
    return 'Trên mỏm đá phủ sương trắng phía đông sơn trại, một bóng người áo trắng tóc bạc đứng ngạo nghễ trong gió tuyết. Bạch Ngưng Băng từ trên cao nhìn xuống ngươi, ánh mắt lam ngọc lạnh lẽo như băng hà vạn năm: "Kẻ mang tư chất Bính đẳng mà luyện cổ như thần... Ngươi rốt cuộc là ai?"';
  },
  choices:()=>[
    {t:'Phóng một đạo nguyệt nhận lên vách đá đáp lễ',eff:()=>{
      rel('bai',15);S.satphat++;
      return 'Nguyệt nhận chém vỡ mỏm đá dưới chân hắn. Bạch Ngưng Băng cười sảng khoái: "Thú vị!" rồi lướt đi trong tuyết (Sát phạt +1, quan hệ +15).';
    }},
    {t:'Phớt lờ hắn, thong dong thu thập nguyệt lan',canon:1,eff:()=>{
      rel('bai',20);S.tamco++;
      return 'Sự bình thản đến cực điểm của ngươi khiến Bạch Ngưng Băng kinh ngạc. Hắn ghét nhất những kẻ quỳ gối sợ hãi, và ngươi hoàn toàn không có điều đó (Tâm cơ +1, quan hệ +20).';
    }}
  ],
  post:()=>{S.f.npc_bai_1=1;}},

npc_bai_2:{title:'Đối thoại hư vô',hint:'Đàm đạo cùng Bạch Ngưng Băng',cond:()=>S.turn>=22&&S.turn<=23&&S.f.npc_bai_1&&!(S.f.npc_bai_2),
  text:()=>{
    S.npcProg.bai=3;
    return 'Giữa tàn tích hoang tàn sau đợt lang triều, Bạch Ngưng Băng ngồi trên xác một con cự lang, cơ thể bắt đầu rạn nứt những tia băng tinh: "Bắc Minh Băng Phách Thể của ta sắp phát tác toàn diện. Ta sắp chết rồi... Phương Nguyên, ngươi nói xem, thế gian này rốt cuộc có ý nghĩa gì?"';
  },
  choices:()=>[
    {t:'"Ý nghĩa là do chính ngươi định đoạt. Sống vì dục vọng, chết vì lý tưởng!"',canon:1,tag:'ma',dao:15,eff:()=>{
      rel('bai',30);S.f.baiAlly=1;learn('bai');
      return 'Bạch Ngưng Băng sững sờ, hai mắt bừng sáng như sao băng: "Ha ha ha! Đúng vậy! Sống vì dục vọng, chết vì lý tưởng! Phương Nguyên, ngươi quả là tri kỷ duy nhất của ta!" (Bạch Ngưng Băng trở thành đồng minh!).';
    }},
    {t:'"Mau tìm Âm Dương Chuyển Thân Cổ nghịch chuyển thể chất"',check:['ngo',13],
      ok:()=>{rel('bai',20);S.f.baiAlly=1;learn('bai');return 'Ngươi hé lộ bí mật thượng cổ về Âm Dương Chuyển Thân Cổ. Bạch Ngưng Băng gật đầu: "Vậy ta và ngươi cùng tìm nó!"'},
      fail:()=>{rel('bai',10);return 'Hắn thở dài: "Cổ trùng nghịch thiên như thế, dễ gì có được." Quan hệ +10.'}}
  ],
  post:()=>{S.f.npc_bai_2=1;}},

// --- 4. Tuyến Mạc gia & Xích gia ---
npc_xm_1:{title:'Xung đột học đường',hint:'Mạc Bắc vs Xích Thành',cond:()=>S.turn>=4&&S.turn<=6&&!(S.f.npc_xm_1),
  text:()=>{
    S.npcProg.xich_mac=1;meet('mactran');meet('xichluyen');
    return 'Tại thao trường học đường, Mạc Bắc (cháu Mạc Trần) và Xích Thành (cháu Xích Luyện) cãi cọ rồi rút cổ trùng đánh nhau tóe lửa. Cả đám học trò hò reo cổ vũ chia hai phe. Gia lão học đường đứng nhìn từ xa không can thiệp.';
  },
  choices:()=>[
    {t:'Đặt cược 5 nguyên thạch cho Mạc Bắc',req:()=>S.stones>=5,reqT:'Cần 5 thạch',check:['tamco',11],
      ok:()=>{S.stones+=3;rel('mactran',12);rel('xichluyen',-8);return 'Mạc Bắc thắng thế! Ngươi thu về 8 nguyên thạch (+3 thạch lãi, Mạc gia +12).'},
      fail:()=>{S.stones-=5;rel('mactran',4);return 'Xích Thành dùng tiểu xảo gỡ hòa. Mất 5 thạch.'}},
    {t:'Lao vào can ngăn bằng uy thế áp đảo',check:['satphat',11],
      ok:()=>{S.danh+=6;S.satphat++;return 'Một đòn chân nguyên chuẩn xác đánh văng cổ trùng cả hai đứa. Cả học đường nín thở kính nể (danh vọng +6, Sát phạt +1).'},
      fail:()=>{S.hp-=10;return 'Bị dư ba của hai bên đánh trúng (−10 máu).'}},
    {t:'Ngồi uống trà, phân tích chiêu thức hai bên',canon:1,eff:()=>{S.ngo++;S.tamco++;return 'Xem hai kẻ yếu đánh nhau cũng là một cách hiểu rõ sơ hở gia tộc. Ngộ tính +1, Tâm cơ +1.'}}
  ],
  post:()=>{S.f.npc_xm_1=1;}},

npc_xm_2:{title:'Đêm đen truyền công',hint:'Bí mật của Xích Thành',cond:()=>S.turn>=8&&S.turn<=11&&S.f.npc_xm_1&&!(S.f.npc_xm_2),
  text:()=>{
    S.npcProg.xich_mac=2;
    return 'Nửa đêm trở về từ hậu sơn, ngươi vô tình nhìn thấy trong mật thất Xích gia: Gia lão Xích Luyện đang dùng chân nguyên Nhị chuyển truyền công ép khai khiếu cho Xích Thành! Tư chất Bính đẳng của Xích Thành thực chất là ngụy tạo!';
  },
  choices:()=>[
    {t:'Tống tiền Xích Luyện: mỗi tuần 10 nguyên thạch',tag:'ma',check:['tamco',12],bonus:()=>mem('xichgia')?8:0,
      ok:()=>{S.f.blackmailXich=1;learn('xichgia');rel('xichluyen',-15);return 'Xích Luyện cắn răng nộp 10 thạch mỗi tuần để ngươi giữ kín miệng (+10 thạch/tuần)!'},
      fail:()=>{rel('xichluyen',-30);S.susp+=15;return 'Xích Luyện sát tâm nổi lên, cử tử sĩ cảnh cáo ngươi. Hiềm nghi +15.'}},
    {t:'Bán bí mật cho Mạc gia',check:['tamco',13],
      ok:()=>{S.stones+=20;rel('mactran',25);rel('xichluyen',-40);return 'Mạc Trần đại hỷ, thưởng 20 nguyên thạch (+20 thạch, Mạc gia +25, Xích gia thù địch).'},
      fail:()=>{rel('mactran',-10);return 'Mạc gia nửa tin nửa ngờ, không cho thạch.'}},
    {t:'Ghi nhớ bí mật, làm vũ khí tương lai',canon:1,eff:()=>{learn('xichgia');S.tamco+=2;return 'Kẻ nắm giữ chuôi dao là kẻ kiên nhẫn nhất. Tâm cơ +2.'}}
  ],
  post:()=>{S.f.npc_xm_2=1;}},

npc_xm_3:{title:'Lôi kéo thế lực',hint:'Chọn phe phái',cond:()=>S.turn>=14&&S.turn<=17&&S.f.npc_xm_2&&!(S.f.npc_xm_3),
  text:()=>{
    S.npcProg.xich_mac=3;
    return 'Lang triều cận kề, gia tộc chuẩn bị phân bổ vật tư chiến lược. Cả hai gia lão Xích Luyện và Mạc Trần đều gửi thiệp mời ngươi uống trà, ngỏ ý muốn kết nạp ngươi làm tâm phúc ngoại vi.';
  },
  choices:()=>[
    {t:'Đứng về phe Xích gia (Nhận trợ cấp thạch đều đặn)',eff:()=>{
      S.f.phe='Xích gia';rel('xichluyen',20);rel('mactran',-20);S.stones+=15;
      return 'Xích Luyện trao 15 nguyên thạch làm lộ phí (+15 thạch, mỗi tháng thêm 6 thạch).';
    }},
    {t:'Đứng về phe Mạc gia (Bái nhập môn, nhận Cương Nham Cổ)',req:()=>S.stones>=10,reqT:'Cần 10 thạch bái nhập',eff:()=>{
      S.stones-=10;S.f.phe='Mạc gia';rel('mactran',25);rel('xichluyen',-25);gainGu('cuongnham');
      return 'Mạc Trần ban cho ngươi Cương Nham Cổ phòng ngự (−10 thạch, +Cương Nham Cổ).';
    }},
    {t:'Điệp viên hai đầu, vơ vét của cả hai',tag:'ma',dao:15,check:['tamco',15],
      ok:()=>{S.f.phe='Hai mang';S.stones+=25;rel('xichluyen',10);rel('mactran',10);return 'Miệng lưỡi ma đầu khiến cả hai gia lão đều tưởng ngươi là người của mình (+25 thạch)!'},
      fail:()=>{rel('xichluyen',-25);rel('mactran',-25);S.susp+=25;return 'Hai bên phát hiện ngươi bắt cá hai tay. Cả hai đều phẫn nộ. Hiềm nghi +25.'}}
  ],
  post:()=>{S.f.npc_xm_3=1;}},

npc_xm_4:{title:'Bảo bọc từ đường',hint:'Phe phái ra tay',cond:()=>S.turn>=22&&S.turn<=24&&S.f.npc_xm_3&&!(S.f.npc_xm_4),
  text:()=>{
    S.npcProg.xich_mac=4;
    return (jksIs('dead')?'Trước cuộc thẩm vấn vụ án Cổ Kim Sinh và phân chia công trạng lang triều':jksIs('escaped')?'Cổ gia vẫn chưa thôi tố cáo ngươi, còn công trạng lang triều sắp được chia':'Trước buổi phân chia công trạng lang triều')+', sức ảnh hưởng của gia lão là tấm lá chắn lớn nhất trong tộc.';
  },
  choices:()=>[
    {t:'Nhờ phe cánh đứng ra bảo đảm thanh danh',eff:()=>{
      if(S.f.phe==='Xích gia'||S.f.phe==='Mạc gia'||S.f.phe==='Hai mang'){
        S.susp=Math.max(0,S.susp-20);S.danh+=10;
        return `${S.f.phe} lên tiếng bác bỏ các cáo buộc tại từ đường. Hiềm nghi −20, danh vọng +10!`;
      }
      return 'Ngươi không có phe phái nào đứng sau lưng.';
    }}
  ],
  post:()=>{S.f.npc_xm_4=1;}},

// --- 5. Tuyến Cậu mợ & Trầm Thúy ---
npc_cm_1:{title:'Trầm Thúy rình rập',hint:'Trầm Thúy tới tửu lâu',cond:()=>S.turn>=7&&S.turn<=9&&S.f.tuulau&&!(S.f.npc_cm_1),
  text:()=>{
    S.npcProg.caumo=2;meet('tramthuy');
    return 'Trầm Thúy trang điểm diêm dúa, mang theo điểm tâm tới tửu lâu: "Thiếu gia Phương Nguyên, phu nhân bảo nô tỳ sang đây phụ giúp tính sổ sách." Đôi mắt nàng ta đảo liên hồi tìm kiếm chỗ cất giấu nguyên thạch.';
  },
  choices:()=>[
    {t:'Tương kế tựu kế, dùng sổ sách giả lừa mợ',canon:1,tag:'ma',check:['tamco',11],
      ok:()=>{S.stones+=6;rel('tramthuy',-10);return 'Trầm Thúy mang sổ giả về báo, cậu mợ tưởng tửu lâu thua lỗ nên vội bán bớt cổ phần, ngươi thu gom lại (+6 thạch).'},
      fail:()=>{rel('tramthuy',-15);return 'Trầm Thúy nhận ra số liệu bất thường và mách lại với mợ.'}},
    {t:'Đuổi thẳng cổ ra khỏi tửu lâu',eff:()=>{
      rel('tramthuy',-25);rel('caumo',-15);
      return 'Ngươi hất đổ đĩa bánh, đuổi nàng ta cút ngay lập tức. Trầm Thúy khóc thét chạy về mách chủ (quan hệ −25).';
    }}
  ],
  post:()=>{S.f.npc_cm_1=1;}},

npc_cm_2:{title:'Cậu mợ trở mặt',hint:'Cậu mợ khởi kiện',cond:()=>S.turn>=12&&S.turn<=14&&S.f.npc_cm_1&&!(S.f.npc_cm_2)&&S.f.tuulau,
  text:()=>{
    S.npcProg.caumo=3;
    return 'Cậu mợ dắt theo một đám gia đinh kéo đến chặn cửa tửu lâu, khóc lóc om sòm vu khống ngươi bất hiếu, cướp đoạt dưỡng lão điền trang của trưởng bối, đòi tộc quy xử giam ngươi!';
  },
  choices:()=>[
    {t:'Trưng ra văn tự khế ước và chứng cứ cậu lén bán ruộng trà',check:['tamco',12],bonus:()=>(mem('giasan')?6:0)+(S.f.ttWarn?6:0),
      ok:()=>{learn('giasan');rel('caumo',-30);S.danh+=8;return 'Chứng cứ rành rành khiến cậu mợ câm nín, đám đông vỗ tay khen ngươi sáng suốt. Danh vọng +8, trừ sạch tiếng xấu.'},
      fail:()=>{rel('caumo',-15);S.danh-=5;return 'Tranh cãi bất phân thắng bại, danh tiếng bị ảnh hưởng chút ít.'}},
    {t:'Rút đao nguyệt nhận chém đôi bàn trà đe dọa',tag:'ma',dao:10,check:['satphat',11],
      ok:()=>{rel('caumo',-40);return 'Một đòn nguyệt nhận chém đứt đôi cột đá trước mặt cậu mợ. Cả nhà sợ chết khiếp ôm đầu bỏ chạy trối chết!'},
      fail:()=>{fight('hoctro',{scale:1.1});return 'Gia đinh xông vào vây đánh.'}}
  ],
  post:()=>{S.f.npc_cm_2=1;}},

npc_cm_3:{title:'Đoạn tuyệt ân oán',hint:'Thu hồi toàn bộ di sản',cond:()=>S.turn>=16&&S.turn<=18&&S.f.npc_cm_2&&!(S.f.npc_cm_3),
  text:()=>{
    S.npcProg.caumo=4;
    return 'Sau nhiều lần thất bại, cậu mợ lâm vào cảnh túng quẫn nợ nần, buộc phải đem căn nhà cũ và toàn bộ đất đai hương hỏa ra cầm cố. Đây là cơ hội thu hồi trọn vẹn di sản của cha mẹ.';
  },
  choices:()=>[
    {t:'Bỏ 20 thạch mua đứt căn nhà và đuổi họ khỏi sơn trại',req:()=>S.stones>=20,reqT:'Cần 20 thạch',eff:()=>{
      S.stones-=20;S.f.tuulau=3;S.danh+=8;
      return 'Cậu mợ bẽ bàng rời trại. Tửu lâu và toàn bộ điền trang về tay ngươi: mỗi tuần lợi tức +3 nguyên thạch!';
    }},
    {t:'Để họ tự sinh tự diệt',eff:()=>'Ngươi không thèm bận tâm đến đám phàm nhân nhỏ nhen này nữa.'}
  ],
  post:()=>{S.f.npc_cm_3=1;}},

/* ================= BẢN 13: HOÀN THIỆN TUYẾN NPC ================= */

// --- Phương Chính: giai đoạn 4-5 ---
npc_pc_4:{title:'Huynh đệ trước từ đường',hint:'Phương Chính chọn phe',cond:()=>S.turn>=24&&S.turn<=26&&(S.f.pcAlly||S.f.pcHate)&&!S.f.npc_pc_4,
  text:()=>{
    S.npcProg.phuongchinh=5;
    return S.f.pcAlly
      ?'Phương Chính tìm đến lúc nửa đêm, túi áo căng phồng: "Ca ca, '+(jksIs('dead')?'gia lão đang gom chứng cứ về vụ Cổ Kim Sinh. Đệ lấy được danh sách người làm chứng':jksIs('escaped')?'Cổ gia vẫn đòi gia tộc giao huynh. Đệ biết ai định đứng ra làm chứng':'thần bổ hỏi han khắp trại về huyết đạo. Đệ nghe được họ nghi ai')+', và đệ trộm thêm ít linh dược trong kho." Ánh mắt hắn không còn ngây thơ như ngày khai khiếu.'
      :'Phương Chính đứng giữa từ đường, cụt một tay áo, giọng lạnh như sắt: "Con xin làm chứng. Đêm lang triều, Phương Nguyên đứng nhìn con bị sói xé mà không nhúc nhích. Kẻ như vậy còn việc gì không dám làm?" Cả từ đường quay sang nhìn ngươi.';
  },
  choices:()=>S.f.pcAlly?[
    {t:'Nhận danh sách, dặn hắn từ nay đứng ngoài chuyện này',tag:'chinh',eff:()=>{S.susp=Math.max(0,S.susp-15);S.f.pcSupply=1;rel('phuongchinh',10);return 'Hiềm nghi −15. Từ nay mỗi tháng Phương Chính lén gửi ngươi một gốc linh dược.'}},
    {t:'Dạy hắn cách làm giả lời khai của từng nhân chứng',tag:'ma',dao:10,check:['tamco',13],
      ok:()=>{S.susp=Math.max(0,S.susp-30);S.tamco++;return 'Hai anh em thức trắng đêm sửa từng câu chữ. Hiềm nghi −30. Phương Chính học rất nhanh, nhanh đến mức đáng sợ.'},
      fail:()=>{S.susp+=10;return 'Một nhân chứng đổi lời hai lần, gia lão sinh nghi. Hiềm nghi +10.'}},
  ]:[
    {t:'Bình thản: "Đệ bị sói cắn nên hận ta. Lời người đang hận, gia lão tin được mấy phần?"',check:['tamco',15],
      ok:()=>{S.susp=Math.max(0,S.susp-5);S.danh+=3;return 'Gia lão gật gù. Phương Chính nghiến răng tới bật máu.'},
      fail:()=>{S.susp+=25;return 'Không ai tin một người anh bỏ mặc em mình. Hiềm nghi +25.'}},
    {t:'Hẹn hắn ra sau núi giải quyết cho xong',tag:'ma',dao:15,eff:()=>{fight('phuongchinh',{after:'pcduel',flee:false});return 'Phương Chính đến một mình. Hắn cũng muốn kết thúc chuyện này.'}},
    {t:'Im lặng chịu trận',eff:()=>{S.susp+=15;S.danh-=10;rel('phuongchinh',5);return 'Ngươi không nói một lời. Hiềm nghi +15, danh vọng −10. Phương Chính bối rối vì không được cãi lại.'}},
  ],
  post:()=>{S.f.npc_pc_4=1}},

// --- Thanh Thư: nhánh u uất ---
npc_tt_5:{title:'Mộc Mị Cổ trong tay áo',hint:'Thanh Thư do dự',cond:()=>S.turn>=18&&S.turn<=19&&S.f.npc_tt_3&&(S.var||{}).thanhthu_route==='u_uat'&&!S.f.npc_tt_5,
  text:()=>'Thanh Thư mời ngươi ra bờ suối, lấy ra một con cổ màu xanh thẫm như rêu. "Mộc Mị Cổ. Phụ thân giao cho ta trước lang triều. Đổi sinh mệnh lấy sức mạnh. Phương Nguyên, nếu là ngươi, ngươi có dùng không?"',
  choices:()=>[
    {t:'"Không. Người chết thì không bảo vệ được ai."',tag:'chinh',eff:()=>{rel('thanhthu',20);S.f.ttDoubt=1;return 'Thanh Thư im lặng rất lâu rồi cất cổ đi. Nếu ngươi đứng cạnh hắn trong lang triều, hắn sẽ không dễ dàng liều mạng. Quan hệ +20.'}},
    {t:'"Dùng. Nhưng hãy chọn đúng lúc, và đúng kẻ thù."',canon:1,eff:()=>{rel('thanhthu',10);S.tamco++;return 'Hắn cười buồn: "Ngươi luôn nói thật." Tâm cơ +1.'}},
    {t:'Đề nghị hắn giao Mộc Mị Cổ cho ngươi giữ hộ',tag:'ma',dao:10,check:['tamco',16],
      ok:()=>{rel('thanhthu',-5);S.stones+=30;return 'Thanh Thư do dự rồi từ chối, nhưng để lại túi 30 nguyên thạch "phòng khi ta không về". Ngươi cất đi mà không nói gì.'},
      fail:()=>{rel('thanhthu',-20);return 'Ánh mắt Thanh Thư thoáng lạnh đi. Quan hệ −20.'}},
  ],
  post:()=>{S.f.npc_tt_5=1}},

// --- Bạch Ngưng Băng: giai đoạn 3-4 ---
npc_bai_3:{title:'Hẹn ước dưới tuyết',hint:'Bạch Ngưng Băng tìm đến',cond:()=>S.turn>=25&&S.turn<=26&&S.f.npc_bai_2&&!S.f.npc_bai_3,
  text:()=>{
    S.npcProg.bai=4;
    const r=(S.var||{}).bai_route;
    return r==='sat_y'
      ?'Bạch Ngưng Băng xuất hiện trên mái tửu lâu, sau lưng là trăng non. "Bạch gia sắp đánh Cổ Nguyệt. Ta được lệnh dẫn đầu. Ta có thể giết ngươi trước, cho khỏi phiền." Hàn khí phủ trắng cả con phố.'
      :'Bạch Ngưng Băng ngồi một mình bên bờ suối đã đóng băng. "Bạch gia sắp đánh Cổ Nguyệt. Còn ta thì sắp chết. Phương Nguyên, trước khi chết, ta muốn làm một chuyện theo ý mình."';
  },
  choices:()=>[
    {t:'"Vậy thì đi cùng ta. Hôm đó, đừng đứng về phía nào cả."',canon:1,check:['tamco',17],bonus:()=>((S.rel.bai||0)>=40?6:0)+(mem('bai')?4:0),
      ok:()=>{S.f.baiAlly=1;rel('bai',20);return 'Bạch Ngưng Băng bật cười: "Được. Hôm đó ta chỉ làm theo ý mình." (Bạch Ngưng Băng sẽ giúp ngươi trong trận cuối.)'},
      fail:()=>{rel('bai',-10);return 'Hắn lắc đầu: "Ngươi vẫn chưa đủ thú vị để ta phản bội gia tộc." Rồi biến mất.'}},
    {t:'Rút cổ: "Muốn giết ta thì làm ngay đi."',eff:()=>{fight('bai',{after:'bai3',mod:S.f.baiWeak?.7:.9});return 'Tuyết đổ xuống như trút.'}},
    {t:'Báo tin Bạch gia sắp tập kích cho gia tộc',tag:'chinh',eff:()=>{S.danh+=15;rel('bai',-30);S.f.baiWarned=1;return 'Gia tộc kịp chuẩn bị. Danh vọng +15. Bạch Ngưng Băng biết chuyện, không bao giờ tìm ngươi nữa.'}},
  ],
  post:()=>{S.f.npc_bai_3=1}},

// --- Mạc gia / Xích gia: nhánh theo kiếp ---
npc_xm_5:{title:'Ghế gia lão bỏ trống',hint:'Mạc gia và Xích gia ra tay',cond:()=>S.turn>=19&&S.turn<=23&&S.f.tideDone&&S.f.npc_xm_3&&!S.f.npc_xm_5,
  text:()=>{
    meet('xichson');meet('macnhan');
    const r=(S.var||{}).xich_mac_route;
    if(r==='xich_the')return 'Một gia lão tử trận trong lang triều, ghế trống. Xích Luyện đẩy Xích Sơn, Cổ sư Tam chuyển mạnh nhất Xích gia, lên thay. Mạc Trần cần ai đó làm chuyện bẩn để lật ngược thế cờ.';
    if(r==='mac_the')return 'Một gia lão tử trận trong lang triều, ghế trống. Mạc gia đã mua chuộc đủ phiếu. Xích Luyện ngồi uống trà một mình, cả buổi không nhấp một ngụm. Lão cần ai đó giúp.';
    return 'Một gia lão tử trận trong lang triều. Ngay đêm đó hai nhà đã cho người canh cửa nhau. Chỉ cần một mồi lửa là cả hai sẽ lao vào xé xác nhau.';
  },
  choices:()=>{
    const r=(S.var||{}).xich_mac_route,out=[];
    if(r!=='mac_the')out.push({t:'Giúp Mạc gia: tung tin Xích Thành khai khiếu giả',req:()=>mem('xichgia')||S.f.blackmailXich,reqT:'Cần biết bí mật Xích Thành',eff:()=>{rel('mactran',30);rel('xichluyen',-50);S.f.phe='Mạc gia';S.stones+=40;S.susp+=5;return 'Cả trại xôn xao. Xích Sơn phải rút tên. Mạc Trần thưởng 40 nguyên thạch và nhận ngươi làm người của Mạc gia.'}});
    if(r!=='xich_the')out.push({t:'Giúp Xích gia: làm chứng Mạc gia bỏ tường lúc lang triều',check:['tamco',14],
      ok:()=>{rel('xichluyen',30);rel('mactran',-40);S.f.phe='Xích gia';gainGu('thietbi');return 'Lời chứng của ngươi khớp với vết sói trên tường. Xích Luyện tặng ngươi Thiết Bì Cổ.'},
      fail:()=>{rel('mactran',-30);S.susp+=15;fight('macnhan',{after:'macnhan'});return 'Mạc Nhan chặn ngươi ngay ở cổng từ đường, roi đã rút khỏi thắt lưng.'}});
    if(r==='tranh_doat')out.push({t:'Châm lửa cho hai nhà cắn nhau, đứng ngoài nhặt của rơi',tag:'ma',dao:15,check:['tamco',15],
      ok:()=>{S.stones+=70;S.f.xmWar=1;rel('mactran',-10);rel('xichluyen',-10);return 'Đêm đó hai nhà đánh nhau trong hẻm. Sáng ra, túi thạch của những kẻ "mất tích" nằm trong tay ngươi (+70). Cả hai đều yếu đi trước ngày Bạch gia tới.'},
      fail:()=>{S.susp+=30;return 'Có người thấy ngươi ra vào cả hai nhà. Hiềm nghi +30.'}});
    out.push({t:'Đứng ngoài, chuyện của gia lão không phải chuyện của ngươi',eff:()=>{S.tamco++;return 'Tâm cơ +1.'}});
    return out;
  },
  post:()=>{S.f.npc_xm_5=1}},

// --- Cậu mợ và Trầm Thúy: kết tuyến ---
npc_cm_4:{title:'Trầm Thúy',hint:'Trầm Thúy lựa chọn',cond:()=>S.turn>=20&&S.turn<=24&&S.f.npc_cm_2&&!S.f.npc_cm_4&&!S.f.tramthuyGone&&S.f.tuulau,
  text:()=>{
    meet('tramthuy');
    if(S.f.tramthuySpy)return 'Cậu mợ phát hiện Trầm Thúy lén báo tin cho ngươi. Cậu trói nàng trong kho củi, rao bán cho thương đội làm nô tỳ. Một đứa trẻ hàng xóm chạy tới báo: "Chị Thúy bảo cháu tìm thiếu gia."';
    return (S.var||{}).caumo_route==='phan_don'
      ?'Cậu mợ mất trắng, Trầm Thúy mất chỗ dựa. Mấy hôm nay nàng hay đứng ở đầu hẻm sau tửu lâu, nói chuyện với một gã lạ mặt. Trên chuôi đao của gã có buộc một sợi dây đỏ.'+(mem('tramthuy')?' Ngươi nhớ sợi dây đỏ ấy. Kiếp trước nó xuất hiện ngay trước khi lưỡi đao cắm vào lưng ngươi.':'')
      :'Cậu mợ túng quẫn, định bán Trầm Thúy cho thương đội làm nô tỳ. Nàng quỳ trước cửa tửu lâu từ sáng tới tối: "Thiếu gia, xin người mua nô tỳ. Nô tỳ biết hết chuyện nhà cậu, biết cả những ai hay lui tới."';
  },
  choices:()=>S.f.tramthuySpy&&!S.f.tramthuyGone?[
    {t:'Chuộc nàng ra với giá 15 nguyên thạch',req:()=>S.stones>=15,reqT:'Cần 15 nguyên thạch',eff:()=>{S.stones-=15;S.f.eyes=1;rel('tramthuy',40);return 'Trầm Thúy quỳ lạy ba lạy. Từ nay nàng không còn là người của nhà cậu nữa, chỉ là người của ngươi.'}},
    {t:'Đến nhà cậu, dọa cậu thả người',tag:'ma',check:['satphat',12],ok:()=>{S.f.eyes=1;rel('tramthuy',35);rel('caumo',-20);return 'Cậu run run xé giấy bán thân. Trầm Thúy đi theo ngươi.'},fail:()=>{S.f.tramthuyGone=1;rel('caumo',-10);return 'Ngươi tới chậm một bước. Thương đội đã mang nàng xuống núi.'}},
    {t:'Bỏ mặc: một tai mắt đã lộ thì không còn giá trị',tag:'ma',eff:()=>{S.f.tramthuyGone=1;S.f.tramthuySpy=0;return 'Ngươi không tới. Sáng hôm sau Trầm Thúy đã không còn trong trại.'}},
  ]:(S.var||{}).caumo_route==='phan_don'?[
    {t:'Ra tay trước với gã lạ mặt',check:['satphat',12],bonus:()=>mem('tramthuy')?5:0,
      ok:()=>{learn('tramthuy');fight('tramthuysat',{after:'tramthuy',mod:.75});return 'Ngươi chặn hắn trong hẻm trước khi hắn kịp ra tay.'},
      fail:()=>{learn('tramthuy');fight('tramthuysat',{after:'tramthuy'});return 'Hắn nhanh hơn ngươi nghĩ.'}},
    {t:'Trả gấp đôi để mua lại gã sát thủ',req:()=>S.stones>=40,reqT:'Cần 40 nguyên thạch',eff:()=>{S.stones-=40;learn('tramthuy');S.f.tramthuyGone=1;return 'Gã cầm tiền rồi đi. Hôm sau người ta vớt được xác Trầm Thúy dưới giếng. Ngươi không hỏi ai làm.'}},
    {t:'Không để ý',eff:()=>{S.f.tramthuyAmbush=1;return 'Chuyện của một tỳ nữ thì có gì đáng bận tâm.'}},
  ]:[
    {t:'Mua nàng với giá 15 nguyên thạch, dùng làm tai mắt',req:()=>S.stones>=15,reqT:'Cần 15 nguyên thạch',eff:()=>{S.stones-=15;S.f.tramthuySpy=1;S.f.eyes=1;rel('tramthuy',30);return 'Trầm Thúy thành tai mắt của ngươi trong trại. Từ nay tin đồn tới tai ngươi sớm hơn.'}},
    {t:'Mặc kệ nàng',canon:1,eff:()=>{rel('tramthuy',-20);return 'Thương đội mang nàng xuống núi. Ngươi không ngoái lại.'}},
  ],
  post:()=>{S.f.npc_cm_4=1}},

x_tramthuy:{title:'Lưỡi đao sau lưng',
  text:()=>'Đêm khuya, ngươi vừa khóa cửa '+(S.f.tuulau?'tửu lâu':'phòng')+' thì nghe tiếng ngói khẽ động. Một bóng bịt mặt nhảy xuống, sợi dây đỏ bay phấp phới trên chuôi đao.',
  choices:()=>[
    {t:'Nghênh chiến',eff:()=>{learn('tramthuy');fight('tramthuysat',{after:'tramthuy',flee:false});return 'Không kịp nghĩ nữa.'}},
  ]},

// --- Thiết Nhược Nam ---
npc_nn_1:{title:'Thiết Nhược Nam',hint:'Con gái thần bổ',cond:()=>S.turn>=23&&S.turn<=25&&S.met.nhuocnam&&!S.f.npc_nn_1,
  text:()=>'Thiết Nhược Nam chặn ngươi ở bậc đá học đường. Nàng chưa tới mười sáu, áo bổ khoái sạch sẽ, lưng thẳng tắp. "Cha ta nói ai cũng có thể nói dối. '+(jksIs('dead')?'Ta muốn tự mình nghe. Ngươi có giết Cổ Kim Sinh không?"':jksIs('escaped')?'Cổ Kim Sinh nói ngươi phục kích hắn ở khe đá. Ta không tin lời hắn, nhưng ta muốn nghe ngươi nói."':'Cha ta lên núi vì dấu vết huyết đạo. Ngươi lớn lên ở đây. Có chỗ nào trên núi mà người trong trại không dám tới không?"')+(mem('nhuocnam')?' Ngươi nhớ: nàng ghét dối trá, nhưng chưa từng quên một ân tình.':''),
  choices:()=>[
    ...(jksIs('dead','escaped')?[]:[{t:'Kể cho nàng về khe đá thơm mùi rượu ở hậu sơn',check:['tamco',9],ok:()=>{learn('nhuocnam');rel('nhuocnam',15);S.f.tieIntel=1;S.f.nnGuide=1;S.f.tieAlly=1;return 'Nhược Nam ghi chép cẩn thận, rồi lần đầu tiên mỉm cười với ngươi: "Cảm ơn. Ở đây ai cũng né tránh ta."'},fail:()=>{rel('nhuocnam',5);return 'Nàng nghe xong, gật đầu, nhưng có vẻ chưa tin hẳn.'}}]),
    {t:jksIs('dead','escaped')?'Nhìn thẳng nàng: "Không."':'"Ta chỉ là học trò, biết gì đâu."',check:['tamco',S.f.killedJKS?15:8],bonus:()=>mem('nhuocnam')?4:0,
      ok:()=>{learn('nhuocnam');rel('nhuocnam',15);S.f.tieIntel=1;return 'Nhược Nam gật đầu chậm rãi. Nàng kể cha nàng đang chờ một nhân chứng từ thương đội. Ngươi nhớ kỹ cái tên đó.'},
      fail:()=>{learn('nhuocnam');rel('nhuocnam',-20);S.susp+=15;return 'Nàng nhìn ngươi rất lâu rồi quay đi. Tối đó Thiết Huyết Lãnh ghé tửu lâu. Hiềm nghi +15.'}},
    {t:'Giúp nàng tìm dấu vết một vụ khác trong trại',tag:'chinh',check:['ngo',12],
      ok:()=>{learn('nhuocnam');rel('nhuocnam',25);S.danh+=5;S.f.nnDebt=1;return 'Hai người lần ra kẻ trộm kho thảo dược. Nhược Nam nói: "Ta nợ ngươi một lần." Danh vọng +5.'},
      fail:()=>{rel('nhuocnam',5);return 'Manh mối dẫn vào ngõ cụt. Nhược Nam vẫn cảm ơn.'}},
    {t:'Lờ nàng đi',eff:()=>{rel('nhuocnam',-5);return 'Nàng nhíu mày ghi gì đó vào sổ tay.'}},
  ],
  post:()=>{S.f.npc_nn_1=1}},

// --- Hùng Lâm ---
npc_hl_1:{title:'Hùng Lâm khiêu chiến',hint:'Hùng gia so tài',cond:()=>S.turn>=(W('hunglam')?6:10)&&S.turn<=18&&!S.f.npc_hl_1,
  text:()=>{meet('hunglam');return 'Ở bãi đá ranh giới, một thanh niên vai rộng tay trần đang đấm nát từng tảng đá cho vui. Hùng Lâm của Hùng gia. Hắn ngoắc tay: "Cổ Nguyệt không còn ai sao? Cử một thằng nhóc Bính đẳng ra?"'+(mem('hunglam')?' Ngươi nhớ: quyền thứ ba của hắn luôn hở sườn trái.':'')},
  choices:()=>[
    {t:'Nhận lời so tài',eff:()=>{fight('hunglam',{after:'hunglam',mod:(S.chuyen<2?.75:1)*(mem('hunglam')?.8:1)});return 'Hùng Lâm cười ha hả, siết nắm đấm.'}},
    {t:'Khích hắn đi đánh Bạch gia trước',check:['tamco',13],
      ok:()=>{rel('hunglam',5);S.f.hlBai=1;S.tamco++;return 'Hùng Lâm nổi máu hiếu thắng, quay sang tìm Bạch Ngưng Băng. Nghe nói hắn thua thảm, nhưng Bạch gia cũng mất một con cổ. Tâm cơ +1.'},
      fail:()=>{fight('hunglam',{after:'hunglam'});return '"Ngươi nói nhiều quá." Nắm đấm đã tới.'}},
    {t:'Lui đi',eff:()=>{S.danh-=4;return 'Danh vọng −4.'}},
  ],
  post:()=>{S.f.npc_hl_1=1}},

/* ================= BẢN 13: NGẪU NHIÊN THEO NƠI CHỐN ================= */

// Học đường
r_macnhan:{loc:'hocduong',w:2,cond:()=>S.turn>=3,title:'Mạc Nhan gây sự',
  text:()=>{meet('macnhan');return 'Mạc Nhan, cháu gái gia lão Mạc Trần, đổ cả chén mực lên bàn của ngươi rồi cười với đám bạn: "Bính đẳng thì ngồi chỗ Bính đẳng."'+(S.f.macHate?' Từ khi Mạc gia ghi hận ngươi, nàng ta càng lấn tới.':'')},
  choices:[
    {t:'Lau mực, như chưa có gì',canon:1,eff:()=>{S.tamco++;return 'Tâm cơ +1. Mạc Nhan thấy chẳng vui, bỏ đi.'}},
    {t:'Hắt ngược chén mực vào mặt nàng',tag:'ma',eff:()=>{rel('mactran',-10);fight('macnhan',{after:'macnhan'});return 'Cả lớp nín thở.'}},
    {t:'Mỉm cười khen roi của nàng đẹp',check:['tamco',12],ok:()=>{rel('macnhan',15);S.stones+=5;return 'Mạc Nhan đỏ mặt, không hiểu sao lại ném cho ngươi 5 nguyên thạch rồi bỏ đi.'},fail:()=>{rel('macnhan',-10);return 'Mạc Nhan càng tức.'}},
  ]},
r_thiluyen:{loc:'hocduong',w:2,title:'Kiểm tra điều khiển cổ',
  text:()=>'Gia lão đặt một hàng đèn dầu, bắt học trò dùng Nguyệt Quang Cổ cắt bấc mà không làm đổ đèn.',
  choices:[
    {t:'Cắt cả hàng trong một hơi',check:['satphat',11],ok:()=>{S.stones+=8;S.danh+=3;return 'Mười ngọn bấc rơi cùng lúc. Thưởng 8 nguyên thạch, danh vọng +3.'},fail:()=>{S.danh-=2;return 'Đổ ba cây đèn. Danh vọng −2.'}},
    {t:'Cắt chậm, cẩn thận từng cây',check:['ngo',9],ok:()=>{S.prog+=12;return 'Tay vững, tâm tĩnh. Tu vi +12.'},fail:()=>'Không có gì đặc biệt.'},
  ]},
r_cothu:{loc:'hocduong',w:1,once:1,cond:()=>S.turn>=8,title:'Cổ thư bị cấm',
  text:()=>'Góc sâu nhất tàng thư các có một ngăn khóa. Khóa đã gỉ, cửa ngăn hé mở.',
  choices:[
    {t:'Đọc lén',tag:'ma',check:['ngo',13],ok:()=>{S.ngo++;S.f.refineBonus=(S.f.refineBonus||0)+10;S.susp+=5;return 'Bút ký về sát chiêu và luyện cổ của một ma tu vô danh. Ngộ tính +1, luyện cổ +10%. Hiềm nghi +5.'},fail:()=>{S.susp+=15;return 'Gia lão coi thư các bắt gặp. Hiềm nghi +15.'}},
    {t:'Báo cho gia lão ngăn khóa bị hỏng',tag:'chinh',eff:()=>{S.danh+=5;return 'Danh vọng +5.'}},
  ]},

// Sơn trại
r_hoiho:{loc:'trai',w:2,title:'Hội đổi cổ',
  text:()=>'Sân từ đường họp hội đổi cổ mỗi tháng. Học trò và Cổ sư trẻ bày cổ trùng ra trao đổi.',
  choices:()=>{
    const own=S.gu.filter(g=>GU[g.k].t!=='fate'&&GU[g.k].r===1).map(g=>g.k);
    return [
      {t:'Đổi một con cổ Nhất chuyển lấy con khác ngẫu nhiên',req:()=>own.length>0,reqT:'Cần một con cổ Nhất chuyển',eff:()=>{const k=own[0];S.gu.splice(S.gu.findIndex(g=>g.k===k),1);const n=pick(SHOP.filter(x=>x!==k));gainGu(n,true);return `Đổi ${GU[k].n} lấy ${GU[n].n}.`}},
      {t:'Chỉ xem, ghi nhớ ai nuôi cổ gì',eff:()=>{S.tamco++;return 'Tâm cơ +1.'}},
    ];
  }},
r_nguyentuyen:{loc:'trai',w:1,cond:()=>!S.f.tideDone,title:'Linh tuyền Cổ Nguyệt',
  text:()=>'Linh tuyền dưới lòng núi là mạch sống của Cổ Nguyệt. Đêm nay người canh gác ngủ gật.',
  choices:[
    {t:'Lẻn xuống tu luyện bên linh tuyền',tag:'ma',check:['tamco',12],ok:()=>{S.prog+=35;S.susp+=5;return 'Linh khí dày đặc. Tu vi +35. Hiềm nghi +5.'},fail:()=>{S.susp+=20;S.danh-=5;return 'Bị bắt quả tang. Hiềm nghi +20, danh vọng −5.'}},
    {t:'Đánh thức người gác',tag:'chinh',eff:()=>{S.danh+=3;return 'Danh vọng +3.'}},
  ]},
r_phamnhan:{loc:'trai',w:1,title:'Nợ của phàm nhân',
  text:()=>'Một nông dân trồng trà quỳ trước tửu lâu, xin khất nợ thêm một tháng.',
  choices:[
    {t:'Cho khất nợ',tag:'chinh',eff:()=>{S.danh+=3;S.f.farmerDebt=1;return 'Danh vọng +3. Ông ta hứa sẽ trả ơn.'}},
    {t:'Siết nợ bằng ruộng trà',tag:'ma',eff:()=>{S.stones+=10;S.danh-=4;return '+10 nguyên thạch, danh vọng −4.'}},
  ]},
r_tramthuytin:{loc:'trai',w:2,cond:()=>S.f.tramthuySpy&&!S.f.tramthuyGone,title:'Tin từ Trầm Thúy',
  text:()=>'Trầm Thúy ghé tai ngươi thì thầm vài chuyện nghe được trong nhà người khác.',
  choices:[
    {t:'Nghe',eff:()=>{const r=rand(1,3);if(r===1){S.stones+=12;return 'Nàng chỉ chỗ một gã học trò giấu túi thạch. +12 nguyên thạch.'}if(r===2){S.susp=Math.max(0,S.susp-8);return 'Nàng kể ai đang dò la về ngươi. Ngươi xử lý trước. Hiềm nghi −8.'}S.f.hsBonus=(S.f.hsBonus||0)+1;return 'Nàng kể chuyện đám thợ săn thấy khỉ uống rượu ở hậu sơn. Thám hiểm hậu sơn +1.'}},
  ]},

// Núi Thanh Mao
r_haunhi:{loc:'nui',w:2,cond:()=>!S.f.hs,title:'Bầy khỉ say',
  text:()=>'Trên cây cổ thụ, một bầy khỉ đang tranh nhau vò rượu ủ trong hốc cây. Mùi hầu nhi tửu thơm nồng.'+(mem('hauquan')?' Ngươi biết hốc rượu chính của chúng ở đâu.':''),
  choices:[
    {t:'Đuổi bầy khỉ, lấy rượu',eff:()=>{learn('hauquan');fight('hauquan',{after:'hauquan'});return 'Bầy khỉ ném đá rào rào.'}},
    {t:'Lặng lẽ theo dấu tới hốc rượu',check:['tamco',11],bonus:()=>mem('hauquan')?6:0,ok:()=>{learn('hauquan');S.f.hsBonus=(S.f.hsBonus||0)+4;S.wine++;return 'Ngươi lấy trộm một vò tứ vị tửu hảo hạng. Có rượu này, dụ Tửu Trùng dễ hơn nhiều (hậu sơn +4).'},fail:()=>{fight('hauquan',{after:'hauquan'});return 'Một con khỉ con thét lên.'}},
  ]},
r_bachmao:{loc:'nui',w:1,once:1,cond:()=>S.turn>=12,title:'Hang gấu ngủ đông',
  text:()=>'Một hang đá lớn phả ra hơi ấm và mùi mật ong. Tiếng ngáy rung cả vách núi.'+(mem('bachmaon')?' Ngươi nhớ bên trong có mật gấu trăm năm, và cả chủ nhân của nó.':''),
  choices:[
    {t:'Vào hang',eff:()=>{learn('bachmaon');fight('bachmaon',{after:'bachmaon',mod:S.chuyen<2?.75:1});return 'Tiếng ngáy ngừng bặt.'}},
    {t:'Lẻn lấy mật rồi chạy',check:['tamco',14],bonus:()=>mem('bachmaon')?5:0,ok:()=>{learn('bachmaon');S.herbs+=3;S.hp=maxHp();return 'Mật gấu trăm năm! Khí huyết hồi đầy, +3 linh dược.'},fail:()=>{learn('bachmaon');fight('bachmaon',{after:'bachmaon'});return 'Gấu mở mắt.'}},
    {t:'Tránh xa',eff:()=>''},
  ]},
r_ranxanh:{loc:'nui',w:2,title:'Bụi trúc động đậy',
  text:()=>'Bụi trúc bên đường động đậy dù không có gió.',
  choices:[
    {t:'Rút cổ đề phòng',eff:()=>{fight('docxa',{scale:1});return 'Một con rắn xanh lao ra.'}},
    {t:'Ném đá thăm dò',check:['ngo',10],ok:()=>{S.f.freeMoon=(S.f.freeMoon||0)+1;return 'Chỉ là một con chồn. Nó chạy mất, để lộ một khóm nguyệt lan nhỏ.'},fail:()=>{S.hp-=8;return 'Rắn cắn trúng bắp chân. Khí huyết −8.'}},
  ]},
r_lao_tam:{loc:'nui',w:1,title:'Lão thợ săn',
  text:()=>{meet('thuongtam');return 'Lão Tam, thợ săn phàm nhân, ngồi hút thuốc bên bẫy thú. "Cổ sư trẻ, trên núi này chỗ nào có cổ hoang, lão biết cả. Chỉ là lão già rồi."'},
  choices:[
    {t:'Trả 5 nguyên thạch mua tin',req:()=>S.stones>=5,reqT:'Cần 5 nguyên thạch',eff:()=>{S.stones-=5;rel('thuongtam',10);if(Math.random()<.5){gainGu(pick(WILD));return 'Lão dẫn ngươi tới một khe đá. Có cổ hoang thật.'}S.herbs+=2;return 'Lão chỉ một bãi linh dược. +2 linh dược.'}},
    {t:'Giúp lão gỡ bẫy mang về',tag:'chinh',eff:()=>{rel('thuongtam',20);S.danh+=2;S.blood+=1;if(!S.f.laotamQueued){S.f.laotamQueued=1;later('q_laotam',3,6)}return 'Lão cảm ơn, chia ngươi phần huyết thú. +1 huyết khí.'}},
  ]},
r_bangtuyet:{loc:'nui',w:1,cond:()=>S.turn>=10,title:'Vết băng trên đá',
  text:()=>'Một tảng đá bị đông cứng từ trong ra ngoài giữa trời nắng. Dấu chân người Bạch gia còn mới.',
  choices:[
    {t:'Lần theo dấu chân',eff:()=>{fight('baitrinhsat',{after:'baigia'});return 'Áo trắng thấp thoáng sau thân cây.'}},
    {t:'Nhặt mảnh băng tinh còn sót',check:['ngo',12],ok:()=>{S.ess=maxEss();return 'Băng tinh tan vào không khiếu. Chân nguyên hồi đầy.'},fail:()=>{S.hp-=10;return 'Hàn khí cắn vào tay. Khí huyết −10.'}},
  ]},
r_hunglam:{loc:'nui',w:1,cond:()=>S.f.npc_hl_1&&!S.f.hlBeaten&&S.turn<=24,title:'Hùng Lâm tái chiến',
  text:()=>'Hùng Lâm lại chặn đường, vết bầm lần trước còn chưa tan. "Lần này ta không nhường."',
  choices:[
    {t:'Đánh',eff:()=>{fight('hunglam',{after:'hunglam',mod:mem('hunglam')?.85:1});return ''}},
    {t:'Bỏ chạy',check:['satphat',12],ok:()=>'Ngươi cắt đuôi được hắn.',fail:()=>{fight('hunglam',{after:'hunglam'});return 'Hắn nhanh hơn vẻ ngoài.'}},
  ]},

r_xichson:{loc:'trai',w:1,once:1,cond:()=>S.turn>=8,who:'xichson',title:'Lửa của Xích Sơn',
  text:()=>{meet('xichson');return 'Cổ Nguyệt Xích Sơn, Cổ sư Tam chuyển mạnh nhất Xích gia, đang thử lửa đám hậu bối trước từ đường. Hỏa Lô Cổ trên tay hắn tỏa hơi ấm ra cả sân. "Đứa nào đỡ được ba chiêu, ta tặng một con."'+(S.f.phe==='Xích gia'?' Hắn liếc ngươi: người của Xích gia thì được đứng hàng đầu.':'')},
  choices:[
    {t:'Bước ra đỡ ba chiêu',check:['satphat',13],bonus:()=>S.f.phe==='Xích gia'?3:0,
      ok:()=>{gainGu('hoalo');rel('xichson',20);S.danh+=5;return 'Chiêu thứ ba cháy sém tay áo ngươi, nhưng ngươi vẫn đứng. Xích Sơn cười lớn, ném cho ngươi một con Hỏa Lô Cổ.'},
      fail:()=>{S.hp-=20;rel('xichson',5);return 'Chiêu thứ hai đã hất ngươi ngã. Khí huyết −20. Xích Sơn gật đầu: "Gan thì có."'}},
    {t:'Dâng một vò tứ vị tửu',req:()=>S.wine>=1,reqT:'Cần 1 tứ vị tửu',eff:()=>{S.wine--;gainGu('hoalo');rel('xichson',10);return 'Xích Sơn ngửi rượu, nheo mắt nhìn ngươi, rồi đổi cho ngươi một con Hỏa Lô Cổ.'}},
    {t:'Đứng xem',eff:()=>{S.tamco++;return 'Ngươi ghi nhớ cách hắn thúc lửa. Tâm cơ +1.'}},
  ]},

// Nhiệm vụ
r_sontacphuc:{loc:'nhiemvu',w:1,cond:()=>S.turn>=8,title:'Hang ổ Độc Nhãn',
  text:()=>'Nhiệm vụ đường treo thưởng lớn: diệt hang ổ của Độc Nhãn sơn tặc vương phía nam núi.'+(mem('sontac')?' Ngươi nhớ có lối tắt qua khe suối.':''),
  choices:[
    {t:'Đánh thẳng vào hang',eff:()=>{learn('sontac');fight('sontacvuong',{after:'sontacvuong'});return 'Tiếng tù và vang lên.'}},
    {t:'Vòng qua khe suối đánh úp',check:['tamco',13],bonus:()=>mem('sontac')?6:0,ok:()=>{learn('sontac');fight('sontacvuong',{after:'sontacvuong',mod:.7});return 'Ngươi xuất hiện ngay sau lưng Độc Nhãn.'},fail:()=>{learn('sontac');fight('sontacvuong',{after:'sontacvuong',mod:1.15});return 'Khe suối có bẫy.'}},
    {t:'Không nhận',eff:()=>''},
  ]},
r_tuanbien:{loc:'nhiemvu',w:2,title:'Tuần tra biên giới',
  text:[()=>'Tuần tra ranh giới giữa Cổ Nguyệt và Hùng gia. Cột mốc bị ai đó dời đi ba trượng.',
    ()=>'Lại tuần tra ranh giới với Hùng gia. Cột mốc lần này nghiêng hẳn về phía Cổ Nguyệt, dấu đào đất còn mới.'],
  choices:[
    {t:'Dời cột mốc về chỗ cũ',tag:'chinh',eff:()=>{S.danh+=4;AFTER.nv();return 'Danh vọng +4.'}},
    {t:'Dời thêm ba trượng nữa về phía Hùng gia',tag:'ma',check:['tamco',12],ok:()=>{S.danh+=6;S.stones+=10;AFTER.nv();later('q_hunggiatim',3,6);return 'Gia tộc được thêm một mảnh rừng. +10 nguyên thạch, danh vọng +6.'},fail:()=>{fight('hunggia',{scale:1,after:'nv'});return 'Cổ sư Hùng gia bắt quả tang.'}},
  ]},
r_chuyenhang:{loc:'nhiemvu',w:1,title:'Áp tải nguyên thạch',
  text:()=>'Ngươi được giao áp tải một rương nguyên thạch từ mỏ về kho gia tộc.',
  choices:[
    {t:'Áp tải cẩn thận',tag:'chinh',eff:()=>{AFTER.nv();S.danh+=2;return ''}},
    {t:'Rút bớt vài viên',tag:'ma',check:['tamco',12],ok:()=>{S.stones+=18;AFTER.nv();later('q_kiemkho',3,6);return '+18 nguyên thạch không ai hay biết.'},fail:()=>{S.susp+=15;S.danh-=6;return 'Kho gia tộc đếm thiếu. Hiềm nghi +15.'}},
  ]},
};

// Thứ tự ưu tiên của tuyến NPC khi tuần đó không có mốc nguyên tác
const NPC_POOL=['npc_pc_1','npc_pc_2','npc_pc_3','npc_pc_4','npc_tt_1','npc_tt_2','npc_tt_3','npc_tt_5','npc_tt_4','npc_bai_1','npc_bai_2','npc_bai_3',
  'npc_xm_1','npc_xm_2','npc_xm_3','npc_xm_5','npc_xm_4','npc_cm_1','npc_cm_2','npc_cm_3','npc_cm_4','npc_nn_1','npc_hl_1','npc_tt_6'];

// Sau khi thắng trận
const AFTER={
  gate:()=>{S.f.gate=1;S.danh-=5;learn('gate');later('q_hoctrophuc',3,6,'gate');log('Gia lão trên lầu nhìn xuống rồi quay đi. Không ai ngăn ngươi. Ông ta cần một hòn đá mài dao cho đám học trò. Từ nay ngươi có thể chặn cổng mỗi tuần.','sys')},
  duel:()=>{S.danh+=6;log('Danh vọng +6.','good')},
  kimsinh:()=>{jksSet('dead');learn('jks');log('Một nhát chặt đầu. Ngươi vét sạch nguyên thạch của Cổ Kim Sinh rồi nhét xác sâu vào khe đá, lấp đá vụn lên.','sys')},
  cuuthanhthu_hong:()=>{S.f.qingshuDead=1;S.f.baiWeak=1;rel('thanhthu',30);log('Thanh Thư thiêu đốt sinh mệnh, hóa thành thụ nhân giữ chặt Bạch Ngưng Băng. Ngươi còn sống vì hắn. Bạch Ngưng Băng bị thương nặng.','big')},
  cuuthanhthu:()=>{S.f.qingshuAlive=1;rel('thanhthu',40);rel('toctruong',25);S.danh+=15;log('Bạch Ngưng Băng rút lui vào bão tuyết. Thanh Thư không phải dùng cấm cổ và sống sót. Câu chuyện đã rẽ khỏi nguyên tác.','big');gainGu('nguyettoan',true);log('Thanh Thư tháo Nguyệt Toàn Cổ đưa cho ngươi: "Mạng này nợ ngươi."','good')},
  tiefight:()=>{S.f.tieGone=1;S.f.tieFate='killed';S.f.tieHunt=0;S.susp=0;log('Thần bổ Ngũ chuyển gục ngã dưới tay một thiếu niên. Thiết Nhược Nam khóc gọi cha giữa sân.','big')},
  nhatdai:()=>{S.stones+=120;gainGu('xaloi3',true);log('Huyết Cương tan thành vũng máu. Trong đó còn lại 120 nguyên thạch nhuộm đỏ và một viên Bạch Ngân Xá Lợi Cổ.','big')},
  nhatdai_lienthu:()=>{S.f.tieGone=1;S.f.tieFate='ally';S.f.tieHunt=0;S.susp=Math.max(0,S.susp-50);S.stones+=80;log('Huyết Cương tan rã. Thiết Huyết Lãnh bị thương nặng, gật đầu với ngươi rồi rời núi. Vụ án Cổ Kim Sinh bị bỏ dở.','big')},
  baigia:()=>{S.danh+=8;learn('baigia');log('Danh vọng +8.','good')},
  lang:()=>{S.danh+=5;S.susp=Math.max(0,S.susp-10)},
  nhatdai_hong:()=>{S.f.hide=1;log('Ngươi nằm im dưới đống đá vụn tới khi tiếng gào thét tắt dần.','big')},
  lang3_hong:()=>{cuongThuDrop();S.f.tideDone=1;learn('langtrieu');S.stones+=50;S.danh+=20;S.susp=Math.max(0,S.susp-20);log('Ngươi không giết được Lang Vương, nhưng đã cầm chân nó đủ lâu. Gia lão hạ nó trong trận cuối. Cả trại nhớ mặt kẻ dám liều chết. Gia tộc thưởng 50 nguyên thạch. Danh vọng +20.','big')},
  lang3:()=>{cuongThuDrop();S.f.tideDone=1;learn('langtrieu');S.stones+=100;S.danh+=15;S.susp=Math.max(0,S.susp-30);log('Lang triều tan. Gia tộc thưởng 100 nguyên thạch. Danh vọng +15.','big')},
  bai:()=>{rel('bai',20);learn('bai');log('Bạch Ngưng Băng lau vết máu trên môi, bật cười: "Hay lắm. Chúng ta còn gặp lại." Rồi biến mất trong gió tuyết.','big')},
  huyethai:()=>{
    // Kiếp trước đã biết lăng mộ: tìm được hốc đá nơi bầy dơi canh mộ ngủ
    if(mem('huyetlo')){gainGu('daosihuyetbuc',true);log('Ký ức dẫn ngươi tới hốc đá sau quan tài. Bầy Đao Sí Huyết Bức còn đang ngủ, ngươi luyện hóa con đầu đàn.','good')}
    S.f.huyethai=1;learn('huyethai');learn('huyetlo');
    gainGu('huyetnguyet');gainGu('huyetlo');
    S.stones+=100;S.blood+=6;
    log('Dưới đáy lăng mộ: Huyết Lô Cổ (Tứ chuyển bí cổ của Huyết Hải lão tổ), Huyết Nguyệt Cổ, 100 nguyên thạch, và một lối thoát ngầm ra khỏi núi. Huyết Lô Cổ chỉ phát huy khi tế bằng máu người cùng huyết mạch.','big');
  },
  taptich:()=>{S.danh+=8},
  hoatuu:()=>{S.f.hoatuu=1;S.f.hs=4;S.f.tuviRecipe=1;learn('hoatuu');S.stones+=80;S.wine+=2;log('Bể đá ngầm thuộc về ngươi: 80 nguyên thạch, 2 hũ rượu quý, và bí phương hợp luyện Tứ Vị Tửu Trùng. Sâu hơn nữa còn một thông đạo bị phong ấn.','big')},
  elder:()=>{S.susp=40;S.danh-=20;log('Gia lão ngã xuống. Trong trại không ai dám nhắc lại chuyện cũ, nhưng ánh mắt nhìn ngươi đã khác.','big')},
  thosan:()=>{S.danh+=8;log('Người thợ săn kể chuyện khắp trại. Danh vọng +8.','good')},
  bachthi:()=>{if(Math.random()<.6)gainGu('bachthi')},
  nv:()=>{const n=Math.round(rand(8,14)*(S.f.team?1.5:1)*(W('daotac')?1.3:1));S.stones+=n;S.danh+=3;log(`Gia tộc thưởng ${n} nguyên thạch.`,'gold')},
  tukiep:()=>{S.stones+=60;log('Huyết Thủ ma tu gục ngã. Ngươi vượt cấp giết một Tam chuyển. Trong túi hắn đầy nguyên thạch dính máu.','big')},
  jkstrap:()=>{jksSet('escaped');log('Hộ vệ ngã xuống, nhưng Cổ Kim Sinh đã chạy thoát và sẽ kể lại với anh hắn.','danger');S.susp+=15},
  lang_cung:()=>{S.danh+=8;S.stones+=20;log('Bầy sói tan. Tiêu Tam miễn cưỡng ghi công cho ngươi. Danh vọng +8, +20 nguyên thạch.','big')},
  thachhau:()=>{S.f.anThach=1;log('Thạch Hầu Vương gục xuống. Trên đầu nó, Ẩn Thạch Cổ còn sống. Chỉ cần thêm một mảnh vảy cá là hợp thành Ẩn Lân.','big')},
  giave_jks:()=>{S.stones+=20;log('Gã hộ vệ nằm rạp. Ngươi lấy túi thạch của hắn (+20). Cổ gia từ nay không dám ra mặt nữa.','big')},
  giave:()=>{S.f.giaveDone=1;S.susp=Math.max(0,S.susp-20);log('Hộ vệ Cổ gia chết. Không ai còn đuổi theo chuyện của Cổ Kim Sinh nữa.','big')},
  cuu_pc:()=>{
    S.npcProg.phuongchinh=4;rel('phuongchinh',45);S.f.pcAlly=1;S.danh+=15;
    log('Phương Chính rơi nước mắt gọi "Ca ca!", hoàn toàn tâm phục khẩu phục. Hắn thề sẽ cùng ngươi sống chết!','big');
  },
  tt_fight:()=>{
    S.danh+=10;rel('thanhthu',15);
    log('Cổ sư Hùng gia ôm vết thương tháo chạy. Tiểu tổ Thanh Thư toàn thắng!','good');
  },
  pcduel:()=>{S.f.pcBeaten=1;S.npcProg.phuongchinh=5;S.susp=Math.max(0,S.susp-10);rel('phuongchinh',-10);log('Phương Chính quỳ một gối, không cam lòng nhưng không nói thêm gì. Từ nay hắn không ra làm chứng nữa.','big')},
  bai3:()=>{rel('bai',25);S.f.baiAlly=1;log('Bạch Ngưng Băng lau máu nơi khóe môi: "Được. Ngày đó ta sẽ đứng cạnh ngươi, để xem ngươi còn làm được gì nữa."','big')},
  macnhan:()=>{S.danh+=4;rel('mactran',-10);rel('macnhan',-10);log('Mạc Nhan ôm tay chạy về mách ông. Danh vọng +4.','good')},
  tramthuy:()=>{S.f.tramthuyGone=1;S.f.tramthuyAmbush=0;S.susp=Math.max(0,S.susp-5);log('Sát thủ khai ra Trầm Thúy. Sáng hôm sau nàng đã rời trại theo thương đội, không ai thấy nàng nữa.','big')},
  hunglam:()=>{S.f.hlBeaten=1;learn('hunglam');if(!hasGu('hungluc')){gainGu('hungluc',true);log('Hùng Lâm ném cho ngươi một con Hùng Lực Cổ: "Giữ lấy. Lần sau đánh cho ra hồn."','good')}rel('hunglam',15);S.danh+=12;log('Hùng Lâm ngã ngồi giữa bãi đá rồi bật cười: "Cổ Nguyệt có người rồi." Danh vọng +12.','big')},
  hauquan:()=>{S.f.hsBonus=(S.f.hsBonus||0)+2;S.wine++;log('Bầy khỉ bỏ chạy, để lại một vò rượu. +1 tứ vị tửu, hậu sơn +2.','good')},
  bachmaon:()=>{S.herbs+=3;S.stones+=20;S.hp=Math.min(maxHp(),S.hp+30);log('Trong hang có mật gấu trăm năm và bộ xương của một Cổ sư xấu số. +3 linh dược, +20 nguyên thạch.','big')},
  sontacvuong:()=>{const n=Math.round(40*(W('daotac')?1.3:1));S.stones+=n;S.danh+=10;log(`Hang ổ Độc Nhãn bị san phẳng. Nhiệm vụ đường thưởng ${n} nguyên thạch, danh vọng +10.`,'big')},
  end_bai:()=>{S.over='win';S.ending='bai_dong'},
  // Canon VN 204–205: BNB tự bạo lần hai nhốt Thiên Hạc; Âm cổ cứu nàng sống lại thành nữ, Phương Nguyên giữ Dương cổ
  end_thien2:()=>{S.over='win';S.ending='huyetlo_bai';S.f.baiNu=1;
    if(hasGu('amduong')){loseGuQ1('amduong');gainGu('duongco',true)}
    log('Bạch Ngưng Băng tự bạo lần nữa, băng giá nhốt Thiên Hạc Thượng Nhân vào ngọc quan. Ngươi đặt Âm cổ lên pho tượng băng. Nàng mở mắt, thành nữ nhân. Dương cổ ở lại trong không khiếu ngươi: một ý niệm là nàng chết.','big')},
  end_huyetlo:()=>{S.over='win';S.ending=(S.rel.bai||0)>=20||S.f.baiWeak?'huyetlo_bai':'huyetlo'},
  end_ma:()=>{S.over='win';S.ending='ma'},
  end_chinh:()=>{S.over='win';S.ending='chinh'},
  end_thanhthu:()=>{S.over='win';S.ending='thanhthu_chinh'},
  end_songhung:()=>{S.over='win';S.ending='song_hung'},
  end_tienlo:()=>{S.over='win';S.ending='tien_lo'},
  end_phantoc:()=>{S.over='win';S.ending='phan_toc'},
};

function finalMod(){return (S.chuyen<3?1.3:1)*(S.f.baiAlly?.65:1)}

// Số phận những người khác: mỗi nhân vật một câu theo đúng nhánh của họ. Không có nhánh thì không nói.
function endingFates(){
  const e=S.ending,o=[],add=(n,t)=>t&&o.push({n,t});
  if(S.met&&S.met.kimsinh)add('Cổ Kim Sinh',{
    dead:'Xác hắn nằm lại dưới khe đá sau núi. Không ai tìm thấy.',
    escaped:'Hắn theo thương đội xuống núi, đi đâu cũng kể chuyện bị một học trò Cổ Nguyệt phục kích.',
    extort:'Hắn xuống núi với tờ giấy nợ ký cho ngươi, cả đời sợ anh trai biết.',
    reported:'Trò lừa bị vạch trần, hắn bị anh trai quản chặt, ôm hận xuống núi.'}[S.f.jks]||(S.f.jksDone?'Hắn say khướt trong tửu quán tới ngày thương đội xuống núi, không bao giờ biết mình đã suýt chết.':''));
  if(S.met&&S.met.thanhthu&&e!=='thanhthu_chinh'){
    if(S.f.qingshuDead)add('Cổ Nguyệt Thanh Thư','Hắn đã hóa thành cái cây giữa tường trại từ đêm lang triều. Băng giá cuối cùng phủ lên cả tán lá.');
    else if(S.f.qingshuAlive)add('Cổ Nguyệt Thanh Thư',S.f.ttTrust?'Hắn sống sót qua lang triều nhờ ngươi. Đêm cuối, hắn ở lại dẫn tộc nhân chạy về phía đông, không hỏi ngươi đi đâu.':'Hắn sống sót qua lang triều. Đêm cuối, hắn ở lại dẫn tộc nhân chạy về phía đông.');
  }
  if(e!=='song_hung'){
    if(S.f.pcHate)add('Cổ Nguyệt Phương Chính','Cụt một tay từ đêm lang triều. Thiên Hạc Thượng Nhân mang hắn về Trung Châu. Hắn thề sẽ quay lại tìm ngươi.');
    else if(S.f.pcAlly)add('Cổ Nguyệt Phương Chính','Thiên Hạc Thượng Nhân mang hắn về Trung Châu. Trước khi đi, hắn còn ngoái lại tìm ngươi giữa biển băng.');
    else add('Cổ Nguyệt Phương Chính','Giữa Hạc Tai, Thiên Hạc Thượng Nhân nhìn trúng tư chất Giáp đẳng của hắn và mang hắn về Trung Châu.');
  }
  if(S.met&&S.met.tiexueleng)add('Thiết Huyết Lãnh',{
    killed:'Thần bổ Ngũ chuyển gục ngã dưới tay ngươi.',
    dead_nd:'Hắn đồng quy vu tận với Huyết Cương, để lại hai con cổ Trấn Ma trên ngực thủy tổ.',
    left:'Hắn đuổi theo chứng cứ giả về phía Hùng gia, và không bao giờ quay lại.',
    ally:'Bị thương nặng sau trận Huyết Cương, hắn gật đầu với ngươi một lần rồi rời núi.'}[S.f.tieFate]||'Hắn ngã xuống cùng Huyết Cương, như trong ký ức kiếp trước của ngươi.');
  if(S.met&&S.met.nhuocnam)add('Thiết Nhược Nam',S.f.tieFate==='killed'?'Nàng khóc gọi cha giữa sân, thề sẽ tìm ra kẻ giết cha.':S.f.tieFate==='ally'?'Nàng dìu cha xuống núi. Nàng còn nợ ngươi một lần.':S.f.tieFate==='left'?'Nàng theo cha về phía Hùng gia, trong sổ tay vẫn còn tên ngươi.':'Nàng mang tro cốt cha rời núi một mình.');
  if(S.met&&S.met.tramthuy){
    if(S.f.tramthuyGone)add('Trầm Thúy','Nàng đã rời trại từ trước. Không ai biết nàng đi đâu.');
    else if(S.f.tramthuySpy&&S.f.eyes)add('Trầm Thúy','Nàng theo ngươi tới đêm cuối, rồi biến mất trong đám người chạy nạn.');
  }
  if(S.f.tlBan&&S.f.tlBan!=='khong')add('Cậu mợ Đống Thổ',{xaloi:'Họ giữ tửu lâu và trúc lâu tới ngày sơn trại sụp. Cả đời không biết số nguyên thạch ấy đã thành bậc thang cho cháu mình.',gia:'Họ giữ tửu lâu tới ngày sơn trại sụp. Cả đời không biết cháu mình là ai.',re:'Họ giữ tửu lâu tới ngày sơn trại sụp. Cả đời không biết cháu mình là ai.',ngocbi:'Cậu trả lại con cổ của cha ngươi. Đó là việc tử tế duy nhất ngươi còn nhớ về họ.',giayno:'Mạc gia siết nợ, họ mất cả tửu lâu lẫn nhà. Đêm sơn trại sụp, không ai thấy họ.',tramthuy:'Họ đổi một tỳ nữ lấy cả tửu lâu và tưởng mình được hời.'}[S.f.tlBan]);
  if(S.f.benhXa==='cuu')add('Hoa Hân','Người duy nhất sống sót của tiểu tổ Bệnh Xà. Nàng chạy về phía đông cùng tộc nhân, vẫn còn nợ ngươi một mạng.');
  if(!['huyetlo_bai','bai_dong'].includes(e)&&S.met&&S.met.bai)add('Bạch Ngưng Băng','Hắn tự bạo Bắc Minh Băng Phách Thể, đóng băng cả ngọn núi. Đó là cái chết rực rỡ mà hắn luôn muốn.');
  return o;
}
function endingText(k){const E=ENDINGS[k]||{t:'Còn tiếp',d:''};return typeof E.d==='function'?E.d():E.d}
const ENDINGS={
  huyetlo_bai:{t:'Giáp đẳng từ biển máu',d:()=>'Máu cả tộc hóa thành tư chất chín thành. Xuân Thu Thiền cạn kiệt, tu vi rơi về Nhất chuyển. Âm cổ khiến Bạch Ngưng Băng sống lại thành nữ, Dương cổ trong tay ngươi. Hai người xuôi dòng Hoàng Long rời Thanh Mao Sơn.'+(S.f.qingshuDead&&!S.f.pcAlly&&!S.f.pcHate&&!S.f.tieAlly?' Mọi thứ diễn ra đúng như nguyên tác.':' Con đường tới đây đã khác nguyên tác, nhưng cái kết vẫn về cùng một chỗ.')},
  huyetlo:{t:'Giáp đẳng từ biển máu',d:'Máu cả tộc hóa thành tư chất Giáp đẳng 99%. Ngươi một mình bước ra khỏi Thanh Mao Sơn đã đóng băng. Bạch Ngưng Băng không đi cùng.'},
  ma:{t:'Ma đạo độc hành',d:()=>(S.f.endTunnel?'Thông đạo ngầm của thủy tổ dẫn ngươi ra một khe núi phía nam. Không ai thấy ngươi rời đi.':'Ngươi mở đường máu qua vòng vây Bạch gia, một mình xuống núi.')+` Từ đỉnh núi phía đông, Phương Nguyên nhìn Thanh Mao Sơn chìm trong biển băng và biển lửa. Tư chất ${talentName(S.tuchat)}, con đường trường sinh còn dài.`},
  chinh:{t:'Người giữ lửa Cổ Nguyệt',d:'Ngươi dẫn tàn dư Cổ Nguyệt thoát khỏi biển lửa. Mấy chục người sống sót nhìn ngươi như nhìn tộc trưởng mới. Câu chuyện này đã rẽ khỏi nguyên tác.'},
  thanhthu_chinh:{t:'Kế thừa Thanh Thư · Trụ cột Chính đạo',d:'Ngươi và Thanh Thư cùng cứu sống lẫn nhau giữa biển lửa và băng giá. Với uy vọng to lớn, ngươi kế thừa ý chí của Thanh Thư, bảo vệ huyết mạch Cổ Nguyệt dựng lại sơn trại mới, trở thành trụ cột trẻ tuổi nhất của tộc.'},
  bai_dong:{t:'Băng và máu cùng xuống núi',d:'Bạch Ngưng Băng phản bội Bạch gia, cùng ngươi mở đường máu ra khỏi Thanh Mao Sơn. Hắn vẫn đang chết dần vì thể chất, ngươi vẫn chỉ là Bính đẳng. Hai kẻ không có gì để mất cùng đi về phương nam.'},
  tien_lo:{t:'Kẻ luyện cả thủy tổ',d:'Ngươi biết trước ngày Huyết Cương tỉnh, và đã dùng chính máu thủy tổ nuôi lò. Không cần tế cả tộc, tư chất đã lên Ất đẳng. Cổ Nguyệt vẫn diệt vong, nhưng tay ngươi sạch hơn nguyên tác một chút. Chỉ người đã chết nhiều lần mới đi được con đường này.'},
  phan_toc:{t:'Cổng sau đêm tuyết',d:'Ngươi bán con đường vào trại cho Bạch gia để đổi lấy đường sống. Kiếp trước ngươi đã thấy Cổ Nguyệt diệt vong ra sao; kiếp này ngươi chỉ chọn đứng ở phía còn sống. Không ai trong tộc biết kẻ mở cổng là ai.'},
  song_hung:{t:'Song Hùng Cổ Nguyệt',d:'Phương Chính sát cánh bên Phương Nguyên. Hai huynh đệ lưng tựa lưng mở đường máu qua vòng vây Bạch gia, rời Thanh Mao Sơn đang đóng băng. Đôi mắt ngây thơ của Phương Chính đã trưởng thành, nhận ra bản chất tàn khốc của thế gian.'},
};

/* ================= Cánh bướm: hậu quả trễ (q_) và dị số (loc:'diso') ================= */
// Hậu quả trễ được đẩy vào bằng later() trong butterfly.js. Không có loc nên không bị rút ngẫu nhiên.
Object.assign(EV,{
q_hoctrophuc:{title:'Bạn học phục thù',
  text:()=>'Tan học, đám bạn học từng bị ngươi chặn cổng đã chờ sẵn trong ngõ tối. Lần này chúng đông hơn, và có cả người Mạc gia đứng sau.',
  choices:()=>[
    {t:'Đánh',eff:()=>{fight('hoctro',{mod:1.25});return 'Cả đám cùng rút cổ.'}},
    {t:'Ném lại 20 nguyên thạch cho yên chuyện',req:()=>S.stones>=20,reqT:'Cần 20 nguyên thạch',eff:()=>{S.stones-=20;S.danh-=3;return 'Chúng nhặt thạch rồi bỏ đi, vừa đi vừa cười.'}},
    {t:'Lẻn qua mái nhà',check:['tamco',12],ok:()=>'Ngươi về tới nhà trước khi chúng kịp nhận ra.',fail:()=>{fight('hoctro',{mod:1.25});return 'Ngói vỡ. Cả ngõ quay lại nhìn.'}},
  ]},
q_laotam:{title:'Lão thợ săn trả ơn',who:'thuongtam',
  text:()=>'Lão Tam tìm tới tận cổng trại: "Cổ sư trẻ, bữa trước ngươi giúp lão. Lão thấy một ổ cổ hoang ở khe đá phía đông, chưa ai đụng tới."',
  choices:[
    {t:'Theo lão lên núi',check:['ngo',10],ok:()=>{gainGu(pick(WILD));return 'Ổ cổ hoang vẫn còn đó. Ngươi luyện hóa được một con.'},fail:()=>{S.herbs++;return 'Ổ cổ đã bị thú rừng phá. Lão Tam áy náy, dúi cho ngươi một gốc linh dược.'}},
    {t:'Cảm ơn rồi thôi',eff:()=>{rel('thuongtam',10);return 'Lão gật đầu, không hỏi thêm.'}},
  ]},
q_pcdo:{title:'Lời nói đỡ',who:'phuongchinh',cond:()=>S.susp>=20,
  text:()=>'Gia lão gọi ngươi tới hỏi chuyện. Chưa kịp mở lời, Phương Chính đã bước vào: "Mấy hôm đó ca ca ở cùng đệ." Hắn nói dối không giỏi, nhưng hắn là Giáp đẳng.',
  choices:[
    {t:'Im lặng để hắn nói',eff:()=>{S.susp=Math.max(0,S.susp-20);rel('phuongchinh',10);return 'Gia lão cho hai người về. Hiềm nghi −20.'}},
    {t:'Gạt hắn ra, tự trả lời',check:['tamco',13],ok:()=>{S.susp=Math.max(0,S.susp-10);S.tamco++;return 'Ngươi không cần ai che. Tâm cơ +1, hiềm nghi −10.'},fail:()=>{rel('phuongchinh',-10);S.susp+=5;return 'Phương Chính cúi mặt bỏ ra ngoài. Hiềm nghi +5.'}},
  ]},
q_jksthem:{title:'Kim Sinh trả đũa',who:'kimsinh',
  text:()=>'Cổ Kim Sinh chặn đường ngươi, lần này dắt theo hai gã hộ vệ: "Tờ giấy nợ đó, trả lại đây. Cộng thêm ba mươi khối tiền thuốc cho cái mặt ta."',
  choices:[
    {t:'Trả giấy nợ và 30 nguyên thạch',req:()=>S.stones>=30,reqT:'Cần 30 nguyên thạch',eff:()=>{S.stones-=30;S.danh-=4;return 'Hắn xé tờ giấy nợ, cười hả hê. Người đi đường thấy cả. Danh vọng −4.'}},
    {t:'Không trả',eff:()=>{fight('giave',{after:'giave_jks'});return 'Ngươi rút cổ. Hai gã hộ vệ bước lên chắn trước Kim Sinh.'}},
    {t:'Hẹn hắn ra khe đá, bảo đồ để ở đó',tag:'ma',dao:12,check:['tamco',12],ok:()=>{fight('kimsinh',{after:'kimsinh',terrain:'khe'});return 'Hắn tham, nên hắn tới. Lần này hắn đi một mình.'},fail:()=>{S.susp+=10;fight('giave',{after:'giave_jks'});return 'Hắn nghi, cho hộ vệ đi trước. Hiềm nghi +10.'}},
  ]},
q_jksthu:{title:'Món nợ của Cổ Kim Sinh',who:'kimsinh',
  text:()=>'Cổ Kim Sinh chưa quên chuyện bị tộc trưởng mắng vì ngươi. Mấy gã sơn tặc hắn thuê đang chờ ngươi ở đường về.',
  choices:[
    {t:'Đánh',eff:()=>{fight('sontac',{});return 'Bọn chúng xông ra.'}},
    {t:'Nộp 25 nguyên thạch',req:()=>S.stones>=25,reqT:'Cần 25 nguyên thạch',eff:()=>{S.stones-=25;return 'Bọn chúng đếm thạch rồi bỏ đi.'}},
  ]},
q_giapho:{title:'Cổ Phú tới sớm',who:'giaphu',
  text:()=>'Có người trong chợ đã thấy ngươi đi cùng Cổ Kim Sinh. Cổ Phú không đợi được lâu như ký ức, hắn tìm tới ngay.',
  choices:[
    {t:'Bình thản chối',check:['tamco',13],ok:()=>{S.susp+=5;return 'Cổ Phú nhìn ngươi rất lâu rồi đi. Hiềm nghi +5.'},fail:()=>{S.susp+=20;return 'Ngươi trả lời chậm nửa nhịp. Hiềm nghi +20.'}},
    {t:'Dâng 40 nguyên thạch "chia buồn"',req:()=>S.stones>=40,reqT:'Cần 40 nguyên thạch',eff:()=>{S.stones-=40;S.susp+=10;return 'Cổ Phú nhận thạch. Hắn không tin ngươi, nhưng tạm thời đi.'}},
  ]},
q_tramthuyhan:{title:'Tin đồn trong trại',who:'tramthuy',
  text:()=>'Trầm Thúy chưa quên lần bị ngươi làm nhục. Khắp trại bắt đầu đồn Phương Nguyên bất hiếu, ức hiếp người hầu.',
  choices:[
    {t:'Mặc kệ',eff:()=>{S.danh-=8;return 'Danh vọng −8.'}},
    {t:'Tìm ra người tung tin',check:['tamco',12],ok:()=>{rel('tramthuy',-10);S.danh+=3;return 'Ngươi chặn được nguồn tin. Trầm Thúy không dám ho he nữa.'},fail:()=>{S.danh-=12;return 'Càng hỏi, tin đồn càng lan. Danh vọng −12.'}},
  ]},
q_baigiatrach:{title:'Tiểu tổ bị thương',who:'thanhthu',cond:()=>!S.f.qingshuDead,
  text:()=>'Tuần trước ngươi viện cớ bế quan. Tiểu tổ thiếu người, đụng Bạch gia ở biên giới, hai người bị thương. Thanh Thư không trách, chỉ nhìn ngươi lâu hơn thường lệ.',
  choices:[
    {t:'Xin lỗi, mang thuốc tới thăm',req:()=>S.herbs>=1,reqT:'Cần 1 linh dược',eff:()=>{S.herbs--;rel('thanhthu',5);return 'Thanh Thư gật đầu: "Lần sau đi cùng nhau."'}},
    {t:'Không giải thích',eff:()=>{rel('thanhthu',-15);S.danh-=5;return 'Danh vọng −5.'}},
  ]},
q_hunggiatim:{title:'Hùng gia đòi đất',
  text:()=>'Hùng gia phát hiện cột mốc bị dời. Hai Cổ sư Hùng gia tới tận nhiệm vụ đường, chỉ đích danh người đã đi tuần hôm đó.',
  choices:[
    {t:'Ra mặt tiếp',eff:()=>{fight('hunggia',{});return 'Hắn không nói nhiều.'}},
    {t:'Đẩy trách nhiệm cho gia tộc',check:['tamco',13],ok:()=>{S.danh+=3;return 'Gia tộc đứng ra nhận, còn khen ngươi giữ đất.'},fail:()=>{S.stones=Math.max(0,S.stones-30);return 'Gia tộc bắt ngươi tự bồi thường 30 nguyên thạch.'}},
  ]},
q_kiemkho:{title:'Kiểm kho nguyên thạch',
  text:()=>'Kho gia tộc kiểm kê cuối tháng. Rương ngươi áp tải hôm trước thiếu mười mấy viên.',
  choices:[
    {t:'Đổ cho phu khuân vác',tag:'ma',check:['tamco',13],ok:()=>'Một phàm nhân bị đánh hai mươi roi. Không ai nhìn tới ngươi.',fail:()=>{S.susp+=25;S.danh-=5;return 'Không ai tin. Hiềm nghi +25.'}},
    {t:'Lặng lẽ bù lại 18 viên',req:()=>S.stones>=18,reqT:'Cần 18 nguyên thạch',eff:()=>{S.stones-=18;return 'Sổ sách khớp. Chuyện qua đi.'}},
  ]},
q_tocnghi:{title:'Gốc cây bị đào',who:'toctruong',
  text:()=>'Sáng ra, tộc trưởng Cổ Nguyệt Bác thấy gốc cây con nuôi hóa thành bị đào xới. Ông không nói gì, chỉ cho người hỏi han khắp trại.',
  choices:[
    {t:'Tỏ ra phẫn nộ cùng mọi người',check:['tamco',14],ok:()=>{S.susp+=3;return 'Ngươi phẫn nộ vừa đủ. Hiềm nghi +3.'},fail:()=>{S.susp+=15;rel('toctruong',-15);return 'Tộc trưởng nhìn ngươi lâu hơn những người khác. Hiềm nghi +15.'}},
    {t:'Tránh mặt vài hôm',eff:()=>{S.susp+=8;return 'Hiềm nghi +8.'}},
  ]},

// Dị số: chuyện kiếp trước chưa từng có, chỉ xảy ra khi thế giới đã lệch khỏi ký ức.
// memD: điều ngươi nhớ được sau khi đã gặp (thành ký ức 'ds_<id>', giúp lần sau).
d_thietsom:{loc:'diso',w:1,once:1,cond:()=>S.turn<22,who:'tiexueleng',title:'Thần bổ đi ngang',memD:'Thiết Huyết Lãnh từng tới Thanh Mao Sơn sớm hơn ký ức.',
  text:()=>'Một người áo đen cưỡi ngựa đi ngang cổng trại, dừng lại hỏi đường về phía Cổ gia. Thanh đao bên hông hắn có khắc chữ Thiết. Trong ký ức, hắn chưa từng tới sớm thế này.',
  choices:[
    {t:'Chỉ đường, dò ý hắn',check:['tamco',13],bonus:()=>mem('ds_d_thietsom')?4:0,ok:()=>{meet('tiexueleng');S.f.tieIntel=1;return 'Hắn đang truy một vụ khác, nhưng ngươi biết được cách hắn hỏi cung.'},fail:()=>{meet('tiexueleng');S.susp+=S.f.killedJKS?15:5;return 'Hắn nhìn ngươi lâu hơn cần thiết.'}},
    {t:'Tránh mặt',eff:()=>'Ngươi quay vào trong.'},
  ]},
d_thuongnhan:{loc:'diso',w:()=>driftTier()>=2?1.5:1,luck:1,title:'Thương nhân lạ mặt',memD:'Có một thương nhân Cổ gia không có trong ký ức, bán cổ Nhị chuyển giá rẻ.',
  text:()=>'Một thương nhân mặc áo Cổ gia nhưng ngươi chưa từng thấy mặt bày hàng ở góc chợ. Trong lồng của hắn có một con cổ Nhị chuyển.',
  choices:()=>{const k=S.f.dsGu||(S.f.dsGu=pick(['nguyetngan','thuytrao','bangdao','hoalo','anlan'])),pr=Math.round(GU[k].p*.6);return [
    {t:`Mua ${GU[k].n} giá ${pr} nguyên thạch`,req:()=>S.stones>=pr,reqT:`Cần ${pr} nguyên thạch`,eff:()=>{S.stones-=pr;gainGu(k);S.f.dsGu=0;return 'Hắn gói con cổ lại, không mặc cả.'}},
    {t:'Hỏi hắn từ đâu tới',check:['tamco',12],ok:()=>{S.f.dsGu=0;S.stones+=10;return 'Hắn là người Thương gia giả làm Cổ gia để tránh thuế. Hắn trả 10 nguyên thạch để ngươi im lặng.'},fail:()=>{S.f.dsGu=0;return 'Hắn thu dọn hàng rồi biến mất.'}},
  ]}},
d_baidoiduong:{loc:'diso',w:1,cond:()=>!S.f.tideDone,title:'Dấu chân lạ ở biên giới',memD:'Bạch gia có thể đổi đường tuần tra khi thế giới lệch.',
  text:()=>'Ở ranh giới với Bạch gia, dấu chân áo trắng đi một con đường ngươi không nhớ có.',
  choices:[
    {t:'Lần theo',check:['ngo',12],bonus:()=>mem('ds_d_baidoiduong')?4:0,ok:()=>{log(varShifted('baigia')?'Ngươi chắc chắn: Bạch gia đã đổi đường tuần, ký ức về họ không còn đúng.':'Con đường mới chỉ là đường tắt. Đường tuần chính vẫn như ký ức.','mem');return 'Ngươi ghi nhớ con đường.'},fail:()=>{fight('baitrinhsat',{});return 'Áo trắng quay lại đúng lúc ngươi tới gần.'}},
    {t:'Báo về gia tộc',tag:'chinh',eff:()=>{S.danh+=5;return 'Danh vọng +5.'}},
  ]},
d_langdo:{loc:'diso',w:1,cond:()=>!S.f.tideDone&&S.turn>=10,title:'Sói trinh sát',memD:'Trước lang triều có sói đầu đàn đi dò đường, giết được thì trại chuẩn bị tốt hơn.',
  text:()=>'Một con Điện Lang to gấp rưỡi đồng loại lảng vảng quanh tường trại mấy đêm liền. Kiếp trước chưa từng có con sói nào tới sớm như vậy.',
  choices:[
    {t:'Rình giết nó',eff:()=>{fight('dienlang',{elite:true,after:'wolfscout'});return 'Nó quay đầu nhìn thẳng vào chỗ ngươi nấp.'}},
    {t:'Báo gia lão tăng người canh tường',eff:()=>{S.f.wolfPrep=1;S.danh+=3;return 'Tường trại được gia cố. Khi lang triều tới, sát thương lên sói +15%.'}},
  ]},
d_pckhaingo:{loc:'diso',w:()=>driftTier()>=2?1.5:1,luck:1,once:1,who:'phuongchinh',title:'Phương Chính khai ngộ',memD:'Phương Chính có thể khai ngộ sớm và sinh nghi với ca ca.',
  text:()=>'Phương Chính bất ngờ đột phá giữa buổi luyện tập. Tối đó hắn đứng trước cửa phòng ngươi: "Ca ca, sao huynh luôn biết trước chuyện sẽ xảy ra?"',
  choices:[
    {t:'"Đoán thôi."',check:['tamco',12],bonus:()=>mem('ds_d_pckhaingo')?4:0,ok:()=>{rel('phuongchinh',5);return 'Hắn gãi đầu, rồi cười.'},fail:()=>{rel('phuongchinh',-15);S.susp+=10;return 'Hắn không tin. Hiềm nghi +10.'}},
    {t:'Đóng cửa',eff:()=>{rel('phuongchinh',-20);return 'Hắn đứng ngoài rất lâu.'}},
  ]},
d_linhtuyen:{loc:'diso',w:()=>driftTier()>=2?1.5:1,luck:1,once:1,title:'Linh tuyền sau sạt lở',memD:'Có một hốc linh tuyền lộ ra sau sạt lở ở hậu sơn.',
  text:()=>'Mưa đêm qua làm sạt một mảng núi sau trại, lộ ra một hốc nước tỏa linh khí. Ký ức không có chỗ này.',
  choices:[
    {t:'Ngồi thiền bên linh tuyền',eff:()=>{S.ess=maxEss();S.prog+=30;levelUp();return 'Chân nguyên hồi đầy, tu vi +30.'}},
    {t:'Múc nước đem bán',eff:()=>{S.stones+=25;return '+25 nguyên thạch.'}},
  ]},
d_hunglienminh:{loc:'diso',w:()=>driftTier()>=2?1.5:1,luck:1,once:1,title:'Sứ giả Hùng gia',memD:'Hùng gia có thể ngỏ ý liên minh riêng với ngươi.',
  text:()=>'Một Cổ sư Hùng gia chặn ngươi ở bìa rừng. Hắn không rút cổ, chỉ đưa ra một túi thạch: "Hùng gia cần một người trong Cổ Nguyệt."',
  choices:[
    {t:'Nhận túi thạch',tag:'ma',dao:10,drift:4,eff:()=>{S.stones+=40;S.susp+=15;return '+40 nguyên thạch. Hiềm nghi +15.'}},
    {t:'Bắt hắn nộp cho gia tộc',tag:'chinh',eff:()=>{fight('hunggia',{});return 'Hắn cười khẩy rồi rút cổ.'}},
    {t:'Từ chối',eff:()=>'Hắn nhún vai bỏ đi.'},
  ]},
d_huyetthu:{loc:'diso',w:1,once:1,cond:()=>S.turn>=8,title:'Ma tu đổi đường',memD:'Huyết Thủ ma tu có thể đổi đường đi và xuất hiện gần trại.',
  text:()=>'Mùi máu tanh ngay sau trại. Huyết Thủ ma tu, kẻ đáng lẽ ở sâu trong núi, đang ngồi trên tảng đá nhìn về phía cổng.',
  choices:[
    {t:'Lùi lại thật chậm',check:['satphat',14],bonus:()=>mem('ds_d_huyetthu')?4:0,ok:()=>'Hắn không đuổi theo.',fail:()=>{fight('madutam',{mod:.8,canFlee:true});return 'Hắn đã thấy ngươi.'}},
    {t:'Báo động cả trại',tag:'chinh',eff:()=>{S.danh+=6;S.susp=Math.max(0,S.susp-5);return 'Gia lão dẫn người ra. Ma tu bỏ đi. Danh vọng +6.'}},
  ]},
d_thamtra:{loc:'diso',w:1,once:1,title:'Gia lão lạ mặt',memD:'Có một gia lão lạ tra hỏi lại lễ khai khiếu của ngươi.',
  text:()=>'Một gia lão ngươi không nhớ mặt gọi ngươi vào từ đường, lật lại sổ lễ khai khiếu. "Bính đẳng mà tu vi thế này, lạ thật."',
  choices:[
    {t:'Trả lời cho qua',check:['tamco',14],bonus:()=>mem('ds_d_thamtra')?4:0,ok:()=>'Ông ta gật gù cho về.',fail:()=>{S.susp+=15;return 'Ông ta ghi gì đó vào sổ. Hiềm nghi +15.'}},
    {t:'Biếu 30 nguyên thạch',req:()=>S.stones>=30,reqT:'Cần 30 nguyên thạch',eff:()=>{S.stones-=30;return 'Sổ được gấp lại.'}},
  ]},
d_tuutrung:{loc:'diso',w:1,once:1,cond:()=>!S.f.hs,title:'Có kẻ tới khe rượu trước',memD:'Có kẻ khác cũng biết khe rượu hậu sơn.',
  text:()=>'Ở khe đá sau núi, vò hầu nhi tửu đã bị ai đó đặt sẵn. Có người khác cũng đang dụ Tửu Trùng.',
  choices:[
    {t:'Cướp tay trên',tag:'ma',check:['ngo',12],ok:()=>{gainGu('tuutrung');S.f.hs=1;return 'Ngươi tới trước kẻ kia một bước. Tửu Trùng là của ngươi.'},fail:()=>{S.f.hsBonus=(S.f.hsBonus||0)-2;return 'Tửu Trùng đã bị kẻ khác mang đi. Lần sau vào hậu sơn khó hơn.'}},
    {t:'Nấp xem là ai',check:['tamco',12],ok:()=>{S.f.hsBonus=(S.f.hsBonus||0)+2;return 'Chỉ là một học trò Mạc gia. Ngươi nhớ mặt hắn, và biết hắn bỏ sót chỗ nào.'},fail:()=>'Ngươi không thấy ai tới.'},
  ]},
});
AFTER.wolfscout=()=>{S.f.wolfPrep=1;log('Sói trinh sát gục ngã. Khi lang triều tới, ngươi đã quen đòn của chúng: sát thương lên sói +15%.','good')};
