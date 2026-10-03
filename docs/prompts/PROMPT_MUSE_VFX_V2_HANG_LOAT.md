# Muse brief: battle VFX batch v2 (Cổ Chân Nhân fan game)

Orange-kun, 03/10/2026. This file is written for **Muse AI**, which reads it straight from GitHub.
Vietnamese notes are for the team; Muse only needs the English blocks and the reference links.

- Repo: https://github.com/huukhanhdev/cochannhan_game
- Raw file base (for images): `https://raw.githubusercontent.com/huukhanhdev/cochannhan_game/main/`
- Previous round (approved): `previews/fx-trial-v1/README.md`

## 0. What the game is (context for Muse)
- 2D side-view arena fighting, chibi pixel-art characters about 100 px tall on screen.
- Setting: Chinese xianxia novel *Reverend Insanity* (Cổ Chân Nhân). Cultivators fight with **Gu**: living insects/creatures refined into powers (moon blades, ice, vines, lightning).
- Effects must read clearly at small size: chunky shapes, few colours, dark outline on solid parts.

**Style references, already approved** (match this pixel style, palette size and outline; do NOT copy their subject):
| Ref | Link |
|---|---|
| ice drill | `assets/fx_ref/style/fx_bang_truy_x4.png` |
| impact burst | `assets/fx_ref/style/fx_hit_nguyet_x4.png` |
| moon blade | `assets/fx_ref/style/fx_nguyet_quang_x4.png` |
| stun stars | `assets/fx_ref/style/fx_st_choang_x4.png` |
| root ring | `assets/fx_ref/style/fx_st_troi_x4.png` |
| seal talisman | `assets/fx_ref/style/fx_st_phong_cam_x4.png` |

(Prefix each path with the raw base above. The `_x4` files are 4× nearest-neighbour enlargements; real size is the same name without `_x4`.)

## 1. Common block (paste at the top of every prompt)
```text
Pixel art game VFX sprite sheet for a 2D side-view fighting game set in a Chinese xianxia world. Match the pixel style of the attached style reference: crisp pixels, at most 16 colours, hard edges, thin dark outline only on solid shapes, readable at small size.
Effect only: no character, no person, no hands, no weapon, no text, no numbers.
One single horizontal row of {N} square frames, all frames the same size, evenly spaced. Each part of the effect stays INSIDE its own frame; nothing crosses into the neighbouring frame.
Keep the effect anchored at the SAME position and the SAME size in every frame; only the described motion changes. The animation reads from left to right.
The effect travels or faces to the RIGHT.
Background: solid flat pure magenta #FF00FF everywhere, no gradient, no shadow, no glow spilling onto the background.
Do not use pink, magenta or bright purple inside the effect.
{EFFECT}
```
**Negative:**
```text
blurry, 3d render, realistic photo, painterly, soft airbrush glow, gradient background, scenery, ground texture, character, person, hand, text, watermark, border, grid lines, frame numbers, motion blur, cropped effect, effect crossing frame borders
```
**Rules:**
- One generation per effect. Aspect ratio N:1. File name `<id>_v1.png`.
- One zip per batch + `NOTE.txt` (model, seed, final prompt).
- Never write "blood/gore/wound"; use `crimson liquid`.

**Source column** (team rule, every FX is labelled):
- `VN ch.N`: the look is described in that chapter of the Vietnamese translation (paraphrased below, not quoted);
- `data.js`: the game's Gu description;
- `art`: our own design.

