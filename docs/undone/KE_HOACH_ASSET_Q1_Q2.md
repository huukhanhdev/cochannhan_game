# Kế hoạch asset Q1–Q2

Ngày gom tài liệu: 02/10/2026.

Nguồn và mapping asset được giữ chung, không đồng nghĩa mọi asset đã được duyệt hoặc tích hợp.

## Mục lục
- [KE_HOACH_NGUON_ASSET_CHUAN.md](#source-ke-hoach-nguon-asset-chuan-md)
- [KE_HOACH_ASSET_QUYEN_2.md](#source-ke-hoach-asset-quyen-2-md)

---

<a id="source-ke-hoach-nguon-asset-chuan-md"></a>

## KE_HOACH_NGUON_ASSET_CHUAN.md

**Trạng thái:** Đã có mapping/asset một phần; còn lộ trình sản xuất và tích hợp chưa xác nhận.

<a id="source-ke-hoach-nguon-asset-chuan-md-kế-hoạch--cơ-chế-thu-thập-asset-tu-tiên-chuẩn-cổ-chân-nhân-volume-1"></a>
## Kế Hoạch & Cơ Chế Thu Thập Asset Tu Tiên Chuẩn Cổ Chân Nhân (Volume 1)

> Tài liệu tổng kết phương pháp truy xuất, danh mục nhân vật đã cập nhật và lộ trình tích hợp toàn diện asset chuẩn nguyên tác vào Web Game Cổ Chân Nhân.

---

<a id="source-ke-hoach-nguon-asset-chuan-md-1-nguồn-gốc--phong-cách-nghệ-thuật-authentic-xianxia-aesthetic"></a>
### 1. Nguồn Gốc & Phong Cách Nghệ Thuật (Authentic Xianxia Aesthetic)

Thay vì dùng hình ảnh phong cách Tây hóa, hoạt hình anime hiện đại hoặc khung viền thẻ bài có chữ tiếng Anh/runic dị giới, toàn bộ asset mới thuộc bộ sưu tập **V2 Xianxia** được lấy từ nguồn **Concept Art / Donghua chính thức và minh họa cổ phong đỉnh cao của tác phẩm Cổ Chân Nhân (Reverend Insanity)**:
- **Phong cách**: Thủy mặc quốc phong (Ink wash painting), tà dị ma đạo, tiên hiệp cổ điển Trung Hoa kết hợp nét vẽ tả thực huyền ảo.
- **Dấu ấn nguyên tác**: Mỗi bức tranh đại cảnh đều mang trích đoạn thi từ hoặc danh ngôn kinh điển của nhân vật trong tiểu thuyết (ví dụ: *"Huyết đạo bất cô, di hại vạn cổ"*, *"Thiết diện vô tư huyết khả lãnh, Thiết gia Thiết Huyết Lãnh"*, *"Lưỡng thế giai phó gia tộc nan, nhất chỉ thanh thư thế nhân thương"*...).

---

<a id="source-ke-hoach-nguon-asset-chuan-md-2-cơ-chế-thu-thập--thuật-toán-tải-ảnh-trực-tiếp"></a>
### 2. Cơ Chế Thu Thập & Thuật Toán Tải Ảnh Trực Tiếp

<a id="source-ke-hoach-nguon-asset-chuan-md-21-phân-tích-nhật-ký-cộng-đồng-wiki-upload-log"></a>
#### 2.1. Phân Tích Nhật Ký Cộng Đồng (Wiki Upload Log)
Hệ thống truy xuất thông qua MediaWiki API và nhật ký `Special:Log/upload` của kho lưu trữ Fandom Reverend Insanity (chiến dịch số hóa đại mỹ thuật Cổ Chân Nhân).

<a id="source-ke-hoach-nguon-asset-chuan-md-22-thuật-toán-tạo-url-trực-tiếp-bằng-sharding-hash-md5"></a>
#### 2.2. Thuật Toán Tạo URL Trực Tiếp Bằng Sharding Hash (MD5)
Để tránh rào cản Cloudflare / CAPTCHA của giao diện web và tải được **file gốc chất lượng cao nhất (2K - 4K)**, hệ thống sử dụng thuật toán hash đường dẫn MediaWiki:

```javascript
const crypto = require('crypto');

function getDirectMediaUrl(filename) {
  // Chuẩn hóa tên file: thay khoảng trắng bằng dấu gạch dưới
  const cleanName = filename.replace(/ /g, '_');
  // Tính MD5 hash của tên file
  const md5 = crypto.createHash('md5').update(cleanName).digest('hex');
  // Cấu trúc URL: images / ký tự đầu / 2 ký tự đầu / tên file
  return `https://static.wikia.nocookie.net/reverend-insanity/images/${md5[0]}/${md5.substring(0, 2)}/${encodeURIComponent(cleanName)}`;
}
```

**Ví dụ thực tế**:
- `Fang_Zheng.png` $\rightarrow$ MD5: `6e...` $\rightarrow$ `https://static.wikia.nocookie.net/reverend-insanity/images/6/6e/Fang_Zheng.png`
- `Gu_Yue_Qing_Shu.jpg` $\rightarrow$ MD5: `78...` $\rightarrow$ `https://static.wikia.nocookie.net/reverend-insanity/images/7/78/Gu_Yue_Qing_Shu.jpg`
- `Chainsaw_Golden_Centipede_Gu.png` $\rightarrow$ MD5: `fa...` $\rightarrow$ `https://static.wikia.nocookie.net/reverend-insanity/images/f/fa/Chainsaw_Golden_Centipede_Gu.png`

---

<a id="source-ke-hoach-nguon-asset-chuan-md-3-cấu-trúc-thư-mục-mới-assetsv2_xianxia"></a>
### 3. Cấu Trúc Thư Mục Mới (`assets/v2_xianxia/`)

Nhằm tách biệt rõ ràng giữa asset mặc định cũ và asset chuẩn tiên hiệp mới, toàn bộ dữ liệu được tổ chức tại thư mục riêng:

```
assets/v2_xianxia/
├── raw_masters/             # File gốc độ phân giải cao (1440p - 4K), còn nguyên thi từ nguyên tác
│   ├── fangzheng_raw.png
│   ├── qingshu_raw.jpg
│   ├── tieruonan_raw.png
│   ├── tiexueleng_raw.png
│   ├── nhatdai_raw.png      (Huyết Long Tống Tử Tinh / Huyết Cương Ma Đầu)
│   ├── bai_nu_raw.png       (Bạch Ngưng Băng nữ tóc bạc cầm kiếm băng)
│   ├── shen_cui_raw.png     (Trầm Thúy e ấp sau khăn lụa lam)
│   ├── flower_wine_monk_raw.png (Hoa Tửu Hành Giả ma tăng xăm mình)
│   ├── cuxikimngo_raw.png   (Cử Xỉ Kim Ngô hoàng kim cưa máy)
│   ├── huyetlo_raw.png      (Huyết Lô Cổ đầu lâu ngọc huyết)
│   ├── thiennguyenbaolien_raw.png (Thiên Nguyên Bảo Liên bạch ngọc)
│   ├── wood_charm_raw.png   (Mộc Mị Cổ)
│   ├── blood_curtain_raw.jpg(Huyết Mạc Thiên Hoa Cổ)
│   ├── earthwolf_spider_raw.png (Thiên Lý Địa Lang Chu)
│   ├── blue_bird_ice_coffin_raw.png (Lam Điểu Băng Quan Cổ)
│   ├── scene_fy_bnb_vol1.jpg (Cảnh Phương Nguyên cưỡi nhện đối đầu Bạch Ngưng Băng cưỡi bạch xà)
│   ├── scene_fy_bnb_vol2.webp (Cảnh đầu Quyển 2: bè tre xuôi dòng, hạc bay)
│   └── scene_bnb_ice.png    (Cảnh Bạch Ngưng Băng tự bạo hóa tượng băng)
│
└── avatars/                 # Đã crop chuẩn tỉ lệ 1:1, căn giữa khuôn mặt, độ phân giải 600x600 sắc nét
    ├── n_phuongchinh.jpg
    ├── n_thanhthu.jpg
    ├── n_thietnhuocnam.jpg
    ├── n_tiexueleng.jpg
    ├── n_nhatdai.jpg
    ├── n_bai.jpg            (Bạch Ngưng Băng Nam - tranh thủy mặc tuyết sương)
    ├── n_bai_nu.jpg         (Bạch Ngưng Băng Nữ - tiên khí lạnh lùng)
    ├── n_tramthuy.jpg
    └── n_hoatuu.jpg
```

---

<a id="source-ke-hoach-nguon-asset-chuan-md-4-bảng-đối-soát-cập-nhật-avatar-toàn-diện-quyển-1"></a>
### 4. Bảng Đối Soát Cập Nhật Avatar Toàn Diện Quyển 1

| Nhân vật | Khóa Game | Nguồn File Gốc | Đặc điểm mỹ thuật V2 | Vị trí runtime trong Game |
|---|---|---|---|---|
| **Phương Nguyên (Quyển 1)** | `p_hero` / `p_hero_q1` | `media_1790821937248.png` (577×1024) | Ma tôn tóc đen dài, đạo bào đen tuyền, kết thủ ấn bí ẩn, phong thái thâm trầm lãnh khốc | `assets/local/art/p_hero.png`<br>`assets/art/p_hero.jpg`<br>`assets/v2_xianxia/avatars/p_hero_q1_avatar.jpg` |
| **Cổ Nguyệt Phương Chính** | `phuongchinh` | `fangzheng.png` (2048×1152) | Thiếu niên ngạo khí, trán đeo ngọc đới, đạo bào Cổ Nguyệt | `assets/npc/n_phuongchinh.jpg`<br>`assets/art/p_phuongchinh.jpg` |
| **Cổ Nguyệt Thanh Thư** | `thanhthu` | `qingshu.jpg` (2560×1440) | Công tử nho nhã, tóc xanh lam bay trong gió, ôn nhu như ngọc | `assets/npc/n_thanhthu.jpg`<br>`assets/art/p_thanhthu.jpg` |
| **Thiết Nhược Nam** | `nhuocnam` | `tieruonan.png` (2560×1440) | Nữ bổ khoái kiên cường, mắt đao sắc sảo, giáp da cổ trang | `assets/npc/n_thietnhuocnam.jpg`<br>`assets/art/p_thietnhuocnam.jpg` |
| **Thiết Huyết Lãnh** | `tiexueleng` | `tiexueleng.png` (2560×1440) | Thần bổ uy nghiêm, mặt nạ đồng cổ phác, ánh mắt phong sương | `assets/npc/n_tiexueleng.jpg`<br>`assets/npc/n_giave.jpg`<br>`assets/art/p_giave.jpg` |
| **Cổ Nguyệt Nhất Đại** | `nhatdai` | `songzixing.png` (2560×1440) | Huyết Cương thi tổ, cánh dơi đao dực, nanh ma đạo, sương máu | `assets/npc/n_nhatdai.jpg`<br>`assets/art/p_nhatdai.jpg`<br>`assets/art/p_huyetquy.jpg` |
| **Bạch Ngưng Băng (Nam)** | `bai` | `p_bai.jpg` (Bạch y tuyết sơn) | Mỹ nam tử tóc bạc phiêu dật, phong cách quốc họa thủy mặc | `assets/npc/n_bai.jpg`<br>`assets/art/p_bai_male.jpg` |
| **Bạch Ngưng Băng (Nữ)** | `bainu` / `p_bai_female` | `Bai_Ning_Bing_18.png` (2796×1754) | Tuyệt sắc hàn băng, tóc bạc tung bay, cầm băng nhận trên nền mực đen | `assets/npc/n_bai_nu.jpg`<br>`assets/npc/n_bai_female.jpg`<br>`assets/art/p_bai_female.jpg` |
| **Trầm Thúy** | `tramthuy` | `Shen_Cui.png` (3848×2156) | Tỳ nữ y phục thanh ngọc, e ấp nửa mặt sau dải lụa lam | `assets/npc/n_tramthuy.jpg` |
| **Hoa Tửu Hành Giả** | `hoatuu` | `Flower_Wine_Monk.png` (2560×1440) | Tà tăng ngũ chuyển phong trần, mình đầy hình xăm, áo cà sa rách | `assets/npc/n_hoatuu.jpg` |
| **Các gia lão tộc** | `toctruong`, `caumo`, `mactran`, `xichluyen`, `giaphu` | Tranh cổ chân dung triều Minh/Thanh | Giữ nguyên các bức chân dung cổ Trung Quốc trong bảo tàng | `assets/npc/n_*.jpg` |

---

<a id="source-ke-hoach-nguon-asset-chuan-md-5-lộ-trình-triển-khai-tiếp-theo-theo-yêu-cầu-user"></a>
### 5. Lộ Trình Triển Khai Tiếp Theo (Theo Yêu Cầu User)

1. **Bước 1 (Đã hoàn thành)**:
   - Thu thập toàn bộ Master Asset chuẩn tu tiên Cổ Chân Nhân.
   - Crop chuẩn avatar 1:1 cho toàn bộ dàn nhân vật Quyển 1.
   - Đồng bộ vào hệ thống hiển thị của Scene Engine (`js/ui.js`, `js/present.js`, `assets/local/manifest.js`).
   - Kiểm tra xác thực `tools/check.cjs` (0 lỗi) và bot test (`sim.cjs 100 6`) giữ vững tỷ lệ thắng cân bằng 52%.

2. **Bước 2 (Giai đoạn tiếp theo - Items & Cổ Trùng)**:
   - Cắt và xử lý nền tối/trong suốt cho:
     + `cuxikimngo` (Cứ Xỉ Kim Ngô)
     + `huyetlo` (Huyết Lô Cổ)
     + `thiennguyenbaolien` (Thiên Nguyên Bảo Liên)
     + `mokmi` (Mộc Mị Cổ)
     + `huyetmac` (Huyết Mạc Thiên Hoa Cổ)
     + `diangchu` (Thiên Lý Địa Lang Chu)
   - Đưa vào `assets/gu/` và cập nhật từ điển hiển thị cổ trùng.

3. **Bước 3 (Giai đoạn minh họa sự kiện lớn - Scene Backgrounds)**:
   - Tích hợp ảnh đại cảnh 16:9 vào các sự kiện then chốt của Engine:
     + `c_lang2`: Mộc Mị Cổ của Thanh Thư.
     + `c_bai`: Trận chiến tuyết sơn với Lam Điểu Băng Quan.
     + `c_nhatdai`: Huyết Mạc Thiên Hoa và Huyết Cương Nhất Đại thức tỉnh.
     + `c_final`: Bạch Ngưng Băng tự bạo băng phong Thanh Mao Sơn (`bnb_ice`), Phương Nguyên cưỡi nhện thoát thân (`vol1`), và đầu Quyển 2 trên bè tre (`vol2`).

---

<a id="source-ke-hoach-asset-quyen-2-md"></a>

## KE_HOACH_ASSET_QUYEN_2.md

**Trạng thái:** Đã có mapping/asset một phần; còn lộ trình sản xuất và tích hợp chưa xác nhận.

<a id="source-ke-hoach-asset-quyen-2-md-kế-hoạch-asset--bản-đồ-gắn-ảnh-chuẩn-cổ-chân-nhân-quyển-2-ma-đầu-loạn-thế"></a>
## Kế Hoạch Asset & Bản Đồ Gắn Ảnh Chuẩn Cổ Chân Nhân (Quyển 2: Ma Đầu Loạn Thế)

> **Tài liệu hướng dẫn chi tiết**: Toàn bộ kho tư liệu hình ảnh, cơ chế phân giải sharding hash, danh mục nhân vật, cổ trùng, bối cảnh đại sự kiện và quy tắc gắn ảnh (mapping) vào mã nguồn game cho Quyển 2 (Nam Cương Thương Gia Thành & Tam Vương Phúc Địa - Trung Châu Đãng Hồn Sơn).

---

<a id="source-ke-hoach-asset-quyen-2-md-1-tổng-quan--phong-cách-nghệ-thuật-quyển-2"></a>
### 1. Tổng Quan & Phong Cách Nghệ Thuật Quyển 2

Nếu Quyển 1 mang gam màu u tối, lạnh lẽo của tuyết sơn Thanh Mao và sự diệt vong tàn khốc của ba đại gia tộc, thì **Quyển 2 (Ma Đầu Loạn Thế)** mở ra một thế giới tu tiên rộng lớn, hùng vĩ và khốc liệt hơn gấp bội:
- **Thương Gia Thành**: Đô thành phồn hoa tột bực của Nam Cương, đèn lồng rực rỡ, diễn võ trường đẫm máu, thương chiến ngấm ngầm.
- **Tam Xoa Sơn & Tam Vương Phúc Địa**: Ba đạo trụ quang thông thiên (Xích, Lam, Hoàng), nơi Chính - Ma tề tụ, quỷ kế đa đoan, luyện chế Tiên Cổ nghịch thiên.
- **Thiên Thê Sơn & Hồ Tiên Phúc Địa**: Cảnh sắc Trung Châu tuyết phủ bồng bềnh, cung điện tiên gia trên mây, thiếu nữ hồ tiên ngây thơ cô độc.

Toàn bộ Master Art đều được thu thập từ nguồn **Concept Art / Donghua chính thức Cổ Chân Nhân**, giữ trọn vẹn chất thủy mặc ma mị, câu thơ nguyên tác chữ Hán cổ phác và tỉ lệ chuẩn xác.

---

<a id="source-ke-hoach-asset-quyen-2-md-2-danh-mục-asset-master--avatar-11-đã-tải-về-assetsv2_xianxia"></a>
### 2. Danh Mục Asset Master & Avatar 1:1 Đã Tải Về (`assets/v2_xianxia/`)

Tất cả các file ảnh gốc siêu nét (2K - 4K) được lưu duy nhất tại `assets/v2_xianxia/raw_masters/`, còn các avatar đã crop chuẩn 1:1 (600x600) lưu duy nhất tại runtime `assets/npc/` (mỗi nhân vật đúng 1 file duy nhất, loại bỏ hoàn toàn các file nhân bản/alias).

<a id="source-ke-hoach-asset-quyen-2-md-21-nhân-vật-trọng-yếu-characters"></a>
#### 2.1. Nhân Vật Trọng Yếu (Characters)

| STT | Tên Nhân Vật | Khóa Game (`who`) | File Master (2K/4K) | File Avatar Runtime (600x600) | Ghi Chú Nguyên Tác |
|:---:|---|---|---|---|---|
| 1 | **Thương Tâm Từ** | `tamtu` / `shangxinci` | `shang_xin_ci_raw.png` (2560×1440) | `assets/npc/n_shangxinci.jpg` | Thiếu nữ áo vàng thanh tú, tính tình thiện lương thuần hậu, thiếu chủ thứ 16 Thương gia |
| 2 | **Thương Yến Phi** | `yenphi` / `shangyanfei` | `shang_yan_fei_raw.jpg` (3848×2156) | `assets/npc/n_shangyanfei.jpg` | Tộc trưởng Thương gia, Ngũ chuyển Viêm Ma, bá khí ngút trời, tóc đỏ áo choàng tím |
| 3 | **Ngụy Ương** | `nguyuong` / `weiyang` | `wei_yang_raw.jpg` (3836×2160) | `assets/npc/n_weiyang.jpg` | Tam chuyển đỉnh phong Quang đạo, nghĩa khí ngút trời, đại tướng tâm phúc của Thương Yến Phi |
| 4 | **Thiết Nhược Nam (Q2)** | `nhuocnam` (Book 2) | `tie_ruo_nan_q2_raw.jpg` (3848×2156) | `assets/npc/n_nhuocnam_q2.jpg` | Tiểu Thần Bộ Thiết gia, thiết diện che nửa mặt, chiến giáp nghiêm cậy, ánh mắt kiên định báo thù |
| 5 | **Phượng Kim Hoàng** | `kimhoang` / `fengjinhuang` | `feng_jin_huang_raw.png` (2560×1440) | `assets/npc/n_fengjinhuang.jpg` | Thiên kiêu Linh Duyên Trai Trung Châu, trâm phượng áo trắng kim tuyến, kiêu ngạo vô song |
| 6 | **Địa Linh Tiểu Hồ Tiên** | `tieuhotien` / `littlehu` | `little_hu_raw.png` (2560×1440) | `assets/npc/n_littlehu.jpg` | Địa linh bé gái ngây thơ đáng yêu, áo hồng phấn, tai hồ ly và đuôi tuyết trắng xù |
| 7 | **Địa Linh Bá Quy** | `baquy` / `bagui` | `ba_gui_raw.jpg` (3848×2156) | `assets/npc/n_baquy.jpg` | Thần quy cự đại rêu phong ngàn năm, chấp niệm của Tam Vương phúc địa |
| 8 | **Tiêu Mang** | `tieumang` / `xiaomang` | `xiao_mang_raw.png` (2560×1440) | `assets/npc/n_xiaomang.jpg` | Ngũ chuyển Quang đạo Tiêu gia, cầm quạt ngọc, danh môn chính đạo nhưng tâm cơ giả dối |
| 9 | **Hồ Mị Nhi** | `himi` / `humeier` | `hu_mei_er_raw.jpg` (2560×1440) | `assets/npc/n_humeier.jpg` | Mị hoặc nữ tu Tam Xoa Sơn, xiêm y tím quyến rũ, thủ đoạn giảo quyệt |
| 10 | **Phong Thiên Ngữ** | `phongthienngu` / `fengtianyu` | `feng_tian_yu_raw.png` (2560×1440) | `assets/npc/n_fengtianyu.jpg` | Luyện đạo tông sư Phong gia, thiên tài luyện cổ bị Phương Nguyên dùng Nô Lệ Cổ thao túng |
| 11 | **Cừu Cửu** | `cuucuu` / `choujiu` | `chou_jiu_raw.jpg` (1924×1078) | `assets/npc/n_choujiu.jpg` | Sát Nhân Quỷ Y, môn đồ bí mật của Môn Phái Môn Cổ, áo đen đầu lâu ma quái |

---

<a id="source-ke-hoach-asset-quyen-2-md-22-cổ-trùng-thần-cấp-quyển-2-gu-worm-masters"></a>
#### 2.2. Cổ Trùng Thần Cấp Quyển 2 (Gu Worm Masters)

| STT | Cổ Trùng | File Master | Cấp Bậc | Mô Tả & Tác Dụng Trong Nguyên Tác |
|:---:|---|---|:---:|---|
| 1 | **Định Tiên Du Cổ** | `fixed_immortal_travel_raw.png` | Lục chuyển Tiên Cổ | Cánh bướm bích ngọc lục bảo phát sáng. *"Thiên nhai hà xử bất khả khứ, chỉ bằng một niệm Định Tiên Du"*. Cổ giúp xuyên không gian tức thì. |
| 2 | **Đệ Nhị Không Khiếu Cổ** | `second_aperture_raw.jpg` | Lục chuyển Tiên Cổ | Tạo ra không khiếu thứ hai trong cơ thể, phá vỡ hạn lượng chân nguyên trần thế. |
| 3 | **Mộng Dực Cổ** | `dream_wings_raw.jpg` | Lục chuyển Tiên Cổ | Đôi cánh mộng ảo ngũ sắc, bản mệnh cổ của Phượng Kim Hoàng, chìa khóa vào mộng cảnh. |
| 4 | **Vô Túc Điểu Cổ** | `footless_bird_raw.png` | Tam chuyển Cổ | Chim xương không chân bay vạn dặm không ngừng, chạm đất là vỡ tan, tốc độ trốn chạy đỉnh cao. |

<a id="source-ke-hoach-asset-quyen-2-md-23-đại-cảnh-minh-họa-sự-kiện-epic-scene-illustrations"></a>
#### 2.3. Đại Cảnh Minh Họa Sự Kiện (Epic Scene Illustrations)

Bên cạnh chân dung nhân vật và cổ trùng, game đã được nâng cấp hệ thống `EVENT_ILLUSTRATIONS` trong `js/battle.js` để tự động hiển thị các bức họa đại cảnh tráng lệ ở đầu thẻ sự kiện (`story-art`):

| STT | Mã Sự Kiện | Tên Sự Kiện / Bối Cảnh | File Minh Họa Runtime | Mô Tả Tranh & Dấu Ấn Nguyên Tác |
|:---:|---|---|---|---|
| 1 | `c_khaikhieu` | **Khai Khiếu Đầu Đời** | `scene_fy_moonlight.jpg` | Phương Nguyên 15 tuổi ngắm nhìn Nguyệt Quang Cổ phát sáng u lam trong lòng bàn tay. |
| 2 | `c_lang2` | **Thanh Thư Tử Trận** | `scene_qingshu_vs_bai.jpg` | Cổ Nguyệt Thanh Thư kích hoạt Mộc Mị Cổ hóa người cây, huyết chiến Bạch Ngưng Băng giữa bão tuyết. |
| 3 | `c_bai` | **Chạm Trán Bạch Ngưng Băng** | `scene_fy_bnb_vol1.jpg` | Phương Nguyên cưỡi Thiên Lý Địa Lang Chu đối đầu Bạch Ngưng Băng cưỡi bạch xà trên vách núi. |
| 4 | `c_nhatdai` | **Huyết Cương Thức Tỉnh** | `scene_first_ancestor_blood.jpg` | Thủy tổ Cổ Nguyệt Nhất Đại phá quan thức tỉnh, biển máu ngút trời, cánh dơi đao dực ma đạo. |
| 5 | `c_final` | **Bạch Ngưng Băng Tự Bạo** | `scene_bnb_ice.jpg` | Bắc Minh Băng Phách tự bạo đóng băng toàn bộ Thanh Mao Sơn thành thế giới điêu khắc tuyết vĩnh cửu. |
| 6 | `c_final` (nhánh tế lò) | **Tế Luyện Huyết Lô Cổ** | `scene_blood_skull_refine.jpg` | Phương Nguyên tế máu tộc nhân nuôi Huyết Lô Cổ nâng cao tư chất, sát khí ngút trời. |
| 7 | `q2_hl_be` | **Xuôi Dòng Hoàng Long** | `scene_fy_bnb_vol2.jpg` | Bè tre chở Phương Nguyên và Bạch Ngưng Băng xuôi dòng sông Hoàng Long, hồng hạc bay lượn trên mây. |
| 8 | `q2_bc_ket` | **Cưỡi Vô Túc Điểu** | `scene_footless_bird_fly.jpg` | Phương Nguyên (Hắc Thổ) và Bạch Ngưng Băng cưỡi Vô Túc Điểu Cổ bay qua biển mây Bạch Cốt Sơn. |
| 9 | `q2_tc_phe` / `q2_td_cuu` | **Bên Thương Tâm Từ** | `scene_fy_shangxinci.jpg` | Phương Nguyên hộ tống Thương Tâm Từ trong đoàn thương buôn vượt Nam Cương hiểm trở. |
| 10 | `q2_tx_tamxoa` / `q2_tx_himi` | **Tam Vương Phúc Địa** | `scene_three_kings_entrance.jpg` | Ba đạo quang trụ khổng lồ Xích - Lam - Hoàng chiếu rọi đỉnh Tam Xoa Sơn, quần hùng tề tựu. |
| 11 | `q2_bq_phong` / `q2_pb_luyen` | **Luyện Định Tiên Du Cổ** | `scene_refine_fixed_immortal.jpg` | Phong Thiên Ngữ trợ lực Phương Nguyên luyện chế Định Tiên Du giữa vạc đồng sôi sục. |
| 12 | `q2_ng_dangHon` | **Tuyết Phong Đãng Hồn Sơn** | `scene_danghun_mountain.jpg` | Đãng Hồn Sơn sừng sững tại Trung Châu giữa biển tuyết, mây cuộn và quỷ hồn gào thét. |
| 13 | `q2_pb_hotien` | **Nhận Chủ Tiểu Hồ Tiên** | `scene_little_hu_danghun.jpg` | Phương Nguyên đáp xuống đỉnh Đãng Hồn Sơn trước Phượng Kim Hoàng, Tiểu Hồ Tiên rưng rưng nhận chủ. |

---

<a id="source-ke-hoach-asset-quyen-2-md-3-bản-đồ-gắn-ảnh-mapping-guide-vào-codebase"></a>
### 3. Bản Đồ Gắn Ảnh (Mapping Guide) Vào Codebase

<a id="source-ke-hoach-asset-quyen-2-md-31-hệ-thống-nhận-diện-chân-dung-speakerhtml--npc_img"></a>
#### 3.1. Hệ Thống Nhận Diện Chân Dung (`speakerHTML` & `NPC_IMG`)

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

<a id="source-ke-hoach-asset-quyen-2-md-32-bảng-ánh-xạ-chi-tiết-các-sự-kiện-quyển-2-jsq2js"></a>
#### 3.2. Bảng Ánh Xạ Chi Tiết Các Sự Kiện Quyển 2 (`js/q2/*.js`)

<a id="source-ke-hoach-asset-quyen-2-md-chương-3-thương-đội--chương-4-thương-gia-thành"></a>
##### Chương 3: Thương Đội & Chương 4: Thương Gia Thành
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

<a id="source-ke-hoach-asset-quyen-2-md-chương-6-tam-xoa-sơn--chương-7-ngũ-chuyển-giáng-lâm"></a>
##### Chương 6: Tam Xoa Sơn & Chương 7: Ngũ Chuyển Giáng Lâm
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

<a id="source-ke-hoach-asset-quyen-2-md-chương-8-bá-quy--chương-9-tiên-cổ-phản-bội"></a>
##### Chương 8: Bá Quy & Chương 9: Tiên Cổ Phản Bội
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

<a id="source-ke-hoach-asset-quyen-2-md-4-kiểm-thử-hệ-thống-quality-assurance"></a>
### 4. Kiểm Thử Hệ Thống (Quality Assurance)

1. **Kiểm tra dữ liệu**: Lệnh `node tools/check.cjs` đạt **0 lỗi** (Dữ liệu hoàn toàn khớp).
2. **Kiểm tra đồ họa**: Tất cả 11 avatar đã được crop chính xác vùng mặt, không còn tình trạng lệch tâm, giữ trọn ánh mắt thần thái nhân vật.
3. **Kiểm tra tương thích**: Tạo sẵn song song hai bộ tên file:
   - Tên theo mã nguồn VN (`n_tamtu.jpg`, `n_yenphi.jpg`, `n_nguyuong.jpg`, `n_kimhoang.jpg`, `n_tieuhotien.jpg`, `n_tieumang.jpg`, `n_himi.jpg`, `n_phongthienngu.jpg`, `n_cuucuu.jpg`).
   - Tên theo Pinyin quốc tế (`n_shangxinci.jpg`, `n_shangyanfei.jpg`, `n_weiyang.jpg`, `n_fengjinhuang.jpg`, `n_littlehu.jpg`, `n_xiaomang.jpg`, `n_humeier.jpg`, `n_fengtianyu.jpg`, `n_choujiu.jpg`).
   Đảm bảo dù gọi theo định danh nào cũng tải chính xác 100%.

---

<a id="source-ke-hoach-asset-quyen-2-md-5-danh-sách-file-cần-đưa-vào-commit-git-add"></a>
### 5. Danh Sách File Cần Đưa Vào Commit (Git Add)

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
