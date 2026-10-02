# Plan và prompt V2 — Animation bằng frame cho Phương Nguyên

## Bài thử hiện tại — PN theo motion reference run_sample

Đã tìm thấy tám PNG RGBA 88×88 trong bộ `run_sample` người dùng tải. Đã ghép nguyên frame theo thứ tự 01→08, không sửa pose, tại [sheet mẫu](../../previews/pn-run-motion-reference/run_sample_sheet.png) và [contact sheet 4×2](../../previews/pn-run-motion-reference/run_sample_contact.png). Đây là reference chuyển động, không phải animation PN mới. Chưa generate hoặc duyệt kết quả chuyển tạo hình.

Đính kèm **hai ảnh** khi gửi AI khác: (1) PNG PN gốc đã duyệt, (2) contact sheet run_sample 4×2. Không chỉ copy đường dẫn: AI bên ngoài cần ảnh được upload thật. Prompt dưới đây không yêu cầu truy cập project.

```text
Create ONE 4-column by 2-row animation contact sheet containing exactly EIGHT frames of the character in attachment 1 running in place toward the right.

ATTACHMENT 1 is the authoritative character design: Fang Yuan, a young male with long black hair, a calm cold expression, a black robe and black boots. Preserve the actual attached face, proportions, costume, colors and pixel style. Do not redesign him.

ATTACHMENT 2 is the authoritative RUN MOTION reference, read left to right across the top row, then left to right across the bottom row. Match each output cell to the corresponding reference frame's gait phase: torso lean, arm swing, elbow bend, knee bend, foot placement relative to the hips and support/airborne phase. Transfer motion only. Do not copy the sample's ninja identity, red clothing, headwear or short hairstyle. Adapt the gait to Fang Yuan's proportions instead of stretching him to match the sample.

Draw all eight poses as ONE coherent repeating run cycle. Preserve anatomical near/far limb identities throughout. Include bent-leg recovery and passing poses; feet must travel through intermediate positions instead of jumping from forward to backward. Keep Fang Yuan's long hair and robe trailing softly without hiding the legs. No idle or stop pose anywhere in the cycle. The eighth phase continues naturally into the first, without duplicating frame 1.

OUTPUT LAYOUT: 1024x512 PNG, eight equal 256x256 cells, no gaps, labels or visible grid lines. One full character entirely contained in each cell, with consistent scale, camera, pelvis registration and virtual floor. Use transparency if supported; otherwise use the same flat light-gray background in every cell. Leave margins for the widest stride and trailing hair. No independent recentering, cropping or rescaling of poses. No motion blur, ghost silhouettes, extra limbs or whole-character mirroring.

Prioritize faithful movement phases and consistent character identity over decorative detail. Return the actual sheet image, not a written claim that you exported PNG frames or tested a GIF. If the tool cannot produce the exact pixel dimensions, state the actual dimensions; do not claim that the grid or loop is verified without checking it.
```

Khác với việc thêm negative prompt: bài thử này cung cấp trực tiếp tám pha chuyển động bằng ảnh. Vẫn cần cắt thử, kiểm tra grid và phát loop; không coi kết quả AI là đạt tự động. Sheet 4×2 dùng để generate/duyệt, sheet runtime 8×1 chỉ ghép sau khi frame đã được kiểm tra.

02/10/2026. **Hướng hiện hành theo yêu cầu người dùng: chỉ dùng animation frame.** Puppet/cutout đã bị loại; hai preview run imagegen và puppet chưa đạt. Tài liệu này thay hướng sản xuất idle/run trong các prompt cũ. Chưa tạo batch mới, chưa tích hợp battle.

## 1. Đầu ra và giới hạn

Nếu thử Draw Things local, xem [hướng dẫn từ cài app đến xuất frame](../reference/HUONG_DAN_DRAW_THINGS_ANIMATION.md). Các prompt bên dưới dành cho trợ lý tạo/sửa frame; không dán nguyên khối vào model video. Quy trình Draw Things có prompt mô tả chuyển động riêng và vẫn cần duyệt từng frame.

