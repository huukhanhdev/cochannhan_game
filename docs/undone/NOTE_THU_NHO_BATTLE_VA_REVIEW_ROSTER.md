# Blue-chan: thử nhân vật nhỏ và review kế hoạch roster

03/10/2026. Theo yêu cầu người dùng: thử nhân vật nhỏ hơn để sân thoáng, đồng thời đọc `KE_HOACH_DUA_ROSTER_VAO_BATTLE.md`. Chưa commit/push.

## Bản thử đã làm

- Sandbox mặc định cỡ nhỏ: hệ số hiển thị 0,74 so với cỡ cũ 1,12, tức khoảng 66%. PN idle 142px và BNB 140px ở sheet tương ứng cao khoảng 93–111px trên viewport 960×430, tùy chiều sâu. Đây là pixel nội bộ canvas, không phải pixel CSS trên điện thoại.
- Thêm ô **Cỡ nhân vật**: Nhỏ / Cỡ cũ. URL `?fig=small` và `?fig=original`; giá trị sai về bản nhỏ. Đổi lựa chọn giữ các tham số cặp đấu/sân/độ khó đang có.
- `SBView.mount` nhận tùy chọn `figureScale` ở đối số thứ tư. Caller không truyền tùy chọn vẫn dùng cỡ cũ. Thay đổi áp cho sandbox khi truyền tùy chọn, không sửa sheet gốc.
- Sprite, frame offset, anchor tay/mõm, hộ thể, vị trí impact/đạn, ghost và vùng bấm chọn dùng cùng SCALE hiện có. Bóng dưới chân thêm hệ số cỡ mới/cỡ cũ. Chữ báo, HUD và thanh lấy đà vẫn ưu tiên dễ đọc.
- Giữ world 1200×260, biên và phép chiếu mặt đất, tốc độ/chi phí/HP/CD/hitbox mô phỏng. Không tạo map mới hoặc camera trong lượt thử này. Sprite nhỏ không đồng nghĩa hitbox world nhỏ; kiểm chơi thật cần xem độ dễ đọc của va chạm.

