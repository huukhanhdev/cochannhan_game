# Kế hoạch rà soát và làm giàu các nhánh truyện Quyển 1

**Lý do:** anh không giết Cổ Kim Sinh mà Thiết Nhược Nam vẫn hỏi "Ngươi có giết Cổ Kim Sinh không?". Nghĩa là lời thoại sau này chưa đi theo lựa chọn trước đó. Bản này rà hết các tuyến, liệt kê lỗi, đề xuất cách sửa, và thêm một công cụ tự bắt loại lỗi này.

**Nguyên tắc (anh đã chốt):**
- Bám địa điểm, thời gian, NPC và cơ chế của truyện; cốt truyện viết tự do.
- **Đại sự bắt buộc** luôn xảy ra. **Nhân quả**: có nhân mới có quả.
- Mọi câu thoại nhắc tới một việc đã xảy ra (ai chết, ai sống, ai đang giữ gì) phải được **kiểm tra bằng cờ**. Không cờ thì không được nói.

---

## 1. Kết quả rà soát (30/09/2026, 156 sự kiện)

### 1.1. Lỗi phá luồng (làm mất nhánh hoặc kết cục)

| # | Chỗ | Lỗi | Hậu quả |
|---|---|---|---|
| A1 | `npc_pc_3` (Phương Chính gặp nạn trong lang triều) | Chỉ chạy tuần 20–22 khi `!tideDone`. Sau khi gộp lang triều ở PR-5, lang triều xong ngay tuần 20, mà tuần 20 lại bận mốc Thanh Thư, và sự kiện NPC chỉ chạy khi tuần trống | **Không bao giờ xảy ra.** Không bật được `pcAlly`/`pcHate`, nên mất kết cục Song Hùng, mất Phương Chính ở trận Huyết Cương, mất `npc_pc_4` |
| A2 | `c_kimsinh` | Đang gắn điều kiện "có Tửu Trùng". Theo nguyên tác, Kim Sinh chặn đường vì **mổ thạch ra cổ quý**; không có thì vẫn chặn vì lý do khác | Không có Tửu Trùng thì cả chuỗi Kim Sinh, Cổ Phú, thần bổ truy án biến mất |

### 1.2. Lời thoại sai với lựa chọn trước

| # | Chỗ | Câu sai | Đúng ra phải xét |
|---|---|---|---|
| B1 | `npc_nn_1` (Nhược Nam ở học đường) | Luôn hỏi "Ngươi có giết Cổ Kim Sinh không?" | Kim Sinh chết, hay chạy thoát và tố cáo, hay còn sống bình thường |
| B2 | `npc_xm_4` (phe cánh ở từ đường) | "Trước cuộc thẩm vấn vụ án Cổ Kim Sinh…" | Chỉ nói vậy khi Kim Sinh đã chết |
| B3 | `npc_pc_4` (Phương Chính thân) | "Gia lão đang gom chứng cứ về vụ Cổ Kim Sinh" | Như B2 |
| B4 | `npc_pc_2` | "mang bình thảo dược **tới tửu lâu** tìm ngươi" | Có tửu lâu (`S.f.tuulau`) hay không |
| B5 | `x_tramthuy` | "vừa khóa cửa **tửu lâu**" | Như B4 |
| B6 | `c_tramthuy` (tuần 8) | Trầm Thúy "đổi khác, sang phòng nhị thiếu gia", dù đã bị mua chuộc ở vụ gia sản | Đã là tai mắt (`tramthuySpy`) thì cảnh phải khác: nàng báo tin, hoặc bắt đầu chơi hai mang |
| B7 | `npc_cm_4` | Trầm Thúy quỳ xin ngươi mua nàng, hoặc thuê sát thủ, dù đã là tai mắt trung thành | Có `tramthuySpy` thì bỏ hai nhánh này; thay bằng "nàng bị cậu mợ phát hiện làm gián điệp" |
| B8 | `r_tramthuytin` | Vẫn "ghé tai kể chuyện" sau khi Trầm Thúy chết hoặc rời trại | Thêm `!tramthuyGone` |
| B9 | `c_thietvay` | "lần tới đúng khe đá nơi Cổ Kim Sinh bỏ mạng" | Đúng khi có `tieHunt` (chỉ bật khi đã giết). Giữ, nhưng phải nhất quán với A2 |
| B10 | `c_thiet` | Nhánh "Kim Sinh chạy thoát và tố cáo" (`jksEscaped`) bị coi như "không liên quan" | Kim Sinh còn sống và tố ngươi phục kích: thần bổ tra hỏi theo kiểu khác (xem 2.3) |

