# Prompt Muse AI cho toàn bộ nhân vật, boss và quái

Ngày 02/10/2026. Dùng cùng cách làm với bộ Phương Nguyên và Bạch Ngưng Băng đã duyệt.

- Mỗi lần tạo **một ảnh ngang chứa 1–3 tư thế** của một động tác.
- Nền trong suốt, hoặc nền phẳng xanh lá `#00FF00`.
- Không vẽ hiệu ứng chiêu; code game tự vẽ.

Theo yêu cầu của người dùng, có hai loại động tác:

- **Clip chung (`idle`, `move`, `hit`, `guard`, `heal`, `dodge`, `ko`):** mọi nhân vật dùng cùng câu mô tả ở mục 2. Mỗi nhân vật vẫn gen ảnh riêng của mình.
- **Clip riêng (`atk` đánh thường, `sk_...` chiêu/cổ, `win` thắng):** viết riêng cho từng nhân vật ở mục 4, theo cách đánh trong nguyên tác hoặc trong data game.

**Nhãn căn cứ** (theo quy ước người dùng chốt):

- `canon`: có trong tài liệu nguyên tác, kèm chương.
- `game`: chuyển thể từ data game (`EAI.sk`, `SK`, `EN` trong `js/data.js` / `js/q2/data2.js`).
- `art`: thiết kế mỹ thuật theo ảnh tham chiếu. Không cần nguồn.

Dòng nào ghi **"chưa xác minh"** thì vẫn gen được, nhưng có thể phải sửa khi đọc được nguồn.

---

## 1. Cách ghép prompt

**Thứ tự:** khối chung → dòng `Character` / `Animal` của nhân vật → dòng `Poses` của động tác.

**Khối chung (người):**

```text
Pixel art game sprite sheet, chibi side-view character, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.
{CHARACTER}
Exactly the same character as the reference image: same face, same hair, same outfit, same colors, same proportions, same pixel art style.
One single horizontal row, poses ordered left to right, all poses the same size and scale, full body visible, wide empty gap between poses.
Facing right in every pose. Fixed orthographic side view.
Background: transparent, or solid flat pure green #00FF00.
{POSES}
```

**Khối chung (thú):** thay dòng đầu bằng `Pixel art game sprite sheet, side-view animal sprite, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.`

**Negative chung** (dán vào ô negative; Muse không có ô riêng thì bỏ qua):

```text
blurry, 3d render, realistic, painterly, extra limbs, extra fingers, extra heads, overlapping characters, different face, different hairstyle, text, letters, watermark, border, grid lines, gradient background, scenery, cropped feet, cropped head, glow, magic effect, particles, motion lines
```

Cộng thêm negative riêng ở từng nhân vật. `weapon` **không** nằm trong negative chung. Ai không có vũ khí thì negative riêng sẽ ghi.

**Ảnh tham chiếu:**

- Lấy `assets/chibi_ref/<id>.png`, phóng to ×4 trước khi upload:

  ```bash
  python3 -c "import sys;from PIL import Image;i=Image.open(sys.argv[1]);i.resize((i.width*4,i.height*4),Image.NEAREST).save(sys.argv[2])" assets/chibi_ref/<id>.png ref_<id>.png
  ```

- Độ bám tham chiếu đặt cao. Khóa seed theo nhân vật nếu Muse cho phép.
- Ghi lại model, prompt cuối và seed đã dùng vào file `incoming_sprites/NOTE.txt`.

**Tỷ lệ khung:** 3 tư thế → 3:1 · 2 tư thế → 2:1 · 1 tư thế → 1:1.

**Tên file:** `<id>_<clip>_v1.png`, lưu vào `incoming_sprites/`. Ví dụ `heo_rung_atk_v1.png`, `dian_lang_boss_sk_howl_v1.png`.

**Nhập:**
1. Chạy `python3 tools/keypose_import.py`, rồi `python3 tools/keypose_import.py --report` để xem cỡ.
2. Script **từ chối** ảnh tách sai số tư thế hoặc tràn khung, giữ nguyên bản cũ.
3. Thú to hoặc dài: thêm khung riêng vào `FRAME_BY_ID` trong script trước khi nhập.

---

## 2. Clip chung: dùng nguyên văn cho mọi nhân vật

### 2.1. Người

| clip | Pose | Dòng `{POSES}` |
|---|---|---|
| idle | 2 | `Poses: 2 poses of a calm idle stance, almost identical. Pose 1: standing in the character's usual stance. Pose 2: same stance breathing in, shoulders slightly raised, hair and clothes hanging naturally.` |
| move | 2 | `Poses: 2 poses of a martial-arts dash. Pose 1: leaning far forward, low, arms trailing behind, hair and clothes streaming back. Pose 2: skidding to a stop, front knee bent, leaning back to brake.` |
| hit | 2 | `Poses: 2 poses of being struck from the right. Pose 1: upper body jerked backward, head tilted back, eyes shut. Pose 2: hunched forward, one hand on the stomach, gritting teeth.` |
| guard | 2 | `Poses: 2 poses of a defensive stance. Pose 1: both forearms crossed in front of the face, knees bent. Pose 2: same braced stance pushed back a little, head lowered behind the arms.` |
| heal | 2 | `Poses: 2 poses of recovering. Pose 1: standing upright, eyes closed, one hand on the chest. Pose 2: same pose, chin slightly raised, breathing out, shoulders relaxed.` |
| dodge | 2 | `Poses: 2 poses of dodging backward. Pose 1: hopping backward, body leaning back, arms raised for balance. Pose 2: landing in a low crouch, one hand near the ground.` |
| ko | 3 | `Poses: 3 poses of being defeated. Pose 1: staggering, knees buckling, head drooping. Pose 2: fallen on one knee, one hand on the ground. Pose 3: collapsed lying on the ground on the side, eyes closed.` |

Người già hoặc phụ nữ có thể giảm độ nhảy ở `dodge`. Ai đứng lơ lửng (Nhất Đại) thì bỏ "on the ground" ở idle.

### 2.2. Thú

| clip | Pose | Dòng `{POSES}` |
|---|---|---|
| idle | 2 | `Poses: 2 poses of standing alert, almost identical. Pose 2: head slightly lowered, breathing.` |
| move | 2 | `Poses: 2 poses of running fast. Pose 1: body stretched forward, legs extended front and back. Pose 2: legs gathered under the body.` |
| hit | 2 | `Poses: 2 poses of being struck from the right. Pose 1: head and body recoiling backward, eyes shut. Pose 2: staggering, legs splayed, head shaking.` |
| ko | 2 | `Poses: 2 poses of collapsing. Pose 1: legs buckling, body sinking. Pose 2: lying on its side on the ground, eyes closed.` |

Thú không cần `guard`, `heal`, `dodge` trừ khi bảng riêng ghi.

### 2.3. Gói clip chung cần làm theo nhóm

| Nhóm | Clip chung | Ghi chú |
|---|---|---|
| Vai chính (người chơi điều khiển được) | idle, move, hit, guard, heal, dodge, ko | Phương Nguyên, Bạch Ngưng Băng nam: **xong** |
| Boss người | idle, move, hit, guard, ko | Thêm heal nếu có chiêu hồi |
| Đối thủ người thường | idle, move, hit, ko | |
| Thú / boss thú | idle, move, hit, ko | Hình người (cương thi, khôi) dùng câu của người |
| Không chiến đấu | idle + `warn` | |

---

## 3. Thứ tự làm đề xuất

0. **Ảnh gốc** theo mục 3b: `thiet_dao_kho`, `ca_sau_sau_chan`, `dien_lang`.
1. **Mẫu kiểm tra** (theo đề nghị của blue-chan):
   - `phuong_chinh`: áo xanh, để thử lỗi áo xanh vừa sửa trong script.
   - `dian_lang_boss`: thú lớn, có `roar`.
