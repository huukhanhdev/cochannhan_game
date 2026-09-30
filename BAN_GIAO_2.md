# Bàn giao 2: cánh bướm, hội thoại, cảnh nhiều bước, chống trùng sự kiện, Quyển 2 (Tam Vương truyền thừa)

Tài liệu này nối tiếp `BAN_GIAO.md` (bước 1.2 Sổ ký ức). Các nguyên tắc chung, luật bản quyền, cách test, và các bẫy đã biết vẫn giữ nguyên như trong đó, nên đọc file đó trước.

**Thứ tự làm.** Làm theo thứ tự A → B → C → D → E. Bốn phần đầu là hạ tầng nhỏ, mỗi phần là một PR riêng. Phần E (Quyển 2) là phần lớn và cần A–D trước. Chỉ bắt đầu sau khi PR Sổ ký ức (1.2) đã gộp vào main, vì cả hai cùng sửa `choose()`, `choiceBtn()` và phần sự kiện trong `render()`.

**Kiểm tra bắt buộc sau mỗi PR:**
- `node tools/sim.cjs 300 6`: tỉ lệ thắng 15–35%, không có "kẹt vòng lặp".
- `node tools/ff_test.cjs 100`: 0 lỗi.
- Smoke test trình duyệt không có lỗi JS. Cách chạy xem README.

---

## A. Chống trùng sự kiện ngẫu nhiên

**Hiện trạng.** Hàm `randomEvent(loc)` (`js/engine.js`) chọn theo trọng số `w` và thiên cơ. Sự kiện không có `once` có thể ra liên tiếp hai tuần liền, và cũng không có cách hiện câu chữ khác nhau cho cùng một sự kiện.

**Làm.**
1. **Hồi chiêu.** Thêm `S.evLast={id:turn}`. Một sự kiện vừa ra thì bị loại khỏi pool trong `e.cd||6` tuần.
2. **Giảm dần theo số lần gặp.** Thêm `S.evSeen={id:n}`. Trọng số nhân thêm `1/(1+n)`, nên càng gặp nhiều trong kiếp càng hiếm.
3. **Ưu tiên sự kiện mới ở kiếp sau.** Sự kiện chưa có trong `META.seen` được nhân trọng số ×1.5. Mục đích là để kiếp sau gặp được thứ mới.
4. **Bài câu chữ.** Trường `text` được phép là mảng hàm. Chọn bản theo `(S.evSeen[id]||0) % text.length`, để lần gặp thứ hai đọc khác lần đầu.
5. Nếu pool rỗng vì tất cả đều đang hồi chiêu, trả `false`. Các nhánh gọi `randomEvent` đã có câu dự phòng sẵn.

Phác thảo:
```js
function randomEvent(loc){
  S.evLast=S.evLast||{};S.evSeen=S.evSeen||{};
  const pool=Object.entries(EV).filter(([id,e])=>e.loc===loc&&(!e.cond||e.cond())&&!(e.once&&S.f['ev_'+id])
    &&!(S.evLast[id]!=null&&S.turn-S.evLast[id]<(e.cd||6)));
  const wt=(id,e)=>(e.w||1)/(1+(S.evSeen[id]||0))*((META.seen||{})[id]?1:1.5)
    *(S.world||[]).reduce((m,k)=>m*((WORLD_WEIGHT[k]||{})[id]||1),1);
  // ...giống cũ; khi chọn được: S.evLast[id]=S.turn; S.evSeen[id]=(S.evSeen[id]||0)+1;
}
```
Trong `ui.js`, chỗ gọi `ev.text()` đổi thành một helper `evText(id)` dùng chung. `ff.js` hiện không đọc `text`, nên không cần sửa.

**Nghiệm thu.** Chạy mô phỏng 1 kiếp và ghi log id sự kiện. Không có id nào (trừ mốc nguyên tác) lặp lại trong vòng 6 tuần.

---

## B. Hội thoại trong sự kiện

