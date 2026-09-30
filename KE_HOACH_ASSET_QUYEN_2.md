# Kế Hoạch Asset & Bản Đồ Gắn Ảnh Chuẩn Cổ Chân Nhân (Quyển 2: Ma Đầu Loạn Thế)

> **Tài liệu hướng dẫn chi tiết**: Toàn bộ kho tư liệu hình ảnh, cơ chế phân giải sharding hash, danh mục nhân vật, cổ trùng, bối cảnh đại sự kiện và quy tắc gắn ảnh (mapping) vào mã nguồn game cho Quyển 2 (Nam Cương Thương Gia Thành & Tam Vương Phúc Địa - Trung Châu Đãng Hồn Sơn).

---

## 1. Tổng Quan & Phong Cách Nghệ Thuật Quyển 2

Nếu Quyển 1 mang gam màu u tối, lạnh lẽo của tuyết sơn Thanh Mao và sự diệt vong tàn khốc của ba đại gia tộc, thì **Quyển 2 (Ma Đầu Loạn Thế)** mở ra một thế giới tu tiên rộng lớn, hùng vĩ và khốc liệt hơn gấp bội:
- **Thương Gia Thành**: Đô thành phồn hoa tột bực của Nam Cương, đèn lồng rực rỡ, diễn võ trường đẫm máu, thương chiến ngấm ngầm.
- **Tam Xoa Sơn & Tam Vương Phúc Địa**: Ba đạo trụ quang thông thiên (Xích, Lam, Hoàng), nơi Chính - Ma tề tụ, quỷ kế đa đoan, luyện chế Tiên Cổ nghịch thiên.
- **Thiên Thê Sơn & Hồ Tiên Phúc Địa**: Cảnh sắc Trung Châu tuyết phủ bồng bềnh, cung điện tiên gia trên mây, thiếu nữ hồ tiên ngây thơ cô độc.

Toàn bộ Master Art đều được thu thập từ nguồn **Concept Art / Donghua chính thức Cổ Chân Nhân**, giữ trọn vẹn chất thủy mặc ma mị, câu thơ nguyên tác chữ Hán cổ phác và tỉ lệ chuẩn xác.

---

## 2. Danh Mục Asset Master & Avatar 1:1 Đã Tải Về (`assets/v2_xianxia/`)

Tất cả các file ảnh gốc siêu nét (2K - 4K) được lưu tại `assets/v2_xianxia/raw_masters/`, còn các avatar đã crop căn giữa khuôn mặt (600x600) lưu tại `assets/v2_xianxia/avatars/`, đồng thời tự động đồng bộ vào runtime `assets/npc/` và `assets/art/`.

### 2.1. Nhân Vật Trọng Yếu (Characters)

