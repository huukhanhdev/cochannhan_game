# Làm giàu Quyển 2: chín chương, chín thế cục

Trạng thái: đề xuất nối tiếp Q2 đã có trong mã. Nguồn chuẩn bắt buộc: [CHI_TIET_NGUYEN_TAC_Q2.md](../../CHI_TIET_NGUYEN_TAC_Q2.md); phần kế thừa đối chiếu thêm [CHI_TIET_NGUYEN_TAC_Q1.md](../../CHI_TIET_NGUYEN_TAC_Q1.md). `KE_HOACH_Q2.md` chỉ tham khảo cách triển khai; chưa xác minh lại nguồn truyện ngoài repo. Mọi lựa chọn và hậu quả mới phải gắn nhãn chuyển thể/giả định phù hợp. Xem [tổng thể](README.md).

## 1. Ngân sách và bản sắc

Giữ chín chương và số lượt hiện tại làm baseline: Hoàng Long 9 tuần, Bạch Cốt 10 tuần, thương đội 12 tuần, thành 14 tháng, thiếu chủ 6 tháng, Tam Xoa 14 tuần, Ngũ chuyển 8 tuần, Bá Quy 10 ngày, điện luyện cổ 3 ngày. Không cộng 96 lượt khác đơn vị thành một thời lượng cốt truyện duy nhất.

Mục tiêu đề xuất: mỗi chương nâng hai mốc hiện có thành cảnh sâu hơn (18 mốc); hai chuỗi phụ ba cảnh/chương (54 cảnh trong kho, không hiện hết trong một lượt chơi); hai vignette/chương (18 đoạn ngắn). Chương 9 chỉ có ba ngày nên chuỗi phụ được gieo từ chương trước và trả kết quả trong cảnh chính. Không tăng mật độ bằng cách nhét sáu popup mới vào ba ngày.

## 2. Q2-C1 — Hoàng Long: sống sót cùng người không thể tin hết

File: `ch1_hoanglong.js`. Vòng chơi: dò chỗ dừng → chọn kiếm thức ăn/tu luyện/di chuyển → chia nguồn lực → đối mặt nguy cơ.

- Nâng cảnh cổ đói thành quyết định giữ bộ nào với dự báo nuôi cụ thể. Nhu cầu nuôi lấy từ luật thật, không ép chết cổ chỉ để khớp kịch bản.
- Cho chọn điểm dừng có khác biệt: kín nhưng ít thức ăn, dễ kiếm tài nguyên nhưng có thú hoặc dấu người. Đây là chuyển thể bản đồ, cần gắn với các địa điểm đã biên tập.
- Hai chuỗi phụ: **Phần thức ăn cuối** và **Dấu chân sau bãi nghỉ**; kết quả là thỏa thuận chia nguồn lực hoặc thay đổi khả năng bị lần theo.
- BNB phản ứng khi người chơi liên tục giữ lợi về mình; không biến mức quan hệ thành đảm bảo trung thành.

Nghiệm thu: khởi đầu kho nghèo và thiếu Bảo Liên vẫn có đường sinh tồn được giải thích; quyết định bỏ cổ có cảnh báo và không phục hồi cổ qua load.

## 3. Q2-C2 — Bạch Cốt: truyền thừa là bài toán đường đi

File: `ch2_bachcot.js`. Dùng sơ đồ mật thất mở dần thay cho chỉ một chuỗi tăng chỉ số. Mỗi nhánh có dấu hiệu rủi ro, nguồn lực và cửa rút; lối đúng không chỉ là đoán ngẫu nhiên.

- Hai mốc sâu: khám phá bí mật truyền thừa và quyết định liên quan Cốt Nhục Đoàn Viên.
- Hai chuỗi phụ: **Lời khắc chưa đọc hết** (thông tin/đường tắt) và **Ai đi trước** (vai trò đồng hành/chi phí khám phá).
- Dùng cổ trinh sát/phòng thủ đúng công dụng để mở cách tiếp cận; nếu thiếu cổ, có phương án tốn thời gian hoặc chấp nhận tổn thất đã báo.
- Sau rời núi, ghi rõ ai biết chuyện đã xảy ra và ảnh hưởng tới truy đuổi.

