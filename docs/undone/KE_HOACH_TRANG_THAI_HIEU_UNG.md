# Kế hoạch hệ trạng thái hiệu ứng (buff / debuff / khống chế)

Orange-kun lập, 03/10/2026, theo yêu cầu người dùng: có các trạng thái tốt/xấu như game khác (mù, choáng…).
Phần lõi engine do **Orange** làm; Blue làm icon/FX khi có danh sách chốt. Viết trong lõi sim (`js/sandbox/sim.js`), nên mang được sang game MMO mới.

## 0. Hiện trạng
Sim đã có vài trạng thái, mỗi cái một trường riêng trên actor, xử lý rải rác:

| Trường hiện tại | Ý nghĩa |
|---|---|
| `shield` | hộ thể giảm sát thương (Bạch Ngọc, Thiên Bồng, Thủy Tráo, giáp lôi điện) |
| `slowUntil/slowF` | làm chậm (Lam Điểu, Băng Đao, Toàn Phong) |
| `bleed` | chảy máu (Cứ Xỉ, Huyết Nguyệt) |
| `empower` | tăng công + xuyên giáp (Sương Yêu) |
| `transform` | biến thân (Mộc Mị) |
| `enrage` | cuồng nộ theo pha (Lôi Quan Đầu Lang) |
| `absorb` | đang hấp thu nguyên thạch |
| `poiseUntil` | vững thế 1,2s sau khi khựng (chống khống chế liên tục) |
| state `hit` / `shell` | khựng 0,32s; vỏ băng của BNB |

Muốn thêm mù, choáng… mà vẫn viết kiểu này thì code sẽ rối dần. Cần một hệ chung.

## 1. Thiết kế hệ chung
**Một bảng định nghĩa** `SB_STATUS[id]` (file mới `js/sandbox/status.js`), mỗi trạng thái gồm:
```js
stun: {n:'Choáng', good:false, cc:true, tags:['cc','hard'],
       block:{move:true, act:true, gu:true}, interrupt:true,
       stack:'refresh', icon:'暈', color:0xffe14a}
```
- **block:** `move` (đi, lướt), `act` (mọi chiêu kể cả đánh tay), `gu` (chiêu dùng cổ), `item` (vật phẩm: lá, nguyên thạch).
- **mod:**
  - `speed` (nhân tốc chạy);
  - `dmgOut` (sát thương gây ra);
  - `dmgIn` (sát thương nhận vào: hộ thể và phá giáp dùng chung);
  - `heal` (nhân hồi máu; cấm hồi = 0);
  - `range` (tầm đánh);
  - `aimJitter` (lệch hướng đạn).
- **tick:** sát thương theo giây (chảy máu, độc, thiêu đốt) hoặc hồi theo giây.
- **stack:** `refresh` (làm mới thời gian), `add` (cộng dồn tầng, có `max`), `keep` (giữ cái mạnh hơn).
- **break:** điều kiện gỡ sớm (đóng băng vỡ khi nhận đòn, hấp thu đứt khi trúng đòn).
- **tags:** `cc` / `hard` / `soft` / `dot` / `magic`, dùng cho kháng, giải và miễn.

**Trên actor:** `a.st = {id: {until, stacks, src, data}}`.
- `applyStatus(B, target, id, {dur, stacks, src, data})` và `clearStatus(...)` phát event `status` / `statusEnd`.
- `has(a, flag)` gom tất cả `block`. `mod(a, key)` nhân dồn mọi `mod`.

**Chiêu khai báo trạng thái gây ra:**
```js
applies: [{st:'stun', dur:.8, chance:1, on:'hit'}]
```
- `on`: `hit` (trúng đòn) / `self` (lên chính mình, cho buff) / `zone` (đứng trong vùng).
- Sim tự áp ở mọi nhánh trúng đòn (cận chiến, đạn, vùng, chộp, lao).

**Luật chống khống chế liên tục (cc):**
1. Sau mỗi lần dính khống chế cứng có **khoảng miễn 1,2s**, mở rộng từ `poise` hiện có.
2. **Giảm dần**: lần thứ 2 trong 6s còn 50% thời gian, lần 3 còn 25%, lần 4 miễn.
3. **Boss/tinh anh** có `ccResist` (vd 0,5 nhân thời gian). Một số chiêu có `armor` không bị ngắt (giữ luật cũ).
4. Khống chế cứng ngắt chiêu đang lấy đà, kèm event `interrupt` (dùng lại luật cũ).

