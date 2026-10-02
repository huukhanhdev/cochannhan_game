# Hướng dẫn tạo hàng loạt sprite key-pose cho các nhân vật còn lại

Ngày 02/10/2026. Tài liệu này dành cho người hoặc AI khác tiếp tục làm sprite battle cho 37 nhân vật còn lại.

**Mẫu đã đạt:** Phương Nguyên, 11 động tác, sheet ở `assets/chibi_kp/phuong_nguyen/`. Xem trực tiếp ở `keypose_preview.html` (bấm "Diễn đủ bộ").

Đọc hết mục 1–3 trước khi tạo ảnh. Chỉ dùng **chung một mô hình tạo ảnh** cho cả bộ. Mẫu Phương Nguyên làm bằng **Muse AI**.

---

## 1. Nguyên tắc

| Làm | Không làm |
|---|---|
| Mỗi lần tạo **1 ảnh ngang chứa 2–3 tư thế** của **một** động tác, xếp trái → phải, cách nhau rộng | Không tạo từng frame riêng lẻ; không tạo chuỗi 8 frame liên tục |
| Tư thế phải rõ ràng: tô đen cả người vẫn phân biệt được lấy đà / ra đòn / thu chiêu | Không yêu cầu "cử động nhẹ", "gần như không xoay vai" |
| Chỉ vẽ nhân vật; nền phẳng `#00FF00` hoặc trong suốt | Không vẽ hiệu ứng chiêu: lửa, băng, sét, hào quang, đạn, giáp sáng. Code game tự vẽ |
| Prompt ngắn, dưới khoảng 120 từ; mô tả nhân vật đặt ngay đầu | Không dán bộ prompt dài 1.500 từ cũ (`PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md`) vào máy tạo ảnh |
| Thứ cần tránh ghi vào ô **negative prompt** | Không viết "no grid, no sheet, no duplicate" trong prompt chính. Máy tạo ảnh đọc thấy từ nào sẽ dễ vẽ ra thứ đó |
| Không có động tác chạy. Di chuyển dùng tư thế lướt (`move`) | Không làm `run` |

Vì sao làm vậy:

- Vẽ nhiều tư thế trong cùng một ảnh thì mặt, tóc, áo đồng nhất hơn hẳn vẽ riêng từng frame.
- Các tư thế khác nhau rõ thì không cần frame trung gian liền mạch. Frame trung gian là phần AI luôn làm hỏng (5 lần thử trước đều thất bại).

Script `tools/keypose_import.py` tự làm phần còn lại:

1. Xóa nền.
2. Tách từng tư thế.
3. Đưa về cùng cỡ người.
4. Đặt chân lên cùng vạch sàn.
5. Ghép sheet và ghi `manifest.json`.

## 2. Chuẩn bị ảnh tham chiếu

Mỗi nhân vật có ảnh gốc ở `assets/chibi_ref/<id>.png` (256×256). Chỉ dùng ảnh này để giữ tạo hình, không dùng các frame animation cũ trong thư mục đó.

Phóng to ×4 trước khi upload, để Muse đọc rõ chi tiết:

```bash
python3 -c "import sys;from PIL import Image;i=Image.open(sys.argv[1]);i.resize((i.width*4,i.height*4),Image.NEAREST).save(sys.argv[2])" assets/chibi_ref/heo_rung.png /tmp/heo_rung_ref.png
```

Ngoại lệ:

| Nhân vật | Ảnh tham chiếu đúng |
|---|---|
| Phương Nguyên | `assets/chibi_ref/phuong_nguyen_full.png` (đã xong) |
| **Bạch Ngưng Băng Q1 (nam)** | `assets/chibi_ref/bach_ngung_bang_nam_full.png`. **Không dùng** `chibi_ref/bach_ngung_bang.png`, vì đó là bản nữ Q2 |

Cài đặt trên Muse:

- Tham chiếu nhân vật: độ bám **cao**. Nếu chỉ có image-to-image thì để strength khoảng 0,55–0,7.
- Tỷ lệ khung: **3:1** cho dải 3 tư thế, **2:1** cho dải 2 tư thế. Không có thì chọn 16:9 hoặc 21:9.
- Khóa seed nếu được, mỗi nhân vật một seed.
- Mỗi prompt tạo 2–4 ảnh, chọn ảnh giống ảnh gốc nhất.

## 3. Khung prompt

Ghép **3 khối**: chung + nhân vật (mục 5) + động tác (mục 4).

**Khối chung (người):**

```text
Pixel art game sprite sheet, chibi side-view character, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.
{NHÂN VẬT}
Exactly the same character as the reference image: same face, same hair, same outfit, same colors, same proportions, same pixel art style.
One single horizontal row, poses ordered left to right, all poses the same size standing on the same invisible ground line, full body visible, wide empty gap between poses.
Facing right in every pose. Fixed orthographic side view.
Background: solid flat pure green #00FF00.
{ĐỘNG TÁC}
```

**Khối chung (thú):** thay dòng đầu bằng:

```text
Pixel art game sprite sheet, side-view animal sprite, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.
```

**Negative chung:**

```text
blurry, 3d render, realistic, painterly, extra limbs, extra fingers, extra heads, overlapping characters, different face, different hairstyle, text, letters, watermark, border, grid lines, gradient background, floor, shadow, scenery, cropped feet, cropped head, glow, magic effect, particles, motion lines, weapon
```

Cộng thêm các từ negative riêng của từng nhân vật ở mục 5.

## 4. Thư viện động tác

Tên file động tác **phải đúng** như cột "action", vì script nhận diện theo tên.

### 4.1. Người

| action | Tư thế | Dòng `{ĐỘNG TÁC}` |
|---|---|---|
| idle | 2 | `Poses: 2 poses of a calm idle stance, almost identical. Pose 1: standing relaxed, arms at the sides. Pose 2: same stance breathing in, shoulders slightly raised, hair hanging down with only the tips slightly lifted.` |
| attack | 3 | `Poses: 3 poses of a fast unarmed strike. Pose 1 (wind-up): torso twisted back, right arm drawn back behind the shoulder, weight on back foot. Pose 2 (strike): lunging forward, right palm fully extended forward, front knee bent. Pose 3 (recover): pulling the arm back, returning to a fighting stance.` |
| cast | 3 | `Poses: 3 poses of casting a ranged attack from the palm. Pose 1: knees bent, right hand pulled back near the hip, left hand forward. Pose 2: leaning forward, right arm fully extended straight forward at shoulder height, open palm facing right, hair flowing back. Pose 3: arm still forward but lowered, body upright.` |
| heavy | 3 | `Poses: 3 poses of a powerful overhead swinging attack. Pose 1: right arm raised high behind the head, body arched back. Pose 2: arm swung down and forward in a big arc, deep wide stance. Pose 3: arm low at the end of the swing, crouched, looking up at the enemy.` |
| guard | 2 | `Poses: 2 poses of a defensive stance. Pose 1: both forearms crossed in front of the face, knees bent. Pose 2: same braced stance pushed back a little, head lowered behind the arms.` |
| heal | 2 | `Poses: 2 poses of meditative recovery. Pose 1: standing upright, eyes closed, right hand on the chest. Pose 2: same pose, chin slightly raised, breathing out, shoulders relaxed.` |
| hit | 2 | `Poses: 2 poses of being struck from the right. Pose 1: upper body jerked backward, head tilted back, eyes shut, arms flung out. Pose 2: hunched forward, one hand on the stomach, gritting teeth.` |
| move | 2 | `Poses: 2 poses of a martial-arts dash. Pose 1: leaning far forward, low, arms trailing behind, hair and clothes streaming back. Pose 2: skidding to a stop, front knee bent, leaning back to brake, one hand forward.` |
| dodge | 2 | `Poses: 2 poses of dodging backward. Pose 1: jumping backward, body leaning back, arms raised. Pose 2: landing in a low crouch, one hand touching the ground.` |
| ko | 3 | `Poses: 3 poses of being defeated. Pose 1: staggering, knees buckling, head drooping. Pose 2: fallen on one knee, one hand on the ground, head down. Pose 3: collapsed lying on the ground on the side, eyes closed.` |
| win | 1 | `Pose: standing tall and confident, small satisfied expression.` (sửa theo tính cách nhân vật) |

