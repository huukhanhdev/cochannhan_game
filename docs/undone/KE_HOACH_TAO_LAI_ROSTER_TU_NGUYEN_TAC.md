# Kế hoạch tạo lại toàn bộ roster từ nguyên tác

02/10/2026. Người dùng chốt: **bỏ toàn bộ ảnh ref cũ trên git, tạo lại mọi nhân vật từ đầu.** Mô tả lấy từ truyện, tham khảo thêm ảnh trên mạng nếu có. Mỗi nhân vật có bộ animation và cổ trùng riêng theo truyện.

**Chia việc:** Blue-chan (Codex) **tạo** hồ sơ, prompt, base, clip và kit. Orange-kun (Claude) **validate** dữ liệu Blue-chan tạo. Người dùng **duyệt** hình và chốt các điểm mở. Không ai tự `--approve` khi người dùng chưa duyệt. **Cập nhật 03/10: Blue tạo xong bộ ảnh trước, Orange mới validate asset; không chặn từng lượt gen để chờ Orange duyệt hồ sơ/base/clip.**

Tài liệu này thay hướng “sửa theo ref cũ” trong [review roster v01](../../previews/roster-validation-v01/README.md). Các lỗi pipeline ở review đó (anchor, hover, viền xanh, FX dính vào sprite) vẫn phải sửa (xem bước 6).

---

## 0. Nguyên tắc chung

1. **Nguồn sự thật theo thứ tự:** (a) văn bản truyện bản dịch Việt; (b) ảnh fan art, manhua hoặc minh họa trên mạng (chỉ để tham khảo hình, không thay được chữ trong truyện); (c) thiết kế tự do, ghi nhãn `art`.
2. **Phần phải có căn cứ truyện:** danh tính, giới tính, tuổi tương đối, loài/hình thể (số chân, sừng, cánh…), cổ sở hữu theo mốc, cách chiến đấu, chuyển số.
   **Phần được thiết kế tự do (ghi `art`):** màu áo, kiểu tóc chi tiết, phụ kiện, khi truyện không tả.
3. **Không bịa cổ.** Chiêu không có trong truyện thì ghi `game` và giải thích vì sao cần (ví dụ thú hoang không dùng cổ nhưng cần đòn đặc trưng).
4. **Một hệ đánh số chương duy nhất:** dùng số chương của bản dịch Việt tại `https://cochannhann.pages.dev/api/chapters/<n>` (JSON, trường `chapter.content`). Ghi dạng `VN ch.N`. Số chương trong `PROMPT_MUSE_ROSTER.md` cũ có chỗ lệch: roster ghi Thiết Đao Khổ ch 443–445, nhưng trong bản Việt tên này xuất hiện từ ch 229. Không chép số cũ khi chưa mở lại chương.
5. **Trích dẫn ngắn:** mỗi trích dẫn ngoại hình tối đa 1–2 câu, kèm số chương. Phần còn lại tóm tắt bằng lời mình.
6. **Ảnh tham khảo trên mạng:** fan art được phép dùng (game phi thương mại, người dùng đã đồng ý 30/09). Vẫn phải ghi URL, tác giả nếu biết, và mục đích dùng. File ảnh tải về để trong `refs_web/<id>/` và **thêm vào `.gitignore`**, tránh phình repo. Repo chỉ giữ `refs_web/<id>/SOURCES.md`.
7. Không dùng ảnh ref cũ trong `assets/chibi_ref/` làm tham chiếu cho bản mới, kể cả “cho đúng phong cách”. Phong cách được khóa bằng **style bible** ở bước 2.

---

## 1. Bước 0: Lưu trữ và gỡ asset cũ khỏi git