## 2. Batch A1 (8 effects, used most in current fights)
| id | N | Cell | Loop | Source | `{EFFECT}` |
|---|---|---|---|---|---|
| fx_hit_dam | 4 | 48 | no | art | `A blunt impact for a punch or tusk hit: frame 1 white flash, frame 2 a round orange-white burst with short straight speed lines, frame 3 smaller burst, frame 4 a few dust specks.` |
| fx_hit_chem | 4 | 64 | no | art | `A slash impact for claws or an ice blade: frame 1 a bright diagonal line, frame 2 two crossing white arcs with small sparks, frame 3 arcs fading, frame 4 last sparks.` |
| fx_tung_cham | 3 | 64 | yes | VN ch.104, 141: Qing Shu flicks his long hair and shoots a dense rain of green pine needles that pierce a training dummy | `A tight cluster of thin dark-green pine needles flying to the right like darts, slightly fanned out. Frames: the needles flicker in place, the shape stays the same, loopable.` |
| fx_thanh_dang | 5 | 160×48 | no | VN ch.104: a green branch about fifteen chi long grows from the palm and is swung like a whip; ch.140: the vine coils around a person's waist and pulls | `A green leafy vine whip growing from the LEFT edge to the right: frame 1 a short sprout, frame 2 half extended, frame 3 fully extended with a snapping curled tip and a few leaves, frame 4 recoiling, frame 5 retracting to the left.` |
| fx_loi_giap | 4 | 96×128 | yes | VN ch.164: Thunder Crown Wolf flashes a protective armour of lightning over its whole body just before a blade hits | `An armour of blue lightning shaped like an empty upright oval shell (the center is EMPTY where a beast would stand), crackling blue arcs running along the outline. Frames: arcs move around the shell, loopable. Blue and white only.` |
| fx_dien_tuong | 4 | 48 | yes | VN ch.164: the wolf swings its tail and sprays clumps of blue electric plasma | `A clump of crackling blue electric plasma flying right. Frames: the plasma pulses and small blue sparks jump, the size stays the same, loopable. Blue and white only.` |
| fx_hap_thu | 4 | 64×96 | yes | art (absorbing a primeval stone to refill essence; the novel does not describe its look) | `Small glowing pale-green crystal motes rising upward in a gentle spiral toward an EMPTY center, as if a spirit stone is being absorbed. Frames: motes rise and fade, loopable.` |
| fx_lam_dieu | 4 | 64×48 | yes | VN ch.136, 141: Blue Bird Ice Coffin flies out from between the teeth: an ice-blue bird the size of a pigeon | `A small ice-blue bird shaped like a pigeon, made of ice crystals, flying right with a short frosty trail. Frames: one wing-flap cycle, same size every frame, loopable.` |

## 3. Batch A2 (13 effects)
| id | N | Cell | Loop | Source | `{EFFECT}` |
|---|---|---|---|---|---|
| fx_nguyet_mang | 4 | 96 | yes | data.js: Moon Glow Gu blade is "golden-blue", sharper and longer than the basic moon blade | `A crescent-moon blade of golden-blue light (gold edge, blue core) flying to the right, slightly longer and sharper than the style reference. Frames: only the inner shine and trail sparkle change; same orientation and size, loopable.` (use `fx_nguyet_quang_x4.png` as shape reference) |
| fx_huyet_nguyet | 4 | 96 | yes | data.js: Blood Moon Gu blade is blood-red and leaves wounds that keep bleeding | `A crescent-moon blade of deep crimson light with a dark red core and a few crimson liquid droplets in the trail, flying right. Same orientation and size every frame, loopable.` (shape reference `fx_nguyet_quang_x4.png`) |
| fx_hit_dien | 4 | 64 | no | art (same blue as fx_loi_giap) | `An electric hit: frame 1 a white flash, frame 2 jagged blue lightning forks bursting outward, frame 3 smaller forks, frame 4 fading sparks.` |
| fx_tru_len | 5 | 128 | no | VN ch.164: the wolf howls to the sky, lightning flashes over its body and its speed doubles. The ring shape is **art** | `A howl shockwave: frame 1 a small ring of blue lightning, frames 2–4 wider concentric rings of blue lightning expanding outward, frame 5 a faint fading ring.` |
| fx_lao_hu | 4 | 96×48 | no | VN ch.70: the boar charges straight and smashes a small tree. The dust is **art** | `A charging dust trail: frame 1 a small dust puff on the ground at the left, frame 2 a long streak of brown dust and debris pointing right, frame 3 the streak breaking up, frame 4 settling dust.` |
| fx_moc_mi | 4 | 96×128 | yes | VN ch.141: under Wood Charm the body turns into a tree spirit: leaves grow from the hair, skin becomes brown bark. This FX is the **extra** aura; the main look is a bark/leaf tint on the sprite | `Small green leaves and thin brown twigs swirling in a ring around an EMPTY center, faint green light. Frames: leaves orbit, loopable.` |
| fx_thuy_trao | 4 | 96×128 | yes | VN ch.132: two jets of white vapour from the nose wrap around the body into a water sphere that keeps spinning | `A spinning sphere of clear blue water around an EMPTY center, white vapour streaks and small bubbles in the water. Frames: the water swirls around, loopable.` |
| fx_ngoc_bi | 3 | 96×128 | yes | data.js + VN ch.80: Jade Skin makes the skin give off a jade glow | `A thin jade-white glow along the outline of an EMPTY upright silhouette, with a few small glints. Frames: glints move along the outline, loopable.` |
| fx_loc_bang | 6 | 160×96 | no | VN ch.140–141: a whirlwind of white ice blades sweeps and shreds anything inside | `A whirlwind of small white-blue ice blades spinning on the ground, seen from a low side angle as a flattened ellipse: frame 1 a faint frost ring, frame 2 blades start circling, frame 3 a tall spinning vortex, frame 4 at full height, frame 5 breaking apart, frame 6 frost fading.` |
| fx_huyet_trao | 4 | 64 | no | art (game-original Blood Hand demonic cultivator) | `A dark crimson claw strike: frame 1 three thin red streaks, frame 2 three bold crimson claw marks, frame 3 marks with crimson liquid droplets flying, frame 4 fading.` |
| fx_hut_mau | 4 | 64 | no | art | `Life drain: thin crimson liquid threads flowing from the right side toward the left with small red droplets. Frames: the threads flow and thin out.` |
| fx_huyet_trieu | 6 | 128×96 | no | art (game-original Blood Puppet) | `A surge of dark crimson liquid erupting from the ground in a flattened ellipse: frame 1 a dark red puddle, frame 2 bubbles rising, frame 3 a wave splashing up, frame 4 peak splash, frame 5 falling droplets, frame 6 the puddle shrinking.` |
| fx_manh_vo | 3 | 48 | yes | art (game-original Wine Puppet made of broken wine jars) | `Three small broken clay wine-jar shards spinning as they fly right, earthy brown with a dark outline. Frames: the shards rotate, loopable.` |

