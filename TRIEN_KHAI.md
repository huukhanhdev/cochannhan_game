# Thanh Mao Sơn Ký · Kế hoạch triển khai

Tài liệu này biến "Lộ trình tiếp theo" (bản kế hoạch mới, 30/09/2026) thành các bước làm cụ thể: sửa file nào, thêm dữ liệu gì, kiểm tra ra sao. Thứ tự làm đi từ trên xuống.

---

## 0. Hiện trạng code (đo ngày 30/09/2026)

**Nhánh làm việc:** `origin/claude/clever-curie-8nf9qj`, commit `f6c5a92`.
- Nhánh này có `js/cicada.js`, `js/ff.js`, `js/living.js`, `tools/ff_test.cjs` và `BAN_GIAO.md`.
- `main` trên máy đang chậm 4 commit so với `origin/main`, và chưa có code của lộ trình mới.

**Mô phỏng trên nhánh:**

| Lệnh | Kết quả |
|---|---|
| `node tools/sim.cjs 200 6` | Thắng **14,5%** trong 6 lần chơi. Lần đầu 2%. Tuần chết trung bình 10,5. |
| `node tools/ff_test.cjs 60` | Lỗi 0. Tua tới đúng mục tiêu 26/58. |

Nguyên nhân chết nhiều nhất:

| Địch | Số lần |
|---|---|
| Giả Kim Sinh | 321 |
| Hộ vệ Giả gia | 202 |
| Đám học trò Nhất chuyển | 118 (mới xuất hiện) |
| Hắc Hùng | 54 |

**Lệch giữa tài liệu và code:**
- Kế hoạch ghi `DIFF` là 1,25 và tỉ lệ thắng 32,8%. Code hiện có `DIFF={hp:1.32,atk:1.32}`, và tỉ lệ thắng đo được 14,5%, dưới mức 15%. Cần chốt lại ở bước 2.3. Trước đó có thể hạ `DIFF` về 1,25 để có bản chơi được.
- Có 16 ký ức (`MEM`). Hầu hết chỉ cộng chỉ số. Chỉ `r_tukiep` và `x_giave` có lựa chọn mở bằng ký ức.

---

## Bước 0: Chuẩn bị (nửa buổi)

- [ ] **0.1 Đồng bộ.** Chuyển thư mục máy sang nhánh `claude/clever-curie-8nf9qj`. Máy đang có `TONG_QUAN.md` và `KE_HOACH copy.md` chưa commit, nên giữ lại hoặc bỏ tùy bạn. Từ giờ chỉ làm trên nhánh này, xong từng giai đoạn thì gộp vào `main`.
- [ ] **0.2 `tools/check.cjs`: kiểm tra dữ liệu.** Nạp `data.js` và `events.js` như `sim.cjs` đang làm, rồi báo lỗi khi có:
  - khóa cổ trong `RECIPES`, `COMBOS`, `drop` của địch, `shop`, `S.gu.push` không có trong `GU`;
  - sự kiện trong `CANON`, `AFTER`, `NPC_POOL`, `evq.push('…')` không có trong `EV`;
  - địch trong `fight('…')` không có trong `EN`;
  - ký ức trong `gainMem('…')` hoặc `hasMem('…')` không có trong `MEM`.

  Trả mã thoát khác 0 khi có lỗi.
- [ ] **0.3 Bổ sung số liệu cho `tools/sim.cjs`.** Thêm hai chỉ số người chơi cảm nhận được:
  - **Số lần chơi tới lần thắng đầu:** trung vị và phân vị 80.
  - **Số tuần phải chơi lại mỗi chiến dịch:** gồm tuần mất khi Thiền quay ngược (`REWIND_WEEKS`), cộng số tuần phải chơi lại sau mỗi lần chết thật. Tuần đi qua bằng tua nhanh thì không tính.

  Thêm tham số `--ff` để người chơi máy dùng `ff.js` sau khi chết thật, như người chơi thật.
