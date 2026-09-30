# Kế hoạch: đi lệch nguyên tác mà vẫn qua chương

**Ý chủ dự án.** Chọn y chang nguyên tác thì chẳng khác gì đọc lại truyện. Cảnh nhiều bước và hội thoại có mặt chính là để người chơi **chọn đúng mà đi lệch**: không cần giết Giả Kim Sinh, không để Thanh Thư chết, không đi xuống lăng mộ một mình, mà vẫn qua được chương.

**Nguyên tắc:**
- Đi lệch thành công nhờ **đọc tình huống và chọn khéo**: dò xét, dùng điều đã biết, dùng quan hệ, dùng đúng con cổ. Không phải nhờ chỉ số to hơn.
- Chọn sai thì có hậu quả, và câu chuyện thường rẽ về kết quả nguyên tác. Không phải lúc nào cũng chết.
- Cơ chế vẫn theo nguyên tác. Đây là thiết kế nội dung, không thêm hệ thống lạ.

---

## 1. Chẩn đoán (30/09/2026)

Người chơi máy luôn bỏ lựa chọn nguyên tác ở mốc truyện (`LECH=1`): thắng **0,3%**; tắt hẳn cơ chế lệch vẫn 0,5%. Nguyên nhân nằm ở nội dung.

**Lỗ hổng 1: mỗi mốc chỉ có một lượt chọn.** Nhánh lệch gần như luôn là "đánh trực diện", như đánh Bạch Ngưng Băng, xông vào lang triều hay liều với Lang Vương. Người chơi không có cách nào tìm ra lối khác bằng sự khéo léo.

**Lỗ hổng 2: phần thưởng lớn chỉ nằm trên đường nguyên tác.** Huyết Lô, lối thoát ngầm và trận cuối dễ nhất (hồi đầy, độ khó ×0,7) đều đòi đi đúng truyện.

**Lỗ hổng 3: ký ức phản tác dụng mà không có cảnh báo.** Người đi lệch dính 599 lần phản tác dụng, so với 178 lần đúng.

---

## 2. Cốt lõi: cảnh nhiều bước và hội thoại (PR 4 và PR 5 trong BAN_GIAO_2)

### 2.1 Máy của cảnh

| Thành phần | Tác dụng |
|---|---|
| `talk` | Chuỗi câu thoại, mỗi câu một người nói (dùng lại `speakerHTML`). Manh mối nằm trong lời thoại. |
| `stay:1` | Hành động phụ: dò xét, hỏi thêm, quan sát. Cảnh vẫn mở. Mỗi cảnh có `budget` 2–3 lượt, nên phải chọn hỏi gì. |
| `flag:'x'` | Hành động phụ bật một cờ riêng của cảnh (`S.sc[id].x`). |
| `hidden:'x'` | Lựa chọn chỉ hiện khi cờ `x` đã bật: tức là ngươi đã phát hiện ra điều gì đó. |
| `go:'id'` / `goOk` / `goFail` | Chuyển sang nút con của cảnh. |
| `tense` | Độ căng của cảnh, từ 0 đến 3. Chọn vụng thì tăng; lên tới 3 thì cảnh nổ (thường là trận đánh, hoặc rẽ về kết quả nguyên tác). |
| Nhãn lựa chọn | Lựa chọn mở nhờ ký ức: "憶". Mở nhờ dò xét: "察". Mở nhờ quan hệ: "情". |

Manh mối đến từ 4 nguồn, và chính là phần thưởng của vòng lặp:
- **Lời thoại trong chính cảnh đó.** Đọc kỹ thì thấy.
- **Hành động phụ `stay`.** Tốn lượt của cảnh.
- **Ký ức kiếp trước, kể cả cái chết.** Ví dụ: chết dưới tay Bạch Ngưng Băng thì biết thể chất đang giết hắn.
- **Quan hệ và việc đã làm ở cảnh trước.** Ví dụ: đã cứu Nhược Nam thì nàng nói thật.

Nhờ vậy, lần đầu gặp một cảnh thường thất bại; lần sau ngươi biết hỏi gì. Đó mới là "lần này ta biết hắn đi đường nào".

### 2.2 Tám cảnh đi lệch

Mỗi cảnh có ít nhất một chuỗi lựa chọn đi lệch mà vẫn qua được. Nhiều cảnh có hai chuỗi: một chính đạo, một ma đạo.

