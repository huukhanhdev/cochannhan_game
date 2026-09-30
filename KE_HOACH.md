# Thanh Mao Sơn Ký · Kế hoạch cập nhật

Game tu luyện theo lượt lấy bối cảnh *Cổ Chân Nhân* quyển một (Thanh Mao Sơn).
Link chơi: https://claude.ai/artifact/JCxtbEtAKCESDM5jjCa6xM

## Nguyên tắc thiết kế

1. **Cốt truyện được phép lệch nguyên tác thoải mái. Cơ chế thì phải theo nguyên tác:** nuôi cổ, chân nguyên, không khiếu, cảnh giới, luyện cổ thành hoặc bại, sát chiêu, Xuân Thu Thiền.
2. **Không thêm cơ chế nguyên tác không có.** Ví dụ phẩm chất cổ hạ/trung/thượng đã bị loại.
3. **Mỗi lần trùng sinh phải khác nhau.** Mệnh cách, thiên cơ, cánh bướm, bí tàng, chợ và sự kiện đều ngẫu nhiên lại mỗi kiếp.
4. **Chết là một phần của vòng chơi.** Mỗi cái chết để lại ký ức giúp kiếp sau.
5. **Mọi thay đổi độ khó phải kiểm tra bằng script tự chơi** (`node tools/sim.cjs 100 6`) trước khi đăng.
6. **Ảnh tải từ mạng (fan art, truyện tranh, phim) chỉ dùng trên máy**, để trong `assets/local/`, không đăng lên link.

---

## Trạng thái hiện tại (bản 13)

| Hệ thống | Đã có |
|---|---|
| Dòng thời gian | 27 tuần, 18 mốc nguyên tác, lịch có thể lệch theo thiên cơ |
| Sự kiện | Khoảng 90 sự kiện: mốc nguyên tác, 7 tuyến NPC, ngẫu nhiên theo nơi chốn, tử kiếp, 6 loại bí tàng |
| Chiến đấu | Đấu trường PixiJS: ý đồ của địch, hồi chiêu, thế thủ phản kích, 9 loại chiêu riêng của địch, thủ lĩnh giai đoạn 2, cuồng nộ, địch tinh anh, 32 loại địch, rơi cổ theo loại địch |
| Cổ trùng | 30 loại (thêm choáng, giảm lực địch), 8 công thức luyện, 9 sát chiêu phải tự ngộ ra, cổ đói thì yếu đi và tốn thêm chân nguyên |
| Trùng sinh | Xuân Thu Thiền, 22 ký ức mang qua các kiếp, 15 mệnh cách, 14 thiên cơ, 7 mốc có biến thể cánh bướm, bí tàng ngẫu nhiên |
| Minigame | Luyện cổ, mổ thạch (4 loại đá, tối đa 2 khối mỗi tuần), đột phá bích khiếu (đều có nút làm nhanh) |
| Giao diện | Màn mở đầu, bản đồ sống, mực loang khi chuyển cảnh, bảng nhân vật chia tab, xuất/nhập save |
| Tranh | Sơn thủy và chân dung cổ từ Met Museum (CC0); chân dung thú và cổ trùng từ Canva AI |
| Cân bằng | Khoảng 33% thắng trong 6 kiếp, kiếp đầu khoảng 2–5% (người chơi máy, 300 chiến dịch) |

---

## Lộ trình tiếp theo (từ 30/09/2026)

> Lộ trình này thay cho các mục Đợt 5, Đợt 6, Đợt 7 và Kỹ thuật ở phía dưới. Các mục cũ giữ lại chỉ để tham khảo.

### Vấn đề gốc

Đây là game vòng lặp thời gian, nhưng vòng lặp đang là điểm yếu chứ chưa phải điểm mạnh.

- **Người chơi phải chơi lại phần đầu quá nhiều.** Theo mô phỏng, trung bình chết ở tuần 13/27, kiếp đầu thắng khoảng 3%. Tháng 1–4 bị chơi lại 4–5 lần với cùng các lựa chọn.
- **Ký ức chủ yếu là cộng chỉ số** (+25% sát thương lên sói, +35% mổ đá...). Game vòng lặp hay làm ngược lại: mỗi lần chết cho biết thêm một điều, và điều đó mở ra việc mới để làm. Với Phương Nguyên, cảm giác đúng là "lần này ta biết hắn sẽ đi đường nào, nên ta phục sẵn".
- **Đầu tư đồ họa đang lệch chỗ.** Người chơi dành phần lớn thời gian đọc sự kiện và chọn trên bản đồ, nhưng thẻ sự kiện hiện chỉ là tranh nền và chữ.