### 1.3. Nhánh cụt (chọn xong thì không có gì theo sau)

| Lựa chọn | Hiện tại | Nên có |
|---|---|---|
| Nộp tiền hoặc bán cổ cho Kim Sinh (`nhuong_bo`) | Hết chuyện | Kim Sinh được nước làm tới: vài tuần sau quay lại đòi thêm. Hoặc khoe khắp chợ, và thần bổ nghe được |
| Dọa Kim Sinh bằng đám học trò bảo kê | Chỉ bật `jksHate` | Cổ Phú sai hộ vệ tới dằn mặt (dùng lại `giave`) |
| Báo tộc trưởng vụ Kim Sinh | Có `q_jksthu` | Được, giữ |
| Để Trầm Thúy làm tai mắt | Chỉ có `r_tramthuytin` (lặp lại) | Một cảnh ở tuần 20–24: nàng mang tin về vụ phản bội hoặc Bạch gia |
| Thanh Thư sống (`qingshuAlive`) | `npc_tt_4`, kết cục riêng | Thêm cảnh sau lang triều: Thanh Thư nghi ngờ vì sao ngươi biết trước Mộc Mị Cổ |

---

## 2. Làm lại chuỗi Cổ Kim Sinh (theo nguyên tác)

### 2.1. Nhân: vì sao hắn chặn ngươi
Kim Sinh là **đại sự bắt buộc**: luôn xảy ra khi thương đội còn trên núi. Lời mở và thứ hắn đòi thay đổi theo nhân:

| Ưu tiên | Nhân | Hắn đòi | Cờ mới |
|---|---|---|---|
| 1 | **Mổ thạch ra cổ quý** ở quầy Cổ gia (cổ Nhị chuyển trở lên, hoặc giá ≥ 100). Đúng nguyên tác | Con cổ đó ("đá của Cổ gia thì cổ cũng là của Cổ gia") | `S.f.stoneGu = mã cổ`, bật trong `stoneOpen()` |
| 2 | Mổ thạch ra tinh thạch lớn | Nửa số nguyên thạch | `S.f.stoneWin` |
| 3 | Có Tửu Trùng | Tửu Trùng (ngửi mùi hầu nhi tửu) | – |
| 4 | Không có gì | Tiền mãi lộ: ngươi va vào hắn ở chợ, hắn muốn làm nhục một học trò Bính đẳng | – |

Cảnh (`c_kimsinh`) giữ các nhánh đang có: hẹn ra khe đá, phục kích theo ký ức, nhượng bộ, báo tộc trưởng, gọi đám học trò bảo kê. Nhánh nhượng bộ đưa đúng thứ hắn đòi.

### 2.2. Quả: một cờ kết cục cho cả chuỗi
Thay cho nhiều cờ rời (`killedJKS`, `jksEscaped`, `jksHate`), mọi cảnh sau đọc chung **`S.f.jks`**:

| Giá trị | Nghĩa |
|---|---|
| `dead` | Đã giết, xác ở khe đá |
| `escaped` | Phục kích hỏng, hắn chạy về kể với Cổ Phú |
| `paid` | Ngươi nộp của, hắn đắc ý |
| `reported` | Tộc trưởng can thiệp, hắn bị mắng, thù ngươi |
| `scared` | Bị đám học trò dọa, bỏ đi, thù ngươi |

`killedJKS` giữ làm cờ phụ để không phá code cũ.

### 2.3. Thoại về sau theo từng quả