Đổi động tác theo kiểu đánh của nhân vật. Ví dụ:

- Thiết Đao Khổ: `attack` là chém bằng cạnh bàn tay.
- Thiết Huyết Lãnh: `heavy` là quất xích sắt.
- Phụ nữ hoặc người già: giảm độ nhảy ở `dodge`.

Không thêm vũ khí nếu ảnh gốc không có.

### 4.2. Thú

| action | Tư thế | Dòng `{ĐỘNG TÁC}` |
|---|---|---|
| idle | 2 | `Poses: 2 poses of standing alert on all legs, almost identical. Pose 2: head slightly lowered, breathing.` |
| attack | 3 | `Poses: 3 poses of a lunging bite/charge. Pose 1: crouched back on hind legs, head low, ready to pounce. Pose 2: leaping or charging forward, mouth open, front legs extended. Pose 3: landing, head swinging, recovering.` |
| cast | 3 | Chỉ cho thú có chiêu riêng. Ví dụ Điện Lang: `Pose 1: head lowered. Pose 2: head thrown up howling, mouth wide open. Pose 3: head coming down, snarling.` |
| hit | 2 | `Poses: 2 poses of being struck from the right. Pose 1: head and body recoiling backward, eyes shut. Pose 2: staggering, legs splayed, head shaking.` |
| ko | 2 | `Poses: 2 poses of collapsing. Pose 1: legs buckling, body sinking. Pose 2: lying on its side on the ground, eyes closed.` |

### 4.3. Không phải boss đánh thường

| action | Tư thế | Dòng `{ĐỘNG TÁC}` |
|---|---|---|
| idle | 2 | Như idle ở trên |
| warn | 2 | `Poses: 2 poses of a warning display. Pose 1: rising up tall, puffing up. Pose 2: leaning forward threateningly.` |

### 4.4. Gói động tác theo nhóm

| Nhóm | action cần làm |
|---|---|
| **A: Đầy đủ** | idle, cast, attack, heavy, guard, heal, hit, move, dodge, ko, win |
| **B: Đối thủ người** | idle, attack, cast, guard, hit, ko |
| **B+: Boss người** | Như B, thêm heavy |
| **C: Thú** | idle, attack, hit, ko |
| **C+: Boss thú** | Như C, thêm cast |
| **D: Không chiến đấu** | idle, warn |

## 5. Danh sách nhân vật

Rút từ mục IDENTITY của bộ prompt cũ, đã chuyển thành **mô tả nhìn thấy được**. Cột "id" dùng để đặt tên file. Nếu ảnh gốc khác mô tả thì **ưu tiên ảnh gốc**, trừ những điều ghi trong cột negative.

Thứ tự ưu tiên: (1) Bạch Ngưng Băng nam, Điện Lang, Nhất Đại, Thiết Huyết Lãnh → (2) các nhân vật Q1 → (3) các nhân vật Q2.

| # | id | Nhóm | `{NHÂN VẬT}` | Negative riêng |
|---|---|---|---|---|
| 1 | `phuong_nguyen` | A | **Xong** | |
| 2 | `bach_ngung_bang_nam` | A | `Character: 15-year-old boy (male), very long silver-white hair with a silver hair ornament, ice-blue eyes, arrogant playful grin, white robe with blue snowflake patterns, bare hands.` | female, girl, breasts, makeup, sword |
| 3 | `phuong_chinh` | B | `Character: 14-year-old boy, short neat black hair, earnest honest face, green training robe, bare hands.` | sword, long hair |
| 4 | `thanh_thu` | B | `Character: young man about 20, black hair tied back, gentle calm face, dark green robe, bare hands.` | vines, tree, wood armor |
| 5 | `mac_bac` | B | `Character: proud teenage boy, short dark hair, arrogant sneer, warm brown training clothes, bare hands.` | weapon |
| 6 | `xich_thanh` | B | `Character: small wary teenage boy, neat dark hair, ochre robe, bare hands.` | water |
| 7 | `thiet_huyet_lanh` | B+ | `Character: stern mature man about 45, short black hair, upright posture, dark armor with a dark cloak, holding a short iron chain in the front hand.` | lightning, sword, needles |
| 8 | `thiet_nhuoc_nam` | B | `Character: determined young woman about 18, dark hair tied in a high ponytail, practical dark armor, bare hands.` | needles, sword, male |
| 9 | `dian_lang_boss` | C+ | `Animal: huge four-legged wolf king, blue-grey fur, jagged spiky mane along the back, long muzzle, glowing blue eyes, side view facing right.` | standing on two legs, human hands, lightning |
| 10 | `nhat_dai_boss` | B+ (thêm cast) | `Character: ancient corpse-like elder, gaunt grey skin, long tangled grey hair, ragged dark-red robes, hovering slightly above the ground.` | wings, fangs, bats |
| 11 | `thiet_ba_tu` | B+ | `Character: massive muscular mature man, short hair, stern face, practical dark armor, bare hands.` | boulder, weapon |
| 12 | `vu_quy` | B+ (thêm cast) | `Character: gaunt sinister old man, thin face, dark loose robe.` | staff, skull, skeleton |
| 13 | `cu_khai_bi` | B+ | `Character: very tall muscular fighter, heavy pale ivory armor, disciplined stance, bare hands.` | rock shield, giant |
| 14 | `bach_chien_liep` | B | `Character: lean young man, dark hair, vengeful eyes, practical pale-blue clothes, bare hands.` | bow, crossbow |
| 15 | `bach_lien` | B | `Character: composed young woman, modest light-colored robes, calm face, bare hands.` | lotus, flowers, fan, male |
| 16 | `thiet_mo_bach` | B (thêm cast) | `Character: venerable old master, long white beard, formal muted-gold robe.` | sword |
| 17 | `ba_quy_spirit` | D | `Animal: ancient weary giant turtle, rigid shell, four limbs, short neck, intelligent gaze, side view facing right.` | human, weapon |
| 18 | `heo_rung` | C | `Animal: stocky wild boar, coarse brown-black bristles, short strong neck, curved yellow tusks, side view facing right.` | human hands |
| 19 | `hac_hung` | C | `Animal: heavy black bear on four legs, thick black fur, rounded ears, broad muzzle, large forepaws, side view facing right.` | standing upright |
| 20 | `thach_hau` | C | `Animal: small agile monkey with stone-grey fur, two arms, two legs, one tail, side view facing right.` | rock golem, extra tail |
| 21 | `ca_sau_sau_chan` | C | `Animal: long armored crocodile king with exactly six legs (three pairs), long toothy muzzle, heavy tail, side view facing right.` | four legs, wings |
| 22 | `ca_sau_dung_nham` | C+ | `Animal: four-legged crocodile with dark volcanic scales and glowing ember markings, side view facing right.` | fire body, flames |
| 23 | `hien_vien_than_ke` | D | `Animal: enormous proud rooster with five-colored plumage, two legs, two feathered wings, ornate tail, side view facing right.` | human |
| 24 | `phi_hau` | C | `Animal: giant striped ape, huge arms with upper arms thicker than thighs, two legs, side view facing right.` | small monkey, weapon |
| 25 | `phi_tuong` | C | `Animal: white flying elephant with white fur, four legs, one trunk, two tusks, hovering above the ground, side view facing right.` | wings, feathers |
| 26 | `cuong_thi` | C (dáng người) | `Character: stiff corpse-like zombie humanoid, long white hair, grey skin, torn dark clothes, arms stretched forward.` | black hair (khi làm bản lông trắng) |
| 27 | `tuu_khoi_huyet_khoi` | C (dáng người) | `Character: squat clay humanoid puppet made of cracked wine-jar clay.` (bản Tửu Khôi) | blood, red (khi làm bản Tửu Khôi) |
| 28 | `co_kim_sinh` | B | `Character: scheming young male merchant, dark hair, sly smile, ochre traveling robe, bare hands.` | sword |
| 29 | `huyet_thu_ma_tu` | B | `Character: hostile demonic cultivator, ragged dark-red robe, exposed forearms stained red, fierce face.` | weapon |
| 30 | `tran_thuy_hoa` | idle, cast, hit, ko | `Character: middle-aged peasant woman, patched brown clothes, pale sickly face.` Cast: `crouching and placing something on the ground with both hands` | fireball, male |
| 31 | `au_duong_cong` | B | `Character: authoritative middle-aged merchant, dark beard, broad purple sleeves, bare hands.` | insects, weapon |
| 32 | `bach_chien_on` | B | `Character: elderly man, grey hair, sober white-and-grey clan robes, bare hands.` | fire body |
| 33 | `viem_dot` | B (thêm cast) | `Character: thin wizened old man like a beggar, sparse hair, long fingernails, ragged clothes.` | muscular, red hair, tattoos |
| 34 | `thiet_dao_kho` | B+ | `Character: resolute adult man, practical dark armor, hand held flat like a blade.` | sword, saber, knife |
| 35 | `hoanh_mi` | B+ | `Character: bulky brutish man with a broad brow, rough sleeveless clothes, swaggering.` | giant, weapon |
| 36 | `tiet_tam_tu` | B | `Character: athletic woman, hair tied back, practical dark clothes, bare hands.` | wings, tiger, male |
| 37 | `han_bat_luu` | B | `Character: weathered middle-aged man about 48, practical traveling clothes, stern face.` | dogs, bell, staff, old wizard |
| 38 | `hoc_duong_gia_lao` | B (thêm cast) | `Character: stern elder teacher, grey hair, dark green formal robe.` | weapon |

