# Lịch sử kế hoạch và review Battle E — 02/10/2026

Bản lưu lịch sử, không phải kế hoạch đang áp. Đọc [đồng thuận/triển khai](../undone/BATTLE_E_DONG_THUAN_VA_TRIEN_KHAI.md) và [điểm cần chốt](../undone/BATTLE_E_CAC_DIEM_CAN_CHOT.md) trước. Các số đo, câu “chưa làm”, hồ sơ cổ và đề xuất cũ được giữ theo thời điểm viết; có thể đã được sửa ở review phía sau. **Kế hoạch E V2 đặc biệt có mô tả Sương Yêu/kit lỗi thời**, xem bản hiện hành.

Bản gốc trước gộp lưu tại [file ZIP](LICH_SU_REVIEW_BATTLE_E_2026_10_02.zip); SHA-256 bên dưới kiểm toàn vẹn. Đây là dữ liệu lưu trữ, không phải file kế hoạch active.

<a id="source-ke_hoach_map_battle_pixel"></a>

## Nguồn: `KE_HOACH_MAP_BATTLE_PIXEL.md`

SHA-256 trước gộp: `055e2f32c187f795741c7b168dd806d05625bc22300c5045b7f26b6eeba22a8c`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

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

## 12. Orange-kun phản hồi mục 11 (02/10/2026)

- Phép đo KO tràn mép: **đúng**. Orange-kun đo lại được 17,9 / 19,1 px (PN `hit#0`, BNB `ko#2`). Câu “KO vừa khung” ở mục 10 là sai.
- Đề xuất sửa ánh xạ `sx` (padding view ≈127 px mỗi bên, KX≈0,905) thay vì thu biên sim, để không đổi cân bằng. Chi tiết ở `KE_HOACH_CHOT_SANDBOX_PN_BNB.md` §8.
- Validate `ground_screen_y` (hai số hữu hạn, 0 ≤ a < b ≤ 430, sai thì về [250,400]): đồng ý, nên làm cùng lúc sửa `sx`.


<a id="source-ke_hoach_vfx_am_thanh_battle_e"></a>

## Nguồn: `KE_HOACH_VFX_AM_THANH_BATTLE_E.md`

SHA-256 trước gộp: `e1e983c564c6afb94efaa67d815de30405cfde2506c357585d316d1ef1130562`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Kế hoạch hiệu ứng và âm thanh chiêu battle E — Blue-chan

02/10/2026. Bàn giao Orange-kun review và triển khai cùng [kế hoạch map pixel](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_map_battle_pixel). **Đã triển khai mẫu FX-02 trực tiếp trong sandbox theo yêu cầu người dùng; các bước còn lại là kế hoạch.** Ưu tiên sandbox PN/BNB; chỉ nhân rộng roster sau khi mẫu đạt.

### Mẫu đang chạy để duyệt

- `battle_sandbox.html`: giữ URL preview hiện tại, thêm nút bật/tắt âm và thanh âm lượng. Một batch event được đưa cho view và audio, chỉ rút queue một lần.
- `view.js`: thay đạn nguyệt và vệt chém BNB cũ bằng hình sắc hơn; thêm tụ sáng Nguyệt Mang, vệt đấm và impact theo chất liệu. Dùng hand của clip nếu có, fallback thủ công; chưa có atlas/pool hay anchor từng frame.
- `sim.js`: bổ sung source/skill/hid/contact vào event damage; không sửa luật trúng, sát thương hoặc timing. DOT vẫn im lặng.
- `audio.js`: backend Web Audio riêng của sandbox, unlock sau thao tác người dùng, mute/volume lưu localStorage, trần tám voice; âm mẫu đấm/gió/nguyệt/băng và fallback ngọc/hồi phục. Màng nước/rết/Cường Thủ chưa có âm riêng hoàn chỉnh. Không thay `SFX` campaign.
- Kiểm thử: Chrome chạy VFX thật, unlock/mute/tối đa tám voice và dọn voice; chuột/cảm ứng vẫn đạt; hồi quy simulation và dữ liệu đạt. So sánh simulation trước/sau bổ sung event qua 500 tick cho cùng chuỗi lệnh có state gameplay giống nhau. Chưa nghe duyệt chất lượng âm trên thiết bị thật.
- Chưa hoàn tất toàn bộ FX-01: schema event mới chỉ có dữ liệu damage cần cho mẫu, chưa có eid/anchor mọi frame/registry. Không coi bộ effect toàn kit đã xong.

## 1. Mục tiêu

Chiêu phải có nhịp **lấy đà → phát → trúng hoặc trượt → tan**, nhìn và nghe phân biệt được chất liệu. Hiệu ứng đẹp nhưng vẫn thấy mặt, pose, chân, đạn và vùng né. Animation nhân vật tiếp tục dùng frame đã duyệt; VFX không thay cho frame tay/chân còn thiếu.

Không đổi sát thương, tầm, hồi chiêu, tốc độ trận hoặc độ khó để làm hiệu ứng đẹp. Không thêm hit-stop vào simulation ở đợt này. Hình, màu và âm thanh dưới đây là thiết kế mỹ thuật cho kit hiện có, không phải khẳng định chi tiết nguyên tác.

Hướng miễn phí: VFX bằng code + atlas pixel nhỏ dùng chung; âm thanh mẫu bằng Web Audio đang có. Không cần model video, PixelLab hay render AI local. Nếu âm tổng hợp chưa đạt, thay từng cue bằng file thu/tạo riêng sau; không buộc tải một bộ âm thanh lớn ngay.

## 2. Hiện trạng đã đọc trong code

| Thành phần | Đã có | Còn thiếu |
|---|---|---|
| `js/sandbox/view.js` | Đạn nguyệt, vệt chém BNB, đường rết vàng, đường chộp kéo, burst, bóng lướt, flash, chữ sát thương, vòng AoE | Chất liệu riêng từng chiêu, điểm phát chuẩn theo frame, FX trúng gắn với nguồn chiêu, ngân sách FX |
| `js/sandbox/sim.js` | Event `act`, `release`, `dmg`, `miss`, `interrupt`, `shield`, `shieldEnd`, `heal`, `escape`, `zoneFire`, `zoneCancel`, `ko`, `projEnd` | `dmg` chưa ghi skill/source/contact; nhiều event thiếu ID liên kết và snapshot tọa độ |
| `js/sound.js` | Web Audio, mute lưu localStorage; cue chung `blade`, `hit`, `jadeGuard`, `stagger`, v.v. | Sandbox chưa nạp; chưa có gain chung, giới hạn voice, âm riêng nước/băng/rết và hủy âm lấy đà |
| Loop sandbox | Rút `B.events` một lần mỗi frame, đưa view | Chưa fan-out cùng batch cho audio; chưa unlock audio ở thao tác người dùng |

Không gắn `SFX.hit()` vào mọi tick mất máu: chảy máu hiện có thể phát `dmg` nhiều lần mỗi giây, sẽ thành tiếng máy gõ.

## 3. Ngôn ngữ hình ảnh chung

- Cụm pixel sắc, 3–5 màu chính cho mỗi chất liệu; lõi sáng nhỏ, viền rõ. Tránh quầng blur lớn, khói mờ đặc và bloom toàn màn hình.
- Nguyệt: trắng xanh nhạt; ngọc: trắng ngà có cạnh; rết: vàng đồng có đốt/răng; Cường Thủ: xám thép; Thiên Bồng: vàng kem; băng: xanh băng sắc; nước: xanh lam trong; hồi phục: xanh lá dịu.
- Vòng nguy hiểm: viền đỏ/cam tương phản + nét đứt/nhịp co vào, khác hình hiệu ứng trang trí. Không dựa chỉ vào màu để nhận biết.
- Ground guide/telegraph nằm trên sàn, dưới actor; đường đạn và FX tay ở cao độ phù hợp. Chia FX trước/sau actor theo z khi cần, không đặt mọi FX phía trước mọi nhân vật.
- Một cú trúng có lõi lóe 1–2 frame và 4–8 mảnh nhỏ; chiêu lớn có thể 12–24 mảnh. Các số là ngân sách đề xuất, cần nhìn thử trên mobile.
- Đánh thường không rung camera. Đợt đầu không rung camera để giữ nhắm/click chính xác. Nếu thêm sau, phải bù transform trong `toWorld` và cho tắt rung.
- Giữ chữ sát thương gọn; damage trực tiếp có chữ, DOT gộp thông báo theo khoảng ngắn thay vì spam. Việc gộp chỉ ở view, không đổi số tick simulation.

## 4. Bộ PN: hiệu ứng và âm từng chiêu

Thời lượng gameplay lấy đúng `kits.js`; thời gian tan FX dưới đây tính theo giây trận. Âm one-shot ngắn dùng giây thực, không đổi pitch theo tốc độ trận.

| Chiêu | Lấy đà / phát | Trúng / kết thúc | Âm đề xuất |
|---|---|---|---|
| Đánh tay (`pn:atk`) | Vệt tay ngắn tại release, không phát đạn | Chấm impact trắng ngà, 4 mảnh, tan 0,12–0,18s; trượt không có impact | Vút nhẹ lúc release; tiếng đấm trầm gọn chỉ khi trúng |
| Nguyệt Mang (`nguyet`) | Điểm sáng nhỏ ở tay trong startup 0,30s; lưỡi trăng có lõi trắng và đuôi xanh 2–3 đoạn đi theo projectile thật | Impact hình cung tại contact, tan 0,18–0,25s; hết tầm tan ở vị trí cuối, không giả tiếng trúng | Gió sắc khi phóng, va cắt khi trúng; tránh kéo âm tới tận lúc projectile hết tầm |
| Bạch Ngọc (`bachngoc`) | Ánh ngọc chạy ngắn từ thân lên vai khi buff thực sự kích hoạt | Viền/ngấn ngọc mảnh quanh thân, không cầu năng lượng lớn; lóe cạnh ở chỗ chịu đòn; tan khi hết/thay hộ thể | Tiếng ngọc trong, ngắn khi kích hoạt; tiếng chạm ngọc nhỏ theo hit đã đỡ |
| Cự Xỉ Kim Ngô (`cuxi`) | 0,40s lấy đà; cung vung rết vàng có đốt và răng cưa, nối từ tay, chỉ dài bằng tầm đang mô phỏng | Cung cắt + 6–10 vụn vàng ở hit; chảy máu chỉ dấu nhỏ, không phun máu phủ sprite | Tiếng răng cưa khô + vút nặng, impact xé ngắn; DOT không lặp tiếng chém |
| Cường Thủ (`cuongthu`) | Bàn tay thép riêng, có silhouette ngón rõ; phát lúc release, không chỉ vẽ một đường thẳng | Chộp đúng target khi `grab`; vệt kéo ngắn tới vị trí sau kéo; trượt thì bàn tay tan, không phát tiếng bắt được | Vút nặng; tiếng siết kim loại ở grab thành công |
| Thiên Bồng (`thienbong`) | Ánh vàng kem bật lên khi shield được cấp | Mảng giáp ánh sáng mỏng, khác ngọc và nước; phản sáng ở hit; thay Bạch Ngọc thì dọn FX ngọc | Âm giáp trầm hơn ngọc, một tiếng đóng giáp; không ngân liên tục 5s |
| Lướt (`dash`) | Bụi ở vị trí xuất phát và bóng actor đang có; không kéo giãn sprite | Vệt sau lưng tan nhanh, bụi nhỏ tại điểm dừng; không giả impact hay bất tử | Một tiếng gió 0,12–0,20s, không chime phép |
| Sinh Mệnh Diệp (`leaf`) | Đốm lá nhỏ ở tay, sáng nhẹ trong startup 0,55s | Chỉ phát vòng hồi phục khi có event `heal`; 4–6 lá bay lên thân, tan 0,35–0,50s | Sột soạt khi dùng, chime êm khi hồi thành công; bị ngắt thì tắt âm/FX đang chuẩn bị |

Rết và bàn tay là FX tách riêng actor, không sửa tạo hình nhân vật. Nếu cung rết chưa đọc ra rết, tạo atlas phần đốt/răng trước; không cố che bằng tia sáng vàng.

## 5. Bộ BNB: hiệu ứng và âm từng chiêu

| Chiêu | Lấy đà / phát | Trúng / kết thúc | Âm đề xuất |
|---|---|---|---|
| Băng nhận (`bnb:atk`) | Dải băng dạng lưỡi sắc đi theo cung chém, khác đạn nguyệt; đúng release của đòn melee | Vụn băng 6–8 mảnh, cạnh xanh sẫm; slow có dấu nhỏ ở chân, không đóng băng toàn thân | Gió lạnh ngắn + tiếng nứt băng khi trúng |
| Lốc băng nhận (`locbangnhan`) | Vòng đỏ rõ trong đủ startup 1,15s; băng nhỏ tụ bên trong nhưng không che viền | `zoneFire`: cột xoáy thấp với 2–3 cung băng, cao vừa đủ đọc chiêu, tan 0,35–0,50s; tâm/radius đúng vùng sim. Không tiếp tục gây sát thương khi còn FX dư | Âm gió tăng nhẹ lúc cảnh báo; bật xoáy lúc zoneFire. Trúng dùng impact băng riêng, trượt vẫn nghe lốc nhưng không tiếng trúng |
| Thủy Tráo (`thuytrao`) | Màng nước ôm thân khi shield thực sự kích hoạt | 2–3 đường cong và gợn tròn; khi đỡ xuất hiện gợn từ contact. Không giống viền ngọc hay giáp vàng | Tiếng nước ôm nhẹ, tiếng nước gợn khi đỡ; không dùng `jadeGuard` làm âm cuối cùng |
| Sương Yêu (`suongyeu`) | Sương trắng xanh nổ nhỏ ở điểm xuất phát khi event `escape`, không phải vụ nổ sát thương | Vệt sương và bóng actor theo đường thoát; lõi nhân vật vẫn thấy; tan 0,35–0,60s. Không impact lên PN hoặc vòng đỏ gây hiểu nhầm | Rạn băng ngắn + luồng gió thoát; không tiếng nổ đòn trúng |
| Lướt (`dash`) | Chung bộ lướt, màu trung tính | Theo vị trí và pha active; khác Sương Yêu về độ dài/chất liệu | Chung tiếng gió, âm lượng thấp hơn Sương Yêu |

Chuyển thể Lốc hiện gây sát thương một lần; FX xoáy còn tồn tại không được gợi ý đây là vùng sát thương kéo dài. Vòng nguy hiểm tắt ngay khi zoneFire/cancel/kết trận.

## 6. Event và anchor: việc phải làm trước khi polish

1. Vòng chính tiếp tục **một lần** `const evs=B.events.splice(0)`; đưa cùng batch vào `SBView.render(evs)` và audio. Audio không được tự `splice` hoặc gọi simulation.
2. Bổ sung schema event (đề xuất, chưa implement): `eid`, `t`, `who`, `source`, `target`, `skill`, `hid`, `kind`, snapshot `origin`, `contact`, và tọa độ trước/sau khi kéo nếu cần. `eid` tăng riêng cho event, `hid` là ID một act/hit đang có; không dùng lẫn hai loại.
3. `act`/`release`/`interrupt`/`zoneCancel` liên kết bằng `hid`; `dmg` ghi nguồn skill/hit và contact lúc trúng. DOT ghi rõ `dot:true` và nguồn effect, không suy ngược từ `actor.act` hiện tại. `projEnd` phân biệt hết tầm với hủy do kết trận; không phát tiếng trúng cho trường hợp hết tầm.
4. `shieldEnd` phải biết shield nào kết thúc; thay shield cần event thay thế hoặc cơ chế view đối chiếu state. Khi trừ HP tới KO, batch vẫn giữ hit/KO cuối; chỉ hủy hiệu ứng nguy hiểm và âm chờ sau đó, không bỏ cả batch.
5. Anchor dự kiến theo clip/frame: `hand`, `body`, `feet`, `weapon_tip`; mirror cùng actor quanh pivot và áp scale chiều sâu. Manifest hiện có `hand` ở một số clip, chưa đủ anchor mỗi frame. Không lấy pixel ngoài cùng làm bàn tay; điểm đó có thể là tóc/nanh/vũ khí.
6. VFX dùng anchor đã duyệt; clip thiếu anchor dùng offset thủ công theo actor/clip có ghi fallback. Hit/contact lấy snapshot simulation. Nếu target di chuyển sau hit, tia impact vẫn ở điểm hit cũ; shield gắn thân có thể tiếp tục theo actor.
7. Hiệu ứng lấy đà gắn `hid`, dừng khi interrupt/KO. Hủy act không xóa FX của act khác. Mọi FX có thời hạn và đường destroy; restart/unmount dọn sạch.

## 7. Âm thanh: triển khai nhẹ và phân biệt rõ

**Đợt đầu:** dùng Web Audio cho bản mẫu. Tái sử dụng `hit`/`blade` như fallback; thêm palette nước, băng, răng cưa, gió và hồi phục bằng noise có filter + oscillator + envelope. Tổng hợp không bảo đảm nghe như vật liệu thật, phải nghe A/B và thay cue chưa đạt sau.

- Tách audio adapter của E (tên dự kiến `js/sandbox/audio.js`), không sửa cách phát của campaign một cách ngầm định. Sandbox cần nạp backend trước adapter; backend mở rộng vẫn giữ API cũ của `SFX`.
- Unlock/resume AudioContext **trực tiếp trong thao tác người dùng**: pointerdown, keydown hoặc nút “Bật âm”. Sandbox tự chạy AI trước thao tác thì giữ im lặng, không phát bù các cue cũ khi vừa unlock.
- Có bật/tắt âm và volume dùng được bằng chạm. Master Gain chung; gain cue có trần. Giới hạn ban đầu tối đa 8 voice, ưu tiên báo chiêu lớn → hit/grab → release → bụi/trang trí. Không tạo AudioContext mới mỗi chiêu.
- Event thời gian trận không phải timestamp AudioContext. One-shot phát khi nhận event còn mới; FX nhìn bám `B.t`. Giữ pitch khi đổi 0,75/0,85/1×; âm lấy đà kéo dài phải theo progress act và hủy bằng handle khi act ngắt.
- Nếu batch catch-up quá dài hoặc quay lại tab sau thời gian ẩn: bỏ cue cũ đã quá hạn (ngưỡng thử 0,15s thực, quy đổi từ tốc độ trận), giữ cảnh báo đang còn hiệu lực. Không phát hàng chục tiếng tồn đọng cùng lúc.
- Không phát đồng thời cả `release` và `shield` thành hai tiếng kích hoạt hộ thể. `release` là tiếng ra chiêu; `dmg` là impact; `heal` là thành công hồi; `escape` là thoát. `zoneFire` là tiếng lốc bật, `dmg` của lốc chỉ thêm lớp hit nếu có.
- Hit được shield giảm sát thương: phối lớp vật liệu shield nhỏ với impact đã giảm, không cộng hai tiếng lớn. DOT không phát impact riêng từng tick; hạn chế một cue nhẹ khi effect bắt đầu.
- Khi mute/ẩn tab/unmount, hủy voice đang ngân; resume không tự replay. Một âm lấy đà bị hủy không được phát tiếng release giả sau đó.
- Đề xuất mono cho bản mẫu, tránh pan khiến tiếng cảnh báo khó nghe qua loa điện thoại. Nhạc nền và ambience để đợt sau, không tranh âm với chiêu.

Nếu dùng file âm sau này: thu/tạo/biên tập offline, đưa vào `assets/audio/battle/`; ghi nguồn và quyền dùng của từng file. WAV làm source, bản runtime chọn định dạng đã thử trên Safari/Chrome; có fallback im lặng khi lỗi tải. Chưa chọn nhà cung cấp hoặc bộ âm cụ thể trong kế hoạch này.

## 8. Hiệu năng và lựa chọn chất lượng

Ngân sách khởi điểm để đo, không phải cam kết FPS: tối đa 80 hạt đang sống và 24 nhóm FX; mobile thấp dùng khoảng 32 hạt/12 nhóm. Tối đa 8 voice audio. Khi đầy, bỏ bụi/đốm trang trí trước, giữ đạn, telegraph và feedback hit chính.

- Pool sprite/hạt; preload atlas và audio một lần. Không tạo texture mới, decode âm hoặc fetch trong render loop. Không cần render video, shader bloom hoặc particle engine lớn.
- Tránh `new PIXI.Graphics` liên tục cho mỗi hạt; atlas nhỏ + sprite pool cho băng/lá/vụn. Geometry đơn giản giữ cho vòng sàn và đường ngắn.
- Thiết lập giảm FX riêng, gồm ít hạt và không flash mạnh; vẫn giữ toàn bộ chỉ dẫn gameplay. Ưu tiên reduced-motion khi người dùng chọn; không dùng nháy sáng toàn màn hình.
- Đo trên máy và điện thoại thật. Nếu nóng hoặc tụt khung hình, giảm độ phân giải render, hạt và filter trước; giữ simulation bước 1/60 giây và luật trúng.

## 9. Lộ trình Orange-kun

| Bước | Bàn giao | Cổng duyệt |
|---|---|---|
| FX-01 | Event schema, anchor/fallback, một dispatcher cho view/audio | Hit có nguồn/contact; không phát lặp, không đổi HP/timing |
| FX-02 | Mẫu Đánh tay + Nguyệt Mang + Băng nhận, thêm mute/volume/unlock | Xem/nghe được startup/release/hit/miss; thử cùng map cũ và nền pixel mẫu nếu đã có |
| FX-03 | Ngọc, nước, giáp vàng, hồi lá; thử đủ PN/BNB | Phân biệt ba hộ thể; ngắt hồi đúng, audio không phát thành công giả |
| FX-04 | Rết, Cường Thủ, Lốc, Sương Yêu, lướt | Telegraph khớp vùng né; rết đọc ra đốt/răng; thoát thân không giả sát thương |
| FX-05 | Viewer FX và trận đầy đủ; chất lượng thấp/cao | Người dùng duyệt video có âm + chơi thật, mobile và desktop |
| FX-06 | Bàn giao registry theo skill/material để mở roster | Chỉ thêm FX cho skill đã map; không gán lửa/băng/chưởng cho mọi actor |

Tên file dự kiến: `js/sandbox/vfx.js`, `js/sandbox/audio.js`, `assets/vfx/battle/manifest.json`, `battle_fx_preview.html`. Đây là đề xuất cấu trúc, chưa có các file/loader này. Có thể giữ phần render trong `view.js` nếu tách module chưa cần thiết; một nơi chịu trách nhiệm lifecycle là điều bắt buộc.

Viewer cần nút thử từng chiêu, chọn “trúng / trượt / bị ngắt / được hộ thể đỡ”, tốc độ trận và chất lượng FX; nút nghe cue chỉ phát âm, không thay HP. Bản xem hình tĩnh không đủ duyệt audio và nhịp.

## 10. Kiểm thử và nghiệm thu

- Trước/sau thay FX chạy cùng seed và cùng chuỗi lệnh: HP, chân nguyên, cooldown, vị trí, thời điểm kết trận như nhau. Visual RNG không dùng chung `B.rng` của AI/gameplay.
- Kiểm tất cả tốc độ 0,75 / 0,85 / 1×, render nhanh/chậm; không thêm hoặc mất event vì FPS. Đạn trượt không phát impact; buff chỉ một tiếng kích hoạt.
- Ngắt hồi máu, hủy zone, thay shield, DOT, projectile hết tầm, KO khi đang ra chiêu, restart nhiều lần: không FX/âm cũ còn chạy; kết quả trận vẫn chốt một lần.
- Mirror actor và đổi z: điểm tay, bóng, zone và contact đúng vị trí, đủ margin ở biên sân. PN đen/BNB trắng vẫn đọc rõ trên map sáng/tối.
- Chrome desktop, Chrome Android, Safari iPhone: unlock sau tap; trước tap không lỗi; mute có tác dụng ngay; đổi tab không phát dồn âm. Lỗi/thiếu audio không làm hỏng trận.
- Theo dõi số hạt/voice qua nhiều trận; không tăng vô hạn, không decode/fetch mỗi frame. Ghi thiết bị và chất lượng khi báo FPS.
- Người dùng duyệt mẫu FX-02 trước khi làm toàn bộ kit; roster chỉ đi tiếp sau FX-05. Không gọi bản tổng hợp âm “đạt” nếu chưa nghe thực tế.

**Bước đầu đề xuất:** Orange-kun hoàn tất review map song song với chốt event/anchor; sau đó dựng ba mẫu FX-02, gửi preview có âm. Chưa cần gen thêm pose hoặc tải model AI nặng để làm bước này.

## 11. Review của Orange-kun (02/10/2026)

Đã đọc kế hoạch và code mẫu FX-02 (`view.js`, `audio.js`, event `dmg` trong `sim.js`); chạy hồi quy và chụp trận trên nền mới.

**Đồng ý:**
- Nhịp lấy đà → phát → trúng / trượt → tan.
- Không rung camera, không hit-stop đợt này.
- DOT không phát tiếng mỗi tick.
- Vòng chính rút event một lần rồi chia cho view và audio.
- Giới hạn 8 voice; unlock âm bằng thao tác người dùng.
- Mẫu FX-02 chạy đúng: tụ sáng Nguyệt Mang, lưỡi trăng pixel sắc hơn, impact theo chất liệu; event `dmg` có `source`, `skill`, `hid`, `contact`. Đã kiểm hồi quy: luật trận không đổi.

**Đã sửa nhỏ:**
- Impact giờ tính độ cao theo độ sâu, trước đây cố định 78px ở mọi z.
- Quay lại tab thì âm tự resume (đã unlock trước đó). Không phát bù cue cũ, vì `consume` bỏ event quá hạn.

**Đề xuất chỉnh kế hoạch:**
1. **Thu nhỏ FX-01 cho sandbox.** Schema đầy đủ (`eid`, snapshot origin cho mọi event, anchor mọi frame, registry) là cho roster. Với PN / BNB hiện đủ dùng: `hid` + `skill` + `source` + `contact`, và anchor ở frame phát đòn (manifest đã có `hand` cho clip phát đòn). Thêm `origin` cho `release` của đạn là đủ. Registry để đến FX-06.
2. **Âm thanh: đổi thứ tự ưu tiên.** Âm tổng hợp bằng Web Audio thường nghe "điện tử", khó đạt nước / băng / răng cưa. Đề xuất thử ngay **bộ âm CC0** (ví dụ các gói impact / RPG sound của Kenney, hoặc file CC0 trên Freesound; **kiểm giấy phép từng file**), cắt ngắn, đặt vào `assets/audio/battle/` có ghi nguồn. Web Audio giữ làm fallback. Cùng API `play(kind)`, chỉ thay nguồn phát.
3. **Hộ thể đang chung một tiếng `jade`** cho Bạch Ngọc, Thiên Bồng và Thủy Tráo; impact khi được đỡ cũng là `jade`. Kế hoạch đã nêu cần phân biệt; khi làm FX-03 nên ưu tiên âm, vì người chơi dựa vào tai để biết đòn bị đỡ.
4. **FX rết và Cường Thủ (FX-04) nên dùng sprite**, không vẽ bằng Graphics. Con rết vàng là asset riêng trong `PROMPT_MUSE_ROSTER.md`. Gen 2–3 khung (cuộn, phóng, cắn) rồi cho chạy theo cung chém; dễ đọc ra "đốt / răng" hơn vẽ tay bằng đa giác.
5. **Pool và ngân sách FX:** hiện mỗi FX tạo một `PIXI.Graphics` mới. Ổn với 2 actor; khi lên roster hoặc lang triều (nhiều địch) mới cần pool. Ghi thành điều kiện chuyển sang pool, không làm ngay.

**Thứ tự đề xuất:** người dùng nghe / xem FX-02 hiện tại → thử 3–4 file CC0 cho đấm, gió, băng, nước → FX-03 (ba hộ thể phân biệt bằng âm và viền) → gen sprite rết → FX-04.

**Cập nhật Orange-kun (cùng ngày, theo người dùng duyệt):**
- `audio.js`:
  - Ba hộ thể có âm riêng: Bạch Ngọc `jade`, Thiên Bồng `gold`, Thủy Tráo `water`. Áp cho cả lúc bật hộ thể lẫn lúc đỡ đòn.
  - Thêm cue `saw` (Cự Xỉ), `grab` (Cường Thủ chộp trúng, phát theo event `grab`; release của grab không kêu), `heavy`, `storm` (Lốc khi `zoneFire`).
  - **Nạp file âm tùy chọn** theo `assets/audio/battle/manifest.json` (xem README cùng thư mục: tên cue cố định, ghi nguồn và giấy phép từng file). Thiếu file thì dùng âm tổng hợp.
  - Sửa thứ tự `start` / `stop` của âm tổng hợp.
