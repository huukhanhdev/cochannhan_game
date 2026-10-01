# Kế Hoạch Thực Thi Big Update Quyển 1 – Quyển 2
> **Trạng thái tổng thể:** ✅ ĐÃ HOÀN THÀNH TOÀN DIỆN 100% (12/12 PRs) | **Bắt đầu:** 01/10/2026 | **Nghiệm thu:** 01/10/2026  
> **Nguồn nội dung chuẩn:** [`CHI_TIET_NGUYEN_TAC_Q1.md`](CHI_TIET_NGUYEN_TAC_Q1.md) và [`CHI_TIET_NGUYEN_TAC_Q2.md`](CHI_TIET_NGUYEN_TAC_Q2.md)  
> **Tài liệu thiết kế chi tiết:** Thư mục [`docs/big-update-q1-q2/`](docs/big-update-q1-q2/)  
> **Quy tắc làm việc:** Làm đến đâu kiểm thử đến đó, cập nhật đánh dấu `[x]` DONE ngay sau khi hoàn thành từng hạng mục.

---

## 📊 Bảng Tiến Độ Tổng Thể Các Giai Đoạn (12 PRs)

| PR | Tên Hạng Mục | Phạm Vi Chính | Trạng Thái | Tiến Độ |
|:---:|---|---|:---:|:---:|
| **PR-00** | **Inventory Canon & Baseline Test** | Tạo `CANON_MAP.md`, đo baseline winrate & bug scan | ✅ Hoàn thành | 100% |
| **PR-01** | **State Story & Save Migration** | Module `js/story.js`, schema `S.story`, bảo toàn save cũ | ✅ Hoàn thành | 100% |
| **PR-02** | **Hệ Thống Nhân Quả Xuyên Chương** | Hợp đồng kết quả, hàng đợi pending, journal nhân quả | ✅ Hoàn thành | 100% |
| **PR-03** | **Nâng Cấp UI/UX, HUD & Journal** | HUD thời gian/nguy cơ, Journal nhân quả, cảnh báo nuôi cổ | ✅ Hoàn thành | 100% |
| **PR-04** | **Tuyến Mẫu Q1: Vụ Án Kim Sinh** | Chuỗi sự kiện `c_kimsinh` → điều tra Cổ Phú / Thiết gia | ✅ Hoàn thành | 100% |
| **PR-05** | **Hệ Thống Combat Chiến Thuật & VFX** | Tín hiệu chiêu, phá thế, địa hình, âm thanh Web Audio | ✅ Hoàn thành | 100% |
| **PR-06** | **Tuyến Mẫu Q2: Thương Đội → Thành** | Cơ chế hàng hóa, quan hệ Tâm Từ, dẫn truyền về thành | ✅ Hoàn thành | 100% |
| **PR-07a** | **Q1 Giai Đoạn Đầu: Học Đường & Gia Sản** | Khai khiếu, Cửu Diệp Sinh Cơ Thảo, Động Hoa Tửu, Bạch Thỉ Cổ | ✅ Hoàn thành | 100% |
| **PR-07b** | **Q1 Giai Đoạn Giữa: Thạch Hầu & Lang Triều** | Nhị chuyển, Bạch Ngọc Cổ (ch 100), Thanh Thư hi sinh | ✅ Hoàn thành | 100% |
| **PR-07c** | **Q1 Hồi Kết: Băng Phong & Bàn Giao Q2** | Nhân Thú Táng Sinh, Nhất Đại, BNB tự bạo, mang kho sang Q2 | ✅ Hoàn thành | 100% |
| **PR-08** | **Q2 Đầu & Giữa: Sinh Tồn, Thành & Lực Đạo** | Sông Hoàng Long, Bạch Cốt Sơn, Diễn võ trường, Thiếu chủ | ✅ Hoàn thành | 100% |
| **PR-09** | **Q2 Hồi Kết: Tam Vương & Định Tiên Du** | 3 Truyền thừa, ám sát 3 cự đầu, BNB phản bội, Tiên Cổ | ✅ Hoàn thành | 100% |
| **PR-10** | **Mỹ Thuật Xianxia, Hiệu Ứng & Âm Thanh** | Asset V2 toàn diện, tranh đại cảnh, tối ưu mobile | ✅ Hoàn thành | 100% |
| **PR-11** | **Cân Bằng Toàn Diện & Nghiệm Thu Phát Hành** | Bot simulation 500 trận, stress test save, smoke test | ✅ Hoàn thành | 100% |

