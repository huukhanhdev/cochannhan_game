// tools/story_test.cjs - Kiểm tra tính toàn vẹn của State Story & Save Migration (PR-01)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const noop = () => {};
const ctx = {
  console, Math, JSON, Date,
  setTimeout: noop, clearTimeout: noop,
  localStorage: { getItem: () => null, setItem: noop },
  document: { getElementById: () => null, addEventListener: noop },
  window: {}
};
ctx.window = ctx;
vm.createContext(ctx);

// Load các script cần thiết
['data.js', 'story.js'].forEach(f => {
  const code = fs.readFileSync(path.join(root, 'js', f), 'utf8');
  vm.runInContext(code, ctx, { filename: f });
});

let failed = 0;
function assert(desc, condition) {
  if (condition) {
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
    failed++;
  }
}

console.log('--- KIỂM TRA STATE STORY & MIGRATION (PR-01) ---');

// Test 1: Khởi tạo state mới
ctx.S = { v: 2, turn: 1, stones: 0 };
ctx.initStoryState(ctx.S);
assert('S.story được khởi tạo đầy đủ các trường', 
  ctx.S.story && 
  ctx.S.story.version === 2 &&
  typeof ctx.S.story.outcomes === 'object' &&
  Array.isArray(ctx.S.story.pending) &&
  typeof ctx.S.story.applied === 'object' &&
  Array.isArray(ctx.S.story.journal)
);

// Test 2: Migration từ save cũ v2 không có story
const oldSave = { v: 2, turn: 10, stones: 100, hp: 80 };
ctx.initStoryState(oldSave);
assert('Save cũ v2 được migrate bổ sung S.story không mất dữ liệu', 
  oldSave.story && oldSave.stones === 100 && oldSave.story.version === 2
);

// Test 3: Ghi nhận quyết định & Anti-duplicate payload
let payloadRunCount = 0;
const outcomeResult = ctx.storySetOutcome('kimsinh', 'kill', (s) => {
  payloadRunCount++;
  s.stones += 35;
});
assert('storySetOutcome trả về outcome đúng', ctx.storyGetOutcome('kimsinh') === 'kill');
assert('storyHasOutcome xác nhận đúng', ctx.storyHasOutcome('kimsinh', 'kill') === true);
assert('Payload thưởng chạy lần 1 (+35 thạch)', ctx.S.stones === 35 && payloadRunCount === 1);

// Chạy lại outcome cùng giá trị: không được lặp lại payload thưởng
ctx.storySetOutcome('kimsinh', 'kill', (s) => {
  payloadRunCount++;
  s.stones += 35;
});
assert('Anti-duplicate: không lặp lại phần thưởng khi gọi trùng outcome', ctx.S.stones === 35 && payloadRunCount === 1);

// Metadata lựa chọn phải được lưu cùng drift, và cũng chỉ áp dụng một lần.
ctx.driftAdd = (n) => { ctx.S.drift = (ctx.S.drift || 0) + n; };
ctx.storySetOutcome('nga_re', 'refuse', {
  choiceText: 'Từ chối thiên mệnh', isLech: true, driftAmount: 9, note: 'Thiên ý bắt đầu chú ý.'
});
ctx.storySetOutcome('nga_re', 'refuse', {
  choiceText: 'Từ chối thiên mệnh', isLech: true, driftAmount: 9
});
const lechEntry = ctx.S.story.journal.find(j => j.chainId === 'nga_re');
assert('Outcome object lưu đủ lựa chọn, ghi chú và cờ dị số', lechEntry && lechEntry.choiceText === 'Từ chối thiên mệnh' && lechEntry.note === 'Thiên ý bắt đầu chú ý.' && lechEntry.isLech === true);
assert('Drift của outcome dị số chỉ cộng đúng một lần', ctx.S.drift === 9);

// Test 4: Lên lịch Pending Event và quét kích hoạt đúng lượt
const scheduled = ctx.storySchedulePending({
  id: 'pend_kimsinh_investigate',
  chainId: 'kimsinh',
  targetBook: 1,
  minTurn: 5,
  maxTurn: 8,
  eventId: 'c_dieutra'
});
assert('Lên lịch pending event thành công', scheduled === true);

// Lên lịch trùng ID: phải bị từ chối
const duplicateSchedule = ctx.storySchedulePending({
  id: 'pend_kimsinh_investigate'
});
assert('Từ chối lên lịch pending trùng ID', duplicateSchedule === false);

// Quét tại lượt 3 (chưa tới hạn): không kích hoạt
let ready = ctx.storyCheckPending(1, 1, 3);
assert('Chưa tới minTurn: không kích hoạt', ready.length === 0);

// Quét tại lượt 5 (đến hạn): kích hoạt đúng event
ready = ctx.storyCheckPending(1, 1, 5);
assert('Đúng minTurn: kích hoạt pending event', ready.length === 1 && ready[0].eventId === 'c_dieutra');

// Quét lại tại lượt 6: không còn event đó (đã bị lấy ra)
ready = ctx.storyCheckPending(1, 1, 6);
assert('Pending event đã lấy ra thì không bị kích hoạt lại', ready.length === 0);