- [ ] **0.4 `tools/verify.sh`** chạy lần lượt `check.cjs`, `sim.cjs 300 6` và `ff_test.cjs 120`, rồi in một bảng tóm tắt. Đây là cửa kiểm tra bắt buộc cho mọi bước bên dưới.

**Xong khi:** `verify.sh` chạy qua trên nhánh hiện tại, và có con số gốc cho hai chỉ số mới.

---

## Giai đoạn 1: Sửa vòng lặp

### 1.2 Sổ ký ức (1–2 buổi)
Làm theo đặc tả trong `BAN_GIAO.md` mục 4. Tóm tắt:
- **Dữ liệu:** `META.journal={ev:{},npc:{},secret:{},notes:[]}`. Tạo mặc định trong `loadMeta()`.
- **Hàm ghi mới:** đặt trong file mới `js/journal.js`, nạp trước `engine.js`.
  - `jEvent(id,choice,txt)`: gọi trong `choose()`.
  - `jNpc(k)`: gọi trong `meet()` và `rel()`.
  - `jFlags()`: gọi cuối `choose()` và trong `win()`. Hàm dò các cờ tuyến NPC: `pcAlly`, `pcHate`, `qingshuAlive`, `qingshuDead`, `baiAlly`.
  - `jCache()`: gọi trong `x_cache` và `r_tinbitang`.
- **Thêm vào sổ, phục vụ 1.3 và 2.2:**
  - `journal.foe[enemyKey]={met, kills, deaths, seenSk:[]}`. Ghi mỗi chiêu riêng của địch mà người chơi đã thấy.
- **Giao diện:** tab Ký ức trong `renderSheet()` chia 4 mục (Lịch sự kiện, Nhân vật, Bí mật, Cái chết), mặc định thu gọn. Thêm mục thứ 5 là **Kẻ địch**: chiêu đã thấy, điểm yếu đã biết.
- **Giới hạn kích thước:** `outcomes` tối đa 3, `notes` tối đa 6. Kiểm tra `JSON.stringify(META).length` dưới 150 KB sau 20 lần chơi mô phỏng.

**Xong khi:** đạt đủ tiêu chí trong `BAN_GIAO.md`, và `verify.sh` chạy qua.

### 1.3 Ký ức mở lựa chọn mới (2–3 buổi)
**Khung chung:**
- Lựa chọn có thêm trường `mem:'khóa'`, hoặc `know:()=>điều kiện theo META.journal`.
- `choicesOf()` ẩn lựa chọn khi chưa biết. `choiceBtn()` hiện nhãn **憶 Ký ức** màu vàng.
- Hàm tiện ích: `seen(id)`, `seenAt(id)`, `diedTo(enemy)`, `knowsFoe(enemy,sk)`.

**Ký ức cũng đến từ cái chết.** Trong `die()`, chết dưới tay địch nào thì mở ký ức gắn với địch đó (bảng `DEATH_MEM` trong `data.js`):

| Chết vì | Nhận ký ức |
|---|---|
| Giả Kim Sinh | `jks` |
| bầy Điện Lang | `langtrieu` |
| huyết khôi | `huyethai` |
| … | … |

Đây chính là cảm giác "lần này ta biết hắn đi đường nào".

**Chuyển ký ức cộng chỉ số thành lựa chọn** (giữ một phần chỉ số nhỏ để không hụt cân bằng):

