# Kế hoạch triển khai: Quyển 1 theo nguyên tác

Nguồn chuẩn: `NGUYEN_TAC_Q1.md` (đã đối chiếu bản gốc). Làm theo thứ tự. Xong bước nào thì đánh `[x]` và ghi commit.
Hết token giữa chừng thì phiên sau đọc file này, làm tiếp từ ô `[ ]` đầu tiên.

Nguyên tắc: không đổi số tuần (27) và bảng `CANON`. Chỉ sửa nội dung, nguồn cổ và trận cuối. Cân bằng để sau.

## GĐ1. Sửa tên và chi tiết sai
- [x] 1.1 "Giả Kim Sinh / Giả Phú / Giả gia" → "Cổ Kim Sinh / Cổ Phú / Cổ gia" trong text (giữ key `kimsinh`, `giaphu`, `giave`).
- [x] 1.2 Chỗ giết Kim Sinh: "bờ sông" → "khe đá" (ch 46–47).

## GĐ2. Thêm cổ còn thiếu (`js/data.js`)
- [x] 2.1 `cuongthu` Cường Thủ Cổ: bọ cánh cứng đen, càng sắt; cưỡng đoạt cổ trên người địch (ch 131–138).
- [x] 2.2 `thachkhieu` Thạch Khiếu Cổ: viên xúc xắc xám trắng; dùng một lần, không khiếu hóa vách đá, tu vi tăng mạnh nhưng khó lên Tứ chuyển (ch 143, 188).
- [x] 2.3 `amduong` Âm Dương Chuyển Thân Cổ (Tứ chuyển, trị liệu): cổ của Nhất Đại (ch 197–205). Sang Quyển 2 tách thành Dương cổ.

## GĐ3. Nguồn cổ đúng nguyên tác trong Quyển 1
- [x] 3.1 Động Hoa Tửu tầng hai: cho Bạch Thỉ (giấu dưới đất, ch 63) thay vì Bạch Ngọc.
- [x] 3.2 Bạch Ngọc = Ngọc Bì + Bạch Thỉ (hợp luyện, ch 100).
- [x] 3.3 Thiên Bồng = Bạch Ngọc + Thủy Tráo (hợp luyện, ch 155).
- [x] 3.4 Rết Vàng: bỏ điều kiện tứ vị tửu, cần Địa Thính (lời khắc "kim ngô… địa thính", ch 128–129); đánh dấu nguyên tác.
- [x] 3.5 Thạch Khiếu: nhặt sau trận Thanh Thư đấu BNB (lang triều, ch 143).
- [x] 3.6 Cường Thủ: nhặt từ xác Hùng Chiên sau trận Lang Vương (ch 138).
- [x] 3.7 Đâu Suất Hoa: lựa chọn nguyên tác ở phần thưởng sau lang triều (ch 160).
- [x] 3.8 Thiên Nguyên Bảo Liên: sự kiện mới "Bảo Liên dưới nguyên tuyền" sau lang triều: đổ nguyên thạch nuôi rồi đoạt (ch 162–189).

## GĐ4. Trận cuối theo nguyên tác
- [ ] 4.1 `c_nhatdai`: thêm Thiên Hạc Thượng Nhân (Hạc Tai, ch 193–198) và hậu thủ Trấn Ma của Thiết Huyết Lãnh.
- [ ] 4.2 `c_final`: lựa chọn nguyên tác mới "Xuân Thu Thiền lần hai" (ch 201–205): ném Nhất Đại ra lồng máu, nhặt Huyết Lô + Âm Dương Chuyển Thân, dùng Âm cổ cứu BNB. Kết `huyetlo_bai`.
- [ ] 4.3 Thạch Khiếu xung đột Huyết Lô: có cả hai thì mất Thạch Khiếu (ch 204).

## GĐ5. Nối sang Quyển 2
- [ ] 5.1 `startQ2()`: bỏ phát sẵn. Lấy từ kho Quyển 1: Thiên Nguyên, Đâu Suất, Tửu Trùng/Tứ Vị, Thiên Bồng, Huyết Nguyệt, Rết Vàng, Âm Dương → Dương cổ, Cường Thủ, Địa Thính.
- [ ] 5.2 Thiếu cổ nào: có nhánh bù (vào thẳng Quyển 2 từ menu vẫn được phát như cũ).

## GĐ6. Kiểm tra và phát hành
- [ ] 6.1 `tools/check.cjs`, `tools/sim.cjs` (canon + LECH), `tools/sim2.cjs`.
- [ ] 6.2 Thử trình duyệt (Playwright), không lỗi JS.
- [ ] 6.3 Cập nhật bản test trên artifact.
- [ ] 6.4 Commit, push nhánh, đưa lên `main`.
