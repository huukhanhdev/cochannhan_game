# Kế hoạch nâng cấp chiến đấu: lấy yếu đối mạnh

**Vấn đề người chơi gặp:** chiến đấu quá đơn giản. Boss máu quá nhiều, không có cách thắng nào ngoài dồn sát thương.

**Nguyên tắc:**
- Cơ chế phải có trong truyện, hoặc dùng lại cơ chế đang có.
- Trong Cổ Chân Nhân, kẻ yếu thắng kẻ mạnh nhờ bốn thứ: **chân nguyên của đối phương có hạn**, **khắc chế giữa các con cổ**, **nắm đúng sơ hở**, và **không cần giết mới là thắng** (cầm chân, thoát thân, mượn tay người khác).

---

## 1. Hiện trạng (đo bằng bot, 200 chiến dịch)

| Địch | Máu thật (sau DIFF) | Thắng | Được tha | Chết | Số lượt TB |
|---|---|---|---|---|---|
| Lôi Quan Lang (nhánh nguyên tác "dọn sói lẻ") | 884 | 43% | – | **57%** | 5,7 |
| Bạch Ngưng Băng | 805 | **0%** | 59% | 41% | 4,0 |
| Huyết Cương Nhất Đại | 1572 | 36% | 27% | 36% | 5,9 |
| Huyết Thủ ma tu (tử kiếp) | 890 | **0%** | – | **100%** | 4,0 |
| Hộ vệ Cổ gia | 324 | 31% | – | 69% | 6,2 |
| Gia lão Bạch gia (trận cuối) | 991 | 59% | – | 41% | 5,7 |

**Chẩn đoán:**
1. **Trận nào cũng là đua máu trong 4–7 lượt.** Địch có 4 ý đồ (đánh, dồn lực, thủ, kỹ năng) chọn ngẫu nhiên. Người chơi chỉ có một câu hỏi: đánh hay hộ thể.
2. **Không có cách thắng nào ngoài làm máu về 0.** Cầm chân, phá trận, thoát thân đều không có trong luật trận đánh; chúng chỉ nằm ở lựa chọn trước trận (`mod`, `spare`).
3. **Boss không có điểm yếu.** Khắc chế hiện chỉ có 3 cặp (hàn/hỏa, chảy máu/hồi máu, diện rộng/bầy).
4. **Cuồng nộ từ lượt 8** khiến kế hoạch đánh lâu (tiêu hao) luôn thua.
5. **Địch không bao giờ hết chân nguyên**, trong khi người chơi thì có.

---

## 2. Năm cơ chế mới

### 2.1. Chân nguyên của địch (theo truyện: Cổ sư nào cũng giới hạn bởi chân nguyên)
- Địch là **Cổ sư** thì có thanh chân nguyên. Kỹ năng và đòn dồn lực tốn chân nguyên. Hết thì chỉ còn đánh thường hoặc thủ thế, và hiện chữ "Cạn chân nguyên".
- Có Tửu Trùng thì chân nguyên của ngươi tinh luyện hơn. Hút chân nguyên (`drain`) giờ chuyển được chân nguyên của địch sang ngươi.
- **Thú hoang** không có chân nguyên, thay bằng **thể lực**: sau 2 đòn dồn lực liên tiếp thì phải thở dốc một lượt.
- **Lấy yếu đối mạnh:** hộ thể đúng lúc địch dồn lực làm địch tiêu hao, rồi phản công khi địch cạn.

### 2.2. Thế và sơ hở
- Boss và tinh anh có thanh **thế** (hiện dưới thanh máu).
- Khi địch đang **dồn lực hoặc tụ kỹ năng**, đánh trúng bằng cổ có choáng, xuyên giáp hoặc khắc chế thì thế giảm mạnh. Đánh thường chỉ giảm ít.
- Thế về 0 thì địch **lộ sơ hở 2 lượt**: không hành động, nhận sát thương ×1,5. Đòn đang tụ bị hủy.
- **Lấy yếu đối mạnh:** đọc ý đồ, giữ đòn mạnh cho đúng lúc, không xả bừa.

### 2.3. Khắc chế và điểm yếu của từng boss
Mỗi boss có 1–2 điểm yếu **theo truyện**. Dò xét trước trận (máy cảnh) hoặc có ký ức thì thấy điểm yếu trên chip đặc tính.

