# PR-5: Huyết chiến và hồi kết Quyển 1 (bản đã review)
### Chuyển các mốc cao trào cuối Quyển 1 thành máy cảnh nhiều bước

> **Review 30/09/2026, đối chiếu `main` tại `0ffc65b` (sau PR-1 đến PR-4).** Phần A là nhận xét 4 PR đã lên. Phần B là kế hoạch PR-5 đã sửa, mỗi chỗ sửa có "**Vì sao chỉnh**". Căn cứ: `NGUYEN_TAC_Q1.md` (chương 136–206) và code hiện có.

---

## Phần A. Review PR-1 đến PR-4

### A.1. Số đo trên `0ffc65b`

| Cổng | Kết quả | Mục tiêu | Đánh giá |
|---|---|---|---|
| `check.cjs` | 0 lỗi | 0 lỗi | Đạt |
| `sim.cjs 300 6` (bám truyện) | **50,7–52,3%**, kiếp đầu 10–11% | 40–45%, kiếp đầu khoảng 10% | **Cao hơn mục tiêu khoảng 7 điểm** |
| `LECH=1 sim.cjs 200 6` (đi lệch) | **28%** | ≥ 25% | Đạt. Trước PR là 3,3% |
| `sim2.cjs 60` (Quyển 2) | Lần thử đầu 62%, không kẹt | Chạy hết, không kẹt | Đạt |

**Nhận xét:**
- Bot đi lệch tăng từ 3,3% lên 28% là kết quả tốt nhất của 4 PR: đi lệch giờ đã thắng được, đúng ý anh.
- Tỉ lệ thắng bám truyện tăng từ 43,5% lên khoảng 51% vì các cảnh mới cho thêm lựa chọn có lợi. Chưa cần chỉnh ngay: PR-5 đổi các trận cuối, nên cân lại **sau** PR-5 (bước B.6).

### A.2. Lỗi đã sửa trong lần review này

**Máy cảnh: lựa chọn "dò xét" dùng lặp lại được** (`js/engine.js`, `scChoices` và `scChoose`).
- **Lỗi:** engine đánh dấu lựa chọn `stay` đã dùng theo số thứ tự trong danh sách **đã lọc**. Chọn một mục thì danh sách co lại, nên mục thứ hai mang số thứ tự cũ của mục thứ nhất và không bao giờ bị ẩn.
- **Hậu quả:** người chơi bấm lặp một câu hỏi tới khi hết lượt, và **nhận lại phần thưởng mỗi lần**.
- **Đã kiểm chứng** bằng test trên 11 cảnh: ở `c_khaikhieu` và `c_giasan`, lựa chọn dò xét thứ hai vẫn hiện sau khi đã chọn.
- **Sửa:** mỗi lựa chọn mang vị trí gốc `_i`, và đánh dấu theo `_i`. Hết `budget` thì các lựa chọn dò xét tự ẩn, thay vì hiện ra mà bấm không có tác dụng.
- Đã chạy lại test: lựa chọn đã dùng biến mất đúng. Sửa này đã nằm trong commit `4b9551d`.

### A.3. Điểm chưa ổn, nên sửa trong PR-5 hoặc PR-6

| # | Vấn đề | Vị trí | Đề xuất |
|---|---|---|---|
| 1 | Cảnh không tính `canonMiss` | `scChoose` chỉ tăng `canonHit` | Tăng `canonMiss` khi chọn nhánh không `canon` ở nút cuối của mốc nguyên tác. Màn kết đang hiện "Bám nguyên tác X%", số này đang sai |
| 2 | Lựa chọn ký ức phục kích Kim Sinh (`mem:'jks'`) không bao giờ phản tác dụng | `c_kimsinh`, nút `phuc_kich` | Kiểm tra `varShifted('kimsinh')` như các mốc khác (`giasan`, `gate`, `bai` đã làm đúng) |
| 3 | Không có tua nhanh qua cảnh | `ff.js` | Không cần: chết thật mất hết, tua nhanh không còn đường vào. Ghi chú để không ai làm thừa |
| 4 | `sim.cjs` không đếm số cảnh và số chuyện phụ gặp mỗi đời | `tools/sim.cjs` | Thêm hai số này (đã có `S.sceneN`) để kiểm cổng "≥ 25 chuyện phụ mỗi đời" |

