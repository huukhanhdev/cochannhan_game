# Kế hoạch chỉnh battle E, bản 2: bỏ tạm dừng, chiêu và animation riêng từng nhân vật

Ngày 02/10/2026. Thay phần điều khiển trong [KE_HOACH_BATTLE_TEST_PN_BNB.md](KE_HOACH_BATTLE_TEST_PN_BNB.md) và phần gói động tác trong [HUONG_DAN_GEN_HANG_LOAT_KEYPOSE.md](../prompts/HUONG_DAN_GEN_HANG_LOAT_KEYPOSE.md).

Yêu cầu của người dùng:

1. **Hủy cơ chế dừng thời gian khi chọn lệnh.** Bỏ luôn bảng chọn bằng WASD rồi Z xác nhận. Điều khiển bằng chuột hoặc bấm phím trực tiếp.
2. **Đánh thường, chiêu cổ trùng và tư thế thắng phải riêng cho từng nhân vật, theo nguyên tác.** Hồi máu, né, thủ, gục được phép dùng chung kiểu động tác. Nếu không, 38 nhân vật sẽ giống nhau, chỉ khác ngoại hình.

---

## Phần A. Điều khiển mới: trận luôn chạy

### A1. Bảng phím

| Thao tác | Kết quả |
|---|---|
| **Chuột phải vào mặt đất** | Đi tới điểm đó (giữ như hiện tại) |
| **Chuột phải hoặc chuột trái vào địch** | Đuổi tới tầm rồi đánh thường. Click lại thì đổi lệnh |
| **Q W E R** (thêm D F nếu nhiều cổ) | Dùng cổ trùng theo ô. **Phóng ngay về phía con trỏ chuột**, không có bước ngắm hay xác nhận. Cổ tự thân (hộ thể) kích hoạt ngay |
| **Space** | Lướt về phía con trỏ |
| **1 2** | Vật phẩm: Sinh Mệnh Diệp, linh dược |
| **S** | Dừng đi / dừng đuổi |
| **Click nút trên thanh kỹ năng** | Như bấm phím tương ứng, nhắm về phía địch |
| **Esc** | Menu dừng game thông thường (không phải dừng để chọn chiêu) |

Đổi phím để bước sau. Phím gắn với **ô**, không gắn với tên cổ, nên đổi bộ cổ không cần sửa code.

### A2. Thay thế cho việc dừng thời gian

Phản hồi trước đây là "realtime quá nhanh, khó làm quen". Thay vì dừng thời gian, bản này dùng các cách sau:

- **Tốc độ trận** chọn được 0,75× / 1×, mặc định 0,85×. Áp vào đồng hồ trận nên mọi thứ chậm đều nhau.
- **Bộ đệm lệnh 0,25 giây:** bấm chiêu khi đang thu chiêu thì chiêu được xếp hàng, ra ngay khi rảnh tay. Bấm sớm không bị nuốt phím.
- **Báo trước rõ ràng:**
  - Chiêu lớn của địch có vòng đỏ trên đất và thời gian lấy đà dài.
  - Biểu tượng ý đồ trên đầu địch.
  - Thanh lấy đà nhỏ dưới chân địch.
- Ô kỹ năng có quạt hồi chiêu, số giây và nhãn phím. Ô thiếu chân nguyên hiện màu khác kèm nhãn.

### A3. Thay đổi code

| File | Thay đổi |
|---|---|
| `js/sandbox/input.js` | Viết lại. Bỏ các trạng thái `menu` / `target`, Z / X, tự mở bảng. Thêm phím Q W E R / Space / 1 2 / S, click địch, chuột phải vào địch. Lưu vị trí con trỏ trên đất để nhắm |
| `js/sandbox/sim.js` | Thêm lệnh `chase` (đi tới khi vào tầm thì đánh thường), `aim` (hướng hoặc điểm cho đạn và vùng), bộ đệm lệnh 0,25 giây, tham số `timeScale` |
| `js/sandbox/hud.js` | Bỏ lưới 2×6 kiểu menu. Thay bằng thanh kỹ năng một hàng có nhãn phím, quạt hồi chiêu, ô vật phẩm |
| `battle_sandbox.html` | Bỏ ô "tự mở bảng"; thêm chọn tốc độ trận; vòng chính luôn bước simulation |
| `js/sandbox/view.js` | Bỏ con trỏ chọn điểm; thêm vòng tầm chiêu khi rê chuột lên ô kỹ năng, thanh lấy đà của địch |

