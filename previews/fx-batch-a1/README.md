# So sánh lô A1: Muse và Blue (Orange review)

Brief: `docs/prompts/PROMPT_MUSE_VFX_V2_HANG_LOAT.md` §2.

Cùng bước xử lý cho cả hai bên:
1. unkey magenta 90;
2. cắt đều theo số frame;
3. BOX về ô đích, giữ tỉ lệ, căn giữa;
4. 16 màu chung cả clip.

Số đo ở `muse/report.json` (và `blue/report.json` khi có): số màu, pixel hồng, nội dung tràn biên ô (`cross_borders`), độ trùng frame liên tiếp (`iou`), tâm từng frame (`centroid`), độ phủ (`coverage`).

## Muse (fx_batch_a1.zip, 03/10 21:20)
Ảnh: `orange_muse_view.png` (trái: gốc đã bỏ nền; phải: sau xử lý ×3).

**Kỹ thuật:** cả 8 đạt 14–16 màu, 0 pixel hồng sau xử lý.

| FX | Kết luận | Lý do |
|---|---|---|
| fx_hit_dam | **Đạt** | Chớp trắng → nổ cam có vệt tốc độ → nhỏ dần → bụi. Đọc rõ ở 48px |
| fx_hit_chem | **Đạt** | Vạch chéo → hai cung chéo nhau → mờ → tia. Tia lấp lánh hơi ngả hồng nhạt nhưng xử lý xong không còn hồng |
| fx_tung_cham | **Đạt** | Chùm lá thông xanh đậm xòe nhẹ, loop ổn định (iou 0,76–0,97). Đúng VN ch.104/141 |
| fx_thanh_dang | **Chưa đạt** | Đúng ý mầm → dây leo có lá (ch.104), nhưng frame 4–5 cuộn tròn thành vòng thay vì quất ra rồi thu về; 2 chỗ tràn biên ô. **Lỗi của brief:** khối chung bảo "square frames" nhưng ô dây leo là 160×48, nên dây bị vẽ nhỏ trong ô vuông. Sửa brief: dây leo dùng frame chữ nhật ngang (10:3), xếp 5 frame theo **cột dọc** |
| fx_loi_giap | **Đạt** | Vòng điện lam trắng, tia điện chạy quanh, loop ổn (iou 0,51–0,81). Dạng vòng tròn thay vì vỏ bầu dục đứng, nhưng Lôi Quan là thú nằm ngang nên vòng tròn hợp hơn |
| fx_dien_tuong | **Đạt** | Khối điện tương lam có vân nứt, ổn định (iou 0,78–0,90). Đúng "điện tương màu lam" ch.164 |
| fx_hap_thu | **Đạt, hơi mờ** | Hạt đá xanh nhạt xoắn lên. Rất thưa (phủ 1–5% ô), ở cỡ nhỏ khó thấy. Chấp nhận làm hiệu ứng phụ; bản dày hơn thì tốt hơn |
| fx_lam_dieu | **Đạt** | Chim băng xanh dáng bồ câu, vỗ cánh đủ chu kỳ. Đúng ch.141 |

**Muse: 7/8 dùng được** (1 cái hơi mờ), dây leo cần làm lại theo brief đã sửa.

## Blue (previews/vfx-a1-v02, built-in imagegen)
Dùng sheet Blue đã nhập (cùng ô đích, BOX, 16 màu). Số đo: `compare_metrics.json`. Ảnh so: `orange_muse_vs_blue.png` (mỗi hàng: Muse trái, Blue phải, ×3).
Kỹ thuật cả hai bên đạt: ≤16 màu, 0 pixel hồng, Blue không frame nào chạm biên ô.

## Chọn từng FX
| FX | Chọn | Lý do |
|---|---|---|
| fx_hit_dam | **Muse** | Chớp trắng → nổ cam có vệt tốc độ: đọc rõ là cú đấm/húc. Bản Blue là chùm tia lửa nhỏ, frame 1 gần như trống |
| fx_hit_chem | **Blue** | Cung trắng xanh + tia, sáng và gọn, không chạm biên. Muse ngả kem/vàng, 1 frame chạm biên |
| fx_tung_cham | **Blue** | Kim thông mảnh xòe quạt: đọc đúng "lá thông" (ch.104/141). Muse thành bó đậm, dễ nhìn thành lá/lông vũ |
| fx_thanh_dang | **Blue** | Đúng kịch bản: mầm ở mép trái → dây vươn → đầu cuộn quất → thu về, neo trái cố định. Muse cuộn tròn và vẽ nhỏ (lỗi brief của Orange) |
| fx_loi_giap | **Blue** | Vỏ bầu dục bằng tia điện lam răng cưa, tâm rỗng: đọc là giáp lôi điện (ch.164). Muse là vòng sáng dày, giống cổng/vòng ánh sáng. Bản Blue nhấp nháy mạnh giữa frame (iou ~0,06); với điện thì chấp nhận được, chơi thử mới chốt nhịp |
| fx_dien_tuong | **Muse** | Khối điện tương tròn có vân nứt: đúng "từng đám điện tương" (ch.164), ổn định khi bay. Bản Blue giống tia sét/phi tiêu điện |
| fx_hap_thu | **Blue** | Tinh thể xanh xoắn lên dày hơn, đọc được ở cỡ nhỏ. Muse quá thưa |
| fx_lam_dieu | **Muse** (sát nút) | Dáng gọn giống bồ câu (ch.141 "thân như bồ câu"). Bản Blue cánh dài, đuôi vệt đẹp và rõ hơn nhưng nghiêng về phượng/bồ câu trắng. Nếu ưu tiên dễ nhìn trong trận thì lấy Blue |

**Kết quả:** Blue 5 (chém, Tùng Châm, Thanh Đằng, Lôi Giáp, hấp thu), Muse 3 (đấm, điện tương, Lam Điểu). Không cần gen lại cái nào trong A1.

Cách làm nên giữ cho các lô sau:
- **Blue mạnh** ở hiệu ứng có kịch bản động (dây leo, giáp, xoắn), nhờ importer tự cắt union và giữ quá trình lớn/tan.
- **Muse mạnh** ở khối hình gọn, ổn định (đạn tròn, nổ).
- Có thể để mỗi bên làm thế mạnh của mình, hoặc tiếp tục làm cả hai rồi chọn.
