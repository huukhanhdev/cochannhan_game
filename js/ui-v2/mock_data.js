// UI V2 — Dữ liệu mẫu (Mock Saves) phục vụ Preview & Sandbox
window.UI_V2_MOCKS = {
  q1_early: {
    id: 'q1_early',
    title: 'Q1 · Học Đường Thiếu Niên',
    sub: 'Chương 1: Thanh Mao Sơn · Khai khiếu Bính đẳng 44%',
    book: 1,
    chap: 1,
    time: { season: 'Xuân', month: 2, week: 1, weekName: 'Thượng tuần' },
    hero: {
      name: 'Cổ Nguyệt Phương Nguyên',
      avatar: 'assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg',
      chuyen: 1,
      giai: 1,
      rankText: 'Nhất chuyển sơ kỳ',
      qualText: 'Bính đẳng (44%)',
      hp: 100,
      maxHp: 100,
      ess: 44,
      maxEss: 50,
      essName: 'Thanh Đồng',
      essColor: '#5fae8a',
      stones: 16,
      ap: 2,
      maxAp: 3,
      cicada: 'Đang ngủ say (12%)'
    },
    guList: [
      { k: 'nguyetquang', n: 'Nguyệt Quang Cổ', r: 1, glyph: '月', t: 'attack', food: 'Cánh hoa nguyệt lan', status: 'No đủ', cost: 6, d: 'Trấn tộc cổ của Cổ Nguyệt tộc. Ngưng tụ nguyệt nhận lam thủy tinh.' },
      { k: 'tuutrung', n: 'Tửu Trùng', r: 1, glyph: '酒', t: 'passive', food: 'Rượu ngon', status: 'Hơi đói', d: 'Thực đạo, tinh luyện thanh đồng chân nguyên lên nửa cảnh giới.' },
      { k: 'xuanthu', n: 'Xuân Thu Thiền', r: 6, glyph: '蝉', t: 'fate', food: 'Nước sông Quang Âm', status: 'Tổn thương', d: 'Xếp thứ bảy Thập Đại Kỳ Cổ. Nghịch chuyển thời gian.' }
    ],
    pendingEvent: {
      title: 'Khảo Hạch Rừng Trúc',
      desc: 'Gia lão học đường phát động khảo hạch săn heo rừng lấy nanh. Kẻ đứng đầu được thưởng Bạch Thỉ Cổ.',
      action: 'Vào rừng trúc'
    },
    locations: [
      { id: 'hocduong', n: 'Học Đường', tag: 'Chính', state: 'active', desc: 'Nơi đệ tử tộc tu luyện và nghe gia lão giảng đạo.' },
      { id: 'haoson', n: 'Hậu Sơn', tag: 'Bí mật', state: 'alert', desc: 'Có vết tích cổ mộ và hoa văn Hoa Tửu Hành Giả.' },
      { id: 'chophien', n: 'Chợ Phiên', tag: 'Thương hội', state: 'normal', desc: 'Thương đội Giả gia vừa dựng lều dưới chân núi.' }
    ]
  },

  q1_mid: {
    id: 'q1_mid',
    title: 'Q1 · Lang Triều Đại Chiến',
    sub: 'Chương 3: Huyết Chiến Băng Phong · Nhị chuyển đỉnh phong',
    book: 1,
    chap: 3,
    time: { season: 'Hạ', month: 7, week: 3, weekName: 'Hạ tuần' },
    hero: {
      name: 'Cổ Nguyệt Phương Nguyên',
      avatar: 'assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg',
      chuyen: 2,
      giai: 3,
      rankText: 'Nhị chuyển đỉnh phong',
      qualText: 'Bính đẳng (44%)',
      hp: 175,
      maxHp: 220,
      ess: 90,
      maxEss: 100,
      essName: 'Xích Thiết',
      essColor: '#c8664e',
      stones: 280,
      ap: 1,
      maxAp: 3,
      cicada: 'Rung động cảnh báo (78%)'
    },
    guList: [
      { k: 'huyetnguyet', n: 'Huyết Nguyệt Cổ', r: 2, glyph: '血', t: 'attack', food: 'Máu tươi', status: 'No đủ', cost: 14, d: 'Nguyệt nhận đỏ như máu, vết thương không thể khép miệng.' },
      { k: 'bachngoc', n: 'Bạch Ngọc Cổ', r: 2, glyph: '瓷', t: 'guard', food: 'Bạch ngọc vụn', status: 'No đủ', cost: 6, d: 'Da hóa ngọc trắng toàn diện, chống đỡ đòn nghiền nát.' },
      { k: 'cuxikimngo', n: 'Cứ Xỉ Kim Ngô', r: 3, glyph: '蜈', t: 'attack', food: 'Thịt tươi & vụn sắt', status: 'No đủ', cost: 20, d: 'Rết vàng hai hàng cưa máy, xé toạc mọi giáp trụ.' },
      { k: 'tuvi', n: 'Tứ Vị Tửu Trùng', r: 3, glyph: '酒', t: 'passive', food: 'Tứ vị tửu', status: 'No đủ', d: 'Tinh luyện xích thiết chân nguyên lên sáng bóng.' },
      { k: 'thienbong', n: 'Thiên Bồng Cổ', r: 3, glyph: '蓬', t: 'guard', food: 'Thịt thú rừng', status: 'Đói nhẹ', cost: 15, d: 'Chiếc áo giáp quang minh trắng hư ảo, vững như bàn thạch.' }
    ],
    pendingEvent: {
      title: 'Lôi Quan Lang Tập Kích',
      desc: 'Vạn thú vương sói điện dẫn đầu bầy sói điên cuồng phá cổng thành phía Tây. Gia lão Thanh Thư đang tử chiến!',
      action: 'Tiến lên đầu tường'
    },
    locations: [
      { id: 'dau_tuong', n: 'Đầu Tường Thành', tag: 'Nguy cấp', state: 'danger', desc: 'Mưa máu và sấm sét rền vang, bầy điện lang tràn ngập.' },
      { id: 'duoc_duong', n: 'Dược Đường', tag: 'Trị liệu', state: 'normal', desc: 'Dược gia đang thu gom thương binh, giá lá sinh cơ tăng vọt.' },
      { id: 'bi_dong', n: 'Mật Động Huyết Hồ', tag: 'Kỳ ngộ', state: 'alert', desc: 'Huyết đao dơi bay lượn, Cổ Nguyệt Nhất Đại sắp thức tỉnh.' }
    ]
  },

  q2_thanh: {
    id: 'q2_thanh',
    title: 'Q2 · Hắc Sát Xưng Bá Thương Thành',
    sub: 'Chương 2.4: Thương Gia Thành · Tứ chuyển Lực Đạo đỉnh phong',
    book: 2,
    chap: 4,
    time: { season: 'Thu', month: 9, week: 2, weekName: 'Trung tuần' },
    hero: {
      name: 'Cổ Nguyệt Phương Nguyên (Cổ Việt)',
      avatar: 'assets/local/art/p_hero_avatar.jpg',
      chuyen: 4,
      giai: 1,
      rankText: 'Tứ chuyển sơ kỳ',
      qualText: 'Giáp đẳng (90%) · Huyết Lô tẩy tủy',
      hp: 420,
      maxHp: 420,
      ess: 240,
      maxEss: 280,
      essName: 'Hoàng Kim',
      essColor: '#e0b64a',
      stones: 1350,
      ap: 3,
      maxAp: 3,
      cicada: 'Thức tỉnh hoàn toàn (100%)'
    },
    guList: [
      { k: 'toanluc', n: 'Toàn Lực Dĩ Phó Cổ', r: 3, glyph: '力', t: 'passive', food: 'Thịt thú tươi', status: 'No đủ', d: 'Cổ lực đạo thượng cổ tuyệt tích. 100% phát huy toàn bộ thú lực hư ảnh.' },
      { k: 'kholuc', n: 'Khổ Lực Cổ', r: 4, glyph: '苦', t: 'passive', food: 'Máu tươi & mồ hôi', status: 'No đủ', d: 'Càng đau càng mạnh, chuyển hóa thương tổn thành uy lực cực hạn.' },
      { k: 'khiluc', n: 'Khí Lực Cổ', r: 3, glyph: '气', t: 'attack', food: 'Gió núi', status: 'No đủ', cost: 18, d: 'Biến hư ảnh thú lực thành thực thể lao ra xa oanh kích tầm xa.' },
      { k: 'tulucsinh', n: 'Tự Lực Cánh Sinh', r: 3, glyph: '苏', t: 'heal', food: 'Thịt tươi', status: 'No đủ', cost: 14, d: 'Hồi phục khí huyết thần tốc theo tổng chỉ số thú lực.' },
      { k: 'thiennguyen', n: 'Thiên Nguyên Bảo Liên', r: 3, glyph: '莲', t: 'passive', food: 'Tự dưỡng', status: 'Viên mãn', d: 'Hạng ba trần gian, mỗi ngày tự sinh 50 nguyên thạch.' },
      { k: 'cotduc', n: 'Cốt Dực Cổ', r: 4, glyph: '翼', t: 'passive', food: 'Tủy xương đại bàng', status: 'No đủ', d: 'Đôi cánh xương mọc sau lưng, bay lượn 3 chiều tự do trên bầu trời.' }
    ],
    pendingEvent: {
      title: 'Đại Quyết Đấu Diễn Võ Trường: Cự Khai Bi',
      desc: 'Cự Khai Bi mang Long Tượng chi lực thách đấu trên võ đài cột đá. Thắng trận này sẽ đoạt danh hiệu quán quân!',
      action: 'Vào lôi đài'
    },
    locations: [
      { id: 'dien_vo', n: 'Diễn Võ Trường', tag: 'Võ đài', state: 'active', desc: 'Nơi tụ tập ma tu số một Nam Cương, cược mạng đổi cổ trùng.' },
      { id: 'nam_thu', n: 'Nam Thu Uyển', tag: 'Dinh thự', state: 'normal', desc: 'Biệt viện xa hoa ngọc bích, nơi cư ngụ của Hắc Bạch Song Sát.' },
      { id: 'thanh_tam', n: 'Phủ Thương Tâm Từ', tag: 'Đồng minh', state: 'normal', desc: 'Thương Tâm Từ đang điều hành thương vụ, có Tử Kinh Lệnh hộ vệ.' }
    ]
  }
};
