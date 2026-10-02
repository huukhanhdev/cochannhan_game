# Kế hoạch hiệu ứng và âm thanh chiêu battle E — Blue-chan

02/10/2026. Bàn giao Orange-kun review và triển khai cùng [kế hoạch map pixel](KE_HOACH_MAP_BATTLE_PIXEL.md). **Đã triển khai mẫu FX-02 trực tiếp trong sandbox theo yêu cầu người dùng; các bước còn lại là kế hoạch.** Ưu tiên sandbox PN/BNB; chỉ nhân rộng roster sau khi mẫu đạt.

### Mẫu đang chạy để duyệt

- `battle_sandbox.html`: giữ URL preview hiện tại, thêm nút bật/tắt âm và thanh âm lượng. Một batch event được đưa cho view và audio, chỉ rút queue một lần.
- `view.js`: thay đạn nguyệt và vệt chém BNB cũ bằng hình sắc hơn; thêm tụ sáng Nguyệt Mang, vệt đấm và impact theo chất liệu. Dùng hand của clip nếu có, fallback thủ công; chưa có atlas/pool hay anchor từng frame.
- `sim.js`: bổ sung source/skill/hid/contact vào event damage; không sửa luật trúng, sát thương hoặc timing. DOT vẫn im lặng.
- `audio.js`: backend Web Audio riêng của sandbox, unlock sau thao tác người dùng, mute/volume lưu localStorage, trần tám voice; âm mẫu đấm/gió/nguyệt/băng và fallback ngọc/hồi phục. Màng nước/rết/Cường Thủ chưa có âm riêng hoàn chỉnh. Không thay `SFX` campaign.
- Kiểm thử: Chrome chạy VFX thật, unlock/mute/tối đa tám voice và dọn voice; chuột/cảm ứng vẫn đạt; hồi quy simulation và dữ liệu đạt. So sánh simulation trước/sau bổ sung event qua 500 tick cho cùng chuỗi lệnh có state gameplay giống nhau. Chưa nghe duyệt chất lượng âm trên thiết bị thật.
- Chưa hoàn tất toàn bộ FX-01: schema event mới chỉ có dữ liệu damage cần cho mẫu, chưa có eid/anchor mọi frame/registry. Không coi bộ effect toàn kit đã xong.

## 1. Mục tiêu

Chiêu phải có nhịp **lấy đà → phát → trúng hoặc trượt → tan**, nhìn và nghe phân biệt được chất liệu. Hiệu ứng đẹp nhưng vẫn thấy mặt, pose, chân, đạn và vùng né. Animation nhân vật tiếp tục dùng frame đã duyệt; VFX không thay cho frame tay/chân còn thiếu.

Không đổi sát thương, tầm, hồi chiêu, tốc độ trận hoặc độ khó để làm hiệu ứng đẹp. Không thêm hit-stop vào simulation ở đợt này. Hình, màu và âm thanh dưới đây là thiết kế mỹ thuật cho kit hiện có, không phải khẳng định chi tiết nguyên tác.

Hướng miễn phí: VFX bằng code + atlas pixel nhỏ dùng chung; âm thanh mẫu bằng Web Audio đang có. Không cần model video, PixelLab hay render AI local. Nếu âm tổng hợp chưa đạt, thay từng cue bằng file thu/tạo riêng sau; không buộc tải một bộ âm thanh lớn ngay.

## 2. Hiện trạng đã đọc trong code

| Thành phần | Đã có | Còn thiếu |
|---|---|---|
| `js/sandbox/view.js` | Đạn nguyệt, vệt chém BNB, đường rết vàng, đường chộp kéo, burst, bóng lướt, flash, chữ sát thương, vòng AoE | Chất liệu riêng từng chiêu, điểm phát chuẩn theo frame, FX trúng gắn với nguồn chiêu, ngân sách FX |
| `js/sandbox/sim.js` | Event `act`, `release`, `dmg`, `miss`, `interrupt`, `shield`, `shieldEnd`, `heal`, `escape`, `zoneFire`, `zoneCancel`, `ko`, `projEnd` | `dmg` chưa ghi skill/source/contact; nhiều event thiếu ID liên kết và snapshot tọa độ |
| `js/sound.js` | Web Audio, mute lưu localStorage; cue chung `blade`, `hit`, `jadeGuard`, `stagger`, v.v. | Sandbox chưa nạp; chưa có gain chung, giới hạn voice, âm riêng nước/băng/rết và hủy âm lấy đà |
| Loop sandbox | Rút `B.events` một lần mỗi frame, đưa view | Chưa fan-out cùng batch cho audio; chưa unlock audio ở thao tác người dùng |