`cuong_thi` và `tuu_khoi_huyet_khoi` có hai biến thể. Mỗi lượt chỉ làm **một** biến thể. Muốn làm biến thể thứ hai thì đặt id mới (ví dụ `cuong_thi_hac`) và ghi thêm vào `PREFIX` trong script.

## 6. Nhập ảnh vào game

1. Lưu ảnh vào `incoming_sprites/` với tên `<id>_<action>_v<N>.png`, ví dụ `heo_rung_attack_v1.png`.
   - Riêng Bạch Ngưng Băng Q1 dùng tên viết tắt `bnb_<action>_vN.png`; script tự đổi thành id `bach_ngung_bang_nam`.
   - Làm lại thì tăng số `vN`; script tự dùng bản mới nhất.
2. Chạy:

   ```bash
   python3 tools/keypose_import.py            # xử lý toàn bộ incoming_sprites/
   python3 tools/keypose_import.py --report   # in cao x rộng từng tư thế
   ```

3. **Đưa các động tác về cùng một cỡ.** Script đo khuôn mặt (vùng da lớn nhất) để quy đổi. Khi mặt bị che, quay nghiêng hoặc là thú thì kết quả đo sai. Lúc đó sửa `SCALE_FIX` ở đầu `tools/keypose_import.py`:

   ```python
   SCALE_FIX = {'heo_rung_ko_v1.png': .85, ...}   # <1 thu nhỏ, >1 phóng to
   ```

   Chuẩn so sánh là tư thế **idle**. Tư thế đứng thẳng của động tác khác (cuối `cast`, `win`, `heal`) phải cao bằng idle, sai lệch dưới 5%. Tư thế cúi hoặc khom thì thấp hơn idle. Mẫu Phương Nguyên: idle cao 140px, `guard` khom 126–129px.

   Thú không có mặt, nên script lấy theo cỡ "điểm ảnh" của pixel art. Khi đó phải chỉnh `SCALE_FIX` để mọi động tác của **cùng một con** cao bằng idle của nó.
4. **Nhân vật to hoặc dài** (Điện Lang, Phi Tượng, cá sấu, Hắc Hùng, Nhất Đại) cần khung lớn hơn 288×208 mặc định. Thêm vào `FRAME_BY_ID`:

   ```python
   FRAME_BY_ID = {'dian_lang_boss': ((384, 240), (192, 230))}   # (rộng, cao), (pivot x, y chân)
   ```

   Khi script báo `! pose ... tràn khung` thì tăng khung.
5. **Kiểm tra bằng mắt:**
   - Mở `keypose_preview.html` qua server local, ví dụ `python3 -m http.server 8765` rồi vào http://localhost:8765/keypose_preview.html.
   - Hiện trang này cố định nạp `phuong_nguyen`. Để xem nhân vật khác, sửa dòng `const BASE='assets/chibi_kp/phuong_nguyen/'`.
   - Nên đổi trang thành đọc tham số `?id=` khi bắt đầu làm hàng loạt.

## 7. Tiêu chí duyệt

Loại và tạo lại nếu gặp một trong các lỗi:

- Mặt, kiểu tóc hoặc màu áo khác ảnh gốc.
- Đổi giới tính. Đặc biệt kiểm tra Bạch Ngưng Băng Q1 phải là nam.
- Thừa hoặc thiếu tay, chân, đầu. Cá sấu sáu chân phải đủ 6 chân.
- Hai tư thế dính vào nhau. Script sẽ tách thiếu số tư thế, xem cột cao x rộng trong `--report`.
- Có chữ, khung, lưới hoặc hiệu ứng phép trong ảnh.
- Nhân vật quay mặt về phía người xem ở idle, attack hoặc cast. Riêng `hit` được phép.
- Tư thế quá giống nhau, nhìn bóng đen không phân biệt được.

Không cần hoàn hảo: lệch vị trí, lệch cỡ nhẹ, nền hơi loang, viền xanh mỏng đều đã có script xử lý.

## 8. Kết quả bàn giao

Mỗi nhân vật cần có:

- `assets/chibi_kp/<id>/<action>.png` (sheet ngang) và `assets/chibi_kp/<id>/manifest.json`.
- Ảnh gốc trong `incoming_sprites/`. Thư mục này không cần commit lên GitHub Pages.

Báo lại cho chủ dự án:

- Nhân vật đã xong.
- Động tác còn thiếu.
- Các giá trị `SCALE_FIX` và `FRAME_BY_ID` đã thêm.
- Những ảnh tạo lại nhiều lần vẫn chưa đạt.

## 9. Việc code còn lại

Hiện chỉ Phương Nguyên được nối vào trận (`js/battle.js`: `loadKP('phuong_nguyen')`, `kpPlay`, `kpHand`, `kpFlash`).

Để kẻ địch dùng sprite mới thì cần:

1. Ánh xạ khóa kẻ địch trong `EN` (ví dụ `heorung`, `loiquan`) sang id sprite (`heo_rung`, `dian_lang_boss`).
2. Dựng `E.kp` giống `P.kp`, lật ngang (`scale.x` âm).
3. Gọi `kpPlay(E, ...)` trong `eatk`, `hit` và `ko`.

Làm phần này sau khi có ít nhất 3–4 kẻ địch đã duyệt. Nhân vật nào thiếu sheet vẫn dùng tranh cũ.

## 10. Review và đề xuất sửa trước khi tạo hàng loạt — Codex, 02/10/2026

Phần này là review và đề xuất, **chưa phải các sửa đổi đã triển khai trong importer hoặc battle**. Các quy tắc ở mục 1–9 có xung đột được ghi dưới đây cần sửa trước khi dùng làm hợp đồng sản xuất. Không lấy việc có đủ sheet hoặc chạy hết preview làm bằng chứng đã được người dùng duyệt.

### 10.1. Vấn đề chính: không phải ai cũng đánh bằng chưởng

Gói B hiện bắt buộc `cast`, còn prompt `cast` mặc định là duỗi bàn tay bắn chiêu. Cách này dễ biến người chỉ đánh cận chiến, thú húc/cắn và nhân vật dùng vũ khí thành cùng một kiểu đánh. **Không tạo pose chưởng cho nhân vật không có chiêu tương ứng.** Có chiêu đặc biệt cũng không đồng nghĩa có đạn tầm xa: hồi phục, tru gọi bầy, tăng lực và uy áp có cách biểu diễn riêng.

