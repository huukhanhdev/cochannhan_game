# Prompt Muse AI: VFX chiêu thức (bản thử v1)

Orange-kun, 03/10/2026. Dùng để tạo thử vài hiệu ứng chiêu cho battle sandbox. Nhập bằng `tools/fx_import.py` (xuất vùng review, `--approve` mới vào `assets/battle_fx/`).

## 1. Khối chung (dán đầu mọi prompt)
```text
Pixel art game VFX sprite sheet for a 2D side-view fighting game. Crisp pixel art, limited palette of at most 16 colors, hard pixel edges, a thin dark outline only on solid shapes, bright readable silhouette at small size.
Effect only: no character, no person, no hands, no weapon, no text, no numbers.
One single horizontal row of {N} frames, all frames the same size, evenly spaced with a wide empty gap between frames, the effect centered in each frame at the same scale. The animation reads from left to right.
The effect travels or faces to the RIGHT.
Background: solid flat pure magenta #FF00FF everywhere, no gradient, no shadow, no glow spilling onto the background.
Do not use pink, magenta or bright purple inside the effect.
{EFFECT}
```
**Negative:**
```text
blurry, 3d render, realistic photo, painterly, soft airbrush glow, gradient background, scenery, ground texture, character, person, hand, text, watermark, border, grid lines, frame numbers, motion blur, cropped effect
```

**Tỉ lệ khung ảnh:** N frame thì chọn N:1, ví dụ 4 frame → 4:1. Sau khi gen, ghi lại model, seed, prompt cuối vào `incoming_fx/NOTE.txt`.

**Lưu ý Muse chặn từ** (như `PROMPT_MUSE_ROSTER.md` §1b): không dùng "blood", "gore", "wound". Dùng `crimson liquid`, `deep red`.

## 2. Danh sách thử (chọn 4–6 cái trước)
| id | Dùng cho | N | Khung gợi ý | Dòng `{EFFECT}` |
|---|---|---|---|---|
| `fx_nguyet_nhan` | Nguyệt Quang/Nguyệt Mang (đạn) | 4 | 96×48 | `A thin crescent-moon blade of pale cyan-blue light flying to the right, sharp curved edge in front, short fading trail behind. Frames: the crescent shimmers and slightly rotates, loopable.` |
| `fx_hit_nguyet` | nguyệt nhận trúng đích | 5 | 64×64 | `A small impact burst of pale cyan-blue light: frame 1 a bright point, frame 2 a sharp star-shaped flash, frame 3 a ring of light shards flying outward, frame 4 smaller shards fading, frame 5 a few last sparks.` |
| `fx_bang_truy` | Băng Trùy (mũi khoan băng) | 3 | 64×24 | `A single sharp ice spike / icicle drill pointing right, pale blue and white with a bright tip, small frost particles behind. Frames: slight spin shimmer along the spike, loopable.` |
| `fx_ice_impact` | băng vỡ khi trúng | 5 | 64×64 | `An ice shatter impact: frame 1 a white flash, frame 2 jagged ice crystals bursting outward, frame 3 crystals spread wider, frame 4 small ice chips falling, frame 5 faint frost dust.` |
| `fx_tung_cham` | Tùng Châm (mưa lá thông) | 3 | 64×32 | `A tight cluster of thin green pine needles flying to the right like darts, slightly spread in a fan. Frames: the needles flicker in position, loopable.` |
| `fx_thanh_dang` | Thanh Đằng (dây leo quất) | 5 | 160×48 | `A green leafy vine whip growing from the LEFT edge toward the right: frame 1 a short sprout, frame 2 the vine extends halfway, frame 3 fully extended with a snapping curled tip and small leaves, frame 4 recoiling, frame 5 retracting back to the left.` |
| `fx_loi_giap` | Giáp lôi điện (hộ thể, vòng lặp) | 4 | 96×128 | `An electric armor aura shaped like an empty upright oval shell (the center is EMPTY magenta where a creature would stand), crackling blue and golden lightning arcs running along the outline. Frames: the arcs move around the shell, loopable.` |
| `fx_dien_tuong` | Điện tương (đạn điện) | 4 | 48×48 | `A ball of crackling blue electric plasma with small golden sparks, flying right. Frames: the plasma pulses and the sparks jump, loopable.` |
| `fx_loc_bang` | Lốc băng nhận (vùng nổ) | 6 | 160×96 | `A whirlwind of small ice blades spinning on the ground, seen from a low side angle as a flattened ellipse: frame 1 a faint frost ring on the ground, frame 2 blades start circling, frame 3 a tall spinning vortex of ice blades, frame 4 at full height, frame 5 breaking apart, frame 6 frost fading.` |
| `fx_huyet_trieu` | Huyết triều (Huyết Khôi, vùng) | 6 | 128×96 | `A surge of dark crimson liquid erupting from the ground in a flattened ellipse: frame 1 a dark red puddle, frame 2 bubbles rising, frame 3 a wave splashing upward, frame 4 peak splash, frame 5 falling droplets, frame 6 the puddle shrinking.` |
| `fx_dung_nham` | Dung Nham Tạc Liệt (nổ) | 6 | 128×128 | `A lava explosion from the ground: frame 1 glowing cracks, frame 2 orange lava bursting upward, frame 3 a mushroom-shaped fiery blast with dark rock chunks, frame 4 peak, frame 5 rocks falling and lava splashing, frame 6 a smoking dark crater ring.` |
| `fx_st_choang` | trạng thái **Choáng** (trên đầu) | 4 | 48×24 | `Three small yellow stars and two tiny white sparkles circling in a flat horizontal ring, as a dizzy indicator above a head. Frames: the stars rotate around the ring, loopable.` |
| `fx_st_troi` | trạng thái **Trói** (dưới chân) | 4 | 96×40 | `A flattened ground ring of thick brown roots and short dark iron chain links wrapping around an EMPTY center (where feet would be), seen from a low side angle. Frames: the roots tighten slightly and pulse, loopable.` |
| `fx_st_phong_cam` | trạng thái **Phong cấm** (quanh thân) | 4 | 64×64 | `A dark violet-black sealing sigil: a round talisman pattern with a lock-like glyph in the center and small dark smoke wisps around it. Frames: the sigil slowly rotates and its lines glow faintly, loopable. Use deep violet and black, not pink.` |

