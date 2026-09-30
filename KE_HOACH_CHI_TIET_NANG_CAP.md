# Kế hoạch nâng cấp: máy cảnh hội thoại, mốc chính nhiều bước, chuỗi chuyện phụ
### Cổ Chân Nhân, Quyển 1 (Thanh Mao Sơn Ký)
**Ngày lập:** 30/09/2026 · **Bản đã review:** 30/09/2026, đối chiếu code `main` tại `3b1ed7a`

> **Cách đọc bản review.** Nội dung giữ theo bản gốc ở những chỗ hợp lý. Chỗ nào sửa có khối "**Vì sao chỉnh**" ngay bên dưới. Mục 0 tóm tắt các thay đổi lớn.

---

## 0. Tóm tắt các chỉnh sửa

| # | Bản gốc | Bản review | Lý do ngắn |
|---|---|---|---|
| 1 | PR-1 là "asset + gắn 16 cổ còn thiếu", làm trước máy cảnh | Bỏ việc gắn 16 cổ. Asset gộp vào PR đầu, không thành một giai đoạn riêng | Trong 16 cổ có 13 con đã có nguồn; `check.cjs` báo sai (mục 5.2) |
| 2 | Cổng kiểm tra: bot bám truyện thắng 20–35% | **40–45%**, kiếp đầu khoảng 10% | Anh đã chốt mức 40–45%; `DIFF` 2.52 hiện cho 43,5% |
| 3 | Có yêu cầu tua nhanh qua cảnh (`ff.js`) | Bỏ | Từ `d597273`, chết thật là mất hết, `S.ffOffer=false`; tua nhanh không còn đường vào |
| 4 | "12 tuần trống" | **9 tuần trống** | Hiện 20/27 tuần có mốc; gộp lang triều và thương đội chỉ bớt được 2 |
| 5 | Tuần các mốc: khảo hạch 8, Bạch Ngưng Băng 15 | Theo `CANON` thật: khảo hạch **6**, Bạch Ngưng Băng **17** | Sai tuần thì bot, lịch và biến thể cánh bướm lệch nhau |
| 6 | Mã mốc `c_robgate` | `c_conghocduong` | `robgate` là hành động trên bản đồ, không phải mốc |
| 7 | Các chuỗi phụ viết mới hoàn toàn | Nối vào tuyến đã có (Trầm Thúy, Xích–Mạc, nguyệt lan, sói) | Code đã có cờ và sự kiện; viết mới sẽ trùng và mâu thuẫn |
| 8 | Có "thú đan", "nuôi Nguyệt Quang miễn phí cả đời", bán tửu lâu 300 thạch | Bỏ hoặc hạ xuống | Thế giới Cổ Chân Nhân không có đan dược; thưởng quá lớn phá kinh tế đã cân |
| 9 | Cảnh mẫu Giả Kim Sinh dẫn thẳng tới giết | Có đường không giết | Mọi nhánh đều về giết thì lại là "đọc lại truyện", thứ anh không muốn |
| 10 | Cờ hiển thị BNB nữ `S.q >= 2` | `S.book === 2` | Code không có biến `S.q` |

---

## 1. Tổng quan và tôn chỉ

### 1.1. Mục tiêu cốt lõi
1. **Không còn cảm giác đọc lướt.** Sự kiện có hội thoại qua lại, có lượt dò xét, có lựa chọn ẩn chỉ mở khi dò đúng.
2. **Có chỗ thở.** Mỗi tuần 3 việc (đã có từ `3b1ed7a`). Gộp mốc dồn dập để có thêm tuần trống.
3. **Hình ảnh.** Dùng chân dung mới (Bạch Ngưng Băng nữ, Nhất Đại, Thanh Thư, Phương Chính, Thiết Nhược Nam) và các tranh cổ mới.
4. **Đi lệch mà vẫn qua được** (theo `KE_HOACH_DI_LECH.md`). Mỗi mốc lớn có ít nhất một chuỗi lựa chọn khác truyện mà vẫn sống và có lợi.

> **Vì sao chỉnh:** thêm mục 4. Anh đã nói rõ lý do có hội thoại nhiều bước là để "chọn đúng thì đi lệch mà vẫn qua chương". Bản gốc chỉ làm cảnh dài hơn nhưng vẫn đi đúng một đường nguyên tác.

