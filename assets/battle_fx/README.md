# FX sprite tùy chọn của sandbox

Tool `python3 tools/fx_import.py source.png --spec spec.json` xuất `previews/fx-import/<id>/` để review. Sau duyệt dùng `--approve` để xuất `assets/battle_fx/<id>/`; runtime chỉ nạp manifest `approved`. Không dùng importer key-pose.

Ba ID pilot: `fx_cuxi`, `fx_cuongthu`, `fx_ice_impact`. Thiếu asset thì giữ Graphics hiện tại. Không có sprite mới đã duyệt trong lượt này.

Ví dụ spec dải 2 frame:

```json
{
  "id": "fx_ice_impact",
  "frame_size": [128,128],
  "rects": [[0,0,128,128],[128,0,128,128]],
  "pivot_px": [64,64],
  "durations_ms": [100,120],
  "key_color": "#FF00FF",
  "anchor": "contact",
  "blend": "normal",
  "loopFrames": false
}
```

Alpha thật: bỏ `key_color`. Xóa key chỉ khớp RGB chính xác, không hứa sửa nền loang/viền màu; sửa source nếu bẩn. Mọi rect cùng kích thước, 1–16 frame, không crop/resize/center riêng. Pivot tương đối từng ô; review ở cỡ battle, quay cả actor/anchor khi mirror. `loopFrames` chỉ lặp frame trong thời gian effect, không tạo damage hoặc effect vô hạn.

Nguồn raw lưu `incoming_fx/` (không track). Kiểm `python3 tools/fx_import_regression.py`. Runtime có loader cùng fallback; đường bay rết/tay pilot cần khớp phạm vi/nhịp release/contact trước nghiệm thu. Kết quả gameplay luôn do sim.
