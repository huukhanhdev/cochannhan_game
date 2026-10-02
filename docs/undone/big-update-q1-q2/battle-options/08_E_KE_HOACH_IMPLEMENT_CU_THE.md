# E — Kế hoạch triển khai cụ thể đấu trường 2.5D WASD

Ngày 02/10/2026. Trạng thái: kế hoạch triển khai theo yêu cầu chọn E; chưa sửa engine, import asset hay phát hành mode. E là hướng triển khai hiện tại; các đề xuất thử A/C trước trong tài liệu cũ là lịch sử so sánh.

**Input đề xuất mới nhất:** bảng lệnh phía dưới, WASD chọn action/skill và Z xác nhận theo [12_E_MENU_WASD_Z_COOLDOWN.md](12_E_MENU_WASD_Z_COOLDOWN.md). Bản [click-to-move và kit PN/BNB](11_E_CLICKMOVE_FULL_PN_BNB.md) giữ bộ kit/animation và shortcut tham khảo. Các mô tả WASD di chuyển, bốn quick slot và phím trực tiếp dưới đây là baseline cũ; không ghi đè hướng chọn lệnh mới hoặc giới hạn số skill.

**Cập nhật animation chiêu:** theo [10_E_BOSS_SKILL_ANIMATION_PLAN.md](06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-10-e-boss-skill-animation-plan-md), boss có clip riêng mỗi signature skill với local effect gộp trong frame. `attack` chung chỉ làm basic/placeholder; phần projectile/impact/world entity vẫn do simulation và presentation riêng. Batch art review PN–BNB là mẫu bổ sung, không thay thế MVP PN–heo–gấu để kiểm thử E.

## 1. Chốt trải nghiệm cần làm

Giữ giao diện thế giới, map, kho cổ và nội dung Q1–Q2. Khi vào battle, đấu trường trở thành mặt sân có chiều sâu: tự chạy WASD, chọn hướng/mục tiêu, dùng cổ, lướt khỏi vùng đòn và đối phó nhiều địch. Không chuyển thành game platform; W/S đi theo chiều sâu mặt đất, không nhảy.

**MVP chơi được:** PN Q1, một heo rừng ở bài đầu; bài thứ hai thêm gấu để thử hai địch. Có basic strike, Nguyệt Quang, Ngọc Bì, Trị Liệu, lướt, pause và mục tiêu thoát trong sandbox. Loadout mẫu chỉ dùng sandbox; vào campaign thì chỉ cấp nút từ cổ thực sự sở hữu. Chưa làm nô đạo, bay, nhảy, biến thân, multi-stage boss hoặc hàng chục unit.

Tận dụng sáu action đã tải; xem [danh sách animation bổ sung](06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md). Đừng để việc tạo đủ clip cho 38 nhân vật trì hoãn prototype đầu.

## 2. Asset đã kiểm kê, thay cho giả định cũ

Đã đọc cấu trúc archive `chibi_battle_master.zip` trong Downloads:

| Hạng mục | Kết quả kiểm kê |
|---|---|
| Hồ sơ/manifest | 38 nhân vật |
| Action mỗi nhân vật | idle, run, attack, defend, heal, hit |
| Frame nguồn | 1.824 PNG; từng nhóm action có đủ tám file theo số thứ tự |
| Sheet/GIF | 228 sheet và 228 GIF |
| Kích thước frame đọc từ PNG header | 1.728 frame 256×256; 96 frame 384×256 |
| Loop đọc từ manifest mẫu | idle=true; run/attack/defend/heal/hit=false |
| Pivot mẫu | Người: (128,224); Điện Lang: (192,224) |

Đây là kiểm kê file/header/metadata, **chưa là QA thị giác cả bộ**. Archive mới khác ba GIF lỗi từng gửi riêng; không mặc định archive mới có hoặc không có cùng lỗi. Nội dung `status: COMPLETE` trong manifest cũng không thay kiểm tra playback.

Archive chưa xuất hiện thành bộ hoàn chỉnh trong thư mục runtime hiện tại. PR đầu nhập bộ mới theo version và mapping, không ghi đè các sheet PN thử cũ. Chỉ đọc ZIP đã chọn, không quét/import mọi ZIP trong Downloads. Bản plan không cần đường dẫn Downloads làm runtime dependency.

## 3. Điều khiển và HUD cố định cho MVP