**Mục tiêu.** Sự kiện NPC có vài câu thoại qua lại có người nói, không chỉ một đoạn văn kể. Việc này chỉ thêm dữ liệu và giao diện, không đổi luật chơi.

**Dữ liệu.** Thêm trường tùy chọn `talk`, là mảng hoặc hàm trả mảng:
```js
npc_pc_1:{title:'...',
  talk:()=>[
    ['phuongchinh','Ca ca... huynh thật sự chỉ đạt Bính đẳng sao?'],
    ['hero','Ngươi hỏi thế để làm gì.'],
    ['phuongchinh',S.rel.phuongchinh>20?'Đệ... chỉ muốn giúp.':'Không có gì.'],
  ],
  text:()=>'...', choices:[...]}
```
- Người nói là khóa trong `NPCS` (đã có tên và ảnh), `'hero'`, hoặc `null` cho lời dẫn truyện.
- Mỗi câu thoại tối đa khoảng 120 ký tự. Phải là lời tự viết, không chép câu gốc trong truyện.

**Giao diện** (`ui.js`, phần `S.evq.length` trong `render()`):
- Hiện từng câu thoại theo kiểu bong bóng: avatar tròn nhỏ lấy từ ảnh NPC, tên, rồi câu thoại.
- Có nút "Tiếp" để hiện câu kế. Bấm vào vùng thoại thì hiện hết ngay.
- Các nút lựa chọn chỉ hiện sau khi thoại đã hiện hết.
- Tiến độ lưu ở `S.talkI` (reset khi chuyển sự kiện) để render lại không mất chỗ đang đọc.
- Khi tua nhanh (`S.ff`), bỏ qua thoại.

**Phạm vi nội dung đợt đầu.** Viết thoại cho các tuyến NPC có sẵn: npc_pc_*, npc_tt_*, npc_bai_*, npc_xm_*, npc_cm_*. Mỗi sự kiện 2–5 câu.

---

## C. Cảnh nhiều bước (một cảnh có nhiều lựa chọn nối tiếp)

**Hiện trạng.** Mỗi sự kiện chỉ cho chọn đúng một lần rồi đóng lại.

**Làm.** Thêm ba cơ chế nhỏ vào `choose()`. Cả ba có thể dùng cùng nhau.

1. **`stay:1`: lựa chọn phụ không kết thúc cảnh.** Dùng cho các lựa chọn kiểu "hỏi thêm", "quan sát", "dò xét".
   - Chọn xong, cảnh vẫn mở và lựa chọn đó biến mất. Danh sách đã chọn lưu ở `S.picked[id]=[i,...]`.
   - Mỗi cảnh có ngân sách `ev.budget||2` lượt phụ. Hết ngân sách thì chỉ còn các lựa chọn kết thúc.
   - Cài đặt: không gọi `S.evq.shift()` khi `c.stay`. `choicesOf` lọc bỏ các lựa chọn đã chọn trong `S.picked`.

2. **`go:'id'`: nhảy sang một nút con.** Ví dụ: đàm phán → đòi giá → Giả Phú nổi giận → đánh hoặc lùi.
   - Nút con là một mục `EV` bình thường. Nó không có `loc` và không có `canon`, nên không bị rút ngẫu nhiên.
   - Nút con dùng chung ảnh và tiêu đề với cảnh gốc (trường `of:'id_gốc'`).
   - Cài đặt: sau khi xử lý `eff`/`ok`/`fail`, nếu có `c.go` (hoặc `c.goOk`/`c.goFail` khi lựa chọn có tung xúc xắc) thì `S.evq.unshift(go)`.

3. **`hidden` + `reveal`: lựa chọn ẩn.** Lựa chọn có `hidden:'flag'` chỉ hiện khi `S.f[flag]` đã được một lựa chọn `stay` bật lên.
   - Ví dụ: quan sát kỹ thì phát hiện kẻ kia đang giấu thương, từ đó mở ra lựa chọn "Đánh vào chỗ bị thương".

