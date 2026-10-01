# Làm giàu Quyển 1: Thanh Mao Sơn có đời sống và trí nhớ

Trạng thái: đề xuất. Nguồn chuẩn bắt buộc: [CHI_TIET_NGUYEN_TAC_Q1.md](../../CHI_TIET_NGUYEN_TAC_Q1.md); phần bàn giao Q2 đối chiếu thêm [CHI_TIET_NGUYEN_TAC_Q2.md](../../CHI_TIET_NGUYEN_TAC_Q2.md). `js/events.js` và kế hoạch cũ chỉ phản ánh triển khai/ý tưởng, không quyết định canon. Các kết quả lựa chọn mới là **nhánh giả định hoặc chuyển thể gameplay**, không mặc nhiên là nguyên tác. Xem [tổng thể](README.md).

## 1. Phạm vi và nhịp kể

Giữ khung 27 tuần làm baseline, không ép thêm tuần để chứa content. Chia thành sáu cụm biên tập; lịch thật lấy từ `S.canon`, kể cả khi dị số đẩy mốc. Tránh hardcode chuỗi phụ vào tuần mà mốc chính có thể đã dịch.

Mục tiêu toàn đợt: nâng sâu 12 mốc đã có; tám chuỗi phụ, mỗi chuỗi 3–4 cảnh; 12 vignette đời sống ngắn; sáu encounter chiến thuật được tuyển chọn từ trận hiện có. Những con số là ngân sách biên tập, không phải số content đang thiếu; rà trùng trước khi viết. Một lượt không dồn quá một cảnh dài bắt buộc và một phản hồi ngắn, trừ hồi kết có chủ ý.

## 2. Sáu cụm nội dung

| Cụm | Trải nghiệm | Mốc ưu tiên nâng cấp | Hệ quả cần theo dõi |
|---|---|---|---|
| Khai khiếu và học đường | Tư chất thấp nhưng có kinh nghiệm | Khai khiếu, nhận cổ, tranh tài nguyên học đường | Ai sợ, ai nể, ai báo lại gia tộc |
| Hoa Tửu và thương đội | Kiến thức là tài sản phải giữ kín | Dò hang, Tửu Trùng, đổ thạch, Kim Sinh | Lộ bí mật, người chứng kiến, đường lui |
| Gia sản và phe phái | Lợi ích đi kèm món nợ | Cậu mợ, Trầm Thúy, Xích/Mạc, tổ đội | Nguồn thu, bảo lãnh, nghĩa vụ chưa trả |
| Truyền thừa và địch thủ | Sức mạnh đến từ bộ cổ hợp tình huống | Thạch Hầu Vương, Cường Thủ, gặp BNB | Ai biết chiến lực thật, cổ thu được/mất đi |
| Lang triều và gia lão | Quyết định dưới áp lực cứu người/giữ lợi | Chuẩn bị, Thanh Thư, luận công, phòng tuyến | Thương vong, uy tín, thiếu thuốc, nợ cứu mạng |
| Điều tra và băng phong | Các quyết định cũ cùng quay lại | Thiết gia, huyết động, Nhất Đại, kết cục | Nhân chứng, lối thoát, người đồng hành, kho cổ Q2 |

## 3. Tám chuỗi phụ có đầu và cuối

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

## 4. Ba cảnh mẫu đủ để dựng bản chơi thử

### Q1-M1 — Kim Sinh: lựa chọn trước khi có án

Mở từ `c_kimsinh`, dùng kết quả/nhánh hiện hữu làm nền. Nhịp 1 quan sát trò lừa và người chứng kiến; nhịp 2 chọn tiếp cận; nhịp 3 giải quyết; nhịp 4 nhận hệ quả sau khi thương đội rời đi.

| Cách chọn | Lợi ích | Cái giá / cảnh trả kết quả |
|---|---|---|
| Dẫn vào hang theo tuyến đã có | Giữ quyền quyết định với kẻ tham bí mật | Nguy cơ lộ dấu vết; cảnh điều tra đọc đúng chứng cứ |
| Vạch trần trước người khác | Có người nhớ mình giúp tộc nhân | Mất cơ hội giao dịch kín; mở bảo lãnh nhưng tạo thù |
| Rút lui, cắt tiếp xúc | Bảo toàn tình trạng hiện tại | Bí mật có thể bị dò tiếp nếu đã lộ; không tự gán tội giết |