| Input | Hành động | Quy tắc |
|---|---|---|
| WASD | Di chuyển ground plane | Normalize vector, diagonal không nhanh hơn; không nhận phím khi focus input/menu |
| Chuột di chuyển | Đặt hướng aim | Convert screen → ground; facing theo aim lúc cast, theo movement khi rảnh |
| Click trái | Đánh tay theo hướng/mục tiêu | Không teleport; chỉ trúng trong reach và sector |
| 1–4 | Bốn quick slot cổ | Chỉ trỏ tới cổ đang sở hữu; chọn lại ngoài trận/pause hợp lệ |
| Space | Lướt ngắn | Theo movement, hoặc facing nếu đứng yên; không i-frame mặc định |
| Tab | Cycle lock-on | Lọc mục tiêu sống/trong vùng nhìn; target chết thì bỏ khóa |
| P / nút Pause | Dừng simulation | Không hồi năng lượng/cooldown, không chạy projectile/DOT |
| Esc | Menu | Tự pause; thoát menu không tự resume khi vẫn còn lý do pause khác |

HUD: HP, chân nguyên/cap, quick slot + cost/cooldown, trạng thái, dash cooldown, objective và pause. Enemy có HP ngắn, icon role/telegraph, target ring khi chọn. Không thêm stamina ở MVP.

Mobile: joystick trái; nút strike/dash và bốn cổ bên phải; pause luôn thấy. Lock-on/aim assist mặc định, không đòi vừa kéo joystick vừa chạm đúng enemy nhỏ. Thu nhỏ HUD khi landscape; arena letterbox giữ world coordinates nhất quán.

## 4. Thông số sandbox đầu tiên

Các giá trị này là điểm bắt đầu để playtest, chưa được cân bằng:

| Tham số | Khởi điểm |
|---|---|
| World arena | 1000×560 world units, hai vật cản đơn giản, biên đi lại rõ |
| Player movement | 160 units/s; footprint radius thử 16 units |
| Basic strike | Reach 64, góc 70°, startup 0,18 s, active 0,10 s, recovery 0,25 s |
| Dash | Quãng tối đa 90 units / 0,25 s; cooldown 2,5 s; collision sweep; không i-frame |
| Enemy bite/paw | Windup 0,9 s; đòn nguy hiểm 1,4 s trở lên; khóa hướng/vùng trước active |
| Boar charge | Telegraph 1,4 s, chạy theo hướng đã khóa, recovery 0,8 s nếu hụt |
| Projectile nguyệt nhận | Speed 440 units/s, range 260, radius 8; đạn riêng body |
| Nguyệt Quang sandbox | Cost 6 theo data hiện tại; windup/release/recovery theo binding clip, không spam khi giữ phím |
| Energy | Hồi thử 0,4 chân nguyên/s simulation, không vượt cap lúc vào; cooldown/cost skill riêng |
| Active pressure | Tối đa một melee enemy bắt đầu active trong bài đầu; tối đa hai ở bài sau |

Không lấy hệ số HP×2,2/ATK×1,8 RT cũ. Lượng damage, guard reduction và healing bắt đầu từ data/build hiện có qua combat adapter; nếu đổi công thức phải ghi rõ và test. Hồi 0,4/s cho cost 6 tương đương 15 giây hoàn vốn một đòn, cần đo thực tế tránh quá khan hoặc đứng chờ farm.

Hộ thể Ngọc Bì không yêu cầu giữ nút: clip defend diễn một lần, status/overlay tồn tại theo simulation. Trị Liệu cast một lần rồi heal theo rule; channel dài chỉ thêm khi skill yêu cầu. Cooldown/guard/DOT đang tính lượt phải có bảng chuyển sang giây ở E; khởi điểm quy đổi 1 lượt = 2,2 s chỉ để so sánh, từng skill phải cân và công bố lại. Không gọi cooldown lượt và cooldown giây cùng giảm.

Energy cap lấy lượng có lúc vào trận; hấp thu nguyên thạch mở cap theo luật được chốt. Không có hồi resource trong pause/tab hidden. Sandbox có config để thử cân, campaign không cấp miễn phí mana/full heal khi vào arena.

## 5. Ground plane, camera và collision

World lưu `(x,y)` mặt đất; renderer dùng ánh xạ cố định `screenX=x`, `screenY=k*y` cộng camera/viewport scale, với k thử 0,55. Depth sort theo ground y. Mọi vòng target, telegraph và bóng chân dùng cùng ánh xạ. Mouse picking dùng phép nghịch đảo; không hit theo alpha của tóc/áo.

Actor footprint circle hoặc capsule, vật cản AABB trước; solve sliding và soft separation để địch không dính thành một sprite. Spatial grid cho query khi mở bầy; MVP đơn giản nhưng API giữ được broadphase.

Projectile sweep đoạn từ vị trí cũ đến mới trên ground plane, chọn contact sớm nhất. Projectile không pierce trúng một target rồi despawn; có pierce chỉ hit mỗi target một lần theo hit registry. Melee kiểm tra khoảng cách/góc và hợp lệ tại active timestamp; lock-on không đảm bảo chắc trúng sau khi target né.