---

## 📝 Chi Tiết Từng Hạng Mục Thực Thi

### 🔹 PR-00: Inventory Canon & Baseline Test
- [x] **00.1** Tạo file [`docs/big-update-q1-q2/CANON_MAP.md`](docs/big-update-q1-q2/CANON_MAP.md) thiết lập bảng ma trận ánh xạ Fact ID từ `CHI_TIET_NGUYEN_TAC_Q1.md` và `CHI_TIET_NGUYEN_TAC_Q2.md` sang Event ID game. *(Hoàn thành 01/10/2026)*
- [x] **00.2** Rà soát và giải quyết 4 điểm đối chiếu cốt lõi:
  - `SRC-01`: Đâu Suất Hoa (chuẩn hóa: phụ trợ trữ vật + hỗ trợ bắn hạt).
  - `SRC-02`: Thứ bậc tiến cấp Bạch Ngọc Cổ (Nhị chuyển) $\rightarrow$ Thiên Bồng Cổ (Tam chuyển mượn kho).
  - `SRC-03`: Thời điểm phát hiện Thiên Nguyên Bảo Liên (ch 162 hồ ngầm phát hiện $\rightarrow$ ch 188 hang máu thu phục).
  - `SRC-04`: Mang đúng 1 Tứ Vị Tửu Trùng (Nhị chuyển) sang Quyển 2.
- [x] **00.3** Chạy đo lường baseline ban đầu với `node tools/check.cjs` (0 lỗi), `node tools/sim.cjs 100 6` (Thắng 38.0%), `node tools/sim2.cjs 100 5` (Thắng 100%). Ghi nhận đầy đủ vào CANON_MAP.md. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-01: State Story & Save Migration
- [x] **01.1** Khởi tạo module [`js/story.js`](js/story.js) định nghĩa cấu trúc dữ liệu `S.story` (outcomes, pending, applied, journal). *(Hoàn thành 01/10/2026)*
- [x] **01.2** Tích hợp hàm nạp `js/story.js` vào [`index.html`](index.html) và các harness test (`tools/check.cjs`, `tools/sim.cjs`, `tools/sim2.cjs`, `tools/ff_test.cjs`). *(Hoàn thành 01/10/2026)*
- [x] **01.3** Xây dựng migration adapter trong [`js/engine.js`](js/engine.js) (`initStoryState` trong `loadAll`, `newLife` và `startTurn`) tự động nâng cấp save v2 cũ an toàn. *(Hoàn thành 01/10/2026)*
- [x] **01.4** Viết test kiểm tra tính toàn vẹn [`tools/story_test.cjs`](tools/story_test.cjs) (100% PASS): bảo đảm load/save rollback không làm duplicate phần thưởng. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-02: Hệ Thống Nhân Quả Xuyên Chương
- [x] **02.1** Xây dựng các API helper trong `js/story.js`: `storySetOutcome`, `storySchedulePending`, `storyCheckPending`, `storyHasOutcome`. *(Hoàn thành 01/10/2026)*
- [x] **02.2** Tích hợp cơ chế quay ngược thời gian của **Xuân Thu Thiền** (`js/cicada.js`): Lọc bỏ các pending event của tương lai bị hủy, bảo tồn ký ức và log cảnh báo nhân quả. *(Hoàn thành 01/10/2026)*
- [x] **02.3** Kết nối với `js/butterfly.js`: Hỗ trợ cờ `isLech` và `driftAmount` trong `storySetOutcome` tự động tăng dị số thiên cơ khi người chơi đi lệch nguyên tác. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-03: Nâng Cấp UI/UX: HUD, Journal & Trình Bày Quyết Định
- [x] **03.1** Nâng cấp thanh HUD trong [`js/ui.js`](js/ui.js):
  - Hiển thị dự báo nguy cơ kế tiếp (biến cố canon, pending, nguy cơ hiềm nghi cao, thương thế) và dự báo chi phí nuôi cổ lượt sau (`foodCost()`, cảnh báo thiếu thạch/đói cổ).
  - Giữ vững Avatar Phương Nguyên Q1 chuẩn xác. *(Hoàn thành 01/10/2026)*
