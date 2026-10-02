# Bàn giao Orange-kun — cooldown chung và boss Bạch Ngưng Băng

Blue-chan, 02/10/2026. Đã tích hợp trong sandbox E, chưa commit/push. Ghi chú này cập nhật kết quả sau lượt cân bằng trước ở `NOTE_TICH_HOP_SANDBOX_E.md`.

## 1. Luật đã tích hợp

- Mỗi actor chỉ có một action đang thực hiện, một lệnh chờ cuối, không thực hiện bốn chiêu cùng lúc.
- Khi action cổ/vật phẩm **phát hiệu lực**, các action cùng nhóm khác có cooldown bằng 0 nhận cooldown **2 giây**. Actor đối phương không bị khóa.
- Chiêu đang hồi giữ nguyên thời gian, chỉ tiếp tục giảm theo simulation. Ví dụ còn 0,5s vẫn còn 0,5s, không bị nâng lên 2s; còn 8s vẫn tiếp tục từ 8s.
- Chiêu vừa dùng nhận cooldown riêng, không cộng thêm 2s.
- Đánh thường (`atk`, cả hai actor), lướt (`dash`), đi và dừng miễn khóa chung; vẫn phải tuân thủ action đang bận, pha được hủy và cooldown lướt riêng.
- Sinh Mệnh Diệp có trong nhóm action nhận/kích hoạt khóa chung. Sương Yêu cũng có; đây là cổ tiêu hao, không phải lướt thường. Action đã hết lượt bị bỏ qua khi đặt khóa.
- Hủy/bị ngắt trước release không kích hoạt khóa. Lá và Sương Yêu vẫn mất lượt từ lúc bắt đầu dùng theo luật cũ.
- Hộ thể đã kích hoạt còn tồn tại đến hết thời lượng, có thể dùng chiêu khác sau khóa. **Một action kích hoạt tại một thời điểm**, không phải chỉ được có một hiệu ứng cổ tồn tại trên người.
- Quy ước `atk` miễn khóa bao gồm Băng Nhận của BNB dù tạo hình là đòn băng. Orange cần giữ rõ đây là ngoại lệ gameplay cho ô đánh thường, không khẳng định đó là đòn vật lý không dùng cổ.

Trong `sim.js`, khóa dùng chung `actor.cd`, nên `check`, bộ đệm lệnh, AI và HUD cùng nhìn một thời gian. Lệnh đã xếp hàng cũng được kiểm tra lại khi thực hiện; không vượt khóa mới phát sinh. HUD hiện số giây và vòng hồi, hướng dẫn thêm luật 2s.

## 2. Bộ action hiện tại: Phương Nguyên

**8 action trên thanh điều khiển: 5 chiêu cổ chủ động + 1 vật phẩm + lướt + đánh thường.** Đi/dừng không tính là ô kỹ năng. Đây là bộ loadout sandbox, không khẳng định PN sở hữu đúng toàn bộ đồng thời ở một chương.

| Phím | Action | Công dụng | Hồi riêng | Chi phí/lượt |
|---|---|---|---:|---:|
| Chuột | Đánh tay | 13 sát thương, tầm 85, lấy đà 0,28s | 0s | 0 |
| Q | Nguyệt Mang | Đạn 21 sát thương, xuyên một nửa giảm sát thương hộ thể | 2,8s | 9 chân nguyên |
| W | Bạch Ngọc | Giảm 50% sát thương, 3s | 9s | 10 chân nguyên |
| E | Cự Xỉ Kim Ngô | 34 sát thương và chảy máu 4/s trong 3s | 6s | 14 chân nguyên |
| R | Cường Thủ | 18 sát thương, kéo lại gần 110 đơn vị | 10s | 16 chân nguyên |
| D | Thiên Bồng | Giảm 65% sát thương, 5s; thay hộ thể trước | 14s | 18 chân nguyên |
| Space | Lướt | 190 đơn vị, không bất tử | 2,5s | 0 |
| 1 | Sinh Mệnh Diệp | Hồi 50 HP | 8s | 2 lá/trận |

HP 220, chân nguyên 100, hồi chân nguyên 1,8/s, tốc độ đi 265. Khi trúng đòn, khựng 0,32s rồi được bảo vệ khỏi khựng thêm 1,2s; vẫn mất máu.

