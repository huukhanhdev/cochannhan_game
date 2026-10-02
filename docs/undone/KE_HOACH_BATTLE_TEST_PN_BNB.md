# Kế hoạch: battle thử Phương Nguyên (người chơi) đấu Bạch Ngưng Băng (máy)

Ngày 02/10/2026.

- **Mục tiêu:** một trang sandbox riêng chơi được trọn một trận theo cơ chế E: đấu trường 2.5D, bảng lệnh WASD + Z, có hồi chiêu. Dùng sprite key-pose đã có.
- **Ngoài phạm vi:** campaign. Trận này không ghi save, không cộng thưởng.

Thiết kế gốc dựa trên [11_E_CLICKMOVE_FULL_PN_BNB.md](big-update-q1-q2/battle-options/11_E_CLICKMOVE_FULL_PN_BNB.md) và [12_E_MENU_WASD_Z_COOLDOWN.md](big-update-q1-q2/battle-options/12_E_MENU_WASD_Z_COOLDOWN.md). Kế hoạch này rút gọn hai tài liệu đó cho vừa bộ asset hiện có.

## 0. Asset đã sẵn sàng

| Nhân vật | Thư mục | Động tác |
|---|---|---|
| Phương Nguyên | `assets/chibi_kp/phuong_nguyen/` | idle, move, attack, cast, heavy, guard, heal, hit, dodge, ko, win |
| Bạch Ngưng Băng (nam, Q1) | `assets/chibi_kp/bach_ngung_bang_nam/` | Như trên. Đã nhập hôm nay; ảnh gục ngã (ko) chồng tư thế đã được tách lại đúng 3 tư thế |

**Không có:** run, choáng (stun), ngã/đứng dậy, vận công (channel). Bản thử **không bật** các cơ chế cần những clip này. Di chuyển dùng tư thế lướt, game tự trượt hình kèm bóng mờ và bụi.

## 1. Cảm giác trận đấu

- Đấu trường nhìn ngang, có chiều sâu: đi trái/phải và lên/xuống trên mặt đất. Nhân vật ở gần màn hình vẽ đè lên nhân vật ở xa. Sprite tự lật theo hướng mặt.
- **Bảng lệnh luôn hiện dưới đấu trường.**
  - WASD (hoặc phím mũi tên) chọn ô, Z xác nhận, X quay lại hoặc cho trận chạy tiếp, Tab đổi trang.
  - **Khi đang chọn lệnh, thời gian dừng hẳn.** Địch, đạn bay, hồi chiêu, chân nguyên đều đứng yên.
  - Chốt lệnh xong thì trận chạy tiếp tới khi Phương Nguyên làm xong động tác.
  - Thiết kế này nhằm tránh lỗi cũ "realtime quá nhanh, khó làm quen".
- Mỗi chiêu có ba nhịp:
  - **Lấy đà:** frame 1 của clip, địch nhìn thấy để né.
  - **Phát đòn:** frame `release`, đúng lúc này mới sinh đạn hoặc vùng sát thương.
  - **Thu chiêu:** frame cuối, chưa ra lệnh tiếp được.

  Chân nguyên và hồi chiêu bị trừ ngay khi chốt lệnh. Bị đánh gián đoạn vẫn mất.
- Trúng hay trượt tính theo vị trí thật: đạn bay theo đường thẳng, đòn cận chiến có vùng đánh hình cung. Né bằng cách di chuyển hoặc lướt ra khỏi vùng.

## 2. Bộ chiêu

Số liệu ban đầu là giả thuyết, sẽ chỉnh sau khi chơi thử. Thời gian tính bằng giây của trận; khi dừng chọn lệnh thì không trôi.

### Phương Nguyên (người chơi)

HP 220. Chân nguyên 100, hồi 0,4/giây.

| Ô | Lệnh | Clip | Lấy đà / thu chiêu | Hồi chiêu | Chân nguyên | Tác dụng |
|---|---|---|---|---|---|---|
| 1 | Di chuyển | move | Không có | Không | 0 | Chọn điểm trên mặt đất, trượt tới |
| 2 | Đánh tay | attack | 0,18 / 0,25 | Không | 0 | Cận chiến, tầm 70, 12 sát thương |
| 3 | Lướt | dodge | 0,25 / 0,15 | 2,5 (chung với Lùi bước) | 0 | Lao 180 theo hướng chọn, **không bất tử** |
| 4 | Lùi bước | dodge | 0,20 / 0,20 | Chung với Lướt | 0 | Nhảy lùi 120 |
| 5 | Nguyệt Mang | cast | 0,35 / 0,35 | 3 | 5 | Trăng lưỡi liềm bay thẳng theo hướng ngắm, 26 sát thương, xuyên hộ thể một phần |
| 6 | Bạch Ngọc | guard | 0,30 / 0,25 | 10 | 10 | Giảm 50% sát thương trong 3 giây |
| 7 | Cự Xỉ Kim Ngô | heavy | 0,45 / 0,50 | 5 | 7 | Quét cung trước mặt, tầm 110, 40 sát thương, chảy máu |
| 8 | Thiên Bồng | guard | 0,50 / 0,35 | 14 | 14 | Giáp ánh sáng 5 giây. Thay thế Bạch Ngọc, không cộng dồn |
| 9 | Sinh Mệnh Diệp | heal | 0,65 / 0,35 | 8 | 1 lá (có 2 lá) | Hồi 50 HP. Bị đánh gián đoạn vẫn mất lá |

