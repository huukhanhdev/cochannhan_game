# Thiết kế gameplay, UI, effect và content Q1–Q2

Gộp năm phần thiết kế ngắn vào một tài liệu. Content chuẩn theo CHI_TIET Q1/Q2, không suy từ checkbox hoặc báo cáo 100%.

## Mục lục

- [01_GAMEPLAY.md](#source-docs-undone-big-update-q1-q2-01-gameplay-md)
- [02_UI_UX.md](#source-docs-undone-big-update-q1-q2-02-ui-ux-md)
- [03_EFFECT_AUDIO.md](#source-docs-undone-big-update-q1-q2-03-effect-audio-md)
- [04_CONTENT_QUYEN_1.md](#source-docs-undone-big-update-q1-q2-04-content-quyen-1-md)
- [05_CONTENT_QUYEN_2.md](#source-docs-undone-big-update-q1-q2-05-content-quyen-2-md)

---

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md"></a>

## 01_GAMEPLAY.md

**Trạng thái:** Đề xuất tổng thể, một số nền đã triển khai; chưa nghiệm thu toàn bộ phạm vi.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-gameplay-chuẩn-bị-đánh-đổi-và-hệ-quả"></a>
## Gameplay: chuẩn bị, đánh đổi và hệ quả

Trạng thái: đề xuất. Xem [lộ trình tổng](README.md). Tất cả tên API/state mới bên dưới là thiết kế dự kiến.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-1-vòng-chơi-mục-tiêu"></a>
### 1. Vòng chơi mục tiêu

**Đọc thế cục → chọn mục tiêu → chuẩn bị → hành động/cảnh/trận → nhận kết quả → thấy thế giới đổi.** Giữ ngân sách hành động hiện có làm baseline. Chỉ thay số việc mỗi lượt sau mô phỏng và playtest.

Mỗi lượt hiển thị một nguy cơ sắp tới, tối đa ba việc đáng chú ý và dự báo nuôi cổ. Không chỉ dẫn đáp án tối ưu; thông tin nhận được phụ thuộc việc dò xét, quan hệ và ký ức.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-2-g1--chuẩn-bị-có-tác-dụng-cụ-thể-p1"></a>
### 2. G1 — Chuẩn bị có tác dụng cụ thể (P1)

Trước mốc lớn, dành một hành động cho một trong các cách: dò xét, tích trữ, chọn vị trí hoặc nhờ người. Dùng cơ chế quan hệ, cổ và cờ hiện có; không thêm một thanh “điểm chuẩn bị” chung cho mọi chuyện.

| Chuẩn bị | Kết quả có thể nhìn thấy | Cái giá |
|---|---|---|
| Đọc dấu chân trước hang | Biết địch có chiêu ẩn thân; mở cách dẫn vào lối hẹp | Mất một việc khám phá |
| Dự trữ thuốc trước lang triều | Có một phương án cứu người/giữ tuyến thêm thời gian | Thạch, thức ăn hoặc cơ hội luyện cổ |
| Nhờ phe bảo lãnh | Mở lời khai hoặc lối tiếp cận riêng | Món nợ được nhắc và đòi ở cảnh sau |
| Thăm dò hàng thương đội | Biết khoảng giá/đường tiêu thụ | Bỏ lỡ một chuyến mua khác |

Chuẩn bị chỉ tiêu thụ khi cảnh tương ứng bắt đầu hoặc lựa chọn sử dụng nó. Có hạn sử dụng rõ theo chương; không lặng lẽ xóa ở `enterChapter()`. Người không chuẩn bị vẫn có đường đi với giá khác.

Nghiệm thu: cùng một trận/cảnh, ít nhất hai cách chuẩn bị thay đổi hành động khả dụng; không chỉ đổi một tỷ lệ xúc xắc ẩn.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-3-g2--chiến-đấu-lấy-yếu-đối-mạnh-p1"></a>
### 3. G2 — Chiến đấu lấy yếu đối mạnh (P1)

`rt.js` đã có tầm, vận chiêu, đỡ chuẩn, sơ hở, chân nguyên địch, đồng minh và mục tiêu khác hạ máu. Nâng cấp bằng encounter có thiết kế riêng, không thêm lại những hệ này.

Mỗi trận lớn có hồ sơ gồm: mục tiêu chính, điều kiện thất bại, 2–3 kiểu đòn có dấu hiệu phân biệt, một cách tận dụng địa hình, một giá phải trả khi rút lui, và kết quả cốt truyện tương ứng.

| Trận/chặng | Bài toán chính | Lựa chọn đáng giá |
|---|---|---|
| Thạch Hầu Vương Q1 | Đọc dấu hiệu khi đối thủ ẩn thân | Chờ lộ dấu, dẫn vào cửa đá, đổi phòng thủ lấy thời cơ |
| Lang triều Q1 | Cầm chân và bảo toàn nguồn lực | Đỡ để giữ tuyến hoặc đánh ngắt tiếng gọi bầy |
| Huyết Cương Q1 | Hoàn thành mục tiêu trong thế áp đảo | Phá nguồn tiếp sức/thoát theo nhánh cảnh được duyệt |
| Hộ tống Q2 | Người/hàng cần bảo vệ cạnh tranh với an toàn bản thân | Đổi tầm thu hút địch hoặc chấp nhận mất hàng để rút |
| Đấu trường Q2 | Đọc bộ cổ đối thủ qua trận trước | Đổi cách dùng bộ cổ thay vì chỉ tăng sát thương |
| Thiết Bá Tu Q2 | Địa hình và cơ động, tránh trao đổi trực diện | Tạo khoảng cách, ép tiêu hao, chọn lúc kết thúc |

Các bảng trên là **chuyển thể gameplay**; tính hợp lệ của từng thủ đoạn với cổ sở hữu và nguyên tác phải được biên tập trước khi triển khai.

Đồng minh: mở lệnh theo bối cảnh “ghìm chân”, “che đường lui”, “giữ sức”; dùng cooldown và điều kiện trạng thái. Bạch Ngưng Băng có thể từ chối yêu cầu trái lợi ích qua câu thoại và dấu hiệu rõ. Khi thêm hành động đồng minh, rà `allyMod()` để tránh vừa giảm độ khó bằng hệ số vừa được thêm sát thương miễn phí.

Chế độ lượt dùng cùng mục tiêu, điều kiện và kết quả; timing được chuyển thành quyết định theo nhịp đã báo. Tạm dừng không sinh thêm hồi chiêu, tài nguyên hoặc kích hoạt đòn hai lần. Tránh cân bằng RT và theo lượt bằng hai bộ phần thưởng khác nhau.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-4-g3--bộ-cổ-có-kế-hoạch-nuôi-và-đường-phát-triển-p1"></a>
### 4. G3 — Bộ cổ có kế hoạch nuôi và đường phát triển (P1)

Kho cổ cho biết: vai trò, điều kiện sử dụng, chi phí chân nguyên thực tế, tình trạng đói/thương tổn, dự báo chi phí lượt kế, nguồn thức ăn đã biết, công thức kế tiếp đã khám phá.

- Cho phép lưu **thứ tự thanh kỹ năng** theo mục đích: sinh tồn, săn thú, giao đấu. Không tự chuyển cổ ra khỏi cơ thể để né phí nuôi.
- Gợi ý thiếu vai trò bằng câu cụ thể, chẳng hạn “không có cách hồi phục khi giao chiến”; không ép người chơi phải đủ một bộ mẫu.
- Trước hợp luyện, hiện nguyên liệu sẽ mất, cổ đầu ra và tác động lên bộ đang dùng. Sau thất bại có biên nhận rõ.
- Đầu Q2 là bài toán chọn cổ nào đáng giữ. Hiện số lượt cầm cự theo dữ liệu thức ăn; không giả định mọi cổ dùng chung nguyên thạch nếu nội dung đòi nguồn khác.
- Lực đạo dựa trên `luc.js`: giải thích thú lực đang khắc, tác dụng Toàn Lực Ứng Phó và lý do bộ cổ mới khác bộ Q1. Không biến mỗi thú ảnh thành vật phẩm cộng chỉ số giống nhau.

Nghiệm thu: tải lại không thay đổi dự báo; cổ chết hoặc bị luyện mất không để lại nút kỹ năng trỏ sai index; đói/thương tổn ảnh hưởng đúng cả RT và lượt.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-5-g4--quan-hệ-có-lý-do-và-phạm-vi-p1"></a>
### 5. G4 — Quan hệ có lý do và phạm vi (P1)

Giữ `S.rel` để tránh thay toàn bộ hệ cũ. Thêm sự kiện quan hệ: ai biết việc gì, ai mắc nợ ai, điều kiện bảo lãnh, lời hứa còn hiệu lực. Hiển thị “đã giúp che thân phận” thay vì chỉ “+10 thân mật”.

Mỗi NPC trọng tâm có mục tiêu, giới hạn và 2–3 trạng thái quan hệ. Phương Chính đánh giá việc cứu người; phe Xích/Mạc quan tâm lợi ích; Tâm Từ nhớ hành động với người trong đoàn; Bạch Ngưng Băng có lợi ích và bí mật riêng. Một thanh thiện cảm không đủ giải quyết mọi nhân vật.

Phân biệt điều người chơi đọc được, điều Phương Nguyên biết và điều NPC biết. Cảnh chuyển sang Trung Châu không tự cấp kiến thức cho nhân vật chính nếu chưa có lý do trong truyện.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-6-g5--nhân-quả-xuyên-chương-p0"></a>
### 6. G5 — Nhân quả xuyên chương (P0)

Hiện `later()` dùng lượt tương đối, còn `enterChapter()` đặt lại `S.later`. Vì thế nội dung mới không được dựa vào hàng đợi này để hứa hậu quả ở chương kế.

Thiết kế thêm hàng đợi `S.story.pending` độc lập cho hậu quả xuyên chương. Giữ `S.later` cho sự kiện trong chương để hạn chế migration. Mỗi mục gồm `id`, `sourceChoice`, `targetBook`, `targetChapter`, cửa sổ lượt, điều kiện bằng khóa dữ liệu và trạng thái `pending/resolved/expired`. Không lưu closure trong JSON.

Ví dụ: giữ Trương Trụ sống ở thương đội → thêm mục phản hồi tại Thương gia thành → khi vào thành kiểm tra còn sống và đã gặp Tâm Từ → mở lời giới thiệu khác. Nếu không đủ điều kiện, ghi nguyên nhân đóng nhánh; không gọi NPC đã chết.

Mỗi chuỗi có một kết quả chính thay cho nhiều boolean đối nghịch. Khi chuyển đổi các cờ cũ, dùng adapter và bảng ưu tiên rõ; chưa xóa ngay các cờ còn được cảnh cũ đọc.

Nghiệm thu: qua chương, tua nhanh, load lại và trùng sinh đều xử lý đúng lịch; hậu quả mỗi ID áp dụng một lần trong đúng dòng thời gian; rollback khôi phục cả việc đã/đang chờ giải quyết, không giữ phần thưởng của tương lai.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-7-g6--dị-số-và-ký-ức-đáng-chơi-lại-p2"></a>
### 7. G6 — Dị số và ký ức đáng chơi lại (P2)

Tận dụng `VARIANTS`, `varOmen()`, ký ức và tua nhanh hiện có. Dị số nên đổi hoàn cảnh, nhân chứng, giá cả hoặc lối tiếp cận; tránh cộng sát thương địch để trừng phạt người chọn khác nguyên tác.

Sau kiếp, cho xem ba nguyên nhân lớn dẫn tới kết cục và hai đầu mối có thể thử. Không tiết lộ toàn bộ đáp án của cảnh chưa gặp. Tua nhanh chỉ đi qua đoạn đã biết và không bỏ quyết định mới do dị số hay trạng thái quan hệ thay đổi.

Q2 giữ phân biệt chết thật, chơi lại và Xuân Thu Thiền theo luật hiện tại. Thông tin ngoài game không được vô tình ghi vào `S.mem` sau restart.

<a id="source-docs-undone-big-update-q1-q2-01-gameplay-md-8-hợp-đồng-kỹ-thuật-và-nghiệm-thu-chung"></a>
### 8. Hợp đồng kỹ thuật và nghiệm thu chung

Điểm sửa chính: `engine.js` xử lý hành động/kết quả; `events.js` và `q2/ch*.js` khai báo nội dung; `butterfly.js` nhân quả; `rt.js`/`auto.js` chiến đấu và bot; `q2/core.js` chuyển chương; `ui.js` trình bày.

Trước mở rộng, mô tả schema kết quả gồm ID lựa chọn, thay đổi tài nguyên, trạng thái NPC, hậu quả, điều kiện mở tiếp. UI và hiệu ứng đọc kết quả đó; không tự trừ thạch hay cấp cổ. Có thể bọc dần `eff/ok/fail/AFTER` hiện hữu, không cần đổi mọi event cùng lúc.

Save mới cần `schemaVersion` riêng, không tận dụng `S.v` nếu chưa rà ý nghĩa hiện tại. Migration giữ bản sao save đầu vào, có mặc định cho trường mới và validate book/chapter/event/cổ. Load lỗi phải hiện cách phục hồi, không ghi đè dữ liệu gốc. Lệnh nhập save kiểm tra cấu trúc; nội dung người dùng được escape khi hiển thị.

Hoàn thành gameplay khi: không có softlock; lựa chọn nghèo tài nguyên vẫn có lối tiếp tục hợp lệ; thắng/thua/rút đều có phản hồi; không nhân đôi thưởng; không bán/luyện mất vật bắt buộc mà không cảnh báo hoặc đường thay thế đã thiết kế.

---

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md"></a>

## 02_UI_UX.md

**Trạng thái:** Đề xuất tổng thể, một số nền đã triển khai; chưa nghiệm thu toàn bộ phạm vi.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-uiux-đọc-được-thế-cục-thao-tác-gọn"></a>
## UI/UX: đọc được thế cục, thao tác gọn

Trạng thái: đề xuất dựa trên `index.html`, `ui.js`, `present.js`, `rt.js`, `q2/core.js`; chưa có vòng kiểm chứng trực quan trong trình duyệt. Xem [tổng thể](README.md).

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-1-định-hướng-thị-giác"></a>
### 1. Định hướng thị giác

Giữ thủy mặc, giấy cũ và ấn triện. Dùng nền tối ổn định sau văn bản; mực đen/xám cho nội dung, ngọc cho chân nguyên, đỏ cho nguy hiểm, vàng nhạt cho cơ hội. Màu luôn đi kèm biểu tượng và chữ. Chữ thư pháp dành cho tiêu đề; thân bài dùng font dễ đọc, đủ dấu tiếng Việt.

Q1 dùng trúc xanh, đá xám, đèn vàng; Q2 đổi bảng màu theo chương. Không phủ mọi cảnh bằng một bộ nền/khói chung. Chỉ đánh giá chất lượng tranh sau khi kiểm tra asset thực tế, không mặc định cần thay tất cả.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-2-u1--bố-cục-chính-p1"></a>
### 2. U1 — Bố cục chính (P1)

Desktop rộng: HUD trên; bản đồ/cảnh ở giữa; cột gọn bên phải cho mục tiêu và nguy cơ; nhật ký gần đây ở dưới. Khi chiến đấu, vùng giữa và cột phải chuyển thành đấu trường và điều khiển trận.

```text
[Quyển · Chương · Lượt] [Cảnh giới] [Khí huyết] [Chân nguyên] [Thạch]
[                 Bản đồ / Cảnh                 ] [Mục tiêu hiện tại]
[                                              ] [Mốc sắp đến     ]
[                                              ] [Cổ cần chăm sóc]
[Việc còn lại] [Hành động theo ngữ cảnh] [Kết thúc lượt]
[Kết quả gần nhất / Nhật ký]      [Cổ] [Nhân vật] [Quan hệ] [Thiết lập]
```

Mobile: một cột; tài nguyên quan trọng luôn thấy, thông tin sâu mở bottom sheet; thanh điều hướng ở đáy. Không thu nhỏ nguyên bố cục desktop. Cỡ chữ nội dung khởi điểm 16–18px, vùng bấm tối thiểu 44px, có kiểm tra màn rộng 360/390/768/1280px.

HUD chỉ giữ khí huyết, chân nguyên, thạch, lượt và số việc. Các chỉ số tâm cơ/sát phạt/ngộ tính nằm trong nhân vật và xuất hiện cạnh lựa chọn khi liên quan. Chạm thanh chân nguyên để xem hồi phục/chi phí; chạm thạch để xem thu–chi dự kiến.

Nghiệm thu: nhìn màn chính biết còn bao nhiêu việc, mốc nào chờ xử lý và cổ nào sắp chết đói; không phải mở ba bảng.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-3-u2--bản-đồ-và-mốc-truyện-p1"></a>
### 3. U2 — Bản đồ và mốc truyện (P1)

- Điểm đến có bốn trạng thái: mở, có chuyện mới, cần điều kiện, đang không thể tới. Mỗi trạng thái có ký hiệu và lời giải thích.
- Trước khi bấm: hiện chi phí việc, rủi ro đã biết và mục đích chuyến đi. Không hiển thị chiến lợi phẩm bí mật chưa khám phá.
- Mốc bắt buộc đang chờ phải phân biệt với chuyện phụ. Nút qua lượt tóm tắt việc đang bỏ qua; chỉ yêu cầu xác nhận khi thực sự bỏ lỡ cơ hội không thể quay lại.
- Q1 có bản đồ vùng với điểm hậu sơn mở dần. Q2 có tuyến hành trình chín chương và bản đồ địa phương; không dùng thời gian chương để vô tình hiện báo động lang triều Q1.
- Đã đọc nhưng chưa làm được hiển thị điều kiện thiếu. Điểm tĩnh dưỡng ghi hiệu quả dự kiến từ trạng thái thật.

Điểm kỹ thuật: `renderMap2()` đang dùng `mapMood()` chung; hàm này có quy tắc theo lượt/mốc Q1. Tách ngữ cảnh book/chapter khi làm hệ bản đồ mới.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-4-u3--hội-thoại-và-lựa-chọn-p1"></a>
### 4. U3 — Hội thoại và lựa chọn (P1)

Thẻ cảnh có địa điểm, người nói, đoạn văn ngắn, lựa chọn, lịch sử hội thoại thu gọn. Một màn lựa chọn ưu tiên 2–4 phương án có khác biệt. Dùng “đọc tiếp” cho văn dài; cho hiện hết chữ ngay và nhớ tùy chọn tắt typewriter.

Lựa chọn hiển thị bốn loại thông tin khi có: mục đích, chi phí chắc chắn, điều kiện, rủi ro đã biết. Ví dụ: “Nhờ Mạc gia bảo lãnh — chịu một món nợ; cần đã giúp Mạc Bắc”. Không ghi chắc phần thưởng khi đó mới là kết quả xác suất.

Phương án khóa vẫn đọc được lý do. Một số bí mật chưa biết có thể ẩn hoàn toàn, nhưng phải ghi quy tắc biên tập để tránh cả màn không còn lựa chọn. Nhãn nguyên tác tuân theo luật khám phá/ký ức hiện có; không bật đáp án ngay ở lần đầu.

Sau chọn, một biên nhận kết quả trình bày: chuyện vừa xảy ra, tài nguyên thay đổi, ai phản ứng, việc mới mở. Giữ thẻ kết quả hiện hữu làm nền; tránh toast, log và thẻ cùng lặp toàn bộ một đoạn văn.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-5-u4--giao-diện-trận-p1"></a>
### 5. U4 — Giao diện trận (P1)

Thứ tự ưu tiên: **mục tiêu → ý đồ địch → tình trạng bản thân → nút hành động → hiệu ứng trang trí**.

- Mục tiêu riêng nằm cố định đầu đấu trường: “Giữ tuyến 18/30 giây”, “Đường thoát 60%”; không giấu trong log.
- Thanh vận chiêu của địch ghi tên, tầm ảnh hưởng và khả năng ngắt nếu đã biết; màu không phải tín hiệu duy nhất.
- Ba tầm hiện thành một dải vị trí. Di chuyển có nhãn đích và thời gian, không buộc người dùng suy ra từ chân dung.
- Kỹ năng hiện phí chân nguyên thực tế, cooldown và lý do không dùng được. Cổ đói/thương tổn có badge riêng.
- Tạm dừng/tốc độ luôn truy cập được. Mobile dùng thanh kỹ năng dễ chạm; không phụ thuộc hover hoặc phím tắt.
- Cuối trận giải thích mục tiêu đã hoàn thành, thương tổn cổ, chi phí và ảnh hưởng tới cảnh tiếp theo.

Kiểm tra đổi tab trình duyệt, mở menu, load lại và animation dài: người chơi không mất máu trong lúc buộc đọc UI. Có sẵn logic bỏ tick tab ẩn; nghiệm thu tiếp các lớp overlay mới.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-6-u5--kho-cổ-công-thức-và-quan-hệ-p1p2"></a>
### 6. U5 — Kho cổ, công thức và quan hệ (P1/P2)

Kho cổ lọc theo công dụng/chuyển/tình trạng; có chế độ danh sách gọn trên mobile. Chi tiết cổ giải thích vì sao không thể dùng, cách nuôi và nguồn đã biết. So sánh công thức bằng “mất gì → nhận gì”, gồm kỹ năng sắp biến mất. Pin tối đa ba mục tiêu tìm cổ/nguyên liệu vào nhật ký.

Quan hệ hiện người đã gặp, việc gần nhất, món nợ/lời hứa và câu chuyện đang mở. Không hiện sơ đồ biết trước tất cả nhân vật. Nhật ký chia mốc chính, việc phụ và manh mối bằng bộ lọc; mỗi mục chỉ rõ “còn thời hạn”, “chờ”, “đã kết thúc”, “không còn khả thi”.

Cuối quyển có trang hành trình: kết cục, ba quyết định lớn, người còn sống theo nhánh, cổ được chuyển tiếp. Q2 hiển thị đúng phạm vi nút chơi lại; hiện `q2WinHTML()` ghi “chương này” trong khi `restartChapter()` khôi phục đầu Q2 — cần thống nhất nội dung UI với hành vi thật.

<a id="source-docs-undone-big-update-q1-q2-02-ui-ux-md-7-khả-năng-tiếp-cận-và-triển-khai"></a>
### 7. Khả năng tiếp cận và triển khai

Hỗ trợ bàn phím đầy đủ, focus rõ, đóng modal bằng Escape và trả focus về nút mở. Text/biểu tượng đủ tương phản; kiểm tra không màu; log biến động không đọc dồn mọi khung hình qua screen reader. Reduced motion áp dụng xuyên CSS, canvas, PixiJS và typewriter.

Tách CSS theo khối trong `index.html` trước; có thể chuyển sang file CSS riêng sau khi giao diện ổn định. Render cập nhật phần đổi thay vì dựng lại mọi vùng theo tick. Nếu thay `innerHTML` tại `rtRender()`, bảo toàn focus và tránh làm người đang dùng bàn phím mất điểm chọn.

Nghiệm thu: không tràn ngang ở 360px; zoom 200% vẫn thao tác; mọi nút có tên rõ; cảnh dài vẫn đọc được với bàn phím ảo; load ảnh lỗi có placeholder; người mới hoàn thành vòng khai khiếu → hành động → trận → kết quả mà không cần hướng dẫn ngoài game.

---

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md"></a>

## 03_EFFECT_AUDIO.md

**Trạng thái:** Đề xuất tổng thể, một số nền đã triển khai; chưa nghiệm thu toàn bộ phạm vi.

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-hiệu-ứng-và-âm-thanh-mỗi-hệ-cổ-có-cảm-giác-riêng"></a>
## Hiệu ứng và âm thanh: mỗi hệ cổ có cảm giác riêng

Trạng thái: đề xuất, chưa tạo asset. Nền hiện có: `battle.js`/PixiJS, `living.js`, `present.js`, `aperture.js`, `sound.js`. Xem [tổng thể](README.md).

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-1-e1--ngôn-ngữ-hiệu-ứng-dùng-chung-p1"></a>
### 1. E1 — Ngôn ngữ hiệu ứng dùng chung (P1)

Mỗi kỹ năng đi qua ba nhịp: báo hiệu → tác động → dư âm. Thời điểm báo hiệu và trúng đòn lấy từ logic trận, không từ độ dài video/animation. VFX đọc sự kiện kết quả; bật/tắt VFX không thay damage hay RNG gameplay.

| Nhóm | Hình dạng và chuyển động | Âm sắc | Tín hiệu gameplay |
|---|---|---|---|
| Nguyệt đạo | Lưỡi mực cong xanh nhạt, đường bay sắc | Gió rít ngắn | Hướng và thời điểm đòn tới |
| Băng/thủy | Rạn tinh thể, màn sương ở rìa | Kính lạnh, nước nén | Đóng băng/hộ thể phân biệt bằng icon |
| Huyết | Sợi đỏ sẫm, mực thấm lan | Nhịp trầm, âm hút | Chảy máu/hút sinh lực; không phủ chữ |
| Lôi | Nhánh điện ngắn, vùng báo trước | Điện khô, một đỉnh âm | Đòn diện rộng/choáng |
| Cốt | Mảnh trắng ngà, đường xuyên thẳng | Va đập khô | Xuyên/va chạm khác nguyệt nhận |
| Lực đạo | Thú ảnh thoáng qua sau lưng, sóng bụi | Trống trầm theo thú lực | Loại thú lực hoặc cú toàn lực vừa kích hoạt |
| Xuân Thu Thiền | Dòng mực đảo hướng, đồng hồ/cánh ve | Tiếng ve và âm nền bị kéo ngược | Bắt đầu/kết thúc quay ngược rõ ràng |
| Định Tiên Du | Cánh bướm ngọc, khung cảnh mở dần | Nốt sáng rồi khoảng lặng | Chuyển địa điểm sau kết quả thành công |

Ưu tiên 12 mẫu tái sử dụng: chém, đâm, quyền, hộ thể, đỡ chuẩn, ngắt vận chiêu, lộ sơ hở, hồi phục, độc/chảy máu, cổ trọng thương, cổ chết, rút lui. Biến thể theo nhóm cổ tạo cảm giác phong phú mà không cần một animation riêng cho mọi con.

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-2-e2--cao-trào-quyển-1-p1"></a>
### 2. E2 — Cao trào Quyển 1 (P1)

| Cảnh | Dàn dựng đề xuất | Điểm người chơi còn tương tác |
|---|---|---|
| Khai khiếu | Dòng nguyên hải hình thành, ấn tư chất hiện gọn | Xem giải thích và tiếp tục; không chờ diễn lâu |
| Vách Hoa Tửu | Hình lưu ảnh nổi lên từng lớp, tiếng nước nhỏ | Chọn quan sát/khai thác/rời đi |
| Kim Sinh và điều tra | Đèn hẹp, chân dung đổi sắc, khoảng lặng trước lời khai | Lựa chọn quyết định nằm rõ giữa cảnh |
| Lang triều | Bóng sói ngoài tường, bụi đá, lớp âm xa → gần | Đọc mục tiêu giữ tuyến và dùng kỹ năng |
| Thanh Thư/Mộc Mị | Rễ lan ở rìa, chân dung đổi trạng thái | Cứu/chi viện/rút theo nhánh; hiệu ứng phản ánh kết quả |
| Huyết động và băng phong | Chuyển bảng màu theo pha, cảnh đóng băng panorama | Quyết định cuối, xem kết cục, kiểm kê trước Q2 |

Không phát cảnh hi sinh nếu nhánh đã cứu nhân vật. Mỗi đoạn điện ảnh có “bỏ qua”; bỏ qua phải hoàn tất chuyển tiếp đúng một lần.

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-3-e3--bản-sắc-chín-chương-q2-p1p2"></a>
### 3. E3 — Bản sắc chín chương Q2 (P1/P2)

| Chương | Lớp cảnh/âm chủ đạo | Cao trào cần riêng |
|---|---|---|
| Hoàng Long | Nước đục, bè trôi, gió sông, lạnh | Cổ đói và mất nguồn lực, tiếng nền thưa dần |
| Bạch Cốt | Đá trắng, bụi xương, tiếng vọng | Mật thất và Cốt Nhục Đoàn Viên |
| Thương đội | Đèn lều, bánh xe, tiếng người xa | Thú tập kích và đêm cương thi |
| Thương gia thành | Phố nhiều lớp, biển hiệu, tiếng chợ | Đấu trường và đấu giá |
| Thiếu chủ | Bàn sổ sách, đèn ấm, nhịp âm tiết chế | Công bố kết quả tranh quyền |
| Tam Xoa | Ba cột sáng với hình/icon khác nhau | Bước vào từng truyền thừa |
| Ngũ chuyển | Bầu trời biến sắc, trường âm trầm | Cự đầu xuất hiện; cho cảm giác áp đảo |
| Bá Quy | Rùa đá và vết rạn, lửa vạc, nhịp thiếu ổn định | Tiên nguyên cạn và kế hoạch luyện cổ |
| Điện luyện cổ | Xích sắt, rạn không gian, ve/bướm ngọc | Phản bội → quay ngược → Định Tiên Du → Hồ Tiên |

Ưu tiên biến thể ánh sáng/lớp nền của asset có sẵn. Chân dung mới tập trung nhân vật ở cảnh có nhiều tương tác; mỗi NPC trọng tâm cần trung tính, căng thẳng và biến thể trạng thái thật sự dùng tới.

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-4-e4--âm-thanh-có-phân-lớp-p1"></a>
### 4. E4 — Âm thanh có phân lớp (P1)

Mở rộng Web Audio hiện có với ba kênh: môi trường, giao diện, chiến đấu/nhạc. Có âm lượng riêng và nút mute tổng được nhớ. Mở audio sau thao tác người dùng, xử lý suspend/resume của browser.

Môi trường theo địa điểm; nhạc đổi ở mốc có ý nghĩa, crossfade thay vì khởi động lại mỗi render. Địch vận chiêu, đỡ chuẩn và cổ trọng thương có âm riêng. Nguy hiểm luôn có tín hiệu thị giác tương đương. Giới hạn âm phát đồng thời; tránh nhiều sát thương nhỏ tạo tiếng chồng gây mệt.

Màn tử vong để một khoảng lặng trước tiếng ve nếu được trùng sinh. Cảnh chết thật Q2 có kết thúc khác; âm thanh không được hứa một lần quay ngược không tồn tại.

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-5-e5--chất-lượng-và-ngân-sách-p0p1"></a>
### 5. E5 — Chất lượng và ngân sách (P0/P1)

Đã có reduced motion trong `battle.js`, một số CSS, và giảm tải theo FPS. Mở rộng thành tùy chọn Nhẹ/Vừa/Đầy đủ; Auto là lựa chọn ban đầu. Mục tiêu thử nghiệm: desktop khoảng 60 FPS, mobile tối thiểu 30 FPS ở cảnh nặng, với thiết bị và độ phân giải ghi trong báo cáo.

- Giới hạn thử ban đầu: 60 hạt ở Nhẹ, 150 ở Vừa, 300 ở Đầy đủ cho một đấu trường; điều chỉnh sau đo.
- Không tạo texture/filter mới mỗi tick. Pool đối tượng thường dùng, giới hạn DPR trên máy yếu, hủy ticker/listener/âm khi thoát cảnh.
- Tải asset theo chương; preload cảnh sắp tới, không preload toàn bộ hai quyển ở menu.
- Mục tiêu animation giao diện 120–250ms; đòn theo nhịp logic; cao trào 3–8 giây có skip. Đây là ngân sách thiết kế, không áp dụng để kéo dài trận.
- Reduced motion bỏ shake, zoom giật và hạt nhanh; giữ icon, thanh tiến độ và lời báo. Có tùy chọn giảm chớp sáng riêng.
- Quay 20 lần bản đồ → trận → kết quả → bản đồ để tìm texture/listener rò rỉ; theo dõi bộ nhớ có tiếp tục tăng hay không.

<a id="source-docs-undone-big-update-q1-q2-03-effect-audio-md-6-asset-và-cách-nghiệm-thu"></a>
### 6. Asset và cách nghiệm thu

Tạo inventory trước sản xuất: khóa asset, file, cảnh dùng, kích thước, nguồn/license, biến thể, placeholder. Dùng `asset()` và quy tắc công khai/cá nhân hiện hữu; kế thừa [KE_HOACH_NGUON_ASSET_CHUAN.md](../KE_HOACH_ASSET_Q1_Q2.md#source-ke-hoach-nguon-asset-chuan-md) và [KE_HOACH_ASSET_QUYEN_2.md](../KE_HOACH_ASSET_Q1_Q2.md#source-ke-hoach-asset-quyen-2-md). Không đưa đường dẫn `assets/local/` thành điều kiện bắt buộc để chơi.

Thứ tự sản xuất: bộ 12 VFX cơ sở → một trận Q1 và một trận Q2 mẫu → cảnh lang triều/điện luyện cổ → môi trường còn lại → portrait phụ. Không cần tạo toàn bộ tranh trước khi biết UI đặt ảnh thế nào.

Nghiệm thu: cùng save/seed và hành động, bật/tắt/skip hiệu ứng cho cùng kết quả; tiếng không tự phát trước tương tác; thiếu ảnh vẫn chơi được; lớp hiệu ứng không chắn nút; tắt rung không mất dấu hiệu địch sắp đánh; tạm dừng không tích lũy burst khi tiếp tục.

---

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md"></a>

## 04_CONTENT_QUYEN_1.md

**Trạng thái:** Đề xuất tổng thể, một số nền đã triển khai; chưa nghiệm thu toàn bộ phạm vi.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-làm-giàu-quyển-1-thanh-mao-sơn-có-đời-sống-và-trí-nhớ"></a>
## Làm giàu Quyển 1: Thanh Mao Sơn có đời sống và trí nhớ

Trạng thái: đề xuất. Nguồn chuẩn bắt buộc: [CHI_TIET_NGUYEN_TAC_Q1.md](../../reference/CHI_TIET_NGUYEN_TAC_Q1.md); phần bàn giao Q2 đối chiếu thêm [CHI_TIET_NGUYEN_TAC_Q2.md](../../reference/CHI_TIET_NGUYEN_TAC_Q2.md). `js/events.js` và kế hoạch cũ chỉ phản ánh triển khai/ý tưởng, không quyết định canon. Các kết quả lựa chọn mới là **nhánh giả định hoặc chuyển thể gameplay**, không mặc nhiên là nguyên tác. Xem [tổng thể](README.md).

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-1-phạm-vi-và-nhịp-kể"></a>
### 1. Phạm vi và nhịp kể

Giữ khung 27 tuần làm baseline, không ép thêm tuần để chứa content. Chia thành sáu cụm biên tập; lịch thật lấy từ `S.canon`, kể cả khi dị số đẩy mốc. Tránh hardcode chuỗi phụ vào tuần mà mốc chính có thể đã dịch.

Mục tiêu toàn đợt: nâng sâu 12 mốc đã có; tám chuỗi phụ, mỗi chuỗi 3–4 cảnh; 12 vignette đời sống ngắn; sáu encounter chiến thuật được tuyển chọn từ trận hiện có. Những con số là ngân sách biên tập, không phải số content đang thiếu; rà trùng trước khi viết. Một lượt không dồn quá một cảnh dài bắt buộc và một phản hồi ngắn, trừ hồi kết có chủ ý.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-2-sáu-cụm-nội-dung"></a>
### 2. Sáu cụm nội dung

| Cụm | Trải nghiệm | Mốc ưu tiên nâng cấp | Hệ quả cần theo dõi |
|---|---|---|---|
| Khai khiếu và học đường | Tư chất thấp nhưng có kinh nghiệm | Khai khiếu, nhận cổ, tranh tài nguyên học đường | Ai sợ, ai nể, ai báo lại gia tộc |
| Hoa Tửu và thương đội | Kiến thức là tài sản phải giữ kín | Dò hang, Tửu Trùng, đổ thạch, Kim Sinh | Lộ bí mật, người chứng kiến, đường lui |
| Gia sản và phe phái | Lợi ích đi kèm món nợ | Cậu mợ, Trầm Thúy, Xích/Mạc, tổ đội | Nguồn thu, bảo lãnh, nghĩa vụ chưa trả |
| Truyền thừa và địch thủ | Sức mạnh đến từ bộ cổ hợp tình huống | Thạch Hầu Vương, Cường Thủ, gặp BNB | Ai biết chiến lực thật, cổ thu được/mất đi |
| Lang triều và gia lão | Quyết định dưới áp lực cứu người/giữ lợi | Chuẩn bị, Thanh Thư, luận công, phòng tuyến | Thương vong, uy tín, thiếu thuốc, nợ cứu mạng |
| Điều tra và băng phong | Các quyết định cũ cùng quay lại | Thiết gia, huyết động, Nhất Đại, kết cục | Nhân chứng, lối thoát, người đồng hành, kho cổ Q2 |

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-3-tám-chuỗi-phụ-có-đầu-và-cuối"></a>
### 3. Tám chuỗi phụ có đầu và cuối

Các mã `Q1-S*` là ID thiết kế, chưa phải ID trong `EV`. Sau inventory, mở rộng event hiện hữu phù hợp thay vì thêm chuỗi trùng nội dung.

| ID / chuỗi | Điều kiện mở | Ba nhịp | Đánh đổi / kết quả |
|---|---|---|---|
| Q1-S1 — Giá của một lời bảo lãnh | Đã gặp phe Xích/Mạc | Làm việc nhỏ → được che chở → bị đòi đáp lễ | Mở lựa chọn điều tra nhưng mất quyền tự do ở một nhiệm vụ |
| Q1-S2 — Lá thuốc cuối cùng | Có nguồn thuốc/đã gặp tuyến y đường | Thiếu thuốc → chọn người nhận → gặp lại sau lang triều | Thu nhập tức thì hoặc người giúp sơ tán; không thưởng cả hai miễn phí |
| Q1-S3 — Tin đồn về Tửu Trùng | Đã lộ việc có cổ quý | Tin đồn → người dò giá → thử giữ bí mật | Chuyển điểm bán, mất thời gian hoặc lộ người biết hang |
| Q1-S4 — Gia sản dưới tay ai | Đã mở tuyến cậu mợ | Xem sổ thu → chọn bán/giữ/nhờ quản → kiểm kê | Nguồn thu khác nhau; trả đúng hệ quả trong cảnh về gia sản |
| Q1-S5 — Khoảng cách hai anh em | Phương Chính còn trong tuyến | Tranh chấp → thử hợp tác → lựa chọn lúc nguy cấp | Cứu không đồng nghĩa hòa giải; thái độ dựa cả hành động trước |
| Q1-S6 — Một ca gác của Thanh Thư | Trước lang triều, đã gặp | Đi tuần → thấy lỗ hổng → chọn chuẩn bị | Mở đường cứu/giữ tuyến, không bảo đảm cứu thành công |
| Q1-S7 — Người biết lối núi | Mở hoạt động săn | Dò bẫy → trao đổi/đe dọa → hậu quả người biết bí mật | Bản đồ giúp tránh địch; nhân chứng và quan hệ phải nhất quán |
| Q1-S8 — Nhân chứng sau cơn mưa | Vụ Kim Sinh có kết quả | Dấu vết → lời kể khác nhau → đối chất | Bằng chứng/uy tín tác động Thiết gia; nhánh không giết có nội dung riêng |

Mỗi chuỗi: một phần thưởng thực dụng, một biến đổi quan hệ/thế giới, một câu gọi lại ở cảnh sau. “Tăng tâm cơ +1” không đủ làm kết thúc chuỗi. Cho phép thất bại có hậu quả và kết thúc hợp lệ.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-4-ba-cảnh-mẫu-đủ-để-dựng-bản-chơi-thử"></a>
### 4. Ba cảnh mẫu đủ để dựng bản chơi thử

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-q1-m1--kim-sinh-lựa-chọn-trước-khi-có-án"></a>
#### Q1-M1 — Kim Sinh: lựa chọn trước khi có án

Mở từ `c_kimsinh`, dùng kết quả/nhánh hiện hữu làm nền. Nhịp 1 quan sát trò lừa và người chứng kiến; nhịp 2 chọn tiếp cận; nhịp 3 giải quyết; nhịp 4 nhận hệ quả sau khi thương đội rời đi.

| Cách chọn | Lợi ích | Cái giá / cảnh trả kết quả |
|---|---|---|
| Dẫn vào hang theo tuyến đã có | Giữ quyền quyết định với kẻ tham bí mật | Nguy cơ lộ dấu vết; cảnh điều tra đọc đúng chứng cứ |
| Vạch trần trước người khác | Có người nhớ mình giúp tộc nhân | Mất cơ hội giao dịch kín; mở bảo lãnh nhưng tạo thù |
| Rút lui, cắt tiếp xúc | Bảo toàn tình trạng hiện tại | Bí mật có thể bị dò tiếp nếu đã lộ; không tự gán tội giết |

Hợp đồng chuỗi: giữ một kết quả chính; danh sách người biết và bằng chứng đã xử lý tách riêng. `c_dieutra`, `c_thiet` và hồi kết đều đọc cùng kết quả. Nghiệm thu ba route tới điều tra, gồm save/load sau lựa chọn nhưng trước hậu quả.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-q1-m2--lang-triều-một-khoảng-thời-gian-hai-việc-cần-cứu"></a>
#### Q1-M2 — Lang triều: một khoảng thời gian, hai việc cần cứu

Trong cảnh canh phòng, báo hai nhu cầu đồng thời: giữ lối rút cho đội tuần tra và mang thuốc cho người bị thương. Nếu đã chuẩn bị ở Q1-S2/S6, có thể phân công; nếu chưa, phải ưu tiên một mục tiêu.

Kết quả trận có mức: giữ tuyến thành công; rút có trật tự nhưng mất vật tư; tan tuyến và chịu tổn thất. Cảnh luận công ghi nhận đúng điều đã làm. Nhánh cứu Thanh Thư được đặt điều kiện và trả giá rõ; nhánh hi sinh có hậu sự và phản ứng Phương Chính, không chỉ một dòng thông báo.

Nghiệm thu: không bắt buộc có một cổ hiếm mới thắng; thuốc đã dùng không trở lại khi load; nhân vật đã chết không xuất hiện trong cảnh bình thường sau đó.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-q1-m3--huyết-động-mang-gì-ra-khỏi-núi"></a>
#### Q1-M3 — Huyết động: mang gì ra khỏi núi

Trước hồi kết, một màn rà soát cho thấy lối thoát đã biết, cổ đang sở hữu, người có thể đi cùng và chuyện chưa giải quyết. Không biến thành cửa hàng phát bộ cổ chuẩn.

Trong các quyết định cuối, phân biệt tìm đường, đoạt lợi và bảo toàn người đồng hành; chi phí dựa vào trạng thái đã tích lũy. Cảnh sau phản ánh cổ thật còn lại. Kết cục giả định ghi nhãn trong nhật ký sau khi người chơi trải qua.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-5-đời-sống-và-môi-trường-phản-ứng"></a>
### 5. Đời sống và môi trường phản ứng

12 vignette đề xuất chia đều cho học đường, tửu quán, chợ, y đường, trại sau lang triều và lối núi. Mỗi vignette khoảng 40–90 từ, tối đa một quyết định nhanh; ví dụ học viên đổi đường khi thấy người từng chặn cổng, quầy thuốc trống sau đợt cứu thương, người nhà nạn nhân hỏi chuyện.

Biến thể lời thoại dựa trên điều NPC thực sự biết. Dùng chúng để cho thấy hậu quả, không tăng chỉ số ở mọi lần ghé. Có cooldown và cờ đã xem; nội dung lặp phải ngắn hơn lần đầu.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-6-cầu-nối-q1--q2"></a>
### 6. Cầu nối Q1 → Q2

`Q2_GATE` hiện cho phép `ma`, `bai_dong`, `huyetlo`, `huyetlo_bai`, `tien_lo`, `phan_toc`. Kiểm tra từng kết cục thay vì mặc định mọi ending đều sang Q2.

Trước `startQ2()`, biên nhận phải giải thích: vì sao cảnh giới thay đổi theo chuyển cảnh, tư chất áp dụng, cổ mang được/không còn, quan hệ BNB và tài nguyên ban đầu. `q2Inherit()` là nơi đối chiếu kho thật; đường vào thẳng từ menu là preset thử riêng, cần ghi rõ.

Thiết kế thêm hồ sơ nguồn gốc tối thiểu: kết cục Q1, 3–5 quyết định quan trọng và người còn liên quan. Chỉ mang những dữ kiện có cảnh Q2 sử dụng; không kéo toàn bộ flags Q1 vào Q2 không kiểm soát.

<a id="source-docs-undone-big-update-q1-q2-04-content-quyen-1-md-7-tiêu-chí-hoàn-thành-q1"></a>
### 7. Tiêu chí hoàn thành Q1

- Mỗi mốc nâng cấp có ít nhất hai cách xử lý khác nhau về chi phí hoặc hậu quả, không chỉ đổi câu chữ.
- Cả tám chuỗi có điều kiện mở/đóng, hạn nếu có, nhánh thất bại và cảnh trả kết quả; không bắt buộc gặp cả tám trong một kiếp.
- Sáu encounter có mục tiêu dễ hiểu và kiểm thử RT/lượt. Không thay nguyên tắc sức mạnh bằng boss tự giảm máu vô lý.
- Không có người chết xuất hiện lại, kết cục mâu thuẫn lựa chọn hoặc trách nhiệm án mạng bị gán sai.
- Nhánh lệch đi tới kết cục được thiết kế với khó khăn riêng; không bị khóa toàn bộ nội dung hay tăng độ khó vô cớ.
- Mô phỏng và playtest ghi lại nhịp gặp cảnh, lượng thạch/cổ, tỷ lệ qua từng mốc; đủ dữ liệu mới chốt cân bằng.

---

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md"></a>

## 05_CONTENT_QUYEN_2.md

**Trạng thái:** Đề xuất tổng thể, một số nền đã triển khai; chưa nghiệm thu toàn bộ phạm vi.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-làm-giàu-quyển-2-chín-chương-chín-thế-cục"></a>
## Làm giàu Quyển 2: chín chương, chín thế cục

Trạng thái: đề xuất nối tiếp Q2 đã có trong mã. Nguồn chuẩn bắt buộc: [CHI_TIET_NGUYEN_TAC_Q2.md](../../reference/CHI_TIET_NGUYEN_TAC_Q2.md); phần kế thừa đối chiếu thêm [CHI_TIET_NGUYEN_TAC_Q1.md](../../reference/CHI_TIET_NGUYEN_TAC_Q1.md). [KE_HOACH_Q2.md](../BACKLOG_VA_BAN_GIAO_CU.md#source-ke-hoach-q2-md) chỉ tham khảo cách triển khai; chưa xác minh lại nguồn truyện ngoài repo. Mọi lựa chọn và hậu quả mới phải gắn nhãn chuyển thể/giả định phù hợp. Xem [tổng thể](README.md).

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-1-ngân-sách-và-bản-sắc"></a>
### 1. Ngân sách và bản sắc

Giữ chín chương và số lượt hiện tại làm baseline: Hoàng Long 9 tuần, Bạch Cốt 10 tuần, thương đội 12 tuần, thành 14 tháng, thiếu chủ 6 tháng, Tam Xoa 14 tuần, Ngũ chuyển 8 tuần, Bá Quy 10 ngày, điện luyện cổ 3 ngày. Không cộng 96 lượt khác đơn vị thành một thời lượng cốt truyện duy nhất.

Mục tiêu đề xuất: mỗi chương nâng hai mốc hiện có thành cảnh sâu hơn (18 mốc); hai chuỗi phụ ba cảnh/chương (54 cảnh trong kho, không hiện hết trong một lượt chơi); hai vignette/chương (18 đoạn ngắn). Chương 9 chỉ có ba ngày nên chuỗi phụ được gieo từ chương trước và trả kết quả trong cảnh chính. Không tăng mật độ bằng cách nhét sáu popup mới vào ba ngày.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-2-q2-c1--hoàng-long-sống-sót-cùng-người-không-thể-tin-hết"></a>
### 2. Q2-C1 — Hoàng Long: sống sót cùng người không thể tin hết

File: `ch1_hoanglong.js`. Vòng chơi: dò chỗ dừng → chọn kiếm thức ăn/tu luyện/di chuyển → chia nguồn lực → đối mặt nguy cơ.

- Nâng cảnh cổ đói thành quyết định giữ bộ nào với dự báo nuôi cụ thể. Nhu cầu nuôi lấy từ luật thật, không ép chết cổ chỉ để khớp kịch bản.
- Cho chọn điểm dừng có khác biệt: kín nhưng ít thức ăn, dễ kiếm tài nguyên nhưng có thú hoặc dấu người. Đây là chuyển thể bản đồ, cần gắn với các địa điểm đã biên tập.
- Hai chuỗi phụ: **Phần thức ăn cuối** và **Dấu chân sau bãi nghỉ**; kết quả là thỏa thuận chia nguồn lực hoặc thay đổi khả năng bị lần theo.
- BNB phản ứng khi người chơi liên tục giữ lợi về mình; không biến mức quan hệ thành đảm bảo trung thành.

Nghiệm thu: khởi đầu kho nghèo và thiếu Bảo Liên vẫn có đường sinh tồn được giải thích; quyết định bỏ cổ có cảnh báo và không phục hồi cổ qua load.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-3-q2-c2--bạch-cốt-truyền-thừa-là-bài-toán-đường-đi"></a>
### 3. Q2-C2 — Bạch Cốt: truyền thừa là bài toán đường đi

File: `ch2_bachcot.js`. Dùng sơ đồ mật thất mở dần thay cho chỉ một chuỗi tăng chỉ số. Mỗi nhánh có dấu hiệu rủi ro, nguồn lực và cửa rút; lối đúng không chỉ là đoán ngẫu nhiên.

- Hai mốc sâu: khám phá bí mật truyền thừa và quyết định liên quan Cốt Nhục Đoàn Viên.
- Hai chuỗi phụ: **Lời khắc chưa đọc hết** (thông tin/đường tắt) và **Ai đi trước** (vai trò đồng hành/chi phí khám phá).
- Dùng cổ trinh sát/phòng thủ đúng công dụng để mở cách tiếp cận; nếu thiếu cổ, có phương án tốn thời gian hoặc chấp nhận tổn thất đã báo.
- Sau rời núi, ghi rõ ai biết chuyện đã xảy ra và ảnh hưởng tới truy đuổi.

Nghiệm thu: lấy cùng phần thưởng không lặp; rời mật thất không softlock; cơ chế truyền nguyên/đồng tu dùng đúng cổ và trạng thái theo tài liệu đã duyệt.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-4-q2-c3--thương-đội-hàng-hóa-thân-phận-và-lòng-tin"></a>
### 4. Q2-C3 — Thương đội: hàng hóa, thân phận và lòng tin

File: `ch3_thuongdoi.js`; nền có `tradeRun()`, `tamtuVisit()` và mốc Tâm Từ/Trương Trụ/Đinh Hạo. Nâng thương mại từ kết quả lãi/lỗ ngẫu nhiên thành lựa chọn lượng hàng, vốn, tin giá và chỗ tiêu thụ. Chỉ dùng 3–4 nhóm hàng đã có cơ sở trong chương, không dựng một game logistics riêng.

| Quyết định | Được gì | Rủi ro / hậu quả |
|---|---|---|
| Mua hàng theo tin chắc | Biên lợi nhuận dễ dự kiến hơn | Vốn bị giữ, ít thạch nuôi cổ |
| Giữ thân phận yếu | Ít người nghi ngờ | Có thể phải mất hàng hoặc nhờ người khác |
| Lộ một phần chiến lực cứu đoàn | Giữ người/hàng, tăng uy tín | Tăng số người đặt câu hỏi về thân phận |
| Chọn bảo vệ Trương Trụ theo nhánh giả định | Giữ một người có ảnh hưởng với Tâm Từ | Phải trả giá và đổi những cảnh về sau liên quan cái chết của ông |

Hai chuỗi phụ: **Một món hàng, hai chủ nợ** và **Người sống sau đêm cương thi**. Hai mốc nâng sâu: hàng Kim gia và đêm cương thi. Sau tới thành, người sống và thỏa thuận trong đoàn có cảnh trả kết quả; dùng hàng đợi xuyên chương trong kế hoạch gameplay.

Nghiệm thu: không mua/bán vô hạn không tốn lượt; vốn hàng được tính đúng khi mất hàng hoặc load; nếu cứu Trương Trụ thì lời thoại Tâm Từ và phản ứng Tiểu Điệp đổi thật.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-5-q2-c4--thương-gia-thành-nơi-xây-bộ-cổ"></a>
### 5. Q2-C4 — Thương gia thành: nơi xây bộ cổ

File: `ch4_thanh.js`. Ba điểm chính: đấu trường kiếm vị thế, chợ/đấu giá tìm cổ, nơi nghỉ hồi phục và quan hệ. Thông báo mục tiêu kinh tế ngắn hạn để người chơi biết đang tích tiền vì điều gì.

- Hồ sơ đối thủ chỉ hiện kiến thức đã quan sát. Trước trận được sắp thứ tự kỹ năng và cân nhắc nuôi/luyện, không đổi mọi thứ miễn phí giữa trận.
- Các đối thủ hiện hữu cần bài toán riêng: phòng thủ chờ phản công, tiêu hao chân nguyên, ép cự ly. Gắn cơ chế vào bộ cổ của từng người sau đối chiếu; không đặt class tùy tiện.
- Đấu giá có ngân sách, tín hiệu đối thủ và quyền bỏ cuộc; không dùng mẹo tải lại để reroll liên tục một phiên bán.
- Hai chuỗi phụ: **Giá của một lời giới thiệu** và **Một trận thua đáng học**; mở tin đối thủ/cơ hội giao dịch, không chỉ cộng quan hệ.
- Hai mốc sâu: bước vào đấu trường và bước ngoặt đổi sang bộ lực đạo, tận dụng `luc.js`.

Nghiệm thu: có nhiều cách chi tiêu hợp lý; bộ cổ Q1 không mất giá trị đột ngột vô cớ; người chơi hiểu vì sao bộ lực đạo thay đổi cách đánh.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-6-q2-c5--thiếu-chủ-đầu-tư-vào-con-người"></a>
### 6. Q2-C5 — Thiếu chủ: đầu tư vào con người

File: `ch5_thieuchu.js`. Tận dụng Chu Toàn, Vệ Đức Hinh, ba anh em họ Hùng, Thương Trào Phong và tuyến Tâm Từ đã có.

Mỗi nhân sự có một vai trò gameplay hữu hạn: quản hàng, tìm tin hoặc bảo vệ một việc cụ thể, sau khi đối chiếu tình tiết. Tuyển người phải giải quyết yêu cầu và mở nhiệm vụ; không chỉ trả tiền nhận buff vĩnh viễn.

Hai chuỗi phụ: **Sổ hàng có chỗ trống** và **Lời hứa với người làm**. Hai mốc sâu: xây đội giúp Tâm Từ và công bố kết quả tranh vị trí. Người chơi chọn phân bổ vốn/thời gian cho thương mại, nhân sự hoặc thông tin đối thủ; kết quả dựa trên chuỗi việc đã làm.

Khi rời thành, để lại một việc có kết quả được báo sau nhưng không cho thu nhập vô hạn khi tua thời gian Tam Xoa. Nghiệm thu cả thất bại tranh quyền: vẫn có đường tới chương tiếp với trạng thái khác được thiết kế.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-7-q2-c6--tam-xoa-ba-truyền-thừa-chơi-khác-nhau"></a>
### 7. Q2-C6 — Tam Xoa: ba truyền thừa chơi khác nhau

File: `ch6_tamxoa.js`, `truyenthua.js`. Giữ điều kiện cổ chìa khóa, quy tắc cổ dùng được và giới hạn vào/ra theo cơ chế đã có. UI phải báo trước mất quyền quay lại khi rút.

| Truyền thừa | Nền hiện tại | Nâng cấp P1 | Cái giá khi tham |
|---|---|---|---|
| Khuyển Vương | Số chó, sức mạnh và xử lý nhiều ải trong `kvStep()` | Chọn đội hình/đường tiến tại phòng quan trọng; hiển thị quân địch đã trinh sát | Hao quân làm giảm khả năng vượt ải tiếp |
| Tín Vương | Luyện cổ, vật liệu và các mốc riêng | Chọn dành nguyên liệu, đấu luyện hoặc khai thác thông tin trong giới hạn truyện | Dùng sạch vật liệu có thể kẹt ở thử thách sau |
| Bạo Vương | Trứng, thời điểm nổ, phòng/ải | Đọc tín hiệu, chọn đánh đổi giữa an toàn và giữ tài nguyên | Dính nổ, mất cổ/nguồn lực theo luật được duyệt |

Mỗi truyền thừa có ba mẫu phòng quyết định và một cảnh mốc làm trước; các ải đã giải có thể xử lý nhanh, nhưng dừng khi có lựa chọn mới. Không bắt chơi 30–40 màn nhỏ lặp lại.

Hai chuỗi phụ: **Tin rao ở chân núi** (thật/giả có dấu hiệu) và **Người trở ra thiếu một cánh tay** (manh mối rủi ro, không chỉ cảnh hù). Hai mốc sâu: lần vào truyền thừa và cuộc giao tranh lớn với Thiết gia trong tuyến chương.

Nghiệm thu: cả ba có chiến lược khác nhau; không thành ba biến thể xúc xắc cộng chỉ số; rút lui có lợi ích bảo toàn tài nguyên rõ.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-8-q2-c7--ngũ-chuyển-giáng-lâm-biết-lúc-nào-phải-nhịn"></a>
### 8. Q2-C7 — Ngũ chuyển giáng lâm: biết lúc nào phải nhịn

File: `ch7_ngu.js`. Trọng tâm là đọc thế lực và cửa sổ hành động. Hiển thị ai kiểm soát lối vào, khi nào nên thăm dò và cái giá của bị phát hiện. Không cho nhân vật thấp chuyển thắng cự đầu bằng vài lần đỡ chuẩn nếu không có cơ chế truyện hỗ trợ.

Hai chuỗi phụ: **Rượu có lai lịch** và **Người đưa tin mất hẹn**. Hai mốc sâu: cự đầu lập lại trật tự và dấu phúc địa suy bại. Thu thập manh mối cần cho hồi cuối qua ít nhất hai cơ hội có chi phí, tránh một popup bị bỏ qua khóa toàn kết cục.

Các cảnh Trung Châu là góc nhìn kể chuyện. Muốn chuyển thành `dangHonNho` hoặc kiến thức dùng được phải có nguồn hợp lệ đối với Phương Nguyên; UI không đồng nhất người chơi đã xem với nhân vật đã biết.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-9-q2-c8--bá-quy-chuẩn-bị-một-kế-hoạch-có-thể-đổ-vỡ"></a>
### 9. Q2-C8 — Bá Quy: chuẩn bị một kế hoạch có thể đổ vỡ

File: `ch8_baquy.js`. Bảng chuẩn bị gom các cờ/tài nguyên hiện hữu thành bốn mục dễ hiểu: vật liệu, người luyện, tiên nguyên, áp lực bên ngoài. Đây là cách trình bày tình thế, không tự sáng tạo tài nguyên bắt buộc trái nguyên tác.

- Hai mốc sâu: thỏa thuận với địa linh và chọn cách xử lý cự đầu. Giải thích điều kiện áp chế của phúc địa trước khi người chơi ra tay.
- Mỗi hành động lớn tiêu thời gian/nguồn lực hoặc làm tăng nguy cơ bên ngoài, theo luật thiết kế rõ. Không biến mọi lựa chọn thành “bấm ám sát để nhận tiền”.
- Hai chuỗi phụ: **Vết rạn trên mai đá** và **Câu hỏi của người đồng hành**; gieo dấu hiệu giới hạn địa linh và nghi vấn BNB.
- Cuối chương có rà soát các điều kiện đã biết, chỉ ra đầu mối còn mở. Không tự bù mọi vật liệu miễn phí tại cửa điện.

Nghiệm thu: kế hoạch thiếu điều kiện được báo trong truyện; có cách đổi mục tiêu/rút theo nhánh đã thiết kế; nhân vật được tha có hậu quả riêng về sau.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-10-q2-c9--phản-bội-và-đổi-kế-hoạch"></a>
### 10. Q2-C9 — Phản bội và đổi kế hoạch

File: `ch9_phanboi.js`. Nền đã có `thienLan3()`, ký ức phản bội, `dinhTienBonus()` và nhiều kết cục. Nâng thành bốn nhịp: nhận ra thế vây → đổ vỡ → quay ngược nếu hợp lệ → dùng kiến thức đổi kế hoạch.

Lần đầu: phản bội có dấu hiệu gieo từ trước nhưng không cần vạch đáp án. Quan hệ cao có thể đổi đối thoại/cơ hội thăm dò; không tự vô hiệu hóa toàn bộ phản bội. Nhánh ngăn phản bội sớm là giả định, cần thiết kế riêng và vẫn đối diện phúc địa sụp/liên quân.

Sau quay ngược: cho thấy những thông tin mới và mở quyết định cụ thể; người chơi thực sự bố trí lại, thay vì bấm lại cùng chuỗi có thêm bonus. Hai chuỗi phụ xuyên chương trả kết quả tại đây: **Các danh tửu đã gom** và **Hình ảnh nơi muốn đến**.

Luyện Định Tiên Du phân biệt điều kiện bắt buộc theo nguồn được duyệt với bonus gameplay; không để một điểm tổng che giấu chuyện thiếu thành phần cốt lõi. Cần rà `dinhTienBonus()` và các lựa chọn hiện có trước khi chốt thay đổi xác suất. Cảnh luyện/thoát là nhiều pha quyết định, có skip phần điện ảnh.

Kết cục tối thiểu phải kiểm thử: Hồ Tiên; rời đi tới địa điểm khác đang được hỗ trợ; thoát thân theo nhánh; chết thật; dùng Thiền rồi thất bại; nhánh xử lý BNB sớm. Không hứa mở Quyển 3 trong bản này.

<a id="source-docs-undone-big-update-q1-q2-05-content-quyen-2-md-11-tuyến-xuyên-chương-và-kiểm-tra-tổng"></a>
### 11. Tuyến xuyên chương và kiểm tra tổng

| Tuyến | Gieo ở đâu | Trả ở đâu | Điều kiện nhất quán |
|---|---|---|---|
| Bạch Ngưng Băng | Q1/Hoàng Long, Bạch Cốt | Tam Xoa, Bá Quy, điện luyện cổ | Có mặt, thương tổn, lợi ích, bí mật; không suy hết từ thiện cảm |
| Tâm Từ và người trong đoàn | Thương đội | Thành, thiếu chủ, tin sau khi rời đi | Người sống/chết, nợ, hành động đã chứng kiến |
| Thiết Nhược Nam | Điều tra Q1 và dấu vết Q2 | Tam Xoa, hồi cuối | Kiến thức có nguồn, không toàn tri |
| Lực đạo | Thành | Trận lớn và Tam Xoa | Cổ/thú lực thực có, điều kiện dùng đúng |
| Chuẩn bị tiên cổ | Tin rượu, truyền thừa, Ngũ chuyển | Bá Quy, điện luyện cổ | Phân biệt điều kiện bắt buộc, manh mối và bonus |

Hoàn thành khi chín chương đều có bản sắc và đường đi hợp lệ từ trạng thái bất lợi; hậu quả không mất khi chuyển chương; không NPC chết rồi xuất hiện; quay ngược không nhân đôi vật phẩm; mọi ending có lời giải thích đúng; bot và chơi tay đều được kiểm tra. Với chương dày nội dung, giảm cảnh ngẫu nhiên lặp trước khi tăng số lượt.
