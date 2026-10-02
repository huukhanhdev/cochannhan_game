# Ý kiến về hiện trạng pixel animation và battle

Ngày 02/10/2026. Phản hồi cho [HIEN_TRANG_PIXEL_ANIMATION_BATTLE.md](HIEN_TRANG_PIXEL_ANIMATION_BATTLE.md). Tôi đã đọc báo cáo, các tài liệu battle (11_SO_SANH, 12_E, DOCUMENT_MAP) và kiểm tra code. Tôi đã đo trực tiếp 1.824 frame trong `assets/chibi_anim/`. Chưa chạy browser, chưa sửa code.

## 1. Tóm tắt

1. Báo cáo hiện trạng trung thực và đúng phần lớn. Tôi đồng ý các nguyên tắc chính:
   - Engine tính damage, animator chỉ diễn.
   - Không bật `loop:true` hàng loạt.
   - Không chạy importer cũ.
   - Không tạo toàn roster khi Phương Nguyên chưa đạt.
2. Báo cáo còn **đánh giá kho 228 clip lạc quan hơn thực tế**. Theo số đo ở mục 2, gần như không clip nào dùng được làm animation sản xuất. Nên coi cả kho là **ảnh tham chiếu và tư thế nghỉ**, không phải "đã có, chỉ chờ duyệt".
3. Nguyên nhân gốc: các yêu cầu đang đặt ra mâu thuẫn nhau. Mô hình tạo ảnh không giữ được nhân vật đồng nhất qua 8 frame liên tục. Hiện chưa có công cụ miễn phí, tự động, nhẹ máy nào làm được việc đó. **Phải nới một trong ba điều kiện**, xem mục 3.
4. Về battle, **nên bỏ hẳn hướng E (2.5D WASD / click-move)** khỏi lộ trình gần. Hướng này đòi run loop, đúng loại asset khó nhất và đã thất bại 5 lần. Chọn battle theo lượt chiến thuật (`tactical_battle.js` đã có), vì chỉ cần idle, ra chiêu, trúng đòn và gục.
5. Tài liệu đang phình to và có nhiều hướng chồng chéo, xem mục 6.

## 2. Số đo thực tế kho `assets/chibi_anim/`

Đo bằng script trên toàn bộ 38 nhân vật × 6 action. "Thay đổi viền" là tỷ lệ pixel có alpha khác so với frame 1, lấy giá trị lớn nhất trong clip.

| Action | Thay đổi viền (trung vị) | Thấp nhất | Nhận xét |
|---|---|---|---|
| idle | **40%** | 15% | Idle tốt chỉ nên khoảng 3–10%. 40% nghĩa là mỗi frame bị vẽ lại từ đầu, hình sẽ rung và nhòe (boiling) |
| run | 64% | 30% | |
| attack | 59% | 22% | |
| hit | 56% | 28% | |

Độ trôi trong clip idle, trên canvas 256px:

- **Chân lệch trung vị 12px**, đỉnh đầu lệch 13px.
- Heo rừng lệch tới 51px, Nhất Đại boss 39px.

Chân trượt 12px khi đứng yên sẽ thấy rõ ngay trong trận.

Xem tận mắt contact sheet của Phương Nguyên (idle/run/attack/hit, 8 frame mỗi hàng):

- **run, attack và hit gần như giống hệt idle.**
- Run không có pha co gối hay bước chân.
- Attack không có vung tay hay động tác ra đòn.
- Hit không có giật lùi.

Thực chất đây là 4 clip idle bị rung. Số thay đổi viền cao không đến từ chuyển động có chủ đích. Nó đến từ chi tiết tóc và áo bị vẽ lại khác nhau ở mỗi frame.

**Kết luận:** mốc A (Audit) trong báo cáo gần như đã có đáp án: hầu hết clip bị loại. Không cần mất công duyệt tay 228 clip. Chỉ cần giữ `base_side.png` và frame 1 của mỗi nhân vật làm **tư thế nghỉ chuẩn**, vì tạo hình và màu đều đã đúng.

## 3. Phải nới điều kiện nào: ba lựa chọn

Yêu cầu hiện tại gồm bốn điều cùng lúc: frame animation thật, tự động, miễn phí, nhẹ máy, và chuyển động liên tục 8 frame. Năm lần thử đã chứng minh tổ hợp này chưa đạt được. Tôi đề xuất chọn **một** trong ba hướng sau.

### Hướng 1 (tôi khuyên): Key-pose, ít frame nhưng tư thế mạnh

Đây vẫn là frame animation, không phải puppet. Mỗi action chỉ cần **2–4 tư thế khác biệt rõ**, mỗi tư thế giữ lâu hơn. Nhiều game nhập vai theo lượt dùng cách này.

