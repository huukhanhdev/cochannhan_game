# Hiện trạng đưa pixel animation vào battle

Ngày 02/10/2026. Báo cáo dựa trên code, manifest, file asset và các preview đã thử trong phiên làm việc. **Chưa triển khai renderer frame trong battle, chưa có run PN mới được người dùng duyệt.** Đây không phải báo cáo mọi animation đã đạt chất lượng.

## 1. Kết luận hiện tại

Project đã có kho frame, thông tin timing và viewer để phát animation. Phần đóng gói PNG → sheet/GIF làm được. Hai việc chưa giải quyết là **chất lượng chuyển động của asset** và **kết nối frame animator với battle/gameplay**.

Không phải thiếu khả năng import GIF. Game có thể dùng PNG/frame hoặc sheet; GIF chỉ để preview. Ghép file đúng không đồng nghĩa nhân vật chạy đúng, nối loop tốt hoặc sát thương khớp animation.

Yêu cầu giữ nguyên: frame animation, không puppet/cutout để thay chuyển động; giữ tạo hình/cốt truyện Q1–Q2; BNB Q1 là nam. Người dùng muốn tự động, miễn phí, chuyển động liên tục và không render nặng trên Mac M4/16 GB. Hiện chưa xác minh được một giải pháp đáp ứng đồng thời toàn bộ yêu cầu này ở chất lượng mong muốn.

## 2. Đã giải quyết được gì

| Phần | Bằng chứng trong project | Giới hạn |
|---|---|---|
| Lưu asset theo nhân vật/action | `assets/chibi_anim/` và `characters_index.json` | Có file không đồng nghĩa đã duyệt visual |
| PNG riêng, sheet, GIF và thời lượng frame | Manifest và action index | Thiếu metadata gameplay/điểm phát chiêu |
| Viewer kiểm tra từng frame | [sprite_demo.html](../../sprite_demo.html) | Viewer độc lập, chưa phải animator battle |
| Chỉnh tốc độ, pause/step, mirror, xem filmstrip | Logic inline trong sprite demo | Dùng timer và cố định tám frame; chưa có simulation clock |
| Đóng gói preview thử mới | Các thư mục `previews/pn-run-*` | Pose lỗi vẫn lỗi sau khi ghép |
| Có motion reference người dùng chọn | [run_sample contact](../../previews/pn-run-motion-reference/run_sample_contact.png) | Chỉ chuyển động mẫu, không phải tạo hình PN |
| Có arena và VFX battle | [js/battle.js](../../js/battle.js) | Actor hiện tại chưa phát thư viện pixel frame |
| Có sandbox battle theo lượt | [tactical_battle_test.html](../../tactical_battle_test.html) | Dùng renderer battle cũ, không phải chứng minh pixel đã tích hợp |

### Kiểm tra cấu trúc thư viện đã thực hiện

- Index có **38 nhân vật × 6 action = 228 clip**, tổng **1.824 frame**.
- Sáu action: `idle`, `run`, `attack`, `defend`, `heal`, `hit`.
- Kiểm tra các đường dẫn frame/sheet/GIF trong index: **không thiếu file** ở thời điểm báo cáo.
- **1.728 frame RGBA 256×256**; **96 frame RGBA 384×256** thuộc `dian_lang_boss` và `phi_tuong`. Manifest khai báo đúng kích thước riêng; đây không phải lỗi bắt buộc resize về 256.
- Manifest PN có pivot `[128,224]`; Điện Lang `[192,224]`; Phi Tượng `[192,160]`. Renderer phải đọc pivot của actor, không áp một chân sàn chung cho mọi loài.
- `idle` của cả 38 actor khai báo `loop: true`; các action khác, gồm **run**, khai báo `loop: false`.
- Chưa xem/duyệt visual cả 228 clip; chưa chứng minh mọi sheet ghép đúng source hoặc mọi GIF đúng timing.