Không gắn `SFX.hit()` vào mọi tick mất máu: chảy máu hiện có thể phát `dmg` nhiều lần mỗi giây, sẽ thành tiếng máy gõ.

## 3. Ngôn ngữ hình ảnh chung

- Cụm pixel sắc, 3–5 màu chính cho mỗi chất liệu; lõi sáng nhỏ, viền rõ. Tránh quầng blur lớn, khói mờ đặc và bloom toàn màn hình.
- Nguyệt: trắng xanh nhạt; ngọc: trắng ngà có cạnh; rết: vàng đồng có đốt/răng; Cường Thủ: xám thép; Thiên Bồng: vàng kem; băng: xanh băng sắc; nước: xanh lam trong; hồi phục: xanh lá dịu.
- Vòng nguy hiểm: viền đỏ/cam tương phản + nét đứt/nhịp co vào, khác hình hiệu ứng trang trí. Không dựa chỉ vào màu để nhận biết.
- Ground guide/telegraph nằm trên sàn, dưới actor; đường đạn và FX tay ở cao độ phù hợp. Chia FX trước/sau actor theo z khi cần, không đặt mọi FX phía trước mọi nhân vật.
- Một cú trúng có lõi lóe 1–2 frame và 4–8 mảnh nhỏ; chiêu lớn có thể 12–24 mảnh. Các số là ngân sách đề xuất, cần nhìn thử trên mobile.
- Đánh thường không rung camera. Đợt đầu không rung camera để giữ nhắm/click chính xác. Nếu thêm sau, phải bù transform trong `toWorld` và cho tắt rung.
- Giữ chữ sát thương gọn; damage trực tiếp có chữ, DOT gộp thông báo theo khoảng ngắn thay vì spam. Việc gộp chỉ ở view, không đổi số tick simulation.

## 4. Bộ PN: hiệu ứng và âm từng chiêu

Thời lượng gameplay lấy đúng `kits.js`; thời gian tan FX dưới đây tính theo giây trận. Âm one-shot ngắn dùng giây thực, không đổi pitch theo tốc độ trận.

| Chiêu | Lấy đà / phát | Trúng / kết thúc | Âm đề xuất |
|---|---|---|---|
| Đánh tay (`pn:atk`) | Vệt tay ngắn tại release, không phát đạn | Chấm impact trắng ngà, 4 mảnh, tan 0,12–0,18s; trượt không có impact | Vút nhẹ lúc release; tiếng đấm trầm gọn chỉ khi trúng |
| Nguyệt Mang (`nguyet`) | Điểm sáng nhỏ ở tay trong startup 0,30s; lưỡi trăng có lõi trắng và đuôi xanh 2–3 đoạn đi theo projectile thật | Impact hình cung tại contact, tan 0,18–0,25s; hết tầm tan ở vị trí cuối, không giả tiếng trúng | Gió sắc khi phóng, va cắt khi trúng; tránh kéo âm tới tận lúc projectile hết tầm |
| Bạch Ngọc (`bachngoc`) | Ánh ngọc chạy ngắn từ thân lên vai khi buff thực sự kích hoạt | Viền/ngấn ngọc mảnh quanh thân, không cầu năng lượng lớn; lóe cạnh ở chỗ chịu đòn; tan khi hết/thay hộ thể | Tiếng ngọc trong, ngắn khi kích hoạt; tiếng chạm ngọc nhỏ theo hit đã đỡ |
| Cự Xỉ Kim Ngô (`cuxi`) | 0,40s lấy đà; cung vung rết vàng có đốt và răng cưa, nối từ tay, chỉ dài bằng tầm đang mô phỏng | Cung cắt + 6–10 vụn vàng ở hit; chảy máu chỉ dấu nhỏ, không phun máu phủ sprite | Tiếng răng cưa khô + vút nặng, impact xé ngắn; DOT không lặp tiếng chém |
| Cường Thủ (`cuongthu`) | Bàn tay thép riêng, có silhouette ngón rõ; phát lúc release, không chỉ vẽ một đường thẳng | Chộp đúng target khi `grab`; vệt kéo ngắn tới vị trí sau kéo; trượt thì bàn tay tan, không phát tiếng bắt được | Vút nặng; tiếng siết kim loại ở grab thành công |
| Thiên Bồng (`thienbong`) | Ánh vàng kem bật lên khi shield được cấp | Mảng giáp ánh sáng mỏng, khác ngọc và nước; phản sáng ở hit; thay Bạch Ngọc thì dọn FX ngọc | Âm giáp trầm hơn ngọc, một tiếng đóng giáp; không ngân liên tục 5s |
| Lướt (`dash`) | Bụi ở vị trí xuất phát và bóng actor đang có; không kéo giãn sprite | Vệt sau lưng tan nhanh, bụi nhỏ tại điểm dừng; không giả impact hay bất tử | Một tiếng gió 0,12–0,20s, không chime phép |
| Sinh Mệnh Diệp (`leaf`) | Đốm lá nhỏ ở tay, sáng nhẹ trong startup 0,55s | Chỉ phát vòng hồi phục khi có event `heal`; 4–6 lá bay lên thân, tan 0,35–0,50s | Sột soạt khi dùng, chime êm khi hồi thành công; bị ngắt thì tắt âm/FX đang chuẩn bị |

