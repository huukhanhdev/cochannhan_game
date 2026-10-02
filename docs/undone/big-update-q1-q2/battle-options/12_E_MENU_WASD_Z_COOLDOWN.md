# E — Bảng lệnh phía dưới, WASD chọn, Z thực thi

Ngày 02/10/2026. **Đề xuất để review, chưa triển khai.** Đây là hướng input mới nhất, thay preset phím trực tiếp ở tài liệu 11. Giữ đấu trường ground 2.5D và bộ animation PN/BNB; không cần generate lại nhân vật vì đổi cách điều khiển.

## 1. Đề xuất chính: realtime có khoảng nghỉ để chọn lệnh

Bảng action/cổ luôn hiện dưới arena. WASD di chuyển ô chọn; Z xác nhận. Trong lúc duyệt bảng hoặc chọn mục tiêu, battle tạm dừng. Sau khi chốt một lệnh hợp lệ, world chạy để nhân vật thực hiện và địch phản ứng. Người chơi có thể mở bảng để quyết định tiếp, không phải nhớ hàng chục phím hay chọn chiêu khi boss đang đánh.

Đây là chuyển thể gameplay, không phải luật hồi chiêu của nguyên tác. Content, sở hữu cổ và mốc truyện vẫn đối chiếu hai tài liệu chuẩn Q1/Q2. Kit PN/BNB đầy đủ chỉ dùng sandbox như tài liệu 11, không tự cấp cho campaign.

**Mẫu đầu nên dùng chế độ hỗ trợ tạm dừng**, không biến thành trận luôn chạy khi người chơi còn tìm ô. Có thể thử preset nâng cao chọn bảng trong realtime sau khi mẫu đầu đạt yêu cầu; chưa cần thêm một mode battle ngoài lựa chọn theo lượt/realtime đang có ở map.

## 2. Bảng lệnh và điều khiển

Giữ khung game hiện tại. Phía dưới là lưới hai hàng, mỗi trang sáu cột; đây là số ô hiển thị, **không phải giới hạn số skill**. Sắp thứ tự trước trận, không tự đổi vị trí khi cooldown kết thúc. Ô lệnh cơ bản luôn có vị trí ổn định; trang kỹ năng chứa cổ hợp lệ theo loadout.

| Ngữ cảnh | WASD | Z | X |
|---|---|---|---|
| Bảng lệnh | W/S đổi hàng, A/D đổi cột | Chọn lệnh | Đóng bảng, tiếp tục trận |
| Chọn địch/đồng minh | Chuyển mục tiêu theo vị trí màn hình | Xác nhận mục tiêu và thực thi nếu hợp lệ | Quay lại bảng |
| Chọn điểm/hướng | Dời con trỏ ground/đổi hướng ngắm | Xác nhận điểm/hướng và thực thi | Quay lại bảng |
| World đang chạy | Phím đầu tiên mở bảng và di chuyển ô chọn | Mở bảng, không lập tức tung chiêu | Dừng đi/đuổi; không hủy hit đã xảy ra |

- Escape mở menu pause; Tab đổi trang bảng; cho rebind toàn bộ. Mũi tên có thể là alias WASD. Chặn thao tác battle khi gõ text hoặc đang ở settings.
- Z trước tiên mở bảng khi world đang chạy. Sau đó Z chọn ô; lệnh cần target có thêm bước xác nhận. Nhả phím rồi bấm lại mới xác nhận bước kế tiếp, tránh giữ Z gây tung chiêu ngoài ý muốn.
- Lệnh tự thân như hộ thể có thể thực thi ngay khi chọn ô. Lệnh hồi phục cần ghi rõ mục tiêu, số vật phẩm và không cho dùng khi đầy máu nếu hiệu quả bằng không.
- Không bắt WASD vừa chọn ô vừa di chuyển nhân vật. Di chuyển bằng lệnh **Di chuyển → chọn ground → Z**; chuột phải ground vẫn là đường tắt tùy chọn. Chuột trái có thể chọn ô hoặc target theo ngữ cảnh. Chế độ chỉ bàn phím phải chơi được hoàn chỉnh.
- Hết biên bảng không wrap sang một action bất ngờ; ô trống không nhận focus. Skill đang hồi vẫn chọn được để đọc lý do, không bị lén bỏ qua khi điều hướng.
- Z nay là xác nhận; vật phẩm trở thành ô trong bảng, bỏ binding Z dùng vật phẩm của preset cũ. Phím trực tiếp cho skill chỉ là shortcut tùy chọn.

