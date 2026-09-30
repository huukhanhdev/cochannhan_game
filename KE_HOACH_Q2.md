# Kế hoạch: sửa lối chơi lệch nguyên tác, rồi triển khai Quyển 2

Viết ngày 30/09/2026, sau khi PR 1–3 của `BAN_GIAO_2.md` đã lên main (commit `54287fd`).
Nguồn canon: `NGUYEN_TAC_Q2.md`, đã đủ toàn bộ Quyển 2 (VN 190–517).

Thứ tự: Phần 0 (đã làm), rồi Phần 1.

---

## Phần 0. Đi lệch nguyên tác gần như không qua nổi (ưu tiên cao nhất)

### Trạng thái: đã làm (commit `22c6874`), còn nợ phần cân bằng

- Đã làm hết các mục trong "Cách sửa" bên dưới, thêm "địch thử tay" (`spare`): Bạch Ngưng Băng lúc tò mò, Lang Vương, Huyết Cương dừng tay thay vì giết.
- Mô phỏng 300 chiến dịch × 6 kiếp, `DIFF` 1.38: **bám truyện 44%, đi lệch 13–15%** (trước: 34% / 0%).
- Người chơi chốt: tạm chấp nhận đi lệch khoảng 15%. **Nợ lại:** kéo bot bám truyện về dưới 35%. Chỗ lệch lớn nhất còn lại là trận cuối: nhánh Huyết Lô (nguyên tác) hồi đầy máu và giảm 30% sức địch, các nhánh khác không có.

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

### Đối chiếu với bản review của AI khác (về PR 2 của `BAN_GIAO_2`)

Code hiện tại đã theo phần lớn bản review đó:

| Ý review | Trong code sau `54287fd` |
|---|---|
| Không dùng `memB` nhân hệ số; ký ức sai thì **phản tác dụng thật** | Đã làm: `varShifted(k)` đổi kết quả lựa chọn ký ức. Không có `memB` |
| Mỗi lần chơi lại, 1–2 mốc lệch sẵn; quay ngược giữ biến thể | Đã làm: `initVariants()` lệch 2–3 mốc; ảnh chụp tuần giữ `S.var` |
| Không hiện số phần trăm, chỉ 3 mức chữ; tâm cơ ≥ 12 thì nêu tên mốc | Đã làm: `driftChip()`, `shiftVariant()` |
| Không trừ độ lệch khi đi đúng nguyên tác | Đã làm: không có −3 |
| Lệch chỉ tính theo `drift:N` ở lựa chọn thật sự đổi thế cục, không tính mọi lựa chọn khác `canon` | **Chưa làm:** vẫn +8 mỗi lần chọn khác `canon` (`engine.js:238`) |
| Bù cho người đi lệch bằng dị số cơ duyên | Có tỉ lệ, nhưng chưa đủ bù (số đo ở trên) |
| Hồi chiêu sự kiện theo cỡ kho | Đã làm |

Mình đồng ý với hướng của review: ký ức sai phải có hậu quả thật, và không được ngầm đẩy người chơi đi lại đúng truyện. Số đo cho thấy vấn đề không nằm ở hướng này mà ở **liều lượng**: hậu quả quá nặng, cộng dồn quá nhanh, và không có cách phát hiện trước.

### Cách sửa (PR 0, khoảng 1 buổi)

- **Làm nốt ý review: chỉ `drift:N` mới làm lệch.** Bỏ +8 cho mọi lựa chọn khác `canon`. Gắn `drift:N` cho khoảng 15 lựa chọn thật sự đổi thế cục: giết hoặc cứu người, đổi phe, bán tin. Chọn một câu thoại khác truyện thì không làm lệch.
- **Ký ức sai vẫn phản tác dụng, nhưng sống sót được.**
  - Trận do ký ức sai: `mod` tối đa 1.15 (hiện 1.35–1.4), vẫn cho chạy.
  - Có dấu hiệu trước khi rơi vào bẫy: một câu dẫn lạ ("bờ sông yên tĩnh hơn ngươi nhớ"), để người chơi tinh ý còn kịp rút.