| Việc | Lệnh / cách làm | Ghi chú |
|---|---|---|
| Lưu trữ | Chép `assets/chibi_ref/`, `assets/chibi_kp/`, `previews/roster-validation-v01/` sang `/Users/huukhanh/cochannhan_archive_assets/roster_v1_2026_10_02/` | Ghi thêm vào `DANH_SACH_DA_CHUYEN.txt` của thư mục lưu trữ |
| Gỡ khỏi git | `git rm -r --cached` các thư mục roster cũ, rồi xóa file | Dùng `bash -c` cho vòng lặp vì zsh không tách từ |
| `.gitignore` | Thêm `refs_web/*/` (giữ `SOURCES.md`) và `incoming_sprites/` (đã có) | |
| **PN và BNB nam** | **Đã chọn B:** giữ sheet PN/BNB cũ đến khi bản mới được duyệt rồi thay từng bộ | Blue đề xuất B, người dùng đồng ý triển khai. Sandbox battle đang phụ thuộc hai sheet này |
| `tools/keypose_approved.json` | Giữ registry production hiện tại; tạo registry riêng cho roster v2 trong vùng review. Lưu registry v1 khi thay bộ đã duyệt | Không bỏ khóa PN/BNB đang chạy hoặc cho bản mới tự thay vào |
| `assets/chibi_kp/index.json`, `roster_preview.html` | Giữ công cụ, danh sách id sinh lại sau khi có bộ mới | |

Commit riêng một lần: “roster v1 archived”. Người dùng tự commit/push.

---

## 2. Bước 1: Hồ sơ nhân vật (dossier) cho mỗi id

Tạo `docs/roster/<id>.md` cho từng nhân vật theo **đúng mẫu** sau. Orange validate từng mục có căn cứ.

```markdown
# <id>: <Tên Việt>

| Trường | Giá trị | Căn cứ |
|---|---|---|
| Tên Việt / Hán / Anh | … / … / … | VN ch.N; tên Hán/Anh để tìm ảnh |
| Nhóm | người · boss người · thú · boss thú · không chiến đấu | |
| Thời kỳ dùng trong game | Q1/Q2, khoảng VN ch.A–B; mốc trận | VN ch.… |
| Giới tính, tuổi tương đối, vóc dáng | … | trích 1 câu + VN ch.N, hoặc `art` |
| Loài / hình thể (thú) | số chân, sừng, cánh, đuôi, lông/vảy | VN ch.N (bắt buộc với thú) |
| Tu vi / chuyển số ở mốc trận | … | VN ch.N |
| Lưu phái | lực đạo, băng đạo… | VN ch.N |
| Vũ khí / vật thể trên người | có/không; nếu có thì vẽ liền sprite hay để FX | VN ch.N |
| Bay / lơ lửng | có/không → cần `hoverOffset` | VN ch.N |
| Cỡ so với PN (`SIZE`) | 1.0 = người thường | `art`, có lý do (ví dụ “cao tám thước” VN ch.N) |

## Ngoại hình theo truyện
- Trích ngắn + chương (tối đa 3 mục).
- Tóm tắt: …

## Ảnh tham khảo trên mạng
| URL | Loại (fan art/manhua/minh họa) | Dùng cho | Ghi chú lệch truyện |

## Phần thiết kế tự do (`art`)
- Màu áo/tóc chốt, kèm **bảng màu khóa** (4–6 mã hex: da, tóc, áo chính, áo phụ, viền/kim loại).

## Cổ trùng / năng lực theo mốc trận
| Cổ / năng lực | Chuyển | Có từ / mất lúc | Tác dụng trong truyện | Căn cứ | Dùng trong battle? |

## Bộ animation
| clip | Loại (chung/đặc trưng) | Gắn với cổ/cơ chế | Pose | Ghi chú anchor (tay/mõm/sừng/thân) |

## Điểm mở cần người dùng chốt
```

**Quy tắc điền:**
- Mỗi dòng “Cổ trùng” phải có chương thật. Năng lực thú (húc, vồ, phun) ghi căn cứ là đoạn tả hành động trong truyện, hoặc `game` nếu truyện không tả.
- Cổ **bị động** (tăng lực vĩnh viễn, thể chất, Xá Lợi…) **không có clip riêng**. Ghi ở cột tác dụng để kit tính chỉ số.
- Một nhân vật xuất hiện ở nhiều mốc (BNB, Thiết Huyết Lãnh…) thì bảng cổ **tách theo mốc**.
- Nhân vật có biến thể (Tửu Khôi / Huyết Khôi, BNB nam/nữ, Điện Lang thường / Lôi Quan Lang / Lang Vương) thì **tách id riêng**, không trộn trong một bộ.