Ví dụ bố cục mặc định PN:

```text
ARENA: PN / BNB, HP, chân nguyên, ý đồ boss, vùng nguy hiểm

Hàng 1: [Di chuyển] [Đánh tay] [Lướt] [Lùi bước] [Vật phẩm] [Nguyên thạch]
Hàng 2: [Nguyệt Mang] [Bạch Ngọc] [Cường Thủ] [Cự Xỉ Kim Ngô] [Thiên Bồng] [Trang tiếp]

Ô đang chọn: tên — tác dụng — cost — tầm — hồi còn lại — lý do chưa dùng được
WASD: chọn     Z: xác nhận     X: trở lại/tiếp tục     Tab: đổi trang
```

Sinh Mệnh Diệp là lựa chọn trong nhóm vật phẩm theo luật sở hữu, không thêm một phép heal miễn phí. BNB dùng danh sách riêng, không sao chép các cổ của PN. Trên mobile: chạm ô → chạm mục tiêu → nút xác nhận, cùng state machine.

## 3. Tạm dừng và vòng thực thi phải rõ ràng

Trạng thái input: `RUNNING → MENU → TARGETING → COMMIT → RUNNING`. Bắt đầu trận ở MENU; lệnh không cần target đi thẳng từ MENU sang COMMIT.

1. MENU/TARGETING đóng băng simulation: địch, projectile, cast đang chạy, cooldown, buff, poison và hồi chân nguyên đều dừng. Camera/con trỏ/highlight vẫn cập nhật. Không đứng đọc bảng để chờ cooldown hết.
2. COMMIT kiểm tra lại actor sống/không bị khóa, skill sẵn sàng, cost, target, tầm, line-of-sight và vị trí đi được. Sai điều kiện giữ bảng mở và giải thích; không mất chân nguyên, không phát clip đánh, không kích CD.
3. Lệnh hợp lệ tạo command ID, vào startup; world tiếp tục và boss không dừng đánh để nhường lượt. Không mặc định một lệnh của player tương ứng đúng một lệnh của địch.
4. Mặc định tự mở bảng sau recovery của action. Di chuyển là ngoại lệ: tới điểm hoặc xuất hiện telegraph nguy hiểm mới mở bảng; người chơi có thể mở thủ công trên đường đi.
5. Khi player rảnh mà mọi lệnh hữu ích đang hồi: X tiếp tục để chờ, vẫn được đi/né và vẫn chịu đòn. Không tự tua thời gian tới lúc chiêu sẵn sàng.
6. Nếu mở bảng giữa startup/active/recovery, chỉ pause; không reset action hoặc thoát recovery. Cho xem lựa chọn nhưng Z báo thời gian khóa còn lại. MVP không queue nhiều lệnh; chỉ nhận command mới khi actor sẵn sàng.

Tự pause khi telegraph mới xuất hiện chỉ bật ở preset hỗ trợ: mỗi telegraph ID kích hoạt một lần, không pause lặp mỗi tick. Người chơi được đọc hướng đánh rồi chốt né/tiếp tục; không tự miễn damage. Pause bởi menu không xóa stun/knockdown hoặc gia hạn buff bằng thời gian ngoài simulation.

Lệnh có tầm không tự vừa chạy tới vừa cast trong MVP. Ngoài tầm thì hiện tầm và báo cần di chuyển. Basic attack chỉ đánh một lần, không tự đuổi mục tiêu vô hạn. Nút Di chuyển cho chọn điểm trên ground được phép, hiển thị path và destination; không teleport.

## 4. Có hồi chiêu, nhưng phân biệt ba loại thời gian