**Giải trạng thái:** item hoặc chiêu có `cleanse:['dot']` hoặc `cleanse:['cc']` (vd Trị Liệu cổ cầm máu = giải `bleed`/`poison`, đúng mô tả `cure:1` trong `data.js`).

## 2. Danh sách trạng thái đề xuất (đợt 1 = 8 cái, in đậm)
| Trạng thái | Loại | Tác dụng | Gắn cổ có nguồn (game cũ) |
|---|---|---|---|
| **Choáng** | khống chế cứng | không làm gì; ngắt chiêu | Thiên Địa Hoành Âm (ch.184–186) |
| **Định thân / Trói** | khống chế mềm | không đi/lướt, vẫn ra chiêu | xích Trấn Ma Thiết Tác (ch.196), dây Thanh Đằng (ch.140) |
| **Phong cấm** | khống chế mềm | không dùng cổ; đánh tay và đi được | Ô Thất (ch.462) |
| **Mù** | suy yếu | đạn lệch hướng ±25°, tầm đánh −30%. Người chơi bị tối viền màn hình và mất vòng báo đòn của địch; AI mất dấu nếu xa | game (chưa có cổ) |
| **Suy yếu** | suy yếu | sát thương gây ra −30% | Cường Thủ trong `data.js` ("yếu đi 35%") |
| **Phá giáp** | suy yếu | sát thương nhận vào +25% | game |
| **Cấm hồi** | suy yếu | hồi máu và tái tụ = 0 | thay luật riêng "chảy máu thì Huyết Khôi không tái tụ" |
| **Độc** | sát thương theo giây | cộng dồn tối đa 5 tầng, mỗi tầng 2/s | game; cương thi (ch.290) nếu Blue xác minh |
| Làm chậm | suy yếu | (có sẵn) chuyển sang hệ chung | Lam Điểu, Băng Đao |
| Chảy máu | sát thương theo giây | (có sẵn) chuyển sang hệ chung | Cứ Xỉ, Huyết Nguyệt |
| Đóng băng / Hóa tượng | khống chế cứng | như choáng, nhận đòn đầu thì vỡ (+50% sát thương đòn đó) | Điểm Kim (ch.462–463) |
| Hất văng | khống chế cứng ngắn | đẩy lùi + nằm 0,5s | lao húc, nổ tay BNB (hiện là knock) |
| Sợ hãi | khống chế cứng | tự chạy ngược đối thủ | Chính Khí (ch.184) "kẻ tâm chí không kiên…" nếu xác minh |
| Hỗn loạn | khống chế mềm | người chơi bị đảo phím trái/phải; AI chọn chiêu ngẫu nhiên | game, để sau (dễ gây khó chịu) |
| Hộ thể | tăng cường | (có sẵn) | các cổ hộ thể |
| Tăng công / Tăng tốc | tăng cường | (có sẵn kiểu Sương Yêu) | Bạo Lực, Sương Yêu |
| Hồi máu theo giây | tăng cường | hồi máu theo giây | Tích Hôi, Kim Phong Tống Sảng nếu xác minh |
| Miễn khống chế | tăng cường | không dính khống chế trong thời hạn | chiêu `armor`, Rồng Đi Hổ Bước |
| Tàng hình | tăng cường | AI mất dấu (trừ khi có Điện Nhãn); đòn đầu ×1,3 rồi lộ | Ẩn Lân (ch.127, 130) |
| Phản đòn | tăng cường | trả lại 25% sát thương cận chiến | Hỏa Lô (`data.js`) |

Game cũ chỉ gắn trạng thái vào cổ **có nguồn chương**. Trạng thái "game" dùng cho nhân vật thiết kế game, đồ, hoặc game MMO mới.

## 3. Hiển thị và điều khiển
- **Trên đầu nhân vật:** hàng icon nhỏ (tối đa 4, ưu tiên khống chế), vòng thời gian quanh icon. Khống chế cứng có hiệu ứng riêng (sao quay khi choáng, xích khi trói, khói đen khi phong cấm, màu xám khi hóa tượng).
- **HUD:** hàng icon dưới thanh máu, rê/chạm để xem tên, tác dụng, thời gian còn lại.
- **Chữ nổi** khi dính: "Choáng!", "Phong cấm".
- **Bị chặn lệnh:** báo lý do ("Đang bị phong cấm: chỉ đánh tay được"). Ô kỹ năng bị chặn hiện ổ khóa.
- **Mù:** màn hình tối viền, vòng báo đòn của địch mờ. **Hỗn loạn:** có biểu tượng cảnh báo trên ô di chuyển.
- **Âm thanh:** một tiếng cho khống chế cứng, một tiếng cho giải trạng thái.