## 3. Những hướng đã thử và kết quả

| Thử nghiệm | Kết quả hiện tại | Điều đã học |
|---|---|---|
| PN run imagegen V01, tám pose | Người dùng từ chối | Tay/chân nhảy pose; đổi 90→120/140ms không cứu hình học |
| Puppet V01 từ layer có sẵn | Người dùng từ chối; hướng đã loại | Cử động layer không đáp ứng yêu cầu frame animation |
| ZIP idle/run V2 do AI ngoài tạo | Review trước đó không đạt visual | Packaging tốt nhưng identity/pose trôi; idle đổi chiều cao mạnh, run thiếu pha rõ |
| Wan 2.2 TI2V 5B 8-bit trong Draw Things | Người dùng báo render khoảng 10 phút, nóng máy, không có chuyển động mong muốn | Không tiếp tục workflow này; đã xóa model và encoder/VAE ~13,68 GB |
| Imagegen V02 theo tám frame run_sample | Người dùng xác nhận chưa đạt | Reference chưa đủ giúp model giữ quỹ đạo và registration |
| Imagegen V03 chỉ hai frame liên tiếp | Review không đạt; không làm tiếp sáu frame | Tay đổi pose quá mạnh dù đã yêu cầu tiến một bước nhỏ |

Preview tham chiếu: [V01 metadata](../../previews/pn-run-imagegen-v01/preview_metadata.json), [V02 so sánh](../../previews/pn-run-motion-v02/index.html), [V03 cặp ảnh](../../previews/pn-run-pair-v03/generated_pair.png).

V02 sheet gốc là **1774×887**, cắt đều thành canvas 444×444, không đúng spec đích. Phần alpha rõ của frame 1–4 có đỉnh đầu quanh y=68; frame 5–8 quanh y=48–49 trong ô tương ứng. Lệch bố cục khoảng 19–20px là một nguồn gây giật. Đây là số đo ảnh, không phải kết luận tự động về toàn bộ gait. Căn lại bố cục có thể sửa phần registration, **không sửa được arm/leg pose hoặc identity sai**.

GIF V03 chuyển qua lại A/B là công cụ kiểm tra hai ảnh, không phải một run loop hoàn chỉnh. Không dùng nó làm minh chứng animation chạy đã đạt.

## 4. Vướng mắc chất lượng asset

### 4.1. Chuyển động và identity

AI đang vẽ các pose chưa đủ liên hệ: tay đổi bên/đổi cực quá mạnh; chân thiếu hoặc không thể hiện rõ pha co gối đi qua hông; chiều dài/tỷ lệ, mặt và tóc thay đổi. Tám frame đủ cho nhiều chu kỳ đơn giản, nhưng phải có các pha đúng. Tăng frame bằng duplicate, blur/blend hoặc đổi ms không giải quyết lỗi này.

Prompt V2 và motion reference đã thử đều chưa cho kết quả đạt với imagegen hiện tại. Không có bằng chứng chỉ cần viết prompt dài hơn là xong. Việc model có tên pixel hoặc vẽ pixel đẹp không chứng minh khả năng giữ chuyển động liên tục.

### 4.2. Loop và chuyển state

Run trong kho hiện tại là action không loop theo manifest. **Không đổi hàng loạt sang `loop:true`** trước khi xem frame cuối → đầu; clip có thể chứa đứng → chạy → đứng.

Idle cần chân/pelvis ổn định, thở và đuôi tóc lay nhẹ. Run không bắt đầu/kết thúc bằng pose nghỉ B. Run tốt còn cần entry/stop phù hợp; dừng ở pha bất kỳ có thể giật dù riêng loop chạy đã tốt.

### 4.3. Alpha, grid, scale và registration

