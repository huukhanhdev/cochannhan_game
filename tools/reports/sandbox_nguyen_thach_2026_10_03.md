# Bench nguyên thạch trong trận (03/10/2026)

Bot người chơi kiểu "move" (thả diều + né, phản xạ 0,3s), PN demo đấu BNB Q1, sân rộng, 200 trận mỗi dòng. Bot hấp thu khi chân nguyên < 30% và cách xa > 220. AI BNB áp sát khi thấy người chơi đang hấp thu (sơ hở công khai sau `react`). Mỗi viên +5 chân nguyên (theo engine: 5 viên = 25).

| Viên/trận | Thời gian 1 viên | Thường: thắng / hết giờ | Cao thủ: thắng / hết giờ |
|---|---|---|---|
| 0 (không dùng) | — | 38,5% / 122 | 30% / 134 |
| 3 | 2,5s | 66,5% / 67 | 48,5% / 97 |
| 3 | 5s | 78,5% / 43 | 50,5% / 92 |
| 5 | 2,5s | 81% / 38 | 60,5% / 74 |
| 5 | 5s | 93% / 14 | 72% / 49 |
| 10 | 2,5s | 97,5% / 5 | 81,5% / 31 |
| 20 | 2,5s | 100% / 0 | 93,5% / 5 |

Kết luận:
- **Số viên mang vào trận là đòn bẩy chính.** Hấp thu chậm hơn không giảm sức mạnh, vì người thả diều có thời gian chờ.
- **Không giới hạn số viên** thì lối thả diều thắng gần như chắc chắn.
- **3 viên/trận** là mức đưa tỉ lệ thắng về khoảng 50–65% và giảm mạnh số trận hết giờ.