**Ảnh hưởng tới các hệ khác.**
- `ffRememberChoice` phải ghi cả chuỗi lựa chọn. Đổi `META.choiceMem[id]` thành lưu lựa chọn cuối cùng, vẫn khớp theo văn bản `c.t`, nên khi tua nhanh vẫn chọn lại được từng nút.
- Với `stay`, FF bỏ qua (không chọn lựa chọn phụ nào).
- Trong `tools/sim.cjs`, bot đang chọn theo điểm cao nhất nên có thể kẹt vòng `stay`. Thêm một dòng: bỏ qua lựa chọn có `stay` nếu `Math.random()<.5` hoặc ngân sách đã hết.

**Cảnh mẫu nên làm lại trước.** Mỗi cảnh cần ít nhất một `stay` và một `go`.
- `c_kimsinh` (Giả Kim Sinh)
- `c_bai` (Bạch Ngưng Băng)
- `c_luancong` (luận công sau lang triều)
- `r_choden` (chợ đen)

---

## D. Hiệu ứng cánh bướm thật sự

**Hiện trạng.** Hiện có ba thứ gọi là "cánh bướm", nhưng lựa chọn của người chơi chưa thật sự gây gợn sóng về sau:
- `S.world` rút ngẫu nhiên 2 thiên cơ mỗi kiếp.
- `S.var` quyết định biến thể của các mốc nguyên tác.
- `FF_BUTTERFLY` dừng tua nhanh khi biến thể khác kiếp trước.

**Ý tưởng cốt lõi, đúng tinh thần nguyên tác.** Ký ức kiếp trước của Phương Nguyên là lợi thế lớn nhất. Nhưng càng thay đổi thế giới, ký ức càng sai lệch.

### D1. Hậu quả trễ (trong một kiếp)
Lựa chọn có thể gieo một sự kiện sẽ xảy ra sau vài tuần:
```js
{t:'Tha cho tên thợ săn',eff:()=>{later('r_thosan_on',4,8);return '...'}}
// later(id, minTuần, maxTuần) → S.later.push({t:S.turn+rand, id})
```
- Trong `startTurn()`, trước khi xét mốc nguyên tác, đẩy các mục `S.later` đã đến hạn vào `evq`.
- Mỗi mục `later` có thể kèm `cond` để hủy nếu tình thế đã khác. Ví dụ: nếu NPC đã chết thì không xảy ra.
- Đợt đầu viết khoảng 10 cặp nhân–quả. Ví dụ:
  - Tha thợ săn → nhiều tuần sau họ báo tin chỗ có cổ hoang.
  - Cướp ở cổng học đường → một bạn học tụ tập người phục kích ngươi.
  - Giúp Phương Chính → hắn đỡ cho ngươi một lần khi bị thẩm vấn.

### D2. Độ lệch nguyên tác (trong một kiếp)
Đã có `S.canonHit` / `S.canonMiss`. Từ đó tính `drift = canonMiss*8 + số biến thể S.var khác mặc định*5`, giới hạn 0–100.
- Mọi phần thưởng từ ký ức (`bonus:()=>mem(x)?N:0`) được nhân thêm `(1-drift/150)`. Lệch nhiều thì ký ức kém chính xác.
- Khi `drift>=40`, có thể xuất hiện "sự kiện dị số": những chuyện không có trong ký ức, nằm trong một pool riêng `loc:'diso'`.
- Chỉ số drift hiển thị ở HUD cạnh chip Xuân Thu Thiền, dạng "Thiên cơ lệch N%".

### D3. Thế giới nhớ kiếp trước (xuyên kiếp)
Có ở mức nhẹ để kiếp sau khác đi.
- Lưu `META.lastEchoes`: các cờ đáng nhớ của kiếp trước, như giết ai, cứu ai, và kết cục.
- Kiếp sau có tỉ lệ nhỏ sinh "dư âm". Ví dụ: kiếp trước giết Giả Kim Sinh ở tuần 12, kiếp này Giả Phú lên núi đã cảnh giác hơn (biến thể `S.var.kimsinh` nghiêng về bản khó).
- Không được phá luật nguyên tác "chỉ Phương Nguyên nhớ". NPC không nhớ, chỉ xác suất thế giới nghiêng đi. Viết lời dẫn kiểu "Có điều gì đó khác với ký ức của ngươi".

