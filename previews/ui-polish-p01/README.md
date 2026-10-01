# UI polish P-01 — preview runtime

Ảnh được chụp trực tiếp từ `index.html` qua web server cục bộ, cùng state thử Q1. Đây là khung game thật, không phải mockup `ui-v2`.

| Màn | Trước | Sau |
|---|---|---|
| Bản đồ · 1440×900 | `before-map-1440x900.png` | `after-map-1440x900.png` |
| Sự kiện · 1440×900 | `before-event-1440x900.png` | `after-event-1440x900.png` |
| Bản đồ · 390×844 | — | `after-map-390x844.png` |
| Sự kiện · 390×844 | — | `after-event-390x844.png` |

State chụp: Quyển 1, tuần 1, còn 3 việc; sự kiện mẫu `k_hd_hocngheo` đã phát hết hai dòng thoại đầu để hiện lựa chọn. Nội dung world modifier vẫn lấy từ seed runtime nên các chip bên trái có thể khác nhau giữa ảnh; phần cần so là map, event, portrait và choice.

Smoke test đã kiểm tra nền sáng/đêm đổi đúng theo lượt, pin và hành động tự do, dòng thoại hiện tại, phím số chọn lựa chọn, reduced motion và không tràn ngang ở viewport 390px.