Cường Thủ (bắt giữ) cần clip choáng cho đối thủ, nên **để bản sau**.

### Bạch Ngưng Băng (máy điều khiển)

HP 260. Chân nguyên 100, hồi 0,5/giây.

| Lệnh | Clip | Lấy đà / thu chiêu | Hồi chiêu | Chân nguyên | Tác dụng |
|---|---|---|---|---|---|
| Di chuyển / lướt / đánh tay | move / dodge / attack | Như Phương Nguyên | | | |
| Băng Đao | attack hoặc heavy | 0,30 / 0,35 | 2,5 | 4 | Chém cận, tầm 90, 22 sát thương, làm chậm 30% trong 1,5 giây |
| Băng Trùy | cast | 0,50 / 0,40 | 4 | 6 | Mũi băng bay thẳng, 24 sát thương |
| Thủy Tráo | guard | 0,35 / 0,30 | 10 | 10 | Giảm 40% sát thương trong 3 giây |
| Lốc băng nhận | heavy | **1,20** / 0,70 | 16 | 18 | Vùng tròn bán kính 130 quanh mục tiêu, **báo trước bằng vòng đỏ trên đất**, 55 sát thương |

Không có tự bạo, không có Bắc Minh Băng Phách. Đây là trận thử, không phải trận theo cốt truyện.

## 3. Máy điều khiển Bạch Ngưng Băng

Tính cách theo nguyên tác: kiêu ngạo, thích đánh gần, coi đối thủ như đồ chơi. AI đơn giản nhưng phải đọc được:

1. **Nhịp suy nghĩ:** khoảng 0,4 giây một lần, sai số ngẫu nhiên nhỏ. Không phản xạ khung hình như máy.
2. **Thứ tự ưu tiên mỗi lần nghĩ:**
   1. Đang lấy đà hoặc thu chiêu thì không làm gì.
   2. HP dưới 40% và Thủy Tráo sẵn sàng thì dùng Thủy Tráo.
   3. Phương Nguyên đang lấy đà Nguyệt Mang và nhắm trúng mình: 50% lướt ngang. Phản ứng trễ 0,25 giây.
   4. Lốc băng nhận sẵn sàng, khoảng cách dưới 300, và lần cuối dùng đã quá 8 giây: dùng.
   5. Khoảng cách dưới 90: Băng Đao, nếu hồi rồi thì đánh tay.
   6. Khoảng cách 90–350: 60% áp sát, 40% Băng Trùy.
   7. Còn lại: di chuyển lại gần, có lệch ngang để không đi thẳng một đường.
3. **Ba mức khó**, chỉnh qua: nhịp suy nghĩ, tỷ lệ né, hệ số sát thương.
   - Mặc định là **Thường**.
   - Mục tiêu: người chơi mới thắng khoảng 40–45% ở mức Thường, giống mục tiêu tỷ lệ thắng của Q1.
4. Ý đồ của máy hiện trên đầu Bạch Ngưng Băng bằng biểu tượng nhỏ (⚔ đánh gần, ❄ phóng, 🛡 thủ, ⚠ chiêu lớn). Người chơi đọc được mà không cần bảng log.

## 4. Kiến trúc code

Một trang riêng `battle_sandbox.html`, không đụng campaign:

```
js/sandbox/
  sim.js      vòng lặp bước cố định 1/60 giây, đồng hồ trận, dừng/chạy; trạng thái
              nhân vật, chiêu, hồi chiêu, chân nguyên, đạn, vùng sát thương, sự kiện
              trúng đòn (mỗi đòn có id, chỉ trúng một lần)
  kits.js     bảng chiêu ở mục 2 (dữ liệu, không lẫn logic)
  ai.js       máy điều khiển Bạch Ngưng Băng (mục 3)
  input.js    máy trạng thái: CHẠY → BẢNG LỆNH → CHỌN MỤC TIÊU → CHỐT
  view.js     PIXI: nền, sprite key-pose (tái dùng loadKP/kpPlay từ battle.js, tách
              thành module dùng chung), bóng mờ, đạn, vòng báo trước, số sát thương
  hud.js      HP / chân nguyên, bảng lệnh 2 hàng × 6 cột, ô đang chọn, hồi chiêu dạng
              quạt tròn kèm số giây, lý do không dùng được
```