**Cách tra nhanh trong truyện (gợi ý cho Blue):** tải các chương theo khoảng bằng API. Tìm đoạn có tên nhân vật, rồi tìm cụm “`<Tên> cổ`” hoặc “`cổ <Tên>`” trong 2–3 đoạn quanh đó. Sau đó **đọc ngữ cảnh**, vì quét tự động không chứng minh sở hữu: có cổ bị nhắc tới mà nhân vật không dùng. Phụ lục A có điểm bắt đầu cho từng id.

---

## 3. Bước 2: Style bible và prompt chuẩn mới

### 3.1. Style bible (khóa cho cả roster)

`docs/roster/STYLE_BIBLE.md` gồm:
- Tỷ lệ chibi: đầu khoảng 1/3 chiều cao, tổng chiều cao khoảng 3 đầu, tay chân ngắn. Thú: thân gọn, đầu to vừa, tỷ lệ chân giữ đúng loài.
- Góc nhìn: side view nghiêm ngặt, mặt hướng phải, chính diện chiều cao (orthographic).
- Nét: pixel art sắc, viền tối khoảng 1px ở độ phân giải sprite cuối, đổ bóng phẳng 2–3 tông, không gradient, không glow.
- **Nền: trong suốt (ưu tiên) hoặc magenta phẳng `#FF00FF`.** Không dùng xanh `#00FF00` nữa: nhiều nhân vật có áo/tóc xanh và importer phải miễn khử viền.
- Độ phân giải mục tiêu: 1 pose cao khoảng 400–600 px ảnh gen. Importer sẽ thu về.
- **Hai ảnh “chuẩn phong cách”**: một người, một thú, chọn từ base mới đầu tiên được duyệt (thường là PN và Heo rừng). Đính kèm khi gen mọi base sau.
- Những thứ **không vẽ vào sprite**: hiệu ứng chiêu, hạt, bụi, máu, vệt chém, ánh sáng. Vũ khí có trong truyện thì vẽ vào sprite **chỉ khi** nó luôn ở trên người (xích quấn tay…); vật phóng ra (roi lá, đạn) để FX.

### 3.2. Prompt ảnh gốc (base) — vẽ mới, không sửa ảnh cũ

Dán theo thứ tự. Đính kèm: ảnh chuẩn phong cách (sau khi có), cộng 1–2 ảnh tham khảo mạng (nếu có).

```text
Strict side view, character facing right, full body, standing on flat ground.
Cute chibi pixel art sprite: very large head about one third of total height, small short body, short limbs, about 3 heads tall, exactly like the style reference image.
Crisp pixel art, clean dark outlines, approximately one logical pixel at the final sprite resolution, flat shading with 2-3 tones per color, no gradients, no glow.
{CHARACTER}
Color palette locked to: {PALETTE}.
Single character only, no weapon unless stated, no effects, no text.
Background: transparent, or solid flat pure magenta #FF00FF.
```

Thú: thay dòng 2 bằng `Cute compact pixel art animal sprite, slightly large head, sturdy body, correct number of legs for the species, exactly like the style reference image.`

`{CHARACTER}`: 1–2 câu tiếng Anh viết **từ dossier** (giới tính, tuổi, vóc dáng, tóc, trang phục, dấu hiệu nhận dạng theo truyện). Tay không thì ghi `bare hands, both hands empty`. `{PALETTE}` là bảng màu khóa viết bằng chữ + hex (`black hair #1b1b22, jade green robe #3f7d4e…`).

**Gen 3–4 bản → chọn 1.** Lưu `incoming_sprites/<id>_base_vN.png`. Importer lưu ảnh đã chọn thành `assets/chibi_ref/<id>.png`.

### 3.3. Prompt clip

