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

1. **Mẫu kiểm tra** (theo đề nghị của blue-chan):
   - `phuong_chinh`: áo xanh, để thử lỗi áo xanh vừa sửa trong script.
   - `dian_lang_boss`: thú lớn, có `roar`.
2. Boss Q1: `thiet_huyet_lanh`, `nhat_dai_boss`, `hoc_duong_gia_lao`, `heo_rung`, `hac_hung`, `thach_hau`.
3. Nhân vật Q1 còn lại, sau đó tới Q2.

Mỗi nhân vật gen `idle` + `atk` trước, xem bằng mắt rồi mới làm tiếp.

---

## 4. Clip riêng từng nhân vật

Mỗi mục gồm:
- `Character` / `Animal`: dán vào `{CHARACTER}`.
- Negative riêng.
- Bảng clip: `atk`, `sk_...`, `win`. Cột "Dòng POSES" dán vào `{POSES}`.

### Q1: Thanh Mao Sơn

#### 4.1. `phuong_chinh`: Cổ Nguyệt Phương Chính

- Era: Q1 học đường. Ảnh tham chiếu: `assets/chibi_ref/phuong_chinh_full.jpg`, hoặc `chibi_ref/phuong_chinh.png`.
- `Character: young teenage boy, short neat black hair, earnest honest face, green training robe, bare hands.`
- Negative: `sword, weapon, long hair`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of an earnest textbook palm strike. Pose 1: proper stance, right palm drawn back to the waist. Pose 2: stepping forward, right palm thrust straight out, back straight, serious face. Pose 3: returning to a proper stance.` |
| sk_nguyet | Nguyệt Quang (cổ truyền thống tộc Cổ Nguyệt) | canon ch12, ch60 | 3 | `Poses: 3 poses of casting a moonlight blade. Pose 1: right hand raised beside the head, fingers together, focused. Pose 2: arm swept forward and down in a clean diagonal cut, palm open, hair flowing. Pose 3: arm extended, holding the follow-through.` |
| sk_nguyetnghe | Nguyệt Nghê Thường (hộ thể) | game (`GU.nguyetnghe`: "cổ của Phương Chính") | 2 | `Poses: 2 poses of raising a protective ribbon. Pose 1: both arms sweeping up and outward in a circle. Pose 2: arms spread wide at shoulder height, chest out, determined.` |
| win | — | art (tính cách ngay thẳng) | 1 | `Pose: standing straight, fists clenched at the sides, proud hopeful smile.` |

#### 4.2. `thanh_thu`: Cổ Nguyệt Thanh Thư (dạng người, trước khi hy sinh)

- Era: Q1 trước ch 141.
- `Character: calm young man, black hair tied back, gentle face, dark green robe, bare hands.`
- Negative: `vines, tree, wood armor, roots, weapon`

**Không** vẽ Mộc Mị biến thân cây trong các clip này. Đó là biến thân hy sinh (ch 141–142); nếu cần thì làm biến thể riêng `thanh_thu_mocmi`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a restrained palm push. Pose 1: weight shifting back, left palm forward guarding. Pose 2: smooth step, right palm pushing forward gently but firmly. Pose 3: returning, hands lowered calmly.` |
| sk_nguyet | Nguyệt Quang | canon ch12 (cổ truyền thống tộc) | 3 | Dùng dòng `sk_nguyet` của Phương Chính, nhưng thay `focused` bằng `calm`. |
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

- `Character: small wary teenage boy, neat dark hair, ochre robe, bare hands.`
- Negative: `water, water shield, weapon`

Thủy Khiếu là cổ lừa tu vi, **không** phải phép nước.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art (rụt rè) | 3 | `Poses: 3 poses of a nervous quick jab. Pose 1: hunched, fists close to the face. Pose 2: quick short jab forward, eyes half closed. Pose 3: hopping back to a hunched guard.` |
| sk_nguyet | Nguyệt Quang | canon ch12 (cổ truyền thống tộc) | 3 | Dùng dòng `sk_nguyet` của Phương Chính, thay `focused` bằng `nervous`. |
| win | — | art | 1 | `Pose: relieved small smile, scratching the back of the head.` |

#### 4.5. `hoc_duong_gia_lao`: Học đường gia lão

- `Character: stern elder teacher, grey hair in a topknot, dark green formal robe, hands behind the back.`
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
- `Character: ancient corpse-like elder, gaunt grey skin, long tangled grey hair, ragged dark-red robes, hovering slightly above the ground.`
- Negative: `wings, fangs, bats, weapon`

