# Ma Trận Đối Chiếu Nguyên Tác Canon (CANON_MAP)
> **Tài liệu tham chiếu chuẩn:** [`CHI_TIET_NGUYEN_TAC_Q1.md`](../../CHI_TIET_NGUYEN_TAC_Q1.md) & [`CHI_TIET_NGUYEN_TAC_Q2.md`](../../CHI_TIET_NGUYEN_TAC_Q2.md)  
> **Cập nhật:** 01/10/2026 | **Phục vụ:** Kế hoạch thực thi Big Update Q1–Q2 (PR-00)

---

## 1. Giải Quyết Các Điểm Mâu Thuẫn & Dấu Hỏi Cốt Lõi (SRC-01 đến SRC-04)

| Mã | Vấn đề trong tài liệu | Đối chiếu nguyên tác chính xác | Hướng xử lý chuẩn trong Game | Trạng thái |
|:---:|---|---|---|:---:|
| **SRC-01** | Đâu Suất Hoa là hoa chiến đấu (Q1 ch.160-161) hay túi trữ vật phẩm (Q2 ch.208)? | Trong nguyên tác: **Đâu Suất Hoa** là cổ thảo bản mệnh của Mộc đạo / Trữ vật đạo. Hoa nở trên lòng bàn tay tạo không gian trữ vật nhỏ đựng nguyên thạch, lá cây, đồng thời có thể hấp thu và bắn ra một số loại hạt thảo mộc. Đến Q2 dùng làm túi trữ lá thuốc và thức ăn. | **Chuẩn hóa vai trò**: Là cổ phụ trợ / trữ vật (+ô chứa đồ / giảm chi phí thức ăn cổ trùng). Khi chiến đấu có thể tiêu hao hạt giống để gây sát thương nhẹ nếu trang bị hạt thảo mộc. | ✅ Đã chốt |
| **SRC-02** | Thứ bậc Bạch Ngọc Cổ (Nhị chuyển) và Thiên Bồng Cổ (Tam chuyển). Bảng tổng kết Q1 gộp chung thành một hàng. | Bạch Thỉ (Nhất) + Ngọc Bì (Nhất) $\rightarrow$ **Bạch Ngọc Cổ (Nhị chuyển)** ở ch 100. Sau khi lên Tam chuyển (ch 155), PN "mượn" **Thiên Bồng Cổ (Tam chuyển)** từ kho gia tộc để thay thế vị trí phòng thủ cao cấp hơn. | **Tách biệt 2 Cổ**: `bachngoc` (Rank 2) giữ nguyên đến cuối Q1 khi đổi sang `thienbong` (Rank 3). Không gộp chung làm một; Thiên Bồng có giáp quang hộ thể mạnh hơn và tốn chân nguyên bạch ngân. | ✅ Đã chốt |
| **SRC-03** | Thời điểm phát hiện Thiên Nguyên Bảo Liên (ch 162 hồ ngầm hay ch 188 hang máu)? | Nguyên tác: PN phát hiện mầm sen Thiên Nguyên Bảo Liên trôi nổi trong đầm nước ngầm dưới mật thất Hoa Tửu từ ch 162, nhưng chưa hái vì chưa nở đủ độ. Đến ch 188 (sau trận hang dơi máu và Cự Xỉ Kim Ngô), PN mới chính thức thu hoạch và bắt đầu nuôi dưỡng bằng 50 thạch/ngày. | **Hai giai đoạn sự kiện**: Tuần 22 (`c_matthat`): trinh sát thấy Bảo Liên (nhận cờ phát hiện). Tuần 25–26 (`c_huyetdong`): chính thức thu phục đưa vào không khiếu sinh thạch mỗi tuần. | ✅ Đã chốt |
| **SRC-04** | Số lượng và phẩm cấp Tửu Trùng mang sang Quyển 2 (Q2 ch.208-210)? | Nguyên tác: Tại Thanh Mao Sơn PN có 2 Tửu Trùng (1 bắt ở hang + 1 đổ thạch) $\rightarrow$ đã hợp luyện thành **Tứ Vị Tửu Trùng (Nhị chuyển)** ở ch 126. Khi rời núi sang Q2, PN chỉ mang theo 1 con Tứ Vị Tửu Trùng này (sau đó bị chết đói trên sông Hoàng Long vì thiếu rượu 4 vị). | **Chuẩn hóa kho Q2**: Khi qua Q2, chuyển đúng **1 Tứ Vị Tửu Trùng (Rank 2)**. Nếu người chơi không hợp luyện thành công ở Q1 thì chỉ mang 1 Tửu Trùng thường (Rank 1). | ✅ Đã chốt |