---

## Phần B. Kế hoạch PR-5 đã sửa

### B.0. Tóm tắt chỉnh sửa

| # | Bản gốc | Bản review | Lý do |
|---|---|---|---|
| 1 | `c_lang2` tuần 18, `c_nhatdai` tuần 25 | **Tuần 20** và **tuần 26** | Theo `CANON` trong `events.js`; tuần 25 là `c_thietvay` |
| 2 | `c_final` còn 5 lựa chọn | **Giữ đủ 10 nhánh hiện có** | Bản gốc làm mất 5 kết cục: `bai_dong`, `tien_lo`, `phan_toc`, `chinh`, và lối thông đạo |
| 3 | Thiền lần hai "< 10% cơ hội" | **Chắc chắn thành công**, câu "dưới một phần mười" chỉ là lời dẫn | Code hiện tại chắc chắn thành công. Thêm xúc xắc 10% thì kết cục nguyên tác gần như không đạt được |
| 4 | Mã kết cục `end_huyetlo`, `end_songhung`… | Dùng khóa `AFTER` có thật: `end_thien2`, `end_songhung`, `end_thanhthu`, `end_bai`, `end_tienlo`, `end_phantoc`, `end_ma`, `end_chinh` | `end_huyetlo` không tồn tại |
| 5 | `c_nhatdai`: 5 lựa chọn phẳng | Giữ điều kiện hiện có: "để đồng quy" và "liên thủ" chỉ mở khi thần bổ đang truy (`tieHunt` hoặc `tieToTomb`) và chưa chết | Bỏ điều kiện thì có thể "để thần bổ đồng quy" khi thần bổ đã chết từ trước |
| 6 | Mục tiêu 45–55% | **40–45%** | Anh đã chốt 40–45%; bản gốc tự nâng lên cho vừa số đo hiện tại |
| 7 | Chỉ làm 4 mốc | Thêm **gộp lang triều** (`c_lang1`, `c_lang2`, `c_lang3` thành cảnh 2 tuần), hoặc tách thành PR-6 | Đây là hạng mục còn nợ của kế hoạch nâng cấp (PR-4). Làm `c_lang2` thành cảnh mà không gộp thì phải sửa lại lần nữa |
| 8 | Tên "Khôi Khôi Cổ, Vọng Khí Cổ" cho cổ trinh sát của thần bổ | Chỉ dùng tên có trong `NGUYEN_TAC_Q1.md`; không chắc thì tả mà không đặt tên | Luật: bám NPC và cơ chế của truyện |

---

### B.1. `c_lang2`, tuần 20: Thanh Thư hóa thụ nhân

**Đã có trong code:** ba nhánh "đứng sau chờ thời" (nguyên tác), "vét túi cổ" (ma đạo, `tamco`) và cứu Thanh Thư. Có cờ `qingshuDead`, `qingshuAlive`, `baiWeak`, và nguồn Thạch Khiếu Cổ.

**Cảnh:**
- `start: 'tuyet_lang'`. Thoại Thanh Thư và Bạch Ngưng Băng như bản gốc.
- `stay`, `flag:'soi_bai'`: quan sát thấy hàn khí làm tay Bạch Ngưng Băng run. **Mở thêm** nhánh `danh_han`: đánh vào chỗ hàn khí yếu (`fight('bai',{mod:.6, spare:.3})`). Thanh Thư không phải dùng Mộc Mị.
- `stay`, `flag:'soi_thanhthu'`: thấy Thanh Thư cầm Mộc Mị Cổ. Nếu **quan hệ với Thanh Thư ≥ 30** thì mở nhánh `can_moc_mi`: thuyết phục nàng đừng dùng. Nàng sống, nhưng trận khó hơn (`mod:.85`).
- `doi_cho` (nguyên tác): giữ nguyên hiệu ứng đang có.
- `doat_co` (ma đạo): giữ nguyên hiệu ứng và `check` đang có.
- `cuu_thanhthu`: trận đánh `mod: .75, spare: .25`, như bản gốc.

