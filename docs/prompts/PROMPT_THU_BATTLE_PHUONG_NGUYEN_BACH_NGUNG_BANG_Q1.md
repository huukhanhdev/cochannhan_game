# Prompt thử: Phương Nguyên vs Bạch Ngưng Băng Q1

> **Bộ đầy đủ mới:** [PROMPT_FULL_BATTLE_CLICKMOVE_PN_BNB_NAM.md](PROMPT_FULL_BATTLE_CLICKMOVE_PN_BNB_NAM.md) có 51 action cho PN/BNB nam, pose B và FX, theo click-to-move + phím mở/rebind. File này giữ hai chiêu thử đầu, không thay bộ locomotion/control/terminal đầy đủ.

Mục tiêu: hai animation chiêu riêng **đã gộp effect sát thân**, để review trước khi sản xuất hàng loạt. Chiêu 1: PN phóng Nguyệt Mang. Chiêu 2: BNB chém Băng Đao. Đây là mẫu asset/sandbox, không phải yêu cầu tạo một tranh hai người giao đấu hay xác lập kết quả truyện.

## Cách dùng

Copy **nguyên một khối tiếng Anh** bên dưới vào AI tạo ảnh. Mỗi khối tự đủ thông tin, không cần AI đọc project. Đính kèm ảnh B của đúng nhân vật; nên làm hai job/hội thoại riêng và gắn tên nhân vật vào ảnh reference để tránh AI trộn ngoại hình.

Cả hai dùng canonical facing RIGHT. Khi ghép trận, code mirror BNB sang LEFT. Nếu chỉ có BNB nữ Q2 thì phải có B nam Q1 được duyệt trước; không đổi giới tính giữa các frame. Không lấy một ảnh giao đấu hai người làm reference identity duy nhất.

AI có thể chỉ sinh ảnh mà không xuất file/GIF: khi đó nó phải nói rõ và làm từng frame theo yêu cầu, phần ghép do công cụ hậu kỳ thực hiện. Prompt không bảo đảm tự hết lỗi; duyệt B/F03/F05 rồi mới hoàn thiện cả clip.

## 1. PHƯƠNG NGUYÊN — NGUYỆT MANG, động tác và ánh sáng sát tay gộp chung