| STT | Tên Nhân Vật | Khóa Game (`who`) | File Master (2K/4K) | File Avatar 1:1 (600x600) | Ghi Chú Nguyên Tác |
|:---:|---|---|---|---|---|
| 1 | **Thương Tâm Từ** | `tamtu` / `shangxinci` | `shang_xin_ci_raw.png` (2560×1440) | `n_shangxinci.jpg`<br>`n_tamtu.jpg` | Thiếu nữ áo vàng thanh tú, tính tình thiện lương thuần hậu, thiếu chủ thứ 16 Thương gia |
| 2 | **Thương Yến Phi** | `yenphi` / `shangyanfei` | `shang_yan_fei_raw.jpg` (3848×2156) | `n_shangyanfei.jpg`<br>`n_yenphi.jpg` | Tộc trưởng Thương gia, Ngũ chuyển Viêm Ma, bá khí ngút trời, tóc đỏ áo choàng tím |
| 3 | **Ngụy Ương** | `nguyuong` / `weiyang` | `wei_yang_raw.jpg` (3836×2160) | `n_weiyang.jpg`<br>`n_nguyuong.jpg` | Tam chuyển đỉnh phong Quang đạo, nghĩa khí ngút trời, đại tướng tâm phúc của Thương Yến Phi |
| 4 | **Thiết Nhược Nam (Q2)** | `nhuocnam` (Book 2) | `tie_ruo_nan_q2_raw.jpg` (3848×2156) | `n_nhuocnam_q2.jpg` | Tiểu Thần Bộ Thiết gia, thiết diện che nửa mặt, chiến giáp nghiêm cậy, ánh mắt kiên định báo thù |
| 5 | **Phượng Kim Hoàng** | `kimhoang` / `fengjinhuang` | `feng_jin_huang_raw.png` (2560×1440) | `n_fengjinhuang.jpg`<br>`n_kimhoang.jpg` | Thiên kiêu Linh Duyên Trai Trung Châu, trâm phượng áo trắng kim tuyến, kiêu ngạo vô song |
| 6 | **Địa Linh Tiểu Hồ Tiên** | `tieuhotien` / `littlehu` | `little_hu_raw.png` (2560×1440) | `n_littlehu.jpg`<br>`n_tieuhotien.jpg` | Địa linh bé gái ngây thơ đáng yêu, áo hồng phấn, tai hồ ly và đuôi tuyết trắng xù |
| 7 | **Địa Linh Bá Quy** | `baquy` / `bagui` | `ba_gui_raw.jpg` (3848×2156) | `n_baquy.jpg` | Thần quy cự đại rêu phong ngàn năm, chấp niệm của Tam Vương phúc địa |
| 8 | **Tiêu Mang** | `tieumang` / `xiaomang` | `xiao_mang_raw.png` (2560×1440) | `n_xiaomang.jpg`<br>`n_tieumang.jpg` | Ngũ chuyển Quang đạo Tiêu gia, cầm quạt ngọc, danh môn chính đạo nhưng tâm cơ giả dối |
| 9 | **Hồ Mị Nhi** | `himi` / `humeier` | `hu_mei_er_raw.jpg` (2560×1440) | `n_humeier.jpg`<br>`n_himi.jpg` | Mị hoặc nữ tu Tam Xoa Sơn, xiêm y tím quyến rũ, thủ đoạn giảo quyệt |
| 10 | **Phong Thiên Ngữ** | `phongthienngu` / `fengtianyu` | `feng_tian_yu_raw.png` (2560×1440) | `n_fengtianyu.jpg`<br>`n_phongthienngu.jpg` | Luyện đạo tông sư Phong gia, thiên tài luyện cổ bị Phương Nguyên dùng Nô Lệ Cổ thao túng |
| 11 | **Cừu Cửu** | `cuucuu` / `choujiu` | `chou_jiu_raw.jpg` (1924×1078) | `n_choujiu.jpg`<br>`n_cuucuu.jpg` | Sát Nhân Quỷ Y, môn đồ bí mật của Môn Phái Môn Cổ, áo đen đầu lâu ma quái |

---

### 2.2. Cổ Trùng Thần Cấp Quyển 2 (Gu Worm Masters)

| STT | Cổ Trùng | File Master | Cấp Bậc | Mô Tả & Tác Dụng Trong Nguyên Tác |
|:---:|---|---|:---:|---|
| 1 | **Định Tiên Du Cổ** | `fixed_immortal_travel_raw.png` | Lục chuyển Tiên Cổ | Cánh bướm bích ngọc lục bảo phát sáng. *"Thiên nhai hà xử bất khả khứ, chỉ bằng một niệm Định Tiên Du"*. Cổ giúp xuyên không gian tức thì. |
| 2 | **Đệ Nhị Không Khiếu Cổ** | `second_aperture_raw.jpg` | Lục chuyển Tiên Cổ | Tạo ra không khiếu thứ hai trong cơ thể, phá vỡ hạn lượng chân nguyên trần thế. |
| 3 | **Mộng Dực Cổ** | `dream_wings_raw.jpg` | Lục chuyển Tiên Cổ | Đôi cánh mộng ảo ngũ sắc, bản mệnh cổ của Phượng Kim Hoàng, chìa khóa vào mộng cảnh. |
| 4 | **Vô Túc Điểu Cổ** | `footless_bird_raw.png` | Tam chuyển Cổ | Chim xương không chân bay vạn dặm không ngừng, chạm đất là vỡ tan, tốc độ trốn chạy đỉnh cao. |

