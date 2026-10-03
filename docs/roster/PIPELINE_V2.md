# Pipeline roster v2 — Blue-chan, 02/10/2026

> 03/10/2026, sau review Orange: base v03 có 35 bản chấp nhận về danh tính giữ nguyên, ba bản sửa chờ kiểm lại và hai ID chờ quyết định. Xem `previews/roster-base-v03/orange_recheck.html` và phần cuối README cùng thư mục. `base_identity_locked` là khóa danh tính theo review, không phải approve runtime. Không tạo clip từ ba bản còn chờ kiểm. Quan hệ chiều cao ghi ở dossier PC/Xích Thành/Mạc Bắc/Thiết Huyết Lãnh; không chuẩn hóa tất cả về cùng chiều cao người.

## Đã có

`tools/keypose_import_v2.py` là đường nhập riêng, không thay importer legacy đang dùng cho v1. Chỉ xuất vùng review, không approve hoặc ghi vào `assets/`.

- PNG alpha giữ nguyên alpha, không lọc màu áo/tóc.
- Nền magenta xóa theo ngưỡng và flood fill nối mép, khử ám màu trong dải viền 2px; vùng magenta bị bao kín giữ lại để người review chọn mask, không xóa toàn ảnh theo màu.
- Mỗi pose có rect tường minh và điểm đăng ký (`registration_px`); tất cả dùng chung một `scale`, `frame_size`, `pivot_px` của actor. Không đo diện tích/mặt để resize từng pose.
- Từ chối rect chồng/tràn, sai số frame, frame rỗng, timing sai và pose/offset tràn canvas. Không nhân đôi idle.
- Anchor tay/mõm/sừng/thân/contact/ground được đo trên từng rect thật. Frame release phải có anchor; không tự đoán pixel ngoài cùng.
- `frameOffsets`: dịch hình từng pha; `hoverOffset`: độ cao cố định, dương là nâng lên. `reach_px` tính cả offset để review lề.

## Cách dùng

```bash
PYTHONDONTWRITEBYTECODE=1 python3 tools/keypose_import_v2.py incoming_sprites/<id>_<clip>_v1.png --spec <sidecar.json>
PYTHONDONTWRITEBYTECODE=1 python3 tools/keypose_import_v2_regression.py
```

Sidecar mẫu (tọa độ minh họa, phải đo lại trên ảnh thật):

```json
{
  "id": "heo_rung",
  "action": "atk",
  "frame_size": [384, 256],
  "pivot_px": [192, 230],
  "scale": 0.25,
  "expected_frames": 3,
  "durations_ms": [220, 120, 320],
  "release": 1,
  "loop": false,
  "key_color": "#FF00FF",
  "key_tolerance": 60,
  "hoverOffset": 0,
  "samples": [
    {"rect": [0, 0, 600, 600], "registration_px": [300, 550]},
    {"rect": [600, 0, 600, 600], "registration_px": [300, 550], "offset_px": [0, -12], "anchors": {"mouth": [500, 300]}},
    {"rect": [1200, 0, 600, 600], "registration_px": [300, 550]}
  ]
}
```

- PNG alpha thật: bỏ `key_color`.
- Rect tính trên ảnh nguồn, anchor và registration tính tương đối với góc rect.
- `scale` chuyển source pixel sang sprite pixel; offset/hover tính bằng sprite pixel sau scale.
- Pixel lưu trong PNG chưa cộng offset/hover. Runtime hiện cộng vào hình **và anchor**, mirror offset X cùng actor, giữ bóng/hitbox ở tọa độ world. Không cộng hai lần.
- Giữ cùng canvas/pivot trên mọi sidecar của cùng actor. Mỗi nguồn được dùng `source_scale` riêng khi có `normalization` đo chiều cao đầu hoặc chiều dài thân; merge kiểm cùng metric/target và cỡ sau scale lệch không quá 5%. Clip không khai báo normalization vẫn phải cùng scale. Công cụ `tools/keypose_merge_v2.py` ghép actor review, bắt buộc cùng id/canvas/pivot và có idle. Không tự approve.
- Trích pose bằng rect không chứng minh anatomy hoặc pose không dính: reviewer vẫn phải xem ảnh. Không tự tạo rect từ contact sheet AI.

## Chưa triển khai / cổng tiếp theo