### 1.2. Ràng buộc
- **Giữ 27 tuần** (`FINAL_TURN = 27`): Xuân Thu Thiền quay 3 tuần, cánh bướm và lịch mốc đều tính theo tuần.
- **Bám địa điểm, thời gian, NPC và cơ chế của truyện. Cốt truyện viết tự do.** Không thêm hệ thống không có trong truyện, như đan dược hay phẩm chất cổ.
- **Cổng kiểm tra** (chạy ở mọi PR):
  - `node tools/check.cjs`: 0 lỗi (sau khi sửa công cụ ở PR-1, xem mục 5.2).
  - `node tools/sim.cjs 300 6`: bot bám truyện thắng **40–45%** trong 6 kiếp, kiếp đầu khoảng 10%.
  - `LECH=1 node tools/sim.cjs 300 6`: bot đi lệch thắng **≥ 25%**.
  - `node tools/sim2.cjs 100`: Quyển 2 chạy hết, không kẹt vòng lặp.
  - Trình duyệt: không lỗi JS; hội thoại dùng được trên điện thoại và máy tính.

> **Vì sao chỉnh:**
> - **Tỉ lệ thắng.** 20–35% là cổng cũ, lúc 1 việc mỗi tuần và `DIFF` 1.55. Anh đã chốt 40–45%, và code hiện đạt 43,5%.
> - **Bot đi lệch.** Nâng từ ≥ 10% lên ≥ 25%, tức khoảng một nửa bot bám truyện. Nếu đi lệch khó hơn quá nhiều thì người chơi sẽ lại chọn y truyện.
> - **Bỏ `ff_test.cjs`.** Chết thật giờ mất hết nên không còn tua nhanh.
> - **Bỏ "86 cổ đều có nguồn trong game".** Có con thuộc giai đoạn sau Quyển 2 (Nô Lệ Cổ), ép vào Quyển 1 là sai truyện.

---

## 2. Máy cảnh hội thoại nhiều bước (N2)

### 2.1. Dữ liệu một cảnh
Sự kiện cũ (một đoạn, một lượt chọn) vẫn chạy như bình thường. Sự kiện có trường `scene` thì chạy bằng máy cảnh.

```javascript
c_kimsinh: {
  canon: 1, title: 'Khe đá bờ sông', loc: 'trai', who: 'kimsinh',
  scene: {
    start: 'gap', budget: 3,
    nodes: {
      gap: {
        talk: [
          ['kimsinh', 'Phương Nguyên! Nghe nói ngươi vừa đòi được tửu lâu từ tay cậu mợ?'],
          ['', 'Hắn cười khẩy, nhưng mắt cứ liếc về phía lùm trúc sau lưng.'],
          ['kimsinh', 'Ta có mối làm ăn. Ra khe đá nói chuyện riêng.']
        ],
        choices: [
          { t: 'Hỏi: "Làm ăn chuyện gì?"', stay: 1, flag: 'no',
            talk: [['kimsinh', '...Ta thiếu sòng bạc một khoản. Đại ca mà biết thì ta chết.']] },
          { t: 'Liếc về rừng trúc', stay: 1, check: ['tamco', 10], flag: 'phuc',
            say: 'Hai gia đinh Cổ gia nấp sau bụi trúc.' },
          { t: 'Đi theo hắn ra khe đá', go: 'khe', canon: 1 },
          { t: 'Vạch mặt hai kẻ nấp sau bụi trúc', hidden: 'phuc', go: 'lat' },
          { t: 'Nhắc tới món nợ và đại ca hắn', hidden: 'no', go: 'ep' },
          { t: 'Theo ký ức: hắn sợ Cổ Phú hơn sợ ngươi', mem: 'kimsinh', go: 'ep' }
        ]
      },
      khe: { talk: [...], fight: { foe: 'kimsinh', win: 'giet', flee: 'chay' } },
      giet: { talk: [...], eff: () => { S.stones += 40; S.susp += 15; S.f.killedJKS = 1 } },
      ep:   { talk: [...], choices: [ /* ép hắn làm tai mắt trong Cổ gia: không án mạng, mỗi tháng có tin và nguyên thạch */ ] },
      lat:  { talk: [...], tense: 1, choices: [ /* hắn chối, căng thẳng tăng; lỡ lời thì thành đánh nhau */ ] }
    }
  }
}
```

