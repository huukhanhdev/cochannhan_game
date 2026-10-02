# Battle E — toàn bộ điểm còn cần chốt và phụ thuộc

02/10/2026. **Một đầu mối cho mọi việc chưa chốt**, thay các danh sách hỏi rải rác. Phần đã triển khai ở [đồng thuận/hiện trạng](BATTLE_E_DONG_THUAN_VA_TRIEN_KHAI.md), phản hồi gốc của hai AI ở [lịch sử](../reference/LICH_SU_REVIEW_BATTLE_E_2026_10_02.md).

## 1. Quyết định thiết kế chưa có đồng thuận cuối

| ID | Vấn đề / ý kiến hai AI | Hướng đề nghị, còn phải chốt |
|---|---|---|
| CN-1 | Orange: cổ sư thường regen ≈0 trong trận 40s, chỉ tính giờ giữa cảnh. Blue: đúng thang truyện, nhưng đã nêu phương án regen nhỏ có nhãn game | Ưu tiên ≈0; chốt thang thời gian trước áp. BNB Thập Tuyệt/cổ hồi là ngoại lệ riêng, không tự suy rate canon |
| CN-2 | Blue đề xuất channel hấp thu nguyên thạch; Orange muốn chỉ giữa cảnh/rút khỏi trận, tránh potion trá hình | V1 giữa cảnh; nếu giữ trong trận phải chốt thời gian, lượng quy đổi theo quality, phí/viên dở và interruption. Không gọi action engine ngoài trận để lách phí |
| CN-3 | Hai AI đồng ý tách capacity/current/quality/nguồn hồi nhưng chưa chốt đơn vị save và chuyển đổi | Định nghĩa đầy bể theo tư chất/không khiếu, quality theo tu vi; tránh nhân lợi thế quality hai lần. Chốt migration trước sửa thanh/inventory |
| CN-4 | Orange đề xuất Băng nhận 3/đòn hoặc dựng vũ khí/upkeep; bể130/regen0,8 là ứng viên. Blue đã đo 3/đòn, tác động thắng nhỏ | Chốt semantics Băng nhận trước thử rate/bể; không áp đồng thời mọi con số rồi quy kết nguyên nhân. Cần log tổng phí/regen/thiếu nguyên/min và ngân sách trước+ hồi−chi=cuối |
| CN-5 | Phí hủy: Blue nêu 25%; Orange muốn .15s đầu miễn phí, sau đó mới 25% | Chưa đổi luật cancel. Chốt free window, cơ sở tính phí, không đủ tiền, shared lock và hủy do địch vs chủ động; test không thu hai lần |
| CN-6 | Khóa chung 2s là quyết định đã áp; có thể thử 1s/0s khi chân nguyên đủ quan trọng | Giữ 2s tới khi đo xong ngân sách. 1 action vẫn bắt buộc; hộ thể tồn tại có upkeep không có nghĩa phải khóa mọi action cả 3s |
| TR-1 | Sương Yêu trong code demo đang escape; nguồn review xác nhận cổ tăng công/tự hại | Chốt buff/đổi pha/thời gian/chi phí và hậu quả; nếu giữ escape chuyển thể phải đặt tên/mô tả khác. Không gọi escape hiện tại là đúng nguyên tác |
| TR-2 | Kit boss theo mốc/nhánh đồng ý; ID hồ sơ và trạng thái mất tay/cổ chưa nối campaign | Tách lần đầu, Thanh Thư, ch.166, ch.190; đọc nhánh thực tế. Bạch Ngọc không mặc định thuộc BNB; Băng Trùy có nguồn ở ch.166 nên không xóa toàn Q1 |
| TR-3 | Người chơi chọn đánh sớm có thể thắng khó; chưa chốt hậu quả VN | Chốt thắng là ép lui/gục/chết/loot; không cho loot mặc định phá các mốc sau. Quyết định đưa trận ch.166 thành scene riêng hay chỉ giữ hồ sơ tham chiếu |
| TR-4 | Sương Yêu tự hủy và tay phải: ch.139–140 vs một dòng ch.143 có mâu thuẫn văn bản; tiên xà chưa luyện hóa | Ghi provenance khi chốt state; không tự khôi phục cổ đã chết, không cho tiên xà thành skill button. Các hộ thể nội tại như Băng Cơ cần tách khỏi buff bật/upkeep |
| AI-1 | Cả hai muốn chống thả diều; pressure pilot chỉ giảm nhẹ tỷ lệ bot né, vẫn 85–88% | Chơi thử người thật; đo cơ hội trúng, ép biên, tiết kiệm. Chốt thay gì ở AI/chi phí/tầm sau đối chứng, không bí mật buff damage/speed để gọi AI khôn hơn |
| MAP-1 | 1200×260 toàn màn đã triển khai. 1400/camera/zoom/obstacles chưa chọn | Giữ bước1200; chỉ mở camera khi thử mobile thấy quá nhỏ/chậm. Cần inverse projection, chỉ báo offscreen và luật vật chắn/đạn/pathfinding trước thêm đá chắn |
| FX-1 | Đồng ý schema gọn + hid ở pilot, registry đầy đủ/pool/nhiều actor để sau | Chốt event/anchor cho summon, channel, DOT có cadence và đường FX chuyển động theo đúng contact; không dùng animation callback gây damage |

