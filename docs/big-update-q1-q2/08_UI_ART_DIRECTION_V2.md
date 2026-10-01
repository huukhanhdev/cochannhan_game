# UI V2 — Sân khấu sơn thủy, hành trình nghịch mệnh

> **Đã dừng theo phản hồi người dùng.** Không tiếp tục hướng thay khung hoặc prototype Nghịch Mệnh. Kế hoạch hiện hành: [09 — Giữ khung hiện tại, polish UI](09_UI_POLISH_GIU_KHUNG_HIEN_TAI.md). Nội dung bên dưới chỉ lưu lại lịch sử đề xuất.

Ngày: 01/10/2026. **Trạng thái: kế hoạch thiết kế; chưa triển khai UI V2.**

Đề xuất thay bố cục ba cột hiện tại bằng giao diện lấy cảnh và hành động làm trung tâm. Bản này thay định hướng bố cục ở [02_UI_UX.md](02_UI_UX.md); tiếp tục dùng các yêu cầu về tính dễ hiểu, mobile và accessibility của tài liệu đó, cùng nguyên tắc hiệu ứng ở [03_EFFECT_AUDIO.md](03_EFFECT_AUDIO.md).

Content tiếp tục lấy chuẩn từ [CHI_TIET_NGUYEN_TAC_Q1.md](../../CHI_TIET_NGUYEN_TAC_Q1.md) và [CHI_TIET_NGUYEN_TAC_Q2.md](../../CHI_TIET_NGUYEN_TAC_Q2.md). Đổi cách kể và trình bày phải phản ánh trạng thái thật; không thêm động cơ nhân vật, lệnh bài, thời hạn hay phần thưởng chỉ để làm đẹp màn hình.

## 1. Chọn hướng nào?

| Hướng | Người chơi cảm nhận | Phạm vi | Đánh giá |
|---|---|---|---|
| Làm mới khung hiện tại | Quen thuộc hơn, chữ và thẻ đẹp hơn | Màu, khoảng cách, ảnh, nút | Ít rủi ro nhưng mức thay đổi cảm giác chơi hạn chế |
| **Sân khấu sơn thủy + hội thoại điện ảnh + bàn cổ trùng** | Đang sống trong một hành trình có không khí, nhân vật và biến cố | Thay shell, điều hướng và các màn chính; dùng lại engine | **Đề xuất chọn**: tận dụng thế mạnh truyện, tranh và chiến đấu sẵn có |
| Thế giới có nhân vật đi lại trực tiếp | Khám phá không gian bằng avatar | Thêm di chuyển, va chạm, camera, tương tác thế giới và nhiều asset | Là một đợt đổi gameplay lớn; chưa phù hợp làm bước UI tiếp theo |

Hướng được chọn có ba điểm nhận diện: **sơn thủy nhiều lớp, ấn triện tiết chế, cổ trùng hiện diện như sinh vật**. Cảnh đẹp kéo người chơi vào; hành động rõ giữ nhịp chơi; thay đổi của thế giới làm họ muốn xem tiếp.

## 2. Những điểm đang làm trải nghiệm bị chia nhỏ

Khảo sát lần này đọc code và xem hai asset mẫu; chưa chạy browser để kết luận về layout thực tế hoặc FPS.