// Pending xuyên chương không được hết hạn khi vẫn còn ở chương nguồn.
ctx.storySchedulePending({
  id: 'pend_tukinh_vao_thanh', targetBook: 2, targetChap: 'q2_thanh',
  minTurn: 1, maxTurn: 2, eventId: 'q2_tt_tukinhvao'
});
ready = ctx.storyCheckPending(2, 'q2_thuongdoi', 8);
assert('Pending xuyên chương được giữ nguyên khi chưa tới chương đích', ready.length === 0 && ctx.S.story.pending.some(p => p.id === 'pend_tukinh_vao_thanh'));
ready = ctx.storyCheckPending(2, 'q2_thanh', 1);
assert('Pending xuyên chương kích hoạt trong cửa sổ của chương đích', ready.length === 1 && ready[0].eventId === 'q2_tt_tukinhvao');

// Test 5: Journal nhân quả
const journalBefore = ctx.S.story.journal.length;
ctx.storyAddJournal('Chém đầu Cổ Kim Sinh trong khe đá', 'decision', 'kimsinh');
const journalLast = ctx.S.story.journal[ctx.S.story.journal.length - 1];
assert('Journal ghi nhận entry chính xác', ctx.S.story.journal.length === journalBefore + 1 && journalLast.tag === 'kimsinh' && journalLast.choiceText.includes('Cổ Kim Sinh'));

// Test 6: Xuân Thu Thiền reset timeline
ctx.storySchedulePending({ id: 'temp_event', minTurn: 10, maxTurn: 20 });
ctx.storyResetTimeline(false);
assert('Xuân Thu Thiền xóa sạch pending của timeline cũ', ctx.S.story.pending.length === 0);
assert('Xuân Thu Thiền ghi nhật ký cảnh báo', ctx.S.story.journal.some(j => j.tag === 'xuanthu'));

console.log('--- KIỂM TRA NÂNG CẤP UI/UX & JOURNAL (PR-03) ---');
// Mock thêm môi trường UI
const modalContainer = { innerHTML: '' };
ctx.$ = (id) => (id === 'modalContainer' ? modalContainer : { innerHTML: '' });
ctx.foodCost = () => 12;
ctx.esc = (t) => String(t || '');
ctx.CANON = { 5: 'c_khaohach' };
ctx.EV = { c_khaohach: { title: 'Khảo hạch săn lợn', hint: 'Khảo hạch' } };
const uiCode = fs.readFileSync(path.join(root, 'js', 'ui.js'), 'utf8');
vm.runInContext(uiCode, ctx, { filename: 'ui.js' });

// Test 7: HUD forecast
const fcHtml = ctx.hudForecastHTML();
assert('hudForecastHTML trả về chuỗi HTML dự báo', typeof fcHtml === 'string' && fcHtml.includes('hud-forecast'));

// Test 8: choiceExtraMeta
const metaWithCost = ctx.choiceExtraMeta({ cost: { stones: 15, hp: 10 }, risk: 'high' }, true);
assert('choiceExtraMeta hiển thị chi phí và nguy cơ', metaWithCost.includes('−15 thạch') && metaWithCost.includes('Hiểm nguy cao'));

const metaWithLock = ctx.choiceExtraMeta({ reqT: 'Cần Nhị chuyển' }, false);
assert('choiceExtraMeta hiển thị ổ khóa điều kiện', metaWithLock.includes('🔒 Cần Nhị chuyển'));

// Test 9: renderJournalModal
ctx.renderJournalModal();
assert('renderJournalModal render giao diện vào modalContainer', modalContainer.innerHTML.includes('Nhân Quả Lục'));
assert('Journal UI không rò chuỗi undefined từ schema cũ', !modalContainer.innerHTML.includes('undefined'));

console.log('--- KIỂM TRA TUYẾN MẪU CỔ KIM SINH & ĐIỀU TRA (PR-04) ---');
// Nạp thêm events.js
ctx.MEM = {}; ctx.NPC = { toctruong: { n: 'Cổ Nguyệt Bác' }, giaphu: { n: 'Cổ Phú' }, kimsinh: { n: 'Cổ Kim Sinh' }, tiexueleng: { n: 'Thiết Huyết Lãnh' }, nhuocnam: { n: 'Thiết Nhược Nam' } };
ctx.rel = () => {}; ctx.meet = () => {}; ctx.learn = () => {}; ctx.maxHp = () => 100; ctx.maxEss = () => 100;
ctx.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
ctx.later = () => {}; ctx.rollShop = () => {}; ctx.gainGu = () => {}; ctx.loseGuQ1 = () => {}; ctx.hasGu = () => false;
ctx.W = () => false; ctx.log = () => {}; ctx.mem = () => false; ctx.varShifted = () => false; ctx.fight = () => {};

const eventsCode = fs.readFileSync(path.join(root, 'js', 'events.js'), 'utf8');
vm.runInContext(eventsCode + '\n;this.EV = EV; this.jksSet = jksSet; this.AFTER = AFTER;', ctx, { filename: 'events.js' });

// Test 10: Nhánh Canon (Ám sát khe đá)
ctx.S = { v: 2, turn: 11, stones: 50, f: {}, susp: 0, danh: 10 };
ctx.initStoryState(ctx.S);
ctx.jksSet('dead');
assert('Nhánh Canon: outcome được lưu là canon_killed', ctx.storyHasOutcome('kimsinh', 'canon_killed'));
assert('Nhánh Canon: cờ killedJKS được bật', ctx.S.f.killedJKS === 1);