## 2. Đã đồng ý hướng — đang chờ dữ liệu hoặc nghiệm thu

Không phải bất đồng; chưa được coi là hoàn thành hoặc có thể áp mọi asset ngay.

| ID | Việc | Cần cung cấp / review tiếp |
|---|---|---|
| AS-1 | Roster mới | Blue đã kiểm 40 ID / 291 clip / 627 frame: cấu trúc đạt, còn lỗi identity/palette, anchor, hover và clip thiếu. [Review từng actor + ảnh đối chiếu](../../previews/roster-validation-v01/README.md). Chưa duyệt cả bộ; chốt design trước gen lại |
| AS-2 | Pilot Phương Chính/Heo rừng | Chốt kit từ data + truyện/nhánh, clip fallback/release. PN vẫn dùng inventory. Utility/profile phải khác caster/thú lao và test hướng húc không đổi sau commit |
| AS-3 | Rết/tay/impact băng | Generate Muse từ prompt FX, alpha hoặc #FF00FF; rect/pivot/timing thực. Import mặc định review, chỉ `--approve` sau duyệt. Chưa có asset cuối |
| AS-4 | Bốn âm CC0 pilot | Nghe punch/jade/ice/gold trên loa/tai nghe/mobile, chỉnh gain/tone. Nguồn Kenney và license đã lưu; wind/saw/grab/water/storm hiện vẫn synth. Chưa gọi bộ âm hoàn tất |
| AS-5 | Campaign adapter | Dùng save/inventory PN, kit boss theo thời kỳ, nguyên/chất lượng, reward/loot và save cũ; test không cấp/tước/nhân đôi cổ/tài nguyên |
| AS-6 | Thiết bị thật và KO roster | Chrome giả lập đã đạt PN/BNB. Lề127 chỉ đo PN/BNB; thú lớn và KO dài cần lề/viewport mới theo asset, không thu nhỏ từng pose |
| AS-7 | Performance / nhiều địch | Đo số FX/voice/frame time ở mobile thật; pooling và multi-actor/summon sau khi cảnh cần. Hiện giữ1v1, tối đa8voice |

## 3. Thứ tự tiếp theo đề nghị

1. Orange review code/tool/âm pilot trong bản đồng thuận, cùng hai báo cáo bench. Không sửa đồng thời phí, HP, sân và AI.
2. Theo review roster, sửa palette Phương Chính và dùng Heo rừng làm pilot; chốt kit/clip và anchor trước tích hợp.
3. Chốt CN-1…5 + TR-1…3; chạy đối chứng resource rồi mới thử giảm khóa chung.
4. Nhập/duyệt ba FX, nghe bộ âm, test điện thoại thật.
5. Nối campaign theo inventory/nhánh và kiểm save; camera/multi-enemy theo dữ liệu playtest.

Màu áo/tóc/phụ kiện chưa có nguồn có thể ghi thiết kế mỹ thuật; danh tính, cơ chế, sở hữu cổ, mốc truyện/nhánh phải có căn cứ. Giữ cách đánh theo năng lực thật, không dùng chưởng/cast bắt buộc cho mọi nhân vật.

## 4. Orange-kun bổ sung (02/10/2026)