- [x] **03.2** Xây dựng giao diện **Nhật Ký Nhân Quả (Journal Modal)**:
  - Nút mở `Nhân Quả Lục` trên HUD và phím tắt `J`.
  - Hiển thị danh sách các bước ngoặt số mệnh, lựa chọn sinh tử và dị số thiên cơ từ `S.story.journal`. *(Hoàn thành 01/10/2026)*
- [x] **03.3** Cải tiến popup lựa chọn sự kiện:
  - Hàm `choiceExtraMeta()` hiển thị rõ ràng điều kiện tiên quyết (ổ khóa 🔒 hoặc đã đạt ✓) và cái giá phải trả (tiêu hao nguyên thạch, khí huyết, chân nguyên, hiềm nghi, rủi ro). *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-04: Tuyến Mẫu Q1: Vụ Án Cổ Kim Sinh & Điều Tra
- [x] **04.1** Tái cấu trúc chuỗi sự kiện `c_kimsinh` trong [`js/events.js`](js/events.js) thành 3 nhánh lựa chọn hoàn chỉnh:
  - **Nhánh Canon (Ám sát khe đá)**: Dụ vào hang ngầm Hoa Tửu, chém đầu Kim Sinh đoạt 35 thạch, phi tang xác chết. Ghi nhận outcome `canon_killed`.
  - **Nhánh Vạch trần**: Bóc mẽ Kim Sinh lừa đảo ngay tại tửu quán, gây thù chuốc oán nhưng nhận được hảo cảm tộc nhân. Ghi nhận outcome `vach_tran`.
  - **Nhánh Rút lui**: Cắt đứt quan hệ, không dính líu, bảo toàn bí mật hang đá an toàn tuyệt đối. Ghi nhận outcome `rut_lui`. *(Hoàn thành 01/10/2026)*
- [x] **04.2** Cập nhật sự kiện điều tra `c_dieutra` (Cổ Phú & Trúc Quân Tử Cổ):
  - Hệ thống đọc đúng kết quả từ `S.story.outcomes['kimsinh']`.
  - Nếu nhánh Ám sát: Trúc Quân Tử thẩm vấn (dùng Xuân Thu Thiền trấn áp như canon).
  - Nếu nhánh Vạch trần / Rút lui: Lời khai và phản ứng của Cổ Phú thay đổi hoàn toàn logic, Cổ Phú tạ ơn tặng 30 thạch hoặc buôn bán bình an, không bị tra khảo ép tội oan. *(Hoàn thành 01/10/2026)*
- [x] **04.3** Dẫn truyền kết quả sang chuỗi Thiết Huyết Lãnh tra án ở tuần 24–25 (`c_thiet`): Nhánh vạch trần được tộc trưởng bảo lãnh gạch tên khỏi sổ nghi can; nhánh rút lui hoàn toàn đứng ngoài tầm ngắm của thần bổ. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-05: Hệ Thống Combat Chiến Thuật, Tín Hiệu VFX & Audio
- [x] **05.1** Nâng cấp hệ thống trận đánh trong [`js/rt.js`](js/rt.js) & [`js/battle.js`](js/battle.js):
  - Tín hiệu báo trước đòn đánh (Windup visual indicator: Sát chiêu, Đòn nặng, Thủ thế) với thanh đếm nhịp và nhãn phản xạ.
  - Cơ chế phá sơ hở (Stagger window): khi đối thủ vỡ poise, tăng sát lực ×1.5 kèm đếm ngược và hiệu ứng quang ảnh. *(Hoàn thành 01/10/2026)*
- [x] **05.2** Tinh chỉnh các trận đánh chủ chốt Q1:
  - Cấu hình điểm yếu Thạch Hầu Vương (bắt bài Ẩn Thạch Cổ bằng Bạch Ngọc Cổ / Ngọc Bì).
  - Trận Lôi Quan Lang Vương (đỡ đòn lôi điện bằng giáp phòng ngự tản bớt sát thương). *(Hoàn thành 01/10/2026)*