| Ký ức | Lựa chọn mới | Ở đâu |
|---|---|---|
| `jks` Thói quen Giả Kim Sinh | "Phục sẵn ở bờ sông trước khi hắn tới". Đánh trước một lượt, hắn vào trận đang choáng, hộ vệ không kịp theo. | `c_kimsinh` |
| `hoatuu` Đường vào động | "Đi thẳng vào khe đá": từ tuần 2 hậu sơn mở ngay tầng `hs_khe`. | hành động `hauson` |
| `langtrieu` Nhịp lang triều | "Chặn cửa tây từ trước": bớt một đợt sói, hoặc bán tin cho gia lão lấy nguyên thạch. | `c_lang1` |
| `huyethai` Cửa sinh | "Đi theo cửa sinh": bỏ qua một đợt huyết khôi. | `c_huyetdong` |
| `doanthach` Mổ thạch | Mỗi tuần nhìn thấu vân của một khối đá ở quầy. | minigame mổ thạch |
| Biết ngày Bạch gia tập kích (từ sổ: `seenAt('c_baigia')`) | Báo trước cho tộc (danh vọng lên, hiềm nghi xuống) hoặc bán tin cho Bạch gia (ma). | sự kiện mới `m_baotin`, tuần trước mốc |
| `tramthuy` Sợi dây đỏ | "Ra tay trước với sát thủ". | tuyến `caumo_route` |
| `tiexue` Thủ đoạn thần bổ | "Dựng sẵn chứng cớ ngoại phạm" trước khi bị tra hỏi. | `c_dieutra`, `c_thiet` |
| `hunglam`, `sontac`, `hauquan`, `bachmaon` | Mỗi ký ức một lối tắt hoặc một cách đánh trước. | sự kiện tương ứng |

**Tiêu chí:**
- Ít nhất 12 lựa chọn mở bằng ký ức. Mỗi mốc nguyên tác lớn có ít nhất một.
- `check.cjs` báo lỗi khi có khóa `mem` không có trong `MEM`.
- Sau khi cho người chơi máy dùng lựa chọn ký ức, tỉ lệ thắng từ lần chơi thứ hai trở đi phải tăng rõ, còn lần đầu thì không đổi.

### 1.4 Tâm nguyện mỗi lần chơi (1–2 buổi)
- **Dữ liệu:** `VOWS` trong `data.js`: `{id, n, d, ok(), mem}`.
  - `ok()` được kiểm tra cuối tuần và khi kết thúc lần chơi.
  - Tâm nguyện thành thì mở ký ức `mem`, hoặc ghi một bí mật vào sổ.
- **Kho khoảng 10 tâm nguyện**, mỗi lần chơi bốc 3. Chỉ bốc những tâm nguyện có liên quan tới điều đã biết trong sổ. Ví dụ:
  - lấy truyền thừa Hoa Tửu trước tháng 5;
  - cứu Thanh Thư;
  - giết Giả Kim Sinh mà hiềm nghi dưới 30;
  - lên Nhị chuyển trước lang triều;
  - sống qua lang triều không dùng Thiền;
  - đòi đủ gia sản trước tháng 2;
  - kết giao Bạch Ngưng Băng;
  - không tốn một nguyên thạch nào cho chợ.
- **Giao diện:** chọn ở màn mệnh cách (`pickTrait`). Tâm nguyện đang theo đuổi hiện trên thanh trạng thái. Khi thành, hiện thông báo vàng.
- **Tua nhanh:** `ff.js` phải dừng khi tâm nguyện mới cần rẽ khác đường cũ. Cách làm là thêm `vow.stopAt` là tuần cần dừng.

**Xong khi:** mô phỏng 100 chiến dịch cho thấy mỗi tâm nguyện đạt được ở ít nhất 5% số lần chơi. Tâm nguyện nào không ai đạt thì sửa hoặc bỏ.

---

## Giai đoạn 2: Chiến đấu có chiều sâu mà không kéo dài

### 2.1 Đánh nhanh cho trận dễ (1 buổi)
- Chuyển `botCombat()` từ `tools/sim.cjs` sang `js/auto.js`. Cả `ff.js` lẫn sim dùng chung, nên chỉ sửa AI một chỗ.
- **Nút "Tự đánh":** chỉ hiện khi địch không phải trùm (`!boss`), không phải tinh anh, và quyền năng địch nhỏ hơn 0,8 lần của người chơi.
  - Khi tự đánh, đấu trường tua nhanh gấp 4 lần. Bấm vào để dừng.
  - Tự động dừng khi khí huyết xuống dưới 40% để người chơi tự quyết.