| Hiện trạng có trong repo | Ảnh hưởng dự kiến | Thay đổi V2 |
|---|---|---|
| `index.html`: khung tối đa 1400px; `.layout` có hai cột cố định 300px + 290px | Nhân vật và log chiếm nhiều chỗ dù người chơi đang đọc truyện hoặc đánh nhau | Bỏ hai cột thường trực; mở thành bảng theo nhu cầu |
| `.story-art` chỉ cao 180–280px | Tranh thường trở thành banner đầu bài, ít đất để dàn cảnh | Cảnh chiếm vùng chính, có bố cục riêng cho thoại và hành động |
| HUD, timeline, sheet, log cùng được dựng ở `render()` | Nhiều khối tranh sự chú ý; thay toàn DOM dễ mất focus/scroll | HUD gọn; dựng theo chế độ; cập nhật phần thay đổi |
| Kết quả nhỏ chủ yếu đi qua toast tự tắt | Người đọc chậm có thể bỏ lỡ hệ quả quan trọng | Biên nhận giữ lại đến hành động tiếp theo; có đường đọc lại |
| Hai mẫu đã xem: tranh `scene_qingshu_vs_bai.png` có nét cọ mạnh; chân dung `n_shangxinci.jpg` mịn và sáng | Chuyển giữa các loại ảnh có thể thiếu thống nhất | Audit art đang được dùng, rồi thống nhất crop, tông màu và vật liệu trước khi sản xuất thêm |
| Menu phụ dùng chung `modalContainer`; combat RT có luồng cập nhật riêng | UI mới cần xử lý lớp phủ, pause và focus nhất quán | Một bộ quản lý lớp phủ dùng chung cho kho cổ, nhật ký và cài đặt |

Hai asset mẫu không đại diện cho toàn bộ kho tranh. Cần xem contact sheet của ảnh thực sự được `asset()` chọn, gồm cả fallback khi thiếu manifest cá nhân.

## 3. Mỹ thuật: đẹp từ bố cục và chất liệu

### 3.1. Bảng màu nền tảng

| Vai trò | Màu gợi ý | Cách dùng |
|---|---|---|
| Mực sâu | `#0B1115` | Nền đọc chữ, lớp phủ |
| Giấy ngà | `#E8DDC7` | Chữ chính, tiêu đề, trang ký sự |
| Ngọc trầm | `#75B69A` | Chân nguyên, hồi phục, tu luyện |
| Đồng cổ | `#CBA968` | Điểm nhấn tương tác, viền chọn, dấu mốc |
| Chu sa | `#C35B50` | Nguy hiểm, thương tổn, huyết đạo |
| Lam lạnh | `#91B9CB` | Băng đạo, không khí lạnh |

Đây là token khởi điểm; từng cặp chữ/nền phải được kiểm tra tương phản. Cảnh được phép sáng và nhiều màu; vùng đọc chữ có nền đủ ổn định. Mỗi màn chỉ có một điểm nhấn thị giác mạnh.

- Giảm viền hộp lặp lại. Dùng khoảng cách, bóng nền và lớp sáng tối để chia nội dung.
- Nút chính như một dải giấy/ấn lệnh; nút phụ nhỏ và nhẹ hơn; hành động nguy hiểm có chữ giải thích.
- Dùng lại `Be Vietnam Pro` cho thân bài; thử `Cormorant Garamond` hiện có ở tiêu đề lớn. Kiểm tra dấu tiếng Việt trước khi chốt font hoặc thay thế.
- Cỡ thân bài khởi điểm 17–18px, line-height 1.65–1.8, chiều dài dòng khoảng 45–65 ký tự. Tiêu đề desktop 36–52px; mobile 26–34px.
- Chữ Hán làm họa tiết phụ; tên thao tác luôn có tiếng Việt. Giảm emoji pha phong cách; icon chức năng dùng SVG thống nhất.
- Asset vuông giữ dạng chân dung trong khung trang trí. Chỉ dựng nhân vật đứng bán thân khi có ảnh phù hợp; không phóng ảnh avatar thành ảnh toàn thân.

### 3.2. Mỗi vùng có một dấu ấn