> **Vì sao chỉnh so với cảnh mẫu gốc:**
> - **Có nút `ep`: ép Kim Sinh làm tai mắt, không giết.** Ở bản gốc, mọi nhánh đều dẫn tới `node_kill`. Đó chính là "chọn y chang nguyên tác", thứ anh chê.
> - **"Đại ca", không phải "phụ thân".** Kim Sinh là em của Cổ Phú (commit `77a114d` đã sửa tên).
> - **Bỏ `gainGu('diathinh')` khi giết.** Địa Thính Nhục Nhĩ Thảo lấy ở tầng ba hậu sơn (`hs_ngam`); rơi ở đây là sai truyện và trùng nguồn.
> - **Tiền giảm từ 80 xuống 40.** 80 thạch ở tuần 11 gần bằng 10 tuần trợ cấp, phá kinh tế đã cân.
> - **Lựa chọn ký ức dùng `mem:'kimsinh'`, không dùng `hidden:'mem_kimsinh'`.** Hệ thống ký ức đã có sẵn (`mem()`, nhãn 憶, phản tác dụng khi cánh bướm đổi biến thể). Làm một cờ riêng sẽ bỏ qua cơ chế phản tác dụng đó.
> - **Trận giữa cảnh có `win` và `flee`, không có `lose`.** Thua đã có luật chung: Thiền quay ngược, hoặc chết thật.

### 2.2. Các thành phần

| Thuộc tính | Ý nghĩa |
|---|---|
| `talk` | Chuỗi câu thoại `[người nói, lời]`. Người nói rỗng là lời dẫn. Có người nói thì hiện chân dung (dùng `speakerHTML` sẵn có). |
| `stay` | Hỏi hoặc quan sát thêm: hiện câu trả lời mà vẫn ở lại nút hiện tại. |
| `budget` | Số lượt `stay` tối đa của cả cảnh. Hết lượt thì các lựa chọn `stay` biến mất, phải quyết. |
| `flag` / `hidden` | Hỏi đúng thì bật cờ riêng của cảnh (`S.sc[id]`), mở lựa chọn ẩn (nhãn 察). |
| `mem` | Lựa chọn nhờ ký ức (nhãn 憶). Theo luật cánh bướm hiện có, mốc đã đổi biến thể thì lựa chọn này phản tác dụng. |
| `rel` | Lựa chọn chỉ mở khi quan hệ đủ (nhãn 情), ví dụ `rel:['thanhthu',30]`. |
| `go` | Sang nút khác. |
| `fight` | Đánh giữa cảnh. Thắng hoặc chạy thì sang nút tương ứng. Thua theo luật Thiền và chết thật. |
| `tense` | Độ căng 0–3. Đạt 3 thì cảnh nổ thành đánh nhau, hoặc rẽ về kết quả nguyên tác. |
| `wait` | Hẹn ngày: cảnh dừng và tiếp tục sau N việc hoặc N tuần (dùng `later()` sẵn có). |

> **Vì sao chỉnh:**
> - **Thêm `mem`, `rel`, `wait`.** Nhãn 情 trong bản gốc không có thuộc tính nào điều khiển. `wait` cần cho những cảnh kéo dài nhiều tuần như lang triều hay tra án.
> - **Nêu rõ cờ lưu ở `S.sc`.** Cảnh phải lưu được giữa chừng: tải lại trang, hay Thiền quay ngược rồi chơi lại cảnh, đều cần trạng thái cảnh nằm trong `S`.

### 2.3. Giao diện
- Hộp thoại chữ chạy (dùng lại `typeStory`). Bấm màn hình hoặc phím Space/Enter để hiện hết câu hoặc sang câu sau. Có nút "Bỏ qua thoại".
- Chân dung người nói ở góc; viền đổi màu theo độ căng của cảnh.
- **Màn "Kết quả"** sau mỗi cảnh: tóm tắt được gì, mất gì, rồi mới về bản đồ.
- Bot `sim.cjs` và `sim2.cjs` phải chơi được cảnh: chọn `stay` ngẫu nhiên trong phạm vi `budget`, ưu tiên lựa chọn ẩn khi đã mở.

