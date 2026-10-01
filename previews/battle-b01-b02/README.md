# Preview BATTLE-01/02 — Đấu trí theo lượt

Preview được chụp từ trận Điện Lang Q1 thật trong `index.html`. Không dùng mock UI, không thay arena hiện tại và không dựa vào trang tactical preview của nhánh khác.

## Bảng so sánh

| Khu vực | Theo lượt cũ | Lát cắt Đấu trí |
|---|---|---|
| Nhịp trận | Ý đồ và nút hành động có sẵn nhưng khó thấy ranh giới từng vòng | Có Vòng, phase chờ/giải quyết và khóa lệnh cho tới khi resolver hoàn tất |
| Ý đồ | Mô tả định tính trong con dấu | Card ý đồ báo mức nguy hiểm và khoảng sát thương cuối theo buff, cuồng nộ, hộ thể và giáp người chơi |
| Tài nguyên | Chân nguyên chỉ giảm trong trận | Ghi `hiện tại / trần tuần hoàn`, hồi +1 đầu vòng, không vượt lượng mang vào trận |
| Phòng thủ | Phụ thuộc cổ hộ thể | Có Thủ thế 0 chân nguyên, giảm 35% đòn trực tiếp và báo trước khoảng HP sẽ mất |
| Nguyên thạch | Hồi chân nguyên tới max | Tiêu một hành động, cộng 20 hiện tại và mở trần tuần hoàn thêm 20 |
| Kết quả | Phải đọc log để ghép diễn biến | Tóm tắt damage gây/nhận, chân nguyên đã tốn và sơ hở ngay trên battle |
| Reload | Không có phase riêng của vòng mới | Save giữa phase giải quyết tiếp tục đúng một lần; không nhân đôi hồi chân nguyên |

## Ảnh game thật

- `intent-desktop.png` — HUD vòng, chân nguyên và ý đồ trên desktop.
- `opening-desktop.png` — cửa sổ sơ hở sau đòn nặng.
- `intent-mobile.png` — ý đồ ở viewport 390×844.
- `opening-mobile.png` — trạng thái sơ hở trên mobile.

## Logic đã kiểm tra

- Hành động thiếu chân nguyên không tiêu vòng.
- Thủ thế vẫn cho địch đáp trả và giảm đòn 10 xuống 7.
- Mỗi vòng hồi đúng +1 một lần, kể cả reload giữa phase giải quyết.
- Hấp thu 5 nguyên thạch tăng đúng chân nguyên hiện tại và trần tuần hoàn.
- Đòn nặng mở một cửa sổ sơ hở; hành động công kích sau nhận ×1,3 sát thương rồi đóng cửa sổ.
- Forecast gọi cùng hàm damage với resolver và không làm hao hộ thể khi chỉ render UI.
- Không tràn ngang ở 390px; HUD đổi sang một cột và tôn trọng reduced motion.

## Cân bằng

Simulator đã có seed để so sánh. Với seed `20261001`, 120 chiến dịch × tối đa 6 kiếp:

| Mode | Thắng chiến dịch |
|---|---:|
| Theo lượt cổ điển | 31,7% |
| Đấu trí, hồi +1/vòng | 35,8% |
| Đấu trí, mốc cũ +4/+6/+8/+10 | 72,5% |

Vì vậy preview dùng +1 cố định. Mốc hồi cao chỉ quay lại khi BATTLE-03 có pattern và mục tiêu trận tạo đủ áp lực, đồng thời đã qua playtest người thật.

Cổng cuối trên 300 chiến dịch cùng seed cho mode Đấu trí +1 đạt **35,0%**, không có ca kẹt vòng lặp.

## Phần chưa nhận là hoàn thành

- Pattern riêng theo loại địch, phase boss và điều kiện phá thế đầy đủ thuộc BATTLE-03.
- Tutorial theo tình huống và forecast damage đầu ra cho toàn bộ cổ/sát chiêu còn thiếu.
- VFX ba nhịp riêng cho từng nhóm cổ và encounter cầm chân thuộc các PR sau.