| Boss | Điểm yếu | Nguồn |
|---|---|---|
| Bạch Ngưng Băng | Hỏa Lô Cổ chặn hàn khí; sau mỗi đòn băng tiễn khựng nửa nhịp (đã có trong cảnh tuần 20) | Thể chất Bắc Minh Băng Phách tự hại |
| Lôi Quan Lang, Lang Vương | Cổ phòng ngự hành thổ (Cương Nham, Thiết Bì) giảm lôi bạo; chảy máu làm sói dừng tru gọi bầy | Lôi quan cần tích điện |
| Huyết khôi, Huyết Cương | Không hồi máu khi đang chảy máu (đã có); đánh vào vết nứt giữa ngực (cờ `soi_nd` của cảnh) → thế giảm gấp đôi | Cảnh tuần 26 |
| Huyết Thủ ma tu | Hút máu tự hồi: cổ trị liệu của ngươi chặn hút | Ma tu Tam chuyển |
| Cổ sư các nhà | Chân nguyên có hạn (2.1) | – |

### 2.4. Trận có điều kiện thắng khác
Trận nào nguyên tác không có ai giết được đối thủ thì không đòi đánh máu về 0.

| Trận | Điều kiện thắng | Thua khi |
|---|---|---|
| Lang Vương (tuần 20) | **Cầm chân 6 lượt** cho gia lão tới; hoặc hạ nó | Khí huyết về 0 |
| Bạch Ngưng Băng (tuần 17, thử sức) | **Trụ 4 lượt**, hoặc làm hắn lộ sơ hở 1 lần: hắn thấy "thú vị" rồi bỏ đi | – |
| Thiết Huyết Lãnh (Ngũ chuyển) | **Thoát thân**: sống 5 lượt ở gần đường chạy, hoặc chạy được khi hắn lộ sơ hở | Khí huyết về 0 |
| Huyết Cương (tuần 26) | **Phá huyết hạch**: đánh vỡ 3 mạch máu (mỗi mạch một thanh máu nhỏ), hoặc cầm chân tới khi Hạc Tai giáng xuống (8 lượt) | Khí huyết về 0 |
| Trận cuối, gia lão Bạch gia | **Mở đường chạy**: giữ thanh "đường thoát" (tăng khi thủ hoặc đánh trúng, giảm khi trúng đòn) tới 100%; hoặc hạ gục | Khí huyết về 0 |
| Huyết Thủ ma tu (tử kiếp) | Hạ gục **hoặc** bắt hắn cạn chân nguyên rồi chạy | Khí huyết về 0 |

- Giao diện hiện **thanh mục tiêu** ngay trên thanh máu địch, ví dụ "Cầm chân: 3/6 lượt".
- Nhờ vậy, boss máu cao vẫn thắng được **mà không cần giảm máu**. Muốn hạ gục thật thì vẫn phải có đủ cảnh giới và đủ sát chiêu.
- **Bỏ cuồng nộ lượt 8** ở các trận có điều kiện thắng khác. Thời gian lúc đó đứng về phía người chơi, đúng tinh thần cầm chân.

### 2.5. Đồng minh trong trận
Cảnh tuần 26 đã có "gọi đồng minh", nhưng hiện chỉ là giảm `mod`. Giờ đồng minh **ra tay mỗi lượt**, có chân dung nhỏ bên cạnh người chơi:

| Đồng minh | Mỗi lượt | Đặc biệt |
|---|---|---|
| Phương Chính | Nguyệt nhận, ~40% sức người chơi | Có thể chắn một đòn chí mạng cho ngươi, một lần |
| Thanh Thư | Dây leo: 30% cơ hội trói địch 1 lượt | Nếu Thanh Thư dưới 30% máu thì có thể tự dùng Mộc Mị Cổ (đúng truyện) |
| Thiết Huyết Lãnh (đồng minh) | Đánh mạnh; 2 lượt một lần khóa kỹ năng địch (Trấn Ma Thiết Tác) | Đi rồi thì không quay lại |
| Bạch Ngưng Băng (đồng minh) | Băng tiễn, làm địch chậm | Trụ không lâu: mỗi lượt tự mất máu (thể chất) |

- Địch đánh đồng minh hoặc người chơi theo tỉ lệ, nên trận có thêm lựa chọn "để bạn chịu đòn hay tự đỡ".

### 2.6. Chuẩn bị trước trận
Các cờ đã có (dò xét trong cảnh, `wolfPrep`, ký ức, `hide`) giờ hiện ở đầu trận thành dòng **"Lợi thế:"**, ví dụ "Biết nhịp hàn khí (sơ hở đầu tiên tới sớm)" hoặc "Nghiên cứu cách săn của Điện Lang (+15% sát thương lên sói)". Người chơi thấy rõ việc chuẩn bị có tác dụng.

---

## 3. Giao diện trận