## 4. Batch B: status icons (tested on a training dummy first; all `art`)
| id | N | Cell | Loop | `{EFFECT}` |
|---|---|---|---|---|
| fx_st_mu | 4 | 48×24 | yes | `A small dark grey smoke cloud covering two eye shapes, as a blindness indicator floating above a head. Frames: the smoke drifts, loopable.` |
| fx_st_suy_yeu | 4 | 48×24 | yes | `A small downward-pointing broken grey blade icon with grey particles dripping, as a weakness indicator above a head. Frames: particles drip, loopable.` |
| fx_st_pha_giap | 4 | 48×24 | yes | `A small cracked shield made of dull orange light with glowing crack lines, as an armour-break indicator above a head. Frames: cracks flicker, loopable.` |
| fx_st_cam_hoi | 4 | 48×24 | yes | `A small green leaf crossed by a dark grey X, as a no-healing indicator above a head. Frames: the X pulses, loopable.` |
| fx_st_doc | 4 | 64×48 | yes | `Sickly green bubbles and thin green fumes rising around the body area, as a poison indicator. Frames: bubbles rise and pop, loopable.` |
| fx_st_hoa_tuong | 4 | 96×128 | yes | `A thin golden metallic crust forming over an EMPTY upright silhouette like a statue coating, small gold flakes. Frames: the crust glints, loopable.` (VN ch.462–463: Golden Point Gu turns anything it hits into a gold statue; the "breaks on hit" rule is game design) |
| fx_st_vo_tuong | 5 | 96×128 | no | `A golden statue coating shattering: frame 1 crack lines, frame 2 gold fragments bursting outward, frame 3 more fragments, frame 4 falling flakes, frame 5 dust.` |

## 5. Batch C: Gu creatures and objects (full animation from Blue's single frame)
Attach the matching reference from `assets/fx_ref/creature/` and add: `Exactly the same creature/object as the reference image, same colours, same scale, side view facing right.`

| id | Reference | N | Loop | Source | `{EFFECT}` |
|---|---|---|---|---|---|
| fx_cuxi | `fx_cuxi.png` | 6 | no | VN ch.186–188: Sawtooth Golden Centipede, golden armoured centipede with two rows of saw-like teeth | `The golden armoured centipede crawls fast to the right across the frame: legs ripple in waves, body undulates; frame 6 it is about to leave the right edge.` |
| fx_huyet_buc | `fx_huyet_buc.png` | 4 | yes | VN ch.186: a hundred blood bats chase the target (Blade-Wing Blood Bat) | `The crimson bat with blade-like wings flaps in place: one full wing-beat cycle, loopable.` |
| fx_ran_lua | `fx_ran_lua.png` | 4 | yes | VN ch.375–377: Yan Tu controls two fire snakes that swell up and strike | `The fire snake slithers in an S curve toward the right with flickering flames along its body, loopable.` |
| fx_o_that | `fx_o_that.png` | 4 | yes | VN ch.462: Black Room Gu releases dense black smoke; Gu inside it are sealed | `The black smoke cloud billows and curls in place, dark grey edges churning, loopable.` |
| fx_tran_ma_chain | `fx_tran_ma_chain.png` | 2 | – | VN ch.196: Demon-Suppressing Iron Chain | `Frame 1: one straight horizontal chain segment that tiles seamlessly left-to-right. Frame 2: the chain's end piece (a heavy iron hook-link) facing right.` |

## 6. Order and review
1. A1 → zip → Orange reviews.
2. A2 → B → C, one batch at a time.

Orange checks every batch:
- canon look matches the Source column;
- no pink fringe after keying;
- ≤16 colours;
- loops do not jump;
- the effect stays in its own frame;
- readable at small size.
