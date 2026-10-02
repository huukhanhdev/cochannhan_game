# Kế hoạch map battle pixel — Blue-chan

02/10/2026. Kế hoạch cho nền đấu trường phù hợp sprite key-pose PN/BNB và roster sau này. **Đã áp ảnh người dùng cung cấp vào sandbox để duyệt**, xem bàn giao bên dưới. Chưa nối map vào campaign. Orange-kun có thể dùng tài liệu này để review và tích hợp.

## Bàn giao Orange-kun — nền mẫu đã áp vào sandbox

Theo yêu cầu người dùng, Blue-chan đã dùng đúng `Downloads/q1_bamboo_clearing.png` (2048×1152), không generate lại hoặc sửa nội dung ảnh. Bản raw được sao chép vào `incoming_maps/q1_bamboo_clearing_v01/source.png` (đã được ignore); bản phục vụ sandbox ở `assets/battle_maps/q1_bamboo_clearing/background.png`.

**Cách tích hợp:**

- `map.json` cùng thư mục ghi kích thước source, viewport, phiên bản, crop, pixel sampling và bounds hiện có; trạng thái `sandbox_review`, chưa coi là bản đã nghiệm thu toàn roster.
- `battle_sandbox.html` tải metadata một lần lúc khởi tạo và đưa cho `SBView.mount`. JSON lỗi thì dùng nền tuyết cũ; ảnh mới lỗi thì renderer cũng thử ảnh fallback.
- `view.js` vẫn nhận được đường dẫn string cũ, thêm nhận object cấu hình nền. Không đổi canvas, vị trí spawn, scale actor hay luật simulation.
- Source 16:9 được **cover đồng tỷ lệ**, scale 0,46875: ảnh hiển thị 960×540, offset y=-55 trên viewport 960×430. Crop 55 px hiển thị mỗi phía (source y≈117,33…1034,67), giữ nguyên chiều ngang; không kéo giãn thành 2,23:1. Bản runtime vẫn là PNG gốc, chưa xuất file resize/crop riêng.
- Nền pixel dùng nearest, alpha=1, dim=0; bỏ dải tối phủ sàn cũ. Fallback tuyết vẫn giữ dim cũ. Ảnh pixel không tự tạo vật cản, parallax hoặc hiệu ứng thời tiết.
- `toWorld()` đã kiểm đủ bốn biên: world x=60…940, screen y=250…400 tương ứng z=0…240. Chạm trời, mép bên ngoài sân hoặc phần đất trang trí dưới y=400 không phát lệnh đi. **Thay quy tắc cũ có đệm 30 px phía trên đất**; chạm vào địch vẫn ưu tiên hitActor trước kiểm mặt đất.
- Metadata bounds/projection hiện ghi để đối chiếu, chưa là cấu hình động của view/sim. Không đổi riêng các giá trị trong JSON rồi coi là đã đổi hitbox/phép chiếu.

**Review của Blue-chan:** mặt sàn đọc rõ hơn nền tuyết; PN áo đen và BNB áo trắng đều thấy rõ, đạn nguyệt hiện rõ ở giữa. Hậu cảnh trúc vẫn khá nhiều texture; phần thân/tóc actor ở z thấp có thể hòa vào trúc, nên Orange-kun xem thêm trận ở hàng sau và các pose rộng. Đá lớn tập trung ở ven rừng; chưa thêm collision cho đá, cần xem thêm mép sau/hai bên để không có cảm giác đi xuyên đá. Chưa chứng minh mọi KO/thú lớn đều đủ margin; giữ cổng duyệt đó mở.

**Kiểm thử đã chạy:** hồi quy simulation đạt; Chrome desktop/mobile nhận chuột/chạm như cũ; VFX/audio và mute/volume chạy trên nền mới. Người dùng và Orange-kun cần duyệt trực tiếp `battle_sandbox.html`, đặc biệt chân ở z=0/240, các biên x, telegraph Lốc và pose KO. Chưa thử điện thoại thật.

Đã kiểm thêm scale/crop đúng 0,46875 và y=-55, tâm sàn quy đổi đúng world (500,120), bốn điểm ngoài sàn đều bị bỏ qua. Cố tình chặn tải ảnh rừng trúc: sandbox vẫn nạp texture tuyết fallback và tám ô chiêu, không lỗi JavaScript. Ba bản ảnh Download/raw/runtime có cùng SHA-256, xác nhận không sửa nội dung source.