> **Vì sao chỉnh:**
> - **Thêm hai đường lệch dựa trên dò xét và quan hệ.** Bản gốc chỉ có "đánh để cứu" là đường lệch. `KE_HOACH_DI_LECH.md` đã chốt rằng đi lệch thành công nhờ **đọc tình huống**, không chỉ nhờ đánh thắng.
> - **Không đổi phần thưởng của nhánh nguyên tác và nhánh ma đạo.** Hai nhánh này đã cân trong sim; đổi thì tỉ lệ thắng nhảy.

### B.2. `c_thiet`, tuần 23: thần bổ tới

Giữ các lựa chọn của bản gốc (`binh_than`, `do_la`, `nghi_binh`, `xoa_vet`), sửa 3 chỗ:
- **`nghi_binh` cần `S.f.huyethai`.** Lăng mộ (`c_huyetdong`) là tuần 24, sau tuần 23, nên chỉ ai đã xuống hậu sơn tầng cuối (`hs_mo`) từ trước mới biết. Nhánh này là **phần thưởng cho người khám phá sớm**. Ghi rõ trong thoại ("ngươi nhớ thông đạo huyết văn sau bể đá").
- **`xoa_vet` chỉ hiện khi `S.f.killedJKS`.** Không giết thì chẳng có vết để xóa.
- **Nhánh `do_la` nối với tuyến Thiết Nhược Nam.** Nếu đã có `nhuocnam` ≥ 15, ở `c_thietvay` (tuần 25) mở lựa chọn đưa bằng chứng huyết đạo cho thần bổ. Đây là đường lệch "thần bổ thành đồng minh" trong `KE_HOACH_DI_LECH.md`.

> **Vì sao chỉnh:** bản gốc chưa nối lựa chọn ở tuần 23 với hậu quả ở tuần 25 và 26, nên dò la Nhược Nam không để làm gì. Hai điều kiện `huyethai` và `killedJKS` ngăn lựa chọn vô nghĩa.

### B.3. `c_thietvay`, tuần 25 (bản gốc bỏ sót)

Đây là mốc bị thần bổ vây, nằm giữa `c_thiet` và `c_nhatdai`. Chuyển thành cảnh ngắn:
- Chỉ xảy ra khi thần bổ đang truy (`tieHunt`).
- Có nhánh đồng minh từ B.2.
- Được phép chạy trốn.

> **Vì sao chỉnh:** bản gốc nói "4 mốc cao trào cuối" nhưng bỏ qua tuần 25. Thiếu nó thì chuỗi thần bổ đứt đoạn: dò la ở tuần 23 rồi đồng quy ở tuần 26, không có gì ở giữa.

### B.4. `c_nhatdai`, tuần 26: Huyết Cương và Hạc Tai

**Đã có trong code:** nhánh "để thần bổ đồng quy", "liên thủ", "đối đầu", `pre_lo` (theo ký ức Huyết Lô), trốn thông đạo.

**Cảnh:**
- `start: 'huyet_cuong'`. Nhất Đại vạch trần "chuồng lợn"; tiếng Hạc Tai trên trời.
- `stay`, `flag:'soi_nhatdai'`: thấy xích Trấn Ma trên ngực lão. Nhánh "đối đầu" giảm độ khó (`mod ×0.85`).
- **Giữ nguyên điều kiện hiện có:** `ngu_ong` và `lien_thu` chỉ hiện khi `(tieHunt || tieToTomb) && !tieGone`. Nếu không thì hiện "đối đầu".
- `pre_lo`: giữ `check:['tamco',15]` và điều kiện `mem('huyetlo') && hasGu('huyetlo')`.
- `tron_ngam`: giữ `req: S.f.huyethai`.
- **Thêm** nhánh `goi_dong_minh` nếu có `pcAlly`, `qingshuAlive` hoặc `tieAlly` (từ B.3): mỗi đồng minh giảm `mod` của trận Huyết Cương 0,1.