- **Lệch là đánh đổi, không phải sai.** Mỗi lựa chọn có `drift:N` phải có phần được ngay: cổ của đối thủ, quan hệ, tin tức, hoặc tránh được một trận nguyên tác nguy hiểm về sau. Ở mức "Tương lai mờ mịt", dị số rút 50% cơ duyên / 50% họa.
- **Hãm vòng xoáy do chết.** Không đẩy người chơi về nguyên tác, chỉ hãm phần lệch không do họ chọn:
  - Thiền quay ngược: +6 → +3.
  - Lệch từ quay ngược, hậu quả trễ và dư âm cộng lại không vượt quá 50. Chỉ lựa chọn của người chơi mới đẩy lên 75+.
- **Dò trước khi liều.** Làm sớm một phần PR 4: lựa chọn phụ "dò xét" ở 7 mốc có biến thể, cho biết mốc đó còn như ký ức không. Tốn 1 tâm cơ hoặc 1 lượt.
- **Cổng kiểm tra mới.** Thêm vào cổng của mọi PR: `LECH=1 node tools/sim.cjs 300 6` thắng ≥ 12% và không ca kẹt vòng lặp. Bot bám truyện vẫn trong 15–35%.

Nghiệm thu: hai con số trên đạt, nguyên nhân chết của bot lệch không dồn vào một trận nào quá 20%.

---

## Phần 1. Triển khai Quyển 2 (VN 207–517)

Bản này thay mục "PR 6+" của `BAN_GIAO_2.md` và Đợt 7 của `KE_HOACH.md`. Nguồn canon là `NGUYEN_TAC_Q2.md`. Mỗi sự kiện ghi số chương VN để đối chiếu.

### 1.1 Mạch chính và vì sao Quyển 2 hợp với game này

Quyển 2 kết thúc bằng đúng cơ chế cốt lõi của game: **chết vì bị phản bội, dùng Xuân Thu Thiền quay lại, đổi kế hoạch và thắng** (VN 486–517). Toàn bộ Quyển 2 nên dựng để dồn về khoảnh khắc đó:
- **Thiền là tài nguyên cả quyển.** Đầu Quyển 2, Thiền kiệt sức (vừa dùng lần 2 ở Thanh Mao). Nó hồi dần qua các chương. Quay ngược vì chết vặt ở giữa quyển sẽ tiêu Thiền và làm nó chưa kịp hồi cho cảnh phản bội.
- **Cảnh phản bội là "vòng lặp nhỏ" có chủ đích.** Lần đầu vào điện luyện cổ, người chơi gần như chắc chắn bị Bạch Ngưng Băng bán và bị Vô Cực Sưu Tỏa khóa. Nếu Thiền đã hồi, quay ngược sẽ mở nhánh ký ức mới: biết Định Tinh cổ nằm ở tay trái, biết phúc địa không giữ nổi, và mở lựa chọn luyện **Định Tiên Du**. Nếu Thiền chưa hồi thì đó là kết cục thua có chủ đích.
- **Cánh bướm ở Quyển 2 lấy từ canon:** đá Tinh Thần rỗng (VN 329) là "ký ức sai" đầu tiên, mốc lớn thì có quán tính (Tam Vương mở đúng ngày), còn Phương Chính vẫn sống là "dị số" mà Phương Nguyên không biết.

### 1.2 Khởi đầu Quyển 2

- **Cửa vào:** thắng Quyển 1 bằng các kết `ma`, `bai_dong`, `huyetlo`, `huyetlo_bai`, `tien_lo`, `phan_toc`. Kết `chinh`, `thanhthu_chinh` và `song_hung` là Phương Nguyên ở lại chính đạo, không hợp canon Quyển 2; các kết này chỉ mở Quyển 2 sau khi đã có `META.q2Unlocked` từ một lần thắng khác.
- **Trạng thái đầu, theo canon VN 207–210:**
  - Nhất chuyển sơ kỳ.
  - Tư chất lấy theo kết Quyển 1: có Huyết Lô thì Giáp 9 thành, không có thì Ất.
  - Cổ còn lại: Xuân Thu Thiền (kiệt), Thiên Nguyên Bảo Liên, Đâu Suất Hoa, Tửu trùng. Các cổ khác từ Quyển 1 đi cùng nhưng chết đói dần trong chương 2.1.