Fixed timestep 60 Hz; render độc lập. Khi tab hidden/menu pause, dừng tick và bỏ accumulator cũ; không dồn damage khi quay lại. Slow assist 0,75× chạy cùng tỷ lệ tất cả timer; không chỉ làm enemy chậm mà người vẫn full speed.

Camera MVP cố định toàn sân; chưa cần minimap. Actor facing trái/phải, W/S dùng locomotion và ground shadow; không xoay sprite 90°. Nếu depth movement nhìn trượt sau test, bổ sung strafe clips trước khi mở rộng arena.

## 6. Actor state và animation runtime

State tối thiểu: `idle → moving / casting / dashing / reacting → idle`, cộng `defeated` terminal. `paused` là cờ clock toàn battle, không ép body về idle.

Ưu tiên: defeated > hard-control > hit reaction đủ điều kiện > dash > skill > locomotion > idle. Không phải mọi tick DOT đều interrupt cast hoặc restart hit. Không buffer skill sau death hoặc khóa input; một command buffer dài tối đa một skill, hết hạn nhanh nếu target không hợp lệ.

`run` hiện tại loop=false: dùng one-shot để thử một nhịp đi ở PR sandbox; **không repeat F01→F08 khi giữ WASD**. Trước playable MVP dùng move_loop đã duyệt. Existing attack có thể làm body cast Nguyệt Quang khi QA khớp; phase marker đọc từ metadata và map với skill startup/active/recovery. Ví dụ manifest attack mẫu release F05 bắt đầu ở 340 ms; binding có thể retime clip theo skill nhưng phải giữ event release cùng pose. Callback render không gây damage.

Mirroring cả actor quanh pivot đồng thời biến đổi anchor bàn tay và facing FX. Nếu vũ khí/handedness không được mirror thì cần clip trái riêng hoặc xử lý rig; không chỉ flip projectile rồi để nó sinh ở tay sai.

## 7. Skill và damage contract

Mỗi skill E có `sourceGuId`, cost, cooldownSec, startupSec, recoverySec, targeting, range/shape, movementPolicy, interruptPolicy, damage/heal/status rule và presentation binding. GU gốc vẫn là nguồn danh tính/sở hữu; không nhét tọa độ world vào object GU dùng chung toàn game.

Chuỗi thực thi:

1. Validate sở hữu, resource, cooldown, control state và mục tiêu.
2. Commit cost và action ID lúc bắt đầu; refund nếu ngắt theo rule riêng.
3. Tới logical release/active, spawn projectile hoặc query melee.
4. Collision → resolver damage/guard/status đúng một lần → event kết quả.
5. Presentation phát body/FX/number/audio, không roll lại kết quả.
6. Recovery xong mới cho hành động khác; dash-cancel chỉ khi skill khai báo.

Event có battleId/actionId/hitId/targetId để chống hit callback lặp. Multi-hit/DOT có hit IDs riêng. Projectile của actor đã chết xử lý theo skill policy, không tự biến mất ngẫu nhiên vì renderer mất sprite.

## 8. AI bầy và encounter

Enemy state: approach → choose attack slot → windup → active → recover, cộng controlled/defeated. Attack slot giới hạn số unit gây áp lực ngay lúc đó; enemy khác flank/reposition, không đứng yên xếp hàng vô nghĩa. Slot có timeout và được release khi ngắt/chết.

Boar bám hướng lúc windup kết thúc rồi lao, không auto-track 180° mid-charge. Bear tiến tới reach rồi paw sweep, không biết vị trí người chơi tương lai. Ranged enemy thêm sau MVP: giữ khoảng cách, cast projectile, có vị trí an toàn giới hạn để không kite vô tận.

Từ `EN[k]` một foe hiện hữu, adapter tạo một primary enemy. Trận nhiều unit cần encounter extension có danh sách units/role/count rõ; không tự clone boss thành bầy rồi nhân loot. Reward pool và scene callback thuộc encounter, không tính riêng cho mỗi sprite chết.

Mục tiêu E: kill, survive, escape, protect, nodes. Primary enemy vừa chết nhưng objective chưa xong không gọi win cũ. Cầm chân/thoát không cấp kill loot nếu source scene không cho. Enemy vượt ngưỡng phase đổi pattern sau batch current hit; không xóa stun không báo trước.

## 9. Module/file và điểm nối

Các file mới đề xuất dưới `js/battle-e/`:

| File | Trách nhiệm |
|---|---|
| `assets.js` | Manifest normalize, alias/era/form, preload/cache/fallback |
| `world.js` | World state, actor/projectile/obstacle, fixed clock/pause |
| `input.js` | Keyboard/pointer/mobile, command buffer và picking |
| `collision.js` | Ground query, sweep, target filters, sliding/separation |
| `skills.js` | Mapping GU → E skill, cooldown và action phase |
| `ai.js` | Pattern, navigation và attack slot coordinator |
| `renderer.js` | Pixi layers, actor sheets, anchors/depth/FX/HUD events |
| `objectives.js` | Tiến độ và typed battle result |
| `campaign_adapter.js` | Snapshot S/EN/GU, save version, finalize đúng một lần |