// Test 11: Nhánh Vạch trần
ctx.S = { v: 2, turn: 11, stones: 50, f: {}, susp: 0, danh: 10 };
ctx.initStoryState(ctx.S);
ctx.jksSet('reported');
assert('Nhánh Vạch trần: outcome được lưu là vach_tran', ctx.storyHasOutcome('kimsinh', 'vach_tran'));
const chsDieutraVachTran = ctx.EV.c_dieutra.scene.nodes.nghisu.choices();
assert('Nhánh Vạch trần: c_dieutra có lựa chọn nhận tạ lễ từ Cổ Phú', chsDieutraVachTran.some(c => c.t.includes('nhận tạ lễ')));

// Test 12: Nhánh Rút lui
ctx.S = { v: 2, turn: 11, stones: 50, f: {}, susp: 0, danh: 10 };
ctx.initStoryState(ctx.S);
ctx.jksSet('ignored');
assert('Nhánh Rút lui: outcome được lưu là rut_lui', ctx.storyHasOutcome('kimsinh', 'rut_lui'));
const chsDieutraRutLui = ctx.EV.c_dieutra.scene.nodes.nghisu.choices();
assert('Nhánh Rút lui: c_dieutra có lựa chọn yên bình tu luyện', chsDieutraRutLui.some(c => c.t.includes('tĩnh tâm tu luyện')));
const chsThietRutLui = ctx.EV.c_thiet.scene.nodes.than_bo.choices();
assert('Nhánh Rút lui: c_thiet cho phép thản nhiên ngoài cuộc', chsThietRutLui.some(c => c.t.includes('ngoài cuộc')));

console.log('--- KIỂM TRA THƯƠNG ĐỘI & THƯƠNG GIA THÀNH (PR-06) ---');
// Nạp thêm ch3_thuongdoi.js và ch4_thanh.js
ctx.CHAPTERS = {}; ctx.Q2_SHOP = {}; ctx.GU = { hungluc: { p: 100 } };
ctx.ART = {}; ctx.EAI = {}; ctx.PORTRAIT = {}; ctx.DROP_POOL = {}; ctx.DEATH_MEM = {};
ctx.baiLesson = () => {}; ctx.pick = (arr) => arr[0]; ctx.chance = () => 100;
ctx.rand = (a, b) => Math.floor(a + (b - a) / 2);
ctx.guPrice = function(k){
  let mult = (ctx.W('dichco') ? 0.8 : 1);
  if(ctx.S && ctx.S.f && ctx.S.f.tuKinhLenh) mult *= 0.8;
  return Math.round(ctx.GU[k].p * mult);
};
const tdCode = fs.readFileSync(path.join(root, 'js', 'q2', 'ch3_thuongdoi.js'), 'utf8');
const thanhCode = fs.readFileSync(path.join(root, 'js', 'q2', 'ch4_thanh.js'), 'utf8');
vm.runInContext(tdCode + '\n;this.tradeRun = tradeRun;\n' + thanhCode, ctx, { filename: 'q2_trade.js' });

// Test 13: tradeRun tính đúng hiệu quả hàng hóa
ctx.S = { v: 2, f: { tradeGoods: ['than', 'duoclieu'] }, stones: 50, rel: {} };
ctx.initStoryState(ctx.S);
ctx.tradeRun();
assert('tradeRun tính đúng hiệu quả hàng hóa (tiền lời > 50)', ctx.S.stones > 50);

// Test 14: Tử Kinh Lệnh tại Thương gia thành
ctx.S = { v: 2, f: { tuKinhLenh: 1 }, stones: 0 };
ctx.initStoryState(ctx.S);
ctx.CHAPTERS.q2_thanh.start();
assert('Bắt đầu Q2 ch4 có Tử Kinh Lệnh được nhận 500 thạch (200 gốc + 300 lệnh bài)', ctx.S.stones === 500);
assert('Ghi nhận outcome tu_kinh_lenh_applied', ctx.storyHasOutcome('tu_kinh_lenh_applied', 'nam_thu_uyen'));

// Test 15: Giảm giá 20% khi có Tử Kinh Lệnh
const basePrice = ctx.guPrice('hungluc');
assert('guPrice giảm 20% khi có tuKinhLenh (100 -> 80)', basePrice === 80);

console.log('--- KIỂM TRA Q1 GIAI ĐOẠN ĐẦU (PR-07a: CHƯƠNG 1 - 64) ---');

