# Review triển khai big update — 01/10/2026

Phạm vi review ban đầu: commit `955c96d` so với `dcf492c`, đọc runtime và hai tài liệu chuẩn content. Chưa kiểm tra hình ảnh trực tiếp bằng trình duyệt/mobile.

## Trạng thái triển khai sau review

Đã xử lý toàn bộ R1–R7 trong working tree:

- R1/R3: Story API luôn lấy đúng binding `S` hiện tại; schema story nâng lên v2, migrate journal cũ, ghi outcome/drift/journal đúng một lần.
- R2: trạng thái viên mãn mở hành động **Xung kích bích khiếu** và minigame đột phá; trần cảnh giới của chương vẫn khóa riêng.
- R4: pending dùng dữ liệu tuần tự hóa, có condition/effect registry, chống phát lại, chỉ hết hạn trong chương đích, chạy ở cả Q1/Q2 và được giữ đúng khi Xuân Thu Thiền phục hồi snapshot. Tuyến Tử Kinh Lệnh → Nam Thu Uyển là luồng production đầu tiên đi xuyên chương.
- R5: cảnh Bạch Ngọc được đưa trở lại vòng chơi khi đạt Nhị chuyển và có đủ Bạch Thỉ + Ngọc Bì; lựa chọn chờ tài nguyên không khóa vĩnh viễn cảnh.
- R6: bỏ Đổ Thạch khỏi tuần 7; sự kiện được xếp ngay sau khi thương đội Cổ gia tới.
- R7: HUD bỏ mốc hiện tại đã xử lý, đọc đúng `eventId`, dùng đơn vị thời gian theo chương; Nhân Quả Lục hiển thị được cả quyết định canon, dị số và hệ quả thường.

Kiểm tra sau sửa:

- `node tools/check.cjs`: đạt.
- `node tools/story_test.cjs`: đạt toàn bộ, gồm migration v2, metadata/drift, pending xuyên chương và journal UI.
- `node tools/regression_test.cjs`: đạt toàn bộ bằng engine production, gồm binding `S`, Xá Lợi → đột phá, thứ tự Thương Đội → Đổ Thạch, đường tới Bạch Ngọc, Tử Kinh xuyên chương và state sau Xuân Thu Thiền.

Phần bên dưới giữ lại phát hiện ban đầu để đối chiếu nguyên nhân và phạm vi sửa.

## Kết luận

Cần sửa logic trước khi làm đẹp thêm. Có lỗi tích hợp khiến hệ nhân quả mới không hoạt động trong engine thật, lỗi chặn đường đột phá bằng tu luyện và lỗi schema nhật ký. Nhãn “PR-00 tới PR-11 hoàn tất, 100% canon” chưa được các kiểm tra hiện tại chứng minh.

## Phát hiện theo ưu tiên

### R1 — P1: Story đọc sai biến trạng thái, toàn bộ API âm thầm bỏ qua

- Vị trí: `js/story.js:29–33`, các hàm khác dùng `root.S`; `js/engine.js:1` khai báo `let S, META`.
- `root` là `window`, nhưng global `let S` không phải thuộc tính `window.S`. `initStoryState(S)` vẫn chạy vì truyền trực tiếp state, khiến trông như hệ đã được nối; `storySetOutcome`, `storyAddJournal`, `storyHasOutcome` lại đọc đối tượng khác/không có.
- Tái hiện bằng harness nạp engine thật: sau `newLife()`, gọi set outcome và thêm journal → `typeof window.S === 'undefined'`, `S.story.outcomes` vẫn `{}`, journal vẫn `[]`.
- Ảnh hưởng: không ghi quyết định, mất các phản hồi dựa riêng trên outcome, Nhân Quả Lục rỗng.
- Sửa: truyền state rõ ràng hoặc dùng accessor đọc binding `S` hiện tại. Không chỉ gán `window.S=S` một lần: new life, startQ2 và rewind đều thay đối tượng S.
- Kiểm tra: nạp engine thật; đổi S qua new life/Q2/rewind rồi kiểm tra outcome ở đúng state, không mock `ctx.S` thay engine.

### R2 — P1: Chặn bế quan cũng chặn đường mở đột phá