2. Boss Q1: `thiet_huyet_lanh`, `nhat_dai_boss`, `hoc_duong_gia_lao`, `heo_rung`, `hac_hung`, `thach_hau`.
3. Nhân vật Q1 còn lại, sau đó tới Q2.

Mỗi nhân vật gen `idle` + `atk` trước, xem bằng mắt rồi mới làm tiếp.

---

## 3b. Ảnh gốc side view (`base`): tạo mới hoặc tạo lại

Ảnh gốc là **ảnh tham chiếu** upload lên Muse cho mọi clip của nhân vật đó. Ảnh sai thì mọi clip sẽ sai theo, nên duyệt ảnh gốc trước khi gen động tác.

### Prompt ảnh gốc (người)

```text
Pixel art game character sprite, chibi proportions about 2.5 heads tall, side-view character, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.
{CHARACTER}
Single character only, full body from head to feet, standing in a neutral relaxed stance, arms slightly away from the body so both hands are visible, feet slightly apart.
Exact side profile facing right, fixed orthographic side view, nose pointing to the right.
Background: transparent, or solid flat pure green #00FF00.
Same pixel density, outline thickness and shading style as the style reference image.
```

### Prompt ảnh gốc (thú)

```text
Pixel art game creature sprite, side-view animal sprite, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.
{ANIMAL}
Single creature only, whole body visible including tail and every leg, standing in a neutral alert stance.
Exact side profile facing right, fixed orthographic side view.
Background: transparent, or solid flat pure green #00FF00.
Same pixel density, outline thickness and shading style as the style reference image.
```

**Negative** (cộng negative riêng của nhân vật): `multiple characters, multiple poses, front view, three-quarter view, back view, cropped, text, watermark, scenery, floor, shadow, glow, magic effect`

**Ảnh tham chiếu khi gen ảnh gốc:**
- **Phong cách:** `assets/chibi_ref/phuong_nguyen_full.png`, để mọi nhân vật cùng một kiểu pixel art.
- **Nhận diện:** ảnh gốc cũ của nhân vật, nếu còn dùng được (ví dụ chỉ sửa vũ khí). Muse chỉ cho một ảnh thì ưu tiên ảnh nhận diện, và để câu "same pixel style" trong prompt lo phần phong cách.

**Tên file và nhập:**
- Lưu `incoming_sprites/<id>_base_v1.png`, rồi chạy `python3 tools/keypose_import.py`.
- Script tách nền và lưu thành `assets/chibi_ref/<id>.png`. Bản cũ được giữ lần đầu ở `assets/chibi_ref/_cu/`.
- Ảnh có nhiều hơn 1 nhân vật bị từ chối.

### Danh sách ảnh gốc cần làm

Đã rà 38 ảnh gốc hiện có trong `assets/chibi_ref/` (02/10/2026).

| Ưu tiên | id | Lý do | Dòng `{CHARACTER}` / `{ANIMAL}` | Negative riêng |
|---|---|---|---|---|
| **Gen lại** | `thiet_dao_kho` | Ảnh cũ **cầm dao**. Canon ch 443–445: lưỡi dao là cạnh bàn tay (Thủ Nhận) | `Character: resolute adult man, short black hair, stern face, practical dark armor, both hands empty, right hand held flat and straight like a blade.` | `sword, saber, knife, dagger, weapon` |
| **Gen lại** | `ca_sau_sau_chan` | Ảnh cũ chỉ thấy 4 chân; hồ sơ yêu cầu đủ 3 cặp chân | `Animal: long armored crocodile king with exactly six legs in three pairs along its long body, all six legs visible from the side, long toothy muzzle, heavy tail, dark green scales.` | `four legs, wings` |
| **Tạo mới** | `dien_lang` | Sói Điện Lang thường, chưa có ảnh (mục 4.9b) | `Animal: lean four-legged grey wolf, crackling grey-blue fur, sharp ears, long muzzle, glowing pale eyes.` | `horn, crown, standing on two legs, lightning` |
| Biến thể, làm khi cần | `thanh_thu_mocmi` | Mộc Mị biến thân cây (ch 141–142) | `Character: young man transformed into a tree spirit, body of twisted bark and wood, long blue-green hair turned into leafy vines, roots growing from the feet.` | `human skin, weapon` |
| Biến thể | `bach_chien_on_hoanhan` | Hỏa Nhân, thân hóa lửa (ch 228–250) | `Character: elderly man whose whole body has become living flame, red robe burning, white beard made of fire.` | `weapon` |
| Biến thể | `hoanh_mi_baoluc` | Bạo Lực cổ phồng người | `Character: brutish man swollen to giant muscular size, broad brow, torn sleeveless clothes, veins bulging.` | `weapon` |
| Biến thể | `cuong_thi_hac` | Hắc Mao cương thi, nhanh, hút máu | `Character: lean corpse-like zombie humanoid covered in long black hair, grey skin, torn dark clothes, crouched ready to pounce.` | `white hair, weapon` |
| Biến thể | `huyet_khoi` | Huyết Khôi | `Character: hulking dark-red puppet humanoid of dense clotted blood, no face.` | `clay, wine jar, weapon` |
| Biến thể | `thiet_nhuoc_nam_q2b` | Nhược Nam sau ch 453–455: cắt tóc, ánh mắt lạnh | `Character: young woman with short-cut dark hair, cold iron gaze, practical dark-red armor, bare hands.` | `long hair, male, sword` |
| Biến thể | `thiet_nhuoc_nam_q1` | Nhược Nam Q1, thời điều tra | `Character: resolute young woman investigator, long dark hair tied in a ponytail, practical dark clothes, bare hands.` | `male, sword` |
| Biến thể | `phuong_chinh_hoc` | Phương Chính học đường, trước khi có Nguyệt Nghê Thường | Dòng `Character` của Phương Chính, thay `green robe` bằng `plain academy robe`. | `sword` |

Không cần gen lại ảnh gốc của các nhân vật còn lại. Chỉ gen lại nếu muốn đồng bộ phong cách với Phương Nguyên; khi đó dùng dòng `Character` / `Animal` trong mục 4 của nhân vật.

---

## 4. Clip riêng từng nhân vật

Mỗi mục gồm:
- `Character` / `Animal`: dán vào `{CHARACTER}`.
- Negative riêng.
- Bảng clip: `atk`, `sk_...`, `win`. Cột "Dòng POSES" dán vào `{POSES}`.

**Đọc cột "Căn cứ":** cột này nói về **cơ chế / chiêu** có trong nguyên tác hay data game. **Động tác** trong dòng POSES mặc định là **dàn dựng mỹ thuật**, trừ khi ghi rõ `pose canon` (khi truyện tả đúng động tác, như Thanh Thư hất tóc phóng Tùng Châm ở ch 104).

Ví dụ: Hàn Bất Lưu chỉ huy chó là cơ chế có trong truyện, nhưng tư thế huýt sáo do mình dàn dựng. Cùng là người tộc Cổ Nguyệt **không** chứng minh ai cũng dùng Nguyệt Quang.

**Cột "Pose" là số tư thế bắt buộc:** script nhập ảnh đọc trực tiếp bảng này. Ảnh tách ra sai số tư thế bị từ chối; clip không có trong bảng cũng bị từ chối.

### Vai chính: clip riêng còn thiếu của bộ đã duyệt

#### 4.0a. `phuong_nguyen`: Phương Nguyên (Q1, ch 100–188)

