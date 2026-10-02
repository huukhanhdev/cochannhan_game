# Kế hoạch map battle pixel — Blue-chan

02/10/2026. Kế hoạch cho nền đấu trường phù hợp sprite key-pose PN/BNB và roster sau này. Chưa generate ảnh, chưa sửa renderer/simulation. Orange-kun có thể dùng tài liệu này để review và tích hợp.

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
