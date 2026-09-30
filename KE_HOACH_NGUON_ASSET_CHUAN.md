# Kế Hoạch & Cơ Chế Thu Thập Asset Tu Tiên Chuẩn Cổ Chân Nhân (Volume 1)

> Tài liệu tổng kết phương pháp truy xuất, danh mục nhân vật đã cập nhật và lộ trình tích hợp toàn diện asset chuẩn nguyên tác vào Web Game Cổ Chân Nhân.

---

## 1. Nguồn Gốc & Phong Cách Nghệ Thuật (Authentic Xianxia Aesthetic)

Thay vì dùng hình ảnh phong cách Tây hóa, hoạt hình anime hiện đại hoặc khung viền thẻ bài có chữ tiếng Anh/runic dị giới, toàn bộ asset mới thuộc bộ sưu tập **V2 Xianxia** được lấy từ nguồn **Concept Art / Donghua chính thức và minh họa cổ phong đỉnh cao của tác phẩm Cổ Chân Nhân (Reverend Insanity)**:
- **Phong cách**: Thủy mặc quốc phong (Ink wash painting), tà dị ma đạo, tiên hiệp cổ điển Trung Hoa kết hợp nét vẽ tả thực huyền ảo.
- **Dấu ấn nguyên tác**: Mỗi bức tranh đại cảnh đều mang trích đoạn thi từ hoặc danh ngôn kinh điển của nhân vật trong tiểu thuyết (ví dụ: *"Huyết đạo bất cô, di hại vạn cổ"*, *"Thiết diện vô tư huyết khả lãnh, Thiết gia Thiết Huyết Lãnh"*, *"Lưỡng thế giai phó gia tộc nan, nhất chỉ thanh thư thế nhân thương"*...).

---

## 2. Cơ Chế Thu Thập & Thuật Toán Tải Ảnh Trực Tiếp

### 2.1. Phân Tích Nhật Ký Cộng Đồng (Wiki Upload Log)
Hệ thống truy xuất thông qua MediaWiki API và nhật ký `Special:Log/upload` của kho lưu trữ Fandom Reverend Insanity (chiến dịch số hóa đại mỹ thuật Cổ Chân Nhân).

### 2.2. Thuật Toán Tạo URL Trực Tiếp Bằng Sharding Hash (MD5)
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

## 3. Cấu Trúc Thư Mục Mới (`assets/v2_xianxia/`)

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

## 4. Bảng Đối Soát Cập Nhật Avatar Toàn Diện Quyển 1

| Nhân vật | Khóa Game | Nguồn File Gốc | Đặc điểm mỹ thuật V2 | Vị trí runtime trong Game |
|---|---|---|---|---|
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

## 5. Lộ Trình Triển Khai Tiếp Theo (Theo Yêu Cầu User)

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
