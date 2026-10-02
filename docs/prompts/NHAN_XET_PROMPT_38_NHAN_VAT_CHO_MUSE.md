# Nhận xét bộ prompt 38 nhân vật và đề xuất cho Muse AI

Ngày 02/10/2026.

Phạm vi đọc:

- [PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md](PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md): đọc mục 1–7, toàn bộ prompt Phương Nguyên, dòng nhận diện của cả 38 nhân vật và vài storyboard mẫu.
- [PROMPT_HANG_LOAT_CHIBI.md](PROMPT_HANG_LOAT_CHIBI.md): đọc phần cấu hình chung và danh sách nhân vật.

Tôi không đọc từng chữ cả 228 khối. Các khối được sinh theo cùng một khuôn, chỉ khác dòng nhận diện và storyboard.

## 1. Điểm tốt nên giữ

- **Dòng IDENTITY AND ERA của từng nhân vật rất có giá trị.** Mỗi dòng ghi rõ thời kỳ và những thứ *không được tự bịa*. Ví dụ:
  - Xích Thành dùng Thủy Khiếu để lừa tu vi, không phải phép nước.
  - Viêm Đột là lão gầy như ăn mày, không phải lực sĩ tóc đỏ.
  - Cá sấu phải đủ 6 chân.
  - Phi Tượng không tự mọc cánh.
  - Mộc Mị của Thanh Thư là biến thân chết người, không dùng trong clip thường.

  Đây là phần "khóa nguyên tác" đáng giữ nhất. Tôi sẽ chuyển sang bộ prompt Muse.
- Quy tắc kỹ thuật cho người tích hợp đều đúng: pivot cố định, không tự căn giữa từng frame, engine tính damage một lần, `impact_frame` chỉ là mốc trình bày.
- Mục 7 đã liệt kê sẵn các lỗi hay kéo từ prompt cũ sang. Danh sách này hữu ích khi duyệt ảnh.

## 2. Vì sao bộ này không chạy được trên Muse AI và cho ra kho clip "rung"

### 2.1. Prompt viết cho trợ lý AI có công cụ, không phải cho máy tạo ảnh

Mỗi khối dài khoảng **1.500 từ**. Phần lớn là lệnh dành cho một trợ lý biết dùng công cụ, kiểu ChatGPT có code: "deliver 8 PNG", "assemble with a deterministic compositor", "GIF disposal method 2", "decode/coalesce GIF", "report failures honestly", "search Google Images".

Máy tạo ảnh như Muse không làm được những việc đó. Nó chỉ đọc được vài chục đến vài trăm token đầu, phần còn lại bị cắt. Câu đầu mỗi khối lại là `PRODUCTION JOB: Build ONE IDLE battle animation…`, nên thứ model thực sự đọc được là chữ "animation" chứ không phải ngoại hình nhân vật. Dòng mô tả nhân vật nằm ở câu thứ 4–5, rất có thể không bao giờ tới được model.

### 2.2. Câu phủ định bị máy tạo ảnh hiểu thành khẳng định

Prompt nhắc đi nhắc lại các cụm như *"no sprite sheet, grid, contact sheet, multiple poses, onion skin, afterimage, ghost, duplicate head"*. Với máy tạo ảnh, xuất hiện những từ đó **làm tăng** khả năng ra đúng thứ bị cấm.

Lỗi "nhiều người chồng lên nhau" và "bóng mờ" ghi trong tài liệu rất có thể một phần do chính các câu cấm này. Thứ cần tránh phải đưa vào **negative prompt**, không viết trong prompt chính.

### 2.3. Biên đạo được yêu cầu quá nhỏ, nên clip trông như đứng yên

Storyboard của Phương Nguyên:

- Attack: *"draw the front wrist inward… shoulder barely rotating… short forearm extension… no triumphant flourish"*.
- Hit: *"without theatrical stumbling"*.
- Idle: *"open the lower ribs with almost motionless shoulders"*.

Ở sprite 256px, các chuyển động này chỉ lệch vài pixel. Máy tạo ảnh không vẽ chính xác được mức đó, nên mỗi lần vẽ lại chỉ sinh ra khác biệt ngẫu nhiên ở tóc và áo.

Điều này khớp với số đo kho hiện tại: run, attack, hit của Phương Nguyên trông gần như idle, còn viền thay đổi khoảng 40–60% vì rung. **Lỗi nằm ở thiết kế biên đạo, không chỉ do model kém.**

Tính cách lạnh lùng "không phô trương" đúng nguyên tác. Nhưng sprite cần tư thế rõ thì người chơi mới đọc được.