**Loại vòng lặp:**
- `fx_nguyet_nhan`, `fx_bang_truy`, `fx_tung_cham`, `fx_dien_tuong`, `fx_loi_giap` và ba `fx_st_*`: loop, `loopFrames: true`.
- Còn lại: chạy một lượt.

## 3. Sidecar nhập (ví dụ `incoming_fx/fx_nguyet_nhan.spec.json`)
```json
{
  "id": "fx_nguyet_nhan",
  "frame_size": [96, 48],
  "pivot_px": [48, 24],
  "rects": [[0,0,96,48],[96,0,96,48],[192,0,96,48],[288,0,96,48]],
  "durations_ms": [80,80,80,80],
  "key_color": "#FF00FF",
  "key_tolerance": 90,
  "loopFrames": true,
  "blend": "normal"
}
```
- **rects:** đo trên ảnh thật sau khi gen (ảnh Muse thường lớn hơn khung gợi ý). Cắt đều theo số frame rồi thu về `frame_size`, hoặc ghi rect gốc.
- **pivot:**
  - đạn: tâm đạn;
  - vùng / trên đất: giữa đáy;
  - icon trạng thái trên đầu: giữa đáy;
  - vòng dưới chân: tâm vòng.

Chạy:
```bash
python3 tools/fx_import.py incoming_fx/fx_nguyet_nhan.png --spec incoming_fx/fx_nguyet_nhan.spec.json
```
Kết quả nằm ở `previews/fx-import/fx_nguyet_nhan/`. Orange review xong mới chạy `--approve`.

## 4. Orange kiểm
1. Đọc được ở cỡ nhân vật nhỏ (FX cao khoảng 24–96px trên màn).
2. Không còn viền hồng sau khi khử nền; ≤16 màu.
3. Frame đều nhau, loop không giật.
4. Hướng sang phải; view tự lật khi bắn sang trái.
5. Không vẽ kèm nhân vật hay tay.
