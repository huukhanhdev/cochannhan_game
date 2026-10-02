# Battle E — phần thống nhất và hiện trạng triển khai

02/10/2026. Blue-chan rà ý kiến hai AI và thực thi phần đã thống nhất đủ rõ. **Đây là đầu mối hiện hành**; mọi quyết định còn mở nằm trong [một file cần chốt](BATTLE_E_CAC_DIEM_CAN_CHOT.md). Toàn bộ kế hoạch và phản hồi cũ nằm trong [lịch sử review](../reference/LICH_SU_REVIEW_BATTLE_E_2026_10_02.md), không dùng số đo cũ thay kết quả runtime mới.

## 1. Phần đã thống nhất và đã có trong sandbox

| Mục | Thực tế hiện tại | Căn cứ đồng thuận |
|---|---|---|
| PN là người chơi | Không cấp/tước cổ theo màn. Kit demo chỉ phục vụ sandbox; campaign phải dựng từ inventory/save thật | Yêu cầu người dùng; cả hai AI giữ nguyên trong kế hoạch mốc truyện/chân nguyên |
| Một action tại một thời điểm | Các cổ khác **đang sẵn sàng** bị khóa chung 2s lúc phát; cổ đang CD giữ thời gian cũ. Đi/đánh tay/lướt/Dừng không nhận khóa này | Người dùng đã chốt; Orange review khóa chung |
| Thiên Bồng | Vận đứng yên 0,9s; phí bật 18 tại release; tối đa 3s; duy trì 5/s; ngừng regen khi bật; thiếu nguyên tắt sớm. Dùng đủ tốn 33 | Người dùng chốt thông số; Orange review đúng |
| Thiếu tiền lúc phát | `fire()` kiểm lại phí vì upkeep có thể ăn phần nguyên còn lại trong startup. Không đủ: không phát, không thu phí bật, không tạo effect/khóa chung | Orange chỉ lỗi; Blue đã sửa và kiểm hồi quy |
| Kết trận | Chốt kết quả một lần; dọn đạn/vùng chờ; không đảo người thắng bởi đạn/DOT đến sau | Orange đã review và chơi hết trận |
| Điều khiển | Pointer Events dùng chung chuột/chạm; chạm chọn chiêu rồi chạm sân để nhắm; Lướt chạm đi ngay; Dừng giống S, có hủy startup và xóa lệnh đang giữ | Chốt mobile của Orange, Blue triển khai và kiểm Chrome |
| Sân | Mặc định trang demo 1200×260, nhìn toàn màn. Giữ tốc độ world và cỡ sprite; có lựa chọn classic 1000×240 để đối chứng | Orange đề xuất bước đầu 1200; người dùng đã đồng ý triển khai |
| Phép chiếu | `B.arena` cấu hình trận; view/input/bóng/telegraph dùng chung phép chiếu; lề màn hình 127px mỗi bên cho PN/BNB, không thu sân để giấu KO | Orange đề xuất lề hiển thị; Blue đo pose và kiểm biên |
| Nền trúc | `ground_screen_y` điều khiển sàn; haze hậu cảnh; click lệch sàn tối đa 12px được kéo về mép | Hai AI đã review map |
| BNB chống thả diều | Bản pressure chấm ứng viên cắt góc/ép biên/áp sát khi đối thủ vận; có nhịp nghĩ, commitment đích né. Không tăng HP/damage/speed trong lượt này | Orange đồng ý làm cùng sân mới |
| Thông tin công khai | Hướng Nguyệt hiện khi startup; AI chỉ né vệt đã hiện sau thời gian phản ứng, không đọc con trỏ hoặc đích đi ẩn | Orange chỉ lỗi, đề xuất vẽ hướng; Blue thực hiện |

## 2. Bổ sung trong lượt rà/gộp này

