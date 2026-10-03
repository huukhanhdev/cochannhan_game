# heo_rung: Lợn rừng thường

G1 — Blue, 03/10/2026. Chờ Orange validate; nguồn là cache JSON bản Việt đã đọc, hash trong `SOURCE_AUDIT.json`. Đây là **lợn thường**, không tự nâng thành thú vương có cổ ký sinh.

| Trường | Giá trị | Căn cứ |
|---|---|---|
| Tên Việt/Hán/Anh | lợn rừng / chưa kiểm / wild boar (nhãn mô tả) | VN ch.70 |
| Nhóm/thời kỳ | thú Q1, cảnh săn lợn ch.70–71 | [VN ch.70](https://cochannhann.pages.dev/api/chapters/70), [VN ch.71](https://cochannhann.pages.dev/api/chapters/71) |
| Giới tính/tuổi | không xác định; con trưởng thành cho pilot | art |
| Loài/hình thể | thân cường tráng, bốn chân ngắn to, lông xám đen; bờm lưng dài cứng, lông tai thưa; hai nanh trắng cong hướng trước | VN ch.70 |
| Tu vi/lưu phái | không gán chuyển số/lưu phái cho thú thường | không thấy cổ sở hữu trong cảnh đã đọc |
| Vũ khí | nanh là anatomy, vẽ liền sprite | VN ch.70–71 |
| Bay | không thêm khả năng bay; hất/húc có pose nâng người ngắn | game dựa hành động |
| SIZE | 1,25 so PN về bề dài; giữ chân ngắn, đầu vừa, không mascot | art |

## Ngoại hình theo truyện

Ch.70 có mô tả trực tiếp lông xám đen, bốn chân ngắn to, bờm dài cứng và hai nanh trắng. Không đổi thành lợn màu vàng hoặc đầu quá lớn/tay chân như người.

## Ảnh tham khảo trên mạng

Chưa chọn. Ảnh giải phẫu lợn rừng chỉ bổ trợ anatomy, không thay mô tả ch.70.

## Thiết kế tự do (`art`)

Palette đề xuất: thân #454448, bóng #29292E, bờm #1B1B20, nanh #ECE3D0, mõm #77645D, viền #15151A. Chờ duyệt base; lông xám đen/nanh trắng bám đoạn mô tả, mã hex là art.

## Cổ trùng / năng lực theo mốc

| Năng lực | Chuyển | Có/mất | Tác dụng | Căn cứ | Battle |
|---|---|---|---|---|---|
| Lao/húc nanh | không áp dụng | anatomy thường | lao mạnh, đổi hướng kém; PN né sang bên khiến nó đâm cây | VN ch.70 | charge chuyển thể, khóa hướng khi commit |
| Hất bằng nanh | không áp dụng | anatomy thường | cảnh ch.71 cảnh báo có thể hất/nguy hiểm bởi nanh | VN ch.71 | melee |
| Hung dữ khi trọng thương | không áp dụng | hành vi trong cảnh | gần chết vẫn lao dữ dội | VN ch.71 | AI profile; không tự thêm buff phép |
| Cổ ký sinh | chưa thấy | không xác minh sở hữu | không cấp skill vì cùng loài với thú vương | — | không cấp |

## Bộ animation

idle 2, move 2, hit 2, ko 2, win 1; atk 3 (hất nanh), sk_charge 3 (hạ đầu–lao–hạ tốc). Contact ở nanh/thân, mouth chỉ cho tiếng/FX thở nếu có. Không dùng anchor hand.

## Kit battle đề xuất

`boss_profile=heo_rung_q1_normal`, `visual_id=heo_rung`. Atk melee, charge cần sim hỗ trợ lao có contact/hit một lần theo hid; không tái dùng dash vô sát thương để tuyên bố đã có charge. AI nhịp chuẩn bị→commit hướng→thu dài, không homing sau commit. Số liệu chưa chốt; thú thường không dùng thanh chân nguyên cổ sư.

## Điểm mở

Chốt mức chi tiết lông/cỡ; pose ko nghỉ nghiêng không vẽ máu. G1 chưa đóng, chưa có base chuẩn thú.

## Validate (Orange, 03/10/2026) — G1 đạt, chờ người dùng chốt art

Đã mở VN ch.70, 71, 80.

**Đúng:** ch.70 lông xám đen, thân cường tráng, bốn chân to ngắn, bờm lưng dài cứng, lông tai thưa. Nanh: “lòi ra ngoài, cong ngược về phía trước, hai cái nanh trắng như tuyết”. Lao vào PN, PN né thì nó đâm gãy cây nhỏ phía sau. ch.71: trọng thương sắp chết thì điên cuồng hơn, có thể hất tung, nanh đâm. Không thấy cổ sở hữu. Bảng năng lực đúng: không cấp cổ.

**Bổ sung chi tiết hình cho prompt (canon ch.70):** mỗi chân bốn ngón, chỉ hai ngón giữa chạm đất; đuôi nhỏ ngắn hay vung; tai nhọn dựng. ch.80: nanh trắng như tuyết, lao thẳng; PN dùng Ngọc Bì đỡ bằng vai, PN lùi ba bước còn lợn lùi một bước. Chi tiết này hợp với `sk_charge` có lực đẩy lùi.

**Lỗi ngoài dossier:** `js/data.js` `EN.heorung.i` viết “heo rừng **nanh vàng**”, trái với ch.70 (nanh trắng như tuyết). Sửa câu mô tả khi đụng file đó.

Không còn lỗi canon trong dossier. Chờ người dùng chốt palette/cỡ.