- AI tạo chuyển động thành PNG frame có pose liên tục. Runtime chỉ phát các frame đã duyệt; không xoay lớp tay/chân hoặc kéo giãn sprite để thay animation.
- Không phụ thuộc PixelLab/API trả phí. Dùng AI người dùng đang có cùng ảnh tham khảo đính kèm; nếu công cụ chỉ tạo ảnh tĩnh thì cần workflow key pose và in-between, có thể phải sửa lại nhiều lần. Prompt không bảo đảm model giữ được identity/chuyển động.
- Mặc định tám frame cho mỗi chu kỳ; chất lượng chuyển động quyết định nghiệm thu. Không tăng frame bằng cách chép ảnh hoặc blend mờ. Nếu tám frame thực sự thiếu cho biên độ mong muốn, đề xuất 12/16 frame để người dùng chọn, không tự đổi spec.
- Pose B là tư thế nghỉ. Run loop dùng pose M đang chạy ở đầu chu kỳ, không chèn B vào vòng chạy. Idle thở nhẹ, tóc lay; không đổi thế thủ hoặc nét mặt.
- Source là PNG RGBA riêng. Sheet là cách đóng gói, GIF là preview. Có thể generate contact sheet để duyệt toàn bộ chuyển động, nhưng sheet do AI vẽ chưa được coi là đúng grid/đạt chuẩn cho đến khi cắt thử.

## 2. Triển khai theo cổng duyệt

| Bước | Bàn giao | Chỉ đi tiếp khi |
|---|---|---|
| F-01 | Chọn B từ asset đã duyệt; kiểm tra canvas, chân, diện mạo | Có ảnh PNG thật được đính kèm; không lấy screenshot/GIF làm B nếu có source |
| F-02 | Idle: resting pose + breathing peak; run: contact phải/trái + passing phải/trái, định thứ tự/nhịp | Nhìn ra chuyển động mong muốn mà mặt, chiều dài chi và trang phục không đổi |
| F-03 | Hoàn thiện đúng tám frame bằng in-between/redraw có cả frame trước và sau làm reference | Tay/chân đi qua các vị trí trung gian, không tự tạo một pose khác không liên quan |
| F-04 | PNG/sheet/GIF + contact sheet và metadata | Vòng cuối→đầu được kiểm tra; xem chậm và ở kích thước battle; người dùng duyệt |
| F-05 | Viewer/game sandbox phát frame, nối start/loop/stop | Không đưa clip chưa duyệt vào campaign; hit/release do engine, không GIF callback |

Làm idle PN trước, run PN sau. Chỉ nhân bản BNB/roster khi mẫu PN đạt. Không làm 51 clip cùng lúc.

## 3. Cách sửa lỗi mà không làm trôi toàn bộ batch

1. Nếu một đoạn giật, đưa **hai frame kề đoạn lỗi** cho AI và chỉ sửa/tạo frame giữa. Khóa lại các frame đã duyệt.
2. Xem ảnh chồng/đánh dấu vai, khuỷu, cổ tay, hông, gối, cổ chân để phát hiện quỹ đạo nhảy. Đường nét mặt và tỷ lệ cơ thể phải ổn định; diff pixel chỉ là gợi ý, không tự chấm animation tốt/xấu.
3. Kiểm tra run pha tiếp đất: bàn chân đang đỡ người không xuyên sàn; chân kia đi qua hông/co gối, không teleport từ trước ra sau. Không khóa hai bàn chân như idle; không center theo bounding box từng frame.
4. Kiểm tra seam bằng đoạn F07→F08→F01→F02, có cả vòng tốc độ chậm. Không reset cuối clip về pose B hoặc duplicate endpoint để che seam.
5. Nếu cả batch đổi mặt/tỷ lệ, quay lại key pose hoặc sửa batch; đổi ms không cứu được geometry. Nếu model không giữ được chuỗi coherent, báo không đạt, không gắn nhãn animation hoàn tất.

## 4. Đóng gói và runtime dự kiến

Source 256×256 hoặc kích thước đã duyệt thống nhất cho actor, không resize/crop riêng từng pose. Đủ margin ở frame biên độ lớn nhất. Định registration theo pelvis/virtual floor, không theo tâm alpha bbox. Sheet tám ô 256×256 là 2048×256, ghép từ source; cắt sheet phải khớp source.

Idle thử chu kỳ 2.4–2.8s. Run thử 0.8–1.1s tùy bước, không coi timing là thuốc chữa pose. Metadata ghi frame rect, duration, loop, entry/end state; clip action cần release/contact marker. Animator phát PNG bằng simulation clock, hỗ trợ pause, mirror cả actor và anchor, chuyển state; không tween lớp thân hoặc crossfade toàn sprite để giấu frame sai.

