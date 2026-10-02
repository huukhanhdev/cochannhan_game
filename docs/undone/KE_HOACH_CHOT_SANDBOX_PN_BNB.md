# Kế hoạch chốt sandbox PN–BNB — Blue-chan gửi Orange-kun

02/10/2026. **Chỉ lập kế hoạch theo yêu cầu mới nhất của người dùng; chưa triển khai các thay đổi bên dưới.** Ưu tiên sửa KO ở mép sân và điều khiển điện thoại, sau đó hoàn thiện hình/âm trước khi nối campaign.

Đọc cùng [kế hoạch map](KE_HOACH_MAP_BATTLE_PIXEL.md) mục 10–11 và [kế hoạch VFX/âm](KE_HOACH_VFX_AM_THANH_BATTLE_E.md) mục 11–12. Không tự thay phần Orange-kun đang làm.

## 1. Baseline vừa đối chiếu

- Simulation hiện dùng X0/X1 = 110/890; z = 0…240; canvas 960×430, scale actor = `1.12 * depthK(z)`.
- KO cuối tại z=240 vẫn tràn khoảng 16,68 px của PN và 19,06 px của BNB ở biên hiện tại. Chỉ kiểm z=0 không đủ.
- Chạm đất đã đi, chạm địch đã đuổi đánh; bấm ô chiêu đang dùng vị trí địch làm điểm nhắm, kể cả Lướt. Chưa có nút Dừng cho điện thoại.
- **Orange-kun đã bổ sung phím mũi tên:** `SBInput.tick()` cập nhật đích đi, Space có thể lướt theo hướng phím đang giữ. Khi sửa mobile phải giữ chức năng này, không thay bằng bản input cũ của Blue-chan.
- Nền trúc, haze, VFX mẫu và audio đã chạy trong sandbox. Chưa có bộ file âm thật; phần lớn chiêu còn mượn pose dự phòng. Chưa nối campaign.

## 2. A — Sửa KO và đo margin trước khi đổi biên

### Phương án đề xuất

Ưu tiên **thu biên simulation theo phép đo các clip PN/BNB hiện có**, vì renderer và hitbox tiếp tục dùng cùng tọa độ. Cặp **132/868 là ứng viên**, không phải giá trị bảo đảm trước khi đo toàn bộ clip.

Không tự dịch riêng ảnh KO vào trong sân trong khi pivot/hitbox còn ở vị trí cũ. Chưa mở camera động hoặc thu nhỏ riêng pose KO: các cách này dễ khiến hình nhảy, khác tỷ lệ hoặc lệch phép nhắm.

### Trình tự

1. Đo alpha bbox của **mọi frame** trong các clip hiện có, theo pivot thật, hai hướng mặt và scale ở z=0/240. Dùng alpha >=100 cho phần nhìn rõ; kiểm thêm alpha >0 để phát hiện fringe. Báo cả tràn ngang và dọc.
2. Từ bề vươn trái/phải lớn nhất, tính inset world qua hệ số ngang 0,96; thêm margin tối thiểu 2 px màn hình. Giữ SCALE và depthK. Nếu 132/868 chưa đủ cho clip khác, báo giá trị cần thiết thay vì ghi “đã hết clipping”.
3. Với biên được chọn, sửa `SBSim.X0/X1`, metadata `world_bounds` của map mẫu và mô tả sân liên quan. Input/AI lấy biên từ sim; không thêm hằng số riêng vào touch hoặc mũi tên. Spawn hiện 300/680 phải được kiểm vẫn hợp lệ.
4. Kiểm đi, dash, Sương Yêu, chộp kéo, đẩy thân và KO ở biên. Không chặn riêng từng đường di chuyển theo bộ biên khác.
5. Đo cân bằng theo cùng danh sách seed trước/sau thay biên: đề xuất 3 × 300 trận mỗi mức, ghi tỷ lệ thắng, thời gian trận và các trận không kết thúc. Nếu chênh trên 5 điểm phần trăm ở một mức, xem lại nguyên nhân trước khi chỉnh thông số chiêu. Ngưỡng này là cổng review, không chứng minh các mức dưới ngưỡng hoàn toàn tương đương.

### Nghiệm thu A

- PN/BNB, mọi frame hiện có, hai hướng mặt, z=0/240 và hai mép x: alpha bbox nhìn rõ nằm trong viewport.
- Có ảnh KO cuối tại cả bốn góc; không chỉ chụp frame đầu của clip.
- Hồi quy logic kết trận qua; input và world_bounds khớp sim.
- Orange-kun review bảng phép đo và benchmark trước khi coi biên mới là baseline.
- Chỉ bảo đảm cho hai actor đã đo; roster/thú lớn cần đo riêng, không tự áp cùng biên rồi thu nhỏ thú.