```text
PRODUCTION JOB: Create Fang Yuan's Q1 MOON RADIANCE (Nguyet Mang) signature skill animation. Draw the character's specific casting movement AND its attached wrist/hand light effects together in each actor frame. This is a skill-specific performance, not a generic punch with a color-swapped overlay. Produce a single-character actor asset, never a two-character battle painting or an AI-drawn multi-pose sheet.

IDENTITY AND ERA
Character: Co Nguyet Phuong Nguyen / Fang Yuan, Reverend Insanity, Q1 during the period around the Man Thach encounters, after acquiring Moon Radiance Gu and before the destruction of Qing Mao Mountain. Young male, black hair, cold restrained expression, economical body language. If no approved image exists, use long black hair and a simple dark traveling robe as an explicitly original visual interpretation. He is NOT in his Q2 strength-path build. No blood sword, giant muscles, wings or transformation. The Gu emits a concentrated blue-green moon crescent; it is not a hand-held moon sword.

REFERENCE AND IDENTITY LOCK
Use the matching image actually attached to this message or accessible in this conversation as the immutable neutral combat pose B. Inspect it. A filename or local path is not an image, and you have no access to my repository. Reuse the approved face, hair, clothing, proportions, palette, style, limb count and handedness without redesigning them. If no valid matching B exists, report the missing reference, search reliable online character references if browsing is available, or create an original B from this description if it is not. Cite consulted source-page URLs and label invented costume details. Show B for approval before animating a newly designed character. If the attached image has the wrong character or era, flag that instead of silently adapting it.

BASE AND CAMERA
One full-body character in exact right-facing orthographic side profile, camera and zoom locked. B is a balanced narrow stance, front casting hand relaxed near the waist, rear hand guarding the ribs. Preserve the attached approved stance if it differs slightly. No front-view or three-quarter turning at the action peak. Use the approved art style; if there is no image, default to readable chibi pixel art with approximately 2.5-head proportions. No text, background scene, fake checkerboard or white matte.

FRAME WORKFLOW
Use image editing or reference-preserving redraw from the SAME B for every frame. Generate ONE pose in ONE image per call. Never generate the eight-pose sheet directly. First show B and key poses F03/F05; proceed after their identity and choreography are approved. Finish six intermediate frames F02-F07 separately. F01 and F08 are exact RGBA copies of B made by postproduction, with no attached light effects. No repeated or extra head, face, torso, limb, onion skin or ghost pose. Hair and cloth lag the body motion but do not change design. Do not simulate action by translating, rotating or scaling one unchanged sprite.

EIGHT-FRAME STORYBOARD — LOCAL LIGHT IS BAKED INTO THESE FRAMES
F01: Exact B, relaxed casting hand, no skill light.
F02: Lower the center of gravity slightly, fold the casting elbow toward the ribs and turn the wrist inward. A small blue-green light begins inside the palm; no detached crescent.
F03: Complete the controlled preparation: hand at the lower ribs, fingers gathered, shoulder only slightly rotated. The palm glow has condensed into a narrow bright rim attached to the hand. The hand and elbow remain readable.
F04: Extend the forearm halfway toward screen-right, leading with the wrist. A short attached light stroke follows the wrist rotation; do not emit the traveling projectile yet.
F05: Snap the wrist and extend the forearm in a short precise release. Bake a compact palm flash and a short attached blue-green wrist trail into this frame. Keep a single anatomical hand. This is the release marker; the detached moon crescent is a separate asset and must NOT be painted traveling through this actor frame.
F06: Retract fingers and elbow with deliberate restraint. The attached light fades near the hand, and the robe catches up with the body. No additional cast or second projectile.
F07: Return almost to B, with the wrist lowered and the last tiny local glow gone. Hair and robe settle; do not switch to another standing pose.
F08: Exact B copied in postproduction, including alpha. No remaining local light or detached projectile.

ACTOR OUTPUT AND REGISTRATION
Eight independent 256x256 RGBA PNGs named pn_q1_nguyetmang_01.png through pn_q1_nguyetmang_08.png. Fixed local pivot (128,224), ground line y=224, identical camera/scale and at least 12 px transparent padding around the complete BODY PLUS LOCAL EFFECT in every frame. Do not trim, auto-center or scale frames independently. If the approved art cannot fit, report it and choose one common rescale/registration for B and all frames before animation. Preserve bone lengths and character pixel density.
Assemble exactly one 2048x256 horizontal actor sheet from those same eight PNGs using a compositor, placing full frames unchanged at x=(i-1)*256, y=0. The sheet must reproduce RGBA pixels exactly: do not apply the alpha mask a second time while pasting. The artist must not draw a new composite illustration.
Frame durations in milliseconds: [70,110,100,60,90,80,100,110]. Play once, return to idle. Canonical facing is right. Record the actual casting-hand center (x,y) at F05 by inspecting the accepted image, not by guessing coordinates. Provide pivot, facing, durations, release_frame=5, hand_anchor_F05_px and local_fx_baked=true as metadata.

DETACHED PROJECTILE — A SEPARATE GAME ASSET
Provide one clean original blue-green crescent projectile texture, 128x128 RGBA with generous transparent margin, consistent with the actor's palm light. Its forward travel direction is screen-right; no actor, hand, enemy, path across the arena or damage number is inside this texture. A fixed crescent texture is sufficient for the first test; do not invent another eight-frame job unless needed. Give its local center pivot. In a composite preview only, spawn it at the accepted F05 hand anchor and move it to the right outside the actor canvas on a larger scene canvas. Never wrap it from the right edge to the left or place it behind the caster. Actor PNGs and sheet remain projectile-free.

QA AND DELIVERY
Show the eight-frame contact sheet for inspection, source PNGs, mechanically assembled actor sheet, metadata and actual playback preview if supported. Compare B/F03/F05 for identity; inspect correct joints, no clipping, no duplicate limbs and visible casting despite baked light. Decode/crop the sheet and verify each cell matches its source PNG. For GIF preview, use one transparency index, full-frame clearing/disposal=2, disable unsafe delta-frame optimization, and verify decoded frames and timing; keep PNG/sheet authoritative. If export tools cannot perform these steps, report exactly which files/steps are missing and never fabricate downloads. Do not assign damage, health gain or game skill ownership through image generation.
```

