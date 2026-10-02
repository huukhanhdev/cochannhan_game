# Ghi chú tích hợp: sandbox battle E vào game chính

Ngày 02/10/2026. Đi kèm [KE_HOACH_BATTLE_TEST_PN_BNB.md](KE_HOACH_BATTLE_TEST_PN_BNB.md).

Sandbox: `battle_sandbox.html`. Code đã viết sẵn để sau này copy sang game chính. Mỗi file JS có dòng `TÍCH HỢP:` ở đầu, ghi chỗ cần nối.

## Trạng thái

| Bước | Trạng thái |
|---|---|
| Điều khiển (bản 2, [KE_HOACH_CHINH_BATTLE_E_V2.md](KE_HOACH_CHINH_BATTLE_E_V2.md)) | **Xong.** Bỏ dừng thời gian. Chuột phải đi; chuột vào địch để đuổi đánh; Q W E R D phóng theo con trỏ; Space lướt; 1 Sinh Mệnh Diệp; S dừng. Bộ đệm lệnh 0,25 giây. Tốc độ trận 0,75 / 0,85 / 1× |
| Chiêu Phương Nguyên | **Xong (logic):** Nguyệt Mang (đạn), Bạch Ngọc / Thiên Bồng (hộ thể thay thế nhau), Cự Xỉ Kim Ngô (cung + chảy máu), Cường Thủ (chộp kéo), Lướt, Sinh Mệnh Diệp (2 lá). Clip `sk_*` chưa có thì dùng clip dự phòng |
| Chiêu và AI Bạch Ngưng Băng | **Xong (logic):** băng nhận (làm chậm), Lốc băng nhận (vòng báo trước 1,15 giây, không bị ngắt), Thủy Tráo, Sương Yêu (thoát thân 1 lần, không gây sát thương hay đẩy lùi), né Nguyệt Mang. Bạch Ngọc / Băng Trùy tạm bỏ khỏi kit, chờ nguồn Q1 |
| Cân bằng | Đo bằng `node tools/sandbox_bench.cjs 300 <de\|thuong\|kho>`: script giả lập người chơi khá thắng khoảng 88 / 65 / 35%. Cần người thật chơi để chỉnh tiếp |
| Ảnh clip riêng | Chưa. Prompt ở [PROMPT_MUSE_ROSTER.md](../prompts/PROMPT_MUSE_ROSTER.md) và mục B3–B4 của kế hoạch bản 2 |

## Các file và vai trò

| File | Vai trò | Phụ thuộc |
|---|---|---|
| `js/kp_sprite.js` | Nạp sheet key-pose: `KPSprite.load(id)`, `frameAt`, `flash` | PIXI |
| `js/sandbox/kits.js` | Bộ chiêu (chỉ dữ liệu) | Không |
| `js/sandbox/sim.js` | Mô phỏng trận, bước cố định 1/60 giây | Không (chạy được trong node) |
| `js/sandbox/ai.js` | Máy điều khiển | `SBSim` |
| `js/sandbox/view.js` | Vẽ đấu trường, chọn frame theo state | PIXI, `KPSprite`, `SBSim` |
| `js/sandbox/input.js` | Điều khiển: chạy / bảng lệnh / chọn điểm, chuột | `SBSim`, `SBView` |
| `js/sandbox/hud.js` | Thanh máu, bảng lệnh HTML, dòng mô tả | `SBInput` |
| `tools/sandbox_sim.cjs` | Nạp sim cho node | Các file trên |
| `tools/sandbox_bench.cjs` | Đo tỷ lệ thắng theo mức khó | `sandbox_sim.cjs` |

Thứ tự nạp: PIXI → `kp_sprite` → `kits` → `sim` → `ai` → `view` → `input` → `hud` → vòng chính.

## Nguyên tắc giữ khi tích hợp