Rết và bàn tay là FX tách riêng actor, không sửa tạo hình nhân vật. Nếu cung rết chưa đọc ra rết, tạo atlas phần đốt/răng trước; không cố che bằng tia sáng vàng.

## 5. Bộ BNB: hiệu ứng và âm từng chiêu

| Chiêu | Lấy đà / phát | Trúng / kết thúc | Âm đề xuất |
|---|---|---|---|
| Băng nhận (`bnb:atk`) | Dải băng dạng lưỡi sắc đi theo cung chém, khác đạn nguyệt; đúng release của đòn melee | Vụn băng 6–8 mảnh, cạnh xanh sẫm; slow có dấu nhỏ ở chân, không đóng băng toàn thân | Gió lạnh ngắn + tiếng nứt băng khi trúng |
| Lốc băng nhận (`locbangnhan`) | Vòng đỏ rõ trong đủ startup 1,15s; băng nhỏ tụ bên trong nhưng không che viền | `zoneFire`: cột xoáy thấp với 2–3 cung băng, cao vừa đủ đọc chiêu, tan 0,35–0,50s; tâm/radius đúng vùng sim. Không tiếp tục gây sát thương khi còn FX dư | Âm gió tăng nhẹ lúc cảnh báo; bật xoáy lúc zoneFire. Trúng dùng impact băng riêng, trượt vẫn nghe lốc nhưng không tiếng trúng |
| Thủy Tráo (`thuytrao`) | Màng nước ôm thân khi shield thực sự kích hoạt | 2–3 đường cong và gợn tròn; khi đỡ xuất hiện gợn từ contact. Không giống viền ngọc hay giáp vàng | Tiếng nước ôm nhẹ, tiếng nước gợn khi đỡ; không dùng `jadeGuard` làm âm cuối cùng |
| Sương Yêu (`suongyeu`) | Sương trắng xanh nổ nhỏ ở điểm xuất phát khi event `escape`, không phải vụ nổ sát thương | Vệt sương và bóng actor theo đường thoát; lõi nhân vật vẫn thấy; tan 0,35–0,60s. Không impact lên PN hoặc vòng đỏ gây hiểu nhầm | Rạn băng ngắn + luồng gió thoát; không tiếng nổ đòn trúng |
| Lướt (`dash`) | Chung bộ lướt, màu trung tính | Theo vị trí và pha active; khác Sương Yêu về độ dài/chất liệu | Chung tiếng gió, âm lượng thấp hơn Sương Yêu |

Chuyển thể Lốc hiện gây sát thương một lần; FX xoáy còn tồn tại không được gợi ý đây là vùng sát thương kéo dài. Vòng nguy hiểm tắt ngay khi zoneFire/cancel/kết trận.

## 6. Event và anchor: việc phải làm trước khi polish