`index.html` chỉ load bundle/module entry của E sau data cần thiết. `js/ui.js` dành một container arena/HUD ổn định, không destroy/recreate canvas mỗi update. `js/battle.js` tái sử dụng texture/particle/background qua API được tách, không cho hai ticker cùng điều khiển một battle.

`fight()` trong `js/engine.js` cần nhánh E trước khởi tạo RT/tactical; guard `playerAct` không tự gọi rtRun cho trận E. `win()` đang có delay 950 ms và kill loot: tách finalize result từ presentation, một token idempotent và callback đúng battleId. `fleeSuccess`, sceneWin/sceneFlee, AFTER, injury, reward và advance đi qua adapter rõ, không giả cầm chân thành kill.

`js/q2/core.js` và encounter Q2 đưa cùng adapter, không có engine E thứ hai riêng cho Q2. Không sửa/chuyển toàn bộ story content trong PR simulation.

## 10. PR cụ thể và điều kiện hoàn thành

| PR | Đầu ra | Kiểm tra phải qua |
|---|---|---|
| E-01 Asset importer + viewer | Nhập archive theo version, manifest alias, preview ba actor/sáu action, giữ bản cũ | Tám frame, alpha/canvas/pivot/timing, F01/F08 nếu one-shot, identity QA; chỉ import ZIP đã chọn |
| E-02 World + WASD | Sandbox riêng, PN đi trên sân, obstacle, depth sort, pause/mobile joystick | Diagonal bằng tốc độ thẳng, sliding không xuyên tường, resize/picking, no tab backlog |
| E-03 Combat playable | PN + boar, strike/moonblade/guard/heal/dash, HP/resource/cooldown | Damage mỗi hit một lần, projectile sweep, cast/release khớp animation, dash không i-frame |
| E-04 Hai địch + mục tiêu | Thêm bear, attack slots, telegraph, escape/protect thử | Không enemy chồng, không mọi địch active cùng lúc, outcome/reward đúng và không bị kẹt |
| E-05 Campaign adapter | Một battle Q1 opt-in từ map/scene thật, save/reload/feature flag | Sở hữu cổ đúng, scene/AFTER/advance một lần, old active battle dùng engine cũ |
| E-06 Q1 roster/encounter | Phủ các trận đã QA, lang triều waves và boss objectives | Không tăng loot theo số clone, tutorial/trợ giúp, pause và mob cap |
| E-07 Q2 systems | PN lực đạo/BNB đúng form, traps, allied skills và boss patterns | Canon/data đúng, đất bẫy hợp lệ, pet/summon ownership, phase/results |
| E-08 Release | Perf/mobile/accessibility, campaign regression, rollout | Preload theo encounter, texture cleanup, missing asset fallback, save migration/rollback |

PR mẫu đầu tiên chỉ E-01 + sandbox viewer và movement skeleton nếu sẵn; không push/merge chiến dịch trước khi prototype E-03/E-04 chơi được. Danh sách animation P0 có thể được sản xuất song song tiến độ lập trình, nhưng asset placeholder chỉ nằm ở sandbox.

## 11. Save, migration và kiểm chứng

Save E lưu engineVersion, encounterId/battleId, seed/RNG state, simulation time, actor transforms/HP/status/cooldown, resources/cap, action phases, active projectile hit registry và objective progress. Snapshot nguyên tử; không lưu texture/audio/timer handle. Resumed battle mở ở pause; các event đã commit không phát damage/reward lại. Terminal result lưu trước finalize để reload không thưởng hai lần.

Trận legacy đang chạy tiếp tục legacy đến hết; không đổi tọa độ/scale/HP mid-battle bằng boolean. Trận mới bật E qua feature flag; fallback engine cũ với encounter chưa mapping, không xóa code cũ ngay.

Test bắt buộc: FPS khác vẫn cùng quãng chạy/cooldown, sweep không tunnel, dash/obstacle, chi phí skill và ngắt, multi-hit/DOT, target chết, active action khi actor bị hạ, pause/tab hidden, save ở release/impact/terminal, reward idempotent, alias/variant Q1–Q2, mobile multitouch và cleanup khi rời arena.

Chốt playable MVP khi: chạy không giật về B, damage và projectile dễ đọc, người mới né được charge sau tutorial, pause không exploit resource, chơi được chuột/phím lẫn mobile. Mục tiêu perf thử 60 FPS desktop/30 FPS mobile với 6 enemy và 12 projectile ở sân nhỏ; đo trên thiết bị thật, không coi đây là bảo đảm hiện tại.