---

## 2. Bảng Ma Trận Ánh Xạ Dữ Kiện Canon (Fact Mapping Matrix)

### A. Quyển 1: Thanh Mao Sơn (Chương 1 – 206)

| Fact ID | Phân đoạn nguyên tác | Dữ kiện cốt lõi | Event / Code Game | Phân loại | Tác động hệ thống | Trạng thái |
|---|---|---|---|:---:|---|:---:|
| **FACT-Q1-01** | Ch 1–4 | Trọng sinh 500 năm; Khai khiếu Bính đẳng 44%, Thanh Đồng hải | `c_khaikhieu` | Canon | Khởi tạo `S.apt='C'`, `S.chuyen=1`, `S.giai=0`, `S.ess=44` | ✅ Đã map |
| **FACT-Q1-02** | Ch 5–10 | Xuân Thu Thiền ngủ say trong khiếu; Bắt Tửu Trùng bằng rượu Thanh Trúc | `c_tuutrung` | Canon | Nhận `GU.tuutrung`, tinh luyện chân nguyên sơ $\rightarrow$ trung | ✅ Đã map |
| **FACT-Q1-03** | Ch 11–15 | Học đường chọn Nguyệt Quang Cổ bản mệnh; Bắn Nguyệt Nhận chuẩn xác | `c_hocduong` | Canon | Nhận `GU.nguyetquang` | ✅ Đã map |
| **FACT-Q1-04** | Ch 16–25 | Chặn cổng cướp 1 thạch/người; Đánh Phương Chính, Mạc Bắc, Xích Thành | `c_conghocduong` | Canon | +Nguyên thạch mỗi tuần, tăng hiềm nghi `S.susp`, bồi dưỡng uy thế | ✅ Đã map |
| **FACT-Q1-05** | Ch 26–34 | Khảo hạch săn lợn rừng; Cướp tai lợn đoạt giải nhất; Chọn Bạch Thỉ Cổ | `c_khaohach` | Canon | Nhận `GU.bachthi` (+1 trư chi lực thể chất) | ✅ Đã map |
| **FACT-Q1-06** | Ch 40–47 | Đổ thạch Lại Thổ; Cổ Kim Sinh gạ mua; Chém đầu Kim Sinh ở khe đá | `c_kimsinh` | Canon / Nhánh | `storySetOutcome('kimsinh', 'kill')`, +35 thạch, kích hoạt điều tra | ⏳ Sắp làm (PR-04) |
| **FACT-Q1-07** | Ch 55–58 | Cổ Phú tra án; Trúc Quân Tử Cổ (Xuân Thu Thiền trấn áp thoát nạn) | `c_dieutra` | Canon | Đọc `outcomes['kimsinh']`, kiểm tra Túc Tích Cổ / Trúc Quân Tử | ⏳ Sắp làm (PR-04) |
| **FACT-Q1-08** | Ch 69–79 | Đòi di sản cha mẹ: Căn nhà, tửu lâu, Cửu Diệp Sinh Cơ Thảo; Đuổi Trầm Thúy | `c_giasan` | Canon | Nhận `tuulau` (+thạch/tuần), nhận `GU.cuudiep`, đuổi Trầm Thúy | ⏳ Sắp làm (PR-07a) |
| **FACT-Q1-09** | Ch 80–85 | Tống tiền Gia lão Xích Liệp (vụ Thủy Khiếu Cổ của Xích Thành) | `c_xichliep` | Canon | Nhận chu cấp thạch định kỳ từ Xích gia | ⏳ Sắp làm (PR-07a) |
| **FACT-Q1-10** | Ch 94–99 | Trận Lợn Rừng Vương; Thu lực hại Hoa Hân, chui bụng lợn; Lên Nhị chuyển sơ | `c_lonrung` | Canon | Tiểu tổ Bệnh Xà chết, PN sống sót nhận trúc lâu, lên Nhị chuyển sơ | ⏳ Sắp làm (PR-07b) |
| **FACT-Q1-11** | Ch 100–103 | Hợp luyện Bạch Ngọc Cổ (Bạch Thỉ + Ngọc Bì); Bán tửu lâu mua Hắc Thỉ | `c_hop_bachngoc` | Canon | Nhận `GU.bachngoc` (Rank 2 thủ), nhận `GU.hacthi` (tổng 2 trư lực) | ⏳ Sắp làm (PR-07b) |
| **FACT-Q1-12** | Ch 107–119 | Rừng đá Thạch Hầu; Hạ Thạch Hầu Vương lấy Ẩn Thạch Cổ; Luyện Ẩn Lân Cổ | `c_thachhau` | Canon | Nhận `GU.anlan` (Rank 2 ẩn thân hoàn hảo) | ⏳ Sắp làm (PR-07b) |
| **FACT-Q1-13** | Ch 120–128 | Nín thở qua Thôn Giang Thiềm (Ngũ chuyển); Luyện Tứ Vị Tửu Trùng | `c_thongiang` | Canon | Nhận `GU.tuvi` (Tứ Vị Tửu Trùng Rank 2) | ⏳ Sắp làm (PR-07b) |
| **FACT-Q1-14** | Ch 129–144 | Lang triều; Cấy Địa Thính Nhục Nhĩ Thảo; Thanh Thư hi sinh (Mộc Mị) | `c_langtrieu` | Canon | Cấy `GU.diathinh`, cướp Xích Thiết Xá Lợi từ BNB lên Nhị đỉnh | ⏳ Sắp làm (PR-07b) |
| **FACT-Q1-15** | Ch 151–154 | Bắt cóc Dược Nhạc, gấu nuốt sống, luyện Nhân Thú Táng Sinh Cổ | `c_nhanthu` | Canon | Lên Tam chuyển sơ kỳ (Bạch Ngân), thành Gia lão trẻ nhất tộc | ✅ Đã code canon |
| **FACT-Q1-16** | Ch 155–162 | Mượn Thiên Bồng Cổ kho tộc; Thấy Thiên Nguyên Bảo Liên hồ ngầm | `c_thienbong` | Canon | Nhận `GU.thienbong` (Rank 3), cờ thấy Bảo Liên | ⏳ Sắp làm (PR-07c) |
| **FACT-Q1-17** | Ch 182–188 | Hang dơi máu; Thu phục Cự Xỉ Kim Ngô; Nhổ Thiên Nguyên Bảo Liên | `c_cuxikimngo` | Canon | Nhận `GU.cuxikimngo` (Rank 3), nhận `GU.thiennguyenbaolien` | ⏳ Sắp làm (PR-07c) |
| **FACT-Q1-18** | Ch 190 | Phát hiện di vật tối thượng Hoa Tửu: Thiên Lý Địa Lang Chu (Ngũ chuyển) | `c_dialangchu` | Canon | Nhận `GU.dialangchu` (chìa khóa vượt địa đạo sang Q2) | ⏳ Sắp làm (PR-07c) |
| **FACT-Q1-19** | Ch 193–200 | Cổ Nguyệt Nhất Đại thức tỉnh (Huyết Mạc Thiên Hoa); BNB tự bạo đóng băng | `c_nhatdai` | Canon | Toàn bộ Thanh Mao Sơn hóa tượng băng | ⏳ Sắp làm (PR-07c) |
| **FACT-Q1-20** | Ch 201–206 | Dùng Xuân Thu Thiền lần 2; Âm Cổ biến BNB thành nữ; Huyết Lô thăng Giáp 90% | `c_ketcuc_q1` | Canon | Sang Quyển 2: BNB nữ đồng hành, tư chất Giáp 90%, mang kho cổ sống sót | ⏳ Sắp làm (PR-07c) |

