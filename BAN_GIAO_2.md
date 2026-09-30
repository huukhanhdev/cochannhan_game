# Bàn giao 2: Thiên cơ lệch, dị số, cảnh nhiều bước, hội thoại, Quyển 2

Tài liệu này là kế hoạch làm tiếp, viết sau khi gộp commit `ff0356e update UI` của main. Nguyên tắc chung, luật bản quyền và các bẫy đã biết vẫn như trong `BAN_GIAO.md`. Tiến độ của các giai đoạn 2–5 được ghi trong `TRIEN_KHAI.md`.

## 0. Hiện trạng (đo sau khi gộp main)

- `node tools/check.cjs`: không lỗi dữ liệu.
- `node tools/sim.cjs 200 6`:
  - Thắng **35,0%** trong 6 lần chơi, **5%** ngay lần đầu. Con số 35% đã chạm trần mục tiêu.
  - Chết nhiều nhất ở lang triều (Bầy Điện Lang) và dưới tay Giả Kim Sinh.
- Những thứ đã có sẵn để dùng lại:
  - `present.js`: người nói trong sự kiện (`evSpeaker`, `speakerHTML`) và chữ hiện dần (`typeStory`).
  - `auto.js`: `autoAct()`, dùng chung cho tua nhanh, bot mô phỏng và nút Tự đánh.
  - `S.var`: biến thể của 7 mốc nguyên tác, **hiện rút ngẫu nhiên** mỗi kiếp.
  - `S.canon` và `buildCanon()`: lịch mốc nguyên tác riêng cho từng kiếp. Hiện đã có sẵn chức năng dời mốc theo thiên cơ.
  - `S.canonHit`/`S.canonMiss`: đếm số lần chọn theo và không theo nguyên tác, hiện chỉ để hiển thị.
- Bước 1.2 Sổ ký ức chưa làm vì bên kia hoãn giai đoạn 1.

**Cổng kiểm tra cho mọi PR:**
- `node tools/check.cjs`: không lỗi.
- `node tools/sim.cjs 300 6`: thắng 15–35%, không kẹt vòng lặp.
- `node tools/ff_test.cjs 100`: 0 lỗi.
- Chơi thử trong trình duyệt tới tuần 12: không lỗi JS.

## Thứ tự

| PR | Nội dung | Ước lượng |
|---|---|---|
| **1** | Chống trùng sự kiện ngẫu nhiên (A) | nửa buổi |
| **2** | **Thiên cơ lệch và cánh bướm** (D): phần cốt lõi | 2 buổi |
| **3** | **Sự kiện dị số và hậu quả trễ** (D) | 2 buổi |
| 4 | Cảnh nhiều bước (C) | 1–2 buổi |
| 5 | Hội thoại nhiều câu (B), xây trên `present.js` | 1 buổi |
| 6+ | Quyển 2: Tam Vương truyền thừa (E1–E6) | nhiều buổi |

PR 1 làm trước PR 2 và 3 vì pool dị số cần dùng hồi chiêu của PR 1.

---

## PR 1. Chống trùng sự kiện ngẫu nhiên

Sửa hàm `randomEvent(loc)` trong `js/engine.js`:
- **Hồi chiêu.** Lưu `S.evLast={id:tuần}`. Sự kiện vừa ra thì bị loại khỏi pool trong `e.cd||6` tuần.
- **Giảm theo số lần gặp.** Lưu `S.evSeen={id:n}`. Trọng số nhân `1/(1+n)`.
- **Ưu tiên sự kiện mới ở kiếp sau.** Sự kiện chưa có trong `META.seen` được trọng số ×1.5.
- **Nhiều bản câu chữ.** `text` được phép là mảng hàm. Lần gặp thứ n dùng bản `n % độ dài`. Thêm helper `evText(id)` và dùng ở `ui.js`.

**Nghiệm thu.** Mô phỏng 100 kiếp: không có sự kiện ngẫu nhiên nào lặp lại trong vòng 6 tuần.

---

## PR 2. Thiên cơ lệch: cánh bướm cốt lõi