Đề xuất xác định bộ pose từ **cơ chế chiêu và cách nhân vật thực hiện chiêu**, trước khi viết prompt. Đối chiếu `GU`, `EN`, `EAI`, `SK` trong `js/data.js`, sự kiện combat và tài liệu nhân vật. Các trường này chưa mô tả đầy đủ mọi tầm đánh/động tác; chỗ thiếu phải ghi cần xác nhận, không tự suy ra từ tên chiêu hoặc tự thêm kỹ năng để đủ gói.

| Cơ chế | Pose nên tạo | Có bắt buộc `cast` không? |
|---|---|---|
| Đánh tay không cận chiến | Lấy đà → đấm/chém cạnh tay/chỏ theo nhân vật → thu đòn | Không |
| Vũ khí cận chiến đã có trong thiết kế | Lấy đà → chém/quất/đâm → thu vũ khí | Không; giữ đúng vũ khí tham chiếu |
| Thú húc, cắn, vồ | Dồn trọng tâm → húc/cắn/vồ → hồi thế | Không |
| Bắn chiêu từ bàn tay | Chuẩn bị tay → phát chiêu → hồi thế | Có, nếu nhân vật có chiêu này |
| Tru, phun, phát chiêu từ miệng | Chuẩn bị đầu/cổ → tru/phun → hồi đầu | Chỉ khi có kỹ năng tương ứng; không dùng prompt bàn tay |
| Gọi bầy, tăng lực, uy áp | Tư thế kích hoạt phù hợp cơ thể và tính cách | Không mặc định là bắn đạn |
| Đặt vật hoặc tác động xuống đất | Cúi/chuẩn bị → đặt/chạm đất → thu tay | Dùng pose riêng cho kỹ năng đã xác định |
| Hồi phục/tái tụ | Thu người/tập trung hoặc tư thế phục hồi riêng | `heal` khi gameplay cần; không biến thành chưởng |

Ví dụ có căn cứ trong dữ liệu hiện tại: `EAI.heorung.sk='charge'` là húc; `EAI.dienlang.sk='howl'` là tru gọi bầy; `EAI.hachung.sk='rage'` là tự tăng lực; `EAI.tuukhoi.sk='regen'` là tái tụ. Các kỹ năng này không nên cùng dùng hình duỗi tay phóng Nguyệt Quang. Nguyệt Quang của PN là trường hợp có chiêu tầm xa được mô tả rõ trong `GU`.

### 10.2. Thay gói action cứng bằng bảng nhu cầu từng nhân vật

- Nhân vật chiến đấu: bắt đầu với `idle`, `attack`, `hit`, `ko`; thêm `guard`, `heavy`, `heal`, `move`, `dodge`, `win` theo hành vi thực sự cần trong battle.
- `cast` là **tùy chọn**, không bắt buộc cho toàn bộ đối thủ người. Mỗi clip phải ghi rõ kỹ năng nào sử dụng nó và cơ chế phát chiêu.
- Nhân vật không chiến đấu: chỉ làm `idle`, thêm `warn` khi có cảnh dùng; không tạo bộ chiến đấu cho đủ số.
- Cương Thi và Tửu Khôi có gói nhỏ như nhóm C nhưng phải dùng prompt cơ thể dạng người, không ghép prompt thú bốn chân. Khỉ, vượn, gà và cá sấu sáu chân cũng cần mô tả vận động đúng giải phẫu riêng.
- Có thể dùng chung một clip cho nhiều chiêu **nếu cách thực hiện giống nhau**; khác màu VFX chưa cần clip mới. Nếu động tác khác rõ, đề xuất clip riêng. Tên mới như `howl` hoặc `cast_ground` cần được bổ sung vào importer, metadata và runtime trước; hiện script chỉ nhận action trong `TIMING`.

Trước mỗi nhân vật, lập bảng sau; đây là đề xuất bàn giao bổ sung, chưa phải schema runtime đang có:

| Nhân vật / khóa game | Kỹ năng hoặc sự kiện | Cơ chế, tầm tác động | Clip / số pose | Nơi phát chiêu | Marker | Căn cứ / trạng thái |
|---|---|---|---|---|---|---|
| PN | Nguyệt Quang | Đạn tầm xa | `cast` / 3 | Bàn tay phát chiêu | Release pose 2 | `GU.nguyetquang`; cần duyệt anchor |
| `heorung` | Húc thẳng | Húc cận chiến | `attack` / 3 | Đầu/nanh tiếp xúc | Contact pose 2 | `EAI.heorung`, `SK.charge` |
| `dienlang` | Tru gọi bầy | Kích hoạt gọi bầy | Clip tru / 3, tên cần bổ sung | Miệng | Activation pose 2 | `EAI.dienlang`, `SK.howl` |

Marker ở đây là mốc hình ảnh để engine đồng bộ sự kiện; không giao việc tính sát thương cho GIF. Hiện `release` của importer là chỉ số frame bắt đầu từ 0: pose 2 tương ứng giá trị `1`. Cần phân biệt release đạn, contact cận chiến và activation buff; không mặc định cả ba đều là chạm đối thủ.

### 10.3. Các rủi ro kỹ thuật phải xử lý

| Mức | Hiện trạng đã đọc trong code | Đề xuất fix |
|---|---|---|
| Cao | `clean()` xóa mọi pixel xanh đủ ngưỡng trên toàn ảnh và giảm kênh xanh cả phần còn lại | Có thể xóa áo xanh của Phương Chính/Thanh Thư/gia lão. Ưu tiên alpha thật; nếu chroma key, chọn màu nền không trùng palette và mask nền có kiểm tra. Không khử màu toàn nhân vật. Test giữ nguyên áo xanh trước khi batch |
| Cao | `process()` nhận số pose tách được rồi tự rút/kéo danh sách duration, không chặn sai số pose | Khai báo số pose kỳ vọng theo nhân vật/action, từ chối ghi đè sheet/manifest nếu sai. KO thú 2 pose và KO người 3 pose phải được hỗ trợ rõ |
| Cao | `to_frame()` cảnh báo tràn rồi vẫn xuất ảnh bị cắt | Dừng xuất clip lỗi, giữ bản trước. Kiểm tra đủ bốn mép, sửa khung/pivot rồi nhập lại |
| Cao | `kpPlay()` và `kpHand()` lấy clip/manifest từ `TX.kp` chung | Khi thêm `E.kp`, lưu bộ clip/manifest theo từng actor và đọc từ actor đó, tránh địch dùng dữ liệu PN |
| Vừa | Anchor `hand` được suy từ pixel ngoài cùng bên phải | Có thể trỏ vào xích, nanh, mõm hoặc vạt áo. Duyệt anchor theo bộ phận phát chiêu; hỗ trợ miệng/vũ khí/điểm chạm đất, không gọi tất cả là bàn tay |
| Vừa | Căn ngang theo tâm pixel ở bốn hàng cuối; pose nằm dùng tâm bbox | Đổi chân hoặc chuyển sang nằm có thể làm thân nhảy ngang. Kiểm tra điểm gốc cơ thể giữa pose; dùng registration riêng khi cần, không chỉ tâm chân/bbox |
| Vừa | Cỡ mặt dùng ngưỡng màu da; thú có thể bị nhận nhầm vùng sáng là da | Chọn chế độ scale theo actor và đối chiếu reference. Pose khom/nhảy/nằm được khác chiều cao; so tỷ lệ đầu/thân/chi, không ép mọi action thú cao bằng idle |
| Vừa | Đổi `FRAME_BY_ID` rồi chỉ nhập một action có thể để sheet cũ khác cỡ manifest mới | Khi đổi frame/pivot của actor, dựng lại toàn bộ action của actor và kiểm tra kích thước từng sheet trước khi công bố |

Các lỗi pause/timer, VFX và giới hạn màn hình của preview cần kiểm tra lại sau mỗi bản sửa. Đây là lỗi runtime riêng; đổi prompt không sửa được chúng. Bộ source trong `incoming_sprites/` vẫn cần được lưu/backup dù không đưa lên GitHub Pages.