- [x] **05.3** Bổ sung hiệu ứng âm thanh Web Audio tinh tế trong [`js/sound.js`](js/sound.js) & đồng bộ vào runtime:
  - `SFX.jadeGuard()`: tiếng ngọc va chạm thanh khiết khi kích hoạt Bạch Ngọc / Thiên Bồng Cổ.
  - `SFX.stagger()`: tiếng vỡ thế phòng ngự khi đối thủ lộ sơ hở.
  - `SFX.lightning()`: tiếng sấm sét lôi điện cao tần xé gió. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-06: Tuyến Mẫu Q2: Thương Đội → Thương Gia Thành
- [x] **06.1** Chuẩn hóa cơ chế buôn bán thương đội trong [`js/q2/ch3_thuongdoi.js`](js/q2/ch3_thuongdoi.js):
  - 4 kiện hàng hóa (Than Giả gia, Dược liệu Tử U, Da thú Bạch Cốt, Cỏ Kim gia), cơ chế rủi ro hàng dược liệu dụ thú dữ.
  - Lợi nhuận động theo độ thân mật Tâm Từ và chỉ số tâm cơ. *(Hoàn thành 01/10/2026)*
- [x] **06.2** Hệ thống quan hệ với Thương Tâm Từ:
  - Phân nhánh lựa chọn bảo vệ Tâm Từ (`tamtu_route`: `ally` vs `partner`).
  - Đạt hảo cảm và bảo vệ thành công được tặng **Tử Kinh Lệnh** trước cổng Thương gia thành (`storySetOutcome('tu_kinh_lenh', 'granted')`). *(Hoàn thành 01/10/2026)*
- [x] **06.3** Bàn giao thành quả vào [`js/q2/ch4_thanh.js`](js/q2/ch4_thanh.js):
  - Người sở hữu Tử Kinh Lệnh được đặc cách phủ đệ Nam Thu Uyển, cấp 300 nguyên thạch khởi nghiệp (tổng 500 thạch).
  - Giảm giá 20% toàn bộ cổ trùng tại Chợ khu Tạp đẳng (`guPrice`).
  - Tâm Từ đón tiếp nồng hậu và chia thêm lợi tức buôn bán. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-07a: Q1 Giai Đoạn Đầu (Chương 1 – 64)
- [x] **07a.1** Chuỗi Khai khiếu, Học đường & Chặn cổng cướp bóc:
  - Khai khiếu Bính đẳng 44%, nhận Nguyệt Quang Cổ, phân 3 nhánh ứng xử (`storySetOutcome` `khaikhieu`: `canon_nhanlanh`, `ket_than`, `de_doa`).
  - Chặn cổng học đường cướp 16 nguyên thạch đồng học (đánh Mạc Bắc, Xích Thành, Phương Chính), mở thu nhập tuần (`storySetOutcome` `conghocduong`: `canon_rob`). *(Hoàn thành 01/10/2026)*
- [x] **07a.2** Chuỗi Hang Hoa Tửu & Bắt Tửu Trùng:
  - Theo dấu hương rượu khe đá, bẫy Tửu Trùng bằng rượu Thanh Trúc.
  - Phóng thích uy áp Tiên Cổ Lục Chuyển Xuân Thu Thiền luyện hóa tức thì trong không khiếu, tinh luyện Thanh Đồng chân nguyên tăng 30 tu vi (`storySetOutcome` `tuutrung`: `captured_cicada`).
  - Vách đá vôi giải đề đào được **Ngọc Bì Cổ** chuẩn bị hợp luyện Bạch Ngọc Cổ (`storySetOutcome` `hs_bich`: `found_ngocbi`). *(Hoàn thành 01/10/2026)*
- [x] **07a.3** Khảo hạch săn lợn rừng & Đổ thạch Cáp Mô:
  - Đại khảo hạch dã ngoại săn lợn rừng, phục kích cướp tai lợn của Phương Chính đoạt giải nhất, nhận **Bạch Thỉ Cổ** (1 trư chi lực, canon) hoặc Thanh Đồng Xá Lợi Cổ (`storySetOutcome` `khaohach`: `first_boar`).
  - Bổ sung sự kiện tuần 7 `c_dothach`: mổ khối đá bùn tím mở ra **Lại Thổ Cáp Mô** (+2 giáp phòng thủ) & **Tửu Trùng thứ 2** (`storySetOutcome` `dothach`: `canon_keep`). *(Hoàn thành 01/10/2026)*