Phần đã làm ở S1–S2 được giữ: tính toán trận, va chạm thân, khựng và vững thế, chọn frame theo thời gian trận, kết trận.

---

## Phần B. Animation: phần chung và phần riêng

### B1. Phân loại

| Loại | Clip | Cách làm |
|---|---|---|
| **Chung** (cùng mô tả động tác, mỗi nhân vật vẫn gen ảnh của mình) | `idle`, `move`, `hit`, `guard`, `heal`, `dodge`, `ko` | Dùng chung một câu mô tả động tác cho mọi người. Thú có bộ câu chung riêng. Chỉ chỉnh khi cơ thể khác hẳn (bay, sáu chân) |
| **Riêng** (đặc trưng nhân vật) | `atk` (đánh thường), `sk_<id>` (mỗi chiêu hoặc cổ có cách ra chiêu riêng), `win` | Viết riêng cho từng nhân vật theo nguyên tác: cách đánh, cổ đang có ở mốc truyện, tính cách |

Quy tắc gộp clip chiêu:

- Nhiều cổ có **cùng cách thực hiện** thì dùng chung một clip, chỉ khác hiệu ứng do code vẽ. Ví dụ Nguyệt Quang, Nguyệt Mang, Huyết Nguyệt đều là hất cổ tay phóng nguyệt nhận nên chung `sk_nguyet`.
- Cách thực hiện khác thì tách clip.
- Cổ là sinh vật được điều khiển (Cự Xỉ Kim Ngô là con rết vàng) thì sinh vật đó là **asset riêng**. Clip nhân vật chỉ là tư thế ra lệnh.

### B2. Định dạng đặc tả cho mỗi nhân vật

Mỗi nhân vật có một bảng như dưới. Từ bảng này sinh ra prompt và `clips.json` (số pose kỳ vọng, frame phát đòn, điểm phát).

| Clip | Dùng cho chiêu / cổ | Căn cứ | Cách thực hiện (thành dòng Poses) | Số pose | Mốc | Điểm phát | Hiệu ứng code vẽ |
|---|---|---|---|---|---|---|---|

- **Mốc:** `release` (đạn rời tay), `contact` (chạm cận chiến), `activate` (bật buff hoặc hộ thể).
- **Điểm phát:** `hand_r`, `hand_l`, `mouth`, `ground`, `body`.

### B3. Phương Nguyên, mốc Q1 Nhị chuyển → Tam chuyển (ch 100–188)

Căn cứ: [CHI_TIET_NGUYEN_TAC_Q1.md](../reference/CHI_TIET_NGUYEN_TAC_Q1.md).