> **Vì sao chỉnh:**
> - **Tuần 26, không phải 25.**
> - **Giữ điều kiện.** Bản gốc liệt kê phẳng 5 lựa chọn, thì có thể "để thần bổ đồng quy" khi thần bổ đã chết hoặc chưa từng tới.
> - **Thêm "gọi đồng minh".** Đây là đường lệch chốt trong `KE_HOACH_DI_LECH.md`: càng nhiều người thân còn sống thì trận càng dễ. Nó cũng là phần thưởng cho việc cứu Thanh Thư và kết thân Phương Chính trước đó.

### B.5. `c_final`, tuần 27: băng phong Thanh Mao Sơn

**Giữ đủ 10 nhánh đang có**, chuyển thành các nút của cảnh:

| Nhánh | Điều kiện hiện có | `AFTER` |
|---|---|---|
| Xuân Thu Thiền lần hai (nguyên tác) | Có `xuanthu` | `end_thien2` → `huyetlo_bai` |
| Tế Huyết Lô | Có `huyetlo` | kết `huyetlo` |
| Cùng Phương Chính | `pcAlly` | `end_songhung` |
| Cùng Thanh Thư | `qingshuAlive` | `end_thanhthu` |
| Cùng Bạch Ngưng Băng | `baiAlly` và chưa có Huyết Lô | `end_bai` |
| Mang lò máu đã no | `preLo` | `end_tienlo` |
| Bán đường cho Bạch gia | `mem('bai')`, quan hệ ≥ 20, `check tamco 18` | `end_phantoc` hoặc `end_ma` |
| Mở đường máu | – | `end_ma` |
| Dẫn tộc nhân thoát | – | `end_chinh` |
| Thông đạo ngầm | `huyethai`, `check tamco 14` | kết `ma` |

**Nút mở đầu** `bang_phong`: thoại Bạch Ngưng Băng tự bạo, núi đóng băng. Một lượt `stay` quan sát (thấy đường nứt băng phía nam, giảm độ khó trận chạy trốn).

**Nhánh Thiền lần hai** chia thành 3 nút thoại (ném Nhất Đại; Âm cổ cứu Bạch Ngưng Băng; tắm Huyết Lô rồi `thachKhieuClash()`), sau đó trận `baitruonglao`. **Hiệu ứng giữ y như code hiện tại**: chắc chắn thành công, tư chất 90, `baiNu=1`.

> **Vì sao chỉnh:**
> - **Giữ đủ 10 nhánh.** Bản gốc chỉ còn 5. Mất `bai_dong`, `tien_lo`, `phan_toc`, `chinh` và lối thông đạo tức là mất đúng các kết cục của người đi lệch. Như vậy đi ngược mục tiêu cả chuỗi PR.
> - **Không thêm xúc xắc cho Thiền lần hai.** "Dưới một phần mười" là lời PN tự nói về rủi ro, không phải cơ chế. Nếu thành xúc xắc 10%, kết cục `huyetlo_bai` (lối vào Quyển 2 đầy đủ nhất) gần như không đạt, và `sim2.cjs` mất đầu vào.
> - **Dùng đúng khóa `AFTER`.**

### B.6. Kiểm tra và cân bằng

1. `node tools/check.cjs`: 0 lỗi.
2. **Kết cục:** mỗi kết cục của `ENDINGS` phải xuất hiện ít nhất một lần trong `sim.cjs 300 6` hoặc `LECH=1`. Đây là cổng mới, để chắc không nhánh nào bị cắt mất.
3. `sim.cjs 300 6`: **40–45%**. Hiện khoảng 51%. Nếu sau PR-5 vẫn trên 45%, tăng `DIFF` từ 2.52 lên khoảng 2.6 rồi đo lại.
4. `LECH=1 sim.cjs 300 6`: ≥ 25%.
5. `sim2.cjs 100`: Quyển 2 nhận đúng kho cổ từ kết `huyetlo_bai`, không kẹt.
6. Trình duyệt: chơi hết tuần 20 và 27 trên điện thoại và máy tính, không lỗi JS.