### D4. Tua nhanh
- `FF_BUTTERFLY` thêm điều kiện dừng khi có mục `S.later` sắp nổ (còn ≤1 tuần), hoặc khi drift vượt ngưỡng 40.
- Kiểm thử bằng `ff_test` rằng FF vẫn đi được hơn 40% số tuần mục tiêu.

---

## E. Quyển 2: đến Tam Vương truyền thừa

### Mốc nguyên tác
Dựa theo tóm tắt công khai; không chép lời truyện. Sau khi rời Thanh Mao Sơn, Phương Nguyên đi cùng Bạch Ngưng Băng:
1. Qua **Bạch Cốt Sơn**, gây họa rồi chạy.
2. Đến **Thương gia thành**. Hai người hộ tống **Thương Tâm Từ** và nhờ đó có vốn liếng, căn cơ trong thành.
3. Lên **Tam Xoa Sơn** dự **Tam Vương truyền thừa**. Ở đây có:
   - Nhóm lão cổ sư Thiết gia (tứ lão).
   - Bạch Ngưng Băng ngầm cấu kết Thiết gia, nhờ Tố Thủ Y Sư giải Độc Thệ Cổ, rồi phản bội.
   - Phương Nguyên buộc phải dùng lại Xuân Thu Thiền.
   - Tam Vương phúc địa bị hủy.

Chi tiết từng chương cần được đối chiếu lại bởi người biết truyện, và ghi nguồn vào `CAP_NHAT_CO_TRUNG.md` hoặc một file `NGUYEN_TAC_Q2.md`. Nếu không chắc một chi tiết thì để nó thành sự kiện ngẫu nhiên, không đưa vào mốc nguyên tác.

### Kiến trúc: "chương" thay vì nhồi thêm tuần
Hiện toàn bộ game gắn cứng với 27 tuần ở Thanh Mao Sơn: `CANON`, `ACTS`, `loc`, và trận cuối. Không kéo dài 27 tuần. Thay vào đó:

1. **`S.chap`.** Giá trị `1` là Thanh Mao Sơn, `2` là Quyển 2. Thêm bảng `CHAPTERS`:
   ```js
   const CHAPTERS={
     1:{canon:CANON,acts:ACTS_Q1,end:27,unit:'tuần'},
     2:{canon:CANON_Q2,acts:ACTS_Q2,end:30,unit:'tuần', start:q2Start},
   };
   ```
   - `startTurn()` đọc `CHAPTERS[S.chap].canon`, không đọc thẳng `CANON` nữa.
   - `ACTS` lọc theo chương.
   - `month()` / `tuan()` hiển thị theo chương. Quyển 2 có thể hiện "Năm thứ N".

2. **Chuyển chương.** Chỉ các kết cục rời núi (`ma`, `bai_dong`, `huyetlo_bai`) mới mở cửa Quyển 2.
   - Màn thắng thêm nút "Tiếp tục: rời Thanh Mao Sơn".
   - `q2Start()` giữ lại cảnh giới, cổ trùng và Bạch Ngưng Băng (nếu có). Nó reset `S.turn`, `S.susp`, nhiệm vụ gia tộc và trợ cấp; thay các nguồn thu bằng nguồn Quyển 2.
   - Lưu mốc `META.q2Unlocked=1`. Từ đó màn tân kiếp cho chọn "Bắt đầu từ Quyển 2", dùng một bộ khởi đầu cố định để không phải chơi lại Quyển 1.