1. Dossier PN, Heo rừng, Phương Chính đã có bản G1 chờ Orange validate. Đã đọc cache chương bản Việt; live API trả 403. Nguồn/hash trong `SOURCE_AUDIT.json`; không dùng chỉ mục tên làm chứng cứ sở hữu cổ.
2. Orange review importer trên ảnh nguồn thật; test tổng hợp đã đạt nhưng chưa chứng minh xóa viền tốt cho mọi ảnh Muse.
3. Công cụ đánh dấu anchor/vùng palette bằng UI; cảnh báo màu theo vùng. Hiện nhập sidecar thủ công, không tự sửa màu.
4. Runtime đã đọc `anchors/frameOffsets/hoverOffset`; loader nhận `kit.spriteReviewDir` dưới `previews/`. Roster viewer hỗ trợ `?manifest=previews/.../manifest.json`. Merge actor và test mirror/hover đã đạt. Chưa thay asset production hoặc nghiệm thu contact trên clip v2 thật.
5. Style bible là đề xuất 3 đầu, chưa có hai base chuẩn đã duyệt. Chưa gen ảnh, chưa xóa ref v1 hay reset registry production.

Chỉ thay asset sau G3/G4/G5 theo kế hoạch. Bộ PN/BNB hiện hành vẫn phục vụ sandbox; v2 không được ghi đè trước khi người dùng duyệt.

## Cập nhật 03/10/2026 — bàn giao Orange

- Hồ sơ G1: [PN](phuong_nguyen.md), [Heo rừng](heo_rung.md), [Phương Chính](phuong_chinh.md). PN là hồ sơ pilot có danh sách nguồn đã đọc, không phải toàn bộ inventory.
- Merge review: `python3 tools/keypose_merge_v2.py previews/roster-v2-import/<id>/idle previews/roster-v2-import/<id>/atk --output previews/roster-v2-actors/<id>` (output tách khỏi thư mục nguồn).
- Viewer: `/roster_preview.html?manifest=previews/roster-v2-actors/<id>/manifest.json`.
- Kiểm: `python3 tools/keypose_import_v2_regression.py`, `node tools/kp_metadata_regression.cjs`, `node tools/kp_browser_regression.cjs`, test sandbox/input đã đạt. [Bằng chứng Chrome](../../previews/roster-v2-validation/browser_report.json) dùng texture v1 với metadata thử trong bộ nhớ, **không phải base v2 đã gen**.
- Phát hiện cần review kit: Cường Thủ canon đoạt cổ, cần đứng duy trì (VN ch.131/138/143), không phải kéo người. Không tự đổi grab hiện tại; xem dossier PN. Phương Chính ch.98 là nhị chuyển nhưng cổ đang có vẫn nhất chuyển, không cấp cổ từ bí phương tương lai.
- Chưa làm UI đánh dấu anchor/vùng palette, chưa kiểm keying trên nguồn v2 thật, chưa đóng G1/G2/G3. Theo chỉ đạo mới 03/10, Blue tạo đủ bộ ảnh trước rồi Orange validate asset. Dossier còn mở không phải yêu cầu chờ Orange mới được gen; Blue phải tự đọc nguồn và ghi rõ bất định trước sản xuất.

## Thứ tự mới theo người dùng — 03/10/2026

Blue tạo đủ ảnh trước, Orange validate asset sau. Các cổng G1–G5 là checklist review/bàn giao, không chặn mỗi lượt sản xuất. Base Blue chọn để giữ identity là working reference, chưa phải approved. Blue vẫn tự kiểm và sửa lỗi ảnh rõ ràng; mọi ảnh mới nằm ở vùng review. Chưa có đủ ảnh thì phải báo phần còn thiếu, không ghi “xong roster”. PN/BNB hiện tại chỉ thay sau người dùng duyệt.

## Validate pipeline (Orange, 03/10/2026)

Chạy `keypose_import_v2_regression.py`, `kp_metadata_regression.cjs`: đạt. API chương bản Việt trả **200** khi Orange kiểm (03/10), không còn 403.

**Lỗi cần sửa:**
1. **Một `scale` chung cho cả actor sẽ làm nhân vật đổi cỡ giữa các clip.** `keypose_merge_v2.py` từ chối nếu scale khác nhau. Nhưng Muse vẽ mỗi ảnh ở mật độ điểm ảnh khác nhau: ở roster v1, cùng một nhân vật mà cỡ điểm ảnh đo được dao động 5,5–9 px (log nhập Âu Dương Công: atk 8,98, guard 5,50, hit 6,00). Đề xuất: mỗi sidecar có `source_scale` riêng (đo bằng một chiều chuẩn, ví dụ chiều cao đầu trên pose idle-like), merge kiểm **cỡ đầu sau scale** bằng nhau ±5% thay vì scale bằng nhau.
2. **Vùng magenta bị bao kín bị giữ lại** (giữa tay và thân, giữa hai chân) sẽ thành lỗ hồng trên sprite, mỗi clip phải mask tay. Vì nền đã chọn màu không có trong nhân vật, đề xuất: xóa thêm vùng kín nếu (a) màu cách key ≤ 30, và (b) vùng lớn hơn khoảng 12 px² nguồn. Vùng nhỏ hơn vẫn để review.
3. **Cache chương nằm trong thư mục tạm của phiên Orange** (`/tmp/claude-501/...`), sẽ mất khi phiên kết thúc, khiến hash trong `SOURCE_AUDIT.json` không kiểm lại được. Chép cache sang chỗ cố định ngoài repo, ví dụ `/Users/huukhanh/cochannhan_archive_assets/chapters_vn/`, rồi sửa đường dẫn.