Các mục kế hoạch dưới đây giữ để tiếp tục sản xuất; mô tả “hiện trạng” trong bảng mục 2 là baseline trước lần tích hợp này.

## 1. Mục tiêu và phạm vi bản đầu

Làm một map mẫu **bãi đất rừng trúc Thanh Mao**, đặt PN và BNB thật lên để duyệt góc nhìn, tỷ lệ và khả năng đọc trận. Sau khi mẫu đạt mới mở rộng bối cảnh. Không cần một map riêng cho mỗi nhân vật: chọn map theo địa điểm/sự kiện, nhân vật có thể dùng nhiều map.

Bản đầu là nền tĩnh với vùng di chuyển hình chữ nhật, không vật cản trong vùng đánh, không camera cuộn, không địa hình gây sát thương. Đây là lựa chọn triển khai bản đầu; vật cản và cơ chế địa hình có thể bổ sung sau bằng dữ liệu simulation riêng.

Dùng AI tạo ảnh nền là hướng sản xuất chính, dựa trên sprite thật đã duyệt. Không cần tải model video hoặc chạy animation nền trên máy. AI không tự tạo collision map chính xác; code quyết định vùng đi được, hitbox và vị trí chiêu.

## 2. Chuẩn dựa trên code đang có

Nguồn đọc: `js/sandbox/view.js`, `js/sandbox/sim.js`, `js/battle.js`. Tab `tactical_battle.js` là chế độ khác; mẫu ưu tiên sandbox E, chưa mặc định thay nền mọi chế độ.

| Thành phần | Hiện trạng | Quyết định cho mẫu |
|---|---|---|
| Canvas E | 960×430, tỷ lệ khoảng 2,23:1 | Bám tỷ lệ này; đề xuất source 1920×860, bản runtime 960×430. Kích thước AI xuất thực tế phải kiểm tra, không coi prompt là bảo đảm |
| Thế giới | x=60…940, z=0…240 | Giữ để thử mẫu; chưa đổi luật di chuyển/cân bằng |
| Phép chiếu | x màn hình=x×0,96; y chân=250+(z/240)×150 | Dải chân đang ở y=250…400, khoảng 58–93% chiều cao ảnh |
| Scale chiều sâu | 0,9…1,06, nhân scale sprite 1,12 | Giữ lúc so sánh nền để không nhầm lỗi tỷ lệ map với thay scale nhân vật |
| Nạp nền | Hiện dùng cover, crop giữa và phủ tối | Map mới cùng tỷ lệ sẽ tránh crop lệch. Thử bỏ/giảm lớp tối cũ cho map pixel; không phủ đen mạnh mặc định lên ảnh đã chỉnh palette |
| Input | `toWorld()` đổi tọa độ màn hình về x/z, hiện chỉ kiểm một ngưỡng y dưới | Cần cùng phép chiếu với renderer, kiểm đủ bốn biên vùng click hợp lệ; không để click hậu cảnh/ngoài sàn thành điểm đi |

Không generate một ảnh 16:9 rồi tự kéo giãn cho vừa 960×430. Nếu công cụ chỉ có tỷ lệ gần đúng, tạo dư margin và crop có kiểm soát trước khi đóng gói; không crop mất sàn. Bản runtime có thể được lấy từ source lớn bằng nearest-neighbor, nhưng vẫn cần kiểm mật độ pixel: ảnh lớn không tự có pixel style phù hợp.

## 3. Art direction và bố cục

- Nhân vật nhìn ngang, nền nhìn ngang với góc hơi cao để thấy một dải mặt đất; không dùng map top-down/isometric.
- Cây trúc, chân núi và đá xa ở hậu cảnh. Phần sàn đi được bắt đầu quanh 58% chiều cao, trải xuống khoảng 93%; để thêm phần đất trang trí tới mép dưới.
- Giữa sàn thoáng, ít texture mạnh. Không vẽ đá lớn, hố, ao hoặc thân cây vào vùng đi được nếu simulation chưa có vật cản.
- Giữ silhouette tóc/áo đen PN thấy rõ trên nền trung tính sáng vừa. BNB áo trắng cũng phải thấy rõ; tránh cả nền tối đen lẫn tuyết trắng phẳng hoàn toàn.
- Pixel sắc, bảng màu hạn chế, các cụm màu lớn hơn chi tiết sprite; tránh noise một pixel dày đặc, nét vẽ tranh mờ và ánh sáng cinematic quá mạnh.
- Không vẽ nhân vật, bóng nhân vật, HUD, lưới, vòng chiêu, đạn hoặc chỉ dẫn vào ảnh. Bóng chân, telegraph và VFX do code vẽ.
- Cùng góc chiếu giữa mọi map. Thay bối cảnh không được khiến nhân vật đứng như trên tường hoặc bay trên nền.

