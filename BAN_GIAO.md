# Bàn giao: bước tiếp theo 1.2 · Sổ ký ức

Tài liệu này dành cho người hoặc AI tiếp nhận dự án. Đọc hết trước khi sửa code. Lộ trình tổng thể nằm ở mục "Lộ trình tiếp theo" trong `KE_HOACH.md`.

---

## 1. Dự án là gì

**Thanh Mao Sơn Ký** là game tu luyện theo lượt, bối cảnh quyển một *Cổ Chân Nhân* (Thanh Mao Sơn). Phương Nguyên trùng sinh nhờ Xuân Thu Thiền, sống qua 27 tuần (9 tháng, mỗi tháng 3 tuần) cho tới khi Thanh Mao Sơn diệt vong.

- Chạy trên máy: `python3 -m http.server 8000` rồi mở `http://localhost:8000`. Không mở trực tiếp file `index.html`.
- Link chơi công khai: https://claude.ai/artifact/JCxtbEtAKCESDM5jjCa6xM (bản đăng bỏ dòng nạp `assets/local/manifest.js`).
- Nhánh làm việc: `claude/clever-curie-8nf9qj`. Nhánh `main` đã có bản 13 và phần cổ trùng nguyên tác.

### Nguyên tắc thiết kế (bắt buộc)
1. Cốt truyện được lệch nguyên tác, **cơ chế thì phải theo nguyên tác** (nuôi cổ, chân nguyên, không khiếu, cảnh giới, luyện cổ, sát chiêu, Xuân Thu Thiền). Không thêm cơ chế nguyên tác không có.
2. Nhân vật và địa điểm lấy từ quyển một. Sự kiện ngẫu nhiên viết tự do nhưng không lệch bối cảnh.
3. **Vòng lặp thời gian là trọng tâm:** mỗi lần chết phải cho người chơi biết thêm điều gì đó, và điều đó mở ra việc mới để làm.
4. **Bản quyền:** không chép đoạn văn trong truyện; mọi đoạn văn sự kiện tự viết. Tranh đăng công khai chỉ dùng tranh có sẵn trong `assets/art`, `assets/gu`, `assets/npc` (Canva AI và tranh CC0). Tranh mới phải là thiết kế riêng, không vẽ lại tạo hình nhân vật của donghua hay manhua. Ảnh tải từ mạng chỉ để trong `assets/local/` và không bao giờ đăng lên link.
5. Văn phong trong game: tiếng Việt, câu ngắn, xưng "ngươi" với người chơi, gọi tên cổ trùng theo bản convert (Nguyệt Quang Cổ, Xuân Thu Thiền...).

---

## 2. Kiến trúc

Không dùng framework hay bundler. Các file JS nạp theo thứ tự trong `index.html`, dùng biến toàn cục:

| File | Vai trò |
|---|---|
| `js/data.js` | Dữ liệu tĩnh: `GU` (cổ trùng), `EN`/`EAI` (địch), `NPC`, `MEM` (ký ức), `TRAITS` (mệnh cách), `WORLD` (thiên cơ), `RECIPES`, `COMBOS`, `DIFF` (độ khó). |
| `js/events.js` | `EV` (sự kiện), `CANON` (lịch mốc nguyên tác theo tuần), `AFTER` (hàm chạy sau khi thắng trận), `ENDINGS`, `NPC_POOL`. |
| `js/living.js` | Tranh sống trong đấu trường: lưới uốn và xương. `RIGS` chứa tọa độ xương cho từng tranh. |
| `js/battle.js` | Đấu trường PixiJS. Engine đẩy hiệu ứng vào `FX.q(...)`. |
| `js/minigame.js` | Luyện cổ, mổ thạch, đột phá. |
| `js/ui.js` | Vẽ giao diện: thanh trạng thái, dòng thời gian, bảng nhân vật (4 tab), thẻ sự kiện, bản đồ. |
| `js/ff.js` | Tua nhanh bằng ký ức (bước 1.1, đã xong). |
| `js/cicada.js` | Luật Xuân Thu Thiền: hồi phục 12 tuần, quay ngược 3 tuần, ảnh chụp đầu tuần. |
| `js/engine.js` | Trạng thái và vòng đời: `newLife`, `startTurn`, `endTurn`, `choose`, `act`, `fight`, `playerAct`, `die`, `rebirth`, lưu trữ. Nạp cuối cùng và gọi `start()`. |

