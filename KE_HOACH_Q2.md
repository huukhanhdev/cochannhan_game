# Kế hoạch: sửa lối chơi lệch nguyên tác, rồi làm Quyển 2 tới trận "lấy một đối bảy"

Viết ngày 30/09/2026, sau khi PR 1–3 của `BAN_GIAO_2.md` đã lên main (commit `54287fd`).
Nguồn canon: `NGUYEN_TAC_Q2.md`, đã đọc tới VN 446. Phạm vi Quyển 2 trong kế hoạch này chỉ tới đó; phần sau đọc tiếp khi làm tới.

Thứ tự: **Phần 0 phải xong trước.** Nếu chưa sửa thì Quyển 2 càng làm càng khó chơi, vì độ lệch mang sang Quyển 2 sẽ khuếch đại đúng lỗi này.

---

## Phần 0. Đi lệch nguyên tác gần như không qua nổi (ưu tiên cao nhất)

### Số đo (sau `54287fd`, 200 chiến dịch × 6 kiếp)

| | Bot bám nguyên tác (`node tools/sim.cjs 200 6`) | Bot cố tình lệch (`LECH=1 node tools/sim.cjs 200 6`) |
|---|---|---|
| Thắng trong 6 kiếp | ~34% (69/200) | **0%** |
| Tới được tuần 27 | 80 lần | 2 lần |
| Độ lệch trung bình lúc chết | 18 | 63 |
| Lựa chọn ký ức: đúng / phản tác dụng | 116 / 83 | 130 / **383** |
| Tuần phải chơi lại mỗi chiến dịch | 76 | 92 |
| Chết nhiều nhất | Lang triều, Giả Kim Sinh | **Trinh sát Bạch gia (242), Bạch Ngưng Băng (221), Hùng gia (145)** |

Người chơi test tay thấy đúng như số đo: rẽ khác truyện là chết liên tục.

### Nguyên nhân

1. **Lệch chỉ có phạt, không có thưởng.** Nhánh lệch hầu hết dẫn vào trận khó hơn (`mod:1.35–1.4`, `flee:false`) mà không cho gì thêm. Ví dụ `c_baigia` (events.js:115, 117), `c_bai` (126, 133), `c_lang2` (153). Nguyên tắc số 1 của `KE_HOACH.md` là "cốt truyện được lệch thoải mái", nhưng hiện lệch là con đường chắc chắn thua.
2. **Vòng xoáy lệch.** Chết → Thiền quay ngược → +6 lệch → ký ức sai → chết tiếp → +6. Thêm +8 mỗi lần chọn khác nguyên tác và dư âm kiếp trước. Bot lệch chạm ngưỡng 75 rất sớm, cả lịch mốc cũng xê dịch.
3. **Ký ức sai bị phạt gấp đôi.** Khi mốc đã đổi, lựa chọn ký ức không chỉ mất lợi thế mà còn đưa vào trận ×1.4 không được chạy. Người chơi không có cách biết trước ngoài nhãn mơ hồ trên thanh trạng thái.
4. **Độ khó chỉ cân theo bot bám truyện.** `DIFF` đã lên 1.36 dựa trên bot bám truyện. Cổng kiểm tra không có ca "đi lệch".
5. **Dị số thiên về họa.** Chúng chen vào đúng lúc người chơi đã yếu vì lệch.

### Cách sửa (PR 0, khoảng 1 buổi)

- **Lệch là đổi rủi ro lấy thứ khác.** Mỗi nhánh lệch lớn phải có phần được: cổ của đối thủ, quan hệ, tin tức, hoặc tránh được một trận nguyên tác nguy hiểm về sau. Rà khoảng 15 lựa chọn có `drift` hoặc lựa chọn không `canon` ở các mốc, gắn phần thưởng tương xứng.
- **Ký ức sai thì chỉ mất lợi thế.** Khi `varShifted(k)`, lựa chọn ký ức đưa về trận thường (`mod:1`, cho chạy) kèm câu "ký ức không còn đúng". Không phạt thêm.
- **Hãm vòng xoáy.**
  - Thiền quay ngược: +6 → +3.
  - Chọn đúng nguyên tác: −3 → −5.
  - Lệch do chết không vượt quá 50 (chỉ lựa chọn của người chơi mới đẩy lên 75+).