1. Vòng chính tiếp tục **một lần** `const evs=B.events.splice(0)`; đưa cùng batch vào `SBView.render(evs)` và audio. Audio không được tự `splice` hoặc gọi simulation.
2. Bổ sung schema event (đề xuất, chưa implement): `eid`, `t`, `who`, `source`, `target`, `skill`, `hid`, `kind`, snapshot `origin`, `contact`, và tọa độ trước/sau khi kéo nếu cần. `eid` tăng riêng cho event, `hid` là ID một act/hit đang có; không dùng lẫn hai loại.
3. `act`/`release`/`interrupt`/`zoneCancel` liên kết bằng `hid`; `dmg` ghi nguồn skill/hit và contact lúc trúng. DOT ghi rõ `dot:true` và nguồn effect, không suy ngược từ `actor.act` hiện tại. `projEnd` phân biệt hết tầm với hủy do kết trận; không phát tiếng trúng cho trường hợp hết tầm.
4. `shieldEnd` phải biết shield nào kết thúc; thay shield cần event thay thế hoặc cơ chế view đối chiếu state. Khi trừ HP tới KO, batch vẫn giữ hit/KO cuối; chỉ hủy hiệu ứng nguy hiểm và âm chờ sau đó, không bỏ cả batch.
5. Anchor dự kiến theo clip/frame: `hand`, `body`, `feet`, `weapon_tip`; mirror cùng actor quanh pivot và áp scale chiều sâu. Manifest hiện có `hand` ở một số clip, chưa đủ anchor mỗi frame. Không lấy pixel ngoài cùng làm bàn tay; điểm đó có thể là tóc/nanh/vũ khí.
6. VFX dùng anchor đã duyệt; clip thiếu anchor dùng offset thủ công theo actor/clip có ghi fallback. Hit/contact lấy snapshot simulation. Nếu target di chuyển sau hit, tia impact vẫn ở điểm hit cũ; shield gắn thân có thể tiếp tục theo actor.
7. Hiệu ứng lấy đà gắn `hid`, dừng khi interrupt/KO. Hủy act không xóa FX của act khác. Mọi FX có thời hạn và đường destroy; restart/unmount dọn sạch.

## 7. Âm thanh: triển khai nhẹ và phân biệt rõ

**Đợt đầu:** dùng Web Audio cho bản mẫu. Tái sử dụng `hit`/`blade` như fallback; thêm palette nước, băng, răng cưa, gió và hồi phục bằng noise có filter + oscillator + envelope. Tổng hợp không bảo đảm nghe như vật liệu thật, phải nghe A/B và thay cue chưa đạt sau.

- Tách audio adapter của E (tên dự kiến `js/sandbox/audio.js`), không sửa cách phát của campaign một cách ngầm định. Sandbox cần nạp backend trước adapter; backend mở rộng vẫn giữ API cũ của `SFX`.
- Unlock/resume AudioContext **trực tiếp trong thao tác người dùng**: pointerdown, keydown hoặc nút “Bật âm”. Sandbox tự chạy AI trước thao tác thì giữ im lặng, không phát bù các cue cũ khi vừa unlock.
- Có bật/tắt âm và volume dùng được bằng chạm. Master Gain chung; gain cue có trần. Giới hạn ban đầu tối đa 8 voice, ưu tiên báo chiêu lớn → hit/grab → release → bụi/trang trí. Không tạo AudioContext mới mỗi chiêu.
- Event thời gian trận không phải timestamp AudioContext. One-shot phát khi nhận event còn mới; FX nhìn bám `B.t`. Giữ pitch khi đổi 0,75/0,85/1×; âm lấy đà kéo dài phải theo progress act và hủy bằng handle khi act ngắt.
- Nếu batch catch-up quá dài hoặc quay lại tab sau thời gian ẩn: bỏ cue cũ đã quá hạn (ngưỡng thử 0,15s thực, quy đổi từ tốc độ trận), giữ cảnh báo đang còn hiệu lực. Không phát hàng chục tiếng tồn đọng cùng lúc.
- Không phát đồng thời cả `release` và `shield` thành hai tiếng kích hoạt hộ thể. `release` là tiếng ra chiêu; `dmg` là impact; `heal` là thành công hồi; `escape` là thoát. `zoneFire` là tiếng lốc bật, `dmg` của lốc chỉ thêm lớp hit nếu có.
- Hit được shield giảm sát thương: phối lớp vật liệu shield nhỏ với impact đã giảm, không cộng hai tiếng lớn. DOT không phát impact riêng từng tick; hạn chế một cue nhẹ khi effect bắt đầu.
- Khi mute/ẩn tab/unmount, hủy voice đang ngân; resume không tự replay. Một âm lấy đà bị hủy không được phát tiếng release giả sau đó.
- Đề xuất mono cho bản mẫu, tránh pan khiến tiếng cảnh báo khó nghe qua loa điện thoại. Nhạc nền và ambience để đợt sau, không tranh âm với chiêu.