**Xong khi:** trận thú rừng hoặc sơn tặc xong trong khoảng 3 giây, và không chết oan trong lúc tự đánh.

### 2.2 Mỗi loại địch một cách đối phó (2–3 buổi)
Không thêm cơ chế lạ. Chỉ dùng những gì đã có hoặc có trong nguyên tác: giáp, hộ thể, choáng, chảy máu, hàn khí, hồi máu.
- **Thuộc tính mới trên `EN`:** `trait:['giap'|'hoimau'|'nhanh'|'bay'|'han'|'huyet']`.
- **Cổ khắc chế:** thêm `counter:['giap',…]` vào `GU`. Bảng khắc chế gợi ý:

| Tính chất địch | Cổ khắc chế | Ví dụ địch |
|---|---|---|
| Giáp dày | Kim Châm (xuyên giáp), Cứ Xỉ Kim Ngô | Hắc Hùng, Bạch Mao Hùng Vương, Tửu Khôi |
| Hồi máu, trùm dai | Chảy máu (Cứ Xỉ Kim Ngô), Đao Sí Huyết Bức | Huyết Cương, huyết khôi |
| Nhanh, né | Đằng Mạn (choáng), Thanh Ti | Kim Tiền Báo, Điện Lang |
| Hàn khí (Bạch gia) | Hỏa Lô, Thủy Tráo | Trinh sát và gia lão Bạch gia, Bạch Ngưng Băng |
| Đông người | Toàn Phong, Nguyệt Toàn | Bầy sói, đám học trò |

- **Hiệu lực:** dùng đúng cổ khắc chế thì sát thương ×1,5 hoặc hiệu ứng mạnh hơn. Không có cổ khắc chế thì trận vẫn thắng được, nhưng khó hơn nhiều.
- **Nối với vòng lặp:** người chơi chỉ thấy tính chất của địch khi `journal.foe` đã ghi, tức là đã gặp hoặc chết vì nó. Lần đầu gặp chỉ hiện "???".
- Lập bảng 38 cổ theo vai trò (đánh, thủ, hồi, khắc chế gì). Cổ nào trùng vai trò với cổ khác thì đổi `counter` để cổ nào cũng có lý do để nuôi.
- Người chơi máy chọn cổ khắc chế khi có. Đo xem chênh lệch tỉ lệ thắng giữa có và không có khắc chế là bao nhiêu.

### 2.3 Cân lại độ khó (1 buổi, làm lại sau mỗi giai đoạn)
**Mục tiêu:**
- Trung vị số lần chơi tới lần thắng đầu: 3–5.
- Số tuần phải chơi lại mỗi chiến dịch không vượt quá khoảng 40.
- Tỉ lệ thắng của người chơi máy: 15–35%, chỉ là số phụ.

**Việc cần làm:**
- **Giả Kim Sinh và hộ vệ Giả gia:**
  - Kiểm tra quyền năng so với cảnh giới trung bình ở tuần 11 (khoảng 2,0).
  - Trận hộ vệ nên cho phép bỏ chạy hoặc tránh được bằng tâm cơ.
  - Ký ức `jks` (bước 1.3) là cách chính để vượt trận Giả Kim Sinh ở các lần chơi sau.
- **Đám học trò Nhất chuyển (118 lần chết):** kiểm tra lại, trận nhỏ không nên giết người chơi nhiều như vậy.
- **`DIFF`:** chốt con số cuối cùng rồi ghi vào `KE_HOACH.md`.

---

## Giai đoạn 3: Trình bày ở chỗ người chơi nhìn nhiều nhất