- **Bạch Ngưng Băng:** canon là nữ, đi cùng vì Dương cổ. Nếu kết Quyển 1 không có nàng (`ma`, `tien_lo`, `phan_toc`) thì gặp lại ở bờ sông Hoàng Long, nửa sống nửa chết. Không viết nhánh không có nàng.
- **Dư âm từ Quyển 1:** chỉ mang cờ lớn (`META.lastEchoes`), không mang con số độ lệch. Ví dụ Thanh Thư còn sống thì Quyển 2 có tin đồn về hắn, Phương Chính chết hay mất tích thì đổi cảnh xen ở Trung Châu.

### 1.3 Kiến trúc

Quyển 1 đang cứng hóa: `CANON`, `FINAL_TURN`, `ACTS`, `LOC_NAME`. Quyển 2 cần bảng dữ liệu theo chương:

```js
S.book       // 1 | 2
S.chap       // khóa chương hiện tại, ví dụ 'q2_hoanglong'
CHAPTERS[k] = {
  title, unit:'tuần'|'tháng', turns:N,   // độ dài chương
  canon:{t:'evId'},                      // lịch mốc trong chương
  acts:[...], locs:{id:tên},             // hành động và nơi chốn
  start(), end:()=>bool, next:'khóa',    // vào chương, điều kiện hết chương
}
```

- `engine.js` đọc qua `curCanon()`, `curActs()`, `curLocs()`, `curFinal()` thay cho hằng số. Quyển 1 thành một mục trong `CHAPTERS`, hành vi không đổi.
- File mới, nạp sau `butterfly.js`, và thêm vào `index.html`, `tools/sim.cjs`, `tools/ff_test.cjs`, `tools/check.cjs`:
  - `js/q2/data2.js`: cổ, địch, công thức, NPC, ký ức của Quyển 2.
  - `js/q2/events2.js`: sự kiện theo chương.
  - `js/q2/luc.js`: hệ lực đạo.
  - `js/q2/city.js`: Thương gia thành.
  - `js/q2/truyenthua.js`: minigame ải.
  - `js/q2/bai.js`: tuyến Bạch Ngưng Băng.
- **Save:** thêm `S.ver`, hàm chuyển đổi save cũ. Đầu mỗi chương lưu một mốc `META.chapSave[k]`.
- **Chết thật ở Quyển 2** (Thiền chưa hồi): chơi lại từ đầu chương, không về lễ khai khiếu. Ký ức vẫn giữ.
- **Quay ngược không vượt qua đầu chương** (vì đầu chương là mốc lưu).

### 1.4 Hệ thống mới