Hiện trạng số liệu: 38 cổ trùng, 98 sự kiện, 33 loại địch. 22 cổ chưa gắn với sự kiện cốt truyện nào. 12/17 NPC chưa có chân dung. Đấu trường mới gắn xương cho 2 tranh (Phương Nguyên, Điện Lang).

### Cách làm

- Mỗi giai đoạn chia thành bước nhỏ. Mỗi bước kết thúc bằng một bản chơi được trên link để test trên điện thoại.
- Mỗi bước chỉ coi là xong khi: dữ liệu không tham chiếu tới cổ, địch, sự kiện không tồn tại; `node tools/sim.cjs 300 6` không có ca kẹt vòng lặp; chạy thử trong trình duyệt không có lỗi JS.
- Cân bằng đo bằng số liệu người chơi cảm nhận được: số kiếp tới lần thắng đầu, số tuần phải chơi lại. Tỉ lệ thắng của người chơi máy (mục tiêu 15–35%) chỉ là số phụ.

### Giai đoạn 1: Sửa vòng lặp (ưu tiên cao nhất)
- [ ] **1.1 Tua nhanh bằng ký ức.** Đầu kiếp mới, cho chọn "đi lại con đường cũ": game tự áp lại các lựa chọn kiếp trước cho tới khi gặp điều khác đi (thiên cơ mới, cánh bướm, sự kiện chưa thấy). Người chơi dừng lại đúng chỗ muốn đổi.
- [ ] **1.2 Sổ ký ức** thay cho tab Ký ức hiện tại. Tự ghi lại những gì đã thấy: sự kiện nào xảy ra tuần nào, NPC hay ở đâu, bí mật nào đã biết, chết vì ai và ở đâu.
- [ ] **1.3 Ký ức mở lựa chọn mới thay vì cộng chỉ số.** Ví dụ: biết đường Giả Kim Sinh hay đi thì phục kích trước; biết ngày Bạch gia tập kích thì báo trước hoặc bán tin; biết lối vào động Hoa Tửu thì vào ngay tuần đầu. Lựa chọn mở nhờ ký ức có nhãn riêng.
- [ ] **1.4 Tâm nguyện mỗi kiếp.** Đầu kiếp chọn một mục tiêu cụ thể (lấy truyền thừa Hoa Tửu trước tháng 5, cứu Thanh Thư, giết Giả Kim Sinh không để lộ). Làm được thì ghi thêm ký ức. Mỗi kiếp có hướng đi rõ, không chỉ là sống lâu hơn kiếp trước.

### Giai đoạn 2: Chiến đấu có chiều sâu mà không kéo dài
- [ ] **2.1 Đánh nhanh cho trận dễ.** Trận với thú rừng, sơn tặc cho tự đánh bằng AI có sẵn trong script mô phỏng. Người chơi chỉ tự đánh trận khó và trùm.
- [ ] **2.2 Mỗi loại địch cần một cách đối phó riêng.** Giáp dày cần cổ xuyên giáp, Bạch gia phong ấn cổ thì cần cổ dự phòng, trùm hồi máu cần chảy máu. 38 cổ có vai trò khác nhau thay vì chỉ khác chỉ số, và việc chọn nuôi cổ nào có ý nghĩa.
- [ ] **2.3 Cân lại độ khó** theo số kiếp tới lần thắng đầu và số tuần phải chơi lại. Xem lại trận Giả Kim Sinh và hộ vệ Giả gia (hai nguyên nhân chết nhiều nhất).

### Giai đoạn 3: Trình bày ở chỗ người chơi nhìn nhiều nhất
- [ ] **3.1 Sự kiện thành cảnh hội thoại:** chân dung người nói (tranh sống, chớp mắt, đổi nét mặt), chữ hiện dần. Chân dung NPC chính vẽ bằng Canva AI theo thiết kế riêng, cùng phong cách thủy mặc với tranh hiện có.
- [ ] **3.2 Bản đồ sống:** ngày đêm theo tuần, thời tiết theo thiên cơ, trăng máu trước lang triều.
- [ ] **3.3 Cảnh chết và trùng sinh:** con ve vàng vỗ cánh, thời gian tua ngược. Đây là khoảnh khắc lặp lại nhiều nhất trong game.
- [ ] **3.4 Bố cục điện thoại** làm lại cho gọn.

