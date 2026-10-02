# Implementation Plan: nâng cao gameplay (bản đã review)

> **Review 30/09/2026, đối chiếu code `main` tại `3b1ed7a`.** Mỗi mục có **Kết luận** (Giữ / Sửa / Bỏ) và **Vì sao**. Code mẫu đã sửa theo tên hàm và biến có thật trong repo; phần nào code gốc sai thì ghi rõ sai ở đâu.

---

## 0. Tóm tắt

| # | Mục | Kết luận | Lý do chính |
|---|---|---|---|
| 1.1 | Giảm phạt đột phá thất bại | **Sửa** | Code gốc sửa nhầm chỗ: `levelUp()` chỉ là đường dự phòng; đột phá thật ở `breakEnd()` trong `minigame.js` |
| 1.2 | Tăng lên 4 việc mỗi tuần | **Bỏ** | Anh đã chốt 3 việc; độ khó 43,5% đã cân theo 3 |
| 1.3 | Giữ 1 cổ khi chết | **Bỏ** | Trái luật đã chốt: chết thật là mất hết (`d597273`) |
| 1.4 | Hệ thống "Mệnh lệnh" | **Sửa** | Dời vào Nhiệm vụ đường (nơi có trong truyện); bỏ thưởng ký ức ngẫu nhiên |
| 2.1 | Chỉnh tỉ lệ ý đồ địch | **Giữ, mức nhẹ** | Hợp lý, nhưng phải đo bằng sim |
| 2.2 | Ý đồ mới buff / debuff / heal | **Sửa** | Game đã có sẵn cơ chế tương đương (`sk`, `atkBuff`, `regen`, `suppress`); dùng lại thay vì tạo mới |
| 2.3 | Giảm hồi chiêu một nửa, nút "Tẩy chiêu" | **Bỏ** | Phá thiết kế chọn đòn; "Tẩy chiêu" là hệ thống bịa |
| 3.1 | Hiện ước tính trong minigame | **Sửa** | Tên biến sai; mổ đá đã hiện tỉ lệ nhìn đúng rồi |
| 3.2 | Phím tắt | **Sửa** | Sai class nút; Space mà bấm lựa chọn đầu tiên thì rất dễ chọn nhầm |
| 3.3 | Kho sự kiện cạn thì phát thưởng dự phòng | **Bỏ** | Làm mất trận đánh trên núi, rải nguyên thạch miễn phí; kho đã thêm 36 kỳ ngộ |
| 3.4 | Biến cố ngẫu nhiên khi luyện cổ | **Giữ, ưu tiên thấp** | Được, sửa tên biến và cập nhật bot |
| 4.1 | Ký ức "tiêu cực" | **Bỏ** | Ký ức là hiểu biết, không phải buff; các trường dùng trong code gốc không tồn tại |
| 4.2 | Thiên cơ tích cực | **Sửa** | `WORLD` đọc bằng `W(k)`, không có `ap()`; đã có `linhmach` +15% tu luyện |
| 4.3 | Cân lại cổ | **Phần lớn bỏ** | Số liệu trong bản gốc sai (Cường Thủ vốn choáng 1 lượt); Âm Dương là cổ Quyển 2 |
| 4.4 | Cân lại địch | **Bỏ** | Đám học trò đang là kẻ giết nhiều thứ hai; gia lão và ma tu đã có `noflee` |
| – | Mục tiêu tỉ lệ thắng 25–40% | **Sửa** | Anh đã chốt 40–45% |

---

## Giai đoạn 1: giữ chân người chơi

### 1.1 Giảm phạt đột phá thất bại · Sửa

**Vì sao sửa:** Bản gốc sửa `levelUp()` trong `engine.js`. Nhánh đó chỉ chạy khi không có minigame (`if(typeof startBreak==='function'){...startBreak();break}`), còn trong game thật luôn có `startBreak`. Phạt thật nằm ở `js/minigame.js`, hàm `breakEnd()`. Phạt hiện tại là mất 50% tu vi và 15% khí huyết, không phải 30% khí huyết như bản gốc ghi.

**File:** `js/minigame.js`, `breakEnd(ok)`, nhánh thất bại.

