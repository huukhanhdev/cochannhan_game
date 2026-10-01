# Gameplay: chuẩn bị, đánh đổi và hệ quả

Trạng thái: đề xuất. Xem [lộ trình tổng](README.md). Tất cả tên API/state mới bên dưới là thiết kế dự kiến.

## 1. Vòng chơi mục tiêu

**Đọc thế cục → chọn mục tiêu → chuẩn bị → hành động/cảnh/trận → nhận kết quả → thấy thế giới đổi.** Giữ ngân sách hành động hiện có làm baseline. Chỉ thay số việc mỗi lượt sau mô phỏng và playtest.

Mỗi lượt hiển thị một nguy cơ sắp tới, tối đa ba việc đáng chú ý và dự báo nuôi cổ. Không chỉ dẫn đáp án tối ưu; thông tin nhận được phụ thuộc việc dò xét, quan hệ và ký ức.

## 2. G1 — Chuẩn bị có tác dụng cụ thể (P1)

Trước mốc lớn, dành một hành động cho một trong các cách: dò xét, tích trữ, chọn vị trí hoặc nhờ người. Dùng cơ chế quan hệ, cổ và cờ hiện có; không thêm một thanh “điểm chuẩn bị” chung cho mọi chuyện.

| Chuẩn bị | Kết quả có thể nhìn thấy | Cái giá |
|---|---|---|
| Đọc dấu chân trước hang | Biết địch có chiêu ẩn thân; mở cách dẫn vào lối hẹp | Mất một việc khám phá |
| Dự trữ thuốc trước lang triều | Có một phương án cứu người/giữ tuyến thêm thời gian | Thạch, thức ăn hoặc cơ hội luyện cổ |
| Nhờ phe bảo lãnh | Mở lời khai hoặc lối tiếp cận riêng | Món nợ được nhắc và đòi ở cảnh sau |
| Thăm dò hàng thương đội | Biết khoảng giá/đường tiêu thụ | Bỏ lỡ một chuyến mua khác |

Chuẩn bị chỉ tiêu thụ khi cảnh tương ứng bắt đầu hoặc lựa chọn sử dụng nó. Có hạn sử dụng rõ theo chương; không lặng lẽ xóa ở `enterChapter()`. Người không chuẩn bị vẫn có đường đi với giá khác.

Nghiệm thu: cùng một trận/cảnh, ít nhất hai cách chuẩn bị thay đổi hành động khả dụng; không chỉ đổi một tỷ lệ xúc xắc ẩn.

## 3. G2 — Chiến đấu lấy yếu đối mạnh (P1)

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

## 4. G3 — Bộ cổ có kế hoạch nuôi và đường phát triển (P1)

Kho cổ cho biết: vai trò, điều kiện sử dụng, chi phí chân nguyên thực tế, tình trạng đói/thương tổn, dự báo chi phí lượt kế, nguồn thức ăn đã biết, công thức kế tiếp đã khám phá.

- Cho phép lưu **thứ tự thanh kỹ năng** theo mục đích: sinh tồn, săn thú, giao đấu. Không tự chuyển cổ ra khỏi cơ thể để né phí nuôi.
- Gợi ý thiếu vai trò bằng câu cụ thể, chẳng hạn “không có cách hồi phục khi giao chiến”; không ép người chơi phải đủ một bộ mẫu.
- Trước hợp luyện, hiện nguyên liệu sẽ mất, cổ đầu ra và tác động lên bộ đang dùng. Sau thất bại có biên nhận rõ.
- Đầu Q2 là bài toán chọn cổ nào đáng giữ. Hiện số lượt cầm cự theo dữ liệu thức ăn; không giả định mọi cổ dùng chung nguyên thạch nếu nội dung đòi nguồn khác.
- Lực đạo dựa trên `luc.js`: giải thích thú lực đang khắc, tác dụng Toàn Lực Ứng Phó và lý do bộ cổ mới khác bộ Q1. Không biến mỗi thú ảnh thành vật phẩm cộng chỉ số giống nhau.

Nghiệm thu: tải lại không thay đổi dự báo; cổ chết hoặc bị luyện mất không để lại nút kỹ năng trỏ sai index; đói/thương tổn ảnh hưởng đúng cả RT và lượt.

## 5. G4 — Quan hệ có lý do và phạm vi (P1)

Giữ `S.rel` để tránh thay toàn bộ hệ cũ. Thêm sự kiện quan hệ: ai biết việc gì, ai mắc nợ ai, điều kiện bảo lãnh, lời hứa còn hiệu lực. Hiển thị “đã giúp che thân phận” thay vì chỉ “+10 thân mật”.