**Tinh thần.** Ký ức kiếp trước là lợi thế lớn nhất của Phương Nguyên. Mỗi lần hắn làm khác đi, thế giới lệch khỏi ký ức một chút. Lệch càng nhiều thì ký ức càng không đáng tin, và thế giới sinh ra những chuyện hắn chưa từng thấy.

**Thay đổi lớn nhất so với hiện tại:** biến thể không còn do tung xúc xắc, mà **do chính người chơi gây ra**.

### 2.1 File mới `js/butterfly.js`
Nạp sau `cicada.js`, trước `engine.js`. Nhớ thêm vào `index.html`, `tools/sim.cjs`, `tools/ff_test.cjs` và `tools/check.cjs`.

```js
S.drift          // 0–100: thiên cơ lệch
driftAdd(n, lý_do)  // cộng hoặc trừ, giới hạn 0–100, ghi log khi vượt ngưỡng 25/50/75
memB(k, n)       // thay cho mem(k)?n:0 → Math.round(n*(1-S.drift/150)) nếu có ký ức
memReliable()    // S.drift<60
```

### 2.2 Nguồn làm lệch

| Hành động | Độ lệch |
|---|---|
| Chọn khác nguyên tác ở mốc có lựa chọn `canon` (chỗ `S.canonMiss++`) | +8 |
| Lựa chọn có trường mới `drift:N` (giết hoặc cứu người mà nguyên tác không làm, đổi phe...) | +N |
| Mỗi lần Xuân Thu Thiền quay ngược: quang âm bị khuấy động | +6 |
| Một hậu quả trễ nổ ra (PR 3) | +2 |
| Chọn đúng nguyên tác ở mốc có lựa chọn `canon` | −3 |

Độ lệch không bao giờ âm. Mỗi kiếp mới reset về 0, vì thế giới lại đúng như ký ức.

Việc gắn `drift:N` cho khoảng 15 lựa chọn "lệch lớn" trong `events.js` là việc chỉnh nội dung, làm trong PR này.

### 2.3 Tác dụng của độ lệch

1. **Ký ức phai.** Đổi 24 chỗ `bonus:()=>mem('x')?N:0` trong `events.js`, cùng các chỗ ở `engine.js:400`, `engine.js:476` và `minigame.js`, sang `memB('x',N)`.
   - Lệch 0: ký ức giữ đủ sức.
   - Lệch 100: ký ức chỉ còn khoảng 1/3 sức.
   - Khi `!memReliable()`, các câu gợi nhắc ký ức trong `text` thêm đuôi "…nhưng lần này có gì đó không khớp."

2. **Biến thể do người chơi gây ra.** Sửa `newLife()`:
   - Đầu kiếp, mọi `S.var` lấy **bản mặc định theo nguyên tác** ('yeu', 'alone', 'thuong'...), đúng như ký ức.
   - Mỗi khi độ lệch vượt một ngưỡng (25, 50, 75), rút một mốc **chưa diễn ra** và đổi biến thể của nó sang bản khác.
   - Log kèm lời gợi ý mơ hồ, ví dụ: "Thiên cơ xoay chuyển. Ngươi có cảm giác chuyện của Giả gia sẽ không như ký ức." Người chơi có Tâm cơ ≥ 12 được nêu đích danh mốc bị đổi.
   - Thiên cơ `S.world` vẫn rút 2 cái mỗi kiếp như cũ, vì đó là nhiễu loạn từ việc trùng sinh.

3. **Lịch nguyên tác xê dịch.** Khi lệch ≥ 70, một mốc tương lai trong `S.canon` dời sớm hoặc muộn 1 tuần, và có log báo.
   - Không dời lang triều trong 3 tuần trước khi nó tới.
   - Không dời trận cuối (tuần 27).

4. **Giao diện.**
   - Thêm chip "Thiên cơ lệch N%" cạnh chip Xuân Thu Thiền trên HUD. Màu chuyển dần từ xanh ngọc sang đỏ son. Tooltip giải thích tác dụng.
   - Trong tab Thân, thay dòng "lệch nguyên tác %" hiện có bằng `S.drift`.

