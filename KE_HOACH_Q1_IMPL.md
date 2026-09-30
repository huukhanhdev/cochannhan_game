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

- [x] 3.9 (thêm) Sự kiện `c_kimngo` (ch 128–129) và `c_muon` (ch 155, mượn khố phòng hợp luyện Thiên Bồng) để mạch nguyên tác chắc chắn có Rết Vàng và Thiên Bồng.

## GĐ4. Trận cuối theo nguyên tác
- [x] 4.1 `c_nhatdai`: thêm Thiên Hạc Thượng Nhân (Hạc Tai, ch 193–198) và hậu thủ Trấn Ma của Thiết Huyết Lãnh.
- [x] 4.2 `c_final`: lựa chọn nguyên tác mới "Xuân Thu Thiền lần hai" (ch 201–205): ném Nhất Đại ra lồng máu, nhặt Huyết Lô + Âm Dương Chuyển Thân, dùng Âm cổ cứu BNB. Kết `huyetlo_bai`.
- [x] 4.3 Thạch Khiếu xung đột Huyết Lô: có cả hai thì mất Thạch Khiếu (ch 204).

## GĐ5. Nối sang Quyển 2
- [x] 5.1 `startQ2()`: bỏ phát sẵn. Lấy từ kho Quyển 1: Thiên Nguyên, Đâu Suất, Tửu Trùng/Tứ Vị, Thiên Bồng, Huyết Nguyệt, Rết Vàng, Âm Dương → Dương cổ, Cường Thủ, Địa Thính.
- [x] 5.2 Thiếu cổ nào: có nhánh bù (vào thẳng Quyển 2 từ menu vẫn được phát như cũ).

## GĐ6. Kiểm tra và phát hành
- [x] 6.1 `tools/check.cjs`, `tools/sim.cjs` (canon + LECH), `tools/sim2.cjs`.
- [x] 6.2 Thử trình duyệt (Playwright), không lỗi JS.
- [x] 6.3 Cập nhật bản test trên artifact.
- [x] 6.4 Commit, push nhánh, đưa lên `main`.

## Kết quả (30/09/2026)
- Bot nguyên tác Quyển 1 (`sim.cjs 100`): thắng trong 8 kiếp ~92–98%. Lúc thắng thường có Cường Thủ, Huyết Lô, Thiên Nguyên, Rết Vàng, Đâu Suất, Thạch Khiếu, Thiên Bồng. Kết `huyetlo_bai` chỉ ~15–25% (bot chọn ngẫu nhiên). Khó/dễ để cân bằng sau.
- Bot lệch nguyên tác (`LECH=1`): ~83%.
- Quyển 2 từ kho đầy đủ: 40/40 tới chương cuối. Từ kho tối thiểu: 37/40 (khó hơn, không kẹt).
- Trình duyệt: các sự kiện mới, trận cuối "Xuân Thu Thiền lần hai" và nút sang Quyển 2 chạy, không lỗi JS.

## Việc còn lại (chưa làm)
- Cân bằng (DIFF 1.7, Quyển 1 hiện dễ).
- Huyết Lô vẫn lấy được sớm ở lăng mộ (tuần 24); nguyên tác là cuối trận. Giữ làm nhánh game.
- Chưa có cảnh Thiên Lý Địa Lang (ch 190), Lôi Dực, Chiếu Ảnh (không mang sang Quyển 2 nên để sau).

## Đợt 2: luật chết và cân bằng
- [x] Ký ức chỉ sống trong một đời (`S.mem`, `S.combos`). Xuân Thu Thiền quay ngược thì mang theo; chết khi Thiền chưa hồi phục là chết thật, chơi lại từ lễ khai khiếu, không còn ký ức, không lựa chọn "theo ký ức", không tua nhanh theo đời trước, không cộng tu luyện theo số kiếp.
- [x] Quyển 2: chết thật thì chơi lại từ đầu Quyển 2 (kho cổ nhận từ Quyển 1), không còn làm lại từng chương. Thiền lần ba (chương cuối) vẫn quay về đầu chương như nguyên tác.
- [x] Cân bằng: `DIFF` 1.7 → 1.55, thêm `DIFF.q2=1.2` cho Quyển 2.
  - Quyển 1, tỉ lệ thắng mỗi đời: bot nguyên tác ~40%, bot lệch ~20%.
  - Quyển 2 (kho đầy đủ), mỗi lần thử: ~45%.