| Mục | Đã làm | Giới hạn |
|---|---|---|
| Hình hộ thể | Ngọc đa giác, Thiên Bồng giáp góc cạnh, Thủy Tráo gợn vòng; impact theo vật liệu thực tế | Graphics pilot, chưa phải asset vẽ cuối |
| Event/vòng đời | `hid` theo act/release/interrupt/shield/shieldEnd/heal/escape/zoneFire/zoneCancel; thay hộ thể phát end cho hiệu ứng cũ | Chưa triển khai registry tổng quát cho summon/nhiều actor |
| Ánh lấy đà | Đạn và hồi phục có sáng tăng dần theo startup thật, mất khi hủy/ngắt | Không thêm hitstop hoặc rung camera |
| File âm | Master compressor −18dB, ratio 4; gain file mặc định 0,4, cho override từng cue; giữ giới hạn 8 voice, mute/unlock/hidden-tab | Vẫn cần nghe duyệt, compressor không chứng minh chất lượng |
| Bộ âm thử | 4 MP3 punch/jade/ice/gold từ [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds), CC0; nguồn, bản gốc, xử lý và giấy phép ở `assets/audio/battle/` | Là pilot. Cue chưa có file vẫn tổng hợp; không gọi âm kính là âm băng đã duyệt |
| Import FX riêng | `tools/fx_import.py`: rect tường minh, alpha hoặc key magenta, pivot/timing/blend/loopFrames; từ chối sai rect/timing/frame rỗng; PNG riêng + sheet + manifest | Không dùng đo mặt/căn chân của key-pose; không tự suy rect từ contact sheet AI |
| Loader FX tùy chọn | Nạp 3 ID rết/tay/impact băng có manifest `approved`; thiếu hoặc sai giữ Graphics dự phòng | **Chưa có 3 sprite FX mới**; không đưa ảnh chưa duyệt vào runtime |
| Đo tài nguyên | Bench thêm min nguyên và số trận xuống dưới 10%; thử Băng nhận 3/đòn trên kit sao chép | Không đổi kit production; ngân sách đầy đủ còn trong file cần chốt |

Hướng dẫn import: [assets/battle_fx/README.md](../../assets/battle_fx/README.md). Hiệu ứng chỉ trình bày event; damage/hitbox vẫn do simulation quyết định. Sprite rết/tay hiện là đường trình diễn pilot, phải review pivot/timing/đường đi trước nghiệm thu asset.

## 3. Kết quả kiểm tra và giới hạn cân bằng

- Hồi quy simulation: khóa chung, phí release/upkeep, kết trận, arena/ID khác BNB, hướng công khai và `hid` cùng chu kỳ.
- Hồi quy input: Dừng/hủy, Lướt và nhắm cảm ứng; Chrome desktop + viewport 390px: không lỗi JS, không tràn ngang, biên sân và tap chọn/commit/Dừng đạt. Chưa test điện thoại thật.
- Importer FX: thử alpha 128, xóa magenta giữ xanh lá/trắng, crop/assembly thật và từ chối metadata sai.
- Bench sân/AI: 3 seed × 300 trận/style/config, báo cáo [JSON](../../tools/reports/sandbox_arena_ai_2026_10_02.json). Wide+pressure: move thắng 84,7–88,3%; wide+legacy: 86,7–91,7%. **Thả diều vẫn mạnh**, không tuyên bố đã cân bằng.
- Bench phí Băng nhận: 3 seed × 300 × 3 style × 2 cấu hình, [JSON](../../tools/reports/sandbox_resource_fee_2026_10_02.json). Move current 84,7–88,3%, trial 3/đòn 84,0–87,7%; BNB dưới 10% nguyên ở 33–40/300 trận move, thay vì 0. Phí có tác động tài nguyên nhưng chưa giải quyết lợi thế chạy bắn.

Các test/báo cáo ghi rõ bot, seed và cấu hình. Không dùng tỷ lệ bot để suy rằng người thật chắc thắng/thua hoặc tự ép về 50%.

## 4. Ràng buộc truyện hai AI đã đối chiếu