Cần kiểm tra lẹm tay/tóc/chân, ảnh từ ô kế bên, viền sáng, ghost, canvas/pivot và cùng tỷ lệ giữa actor. Không center mỗi frame theo alpha bbox. Việc xoay hướng phải mirror actor và các anchor liên quan cùng nhau. PNG RGBA là source; GIF có palette/timing riêng nên không dùng để suy ra chất lượng alpha của runtime.

## 5. Vướng mắc trong code battle

### 5.1. Kho frame chưa nối vào renderer

[js/battle.js](../../js/battle.js) dựng actor từ texture chân dung và `makeLiving(...)`. [js/living.js](../../js/living.js) xử lý mesh/rig, uốn ảnh và pose kiểu tranh sống. Đây là cơ chế có sẵn của game, **không phải pixel frame animator và không phải hướng người dùng đã duyệt cho asset mới**.

Qua tìm kiếm trong `js/`, chưa thấy consumer của `assets/chibi_anim/characters_index.json`. Consumer đang có nằm ở `sprite_demo.html`. Thay đường dẫn ảnh chân dung bằng GIF không giải quyết state, timing, anchor hoặc pause.

### 5.2. Viewer chưa thể bê nguyên vào battle

Viewer dùng CSS background image + `setTimeout`, có logic `currentFrame < 7` và nhãn `/8`. Nó đủ kiểm tra thư viện tám frame; battle cần số frame từ clip, preload texture, xử lý lỗi tải, clock chung, pause/resume, completion/cancel và cleanup khi rời trận. Clip không loop hiện dừng ở frame cuối, chưa tự chuyển về idle theo state gameplay.

### 5.3. Timing VFX/turn chưa dựa trên clip

`playFX()` đang xếp sự kiện theo khoảng cứng như `patk:430ms`, `combo:1150ms`, `eatk:420ms`; `TacticalBattle.queueNextRound()` chờ khoảng 420ms. Khi đưa action frame vào, các thời gian này có thể kết thúc trước hoặc sau động tác. Cần thiết kế cơ chế đồng bộ có fallback; không kết luận code hiện tại đã sai vì hiện nó phục vụ renderer cũ.

Engine vẫn là nguồn xác định hit, damage, energy, cooldown và thắng/thua. Animator cần nhận event để diễn hành động; không giao tính damage cho GIF callback. Timeline presentation phải có action id/token để sự kiện cũ không đánh trúng hoặc đổi state trong trận mới.

### 5.4. Metadata chưa đủ cho skill

Manifest hiện có frame size, pivot, facing, duration và loop. Chưa có mapping skill→clip, marker `release/contact`, điểm phát projectile theo frame, anchor nhận đòn, cancel window, recovery, hoặc fallback khi clip thiếu.

Một clip `attack` không đại diện được mọi cổ trùng/sát chiêu. Roster boss có skill cố định nhưng vẫn cần xác định chiêu nào có VFX gộp trong actor, chiêu nào là projectile/impact ngoài actor. Nếu effect đã baked trong frame, không vẽ lại cùng effect gây nhân đôi; hit vị trí target vẫn phải do runtime điều khiển.

### 5.5. Importer dễ nhận nhầm tài liệu review thành frame

[tools/import_battle_sprites.py](../../tools/import_battle_sprites.py) lấy **mọi PNG trong ZIP**, sắp tên, pad bottom-center, dùng alpha làm mask khi paste, xuất GIF 100ms. ZIP chứa sheet/contact/base có thể bị nhận nhầm là frame; timing/registration source cũng không được xác nhận. Dùng alpha làm mask khi paste RGBA lên canvas trong suốt có thể làm đổi alpha ở viền bán trong suốt.

Không chạy importer này trên batch mới trước khi sửa bộ lọc source frame, schema và cách giữ alpha. Đây là nhận xét code, chưa chạy importer để tái hiện trên ZIP cụ thể.

## 6. Animation còn thiếu hoặc chưa xác nhận