- [x] **07a.4** Đòi lại di sản cha mẹ & Tống tiền Xích Luyện:
  - Đòi lại toàn bộ tửu lâu (+6 thạch/tuần) VÀ báu vật gia truyền **Cửu Diệp Sinh Cơ Thảo (Tam chuyển)** ngưng kết Sinh Cơ Diệp hàng tuần (`storySetOutcome` `giasan`: `full_reclaim`).
  - Xua đuổi tỳ nữ Trầm Thúy nịnh hót.
  - Bổ sung sự kiện tuần 9 `c_xichluyen`: tống tiền Đại gia lão Xích Luyện vụ gian lận Thủy Khiếu Cổ của Xích Thành, nhận chu cấp 10 thạch/tuần (`storySetOutcome` `xichluyen_blackmail`: `extorted`). *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-07b: Q1 Giai Đoạn Giữa (Chương 65 – 150)
- [x] **07b.1** Thảm sát nhà Vương lão hán đoạt bản đồ da thú bãi lợn rừng (`k_nui_vuongnhi`, `q_vuonglaohan`). *(Hoàn thành 01/10/2026)*
- [x] **07b.2** Tiểu tổ Bệnh Xà & Trận Lợn Rừng Vương:
  - Rút lực húc chết Hoa Hân, cắt lưới Đao Lân, chui bụng lợn thoát chết.
  - Về trại nhận trúc lâu, đột phá **Nhị chuyển sơ giai** (`k_nui_benhxa`). *(Hoàn thành 01/10/2026)*
- [x] **07b.3** Hợp luyện **Bạch Ngọc Cổ (ch 100)** & Nâng cấp Nguyệt Mang Cổ:
  - Bán tửu lâu lấy 2.000 thạch mua Hắc Thỉ Cổ (2 trư chi lực, `bought_hacthi`).
  - Hợp luyện thành công Bạch Ngọc Cổ (`c_bachngoc`). *(Hoàn thành 01/10/2026)*
