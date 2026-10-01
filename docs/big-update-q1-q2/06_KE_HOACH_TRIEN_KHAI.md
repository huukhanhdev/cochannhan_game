# Kế hoạch triển khai big update Quyển 1–2

Ngày cập nhật: 01/10/2026. Trạng thái: **kế hoạch thực thi; chưa sửa runtime**. Các tên module, schema và công cụ mới dưới đây là dự kiến, không phải tính năng đã có.

## 1. Nguồn chuẩn bắt buộc

Theo chỉ định của người dùng, content phải bám hai file:

- [CHI_TIET_NGUYEN_TAC_Q1.md](../../CHI_TIET_NGUYEN_TAC_Q1.md): tình tiết, thứ tự, nhân vật, cổ và cơ chế Quyển 1.
- [CHI_TIET_NGUYEN_TAC_Q2.md](../../CHI_TIET_NGUYEN_TAC_Q2.md): phần nối Q1, toàn bộ Quyển 2 và các cơ chế tương ứng.

Các file 01–05 là ý tưởng thiết kế. Code hiện tại là hiện trạng. Khi khác nguồn chuẩn, sửa thiết kế/code tương ứng; không sửa nguồn chuẩn chỉ để hợp thức hóa gameplay. Không dùng các file `NGUYEN_TAC_Q*.md` cũ làm chuẩn thay thế.

Mỗi cảnh phải tách ba lớp:

| Lớp | Được thay đổi | Phải giữ |
|---|---|---|
| Canon | Diễn đạt lại, chia đoạn, thêm tương tác không đổi bản chất | Ai làm gì, vì sao, thời điểm tương đối, cổ/cảnh giới, kết quả |
| Chuyển thể gameplay | Nén thời gian, số lượt, chi phí cân bằng, cơ chế thao tác | Điều kiện và quan hệ nhân quả cốt lõi; có ghi rõ phần quy đổi |
| Nhánh giả định | Người chơi rẽ khỏi kết quả nguyên tác | Hệ thống sức mạnh, động cơ hợp lý, trạng thái nhất quán và cái giá |

Trước tiên phải có đường canon chạy đúng. Chuỗi phụ hoặc nhánh cứu người từ các plan trước được thêm sau khi đường chuẩn có kiểm tra. Không biến các đề xuất cứu Thanh Thư, giữ Trương Trụ sống hoặc ngăn phản bội thành kết quả nguyên tác mặc định.

## 2. Bước đối chiếu trước khi viết code

Tạo `docs/big-update-q1-q2/CANON_MAP.md` ở PR-00, mỗi hàng gồm:

`factId | file nguồn + tiêu đề mục/chương | dữ kiện | event/node/code liên quan | canon/chuyển thể/giả định | sai lệch | cách xử lý | ca kiểm tra | trạng thái`.

Dùng tiêu đề mục và khoảng chương làm tham chiếu ổn định, kèm hash phiên bản nguồn lúc duyệt; không chỉ dùng số dòng dễ đổi. Một event có thể dẫn nhiều fact. Các đoạn nguồn kể ngược thời gian hoặc lặp cùng sự kiện được gom bằng factId, không phát hai lần trong game.

Phân loại sai lệch: thiếu cảnh; sai thứ tự; sai chủ sở hữu/chuyển/công dụng cổ; sai người biết thông tin; sai kết quả; chuyển thể chưa ghi nhãn. Nguồn chuẩn có mục so sánh “game hiện tại” thì coi đó là ghi chú lịch sử, phải đọc code lại trước khi ghi lỗi.

### Các điểm cần đối chiếu ngay

| Mã | Dấu hiệu trong nguồn đã đọc | Cách xử lý khi triển khai |
|---|---|---|
| SRC-01 | Q1 mục ch.160–161 gọi Đâu Suất Hoa là hoa chiến đấu; Q2 ch.208 mô tả cổ chứa đồ | Đối chiếu vai trò theo từng thời điểm; chưa thêm kỹ năng công kích từ câu mô tả này |
| SRC-02 | Q1 mục ch.155 mô tả Thiên Bồng Tam chuyển, bảng tổng kết gộp Bạch Ngọc → Thiên Bồng ở hàng Nhị | Tách từng cổ và từng lần nhận; chưa lấy bảng gộp làm rank cuối |
| SRC-03 | Q1 bảng tổng kết nói Bảo Liên ở hồ máu, mục đính chính cùng file nói đã có trước ch.188 | Ghi mâu thuẫn vào map; chưa dời cảnh nhận cổ dựa riêng bảng tổng kết |
| SRC-04 | Q2 ch.210 còn dấu hỏi về số lượng/chuyển Tửu Trùng | Không đổi số lượng carry-over hoặc preset thành dữ kiện chắc chắn |