Nghiệm thu: lấy cùng phần thưởng không lặp; rời mật thất không softlock; cơ chế truyền nguyên/đồng tu dùng đúng cổ và trạng thái theo tài liệu đã duyệt.

## 4. Q2-C3 — Thương đội: hàng hóa, thân phận và lòng tin

File: `ch3_thuongdoi.js`; nền có `tradeRun()`, `tamtuVisit()` và mốc Tâm Từ/Trương Trụ/Đinh Hạo. Nâng thương mại từ kết quả lãi/lỗ ngẫu nhiên thành lựa chọn lượng hàng, vốn, tin giá và chỗ tiêu thụ. Chỉ dùng 3–4 nhóm hàng đã có cơ sở trong chương, không dựng một game logistics riêng.

| Quyết định | Được gì | Rủi ro / hậu quả |
|---|---|---|
| Mua hàng theo tin chắc | Biên lợi nhuận dễ dự kiến hơn | Vốn bị giữ, ít thạch nuôi cổ |
| Giữ thân phận yếu | Ít người nghi ngờ | Có thể phải mất hàng hoặc nhờ người khác |
| Lộ một phần chiến lực cứu đoàn | Giữ người/hàng, tăng uy tín | Tăng số người đặt câu hỏi về thân phận |
| Chọn bảo vệ Trương Trụ theo nhánh giả định | Giữ một người có ảnh hưởng với Tâm Từ | Phải trả giá và đổi những cảnh về sau liên quan cái chết của ông |

Hai chuỗi phụ: **Một món hàng, hai chủ nợ** và **Người sống sau đêm cương thi**. Hai mốc nâng sâu: hàng Kim gia và đêm cương thi. Sau tới thành, người sống và thỏa thuận trong đoàn có cảnh trả kết quả; dùng hàng đợi xuyên chương trong kế hoạch gameplay.

Nghiệm thu: không mua/bán vô hạn không tốn lượt; vốn hàng được tính đúng khi mất hàng hoặc load; nếu cứu Trương Trụ thì lời thoại Tâm Từ và phản ứng Tiểu Điệp đổi thật.

## 5. Q2-C4 — Thương gia thành: nơi xây bộ cổ

File: `ch4_thanh.js`. Ba điểm chính: đấu trường kiếm vị thế, chợ/đấu giá tìm cổ, nơi nghỉ hồi phục và quan hệ. Thông báo mục tiêu kinh tế ngắn hạn để người chơi biết đang tích tiền vì điều gì.

- Hồ sơ đối thủ chỉ hiện kiến thức đã quan sát. Trước trận được sắp thứ tự kỹ năng và cân nhắc nuôi/luyện, không đổi mọi thứ miễn phí giữa trận.
- Các đối thủ hiện hữu cần bài toán riêng: phòng thủ chờ phản công, tiêu hao chân nguyên, ép cự ly. Gắn cơ chế vào bộ cổ của từng người sau đối chiếu; không đặt class tùy tiện.
- Đấu giá có ngân sách, tín hiệu đối thủ và quyền bỏ cuộc; không dùng mẹo tải lại để reroll liên tục một phiên bán.
- Hai chuỗi phụ: **Giá của một lời giới thiệu** và **Một trận thua đáng học**; mở tin đối thủ/cơ hội giao dịch, không chỉ cộng quan hệ.
- Hai mốc sâu: bước vào đấu trường và bước ngoặt đổi sang bộ lực đạo, tận dụng `luc.js`.

Nghiệm thu: có nhiều cách chi tiêu hợp lý; bộ cổ Q1 không mất giá trị đột ngột vô cớ; người chơi hiểu vì sao bộ lực đạo thay đổi cách đánh.

## 6. Q2-C5 — Thiếu chủ: đầu tư vào con người

File: `ch5_thieuchu.js`. Tận dụng Chu Toàn, Vệ Đức Hinh, ba anh em họ Hùng, Thương Trào Phong và tuyến Tâm Từ đã có.

Mỗi nhân sự có một vai trò gameplay hữu hạn: quản hàng, tìm tin hoặc bảo vệ một việc cụ thể, sau khi đối chiếu tình tiết. Tuyển người phải giải quyết yêu cầu và mở nhiệm vụ; không chỉ trả tiền nhận buff vĩnh viễn.