| Mốc | Nguyên tác | Đường lệch thành công (chuỗi chọn đúng) | Chọn sai |
|---|---|---|---|
| **Giả Kim Sinh** (tuần 11) | Dụ ra bờ sông, giết | Dò xét, phát hiện hắn đang nợ sòng bạc Thương gia và sợ anh trai. Ép hắn thành tai mắt trong Giả gia: không án mạng, không bị điều tra, mỗi tháng nhận tin và nguyên thạch. | Hắn nhận ra bị ép, về mách anh: bị điều tra như đã giết người, mà không được gì. |
| **Bạch Ngưng Băng** (tuần 17) | Nói về cái chết và tự do | Quan sát thấy hàn khí làm tay hắn run. Hỏi về Bắc Minh Băng Phách Thể. Đưa Hỏa Lô Cổ hoặc Sinh Cơ Diệp cho hắn thử. Kết giao sớm (`baiAlly` sớm), mở kết cục cùng xuống núi. | Hắn thấy bị thương hại: trận thử sức (xem 3.1). |
| **Hàn khí giữa lang triều** (tuần 20) | Đứng xem, Thanh Thư chết | Ba cách, cách nào cũng đòi đã biết hoặc đã dò ra từ trước: báo trước cho Thanh Thư về Mộc Mị Cổ (từ cảnh tuyến Thanh Thư); đánh vào chỗ hàn khí yếu (đã quan sát ở tuần 17); rủ Phương Chính cùng chặn. Thanh Thư sống, không cần đánh tay đôi với Bạch Ngưng Băng. | Thanh Thư vẫn dùng Mộc Mị và chết (kết quả nguyên tác). Ngươi bị thương. |
| **Lang Vương** (tuần 21) | Dọn sói lẻ | Thuyết phục gia lão dựng trận theo nhịp sấm của Lang Vương (từ ký ức hoặc dò xét). Cùng đánh, thắng thì được danh vọng lớn, thưởng, và một cổ Lôi Quan. | Gia lão không nghe: trận có gia lão cứu (xem 3.1). |
| **Lăng mộ** (tuần 24) | Một mình xuống mộ | Báo tộc trưởng nhưng mặc cả trước: đòi quyền vào mộ cùng, chia một phần chiến lợi phẩm, được biết lối thoát ngầm. Đường chính đạo lấy được Huyết Nguyệt và lối thoát; không có Huyết Lô. | Tộc phong tỏa, ngươi trắng tay (như hiện tại). |
| **Vòng vây của thần bổ** (tuần 25) | Để lộ lăng mộ cho hắn | Qua Thiết Nhược Nam, cho Thiết Huyết Lãnh bằng chứng về huyết đạo của Nhất Đại. Hắn chuyển mục tiêu, và có thể thành đồng minh ở tuần 26. | Hắn rút đao. Được phép chạy, không còn là chết chắc. |
| **Huyết Cương** (tuần 26) | Để thần bổ và Huyết Cương cùng chết | Hội thoại gom liên minh: thần bổ, tộc trưởng, Phương Chính, Thanh Thư (ai còn sống và thân với ngươi). Càng đông, trận càng dễ; đồng minh cùng ra đòn. | Chỉ còn mình ngươi, như hiện tại. |
| **Trận cuối** (tuần 27) | Tế Huyết Lô | Chính đạo: kêu gọi tộc nhân, cần danh vọng cùng các việc đã làm ở cảnh trước. Ma đạo: đổi đường sống với Bạch gia, hoặc cùng Bạch Ngưng Băng. Tộc nhân yểm trợ thì hồi khí huyết trước trận, thay cho hệ số dễ ×0,7 chỉ dành cho nguyên tác. | Đánh một mình. |

Các cảnh nối vào nhau: điều dò ra ở cảnh trước mở lựa chọn ở cảnh sau. Đi lệch sớm mà khéo thì càng về sau càng có nhiều cửa.

### 2.3 Hội thoại làm manh mối
- Mỗi cảnh trên có 3–6 câu thoại trước lượt chọn đầu, khoảng 120 ký tự mỗi câu, tự viết.
- Manh mối cài vào lời nói. Ví dụ: Giả Kim Sinh buột miệng nhắc "sòng bạc", Bạch Ngưng Băng khẽ nắm cổ tay.
- Người chơi đọc kỹ thì biết nên dò gì; tâm cơ cao thì game tô đậm manh mối.
- Tua nhanh và chế độ giảm chuyển động hiện hết ngay. Đã gặp cảnh ở lần chơi trước thì bấm để bỏ qua.

---

## 3. Lưới an toàn: chọn sai không có nghĩa là chết