1. **`sim.js` là nguồn sự thật** cho máu, chân nguyên, hồi chiêu, trúng hay trượt. Hình ảnh không được trừ máu.
2. **Frame chọn theo thời gian trận** (`SBView.pick`), không dùng AnimatedSprite tự chạy. Trận luôn chạy khi chọn chiêu; idle dùng duration trong manifest, bóng lướt cũng mờ theo thời gian trận.
3. `B.events` được rút **một lần mỗi khung hình** ở vòng chính, rồi chuyển cho view và input. Không để hai nơi cùng `splice`.
4. Lệnh không hợp lệ (đang hồi, thiếu chân nguyên, ngoài tầm, đang ra chiêu) **không trừ gì** và trả về `reason` để hiện lên giao diện.

## Cách nối vào campaign (khi sandbox đạt)

1. **Thêm chế độ:** trong `js/ui.js`, hàm `fightModeButtons()`, thêm lựa chọn `e` ("Đấu trường"). Ghi vào `META.opt.fightMode='e'`.
2. **Khởi tạo trận:** trong `js/engine.js`, hàm `fight(k,o)`, sau khi dựng `S.combat`:

   ```js
   if(META.opt.fightMode==='e'){
     const kits={pn:kitFromPlayer(), bnb:kitFromFoe(k)};   // xem bước 3
     S.combat.e=SBSim.create(kits,{});
     S.combat.e.actors.pn.hp=S.hp;                          // máu hiện tại của người chơi
   }
   ```

3. **Kit từ dữ liệu game:**
   - `kitFromPlayer()`: sinh `skills` từ cổ người chơi đang có (`S.gu`), ánh xạ id cổ sang định nghĩa chiêu E, ví dụ `nguyetquang` / `nguyetmang` thành Nguyệt Mang, `bachngoc` thành Bạch Ngọc.
   - `kitFromFoe(k)`: dùng `EN[k].hp*DIFF.hp` cho máu và `EN[k].atk` cho sát thương, sprite lấy theo bảng ánh xạ khóa `EN` sang id `chibi_kp` (ví dụ `bai` thành `bach_ngung_bang_nam`, `heorung` thành `heo_rung`).
   - Cổ hoặc địch nào chưa có định nghĩa E thì trận đó dùng chế độ cũ.
4. **Hiển thị:** trong `js/battle.js`, `renderCombat()` và `Arena.mount()`, khi `S.combat.e` tồn tại:
   - Giữ nền và thời tiết của Arena.
   - Thay phần dựng `P` / `E` bằng `SBView.mount` (đổi `mount` để nhận container của Arena thay vì tự tạo `PIXI.Application`).
   - Thay `#skillbar` bằng `SBHud`.
5. **Vòng chính:** chuyển nguyên khối `frame()` trong `battle_sandbox.html` vào một hàm `eLoop()`. Gọi hàm này bằng `requestAnimationFrame` khi đang có trận E, dừng khi rời trận (`Scene.stop`).
6. **Kết trận:** khi `B.over`, đợi 1,2 giây để clip gục / thắng diễn xong, rồi:
   - Gán `S.hp = B.actors.pn.hp`; với địch đặt `S.combat.hp = 0` (thắng) hoặc giữ nguyên (thua).
   - Thắng thì gọi `win()`; thua thì gọi `die(S.combat.n)`. Cả hai hàm đều có trong `engine.js`.
   - Bỏ chạy: thêm lệnh "Bỏ chạy" vào kit, khi thành công gọi `fleeSuccess(S.combat)`.
7. **Lưu:** trận E không lưu giữa chừng. Tải lại trang giữa trận thì bắt đầu lại trận, giống chế độ realtime hiện tại.
8. **Cân bằng:** chạy `tools/sandbox_sim.cjs` kiểu máy đấu máy với kit thật, giữ mục tiêu bot thắng Q1 40–45% (`tools/sim.cjs` cần một nhánh cho fightMode `e`).

## Lưu ý kỹ thuật