**Hiện trạng:** `js/data.js` có bảng CD theo lượt và `COMBO_CD=4`. `js/rt.js` dùng `rtCD()` chuyển sang giây với `secPerTurn=2.2`, tối thiểu 2 giây; RT còn có khoảng nghỉ chung `gcd=.95`. Đó là luật bản cũ, không phải bộ số đã cân bằng cho E.

| Thành phần | Ý nghĩa | Đề xuất E |
|---|---|---|
| Startup | Chuẩn bị đòn, có thể bị ngắt theo skill | Đồng bộ anticipation trong clip |
| Active/release | Hitbox hoặc projectile thực sự xuất hiện | Event từ simulation, đúng một lần mỗi hit ID |
| Recovery | Thu chiêu trước khi làm action tiếp | Khóa actor theo action; không thêm GCD 0.95s của RT một cách máy móc |
| Cooldown riêng | Khi nào dùng lại cùng skill | Đếm bằng giây simulation, hiển thị trên ô |
| Chân nguyên | Ngân sách dùng cổ | Trừ theo skill, không thay cooldown và không hồi trong pause |

Đánh tay không cần CD riêng; startup/active/recovery đã giới hạn tốc độ. Move không có CD. Lướt có CD để không né vô hạn. Cổ công kích có CD ngắn/vừa; hộ thể, khống chế và sát chiêu có CD dài hơn. Chiêu mạnh phải có telegraph và giá dùng, không chỉ tăng damage.

**Quy tắc commit/release:** chi phí chân nguyên và CD bắt đầu khi command được nhận vào startup. Kiểm tra thất bại trước đó không mất gì; bị địch ngắt sau đó vẫn mất chi phí/CD, UI báo “bị ngắt”. Player không được mở bảng rồi đổi lệnh để hoàn tiền. Cast có thể hủy/hoàn tiền chỉ khi definition ghi rõ; MVP không cho hủy startup đã nhận. Projectile trượt hoặc target chết sau release không tự hoàn CD.

## 5. Bộ số thử đầu — giả thuyết, chưa dùng cho campaign

Chân nguyên trong bảng là phần trăm của bể tối đa khi vào sandbox, để so hai kit; thực tế phải quy về hệ chân nguyên/phẩm chất hiện hữu trước tích hợp. Hồi cơ bản thử **0.4% bể/giây simulation**, giữ giới hạn bể. Đây không phải cơ chế mỗi turn cộng energy; chỉ chuyển sang lượt nếu chọn thiết kế A ở tài liệu 01.

| Action/skill | Startup / recovery | CD riêng | Cost thử | Mục đích |
|---|---|---|---|---|
| Đánh tay | 0.18s / 0.25s, active 0.10s | Không | 0 | Có lựa chọn khi thiếu chân nguyên |
| Di chuyển | Không cast | Không | 0 | Tạo khoảng cách/chọn vị trí |
| Lướt | Di chuyển 0.25s / 0.15s | 2.5s | 0 | Né bằng vị trí, không i-frame mặc định |
| Lùi bước | 0.20s / 0.20s | Chung CD với lướt | 0 | Không luân phiên hai nút để né vô hạn |
| PN — Nguyệt Mang | 0.35s / 0.35s | 3s | 5% | Đòn tầm xa cần ngắm, có thể trượt |
| PN — Bạch Ngọc | 0.30s / 0.25s | 10s | 10% | Hộ thể thử 3s, không bất tử |
| PN — Cường Thủ | 0.65s / 0.55s | 12s | 12% | Bắt giữ có điều kiện; không universal stun |
| PN — Cự Xỉ Kim Ngô | 0.45s / 0.50s | 5s | 7% | Cận chiến, hit shape riêng |
| PN — Thiên Bồng | 0.50s / 0.35s | 14s | 14% | Phòng thủ có thời hạn; chưa cộng dồn vô điều kiện với Bạch Ngọc |
| BNB — Băng Đao | 0.30s / 0.35s | 2.5s | 4% | Đòn cận, cân bằng với đánh tay |
| BNB — Thủy Tráo | 0.35s / 0.30s | 10s | 10% | Hộ thể thử 3s |
| BNB — Băng Trùy | 0.50s / 0.40s | 4s | 6% | Projectile băng có hướng |
| BNB — Lốc băng nhận | 1.20s / 0.70s | 16s | 18% | AoE báo trước; không tự bạo |
| BNB — Bạch Ngọc | 0.30s / 0.25s | 10s | 10% | Theo definition sở hữu, không tự cộng hai lớp giảm sát thương |
| Sinh Mệnh Diệp/vật phẩm heal | 0.65s / 0.35s | Nhóm vật phẩm 8s | Một vật phẩm | Có cơ hội bị ngắt, không spam hồi máu |
| Hấp thu nguyên thạch | Channel, thử 3s | Không | Theo giao dịch tài nguyên đã chốt | Có thể bị ngắt; không hồi ngay khi nhấn |