| Action | Frame | Nội dung |
|---|---|---|
| idle | 2 | Tư thế nghỉ, thêm 1 frame hít vào (lệch 1–2px). Có thể làm bằng cách dịch phần thân trên của chính tư thế nghỉ |
| attack | 3 | Lấy đà, ra đòn (có vệt chém/smear), thu chiêu |
| cast (dùng cổ) | 2 | Giơ tay tụ lực, phóng. Hiệu ứng cổ do VFX của game vẽ, không nằm trong frame |
| hit | 1 | Ngửa người ra sau, kết hợp nháy trắng và rung có sẵn trong code |
| ko | 1 | Quỵ hoặc ngã |

Vì sao hướng này hợp với công cụ AI hiện có:

- Mô hình tạo ảnh vẽ **từng tư thế riêng lẻ** tốt. Nó chỉ thất bại khi phải nối 8 frame liền mạch.
- Giữa hai tư thế cách xa nhau, mắt người chấp nhận "nhảy hình", nhất là khi có hiệu ứng che. Lỗi tay/chân nhảy pose (V01–V03) lúc đó không còn là lỗi.
- Tổng cộng khoảng 9 frame cho mỗi nhân vật. Mỗi frame có thể tạo, chọn và căn chân thủ công. Căn chân thì làm được tự động: đặt chân chạm pivot `[128,224]`. **Không căn theo bbox.**
- Không cần run. Trận theo lượt chỉ cần trượt nhẹ về phía đối thủ, kèm frame lấy đà.

### Hướng 2: Trả phí PixelLab có giới hạn

Công cụ này sinh animation theo bộ khung xương và giữ nhân vật đồng nhất. Mẫu người dùng thấy là đạt chất lượng.

- Chỉ đăng ký **1 tháng**.
- Chỉ làm Phương Nguyên, Bạch Ngưng Băng và 3–4 boss Q1 (Điện Lang, Hùng Lâm, Thiết Huyết Lãnh, Nhất Đại).
- Kích thước gốc nên là **64–128px**, không dùng 256px.

Kiểm giá và điều khoản trên trang của họ trước khi mua. Tôi chưa xác minh giá.

### Hướng 3: Giảm độ phân giải, tự sửa tay

256px thực chất là tranh minh họa bị thu nhỏ, không phải pixel art, nên sửa tay rất tốn công. Nếu chuyển về **96px gốc**, có thể dùng LibreSprite (miễn phí) sửa từng frame khi tạo hình bị trôi. Tốn công người, nhưng kiểm soát được 100%.

Hướng này chỉ hợp nếu bạn hoặc người thân thích tự vẽ.

**Nên dừng ngay:** mọi lượt tạo ảnh 8 frame run liên tục, kể cả với prompt mới. Báo cáo đã kết luận đúng như vậy, tôi xác nhận lại.

## 4. Battle: chọn hướng nào

Hiện game có **3 chế độ chiến đấu song song**:

- Theo lượt gốc.
- Realtime (`rt.js`).
- Tactical (`tactical_battle.js`, đã có thanh dự báo ý đồ địch).

Các tài liệu đề xuất thêm 5 phương án A–E. Riêng E đã có 3 bản chi tiết (08, 11, 12). Như vậy quá nhiều.

Đề xuất:

1. **Chính thức: tactical theo lượt (phương án A).**
   - Đã có code.
   - Hợp với người chơi mới; đã có phản hồi cũ chê realtime quá nhanh.
   - Hợp với Hướng 1 về asset.
   - Thể hiện đúng tinh thần Cổ Chân Nhân: tính chân nguyên, đọc ý đồ địch.
2. **Giữ realtime làm tùy chọn** như hiện tại, không đầu tư thêm.
3. **Đưa E (WASD, click-move, bảng lệnh Z) vào lưu trữ.** Tài liệu 12_E viết rất kỹ (state machine, startup/active/recovery), nhưng cần run loop, AI không gian và hitbox. Đó là khối lượng của cả một game khác. Chỉ mở lại khi Q1–Q2 đã hoàn chỉnh và có asset di chuyển đạt chuẩn.
4. Mỗi lần đổi luật battle phải chạy lại sim để tỷ lệ bot thắng Q1 vẫn ở 40–45%. Ghi chú trong `tactical_battle.js` cho thấy đã có ý thức điều này (+4/+6 chân nguyên làm tỷ lệ thắng tăng gấp đôi).

## 5. Gợi ý kỹ thuật cho frame animator (mốc C–D)

- **Dùng `PIXI.AnimatedSprite`, không tự viết clock.**
  - PIXI 7.4.2 đã nạp sẵn, `battle.js:302` đã tạo `PIXI.Application`.
  - Mảng `textures` nhận `{texture, time}`, khớp với `durations_ms` trong manifest.
  - `onComplete` dùng cho clip one-shot quay về idle.
  - `onFrameChange` dùng cho marker `release` (thời điểm phát đòn).
  - Pause dùng `app.ticker.stop()`.