Nếu chưa phân xử được bằng ngữ cảnh của chính hai file, để trạng thái `unresolved`, tạm giữ cơ chế đang chạy ở phần đó và không tuyên bố đã chuẩn canon. Hoàn thiện các phần độc lập; tập hợp câu hỏi cụ thể khi cần chốt chi tiết, không dừng toàn đợt vì một hàng.

## 3. Thứ tự triển khai và điều kiện chuyển bước

Mỗi PR là một đơn vị thay đổi có thể review và chạy riêng; tên PR không yêu cầu phải tạo/push PR lên dịch vụ bên ngoài. Quy mô lớn tách nhỏ theo các nhánh ghi dưới đây. Không làm đồng thời nhiều refactor trên `engine.js` khi trạng thái chưa ổn định.

| PR | Việc chính | File sửa/thêm dự kiến | Phụ thuộc | Xong khi |
|---|---|---|---|---|
| 00 | Inventory canon, event, flags, asset và baseline | `CANON_MAP.md`, báo cáo baseline; `tools/sim*.cjs` nếu thêm seed | Không | Có map cho hai tuyến mẫu và toàn bộ mốc chuyển quyển/kết Q2; số đo tái lập |
| 01 | Migration save và fixture | `engine.js`, dự kiến `js/story.js`, `tools/story_test.cjs`, fixtures | 00 | Save v2 cũ load được, dữ liệu thiếu được mặc định đúng, dữ liệu hỏng có lối phục hồi |
| 02 | Kết quả và hậu quả xuyên chương | `story.js`, `engine.js`, `butterfly.js`, `q2/core.js`, `cicada.js`, `ff.js` | 01 | Mỗi kết quả áp dụng một lần; qua chương/rollback đúng trạng thái |
| 03 | HUD, lựa chọn, kết quả và journal nền | `index.html`, `ui.js`, `present.js`, `q2/core.js` | 02 | Một cảnh có nguồn chuẩn, điều kiện khóa rõ, kết quả và hậu quả truy được |
| 04 | Tuyến mẫu Q1: Kim Sinh → điều tra | `events.js`, `data.js` nếu cần; fixtures | 03 + map đã rõ | Route chuẩn và hai route lệch dùng cùng hợp đồng, không gán sai án |
| 05 | Trận mẫu, tín hiệu VFX và âm thanh | `rt.js`, `battle.js`, `sound.js`, `living.js`, `auto.js`, UI | 04 | Chơi tay RT/lượt, skip/reduced motion không đổi kết quả logic |
| 06 | Tuyến mẫu Q2: thương đội → thành | `ch3_thuongdoi.js`, `ch4_thanh.js`, `core.js`, UI | 04–05 | Lựa chọn trong đoàn được trả ở thành; vốn/hàng/người không mất sai khi load |
| 07a | Q1 đầu: học đường, Hoa Tửu, gia sản | `events.js`, `data.js`, `minigame.js` nếu liên quan | Hai mẫu đạt | Thứ tự và nguồn cổ đúng các fact đã duyệt |
| 07b | Q1 giữa: truyền thừa, lang triều, gia lão | Như 07a + `rt.js` | 07a | Có chuẩn bị và hậu quả; cơ chế tiến cấp đúng nguồn |
| 07c | Q1 cuối và bàn giao Q2 | `events.js`, `q2/core.js`, `ui.js` | 07b | Kho thật, trạng thái BNB, tư chất/cảnh giới chuyển đúng từng route |
| 08a | Q2 chương 1–2: sinh tồn và Bạch Cốt | `ch1_hoanglong.js`, `ch2_bachcot.js`, `data2.js` | 07c | Chơi được từ kho nghèo/giàu; cho mượn cổ và đồng hành đúng |
| 08b | Q2 chương 3–5: thương mại, lực đạo, thiếu chủ | `ch3_*`, `ch4_*`, `ch5_*`, `luc.js` | 08a, mở rộng 06 | Ba chương khác cách chơi, có ngân sách thưởng và hậu quả nhân sự |
| 09a | Q2 chương 6: ba truyền thừa | `ch6_tamxoa.js`, `truyenthua.js` | 08b | Đúng luật vào/ra/cổ chìa khóa, ba kiểu quyết định khác nhau |
| 09b | Q2 chương 7–8: cự đầu, Bá Quy | `ch7_ngu.js`, `ch8_baquy.js` | 09a | Điều kiện áp chế, nguồn nguyên liệu và thông tin được giải thích |
| 09c | Q2 chương 9: phản bội, Thiền, Định Tiên Du | `ch9_phanboi.js`, `cicada.js`, UI | 09b | Điều kiện bắt buộc không bị thay bằng điểm bonus; mọi ending hợp lệ |
| 10 | Asset và dàn dựng đầy đủ | `assets/`, `present.js`, `battle.js`, `sound.js`, CSS | Content tương ứng đã ổn | Mỗi chương có bản sắc, đúng nhánh, đạt ngân sách hiệu năng |
| 11 | Cân bằng và kiểm tra phát hành | Công cụ/check/fixtures, bảng cân bằng, docs | 07–10 | Không softlock, save an toàn, hai quyển qua ma trận kiểm tra |