| Cảnh | `dead` | `escaped` | `paid` | `reported` / `scared` |
|---|---|---|---|---|
| Cổ Phú điều tra (tuần 13) | Như hiện tại | Cổ Phú **tố ngươi phục kích em hắn** trước tộc trưởng. Chối, đền tiền, hoặc đánh hộ vệ | Không có | Không có. Thay bằng `q_jksthu`: Kim Sinh thuê sơn tặc |
| Thương đội rời đi (tuần 15) | "Hắn sẽ quay lại, không đi một mình" | Kim Sinh ngoái lại, cười nham hiểm | Kim Sinh khoe món đồ ép được của ngươi | Kim Sinh nhổ nước bọt về phía trại |
| Thần bổ lên núi (tuần 23) | Truy án: `tieHunt` | Kim Sinh đi cùng thương đội, chỉ mặt ngươi. Thần bổ tra hỏi nhưng không có án mạng: hiềm nghi tăng vừa, không có vòng vây | Thần bổ không để ý ngươi | Như `paid` |
| Nhược Nam ở học đường | "Ngươi có giết Cổ Kim Sinh không?" | "Cổ Kim Sinh nói ngươi phục kích hắn. Ta muốn nghe ngươi nói" | **Hỏi về dấu vết huyết đạo** trên núi (việc thật của cha nàng); nhờ ngươi dẫn đường hậu sơn | Như `paid` |
| Phe cánh ở từ đường, Phương Chính (B2, B3) | Nhắc vụ án | Nhắc "lời tố của Cổ gia" | Nhắc "phân chia công trạng lang triều" | Như `paid` |

---

## 3. Sửa các tuyến NPC

### 3.1. Phương Chính (sửa A1)
- `npc_pc_3` thành **sự kiện đi kèm lang triều**: đẩy vào ngay sau `c_lang1` (tuần 19, bằng `post`), không chờ tuần trống.
- Thời gian 19–20, điều kiện `npc_pc_2` như cũ.
- `npc_pc_4` (tuần 24–26): lời thoại theo `S.f.jks` (xem 2.3).

### 3.2. Trầm Thúy và cậu mợ (sửa B6, B7, B8)
Mọi cảnh về Trầm Thúy đọc một cờ **`S.f.tt`**:

| Giá trị | Nghĩa |
|---|---|
| (chưa có) | Tỳ nữ nhà cậu |
| `spy` | Tai mắt của ngươi |
| `hate` | Bị ngươi làm nhục, thù ngươi |
| `pc` | Ngả sang Phương Chính (nguyên tác) |
| `gone` | Bị bán, chết, hoặc rời trại |

- `c_tramthuy` (tuần 8): có `spy` thì thành cảnh "nàng báo tin nhà cậu định kiện ngươi". Mở trước cho `npc_cm_2`: có chứng cứ sẵn, thắng kiện dễ.
- `npc_cm_4`: có `spy` thì "cậu mợ phát hiện nàng làm gián điệp, định bán nàng". Cứu nàng thì nàng trung thành tuyệt đối; bỏ mặc thì `gone`.
- `r_tramthuytin`, `x_tramthuy`: chặn khi `gone`. `x_tramthuy` đổi "tửu lâu" theo `tuulau`.

### 3.3. Thiết Nhược Nam (sửa B1)
Tách `npc_nn_1` làm hai theo `S.f.jks` (xem 2.3). Thêm `npc_nn_2` (tuần 24–25) khi `rel.nhuocnam ≥ 15`: nàng nhờ dẫn đường hậu sơn, dẫn tới lối vào lăng mộ. Đây là đường vào nhánh "thần bổ thành đồng minh" mà không cần tội danh nào.

### 3.4. Thanh Thư, Bạch Ngưng Băng, Xích–Mạc, Hùng Lâm
- **Thanh Thư:** thêm cảnh nghi ngờ khi còn sống (1.3). `npc_tt_5` (tuần 18–19) giữ nguyên.
- **Bạch Ngưng Băng:** `npc_bai_2` (tuần 22–23) nói "sau lang triều". Đúng lịch mới. Nếu ngươi đã kết giao ở tuần 17 (`baiAlly` sớm) thì đổi lời: "Ngươi còn giữ lời hứa chứ?"
- **Xích–Mạc:** `npc_xm_4` sửa như B2.
- **Hùng Lâm:** chưa thấy lỗi.