Run start/stop sản xuất sau khi loop đạt: B→M và một pha run entry đã định→B. Nếu runtime có thể dừng ở nhiều pha, phải có chiến lược stop theo pha hoặc các stop clip tương ứng; không giả định bất kỳ frame chạy nào cũng nối thẳng vào một stop duy nhất mà không giật.

## 5. Prompt idle độc lập — copy cả khối cùng ảnh B

```text
Create a frame-by-frame idle animation of Fang Yuan from the attached approved base sprite. Deliver actual animation frames, not a puppet, a rig demonstration or a whole-image bounce.

REFERENCE: The attachment is the authoritative identity and resting pose. Fang Yuan is a young male with long black hair, a cold calm expression, a charcoal-black robe and black boots. Keep his exact face, head angle, proportions, costume panels, palette and pixel-art style. Keep a right-facing side view. If the required reference is missing, ask for it before generating. Do not redesign him.

GOAL: He stands still but feels alive. Only gentle breathing and a small delayed sway of the hair tips. No attack, guard switching, hand opening, bowing, strong wind or flaring robe.

WORKFLOW: First show the resting pose and a subtle inhalation peak together for approval. Then produce EIGHT time samples of one coherent breathing cycle. Do not generate eight unrelated images from the text alone. Use the approved character and adjacent accepted poses as references when drawing the in-betweens. Keep approved frames unchanged when repairing another frame. If your tool can generate a coherent animation sequence, use that capability; otherwise use reference-preserving frame edits/redraws and report the limitation honestly.

REGISTRATION: All PNG frames use the same 256x256 transparent canvas, fixed camera and scale. Preserve the attached sprite's approved placement, with both feet at identical coordinates throughout. No independent trimming, recentering or scaling. Keep body and hair entirely inside the canvas.

BREATHING: At this source resolution, aim for roughly 1-2 pixels of chest/shoulder movement, with a smaller natural head/hand follow. The feet and pelvis stay planted. Do not scale or translate the whole character. Hair tips sway about 1-2 pixels with a slight delay; the main hair mass keeps its silhouette and stays behind him. Keep fingers, face and eyes consistent; no compulsory blink in every loop. These amplitudes are guides, not permission to deform anatomy.

CYCLIC PHASES: F01 resting mid-breath; F02 gently rising; F03 inhalation peak; F04 gently falling; F05 passes through the same resting level while continuing to exhale; F06 gently lowering; F07 exhalation low point; F08 begins returning upward toward F01. The motion through F08 -> F01 -> F02 must continue smoothly. Do not force F08 to duplicate F01. Do not make the two breath extremes exaggerated body poses.

CHECK: Review the sequence slowly and at normal battle size. Reject changed face angles, wobbling costume contours, white fringes, moving feet, switching hand poses, ghost silhouettes or sudden hair changes. Reject a loop that looks completely frozen, but increase only breathing or hair motion gently rather than adding unrelated gestures.

DELIVERY: Eight independent RGBA PNG frames named pn_idle_01.png through pn_idle_08.png, a contact sheet, a spritesheet mechanically assembled from the accepted source frames, and an optional GIF preview. Start with a 2.4-2.8 second cycle; adjust timing after the drawings are coherent. Clear the full canvas between GIF frames. PNGs are the source of truth. If you cannot export PNGs, build a sheet or preview animation, say exactly which output is missing. Never invent file links or claim the result passes checks you did not perform.
```

## 6. Prompt run độc lập — copy cả khối cùng ảnh B và mẫu run

Đính kèm B của PN làm identity và mẫu run người dùng đã chọn làm **motion reference**. Prompt chỉ chuyển nhịp/body mechanics, không sao chép tạo hình ninja, màu đỏ hoặc trang phục của mẫu. Nếu mẫu có hơn tám frame, chọn tám pha phù hợp chứ không bỏ frame ngẫu nhiên.