## 3. Bộ action hiện tại: Bạch Ngưng Băng

**5 action: Băng Nhận đánh thường + 3 chiêu đặc biệt + lướt.** Không suy ra thành 5 con cổ khác nhau: Lốc Băng Nhận là cách đánh, lướt là cơ chế game.

| Action | Công dụng | Hồi riêng | Chi phí/lượt |
|---|---|---:|---:|
| Băng Nhận (`atk`) | 24 sát thương ở Thường, làm chậm còn 70% tốc độ trong 1,2s; lấy đà 0,65s | 0s | 0 |
| Lốc Băng Nhận | 96 sát thương ở Thường, bán kính 125, đặt trong tầm 340, báo trước 1,15s; khóa vị trí từ lúc lấy đà, không bị ngắt | 10s | 22 chân nguyên |
| Thủy Tráo | Giảm 40% sát thương, 3s | 10s | 12 chân nguyên |
| Sương Yêu | Thoát thân 380 đơn vị, xóa chảy máu/chậm; mất lượt từ lúc bắt đầu | 0s | 1 lần/trận |
| Lướt | 170 đơn vị, không bất tử | 2,5s | 0 |

HP **300**, chân nguyên 100, hồi 2,4/s, tốc độ đi 235. Lượt này không tăng HP hoặc thêm cổ mới. Mức Khó giữ nhân sát thương 1,2: Băng Nhận 29, Lốc 115 sau làm tròn; còn giảm bởi hộ thể.

## 4. Boss Khó đã thông minh hơn ở đâu

Chỉ nâng chính sách **Khó**, Dễ/Thường giữ chính sách AI trước đó. Cooldown chung áp dụng cho mọi mức và cả hai actor.

1. Nhịp suy nghĩ Khó từ 0,28–0,36s xuống 0,18–0,24s, vẫn không phản ứng từng frame.
2. Khi thấy PN lấy đà đòn cận chiến/chộp ít nhất 0,2s và đang nằm trong tầm, lách theo chiều sâu khỏi ô đòn. Giữ một điểm né cho mỗi hit-id để tránh đổi hướng liên tục.
3. Khi thấy PN đang dùng lá/phóng đạn ít nhất 0,15s ở khoảng cách 150–330, có thể dùng lướt áp sát. Người chơi cần chọn vị trí hồi máu, thay vì luôn đứng dùng lá an toàn.
4. Không dùng Lốc khóa vị trí lên mục tiêu đang chạy ở mức Khó; tiếp tục áp sát đợi cơ hội. Né Nguyệt bằng dash, Thủy Tráo, Sương Yêu và xác suất áp sát cũ vẫn còn.
5. Không đọc lệnh di chuyển tương lai, không sửa vùng Lốc sau khi đã đặt, không tự thêm bất tử hoặc tăng sát thương riêng theo cách chơi người dùng.

