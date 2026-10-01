# UI polish P-02 — HUD, nhân vật và timeline

Ảnh được chụp trực tiếp từ `index.html`, không qua mockup `ui-v2`.

| Trạng thái | Desktop | Mobile |
|---|---|---|
| Trước P-02 | `before-hud-1440x900.png` | `before-hud-390x844.png` |
| Sau P-02 | `after-hud-1440x900.png` | `after-hud-390x844.png` |
| Sau khi tài nguyên đổi | `after-hud-delta-1440x900.png` | `after-hud-delta-390x844.png` |

Fixture delta: khí huyết −34, chân nguyên −12, nguyên thạch +20, tu vi +18, danh vọng +4 và một biến cố đang chờ. Mọi con số được tạo bằng cách thay đổi state thật rồi gọi `render()`; UI không dùng số minh họa hard-code.

Smoke test đã kiểm tra render đầu không hiện delta giả, độ dài và dấu của các thay đổi, trail trên thanh HP/chân nguyên, mốc timeline đang chờ, reduced motion, chiều cao HUD mobile và không tràn ngang ở 390px. Regression P-01 được chạy lại cùng lượt kiểm tra.
