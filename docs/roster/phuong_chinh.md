# phuong_chinh: Cổ Nguyệt Phương Chính

> Cập nhật sau review base v03 của Orange (03/10/2026): giữ bản đã được chấp nhận về danh tính. Khi import phải giữ Phương Chính gầy và thấp hơn PN một chút theo ch.2. `SIZE=0,95` dưới đây là đề xuất art, không phải con số nguyên tác. Mắt hơi xanh là ghi chú không chặn; mẫu màu mục tiêu vẫn là xám đậm như PN. Palette/ảnh reference ở phần G1 bên dưới là lịch sử pilot; base v03 hiện hành tra `previews/roster-base-v03/catalog.json`.

G1 — Blue, 03/10/2026. Hồ sơ pilot **chờ Orange validate**, chưa duyệt art/base. Đọc nội dung cache JSON bản Việt; provenance/hash trong `SOURCE_AUDIT.json`. Không dùng số chương của ghi chú cũ để thay văn bản.

| Trường | Giá trị | Căn cứ |
|---|---|---|
| Tên Việt / Hán / Anh | Cổ Nguyệt Phương Chính / tên Hán chưa kiểm / Fang Zheng là alias tìm kiếm cần kiểm | VN ch.2, ch.98 xác nhận tên Việt |
| Nhóm | đối thủ người | game |
| Thời kỳ dùng | Pilot tại VN ch.98, sau lên nhị chuyển, trước hợp luyện thành công trong cảnh này | [VN ch.98](https://cochannhann.pages.dev/api/chapters/98) |
| Giới tính/tuổi/vóc dáng | em trai song sinh PN; lứa 15 tuổi lúc khai khiếu; gầy, thấp hơn PN một chút, mặt giống PN | VN ch.2, ch.4 |
| Tu vi | nhị chuyển, cổ đang sở hữu vẫn nhất chuyển | VN ch.98 |
| Lưu phái | không gán tên lưu phái chính thức từ hai cổ | chưa xác minh |
| Vũ khí | pilot tay không; không tự thêm kiếm/dao | art/game; chưa thấy vũ khí trong đoạn đã đọc |
| Bay | không thêm bay cho pilot | art/game, không phải chứng minh mọi thời kỳ không bay |
| SIZE | 0,95 so PN, giữ khuôn mặt song sinh và thân gầy | art dựa mô tả thấp hơn một chút ch.2 |

## Ngoại hình theo truyện

VN ch.2 xác nhận Phương Chính là thiếu niên gầy, thấp hơn PN và mặt giống ca ca. Ch.4 đặt nhóm thiếu niên ở tuổi 15. Không dùng kiểu tóc khác hẳn để phân biệt hai người; dùng biểu cảm và áo.

## Ảnh tham khảo trên mạng

Chưa chọn ảnh. Không dùng ref v1 hoặc ảnh trưởng thành Q2 để làm mẫu Q1.

## Phần thiết kế tự do (`art`)

Đề xuất tóc đen cùng cách tạo mặt PN, nét nghiêm túc còn non trẻ; áo luyện tập xanh, không băng trán. Chờ người dùng chọn: da #F2D5C7, tóc #24242C, áo #3F7D4E, áo phụ #254735, viền #171820. Palette là quyết định mỹ thuật, không tuyên bố áo xanh được truyện xác nhận.

## Cổ trùng / năng lực theo mốc trận

| Cổ | Chuyển | Có/mất ở mốc | Tác dụng đã kiểm | Căn cứ | Dùng battle? |
|---|---|---|---|---|---|
| Nguyệt Quang | nhất | sở hữu tại ch.98 | nguyên liệu hợp luyện, cổ chiến đấu; chi tiết đòn/chi phí cần đọc thêm | VN ch.98 | proj đề xuất, chưa chốt số |
| Ngọc Bì | nhất | sở hữu và dùng ch.76; còn tại ch.98 | phòng ngự, không chặn được đòn Vương Đại trong cảnh ch.76 | VN ch.76, ch.98 | buff đề xuất |
| Bảo Nguyệt Quang Vương | ngũ theo bí phương | **chỉ là đích hợp luyện**, không sở hữu | tộc trưởng giảng lộ trình | VN ch.98 | không cấp |
| Toàn Lực Ứng Phó | chưa xác minh cho PC | tên gần PC trong chỉ mục không chứng minh sở hữu | không kết luận | cần kiểm đoạn Q2 | không cấp |

Ch.98 còn mô tả lần thử hợp luyện thất bại. Không cấp Nguyệt Mang hoặc Bạch Ngọc cho PC ở pilot chỉ vì PN có chúng.

## Bộ animation

| clip | Loại | Cơ chế | Pose | Anchor |
|---|---|---|---|---|
| idle/move/hit/ko/win | chung | trạng thái | 2/2/2/3/1 | body/contact khi cần |
| atk | chung | đánh tay chuyển thể | lấy đà–đấm–thu | hand F02 |
| sk_nguyetquang | đặc trưng | phóng từ tay | vận–phát–thu | hand F02 |
| sk_ngocbi | đặc trưng | hộ thể | tập trung–giữ thế | body F02; glow thuộc FX |

## Kit battle đề xuất

`boss_profile=phuong_chinh_q1_ch98`, `visual_id=phuong_chinh`, `visual_state=normal`. Nguyệt Quang `kind=proj`, Ngọc Bì `kind=buff`; đánh tay `kind=melee` ghi game. Startup/active/recovery/cd/cost/dmg chưa chốt. Tư chất Giáp đẳng không suy thành regen mỗi giây trong trận; ch.10 mô tả hồi theo giờ.

## Điểm mở cần người dùng chốt

Palette, biểu cảm, profile cảnh thật có chọn ch.98 hay mốc khác. G1 chưa đóng; chưa có prompt/base cuối.

## Validate (Orange, 03/10/2026) — G1 đạt, chờ người dùng chốt art

Đã mở VN ch.2, 4, 76, 98.

**Đúng:**
- ch.2: “dáng người gầy gò, thấp hơn một chút so với Phương Nguyên, khuôn mặt lại giống hệt hắn”.
- ch.98: tộc trưởng nói “Phương Chính, ngươi đã sớm là nhị chuyển nhưng cổ trùng trong tay lại chỉ là nhất chuyển”; PC có một Ngọc Bì và một Nguyệt Quang; Bảo Nguyệt Quang Vương là đích của bí phương ngũ chuyển, không sở hữu. Lần hợp luyện đầu thất bại vì quên duy trì dung hợp ý thức; Nguyệt Quang có vết rạn, Ngọc Bì ủ rũ.
- ch.76: PC hô Ngọc Bì, da hóa ngọc, vẫn không chặn được móng tay Vương Đại vì chỉ là cổ nhất chuyển.
- Không cấp Toàn Lực Ứng Phó hay Bạch Ngọc: đúng.

**Ghi chú:** ch.98 cùng chương có câu “nhị chuyển nhưng cổ đều nhất chuyển” nói về **PN**. Hồ sơ PC dẫn đúng câu của tộc trưởng nói với PC, nên không nhầm. Khi trích nên ghi rõ câu nào để người sau khỏi lẫn.

**Bổ sung cho kit:** ch.98 cho thấy cả PN và PC đều là cổ sư nhị chuyển dùng cổ nhất chuyển. Đây là căn cứ cho chân nguyên xích thiết dùng cổ thanh đồng, liên quan CN-3 (chất lượng chân nguyên). Phí cổ nhất chuyển với người nhị chuyển nên rẻ tương đối.

Không còn lỗi canon. Chờ người dùng chốt palette (áo xanh là `art`) và mốc profile.

## Kit battle (Orange đọc thay Blue, 03/10/2026, bước B1)

Profile: `phuong_chinh_ch83` · cặp đấu: mac_bac_ch83, xich_thanh_ch83 (VN ch.83); pn_ch84 (VN ch.84). Số liệu là game.

| Cổ / đòn | owner | evidence_chapter | available_at | Trích ngắn / tóm ý | Cơ chế trong kit |
|---|---|---|---|---|---|
| Nguyệt Quang | PC | VN ch.83–84 | có từ khai khiếu | áp sát còn sáu thước rồi mới bắn | `proj` (GU_SKILL) |
| Ngọc Bì | PC | VN ch.76, 98; ch.84 | có trước ch.84 | ch.84 hoảng loạn nên không nhớ tới Ngọc Bì | `buff` red 0,5 |
| Lộn người (thân pháp) | PC | VN ch.83 | — | lộn người về phía trước, nguyệt nhận lướt qua | `dash` dist 120 |

- Nhị chuyển ở ch.83; tư chất Giáp (số 88 là game). Thắng Mạc Bắc, Xích Thành (ch.83), thua PN (ch.84).
- AI giữ khoảng cách gần (stand 150) theo chiến thuật sáu thước.