```text
Pixel art game sprite sheet, chibi side-view character, 2D fighting game style, crisp pixel art, clean dark outlines, flat shading.
{CHARACTER}
Color palette locked to: {PALETTE}.
Exactly the same character as the reference image: same face, same hair, same outfit, same colors, same proportions, same pixel art style.
One single horizontal row, poses ordered left to right, all poses the same size and scale, full body visible, wide empty gap between poses, poses must not touch.
Facing right in every pose. Fixed orthographic side view. No effects, no particles, no dust, no motion lines.
Background: transparent, or solid flat pure magenta #FF00FF.
{POSES}
```

Thêm dòng **`poses must not touch`**: lần gen trước 11 bộ idle chỉ ra 1 pose hoặc các pose dính nhau.

**Từ từng gây khó khăn ở các lượt thử Muse, cần kiểm lại theo phiên bản/model (không phải quy luật chắc chắn):** blood, blade, knife, sword, gore, wound, kill, dead, corpse, defeated, collapsed. Viết thay bằng mô tả tư thế: `lying on the side, eyes closed, resting`; `a flat open hand with fingers held tightly together`. Muse vẫn chặn thì dùng Gemini/Leonardo với cùng prompt.

**Tỷ lệ khung:** 3 pose → 3:1 · 2 pose → 2:1 · 1 pose → 1:1. **Tên file:** `<id>_<clip>_vN.png`.

---

## 4. Bước 3: Gói animation theo nhóm

| Nhóm | Clip chung | Ghi chú |
|---|---|---|
| Nhân vật người chơi điều khiển (PN; BNB nếu có chế độ chơi) | idle 2, move 2, hit 2, guard 2, heal 2, dodge 2, ko 3, win 1 | |
| Boss người | idle 2, move 2, hit 2, guard 2, ko 3, win 1 | Thêm heal nếu kit có hồi |
| Đối thủ người | idle 2, move 2, hit 2, ko 3, win 1 | |
| Thú / boss thú | idle 2, move 2, hit 2, ko 2, win 1 | Hình người không phải người (cương thi, khôi) dùng gói người |
| Không chiến đấu | idle 2, warn 2 | |

**Clip đặc trưng:**
- `atk`: đòn thường **đúng cách đánh trong truyện** (đấm, roi lá, xích, vồ, húc…), 3 pose (lấy đà, phát đòn, thu).
- `sk_<cổ>`: **một clip cho mỗi cổ chủ động có động tác khác nhau.** Hai cổ cùng tư thế (cùng là phóng từ tay) có thể dùng chung clip, ghi rõ trong dossier.
- `cast_ground`, `roar`, `howl`: chỉ khi động tác thật sự khác (đặt bẫy, tru gọi bầy).
- Pose 2 cho buff hoặc hộ thể; pose 3 cho đòn có lấy đà và thu.

**Mỗi clip ghi anchor** ở dossier: điểm phát đòn là tay/mõm/sừng/thân, và frame nào phát. Dossier chỉ ghi loại anchor và frame phát. Sau khi có ảnh, đo tọa độ trên từng frame thật bằng sidecar/công cụ đánh dấu; importer không suy tọa độ từ văn bản hoặc pixel ngoài cùng (xem bước 6).

---

## 5. Bước 4: Kit cổ trùng cho battle

Từ bảng cổ trong dossier, Blue viết đề xuất kit vào `docs/roster/<id>.md` mục mới “Kit battle đề xuất”. Định dạng theo `js/sandbox/kits.js`:
- trường `kind` (melee, proj, aoe, grab, buff, empower, dash, heal…);
- trường `src` ghi `VN ch.N` hoặc `game`;
- trường `startup/active/recovery/cd/cost/dmg` để **trống hoặc ghi “đề xuất”**. Số liệu chốt sau khi bench và chơi thử, không chốt trong dossier.

Ràng buộc:
- Chi phí chân nguyên theo chuyển số và chất lượng. Cổ cao chuyển dùng bằng chân nguyên thấp hơn thì đắt hơn (VN ch.137, BNB dùng Sương Yêu khi đang áp chế).
- Cổ bị động không thành nút bấm.
- Boss có bộ cổ theo mốc trận. **PN không có bộ cố định**, kit PN sinh từ inventory/save khi nối campaign.