Nếu dùng file âm sau này: thu/tạo/biên tập offline, đưa vào `assets/audio/battle/`; ghi nguồn và quyền dùng của từng file. WAV làm source, bản runtime chọn định dạng đã thử trên Safari/Chrome; có fallback im lặng khi lỗi tải. Chưa chọn nhà cung cấp hoặc bộ âm cụ thể trong kế hoạch này.

## 8. Hiệu năng và lựa chọn chất lượng

Ngân sách khởi điểm để đo, không phải cam kết FPS: tối đa 80 hạt đang sống và 24 nhóm FX; mobile thấp dùng khoảng 32 hạt/12 nhóm. Tối đa 8 voice audio. Khi đầy, bỏ bụi/đốm trang trí trước, giữ đạn, telegraph và feedback hit chính.

- Pool sprite/hạt; preload atlas và audio một lần. Không tạo texture mới, decode âm hoặc fetch trong render loop. Không cần render video, shader bloom hoặc particle engine lớn.
- Tránh `new PIXI.Graphics` liên tục cho mỗi hạt; atlas nhỏ + sprite pool cho băng/lá/vụn. Geometry đơn giản giữ cho vòng sàn và đường ngắn.
- Thiết lập giảm FX riêng, gồm ít hạt và không flash mạnh; vẫn giữ toàn bộ chỉ dẫn gameplay. Ưu tiên reduced-motion khi người dùng chọn; không dùng nháy sáng toàn màn hình.
- Đo trên máy và điện thoại thật. Nếu nóng hoặc tụt khung hình, giảm độ phân giải render, hạt và filter trước; giữ simulation bước 1/60 giây và luật trúng.

## 9. Lộ trình Orange-kun

| Bước | Bàn giao | Cổng duyệt |
|---|---|---|
| FX-01 | Event schema, anchor/fallback, một dispatcher cho view/audio | Hit có nguồn/contact; không phát lặp, không đổi HP/timing |
| FX-02 | Mẫu Đánh tay + Nguyệt Mang + Băng nhận, thêm mute/volume/unlock | Xem/nghe được startup/release/hit/miss; thử cùng map cũ và nền pixel mẫu nếu đã có |
| FX-03 | Ngọc, nước, giáp vàng, hồi lá; thử đủ PN/BNB | Phân biệt ba hộ thể; ngắt hồi đúng, audio không phát thành công giả |
| FX-04 | Rết, Cường Thủ, Lốc, Sương Yêu, lướt | Telegraph khớp vùng né; rết đọc ra đốt/răng; thoát thân không giả sát thương |
| FX-05 | Viewer FX và trận đầy đủ; chất lượng thấp/cao | Người dùng duyệt video có âm + chơi thật, mobile và desktop |
| FX-06 | Bàn giao registry theo skill/material để mở roster | Chỉ thêm FX cho skill đã map; không gán lửa/băng/chưởng cho mọi actor |

Tên file dự kiến: `js/sandbox/vfx.js`, `js/sandbox/audio.js`, `assets/vfx/battle/manifest.json`, `battle_fx_preview.html`. Đây là đề xuất cấu trúc, chưa có các file/loader này. Có thể giữ phần render trong `view.js` nếu tách module chưa cần thiết; một nơi chịu trách nhiệm lifecycle là điều bắt buộc.

Viewer cần nút thử từng chiêu, chọn “trúng / trượt / bị ngắt / được hộ thể đỡ”, tốc độ trận và chất lượng FX; nút nghe cue chỉ phát âm, không thay HP. Bản xem hình tĩnh không đủ duyệt audio và nhịp.

## 10. Kiểm thử và nghiệm thu

