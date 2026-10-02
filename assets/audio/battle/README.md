# Âm thanh battle E (tùy chọn)

Bản thử 02/10/2026 nạp 4 cue punch/jade/ice/gold từ [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds), CC0. `manifest.json` ghi nguồn và phép xử lý từng file; `LICENSE_KENNEY.txt` giữ giấy phép gốc. Đã chuyển MP3 mono, cắt đầu lặng, giảm 3dB/giới hạn peak và tối đa0,45s; **chưa nghe duyệt thiết bị thật**. Cue khác giữ âm tổng hợp.

Đặt file âm vào thư mục này và tạo `manifest.json`. Không có file thì sandbox dùng âm tổng hợp Web Audio.

```json
{
  "cues": {
    "punch": "punch_01.ogg", "wind": "swish_01.ogg", "heavy": "swish_heavy_01.ogg",
    "moon": "magic_01.ogg", "cut": "slash_01.ogg", "ice": "ice_01.ogg", "storm": "wind_storm_01.ogg",
    "saw": "saw_01.ogg", "grab": "metal_grab_01.ogg",
    "jade": "glass_01.ogg", "gold": "metal_soft_01.ogg", "water": "water_01.ogg", "heal": "chime_01.ogg"
  },
  "sources": {
    "punch_01.ogg": "Tên bộ âm, tác giả, đường dẫn trang tải, giấy phép (vd CC0)"
  }
}
```

Tên cue (bên trái) cố định, khớp với `js/sandbox/audio.js`. Thiếu cue nào thì cue đó dùng âm tổng hợp.
Chỉ dùng file có giấy phép rõ ràng (CC0 hoặc tương đương) và ghi nguồn từng file trong `sources`.
Mỗi file nên ngắn dưới 0,5 giây, đã cắt khoảng lặng đầu, định dạng `.ogg` hoặc `.mp3`. Safari cũ không phát `.ogg`: nếu cần thì dùng `.mp3`.

Cue nhận tên file hoặc object `{"file":"ice_01.ogg","gain":0.35}`. Gain file mặc định 0,4, giới hạn 0…1; master có compressor threshold −18dB, ratio 4. Vẫn cần cắt khoảng lặng/normalize file và nghe duyệt trên thiết bị; compressor không chứng minh bộ âm đã đạt.
