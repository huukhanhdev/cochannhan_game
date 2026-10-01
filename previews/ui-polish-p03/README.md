# Preview P-03 — Cổ trùng và tu luyện

Preview được chụp trực tiếp từ `index.html`, không dùng mock UI và không tạo game state thứ hai.

## Bảng so sánh

| Khu vực | Trước P-03 | Sau P-03 |
|---|---|---|
| Kho Cổ | Tên, mô tả và độ bền nằm chung trong thẻ; phải đọc mô tả để biết công dụng | Có nhãn vai trò Công kích/Hộ thể/Trị liệu/Thụ động/Tiêu hao/Kỳ cổ và nhãn tình trạng độc lập |
| Cổ bị đói hoặc thương | Chủ yếu dựa vào pill đói và thanh độ bền | Nền/viền phản hồi theo tình trạng, vẫn giữ số đói và độ bền chính xác |
| Tu luyện | Các lựa chọn là trọng tâm, tiến độ/bình cảnh nằm trong chữ | Có khối tiến độ tu vi, banner bình cảnh và nút đột phá riêng khi engine cho phép |
| Luyện cổ | Nút bị khóa nhưng người chơi phải tự đối chiếu nguyên liệu | Mỗi công thức ghi chính xác vật phẩm còn thiếu hoặc báo `Đủ nguyên liệu` |
| Mobile | Công thức hai cột dễ bị chật | Công thức và cụm tỷ lệ/nút tự xếp một cột, không tràn ngang |

## Ảnh game thật

- `after-gu-desktop.png` — năm loại vai trò và hai tình trạng Cổ.
- `after-gu-mobile.png` — kho Cổ ở viewport 390×844.
- `after-cultivation-desktop.png` — tu vi đầy, đang ở bình cảnh chờ đột phá.
- `after-cultivation-mobile.png` — cùng trạng thái trên mobile.
- `after-refining-desktop.png` — công thức đủ/thiếu nguyên liệu lấy từ state thật.

## Fixture và kiểm tra

- Cổ: Xuân Thu Thiền, Nguyệt Quang Cổ đang đói, Ngọc Bì Cổ trọng thương, Trị Liệu Cổ và Xá Lợi Cổ.
- Tu luyện: Nhất chuyển đỉnh phong, tu vi `130/130`, đủ điều kiện gọi resolver đột phá nhưng preview không bấm nút.
- Luyện cổ: tài nguyên và kho Cổ được đặt để có cả công thức đủ lẫn thiếu.
- Smoke test xác nhận render không sửa `S`, số recipe khớp `RECIPES`, trạng thái nút khớp `canRefine()`, mobile không tràn ngang và reduced motion tắt animation trạng thái.
