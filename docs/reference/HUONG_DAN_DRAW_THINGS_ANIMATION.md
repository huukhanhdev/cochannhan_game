# Draw Things — từ cài app đến animation frame dùng cho battle

**Cập nhật sau thử nghiệm 02/10/2026: dừng hướng Wan local.** Người dùng báo render chậm, nóng máy và đầu ra không có chuyển động mong muốn; đã yêu cầu xóa Wan cùng encoder/VAE (~13,68 GB). Hướng dẫn dưới đây được giữ để truy nguyên, không phải đề xuất tải lại. Xem [báo cáo hiện trạng pixel animation/battle](../undone/HIEN_TRANG_PIXEL_ANIMATION_BATTLE.md).

02/10/2026. Hướng thử nghiệm cho **MacBook Air M4, RAM 16 GB** của bạn. Chưa cài app, tải model hoặc tạo clip trong đợt viết hướng dẫn này. Máy đã có FFmpeg và Python/Pillow.

Mục tiêu: **PNG nhân vật đã duyệt → AI tạo video chuyển động → chọn chu kỳ → PNG RGBA → spritesheet → preview → battle sandbox**. Game vẫn phát frame; không dùng puppet. Draw Things không bảo đảm giữ pixel, diện mạo hoặc tạo loop chỉ bằng prompt.

## 1. Cài ứng dụng và chạy local

