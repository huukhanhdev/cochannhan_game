# E — Bộ thử đầy đủ PN / BNB nam, click-to-move và phím mở

**Cập nhật hướng input:** yêu cầu mới chuyển sang bảng lệnh dưới arena, WASD chọn và Z xác nhận; xem [12_E_MENU_WASD_Z_COOLDOWN.md](12_E_MENU_WASD_Z_COOLDOWN.md). Preset phím ở mục 1 dưới đây giữ làm lịch sử/shortcut tùy chọn; Z dùng vật phẩm không còn là mặc định. Bộ kit và animation vẫn dùng lại.

Ngày 02/10/2026. Đây là cấu hình sandbox/asset cho yêu cầu mới, chưa là code battle đã triển khai. Giữ ground plane và collision của E, đổi input chính từ WASD sang chuột. Không sao chép nguyên luật hay tạo hình của game khác; mục tiêu là cảm giác click di chuyển và dùng kỹ năng bằng phím như người dùng mô tả.

## 1. Điều khiển mới — không giới hạn QWER

| Input mặc định | Lệnh |
|---|---|
| Chuột phải | Đi đến điểm ground; click mới thay destination cũ |
| Chuột trái vào địch | Đánh tay; nếu ngoài tầm thì tiến đến tầm, không teleport |
| Chuột trái ground | Đòn tay có hướng ở vị trí hiện tại; không tự tạo target |
| QWERTYUIOP… | Gán lần lượt cổ/kỹ năng/sát chiêu trong preset thử; số slot không giới hạn bốn |
| Space | Lướt theo aim, nếu không có aim dùng facing; không i-frame mặc định |
| X | Dừng lệnh đi/đuổi mục tiêu; không hủy active hit đã xảy ra |
| Z | Dùng vật phẩm đang chọn |
| C | Hấp thu nguyên thạch khi đủ điều kiện; channel có thể bị ngắt |
| Escape | Pause/menu |

Preset là giá trị ban đầu, người chơi được đổi binding. Action ID và skill ID tách khỏi phím: `skill_nguyetmang` vẫn là skill đó khi đổi Q sang I. Bảng slot sinh theo danh sách cổ/skill hợp lệ, thêm skill không phải sửa enum chỉ có q/w/e/r. Khi phím đã bị gán thì settings báo xung đột, cho đổi/chuyển binding có chủ đích. Profile lưu vào META riêng, không đặt tên file art theo phím.

Animation tự động như move/hit/stun/getup/defeat không cần phím. Lệnh dùng skill chọn clip theo state và actor. Không tạo một nút bàn phím cho mỗi frame hoặc animation. Khóa input khi gõ text/menu; context menu chỉ bị chặn trong vùng arena. Tránh dùng tổ hợp bị trình duyệt/OS chiếm cho preset; thông báo rõ nếu binding không nhận được.

Chuột phải không luôn cancel cast: trước release chỉ được hủy khi skill cho phép; sau release đang recovery thì queue destination một lần. Skill mới không tự làm attack cũ hit lần hai. Giữ chuột không dùng skill mỗi frame; có `autoAttack` tùy chọn riêng, mặc định một click = một lệnh basic attack. Death/stun mất target không làm actor tự đuổi vào tường vô hạn.

## 2. Hai kit sandbox để thử đủ loại animation

PN dùng model Q1 nam đen tóc/dark robe. BNB dùng **nam Q1 hai tay**, white hair/pale robe, không dùng female Q2 trong bất cứ clip nào. Bộ kỹ năng là tuyển tập để thử art từ nguồn Q1 và thông tin bộ băng trong Q2; không khẳng định cả hai sở hữu đúng tất cả cổ tại cùng một chương/duel lịch sử.

| Actor | Preset | Skill ID art | Chiêu và nguồn | Actor gộp local effect | Ngoài actor |
|---|---|---|---|---|---|
| PN | Q | skill_nguyetmang | Nguyệt Mang, Q1 ch101 | Wrist light / release flash | Crescent projectile, impact |
| PN | W | skill_bachngoc | Bạch Ngọc, Q1 ch100 | Jade skin cast flash | Status tint/mask kéo dài |
| PN | E | skill_cuongthu | Cường Thủ, Q1 ch138 trở đi | Grasp movement / iron claw light | Target effect/capture do resolver |
| PN | R | skill_cuxikimngo | Cự Xỉ Kim Ngô, Q1 | Gu-weapon và saw trail | Actual melee contact/impact |
| PN | T | skill_sinhmenhdiep | Dùng Sinh Mệnh Diệp từ Cửu Diệp, Q1 ch76 | Leaf use / healing flash | Item use/heal do engine; không phép chữa độc vô điều kiện |
| PN | Y | skill_thienbong | Thiên Bồng, Q1 | Pale canopy cast | Status/overlay tồn tại theo luật |
| BNB nam | Q | skill_bangdao | Băng Đao trong game data | Blade/frost/slash trail | Melee impact |
| BNB nam | W | skill_thuytrao | Thủy Tráo, Q1 | Water shell khởi chiêu | Persistent shell FX |
| BNB nam | E | skill_bangtruy | Băng Trùy trong danh sách bộ băng cũ, Q2 | Palm frost/release | Ice projectile |
| BNB nam | R | skill_locbangnhan | Lốc băng nhận, Q1 ch140 | Windup/frost quanh caster | World AoE field; tuyệt đối không tự bạo |
| BNB nam | T | skill_bachngoc | Bạch Ngọc trong game data BNB | Porcelain skin cast | Persistent status |