### 3.1 Trận thử sức và trận được cứu
- **`spar`, thử sức.** Khí huyết người chơi còn dưới 25% thì trận dừng. Thua thì mất ít nguyên thạch hoặc bị thương tích; thắng thì phần thưởng lớn. Dùng cho Bạch Ngưng Băng lần đầu, Hùng Lâm, và trinh sát Bạch gia khi đi tuần cùng tiểu tổ.
- **`rescue`, được cứu.** Có đồng minh đứng cạnh. Khí huyết dưới 25% thì đồng minh kéo ngươi ra, và truyện rẽ về kết quả nguyên tác. Dùng cho Thanh Thư lúc lang triều, gia lão khi đánh Lang Vương.
- Trận sinh tử thật chỉ còn ở: trận cuối, Huyết Cương, thẩm vấn, sát thủ, Giả Kim Sinh ở bờ sông.

### 3.2 Đồng minh trong trận
- `fight(k,{allies:[...]})`: mỗi lượt đồng minh tự đánh một đòn hoặc đỡ một đòn.
- Đồng minh hiện thành ấn chữ nhỏ trên đấu trường.
- Nguồn đồng minh là kết quả của các cảnh ở mục 2.2. Hội thoại khéo thì trận dễ hơn: ngoại giao đổi ra sức chiến đấu.

### 3.3 Cảnh báo ký ức
- Mức "Có chỗ lạ" trở lên: nhãn đổi thành "憶 Ký ức · không chắc".
- Tâm cơ ≥ 12: mốc đã đổi thì nhãn đỏ "憶 · đã sai".
- Hành động phụ dò xét ở mốc truyện có thể **lộ ra biến thể hiện tại**. Đây là cách chủ động kiểm tra thế giới đã lệch chưa.

---

## 4. Phụ trợ, làm sau khi các cảnh đã chạy
- **Tàng khố gia tộc:** danh vọng mở kho của tộc (xá lợi, cổ Nhị và Tam chuyển), để đường chính đạo có nguồn sức mạnh.
- **Nguyên tuyền:** mỗi tháng 1 lần khi danh vọng ≥ 30.
- **Dị số theo đạo tâm:** lệch càng cao thì tỉ lệ cơ duyên càng lớn.

---

## 5. Đo bằng 4 kiểu người chơi máy
`BOT=nguyentac | chinh | ma | khotu` trong `tools/sim.cjs`.
- Người chơi máy đi lệch có "trí nhớ" đơn giản: đã thấy cờ manh mối hoặc đã có ký ức thì chọn lựa chọn `hidden` tương ứng.
- Muốn đi đúng chuỗi, người chơi máy cũng phải học qua các lần chơi, giống người thật.

**Nghiệm thu:**
- Mỗi bot thắng 15–35% trong 6 lần chơi.
- Chênh lệch giữa các bot ≤ 12 điểm.
- Bot đi lệch lần đầu thắng ít (chưa biết chuỗi), các lần sau tăng rõ.

---

## 6. Thứ tự

| PR | Nội dung | Ước lượng |
|---|---|---|
| L1 | 4 bot mô phỏng, số đo gốc | nửa buổi |
| L2 | Máy của cảnh: `stay`, `flag`, `hidden`, `go`, `tense`, `talk`; giao diện bong bóng thoại; tua nhanh và bot hiểu cảnh | 1,5 buổi |
| L3 | Trận thử sức, trận được cứu, đồng minh trong trận | 1 buổi |
| L4 | 4 cảnh đầu: Giả Kim Sinh, Bạch Ngưng Băng, Hàn khí lang triều, Lang Vương | 1,5 buổi |
| L5 | 4 cảnh sau: Lăng mộ, Thần bổ, Huyết Cương, Trận cuối; cảnh báo ký ức | 1,5 buổi |
| L6 | Cân lại bằng 4 bot; tàng khố và nguyên tuyền nếu đường chính đạo còn yếu | nửa đến 1 buổi |

---

## 7. Cần bạn chốt
1. Tám cảnh ở mục 2.2 và hướng đi lệch của từng cảnh có đúng ý bạn không? Có mốc nào bạn muốn một hướng lệch khác?
2. Lần đầu gặp cảnh thì thường thất bại (chưa biết chuỗi), phải học qua các lần chơi. Được không, hay muốn người đọc kỹ có thể qua ngay lần đầu?
3. Chọn sai thì rẽ về kết quả nguyên tác thay vì chết (Thanh Thư vẫn chết, ngươi sống). Được không?
