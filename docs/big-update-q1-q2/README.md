# Big update Quyển 1–2: từ chuỗi sự kiện thành hành trình có hệ quả

Ngày lập: 01/10/2026. Trạng thái: **đề xuất thiết kế, chưa triển khai gameplay**.

**Nguồn chuẩn content theo chỉ định của người dùng:** [CHI_TIET_NGUYEN_TAC_Q1.md](../../CHI_TIET_NGUYEN_TAC_Q1.md) và [CHI_TIET_NGUYEN_TAC_Q2.md](../../CHI_TIET_NGUYEN_TAC_Q2.md). Quy tắc này áp dụng cho toàn bộ file 01–06 và mọi đợt triển khai tiếp theo. Bắt đầu triển khai theo [06_KE_HOACH_TRIEN_KHAI.md](06_KE_HOACH_TRIEN_KHAI.md).

## 1. Định hướng

Giữ bản sắc tu luyện, cổ trùng, mưu kế và trùng sinh. Bản nâng cấp cần khiến người chơi cảm nhận rõ ba điều: chuẩn bị có ích, lựa chọn để lại hậu quả, mỗi vùng có cách chơi riêng. Tăng chiều sâu những mốc hiện hữu trước khi tăng số sự kiện ngẫu nhiên.

- **Quyển 1 — Sống trong vòng vây gia tộc:** tranh tài nguyên, giữ bí mật, tận dụng quan hệ và chuẩn bị trước lang triều. Thế giới nhỏ nhưng nhớ việc người chơi làm.
- **Quyển 2 — Dùng kiến thức đổi lấy cơ hội:** sinh tồn cùng Bạch Ngưng Băng, thương mại và thân phận giả, xây bộ cổ ở Thương gia thành, đánh cược trong Tam Vương, xoay chuyển thế cục ở điện luyện cổ.
- **UI:** mỗi thời điểm trả lời được “mình cần làm gì, còn bao nhiêu thời gian, cái giá là gì?”.
- **Hiệu ứng:** cho thấy đòn đánh, nguy hiểm và biến chuyển cốt truyện; giữ nền thủy mặc và khả năng đọc chữ.

## 2. Các file kế hoạch

| File | Nội dung |
|---|---|
| [01_GAMEPLAY.md](01_GAMEPLAY.md) | Chuẩn bị, chiến đấu, kinh tế cổ, quan hệ, nhân quả xuyên chương, save |
| [02_UI_UX.md](02_UI_UX.md) | HUD, bản đồ, hội thoại, chiến đấu, kho cổ, nhật ký, mobile |
| [03_EFFECT_AUDIO.md](03_EFFECT_AUDIO.md) | Ngôn ngữ hiệu ứng, cảnh cao trào, âm thanh, chất lượng và hiệu năng |
| [04_CONTENT_QUYEN_1.md](04_CONTENT_QUYEN_1.md) | Sáu cụm nội dung, tám chuỗi phụ, ba cảnh mẫu, kết cục và bàn giao Q2 |
| [05_CONTENT_QUYEN_2.md](05_CONTENT_QUYEN_2.md) | Nâng cấp cả chín chương, ba truyền thừa, đồng hành, phản bội và kết cục |
| [06_KE_HOACH_TRIEN_KHAI.md](06_KE_HOACH_TRIEN_KHAI.md) | Thứ tự PR, file cần sửa, hợp đồng dữ liệu, kiểm tra canon, save và nghiệm thu |

## 3. Hiện trạng đã đọc trong mã

Đây là khảo sát mã nguồn và tài liệu, chưa phải đánh giá qua một lượt chơi bằng trình duyệt. Các nhận định về độ vui, nhịp chơi và cân bằng là giả thuyết cần playtest.

| Phần | Bằng chứng trong repo | Hướng nâng cấp |
|---|---|---|
| Nền tảng | `index.html`, JavaScript toàn cục, `S`/`META`, localStorage | Mở rộng từng phần; không cần chuyển framework cho đợt này |
| Q1 | `js/events.js` đã có `scene`, lựa chọn điều kiện, các mốc cuối nhiều bước | Bổ sung quyết định và hệ quả, tránh viết lại máy cảnh |
| Q2 | `js/q2/core.js` và `ch1_*` đến `ch9_*` đã tồn tại | Làm sâu chín chương, không coi Q2 là tính năng chưa có |
| Chiến đấu | `js/rt.js`: ba tầm, vận chiêu, đỡ chuẩn, sơ hở, mục tiêu riêng, đồng minh | Làm rõ tín hiệu và tạo bài toán chiến thuật riêng cho từng trận |
| Tùy chọn trận | Đã có tạm dừng, tốc độ chậm, chế độ lượt; vòng RT bỏ tick khi tab ẩn | Hoàn thiện tính nhất quán và khả năng tiếp cận |
| Cổ trùng | `js/data.js`, `js/q2/data2.js`, `js/q2/luc.js`; nuôi, thương tổn, luyện, lực đạo | Cho thấy chi phí dài hạn và công dụng trong tình huống |
| Nhân quả | `js/butterfly.js`: dị số, biến thể, hậu quả trễ, dấu vết kiếp trước | Hậu quả có địa chỉ chương và giải thích được nguyên nhân |
| Truyền thừa | `js/q2/truyenthua.js` đã có ba hệ riêng | Tăng lựa chọn giữa các ải; Khuyển Vương hiện có bước tự xử lý tối đa tám ải |
| Trình bày | `battle.js`, `living.js`, `present.js`, `aperture.js`, `sound.js` | Nâng cấp có hệ thống từ nền PixiJS/canvas/Web Audio hiện hữu |
| Kiểm tra | `tools/check.cjs`, `sim.cjs`, `sim2.cjs`, `ff_test.cjs`, công cụ browser | Dùng lại và bổ sung ca kiểm tra theo thay đổi |