Bộ chung và `win` đã duyệt, đã khóa. Ảnh tham chiếu: `assets/chibi_ref/phuong_nguyen_full.png`. Dòng `Character` lấy ở [PROMPT_MUSE_KEYPOSE_PN_BNB.md](PROMPT_MUSE_KEYPOSE_PN_BNB.md). Negative: `sword, weapon`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đấm | canon ch 104 ("dùng hai nắm đấm"), ch 100–131 (sức Bạch Thỉ + Hắc Thỉ) | 3 | `Poses: 3 poses of a cold efficient punch. Pose 1: low stance, right fist chambered at the hip, expressionless. Pose 2: heavy straight right punch fully extended, body behind it. Pose 3: fist pulled back to a guard, eyes still cold.` |
| sk_nguyet | Nguyệt Quang / Nguyệt Mang / Huyết Nguyệt | canon ch 12, 101, 136; động tác dàn dựng | 3 | Dùng tạm clip `cast` đã có. Chỉ gen lại nếu muốn động tác riêng. |
| sk_bachngoc | Bạch Ngọc | canon ch 100, 116 | 2 | `Poses: 2 poses of hardening the body. Pose 1: standing firm, fists clenched, chin up, not dodging. Pose 2: same stance, chest out, arms slightly spread, daring the enemy to strike.` |
| sk_cuongthu | Cường Thủ | canon ch 138, 143 | 3 | `Poses: 3 poses of a grabbing strike. Pose 1: right arm reaching far forward, fingers spread wide. Pose 2: fingers clenched shut, gripping. Pose 3: yanking the fist back hard toward the body.` |
| sk_cuxi | Cự Xỉ Kim Ngô | canon ch 186–188 | 2 | `Poses: 2 poses of commanding a gu. Pose 1: right arm raised, palm open upward. Pose 2: arm thrust forward pointing at the enemy, cold stare.` (con rết vàng là asset riêng) |
| sk_thienbong | Thiên Bồng | canon ch 155, 186 | 2 | `Poses: 2 poses of raising a light canopy. Pose 1: right hand raised straight up overhead. Pose 2: hand held high, other arm at the side, calm.` |

#### 4.0b. `bach_ngung_bang_nam`: Bạch Ngưng Băng nam (Q1, trước khi mất tay phải, ch 133–138)

Ảnh tham chiếu: `assets/chibi_ref/bach_ngung_bang_nam_full.png`. Dòng `Character` lấy ở [PROMPT_MUSE_KEYPOSE_PN_BNB.md](PROMPT_MUSE_KEYPOSE_PN_BNB.md). Negative: `female, girl, breasts, sword`. Bộ chung chưa khóa: người dùng duyệt xong thì chạy `--approve bnb`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Băng nhận phóng từ tay | canon ch 135, 172 (một tay phóng dải hàn băng); động tác dàn dựng | 3 | `Poses: 3 poses of a casual one-handed slash. Pose 1: standing relaxed, right hand lazily raised, smirking. Pose 2: hand flicked sideways in a wide horizontal arc, as if brushing off dust. Pose 3: hand lowered, arrogant grin.` |
| sk_locbangnhan | Lốc băng nhận | canon ch 140 | 3 | `Poses: 3 poses of unleashing full power. Pose 1: arms crossed over the chest, head bowed, hair rising. Pose 2: both arms flung wide, body spinning, hair whipping around. Pose 3: arms spread, head thrown back, wild laughter.` |
| sk_thuytrao | Thủy Tráo | canon ch 143 (cổ trên người BNB) | 2 | `Poses: 2 poses of raising a water shield. Pose 1: both palms turned outward at the sides. Pose 2: palms spread wide, chin raised, unconcerned.` |
| sk_suongyeu | Sương Yêu (hy sinh cổ để thoát) | canon ch 136; giới hạn 1 lần/trận là chuyển thể game | 2 | `Poses: 2 poses of a desperate escape. Pose 1: clutching the chest, gritting teeth. Pose 2: leaping far backward, arm thrown across the face.` |

### Q1: Thanh Mao Sơn

#### 4.1. `phuong_chinh`: Cổ Nguyệt Phương Chính

- **Era: Q1 sau khi hợp luyện Nguyệt Nghê Thường (ch 104 trở đi).** Bản học đường trước ch 104 không có `sk_nguyetnghe`; nếu cần thì làm id riêng `phuong_chinh_hoc`.
- Ảnh tham chiếu: `assets/chibi_ref/phuong_chinh_full.jpg` hoặc `chibi_ref/phuong_chinh.png`.
- `Character: young teenage boy, long black hair tied back with a green ribbon, earnest honest face, green robe, bare hands.`
- Negative: `sword, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of an earnest textbook palm strike. Pose 1: proper stance, right palm drawn back to the waist. Pose 2: stepping forward, right palm thrust straight out, back straight, serious face. Pose 3: returning to a proper stance.` |
| sk_nguyet | Nguyệt Quang | canon ch 60, 171 (Phương Chính dùng Nguyệt Quang); động tác dàn dựng | 3 | `Poses: 3 poses of casting a moonlight blade. Pose 1: right hand raised beside the head, fingers together, focused. Pose 2: arm swept forward and down in a clean diagonal cut, palm open, hair flowing. Pose 3: arm extended, holding the follow-through.` |
| sk_nguyetnghe | Nguyệt Nghê Thường (hộ thể, che được cả đồng đội) | **canon ch 104**: sương lam nhạt cô đọng thành dải lụa quấn eo, hai cánh tay, đoạn giữa bay trên đầu; tư thế là dàn dựng, dải lụa do code vẽ | 2 | `Poses: 2 poses of summoning a guardian sash. Pose 1: arms lifted slightly away from the body, palms down, eyes closed in focus. Pose 2: arms held out gracefully at the sides, chin raised, determined.` |
| win | — | art (ngay thẳng) | 1 | `Pose: standing straight, fists clenched at the sides, proud hopeful smile.` |

Chưa làm: Phong Nhận cổ (canon ch 171, dùng liên hoàn với Nguyệt Quang). Thêm `sk_phongnhan` khi cần.

#### 4.2. `thanh_thu`: Cổ Nguyệt Thanh Thư (dạng người, trước khi hy sinh)

- Era: Q1 trước ch 141.
- **Ngoại hình theo canon ch 104: tóc dài màu xanh** ("xanh" trong bản dịch có thể là lam hoặc lục). Ảnh gốc hiện có `chibi_ref/thanh_thu.png` là **tóc dài xanh lam, áo xanh lục**: khớp, không cần gen lại.
- `Character: calm young man, long flowing blue-green hair, gentle composed face, dark green robe.`
- Negative: `black hair, tree body, roots, wood armor, sword`
- Không khử ám xanh khi nhập (`NO_DESPILL` trong script đã có `thanh_thu`).

**Không** vẽ Mộc Mị biến thân cây trong các clip này. Đó là biến thân hy sinh (ch 141–142); nếu cần thì làm id riêng `thanh_thu_mocmi`. Cành Thanh Đằng là **cổ mọc ra từ lòng bàn tay**, khác với biến thân Mộc Mị.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Thanh Đằng cổ: cành xanh dài mọc từ **lòng bàn tay phải**, dùng như roi để vung, chém, quất | **canon ch 104, pose canon** (cầm cành như roi) | 3 | `Poses: 3 poses of a whip strike with a long thin green branch growing from the right palm. Pose 1: right arm raised behind, the green branch whip trailing back. Pose 2: arm lashed forward, the whip snapping straight ahead. Pose 3: arm low, whip curling on the ground.` |
| sk_tungcham | Tùng Châm cổ: **hất mái tóc dài**, mưa lá thông bắn ra từ tóc | **canon ch 104, pose canon** | 2 | `Poses: 2 poses of flicking the hair. Pose 1: head turned slightly away, long green hair gathered. Pose 2: head whipped forward, long green hair fanned out wide toward the enemy.` |
| sk_nguyettoan | Nguyệt Toàn cổ: **tay trái dựng thẳng**, ấn trăng non xanh lục trên lòng bàn tay, vung ra nguyệt nhận bay **đường cong** | **canon ch 104, pose canon** | 3 | `Poses: 3 poses of a left-hand cast. Pose 1: left hand raised upright, palm facing forward. Pose 2: left arm swung outward in a wide sweeping curve. Pose 3: left arm extended to the side.` |
| win | — | art (điềm đạm) | 1 | `Pose: standing calmly, hands clasped in front, gentle reassuring smile.` |