- Vị trí: `js/engine.js:695–713`, `useGu()` khoảng dòng 767; UI khóa nút tại `js/ui.js:529` trở đi.
- Xá Lợi dùng ở đỉnh giai đặt `S.prog=need()` nhưng không gọi `levelUp()`/`startBreak()`. Lần bế quan tiếp bị `cultCapped()` trả `type:'break'` rồi return trước `levelUp()`.
- Tái hiện: Nhất chuyển đỉnh, dùng `xaloi1` → tu vi 130, `S.mg=null`, `cultCapped().type === 'break'`. Không có nút đột phá riêng thay thế. Có thể thoát nhờ event khác gọi levelUp, nhưng đường tiến cấp thông thường bị chặn.
- Sửa: phân biệt trần chương với sẵn sàng đột phá; mở hành động “Xung kích bích khiếu” đúng điều kiện, không thu thêm phí tu luyện khi tiến độ đã đầy. Rà tương tự lúc sang chương với tiến độ đã đầy từ trần chương trước.
- Kiểm tra: Xá Lợi ở đỉnh giai, Thạch Khiếu, save/load lúc đầy tiến độ, chuyển chương tăng trần; giữ nguyên các giới hạn canon riêng.

### R3 — P2: API outcome và UI journal không thống nhất schema

- Vị trí: `js/story.js:29–46`, `124–134`; `js/ui.js:139–153`; các lời gọi trong `events.js`, `q2/ch*.js`.
- Caller truyền tham số thứ ba `{choiceText,isLech,driftAmount,note}`; API lại coi nó là `payload`, chỉ chạy khi là function, còn `isLech` đọc tham số thứ tư. Metadata bị bỏ, dị số mới không tăng theo lựa chọn, set outcome không ghi journal.
- Journal writer lưu `{tuan,book,text,type,tag,time}`, còn UI đọc `evId/title/turn/isLech/choiceText/note`. Writer cũng dùng `S.tuan` thay `S.turn`.
- Tái hiện sau khi tạm nối state trong môi trường chẩn đoán: outcome được lưu nhưng journal vẫn rỗng, drift vẫn 0. Gọi thêm journal rồi render: có `undefined`, “Tuần ?”, không có nội dung text đã ghi. Bản ghi không có isLech còn bị mặc định gắn nhãn Nguyên tác.
- Sửa: chốt một object schema, cập nhật cả producer/consumer và migration. Lưu book/chapter/unit/turn tại thời điểm ghi; journal không tự suy mọi dữ kiện thiếu thành canon. Marker chống lặp cần bao cả dị số và journal.

### R4 — P2: Hậu quả xuyên chương chưa được tích hợp và có lỗi thời hạn

- Vị trí: `js/q2/core.js:105` (`startTurn2`), `js/story.js:105–115`, `js/cicada.js:39–41`.
- Chỉ startTurn Q1 gọi `storyCheckPending`; startTurn2/enterChapter không gọi. Chưa thấy event production nào gọi `storySchedulePending`. Do đó đây vẫn là nền chưa nối, chưa phải tính năng xuyên chương hoàn chỉnh.
- Hàm check so lượt hiện tại với maxTurn ngay cả khi chưa tới target chapter. Tái hiện pending tới thành lượt 1–3, check tại thương đội lượt 8 → hàng đợi bị xóa trước khi tới thành. `condId` có lưu nhưng chưa được kiểm tra.
- Rewind khôi phục snapshot rồi lọc `minTurn <= S.turn`, làm mất những lời hẹn hợp lệ vốn đã tồn tại trong snapshot và đến hạn ở tương lai.
- Sửa: chỉ xét hết hạn trong chương đích; nối dispatcher Q2, registry điều kiện, trạng thái resolved và chống phát lại; giữ nguyên pending trong snapshot đã phục hồi. Thêm một chuỗi production thật để kiểm tra từ đầu tới cuối.

### R5 — P2: Cảnh hợp luyện Bạch Ngọc mới không có đường tới