---

## 4. Làm giàu: thế giới nhớ việc ngươi làm

Rẻ mà hiệu quả nhất: **câu thoại phản ứng** ở các chuyện phụ thường gặp. Không thêm sự kiện mới.
- Hàm `remark()` trả một câu theo trạng thái. Chèn vào `text` của các kỳ ngộ ở sơn trại, tửu quán, học đường.
- Ví dụ: `jks:'dead'` thì "Người ta vẫn bàn về thiếu gia Cổ gia mất tích"; `qingshuDead` thì "Tộc trưởng già đi trông thấy"; `tt:'spy'` thì Trầm Thúy liếc ngươi, khẽ gật đầu; `pcHate` thì Phương Chính quay mặt đi khi gặp ngươi.
- Mỗi trạng thái lớn 2–3 câu, rút ngẫu nhiên. Khoảng 30 câu cho cả Quyển 1.

---

## 5. Công cụ tự bắt lỗi nhất quán

1. **Luật truyện trong `tools/check.cjs`:** một bảng luật "nhắc X thì phải kiểm tra cờ Y".
   - Ví dụ: nhắc "giết Cổ Kim Sinh", "vụ án Cổ Kim Sinh" thì phải có `jks` hoặc `killedJKS` trong cùng sự kiện; nhắc "tửu lâu" thì phải có `tuulau`.
   - Máy quét thử trong lần rà này đã bắt được B1, B2, B4.
2. **Kiểm tra lúc chạy trong `tools/sim.cjs`:** mỗi lần hiện một sự kiện, lấy chữ thật đã hiện rồi so với trạng thái. Ví dụ hiện "giết Cổ Kim Sinh" mà `jks` khác `dead` thì báo lỗi kèm mã sự kiện.
   - Cách này bắt được cả lỗi nằm trong nhánh `? :` mà quét chữ tĩnh không thấy.
3. **Báo cáo độ phủ nhánh:** sim đếm mỗi sự kiện và mỗi nút cảnh đã chạy bao nhiêu lần. Nhánh 0 lần trong 300 chiến dịch là **nhánh chết**, như A1. Có cái này thì đã bắt được A1 ngay khi gộp lang triều.

---

## 6. Các PR

| PR | Nội dung | Nghiệm thu |
|---|---|---|
| **T1: Công cụ** | Luật truyện trong `check.cjs`; kiểm tra lúc chạy và độ phủ nhánh trong `sim.cjs` | Công cụ tìm lại được A1, B1–B8 trên code hiện tại |
| **T2: Lỗi phá luồng** | Sửa A1 (Phương Chính theo lang triều) và A2 (Kim Sinh bắt buộc, nhân theo mục 2.1, `stoneGu`) | `song_hung` xuất hiện trong sim; chuỗi Kim Sinh chạy ở 100% số đời |
| **T3: Chuỗi Kim Sinh** | Cờ `S.f.jks`, thoại theo quả (mục 2.3) ở 6 cảnh | Không còn lỗi thoại loại B trong sim |
| **T4: Trầm Thúy và cậu mợ** | Cờ `S.f.tt`, sửa B6–B8 | Như trên |
| **T5: Nhánh cụt và làm giàu** | Mục 1.3; `npc_nn_2`; câu phản ứng `remark()` | Mỗi nhánh cụt có ít nhất một hệ quả; độ phủ nhánh không còn 0 |

T1 làm trước, vì các PR sau dùng nó để chứng minh đã sửa hết.

---

## 7. Cần anh chốt

1. **Nhân của Kim Sinh ở mục 2.1**: đồng ý thứ tự ưu tiên (cổ quý từ đá, rồi tinh thạch, rồi Tửu Trùng, rồi tiền mãi lộ) chứ?
2. **Kim Sinh chạy thoát và tố cáo** (`escaped`): thần bổ tra hỏi nhưng không có vòng vây. Được không, hay anh muốn vẫn bị vây?
3. **Trầm Thúy làm tai mắt**: khi cậu mợ phát hiện, cho ngươi cứu nàng như mục 3.2 được không?
4. Làm theo thứ tự T1 → T5?