Trong từng PR content: canon → chuyển thể tương tác → nhánh giả định → lời thoại phản hồi → UI/VFX → kiểm tra. Không viết hàng chục cảnh mới rồi mới nối điều kiện.

## 4. Thiết kế nền đủ nhỏ để triển khai

### 4.1. Module và thứ tự nạp

Giữ JavaScript toàn cục và máy cảnh hiện hữu. Dự kiến thêm `js/story.js` để chứa schema/migration/helper nhân quả, nạp sau `data.js`, trước các consumer; không đọc `S`, `EV`, `CHAPTERS` tại thời điểm khai báo trước khi chúng có mặt. Handler chỉ tra registry lúc gọi.

Khi thêm module, cập nhật danh sách nạp trong `index.html` **và** các harness `check.cjs`, `sim.cjs`, `sim2.cjs`, `ff_test.cjs`; rà toàn bộ công cụ có danh sách file riêng. Lỗi công cụ không nạp module mới không được chữa bằng cách vô hiệu hóa kiểm tra.

Chưa tách toàn bộ `events.js`, chưa đổi framework và chưa chuyển mọi callback sang một DSL mới. Hai tuyến mẫu đi trước; adapter giữ `eff/ok/fail/AFTER` cũ dùng được.

### 4.2. State dự kiến

```js
S.story = {
  version: 1,
  outcomes: {},  // chainId -> một kết quả chính, không nhiều cờ đối nghịch
  pending: [],   // hậu quả có địa chỉ book/chapter/cửa sổ lượt
  applied: {},   // khóa kết quả đã áp dụng trong dòng thời gian hiện tại
  journal: []    // biên nhận đã xảy ra; giới hạn số mục để tránh phình save
};
```

Mỗi hậu quả có `id`, `sourceChoice`, `targetBook`, `targetChapter`, `earliestTurn`, `latestTurn`, `conditionId`, `status`. Registry chứa hàm kiểm tra `conditionId`; JSON chỉ lưu khóa và dữ liệu. Không dùng `eval` để chạy biểu thức trong save.

Kết quả có ID ổn định theo chuỗi/cảnh/lần xảy ra; scene một lần dùng ID cố định, sự kiện lặp có instance ID được lưu trước khi resolve. Retry do render/load không được coi là lần xảy ra mới. Journal và marker `applied` được chụp trong snapshot cùng tài nguyên; quay ngược trước quyết định cho phép nhận lại kết quả trong dòng thời gian mới đúng một lần.

`META` chỉ giữ dữ liệu xuyên đời phù hợp luật game; không đặt hàng đợi hậu quả hoặc marker thưởng của một đời vào đó. Snapshot nằm trong `META.chapSave` vẫn cần chứa đúng trạng thái `S.story` của thời điểm chụp.

### 4.3. Migration và lưu trữ

Hiện `loadAll()` kiểm tra `s.v===2`; thêm `schemaVersion` riêng và giữ tương thích v2. Migration áp dụng cho save hiện tại, nhập save, snapshot chương và dữ liệu phục hồi của Thiền/tua nhanh. Không chỉ migrate lần mở menu.

Trình tự: đọc và giữ bản gốc → parse/validate → migrate trên bản sao → validate ID/cấu trúc → cho chơi → chỉ lưu phiên bản mới khi thành công. Trường thiếu mặc định theo book/chapter; không suy ra đã giết người hoặc đã nhận cổ chỉ từ số lượt.