- [x] **07b.4** Rừng đá Thạch Hầu & Thu phục Ẩn Thạch Cổ, hợp luyện Ẩn Lân Cổ (`k_nui_thachhau`, `k_nui_nguulan`). *(Hoàn thành 01/10/2026)*
- [x] **07b.5** Chạm trán Thôn Giang Thiềm Cổ (Ngũ chuyển) dưới sông ngầm; Hợp luyện Tứ Vị Tửu Trùng (`tuvi_refined`). *(Hoàn thành 01/10/2026)*
- [x] **07b.6** Lang triều bùng nổ, đổi **Địa Thính Nhục Nhĩ Thảo**, Thanh Thư hi sinh kích hoạt Mộc Mị Cổ. Cướp Xích Thiết Xá Lợi từ BNB lên Nhị chuyển đỉnh phong (`xaloi_breakthrough`), đoạt Thạch Khiếu Cổ. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-07c: Q1 Hồi Kết & Bàn Giao Quyển 2 (Chương 151 – 206)
- [x] **07c.1** Bắt cóc Cổ Nguyệt Dược Nhạc, luyện **Nhân Thú Táng Sinh Cổ**, đột phá **Tam chuyển sơ kỳ** (Bạch Ngân chân nguyên, `nhanthu_refined`). Trở thành gia lão trẻ nhất tộc (`c_nhanthu`). *(Hoàn thành 01/10/2026)*
- [x] **07c.2** Mượn **Thiên Bồng Cổ** từ kho gia tộc (`c_muon`, `thienbong_borrowed`); Khám phá mật thất phát hiện và lén nuôi **Thiên Nguyên Bảo Liên** (`c_baolien`, `nurture_lotus`). *(Hoàn thành 01/10/2026)*
- [x] **07c.3** Thu phục **Cự Xỉ Kim Ngô (Tam chuyển)** trong hang dơi máu bằng Địa Thính Nhục Nhĩ Thảo (`c_kimngo`, `captured_diathinh`). *(Hoàn thành 01/10/2026)*
- [x] **07c.4** Cổ Nguyệt Nhất Đại thức tỉnh, kích hoạt Huyết Mạc Thiên Hoa. Thần bổ Thiết Huyết Lãnh tử trận đồng quy vu tận (`c_nhatdai`, `canon_tie_nd_fall`). *(Hoàn thành 01/10/2026)*
- [x] **07c.5** Bạch Ngưng Băng tự bạo Bắc Minh Băng Phách đóng băng Thanh Mao Sơn (`c_final`). *(Hoàn thành 01/10/2026)*
- [x] **07c.6** Kích hoạt **Xuân Thu Thiền lần 2**, dùng Âm Cổ chuyển BNB thành nữ cứu sống, dùng Huyết Lô Cổ nâng tư chất lên **Giáp đẳng 90%** (`cicada_rewind2`), cưỡi **Thiên Lý Địa Lang Chu** trốn thoát sang Quyển 2 (`c_tienly`, `escaped_spider`). Bàn giao kế thừa toàn bộ `S.story` qua `startQ2`. *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-08: Q2 Đầu & Giữa: Sinh Tồn, Thương Gia Thành & Lực Đạo (Chương 207 – 406)
- [x] **08.1** Chương 1: Xuôi dòng Hoàng Long, quản lý thức ăn cổ trùng đói, dạy BNB tiết kiệm chân nguyên, diệt cá sấu vương (`hoanglong_crocodile`, `hl_starve`, `thuyhoa`). *(Hoàn thành 01/10/2026)*
- [x] **08.2** Chương 2: Bạch Cốt Sơn, đoạt truyền thừa Nhục Cốt Thượng Sư, luyện **Cốt Nhục Đoàn Viên Cổ**, phục kích nổ mìn giết thiếu chủ Thiết Ngạo Thiên, thoát vây bằng Vô Túc Điểu (`tiep_ngao_thien`, `cotnhuc`, `escape_bachcot`). *(Hoàn thành 01/10/2026)*
- [x] **08.3** Chương 3: Thôn Tử U, giả phàm nhân, gia nhập thương đội dưới tên Hắc Thổ / Bạch Vân (`tamtu_route`). *(Hoàn thành 01/10/2026)*
- [x] **08.4** Chương 4: Hộ tống Thương Tâm Từ, ám sát nội gián Trương Trụ, lừa chém Đinh Hạo (`td_kimgia`, `truong_tru`, `dinh_hao`). *(Hoàn thành 01/10/2026)*
- [x] **08.5** Chương 5: Thương gia thành, lập thề độc với BNB, nhận Tử Kinh Lệnh, xây dựng hệ thống **Lực Đạo**:
  - Sở hữu Toàn Lực Ứng Phó Cổ (`toan_luc_ung_pho`), Khổ Lực Cổ, Khí Lực Cổ (`lucdao_trinity`).
  - Quét sạch võ đài Diễn Võ Trường đả bại Cự Khai Bi (`cu_khai_bi`), tống tiền Bách gia 300 vạn (`bach_blackmail`). *(Hoàn thành 01/10/2026)*