### 3.1 Sự kiện thành cảnh hội thoại (2–3 buổi)
**Code:**
- Thêm `who:'npcKey'` vào `EV`. Có thể viết theo từng đoạn: `lines:[{who,t}]`.
- `renderEvent()` dựng chân dung người nói bằng `living.js` (lưới uốn): chớp mắt, thở. Hai nét mặt mặc định và giận đổi bằng cách uốn lưới vùng mắt và miệng (dò tọa độ trong `RIGS`).
- Chữ hiện dần, bấm để hiện hết.
- Gán `who` cho khoảng 60 sự kiện có NPC. Làm các mốc nguyên tác trước.

**Tranh:**
- Chân dung 12 NPC còn thiếu, vẽ bằng Canva AI theo thiết kế riêng, phong cách thủy mặc giống tranh hiện có.
- Canva giới hạn khoảng 10 ảnh mỗi phút, nên chia 3 đợt, mỗi đợt 4 nhân vật.
- Thứ tự: Phương Chính, Thanh Thư, Giả Kim Sinh, Thiết Huyết Lãnh, Thiết Nhược Nam, Trầm Thúy, Mạc Bắc, Mạc Nhan, Hùng Lâm, Xích Sơn, Thương Tâm, Xích Thành.
- Tranh để ở `assets/npc/n_<khóa>.jpg`. Không vẽ lại tạo hình trong donghua hay manhua.

### 3.2 Bản đồ sống (1 buổi)
- Thêm lớp phủ CSS hoặc Pixi lên bản đồ. Ngày và đêm đổi theo tuần trong tháng: tuần 1 sáng, tuần 3 hoàng hôn.
- Thời tiết đọc từ `S.world` (thiên cơ): mưa dầm, hàn khí, đại hạn.
- Tuần 17–18 có trăng máu và mây đen. Sau lang triều có khói.
- Nơi đã có sự kiện trong sổ ký ức hiện một chấm vàng nhỏ.

### 3.3 Cảnh chết và trùng sinh (1 buổi)
- Tạo lớp phủ Pixi riêng gồm: con ve vàng vỗ cánh, hạt quang âm bay ngược, số tuần trên dòng thời gian chạy lùi, và vài dòng nhật ký gần nhất cuộn ngược.
- Có hai bản:
  - **Quay ngược 3 tuần:** ngắn, khoảng 1,5 giây.
  - **Chết thật:** dài, khoảng 3 giây, sau đó mở màn chọn tâm nguyện.
- Bấm để bỏ qua. Chế độ đồ họa thấp chỉ làm mờ dần.

### 3.4 Bố cục điện thoại (1 buổi)
- Màn hình dưới 700px dùng một cột: thanh trạng thái gọn một dòng, thẻ sự kiện chiếm cả màn hình.
- Bảng nhân vật thành ngăn kéo dưới đáy màn hình. Vuốt để đổi tab. Nút bấm cao ít nhất 44px.
- Thử trên Chrome giả lập iPhone SE và Pixel 7.

---

## Giai đoạn 4: Đấu trường (3–4 buổi)

- [ ] **Gắn xương cho trùm** trong `RIGS` của `living.js`: Bạch Ngưng Băng, Lôi Quan Lang Vương, Hắc Hùng, gia lão, Huyết Thủ ma tu. Mỗi tranh cần dò tọa độ đầu, mắt, tay hoặc hàm, dùng công cụ dò có sẵn hoặc viết thêm trang `tools/rig.html`.
- [ ] **Hiệu ứng theo nhóm cổ:**
  - Thêm trường `el` vào `GU`: `nguyet`, `bang`, `huyet`, `phong`, `kim`, `ho`.
  - `battle.js` chọn hàm vẽ theo `el` thay cho viên đạn chung.
  - Hình dạng từng nhóm: nguyệt là lưỡi trăng hoặc vòng cung, băng là mảnh băng, huyết là dơi, phong là lốc, kim là răng cưa, hộ thể là màn nước, tơ hoặc lửa.