```js
// Trước
S.prog=Math.floor(need()*.5);S.hp=Math.max(1,S.hp-Math.round(maxHp()*.15));
// Sau: giữ 70% tu vi; mỗi lần thất bại liên tiếp cộng dồn kinh nghiệm xung kích (+5%, tối đa +15%)
S.prog=Math.floor(need()*.7);S.hp=Math.max(1,S.hp-Math.round(maxHp()*.15));
S.breakFail=Math.min(3,(S.breakFail||0)+1);
log(`Xung kích thất bại. Lần sau đã quen đường, bích khiếu dễ phá hơn (+${S.breakFail*5}%).`,'sys');
```
- Nhánh thành công: `S.breakFail=0;`
- Trong minigame đột phá, cộng `(S.breakFail||0)*.05` vào tỉ lệ hoặc sức phá.
- Làm thêm y hệt ở `levelUp()` cho đồng bộ.
- `S.breakFail` nằm trong `S`, nên chết thật là mất. Đúng luật.

**Vì sao đổi cách cộng:** Bản gốc cho +15% ngay khi đủ 3 lần thất bại. Như vậy có lợi khi cố tình thất bại để "nạp" tỉ lệ. Cộng dồn từng lần thì mượt hơn và không ai lợi dụng được.

### 1.2 Tăng lên 4 việc mỗi tuần · Bỏ

**Vì sao bỏ:**
- Anh đã chốt 3 việc mỗi tuần, cho cả Quyển 1 lẫn Quyển 2.
- `DIFF` 2.52 và đường cong độ khó theo tuần được cân cho 3 việc (bot thắng 43,5%). Lên 4 việc thì phải cân lại từ đầu.
- Khi gộp lang triều (kế hoạch nâng cấp, PR-4), số tuần trống sẽ tăng thêm. Đó mới là cách giãn nhịp đúng.

### 1.3 Giữ 1 cổ khi chết · Bỏ

**Vì sao bỏ:**
- Anh đã chốt: chết khi Thiền chưa hồi là chết thật, mất hết, kể cả ký ức (`d597273`).
- Mang cổ qua kiếp thì trái trực tiếp luật đó. Nó cũng làm kiếp sau dễ dần theo số lần chết, đúng cái kiểu "chết nhiều thì thắng" mà luật mới muốn tránh.
- Code gốc còn gán `r` cho từng con cổ trong `S.gu`. Game không dùng trường này: hạng cổ lấy từ `GU[k].r`.

**Nếu muốn có động lực chơi lại**, dùng cái đã có: Cổ Đồ Giám (`META.codex`) và lịch sử kết cục (`META.wins`). Hai thứ này là thành tích, không phải sức mạnh.

### 1.4 Mục tiêu giữa chừng · Sửa thành "Lệnh của Nhiệm vụ đường"

**Vì sao sửa:**
- "Mệnh lệnh" từ hư không là hệ thống bịa. Nhiệm vụ đường thì có trong truyện và đã có trên bản đồ, nên giao lệnh có hạn là hợp lý.
- Thưởng "1 ký ức ngẫu nhiên" phá nghĩa của ký ức. Ký ức là điều ngươi tự trải qua, và lựa chọn ký ức có thể phản tác dụng khi cánh bướm đổi biến thể. Phát ngẫu nhiên thì hai điều đó mất nghĩa.
- Code gốc có chỗ sai:
  - `S.f.killedBai`: không có cờ này. Bạch Ngưng Băng cũng không phải "thủ lĩnh Bạch gia".
  - `check` là hàm, mà `S` được lưu bằng JSON, nên tải lại save thì mất. Phải lưu `id` rồi tra bảng.
- Nên gộp với "tâm nguyện" (giai đoạn 1 của `TRIEN_KHAI.md`, đang hoãn), để không có hai hệ thống mục tiêu song song.

```js
// js/events.js (dữ liệu). S.mission chỉ lưu {id, until}; hàm kiểm tra tra từ bảng nên lưu và tải được
const ORDERS={
  o_lang:   {n:'Diệt 3 con Điện Lang trước lang triều', from:8,  dur:6, ok:()=> (S.f.wolfKills||0)>=3, pay:()=>{S.stones+=25;S.danh+=6}},
  o_huyet:  {n:'Nộp 3 huyết khí cho gia lão',           from:4,  dur:4, ok:()=> S.blood>=3,           pay:()=>{S.blood-=3;S.stones+=20;S.danh+=4}},
  o_trunggiai:{n:'Đạt Nhất chuyển trung kỳ trước khảo hạch', from:2, dur:4, ok:()=> S.chuyen>1||S.giai>=1, pay:()=>{S.stones+=15;S.danh+=5}},
  o_bien:   {n:'Tuần biên giới Hùng gia 2 lần',          from:6,  dur:5, ok:()=> (S.f.tuanbien||0)>=2, pay:()=>{S.stones+=20;S.danh+=5}},
};
```
- Nhận lệnh ở Nhiệm vụ đường, tốn 1 việc. Mỗi lúc chỉ giữ 1 lệnh.
- Đầu tuần (`startTurn`) kiểm tra: đạt thì trả thưởng, quá hạn thì trừ danh vọng nhẹ.
- HUD hiện tên lệnh và số tuần còn lại (trong `renderHUD`, `js/ui.js`).
- Thưởng là nguyên thạch và danh vọng, **không** phát ký ức.
- Phải thêm cờ đếm (`wolfKills`, `tuanbien`) ở hàm `AFTER` và sự kiện tương ứng.