### 2.4 Tua nhanh
- `FF_BUTTERFLY` vẫn dừng như cũ khi biến thể khác kiếp trước. Nay biến thể khác nhau là do người chơi, nên mỗi lần dừng đều có ý nghĩa.
- Thêm điều kiện dừng khi thế giới vừa xoay chuyển (vượt ngưỡng) trong lúc đang tua.

### 2.5 Cân bằng
Ba điểm có thể đẩy tỉ lệ thắng lên:
- Lần đầu ai cũng gặp bản mặc định, mà bản mặc định thường là bản dễ.
- Người chơi bám nguyên tác sẽ được lợi.
- Tỉ lệ thắng hiện đã ở 35%, sát trần.

Nếu sau PR này vượt 35% thì tăng `DIFF` lên khoảng 0,02, hoặc cho biến thể "khó" ra với xác suất nền 20% ngay cả khi độ lệch bằng 0. Mô phỏng phải in thêm độ lệch trung bình lúc chết và lúc thắng.

**Nghiệm thu.**
- Bot chọn toàn nguyên tác cho độ lệch dưới 20 ở tuần 27.
- Bot chọn ngược nguyên tác cho độ lệch trên 60, và thấy ít nhất 2 lần thế giới xoay chuyển.

---

## PR 3. Sự kiện dị số và hậu quả trễ

### 3.1 Hậu quả trễ (gợn sóng trong cùng một kiếp)
Thêm hàm trong `butterfly.js`:
```js
later(id, min, max, cond)  // S.later.push({t:S.turn+rand(min,max), id, cond})
```
- Trong `startTurn()`, ngay trước khi xét mốc nguyên tác, đẩy vào `evq` các mục đã đến hạn mà `cond` còn đúng. Mỗi lần như vậy cộng 2 độ lệch.
- `cond` lưu dưới dạng tên cờ, không phải hàm, để save được bằng JSON.
- Đợt đầu viết khoảng 10 cặp nhân–quả, ví dụ:

| Nhân | Quả (sau 3–8 tuần) |
|---|---|
| Tha thợ săn gặp nạn | Thợ săn báo chỗ có cổ hoang |
| Chặn cổng cướp thạch | Bạn học tụ tập phục kích |
| Chỉ điểm Phương Chính | Hắn đỡ cho ngươi một lần bị thẩm vấn |
| Bán tin cho chợ đen | Người của Bạch gia tìm đến mua thêm |
| Giết Giả Kim Sinh không sạch dấu | Giả gia gửi người điều tra sớm hơn |

### 3.2 Sự kiện dị số
Đây là những chuyện **không có trong ký ức kiếp trước**, chỉ xuất hiện khi thế giới đã lệch.
- **Pool riêng.** Các sự kiện có `loc:'diso'`. Chúng không gắn với nơi chốn nào, và chen vào đầu tuần.
- **Tần suất.** Trong `startTurn()`, nếu tuần đó chưa có sự kiện nào, `S.drift>=40`, và `Math.random()<S.drift/250`, thì rút một sự kiện từ pool dị số, dùng hồi chiêu và trọng số của PR 1.
- **Giao diện.**
  - Nhãn "Dị số" thay cho "Kỳ ngộ".
  - Thẻ có viền mực tím, ảnh hơi nhòe.
  - Lần đầu gặp một dị số có dòng log: "Kiếp trước chưa từng có chuyện này."
- **Tua nhanh.** Luôn dừng khi gặp dị số (`ffMinor` trả `false`).
- **Vòng lặp ký ức.** Đã gặp dị số rồi thì kiếp sau (nếu thế giới lại lệch mà nó xuất hiện lần nữa) có ký ức về nó, nhận `learn('ds_…')` và thưởng `memB`. "Điều mới" dần trở thành kiến thức.
- **Đợt đầu 10 sự kiện**, cả họa lẫn cơ duyên. Tất cả là nhân vật và địa danh có sẵn trong nguyên tác, chỉ sự việc là mới.

