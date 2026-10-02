# Thanh Mao Sơn Ký · Tổng quan game hiện tại

> **Phân loại 02/10/2026:** Tổng quan lịch sử; số liệu và đường dẫn trong nội dung có thể thuộc bản cũ.

*Cập nhật: 30/09/2026. Repo: `github.com/huukhanhdev/cochannhan_game`. Link chơi: https://claude.ai/artifact/JCxtbEtAKCESDM5jjCa6xM*

Game tu luyện theo lượt, bối cảnh *Cổ Chân Nhân* quyển một (Thanh Mao Sơn). Người chơi là Phương Nguyên vừa trùng sinh; chết thì Xuân Thu Thiền đưa về lễ khai khiếu, giữ lại ký ức.

**Nguyên tắc:**
- Cốt truyện được phép lệch nguyên tác, nhưng **cơ chế phải theo nguyên tác**. Không thêm cơ chế truyện không có, ví dụ phẩm chất cổ hạ/trung/thượng.
- **Mỗi kiếp phải khác nhau.**
- Đổi độ khó thì phải chạy `node tools/sim.cjs` để kiểm tra.

---

## 1. Chạy game

```bash
cd ~/cochannhan_game && python3 -m http.server 8000   # mở http://localhost:8000
node tools/sim.cjs 100 6                              # mô phỏng cân bằng: 100 chiến dịch × 6 kiếp
```
Phải chạy qua server. Mở thẳng file `index.html` thì WebGL sẽ chặn ảnh.

## 2. Cấu trúc mã

| File | Vai trò |
|---|---|
| `index.html` | Khung trang và toàn bộ CSS. Thứ tự nạp: PixiJS 7.4.2 (cdnjs) → `assets/local/manifest.js` → sound → data → events → battle → minigame → ui → aperture → engine |
| `js/data.js` | Hàm `asset()` (ưu tiên ảnh cá nhân), cảnh giới, 24 cổ trùng, kẻ địch, NPC, ký ức, công thức, sát chiêu, `DIFF`, `CD`, `EAI` (kiểu đánh của địch), `SK` (chiêu địch), `TRAITS` (mệnh cách), `INJURY`, `WORLD` (thiên cơ), `CACHE` (bí tàng), `GU_IMG`/`guEmblem` |
| `js/events.js` | `CANON` (lịch 20 mốc), `EV` (khoảng 60 sự kiện), `AFTER` (hậu quả sau trận), `ENDINGS` |
| `js/engine.js` | Vòng lặp theo tuần, hành động, sự kiện, tu luyện, chợ, luyện cổ, chiến đấu (`fight`/`playerAct`/`enemySkill`), trùng sinh, lưu trữ, xử lý click, khởi động |
| `js/battle.js` | Đấu trường PixiJS: nền tranh, chân dung, hạt, hiệu ứng đòn, thanh kỹ năng, phím 1–9, thông báo. `ART`/`PORTRAIT`/`BGIMG`/`EV_SCENE` |
| `js/minigame.js` | Minigame luyện cổ, mổ thạch, đột phá bích khiếu (trạng thái lưu ở `S.mg`) |
| `js/ui.js` | Thanh trạng thái, dòng thời gian, bảng nhân vật 4 tab, bản đồ, thẻ sự kiện, các bảng, màn mở đầu, mực loang khi chuyển cảnh, xuất/nhập save |
| `js/aperture.js` | Hình Không Khiếu Hải vẽ bằng canvas (bên kia viết) |
| `js/sound.js` | Âm thanh tổng hợp bằng Web Audio (bên kia viết) |
| `tools/sim.cjs` | Chạy engine thật trong Node với người chơi máy để đo độ khó |
| `scripts/fetch_*.cjs` | Script tải ảnh từ Pinterest/Bing (chỉ dùng cho ảnh cá nhân) |
| `thien_ngoai_chi_ma/` | Chế độ riêng "Thiên Ngoại Chi Ma" (bên kia làm), dùng chung `assets/` qua symlink |

Lưu trữ: `localStorage` với khóa `tms2-save` và `tms2-meta`. Biến toàn cục `S` là trạng thái kiếp hiện tại, `META` là dữ liệu mang qua các kiếp (ký ức, số kiếp, những lần chết, Cổ Đồ Giám, sát chiêu đã ngộ, sự kiện đã gặp).

## 3. Vòng chơi