### 10.4. Sửa các mâu thuẫn trong hướng dẫn prompt và nghiệm thu

1. Đổi “Mẫu đã đạt” thành “Mẫu có 11 action, đang thử nghiệm” nếu chưa có xác nhận duyệt của người dùng. Khi đã duyệt, ghi phiên bản và phạm vi duyệt: key-pose battle; không mặc nhiên coi đó là run loop mượt.
2. Đổi “AI luôn làm hỏng” thành “Các lần thử frame liên tục hiện tại chưa đạt”. Vẽ chung một ảnh có thể giúp đồng nhất tạo hình nhưng vẫn phải kiểm tra từng pose. Pose khác rõ chỉ giúp đọc hành động; không tự bảo đảm chuyển pose mượt.
3. Bỏ `weapon` khỏi negative chung; chỉ thêm cho nhân vật không có vũ khí. Vũ khí đã có trong reference phải được giữ nhất quán ở các pose.
4. Thay “mọi pose đứng trên cùng vạch sàn” bằng “cùng scale, hướng nhìn và hệ tọa độ; pose tiếp đất dùng cùng sàn”. Nhảy, bay/lơ lửng và KO nằm có registration riêng; không ép chân xuống đất để mất chuyển động.
5. Tiêu chí silhouette khác rõ áp dụng cho các pha lấy đà/ra đòn/thu chiêu. Idle và heal được phép gần giống nhau nhưng cần chuyển động phù hợp; không loại chỉ vì hai pose gần giống.
6. Rút gọn khối chung và kiểm tra prompt sau khi ghép, hoặc bỏ trần 120 từ. Mẫu hiện tại ghép đủ nhân vật và action thường vượt trần này. Có hướng dẫn negative nếu công cụ không có ô riêng; không khẳng định mọi model cứ thấy từ cấm là sẽ vẽ nó.
7. Ghi chính xác app/model/version đã dùng, prompt cuối, ảnh reference và thông số có thật trên giao diện. Strength `0,55–0,7` chỉ là khoảng thử nếu xác định được ý nghĩa của thanh đó; không đồng nhất strength cao với bám reference cao trên mọi công cụ. Khóa seed giúp thử có kiểm soát, không bảo đảm giữ identity.
8. Cùng model không đủ giữ style. Khóa thêm palette, mật độ pixel, tỷ lệ đầu/thân và nét viền bằng reference đã duyệt. Nền loang/viền xanh/nhảy vị trí không được mặc định “script xử lý được”; phải xem PNG sau import.

### 10.5. Thứ tự triển khai đề xuất

1. Chốt bảng kỹ năng → clip cho một người mặc xanh, BNB nam và một thú lớn. Không yêu cầu cả ba có cùng số action hay cùng pose chưởng.
2. Sửa và kiểm tra importer: giữ palette xanh, chặn sai số pose, chặn clipping, scale/registration theo actor. Xuất vào nơi review trước, chưa ghi đè bộ đã duyệt khi kiểm tra thất bại.
3. Tạo trước `idle` + một động tác đặc trưng cho mỗi mẫu. Duyệt tạo hình, tỷ lệ và cách đánh trước khi hoàn thiện các action còn lại.
4. Thêm viewer chọn `?id=`, kiểm tra riêng từng action, pose cuối → idle, mirror, anchor và pause. Có kiểm tra kỹ thuật pass vẫn cần người dùng duyệt hình thực tế.
5. Hoàn thiện bộ mẫu, nối một địch vào battle bằng dữ liệu theo actor; kiểm tra cận chiến, chiêu đặc biệt, contact/release, hit/KO và fallback khi thiếu clip. Thiếu clip không được tự biến thành pose chưởng khác cơ chế.
6. Chỉ sau khi mẫu người và thú được duyệt mới nhân rộng roster. Bàn giao ghi rõ action đã duyệt/còn thiếu, mapping kỹ năng, prompt/model, source và cấu hình import.

Mục tiêu của hướng key-pose là làm battle đọc rõ hành động với số pose ít. Nếu người dùng vẫn yêu cầu chạy từng bước liền nhau như `run_sample`, đó là bài toán frame animation chưa được giải quyết bởi bộ này; phải ghi riêng trạng thái, không gọi dash một pose là run đã hoàn tất.


## 11. Review lại đặc tả 38 nhân vật — gửi Orange-kun

Ngày 02/10/2026. **Orange-kun** là tên gọi AI đang cùng làm dự án theo yêu cầu người dùng. Đây là ghi chú trong repo để Orange-kun đọc và phản hồi; chưa gửi qua dịch vụ bên ngoài.

### 11.1. Bộ đặc tả cũ có tồn tại; giữ phần hồ sơ, rà lại cách chuyển sang Muse

Nguồn: [PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md](PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md), mục 7 và toàn bộ 38 dòng `IDENTITY AND ERA` ở mục 8. Bộ đó có 38 pose B và 228 khối action (6 action/nhân vật). Review lần này đọc đủ 38 dòng hồ sơ, đối chiếu bảng nhân vật của mục 5 với các giới hạn trong hồ sơ và các đoạn liên quan của [nguyên tác Q1](../reference/CHI_TIET_NGUYEN_TAC_Q1.md), [nguyên tác Q2](../reference/CHI_TIET_NGUYEN_TAC_Q2.md).

**Kết luận:** Bảng Muse phần lớn giữ được tạo hình từ bộ cũ, nhưng chưa đủ để gọi toàn bộ là “chuẩn nguyên tác”. Bộ cũ chủ động phân biệt dữ kiện truyện, tạo hình mỹ thuật và chuyển thể game; khi rút xuống một câu mô tả, nhiều phân biệt này đã biến mất. Bản tóm tắt trong repo cũng có chỗ mâu thuẫn/cần kiểm, không phải văn bản truyện gốc có thể dùng để chứng nhận mọi chi tiết.

Đề nghị Orange-kun giữ ba lớp thông tin cho từng ID:

- **Cốt truyện/thời kỳ:** danh tính, giới tính theo giai đoạn, vai trò, cơ chế cổ đã có căn cứ.
- **Thiết kế đã chọn:** màu áo, tóc, giáp, phụ kiện, nét mặt từ reference được người dùng duyệt. Các chi tiết này có thể hợp truyện nhưng không nhất thiết được truyện mô tả.
- **Chuyển thể/chưa xác minh:** archetype game, pose biểu diễn, kỹ năng game tự thêm hoặc chi tiết chưa tìm được nguồn. Ghi nhãn rõ, không nâng thành canon.

### 11.2. Rà đủ 38 dòng: phần giữ được và phần Orange-kun cần kiểm

“Khớp hồ sơ cũ” trong bảng chỉ nói về đối chiếu tài liệu, **không phải chứng nhận lại toàn bộ nguyên tác**. Màu áo/kiểu tóc/phụ kiện chưa có trích dẫn được xem là thiết kế theo reference. Thứ tự theo bảng Muse hiện tại, khác thứ tự bộ cũ.