Hợp đồng chuỗi: giữ một kết quả chính; danh sách người biết và bằng chứng đã xử lý tách riêng. `c_dieutra`, `c_thiet` và hồi kết đều đọc cùng kết quả. Nghiệm thu ba route tới điều tra, gồm save/load sau lựa chọn nhưng trước hậu quả.

### Q1-M2 — Lang triều: một khoảng thời gian, hai việc cần cứu

Trong cảnh canh phòng, báo hai nhu cầu đồng thời: giữ lối rút cho đội tuần tra và mang thuốc cho người bị thương. Nếu đã chuẩn bị ở Q1-S2/S6, có thể phân công; nếu chưa, phải ưu tiên một mục tiêu.

Kết quả trận có mức: giữ tuyến thành công; rút có trật tự nhưng mất vật tư; tan tuyến và chịu tổn thất. Cảnh luận công ghi nhận đúng điều đã làm. Nhánh cứu Thanh Thư được đặt điều kiện và trả giá rõ; nhánh hi sinh có hậu sự và phản ứng Phương Chính, không chỉ một dòng thông báo.

Nghiệm thu: không bắt buộc có một cổ hiếm mới thắng; thuốc đã dùng không trở lại khi load; nhân vật đã chết không xuất hiện trong cảnh bình thường sau đó.

### Q1-M3 — Huyết động: mang gì ra khỏi núi

Trước hồi kết, một màn rà soát cho thấy lối thoát đã biết, cổ đang sở hữu, người có thể đi cùng và chuyện chưa giải quyết. Không biến thành cửa hàng phát bộ cổ chuẩn.

Trong các quyết định cuối, phân biệt tìm đường, đoạt lợi và bảo toàn người đồng hành; chi phí dựa vào trạng thái đã tích lũy. Cảnh sau phản ánh cổ thật còn lại. Kết cục giả định ghi nhãn trong nhật ký sau khi người chơi trải qua.

## 5. Đời sống và môi trường phản ứng

12 vignette đề xuất chia đều cho học đường, tửu quán, chợ, y đường, trại sau lang triều và lối núi. Mỗi vignette khoảng 40–90 từ, tối đa một quyết định nhanh; ví dụ học viên đổi đường khi thấy người từng chặn cổng, quầy thuốc trống sau đợt cứu thương, người nhà nạn nhân hỏi chuyện.

Biến thể lời thoại dựa trên điều NPC thực sự biết. Dùng chúng để cho thấy hậu quả, không tăng chỉ số ở mọi lần ghé. Có cooldown và cờ đã xem; nội dung lặp phải ngắn hơn lần đầu.

## 6. Cầu nối Q1 → Q2

`Q2_GATE` hiện cho phép `ma`, `bai_dong`, `huyetlo`, `huyetlo_bai`, `tien_lo`, `phan_toc`. Kiểm tra từng kết cục thay vì mặc định mọi ending đều sang Q2.

Trước `startQ2()`, biên nhận phải giải thích: vì sao cảnh giới thay đổi theo chuyển cảnh, tư chất áp dụng, cổ mang được/không còn, quan hệ BNB và tài nguyên ban đầu. `q2Inherit()` là nơi đối chiếu kho thật; đường vào thẳng từ menu là preset thử riêng, cần ghi rõ.

Thiết kế thêm hồ sơ nguồn gốc tối thiểu: kết cục Q1, 3–5 quyết định quan trọng và người còn liên quan. Chỉ mang những dữ kiện có cảnh Q2 sử dụng; không kéo toàn bộ flags Q1 vào Q2 không kiểm soát.

## 7. Tiêu chí hoàn thành Q1

- Mỗi mốc nâng cấp có ít nhất hai cách xử lý khác nhau về chi phí hoặc hậu quả, không chỉ đổi câu chữ.
- Cả tám chuỗi có điều kiện mở/đóng, hạn nếu có, nhánh thất bại và cảnh trả kết quả; không bắt buộc gặp cả tám trong một kiếp.
- Sáu encounter có mục tiêu dễ hiểu và kiểm thử RT/lượt. Không thay nguyên tắc sức mạnh bằng boss tự giảm máu vô lý.
- Không có người chết xuất hiện lại, kết cục mâu thuẫn lựa chọn hoặc trách nhiệm án mạng bị gán sai.
- Nhánh lệch đi tới kết cục được thiết kế với khó khăn riêng; không bị khóa toàn bộ nội dung hay tăng độ khó vô cớ.
- Mô phỏng và playtest ghi lại nhịp gặp cảnh, lượng thạch/cổ, tỷ lệ qua từng mốc; đủ dữ liệu mới chốt cân bằng.
