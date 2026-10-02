// UI V2 mock saves — presentation only. Does not mutate game state S.
window.UI_V2_MOCKS = {
  q1_early: {
    id: 'q1_early',
    theme: 'sontrai',
    book: 1,
    chapter: 1,
    chapterName: 'Thanh Mao Sơn',
    title: 'Núi Thanh Mao',
    sub: 'Tháng hai · Thượng tuần',
    mapArt: 'assets/art/bg_village.jpg',
    mapFocus: '48% 42%',
    hero: {
      name: 'Phương Nguyên',
      avatar: 'assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg',
      rankText: 'Nhất chuyển sơ kỳ',
      hp: 100, maxHp: 100,
      ess: 44, maxEss: 50,
      stones: 16, ap: 2, maxAp: 3,
      cicada: 'Ngủ'
    },
    pending: {
      title: 'Thương đội vừa tới chân núi',
      desc: 'Lều bạt Giả gia dựng dưới sườn trúc. Chưa rõ họ buôn gì.',
      action: 'Đến gặp',
      loc: 'chophien'
    },
    locations: [
      { id: 'hocduong', n: 'Học đường', x: 28, y: 58, state: 'selected', tag: 'Đang ở đây', cost: '0 việc', desc: 'Nơi đệ tử tộc nghe giảng và khảo hạch.' },
      { id: 'haoson', n: 'Hậu sơn', x: 52, y: 36, state: 'alert', tag: 'Có dấu lạ', cost: '1 việc', desc: 'Vết hoa văn trên đá, chưa rõ đường vào động.' },
      { id: 'nuirung', n: 'Núi rừng', x: 74, y: 48, state: 'normal', tag: 'Mở', cost: '1 việc', desc: 'Khảo hạch săn heo rừng lấy nanh.' },
      { id: 'chophien', n: 'Chợ thương đội', x: 62, y: 72, state: 'alert', tag: 'Biến cố chờ', cost: '1 việc', desc: 'Thương đội vừa dựng lều. Chi phí đi: 1 việc.' },
      { id: 'hoatuu', n: 'Động Hoa Tửu', x: 40, y: 22, state: 'locked', tag: 'Chưa mở', cost: '—', desc: 'Cần manh mối hậu sơn trước khi vào.' }
    ],
    narrative: {
      layout: 'talk',
      art: 'assets/art/bg_forest.jpg',
      portrait: 'assets/npc/n_gialao.jpg',
      speaker: 'Học đường gia lão',
      lines: [
        'Phương Nguyên. Tư chất Bính đẳng, đáng lẽ nên ẩn nhẫn.',
        'Cớ sao dám chặn cổng học đường thu nguyên thạch của đồng học? Hôm nay không nói rõ, gia quy không tha.'
      ],
      choices: [
        { id: 'a', text: 'Thừa nhận: kẻ yếu nộp thạch cho kẻ mạnh.', meta: 'Cái giá chắc chắn: +16 thạch đã lấy · Hiềm nghi tộc tăng', tone: 'gold' },
        { id: 'b', text: 'Cúi đầu nhận lỗi, nộp lại thạch đổi lấy yên ổn.', meta: 'Cái giá chắc chắn: mất 6 thạch', tone: 'warn' },
        { id: 'c', text: 'Đổ lỗi cho Mộ Nhân Tình đã khích tướng.', meta: 'Thiếu điều kiện: chưa có chứng cứ', locked: true }
      ]
    },
    combat: {
      art: 'assets/art/bg_forest.jpg',
      goal: 'Hạ heo rừng trước khi nó chạy mất nanh',
      intent: 'Heo rừng sắp húc gần · có thể đỡ',
      range: 'gan',
      selfArt: 'assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg',
      foeArt: 'assets/art/p_boar.jpg',
      foeName: 'Heo rừng',
      skills: [
        { id: 'nq', name: 'Nguyệt nhận', cost: 6, cd: 'sẵn', why: '' },
        { id: 'gd', name: 'Đỡ', cost: 0, cd: 'sẵn', why: '' },
        { id: 'xt', name: 'Xuân Thu Thiền', cost: 0, cd: '', why: 'Thiền đang ngủ', locked: true }
      ]
    },
    inventory: [
      { k: 'nguyetquang', n: 'Nguyệt Quang Cổ', r: 1, img: 'assets/gu/g_nguyetquang.jpg', food: 'Cánh hoa nguyệt lan', status: 'No', use: 'Ngưng nguyệt nhận, chiêu chủ lực.', cost: '6 chân nguyên' },
      { k: 'tuutrung', n: 'Tửu Trùng', r: 1, img: 'assets/gu/g_tuutrung.jpg', food: 'Rượu', status: 'Hơi đói', use: 'Tinh luyện chân nguyên khi tu luyện.', cost: 'Không tốn chiêu' },
      { k: 'xuanthu', n: 'Xuân Thu Thiền', r: 6, img: 'assets/gu/g_xuanthu.jpg', food: 'Nước sông Quang Âm', status: 'Tổn thương', use: 'Nghịch chuyển thời gian khi hiến tế.', cost: 'Thân xác và tu vi' }
    ],
    people: [
      { n: 'Gia lão học đường', img: 'assets/npc/n_gialao.jpg', mood: 'Đang giận', last: 'Vừa gọi tên trước cổng học đường.' }
    ],
    karma: [
      { t: 'Chặn cổng thu thạch', d: 'Đã lấy thạch đồng học. Hệ quả với gia quy chưa chốt.' }
    ],
    receipt: {
      title: 'Đã nhận Nguyệt Quang Cổ',
      body: 'Trấn tộc cổ nằm trong không khiếu. Công dụng: ngưng nguyệt nhận. Chưa đổi số thạch trong prototype.'
    }
  },

  q1_mid: {
    id: 'q1_mid',
    theme: 'langtrieu',
    book: 1,
    chapter: 3,
    chapterName: 'Lang triều',
    title: 'Tường trại Thanh Mao',
    sub: 'Tháng bảy · Hạ tuần',
    mapArt: 'assets/art/bg_tide.jpg',
    mapFocus: '50% 38%',
    hero: {
      name: 'Phương Nguyên',
      avatar: 'assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg',
      rankText: 'Nhị chuyển đỉnh phong',
      hp: 175, maxHp: 220,
      ess: 90, maxEss: 100,
      stones: 280, ap: 1, maxAp: 3,
      cicada: 'Cảnh báo'
    },
    pending: {
      title: 'Lôi Quan Lang phá tường Tây',
      desc: 'Thanh Thư đang giữ tuyến. Đây là biến cố có thật trên tường, không phải hạn chót giả.',
      action: 'Lên tường',
      loc: 'dau_tuong'
    },
    locations: [
      { id: 'dau_tuong', n: 'Đầu tường', x: 46, y: 40, state: 'alert', tag: 'Nguy cấp', cost: '1 việc', desc: 'Sói điện tràn. Thanh Thư giữ cửa Tây.' },
      { id: 'duoc_duong', n: 'Dược đường', x: 24, y: 62, state: 'normal', tag: 'Mở', cost: '1 việc', desc: 'Thương binh dồn về. Giá dược tăng.' },
      { id: 'bi_dong', n: 'Huyết hồ', x: 72, y: 58, state: 'normal', tag: 'Kỳ ngộ', cost: '1 việc', desc: 'Đường máu trong núi, chưa lộ tên bí mật.' },
      { id: 'hoatuu', n: 'Động Hoa Tửu', x: 68, y: 28, state: 'selected', tag: 'Có thể vào', cost: '1 việc', desc: 'Tránh loạn tường, đi sâu mổ đá.' }
    ],
    narrative: {
      layout: 'action',
      art: 'assets/art/scene_qingshu_vs_bai.jpg',
      portrait: 'assets/art/p_thanhthu.jpg',
      speaker: 'Cổ Nguyệt Thanh Thư',
      lines: [
        'Phương Nguyên đệ đệ, Lôi Quan Lang sắp phá tường Tây.',
        'Ta dùng Mộc Mị Cổ ngăn. Đệ mau đưa đệ tử trẻ vào sơn động.'
      ],
      choices: [
        { id: 'a', text: 'Cứu viện Thanh Thư, xuất Huyết Nguyệt.', meta: 'Nguy cơ đã biết: tử chiến với vương thú · không hứa phần thưởng', tone: 'warn' },
        { id: 'b', text: 'Quay người, đi sâu Động Hoa Tửu.', meta: 'Nhánh đã biết trong nguyên tác · Tâm cơ', tone: 'gold' }
      ]
    },
    combat: {
      art: 'assets/art/scene_qingshu_vs_bai.jpg',
      goal: 'Giữ tuyến tường 18 giây hoặc hạ sói đầu đàn',
      intent: 'Lôi Quan Lang vận Lôi nha · có thể ngắt nếu đủ gần',
      range: 'trung',
      selfArt: 'assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg',
      foeArt: 'assets/art/p_wolfking.jpg',
      foeName: 'Lôi Quan Lang',
      skills: [
        { id: 'hn', name: 'Huyết nguyệt', cost: 14, cd: 'sẵn', why: '' },
        { id: 'bn', name: 'Bạch ngọc', cost: 6, cd: '1 nhịp', why: '' },
        { id: 'xt', name: 'Xuân Thu Thiền', cost: 0, cd: '', why: 'Chưa tới lúc hiến tế', locked: true }
      ]
    },
    inventory: [
      { k: 'huyetnguyet', n: 'Huyết Nguyệt Cổ', r: 2, img: 'assets/gu/g_huyetnguyet.jpg', food: 'Máu tươi', status: 'No', use: 'Nguyệt nhận đỏ, gây chảy máu.', cost: '14 chân nguyên' },
      { k: 'bachngoc', n: 'Bạch Ngọc Cổ', r: 2, img: 'assets/gu/g_bachngoc.jpg', food: 'Bạch ngọc vụn', status: 'No', use: 'Da hóa ngọc, giảm thương.', cost: '6 chân nguyên' },
      { k: 'cuxikimngo', n: 'Cứ Xỉ Kim Ngô', r: 3, img: 'assets/gu/g_cuxikimngo.jpg', food: 'Thịt và sắt vụn', status: 'No', use: 'Cưa giáp cận chiến.', cost: '20 chân nguyên' },
      { k: 'thienbong', n: 'Thiên Bồng Cổ', r: 3, img: 'assets/gu/g_thienbong.jpg', food: 'Thịt thú rừng', status: 'Đói nhẹ', use: 'Giáp quang minh.', cost: '15 chân nguyên' }
    ],
    people: [
      { n: 'Thanh Thư', img: 'assets/art/p_thanhthu.jpg', mood: 'Tử chiến', last: 'Gọi đệ rút lui vào động.' }
    ],
    karma: [
      { t: 'Lang triều phá trại', d: 'Tường Tây đang vỡ. Việc cứu hay bỏ Thanh Thư chưa chọn.' }
    ],
    receipt: {
      title: 'Tường Tây chưa giữ được',
      body: 'Prototype chỉ cho xem nhịp. Kết quả thật sẽ ghi vào Nhân Quả Lục khi nối engine.'
    }
  },

  q2_thanh: {
    id: 'q2_thanh',
    theme: 'thanh',
    book: 2,
    chapter: 4,
    chapterName: 'Thương gia thành',
    title: 'Thương Gia Thành',
    sub: 'Tháng chín · Trung tuần',
    mapArt: 'assets/art/scene_fy_shangxinci.jpg',
    mapFocus: '55% 35%',
    hero: {
      name: 'Cổ Việt',
      avatar: 'assets/local/art/p_hero_avatar.jpg',
      rankText: 'Tứ chuyển sơ kỳ',
      hp: 420, maxHp: 420,
      ess: 240, maxEss: 280,
      stones: 1350, ap: 3, maxAp: 3,
      cicada: 'Thức'
    },
    pending: {
      title: 'Cự Khai Bi thách đấu cột đá',
      desc: 'Diễn võ trường đã mở. Thắng bại chưa ghi — prototype không phát thưởng.',
      action: 'Vào lôi đài',
      loc: 'dien_vo'
    },
    locations: [
      { id: 'dien_vo', n: 'Diễn võ trường', x: 58, y: 44, state: 'alert', tag: 'Đang chờ', cost: '1 ngày', desc: 'Cột đá, cược mạng đổi cổ.' },
      { id: 'nam_thu', n: 'Nam Thu Uyển', x: 28, y: 60, state: 'selected', tag: 'Đang ở', cost: '0', desc: 'Nơi Hắc Bạch Song Sát ở ẩn.' },
      { id: 'thanh_tam', n: 'Phủ Thương Tâm Từ', x: 76, y: 62, state: 'normal', tag: 'Đồng minh', cost: '1 ngày', desc: 'Thư tín và ấn tín, nhịp cảnh tĩnh.' }
    ],
    narrative: {
      layout: 'talk',
      art: 'assets/art/scene_fy_shangxinci.jpg',
      portrait: 'assets/npc/n_shangxinci.jpg',
      speaker: 'Thương Tâm Từ',
      lines: [
        'Cổ Việt. Trên võ đài cột đá, Long Tượng chi lực không phải lời đùa.',
        'Nếu ngươi lên đài, ta không gỡ cược giúp. Tự tính cái giá.'
      ],
      choices: [
        { id: 'a', text: 'Nhận lời, vào diễn võ trường.', meta: 'Cái giá chắc chắn: một ngày · rủi ro đã biết: thương tổn lực đạo', tone: 'warn' },
        { id: 'b', text: 'Ở lại phủ, soi sổ sách thiếu chủ.', meta: 'Không tốn ngày võ đài', tone: 'jade' }
      ]
    },
    combat: {
      art: 'assets/art/bg_fire.jpg',
      goal: 'Không bị Long Tượng húc khỏi đài',
      intent: 'Cự Khai Bi dồn lực đấm cột · trọng kích cận',
      range: 'gan',
      selfArt: 'assets/local/art/p_hero_avatar.jpg',
      foeArt: 'assets/art/p_bear.jpg',
      foeName: 'Cự Khai Bi',
      skills: [
        { id: 'tl', name: 'Toàn lực', cost: 0, cd: 'nội tại', why: '' },
        { id: 'kl', name: 'Khổ lực', cost: 0, cd: 'nội tại', why: '' },
        { id: 'khl', name: 'Khí lực', cost: 18, cd: 'sẵn', why: '' }
      ]
    },
    inventory: [
      { k: 'toanluc', n: 'Toàn Lực Dĩ Phó Cổ', r: 3, img: 'assets/gu/g_thienbong.jpg', food: 'Thịt thú', status: 'No', use: 'Phát hết thú lực hư ảnh.', cost: 'Không tốn chiêu' },
      { k: 'thiennguyen', n: 'Thiên Nguyên Bảo Liên', r: 3, img: 'assets/gu/g_thiennguyenbaolien.jpg', food: 'Tự dưỡng', status: 'Viên mãn', use: 'Mỗi ngày sinh thạch.', cost: 'Không tốn chiêu' },
      { k: 'xuanthu', n: 'Xuân Thu Thiền', r: 6, img: 'assets/gu/g_xuanthu.jpg', food: 'Nước sông Quang Âm', status: 'Ổn', use: 'Nghịch quang âm.', cost: 'Hiến tế' }
    ],
    people: [
      { n: 'Thương Tâm Từ', img: 'assets/npc/n_shangxinci.jpg', mood: 'Tĩnh, tính sổ', last: 'Không gỡ cược giúp trên đài.' }
    ],
    karma: [
      { t: 'Lập danh trong thành', d: 'Thân phận Cổ Việt đã đứng. Quyết đấu cột đá còn bỏ ngỏ.' }
    ],
    receipt: {
      title: 'Ấn lệnh diễn võ còn trên bàn',
      body: 'Chưa vào trận thật. Đọc lại được trong Nhân quả.'
    }
  }
};
