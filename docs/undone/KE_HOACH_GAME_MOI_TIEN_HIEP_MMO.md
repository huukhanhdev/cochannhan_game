# Kế hoạch game mới: MMORPG tiên hiệp từ trên xuống (tham chiếu nội dung Quỷ Cốc Bát Hoang)

Orange-kun lập, 03/10/2026. **Repo mới**, không sửa game hiện tại (`cochannhan_game` giữ nguyên và chạy tiếp).

## 0. Người dùng chốt
| Hạng mục | Chốt |
|---|---|
| Thế giới | **Tiên hiệp chung**: không bám nguyên tác Cổ Chân Nhân, không dùng tên/nhân vật truyện. Tự đặt tên đất, tông môn, nhân vật |
| Lối chơi | **Sản phẩm là MMORPG** (kiểu Động Khiếu): thế giới chung, đánh quái, nhiệm vụ, tổ đội, phó bản, boss thế giới, chat, giao dịch, bang hội. **Quỷ Cốc Bát Hoang chỉ là tham chiếu nội dung**: hệ phái (kiếm tu, thương tu, đao tu, quyền tu, chỉ tu, thuật tu…), công pháp/kỹ năng, cảnh giới, linh căn, pháp bảo, đan dược (người dùng nói rõ 03/10) |
| MMO | Là đích chính. Bản thử đầu chạy một người, nhưng **server-authoritative ngay từ đầu**: luật chỉ nằm ở `core`, client chỉ gửi lệnh; bản thử chạy `core` trong trình duyệt như một "server cục bộ", rồi chuyển lên server thật ở mốc sớm (M2) |
| Góc nhìn | **Đi lại tự do từ trên xuống ở mọi nơi** (kiểu Động Khiếu), đánh nhau ngay trên bản đồ |
| Engine | Ưu tiên dễ vibe code → **Phaser 3 + TypeScript + Vite** (web PC + điện thoại) |
| Asset | Mượn tạm asset hiện có, thay dần |

## 1. Trụ cột thiết kế
1. **MMORPG là lõi:** vòng chơi chính là ra bản đồ đánh quái, làm nhiệm vụ, lên cấp/cảnh giới, lấy trang bị và pháp bảo, tổ đội đánh phó bản/boss, gặp người chơi khác. Các tiện ích MMO cần có từ sớm:
   - treo máy (auto đánh quái);
   - chat kênh;
   - mini-map;
   - thanh kỹ năng.
2. **Hệ phái kiểu Quỷ Cốc:** chọn **đạo tu theo vũ khí** (kiếm tu, thương tu, đao tu, quyền tu, chỉ tu, thuật tu…). Mỗi phái có lối đánh và cây công pháp riêng. Công pháp học từ sách/tông môn, nâng tầng. Linh căn (kim, mộc, thủy, hỏa, thổ…) ảnh hưởng công pháp.
3. **Cảnh giới thay cấp độ:** Luyện Khí (chia tầng) → Trúc Cơ → Kết Đan → Nguyên Anh → Hóa Thần…; đột phá cần tài nguyên và thử thách (vượt kiếp, đánh tâm ma). Pháp bảo, đan dược, trận pháp là hệ trang bị và vật phẩm.
4. **Đánh nhau thời gian thực từ trên xuống ngay trên bản đồ:** chiêu có lấy đà, ra đòn, thu chiêu; báo đòn cho đòn lớn; linh khí (mana) trả lúc phát. Dùng lại tư duy sim sandbox hiện có.
5. **Server-authoritative:**
   - mọi luật nằm trong lõi mô phỏng thuần, không đụng hình;
   - client chỉ vẽ, dự đoán chuyển động và gửi lệnh;
   - chống gian lận bằng cách không tin client.

Không lấy làm lõi: NPC tự sống theo năm tháng, thọ nguyên, chết mất nhân vật (đặc trưng chơi đơn của Quỷ Cốc). Có thể thêm nhẹ làm nội dung sau.

## 2. Kỹ thuật
```text
repo mới/
  packages/core/     # TypeScript thuần: world sim (năm tháng, NPC, sự kiện), combat sim (bước cố định 1/60),
                     # dữ liệu (cảnh giới, công pháp, vật phẩm). Không import Phaser. Chạy được trong node để test/bench.
  packages/client/   # Phaser 3: scene bản đồ (tilemap Tiled), scene trận, HUD (DOM/CSS), input, âm thanh
  packages/server/   # (để sau) Node + WebSocket chạy chính core, client nhận state
  assets/            # sprite, tileset, UI, mỗi bộ có PROVENANCE.json (nguồn, prompt, người duyệt)
  tools/             # import sprite, kiểm asset, bench, trace (mang sang từ repo cũ)
```
- **Lệnh, không gọi hàm trực tiếp:** client gửi lệnh `{move, cast, interact}` vào core; core sinh event. Đây chính là mô hình `SBSim.issue/step/events` hiện tại, nên đường lên server không phải viết lại.
- **Seed và trace:** mọi ngẫu nhiên đi qua RNG có seed. Có trace baseline như `sandbox_trace` để refactor không đổi hành vi.
- **Lưu:** một người chơi lưu IndexedDB, có số phiên bản save và migration ngay từ đầu.
- **Test:** vitest cho core; Playwright smoke test cho client trên localhost.
- **Deploy:** GitHub Pages hoặc Cloudflare Pages cho bản một người chơi.

