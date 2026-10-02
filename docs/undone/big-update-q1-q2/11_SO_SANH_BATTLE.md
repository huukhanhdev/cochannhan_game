# So sánh năm phương án battle và lộ trình cũ

Ngày gom tài liệu: 02/10/2026.

Gộp các phương án ngắn để so sánh tại một chỗ; không phải năm mode đã triển khai.

## Mục lục
- [11_5_PHUONG_AN_BATTLE_MOI.md](#source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md)
- [01_DAU_TRI_CHAN_NGUYEN.md](#source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md)
- [02_SONG_DAU_DONG_THOI.md](#source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md)
- [03_REALTIME_TAM_DUNG.md](#source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md)
- [04_SONG_DAU_HANH_DONG_NGANG.md](#source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md)
- [05_DAU_TRUONG_25D_WASD.md](#source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md)
- [07_LO_TRINH_PR_VA_PLAYTEST.md](#source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md)

---

<a id="source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md"></a>

## 11_5_PHUONG_AN_BATTLE_MOI.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md-năm-phương-án-battle-mới-dựa-trên-asset-chibi-q1q2"></a>
## Năm phương án battle mới dựa trên asset chibi Q1–Q2

Ngày: 02/10/2026. Trạng thái: thiết kế để lựa chọn, chưa triển khai. Giữ khung giao diện ngoài battle hiện tại; thay trải nghiệm bên trong đấu trường. Đây là năm hướng thay thế, không phải kế hoạch nhồi thêm năm mode vào game chính thức.

**Cập nhật:** người dùng yêu cầu cụ thể hóa **E**. Hướng hiện tại là [implement đấu trường 2.5D WASD](battle-options/08_E_KE_HOACH_IMPLEMENT_CU_THE.md), kèm [clip nhân vật cần bổ sung](battle-options/06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md). Kiểm kê mới xác nhận archive đã tải đủ 38 nhân vật × sáu action; nhận định thiếu bộ đầy đủ bên dưới là tình trạng thư mục repo ở lần khảo sát trước.

Người chơi từng phản hồi realtime quá nhanh, khó làm quen. Vì vậy mọi hướng có hướng dẫn từng bước, tín hiệu địch dễ đọc, tốc độ có thể thử nghiệm và điều khiển mobile tương ứng. WASD là một lựa chọn thiết kế mới, không mặc định rằng phản xạ nhanh sẽ làm game hay hơn.

Nguồn công dụng cổ và sự kiện: [nguyên tác Q1](../../reference/CHI_TIET_NGUYEN_TAC_Q1.md), [nguyên tác Q2](../../reference/CHI_TIET_NGUYEN_TAC_Q2.md). Luật vị trí, lượt, năng lượng, né và phá thế dưới đây là chuyển thể gameplay. Không tự gán phép chữa thương, lướt vô địch, biến thân hoặc triệu hồi cho nhân vật chưa có cổ tương ứng.

<a id="source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md-1-chọn-theo-cảm-giác-chơi"></a>
### 1. Chọn theo cảm giác chơi

| Phương án | Người chơi điều khiển gì? | Cảm giác chính | Dùng asset hiện có | Công việc mới | Nhịp cho người mới |
|---|---|---|---|---|---|
| [A — Đấu trí chân nguyên và vị thế](11_SO_SANH_BATTLE.md#source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md) | Chọn vị trí, xếp chuỗi 1–3 hành động rồi kết lượt | Tính toán, tích lực, bùng nổ | Cao: sideview và sáu clip | Vừa | Dễ, không giới hạn thời gian chọn |
| [B — Song đấu ra lệnh đồng thời](11_SO_SANH_BATTLE.md#source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md) | Dự đoán đối thủ, xếp kế hoạch công/thủ/di chuyển | Đấu tâm lý, phản chế | Cao | Cao: resolver đồng thời và preview | Dễ về phản xạ; khó hơn về luật |
| [C — Điều khiển có tạm dừng chiến thuật](11_SO_SANH_BATTLE.md#source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md) | WASD khi chạy, Space dừng để chọn cổ/mục tiêu | Chủ động di chuyển và đọc trận | Vừa | Cao: vị trí, va chạm, hàng lệnh | Tốt nếu auto-pause bật mặc định |
| [D — Song đấu hành động ngang](11_SO_SANH_BATTLE.md#source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md) | A/D di chuyển, W nhảy, S thủ, cổ theo phím | Né thật, parry, quyền có lực | Vừa: đúng góc sideview | Rất cao: nhảy, hitbox, cancel, AI | Khó hơn; cần tutorial và trợ giúp |
| [E — Đấu trường 2.5D WASD](11_SO_SANH_BATTLE.md#source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md) | WASD chạy trên mặt đất, chuột chọn hướng/mục tiêu | Sinh tồn, dụ bầy, kiểm soát địa hình | Vừa/thấp: cần locomotion theo chiều sâu | Rất cao: nhiều unit và AI không gian | Vừa/khó; không mở bằng trận đông |

**Đề xuất ưu tiên:** làm A thành trải nghiệm chiến dịch nếu ưu tiên đấu trí và dễ tiếp cận. Làm C thành ứng viên thứ hai nếu muốn di chuyển bằng WASD mà vẫn có thời gian đọc cổ. D phù hợp một game song đấu thiên phản xạ; E phù hợp lang triều và nhiều địch. B là lựa chọn khác biệt nhất về đấu tâm lý nhưng phải làm luật ra lệnh thật rõ.

Không nên chọn chỉ qua video effect: cùng một encounter, bộ cổ, chỉ số và mục tiêu phải được chơi thử ở từng phương án. Mọi hướng trước hết chứng minh một trận Q1 ngắn và một tình huống Q2 có mục tiêu riêng.

<a id="source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md-2-asset-thực-sự-có-và-giới-hạn"></a>
### 2. Asset thực sự có và giới hạn

Khảo sát repo ngày lập:

- Có 18 `side/preview.png` trong `assets/chibi_pack/`, kèm các bộ phận rời của nhiều nhân vật: Phương Nguyên, Phương Chính, Thanh Thư, Mạc Bắc, Xích Thành, Thiết gia, Bạch Ngưng Băng, Nhất Đại, Điện Lang, v.v. Có cả Thương Tâm Từ ngoài roster combat; có hình không có nghĩa là cần cho vào trận đánh.
- `assets/chibi_side/` có Phương Nguyên sideview và layer rời. `assets/chibi/` có biến thể Bạch Ngưng Băng nam/nữ và một số ảnh Phương Chính.
- `assets/chibi/spritesheets/` hiện có các bộ run/slash/sprint của Phương Nguyên; tên file chưa chứng minh chất lượng, số frame hay đúng pivot. Chưa thấy bộ sáu action hoàn chỉnh cho cả 38 hồ sơ trong repo.
- `assets/gu/` là hình cổ dùng làm icon/card, không tự trở thành projectile, hộ thể hoặc impact animation.
- Ba GIF người dùng gửi trước đây là bản thử có lỗi đổi nhận diện, bóng frame cũ và projectile sai hướng. Không tính các bản này là asset sản xuất đã đạt chuẩn.
- [Bộ prompt hiện hành](../../prompts/PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md) mô tả sáu action × tám frame cho 38 hồ sơ; đó là chỉ dẫn sản xuất, không phải chứng cứ đã tạo đủ animation.

Chưa thực hiện QA thị giác toàn bộ kho ảnh trong lần lập plan. Trước PR renderer phải tạo asset manifest và duyệt từng bộ được dùng trong prototype.

<a id="source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md-3-nền-code-kế-thừa"></a>
### 3. Nền code kế thừa

`js/battle.js` đã có đấu trường PixiJS, phân nhóm effect cổ, projectile, hộ thể và hàng sự kiện `FX`. Có thể giữ renderer nền/particle và bổ sung actor bằng sheet; chưa thấy runtime actor animation hoàn chỉnh nạp bộ chibi trên vào chiến dịch.

`js/engine.js` đang giải quyết hành động, scene và kết quả; `js/tactical_battle.js` bọc resolver hiện tại cho lượt, ý đồ, thủ thế, hồi chân nguyên +1 và sơ hở. `js/rt.js` đang đổi ba mức tầm và tick realtime, không phải hệ WASD có tọa độ và collision thật. Dùng nó làm tham khảo AI/mục tiêu, không coi đổi nút là đã có cơ chế C–E.

`js/data.js`, `js/q2/data2.js`, `js/q2/luc.js` có cost, cooldown, attack/guard/heal và thú lực. Giữ danh tính cổ, điều kiện sở hữu và công dụng; cost/timing cần cân riêng theo phương án. Không giữ hệ số HP ×2,2/ATK ×1,8 của realtime cũ như mặc định cho cơ chế mới.

<a id="source-docs-big-update-q1-q2-11-5-phuong-an-battle-moi-md-4-tài-liệu-sản-xuất-đi-kèm"></a>
### 4. Tài liệu sản xuất đi kèm

| Tài liệu | Dùng để quyết định |
|---|---|
| [Danh mục animation, cổ, damage và âm](battle-options/06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-06-animation-skill-vfx-backlog-md) | Cần tạo thêm gì, ưu tiên nào, dùng chung được ở đâu |
| [Lộ trình PR và so sánh prototype](11_SO_SANH_BATTLE.md#source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md) | Làm mẫu trước, chọn cơ chế, rồi thay hệ hiện tại an toàn |

Giữ asset body, skill FX, damage text và logic hit độc lập. Một đòn có thể đẹp hơn bằng cách bổ sung projectile/impact và nhịp phản ứng, không nhất thiết sinh lại toàn bộ nhân vật cho từng cổ.

---

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md"></a>

## 01_DAU_TRI_CHAN_NGUYEN.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md-a--đấu-trí-chân-nguyên-và-vị-thế"></a>
## A — Đấu trí chân nguyên và vị thế

Mục tiêu: thay nhịp một click → địch đáp trả bằng một lượt có thể sắp chuỗi nhỏ, chọn khoảng cách và chủ động giữ chân nguyên. Sideview trở thành một sân khấu có vị trí thật, mỗi lượt diễn ra như một đoạn giao đấu ngắn. Không có deadline khi chọn lệnh.

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md-1-vòng-chơi"></a>
### 1. Vòng chơi

1. Đọc ý đồ địch và vùng đòn sắp đánh.
2. Chọn vị trí trong ba điểm đứng **gần / trung / xa**, xem đường đòn và vùng nguy hiểm.
3. Xếp tối đa ba hành động, được sửa/xóa trước khi xác nhận.
4. Bấm Kết lượt; lần lượt thấy tiếp cận → thi triển → trúng/đỡ → phản ứng → địch hành động.
5. Sang lượt mới, hồi lượng chân nguyên nhỏ cố định theo luật đã chọn; xem hậu quả và kế hoạch tiếp theo.

Ví dụ chuyển thể: thấy Điện Lang chuẩn bị lao vào vị trí trung, người chơi lùi xa rồi phóng nguyệt nhận; hoặc giữ vị trí, dùng Ngọc Bì và tiết kiệm để đòn mạnh lượt sau. Không mặc định mọi đòn cũ chuyển thành skillshot có thể né bằng lùi xa.

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md-2-luật-prototype"></a>
### 2. Luật prototype

**Chân nguyên dùng làm energy duy nhất cho kỹ năng.** Điểm đứng và giới hạn hành động là luật lượt, không hiện thêm thanh stamina.

- Mỗi lượt có hai nhịp cơ bản; prototype thử tối đa ba slot, một skill có thể chiếm hai slot. Di chuyển một điểm đứng chiếm một slot.
- Chỉ một đánh tay miễn phí mỗi lượt. Không cho ba đòn miễn phí rồi thêm thủ vô hạn.
- Hộ thể thường chiếm một slot và tiêu chân nguyên; tồn tại theo dữ liệu đã chuẩn hóa. Thủ cơ bản chiếm một slot, giảm một phần đòn trực tiếp, không chặn toàn bộ độc/khống chế.
- Đánh nặng/sát chiêu chiếm hai slot, cần tài nguyên và cooldown. Không ép toàn bộ cổ về một cost chung.
- Chân nguyên giữ qua lượt, cap lấy từ lượng có khi vào trận; hấp thu có thể mở cap nhưng vẫn tốn lượt và nguyên thạch.
- Bắt đầu baseline bằng +1 chân nguyên/lượt đã có. Cấu hình thử +2 chỉ sau khi đo độ khan hiếm; không đổi mọi cost hiện tại thành 1/2/3 mà bỏ qua kinh tế ngoài trận.
- Địch có thể phản ứng tại slot được báo: ví dụ canh thủ phản kích. Nếu được sửa ý đồ sau khi người chơi commit thì phải là đặc tính có báo trước.

Nhịp nhiều hành động làm tăng damage/lượt, nên phải cân lại pattern và số slot địch. Không tái sử dụng resolver vốn tự cho địch đáp trả sau từng click ba lần liên tiếp rồi gọi đó là một lượt mới.

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md-3-ui-và-cảm-giác"></a>
### 3. UI và cảm giác

Ba dấu chân trên đấu trường; khi hover cổ, hiển thị vùng có thể trúng và điểm thi triển. Dải lệnh dưới sân cho sửa thứ tự bằng click, mobile dùng nút lên/xuống. Thanh chân nguyên ghi hiện tại/cap và lượng dự kiến sau chuỗi. Tooltip không chạy đồng hồ.

Các đòn dùng body `attack`, nhưng cast moonblade, quyền lực đạo và command triệu hồi dùng clip/FX riêng theo cổ. Có nút tăng tốc phần trình bày; logic vẫn giải quyết cùng sự kiện, không thêm lượt do skip.

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md-4-animation-và-fx-cần-thêm"></a>
### 4. Animation và FX cần thêm

| Hạng mục | Cần để làm gì? |
|---|---|
| `step_in`, `step_back`, `backstep` | Di chuyển một vị trí, đọc được tiến/lùi, không chạy tại chỗ |
| `cast_projectile`, `cast_support` | Phân biệt thúc cổ từ xa và hỗ trợ với đấm |
| `guard_hold`, `guard_react`, `guard_break` | Hộ thể tồn tại qua slot, phản ứng khi đỡ và phá thủ |
| `charge_hold`, `heavy_release`, `recover` | Đòn hai slot có giai đoạn chuẩn bị và cửa sổ sơ hở |
| `stagger`, `defeat` | Phản ứng có sức nặng; kết trận không trở lại idle |
| Vùng ý đồ, footprint, projectile, block impact | Cho người chơi hiểu kết quả vị trí thay vì chỉ đọc log |

Sáu clip đang có đủ làm prototype giới hạn bằng animation tạm. `run` một nhịp chỉ dùng di chuyển ngắn; chưa cần running loop hay tám hướng.

<a id="source-docs-big-update-q1-q2-battle-options-01-dau-tri-chan-nguyen-md-5-q1q2-và-tiêu-chí-chọn"></a>
### 5. Q1–Q2 và tiêu chí chọn

Q1 thiên nguyệt nhận, hộ thể, thiếu chân nguyên và đọc thú lao. Q2 thêm thú ảnh cận chiến, Khí Lực đánh xa, bẫy và đồng minh có lệnh hỗ trợ giới hạn. Những trận cường giả phải có thoát/cầm chân, không đổi thành tiêu diệt chỉ vì có thanh HP.

Lát cắt đầu: Phương Nguyên gặp heo rừng, rồi một cổ sư có thế thủ. Nghiệm thu khi người chơi phân biệt được lợi ích của đánh / lùi / thủ / tích năng lượng; tồn tại ít nhất hai cách thắng hữu ích và không có chuỗi ba action tối ưu cho mọi lượt.

Rủi ro chính: lượt quá dài, nhiều slot lấn át ý đồ địch, free action gây snowball. Giảm về hai slot và một movement nếu playtest chưa đọc nổi ba hành động. Đây là hướng rẻ nhất tương đối và phù hợp phản hồi muốn giữ nhịp theo lượt.

---

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md"></a>

## 02_SONG_DAU_DONG_THOI.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md-b--song-đấu-ra-lệnh-đồng-thời"></a>
## B — Song đấu ra lệnh đồng thời

Mục tiêu: hai bên cùng chọn rồi cùng thực hiện một đoạn giao đấu, tạo cảm giác đoán ý và đấu mưu. Khác A ở chỗ địch không chờ ta đánh xong mới đáp trả. Không đòi phản xạ trong giai đoạn chọn.

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md-1-vòng-chơi"></a>
### 1. Vòng chơi

Mỗi vòng có ba nhịp: mở đầu, va chạm, hồi thế. Người chơi đặt tối đa ba lệnh vào timeline, xem dự báo có điều kiện rồi khóa kế hoạch. Địch đã khóa kế hoạch của vòng từ trước khi người chơi chọn; dùng seed và state đã chụp để không “đọc input” rồi thay lệnh bí mật.

Người chơi biết tính chất mở đầu qua ý đồ: tiến công, tích lực, phòng bị, triệu hồi. Thông tin trinh sát và ký ức có thể mở thêm nhịp sau, không luôn tiết lộ đủ cả combo. Sai đoán phải còn đường sửa ở vòng kế, không thua ngay vì một lệnh.

Ví dụ: địch mở bằng tiến lên, sau đó có thể quyền nặng hoặc thủ phản kích. Ta chọn lùi → nguyệt nhận → thủ; đòn tầm xa có thể ngắt nếu skill thật có thuộc tính đó, không phải cứ đánh trước là hủy mọi đòn.

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md-2-luật-prototype"></a>
### 2. Luật prototype

- Hai bên đứng trên cùng trục khoảng cách; mỗi nhịp chỉ một lệnh hoặc phần thi triển của skill dài.
- Chân nguyên chi khi bắt đầu thi triển; cooldown bắt đầu cùng thời điểm. Skill bị ngắt có refund quy định riêng, UI phải nói trước.
- Đầu vòng sau hồi nhỏ cố định, giữ năng lượng chưa dùng. Không tăng thêm tài nguyên mang tên energy.
- Với sự kiện cùng timestamp: validate từ cùng snapshot, thu cost, thu thập hit hợp lệ rồi áp batch. Đối thủ bị hạ cùng nhịp vẫn có thể gây hit đã hợp lệ; tie và mutual defeat phải có luật encounter rõ.
- Phase chuyển sau khi batch hit kết thúc. Không cho boss đổi pha/xóa choáng giữa hai hit đồng thời để phá luật.
- Phản kích, projectile và DOT có thứ tự riêng ghi trong rulebook; giải quyết các phản ứng với giới hạn chuỗi để không loop phản công vô hạn.

Không đơn giản phát hai animation cùng lúc trong khi dùng resolver luân phiên cũ. Cần combat simulation độc lập và deterministic replay để luật đồng thời đáng tin.

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md-3-ui-và-trải-nghiệm"></a>
### 3. UI và trải nghiệm

Timeline chia ba nhịp, vùng nguy hiểm theo vị trí và dấu “chưa biết”. Forecast mô tả **nếu địch làm X thì…**, không hiện một con số giả chắc chắn. Khi replay, highlight nhịp đang diễn, rút gọn phần chờ và hiện lý do trúng/né/ngắt.

Khóa camera ổn định khi cả hai thi triển. Không giấu tín hiệu đối thủ dưới effect của người chơi. Đòn quan trọng có khoảng dừng hình ngắn trong presentation, không sửa timestamp resolver.

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md-4-animation-bổ-sung"></a>
### 4. Animation bổ sung

`ready`, `step_in`, `backstep`, `cast_start`, `cast_release`, `cast_recover`, `charge_hold`, `parry_react`, `interrupted`, `stagger`, `defeat`. Những clip này giúp phân biệt đòn chưa phát với đòn đã phát khi hai bên cùng đánh.

FX cần dự báo đường đạn, vùng hit theo nhịp, projectile trái/phải, va chạm và marker ngắt. Đạn chỉ tan/chặn nhau nếu skill matchup quy định; không tự cho tất cả nguyệt nhận va vào nhau rồi biến mất.

<a id="source-docs-big-update-q1-q2-battle-options-02-song-dau-dong-thoi-md-5-q1q2-và-tiêu-chí-chọn"></a>
### 5. Q1–Q2 và tiêu chí chọn

Q1 học dự đoán thú lao và cổ sư phản kích. Q2 mở combo lực đạo, băng khống chế, Khí Lực và điều phối ally. Lệnh của Thiết Nhược Nam/Hàn Bất Lưu diễn thành command clip + unit riêng; không vẽ lính/chó vào actor sheet.

Prototype chỉ hai bên, ba nhịp, năm lệnh mẫu. Chưa làm multiplayer, PvP, đội đông hoặc bài rút ngẫu nhiên. Nghiệm thu khi người chơi có thể giải thích một lần “đánh hụt vì đối thủ lùi trước” và một lần “đỡ vì đặt thủ đúng nhịp”, replay cùng seed cho cùng kết quả.

Rủi ro: preview khó hiểu, trận nhìn hỗn loạn và đồng thời khó debug. Nếu người mới không hiểu tại sao mất máu, chưa mở content; giảm số nhịp/skill trước khi thêm effect.

---

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md"></a>

## 03_REALTIME_TAM_DUNG.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md-c--điều-khiển-có-tạm-dừng-chiến-thuật"></a>
## C — Điều khiển có tạm dừng chiến thuật

Mục tiêu: người chơi trực tiếp di chuyển, quan sát vị trí và đòn bay, nhưng luôn được dừng để đọc và chọn cổ. Đây là ứng viên WASD ưu tiên cho người chưa quen realtime nhanh.

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md-1-vòng-chơi-và-điều-khiển"></a>
### 1. Vòng chơi và điều khiển

- WASD di chuyển trên mặt đất của sân 2.5D nhỏ; không phải mặt nhìn top-down. Nhân vật sideview đổi hướng trái/phải, bóng chân xác định chiều sâu.
- Space bật/tắt tactical pause. Trong pause, mọi timer simulation dừng: địch, projectile, DOT, hồi chiêu và năng lượng. UI và chọn lệnh vẫn hoạt động.
- Chuột/chạm chọn mục tiêu, 1–4 hoặc Q/E/R/F dùng cổ đã trang bị hợp lệ; một sơ đồ phím duy nhất trong sản phẩm sau playtest, không yêu cầu người dùng nhớ cả hai.
- Shift lướt ngắn nếu luật build cho phép; click nút lướt trên mobile. Esc mở menu và pause.
- Trong pause, đặt điểm đến hoặc một lệnh skill tiếp theo; chỉ queue một skill để tránh chuỗi tự động dài ngoài khả năng dự báo. Resume thì actor thực hiện khi đủ điều kiện.

Auto-pause mặc định khi địch bắt đầu đòn nguy hiểm mới, actor bị khống chế, hoặc mục tiêu đang chọn mất hợp lệ. Có tùy chọn giảm auto-pause sau tutorial. Không pause liên tục theo từng đạn nhỏ của cùng một lần thi triển.

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md-2-nhịp-và-tài-nguyên"></a>
### 2. Nhịp và tài nguyên

Prototype thử đòn nặng báo trước 1,4–2,0 giây, đã có auto-pause; đây là giả thuyết cân bằng, không lấy thông số RT cũ làm chuẩn. Không đòi perfect block cửa sổ 0,45 giây để sống.

Chân nguyên hồi theo **thời gian simulation**, nhỏ cố định theo giây, cap vào trận. Tốc độ thử phải quy đổi từ lượng tiêu trung bình, không lấy +1/lượt rồi đổi thành +1/mỗi frame. Pause không hồi; slow motion làm chậm mọi timer cùng tỷ lệ. Hấp thu/điều trị là channel có cost và nguy cơ bị ngắt.

Basic evade có cooldown, giới hạn quãng đường và không mặc định i-frame. Kỹ năng di chuyển mạnh hoặc bay yêu cầu cổ thật. Di chuyển WASD không tiêu chân nguyên; cast có thể giảm tốc/khóa di chuyển theo skill.

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md-3-luật-va-chạm"></a>
### 3. Luật va chạm

Actor có tọa độ ground `(x,y)` và facing; sprite chiều cao không quyết định hit. Projectile chạy trên ground plane, xét target radius và sweep từ vị trí cũ tới mới để tránh xuyên mục tiêu ở tốc độ cao.

Simulation fixed timestep; renderer interpolation riêng. Khi pause/resume không dồn backlog tick. Một action ID chỉ gây damage theo các hit event được định nghĩa, không dựa vào callback GIF hay số frame render.

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md-4-animation-cần-thêm"></a>
### 4. Animation cần thêm

`move_start`, `move_loop`, `move_stop`, `backstep`, `dash_start`, `dash_loop`, `dash_end`, `cast_start`, `cast_hold`, `cast_release`, `channel_loop`, `interrupted`, `guard_hold`, `stagger`, `defeat`.

Bộ sideview trái/phải có thể mirror nếu handedness và đạo cụ cho phép. Di chuyển W/S ban đầu dùng cùng bước locomotion, giữ ground shadow và depth sort, không xoay ảnh để giả hướng. Nếu chấp nhận visual này sau test mới sinh diagonal poses; không tự tuyên bố đã có tám hướng từ một ảnh.

Sáu action hiện hành cung cấp key pose/cast/hit; `run` một nhịp không dùng làm loop giữ phím. FX thêm telegraph mặt đất, hướng aim, dash trail và vòng channel.

<a id="source-docs-big-update-q1-q2-battle-options-03-realtime-tam-dung-md-5-q1q2-và-prototype"></a>
### 5. Q1–Q2 và prototype

Q1: một heo rừng lao thẳng, một cổ sư nguyệt nhận, khoảng trống đủ né. Q2: bẫy Tiêu Lôi Thổ Đậu trên đất phù hợp, BNB hỗ trợ một lệnh, lực đạo và Khí Lực tạo hai tầm chiến đấu. Bay và Khổ Lực chỉ sau khi core có luật rõ.

Mobile: joystick trái, nút pause lớn, skill và khóa mục tiêu bên phải. Không bắt chạm chính xác pixel của projectile. Khi kéo tooltip tự pause theo tùy chọn người mới.

Nghiệm thu khi trận vẫn thắng được bằng auto-pause và click chọn điểm đến, không bắt WASD liên tục; pause không tăng resource hay né damage đã xảy ra. Rủi ro: người chơi bị auto-pause quá nhiều, cast tại vị trí sai và unit tắc đường. Cần kiểm thử một enemy trước khi mở bầy.

---

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md"></a>

## 04_SONG_DAU_HANH_DONG_NGANG.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md-d--song-đấu-hành-động-ngang"></a>
## D — Song đấu hành động ngang

Mục tiêu: trận một đối một có tiến/lùi, nhảy né đường đạn, thủ và quyền có sức nặng. Mặt sân chỉ một trục ngang, rất phù hợp asset sideview; chiều sâu đến từ tầm đánh và cửa sổ hành động. Không phải game đi cảnh nhiều platform.

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md-1-điều-khiển"></a>
### 1. Điều khiển

A/D tiến/lùi, W hoặc nút riêng nhảy, S giữ thủ cơ bản. Space lướt ngắn; J đánh tay, K/L và 1–3 kích hoạt cổ đã chọn. Sơ đồ cuối cần giảm còn số nút phù hợp mobile; prototype PC có thể thử đầy đủ trước.

Không yêu cầu input kiểu quarter-circle hoặc combo nhiều nút. Giữ nút không spam skill mỗi render tick; có buffer ngắn và mỗi lần thi triển tạo một action ID.

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md-2-vòng-giao-đấu"></a>
### 2. Vòng giao đấu

Tiến vào tầm → thăm dò → đọc windup → lùi/nhảy/thủ → phản công lúc đối thủ recovery → tích chân nguyên và dùng cổ đúng lúc. Đánh hụt có recovery rõ. Bấm lướt không được tự hủy mọi chiêu; cancel được thiết kế theo skill và frame window.

Chân nguyên hồi chậm theo simulation time, giữ cap vào trận; attack/guard dùng cost đã cân. Basic strike không tốn nhưng tầm ngắn và recovery khiến spam không tối ưu. Không thêm stamina ở MVP; dash/jump có cooldown hoặc recovery để tránh spam.

Parry là trợ giúp nâng cao, không điều kiện bắt buộc; prototype thử 0,25–0,40 giây nhưng cần tutorial và playtest. Người mới có guard ổn định, auto-facing và aim assist. Cho tactical pause đọc thông tin, nhưng không dùng pause để reset buffer hay thời điểm parry.

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md-3-collision-và-công-bằng"></a>
### 3. Collision và công bằng

- Ground x và airborne height z riêng; nhảy không phải kéo sprite lên vài pixel mà giữ hurtbox ở mặt đất.
- Mỗi attack có startup / active / recovery, hitbox/hurtbox theo logical frame, độc lập với viền tóc/vạt áo.
- Đòn multi-hit có danh sách hit IDs và interval rõ; không damage mỗi frame overlap.
- Hitstun và knockback có trần, diminishing control hoặc rule boss để tránh combo vô hạn. Không biến mọi cú đấm thành ngắt vận chiêu của mọi cường giả.
- Nhảy qua nguyệt nhận chỉ hợp lệ khi hit volume không phủ trên đầu; đòn băng diện rộng có telegraph khác.
- Camera giữ đủ hai đấu thủ, không zoom sát làm mất dấu projectile/địch. Arena bounds và wall knockback được báo, không spawn damage vô hình ở tường.

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md-4-animation-bắt-buộc"></a>
### 4. Animation bắt buộc

Ngoài sáu action: `walk_forward`, `walk_backward`, `run_start/loop/stop`, `dash_forward`, `dash_backward`, `jump_start`, `jump_rise`, `jump_apex`, `jump_fall`, `land`, `light_attack_1/2`, `heavy_attack`, `cast_projectile`, `guard_hold`, `guard_hit`, `parry`, `stagger`, `knockback`, `knockdown`, `getup`, `defeat`.

Chỉ làm một light attack trong MVP; chuỗi 2–3 quyền và aerial attack là P2. Thú dùng pounce/leap đúng anatomy; không cho rùa, cá sấu nhảy như người để đủ roster.

FX: điểm contact, slash trail riêng, guard spark, parry ring, bụi land, đường projectile, dấu xuyên giáp/critical. Sound và hit-stop phải có nhịp, nhưng không kéo dài simulation timer theo hit-stop trình bày.

<a id="source-docs-big-update-q1-q2-battle-options-04-song-dau-hanh-dong-ngang-md-5-q1q2-và-quyết-định"></a>
### 5. Q1–Q2 và quyết định

Q1: Nguyệt Quang đánh xa đối lập thiếu chân nguyên và thủ cơ bản. Q2: lực đạo, thú ảnh, Cự Khai Bi và Thiết Đao Khổ thích hợp duel. Không đưa Hiên Viên Thần Kê vào boss phải đánh thắng; không cho basic nhảy thay công dụng phi hành Cốt Dực trong trận một đối bảy.

Prototype chỉ PN và một cổ sư, mặt đất phẳng. Nghiệm thu: collision đáng tin, guard không bất tử, cơ hội punish nhìn rõ, người mới có thể thắng không cần perfect parry. Rủi ro và chi phí cao vì cần nhiều animation và thiết kế combat sâu; nên chọn khi user thích cảm giác thao tác qua prototype thật.

---

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md"></a>

## 05_DAU_TRUONG_25D_WASD.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md-e--đấu-trường-25d-wasd-và-kiểm-soát-bầy"></a>
## E — Đấu trường 2.5D WASD và kiểm soát bầy

**Cập nhật 02/10/2026:** người dùng chọn cụ thể hóa E. Đọc [kế hoạch implement E](battle-options/08_E_KE_HOACH_IMPLEMENT_CU_THE.md) và [animation nhân vật còn thiếu](battle-options/06_ASSET_ANIMATION_VFX.md#source-docs-undone-big-update-q1-q2-battle-options-09-e-animation-can-bo-sung-md). Đã kiểm kê archive mới có đủ sáu action cho 38 nhân vật; ưu tiên tái sử dụng bộ đã tải, bổ sung locomotion/lướt/terminal theo nhu cầu.

Mục tiêu: mở trận thành một khu vực có chiều sâu, nhiều địch, bẫy, vật cản và mục tiêu phụ. Phương Nguyên tự di chuyển, chọn cổ và dẫn địch vào vị trí bất lợi. Phù hợp lang triều, hộ tống và Tam Xoa; khác D ở chỗ trọng tâm là không gian/bầy, không phải nhảy/parry trong duel ngang.

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md-1-điều-khiển-và-vòng-chơi"></a>
### 1. Điều khiển và vòng chơi

WASD di chuyển tự do trên ground plane, chuột chọn mục tiêu hoặc hướng bắn; click để lock-on và 1–4 dùng cổ. Space né/lướt ngắn; Shift có thể là khóa mục tiêu, tránh hai nút cùng nghĩa. W/S là chiều sâu mặt đất, không phải nhảy.

Đọc vùng nguy hiểm → chọn đường di chuyển → gom/tách địch → dùng cổ đơn mục tiêu hoặc diện rộng → bảo vệ điểm mục tiêu/thoát. Hạ mọi địch không phải điều kiện thắng mặc định. Trận intro chỉ một thú, sau đó mới thêm hai/ba địch.

Có pause thủ công và chế độ hỗ trợ auto-pause khi boss telegraph. Basic attack cần target trong tầm, không tự teleport; kỹ năng tự tìm địch có thuộc tính riêng. Aim assist và lock-on là mặc định mobile.

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md-2-tài-nguyên-và-áp-lực"></a>
### 2. Tài nguyên và áp lực

Chân nguyên hồi chậm theo simulation time và cap hiện có; một khoảng đứng chờ an toàn không tự làm đầy toàn bộ ngoài cap. Bầy địch, tiến độ hộ tống hoặc đường thoát tạo áp lực, không tự tăng ATK vô hạn vì quá N giây.

Dash cơ bản có cooldown và không mặc định vô địch. Bẫy có điều kiện mặt đất; Tiêu Lôi Thổ Đậu không hoạt động trên đá/xương nếu dữ kiện encounter nói vậy. Chiêu AoE có target cap hoặc công thức falloff khi cần cân, phải thể hiện đó là luật chuyển thể.

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md-3-world-và-ai"></a>
### 3. World và AI

Actor có ground `(x,y)`, footprint, facing và depth; vẽ sắp xếp theo ground y, không theo đỉnh sprite. Bóng chân, telegraph và vòng target nằm đúng ground plane. Sideview ban đầu dùng trái/phải, bước W/S chỉ là thử nghiệm art; không xoay nhân vật 90° khi đi lên.

Địch có vai trò: chặn đường, lao, bắn xa, triệu hồi. Bầy có attack slots để không tất cả chồng đánh một pixel hoặc đâm xuyên nhau. Navigation xử lý obstacle/corner; projectile collision sweep và target filter giữa các lane chiều sâu.

Camera giới hạn tại arena, minimap nhỏ chỉ khi cần. Nguy hiểm ngoài màn có arrow và audio, không projectile offscreen xuất hiện tức thì vào mặt người chơi.

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md-4-animation-và-fx-bổ-sung"></a>
### 4. Animation và FX bổ sung

`move_start/loop/stop`, `strafe_near/far` hoặc diagonal loop nếu hướng art yêu cầu, `dash`, `backstep`, `cast_ground`, `cast_projectile`, `channel_loop`, `command`, `summon_react`, `stagger`, `knockdown/getup`, `defeat`.

Unit riêng: chó/lính rơm/bầy sói cần spawn/idle/move/attack/hit/defeat; không lấy effect swarm làm collision unit thật. Không cấp nô đạo điều quân cho PN ở mọi chương: Thiết Nhược Nam hoặc Hàn Bất Lưu có thể là đối thủ/ally chỉ huy tùy encounter hợp lệ.

FX/environment: vòng báo AoE, đường charge, projectile theo ground direction, bẫy đặt/kích nổ, vật cản phá, marker hộ tống, vùng thoát, bụi và bóng chân. Sprite 256×256 giữ actor; effect lớn và flight có canvas/atlas riêng.

<a id="source-docs-big-update-q1-q2-battle-options-05-dau-truong-25d-wasd-md-5-q1q2-và-mvp"></a>
### 5. Q1–Q2 và MVP

Q1 lang triều: giữ tuyến, địch có đợt và khoảng nghỉ, không biển particle ngay từ đầu. Q2 sông Hoàng Long: bẫy và tránh cường thú; Thương gia có duel phụ, Tam Xoa có chặn đường/thoát. Cảnh bay cần luật altitude và target capability riêng, không chỉ phóng to bóng.

Prototype arena nhỏ: PN, hai thú, một telegraph charge, một nguyệt nhận và một mục tiêu thoát. Nghiệm thu collision chiều sâu dễ hiểu, không unit chồng, target selection đáng tin và chơi được với joystick mobile.

Rủi ro: bộ sideview chưa đủ biểu đạt chiều sâu, effect che bầy, nhiều enemy gây quá tải cognitive và CPU. Chỉ chọn nếu thử nghiệm art + điều khiển đủ thuyết phục; không nhận triển khai toàn Q1–Q2 trước khi arena nhỏ đạt.

---

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md"></a>

## 07_LO_TRINH_PR_VA_PLAYTEST.md

**Trạng thái:** Đề xuất chưa triển khai; E được cụ thể hóa riêng, input mới nhất ở 12_E_MENU_WASD_Z_COOLDOWN.md.

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md-lộ-trình-pr-thử-cơ-chế-rồi-thay-battle-hiện-tại"></a>
## Lộ trình PR: thử cơ chế rồi thay battle hiện tại

Thực hiện sau khi người dùng giao triển khai. Tài liệu này chỉ là kế hoạch; chưa tạo PR, branch, asset mới hoặc sửa gameplay.

**Cập nhật:** đã chuyển hướng lập kế hoạch cụ thể cho E. Khi triển khai, dùng chuỗi E-01–E-08 trong [08_E_KE_HOACH_IMPLEMENT_CU_THE.md](battle-options/08_E_KE_HOACH_IMPLEMENT_CU_THE.md); các bước so sánh A/C bên dưới là lịch sử và không còn là prerequisite.

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md-1-phạm-vi-cần-giữ-khi-thay-battle"></a>
### 1. Phạm vi cần giữ khi thay battle

Giữ world/content, save progression, sở hữu/nuôi cổ, nguyên thạch và điều kiện chương. Đấu trường mới nhận encounter snapshot và trả kết quả có kiểu: `kill`, `survive`, `escape`, `spared`, `loss`. Adapter gọi scene/after/reward hiện hữu đúng một lần. Cầm chân/thoát không tự nhận toàn bộ loot hạ gục.

Không cho chuyển battle engine giữa trận bằng toggle; mỗi trận lưu engine/version. Trận cũ đang dở tiếp tục ở adapter cũ đến kết thúc; trận mới dùng engine đã chọn. Save phải được sao lưu trước migration, có đường rollback nếu thử nghiệm lỗi.

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md-2-thứ-tự-pr-đề-xuất"></a>
### 2. Thứ tự PR đề xuất

| PR | Kết quả review/preview được | Đụng tới phần nào | Nghiệm thu |
|---|---|---|---|
| BNEW-01 — Asset manifest và actor sandbox | Một PN và một enemy diễn idle/attack/hit/guard, body và FX riêng | Module mới + preview riêng, dữ liệu asset | Không đổi tóc/mặt, pivot ổn, không ghost/crop; preload/fallback rõ |
| BNEW-02 — Simulation contract | Snapshot/input/result/event có ID, damage một lần | Combat core và adapter mới | Replay seeded, multi-hit/DOT/boss phase thứ tự đúng, save/reload ổn |
| BNEW-03A — Mẫu A | Trận ba vị trí, hai/ba slot, chân nguyên, một địch có ý đồ | Resolver lượt mới và HUD trong khung hiện tại | Chơi được bằng click, không thời gian thúc ép, có đánh/thủ/lùi hữu ích |
| BNEW-03C — Mẫu C | WASD/click move, tactical pause và auto-pause, một projectile | Simulation world nhỏ + collision + renderer | Pause không chạy timer, không xuyên projectile, mobile control thử được |
| BNEW-03B/D/E — Các mẫu thay thế nếu cần so sánh | B: ba nhịp đồng thời; D: duel nhảy/thủ; E: arena hai thú | Mỗi mẫu scope nhỏ trên core chung | Tập trung khác biệt quyết định, không làm campaign đủ cho cả năm |
| BNEW-04 — Chốt cơ chế và triển khai chính | Một battle engine chính, luật resource và controls được chốt | Entry point/adapter, HUD, configuration | Không còn mode thử lẫn vào campaign; damage/forecast trùng resolver |
| BNEW-05 — Skill library và content Q1 | Moonlight/armor/heal, thú charge, một trận cầm chân | Skill mapping, encounter data, VFX | Công dụng cổ đúng nguồn, onboarding dễ hiểu, rewards/flags đúng |
| BNEW-06 — Q2 build và mục tiêu | Lực đạo/băng, ally, thoát/cầm chân theo cảnh | Q2 adapter và encounter, asset variants | Không mix PN/BNB khác thời kỳ, không auto-win cường giả |
| BNEW-07 — Performance/save/mobile | Preload theo encounter, quality settings, save migration | Runtime, storage, input/accessibility | Tab ẩn, resize, reload, skip animation và input spam không tạo hit thưởng lặp |

Làm 03A và 03C trước để so sánh hai hướng phù hợp phản hồi hiện tại. Nếu một trong hai đã được chọn rõ thì không bắt triển khai B/D/E cho đủ số lượng. Năm plan là phạm vi thiết kế; số prototype phụ thuộc quyết định tiếp theo.

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md-3-hợp-đồng-module-gợi-ý"></a>
### 3. Hợp đồng module gợi ý

Tên file dưới đây là đề xuất mới, chưa tồn tại:

- `js/battle-next/asset_manifest.js`: mapping actor/variant/clip và atlas metadata.
- `js/battle-next/simulation.js`: state, command validation, skill execution, timeline, event IDs.
- `js/battle-next/presentation.js`: playback sheet, anchor FX, hit reactions, reduced-motion; có thể nối PixiJS hiện hữu.
- `js/battle-next/campaign_adapter.js`: encounter snapshot, kết quả/reward/scene và save version.
- `js/battle-next/input.js`: input map, pointer/mobile, buffer, pause policy.

Một skill definition mô tả cost, targeting, range, cast time/slot, cooldown, valid movement/cancel, effect logic và FX/clip bindings. Tách tham số theo cơ chế; không nạp A cost/lượt vào C cooldown/giây qua một phép đổi tùy tiện.

Core áp input theo mô hình của phương án; renderer tiêu event. Với A/B deterministic resolution trước playback, skip không đổi kết quả. Với C/D/E collision và simulation timestamp là authoritative; clip release dùng logical marker đã khai báo, không chờ render callback để spawn hit.

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md-4-so-sánh-công-bằng-trên-cùng-trận"></a>
### 4. So sánh công bằng trên cùng trận

Seed, bộ cổ, lượng HP/chân nguyên lúc vào, tầm skill và objective chuẩn hóa theo intended difficulty, không buộc HP tuyệt đối giống khi action economy khác. Ghi rõ khác biệt balance. Dùng PN Q1 + thú charge làm bài nhập môn, rồi một cổ sư có công/thủ để đánh giá depth.

Mỗi prototype có tutorial riêng ngắn và một lượt chưa gợi ý. Thu: thời gian hiểu luật, số lần dùng thủ/di chuyển/skill, damage tránh được, chân nguyên còn, số input sai, thời gian chọn vs playback và cảm giác muốn chơi lại. Không chấm chỉ bằng tỷ lệ thắng hoặc hiệu ứng nhìn đẹp.

Mốc quyết định đề xuất:

- Người mới hiểu ít nhất một lần vì sao trúng/hụt/đỡ sau tutorial.
- Có hai lựa chọn hợp lý trở lên trước đòn nặng; không một combo hoặc giữ dash thắng mọi trận.
- Animation không biến hình nhân vật, không che địch, impact và HP cùng sự kiện.
- Cơ chế chủ động vẫn chơi được với pause/trợ giúp đã thiết kế; không phải nhanh tay mới qua trận đầu.
- Chi phí sản xuất còn lại phù hợp kho asset và chất lượng prototype trên mobile.

<a id="source-docs-big-update-q1-q2-battle-options-07-lo-trinh-pr-va-playtest-md-5-những-kiểm-thử-thực-sự-cần-khi-triển-khai"></a>
### 5. Những kiểm thử thực sự cần khi triển khai

Simulation: action duplicate/input spam, cost/refund khi ngắt, projectile một hit, multi-hit/DOT, dead target, simultaneous kill B, boss phase, stun duration, cap resource, terminal objective/reward.

Lifecycle: pause/resume, tab hidden, resize, scene unload, battle reload giữa resolving, texture missing, animation skip và stale callback của trận đã kết thúc. Lệnh cũ không được đánh vào trận mới.

Input/world: WASD normalization để diagonal không nhanh hơn, obstacle/navigation, depth collision, dash không xuyên tường, frame-rate independence và mobile multitouch. A/B không cần các kiểm thử không gian realtime nếu không dùng chúng.

Asset QA: kiểm tra từ PNG/sheet thật; GIF preview đúng eight-frame/timing khi yêu cầu, không đánh giá chất lượng chỉ bằng đếm file. Không viết hàng loạt test mirror implementation cho thay đổi mỹ thuật nhỏ.
