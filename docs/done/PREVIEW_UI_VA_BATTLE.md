# Preview UI và battle đã triển khai

Ngày gom tài liệu: 02/10/2026.

P-01/P-02/P-03, P-05 đợt asset hiện có và lõi BATTLE-01/02 đã có preview. P-04, art còn thiếu và BATTLE-03…06 không được đánh dấu done.

## Mục lục
- [PN — thử idle/run cắt lớp bằng code](#pn-puppet-v01)
- [ui-polish-p01](#source-previews-ui-polish-p01-readme-md)
- [ui-polish-p02](#source-previews-ui-polish-p02-readme-md)
- [ui-polish-p03](#source-previews-ui-polish-p03-readme-md)
- [ui-polish-p05](#source-previews-ui-polish-p05-readme-md)
- [battle-b01-b02](#source-previews-battle-b01-b02-readme-md)

---

<a id="pn-puppet-v01"></a>

## PN — Preview idle/run cắt lớp bằng code, 02/10/2026

**Đã bị người dùng loại sau khi review. Không tiếp tục hướng puppet hoặc tích hợp vào battle.** Giữ preview làm lịch sử; hướng thay thế là [animation frame V2](../prompts/PROMPT_FRAME_IDLE_RUN_PN_V2.md). Done ở đây chỉ ghi nhận đã làm preview, không phải nghiệm thu chất lượng.

Đã làm [preview tương tác](../../previews/pn-puppet-v01/index.html), [GIF idle](../../previews/pn-puppet-v01/pn_idle_preview.gif) và [GIF run](../../previews/pn-puppet-v01/pn_run_preview.gif). Chạy server tại gốc repo rồi mở `/previews/pn-puppet-v01/`; có idle/run, tạm dừng, đổi hướng, tốc độ, biên độ và nền sáng/tối. Canvas dùng các lớp PNG hiện có và chuyển động theo thời gian, không dùng dịch vụ generate hoặc save game.

**Done chỉ cho preview code; chất lượng animation chưa duyệt để đưa vào battle.** Các lớp chân mới có phần giày, không có gối; tay/áo chưa tách đủ. Mặt giữ cùng texture, idle chân cố định và chuyển trạng thái được blend; run vẫn có giới hạn của cutout. Phần tay dính trong torso được loại khỏi bản ghép bằng mask runtime, giữ nguyên asset nguồn.

Chrome desktop/mobile 390px tải đủ bảy lớp, không lỗi JS/tràn ngang; đã chụp ảnh trong thư mục preview. GIF idle 56 frame × 50ms; run 36 frame × 30ms được lấy mẫu từ renderer liên tục, không phải AI tạo thêm pose. Chi tiết tại [metadata](../../previews/pn-puppet-v01/preview_metadata.json).

---

<a id="source-previews-ui-polish-p01-readme-md"></a>

## ui-polish-p01

**Ảnh và fixture:** [previews/ui-polish-p01/](../../previews/ui-polish-p01/)

**Trạng thái:** Đã có runtime/ảnh preview của phạm vi này; phần còn thiếu ghi bên dưới vẫn thuộc backlog.

<a id="source-previews-ui-polish-p01-readme-md-ui-polish-p-01--preview-runtime"></a>
## UI polish P-01 — preview runtime

Ảnh được chụp trực tiếp từ `index.html` qua web server cục bộ, cùng state thử Q1. Đây là khung game thật, không phải mockup `ui-v2`.

| Màn | Trước | Sau |
|---|---|---|
| Bản đồ · 1440×900 | [before-map-1440x900.png](../../previews/ui-polish-p01/before-map-1440x900.png) | [after-map-1440x900.png](../../previews/ui-polish-p01/after-map-1440x900.png) |
| Sự kiện · 1440×900 | [before-event-1440x900.png](../../previews/ui-polish-p01/before-event-1440x900.png) | [after-event-1440x900.png](../../previews/ui-polish-p01/after-event-1440x900.png) |
| Bản đồ · 390×844 | — | [after-map-390x844.png](../../previews/ui-polish-p01/after-map-390x844.png) |
| Sự kiện · 390×844 | — | [after-event-390x844.png](../../previews/ui-polish-p01/after-event-390x844.png) |

State chụp: Quyển 1, tuần 1, còn 3 việc; sự kiện mẫu `k_hd_hocngheo` đã phát hết hai dòng thoại đầu để hiện lựa chọn. Nội dung world modifier vẫn lấy từ seed runtime nên các chip bên trái có thể khác nhau giữa ảnh; phần cần so là map, event, portrait và choice.

Smoke test đã kiểm tra nền sáng/đêm đổi đúng theo lượt, pin và hành động tự do, dòng thoại hiện tại, phím số chọn lựa chọn, reduced motion và không tràn ngang ở viewport 390px.

---

<a id="source-previews-ui-polish-p02-readme-md"></a>

## ui-polish-p02

**Ảnh và fixture:** [previews/ui-polish-p02/](../../previews/ui-polish-p02/)

**Trạng thái:** Đã có runtime/ảnh preview của phạm vi này; phần còn thiếu ghi bên dưới vẫn thuộc backlog.

<a id="source-previews-ui-polish-p02-readme-md-ui-polish-p-02--hud-nhân-vật-và-timeline"></a>
## UI polish P-02 — HUD, nhân vật và timeline

Ảnh được chụp trực tiếp từ `index.html`, không qua mockup `ui-v2`.

| Trạng thái | Desktop | Mobile |
|---|---|---|
| Trước P-02 | [before-hud-1440x900.png](../../previews/ui-polish-p02/before-hud-1440x900.png) | [before-hud-390x844.png](../../previews/ui-polish-p02/before-hud-390x844.png) |
| Sau P-02 | [after-hud-1440x900.png](../../previews/ui-polish-p02/after-hud-1440x900.png) | [after-hud-390x844.png](../../previews/ui-polish-p02/after-hud-390x844.png) |
| Sau khi tài nguyên đổi | [after-hud-delta-1440x900.png](../../previews/ui-polish-p02/after-hud-delta-1440x900.png) | [after-hud-delta-390x844.png](../../previews/ui-polish-p02/after-hud-delta-390x844.png) |

Fixture delta: khí huyết −34, chân nguyên −12, nguyên thạch +20, tu vi +18, danh vọng +4 và một biến cố đang chờ. Mọi con số được tạo bằng cách thay đổi state thật rồi gọi `render()`; UI không dùng số minh họa hard-code.

Smoke test đã kiểm tra render đầu không hiện delta giả, độ dài và dấu của các thay đổi, trail trên thanh HP/chân nguyên, mốc timeline đang chờ, reduced motion, chiều cao HUD mobile và không tràn ngang ở 390px. Regression P-01 được chạy lại cùng lượt kiểm tra.

---

<a id="source-previews-ui-polish-p03-readme-md"></a>

## ui-polish-p03

**Ảnh và fixture:** [previews/ui-polish-p03/](../../previews/ui-polish-p03/)

**Trạng thái:** Đã có runtime/ảnh preview của phạm vi này; phần còn thiếu ghi bên dưới vẫn thuộc backlog.

<a id="source-previews-ui-polish-p03-readme-md-preview-p-03--cổ-trùng-và-tu-luyện"></a>
## Preview P-03 — Cổ trùng và tu luyện

Preview được chụp trực tiếp từ `index.html`, không dùng mock UI và không tạo game state thứ hai.

<a id="source-previews-ui-polish-p03-readme-md-bảng-so-sánh"></a>
### Bảng so sánh

| Khu vực | Trước P-03 | Sau P-03 |
|---|---|---|
| Kho Cổ | Tên, mô tả và độ bền nằm chung trong thẻ; phải đọc mô tả để biết công dụng | Có nhãn vai trò Công kích/Hộ thể/Trị liệu/Thụ động/Tiêu hao/Kỳ cổ và nhãn tình trạng độc lập |
| Cổ bị đói hoặc thương | Chủ yếu dựa vào pill đói và thanh độ bền | Nền/viền phản hồi theo tình trạng, vẫn giữ số đói và độ bền chính xác |
| Tu luyện | Các lựa chọn là trọng tâm, tiến độ/bình cảnh nằm trong chữ | Có khối tiến độ tu vi, banner bình cảnh và nút đột phá riêng khi engine cho phép |
| Luyện cổ | Nút bị khóa nhưng người chơi phải tự đối chiếu nguyên liệu | Mỗi công thức ghi chính xác vật phẩm còn thiếu hoặc báo `Đủ nguyên liệu` |
| Mobile | Công thức hai cột dễ bị chật | Công thức và cụm tỷ lệ/nút tự xếp một cột, không tràn ngang |

<a id="source-previews-ui-polish-p03-readme-md-ảnh-game-thật"></a>
### Ảnh game thật

- [after-gu-desktop.png](../../previews/ui-polish-p03/after-gu-desktop.png) — năm loại vai trò và hai tình trạng Cổ.
- [after-gu-mobile.png](../../previews/ui-polish-p03/after-gu-mobile.png) — kho Cổ ở viewport 390×844.
- [after-cultivation-desktop.png](../../previews/ui-polish-p03/after-cultivation-desktop.png) — tu vi đầy, đang ở bình cảnh chờ đột phá.
- [after-cultivation-mobile.png](../../previews/ui-polish-p03/after-cultivation-mobile.png) — cùng trạng thái trên mobile.
- [after-refining-desktop.png](../../previews/ui-polish-p03/after-refining-desktop.png) — công thức đủ/thiếu nguyên liệu lấy từ state thật.

<a id="source-previews-ui-polish-p03-readme-md-fixture-và-kiểm-tra"></a>
### Fixture và kiểm tra

- Cổ: Xuân Thu Thiền, Nguyệt Quang Cổ đang đói, Ngọc Bì Cổ trọng thương, Trị Liệu Cổ và Xá Lợi Cổ.
- Tu luyện: Nhất chuyển đỉnh phong, tu vi `130/130`, đủ điều kiện gọi resolver đột phá nhưng preview không bấm nút.
- Luyện cổ: tài nguyên và kho Cổ được đặt để có cả công thức đủ lẫn thiếu.
- Smoke test xác nhận render không sửa `S`, số recipe khớp `RECIPES`, trạng thái nút khớp `canRefine()`, mobile không tràn ngang và reduced motion tắt animation trạng thái.

---

<a id="source-previews-ui-polish-p05-readme-md"></a>

## ui-polish-p05

**Ảnh và fixture:** [previews/ui-polish-p05/](../../previews/ui-polish-p05/)

**Trạng thái:** Đã có runtime/ảnh preview của phạm vi này; phần còn thiếu ghi bên dưới vẫn thuộc backlog.

<a id="source-previews-ui-polish-p05-readme-md-preview-p-05--phủ-art-q1q2-đợt-dùng-asset-hiện-có"></a>
## Preview P-05 — Phủ art Q1/Q2, đợt dùng asset hiện có

Đợt này chỉ nối các asset đã có và đã xem trực tiếp vào đúng chapter/event. Không sinh thêm tranh và không thay layout game.

<a id="source-previews-ui-polish-p05-readme-md-mapping-đã-sửa"></a>
### Mapping đã sửa

| Vùng / sự kiện | Trước | Sau |
|---|---|---|
| Thương đội | Dùng nền Sơn trại | Dùng nền rừng/đường núi trung tính, tránh lẫn địa danh Q1 |
| Thương gia thành + Thiếu chủ | Dùng nền Sơn trại | `scene_shang_city.jpg` |
| Tam Xoa Sơn + Ngũ chuyển giáng lâm | Dùng nền rừng chung | `scene_tam_xoa_mountain.jpg` với ba cột truyền thừa |
| Thương Tâm Từ lần đầu xuất hiện | Mapping cũ trỏ tới ID không tồn tại `q2_td_cuu` | Sửa về event thật `q2_td_tamtu`, dùng `scene_kindness_shang.jpg` |
| Tới Thương Lượng / rời thành đi Tam Xoa | Nền chapter chung | Cảnh chuyển vùng Thương thành / Tam Xoa |
| Hồ Tiên mở | Nền tuyết chung | `scene_hutien_blessed.jpg` |
| Bạch Ngưng Băng phản bội | Nền băng chung | `scene_blood_skull_refine.jpg` |

<a id="source-previews-ui-polish-p05-readme-md-ảnh-game-thật"></a>
### Ảnh game thật

- [shang-city-desktop.png](../../previews/ui-polish-p05/shang-city-desktop.png), [shang-city-mobile.png](../../previews/ui-polish-p05/shang-city-mobile.png)
- [tam-xoa-desktop.png](../../previews/ui-polish-p05/tam-xoa-desktop.png), [tam-xoa-mobile.png](../../previews/ui-polish-p05/tam-xoa-mobile.png)

Các ảnh được chụp từ `index.html` ở state Quyển 2 thật. Smoke test đi qua năm chapter vừa đổi, xác nhận URL asset, số pin, tải ảnh minh họa sự kiện và không tràn ngang ở 390px.

<a id="source-previews-ui-polish-p05-readme-md-phần-art-còn-thiếu-asset-riêng"></a>
### Phần art còn thiếu asset riêng

- Thương đội hiện dùng cảnh rừng/đường núi chung.
- Địa linh Bá Quy và Điện luyện cổ vẫn dùng nền huyết động chung; các cao trào đã có minh họa event riêng.

Ba nền này nên được sản xuất ở đợt art sau, với bố cục dành chỗ cho pin hiện tại. Không dùng ảnh nhân vật cận cảnh làm nền bản đồ chỉ để tăng tỷ lệ phủ asset.

---

<a id="source-previews-battle-b01-b02-readme-md"></a>

## battle-b01-b02

**Ảnh và fixture:** [previews/battle-b01-b02/](../../previews/battle-b01-b02/)

**Trạng thái:** Đã có runtime/ảnh preview của phạm vi này; phần còn thiếu ghi bên dưới vẫn thuộc backlog.

<a id="source-previews-battle-b01-b02-readme-md-preview-battle-0102--đấu-trí-theo-lượt"></a>
## Preview BATTLE-01/02 — Đấu trí theo lượt

Preview được chụp từ trận Điện Lang Q1 thật trong `index.html`. Không dùng mock UI, không thay arena hiện tại và không dựa vào trang tactical preview của nhánh khác.

<a id="source-previews-battle-b01-b02-readme-md-bảng-so-sánh"></a>
### Bảng so sánh

| Khu vực | Theo lượt cũ | Lát cắt Đấu trí |
|---|---|---|
| Nhịp trận | Ý đồ và nút hành động có sẵn nhưng khó thấy ranh giới từng vòng | Có Vòng, phase chờ/giải quyết và khóa lệnh cho tới khi resolver hoàn tất |
| Ý đồ | Mô tả định tính trong con dấu | Card ý đồ báo mức nguy hiểm và khoảng sát thương cuối theo buff, cuồng nộ, hộ thể và giáp người chơi |
| Tài nguyên | Chân nguyên chỉ giảm trong trận | Ghi `hiện tại / trần tuần hoàn`, hồi +1 đầu vòng, không vượt lượng mang vào trận |
| Phòng thủ | Phụ thuộc cổ hộ thể | Có Thủ thế 0 chân nguyên, giảm 35% đòn trực tiếp và báo trước khoảng HP sẽ mất |
| Nguyên thạch | Hồi chân nguyên tới max | Tiêu một hành động, cộng 20 hiện tại và mở trần tuần hoàn thêm 20 |
| Kết quả | Phải đọc log để ghép diễn biến | Tóm tắt damage gây/nhận, chân nguyên đã tốn và sơ hở ngay trên battle |
| Reload | Không có phase riêng của vòng mới | Save giữa phase giải quyết tiếp tục đúng một lần; không nhân đôi hồi chân nguyên |

<a id="source-previews-battle-b01-b02-readme-md-ảnh-game-thật"></a>
### Ảnh game thật

- [intent-desktop.png](../../previews/battle-b01-b02/intent-desktop.png) — HUD vòng, chân nguyên và ý đồ trên desktop.
- [opening-desktop.png](../../previews/battle-b01-b02/opening-desktop.png) — cửa sổ sơ hở sau đòn nặng.
- [intent-mobile.png](../../previews/battle-b01-b02/intent-mobile.png) — ý đồ ở viewport 390×844.
- [opening-mobile.png](../../previews/battle-b01-b02/opening-mobile.png) — trạng thái sơ hở trên mobile.

<a id="source-previews-battle-b01-b02-readme-md-logic-đã-kiểm-tra"></a>
### Logic đã kiểm tra

- Hành động thiếu chân nguyên không tiêu vòng.
- Thủ thế vẫn cho địch đáp trả và giảm đòn 10 xuống 7.
- Mỗi vòng hồi đúng +1 một lần, kể cả reload giữa phase giải quyết.
- Hấp thu 5 nguyên thạch tăng đúng chân nguyên hiện tại và trần tuần hoàn.
- Đòn nặng mở một cửa sổ sơ hở; hành động công kích sau nhận ×1,3 sát thương rồi đóng cửa sổ.
- Forecast gọi cùng hàm damage với resolver và không làm hao hộ thể khi chỉ render UI.
- Không tràn ngang ở 390px; HUD đổi sang một cột và tôn trọng reduced motion.

<a id="source-previews-battle-b01-b02-readme-md-cân-bằng"></a>
### Cân bằng

Simulator đã có seed để so sánh. Với seed `20261001`, 120 chiến dịch × tối đa 6 kiếp:

| Mode | Thắng chiến dịch |
|---|---:|
| Theo lượt cổ điển | 31,7% |
| Đấu trí, hồi +1/vòng | 35,8% |
| Đấu trí, mốc cũ +4/+6/+8/+10 | 72,5% |

Vì vậy preview dùng +1 cố định. Mốc hồi cao chỉ quay lại khi BATTLE-03 có pattern và mục tiêu trận tạo đủ áp lực, đồng thời đã qua playtest người thật.

Cổng cuối trên 300 chiến dịch cùng seed cho mode Đấu trí +1 đạt **35,0%**, không có ca kẹt vòng lặp.

<a id="source-previews-battle-b01-b02-readme-md-phần-chưa-nhận-là-hoàn-thành"></a>
### Phần chưa nhận là hoàn thành

- Pattern riêng theo loại địch, phase boss và điều kiện phá thế đầy đủ thuộc BATTLE-03.
- Tutorial theo tình huống và forecast damage đầu ra cho toàn bộ cổ/sát chiêu còn thiếu.
- VFX ba nhịp riêng cho từng nhóm cổ và encounter cầm chân thuộc các PR sau.