| Hệ | Nội dung | Dùng lại |
|---|---|---|
| **Lực đạo** (`luc.js`) | Mỗi cổ lực cho một **hư ảnh thú** (Trư, Hùng, Ngạc, Ngưu, Mã, Quy, Tượng, Mãng, Lôi Trư, Nham Ngạc). **Toàn Lực Ứng Phó**: đòn đánh chắc chắn hiện hư ảnh. **Khổ Lực**: sức đánh tăng theo khí huyết đã mất. **Khí Lực**: hư ảnh thành thực thể, đánh xa. **Tự Lực Cánh Sinh**: hồi máu theo lực, dùng quá tay tự rách cơ. Hư ảnh vĩnh viễn trả bằng tuổi thọ (canon VN 351–352). | Chiêu và hồi chiêu của đấu trường |
| **Bay** | Cốt Dực: trong trận có thế "bay". Địch cận chiến không với tới, chỉ địch có cổ viễn chiến đánh được. Phá cổ viễn chiến của địch trước thì thắng thế (canon VN 444). | Ý đồ địch, `EAI` |
| **Trận nhiều người** | Đấu trường chỉ có một địch mỗi trận. Trận "một đối bảy" làm thành chuỗi trận nối tiếp, giữ khí huyết và chân nguyên, giữa các lượt có lựa chọn (bay lên, đuổi kẻ chạy, hồi thạch). | `fight` + `after` |
| **Địch thử tay / tha mạng** | `spare` đã có từ Phần 0: dùng cho diễn võ trường (đối thủ nhận thua) và các cường giả chưa muốn giết. | Có sẵn |
| **Bạch Ngưng Băng đồng hành** (`bai.js`) | Chỉ số **tin phục** và **Thề Độc** hai chiều. Nàng mạnh lên theo chương (Băng Tinh, Băng Bạo). Tin phục thấp, hoặc Phương Nguyên bỏ mặc nàng (canon VN 438: bị Thiết gia vây) thì phản bội sớm hơn và chắc hơn. Không có đường "không phản bội": đó là tính cách canon. | `NPC`, `rel` |
| **Thương gia thành** (`city.js`) | Chợ theo khu (5 khu, lệnh bài 9 cấp mở khu), **đổ thạch** thật (nâng từ minigame mổ thạch), **đấu giá** (Khổ Lực, Phong Khí), **diễn võ trường xếp hạng** (nội thành 5 lên 3, 18 trận giữ đài, đối thủ có tên: Thang Hùng, Lý Hảo, Chu Bát, Viêm Đột, Cự Khai Bi). | Mổ thạch, đấu trường |
| **Truyền thừa theo ải** (`truyenthua.js`) | **Khuyển Vương**: bầy chó tự đánh, chọn hướng thưởng, thu thú vương, rút lui giữa chừng. **Tín Vương**: luyện cổ đấu người lông (nịnh để họ luyện hỏng, nguyên liệu tích lũy qua ải, từ ải 40 được dùng một cổ luyện đạo của mình). **Bạo Vương**: chỉ làm nền, người chơi không vào (canon: Thiết Mộ Bạch vào). Mỗi lần mở, mỗi truyền thừa chỉ vào được một lần. | Minigame luyện cổ |
| **Phúc địa và Địa linh** | Chương Bá Quy: trong phúc địa, Địa linh khóa cổ và chân nguyên của một cự đầu Ngũ chuyển rồi truyền tống người chơi tới sau lưng họ. Trận ám sát có giới hạn lượt: hết lượt thì cổ địch được mở khóa. | `fight` + `mod`, số lượt |
| **Tiên cổ** | Định Tiên Du: truyền tống theo cảnh đã nhớ. Đệ Nhị Không Khiếu: chỉ xuất hiện ở dạng phôi, không bao giờ luyện xong (canon). | Luyện cổ |

### 1.5 Chương và PR

