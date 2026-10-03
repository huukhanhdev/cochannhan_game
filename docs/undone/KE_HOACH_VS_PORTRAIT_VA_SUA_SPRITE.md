# Kế hoạch: base làm ảnh VS, sprite trong trận giữ kiểu v01, chỉ gen lại bản lỗi

Orange-kun lập, 03/10/2026. **Blue-chan làm** (prompt, gen, import); Orange review.

## 0. Người dùng chốt
- **Base** (bộ v03 và pilot phong cách chibi_ref) dùng làm **ảnh VS trước trận**: hai bên đứng đối mặt nhau.
  - Người chơi đứng trái, nhìn sang phải.
  - Đối thủ đứng phải, lật ngang.
  - Base vẫn là pixel art. Đồng thời là **nguồn danh tính** (mặt, tóc, áo, giải phẫu) cho sprite trong trận.
- **Sprite trong trận** giữ kiểu hiện tại (`assets/chibi_kp`, review ở `previews/roster-validation-v01`): chibi key-pose nhỏ, người dùng thấy ổn.
- Chỉ **sửa prompt rồi gen lại** những bộ xấu hoặc sai. Bộ đạt thì giữ nguyên.

## 1. Vì sao có bộ lỗi (nguyên nhân gốc)
1. **Ảnh tham chiếu sai truyện.** Prompt v01 lấy `assets/chibi_ref/<id>.png`, mà nhiều ảnh trong đó sai truyện, nên sprite sai theo. Ví dụ:
   - Thạch Hầu thành khỉ đột đá;
   - Phỉ Hầu thành hổ vàng lông toàn thân;
   - Thiết Huyết Lãnh không đeo mặt nạ.
2. **Câu prompt tự gây lỗi.** Trần Thúy Hoa có dòng `pale greenish sickly face` nên ra da xanh như xác sống. Phỉ Hầu có dòng `yellow fur with black stripes` cho cả thân.
3. **Nền xanh lá #00FF00** để lại viền xanh, lẫn với tóc và áo xanh thật (gia lão, Phương Chính, Thanh Thư).
4. **Không khóa màu giữa các clip.** Áo Phương Chính đổi tím ↔ xanh giữa các clip.
5. **Vẽ sẵn FX hoặc đạo cụ vào thân:** hạt độc (cương thi), bụi (Thiết Bá Tu), dao (Kim Sinh).
6. **Thú bị vẽ kiểu thú bông:** đầu to, chân tay nhỏ (Phỉ Hầu, Phi Tượng, cá sấu dung nham, Hiên Viên Thần Kê).

## 2. Sửa khung prompt (áp cho mọi lượt gen lại)

**Ảnh tham chiếu: hai ảnh, vai trò ghi rõ trong prompt**
- Ảnh 1 = **danh tính**: base **v04** (phong cách pilot, người dùng đã chọn 03/10) của chính nhân vật, sau khi Orange duyệt, thu nhỏ còn cao khoảng 256px. Con nào v04 chưa có thì tạm dùng v03. Không dùng chibi_ref cho các con ở mục 3a.
- Ảnh 2 = **phong cách**: một sheet v01 đã đạt (`assets/chibi_kp/heo_rung/atk.png` cho thú, `assets/chibi_kp/phuong_nguyen/idle.png` cho người).
- Câu bắt buộc:
  ```text
  Image 1 defines WHO the character is (face, hair, outfit colors, anatomy). Image 2 defines ONLY the sprite style (chibi key-pose size, outline, shading). Do not copy the character from image 2.
  ```

**Khối chung, thay hai dòng trong `PROMPT_MUSE_ROSTER.md` §1:**
```text
Background: solid flat pure magenta #FF00FF only (no green). No shadow on the background.
No particles, dust, smoke, glow, motion lines or magic effects. No weapon or held object unless the Character line names one.
```

