# Muse plan: in-battle sprites from the new pilot bases

Orange-kun, 03/10/2026. User decision: **Muse makes the new battle sprites; Blue takes all FX** (see `PLAN_BLUE_FX.md`).
Orange reviews every delivery and imports it into the game. Blue reviews this plan once (section 9).

- Repo: https://github.com/huukhanhdev/cochannhan_game
- Raw image base: `https://raw.githubusercontent.com/huukhanhdev/cochannhan_game/main/`

## 1. What to make
Animated **key-pose sprite sheets** for the side-view arena fight. Two kinds of reference:

| Role | Where | Use |
|---|---|---|
| **Identity** (who the character is: face, hair, outfit, colours, anatomy) | `assets/vs/<id>.png` (approved portrait made from the pilot base v04) | Image 1. Copy identity only, never the pose or camera angle |
| **Sprite style** (chibi proportions, side view, outline, pixel density) | People: `assets/sprite_ref/tran_thuy_hoa/idle.png`, `assets/sprite_ref/thiet_huyet_lanh/idle.png`, `assets/chibi_kp/phuong_nguyen/idle.png`. Beasts: `assets/sprite_ref/thach_hau/*.png`, `assets/chibi_kp/heo_rung/atk.png` | Image 2. Copy style only, never the character |
| **Old sprite of the same id** (pose ideas and frame layout) | `assets/chibi_kp/<id>/<clip>.png` | Optional image 3, for the pose of each clip. **Its identity may be wrong** (that is why we redo it) |

Pilot bases are 3/4 view with realistic proportions. **Battle sprites are NOT 3/4:** people are big-head chibi in **pure side view facing right**, like the style refs; beasts use natural proportions (like the Thạch Hầu ref).

## 2. Common prompt block
```text
Pixel art game sprite sheet, chibi side-view character for a 2D fighting game, crisp pixel art, clean dark outlines, flat shading, at most 32 colours.
Image 1 defines WHO the character is: face, hair, outfit, colours, body type. Copy identity only, not its pose or 3/4 camera angle.
Image 2 defines ONLY the sprite style: chibi proportions with a big head (for people), pure side view, outline thickness, pixel density. Do not copy the character from image 2.
{CHARACTER}
One single horizontal row of {N} poses, left to right, all poses the same size and scale, full body visible, the feet on the same ground line, wide empty gap between poses, nothing crosses into the neighbouring pose.
Facing RIGHT in every pose. Fixed orthographic side view.
Background: solid flat pure magenta #FF00FF, no shadow, no gradient. Do not use pink or bright magenta on the character.
No particles, dust, smoke, glow, motion lines or magic effects (effects are drawn by the game). No weapon or held object unless the character line names one.
{POSES}
```
**For beasts:** replace line 1 with `Pixel art game sprite sheet, side-view animal sprite for a 2D fighting game, natural animal proportions (head NOT oversized, no cute mascot face), crisp pixel art, clean dark outlines, at most 32 colours.`

**Negative:**
```text
blurry, 3d render, realistic, painterly, 3/4 view, front view, extra limbs, extra fingers, extra heads, different face, different hairstyle, different outfit colours, text, watermark, border, grid lines, scenery, cropped feet, cropped head, glow, particles, motion lines
```

**`{CHARACTER}`:** take `body_spec` from `previews/roster-style-v04/catalog.json` for that id. Shorten it if needed, but keep every **CAPS** item and every listed colour.

**`{POSES}`:** use the line for that clip in `docs/prompts/PROMPT_MUSE_ROSTER.md`:
- §2.1 (people) / §2.2 (beasts) for common clips;
- §4.x for special clips.

For idle (people), add: `almost identical poses, only breathing changes`.

## 3. Workflow per character (keep it short)
1. Make **idle** first. Deliver to Orange.
2. Orange reviews idle (**one round only**; small issues are noted, not sent back).
3. Make the remaining clips using the **approved idle as image 1** (it locks identity and palette better than the portrait).
4. Deliver one zip per character, with:
   - `<id>_<clip>_v1.png` for every clip;
   - `NOTE.txt` (model, prompt per clip, snapshot/seed).