### Giai đoạn 4: Đấu trường
- [ ] Gắn xương cho các trùm: Bạch Ngưng Băng, Lôi Quan Lang Vương, Hắc Hùng, gia lão, Huyết Thủ ma tu.
- [ ] Hiệu ứng riêng theo nhóm cổ: nguyệt, băng, huyết, phong, kim, hộ thể.
- [ ] Cảnh cắt khi tung sát chiêu; địch chết tan thành mực.

### Giai đoạn 5: Nội dung
- [ ] Gắn 22 cổ chưa có cốt truyện vào sự kiện theo đúng chủ nhân trong nguyên tác (Hoa Tửu, Nhất Đại, Thanh Thư, Xích Sơn, Bạch gia).
- [ ] Thêm nhánh kết cục phụ thuộc vào những gì người chơi biết và đã làm qua nhiều kiếp.

### Làm xen kẽ
- [ ] Kiểm tra dữ liệu và mô phỏng tự động sau mỗi lần sửa.
- [ ] Đánh số phiên bản save và viết hàm chuyển đổi khi đổi cấu trúc dữ liệu.
- [ ] Gỡ `assets/local/_scraped/` khỏi git và thêm vào `.gitignore`.

### Hoãn hoặc bỏ
- **Quyển hai:** hoãn tới khi vòng lặp quyển một thật sự hay.
- **Minigame bắt cổ hoang:** bỏ.
- **Thành tựu:** bỏ, sổ ký ức làm tốt việc này hơn.
- **Chế độ khó:** để sau cùng.

---

## Việc đang dở (làm ngay)

### A. Ảnh cá nhân (chỉ trên máy)
- [x] Tạo `assets/local/` và file `assets/local/manifest.js`, ánh xạ ảnh gốc sang ảnh cá nhân, ví dụ `'art/p_hero.jpg' → 'local/art/p_hero.png'`.
- [x] Thêm hàm `asset(path)` trong `data.js`. Mọi chỗ dựng đường dẫn ảnh đều đi qua hàm này: `guImgUrl`, `loadTex` trong `battle.js`, `eventArt`, chân dung NPC, màn mở đầu, avatar trên thanh trạng thái.
- [x] `index.html` nạp `assets/local/manifest.js`. Trên link công khai file này không tồn tại, nên game tự dùng tranh mặc định.
- [x] Chọn và cắt những ảnh đã tải dùng được:
  - `fang_yuan_cn_1.png` (tranh thủy mặc, sạch) → chân dung Phương Nguyên.
  - `fang_yuan_cn_2.png` (áo đen, sạch) → phương án dự phòng (`p_hero_black.png`).
  - `fang_yuan_cn_1.jpg` (tranh truyện tranh) → cắt bỏ chữ ở cạnh trái và chân ảnh (`p_hero_manhua.jpg`).
  - `chun_qiu_chan_cn_1.jpg` → cắt riêng con ve, bỏ phần giao diện game (`local/gu/g_xuanthu.jpg`).
- [x] Bỏ các ảnh sai nhân vật hoặc sai truyện: `bai_ning_bing_cn_1`, cả 3 ảnh `tie_xue_leng_*` (là bìa *Thiết Huyết Thần Bổ*), `chun_qiu_chan_cn_3`, `shang_xin_ci_cn_1`.
- [x] Chuyển các file script đã ghi đè vào `assets/art` và `assets/gu` sang `assets/local/_scraped/`. Khôi phục `assets/gu/g_xuanthu.jpg` gốc từ bản đã đăng.
- [x] Ghi hướng dẫn chạy trên máy trong `README.md`: `cd ~/cochannhan_game && python3 -m http.server 8000`, rồi mở `http://localhost:8000`. Không mở trực tiếp file vì WebGL chặn ảnh từ `file://`.

### B. Script thu thập asset hợp lệ
- [x] Viết `scripts/fetch_openaccess.cjs`, lấy từ các kho mở CC0:
  - Met Museum (`collectionapi.metmuseum.org`),
  - Cleveland Museum of Art (`openaccess-api.clevelandart.org`, tham số `cc0=1`).
