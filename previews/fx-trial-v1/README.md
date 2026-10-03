# Review FX thử v1 (Muse) — Orange, 03/10/2026

Nguồn: `~/Downloads/fx_trial_v1.zip`, 6 ảnh theo `docs/prompts/PROMPT_MUSE_VFX_V1.md`.

Đã chạy thử bước xử lý thật:
1. khử nền magenta bằng `unkey` của `fx_import.py`, ngưỡng 90;
2. cắt đều theo số frame (ảnh Muse chia ô vuông đều);
3. thu nhỏ BOX;
4. giảm còn 16 màu chung cho cả clip (`pixel_normalize.py`).

Kết quả ở `*_sheet.png`, `report.json`. Ảnh so: `orange_raw.png` (gốc), `orange_processed_x3.png` (sau xử lý, phóng ×3).

**Kỹ thuật: đạt cả 6.** Sau xử lý còn 0 pixel hồng, 13–16 màu, nền sạch, frame đều.

| FX | Cỡ ô sau xử lý | Kết luận | Ghi chú |
|---|---|---|---|
| fx_bang_truy | 72×72 ×3 | **Đạt** | Mũi băng rõ, loop êm. Trông hơi giống mũi tên băng, chấp nhận |
| fx_hit_nguyet | 64×64 ×5 | **Đạt** | Chấm sáng, sao, mảnh vỡ, tan. Frame 5 gần trống, đúng ý tan dần |
| fx_nguyet_nhan | 96×96 ×4 | **Làm lại** | Hướng trăng khuyết đổi mỗi frame (frame 3 dẹt hẳn) nên loop sẽ giật. Prompt thêm: `the crescent keeps the SAME orientation and size in every frame, only the inner shine and trail sparkle change`. Tạm dùng frame 1–2 làm loop 2 frame |
| fx_st_choang | 48×48 ×4 | **Đạt** | Sao vàng quay rõ ở cỡ nhỏ |
| fx_st_troi | 96×96 ×4 | **Đạt (kèm xử lý)** | Vẽ vòng tròn nhìn chính diện, không dẹt sát đất như prompt. Runtime ép dẹt theo chiều dọc (×0,35) để nằm dưới chân; không cần gen lại |
| fx_st_phong_cam | 64×64 ×4 | **Làm lại** | Thành đồng xu có ổ khóa + chìa (biểu tượng UI hiện đại), không hợp tiên hiệp; 4 frame gần như giống nhau. Prompt mới bên dưới |

**Prompt mới cho Phong cấm** (giữ khối chung):
```text
A small floating yellow paper talisman strip with a black ink sealing rune (abstract brush strokes, not readable text), wrapped by thin dark iron chains, with dark violet-black smoke wisps around it, hovering. Frames: the talisman sways slightly, the chains tighten and the smoke curls, loopable. Use yellow paper, black ink, deep violet; no pink.
```

**Bước tiếp:**
- Blue/người dùng gen lại 2 cái (nguyệt nhận, phong cấm).
- Orange nối 4 cái đạt vào view:
  - nguyệt nhận và băng trùy thay hình vẽ bằng code;
  - hit nguyệt khi trúng;
  - icon choáng trên đầu;
  - vòng trói dưới chân.

  Nối qua `fx_import.py --approve` sau khi người dùng duyệt.

## Lượt 2 (fx_regen_v2.zip)

| FX | Kết luận | Ghi chú |
|---|---|---|
| fx_nguyet_nhan_v2 | **Đạt** | Hướng và kích thước giữ nguyên qua 4 frame, chỉ ánh sáng và đuôi lấp lánh đổi; độ trùng giữa các frame liên tiếp 0,74–0,92, loop êm. Hai điểm nhỏ: trăng dày hơn prompt ("thin"), hai mũi nhọn quay về phía trước. Ở cỡ đạn ~48px đọc tốt, chấp nhận |
| fx_st_phong_cam_v2 | **Đạt, cần căn frame lúc nhập** | Bùa giấy vàng, chữ ấn đen, xích và khói tím đen: hợp tiên hiệp. Nhưng tờ bùa lệch vị trí giữa các frame (tâm x 14→43px) nên loop bị nhảy. Đã thử căn mỗi frame theo tâm phần giấy vàng (`fx_st_phong_cam_v2_centered_sheet.png`): độ trùng frame lên 0,50–0,66, chỉ còn đung đưa. Còn 1 mẩu khói đứt ở frame 3 (bị cắt từ ô bên cạnh) cần xóa theo vùng liền khối nhỏ |

Ảnh so: `orange_v2_x3.png`.

**Tổng kết 6 FX dùng được:**
- **dùng thẳng:** Băng Trùy, nguyệt nhận trúng đích, nguyệt nhận bay v2, icon choáng;
- **cần xử lý lúc nhập:** vòng trói (ép dẹt khi hiển thị), phong cấm v2 (căn frame + xóa mảnh vụn).

Hai bước xử lý này nên thành tùy chọn của importer: `center_on` (màu/vùng làm tâm) và `min_blob` (xóa mảnh nhỏ), thay vì sửa tay.