---

## Giai đoạn 2: chiều sâu chiến đấu

### 2.1 Tỉ lệ ý đồ địch · Giữ, mức nhẹ

**File:** `js/engine.js`, `nextIntent()`. Hiện tại là `{atk:46, heavy:18, guard:14, skill:22}`.

```js
const w={atk:40,heavy:18+(c.phase2?8:0),guard:18,skill:c.sk?22+(c.phase2?10:0):0};
```

**Vì sao nhẹ hơn bản gốc (35/20):** thế thủ có phản đòn. Tăng mạnh thì trận kéo dài và bot hay chạy trốn hơn, nên tỉ lệ thắng tụt khó đoán. Đổi từng chút, rồi chạy `sim.cjs 300 6`. Nếu lệch khỏi 40–45% thì chỉnh `DIFF` bù.

### 2.2 Ý đồ đa dạng cho tinh anh và thủ lĩnh · Sửa

**Vì sao sửa:**
- Game đã có các kỹ năng `sk` (`regen`, `drain`, `freeze`, `suppress`…) và trường `c.atkBuff`, `c.suppress`. Thêm 3 ý đồ mới với cơ chế riêng (`S.debuffTurns`) là làm hai hệ thống trùng nhau.
- Code gốc dùng `c.maxHp`, nhưng máu tối đa của địch là `c.max`.

**Cách làm:** tinh anh chưa có `sk` thì rút ngẫu nhiên một kỹ năng hợp loại khi `fight()` tạo trận. Thú rút từ `regen`, `rage`, `howl`; người rút từ `drain`, `suppress`, `poison`.

```js
// js/engine.js, trong fight(), sau khi tạo S.combat
if(elite&&!S.combat.sk){S.combat.sk=pick(BEASTS.has(k)?['regen','rage','howl']:['drain','suppress','poison'])}
```
- Chỉ dùng tên kỹ năng đã có trong phần xử lý `skill` của `engine.js`: `charge`, `drain`, `freeze`, `howl`, `poison`, `rage`, `regen`, `suppress`, `thunder`.
- Hiện kỹ năng trên chip đặc tính địch (đã có sẵn khung chip).

### 2.3 Giảm hồi chiêu một nửa, nút "Tẩy chiêu" · Bỏ

**Vì sao bỏ:**
- `c.cd[key]=(CD[key]??2)+1`: phần `+1` là do hồi chiêu bị trừ ngay cuối lượt vừa dùng, nên hồi chiêu thực tế vẫn đúng bằng `CD[key]`. Chia đôi thì phần lớn cổ dùng được mỗi lượt, mất hẳn việc tính xem lượt này dùng đòn nào.
- "Tẩy chiêu" không có trong truyện và cũng chẳng có điều kiện kích hoạt (`canReset` không ai bật).
- Nếu một con cổ cụ thể hồi chiêu quá lâu, chỉnh riêng `CD` của nó.

---

## Giai đoạn 3: minigame và giao diện

### 3.1 Hiện ước tính trong minigame · Sửa

**Vì sao sửa:**
- Code gốc dùng `S.refine.progress` và `S.refine.stability`, không tồn tại. Minigame lưu ở `S.mg` với `prog`, `stab`, `round`, `max`.
- Mổ đá **đã** hiện "Mắt ngươi nhìn trúng khoảng X%" (`stoneAccuracy()`, `minigame.js:190`), không cần thêm.
- Ước tính sát thương đột phá theo `S.chuyen*15*(1+số cổ*0.1)` là số bịa, không khớp công thức thật. Hiện một con số sai còn tệ hơn không hiện.

**Luyện cổ** (trong phần render refine):
```js
const m=S.mg,left=Math.max(0,100-m.prog),rounds=m.max-m.round+1;
info+=`<div class="dimt">Còn thiếu ${left} dung hợp · còn ${rounds} lượt · ổn định ${m.stab}</div>`;
```
Chỉ hiện số thật (còn thiếu bao nhiêu, còn mấy lượt), không đoán "khoảng mấy lượt nữa", vì mỗi hành động cho số khác nhau.

### 3.2 Phím tắt · Sửa