| Vùng | Cảnh, ánh sáng và chất liệu | Chuyển động nền |
|---|---|---|
| Q1: Sơn trại | Trúc xanh, núi ẩm, đèn vàng; khoảng trời rộng | Sương chậm, bóng lá ở rìa |
| Q1: Hoa Tửu | Đá ướt, bóng tối, ánh lưu ảnh | Nước nhỏ, bụi trong khe sáng |
| Q1: Lang triều | Tường trại, trời nặng, đuốc đỏ | Bóng sói xa, bụi; chỉ tăng khi sự kiện thực sự tới |
| Q1: Hồi kết | Huyết sắc và băng trắng theo cảnh | Đóng băng hoặc dòng huyết theo đúng nhánh |
| Q2: Hoàng Long | Nước đục, bè, đường chân trời lạnh | Mặt nước và vệt trôi chậm |
| Q2: Bạch Cốt | Đá trắng ngà, hốc tối, cột sáng hẹp | Bụi xương nhẹ |
| Q2: Thương đội | Vải lều, đèn ấm, đường núi | Đèn đung đưa, bóng đoàn xe |
| Q2: Thương gia thành | Kiến trúc nhiều tầng, ánh ngọc trong núi | Chiều sâu phố; điểm sáng ở nơi tương tác |
| Q2: Thiếu chủ | Bàn sổ sách, thư tín, ấn tín | Ánh đèn; nhịp cảnh tĩnh hơn |
| Q2: Tam Xoa | Ba lối truyền thừa, địa hình dựng đứng | Các cột sáng có hình dạng phân biệt |
| Q2: Ngũ chuyển | Quy mô nhân vật và bầu trời áp đảo | Gió mạnh ở lớp xa |
| Q2: Bá Quy | Đá cổ, vết rạn, vạc luyện | Lửa và dao động tiên nguyên theo state |
| Q2: Điện luyện cổ | Không gian bó hẹp rồi mở rộng ở cao trào | Ve/bướm, ánh ngọc theo kết quả đã xảy ra |

Không đổi màu ngẫu nhiên theo lượt. Bộ theme lấy từ book, chapter, event và trạng thái cảnh; Q2 không dùng quy tắc thời tiết/lang triều Q1.

## 4. Bỏ ba cột, tổ chức thành bốn chế độ

1. **Hành trình:** bản đồ lớn, điểm đến, việc còn lại, biến cố đang chờ.
2. **Câu chuyện:** tranh, người nói, lời thoại và lựa chọn.
3. **Chiến đấu:** đấu trường, ý đồ địch, tài nguyên và kỹ năng.
4. **Chuẩn bị:** kho cổ, luyện cổ, nhân vật, nhân quả; mở thành bảng rộng hoặc trang riêng trên mobile.

Luồng chính: **chọn nơi đến → gặp chuyện → quyết định/chiến đấu → thấy kết quả → trở lại thế giới đã thay đổi**. Cảnh nào cũng có một hành động tiếp theo rõ ràng; nội dung đọc thêm nằm sau nút mở rộng.