> **Vì sao chỉnh:**
> - **Thêm cổng kết cục.** PR-5 viết lại mọi lối ra của Quyển 1. Nếu không đếm kết cục thì một nhánh bị cắt sẽ không ai phát hiện.
> - **Mục tiêu 40–45%.** Hạ mục tiêu cho vừa số đo là đi ngược quyết định của anh.

### B.7. Thứ tự làm

1. `c_final` trước, vì nó có nhiều nhánh nhất và dễ làm mất kết cục nhất. Chạy cổng kết cục ngay sau đó.
2. `c_nhatdai`, rồi `c_thietvay`, rồi `c_thiet` (đi ngược từ cuối lên, để các cờ nối nhau đúng).
3. `c_lang2`, cùng việc gộp lang triều. Hoặc tách thành PR-6 nếu PR-5 đã quá lớn.
4. Cân `DIFF` ở bước cuối.

---

## Phần C. Đã làm (30/09/2026)

**Sửa máy cảnh** (`js/engine.js`, `js/ui.js`):
- Nút có `check` và `okGo`/`failGo` (không có lựa chọn) trước đây bị bỏ qua: cảnh kết thúc mà không có kết quả. Có 7 nút bị ảnh hưởng, trong đó có **nhánh nguyên tác hẹn Kim Sinh ra khe đá** (không có trận, không giết được) và nhánh nguyên tác gặp Bạch Ngưng Băng. Giờ bấm "Tiếp tục" thì tung xúc xắc rồi sang nút tương ứng (`scNodeCheck`, gọi trong `scFinish`).
- `say` dạng hàm trước đây ghi mã nguồn của hàm vào nhật ký; giờ gọi hàm.
- `talk` được phép là hàm (thoại đổi theo trạng thái), qua `scTalk()`.
- Cảnh tính `canonMiss` khi chọn nhánh không phải nguyên tác ở nút có nhánh nguyên tác.
- Nút `fight` nhận thêm tùy chọn `fight.o` (`mod`, `flee`, `spare`...).

**Năm cảnh mới:**
- `c_lang2`: thêm 2 đường lệch cần dò xét trước: đánh vào nhịp hàn khí (`mod .55`); giữ tay Thanh Thư (cần quan hệ 30, `mod .6`).
- `c_thiet`: thêm "nghi binh" bằng huyết văn (cần đã xuống tầng cuối hậu sơn, `hs ≥ 5`). Thần bổ đổi mục tiêu sang lăng mộ.
- `c_thietvay`: thêm "đưa bằng chứng qua Nhược Nam" (cần `nhuocnam ≥ 15`), bật `tieAlly`.
- `c_nhatdai`: thêm "gọi đồng minh": mỗi người (Phương Chính, Thanh Thư, thần bổ) giảm độ khó 15%. Dò xét vết nứt ngực: ×0,85.
- `c_final`: giữ đủ 10 nhánh cũ. Xuân Thu Thiền lần hai thành 3 nút thoại, vẫn chắc chắn thành công. Dò xét khe băng phía nam: đường chạy ×0,9.

**Gộp lang triều:** bỏ tuần 21 khỏi `CANON`. Sau cảnh Thanh Thư, Lang Vương (`c_lang3`) thành đại sự còn chờ của tuần 20. Trước trận, gia tộc phát linh dược (`langRally`: +20% khí huyết, +20% chân nguyên). Tuần 21 thành tuần trống.

**`check.cjs`:** đọc được lựa chọn dạng hàm và `okGo`/`failGo` của lựa chọn.

**Số đo:**
- `sim.cjs 600 6`: thắng **45,0%**, kiếp đầu 9,8%, với `DIFF` 2.52 → **2.55**.
- `LECH=1 sim.cjs 300 6`: **27%**.
- `sim2.cjs 80`: không kẹt.
- Kết cục bot đã đạt: `ma`, `phan_toc`, `huyetlo_bai`, `chinh`, `bai_dong`, `tien_lo`, `thanhthu_chinh`. `song_hung` và `huyetlo` bot không chọn, nhưng đã thử ép và cả hai đạt được.
- Trình duyệt: cảnh `c_lang2` và `c_final` chạy, không lỗi JS.

