# Backlog animation, skill VFX và mẫu boss E

Gộp backlog chung, phần animation còn thiếu và plan gộp effect sát thân của boss; giữ kế hoạch code/input riêng để review.

## Mục lục

- [06_ANIMATION_SKILL_VFX_BACKLOG.md](#source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md)
- [09_E_ANIMATION_CAN_BO_SUNG.md](#source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md)
- [10_E_BOSS_SKILL_ANIMATION_PLAN.md](#source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md)

---

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md"></a>

## 06_ANIMATION_SKILL_VFX_BACKLOG.md

**Trạng thái:** Backlog sản xuất/QA và tích hợp chưa hoàn tất; có archive tải về không đồng nghĩa đạt chuẩn.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-backlog-asset-hành-động-cổ-trùng-damage-môi-trường-và-âm"></a>
## Backlog asset: hành động, cổ trùng, damage, môi trường và âm

Áp dụng cho năm phương án A–E. Đây là danh mục cần sản xuất/kiểm tra, không nói các asset đã đạt chuẩn. Chỉ sản xuất gói của phương án được chọn sau prototype; không nhân tất cả các action dưới đây với cả 38 nhân vật ngay từ đầu.

**Cập nhật chọn E:** archive master đã tải có đủ idle/run/attack/defend/heal/hit cho 38 nhân vật. Các gói P0 dưới đây đọc theo nghĩa **QA/tích hợp và tạo phần thiếu**, không yêu cầu vẽ lại sáu clip đã có. Backlog chính xác cho E nằm ở [09_E_ANIMATION_CAN_BO_SUNG.md](06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md); plan lập trình ở [08_E_KE_HOACH_IMPLEMENT_CU_THE.md](08_E_KE_HOACH_IMPLEMENT_CU_THE.md).

**Cập nhật sản xuất boss:** [10_E_BOSS_SKILL_ANIMATION_PLAN.md](06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md) chốt từng signature skill có choreography riêng và gộp local FX vào actor frame. Các yêu cầu body/FX tách trong tài liệu này đọc theo nghĩa kiến trúc logic và effect rời người; không bắt xuất riêng vệt chém/ánh sáng quanh tay của clip boss. Projectile, impact và world AoE vẫn riêng. Hai prompt thử độc lập nằm ở [bộ PN vs BNB Q1](../../../prompts/PROMPT_THU_BATTLE_PHUONG_NGUYEN_BACH_NGUNG_BANG_Q1.md).

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-1-tách-bốn-lớp-để-tăng-chất-lượng-battle"></a>
### 1. Tách bốn lớp để tăng chất lượng battle

| Lớp | Chứa gì? | Cách dùng |
|---|---|---|
| Body | Pose, locomotion, thi triển và phản ứng của nhân vật | Sheet runtime hoặc puppet được duyệt; mỗi nhân vật một model B khóa nhận diện |
| Skill FX | Projectile, beam, hộ thể, thú ảnh, bẫy, aura đúng cổ | Atlas riêng, neo theo hand/foot/ground, không vẽ cố định vào body |
| Feedback | Impact, block, damage text, trạng thái, hit-stop, âm | Sinh từ combat event thật; không tự áp damage |
| Battlefield | Vùng ý đồ, target marker, bóng chân, vật cản và mục tiêu | Dễ đọc vị trí/collision, dưới actor hoặc trên ground plane |

Icon cổ trong kho chỉ dùng UI. Animation lớn của kỹ năng có thể phối procedural mesh/particle với texture, không bắt mọi particle đều là tám frame PNG.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-2-kiểm-kê-và-qa-trước-khi-tạo-thêm"></a>
### 2. Kiểm kê và QA trước khi tạo thêm

Lập manifest cho asset được chọn: character ID, era/form, style, canvas, pivot, facing, handedness, frame count/durations, loop, anchor tay/chân, tag skill và trạng thái QA. Các alias như `macbac`/`mac_bac`, `phuongchinh`/`phuong_chinh`, `bai`/`bach_ngung_bang` cần mapping rõ; không đổi key save/encounter chỉ để đổi tên art.

Mỗi clip body giao tám PNG riêng + một sheet ghép cơ học + metadata; GIF preview tùy công cụ. Clip 256×256 → sheet 2048×256; thú dài chọn 384×256 → sheet 3072×256 trước khi sản xuất. Không trim/căn giữa từng pose; giữ pivot, alpha, anatomy và identity. Duyệt key pose và playback body-only trước effect.

**Ba lỗi đã có phải thành QA gate:** F02–F07 không đổi tóc/mặt/trang phục so với B; source và GIF decode không tích lũy body cũ; projectile sinh phía bàn tay và đi đúng facing, không wrap từ mép phải sang trái. Với runtime dùng PNG sheet, không phụ thuộc GIF disposal để chạy nhân vật.

Importer hiện tại `tools/import_battle_sprites.py` chưa đọc timing/pivot/variant, chưa enforce tám frame, chưa nhận idle; đang dùng GIF 100 ms và loop vô hạn. Cần nâng importer trong PR asset pipeline: whitelist đúng tám frame, bỏ sheet/contact sheet khỏi ZIP frame, kiểm tra alpha/canvas và không ghi đè bản đã duyệt. Chưa chạy importer hiện tại trên bộ mới trước khi có QA.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-3-điều-chỉnh-hợp-đồng-animation-cho-cơ-chế-mới"></a>
### 3. Điều chỉnh hợp đồng animation cho cơ chế mới

[Prompt hiện hành](../../../prompts/PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md) bắt F01/F08 về B cho sáu clip one-shot. Quy tắc đó phù hợp attack/hit nhẹ/heal/run ngắn, nhưng phải viết **prompt mới riêng** cho các state liên tục hoặc terminal:

| Loại clip | Hợp đồng đúng |
|---|---|
| One-shot thông thường | B → action → B khi actor vẫn đứng và rảnh; tám frame |
| Start | B → pose moving/charging/guarding; không ép frame cuối về B |
| Loop | Hai đầu khớp chu kỳ tương ứng, không xen B mỗi vòng; tám frame loop |
| Stop/recover | Pose state hiện tại → B; không pop từ pose chạy về B trước rồi mới stop |
| Hit lúc đang di chuyển/cast | Giữ vị trí/facing, blend hoặc đổi sang hit state; không reset actor về vị trí B trong world |
| Knockdown/getup | Đứng → nằm; nằm → đứng; hai clip riêng, không nằm rồi bật lên trong một clip |
| Defeat/death | State đầu → pose thất bại và giữ ở cuối; không tự quay về idle |
| Transformation | Base cũ → form mới; form mới có B/clip riêng và tồn tại theo logic canon |

Animation căn theo pivot local; world root được simulation cập nhật. Không kéo nguyên ảnh qua canvas để thay locomotion. Clip tám frame không có nghĩa gameplay phải tick ở 8 FPS: simulation và interpolation có đồng hồ riêng.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-4-backlog-body-action-mới"></a>
### 4. Backlog body action mới

P0 = cần trước khi chọn prototype; P1 = cần để hoàn thiện phương án; P2 = thêm sau khi core đã vui. Thời lượng bên dưới là khoảng thử, không số canon hay cam kết final.

| Action | Mô tả pose cần vẽ | Cần cho | Ưu tiên |
|---|---|---|---|
| `ready` | Vào thế từ pose ngoài battle, tay/chân tách rõ | A–E | P1 |
| `step_in`, `step_back` | Chuyển trọng tâm qua chân trụ, bước ngắn tiến/lùi | A/B | P0 |
| `walk_forward/backward` | Đổi chân thật, khi lùi mặt vẫn theo địch | C/D/E | P1 |
| `move_start` | Hạ trọng tâm, chân sau đạp, kết ở pose locomotion | C/D/E | P0 |
| `move_loop` | Chu kỳ chân/tay liên tục, không giật về B mỗi 0,6 giây | C/D/E | P0 |
| `move_stop` | Nhận lực và settle tóc/áo, về ready | C/D/E | P0 |
| `strafe_near/far` | Bước theo chiều sâu, giữ torso hợp góc camera | C/E | P1 nếu art test cần |
| `backstep` | Lùi một nhịp bằng chân, không đổi facing | A–E | P0 |
| `dash_start/loop/end` | Cú nén → thấp người lướt → phanh, khoảng 0,25–0,45 giây toàn dash | C/D/E | P1 |
| `cast_projectile` | Cổ tay/palm cast theo nhân vật, release anchor rõ | A–E | P0 |
| `cast_support` | Thu tay trước không khiếu/ngực, pose khác attack | A–E | P0 |
| `charge_start/hold/release` | Lấy lực, giữ động tác nhỏ, phát lực; hold có loop riêng | A–E | P1 |
| `channel_start/loop/end` | Thi triển kéo dài, đầu/cuối nhất quán, rõ lúc dễ bị ngắt | C/D/E, skill dài A/B | P1 |
| `interrupted` | Động tác khựng và tay thu vì bị ngắt, không vẽ vụ nổ mới | B–E | P1 |
| `guard_start/hold/end` | Tạo thế, giữ, hạ thế; không nhấc tay lên xuống mỗi hit | A–E | P0 cho D; P1 khác |
| `guard_react` | Khuỷu/gối hấp thu lực, trở lại hold | A–E | P0 |
| `parry` | Chuyển góc forearm/hand edge, không đánh tay generic | B/D | P1, tùy chọn |
| `guard_break` | Tay bật mở, mất thế, chuyển stagger | A–E | P1 |
| `light_attack_1/2` | Hai đường quyền khác nhau, không chỉ đổi màu effect | D, lực đạo A/C/E | Một clip P0; clip 2 P2 |
| `heavy_attack`, `recover` | Nén hông/vai → lực rõ → hồi thế có sơ hở | A–E | P1 |
| `stagger` | Mất thăng bằng ngắn khoảng 0,2–0,5 giây, giữ facing | A–E | P0 |
| `knockback` | Cơ thể nhận lực, root displacement do logic | D/E | P1 |
| `knockdown`, `getup` | Nằm cuối clip; đứng dậy có thứ tự khớp hợp lý | D/E | P1; chưa cần MVP |
| `jump_start/rise/apex/fall/land` | Nén gối → rời đất → đổi chiều z → chân nhận lực | D; cổ nhảy C/E | P1 cho D |
| `air_attack` | Đòn trên không với landing recovery | D | P2 |
| `command` | Chỉ tay/ra dấu đúng nhân vật chỉ huy, unit riêng | B/E, encounter nô đạo | P1 |
| `plant_trap` | Cúi/ra dấu ground, đọc được đặt bẫy, không mọc bẫy từ đầu | A/C/E theo cổ | P1 |
| `use_item` / `absorb` | Dùng linh dược/nguyên thạch, tách khỏi hồi máu magic | A–E | P1 |
| `flee` | Quay/rút khỏi trận theo điều kiện, không death rồi thưởng win | A–E | P1 |
| `defeat` | Mất thế/chịu thua hoặc chết theo encounter, giữ terminal pose | A–E | P0 |
| `victory` | Thư giãn ngắn đúng tính cách, không PN nhảy ăn mừng vô cớ | A–E | P2 |
| `transform_enter` và bộ form | Chuyển thân thật, form riêng giữ anatomy và state | Chỉ cảnh canon tương ứng | P2 |

Lướt cơ bản là động tác tránh vị trí được chuyển thể, **không tự có i-frame**. Lướt xa, xuyên vật cản, nhảy cao và bay cần công dụng cổ/đặc tính hợp lệ. Quái có bộ chuyển động theo anatomy: wolf pounce, boar charge, six-leg crocodile crawl, turtle step; không áp rig người cho mọi loài.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-5-gói-animation-riêng-theo-nhân-vậtbuild"></a>
### 5. Gói animation riêng theo nhân vật/build

| Nhân vật/nhóm | Cần thêm khác biệt |
|---|---|
| PN Q1 | Wrist cast ngắn, step/backstep tiết kiệm, guard da ngọc, hấp thu; không vẽ kiếm máu mặc định |
| PN Q2 lực đạo | Body quyền nặng và thú ảnh, Khí Lực range cast, Tự Lực Cánh Sinh hồi phục; dùng variant riêng thay body Q1 |
| BNB | Blade-hand/ice cast, di chuyển thanh thoát; nam Q1/nữ Q2 khóa model riêng, weapon chỉ khi B/skill cho phép |
| Thiết Đao Khổ | Hand-edge slash và tốc độ có recovery, không thay thành saber không nguồn |
| Cự Khai Bi / Thiết Bá Tu | Quyền tuyến tính có kỷ luật / quyền grounded hộ vệ; không dùng cùng một clip giant punch |
| Viêm Đột | Palm Fire Hand từ lão gầy, thêm fire snake FX đúng skill, giữ tay thật đủ ngón |
| Thiết Nhược Nam / Hàn Bất Lưu | Command và unit lính rơm/chó riêng, khác pattern đội hình |
| Điện Lang / heo / gấu | Pounce charge / tusk scoop / paw sweep, locomotion thú riêng |
| Thanh Thư / Nhất Đại / Bách Chiến Ôn | Form và chiêu theo scene; Mộc Mị/Hỏa Nhân hy sinh không loop về B như đòn thường |

Không bắt mọi NPC có healing animation phép thuật. Clip recovery chỉ để hồi sức thị giác; engine chỉ kích hoạt skill trị liệu khi nhân vật/build thực sự có khả năng đó.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-6-backlog-cổ-trùng-và-skill-fx"></a>
### 6. Backlog cổ trùng và skill FX

Skill identity dựa nguồn Q1/Q2 và data hiện hành; tên alias cần thống nhất khi mapping. Không phải tất cả dòng đều mở cho người chơi ngay từ đầu.

| Cổ/nhóm | Animation/effect cần tạo | Tín hiệu gameplay | Ưu tiên |
|---|---|---|---|
| Nguyệt Quang | Wrist charge nhỏ → blue crescent riêng → impact arc → fade | Projectile ngắn theo tầm skill, phía đối thủ | P0 Q1 |
| Nguyệt Mang và biến thể nguyệt đạo | Độ dài/cường độ/đường hình riêng theo dữ liệu | Nhìn khác Nguyệt Quang, không chỉ nhân số damage | P1 |
| Huyết Nguyệt | Crescent huyết sắc + impact/chảy máu theo skill | DOT báo tick, không healing tùy tiện | P1 |
| Ngọc Bì / Đồng Bì / Thiết Bì / Bạch Ngọc | Overlay da/viền đúng chất liệu, pulse on-hit, tắt sạch | Trạng thái hộ thể còn hiệu lực, loại giảm damage | Ngọc Bì P0; khác P1 |
| Thiên Bồng / Thủy Tráo | Lớp hộ thể riêng, rung/impact và break/dissipate | Hình dạng khác body armor, không che actor | P1 |
| Trị Liệu / Cửu Diệp Sinh Cơ | Anchor hồi phục + ánh sáng/leaf hợp cổ + kết thúc | Heal thật, cure theo dữ liệu; số hiện khi commit | Trị Liệu P0; khác P1 |
| Băng Nhận/Băng Đao | Hand cast/slash + ice shard/crescent + frost hit | Chậm/đông khi skill có, không giả stun bằng FX | P1 Q2 |
| Phong Nhận/Toàn Phong | Wind arc, spin nhẹ, impact gió | Phân biệt đường đòn với moonblade | P1 |
| Cường Thủ | Grasp/reach riêng + anchor target | Lấy cổ/hiệu ứng theo resolver; không coi luôn là stun | P1 theo cảnh |
| Cự Xỉ Kim Ngô | Prop/weapon riêng từ skill, serrated trail và hit | Giữ chiều dài/đạo cụ đúng form, không sinh vũ khí cho mọi clip | P2 |
| Địa Thính Nhục Nhĩ | Pose lắng nghe + vòng rung ground/trinh sát | Mở thông tin, không attack projectile | P1 cho encounter cần |
| Tiêu Lôi Thổ Đậu | Plant marker, armed state, trigger flash, blast, crater nhẹ | Trigger do actor bước vào vùng, phân biệt đất hợp lệ | P1 C/E |
| Cốt Thương / Loa Toàn Cốt Thương | Bone projectile + xoắn riêng + hit | Range/pierce đúng dữ liệu và target | P1 Q2 |
| Toàn Lực Ứng Phó / thú lực | Hư ảnh thú xuất hiện ở quyền, scale/pose thống nhất | Trigger do rule thú lực, không roll lại trong renderer | P0 prototype Q2 |
| Khí Lực | Thú ảnh hóa kình lao riêng khỏi body | Range hit; không để actor tự bay cùng ảnh thú | P1 Q2 |
| Khổ Lực | Overlay nhấn lực/stance khi thương tăng, UI giải thích | Modifier tính từ HP thật, không nhân damage mỗi FX pulse | P1 Q2 |
| Tự Lực Cánh Sinh | Channel hồi phục lực đạo, pulse mô cơ có tiết chế | Heal theo strength/build, khác phép heal xanh chung | P1 Q2 |
| Cốt Dực | Enter flight, hover/move/land form và wing layer riêng | Altitude và ability target bay thật; không chỉ thêm cánh trang trí | P2 |
| Hỏa Thủ / Hỏa xà | Flame-hand/entity và trail riêng, đúng caster | Telegraph fire skill, actual hit volumes | P1 đối thủ Viêm Đột |
| Trấn Ma Thiết Tác | Chain extend/contact/retract với anchor hai đầu | Cảnh/skill của Thiết Huyết Lãnh; không có sét vô cớ | P2 encounter |
| Lính rơm / chó | Spawn/command/hit/despawn + unit sheets riêng | Số unit/cost/lifetime do logic, không sprites giả damage | P1 E; P2 khác |
| Huyết bức / huyết trì | Entity swarm FX, nguồn máu/node báo trạng thái | Tách environment regen và projectile hit | P2 boss |
| Ẩn Lân/ẩn thân | Fade/outline người chơi + reveal pulse theo luật | AI biết/không biết target do simulation; alpha không quyết định stealth | P2 |

MVP skill library: một nguyệt nhận, một quyền, một hộ thể, một heal, một beast charge và một telegraph. Sau đó mở một bộ Q2 lực đạo/băng. Không làm đủ vài chục cổ trước khi quyết định cơ chế.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-7-damage-trạng-thái-và-trải-nghiệm-va-chạm"></a>
### 7. Damage, trạng thái và trải nghiệm va chạm

| Kết quả | Hiển thị/âm/animation cần bổ sung |
|---|---|
| Hit thường | Actor `hit`, impact tại contact, một số damage, tiếng trúng ngắn |
| Critical | Impact rõ hơn, nhấn số và tiếng riêng; không rung camera mọi lần |
| Block | Guard reaction, spark đúng chất liệu, số damage nhận thật; báo lượng chặn nếu rule có |
| Miss / evade | Đường đòn đi hụt, chữ ngắn đúng lý do; không vẫn phát hit sprite |
| Guard break | Shield vỡ/tắt → mất thế → cửa sổ stagger rõ |
| Pierce | Dấu xuyên thủ, armor effect khác; giải thích vì sao vẫn mất máu |
| DOT poison/bleed | Icon và tick nhẹ, không restart `hit` khiến actor bị stun thị giác mỗi tick |
| Freeze / slow / stun | Effect persistent, timer luật, phản hồi skill bị khóa |
| Heal / cure | Heal xanh hoặc màu hợp cổ, cleanse icon riêng; không cộng HP hai lần |
| Immune / resisted | Nhãn và effect yếu đúng kết quả; không im lặng nuốt skill |
| Kill / survive / flee | Terminal/presentation riêng, scene và reward đúng loại kết thúc |

Định nghĩa event: `actionId`, `hitId`, `source`, `target`, `skillId`, `simulationTime`, `position`, `amount`, `flags`, `statusChanges`. Damage chỉ commit một lần theo cặp action/hit/target, ngoại trừ multi-hit có hitId khác được khai báo. Forecast và presentation dùng kết quả này, không tự roll RNG hoặc lấy số damage mẫu.

Không chốt công thức damage mới trong plan mỹ thuật. Tách các bước đang có: base → modifier/build → defense hợp lệ → actual damage → HP/status. Nếu thay DR/armor phải có bảng chuyển đổi và simulation; không áp thêm một công thức DR mới lên giảm damage hiện tại rồi làm double mitigation.

**Hit-stop:** thử 40–80 ms cho hit nặng, 0–30 ms hit nhẹ, giữ nguyên timer logic nếu dùng presentation pause; nếu muốn freeze gameplay phải freeze toàn simulation có chủ đích. Giảm rung/chớp theo reduced-motion, effect không che telegraph. Audio gồm windup, release, projectile travel nhẹ, impact flesh/armor, block, break, cast heal, dodge/land và death/defeat.

<a id="source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md-8-gói-sản-xuất-theo-mức-ưu-tiên"></a>
### 8. Gói sản xuất theo mức ưu tiên

- **Gói P0 thử cơ chế:** PN Q1 và một thú/cổ sư; B/idle/attack/defend/hit/defeat, một cast, step hoặc locomotion tùy A/C, nguyệt nhận + guard + heal + impact + telegraph. Chọn bản asset đẹp và ổn định, không phủ tất cả roster.
- **Gói P1 chọn phương án:** hoàn thiện action bắt buộc của phương án, thêm PN Q2/BNB đúng biến thể, một skill lực đạo, một băng, một boss pattern và kết quả cầm chân/thoát.
- **Gói P2 mở rộng:** roster Q1–Q2, summon/bẫy/bay/biến thân theo chương, finisher/victory và variation. Chỉ thêm clip khi có skill/state/encounter sử dụng thật.

Trước khi phát hành: đo texture memory, lần upload texture, số unit/projectile và frame time trên máy/mobile thật. Preload atlas của encounter đang chơi, không nạp toàn bộ 38 nhân vật và mọi form vào một trận.

---

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md"></a>

## 09_E_ANIMATION_CAN_BO_SUNG.md

**Trạng thái:** Backlog sản xuất/QA và tích hợp chưa hoàn tất; có archive tải về không đồng nghĩa đạt chuẩn.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-e--cần-bổ-sung-animation-nhân-vật-nào-khi-sáu-action-đã-tải-đủ"></a>
## E — Cần bổ sung animation nhân vật nào khi sáu action đã tải đủ?

Ngày 02/10/2026. Sáu action `idle/run/attack/defend/heal/hit` đã có file cho 38 nhân vật trong archive master. Giữ và QA bộ này. Danh sách dưới đây phân biệt **bắt buộc tạo mới**, **có thể tận dụng**, **chưa cần cho MVP**.

**Cập nhật chiêu boss:** dùng [plan animation theo skill, gộp local effect](06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md). Hai clip thử PN Nguyệt Mang/BNB Băng Đao được tạo riêng có effect sát thân nằm trong frame; không dùng `attack` chung thay các signature skill. Bảng locomotion/terminal phía dưới vẫn áp dụng khi triển khai E.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-1-sáu-action-đang-có-dùng-thế-nào"></a>
### 1. Sáu action đang có dùng thế nào?

| Đã có | Dùng trong E | Điều kiện |
|---|---|---|
| idle | Đứng chờ, menu pause giữ pose hiện tại | Loop đọc từ manifest, không restart mỗi render |
| run | Bước chạy ngắn, enemy lunge nếu chuyển động phù hợp | Manifest loop=false; không repeat để giả chạy liên tục |
| attack | Basic attack hoặc placeholder sandbox | Signature skill dùng clip riêng đã gộp local effect theo plan mới; release anchor/marker khớp skill |
| defend | Cast hộ thể hoặc phản ứng đỡ ngắn | Buff logic có thể tồn tại sau clip; không cần giữ body thủ khi dùng Ngọc Bì |
| heal | Cast trị liệu hoặc hồi sức theo skill thật | NPC không có heal power không được hồi HP chỉ vì có ảnh |
| hit | Hit reaction nhẹ, recoil | Không lặp mỗi DOT tick; không thay thế defeat bằng hit→idle |

Trước khi yêu cầu vẽ thêm cast hoặc stagger, xem clip attack/defend/hit hiện có có đáp ứng được không. Chỉ tạo thêm khi pose/nhịp thực sự khác; các texture cổ và impact mới không bắt tạo lại body.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-2-gói-bắt-buộc-tối-thiểu-7-clip-mới-cho-prototype-ba-actor"></a>
### 2. Gói bắt buộc tối thiểu: 7 clip mới cho prototype ba actor

Ba actor MVP: **Phương Nguyên Q1, heo rừng, hắc hùng**. Nhân vật khác nhập dần khi encounter cần.

| Clip mới | PN | Heo | Gấu | Tổng | Lý do |
|---|---|---|---|---|---|
| `move_loop` | Có | Có | Có | 3 | Giữ WASD/AI chạy liên tục, không reset đứng mỗi vòng |
| `defeat` | Có | Có | Có | 3 | Kết trận giữ pose ngã/chịu thua, không trở lại idle |
| `dash` | Có | Không ở MVP | Không ở MVP | 1 | Cú né thấp, nhận lực/phanh; không dịch nguyên ảnh idle |

**Tổng 7 clip × 8 frame = 56 PNG frame nguồn và 7 sheet.** Đây là số clip mới cần sản xuất cho MVP, không tính sáu action đã tải. Nếu cần PN Q2 hay boss ở prototype thì có bộ bổ sung riêng, không tự nhân 7 clip cho cả roster.

MVP dùng pose đầu/cuối locomotion qua chuyển state ngắn; chấp nhận chưa có clip start/stop riêng. Vẫn phải chơi thử để bảo đảm không pop quá rõ. Nếu transition xấu thì kéo `move_start/stop` từ P1 lên trước E-03; không release một bản chạy giật để giữ số 7.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-yêu-cầu-pose-của-ba-action-mới"></a>
#### Yêu cầu pose của ba action mới

- PN `move_loop`: gối/ankle và hai tay đối chân đổi pha thật, tóc/áo lag nhẹ. Các frame đầu/cuối ở **cùng phase chạy**, không đứng B. Root local giữ ổn, world movement do engine. Góc sideview phải, trái mirror có duyệt; W/S giữ shadow/depth.
- Boar `move_loop`: bốn chân đi/gallop đúng loài, lưng không scale, cổ/tusk giữ design; không duplicate chân để tăng tốc. Bear `move_loop`: bốn chân chuyển trọng lượng nặng, shoulder hump ổn định; không copy gait boar.
- PN `dash`: nén gối → thân thấp lao → chân trước nhận lực → settle; one-shot có B ở đầu/cuối khi không bị ngắt. Quãng world displacement do simulation. Không mặc định có aura/i-frame.
- `defeat`: đúng anatomy/ngã hoặc mất thế theo encounter, frame cuối giữ bất động. **F08 không được về B.** Với scene chịu thua/được tha chọn `defeated`, không tự vẽ máu/chết để phá nguyên tác.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-3-gói-p1-làm-chuyển-động-và-trạng-thái-đẹp-hơn"></a>
### 3. Gói P1 làm chuyển động và trạng thái đẹp hơn

| Clip | Actor cần | Có thể lấy từ cũ không? | Khi cần |
|---|---|---|---|
| `move_start`, `move_stop` | Player và enemy có locomotion | Có thể thử ghép/retime key pose nếu identity/pose liền mạch; nếu không vẽ mới | Khi P0 pop giữa đứng/chạy |
| `backstep` | Player, một số cổ sư | run thường không phù hợp vì torso/facing khác | Né lùi khi vẫn nhìn địch |
| `strafe_near`, `strafe_far` | Player trước | Chưa bắt buộc nếu sideview W/S đọc tốt | Khi chiều sâu nhìn như trượt ảnh |
| `cast_projectile` | PN/BNB/cổ sư có đòn xa | Dùng attack hiện có nếu đã đúng wrist/palm cast | Khi actor đang đấm nhưng skill lại phóng cổ |
| `cast_ground` | Actor có bẫy/đòn ground | Không dùng cast projectile chung | Trồng Tiêu Lôi Thổ Đậu/đặt ground skill |
| `channel_loop` + enter/end | Actor có cast dài | heal chỉ dùng được nếu thật sự loop và không đổi anatomy | Hấp thu/skill channel đã có luật gameplay |
| `guard_hold`, `guard_react` | Actor có thế thủ kéo dài | defend có thể làm cast hộ thể; không tự loop nó làm hold | Chỉ khi thêm guard stance chủ động |
| `stagger`, `interrupted` | Player và enemy có thể bị ngắt | Có thể reuse hit ngắn nếu reaction đủ rõ, không reset sai | Khi hit nhẹ và phá thế cần khác nhau |
| `heavy_attack`, `recover` | Build lực đạo/boss | Attack sẵn có thể đủ nếu windup/recovery rõ | Đòn nặng thực sự cần pose khác |
| `flee_exit` | Player | Dùng move_loop rời viewport nếu hợp scene | Rút lui không đứng ngay giữa sân rồi mất sprite |

Không yêu cầu một clip `cast` cho từng cổ riêng. Dùng body cast archetype **đã duyệt cho từng nhân vật** và skill FX khác nhau; chiêu có body motion đặc thù mới cần thêm clip.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-4-p2--chỉ-tạo-khi-mở-tính-năngencounter-tương-ứng"></a>
### 4. P2 — Chỉ tạo khi mở tính năng/encounter tương ứng

| Nhóm | Action cần bổ sung | Điều kiện |
|---|---|---|
| Knockdown | knockback, knockdown, ground_hold, getup | Có rule hất/ngã; không combo vô hạn |
| Nhảy | jump_start/rise/apex/fall/land | Cổ nhảy/encounter cần; W không đổi thành nhảy trong E |
| Phi hành | flight_enter, hover_loop, fly_loop, flight_land | PN Cốt Dực/actor có khả năng, altitude/collision riêng |
| Nô đạo | command, summon; unit idle/move/attack/hit/defeat | Thiết Nhược Nam/lính rơm, Hàn Bất Lưu/chó hoặc build hợp canon |
| Biến thân | transform_enter + toàn bộ B/action của form mới | Mộc Mị, Hỏa Nhân, giant, tiger form theo cảnh; form hy sinh không reset về B người |
| Cinematic | victory, finisher, unique intro | Core và combat readability đã tốt; không lấy finisher che thiếu gameplay |

Bay/biến thân không phải chỉ tạo một sheet 8 frame rồi bật flag. Cần luật và art form đúng thời kỳ; BNB Q1/Q2 không đổi giữa clip.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-5-asset-skilleffect-còn-phải-làm-dù-body-đủ"></a>
### 5. Asset skill/effect còn phải làm dù body đủ

MVP: projectile nguyệt nhận **riêng body**, impact hit/guard, overlay Ngọc Bì, heal pulse, boar charge telegraph, target ring, ground shadow và damage text. Các particle có thể procedural; không bắt generate tất cả bằng AI.

Thêm sau: Q2 beast apparitions (Toàn Lực), Khí Lực projectile, băng, bone spear, Tiêu Lôi Thổ Đậu plant/armed/blast, summon units và buff/debuff markers. Chi tiết trong [backlog chung](06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md).

Damage/HP và projectile path do simulation; `attack` F05 chỉ là pose release trình bày. GIF encode không làm asset authoritative; PNG sheet là nguồn runtime. Composite preview có rộng hơn actor canvas không được import nhầm thành sheet nhân vật.

<a id="source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md-6-cách-giao-cho-ai-sản-xuất-bổ-sung"></a>
### 6. Cách giao cho AI sản xuất bổ sung

Đính kèm **B và sheet cũ thực sự của đúng nhân vật**. Ghi rõ tạo action mới dựa trên design đã có, không redesign tóc/mặt/trang phục. Không đưa đường dẫn local cho AI bên ngoài. Mỗi clip yêu cầu tám PNG riêng + sheet ghép code, timing/pivot/loop và animation type.

Prompt mới phải viết riêng cho từng character/action. `move_loop` dùng loop seam theo phase chạy; `dash` one-shot; `defeat` terminal. Không paste nguyên quy tắc F01/F08=B của bộ sáu action cũ vào tất cả clip mới.

Thứ tự sản xuất đề xuất: PN move_loop → PN dash → PN defeat → boar move_loop/defeat → bear move_loop/defeat. Sau QA playable, bổ sung start/stop và cast riêng nếu reuse clip cũ chưa đạt. Từng batch duyệt body-only/alpha bounds/identity trước FX và GIF.

---

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md"></a>

## 10_E_BOSS_SKILL_ANIMATION_PLAN.md

**Trạng thái:** Backlog sản xuất/QA và tích hợp chưa hoàn tất; có archive tải về không đồng nghĩa đạt chuẩn.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-plan-review-animation-theo-từng-chiêu-gộp-effect-sát-thân"></a>
## Plan review: animation theo từng chiêu, gộp effect sát thân

Ngày: 02/10/2026. Phạm vi: thiết kế sản xuất và prompt thử, chưa sinh asset hay triển khai battle. Tiếp tục cơ chế E. Mẫu PN đấu BNB là sandbox kiểm tra chất lượng animation, không tự thêm một kết cục đánh thắng BNB vào campaign.

**Bộ thử mở rộng:** [51 actor action cho PN/BNB nam](../../../prompts/PROMPT_FULL_BATTLE_CLICKMOVE_PN_BNB_NAM.md) và [input click-to-move/phím mở](11_E_CLICKMOVE_FULL_PN_BNB.md) là hướng thử mới. Sáu chiêu PN/năm chiêu BNB là tuyển tập sandbox nhiều mốc, không còn khóa toàn bộ loadout vào đúng ch132–135 như batch hai chiêu cũ bên dưới.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-1-quyết-định-sản-xuất"></a>
### 1. Quyết định sản xuất

Boss/cổ sư có bộ chiêu cố định dùng **animation riêng cho từng chiêu**, vẽ luôn effect sát thân trong frame: băng quanh tay/đao, vệt chém, tia sáng quanh cổ tay, lửa khởi chiêu. Không tạo một động tác đấm chung rồi thay màu để giả các chiêu khác nhau.

Phân chia theo hành vi của effect:

| Thành phần | Cách xuất | Ai điều khiển? |
|---|---|---|
| Body + effect sát thân | Một frame RGBA đã gộp, một sheet chiêu | Actor animation player |
| Projectile đã rời người | Asset/entity riêng, spawn tại release anchor | Simulation di chuyển và collision |
| Impact lên mục tiêu | Effect riêng tại contact thật | Hit event từ resolver |
| Hộ thể có duration | Clip cast gộp effect khởi động; overlay/buff persistent riêng nếu cần | Buff state, không repeat cast |
| Vùng lửa/băng/bẫy | World entity/effect riêng | Encounter/skill state |

Không vẽ projectile đi hết sân, đối thủ bị đánh hoặc damage text vào actor sheet. Người chơi E có thể né và khoảng cách thay đổi; impact chỉ xuất hiện khi thực sự trúng. Effect cận thân có thể thay đổi/bùng lên theo frame nhưng không được che hết cử động khớp.

Định dạng bắt buộc của clip chiêu: tám PNG riêng đã chứa body + local FX → sheet ghép bằng code → GIF preview. Giữ tám PNG nguồn để sửa từng frame. Một static skill-effect pose không tính là tám frame chuyển động.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-2-hai-nhân-vật-và-thời-kỳ-mẫu"></a>
### 2. Hai nhân vật và thời kỳ mẫu

Chọn Q1 giai đoạn khu vực Man Thạch/đối đầu quanh ch132–135: PN đã có Nguyệt Mang sau ch101; BNB là **nam, tóc trắng, hai tay còn nguyên**, chưa biến thể nữ Q2 và chưa cắt tay ch139. Dùng nguồn [Q1](../../../reference/CHI_TIET_NGUYEN_TAC_Q1.md) và skill ID hiện hữu `nguyetmang`, `bangdao` trong [data game](../../../../js/data.js).

Nguyệt Mang là nguyệt nhận sắc/đậm hơn, không biến thành kiếm máu. Băng Đao có trong dữ liệu game của BNB; choreography cụ thể và việc ngưng/tan đao trong clip là diễn giải mỹ thuật cho prototype, không khẳng định truyện tả chính xác tám pose này.

Ảnh B của đúng nhân vật/thời kỳ là đầu vào bắt buộc để giữ identity khi đã có asset. Archive master có một hồ sơ BNB, nhưng manifest không tự chứng minh nam Q1 hay nữ Q2. Nếu ảnh hiện có là nữ thì **không dùng** cho mẫu này; dùng ảnh nam Q1 hợp lệ hoặc duyệt B nam mới trước. Không đổi giới tính bằng cách yêu cầu AI sửa mỗi frame.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-3-ma-trận-asset-cho-trận-mẫu"></a>
### 3. Ma trận asset cho trận mẫu

| Nhân vật | Clip/skill | Tái sử dụng hay tạo? | Gộp vào actor | Tách ngoài actor |
|---|---|---|---|---|
| PN Q1 | idle, hit, heal/defend hợp skill | QA và tái dùng bộ đã tải | Actor theo clip | Buff/heal logic đúng sở hữu |
| PN Q1 | `skill_nguyetmang` | Tạo thử animation chiêu, dùng B cũ | Charge cổ tay, local glint và flash release nhỏ | Nguyệt nhận bay, impact |
| BNB nam Q1 | idle, hit | Tái dùng nếu variant đúng; nếu sai cần B/clip nam riêng | Actor | Không tự có heal |
| BNB nam Q1 | `skill_bangdao` | Tạo thử animation chiêu | Ngưng băng/đao, vệt chém và mảnh băng gần đao | Contact impact khi mục tiêu trong reach |
| Hai bên | move_loop | Bổ sung để chơi E; không chặn review chiêu đứng tại chỗ | Gait riêng từng người | Root motion do world |
| PN | dash | Bổ sung trước playable E | Nén → lao → phanh; bụi sát chân nếu có | World displacement, không tự i-frame |
| Hai bên | defeat/spared | Bổ sung theo outcome | Pose terminal | Kết quả/scene không baked vào ảnh |

**Batch review đầu chỉ hai clip skill**, không làm toàn bộ bảng một lần. Chưa yêu cầu thêm phi hành/nhảy/biến thân. BNB không dùng Bắc Minh tự bạo như chiêu thường có recovery về B.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-4-bộ-chiêu-khi-mẫu-đạt-chuẩn"></a>
### 4. Bộ chiêu khi mẫu đạt chuẩn

PN: Nguyệt Mang trước, tiếp theo cast Bạch Ngọc/Thiên Bồng tùy thời kỳ và sở hữu thật; Q2 lực đạo là variant/build khác với bộ quyền/thú ảnh riêng. BNB: Băng Đao trước, tiếp theo Thủy Tráo và chiêu băng khác khi skill table/encounter xác nhận. Không thêm phép chỉ để đủ ba/four chiêu.

Roster boss mở sau: Thiết Đao Khổ hand-edge slash + vệt đao; Viêm Đột Fire Hand cast + local lửa, Hỏa Thủ là entity; Thiết Huyết Lãnh chain swing nhưng đoạn xích tương tác target phải có hai anchor. Mỗi dòng cần kiểm tra thời kỳ/công dụng cổ trước prompt riêng.

Mỗi boss có skill table gồm `skillId`, era/form, startup/active/recovery, targeting, range, cost/cooldown, local baked FX, detached FX và animation binding. Basic movement/hit vẫn cần, nhưng `attack` chung không thay cho signature skills.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-5-hợp-đồng-chống-lệch-và-chống-lỗi-archive-cũ"></a>
### 5. Hợp đồng chống lệch và chống lỗi archive cũ

- Frame 256×256 cho mẫu hai người, sheet 2048×256, pivot (128,224), padding ít nhất 12 px cho **cả body và local FX**. Nếu quá chật thì đồng loạt đổi canvas/registration; không thu nhỏ riêng frame peak.
- Asset canonical đều nhìn phải. Viewer đặt PN bên trái nhìn phải, BNB bên phải mirror nhìn trái. Không bắt AI sinh lại BNB nhìn trái rồi dùng pivot/anchor từ bản phải.
- Anchor ở pixel canvas từng frame. Mirror tọa độ tâm pixel: `x' = W - 1 - x`. World anchor dùng cùng actor transform/pivot/scale, gồm flip; không cộng hai lần mirror. Nếu engine dùng tọa độ cạnh pixel thì quy ước x'=W-x, phải thống nhất trong manifest/viewer.
- Release event là logical marker được skill binding chốt, đồng bộ pose; không làm damage từ callback GIF hoặc mỗi lần thấy F05.
- Khi ghép sheet phải copy toàn RGBA pixel nguyên vẹn. Không dùng alpha mask khi paste làm alpha bị áp lần hai; kiểm tra cắt sheet ra khớp frame nguồn ở alpha và màu visible. Không cần sửa RGB của pixel alpha=0 chỉ để làm diff đẹp.
- F01/F08 của chiêu thử bằng B: local FX/temporary blade tan hết. Nếu B đã có vũ khí thì F08 giữ đúng vũ khí ban đầu. Không bắt model vẽ lại pixel-exact; copy B ở hậu kỳ.
- Không duplicate mặt/tay/đao để giả motion blur, không bắn đạn qua mép rồi wrap về bên trái. Phải nhìn được khớp cử động dù tắt độ chói FX.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-6-review-gate-và-sửa-đúng-lớp"></a>
### 6. Review gate và sửa đúng lớp

**Gate A — Reference/pose:** duyệt B của hai nhân vật và F03/F05. Body phải giữ tóc/mặt/trang phục, pose hai chiêu khác hẳn. Đao và mảnh băng phải là tạm thời của skill, không làm mọc thêm tay.

**Gate B — Clip:** xem tám frame, playback chậm/đúng tốc độ, nền sáng/tối. Kiểm tra seam B, margin, identity và local FX đã gộp. Thiếu tool ghép/alpha thì báo thiếu, không nhận là asset runtime hoàn chỉnh.

**Gate C — Tích hợp:** xem actor bên trái/phải, scale 1× và 1,5×, tại hai khoảng cách. PN đạn sinh đúng tay ở F05; BNB chém cận chiến chỉ impact khi target trong hit shape. Mục tiêu né thì không có impact/hit/damage. Xem pause/resume và animation interrupt không giữ vệt FX cũ.

**Phân loại sửa:** kỹ thuật export/alpha/sheet là FIX_PACKAGING; pose/limb sai là FIX_FRAMES; khác identity toàn clip là REGENERATE_FROM_B; hợp đồng thiếu dữ kiện là BLOCKED_REFERENCE. Không tự regenerate cả archive khi chỉ sheet ghép sai.

<a id="source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md-7-triển-khai-sau-review"></a>
### 7. Triển khai sau review

1. Duyệt hai B và hai signature clip bằng [prompt thử](../../../prompts/PROMPT_THU_BATTLE_PHUONG_NGUYEN_BACH_NGUNG_BANG_Q1.md).
2. Viewer/sandbox phát clip gộp local FX và projectile/impact riêng, overlay pivot/anchor tùy bật. Nếu còn lệch thì sửa metadata/compositor trước mở content.
3. Thêm hai skill bindings vào E skill table và thử vị trí/né/trúng thật. Không thay campaign encounter ở bước art review.
4. Khi cơ chế E được triển khai, bổ sung move_loop/dash/terminal cho hai actor rồi nối scene qua campaign adapter.

Các thông số cost/damage/slow không sinh từ prompt art. Resolver lấy data game, bảng chuyển sang E được duyệt riêng. Bộ test này chưa cần UI trang mới, cinematic hoặc ảnh hai người nằm trong cùng actor sheet.