> **Vì sao chỉnh:**
> - **Bỏ "tua nhanh ghi nhớ node".** Tua nhanh đã không còn đường vào (xem mục 0, dòng 3).
> - **Thêm yêu cầu cho bot.** Không có bot chơi cảnh thì mọi con số cân bằng ở mục 1.2 đều vô nghĩa.
> - **Viền đổi màu theo `tense`, thay cho "hào quang cảm xúc".** Như vậy màu có ý nghĩa trong luật chơi, không chỉ để trang trí.

---

## 3. Tám mốc chính viết lại thành cảnh

Tuần lấy theo `CANON` trong `js/events.js`.

| Tuần | Mốc | Nơi | Nhân vật | Nhánh chính | Đường lệch vẫn qua được |
|:-:|---|---|---|---|---|
| 1 | Lễ khai khiếu (`c_khaikhieu`) | Biển hoa, học đường | Gia lão, Phương Chính | Bính đẳng 44%, bị cười nhạo; dò xét ai đang để ý ngươi | Kết thân sớm với Phương Chính, hoặc đe dọa nó ngay từ đầu (mở tuyến NPC khác) |
| 3 | Đòi gia sản (`c_giasan`) | Nhà cậu mợ | Cậu Đống Thổ, mợ, Trầm Thúy | Nói chuyện với từng người; tìm khế ước; ép, kiện hoặc nhịn | Mua chuộc Trầm Thúy ngay trong cảnh thì biết mợ giấu khế ước ở đâu, lấy trọn tửu lâu mà không mang tiếng |
| 4 | Cổng học đường (`c_conghocduong`) | Cổng học đường | Bạn học, Mạc Bắc, gia lão | Ba đợt chặn cổng như bản gốc | Không cướp mà "bảo kê": thu phí đám học trò nghèo để che chở chúng khỏi Mạc Bắc |
| 6 | Khảo hạch (`c_khaohach`) | Học đường | Gia lão, Phương Chính, Mạc Bắc, Xích Thành | Tranh hạng nhất, thưởng Thanh Đồng Xá Lợi Cổ | Giấu thực lực, rồi đêm đó đổi tin với kẻ thắng để lấy cổ |
| 11 | Khe đá bờ sông (`c_kimsinh`) | Sơn trại, khe đá | Cổ Kim Sinh | Như mục 2.1 | Ép làm tai mắt, không án mạng |
| 17 | Gặp Bạch Ngưng Băng (`c_bai`) | Núi Thanh Mao | Bạch Ngưng Băng | Đấu khẩu về sinh tử; thử ba chiêu | Quan sát hàn khí làm hắn run, đưa Hỏa Lô Cổ hoặc Sinh Cơ Diệp cho thử: kết giao sớm |
| 19–20 | Lang triều (`c_lang1`–`c_lang3`, gộp thành 2 tuần) | Tường trại | Bầy Điện Lang, Thanh Thư | Tuần 19 giữ tường; tuần 20 Lang Vương phá cổng, Thanh Thư dùng Mộc Mị Cổ | Báo trước cho Thanh Thư về Mộc Mị, hoặc đánh vào chỗ hàn khí yếu: Thanh Thư sống |
| 25–27 | Trận cuối (`c_thietvay`, `c_nhatdai`, `c_final`) | Động Huyết Hồ | Nhất Đại, Thiên Hạc Thượng Nhân, Bạch Ngưng Băng | **Đã có trên main** (Hạc Tai, Thiền lần hai, Âm Dương Chuyển Thân, `huyetlo_bai`). Chỉ chuyển sang dạng cảnh, không viết lại cốt truyện | Gom liên minh (thần bổ, tộc trưởng, Phương Chính, Thanh Thư, ai còn sống và thân với ngươi) để trận dễ hơn |

> **Vì sao chỉnh:**
> - **Tuần và mã mốc.** Sửa khảo hạch 8→6, Bạch Ngưng Băng 15→17, `c_robgate`→`c_conghocduong` cho khớp code.
> - **Thêm cột "Đường lệch".** Thiếu cột này thì 8 cảnh vẫn chỉ là nguyên tác dài hơn.
> - **Trận cuối chỉ chuyển dạng.** Commit `9343ced` đã làm Hạc Tai, Thiền lần hai và Âm Dương Chuyển Thân. Viết lại từ đầu vừa tốn công vừa dễ làm gãy lối vào Quyển 2.
> - **Lang triều gộp 3 tuần thành 2, không xóa mốc.** Gộp phải cập nhật cả `VARIANTS.lang`, `S.tideT`, `URGENT` và hậu quả trễ (`AFTER`). Nội dung của 3 mốc cũ ghép thành các nút của một cảnh.
> - **Nguồn Thạch Khiếu và Cường Thủ.** Bản gốc cho lấy từ xác Hùng Chiên ở tuần 20. Main đã có nguồn cho hai cổ này (`e79d56d`), nên giữ nguồn cũ, không nhân đôi.
> - **"Dòng sông Hoa Cúc" đổi thành "biển hoa".** Cho khớp văn bản đang có trong game.