- `~/package.json` khai báo `"type":"module"`, nên Node coi file `.js` là ES module. Các script node phải là `.cjs` và nạp file sandbox như `tools/sandbox_sim.cjs` đang làm.
- `KPSprite` và `loadKP` trong `battle.js` đang trùng chức năng. Khi tích hợp, xóa bản trong `battle.js` và nạp `js/kp_sprite.js` trước nó.
- Sprite thiếu clip thì `pick()` tự lấy idle, không lỗi.

## Review và sửa lỗi của Blue-chan — 02/10/2026

**Phạm vi:** chạy sandbox E trong Chrome headless với PIXI thật ở desktop 1280×900 và mobile 390×844; kiểm tra thêm battle chiến thuật đang dùng trong campaign. E vẫn là sandbox, chưa phải chế độ campaign.

### Lỗi đã tái hiện và sửa

| Lỗi | Trước | Sau |
|---|---|---|
| Kết quả trận bị đổi sau đòn kết liễu | Hai bên cùng chảy máu có thể khiến cả hai còn 0 HP, người đã gục lại được ghi là thắng; đạn còn bay cũng có thể đánh tiếp | Chốt kết quả đầu tiên theo thứ tự xử lý simulation; xóa đạn/vùng chờ, ngừng sát thương và AI. Chỉ tiếp tục thời gian clip gục / kết thúc chiêu / thắng |
| Tham số URL không hợp lệ | `?lvl=invalid&spd=0` gây lỗi đọc `dmgK`; tốc độ 0 có thể làm trận đứng | Level sai dùng Thường; tốc độ chỉ nhận 0,75 / 0,85 / 1, còn lại dùng 0,85 |
| Idle bỏ qua metadata | Đổi frame cứng mỗi 0,75 giây | Dùng `KPSprite.frameAt` và duration của clip |
| Bóng lướt phụ thuộc FPS | Mỗi lần render trừ alpha 0,03: màn hình nhanh làm bóng biến mất nhanh hơn | Alpha tính từ tuổi bóng trong simulation, hết sau 0,3 giây trận |

Thêm `tools/sandbox_regression.cjs`: kiểm tra hai DOT cùng tới hạn, đạn còn bay khi kết liễu, người thắng diễn hết chiêu, lệnh sai không mất tài nguyên và hồi máu bị ngắt vẫn mất lá. Chạy bằng `node tools/sandbox_regression.cjs`.

### Kết quả kiểm thử

- Sandbox nạp được hai actor, tám ô kỹ năng; chuột phải nhận điểm đến, S dừng, Q trừ đúng chi phí và bắt đầu hồi chiêu. URL không hợp lệ không còn gây lỗi JavaScript.
- Hộ thể Bạch Ngọc kích hoạt; Sinh Mệnh Diệp hồi từ 100 lên 150 HP và giảm từ hai còn một lá. Kết trận hiện “Thắng”, PN chuyển `win`, BNB chuyển `ko`, không có lỗi JavaScript trong lượt kiểm thử.
- Mobile 390 px không tràn ngang. Đây là kiểm tra bố cục; điều khiển đi/nhắm vẫn dựa vào chuột và bàn phím, chưa có bộ điều khiển cảm ứng hoàn chỉnh.
- Campaign chiến thuật qua kiểm tra lệnh sai không mất lượt, Thủ thế, chi phí cổ, hồi chân nguyên một lần mỗi vòng, hấp thu thạch, cửa sổ sơ hở và tải lại save giữa lúc resolving. Kiểm tra này tắt PIXI để tập trung vào HUD và resolver; phần PIXI thật được thử riêng ở sandbox.
- Kiểm tra dữ liệu, hồi quy engine và story đều đạt. Benchmark 300 trận mức Thường sau sửa: bot PN thắng 73,7%, thời gian trung bình 20,4 giây. Đây là một lượt đo ngẫu nhiên, không phải tỷ lệ thắng của người thật hay mục tiêu cân bằng đã chốt.

### Review hình ảnh và việc còn lại