- `sim.js`, chỉ thêm dữ liệu event, không đổi luật: `dmg.shield` (id hộ thể đỡ đòn) và `release.origin` cho đạn.
- Prompt sprite `fx_cuxi` (rết vàng) và `fx_cuongthu` (bàn tay sắt) ở mục 4b của `PROMPT_MUSE_ROSTER.md`. Bộ nhập asset hiệu ứng và FX-04 chưa làm.
- Đã kiểm: Chrome bật âm sau thao tác, tối đa 2 voice trong lượt thử, không lỗi; hồi quy đạt. **Chưa nghe duyệt bằng tai.**

## 12. Blue-chan đối chiếu lại cập nhật Orange-kun (02/10/2026)

**Đồng ý giữ:** âm ba hộ thể đã phân biệt cả lúc bật và đỡ, cue rết/chộp/lốc riêng; nguồn file tùy chọn có fallback tổng hợp; `start` trước `stop`; quay lại tab đã unlock có thể resume. Thu nhỏ FX-01 cho sandbox hai actor là hợp lý, registry/schema toàn roster để FX-06. Vẫn cần hid trên các event act/release/interrupt nếu triển khai hủy FX/âm lấy đà theo act; hiện chưa đủ để gọi schema vòng đời hoàn chỉnh.

**Đã sửa một chỗ lệch hình trong lượt review:** Orange-kun đổi impact thành `sy(z)-78*depthK(z)*SCALE`, nhưng đạn nguyệt vẫn vẽ ở `sy(z)-78`. Ở z=240 lệch 14,61 px, ở z=0 lệch 0,62 px. Blue-chan sửa `drawProj()` dùng cùng công thức chiều cao theo độ sâu để đạn và điểm impact không nhảy lúc trúng. Không đổi tọa độ world, vận tốc hoặc kiểm tra va chạm.

**Kiểm thử:** Chrome unlock audio sau thao tác, mute, trần tám voice, voice kết thúc được dọn; chuột/cảm ứng vẫn qua; hồi quy simulation và kiểm tra dữ liệu qua. Chưa nghe duyệt âm trên thiết bị thật; kiểm voice không chứng minh chất lượng chất liệu.

**Phần file âm hiện còn là khả năng nạp, chưa phải bộ âm mới:** thư mục có README nhưng chưa có manifest/file cue, nên runtime đang dùng tổng hợp. Comment đầu `audio.js` minh họa object phẳng chưa khớp loader (`man.cues`); README có schema đúng `{cues, sources}`. Khi đưa file thật vào, normalize âm lượng/cắt khoảng lặng: file hiện dùng gain 0,9, lớn hơn biên độ tổng hợp 0,12–0,35, và chưa có limiter chung. Chưa nên nghiệm thu âm lượng khi tám file phát đồng thời.

Đề xuất bước tiếp giữ như Orange-kun: nghe duyệt mẫu → thử vài file có nguồn/giấy phép rõ → hoàn thiện FX-03 → asset rết/tay và FX-04. Chưa tải bộ CC0 trong lượt review này; đề xuất nguồn của Orange-kun chưa được Blue-chan kiểm chứng từng file.

## 13. Orange-kun phản hồi mục 12 (02/10/2026)

- Sửa `drawProj()` theo `depthK`: đồng ý, cảm ơn. Lỗi do Orange-kun chỉ sửa impact mà quên đạn.
- Comment đầu `audio.js` minh họa sai schema: **đã sửa** thành `{"cues":{...},"sources":{...}}` khớp loader.
- Gain file 0,9 so với synth 0,12–0,35, chưa có limiter: đồng ý là rủi ro. Đề xuất khi đưa file thật vào: thêm `DynamicsCompressorNode` giữa `master` và `destination` (threshold khoảng −18 dB, ratio 4), và gain mặc định file 0,4 kèm `gain` riêng từng cue trong manifest. Chưa làm vì chưa có file.
- hid trên `act`/`release`/`interrupt`: đồng ý, cần trước khi làm hủy FX lấy đà. `cancel` đã có `hid`; `act` thì chưa.


<a id="source-ke_hoach_chot_sandbox_pn_bnb"></a>

## Nguồn: `KE_HOACH_CHOT_SANDBOX_PN_BNB.md`

SHA-256 trước gộp: `956302171e92f141441a57ec18b1319cdd10537076dd526f2ee304caac2924da`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Kế hoạch chốt sandbox PN–BNB — Blue-chan gửi Orange-kun

02/10/2026. **Chỉ lập kế hoạch theo yêu cầu mới nhất của người dùng; chưa triển khai các thay đổi bên dưới.** Ưu tiên sửa KO ở mép sân và điều khiển điện thoại, sau đó hoàn thiện hình/âm trước khi nối campaign.

Đọc cùng [kế hoạch map](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_map_battle_pixel) mục 10–11 và [kế hoạch VFX/âm](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_vfx_am_thanh_battle_e) mục 11–12. Không tự thay phần Orange-kun đang làm.

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

## 8. Phản hồi của Orange-kun (02/10/2026)

### A — KO tràn mép: phép đo đúng, Orange-kun đã đo sai trước đây

Đo lại (alpha ≥100, mọi frame mọi clip, pivot manifest, `SCALE 1,12 × depthK(240)=1,06`): PN vươn tối đa 104 px sprite (frame `hit#0`, không phải KO), BNB 105 px (`ko#2`). Ra màn hình là 123,5 / 124,7 px, trong khi khoảng trống ở x=110 chỉ 105,6 px. Tràn 17,9 / 19,1 px, khớp số của blue-chan. Câu “KO nằm vừa khung ở 110/890” trong lượt trước của Orange-kun là sai, vì chỉ kiểm hàng sau.

**Đề xuất phương án khác thay vì thu biên sim:** sửa **ánh xạ view**, giữ nguyên sim 110/890:

```
sx(x) = OX + x*KX,  KX = (960 − 2·127 − 0) / 780 ≈ 0,905,  OX = 127 − 110·KX ≈ 27,4
```

Khoảng trống ≥127 px màn hình ở cả hai biên (đủ 124,7 + 2). Ưu điểm: **không đổi gameplay**. Bench, AI và test hồi quy vẫn đúng, không phải đo lại cân bằng như bước A.5. Pivot, hitbox và contact cùng đi qua `sx`, nên không lệch giữa hình và va chạm. `toWorld` chỉ cần nghịch đảo `sx`. Nhược điểm: sân trông ngắn hơn khoảng 6% so với nhân vật, và nền phía ngoài 127 px là vùng không đi được. Cần vẽ map có mép tự nhiên (bụi trúc, đá) ở hai đầu.

Nếu blue-chan vẫn thích thu biên sim thì 132/868 là đủ cho hai asset hiện có (Orange-kun tính ra 131/132). Khi đó phải đo lại bench như mục 2.5. Orange-kun nghiêng về sửa view vì rẻ hơn. Bên nào triển khai thì báo trước để tránh sửa trùng `view.js`.

### B — Mobile: đồng ý phần lớn, có hai điểm cần sửa

1. **“Dừng không ngắt chiêu đã nhận” mâu thuẫn với runtime hiện tại.** Phím `S` đang gửi `{skill:'stop',cancel:true}`, nên nó *có* hủy startup (trừ chiêu armor) và nửa sau recovery, theo luật hủy bằng di chuyển. Nút Dừng trên điện thoại nên **giống hệt S**. Nếu không, hai nền tảng sẽ có hai luật khác nhau. Nếu sau này áp phí hủy 25% thì Dừng cũng chịu phí như S.
2. **Lướt hai bước (chọn ô → chạm sân) quá chậm cho một nút phản xạ.** Đề xuất: chạm ô Lướt thì lướt ngay theo hướng đang di chuyển (đích đi hiện tại). Nếu đang đứng yên thì lướt ra xa BNB theo trục x. Chỉ Nguyệt Mang dùng hai bước. Có thể thêm “giữ ô Lướt rồi kéo” để chọn hướng, làm sau.

Còn lại đồng ý: `selectedSkill` tách khỏi `aim` desktop, phân biệt theo `pointerType`, commit ở `pointerup`, một bộ Pointer Events, không có hàng đợi thứ hai trong UI, dọn trạng thái khi KO/blur.

Phối hợp file: Orange-kun **hiện không sửa** `input.js`/`hud.js`/`view.js`. Blue-chan có thể nhận B. Giữ `SBInput.tick()`, hành vi mũi tên (giữ không hủy, nhấn mới thì hủy) và S/Dừng có `cancel:true`.

## 9. Blue-chan tiếp nhận phần mobile sau review

Đã áp phần B theo mục 8: Dừng gọi cùng API với S, gửi stop/cancel:true và xóa phím hướng đang giữ; vẫn tôn trọng armor/cửa sổ hủy của sim. Lướt chạm dùng ngay theo hướng đi hoặc phím hướng, đứng yên lướt xa địch; nếu hướng đó bị chặn hoàn toàn ở biên thì đổi sang chiều sâu còn trống. Chỉ skill projectile (Nguyệt Mang trong kit hiện tại) có chọn ô rồi chạm sân để nhắm; có Hủy nhắm riêng, không mất phí. Vì vậy các đề xuất cũ “Lướt hai bước” và “Dừng không ngắt chiêu” ở mục 3/4 được thay bằng hành vi này.

Touch/pen phát lệnh ở pointerup ngón chính; pointercancel không phát, ngoài sân giữ lựa chọn và báo lỗi. Chọn touch tách aim chuột; bàn phím/chuột trực tiếp bỏ lựa chọn cũ. KO, blur, ẩn tab dọn lựa chọn. Không tạo queue UI khác; queued vẫn theo BUFFER hiện tại. Nút skill xử lý pointerup và click bàn phím, không nhân đôi lệnh bằng click tương thích sau touch. Listener input có AbortController để init lại không nhân đôi.

Đã có test logic production ở `tools/sandbox_input_regression.cjs`, chưa playtest DOM/trình duyệt hoặc điện thoại thật trong lượt này. Cần Orange kiểm lại HUD, thao tác trên thiết bị và cảm giác Lướt/Dừng. Phần A chưa áp: ưu tiên thử lề view 127px của Orange trước thu biên sim, nhưng phải đổi cùng mọi phép chiếu tầm/đạn/telegraph/input và kiểm ảnh bốn góc. Không đổi X0/X1 lúc này.


<a id="source-ke_hoach_can_bang_co_trung_va_bnb_theo_moc_truyen"></a>

## Nguồn: `KE_HOACH_CAN_BANG_CO_TRUNG_VA_BNB_THEO_MOC_TRUYEN.md`

SHA-256 trước gộp: `fd5a6fe7c9a4110b537754154d6f1cd1535b8a63699d4155d2990addc7aecfbc`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Kế hoạch cân bằng cổ trùng và BNB theo mốc truyện

Kế hoạch bổ sung theo yêu cầu hạn chế spam bằng tài nguyên: [Chân nguyên và nhịp dùng cổ](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chan_nguyen_va_nhip_dung_co). Theo review Orange-kun: ưu tiên phí cổ, dung lượng bể và phí Băng nhận; đo nguồn hồi cùng ngân sách trước khi thử giảm khóa chung 2s.

**Cập nhật triển khai 02/10/2026:** riêng thông số Thiên Bồng ở mục 5.1 đã áp vào sandbox theo yêu cầu người dùng; xem [ghi chú bàn giao](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_apply_thien_bong_3s). Các phần kế hoạch khác bên dưới chưa được coi là đã triển khai.

02/10/2026 — Blue-chan, gửi Orange-kun review. **Bản kế hoạch, chưa thay code hoặc thông số trận.** Yêu cầu: gặp BNB lần đầu có thể thắng trong nhánh VN nhưng rất khó; PN về sau mạnh lên nhờ tiến cảnh và bộ cổ đúng thời điểm. Di chuyển, chọn thời điểm vận cổ và quản lý chân nguyên phải có giá trị.

## 1. Đối chiếu truyện: những điểm phải sửa

Đối chiếu trực tiếp bản dịch chương truyện, không lấy bảng tóm tắt trong repo làm bằng chứng cuối cùng. Link dưới dẫn tới nội dung chương; tên Việt cần Orange-kun so lại với bản dịch đang dùng.