#### 4.3. `mac_bac`: Cổ Nguyệt Mạc Bắc

- Era: Q1 học đường.
- `Character: proud teenage boy, short dark hair, arrogant sneer, warm brown training clothes, bare hands.`
- Negative: `weapon, ox horns, rock armor`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art (kiêu ngạo, thô) | 3 | `Poses: 3 poses of a showy haymaker punch. Pose 1: winding up wide, chin raised, sneering. Pose 2: big swinging right hook. Pose 3: off balance after the swing, glaring.` |
| sk_drain | Hút chân nguyên | game (`EAI.macbac.sk='drain'`), chưa xác minh trong truyện | 2 | `Poses: 2 poses of a draining grab. Pose 1: reaching forward with a clawed open hand. Pose 2: pulling the clenched fist back to the chest, greedy grin.` |
| win | — | art | 1 | `Pose: arms crossed, chin up, smug laughing face.` |

#### 4.4. `xich_thanh`: Cổ Nguyệt Xích Thành

- `Character: small wary teenage boy, long black hair, ochre robe, bare hands.`
- Negative: `water, water shield, weapon`

Thủy Khiếu là cổ lừa tu vi, **không** phải phép nước.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art (rụt rè) | 3 | `Poses: 3 poses of a nervous quick jab. Pose 1: hunched, fists close to the face. Pose 2: quick short jab forward, eyes half closed. Pose 3: hopping back to a hunched guard.` |
| sk_nguyet | Nguyệt Quang | game: suy từ ch 12 (Nguyệt Quang là cổ công kích truyền thống của tộc), **chưa xác minh** Xích Thành dùng | 3 | Dùng dòng `sk_nguyet` của Phương Chính, thay `focused` bằng `nervous`. |
| win | — | art | 1 | `Pose: relieved small smile, scratching the back of the head.` |

#### 4.5. `hoc_duong_gia_lao`: Học đường gia lão

- `Character: stern elder teacher, grey hair in a topknot, grey formal robe, hands behind the back.`
- Negative: `weapon, staff`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of an elder's dismissive sleeve strike. Pose 1: one hand behind the back, other sleeve raised. Pose 2: sleeve swept horizontally outward. Pose 3: sleeve lowering, unimpressed face.` |
| sk_suppress | Uy áp | game (`EAI.gialao.sk='suppress'`) | 2 | `Poses: 2 poses of pressing down with authority. Pose 1: right palm raised high, stern glare. Pose 2: palm pressed downward toward the ground, robe billowing, commanding expression.` |
| win | — | art | 1 | `Pose: hands clasped behind the back, slight nod, stern satisfied face.` |

#### 4.6. `thiet_huyet_lanh`: Thiết Huyết Lãnh (thần bổ)

- Era: Q1 sau lang triều.
- `Character: stern mature man, short black hair, upright posture, dark armor with a dark cloak, a short iron chain wrapped around the right forearm.`
- Negative: `sword, needles, lightning`

Xích sắt có trong hồ sơ cũ (dùng với huyết tổ). Hình dáng xích là `art`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Quất xích sắt | hồ sơ cũ: xích trấn ma, chưa xác minh chương | 3 | `Poses: 3 poses of lashing an iron chain. Pose 1: right arm pulled back, chain hanging loose. Pose 2: arm whipped forward, chain extended straight ahead. Pose 3: chain recoiling back around the forearm.` |
| sk_chain | Xích trói | hồ sơ cũ, chưa xác minh | 3 | `Poses: 3 poses of binding with a chain. Pose 1: both hands holding the chain wide apart. Pose 2: throwing the chain forward in a loop. Pose 3: both hands yanking the chain back hard, feet planted.` |
| win | — | art (chính trực) | 1 | `Pose: standing upright, chain coiled in hand, cold justice gaze.` |

#### 4.7. `co_kim_sinh`: Cổ Kim Sinh

