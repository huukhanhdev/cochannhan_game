# Hiệu ứng và âm thanh: mỗi hệ cổ có cảm giác riêng

Trạng thái: đề xuất, chưa tạo asset. Nền hiện có: `battle.js`/PixiJS, `living.js`, `present.js`, `aperture.js`, `sound.js`. Xem [tổng thể](README.md).

## 1. E1 — Ngôn ngữ hiệu ứng dùng chung (P1)

Mỗi kỹ năng đi qua ba nhịp: báo hiệu → tác động → dư âm. Thời điểm báo hiệu và trúng đòn lấy từ logic trận, không từ độ dài video/animation. VFX đọc sự kiện kết quả; bật/tắt VFX không thay damage hay RNG gameplay.

| Nhóm | Hình dạng và chuyển động | Âm sắc | Tín hiệu gameplay |
|---|---|---|---|
| Nguyệt đạo | Lưỡi mực cong xanh nhạt, đường bay sắc | Gió rít ngắn | Hướng và thời điểm đòn tới |
| Băng/thủy | Rạn tinh thể, màn sương ở rìa | Kính lạnh, nước nén | Đóng băng/hộ thể phân biệt bằng icon |
| Huyết | Sợi đỏ sẫm, mực thấm lan | Nhịp trầm, âm hút | Chảy máu/hút sinh lực; không phủ chữ |
| Lôi | Nhánh điện ngắn, vùng báo trước | Điện khô, một đỉnh âm | Đòn diện rộng/choáng |
| Cốt | Mảnh trắng ngà, đường xuyên thẳng | Va đập khô | Xuyên/va chạm khác nguyệt nhận |
| Lực đạo | Thú ảnh thoáng qua sau lưng, sóng bụi | Trống trầm theo thú lực | Loại thú lực hoặc cú toàn lực vừa kích hoạt |
| Xuân Thu Thiền | Dòng mực đảo hướng, đồng hồ/cánh ve | Tiếng ve và âm nền bị kéo ngược | Bắt đầu/kết thúc quay ngược rõ ràng |
| Định Tiên Du | Cánh bướm ngọc, khung cảnh mở dần | Nốt sáng rồi khoảng lặng | Chuyển địa điểm sau kết quả thành công |

Ưu tiên 12 mẫu tái sử dụng: chém, đâm, quyền, hộ thể, đỡ chuẩn, ngắt vận chiêu, lộ sơ hở, hồi phục, độc/chảy máu, cổ trọng thương, cổ chết, rút lui. Biến thể theo nhóm cổ tạo cảm giác phong phú mà không cần một animation riêng cho mọi con.

## 2. E2 — Cao trào Quyển 1 (P1)

| Cảnh | Dàn dựng đề xuất | Điểm người chơi còn tương tác |
|---|---|---|
| Khai khiếu | Dòng nguyên hải hình thành, ấn tư chất hiện gọn | Xem giải thích và tiếp tục; không chờ diễn lâu |
| Vách Hoa Tửu | Hình lưu ảnh nổi lên từng lớp, tiếng nước nhỏ | Chọn quan sát/khai thác/rời đi |
| Kim Sinh và điều tra | Đèn hẹp, chân dung đổi sắc, khoảng lặng trước lời khai | Lựa chọn quyết định nằm rõ giữa cảnh |
| Lang triều | Bóng sói ngoài tường, bụi đá, lớp âm xa → gần | Đọc mục tiêu giữ tuyến và dùng kỹ năng |
| Thanh Thư/Mộc Mị | Rễ lan ở rìa, chân dung đổi trạng thái | Cứu/chi viện/rút theo nhánh; hiệu ứng phản ánh kết quả |
| Huyết động và băng phong | Chuyển bảng màu theo pha, cảnh đóng băng panorama | Quyết định cuối, xem kết cục, kiểm kê trước Q2 |

Không phát cảnh hi sinh nếu nhánh đã cứu nhân vật. Mỗi đoạn điện ảnh có “bỏ qua”; bỏ qua phải hoàn tất chuyển tiếp đúng một lần.

## 3. E3 — Bản sắc chín chương Q2 (P1/P2)