`saveAll()` hiện ghi `S` và `META` riêng: bổ sung generation chung và bản lưu trước hợp lệ, hoặc một envelope chứa cả hai sau khi đánh giá tương thích. Mục tiêu là khôi phục được nếu một lần ghi thất bại; không để `catch` im lặng báo thành công khi storage đầy. Thay đổi này cần ca kiểm tra storage ném lỗi giữa hai lần ghi.

### 4.4. UI và hiệu ứng đọc cùng kết quả

Logic resolve thay đổi state và sinh biên nhận; UI hiển thị biên nhận; FX/SFX nghe thông báo tương ứng. Animation không cấp cổ, không trừ thạch và không tự gọi hoàn thành cảnh nhiều lần. Callback “skip” chỉ hoàn tất trình bày.

Giữ `S.later` cho hậu quả trong chương; `S.story.pending` cho hậu quả xuyên chương. `enterChapter()` xử lý hàng đợi mới sau khi chapter/start state sẵn sàng, trước khi xếp thêm chuyện phụ; không xóa rồi tạo lại. Xác định ưu tiên: cảnh đang dở → mốc khẩn → hậu quả đến hạn → mốc/chuyện phụ theo luật engine; không để hậu quả làm mất mốc cuối chương.

## 5. Hai tuyến mẫu — ticket thực thi đầu tiên

### PR-04: Kim Sinh → Cổ Phú → Thiết gia

1. Map `c_kimsinh`, `c_dieutra`, `c_thiet` và các cảnh đọc kết quả vụ án tới mục Q1 ch.44–47, 55–58, các mục Thiết gia về sau.
2. Giữ nguyên tên Cổ Kim Sinh/Cổ Phú, địa điểm và động cơ theo nguồn chuẩn; không quay lại tên/nội dung cũ chỉ vì ID kỹ thuật còn chứa `gia`.
3. Bổ sung kết quả chuỗi chuẩn hóa cho ba route: theo tuyến án mạng, vạch trần, rút/cắt giao dịch. Hai route sau ghi rõ nhánh giả định.
4. Nối nhân chứng, bảo lãnh, bằng chứng và phản ứng về sau. Lời thoại hỏi tội chỉ xuất hiện khi NPC có căn cứ tương ứng.
5. Thêm thẻ kết quả, nhật ký và lý do khóa lựa chọn. VFX căn cứ kết quả thực của nhánh.
6. Fixture: trước gặp, sau quyết định, trước điều tra, trước Thiết gia. Chạy lại với nghèo thạch, thiếu cổ liên quan và quan hệ khác nhau.

Nghiệm thu: không đường nào hết lựa chọn; load giữa hai cảnh không phát lại thưởng; route không giết không bị thoại mặc định khẳng định đã giết.

### PR-06: Thương đội → Thương gia thành

1. Map các sự kiện Tâm Từ, Trương Trụ, hàng Kim gia, đêm cương thi và tới thành theo mục Q2 “Cung 3”.
2. Chỉ một loại giao dịch mẫu có vốn/hàng/thời hạn trước khi mở rộng nhiều nhóm hàng; lấy giá trị thật từ state để tính biên nhận.
3. Một hậu quả xuyên chương của quyết định trong đoàn phải xuất hiện đúng ở thành; có route người liên quan sống/chết và đã gặp/chưa gặp.
4. Route giữ Trương Trụ sống là giả định, phải trả giá và thay thoại liên quan; route chuẩn theo nguồn có bộ kiểm tra riêng.
5. UI nguồn hàng/nguồn tiền không tiết lộ tin chưa biết. Không nhân vật nào biết thân phận thật chỉ vì người chơi đọc đoạn góc nhìn khác.
6. Fixture: trước giao dịch, trước quyết định với Trương Trụ, trước `chapEnd`, sau `enterChapter`, khi hậu quả đã giải quyết.

Nghiệm thu: tiền + hàng đúng sau load; qua chương không mất hậu quả; không có giao dịch lặp vô hạn; cảnh thành nhắc đúng việc đã làm.

## 6. Quy trình viết từng gói content

Mỗi mốc phải có phiếu ngắn trước khi code:

| Trường | Yêu cầu |
|---|---|
| Nguồn | File chuẩn, tiêu đề mục, khoảng chương, factId |
| Đầu vào | Event đã qua, cổ/cảnh giới, NPC sống và biết gì, nguồn tài nguyên |
| Diễn biến chuẩn | Các bước bắt buộc giữ đúng; những phần nén thời gian |
| Tương tác | Người chơi chọn gì, chi phí chắc chắn, rủi ro, đường thiếu điều kiện |
| Nhánh | Kết quả canon; kết quả giả định và điểm rẽ |
| Đầu ra | Cổ/tài nguyên, một outcome chính, quan hệ, hậu quả, mốc mở tiếp |
| Trình bày | Địa điểm, chân dung đúng giai đoạn, FX/SFX, reduced motion |
| Kiểm tra | Fixture tối thiểu, kỳ vọng sau resolve/load/rewind |

Tạo manifest máy đọc được dự kiến `tools/fixtures/story_manifest.json` để kiểm tra event/node/gu/NPC/factId tồn tại và trạng thái review. Công cụ không thể tự chứng minh câu văn đúng nguyên tác; cần review phiếu với nguồn. Chặn gắn nhãn canon khi fact phụ thuộc còn `unresolved`.

## 7. Kiểm tra theo mức ảnh hưởng

| Thay đổi | Kiểm tra cần chạy |
|---|---|
| Chữ/nguồn/đường dẫn trong plan | Link, code fence, tham chiếu nguồn; không chạy mô phỏng game vì sửa Markdown |
| Event/điều kiện/phần thưởng | `node tools/check.cjs` + fixture route bị tác động |
| Save/hậu quả/chuyển chương | Migration cũ/mới/hỏng, ghi lỗi, load giữa resolve, replay, restart và rewind |
| Chiến đấu/cổ/balance | RT và lượt, bot biết cơ chế mới, mô phỏng hai quyển bằng cùng bộ seed |
| UI/effect/audio | Browser desktop/mobile, bàn phím, pause, tab ẩn, skip, thiếu asset, mute/reduced motion |
| Tua nhanh | `node tools/ff_test.cjs 120` + cảnh có biến thể/điều kiện mới |

Các công cụ/fixture mới phải chạy được engine thật trong Node theo cách harness hiện có. Không kiểm tra chỉ bằng regex khi cần biết trạng thái sau lựa chọn; regex hữu ích cho tham chiếu, không đủ bắt chuyện thưởng hai lần.

Baseline và phát hành dùng các lệnh mô phỏng tại [README](README.md), gồm route lệch và Q2 kho tối thiểu. Khi chưa thêm seed, ghi rõ kết quả có tính ngẫu nhiên; chưa dùng chênh lệch nhỏ làm bằng chứng cân bằng tốt hơn. Chạy lại phạm vi rộng khi có thay đổi hệ thống hoặc lỗi cần xác minh, không lặp toàn suite cho từng sửa câu chữ.

Tiêu chí cuối: không lỗi chặn tiến trình; mọi kết cục Q1 được phép sang Q2 có fixture; NPC không sống lại ngoài cơ chế đã duyệt; cổ/nguồn lực không sinh thêm qua reload; scene/vận chiêu không chạy khi lớp UI bắt buộc đang tạm dừng; đường canon không bị nhánh giả định thay thế ngầm.

## 8. Bàn giao và giới hạn phạm vi mỗi PR

Mỗi PR cập nhật hàng tương ứng trong `CANON_MAP.md`, danh sách file thay đổi, save mẫu trước/sau, kiểm tra đã chạy và hạn chế còn lại. UI/VFX có ảnh hoặc clip khi tới bước triển khai trực quan. Không báo hoàn thành chỉ vì bot qua hết; phải chơi thử tuyến vừa đổi.

Chỉ bật gói mới mặc định sau khi qua cổng kiểm tra của nó. Nếu cần cờ thử nghiệm, cờ phải được ghi vào save; không tắt gói giữa một cảnh đang dở. Dữ liệu cũ giữ nguyên ID hoặc có bảng chuyển đổi, tránh rollback code khiến save mới mất event.

**Điểm bắt đầu cụ thể:** PR-00 cho map Kim Sinh/điều tra, thương đội/thành, cầu nối Q1–Q2 và hồi kết Q2 → PR-01/02 cho save/nhân quả → PR-03/04 cho bản chơi mẫu Q1. Chỉ mở rộng số lượng content sau khi hai tuyến mẫu chứng minh được cách triển khai này.