Đàn dơi máu là hiệu ứng riêng, không vẽ trong ảnh.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Vuốt máu | art | 3 | `Poses: 3 poses of a slow heavy claw swipe. Pose 1: clawed hand raised high, head tilted. Pose 2: hand slashing down diagonally. Pose 3: hand hanging low, empty stare.` |
| sk_blood | Gọi máu / huyết đạo | canon ch 180–200 (Huyết Hải truyền thừa); cách ra chiêu là `art` | 3 | `Poses: 3 poses of summoning blood power. Pose 1: both arms hanging, head bowed. Pose 2: both arms raised wide, head thrown back, mouth open. Pose 3: arms thrust forward, palms open.` |
| win | — | art | 1 | `Pose: floating upright, arms hanging, head tilted, eerie stillness.` |

#### 4.9. `dian_lang_boss`: Lôi Quan Lang Vương

- Khóa game: `langvuong`. Tạm dùng chung cho `loiquan` (thu nhỏ).
- `Animal: huge four-legged wolf king, blue-grey fur, jagged spiky mane along the back, a short crown-like horn on the head, long muzzle, glowing blue eyes, side view facing right.`
- Negative: `standing on two legs, human hands, lightning, weapon`
- Khung: thêm `'dian_lang_boss': ((416, 240), (208, 228))` vào `FRAME_BY_ID`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Vồ cắn | art | 3 | `Poses: 3 poses of a pouncing bite. Pose 1: crouched low, hind legs coiled, fangs bared. Pose 2: leaping forward, jaws wide open, front claws extended. Pose 3: landing, head twisting, biting down.` |
| roar | Tru gọi bầy | game (`SK.howl`) | 3 | `Poses: 3 poses of howling. Pose 1: head lowered, shoulders tense. Pose 2: head thrown up to the sky, mouth wide open howling. Pose 3: head coming down, snarling.` |
| sk_thunder | Lôi bạo (sét trên sừng) | game (`SK.thunder`) | 2 | `Poses: 2 poses of charging lightning. Pose 1: head lowered, horn pointed forward, legs braced, fur bristling. Pose 2: lunging head-first, horn thrust forward.` |
| win | — | art | 1 | `Pose: standing tall on a high stance, chest out, head raised proudly.` |

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

- `Animal: long armored crocodile king with exactly six legs (three pairs), long toothy muzzle, heavy tail, side view facing right.`
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
| atk | Đấm nện | canon ch 268 (cánh tay trên to gấp đôi, sức cổ tay) | 3 | `Poses: 3 poses of a hammer fist. Pose 1: both huge arms raised overhead. Pose 2: both fists slammed down to the ground. Pose 3: knuckles on the ground, growling.` |
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
- `Character: authoritative middle-aged merchant cultivator, dark beard, broad purple sleeves, bare hands.`
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

- `Character: elderly man, grey hair, sober white-and-grey clan robes, bare hands.`
- Negative: `fire body, flames`

Hỏa Nhân (thân hóa lửa, đồng quy vu tận, ch 228–250) là **biến thể riêng** `bach_chien_on_hoanhan`. Không vẽ trong clip thường.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chưởng | art | 3 | `Poses: 3 poses of an old master's palm. Pose 1: palm drawn back, stern. Pose 2: heavy palm strike forward. Pose 3: palm lowered, breathing hard.` |
| sk_rage | Liều mạng | game (`EAI.bachchienon.sk='rage'`) | 2 | `Poses: 2 poses of gathering fury. Pose 1: fists clenched at the sides, trembling. Pose 2: head raised, shouting, robes flaring.` |
| win | — | art | 1 | `Pose: hands behind the back, grim nod.` |

#### 4.25. `bach_lien`: Bách Liên

- `Character: composed young woman, modest light-colored robes, calm face, bare hands.`
- Negative: `lotus, flowers, fan, male, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a graceful palm. Pose 1: hand raised elegantly. Pose 2: light quick palm strike. Pose 3: stepping back gracefully.` |
| sk_anxiety | Cổ gây lo âu, tầm gần 10 bước | canon ch 235 | 2 | `Poses: 2 poses of a subtle charm. Pose 1: hand touching her own chest, eyes lowered. Pose 2: tilting her head toward the enemy, faint knowing smile.` |
| win | — | art | 1 | `Pose: hands folded, polite smile.` |

#### 4.26. `thiet_nhuoc_nam`: Thiết Nhược Nam

- Era: **Q2** (ch 443–449). Thảo binh là unit riêng, không vẽ.
- `Character: determined young woman, dark hair tied back, practical dark armor, bare hands.`
- Negative: `needles, sword, male, soldiers`

