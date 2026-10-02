// Bộ chiêu sandbox E (chỉ dữ liệu). Số liệu là giả thuyết, chỉnh sau khi chơi thử / chạy máy đấu máy.
// Thời gian: giây của trận. Khoảng cách: px thế giới (sân 1000 × 240).
// Nhịp (02/10): đòn lấy đà đủ lâu để né bằng di chuyển (≥0,28s, đòn địch ≥0,65s có ô báo trên đất),
// đạn đủ chậm để bước ngang tránh, đánh trượt thì thu chiêu lâu → di chuyển/spacing quyết định trận.
// clip: danh sách ưu tiên; view lấy clip đầu tiên có trong sheet (sk_* riêng → clip dự phòng → idle).
// kind: melee (cung trước mặt) · proj (đạn bay thẳng) · aoe (vùng tại điểm, báo trước) · grab (chộp kéo)
//       buff (hộ thể, cùng nhóm thì thay thế) · dash (lướt) · heal (vật phẩm, có số lượng) · escape (thoát thân)
// Căn cứ nguyên tác ghi ở cột src; 'game' = chuyển thể để cân bằng.
// TÍCH HỢP: campaign sinh skills từ S.gu (PN) và EN/EAI (địch) theo cùng định dạng.
(function(root){
  const SB_KITS={
    // Chân nguyên (người dùng chốt 02/10): cổ sư thường hồi ≈0 trong trận (ch10: Bính đẳng 4%/giờ); hồi giữa cảnh tính theo giờ truyện.
    pn:{n:'Phương Nguyên',sprite:'phuong_nguyen',hp:220,ess:100,essRegen:0,speed:265,
      atk:{id:'atk',n:'Đánh tay',icon:'拳',kind:'melee',clip:['atk','attack'],startup:.28,active:.10,recovery:.46,cd:0,cost:0,range:85,depth:44,dmg:13,
        src:'ch100,131: sức 2 trư chi lực',d:'Chuột phải / trái vào địch: tự tới tầm rồi đấm.'},
      skills:[
        {key:'q',id:'nguyet',n:'Nguyệt Mang',icon:'月',kind:'proj',clip:['sk_nguyet','cast'],startup:.38,active:.05,recovery:.32,cd:2.8,cost:9,
          speed:430,range:560,dmg:21,pierce:.5,fx:'moon',src:'ch101,131,136',d:'Phóng nguyệt nhận về phía con trỏ. Xuyên một nửa hộ thể.'},
        {key:'w',id:'bachngoc',n:'Bạch Ngọc',icon:'玉',kind:'buff',clip:['sk_bachngoc','guard'],startup:.20,active:.05,recovery:.20,cd:9,cost:10,
          group:'shield',red:.5,dur:3,tint:0xe8f4ff,src:'ch100,116,124',d:'Da hóa ngọc: giảm 50% sát thương 3 giây.'},
        {key:'e',id:'cuxi',n:'Cự Xỉ Kim Ngô',icon:'蜈',kind:'melee',clip:['sk_cuxi','heavy'],startup:.55,active:.12,recovery:.45,cd:6,cost:14,
          range:125,depth:60,dmg:34,bleed:{dps:4,dur:3},fx:'saw',src:'ch186-188',d:'Rết vàng răng cưa xé phía trước, gây chảy máu.'},
        {key:'r',id:'cuongthu',n:'Cường Thủ',icon:'手',kind:'grab',clip:['sk_cuongthu','heavy'],startup:.60,active:.10,recovery:.50,cd:10,cost:16,
          range:190,depth:50,dmg:18,pull:110,src:'ch138,143,165',d:'Bàn tay sắt chộp và giật đối thủ lại gần.'},
        {key:'d',id:'thienbong',n:'Thiên Bồng',icon:'蓬',kind:'buff',clip:['sk_thienbong','guard'],startup:.90,active:.05,recovery:.30,cd:14,cost:18,
          group:'shield',red:.65,dur:3,upkeepPerSecond:5,pauseEssRegen:true,tint:0xfff3c4,src:'ch155,186',d:'Vận đứng yên 0,9s; giảm 65% sát thương tối đa 3s. Phí bật 18 + duy trì 5 chân nguyên/s, ngừng hồi chân nguyên khi bật; hết chân nguyên giáp tắt. Thay Bạch Ngọc.'},
        {key:' ',id:'dash',n:'Lướt',icon:'閃',kind:'dash',clip:['dodge'],startup:.06,active:.18,recovery:.14,cd:2.5,cost:0,dist:190,
          src:'game',d:'Space: lướt về phía con trỏ. Không bất tử.'},
        {key:'1',id:'leaf',n:'Sinh Mệnh Diệp',icon:'葉',kind:'heal',clip:['heal'],startup:.55,active:.05,recovery:.30,cd:8,cost:0,uses:2,amt:50,
          src:'ch76 Cửu Diệp',d:'Hồi 50 khí huyết. Bị ngắt vẫn mất lá.'},
      ]},
    // Hồ sơ trận đầu (ch134–139): áp chế xuống nhị chuyển nhưng "tốc độ hơi nhanh hơn PN, chân nguyên càng nhiều hơn" (ch134);
    // Thập Tuyệt thể hồi nhanh hơn Giáp đẳng nhưng vẫn hao (ch136). Số 130 / 0,8/s / 275 là chuyển thể game.
    // story: dưới 30% máu tự nổ Sương Yêu + tay phải (ch139): vỏ băng hồi phục, hất lùi đối thủ, mất Sương Yêu, sang pha một tay.
    // Hạ gục = ép rút lui (người dùng chốt TR-3), không loot cổ.
    bnb:{n:'Bạch Ngưng Băng',sprite:'bach_ngung_bang_nam',hp:300,ess:130,essRegen:.8,speed:275,
      story:{detonateAt:.3,shellDur:2.5,shellRed:.8,shellHeal:24,knock:150,knockSlow:{f:.6,dur:1.5},retreatOnDefeat:true,
        src:'ch139: nổ Sương Yêu cổ ở lòng bàn tay phải, băng thành vỏ giáp để hồi phục; ch140: cổ đã mất · số liệu là game'},
      // Bạch Ngọc / Băng Trùy tạm bỏ khỏi kit sandbox, chờ xác minh nguồn Q1 (vẫn còn trong js/data.js)
      atk:{id:'atk',n:'Băng nhận',icon:'冰',kind:'melee',clip:['atk','attack'],startup:.65,active:.10,recovery:.42,cd:0,cost:0,range:165,depth:46,dmg:24,
        slow:{f:.7,dur:1.2},fx:'ice',src:'ch135,172: dải hàn băng phóng từ tay · tầm 165 (người dùng 03/10: tầm xa hơn để BNB không phải bám sát PN) là game',d:'Một tay hất dải hàn băng chém ra, làm chậm.'},
      skills:[
        {key:'q',id:'locbangnhan',n:'Lốc băng nhận',icon:'旋',kind:'aoe',clip:['sk_locbangnhan','heavy'],startup:1.15,active:.15,recovery:.60,cd:10,cost:22,
          radius:125,castRange:340,dmg:96,armor:true,fx:'blizzard',src:'ch140',d:'Khóa vùng lúc lấy đà, nổ sau 1,15 giây: 96 sát thương trước hộ thể. Bước khỏi vòng đỏ hoặc lướt để né. Không bị ngắt khi lấy đà.'},
        {key:'r',id:'lamdieu',n:'Lam Điểu Băng Quan',icon:'鳥',kind:'proj',clip:['sk_lamdieu','cast'],startup:.70,active:.05,recovery:.40,cd:7,cost:26,
          speed:300,turn:2.2,range:720,dmg:26,slow:{f:.7,dur:1},fx:'bird',
          src:'ch136: cổ tam chuyển trong cổ họng BNB, chim băng xanh tự định vị kẻ địch; ch140: một trong hai cổ tam chuyển của BNB · đang áp chế nên tốn nhiều chân nguyên; tốc độ/góc lượn là game',
          d:'Phun chim băng tự đuổi theo mục tiêu (lượn chậm, né ngang được). Trúng thì làm chậm. Phí 26.'},
        {key:'w',id:'thuytrao',n:'Thủy Tráo',icon:'水',kind:'buff',clip:['sk_thuytrao','guard'],startup:.30,active:.05,recovery:.25,cd:10,cost:12,
          group:'shield',red:.4,dur:3,tint:0x8fd0ff,src:'ch143: cổ trên người BNB',d:'Cầu nước bao thân: giảm 40% sát thương 3 giây.'},
        {key:'e',id:'suongyeu',n:'Sương Yêu',icon:'霜',kind:'empower',clip:['sk_suongyeu','cast'],startup:.40,active:.05,recovery:.30,cd:14,cost:30,
          dur:4,dmgMul:1.35,pierce:.5,after:{f:.7,dur:1.5},tint:0xd8f4ff,
          src:'ch137: cổ tam chuyển, xuyên phòng ngự; dùng chân nguyên nhị chuyển cưỡng ép nên tốn nhiều; dùng quá độ cơ khớp đông cứng · số liệu game',
          d:'Hóa sương yêu 4 giây: đòn mạnh hơn 35%, xuyên một nửa hộ thể. Phí 30. Hết hiệu lực thì khớp đông cứng, chậm 1,5 giây.'},
        {key:' ',id:'dash',n:'Lướt',icon:'閃',kind:'dash',clip:['dodge'],startup:.06,active:.18,recovery:.14,cd:2.5,cost:0,dist:170,src:'game',d:''},
      ]},
  };
  if(typeof module!=='undefined')module.exports=SB_KITS;else root.SB_KITS=SB_KITS;
})(this);