Đây là tổng hợp đối chiếu trong review cũ, giữ các nguồn tại [bản lịch sử — kế hoạch mốc truyện](../reference/LICH_SU_REVIEW_BATTLE_E_2026_10_02.md#source-ke_hoach_can_bang_co_trung_va_bnb_theo_moc_truyen). Không lấy mô tả cũ “Sương Yêu thoát thân” làm căn cứ nguyên tác.

| Mốc | Ràng buộc |
|---|---|
| Lần đầu gặp | BNB chưa mất tay, có áp chế xuống Nhị chuyển. PN không tự có Thiên Bồng chỉ vì vào màn |
| Ch.136–143 / Thanh Thư | Lam Điểu đã xuất hiện ch.136; Sương Yêu tăng công và có hậu quả, không phải cổ teleport. Ch.143 đoạt 3 cổ: Xích Thiết Xá Lợi, Thạch Khiếu, Thủy Tráo |
| Ch.155 | PN tự hợp luyện Thiên Bồng từ Bạch Ngọc và cổ phòng ngự nước; không phải mượn từ BNB. Lượt đầu với Thủy Tráo cướp được thất bại |
| Ch.166 | Trận truyện gọi lần hai, nằm giữa Thanh Thư và cưỡi nhện. Không cấp kit Tam chuyển của trận này cho nhánh cứu Thanh Thư |
| Ch.173–190 | Bạch Tướng Tiên Xà Ngũ chuyển chưa luyện hóa, hành vi tự chủ; không biến thành nút spam. Cưỡi nhện lên ch.190 là lần ba theo truyện |
| VN có lựa chọn lệch | Trạng thái tay/cổ/sự kiện phải đọc nhánh/save; hồ sơ cố định chỉ áp boss, không ghi đè inventory PN |

Tách `capacity/current/quality/nguồn hồi` là hướng đã đồng ý. **Các con số và adapter save chưa chốt**, xem file cần chốt. Nguyên tác có hồi tự nhiên theo giờ và hấp thu nguyên thạch; không suy ra thanh hồi mạnh mỗi giây trong trận.

## 5. Đã thống nhất hướng nhưng chưa đủ điều kiện triển khai

| Việc | Điều kiện còn thiếu / bước tiếp |
|---|---|
| Hai pilot Phương Chính + Heo rừng | Kiểm bộ asset mới, ID/thời kỳ/clip/release, xác nhận kit theo data. Sau đó mới nối caster + thú lao; không suy kỹ năng từ ngoại hình |
| AI chung cho roster | BNB hiện chỉ là pilot ứng viên di chuyển + luật kỹ năng riêng. Chưa có utility layer đầy đủ và profile được kiểm cho cả roster |
| Roster 40 ID | Blue đã kiểm 291 clip / 627 frame, cấu trúc đạt; còn lỗi source/design, anchor, hover và thiếu clip. [Review + atlas từng actor](../../previews/roster-validation-v01/README.md). Chưa duyệt cả bộ; chỉ sửa viewer, không thay asset |
| 3 sprite FX | Dùng prompt Muse rết/tay/impact, nộp nguồn + rect/pivot; import review rồi duyệt ở kích thước battle. Tool/loader đã sẵn sàng |
| Campaign | Adapter inventory/nhánh, quality và save migration; không đưa demo kit thành kit bắt buộc cho PN |
| Hiệu năng/mobile thật | Chơi trên điện thoại thật, nghe âm, kiểm FX dày; chưa làm pool hay nhiều địch vì chưa có cảnh đó |

Các phần trên giữ trong backlog một file cần chốt; không được hiểu “đã đồng ý hướng” là mọi điều kiện nghiệm thu đã đạt.

## 6. Bàn giao Orange-kun

Review diff `sim.js`, `view.js`, `audio.js`, `fx_assets.js`, `battle_sandbox.html`; tool `fx_import.py` và các test/report. Lượt này không thay phí mặc định Băng nhận/bể BNB/regen/khóa chung, không tự đổi Sương Yêu hay kit campaign. Những sửa kit/importer/roster do Orange đang làm được giữ nguyên.

13 file plan/note cũ được lưu với anchor riêng vào bản lịch sử rồi bỏ file riêng; link Markdown trong repo được chuyển tới bản lưu. Tài liệu prompt, nguyên tác và kế hoạch khác còn giữ. Đọc 2 file hiện hành trước, chỉ mở lịch sử khi cần căn cứ.

## 7. Review của Orange-kun (02/10/2026)

Đã đọc diff `sim.js`, `ai.js`, `view.js`, `input.js`, `hud.js`, `audio.js`, `fx_assets.js`, `battle_sandbox.html`, `tools/fx_import.py`, bench. Chạy lại: `sandbox_regression.cjs`, `sandbox_input_regression.cjs`, `sandbox_browser_regression.cjs`, `fx_import_regression.py` đều **đạt**.

### 7.1. Đúng, giữ nguyên

- `fire()` kiểm phí lúc release: không phát, không CD, không khóa chung, gỡ zone, phát `fizzle`. `stepAct` dừng khi act đã kết thúc. Đúng như đề xuất.
- `B.arena` / `B.ids` / `opponentOf`: đã gỡ hết hằng `'pn'/'bnb'` và `SBSim.X0/X1/Z1` khỏi sim/ai/view/input/hud/audio (đã grep). Âm/impact chọn theo `sk.fx==='ice'`, không theo id.
- Phép chiếu `sx = OX + x·KX` lề 127 và `toWorld` nghịch đảo đúng (browser test: px 127 → x=110, px 833 → x=1090).
- Hướng Nguyệt khóa lúc nhận lệnh và vẽ công khai. AI né theo vệt đã hiện ≥0,15s. Đã hết lỗi đọc `aim` ẩn.
- Input cảm ứng: commit ở `pointerup`, ngón phụ/cancel không phát, `click` chỉ nhận `detail===0` (bàn phím) nên không phát đôi. Dừng = S (`cancel:true`) và xóa phím đang giữ. Lướt chạm đi ngay. `AbortController` dọn listener.
- Audio: compressor −18 dB / ratio 4, gain file mặc định 0,4, chặn đường dẫn `..`, `/`, `:` trong manifest. Nguồn Kenney CC0 ghi đủ.
- `fx_assets.js` chỉ nạp manifest `approved` và kiểm kích thước sheet. Thiếu thì quay về Graphics.

### 7.2. Lỗi / cần sửa

1. **Đã sửa (nhỏ):** `battle_sandbox.html` còn `B.over.winner==='pn'` → `B.ids.player`.
2. **`fx_import.py` xóa key màu chỉ khi trùng chính xác `#FF00FF`.** Ảnh Muse không bao giờ có nền đúng một màu: viền khử răng cưa và nén sẽ cho ra hồng lệch vài đơn vị, nên sẽ còn viền hồng quanh FX. Đề xuất làm như `keypose_import.clean()`: chỉ flood-fill vùng gần màu key (khoảng cách RGB ≤ 60) nối với mép ảnh, và khử ám hồng ở dải viền vài px. Test hiện tại chỉ dùng ảnh tổng hợp có key chính xác nên không bắt được lỗi này.
3. `fx_import.py --approve` ghi thẳng vào `assets/` mà không cần đã có bản review. Chấp nhận được vì người dùng tự chạy, nhưng nên in cảnh báo khi chưa có `previews/fx-import/<id>/manifest.json`.
4. `view.js` `MARGIN=127` là số đo của PN/BNB. Thú lớn của roster mới vươn tới khoảng 184 px sprite (Phi Tượng khung 368). Khi nối pilot Heo rừng (khung 288, an toàn) thì không sao. Nhưng Phi Tượng, Gấu, Điện Lang vương cần lề theo `frame_size/2 × SCALE × depthK(Z1)` của actor lớn nhất trận. Nên tính lề từ manifest lúc mount, không hằng số.
5. Lặt vặt: `view.js` gán `syk` hai lần trong `mount` (dòng điều kiện bị dòng sau ghi đè), vô hại.

### 7.3. Phát hiện quan trọng về “thả diều vẫn mạnh” (AI-1)

Orange-kun phân rã sát thương của bot `move` (wide, pressure, Thường, seed 20261002, 300 trận/trận trung bình):

| Nguồn | Sát thương/trận |
|---|---:|
| PN đánh tay | 152 |
| PN Cự Xỉ + chảy máu | 84 + 26 |
| **PN Nguyệt Mang** | **33** |
| BNB Băng nhận lên PN | 158 |

Bot `move` **không thắng nhờ bắn xa**. Nó thắng nhờ né Băng nhận (lấy đà 0,65s) rồi phạt trong 0,42s thu chiêu. Kiểu này là né rồi đánh trả, không phải thả diều. Vì thế các đòn bẩy “chống thả diều” không có tác dụng (đo trên bản sao, không đổi runtime, 300 trận × 2–3 seed):

| Thử nghiệm | Bot move thắng |
|---|---:|
| Hiện tại | 84,7–87% |
| BNB thêm Lam Điểu Băng Quan (đạn đuổi, có từ ch.136) | 88–91% (BNB đứng vận ở xa, PN được rảnh tay) |
| BNB nhanh hơn PN (280 > 265, đúng ch.134 “tốc độ hơi nhanh hơn”) | 89–90% |
| PN regen 0 / Nguyệt CD 4s / phí 12 | 85–93% |
| **Bot phản xạ 0,25s, nghĩ mỗi 0,15s** | **39–40%** |
| **Bot phản xạ 0,35s, nghĩ mỗi 0,15s** | **52–55%** |

**Kết luận:** con số 85% chủ yếu do bot phản xạ 0,15s, nhanh hơn người. Với phản xạ gần người (0,25–0,35s), tỉ lệ thắng của lối chơi né + phạt đã ở khoảng 40–55%, gần mục tiêu 40–45% của Q1. Số không đơn điệu (0,25s thấp hơn 0,35s) có thể do nhịp nghĩ và nhịp lấy đà trùng pha. Cần thêm seed trước khi tin từng điểm.

**Đề xuất:**
- Bench thêm hai hồ sơ bot: `expert` (0,15s, như hiện tại) và `human` (0,3s ± jitter). Báo cáo cả hai. **Không nerf PN hay buff BNB** dựa trên bot 0,15s.
- Ghi vào canon: ch.134 BNB (áp chế nhị chuyển) nhanh hơn PN một chút, trong khi kit đang ngược (PN 265 > BNB 235). Sửa cho đúng truyện thì phải bù bằng thứ khác, vì riêng tốc độ không làm bot né yếu đi. Đề xuất đưa vào TR-2, chưa sửa runtime.
- Lam Điểu Băng Quan vẫn nên có trong hồ sơ trận đầu vì đúng truyện, nhưng phải cho nó tác dụng thật: đuổi theo, phí đắt khi đang áp chế, và Nguyệt chặn được như ch.166. Không coi nó là cách chữa thả diều.

## 8. Người dùng chốt và Orange-kun đã triển khai (02/10/2026)

| ID | Quyết định | Triển khai |
|---|---|---|
| TR-1 | Sương Yêu theo truyện | `kind:'empower'`: vận 0,4s, phí 30, 4s đòn mạnh hơn 35% và xuyên nửa hộ thể; hết thì khớp đông cứng, chậm 1,5s (ch137). Không còn lướt thoát. AI bật khi sắp vào tầm và còn đủ chân nguyên cho Lốc. |
| TR-1/TR-4 | Nổ tay là mốc chuyển pha | `kit.story`: lần đầu máu BNB xuống ≤30% (kể cả đòn lẽ ra hạ gục) thì nổ Sương Yêu + tay phải một lần: vỏ băng 2,5s giảm 80% sát thương và hồi 24 máu, hất PN lùi 150, làm chậm và ngắt chiêu. Sau đó **mất Sương Yêu** (`delete sk.suongyeu`), `oneArm=true`. Event `detonate`/`shellEnd`. Chưa có sprite một tay. |
| CN-1 / CN-4 / TR-2 | Chân nguyên theo truyện, hồ sơ trận đầu | PN hồi 0 trong trận. BNB bể 130, hồi 0,8/s (Thập Tuyệt thể), tốc độ 275 > PN 265 (ch134). Băng nhận vẫn miễn phí. |
| CN-5 | Phí huỷ | Tự huỷ trong 0,15s đầu lấy đà miễn phí; sau đó mất 25% phí cổ (`CANCEL_FREE`, `CANCEL_FEE`). Huỷ ở thu chiêu không thu. Bị địch ngắt không mất phí. Event `cancel.fee`. |
| TR-3 | Thắng = ép rút lui | `B.over.retreat`. Người thua chạy khỏi sân và mờ dần thay vì nằm gục. Màn kết quả ghi “Thắng: ép lui”. Không loot. |

**Kèm theo, không cần chốt:**
- Bench thêm hồ sơ bot `expert` (phản xạ 0,15s) và `human` (0,3s, nghĩ mỗi 0,15s), tham số thứ 9.
- `fx_import.py` xóa key theo ngưỡng (`key_tolerance`, mặc định 90) và khử ám màu key ở viền 2px. Có cảnh báo khi `--approve` chưa qua bản review.
- Lề màn hình tính từ `reach_px` trong manifest (bề vươn sprite thật), không còn hằng 127. PN 104, BNB 105, Điện Lang vương 216.
- Sửa `winner==='pn'` trong trang demo.
- Test hồi quy dùng kit sao chép mỗi trận (trước đây một test sửa thẳng `SB_KITS`).

**Kết quả đo** (wide + pressure, 3 seed × 300, chi tiết [JSON](../../tools/reports/sandbox_story_profile_2026_10_02.json)):

| Bot | Dễ | Thường | Khó |
|---|---:|---:|---:|
| human 0,3s, lối né + phạt | 83–89% | **47–51%** | 27–33% |
| expert 0,15s | 94–98% | 87–89% | 74–79% |

Đứng yên hoặc spam: 0–3%. Khoảng 75% trận né-phạt PN xuống dưới 10% chân nguyên, BNB khoảng 50%. Chân nguyên giờ là tài nguyên thật. Mục tiêu Q1 40–45% ở Thường: bot human đang hơi cao hơn, cần người chơi thật thử trước khi chỉnh.

Kiểm: `sandbox_regression.cjs` (thêm phí huỷ, Sương Yêu, nổ tay/rút lui), `sandbox_input_regression.cjs`, `sandbox_browser_regression.cjs`, `fx_import_regression.py` đều đạt. Chụp Chrome: vỏ băng, chữ “Tự nổ tay phải!”, rút lui mờ dần, không lỗi JS.

## 9. Blue-chan review bản chuyển pha của Orange-kun (02/10/2026)

Đã đọc mục 8, chạy test simulation/input/import FX và kiểm Chrome sandbox thật bằng đòn Cường Thủ. Điều kiện ≤30%, chỉ nổ một lần, xóa Sương Yêu, `oneArm`, vỏ băng 2,5s, hết vỏ tiếp tục đánh và thắng bằng ép rút lui đều hoạt động. Không lỗi JS, kết trận không còn đạn/vùng chờ. Số liệu buff/phí/hồi phục là thiết kế game; lượt này không xác minh lại nguồn truyện hoặc chạy lại bench tỷ lệ thắng.

**Hai lỗi đã sửa trong `sim.js`:**

1. Cường Thủ kích nổ rồi vẫn kéo mục tiêu: PN từ x400 bị đẩy về x250, nhưng BNB lại bị kéo từ x480 về x370 ngay cùng tick. Nay vỏ băng không nhận kéo, giữ x480 và khoảng cách 230; không phát event `grab` khi không có kéo.
2. Cảnh nổ đặt PN vào `hit` nhưng bỏ qua ngắt `act` có `armor`, để action mồ côi. Chuyển pha truyện nay ngắt cả action có armor và phát `interrupt`; armor vẫn giữ luật chống ngắt trong các đòn đánh thông thường. Có hồi quy kết hợp Cường Thủ + armor, sau 0,32s PN về idle và act vẫn null.

**Còn thiếu về hình:** chưa có sprite BNB một tay, nên sau sự kiện vẫn nhìn như đủ hai tay; vỏ băng đang là Graphics đa giác, chưa phải sprite vỏ băng riêng. Không coi cảnh này là asset cuối đã duyệt.

Bằng chứng: [ảnh vỏ băng](../../previews/bnb-detonate-review/shell.png), [ảnh rút lui](../../previews/bnb-detonate-review/retreat.png), [kết quả Chrome](../../previews/bnb-detonate-review/browser_report.json). Hồi quy `sandbox_regression.cjs`, `sandbox_input_regression.cjs`, `fx_import_regression.py` đạt sau sửa.

## 10. Blue-chan — sửa giật tư thế khi BNB giữ tầm (02/10/2026)

Người dùng báo giật liên tục gần thông báo “khớp đông cứng”. Tái hiện bằng simulation production: PN đứng x600/z130, BNB x520/z130, Thường, seed123. BNB tới khoảng đứng rồi đổi `move → idle` mỗi ~0,067s: điểm giữ tầm có `wobble` cập nhật liên tục, mỗi bước chỉ 1–2px; `afterFree()` lúc tới đích kéo nhịp nghĩ AI về 0,06s. Đây là giật state/pose, không phải đo được FPS thấp hay do text hết Sương Yêu.

Đã bỏ wobble ở nhánh giữ tầm, dùng vùng ổn định 12 world px: đủ gần vị trí mong muốn thì dừng; chỉ đi khi mục tiêu ra khỏi vùng. Đến đích move giữ nhịp AI đã chọn theo difficulty, không thúc nghĩ lại sau 0,06s. Hoàn tất chiêu/hit vẫn đánh thức AI như trước, buffer vẫn xử lý. Không đổi HP, damage, phí cổ hoặc tốc độ.

Hồi quy bổ sung: BNB ở khoảng đứng ổn định 3s không tạo arrive hoặc đổi move/idle; tới đích không tăng nhịp nghĩ. Simulation/input đều đạt. Thay đổi có thể ảnh hưởng nhịp chiến đấu, không dùng lại số bench cũ để khẳng định tỷ lệ thắng mới.