- **27 tuần** (9 tháng × 3 tuần). Mỗi tuần một việc chính trên bản đồ: bế quan, học đường, sơn trại, núi Thanh Mao, hậu sơn (động Hoa Tửu), nhiệm vụ đường, chặn cổng (Ma đạo), tĩnh dưỡng. Việc phụ không tốn thời gian: chợ, lò luyện, hấp thu nguyên thạch.
- **Mỗi tuần:** chân nguyên hồi theo tư chất, nuôi cổ tốn thạch (đói 3 tuần thì cổ chết), trợ cấp tháng, hiềm nghi giảm dần.
- **Chỉ số:** Tâm cơ, Sát phạt, Ngộ tính (dùng để thử xúc xắc d20 + chỉ số), Đạo tâm (Chính ↔ Ma), Danh vọng, Hiềm nghi (lên 100 thì bị thẩm vấn), Tư chất (Bính đẳng 44%).
- **Cảnh giới:** Nhất đến Tam chuyển, mỗi chuyển 4 giai. Mỗi lần bế quan chỉ nạp nguyên thạch tới khi không khiếu đầy thêm một lần. Lên chuyển mới phải qua minigame xung kích bích khiếu.
- **Mục tiêu:** sống sót qua tuần 27 (Thanh Mao Sơn diệt vong).

## 4. Dòng thời gian nguyên tác (đã sửa theo thông tin bạn cung cấp)

| Tuần | Mốc | Ghi chú |
|---|---|---|
| 1 | Lễ khai khiếu | Nhận Nguyệt Quang Cổ |
| 3 | Đòi di sản từ cậu mợ | Biến thể: Mạc Trần chống lưng cho cậu |
| 4 | Chặn cổng học đường | Biến thể: Mạc Bắc chờ sẵn |
| 6 | Khảo hạch | |
| 8 | Trầm Thúy trở mặt theo Phương Chính | |
| 10 | Thương đội Giả gia đến | |
| 11 | Giả Kim Sinh ép mua Tửu Trùng → dụ ra bờ sông giết | Biến thể: đi một mình / có hộ vệ / chính hắn giăng bẫy |
| 13 | Giả Phú điều tra | |
| 15 | Thương đội rời đi | |
| 16 | Bạch gia lấn đất | Biến thể: phục kích |
| 17 | Gặp Bạch Ngưng Băng | Biến thể: tò mò / sát ý |
| 19–21 | Lang triều: bầy sói → Bạch Ngưng Băng phát cuồng, Thanh Thư dùng Mộc Mị Cổ chặn và hy sinh → Lôi Quan Lang Vương | Cứu được Thanh Thư thì cốt truyện rẽ nhánh |
| 22 | Sơn trại hoang tàn, nguyên tuyền cạn | Trợ cấp giảm 5 từ đây |
| 23 | Thiết Huyết Lãnh và Thiết Nhược Nam lên núi | Đã giết Kim Sinh thì hiềm nghi +6 mỗi tuần |
| 24 | Lăng mộ Cổ Nguyệt Nhất Đại (huyết động) | Nhận Huyết Lô Cổ (Tứ chuyển), Huyết Nguyệt Cổ, lối thoát ngầm |
| 25 | Vòng vây của thần bổ | Để lộ lăng mộ / chối / đổ tội / đánh |
| 26 | Nhất Đại sống dậy thành Huyết Cương | Thần bổ và Huyết Cương đồng quy vu tận, hoặc liên thủ |
| 27 | Bạch gia và Hùng gia tập kích, Bạch Ngưng Băng tự bạo | Huyết Lô Cổ nâng tư chất lên Giáp đẳng 99% |

**Động Hoa Tửu theo tầng** (hành động Hậu sơn):

| Tầng | Nơi | Phần thưởng / thử thách |
|---|---|---|
| 1 | Cửa hang | Tửu Trùng (dụ bằng hầu nhi tửu) |
| 2 | Vách đá vôi | Bạch Ngọc Cổ |
| 3 | Lòng đất | Địa Thính Nhục Nhĩ Thảo (phải tự chặt tai) |
| 4 | Bể đá ngầm | Tửu Khôi canh giữ; phần thưởng là rượu quý và bí phương Tứ Vị Tửu Trùng |
| 5 | Sâu nhất | Thông đạo phong ấn tới lăng mộ, mở được từ tuần 22 |

**Kết cục:**
- **Giáp đẳng từ biển máu:** kết cục nguyên tác, có thêm biến thể cùng Bạch Ngưng Băng rời núi.
- **Ma đạo độc hành.**
- **Người giữ lửa Cổ Nguyệt:** hướng Chính đạo.

## 5. Mỗi kiếp một khác

- **Mệnh cách:** chọn 1 trong 3, bốc từ 10 loại. Mỗi loại có cả lợi lẫn hại.
- **Thiên cơ:** 2 trong 10 biến cố, như đại hạn, mưa dầm, thương đội đến sớm (−3 tuần), lang triều đến sớm (−2 tuần), Hùng gia gây hấn, dịch cổ, ma tu lảng vảng, linh mạch dâng trào, học đường siết chặt, Phương Chính khai ngộ. Có thể đẩy sớm lịch mốc (`S.canon`, `S.tideT`).
- **Cánh bướm:** `S.var` quyết định biến thể của 7 mốc. Nếu Tâm cơ hoặc Ngộ tính đủ cao, lời dẫn sẽ có dấu hiệu nhận ra.
- **Bí tàng:** 2 kho báu ở chỗ và thời điểm ngẫu nhiên. Tin đồn trong tửu quán chỉ đường.
- Nhãn "Nguyên tác" chỉ hiện với sự kiện đã gặp ở kiếp trước. Tỉ lệ thành công hiện dạng chữ (Dễ / Vừa / Khó / Rất khó) cho tới khi Ngộ tính từ 10 trở lên.