Buff phòng thủ cùng nhóm mặc định thay thế nhau, không nhân giảm damage thành bất tử; show preview “thay hộ thể hiện tại”. Kho vật phẩm/chi phí channel chỉ bị trừ khi giao dịch được định nghĩa; item heal MVP tiêu hao lúc bắt đầu dùng, bị ngắt vẫn mất item và CD. Nguyên thạch không trừ nhiều lần theo frame: bắt đầu giữ một đơn vị, mỗi mốc channel hợp lệ áp dụng một giao dịch idempotent; hủy trước mốc thì trả phần chưa tiêu. Chốt giá trị hồi riêng trước PR channel.

Không có damage của E đã cân bằng trong bảng này. PR đầu cần định nghĩa HP/damage/guard/slow/range và chạy thử; không lấy FX lớn suy ra hitbox lớn hoặc mặc định mỗi chiêu gây một lượng HP như nhau.

## 6. UI phải cho thấy cảm giác chiến đấu

- Ô focus có viền sáng và nhãn Z; skill sẵn sàng sáng rõ, đang hồi có lớp radial + số giây, thiếu chân nguyên có biểu tượng riêng. Không chỉ phân biệt bằng màu.
- Khi chọn: arena hiển thị tầm/đường đi/shape AoE và target; dòng mô tả ngắn nêu cost, CD, startup. Projectile preview là hướng ngắm, không hứa chắc trúng mục tiêu đang chạy.
- Giữ chân nguyên cạnh HP; preview phần sắp tiêu khi ngắm. Cost sai, ngoài tầm, bị choáng và CD là các lý do khác nhau.
- Khi thực thi: viền bảng dịu xuống; actor khởi chiêu có FX tại thân, projectile/impact/field là lớp world. Damage number, hit flash, âm thanh và camera nhẹ phát tại hit event, không tại Z.
- Khi pause: nhãn “Đang chọn lệnh — thời gian tạm dừng”; không dùng động tác idle đang tiếp tục thở để giả battle vẫn chạy. FX decorative UI có thể tiếp tục nhưng không đổi vị trí/phase đòn đang đóng băng.
- Khi hết recovery: bảng trở lại, giữ focus vừa dùng để dễ lặp nhưng Z vẫn cần kiểm tra lại readiness. Không ép focus sang skill mới khiến người chơi dùng nhầm.
- Chế độ nhẹ/reduced motion giảm shake, flash, particles; telegraph và phạm vi nguy hiểm vẫn đọc được.

## 7. Asset sử dụng và phần chưa cần tạo thêm

Tận dụng bộ hai nhân vật: idle, move_start/loop/stop, basic_attack, dash/backstep, hit, stun_loop, interrupted, knockback/knockdown/getup, defeat, channel_start/loop/end, use_item, guard_react và các clip chiêu. Chỉ bật mechanic đã có resolver, không bật knockdown chỉ vì có clip.

**Không thêm animation riêng cho “chọn menu”**. Animation dừng tại pose hiện hành khi pause, resume đúng thời gian simulation. move_loop phải nối F08→F01 theo pha bước, không buộc F08 giống F01; skill một lần trở về pose nghỉ sau recovery. Death không quay về idle.