- [x] Cấu hình theo chủ đề: tranh **thảo trùng** (ve sầu, bọ, dế, bướm) cho cổ trùng; chân dung (đạo sĩ, thư sinh, võ tướng) cho NPC; sơn thủy cho cảnh nền; thú (hổ, ngựa, chim ưng) cho kẻ địch.
- [x] Lưu vào `assets/openaccess/<chủ đề>/` kèm `manifest.json` ghi tên tranh, họa sĩ, năm, link gốc, giấy phép.
- [x] Không tự ghi đè asset của game. Khâu chọn ảnh làm bằng tay: ghép bảng xem trước rồi chọn.
- [ ] Thay tranh cổ trùng Canva bằng tranh thảo trùng cổ đã cắt và tách nền tối.
- [x] Hai script cũ (`fetch_pinterest_assets.cjs`, `fetch_chinese_assets.cjs`) chỉ dùng cho `assets/local/`. Sửa `mainDest` để không ghi đè file của game.

---

## Bản 13: Mở rộng nội dung (đã xong)

Nguyên tắc: nhân vật và địa điểm lấy từ quyển một (Thanh Mao Sơn); sự kiện ngẫu nhiên viết tự do nhưng không lệch bối cảnh.

- [x] **Cổ trùng mới:** Thủy Tráo Cổ, Sinh Cơ Diệp, Đằng Mạn Cổ (choáng), Kim Châm Cổ (xuyên giáp), Băng Tiễn Cổ (giảm lực địch), Lang Hào Cổ, Thanh Ti Cổ, Tửu Nang Hoa, Bạch Ngân Xá Lợi Cổ.
- [x] **3 công thức luyện, 4 sát chiêu, 1 loại đá** mới (Hàn Ngọc Cổ Thạch).
- [x] **Địch mới:** Trúc Diệp Thanh, Kim Tiền Báo, bầy khỉ hầu nhi tửu, Hùng Lâm, Độc Nhãn sơn tặc vương, Bạch Mao Hùng Vương, sát thủ của Trầm Thúy, Phương Chính, Mạc Nhan. Địch rơi cổ theo loại (Bạch gia rơi Băng Tiễn, sói rơi Lang Hào...).
- [x] **Hoàn thiện tuyến NPC:** Phương Chính giai đoạn 5 (đồng minh hoặc làm chứng chống lại ngươi), Thanh Thư nhánh u uất, Bạch Ngưng Băng giai đoạn 4 (liên thủ trong trận cuối), Mạc gia và Xích gia theo kiếp (`xich_mac_route`), cậu mợ và Trầm Thúy theo `caumo_route` (tai mắt hoặc thuê sát thủ).
- [x] **Tuyến mới:** Thiết Nhược Nam, Hùng Lâm, Mạc Nhan. NPC mới: Mạc Nhan, Xích Sơn, Hùng Lâm, lão thợ săn.
- [x] **15 sự kiện ngẫu nhiên** chia theo học đường, sơn trại, núi, nhiệm vụ; 2 bí tàng mới.
- [x] **5 mệnh cách, 4 thiên cơ, 6 ký ức, 1 thương tích, 1 kết cục** (`bai_dong`: cùng Bạch Ngưng Băng xuống núi).
- [x] **Sửa quầy mổ thạch:** người thu mua từng trả tới ~158% giá gốc chỉ sau một nhát cắt, nên mua rồi bán lại là lãi chắc và lặp vô hạn. Giờ giá thu mua luôn dưới giá gốc (tối đa 90%), quầy chỉ bán 2 khối mỗi tuần, ngộ tính và ký ức giúp chọn đá tốt hơn. Kỳ vọng khi mổ hết: người mới −3% đến −15%, người có nhãn lực +2% đến +12%.
- [x] **Sửa lỗi:** cổ đói tốn thêm chân nguyên nhưng nút vẫn sáng, bấm không có tác dụng; nguyên thạch có thể âm làm kẹt bế quan (nguồn "kẹt vòng lặp" trong script tự chơi).

Việc tiếp theo cho nội dung: tranh cho cổ trùng và địch mới (đang dùng chữ thư pháp và tranh có sẵn), chân dung Mạc Nhan và Hùng Lâm.

---

## Đợt 4: Tuyến truyện NPC