3. **Xuân Thu Thiền ở Quyển 2** vẫn dùng đúng luật hiện tại trong `js/cicada.js`. Mốc Tam Vương có cảnh bắt buộc: Phương Nguyên phải dùng Thiền, nên cảnh này chỉ vào được khi `cicadaReady()`. Nếu Thiền chưa hồi phục thì đó là kết cục thua có chủ đích ("không kịp"). Đây là chỗ nối đẹp giữa luật chơi và nguyên tác.

4. **Địa điểm Quyển 2.** Thêm `loc` mới:
   - `duong` (đường lữ hành): sơn tặc, ma tu, cổ hoang.
   - `thuongthanh` (Thương gia thành): chợ lớn, đấu trường, tin tức.
   - `tamxoa` (Tam Xoa Sơn): các lượt vào truyền thừa.

   Mỗi địa điểm cần 8–12 sự kiện ngẫu nhiên, dùng luôn hệ chống trùng ở phần A.

5. **Cơ chế riêng của Tam Vương truyền thừa**, làm như một minigame mới trong `minigame.js`:
   - Mỗi lượt vào có giới hạn số lượt.
   - Mỗi lượt là thử thách chọn một trong ba ải: lực đạo, trí, hoặc ẩn.
   - Gặp các cổ sư khác thì chọn liên minh, gài bẫy hoặc giết.
   - Có "lệnh bài du hành" cho phép xem trước một ải (theo nguyên tác, Phương Nguyên dùng lệnh bài để thấy Bạch Ngưng Băng bị vây).
   - Tuyến Bạch Ngưng Băng: dùng quan hệ `S.rel.bai` và cờ `S.f.docthe` quyết định thời điểm phản bội. Người chơi có thể thấy trước để đề phòng nếu có ký ức từ kiếp trước (`mem('bai_phanboi')`), nhưng không ngăn được hẳn vì là mốc nguyên tác.

6. **Dữ liệu mới.**
   - NPC: Thương Tâm Từ, Thiết gia tứ lão, Tố Thủ Y Sư, cổ sư lực đạo.
   - Kẻ thù kèm `EAI`.
   - Cổ trùng Quyển 2: chỉ dùng cổ có trong danh sách chuẩn của người dùng. Cổ nào chưa có thì bổ sung vào `CAP_NHAT_CO_TRUNG.md` trước.
   - Kết cục Quyển 2.

7. **Cân bằng.** Mở rộng `tools/sim.cjs` với cờ `--chap 2`: bắt đầu từ bộ khởi đầu Quyển 2. Mục tiêu thắng 15–35%.

### Chia nhỏ Quyển 2
| PR | Nội dung |
|---|---|
| E1 | Khung chương: `S.chap`, `CHAPTERS`, chuyển chương, lưu và migrate save. Quyển 2 chỉ có 3 tuần trống. |
| E2 | Đường lữ hành và Bạch Cốt Sơn: mốc và sự kiện ngẫu nhiên. |
| E3 | Thương gia thành, tuyến Thương Tâm Từ. |
| E4 | Minigame Tam Vương truyền thừa. |
| E5 | Tuyến phản bội của Bạch Ngưng Băng và cảnh Xuân Thu Thiền. Các kết cục. |
| E6 | Ảnh (tự thiết kế, không vẽ lại nhân vật manhua hay donghua), âm thanh, cân bằng. |

---

## Tóm tắt các file sẽ đụng

| Phần | engine.js | events.js | ui.js | ff.js | data.js | sim.cjs | khác |
|---|---|---|---|---|---|---|---|
| A | `randomEvent` | thêm `cd`, mảng `text` | `evText` | | | | |
| B | | thêm `talk` | bong bóng thoại, CSS | bỏ qua thoại | | | index.html (CSS) |
| C | `choose`, `choicesOf` | cảnh mẫu | ẩn lựa chọn đã chọn | nhớ chuỗi | | bot né `stay` | |
| D | `later`, drift, `startTurn` | cặp nhân–quả, pool `diso` | chip drift | điều kiện dừng | | | cicada không đổi |
| E | chương | nội dung Q2 | màn chuyển chương | | NPC, kẻ thù, cổ | `--chap` | minigame.js |