- Thanh máu địch: thêm thanh **thế** (vàng) và **chân nguyên** (xanh) nếu có.
- Dưới ý đồ: một dòng **gợi ý đối sách**, ví dụ "Dồn lực: hộ thể, hoặc dùng cổ có choáng để phá thế".
- **Thanh mục tiêu** cho các trận có điều kiện thắng khác.
- Khi địch lộ sơ hở: hiệu ứng rạn nứt, chữ "SƠ HỞ".
- Kết thúc trận: dùng **thẻ kết quả** (đã có).

---

## 4. Các PR

| PR | Nội dung | Kiểm tra |
|---|---|---|
| **B1** | Chân nguyên hoặc thể lực của địch, thế và sơ hở, gợi ý đối sách, giao diện thanh mới. Nút Tự đánh (`autoAct`) biết giữ đòn phá thế | sim bám truyện vẫn 40–45%; mỗi trận boss ≥ 6 lượt trung bình |
| **B2** | Điều kiện thắng khác và thanh mục tiêu cho 6 trận ở mục 2.4. Bỏ cuồng nộ ở các trận đó. Điểm yếu boss và chip "đã biết" | Tỉ lệ chết ở từng boss ≤ 50%; Bạch Ngưng Băng và Huyết Thủ ma tu không còn 0% thắng |
| **B3** | Đồng minh trong trận; dòng "Lợi thế:" đầu trận | Trận Huyết Cương có đồng minh dễ hơn rõ rệt; bot đi lệch ≥ 30% |
| **B4** | Cân lại `DIFF` và máu từng boss; `sim2.cjs` cho Quyển 2 | Cổng đầy đủ |

**Thứ tự:** B1 trước vì mọi thứ khác dựa trên thế và chân nguyên. B2 là phần giải quyết trực tiếp "boss máu quá nhiều".

---

## 5. Cần anh chốt

1. **Điều kiện thắng khác ở mục 2.4.** Có trận nào anh muốn bắt buộc phải hạ gục không? Ví dụ Huyết Cương: trong truyện là Thiết Huyết Lãnh và Hạc Tai hạ, nên mình để "phá huyết hạch" hoặc "cầm chân".
2. **Đồng minh chỉ là máy tự đánh, hay cho người chơi ra lệnh** (tấn công hoặc che chắn)? Mình đề xuất tự đánh cho đơn giản.
3. **Bắt đầu B1 được chưa?**

---

## 6. Đã làm (30/09/2026): chiến đấu thời gian thực

Anh chốt "làm hết, không cần theo lượt". Đã làm cả 5 ý cùng cơ chế cổ bị thương và chết. Code nằm ở `js/rt.js`. Kiểu đánh theo lượt vẫn giữ, đổi ở nút **"Đánh: thời gian thực / theo lượt"** trên thanh trên cùng.

**Nhịp trận:**
- Địch chọn đòn rồi vận chiêu, có thanh vận chiêu và tên đòn. Thời gian vận chiêu: đánh thường 1,1 giây, dồn lực 1,8 giây, kỹ năng 2,2 giây, thủ thế 2 giây.
- Người chơi nghỉ 0,95 giây giữa hai hành động. Mỗi con cổ có thời gian hồi riêng, tính bằng giây.

**Hộ thể đúng khoảnh khắc:** kích cổ phòng ngự trong 0,45 giây cuối trước khi đòn trúng (nhãn "ĐỠ!") thì chỉ nhận 10% sát thương, và thế của địch vỡ nhiều.

**Thế và sơ hở:**
- Đánh trúng khi địch đang vận chiêu thì vỡ thế ×1,6.
- Cổ có choáng hoặc xuyên giáp vỡ thế nhiều hơn; cổ khắc chế vỡ ×2.
- Thế về 0 thì địch lộ sơ hở 2,6 giây: không ra tay, nhận thêm 50% sát thương, đòn đang tụ bị hủy.

**Chân nguyên và thể lực của địch:**
- Cổ sư có chân nguyên (thường 80, thủ lĩnh 160). Dồn lực và kỹ năng tốn chân nguyên; cạn thì chỉ còn đánh thường.
- Thú có 3 nấc thể lực, hồi mỗi 5 giây.
- Hút chân nguyên chuyển chân nguyên của ngươi sang địch.

**Khoảng cách:**
- Ba tầm: Gần, Trung, Xa. Thú áp sát dần; đòn cận chiến của thú hụt nếu ngươi ở xa, và hụt thì mất thế.
- Đánh tay và Cường Thủ Cổ cần áp sát.
- Bỏ chạy phải lùi ra Xa, rồi giữ 1,4 giây không trúng đòn.