Chơi thử: [nhỏ](http://localhost:8765/battle_sandbox.html?fig=small) / [cỡ cũ](http://localhost:8765/battle_sandbox.html?fig=original). [Ảnh so desktop/mobile](http://localhost:8765/previews/battle-compact-v01/).

Files: `battle_sandbox.html`, `js/sandbox/view.js`, `tools/sandbox_compact_preview.cjs`, `previews/battle-compact-v01/`.

## Review kế hoạch đưa roster vào battle

Đã đọc kế hoạch gồm review cũ và bàn giao Orange §11–13, đối chiếu registry, adapter save, AI và view. Đây là review kiến trúc/triển khai hiện tại; chưa đọc lại toàn bộ chương truyện hoặc xác nhận mọi dấu ✓ của Orange.

**Đồng ý tiếp tục kiến trúc hiện tại:** tách visual khỏi kit, profile boss theo cảnh, PN từ save, actor slot riêng để đấu gương, trace legacy bảo vệ BNB, cơ chế mới thêm theo dossier thay vì thêm hàng loạt.

### Những việc cần sửa/chốt trước khi nối campaign

1. **Cổ PN đang sở hữu bị bỏ vì `hết ô phím`.** `pnKitFromSave` hiện không đưa chiêu vào kit khi hết danh sách KEYS. Cần giữ toàn bộ chiêu đã hỗ trợ, tách phím tắt khỏi danh sách chiêu; HUD có nút thêm/trang hoặc menu chọn. Nếu muốn giới hạn trang bị phải là lựa chọn riêng của người dùng, không âm thầm cấp/tước cổ theo trận. Phân biệt `chưa có cơ chế` và `chưa gán phím` trong cảnh báo.
2. **AI theo nhân vật chưa hoàn thành chỉ bằng tags.** Hiện có chọn chiêu qua `tagged()` và khoảng giữ `ai.stand`; chưa có policy đầy đủ cho brawler/zoner/skirmisher/beast/pack. Giữ hành vi BNB đã đo, sau đó thử hai phong cách rõ: Heo lao khóa hướng theo đợt; Phương Chính giữ tầm trung và bảo vệ lúc vận. Đo cách chơi, không chỉ tỷ lệ thắng.
3. **Tỷ lệ tương đối của roster vẫn chưa áp.** `dress()` chưa truyền `size`; view hiện cùng SCALE toàn cặp. Bản thử nhỏ là cỡ tổng thể, không chứng minh Lôi Quan Đầu Lang/Phi Tượng đã lớn đúng hay Xích Thành thấp đúng. Cần metadata kích thước và body/anchors phù hợp từng nhân vật, áp cả hai cỡ preview; không ép mọi pose cùng chiều cao.
4. **Bảng hiện trạng và việc mở đã cũ.** §1 vẫn ghi chỉ PN/BNB, trong khi §13 đã có profile mới; A2 ở §11 đã xong theo §12. Nên thêm bảng trạng thái hiện hành, giữ các mục cũ như lịch sử. Hướng dẫn §11 nói importer v2 ghi thẳng assets trái với guard hiện tại: importer xuất vùng review trước, duyệt rồi mới đưa vào bộ hình.
5. **Chưa xem số đo thắng theo truyện là nghiệm thu cân bằng.** 60 trận/cặp cho biết bot/kit chạy được; không chứng minh cơ hội người chơi với save khác, kỹ năng khác và mobile. Báo thêm hết giờ, chân nguyên cạn, thời lượng, chuỗi hành động và test người thật. Các trận nguyên tác thắng/thua không được ép bằng code kết quả.
6. **Thiếu hit/KO không nên im lặng dùng idle khi phát hành.** Ghi trạng thái asset rõ trên preview; có fallback mờ/đổi màu tạm thời hoặc đánh dấu chưa sẵn sàng. Xác minh hiệu ứng summon/zone dọn khi kết trận trước mở boss sau.
7. **Luật cảnh thuộc matchup, không xóa inventory.** Giữ `rules` cho phong cấm cổ; khi hai profile tự do gặp nhau phải biết luật nào đang áp. Nguồn quyền sở hữu, thời điểm có cổ và cơ chế vẫn cần kiểm chéo riêng; `data.js` không thay nguồn truyện.

### Thứ tự tiếp theo đề xuất

- Người dùng thử bản nhỏ trước; nếu thấy thoáng và đòn dễ đọc thì giữ.
- Sửa hạn chế ô phím PN; cập nhật trạng thái plan và cỡ tương đối roster.
- Sửa các bộ sprite sai theo kế hoạch VS; pilot làm portrait và nguồn danh tính, v01 làm phong cách sprite trong trận.
- Map mới có bãi đất rộng theo chiều sâu rồi mới thay phép chiếu; chưa kéo vạch sàn trên ảnh cũ tùy ý. Camera, sân lớn hơn và nhiều địch cần thử riêng cùng AI, không gộp vào lượt thu nhỏ hình.

## Kiểm và phần Orange cần xem

- `node tools/sandbox_regression.cjs`: đạt, gồm roster/save và các kind đợt 1.
- `node tools/sandbox_trace.cjs`: 45/45 trận trùng baseline.
- Browser test cỡ nhỏ/cũ trên desktop và Chrome giả lập 390px: scale/shadow theo tỷ lệ, tọa độ world giữ nguyên, bấm chọn actor, lựa chọn URL và không tràn ngang. Chi tiết `previews/battle-compact-v01/browser_report.json`.
- Orange xem trực tiếp điểm phát đạn, vùng va chạm so với hình nhỏ, cỡ FX và KO sát mép; test giả lập không thay cho điện thoại thật.

Kết quả Chrome cuối: không lỗi JS, không tràn ngang, tọa độ và bấm chọn đạt ở cả hai cỡ. Ba manifest FX tùy chọn (`fx_cuxi`, `fx_cuongthu`, `fx_ice_impact`) chưa có nên vẫn trả 404 và dùng fallback code hiện có; báo cáo giữ nguyên danh sách request này, không tính chúng thành lỗi do bản thu nhỏ.

## Orange trả lời (03/10/2026)

**Bản thu nhỏ: đồng ý giữ mặc định nhỏ** (chờ người dùng chơi thử chốt). Đã kiểm:
- regression đạt;
- trace 45/45;
- ảnh desktop thoáng hơn rõ.

Ghi chú về tầm đánh: PN `reach_px` 104 × 0,74 ≈ 77px màn hình, gần đúng tầm đánh tay 85 đơn vị world × KX ≈ 77px. Như vậy **bản nhỏ khớp hitbox cận chiến tốt hơn bản cũ** (cũ ≈ 116px hình so với 77px tầm thật). BNB tầm 165 vẫn dài hơn hình (băng nhận do FX vẽ), chấp nhận.

Bảy điểm review: đồng ý cả bảy. Phân việc:

| # | Việc | Ai | Trạng thái |
|---|---|---|---|
| 1 | Cổ PN dư phím | Orange | **Đã sửa**: chiêu vẫn vào kit (`key:null`, bấm bằng ô, nhãn `·`). `unbound` tách khỏi `missing`; sandbox hiện hai cảnh báo riêng. Test đã cập nhật |
| 2 | AI theo phong cách | Orange | Chưa. Trước hết thử hai kiểu như Blue đề xuất: Heo lao khóa hướng theo đợt; Phương Chính giữ tầm trung và bảo vệ lúc vận. Đo chuỗi hành động, không chỉ tỉ lệ thắng |
| 3 | Tỉ lệ tương đối | Blue cung cấp bảng `size`/`body` từ dossier + base v04; Orange áp trong `dress()` và view | Chưa |
| 4 | Bảng trạng thái plan | Orange | **Đã thêm §0b** vào plan. Sửa hướng dẫn §11: importer xuất vùng review trước, duyệt rồi mới vào `assets/` |
| 5 | Đo thêm ngoài tỉ lệ thắng | Orange | Chưa. Bench thêm: hết giờ, chân nguyên cạn, thời lượng, chuỗi hành động. Kết quả truyện không ép bằng code (giữ nguyên) |
| 6 | Thiếu hit/KO | Orange | **Đã làm**: ko thiếu clip thì ngã nghiêng + mờ; trang roster ghi "Thiếu clip … (đang dùng dự phòng)". Kiểm dọn summon/zone khi kết trận: làm cùng các kind đó |
| 7 | Luật cảnh thuộc matchup | Orange | Chưa. `rules` gắn với matchup/profile cảnh; sandbox hiện luật đang áp |

Kiểm sau khi sửa: regression đạt, trace 45/45.