---

## 6. Bước 5: Sửa pipeline trước khi gen hàng loạt

Đây là các lỗi trong review roster v01. Phải sửa xong trước, nếu không sẽ phải gen lại để che lỗi tool.

| Việc | Người làm | Kiểm |
|---|---|---|
| Importer nhận nền magenta (ngưỡng màu + flood fill từ mép + khử ám viền), bỏ ngoại lệ miễn khử xanh | Blue | Orange: test ảnh có áo xanh lá, tóc trắng |
| Anchor theo dữ liệu: `anchors` trong manifest (tay/mõm/sừng/thân, theo frame), nhập từ dossier hoặc công cụ đánh dấu; bỏ cách đoán `hand` bằng pixel ngoài cùng | Blue | Orange: so 3 clip mẫu |
| `hoverOffset` cố định cho nhân vật lơ lửng; `frameOffsets` theo pha cho nhảy/dodge. Giữ virtual floor, không ép chân đang bay xuống sàn | Blue | Orange: chụp battle |
| Kiểm khóa màu trên vùng được đánh dấu thủ công; chỉ cảnh báo, không tự sửa palette. Không đo median cả sprite | Blue | Orange |
| Báo pose dính nhau (1 pose cần 2) và đề nghị gen lại, không nhân đôi frame trừ idle được người dùng cho phép | Blue | Orange |
| Diện tích thân × `SIZE` chỉ là gợi ý/cảnh báo. V2 khóa một scale cho cả actor; pose khom/nằm không được tự resize theo bbox/diện tích | Blue | Orange |
| `reach_px` cho mọi manifest (view dùng tính lề màn hình) | đã có | |

---

## 7. Quy trình validate (mỗi nhân vật đi qua 5 cổng)

| Cổng | Blue nộp | Orange kiểm | Người dùng |
|---|---|---|---|
| **G1 · Dossier** | `docs/roster/<id>.md` (trừ kit) | Mở từng chương được dẫn: ngoại hình, loài, giới tính, mốc; cổ đúng chuyển/tác dụng/thời điểm; sót cổ quan trọng; phân biệt `canon`/`game`/`art`; trích dẫn ngắn đúng nguyên văn | Chốt phần `art` (màu, kiểu tóc) |
| **G2 · Prompt base** | Prompt base + bảng màu + ảnh tham khảo | Khớp dossier từng chi tiết; không có từ bị chặn; không cài vũ khí/hiệu ứng sai | — |
| **G3 · Base** | 3–4 ảnh base đã gen | Đúng side view, tỷ lệ chibi, số chân/sừng, màu khóa, nền sạch | **Chọn 1 base** |
| **G4 · Clip** | Toàn bộ clip + kết quả importer + contact sheet | Chạy importer trên bản sao (không ghi đè `assets/`); số pose, tách pose, viền, tỷ lệ giữa clip, anchor, hover, pose đúng cổ/cách đánh | Duyệt hình |
| **G5 · Battle** | Kit đề xuất + clip đã nhập | Nạp vào sandbox với id riêng: mirror, release/contact, kết → idle, KO ở biên; chụp màn hình; hồi quy logic | Chơi thử; `--approve` |

Orange ghi kết quả ngay trong dossier, mục `## Validate (Orange, ngày)`, chia **Lỗi cần sửa / Đồng ý / Chờ người dùng**. Lỗi canon phải dẫn được chương và câu cụ thể. Không ghi “có vẻ sai”.

Blue sửa xong thì ghi `## Đã sửa (Blue, ngày)`. Orange kiểm lại đúng các mục đó rồi đóng cổng.

---

## 8. Thứ tự làm

