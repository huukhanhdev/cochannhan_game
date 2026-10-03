# Sửa danh tính base v03 — Blue tiếp nhận Orange và người dùng

03/10/2026. V02 đã tạo đủ ảnh nhưng **không đạt danh tính**, không đưa sang Muse làm animation. Giữ ảnh cũ để đối chiếu; không tự approve hay thay game.

## Lỗi và bằng chứng

Orange so 28 đầu người ở `previews/roster-base-v02/orange_faces.png`: lặp mắt hạnh hổ phách, mũi, miệng, tai và cằm. Trang phục khác không đủ để phân biệt nhân vật. PN/PC là ngoại lệ song sinh theo ch.2.

Input thực tế: PN dùng fanart và ảnh trong hội thoại; PC có ảnh web riêng; heo có ảnh giải phẫu thật. 37 ID còn lại đính kèm base PN, chưa đính kèm ảnh đúng nhân vật. URL truyện/Fandom trong catalog là nguồn đọc, **không chứng minh ảnh đã gửi vào imagegen**. Không dùng con số 38 như thể ảnh heo cũng là minh họa đúng danh tính nguyên tác.

## Quy tắc bắt buộc thay cách làm cũ

1. Mỗi nhân vật tìm và kiểm ảnh riêng từ Fandom, Pinterest, Bilibili hoặc kết quả tìm kiếm. Mở ảnh thật, kiểm đúng tên và thời kỳ; lưu trang nguồn, URL ảnh, file local và vai trò sử dụng. Fanart ghi đúng là fanart, không gọi ảnh chính thức.
2. **Không đính kèm PN làm reference cho nhân vật khác**, kể cả để khóa phong cách/tỷ lệ. Dùng thông số và mô tả pixel art bằng chữ. PN/PC chung cấu trúc mặt do song sinh, nhưng vẫn có ảnh tham chiếu riêng. BNB nam/nữ chung danh tính nhưng kiểm riêng thời kỳ.
3. Nếu chưa tìm được ảnh phù hợp: ghi `reference_pending`, không dùng ảnh sai nhân vật và không âm thầm chuyển sang tự thiết kế. Theo yêu cầu trước của người dùng, nhánh dựa mô tả truyện vẫn có thể dùng sau khi ghi rõ không có ảnh phù hợp; từng đặc điểm không được truyện tả phải ghi `art`.
4. Prompt có `Face:` riêng: dáng mắt, chân mày, mũi/miệng, hàm/má, tuổi/da/dấu vết. Dựa ảnh riêng và truyện trước; tối thiểu ba khác biệt nhìn thấy được giữa các nhân vật không cùng danh tính là tiêu chí art, không tự bịa sẹo hay màu mắt thành nguyên tác.
5. Thân và dáng đứng theo nhân vật: người già, nông phụ, lực sĩ, thiếu niên không dùng cùng thân chỉ đổi màu áo. Giữ phần trang phục đã được người dùng nhận xét ổn nếu phù hợp reference riêng.
6. Inpaint đầu chỉ dùng khi thân/trang phục đã đúng; input là base của chính nhân vật + ảnh riêng của chính người đó. Nếu thân hoặc danh tính sai, tạo lại toàn bộ. Trần Thúy Hoa phải tạo lại theo nữ nông phụ ch.222, không giữ thân kiếm khách trẻ.
7. Không tạo chung 6–8 danh tính trong một lượt rồi coi đó là reference thật. Bảng mặt là ảnh so sánh các kết quả đã tạo riêng, phục vụ kiểm lặp mặt; không thay thế nguồn riêng.

## Hồ sơ cần có trước mỗi lượt tạo

`id`, `era`, `source_page_url`, `source_image_url`, `local_reference_path`, `reference_role`, `identity_check`, `story_evidence`, `art_choices`, `face_spec`, `body_spec`, `generation_input_paths`.

Nhân vật không có ảnh phù hợp phải lưu kết quả tìm kiếm đã kiểm và đánh dấu nguồn chữ. Mỗi ảnh thực gửi vào tool ghi trong `generation_input_paths`; không chỉ ghi danh sách liên kết đã đọc.

## Thứ tự sửa

Tìm nguồn và hoàn thiện hồ sơ riêng → tạo base riêng → so mặt cạnh nhau ở cỡ dùng trong game → kiểm thân/giải phẫu → bàn giao đủ bộ cho Orange. Không áp dụng quota khác mặt cho PN/PC hay hai bản BNB. Không coi chỉ thêm dòng Face là đã khắc phục lỗi nguồn.

Catalog v02 và gallery đã đánh dấu `needs_identity_rework`, `animation_ready: false`. ZIP v02 là bản ảnh cũ để đối chiếu, không phải bộ đã sửa. Chưa tạo v03, chưa tìm đủ reference riêng cho 40 ID.