Mẫu: đất nâu xám và vài lá nhỏ; trúc xanh xám, núi xanh nhạt phía xa; ánh sáng ban ngày dịu. Màu cây/đá là diễn giải mỹ thuật. Địa điểm và thời kỳ phải khớp cảnh truyện được map vào, không tự thêm kiến trúc hoặc sự kiện đặc thù chưa có căn cứ.

## 4. Danh sách map ưu tiên

Đây là danh sách dự kiến, không phải yêu cầu gen cả batch ngay. Các khóa scene dưới đây là khóa hiện có trong `js/battle.js`; cần xét context sự kiện khi nối campaign, không chọn chỉ theo tên địch.

| Đợt | ID map dự kiến | Bối cảnh / scene | Điểm cần giữ |
|---|---|---|---|
| Mẫu | `q1_bamboo_clearing` | Rừng trúc Thanh Mao / `forest` | Sàn trống, đọc rõ PN đen và BNB trắng |
| Q1 tiếp | `q1_clan_courtyard` | Sân sơn trại / `village` | Nền sân và kiến trúc phía sau, không lấp đường đi |
| Q1 tiếp | `q1_wolf_tide` | Ngoài/tường trại khi lang triều / `tide` | Đêm và thời tiết vẫn thấy telegraph; tránh đồng nhất `tide` với bờ biển |
| Q1 tiếp | `q1_inheritance_cave` | Động phủ Hoa Tửu / `wine` | Nền đá, đủ ánh sáng; không vẽ vật phẩm có thể tương tác giả |
| Q1 tiếp | `q1_blood_cave` | Huyết động / `blood` | Màu đỏ tiết chế để không chìm báo nguy hiểm |
| Q1 biến cố | `q1_ice_aftermath`, `q1_burning_clan` | `snow`, `fire` | Chỉ dùng đúng giai đoạn biến cố; không mặc định Thanh Mao luôn phủ tuyết |
| Q2 sau | `q2_riverbank`, `q2_bone_mountain` | Hoàng Long, Bạch Cốt | Bờ sông/vách núi là hậu cảnh; không cho đi vào nước/vực chưa có luật |
| Q2 sau | `q2_shang_arena`, `q2_three_kings` | Thương gia, Tam Xoa | Kiến trúc và địa điểm theo tài liệu Q2; giữ cùng camera/sàn chuẩn |

## 5. Quy trình sản xuất và cổng duyệt

| Bước | Đầu ra | Điều kiện đi tiếp |
|---|---|---|
| MAP-01 | Layout sàn và reference sprite PN/BNB | Đúng canvas/phép chiếu E; có sprite thật để kiểm style |
| MAP-02 | Một ảnh nền mẫu và prompt đã dùng | Đúng góc, vùng đánh thoáng; lưu raw output, không ghi đè asset đang dùng |
| MAP-03 | Preview ghép nền với PN/BNB, có bật/tắt guide | Xem sprite ở trước/sau sàn, hai biên; kiểm idle, ra chiêu rộng, KO và VFX |
| MAP-04 | Ảnh runtime + metadata và viewer dùng thử | Người dùng duyệt hình; click-to-world khớp, resize/letterbox không lệch, tải lỗi có fallback |
| MAP-05 | Nối nền mẫu vào sandbox E | Kiểm trận thật ở các tốc độ, restart/pause; chưa đưa toàn campaign trước khi kiểm context mapping |
| MAP-06 | Nhân rộng Q1 rồi Q2 | Khóa layout, style/palette và metadata từ mẫu đã duyệt; duyệt từng map |