**Ghi chú cân bằng:** tỉ lệ thắng tụt khi sửa lỗi khe đá (trận Kim Sinh chạy trở lại) và khi gộp lang triều. Nghĩa là con số ~51% trước PR-5 cao giả, vì lỗi cảnh làm mất trận.

---

## Phần D. Thẻ kết quả, lựa chọn có điều kiện, nhân quả (30/09/2026)

**Thẻ kết quả** (`resBegin`/`resEnd` trong `engine.js`, `resultHTML` trong `ui.js`):
- Hiện sau mỗi lựa chọn, mỗi cảnh, mỗi việc trên bản đồ, mỗi trận thắng hoặc chạy thoát.
- Thẻ ghi: lựa chọn đã chọn, xúc xắc, diễn biến, chỉ số thay đổi (nguyên thạch, khí huyết, tu vi, danh vọng, hiềm nghi…), cổ nhận hoặc mất, ký ức mới, quan hệ NPC đổi.
- Chuỗi nối nhau (việc → sự kiện → trận) gom thành một thẻ. Các dòng giữa trận không đưa vào thẻ.
- Nhật ký chỉ để tra lại. Không hiện thẻ khi tua nhanh.
- Lựa chọn dò xét trong cảnh hiện kết quả ngay trong khung thoại.

**Lựa chọn có điều kiện** (`need`):
- Khai báo gọn: `need:{chuyen, stones, gu, mem, rel:[npc,n], danh, tamco, ngo, satphat, tuchat, herbs, blood, flag, chose, t}`.
- Không đủ thì lựa chọn vẫn hiện nhưng bị khóa, ghi 🔒 và nói rõ còn thiếu gì.
- `chose:'mốc:khóa'`: lựa chọn trước đó trong kiếp này, ghi ở `S.chosen` bởi `remember()`.
- Chuỗi đã nối:
  - Gia sản (mua chuộc Trầm Thúy) → Trầm Thúy thành tai mắt ngay.
  - Cổng học đường (bảo kê) → gọi đám học trò dọa Kim Sinh, không án mạng.
  - Kim Sinh (báo tộc trưởng) → tộc trưởng bảo lãnh trước thần bổ.
  - Khảo hạch (giấu tài) → giả tầm thường trước Bạch Ngưng Băng.
- Chuyển sang `need`: Xích Thiết Xá Lợi (danh vọng 50), dẫn máu Huyết Cương vào lò (hiện khi có Huyết Lô, khóa nếu thiếu ký ức), Thiền lần hai, đưa bằng chứng qua Nhược Nam.

**Nhân quả và đại sự bắt buộc:**
- *Đại sự bắt buộc* (không `cond`): khai khiếu, khảo hạch, thương đội, Bạch gia tuần tra, gặp Bạch Ngưng Băng, lang triều, lăng mộ lộ ra, **thần bổ lên núi**, Huyết Cương, trận cuối.
- *Nhân quả* (có `cond`):
  - **Kim Sinh chặn đường chỉ khi có Tửu Trùng** (nguyên tác: hắn ép mua rẻ Tửu Trùng). Có Tửu Trùng muộn thì hắn vẫn tìm tới khi thương đội còn trên núi, một lần.
  - Cổ Phú điều tra (đã giết Kim Sinh).
  - Vòng vây (thần bổ đang truy).
- Thần bổ lên núi vì thư Tiên Hạc Môn báo có truyền thừa Huyết Hải; vụ Kim Sinh chỉ là cớ. Đã giết Kim Sinh thì hắn để mắt tới ngươi (`tieHunt`). Không thì hắn lùng truyền thừa (`tieToTomb`) và vẫn đối đầu Huyết Cương.

**Sửa thêm:**
- Dò xét có xúc xắc: thua thì không mở lựa chọn ẩn (trước đây vẫn mở).
- Nút lựa chọn trong cảnh: tỉ lệ thành công bị nhân 100 lần (7000%); đã sửa và ghi tên chỉ số.

**Số đo:**
- `sim.cjs 600 6`: **42,3%**, kiếp đầu 8,3%.
- `LECH=1 sim.cjs 300 6`: **32,3%**.
