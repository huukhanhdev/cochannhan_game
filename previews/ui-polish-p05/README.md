# Preview P-05 — Phủ art Q1/Q2, đợt dùng asset hiện có

Đợt này chỉ nối các asset đã có và đã xem trực tiếp vào đúng chapter/event. Không sinh thêm tranh và không thay layout game.

## Mapping đã sửa

| Vùng / sự kiện | Trước | Sau |
|---|---|---|
| Thương đội | Dùng nền Sơn trại | Dùng nền rừng/đường núi trung tính, tránh lẫn địa danh Q1 |
| Thương gia thành + Thiếu chủ | Dùng nền Sơn trại | `scene_shang_city.jpg` |
| Tam Xoa Sơn + Ngũ chuyển giáng lâm | Dùng nền rừng chung | `scene_tam_xoa_mountain.jpg` với ba cột truyền thừa |
| Thương Tâm Từ lần đầu xuất hiện | Mapping cũ trỏ tới ID không tồn tại `q2_td_cuu` | Sửa về event thật `q2_td_tamtu`, dùng `scene_kindness_shang.jpg` |
| Tới Thương Lượng / rời thành đi Tam Xoa | Nền chapter chung | Cảnh chuyển vùng Thương thành / Tam Xoa |
| Hồ Tiên mở | Nền tuyết chung | `scene_hutien_blessed.jpg` |
| Bạch Ngưng Băng phản bội | Nền băng chung | `scene_blood_skull_refine.jpg` |

## Ảnh game thật

- `shang-city-desktop.png`, `shang-city-mobile.png`
- `tam-xoa-desktop.png`, `tam-xoa-mobile.png`

Các ảnh được chụp từ `index.html` ở state Quyển 2 thật. Smoke test đi qua năm chapter vừa đổi, xác nhận URL asset, số pin, tải ảnh minh họa sự kiện và không tràn ngang ở 390px.

## Phần art còn thiếu asset riêng

- Thương đội hiện dùng cảnh rừng/đường núi chung.
- Địa linh Bá Quy và Điện luyện cổ vẫn dùng nền huyết động chung; các cao trào đã có minh họa event riêng.

Ba nền này nên được sản xuất ở đợt art sau, với bố cục dành chỗ cho pin hiện tại. Không dùng ảnh nhân vật cận cảnh làm nền bản đồ chỉ để tăng tỷ lệ phủ asset.