1. **Đủ dùng để thử cơ chế:** nhân vật rõ, thanh kỹ năng có phím và chi phí, vòng báo trước giúp nhận diện chiêu lớn. Key-pose vẫn là chuyển pose rời; chưa giải quyết yêu cầu chạy liên tục bằng frame trung gian.
2. **Nền:** review ban đầu ghi nền núi tuyết thiếu mặt sàn; đã thay bằng nền rừng trúc người dùng cung cấp trong lượt sau. Xem bàn giao nền mẫu bên dưới và `KE_HOACH_MAP_BATTLE_PIXEL.md`; còn duyệt các biên/KO/thú lớn trước khi chốt toàn bộ.
3. **Thiếu clip riêng:** nhiều chiêu dùng `guard` / `heavy` / `cast` dự phòng, vì vậy chiêu khác nhau vẫn có thể dùng cùng dáng. Chỉ gen các clip đặc trưng đã đối chiếu kit; không nhân rộng dáng chưởng chung.
4. **Mobile:** đã thêm chạm đất để đi / chạm địch để đánh (xem bàn giao dưới). Canvas vẫn thu nhỏ cả nhân vật và vùng né; chưa có thao tác nhắm chiêu tự do hoặc nút dừng riêng cho cảm ứng.
5. **Cân bằng cần người chơi thật:** giữ nguyên thông số trong lượt sửa này. Đo lại nhiều seed và chơi thử trước khi chốt độ khó; sandbox chưa nối tài nguyên, phần thưởng và vòng đời save campaign.

## Bàn giao Orange-kun: sửa battle và bổ sung cảm ứng

Blue-chan đã sửa trực tiếp các file dưới đây, chưa commit/push. Các thay đổi áp dụng cho **sandbox E**, không tự nối E vào campaign và không đổi bộ chiêu / thông số cân bằng.