| Sự kiện | Loại |
|---|---|
| Thiết Huyết Lãnh đi ngang trại sớm hơn ký ức | họa hoặc tin tức |
| Một thương nhân Giả gia không có trong ký ức, mang cổ lạ | cơ duyên |
| Bạch gia đổi đường tuần tra | họa |
| Trinh sát sói đầu đàn lảng vảng trước lang triều | họa |
| Phương Chính bất ngờ khai ngộ và nghi ngờ ca ca | quan hệ |
| Một hốc linh tuyền mới lộ ra sau sạt lở | cơ duyên |
| Hùng gia ngỏ ý liên minh | lựa chọn phe |
| Ma tu Huyết Thủ đổi mục tiêu | họa |
| Gia lão lạ mặt thẩm tra lại lễ khai khiếu | hiềm nghi |
| Tửu Trùng trong động phủ đã bị kẻ khác động vào | họa hoặc cơ duyên |

### 3.3 Dư âm xuyên kiếp (nhẹ)
- Lưu `META.lastEchoes` với vài cờ lớn của kiếp trước: giết ai, cứu ai, kết cục.
- Kiếp sau, mỗi cờ có 20% cộng sẵn 5 độ lệch từ đầu kiếp, kèm log: "Có điều gì đó khác ký ức của ngươi."
- **NPC không nhớ gì.** Chỉ Phương Nguyên nhớ, đúng nguyên tác.

**Nghiệm thu.** Trong mô phỏng, bot lệch cao gặp trung bình 2–4 dị số mỗi kiếp, và bot bám nguyên tác gần như không gặp. `ff_test` vẫn tua được hơn 40% số tuần mục tiêu.

---

## PR 4. Cảnh nhiều bước

Sửa `choose()` và `choicesOf()` trong `engine.js`:

- **`stay:1`: lựa chọn phụ** như hỏi thêm, quan sát.
  - Chọn xong, cảnh vẫn mở và lựa chọn đó biến mất. Lưu ở `S.picked[id]`.
  - Mỗi cảnh có ngân sách `ev.budget||2` lượt phụ.
  - Không gọi `evq.shift()` khi lựa chọn có `stay`.
- **`go:'id'` / `goOk` / `goFail`: nhảy sang nút con.**
  - Sau khi xử lý kết quả, `S.evq.unshift(go)`.
  - Nút con là một mục `EV` không có `loc` hay `canon`. Trường `of:'id_gốc'` cho nó dùng chung ảnh, tiêu đề và người nói với cảnh gốc; sửa `evSpeaker` và `eventArt` để đọc trường này.
- **`hidden:'cờ'`: lựa chọn ẩn.** Chỉ hiện khi một lựa chọn `stay` trước đó đã bật cờ.
- **Các hệ khác.**
  - Tua nhanh bỏ qua lựa chọn `stay`.
  - `ffRememberChoice` hoạt động như cũ, vì mỗi nút con là một id riêng.
  - Bot trong `sim.cjs` né `stay` với xác suất 50%.
- **Làm lại 4 cảnh mẫu:** `c_kimsinh`, `c_bai`, `c_luancong`, `r_choden`.
- **Kết hợp với PR 2.** Lựa chọn phụ kiểu "dò xét" trong một mốc nguyên tác có thể **lộ ra biến thể hiện tại**. Nhờ đó người chơi có cách chủ động kiểm tra xem thế giới đã lệch khỏi ký ức chưa.

---

## PR 5. Hội thoại nhiều câu