### Hai biến trạng thái
- `S`: trạng thái của lần chơi hiện tại (tuần, tu vi, cổ, quan hệ, cờ sự kiện `S.f`, biến thể cánh bướm `S.var`...). Lưu ở `localStorage['tms2-save']`. Khi quay ngược, `S` được thay bằng ảnh chụp cũ, trừ `S.log` và `S.snaps`.
- `META`: dữ liệu vượt qua các lần chơi (ký ức `META.mem`, các lần chết `META.deaths`, sự kiện đã thấy `META.seen`, lựa chọn gần nhất `META.choiceMem`/`META.choiceTag`, đường đi lần trước `META.lastPath`...). Lưu ở `localStorage['tms2-meta']`. **Không bị ảnh hưởng khi quay ngược.**

### Luật Xuân Thu Thiền hiện tại
- Chết khi Thiền hồi phục đủ (`cicadaReady()`): `S.over='rewind'`, người chơi bấm nút thì `rewindTime()` đưa về 3 tuần trước.
- Chết khi chưa hồi phục: `S.over='dead'`, bấm nút thì `rebirth()`: `META.life++`, chơi lại từ tuần 1, có thể tua nhanh.
- Mỗi lần chết đều ghi vào `META.deaths` dạng `{life, turn, cause, rewind}`.

### Sự kiện
Mỗi sự kiện trong `EV` có `title`, `text()` và `choices` (mảng hoặc hàm trả về mảng). Mỗi lựa chọn có dạng:
`{t:'nội dung', tag:'ma'|'chinh', canon:1, check:['tamco'|'satphat'|'ngo', độ khó], bonus(), req(), reqT, ok(), fail(), eff()}`.
Sự kiện ngẫu nhiên có thêm `loc` (`hocduong`, `trai`, `nui`, `nhiemvu`) và `w` (trọng số).

---

## 3. Kiểm tra (bắt buộc trước khi commit)

```bash
node tools/sim.cjs 300 6     # cân bằng: thắng 15–35% trong 6 lần chơi, KHÔNG được có "kẹt vòng lặp"
node tools/ff_test.cjs 120   # tua nhanh: "lỗi: 0"
```

Kiểm tra dữ liệu không tham chiếu tới cổ hay sự kiện không tồn tại (xem cách làm trong lịch sử commit `6529fd4`). Sau đó mở game trong trình duyệt, mở Console (F12), chơi qua phần vừa sửa và bảo đảm không có lỗi JS. Save cũ phải tải được: trường mới trong `META` hoặc `S` phải có giá trị mặc định khi thiếu.

### Những lỗi đã gặp, đừng lặp lại
- **`assets/local/manifest.js` trên máy thay tranh bằng ảnh cá nhân.** Khi kiểm tra đồ họa, chặn file này để thấy đúng như bản đăng.
- **Đòn kết liễu chạy bất đồng bộ khi có đấu trường** (`win()` và `die()` chờ hoạt ảnh nếu tồn tại `#arena`). Script tự chơi trong trình duyệt phải đặt `S.ff` hoặc tránh dựng đấu trường, nếu không trận không kết thúc ngay.
- **Trong đấu trường, đừng `addChild` lại lớp lóe sáng (`E.flash`, `P.flash`)** của tranh sống: nó đã nằm trong vật chứa của tranh, kéo ra sẽ hiện ở kích thước gốc.
- **Nguyên thạch không được âm.** `choose()` và `cultivate()` đã chặn, sự kiện mới vẫn nên kiểm tra `req`.
- **Ghi lại đường đi cả trong lúc tua** (`ffRecord`), nếu không lần chơi sau không tua lại được đoạn đã tua.

---

## 4. Việc cần làm: 1.2 Sổ ký ức

### Mục tiêu
Thay tab **Ký ức** hiện tại (chỉ liệt kê tên ký ức và 5 lần chết gần nhất) bằng một **sổ ký ức** tự động ghi lại mọi điều người chơi đã biết qua các lần chơi và các lần quay ngược. Người chơi mở sổ để lên kế hoạch: "tuần 11 Giả Kim Sinh chặn đường", "lần trước chết ở tuần 19 dưới tay bầy Điện Lang", "vườn linh dược hoang ở hậu sơn khoảng tháng 3".

Sổ là nền cho bước 1.3 (ký ức mở lựa chọn mới), nên dữ liệu phải ghi đủ và có cấu trúc.

### Dữ liệu (thêm vào `META`, mặc định `{}` khi thiếu)
`META.journal = { ev:{}, npc:{}, secret:{}, notes:[] }`