---

## 3. Bản Đồ Gắn Ảnh (Mapping Guide) Vào Codebase

### 3.1. Hệ Thống Nhận Diện Chân Dung (`speakerHTML` & `NPC_IMG`)

Trong `js/ui.js` và `js/present.js`:
- Mỗi khi hộp thoại sự kiện xuất hiện (`ev.who`), hệ thống sẽ gọi `speakerHTML(k)`.
- `speakerHTML` tra cứu:
  1. `NPC_IMG[k]`: Nếu trả về chuỗi hoặc hàm $\rightarrow$ trỏ tới `assets/npc/${name}.jpg`.
  2. Fallback `WHO_ART[k]`: Trỏ tới `assets/art/${name}.jpg`.
- **Cơ chế đặc biệt cho Thiết Nhược Nam**:
  ```javascript
  nhuocnam: () => (typeof S !== 'undefined' && S.book === 2 ? 'n_nhuocnam_q2' : 'n_thietnhuocnam')
  ```
  $\rightarrow$ Ở Quyển 1 tự động hiển thị cô gái áo vải mộc mạc. Sang Quyển 2 tự động chuyển sang Tiểu Thần Bộ đeo mặt nạ sắt uy nghi!

### 3.2. Bảng Ánh Xạ Chi Tiết Các Sự Kiện Quyển 2 (`js/q2/*.js`)

#### Chương 3: Thương Đội & Chương 4: Thương Gia Thành
- **Thương Tâm Từ** (`who: 'tamtu'`):
  - Sự kiện `q2_tc_phe`: Thương lượng chọn phe thiếu chủ.
  - Sự kiện `q2_td_cứu`: Phương Nguyên che chở đoàn buôn của nàng.
  - Avatar tải: `assets/npc/n_shangxinci.jpg` (hoặc `n_tamtu.jpg`).
- **Thương Yến Phi** (`who: 'yenphi'`):
  - Sự kiện `q2_tt_giayen`: Gia yến Thương gia, Phương Nguyên bán bí phương Cốt Thứ.
  - Avatar tải: `assets/npc/n_shangyanfei.jpg`.
- **Ngụy Ương** (`who: 'nguyuong'`):
  - Sự kiện `q2_tt_lucdao`: Ngụy Ương dẫn Phương Nguyên đi chọn lưu phái Lực đạo.
  - Sự kiện `q2_tt_dienvo`: Hướng dẫn quy tắc sinh tử diễn võ trường.
  - Avatar tải: `assets/npc/n_weiyang.jpg`.
- **Thiết Nhược Nam** (`who: 'nhuocnam'`):
  - Sự kiện `q2_tt_nhuocnam`: Nhược Nam cùng Thiết Đao Khổ tới Nam Thu Uyển điều tra án diệt môn Cổ Nguyệt.
  - Avatar tải: `assets/npc/n_nhuocnam_q2.jpg`.

#### Chương 6: Tam Xoa Sơn & Chương 7: Ngũ Chuyển Giáng Lâm
- **Hồ Mị Nhi** (`who: 'himi'`):
  - Sự kiện `q2_tx_himi`: Dụ dỗ Bạch Ngưng Băng và Phương Nguyên vào cạm bẫy liên minh.
  - Avatar tải: `assets/npc/n_humeier.jpg`.
- **Tiêu Mang** (`who: 'tieumang'`):
  - Sự kiện `q2_ng_tieumang`: Dùng Cổ cực quang công phá vách ngăn Tam Vương phúc địa.
  - Avatar tải: `assets/npc/n_xiaomang.jpg`.