| Đợt | Nhân vật | Lý do |
|---|---|---|
| Pilot | `phuong_nguyen`, `heo_rung`, `phuong_chinh` | Lấy hai ảnh chuẩn phong cách (người/thú); thử áo xanh với nền magenta |
| 1 · Battle Q1 đang dùng | `bach_ngung_bang_nam` (tách mốc trận đầu / Thanh Thư / ch166), `thanh_thu`, `dien_lang`, `dian_lang_boss` (tách Lôi Quan Lang / Lang Vương nếu khác hình) | Sandbox và campaign gần nhất |
| 2 · Q1 còn lại | `mac_bac`, `xich_thanh`, `hoc_duong_gia_lao`, `thiet_huyet_lanh`, `co_kim_sinh`, `nhat_dai_boss`, `hac_hung`, `thach_hau`, `tuu_khoi`/`huyet_khoi` (tách id), `ca_sau_sau_chan` | |
| 3 · Q2 | còn lại trong Phụ lục A | |
| Ngoài lề | `bach_ngung_bang_nu`, `ba_quy_spirit`, `hien_vien_than_ke` | Không đánh hoặc ngoài thời kỳ |

Blue làm tuần tự theo đợt, tự kiểm kỹ thuật và giữ identity để giảm lỗi; không chờ Orange đóng G4/G5 mới sang đợt tiếp. Sau khi tạo đủ ảnh theo danh sách và báo rõ phần thiếu, bàn giao cả bộ cho Orange validate asset. Chỉ thay vào game sau người dùng duyệt.

---

## 9. Tiêu chí nghiệm thu cả roster

- Mỗi id có dossier đủ mục, mọi dòng `canon` có chương bản Việt và đã qua Orange.
- Base được người dùng chọn. Mọi clip cùng nhân vật cùng màu khóa, cùng tỷ lệ đầu/thân.
- Không còn hiệu ứng vẽ sẵn trong sprite. Vũ khí liền thân được ghi rõ.
- Manifest có `anchors`, `reach_px`, `hoverOffset` (nếu bay). Không clip nào dùng `hand` đoán theo pixel ngoài cùng.
- Kit đề xuất mọi cổ chủ động có `src`. Không có cổ ngoài thời kỳ.
- `keypose_approved.json` chỉ ghi id người dùng đã duyệt.

---

## Phụ lục A. Điểm bắt đầu tra cứu (bản Việt, quét tự động)

Orange quét tên trong VN ch.1–480. Đây **chỉ là chỗ bắt đầu đọc**, chưa chứng minh vai trò hay cổ. Tên không tìm thấy nghĩa là bản dịch dùng tên khác. Blue cần tìm tên đúng.

