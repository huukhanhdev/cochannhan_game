# Prompt Muse AI: dải key-pose cho Phương Nguyên và Bạch Ngưng Băng (Q1)

Ngày 02/10/2026. Thay hướng 8 frame liên tục ở [PROMPT_FRAME_IDLE_RUN_PN_V2.md](PROMPT_FRAME_IDLE_RUN_PN_V2.md). Hướng 8 frame đã thất bại 5 lần.

## Cách làm

**Mỗi lần generate chỉ tạo MỘT ảnh ngang chứa 2–3 tư thế của cùng một động tác, xếp trái sang phải.**

- Vẽ chung trong một ảnh thì mặt, tỷ lệ và màu giữ đồng nhất hơn nhiều so với generate từng frame riêng.
- Các tư thế được phép khác nhau rõ (lấy đà → ra đòn → thu chiêu). Không yêu cầu AI vẽ các frame trung gian liền mạch, đúng phần AI hay hỏng.
- **Không làm run.** Di chuyển trong trận dùng tư thế "lướt khinh công": nhân vật nghiêng người, game tự trượt hình kèm bụi và bóng mờ. Hợp chất tu tiên, lại không cần chu kỳ bước chân.
- **Không vẽ hiệu ứng chiêu vào ảnh.** Trăng lưỡi liềm, băng, giáp ngọc, ánh hồi máu đều do code game vẽ. Ảnh chỉ có nhân vật, nên tách nền sạch và một tư thế dùng được cho nhiều cổ.

Phần của tôi: bạn gửi ảnh về, tôi viết script tự động:

1. Xóa nền.
2. Tách từng tư thế theo khoảng trống.
3. Đặt chân cùng một vạch sàn.
4. Đưa về cùng tỷ lệ với ảnh gốc.
5. Ghép sheet và đưa vào sandbox battle.

Vì vậy **ảnh không cần đúng lưới pixel**. Chỉ cần các tư thế đứng tách nhau, không chạm nhau.

## Chuẩn bị trên Muse AI

1. **Ảnh tham chiếu (bản master 1376×1824):** PN dùng `assets/chibi_ref/phuong_nguyen_full.png`; BNB nam dùng `assets/chibi_ref/bach_ngung_bang_nam_full.png`. **Không dùng** `chibi_ref/bach_ngung_bang.png` (bản nữ Q2). Đặt độ bám tham chiếu (reference / image strength / character reference, tùy tên trong Muse) ở mức **cao**.
   - Nếu Muse chỉ có image-to-image mà không có character reference, đặt strength khoảng 0.55–0.7: đủ đổi tư thế mà không đổi mặt.
2. **Tỷ lệ khung:**
   - Dải 3 tư thế: **3:1**. Không có thì chọn 21:9 hoặc 16:9.
   - Dải 2 tư thế: **2:1** hoặc 16:9.
3. **Seed:** nếu Muse cho khóa seed, giữ **một seed cố định** cho cả bộ của một nhân vật.
4. Mỗi prompt generate 2–4 ảnh, chọn ảnh có mặt và áo giống gốc nhất.
5. **Đặt tên file khi lưu:** `pn_<action>_vN.png` hoặc `bnb_<action>_vN.png`, ví dụ `pn_cast_v1.png`. Bỏ vào thư mục `incoming_sprites/` ở gốc project.

Tôi chưa xác minh Muse AI có tạo nền trong suốt hay không. Prompt yêu cầu **nền phẳng màu xanh lá #00FF00** để script tách. PN mặc đồ đen, BNB mặc đồ trắng xanh, nên không nhân vật nào trùng màu xanh lá. Nếu Muse xuất được nền trong suốt thì càng tốt.

## Khối chung: dán đầu mọi prompt

Thay `{CHARACTER}` bằng khối nhân vật bên dưới.

```text
Pixel art game sprite sheet, chibi side-view character, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading, no anti-aliasing blur.
{CHARACTER}
Exactly the same character as the reference image: same face, same hair, same outfit, same colors, same body proportions, same pixel art style. Do not redesign.
Layout: one single horizontal row, poses ordered left to right, every pose the same size and standing on the same invisible ground line, full body visible head to feet, wide empty gap between poses, poses never overlap or touch.
Facing right in every pose. Camera fixed, orthographic side view.
Background: solid flat pure green #00FF00, no gradient, no floor, no shadow, no scenery.
No text, no labels, no numbers, no frames, no grid lines, no magic effects, no glow, no particles, no motion lines, no speech bubbles.
```

Negative prompt, nếu Muse có ô riêng:

```text
blurry, 3d render, realistic, painterly, extra limbs, extra fingers, duplicate character overlapping, different face, different hairstyle, female body (cho BNB), text, watermark, border, grid, gradient background, ground shadow, cropped feet, cropped head, glow effect, magic effect
```

## Khối nhân vật

**Phương Nguyên** (`{CHARACTER}`):

```text
Character: Fang Yuan, 15-year-old young man, long straight black hair falling to the waist, pale skin, narrow cold calm eyes, expressionless face, plain charcoal-black cultivator robe with a dark belt, black trousers, black boots, slim build, bare hands, no weapon.
```