- **Cừu Cửu** (`who: 'cuucuu'`):
  - Sự kiện `q2_ng_cuucuu`, `q2_bq_cuucuu`: Phương Nguyên dùng bí mật Môn Cổ tống tiền Quỷ Y.
  - Avatar tải: `assets/npc/n_choujiu.jpg`.
- **Phượng Kim Hoàng** (`who: 'kimhoang'`):
  - Sự kiện `q2_ng_dangHon`: Cuộc đua leo đỉnh Đãng Hồn Sơn tại Trung Châu.
  - Avatar tải: `assets/npc/n_fengjinhuang.jpg`.

#### Chương 8: Bá Quy & Chương 9: Tiên Cổ Phản Bội
- **Địa linh Bá Quy** (`who: 'baquy'`):
  - Sự kiện `q2_bq_lo`, `q2_bq_chapniem`, `q2_bq_tiennguyen`: Bá Quy truyền tống Phương Nguyên đi ám sát các cường giả ngũ chuyển.
  - Avatar tải: `assets/npc/n_baquy.jpg`.
- **Phong Thiên Ngữ** (`who: 'phongthienngu'`):
  - Sự kiện `q2_bq_phong`: Phương Nguyên bức bách thiên tài Phong gia làm thợ luyện chính vạc đồng.
  - Avatar tải: `assets/npc/n_fengtianyu.jpg`.
- **Tiểu Hồ Tiên** (`who: 'tieuhotien'`):
  - Sự kiện `q2_pb_hotien`: Phương Nguyên dùng Định Tiên Du bay thẳng tới đỉnh Đãng Hồn Sơn, chạm tay vào thạch đài trước Phượng Kim Hoàng và nhận chủ Tiểu Hồ Tiên!
  - Avatar tải: `assets/npc/n_littlehu.jpg`.

---

## 4. Kiểm Thử Hệ Thống (Quality Assurance)

1. **Kiểm tra dữ liệu**: Lệnh `node tools/check.cjs` đạt **0 lỗi** (Dữ liệu hoàn toàn khớp).
2. **Kiểm tra đồ họa**: Tất cả 11 avatar đã được crop chính xác vùng mặt, không còn tình trạng lệch tâm, giữ trọn ánh mắt thần thái nhân vật.
3. **Kiểm tra tương thích**: Tạo sẵn song song hai bộ tên file:
   - Tên theo mã nguồn VN (`n_tamtu.jpg`, `n_yenphi.jpg`, `n_nguyuong.jpg`, `n_kimhoang.jpg`, `n_tieuhotien.jpg`, `n_tieumang.jpg`, `n_himi.jpg`, `n_phongthienngu.jpg`, `n_cuucuu.jpg`).
   - Tên theo Pinyin quốc tế (`n_shangxinci.jpg`, `n_shangyanfei.jpg`, `n_weiyang.jpg`, `n_fengjinhuang.jpg`, `n_littlehu.jpg`, `n_xiaomang.jpg`, `n_humeier.jpg`, `n_fengtianyu.jpg`, `n_choujiu.jpg`).
   Đảm bảo dù gọi theo định danh nào cũng tải chính xác 100%.

---

## 5. Danh Sách File Cần Đưa Vào Commit (Git Add)

Để cập nhật hoàn chỉnh lên repository, cần thực hiện:

```bash
# 1. Thư mục asset tiên hiệp V2 mới
git add assets/v2_xianxia/

# 2. Các avatar runtime được đồng bộ
git add assets/npc/n_*.jpg
git add assets/art/p_*.jpg
git add assets/local/art/p_shangxinci.jpg

# 3. Code logic nhận diện chân dung
git add js/ui.js
git add js/present.js

# 4. Kế hoạch và tài liệu hướng dẫn
git add KE_HOACH_ASSET_QUYEN_2.md
git add KE_HOACH_NGUON_ASSET_CHUAN.md
```