| Nhóm | Hiện trạng | Khi nào cần |
|---|---|---|
| Idle/run/attack/defend/heal/hit | Có file cho 38 actor; chưa nghiệm thu visual đầy đủ | Cả turn-based và battle có di chuyển |
| Run loop/entry/stop | Run đang non-loop; chưa có bộ PN mới đạt | Click-move/realtime cần trước |
| Death/KO | Không nằm trong sáu action của master index | Cần visual kết thúc, có thể tạm fallback tĩnh |
| Cast theo cổ trùng/skill boss | Chưa xác nhận bộ clip/markers đạt | Cần để phân biệt chiêu và đồng bộ release |
| Projectile/impact/aura/telegraph | Battle có VFX code; chưa xác nhận asset pixel đồng bộ actor | Cần khi skill có đạn bay, vùng đánh, phòng thủ |
| Dash/dodge/knockdown/recovery | Chưa xác nhận bộ frame trong master index | Chỉ sản xuất khi cơ chế battle thật sự dùng |

Không tạo thêm 51 clip hoặc toàn roster lúc PN chưa đạt. Turn-based đứng hai phía có thể làm prototype mà chưa cần run; đó là cách kiểm tra integration riêng, không phải tuyên bố vấn đề animation đã được giải quyết.

## 7. Thứ tự công việc đề xuất

| Mốc | Việc cần làm | Điều kiện kết thúc |
|---|---|---|
| A — Audit | Duyệt PN và BNB trước; đánh dấu từng clip accepted/rejected/needs-repair, kiểm tra sheet/source, alpha, duration và seam | Có danh sách clip thật sự được duyệt, không suy từ số lượng file |
| B — Asset tối thiểu | Chọn một idle/attack/hit đạt hoặc tạm dùng B tĩnh để kiểm tra code | Người dùng duyệt visual; asset lỗi không quảng bá là hoàn tất |
| C — Frame animator | Loader + schema + clock + loop/one-shot + pivot + mirror + event/cancel, không rig biến dạng actor | Sandbox phát đúng frame, pause và đổi state không chồng clip |
| D — PN vs BNB theo lượt | Nối một chiêu, một projectile/impact và hit reaction; engine vẫn tính combat | Một lần ra chiêu chỉ có một hit, timing và trạng thái khớp |
| E — Di chuyển | Giải quyết run loop/entry/stop và các pha hỗ trợ | Run đã được duyệt; chưa đạt thì chưa triển khai click-move đầy đủ |
| F — Roster | Nhân rộng schema/skill mappings và asset đã qua QA | Mỗi actor/skill có fallback và trạng thái review rõ |

Hướng sản xuất run mới đang **chưa giải quyết**: không đề nghị thêm lượt generate với prompt tương tự đã thất bại, không tự tải model nữa. Chỉ mở lại khi có model/workflow hoặc phương án sửa frame cụ thể đủ kiểm chứng bằng mẫu nhỏ. Giải pháp tự động miễn phí ngang chất lượng mẫu PixelLab chưa được xác nhận.

## 8. Phạm vi kiểm chứng của báo cáo

Đã đọc code viewer/battle/tactical/importer, kiểm tra số lượng/index/đường dẫn/size/mode của 1.824 frame, đối chiếu metadata preview và phản hồi người dùng. **Chưa chạy browser test mới, chưa chơi lại campaign, chưa review visual toàn roster và chưa sửa gameplay/renderer** trong lượt viết báo cáo này.

Nguồn chuẩn thiết kế/content: [Q1](../reference/CHI_TIET_NGUYEN_TAC_Q1.md), [Q2](../reference/CHI_TIET_NGUYEN_TAC_Q2.md). Hướng frame/prompt: [V2](../prompts/PROMPT_FRAME_IDLE_RUN_PN_V2.md). [Hướng dẫn Draw Things](../reference/HUONG_DAN_DRAW_THINGS_ANIMATION.md) được giữ để truy nguyên thử nghiệm, không còn là hướng đề xuất chạy Wan cho project.