**Vì sao sửa:**
- Nút lựa chọn có class `.choice`, không phải `.choice-btn`.
- `toggleMap()` không tồn tại.
- Space hoặc Enter mà bấm lựa chọn đầu tiên thì một cú gõ nhầm là quyết định sinh tử. Space/Enter chỉ nên hiện hết chữ đang chạy.
- Trong trận, phím 1–9 đã dùng cho kỹ năng (`battle.js:687`).

```js
// js/ui.js
document.addEventListener('keydown',e=>{
  if(!S||S.combat||e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.key==='Escape'){closeModal();return}
  if(e.key===' '||e.key==='Enter'){const t=document.querySelector('.story-text.typing');if(t){t.click();e.preventDefault()}return}
  const n=parseInt(e.key,10);
  if(n>=1&&n<=9){const b=document.querySelectorAll('.choices .choice:not([disabled])')[n-1];if(b){e.preventDefault();b.click()}}
});
```
Lớp `.typing` cần gắn trong `typeStory()` (`present.js`) khi chữ đang chạy. Đặt tên cho khớp với code thật khi làm.

### 3.3 Phát thưởng dự phòng khi kho sự kiện cạn · Bỏ

**Vì sao bỏ:**
- `randomEvent()` trả `false` là có chủ ý. Nơi gọi dựa vào đó để làm việc khác: lên núi không gặp chuyện thì **đánh thú**; dị số không có thì bỏ qua; sơn trại thì ghi "yên ả". Cho luôn trả `true` thì núi Thanh Mao hết trận đánh.
- Bốn phần thưởng dự phòng (tặng nguyên thạch, +1 ngộ tính…) là thưởng miễn phí, phá kinh tế.
- Nguyên nhân gốc là kho ít. Đã thêm 36 kỳ ngộ (`k_*`) trong `3b1ed7a`; kế hoạch nâng cấp còn thêm 6 chuỗi phụ.

### 3.4 Biến cố khi luyện cổ · Giữ, ưu tiên thấp

**File:** `js/minigame.js`, sau mỗi hành động luyện (`mgAct` nhánh refine), dùng `m.prog` và `m.stab`:
```js
if(Math.random()<.12){
  const ev=pick([
    ['Lửa lò bùng lên, dung hợp +10.',()=>{m.prog+=10}],
    ['Cổ trùng giãy giụa, ổn định −10.',()=>{m.stab-=10}],
    ['Ý niệm của cổ lắng xuống, ổn định +10.',()=>{m.stab=Math.min(100,m.stab+10)}],
  ]);
  m.log.push(ev[0]);ev[1]();
}
```

**Vì sao sửa so với bản gốc:**
- Bỏ "dung hợp gấp đôi" (+20), vì quá mạnh.
- Ghi vào `m.log` của minigame cho người chơi thấy ngay, không ghi vào nhật ký chung.
- Kiểm tra `m.stab<=0` **sau** biến cố để lò nổ đúng luật.
- Chạy lại `sim.cjs`: bot luyện cổ theo ngưỡng ổn định, biến cố làm tỉ lệ luyện thành đổi.

---

## Giai đoạn 4: nội dung và cân bằng

### 4.1 Ký ức "tiêu cực" · Bỏ

**Vì sao bỏ:**
- `MEM` là **hiểu biết** (biết lối vào động, biết điểm yếu của cậu), dùng để mở lựa chọn. Nó không có hàm `ap()` và không phải buff hay debuff.
- Các trường code gốc dùng (`S.mod.dmgDealt`, `S.mod.dmgTaken`) không tồn tại.
- Ký ức "có hại" đã có dạng đúng: lựa chọn ký ức **phản tác dụng** khi cánh bướm đổi biến thể. Ký ức từ cái chết thì đã có `DEATH_MEM`.

### 4.2 Thiên cơ tích cực · Sửa

**Vì sao sửa:**
- `WORLD` chỉ có `n`, `g`, `d`; tác dụng nằm rải rác qua `W('k')` ở chỗ dùng. Không có `ap()`, `S.mod.expGain`, `S.mod.stoneGain`.
- "Linh khí dày đặc +20% tu luyện" trùng với `linhmach` đã có (+15%).

**Nếu thêm**, viết theo đúng kiểu `W()`. Ví dụ `phongthu` (Được mùa trà): trợ cấp tháng +3, tửu lâu nộp thêm 1. Sửa ở chỗ tính trợ cấp trong `startTurn()`. Mỗi thiên cơ tốt nên có mặt trái nhỏ, như các thiên cơ hiện có.

### 4.3 Cân lại cổ · Phần lớn bỏ