| Mốc | Điều đã xác minh | Hệ quả cho game |
|---|---|---|
| Ch.129 | PN phát hiện Cự Xỉ Kim Ngô hoang dã nhưng hoãn thu phục. Có tên chương không đồng nghĩa đã sở hữu cổ. | Không mở Cự Xỉ chỉ vì đã tới ch.129. [Chương 129](https://novelfull.com/reverend-insanity/chapter-129.html). |
| Ch.133–138 | PN đã gặp và giao đấu với BNB trước đoạn huyết hải. BNB tự áp chế nhị chuyển (ch.134); Lam Điểu Băng Quan đã dùng ở ch.136, Sương Yêu là cổ tam chuyển tăng công (ch.137). Cuộc truy đuổi có tiểu tổ Hùng Lực (ch.135–136) và người đuổi giết (ch.138), không phải PN thắng một BNB hoàn toàn khỏe bằng đấu đơn thuần. | Tách nhánh chủ động thách đấu lúc mới gặp khỏi tình huống BNB đã hao tổn. [Chương 134](https://www.webnovel.com/book/7996858406002505/25307329046038953), [chương 139 hồi thuật tình trạng BNB](https://www.wuxiaworld.eu/chapter/reverend-insanity-139). |
| Ch.139 | BNB tự nổ **tay phải** bằng Frost Demon Gu/Sương Yêu để thoát tình thế bị vây, tạo băng bảo vệ và hồi phục. Việc này xảy ra trước trận Thanh Thư đánh BNB. | Lúc mới gặp vẫn đủ hai tay. Sương Yêu không phải một cú lướt miễn phí được làm mới mỗi trận. [Chương 139](https://www.wuxiaworld.eu/chapter/reverend-insanity-139). |
| Ch.143 | Khi Thanh Thư biến thành cây và giữ BNB, PN dùng Cường Thủ/Plunder Gu đoạt lần lượt **Xích Thiết Xá Lợi, Thạch Khiếu và Thủy Tráo**. BNB được cứu, vẫn sống. | Thủy Tráo phải rời bộ cổ BNB sau sự kiện đoạt cổ; không tự cấp lại ở trận sau. **Thạch Khiếu đã xác nhận theo đối chiếu bản Việt của Orange-kun, mục 10.2.** [Chương 143](https://novelfull.com/reverend-insanity/chapter-143.html). |
| Ch.155 | PN hợp luyện Thiên Bồng tam chuyển. Lần đầu Bạch Ngọc + Thủy Tráo thất bại, Thủy Tráo chết; lần sau dùng cổ phòng ngự nước đổi bằng chiến công và Bạch Ngọc thì thành công. Cổ được gia tộc cấp là **Lôi Dực**, không phải Thiên Bồng. | Không có Thiên Bồng ở lần gặp đầu. Sau hợp luyện không giữ thêm bản Bạch Ngọc cũ để luân phiên hộ thể, trừ khi nhánh VN thực sự kiếm bản khác. [Chương 155](https://www.pyg-kit.com/en/books/reverend-insanity/chapters/78109). |
| Ch.166 | Tên chương là **lần giao đấu thứ hai**. PN dùng Thiên Bồng, Cự Xỉ, Lôi Dực và nguyệt nhận màu máu. BNB một tay có phòng ngự cơ băng, Blue Bird Ice Coffin và **Icicle Gu/Băng Trùy**. | Băng Trùy có ở Q1 muộn. Nhận định cũ của Blue-chan rằng nên bỏ khỏi toàn Q1 là quá rộng, cần sửa. PN đã có khả năng áp đảo cận chiến trước đoạn cưỡi nhện lên mặt đất. [Chương 166](https://www.wuxiaworld.eu/chapter/reverend-insanity-166). |
| Ch.173 | Bạch Tướng Tiên Xà là cổ **ngũ chuyển**, xuất hiện từ linh tuyền Bạch gia và vào không khiếu BNB. | Chỉ đưa vào giai đoạn muộn; tên có chữ “tiên” không biến nó thành cổ lục chuyển. [Chương 173](https://www.wuxiaworld.eu/chapter/reverend-insanity-173). |
| Ch.190 | Đây là **lần giao đấu thứ ba**, lúc PN lên bằng Thousand Li Earthwolf Spider. Rắn trắng chưa được BNB luyện hóa, bị thể chất Bắc Minh Băng Phách thu hút; sau va chạm với nhện nó phun sương rồi bỏ đi. | Rắn là tác nhân tự chủ của màn, không phải nút đại chiêu ngũ chuyển BNB có thể spam. Nhện cũng không mặc định là thú cưỡi chiến đấu hoàn toàn nghe lệnh. [Chương 190](https://www.pyg-kit.com/en/books/reverend-insanity/chapters/78144). |

Ba gia tộc trên Thanh Mao Sơn là **Cổ Nguyệt, Bạch, Hùng**; Xích và Mạc là phe nội bộ Cổ Nguyệt. Không gọi hội ba nhà là “Xích–Mạc–Cổ Nguyệt”. Chương 173 nêu rõ ba gia tộc và linh tuyền của họ ở đoạn đối thoại đầu. Tên nhện trong bản Anh là Thousand Li Earthwolf Spider; cần đối chiếu tên Việt Thiên Lý Địa Lang Chu, tránh dùng “Thiên Địa Lang” cho một con sói.

**Phân biệt hai điều:** người dùng nhớ đúng việc PN chưa có Thiên Bồng khi mới gặp BNB và đoạt cổ trong trận Thanh Thư. Nhưng PN không chỉ giao đấu sau khi từ huyết hải đi lên; có thêm trận ch.166 ở giữa. BNB mất tay không đồng nghĩa mọi trận sau đều yếu: hắn thôi áp chế tu vi, có thêm phương thức đánh và về sau có rắn trắng.

## 2. Sai lệch hiện tại và nguyên nhân Thiên Bồng dễ thắng

Đã đọc `js/sandbox/kits.js`, `sim.js`, và nhánh `c_bai` trong `js/events.js`:

- Sandbox nạp một bộ cố định: PN 220 HP; BNB 300 HP. PN có 8 action: đánh tay, Nguyệt Mang, Bạch Ngọc, Cự Xỉ, Cường Thủ, Thiên Bồng, lướt, Sinh Mệnh Diệp. BNB có 5 action: Băng nhận, Lốc băng nhận, Thủy Tráo, Sương Yêu, lướt. Đây là số action, không phải số cổ sở hữu.
- Bộ đó trộn nhiều giai đoạn: PN vừa có Bạch Ngọc vừa có Thiên Bồng; BNB còn Thủy Tráo và Sương Yêu bất kể đã mất cổ/tay. BNB cũng thiếu Lam Điểu đã có từ ch.136 và Băng Trùy xác minh ở ch.166.
- `c_bai` đã cho lựa chọn quyết chiến ngay lần gặp; sau sự kiện mới lên lịch `c_kimngo` nếu chưa sở hữu. Sandbox chưa tự lấy bộ cổ từ trạng thái VN. Phải sửa cả đường nối encounter, không chỉ thay kit demo rồi coi campaign đã đúng.
- Thiên Bồng hiện vận 0,40s, giảm 65% sát thương trong 5s, tốn 18 chân nguyên một lần, CD 14s. Hộ thể không tốn duy trì, vẫn cho di chuyển và ra chiêu sau recovery. Đánh thường BNB 24 còn khoảng 8; Lốc 96 còn khoảng 34 khi không có xuyên giáp.
- `a.shield` chỉ có một ô nên không cộng dồn hai giáp; **luân phiên** Bạch Ngọc/Thiên Bồng vẫn là vấn đề. CD chung 2s ngăn kích hoạt dồn, không ngăn hộ thể đã bật tồn tại trong lúc tung đòn khác.
- Tester báo mở Thiên Bồng thắng chế độ thường: ghi nhận là phản hồi người chơi, chưa chứng minh mọi chiến thuật đều thắng 100%. Cần tái hiện thao tác đó sau khi sửa đúng kit.

Ưu tiên sửa sai thời điểm trước. Không tăng máu boss để bù cho việc PN đang được dùng cổ chưa có. Sandbox `red` là tỷ lệ **giảm** sát thương; một số bảng battle cũ dùng hệ số sát thương **còn lại**. Khi đồng bộ phải kiểm tra công thức, không sao chép số giữa hai hệ.

## 3. Tách hồ sơ trận theo tiến trình

### 3.1. Ba màn game người dùng đang nói tới

Thống nhất cách gọi **màn game**, không thay cách đánh số của chương truyện:

1. Màn 1: lần đầu gặp BNB (`c_bai`), cho chọn chủ động đánh hoặc rút lui.
2. Màn 2: Thanh Thư đối đầu BNB (`c_lang2`), cho chọn giúp/cứu Thanh Thư. Code hiện có “Xông lên cùng Thanh Thư” và “Giữ tay Thanh Thư”; lựa chọn sau cần quan sát (`soi_tt`) và quan hệ ít nhất 30. Thắng nhánh cứu thì Thanh Thư sống và BNB rút lui; đây là nhánh VN khác truyện.
3. Màn 3: đoạn PN cưỡi nhện lên mặt đất, đối đầu BNB và rắn trắng ở ch.190.

Truyện còn cuộc PN–BNB ch.166 giữa màn 2 và màn 3. Khi chỉ giữ ba màn trên, phải ghi rõ trận ch.166 chưa được biểu diễn thành một màn riêng; không gộp bộ cổ tam chuyển của nó ngược vào màn Thanh Thư. Chưa tự xóa/gộp sự kiện ch.166 trong code ở lượt lập kế hoạch này.

### 3.2. Hồ sơ bộ cổ chỉ dành cho boss; PN đọc inventory người chơi

**Chốt theo người dùng:** encounter chỉ cấu hình bộ cổ của boss. PN không nhận bộ cổ cố định, không bị lọc theo danh sách cổ của một chương hoặc một màn. Khi vào trận, tạo action từ cổ thực sự sở hữu trong save (hiện dùng `S.gu`), tu vi/tài nguyên thực tế và vật phẩm còn lại. Người chơi có gì hợp lệ thì dùng đó, kể cả kiếm sớm hoặc khác tuyến gốc qua nhánh VN.

Mốc truyện dùng để kiểm tra logic **sự kiện nhận, mất, hợp luyện**; không dùng để cấm cổ đã sở hữu khi bắt đầu encounter. Battle không tự cấp Thiên Bồng cho PN, cũng không tước Thiên Bồng nếu người chơi đã hợp luyện hợp lệ trước đó. Cổ chưa có adapter battle phải báo rõ chưa hỗ trợ và bổ sung adapter, không lặng lẽ loại vì không nằm trong bộ mẫu. Giữ lựa chọn trang bị hiện có của người chơi nếu game có cơ chế đó, không thêm giới hạn slot ở kế hoạch này.

| Hồ sơ đề xuất | PN | BNB | Mục tiêu |
|---|---|---|---|
| `bnb_first_meeting` | Đọc inventory/save thực tế, không cấp hoặc cấm cổ theo màn. | Đủ hai tay, bộ cổ trước khi bị đoạt. **Áp chế nhị chuyển đã xác minh ch.134**; Băng nhận, Thủy Tráo, Sương Yêu tăng công và Lam Điểu Băng Quan. Cổ tam chuyển vận bằng chân nguyên nhị chuyển có phí cao; không coi Lam Điểu chỉ xuất hiện muộn. | Đấu đơn chủ động rất khó nhưng có cửa thắng nhờ đọc đòn, né, tiết kiệm chân nguyên. |
| `bnb_exhausted_pursuit` | Đọc inventory/save thực tế, không thay bằng bộ mẫu. | Đã hao tổn sau giao đấu với tiểu tổ Hùng Lực và truy đuổi; đủ tay cho tới sự kiện ch.139. | Nếu làm nhánh này, thắng nhờ thời cơ và địa hình, không lấy làm chuẩn sức mạnh boss khỏe. |
| `bnb_qingshu_rescue` | Đọc inventory/save thực tế. Hỗ trợ Thanh Thư có tác dụng giữ chân, mở sơ hở hoặc gánh đòn. | Trong đoạn ch.139–143 chuyển từ hai tay sang một tay khi nổ Sương Yêu; Thanh Thư và Phương Chính có mặt ở ch.139. Thôi áp chế và dùng bạch ngân từ ch.140; Lam Điểu vẫn có. Ở pha sau tự bạo đã mất tay phải; nếu nhánh VN thay đổi sự kiện tự nổ tay thì đọc trạng thái thực tế. Thủy Tráo còn trước khi bị đoạt, mất sau khi đoạt. | Cho phép cứu Thanh Thư; thắng không tự cấp các cổ PN chưa đoạt. |
| `bnb_second_battle` | Đọc inventory/save thực tế; không tự cấp các cổ PN dùng ở ch.166 cho người chơi chưa có. | Một tay; Băng nhận, Băng Trùy, Blue Bird Ice Coffin; cơ băng làm cơ sở phòng ngự. Không cấp lại Thủy Tráo/Sương Yêu đã mất theo tuyến gốc. | BNB biết đổi cận chiến sang đánh xa; PN mạnh theo tiến trình người chơi. |
| `bnb_third_battle` | Đọc inventory/save thực tế và trạng thái nhánh. | Một tay, bộ muộn; rắn trắng là sự kiện riêng. | Giao đấu/thoát vây trong biến cố, có tác nhân rắn–nhện và sương. Làm sau khi đấu đơn ổn. |

Đây là danh sách nền cho boss, chưa phải toàn bộ cổ đã xác minh. Orange-kun cần lập hai bảng: `boss → encounter/trạng thái → cổ sở hữu` và `cổ PN → sự kiện nhận/hợp luyện/mất → adapter battle`. Bảng PN không có whitelist theo encounter. Đối chiếu từng ID Việt trước khi gen thêm clip. Không mở cổ chỉ bằng số chương hoặc turn. Chọn “thường/khó” thay AI và độ dung sai, không thay inventory người chơi.

Nhánh VN thắng sớm được phép khác truyện, nhưng phải ghi hậu quả: thắng nghĩa là ép lui, thoát thân hay giết? Đề xuất mặc định **ép BNB rút lui**, không tự trao toàn bộ cổ. Nếu thật sự giết/đoạt cổ, các sự kiện Thanh Thư và trận sau phải rẽ nhánh theo; không cho BNB sống lại và có đủ cổ cũ.

## 4. Luật vận cổ: mạnh phải có thời điểm sử dụng

Giữ luật người dùng đã chốt: một action kích hoạt tại một thời điểm; khi phát chiêu, các cổ khác đang sẵn sàng nhận CD 2s; cổ đang CD giữ thời gian còn lại. Đánh tay, đi, dừng và lướt giữ ngoại lệ hiện tại. Hủy trước release không tự áp CD chung 2s. Hộ thể đã bật có thể cùng tồn tại với action khác nếu loại hộ thể đó cho phép.

Thêm dữ liệu rõ: `startup`, `rootDuringStartup`, `interruptible`, `upkeepPerSecond`, `channel`, `maxDuration`. Đứng yên nghĩa là khóa tọa độ actor trong thời gian quy định; pose đổi không được làm phát sinh damage trước release.

| Loại | Quy tắc thử | Lựa chọn của người chơi |
|---|---|---|
| Đạn thường/đòn nhanh | Vận ngắn; khóa di chuyển trong action theo hiện trạng, không áp thêm thời gian đứng yên kéo dài. | Dùng để thăm dò và phạt sơ hở. |
| Hộ thể mạnh | Đứng yên vận rõ trước khi giáp có hiệu lực. Sau vận được di chuyển/đánh, nhưng mất chân nguyên duy trì và có thời hạn. | Tìm khoảng trống để bật; không được bảo vệ ngay khi mới bấm. |
| Chiêu diện rộng mạnh | Đứng yên vận, báo vùng trước; vùng chốt trước phát đòn, không bám mục tiêu tới sát release. | Đối thủ có thể ra khỏi vùng hoặc áp sát ngắt vận. |
| Chiêu duy trì mạnh | Phải đứng yên suốt channel; không thực hiện action khác. Đi/lướt/dừng là lệnh hủy channel có chủ đích. | Đánh đổi vị trí và thời gian để đổi lấy hiệu lực. |
| Hồi phục | Đứng yên vận 0,8–1,0s cho lá hồi lớn; có thể bị ngắt. | Rút khỏi tầm địch rồi chữa, không vừa áp sát vừa hồi ngay. |

**Không bắt mọi cổ đứng yên lâu.** Nhịp trận đến từ chiêu nhanh xen chiêu mạnh, không phải ai cũng chờ thanh vận. Không cấp miễn ngắt vận cho mọi chiêu mạnh. Phân biệt nhận sát thương với bị stagger; phải xét cửa sổ chống stagger hiện có 1,2s, nếu bỏ qua nó thì thêm `interruptible` cũng chưa tạo phản đòn thật.

Chi phí cần chống trò hủy vận miễn phí: bản thử giữ chỗ chi phí lúc bắt đầu, trừ chính thức tại release; tự hủy mất 25% chi phí kích hoạt đã giữ, còn lại trả về. Bị ngắt cũng mất 25% để cùng một quy tắc. Đây là **đề xuất mới**, cần Orange-kun review; không âm thầm thay luật tiêu hao cũ. Chiêu duy trì trừ theo simulation clock, hết chân nguyên thì tắt ngay; không để xuống âm. Lá tiêu hao mất lượt ở lúc bắt đầu như hiện trạng, không đồng thời trừ thêm hai lần.

Đạn đã phát không biến mất vì người thi triển đi hoặc dùng chiêu mới. Channel dừng chỉ xóa phần hiệu ứng chưa phát. KO, pause, kết trận giữ đúng hợp đồng dọn event hiện tại.

## 5. Bản thử cân bằng Thiên Bồng và bộ chiêu

Các con số dưới là **thiết kế gameplay**, không phải tốc độ/thời gian trong truyện. Thử từng nhóm, không đồng thời nerf toàn bộ PN và buff toàn bộ BNB.

### 5.1. Thiên Bồng — vừa tiêu hao duy trì, vừa rút thời hạn

**Cập nhật theo người dùng:** không giữ bản 5s miễn phí duy trì, cũng không chỉ thêm upkeep mà giữ nguyên thời hạn 5s. Lượt thử đầu áp dụng cả tiêu hao duy trì và thời hạn ngắn hơn. Thông số lượt A bên dưới đã áp sandbox; các phương án tiếp theo vẫn là đề xuất cần đo.

- Vận từ 0,40s lên **0,90s**, đứng yên, có thanh vận và âm báo. Giáp chỉ bật tại release. Recovery thử giữ 0,30s.
- Lượt thử A giữ giảm **65%**, rút thời hạn tối đa từ 5s xuống **3s**, phí bật **18**, CD **14s**. Thời hạn tính từ release, không tính lúc đang vận.
- Duy trì thử **5 chân nguyên/s**; tắt regen chân nguyên khi đang duy trì. Hủy hộ thể được bằng nút riêng, không dùng nút D như một lần thi triển mới tốn action/CD chung. HUD hiển thị cả thời hạn và tiêu hao.
- Duy trì đủ 3s tốn thêm 15, tổng phí **33 chân nguyên**; tắt sớm chỉ trả phần duy trì thực tế, không thu cả 15 ngay lúc bật. Chưa có giáp trong 0,9s đang vận.
- Hết chân nguyên, hết thời hạn hoặc KO thì giáp tắt. Hộ thể không hồi máu, không miễn đẩy lùi/stagger mặc định. DOT giữ quy tắc hiện tại và phải ghi trong tooltip; không tự thay giữa các trận.
- Nếu vẫn thống trị, lượt thử B giảm còn **55–60%**; sau bản A chỉ chỉnh một biến mỗi lượt. Nếu PN quá yếu thì giảm upkeep hoặc startup trước khi tăng damage địch bù trừ; vẫn giữ yêu cầu có phí duy trì và thời hạn dưới 5s.
- Adapter PN chỉ tạo Thiên Bồng khi inventory có nó. Sự kiện hợp luyện phải tiêu thụ đúng nguyên liệu; nếu người chơi kiếm thêm Bạch Ngọc hợp lệ thì vẫn được dùng cả hai cổ theo quy tắc hộ thể. Save cũ nghi dư cổ phải kiểm tra lịch sử nhận/hợp luyện; không tự xóa chỉ vì đang ở màn sớm.

### 5.2. Bộ cổ còn lại

- Bạch Ngọc là phòng ngự cấp thấp hơn, vận nhanh và hiệu lực nhỏ hơn Thiên Bồng. Khi thiết kế thành hộ thể duy trì phải có upkeep riêng; không để nó là bản hộ thể miễn duy trì thay thế Thiên Bồng.
- Sinh Mệnh Diệp: thử vận 0,90s và giữ heal 50/lượt, tối đa 2 nếu người chơi có hai lá. Không đổi heal lẫn số lượt cùng một lần đo.
- Lốc băng nhận: giữ telegraph và vận 1,15s để đo; kiểm tra cách dùng dạng xoay quanh BNB so với vùng chọn từ xa hiện tại. Nếu đổi vị trí phát là đổi cả cơ chế, cần benchmark riêng. Không coi vòng nổ từ xa hiện tại là tái hiện nguyên tác đã xác minh.
- Băng Trùy muộn: đạn băng định hướng, thời gian bay hữu hạn, báo hướng và có thể né; đòn rải/bắn liên tiếp phải là một action trả phí cho cả loạt.
- Blue Bird Ice Coffin muộn: đạn mạnh vận thử 0,9–1,2s; nổ có báo hiệu, tốn chân nguyên lớn. Cần test tương tác chặn đạn/nguyệt nhận như ch.166, không cho boss một loạt đạn tức thì không phản ứng được.
- Cơ băng: dùng làm cơ sở phòng ngự BNB, đề xuất kháng chảy máu ở mức hữu hạn. Không chốt là vô địch hoặc tự hồi đầy máu; xác minh cổ/đặc tính trước khi đặt ID và effect.
- Cường Thủ/Plunder: truyện là đoạt cổ, trong sandbox đang gây damage và kéo người. Cần ghi rõ đây là chuyển thể; không dùng nó như bằng chứng PN có cổ “tay khổng lồ”. Cơ chế đoạt cổ giữa trận nên làm riêng sau, vì ảnh hưởng inventory và các nhánh truyện.
- Sương Yêu: bỏ cách hiểu “thoát thân miễn phí một lần mỗi trận”. Trận đầu nếu có cứu mạng bằng tự hủy phải gắn hậu quả mất tay phải/mất cổ và giữ qua tiến trình. Chưa triển khai trước khi có nhánh truyện và asset tương ứng.

### 5.3. Bộ cân bằng chung cho cổ thường

Mục tiêu người dùng: cổ bình thường không được thành lựa chọn phá trận chỉ vì code bỏ chi phí hoặc cho phát tức thì. Cổ đặc biệt mạnh theo truyện được giữ bản sắc; Cự Xỉ thuộc nhóm khá mạnh, không mặc định coi là ngoại lệ vô hạn. Toàn Lực Ứng Phó Q2 là ví dụ người dùng muốn giữ ưu thế đặc biệt, cần đặc tả/đối chiếu riêng trước khi áp dụng ở Q2.

Mỗi cổ cần một dòng trong bảng cân bằng: chuyển số, mốc sở hữu, công dụng, loại tiêu hao, startup/recovery, CD, tầm/diện tích, thời hạn, điều kiện ngắt, cách khắc chế, nguồn truyện và số liệu playtest. Các loại chi phí:

| Công dụng | Cách trả tài nguyên | Ràng buộc cân bằng |
|---|---|---|
| Phát đạn/ra đòn một lần | Phí mỗi lần phát; loạt đạn tính phí cho cả loạt | Đạn có đường bay/tầm hữu hạn; mạnh hơn phải trả bằng vận, phí hoặc điều kiện trúng. |
| Hộ thể/vùng hiệu lực duy trì | Phí bật + phí theo thời gian; hết tài nguyên tự tắt | Có thời hạn; không bị regen bù sạch upkeep; không cộng dồn giáp cùng nhóm. |
| Chiêu channel | Tiêu hao theo thời gian channel và phí bật nếu có | Khóa action khác, điều kiện đứng yên rõ, hủy dọn phần chưa phát. |
| Cổ tăng lực đã cải tạo cơ thể | Không tự gán upkeep cho sức mạnh cơ thể đã tích lũy | Cân qua điều kiện sở hữu, mức tăng, tầm/nhịp đòn; phân biệt với cổ phải vận liên tục. |
| Cổ/lá dùng một lần | Trừ vật phẩm hoặc số lượt | Không tự tái tạo hai lá miễn phí ở mọi trận campaign. |

Tổng hiệu quả phải tính cả hit rate, thời gian vận, cơ hội né, chân nguyên ròng và uptime; không chỉ so damage hoặc phần trăm giảm sát thương. Ngoại lệ sức mạnh truyện phải ghi tên và lý do, không dùng nhãn “cổ mạnh” để bỏ hết giá phải trả. Kể cả ngoại lệ cũng cần đúng quyền sở hữu, tài nguyên và tương tác, tránh nhầm bug với sức mạnh nguyên tác.

## 6. Boss khó vì biết đánh, không chỉ vì máu nhiều

Thử AI cho từng hồ sơ ngay ở mức thường; không giấu toàn bộ phản ứng hợp lý trong `lvl=kho`.

1. Thấy PN vận hộ thể/hồi phục: nếu đủ gần thì tiến vào ngắt bằng đòn phù hợp; nếu xa thì chặn đường hoặc vận đạn. Có trễ phản ứng ít nhất khoảng 0,2–0,35s, chỉ đọc tín hiệu đã hiện.
2. PN đã bật Thiên Bồng: tránh đổ toàn bộ chân nguyên vào giáp; giữ cự ly, ép PN duy trì, trừng phạt lúc giáp tắt. Không luôn bỏ đánh vì sẽ thành chờ hết buff nhàm chán.
3. Mất lợi thế cận chiến trước Cự Xỉ: hồ sơ muộn chuyển sang Băng Trùy/điểu băng và đổi độ sâu, thay vì lao vào đánh tay liên tục.
4. Lốc chỉ dùng khi có khả năng trúng, dựa vào vị trí/vận tốc đã quan sát; không đọc tọa độ người chơi sẽ bấm và không theo mục tiêu từng tick.
5. Chân nguyên có hạn, AI dùng cùng chi phí/CD/luật vận với PN. Tu vi/thể chất có thể cho lợi thế pool/regen theo hồ sơ, nhưng các con số là cân bằng game và phải công khai.

Chưa tăng HP khỏi 300 trong lượt đầu. Sau tách kit + sửa hộ thể + AI, nếu boss vẫn quá dễ mới thử HP tăng 10–15% hoặc regen điều chỉnh riêng. Không thêm cổ ngoài thời kỳ chỉ để làm boss trâu. Trận đầu khó hơn **tương đối với bộ PN lúc đó**; trận rắn muộn vẫn có thể nguy hiểm tuyệt đối, không ép mọi trận sau thành dễ.

## 7. Thứ tự triển khai cho Orange-kun

| Bước | Bàn giao | Điều kiện đi tiếp |
|---|---|---|
| CB-01 | Bảng nguồn/ID cổ, hồ sơ boss theo encounter; mapping sự kiện nhận/mất/hợp luyện của PN và adapter inventory | Battle không tự cấp/tước cổ PN; mất tay/đoạt cổ boss không bị reset. |
| CB-02 | Sandbox chọn hồ sơ boss; PN lấy từ save hoặc snapshot inventory được chọn rõ trong chế độ test | Xuất inventory/tu vi/resource và hồ sơ boss trong report; default trang ghi rõ đang thử trận nào. |
| CB-03 | Root khi vận, HUD thanh vận, upkeep Thiên Bồng, hủy/chi phí rõ | Hồi quy timing, CD chung, pause và kết trận đạt. |
| CB-04 | AI nhận biết vận/giáp, bổ sung Lam Điểu từ hồ sơ đầu và Băng Trùy ở hồ sơ muộn | Đạn và vận đọc được ở kích thước điện thoại; không có phản ứng trước tín hiệu. |
| CB-05 | Đo đối chứng, tester chơi lại thao tác mở Thiên Bồng; cân số theo kết quả | Chiến thuật đứng spam không thống trị; đi/né/vận đúng lúc tốt hơn. |
| CB-06 | Nối trạng thái campaign, save cũ, kết quả VN; sau đó mới màn rắn–nhện | Không lẫn sandbox demo với tích hợp campaign đã hoàn tất. |

Asset bổ sung: BNB một tay dùng đúng tay còn lại; không lật pose hai tay rồi gọi là đã cụt tay. Giáp Thiên Bồng theo mô tả ánh trắng thay vì mặc định vàng. Rắn/nhện và vùng sương làm ở CB-06, chưa bắt gen ngay.

## 8. Kiểm thử và tiêu chí nghiệm thu

- Snapshot inventory PN trước/sau nhận, đoạt và hợp luyện; snapshot boss trước/sau mất tay, mất cổ. Kiểm tra trận đọc đúng save, không cấp cổ thiếu, không lọc cổ hợp lệ theo encounter. Có ca người chơi hợp lệ kiếm cổ sớm/khác tuyến gốc. Save cũ nghi sai được báo và kiểm tra nguyên nhân, không tự chuẩn hóa PN về bộ cổ mẫu hay xóa tiến trình.
- Giáp chưa có trước release; đang root không dịch chuyển; đi/chạm để hủy trả đúng phí. Đạn không phát lại do hủy hoặc tab bị ẩn.
- CD chung 2s chỉ đặt cho cổ sẵn sàng tại release; đang còn 0,5s CD vẫn còn 0,5s, không bị đổi thành 2. Tiêu hao giữ/trừ/hoàn không hai lần.
- Đo upkeep/regen ở tốc độ trận và FPS khác nhau, pause/resume; hết chân nguyên tắt giáp đúng tick; KO dọn channel, âm và vùng chờ.
- Giữ test kết quả trận chốt một lần, hai bên chết cùng tick, đạn cuối và trạng thái đang lướt. Không đưa bug cũ trở lại khi bổ sung charge/channel.
- Benchmark mỗi hồ sơ/độ khó với ít nhất 5 seed × 300 trận cho các chính sách: đứng đánh, spam ưu tiên, di chuyển đọc đòn; thêm đối chứng “mở Thiên Bồng” và “không mở”. Báo timeout, số hủy vận, chi phí giáp và số đòn né; không gọi tỷ lệ bot là tỷ lệ thắng của mọi người chơi.
- Mục tiêu playtest ban đầu: trận đầu người mới thường thua nhưng hiểu lý do, người biết né và quản lý tài nguyên có thể thắng; trận ch.166 cho thấy PN tiến bộ rõ. Không đặt kết quả bắt buộc bằng script.
- Sau mỗi thay đổi một nhóm, tester thực chơi lại trên thường và khó, cả chuột lẫn cảm ứng. Cửa sổ vận và đạn phải đủ để chạm né; chưa được coi PC đạt là mobile đạt.

## 9. Orange-kun cần review/chốt

Ưu tiên phản hồi CB-01 trước code: mapping ba màn game ở mục 3.1, có áp chế tu vi lúc gặp đầu hay không, và cổ PN thật sự sở hữu tại từng nhánh. Sau đó review lượt thử A của Thiên Bồng (3s, phí bật 18 + duy trì 5/s, vận 0,9s), bảng cân bằng chung mục 5.3, phí hủy vận 25%, phạm vi ngắt vận khi đang có poise, và chiến thắng sớm được hiểu là ép lui hay giết. Các lựa chọn này phải ghi vào dữ liệu/hợp đồng event trước khi đo cân bằng.

Lưu ý tài liệu cũ: `CHI_TIET_NGUYEN_TAC_Q1.md` ghi “mượn Thiên Bồng” và thu phục Cự Xỉ trong đoạn ch.129–155; không tiếp tục suy kit từ các dòng đó. Ghi chú bộ chiêu sandbox cũ “chưa xác minh Băng Trùy Q1” cũng đã được bổ sung bằng ch.166 ở mục 1 trên.

## 10. Review của Orange-kun (02/10/2026)

Đối chiếu bằng bản dịch Việt đang dùng (`cochannhann.pages.dev/api/chapters/<n>`, các ch.133–143, 155, 166).

### 10.1. Đúng, giữ nguyên

- Ch.139 (“Cụt tay”): BNB dồn toàn bộ chân nguyên vào **Sương Yêu cổ ở lòng bàn tay phải**, cho nổ **cả cánh tay phải**; băng sương thành lớp vỏ bảo vệ để hắn hồi phục. Thanh Thư và Phương Chính có mặt.
- Ch.143: PN dùng **Cường Thủ cổ** (nhị chuyển) để đoạt cổ trên người BNB đang hấp hối. Đúng nhận định “Cường Thủ là đoạt cổ, kéo người trong sandbox là chuyển thể”.
- Ch.155: lần đầu hợp luyện Thủy Tráo + Bạch Ngọc thất bại, Thủy Tráo chết. Lần sau Bạch Ngọc + một cổ phòng ngự hành thủy ra **Thiên Bồng tam chuyển**. Cổ gia tộc thưởng khi lên tam chuyển là **Lôi Dực**.
- Ch.166 (“Lần thứ hai chiến BNB”): BNB dùng **Băng Trùy cổ** cùng đàn chim băng, sau đó **Lam Điểu Băng Quan**; băng cơ gần tan rã. Bỏ nhận định “Băng Trùy không có ở Q1” là đúng.
- Ba gia tộc Cổ Nguyệt / Bạch / Hùng: đúng.

### 10.2. Lỗi cần sửa trong bảng mục 1 và hồ sơ mục 3.2

1. **Ch.143 đoạt được ba cổ, không phải hai.** Thứ tự: Xích Thiết Xá Lợi → **Thạch Khiếu cổ** (“con bọ cánh cứng màu xám tro”, PN luyện hóa rồi cất vào ngực) → Thủy Tráo. Dòng “chưa xác nhận được Thạch Khiếu” cần sửa thành **đã xác nhận**.
2. **Lam Điểu Băng Quan không phải cổ “muộn”.** Ch.136 BNB đã phun nó ra đánh tiểu tổ Hùng Lực: cổ tam chuyển, chim xanh tự định vị địch, khác nguyệt nhận. Ch.140: BNB “chỉ có hai con cổ tam chuyển”, sau khi hy sinh Sương Yêu “chỉ còn lại Lam Điểu Băng Quan”. Ch.143: nó “đang sống nhờ nơi cổ họng”. Nên hồ sơ `bnb_first_meeting` và `bnb_qingshu_rescue` đều **có** Lam Điểu. Ở trận đầu đang áp chế nhị chuyển thì dùng nó tốn rất nhiều (xem điểm 4).
3. **Sương Yêu không phải cổ thoát thân.** Ch.137: Sương Yêu là cổ tam chuyển **tăng công**, xuyên phòng ngự của PN. Dùng quá độ thì tự hại (thấp khớp, cơ đông cứng), cần băng cơ phối hợp. Ch.143 thêm: nó cho người dùng “hóa thân thành sương yêu”, dùng lâu sẽ thành tượng băng. Còn “thoát thân” ở ch.139 là **cho nổ Sương Yêu + tay phải**, làm cổ chết hẳn (ch.140: “hi sinh Sương Yêu cổ”, phải hợp luyện ba lần mới thành). Nguồn `src:'ch136: hy sinh Sương Yêu cổ để thoát'` trong `kits.js` là **sai chương** (đúng là ch.139–140) và sai bản chất. Lỗi này do Orange-kun ghi, cần sửa.
   - Ghi chú: ch.143 vẫn có câu “có giá trị nhất là Sương Yêu cổ”, mâu thuẫn với ch.140. Theo ch.140 vì câu đó nói rõ cổ đã nổ; đánh dấu đây là điểm lệch của bản dịch/tác giả.
4. **Áp chế tu vi trận đầu: có, đã xác minh.** Ch.134 BNB tự nói sẽ áp chế xuống nhị chuyển để “đấu công bằng”, và dùng chủ yếu cổ nhị chuyển (ch.135). Ch.137 cưỡng ép Sương Yêu bằng chân nguyên nhị chuyển, tốn lượng lớn. Ch.140: bị “bức bách phải dùng chân nguyên bạch ngân”, tức là từ đoạn cụt tay hắn đã thôi áp chế. Trả lời câu hỏi mục 9: `bnb_first_meeting` = **áp chế nhị chuyển**, pool > PN, cổ tam chuyển dùng được nhưng rất đắt.
5. Bảng mục 1 dòng ch.133–138 nói cuộc truy đuổi đầu “có yếu tố lợi dụng các trận đánh khác”. Đúng: ch.135–136 có tiểu tổ Hùng Lực đánh BNB, ch.138 có thêm người đuổi giết. Nên ghi tên cụ thể để hồ sơ `bnb_exhausted_pursuit` có cảnh.

### 10.3. Hồ sơ boss đề xuất sau khi sửa (chỉ boss, PN vẫn đọc inventory)

| Hồ sơ | Tay | Tu vi dùng | Cổ BNB | Ghi chú |
|---|---|---|---|---|
| `bnb_first_meeting` (ch.134–137) | 2 | áp chế nhị chuyển | Băng nhận, Thủy Tráo, Sương Yêu (tăng công, tự hại), Lam Điểu Băng Quan (đắt) | Sương Yêu nên là **buff tăng công có giá** (máu/chậm sau khi tắt), không phải lướt |
| `bnb_qingshu_rescue` (ch.139–143) | 2 → 1 trong trận | thôi áp chế (bạch ngân) | như trên; nổ Sương Yêu = sự kiện mất tay, sau đó chỉ còn Lam Điểu là cổ tam chuyển | Nổ tay hợp làm **mốc chuyển pha** (vỏ băng hồi phục, hất lùi). Nhánh “cứu Thanh Thư” chen vào đây |
| `bnb_second_battle` (ch.166) | 1 | tam chuyển | Băng nhận một tay, Băng Trùy, Lam Điểu, băng cơ | Không còn Thủy Tráo (bị đoạt ch.143), không còn Sương Yêu |
| `bnb_third_battle` (ch.190) | 1 | tam chuyển | như trên + rắn trắng là tác nhân màn | Làm sau |

### 10.4. Về Sương Yêu trong sandbox hiện tại

Người dùng đã chốt trước đây: “giữ Sương Yêu làm chiêu thoát thân, 1 lần/trận là chuyển thể”. Blue-chan đề xuất bỏ cách hiểu này. Theo căn cứ ở 10.2 điểm 3, Orange-kun **đồng ý với blue-chan về hướng**, nhưng đây là thay đổi quyết định của người dùng nên ghi vào mục cần quyết định, không tự sửa runtime. Gợi ý thay thế giữ được tinh thần “boss có đường thoát”: ở hồ sơ trận đầu, khi BNB dưới ~30% máu thì nổ tay phải: vỏ băng hồi phục vài giây, hất lùi, rồi chuyển sang pha một tay (`bnb_qingshu_rescue`). Thắng trận đầu = **ép BNB rút lui**, đúng đề xuất mặc định ở mục 3.2.

### 10.5. Ý kiến về các đề xuất khác

- Mục 4, phí hủy vận 25%: **đồng ý có điều kiện.** Hủy miễn phí là thiết kế của Orange-kun để di chuyển được ưu tiên hơn spam. Đề xuất: miễn phí khi hủy trong **0,15s đầu** startup (sửa bấm nhầm, bước né sớm), sau đó mất 25%. Đánh tay vẫn phí 0. Lý do: AI Khó đọc startup ≥0,2s rồi né, nên nhử rồi hủy đúng là cách lạm dụng; mốc 0,15s chặn được nhử mà không phạt né phản xạ.
- Mục 4, bảng “Đứng yên khi vận”: hiện mọi action `act` đã đứng yên. Chỉ cần thêm cờ cho chiêu được phép đi trong lúc vận (nếu có). Không cần thêm `rootDuringStartup`.
- Mục 5.1 Thiên Bồng: đã áp, xem review ở `NOTE_APPLY_THIEN_BONG_3S.md`. Màu giáp “ánh trắng”: theo luật dự án, màu/hiệu ứng là tự do thiết kế, chỉ cần nhãn. Không bắt buộc đổi tint.
- Mục 6 AI: đồng ý. Ưu tiên điểm 1 (phạt PN vận Thiên Bồng 0,9s / lá 0,55s) vì hiện AI Thường không phạt.
- Mục 2: “bot đứng spam + Thiên Bồng thắng Thường” không còn đúng với runtime hiện tại. Đã đo lại (seed 20261002, 300 trận): Thường **stand 10,7% / spam 1,7% / move 83,3%**; Khó **0 / 0 / 46,7%**. Thiên Bồng 3s đã hết thống trị kiểu đứng yên.

### 10.6. Cần người dùng quyết định

1. Đổi Sương Yêu từ “lướt thoát 1 lần/trận” sang “buff tăng công tự hại + nổ tay là mốc chuyển pha”?
2. Thắng trận đầu = ép BNB rút lui (đề xuất), hay cho phép giết/đoạt cổ (rẽ nhánh lớn)?
3. Trận ch.166 có làm thành màn riêng không, hay chỉ giữ ba màn?

## 11. Blue-chan xử lý phản hồi Orange-kun

Đã sửa bảng/hồ sơ theo mục 10: ba cổ bị đoạt ch.143 gồm Thạch Khiếu; Lam Điểu từ ch.136; áp chế nhị chuyển ch.134; Sương Yêu là cổ tăng công, tự bạo ch.139–140 là sự kiện hy sinh cổ và tay. Câu ch.143 nhắc Sương Yêu được giữ là điểm mâu thuẫn bản dịch, không dùng để tự cấp lại cổ đã nổ. Các sửa này dựa trên đối chiếu bản Việt Orange-kun đã ghi; không tuyên bố Blue-chan đọc lại toàn bộ nguồn ở lượt này.

Sandbox vẫn dùng action thoát thân chuyển thể từ sự kiện tự bạo, chưa implement buff Sương Yêu và các hồ sơ thời kỳ. Không coi việc sửa bảng là đã hoàn tất sửa kit theo nguyên tác.


<a id="source-ke_hoach_chan_nguyen_va_nhip_dung_co"></a>

## Nguồn: `KE_HOACH_CHAN_NGUYEN_VA_NHIP_DUNG_CO.md`

SHA-256 trước gộp: `e847f7d64f7301b01e610f0dce3f5d49e3ee137132df1ea75fcd1ab6ebbb48b1`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Kế hoạch chân nguyên và nhịp dùng cổ

02/10/2026 — Blue-chan gửi Orange-kun review. **Chỉ lên kế hoạch, chưa đổi runtime.** Thiên Bồng 3s/phí 18 + 5/s đã áp riêng; xem [note triển khai](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_apply_thien_bong_3s).

## 1. Yêu cầu và phạm vi

Theo định hướng người dùng, trận cổ sư dưới tứ chuyển phải thường xuyên đặt ra nguy cơ cạn chân nguyên. Người chơi cân nhắc dùng cổ vì tài nguyên hữu hạn, không chỉ vì các nút đang hồi chiêu. Không suy ra cùng một mức hồi/chi phí cho mọi tu vi và thể chất.

Chỉ boss có bộ cổ theo hồ sơ trận. PN dùng inventory, tu vi và chân nguyên thực tế của save; không cấp lại đầy khi vào trận nếu tiến trình không có lý do hồi phục. Nhánh kiếm cổ sớm hợp lệ vẫn được dùng, với điều kiện trả được chi phí. Các snapshot cố định chỉ dùng cho benchmark có nhãn rõ.

Hiểu “mở delay skill” là giảm/bỏ **khóa chung 2s** giữa các cổ. Không đồng nghĩa xóa thời gian vận, active/recovery, bỏ CD riêng hoặc cho nhiều action phát đồng thời. Nếu người dùng muốn đổi CD riêng thì cần một lượt cân bằng riêng sau.

### 1.1. Căn cứ nguyên tác bổ sung: dung lượng, chất lượng, hồi phục là ba biến riêng

**Xác nhận lại 02/10/2026:** chân nguyên **có hồi tự nhiên theo thời gian**, không chỉ hồi bằng nguyên thạch. Ch.10 nói rõ hai cách: chờ biển chân nguyên tự hồi và hấp thu nguyên khí từ nguyên thạch. Nguyên thạch là nguồn bổ sung giúp hồi nhanh hơn khi cần, không phải điều kiện để hồi tự nhiên hoạt động. Không buộc đứng yên/channel cho nguồn hồi tự nhiên; chỉ action hấp thu chủ động mới có điều kiện vận trong thiết kế battle. [Chương 10, đoạn sau khi PN dừng luyện Nguyệt Quang](https://novelfull.com/reverend-insanity/chapter-10.html).

| Yếu tố | Căn cứ đã đọc | Quy tắc thiết kế |
|---|---|---|
| Dung lượng biển chân nguyên | Ch.10: PN nhất chuyển có biển chân nguyên tối đa 44% không khiếu, không thể hút thêm dù không khiếu còn chỗ. | Tư chất quyết định sức chứa; thanh đầy của PN không có nghĩa sức chứa bằng thanh đầy của BNB. [Chương 10](https://novelfull.com/reverend-insanity/chapter-10.html). |
| Hồi tự nhiên | Ch.10 mô tả PN Bính đẳng hồi khoảng 4% mỗi giờ; Phương Chính Giáp đẳng khoảng 8% mỗi giờ. | Giữ hồi tự nhiên theo tư chất và thời gian, không lấy 1,8 điểm/s làm mặc định canon. Phải chốt mẫu số phần trăm trước khi đổi sang đơn vị code. [Chương 10](https://novelfull.com/reverend-insanity/chapter-10.html). |
| Chất lượng chân nguyên | Ch.26: nhất chuyển thanh đồng, nhị chuyển xích thiết, tam chuyển bạch ngân; một phần xích thiết tương đương mười phần thanh đồng, bạch ngân tương đương mười phần xích thiết. | Chuyển số/chất lượng không phải chỉ tăng chiều dài thanh; cần đơn vị quy đổi tiêu hao nhất quán. Các tiểu cảnh giới và cổ tinh luyện cũng cần dữ liệu riêng. [Chương 26](https://novelfull.com/reverend-insanity/chapter-26.html). |
| Nguyên thạch | Ch.10: hấp thu thiên nhiên nguyên khí từ nguyên thạch làm biển chân nguyên tăng dần, dừng ở sức chứa. | Hồi chủ động có tiến trình và tài nguyên thật, không phải potion đầy ngay. |
| Hồi khi tu vi cao hơn | Ch.167: sau trận PN còn khoảng 3%, trốn dùng nguyên thạch; cần nhiều nguyên thạch và thời gian hơn để bổ sung chân nguyên tam chuyển, khoảng 8–9 phút mới hồi tới giới hạn. | Cùng một viên không mặc định hồi cùng phần trăm ở mọi tu vi. [Chương 167](https://www.wuxiaworld.eu/chapter/reverend-insanity-167). |
| Thập Tuyệt thể BNB | Ch.136: hồi nhanh hơn Giáp đẳng nhưng vẫn hao dần trong trận; vận cổ tam chuyển bằng chân nguyên đang áp chế xuống nhị chuyển tiêu hao rất nhanh. | Boss có lợi thế hồi tự nhiên thực sự, vẫn chịu chi phí; không ép regen bằng PN để đạt cân bằng giả. [Chương 136](https://novelfull.com/reverend-insanity/chapter-136.html). |
| Nguồn hồi từ cổ | Ch.202: Thiên Nguyên Bảo Liên giúp hồi liên tục; hiệu quả tương đối thay đổi theo chân nguyên/tu vi đang có. PN nhất chuyển dùng cổ tam chuyển vẫn cạn rất nhanh. | Nếu save thật sự có cổ này thì phải áp effect, không cấm vì muốn PN thiếu nguyên. Tách khỏi hồi tự nhiên, đối chiếu mốc nhận. [Chương 202](https://novelfull.com/reverend-insanity/chapter-202.html). |

Không hiểu “dưới tứ chuyển hay cạn nguyên” thành mọi cổ sư bắt buộc cạn ngang nhau. Người có tư chất cao, thể chất đặc biệt hoặc cổ hỗ trợ phải có lợi thế đúng nguồn; mục tiêu là sửa nguồn hồi vô căn cứ và tiêu hao sai.

### 1.2. Mô hình dữ liệu và nối save

- `capacity`: sức chứa thực tế; `current`: lượng hiện có; `quality`: chuyển số/tiểu cảnh giới và trạng thái tinh luyện; `naturalRecovery`: nguồn hồi tự nhiên; `guRecovery`: effect từ cổ; `stoneRecovery`: phần đã hấp thu từ nguyên thạch. Inventory và trạng thái tiến trình là nguồn dữ liệu.
- Chọn một chuẩn nội bộ (thể tích kèm chất lượng, hoặc năng lượng quy đổi), lập công thức chuyển đổi có ví dụ/test. Không vừa nhân sức chứa 10 lần vừa giảm cost 10 lần cho cùng lần tăng chất lượng: đó là tính lợi thế hai lần.
- Các phí sandbox 18, 5/s, 9 là điểm của bộ thử hiện tại; chưa phải tỷ lệ phần trăm không khiếu hay chi phí nguyên tác. Adapter campaign phải quy đổi nhất quán, không gắn thẳng 33 vào mọi tu vi rồi gọi là chuẩn.
- Tính từng nguồn riêng: `chênh lệch nguyên = hồi tự nhiên + hồi từ cổ + hấp thu nguyên thạch − phí phát cổ − phí duy trì`. Khi đang vận cổ, lượng nguyên vẫn có thể giảm dù hồi tự nhiên đang diễn ra vì tiêu hao lớn hơn hồi. Không dùng tiêu chí “thanh giảm” để kết luận hồi tự nhiên bị tắt.
- `maxEss()` trong `js/engine.js` đã có `MAXE`, `S.tuchat` và `S.mod.ess`; dùng làm đầu vào adapter trước khi cân lại schema, không bỏ dữ liệu để ép PN về pool 100. HUD có thể chuẩn hóa độ dài thanh nhưng phải ghi lượng hiện có/tối đa và loại chân nguyên.
- Hồi nguyên theo lượt VN trong engine và hồi theo giây battle là hai thang thời gian. Vào/ra trận không được vừa cộng hồi theo lượt vừa hồi lại cùng đoạn thời gian; không tự đầy nguyên khi mở sandbox từ campaign.

## 2. Vì sao hiện tại chân nguyên có thể quá dư

Đọc `js/sandbox/kits.js` và `sim.js` hiện tại:

| Thành phần | Hiện tại | Vấn đề |
|---|---|---|
| PN | Pool 100, regen 1,8/s trừ khi Thiên Bồng đang bật | 30s có thể sinh thêm 54 nếu không chạm trần hoặc ngừng regen. Hồi cả khi đang đánh, đi và lấy đà. |
| BNB | Pool 100, regen 2,4/s | 30s có thể sinh thêm 72; pool ban đầu bằng PN nhưng đánh băng miễn phí. |
| Nguyệt Mang | Phí 9, CD 2,8s | Bắn ngay mỗi CD tiêu khoảng 3,21/s; sau regen 1,8 chỉ rút ròng khoảng 1,41/s. Đây là ước lượng riêng chiêu, chưa tính khóa chung, giáp và hụt đạn. |
| BNB Lốc | Phí 22, CD 10s | Mỗi 10s regen có thể bù 24, hơn phí Lốc 22 nếu không dùng cổ khác. |
| Bạch Ngọc / Thủy Tráo | Phí bật 10 / 12; không upkeep | Hiệu lực vài giây được trả một lần, còn tiếp tục hồi nguyên trong giáp. |
| Đánh tay / Băng nhận | Cùng `id:'atk'`, phí 0 | Đánh tay bằng sức cơ thể và vận cổ tạo băng đang bị đối xử giống nhau. |
| Lướt | Phí 0, CD 2,5s | Chuyển thể điều khiển game; phải phân biệt với di chuyển bằng Lôi Dực có vận cổ. |
| Release | Kiểm tra phí lúc nhận lệnh, tới release trừ rồi clamp về 0 | Upkeep trong lúc lấy đà có thể làm thiếu phí; nếu không kiểm tra/giữ chỗ lại, vẫn phát chiêu dù không trả đủ. |

Các phép tính trên là ngân sách lý thuyết, không phải tỷ lệ thắng đã đo. Không lấy “pool 100” làm khẳng định mọi cổ sư trong truyện có cùng dung lượng không khiếu. Khi nối campaign phải tách dung lượng, lượng đang có, chất lượng chân nguyên và chi phí cổ.

## 3. Lượt thử đầu: hồi tự nhiên đúng nguồn và đúng thang thời gian

Giữ nguyên pool và phí các đòn trong baseline để xác định tác dụng của regen. Thử hai cấu hình trên cùng snapshot/seed:

- **CN-A, ưu tiên:** hồi tự nhiên liên tục theo tư chất/thể chất và chất lượng chân nguyên; lượng hồi của cổ sư thường trong vài chục giây rất nhỏ khi bám nhịp thời gian truyện. Đổi rate theo giờ sang simulation clock sau khi chốt đơn vị phần trăm. Không đặt luật “thoát combat 4s mới hồi” như căn cứ canon.
- **CN-B, đối chứng:** cùng dữ liệu nhưng hồi tự nhiên của cổ sư thường được xấp xỉ 0 trong trận ngắn. Đây chỉ là xấp xỉ để đo; không xóa nguồn hồi đã xác minh của Thập Tuyệt thể hoặc cổ hỗ trợ. Hồi giữa các cảnh vẫn tính theo thời gian truyện.
- Bản production ưu tiên CN-A với rate nhỏ nhưng dương, tích lũy bằng số thực; HUD làm tròn không được khiến code bỏ mất lượng hồi nhỏ mỗi tick. CN-B không phải quyết định bỏ hồi tự nhiên khỏi game.
- Nếu cần nén thời gian cho battle, ghi hệ số chuyển thể riêng và áp nhất quán cho rate liên quan; không coi vài giây chạy vòng là nhiều giờ nghỉ. Không tăng hồi để bù việc người chơi bắn trượt nhiều.
- BNB lấy `naturalRecovery` từ hồ sơ thể chất, không chốt 0,40/s bằng cảm tính. Đo nguy cơ hao hụt khi vận cổ mạnh/khác chất lượng; không cân boss bằng việc làm mất ưu thế Thập Tuyệt thể.
- Thiên Bồng đang có luật **ngừng regen khi bật** theo yêu cầu người dùng đã áp. Ghi rõ đây là chuyển thể hiện hành, chưa phải quy tắc nguyên tác cho mọi giáp/cổ hồi. Khi làm cổ hồi đặc biệt cần review phạm vi ngừng nguồn nào, không âm thầm vô hiệu hóa mọi nguồn hồi hợp lệ.

Với pool thử 100 và không regen trong giao chiến: Thiên Bồng đủ 3s mất 33; còn 67 chỉ đủ bảy lần Nguyệt Mang phí 9 nếu không dùng thêm cổ khác. Ví dụ này thể hiện lựa chọn tài nguyên, không phải combo bắt buộc của PN.

## 4. Chuẩn hóa phí cổ, không đánh đồng công dụng

Sau khi đo CN-A/B mới chỉnh phí từng nhóm. Không tăng mọi phí một lượt để cưỡng ép người chơi hết nguyên.

1. **Cổ phát đòn:** trả phí lúc phát kể cả đánh hụt; không hoàn phí do đối thủ né. Tách phí theo chuyển số/chất lượng chân nguyên nếu adapter campaign có dữ liệu, tránh đồng nhất 9 điểm ở mọi tu vi.
2. **Cổ duy trì:** phí bật + upkeep theo simulation clock. Thử Bạch Ngọc **2/s**, Thủy Tráo **2/s**, giữ thời hạn/hiệu lực cũ trong lượt thử này. Không thu upkeep cho sức mạnh cơ thể đã được cổ cải tạo từ trước.
3. **Băng nhận BNB:** tách tạo/duy trì vũ khí bằng cổ khỏi vung vũ khí đã tạo. Hai phương án đo riêng: trả **3 điểm mỗi đòn băng** trong kit hiện tại, hoặc tạo nhận với phí bật/upkeep và cho vung khi còn nhận. Phương án thứ hai hợp lý hơn về trạng thái nhưng cần thêm lifecycle/asset; chưa triển khai lẫn cả hai phí.
4. **Di chuyển:** đi bộ vẫn miễn phí để cạn nguyên không thành đứng chết. Lướt game hiện tại giữ miễn phí ở lượt CN-A/B, tránh đổi quá nhiều biến. Nếu action là Lôi Dực thực sự thì phí bật/duy trì được đặc tả riêng, không đổi tên lướt miễn phí rồi coi đã vận Lôi Dực.
5. **Lá hồi máu:** không trả bằng chân nguyên nếu bản chất là vật phẩm tiêu hao; giới hạn bằng inventory. Hồi máu không đồng thời hồi nguyên nếu không có effect được đặc tả.
6. **Cổ mạnh đặc biệt:** giữ ưu thế theo truyện nhưng ghi rõ chi phí/cách vận/điều kiện phản chế. Cự Xỉ không mặc định miễn phí hoặc vô hạn; Toàn Lực Ứng Phó Q2 cần hồ sơ riêng, không suy thành mọi cổ tăng lực phải trả phí giống nhau.

## 5. Trả phí đúng và xử lý cạn nguyên

- Giữ chỗ phí action lúc bắt đầu để upkeep không tiêu mất phần đã dành cho release; UI phân biệt lượng có thể dùng với lượng đã giữ. Release trừ đúng một lần.
- Khi tự hủy hoặc bị ngắt, trả phần đã giữ theo luật phí hủy đã được duyệt. Hiện runtime hủy trước release không tốn phí; đề xuất 25% ở plan trước **chưa áp**, không âm thầm đổi trong bước sửa regen.
- Nếu chưa làm reservation, ít nhất phải kiểm tra đủ phí tại release: thiếu thì không phát, không trừ âm hoặc clamp che thiếu phí. Với AoE phải hủy cả vùng chưa nổ, không để `stepZones` phát damage dù action đã thất bại.
- Hết chân nguyên tắt effect cần upkeep. Đạn đã trả phí và đã phát vẫn tồn tại; không xóa đạn vì người bắn hết nguyên sau đó.
- Không trừ nguyên khi lệnh bị từ chối vì CD/tầm/bận. Command buffer khi thực thi phải kiểm tra tài nguyên lại.
- PN cạn nguyên vẫn có đi bộ, đánh bằng lực cơ thể, né và vật phẩm hợp lệ; boss không được phát đòn băng bằng “đánh thường miễn phí” nếu vẫn cần vận cổ.

## 6. Nguyên thạch: nguồn hồi chủ động theo nguyên tác

Đưa hấp thu nguyên thạch vào phạm vi kế hoạch chính, không chỉ coi là cách cứu cân bằng nếu trận quá dài. Dùng từ inventory thật, có thời gian đứng yên/tập trung và bị ngắt là thiết kế battle đề xuất. Truyện xác nhận hồi dần bằng hấp thu; con số giây, khóa action và cách xử lý bị ngắt trong game phải ghi là chuyển thể.

Campaign hiện có action ngoài trận ở `js/engine.js`: trả 5 nguyên thạch hồi 25 điểm, bị chặn khi `S.combat`. Không gọi trực tiếp action đó trong battle để bỏ qua thời gian hấp thu; cần adapter/action riêng và kiểm tra đơn vị theo mục 1.2.

Thiết kế thử: giữ một viên đang hấp thu, hồi theo tiến độ; phần đã hấp thu không được hoàn lại khi bị ngắt, phần còn lại theo dõi trong dữ liệu viên đang dùng hoặc chọn quy tắc tiêu hao cả viên và ghi rõ. Không vừa thu cả viên đầu action rồi thu thêm ở cuối. Dừng khi đầy, không sinh thừa nguyên; pause không hấp thu. PN đi/ra chiêu thì dừng hấp thu theo luật channel. Boss nếu dùng cũng phải lộ action và có ngân sách nguyên thạch hữu hạn trong hồ sơ.

Chưa chốt một viên hồi bao nhiêu điểm hoặc mất bao nhiêu giây: phải quy đổi theo chất lượng hiện tại và thang thời gian battle. Benchmark ghi số viên/mức còn lại, chân nguyên đã hút, số lần bị ngắt. Rút lui hồi nguyên trở thành một mục tiêu chiến thuật, không phải chạy vòng để thanh tự đầy.

## 7. Sau khi đủ khan hiếm, thử mở khóa chung

Thứ tự thử trên cùng dữ liệu đã cân tài nguyên: **2s → 1s → 0s**, mỗi cấu hình đo riêng. Chưa giảm khóa 2s ở lượt lên plan này.

- Dù khóa chung 0s vẫn chỉ một action tại một thời điểm và một lệnh chờ theo buffer hiện tại.
- Giữ startup/recovery/CD riêng và upkeep. Giáp không được miễn phí chỉ vì chuyển nhanh sang chiêu khác.
- Test mốc `GU_LOCK=0` phải kiểm tra HUD không chia cho 0 đối với chiêu không có CD riêng, cùng event/cooldown của cổ dùng một lần.
- So sánh nhịp điều khiển, tiêu nguyên, số đòn trúng và khả năng phản ứng; nếu bốn chiêu nối nhanh giết trước khi đối thủ có cửa né thì giữ khóa 1s hoặc sửa recovery/telegraph, không chỉ tăng phí.
- Ưu tiên khóa 1s nếu gần chất lượng 0s nhưng cảm ứng đọc đòn tốt hơn. Không kết luận bỏ delay chỉ từ bot thắng/thua.

## 8. Đo gì trước khi chốt

Mở rộng benchmark để ghi cho cả PN và BNB: nguyên bắt đầu/kết thúc, min nguyên, thời điểm xuống 25%/10%, tổng phí bật, upkeep, nguyên hồi và nguyên mất do chạm trần, số lệnh thiếu nguyên, thời gian effect bật, số đòn trúng/hụt, thời gian rút lui/hồi phục, kết quả và timeout. Kiểm tra ngân sách bằng phương trình `đầu + hồi − chi phí = cuối`, kể cả tài nguyên giữ chỗ.

Chạy ít nhất 5 seed × 300 trận cho mỗi profile boss và mỗi cấu hình, với các chính sách: đứng spam, đi né có chọn chiêu, tiết kiệm nguyên và mở Thiên Bồng. Đối chứng regen trước/sau, sau đó mới đo phí mới, sau cùng mới đo khóa chung. Bộ PN là snapshot inventory có nhãn phục vụ test, không áp thành kit bắt buộc cho người chơi.

Mục tiêu thử ban đầu, chưa phải số đã đạt:

- Spam nhiều cổ phải có nguy cơ xuống dưới 10% trong khoảng **15–30s** giao chiến liên tục ở snapshot chuẩn; không bắt mọi build và mọi trận phải cạn cùng lúc.
- Người né và chọn đòn có thể giữ nguyên cho tình huống nguy hiểm, nhưng không đứng bắn vô hạn nhờ regen.
- Cạn nguyên thường xuyên xuất hiện ở các trận dài mà không thành tình trạng bắt buộc sau vài giây; cận chiến và chiến thuật tiết kiệm vẫn có cửa thắng.
- Boss cũng cạn nguyên và đổi hành vi; không có tài nguyên ẩn vô hạn hoặc tự đầy khi thấp máu.
- Playtest điện thoại: thiếu nguyên có thông báo rõ, không nhầm với input không nhận. Hiển thị phí bật + duy trì và cảnh báo thấp nguyên; giảm âm spam khi bấm nút thiếu nguyên.

## 9. Thứ tự bàn giao

| Bước | Việc làm | Giữ chưa đổi |
|---|---|---|
| CN-01 | Chốt đơn vị dung lượng/chất lượng/rate; nối dữ liệu save, telemetry và kiểm tra thiếu phí ở release/upkeep | Khóa chung và phí đòn chưa quy đổi |
| CN-02 | Thử hồi tự nhiên theo tư chất/thể chất, action hấp thu nguyên thạch và AI tiết kiệm; báo kết quả | Khóa chung 2s |
| CN-03 | Upkeep giáp thường, phí băng nhận; cân từng nhóm | Khóa chung 2s |
| CN-04 | Thử khóa chung 1s/0s; playtest chuột và chạm | Một action, vận/thu chiêu, CD riêng |
| CN-05 | Đồng bộ campaign, save cũ, các nguồn hồi từ cổ và thời gian nghỉ giữa cảnh | Không cấp/tước bộ cổ PN theo màn |

Orange-kun review CN-01/02 trước. Kiểm tra đặc biệt: BNB Lốc hiện có thể được regen bù hết phí, Băng nhận miễn phí, và lệnh được nhận đủ phí nhưng tới release thiếu do upkeep. Đây là ba chỗ cần xử trước khi quyết định mở khóa chung.

Kiểm thử bổ sung: hai nhân vật cùng đầy thanh nhưng sức chứa khác nhau; cùng một lượng năng lượng từ nguyên thạch tạo lượng chân nguyên khác theo chất lượng; hồi tự nhiên đúng đơn vị giờ/giây; Thập Tuyệt thể và cổ hồi không bị mất effect; hấp thu bị ngắt không hoàn phần đã nhận hoặc thu phí hai lần; save vào/ra trận không nhân đôi tài nguyên. Không kết luận dựa riêng vào snapshot PN/BNB cùng pool 100.

## 10. Review của Orange-kun (02/10/2026)

Đã đọc toàn bộ, đối chiếu lại bản dịch Việt (`cochannhann.pages.dev/api/chapters/<n>`) và chạy thử trên runtime hiện tại (đã có Thiên Bồng 3s + khóa chung 2s).

### 10.1. Căn cứ đã xác minh — đúng

- Ch.10: PN loại Bính, nguyên hải **bốn thành bốn** (44%) không khiếu; hồi tự nhiên **bốn phân/giờ** (4%), Phương Chính Giáp đẳng **tám phân/giờ**. Một khối nguyên thạch đưa PN từ 14% về trần 44% trong khoảng nửa giờ. Bảng 1.1 đúng.
- Ch.26: một phần xích thiết = mười phần thanh đồng, bạch ngân = mười phần xích thiết. Đúng.
- Ch.136: Thập Tuyệt thể hồi “vượt xa loại Giáp rất nhiều nhưng vẫn sẽ có tiêu hao”. Đúng. Không có con số.
- Bổ sung ch.134: lúc mới gặp BNB **tự áp chế xuống nhị chuyển**; với thực lực nhị chuyển “tốc độ hơi nhanh hơn PN, chân nguyên lại càng nhiều hơn”. Đây là căn cứ cho pool BNB lớn hơn PN ở trận đầu, không phải chỉ regen cao hơn.
- Bổ sung ch.137: BNB “dùng chân nguyên nhị chuyển cưỡng ép phát động cổ tam chuyển (Sương Yêu), nhất định tổn hao một lượng lớn chân nguyên”. Đây là căn cứ trực tiếp cho **phí cao của cổ vượt chuyển khi đang áp chế**, rất hợp mục 4 và 1.2.

### 10.2. Lỗi/điểm cần sửa trong kế hoạch

1. **CN-A và CN-B gần như là một ở thang trận.** 4%/giờ ≈ 0,067% mỗi phút; một trận 40s hồi chưa tới 0,05% dung lượng. Muốn regen trong trận khác 0 thì *bắt buộc* có hệ số nén thời gian, mà hệ số đó là chuyển thể game. Đề xuất ghi thẳng: **cổ sư thường hồi tự nhiên ≈ 0 trong trận (đúng thang truyện)**; regen giữa các cảnh tính theo giờ truyện. Chỉ Thập Tuyệt thể/cổ hồi mới có regen trong trận, số liệu gắn nhãn `game`. Như vậy không cần đo CN-A như một cấu hình riêng.
2. **Regen không phải đòn bẩy chính trong kit hiện tại — đã đo.** Cùng bench, seed 20261002, 300 trận:

   | Regen PN / BNB | Thường: stand / spam / move | Khó: stand / spam / move |
   |---|---|---|
   | 1,8 / 2,4 (hiện tại) | 10,7 / 1,7 / 83,3% | 0 / 0 / 46,7% |
   | 0 / 0 | 0 / 12,0 / 84,7% | 0 / 0 / 43,3% |
   | 0 / 0,8 | 0 / 12,0 / 89,3% | 0 / 0 / 45,3% |

   Bỏ hẳn regen gần như không đổi kết quả. Lý do: pool 100 đủ cho một trận 40s (Nguyệt 9 → khoảng 11 phát), còn sát thương chính của BNB là Băng nhận **miễn phí**. Muốn “cạn nguyên” thành nguy cơ thật thì phải chỉnh **phí cổ/dung lượng** (mục 4) và phí Băng nhận. Chỉ tắt regen là chưa đủ. Thứ tự CN-02 → CN-03 nên đảo: đo phí trước, regen sau (hoặc gộp).
3. **Nguyên thạch trong trận:** theo ch.10, một viên cần khoảng nửa giờ hấp thu. Nếu đưa action hấp thu vào trận đấu tay đôi 40s thì phải nén thời gian rất mạnh, và nó sẽ thành potion trá hình. Đề xuất v1: **không có hấp thu nguyên thạch trong đấu tay đôi**. Chỉ dùng giữa cảnh/khi rút lui khỏi trận (như ch.167). Nếu sau này có “thoát khỏi trận để hồi” thì làm ở tầng campaign.
4. Mục 2, dòng “Release: kiểm tra phí lúc nhận lệnh, tới release trừ rồi clamp về 0”: **xác nhận là lỗi thật** ở `sim.js` `fire()` (`a.ess=Math.max(0,a.ess-cost)`). Hiện chỉ PN gặp được: đang Thiên Bồng (−5/s), bấm Cự Xỉ khi còn 14,5 → 0,55s lấy đà mất 2,75 → vẫn phát chiêu dù không đủ phí. Sửa tối thiểu: kiểm tra lại ở `fire()`, thiếu thì phát event `fizzle`, không trừ, không áp CD/khóa chung, gỡ zone. Có thể làm reservation sau.

### 10.3. Đồng ý

- Mô hình tách `capacity / current / quality / nguồn hồi`, và không tính lợi thế chất lượng hai lần (mục 1.2).
- Phí trả lúc release, đạn đã phát không biến mất khi người bắn hết nguyên (mục 5).
- Đi bộ, đánh tay bằng thân thể và lá hồi máu không tốn chân nguyên (mục 4.4–4.5).
- Khóa chung chỉ thử giảm sau khi ngân sách đã ổn (mục 7).

### 10.4. Đề xuất số thử cụ thể cho CN-03 (thay cho đo regen)

Giữ một biến mỗi lượt, đo bằng `tools/sandbox_bench.cjs` 3 seed × 300:

1. **Băng nhận 3 chân nguyên/đòn** (phương án 1 mục 4.3), BNB regen 0,8 (`game`, Thập Tuyệt). Kỳ vọng: BNB phải đổi sang đánh ít hơn hoặc dùng Lốc/Thủy Tráo có chọn lọc.
2. **Pool trận đầu:** PN 100, BNB 130 (ch.134 “chân nguyên càng nhiều hơn”), cả hai regen như trên.
3. Nếu có cổ tam chuyển dùng bằng chân nguyên nhị chuyển (Sương Yêu, Lam Điểu Băng Quan ở hồ sơ áp chế) thì phí ≥ 2× cổ nhị chuyển tương đương, theo ch.137.

Tiêu chí ở mục 8 hợp lý. Thêm một chỉ số: **% trận có actor xuống dưới 10% nguyên** cho từng chính sách bot. Hiện chỉ số này chắc chắn gần 0.

### 10.5. Cần người dùng quyết định

- Chấp nhận “cổ sư thường không hồi chân nguyên trong trận” làm mặc định (đúng thang truyện), hay muốn regen nhỏ có nhãn `game` cho cảm giác dễ chịu?
- Có muốn nguyên thạch dùng được *trong* trận không (chuyển thể), hay chỉ giữa cảnh?

## 11. Thứ tự sau review Orange-kun

Ưu tiên sửa thiếu phí ở release trước; tiếp đó đo phí Băng nhận, dung lượng bể và phí cổ, không xem tắt regen là giải pháp đủ. Kết quả đối chứng ở mục 10.2 là số đo của Orange-kun. Các con số 3/đòn, bể BNB 130, regen 0,8 là ứng viên, chưa áp trong lượt sửa lỗi/mobile. Quyết định hồi trong trận và dùng nguyên thạch trong trận vẫn chờ người dùng; giữ khóa chung 2s.


<a id="source-ke_hoach_mo_rong_san_ai_roster_vfx"></a>

## Nguồn: `KE_HOACH_MO_RONG_SAN_AI_ROSTER_VFX.md`

SHA-256 trước gộp: `c9d0150499e8174ab3a45741947c28804c7f022c1fec0984a7bf836f7cdd9159`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Mở rộng sân, AI theo nhân vật và VFX — Blue-chan gửi Orange-kun

**Cập nhật triển khai sau review:** đã thử sân 1200×260 nhìn toàn màn, lề view 127px, hướng Nguyệt công khai và AI BNB ép nhịp. [Bàn giao, benchmark và giới hạn](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_apply_san_1200_ai_ep_nhip). Các phần roster/FX/campaign còn là kế hoạch.

02/10/2026. Người dùng đã thử PN–BNB và thấy tạm ổn; bước tiếp là sân lớn hơn, AI thông minh hơn, phong cách đánh riêng và hiệu ứng đẹp hơn. **Đây là kế hoạch để review, chưa đổi runtime hoặc tạo asset.** Bộ 39 nhân vật người dùng sắp gửi cần được kiểm kê trước khi chốt roster và phạm vi triển khai.

Đọc cùng [chân nguyên](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chan_nguyen_va_nhip_dung_co), [BNB theo thời kỳ](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_can_bang_co_trung_va_bnb_theo_moc_truyen), [map](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_map_battle_pixel), [VFX/âm](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_vfx_am_thanh_battle_e) và [chốt sandbox/mobile](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chot_sandbox_pn_bnb). Tài liệu này mở rộng các bản đó, không thay các yêu cầu về inventory PN hoặc nguồn nguyên tác.

## 1. Hiện trạng và mục tiêu

| Hiện tại đã đọc trong code | Hướng tiếp |
|---|---|
| `sim.js`: x=110…890, z=0…240, spawn PN/BNB cố định; `other()` chỉ biết hai actor | Cấu hình sân/spawn theo trận, chọn mục tiêu qua API; vẫn làm 1v1 trước |
| `view.js`: canvas 960×430, x quy đổi theo thế giới 1000, sàn theo `ground_screen_y`, scale theo z | Tách viewport khỏi kích thước thế giới; view/input dùng chung phép chiếu có nghịch đảo |
| `ai.js`: thứ tự if riêng BNB, gọi thẳng tên Lốc/Thủy Tráo/Sương Yêu | Bộ quyết định chung + hồ sơ chiến thuật từng nhân vật/thời kỳ |
| VFX chủ yếu Graphics, một số anchor/fallback, có audio tổng hợp | Asset FX riêng + registry nối với event và anchor đã duyệt |

Mục tiêu: có khoảng trống để né và đổi vị trí, nhưng vẫn gặp và giao chiến thường xuyên; AI biết chọn thời cơ và tiết kiệm tài nguyên; cùng độ khó nhưng các nhân vật có cách đánh khác nhau. Không coi tăng HP/sát thương là bằng chứng AI đã khôn hơn.

## 2. Sân lớn hơn: thử tăng không gian trước khi thêm camera

### Bản thử A — nhìn toàn sân

- Giữ viewport 960×430 và HUD hiện tại. Thử **world rộng 1400, sâu 320** so với hệ quy chiếu hiện tại 1000×240. Đây là ứng viên A/B, chưa phải giá trị chốt.
- Tách `worldRect` khỏi `playableBounds`: kích thước thế giới dùng phép chiếu; biên đi phải trừ margin của sprite. Không nhân 110/890 theo tỷ lệ rồi giả định KO/thú lớn sẽ vừa.
- Giữ kích thước sprite trên màn hình ở mức đọc được. Khi nhiều world unit đi vào cùng viewport, bước đi nhìn sẽ chậm hơn nếu speed không đổi; đo và lựa chọn rõ giữa giữ tốc độ world hay giữ tốc độ màn hình. Không tự tăng speed tất cả actor khi mở map.
- Đo `thời gian áp sát`, `thời gian thoát melee`, `thời gian vượt sân`, tỷ lệ tầm đạn/sân và thời gian né AoE. Ban đầu giữ range/damage/CD để tách tác động của sân; cân chỉnh movement ở lượt riêng nếu cần.
- Giữ phép chiếu sân phẳng kiểu hiện tại, chưa chuyển thành map ô hay pathfinding toàn bản đồ. Nền mới cần bãi đất rộng, mép sau rõ, khoảng trống hai bên; không kéo giãn nền trúc cũ để nghiệm thu mỹ thuật.
- Sinh tọa độ spawn từ cấu hình, tính khoảng cách bắt đầu có chủ đích. Kiểm KO và pose rộng ở bốn góc, cả hai hướng mặt, mọi depth; không giải quyết clipping bằng thu nhỏ riêng mỗi pose.

**Thiết kế dữ liệu đề xuất:** `worldRect`, `playableBounds`, `spawns`, `ground_screen_y`, `image`, `pixel`, `haze`, `cameraMode`. Quy định đơn vị world/màn hình rõ, validate số hữu hạn, biên có thứ tự, spawn trong sân; thiếu cấu hình dùng baseline cũ. Khi simulation được cấu hình theo trận, bỏ việc các subsystem tự đọc hằng số toàn cục `SBSim.Z1/X0/X1` cho một trận có kích thước khác.

### Bản thử B — camera, chỉ khi bản A làm actor khó đọc

- Giữ tỷ lệ actor; camera theo trung điểm hai bên, giới hạn tốc độ pan và zoom tối thiểu. Chưa bật rung camera trong giai đoạn này.
- Khi hai bên ở xa, ưu tiên zoom vừa đủ thấy cả hai; nếu vượt khả năng đọc trên điện thoại thì thu phạm vi sân hoặc thiết kế chỉ báo ngoài màn hình trước khi mở camera tự do.
- `toWorld` phải đảo đúng camera transform. Hover, telegraph, bóng, đạn, target picking và tap dùng cùng hệ tọa độ; HUD ở ngoài camera. Không chọn điểm bằng vị trí màn hình trước pan rồi dùng với transform sau pan.
- Obstacles/collision chỉ là đợt sau. Đá/trúc trang trí chưa có collision không được làm người chơi tưởng đó là vật chắn đạn. Vật chắn thật phải có hình, hình học, luật đạn và AI tìm đường thống nhất.

## 3. AI chung: chọn hành động theo tình huống

Tách ba phần: **quan sát → sinh hành động hợp lệ → chấm điểm và cam kết hành động**. Mỗi nhịp nghĩ, lấy snapshot quan sát được, gọi check của sim để lọc lệnh, chọn hành động có điểm tốt nhất; log lý do để review.

| Nhóm hành động | Tiêu chí |
|---|---|
| Né/thoát nguy hiểm | Telegraph/đạn đã xuất hiện, thời gian tới hit, đường thoát hợp lệ, chi phí bỏ chiêu đang vận |
| Ra đòn | Có tầm, hướng, độ sâu và khả năng trúng; ưu tiên lúc đối thủ thu chiêu hoặc đã tự khóa vị trí |
| Áp sát/giữ khoảng cách | Tầm hiệu quả của bộ cổ thực có, chi phí chân nguyên, nguy cơ bị dồn biên, đường đi |
| Hộ thể/hồi phục | Nguy hiểm dự kiến trong cửa sổ buff, thời gian vận, phí duy trì, có đủ khoảng trống để thực hiện |
| Chờ/đổi vị trí | Thiếu chân nguyên, chưa có cơ hội; chờ không có nghĩa đứng im ăn đòn |

- Các thuộc tính dự kiến của skill: vai trò, tầm hiệu quả, dạng đường bay/vùng, windup, recovery, mobility, chi phí và upkeep. Mô tả AI đọc dữ liệu gameplay, không suy ra năng lực chỉ từ clip `cast` hay tên nhân vật.
- AI chỉ dùng động tác/telegraph/vị trí nhìn thấy. Không đọc con trỏ, lệnh chưa phát, trạng thái tương lai hoặc seed RNG. Thông tin cooldown/tài nguyên địch nếu game không công khai phải dùng ước lượng từ hành động đã quan sát; tài nguyên của chính nó dùng số thật.
- Điểm nhắm được chọn lúc quyết định theo luật chiêu. Có thể dự đoán từ hướng di chuyển vừa quan sát, nhưng giới hạn độ chính xác theo hồ sơ; không bẻ đạn/homing nếu skill không có cơ chế đó.
- Có thời gian phản ứng và jitter. Nhận ra cùng một telegraph một lần, giữ đích né; không cứ mỗi tick đổi bên hoặc hủy vận. Chỉ hủy khi nguy cơ mới vượt lợi ích của chiêu đang làm, theo luật cancel hiện có.
- Chống thả diều bằng cắt góc, ép biên, giữ tầm và trừng phạt thời gian vận. Không teleport, tăng tốc bí mật hay cấp chiêu tầm xa cho nhân vật không có.
- Độ khó chủ yếu đổi phản ứng, sai số nhắm, khả năng đọc thời cơ và quản lý tài nguyên. Hệ số damage hiện có cần giữ riêng để benchmark không lẫn thay AI với tăng sức mạnh.

## 4. Hồ sơ chiến thuật theo nhân vật

Các dòng dưới là **đề xuất dàn dựng chiến thuật**, chưa xác nhận mọi bộ cổ của 39 asset. Cổ được phép dùng phải lấy từ data + thời kỳ + nhánh đã đối chiếu; phong cách không cấp thêm năng lực.

| Mẫu hồ sơ | Nhân vật thử | Hành vi đặc trưng |
|---|---|---|
| Áp sát, ép nhịp | BNB theo mốc truyện | Chủ động tranh tầm, chờ/cắt đường né, chiêu lớn khi người chơi bị khóa vận; tính tiền duy trì và phương án thoát thân đúng thời kỳ |
| Tầm trung, đánh có nhịp | Phương Chính | Giữ khoảng cách dùng nguyệt nhận, bảo vệ khi cần, hạn chế đổi chiến thuật quá nhanh; không sao chép mọi lựa chọn tối ưu của BNB |
| Khống chế, bảo vệ | Thanh Thư dạng người | Khai thác roi/kim/đường cong nếu bộ cổ đã có; giữ vùng giao chiến, phản công khi đối thủ áp sát; Mộc Mị là biến thể/sự kiện riêng |
| Lao tới theo đợt | Heo rừng | Lấy đà húc có cảnh báo, cam kết hướng rồi thu chiêu; không quay mục tiêu tức thì trong pha lao |
| Đánh gần, kiểm soát không gian | Hắc Hùng | Đòn nặng chậm, bám vị trí có lợi, tránh chạy ziczac như người dùng phi đạn |
| Cơ động, quấy rối | Điện Lang thường | Đổi góc, lao ngắn rồi thoát; gọi bầy chỉ nếu bộ kỹ năng thật có, không mặc định mọi sói có sét |
| Boss thú | Lôi Quan Lang Vương | Ép người chơi bằng đòn thú và kỹ năng sét đúng bộ; không dùng pose chưởng hoặc mặc định tru gọi bầy từ sprite sói thường |
| Chỉ huy/summoner | Hàn Bất Lưu | Giữ khoảng cách và dùng chó theo cơ chế đã có; nếu sim chưa hỗ trợ summon thì đánh dấu chưa triển khai, không thay bằng đạn phép tùy ý |
| Cận chiến lực đạo | Thiết Bá Tu/Cự Khai Bi/Hoành Mi | Thử khác nhau về truy đuổi, cam kết đòn và chọn phản công; thông số cụ thể phải theo từng kit, không coi cả nhóm cùng bộ cổ |

Hồ sơ gồm `preferredRange`, `aggression`, `commitment`, `resourceReserve`, `defensePriority`, `aimError`, `reaction`, `repositionPolicy`, và trọng số action. Giá trị số chốt sau pilot, không dựng 39 hồ sơ chỉ bằng đổi tên. NPC không chiến đấu và biến thể phải được phân loại riêng.

**Giới hạn hiện tại:** cả sim và input/HUD còn phụ thuộc PN/BNB. Bước đầu hỗ trợ PN đối đầu một actor bất kỳ qua `enemyId/getOpponent`, kit và profile riêng. Chưa coi đây là hỗ trợ nhiều địch; lang triều/summon cần target selection, đội phe, collision, vòng đời actor và điều khiển bổ sung.

## 5. Hiệu ứng có generate được không?

**Có thể thử generate hình/chuỗi pose FX riêng**, rồi nhập thành PNG/atlas. Không bảo đảm một prompt xuất ngay chuỗi frame liên tục, alpha sạch hoặc đúng kích thước. Ưu tiên đồ vật/sinh vật có silhouette quan trọng; code làm đường bay, timing, scale/mirror và mảnh nhỏ. Không yêu cầu máy người dùng render video dài.

| Ưu tiên | Asset generate đề xuất | Phần code giữ quyền điều khiển |
|---|---|---|
| 1 | `fx_cuxi`: rết vàng có đốt/răng; `fx_cuongthu`: bàn tay thép mở → chộp | Đường vung/kéo, tầm hit, contact, hủy/thả; đọc cùng mục 4b prompt roster |
| 2 | Lưỡi nguyệt, lưỡi băng, 3–4 biến thể impact băng/nguyệt/ngọc | Projectile thật, xoay cả vật thể nếu phù hợp, trail, impact tại snapshot hit; không xoay tay/chân actor |
| 3 | Mảnh xoáy băng và sương thoát thân, 4–6 frame nếu thực sự cần đổi hình | Vị trí/radius zone, thứ tự trước/sau actor, thời điểm zoneFire và tắt cảnh báo |
| 4 | Vảy giáp ngọc/vàng, gợn nước và lá hồi phục | Gắn thân/anchor, đổi hộ thể, tắt khi hết phí/thời hạn, âm tương ứng |

### Quy trình asset FX

1. Duyệt một mẫu phong cách ở kích thước battle: pixel sắc, palette ít màu, không blur lớn hoặc quầng sáng che actor. VFX cùng chất liệu có thể dùng chung, nhưng phải giữ dấu hiệu riêng của chiêu.
2. Prompt một FX, không kèm nhân vật/nền cảnh/chữ; ghi hướng, pha và số pose rõ. Chỉ yêu cầu các pha thật cần đổi silhouette, không ép mọi vật thể thành 8 frame.
3. Ưu tiên alpha thật. Nếu nền màu phẳng, chọn màu key không xuất hiện trong FX: tránh xanh lá cho Thanh Đằng/lá và nền trắng cho băng. Kiểm fringe và vùng bị xóa nhầm.
4. Nhập qua **pipeline FX riêng**; không dùng tự động đo mặt/căn chân của `keypose_import.py` cho hiệu ứng. Manifest đề xuất: frame rect, pivot, anchor-role, timing, hướng gốc, palette/material, source và tình trạng duyệt. Sheet phải ghép từ frame đã kiểm, không tin grid AI vẽ.
5. Registry ánh xạ skill/phase → FX và cue. Các event act/release/interrupt/impact/expire cần ID vòng đời; dọn startup bị hủy, shield cạn chân nguyên, restart và end battle. Asset không tự sinh damage hoặc callback quyết định gameplay.
6. Giữ telegraph có độ tương phản cao dưới FX, chữ sát thương và mục tiêu vẫn đọc được. Chọn chế độ giảm FX cho điện thoại; đề xuất pool sau khi đo số hiệu ứng đồng thời, chưa thêm chỉ vì có roster.

Đợt pilot chỉ tạo rết, bàn tay và impact băng. Nghe A/B âm cùng hình, kiểm âm lượng nhiều cue; không trì hoãn mọi phần để chờ đủ FX 39 nhân vật.

## 6. Khi nhận bộ asset 39 nhân vật

- Đối chiếu số **id thực tế**, variants và NPC; danh sách prompt cũ không đủ để khẳng định có đúng 39 nhân vật chiến đấu.
- Lập bảng mỗi id: thời kỳ, base/identity, clip có/thiếu, số pose, pivot, kích thước, anchor tay/vũ khí/mõm, trạng thái duyệt và kỹ năng có thể biểu diễn.
- Kiểm alpha/nền xanh, tràn frame, sai scale giữa clip, chiều mặt, anatomy, trang phục/giới tính và biến thể. Không tự đổi bản đã duyệt bằng file version mới nhất.
- Ghép contact sheet và preview diễn cả bộ ở kích thước thật; kiểm silhouette khi dùng skill thật. Asset đẹp không chứng minh skill đúng cốt truyện hoặc animation đã mượt.
- Review gameplay và identity có căn cứ; màu áo/phụ kiện mỹ thuật ghi là thiết kế khi chưa có nguồn. Chưa có clip riêng thì báo fallback đang dùng, không gán chưởng cho mọi skill.
- Sau review mới chọn pilot roster: BNB, Phương Chính, Heo rừng hoặc Điện Lang. Thanh Thư/summoner triển khai sau khi loại đường roi/đạn/summon tương ứng hoạt động.

## 7. Thứ tự triển khai và kiểm chứng

| Bước | Bàn giao review | Điều kiện đi tiếp |
|---|---|---|
| R-01 | Kiểm kê asset + baseline sim/benchmark hiện tại | Không thiếu file/clip bắt buộc, ghi rõ Thiên Bồng mới; giữ seed và chính sách bot |
| R-02 | Cấu hình sân 1v1, phép chiếu/input, thử sân A | Bounds/spawn hợp lệ, round-trip toWorld đúng, KO mọi góc không cắt, mobile vẫn đọc actor |
| R-03 | AI chung + BNB pilot | Phản ứng sau tín hiệu, đủ tài nguyên khi phát, không tự hủy liên tục hoặc kẹt biên |
| R-04 | Hai profile đối lập: caster và thú lao | Cách đánh nhìn khác nhau, không có chiêu trái kit/thời kỳ; vẫn giữ inventory PN |
| R-05 | Ba FX pilot, event/anchor và audio | Trúng/trượt/hủy phân biệt, không lệch hitbox, không sót FX/voice sau restart/kết trận |
| R-06 | Nhân rộng roster đã duyệt, campaign adapter | Save/nhánh và skill sở hữu đúng; không bật cả roster chưa kiểm |

Đo A/B riêng: **sân cũ/AI cũ → sân mới/AI cũ → sân mới/AI mới** với cùng kit, difficulty multiplier, seeds và chính sách chơi. Không đổi map, tài nguyên, HP và AI một lượt rồi quy mọi cải thiện cho AI.

Benchmark đề xuất 3 seed × 300 trận cho stand/spam/move ở mức Thường; thêm Khó sau pilot. Ghi tỷ lệ thắng, thời gian, timeout, quãng đường, thời gian đứng/chạy, damage nguồn, số hủy startup, số chiêu trượt, cạn chân nguyên và thời gian kẹt biên. Đây là đo bot, không thay chơi thử người thật.

Kiểm hành vi có mục đích: né cảnh báo sau reaction; giữ hướng húc trong active; không heal cạnh đòn đã báo; không dùng shield khi tiền duy trì không đủ; không nhìn input bí mật; không hủy hàng trăm lần; caster không vô hạn chạy vòng khiến trận timeout. Test một actor có id khác BNB để bắt các chỗ còn hard-code.

Kiểm view/input trên chuột và giả lập cảm ứng, rồi điện thoại thật: tap đi/đánh, điểm nhắm, Dừng, HUD không chắn sân, vật thể lớn ở depth gần. Đo frame time/FX trên thiết bị được ghi rõ; không tuyên bố đạt mobile chỉ từ Chrome desktop.

## 8. Nhờ Orange-kun review

1. Có đồng ý thử sân nhìn toàn bộ 1400×320 trước camera? Chốt cùng cách đánh giá tốc độ di chuyển trên màn hình và tầm chiêu.
2. Rà các hard-code PN/BNB và hằng số toàn cục trước refactor; đề nghị API cấu hình một trận nhưng giữ baseline PN–BNB hoạt động.
3. Review AI chấm điểm + commitment, thông tin được quan sát và cách khó lên mà không gian lận. Chốt BNB pilot trước khi viết profile hàng loạt.
4. Khi có asset mới, xác nhận danh sách id/thời kỳ/clip để chọn hai pilot có phong cách đối lập. Không giả định 39 asset đồng nghĩa 39 kit hoàn chỉnh.
5. Đồng ý ưu tiên generate rết/bàn tay/impact băng và pipeline FX riêng? Ghi phản hồi về event/anchor/âm trước nhập asset.
6. Phối hợp kế hoạch chân nguyên đang chờ review: AI dùng chung quy tắc chi phí của sim; giảm khóa 2s không nằm trong lượt mở sân/AI này.

## 9. Review của Orange-kun (02/10/2026)

### 9.1. Sân lớn: đo trước, kết quả đáng lo

Thử nhanh bằng bản sim chép ra scratchpad (chỉ đổi X1/Z1, spawn đặt giữa sân cách nhau 380 như cũ, kit/AI/seed giữ nguyên, Thường, seed 20261002, 300 trận). Runtime không đổi.

| Sân (world) | stand | spam | move | thời gian move |
|---|---:|---:|---:|---:|
| 1000×240 (hiện tại) | 10,7% | 1,7% | 84,7% | 43,8s |
| 1400×240 | 10,7% | 2,3% | **96,3%** | 44,5s |
| 1400×320 | 10,7% | 2,3% | 94,7% | 43,6s |

Sân rộng thì **thả diều mạnh hơn hẳn** (bot né đã thắng 85%, lên 96%). Chiều sâu 240 → 320 gần như không đổi gì. Vì vậy:

1. **Đồng ý thử sân A (toàn sân, không camera)**, nhưng R-02 và R-03 phải đi cùng nhau, hoặc làm AI chống thả diều trước. Nếu mở sân trước khi AI biết cắt góc và ép biên thì người chơi chỉ cần chạy vòng bắn Nguyệt Mang.
2. Đo kích thước sân bằng **thời gian chạy**, đừng đo bằng số world. Hiện PN chạy hết sân 780 trong khoảng 2,9s và tầm Nguyệt Mang 560 bằng 72% sân. Ở 1400, chạy hết sân mất 4,5s và tầm chỉ còn 47%. Đề xuất mục tiêu ban đầu 1200×260: chạy hết khoảng 3,8s. Bậc 1400 thử sau.
3. Tốc độ: **giữ tốc độ world, chấp nhận tốc độ trên màn hình giảm** (vì 1400 world vẫn chiếu vào 960 px). Sprite giữ cỡ pixel cũ nên trông to hơn so với sân. Nếu thấy bước đi chậm hoặc chật thì chuyển sang camera B. Không tăng speed toàn bộ, vì làm vậy sẽ đổi cân bằng tầm/né.
4. Phép chiếu cho sân mới nên dùng cùng công thức padding Orange-kun đề xuất cho KO (`sx = OX + x·KX`, lề ≥ bề vươn sprite lớn nhất + 2 px; xem `KE_HOACH_CHOT_SANDBOX_PN_BNB.md` §8). `worldRect` / `playableBounds` của blue-chan khớp với hướng này: lề là của view, sim chỉ biết `playableBounds`.

### 9.2. Hard-code cần gỡ trước refactor (đã grep)

Số lần tham chiếu `SBSim.X0/X1/Z1` hoặc `'pn'/'bnb'/actors.pn/actors.bnb`: `input.js` 15, `view.js` 12, `sim.js` 6, `hud.js` 5, `audio.js` 2, `ai.js` 1, `battle_sandbox.html` 1. Đề xuất API:

- `SBSim.create(kits,{arena:{bounds,spawns}, ids:{player,enemy}})`. `B.arena` thay hằng toàn cục, và view/input/AI đọc `B.arena`. Mặc định giữ đúng 110/890/240 để bench cũ chạy y nguyên.
- `other(B,a)` → `B.opponentOf(a)`. Nếu 1v1 thì trả actor còn lại theo `ids`. Không đặt cứng id `'bnb'` trong AI/HUD/audio (`audio.js` đang so `e.who==='bnb'` để chọn âm băng; nên chọn theo `kit.material` hoặc cue của skill).
- Test hồi quy thêm một ca với id địch khác `bnb` (đúng như mục 7 đề xuất).

### 9.3. AI chấm điểm: đồng ý, kèm hai lưu ý

- **AI hiện đang đọc thông tin ẩn**: `ai.js` né Nguyệt Mang dựa vào `ta.aim.z`, tức điểm con trỏ người chơi nhắm. View không vẽ điểm nhắm này. Như vậy là vi phạm luật “chỉ dùng thứ nhìn thấy” ngay trong code hiện tại. Sửa một trong hai cách: (a) vẽ hướng/vệt nhắm lúc PN lấy đà Nguyệt Mang (cũng giúp người chơi đọc đòn khi chơi PvP sau này), hoặc (b) AI chỉ dùng hướng mặt + z hiện tại của PN để ước lượng. Orange-kun nghiêng về (a).
- Đừng làm utility AI quá “thông minh” rồi mới thêm sai số. Dựng bộ khung quan sát → lọc bằng `check` → chấm điểm, rồi **cho mỗi hồ sơ một số ít trọng số**. Độ khó đổi `reaction`, `aimError`, `commitment`; hệ số sát thương giữ riêng như blue-chan nói. BNB pilot phải tái hiện được hành vi hiện tại trước, rồi mới thêm cắt góc. Như vậy mới so được với bench cũ.
- Thêm vào hồ sơ: `kiteCounter` (cắt góc, ép biên, lướt áp sát khi người chơi đang lùi). Đây là thứ thiếu nhất theo số đo ở 9.1.

### 9.4. Hồ sơ nhân vật (mục 4)

Đồng ý cách tách “phong cách” khỏi “năng lực”. Bảng hiện tại đúng tinh thần. Lưu ý thêm:

- Lôi Quan Lang Vương / Điện Lang: prompt roster đã ghi `dien_lang` khác `loi_quan_lang` (tru vs sét). Profile phải theo đúng id đó.
- Hàn Bất Lưu: summon cần nhiều actor, nên đẩy ra sau R-06 như blue-chan ghi. Đồng ý.
- Pilot đối lập: đề xuất **Phương Chính (caster tầm trung)** + **Heo rừng (lao theo đợt)**. Hai kiểu này dùng được ngay các `kind` sim đã có (`proj`, `melee` + `dash` có hướng cam kết) nên ít phải thêm cơ chế mới.

### 9.5. FX generate

- Đồng ý: ưu tiên rết / bàn tay / impact băng, và pipeline FX **riêng** (không dùng `keypose_import.py` vì nó đo mặt/căn chân). Prompt rết/tay đã có ở `PROMPT_MUSE_ROSTER.md` §4b, dùng lại.
- Màu key: đề xuất **magenta #FF00FF** cho mọi FX (an toàn với lá/xanh Thanh Đằng, băng trắng và vàng rết). Nếu Muse trả alpha thật thì ưu tiên alpha.
- Manifest FX đề xuất ở mục 5.4 là đủ. Thêm `blend` (normal/add) và `loopFrames` cho xoáy băng.
- Registry cần `hid` trên event `act`/`release`. Hiện `act` vẫn chưa có `hid` (đã ghi ở VFX §13).

### 9.6. Thứ tự đề xuất sửa lại

R-01 → **R-03a** (AI khung + BNB tái hiện hành vi cũ + kiteCounter, gỡ đọc `aim`) → R-02 (sân 1200×260 + `B.arena`) → R-03b (đo sân mới với AI mới) → R-04 → R-05 → R-06. Đo A/B ba bước như mục 7 vẫn giữ, chỉ đổi thứ tự để không bao giờ có bản sân rộng + AI cũ được coi là baseline chơi thử.

### 9.7. Cần người dùng quyết định

- Sân rộng: nhìn toàn sân (nhân vật giữ cỡ, bước đi trên màn hình trông chậm hơn khoảng 30% ở sân 1400), hay muốn camera đi theo (giữ nhân vật to, phải có chỉ báo khi đối thủ ra ngoài màn hình)?


<a id="source-note_apply_thien_bong_3s"></a>

## Nguồn: `NOTE_APPLY_THIEN_BONG_3S.md`

SHA-256 trước gộp: `12f50f11be4afad71378c9e50119410588af9cb36ddc5a8f8bf4799c23099d7d`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Thiên Bồng 3s — Blue-chan bàn giao Orange-kun

02/10/2026. Đã áp theo yêu cầu người dùng vào **sandbox E** (`battle_sandbox.html`). Chưa nối inventory campaign hoặc thay cơ chế của battle cũ trong `js/data.js`.

## Thông số đã áp

- `js/sandbox/kits.js`: vận 0,90s, giáp giảm 65% sát thương tối đa 3s từ release; phí bật 18, phí duy trì 5 chân nguyên/s; ngừng regen khi giáp tồn tại. CD 14s, active 0,05s và recovery 0,30s giữ nguyên.
- Trong pha vận, actor ở state `act` nên không tự di chuyển. Người chơi vẫn có thể ra lệnh di chuyển có cancel để hủy vận theo luật hiện có; giáp chưa bật và không thu phí trước release. Không thêm luật phí hủy 25% ở lượt này.
- `js/sandbox/sim.js`: phí duy trì tính từ release bằng simulation clock, chỉ thu phần thời gian giáp thực sự tồn tại. Duy trì đủ 3s mất 15, cộng phí bật là 33. Hết chân nguyên hoặc hết 3s phát `shieldEnd`; thời gian còn lại trong tick được hồi chân nguyên bình thường.
- Các giáp khác chưa có upkeep giữ regen cũ. Thay giáp chấm dứt phí duy trì của giáp trước. Sau khi kết quả trận chốt, không trừ phí/hồi chân nguyên thêm.
- `js/sandbox/hud.js`: mô tả mới và nhãn giáp đang bật hiển thị `−5 c.n/s` cùng thời gian còn lại.

## Kiểm tra

`node tools/sandbox_regression.cjs` đạt toàn bộ các nhóm cũ và nhóm mới: trước release không có giáp, đứng yên trong vận, phí bật 18, phí duy trì đúng 15 trong 3s, không regen trong giáp, regen trở lại sau hết hạn, cạn chân nguyên tắt sớm, thay giáp ngừng upkeep, hủy vận không thu phí, kết trận ngừng cập nhật tài nguyên.

Đây là kiểm tra logic production qua Node; chưa đo lại tỷ lệ thắng hoặc playtest trên điện thoại cho thông số mới. Không diễn giải kết quả hồi quy là cân bằng đã đạt.

Kế hoạch tổng thể: [Cân bằng cổ trùng và BNB](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_can_bang_co_trung_va_bnb_theo_moc_truyen). PN vẫn phải lấy cổ từ inventory khi tích hợp campaign; lượt này chỉ sửa effect Thiên Bồng trong sandbox, không cấp/tước bộ cổ người chơi.

## Review của Orange-kun (02/10/2026)

Đã đọc `kits.js`, `sim.js` (`stepEss`, `fire`), `hud.js`; chạy `node tools/sandbox_regression.cjs`: **đạt toàn bộ**, gồm nhóm Thiên Bồng.

**Đúng / giữ:**
- `stepEss` tính upkeep theo thời gian sim, chỉ trong khoảng giáp thật sự tồn tại. Phần tick sau khi giáp tắt được hồi lại. Thay giáp thì ngừng upkeep. Kết trận thì không tính tiếp. Logic chặt.
- Giáp chỉ có tại release. Lúc vận 0,9s không có giáp, hủy bằng di chuyển không mất phí, khớp luật hủy hiện hành.
- HUD hiện `−5 c.n/s` và thời gian còn lại.

**Lỗi cần sửa (nhỏ, có thật):** upkeep chạy trong lúc PN đang lấy đà chiêu khác. Cổ đó đã qua `check()` lúc nhận lệnh, nhưng tới `fire()` thì thiếu phí mà vẫn phát, vì phí bị clamp về 0. Ví dụ: còn 14,5 nguyên, bật Cự Xỉ (phí 14, lấy đà 0,55s) trong lúc Thiên Bồng đang bật → tới release chỉ còn 11,75 mà Cự Xỉ vẫn ra. Đề xuất: `fire()` kiểm tra `a.ess>=cost`; thiếu thì emit `fizzle`, không trừ, không đặt CD/khóa chung, gỡ zone nếu là AoE. Thêm một test hồi quy cho đúng ca này.

**Ghi nhận nhỏ (không phải lỗi):** khi giáp bị thay giữa tick, phần upkeep của tick cuối giáp cũ (≤1/60s) không bị thu. Sai số không đáng kể.

**Đo cân bằng sau khi áp** (seed 20261002, 300 trận/chính sách):

| Mức | stand | spam | move | thời gian trận move |
|---|---:|---:|---:|---:|
| Thường | 10,7% | 1,7% | 83,3% | 43,5s |
| Khó | 0% | 0% | 46,7% | 38,1s |

So với số trong `NOTE_COOLDOWN_CHUNG_VA_BOSS_BNB.md` (Thường spam 53,7%): spam giảm mạnh xuống 1,7%. Thiên Bồng 3s + upkeep đã hết là nút “thắng chắc khi đứng đánh”. Move bot vẫn cao ở Thường, nhưng bot phản ứng 0,15s và biết hình học. Không ép xuống 50% chỉ dựa vào bot (đồng ý với blue-chan). Cần người thật chơi thử.

**Cần người dùng thử:** cảm giác đứng vận 0,9s trên điện thoại. AI Thường hiện chưa chủ động phạt lúc PN vận, nên ở Thường cửa sổ này gần như an toàn.

## Blue-chan sửa lỗi release sau review

Đã kiểm tra lại phí trong `fire()`: upkeep làm thiếu phí thì emit fizzle và kết thúc act, không phát đòn, không trừ phí kích hoạt, không đặt CD/khóa chung; zone chờ được gỡ và phát zoneCancel. View hiện “thiếu chân nguyên”, không phát cue release giả. Không thêm reservation hoặc phí hủy 25%; vật phẩm dùng lúc start giữ luật cũ.

Test hồi quy bổ sung: PN còn 14,5 khi nhận Cự Xỉ trong giáp, tới release không đủ 14 thì không damage/bleed/release; kiểm thêm AoE thiếu phí không còn zone và không zoneFire. Toàn bộ sandbox regression, dữ liệu và hồi quy engine đạt. Không đo lại tỷ lệ thắng sau bản sửa này.


<a id="source-note_apply_san_1200_ai_ep_nhip"></a>

## Nguồn: `NOTE_APPLY_SAN_1200_AI_EP_NHIP.md`

SHA-256 trước gộp: `f106ecc9903d2bead722c4fcde83621729fea4c4ba02dd71eae18004da38ac85`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Sân 1200×260 và AI ép nhịp — Blue-chan bàn giao Orange-kun

02/10/2026. Đã triển khai bước thử sân + BNB pilot sau người dùng chốt nhìn toàn màn. Chưa tạo roster/FX mới, chưa nối campaign. Nền trúc đang có được tái sử dụng nguyên ảnh, không gọi đây là map mỹ thuật mới đã duyệt.

## 1. Preview và cấu hình

- Mặc định `battle_sandbox.html`: sân 1200×260, playable x=110…1090, AI `pressure` (Ép nhịp). Giữ viewport 960×430, kích thước sprite, kit, HP, damage, phí, cooldown và tốc độ world.
- Có dropdown Sân và AI. URL đối chứng: `?arena=classic&ai=legacy`; bản thử: `?arena=wide&ai=pressure`. Classic vẫn world 1000, x=110…890, z=240.
- `SBSim.create()` mặc định vẫn classic để test/caller cũ không tự mở rộng. Cấu hình từng trận ở `B.arena`, preset dùng chung `SBSim.ARENAS`; validate biên/số hữu hạn. Khoảng cách spawn vẫn 380 world, đặt quanh giữa sân.
- Thêm `B.ids` và `B.opponentOf()`, gỡ cặp id cứng trong sim/input/HUD/view/AI. Audio impact dùng `skill.fx` thay vì tên BNB. Đã test sim với `hero/rival`; chưa coi đây là hoàn tất hỗ trợ roster hoặc nhiều địch.

## 2. Phép chiếu và margin

- Sàn chiếu cùng khoảng y=250…400; z lấy từ arena đang chạy. `ground_screen_y` lỗi về baseline, không chia cho 0.
- `KX=(960−2×127)/(X1−X0)`, `OX=127−X0×KX`, `sx=OX+x×KX`; `toWorld` đảo đúng công thức. Range/guide/AoE/cung rết cùng dùng KX, không chỉ dịch actor.
- Không thu biên sim để giấu clipping. Đo alpha ≥100 mọi frame/clip: PN vươn tối đa 123,47px; BNB 124,66px ở scale gần nhất. Lề 127px dư lần lượt 3,53/2,34px. Kết quả chỉ bảo đảm hai asset hiện tại; thú/FX rộng phải đo riêng.
- Tốc độ world giữ nguyên; đi ngang nhìn chậm hơn khi trải 980 world vào 706px. Với PN speed 265, vượt biên sân rộng mất khoảng 3,70s so với 2,94s sân classic, bỏ qua slow/va chạm.

## 3. Telegraph và AI

- Projectile có snapshot `telegraph` từ lúc nhận lệnh: vị trí, hướng đã khóa, range và visibleAt. View vẽ hướng trên sàn và từ tay trong startup, tắt khi release/hủy. Điểm nhắm touch còn đang chọn chưa được công khai hoặc đưa cho AI.
- AI né đạn đọc ray công khai, kiểm hướng/độ lệch và chờ ít nhất 0,15s; không đọc `act.aim`. Event act/release thêm hid cho vòng đời FX sau này.
- BNB pilot ghi quan sát vị trí ở nhịp nghĩ; suy vận tốc từ hai mẫu, giới hạn theo tốc độ đi. Không đọc đích move, con trỏ hoặc tương lai.
- Nhóm ứng viên: cắt góc khi địch lùi, áp sát khi thấy vận buff/heal/đạn, ép biên. Ghi `actor.decision` gồm role/thời điểm/đích để debug. Lướt dùng khi check hợp lệ, không tăng speed hoặc teleport; state bận giữ nguyên.
- Mức Thường Ép nhịp nghĩ 0,28s + jitter tối đa 0,1s; đối chứng giữ 0,4s + 0,15s. Thường có xác suất né melee/grab startup đã lộ ≥0,2s; Khó giữ khả năng né đó. Không tăng damage multiplier trong lượt này.
- AI mới không đặt Lốc lên actor đang move; còn hạn chế chọn thời điểm tốt hơn. Đây là **BNB pilot bổ sung nhóm ứng viên**, chưa phải utility AI đầy đủ cho mọi kit.

**Lưu ý đối chứng:** `legacy` giữ chính sách trước nhóm ép nhịp, nhưng cũng được sửa đọc aim ẩn thành telegraph công khai và thêm trễ phản ứng. Vì vậy không gọi nó là bản AI cũ giống byte-for-byte. Báo cáo cũ Orange đo dùng phiên bản khác, không ghép tỷ lệ hai báo cáo làm cùng một thí nghiệm.

## 4. Benchmark bản cuối

Thường, cùng kit/damage/speed, ba seed 20261002/42/9001, mỗi seed 300 trận mỗi chính sách. Báo cáo: [sandbox_arena_ai_2026_10_02.json](../../tools/reports/sandbox_arena_ai_2026_10_02.json).

| Sân / AI | PN đứng yên thắng | PN spam thắng | PN né/phản công thắng |
|---|---:|---:|---:|
| Classic / đối chứng | 10,7–12,7% | 1,7–4,3% | 81,7–84,3% |
| Wide / đối chứng | 10,7–12,7% | 2,3–3,3% | 86,7–91,7% |
| Classic / Ép nhịp | 4,0–5,0% | 5,0–5,7% | 75,3–81,0% |
| Wide / Ép nhịp | 4,0–5,0% | 2,3–3,0% | 84,7–88,3% |

Không timeout trong các lượt trên. Wide/Ép nhịp bot né đánh khoảng 41,9–42,7s. Hiệu quả chống thả diều **có nhưng còn nhỏ**; sân rộng vẫn giúp né so với classic. Không ép tỷ lệ về 50% bằng tăng damage/HP. Cần người thật thử nhịp nghĩ mới, chất lượng ray và tốc độ đi nhìn trên mobile. Chưa đo lại Khó trong lượt này.

Đo lại một cấu hình:

```bash
node tools/sandbox_bench.cjs 300 thuong compare 20261002 wide pressure
node tools/sandbox_bench.cjs 300 thuong compare 20261002 classic legacy
```

## 5. Kiểm tra

- Sandbox regression: các nhóm cũ, arena/id riêng, clamp movement, phí release, AI không đọc getter aim/đích move ẩn và cắt góc từ quan sát đều đạt.
- Input regression, kiểm dữ liệu và engine regression đạt; cú pháp các file thay đổi qua.
- Chrome desktop và viewport mobile 390px: tải không lỗi, tap chọn Nguyệt/commit/Dừng qua, không tràn ngang; hai mép hiển thị x=127/833 đảo về đúng x=110/1090. Chưa thử điện thoại thật.
- Preview ảnh ở `previews/arena-ai-v01/`: desktop, mobile và telegraph. Browser test `tools/sandbox_browser_regression.cjs` cần server 8765, Puppeteer và Chrome local.

## 6. Orange cần review tiếp

1. Kiểm sx/toWorld/tầm/va chạm hình và tốc độ cảm nhận; kiểm thêm ảnh KO ở bốn góc trên thiết bị.
2. Telegraph hướng công khai có quá rối không? Cùng ray dưới chân và từ tay cần duyệt hình; không bỏ ray mà vẫn cho AI đọc hướng chính xác.
3. Review tránh zigzag, phí/nhịp lướt, luật né Thường và nhóm ứng viên. Test người thật trước chỉnh thêm thông số.
4. Khi nhận asset mới, chọn Phương Chính/Heo rừng cho pilot kế tiếp, thêm kit/profile theo thời kỳ thực; hiện chưa tạo hai kit này.
5. FX rết/bàn tay/impact băng và pipeline nhập riêng vẫn là bước tiếp theo, chưa generate hoặc nghiệm thu trong lượt sân/AI này.


<a id="source-note_tiep_nhan_review_orange_canon_mobile"></a>

## Nguồn: `NOTE_TIEP_NHAN_REVIEW_ORANGE_CANON_MOBILE.md`

SHA-256 trước gộp: `8669091f9dcf91a1a55cdce92bf65dec3807a7aea21a6838e26317beb4a1f341`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Blue-chan tiếp nhận review Orange-kun — canon, release và mobile

02/10/2026. Sửa tiếp theo phản hồi Orange-kun người dùng chuyển lại. Không commit/push; giữ các sửa khác Orange đang có trong workspace.

## Đã làm

- Sửa bảng và hồ sơ trong kế hoạch BNB theo đối chiếu bản Việt Orange ghi: ch.143 đoạt Xích Thiết Xá Lợi, Thạch Khiếu, Thủy Tráo; Lam Điểu có từ ch.136; BNB áp chế nhị chuyển ch.134; Sương Yêu là tăng công, tự bạo mất cổ/tay ở ch.139–140. Ghi riêng điểm mâu thuẫn ch.143. Chưa triển khai kit boss theo các thời kỳ.
- `kits.js`: sửa nguồn/mô tả action Sương Yêu hiện tại, ghi rõ action thoát thân là chuyển thể từ sự kiện tự bạo, không phải công dụng gốc của cổ. Không thay nó thành buff hoặc cấp Lam Điểu ngay trong sandbox.
- `sim.js`: kiểm phí lại lúc fire. Thiếu phí do upkeep thì fizzle; không release/damage/CD/khóa chung, gỡ zone chờ. `view.js` hiện thông báo thiếu chân nguyên.
- `input.js`, `hud.js`, `battle_sandbox.html`: Dừng giống S (cancel:true và xóa hướng giữ); Lướt chạm dùng ngay theo hướng đi, đứng yên thì ra xa địch; hướng bị chặn hoàn toàn thì dùng chiều sâu còn trống. Nguyệt Mang chọn ô rồi chạm sân để nhắm, có Hủy nhắm riêng. Các ô buff/heal/melee/grab dùng ngay như trước.
- Touch/pen commit pointerup ngón chính; không phát khi pointercancel; ngoài sân không phát. Dọn lựa chọn khi dùng chuột/phím, blur/ẩn tab/kết trận. Giữ tick mũi tên, chuẩn hóa hướng chéo và luật hủy khi nhấn mới. Listener input được hủy khi init lại.
- Cập nhật kế hoạch chân nguyên: ưu tiên phí cổ, cỡ bể, phí Băng nhận trước việc chỉ tắt regen; không coi số đo Orange là benchmark đã chạy lại bởi Blue.

## Chưa áp

- Phí Băng nhận 3, pool BNB 130, regen 0,8 và các ứng viên cân bằng: cần lượt A/B riêng. Không đổi khóa chung 2s, không cấp/tước bộ cổ PN.
- Lề hiển thị 127px mỗi bên: đồng ý ưu tiên thử thay cho thu sân; chưa đổi sx/toWorld hoặc biên sim. Khi áp phải dùng hệ số ngang mới cho tầm chém, đạn, AoE và guide, không chỉ vị trí actor. Kiểm toàn bộ clip/bốn góc và điểm nhắm.
- Kit Sương Yêu tăng công/tự hại, Lam Điểu và trạng thái cụt tay/đoạt cổ: mới cập nhật đặc tả; sandbox vẫn là kit demo trộn thời kỳ.

## Kiểm tra và phần Orange cần kiểm lại

- `node tools/sandbox_regression.cjs`: đạt các nhóm cũ và test Cự Xỉ/AoE thiếu phí tại release.
- `node tools/sandbox_input_regression.cjs`: đạt touch commit/cancel/ngón phụ, nhắm Nguyệt, Lướt dùng ngay, S/Dừng, blur/kết trận và chuột. Nạp input production + sim production, dùng EventTarget giả lập môi trường; **không thay thế test DOM hoặc trình duyệt**.
- `node tools/check.cjs`, `node tools/regression_test.cjs`: đạt. Kiểm cú pháp input/hud/view qua.
- Chưa playtest trên trình duyệt/điện thoại thật hoặc đo lại benchmark sau lượt này. Orange cần kiểm nút HUD chỉ phát một lệnh khi touch/click, thao tác chọn/Hủy/Dừng, lướt ở biên và cảm giác chọn điểm Nguyệt trong trận chạy.

File code: `js/sandbox/sim.js`, `kits.js`, `input.js`, `hud.js`, `view.js`, `battle_sandbox.html`; test: `tools/sandbox_regression.cjs`, `tools/sandbox_input_regression.cjs`.


<a id="source-note_cooldown_chung_va_boss_bnb"></a>

## Nguồn: `NOTE_COOLDOWN_CHUNG_VA_BOSS_BNB.md`

SHA-256 trước gộp: `884d3e44ae57d3002c6aebfa3ab1601d477f6eec49875b6a969c8ec133b1865a`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Bàn giao Orange-kun — cooldown chung và boss Bạch Ngưng Băng

Blue-chan, 02/10/2026. Đã tích hợp trong sandbox E, chưa commit/push. Ghi chú này cập nhật kết quả sau lượt cân bằng trước ở `NOTE_TICH_HOP_SANDBOX_E.md`.

## 1. Luật đã tích hợp

- Mỗi actor chỉ có một action đang thực hiện, một lệnh chờ cuối, không thực hiện bốn chiêu cùng lúc.
- Khi action cổ/vật phẩm **phát hiệu lực**, các action cùng nhóm khác có cooldown bằng 0 nhận cooldown **2 giây**. Actor đối phương không bị khóa.
- Chiêu đang hồi giữ nguyên thời gian, chỉ tiếp tục giảm theo simulation. Ví dụ còn 0,5s vẫn còn 0,5s, không bị nâng lên 2s; còn 8s vẫn tiếp tục từ 8s.
- Chiêu vừa dùng nhận cooldown riêng, không cộng thêm 2s.
- Đánh thường (`atk`, cả hai actor), lướt (`dash`), đi và dừng miễn khóa chung; vẫn phải tuân thủ action đang bận, pha được hủy và cooldown lướt riêng.
- Sinh Mệnh Diệp có trong nhóm action nhận/kích hoạt khóa chung. Sương Yêu cũng có; đây là cổ tiêu hao, không phải lướt thường. Action đã hết lượt bị bỏ qua khi đặt khóa.
- Hủy/bị ngắt trước release không kích hoạt khóa. Lá và Sương Yêu vẫn mất lượt từ lúc bắt đầu dùng theo luật cũ.
- Hộ thể đã kích hoạt còn tồn tại đến hết thời lượng, có thể dùng chiêu khác sau khóa. **Một action kích hoạt tại một thời điểm**, không phải chỉ được có một hiệu ứng cổ tồn tại trên người.
- Quy ước `atk` miễn khóa bao gồm Băng Nhận của BNB dù tạo hình là đòn băng. Orange cần giữ rõ đây là ngoại lệ gameplay cho ô đánh thường, không khẳng định đó là đòn vật lý không dùng cổ.

Trong `sim.js`, khóa dùng chung `actor.cd`, nên `check`, bộ đệm lệnh, AI và HUD cùng nhìn một thời gian. Lệnh đã xếp hàng cũng được kiểm tra lại khi thực hiện; không vượt khóa mới phát sinh. HUD hiện số giây và vòng hồi, hướng dẫn thêm luật 2s.

## 2. Bộ action hiện tại: Phương Nguyên

**8 action trên thanh điều khiển: 5 chiêu cổ chủ động + 1 vật phẩm + lướt + đánh thường.** Đi/dừng không tính là ô kỹ năng. Đây là bộ loadout sandbox, không khẳng định PN sở hữu đúng toàn bộ đồng thời ở một chương.

| Phím | Action | Công dụng | Hồi riêng | Chi phí/lượt |
|---|---|---|---:|---:|
| Chuột | Đánh tay | 13 sát thương, tầm 85, lấy đà 0,28s | 0s | 0 |
| Q | Nguyệt Mang | Đạn 21 sát thương, xuyên một nửa giảm sát thương hộ thể | 2,8s | 9 chân nguyên |
| W | Bạch Ngọc | Giảm 50% sát thương, 3s | 9s | 10 chân nguyên |
| E | Cự Xỉ Kim Ngô | 34 sát thương và chảy máu 4/s trong 3s | 6s | 14 chân nguyên |
| R | Cường Thủ | 18 sát thương, kéo lại gần 110 đơn vị | 10s | 16 chân nguyên |
| D | Thiên Bồng | Giảm 65% sát thương, 5s; thay hộ thể trước | 14s | 18 chân nguyên |
| Space | Lướt | 190 đơn vị, không bất tử | 2,5s | 0 |
| 1 | Sinh Mệnh Diệp | Hồi 50 HP | 8s | 2 lá/trận |

HP 220, chân nguyên 100, hồi chân nguyên 1,8/s, tốc độ đi 265. Khi trúng đòn, khựng 0,32s rồi được bảo vệ khỏi khựng thêm 1,2s; vẫn mất máu.

## 3. Bộ action hiện tại: Bạch Ngưng Băng

**5 action: Băng Nhận đánh thường + 3 chiêu đặc biệt + lướt.** Không suy ra thành 5 con cổ khác nhau: Lốc Băng Nhận là cách đánh, lướt là cơ chế game.

| Action | Công dụng | Hồi riêng | Chi phí/lượt |
|---|---|---:|---:|
| Băng Nhận (`atk`) | 24 sát thương ở Thường, làm chậm còn 70% tốc độ trong 1,2s; lấy đà 0,65s | 0s | 0 |
| Lốc Băng Nhận | 96 sát thương ở Thường, bán kính 125, đặt trong tầm 340, báo trước 1,15s; khóa vị trí từ lúc lấy đà, không bị ngắt | 10s | 22 chân nguyên |
| Thủy Tráo | Giảm 40% sát thương, 3s | 10s | 12 chân nguyên |
| Sương Yêu | Thoát thân 380 đơn vị, xóa chảy máu/chậm; mất lượt từ lúc bắt đầu | 0s | 1 lần/trận |
| Lướt | 170 đơn vị, không bất tử | 2,5s | 0 |

HP **300**, chân nguyên 100, hồi 2,4/s, tốc độ đi 235. Lượt này không tăng HP hoặc thêm cổ mới. Mức Khó giữ nhân sát thương 1,2: Băng Nhận 29, Lốc 115 sau làm tròn; còn giảm bởi hộ thể.

## 4. Boss Khó đã thông minh hơn ở đâu

Chỉ nâng chính sách **Khó**, Dễ/Thường giữ chính sách AI trước đó. Cooldown chung áp dụng cho mọi mức và cả hai actor.

1. Nhịp suy nghĩ Khó từ 0,28–0,36s xuống 0,18–0,24s, vẫn không phản ứng từng frame.
2. Khi thấy PN lấy đà đòn cận chiến/chộp ít nhất 0,2s và đang nằm trong tầm, lách theo chiều sâu khỏi ô đòn. Giữ một điểm né cho mỗi hit-id để tránh đổi hướng liên tục.
3. Khi thấy PN đang dùng lá/phóng đạn ít nhất 0,15s ở khoảng cách 150–330, có thể dùng lướt áp sát. Người chơi cần chọn vị trí hồi máu, thay vì luôn đứng dùng lá an toàn.
4. Không dùng Lốc khóa vị trí lên mục tiêu đang chạy ở mức Khó; tiếp tục áp sát đợi cơ hội. Né Nguyệt bằng dash, Thủy Tráo, Sương Yêu và xác suất áp sát cũ vẫn còn.
5. Không đọc lệnh di chuyển tương lai, không sửa vùng Lốc sau khi đã đặt, không tự thêm bất tử hoặc tăng sát thương riêng theo cách chơi người dùng.

Preview kiểm tra: [sandbox mức Khó](http://localhost:8765/battle_sandbox.html?lvl=kho). Trang không có tham số vẫn mặc định **Thường**; đừng thử trang mặc định rồi tưởng đã chạy chính sách boss Khó.

## 5. Kết quả đo, không phải tỷ lệ thắng người thật

Cùng benchmark seed `20261002`, 300 trận mỗi chính sách, khoảng 0,1s giữa các quyết định bot:

| Mức, bản hiện tại | Đứng yên | Áp sát spam | Né/giữ khoảng cách/phản công |
|---|---:|---:|---:|
| Dễ | 25,0% | 76,0% | 100% |
| Thường | 9,3% | 53,7% | 93,7% |
| Khó | 0% | 0% | 52,7% |

Đối chứng Khó **đã có khóa 2s nhưng chưa sửa AI**: bot né thắng 77,7%. Sau sửa AI: 52,7%. Seed 42/9001 với AI mới: bot né 61,3% / 61,7%, spam và đứng yên vẫn 0%. Không có timeout trong các lượt đo cuối.

Điều này cho thấy mức Khó phạt rõ việc bỏ qua vị trí/né. Nhưng bot spam không thử mọi cách dựng hộ thể hoặc combo tối ưu; không kết luận người thật không thể thắng khi áp sát. Chưa coi đây là cân bằng cuối cho điện thoại.

Số liệu: [sandbox_gu_lock_2026_10_02.json](../../tools/reports/sandbox_gu_lock_2026_10_02.json). Chạy lại:

```bash
node tools/sandbox_regression.cjs
node tools/sandbox_bench.cjs 300 kho compare 20261002
node tools/sandbox_bench.cjs 300 kho compare 42
node tools/sandbox_bench.cjs 300 kho compare 9001
```

## 6. Đối chiếu cốt truyện: vấn đề cần sửa trước khi thêm cổ

Căn cứ repo: [chi tiết Q1](CHI_TIET_NGUYEN_TAC_Q1.md), [kế hoạch battle E mục B3–B4](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chinh_battle_e_v2).

- Hồ sơ BNB ở kế hoạch ghi **trước mất tay, ch 133–138**, nhưng đã dùng Lốc ở ch 140 và Thủy Tráo được ghi nhận ở ch 143. PN có Thiên Bồng mốc ch 155 cùng rết và Cường Thủ. Bộ hiện tại là tổng hợp kỹ năng Q1 để thử engine, chưa phải một cuộc giao đấu được chốt đúng thời điểm.
- Theo bản chương 143 tiếng Anh được tìm thấy trên WebNovel, PN lấy Thủy Tráo từ BNB. Không thể giữ nguyên bộ của BNB trước mất cổ rồi đặt trận sau sự kiện đó mà không giải thích. [Bản chương 143: Answer](https://www.webnovel.com/book/reverend-insanity%28english%29_32605619408374705/chapter-143-answer_87702437749638593). Đây là bản đăng lại được tìm thấy, không gắn nhãn là bản dịch chính thức đã xác minh.
- Bạch Ngọc/Băng Trùy của BNB vẫn chưa được xác minh phù hợp mốc trận; không thêm lại chỉ để boss có nhiều nút. Băng Tinh trong tài liệu `NGUYEN_TAC_Q1_DOI_CHIEU_CU.md` cũng cần đối chiếu, không dùng tài liệu mang nhãn cũ làm chứng cứ duy nhất.
- Nguồn chương 143 nhắc thêm cổ trên người BNB; việc sở hữu không đủ để tự chế một chiêu gây sát thương và coi là nguyên tác. Chưa đưa các cổ này vào runtime.
- Bạch Ngọc và Thiên Bồng hiện là hai hộ thể thay nhau. Cần kiểm tra quan hệ hợp luyện và khả năng cùng sở hữu ở mốc PN được chọn trước khi chốt loadout campaign; không mặc định bảng sandbox là hồ sơ nguyên tác.

**Đề xuất cho Orange:** chốt chương/cuộc giao đấu trước, rồi lập hai danh sách cổ ở thời điểm ấy: đang sở hữu, đã mất/hợp luyện/tiêu hao. Nếu chỉ cần boss khó ngay trong sandbox, dùng AI Khó hiện tại; chưa cần tăng HP vô cớ hoặc bịa thêm cổ. Bộ chiêu đúng mốc sẽ là thay đổi riêng, có nguồn và clip/VFX tương ứng.

## 7. File và kiểm thử cần review

- `js/sandbox/sim.js`: đặt khóa tại release, bỏ qua cooldown đang chạy/action hết lượt và nhóm miễn khóa; xuất `GU_LOCK=2`.
- `js/sandbox/hud.js`: vòng cooldown có mẫu số tối thiểu 2s, thêm hướng dẫn khóa chung.
- `js/sandbox/ai.js`: hành vi Khó như mục 4.
- `tools/sandbox_regression.cjs`: kiểm tra khóa trước/sau release, không kéo dài cooldown cũ, không khóa đối thủ/đánh thường/lướt, hết lượt, hủy trước release và hành vi boss Khó. Giữ các test kết trận/né trước đó.
- Kiểm tra dữ liệu và hồi quy engine đạt; Chrome desktop/mobile giả lập nhận tap/chuột/phím đúng, không có lỗi JavaScript. Chưa thử điện thoại thật.
- Lượt này không thêm asset hay sửa campaign; giữ nguyên các thay đổi map/VFX và thông số kit từ lượt cân bằng trước.

## 8. Review của Orange-kun (02/10/2026)

**Đồng ý giữ:** khóa đặt tại release, không kéo dài CD đang chạy, miễn `atk`/`dash`/đi/dừng, hủy trước release không khóa. Dùng chung `actor.cd` giúp check/buffer/AI/HUD đồng bộ. HUD lấy mẫu số `max(s.cd, GU_LOCK)` nên không chia cho 0 với Sương Yêu (`cd:0`). Hồi quy đạt.

**Ý kiến:**
- Sương Yêu (escape) đang nhận khóa 2s sau Lốc/Thủy Tráo. Hiện chấp nhận được, nhưng nếu đổi Sương Yêu theo review ở `KE_HOACH_CAN_BANG_CO_TRUNG_VA_BNB_THEO_MOC_TRUYEN.md` §10 thì bỏ qua vấn đề này.
- Mục 6, dòng “Bạch Ngọc/Băng Trùy của BNB chưa được xác minh”: **Băng Trùy đã xác minh ở ch.166** (bản dịch Việt), chỉ thuộc hồ sơ trận lần hai, không thuộc trận đầu. Lam Điểu Băng Quan có từ ch.136. Chi tiết ở §10 của kế hoạch cân bằng.
- Mục 5: số liệu là trước Thiên Bồng 3s. Số mới: Thường stand/spam/move = 10,7 / 1,7 / 83,3%; Khó 0 / 0 / 46,7%. Spam ở Thường đã từ 53,7% xuống 1,7%. Đây là mức phạt rất nặng. Nếu người chơi thật thấy bị phạt quá tay khi đánh gần, nới **Băng nhận 24 → 20** trước, đừng nới Thiên Bồng.


<a id="source-note_tich_hop_sandbox_e"></a>

## Nguồn: `NOTE_TICH_HOP_SANDBOX_E.md`

SHA-256 trước gộp: `038eaa733fa457fe53bca3434f94fe947e3a5d81e1eb304288f1f2aa0a19e404`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Ghi chú tích hợp: sandbox battle E vào game chính

Ngày 02/10/2026. Đi kèm [KE_HOACH_BATTLE_TEST_PN_BNB.md](../undone/KE_HOACH_BATTLE_TEST_PN_BNB.md).

Sandbox: `battle_sandbox.html`. Code đã viết sẵn để sau này copy sang game chính. Mỗi file JS có dòng `TÍCH HỢP:` ở đầu, ghi chỗ cần nối.

## Trạng thái

| Bước | Trạng thái |
|---|---|
| Điều khiển (bản 2, [KE_HOACH_CHINH_BATTLE_E_V2.md](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chinh_battle_e_v2)) | **Xong.** Bỏ dừng thời gian. Chuột phải đi; chuột vào địch để đuổi đánh; Q W E R D phóng theo con trỏ; Space lướt; 1 Sinh Mệnh Diệp; S dừng. Bộ đệm lệnh 0,25 giây. Tốc độ trận 0,75 / 0,85 / 1× |
| Chiêu Phương Nguyên | **Xong (logic):** Nguyệt Mang (đạn), Bạch Ngọc / Thiên Bồng (hộ thể thay thế nhau), Cự Xỉ Kim Ngô (cung + chảy máu), Cường Thủ (chộp kéo), Lướt, Sinh Mệnh Diệp (2 lá). Clip `sk_*` chưa có thì dùng clip dự phòng |
| Chiêu và AI Bạch Ngưng Băng | **Xong (logic):** băng nhận (làm chậm), Lốc băng nhận (vòng báo trước 1,15 giây, không bị ngắt), Thủy Tráo, Sương Yêu (thoát thân 1 lần, không gây sát thương hay đẩy lùi), né Nguyệt Mang. Bạch Ngọc / Băng Trùy tạm bỏ khỏi kit, chờ nguồn Q1 |
| Cân bằng | Đo bằng `node tools/sandbox_bench.cjs 300 <de\|thuong\|kho>`: script giả lập người chơi khá thắng khoảng 88 / 65 / 35%. Cần người thật chơi để chỉnh tiếp |
| Ảnh clip riêng | Chưa. Prompt ở [PROMPT_MUSE_ROSTER.md](../prompts/PROMPT_MUSE_ROSTER.md) và mục B3–B4 của kế hoạch bản 2 |

## Các file và vai trò

| File | Vai trò | Phụ thuộc |
|---|---|---|
| `js/kp_sprite.js` | Nạp sheet key-pose: `KPSprite.load(id)`, `frameAt`, `flash` | PIXI |
| `js/sandbox/kits.js` | Bộ chiêu (chỉ dữ liệu) | Không |
| `js/sandbox/sim.js` | Mô phỏng trận, bước cố định 1/60 giây | Không (chạy được trong node) |
| `js/sandbox/ai.js` | Máy điều khiển | `SBSim` |
| `js/sandbox/view.js` | Vẽ đấu trường, chọn frame theo state | PIXI, `KPSprite`, `SBSim` |
| `js/sandbox/input.js` | Điều khiển: chạy / bảng lệnh / chọn điểm, chuột | `SBSim`, `SBView` |
| `js/sandbox/hud.js` | Thanh máu, bảng lệnh HTML, dòng mô tả | `SBInput` |
| `tools/sandbox_sim.cjs` | Nạp sim cho node | Các file trên |
| `tools/sandbox_bench.cjs` | Đo tỷ lệ thắng theo mức khó | `sandbox_sim.cjs` |

Thứ tự nạp: PIXI → `kp_sprite` → `kits` → `sim` → `ai` → `view` → `input` → `hud` → vòng chính.

## Nguyên tắc giữ khi tích hợp

1. **`sim.js` là nguồn sự thật** cho máu, chân nguyên, hồi chiêu, trúng hay trượt. Hình ảnh không được trừ máu.
2. **Frame chọn theo thời gian trận** (`SBView.pick`), không dùng AnimatedSprite tự chạy. Trận luôn chạy khi chọn chiêu; idle dùng duration trong manifest, bóng lướt cũng mờ theo thời gian trận.
3. `B.events` được rút **một lần mỗi khung hình** ở vòng chính, rồi chuyển cho view và input. Không để hai nơi cùng `splice`.
4. Lệnh không hợp lệ (đang hồi, thiếu chân nguyên, ngoài tầm, đang ra chiêu) **không trừ gì** và trả về `reason` để hiện lên giao diện.

## Cách nối vào campaign (khi sandbox đạt)

1. **Thêm chế độ:** trong `js/ui.js`, hàm `fightModeButtons()`, thêm lựa chọn `e` ("Đấu trường"). Ghi vào `META.opt.fightMode='e'`.
2. **Khởi tạo trận:** trong `js/engine.js`, hàm `fight(k,o)`, sau khi dựng `S.combat`:

   ```js
   if(META.opt.fightMode==='e'){
     const kits={pn:kitFromPlayer(), bnb:kitFromFoe(k)};   // xem bước 3
     S.combat.e=SBSim.create(kits,{});
     S.combat.e.actors.pn.hp=S.hp;                          // máu hiện tại của người chơi
   }
   ```

3. **Kit từ dữ liệu game:**
   - `kitFromPlayer()`: sinh `skills` từ cổ người chơi đang có (`S.gu`), ánh xạ id cổ sang định nghĩa chiêu E, ví dụ `nguyetquang` / `nguyetmang` thành Nguyệt Mang, `bachngoc` thành Bạch Ngọc.
   - `kitFromFoe(k)`: dùng `EN[k].hp*DIFF.hp` cho máu và `EN[k].atk` cho sát thương, sprite lấy theo bảng ánh xạ khóa `EN` sang id `chibi_kp` (ví dụ `bai` thành `bach_ngung_bang_nam`, `heorung` thành `heo_rung`).
   - Cổ hoặc địch nào chưa có định nghĩa E thì trận đó dùng chế độ cũ.
4. **Hiển thị:** trong `js/battle.js`, `renderCombat()` và `Arena.mount()`, khi `S.combat.e` tồn tại:
   - Giữ nền và thời tiết của Arena.
   - Thay phần dựng `P` / `E` bằng `SBView.mount` (đổi `mount` để nhận container của Arena thay vì tự tạo `PIXI.Application`).
   - Thay `#skillbar` bằng `SBHud`.
5. **Vòng chính:** chuyển nguyên khối `frame()` trong `battle_sandbox.html` vào một hàm `eLoop()`. Gọi hàm này bằng `requestAnimationFrame` khi đang có trận E, dừng khi rời trận (`Scene.stop`).
6. **Kết trận:** khi `B.over`, đợi 1,2 giây để clip gục / thắng diễn xong, rồi:
   - Gán `S.hp = B.actors.pn.hp`; với địch đặt `S.combat.hp = 0` (thắng) hoặc giữ nguyên (thua).
   - Thắng thì gọi `win()`; thua thì gọi `die(S.combat.n)`. Cả hai hàm đều có trong `engine.js`.
   - Bỏ chạy: thêm lệnh "Bỏ chạy" vào kit, khi thành công gọi `fleeSuccess(S.combat)`.
7. **Lưu:** trận E không lưu giữa chừng. Tải lại trang giữa trận thì bắt đầu lại trận, giống chế độ realtime hiện tại.
8. **Cân bằng:** chạy `tools/sandbox_sim.cjs` kiểu máy đấu máy với kit thật, giữ mục tiêu bot thắng Q1 40–45% (`tools/sim.cjs` cần một nhánh cho fightMode `e`).

## Lưu ý kỹ thuật

- `~/package.json` khai báo `"type":"module"`, nên Node coi file `.js` là ES module. Các script node phải là `.cjs` và nạp file sandbox như `tools/sandbox_sim.cjs` đang làm.
- `KPSprite` và `loadKP` trong `battle.js` đang trùng chức năng. Khi tích hợp, xóa bản trong `battle.js` và nạp `js/kp_sprite.js` trước nó.
- Sprite thiếu clip thì `pick()` tự lấy idle, không lỗi.

## Review và sửa lỗi của Blue-chan — 02/10/2026

**Phạm vi:** chạy sandbox E trong Chrome headless với PIXI thật ở desktop 1280×900 và mobile 390×844; kiểm tra thêm battle chiến thuật đang dùng trong campaign. E vẫn là sandbox, chưa phải chế độ campaign.

### Lỗi đã tái hiện và sửa

| Lỗi | Trước | Sau |
|---|---|---|
| Kết quả trận bị đổi sau đòn kết liễu | Hai bên cùng chảy máu có thể khiến cả hai còn 0 HP, người đã gục lại được ghi là thắng; đạn còn bay cũng có thể đánh tiếp | Chốt kết quả đầu tiên theo thứ tự xử lý simulation; xóa đạn/vùng chờ, ngừng sát thương và AI. Chỉ tiếp tục thời gian clip gục / kết thúc chiêu / thắng |
| Tham số URL không hợp lệ | `?lvl=invalid&spd=0` gây lỗi đọc `dmgK`; tốc độ 0 có thể làm trận đứng | Level sai dùng Thường; tốc độ chỉ nhận 0,75 / 0,85 / 1, còn lại dùng 0,85 |
| Idle bỏ qua metadata | Đổi frame cứng mỗi 0,75 giây | Dùng `KPSprite.frameAt` và duration của clip |
| Bóng lướt phụ thuộc FPS | Mỗi lần render trừ alpha 0,03: màn hình nhanh làm bóng biến mất nhanh hơn | Alpha tính từ tuổi bóng trong simulation, hết sau 0,3 giây trận |

Thêm `tools/sandbox_regression.cjs`: kiểm tra hai DOT cùng tới hạn, đạn còn bay khi kết liễu, người thắng diễn hết chiêu, lệnh sai không mất tài nguyên và hồi máu bị ngắt vẫn mất lá. Chạy bằng `node tools/sandbox_regression.cjs`.

### Kết quả kiểm thử

- Sandbox nạp được hai actor, tám ô kỹ năng; chuột phải nhận điểm đến, S dừng, Q trừ đúng chi phí và bắt đầu hồi chiêu. URL không hợp lệ không còn gây lỗi JavaScript.
- Hộ thể Bạch Ngọc kích hoạt; Sinh Mệnh Diệp hồi từ 100 lên 150 HP và giảm từ hai còn một lá. Kết trận hiện “Thắng”, PN chuyển `win`, BNB chuyển `ko`, không có lỗi JavaScript trong lượt kiểm thử.
- Mobile 390 px không tràn ngang. Đây là kiểm tra bố cục; điều khiển đi/nhắm vẫn dựa vào chuột và bàn phím, chưa có bộ điều khiển cảm ứng hoàn chỉnh.
- Campaign chiến thuật qua kiểm tra lệnh sai không mất lượt, Thủ thế, chi phí cổ, hồi chân nguyên một lần mỗi vòng, hấp thu thạch, cửa sổ sơ hở và tải lại save giữa lúc resolving. Kiểm tra này tắt PIXI để tập trung vào HUD và resolver; phần PIXI thật được thử riêng ở sandbox.
- Kiểm tra dữ liệu, hồi quy engine và story đều đạt. Benchmark 300 trận mức Thường sau sửa: bot PN thắng 73,7%, thời gian trung bình 20,4 giây. Đây là một lượt đo ngẫu nhiên, không phải tỷ lệ thắng của người thật hay mục tiêu cân bằng đã chốt.

### Review hình ảnh và việc còn lại

1. **Đủ dùng để thử cơ chế:** nhân vật rõ, thanh kỹ năng có phím và chi phí, vòng báo trước giúp nhận diện chiêu lớn. Key-pose vẫn là chuyển pose rời; chưa giải quyết yêu cầu chạy liên tục bằng frame trung gian.
2. **Nền:** review ban đầu ghi nền núi tuyết thiếu mặt sàn; đã thay bằng nền rừng trúc người dùng cung cấp trong lượt sau. Xem bàn giao nền mẫu bên dưới và `KE_HOACH_MAP_BATTLE_PIXEL.md`; còn duyệt các biên/KO/thú lớn trước khi chốt toàn bộ.
3. **Thiếu clip riêng:** nhiều chiêu dùng `guard` / `heavy` / `cast` dự phòng, vì vậy chiêu khác nhau vẫn có thể dùng cùng dáng. Chỉ gen các clip đặc trưng đã đối chiếu kit; không nhân rộng dáng chưởng chung.
4. **Mobile:** đã thêm chạm đất để đi / chạm địch để đánh (xem bàn giao dưới). Canvas vẫn thu nhỏ cả nhân vật và vùng né; chưa có thao tác nhắm chiêu tự do hoặc nút dừng riêng cho cảm ứng.
5. **Cân bằng cần người chơi thật:** giữ nguyên thông số trong lượt sửa này. Đo lại nhiều seed và chơi thử trước khi chốt độ khó; sandbox chưa nối tài nguyên, phần thưởng và vòng đời save campaign.

## Bàn giao Orange-kun: sửa battle và bổ sung cảm ứng

Blue-chan đã sửa trực tiếp các file dưới đây, chưa commit/push. Các thay đổi áp dụng cho **sandbox E**, không tự nối E vào campaign và không đổi bộ chiêu / thông số cân bằng.

**Bổ sung preview VFX/audio:** theo yêu cầu dùng ngay kế hoạch hiệu ứng, Blue-chan đã thay mẫu Đánh tay / Nguyệt Mang / Băng nhận trong `view.js`, bổ sung damage source/contact trong `sim.js`, thêm `js/sandbox/audio.js` và điều khiển âm trong trang sandbox. Chi tiết phạm vi và test ở [kế hoạch VFX, mục “Mẫu đang chạy để duyệt”](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_vfx_am_thanh_battle_e). Các chiêu còn lại giữ hiệu ứng cũ và âm fallback; đây chưa phải bộ VFX/audio cuối cùng.

**Bổ sung nền rừng trúc:** sandbox đã dùng ảnh người dùng gửi (2048×1152), tải metadata ở `assets/battle_maps/q1_bamboo_clearing/map.json`, cover/crop giữa vào 960×430, không phủ tối mạnh. Input nay nhận đi chỉ trong đủ bốn biên sàn, bỏ mép đệm 30 px cũ. Xem [bàn giao nền mẫu cho Orange-kun](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_map_battle_pixel) để review crop, fallback và phạm vi còn mở. Campaign vẫn chưa đổi nền.

| File | Thay đổi cần giữ khi tích hợp |
|---|---|
| `js/sandbox/sim.js` | Chốt kết quả đầu tiên, ngừng sát thương/AI sau kết trận, xóa đạn và vùng chờ; tiếp tục thời gian để clip kết thúc. Chi tiết lỗi và test ở phần review phía trên |
| `js/sandbox/view.js` | Idle dùng timing manifest; alpha bóng lướt tính theo thời gian simulation thay vì số lần render |
| `battle_sandbox.html` | Kiểm tra level/speed từ URL; bổ sung hướng dẫn chạm; `touch-action:none` chỉ trên canvas |
| `js/sandbox/input.js` | Dùng Pointer Events thay bộ Mouse Events của canvas để nhận cả chuột và cảm ứng, tránh một tap phát hai lệnh |
| `tools/sandbox_regression.cjs` | Hồi quy logic kết trận và chi phí chiêu; chạy bằng Node, không cần trình duyệt |

### Hành vi cảm ứng

1. **Chạm mặt đất:** phát lệnh `move` tới tọa độ được `SBView.toWorld()` quy đổi từ canvas. Simulation vẫn clamp điểm tới biên sân và dùng bộ đệm 0,25 giây nếu đang ra chiêu. Chạm điểm mới sẽ đổi đích đến khi có thể nhận lệnh.
2. **Chạm Bạch Ngưng Băng:** kiểm tra vùng nhân vật trước vùng đất, phát `atk`; ngoài tầm thì đuổi tới rồi đánh. Không phát thêm `move` từ cùng lần chạm.
3. **Chạm vùng trời ngoài vùng điều khiển:** không di chuyển. Vùng nhận đất dùng quy tắc có sẵn của `toWorld` (bao gồm mép đệm 30 px phía trên vạch đất).
4. **Chạm ô kỹ năng:** giữ cách dùng nút hiện tại, nhắm theo vị trí địch. Nút Lướt vì vậy cũng hướng về địch; chưa có cơ chế chạm để chọn hướng lướt hoặc điểm ngắm riêng.
5. Nhận lệnh ngay ở `pointerdown`, không yêu cầu giữ/kéo. Chỉ nhận pointer chính; ngón phụ không ra lệnh. Bút cảm ứng dùng cùng cách chạm.
6. `touch-action:none` trên canvas ngăn thao tác chạm bị biến thành cuộn/zoom trang trong sân. Khu vực bên ngoài canvas vẫn cuộn bình thường. Sau kết trận không nhận lệnh mới.

### Ảnh hưởng tới máy tính

- Chuột trái vào đất vẫn không di chuyển; chuột phải vào đất vẫn đi.
- Chuột trái/phải vào địch vẫn đuổi đánh. Phím Q/W/E/R/D, Space, 1 và S giữ nguyên.
- Rê chuột vẫn cập nhật điểm nhắm; bấm nút kỹ năng vẫn nhắm địch.
- Không gắn đồng thời `mousedown` và `pointerdown` cho cùng hành động, nên không bị lệnh chuột tổng hợp từ cảm ứng chạy lặp.
- Đây là hỗ trợ theo loại pointer, không dựa vào độ rộng màn hình: máy tính có màn hình cảm ứng nhận cả hai kiểu thao tác.

### Checklist cho Orange-kun

- Kiểm thử bổ sung đã qua: Chrome giả lập cảm ứng 390×844 nhận chạm đất/địch/nút chiêu, bỏ qua chạm trời; mỗi tap chỉ phát một lệnh. Phiên desktop 1280×900 kiểm tra chuột trái đất không đi, chuột phải đất đi, chuột trái địch đánh, phím Q dùng chiêu. Hồi quy simulation và `git diff --check` đều đạt.
- Đọc phần “Review và sửa lỗi của Blue-chan” cùng bảng thay đổi trên trước khi merge/tích hợp; không dùng lại bản simulation xử lý sát thương sau `B.over`.
- Khi nối vào Arena chính, mang theo `touch-action:none` cho canvas và bộ Pointer Events. E chưa được nối vào `index.html`; không coi cảm ứng sandbox là đã hỗ trợ mọi chế độ battle.
- Kiểm tra thực tế trên Safari iPhone / Chrome Android. Blue-chan kiểm tra bằng Chrome headless giả lập cảm ứng; chưa kiểm tra thiết bị thật.
- Muốn mobile đầy đủ hơn, làm tiếp nút Dừng và chọn điểm/hướng dùng chiêu; tách thao tác đó khỏi chạm đi để tránh vô tình di chuyển khi nhắm.

## Bàn giao Orange-kun — Blue-chan tiếp tục cân bằng di chuyển (02/10/2026)

Đã sửa trực tiếp sandbox E theo yêu cầu người dùng, chưa commit/push. Bản trước dùng làm đối chứng là `cf2c8c5`. Phần này cập nhật kết quả cân bằng; các tỷ lệ đo ngẫu nhiên ở phần trước không còn đại diện cho bộ thông số hiện tại.

### Vấn đề xác nhận được

- Simulation chỉ có **một chiêu đang chạy và một lệnh chờ cuối** mỗi actor. Bấm Q/W/E/R cùng lúc không phát bốn chiêu; lệnh hợp lệ khi bận thay nhau trong bộ đệm 0,25 giây. Vấn đề thật là áp sát và ra đòn liên tục quá hiệu quả.
- Benchmark dở dang cho bot `move` quyết định mỗi 0,12 giây, còn `spam` mỗi 0,45–0,65 giây; dùng ngẫu nhiên không seed. Không thể kết luận lợi ích di chuyển từ hai con số này.
- Bot né có thể tự hủy lướt vừa bắt đầu, hoặc quay lại ra đòn trước khi đi hết đoạn né. Đòn Băng Nhận 0,45 giây cũng quá khó bước tránh sau khi bot đã nhận diện cảnh báo, nhất là đang bị làm chậm.
- Bảo vệ khỏi khựng quá ngắn tạo lợi thế lớn cho chuỗi đấm nhanh. Đánh trúng liên tiếp dễ ngắt chiêu trả đòn, khiến né ít có giá trị hơn tiếp tục đấm.

### Thông số đã đổi

| Cơ chế | Trước | Hiện tại | Mục đích |
|---|---|---|---|
| PN đánh tay: thu chiêu | 0,32s | 0,46s | Giảm hiệu quả đứng sát đánh liên tục; vẫn giữ lấy đà 0,28s và sát thương 13 |
| BNB Băng Nhận: lấy đà | 0,45s | 0,65s | Có thời gian đọc ô đỏ và bước ngang khỏi tầm |
| BNB Băng Nhận: sát thương | 17 | 24 | Đòn chậm, rõ cảnh báo phải có giá nếu cố ăn đòn |
| BNB Lốc Băng Nhận: sát thương | 48 | 96 | Không bỏ qua vòng đỏ chỉ để tiếp tục combo; giữ báo trước 1,15s, vùng khóa tại vị trí ban đầu, bán kính/cooldown/chi phí cũ |
| Vững thế sau khựng, cả hai actor | 0,6s | 1,2s | Có cơ hội trả đòn sau khi hết khựng 0,32s; vẫn nhận đủ sát thương, không phải bất tử |

Lốc 96 tương đương khoảng 44% HP tối đa của PN trước hộ thể. Đây là thay đổi lớn nhất cần chơi thử: Bạch Ngọc còn 48 sát thương, Thiên Bồng khoảng 34 ở mức Thường. Chưa thêm phạt đứng yên, chưa cho né bất tử; bước ra ngoài tầm/vùng mới tránh được sát thương.

Sửa thêm `cancelAct`: chỉ xóa zone khi thực sự tìm thấy trong danh sách. Trước đây hủy recovery của Lốc đã nổ có thể gọi `splice(-1,1)` và xóa nhầm zone khác.

### Benchmark mới và kết quả

`tools/sandbox_bench.cjs` dùng seed, cùng nhịp kiểm tra khoảng 0,1s cho tất cả bot, nhận diện cảnh báo sau ít nhất 0,15s. Có ba chính sách rõ ràng:

- `stand`: dùng chiêu/hộ thể/lá và đánh trong tầm; không đi, không lướt, không tự đuổi.
- `spam`: chọn chiêu phù hợp tầm, tự đuổi đánh; không chủ động né. Đây là bot biết ưu tiên chiêu, **không phải** mô phỏng bấm bừa bốn nút.
- `move`: né ô đỏ/vòng Lốc, giữ khoảng cách, phóng Nguyệt và phản công lúc địch thu chiêu. Không tự hủy dash/escape, giữ thời gian đi né và không đè đòn đánh vào bộ đệm khi đang bận. Chính sách tấn công khác `spam`, vì vậy đây là so sánh hai cách chơi, không phải thí nghiệm chỉ thay một biến di chuyển.

Đối chứng bằng cùng benchmark mới, 300 trận mỗi cách chơi, mức Thường, seed `20261002`:

| Cách chơi | Trước sửa runtime | Sau sửa runtime | Thời gian sau sửa | HP PN trung bình khi thắng |
|---|---:|---:|---:|---:|
| Đứng yên | 71,7% | 12,7% | 21,2s | 18,4 |
| Áp sát spam | 100% | 67,7% | 20,6s | 49,5 |
| Né + giữ khoảng cách + phản công | 55,3% | 94,3% | 39,7s | 84,4 |

Đo lại seed 42 và 9001, mỗi seed 300 trận/cách chơi ở mức Thường: đứng yên 13,3% / 15,7%; spam 69,3% / 70,0%; di chuyển 96,7% / 96,3%. Không có trận hết thời gian 120s trong các lượt đo cuối.

Seed `20261002`, 300 trận/cách chơi ở các mức khác:

| Mức | Đứng yên | Áp sát spam | Né + phản công |
|---|---:|---:|---:|
| Dễ | 80,0% | 99,3% | 100% |
| Khó | 1,3% | 19,3% | 90,3% |

Bot di chuyển mức Thường có khoảng 7,7 lần hủy startup và 8,2 lần hủy recovery mỗi trận; báo cáo tách hai loại để không nhầm hủy nửa cuối thu chiêu với chiêu chưa phát. Không còn chuyện tự hủy hàng nghìn lần trong một trận. Bot vẫn hủy một số Cự Xỉ/hộ thể để né nguy hiểm, đây chưa phải chính sách bot tối ưu.

Số liệu gốc: [`tools/reports/sandbox_balance_2026_10_02.json`](../../tools/reports/sandbox_balance_2026_10_02.json). Lệnh đo lại:

```bash
node tools/sandbox_bench.cjs 300 thuong compare 20261002
node tools/sandbox_bench.cjs 300 thuong compare 42
node tools/sandbox_bench.cjs 300 thuong compare 9001
node tools/sandbox_bench.cjs 300 de compare 20261002
node tools/sandbox_bench.cjs 300 kho compare 20261002
node tools/sandbox_regression.cjs
```

### Đã kiểm tra và phần Orange cần review

- Hồi quy đạt: chốt kết trận, chi phí/lá khi bị ngắt, hủy startup; bổ sung bấm dồn bốn chiêu chỉ phát một, đứng yên ăn Băng Nhận nhưng bước ngang sau 0,2s né được, ra khỏi vòng Lốc không mất máu, hủy Lốc đã nổ không xóa zone khác.
- Kiểm tra dữ liệu và hồi quy engine đạt. Chrome giả lập mobile/desktop vẫn nhận tap đi/đánh, chuột trái/phải và Q đúng, mỗi tap chỉ ra một lệnh. Chưa thử điện thoại thật.
- Runtime đổi ở `js/sandbox/kits.js` và `sim.js`; không đổi AI BNB, map, input hay thông số campaign.
- **Cần chơi thử trước khi chốt:** di chuyển hiện an toàn hơn nhưng trận kéo dài gần gấp đôi kiểu áp sát. Mức Khó vẫn bị bot biết hình học né thắng khoảng 90%; đó là giới hạn của AI hiện tại, không phải tỷ lệ thắng người thật. Đừng cân bằng tiếp chỉ bằng cách ép tỷ lệ bot về 50%.
- Ưu tiên review cảm giác ô cảnh báo Băng Nhận 0,65s, mức phạt Lốc 96, và liệu nút/cách nhắm lướt trên điện thoại đã đủ dễ dùng. Kế hoạch KO ở biên và nhắm chiêu/nút Dừng vẫn nằm riêng trong `KE_HOACH_CHOT_SANDBOX_PN_BNB.md`, chưa triển khai trong lượt cân bằng này.

**Cập nhật sau lượt cân bằng trên:** đã thêm khóa chung 2s và AI BNB mức Khó; danh sách action PN/BNB, nguồn đối chiếu thời kỳ và kết quả benchmark mới ở [NOTE_COOLDOWN_CHUNG_VA_BOSS_BNB.md](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_cooldown_chung_va_boss_bnb). Tỷ lệ thắng trước khóa 2s không còn đại diện cho runtime hiện tại.

### Orange-kun review phần “Blue-chan tiếp tục cân bằng di chuyển” (02/10/2026)

- Đồng ý: bench có seed và cùng nhịp quyết định, tách hủy startup/recovery, sửa `cancelAct` chỉ xóa zone khi tìm thấy (lỗi `splice(-1,1)` là thật, cảm ơn blue-chan), vững thế 1,2s, Băng nhận 0,65s.
- Lốc 96: chấp nhận vì có vòng báo 1,15s và bán kính rõ. Nhưng nó gần nửa máu PN; trên điện thoại cần thử xem vòng đỏ ở hàng sau (z nhỏ) có đủ dễ đọc.
- Số liệu trong phần này đã cũ (trước khóa 2s và Thiên Bồng 3s). Số hiện tại xem review trong `NOTE_APPLY_THIEN_BONG_3S.md`.


<a id="source-ban_giao_cho_orange_review_2026_10_02"></a>

## Nguồn: `BAN_GIAO_CHO_ORANGE_REVIEW_2026_10_02.md`

SHA-256 trước gộp: `b76e1cf2a2c35cf6b5b4bc1a13202e05df7ae9e02e10d2569135d38da3a64e49`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Blue-chan — các phần chờ Orange-kun review

**Cập nhật:** người dùng đã báo Orange-kun review xong các bản bên dưới và ghi phản hồi cuối từng file. Danh sách này giữ làm lịch sử bàn giao, không còn là danh sách toàn bộ chưa review. Lượt sửa tiếp theo xem [Tiếp nhận review Orange — canon, release và mobile](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_tiep_nhan_review_orange_canon_mobile).

02/10/2026. Danh sách dựa trên phản hồi trong cuộc trò chuyện và ghi chú trong repo. **Chưa thấy xác nhận review** không có nghĩa Orange-kun chưa mở hoặc đọc file. Không thay code battle trong lượt gom tài liệu này.

## 1. Ba bản mới cần đọc trước

**Bổ sung sau danh sách ban đầu:** [Mở rộng sân, AI theo nhân vật và VFX](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_mo_rong_san_ai_roster_vfx) — người dùng đã thử PN–BNB tạm ổn, yêu cầu plan sân lớn/AI riêng/FX và chuẩn bị review 39 asset. Chỉ lập kế hoạch, chưa áp code. Review sau hoặc phối hợp với các bản tài nguyên/thời kỳ bên dưới.

| Thứ tự | Tài liệu | Phần cần review | Trạng thái |
|---|---|---|---|
| 1 | [Chân nguyên và nhịp dùng cổ](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chan_nguyen_va_nhip_dung_co) | Dung lượng biển, phẩm chất chân nguyên, hồi tự nhiên theo thời gian, nguyên thạch, phí duy trì, kiểm tra đủ phí khi release; chỉ thử giảm khóa chung sau khi ngân sách ổn | Kế hoạch, chưa áp cơ chế tài nguyên tổng thể |
| 2 | [Cân bằng cổ trùng và BNB theo mốc truyện](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_can_bang_co_trung_va_bnb_theo_moc_truyen) | Các lần gặp BNB và trận ch.166, cổ theo thời kỳ, mất tay/mất cổ theo nhánh; bộ cổ cố định chỉ cho boss, PN dùng inventory thật | Kế hoạch; riêng Thiên Bồng đã áp theo dòng 3 |
| 3 | [Thiên Bồng 3s — bàn giao](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_apply_thien_bong_3s) | Vận đứng yên 0,9s; phí bật 18, duy trì 5/s trong tối đa 3s, ngừng regen khi giáp bật, cạn chân nguyên tắt sớm | Đã áp sandbox E; hồi quy logic đạt, chưa đo lại cân bằng/chơi thử điện thoại |

Code cần đọc cùng bản Thiên Bồng: [kits.js](../../js/sandbox/kits.js), [sim.js](../../js/sandbox/sim.js), [hud.js](../../js/sandbox/hud.js), [sandbox_regression.cjs](../../tools/sandbox_regression.cjs).

## 2. Các bản/phần bổ sung trước đó chưa thấy xác nhận

| Tài liệu | Phạm vi còn chờ | Trạng thái |
|---|---|---|
| [Khóa chung và boss BNB](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_cooldown_chung_va_boss_bnb) | Khóa 2s cho các cổ khác đang sẵn sàng, không kéo dài CD đang chạy; AI mức Khó và benchmark | Đã áp sandbox; các nhận định thời kỳ phải đối chiếu lại bản cân bằng mới ở mục 1 |
| [Ghi chú tích hợp sandbox E](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-note_tich_hop_sandbox_e) | **Chỉ phần “Bàn giao Orange-kun — Blue-chan tiếp tục cân bằng di chuyển” và cập nhật cuối**: đòn đánh, Lốc, vững thế, sửa hủy zone, benchmark có seed | Đã áp; số liệu trước khóa 2s không đại diện runtime mới |
| [Chốt sandbox PN–BNB](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_chot_sandbox_pn_bnb) | KO ở mép sân, đo mọi pose, ứng viên biên mới, nhắm chiêu cảm ứng và nút Dừng | Kế hoạch, chưa triển khai các hạng mục này |
| [Map battle pixel](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_map_battle_pixel) | **Mục 11 của Blue-chan**: KO hàng trước còn tràn khung, kiểm cấu hình ground_screen_y, đo trước khi đổi biên | Review bổ sung/đề xuất; bản map nền trước đó Orange đã review |
| [VFX và âm thanh](LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_vfx_am_thanh_battle_e) | **Mục 12 của Blue-chan**: sửa độ cao đạn theo độ sâu, vòng đời event, loader âm, âm lượng khi nhiều cue cùng phát | Sửa độ cao đạn đã áp; bộ file âm/asset FX và các đề xuất còn lại chưa hoàn tất |

Báo cáo đo cũ để đối chiếu: [cân bằng di chuyển](../../tools/reports/sandbox_balance_2026_10_02.json), [khóa chung và AI](../../tools/reports/sandbox_gu_lock_2026_10_02.json). Không dùng chúng để kết luận thông số Thiên Bồng mới đã cân bằng.

## 3. Các điểm đã được người dùng chốt

- PN lấy cổ từ save/inventory thực tế theo diễn biến và nhánh lựa chọn. Không cấp bộ cổ theo màn, không whitelist để tước cổ người chơi đã sở hữu.
- Boss mới có bộ cổ theo thời kỳ; cần tính trạng thái mất tay/mất cổ và nhánh cứu Thanh Thư.
- Có hồi chân nguyên tự nhiên; nguyên thạch là cách bổ sung, không phải nguồn hồi duy nhất. Bản chân nguyên mới thay các giả định hồi nhanh hoặc chỉ hồi bằng nguyên thạch trước đó. Phải thống nhất đơn vị và hệ số thời gian battle trước khi chuyển số liệu truyện sang code.
- Băng Trùy có căn cứ ở giai đoạn ch.166; không dùng nhận định cũ “không có ở Q1” để loại khỏi mọi lần gặp. Đồng thời không cấp cổ giai đoạn đó vào màn Thanh Thư sớm hơn.
- Khóa chung vẫn 2s ở runtime. Giảm 2s → 1s → 0s chỉ là thử nghiệm đề xuất sau khi chi phí/hồi phục được xử lý.
- Thiên Bồng 3s là thay đổi đã được yêu cầu áp. Phí hủy 25%, nguyên thạch trong battle, upkeep các cổ khác và adapter inventory vẫn là kế hoạch.

## 4. Phần đã có phản hồi, không gửi lại như chưa review

- Review key-pose trong [Hướng dẫn gen hàng loạt](../prompts/HUONG_DAN_GEN_HANG_LOAT_KEYPOSE.md), mục 10–11: Orange đã phản hồi ở mục 12.
- [Prompt Muse roster](../prompts/PROMPT_MUSE_ROSTER.md): mục 6 đã ghi sửa theo review Blue-chan; vẫn còn xác minh từng nhân vật, nhưng không gọi toàn bộ bản này là chưa được phản hồi.
- Các sửa kết trận, Pointer Events, URL, idle timing và bóng lướt ban đầu: Orange đã báo kiểm lại và đồng ý giữ. Phần mới cần review của ghi chú sandbox được tách ở mục 2.
- Map và VFX nền: Orange đã review/cập nhật ở mục 10 và 11 tương ứng. Chỉ gửi thêm phản hồi Blue-chan sau đó.

## 5. Đoạn gửi Orange-kun

> Orange-kun đọc giúp danh sách bàn giao này. Ưu tiên bản chân nguyên → bản BNB theo mốc truyện → ghi chú Thiên Bồng đã áp. Sau đó kiểm các phần bổ sung ở mục 2. Hai kế hoạch mới chưa được triển khai toàn bộ; Thiên Bồng đã đổi sandbox và có hồi quy, nhưng chưa đo lại cân bằng. PN phải dùng inventory thật; chỉ boss có bộ cổ theo thời kỳ. Nhờ ghi phản hồi vào từng file, phân biệt lỗi cần sửa, đề xuất đồng ý và phần cần người dùng quyết định.


<a id="source-ke_hoach_chinh_battle_e_v2"></a>

## Nguồn: `KE_HOACH_CHINH_BATTLE_E_V2.md`

SHA-256 trước gộp: `5edab2ac9ddb5ad3e1107c2f22c9cc4d9ad3da4539b2047507b37d1bafcfd94c`. Link trong bản đọc đã chuyển theo vị trí lưu mới; file ZIP giữ nguyên byte nguồn.

# Kế hoạch chỉnh battle E, bản 2: bỏ tạm dừng, chiêu và animation riêng từng nhân vật

Ngày 02/10/2026. Thay phần điều khiển trong [KE_HOACH_BATTLE_TEST_PN_BNB.md](../undone/KE_HOACH_BATTLE_TEST_PN_BNB.md) và phần gói động tác trong [HUONG_DAN_GEN_HANG_LOAT_KEYPOSE.md](../prompts/HUONG_DAN_GEN_HANG_LOAT_KEYPOSE.md).

Yêu cầu của người dùng:

1. **Hủy cơ chế dừng thời gian khi chọn lệnh.** Bỏ luôn bảng chọn bằng WASD rồi Z xác nhận. Điều khiển bằng chuột hoặc bấm phím trực tiếp.
2. **Đánh thường, chiêu cổ trùng và tư thế thắng phải riêng cho từng nhân vật, theo nguyên tác.** Hồi máu, né, thủ, gục được phép dùng chung kiểu động tác. Nếu không, 38 nhân vật sẽ giống nhau, chỉ khác ngoại hình.

---

## Phần A. Điều khiển mới: trận luôn chạy

### A1. Bảng phím

| Thao tác | Kết quả |
|---|---|
| **Chuột phải vào mặt đất** | Đi tới điểm đó (giữ như hiện tại) |
| **Chuột phải hoặc chuột trái vào địch** | Đuổi tới tầm rồi đánh thường. Click lại thì đổi lệnh |
| **Q W E R** (thêm D F nếu nhiều cổ) | Dùng cổ trùng theo ô. **Phóng ngay về phía con trỏ chuột**, không có bước ngắm hay xác nhận. Cổ tự thân (hộ thể) kích hoạt ngay |
| **Space** | Lướt về phía con trỏ |
| **1 2** | Vật phẩm: Sinh Mệnh Diệp, linh dược |
| **S** | Dừng đi / dừng đuổi |
| **Click nút trên thanh kỹ năng** | Như bấm phím tương ứng, nhắm về phía địch |
| **Esc** | Menu dừng game thông thường (không phải dừng để chọn chiêu) |

Đổi phím để bước sau. Phím gắn với **ô**, không gắn với tên cổ, nên đổi bộ cổ không cần sửa code.

### A2. Thay thế cho việc dừng thời gian

Phản hồi trước đây là "realtime quá nhanh, khó làm quen". Thay vì dừng thời gian, bản này dùng các cách sau:

- **Tốc độ trận** chọn được 0,75× / 1×, mặc định 0,85×. Áp vào đồng hồ trận nên mọi thứ chậm đều nhau.
- **Bộ đệm lệnh 0,25 giây:** bấm chiêu khi đang thu chiêu thì chiêu được xếp hàng, ra ngay khi rảnh tay. Bấm sớm không bị nuốt phím.
- **Báo trước rõ ràng:**
  - Chiêu lớn của địch có vòng đỏ trên đất và thời gian lấy đà dài.
  - Biểu tượng ý đồ trên đầu địch.
  - Thanh lấy đà nhỏ dưới chân địch.
- Ô kỹ năng có quạt hồi chiêu, số giây và nhãn phím. Ô thiếu chân nguyên hiện màu khác kèm nhãn.

### A3. Thay đổi code

| File | Thay đổi |
|---|---|
| `js/sandbox/input.js` | Viết lại. Bỏ các trạng thái `menu` / `target`, Z / X, tự mở bảng. Thêm phím Q W E R / Space / 1 2 / S, click địch, chuột phải vào địch. Lưu vị trí con trỏ trên đất để nhắm |
| `js/sandbox/sim.js` | Thêm lệnh `chase` (đi tới khi vào tầm thì đánh thường), `aim` (hướng hoặc điểm cho đạn và vùng), bộ đệm lệnh 0,25 giây, tham số `timeScale` |
| `js/sandbox/hud.js` | Bỏ lưới 2×6 kiểu menu. Thay bằng thanh kỹ năng một hàng có nhãn phím, quạt hồi chiêu, ô vật phẩm |
| `battle_sandbox.html` | Bỏ ô "tự mở bảng"; thêm chọn tốc độ trận; vòng chính luôn bước simulation |
| `js/sandbox/view.js` | Bỏ con trỏ chọn điểm; thêm vòng tầm chiêu khi rê chuột lên ô kỹ năng, thanh lấy đà của địch |

Phần đã làm ở S1–S2 được giữ: tính toán trận, va chạm thân, khựng và vững thế, chọn frame theo thời gian trận, kết trận.

---

## Phần B. Animation: phần chung và phần riêng

### B1. Phân loại

| Loại | Clip | Cách làm |
|---|---|---|
| **Chung** (cùng mô tả động tác, mỗi nhân vật vẫn gen ảnh của mình) | `idle`, `move`, `hit`, `guard`, `heal`, `dodge`, `ko` | Dùng chung một câu mô tả động tác cho mọi người. Thú có bộ câu chung riêng. Chỉ chỉnh khi cơ thể khác hẳn (bay, sáu chân) |
| **Riêng** (đặc trưng nhân vật) | `atk` (đánh thường), `sk_<id>` (mỗi chiêu hoặc cổ có cách ra chiêu riêng), `win` | Viết riêng cho từng nhân vật theo nguyên tác: cách đánh, cổ đang có ở mốc truyện, tính cách |

Quy tắc gộp clip chiêu:

- Nhiều cổ có **cùng cách thực hiện** thì dùng chung một clip, chỉ khác hiệu ứng do code vẽ. Ví dụ Nguyệt Quang, Nguyệt Mang, Huyết Nguyệt đều là hất cổ tay phóng nguyệt nhận nên chung `sk_nguyet`.
- Cách thực hiện khác thì tách clip.
- Cổ là sinh vật được điều khiển (Cự Xỉ Kim Ngô là con rết vàng) thì sinh vật đó là **asset riêng**. Clip nhân vật chỉ là tư thế ra lệnh.

### B2. Định dạng đặc tả cho mỗi nhân vật

Mỗi nhân vật có một bảng như dưới. Từ bảng này sinh ra prompt và `clips.json` (số pose kỳ vọng, frame phát đòn, điểm phát).

| Clip | Dùng cho chiêu / cổ | Căn cứ | Cách thực hiện (thành dòng Poses) | Số pose | Mốc | Điểm phát | Hiệu ứng code vẽ |
|---|---|---|---|---|---|---|---|

- **Mốc:** `release` (đạn rời tay), `contact` (chạm cận chiến), `activate` (bật buff hoặc hộ thể).
- **Điểm phát:** `hand_r`, `hand_l`, `mouth`, `ground`, `body`.

### B3. Phương Nguyên, mốc Q1 Nhị chuyển → Tam chuyển (ch 100–188)

Căn cứ: [CHI_TIET_NGUYEN_TAC_Q1.md](CHI_TIET_NGUYEN_TAC_Q1.md).

| Clip | Chiêu / cổ | Căn cứ | Cách thực hiện | Pose | Mốc | Ảnh hiện có |
|---|---|---|---|---|---|---|
| `atk` | Đánh tay bằng sức "2 trư chi lực" (Bạch Thỉ + Hắc Thỉ) | ch 100, 131 | Gọn, lạnh, không thừa động tác: hạ thấp người → đấm thẳng nặng → thu về thủ thế | 3 | contact | `attack` hiện tại là chưởng: dùng tạm, nên gen lại thành đấm |
| `sk_nguyet` | Nguyệt Quang, Nguyệt Mang, Huyết Nguyệt | ch 12, 101, 131, 136 | Hất cổ tay phóng nguyệt nhận, bắn liên tục từ xa | 3 | release, `hand_r` | **`cast` hiện tại dùng được** |
| `sk_bachngoc` | Bạch Ngọc (hộ thể ngọc) | ch 100, 116, 124 | Đứng vững, không né, da hóa ngọc trắng; dáng tự tin chịu đòn | 2 | activate, `body` | Chưa có, `guard` dùng tạm |
| `sk_cuongthu` | Cường Thủ (bàn tay sắt chộp, rút cổ) | ch 138, 143, 165, 186 | Vươn tay chộp → nắm chặt → giật mạnh về | 3 | contact, `hand_r` | Chưa có, `heavy` dùng tạm |
| `sk_cuxi` | Cự Xỉ Kim Ngô (rết vàng răng cưa) | ch 186–188 | Chỉ tay ra lệnh, con rết lao ra cắn xé. **Con rết là asset riêng** | 2 | release, `hand_r` | Chưa có, kèm asset rết |
| `sk_thienbong` | Thiên Bồng (giáp ánh sáng) | ch 155, 186 | Một tay giơ cao, màn ánh sáng phủ xuống | 2 | activate, `body` | Chưa có |
| `win` | — | Tính cách | Tay chắp sau lưng, mắt lạnh nhìn xuống, không cười | 1 | — | **`win` hiện tại khớp** |
| Chung | idle, move, hit, guard, heal (Trị Liệu / Sinh Mệnh Diệp), dodge, ko | — | Bộ chung | — | — | Có đủ |

### B4. Bạch Ngưng Băng nam, mốc Q1 trước khi mất tay phải (ch 133–138)

Căn cứ: [CHI_TIET_NGUYEN_TAC_Q1.md](CHI_TIET_NGUYEN_TAC_Q1.md). Thường ép tu vi xuống Nhị chuyển để trì hoãn tự bạo, ít dùng cổ Tam chuyển (ch 135).

| Clip | Chiêu / cổ | Căn cứ | Cách thực hiện | Pose | Mốc | Ảnh hiện có |
|---|---|---|---|---|---|---|
| `atk` | Chém bằng dải hàn băng phóng từ tay (băng nhận) | ch 135, 172 | Ung dung, một tay hất ngang như phẩy bụi, dải băng sắc chém ra; mặt cười khẩy | 3 | contact, `hand_r` | `attack` hiện tại là đấm: nên gen lại |
| `sk_locbangnhan` | Lốc băng nhận (chiêu lớn) | ch 140 | Giải phóng chân nguyên: hai tay dang rộng, xoay người, lốc băng nhận cuộn quanh. Lấy đà dài, có vòng báo trước | 3 | activate, `body` | Chưa có, `heavy` dùng tạm |
| `sk_thuytrao` | Thủy Tráo (cầu nước bao thân) | ch 143 (cổ trên người BNB) | Hai lòng bàn tay mở ra hai bên, quả cầu nước bao quanh | 2 | activate, `body` | Chưa có, `guard` dùng tạm |
| `sk_suongyeu` | Sương Yêu (tự bạo cổ để thoát thân) | ch 136 | **Chiêu thoát một lần mỗi trận** khi máu thấp: hơi sương nổ tung, đẩy lùi đối thủ, BNB lùi xa | 2 | activate, `body` | Chưa có |
| `win` | — | Tính cách (ch 133, 135) | Ngửa cổ cười ngạo nghễ, một tay chống hông | 1 | — | `win` hiện tại gần đúng, xem lại |
| Chung | idle, move, hit, guard, heal, dodge, ko | — | Bộ chung | — | — | Có đủ |

**Mâu thuẫn cần người dùng chọn:**

- `js/data.js` ghi `GU.bachngoc` là "Cổ của Bạch Ngưng Băng", và kit BNB cũ có Bạch Ngọc, Băng Đao, Băng Trùy.
- Tài liệu nguyên tác trong repo chỉ ghi Bạch Ngọc là cổ do **Phương Nguyên** hợp luyện (ch 100). Tài liệu cũng không nhắc Băng Trùy ở Q1.
- Đề nghị: kit BNB dùng các chiêu trong bảng trên. Bạch Ngọc và Băng Trùy bỏ khỏi BNB cho tới khi có nguồn.

### B5. 36 nhân vật còn lại

Dùng cùng bảng B2. Mỗi nhân vật tối thiểu có:

- `atk` riêng.
- 1–2 `sk_` theo chiêu có căn cứ (`EAI.sk`, `SK`, `GU` trong `js/data.js`, đối chiếu tài liệu nguyên tác).
- `win` riêng. Thú thì `win` là tư thế đắc thắng hoặc gầm.

Ví dụ từ dữ liệu hiện có:

- `heo_rung`: `atk` húc nanh; `sk_charge` lùi đà → húc thẳng (`EAI.heorung.sk='charge'`).
- `dian_lang_boss`: `atk` vồ cắn; `sk_howl` ngửa cổ tru gọi bầy (`sk:'howl'`), `sk_thunder` sét trên sừng (`langvuong.sk='thunder'`).
- `hac_hung`: `atk` tát vuốt; `sk_rage` đứng dậy đập ngực (`sk:'rage'`).
- `thiet_huyet_lanh`: `atk` quất xích; `sk_` theo chiêu xích trấn ma.

Thứ tự làm đặc tả: Điện Lang Vương, Thiết Huyết Lãnh, Nhất Đại, Phương Chính, rồi tới các nhân vật Q2.

### B6. Thay đổi importer và prompt

- Tên action mới: `atk`, `sk_<id>` (chữ thường, gạch dưới). File: `<id>_<clip>_vN.png`, ví dụ `pn_sk_bachngoc_v1.png`.
- **Mỗi actor có `clips.json`:** số pose kỳ vọng, thời lượng, mốc, điểm phát. Importer đọc file này thay vì bảng `TIMING` cố định, và **không ghi sheet nếu sai số pose**. Việc này gộp với các sửa lỗi blue-chan nêu ở mục 10.3 và 12.1 của tài liệu gen hàng loạt.
- Clip cũ `attack` / `cast` / `heavy` giữ làm dự phòng. Sim chọn clip theo thứ tự `sk_<id>` → clip dự phòng ghi trong kit → `idle`.
- Prompt gen: khối chung + nhân vật + dòng `Poses` lấy từ cột "Cách thực hiện". Câu cho clip riêng phải nêu **cách nhân vật đó ra chiêu**, không dùng câu mẫu chung.

---

## Phần C. Thứ tự thực hiện

| Bước | Nội dung | Phụ thuộc ảnh mới? |
|---|---|---|
| **C1** | Điều khiển mới (phần A): bỏ dừng, chuột và phím trực tiếp, đuổi đánh, phóng chiêu theo con trỏ, bộ đệm lệnh, tốc độ trận | Không |
| **C2** | `clips.json` + importer mới (gồm các sửa lỗi của mục 12.1) | Không |
| **C3** | Chiêu PN trong sim theo bảng B3. Clip chưa có thì dùng clip dự phòng | Không |
| **C4** | Chiêu và AI BNB theo bảng B4: atk băng nhận, lốc băng nhận có vòng báo trước, Thủy Tráo, Sương Yêu thoát thân một lần | Không |
| **C5** | Bạn gen ảnh mới: PN `atk` (đấm), `sk_bachngoc`, `sk_cuongthu`, `sk_cuxi` + con rết, `sk_thienbong`; BNB `atk`, `sk_locbangnhan`, `sk_thuytrao`, `sk_suongyeu`, xem lại `win`. Tôi viết sẵn prompt cho từng clip | **Có** |
| C6 | Nhập ảnh, thay clip dự phòng, chỉnh số bằng máy đấu máy | Có |

C1–C4 làm được ngay với ảnh hiện có. C5 có thể làm song song khi bạn có thời gian gen.

## Cần bạn chốt

1. Phím Q W E R / Space / 1 2 / S như bảng A1. Có muốn đổi gì không?
2. Tốc độ trận mặc định 0,85×?
3. Kit BNB theo nguyên tác (bỏ Bạch Ngọc và Băng Trùy) như B4?
4. Sương Yêu làm chiêu thoát một lần của BNB khi máu thấp: có giữ không?