| Clip | Chiêu / cổ | Căn cứ | Cách thực hiện | Pose | Mốc | Ảnh hiện có |
|---|---|---|---|---|---|---|
| `atk` | Đánh tay bằng sức "2 trư chi lực" (Bạch Thỉ + Hắc Thỉ) | ch 100, 131 | Gọn, lạnh, không thừa động tác: hạ thấp người → đấm thẳng nặng → thu về thủ thế | 3 | contact | `attack` hiện tại là chưởng: dùng tạm, nên gen lại thành đấm |
| `sk_nguyet` | Nguyệt Quang, Nguyệt Mang, Huyết Nguyệt | ch 12, 101, 131, 136 | Hất cổ tay phóng nguyệt nhận, bắn liên tục từ xa | 3 | release, `hand_r` | **`cast` hiện tại dùng được** |
| `sk_bachngoc` | Bạch Ngọc (hộ thể ngọc) | ch 100, 116, 124 | Đứng vững, không né, da hóa ngọc trắng; dáng tự tin chịu đòn | 2 | activate, `body` | Chưa có, `guard` dùng tạm |
| `sk_cuongthu` | Cường Thủ (bàn tay sắt chộp, rút cổ) | ch 138, 143, 165, 186 | Vươn tay chộp → nắm chặt → giật mạnh về | 3 | contact, `hand_r` | Chưa có, `heavy` dùng tạm |
| `sk_cuxi` | Cự Xỉ Kim Ngô (rết vàng răng cưa) | ch 186–188 | Chỉ tay ra lệnh, con rết lao ra cắn xé. **Con rết là asset riêng** | 2 | release, `hand_r` | Chưa có, kèm asset rết |
| `sk_thienbong` | Thiên Bồng (giáp ánh sáng) | ch 155, 186 | Một tay giơ cao, màn ánh sáng phủ xuống | 2 | activate, `body` | Chưa có |
| `win` | — | Tính cách | Tay chắp sau lưng, mắt lạnh nhìn xuống, không cười | 1 | — | **`win` hiện tại khớp** |
| Chung | idle, move, hit, guard, heal (Trị Liệu / Sinh Mệnh Diệp), dodge, ko | — | Bộ chung | — | — | Có đủ |

### B4. Bạch Ngưng Băng nam, mốc Q1 trước khi mất tay phải (ch 133–138)

Căn cứ: [CHI_TIET_NGUYEN_TAC_Q1.md](../reference/CHI_TIET_NGUYEN_TAC_Q1.md). Thường ép tu vi xuống Nhị chuyển để trì hoãn tự bạo, ít dùng cổ Tam chuyển (ch 135).

| Clip | Chiêu / cổ | Căn cứ | Cách thực hiện | Pose | Mốc | Ảnh hiện có |
|---|---|---|---|---|---|---|
| `atk` | Chém bằng dải hàn băng phóng từ tay (băng nhận) | ch 135, 172 | Ung dung, một tay hất ngang như phẩy bụi, dải băng sắc chém ra; mặt cười khẩy | 3 | contact, `hand_r` | `attack` hiện tại là đấm: nên gen lại |
| `sk_locbangnhan` | Lốc băng nhận (chiêu lớn) | ch 140 | Giải phóng chân nguyên: hai tay dang rộng, xoay người, lốc băng nhận cuộn quanh. Lấy đà dài, có vòng báo trước | 3 | activate, `body` | Chưa có, `heavy` dùng tạm |
| `sk_thuytrao` | Thủy Tráo (cầu nước bao thân) | ch 143 (cổ trên người BNB) | Hai lòng bàn tay mở ra hai bên, quả cầu nước bao quanh | 2 | activate, `body` | Chưa có, `guard` dùng tạm |
| `sk_suongyeu` | Sương Yêu (tự bạo cổ để thoát thân) | ch 136 | **Chiêu thoát một lần mỗi trận** khi máu thấp: hơi sương nổ tung, đẩy lùi đối thủ, BNB lùi xa | 2 | activate, `body` | Chưa có |
| `win` | — | Tính cách (ch 133, 135) | Ngửa cổ cười ngạo nghễ, một tay chống hông | 1 | — | `win` hiện tại gần đúng, xem lại |
| Chung | idle, move, hit, guard, heal, dodge, ko | — | Bộ chung | — | — | Có đủ |

**Mâu thuẫn cần người dùng chọn:**

- `js/data.js` ghi `GU.bachngoc` là "Cổ của Bạch Ngưng Băng", và kit BNB cũ có Bạch Ngọc, Băng Đao, Băng Trùy.
- Tài liệu nguyên tác trong repo chỉ ghi Bạch Ngọc là cổ do **Phương Nguyên** hợp luyện (ch 100). Tài liệu cũng không nhắc Băng Trùy ở Q1.
- Đề nghị: kit BNB dùng các chiêu trong bảng trên. Bạch Ngọc và Băng Trùy bỏ khỏi BNB cho tới khi có nguồn.

### B5. 36 nhân vật còn lại