Mỗi tuyến 4–6 sự kiện nối nhau. Mỗi kiếp bốc ngẫu nhiên hướng rẽ.

| NPC | Nội dung | Ảnh hưởng |
|---|---|---|
| **Phương Chính** | Tiến bộ theo tháng (nhanh hơn khi có thiên cơ *Phương Chính khai ngộ*). Có sự kiện so tài, nhờ giúp đỡ, và bị gia tộc lợi dụng để kiềm chế ngươi. | Quan hệ cao: đồng minh trong lang triều. Quan hệ thấp: đứng về phía gia lão khi thẩm vấn. |
| **Cổ Nguyệt Thanh Thư** | Tiểu tổ, nhiệm vụ chung. Sự kiện hắn gặp nạn: cứu hay bỏ mặc. | Mở kết cục Chính đạo, giảm hiềm nghi. |
| **Bạch Ngưng Băng** | 3–4 lần chạm mặt: dò xét, giao đấu, trò chuyện về Bắc Minh Băng Phách Thể, cùng liên thủ. | Quyết định trận cuối: đồng hành, làm ngơ, hay là kẻ thù. |
| **Mạc gia và Xích gia** | Tranh ghế gia lão. Người chơi đứng về một phe, làm gián điệp hoặc cho hai bên cắn xé nhau. | Thay đổi trợ cấp, số người đứng sau ngươi, và ai chủ trì thẩm vấn. |
| **Cậu mợ, Trầm Thúy** | Tiếp nối chuyện gia sản: cậu mợ phản đòn, Trầm Thúy thành tai mắt hoặc kẻ phản bội. | Thu nhập tửu lâu, tin đồn. |

Tiêu chí hoàn thành:
- [x] Mỗi NPC có ít nhất 4 sự kiện và 2 hướng rẽ ngẫu nhiên theo kiếp.
- [x] Tab Nhân vật hiện tiến độ của từng tuyến.
- [x] Thêm ít nhất 2 kết cục mới gắn với tuyến NPC (`thanhthu_chinh`, `song_hung`).
- [x] Chạy script tự chơi: tỉ lệ thắng vẫn trong khoảng 15–35% (đo được ~31–40% tùy nhánh).

---

## Đợt 5: Meta và chơi lại

- [ ] **Cây ký ức:** mỗi lần chết được điểm "quang âm". Dùng điểm mở nhánh:
  - *Biết trước*: gợi ý cánh bướm rõ hơn.
  - *Đạo tâm*: tu luyện nhanh hơn.
  - *Nhãn lực*: thấy tỉ lệ chính xác sớm hơn.
  - *Tàng thạch*: khởi đầu có thêm nguyên thạch.

  Ký ức cố định hiện có vẫn giữ nguyên.
- [ ] **Chế độ khó:** Cổ sư (hiện tại), Ma đầu (tài nguyên ít, địch mạnh hơn 25%), Nguyên tác (Thiền phải hồi phục, chết lúc Thiền chưa hồi phục là hết game).
- [ ] **Thành tựu** và **bảng tổng kết kiếp**: số lần chết, độ lệch nguyên tác, cổ thu được, tuần đạt từng cảnh giới.
- [ ] **Mệnh cách hiếm** mở khóa bằng thành tựu.
- [ ] Minigame **bắt cổ hoang**: kéo co ý niệm, thay cho việc thử chỉ số.

---

## Đợt 6: Trình bày

- [ ] **Âm nhạc nền** theo cảnh (sơn trại, núi, chiến đấu, lang triều, trận cuối), dùng nhạc phạm vi công cộng hoặc tự tổng hợp bằng Web Audio.
- [ ] **Chân dung còn thiếu:** Phương Chính, Thanh Thư, Trầm Thúy, Giả Kim Sinh, Mạc Bắc (tranh cổ CC0, hoặc ảnh cá nhân trong `assets/local/`).
- [ ] **Tranh cổ trùng mới** từ tranh thảo trùng cổ (xem mục B).
- [ ] **Bộ khung giao diện** (giấy dó, khung chạm mây, dải lụa, con dấu son) nếu Canva hết giới hạn, hoặc lấy họa tiết từ đồ vật cổ CC0 (gương đồng, gấm, gốm).
- [ ] **Làm kỹ bản điện thoại:** bố cục một cột, thanh trạng thái gọn, vuốt để đổi tab, nút to hơn.