- Trước/sau thay FX chạy cùng seed và cùng chuỗi lệnh: HP, chân nguyên, cooldown, vị trí, thời điểm kết trận như nhau. Visual RNG không dùng chung `B.rng` của AI/gameplay.
- Kiểm tất cả tốc độ 0,75 / 0,85 / 1×, render nhanh/chậm; không thêm hoặc mất event vì FPS. Đạn trượt không phát impact; buff chỉ một tiếng kích hoạt.
- Ngắt hồi máu, hủy zone, thay shield, DOT, projectile hết tầm, KO khi đang ra chiêu, restart nhiều lần: không FX/âm cũ còn chạy; kết quả trận vẫn chốt một lần.
- Mirror actor và đổi z: điểm tay, bóng, zone và contact đúng vị trí, đủ margin ở biên sân. PN đen/BNB trắng vẫn đọc rõ trên map sáng/tối.
- Chrome desktop, Chrome Android, Safari iPhone: unlock sau tap; trước tap không lỗi; mute có tác dụng ngay; đổi tab không phát dồn âm. Lỗi/thiếu audio không làm hỏng trận.
- Theo dõi số hạt/voice qua nhiều trận; không tăng vô hạn, không decode/fetch mỗi frame. Ghi thiết bị và chất lượng khi báo FPS.
- Người dùng duyệt mẫu FX-02 trước khi làm toàn bộ kit; roster chỉ đi tiếp sau FX-05. Không gọi bản tổng hợp âm “đạt” nếu chưa nghe thực tế.

**Bước đầu đề xuất:** Orange-kun hoàn tất review map song song với chốt event/anchor; sau đó dựng ba mẫu FX-02, gửi preview có âm. Chưa cần gen thêm pose hoặc tải model AI nặng để làm bước này.

## 11. Review của Orange-kun (02/10/2026)

Đã đọc kế hoạch và code mẫu FX-02 (`view.js`, `audio.js`, event `dmg` trong `sim.js`); chạy hồi quy và chụp trận trên nền mới.

**Đồng ý:**
- Nhịp lấy đà → phát → trúng / trượt → tan.
- Không rung camera, không hit-stop đợt này.
- DOT không phát tiếng mỗi tick.
- Vòng chính rút event một lần rồi chia cho view và audio.
- Giới hạn 8 voice; unlock âm bằng thao tác người dùng.
- Mẫu FX-02 chạy đúng: tụ sáng Nguyệt Mang, lưỡi trăng pixel sắc hơn, impact theo chất liệu; event `dmg` có `source`, `skill`, `hid`, `contact`. Đã kiểm hồi quy: luật trận không đổi.

**Đã sửa nhỏ:**
- Impact giờ tính độ cao theo độ sâu, trước đây cố định 78px ở mọi z.
- Quay lại tab thì âm tự resume (đã unlock trước đó). Không phát bù cue cũ, vì `consume` bỏ event quá hạn.

**Đề xuất chỉnh kế hoạch:**
1. **Thu nhỏ FX-01 cho sandbox.** Schema đầy đủ (`eid`, snapshot origin cho mọi event, anchor mọi frame, registry) là cho roster. Với PN / BNB hiện đủ dùng: `hid` + `skill` + `source` + `contact`, và anchor ở frame phát đòn (manifest đã có `hand` cho clip phát đòn). Thêm `origin` cho `release` của đạn là đủ. Registry để đến FX-06.
2. **Âm thanh: đổi thứ tự ưu tiên.** Âm tổng hợp bằng Web Audio thường nghe "điện tử", khó đạt nước / băng / răng cưa. Đề xuất thử ngay **bộ âm CC0** (ví dụ các gói impact / RPG sound của Kenney, hoặc file CC0 trên Freesound; **kiểm giấy phép từng file**), cắt ngắn, đặt vào `assets/audio/battle/` có ghi nguồn. Web Audio giữ làm fallback. Cùng API `play(kind)`, chỉ thay nguồn phát.
3. **Hộ thể đang chung một tiếng `jade`** cho Bạch Ngọc, Thiên Bồng và Thủy Tráo; impact khi được đỡ cũng là `jade`. Kế hoạch đã nêu cần phân biệt; khi làm FX-03 nên ưu tiên âm, vì người chơi dựa vào tai để biết đòn bị đỡ.
4. **FX rết và Cường Thủ (FX-04) nên dùng sprite**, không vẽ bằng Graphics. Con rết vàng là asset riêng trong `PROMPT_MUSE_ROSTER.md`. Gen 2–3 khung (cuộn, phóng, cắn) rồi cho chạy theo cung chém; dễ đọc ra "đốt / răng" hơn vẽ tay bằng đa giác.
5. **Pool và ngân sách FX:** hiện mỗi FX tạo một `PIXI.Graphics` mới. Ổn với 2 actor; khi lên roster hoặc lang triều (nhiều địch) mới cần pool. Ghi thành điều kiện chuyển sang pool, không làm ngay.