Các skill chưa có key logic hiện hành như `skill_bangtruy`/`skill_locbangnhan` cần E resolver definition mới, chưa tự trở thành skill chỉ vì có ảnh. Hiệu ứng băng cận tay và vòng bảo vệ được chuyển thể mỹ thuật; data phải chốt range, slow, duration và cost trước campaign. Không tạo sát chiêu mới chỉ để lấp đủ bàn phím. Khi thêm sát chiêu có nguồn, nó có skill ID/binding riêng và clip phù hợp, hoặc tổ hợp clip đã duyệt.

## 3. Bộ clip đầy đủ cho thử nghiệm này

Mỗi người có 20 action dùng trong combat lifecycle: idle, move_start, move_loop, move_stop, basic_attack, dash, backstep, hit, stun_loop, interrupted, knockback, knockdown, ground_hold, getup, defeat, channel_start, channel_loop, channel_end, use_item, guard_react.

PN thêm sáu clip chiêu; BNB thêm năm. Tổng **51 clip × tám frame = 408 PNG frame nguồn + 51 sheet**, cùng hai B. Tận dụng clip cũ nếu đúng hợp đồng và QA đạt; số 51 là mục tiêu coverage, không bắt vẽ lại mọi clip đã có. Movement loop, hold và defeat có hợp đồng khác run/hit cũ.

Các clip nhảy/bay/biến thân không thuộc mẫu này. Không cần một model 8 hướng ngay từ đầu: sideview right canonical, mirror left; đi chiều sâu dùng locomotion + ground shadow. Đây là phương án tiết kiệm asset để kiểm tra tính khả thi, không hứa góc nhìn giống toàn bộ một MOBA 3D.

## 4. Thứ tự generate và áp vào sandbox

1. Duyệt B đúng identity cho cả hai. So B với asset đã tải, giữ design nếu đúng.
2. Generate idle/move_start/move_loop/move_stop/basic_attack/dash/hit và một skill nổi bật mỗi người. Nhập viewer, chạy click-to-move và basic attack trước.
3. Thêm các skill còn lại và detached FX. Kiểm tra hai hướng, nhiều khoảng cách, aim và miss.
4. Hoàn thiện stun/interrupt/channel/knockdown/getup/terminal/guard reaction. Không tự bật mechanic ngã nếu chưa có resolver.
5. Thử full two-actor sandbox, mobile tương ứng và pause/reload; chọn thiết kế rồi mới hàng loạt roster.

Hai actor có thể được chọn làm player trước khi vào sandbox; actor còn lại dùng AI đơn giản. Không đổi player giữa một cast đang giải quyết. Không thưởng campaign hoặc ghi progression từ sandbox.

## 5. Phần code phải có, asset không tự cung cấp

Click ray/ground projection, pathfinding với obstacle và target chase/stop distance; input rebind; simulation clock/pause; action startup/active/recovery và cancel; actor state priority; projectile sweep; melee hit shape; damage và hit IDs; cooldown/resource; AI intent; objective/result/save.

Basic attack/skill phase markers đọc từ binding, không trừ HP từ GIF callback. Missile thực thể khác vệt sáng baked. Thời gian skill có thể retime clip nhưng phải giữ release/contact đồng bộ. Camera/renderer mirror cả actor và anchors theo cùng transform.

## 6. Tiêu chí xác nhận khả thi

- Click ground không nhảy chân, không chạm body địch rồi vẫn đứng chạy tại chỗ.
- Trúng/né do collision thật, baked slash không đồng nghĩa chắc gây damage.
- Move loop không xen pose đứng; stun giữ đúng state; defeat không quay về idle.
- Face/hair/costume giữ nguyên qua toàn bộ clip; local FX không che joint.
- Sheet cắt ra khớp frame RGBA nguồn; actor và projectile không wrap/mất tay.
- Thêm kỹ năng thứ năm/thứ mười và đổi phím không cần thay animator hoặc tên file.

Đọc bộ [prompt đầy đủ, độc lập từng action](../../../prompts/PROMPT_FULL_BATTLE_CLICKMOVE_PN_BNB_NAM.md). Đây là tài liệu để AI sản xuất asset và developer tích hợp; chưa triển khai input hoặc generate ảnh trong task hiện tại.
