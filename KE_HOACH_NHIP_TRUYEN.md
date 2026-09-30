# Kế hoạch: giãn nhịp truyện, thêm sự kiện phụ, sự kiện có hội thoại nhiều bước

**Vấn đề người chơi gặp:** chơi như đang lướt qua cốt truyện chính. Mốc chính tới quá nhanh. Bấm vào một sự kiện phụ, chưa kịp làm gì thì đã sang mốc chính. Sự kiện nào cũng chỉ chọn một lần là xong.

---

## 1. Kiểm tra bản hiện tại (30/09/2026)

| Đo | Số liệu | Hệ quả |
|---|---|---|
| Mốc chính trên lịch | **20 trong 27 tuần** (`CANON`, `js/events.js:5`) | Chỉ có 7 tuần trống cho chuyện phụ |
| Số việc mỗi tuần | **1** (`act()` gán `S.acted=true` rồi gọi `advance()` → `endTurn()` ngay, `js/engine.js:333`) | Cả một đời chỉ có khoảng 27 lần tự làm gì đó |
| Sau một việc | `startTurn()` đẩy mốc tuần sau vào hàng đợi ngay | Đây chính là cảm giác "vừa bấm sự kiện phụ đã tới sự kiện chính" |
| Sự kiện phụ theo nơi | học đường 9, sơn trại 15, núi 16, nhiệm vụ 7, hậu sơn 5, NPC 23, dị số 10 | Chỉ lọt vào 7 tuần trống, nên phần lớn không bao giờ thấy |
| Độ dài | Mốc chính trung bình **35 chữ** và 2,9 lựa chọn; sự kiện phụ **14–17 chữ** và khoảng 2 lựa chọn | Một đoạn, một lần chọn, hết |
| Sự kiện nhiều bước | Hầu như không có. Chỉ hậu sơn (`hs_*`) và tuyến NPC nối qua nhiều tuần | Không có hội thoại qua lại, không có dò xét, không có cảnh leo thang |

**Kết luận:** vấn đề không nằm ở số lượng sự kiện, mà ở **nhịp**: một tuần một việc, và mốc chính gần như tuần nào cũng có. Nếu chỉ thêm sự kiện phụ mà không sửa nhịp, người chơi vẫn không có chỗ để gặp chúng.

---

## 2. Nhịp mới: một tuần nhiều việc, mốc chính không tự bật lên

### 2.1 Ba việc mỗi tuần

- Mỗi tuần (10 ngày) có **3 việc**: thượng, trung, hạ.
- Đi núi, lên học đường, dạo sơn trại, làm nhiệm vụ, nghỉ ngơi: mỗi việc tốn 1.
- **Bế quan tốn cả 3.** Trong truyện, bế quan là mười ngày nên cả tuần đi tu luyện. Chân nguyên vẫn hồi theo tuần như hiện tại, nên không thể bế quan 3 lần để tu vi tăng gấp 3.
- Thanh trên cùng hiện `Tuần 5 · việc 2/3`.
- Nút "Qua tuần" cho phép bỏ các việc còn lại.

### 2.2 Mốc chính chờ người chơi

- Mốc chính **không bật ra đầu tuần** nữa. Nó hiện trong ô **"Sắp tới"** ở bản đồ, ví dụ "Giả Kim Sinh ra bờ sông (hạ tuần)".
- Mốc chính diễn ra theo một trong hai cách:
  1. Người chơi tự bấm vào mốc, bất cứ lúc nào trong tuần.
  2. Hết việc thứ 3 thì mốc tự tới. Đại sự có quán tính: không trốn được.
- Một vài mốc **ập tới giữa tuần** vì trong truyện chúng đến bất ngờ: lang triều, Thiết Huyết Lãnh vây, Huyết Cương. Những mốc này báo trước 1 tuần bằng điềm ("tiếng sói tru gần hơn" đã có sẵn).
- **Mốc gắn với nơi chốn:** ví dụ Giả Kim Sinh chỉ gặp khi ra sơn trại hay bờ sông. Nếu tới việc 3 mà người chơi chưa đi, hắn tự tìm tới, nhưng người chơi mất lợi thế chuẩn bị. Mốc nào gắn nơi nào sẽ ghi ở bảng mục 4.

### 2.3 Giãn lịch mốc

Giữ 27 tuần, vì Thiền, tua nhanh và cánh bướm đều tính theo tuần. Chỉ dời vài mốc để **giữa hai mốc lớn luôn có ít nhất 1 tuần trống**.

- Hiện tại các tuần 19–27 có mốc liền nhau.
- Gộp những mốc cùng một chuyện thành **một cảnh nhiều bước**, không để mỗi mốc chiếm một tuần:
  - `c_lang1/2/3` (3 tuần lang triều) thành cảnh lang triều 2 tuần.
  - `c_thuongdoi` và `c_thuongdoiroi` thành một chuỗi.