// Test 16: Khai khiếu Bính đẳng 44%
ctx.S = { v: 2, turn: 1, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_khaikhieu.scene.nodes.nhan_lanh.eff();
assert('Khai khiếu: Lãnh đạm ẩn nhẫn ghi nhận outcome canon_nhanlanh', ctx.storyHasOutcome('khaikhieu', 'canon_nhanlanh'));

// Test 17: Đòi lại di sản cha mẹ (tửu lâu + Cửu Diệp Sinh Cơ Thảo)
let gainedGu = [];
ctx.gainGu = (k) => { gainedGu.push(k); };
ctx.S = { v: 2, turn: 3, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_giasan.scene.nodes.doi_thanhcong.eff();
assert('Đòi di sản: Nhận tửu lâu mức 2', ctx.S.f.tuulau === 2);
assert('Đòi di sản: Nhận Cửu Diệp Sinh Cơ Thảo', gainedGu.includes('cuudiep'));
assert('Đòi di sản: Ghi nhận outcome full_reclaim', ctx.storyHasOutcome('giasan', 'full_reclaim'));

// Test 18: Chặn cổng cướp bóc học đường
ctx.S = { v: 2, turn: 4, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_conghocduong.scene.nodes.cuop_thang.eff();
assert('Chặn cổng: Cướp 16 nguyên thạch đồng học', ctx.S.stones === 16);
assert('Chặn cổng: Ghi nhận outcome canon_rob', ctx.storyHasOutcome('conghocduong', 'canon_rob'));

// Test 19: Bẫy Tửu Trùng bằng rượu Thanh Trúc & Xuân Thu Thiền
gainedGu = [];
ctx.S = { v: 2, turn: 5, stones: 10, prog: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.hs_khe.choices()[0].eff();
assert('Động Hoa Tửu: Bắt Tửu Trùng bằng uy áp Xuân Thu Thiền', gainedGu.includes('tuutrung'));
assert('Động Hoa Tửu: Tinh luyện chân nguyên Thanh Đồng (prog +30)', ctx.S.prog === 30);
assert('Động Hoa Tửu: Ghi nhận outcome captured_cicada', ctx.storyHasOutcome('tuutrung', 'captured_cicada'));

// Test 20: Khảo hạch săn lợn rừng đoạt giải nhất
gainedGu = [];
ctx.S = { v: 2, turn: 6, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_khaohach.scene.nodes.bachthi_ok.eff();
assert('Khảo hạch: Đoạt Bạch Thỉ Cổ (1 trư chi lực)', gainedGu.includes('bachthi'));
assert('Khảo hạch: Ghi nhận outcome first_boar', ctx.storyHasOutcome('khaohach', 'first_boar'));

// Test 21: Phường đổ thạch mở ra Lại Thổ Cáp Mô & Tửu Trùng thứ 2
gainedGu = [];
ctx.S = { v: 2, turn: 7, stones: 50, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_dothach.scene.nodes.mo_da_canon.eff();
assert('Đổ thạch: Mở ra Lại Thổ Cáp Mô', gainedGu.includes('laitho'));
assert('Đổ thạch: Cất giữ Tửu Trùng thứ hai', ctx.S.f.secondWineWorm === 1);
assert('Đổ thạch: Ghi nhận outcome canon_keep', ctx.storyHasOutcome('dothach', 'canon_keep'));

// Test 22: Tống tiền Gia lão Xích Luyện vụ Thủy Khiếu Cổ
ctx.S = { v: 2, turn: 9, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_xichluyen.scene.nodes.tong_tien.eff();
assert('Tống tiền Xích Luyện: Nhận chu cấp 10 thạch/tuần', ctx.S.f.xichLuyenStones === 10);
assert('Tống tiền Xích Luyện: Ghi nhận outcome extorted', ctx.storyHasOutcome('xichluyen_blackmail', 'extorted'));

console.log('--- KIỂM TRA Q1 GIAI ĐOẠN GIỮA (PR-07b: CHƯƠNG 65 - 150) ---');

// Test 23: Bán tửu lâu mua Hắc Thỉ Cổ (Song Trư chi lực)
gainedGu = [];
ctx.S = { v: 2, turn: 10, stones: 0, f: { tuulau: 2 }, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.k_tr_banlai.scene.nodes.hacthi.eff();
assert('Bán tửu lâu: Nhận Hắc Thỉ Cổ', gainedGu.includes('hacthi'));
assert('Bán tửu lâu: Ghi nhận outcome bought_hacthi', ctx.storyHasOutcome('ban_tuulau', 'bought_hacthi'));

// Test 24: Hợp luyện Bạch Ngọc Cổ
gainedGu = [];
ctx.hasGu = (k) => ['ngocbi', 'bachthi'].includes(k);
ctx.S = { v: 2, turn: 11, stones: 100, f: {}, susp: 0, danh: 0, tamco: 0, rel: {}, gu: [{k:'ngocbi'}, {k:'bachthi'}] };
ctx.initStoryState(ctx.S);
ctx.EV.c_bachngoc.choices()[0].eff();
assert('Bạch Ngọc Cổ: Hợp luyện thành công', gainedGu.includes('bachngoc'));
assert('Bạch Ngọc Cổ: Ghi nhận outcome refined', ctx.storyHasOutcome('bachngoc', 'refined'));

// Test 25: Thôn Giang Thiềm Cổ & Tứ Vị Tửu Trùng
gainedGu = [];
ctx.hasGu = (k) => k === 'tuutrung';
ctx.S = { v: 2, turn: 13, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {}, gu: [{k:'tuutrung'}] };
ctx.initStoryState(ctx.S);
ctx.EV.k_nui_thongiang.scene.nodes.ru_ngu_ok.eff();
assert('Thôn Giang Thiềm: Thu nhận 80 nguyên thạch', ctx.S.stones === 80);
assert('Thôn Giang Thiềm: Hợp luyện Tứ Vị Tửu Trùng', gainedGu.includes('tuvi'));
assert('Thôn Giang Thiềm: Ghi nhận outcome tuvi_refined', ctx.storyHasOutcome('tuvi_refined', 'refined'));

// Test 26: Lang triều Thanh Thư hi sinh & cướp Xích Thiết Xá Lợi Cổ lên Nhị chuyển đỉnh phong
gainedGu = [];
ctx.hasGu = () => false;
ctx.S = { v: 2, turn: 20, chuyen: 2, giai: 1, stones: 0, f: {}, susp: 0, danh: 0, tamco: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_lang2.scene.nodes.cho_thoi.eff();
assert('Lang triều: Nhận Thạch Khiếu Cổ', gainedGu.includes('thachkhieu'));
assert('Lang triều: Nhận Xích Thiết Xá Lợi Cổ', gainedGu.includes('xaloi2'));
assert('Lang triều: Đột phá lên Nhị chuyển đỉnh phong (giai = 3)', ctx.S.giai === 3);
assert('Lang triều: Ghi nhận outcome langtrieu_qingshu', ctx.storyHasOutcome('langtrieu_qingshu', 'qingshu_fallen'));
assert('Lang triều: Ghi nhận outcome xaloi_breakthrough', ctx.storyHasOutcome('xaloi_breakthrough', 'rank2_peak'));

console.log('--- KIỂM TRA Q1 HỒI KẾT & BÀN GIAO QUYỂN 2 (PR-07c: CHƯƠNG 151 - 206) ---');

ctx.thachKhieuClash = () => {};
ctx.finalMod = () => 1;
ctx.realmSnap = () => {};
ctx.saveAll = () => {};
ctx.AFTER.end_tienly = () => {};

// Test 27: Nhân Thú Táng Sinh Cổ đột phá Tam chuyển sơ kỳ
gainedGu = [];
ctx.S = { v: 2, turn: 21, chuyen: 2, giai: 3, stones: 0, f: {}, susp: 0, satphat: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_nhanthu.choices()[0].ok();
assert('Nhân Thú Táng Sinh: Đột phá lên Tam chuyển sơ kỳ', ctx.S.chuyen === 3 && ctx.S.giai === 0);
assert('Nhân Thú Táng Sinh: Nhận Nhân Thú Táng Sinh Cổ', gainedGu.includes('nhanthutangsinh'));
assert('Nhân Thú Táng Sinh: Ghi nhận outcome nhanthu_refined', ctx.storyHasOutcome('duocnhac', 'nhanthu_refined'));

// Test 28: Lén nuôi Thiên Nguyên Bảo Liên dưới nguyên tuyền
ctx.S = { v: 2, turn: 22, stones: 100, f: {}, susp: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_baolien.choices()[0].eff();
assert('Bảo Liên: Đặt cờ baolien', ctx.S.f.baolien === 1);
assert('Bảo Liên: Ghi nhận outcome nurture_lotus', ctx.storyHasOutcome('baolien', 'nurture_lotus'));

// Test 29: Thu phục Cự Xỉ Kim Ngô bằng Địa Thính
gainedGu = [];
ctx.hasGu = (k) => k === 'diathinh';
ctx.S = { v: 2, turn: 23, chuyen: 3, stones: 0, f: {}, susp: 0, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_kimngo.choices()[0].ok();
assert('Kim Ngô: Nhận Cự Xỉ Kim Ngô', gainedGu.includes('cuxikimngo'));
assert('Kim Ngô: Ghi nhận outcome captured_diathinh', ctx.storyHasOutcome('kimngo', 'captured_diathinh'));

// Test 30: Mượn kho gia tộc hợp luyện Thiên Bồng Cổ
gainedGu = [];
ctx.hasGu = (k) => k === 'bachngoc';
ctx.S = { v: 2, turn: 24, stones: 0, f: {}, susp: 0, danh: 10, rel: {}, gu: [{k:'bachngoc'}] };
ctx.initStoryState(ctx.S);
ctx.EV.c_muon.choices()[0].eff();
assert('Mượn kho: Nhận Thiên Bồng Cổ', gainedGu.includes('thienbong'));
assert('Mượn kho: Ghi nhận outcome thienbong_borrowed', ctx.storyHasOutcome('muon_kho', 'thienbong_borrowed'));

// Test 31: Nhất Đại thức tỉnh, thần bổ đồng quy vu tận
ctx.S = { v: 2, turn: 26, stones: 0, f: { tieHunt: 1 }, susp: 50, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_nhatdai.scene.nodes.huyet_cuong.choices()[1].eff();
assert('Nhất Đại: Thần bổ Thiết Huyết Lãnh tử trận (dead_nd)', ctx.S.f.tieFate === 'dead_nd');
assert('Nhất Đại: Ghi nhận outcome canon_tie_nd_fall', ctx.storyHasOutcome('nhatdai', 'canon_tie_nd_fall'));

// Test 32: Băng phong Thanh Mao Sơn: Xuân Thu Thiền lần 2, Âm Cổ cứu BNB, Huyết Lô thăng Giáp đẳng 90%
gainedGu = [];
ctx.hasGu = () => false;
ctx.S = { v: 2, turn: 27, stones: 0, f: {}, susp: 0, rel: {}, tuchat: 44 };
ctx.initStoryState(ctx.S);
ctx.EV.c_final.scene.nodes.thien_c.eff();
assert('Băng phong: Nhận Huyết Lô Cổ & Âm Dương Cổ', gainedGu.includes('huyetlo') && gainedGu.includes('amduong'));
assert('Băng phong: Tư chất nâng lên Giáp đẳng 90%', ctx.S.tuchat === 90);
assert('Băng phong: Ghi nhận outcome cicada_rewind2', ctx.storyHasOutcome('final_rewind', 'cicada_rewind2'));

// Test 33: Cưỡi Thiên Lý Địa Lang Chu trốn thoát sang Quyển 2
gainedGu = [];
ctx.S = { v: 2, turn: 28, stones: 0, f: {}, rel: {} };
ctx.initStoryState(ctx.S);
ctx.EV.c_tienly.choices()[0].eff();
assert('Thiên Lý Địa Lang: Nhận Thiên Lý Địa Lang Chu Ngũ chuyển', gainedGu.includes('tienlydilang'));
assert('Thiên Lý Địa Lang: Ghi nhận outcome escaped_spider', ctx.storyHasOutcome('tienly', 'escaped_spider'));

// Test 34: Kế thừa State Story từ Q1 sang Q2 (startQ2)
const q2CoreCode = fs.readFileSync(path.join(root, 'js', 'q2', 'core.js'), 'utf8');
ctx.AP_WEEK = 3;
ctx.META = { wins: [], chapSave: {} };
ctx.discoverGu = () => {};
ctx.enterChapter = () => {};
vm.runInContext(q2CoreCode, ctx, { filename: 'q2_core.js' });

const oldQ1 = {
  v: 2, book: 1, over: 'win', tuchat: 90, stones: 50,
  gu: [{k:'xuanthu'}, {k:'tuvi'}, {k:'thiennguyen'}, {k:'dausuat'}, {k:'thienbong'}, {k:'cuxikimngo'}, {k:'amduong'}],
  story: {
    version: 1,
    outcomes: { duocnhac: 'nhanthu_refined', kimngo: 'captured_diathinh', muon_kho: 'thienbong_borrowed' },
    pending: [{ id: 'old_pending', targetBook: 2, targetChap: 'q2_thanh', minTurn: 1, maxTurn: 2, eventId: 'q2_tt_tukinhvao', status: 'pending' }],
    applied: { 'duocnhac:nhanthu_refined': true },
    journal: [{ text: 'Chiến tích Q1' }]
  },
  log: ['Q1 end']
};
ctx.S = oldQ1;
ctx.startQ2('huyetlo_bai');
assert('Chuyển sang Q2: S.book === 2', ctx.S.book === 2);
assert('Chuyển sang Q2: Mang theo đúng Tứ Vị Tửu Trùng (tuvi)', ctx.S.gu.some(g => g.k === 'tuvi'));
assert('Chuyển sang Q2: Mang theo Dương Cổ (duongco) do đã dùng Âm Cổ lên BNB', ctx.S.gu.some(g => g.k === 'duongco'));
assert('Chuyển sang Q2: S.story được kế thừa từ Q1', ctx.S.story && ctx.S.story.outcomes.duocnhac === 'nhanthu_refined');
assert('Chuyển sang Q2: pending nhắm chương sau được giữ để trả nhân quả', ctx.S.story.pending.some(p => p.id === 'old_pending'));
assert('Chuyển sang Q2: S.story.journal lưu giữ các chiến tích hào hùng từ Q1', ctx.S.story.journal.length > 0);

// Nạp các module Q2 cho PR-08
['data2.js', 'luc.js', 'truyenthua.js', 'ch1_hoanglong.js', 'ch2_bachcot.js', 'ch5_thieuchu.js'].forEach(f => {
  const code = fs.readFileSync(path.join(root, 'js', 'q2', f), 'utf8');
  vm.runInContext(code, ctx, { filename: f });
});

ctx.meet = (k) => { ctx.S.met = ctx.S.met || {}; ctx.S.met[k] = 1; };
ctx.rel = (k, v) => { ctx.S.rel = ctx.S.rel || {}; ctx.S.rel[k] = (ctx.S.rel[k] || 0) + v; };
ctx.baiRel = (v) => ctx.rel('bainu', v);
ctx.gainGu = (k) => { ctx.S.gu = ctx.S.gu || []; ctx.S.gu.push({k}); };
ctx.loseGu = (k) => { if(ctx.S.gu) ctx.S.gu = ctx.S.gu.filter(g => g.k !== k); };
ctx.hasGu = (k) => ctx.S.gu && ctx.S.gu.some(g => g.k === k);
ctx.fight = (e, opt) => {};
ctx.learn = (k) => {};
ctx.mem = (k) => false;
ctx.chapEnd = (k) => {};
ctx.later = (id, a, b) => {};
ctx.log = () => {};
ctx.pick = (arr) => arr[0];
ctx.dvRank = () => 1;
ctx.dvZone = () => 'tây';
ctx.maxHp = () => 100;
ctx.maxEss = () => 100;
ctx.levelUp = () => {};

console.log('--- KIỂM TRA QUYỂN 2 ĐẦU & GIỮA: PR-08 ---');

// Test 35: 08.1 Hoàng Long Giang
ctx.S = { v: 2, turn: 1, stones: 50, f: {}, rel: {}, gu: [] };
ctx.initStoryState(ctx.S);
ctx.AFTER.q2_casau();
assert('Hoàng Long: Thu hoạch thịt cá sấu bạch hoa (crocodile_slain)', ctx.storyHasOutcome('hoanglong_crocodile', 'crocodile_slain'));

ctx.EV.q2_hl_codoi.choices()[0].eff();
assert('Hoàng Long: Cố thủ bảo tồn cốt lõi không kích động (preserve_core)', ctx.storyHasOutcome('hl_starve', 'preserve_core'));

ctx.AFTER.q2_thuyhoa();
assert('Hoàng Long: Tiêu diệt Thủy Ma Hỏa Ma Trương Trụ (thuyhoa_eliminated)', ctx.storyHasOutcome('thuyhoa', 'thuyhoa_eliminated'));

// Test 36: 08.2 Bạch Cốt Sơn
ctx.S = { v: 2, turn: 7, stones: 50, f: { bachSinh: 1 }, rel: {}, gu: [] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_bc_thietgia.choices()[0].eff();
assert('Bạch Cốt Sơn: Nổ mìn địa lôi sát Tiết Ngạo Thiên (slain_by_mine)', ctx.storyHasOutcome('tiep_ngao_thien', 'slain_by_mine'));

ctx.EV.q2_bc_suho.choices()[0].eff();
assert('Bạch Cốt Sơn: Nghịch luyện Cốt Nhục Đoàn Viên (refined_with_twins)', ctx.storyHasOutcome('cotnhuc', 'refined_with_twins'));

ctx.EV.q2_bc_tron.choices()[0].eff();
assert('Bạch Cốt Sơn: Thoát vây bằng Vô Túc Điểu (escape_votucdieu)', ctx.storyHasOutcome('escape_bachcot', 'escape_votucdieu'));

// Test 37: 08.3 & 08.4 Thương Đội
ctx.S = { v: 2, turn: 13, stones: 200, f: {}, rel: {}, gu: [{k:'cotthuong'}] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_td_kimgia.choices()[0].ok();
assert('Thương Đội: Thu lợi thảo dược Kim Gia (kim_herb_profit)', ctx.storyHasOutcome('td_kimgia', 'kim_herb_profit'));

ctx.EV.q2_td_phituong.choices()[0].eff();
assert('Thương Đội: Ám sát Trương Trụ mượn đao cướp hàng (assassinated_canon)', ctx.storyHasOutcome('truong_tru', 'assassinated_canon'));

ctx.EV.q2_td_cuongthi.choices()[0].ok();
assert('Thương Đội: Lừa chém Đinh Hạo nhổ cỏ tận gốc (tricked_and_slain)', ctx.storyHasOutcome('dinh_hao', 'tricked_and_slain'));

// Test 38: 08.5 Thương Gia Thành & Lực Đạo
ctx.S = { v: 2, turn: 19, stones: 1000, f: { lynhienNam: 1 }, rel: {}, gu: [] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_tt_dienvo.choices()[0].eff();
assert('Thương Gia Thành: Sở hữu Toàn Lực Dĩ Phó Cổ (acquired_canon)', ctx.storyHasOutcome('toan_luc_ung_pho', 'acquired_canon'));

ctx.EV.q2_tt_bachgia.choices()[0].ok();
assert('Thương Gia Thành: Tống tiền Bách gia 300 vạn (extorted_300w)', ctx.storyHasOutcome('bach_blackmail', 'extorted_300w'));

ctx.EV.q2_tt_nhaiti2.choices()[0].eff();
assert('Thương Gia Thành: Phục hưng Lực Đạo hạ Nhai Tí (trinity_assembled)', ctx.storyHasOutcome('lucdao_trinity', 'trinity_assembled'));

ctx.AFTER.q2_tt_cukhai();
assert('Thương Gia Thành: Đánh bại Cự Khai Bi (defeated_canon)', ctx.storyHasOutcome('cu_khai_bi', 'defeated_canon'));

// Test 39: 08.6 Thiếu Chủ & Đột phá Tứ chuyển
ctx.S = { v: 2, turn: 25, chuyen: 3, giai: 3, stones: 1000, f: {}, rel: {}, gu: [] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_tc_phe.choices()[0].eff();
assert('Thiếu Chủ: Định hướng Thương Tâm Từ tự lập (enthroned_canon)', ctx.storyHasOutcome('tamtu_young_master', 'enthroned_canon'));

ctx.EV.q2_tc_ket.choices()[0].eff();
assert('Thiếu Chủ: Đột phá Tứ chuyển sơ kỳ (rank4_initial)', ctx.storyHasOutcome('rank4_breakthrough', 'rank4_initial'));
assert('Thiếu Chủ: Tu vi nâng lên Tứ chuyển (chuyen === 4)', ctx.S.chuyen === 4);

// Nạp các module Q2 cho PR-09
['ch6_tamxoa.js', 'ch7_ngu.js', 'ch8_baquy.js', 'ch9_phanboi.js'].forEach(f => {
  const code = fs.readFileSync(path.join(root, 'js', 'q2', f), 'utf8');
  vm.runInContext(code, ctx, { filename: f });
});

ctx.cicadaReady = () => true;
ctx.cicadaSnap = () => {};
ctx.q2Ending = () => {};
ctx.kvState = () => ({ cho: 0 });
ctx.tvState = () => ({ done: 0 });
ctx.bvState = () => ({ done: 0 });

console.log('--- KIỂM TRA QUYỂN 2 HỒI KẾT: PR-09 ---');

// Test 40: 09.1 Tam Xoa Sơn bạo chiến
ctx.S = { v: 2, turn: 1, stones: 100, f: {}, rel: {}, gu: [] };
ctx.initStoryState(ctx.S);
ctx.AFTER.q2_tx_hoanhmi();
assert('Tam Xoa Sơn: Chém đầu Hoành Mi Bạo Quân lập hung danh (hoanhmi_slain)', ctx.storyHasOutcome('tamxoa_reputation', 'hoanhmi_slain'));

// Test 41: 09.2 Cốt Dực Cổ & Bá Vương Đương Thời
ctx.S = { v: 2, turn: 5, stones: 300, f: { votucTv: 1 }, rel: {}, gu: [] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_tx_cotduc.choices[0].ok();
assert('Tam Xoa Sơn: Luyện thành Cốt Dực Cổ (iron_wings_crafted)', ctx.storyHasOutcome('cotduc_refined', 'iron_wings_crafted'));

ctx.AFTER.q2_tx_batu();
assert('Tam Xoa Sơn: Trảm sát Thiết Bá Tu ("Bá Vương Đương Thời") (batu_slain_canon)', ctx.storyHasOutcome('thiet_ba_tu', 'batu_slain_canon'));

// Test 42: 09.3 Địa linh Bá Quy & Ám sát 3 đại cự đầu Ngũ chuyển
ctx.S = { v: 2, turn: 10, stones: 500, f: {}, rel: {}, gu: [], evq: [] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_bq_lo.choices()[0].eff();
assert('Địa linh Bá Quy: Đạt thỏa thuận hợp tác (cooperation_established)', ctx.storyHasOutcome('baquy_spirit', 'cooperation_established'));

ctx.AFTER.q2_bq_mobach();
assert('Ám sát cự đầu: Đánh vỡ gáy Thiết Mộ Bạch Ngũ chuyển đỉnh phong (mobach_slain)', ctx.storyHasOutcome('assassinate_mobach', 'mobach_slain'));

ctx.AFTER.q2_bq_ocat();
assert('Ám sát cự đầu: Tiêu diệt Vu Quỷ Ô Cật gom tài nguyên luyện tiên cổ (heads_harvested)', ctx.storyHasOutcome('assassinate_heads', 'heads_harvested'));

// Test 43: 09.4 Biến cố Bạch Ngưng Băng phản bội
ctx.S = { v: 2, turn: 15, stones: 0, f: {}, rel: {}, gu: [], evq: [] };
ctx.initStoryState(ctx.S);
ctx.EV.q2_pb_phanboi.choices[0].eff();
assert('Phản bội: Bạch Ngưng Băng kích hoạt Định Tinh Cổ vây hãm (star_pinned_trapped)', ctx.storyHasOutcome('bai_betrayal', 'star_pinned_trapped'));

// Test 44: 09.5 Xuân Thu Thiền lần 3, Luyện Định Tiên Du & Đoạt Hồ Tiên Phúc Địa
ctx.S = { v: 2, turn: 15, stones: 0, f: { dangHonNho: 1 }, rel: {}, gu: [], evq: [], log: [], mem: {}, combos: [] };
ctx.initStoryState(ctx.S);
ctx.META.chapSave = ctx.META.chapSave || {};
ctx.META.chapSave.q2_phanboi = JSON.stringify(ctx.S);
ctx.thienLan3();
assert('Xuân Thu Thiền: Tự bạo kích hoạt Thiền lần 3 nghịch chuyển quang âm (rewind3_executed)', ctx.storyHasOutcome('cicada_rewind3', 'rewind3_executed'));

ctx.S.evq = [];
ctx.EV.q2_pb_tho.choices()[0].eff();
assert('Tiên Cổ: Luyện thành Tiên Cổ Lục Chuyển Định Tiên Du (immortal_gu_born)', ctx.storyHasOutcome('dinhtiendu_refined', 'immortal_gu_born'));

ctx.EV.q2_pb_hotien.choices[0].eff();
assert('Hồ Tiên Phúc Địa: Tiếp quản Hồ Tiên Phúc Địa, hoàn thành Quyển 2 (hotien_master)', ctx.storyHasOutcome('hotien_claimed', 'hotien_master'));

console.log('------------------------------------------------');
if (failed === 0) {
  console.log('🎉 TẤT CẢ CÁC BÀI TEST PR-01, PR-03, PR-04, PR-06, PR-07, PR-08 & PR-09 ĐỀU ĐẠT CHUẨN (100% PASS)!');
  process.exit(0);
} else {
  console.error(`💥 CÓ ${failed} BÀI TEST THẤT BẠI!`);
  process.exit(1);
}
