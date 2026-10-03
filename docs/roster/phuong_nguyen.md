# phuong_nguyen: Cổ Nguyệt Phương Nguyên

G1 — Blue, 03/10/2026. Hồ sơ pilot, không phải danh sách đầy đủ inventory Q1/Q2. Cache bản Việt và hash tại `SOURCE_AUDIT.json`; chờ Orange validate.

| Trường | Giá trị | Căn cứ |
|---|---|---|
| Tên Việt/Hán/Anh | Cổ Nguyệt Phương Nguyên / chưa kiểm / Fang Yuan là alias tìm kiếm cần kiểm | VN ch.1–2 |
| Nhóm/thời kỳ | người chơi Q1, thiết kế thiếu niên; kit đọc save từng mốc | VN ch.2, ch.4; yêu cầu người dùng |
| Giới tính/tuổi/vóc dáng | ca ca song sinh Phương Chính, lứa 15 tuổi; cao hơn em một chút | VN ch.2, ch.4 |
| Tu vi | mới khai khiếu nhất chuyển ch.6; các mốc sau riêng, không khóa ở một rank | VN ch.6 |
| Tư chất | Bính đẳng, bể 44% lúc khai khiếu | VN ch.6 |
| Lưu phái | không dùng nhãn lực đạo Q2 để mô tả toàn bộ Q1 | chờ hồ sơ Q2 riêng |
| Vũ khí | base tay không; vật thể từ cổ chọn riêng theo inventory/clip | art/game |
| Bay | Lôi Dực được chọn ở ch.155, không mặc định có từ đầu | VN ch.155 |
| SIZE | 1,0 là chuẩn người trong style bible | art |

## Ngoại hình theo truyện

Ch.2 có quan hệ song sinh và mặt giống nhau; ch.4 xác nhận tuổi nhóm khai khiếu. Không tìm được căn cứ tóc đen dài/áo đen trong các đoạn đã kiểm: giữ chúng ở mục art, không ghi thành ngoại hình canon chắc chắn. Ch.1–2 thể hiện kinh nghiệm và sự lạnh lùng của PN; không tự thêm biểu cảm cười nhếch mọi pose.

## Ảnh tham khảo trên mạng

Chưa chọn; không dùng ref v1 làm style mẫu. Bản có hình trưởng thành phải ghi rõ khác tuổi/mốc.

## Phần thiết kế tự do (`art`)

Đề xuất tóc đen dài, áo đen than thắt đai, giày tối, mặt bình tĩnh. Palette: da #F2D5C7, tóc #24242C, áo #303039, bóng áo #202028, viền #131318. Tóc/áo là art chờ duyệt, cùng cấu trúc mặt PC.

## Cổ trùng / năng lực theo mốc trận

| Cổ/năng lực | Chuyển | Có/mất ở mốc | Tác dụng đã đọc | Căn cứ | Battle? |
|---|---|---|---|---|---|
| Nguyệt Quang + Tiểu Quang | cần kiểm đủ rank/count inventory | được dùng khi săn lợn | Tiểu Quang hỗ trợ nguyệt nhận tăng cỡ/công | VN ch.70 | projectile, theo save |
| Bạch Thỉ | nhất theo ngữ cảnh Q1, cần đối chiếu chương thu | còn dùng ch.70; bị tiêu hao khi hợp luyện Bạch Ngọc | tăng lực giữ lại trong thân, không nút đấm phép | VN ch.70, ch.100 | passive, không clip riêng |
| Bạch Ngọc | nhị | đã hợp luyện thành công ch.100 | phòng ngự cần liên tục rót nguyên, chịu công càng nhiều càng hao | VN ch.100 | buff/upkeep đề xuất, chỉ khi inventory có |
| Cường Thủ | nhị | luyện hóa lúc BNB ném ra ch.138; đoạt cổ ch.143 | đứng yên duy trì, đoạt cổ; có thể thất bại/cắn trả | VN ch.131, ch.138, ch.143 | channel riêng cần thiết kế; **grab kéo người của demo là game**, không canon |
| Thiên Bồng | tam | có tại ch.155 | hợp luyện Bạch Ngọc + cổ phòng ngự nước | VN ch.155 | buff nếu save có, không giữ Bạch Ngọc đã tiêu hao như hai bản độc lập |
| Lôi Dực | tam theo đoạn ch.155 | PN chọn từ gia tộc | bổ trợ di động | VN ch.155 | movement/flight, clip riêng chỉ khi có |
| Nguyệt Mang/Cự Xỉ và cổ còn lại | chưa đóng hồ sơ | cần mở đúng chương thu/mất | không copy số chương kit demo | chờ kiểm bổ sung | không tự cấp |

Bảng này **không loại cổ khỏi inventory người chơi**. Nó ghi những gì đã kiểm trong lượt pilot, không phải whitelist campaign.

## Bộ animation

Chung: idle 2, move 2, hit 2, guard 2, heal 2, dodge 2, ko 3, win 1. Atk 3 là đòn thường theo lực thực ở mốc. Clip phóng nguyệt có hand F02; hộ thể body; Cường Thủ channel cần tư thế đứng tập trung và contact theo thiết kế, không dùng hoạt họa giật đối thủ để gọi là đúng truyện. Lôi Dực cần profile/clip riêng sau mốc thu. Không bake đạn/giáp/rết/hạt vào actor.

## Kit battle đề xuất

Không có bộ PN cố định. Adapter dựng skill từ inventory, rank, quality và story state. Mỗi `src` đánh dấu canon/game; các số startup/cost/dmg chờ bench. Thông tin ch.100 cho thấy shield cần upkeep và phí theo đòn nhận: đây là đề xuất review cân bằng, lượt dossier này không đổi runtime Thiên Bồng đã được người dùng chốt.