| Chương | Lớp cảnh/âm chủ đạo | Cao trào cần riêng |
|---|---|---|
| Hoàng Long | Nước đục, bè trôi, gió sông, lạnh | Cổ đói và mất nguồn lực, tiếng nền thưa dần |
| Bạch Cốt | Đá trắng, bụi xương, tiếng vọng | Mật thất và Cốt Nhục Đoàn Viên |
| Thương đội | Đèn lều, bánh xe, tiếng người xa | Thú tập kích và đêm cương thi |
| Thương gia thành | Phố nhiều lớp, biển hiệu, tiếng chợ | Đấu trường và đấu giá |
| Thiếu chủ | Bàn sổ sách, đèn ấm, nhịp âm tiết chế | Công bố kết quả tranh quyền |
| Tam Xoa | Ba cột sáng với hình/icon khác nhau | Bước vào từng truyền thừa |
| Ngũ chuyển | Bầu trời biến sắc, trường âm trầm | Cự đầu xuất hiện; cho cảm giác áp đảo |
| Bá Quy | Rùa đá và vết rạn, lửa vạc, nhịp thiếu ổn định | Tiên nguyên cạn và kế hoạch luyện cổ |
| Điện luyện cổ | Xích sắt, rạn không gian, ve/bướm ngọc | Phản bội → quay ngược → Định Tiên Du → Hồ Tiên |

Ưu tiên biến thể ánh sáng/lớp nền của asset có sẵn. Chân dung mới tập trung nhân vật ở cảnh có nhiều tương tác; mỗi NPC trọng tâm cần trung tính, căng thẳng và biến thể trạng thái thật sự dùng tới.

## 4. E4 — Âm thanh có phân lớp (P1)

Mở rộng Web Audio hiện có với ba kênh: môi trường, giao diện, chiến đấu/nhạc. Có âm lượng riêng và nút mute tổng được nhớ. Mở audio sau thao tác người dùng, xử lý suspend/resume của browser.

Môi trường theo địa điểm; nhạc đổi ở mốc có ý nghĩa, crossfade thay vì khởi động lại mỗi render. Địch vận chiêu, đỡ chuẩn và cổ trọng thương có âm riêng. Nguy hiểm luôn có tín hiệu thị giác tương đương. Giới hạn âm phát đồng thời; tránh nhiều sát thương nhỏ tạo tiếng chồng gây mệt.

Màn tử vong để một khoảng lặng trước tiếng ve nếu được trùng sinh. Cảnh chết thật Q2 có kết thúc khác; âm thanh không được hứa một lần quay ngược không tồn tại.

## 5. E5 — Chất lượng và ngân sách (P0/P1)

Đã có reduced motion trong `battle.js`, một số CSS, và giảm tải theo FPS. Mở rộng thành tùy chọn Nhẹ/Vừa/Đầy đủ; Auto là lựa chọn ban đầu. Mục tiêu thử nghiệm: desktop khoảng 60 FPS, mobile tối thiểu 30 FPS ở cảnh nặng, với thiết bị và độ phân giải ghi trong báo cáo.

- Giới hạn thử ban đầu: 60 hạt ở Nhẹ, 150 ở Vừa, 300 ở Đầy đủ cho một đấu trường; điều chỉnh sau đo.
- Không tạo texture/filter mới mỗi tick. Pool đối tượng thường dùng, giới hạn DPR trên máy yếu, hủy ticker/listener/âm khi thoát cảnh.
- Tải asset theo chương; preload cảnh sắp tới, không preload toàn bộ hai quyển ở menu.
- Mục tiêu animation giao diện 120–250ms; đòn theo nhịp logic; cao trào 3–8 giây có skip. Đây là ngân sách thiết kế, không áp dụng để kéo dài trận.
- Reduced motion bỏ shake, zoom giật và hạt nhanh; giữ icon, thanh tiến độ và lời báo. Có tùy chọn giảm chớp sáng riêng.
- Quay 20 lần bản đồ → trận → kết quả → bản đồ để tìm texture/listener rò rỉ; theo dõi bộ nhớ có tiếp tục tăng hay không.

## 6. Asset và cách nghiệm thu

Tạo inventory trước sản xuất: khóa asset, file, cảnh dùng, kích thước, nguồn/license, biến thể, placeholder. Dùng `asset()` và quy tắc công khai/cá nhân hiện hữu; kế thừa `KE_HOACH_NGUON_ASSET_CHUAN.md` và `KE_HOACH_ASSET_QUYEN_2.md`. Không đưa đường dẫn `assets/local/` thành điều kiện bắt buộc để chơi.

Thứ tự sản xuất: bộ 12 VFX cơ sở → một trận Q1 và một trận Q2 mẫu → cảnh lang triều/điện luyện cổ → môi trường còn lại → portrait phụ. Không cần tạo toàn bộ tranh trước khi biết UI đặt ảnh thế nào.

Nghiệm thu: cùng save/seed và hành động, bật/tắt/skip hiệu ứng cho cùng kết quả; tiếng không tự phát trước tương tác; thiếu ảnh vẫn chơi được; lớp hiệu ứng không chắn nút; tắt rung không mất dấu hiệu địch sắp đánh; tạm dừng không tích lũy burst khi tiếp tục.