**Bạch Ngưng Băng, Q1, nam** (`{CHARACTER}`):

```text
Character: Bai Ning Bing, a 15-year-old young MAN (male, flat chest, masculine jaw), very long silver-white hair with a silver hair ornament, ice-blue eyes, arrogant playful smile, white cultivator robe with blue snowflake patterns, white boots, slim build, bare hands, no weapon, faint frosty pale skin.
```

Nếu Muse cứ ra nữ, thêm vào đầu prompt `male, boy, young man` và đưa `female, girl, breasts, makeup` vào negative.

## Danh sách động tác

Mỗi mục dưới đây là **một lần generate**. Dán khối chung, thay `{CHARACTER}`, rồi dán dòng `Poses:`. Làm theo thứ tự: 4 mục đầu cho PN trước, gửi tôi test. Đạt thì làm tiếp.

| # | File | Số tư thế | Dùng cho trong game |
|---|---|---|---|
| 1 | `idle` | 2 | Đứng chờ |
| 2 | `cast` | 3 | Cổ phóng xa: Nguyệt Quang, Nguyệt Mang, Nguyệt Toàn, Toàn Phong; BNB dùng chiêu băng phóng xa |
| 3 | `hit` | 2 | Trúng đòn |
| 4 | `move` | 2 | Lướt khinh công, thay cho run |
| 5 | `attack` | 3 | Đánh tay / cận chiến cơ bản |
| 6 | `heavy` | 3 | Chiêu mạnh cận thân: Cứ Xỉ Kim Ngô, Cường Thủ (PN); Băng Đao (BNB) |
| 7 | `guard` | 2 | Thủ: Bạch Ngọc, Thiên Bồng, Ngọc Bì... (giáp do code phủ lên) |
| 8 | `heal` | 2 | Trị Liệu, Cửu Diệp, uống/dùng vật phẩm |
| 9 | `dodge` | 2 | Né / lùi bước |
| 10 | `ko` | 3 | Gục / ngã |
| 11 | `win` | 1 | Thắng trận (tùy chọn) |

### 1. idle (2 tư thế, tỷ lệ 2:1)

```text
Poses: 2 poses of a calm standing idle stance, almost identical.
Pose 1: standing relaxed, arms loosely at the sides, feet shoulder-width apart.
Pose 2: the exact same stance breathing in: shoulders and chest raised by a tiny amount, hair tips slightly swayed backward. Everything else unchanged.
```

Nếu hai tư thế khác nhau quá nhiều, tôi dùng pose 1 làm hình tĩnh và cho code nhấp nhô 1px. Không cần gen lại.

### 2. cast: phóng cổ (3 tư thế, tỷ lệ 3:1)

PN:

```text
Poses: 3 poses of casting a ranged attack from the palm.
Pose 1 (gather): knees slightly bent, right hand pulled back near the hip with fingers open, left hand forward for balance, eyes focused ahead.
Pose 2 (release): body leaning forward, right arm fully extended straight forward at shoulder height, open palm facing right, back foot pushing, hair and robe flowing backward.
Pose 3 (follow-through): arm still forward but lowered slightly, body returning upright, calm expression.
```

BNB: thay `right hand` bằng `both hands`. Pose 2 đổi thành `both palms thrust forward together`.

### 3. hit: trúng đòn (2 tư thế, tỷ lệ 2:1)

```text
Poses: 2 poses of being struck from the right side.
Pose 1: upper body jerked backward to the left, head tilted back, eyes squeezed shut, arms flung out, hair whipping forward.
Pose 2: recovering, body hunched forward slightly, one hand on the stomach, gritting teeth, feet planted.
```

### 4. move: lướt khinh công (2 tư thế, tỷ lệ 2:1)

```text
Poses: 2 poses of a martial-arts dash, gliding fast over the ground.
Pose 1 (glide): whole body leaning far forward, low, arms trailing straight behind the back, one foot forward one foot back as if sliding, hair and robe streaming horizontally behind.
Pose 2 (stop): skidding to a stop, front knee bent, body leaning back slightly to brake, one hand forward, hair swinging forward.
```

Game sẽ dùng pose 1 suốt quãng trượt, kèm bóng mờ và bụi do code vẽ. Pose 2 dùng lúc dừng.

### 5. attack: đánh tay (3 tư thế, tỷ lệ 3:1)

```text
Poses: 3 poses of a fast unarmed palm strike.
Pose 1 (wind-up): twisting the torso backward, right arm drawn back behind the shoulder, weight on the back foot.
Pose 2 (strike): lunging forward, right palm strike fully extended forward, front knee bent, back leg straight.
Pose 3 (recover): pulling the arm back to the chest, returning to a fighting stance.
```

BNB: `a fast punch with the right fist`, pose 2 là `right fist punch fully extended`.

### 6. heavy: chiêu mạnh (3 tư thế, tỷ lệ 3:1)

PN (dùng chung cho Cứ Xỉ Kim Ngô và Cường Thủ, hiệu ứng con rết hoặc bàn tay lớn do code vẽ):