---

### B. Quyển 2: Nam Cương Hành Trình (Chương 207 – 517)

| Fact ID | Phân đoạn nguyên tác | Dữ kiện cốt lõi | Module Game | Phân loại | Tác động hệ thống | Trạng thái |
|---|---|---|---|:---:|---|:---:|
| **FACT-Q2-01** | Ch 207–227 | Xuôi sông Hoàng Long; Cổ chết đói; Dạy BNB nữ tiết kiệm chân nguyên | `ch1_hoanglong.js` | Canon | Quản lý thức ăn cổ trùng, cá sấu vương, gặp ma tu Trần Thúy Hoa | ⏳ Sắp làm (PR-08) |
| **FACT-Q2-02** | Ch 228–250 | Bạch Cốt Sơn - Bách gia; Luyện Cốt Nhục Đoàn Viên Cổ; Bẫy chết Thiết Ngạo Thiên | `ch2_bachcot.js` | Canon | Luyện `GU.cotnhucdoanvien`, trốn bằng Vô Túc Điểu | ⏳ Sắp làm (PR-08) |
| **FACT-Q2-03** | Ch 251–294 | Thôn Tử U; Thương đội kết giao Thương Tâm Từ; Giết gián điệp Trương Trụ | `ch3_thuongdoi.js` | Canon | Tên giả Hắc Thổ / Bạch Vân, buôn cỏ Kim gia, hộ tống Tâm Từ | ⏳ Sắp làm (PR-08) |
| **FACT-Q2-04** | Ch 295–390 | Thương gia thành; Thề Độc với BNB; Toàn Lực Ứng Phó Cổ; Lực đạo bộ | `ch4_thanh.js` | Canon | Bộ Lực Đạo (Khổ Lực, Khí Lực), Diễn võ trường, ép Bách gia 300 vạn | ⏳ Sắp làm (PR-08) |
| **FACT-Q2-05** | Ch 391–406 | Đưa Thương Tâm Từ lên ngôi Thiếu chủ Thương gia; Lên Tứ chuyển sơ | `ch5_thieuchu.js` | Canon | Đột phá Tứ chuyển sơ kỳ (Hoàng Kim chân nguyên) | ⏳ Sắp làm (PR-08) |
| **FACT-Q2-06** | Ch 407–438 | Núi Tam Xoa; Vượt ải Khuyển Vương truyền thừa; 4 lão Thiết gia vây | `ch6_tamxoa.js` | Canon | 100 ải chó Khuyển Vương, tích trữ chó tinh anh | ⏳ Sắp làm (PR-09) |
| **FACT-Q2-07** | Ch 439–449 | Tín Vương truyền thừa; Luyện Cốt Dực Cổ (bay); Chém chết Thiết Bá Tu | `ch7_ngu.js` | Canon | Nhận `GU.cotdyc` (phi hành 3D), tiêu diệt Thiết Bá Tu, danh chấn Nam Cương | ⏳ Sắp làm (PR-09) |
| **FACT-Q2-08** | Ch 466–485 | Địa linh Bá Quy; Mưu luyện Đệ Nhị Không Khiếu; Ám sát 3 cự đầu Ngũ chuyển | `ch8_baquy.js` | Canon | Ám sát Thiết Mộ Bạch, Vu Quỷ Ô Cật, Khổ Mặc; bắt Cừu Cửu | ⏳ Sắp làm (PR-09) |
| **FACT-Q2-09** | Ch 486–503 | BNB phản bội gieo Định Tinh Cổ; Vô Cực Sưu Tỏa khóa chặt; Trọng sinh lần 3 | `ch9_phanboi.js` | Canon | Tự bạo kích hoạt Xuân Thu Thiền lần 3 quay ngược thời gian | ⏳ Sắp làm (PR-09) |
| **FACT-Q2-10** | Ch 504–517 | Đổi sang luyện Tiên Cổ Định Tiên Du; Bay lên núi Đãng Hồn đoạt Hồ Tiên | `ch9_phanboi.js` | Canon | Luyện Tiên Cổ Định Tiên Du (Lục chuyển), chiếm Hồ Tiên phúc địa (Trung Châu) | ⏳ Sắp làm (PR-09) |