| id | Tên tìm | Chương có tên (VN) | Ghi chú |
|---|---|---|---|
| thanh_thu | Thanh Thư | 104–143 | Cổ được nhắc gần tên: Mộc Mị, Thanh Đằng, Ngư Lân, Nguyệt Toàn, Tùng Châm (cần đọc ngữ cảnh) |
| phuong_chinh | Phương Chính | 18–106, 335–367 | Gần tên: Nguyệt Quang, Ngọc Bì, Bạch Ngọc, Toàn Lực Ứng Phó (Q2) |
| mac_bac | Mạc Bắc | 21–82 | Gần tên: Hoàng Lạc Thiên Ngưu (ch 63, 82) |
| xich_thanh | Xích Thành | 25–155 | Gần tên: Long Hoàn Khúc Khúc / Xích Hoàn Khúc Khúc, Tịnh Thủy |
| hoc_duong_gia_lao | gia lão học đường | 4–27… | Cần tên riêng của gia lão |
| thiet_huyet_lanh | Thiết Huyết Lãnh | 57–59, 113, 170–198 | Gần tên: Thiên Địa Hoành Âm (ch 186) |
| co_kim_sinh | Kim Sinh | 44–56 | Gần tên: Hắc Thỉ |
| nhat_dai_boss | Nhất Đại | 186–206 | |
| dian_lang_boss | Lôi Quan Lang | 112–164 | |
| dien_lang | Điện Lang | 132–160 | |
| thach_hau | Thạch Hầu | 79–122 | Gần tên: Ẩn Thạch, Ẩn Lân |
| hac_hung | Hắc Hùng / gấu đen | 151–152 | Gần tên: Ngự Hùng |
| ca_sau_sau_chan | “sáu chân” | 191, 210–214, 229 | |
| ca_sau_dung_nham | “dung nham” | 216–218 | Xác nhận đúng con vật |
| hien_vien_than_ke | Hiên Viên / Thần Kê | 218, 229 | |
| tran_thuy_hoa | Thúy Hoa | 222–224 | |
| thiet_dao_kho | Thiết Đao Khổ | 229–248 (…) | **Lệch số với roster cũ (443–445)** |
| bach_chien_liep / bach_chien_on / bach_lien | Bách Chiến / Bách Liên | 233–248, 345–347 | |
| phi_tuong | Phi Tượng | 277–286 | VN ch.277: toàn thân phủ lông chim trắng, ngà cong dài một trượng, bay được; không nhắc cánh |
| phi_hau | Phỉ Hầu | 266–286 | |
| au_duong_cong | Âu Dương | 282–286 | |
| cuong_thi | Bạch Mao / Cương thi | 288–292 (cương thi cũng ở 135) | |
| huyet_thu_ma_tu | Huyết Thủ | 318–319 | |
| cu_khai_bi | Cự Khai Bi | 364–383 | Gần tên: Toàn Lực Ứng Phó, Long Tượng Cự Lực |
| viem_dot | Viêm Đột | 364–377 | |
| hoanh_mi | Hoành Mi | 414–433 | |
| tiet_tam_tu | Tiết Tam Tứ | 417–438 | |
| han_bat_luu | Hàn Bất Lưu | 425–427 | |
| thiet_ba_tu | Thiết Bá Tu | 443–450 | |
| thiet_mo_bach | Thiết Mộ Bạch | 457–464 | |
| vu_quy | Vu Quỷ | 461–475 | Tên “Ô Cật” không thấy |
| ba_quy_spirit | Bá Quy | 468–478 | |
| tuu_khoi_huyet_khoi | Tửu Khôi / Huyết Khôi | không thấy | Tìm tên đúng trong bản dịch |
| thiet_nhuoc_nam | Nhược Nam | 182–192, 464 | Chốt mốc dùng (Q1 hay Q2) |

Đã xác minh ở các lượt trước (Orange đọc chương):
- **BNB:** ch.134 áp chế nhị chuyển; ch.136 Lam Điểu Băng Quan và Thủy Tráo; ch.137 Sương Yêu tăng công và tự hại; ch.139–140 nổ Sương Yêu cùng tay phải; ch.143 PN đoạt Xích Thiết Xá Lợi, Thạch Khiếu, Thủy Tráo; ch.166 Băng Trùy.
- **PN:** ch.155 hợp luyện Thiên Bồng; cổ được gia tộc thưởng là Lôi Dực.

## Phụ lục B. Tìm ảnh tham khảo trên mạng

- Tìm bằng tên Hán và tên Anh: `蛊真人 <tên Hán> 同人`, `Reverend Insanity <English name> fanart`. Các nơi nên thử: Pixiv, Bilibili, Weibo, Lofter, Pinterest, Reddit r/ReverendInsanity, wiki Fandom.
- Tên chắc chắn: Phương Nguyên 方源 (Fang Yuan), Bạch Ngưng Băng 白凝冰 (Bai Ning Bing), Phương Chính 方正 (Fang Zheng), Cổ Nguyệt Thanh Thư 古月青书 (Gu Yue Qing Shu), Thiết Huyết Lãnh 铁血冷 (Tie Xue Leng), Thiết Nhược Nam 铁若男 (Tie Ruo Nan). Các tên khác Blue tra và ghi vào dossier.
- Ảnh fan art có thể lệch mốc truyện (ví dụ vẽ BNB thân nữ, là hình dạng về sau, trong khi Q1 cần thân nam). Mỗi ảnh dùng phải ghi “lệch truyện ở đâu” trong dossier, và **prompt theo truyện chứ không theo ảnh**.
- Không có ảnh phù hợp thì bỏ trống, prompt dựa hoàn toàn trên dossier.

## 10. Blue-chan — tiếp nhận triển khai (02/10/2026)