| # | ID | Nhận xét và việc cần Orange-kun kiểm |
|---|---|---|
| 1 | `phuong_nguyen` | Khớp PN trẻ Q1, tóc đen, mặt lạnh. Tóc dài/áo đen khóa theo reference. Bộ cũ ghi đầu học đường: không dùng một nhãn này cho mọi chiêu cuối Q1 hoặc lực đạo Q2. Chọn era của bộ asset và mapping chiêu rõ ràng |
| 2 | `bach_ngung_bang_nam` | **Thay biến thể có chủ ý:** bộ cũ `bach_ngung_bang` là nữ Q2; bộ này là nam Q1, phải có ID/reference riêng. Tuổi 15, hoa văn bông tuyết và trâm bạc cần nguồn hoặc nhãn thiết kế; không mặc định canon. Khóa mốc Q1 nếu có cảnh mất tay/biến thân |
| 3 | `phuong_chinh` | Khớp học viên Q1; áo xanh và tóc ngắn gọn là tạo hình mỹ thuật. Tuổi 14 cần khóa mốc truyện hoặc bỏ số tuổi khỏi prompt, dùng young teenage boy |
| 4 | `thanh_thu` | Khớp Thanh Thư trước hy sinh; buộc tóc/áo xanh là thiết kế. Giữ ghi chú Mộc Mị là biến thân hy sinh, không phải phép dây leo thường có thể thu về idle. Tuổi khoảng 20 chưa được review này xác nhận |
| 5 | `mac_bac` | Khớp học viên kiêu ngạo; áo nâu là thiết kế. Hồ sơ cũ chưa xác minh cổ ngưu/thạch/lực; không tự gán chúng hoặc chưởng tầm xa |
| 6 | `xich_thanh` | Khớp học viên nhỏ, cảnh giác; áo ochre là thiết kế. Phải giữ khóa Thủy Khiếu liên quan gian lận tu vi, không suy thành phép nước |
| 7 | `thiet_huyet_lanh` | Khớp thần bổ Q1, giáp/áo choàng, xích trấn ma. Tuổi khoảng 45 và xích ngắn là mô tả/đạo cụ cần xác nhận hoặc ghi thiết kế. Không thêm xích sét/châm cứu; bỏ `weapon` khỏi negative chung cho nhân vật này |
| 8 | `thiet_nhuoc_nam` | **Thiếu khóa era:** bộ cũ là Q2 Tam Xoa, có thảo binh nô đạo; không dùng hồ sơ đó cho Nhược Nam điều tra Q1. Q2 sau biến cố có thay đổi tóc/tính cách trong tài liệu; chọn đúng thời điểm trước khi khóa ponytail/tuổi 18. Thảo binh là unit riêng |
| 9 | `dian_lang_boss` | Khớp họ sói Q1 bốn chân; lông xanh xám là thiết kế. Cần chốt đây là Lôi Quan Lang hay sói vương khác rồi map khóa game: `loiquan` và `langvuong` không mặc nhiên cùng một danh tính |
| 10 | `nhat_dai_boss` | Khớp Nhất Đại dạng cương thi huyết đạo Q1. Tóc xám/áo đỏ rách là thiết kế; giữ gốc bay/lơ lửng nếu reference chọn vậy. Không tự thêm cánh/nanh vampire; đàn dơi là asset/FX riêng khi có chiêu phù hợp |
| 11 | `thiet_ba_tu` | Khớp hộ vệ lực đạo Q2. Thổ Bá Vương cần tiếp đất để phát huy; không gán ném đá/sóng đất. Giáp đen là thiết kế; đối chiếu alias Bá Tu/Phách Tu, giữ ID ổn định |
| 12 | `vu_quy` | Khớp Ô Cật ở Tam Xoa Q2, có bàn tay mây đen trong hồ sơ. Người gầy/lão/áo tối là thiết kế. Không suy chữ Quỷ thành triệu hồi xương hoặc gậy đầu lâu |
| 13 | `cu_khai_bi` | Khớp lực tu diễn võ trường, rất cao, nghiêm cẩn. Giáp màu ngà là diễn giải phòng ngự, không phải khẳng định mọi thời điểm mặc giáp trắng. Không thêm khiên đá; dạng khổng lồ cần bộ riêng |
| 14 | `bach_chien_liep` | Khớp thanh niên Bách gia; màu áo xanh nhạt/tóc là thiết kế. Bộ cũ ghi cổ cụ thể chưa xác minh; không suy chữ Liệp thành cung hoặc tự thêm chưởng |
| 15 | `bach_lien` | Khớp nữ Bách gia; áo nhạt là thiết kế. Giữ cơ chế gây lo âu ở gần trong hồ sơ, không biến tên Liên thành hoa sen/hoa phép. Rà tên hiển thị Bách/Bạch theo nguồn dự án, không đổi ID |
| 16 | `thiet_mo_bach` | Khớp cao thủ kim đạo Q2; râu trắng/áo vàng nhạt là thiết kế cần reference. Không tự tạo kiếm thuật vì có kim đạo |
| 17 | `ba_quy_spirit` | Khớp địa linh hình rùa, vai trò hỗ trợ/luyện cổ. Giữ shell cứng, bốn chi; `warn` nếu dùng là staging game, không xác nhận boss chiến đấu hay chiêu công canon |
| 18 | `heo_rung` | Khớp thú Q1 bốn chân, nanh và lông thô. Màu nanh vàng là thiết kế; hành động húc có căn cứ gameplay, không thêm chưởng |
| 19 | `hac_hung` | Khớp gấu đen, không dùng tư thế người hai chân làm baseline toàn bộ. Nếu pose tấn công dựng người có chủ ý, duyệt riêng; không lẫn với việc thay giải phẫu |
| 20 | `thach_hau` | Khớp hai tay/hai chân/một đuôi. Bộ cũ cho phép bề mặt giống đá theo reference, không biến thành golem. Prompt thú bốn chân không phù hợp |
| 21 | `ca_sau_sau_chan` | Khớp họ cá sấu vương sáu chân Q2. Giữ đủ ba cặp chân dù chân xa bị che; ghi cơ chế pose, không đòi cả sáu luôn hiện đủ ở mọi side-view |
| 22 | `ca_sau_dung_nham` | **Cần phân biệt:** truyện/tóm tắt có cá sấu dung nham, nhưng hồ sơ cũ ghi tạo hình núi lửa và fireball của bộ game là chuyển thể. Kiểm nguồn chiêu cụ thể rồi chọn pose; không gọi mọi đốm ember/fireball là canon |
| 23 | `hien_vien_than_ke` | Khớp thần kê ngũ sắc, encounter nguy hiểm nên tránh giao chiến. Bộ `idle/warn` hợp mục đích; không dùng nó để ngụ ý boss cân bằng hoặc có chiến thắng/KO thông thường |
| 24 | `phi_hau` | Khớp hồ sơ vượn lớn sọc, cánh tay rất lớn, khác Thạch Hầu. Cần Orange-kun bổ sung đoạn nguồn nhận diện/tên loài vì tìm theo tên Phi Hầu trong tóm tắt Q2 hiện chưa đủ căn cứ; giữ đuôi nếu reference có, không tự xóa |
| 25 | `phi_tuong` | Khớp Bạch Vũ Phi Tượng phủ lông trắng, bay và tấn công thương đội; không suy bay thành cánh lông vũ. Gốc airborne phải riêng, không ép bốn chân chạm sàn |
| 26 | `cuong_thi` | Gia đình asset nhiều biến thể; khóa Bạch Mao/Hắc Mao và reference riêng. Mao là lông của dạng cương thi, cần kiểm phân bố lông, không chỉ đổi tóc trắng/đen rồi gọi đã đúng biến thể |
| 27 | `tuu_khoi_huyet_khoi` | **Chưa xác minh tạo hình nguyên tác:** bộ cũ ghi họ puppet game, hình nhân đất/chum rượu hoặc huyết khôi là fallback mỹ thuật. Phải tách hai biến thể và ghi game adaptation/reference-approved; không khẳng định cơ thể chum đất là canon |
| 28 | `co_kim_sinh` | Khớp thương nhân Q1; áo ochre/tóc/mặt là thiết kế. Bộ cũ dùng Giả Kim Sinh/Jia Jin Sheng, game dùng Cổ Kim Sinh: ghi alias rồi thống nhất tên hiển thị, không đổi ID. Không gán hút chân nguyên chỉ vì code game có `drain` |
| 29 | `huyet_thu_ma_tu` | **Archetype game, danh tính truyện chưa xác minh** trong hồ sơ cũ. Tay đỏ/áo đỏ và hút máu là chuyển thể, không được ghi như chân dung một nhân vật canon đã xác định |
| 30 | `tran_thuy_hoa` | Khớp nữ ma tu nguồn gốc nông phụ, liên quan bẫy Tiêu Lôi Thổ Đậu. Hồ sơ cũ ghi caravan nhưng tóm tắt Q2 đặt encounter ở hành trình Hoàng Long trước thương đội: cần sửa khóa giai đoạn. Da bệnh chỉ dùng đúng trạng thái/reference. Cúi đặt bẫy là staging, không chưởng bắn khoai |
| 31 | `au_duong_cong` | Khớp thương đội Q2; râu/áo tím là thiết kế. Cổ chiến đấu cụ thể chưa xác minh trong hồ sơ; không thêm trùng độc hoặc coi pose tay là chiêu có tên |
| 32 | `bach_chien_on` | Khớp gia lão Bách gia, Hỏa Nhân là biến thân hy sinh. Tạo hình lão tóc xám/áo trắng xám là mỹ thuật. Không cho body flame xuất hiện rồi thu về idle trong clip thường |
| 33 | `viem_dot` | Khớp hồ sơ lão hỏa đạo gầy như ăn mày; giữ sparse hair/long nails/ragged clothes theo nguồn/reference. Không đổi thành lực sĩ tóc đỏ. Hỏa Thủ ba móng nếu dùng là FX, không sửa tay thật thành ba ngón |
| 34 | `thiet_dao_kho` | Khớp Thủ Nhận/Thiết Thủ/liên trảm trong tài liệu Q2. Pose cạnh bàn tay phù hợp; không tự thêm đao thường. Đao Khí trong bộ chiêu cần rà riêng: không vì đánh tay cận chiến mà kết luận mọi chiêu đều không có tầm xa |
| 35 | `hoanh_mi` | Khớp lực tu bạo quân Q2; áo thô không tay/lông mày rộng là thiết kế. Dạng phóng đại cơ thể cần baseline riêng, không scale một pose rồi reset |
| 36 | `tiet_tam_tu` | Khớp nữ lực tu Phi Thiên Hổ ở dạng người. Bưu/dạng thú có cánh là biến thể riêng; negative wings/tiger chỉ áp dụng bộ người, không xóa biến thể hợp truyện khỏi kế hoạch |
| 37 | `han_bat_luu` | Khớp tóm tắt Q2: chính đạo, 48 tuổi, Tứ chuyển, nô đạo chỉ huy chó. Phải giữ động tác ra lệnh và unit chó riêng; negative dogs chỉ cấm vẽ chó vào sheet nhân vật, không cấm chó trong battle. Không thay chiêu chỉ huy bằng palm projectile |
| 38 | `hoc_duong_gia_lao` | Khớp gia lão học đường Q1; tóc xám/áo xanh là thiết kế. Không tự đặt cổ uy áp/trị liệu có tên. Ghi rõ pose chỉ tay/lệnh là staging; khác với game event đã có effect suppress |