MAP-03 cần thử thêm ít nhất một thú lớn khi có asset phù hợp. Các bounds hiện tại chỉ giới hạn pivot, **không bảo đảm sprite/KO nằm không tràn mép**. Đo độ vươn lớn nhất của clip ở cả hai hướng rồi quyết định margin/camera/vùng spawn; không tự thu nhỏ toàn roster để chữa clipping. HUD nằm ngoài stage khi có thể.

## 6. Đóng gói dự kiến và tích hợp

```text
incoming_maps/q1_bamboo_clearing_v01/   # raw image, prompt, reference list, generation notes
previews/battle-map-v01/              # viewer, ảnh so sánh và metadata review
assets/battle_maps/q1_bamboo_clearing/ # chỉ công bố bản được duyệt
  background.png
  map.json
```

`map.json` dự kiến ghi: ID/version, status, source và runtime size, layer paths, world bounds, dải chiếu mặt đất, spawn đề xuất, scene/context mapping và ghi chú style. Các giá trị xuất phát từ bảng mục 2. Đây là schema cần implement, **chưa có loader đọc file này**. Chưa thêm collision polygon hoặc parallax trong mẫu đầu.

Orange-kun triển khai:

1. Cho viewer/sandbox chọn map, nạp texture một lần; nền lỗi thì dùng nền cũ. Không nạp lại ảnh mỗi frame.
2. Gom phép chiếu và phép chiếu ngược vào cấu hình chung để view, input, shadow và telegraph cùng dùng. Responsive scale/letterbox phải được đổi ngược đúng.
3. Giữ layer: background → ground/shadow/guide → actor sắp theo z → FX/HUD. Foreground che actor chỉ làm ở đợt sau khi có quy tắc che khuất rõ.
4. Điều chỉnh overlay tối riêng từng map; dùng nearest cho texture pixel. Không thêm filter blur hoặc upscale AI lúc runtime.
5. Mapping battle campaign theo sự kiện/địa điểm và thời kỳ. Địch thiếu sprite hoặc map thiếu ảnh vẫn có fallback; không đổi địa điểm để tiện dùng asset.
6. Dùng sim làm nguồn sự thật. Màu/texture của sàn không tự phát sinh collision, vùng nguy hiểm hoặc buff.

## 7. Prompt mẫu tạo nền đầu tiên

Đính kèm sprite PN/BNB làm **style reference only**, không yêu cầu AI vẽ chúng vào nền. Layout số liệu là hướng dẫn; cần kiểm ảnh thật sau generate.

```text
Pixel-art battle background for a side-facing chibi martial-arts game. An open earthen clearing in a mountain bamboo forest, muted grey-green bamboo and pale distant mountains, soft daylight. Fixed side-on camera with a slightly elevated view of the ground, matching the attached sprites' pixel density and outline style. Wide composition, approximately 2.23:1. An unobstructed flat fighting floor spans the full width from about 58% to 93% of image height, with extra ground below. Quiet brown-grey soil, restrained detail, readable behind both black-robed and white-robed characters. Place large rocks and bamboo behind the floor or outside it. Crisp pixel clusters, limited palette. Environment only; empty arena.
```

Negative nếu công cụ có ô riêng:

```text
characters, people, animals, UI, text, watermark, grid, baked shadows of characters, projectiles, spell effects, large obstacles on the fighting floor, cliffs through the floor, top-down view, isometric view, photorealistic, blurry painting, dense pixel noise
```

Nếu không có negative riêng, chỉ thêm một câu ngắn trong prompt chính để mô tả đầu ra là nền trống. Không gửi lệnh đóng gói JSON/collision/export vào model tạo ảnh; đó là việc của bước tích hợp.

## 8. Tiêu chí nghiệm thu

- Sprite giữ nguyên chất lượng, scale và pose; không cần chỉnh lại nhân vật để hợp nền.
- Chân/bóng, ground click, vòng tầm và telegraph cùng nằm trên một mặt sàn ở mọi z.
- Idle, dash, chiêu rộng và KO không bị cắt/che ở các vị trí được phép. Kiểm mirror, thú lớn và kích thước trình duyệt khác nhau.
- PN đen, BNB trắng, đạn nguyệt/băng và báo nguy hiểm đỏ đều đọc rõ khi có hiệu ứng.
- Không có vật cản được vẽ ở giữa nhưng nhân vật đi xuyên qua, hoặc ảnh nước/vực mà game coi là sàn.
- Có nguồn raw, prompt/reference, phiên bản và trạng thái duyệt. Bản chưa duyệt không thay bản runtime đã duyệt.

