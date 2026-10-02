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
2. **Frame chọn theo thời gian trận** (`SBView.pick`), không dùng AnimatedSprite tự chạy. Nhờ vậy khi dừng chọn lệnh, hình dừng đúng pha.
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