Dùng cùng bảng B2. Mỗi nhân vật tối thiểu có:

- `atk` riêng.
- 1–2 `sk_` theo chiêu có căn cứ (`EAI.sk`, `SK`, `GU` trong `js/data.js`, đối chiếu tài liệu nguyên tác).
- `win` riêng. Thú thì `win` là tư thế đắc thắng hoặc gầm.

Ví dụ từ dữ liệu hiện có:

- `heo_rung`: `atk` húc nanh; `sk_charge` lùi đà → húc thẳng (`EAI.heorung.sk='charge'`).
- `dian_lang_boss`: `atk` vồ cắn; `sk_howl` ngửa cổ tru gọi bầy (`sk:'howl'`), `sk_thunder` sét trên sừng (`langvuong.sk='thunder'`).
- `hac_hung`: `atk` tát vuốt; `sk_rage` đứng dậy đập ngực (`sk:'rage'`).
- `thiet_huyet_lanh`: `atk` quất xích; `sk_` theo chiêu xích trấn ma.

Thứ tự làm đặc tả: Điện Lang Vương, Thiết Huyết Lãnh, Nhất Đại, Phương Chính, rồi tới các nhân vật Q2.

### B6. Thay đổi importer và prompt

- Tên action mới: `atk`, `sk_<id>` (chữ thường, gạch dưới). File: `<id>_<clip>_vN.png`, ví dụ `pn_sk_bachngoc_v1.png`.
- **Mỗi actor có `clips.json`:** số pose kỳ vọng, thời lượng, mốc, điểm phát. Importer đọc file này thay vì bảng `TIMING` cố định, và **không ghi sheet nếu sai số pose**. Việc này gộp với các sửa lỗi blue-chan nêu ở mục 10.3 và 12.1 của tài liệu gen hàng loạt.
- Clip cũ `attack` / `cast` / `heavy` giữ làm dự phòng. Sim chọn clip theo thứ tự `sk_<id>` → clip dự phòng ghi trong kit → `idle`.
- Prompt gen: khối chung + nhân vật + dòng `Poses` lấy từ cột "Cách thực hiện". Câu cho clip riêng phải nêu **cách nhân vật đó ra chiêu**, không dùng câu mẫu chung.

---

## Phần C. Thứ tự thực hiện

| Bước | Nội dung | Phụ thuộc ảnh mới? |
|---|---|---|
| **C1** | Điều khiển mới (phần A): bỏ dừng, chuột và phím trực tiếp, đuổi đánh, phóng chiêu theo con trỏ, bộ đệm lệnh, tốc độ trận | Không |
| **C2** | `clips.json` + importer mới (gồm các sửa lỗi của mục 12.1) | Không |
| **C3** | Chiêu PN trong sim theo bảng B3. Clip chưa có thì dùng clip dự phòng | Không |
| **C4** | Chiêu và AI BNB theo bảng B4: atk băng nhận, lốc băng nhận có vòng báo trước, Thủy Tráo, Sương Yêu thoát thân một lần | Không |
| **C5** | Bạn gen ảnh mới: PN `atk` (đấm), `sk_bachngoc`, `sk_cuongthu`, `sk_cuxi` + con rết, `sk_thienbong`; BNB `atk`, `sk_locbangnhan`, `sk_thuytrao`, `sk_suongyeu`, xem lại `win`. Tôi viết sẵn prompt cho từng clip | **Có** |
| C6 | Nhập ảnh, thay clip dự phòng, chỉnh số bằng máy đấu máy | Có |

C1–C4 làm được ngay với ảnh hiện có. C5 có thể làm song song khi bạn có thời gian gen.

## Cần bạn chốt

1. Phím Q W E R / Space / 1 2 / S như bảng A1. Có muốn đổi gì không?
2. Tốc độ trận mặc định 0,85×?
3. Kit BNB theo nguyên tác (bỏ Bạch Ngọc và Băng Trùy) như B4?
4. Sương Yêu làm chiêu thoát một lần của BNB khi máu thấp: có giữ không?