## 2. BẠCH NGƯNG BĂNG — BĂNG ĐAO, đao băng và vệt chém gộp chung

```text
PRODUCTION JOB: Create Bai Ning Bing's Q1 ICE BLADE (Bang Dao) signature melee animation. The character movement, temporary ice blade, frost around the casting arm and local slash trail are drawn TOGETHER in each actor frame. Do not substitute a generic unarmed attack plus detached decorative ice. This job creates one character's skill asset, not a two-character duel painting or an AI-generated multi-pose sheet.

IDENTITY AND ERA
Character: Bach Ngung Bang / Bai Ning Bing, Reverend Insanity, Q1 male human variant around the Man Thach period, BEFORE the loss of the right arm and BEFORE the Q2 female transformation. Two anatomical arms throughout. Young male, silver-white hair, cold blue eyes, proud fearless expression. If no approved image exists, use pale robes and flowing white hair as an original visual interpretation. He is not Fang Yuan and must not inherit Fang Yuan's black hair or black costume. No crystal-body transformation, self-destruction, permanent wings or spontaneous gender change.
The game skill is Ice Blade, a close-range ice attack. The exact eight poses and temporary blade forming/dissolving below are visual adaptation, not a claim that the novel describes this exact motion. No detached crescent projectile is part of this melee test.

REFERENCE AND BASE LOCK
Use only the matching male-Q1 image actually attached or accessible in this conversation. The downloaded Bai Ning Bing asset might depict the Q2 female version: inspect it and reject it for this test if it is the wrong era/gender. Never silently change identity between frames. If no valid male-Q1 B exists, report it, consult reliable online character references if browsing is available, otherwise make an original B from this description, label artistic choices, and show B for approval first. Do not assume access to local folders or my project. Keep face, hairstyle, clothing panels, proportions, color palette, art style, limb count and handedness fixed.

BASE AND CAMERA
One full-body male human, exact right-facing orthographic side profile. B is a compact upright resting-ready stance, feet approximately hip-width apart with only a small front-to-back offset, knees nearly straight but unlocked, shoulders relaxed, both elbows close to the torso, hands resting below the lower chest near the waist, chin level; no raised blocking palm, deep crouch, wide lunge or attack gesture. A crouched reference with a raised palm is an identity/costume reference only; approve a corrected compact B before generating frames. Camera/zoom fixed; never turn into front view at the slash peak. Match the approved image style; without one, use readable original chibi pixel art of about 2.5-head proportions.
If approved B is empty-handed, the skill temporarily creates a SINGLE ice blade in the casting hand and dissolves it before F08. If approved B already carries an appropriate blade, retain that exact blade shape and grip throughout and use frost intensification instead of creating a second weapon. Do not add an unrelated metal sword or swap the casting hand halfway through. Clearly record which of these two cases applies.

FRAME PRODUCTION
Generate ONE pose per independent image using reference-preserving editing/redraw from the SAME approved B. Never ask the image generator to draw the whole eight-cell sheet. Show B and key poses F03/F05 first for approval. Create F02-F07 separately; copy B exactly for F01/F08 in postproduction. No ghost silhouettes, repeated head, extra hand, duplicate blade or overlapping alternate poses. Main joints lead; white hair and sleeves follow with a short lag. Local frost/slash effects cannot hide the face, casting hand or elbow.

EIGHT-FRAME STORYBOARD — ICE AND SLASH TRAIL ARE BAKED IN
F01: Exact B, no temporary skill effect. Preserve an existing approved weapon if B has one.
F02: Bend the lead knee, coil the pelvis and draw the casting hand toward the opposite upper torso. A thin frost rim forms around the actual hand/forearm or existing blade, leaving anatomy visible.
F03: Raise the elbow and prepare a diagonal cut, keeping the head in side profile. A single short ice blade is fully formed in the empty casting hand, or the approved existing blade is frosted. The rear hand stays separate and guards the ribs. Make the weapon attachment and grip unmistakable.
F04: Drive the diagonal cut through shoulder, elbow and wrist rotation. A short pale-blue slash ribbon follows BEHIND the blade's current sweep, attached visually to its trajectory. Do not draw multiple arms or blades to simulate motion.
F05: Peak cutting pose directed toward screen-right: lead knee accepts weight, cutting elbow extended but not locked, rear hand balances. Bake the ice blade, a readable compact diagonal slash arc and a few near-blade frost fragments into the same image. Keep all of them inside this frame's safety margins. This is the melee contact marker; no enemy body, impact splash or damage number is baked into the actor asset.
F06: Follow through below chest height, then bend the elbow to retrieve the blade. The slash ribbon fades and frost fragments dissolve locally; they do not become long-range projectiles.
F07: Return close to B. A temporary blade dissolves fully, or the existing approved blade returns to its original appearance. Hair and sleeves settle. No whole-body snow aura persists.
F08: Exact approved B copied in postproduction. No temporary frost, slash ribbon or new prop; retain only what already existed in B.

OUTPUT CONTRACT
Exactly eight independent 256x256 RGBA PNGs named bnb_q1_male_bangdao_01.png through bnb_q1_male_bangdao_08.png; fixed pivot (128,224), ground line y=224, locked scale/camera, at least 12 px padding for the BODY PLUS BLADE AND LOCAL SLASH EFFECT in every frame. Do not crop, trim, auto-center or shrink only F05. If the largest pose cannot fit, reduce the entire B/clip with one agreed registration before production; never crop the blade tip to satisfy the dimensions.
Assemble one 2048x256 horizontal sheet mechanically from those eight approved PNGs without redraw, per-cell rescaling or double application of alpha. Frames are ordered F01-F08, full-canvas copies at x=(i-1)*256, y=0. Frame durations in milliseconds: [80,100,100,60,90,90,100,100]. Runtime loop=false; return to idle from B.
Record frame size, pivot, facing=right, durations, contact_frame=5, actual casting-hand and blade-tip pixel anchors at F05, local_fx_baked=true and temporary_blade=true/false. Measure these anchors from the accepted frames. Blade-tip and hand anchors are for alignment/preview; they do not automatically define gameplay reach or damage.

FACING AND COLLISION PREVIEW
Keep the delivered actor asset facing RIGHT. A battle viewer places Bai Ning Bing on the right side and mirrors the WHOLE actor, including its baked frost and trail, to face LEFT. Mirror the measured anchors with the same actor transform; do not ask the generator to create unrelated left-facing copies. A melee hit only occurs when simulation says a target is within the active shape. Contact sparks and target reactions are separate hit effects, spawned at actual collision. A missed slash must remain a missed slash even though the local ice trail is beautiful.

QA AND DELIVERY
Show B/F03/F05 for identity and pose approval; inspect every frame for the correct male-Q1 face/hair/costume, two arms, one blade, continuous grip, clean alpha, no clipping and no camera turn. Show source PNGs, assembled sheet, metadata, contact sheet and real playback if tools permit. Cropped sheet cells must reproduce the source RGBA pixels. For GIF preview use proper full-frame clearing, disposal=2 and stable transparency; verify decoded frames/timing and no retained previous pose. A preview contact sheet is not an animation. Report missing generation/assembly/export capabilities honestly; do not invent files, links, damage values or unsupported canon powers.
```

## Sau khi nhận hai bộ thử

Kiểm tra B/F03/F05 trước, rồi playback từng nhân vật, cuối cùng ghép trên sân: PN trái → bắn phải; BNB phải → chém trái. Tách asset thành hai actor; không cắt chúng từ một ảnh battle tổng. Bản preview tổng có thể có hai người và projectile/impact, nhưng không dùng làm nguồn runtime.

Mẫu hai clip này kiểm tra art và khả năng gộp local FX. Để điều khiển E thật còn cần move_loop/dash/terminal đã nêu trong plan. Chưa sinh ra bộ asset mới ở tài liệu này.