**Bổ sung preview VFX/audio:** theo yêu cầu dùng ngay kế hoạch hiệu ứng, Blue-chan đã thay mẫu Đánh tay / Nguyệt Mang / Băng nhận trong `view.js`, bổ sung damage source/contact trong `sim.js`, thêm `js/sandbox/audio.js` và điều khiển âm trong trang sandbox. Chi tiết phạm vi và test ở [kế hoạch VFX, mục “Mẫu đang chạy để duyệt”](KE_HOACH_VFX_AM_THANH_BATTLE_E.md#mẫu-đang-chạy-để-duyệt). Các chiêu còn lại giữ hiệu ứng cũ và âm fallback; đây chưa phải bộ VFX/audio cuối cùng.

**Bổ sung nền rừng trúc:** sandbox đã dùng ảnh người dùng gửi (2048×1152), tải metadata ở `assets/battle_maps/q1_bamboo_clearing/map.json`, cover/crop giữa vào 960×430, không phủ tối mạnh. Input nay nhận đi chỉ trong đủ bốn biên sàn, bỏ mép đệm 30 px cũ. Xem [bàn giao nền mẫu cho Orange-kun](KE_HOACH_MAP_BATTLE_PIXEL.md#bàn-giao-orange-kun--nền-mẫu-đã-áp-vào-sandbox) để review crop, fallback và phạm vi còn mở. Campaign vẫn chưa đổi nền.

| File | Thay đổi cần giữ khi tích hợp |
|---|---|
| `js/sandbox/sim.js` | Chốt kết quả đầu tiên, ngừng sát thương/AI sau kết trận, xóa đạn và vùng chờ; tiếp tục thời gian để clip kết thúc. Chi tiết lỗi và test ở phần review phía trên |
| `js/sandbox/view.js` | Idle dùng timing manifest; alpha bóng lướt tính theo thời gian simulation thay vì số lần render |
| `battle_sandbox.html` | Kiểm tra level/speed từ URL; bổ sung hướng dẫn chạm; `touch-action:none` chỉ trên canvas |
| `js/sandbox/input.js` | Dùng Pointer Events thay bộ Mouse Events của canvas để nhận cả chuột và cảm ứng, tránh một tap phát hai lệnh |
| `tools/sandbox_regression.cjs` | Hồi quy logic kết trận và chi phí chiêu; chạy bằng Node, không cần trình duyệt |

### Hành vi cảm ứng

1. **Chạm mặt đất:** phát lệnh `move` tới tọa độ được `SBView.toWorld()` quy đổi từ canvas. Simulation vẫn clamp điểm tới biên sân và dùng bộ đệm 0,25 giây nếu đang ra chiêu. Chạm điểm mới sẽ đổi đích đến khi có thể nhận lệnh.
2. **Chạm Bạch Ngưng Băng:** kiểm tra vùng nhân vật trước vùng đất, phát `atk`; ngoài tầm thì đuổi tới rồi đánh. Không phát thêm `move` từ cùng lần chạm.
3. **Chạm vùng trời ngoài vùng điều khiển:** không di chuyển. Vùng nhận đất dùng quy tắc có sẵn của `toWorld` (bao gồm mép đệm 30 px phía trên vạch đất).
4. **Chạm ô kỹ năng:** giữ cách dùng nút hiện tại, nhắm theo vị trí địch. Nút Lướt vì vậy cũng hướng về địch; chưa có cơ chế chạm để chọn hướng lướt hoặc điểm ngắm riêng.
5. Nhận lệnh ngay ở `pointerdown`, không yêu cầu giữ/kéo. Chỉ nhận pointer chính; ngón phụ không ra lệnh. Bút cảm ứng dùng cùng cách chạm.
6. `touch-action:none` trên canvas ngăn thao tác chạm bị biến thành cuộn/zoom trang trong sân. Khu vực bên ngoài canvas vẫn cuộn bình thường. Sau kết trận không nhận lệnh mới.

### Ảnh hưởng tới máy tính

- Chuột trái vào đất vẫn không di chuyển; chuột phải vào đất vẫn đi.
- Chuột trái/phải vào địch vẫn đuổi đánh. Phím Q/W/E/R/D, Space, 1 và S giữ nguyên.
- Rê chuột vẫn cập nhật điểm nhắm; bấm nút kỹ năng vẫn nhắm địch.
- Không gắn đồng thời `mousedown` và `pointerdown` cho cùng hành động, nên không bị lệnh chuột tổng hợp từ cảm ứng chạy lặp.
- Đây là hỗ trợ theo loại pointer, không dựa vào độ rộng màn hình: máy tính có màn hình cảm ứng nhận cả hai kiểu thao tác.

### Checklist cho Orange-kun

- Kiểm thử bổ sung đã qua: Chrome giả lập cảm ứng 390×844 nhận chạm đất/địch/nút chiêu, bỏ qua chạm trời; mỗi tap chỉ phát một lệnh. Phiên desktop 1280×900 kiểm tra chuột trái đất không đi, chuột phải đất đi, chuột trái địch đánh, phím Q dùng chiêu. Hồi quy simulation và `git diff --check` đều đạt.
- Đọc phần “Review và sửa lỗi của Blue-chan” cùng bảng thay đổi trên trước khi merge/tích hợp; không dùng lại bản simulation xử lý sát thương sau `B.over`.
- Khi nối vào Arena chính, mang theo `touch-action:none` cho canvas và bộ Pointer Events. E chưa được nối vào `index.html`; không coi cảm ứng sandbox là đã hỗ trợ mọi chế độ battle.
- Kiểm tra thực tế trên Safari iPhone / Chrome Android. Blue-chan kiểm tra bằng Chrome headless giả lập cảm ứng; chưa kiểm tra thiết bị thật.
- Muốn mobile đầy đủ hơn, làm tiếp nút Dừng và chọn điểm/hướng dùng chiêu; tách thao tác đó khỏi chạm đi để tránh vô tình di chuyển khi nhắm.