- [ ] **Cảnh cắt khi tung sát chiêu:** màn mực phủ, chân dung trượt vào, tên chiêu viết từng nét (khoảng 1,2 giây, bấm để bỏ qua).
- [ ] **Địch chết tan thành mực:** hạt mực bay theo hướng đòn cuối.
- [ ] **Chế độ đồ họa thấp:** tự bật khi FPS dưới 40 trong 2 giây đầu. Chế độ này dùng lưới thưa hơn, ít hạt hơn, không bộ lọc.

---

## Giai đoạn 5: Nội dung (3–4 buổi)

**Gắn 22 cổ vào cốt truyện:** mỗi cổ có ít nhất một sự kiện nhận được, đúng chủ nhân trong nguyên tác.

| Nơi hoặc người | Cổ |
|---|---|
| Động Hoa Tửu (tầng sâu) | Cứ Xỉ Kim Ngô, Cửu Diệp Sinh Cơ Thảo, Sinh Cơ Diệp |
| Lăng mộ Nhất Đại | Đao Sí Huyết Bức, Huyết Lô (đã có), Bạch Ngân Xá Lợi |
| Thanh Thư | Nguyệt Toàn, Mộc Mị (gắn với cái chết của hắn) |
| Xích Sơn | Hỏa Lô |
| Bạch gia | Băng Đao, Ẩn Lân (rơi từ trinh sát hoặc gia lão) |
| Học đường, tộc | Tiểu Quang, Nguyệt Ngân, Nguyệt Nghê Thường, Đồng Bì, Thanh Ti |
| Núi, thú rừng | Toàn Phong, Lang Hào, các cổ còn lại |

`check.cjs` thêm một cảnh báo liệt kê những cổ chỉ có thể lấy từ chợ, lò luyện hoặc mổ đá.

**Kết cục theo hiểu biết qua nhiều lần chơi.** Các kết cục mới có điều kiện đọc từ `META.journal` và `META.mem`:
- biết bí mật Huyết Lô từ lần chơi trước, đoạt lò trước khi Nhất Đại tỉnh;
- biết ngày Bạch gia tập kích, dẫn Bạch gia vào tộc;
- đủ 5 tâm nguyện đã thành.

Mỗi kết cục cần 1 đoạn văn và 1 tranh nền.

---

## Làm xen kẽ

- [ ] **Phiên bản save:**
  - Thêm `SAVE_VER` vào `S` và `META`.
  - `migrate(obj)` chạy lần lượt từng bước v1→v2→… Chuyển các đoạn lọc cổ đã bị bỏ trong `engine.js:807` vào đây.
  - Bước đầu tiên là thêm `journal`, `vows`, `cicada`, `snaps`.
  - Làm cùng bước 1.2, vì 1.2 là lần đầu đổi cấu trúc `META`.
- [ ] **Kiểm tra tự động:** chạy `tools/verify.sh` trước mỗi commit. Có thể gắn thành `git hook pre-commit`.
- [ ] **Đăng bản thử:** xong mỗi bước thì đăng lên link https://claude.ai/artifact/JCxtbEtAKCESDM5jjCa6xM để thử trên điện thoại.
  - Chỉ đăng `js/*.js` cùng tranh trong `assets/art`, `assets/gu`, `assets/npc`.
  - Bỏ dòng nạp `assets/local/manifest.js`.
  - Không bao giờ đăng `assets/local/`, `assets/chinese_sources/` hay ảnh tải từ mạng.

---

## Thứ tự và thời lượng ước tính