- **Lệch cao có bù.** Ở mức "Tương lai mờ mịt", dị số rút 50% cơ duyên / 50% họa (hiện khoảng 40/60). Mỗi dị số đã gặp cho +1 ngộ tính lần đầu.
- **Dò trước khi liều.** Làm sớm một phần PR 4: lựa chọn phụ "dò xét" ở 7 mốc có biến thể, cho biết mốc đó còn như ký ức không. Tốn 1 tâm cơ hoặc 1 lượt.
- **Cổng kiểm tra mới.** Thêm vào cổng của mọi PR: `LECH=1 node tools/sim.cjs 300 6` thắng ≥ 12% và không ca kẹt vòng lặp. Bot bám truyện vẫn trong 15–35%.

Nghiệm thu: hai con số trên đạt, nguyên nhân chết của bot lệch không dồn vào một trận nào quá 20%.

---

## Phần 1. Quyển 2 tới VN 446

Bản này thay mục "PR 6+" của `BAN_GIAO_2.md` và Đợt 7 của `KE_HOACH.md`.

### Review phần Quyển 2 trong `BAN_GIAO_2.md`

- **Giữ:** khung chương `S.chap`/`CHAPTERS`, `META.q2Unlocked`, kết rời núi mở Quyển 2, minigame truyền thừa theo ải, "cảnh phản bội cần Thiền đã hồi phục".
- **Sửa theo canon:**
  - Thiếu hẳn chặng **sông Hoàng Long** (VN 207–227) và việc **Tâm Từ lên thiếu chủ** (391–406).
  - Tam Vương không phải một minigame chung: **Khuyển Vương** là đánh bằng bầy chó, **Tín Vương** là luyện cổ đấu người lông, **Bạo Vương** chưa đọc.
  - Tố Thủ y sư ở canon chữa mặt và tai cho PN, và giải thích chuyện Dương cổ. Chuyện "giải Độc Thệ cổ rồi phản bội" nằm ở phần chưa đọc. Chưa viết cảnh này.
- **Không mang nguyên độ lệch sang Quyển 2.** Chỉ mang cờ lớn (dư âm) và biến thể đã lộ. Mang nguyên con số sẽ làm vòng xoáy ở Phần 0 lặp lại, nặng hơn.

### Khởi đầu Quyển 2 theo canon

Sau lần dùng Thiền thứ hai, PN mất gần hết:
- Nhất chuyển sơ kỳ, tư chất Giáp 9 thành (nếu có Huyết Lô).
- Còn Thiên Nguyên Bảo Liên, Đâu Suất Hoa, Tửu trùng, Xuân Thu Thiền đang kiệt.
- Cổ Thanh Mao chết đói dần trên đường.
- BNB là nữ, mất Bắc Minh Băng Phách, đi cùng vì Dương cổ.

Game dùng đúng trạng thái này. Kết cục Quyển 1 chỉ đổi phần phụ: có Huyết Lô hay không, BNB đi cùng hay gặp lại sau, Phương Chính đã chết hay mất tích.

### Chương và PR