## Điểm mở cần người dùng chốt

Art tóc/áo và gương mặt, mốc pilot battle cụ thể; Orange kiểm các nguồn/cache. Chưa chứng nhận toàn bộ cổ PN Q1/Q2 hoặc duyệt base.

## Validate (Orange, 03/10/2026) — G1 chưa đóng

Đã mở lại bản Việt VN ch.2, 4, 6, 10, 70, 79, 80, 98, 100, 131, 138, 143, 155 (cache + API live trả 200 lúc kiểm).

**Đúng:**
- ch.2: song sinh, mặt giống hệt. ch.4: nhóm thiếu niên mười lăm tuổi. ch.6: khai khiếu, nguyên hải bốn thành bốn, cực hạn Bính đẳng.
- ch.70: PN dùng Nguyệt Quang + Tiểu Quang khi săn lợn. Bạch Thỉ có ở ch.70.
- ch.100: Bạch Ngọc giống Ngọc Bì, “cần liên tục rót chân nguyên, thừa nhận công kích càng nhiều tiêu hao càng mạnh”. Trích đúng.
- ch.131: Cường Thủ (của Hùng Chiên) cưỡng ép bắt cổ trên người địch, “cần duy trì liên tục, không thể nhúc nhích”. ch.138: PN bắt được con BNB ném ra và luyện hóa ngay. ch.143: đoạt 3 cổ. Nhận định “grab kéo người của demo là game” đúng.
- ch.155: Thiên Bồng tam chuyển, gia tộc thưởng Lôi Dực. Không thấy chỗ nào gọi tóc/áo đen là canon: giữ ở `art` là đúng.

**Lỗi / thiếu cần sửa:**
1. **Thiếu Ngọc Bì cổ.** ch.79 PN lấy Ngọc Bì từ trong hoa và luyện hóa (tả hình: như con rệp, dẹp rộng, thân lục nhạt, quầng xanh ngọc). ch.80 PN dùng Ngọc Bì đỡ cú húc của lợn rừng bằng vai. Cần thêm một dòng nhất chuyển, có từ ch.79, mất khi hợp luyện Bạch Ngọc.
2. **Inventory ch.98 ghi rõ, nên đưa vào nguyên văn:** “bảy con cổ trùng: Xuân Thu Thiền, Nguyệt Quang, Tửu Trùng, Bạch Thỉ, Ngọc Bì cùng hai con Tiểu Quang”. Cùng đoạn: Nguyệt Quang + hai Tiểu Quang → **Nguyệt Mang** (nhị chuyển); Bạch Thỉ + Ngọc Bì → **Bạch Ngọc**. Hồ sơ đang ghi “Tiểu Quang… cần kiểm count” và “Nguyệt Mang chưa đóng”: cả hai đã có căn cứ ở ch.98. Còn phải mở chương hợp luyện Nguyệt Mang thành công để ghi mốc “có từ”.
3. **Thiếu Tửu Trùng** (ch.70, ch.98): bị động, tinh luyện chân nguyên. Không có clip, nhưng ảnh hưởng chất lượng chân nguyên (CN-3), nên phải có dòng.
4. Xuân Thu Thiền: ghi là bản mệnh, không dùng trong battle, để adapter không cấp nhầm thành skill.
5. Đề xuất bổ sung cho clip `atk`: ch.100 tả PN phản công bằng “quyền đấm cước đá” sau khi có Bạch Ngọc. Đây là căn cứ cho đòn tay/chân, khớp kit đấm nhanh hiện tại.

**Chờ người dùng:** art tóc/áo; mốc pilot (đề xuất ch.100–138: có Bạch Ngọc + Nguyệt Mang, chưa có Cường Thủ).

## Preset sandbox theo cảnh (Orange, 03/10/2026, bước B1)

Campaign dựng bộ chiêu từ save (`SB_GU.pnKitFromSave`). Các preset dưới đây là **save giả theo truyện**, đi qua cùng adapter đó; chỉ dùng trong sandbox khi không có save.

| Preset | Cảnh | Tu vi | Cổ | Nguồn |
|---|---|---|---|---|
| `pn_ch70` | đấu lợn rừng | Nhất chuyển cao giai | Xuân Thu Thiền, Tửu Trùng, Nguyệt Quang, Tiểu Quang | VN ch.70: năm cổ, Bạch Thỉ chưa dùng, chưa có cổ phòng ngự |
| `pn_ch79` | đấu Thạch Hầu | Nhất chuyển (đỉnh phong là game) | + Bạch Thỉ (đã dùng ch.70–71), Ngọc Bì | VN ch.63, 79–80 |
| `pn_ch84` | đấu Phương Chính | Nhị chuyển sơ giai | như ch.79 (sáu cổ, ch.82) | VN ch.81–84 |
| `pn_ch130` | đấu bầy điện lang | Nhị chuyển trung giai | Tứ Vị, Nguyệt Mang, Bạch Ngọc, Bạch Thỉ, Hắc Thỉ, Ẩn Lân, Cửu Diệp | VN ch.102, 105, 106, 130 |

Chú ý:
- Nguyệt Mang (ch.106) hợp luyện từ Nguyệt Quang và hai Tiểu Quang, nên `pn_ch130` không còn hai cổ đó.
- Bạch Ngọc thay Ngọc Bì.
- Hắc Thỉ đem đổi lấy Ngư Lân ở ch.127, nhưng ch.130 vẫn tả "sức mạnh hai trư". Tạm giữ `hacthi` để có lực, cần xác minh lại.
- `pn_demo` (kit cũ) giữ cho regression, không gắn cảnh.
- Tửu Trùng / Tứ Vị (`pow`, tăng uy lực chiêu) chưa áp vào adapter.