## 4. AI
- Đọc `block` của chính mình: bị phong cấm thì đánh tay/lùi; bị trói thì không ra lệnh đi, dùng chiêu tầm xa.
- Đọc trạng thái đối thủ:
  - đối thủ choáng/hóa tượng → phạt bằng đòn mạnh nhất;
  - đối thủ có hộ thể → dùng chiêu xuyên giáp hoặc chờ;
  - đối thủ tàng hình → không thấy (trừ Điện Nhãn).
- Có giải trạng thái thì dùng khi dính khống chế dài hoặc độc nhiều tầng.

## 5. Thứ tự làm và nghiệm thu
| Bước | Việc | Nghiệm thu |
|---|---|---|
| S1 | `status.js` + `applyStatus/clearStatus/has/mod`; chuyển **slow, bleed, shield, empower, transform, enrage, absorb** sang hệ chung | Trace PN/BNB 45/45 trùng baseline (đổi kiến trúc, không đổi lối chơi); regression cũ đạt |
| S2 | 8 trạng thái đợt 1 + `applies` + luật chống khống chế liên tục | Mỗi trạng thái 1 test hiệu lực thật (vd phong cấm: cổ bị từ chối, đánh tay vẫn được; giảm dần: lần 2 còn 50%) |
| S3 | Hình nộm thử `dummy_status` trong sandbox: mỗi phím gây một trạng thái lên bạn hoặc lên hình nộm | Người dùng chơi thử từng trạng thái |
| S4 | Icon/FX/chữ nổi/âm thanh (Blue vẽ icon 16–20px theo bảng màu), HUD, báo lý do | Chrome desktop/mobile không tràn, đọc được ở cỡ nhân vật nhỏ |
| S5 | AI đọc trạng thái | Bench: AI không phí lệnh bị chặn; tỉ lệ phạt khi đối thủ choáng |
| S6 | Gắn vào cổ có nguồn khi làm đợt 2–4 | Theo dossier đã duyệt |

## 6. Cần người dùng chốt
1. Đợt 1 có đúng 8 trạng thái in đậm không, thêm hay bớt?
2. **Hỗn loạn** (đảo phím): có làm không? Đề xuất: không, hoặc chỉ dùng cho boss đặc biệt.
3. **Mù** với người chơi: tối viền + mất vòng báo đòn (đề xuất), hay chỉ lệch đạn?
4. Thời gian khống chế cứng tối đa: đề xuất **1,5s**, giảm dần như §1.

## 7. Chốt sau review Blue (03/10/2026)

Orange đồng ý cả 6 điểm. Các mục trên được sửa như sau (mục này thay chỗ mâu thuẫn ở §1–5):

1. **Chia nhỏ S1:**
   - **S1a** chuyển `slow`, `bleed`.
   - **S1b** chuyển `shield`, `empower`.
   - `transform`, `absorb` và pha truyện (`phases`) **giữ cơ chế riêng**; hệ trạng thái chỉ **đọc** chúng (`statusView(a)`) để hiện icon và cho AI biết. Mỗi bước đều phải trùng trace baseline.
2. **Tách hai khái niệm:**
   - `interruptResist`: luật `armor` hiện tại, chống bị **ngắt chiêu** do khựng hoặc đẩy lùi.
   - `ccImmune`: miễn khống chế, gán riêng theo tag (`hard`/`root`/`seal`).

   `armor` **chỉ** = `interruptResist`, không miễn trói hay phong cấm.

   Riêng **choáng** (khống chế cứng) vẫn ngắt cả chiêu `armor`. **Trói/phong cấm** không ngắt chiêu đang vận, chỉ chặn lệnh mới thuộc loại bị cấm.
3. **Miễn và giảm dần:**
   - Khoảng miễn 1,2s tính **sau khi khống chế kết thúc**.
   - Giảm dần theo **nhóm**: `hard` (choáng, đóng băng, hóa tượng, hất ngã, sợ hãi), `root` (trói), `seal` (phong cấm). Mỗi nhóm đếm riêng trong cửa sổ 6s: 100% → 50% → 25% → miễn.
   - **Khựng** do trúng đòn thường (state `hit` 0,32s + `poise` 1,2s) giữ luật cũ, **không** tính vào giảm dần và không mở khoảng miễn khống chế.