## 6. Chiến đấu

- Mỗi lượt địch hiện trước ý đồ: tấn công, **dồn lực ×2**, **thế thủ phản kích** (đánh vào sẽ bị phản 70%), hoặc **chiêu riêng**. Chiêu riêng gồm: húc, gọi bầy, cuồng bạo, độc, hàn băng phong cổ, hút chân nguyên, tái tụ, lôi bạo, uy áp.
- Cổ có hồi chiêu. Địch có giáp trừ thẳng vào mỗi đòn. Từ lượt 8 địch cuồng nộ. Thủ lĩnh có giai đoạn 2. Chân nguyên không tự hồi trong trận (có nút hấp thu thạch). Có địch tinh anh.
- Sát thương cổ nhân với `rankMult()` (+45% mỗi chuyển, +5% mỗi giai). Cổ đói thì mất 25% sát thương và tốn thêm 2 chân nguyên mỗi tuần đói (`guCostIdx`).
- Máu dưới 25% khi hết trận thì bị thương tích 3 tuần: gãy tay, nội thương hoặc kinh mạch tổn hại.
- **Tử kiếp** (không chạy được): Huyết Thủ ma tu, Giả gia báo thù, Thiết Huyết Lãnh, Huyết Cương. Chết ở đây cho ký ức giúp kiếp sau tránh được.
- Sát chiêu phải ngộ ra khi bế quan, và được nhớ qua các kiếp (`META.combos`).

## 7. Cân bằng (mô phỏng mới nhất)

Khoảng **36–40% thắng trong 6 kiếp**, thắng ngay kiếp đầu khoảng 2–4%. Cảnh giới trung bình lúc lang triều khoảng Nhị chuyển Đỉnh giai. Kẻ giết nhiều nhất: hộ vệ Giả gia, Giả Kim Sinh, Hắc Hùng, lang triều, Huyết Cương. Không còn kiếp bị kẹt (đã sửa lỗi giá chân nguyên của cổ đói).
README ghi mục tiêu 17–25%. Hiện cao hơn mục tiêu do cốt truyện mới cho thêm tài nguyên, cần chỉnh lại.

## 8. Tranh

| Nguồn | Dùng cho | Công khai được? |
|---|---|---|
| Met Museum Open Access (CC0) | 9 cảnh nền, bản đồ, màn mở đầu, 5 chân dung NPC, 4 chân dung địch | Có |
| Canva AI (tài khoản người dùng) | Phương Nguyên, Bạch Ngưng Băng, thú, huyết khôi, Tửu Khôi, 13 tranh cổ trùng | Có |
| `assets/local/` (Huashi6, Bilibili, manhua...) | Ảnh cá nhân, qua `assets/local/manifest.js` | **Không**, chỉ dùng trên máy |

Còn 8 cổ chưa có tranh, đang dùng chữ thư pháp: Nguyệt Mang, U Quang, Cương Nham, Huyết Lô, 2 loại Xá Lợi, Hùng Lực, Liễm Tức.

## 9. Vấn đề cần xử lý

1. Repo GitHub có chứa ảnh tải từ mạng (`assets/chinese_sources/`, `assets/local/_scraped/`, `assets/gu/g_xuanthu.jpg`). Người dùng quyết định giữ nguyên.
2. Có 4 file sửa chưa commit (`index.html`, `battle.js`, `engine.js`, `sim.cjs`): sửa lỗi giá chân nguyên của cổ đói và thêm chữ thư pháp mới vào font.
3. Bản cốt truyện mới đã được người dùng tự đăng lên link.
4. Tỉ lệ thắng đang cao hơn mục tiêu, cần giảm bớt tài nguyên ở hồi cuối.

## 10. Việc tiếp theo

Xem chi tiết trong [KE_HOACH.md](../undone/BACKLOG_VA_BAN_GIAO_CU.md#source-ke-hoach-md):
- Tuyến truyện NPC (Phương Chính, Bạch Ngưng Băng, Mạc gia và Xích gia).
- Script thu thập tranh CC0 (Met, Cleveland, Chicago), đặc biệt tranh thảo trùng cho cổ.
- Minigame bắt cổ hoang, cây ký ức, chế độ khó, nhạc nền.
- Quyển hai: Thương gia thành.