Mỗi NPC trọng tâm có mục tiêu, giới hạn và 2–3 trạng thái quan hệ. Phương Chính đánh giá việc cứu người; phe Xích/Mạc quan tâm lợi ích; Tâm Từ nhớ hành động với người trong đoàn; Bạch Ngưng Băng có lợi ích và bí mật riêng. Một thanh thiện cảm không đủ giải quyết mọi nhân vật.

Phân biệt điều người chơi đọc được, điều Phương Nguyên biết và điều NPC biết. Cảnh chuyển sang Trung Châu không tự cấp kiến thức cho nhân vật chính nếu chưa có lý do trong truyện.

## 6. G5 — Nhân quả xuyên chương (P0)

Hiện `later()` dùng lượt tương đối, còn `enterChapter()` đặt lại `S.later`. Vì thế nội dung mới không được dựa vào hàng đợi này để hứa hậu quả ở chương kế.

Thiết kế thêm hàng đợi `S.story.pending` độc lập cho hậu quả xuyên chương. Giữ `S.later` cho sự kiện trong chương để hạn chế migration. Mỗi mục gồm `id`, `sourceChoice`, `targetBook`, `targetChapter`, cửa sổ lượt, điều kiện bằng khóa dữ liệu và trạng thái `pending/resolved/expired`. Không lưu closure trong JSON.

Ví dụ: giữ Trương Trụ sống ở thương đội → thêm mục phản hồi tại Thương gia thành → khi vào thành kiểm tra còn sống và đã gặp Tâm Từ → mở lời giới thiệu khác. Nếu không đủ điều kiện, ghi nguyên nhân đóng nhánh; không gọi NPC đã chết.

Mỗi chuỗi có một kết quả chính thay cho nhiều boolean đối nghịch. Khi chuyển đổi các cờ cũ, dùng adapter và bảng ưu tiên rõ; chưa xóa ngay các cờ còn được cảnh cũ đọc.

Nghiệm thu: qua chương, tua nhanh, load lại và trùng sinh đều xử lý đúng lịch; hậu quả mỗi ID áp dụng một lần trong đúng dòng thời gian; rollback khôi phục cả việc đã/đang chờ giải quyết, không giữ phần thưởng của tương lai.

## 7. G6 — Dị số và ký ức đáng chơi lại (P2)

Tận dụng `VARIANTS`, `varOmen()`, ký ức và tua nhanh hiện có. Dị số nên đổi hoàn cảnh, nhân chứng, giá cả hoặc lối tiếp cận; tránh cộng sát thương địch để trừng phạt người chọn khác nguyên tác.

Sau kiếp, cho xem ba nguyên nhân lớn dẫn tới kết cục và hai đầu mối có thể thử. Không tiết lộ toàn bộ đáp án của cảnh chưa gặp. Tua nhanh chỉ đi qua đoạn đã biết và không bỏ quyết định mới do dị số hay trạng thái quan hệ thay đổi.

Q2 giữ phân biệt chết thật, chơi lại và Xuân Thu Thiền theo luật hiện tại. Thông tin ngoài game không được vô tình ghi vào `S.mem` sau restart.

## 8. Hợp đồng kỹ thuật và nghiệm thu chung

Điểm sửa chính: `engine.js` xử lý hành động/kết quả; `events.js` và `q2/ch*.js` khai báo nội dung; `butterfly.js` nhân quả; `rt.js`/`auto.js` chiến đấu và bot; `q2/core.js` chuyển chương; `ui.js` trình bày.

Trước mở rộng, mô tả schema kết quả gồm ID lựa chọn, thay đổi tài nguyên, trạng thái NPC, hậu quả, điều kiện mở tiếp. UI và hiệu ứng đọc kết quả đó; không tự trừ thạch hay cấp cổ. Có thể bọc dần `eff/ok/fail/AFTER` hiện hữu, không cần đổi mọi event cùng lúc.

Save mới cần `schemaVersion` riêng, không tận dụng `S.v` nếu chưa rà ý nghĩa hiện tại. Migration giữ bản sao save đầu vào, có mặc định cho trường mới và validate book/chapter/event/cổ. Load lỗi phải hiện cách phục hồi, không ghi đè dữ liệu gốc. Lệnh nhập save kiểm tra cấu trúc; nội dung người dùng được escape khi hiển thị.

Hoàn thành gameplay khi: không có softlock; lựa chọn nghèo tài nguyên vẫn có lối tiếp tục hợp lệ; thắng/thua/rút đều có phản hồi; không nhân đôi thưởng; không bán/luyện mất vật bắt buộc mà không cảnh báo hoặc đường thay thế đã thiết kế.