---

## Đợt 7: Quyển hai, Thương gia thành

Chỉ làm khi quyển một đã ổn định và hay.

- [ ] Đường xuống núi cùng hoặc không cùng Bạch Ngưng Băng, theo kết cục quyển một.
- [ ] Thương gia thành: đổ thạch đúng nguyên tác (nâng cấp từ minigame mổ thạch), chợ lớn, đấu trường.
- [ ] Thiết gia truy sát (Thiết Huyết Lãnh).
- [ ] Tam Vương truyền thừa.
- [ ] Tứ chuyển, Ngũ chuyển; cổ và sát chiêu mới.

---

## Kỹ thuật

- [ ] Tách `sim.cjs` thành bộ kiểm tra tự động: chạy 200 chiến dịch, báo lỗi nếu tỉ lệ thắng ra ngoài 15–35% hoặc có kiếp bị kẹt vòng lặp.
- [ ] Đánh số phiên bản save và viết hàm chuyển đổi khi đổi cấu trúc dữ liệu.
- [ ] Dọn CSS trùng lặp trong `index.html` (nhiều đợt chồng lên nhau), tách ra `css/`.
- [ ] Làm rõ thư mục `thien_ngoai_chi_ma/`: đây có vẻ là một dự án khác dùng chung `assets/` qua symlink. Cần giữ riêng hay gộp vào?

---

## Cần bạn xác nhận về nguyên tác

1. Thứ tự các mốc sau lang triều: Bạch Ngưng Băng, huyết động, Bạch gia tập kích.
2. Phần thưởng trong động phủ Hoa Tửu Hành Giả.
3. Nguồn gốc Huyết Nguyệt Cổ và Huyết Lô Cổ.
4. Diễn biến thật của Trầm Thúy, Thanh Thư, và vụ Giả Kim Sinh.
5. Tên nhân vật theo bản bạn đọc (convert hay bản dịch).

---

## Đã bổ sung Cổ Trùng từ Thư Viện Anime (Chính văn Cổ Chân Nhân)
- **16 Cổ trùng mới chuẩn nguyên tác**:
  - Nhất Chuyển: `Tiểu Quang Cổ` (phụ trợ nguyệt quang), `Toàn Phong Cổ` (phong đạo), `Đồng Bì Cổ` (kim/thổ cận chiến), `Thanh Ti Cổ` (mộc hộ thể).
  - Nhị Chuyển: `Nguyệt Toàn Cổ` (Thanh Thư - đường cong xuyên giáp), `Nguyệt Ngân Cổ` (bắn xa 20m), `Nguyệt Nghê Thường` (khăn lụa hộ thể), `Băng Đao Cổ` (Bạch Ngưng Băng - hàn khí làm chậm), `Thủy Tráo Cổ` (màn nước tiêu hao thấp), `Ẩn Lân Cổ` (Bạch gia trinh sát - tàng hình né phục kích), `Hỏa Lô Cổ` (Xích Sơn - chống lạnh phản hỏa), `Cửu Diệp Sinh Cơ Thảo` (Hoa Tửu - sinh Sinh Cơ Diệp linh dược mỗi tuần).
  - Tam Chuyển: `Cứ Xỉ Kim Ngô` (Hoa Tửu - rết răng cưa gây Chảy Máu), `Mộc Mị Cổ` (Cổ Nguyệt tộc cấm cổ - thụ tinh hộ thể), `Đao Sí Huyết Bức Cổ` (Nhất Đại Cổ Nguyệt - hút máu lifesteal), `Bạch Ngân Xá Lợi Cổ` (tiêu hao tăng 1 tiểu cảnh giới Tam chuyển).
- **8 Công thức hợp luyện mới**: Nguyệt Toàn, Nguyệt Ngân, Nguyệt Nghê Thường, Băng Đao, Thủy Tráo, Ẩn Lân, Cứ Xỉ Kim Ngô, Mộc Mị.
- **4 Sát chiêu combo mới**: Nguyệt Toàn Xuyên Kích, Băng Lam Thủy Thuẫn, Kim Ngô Phệ Thể, Huyết Bức Thực Khí.
- **Tương tác**: Cổ Đồ Giám tự động cập nhật, bế quan ngộ sát chiêu, chợ học đường & thương đội bày bán, mổ thạch Giả gia có xác suất xuất hiện cổ sống.