`node tools/check.cjs` chạy ngày lập kế hoạch: “Dữ liệu: không có lỗi”; còn cảnh báo “Cổ chưa gắn sự kiện cốt truyện (1): nhanthutangsinh”. Đây là cảnh báo của công cụ quét, cần đối chiếu đường nhận cổ thực tế trước khi kết luận là thiếu nội dung.

README/TỔNG QUAN và các kế hoạch cũ có chỗ mô tả phiên bản trước. Không dùng tỷ lệ thắng ghi trong đó làm baseline mới. Lúc khảo sát, workspace đã có thay đổi ở `engine.js`, `ui.js`, `q2/core.js`, `sim.cjs`, `sim2.cjs` và tài liệu Q1 chưa tracked; bộ kế hoạch này không sửa các file đó.

Ghi chú khi hoàn tất: workspace tiếp tục được cập nhật ngoài bộ kế hoạch này; một số tài liệu đã đọc, gồm `NGUYEN_TAC_Q1.md`, `NGUYEN_TAC_Q2.md`, `KE_HOACH_PR5.md`, hiện được đánh dấu xóa, đồng thời xuất hiện `CHI_TIET_NGUYEN_TAC_Q2.md`. Các tên tài liệu cũ trong bộ plan ghi lại nguồn tại thời điểm khảo sát; khi triển khai, đối chiếu bản chi tiết Q1/Q2 còn trong workspace và lịch sử Git. Kết quả kiểm tra dữ liệu phía trên thuộc snapshot lúc chạy, không xác nhận các sửa đổi phát sinh sau đó.

## 4. Quy tắc biên tập và phạm vi

1. Nội dung lấy chuẩn từ `CHI_TIET_NGUYEN_TAC_Q1.md` và `CHI_TIET_NGUYEN_TAC_Q2.md` theo chỉ định của người dùng. Tài liệu cũ, code hiện tại và ý tưởng trong plan không được ghi đè hai nguồn này. Nếu nội bộ nguồn chuẩn mâu thuẫn hoặc còn dấu hỏi, ghi vào bảng đối chiếu, tiếp tục phần độc lập và chỉ khóa chi tiết phụ thuộc; không tự chọn một bản làm canon. Lần khảo sát này không xác minh lại toàn bộ bản truyện ngoài repo.
2. Mỗi content được phân loại: **mốc theo tài liệu nguyên tác**, **chuyển thể thành gameplay**, hoặc **nhánh giả định**. Quan hệ cao không tự xóa động cơ nhân vật; lệch truyện không đồng nghĩa bị phạt thua.
3. Không tạo phẩm chất cổ kiểu thường/hiếm/huyền thoại hoặc chỉ số sức mạnh trái hệ chuyển. Thanh cảnh báo, nhân quả và sơ hở là công cụ biểu diễn gameplay.
4. Tận dụng cảnh và asset đã có. Mọi số lượng, mức thưởng, thời lượng và ngưỡng hiệu năng dưới đây là mục tiêu đề xuất, chưa phải kết quả đo.
5. Chưa mở Quyển 3, multiplayer, thế giới mở 3D hoặc thay toàn bộ kiến trúc. `thien_ngoai_chi_ma/` nằm ngoài phạm vi; cần smoke test khi đụng asset dùng chung.

## 5. Lộ trình triển khai

P0 = điều kiện nền để không phá luồng; P1 = giá trị chính của bản update; P2 = làm giàu sau khi vòng chơi đạt yêu cầu. Mỗi đợt phải chơi được độc lập.