### Desktop: màn Hành trình

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Q1 · Thanh Mao Sơn     [HP] [Chân nguyên] [Thạch]    [Thiền] [Menu]   │
│                                                                     │
│  NÚI THANH MAO                  Tranh bản đồ chiếm phần lớn màn hình │
│  Tháng … · Tuần …                                                   │
│                 ◇ Hậu sơn                                           │
│       ◇ Học đường                         ◇ Núi rừng                 │
│                                                                     │
│  Biến cố đang chờ                      ◇ Chợ thương đội              │
│  Thương đội vừa đến                                                 │
│  [Đến gặp]                    Điểm đang chọn · Chi phí · [Đi tới]    │
│                                                                     │
│ [Hành trình] [Cổ trùng] [Nhân vật] [Nhân quả]    ● ● ○  [Qua tuần]    │
└─────────────────────────────────────────────────────────────────────┘
```

Đây là wireframe chức năng, không phải screenshot. Sân khấu tận dụng viewport nhưng không bắt người dùng bật chế độ fullscreen của trình duyệt.

- Thanh tài nguyên cao khoảng 56–72px; thanh dưới khoảng 64–80px. Kích thước cuối điều chỉnh qua prototype.
- Mốc đang chờ hiển thị một câu và một nút; không biến thành danh sách nhiệm vụ dài che cảnh.
- Click điểm bản đồ: hiện thông tin gọn và nút đi; người chơi biết chi phí trước khi tiêu việc. Các thao tác quen dùng có phím tắt khi phù hợp.
- Có chế độ danh sách điểm đến, dùng cùng dữ liệu và điều kiện với pin bản đồ.
- Timeline nằm trong Hành trình mở rộng; chỉ phóng lớn các mốc đã biết. Mốc bí mật chưa khám phá không lộ tên hoặc hình ảnh.

### Mobile

- Dọc một cột; HUD hai hàng ngắn, bản đồ khoảng 40–50dvh khi đủ chỗ, chi tiết điểm đến bên dưới.
- Thanh đáy bốn mục có chữ: Hành trình, Cổ trùng, Nhân vật, Nhân quả; cài đặt ở nút menu.
- Màn thoại ưu tiên tranh khoảng 30–38dvh rồi văn bản/lựa chọn cuộn tự nhiên. Chữ phóng lớn thì giảm phần tranh trước.
- Bảng chi tiết mở từ đáy; kho cổ nhiều nội dung mở thành trang. Chỉ một lớp phủ tương tác tại một thời điểm.
- Pin không đè nhau hoặc bị cắt khi crop tranh; dùng vị trí riêng cho mobile hoặc chuyển sang danh sách. Không thu nhỏ nguyên bản đồ desktop.
- Dùng safe-area, chiều cao viewport động, vùng chạm ít nhất 44px, mục tiêu 48px cho nút chính. Không khóa trang ở 100vh khiến mất lựa chọn khi xoay màn hình.

## 5. Các màn cần làm lại

| Màn | Thiết kế mới | Điều khiến người chơi muốn tương tác tiếp |
|---|---|---|
| Mở đầu | Tranh lớn, Phương Nguyên, tiêu đề gọn; Tiếp tục là nút chính nếu có save; mô tả một câu nơi đang dở | Nhận ra ngay hành trình của mình đang ở đâu |
| Chọn mệnh cách | Ba thẻ lớn có hình tượng riêng; cái được/cái mất dễ so | Cảm giác bắt đầu một kiếp có tính cách riêng |
| Hành trình | Bản đồ như một địa điểm sống; pin mới/phong tỏa/đang chọn phân biệt bằng hình và chữ | Thấy cơ hội và thay đổi sau mỗi mốc |
| Hội thoại | Cảnh lớn, tên người nói rõ; 1–2 khối thoại mỗi nhịp; lựa chọn trên nền tối ổn định | Nhịp đọc có khoảng lặng và cao trào |
| Kho cổ | Lưới ảnh cổ lớn; chọn mở chi tiết, trạng thái nuôi và công dụng; lọc nhanh | Nhận ra bộ cổ đang mạnh ở đâu và thiếu gì |
| Tu luyện | Không khiếu ở giữa; chân nguyên, tiến độ và chi phí sát hành động | Thấy sự tiến bộ trước/sau một lần tu luyện |
| Luyện cổ | Trình bày nguyên liệu → sản phẩm, rồi chuyển sang minigame hiện có | Hiểu cái giá trước khi bỏ nguyên liệu |
| Chiến đấu | Đấu trường rộng, ý đồ địch ở trên, thanh kỹ năng ở dưới | Quan sát, phản ứng, nhận phản hồi rõ sau đòn |
| Nhân quả | Dòng sự kiện có liên kết nguyên nhân → hậu quả đã biết; một mục là một chuyện | Thấy lựa chọn để lại dấu vết, có điều đáng chờ |
| Quan hệ | Chân dung, thái độ biểu hiện, sự việc gần nhất; chỉ người đã gặp | Nhớ câu chuyện với nhân vật, không chỉ nhìn điểm số |
| Cuối quyển | Một trang hồi cố: kết cục, quyết định lớn, số phận đã xác nhận, hành trang mang theo | Có một kết thúc đáng nhớ và động lực bước tiếp |

### Hội thoại: dàn cảnh thay vì nối hộp văn bản

- Cảnh nói chuyện có thể đặt chân dung bên phải và văn bản bên trái; cảnh hành động dùng tranh rộng với lời kể ở dưới. Chọn theo ảnh và event, không ép mọi cảnh chung một template.
- Nhấn để hiện hết đoạn đang chạy chữ; nhấn tiếp mới sang đoạn. Có tắt typewriter và lịch sử thoại.
- Lựa chọn thường xuyên đọc được trên mobile; phương án dài được xuống dòng, không cắt mất ý.
- Cái giá chắc chắn, điều kiện thiếu và nguy cơ đã biết được trình bày riêng. Không tự suy phần thưởng từ tên event.
- Nhãn ký ức/nguyên tác tuân cùng quy tắc khám phá ở cả `choiceBtn()` và `scChoiceBtn()`; cần rà sự khác biệt hiện có trước khi chuyển UI.
- Hệ quả quan trọng có biên nhận còn lại đến hành động tiếp theo và được đọc lại trong nhật ký. Thay đổi nhỏ dùng chip ngắn, không bắt xác nhận từng đồng thạch.

### Kho cổ và tu luyện: hai màn tạo cảm giác sở hữu

- Ảnh cổ là điểm nhìn chính; chuyển, công dụng và tình trạng có vị trí cố định. Dùng chuyển thật, không thêm phẩm chất thường/hiếm/huyền thoại.
- Chi tiết ưu tiên: cổ làm gì, tốn gì, đang bị gì, dùng/luyện được chưa. Phần mô tả dài mở rộng sau.
- Cho pin công thức làm mục tiêu; đây là tính năng UI mới cần lưu tùy chọn riêng, không giả vờ engine đã có.
- Nếu engine chưa có giới hạn trang bị/loadout, UI không dựng ô trang bị giả. Thanh kỹ năng lấy từ những cổ thực sự dùng được.
- Tu luyện hiện trước tác động của lựa chọn từ hàm tính thực tế. Viên mãn mở “Xung kích bích khiếu”; trần chương giải thích điều kiện tiến tiếp.
- Đột phá thành công: hình không khiếu đổi, âm ngắn, nhãn cảnh giới mới. Lần xem lại được rút gọn/bỏ qua.

### Chiến đấu: kỹ năng phải có lực và dễ đọc

- Ý đồ địch và mục tiêu trận có vị trí cố định; tín hiệu báo trước nằm trên lớp trang trí.
- Ba tầm chiến đấu được biểu diễn rõ trong đấu trường; nút di chuyển ghi đích đến.
- Kỹ năng có icon cổ, tên ngắn, phí chân nguyên, cooldown và lý do khóa. Mobile có nút xem chi tiết riêng, không phụ thuộc hover.
- Đỡ chuẩn, ngắt chiêu, sơ hở có phản hồi khác nhau. Hạt/bóng không che thanh vận chiêu hoặc vùng bấm.
- RT và theo lượt dùng cùng thứ bậc thông tin, nhưng nút điều khiển phù hợp từng chế độ.
- Dừng hình lúc va đòn chỉ thuộc lớp trình bày; nếu muốn dừng cả mô phỏng phải có quyết định gameplay riêng và kiểm tra công bằng. Không làm lệch cửa sổ đỡ/ngắt bằng animation.

## 6. “Cuốn hút” đến từ nhịp phản hồi

Ba lớp chuyển động, với ngân sách thử nghiệm:

| Lớp | Ví dụ | Nhịp đề xuất |
|---|---|---|
| Phản hồi thao tác | Nút nhấn, điểm đến được chọn, số thạch thay đổi | 100–180ms; phản hồi xuất hiện ngay |
| Chuyển ngữ cảnh | Mở kho cổ, vào cuộc thoại, trở lại bản đồ | 180–300ms; không phát lại mỗi render |
| Khoảnh khắc lớn | Khai khiếu, đạt cảnh giới, Thiền, kết quyển | 2–4 giây ở lần đầu; có bỏ qua và giảm chuyển động |

- Môi trường bình thường chuyển động chậm và thưa; cảnh căng thẳng thay ánh sáng/âm thanh trước khi tăng hạt.
- Âm thanh chia môi trường, UI và chiến đấu; crossfade khi đổi nơi. Nút mute vẫn dễ tìm trên mobile.
- Sau biến cố, pin/NPC/khung cảnh thay đổi nếu state có bằng chứng: quầy thương đội mở, địa điểm bị phong tỏa, quan hệ có chuyện mới.
- Nhận cổ mới: nhấn mạnh hình, tên và công dụng; cổ đã biết dùng biên nhận gọn.
- Khi quay lại game: một câu tóm tắt mốc đang chờ và nguy cơ thật, không chế deadline giả.
- Không làm mọi nút phát sáng hoặc mọi cổ trôi liên tục. Điểm nhìn chủ động chỉ dành cho chuyện quan trọng nhất lúc đó.
- Reduced motion vẫn giữ đủ thông tin; có tùy chọn giảm rung và chớp riêng.

## 7. Gói art cần chuẩn bị

Làm một bộ mẫu trước: **Sơn trại → một cảnh có lựa chọn → một trận → nhận cổ → mở kho cổ**, rồi áp cùng hệ UI cho một cảnh Thương gia thành. Dùng save mẫu để không phải chơi lại nhiều giờ mỗi lần duyệt bố cục.

1. **Audit và moodboard:** ảnh nào đang dùng, nguồn/license, kích thước, khung hình, màu chủ đạo, nhân vật/giai đoạn; đánh dấu ảnh cần thay, crop được, hoặc dùng nguyên.
2. **Art cho bộ mẫu:** nền Q1 và Thành; tranh sự kiện; chân dung Phương Nguyên và nhân vật trong cảnh; ảnh 6 cổ đại diện. Chọn từ kho hiện có trước, chỉ làm mới phần thiếu.
3. **Bộ UI:** icon chức năng SVG, pin bản đồ bốn trạng thái, viền ấn triện, vật liệu nền đọc chữ. Sinh trực tiếp bằng code/vector khi phù hợp.
4. **Mở rộng:** theme chín chương, chân dung còn thiếu, tranh các cao trào; giữ cùng quy tắc màu/crop/chất liệu.

Mỗi ảnh cảnh có điểm lấy nét cho desktop/mobile và vùng an toàn để đặt chữ. Nếu không có các lớp ảnh độc lập thì dùng một nền tĩnh tốt; chỉ thêm parallax khi crop và độ sâu thực sự phù hợp.

Không trỏ runtime thẳng vào ảnh master lớn. Xuất bản tối ưu qua cơ chế `asset()` hiện có, giữ fallback; ghi nguồn và quyền sử dụng vào manifest asset. AI có thể hỗ trợ tranh/cutout ở đợt sản xuất, không dùng ảnh sinh để thay chữ/nút tương tác.

## 8. Cách triển khai vào project

Tiếp tục dùng JavaScript/CSS hiện tại; thay framework không phải điều kiện để đạt thiết kế này. Chia lớp trình bày rõ để mỗi đợt có thể chạy và so sánh.

| Vùng code | Việc cần làm |
|---|---|
| `index.html` | Shell mới; tách CSS khỏi style lớn thành `css/ui-v2/`; giữ các DOM hook đang còn consumer trong giai đoạn chuyển |
| `js/ui.js` | Tách điều hướng, HUD, story, inventory; giữ binding `data-a`, `data-ch`, `data-sc-*` hoặc có adapter rõ ràng |
| `js/present.js` | Theme/crop theo book/chapter/event; chỉ chạy transition khi đổi view; giữ lịch sử thoại và bỏ qua |
| `js/q2/core.js` | Đưa dữ liệu bản đồ Q2 vào renderer chung; đơn vị ngày/tuần/tháng lấy từ chương |
| `js/rt.js`, `js/battle.js` | DOM combat ổn định, cập nhật số/cooldown có mục tiêu; lớp VFX riêng; giữ pause/tốc độ/chế độ lượt |
| `js/aperture.js`, `js/minigame.js` | Không khiếu thành phần trung tâm của màn tu luyện; bảo toàn input và state minigame |
| `js/sound.js` | Bổ sung âm UI/chuyển vùng; mute, suspend/resume nhất quán |
| `js/story.js`, `js/cicada.js` | UI đọc schema story đã sửa; cảnh quay ngược theo snapshot thật; không áp effect từ animation |

### Hợp đồng kỹ thuật bắt buộc

- Trước đổi shell, lập danh sách consumer của `hud`, `timeline`, `sheet`, `mainPanel`, `stage`, `log`, `modalContainer`, `titleLayer`. Không bỏ DOM ID mà renderer/listener vẫn gọi.
- Tạo bộ dữ liệu dành cho trình bày từ `S`: mode, theme, tài nguyên, thời gian, việc còn lại, biến cố đang chờ và địa điểm. Bộ đọc này không phát thưởng, không tiêu AP, không đổi RNG.
- Hàm render hiện có còn một số tác dụng phụ như khởi tạo scene và xóa kết quả. Di chuyển từng phần sang xử lý vào/ra cảnh với test tương ứng; không tạo vòng render thứ hai vô tình chạy effect hai lần.
- Trạng thái UI tạm thời: tab đang mở, scroll, focus, bảng chi tiết. Trạng thái game vẫn ở `S/META`; tùy chọn hiển thị lưu theo cơ chế settings của repo.
- Mỗi lớp phủ có lý do pause riêng. Đóng journal không được tự chạy tiếp trận vốn đã do người chơi pause; đổi tab trình duyệt cũng không xóa lý do pause còn lại. Pause áp dụng cả trong lúc lớp phủ xuất hiện/biến mất.
- Lớp phủ giữ focus, đóng Escape, trả focus về nút mở; phím tắt cảnh phía sau bị vô hiệu khi đang gõ hoặc đọc modal. Không để Space vừa cuộn nhật ký vừa tiến thoại.
- Mở/đóng màn không nhân listener/ticker/audio. Chỉ màn đang hiển thị nhận cập nhật; tránh thay `innerHTML` toàn shell mỗi tick combat.
- Animation đọc kết quả đã xác nhận. Skip, reduced motion và reload không áp phần thưởng/đổi chương lần nữa.
- Bắt đầu bằng tùy chọn UI V2 cho build thử. Khi đạt nghiệm thu thì chuyển mặc định và gỡ renderer cũ trong một đợt riêng; không duy trì hai UI vô thời hạn.

## 9. Lộ trình có sản phẩm bàn giao

| Đợt | Sản phẩm cụ thể | Điều kiện hoàn tất |
|---|---|---|
| V2-00: baseline và art direction | Screenshot UI hiện tại trên desktop/mobile; contact sheet; palette; wireframe bốn chế độ; save mẫu | Biết ảnh thật được dùng và điểm cần sửa; không dùng cảm giác thay số đo |
| V2-01: prototype tương tác | 4 màn: bản đồ, thoại, combat, kho cổ; một biến thể Q2; bấm được chuyển màn bằng dữ liệu mẫu | Xem được chiều dài chữ thật, nút thật, mobile thật; prototype được ghi rõ chưa nối gameplay |
| V2-02: shell + hành trình | HUD gọn, điều hướng, map renderer, bảng chi tiết, quản lý overlay/focus | Chơi một vòng Q1 bằng engine thật; save/load và nút qua lượt đúng |
| V2-03: hội thoại + hệ quả | Scene mới, lời thoại, lựa chọn, biên nhận, Nhân Quả Lục | Chọn mọi nhánh trong save mẫu được; lý do khóa đúng; không lộ mốc bí mật |
| V2-04: cổ trùng + tu luyện | Kho cổ, công thức, không khiếu, đột phá và minigame cùng visual system | Mua/bán/dùng/luyện có cùng kết quả với engine; reload giữa minigame được |
| V2-05: combat + audio/VFX | Đấu trường, thanh kỹ năng, ý đồ, hiệu ứng và pause lớp phủ | RT/theo lượt, touch/bàn phím đều chơi được; overlay không gây mất máu |
| V2-06: Q2 và cao trào | Theme chín chương, màn đầu/cuối, Thiền, cảnh nổi bật theo nhánh | Chuyển chương và kết cục đúng; không sai thân phận/giới tính/trạng thái nhân vật |
| V2-07: tối ưu và chuyển mặc định | Nén/lazy-load ảnh, kiểm tra thiết bị, đối chiếu save; gỡ CSS/renderer thừa | Đạt ma trận bên dưới; báo cáo lỗi còn lại rõ ràng |

Ưu tiên thực hiện **V2-00 → V2-01 → V2-02 → V2-03** trước: đây là phần thay đổi cảm nhận mạnh nhất ở gần như mọi lượt chơi. Tối ưu một đoạn chơi mẫu trước khi phủ art toàn Q1–Q2. Thời gian thực tế phụ thuộc số ảnh cần làm lại; chỉ ước lượng sau audit asset và prototype.

## 10. Nghiệm thu: đẹp, chơi được và có bằng chứng

### Trực quan và thao tác

- Screenshot các màn chính ở 390×844, 768×1024 và 1440×900; thêm kiểm tra tràn ngang ở 360px và zoom 200%.
- Trong khoảng 5 giây ở màn Hành trình, người mới tìm được việc còn lại, nguy cơ thật, biến cố chờ và cách đi tiếp. Đây là mục tiêu playtest, chưa phải số đo.
- Đường đọc rõ: cảnh/nhân vật → lời thoại → quyết định. Chữ không đặt trên vùng tranh gây mất tương phản.
- Mobile không có tooltip chỉ-hover; nút cuối không bị thanh đáy che. Chữ dài, tên cổ dài và ảnh lỗi có fallback.
- Mở kho cổ/nhật ký bằng bàn phím; đóng xong trở về đúng chỗ; combat giữ pause đúng ý người chơi.

### Logic và hiệu năng

- Chạy `check.cjs`, `story_test.cjs`, `regression_test.cjs` khi thay luồng đọc state/action; `ff_test.cjs` khi thay render/transition liên quan tua. Smoke Q1/Q2 khi nối từng màn vào engine.
- Browser flow thật: menu → mệnh cách → khai khiếu → bản đồ → thoại → trận → kết quả → kho cổ; save mẫu Q2 kiểm tra chuyển chương, pending và kết cục.
- Cùng save/seed và hành động, bật/tắt/skip VFX cho cùng kết quả. Chỉ tuyên bố phép so tái lập sau khi có seed/harness phù hợp.
- Mục tiêu thử nghiệm: khoảng 60 FPS desktop, ít nhất 30 FPS ở cấu hình mobile được ghi rõ; không preload cả hai quyển; UI phản hồi trước khi ảnh lớn tải xong. Đo trên thiết bị thật trước khi chốt ngân sách ảnh/hạt.
- Mở/đóng kho, scene và combat 20 lần: không tăng đều số ticker/listener; tab ẩn không chạy combat ngoài ý muốn.

### Đánh giá độ cuốn hút

Playtest ngắn 15–20 phút với khoảng 3–5 người để tìm vấn đề định tính. Hỏi họ nhớ quyết định nào, biết vì sao nhận/mất gì, và muốn làm gì tiếp theo. Ghi số lần phải hỏi cách chơi, nơi bỏ lỡ nút, đoạn đọc bị cắt nhịp. Không coi số người ít này là bằng chứng thống kê về retention.

**Mốc duyệt thiết kế đầu tiên:** đặt prototype của bốn màn cạnh UI hiện tại, cùng content/save mẫu và cùng kích thước màn hình. Chỉ mở rộng sản xuất art khi cả cảm giác thị giác lẫn đường thao tác đã tốt hơn qua kiểm chứng.
