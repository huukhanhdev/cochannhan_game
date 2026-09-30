# Kế hoạch: chỉnh Quyển 1 theo nguyên tác và nối cổ trùng sang Quyển 2

Viết ngày 30/09/2026. Mục tiêu:
1. Quyển 1 đúng nguyên tác hơn: mốc, thời điểm, nhân vật, cổ trùng.
2. Kho cổ của Phương Nguyên lúc hết Quyển 1 khớp với kho cổ đầu Quyển 2 trong truyện, để Quyển 2 không phải "phát cổ" từ trên trời xuống.

## 1. Kho cổ đầu Quyển 2 theo truyện và nguồn trong game hiện tại

Truyện VN 207–210: Phương Nguyên có 12 con cổ, cộng Thiên Nguyên Bảo Liên.

| Cổ | Trong game hiện tại | Việc cần làm |
|---|---|---|
| Xuân Thu Thiền | Có từ đầu | Không |
| Tửu trùng (4 con, bốn loại ánh sáng; bản dịch không rõ là Tứ Vị hay Tửu Trùng thường) | Tửu Trùng mua hoặc lấy ở động Hoa Tửu; Tứ Vị có công thức luyện | Cần xác nhận loại và số lượng |
| Ẩn Lân cổ (Ly Ngư Hóa Thạch) | Có, rơi từ Bạch gia | Cần nguồn canon |
| Cường Thủ cổ (giáp trùng kìm đen) | **Chưa có** | Thêm cổ và nguồn |
| Dương cổ (nửa của Âm Dương Chuyển Thân) | **Chưa có**; Quyển 2 đang coi như có | Thêm vào mộ Nhất Đại (VN 202–205) |
| Huyết Lô | Có, ở mộ Nhất Đại và trận cuối | Soát lại thời điểm |
| Huyết Nguyệt (ấn Hồng Nguyệt Nha trong lòng bàn tay) | Có, là công thức luyện từ Nguyệt Quang | Soát lại nguồn |
| Thính Nhục Nhĩ Thảo | Có tên Địa Thính Nhục Nhĩ Thảo | Soát tên và nguồn |
| Đâu Suất Hoa | **Chưa có**; Quyển 2 đang phát sẵn | Thêm nguồn ở Quyển 1 |
| Thiên Bồng cổ | **Chỉ có dữ liệu, không sự kiện nào cho**; Quyển 2 đang phát sẵn | Thêm nguồn ở Quyển 1 |
| Rết Vàng Răng Cưa (Cứ Xỉ Kim Ngô) | Có, nhưng là lựa chọn phụ ở hậu sơn tầng 5 (cần Nhị chuyển và tứ vị tửu), dễ bỏ lỡ | Đưa vào mạch chính theo canon |
| Thiên Nguyên Bảo Liên | **Chưa có**; Quyển 2 đang phát sẵn | Thêm: PN phế nguyên tuyền Cổ Nguyệt để luyện (VN 209) |

Cổ canon có ở cuối Quyển 1 nhưng không mang sang: Thạch Khiếu cổ (xung đột Huyết Lô, VN 204), Thiên Lý Địa Lang Tri (nhện Ngũ chuyển, bỏ lại, VN 190–192), Âm cổ (dùng cho BNB).

**Sau khi sửa:** Quyển 2 lấy đúng kho cổ người chơi có lúc hết Quyển 1, bỏ việc phát sẵn. Chỉ các cổ canon bắt buộc (Thiên Nguyên Bảo Liên, Dương cổ, Huyết Lô) được đảm bảo qua sự kiện trận cuối Quyển 1. Thiếu cổ nào thì Quyển 2 có nhánh bù (khó hơn), không kẹt.

## 2. Soát mốc Quyển 1

Game hiện có 27 tuần, 18 mốc (`CANON` trong `js/events.js`). Ghi chép nguyên tác hiện chỉ có đoạn cuối Quyển 1 (VN 190–206), nên phần đầu cần bạn cung cấp. Những chỗ đã biết lệch:

- **Hạc Tai và Thiên Hạc Thượng Nhân** (VN 193–206) chưa có. Đây là biến cố chính của trận cuối.
- **Xuân Thu Thiền lần hai** (VN 201): canon dùng khi Thiền chưa hồi phục hẳn, dưới 10% thành công, chỉ quay ngược một đoạn ngắn. Nên thành cảnh trận cuối.
- **BNB tự bạo rồi sống lại thành nữ nhờ Âm cổ** (VN 200–205): chưa có. Kết `bai_dong` và `huyetlo_bai` nên dẫn đúng về đây.
- **Phương Chính được Thiên Hạc mang về Trung Châu**: tuyến PC nên kết ở "mất tích", không chết hẳn.
- **Thiết Huyết Lãnh gắn Trấn Ma lên Nhất Đại trước khi chết** (VN 196).
- **Tư chất**: Bính 4 thành → 3 (Nhân Thú Táng Sinh) → Ất → Giáp 9 thành nhờ Huyết Lô (VN 204).

## 3. Cần bạn cung cấp

Gửi dạng ngắn, mỗi dòng một ý, có số chương VN nếu được. Không cần chép văn bản truyện.

**A. Nguồn cổ (quan trọng nhất)**, mỗi con: chương, lấy ở đâu, từ ai, chuyển số, tác dụng, thức ăn:
1. Thiên Nguyên Bảo Liên
2. Đâu Suất Hoa
3. Thiên Bồng cổ
4. Rết Vàng Răng Cưa (Cứ Xỉ Kim Ngô)
5. Cường Thủ cổ
6. Ẩn Lân cổ (Ly Ngư Hóa Thạch)
7. Thính Nhục Nhĩ Thảo
8. Tửu trùng: bốn con lúc cuối Quyển 1 là loại gì
9. Huyết Nguyệt cổ
10. Thạch Khiếu cổ
11. Âm Dương Chuyển Thân cổ
12. Bạch Thỉ, Hắc Thỉ (Song Trư lực): lấy ở đâu

**B. Mốc Quyển 1** (VN 1–190): tên mốc, chương, Phương Nguyên đang ở cảnh giới nào. Nhất là:
- Động phủ Hoa Tửu Hành Giả: vào khi nào, mấy tầng, trong đó có gì.
- Giả Kim Sinh, Giả Phú, thương đội.
- Lang triều: thời điểm, diễn biến chính.
- Thiết Huyết Lãnh: tới khi nào, điều tra ra sao, chết thế nào.
- Bạch gia, Hùng gia: các trận lớn.
- Lăng mộ Nhất Đại: phát hiện khi nào.

**C. Mô tả hiệu ứng cổ**: danh sách đã gửi trong chat trước (Nhất tới Lục chuyển, và các cổ chưa có trong game).

## 4. Các bước làm khi có dữ liệu

1. Thêm các cổ còn thiếu (Cường Thủ, Dương cổ, Âm cổ, Thạch Khiếu, Đâu Suất Hoa, Thiên Nguyên Bảo Liên) và gắn nguồn canon trong Quyển 1.
2. Đưa Rết Vàng, Thiên Bồng, Đâu Suất Hoa vào mạch chính Quyển 1 theo đúng chương.
3. Soát lại 18 mốc Quyển 1 theo mục 2B: dời tuần, sửa nội dung, thêm Hạc Tai và Thiên Hạc.
4. Viết lại trận cuối Quyển 1: Nhất Đại, Hạc Tai, BNB tự bạo, Xuân Thu Thiền lần hai, Âm cổ, và các kết cục dẫn sang Quyển 2.
5. Đổi `startQ2()`: bỏ phát sẵn cổ, lấy kho thật; thêm nhánh bù khi thiếu.
6. Chỉnh chỉ số cổ theo mô tả bạn gửi (mục 3C).
7. Kiểm tra: `check.cjs`, `sim.cjs`, `sim2.cjs` bắt đầu từ kho Quyển 1 thật, trình duyệt.