- Mục tiêu: 20 mốc còn khoảng 15 tuần có mốc, 12 tuần trống. Cộng với 3 việc mỗi tuần, người chơi có khoảng **70–80 việc mỗi đời** (hiện tại khoảng 27).

### 2.4 Kinh tế phải chỉnh lại

Số việc tăng gấp 3 thì đánh nhau, tiền và rơi cổ cũng tăng.

- Nuôi cổ và trợ cấp vẫn tính theo tuần.
- Phần thưởng mỗi lần đi núi hoặc làm nhiệm vụ giảm khoảng 1/2.
- Rơi cổ khi đi núi giảm; cổ ngon dời sang chuỗi sự kiện phụ (mục 3.3).
- Hồi khí huyết chuyển sang theo việc (một phần nhỏ), còn hồi mạnh chỉ khi nghỉ.
- Cân lại bằng `sim.cjs` (mục 6).

---

## 3. Sự kiện thành cảnh: hội thoại và nhiều bước

Máy cảnh này chính là L2 trong `KE_HOACH_DI_LECH.md`, dùng chung cho mốc chính và chuyện phụ. Ở đây chỉ ghi phần mở rộng.

### 3.1 Cấu trúc một cảnh

```js
c_kimsinh:{canon:1,title:'Bờ sông',scene:{
  start:'gap',budget:3,           // 3 lượt dò xét trước khi phải quyết
  nodes:{
    gap:{talk:[
        ['kimsinh','Phương Nguyên! Nghe nói ngươi mới đòi được tửu lâu?'],
        ['','Hắn cười, nhưng mắt cứ liếc về phía rừng trúc.'],
        ['kimsinh','Ta có món làm ăn. Ra bờ sông nói chuyện.']],
      choices:[
        {t:'Hỏi làm ăn gì',stay:1,talk:[['kimsinh','...nợ sòng bạc Thương gia...']],flag:'no'},
        {t:'Liếc về rừng trúc',stay:1,check:['tamco',12],flag:'phuc',say:'Có hai bóng người nấp sau rừng trúc.'},
        {t:'Đi theo hắn ra sông',go:'song',canon:1},
        {t:'[察] Hỏi về hai kẻ trong rừng trúc',hidden:'phuc',go:'lat'},
        {t:'[察] Nhắc tới món nợ',hidden:'no',go:'ep'}]},
    song:{...}, lat:{...}, ep:{...}
  }}}
```

| Thành phần | Tác dụng |
|---|---|
| `talk` | Chuỗi câu thoại. Mỗi câu một người nói, có chân dung. Bấm để sang câu sau. |
| `stay` + `budget` | Hỏi thêm hoặc quan sát mà cảnh chưa kết thúc. Mỗi cảnh chỉ có 2–3 lượt, nên phải chọn hỏi gì. |
| `flag` / `hidden` | Hỏi đúng thì mở lựa chọn ẩn (nhãn 察, 憶, 情). |
| `go` | Sang bước tiếp theo trong cảnh. Có thể mở trận đánh giữa chừng, đánh xong quay lại cảnh. |
| `tense` | Chọn vụng thì tăng độ căng. Lên tới 3 thì cảnh nổ thành đánh nhau, hoặc rẽ về kết quả nguyên tác. |
| `wait` | Cảnh chia ra nhiều việc hoặc nhiều tuần, ví dụ "hẹn ba ngày sau trả lời". |

### 3.2 Độ dài mục tiêu

| Loại | Hiện tại | Mục tiêu |
|---|---|---|
| Mốc chính | 1 đoạn 35 chữ, 1 lần chọn | 3–6 bước, 6–15 câu thoại, 2–3 lượt dò xét, ít nhất 2 kết cục cảnh |
| Chuyện phụ ngắn | 1 đoạn 15 chữ | 2–3 bước, 3–6 câu thoại |
| Chuỗi chuyện phụ | Gần như không có | 3–5 phần, trải qua nhiều tuần, có phần thưởng cuối đáng giá |

### 3.3 Chuỗi chuyện phụ (mỗi chuỗi 3–5 phần)

Chỉ bám **địa điểm, thời gian, NPC** của nguyên tác; cốt truyện của chuyện phụ được viết tự do.

