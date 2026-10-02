# Thanh Mao Sơn Ký (青茅山记)

Game tu luyện theo lượt lấy bối cảnh *Cổ Chân Nhân* (Reverend Insanity) quyển một (Thanh Mao Sơn).

## Hướng dẫn chạy trên máy (Local)

Do PixiJS (WebGL) và hệ thống ảnh bảo vệ CORS chặn truy cập giao thức `file://`, game cần được chạy qua một web server cục bộ:

```bash
# 1. Di chuyển vào thư mục dự án
cd ~/cochannhan_game

# 2. Khởi chạy HTTP server (cổng 8000 hoặc 8088)
python3 -m http.server 8000
```

Sau đó mở trình duyệt và truy cập:
👉 **`http://localhost:8000`**

---

## Cấu trúc Asset & Chế độ Ảnh cá nhân

1. **Bản công khai (CC0 / Open Access):**
   - Mặc định sử dụng tranh sơn thủy và chân dung cổ nguồn mở CC0 từ Met Museum và Cleveland Museum of Art.
   - Tranh thảo trùng cổ đại cho cổ trùng.
2. **Bản cá nhân trên máy (`assets/local/`):**
   - Khi chạy trên máy cá nhân, file `assets/local/manifest.js` sẽ tự động kích hoạt ánh xạ tranh minh họa chất lượng cao (Huashi6, ACG, Manhua):
     - **Chân dung Phương Nguyên:** Tranh thủy mặc Phương Nguyên tà khí ngút trời (`local/art/p_hero.png`), phương án áo đen (`p_hero_black.png`), hoặc manhua (`p_hero_manhua.jpg`).
     - **Xuân Thu Thiền:** Ảnh cắt sạch 3D chi tiết con ve sầu không dính UI (`local/gu/g_xuanthu.jpg`).
     - **Bạch Ngưng Băng:** Tranh Huashi6 chất lượng cao (`local/art/p_bai.jpg`).
     - **Lôi Quan Lang Vương:** Quỷ lang lôi điện (`local/art/p_wolf_thunder.jpg`).
     - **Thanh Mao Sơn:** Toàn cảnh sơn trại hùng vĩ (`local/art/bg_title.jpg`).

---

## Kiểm tra cân bằng game tự động

Để chạy kịch bản mô phỏng 100 người chơi máy tự động chơi 6 kiếp:

```bash
node tools/sim.cjs 100 6
```
Tỉ lệ thắng mục tiêu: **15% – 35%** trong 6 lần chơi (một lần chơi kết thúc khi chết lúc Xuân Thu Thiền chưa hồi phục). Hiện đo được khoảng 33%.

Kiểm tra tính năng tua nhanh bằng ký ức:

```bash
node tools/ff_test.cjs 120
```