`present.js` đã có người nói (mỗi thẻ một người) và chữ hiện dần. PR này mở rộng thành nhiều câu có người nói riêng:
- Thêm trường `talk`, là mảng hoặc hàm trả mảng `[[người_nói, câu], ...]`. Người nói là khóa `NPC`, `'hero'`, hoặc `null` cho lời dẫn.
- Hiện mỗi câu thành một bong bóng, dùng lại `speakerHTML` cho avatar.
- Bấm để hiện câu kế. Lưu tiến độ ở `S.talkI` để render lại không mất chỗ đang đọc.
- Các nút lựa chọn đang có lớp `.await` để ẩn trong lúc chữ chạy. Dùng lại lớp này cho tới khi hết thoại.
- Tua nhanh và `RM` (chế độ giảm chuyển động) hiện hết ngay.
- Mỗi câu thoại khoảng 120 ký tự trở xuống, tự viết, không chép truyện.
- Đợt đầu: các tuyến NPC hiện có, và 10 dị số của PR 3.

---

## PR 6+. Quyển 2: Tam Vương truyền thừa

Giữ nguyên thiết kế ở phiên bản trước của file này. Tóm tắt:

- **Khung chương.**
  - Thêm `S.chap` và bảng `CHAPTERS` chứa lịch nguyên tác, hành động và mốc kết thúc của từng chương.
  - Các kết cục rời núi (`ma`, `bai_dong`, `huyetlo_bai`) mở cửa Quyển 2.
  - Lưu `META.q2Unlocked` để lần sau bắt đầu thẳng từ Quyển 2.
- **Tuyến nguyên tác.**
  1. Bạch Cốt Sơn.
  2. Thương gia thành: hộ tống Thương Tâm Từ.
  3. Tam Xoa Sơn: Tam Vương truyền thừa, có Thiết gia tứ lão; Bạch Ngưng Băng nhờ Tố Thủ Y Sư giải Độc Thệ Cổ rồi phản bội; Phương Nguyên phải dùng lại Xuân Thu Thiền.
- **Cảnh phản bội cần Thiền đã hồi phục.** Nếu Thiền chưa hồi phục thì đó là kết cục thua có chủ đích.
- **Minigame truyền thừa.** Vào theo lượt, chọn ải, dùng lệnh bài du hành để xem trước một ải.
- **Thiên cơ lệch ở Quyển 2.** Độ lệch mang sang từ Quyển 1, vì những gì làm ở Thanh Mao Sơn lan tới Quyển 2. Đây là chỗ cánh bướm có sức nặng lớn nhất.
- **Các PR con.**
  - E1: khung chương.
  - E2: Bạch Cốt Sơn và đường lữ hành.
  - E3: Thương gia thành.
  - E4: minigame truyền thừa.
  - E5: tuyến Bạch Ngưng Băng và kết cục.
  - E6: ảnh, âm thanh, cân bằng.
- **Nguồn nguyên tác.** Mới chỉ có tóm tắt trên mạng. Người biết truyện cần đối chiếu và ghi vào `NGUYEN_TAC_Q2.md` trước khi viết E2–E5.

---

## Cần chốt trước khi làm PR 2

| # | Câu hỏi | Mặc định đề xuất |
|---|---|---|
| 1 | Công thức lệch | Như bảng ở 2.2 |
| 2 | Lệch tối đa thì ký ức còn bao nhiêu | Khoảng 1/3 sức, không mất hẳn |
| 3 | Dị số chỉ gây khó, hay có cả cơ duyên | Có cả hai, khoảng 60% họa và 40% cơ duyên |
| 4 | Bám nguyên tác có kéo độ lệch giảm lại không | Có, −3 mỗi lần, để người chơi có lựa chọn "đi lại đúng truyện" |
| 5 | Biến thể mặc định ở kiếp đầu hay vẫn ngẫu nhiên | Mặc định, kèm 20% nền nếu mô phỏng cho thấy quá dễ |

---

## Đã chốt với chủ dự án (30/09/2026) và đã làm PR 1–3

Những điểm dưới đây thay cho phần tương ứng ở trên.

1. **Không dùng `memB`, tức không cho ký ức phai theo hệ số.** Cánh bướm tác động lên *nội dung* ký ức.
   - Lựa chọn ký ức có trường `mem:'khóa'` và nhãn "憶 Ký ức". Lựa chọn này dựa trên bản nguyên tác của mốc.
   - Nếu mốc đã đổi biến thể (`varShifted(k)`), lựa chọn ký ức **phản tác dụng**.
   - Đã có ở 7 mốc: gia sản, cổng học đường, Giả Kim Sinh, Bạch gia lấn đất, Bạch Ngưng Băng, lang triều, lăng mộ.
   - Chết dưới tay ai thì nhận ký ức về kẻ đó (bảng `DEATH_MEM` trong `data.js`).