| PR | Chương | Canon (VN) | Cơ chế mới | Mốc cố định (quán tính đại sự) |
|---|---|---|---|---|
| **E1** | Khung | – | `S.chap`, `CHAPTERS` (lịch mốc, hành động, điều kiện hết chương), save riêng từng chương. Thiền quay ngược không vượt qua đầu chương. `META.q2Unlocked`. | – |
| **E2** | 2.1 Sông Hoàng Long | 207–227 | Cổ đói chết dần (đã có cơ chế đói). BNB đồng hành: chỉ số **tin phục**, và **Thề Độc** thành ràng buộc hai bên. Trận thú: cá sấu vương 6 chân, cá sấu dung nham, Hiên Viên Thần Kê (nên chạy). Trần Thúy Hoa. | Tới Bạch Cốt Sơn |
| **E3** | 2.2 Bạch Cốt Sơn | 228–250 | Dungeon truyền thừa Hôi Cốt Tài Tử: nhiều sảnh, chọn 1 trong 3 cổ, sảnh giả, gõ răng. Cảnh hiến tế Bách Sinh–Bách Hoa là lựa chọn (canon: hiến tế → Cốt Nhục Đoàn Viên). Đoàn Thiết gia đầu tiên và bẫy Thổ Đậu. Trốn bằng Vô Túc Điểu. | Rơi xuống Tử U |
| **E4** | 2.3 Thương đội | 251–294 | Tên giả, danh tiếng trong đoàn, buôn bán (cỏ Kim gia), thú tấn công. Ám sát trong đoàn không để lộ (Trương Trụ). Đinh Hạo và cương thi. | Tới núi Thương Lượng |
| **E5** | 2.4 Thương gia thành | 295–390 | Bán bí phương. Lệnh bài 9 cấp. **Đổ thạch thật** (nâng từ mổ thạch). **Diễn võ trường xếp hạng** từ nội thành 5 lên 3 (dùng lại đấu trường). **Lực đạo**: hư ảnh thú lực, Toàn Lực Ứng Phó, Khổ Lực, Khí Lực. Lý Nhiên, Bách gia, Nhai Tí. | Tin Tam Vương mở |
| **E6** | 2.5 Thiếu chủ | 391–406 | Chọn phe (canon: Thương Trào Phong). Thu người cho Tâm Từ: anh em Hùng, Vệ Đức Hinh, Chu Toàn. Lên Tứ chuyển. | Ngày Tam Vương mở (không dời) |
| **E7** | 2.6 Tam Xoa: Khuyển Vương | 407–438 | Lập hung danh. Minigame ải: bầy chó tự đánh, chọn hướng thưởng, rút lui giữa chừng. Cường giả Tam Xoa là mối đe dọa nền. | BNB bị Thiết gia vây |
| **E8** | 2.7 Tín Vương và trận Thiết gia | 439–446 | Luyện cổ theo ải (dùng lại minigame luyện cổ, nguyên liệu tích lũy qua ải, nịnh người lông). Luyện **Cốt Dực**. Trận "lấy một đối bảy": nhiều giai đoạn, bay lên để thoát vây, phá cổ viễn chiến của địch trước. | Điểm dừng: "còn tiếp" |

Mỗi PR khoảng 1–2 buổi. E5 lớn nhất, có thể tách E5a (thành, chợ, đổ thạch) và E5b (diễn võ, lực đạo).

### Nguyên tắc lệch ở Quyển 2

- **Mốc lớn giữ ngày** (Tam Vương mở, Thiết gia tới). Canon có nói rõ: chuyện nhỏ đổi được, đại sự có quán tính.
- **Giữa các mốc là tự do.** Mỗi chương có ít nhất một con đường lệch thắng được, ví dụ không hiến tế Bách Sinh mà cướp truyền thừa bằng đường khác, hoặc đưa người khác lên thiếu chủ.
- **Ký ức lệch lấy từ canon:** đá Tinh Thần rỗng (VN 329) là mẫu. Ký ức sai thì mất lợi thế, không mất mạng.

### Nội dung giữ đúng canon

Giữ nguyên các cảnh tàn nhẫn và 18+ của canon, chỉ diễn tả bằng chữ (theo yêu cầu người chơi, game dùng cá nhân): hiến tế, tự rạch mình để lừa, giết người lập uy, trận Thiết gia. Không gắn nhãn.

### Cổng kiểm tra cho từng PR Quyển 2

- `node tools/check.cjs`: không lỗi.
- Bot Quyển 2 (thêm vào `sim.cjs`, bắt đầu từ `META.q2Unlocked`): bám truyện 20–35%, lệch ≥ 12% mỗi chương.
- Chơi thử trong trình duyệt hết chương vừa làm, không lỗi JS.

---

## Việc cần người chơi chốt

| # | Câu hỏi | Mặc định đề xuất |
|---|---|---|
| 1 | Làm Phần 0 trước PR 4–5 của `BAN_GIAO_2`? | Có |
| 2 | Quyển 2 một lượt = 1 tuần hay 1 tháng? Canon Thương gia thành kéo gần 2 năm | Đi đường tính theo tuần, trong thành tính theo tháng |
| 3 | Thiền quay ngược có vượt qua đầu chương không | Không |
| 4 | Bắt đầu thẳng Quyển 2 khi chưa qua Quyển 1 | Chỉ khi đã có `META.q2Unlocked` |