- Alias: bộ cũ gọi là Giả Kim Sinh. Game dùng Cổ Kim Sinh.
- `Character: scheming young merchant man, dark hair, sly smile, ochre traveling robe, bare hands.`
- Negative: `sword, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh lén | art (ch 46: định giết PN trong hang) | 3 | `Poses: 3 poses of a sneaky low strike. Pose 1: bowing politely with a fake smile, hand hidden. Pose 2: sudden low stab forward with stiff fingers. Pose 3: stepping back, sly grin.` |
| sk_drain | Hút chân nguyên | game (`EAI.kimsinh.sk='drain'`), chưa xác minh | 2 | Dùng dòng `sk_drain` của Mạc Bắc, thay `greedy grin` bằng `sly greedy grin`. |
| win | — | art | 1 | `Pose: rubbing hands together, greedy smile.` |

#### 4.8. `nhat_dai_boss`: Cổ Nguyệt Nhất Đại (Huyết Cương)

- Era: Q1 ch 180–200. Đứng lơ lửng.
- `Character: ancient corpse-like elder, gaunt pale skin, long tangled black hair and beard, ragged dark robes with blood-red trim, hovering slightly above the ground.`
- Negative: `wings, fangs, bats, weapon`

Đàn dơi máu là hiệu ứng riêng, không vẽ trong ảnh.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Vuốt máu | art | 3 | `Poses: 3 poses of a slow heavy claw swipe. Pose 1: clawed hand raised high, head tilted. Pose 2: hand slashing down diagonally. Pose 3: hand hanging low, empty stare.` |
| sk_blood | Gọi máu / huyết đạo | canon ch 180–200 (Huyết Hải truyền thừa); cách ra chiêu là `art` | 3 | `Poses: 3 poses of summoning blood power. Pose 1: both arms hanging, head bowed. Pose 2: both arms raised wide, head thrown back, mouth open. Pose 3: arms thrust forward, palms open.` |
| win | — | art | 1 | `Pose: floating upright, arms hanging, head tilted, eerie stillness.` |

#### 4.9. `dian_lang_boss`: Lôi Quan Lang / Lôi Quan Lang Vương

- Khóa game: `langvuong` (boss) và `loiquan` (thu nhỏ hoặc phủ màu khác). Cả hai trong data dùng **`sk:'thunder'`** (Lôi bạo, xuyên hộ thể), **không** dùng tru gọi bầy.
- Tru gọi bầy (`howl`) thuộc sói thường `dienlang` / `dlbay` / `cuongdienlang`, làm sprite riêng ở mục 4.9b.
- `Animal: huge four-legged wolf king, blue-grey fur, jagged spiky mane along the back, a short crown-like horn on the head, long muzzle, glowing blue eyes, side view facing right.`
- Negative: `standing on two legs, human hands, lightning, weapon`
- Khung: thêm `'dian_lang_boss': ((416, 240), (208, 228))` vào `FRAME_BY_ID`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Vồ cắn | art | 3 | `Poses: 3 poses of a pouncing bite. Pose 1: crouched low, hind legs coiled, fangs bared. Pose 2: leaping forward, jaws wide open, front claws extended. Pose 3: landing, head twisting, biting down.` |
| sk_thunder | Lôi bạo (sét trên sừng, xuyên hộ thể) | game (`EAI.langvuong/loiquan.sk='thunder'`); động tác dàn dựng | 3 | `Poses: 3 poses of charging lightning into the horn. Pose 1: head lowered, horn pointed forward, legs braced, fur bristling. Pose 2: head raised slightly, body tense, mane standing up. Pose 3: lunging head-first, horn thrust forward.` |
| win | — | art | 1 | `Pose: standing tall, chest out, head raised proudly.` |

#### 4.9b. `dien_lang`: Điện Lang thường (đề xuất, chưa có ảnh tham chiếu)

- Khóa game: `dienlang`, `dlbay` (bầy), `cuongdienlang` (Q2). Data dùng `sk:'howl'` (tru gọi bầy).
- Cần gen ảnh gốc trước theo mục 3b (`dien_lang_base_v1.png`).
- `Animal: lean four-legged grey wolf, crackling grey-blue fur, sharp ears, long muzzle, side view facing right.`
- Negative: `horn, crown, standing on two legs, lightning`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Cắn | art | 3 | Dùng dòng `atk` của Lôi Quan Lang. |
| roar | Tru gọi bầy | game (`SK.howl`) | 3 | `Poses: 3 poses of howling. Pose 1: head lowered, shoulders tense. Pose 2: head thrown up to the sky, mouth wide open howling. Pose 3: head coming down, snarling.` |
| win | — | art | 1 | `Pose: head raised, ears up, tail high.` |

#### 4.10. `heo_rung`: Heo rừng Thanh Mao

- `Animal: stocky wild boar, coarse brown-black bristles, short strong neck, curved yellow tusks, side view facing right.`
- Negative: `human hands, standing upright`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Húc nanh | art | 3 | `Poses: 3 poses of a tusk jab. Pose 1: head low, front legs braced. Pose 2: head swinging up sharply, tusks thrusting forward. Pose 3: head shaking, recovering.` |
| sk_charge | Húc thẳng | game (`SK.charge`) | 2 | `Poses: 2 poses of a charging run. Pose 1: hind legs digging in, head down, ready to charge. Pose 2: full gallop forward, head low, tusks leading.` |
| win | — | art | 1 | `Pose: snorting proudly, head raised, one front hoof pawing the ground.` |

#### 4.11. `hac_hung`: Hắc Hùng

- `Animal: heavy black bear on four legs, thick black fur, rounded ears, broad muzzle, large forepaws, side view facing right.`
- Negative: `human clothes, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Tát vuốt | art | 3 | `Poses: 3 poses of a paw swipe. Pose 1: rearing up slightly, right forepaw raised. Pose 2: forepaw swiping down hard. Pose 3: back on all fours, growling.` |
| sk_rage | Cuồng bạo | game (`SK.rage`) | 2 | `Poses: 2 poses of a berserk rage. Pose 1: standing up on hind legs, arms spread, roaring. Pose 2: beating its chest with both forepaws.` |
| win | — | art | 1 | `Pose: standing on hind legs, roaring at the sky.` |

#### 4.12. `thach_hau`: Thạch Hầu Vương

- `Animal: agile monkey with stone-grey fur, two arms, two legs, one tail, side view facing right.`
- Negative: `rock golem, extra tail, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Cào | art | 3 | `Poses: 3 poses of a leaping claw. Pose 1: crouched on all fours, tail up. Pose 2: leaping forward, both claws out. Pose 3: landing on hands and feet.` |
| sk_ambush | Đánh lén khi tàng hình (Ẩn Thạch cổ) | canon ch 115–116 | 2 | `Poses: 2 poses of an ambush. Pose 1: crouched very low and still, hugging the ground. Pose 2: springing up with a sudden upward claw slash.` |
| win | — | art | 1 | `Pose: sitting on its haunches, scratching its head, tail curled.` |

### Q2

#### 4.13. `ca_sau_sau_chan`: Cá sấu vương sáu chân

- **Ảnh gốc cũ chỉ thấy 4 chân: gen lại trước** (mục 3b).
- `Animal: long armored crocodile king with exactly six legs in three pairs along its long body, all six legs visible from the side, long toothy muzzle, heavy tail, dark green scales, side view facing right.`
- Negative: `four legs, wings`
- Khung: `((448, 208), (224, 198))`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Cắn | canon ch 207–227 (cá sấu vương sông Hoàng Long) | 3 | `Poses: 3 poses of a snapping bite. Pose 1: jaws closed, body low. Pose 2: lunging forward with jaws wide open. Pose 3: jaws snapped shut, head twisting.` |
| sk_rage | Quẫy đuôi cuồng bạo | game (`EAI.casauvuong.sk='rage'`) | 2 | `Poses: 2 poses of a tail sweep. Pose 1: body curved, tail swung far back. Pose 2: tail whipping around forward.` |
| win | — | art | 1 | `Pose: mouth wide open roaring, head raised.` |

#### 4.14. `ca_sau_dung_nham`: Cá sấu dung nham

- `Animal: four-legged crocodile with dark volcanic red scales and glowing ember cracks, side view facing right.`
- Negative: `fire body, flames, wings`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Cắn | art | 3 | Dùng dòng `atk` của cá sấu vương. |
| sk_spit | Phun cầu dung nham | game (`EN.casaunham`: "phun cầu dung nham"); chưa xác minh trong truyện | 2 | `Poses: 2 poses of spitting. Pose 1: head pulled back, cheeks puffed. Pose 2: head thrust forward, mouth wide open.` |
| win | — | art | 1 | `Pose: lying low, jaws half open, smug.` |

#### 4.15. `hien_vien_than_ke`: Hiên Viên Thần Kê (không đánh thường)

- `Animal: enormous proud rooster with five-colored plumage, two legs, two feathered wings, ornate tail, side view facing right.`
- Negative: `human`
- Gen `idle` và `warn`:
  - **warn:** `Poses: 2 poses of a warning display. Pose 1: wings spread wide, neck feathers raised. Pose 2: leaning forward, beak open, crowing.`

Không gen `atk`, `ko` hay `win`. Đây là cuộc chạm trán để tránh, không phải boss đánh thắng được (canon ch 218).

#### 4.16. `tran_thuy_hoa`: Trần Thúy Hoa

- Era: Q2 hành trình sông Hoàng Long (ch 222–224).
- `Character: middle-aged peasant woman, patched brown clothes, pale greenish sickly face, bare hands.`
- Negative: `fireball, weapon, male`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a desperate slap. Pose 1: arm raised high. Pose 2: hard downward slap. Pose 3: stepping back, glaring.` |
| cast_ground | Đặt bẫy Tiêu Lôi Thổ Đậu | canon ch 207–227 (có cổ Tiêu Lôi Thổ Đậu); cách đặt là `art` | 3 | `Poses: 3 poses of setting a trap. Pose 1: crouching, looking around. Pose 2: pressing both hands onto the ground. Pose 3: standing up, wicked grin.` |
| sk_poison | Độc | game (`EAI.thuyhoa.sk='poison'`) | 2 | `Poses: 2 poses of flicking poison. Pose 1: hand pulled back to the shoulder. Pose 2: hand flicked forward, fingers spread.` |
| win | — | art | 1 | `Pose: cackling with hands on hips.` |

#### 4.17. `phi_hau`: Phỉ Hầu