**Simulation không phụ thuộc hình ảnh.** Tách vậy để chạy được trận máy đấu máy bằng node, đo tỷ lệ thắng giống `tools/sim.cjs`. Hình ảnh chỉ nghe sự kiện từ simulation để phát clip.

Tái dùng từ code hiện có:

- PIXI 7 (đã nạp trong `index.html`).
- Hàm nạp sheet và phát clip `loadKP` / `kpPlay` / `kpFlash`: tách từ `js/battle.js` ra `js/kp_sprite.js`, sau đó cả battle chính lẫn sandbox cùng dùng.
- Ảnh nền đấu trường có sẵn trong `assets/art/` (Rừng trúc Thanh Mao hoặc tuyết).

## 5. Các bước thực hiện

Mỗi bước có một bản xem được ngay.

| Bước | Nội dung | Xem / kiểm tra |
|---|---|---|
| **S1. Đấu trường + di chuyển** | Trang sandbox, nền, hai sprite đứng chờ, sắp xếp theo chiều sâu, lật hướng. Bảng lệnh: WASD chọn ô, Z chốt. Lệnh Di chuyển chọn điểm trên mặt đất bằng WASD, hoặc chuột phải làm đường tắt | Đi khắp sân, sprite không trượt chân, dừng chọn lệnh thì mọi thứ đứng yên |
| **S2. Đánh tay + trúng đòn** | Simulation lấy đà / phát đòn / thu chiêu, vùng đánh cận chiến, sự kiện trúng có id, clip hit và nháy, số sát thương, HP | Một cú đánh trừ HP đúng một lần; đánh hụt khi đứng xa |
| **S3. Chiêu Phương Nguyên** | Chân nguyên, hồi chiêu, Nguyệt Mang (đạn), Bạch Ngọc / Thiên Bồng (thay thế nhau), Cự Xỉ Kim Ngô (cung), Lướt / Lùi bước, Sinh Mệnh Diệp | Thiếu chân nguyên hoặc đang hồi thì báo đúng lý do, không mất gì |
| **S4. Bạch Ngưng Băng có máy điều khiển** | Bộ chiêu ở mục 2, AI ở mục 3, biểu tượng ý đồ, vòng báo trước Lốc băng nhận | Đánh thắng / thua trọn trận; né được Lốc băng nhận nếu để ý |
| **S5. Kết trận + chỉnh số** | Thắng: Phương Nguyên tư thế win, Bạch Ngưng Băng ko và giữ nguyên. Thua thì ngược lại. Nút đấu lại, chọn độ khó. Script node cho máy đấu máy 300 trận để chỉnh số | Tỷ lệ thắng ở mức Thường nằm trong khoảng mục tiêu |
| **S6. Hoàn thiện** | Đổi phím, chạm trên điện thoại (chạm ô → chạm mục tiêu → nút xác nhận), giảm hiệu ứng, âm thanh có sẵn | Chơi trọn trận chỉ bằng bàn phím, và chỉ bằng chạm |

Sau mỗi bước, tôi kiểm tra bằng Chrome headless (chụp ảnh từng nhịp như đã làm với trang xem thử), rồi mới đưa bạn chơi thử.

## 6. Tiêu chí đạt của bản thử

- Chơi trọn một trận chỉ bằng bàn phím mà không cần đọc hướng dẫn quá 1 phút.
- Không bị trúng đòn **trong lúc đang chọn lệnh**.
- Mỗi chiêu trừ máu đúng một lần, đúng frame phát đòn.
- Phân biệt được ô "đang hồi" và ô "thiếu chân nguyên".
- Lốc băng nhận luôn có vòng báo trước. Lướt ra kịp thì không trúng.
- Hai bộ chiêu có nhịp khác nhau: Phương Nguyên đánh xa và tính toán, Bạch Ngưng Băng áp sát và bùng nổ.
- Gục ngã không tự quay về đứng chờ. Thắng thì giữ tư thế win.

## 7. Cần bạn chốt

1. **Dừng thời gian khi mở bảng lệnh** (theo tài liệu 12_E). Tôi đề nghị bật mặc định, kèm một nút tắt để thử kiểu chọn lệnh trong lúc trận vẫn chạy.
2. **Chuột phải để di chuyển nhanh:** có thêm, hay chỉ dùng bàn phím?
3. **Thứ tự làm:** tôi đề nghị S1 → S2 trước rồi gửi bạn chơi thử cảm giác điều khiển, sau đó mới làm chiêu và AI.
4. **Chỗ đặt sandbox:** trang riêng `battle_sandbox.html` (đề nghị), hay thêm một nút "Đấu thử" trong menu game?