Hai chuỗi phụ: **Sổ hàng có chỗ trống** và **Lời hứa với người làm**. Hai mốc sâu: xây đội giúp Tâm Từ và công bố kết quả tranh vị trí. Người chơi chọn phân bổ vốn/thời gian cho thương mại, nhân sự hoặc thông tin đối thủ; kết quả dựa trên chuỗi việc đã làm.

Khi rời thành, để lại một việc có kết quả được báo sau nhưng không cho thu nhập vô hạn khi tua thời gian Tam Xoa. Nghiệm thu cả thất bại tranh quyền: vẫn có đường tới chương tiếp với trạng thái khác được thiết kế.

## 7. Q2-C6 — Tam Xoa: ba truyền thừa chơi khác nhau

File: `ch6_tamxoa.js`, `truyenthua.js`. Giữ điều kiện cổ chìa khóa, quy tắc cổ dùng được và giới hạn vào/ra theo cơ chế đã có. UI phải báo trước mất quyền quay lại khi rút.

| Truyền thừa | Nền hiện tại | Nâng cấp P1 | Cái giá khi tham |
|---|---|---|---|
| Khuyển Vương | Số chó, sức mạnh và xử lý nhiều ải trong `kvStep()` | Chọn đội hình/đường tiến tại phòng quan trọng; hiển thị quân địch đã trinh sát | Hao quân làm giảm khả năng vượt ải tiếp |
| Tín Vương | Luyện cổ, vật liệu và các mốc riêng | Chọn dành nguyên liệu, đấu luyện hoặc khai thác thông tin trong giới hạn truyện | Dùng sạch vật liệu có thể kẹt ở thử thách sau |
| Bạo Vương | Trứng, thời điểm nổ, phòng/ải | Đọc tín hiệu, chọn đánh đổi giữa an toàn và giữ tài nguyên | Dính nổ, mất cổ/nguồn lực theo luật được duyệt |

Mỗi truyền thừa có ba mẫu phòng quyết định và một cảnh mốc làm trước; các ải đã giải có thể xử lý nhanh, nhưng dừng khi có lựa chọn mới. Không bắt chơi 30–40 màn nhỏ lặp lại.

Hai chuỗi phụ: **Tin rao ở chân núi** (thật/giả có dấu hiệu) và **Người trở ra thiếu một cánh tay** (manh mối rủi ro, không chỉ cảnh hù). Hai mốc sâu: lần vào truyền thừa và cuộc giao tranh lớn với Thiết gia trong tuyến chương.

Nghiệm thu: cả ba có chiến lược khác nhau; không thành ba biến thể xúc xắc cộng chỉ số; rút lui có lợi ích bảo toàn tài nguyên rõ.

## 8. Q2-C7 — Ngũ chuyển giáng lâm: biết lúc nào phải nhịn

File: `ch7_ngu.js`. Trọng tâm là đọc thế lực và cửa sổ hành động. Hiển thị ai kiểm soát lối vào, khi nào nên thăm dò và cái giá của bị phát hiện. Không cho nhân vật thấp chuyển thắng cự đầu bằng vài lần đỡ chuẩn nếu không có cơ chế truyện hỗ trợ.

Hai chuỗi phụ: **Rượu có lai lịch** và **Người đưa tin mất hẹn**. Hai mốc sâu: cự đầu lập lại trật tự và dấu phúc địa suy bại. Thu thập manh mối cần cho hồi cuối qua ít nhất hai cơ hội có chi phí, tránh một popup bị bỏ qua khóa toàn kết cục.

Các cảnh Trung Châu là góc nhìn kể chuyện. Muốn chuyển thành `dangHonNho` hoặc kiến thức dùng được phải có nguồn hợp lệ đối với Phương Nguyên; UI không đồng nhất người chơi đã xem với nhân vật đã biết.

## 9. Q2-C8 — Bá Quy: chuẩn bị một kế hoạch có thể đổ vỡ

File: `ch8_baquy.js`. Bảng chuẩn bị gom các cờ/tài nguyên hiện hữu thành bốn mục dễ hiểu: vật liệu, người luyện, tiên nguyên, áp lực bên ngoài. Đây là cách trình bày tình thế, không tự sáng tạo tài nguyên bắt buộc trái nguyên tác.