```text
Poses: 3 poses of a powerful overhead swinging attack with the right arm.
Pose 1: right arm raised high above and behind the head, body arched back, left hand forward, intense eyes.
Pose 2: arm swung down and forward in a big diagonal arc, body bent forward, feet wide apart in a deep stance.
Pose 3: arm low at the end of the swing pointing down-forward, crouched, looking up at the enemy.
```

BNB (Băng Đao):

```text
Poses: 3 poses of a horizontal sword-like slash using the edge of the right hand.
Pose 1: right arm cocked across the chest to the left shoulder, body coiled.
Pose 2: arm swept fully outward to the right in a wide horizontal slash, stepping forward.
Pose 3: arm extended out to the side after the slash, confident smile.
```

### 7. guard: thủ (2 tư thế, tỷ lệ 2:1)

```text
Poses: 2 poses of a defensive stance bracing for impact.
Pose 1: both forearms crossed in front of the face, knees bent, body compact.
Pose 2: same braced stance pushed back a little, head lowered behind the arms, feet sliding back.
```

### 8. heal: hồi phục / dùng vật phẩm (2 tư thế, tỷ lệ 2:1)

```text
Poses: 2 poses of meditative healing.
Pose 1: standing upright, eyes closed, right hand placed on the chest, left hand open at the side palm up.
Pose 2: same pose with chin raised slightly, breathing out, shoulders relaxed, small calm smile.
```

### 9. dodge: né (2 tư thế, tỷ lệ 2:1)

```text
Poses: 2 poses of dodging backward.
Pose 1: jumping backward, body leaning back, both feet off the ground, arms raised for balance.
Pose 2: landing in a low crouch, one hand touching the ground, eyes on the enemy.
```

### 10. ko: gục ngã (3 tư thế, tỷ lệ 3:1)

```text
Poses: 3 poses of being defeated.
Pose 1: staggering, knees buckling, head drooping, arms hanging.
Pose 2: fallen on one knee, one hand on the ground, head down, hair covering the face.
Pose 3: collapsed lying on the ground on the side, eyes closed, hair spread out. Same ground line as the other poses.
```

### 11. win (1 tư thế, tỷ lệ 1:1, tùy chọn)

PN: `Pose: standing tall, hands clasped behind the back, cold faint smirk, hair blown slightly by wind.`

BNB: `Pose: standing with one hand on the hip, chin raised, wide arrogant grin.`

## Mẫu ghép sẵn: PN cast (copy nguyên khối)

```text
Pixel art game sprite sheet, chibi side-view character, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading, no anti-aliasing blur.
Character: Fang Yuan, 15-year-old young man, long straight black hair falling to the waist, pale skin, narrow cold calm eyes, expressionless face, plain charcoal-black cultivator robe with a dark belt, black trousers, black boots, slim build, bare hands, no weapon.
Exactly the same character as the reference image: same face, same hair, same outfit, same colors, same body proportions, same pixel art style. Do not redesign.
Layout: one single horizontal row, poses ordered left to right, every pose the same size and standing on the same invisible ground line, full body visible head to feet, wide empty gap between poses, poses never overlap or touch.
Facing right in every pose. Camera fixed, orthographic side view.
Background: solid flat pure green #00FF00, no gradient, no floor, no shadow, no scenery.
No text, no labels, no numbers, no frames, no grid lines, no magic effects, no glow, no particles, no motion lines, no speech bubbles.
Poses: 3 poses of casting a ranged attack from the palm.
Pose 1 (gather): knees slightly bent, right hand pulled back near the hip with fingers open, left hand forward for balance, eyes focused ahead.
Pose 2 (release): body leaning forward, right arm fully extended straight forward at shoulder height, open palm facing right, back foot pushing, hair and robe flowing backward.
Pose 3 (follow-through): arm still forward but lowered slightly, body returning upright, calm expression.
```

## Khi chọn ảnh

Chọn ảnh có cả ba điều sau:

- Mặt, tóc và màu áo giống ảnh gốc.
- Các tư thế cùng cỡ người.
- Đủ chân, đầu không bị cắt.

Không cần hoàn hảo: lệch vị trí, lệch cỡ nhỏ, nền hơi loang đều sửa được bằng script.

Lỗi cần gen lại:

- Đổi mặt hoặc đổi kiểu tóc.
- Thừa tay, thừa chân.
- Hai tư thế dính vào nhau.
- Có chữ trong ảnh.
- BNB ra nữ.

## Áp dụng cho nhân vật khác

Giữ nguyên khối chung, thay khối nhân vật. Lấy mô tả nhân vật từ [CHI_TIET_NGUYEN_TAC_Q1.md](../reference/CHI_TIET_NGUYEN_TAC_Q1.md) và ảnh tham chiếu `assets/chibi_ref/<id>.png`.

- **Quái thú** (sói, heo, gấu): dùng bộ rút gọn `idle 2 · attack 3 (vồ/cắn) · hit 2 · ko 2`, thêm `four-legged animal, side view, facing right`.
- **Boss có chiêu riêng:** thêm một mục `cast` hoặc `heavy` mô tả đúng tư thế ra chiêu.