- **`ev[id]`**: `{title, first:tuần gặp sớm nhất, last:tuần gặp gần nhất, times:số lần gặp, picks:{nội dung lựa chọn: số lần chọn}, outcomes:[tối đa 3 kết quả gần nhất, rút gọn 120 ký tự]}`. Ghi trong `choose()` ngay sau khi có kết quả `txt`. Kết quả nên lưu kèm lựa chọn để người chơi thấy "chọn X thì ra Y".
- **`npc[k]`**: `{firstTurn, relMax, relMin, lastRel, notes:[]}`. Ghi trong `meet()` và `rel()`. `notes` nhận câu ngắn khi một cờ tuyến NPC đổi, ví dụ Phương Chính thành đồng minh (`S.f.pcAlly`) hoặc thù địch (`S.f.pcHate`), Thanh Thư sống hay chết (`qingshuAlive`/`qingshuDead`), Bạch Ngưng Băng liên thủ (`baiAlly`). Cách đơn giản: kiểm tra các cờ này ở cuối `choose()` và trong `win()`, ghi khi cờ vừa bật.
- **`secret[k]`**: ký ức trong `MEM` (đã có ở `META.mem`, chỉ cần hiển thị lại) cộng với bí tàng đã tìm thấy: `{kind, loc, from, to}` lấy từ `S.cache` khi sự kiện `x_cache` hoặc `r_tinbitang` chạy. Lưu ý mỗi lần chơi bí tàng được bốc lại ngẫu nhiên, nên sổ phải ghi rõ là "lần chơi thứ N".
- **Cái chết:** dùng lại `META.deaths` (đã có `life`, `turn`, `cause`, `rewind`). Không cần lưu thêm.

Giới hạn kích thước: `outcomes` tối đa 3, `notes` mỗi NPC tối đa 6, không lưu toàn bộ nhật ký. `localStorage` của mỗi artifact có hạn.

### Giao diện
Tab **Ký ức** trong `renderSheet()` (`js/ui.js`) chia 4 mục con, giữ phần Sát chiêu và Lưu trữ đang có ở cuối tab:
1. **Lịch sự kiện:** danh sách theo tuần (tuần gặp sớm nhất), mỗi dòng: tuần, tên sự kiện, số lần gặp. Bấm vào thì mở ra các lựa chọn đã từng chọn và kết quả. Mốc nguyên tác lấy thêm biểu tượng từ `CANON_GLYPH`.
2. **Nhân vật:** mỗi NPC đã gặp: quan hệ cao nhất và thấp nhất từng có, các ghi chú tuyến truyện.
3. **Bí mật:** ký ức trong `META.mem` và bí tàng đã tìm thấy.
4. **Cái chết:** tất cả các lần chết, nhóm theo lần chơi, đánh dấu lần nào được Thiền cứu (quay ngược) và lần nào là chết thật.

Phong cách: dùng lại các lớp CSS có sẵn (`.mems`, `.row`, `.dimt`, `.label`, `.pill`). Trên điện thoại bảng nhân vật nằm dưới cùng nên nội dung phải gọn, mặc định thu gọn, bấm để mở.

### Tiêu chí hoàn thành
- [ ] Chơi một lần qua tuần 5 rồi chết thật: lần chơi sau mở tab Ký ức thấy đủ sự kiện đã gặp, lựa chọn và kết quả.
- [ ] Quay ngược bằng Thiền không làm mất dữ liệu trong sổ (sổ nằm trong `META`).
- [ ] Save cũ không có `META.journal` vẫn tải được, sổ bắt đầu trống.
- [ ] `node tools/sim.cjs 300 6` không có ca kẹt vòng lặp, tỉ lệ thắng không đổi đáng kể (sổ không ảnh hưởng cân bằng).
- [ ] `node tools/ff_test.cjs 120` báo `lỗi: 0`.
- [ ] Không có lỗi JS trong trình duyệt khi mở cả 4 mục của sổ.
- [ ] Cập nhật `KE_HOACH.md`: đánh dấu 1.2 đã xong, ghi tên file và hàm đã thêm.

---

## 5. Sau 1.2

- **1.3 Ký ức mở lựa chọn mới:** thêm vào lựa chọn trường `mem:'khóa ký ức'` (hoặc điều kiện theo `META.journal`) để chỉ hiện khi người chơi đã biết. Hiển thị nhãn riêng (ví dụ "Ký ức") trong `choiceBtn()` ở `js/ui.js`. Chuyển dần các ký ức đang chỉ cộng chỉ số (`langtrieu`, `doanthach`, `huyethai`...) sang mở lựa chọn. Ví dụ có sẵn để học theo: sự kiện `r_tukiep` và `x_giave` đã có lựa chọn chỉ hiện khi có ký ức.
- **1.4 Tâm nguyện mỗi lần chơi:** chọn một mục tiêu cụ thể ở màn mệnh cách, làm được thì ghi ký ức.
- **Chưa quyết:** chết thật hiện vẫn giữ ký ức cho lần chơi sau. Nếu chủ dự án muốn chết thật là mất sạch cả ký ức thì sửa `rebirth()` và ghi vào `KE_HOACH.md`.