Preview kiểm tra: [sandbox mức Khó](http://localhost:8765/battle_sandbox.html?lvl=kho). Trang không có tham số vẫn mặc định **Thường**; đừng thử trang mặc định rồi tưởng đã chạy chính sách boss Khó.

## 5. Kết quả đo, không phải tỷ lệ thắng người thật

Cùng benchmark seed `20261002`, 300 trận mỗi chính sách, khoảng 0,1s giữa các quyết định bot:

| Mức, bản hiện tại | Đứng yên | Áp sát spam | Né/giữ khoảng cách/phản công |
|---|---:|---:|---:|
| Dễ | 25,0% | 76,0% | 100% |
| Thường | 9,3% | 53,7% | 93,7% |
| Khó | 0% | 0% | 52,7% |

Đối chứng Khó **đã có khóa 2s nhưng chưa sửa AI**: bot né thắng 77,7%. Sau sửa AI: 52,7%. Seed 42/9001 với AI mới: bot né 61,3% / 61,7%, spam và đứng yên vẫn 0%. Không có timeout trong các lượt đo cuối.

Điều này cho thấy mức Khó phạt rõ việc bỏ qua vị trí/né. Nhưng bot spam không thử mọi cách dựng hộ thể hoặc combo tối ưu; không kết luận người thật không thể thắng khi áp sát. Chưa coi đây là cân bằng cuối cho điện thoại.

Số liệu: [sandbox_gu_lock_2026_10_02.json](../../tools/reports/sandbox_gu_lock_2026_10_02.json). Chạy lại:

```bash
node tools/sandbox_regression.cjs
node tools/sandbox_bench.cjs 300 kho compare 20261002
node tools/sandbox_bench.cjs 300 kho compare 42
node tools/sandbox_bench.cjs 300 kho compare 9001
```

## 6. Đối chiếu cốt truyện: vấn đề cần sửa trước khi thêm cổ

Căn cứ repo: [chi tiết Q1](../reference/CHI_TIET_NGUYEN_TAC_Q1.md), [kế hoạch battle E mục B3–B4](KE_HOACH_CHINH_BATTLE_E_V2.md).

- Hồ sơ BNB ở kế hoạch ghi **trước mất tay, ch 133–138**, nhưng đã dùng Lốc ở ch 140 và Thủy Tráo được ghi nhận ở ch 143. PN có Thiên Bồng mốc ch 155 cùng rết và Cường Thủ. Bộ hiện tại là tổng hợp kỹ năng Q1 để thử engine, chưa phải một cuộc giao đấu được chốt đúng thời điểm.
- Theo bản chương 143 tiếng Anh được tìm thấy trên WebNovel, PN lấy Thủy Tráo từ BNB. Không thể giữ nguyên bộ của BNB trước mất cổ rồi đặt trận sau sự kiện đó mà không giải thích. [Bản chương 143: Answer](https://www.webnovel.com/book/reverend-insanity%28english%29_32605619408374705/chapter-143-answer_87702437749638593). Đây là bản đăng lại được tìm thấy, không gắn nhãn là bản dịch chính thức đã xác minh.
- Bạch Ngọc/Băng Trùy của BNB vẫn chưa được xác minh phù hợp mốc trận; không thêm lại chỉ để boss có nhiều nút. Băng Tinh trong tài liệu `NGUYEN_TAC_Q1_DOI_CHIEU_CU.md` cũng cần đối chiếu, không dùng tài liệu mang nhãn cũ làm chứng cứ duy nhất.
- Nguồn chương 143 nhắc thêm cổ trên người BNB; việc sở hữu không đủ để tự chế một chiêu gây sát thương và coi là nguyên tác. Chưa đưa các cổ này vào runtime.
- Bạch Ngọc và Thiên Bồng hiện là hai hộ thể thay nhau. Cần kiểm tra quan hệ hợp luyện và khả năng cùng sở hữu ở mốc PN được chọn trước khi chốt loadout campaign; không mặc định bảng sandbox là hồ sơ nguyên tác.

**Đề xuất cho Orange:** chốt chương/cuộc giao đấu trước, rồi lập hai danh sách cổ ở thời điểm ấy: đang sở hữu, đã mất/hợp luyện/tiêu hao. Nếu chỉ cần boss khó ngay trong sandbox, dùng AI Khó hiện tại; chưa cần tăng HP vô cớ hoặc bịa thêm cổ. Bộ chiêu đúng mốc sẽ là thay đổi riêng, có nguồn và clip/VFX tương ứng.

## 7. File và kiểm thử cần review

- `js/sandbox/sim.js`: đặt khóa tại release, bỏ qua cooldown đang chạy/action hết lượt và nhóm miễn khóa; xuất `GU_LOCK=2`.
- `js/sandbox/hud.js`: vòng cooldown có mẫu số tối thiểu 2s, thêm hướng dẫn khóa chung.
- `js/sandbox/ai.js`: hành vi Khó như mục 4.
- `tools/sandbox_regression.cjs`: kiểm tra khóa trước/sau release, không kéo dài cooldown cũ, không khóa đối thủ/đánh thường/lướt, hết lượt, hủy trước release và hành vi boss Khó. Giữ các test kết trận/né trước đó.
- Kiểm tra dữ liệu và hồi quy engine đạt; Chrome desktop/mobile giả lập nhận tap/chuột/phím đúng, không có lỗi JavaScript. Chưa thử điện thoại thật.
- Lượt này không thêm asset hay sửa campaign; giữ nguyên các thay đổi map/VFX và thông số kit từ lượt cân bằng trước.