**Bước tiếp theo:** làm MAP-01 → MAP-03 với một nền rừng trúc, gửi preview để người dùng duyệt; chưa gen cả danh sách map.

## 9. Cách tạo nền mẫu trên Muse (Orange-kun bổ sung, 02/10/2026)

Thay đổi so với mục 7:
- **Không** bắt AI vẽ sàn đúng 58–93% chiều cao. Sau khi gen, đo mép trên và mép dưới của sàn rồi ghi vào `map.json`; code tính phép chiếu theo số đo đó.
- Tỷ lệ khung dùng tỷ lệ Muse có sẵn, rồi cắt bằng script.

**Thiết lập:**
- Tỷ lệ **21:9**. Không có thì chọn 2:1, cuối cùng mới tới 16:9.
- Mỗi lượt tạo 4 ảnh.
- **Lần 1 không đính kèm ảnh nào.** Lần 2, nếu phong cách lệch sprite, đính kèm `assets/chibi_ref/phuong_nguyen_full.png` làm tham chiếu phong cách với độ bám **thấp đến vừa**, rồi kiểm tra ảnh không có người.

**Prompt:**

```text
Pixel art battle background for a 2D side-view martial arts game. An open flat earthen clearing in a mountain bamboo forest, ancient China. Side-on camera at low height looking slightly down at the ground: a flat dirt floor fills the lower half of the image and stretches across the full width, empty and unobstructed. Behind the floor: dense grey-green bamboo grove, a few mossy rocks along the back edge of the clearing, pale blue distant mountains, soft daylight sky at the top. Muted earthy palette, brown-grey soil with sparse small fallen leaves, low contrast on the floor so dark-robed and white-robed characters stand out clearly. Crisp chunky pixel clusters, limited palette, clean 16-bit style pixel art. Empty scene with no characters.
```

**Negative:**

```text
characters, people, animals, UI, text, watermark, grid, shadows of characters, projectiles, spell effects, large rocks on the floor, trees on the floor, water, cliffs, holes, top-down view, isometric view, photorealistic, blurry painting, dense pixel noise, fog covering the floor
```

**Chọn ảnh:**
- Sàn phẳng, trống, trải hết chiều ngang.
- Mép sau của sàn nằm khoảng giữa ảnh.
- Không có đá hay thân cây chắn giữa sàn.
- Pixel không mịn hơn sprite.
- Nhân vật áo đen và áo trắng đặt lên đều nổi.

**Lưu:** `incoming_maps/q1_bamboo_clearing_v1.png`, ảnh gốc nguyên, không cắt hay sửa. Ghi prompt và thiết lập đã dùng vào `incoming_maps/NOTE.txt`. Việc cắt, thu nhỏ, đo sàn và đặt nhân vật lên để duyệt do script và trang xem trước làm (bước MAP-01 → MAP-03).

## 10. Review của Orange-kun cho nền mẫu đã áp (02/10/2026)

Đã chụp sandbox bằng Chrome headless, đặt PN và BNB ở bốn góc sân (z = 0 / 240, x = 70 / 930) và giữa trận.

**Đạt:**
- Mép sau bãi đất của ảnh nằm khoảng y = 250, trùng phép chiếu hiện có, nên chân hàng sau đứng sát ven rừng và hàng trước đứng trên đất.
- Nhân vật áo đen và áo trắng đều nổi; đạn nguyệt rõ.
- Mật độ pixel của nền thô hơn sprite một chút, đúng hướng.

**Đã sửa (chỉ phần hình, không đổi luật trận):**
- `ground_screen_y` trong `map.json` giờ **điều khiển phép chiếu của view**. Lúc trước chỉ là ghi chú. View, chuyển click sang tọa độ, bóng và telegraph cùng dùng. Map sau chỉ cần đo mép sàn của ảnh và ghi vào đây, không phải bắt AI vẽ sàn đúng 58–93%.
- Click lệch khỏi mép sàn tối đa 12px vẫn nhận và kéo về mép. Không còn tình huống click hụt vì lệch 1–2px ngay chân hàng sau.
- Thêm `haze` (map này đặt 0,14): một lớp sương sáng dần lên phía trên mép sàn, chỉ phủ hậu cảnh. Đã kiểm: PN tóc đen ở hàng sau tách rõ khỏi rừng trúc. Tắt bằng `haze: 0`.