2. **Mỗi lần chơi lại, 2–3 mốc lệch sẵn** (`initVariants`); độ lệch do người chơi gây ra cộng thêm trên nền đó. Quay ngược 3 tuần thì giữ nguyên dòng thời gian.
3. **Không hiện số phần trăm.** `S.drift` là số ẩn. Thanh trạng thái chỉ hiện 3 mức: "Ký ức khớp", "Có chỗ lạ", "Tương lai mờ mịt" (`driftChip`). Không dùng chữ "Thiên cơ", để khỏi trùng với thiên cơ kiếp này (`S.world`).
4. **Không trừ độ lệch khi đi đúng nguyên tác.**
   - Nguồn làm lệch:
     - bỏ lựa chọn nguyên tác ở mốc có nguyên tác: +8;
     - lựa chọn có trường `drift:N`: +N;
     - mỗi lần Xuân Thu Thiền quay ngược: +6;
     - mỗi hậu quả trễ nổ ra: +2;
     - kết quả đổi thế cục lớn (`AFTER_DRIFT`): cộng theo bảng.
   - Dị số có cả họa lẫn cơ duyên, để đi lệch là một đánh đổi chứ không phải là sai.

### Đã làm
- **PR 1** (`randomEvent`, `evText` trong `engine.js`):
  - Hồi chiêu bằng nửa cỡ kho, tối đa 6 tuần.
  - Trọng số chia cho `1+số lần đã gặp`.
  - Sự kiện chưa từng thấy ×1,5.
  - `text` được phép là mảng hàm; hiện có ở `r_giangbai` và `r_tuanbien`.
- **PR 2** (`js/butterfly.js`): `VARIANTS`, `initVariants`, `driftAdd`, `shiftVariant` (ở các ngưỡng 25/50/75), `shiftSchedule` (khi tới ngưỡng 75, một trong các mốc `MOVABLE` xê dịch một tuần).
  - Tua nhanh dừng khi thế giới xoay chuyển, và khi lựa chọn cũ là lựa chọn ký ức ở mốc đã đổi.
  - Dòng thời gian đọc lịch của kiếp này (`S.canon`).
- **PR 3:**
  - `later(id,min,max,cờ)` cùng 10 hậu quả trễ `q_*`.
  - 10 dị số `d_*` (`loc:'diso'`). Dị số xuất hiện khi lệch ≥ 25, xác suất lệch/120 mỗi tuần chưa có mốc; chen trước tuyến NPC.
  - Đã gặp thì thành ký ức `ds_<id>`.
  - Dư âm xuyên kiếp: `echoSave` và `echoApply`.

### Số đo
- `sim.cjs 400 6`: thắng 32%, lần đầu 1,5%.
  - Độ lệch trung bình: 18 lúc chết, 51 lúc thắng.
  - Lựa chọn ký ức: 247 lần đúng, 197 lần phản tác dụng.
  - `DIFF` 1,36.
- `LECH=1 sim.cjs`, người chơi máy cố tình bỏ lựa chọn nguyên tác ở mốc truyện:
  - mỗi lần chơi gặp 1,8 dị số và 2,2 lần thế giới xoay chuyển;
  - nhưng chỉ thắng 0,5%;
  - **tắt hẳn cơ chế lệch vẫn chỉ 0,5%**. Nguyên nhân là các lựa chọn khác nguyên tác ở mốc truyện vốn đã rất nguy hiểm (đánh Bạch Ngưng Băng, xông vào lang triều...), không phải cơ chế lệch. Cần chủ dự án quyết có làm mềm các nhánh này không.
- `ff_test.cjs 100`: 0 lỗi, tua tới khoảng 50% tuần mục tiêu.