Các asset còn phụ thuộc: icon cổ/vật phẩm đúng nhận diện, con trỏ điểm ground, đường path, reticle, telegraph, detached projectile/impact/field theo backlog. Viền focus/radial CD có thể dựng bằng code, không cần AI generate. QA frame crop, pivot, release marker, mirror và ghosting trước nhập animation.

## 8. Chia PR để mỗi bước có thể preview

| PR | Nội dung | Điều kiện review |
|---|---|---|
| M-01 | Bảng hai hàng, điều hướng WASD/Z/X/Tab, tooltip/readiness mock; đặt trong khung hiện tại và sandbox riêng | PN/BNB loadout đổi được; hơn 12 lệnh vẫn chọn được; giữ Z không double confirm |
| M-02 | Nối simulation E với MENU/TARGETING/COMMIT; pause clock, move ground, basic attack | Chơi chỉ bàn phím; ngoài tầm không tiêu cost; pause không hồi CD; địch tiếp tục cùng clock khi chạy |
| M-03 | Chân nguyên, skill CD, dash/shared dodge group, PN Nguyệt Mang + BNB Băng Đao | Nhìn animation thấy startup/release/recovery; command/hit không xử lý hai lần |
| M-04 | Hộ thể, projectile/AoE, boss intent, automatic pause hỗ trợ và những skill còn lại | Defense không stack sai; telegraph pause một lần; hai kit có nhịp khác nhau |
| M-05 | Item/channel, rebind, mobile, reduced motion và kết quả trận/save | Thua/rút lui/chiến thắng không lặp thưởng; migration không đổi action ID |

M-01 có thể làm preview đầu tiên bằng mock state. M-02 trở đi phụ thuộc world/collision/action resolver của E; không ghép menu mới vào RT ba khoảng cách rồi gọi đó là E đã hoàn thành. Tách sandbox khỏi campaign đến khi mẫu hai actor đạt yêu cầu. Các mã M là nhánh input/UI bổ sung cho E-01…08, không thay toàn bộ lộ trình nền.

## 9. Nghiệm thu và playtest

Kiểm tra tự động khi implement: giữ phím không lặp commit; focus/page ổn định; invalid command không trừ tài nguyên; pause/resume không làm nhảy clock; cast/hit/item giao dịch đúng một lần; interrupt không hoàn CD sai; stun/death khóa action; mirror không lệch hit/anchor. Load hoặc trở lại tab không cộng thời gian ngoài trận vào cooldown.

Chơi thử 5–10 người chưa biết kit, hai trận ngắn PN vs BNB. Các mục tiêu thử, chưa phải số đã đo:

- Trong 60 giây đầu, hiểu WASD chọn/Z xác nhận và tự đánh được mà không cần nhớ tên cổ.
- Chọn một skill ở trang đầu trong khoảng 2 giây sau khi quen; skill trang sau trong khoảng 4 giây. Nếu chậm hơn, đổi grouping/thứ tự trước khi tăng tốc world.
- Không chết chỉ vì đang đọc mô tả trong bảng; phân biệt được “chiêu đang hồi” và “thiếu chân nguyên”.
- Có lý do dùng đánh tay/di chuyển trong lúc chờ CD, không chỉ xoay vòng toàn bộ ô sẵn sàng.
- So với preset chọn bảng khi realtime vẫn chạy: đo thao tác sai, lần bị trúng vì duyệt menu, thời lượng trận và đánh giá nhịp. Giữ preset hỗ trợ nếu nó dễ hiểu và vẫn có quyết định đáng cân nhắc.

**Đề xuất chốt cho bản thử:** bảng phía dưới + WASD/Z; auto pause khi chọn; cooldown theo simulation; đánh tay không CD riêng; lướt 2.5s; cổ công kích khoảng 2.5–5s; hộ thể 10–14s; chiêu AoE mạnh 16s. Chơi mẫu trước khi mở rộng roster hoặc chốt balance campaign.