---

## 4. Sáu chuỗi chuyện phụ

Mỗi chuỗi 3 phần, rải qua nhiều tuần. Khung thời gian: phần sau tới bằng `later()` sau 2–4 tuần, hoặc khi người chơi quay lại đúng nơi đó.

| Chuỗi | Nơi, từ tuần | Đã có trong code | Việc cần làm |
|---|---|---|---|
| **Tửu lâu** | Sơn trại, sau `c_giasan` | `S.f.tuulau`, `r_tuulau` | 3 phần: chưởng quầy ăn bớt, khách trả nguyên thạch pha tạp, Thương đội gạ mua. Bán thì được **100 thạch** và mất thu nhập hàng tuần |
| **Trầm Thúy** | Nhà, từ tuần 8 (`c_tramthuy`) | `c_tramthuy`, `tramthuySpy`, `r_tramthuytin`, `q_tramthuyhan` | Nối thành 3 phần có thoại. Canon: sau khai khiếu nàng ngả sang Phương Chính. Người chơi chọn dùng, đuổi hoặc giữ nàng |
| **Xích và Mạc** | Sơn trại, học đường, từ tuần 6 | Tuyến NPC `xich_mac`, `r_phephai`, `k_hd_gialaosay2` | Thêm "đưa thư hai đầu" và "ăn cả hai phe". Bị lộ thì hiềm nghi tăng mạnh |
| **Bãi nguyệt lan** | Núi, từ tuần 5 | `r_nguyetlan`, `r_thunguyetlan`, `freeMoon` | 3 phần: phát hiện, Hùng gia giành, giữ hay chia. Thưởng tối đa: **Nguyệt Quang ăn miễn phí 1 tuần mỗi tháng** |
| **Học trò cổng** | Cổng học đường, từ tuần 5 | Hành động `robgate`, `k_hd_hocngheo` | 3 phần: bị phục thù, bắt quy phục, lập mạng lưới tin. Mạng lưới làm hiềm nghi giảm nhanh hơn, không cho tiền hàng tuần |
| **Săn Lôi Quan Lang** | Núi, tuần 14–18 | `r_dausoi`, `k_nui_soicon`, cờ `wolfPrep` | 3 phần: dấu vết, hang đá, hạ sói tinh anh. Thưởng: `wolfPrep` (**+15% sát thương lên sói**), huyết khí, da sói bán |

> **Vì sao chỉnh:**
> - **Nối vào cái đã có.** Trầm Thúy, Xích–Mạc, nguyệt lan và dấu sói đều đã có cờ và sự kiện. Viết mới theo mã `s_*` sẽ cho hai tuyến song song, có thể mâu thuẫn nhau (ví dụ Trầm Thúy vừa làm gián điệp vừa đã bị đuổi).
> - **Bỏ "thú đan".** Cổ Chân Nhân không có đan dược; thú săn cho huyết khí, da và có khi cổ hoang.
> - **Sửa tác dụng của `wolfPrep`.** Trong code nó là +15% sát thương gây lên sói (`engine.js`), không phải giảm 15% sát thương nhận vào.
> - **Hạ các phần thưởng quá lớn:**
>   - Bán tửu lâu: 300 → 100 thạch. Tửu lâu chỉ nộp 3–6 thạch mỗi tuần; một lần 300 thạch ở giữa game là đủ mua mọi cổ trong chợ.
>   - Nguyệt Quang ăn miễn phí "cả đời" → 1 tuần mỗi tháng (giống thế giới `thuhoach` đang có).
>   - Mạng lưới học trò không cho tiền hàng tuần, vì tiền hàng tuần cộng dồn 20 tuần là quá nhiều.
> - **Bỏ sơ đồ mermaid.** Bảng đã đủ, và mermaid không hiện trong nhiều trình xem .md.

---

## 5. Asset và nguồn cổ