| PR | Chương | VN | Nội dung chính | Mốc cố định |
|---|---|---|---|---|
| **E1** | Khung | – | `S.book`, `CHAPTERS`, các hàm `cur*()`, save theo chương, cửa vào từ kết Quyển 1, bot mô phỏng bắt đầu ở Quyển 2. Chưa có nội dung, chỉ một chương thử 3 tuần. | – |
| **E2** | 2.1 Sông Hoàng Long | 207–227 | Cổ chết đói, thuốc cạn, BNB chưa quen thân nữ. Thú: cá Toa Tiễn, cá sấu vương 6 chân, cá sấu dung nham, Hiên Viên Thần Kê (nên chạy), đàn ong. **Trần Thúy Hoa**. Bắt đầu tin phục và Thề Độc. | Tới Bạch Cốt Sơn |
| **E3** | 2.2 Bạch Cốt Sơn | 228–250 | Mạo danh "Cổ Nguyệt Phương Chính", đại săn 7 ngày, đấu săn theo đội. Dungeon **Hôi Cốt Tài Tử**: sảnh sữa, chọn 1 trong 3 cổ, sảnh giả, gõ răng, kim tự tháp sư hổ. Hiến tế Bách Sinh và Bách Hoa để luyện **Cốt Nhục Đoàn Viên** (canon) hoặc đường khác. Bẫy Thổ Đậu giết đoàn Thiết gia. Trốn bằng Vô Túc Điểu. | Rơi xuống Tử U |
| **E4** | 2.3 Thương đội | 251–294 | Tên giả Hắc Thổ và Bạch Vân. Gia nô, Sấu Hầu, Cường ca. Kết giao **Thương Tâm Từ**. Vật tay Phỉ Hầu. Buôn cỏ Kim gia. Dụ thú đánh thương đội. Giết Trương Trụ, Âu Phi, Âu Dương Công. **Đinh Hạo** và cương thi. | Tới núi Thương Lượng |
| **E5a** | 2.4a Thương gia thành | 295–324 | Bán bí phương, gia yến, Tố Thủ y sư, lệnh bài, Thề Độc với BNB, Bảo Giới, chọn **Lực đạo**, đổ thạch (đá Tinh Thần rỗng), Nói Không Giữ Lời cổ. | – |
| **E5b** | 2.4b Diễn võ trường | 325–390 | Lý Nhiên và Toàn Lực Ứng Phó. Leo hạng diễn võ. Ép Bách gia 300 vạn. Thiết Nhược Nam tới thành. Đấu giá Khổ Lực và Phong Khí, luyện Khí Lực. Hạ bệ Thương Nhai Tí. Trận Viêm Đột, Cự Khai Bi. | Tin Tam Vương |
| **E6** | 2.5 Thiếu chủ | 391–406 | Chọn phe thiếu chủ. Thu người cho Tâm Từ: anh em Hùng (lệnh bài "Cơm"), Vệ Đức Hinh, Chu Toàn. Mua trước Ngự Khuyển, Chỉ Hạc, Bạo Đản. Lên Tứ chuyển. | Ngày Tam Vương mở |
| **E7** | 2.6 Tam Xoa: Khuyển Vương | 407–438 | Lập hung danh (Hoành Mi, Kim Thành Ân, Tiết Tam Tứ). Hồ Mị Nhi, Lý Nhàn, 4 Tứ đỉnh, Dịch Hỏa. Minigame Khuyển Vương. BNB bị Tứ lão Thiết gia vây. | BNB bị vây |
| **E8** | 2.7 Tín Vương và Thiết gia | 439–449 | Minigame Tín Vương, Hoàng Kim Xá Lợi, luyện **Cốt Dực**. Trận "lấy một đối bảy" (chuỗi trận, bay). Thiết Bá Tu chết che cho Nhược Nam. Cứu BNB. Danh chấn Nam Cương. | Bá Tu chết |
| **E9** | 2.8 Ngũ chuyển giáng lâm | 450–465 | Thiết Mộ Bạch quét Tam Xoa, Ô Cật, Khổ Mặc, Cừu Cửu, Tiêu Mang. Người chơi ẩn nhẫn: sự kiện quan sát, tránh mặt, gom nguyên thạch. Cảnh xen Trung Châu: Phương Chính và Phượng Kim Hoàng leo Đãng Hồn. Nhược Nam lột xác. | Phúc địa suy bại |
| **E10** | 2.9 Địa linh Bá Quy | 466–485 | Bá Quy lộ diện và đề nghị luyện Đệ Nhị Không Khiếu. Ám sát theo thứ tự: Lý Nhàn, Thiết Mộ Bạch, Ô Cật, Khổ Mặc. Bắt sống Cừu Cửu (Sinh Tử Môn). Nô Lệ cổ lên Phong Thiên Ngữ. Gom 3000 vạn nguyên thạch. | Đủ nguyên liệu |
| **E11** | 2.10 Phản bội và Định Tiên Du | 486–517 | Luyện Đệ Nhị Không Khiếu. **BNB phản bội**: Định Tinh cổ, Vô Cực Sưu Tỏa. **Thiền lần 3.** Kiếp quay lại: đổi sang **Định Tiên Du** (Thần Du cổ, ánh sáng của Tiêu Mang, Phong Thiên Ngữ hiến tế, bài thơ). Truyền tống tới Đãng Hồn Sơn, tát Phượng Kim Hoàng, nhận Tiểu Hồ Tiên. Kết Quyển 2. | Kết quyển |

Ước lượng: mỗi PR 1–2 buổi; E5b và E11 lớn nhất. Làm lần lượt, mỗi PR xong là chơi được tới hết chương đó, cuối chương hiện "còn tiếp".

### 1.6 Chi tiết cảnh cao trào (E11)

1. Vào điện luyện cổ. BNB đứng trận nhãn truyền chân nguyên.
2. **Lần đầu:** không có lựa chọn nào tránh được. BNB ngừng truyền, Định Tinh cổ phát sáng, Vô Cực Sưu Tỏa khóa người chơi, liên quân tràn vào, Nhược Nam kể tội. Chỉ còn 2 lựa chọn: "Chịu trói" (kết thua `tran_ma_thap`) hoặc "Tự bạo, đẩy Xuân Thu Thiền vào Quang Âm Chi Hà" (chỉ bấm được khi Thiền đã hồi).
3. **Quay ngược:** khác với quay ngược 3 tuần thông thường, cảnh này quay về đầu cảnh luyện cổ và học ký ức `q2_phanboi`. Ký ức mở các lựa chọn:
   - Cắt Định Tinh cổ khỏi tay trái trước khi luyện.
   - Bỏ Đệ Nhị Không Khiếu, chuyển sang Định Tiên Du (canon).
   - Giết BNB trước (lệch lớn, `drift`; vẫn phải thoát trước khi phúc địa sập).