**Khóa màu:** dòng `Character` ghi 4–6 mã hex lấy từ base đã duyệt. Ví dụ:
```text
Palette lock: robe #6E8FB8, sash #2F3C55, hair #1C1C22, skin #E8C8A8
```
Thứ tự làm mỗi nhân vật:
1. Gen `idle` trước.
2. Orange duyệt `idle`.
3. Dùng `idle` đã duyệt làm ảnh 1 cho các clip còn lại, cùng seed.

**Thú (không vẽ kiểu thú bông):**
```text
Naturalistic animal proportions scaled down as a sprite: head NOT oversized, heavy limbs, no cute mascot face, no chibi baby proportions.
```
Người vẫn giữ chibi như v01.

**Câu prompt không được tự mâu thuẫn:** không mô tả màu da hay lông trái với base. Muốn tả da bệnh thì dùng `sallow yellowish pale skin (NOT green)`.

## 3. Danh sách bộ cần làm lại

### 3a. Ưu tiên 1: sai truyện (có trong sandbox hoặc sắp vào)
| id | Lỗi ở sprite v01 | Dòng Character mới (danh tính theo base v03) | Clip |
|---|---|---|---|
| tran_thuy_hoa | da xanh như xác sống | `adult peasant woman, weary and sickly, sallow yellowish pale skin (NOT green), black-grey hair in a plain low bun, patched faded brown tunic and loose trousers, straw shoes, bare hands, slightly stooped` (VN ch.222: nông phụ) | cả bộ |
| thach_hau | khỉ đột bằng đá | `small agile living monkey, ash-grey fur, jade green eyes, slim limbs, ONE long very flexible tail, two arms two legs, not a stone golem` (VN ch.79: thịt máu, chết mới hóa đá) | cả bộ |
| phi_hau | hổ vàng lông toàn thân, tay nhỏ | `giant bandit ape, bare brown skin on head, shoulders, arms and upper torso; golden fur with black tiger stripes ONLY from the waist down and on the tail; upper arms twice as thick as the thighs` (VN ch.266–268) | cả bộ |
| phi_tuong | voi trắng trơn, không lông chim, thiếu `hit` | giữ dòng hiện có ở §4.18, cộng câu cho thú ở §2, ảnh 1 là base v03 | cả bộ + `hit` |
| thiet_huyet_lanh | không mặt nạ, thiếu `ko` | `tall upright older detective, ancient bronze-green Thanh Dong mask with openings for eyes and lips, pale ears visible, greying tied hair, dark robe and light armor, a short iron chain` (VN ch.170) | cả bộ + `ko` |
| ca_sau_dung_nham | khối đỏ đầu to | `huge low four-legged crocodile, dark red armored scales, copper eyes, long heavy tail, TWO volcano-like bumps with openings on the back` (VN ch.216–217) | cả bộ |
| hien_vien_than_ke | gà con kiểu linh vật, chỉ có idle/warn | `enormous proud rooster, tall golden comb, iridescent five-colored plumage, long elaborate tail, two strong legs` (VN ch.217–218: giết cá sấu dung nham) | idle, move, hit, ko, `atk` (mổ), `sk_kick` (đá cựa). Truyện chỉ nói thần gà đánh chết cá sấu; cách mổ và đá cựa là art |

### 3b. Ưu tiên 2: lỗi kỹ thuật, giữ danh tính
| id | Việc |
|---|---|
| phuong_chinh | Khóa áo xanh nhạt theo base, sửa màu từng clip, giữ pose |
| thiet_ba_tu | `atk` frame phát đòn thành nắm đấm; `move` bỏ bụi vẽ sẵn |
| cuong_thi | `sk_poison` bỏ hạt độc trên thân; độc do code vẽ |
| xich_thanh | Dáng thấp bé, đầu to hơn; đổi màu áo khác Kim Sinh (base v03 dùng xanh xám). Truyện: thấp bé, mặt rỗ (ch.4) |
| hoc_duong_gia_lao, thanh_thu | Chỉ import lại nền magenta để hết viền xanh; không gen lại |