### 2.4. 8 frame, trong đó F01 và F08 bắt buộc copy y hệt B

Thực tế chỉ có 6 frame mới. Frame giữa phải vừa liền mạch với B, vừa do máy tạo ảnh vẽ riêng từng cái. Đây đúng là việc mà 5 lần thử trước đã chứng minh không làm được: frame cuối nối về B sẽ luôn bị giật.

### 2.5. Mâu thuẫn với các quyết định đã chốt

| Chỗ | Trong bộ prompt | Đã chốt |
|---|---|---|
| Bạch Ngưng Băng | *"Q2 female human variant"*, cấm đổi giới tính | Battle Q1 cần **BNB nam**. `assets/chibi_anim/bach_ngung_bang/base_side.png` hiện cũng là bản nữ. Bản nam đúng là `assets/chibi/bnb_nam_side_full.png` |
| Run | Có trong cả 38 nhân vật | Đã bỏ run, thay bằng lướt khinh công |
| KO / ngã | Không có | Cần cho battle |
| Kim Sinh | "Giả Kim Sinh / Jia Jin Sheng" | Game dùng **Cổ Kim Sinh**. Prompt tiếng Anh không ảnh hưởng, nhưng tên tiếng Việt nên thống nhất |
| Puppet | `FRAME PRODUCTION PROTOCOL` cho phép *"puppet/rig deformation"* | Puppet đã bị loại |
| Phương Nguyên | "black hair" chung chung | Ảnh gốc là **tóc đen thẳng dài tới eo**, áo đen. Nên ghi rõ, vì đây là đặc điểm nhận diện chính |

### 2.6. Không dùng được trong thực tế

File nặng 2,5MB, có 228 khối gần giống nhau. Mỗi lần muốn sửa luật chung (ví dụ bỏ run) là phải sửa 38 chỗ.

## 3. Đề xuất cải tiến cho Muse AI

### 3.1. Cấu trúc mới: 1 khối chung + 38 dòng nhân vật + 11 dòng động tác

Không viết sẵn 228 khối. Người dùng tự ghép 3 mảnh ngắn, mỗi prompt dưới khoảng 120 từ:

```
[Khối style chung, khoảng 50 từ] + [Dòng nhân vật, khoảng 40 từ] + [Dòng tư thế, khoảng 50 từ]
```

- Mô tả nhân vật đặt **ngay sau câu style đầu tiên**, để model đọc được.
- Cấm đoán chuyển sang **negative prompt**.
- Bỏ hết lệnh dành cho trợ lý (GIF, compositor, QA, báo cáo). Phần đó do script của tôi làm.

### 3.2. Mỗi ảnh là một dải 2–3 key-pose của một động tác

Đây là cách đã viết trong [PROMPT_MUSE_KEYPOSE_PN_BNB.md](PROMPT_MUSE_KEYPOSE_PN_BNB.md). Nó trái ngược với luật "một ảnh một pose" của bộ cũ, và đó là chủ ý:

- Vẽ chung trong một ảnh thì mặt, áo và tỷ lệ đồng nhất hơn hẳn so với vẽ riêng từng frame.
- Lỗi "tràn sang ô kế bên" mà bộ cũ lo ngại sẽ được xử lý bằng cách **yêu cầu khoảng trống rộng giữa các pose**. Script của tôi tách theo vùng nhân vật, không cắt theo lưới cố định.
- Lỗi "hai đầu chồng lên nhau" vẫn có thể xảy ra. Khi đó loại ảnh và gen lại. Mỗi lần gen chỉ tốn vài giây, không mất cả bộ.

### 3.3. Biên đạo phóng to, mỗi tư thế phải đọc được khi chỉ nhìn bóng đen

Quy tắc mới: tô đen toàn bộ nhân vật mà vẫn phân biệt được lấy đà, ra đòn và thu chiêu. Phương Nguyên vẫn mặt lạnh, nhưng tay chân phải duỗi hẳn. Ví dụ biên đạo cũ và mới:

| Động tác | Cũ | Mới |
|---|---|---|
| Attack | Cổ tay vào trong, vai gần như không xoay | Tay rút ra sau hông → **duỗi thẳng tay ngang vai**, người đổ tới |
| Hit | Không loạng choạng | Đầu ngửa ra sau, người gập, tay văng |
| Idle | Mở xương sườn dưới | 2 pose gần giống nhau. Nếu Muse vẽ khác quá thì dùng 1 pose + code nhấp nhô 1px |

### 3.4. Bộ động tác mới thống nhất cho cả 38 nhân vật