| Chuỗi | Nơi | Tóm tắt | Phần thưởng cuối |
|---|---|---|---|
| **Tửu lâu** | Tửu lâu (mở sau khi đòi gia sản) | Chưởng quầy ăn bớt; khách lạ trả bằng nguyên thạch giả; Thương đội muốn mua lại. | Thêm thu nhập, hoặc bán đi để lấy vốn lớn |
| **Trầm Thúy** | Nhà | Tỳ nữ mợ gửi sang: dò la cho mợ hay thật lòng? Dùng làm tai mắt, đuổi đi, hoặc giữ lại. | Tin tức về nhà cậu và Mạc gia |
| **Xích và Mạc** | Sơn trại | Hai phe gia lão Xích Luyện và Mạc Trần tranh nhau; ngươi đưa tin hai đầu. | Phe chu cấp, cổ, có thể trừ hiềm nghi |
| **Bãi nguyệt lan hoang** | Núi | Tìm bãi hoang (đã có `freeMoon`); bị Hùng gia giành; giữ hay chia. | Nuôi Nguyệt Quang miễn phí lâu dài |
| **Học trò giữ cổng** | Học đường | Chuyện cướp nguyên thạch ở cổng kéo dài: bọn bị cướp liên kết trả thù, rồi một đứa xin theo ngươi. | Thủ hạ, hoặc hiềm nghi |
| **Săn Lôi Quan Lang** | Núi | Lần theo dấu một con sói đầu đàn trước lang triều. | Điềm báo lang triều sớm, da sói bán giá cao |
| **Thương đội Giả gia** | Sơn trại | Buôn cổ với đoàn buôn: mặc cả, bị lừa, tìm lại hàng. | Cổ hiếm trong CARAVAN, giá rẻ |
| **Hậu sơn** (đã có `hs_*`) | Hậu sơn | Mở rộng mỗi phần thành cảnh có dò xét. | Như hiện tại, rõ hơn |

Kèm khoảng **30 chuyện phụ ngắn mới** (mỗi nơi 6–8) để một đời 70–80 việc không lặp lại nhiều.

### 3.4 Thế giới phản ứng

Những gì ngươi đã làm ở mốc chính hiện lại trong chuyện phụ: câu nói của NPC, giá chợ, ai chào, ai tránh. Đây là loại sự kiện rẻ nhất để viết, mà làm thế giới có cảm giác sống.

Ví dụ:
- Đã giết Giả Kim Sinh: tuần sau ở sơn trại nghe người ta bàn tán.
- Đã cứu Thanh Thư: nàng ghé học đường tìm ngươi.

Làm bằng `cond` cộng câu thoại thay thế, không cần hệ thống mới.

---

## 4. Tám mốc chính viết lại thành cảnh đầu tiên

Chọn những mốc mà người chơi hay nói là "chọn một cái là xong". Các mốc ở tuần 11–27 trùng với 8 cảnh đi lệch trong `KE_HOACH_DI_LECH.md`, nên sẽ làm chung.

| Mốc | Gắn nơi | Bước chính |
|---|---|---|
| Khai khiếu | – | Thoại gia lão, Phương Chính, tiếng cười; dò xét ai đang để ý ngươi |
| Đòi gia sản | Nhà | Nói chuyện với cậu, mợ, Trầm Thúy; tìm khế ước; ép, kiện, hay nhịn |
| Cổng học đường | Học đường | Nhiều lượt: chọn ai để cướp, ai đứng xem, gia lão tới |
| Khảo hạch | Học đường | Nhiều vòng thi; chọn giấu hay lộ thực lực |
| Giả Kim Sinh | Sơn trại / bờ sông | Như ví dụ mục 3.1 |
| Bạch Ngưng Băng | Núi | Quan sát hàn khí, hỏi chuyện, thử sức |
| Lang triều | – (ập tới) | Hai tuần: chuẩn bị, tường thành, đêm thứ hai, Thanh Thư |
| Lăng mộ Hoa Tửu / Huyết Hải | Hậu sơn | Nhiều sảnh, dò bẫy, chọn đường |

---

## 5. Các PR