Bản Q1 (điều tra) cần id riêng `thiet_nhuoc_nam_q1` nếu dùng.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đánh tay | art | 3 | `Poses: 3 poses of a disciplined punch. Pose 1: guard stance. Pose 2: straight punch. Pose 3: back to guard.` |
| sk_command | Ra lệnh thảo binh (nô đạo) | hồ sơ cũ + canon ch 450–465 (Thiết Mộ Bạch dạy nô đạo) | 2 | `Poses: 2 poses of commanding. Pose 1: hand raised high. Pose 2: arm sweeping forward, pointing at the enemy.` |
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

#### 4.29. `thiet_dao_kho`: Thiết Đao Khổ

Thủ Nhận / Thiết Thủ / liên trảm (hồ sơ cũ). **Cạnh bàn tay** là lưỡi dao.

- `Character: resolute adult man, practical dark armor, right hand held flat like a blade.`
- Negative: `sword, saber, knife`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chém cạnh tay | hồ sơ cũ | 3 | `Poses: 3 poses of a hand-blade chop. Pose 1: hand-blade raised beside the head. Pose 2: hand-blade chopped diagonally down. Pose 3: hand-blade held low, ready.` |
| sk_flurry | Liên trảm | hồ sơ cũ | 3 | `Poses: 3 poses of rapid hand-blade slashes. Pose 1: both hand-blades crossed. Pose 2: left slash outward. Pose 3: right slash outward.` |
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
| sk_command | Ra lệnh bầy chó | canon | 2 | `Poses: 2 poses of commanding dogs. Pose 1: two fingers at the mouth whistling. Pose 2: arm thrust forward pointing, shouting an order.` |
| win | — | art | 1 | `Pose: arms crossed, cold nod.` |

#### 4.33. `vu_quy`: Vu Quỷ Ô Cật

- Q2 Ngũ chuyển ma đạo (canon ch 450–465). Bàn tay mây đen là hiệu ứng.
- `Character: gaunt sinister old man, thin face, dark loose robe.`
- Negative: `staff, skull, skeleton, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chỉ tay | art | 3 | `Poses: 3 poses of a cursing point. Pose 1: hand raised, fingers curled. Pose 2: finger jabbed forward. Pose 3: hand withdrawn into the sleeve.` |
| sk_cloudhand | Bàn tay mây đen | hồ sơ cũ | 3 | `Poses: 3 poses of summoning a giant hand. Pose 1: both arms raised. Pose 2: arms swung down together. Pose 3: palms pressed down, evil smile.` |
| win | — | art | 1 | `Pose: hunched, hands in sleeves, sinister smile.` |

#### 4.34. `thiet_mo_bach`: Thiết Mộ Bạch

- Q2 Ngũ chuyển kim đạo (canon ch 450–465).
- `Character: venerable old master, long white beard, formal muted-gold robe.`
- Negative: `sword, weapon`

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Chưởng kim quang | art | 3 | `Poses: 3 poses of a calm palm. Pose 1: palm raised before the chest. Pose 2: palm pushed forward slowly. Pose 3: palm lowered.` |
| sk_sweep | Quét ngang kim quang | canon (Thiết Mộ Bạch quét ngang, ch 450) | 2 | `Poses: 2 poses of a sweeping arm. Pose 1: arm drawn across the body. Pose 2: arm swept wide outward, robes flaring.` |
| win | — | art | 1 | `Pose: stroking the beard, serene.` |

#### 4.35. `thiet_ba_tu`: Thiết Bá Tu

- Q2, "Bá Vương Đương Thời" (canon ch 443–449). Thổ Bá Vương: phải đứng trên đất.
- `Character: massive muscular mature man, short hair, stern face, practical dark armor, bare hands.`
- Negative: `boulder, weapon`
- Khung: `((320, 240), (160, 228))`.

| clip | Dùng cho | Căn cứ | Pose | Dòng POSES |
|---|---|---|---|---|
| atk | Đấm Bá Vương | hồ sơ cũ (lực đạo) | 3 | `Poses: 3 poses of a grounded heavy punch. Pose 1: deep wide stance, feet planted. Pose 2: massive straight punch, feet still planted. Pose 3: returning, still grounded.` |
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

Chưa tính các biến thể làm sau: `bach_ngung_bang` nữ Q2, `thanh_thu_mocmi`, `bach_chien_on_hoanhan`, `hoanh_mi_baoluc`, `cuong_thi_hac`, `huyet_khoi`, `thiet_nhuoc_nam_q1`, sói Điện Lang thường.

Nên làm theo đợt: 2 mẫu kiểm tra → boss Q1 → phần còn lại. Đợt nào được duyệt mới làm đợt kế.