**Đề xuất, chưa làm vì đụng luật simulation:**
- **Nhân vật bị cắt ở mép sân.** Pose rộng nhất (KO nằm) vươn khoảng 120px màn hình mỗi bên, trong khi biên sân `X0 = 60` chỉ cách mép khung 57px. Đề xuất đổi `X0 / X1` thành 110 / 890, hoặc giữ nguyên biên và chỉ chặn spawn, đẩy lùi gần mép. Sân hẹp đi khoảng 11%, cần đo lại cân bằng.
- Mép sau (z = 0) đang trùng hàng đá rêu ven rừng. Nếu thấy chân như đứng trên đá, tăng `ground_screen_y[0]` lên khoảng 256 cho map này.

**Cho map tiếp theo:** quy trình chỉ còn **gen → đo mép trên / dưới của sàn → ghi `ground_screen_y` và `haze`** → xem preview. Nên viết `tools/map_import.py` để tự cắt theo tỷ lệ 960:430 và gợi ý mép sàn khi bắt đầu nhân rộng.

**Cập nhật Orange-kun (cùng ngày, theo người dùng duyệt):**
- Đã đổi biên sân `X0 / X1` từ 60 / 940 thành **110 / 890** (`js/sandbox/sim.js`; `map.json` cập nhật `world_bounds`).
- Đã chụp kiểm tra: KO nằm ở hai mép nằm gọn trong khung.
- Hồi quy đạt. Bot PN thắng (300 trận): Dễ 86,3% / Thường 65,7% / Khó 30,0%, gần như cũ.

## 11. Blue-chan đối chiếu lại cập nhật Orange-kun (02/10/2026)

**Giữ được:** `ground_screen_y` đã điều khiển view/input/bóng/telegraph; haze chỉ trên hậu cảnh; tolerance rồi clamp điểm đi là hợp lý cho cảm ứng. Kiểm thử Chrome chuột/cảm ứng qua; hồi quy simulation và dữ liệu qua. Thay biên 110/890 là thay đổi gameplay có chủ đích, không nên gộp vào mô tả “chỉ phần hình”. Không đổi thêm biên trong lượt review này.

**Còn một lỗi hình đã đo được: KO ở hàng trước vẫn bị cắt.** Dùng alpha >=100 của frame KO cuối, pivot thật trong manifest, `SCALE=1,12`, `depthK(240)=1,06`:

| Actor | Bề vươn lớn nhất từ pivot sau scale | Khoảng trống mép ở x=110/890 | Phần tràn mỗi mép |
|---|---|---|---|
| PN | 122,28 px màn hình | 105,60 px | 16,68 px |
| BNB | 124,66 px màn hình | 105,60 px | 19,06 px |

Ở z=0 scale nhỏ hơn nên có thể vừa khung; cần thử cả z=240, hai hướng mặt và frame KO cuối, không chỉ frame đầu hoặc hàng sau. Vì vậy chưa chốt tiêu chí “KO mọi góc nằm gọn”.

Đề xuất Orange-kun chọn tiếp: nếu tiếp tục thu biên toàn sân thì cặp **132/868** cho hai asset hiện tại có khoảng đệm hơn 2 px ở scale lớn nhất (ngưỡng vừa đủ là 130/870). Phải đo lại cân bằng và xét thêm pose khác. Nếu giữ 110/890, giải pháp renderer/camera riêng cho KO cần giữ chân/pivot/contact nhất quán; không tự clamp riêng hình actor mà để hitbox ở chỗ khác. Không coi một cặp biên cố định là bảo đảm cho thú lớn của roster.

**Việc nhỏ trước khi mở map khác:** validate `ground_screen_y` gồm hai số hữu hạn với 0 <= đầu < cuối <= 430; cấu hình lỗi cần về [250,400], tránh chia cho 0 trong `toWorld`. `world_bounds` vẫn là ghi chú khớp sim, chưa tự đổi sim theo từng map. Tolerance ngang hiện là 12 đơn vị world (11,52 px sân), tolerance dọc 12 px sân; chênh nhỏ này không làm hỏng bản mẫu.