| Đợt | Ưu tiên | Sản phẩm bàn giao | Phụ thuộc | Cổng nghiệm thu |
|---|---|---|---|---|
| 0. Chốt hiện trạng | P0 | Inventory event/flag/asset, baseline hai quyển, danh sách mâu thuẫn canon | Không | Có báo cáo tái lập; không lẫn số đo cũ |
| 1. Nền nhân quả | P0 | Hợp đồng kết quả, hậu quả xuyên chương, migration save | Đợt 0 | Load save cũ; không lặp thưởng hoặc mất hậu quả |
| 2. Bản chơi mẫu Q1 | P1 | Kim Sinh → điều tra; HUD mới; một trận có chuẩn bị và VFX đầy đủ | Đợt 1 | Chơi được cả nhánh giết, vạch trần, rút lui |
| 3. Bản chơi mẫu Q2 | P1 | Thương đội → thành; thương mại, quan hệ, hậu quả sang chương | Đợt 1–2 | Hàng hóa và quan hệ có ảnh hưởng thật; không khóa nhánh oan |
| 4. Q1 hoàn chỉnh | P1 | Sáu cụm, chuỗi phụ, lang triều, hồi kết và chuyển Q2 | Đợt 2 | Đường nguyên tác/giả định đều đi tới kết cục hợp lệ |
| 5. Q2 đầu và giữa | P1 | Chương 1–5, bộ cổ lực đạo, đấu trường, tranh thiếu chủ | Đợt 3 | Mỗi chương có bản sắc; cân bằng kho cổ nghèo/giàu |
| 6. Q2 hồi cuối | P1 | Chương 6–9, ba truyền thừa, Bá Quy, phản bội và tái lập kế hoạch | Đợt 5 | Chuỗi điều kiện cuối có thể hiểu và hoàn thành |
| 7. Hoàn thiện | P1/P2 | Asset còn thiếu, âm thanh, mobile, reduced motion, tổng rà soát | Đợt 4–6 | Đạt ma trận kiểm tra, không lỗi chặn tiến trình |

**Bản chơi mẫu làm trước:** khoảng 15–25 phút có một chuỗi điều tra Q1 và một chặng thương đội Q2 qua save mẫu. Đây là mục tiêu thử nghiệm, không phải cam kết độ dài toàn game. Chỉ mở rộng toàn bộ content khi người chơi hiểu được giá của lựa chọn và nhận ra hậu quả.

## 6. Kiểm tra cho các đợt triển khai sau

Các lệnh dưới đây là kế hoạch kiểm tra, không khẳng định đã chạy trong lần viết tài liệu này:

```sh
node tools/check.cjs
node tools/sim.cjs 200 6
LECH=1 node tools/sim.cjs 200 6
node tools/sim2.cjs 200 5
LECH=1 node tools/sim2.cjs 200 5
Q1INV=min node tools/sim2.cjs 200 5
node tools/ff_test.cjs 120
```

Bot là smoke/balance check, không chứng minh người thật thấy dễ hiểu hay chiến đấu vui. Bổ sung seed tái lập trước khi dùng số đo A/B; bot phải biết cơ chế mới để kết quả có ý nghĩa. Theo dõi tỷ lệ tới từng chương, nguyên nhân chết, cổ chết đói, mốc bị bỏ lỡ, lựa chọn áp đảo, thời gian đọc và số thao tác mỗi lượt. Chốt ngưỡng cân bằng sau baseline, không ép về số cũ trong README.

Ma trận bắt buộc: Q1/Q2; RT/theo lượt; chơi tay/bot; desktop/mobile; save mới/cũ; tải lại giữa cảnh/trận/chuyển chương; skip/tua nhanh; thiếu ảnh/âm thanh bị chặn; reduced motion; Q2 từ menu và từ mọi kết cục được phép của Q1. Kiểm tra browser hiện có dùng Puppeteer/Chrome và localhost, cần xác nhận môi trường trước khi chạy.

## 7. Rủi ro và cách giới hạn

| Rủi ro | Cách xử lý |
|---|---|
| Quá nhiều cờ tạo nhánh mâu thuẫn | Một kết quả chính/chuỗi; trạng thái sống/chết, gặp/chưa gặp được kiểm tra trước lời thoại |
| Content mới gây dư tài nguyên | Ngân sách thưởng theo chương; phần thưởng thông tin và đường đi thay cho cộng thạch hàng loạt |
| Quá nhiều quản lý làm loãng truyện | Tối đa một hệ đặc thù mới cần học mỗi chương; bảng nâng cao mở khi cần |
| Hiệu ứng che đòn hoặc làm chậm máy | Tín hiệu chiến đấu độc lập lớp trang trí, giới hạn hạt, chế độ nhẹ |
| Save và rollback nhân đôi thưởng | Kết quả áp dụng đúng một lần, ID ổn định, test load giữa chuyển tiếp |
| Kế hoạch lớn thành nhiều việc dang dở | Chốt hai bản chơi mẫu trước; P2 chỉ làm sau các cổng P1 |

## 8. Quan hệ với tài liệu cũ

Bộ này là roadmap nối tiếp `KE_HOACH_CHI_TIET_NANG_CAP.md`, `KE_HOACH_CHIEN_DAU.md`, `KE_HOACH_NHANH_TRUYEN.md`, `KE_HOACH_PR5.md`, `KE_HOACH_Q2.md`, `KE_HOACH_ASSET_QUYEN_2.md`. Những phần đã có trong mã được coi là nền để mở rộng; tài liệu nguyên tác vẫn là nguồn biên tập, không bị thay thế bởi đề xuất gameplay.