**Thứ tự đề xuất:** người dùng nghe / xem FX-02 hiện tại → thử 3–4 file CC0 cho đấm, gió, băng, nước → FX-03 (ba hộ thể phân biệt bằng âm và viền) → gen sprite rết → FX-04.

**Cập nhật Orange-kun (cùng ngày, theo người dùng duyệt):**
- `audio.js`:
  - Ba hộ thể có âm riêng: Bạch Ngọc `jade`, Thiên Bồng `gold`, Thủy Tráo `water`. Áp cho cả lúc bật hộ thể lẫn lúc đỡ đòn.
  - Thêm cue `saw` (Cự Xỉ), `grab` (Cường Thủ chộp trúng, phát theo event `grab`; release của grab không kêu), `heavy`, `storm` (Lốc khi `zoneFire`).
  - **Nạp file âm tùy chọn** theo `assets/audio/battle/manifest.json` (xem README cùng thư mục: tên cue cố định, ghi nguồn và giấy phép từng file). Thiếu file thì dùng âm tổng hợp.
  - Sửa thứ tự `start` / `stop` của âm tổng hợp.
- `sim.js`, chỉ thêm dữ liệu event, không đổi luật: `dmg.shield` (id hộ thể đỡ đòn) và `release.origin` cho đạn.
- Prompt sprite `fx_cuxi` (rết vàng) và `fx_cuongthu` (bàn tay sắt) ở mục 4b của `PROMPT_MUSE_ROSTER.md`. Bộ nhập asset hiệu ứng và FX-04 chưa làm.
- Đã kiểm: Chrome bật âm sau thao tác, tối đa 2 voice trong lượt thử, không lỗi; hồi quy đạt. **Chưa nghe duyệt bằng tai.**

## 12. Blue-chan đối chiếu lại cập nhật Orange-kun (02/10/2026)

**Đồng ý giữ:** âm ba hộ thể đã phân biệt cả lúc bật và đỡ, cue rết/chộp/lốc riêng; nguồn file tùy chọn có fallback tổng hợp; `start` trước `stop`; quay lại tab đã unlock có thể resume. Thu nhỏ FX-01 cho sandbox hai actor là hợp lý, registry/schema toàn roster để FX-06. Vẫn cần hid trên các event act/release/interrupt nếu triển khai hủy FX/âm lấy đà theo act; hiện chưa đủ để gọi schema vòng đời hoàn chỉnh.

**Đã sửa một chỗ lệch hình trong lượt review:** Orange-kun đổi impact thành `sy(z)-78*depthK(z)*SCALE`, nhưng đạn nguyệt vẫn vẽ ở `sy(z)-78`. Ở z=240 lệch 14,61 px, ở z=0 lệch 0,62 px. Blue-chan sửa `drawProj()` dùng cùng công thức chiều cao theo độ sâu để đạn và điểm impact không nhảy lúc trúng. Không đổi tọa độ world, vận tốc hoặc kiểm tra va chạm.

**Kiểm thử:** Chrome unlock audio sau thao tác, mute, trần tám voice, voice kết thúc được dọn; chuột/cảm ứng vẫn qua; hồi quy simulation và kiểm tra dữ liệu qua. Chưa nghe duyệt âm trên thiết bị thật; kiểm voice không chứng minh chất lượng chất liệu.

**Phần file âm hiện còn là khả năng nạp, chưa phải bộ âm mới:** thư mục có README nhưng chưa có manifest/file cue, nên runtime đang dùng tổng hợp. Comment đầu `audio.js` minh họa object phẳng chưa khớp loader (`man.cues`); README có schema đúng `{cues, sources}`. Khi đưa file thật vào, normalize âm lượng/cắt khoảng lặng: file hiện dùng gain 0,9, lớn hơn biên độ tổng hợp 0,12–0,35, và chưa có limiter chung. Chưa nên nghiệm thu âm lượng khi tám file phát đồng thời.

Đề xuất bước tiếp giữ như Orange-kun: nghe duyệt mẫu → thử vài file có nguồn/giấy phép rõ → hoàn thiện FX-03 → asset rết/tay và FX-04. Chưa tải bộ CC0 trong lượt review này; đề xuất nguồn của Orange-kun chưa được Blue-chan kiểm chứng từng file.
