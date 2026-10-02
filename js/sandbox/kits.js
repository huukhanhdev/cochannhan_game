// Bộ chiêu sandbox E (chỉ dữ liệu). Số liệu là giả thuyết, chỉnh sau khi chơi thử / chạy máy đấu máy.
// Thời gian: giây của trận. Khoảng cách: px thế giới (sân 1000 × 240).
// clip: danh sách ưu tiên; view lấy clip đầu tiên có trong sheet (sk_* riêng → clip dự phòng → idle).
// kind: melee (cung trước mặt) · proj (đạn bay thẳng) · aoe (vùng tại điểm, báo trước) · grab (chộp kéo)
//       buff (hộ thể, cùng nhóm thì thay thế) · dash (lướt) · heal (vật phẩm, có số lượng) · escape (thoát thân)
// Căn cứ nguyên tác ghi ở cột src; 'game' = chuyển thể để cân bằng.
// TÍCH HỢP: campaign sinh skills từ S.gu (PN) và EN/EAI (địch) theo cùng định dạng.
(function(root){
  const SB_KITS={
    pn:{n:'Phương Nguyên',sprite:'phuong_nguyen',hp:220,ess:100,essRegen:2.2,speed:270,
      atk:{id:'atk',n:'Đánh tay',icon:'拳',kind:'melee',clip:['atk','attack'],startup:.18,active:.10,recovery:.25,cd:0,cost:0,range:85,depth:44,dmg:12,
        src:'ch100,131: sức 2 trư chi lực',d:'Chuột phải / trái vào địch: tự tới tầm rồi đấm.'},
      skills:[
        {key:'q',id:'nguyet',n:'Nguyệt Mang',icon:'月',kind:'proj',clip:['sk_nguyet','cast'],startup:.30,active:.05,recovery:.30,cd:2.2,cost:8,
          speed:620,range:560,dmg:21,pierce:.5,fx:'moon',src:'ch101,131,136',d:'Phóng nguyệt nhận về phía con trỏ. Xuyên một nửa hộ thể.'},
        {key:'w',id:'bachngoc',n:'Bạch Ngọc',icon:'玉',kind:'buff',clip:['sk_bachngoc','guard'],startup:.20,active:.05,recovery:.20,cd:9,cost:10,
          group:'shield',red:.5,dur:3,tint:0xe8f4ff,src:'ch100,116,124',d:'Da hóa ngọc: giảm 50% sát thương 3 giây.'},
        {key:'e',id:'cuxi',n:'Cự Xỉ Kim Ngô',icon:'蜈',kind:'melee',clip:['sk_cuxi','heavy'],startup:.40,active:.12,recovery:.45,cd:6,cost:14,
          range:125,depth:60,dmg:34,bleed:{dps:4,dur:3},fx:'saw',src:'ch186-188',d:'Rết vàng răng cưa xé phía trước, gây chảy máu.'},
        {key:'r',id:'cuongthu',n:'Cường Thủ',icon:'手',kind:'grab',clip:['sk_cuongthu','heavy'],startup:.45,active:.10,recovery:.50,cd:10,cost:16,
          range:190,depth:50,dmg:18,pull:110,src:'ch138,143,165',d:'Bàn tay sắt chộp và giật đối thủ lại gần.'},
        {key:'d',id:'thienbong',n:'Thiên Bồng',icon:'蓬',kind:'buff',clip:['sk_thienbong','guard'],startup:.40,active:.05,recovery:.30,cd:14,cost:18,
          group:'shield',red:.65,dur:5,tint:0xfff3c4,src:'ch155,186',d:'Giáp ánh sáng: giảm 65% sát thương 5 giây. Thay Bạch Ngọc.'},
        {key:' ',id:'dash',n:'Lướt',icon:'閃',kind:'dash',clip:['dodge'],startup:.06,active:.18,recovery:.14,cd:2.5,cost:0,dist:190,
          src:'game',d:'Space: lướt về phía con trỏ. Không bất tử.'},
        {key:'1',id:'leaf',n:'Sinh Mệnh Diệp',icon:'葉',kind:'heal',clip:['heal'],startup:.55,active:.05,recovery:.30,cd:8,cost:0,uses:2,amt:50,
          src:'ch76 Cửu Diệp',d:'Hồi 50 khí huyết. Bị ngắt vẫn mất lá.'},
      ]},
    bnb:{n:'Bạch Ngưng Băng',sprite:'bach_ngung_bang_nam',hp:300,ess:100,essRegen:2.4,speed:255,
      // Bạch Ngọc / Băng Trùy tạm bỏ khỏi kit sandbox, chờ xác minh nguồn Q1 (vẫn còn trong js/data.js)
      atk:{id:'atk',n:'Băng nhận',icon:'冰',kind:'melee',clip:['atk','attack'],startup:.22,active:.10,recovery:.28,cd:0,cost:0,range:110,depth:46,dmg:15,
        slow:{f:.7,dur:1.2},fx:'ice',src:'ch135,172: dải hàn băng phóng từ tay',d:'Một tay hất dải hàn băng chém ra, làm chậm.'},
      skills:[
        {key:'q',id:'locbangnhan',n:'Lốc băng nhận',icon:'旋',kind:'aoe',clip:['sk_locbangnhan','heavy'],startup:1.15,active:.15,recovery:.60,cd:10,cost:22,
          radius:125,castRange:340,dmg:48,armor:true,fx:'blizzard',src:'ch140',d:'Báo trước bằng vòng trên đất rồi cuốn lốc băng nhận. Không bị ngắt khi lấy đà.'},
        {key:'w',id:'thuytrao',n:'Thủy Tráo',icon:'水',kind:'buff',clip:['sk_thuytrao','guard'],startup:.30,active:.05,recovery:.25,cd:10,cost:12,
          group:'shield',red:.4,dur:3,tint:0x8fd0ff,src:'ch143: cổ trên người BNB',d:'Cầu nước bao thân: giảm 40% sát thương 3 giây.'},
        {key:'e',id:'suongyeu',n:'Sương Yêu',icon:'霜',kind:'escape',clip:['sk_suongyeu','dodge'],startup:.25,active:.35,recovery:.25,cd:0,cost:0,uses:1,dist:380,
          src:'ch136: hy sinh Sương Yêu cổ để thoát · giới hạn 1 lần/trận là chuyển thể game',
          d:'Hy sinh cổ để thoát thân: lùi xa khỏi đối thủ. Một lần mỗi trận, dùng là mất. Không gây sát thương, không đẩy lùi.'},
        {key:' ',id:'dash',n:'Lướt',icon:'閃',kind:'dash',clip:['dodge'],startup:.06,active:.18,recovery:.14,cd:2.5,cost:0,dist:170,src:'game',d:''},
      ]},
  };
  if(typeof module!=='undefined')module.exports=SB_KITS;else root.SB_KITS=SB_KITS;
})(this);