| # | Việc | Thời lượng | Phụ thuộc |
|---|---|---|---|
| 0 | Chuẩn bị: đồng bộ, check, sim, verify | ½ buổi | – |
| 1 | 1.2 Sổ ký ức và phiên bản save | 1–2 buổi | 0 |
| 2 | 1.3 Ký ức mở lựa chọn | 2–3 buổi | 1.2 |
| 3 | 2.3 Cân lần 1 (Giả Kim Sinh, `DIFF`) | 1 buổi | 1.3 |
| 4 | 1.4 Tâm nguyện | 1–2 buổi | 1.2 |
| 5 | 2.1 Đánh nhanh | 1 buổi | – |
| 6 | 2.2 Khắc chế địch | 2–3 buổi | 1.2 (sổ ghi địch) |
| 7 | 2.3 Cân lần 2 | 1 buổi | 2.2 |
| 8 | 3.3 Cảnh trùng sinh | 1 buổi | – |
| 9 | 3.1 Hội thoại và chân dung NPC | 2–3 buổi | Canva |
| 10 | 3.2 Bản đồ sống, 3.4 bố cục điện thoại | 2 buổi | – |
| 11 | Giai đoạn 4 Đấu trường | 3–4 buổi | 2.2 (trường `el`) |
| 12 | Giai đoạn 5 Nội dung | 3–4 buổi | 1.3, 2.2 |

Tổng cộng khoảng 20–27 buổi.

Mốc chơi thử lớn đầu tiên là sau bước 3, tức là xong 1.2, 1.3 và cân lần 1. Lúc đó vòng lặp đã khác hẳn: chết cho biết điều mới, và điều đó mở ra đường mới.

---

## Cần bạn quyết

1. **Chết thật có mất ký ức không?** Hiện tại ký ức vẫn giữ.
2. **Hạ `DIFF` từ 1,32 về 1,25 ngay** để bản thử dễ thở hơn trong lúc làm 1.2 và 1.3, hay giữ nguyên tới bước 2.3?
3. **`main` và nhánh `claude/clever-curie-8nf9qj`:** làm tiếp trên nhánh rồi gộp sau mỗi giai đoạn, hay gộp ngay bây giờ?

---

## Tiến độ (30/09/2026)

Giai đoạn 1 tạm hoãn theo yêu cầu. Đã làm giai đoạn 2 đến 5.

**Kiểm tra sau cùng:**
- `node tools/check.cjs`: không lỗi dữ liệu.
- `node tools/sim.cjs 400 6`: thắng 31,3%, lần đầu 3,5%.
- `node tools/ff_test.cjs 120`: lỗi 0.
- Chơi thử trong trình duyệt tới tuần 16: không có lỗi JS.

### Giai đoạn 2
- [x] **2.1 Tự đánh** (`js/auto.js`, hàm `autoFight`, `autoAct`).
  - Nút "Tự đánh" chỉ hiện ở trận thường: địch không phải thủ lĩnh và còn đường lui.
  - Các lượt chạy liền một mạch. Tự dừng khi khí huyết dưới 40%.
  - Tua nhanh (`ff.js`) và người chơi máy (`sim.cjs`) dùng chung AI này.
- [x] **2.2 Tính chất địch** (`FOE_TR`), hiện thành nhãn trên bảng địch:

  | Tính chất | Hiệu ứng | Khắc chế |
  |---|---|---|
  | Giáp dày | Chặn bớt mỗi đòn | Xuyên giáp |
  | Nhanh nhẹn | Né 25% đòn đánh đơn | Choáng, hàn khí, diện rộng |
  | Cả bầy | Đòn đơn còn ×0,85 | Diện rộng ×1,4 |
  | Hàn khí | Băng phong cổ | Hộ thể Hỏa Lô chặn băng phong |
  | Tái tụ | Tự hồi máu | Đang chảy máu thì hồi còn 35% |

  Cổ đánh diện rộng: Toàn Phong, Nguyệt Toàn, Đao Sí Huyết Bức.
- [x] **2.3 Cân lại độ khó.**
  - `DIFF` 1,31.
  - Giảm máu của Giả Kim Sinh và đám học trò.
  - `sim.cjs` in thêm số lần chơi tới lần thắng đầu, số tuần phải chơi lại và kết cục.

