# Blue recheck: VFX chiêu thức (brief Muse v2)

Orange-kun, 03/10/2026. File cần Blue kiểm lại trước khi Muse gen hàng loạt: [docs/prompts/PROMPT_MUSE_VFX_V2_HANG_LOAT.md](../prompts/PROMPT_MUSE_VFX_V2_HANG_LOAT.md) (đã push, Muse đọc từ GitHub).
Kết quả thử trước đó: [previews/fx-trial-v1/README.md](../../previews/fx-trial-v1/README.md). Ảnh mẫu: `assets/fx_ref/style/`, `assets/fx_ref/creature/`.

Phân vai:
- **Blue:** đối chiếu nguồn truyện, sửa câu mô tả nếu sai, làm phần importer.
- **Orange:** review kết quả gen và nối runtime.
- Sửa thẳng vào file brief, ghi lại ở mục "Blue trả lời" cuối file này.

## 1. Nguồn truyện cần đối chiếu (Orange ghi theo cache bản Việt, chưa ai kiểm chéo)
Cột "Orange ghi" là ý diễn giải trong brief. Blue mở đúng chương, xác nhận hoặc sửa. Không chép nguyên văn dài lên GitHub (repo public), chỉ diễn giải.

| FX | Orange ghi | Cần Blue xác nhận |
|---|---|---|
| fx_tung_cham | ch.104, 141: Thanh Thư vung tóc bắn mưa lá thông xanh, xuyên hình nộm | Màu lá, có phát ra từ tóc thật không, có "mưa" hay bắn thẳng |
| fx_thanh_dang | ch.104: cành xanh dài mười lăm thước mọc từ lòng bàn tay, dùng như roi; ch.140: quấn eo kéo người | Đúng là mọc từ lòng bàn tay phải; dây leo có lá không |
| fx_loi_giap | ch.164: Lôi Quan Đầu Lang bật hộ giáp lôi điện toàn thân trước khi nguyệt nhận tím chém tới | Màu điện (lam?), có gọi tên cổ không |
| fx_dien_tuong | ch.164: đuôi vẫy, phun từng đám điện tương màu lam | Như trên |
| fx_tru_len | ch.164: tru lên trời, toàn thân lóe điện chớp, tốc độ tăng gấp bội. Vòng sóng là art | Có tả sóng âm hay vòng không |
| fx_lam_dieu | ch.136, 141: chim băng xanh bay ra từ răng/miệng, thân như bồ câu | ch.136 có tả thêm (đuôi, cánh, vệt băng) không |
| fx_thuy_trao | ch.132: hai luồng hơi nước trắng từ mũi cuộn quanh thân thành cầu nước tự xoay | Đúng chương; khi vỡ ra sao (ch.141 Thanh Đằng quấn cầu nước) |
| fx_ngoc_bi | data.js + ch.80: da tỏa ánh ngọc | Màu ánh ngọc (trắng xanh?), Bạch Ngọc khác Ngọc Bì thế nào |
| fx_loc_bang | ch.140–141: cơn lốc băng nhận trắng toát | Hình dạng (vòi rồng hay vòng quét), cao thấp |
| fx_moc_mi | ch.141: tóc mọc lá xanh, da hóa vỏ cây nâu. Vòng lá bay quanh là art | Có ánh sáng/lá bay quanh không; hình chính là phủ màu lên sprite |
| fx_lao_hu | ch.70: lợn rừng lao thẳng, đâm gãy cây nhỏ. Bụi là art | — |
| fx_nguyet_mang | data.js: nguyệt nhận "vàng lam" | **Truyện tả màu Nguyệt Mang thế nào** (data.js có thể lệch truyện) |
| fx_huyet_nguyet | data.js: nguyệt nhận đỏ như máu, vết thương chảy máu không khép | Chương PN có/dùng Huyết Nguyệt, màu thật |
| fx_st_hoa_tuong | ch.462–463: Điểm Kim bắn trúng biến thành tượng vàng. "Vỡ khi trúng đòn" là game | Màu vàng kim, quá trình hóa tượng tả thế nào |
| fx_cuxi | ch.186–188: rết vàng răng cưa, hai hàng răng | Khớp dossier/base của Blue |
| fx_huyet_buc | ch.186: trăm con dơi máu đuổi theo | Hình cánh dao (Đao Sí) có tả không |
| fx_ran_lua | ch.375–377: Viêm Đột điều khiển hai rắn lửa, phồng to rồi đánh | Màu lửa, có vảy/đầu rõ không |
| fx_o_that | ch.462: Ô Thất là khói đen, phong cấm cổ trong vùng | Màu khói, có hình phòng/khối không (tên "Ô Thất" = phòng đen) |
| fx_tran_ma_chain | ch.196: Trấn Ma Thiết Tác | Màu xích, có phù văn không; cơ chế trói + trấn áp không khiếu (dossier đợt 2) |

**Thêm:** các mục ghi `art` (trúng đòn chung, hấp thu nguyên thạch, icon trạng thái, Huyết Khôi/Tửu Khôi/Huyết Thủ) không cần nguồn truyện. Nhưng nếu Blue thấy truyện có tả (vd hình ảnh hấp thu nguyên thạch) thì ghi chương vào.

## 2. Kỹ thuật cần Blue làm (importer)
1. **`fx_import.py` thêm hai tùy chọn sidecar:**
   - `center_on`: căn mỗi frame theo tâm vùng màu chỉ định, vd giấy vàng của phong cấm v2 (frame lệch 14→43px);
   - `min_blob`: xóa mảnh rời nhỏ hơn N px (mẩu khói bị cắt ở frame 3).

   Kèm regression.
2. **Thu nhỏ + palette trong importer FX:** hiện `fx_import.py` không resize, ảnh Muse 800px/frame. Gộp bước Orange đã chạy thử: unkey 90 → BOX về ô đích → 16 màu chung cả clip (`pixel_normalize.py`). Ô đích lấy theo cột "Cell" trong brief.
3. **Vòng trói (`fx_st_troi`):** Muse vẽ vòng chính diện. Ghi `display_scale_y: 0.35` vào manifest để view ép dẹt, không gen lại.
4. **Nhập 6 FX đã đạt** (`previews/fx-trial-v1`) bằng sidecar chuẩn vào vùng review; `--approve` khi người dùng duyệt. Orange nối runtime.

## 3. Hợp đồng runtime (để clip/FX không phải làm lại)
Theo `previews/blue-handoff-v05/README.md` §4 và plan trạng thái §7:
- **Event:** `release` (đạn, cận chiến), `zoneFire` (vùng), `status`/`statusEnd` (icon trạng thái), `summonSpawn` (con cổ, đợt 2).
- **Neo:**
  - đạn và chiêu tay: `hand`;
  - Lam Điểu: `mouth`;
  - vùng: tâm vùng trên đất;
  - icon trạng thái: đỉnh đầu;
  - trói: dưới chân;
  - hào quang: thân.
- Blue thêm anchor `hand/mouth` cho clip phát chiêu khi làm clip mới.

## 4. Blue trả lời
_(Blue ghi kết quả đối chiếu và thay đổi ở đây.)_