- Vị trí: `js/events.js:8–10`, `1032–1042`.
- Lịch cũ có `c_bachngoc` ở lượt 21; commit thay bằng `c_nhanthu`. Rà toàn bộ js chỉ còn khai báo `c_bachngoc`, không caller/lịch và không loc để randomEvent chọn.
- Ảnh hưởng: người chơi không tới được cảnh/outcome hợp luyện được viết và test trong update; điều này không có nghĩa mọi nguồn nhận Bạch Ngọc đều mất.
- Sửa: nối vào chuỗi truyền thừa theo thời điểm đủ điều kiện, trước những tình tiết cần cổ theo nguồn Q1 ch.100, thay vì khôi phục máy móc ở sau lang triều. Có đường chờ tài nguyên rồi quay lại.
- Kiểm tra: chơi từ trước chuỗi tới cảnh bằng engine, không gọi trực tiếp `EV.c_bachngoc.choices()[0].eff()`.

### R6 — P2: Lịch đổ thạch mới đảo thứ tự thương đội đến

- Vị trí: `js/events.js:8`, `398–406`.
- `c_dothach` đặt tuần 7 tại phường Cổ gia, trong khi `c_thuongdoi` vẫn tuần 10. Nguồn Q1 mục ch.40–43 đặt thương đội cập bến trước đổ thạch. Với thiên cơ thương đội sớm, nhóm mốc thương đội được dịch nhưng đổ thạch không nằm trong nhóm đó.
- Sửa: gắn đổ thạch sau sự kiện thương đội tới bằng phụ thuộc/lịch chung; cảnh gia sản và các mốc khác cũng cần đối chiếu thứ tự nguồn trước khi tuyên bố toàn Q1 chuẩn canon.

### R7 — P2: HUD báo mốc đã xử lý và dùng sai đơn vị Q2

- Vị trí: `js/ui.js:109–119`.
- `.find(t=>t>=S.turn)` chọn mốc hôm nay kể cả đã xử lý, không kiểm tra cond. Sau khai khiếu, HUD vẫn có thể báo “Biến cố tới: Khai khiếu (tuần này)”.
- Cố định chữ tuần trong khi Q2 có chương tính tháng/ngày. Fallback pending đọc `p.evId` nhưng schema lưu `eventId`.
- Sửa: lấy mốc đang chờ/chưa xử lý và có thể xảy ra, dùng đơn vị chương, chuyển ID pending thành tên sự kiện; chỉ công bố mức thông tin người chơi đã biết theo thiết kế.

## Kiểm tra đã thực hiện

- `node tools/check.cjs`: pass, không báo lỗi dữ liệu.
- `node tools/story_test.cjs`: pass. Test tạo `ctx.S` và stub nhiều hàm; không nạp engine để kiểm tra binding S như production, nên không bắt R1. Nhiều test gọi thẳng eff/ok nên không chứng minh cảnh có thể tới hoặc điều kiện đã đúng.
- `node tools/sim2.cjs 15 2`: không kẹt vòng lặp; 15 kết thúc được tính là thắng, trong đó 12 `q2_tranmathap`, 2 `q2_hotien`, 1 `q2_dinhtien_thanh`.
- Số thắng trên không đồng nghĩa thắng nội dung: `q2Ending()` gán win cho cả Trấn Ma Tháp. Đây là giới hạn đo lường hiện hữu; cần phân loại ending trước khi dùng báo cáo để chốt cân bằng.
- Probe Node với harness engine thật tái hiện R1/R2; probe sau nối state tạm để cô lập R3/R4. Không sửa source runtime để chạy probe.

## Thứ tự sửa đề nghị

1. R1 + sửa harness test tích hợp; R2 đột phá.
2. R3 thống nhất outcome/journal; R4 hoàn thiện dispatcher và rewind.
3. R5/R6 nối lịch content đúng hai nguồn chuẩn; kiểm tra bằng đường chơi thật.
4. R7 sửa HUD; sau đó review trực quan desktop/mobile, focus modal và nhịp combat khi mở nhật ký.
5. Chạy lại kiểm tra theo phạm vi thay đổi, phân loại kết cục Q2 và cập nhật trạng thái hoàn thành trong tài liệu.

UI nên ưu tiên thông tin đúng và đường thao tác đầy đủ trước khi thêm hiệu ứng hoặc thay bố cục lớn. Review này chưa kết luận về chất lượng hình ảnh, FPS hay toàn bộ độ đúng nguyên tác.