### 3c. Ưu tiên 3: lệch danh tính so với ref, ghép theo base v03 khi tới đợt
bach_chien_liep, cu_khai_bi, han_bat_luu, hoanh_mi, tiet_tam_tu, vu_quy, thiet_nhuoc_nam. Dùng `body_spec` trong `previews/roster-base-v03/catalog.json` làm dòng Character. Làm khi nhân vật đó vào battle (đợt 3–4); chưa cần làm ngay.

### Giữ nguyên
phuong_nguyen, bach_ngung_bang_nam/nu, heo_rung, dien_lang, dian_lang_boss, hac_hung, mac_bac, au_duong_cong, bach_chien_on, bach_lien, ca_sau_sau_chan, nhat_dai_boss, thiet_dao_kho, thiet_mo_bach, viem_dot.

**Không làm:**
- `co_kim_sinh` và `hoc_duong_gia_lao` không giao chiến trong truyện (B1), nên không sửa `atk` của Kim Sinh.
- `ba_quy_spirit` là NPC.
- `tuu_khoi_huyet_khoi` và `huyet_thu_ma_tu` chờ người dùng quyết.

## 4. Ảnh VS (từ base)
- Nguồn: base v04 (`previews/roster-style-v04`), người dùng đã chọn phong cách pilot.
- Xuất `assets/vs/<id>.png`:
  - alpha thật, cắt sát;
  - quay phải;
  - cao 512px, thu bằng BOX rồi quantize 32 màu (cùng bước đã thử ở pilot);
  - đứng toàn thân; thú để ngang.
- Ảnh base của con nào sai truyện (mục 3a) thì sửa base trước, vì ảnh VS và sprite trong trận dùng chung danh tính.
- Code (Orange làm khi có ảnh):
  - `SB_SPRITES` thêm `portrait(visual)`.
  - `battle_sandbox` hiện màn VS khoảng 1,5s trước trận: trái người chơi, phải đối thủ lật ngang, tên và mốc chương.
  - Thiếu ảnh VS thì dùng frame idle phóng to.

## 5. Orange review mỗi bộ
1. Danh tính khớp base và dossier (mặt, màu, giải phẫu); không còn lỗi ở mục 1.
2. Màu giữa các clip lệch không quá vài mã hex khóa.
3. Không có FX, bụi hay đạo cụ ngoài danh sách.
4. Import v2 sạch viền (magenta), anchor đúng chỗ (tay, mõm, cựa), hover đúng chỗ.
5. Chơi trong sandbox:
   - mirror;
   - frame phát đòn khớp hitbox;
   - KO ở sát biên.

   Không nghiệm thu bằng contact sheet.

Thứ tự đề nghị: ưu tiên 1, làm Trần Thúy Hoa, Thạch Hầu, Thiết Huyết Lãnh trước (đi qua đủ các kiểu lỗi), rồi tới phần còn lại.


## 6. Blue cập nhật base sau review v04 — 03/10/2026

Đã sửa sáu ảnh người và tạo chín thú còn lại. Catalog v04 hiện có **38/40 base**, hai ID chưa quyết vẫn chờ. [Bàn giao và giới hạn](../../previews/roster-style-v04/README.md), [so sáu bản trước/sau](../../previews/roster-style-v04/compare_review_02.html), [prompt/input 15 job](../../previews/roster-style-v04/review_pass_02_jobs.json).

Đây là base trong vùng review, chưa xuất `assets/vs`, chưa tạo clip sprite hoặc thay bộ đang chạy. Orange cần kiểm lại các bản sửa và lô thú mới trước khi chọn làm ref cho các bộ sprite ưu tiên 1. Ảnh cũ và catalog v03 giữ nguyên. Một số thú vẫn thiên góc nghiêng; palette/alpha cần chuẩn hóa ở importer, không gọi ảnh gốc là native pixel art.