1. Mở [trang chính thức](https://drawthings.ai/), bấm **Get it on the App Store**, rồi Get/Install trong Mac App Store. Hoặc dùng bản macOS trên [Downloads chính thức](https://drawthings.ai/downloads/), giải nén và đưa app vào Applications.
2. Mở Draw Things. Nếu onboarding đề nghị tải model ảnh mặc định, có thể bỏ qua để tránh tải model không dùng cho video.
3. Chọn chạy trên máy: **Local / Local Only** nếu phiên bản hiển thị lựa chọn đó. Không chọn Cloud Compute, Server Offload hoặc Remote API Provider cho bài thử này.
4. Chạy local không cần API key PixelLab hay thuê bao Draw Things+. Cần mạng lúc tải app/model; sau đó dùng tài nguyên máy. Đây là tính năng của [Free Edition](https://drawthings.ai/), khác với hạn mức cloud.
5. Cắm sạc, đóng ứng dụng nặng. Mở Activity Monitor → Memory để theo dõi Memory Pressure. Không cần sửa thiết lập hệ thống hoặc bật quyền truy cập toàn bộ ổ đĩa để tạo ảnh.

Tên/nơi đặt nút có thể đổi theo phiên bản. Hướng dẫn dưới đây chỉ rõ mục đích thao tác; không giả định mọi phiên bản có cùng giao diện.

## 2. Chọn model cho máy 16 GB

**Thử Wan 2.2 TI2V 5B bản nén trước**, không bắt đầu bằng 14B hoặc LTX 22B. Đây là lựa chọn thử nghiệm theo quy mô model, chưa phải benchmark trên máy bạn.

[Wan chính thức](https://github.com/Wan-Video/Wan2.2) phân biệt TI2V-5B (ảnh/text → video) với T2V (text → video) và I2V-A14B. Bản chạy gốc TI2V được công bố cho 720p/24fps và cần tài nguyên đáng kể; yêu cầu CUDA trong repo Wan không phải yêu cầu cài đặt Draw Things. App có cơ chế chạy/nén riêng. Không suy ra “5B chắc chắn vừa 16 GB”.

| Model | Vai trò trong bài thử |
|---|---|
| Wan 2.2 **TI2V 5B**, bản nén phù hợp app | Lựa chọn đầu tiên; bắt buộc nhận ảnh đầu vào |
| Wan 2.2 I2V A14B high/low noise | Để sau; nhiều thành phần và nặng hơn |
| Wan T2V thuần | Không chọn cho mục tiêu giữ sprite gốc |
| SD 1.5 / SDXL / model ảnh | Tạo/sửa ảnh tĩnh, không tự tạo chuyển động liên tục |
| LTX 22B / model lớn khác | Không tải ngay trên máy 16 GB |

### Tải trong app

1. Mở bộ chọn **Model** và tìm `Wan`, rồi `2.2`, `TI2V`, `5B`.
2. Xem thông tin model trước khi Download. Phải là video có hỗ trợ ảnh đầu vào, không chỉ tên có chữ Wan.
3. Ưu tiên bản nén do app cung cấp, chẳng hạn 8-bit/quantized nếu có. Không mặc định chọn 4-bit vì tiết kiệm RAM cũng có thể giảm chất lượng.
4. Cho app tải các thành phần phụ được yêu cầu (text encoder/VAE). Dung lượng model chính không phải tổng RAM lúc chạy. Chuẩn bị dư ổ đĩa theo tổng download app báo, cộng chỗ chứa video/PNG; không dựa vào một số GB cố định.
5. Chọn model đã tải, tải cấu hình khuyến nghị tương ứng nếu có. App có **Reset to recommended / Community Configurations**; cấu hình community là điểm thử, không phải bảo đảm tốt.

Draw Things ghi nhận hỗ trợ import Wan 2.2 5B trong [release notes](https://drawthings.ai/downloads/). Điều đó không bảo đảm nó luôn xuất hiện trong danh sách tải mặc định.

**Nếu không thấy 5B:** vào quản lý model → Customize/Import (xem [tài liệu model](https://github.com/drawthingsai/community-docs/blob/main/Documentation.docc/2.Models.md)). Chỉ import khi nhận diện đúng kiến trúc và app nhận được tất cả thành phần. Không tải nguyên repo Wan nhiều GB rồi chọn ngẫu nhiên safetensors. Nếu app chỉ có 14B hoặc import báo không hỗ trợ, dừng ở đây và gửi ảnh màn hình bộ chọn model + phiên bản app để xác định gói tương thích; không cần mua cloud hoặc đổi model bừa.

## 3. Chuẩn bị ảnh đầu vào

1. Chọn **một PNG pose B PN đã duyệt**, không dùng GIF, screenshot cuộc trò chuyện hay sheet nhiều nhân vật. Có thể đối chiếu asset `assets/chibi_side/phuong_nguyen_side_full.png`, nhưng chỉ dùng nếu đúng thiết kế bạn muốn giữ.
2. Nhân vật nhìn sang phải, đủ toàn thân, hai chân rõ, mặt lạnh bình tĩnh. Idle bắt đầu từ B; run cần ảnh pose đang chạy M đã duyệt để tránh video mất thời gian đứng rồi mới chạy.
3. Tạo một bản input riêng, giữ source gốc. Đặt sprite trên **nền phẳng sáng, không texture**, tương phản với áo/tóc đen; không dùng nền đen để rồi xóa đen, vì sẽ mất cả nhân vật.
4. Chừa khoảng trống quanh tóc và bước chân. Giữ cùng camera, bố cục và tỷ lệ. Nếu phóng pixel sprite, dùng nearest-neighbor ở tỷ lệ nguyên. Không làm nhân vật sát viền canvas.
5. PNG trong suốt thường bị video model xử lý thành nền đặc. Đây là bình thường; RGBA sạch được tạo ở bước hậu kỳ, không hứa video có alpha.

## 4. Thiết lập bài thử nhỏ

Các giá trị dưới đây là **đề xuất thử**, không phải preset chính thức đã được kiểm chứng. Giữ sampler/guidance/shift theo cấu hình khuyến nghị đúng model, vì chúng khác nhau giữa model thường và distilled/LoRA tăng tốc.

| Thiết lập | Bài thử đầu |
|---|---|
| Compute | Local |
| Model | Wan 2.2 TI2V 5B bản nén tương thích |
| Input | PNG một nhân vật trên canvas, được dùng làm ảnh đầu của video |
| Batch | 1 clip |
| Seed | Số cố định, ví dụ 12345; ghi lại cùng cấu hình |
| LoRA / upscaler | Tắt trong bài thử đầu |
| Sampler / guidance / shift / steps | Reset cấu hình khuyến nghị của model trước; không dùng preset SDXL |
| Độ phân giải | Thử 512×512 **nếu app/model chấp nhận**; đây là thử dưới mức 720p gốc, có thể giảm chất lượng |
| Frame video | Thử 33 frame nếu app chấp nhận; sau khi chạy được mới thử 65 |
| FPS export | Giữ theo model/export; Wan TI2V gốc dùng 24fps, kiểm tra file thật |

33 frame ở 24fps dài khoảng 1.38s: chỉ đủ kiểm tra model có giữ sprite và chuyển động. 65 frame khoảng 2.71s phù hợp thử idle đầy đủ hơn. Một số model yêu cầu số frame theo dạng `4n+1`; dùng giá trị app cho phép. **Số frame video không phải số frame game**. Không đặt video chỉ 8 frame rồi kỳ vọng một chu kỳ thở dài, mượt.

Nếu 512×512 bị từ chối, dùng kích thước/preset hợp lệ app cung cấp. Nếu preset tối thiểu quá nặng, bài thử local này có thể không phù hợp máy; không khẳng định hạ mọi thứ sẽ chạy được. Không đặt hẹn giờ “vài phút”: đo thời gian clip đầu trên máy thật.

### Đưa ảnh vào đúng vai trò

1. Tạo canvas/project riêng cho bài thử.
2. Import PNG và để ảnh hiện trên vùng tạo, đầy đủ nhân vật.
3. Chọn chức năng ảnh → video / initial image nếu phiên bản hiển thị lựa chọn. Với TI2V, phải xác nhận ảnh trên canvas đang được dùng làm input, không chỉ đặt ở moodboard.
4. Giữ nguyên ảnh và vùng tạo khi thay prompt. Nếu chuyển mode hoặc model làm mất ảnh, import lại.
5. Generate một clip ngắn. Xem frame đầu và vài frame tiếp: nếu tạo ra một người khác, kiểm tra input/mode trước khi tăng guidance hay viết prompt dài hơn.

## 5. Prompt idle cho video

Chỉ dán mô tả chuyển động này, **không dán toàn bộ prompt V2** yêu cầu tám PNG, ZIP, metadata hoặc chờ phê duyệt. Model video không phải trợ lý quản lý file.

```text
Fixed-camera side-view pixel-art game sprite animation. The single male character from the input image remains standing in exactly the same place, facing right. Preserve his face, long black hair, black robe, body proportions, colors and pixel-art appearance.

A quiet restrained idle: very gentle breathing slightly raises and lowers the chest and shoulders, while both feet stay planted. Only the ends of the long hair sway softly with a small delay. Hands keep the same relaxed pose. The head keeps the same angle and calm expression. The pelvis stays stable. Show one slow, subtle breathing cycle with continuous motion, suitable for selecting a seamless loop. Keep the solid background unchanged. Full body visible with clear margins, no camera movement.
```

Nếu model có ô negative prompt:

```text
camera movement, zoom, pan, walking, running, attack, changing hand pose, turning head, strong wind, large body bounce, expanding hair, flaring robe, changing face, changing costume, extra limbs, missing fingers, motion blur, ghost trails, background scenery, text, cropped feet
```

Prompt không áp được giới hạn chính xác 1–2 pixel như code. Nghiệm thu bằng ảnh thật ở kích thước battle. Nếu quá mạnh, rút prompt về “barely perceptible breathing, almost still hair”; nếu không chuyển động, tăng một yếu tố nhỏ, không thêm cử chỉ tay/chân.

## 6. Prompt run — làm sau khi idle đạt

Dùng pose M đang chạy làm input nếu có. Pose B có thể tạo đoạn bắt đầu chạy, nhưng không lấy cả đoạn đó làm loop.

```text
Fixed-camera side-view pixel-art game sprite animation of the same male character in the input image, facing right. Preserve his exact face, long black hair, black robe, palette and body proportions.

He runs continuously in place at a controlled moderate pace. Both legs alternate clearly: forward foot contact, support compression, bent-knee passing under the hips, then the next forward contact. Arms swing naturally opposite the legs with bending elbows. Keep anatomical limb lengths and near/far limb identity consistent. Use a modest stable forward lean and a small natural vertical gait motion. Hair tips and robe tails trail behind with restrained delayed movement; both legs remain readable.

Continue running throughout the clip, with no idle pose at the beginning or end. Fixed scale, fixed camera, unchanged plain background, full body always inside the canvas. The gait repeats smoothly without slowing down or stopping, suitable for selecting one complete repeating run cycle.
```

Negative nếu có:

```text
standing, starting to run, stopping, sideways sliding, teleporting limbs, stiff straight knees, duplicated legs, changing face, rotating body, camera movement, zoom, motion blur, ghost trails, flowing background, cropped hair, cropped feet
```

Không dùng prompt “frame 1 giống frame 8”. Cần pha cuối tiếp nối pha đầu; hai frame trùng nhau còn có thể tạo một nhịp khựng.

## 7. Duyệt video trước khi hậu kỳ

1. Xem tốc độ bình thường và chậm. Kiểm tra mặt, tỷ lệ, tay/chân, tóc và nền.
2. Idle: bàn chân cố định; thân thở nhẹ, không nhún toàn sprite; tóc không thay cả khối.
3. Run: phải thấy chân co gối đi qua hông, đổi chân đỡ, không nhảy thẳng từ trước ra sau.
4. Nếu face/limb geometry sai trên cả clip, bỏ clip hoặc tạo lại. Đổi ms và tăng FPS không sửa được hình vẽ sai.
5. Thử tối đa vài seed/biến thể có ghi chép. Nếu không ra chuỗi tốt, ghi nhận model không phù hợp, không tiếp tục batch roster.

Khi lỗi, chỉ đổi **một** yếu tố để biết nguyên nhân. Seed cố định giúp so sánh nhưng không bảo đảm cùng identity khi thay model/cấu hình.

## 8. Export video và lấy PNG

Ở lịch sử kết quả, chuột phải vào clip → tùy chọn export/save video. App hỗ trợ export video và chọn codec trong Machine Settings theo [release notes](https://drawthings.ai/downloads/). Chọn bản ít nén nếu có; ProRes nặng hơn nhưng tránh thêm tổn thất do nén mạnh. Codec có chữ 4444 không đồng nghĩa clip AI đã có alpha.

Lưu ví dụ `pn_idle_take01.mov` vào thư mục làm việc của bạn. Trong Terminal, `cd` tới thư mục chứa file đó. Đổi tên input trong lệnh nếu bạn export MP4.

```sh
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,avg_frame_rate,nb_frames -of default=noprint_wrappers=1 pn_idle_take01.mov
mkdir -p raw_frames
ffmpeg -i pn_idle_take01.mov -map 0:v:0 -fps_mode passthrough raw_frames/frame_%04d.png
```

Lệnh trên lấy tất cả frame thật, không nội suy, không ép FPS. `frame_0001.png` là frame video đầu tiên. Chưa dùng trực tiếp các PNG nền đặc trong game.

## 9. Chọn loop và xử lý nền

### Chọn đúng một chu kỳ

1. Xem dãy raw frames, tìm hai thời điểm cùng pha: ví dụ thân idle ở mức giữa và đang đi lên; run cùng chân tiếp đất với cùng chiều chuyển động.
2. Lấy khoảng **từ đầu chu kỳ đến trước đầu chu kỳ kế tiếp**. Không đưa hai endpoint trùng pha vào cùng vòng.
3. Xem seam cuối → đầu → frame tiếp. Cùng hình nhưng ngược chiều chuyển động cũng có thể gây khựng; so cả pha và hướng chuyển động.
4. Nếu không có một chu kỳ nối được, chưa có loop. Tạo lại/sửa các frame lỗi bằng workflow V2; không tự đảo ngược run để che seam.
5. Chọn tám mẫu thời gian tương đối đều trong khoảng này, không chỉ lấy tám frame liên tiếp của video 24fps. Nếu loop đầy đủ có 24 frame thì tám mẫu có thể ở các offset 0,3,6,…,21.
6. Xem lại bản tám frame. Nếu bỏ mất passing pose hoặc nhảy chi, giữ bản nhiều frame làm reference và đề xuất 12/16 frame; chưa tự đổi spec tám frame cho game.

Idle mục tiêu 2.4–2.8s, run mục tiêu 0.8–1.1s theo V2. Không kéo một đoạn chuyển động quá nhanh thành 2.6s rồi gọi đó là thở tự nhiên; kiểm tra nhịp và pha thật.

### Tách nền và chuẩn hóa

- Dùng trình sửa ảnh chọn **nền liên thông từ viền**, xóa thành alpha; bảo vệ mặt, tóc, chi tiết áo. Với nền đổi màu theo video, cần sửa mask từng frame và kiểm tra viền.
- Không xóa mọi pixel đen hoặc mọi pixel trùng một màu trên toàn ảnh. Không dùng ngưỡng quá rộng làm mất tay/áo.
- Giữ canvas và camera chung. Nếu cần crop, dùng **một crop rectangle chung cho cả chuỗi**, đủ chứa mọi pose, rồi áp cùng phép scale/offset cho tất cả frame.
- Nếu đổi sang 256×256, dùng nearest-neighbor và kiểm tra lại ở 1×. Pixel bị model video làm nhòe không tự trở lại nét pixel chỉ nhờ resize; có thể cần redraw/cleanup.
- Không tự center theo bounding box mỗi frame. Idle kiểm tra chân cùng tọa độ; run dùng floor/pelvis chung, chân được phép nhấc.
- Lưu tám PNG RGBA vào thư mục `accepted`, tên `pn_idle_01.png`…`pn_idle_08.png` (hoặc run). Chỉ ghi accepted sau khi thật sự duyệt.

## 10. Ghép sheet và tạo GIF preview

Dưới đây là script **đóng gói**, không tạo chuyển động hoặc sửa pose. Lưu thành `pack_frames.py` trong thư mục làm việc rồi chạy bằng Python đã có Pillow. Script yêu cầu tám source 256×256 RGBA có alpha; không lấy raw video nền đặc thay source.

```python
from pathlib import Path
import json
import sys
from PIL import Image

# python3 pack_frames.py pn_idle 325
# python3 pack_frames.py pn_run 120
prefix = sys.argv[1]
duration_ms = int(sys.argv[2])
if duration_ms <= 0:
    raise ValueError('duration_ms must be positive')
paths = [Path('accepted') / f'{prefix}_{i:02d}.png' for i in range(1, 9)]
frames = []
for path in paths:
    with Image.open(path) as src:
        if src.mode != 'RGBA' or src.size != (256, 256):
            raise ValueError(f'{path}: expected RGBA 256x256')
        frame = src.copy()
    if frame.getchannel('A').getextrema()[0] == 255:
        raise ValueError(f'{path}: no transparent background')
    if frame.getbbox() is None:
        raise ValueError(f'{path}: empty sprite')
    frames.append(frame)

sheet = Image.new('RGBA', (2048, 256))
contact = Image.new('RGB', (1024, 512), '#606878')
preview = []
for i, frame in enumerate(frames):
    sheet.paste(frame, (i * 256, 0))
    contact.paste(frame, ((i % 4) * 256, (i // 4) * 256), frame)
    bg = Image.new('RGBA', (256, 256), '#606878')
    preview.append(Image.alpha_composite(bg, frame).convert('RGB'))
sheet.save(f'{prefix}_sheet.png')
contact.save(f'{prefix}_contact.png')
# GIF stores time in 10ms units; make rounding explicit.
gif_ms = max(10, round(duration_ms / 10) * 10)
preview[0].save(f'{prefix}_preview.gif', save_all=True,
                append_images=preview[1:], duration=gif_ms,
                loop=0, disposal=2, optimize=False)
meta = {
    'status': 'packaged_pending_visual_approval',
    'sheet': f'{prefix}_sheet.png', 'frameSize': [256, 256],
    'loop': True, 'durationMs': [duration_ms] * 8,
    'gifDurationMsPerFrame': gif_ms,
    'frames': [{'x': i * 256, 'y': 0, 'w': 256, 'h': 256}
               for i in range(8)]
}
Path(f'{prefix}_metadata.json').write_text(
    json.dumps(meta, indent=2), encoding='utf-8')
print('Packed. Visual loop/identity approval still required.')
```

Ví dụ idle 325ms/frame là 2.6s trong metadata game; GIF làm tròn khác một chút. Preview dùng nền đặc để tránh ghost từ GIF transparency/disposal. PNG/sheet giữ alpha và là source thật. Metadata này là format bàn giao tham khảo, chưa khẳng định tương thích animator hiện tại.

## 11. Đưa vào game sau khi duyệt

1. Đặt source/metadata trong thư mục preview riêng. Không ghi đè animation campaign.
2. Sandbox phát sheet theo rect + duration; idle/run loop, pause được, mirror toàn actor khi đổi hướng.
3. Xem ở kích thước battle thật, trên nền sáng/tối và cạnh BNB để so tỷ lệ.
4. Kiểm tra chuyển B → idle, B → run entry, run → stop theo pha. Loop run tốt chưa đồng nghĩa vào/ra state đã tốt; cần clip hoặc chiến lược chuyển riêng.
5. Skill/hit/death có marker gameplay do engine quyết định; GIF không điều khiển damage/cooldown. Chưa tích hợp skill chỉ từ clip idle/run.
6. Chỉ làm BNB/roster khi PN qua cả hình vẽ, loop và sandbox.

## 12. Khi gặp lỗi

| Triệu chứng | Việc kiểm tra/sửa trước |
|---|---|
| Nhân vật khác ngay đầu clip | Model có nhận ảnh? Đang TI2V/I2V hay T2V? Input có ở đúng canvas/mode? |
| Memory Pressure đỏ, swap tăng mạnh | Giảm batch về 1, frame/resolution hợp lệ; kiểm tra bản nén. Nếu vẫn không chạy ổn, dừng model đó |
| App báo sampler incompatible | Reset cấu hình đúng model, không dùng preset model ảnh |
| Idle nhún/cử động quá mạnh | Giảm yêu cầu chuyển động, bỏ gesture, thử seed khác; kiểm tra trước hậu kỳ |
| Run chân tốc biến | Không sửa bằng ms; chọn lại cycle hoặc tạo/sửa pose có passing |
| Video mượt nhưng pixel nhòe | Kiểm tra source/export; cleanup pixel hoặc từ chối clip, không coi upscale là cách cứu chắc chắn |
| Cuối → đầu giật | Chọn pha/hướng tương ứng, bỏ endpoint lặp; nếu không có seam tốt thì sửa/tạo lại |
| PNG mất tay/áo sau tách nền | Mask quá rộng; quay lại raw frame, chọn nền từ viền và bảo vệ chi tiết |
| GIF chậm/nhanh hơn video | So FPS thực, số mẫu một cycle và duration; GIF có giới hạn đơn vị 10ms |

**Bài thử đầu cần bàn giao:** tên/phiên bản model, ảnh input, screenshot settings, video gốc và nhận xét visual. Không cần xuất cả batch ZIP khi video đầu đã sai hình. Hướng dẫn này là quy trình thử có điểm dừng, không phải cam kết Draw Things sẽ tạo sprite tốt hơn các bản AI trước.