| PR | Nội dung | Kiểm tra |
|---|---|---|
| **N1: Nhịp tuần** | 3 việc/tuần, bế quan tốn 3, ô "Sắp tới", mốc chờ tới việc 3 hoặc bấm tay, gộp và dời lịch mốc, chỉnh kinh tế. Sửa `ff.js` (ghi và phát lại theo việc), `sim.cjs` (bot làm 3 việc), `cicada.js` (ảnh chụp vẫn theo tuần). | sim bám truyện 15–35%, ff_test 0 lỗi |
| **N2: Máy cảnh + UI thoại** | `scene`/`nodes`/`talk`/`stay`/`budget`/`flag`/`hidden`/`go`/`tense`/`wait`; hộp thoại bấm từng câu (dùng lại `speakerHTML` và typewriter); lưu giữa cảnh; trận giữa cảnh rồi quay lại. Chuyển thử 2 sự kiện cũ sang dạng mới. `check.cjs` kiểm tra `go` trỏ tới nút tồn tại. | Chơi thử 2 cảnh trong trình duyệt |
| **N3: Mốc chính đợt 1** | Khai khiếu, gia sản, cổng học đường, khảo hạch (tuần 1–10) | Như trên, thêm tua nhanh qua cảnh (nhớ cả chuỗi lựa chọn) |
| **N4: Chuỗi phụ đợt 1** | Tửu lâu, Trầm Thúy, Xích và Mạc, học trò giữ cổng, cùng 15 chuyện ngắn | Một đời bot gặp ≥ 25 chuyện phụ khác nhau, lặp ≤ 20% |
| **N5: Mốc chính đợt 2** | Giả Kim Sinh, Bạch Ngưng Băng, lang triều, lăng mộ (làm chung với L4–L5 của `KE_HOACH_DI_LECH`) | Bot lệch thắng ≥ 12% |
| **N6: Chuỗi phụ đợt 2 + phản ứng** | Bãi nguyệt lan, săn sói, thương đội, hậu sơn, 15 chuyện ngắn, sự kiện phản ứng. Cân lại toàn bộ | Cổng đầy đủ ở mục 6 |

Thứ tự này có lý do: **N1 phải làm trước.** Không sửa nhịp thì nội dung mới không có chỗ để hiện ra. N2 là nền cho mọi thứ sau.

---

## 6. Cổng kiểm tra mới

- `node tools/check.cjs`: không lỗi, kể cả nút cảnh.
- `node tools/sim.cjs 300 6`: bám truyện thắng 15–35% trong 6 đời.
- `LECH=1 node tools/sim.cjs 300 6`: thắng ≥ 12%.
- Số đo mới:
  - Số việc mỗi đời 70–80.
  - Số chuyện phụ khác nhau gặp trong một đời ≥ 25.
  - Tỉ lệ tuần có mốc chính ≤ 60%.
- `node tools/ff_test.cjs`: 0 lỗi.
- Chơi thử trong trình duyệt 10 tuần đầu, không lỗi JS.

---

## 7. Cần anh chốt

1. **3 việc mỗi tuần, bế quan tốn cả tuần.** Được không, hay muốn 2 việc cho nhanh hơn?
2. **Gộp lang triều 3 tuần thành 2** và gộp hai mốc thương đội, để có thêm tuần trống. Có ổn với nguyên tác không?
3. Làm N1 và N2 trước (khoảng 2 buổi), rồi mới viết nội dung. Đồng ý chứ?

---

## Tiến độ

**30/09/2026 — đã chốt:** 3 việc mỗi tuần; chỉ bám địa điểm, thời gian, NPC và cơ chế, cốt truyện viết tự do; asset dùng thoải mái.

**N1 (xong phần lõi):**
- `AP_WEEK=3`, `S.ap`, `S.pend`, `URGENT` trong `engine.js`. Mốc thường chờ ở nút "Đối mặt"; hết việc thì tự tới; khai khiếu, lang triều, Thiết vây, Nhất Đại, trận cuối vẫn ập tới đầu tuần.
- Nút "Qua tuần" (`endWeek`). Bế quan dùng hết việc còn lại, ít ngày thì kém hiệu quả (×0,6 / ×0,8 / ×1).
- Hậu sơn: mỗi tuần xuống sâu tối đa một tầng; lần đi thứ hai gặp chuyện quanh cửa động (`loc:'hauson'`).
- `ff.js` ghi và phát lại theo chuỗi việc trong tuần (act, pend, skip). Save cũ vẫn tải được.
- Sửa lỗi kẹt: đóng quầy đổ thạch khi tuần đã hết việc thì không sang tuần.
- Chưa làm: gộp mốc lang triều, mốc gắn nơi chốn.

**Kỳ ngộ theo nơi chốn:** thêm 36 sự kiện (`k_*`), trong đó 8 chuyện nhiều bước (`thenEv()` hoặc `later()`, cờ `chain:1`): gia lão say rượu, đề thi bị lộ, học trò nghèo, lão bán bí phương, lữ khách áo xám, sói con, ẩn sĩ đánh cờ, học trò mất tích. Nhiều con cổ trước chỉ có ở chợ nay bắt được ngoài núi: Toàn Phong, Thanh Ti, Đồng Bì, Tiểu Quang, Ẩn Lân, Liễm Tức, U Quang.

**Số đo:** bám truyện thắng 29,0% trong 6 kiếp (trước 40%), kiếp đầu 2,5%; bot lệch 3,3%; ff_test 0 lỗi; check.cjs không lỗi. Chết nhiều nhất: Tửu Khôi (hậu sơn) và đám học trò ở cổng học đường.