**Địa hình:** rừng trúc (đổi tầm nhanh), tuyết (hàn khí rút chân nguyên, trừ khi có Hỏa Lô), tường trại (thú leo chậm), huyết trì (địch hồi máu, trừ khi đang chảy máu), biển lửa (cả hai mất máu), động đá (không lùi quá tầm trung), khe đá hẹp (kẻ to lớn ra đòn chậm; dùng ở các trận Kim Sinh).

**Phục kích:**
- Có Liễm Tức hoặc Ẩn Lân (hoặc nhánh phục kích Kim Sinh) thì trận mở bằng pha lẻn tới gần. Bấm "Lẻn tới" khi ánh mắt địch nằm ngoài vùng tối; đủ 3 bước là ám sát (22% máu, địch lộ sơ hở).
- Bị phát hiện thì địch cảnh giác 15 giây.

**Trận có cách thắng riêng:**

| Trận | Mục tiêu |
|---|---|
| Lang Vương | Trụ 40 giây |
| Lôi Quan Lang | Trụ 30 giây |
| Bạch Ngưng Băng | Trụ 25 giây, hoặc làm hắn lộ sơ hở một lần |
| Thiết Huyết Lãnh | Lấp đầy thanh đường thoát (tăng nhanh ở tầm Xa khi không trúng đòn) |
| Huyết Cương | Phá 3 mạch máu, hoặc trụ 32 giây tới khi Hạc Tai giáng xuống |
| Gia lão Bạch gia (trận cuối) | Mở đường thoát |
| Huyết Thủ ma tu | Hạ gục, hoặc ép cạn chân nguyên rồi bỏ chạy |

Các trận này không bị cuồng nộ.

**Điểm yếu:** hiện thành chip 弱 khi đã dò xét hoặc có ký ức. Ví dụ: Hỏa Lô với Bạch Ngưng Băng; giáp hành thổ đỡ lôi bạo của sói; chảy máu làm sói ngừng tru gọi bầy; cổ trị liệu chặn đòn hút máu của Huyết Thủ ma tu.

**Đồng minh:**
- Phương Chính: nguyệt nhận mỗi 3 giây.
- Thanh Thư: dây leo trói địch.
- Thiết Huyết Lãnh: chém, và khóa kỹ năng địch.
- Bạch Ngưng Băng: băng tiễn làm địch chậm.
- Đã nối vào trận Huyết Cương, trận cuối (Song Hùng, Thanh Thư, cùng Bạch Ngưng Băng) và các trận Quyển 2 có Bạch Ngưng Băng đi cùng.

**Độ bền cổ (theo nguyên tác):**
- Mỗi con cổ có độ bền 100.
- Làm cổ mất độ bền:
  - Đỡ đòn: mất theo lượng sát thương đã chặn. Địch cao chuyển hơn thì mất nhiều hơn; đỡ đúng khoảnh khắc chỉ mất 30%.
  - Bị đánh xuyên hộ thể: mất 15.
  - Dùng cổ tấn công: mất 1,5 mỗi lần.
  - Sát chiêu: mỗi con tham gia mất 10.
  - Bị hàn khí băng phong: mất 8.
  - Cổ đang đói: mọi mức mất ×1,8.
- Dưới 35 là trọng thương: sức còn 6 phần. Về 0 thì cổ chết.
- Hồi phục: nuôi no thì mỗi tuần hồi 35; tĩnh dưỡng hồi thêm 25.
- Tab Cổ trùng hiện thanh độ bền.

**Phím tắt:** 1–9 dùng cổ, Space hộ thể bằng cổ phòng ngự tốt nhất, A áp sát, D lùi, P tạm dừng. Có nút "Tốc độ: thong thả" (chậm còn 55%). Rời tab thì trận tự dừng; tải lại giữa trận cũng dừng sẵn.

**Bot và cân bằng:**
- `rtBot()` phản xạ như người: 55% đỡ đúng khoảnh khắc, 30% đỡ sớm, 15% quên đỡ.
- `sim.cjs 400 6`: **41,3%**, kiếp đầu 6,5%.
- `LECH=1`: khoảng 44% (đo ở sức đánh ×1,7).
- `sim2.cjs`: lần thử đầu 55%.
- Hệ số riêng cho thời gian thực: máu địch ×2,2, sức đánh ×1,8. `DIFF.q2` 0.75 → 0.62.

**Chưa làm / cần anh thử:**
- Bố cục trên điện thoại mới chỉnh cơ bản.
- Tuần chết trung bình khoảng 7, đầu game còn gắt. Nếu anh thấy khó quá thì hạ `atkMul` hoặc chỉnh đường cong theo tuần.