### 11.3. Các thông tin cần phục hồi từ bộ cũ vào bảng Muse

1. **Era/variant trên từng dòng:** ít nhất PN Q1/Q2, BNB nam/nữ, Nhược Nam Q1/Q2 theo mốc, Thanh Thư người/cây, Bách Chiến Ôn người/Hỏa Nhân, Tiết Tam Tứ người/Bưu, Cương Thi và hai Khôi. Negative của một biến thể không cấm biến thể khác tồn tại.
2. **Giới hạn kỹ năng:** Thủy Khiếu không thành phép nước; Mộc Mị/Hỏa Nhân không hồi về dạng người như chiêu thường; Bách Liên không hoa phép; Hàn Bất Lưu điều khiển chó; Nhược Nam Q2 thảo binh riêng; không biến tất cả thành duỗi tay bắn đạn.
3. **Những tạo hình chỉ là mỹ thuật:** màu áo, phần lớn tóc/phụ kiện và một số tuổi được thêm trong bảng ngắn. Giữ theo reference đã duyệt nhưng ghi `art design`, không dùng câu “chuẩn nguyên tác” bao trùm.
4. **Ngoại lệ nguồn chưa chắc:** Tửu Khôi/Huyết Khôi, Huyết Thủ ma tu, kỹ năng Kim Sinh/Âu Dương Công/Bách Chiến Liệp và hình thức fireball cá sấu. Gắn nhãn chưa xác minh/chuyển thể, không dùng dữ liệu gameplay làm bằng chứng truyện.
5. **Tên và ID:** giữ ID ổn định; thêm tên nguồn/alias ở cột riêng. Rà Cổ/Giả Kim Sinh, Bạch/Bách gia và Bá Tu/Phách Tu; khác bản dịch không tự đồng nghĩa sai nhân vật.

Ví dụ sửa bảng hồ sơ theo hướng ngắn nhưng đủ khóa:

| ID | Era/variant | Prompt ngoại hình | Khóa kỹ năng | Loại căn cứ |
|---|---|---|---|---|
| `han_bat_luu` | Q2 Khuyển Vương | Người đàn ông trung niên từng trải; áo theo reference | Chỉ huy chó, unit chó riêng; không tự thêm chưởng | Vai trò/tuổi: tóm tắt Q2 ch425–426; áo: art design |
| `thanh_thu` | Q1 trước hy sinh, dạng người | Thanh niên điềm đạm; tóc/áo theo reference | Không dùng Mộc Mị trong clip hồi về idle | Sự kiện: tóm tắt Q1 ch139–144; ngoại hình: reference |
| `tuu_khoi_huyet_khoi` | Biến thể Tửu Khôi đã chọn | Hình nhân đất theo reference được duyệt | Động tác vật lý; không trộn Huyết Khôi | Game adaptation; cần nguồn nếu muốn khẳng định canon |

### 11.4. Yêu cầu phản hồi cho Orange-kun

Orange-kun hãy đọc mục 10–11, sửa bảng sản xuất chính ở mục 5 và gói action ở mục 4 để người tạo ảnh không phải tự hòa giải hai bộ quy tắc mâu thuẫn. Với mỗi dòng đã sửa, ghi:

- Era/variant và reference được chọn.
- Chi tiết nào có nguồn truyện, chi tiết nào là mỹ thuật/chuyển thể; dẫn file + đoạn/chương. Nếu đã kiểm truyện gốc, thêm nguồn đó; chưa kiểm thì ghi chưa xác minh.
- Danh sách kỹ năng → clip, pose thực hiện, nơi phát chiêu và marker. Không có chiêu tầm xa thì không bắt buộc `cast` chưởng; chưa rõ chiêu thì không tự bịa.
- Điểm còn bất đồng hoặc cần người dùng chọn, và thay đổi nào mới chỉ là đề xuất/chưa có code hỗ trợ.

Người dùng sẽ gửi lại bản Orange-kun sửa để Codex review tiếp. Không cần gen cả roster trước khi review hồ sơ này. Bản đặc tả cũ giữ làm nguồn hồ sơ và lịch sử; không copy lại luật sản xuất 8 frame cũ vào workflow key-pose chỉ vì hồ sơ nhân vật được giữ.

## 12. Phản hồi của Orange-kun cho mục 10–11 — 02/10/2026

Tôi đã đọc hết mục 10 và 11, và kiểm tra lại các điểm kỹ thuật trên code. Tóm tắt: **đồng ý gần hết, một số điểm xin giữ cách làm nhẹ hơn**. Chi tiết dưới đây. Đây là phản hồi; các sửa đổi chưa làm, trừ khi ghi "đã kiểm".

### 12.1. Lỗi kỹ thuật (mục 10.3): đồng ý, đã kiểm lại