- **Cắt sheet thay vì nạp từng PNG.** Một clip ứng với một request. Chỉ nạp các nhân vật có trong trận.
- **Bổ sung schema tối thiểu** vào manifest mỗi action, mọi trường có giá trị mặc định:

  ```json
  "attack": { "frames": [...], "durations_ms": [...], "loop": false,
              "release": 1, "fallback": "idle" }
  ```

  `release` là chỉ số frame phát đòn. Engine giữ nguyên quyền tính damage. Animator nhận event `{id, actor, action}` và gọi `resolve` khi tới frame `release` hoặc khi hết thời gian chờ dự phòng (khoảng 600ms). Như vậy clip lỗi hoặc thiếu không làm treo lượt. Token `id` chặn event của trận cũ, đúng như báo cáo mục 5.3 đã nêu.
- **Fallback bắt buộc:** actor không có clip đạt thì dùng `makeLiving(...)` hiện tại. Game không bao giờ hỏng chỉ vì thiếu asset.
- **Dung lượng deploy:**
  - `assets/chibi_anim/` hiện nặng **191MB**: sheet 69MB, PNG lẻ 87MB, GIF 33MB.
  - Thư mục chưa được git theo dõi, nhưng cũng chưa có trong `.gitignore`. Rất dễ lỡ add toàn bộ lên GitHub Pages, khiến em bạn tải game rất chậm.
  - Đề xuất: chỉ commit sheet và manifest của các clip **đã duyệt**. PNG lẻ và GIF để ngoài repo hoặc thêm vào `.gitignore`. Nén sheet bằng pngquant, thường giảm 60–70%.
- **Importer** (`tools/import_battle_sprites.py`): đồng ý không dùng. Nếu làm theo Hướng 1, tôi viết script mới gồm ba bước:
  1. Chỉ nhận file theo tên chuẩn `<id>_<action>_<nn>.png`.
  2. Căn chân theo pivot.
  3. Ghép sheet, giữ nguyên alpha.

## 6. Về hệ thống tài liệu

Việc gom file vào `docs/` và có DOCUMENT_MAP là tốt. Nhưng `docs/` hiện khoảng **15.500 dòng**:

- BACKLOG_VA_BAN_GIAO_CU: 3.244 dòng.
- PROMPT_FULL_ANIMATIONS: 6.620 dòng.
- Nhiều hướng đã bỏ (puppet, Wan, E) vẫn nằm trong `undone/`, ngang hàng với việc đang làm thật.

AI hoặc người đọc sau rất dễ làm theo hướng cũ. Đề xuất:

1. Tạo `docs/archive/` và chuyển vào đó:
   - HUONG_DAN_DRAW_THINGS_ANIMATION, HUONG_DAN_CHIBI_PUPPET_ANIMATION.
   - Toàn bộ `battle-options/` của E, cùng 11_SO_SANH_BATTLE.
   - PROMPT_FULL_ANIMATIONS và PROMPT_FULL_BATTLE_CLICKMOVE.
2. Đặt **một file trạng thái duy nhất**, `docs/TRANG_THAI.md`, dưới 80 dòng, ghi:
   - Đang làm gì.
   - Hướng nào đã chốt.
   - Hướng nào đã bỏ và lý do một dòng.
   - Nguồn chuẩn canon (CHI_TIET_NGUYEN_TAC_Q1/Q2).
3. Sau khi chốt asset, viết lại `PROMPT_FULL_ANIMATIONS` theo key-pose 9 frame. Bản 8 frame × 6 action đã chứng minh không đạt.

## 7. Thứ tự tôi đề xuất (thay mục 7 của báo cáo)

| Bước | Việc | Xong khi |
|---|---|---|
| 1 | Chốt hướng asset (mục 3) và chốt battle tactical (mục 4) | Bạn chọn |
| 2 | Làm thử **chỉ Phương Nguyên** theo hướng đã chọn: idle 2, attack 3, cast 2, hit 1, ko 1 | Bạn duyệt bằng mắt trong sprite_demo |
| 3 | Viết frame animator bằng `PIXI.AnimatedSprite`, có schema `release/fallback` và fallback về `makeLiving` | Một trận PN đánh sói xám: mỗi chiêu đúng 1 hit, pause và thoát trận không lỗi |
| 4 | Thêm Bạch Ngưng Băng (nam) và Điện Lang | Trận tactical PN đối BNB chạy trọn vẹn |
| 5 | Nhân rộng cho boss Q1, rồi Q2; quái nhỏ dùng fallback | Mỗi actor có trạng thái duyệt ghi trong manifest |
| — | E / WASD / run | Lưu trữ, chưa làm |

Nếu bạn đồng ý Hướng 1 và battle tactical, tôi làm luôn bước 3 trước. Phần code không phụ thuộc asset: tạm dùng frame 1 hiện có làm tư thế nghỉ, kèm lấy đà/rung bằng code. Asset đạt chuẩn có thể thay vào sau mà không phải sửa code.