| Nhóm | Động tác |
|---|---|
| Người, vai chính (PN, BNB nam, boss) | idle 2 · cast 3 · attack 3 · heavy 3 · guard 2 · heal 2 · hit 2 · move 2 · dodge 2 · ko 3 · win 1 |
| Người, đối thủ thường | idle 2 · attack 3 · cast 3 (nếu dùng cổ) · guard 2 · hit 2 · ko 3 |
| Thú | idle 2 · attack 3 (vồ/cắn/húc) · hit 2 · ko 2 · cast 3 nếu có chiêu riêng (Điện Lang phóng sét: tư thế ngửa cổ gầm) |
| Địa Linh, Thần Kê (không phải boss đánh thường) | idle 2 · cảnh báo 2 |

Không có run, không bắt buộc F01/F08 trùng B. Game tự chuyển từ pose cuối về idle bằng một khoảnh khắc nhỏ hoặc hiệu ứng che.

### 3.5. Ảnh tham chiếu đúng cho Muse

Dùng bản master độ phân giải cao (1376×1824), không dùng sprite 256px đã thu nhỏ:

- Phương Nguyên: `assets/chibi_side/phuong_nguyen_side_full.png`
- **BNB nam:** `assets/chibi/bnb_nam_side_full.png`. Không dùng `chibi_anim/bach_ngung_bang/base_side.png`, vì đó là bản nữ Q2.
- Nhân vật khác: dùng master trong `assets/chibi_pack/` nếu có. Nếu không có thì dùng `chibi_anim/<id>/base_side.png`.

### 3.6. Mẫu dòng nhân vật mới, chuyển từ IDENTITY cũ

Rút gọn thành mô tả **nhìn thấy được**. Phần cấm đoán chuyển sang negative.

| ID | Dòng nhân vật (prompt) | Thêm vào negative |
|---|---|---|
| phuong_nguyen | 15-year-old boy, long straight black hair to the waist, pale skin, narrow cold eyes, plain black robe, black boots, bare hands | sword, weapon, smile |
| bach_ngung_bang (Q1) | 15-year-old **boy**, very long silver-white hair with a silver hair ornament, ice-blue eyes, arrogant grin, white robe with blue snowflake patterns, bare hands | female, girl, breasts, sword |
| thanh_thu | young man, tied black hair, gentle calm face, dark green robe | vines, wood armor, tree body |
| xich_thanh | small wary teenage boy, neat dark hair, ochre robe | water, water shield |
| viem_dot | thin old beggar-like man, sparse hair, long nails, ragged clothes | muscular, red hair, tattoos |
| dian_lang_boss | huge four-legged wolf, blue-grey fur, jagged spiky mane, long muzzle, side view | human hands, standing on two legs, lightning |
| ca_sau_sau_chan | long armored crocodile with exactly six legs, long toothy muzzle, heavy tail | four legs, wings |

Các nhân vật còn lại tôi chuyển tương tự từ mục 8 của file cũ khi tới lượt làm. Không cần làm trước cả 38.

## 4. Đề xuất xử lý file cũ

1. **Không xóa.** Đưa `PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md` vào `docs/archive/`, giữ làm nguồn tra cứu dòng IDENTITY.
2. Sửa ngay dòng BNB trong file cũ hoặc ghi chú đầu file: *battle Q1 dùng BNB nam, bản nữ chỉ cho Q2*. Như vậy AI khác đọc sau sẽ không làm sai.
3. Gộp về **một file duy nhất cho Muse**: mở rộng [PROMPT_MUSE_KEYPOSE_PN_BNB.md](PROMPT_MUSE_KEYPOSE_PN_BNB.md) thành `PROMPT_MUSE_KEYPOSE.md`. File mới gồm khối chung, bảng 38 dòng nhân vật kèm negative, và bảng động tác theo nhóm. Ước tính khoảng 300 dòng thay vì 6.620.
4. Thứ tự làm:
   1. Phương Nguyên: idle, cast, hit, move.
   2. Tôi test script tách ảnh và chạy thử trong sandbox.
   3. Đạt thì làm tiếp BNB nam và Điện Lang.
   4. Sau đó mới làm 35 nhân vật còn lại.

## 5. Cần bạn quyết định

- Đồng ý bỏ luật "F01/F08 copy B" và "một ảnh một pose" để chuyển sang dải key-pose không?
- Đồng ý phóng to biên đạo (mục 3.3) không? Phương Nguyên vẫn giữ mặt lạnh.
- Có cho tôi chuyển file cũ vào `archive/` và gộp thành một file Muse không?