| Cổ | Bản gốc | Thực tế trong `data.js` | Kết luận |
|---|---|---|---|
| `cuongthu` | "choáng 2 lượt, giảm xuống 1" | Đã là `stun:1`, `dmg:18`, `chill:.35` | Bỏ. Số liệu sai |
| `thachkhieu` | Thêm log hậu quả | Hậu quả nằm trong mô tả | **Giữ:** thêm một dòng log khi dùng |
| `amduong` | Hồi 90 → 70, hồi chiêu 4 → 5 | Là cổ Tứ chuyển nhận ở cuối Quyển 1 để sang Quyển 2 | Chỉ chỉnh nếu `sim2.cjs` cho thấy Quyển 2 quá dễ |
| `mokmi` | Phản 30→25%, hút 15→10% | Là cấm cổ đổi mạng (Thanh Thư chết vì nó) | Bỏ. Cái giá đắt là đúng truyện |

### 4.4 Cân lại địch · Bỏ

| Địch | Bản gốc | Thực tế | Kết luận |
|---|---|---|---|
| `hoctro` | "Quá yếu", tăng lên máu 60 | Đang là **kẻ giết nhiều thứ hai** (196/400 chiến dịch), vì đi thành bầy (`swarm`) và nhân `DIFF` 2.52 | Bỏ |
| `gialao` | Thêm `noflee` | Đã có `noflee:1` | Bỏ |
| `madutam` | "Boss cuối", thêm `noflee` | Đã có `noflee:1`. Đây là Huyết Thủ ma tu (tử kiếp), không phải boss cuối | Bỏ |
| `bai`, `phuongchinh` | Thêm `noflee` | Cố ý cho chạy: gặp Bạch Ngưng Băng là thử sức, đánh với em trai không nhất thiết sống chết | Bỏ |

---

## Thứ tự làm (bản review)

| # | Việc | Công | Ghi chú |
|---|---|---|---|
| 1 | 1.1 Phạt đột phá, sửa ở `breakEnd` | 20 phút | Chạy sim |
| 2 | 3.2 Phím tắt đã sửa | 20 phút | Làm cùng PR máy cảnh (hộp thoại cũng cần Space/Enter) |
| 3 | 2.1 Tỉ lệ ý đồ nhẹ | 5 phút | Chạy sim |
| 4 | 2.2 Kỹ năng cho tinh anh, dùng `sk` có sẵn | 30 phút | Chạy sim |
| 5 | 3.1 Hiện số thật trong luyện cổ | 15 phút | |
| 6 | 1.4 Lệnh Nhiệm vụ đường (gộp với tâm nguyện) | 1 buổi | Sau khi có máy cảnh để giao lệnh bằng hội thoại |
| 7 | 3.4 Biến cố luyện cổ | 20 phút | Tùy chọn |
| 8 | 4.2 Thiên cơ tốt, kiểu `W()` | 20 phút | Tùy chọn |
| 9 | 4.3 Log Thạch Khiếu | 5 phút | |

Đã bỏ: 1.2, 1.3, 2.3, 3.3, 4.1, 4.4 và phần lớn 4.3 (lý do ở từng mục).

---

## Kiểm tra sau mỗi thay đổi

```bash
node tools/check.cjs          # dữ liệu
node tools/sim.cjs 300 6      # Quyển 1
LECH=1 node tools/sim.cjs 300 6
node tools/sim2.cjs 100       # Quyển 2
```

**Chỉ số mục tiêu (sửa theo điều anh đã chốt):**
- Bot bám truyện thắng **40–45%** trong 6 kiếp (bản gốc ghi 25–40%).
- Thắng ngay kiếp đầu khoảng **10%** (bản gốc 2–5%; hiện đang 12%).
- Tuần chết trung bình **≥ 12** (hiện khoảng 10; bản gốc đòi 15–22, khó đạt khi chết thật là mất hết).
- Bot đi lệch **≥ 25%**.
- Không kẹt vòng lặp ở cả hai quyển.

**Vì sao đổi `preview_bot.cjs` thành `sim2.cjs`:** `preview_bot.cjs` chỉ chụp ảnh và chưa được commit. Quyển 2 có công cụ đo riêng, và mọi thay đổi chiến đấu đều ảnh hưởng cả Quyển 2.

## Lưu ý
Giữ nguyên các lưu ý của bản gốc: commit nhỏ, đo sau mỗi thay đổi, không sửa nhiều thứ một lúc. Thêm một điều: **mọi cơ chế mới phải có trong truyện hoặc dùng lại cơ chế đã có**. Đây là luật của dự án.