## 3. B — Điều khiển điện thoại: Dừng và chọn điểm chiêu

### Hành vi mong muốn

| Thao tác | Kết quả |
|---|---|
| Chạm đất khi chưa chọn chiêu | Đi tới điểm chạm, như hiện tại |
| Chạm địch khi chưa chọn chiêu | Đuổi tới tầm rồi đánh, như hiện tại |
| Chạm ô Nguyệt Mang hoặc Lướt bằng cảm ứng | Chọn chiêu, hiện viền ô + nhắc “Chạm sân để nhắm” và nút Hủy; chưa phát chiêu, chưa trừ tài nguyên |
| Chạm điểm trong sân khi đã chọn | Nguyệt Mang phóng tới điểm đó; Lướt theo hướng từ PN tới điểm đó. Một thao tác chỉ phát một lệnh chiêu, không đi/đánh thêm |
| Chạm địch khi đang nhắm | Dùng vị trí địch làm điểm nhắm chiêu đã chọn, không chuyển thành đánh thường |
| Chạm trời/ngoài vùng cho phép | Không phát chiêu; giữ lựa chọn và hướng dẫn |
| Chạm lại ô đang chọn hoặc Hủy | Bỏ chọn; không ảnh hưởng máu, tài nguyên hoặc thời gian trận |
| Chạm nút Dừng | Bỏ chọn chiêu và gọi `issue(..., {skill:'stop'})`, hủy đích/chase/buffer theo luật hiện tại |
| Chạm hộ thể hoặc Sinh Mệnh Diệp | Dùng ngay như cũ, không phải chọn điểm; bỏ lựa chọn nhắm đang có |
| Chạm Cự Xỉ hoặc Cường Thủ | Giữ dùng trực tiếp với địch và kiểm tầm hiện có; chưa thêm chế độ chọn mục tiêu cho melee/grab |

**Dừng không ngắt chiêu đã nhận**, không hoàn tài nguyên, không tạm dừng trận. Hiện `stop` chỉ dừng di chuyển/chase và hủy buffer; phải giải thích đúng trên giao diện.

### Trạng thái input và chống xung đột

- Bổ sung `selectedSkill` ở input/UI, tách khỏi `aim` con trỏ desktop. Đây là lựa chọn giao diện, không phải act trong simulation.
- Chế độ chọn điểm áp dụng theo **pointerType cảm ứng/bút**, không theo width hay user-agent. Desktop bấm nút chiêu bằng chuột vẫn dùng ngay theo địch; Q/W/E/R/D và Space giữ cách nhắm hiện có.
- Khi đang chọn điểm, nhánh touch trên canvas xử lý lựa chọn trước đi/đánh. Commit ở pointerup hợp lệ; pointercancel hoặc ngón phụ không commit. Tránh đồng thời pointerdown phát move rồi pointerup phát skill.
- Dùng một bộ xử lý Pointer Events; không thêm touchstart/mousedown song song gây lệnh kép. Tọa độ qua `SBView.toWorld()` và hitActor, dùng cùng tolerance/clamp hiện tại.
- Nếu đang hồi/thiếu tài nguyên/hết lượt: không cho chọn và hiện reason. Khi xác nhận vẫn gọi `SBSim.issue()` để kiểm lại; có thể hết hiệu lực trong lúc đang nhắm. Lệnh không hợp lệ không trừ gì; giữ lựa chọn để sửa điểm hoặc Hủy.
- Nếu đang bận, giữ bộ đệm hiện tại: kết quả `queued` bỏ lựa chọn và hiện thông báo có hạn 0,25s. Không hứa “chắc chắn sẽ ra chiêu” nếu buffer hết hạn trước khi rảnh. Không tạo hàng đợi thứ hai trong UI.
- Lướt tới đúng tọa độ PN không có hướng: giữ lựa chọn và nhắc chọn điểm khác, không tiêu hồi chiêu cho một lần đứng yên.
- Khi KO/kết trận/restart/blur hoặc ẩn tab: dọn lựa chọn và marker nhắm. Listener mới phải được dọn khi unmount nếu sau này nối campaign.
- Trộn bàn phím và cảm ứng: lệnh chuột/phím trực tiếp hủy lựa chọn touch trước khi xử lý. Nút Dừng/S phải xóa trạng thái mũi tên đang giữ để tick tiếp theo không tự đi lại; người dùng nhấn mũi tên mới thì đi lại. Không dùng CSS để giấu lỗi ưu tiên lệnh.