5. Orange imports with `tools/keypose_import_v2.py` into a review folder, tests in the sandbox, and the user approves before replacing `assets/chibi_kp/<id>`.

**Keep the existing clip names and pose counts** (listed below), so the game wiring does not change.

## 4. Batch 1: wrong vs the novel (do first)
| id | Clips (name:poses) | Must be true (source) |
|---|---|---|
| tran_thuy_hoa | atk:3 cast_ground:3 hit:2 ko:3 move:2 sk_poison:2 win:1 (**idle already approved**: `assets/sprite_ref/tran_thuy_hoa/idle.png`, use it as image 1) | Adult peasant woman, sallow skin **not green** (VN ch.222) |
| thiet_huyet_lanh | atk:3 guard:2 hit:2 move:2 sk_chain:3 win:1 **+ ko:3 (missing today)** (idle approved: `assets/sprite_ref/thiet_huyet_lanh/idle.png`) | Ancient bronze mask, short iron chain in hand (VN ch.170, 196) |
| phi_hau | idle:2 atk:3 hit:2 ko:2 move:2 sk_rage:2 win:1 | Bare brown skin on the upper body; golden fur with black tiger stripes **only from the waist down** and on the tail; arms much thicker than legs (VN ch.266–268) |
| phi_tuong | idle:2 atk:3 **hit:2 (missing today)** ko:2 move:2 sk_charge:2 win:1 | White **bird feathers** (not fur), four legs, two long tusks, flies **without wings**, hovers (VN ch.277) |
| ca_sau_dung_nham | idle:2 atk:3 hit:2 ko:2 move:2 sk_spit:2 win:1 | Dark red armoured crocodile, **two volcano-like bumps** on the back (VN ch.216–217) |
| hien_vien_than_ke | idle:2 **atk:3 (peck) sk_kick:2 (spur kick) hit:2 ko:2 move:2** win:1 | Huge rooster, five-coloured plumage, golden comb; it kills the lava crocodile (VN ch.218). Peck and kick poses are art |

## 5. Batch 2: technical fixes (keep identity, fix the listed problem)
| id | Clips | Fix |
|---|---|---|
| phuong_chinh | all 8 clips | Lock the **pale blue** robe in every clip (old set flips purple/blue) |
| thiet_ba_tu | atk:3, move:2 | atk release = a **closed heavy fist**, not an open palm; move without dust |
| cuong_thi | sk_poison:2 (+ add win:1) | No green particles on the body (poison is drawn by the game) |
| xich_thanh | all 7 clips | **Short and small** teen with pockmarks, blue-grey robe; must not look like Cổ Kim Sinh (VN ch.4) |

## 6. Batch 3: identity drift (when these characters enter battle)
bach_chien_liep, cu_khai_bi, han_bat_luu, hoanh_mi, tiet_tam_tu, vu_quy, thiet_nhuoc_nam: rebuild all current clips from their `assets/vs/<id>.png`.

## 7. Batch 4: game-original characters (no novel source; art)
| id | Clips | Identity |
|---|---|---|
| huyet_thu_ma_tu | idle:2 atk:3 hit:2 ko:3 move:2 sk_drain:2 win:1 | `assets/vs/huyet_thu_ma_tu.png`: tier-3 demonic cultivator in torn dark-red robes, forearms stained crimson |
| tuu_khoi | idle:2 atk:3 hit:2 ko:3 move:2 sk_regen:2 | `assets/vs/tuu_khoi.png`: puppet built from broken clay wine jars |
| huyet_khoi | idle:2 atk:3 hit:2 ko:3 move:2 sk_regen:2 | `assets/vs/huyet_khoi.png`: humanoid of dark crimson liquid (reads as liquid, not fire) |

These replace the shared old sprite `tuu_khoi_huyet_khoi`.

## 8. Orange checks (blocking only)
- identity matches the portrait and the "Must be true" column;
- chibi side view facing right;
- feet on one ground line;
- same size across poses;
- no FX baked in;
- magenta background with no pink fringe after keying;
- readable at about 100 px height.

Everything else is noted, not sent back.

## 9. Blue review
_(Blue: one pass on feasibility, references and clip lists; write findings here.)_