### 5.1. Chân dung nhân vật
Các ảnh `assets/art/p_*.jpg`, `assets/npc/n_*.jpg` và `assets/gu/g_*.jpg` đang **chưa commit**; `js/battle.js`, `js/present.js`, `js/living.js` đang có thay đổi chưa commit dùng các ảnh này. Anh đã cho phép dùng và public, nên commit chung trong PR-1.

| Nhân vật | File | Hiển thị |
|---|---|---|
| Bạch Ngưng Băng (nữ) | `art/p_bai_female.jpg`, `npc/n_bai_nu.jpg` | Khi `S.f.bai_nu` hoặc **`S.book === 2`** |
| Bạch Ngưng Băng (nam) | `art/p_bai.jpg`, `npc/n_bai.jpg` | Mặc định ở Quyển 1 |
| Cổ Nguyệt Nhất Đại | `art/p_nhatdai.jpg`, `npc/n_nhatdai.jpg` | Trận cuối Quyển 1 |
| Thanh Thư | `art/p_thanhthu.jpg`, `npc/n_thanhthu.jpg` | Tuyến Thanh Thư, lang triều |
| Phương Chính | `art/p_phuongchinh.jpg`, `npc/n_phuongchinh.jpg` | Khai khiếu, học đường, tuyến Phương Chính |
| Thiết Nhược Nam | `art/p_thietnhuocnam.jpg`, `npc/n_thietnhuocnam.jpg` | Tra án của Thiết Huyết Lãnh |

> **Vì sao chỉnh:** code hiện kiểm tra `S.q >= 2`, nhưng không có biến `S.q`; Quyển 2 dùng `S.book === 2`. Để nguyên thì Bạch Ngưng Băng không bao giờ đổi sang chân dung nữ ở Quyển 2.

### 5.2. "16 cổ còn thiếu" phần lớn là báo sai của công cụ

`check.cjs` chỉ quét `events.js`, `engine.js`, `data.js`, `minigame.js`, `auto.js`. Nó tìm đúng mẫu `gainGu('x'`, và bỏ qua công thức luyện, `pick([...])` và toàn bộ thư mục `js/q2/`. Đối chiếu với code thật:

| Cổ | Nguồn thật | Việc cần làm |
|---|---|---|
| `tuvi` (**Tứ Vị Tửu Trùng**, không phải "Tử Vi Cổ") | Công thức: Tửu Trùng + tứ vị tửu | Không cần |
| `nguyetmang` | Công thức: Nguyệt Quang + U Quang | Không cần |
| `bachngoc` | Công thức: Ngọc Bì + Bạch Thỉ; hậu sơn tầng hai | Không cần |
| `uguang` | Ẩn sĩ đánh cờ (`k_nui_ansi2`, qua `pick`) | Không cần |
| `bangdao`, `thuytrao` | Dị số trong `events.js` (rút qua `pick([...])`) | Không cần |
| `khieukhieu`, `thanhnhiet`, `maluc`, `quyluc`, `tuongluc`, `mangluc`, `tulucsinh`, `kimcuong`, `trucxung` | Các chương Quyển 2 (`js/q2/ch4`–`ch8`) | Không cần. **Không** đưa vào Quyển 1: lực đạo là nội dung Thương gia thành ở Quyển 2 |
| `nole` (Nô Lệ Cổ, Tứ chuyển) | Chưa có nguồn | Để lại cho phần truyện sau Quyển 2. Tứ chuyển xuất hiện ở Quyển 1 là sai cảnh giới |

**Việc thật cần làm:** sửa `check.cjs` cho đúng:
- Quét cả `js/q2/*.js`.
- Tính nguồn từ `RECIPES`, `pick([...])`, `SHOP`, `CARAVAN`, `WILD`, `DROP_POOL`.
- Cho khai báo cổ "để dành" (ví dụ `later:1` trong `GU`) để không báo lỗi.

> **Vì sao chỉnh:** gắn nguồn giả chỉ để công cụ hết cảnh báo sẽ đặt cổ Quyển 2, thậm chí cổ Tứ chuyển, vào Quyển 1. Làm vậy phạm luật "cơ chế và cảnh giới theo truyện", và làm Quyển 1 dễ đi. Bản gốc còn ghi sai tên (`tuvi` là Tứ Vị Tửu Trùng) và đề xuất nguồn cho những con đã có công thức luyện.