- `Animal: giant striped ape, yellow fur with black stripes, upper arms twice as thick as the thighs, two legs, side view facing right.`
- Negative: `small monkey, weapon`
- Khung: `((352, 240), (176, 228))`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đấm nện | canon ch 268 nói **cơ chế** (cánh tay trên to gấp đôi, sức cổ tay); cú nện hai tay là dàn dựng | 3 | `Poses: 3 poses of a hammer fist. Pose 1: both huge arms raised overhead. Pose 2: both fists slammed down to the ground. Pose 3: knuckles on the ground, growling.` |
| sk_rage | Cuồng bạo | game | 2 | Dùng dòng `sk_rage` của Hắc Hùng. |
| win | — | art | 1 | `Pose: flexing both huge arms, mouth open in a hoot.` |

#### 4.18. `phi_tuong`: Bạch Vũ Phi Tượng

- Lơ lửng.
- `Animal: white flying elephant covered in white fur, four legs, one trunk, two long tusks, hovering in the air, side view facing right.`
- Negative: `wings, feathers`
- Khung: `((416, 256), (208, 200))`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Quất vòi | art | 3 | `Poses: 3 poses of a trunk whip. Pose 1: trunk curled up high. Pose 2: trunk whipped forward. Pose 3: trunk swinging back.` |
| sk_charge | Bổ nhào xuống | game (`EN.phituong`: "bổ nhào xuống", `sk:'charge'`) | 2 | `Poses: 2 poses of a dive. Pose 1: rising high, body tilted up. Pose 2: diving down head-first, tusks forward.` |
| win | — | art | 1 | `Pose: hovering, trunk raised, trumpeting.` |

#### 4.19. `cuong_thi`: Cương thi Bạch Mao

Bản Hắc Mao làm id riêng `cuong_thi_hac`: lông đen, `sk:'drain'`, nhanh.

- `Character: stiff corpse-like zombie humanoid covered in long white hair, grey skin, torn dark clothes, arms stretched forward.`
- Negative: `black hair, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Vồ cứng đờ | art | 3 | `Poses: 3 poses of a stiff lunge. Pose 1: stiff upright, arms forward. Pose 2: hopping forward, clawed hands grabbing. Pose 3: stiffly upright again.` |
| sk_poison | Độc thi | game (`EAI.bachmao.sk='poison'`) | 2 | `Poses: 2 poses of breathing out poison. Pose 1: head tilted back. Pose 2: head thrust forward, mouth open.` |
| win | — | art | 1 | Dùng tư thế idle 1 (đứng cứng). Có thể bỏ clip này. |

#### 4.20. `tuu_khoi_huyet_khoi`: Tửu Khôi

Biến thể Tửu Khôi. Huyết Khôi làm id riêng `huyet_khoi`. Tạo hình là chuyển thể game, chưa xác minh trong truyện.

- `Character: squat clay humanoid puppet made of cracked wine jars, heavy round body.`
- Negative: `blood, human face, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đập | art | 3 | `Poses: 3 poses of a heavy slam. Pose 1: both arms raised. Pose 2: arms slammed forward. Pose 3: arms dragging on the ground.` |
| sk_regen | Tái tụ | game (`SK.regen`) | 2 | `Poses: 2 poses of reassembling. Pose 1: body slumped, cracks visible. Pose 2: standing upright again, arms spread.` |

#### 4.21. `huyet_thu_ma_tu`: Huyết thủ ma tu

Archetype game, danh tính trong truyện chưa xác minh.

- `Character: hostile demonic cultivator, ragged dark-red robe, forearms stained red, fierce face, bare hands.`
- Negative: `weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Trảo máu | art | 3 | `Poses: 3 poses of a red-handed claw. Pose 1: clawed hand pulled back. Pose 2: claw slashing forward. Pose 3: licking fingers, grinning.` |
| sk_drain | Hút máu | game | 2 | Dùng dòng `sk_drain` của Mạc Bắc. |
| win | — | art | 1 | `Pose: arms spread, maniacal laughter.` |

#### 4.22. `au_duong_cong`: Âu Dương Công

- Era: Q2 thương đội (ch 258–294).
- `Character: authoritative middle-aged merchant cultivator, black hair in a topknot, dark beard, dark navy robe with broad sleeves, bare hands.`
- Negative: `insects, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đòn tay áo | art | 3 | `Poses: 3 poses of a sleeve-hidden palm. Pose 1: sleeve raised to hide the hand. Pose 2: sleeve swept aside, palm striking forward. Pose 3: smoothing the sleeve, calm.` |
| sk_suppress | Uy áp | game (`EAI.auduongcong.sk='suppress'`) | 2 | Dùng dòng `sk_suppress` của gia lão, thay `stern glare` bằng `arrogant glare`. |
| win | — | art | 1 | `Pose: stroking the beard, contemptuous smile.` |

#### 4.23. `bach_chien_liep`: Bách Chiến Liệp

- `Character: lean young man, dark hair, vengeful eyes, practical pale-blue clothes, bare hands.`
- Negative: `bow, crossbow, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of an angry straight punch. Pose 1: fists raised, glaring. Pose 2: lunging straight punch. Pose 3: following up with a knee raised.` |
| sk_charge | Lao tới | game (`EAI.bachchienliep.sk='charge'`) | 2 | `Poses: 2 poses of a shoulder charge. Pose 1: low crouch, shoulder forward. Pose 2: bursting forward shoulder-first.` |
| win | — | art | 1 | `Pose: fist raised, shouting in triumph.` |

#### 4.24. `bach_chien_on`: Bách Chiến Ôn (dạng người)

- `Character: elderly man, long white hair and beard, deep red clan robe, bare hands.`
- Negative: `fire body, flames`

Hỏa Nhân (thân hóa lửa, đồng quy vu tận, ch 228–250) là **biến thể riêng** `bach_chien_on_hoanhan`. Không vẽ trong clip thường.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chưởng | art | 3 | `Poses: 3 poses of an old master's palm. Pose 1: palm drawn back, stern. Pose 2: heavy palm strike forward. Pose 3: palm lowered, breathing hard.` |
| sk_rage | Liều mạng | game (`EAI.bachchienon.sk='rage'`) | 2 | `Poses: 2 poses of gathering fury. Pose 1: fists clenched at the sides, trembling. Pose 2: head raised, shouting, robes flaring.` |
| win | — | art | 1 | `Pose: hands behind the back, grim nod.` |

#### 4.25. `bach_lien`: Bách Liên

- `Character: composed young woman, long black hair with small white flower hair ornaments, modest white robe, calm face, bare hands.`
- Negative: `lotus magic, glowing flowers, fan, male, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a graceful palm. Pose 1: hand raised elegantly. Pose 2: light quick palm strike. Pose 3: stepping back gracefully.` |
| sk_anxiety | Cổ gây lo âu, tầm gần 10 bước | canon ch 235 | 2 | `Poses: 2 poses of a subtle charm. Pose 1: hand touching her own chest, eyes lowered. Pose 2: tilting her head toward the enemy, faint knowing smile.` |
| win | — | art | 1 | `Pose: hands folded, polite smile.` |

#### 4.26. `thiet_nhuoc_nam`: Thiết Nhược Nam (Q2, ch 442–447)