## 3. Asset: mượn tạm và thay dần
| Loại | Mượn tạm | Thay bằng |
|---|---|---|
| Nhân vật | Base v04 (ảnh chân dung, màn nhân vật) + sprite `chibi_kp` hiện có. Sprite chỉ có hướng phải: tạm **lật trái/phải**, lên/xuống dùng cùng hình | Sprite **4 hướng** (xuống, lên, trái, phải lật) cho idle/move/attack/hurt/death; ưu tiên người chơi + 5 quái đầu |
| Danh tính | Đổi tên toàn bộ: PN → nhân vật người chơi tự tạo; NPC mang tên mới. Bỏ chi tiết riêng của truyện (mặt nạ Thanh Đồng, cụt tay…) khi vẽ lại | Bộ NPC tiên hiệp chung |
| Bản đồ | Map nền `q1_bamboo_clearing` hiện có làm ảnh thử | Tileset tiên hiệp (cỏ, đất, rừng trúc, đá, nước, nhà) + bản đồ vẽ bằng Tiled |
| UI | Bảng màu tối/vàng đồng (đã bàn ở ảnh tham khảo) | Bộ khung 9 lát + icon tự vẽ. **Không lấy asset của Động Khiếu hay game khác** |

**Pipeline hiện có mang sang được:** prompt base/clip, importer key-pose (thêm tham số hướng), FX import, quy trình review của Orange.

## 4. Bản chơi thử đầu (vertical slice, mục tiêu khoảng 2–3 tuần)
Mục đích: biết vòng đánh quái, lên cảnh giới có vui không. Kiến trúc đã đúng dạng client/server.
1. Tạo nhân vật: tên, chọn **2 phái** để thử (kiếm tu, thương tu), rút linh căn.
2. Một vùng bản đồ khoảng 3×3 màn: thôn tân thủ, rừng, hang. Camera theo người chơi, va chạm, mini-map.
3. Đi lại 4 hướng, bàn phím và chạm màn hình. Mỗi phái: đánh thường + 3 công pháp + 1 pháp bảo, có thanh kỹ năng.
4. Quái tự hồi sinh theo khu: 2 loại thường, 1 tinh anh có báo đòn. Rơi đồ: trang bị, đan dược, linh thạch.
5. Cảnh giới Luyện Khí tầng 1 → 5 bằng kinh nghiệm đánh quái + đả tọa; một lần đột phá có thử thách.
6. Nhiệm vụ chính 3 bước + nhiệm vụ lặp lại; NPC thôn có hội thoại; cửa hàng.
7. Treo máy: tự đánh quái quanh điểm đứng.
8. `core` chạy trong Web Worker như server cục bộ, giao tiếp bằng message giống WebSocket. Lưu/tải.

**Nghiệm thu:**
- 30 phút chơi liền không lỗi;
- điện thoại 390px chơi được;
- test core đạt;
- có thể mở 2 tab, mỗi tab là một "client" (chưa thấy nhau cũng được), không có luật nào chạy ở client;
- bạn chơi thấy muốn chơi tiếp.

## 5. Lộ trình sau bản thử
| Mốc | Nội dung |
|---|---|
| M2 | **Server thật**: Node + WebSocket chạy `core`, tài khoản, nhiều người cùng vùng thấy nhau, chat kênh, đồng bộ vị trí/chiến đấu |
| M3 | Tổ đội, phó bản tổ đội, boss thế giới, thêm phái (đao, quyền, chỉ, thuật), cây công pháp |
| M4 | Tông môn/bang hội, giao dịch và chợ, luyện đan/luyện khí, PK có luật |
| M5 | Nhiều vùng bản đồ, sự kiện máy chủ, bảng xếp hạng (kiểu Phong Vân Bảng), vận hành (log, chống gian lận, sao lưu) |

## 6. Phân vai
- **Orange-kun:** plan, kiến trúc `core`, review code/asset/cân bằng, test và trace. Viết phần lõi khó (combat sim chuyển từ sandbox cũ, RNG/save) khi người dùng giao.
- **Blue-chan:**
  - dựng repo, scene Phaser, HUD;
  - nội dung (công pháp, quái, sự kiện);
  - toàn bộ asset (sprite 4 hướng, tileset, UI);
  - bản đồ Tiled.
- **Người dùng:** chốt thiết kế, chơi thử mỗi mốc, duyệt asset.

## 7. Rủi ro
- **Phạm vi:** MMORPG là dự án rất lớn. Giữ bản thử nhỏ nhưng đúng kiến trúc client/server, để không phải viết lại khi lên server ở M2. Chi phí server và vận hành tính từ M2.
- **Asset 4 hướng:** gấp 2–4 lần số ảnh hiện tại. Cần quy trình gen hàng loạt có kiểm, và một bộ tối thiểu trước.
- **Bản quyền:**
  - thế giới chung nên không bị ràng buộc bởi truyện;
  - asset mượn từ repo cũ mang hình nhân vật Cổ Chân Nhân, chỉ dùng nội bộ lúc thử, thay trước khi phát hành;
  - không sao chép asset/UI của game tham khảo.

## 8. Câu hỏi còn mở (chốt khi bắt đầu)
1. Tên game và tên repo.
2. Danh sách phái cho bản ra mắt (tối thiểu 2 phái ở bản thử: kiếm tu, thương tu?).
3. Chết trong MMO: hồi sinh tại điểm, mất gì (kinh nghiệm, độ bền, vật phẩm)?
4. Có giữ "luyện cổ" làm một nghề phụ không, hay bỏ hẳn.
5. Kiếm tiền/vật phẩm bán (nếu có ý định) để thiết kế kinh tế từ đầu.