---

## 6. Lộ trình

```
PR-1 Máy cảnh + asset + sửa check.cjs
  └─> PR-2 4 mốc đầu (tuần 1–6)
        └─> PR-3 3 chuỗi phụ (Tửu lâu, Trầm Thúy, Học trò cổng)
              └─> PR-4 4 mốc sau + gộp lang triều
                    └─> PR-5 3 chuỗi phụ còn lại + thế giới phản ứng + cân bằng
```

> **Vì sao chỉnh:**
> - **Từ 6 PR còn 5.** Asset gộp vào PR-1; nó chỉ là commit ảnh và vài dòng hiển thị.
> - **Máy cảnh làm đầu tiên.** Mọi PR sau đều cần nó.
> - **Mốc và chuỗi phụ xen kẽ, không dồn 6 chuỗi vào một PR.** Mỗi PR chơi thử được ngay và cân bằng dần. Nếu dồn, một PR thêm 18 sự kiện và 4 cảnh sẽ làm tỉ lệ thắng nhảy mạnh, khó biết nguyên nhân.

### PR-1: Máy cảnh, asset, sửa công cụ
- `scene` trong `engine.js`: `talk`, `stay`, `budget`, `flag`, `hidden`, `mem`, `rel`, `go`, `fight`, `tense`, `wait`. Trạng thái lưu ở `S.sc`.
- Hộp thoại, màn "Kết quả" và bỏ qua thoại trong `ui.js`.
- Bot `sim.cjs` và `sim2.cjs` chơi được cảnh.
- `check.cjs`: kiểm tra `go` và `fight.win`/`fight.flee` trỏ tới nút tồn tại, không có nút mồ côi; sửa báo sai ở mục 5.2.
- Commit ảnh, sửa `S.q` thành `S.book`.
- Chuyển thử 2 sự kiện cũ sang dạng cảnh: `k_nui_ansi` và `k_hd_gialaosay` (đang là chuỗi 2 thẻ nối bằng `thenEv`).
- **Nghiệm thu:** chơi 2 cảnh trên điện thoại và máy tính; `check.cjs` 0 lỗi.

### PR-2: Bốn mốc đầu
- Khai khiếu, gia sản, cổng học đường, khảo hạch, mỗi mốc có đường lệch như mục 3.
- **Nghiệm thu:** chơi 10 tuần đầu; bot bám truyện vẫn 40–45%.

### PR-3: Ba chuỗi phụ đầu
- Tửu lâu, Trầm Thúy, học trò cổng, nối vào cờ đã có.
- **Nghiệm thu:** mỗi đời bot gặp ≥ 25 chuyện phụ khác nhau; không chuyện nào lặp trong vòng 3 tuần.

### PR-4: Bốn mốc sau và gộp lang triều
- Kim Sinh, Bạch Ngưng Băng, lang triều (2 tuần), chuyển trận cuối sang dạng cảnh.
- Cập nhật `CANON`, `VARIANTS.lang`, `S.tideT`, `URGENT`.
- **Nghiệm thu:** bot đi lệch ≥ 25%; kết cục `huyetlo_bai` vẫn đạt được; `sim2.cjs` vào Quyển 2 bình thường.

### PR-5: Ba chuỗi còn lại, thế giới phản ứng, cân bằng
- Xích–Mạc, nguyệt lan, săn Lôi Quan Lang.
- NPC nhắc lại việc ngươi đã làm (bằng `cond` và câu thoại thay thế).
- Cân lại `DIFF` nếu lệch khỏi cổng. Hiện độ khó đã tăng dần theo tuần (×0,8 → ×1,2) để đầu game không chết oan; chỉ chỉnh thêm nếu số đo yêu cầu.

> **Vì sao chỉnh PR-5:** bản gốc có bước "giảm sát thương quái đầu game". Việc này đã làm bằng đường cong độ khó theo tuần trong `3b1ed7a`. Giảm thêm nữa sẽ làm kiếp đầu quá dễ.

---

## 7. Cần anh chốt

1. **Đường lệch ở mục 3** (cột cuối): có mốc nào anh muốn hướng lệch khác không?
2. **Cổng bot đi lệch ≥ 25%**: cao quá hay vừa?
3. **Bắt đầu PR-1** (máy cảnh, asset, sửa `check.cjs`) được chưa?