- **Era: Q2 trận Thiết gia ch 442–447**, còn tóc dài buộc. Sau ch 453–455 cô cắt tóc, lạnh lùng hơn: nếu cần thì làm id riêng `thiet_nhuoc_nam_q2b`. Bản Q1 (điều tra) cũng cần id riêng `thiet_nhuoc_nam_q1`.
- `Character: determined young woman, long dark hair tied back, practical dark armor, bare hands.`
- Negative: `needles, sword, male, soldiers`
- Thảo binh là **unit riêng**, không vẽ vào sheet.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a disciplined punch. Pose 1: guard stance. Pose 2: straight punch. Pose 3: back to guard.` |
| sk_command | Thảo Khôi cổ tạo Đằng Giáp Thảo Binh (nô đạo), dồn quân | **canon ch 443, 445**; động tác ra lệnh là dàn dựng | 2 | `Poses: 2 poses of commanding. Pose 1: hand raised high. Pose 2: arm sweeping forward, pointing at the enemy.` |
| win | — | art | 1 | `Pose: standing firm, determined look, fist at the chest.` |

#### 4.27. `cu_khai_bi`: Cự Khai Bi

- Era: Q2 diễn võ trường. Tứ chuyển lực tu, cao tám thước, nghiêm cẩn (canon ch 295–390).
- `Character: very tall muscular fighter, heavy pale ivory armor, disciplined stern face, bare hands.`
- Negative: `rock shield, giant, weapon`
- Khung: `((320, 240), (160, 228))`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Quyền lực đạo | canon (lực tu) | 3 | `Poses: 3 poses of a disciplined heavy punch. Pose 1: deep stance, fist chambered at the hip. Pose 2: powerful straight punch, footwork planted. Pose 3: retracting, steady guard.` |
| sk_power | Bùng lực | game (lực đạo); cách ra chiêu là `art` | 2 | `Poses: 2 poses of bursting strength. Pose 1: arms crossed, muscles tense. Pose 2: arms thrown outward, roaring.` |
| win | — | art | 1 | `Pose: fist to palm salute, stern nod.` |

#### 4.28. `viem_dot`: Viêm Đột

- Era: Q2 diễn võ trường. Tứ chuyển hỏa đạo (canon ch 295–390).
- `Character: thin wizened old man like a beggar, sparse hair, long fingernails, ragged clothes.`
- Negative: `muscular, red hair, tattoos, weapon`

Hỏa Thủ ba móng là hiệu ứng. **Không** sửa tay thật thành ba ngón.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Cào | art | 3 | `Poses: 3 poses of a long-nailed claw. Pose 1: hunched, nails raised. Pose 2: quick claw slash forward. Pose 3: hunched again, cackling.` |
| sk_firehand | Hỏa Thủ | hồ sơ cũ (Hỏa Thủ ba móng) | 3 | `Poses: 3 poses of a fire hand strike. Pose 1: right hand raised, fingers spread. Pose 2: hand thrust forward, fingers clawed. Pose 3: hand pulled back, grinning.` |
| win | — | art | 1 | `Pose: hunched, rubbing hands, wheezing laughter.` |

#### 4.29. `thiet_dao_kho`: Thiết Đao Khổ (Q2, ch 443–445)

Chiêu theo canon ch 443–445: Tấn Ảnh, **Thủ Nhận**, Thiết Thủ, **Liên Trảm**, Tốc Chiến Phong, **Đao Khí** (phá được Kim Cương, rạch da đồng). Lưỡi dao là **cạnh bàn tay**.

- **Ảnh gốc cũ cầm dao: gen lại trước** (mục 3b).
- `Character: resolute adult man, short black hair, stern face, practical dark armor, both hands empty, right hand held flat and straight like a blade.`
- Negative: `sword, saber, knife, dagger, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Thủ Nhận (chém cạnh tay) | canon ch 443, 445; động tác dàn dựng | 3 | `Poses: 3 poses of a hand-blade chop. Pose 1: hand-blade raised beside the head. Pose 2: hand-blade chopped diagonally down. Pose 3: hand-blade held low, ready.` |
| sk_flurry | Liên Trảm | canon ch 445 | 3 | `Poses: 3 poses of rapid hand-blade slashes. Pose 1: both hand-blades crossed. Pose 2: left slash outward. Pose 3: right slash outward.` |
| sk_daokhi | Đao Khí (chém xa) | canon ch 444–445 | 2 | `Poses: 2 poses of a ranged hand-blade slash. Pose 1: hand-blade drawn far back across the body. Pose 2: hand-blade swung out wide and fully extended toward the enemy.` |
| win | — | art (chính trực) | 1 | `Pose: hand-blade lowered, upright, solemn.` |

#### 4.30. `hoanh_mi`: Hoành Mi Bạo Quân

- Q2 Tam Xoa, Tứ trung lực tu (canon ch 407–438).
- `Character: bulky brutish man with a broad brow, rough sleeveless clothes, swaggering.`
- Negative: `weapon`

Bạo Lực cổ phồng người là **biến thể riêng** `hoanh_mi_baoluc`, không phóng to sprite.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đấm bạo lực | canon (lực tu) | 3 | `Poses: 3 poses of a brutal punch. Pose 1: shoulder rolled back. Pose 2: wild overhand punch. Pose 3: laughing, fist still forward.` |
| sk_rage | Cuồng bạo | game (`EAI.hoanhmi.sk='rage'`) | 2 | Dùng dòng `sk_power` của Cự Khai Bi, thay `roaring` bằng `laughing madly`. |
| win | — | art | 1 | `Pose: foot raised as if stomping, laughing.` |

#### 4.31. `tiet_tam_tu`: Tiết Tam Tứ (dạng người)

- `Character: athletic woman, hair tied back, practical dark clothes, bare hands.`
- Negative: `wings, tiger, male`

Bưu / Xung Thiên Hổ (hư ảnh hổ có cánh) là hiệu ứng hoặc biến thể riêng.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đá | art | 3 | `Poses: 3 poses of a spinning kick. Pose 1: turning, leg chambered. Pose 2: high kick forward. Pose 3: landing in a fighting stance.` |
| sk_dive | Xung Thiên Hổ: bay lên rồi lao xuống | canon ch 419 | 2 | `Poses: 2 poses of a diving strike. Pose 1: leaping high, knees tucked, fist raised. Pose 2: plunging down fist-first.` |
| win | — | art | 1 | `Pose: hands on hips, fierce grin.` |

#### 4.32. `han_bat_luu`: Hàn Bất Lưu

- Q2, 48 tuổi, Tứ chuyển nô đạo, chỉ huy chó (canon ch 425–426). Chó là unit riêng.
- `Character: weathered middle-aged man, practical traveling clothes, stern face, bare hands.`
- Negative: `dogs, bell, staff, old wizard`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a practical punch. Pose 1: guard. Pose 2: straight punch. Pose 3: guard.` |
| sk_command | Ra lệnh bầy chó | canon ch 425–426 nói **cơ chế** (nô đạo chỉ huy chó); huýt sáo và chỉ tay là dàn dựng | 2 | `Poses: 2 poses of commanding dogs. Pose 1: two fingers at the mouth whistling. Pose 2: arm thrust forward pointing, shouting an order.` |
| win | — | art | 1 | `Pose: arms crossed, cold nod.` |

#### 4.33. `vu_quy`: Vu Quỷ Ô Cật

- Q2 Ngũ chuyển đỉnh phong Hồn đạo / Nô đạo (canon ch 460–461). Chiếm Khuyển Vương truyền thừa, điều khiển bầy chó (ch 462–485).
- `Character: gaunt sinister old man, thin face, dark loose robe.`
- Negative: `staff, skull, skeleton, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chỉ tay | art | 3 | `Poses: 3 poses of a cursing point. Pose 1: hand raised, fingers curled. Pose 2: finger jabbed forward. Pose 3: hand withdrawn into the sleeve.` |
| sk_cloudhand | Bàn tay mây đen khổng lồ đập xuống (hiệu ứng do code vẽ) | **canon ch 460–461**; động tác dàn dựng | 3 | `Poses: 3 poses of summoning a giant hand. Pose 1: both arms raised. Pose 2: arms swung down together. Pose 3: palms pressed down, evil smile.` |
| win | — | art | 1 | `Pose: hunched, hands in sleeves, sinister smile.` |