### UI đề xuất

- Nút Dừng/Hủy đặt ngoài canvas, gần thanh kỹ năng, vùng bấm tối thiểu 44×44 CSS px. Hủy chỉ hiện khi đang chọn điểm; Dừng luôn có.
- Ô đã chọn có viền + nhãn trạng thái; không chỉ đổi màu. Hint ngắn, không che actor/telegraph.
- Giữ `touch-action:none` trong sân và cuộn bình thường bên ngoài. Trận vẫn chạy khi nhắm.
- Không cần joystick, kéo để đi hay giữ ngón để sạc chiêu trong đợt này.

## 4. File dự kiến sửa khi được triển khai

| File | Công việc |
|---|---|
| `tools/…` đo margin | Báo bbox/pivot/scale/biên đề xuất cho toàn bộ clip, đầu ra để review |
| `js/sandbox/sim.js` | Chỉ đổi biên sau phép đo A; không thay `stop` thành ngắt act |
| `assets/battle_maps/q1_bamboo_clearing/map.json` | Đồng bộ world_bounds với sim |
| `js/sandbox/input.js` | Selected skill, touch commit/cancel, API Dừng/Hủy; giữ mũi tên + tick |
| `js/sandbox/hud.js` | Phân biệt kích hoạt nút bằng chuột/cảm ứng; viền lựa chọn và hint |
| `js/sandbox/view.js` | Marker/tầm nhắm nếu cần; chỉ đọc lựa chọn, không phát lệnh |
| `battle_sandbox.html` | Nút Dừng/Hủy và hướng dẫn; bố cục mobile không tràn |
| Test và hai tài liệu map/VFX | Hồi quy mới, phép đo, benchmark và cập nhật bàn giao |

Tên công cụ đo chưa chốt; ưu tiên một report nhỏ đọc manifest thật, không xây pipeline asset mới cho việc này.

## 5. Kiểm thử B

1. Touch: đi/đánh cũ; chọn → nhắm → phát đúng một lần; Hủy không mất tài nguyên; ngoài sân không phát; ngón phụ/pointercancel không phát.
2. Điểm nhắm Nguyệt Mang được giữ từ lúc nhận lệnh, không tự đổi theo địch sau đó. Lướt theo điểm chọn, không mặc định lao về địch; điểm trùng PN không dùng chiêu.
3. Thiếu chân nguyên, cooldown, busy/queued/expiry, KO trong lúc chọn, Dừng khi chase/busy và sau khi dùng mũi tên; không phát chiêu cũ sau Hủy.
4. Desktop: chuột phải đất đi, chuột trái đất không đi, click địch đánh, nút chiêu vẫn dùng ngay, Q/Space nhắm như cũ; mũi tên đi chéo không nhanh hơn, thả/blur dừng.
5. Mobile 390 px và landscape: không tràn ngang, nút dễ chạm, quy đổi tọa độ đúng khi canvas scale. Chrome giả lập trước, Safari iPhone/Chrome Android thật sau; ghi rõ phần nào chưa thử thiết bị thật.
6. Hồi quy simulation, mute/audio/VFX và kết trận tiếp tục qua. Việc chọn điểm không làm ngừng clock hoặc hồi chiêu.

## 6. Các bước tiếp sau A/B

1. Duyệt lại một trận PN–BNB với nền, biên và mobile mới; chốt baseline trước khi gen thêm.
2. FX-03: phân biệt hình ba hộ thể (âm đã có); hồi lá đúng pha thành công/ngắt.
3. FX-04: nhập sprite rết/Cường Thủ, hoàn thiện Lốc/Sương Yêu và marker đúng event.
4. Thử vài cue file có nguồn/giấy phép rõ, normalize âm lượng, nghe duyệt thật; âm tổng hợp vẫn fallback.
5. Sau khi sandbox đạt mới lên kế hoạch nối **một trận campaign**: kit theo cổ sở hữu, máu/chân nguyên, thưởng, kết trận/save và fallback. Chưa triển khai campaign trong A/B.

## 7. Orange-kun cần phản hồi

- Đồng ý thu biên theo phép đo toàn clip, hay có giải pháp camera/layout tốt hơn giữ được cùng pivot và hitbox?
- Đồng ý mobile hai bước cho Nguyệt Mang/Lướt, còn buff/heal/melee/grab dùng ngay?
- Xác nhận cách phối hợp với mũi tên mới và Dừng; báo nếu đang chỉnh cùng file input/hud để tránh chồng thay đổi.
- Review kết quả đo và cổng nghiệm thu trước khi triển khai. Tài liệu này chưa phải báo cáo công việc đã hoàn tất.