### Giai đoạn 3 (`js/present.js`)
- [x] **3.1 Người nói:** chân dung hoặc ấn chữ của người nói, cùng tên, nằm góc thẻ sự kiện. Chữ hiện dần; bấm vào thẻ để hiện hết.
  - Chưa làm: chân dung mới cho 12 NPC.
- [x] **3.2 Bản đồ:** buổi sáng, chiều, đêm theo tuần; mưa, tuyết, nắng hạn và linh khí theo thiên cơ; trăng máu trước lang triều; khói sau lang triều; tàn lửa ở hai tuần cuối.
- [x] **3.3 Cảnh Xuân Thu Thiền:** con ve vàng vỗ cánh, số tuần chạy lùi, nhật ký trôi ngược. Quay ngược dài 1,7 giây, chết thật dài 3 giây. Bấm để bỏ qua.
- [x] **3.4 Điện thoại:** thanh trạng thái gọn và dính trên đầu màn hình, nút cao 44px, vuốt trên bảng nhân vật để đổi tab.
  - Chưa làm: ngăn kéo dưới đáy màn hình.

### Giai đoạn 4 (`js/battle.js`, `js/living.js`)
- [x] Xương cho 5 tranh trùm: `p_wolfking`, `p_bear`, `p_bai`, `p_gialao`, `p_madutam`.
- [x] Hiệu ứng theo nhóm cổ (`GU_EL`):

  | Nhóm | Hình dạng |
  |---|---|
  | Nguyệt | Nguyệt nhận |
  | Ngân | Bay thẳng, nhanh |
  | Nguyệt Toàn | Lượn vòng cung |
  | Huyết | Nguyệt nhận đỏ |
  | Băng | Loạt mảnh băng |
  | Phong | Lốc xoáy nổ thành nhiều vòng |
  | Kim | Răng cưa đôi |
  | Huyết Bức | Bầy dơi |

  Hộ thể cũng có màu và hạt riêng theo cổ.
- [x] Cảnh cắt khi tung sát chiêu: dải mực, chân dung trượt vào, tên chiêu hiện dần.
- [x] Địch chết tan thành mực.
- [x] Đòn trượt có hoạt ảnh né.
- [x] Chế độ đồ họa thấp: tự bật khi 2 giây đầu dưới 40 khung hình mỗi giây.

### Giai đoạn 5
- [x] **Gắn cổ vào cốt truyện theo chủ nhân trong nguyên tác.** Số cổ chưa có sự kiện nhận giảm từ 22 xuống 13; số còn lại đến từ lò luyện hoặc rơi từ địch.

  | Nơi hoặc người | Cổ |
  |---|---|
  | Tầng sâu Hoa Tửu | Cửu Diệp, Cứ Xỉ Kim Ngô |
  | Lăng mộ Nhất Đại | Đao Sí Huyết Bức (cần ký ức `huyetlo`), Bạch Ngân Xá Lợi |
  | Cứu Thanh Thư | Nguyệt Toàn |
  | Cây Thanh Thư hóa thành | Mộc Mị |
  | Xích Sơn (sự kiện mới `r_xichson`) | Hỏa Lô |
  | Luận công | Nguyệt Nghê Thường |
  | Hùng Lâm | Hùng Lực |

- [x] **Hai kết cục mở bằng ký ức từ lần chơi trước:**
  - `tien_lo`: dẫn máu Huyết Cương vào lò trước khi hắn tỉnh.
  - `phan_toc`: bán đường vào trại cho Bạch gia.

### Công cụ
- [x] `tools/check.cjs`: kiểm tra tham chiếu cổ, địch, sự kiện, ký ức, kết cục; liệt kê cổ chưa gắn cốt truyện.

### Còn lại
- Giai đoạn 1: sổ ký ức, ký ức mở lựa chọn, tâm nguyện.
- Chân dung NPC.
- Đánh số phiên bản save.