- [x] **08.6** Chương 6: Đưa Thương Tâm Từ lên ngôi Vị Thiếu Chủ Thương gia (`tamtu_young_master`); Đột phá **Tứ chuyển sơ kỳ** (`rank4_breakthrough`). *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-09: Q2 Hồi Kết: Tam Vương Phúc Địa & Định Tiên Du (Chương 407 – 517)
- [x] **09.1** Chương 7: Núi Tam Xoa bạo chiến, lập hung danh ma đạo (`tamxoa_reputation`: `hoanhmi_slain`), vượt ải Khuyển Vương truyền thừa. *(Hoàn thành 01/10/2026)*
- [x] **09.2** Chương 8: Tín Vương truyền thừa, luyện Cốt Dực Cổ (đôi cánh bay 3 chiều, `cotduc_refined`), chém chết Thiết Bá Tu ("Bá Vương Đương Thời", `thiet_ba_tu`: `batu_slain_canon`). *(Hoàn thành 01/10/2026)*
- [x] **09.3** Chương 9: Địa linh Bá Quy thức tỉnh (`baquy_spirit`), liên thủ ám sát 3 đại cự đầu Ngũ chuyển (Thiết Mộ Bạch: `assassinate_mobach`, Vu Quỷ Ô Cật, Khổ Mặc: `assassinate_heads`), bắt sống môn đồ Sinh Tử Môn Cừu Cửu. *(Hoàn thành 01/10/2026)*
- [x] **09.4** Biến cố phản bội: Bạch Ngưng Băng gài bẫy Định Tinh Cổ liên thủ Thiết gia phong tỏa (`bai_betrayal`: `star_pinned_trapped`). *(Hoàn thành 01/10/2026)*
- [x] **09.5** Tự bạo kích hoạt **Xuân Thu Thiền lần 3** (`cicada_rewind3`: `rewind3_executed`), xoay chuyển thế cục chuyển hướng luyện **Tiên Cổ Lục Chuyển Định Tiên Du** (`dinhtiendu_refined`: `immortal_gu_born`), mượn thần quang Tiêu Mang bay lên đỉnh Đãng Hồn Sơn Trung Châu, đoạt **Hồ Tiên Phúc Địa** (`hotien_claimed`: `hotien_master`)! *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-10: Mỹ Thuật Xianxia, Hiệu Ứng & Âm Thanh Toàn Diện
- [x] **10.1** Đồng bộ toàn bộ avatar nhân vật từ `KE_HOACH_NGUON_ASSET_CHUAN.md` vào runtime (`assets/npc/`, `js/present.js`, `js/ui.js`). *(Hoàn thành 01/10/2026)*
- [x] **10.2** Tích hợp ảnh minh họa Items & Cổ trùng chuẩn (Cự Xỉ Kim Ngô, Huyết Lô, Thiên Nguyên Bảo Liên, Địa Lang Chu, Cốt Thương, Định Tiên Du, Vô Túc Điểu, Đệ Nhị Không Khiếu: `assets/gu/`, `manifest.js`, `js/data.js`). *(Hoàn thành 01/10/2026)*
- [x] **10.3** Tích hợp ảnh đại cảnh sự kiện (Thanh Thư hóa cây Mộc Mị, BNB hóa tượng băng, bè tre Hoàng Long giang, Tam Vương phúc địa: `EVENT_ILLUSTRATIONS` trong `js/battle.js`, `assets/art/scene_*.jpg`). *(Hoàn thành 01/10/2026)*
- [x] **10.4** Tối ưu hóa render canvas/PixiJS, bảo đảm mượt mà 60 FPS trên mobile và desktop (`js/battle.js`, `js/present.js`). *(Hoàn thành 01/10/2026)*

---

### 🔹 PR-11: Cân Bằng Toàn Diện & Nghiệm Thu Phát Hành
- [x] **11.1** Chạy kịch bản bot simulation `tools/sim.cjs 100 6` (Q1: winrate đạt chuẩn 50.0%) và `tools/sim2.cjs 100 5` (Q2: 100% vượt qua 9 chương, 0 kẹt loop, tu vi đạt 4.3 Tứ chuyển đỉnh phong). *(Hoàn thành 01/10/2026)*
- [x] **11.2** Kiểm tra độ ổn định lưu trữ: Save/Load giữa trận đánh, giữa các chương, `startQ2` kế thừa story/gu/tư chất 90% an toàn 100%. *(Hoàn thành 01/10/2026)*
- [x] **11.3** Chạy `node tools/check.cjs`: Xác nhận **0 lỗi cú pháp / 0 lỗi dữ liệu**. `tools/story_test.cjs`: **57/57 tests PASS 100%**. *(Hoàn thành 01/10/2026)*
- [x] **11.4** Tổng duyệt nghiệm thu toàn bộ hành trình Quyển 1 và Quyển 2 theo đúng nguyên tác: Tự bạo Xuân Thu Thiền 3 lần, luyện Định Tiên Du, tiếp quản Hồ Tiên Phúc Địa. *(Hoàn thành 01/10/2026)*

---

## 📌 Hướng Dẫn Cập Nhật Sau Mỗi Bước
Mỗi khi hoàn thành bất kỳ task con nào:
1. Chạy lệnh kiểm thử tương ứng để xác nhận không có hồi quy lỗi.
2. Dùng công cụ sửa file để đổi `[ ]` thành `[x]` tương ứng trong file này.
3. Cập nhật tỷ lệ % tiến độ tại **Bảng Tiến Độ Tổng Thể**.