```text
Create a genuine eight-frame continuous in-place run cycle for Fang Yuan. Deliver frame-by-frame sprite animation, not independently illustrated poses, a cutout puppet or rigid limb rotations.

INPUT ROLES: The attached Fang Yuan base sprite defines character identity, costume, proportions and pixel style. Any separately attached running sample defines ONLY the gait and motion rhythm. Never transfer that sample's face, hairstyle, red clothing, weapons or accessories. If no running sample is attached, use the gait phases below. If the Fang Yuan identity image is missing, ask for it before generating.

IDENTITY: Young male Fang Yuan, long black hair, cold calculating face, charcoal-black belted robe and black boots. Preserve the approved design exactly. Right-facing side profile, fixed camera, scale, palette and body lengths. The face should remain nearly identical while the body runs.

CRITICAL DISTINCTION: This is RUN LOOP, not standing -> run -> standing. The base standing image is an identity reference, not the required first/last pose. Every frame must be a running phase. Frame 8 continues into frame 1 without returning to idle.

FIRST APPROVAL: Show four running key poses: right-foot forward contact, left-leg forward passing, left-foot forward contact, and right-leg forward passing. Preserve which anatomical limb is which; do not mirror the entire sprite to exchange legs. Show them in motion order with consistent head size and limb lengths. Wait for approval before completing the in-betweens.

ANIMATION WORKFLOW: Build the whole cyclic movement first. If your tool supports animation generation from a reference and motion guidance, use that. If it only creates still images, draw/edit coherent key poses and in-betweens using both neighboring accepted poses as visual references. Never treat each frame as a fresh text-to-image character design. A directly generated contact sheet may be used for pose review, but must be sliced and loop-tested before being called a finished spritesheet.

EIGHT PHASES:
F01: Right foot contacts the virtual floor ahead of the pelvis; left leg trails behind. Torso leans forward consistently. Left arm is forward, right arm back.
F02: Right support knee compresses slightly. Left foot lifts from behind and folds toward recovery. Arms progress toward their middle swing.
F03: Left knee passes forward near the pelvis with its foot tucked below; right leg extends backward toward toe-off. Do not teleport the left foot directly to forward contact.
F04: Short flight/exchange. Left lower leg extends toward its next landing while right knee folds behind. Arms approach their opposite extremes.
F05: Left foot contacts ahead; right leg trails. This is the opposite-leg contact phase, not a mirrored whole-character image.
F06: Left support knee compresses; right foot folds forward from behind. Arms continue smoothly.
F07: Right knee passes forward near the pelvis, foot tucked underneath; left leg extends back toward toe-off.
F08: Short flight/exchange toward right-foot contact. Right lower leg is approaching its F01 position; left knee folds behind. Continue naturally into F01.

MOTION QUALITY: Knees and elbows genuinely bend. Shoulder -> elbow -> wrist and hip -> knee -> ankle must follow continuous, anatomically plausible paths. Keep joint lengths stable. Preserve the near/far limb identities and their overlap order. Use a modest forward torso lean and small gait-related vertical rise/fall. Hair and robe trail behind with restrained lag; they must not hide the stepping legs or cover the face. Do not add a standing pose at the seam.

REGISTRATION: Eight same-size 256x256 RGBA canvases, one complete sprite per frame. Fixed virtual floor and common pelvis registration; no independent bbox centering or resizing. Feet are allowed to lift during running. Supporting feet must not penetrate the floor. Leave sufficient margins for the longest stride and trailing hair. Run is animated in place; game code handles world travel separately.

REPAIR AND QA: Inspect F07 -> F08 -> F01 -> F02 as carefully as the middle frames. Reject limb teleportation, missing passing poses, face changes, varying proportions, duplicated limbs, motion blur, ghosting or clipped feet. If a transition jumps, repair the bad frame using its two neighbors; do not hide it by increasing playback speed, adding a crossfade, or copying frames. If eight frames cannot represent the chosen stride well enough, report that and propose a smaller stride or a 12/16-frame version. Do not silently change the requested count.

OUTPUT: Eight separate PNGs named pn_run_01.png through pn_run_08.png, a review contact sheet, one 2048x256 spritesheet assembled from accepted frames, timing metadata and an optional GIF. Begin preview timing around a 0.8-1.1 second cycle, then tune after the geometry is correct. Do not promise seamlessness without playing the actual loop. Clear the canvas between GIF frames. State missing tools/export capabilities honestly; do not invent finished assets or download links.
```

## 7. Đoạn prompt sửa một frame giật

```text
Repair ONE animation frame using the attached previous frame, faulty middle frame, next frame and approved identity reference. The attachment roles are specified in that order.

Change only the faulty middle frame. Preserve the accepted neighbors and the character's face, proportions, palette, canvas and registration. Draw the missing intermediate joint positions between the previous and next poses. Preserve limb identities and foot-contact logic. Do not average/blend the two images, create translucent ghosts, rotate rigid cutout limbs or redesign the character.

Return one clean transparent PNG at the same resolution. Explain which joint trajectory you corrected. If the two neighbors are incompatible in anatomy or identity, report the conflict rather than claiming that one in-between can solve it.
```