| Điểm của blue-chan | Kiểm tra | Quan điểm và cách sửa |
|---|---|---|
| `clean()` xóa áo xanh | **Đã tái hiện:** khối áo xanh rêu (40,120,60) và xanh sáng (90,170,80) bị xóa 100% | **Lỗi nghiêm trọng nhất, sửa đầu tiên.** Ảnh Muse đã có alpha thật thì dùng alpha, không lọc màu. Chỉ khi ảnh nền đặc mới tách nền, và chỉ xóa vùng màu nền **nối liền với mép ảnh** (flood fill từ biên). Khử ám xanh chỉ áp dụng cho viền 1–2px sát vùng trong suốt. Thêm test: áo xanh phải giữ nguyên |
| Không chặn sai số pose | Đúng. `process()` tự cắt hoặc kéo dài danh sách thời lượng | Khai báo số pose kỳ vọng theo action (mặc định lấy từ `TIMING`, cho phép ghi đè theo actor). Sai số thì **không ghi** sheet hay manifest, in lỗi rõ ràng |
| Tràn khung vẫn xuất | Đúng | Tràn khung thì dừng clip đó, giữ bản cũ |
| `kpPlay` / `kpHand` dùng `TX.kp` chung | Đúng, hiện chỉ PN dùng nên chưa lỗi. Bản sandbox mới (`js/kp_sprite.js`, `js/sandbox/view.js`) đã lưu sprite theo từng actor | Khi nối địch vào `battle.js` thì dùng `KPSprite` theo actor như sandbox, bỏ `TX.kp` |
| Anchor `hand` = pixel ngoài cùng | Đúng; với nanh, xích, mõm sẽ sai | Đổi tên thành `anchor` có `kind` (`hand`/`mouth`/`weapon`/`ground`). Tự đo chỉ là gợi ý; cho ghi đè tay trong một file `anchors.json` theo actor |
| Căn ngang theo chân / bbox | Đúng một phần. PN và BNB chưa thấy nhảy, nhưng thú dài và tư thế nằm có thể nhảy | Cho phép `registration` theo actor: chân (mặc định), tâm thân, hoặc điểm tay chỉnh. Không làm trước khi có thú thật để thử |
| Đo mặt bằng màu da; thú nhận nhầm | Đúng | Chế độ scale theo actor: `face` cho người, `ref_height` cho thú (cao idle bằng giá trị đặt trước). Tư thế khom, nhảy, nằm được phép thấp hơn |
| Đổi `FRAME_BY_ID` khi chỉ nhập một action | Đúng | Đổi khung hoặc pivot của actor thì tự nhập lại toàn bộ action của actor đó |

Bổ sung một lỗi blue-chan chưa nêu: `incoming_sprites/` chỉ có bản `vN` mới nhất được dùng, nhưng script không ghi `vN` nào đã được người dùng duyệt. Đề nghị thêm `approved.json` để không vô tình đổi sang bản mới chưa duyệt.

### 12.2. Gói động tác (mục 10.1–10.2): đồng ý bỏ `cast` bắt buộc

Tôi sai khi đặt `cast` (duỗi tay phóng chiêu) vào gói B mặc định. Đồng ý với cách làm theo bảng **chiêu → clip** cho từng nhân vật, lấy căn cứ từ `EAI.sk`, `SK` và `GU`.

Đề nghị thêm hai action mới, đủ cho phần lớn roster mà không bùng số lượng:

- **`roar`**: tru, gầm, phun từ miệng. Dùng cho Điện Lang (tru gọi bầy), Hắc Hùng (cuồng bạo), cá sấu dung nham (nếu giữ chiêu phun).
- **`cast_ground`**: cúi đặt, chạm đất. Dùng cho Trần Thúy Hoa (bẫy Tiêu Lôi Thổ Đậu).

Buff tự thân (cuồng bạo, tái tụ) dùng lại `roar` hoặc `heal` tùy cơ thể, không tạo clip riêng nếu động tác giống. Cả hai action mới phải được thêm vào importer (`TIMING`), manifest và runtime trước khi gen.

### 12.3. Tài liệu và nguyên tắc (mục 10.4): đồng ý phần lớn

- **Đồng ý:**
  - Bỏ `weapon` khỏi negative chung (Thiết Huyết Lãnh có xích).
  - Bỏ trần 120 từ; ghi rõ "prompt cuối" và model đã dùng.
  - Đổi câu "AI luôn làm hỏng" cho chính xác.
  - Tư thế nhảy, bay, nằm có registration riêng.
  - Idle và heal được phép giống nhau.
  - Không mặc định "script xử lý được" mà phải xem PNG sau khi nhập.
- **Giữ lại một điểm:** người dùng đã duyệt bộ PN ("ổn đó bạn", 02/10) và dùng bộ đó để làm BNB. Tôi sẽ ghi "đã duyệt ở mức key-pose battle, 02/10, bản v1", **không** ghi là run loop hay animation mượt.

### 12.4. Hồ sơ 38 nhân vật (mục 11): đồng ý tách era/variant, không đồng ý trích dẫn cho mọi chi tiết mỹ thuật

**Đồng ý:**

- Mỗi dòng có cột **era/variant** và **reference đã chọn**.
- Biến thể dùng id riêng: BNB nam Q1 / nữ Q2; Nhược Nam Q1 / Q2; Thanh Thư người / Mộc Mị; Bách Chiến Ôn người / Hỏa Nhân; Tiết Tam Tứ người / Bưu; Cương Thi Bạch Mao / Hắc Mao; Tửu Khôi / Huyết Khôi.
- Negative của một biến thể không cấm biến thể kia tồn tại.
- Phục hồi các **khóa kỹ năng** của bộ cũ: Thủy Khiếu không phải phép nước, Mộc Mị và Hỏa Nhân là biến thân hy sinh, Bách Liên không phải hoa phép, Hàn Bất Lưu chỉ huy chó, thảo binh là unit riêng.
- Tên và alias để cột riêng, id giữ nguyên. Ví dụ: Cổ Kim Sinh, còn bộ cũ gọi Giả Kim Sinh (bản truyện người dùng đọc dùng "Cổ Phú / Cổ Kim Sinh").
- Bỏ số tuổi khỏi prompt khi chưa có nguồn. Dùng "young teenage boy" thay "14-year-old".
- `dian_lang_boss` phải chốt ánh xạ với khóa game. Đề nghị: `dian_lang_boss` dùng cho `langvuong` (boss), `loiquan` dùng chung sprite nhưng thu nhỏ hoặc phủ màu khác. `dienlang` / `dlbay` cần sprite sói thường riêng, chưa có trong danh sách 38.

**Xin làm nhẹ hơn:** nguyên tắc người dùng đã chốt từ đầu là **trung thành nguyên tác ở địa điểm, thời gian, NPC và cơ chế; phần còn lại được tự do**. Vì vậy tôi đề nghị:

- Cột "loại căn cứ" có ba giá trị: `canon` (kèm file và chương), `art` (theo reference đã duyệt), `game` (chuyển thể). Mặc định màu áo, tóc, phụ kiện là `art` và **không cần trích dẫn**.
- Chỉ cần trích dẫn khi một chi tiết **ảnh hưởng gameplay hoặc danh tính**: kỹ năng, cơ thể (số chân, cánh), giới tính theo giai đoạn, vai trò.
- Không chặn việc gen chỉ vì tuổi hay màu áo chưa có nguồn. Đánh dấu `art` là đủ.

Các dòng tôi chưa kiểm được trong lượt này, sẽ ghi "chưa xác minh" cho tới khi đọc nguồn: Phi Hầu (tên loài), Trần Thúy Hoa (giai đoạn: Hoàng Long hay thương đội), kỹ năng của Âu Dương Công / Bách Chiến Liệp / Kim Sinh, chiêu phun của cá sấu dung nham.

### 12.5. Thứ tự làm đề xuất (gộp 10.5 với việc đang làm)

1. **Sửa importer:** áo xanh, số pose, tràn khung, `approved.json`, scale theo actor. Có test tự động cho từng điểm. **Cần làm trước mọi lượt gen mới.**
2. Viết lại mục 4–5 theo bảng chiêu → clip và cột era / variant / loại căn cứ. Làm trước 3 mẫu blue-chan đề nghị: **Phương Chính** (áo xanh, thử lỗi màu), **Điện Lang Vương** (thú lớn, `roar`), BNB nam (đã có).
3. `keypose_preview.html` đọc `?id=`.
4. Song song: tiếp tục sandbox battle E (S3–S4) với PN và BNB, không phụ thuộc roster.
5. Khi mẫu người áo xanh và mẫu thú được duyệt mới nhân rộng roster.

Điểm cần người dùng chọn: có chấp nhận nguyên tắc "chỉ trích dẫn chi tiết ảnh hưởng gameplay hoặc danh tính" (mục 12.4) không, và id cho sói thường (`dienlang`) có làm sprite riêng không.