4. Nhánh canon: thu nguyên liệu Định Tiên Du trong số lượt giới hạn, chờ ánh sáng của Tiêu Mang, rồi đọc thơ. Luyện thành: Định Tiên Du chọn cảnh đã nhớ. Canon là Đãng Hồn Sơn; nếu người chơi chưa "nhớ" cảnh nào khác thì chỉ có lựa chọn đó.
5. Đãng Hồn Sơn: tát Phượng Kim Hoàng, chạm Tiểu Hồ Tiên, kết `ho_tien`. Bản thắng của Quyển 2 dẫn sang Quyển 3 (Trung Châu), hiện chưa làm.

### 1.7 Nguyên tắc lệch ở Quyển 2

- **Mốc lớn giữ ngày:** Tam Vương mở, Thiết gia tới, Ngũ chuyển giáng lâm, phúc địa sụp. Canon nói rõ đại sự có quán tính.
- **Giữa các mốc là tự do,** và mỗi chương có ít nhất một đường lệch thắng được. Áp dụng luật Phần 0: chỉ `drift:N` làm lệch, ký ức sai thì mất lợi thế và có câu dẫn báo trước.
- **Không mang nguyên độ lệch từ Quyển 1.**

### 1.8 Nội dung

- Giữ đủ các cảnh tàn nhẫn và 18+ của canon, diễn tả bằng chữ, không gắn nhãn: hiến tế, tự rạch mình để lừa, giết người lập uy, xé xác đội Thiết gia, ám sát Ngũ chuyển, phản bội. Game dùng cá nhân.
- Câu chữ tự viết, không chép truyện. Bài thơ ở VN 510 dùng bản Hán Việt đã có trong `NGUYEN_TAC_Q2.md`.
- Tranh: NPC chính mới (Thương Tâm Từ, Thương Yến Phi, Thiết Nhược Nam, Thiết Bá Tu, Thiết Mộ Bạch, Bá Quy, Tiểu Hồ Tiên, Phượng Kim Hoàng, BNB bản nữ) vẽ mới bằng Canva AI cùng phong cách thủy mặc. Ảnh tải từ mạng chỉ để trong `assets/local/`.
- Phần canon VN 447–517 trong `NGUYEN_TAC_Q2.md` được bổ sung sau. Khi viết sự kiện cho E8–E11, đối chiếu lại số chương và chi tiết với bản truyện.

### 1.9 Cổng kiểm tra

- `node tools/check.cjs`: kiểm thêm bảng `CHAPTERS` (mốc, sự kiện, địch, cổ tồn tại).
- Bot Quyển 2 trong `sim.cjs` (tham số `Q2=chương`): mỗi chương không kẹt vòng lặp, bot bám truyện và bot lệch đều qua được chương. **Tỉ lệ để cân sau**, như Quyển 1.
- `node tools/ff_test.cjs 100`: 0 lỗi.
- Chơi thử trong trình duyệt hết chương vừa làm, không lỗi JS.

---

## Việc cần người chơi chốt

| # | Câu hỏi | Mặc định đề xuất |
|---|---|---|
| 1 | Chết thật ở Quyển 2 thì chơi lại từ đâu | Từ đầu chương |
| 2 | Một lượt Quyển 2 là bao lâu | Đi đường tính theo tuần; Thương gia thành và Tam Xoa tính theo tháng |
| 3 | Kết Quyển 1 kiểu chính đạo có mở Quyển 2 không | Không, trừ khi đã có `META.q2Unlocked` |
| 4 | Bắt đầu thẳng Quyển 2 từ màn mở đầu | Có, khi đã có `META.q2Unlocked` |
| 5 | Làm E1 ngay, hay trả nợ cân bằng Phần 0 trước | Làm E1 ngay |