---

## 3. Nhật Ký Đo Lường Baseline (PR-00)

| Ngày đo | Bộ kiểm thử | Lệnh thực thi | Kết quả thực tế | Đánh giá |
|:---:|---|---|---|---|
| **01/10/2026** | Syntax & Data Scan | `node tools/check.cjs` | **Dữ liệu: không có lỗi.** (0 warning, 0 error) | ✅ Đạt điều kiện nền |
| **01/10/2026** | Bot Sim Q1 (Standard) | `node tools/sim.cjs 100 6` | **Thắng 38.0%** (kiếp 1: 6%, k2: 7%, k3: 3%, k4: 10%, k5: 7%, k6: 5%). Cảnh giới lúc thắng: 3.70 (Tam chuyển đỉnh). Kết cục: `ma: 31`, `huyetlo_bai: 7`. Top cổ: trilieu, huyetnguyet, cuxikimngo, tuvi, xuanthu, nhanthutangsinh. | ✅ Baseline Q1 ổn định |
| **01/10/2026** | Bot Sim Q2 (Standard) | `node tools/sim2.cjs 100 5` | **Thắng 100%** (lần 1: 71, lần 2: 19, lần 3: 10). Cảnh giới cuối: 4.3 (Tứ chuyển đỉnh 100%). Kết cục: `q2_tranmathap: 80`, `q2_hotien: 15`, `q2_dinhtien_thanhmao: 2`, v.v. | ✅ Baseline Q2 ổn định |
