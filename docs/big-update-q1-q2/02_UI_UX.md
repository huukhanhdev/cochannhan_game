# UI/UX: đọc được thế cục, thao tác gọn

Trạng thái: đề xuất dựa trên `index.html`, `ui.js`, `present.js`, `rt.js`, `q2/core.js`; chưa có vòng kiểm chứng trực quan trong trình duyệt. Xem [tổng thể](README.md).

## 1. Định hướng thị giác

Giữ thủy mặc, giấy cũ và ấn triện. Dùng nền tối ổn định sau văn bản; mực đen/xám cho nội dung, ngọc cho chân nguyên, đỏ cho nguy hiểm, vàng nhạt cho cơ hội. Màu luôn đi kèm biểu tượng và chữ. Chữ thư pháp dành cho tiêu đề; thân bài dùng font dễ đọc, đủ dấu tiếng Việt.

Q1 dùng trúc xanh, đá xám, đèn vàng; Q2 đổi bảng màu theo chương. Không phủ mọi cảnh bằng một bộ nền/khói chung. Chỉ đánh giá chất lượng tranh sau khi kiểm tra asset thực tế, không mặc định cần thay tất cả.

## 2. U1 — Bố cục chính (P1)

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

## 3. U2 — Bản đồ và mốc truyện (P1)

- Điểm đến có bốn trạng thái: mở, có chuyện mới, cần điều kiện, đang không thể tới. Mỗi trạng thái có ký hiệu và lời giải thích.
- Trước khi bấm: hiện chi phí việc, rủi ro đã biết và mục đích chuyến đi. Không hiển thị chiến lợi phẩm bí mật chưa khám phá.
- Mốc bắt buộc đang chờ phải phân biệt với chuyện phụ. Nút qua lượt tóm tắt việc đang bỏ qua; chỉ yêu cầu xác nhận khi thực sự bỏ lỡ cơ hội không thể quay lại.
- Q1 có bản đồ vùng với điểm hậu sơn mở dần. Q2 có tuyến hành trình chín chương và bản đồ địa phương; không dùng thời gian chương để vô tình hiện báo động lang triều Q1.
- Đã đọc nhưng chưa làm được hiển thị điều kiện thiếu. Điểm tĩnh dưỡng ghi hiệu quả dự kiến từ trạng thái thật.

Điểm kỹ thuật: `renderMap2()` đang dùng `mapMood()` chung; hàm này có quy tắc theo lượt/mốc Q1. Tách ngữ cảnh book/chapter khi làm hệ bản đồ mới.

## 4. U3 — Hội thoại và lựa chọn (P1)

Thẻ cảnh có địa điểm, người nói, đoạn văn ngắn, lựa chọn, lịch sử hội thoại thu gọn. Một màn lựa chọn ưu tiên 2–4 phương án có khác biệt. Dùng “đọc tiếp” cho văn dài; cho hiện hết chữ ngay và nhớ tùy chọn tắt typewriter.

Lựa chọn hiển thị bốn loại thông tin khi có: mục đích, chi phí chắc chắn, điều kiện, rủi ro đã biết. Ví dụ: “Nhờ Mạc gia bảo lãnh — chịu một món nợ; cần đã giúp Mạc Bắc”. Không ghi chắc phần thưởng khi đó mới là kết quả xác suất.

Phương án khóa vẫn đọc được lý do. Một số bí mật chưa biết có thể ẩn hoàn toàn, nhưng phải ghi quy tắc biên tập để tránh cả màn không còn lựa chọn. Nhãn nguyên tác tuân theo luật khám phá/ký ức hiện có; không bật đáp án ngay ở lần đầu.

Sau chọn, một biên nhận kết quả trình bày: chuyện vừa xảy ra, tài nguyên thay đổi, ai phản ứng, việc mới mở. Giữ thẻ kết quả hiện hữu làm nền; tránh toast, log và thẻ cùng lặp toàn bộ một đoạn văn.

## 5. U4 — Giao diện trận (P1)

Thứ tự ưu tiên: **mục tiêu → ý đồ địch → tình trạng bản thân → nút hành động → hiệu ứng trang trí**.

- Mục tiêu riêng nằm cố định đầu đấu trường: “Giữ tuyến 18/30 giây”, “Đường thoát 60%”; không giấu trong log.
- Thanh vận chiêu của địch ghi tên, tầm ảnh hưởng và khả năng ngắt nếu đã biết; màu không phải tín hiệu duy nhất.
- Ba tầm hiện thành một dải vị trí. Di chuyển có nhãn đích và thời gian, không buộc người dùng suy ra từ chân dung.
- Kỹ năng hiện phí chân nguyên thực tế, cooldown và lý do không dùng được. Cổ đói/thương tổn có badge riêng.
- Tạm dừng/tốc độ luôn truy cập được. Mobile dùng thanh kỹ năng dễ chạm; không phụ thuộc hover hoặc phím tắt.
- Cuối trận giải thích mục tiêu đã hoàn thành, thương tổn cổ, chi phí và ảnh hưởng tới cảnh tiếp theo.

Kiểm tra đổi tab trình duyệt, mở menu, load lại và animation dài: người chơi không mất máu trong lúc buộc đọc UI. Có sẵn logic bỏ tick tab ẩn; nghiệm thu tiếp các lớp overlay mới.

## 6. U5 — Kho cổ, công thức và quan hệ (P1/P2)

Kho cổ lọc theo công dụng/chuyển/tình trạng; có chế độ danh sách gọn trên mobile. Chi tiết cổ giải thích vì sao không thể dùng, cách nuôi và nguồn đã biết. So sánh công thức bằng “mất gì → nhận gì”, gồm kỹ năng sắp biến mất. Pin tối đa ba mục tiêu tìm cổ/nguyên liệu vào nhật ký.

Quan hệ hiện người đã gặp, việc gần nhất, món nợ/lời hứa và câu chuyện đang mở. Không hiện sơ đồ biết trước tất cả nhân vật. Nhật ký chia mốc chính, việc phụ và manh mối bằng bộ lọc; mỗi mục chỉ rõ “còn thời hạn”, “chờ”, “đã kết thúc”, “không còn khả thi”.

Cuối quyển có trang hành trình: kết cục, ba quyết định lớn, người còn sống theo nhánh, cổ được chuyển tiếp. Q2 hiển thị đúng phạm vi nút chơi lại; hiện `q2WinHTML()` ghi “chương này” trong khi `restartChapter()` khôi phục đầu Q2 — cần thống nhất nội dung UI với hành vi thật.

## 7. Khả năng tiếp cận và triển khai

Hỗ trợ bàn phím đầy đủ, focus rõ, đóng modal bằng Escape và trả focus về nút mở. Text/biểu tượng đủ tương phản; kiểm tra không màu; log biến động không đọc dồn mọi khung hình qua screen reader. Reduced motion áp dụng xuyên CSS, canvas, PixiJS và typewriter.

Tách CSS theo khối trong `index.html` trước; có thể chuyển sang file CSS riêng sau khi giao diện ổn định. Render cập nhật phần đổi thay vì dựng lại mọi vùng theo tick. Nếu thay `innerHTML` tại `rtRender()`, bảo toàn focus và tránh làm người đang dùng bàn phím mất điểm chọn.

Nghiệm thu: không tràn ngang ở 360px; zoom 200% vẫn thao tác; mọi nút có tên rõ; cảnh dài vẫn đọc được với bàn phím ảo; load ảnh lỗi có placeholder; người mới hoàn thành vòng khai khiếu → hành động → trận → kết quả mà không cần hướng dẫn ngoài game.