4. **Cộng dồn: mỗi trạng thái có danh sách instance theo nguồn**, `a.st[id] = [{src, until, stacks, power, data}]`. Chế độ:
   - `refresh` (một instance): thời hạn = max(còn lại, mới); `power` lấy cái lớn hơn.
   - `perSource` (vd độc): mỗi nguồn một instance, thời hạn riêng. Hiệu lực = tổng tầng, có `maxStacks` chung; vượt trần thì instance sắp hết hạn bị thay.
   - `keep`: so `power` (mức tác dụng) trước, bằng nhau thì so thời gian còn lại.
   - **DoT** ghi công cho `src`. Nguồn chết thì DoT vẫn chạy tới hết hạn. Trận kết thúc (`B.over`) hoặc mục tiêu KO thì **xóa hết** trạng thái của bên đó.
5. **Giữ đúng dossier:**
   - Trấn Ma Thiết Tác là **trói + trấn áp không khiếu**, có thể ghép trói + phong cấm. Chỉ gắn khi dossier đợt 2 duyệt cơ chế.
   - Trị Liệu **chỉ giải chảy máu** (data.js `cure` = cầm máu), **không** giải độc.
   - Độc của cương thi chưa xác minh, **không gắn**.
   - Hóa tượng "vỡ khi trúng đòn +50%" và tàng hình "đòn đầu ×1,3" ghi `src:'game'` (thông số chuyển thể).
6. **Test bảo toàn bắt buộc** (thêm vào S1/S2):
   - Thiên Bồng vẫn trả phí duy trì và ngừng hồi chân nguyên.
   - DoT bỏ qua hộ thể.
   - Lệnh đệm khi bị khống chế: bị choáng thì **xóa** lệnh đệm. Lệnh mới trong lúc bị khống chế bị **từ chối kèm lý do**, không xếp hàng.
   - Giải trạng thái.
   - Dọn sạch khi KO và kết trận.
   - Trace PN/BNB giữ chân nguyên và thời điểm phát chiêu (trace hiện có: event `release` kèm `t`, ess mỗi 0,5s).

**Bốn lựa chọn cuối plan (đề xuất Blue, Orange đồng ý; chờ người dùng chơi thử chốt số):**
- S2 chỉ thêm **Choáng, Trói, Phong cấm** vào sim. Các trạng thái khác thử trên **hình nộm** trước.
- **Hoãn Hỗn loạn.**
- **Mù:** vòng báo đòn mờ nhưng vẫn đọc được; độ lệch đạn thử nhỏ (±10°) trước.
- **Choáng thường 0,6–1s, trần 1,5s**; số cuối chốt bằng chơi thử.

Blue làm icon/FX sau khi Orange chốt danh sách và event (`status`, `statusEnd`, `statusBlocked`, `statusImmune`).

## 8. Đã làm (03/10/2026, Orange)
- **S1a xong:** `js/sandbox/status.js` có store `a.st` + `apply/active/blocked/expire/clearAll/view`. Làm chậm và chảy máu chạy qua store, giữ luật cũ (mode `replace`). Trường cũ `slowUntil/slowF/bleed` vẫn đọc/ghi được nhờ getter/setter. **Trace 45/45 trùng.**
- **S2 xong:** choáng (state `stun`, ngắt cả chiêu armor, xóa lệnh đệm), trói, phong cấm.
  - Chiêu khai báo `applies:[{st,dur,chance}]`, áp ở mọi nhánh trúng (cận chiến, đạn, vùng, chộp, lao).
  - Giảm dần theo nhóm và miễn 1,2s sau khi kết thúc; trần choáng 1,5s.
  - Lệnh bị chặn trả lý do, không xếp hàng.
  - Event: `status`, `statusEnd`, `statusImmune`.
- **S3 (hình nộm) có sẵn:** profile `hinh_nom`.
  - Q choáng 0,8s, W trói 1,5s, E phong cấm 2s.
  - Chơi bên hình nộm để gây trạng thái lên PN máy (`?p=hinh_nom&e=pn_demo`), hoặc xem máy đấu máy (`?p=pn_demo&e=hinh_nom&mode=auto`).
- **Hiển thị tạm:** icon + giây còn lại trên đầu (ưu tiên choáng), chữ nổi "Choáng!", "miễn", nhãn trên thanh máu. Icon vẽ riêng chờ Blue.
- **Chưa:** S1b (shield/empower), mù và các trạng thái khác (thử trên hình nộm trước), AI đọc trạng thái đối thủ (S5), gắn cổ theo dossier (S6).
- **Test:** chuyển slow/bleed giữ luật, DoT bỏ qua hộ thể, choáng ngắt armor và xóa lệnh đệm, trói, phong cấm (vật phẩm vẫn dùng được), giảm dần + miễn, dọn khi KO.