- Hai mốc sâu: thỏa thuận với địa linh và chọn cách xử lý cự đầu. Giải thích điều kiện áp chế của phúc địa trước khi người chơi ra tay.
- Mỗi hành động lớn tiêu thời gian/nguồn lực hoặc làm tăng nguy cơ bên ngoài, theo luật thiết kế rõ. Không biến mọi lựa chọn thành “bấm ám sát để nhận tiền”.
- Hai chuỗi phụ: **Vết rạn trên mai đá** và **Câu hỏi của người đồng hành**; gieo dấu hiệu giới hạn địa linh và nghi vấn BNB.
- Cuối chương có rà soát các điều kiện đã biết, chỉ ra đầu mối còn mở. Không tự bù mọi vật liệu miễn phí tại cửa điện.

Nghiệm thu: kế hoạch thiếu điều kiện được báo trong truyện; có cách đổi mục tiêu/rút theo nhánh đã thiết kế; nhân vật được tha có hậu quả riêng về sau.

## 10. Q2-C9 — Phản bội và đổi kế hoạch

File: `ch9_phanboi.js`. Nền đã có `thienLan3()`, ký ức phản bội, `dinhTienBonus()` và nhiều kết cục. Nâng thành bốn nhịp: nhận ra thế vây → đổ vỡ → quay ngược nếu hợp lệ → dùng kiến thức đổi kế hoạch.

Lần đầu: phản bội có dấu hiệu gieo từ trước nhưng không cần vạch đáp án. Quan hệ cao có thể đổi đối thoại/cơ hội thăm dò; không tự vô hiệu hóa toàn bộ phản bội. Nhánh ngăn phản bội sớm là giả định, cần thiết kế riêng và vẫn đối diện phúc địa sụp/liên quân.

Sau quay ngược: cho thấy những thông tin mới và mở quyết định cụ thể; người chơi thực sự bố trí lại, thay vì bấm lại cùng chuỗi có thêm bonus. Hai chuỗi phụ xuyên chương trả kết quả tại đây: **Các danh tửu đã gom** và **Hình ảnh nơi muốn đến**.

Luyện Định Tiên Du phân biệt điều kiện bắt buộc theo nguồn được duyệt với bonus gameplay; không để một điểm tổng che giấu chuyện thiếu thành phần cốt lõi. Cần rà `dinhTienBonus()` và các lựa chọn hiện có trước khi chốt thay đổi xác suất. Cảnh luyện/thoát là nhiều pha quyết định, có skip phần điện ảnh.

Kết cục tối thiểu phải kiểm thử: Hồ Tiên; rời đi tới địa điểm khác đang được hỗ trợ; thoát thân theo nhánh; chết thật; dùng Thiền rồi thất bại; nhánh xử lý BNB sớm. Không hứa mở Quyển 3 trong bản này.

## 11. Tuyến xuyên chương và kiểm tra tổng

| Tuyến | Gieo ở đâu | Trả ở đâu | Điều kiện nhất quán |
|---|---|---|---|
| Bạch Ngưng Băng | Q1/Hoàng Long, Bạch Cốt | Tam Xoa, Bá Quy, điện luyện cổ | Có mặt, thương tổn, lợi ích, bí mật; không suy hết từ thiện cảm |
| Tâm Từ và người trong đoàn | Thương đội | Thành, thiếu chủ, tin sau khi rời đi | Người sống/chết, nợ, hành động đã chứng kiến |
| Thiết Nhược Nam | Điều tra Q1 và dấu vết Q2 | Tam Xoa, hồi cuối | Kiến thức có nguồn, không toàn tri |
| Lực đạo | Thành | Trận lớn và Tam Xoa | Cổ/thú lực thực có, điều kiện dùng đúng |
| Chuẩn bị tiên cổ | Tin rượu, truyền thừa, Ngũ chuyển | Bá Quy, điện luyện cổ | Phân biệt điều kiện bắt buộc, manh mối và bonus |

Hoàn thành khi chín chương đều có bản sắc và đường đi hợp lệ từ trạng thái bất lợi; hậu quả không mất khi chuyển chương; không NPC chết rồi xuất hiện; quay ngược không nhân đôi vật phẩm; mọi ending có lời giải thích đúng; bot và chơi tay đều được kiểm tra. Với chương dày nội dung, giảm cảnh ngẫu nhiên lặp trước khi tăng số lượt.
