# UI polish — Giữ khung game, nâng mỹ thuật và cảm giác thao tác

Chi tiết nâng cơ chế và trải nghiệm chiến đấu theo yêu cầu mới: [10 — Battle theo lượt chiến thuật](10_BATTLE_THEO_LUOT_CHIEN_THUAT.md). Lộ trình BATTLE-01–06 trong đó thay phạm vi combat tổng quát P-04 ở plan này; các phần polish ngoài battle tiếp tục áp dụng.

**Trạng thái: P-01, P-02 và P-03 đã triển khai trong game thật; P-04 được thay bằng lộ trình battle ở tài liệu 10; P-05 đã hoàn thành đợt nối asset hiện có, còn ba nền đặc thù cần sản xuất ở đợt art sau.** Thay hướng thiết kế trong [08_UI_ART_DIRECTION_V2.md](../UI_V2_DA_DUNG.md#source-docs-big-update-q1-q2-08-ui-art-direction-v2-md) và dừng phát triển prototype Nghịch Mệnh. Không tiếp tục tạo shell hoặc game mẫu riêng.

## 1. Quyết định thiết kế

Giữ HUD trên, timeline, bảng nhân vật, sân khấu chính, nhật ký và hệ điều hướng hiện tại. Giữ cách người chơi chọn địa điểm, đọc sự kiện, dùng cổ và chiến đấu. Mobile tiếp tục theo bố cục responsive của game, cải thiện từng điểm vướng.

Mục tiêu: **game tu luyện kỳ ảo, sắc lạnh, có hiểm nguy và chiều sâu**. Sự hấp dẫn đến từ thế giới, cổ trùng, tiến bộ cảnh giới và phản hồi của hành động. Cỡ chữ, trang trí và tranh phải phục vụ những việc này.

Không dùng nền giấy ngà toàn màn, texture giấy ố vàng, tiêu đề khổng lồ, khoảng trống kiểu trang giới thiệu hoặc menu mới thay bố cục cũ. Không đổi framework, kiến trúc save, luật gameplay hay nội dung nguyên tác để phục vụ visual.

Nguồn chuẩn nội dung: [Q1](../../reference/CHI_TIET_NGUYEN_TAC_Q1.md), [Q2](../../reference/CHI_TIET_NGUYEN_TAC_Q2.md). “Ma mị” không đồng nghĩa mọi cảnh đều có máu, mọi nhân vật đều phát tà khí hoặc mọi địa điểm đều là ban đêm.

## 2. Vì sao có cảm giác giấy cũ và cách xử lý

Một số asset trước đó đã xem có nền giấy nâu vàng và tương phản thấp. Bản B còn chủ động dùng màu giấy, sepia và giảm bão hòa, làm cảm giác đó mạnh hơn. Đây là lựa chọn mỹ thuật không hợp mục tiêu người dùng; không cần suy rằng mọi tranh bảo tàng đều phải bỏ.

Workspace hiện đã có người khác sửa nhiều ảnh nền và `js/battle.js`. `assets/art/bg_village.jpg` lúc lập plan đã là cảnh núi đêm xanh lạnh, không còn bản giấy cũ. Phải kiểm kê snapshot mới trước khi thay ảnh tiếp; không ghi đè công việc đang diễn ra.

Có ba lớp phải kiểm tra riêng:

| Lớp | Hiện trạng / rủi ro | Cách xử lý |
|---|---|---|
| Ảnh gốc | Giấy vàng, ít chiều sâu, hoặc ảnh mới có bố cục không khớp điểm đến | Giữ ảnh phù hợp; thay ảnh không đạt bằng tranh môi trường đúng brief và vị trí UI |
| Cách ghép vào game | Crop mất điểm nhấn; `asset()` có thể chọn ảnh override; sprite bị kéo giãn | Kiểm tra đường dẫn thực tế, tỷ lệ, điểm lấy nét và fallback ở từng màn |
| CSS/VFX | `.map` có bóng tối inset, `::before` có gradient; `.map.storm` giảm sáng/bão hòa; `.story-art` có gradient riêng | Tinh chỉnh từng lớp trên ảnh thật; chỉ tối vùng đặt chữ, không phủ tối dày toàn tranh |

Không dùng một filter xanh chung để “cứu” toàn bộ ảnh cũ. Nhuộm màu không tạo ra kiến trúc, ánh sáng và chiều sâu còn thiếu. Ngược lại, ảnh mới tốt cũng không cần thêm nhiều bloom/hạt để chứng minh là game.

## 3. Hướng art: rõ hình, sâu cảnh, lạnh có điểm ấm

### Môi trường

- Sơn thủy fantasy có tiền cảnh, trung cảnh, hậu cảnh; núi và kiến trúc có khối rõ, sương tạo khoảng cách.
- Nền chủ đạo xanh than, đá xám, ngọc trầm. Đèn, nguyên thạch, cổ và huyết đạo tạo điểm sáng theo ngữ cảnh.
- Sơn trại phải đọc được là nơi sinh sống: đường đi, nhà, học đường, cổng. Tranh đẹp nhưng chỉ có núi và trăng chưa đủ làm bản đồ chức năng.
- Cảnh tối vẫn thấy mặt nhân vật, đường đi và hình cổ; tránh nghiền toàn bộ vùng tối thành đen.
- Có cảnh ban ngày/mưa/đêm phù hợp state. Không để trăng hiện trên nền cố định trong lúc UI báo ban ngày.
- Chất liệu vẽ thống nhất: có thể dùng nét cọ rõ nhưng không phủ texture giấy mục; hạn chế trộn ảnh người thật, anime phẳng và cổ trùng render bóng nhựa trong cùng một cảnh.

### UI và chữ

- Kế thừa nền tối hiện tại; phân biệt mặt panel và nền bằng độ sáng vừa đủ, viền xám lạnh hoặc đồng tối.
- Vàng chỉ nhấn nút chính/cơ duyên; ngọc cho chân nguyên; đỏ cho nguy hiểm; lam cho băng. Đi kèm chữ/icon, không truyền trạng thái bằng màu đơn độc.
- Tiêu đề vẫn nằm trong khung game; tăng chất lượng phân cấp, không tăng thành headline chiếm màn.
- Icon chức năng cùng nét và độ dày. Chữ Hán là họa tiết bổ trợ; thao tác luôn có nhãn tiếng Việt.
- Giữ thân bài dễ đọc, đủ dấu; chỉnh contrast và khoảng dòng trước khi thay font.

## 4. Nâng từng phần ngay trong khung hiện tại

| Thành phần | Thay đổi cụ thể | Người chơi cảm nhận |
|---|---|---|
| HUD | Thanh HP/chân nguyên có nền, mức hiện tại và phần vừa thay đổi; cảnh giới có huy hiệu gọn; cảnh báo đói/nguy hiểm có điểm nhấn riêng | Thấy tác động sau hành động và hiểu tài nguyên của mình |
| Timeline | Mốc hiện tại rõ hơn, mốc đã qua dịu đi; mốc đang chờ có dấu riêng, giữ quy tắc thông tin đã biết | Đọc được tiến trình, không phải dò từng ô |
| Panel nhân vật | Viền/material tối tiết chế; không khiếu có độ sâu và màu chân nguyên đúng cảnh giới | Cảm giác đang quản lý một cổ sư có tiến bộ thật |
| Bản đồ | Nền phù hợp pin; pin có trạng thái thường/hover/chọn/khóa; dấu sự kiện mới vừa đủ; giữ vị trí và thao tác quen thuộc | Nhận ra nơi đến, cơ hội và rủi ro ngay trên tranh |
| Sự kiện | Crop tranh đúng chủ thể; portrait rõ; khung lời nói và lựa chọn đồng bộ; nhấn người đang nói | Cảnh có không khí nhưng vẫn đọc/chọn nhanh |
| Lựa chọn | Hover/nhấn rõ; metadata chi phí, điều kiện, nguy cơ dễ phân biệt; phương án khóa vẫn đọc được | Cảm thấy quyết định có trọng lượng và biết vì sao chưa chọn được |
| Kho cổ | Ảnh cổ sắc, nền cùng tông, chuyển/công dụng/tình trạng có vị trí nhất quán; trạng thái đói không chỉ giảm opacity | Cổ có bản sắc, nhìn nhanh biết con nào cần chăm sóc |
| Tu luyện/luyện cổ | Không khiếu và tiến độ phản ứng theo state; hiệu ứng hợp luyện, thành công/thất bại khác nhau; nút đột phá nổi rõ khi đủ điều kiện | Cảm giác tích lũy và vượt cảnh giới |
| Combat | Báo chiêu dễ thấy, hướng đòn rõ, va chạm có lực, hồi phục/đỡ/độc khác hiệu ứng; không đổi vị trí skill bar quen dùng | Nhìn hiểu rồi phản ứng, nhận biết đòn vừa có tác dụng gì |
| Nhật ký/kết quả | Nhấn thay đổi quan trọng, bớt lặp chữ; kết quả lớn có đường đọc lại | Theo được hệ quả mà không phải canh toast |

## 5. Hiệu ứng tạo cảm giác game

Ưu tiên theo tần suất người chơi gặp:

1. **Chạm và nhấn:** nút chìm nhẹ, viền sáng nhanh, âm ngắn khi audio được bật. Khoảng 100–180ms; không trì hoãn xử lý action.
2. **Tài nguyên thay đổi:** chip `−6 chân nguyên`, `+20 thạch`, phần thanh vừa mất/hồi; không nhảy toàn bộ HUD hay dồn số bay lên chữ thoại.
3. **Cổ thi triển:** nguồn phát → đường đi → tác động. Nguyệt nhận mảnh và sắc; hộ thể ôm nhân vật; lực đạo dùng thú ảnh/va chạm; huyết đạo có dấu hiệu riêng.
4. **Tiến bộ:** cảnh giới mới, nhận cổ lần đầu và đột phá thành công có nhịp nhấn mạnh ngắn, về sau rút gọn. Không dựng một đoạn cinematic cho mọi phần thưởng nhỏ.
5. **Không khí:** sương, mưa, đèn và hạt ở lớp xa; chỉ bật đúng địa điểm/thời tiết. Mỗi cảnh bình thường ưu tiên một hiệu ứng nền chủ đạo.

Thời điểm damage, cooldown và điều kiện đỡ do engine quyết định. VFX đọc kết quả; bỏ qua/tắt VFX không đổi kết quả hoặc RNG. Rung nhẹ có tùy chọn tắt; reduced motion vẫn giữ thanh/icon/thông báo.

Thay ảnh nhân vật phải kiểm tra `js/living.js`: rig hiện tại có tọa độ dựa trên tranh cũ. Ảnh mới không khớp rig cần mapping riêng hoặc chỉ dùng chuyển động nhẹ; không kéo méo mặt/tay để có animation bằng mọi giá.

## 6. Phân bổ art cho Q1–Q2

| Cụm | Đặc trưng nên thấy trong game |
|---|---|
| Q1 — Sơn trại/học đường | Trúc, đá, nhà và lối đi rõ; ánh sáng theo buổi; nguy hiểm còn ở xa |
| Q1 — Hoa Tửu | Hang đá lạnh, vùng sáng hẹp, dấu tích truyền thừa; bí ẩn từ bố cục |
| Q1 — Lang triều | Đường phòng thủ, sói, đuốc, áp lực ngoài tường; không dùng cảnh bình yên nhuộm đỏ thay toàn bộ |
| Q1 — Huyết động/băng phong | Huyết sắc và băng trắng có hình khối, đổi theo cảnh/nhánh thật |
| Q2 — Hoàng Long/Bạch Cốt | Sông rộng, nhỏ bé trước thiên nhiên; đá xương và bóng tối ở truyền thừa |
| Q2 — Thương đội/Thương thành/Thiếu chủ | Đường núi, lều, phố/kiến trúc trong núi, ánh đèn và không khí giao dịch; phân biệt nơi chốn |
| Q2 — Tam Xoa/Ngũ chuyển | Quy mô địa hình và cường giả; ba truyền thừa nhận diện bằng hình lẫn màu |
| Q2 — Bá Quy/Điện luyện cổ | Đá cổ, vạc, vết rạn, ánh lửa/tiên nguyên; cao trào ve/bướm đúng sự kiện |

Audit ảnh mới đã có như `scene_shang_city.jpg`, `scene_hoang_long_river.jpg`, `scene_bach_cot.jpg` trước khi đặt sản xuất thêm. Có file không đồng nghĩa đã được map vào event/chapter hoặc nhìn tốt ở kích thước runtime.

## 7. Chia PR nhỏ, preview bằng game thật

| PR | Phạm vi | Bàn giao và nghiệm thu |
|---|---|---|
| **P-01 — Sơn trại và một sự kiện trong khung hiện tại** | Chốt snapshot asset; chỉnh crop/overlay nền; polish pin, lựa chọn, portrait và màu panel trong phạm vi nhỏ | Mở `index.html` bằng save mẫu, chơi được bản đồ → sự kiện → lựa chọn → kết quả; ảnh trước/sau cùng save, viewport và trạng thái |
| P-02 — HUD, nhân vật và timeline | Thanh tài nguyên, huy hiệu cảnh giới, không khiếu, trạng thái mốc | Các số và cảnh báo lấy từ state thật; không tăng chiều cao HUD làm mất vùng chơi trên mobile |
| P-03 — Cổ trùng và tu luyện | Thẻ cổ, tình trạng, công thức, minigame và đột phá | Dùng/luyện/đột phá đúng điều kiện; crop ảnh rõ; không mất tiến trình khi reload |
| P-04 — Combat feedback | Đường đòn, hộ thể, báo chiêu, hit/heal/interrupt, âm thanh ngắn | RT và theo lượt; không che kỹ năng; không thay damage/timing; đo hiệu năng |
| P-05 — Phủ art Q1/Q2 và hoàn thiện | Map ảnh theo vùng/cảnh; cao trào, kết cục; xử lý ảnh thiếu và mobile | Đúng chapter/unit/trạng thái nhân vật; không bị theme Q1 tràn sang Q2; giảm chuyển động và kiểm tra tải ảnh |

**P-01 làm mẫu trước, trực tiếp trong game đang có.** Chỉ mở rộng khi đã xem được độ rõ và cảm giác thực tế trên màn nhỏ. Không làm thêm prototype dùng số liệu giả; không viết lại navigation để trình diễn mỹ thuật.

**Kết quả P-01:** bản đồ Q1 dùng cặp nền Sơn trại cùng bố cục cho sáng/chiều và đêm; pin đã được đặt lại theo địa hình, phân biệt hành động chính/tự do/hết việc; lớp thời tiết không còn làm tối cả nút. Màn sự kiện có dòng thoại hiện tại rõ hơn, portrait ảnh dùng khung dọc còn nhân vật chưa có ảnh giữ huy hiệu tròn, lựa chọn có dấu hành động/phím tắt và trạng thái khóa vẫn đọc được. Ảnh nghiệm thu nằm tại `previews/ui-polish-p01/`.

**Kết quả P-02:** HUD so state giữa hai lần render để hiện phần vừa mất/hồi trên thanh và chip số, không lưu thêm dữ liệu vào save. Timeline nhấn mốc hiện tại, làm dịu mốc đã qua và đánh dấu biến cố đang chờ. Bảng Thân có huy hiệu cảnh giới và thông tin chân nguyên đặt trên không khiếu; mobile giữ nguyên chiều cao HUD thực tế và không tràn ngang. Ảnh nghiệm thu nằm tại `previews/ui-polish-p02/`.

**Kết quả P-03:** kho Cổ gắn vai trò và tình trạng vào từng thẻ, đồng thời giữ nguyên số đói/độ bền do engine quản lý. Màn tu luyện có tiến độ tu vi, cảnh báo bình cảnh và nút đột phá chỉ xuất hiện từ `cultCapped()`. Lò luyện ghi rõ nguyên liệu thiếu, còn trạng thái bật/tắt nút được đối chiếu trực tiếp với `canRefine()`; không sửa recipe, xác suất hoặc resolver. Mobile xếp công thức một cột và không tràn ngang. Ảnh cùng fixture nghiệm thu nằm tại `previews/ui-polish-p03/`.

**Kết quả P-05, đợt asset hiện có:** Thương gia thành/Thiếu chủ dùng cảnh thành, Tam Xoa/Ngũ chuyển dùng cảnh ba truyền thừa, Thương đội bỏ nền Sơn trại Q1. Năm minh họa cao trào Q2 được nối vào event thật; đồng thời sửa mapping Thương Tâm Từ từng trỏ tới ID không tồn tại. Không lấy tranh nhân vật làm nền map. Ba vùng chưa có asset map phù hợp được ghi rõ trong [previews/ui-polish-p05/README.md](../../done/PREVIEW_UI_VA_BATTLE.md#source-previews-ui-polish-p05-readme-md), cùng ảnh nghiệm thu desktop/mobile.

### Nội dung P-01 cụ thể

- Lấy hai ảnh baseline từ game thật: Sơn trại và một sự kiện Q1 có lựa chọn. Ghi viewport, save fixture và danh sách file/commit đang dùng; snapshot lại asset đang bị sửa để so sánh không bị trôi.
- Duyệt nền hiện tại cùng vị trí pin. Nếu không khớp, điều chỉnh art/crop hoặc tọa độ pin cục bộ; không đổi luật đi lại.
- Giảm các lớp tối dư thừa, giữ độ tương phản vùng chữ; không thêm sepia/texture giấy.
- Làm rõ pin chính/phụ/khóa, trạng thái nút và lựa chọn; nâng portrait/frame nhưng giữ máy cảnh hiện có.
- Bàn giao trước/sau ở desktop và mobile cùng với đường mở game đã chỉnh. Screenshot phải chụp từ browser; ảnh minh họa sinh không thay bằng chứng runtime.
- Chưa sản xuất hàng loạt tranh. Nếu ảnh mới là phần cần thiết, chỉ tạo asset cụ thể theo tỷ lệ/vùng an toàn của khung game rồi ghép và kiểm tra ngay.

## 8. File và các điểm cần giữ ổn định

- `index.html`: CSS palette, panel, HUD, map, story, choice; giữ `.layout`, DOM IDs và luồng responsive hiện hữu.
- `js/ui.js`: markup bổ sung trạng thái/metadata khi cần; giữ hành động và vị trí điều khiển. Không tạo game state thứ hai.
- `js/data.js`, `js/battle.js`: kiểm tra `asset()`/`eventArt()` và nền combat. `battle.js` hiện có thay đổi ngoài plan, cần đọc diff mới trước khi sửa.
- `js/present.js`, `js/q2/core.js`: theme/thời tiết theo đúng book/chapter. `mapMood()` hiện có quy tắc lượt/lang triều Q1; không dùng mặc định đó cho mọi vùng Q2.
- `js/living.js`, `js/aperture.js`, `js/rt.js`, `js/sound.js`: dùng lại hệ hiệu ứng đang có; chỉ thay theo PR phụ trách.
- Không đụng các bản preview riêng hoặc thay đổi save cho một đợt polish mỹ thuật. Không tự commit/push thay đổi của AI khác chung PR.

## 9. Tiêu chí nghiệm thu

- So trước/sau cùng save và viewport; không so bản cũ chưa tải ảnh với bản mới đã tải đủ.
- Có 1440×900 và 390×844; kiểm tra thêm 360px không tràn, zoom 200%, thao tác touch/bàn phím.
- Người chơi vẫn tìm được nút ở vị trí quen; chữ và chi phí đọc rõ; ảnh không lấn lựa chọn hoặc log.
- Không có trăng cố định trong cảnh ban ngày, nhầm nhân vật/giai đoạn, hoặc map pin chỉ vào vùng trống vô nghĩa.
- Load save cũ; đi hết một vòng hành động bằng engine; không lặp event, thưởng hoặc listener sau render.
- Kiểm tra reduced motion và ảnh lỗi. Mục tiêu hiệu năng thử: desktop gần 60 FPS, mobile ít nhất 30 FPS trên thiết bị được ghi rõ; chưa coi đây là số đo hiện có.
- Chạy test logic khi đụng JS; CSS/art phải có screenshot và browser smoke, không chỉ dựa vào `node --check`.

**Ưu tiên:** tranh đúng và ghép đúng → chữ/nút rõ → phản hồi hành động → hiệu ứng cao trào. Chốt từng phần bằng game thật, giữ khung hiện tại xuyên suốt.