**Đồng ý:**
- Rect và anchor khai báo tường minh, không đoán pixel ngoài cùng.
- `hoverOffset` / `frameOffsets` cộng một lần ở runtime cho cả hình và anchor; mirror X.
- Không tự approve, không ghi `assets/`.

**Phát hiện liên quan FX:** ch.138 tả Cường Thủ cổ là bọ cánh cứng đen, đầu có càng sắt, lưng có đốm trắng. Truyện không có “bàn tay sắt khổng lồ”, nên prompt `fx_cuongthu` (bàn tay thép mở → chộp) trong `PROMPT_MUSE_ROSTER.md` §4b là chuyển thể. Nếu giữ thì ghi `art`. Nếu làm theo truyện thì FX là con bọ/lực vô hình, kèm channel đứng yên (ch.131).

## Prompt để người dùng tạo bằng Muse

[Prompt độc lập cho base và từng clip của ba pilot](../prompts/PROMPT_MUSE_ROSTER_V2.md). Mỗi khối đã đủ character/palette/pose để copy riêng; clip đính kèm base mới cùng actor. Hiện có 3 base + 29 clip prompts, chưa phải bộ 40 ID.


## Blue tiếp nhận review Orange — 03/10/2026

Đã sửa ba điểm: `source_scale` riêng có kiểm chuẩn `normalization` (head_height hoặc torso_length, source_px/target_px); keying vùng magenta kín chỉ khi `key_reserved_for_background: true`, khoảng cách màu tối đa 30 và diện tích lớn hơn 12 px² nguồn; 480 chương cache chép nguyên byte vào `/Users/huukhanh/cochannhan_archive_assets/chapters_vn/`, cập nhật audit 14 nguồn đã ghi. Không tuyên bố vừa tải lại API.

`python3 tools/keypose_import_v2_regression.py` đạt, gồm nguồn khác scale nhưng cùng kích thước đầu sau nhập, sai chuẩn bị từ chối, vùng hồng kín lớn bị xóa còn vùng nhỏ và màu xanh được giữ. Chưa thay sản xuất.

Theo yêu cầu mới, Blue đang tạo đủ 40 **base**, không tạo clip animation. Prompt/nguồn/trạng thái và ảnh trong `previews/roster-base-v02/`; xem catalog để biết số đã hoàn thành. PN mới là working style master chưa duyệt. Muse dùng từng base đã duyệt của chính nhân vật để tạo animation.


## Bộ base Blue đã tạo xong — 03/10/2026

Đủ 40/40 ID trong [gallery](../../previews/roster-base-v02/README.md), thêm 4 bản sửa; PNG alpha, side-right, chưa duyệt. [40 prompt thực dùng](../prompts/PROMPT_BASE_ROSTER_40_V2.md). Muse làm animation sau khi chọn base; không tạo clip mới ở lượt này. Orange xem catalog để phân biệt nguồn truyện, fanart và thiết kế art. Không thay asset game/approve/commit/push.


## Đính chính sau review danh tính — 03/10/2026

Bộ base v02 không đạt: ảnh PN làm style master khiến các nhân vật dùng chung khuôn mặt. Bỏ cách này. [Quy tắc sửa v03](SUA_DANH_TINH_BASE_V03.md): reference riêng từng nhân vật, ghi input ảnh thực gửi, không coi URL đã đọc là ảnh đã đính kèm. Đủ 40 file chưa có nghĩa hoàn thành roster dùng được; chưa bàn giao sang Muse tạo animation.

## Lượt tạo base v03 theo reference riêng — 03/10/2026

Theo yêu cầu tìm nguồn và tạo trong cùng lượt: đã tạo 38 base, còn `huyet_thu_ma_tu` và `tuu_khoi_huyet_khoi` chưa xác định được danh tính/biến thể, để người dùng quyết. [Gallery và bàn giao](../../previews/roster-base-v03/README.md) ghi bản đang chọn và trạng thái kiểm; [nhật ký tìm nguồn](../../previews/roster-base-v03/SEARCH_REVIEW.md) ghi ảnh chọn/loại. Không dùng base PN hay sprite v02 làm reference chung.

Có 7 minh họa riêng được chọn đúng nhân vật và một ảnh heo thật hỗ trợ giải phẫu. 30 base còn lại dựa trên mô tả truyện với các chi tiết mỹ thuật được đánh dấu; không tuyên bố có ảnh reference cho cả roster. PNG dùng alpha hoặc nền magenta phẳng tùy bản. Đây là base để duyệt, chưa phải clip, manifest production hay bộ đã được Orange nghiệm thu.