- **AI-1:** bot `move` thắng chủ yếu nhờ né rồi đánh trả (đánh tay 152 + Cự Xỉ 110 sát thương/trận; Nguyệt Mang chỉ 33), không phải bắn xa. Với bot phản xạ 0,25–0,35s, tỉ lệ thắng còn 39–55%. Chi tiết ở `BATTLE_E_DONG_THUAN_VA_TRIEN_KHAI.md` §7.3. Đề nghị đổi điều kiện chốt AI-1: bench thêm bot `human` (0,3s) trước khi đổi chi phí/AI. Ưu tiên người chơi thật.
- **TR-2 thêm:** ch.134 ghi BNB lúc áp chế “tốc độ hơi nhanh hơn PN một chút, chân nguyên càng nhiều hơn”. Kit sandbox đang ngược (PN 265 > BNB 235, cùng bể 100). Lam Điểu Băng Quan (ch.136, đạn tự đuổi) thuộc hồ sơ trận đầu.
- **AS-1:** `assets/chibi_kp/index.json`, 38 thư mục nhân vật mới và `roster_preview.html` là do Orange-kun nhập từ zip người dùng gửi. Importer đổi sang chuẩn hóa theo diện tích thân so với PN × `SIZE[id]` và tự cắt khung theo từng id. **Chưa clip nào được `--approve`.** Đã biết cần gen lại: Phương Chính 5 clip sai màu áo (ảnh gốc áo xanh lục), Phi Tượng cả bộ (ch.277 phủ lông chim, thiếu `hit`), Thiết Huyết Lãnh `ko`. Prompt nằm trong `PROMPT_MUSE_ROSTER.md`.
- **FX-1 thêm:** `fx_import.py` cần xóa key màu theo ngưỡng + flood fill từ mép và khử ám hồng ở viền, vì ảnh Muse không cho ra màu key chính xác.

## Blue-chan — hoàn tất review asset 02/10/2026

Đã mở trang roster và xem toàn bộ frame của **40 ID**, không phải 39. Không thay asset hoặc tự approve. Kết quả và danh sách sửa/gen lại nằm trong [review roster](../../previews/roster-validation-v01/README.md), có ảnh từng actor kèm reference. 13 bộ lệch design đáng kể cần gen lại **nếu giữ reference hiện hành**; không tự coi màu áo/tóc khác là sai nguyên tác. Hai lỗi nguồn ưu tiên là palette Phương Chính và dao tự thêm ở `co_kim_sinh/atk`. Các lỗi điểm tay/sàn của pose bay phải sửa pipeline, không bắt AI gen để che. Viewer đã sửa sprite đè nhau, dải frame bị cắt và race khi đổi actor nhanh.

## 5. Đã chốt ngày 02/10/2026 (người dùng chọn)

TR-1 (Sương Yêu theo truyện + nổ tay chuyển pha), CN-1/CN-4 (PN hồi 0; BNB 130/0,8/275), CN-5 (0,15s miễn phí rồi 25%), TR-3 (ép rút lui). Đã triển khai, xem `BATTLE_E_DONG_THUAN_VA_TRIEN_KHAI.md` §8. Các dòng tương ứng ở §1 không còn mở.

**Còn mở:** CN-2 (nguyên thạch trong trận: v1 giữa cảnh, chưa code), CN-3 (đơn vị save), CN-6 (thử khóa chung 1s/0s, giờ đã đủ điều kiện đo vì chân nguyên đã khan), TR-2 phần nối campaign, TR-3 trận ch.166 thành màn riêng hay không, AI-1 (chơi thật), MAP-1, FX-1, AS-1…7.

## Blue-chan — review chuyển pha sau mục 5

Đã kiểm cảnh nổ tay của Orange-kun và sửa 2 lỗi Cường Thủ/armor trong simulation; xem [mục 9 hiện trạng](BATTLE_E_DONG_THUAN_VA_TRIEN_KHAI.md#9-blue-chan-review-bản-chuyển-pha-của-orange-kun-02102026). Không đổi thông số cân bằng. Bổ sung vào AS-1: cần sprite BNB một tay theo state/nhánh, hiện `oneArm` chỉ là dữ liệu và sprite vẫn đủ tay. Các dòng CN-1/CN-4/CN-5/TR-1/TR-3 ở mục 1 là lịch sử trước quyết định mục 5, không dùng để kết luận runtime còn chưa triển khai.