- Giữ PN/BNB và approved registry production trong lúc làm v2. Chưa gỡ/xóa bộ đang chạy.
- Phân biệt `visual_id` (tạo hình), `boss_profile` (kit theo mốc), `visual_state` (hai tay/mất tay, dạng biến đổi). Đổi bộ cổ không tự sinh sprite mới; thay hình thể mới cần biến thể hình.
- Pilot G1: PN, Heo rừng, Phương Chính. Phụ lục A là chỉ mục tìm kiếm, chưa phải chứng minh sở hữu cổ; đặc biệt không cấp Toàn Lực Ứng Phó cho Phương Chính chỉ vì tên nằm gần nhau.
- Thứ tự thực thi: importer v2 xuất vùng review → dossier có nguồn đã đọc → style bible → prompt → người dùng chọn base → clip → battle. Chưa gen hàng loạt trước khi pilot đạt G5.
- Chọn một nền trong từng prompt: alpha nếu công cụ xuất alpha thật, nếu không dùng magenta; không ghi hai lựa chọn để model tự hiểu.
- Anchor theo tọa độ frame thật; hover cố định tách khỏi độ cao nhảy theo pha. Đây là offset hình ảnh, không dịch hitbox theo pixel sprite.

Công cụ v2: `tools/keypose_import_v2.py`, hướng dẫn [docs/roster/PIPELINE_V2.md](../roster/PIPELINE_V2.md). Không chạy importer legacy lên nguồn v2: legacy còn tự đo scale và nhân đôi idle. Base/dossier/nguồn truyện vẫn phải qua cổng review, không được tự approve bởi script.

## 11. Blue-chan — G1/pipeline tiếp theo (03/10/2026)

Đã tạo hồ sơ pilot [PN](../roster/phuong_nguyen.md), [Heo rừng](../roster/heo_rung.md), [Phương Chính](../roster/phuong_chinh.md), chờ Orange validate. Đọc cache chương bản Việt, live API trả 403; lưu provenance/hash tại `docs/roster/SOURCE_AUDIT.json`. Không ghi cache là tải trực tiếp thành công.

Importer v2 có công cụ merge actor review, không approve. Runtime/viewer hỗ trợ offset/hover/anchor theo frame; mirror X một lần và bóng giữ trên sàn. Regression logic, import, metadata và Chrome đạt. Chưa tạo base v2, chưa thay/xóa asset production. Cổng G1/G2/G3 còn mở; PN không phải kit cố định. Các file Orange đang chỉnh `kits.js`/`sim.js` được giữ nguyên.

## 12. Người dùng đổi thứ tự validate asset (03/10/2026)

**Chỉ đạo mới nhất: “tạo xong hết ảnh Orange mới validate asset”.** Mục 7 là checklist nghiệm thu sau sản xuất, không phải chuỗi chặn Blue trước mỗi lượt gen.

1. Blue hoàn thiện nguồn/dossier/prompt đủ để sản xuất, tự xử lý lựa chọn art thông thường theo style bible. Điểm canon chưa rõ phải ghi thiếu/chờ xác minh; không tự biến chúng thành canon.
2. Blue tạo bộ base và clip theo các đợt mục 8, tự chọn base làm working reference và giữ các phiên bản trong vùng review. Working reference chưa đồng nghĩa người dùng duyệt.
3. Tự kiểm frame/identity/palette/anatomy/anchor để sửa lỗi rõ; không gọi tự kiểm là Orange đã validate. Không chờ Orange từng base/clip mới tiếp tục gen.
4. Khi bộ ảnh hoàn thành, bàn giao danh mục ảnh thực tế, preview, nguồn, metadata và danh sách thiếu/lỗi cho Orange kiểm cả bộ. Không ghi hoàn tất khi vẫn thiếu ảnh.
5. Sau review/sửa, người dùng duyệt mới approve và thay asset production. PN/BNB cũ vẫn chạy đến lúc thay.

Chỉ thay thứ tự review, không bỏ yêu cầu nguồn nguyên tác và không cho tự approve.