#### 4.34. `thiet_mo_bach`: Thiết Mộ Bạch

- Q2 Ngũ chuyển đỉnh phong Kim đạo. Giáng lâm Tam Xoa ch 456–457 (khí tức kim quang áp đảo núi), đấu Ô Cật ch 460–461 ("hóa kim quang xé rách mây đen"), bị Phương Nguyên ám sát trong phúc địa ch 477.
- `Character: venerable old master, long white beard, formal muted-gold robe.`
- Negative: `sword, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chưởng | art | 3 | `Poses: 3 poses of a calm palm. Pose 1: palm raised before the chest. Pose 2: palm pushed forward slowly. Pose 3: palm lowered.` |
| sk_kimquang | Hóa kim quang (áp đảo / xé mây) | **canon ch 456–457, 460–461**; động tác dàn dựng, ánh vàng do code vẽ | 2 | `Poses: 2 poses of unleashing golden power. Pose 1: arms lowered, robes still, eyes closed. Pose 2: arms spread wide, robes and beard blown back, eyes open.` |
| win | — | art | 1 | `Pose: stroking the beard, serene.` |

Đã bỏ `sk_sweep` của bản trước: chiêu này dẫn nhầm ch 450 (ch 450 là sự kiện truyền thừa Hồ Tiên).

#### 4.35. `thiet_ba_tu`: Thiết Bá Tu

- Q2, "Bá Vương Đương Thời" (canon ch 443–449). Thổ Bá Vương: phải đứng trên đất.
- `Character: massive muscular mature man, short hair, stern face, practical dark armor, bare hands.`
- Negative: `boulder, weapon`
- Khung: `((320, 240), (160, 228))`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đấm Bá Vương | canon ch 443: Bá Lực cổ + Thổ Bá Vương cổ (hút sức từ đất, phải đứng trên đất); động tác dàn dựng | 3 | `Poses: 3 poses of a grounded heavy punch. Pose 1: deep wide stance, feet planted. Pose 2: massive straight punch, feet still planted. Pose 3: returning, still grounded.` |
| sk_regen | Tái tụ | game (`EAI.thietbatu.sk='regen'`) | 2 | `Poses: 2 poses of steadying. Pose 1: one knee down, palm on the ground. Pose 2: rising up, chest out.` |
| win | — | art | 1 | `Pose: arms folded, towering, unimpressed.` |

#### 4.36. `ba_quy_spirit`: Bá Quy địa linh (không đánh)

- `Animal: ancient weary giant turtle, rigid shell, four limbs, short neck, intelligent gaze, side view facing right.`
- Gen `idle` và `warn` theo mục 2. Không gen `atk`, `ko`, `win`.

---

## 5. Tổng hợp số ảnh cần gen

Không tính PN và BNB đã xong. Đếm theo bảng trên:

| Nhóm | Nhân vật | Clip chung | Clip riêng | Ảnh |
|---|---|---|---|---|
| Boss người: Thiết Huyết Lãnh, Nhất Đại, gia lão, Âu Dương Công, Bách Chiến Ôn, Cự Khai Bi, Viêm Đột, Thiết Đao Khổ, Hoành Mi, Tiết Tam Tứ, Ô Cật, Thiết Mộ Bạch, Thiết Bá Tu | 13 | 5 | 3 | 104 |
| Người thường: Phương Chính, Thanh Thư, Mạc Bắc, Xích Thành, Kim Sinh, Trần Thúy Hoa, Huyết thủ ma tu, Bách Chiến Liệp, Bách Liên, Nhược Nam, Hàn Bất Lưu | 11 | 4 | 3–4 | khoảng 80 |
| Thú, cương thi, khôi: Lôi Quan Lang Vương, heo, gấu, Thạch Hầu, 2 cá sấu, Phỉ Hầu, Phi Tượng, cương thi, Tửu Khôi | 10 | 4 | 2–4 | khoảng 70 |
| Không chiến đấu: Hiên Viên Thần Kê, Bá Quy | 2 | 2 | 0 | 4 |
| **Cộng** | **36** | | | **khoảng 260 ảnh** |

Chưa tính các biến thể làm sau: `bach_ngung_bang` nữ Q2, `thanh_thu_mocmi`, `bach_chien_on_hoanhan`, `hoanh_mi_baoluc`, `cuong_thi_hac`, `huyet_khoi`, `thiet_nhuoc_nam_q1`, sói Điện Lang thường (mục 4.9b đã có prompt, chờ ảnh gốc).

Nên làm theo đợt: 2 mẫu kiểm tra → boss Q1 → phần còn lại. Đợt nào được duyệt mới làm đợt kế.

---

## 6. Thay đổi theo review của blue-chan (02/10/2026)

Đã đối chiếu lại chương 104 qua API `cochannhann.pages.dev/api/chapters/104`, vì trang truyenmoiss.org không còn truy cập được. Các mốc Q2 lấy theo `docs/reference/CHI_TIET_NGUYEN_TAC_Q2.md`.

- **Thanh Thư:**
  - Sửa tóc thành **dài màu xanh** (ch 104).
  - Ba chiêu có pose canon: Thanh Đằng (roi cành mọc từ lòng bàn tay phải), Tùng Châm (hất tóc), Nguyệt Toàn (tay trái, nguyệt nhận bay đường cong).
  - Bỏ Nguyệt Quang dùng chung. Thêm bước gen ảnh gốc mới.
- **Phương Chính:** Nguyệt Nghê Thường đổi thành canon ch 104 (dải lụa quấn eo và hai tay). Era tính từ ch 104 trở đi; tư thế ghi là dàn dựng.
- **Nhược Nam:** era ch 442–447, căn cứ Thảo Khôi cổ / Đằng Giáp Thảo Binh ở ch 443. Ghi chú bản cắt tóc sau ch 453–455.
- **Thiết Mộ Bạch:** bỏ `sk_sweep` (dẫn nhầm ch 450). Thay bằng `sk_kimquang`, căn cứ ch 456–457 và 460–461.
- **Điện Lang:**
  - `dian_lang_boss` (`langvuong` / `loiquan`) chỉ dùng `sk_thunder` đúng data.
  - Tru gọi bầy chuyển sang sprite sói thường `dien_lang` (mục 4.9b).
- **Thiết Đao Khổ:** thêm `sk_daokhi` (Đao Khí đánh xa, ch 444–445).
- **Ô Cật, Thiết Bá Tu:** thêm chương căn cứ.
- **Hàn Bất Lưu, Phỉ Hầu, Xích Thành:** ghi rõ chỉ cơ chế có căn cứ, còn động tác là dàn dựng; Nguyệt Quang của Xích Thành ghi là chưa xác minh.
- **Thêm mục 4.0:** clip riêng còn thiếu của Phương Nguyên và Bạch Ngưng Băng.
- **Script nhập ảnh** (`tools/keypose_import.py`):
  - Tách tên file bằng cách thử mọi chỗ cắt, ưu tiên id đã biết.
  - Số pose của clip riêng đọc từ bảng trong file này; thiếu hoặc sai thì từ chối.
  - Khóa bản đã duyệt bằng `--approve` / `tools/keypose_approved.json`. Bộ Phương Nguyên đã khóa.
  - Khử ám xanh chỉ áp dụng cho xanh tươi kiểu nền; tắt hẳn với `phuong_chinh`, `thanh_thu`, `hoc_duong_gia_lao`.

**Việc còn mở:** các mô tả còn lại chưa đọc lại từng chương; vẫn coi là thiết kế mỹ thuật cho tới khi xác minh.
