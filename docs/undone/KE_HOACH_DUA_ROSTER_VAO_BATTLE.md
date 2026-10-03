# Kế hoạch đưa toàn bộ roster vào battle sandbox

Orange-kun, 03/10/2026. Người dùng chốt: **asset tính sau**, tạm dùng animation cũ (`assets/chibi_kp/<id>`, tạo từ chibi_ref). Mục tiêu là mọi nhân vật đấu được trong `battle_sandbox.html`, có trang preview, và **kit theo đúng cổ trùng nhân vật có trong truyện ở mốc trận đó**.

Asset cũ còn sai truyện ở vài nhân vật (Trần Thúy Hoa da xanh, Phỉ Hầu lông toàn thân, Thạch Hầu hóa đá sẵn...). Đây là chấp nhận tạm thời; khi bộ base/clip mới được duyệt thì chỉ cần thay `sprite` trong registry, không sửa kit.

---

## 0. Nguyên tắc

1. **Boss/đối thủ dùng kit theo mốc trận.** Mỗi boss có một hoặc vài `profile` gắn với chương cụ thể (ví dụ `bnb_q1` ch.134–143, `bnb_q2` ch.374–379). Cổ chưa có ở mốc đó thì không cho vào profile boss. **PN là ngoại lệ:** dựng chiêu từ inventory/save, tu vi, trạng thái, vật phẩm và nhánh hiện tại của người chơi; không áp bộ cổ cứng theo match (chi tiết §3).
2. **Chỉ cổ chủ động thành nút bấm.** Cổ bị động (Liễm Tức, Lưu Ảnh Tồn Thanh, trinh sát, Ngự Hùng/Ngự Khuyển chỉ dùng để điều khiển) không thành chiêu. Thú hoang không có cổ thì dùng đòn bản năng (húc, vồ, cắn).
3. **Cột `src` bắt buộc**: `VN ch.N` cho cổ đọc được trong truyện, `game` cho số liệu và chuyển thể. Số liệu (`startup/cd/cost/dmg`) là game, chốt bằng bench và chơi thử.
4. **Cặp đấu nguyên tác.** Mỗi profile ghi đối thủ thật trong truyện (ví dụ Viêm Đột đấu BNB ở ch.375–379, không phải PN). Preview mở mặc định đúng cặp này; vẫn cho chọn tự do.
5. **PN không có kit cố định.** Preset chỉ dùng thử sandbox khi không nạp save, không áp vào campaign hoặc merge để cấp thêm cổ thiếu. Không cấp/tước cổ vì vào trận; cổ đã mất hoặc tiêu hao khi hợp luyện không còn chiêu tương ứng. Nhánh khác nguyên tác vẫn giữ tài sản người chơi thật. Xem §3 và adapter `pnKitFromSave(S)`.
6. Nhịp theo lớp đòn, giữ các ngoại lệ đã chốt (theo review Blue §9.1.6):
   - Chiêu cổ tầm gần và tầm xa của người chơi: lấy đà ≥0,28s.
   - Đòn lớn của địch: có ô báo ≥0,65s.
   - Ngoại lệ đã chốt: đấm nhẹ của PN 0,12s, hộ thể kiểu Thủy Tráo 0,30s, lướt.
   - Không kéo dài hàng loạt cho khớp quy tắc.
8. **Mỗi cổ trong kit cần đủ** `owner`, `evidence_chapter`, `available_at` (hoặc sự kiện nhận/mất) và câu trích. Thiếu bất kỳ mục nào thì cổ vẫn là ứng viên, không có nút. Cơ chế canon và chuyển thể game ghi riêng; ví dụ Cường Thủ canon là đứng duy trì để đoạt cổ, còn kéo người là chuyển thể của bản demo.
7. Chỉ kiểm trên localhost. Không chạy JS ghi dữ liệu trên site live.

---

## 0b. Trạng thái hiện hành (cập nhật 03/10/2026; các mục §1, §9–13 bên dưới giữ làm lịch sử)

| Hạng mục | Trạng thái |
|---|---|
| A0 baseline trace, A registry/sandbox chọn nhân vật, A2 PN từ save | Xong (§11–12) |
| B1 + C đợt 1 | Xong (§13): 9 profile NPC + 4 preset PN + BNB ch.140; Kim Sinh, gia lão `khong_dau` |
| D | Xong cho đợt 1 (`rush`, `transform`, `regen`, `enrage`, đạn nhiều mũi, `ai.stand`). Còn `zone seal stun charge armorGrow summon petrify`: làm theo đợt 2–4 |
| Cỡ nhân vật | Bản nhỏ 0,74 của Blue đang thử (`?fig=small`). **Chưa có** tỉ lệ tương đối từng nhân vật (`size`) |
| Ô phím PN | Sửa: cổ dư phím vẫn có chiêu (bấm ô), cảnh báo tách "chưa có cơ chế" / "chưa gán phím" |
| Thiếu clip ko/hit | Dự phòng: ko → ngã nghiêng + mờ; trang roster ghi "thiếu clip" |
| AI theo phong cách | **Có 2 kiểu** (03/10): `charge` (Heo: canh thẳng hàng → lao theo đợt → lùi; trọng thương thì bỏ lùi) và `midrange` (Phương Chính: giữ tầm trung, bắn ở ≥120, bật Ngọc Bì trước khi bị áp sát). PN demo và GU_SKILL có tags nên PN do máy điều khiển biết dùng cổ. Đo: `tools/sandbox_style_bench.cjs`, báo cáo `tools/reports/sandbox_ai_style_2026_10_03.jsonl` (Heo đánh tay 6,1→2,4 lần/trận; PC Nguyệt Quang 2,1→6,5). Kiểu khác (brawler/zoner/skirmisher/pack) làm theo đợt |
| Nhân vật thiết kế game | Xong: `huyet_thu_game` (Tam chuyển hút máu; cổ trị liệu làm đòn hút trượt), `tuu_khoi_game` (tái tụ), `huyet_khoi_game` (tái tụ, ngừng khi chảy máu). Hai khôi tạm dùng chung sprite gộp cũ (alias) |
| Khóa chung | `?lock=1` để thử; mặc định vẫn 2s. Bench (`tools/reports/sandbox_lock_2s_vs_1s_2026_10_03.json`): 1s làm lối **bấm dồn** thắng 43% (2s: 7%), lối né không đổi (~35–38%). Chờ người dùng chơi thử chốt |
| Nguyên thạch | Xong: phím 2, +5 chân nguyên/viên trong 2,5s, đi lại được, trúng đòn thì đứt, AI ép sát khi thấy hấp thu, **tối đa 3 viên/trận** (người dùng chốt sau bench `tools/reports/sandbox_nguyen_thach_2026_10_03.md`). Campaign cần trừ lại `S.stones` theo số viên đã dùng khi kết trận (nối ở bước campaign) |
| Luật cảnh (`rules.guDisabled`…) | Chưa: làm khi Hàn Bất Lưu vào battle |
| Asset | Base v04 = ảnh VS + nguồn danh tính; sprite trong trận giữ v01, gen lại bản lỗi (`KE_HOACH_VS_PORTRAIT_VA_SUA_SPRITE.md`) |
| Đợt 2–4 | Chưa: Blue đọc truyện và lập dossier, Orange review |

### Người dùng chốt (03/10/2026, bảng chọn)
| Câu hỏi | Chốt | Việc kéo theo |
|---|---|---|
| `huyet_thu_ma_tu` | Giữ, ghi là **nhân vật game** (sự kiện `r_tukiep`/`d_huyetthu`, `EN.madutam`: ma tu Tam chuyển áo đỏ trong núi Q1); không phải Thương Yến Phi | Blue vẽ base/sprite theo mô tả sự kiện, nhãn art; Orange lập kit game, ghi `src:'game'` |
| Tửu Khôi / Huyết Khôi | **Tách 2 id**: `tuu_khoi` (động Hoa Tửu tầng 4, rối vò rượu vỡ), `huyet_khoi` (lăng mộ Nhất Đại, người máu ngưng từ đáy hang); đều là thiết kế game | Đổi registry/roster; Blue tạo hai base |
| Khóa chung | **Thử 1 giây rồi đo** | Orange bench 2s / 1s, người dùng chơi thử rồi chốt |
| Nguyên thạch trong trận | **Có**: vừa chạy vừa hấp thu được, nhưng **không nhanh** | Orange thiết kế: hồi theo thời gian (không tức thì), tốc độ chậm, tốn nguyên thạch theo `S.stones`, bị đánh thì ngắt phần đang hấp thu; bench để không thành bình thuốc |
| Trận BNB ch.166 | **Có, trận riêng** trong campaign | Blue đọc ch.166 → dossier `bnb_ch166` (Tam chuyển, Băng Trùy); nhánh lệch truyện đọc save để quyết có trận |
| Sprite PN/BNB đang chạy | **Giữ bộ cũ** tới khi bộ mới được duyệt | Không đụng `assets/chibi_kp/phuong_nguyen`, `bach_ngung_bang_nam` |
| Cỡ nhân vật trong trận | **Nhỏ** (0,74) | Mặc định `?fig=small` giữ nguyên |
| Commit | Commit + push main | Orange gom code/test/plan/dossier + sprite tạm chibi_kp; không đưa ảnh preview |

## 1. Hiện trạng kỹ thuật

| Thành phần | Hiện tại | Vướng |
|---|---|---|
| `kits.js` | Chỉ có `pn`, `bnb` | Cần registry cho ~38 id |
| `sim.js` | `create()` mặc định pn và bnb; pha nổ Sương Yêu viết cứng (`sk.suongyeu`, `detonate`) | Cần cơ chế pha boss chung |
| `ai.js` | `smart()` gọi đích danh `thuytrao`, `suongyeu`, `lamdieu`, `locbangnhan` | Cần AI theo **thẻ vai trò** của chiêu |
| `view.js` | Tải sprite theo `kit.sprite`, clip theo danh sách `clip` | Thú bốn chân, kích thước khác nhau, FX theo hệ |
| `battle_sandbox.html` | Chữ kết quả viết cứng tên PN và BNB; độ khó chỉ nhân sát thương của `K.bnb` | Cần chọn nhân vật và chữ chung |
| `assets/chibi_kp` | 38 thư mục; clip: `idle move atk hit ko win` + `guard` (một số) + 1–2 `sk_*` tên cũ | `ba_quy_spirit`, `hien_vien_than_ke` chỉ có `idle/warn`; `phi_tuong` thiếu `hit`; `thiet_huyet_lanh` thiếu `ko` |

---

## 2. Kiến trúc

### 2.1. Registry nhân vật (`js/sandbox/roster.js`)
```js
SB_ROSTER = {
  viem_dot: {
    n: 'Viêm Đột', sprite: 'viem_dot', size: 1.0, body: 'human',
    profiles: {
      q2_bnb: {
        ch: '374-379', vs: 'bnb_q2', tier: 4,
        hp, ess, essRegen, speed,
        atk: {...},
        skills: [...],
        ai: { style: 'zoner' },
        story: {...},
        src: '...'
      }
    }
  }
}
```
- `kits.js` giữ PN và BNB (đổi tên thành profile `pn_q1`, `bnb_q1`), không phá regression hiện có.
- `size` là tỉ lệ hiển thị tương đối theo truyện (Phi Tượng, Hắc Hùng to; Xích Thành thấp bé). Hitbox `body` (human, beast4, beast_big) quyết định độ sâu và tầm.
- Dữ liệu chiêu theo đúng định dạng hiện tại (`kind`, `clip`, `startup`...) cộng thêm `tags` cho AI.

### 2.2. Kiểu chiêu mới cần thêm vào sim
Giữ các kind cũ (`melee proj aoe grab buff empower dash heal escape`). Chỉ thêm kind khi có cổ trong bảng §4 cần đến:

| Kind / status | Dùng cho (nguồn) |
|---|---|
| `zone`: vùng tồn tại vài giây, gây hiệu ứng khi đứng trong | Nhiên Du phủ dầu (ch.377), Ô Thất khói đen (ch.462), Tiêu Lôi Thổ Đậu đặt dưới đất (ch.224) |
| `seal`: khóa chiêu cổ trong N giây, đánh tay vẫn được | Ô Thất phong cấm cổ (ch.462) |
| `stun` / `daze` | Thiên Địa Hoành Âm, tiếng gầm sóng âm (ch.184–186) |
| `charge`: tích lực theo thời gian, đòn kế tiếp tăng sát thương rồi về 0 | Quán Lực (ch.381–382), Thổ Bá Vương làm Bá Lực mạnh dần (ch.444–448) |
| `armorGrow`: giáp tăng dần theo thời gian vận | Áo Giáp Ngà Voi Trắng (ch.381) |
| `summon` / `pet`: thực thể phụ có AI đơn giản | Rắn Lửa 2 con (ch.375–377), dơi máu (ch.186) |
| `transform`: đổi bộ chỉ số, clip, kit theo pha | Mộc Mị hóa thụ tinh (ch.126, 139–141), Huyết Quỷ Thi (ch.195) |
| `petrify` (chậm nặng → choáng) | Điểm Kim biến thành tượng vàng (ch.462–463); trong game là hiệu ứng nặng, không giết ngay |
| `regen` theo thời gian | Tích Hôi (cá sấu dung nham, ch.217) |

`story` chung thay cho code viết cứng của BNB: `phases:[{at:.3, do:'detonate'|'transform'|'retreat', ...}]`. Sương Yêu chuyển sang dạng này, regression cũ phải giữ nguyên kết quả.

### 2.3. AI theo thẻ vai trò
- Mỗi chiêu có `tags`: `poke` (bắn xa), `burst`, `gapclose`, `guard`, `heal`, `control`, `zone`, `summon`, `power` (tăng công), `finisher`.
- `smart()` hiện tại tách thành phần chung: né báo đòn, phạt khi đối thủ cứng đòn, đánh khi đứng yên, giữ khoảng cách, nóng vội sau 6s. Phần chọn chiêu dò theo `tags` thay vì id. Hành vi BNB giữ nguyên nhờ gán tag (Thủy Tráo=`guard`, Lam Điểu=`poke`, Sương Yêu=`power`, Lốc=`control`).
- `ai.style` cho từng profile: `brawler` (lực đạo áp sát: Cự Khai Bi, Hoành Mi, Thiết Bá Tu), `zoner` (Viêm Đột, Thiết Mộ Bạch), `skirmisher` (Thanh Thư, Thiết Nhược Nam), `beast` (lao thẳng, rút khi máu thấp), `pack` (Điện Lang theo bầy, để sau).

### 2.4. View
- **Clip:** danh sách `clip` của từng chiêu chỉ trỏ tới clip có thật. Clip cũ tên chung (`sk_rage`, `sk_drain`...) chỉ là **dáng động tác**, được gán cho cổ có động tác gần nhất, ghi trong registry. Thiếu `guard` thì dùng `idle`; thiếu `hit` hoặc `ko` thì dùng frame cuối của `idle` tô đỏ hoặc mờ dần. Regression báo lỗi nếu chiêu trỏ tới clip không tồn tại.
- **FX theo hệ** vẽ bằng code như nguyệt nhận hiện tại: `fire, ice, metal, blood, thunder, earth, wood, sound, smoke, poison`. Mỗi chiêu khai báo `fx`. Không cần asset mới.
- **Kích thước:** `size` × chiều cao sprite; lề sân theo `reach_px` của manifest (đã có).

### 2.5. Trang sandbox
- URL: `battle_sandbox.html?p=pn_q1&e=bnb_q1`. Thêm 2 ô chọn: **Bạn chơi** và **Đối thủ** (mọi profile). Thêm chế độ **Máy đấu máy** để xem hai profile đấu nhau (ví dụ Thiết Huyết Lãnh đấu Nhất Đại).
- Chữ kết quả, HUD, hướng dẫn phím lấy từ profile. Phím Q W E R D hiển thị theo kit người chơi.
- Độ khó nhân sát thương của bên máy, không viết cứng `K.bnb`.

### 2.6. Trang preview roster (`roster_battle.html`)
- Lưới thẻ nhân vật: sprite idle, tên, mốc chương, cấp chuyển, danh sách cổ (tên, kind, `src`), clip đang mượn.
- Nút **Đấu thử** (mở sandbox với cặp nguyên tác) và **Xem máy đấu máy**.
- Nhãn trạng thái: `kit đã xác minh` / `kit tạm, chờ đọc truyện` / `không đấu` / `chờ người dùng quyết`.

---

## 3. Phương Nguyên và preset

**Người dùng chốt (03/10/2026):**
- **PN trong campaign:** bộ chiêu dựng từ cổ đang sở hữu, tu vi, trạng thái và vật phẩm trong save hiện tại. Không cấp hay tước cổ, không ép preset theo trận. Cổ đã mất hoặc tiêu hao khi hợp luyện thì không còn chiêu. Nhánh chơi khác nguyên tác giữ đúng tài sản người chơi đang có.
- **Boss:** profile cố định theo mốc trận, gồm cổ, tu vi, AI và các pha chuyển trạng thái.
- **Preset PN:** chỉ để thử trong sandbox khi không có save. Không áp vào campaign.

Do đó cần một adapter `pnKitFromSave(S)`: đọc `S.gu`, tu vi, trạng thái và vật phẩm, ánh xạ mỗi cổ chủ động sang một định nghĩa chiêu dùng chung (một bảng `GU_SKILL[guId]`, cùng định dạng với kit). Cổ chưa có định nghĩa chiêu thì không có nút, đồng thời được ghi vào danh sách thiếu. Sandbox có save thì dùng adapter này; không có save thì dùng preset bên dưới.

| Preset | Mốc | Cổ chủ động (đã đọc) | Còn phải đọc |
|---|---|---|---|
| `pn_demo` (legacy) | Không gắn cảnh | Kit hiện tại giữ nguyên dưới nhãn **demo / chuyển thể** để bảo toàn regression. Không gọi là bộ cổ canon | — |
| `pn_q1_<cảnh>` | Một cảnh cụ thể, ví dụ ch.139 đấu BNB | Chỉ cổ đã sở hữu tại cảnh đó: Cường Thủ luyện hóa ch.138, Thiên Bồng có từ ch.155 (sau ch.139), Bạch Ngọc có thể đã bị dùng để hợp luyện | Blue lập theo từng cảnh |
| `pn_q2a` | ch.283 (đấu Âu Dương Công) | Thiên Bồng, Cốt Thương Xoắn Ốc, Thủ Huyết Nguyệt, cỏ Khiêu Khiêu dưới chân (ch.283) | Bản chất từng cổ |
| `pn_q2b` | ch.381–448 (lực đạo: Cự Khai Bi, Hoành Mi, Thiết gia) | Đánh Thẳng (ch.383), Mạnh Mẽ Đâm Tới (ch.444), Tự Lực Cánh Sinh trị liệu (ch.444), hư ảnh thú lực (ch.382–383) | Toàn Lực Ứng Phó thuộc ai ở mốc nào; danh sách đủ |
| `pn_q2c` | ch.474 (đấu Vu Quỷ) | Thú Lực Cuống Rốn (ch.474) | Gần như toàn bộ |

---

## 4. Bảng cổ trùng theo nhân vật (điểm xuất phát)

**✓** = Orange đã đọc đoạn văn xác nhận người đó dùng cổ đó. **?** = chỉ là ứng viên do quét tên gần nhau; phải đọc ngữ cảnh trước khi đưa vào kit. Số chương theo bản Việt. Cột clip là clip cũ đang có để mượn.

### Đợt 1: Q1, cơ chế sẵn có
| id | Mốc / cặp đấu | Cổ / đòn | Clip mượn |
|---|---|---|---|
| heo_rung | ch.2+, thú | Không cổ: húc, nanh | atk, sk_charge |
| thach_hau | ch.79 · PN | Không cổ. Khỉ xám tro, đuôi rất linh hoạt, lật người né giữa không trung; chết mới hóa đá ✓ ch.79 → kit nhảy vồ + né | atk, sk_ambush |
| dien_lang | ch.130–160 · PN | Thú: cắn, vồ; móng điện (art tới khi tìm được câu tả) | atk, roar |
| dian_lang_boss | ch.112–165 · PN | Sói đầu đàn, lôi điện ? ch.112–165 | atk, sk_thunder |
| hac_hung | ch.146–152 | Gấu thường do Hùng gia điều khiển bằng Ngự Hùng ✓ ch.146 → không cổ riêng: vồ, gầm, đè | atk, sk_rage |
| mac_bac | ch.4–82 · PC/PN | Hoàng Lạc Thiên Ngưu ✓ ch.63 (tăng sức chịu đựng, đánh lâu dài → buff); Nguyệt Quang ? (cổ học đường ch.22–25) | atk, sk_drain |
| xich_thanh | ch.4–83 · PN | Long Hoàn Khúc Khúc ✓ ch.62–63 (phòng thủ "người khác không đánh được ta"); Nguyệt Quang ? | atk, sk_nguyet |
| co_kim_sinh | ch.42–56 · PN | ? Hắc Thỉ ch.44 (giai thoại cổ giả, chưa rõ ai là người mua) | atk, sk_drain |
| phuong_chinh | ch.98–106 · PN | Nguyệt Quang ✓ ch.98 và Ngọc Bì ✓ ch.76/98 (đều Nhất chuyển; xem `docs/roster/phuong_chinh.md`); Nguyệt Nghê Thường ? (`data.js` ghi của PC, chưa thấy trong truyện). **Không** gán Toàn Lực Ứng Phó | atk, sk_nguyet, sk_nguyetnghe |
| hoc_duong_gia_lao | ch.4–27 | ? cần tên riêng và cổ | atk, guard, sk_suppress |
| thanh_thu | ch.139–143 · **BNB q1** | Thanh Đằng ✓ ch.104 (cành cây dài mười lăm thước dùng như roi), Tùng Châm ✓ ch.141 (bắn lá thông), Nguyệt Toàn ✓ ch.104, Mộc Mị ✓ ch.126/139–141 (hóa thụ tinh, tăng Thanh Đằng/Tùng Châm → `transform`); Ẩn Lân ? | atk, sk_nguyettoan, sk_tungcham |

### Đợt 2: boss Q1, cần cơ chế mới
| id | Mốc / cặp đấu | Cổ | Clip mượn |
|---|---|---|---|
| thiet_huyet_lanh | ch.184–198 · **Nhất Đại** (máy đấu máy) | Chính Khí ✓ ch.184 (áp lực khí thế, tâm cổ), Thiên Địa Hoành Âm ✓ ch.184/186 (tiếng gầm sóng âm → `stun`), Trấn Ma Thiết Tác + Phù Để Trừu Tân ✓ ch.196 (xích trấn ma → `grab`/trói; rút củi đáy nồi → hút chân nguyên ?) | atk, guard, sk_chain; thiếu ko |
| nhat_dai_boss | ch.186–198 · Thiết Huyết Lãnh | Dơi máu (trăm con ✓ ch.186, `data.js`: Đao Sí Huyết Bức → `summon`), Huyết Quỷ Thi thuộc dòng Phi Cương ✓ ch.195 (`transform`); Huyết Mạc Thiên Hoa ? ch.198, Huyết Cuồng ? | atk, guard, sk_blood |
| thiet_nhuoc_nam | ch.170–192 (Q1) · PN | Kim Châm ? : ch.464 xác nhận người sở hữu nhưng **chưa xác nhận có từ ch.170–192**. Lưu Ảnh Tồn Thanh là trinh sát, không thành nút | atk, sk_command |
| cuong_thi | ch.288–292 | Cương thi tạo bằng Cản Thi ✓ ch.290 (Cương vương nhất mạch) → không cổ riêng: vồ, cắn; độc ? | atk, sk_poison; thiếu win |

### Đợt 3: Q2 thương đội / phương Nam
| id | Mốc / cặp đấu | Cổ | Clip mượn |
|---|---|---|---|
| ca_sau_dung_nham | ch.217–218 · Hiên Viên Thần Kê | ✓ ch.217: Dung Nham Tạc Liệt (nổ dung nham, để lại hố → `aoe`+`zone`), Viêm Trụ (phòng ngự), Tích Hôi (trị liệu → `regen`); cả ba đều Tam chuyển | atk, sk_spit |
| hien_vien_than_ke | ch.217–218 · cá sấu dung nham | Thần gà Hiên Viên giết cá sấu ✓ ch.218. **Chỉ có clip idle/warn** → tạm `không đấu`, hoặc máy đấu máy dùng idle | idle, warn |
| ca_sau_sau_chan | ch.191–213 | ~~Huyết Cuồng ch.191~~ **sai: Huyết Cuồng ở ch.191 là của nhện** (Blue kiểm chéo 03/10). Bối Giáp ? Ngạc Lực ? (ch.212–215: cổ lấy được sau trận, chưa rõ có trên con nào) | atk, sk_rage |
| tran_thuy_hoa | ch.222–224 · bách thú vương / PN | Tiêu Lôi Thổ Đậu ✓ ch.224 (đậu sấm đặt dưới đất → `zone` nổ); có cổ phụ trợ giữ chân nguyên ? ch.224 | atk, cast_ground, sk_poison |
| thiet_dao_kho | ch.229–248 | ? chưa tìm thấy cổ riêng (Cốt Thứ ch.242 là cổ nhặt được) | atk, guard, sk_daokhi, sk_flurry |
| bach_lien / bach_chien_liep / bach_chien_on | ch.233–350 | Bách Liên: Liên Y ✓ ch.350; hai người còn lại ? | atk, sk_* |
| phi_hau | ch.265–286 | Thú; ? | atk, sk_rage |
| phi_tuong | ch.276–286 | Thú, phủ lông chim trắng, ngà dài, bay được ✓ ch.277 → húc, lao từ trên xuống | atk, sk_charge; thiếu hit |
| au_duong_cong | ch.282–283 · **pn_q2a** | Vồ giết PN ✓ ch.283; cổ cụ thể ? | atk, guard, sk_suppress |

### Đợt 4: Q2 lực đạo, Tam Vương, Thiết gia
| id | Mốc / cặp đấu | Cổ | Clip mượn |
|---|---|---|---|
| bach_ngung_bang_nu (profile `bnb_q2`) | ch.374–379 · **Viêm Đột** | Băng Trùy ✓ ch.374–375, Băng Nhận Phong Bạo ✓ ch.377 (vòi rồng băng); Sương Tiễn ?, Băng Tinh ? | atk, guard |
| viem_dot | ch.374–379 · BNB q2 | ✓ Bàn Tay Lửa (Tam chuyển, có 4 con, ch.375/377), Rắn Lửa (Tứ chuyển, điều khiển 2 rắn → `summon`), Nhiên Du (phun dầu phủ sân → `zone`, ch.377); sát chiêu Hỏa Hải Song Giao Sát (ch.377, `finisher`); Đan Hỏa ? | atk, guard, sk_firehand |
| cu_khai_bi | ch.381–385 · **pn_q2b** | ✓ Quán Lực Tứ chuyển (tích lực rồi bạo phát → `charge`), Áo Giáp Ngà Voi Trắng (giáp mọc dần, cứng nhưng chậm → `armorGrow`), Rồng Đi Hổ Bước (lướt kèm tiếng rồng ngâm hổ gầm → `dash`); Khổ Lực ? | atk, guard, sk_power |
| hoanh_mi | ch.415 · pn_q2b | ✓ Bạo Lực (hư ảnh gấu ngựa, cơ thể căng phồng, sức tăng vọt → `empower`) | atk, guard, sk_rage |
| tiet_tam_tu | ch.417–439 | ? | atk, guard, sk_dive |
| han_bat_luu | ch.425–427 | ✓ ch.426: trong phúc địa truyền thừa **cổ không vận dụng được**. Đây là luật của trận (`rules.guDisabled`), không xóa cổ khỏi hồ sơ; Blue kiểm phạm vi cấm. Bầy chó hoang (ch.425) cần xác định ai điều khiển | atk, sk_command |
| thiet_ba_tu | ch.444–448 · pn_q2b | ✓ Bá Lực (đâm húc), Thổ Bá Vương ngũ chuyển (hút sức từ đất, Bá Lực mạnh dần → `charge` thụ động khi đứng trên đất) | atk, guard, sk_regen |
| thiet_mo_bach | ch.462–464 · Vu Quỷ/Khô Ma (máy đấu máy) | ✓ Điểm Kim ngũ chuyển (bắn trúng hóa tượng vàng → `petrify`), Kim Thang ngũ chuyển (ch.463), Kim Châm dạng mưa tơ mảnh (ch.464); Kim Cương Trừng Mắt ? ch.471 (cổ công kích bằng ánh mắt, chưa rõ chủ) | atk, guard, sk_kimquang |
| vu_quy | ch.462–474 · Thiết Mộ Bạch / pn_q2c | ✓ Ô Thất (khói đen, phong cấm cổ từ lục chuyển trở xuống → `zone`+`seal`, ch.462); Kim Phong Tống Sảng ? (gió lốc vàng trị liệu, ch.462, chưa rõ phe) | atk, guard, sk_cloudhand |

### Không đấu hoặc chờ quyết
| id | Lý do |
|---|---|
| ba_quy_spirit | Địa linh, NPC (ch.468–478); chỉ có clip idle/warn |
| huyet_thu_ma_tu | Ứng viên: Huyết Thủ Ấn là của **Thương Yến Phi** ✓ ch.318, gia chủ Ngũ chuyển, không phải "ma tu". Người dùng chọn: dùng Thương Yến Phi, đổi tên, hay bỏ |
| tuu_khoi_huyet_khoi | `data.js` có hai địch riêng (Tửu Khôi thủ động, Huyết khôi). Người dùng chọn tách hai id hay bỏ |

---

## 5. Chỉ số theo cấp (game)

- `tier` = chuyển số ở mốc trận. Khí huyết, chân nguyên, sát thương theo bảng hệ số tier (đặt trong `roster.js`, một chỗ để chỉnh).
- Chân nguyên hồi ≈0 trong trận (đã chốt CN-1 cho người; thú dùng thể lực, không có chân nguyên).
- Cổ cao chuyển thì đắt và hồi chiêu lâu. Sát chiêu (Hỏa Hải Song Giao Sát...) có `uses:1` hoặc cần đủ điều kiện (cả 4 Bàn Tay Lửa + 2 Rắn Lửa).
- Trận chênh cấp nhiều (Ngũ chuyển với PN Nhị chuyển) chỉ để ở chế độ máy đấu máy, hoặc dùng preset PN đúng mốc. Không cân bằng giả để PN thắng.

---

## 6. Phân việc và thứ tự

| Bước | Việc | Ai | Xong khi |
|---|---|---|---|
| A0 | Chụp baseline PN/BNB: seed cố định, trace action/pha/HP/ess, ghi hash code | Orange | File baseline trong `tools/reports/` |
| A | Resolve profile bên ngoài, giữ `SB_KITS.pn/bnb` làm mặc định; slot actor tách khỏi profile id (cho đấu gương); `story.phases` có id và chỉ kích hoạt một lần; AI BNB giữ policy cũ qua adapter; sandbox chọn nhân vật; HUD và kết quả lấy chữ từ profile | Orange | Regression cũ đạt; trace trùng baseline khi cùng seed; bench chỉ là cảnh báo phụ |
| A2 | `GU_SKILL` + `pnKitFromSave(S)` (§3) | Orange | Test: save có hoặc thiếu cổ, cổ đã hợp luyện, cổ chưa có định nghĩa |
| B1 | Dossier kit đợt 1: đọc chương, trích câu, điền mục "Kit battle đề xuất" trong `docs/roster/<id>.md` | Blue-chan | Mỗi cổ có trích dẫn |
| B2 | Validate dossier đợt 1 | Orange | Bỏ ứng viên sai, ghi chỗ cần người dùng quyết |
| C | Nhập kit đợt 1 vào `roster.js`, gán clip + FX, trang `roster_battle.html` | Orange | Mọi profile đợt 1 đấu được |
| D | Kind mới (`zone seal stun charge armorGrow summon transform petrify regen`), có test riêng | Orange | Mỗi kind có ≥1 test |
| E | Lặp B → C cho đợt 2, 3, 4 | Blue → Orange | |
| F | Bench máy đấu máy cho từng cặp nguyên tác; ghi tỉ lệ thắng, độ dài trận, số lần hết giờ | Orange | Báo cáo trong `tools/reports/` |

Mặc định theo phân vai hiện tại: blue-chan tạo dữ liệu/dossier, Orange validate và viết engine. Nếu người dùng muốn Orange tự đọc truyện điền kit thì đổi cột "Ai" ở bước B.

## 7. Kiểm tự động

- `tools/sandbox_regression.cjs`: thêm vòng lặp mọi profile, kiểm:
  - mỗi chiêu ra đòn được;
  - clip tồn tại trong manifest;
  - không NaN, không kẹt trạng thái;
  - 50 trận máy đấu máy kết thúc trong 120s, hoặc hết giờ được ghi rõ.
- `tools/sandbox_bench.cjs`: thêm đối số `p=` `e=` theo id profile.
- Kiểm `src`: mọi chiêu không phải `game` phải có `VN ch.` và chương đó nằm trong khoảng `ch` của profile (trừ cổ đã có từ trước).
- Chrome localhost: mở sandbox với từng cặp nguyên tác, chụp màn hình ở desktop và mobile.

## 8. Câu hỏi cho người dùng

1. `huyet_thu_ma_tu`: dùng Thương Yến Phi (Huyết Thủ Ấn, ch.318) hay bỏ?
2. `tuu_khoi_huyet_khoi`: tách thành Tửu Khôi và Huyết Khôi theo `data.js`, hay bỏ?
3. Trận chênh cấp (Thiết Mộ Bạch, Vu Quỷ, Thiết Huyết Lãnh với Nhất Đại): chỉ cho xem máy đấu máy, hay cho chơi được?
4. Bước B do blue-chan đọc truyện (mặc định) hay Orange đọc luôn?

## 9. Review Blue-chan — 03/10/2026

**Đồng ý hướng kiến trúc:** registry độc lập với hình, profile boss theo cảnh, mượn clip cũ có ghi chú, AI dùng vai trò chiêu, preview chọn cặp đấu và triển khai theo đợt. Chưa sửa engine/kit trong lượt review này. Đã đọc plan, `kits.js`, `sim.js`, `ai.js`, `input.js`, dossier PN/PC và bảng đồng thuận. Đây là review kỹ thuật và tính nhất quán; **chưa xác minh lại toàn bộ cổ/chương trong bảng §4**. Dấu ✓ của Orange không tự chuyển thành kết quả Blue đã kiểm.

### 9.1. Các điểm phải sửa trước khi đưa dữ liệu vào game

1. **PN: tách demo và inventory thật.** §3 `pn_q1` ch.100–166 không thể gọi toàn bộ kit hiện tại là một bộ cổ canon cho cả khoảng. Cường Thủ được PN luyện hóa ch.138, Thiên Bồng có tại ch.155; Bạch Ngọc có thể đã tiêu hao để hợp luyện. Nguồn Cự Xỉ hiện dẫn ch.186–188, ngoài khoảng ghi cho preset: cần nguồn sở hữu tại cảnh cụ thể, không suy từ việc dùng ở chương sau. Giữ kit PN hiện tại dưới nhãn **legacy demo / chuyển thể**, bảo toàn regression. Preset canon phải có cảnh/chương rõ, không dùng một khoảng dài gom tất cả. Campaign vẫn dựng từ `S.gu`/save và nhánh; không whitelist, cấp hoặc tước cổ theo preset. Dossier PN đã ghi ràng buộc này.

2. **Người sở hữu và thời điểm là hai phép kiểm khác nhau.** Kim Châm được nhắc ch.464 không đủ để cấp cho Nhược Nam tại ch.170–192. Cổ lấy ra sau khi thú chết cũng không tự chứng minh con thú nào đã dùng nó. Mỗi mục cần `owner`, `evidence_chapter`, `available_at` hoặc sự kiện nhận/mất và ngữ cảnh. Nếu chưa đủ thì giữ trạng thái ứng viên, không đưa vào `skills` khả dụng. Cùng nguyên tắc này áp dụng cho mọi dấu ?.

3. **Phương Chính đã có nguồn đọc, không cần quét lại từ đầu.** `docs/roster/phuong_chinh.md` có review Orange xác nhận ch.98 sở hữu Nguyệt Quang và Ngọc Bì, PC nhị chuyển nhưng hai cổ nhất chuyển; ch.76 xác nhận dùng Ngọc Bì. Hai mục này có thể chuyển từ ? sang đã xác minh *ở cảnh phù hợp*. Không chuyển Nguyệt Nghê Thường thành đã xác minh hoặc lấy cổ trong bí phương tương lai.

4. **Cơ chế theo truyện và cơ chế demo phải ghi riêng.** Cường Thủ canon là đứng duy trì đoạt cổ; `grab` kéo người/bàn tay sắt hiện tại là chuyển thể game, không được giữ nguyên rồi ghi “kit theo đúng truyện”. Có thể bảo toàn nó ở legacy demo; profile canon cần thiết kế channel/đoạt cổ trước khi bật chiêu. Tương tự không gán độc/Đao Khí chỉ vì tên clip cũ có chữ đó.

5. **Ngoại lệ cảnh là luật trận.** Trận Hàn Bất Lưu trong truyền thừa phải dùng `rules.guDisabled` (sau khi Blue kiểm nguồn), không xóa cổ khỏi hồ sơ nhân vật. Phân biệt cổ trùng với vật phẩm/đòn tay, quy định rõ gì bị phong cấm. Ngự Khuyển/Ngự Hùng có thể không là nút phép trực tiếp, nhưng nếu trận có bầy thú thì registry vẫn phải ghi thực thể và quyền điều khiển; không loại năng lực chiến đấu chỉ vì xếp nó vào trinh sát/điều khiển. Thú có cổ ký sinh đã xác minh không được mặc định coi mọi chiêu là thể lực không phí.

6. **Nhịp startup trong §0 cần ghi ngoại lệ đã chốt.** `kits.js` hiện PN đánh tay có startup 0,12s, BNB Thủy Tráo 0,30s, dash rất nhanh. Luật ≥0,28s / báo địch ≥0,65s không áp cho tất cả chiêu. Áp theo lớp đòn và mức phản ứng; giữ ngoại lệ đấm nhẹ/di chuyển/hộ thể đã duyệt. Không kéo dài hàng loạt chỉ để khớp câu trong plan.

### 9.2. Hợp đồng kỹ thuật để Orange triển khai

- **Giữ tên/API legacy:** không đổi ngay `SB_KITS.pn/bnb` thành tên profile mới khiến test/adapter mất tương thích. Thêm bộ resolve profile bên ngoài hoặc alias; default vẫn dựng đúng hai kit cũ. Unknown profile báo lỗi hoặc fallback ở UI có thông báo, không âm thầm dùng kit PN/BNB. `sim.create()` hiện đã có `opt.ids` và `opt.arena`; phần cần tách nhiều nhất là AI/HUD/view, không phải viết lại sim từ đầu.
- **Actor khác profile:** dùng hai slot actor riêng dù người chơi và đối thủ chọn cùng profile. `sim.create()` hiện cấm hai actor cùng id; registry không được dùng profile id làm khóa actor duy nhất. Đây là điều kiện cần cho đấu gương và bench cùng nhân vật.
- **Tags chưa đủ giữ BNB như cũ:** cần giữ thứ tự ưu tiên, điều kiện dùng, khoảng cách, thời gian phản ứng, né thông tin công khai, hủy startup, lùi sau đòn và nóng vội. Tag chỉ mô tả vai trò. Giai đoạn đầu giữ policy BNB hiện có, đưa lựa chọn chiêu qua adapter; AI chung cho roster thử sau. Không tuyên bố “gán tag là hành vi giống hệt”.
- **Pha boss phải có id và chỉ kích hoạt một lần:** lưu `phaseFired`, quy tắc hủy action/lệnh chờ, miễn kéo/ngắt, hồi/hao nguyên, khóa chiêu và kết trận. Giữ thứ tự event của cảnh nổ tay đã được regression kiểm. Transform đổi clip/skill khả dụng nhưng không vô tình hồi đầy HP/ess hoặc xóa CD/uses. Summon cần id thực thể riêng, chủ sở hữu, thời gian sống, giới hạn số lượng và dọn sạch khi kết trận.
- **Tài nguyên/cổ:** `tier` của cổ sư khác `guRank`. Bảng tier chỉ là điểm khởi đầu số liệu game, không tự cấp cổ hoặc giả định phí chỉ dựa rank. Giữ kiểm phí tại `fire()`, upkeep, một action và khóa chung 2s đúng luật đã chốt; ứng viên chưa xác minh không có nút.
- **Clip fallback có thứ tự:** validator kiểm ít nhất một clip fallback tồn tại; UI ghi clip thực resolve và clip riêng còn thiếu. Không vừa cho fallback rồi báo lỗi vì clip ưu tiên chưa có. Thiếu KO/hit là trạng thái hình tạm, không đồng nghĩa nhân vật bất tử hoặc không bị ngắt. Khi nhận bản clip mới chỉ đổi mapping/asset.

### 9.3. Mốc nghiệm thu trước khi mở rộng

1. Chụp baseline PN/BNB từ phiên bản hiện hành bằng bộ seed cố định: cấu hình sân, độ khó, kit và hash code được ghi. Regression cũ phải đạt; so thêm trace action/pha/HP/ess với cùng input và seed khi chỉ refactor. Bench ±3 **điểm phần trăm** là cảnh báo phụ, không đủ chứng minh không đổi hành vi.
2. Thử registry bằng cặp legacy, đổi bên chơi, hai bên cùng profile và máy đấu máy. Test actor không phải PN/BNB, URL sai, kit thiếu clip, phím không trùng, restart không giữ event/âm/lệnh cũ. BNB giữ các test nổ tay/hết nguyên/vỏ băng/kết quả trận trước khi thêm kind mới.
3. Nhập mỗi profile đã có dossier được validate; thẻ chưa đủ dữ liệu chỉ hiện “chờ xác minh”, không dựng kit giả để đạt mục tiêu “mọi người đấu được”. Bench ghi thắng/thua/hòa/hết giờ; không bắt mọi cặp chênh cấp có tỷ lệ cân bằng.
4. Với từng kind mới kiểm các hành vi thật: vùng hết hạn/thoát vùng, seal không cấm đánh tay, summon chết/dọn khi kết trận, transform một lần, tài nguyên không âm. Không chỉ test có event hoặc chiêu chạy mà không kiểm hiệu lực.

### 9.4. Đề xuất trả lời bốn câu hỏi — chưa thay quyết định người dùng

| Câu hỏi | Blue đề xuất |
|---|---|
| `huyet_thu_ma_tu` | Giữ ID cũ ở trạng thái chờ, không tự biến thành Thương Yến Phi. Nếu người dùng chọn thêm ông ta thì tạo ID riêng `thuong_yen_phi`, hồ sơ/cảnh riêng và đánh dấu ID cũ deprecated sau khi kiểm references. Không gán danh tính/cổ chỉ vì tên chiêu giống. |
| `tuu_khoi_huyet_khoi` | Tách Tửu Khôi/Huyết Khôi sau khi xác minh từng biến thể và được người dùng chốt; không tạo hai kit mới chỉ dựa `data.js`. Hiện vẫn chờ, chưa xóa ID/asset. |
| Trận chênh cấp lớn | Mặc định máy đấu máy theo cặp/mốc truyện; sandbox có thể cho điều khiển bên bất kỳ để thử. Giữ chênh sức mạnh, ghi đây là thử tự do; campaign vẫn theo inventory và luật cảnh. Việc cho chọn không đòi sửa chỉ số để PN thắng. |
| Ai đọc truyện | Giữ phân vai Blue đọc/dossier, Orange validate/engine để có hai lượt kiểm độc lập. Orange có thể bổ sung đoạn đã đọc; Blue đối chiếu lại trước khi đóng hồ sơ. Không cần đổi phân vai để bắt đầu refactor legacy. |

**Thứ tự đề nghị:** sửa các điều trên trong plan → Orange refactor legacy có baseline → Blue hoàn thiện hồ sơ đợt 1 và PN theo cảnh → Orange validate rồi nhập profile đủ nguồn. Không chờ hai ID chưa chốt mới làm được phần kiến trúc, cũng không triển khai tất cả kind mới cùng một lượt.

## 10. Orange trả lời review Blue (03/10/2026)

Đồng ý cả 6 điểm ở §9.1 và hợp đồng kỹ thuật ở §9.2–9.3. Các mục trong plan đã sửa:
- **§0.6:** nhịp theo lớp đòn, giữ các ngoại lệ đã chốt.
- **§0.8:** mỗi cổ cần `owner`, `evidence_chapter`, `available_at` và câu trích; cơ chế canon và chuyển thể game ghi riêng.
- **§3:** ghi quyết định của người dùng về PN, boss và preset; thêm adapter `pnKitFromSave`. Kit PN hiện tại thành `pn_demo` (legacy).
- **§4:**
  - Phương Chính: Nguyệt Quang và Ngọc Bì chuyển thành ✓ theo dossier.
  - Kim Châm của Thiết Nhược Nam về lại ứng viên, vì ch.464 chưa chứng minh nàng đã có cổ này ở ch.170–192.
  - Hàn Bất Lưu dùng `rules.guDisabled`.
- **§6:** thêm bước A0 (baseline có trace) và A2 (bộ chiêu PN từ save). Bước A giữ tên kit cũ, tách slot actor khỏi profile id, AI BNB đi qua adapter.

Lưu ý thêm: dấu ✓ trong §4 nghĩa là Orange đã đọc đoạn văn về **người dùng cổ**. Thời điểm có cổ (`available_at`) vẫn để Blue kiểm theo §0.8; chưa đủ thì cổ chưa có nút.

Câu hỏi 3–4 ở §8: người dùng chưa trả lời, tạm theo đề xuất của Blue. Trận chênh cấp mặc định là máy đấu máy nhưng vẫn cho người chơi điều khiển để thử; Blue đọc truyện, Orange validate. Bắt đầu được bước A0/A ngay, không phải chờ hai ID còn mở.

## 11. Orange — đã làm bước A0 + A (03/10/2026), bàn giao cho Blue

Người dùng: "làm phần bạn đi rồi note lại cho blue". Chưa commit/push.

### Đã làm
| Việc | File | Kiểm |
|---|---|---|
| A0 baseline trace: 45 trận PN/BNB, seed cố định (3 độ khó × 2 sân × 2 AI). Hash từng trận: chuỗi sự kiện + HP/chân nguyên/vị trí mỗi 0,5s | `tools/sandbox_trace.cjs`, `tools/reports/sandbox_trace_baseline.json` | `node tools/sandbox_trace.cjs` → 45/45 trùng **sau toàn bộ refactor** |
| Registry hình: kit chỉ ghi visual id; thư mục do bộ hình quyết định | `js/sandbox/sprites.js` (mới) | test đổi bộ hình |
| Registry roster: 40 id có trạng thái; profile theo mốc trận; `resolve()` báo lỗi khi profile sai; `matchup()` đặt hai slot `p1`/`p2` nên đấu gương được | `js/sandbox/roster.js` (mới) | test |
| Sim: pha boss chung `story.phases` có id và `phaseFired` (kit BNB cũ tự đổi `detonateAt` thành pha `suongyeu_blast`; giữ cờ `detonated` cho test cũ). Kind mới `rush` (lao húc khóa hướng, làn công khai như đạn, trúng một lần, đẩy lùi, trượt có sự kiện `miss`) | `js/sandbox/sim.js` | trace 45/45; test rush, test pha một lần |
| AI: chiêu có `tags` đi qua `tagged()`. Kit BNB không có tags nên policy cũ giữ nguyên (trace trùng). Sửa lỗi crash với kit không có `dash` | `js/sandbox/ai.js` | đấu gương mọi profile |
| Sandbox: `?p=&e=&mode=play|auto`, ô chọn Bạn chơi / Đối thủ / Máy đấu máy; tiêu đề, kết quả, dòng gợi ý và tên trận lấy từ profile; độ khó nhân sát thương bên máy; profile sai → cảnh báo và quay về mặc định | `battle_sandbox.html`, `js/sandbox/hud.js` | Chrome localhost: 6 URL không lỗi JS (3 file 404 `assets/battle_fx/fx_*` là lỗi có từ trước) |
| Trang preview: thẻ 40 nhân vật, ảnh idle theo bộ hình đang chọn, trạng thái, phần đã đọc, kit và `src`, nút Đấu thử / Máy đấu máy / Chơi nhân vật này | `roster_battle.html` (mới) | desktop + mobile 390px không tràn ngang |
| Profile đầu tiên ngoài PN/BNB: `heo_rung_q1` theo dossier G1 (ch.70–71, 80): Hất nanh + Lao húc, không cổ, không chân nguyên | `roster.js` | đấu gương, rush test |
| Regression: mọi profile có `src`, có clip thật hoặc idle, đấu gương 5 trận không NaN; đổi bộ hình không đổi kit | `tools/sandbox_regression.cjs` | đạt |

**Hai chỗ sửa nhỏ trong file Blue đang có thay đổi chưa commit:**
- `js/kp_sprite.js`: regex `reviewDir` cho phép thêm `assets/...`.
- `js/sandbox/view.js`: dòng load dùng `a.kit.spriteDir||a.kit.spriteReviewDir`.

Phần offset/anchor của Blue giữ nguyên.

### Thay bộ hình pilot vào (khi đã import)
1. `keypose_import_v2.py` xuất vào **vùng review** (`previews/...`) trước. Chỉ sau khi người dùng duyệt mới chép sang `assets/chibi_v2/<id>/` (theo guard của importer, review Blue 03/10). Chỉnh `sets.pilot_v1.dir` nếu dùng thư mục khác.
2. Thay dần từng con: `SB_SPRITES.use.<id>='pilot_v1'`. Thay cả bộ: `SB_SPRITES.active='pilot_v1'`.
3. Clip thiếu tự rơi về idle; tên clip mới khác cũ thì chỉ thêm tên vào danh sách `clip` của chiêu (giữ cả tên cũ để fallback). Không phải sửa kit hay sim.
4. Chạy `node tools/sandbox_regression.cjs`: test kiểm manifest của bộ đang chọn.

### Blue làm tiếp (bước B1, theo §0.8 và §9.1)
- Dossier đợt 1 cho các nhân vật còn lại, mỗi chiêu có `owner / evidence_chapter / available_at` và câu trích. Ưu tiên: Thạch Hầu (không cổ, gần giống heo), Phương Chính ch.98, Mạc Bắc, Xích Thành, Thanh Thư.
- Thêm preset PN theo cảnh (ví dụ ch.70 đấu lợn rừng, ch.139 đấu BNB) bằng cổ PN đã sở hữu tại cảnh đó. Đây chỉ là preset sandbox; campaign dựng từ save (bước A2, Orange).
- Khi dossier được validate, Orange nhập profile. Kind mới (`zone seal stun charge armorGrow summon transform petrify regen`) làm theo từng đợt cần đến (bước D), mỗi kind có test hiệu lực riêng.

### Còn mở phía Orange
- A2: `GU_SKILL` + `pnKitFromSave(S)`.
- Thiếu clip `ko`/`hit` hiện rơi về idle; chưa làm mờ dần thay cho KO.
- `size` theo truyện chưa áp vào view: các sprite cũ đã được chuẩn hóa kích thước lúc import.

## 12. Orange — bước A2: bộ chiêu PN dựng từ save (03/10/2026)

Đã làm theo quyết định của người dùng ở §3. Chưa commit/push.

| Việc | File |
|---|---|
| `GU_SKILL[k](G)`: định nghĩa chiêu cho từng cổ chủ động trong `GU` của `js/data.js`. Bốn cổ đã có trong kit demo (Nguyệt Mang, Bạch Ngọc, Cứ Xỉ, Thiên Bồng) và lá Sinh Cơ dùng nguyên bản. Thêm chiêu cho: Nguyệt Quang, Nguyệt Ngân, Huyết Nguyệt, Nguyệt Toàn, Toàn Phong, Băng Đao, Ngọc Bì, Đồng Bì, Thiết Bì, Cương Nham, Thủy Tráo, Nguyệt Nghê Thường, Trị Liệu | `js/sandbox/gu_skills.js` (mới) |
| `pnKitFromSave(S,{GU,maxHp,maxEss})`: chỉ cổ trong `S.gu` mới thành nút. Cổ đã hợp luyện hoặc tiêu hao (không còn trong `S.gu`) không có nút. Bị động (`atk`, `moonAtk`) cộng vào đòn. Lá Sinh Cơ theo `S.herbs`. Chấn thương tay giảm đánh tay. Máu/chân nguyên lúc vào trận lấy từ `S.hp`/`S.ess` (`kit.start`). Cổ chưa có chiêu hoặc dư ô phím → `missing` kèm lý do | như trên |
| Sim: `kit.start` (máu/chân nguyên ban đầu); chiêu vùng áp `slow` nếu khai báo (Lốc của BNB không có `slow` nên trace không đổi) | `js/sandbox/sim.js` |
| Sandbox: có save `tms2-save` trên máy thì hiện lựa chọn "Phương Nguyên (từ save: …)". **Chỉ đọc**, không ghi. Cổ thiếu chiêu hiện thành cảnh báo trên đầu trang | `battle_sandbox.html` (nạp thêm `js/data.js`, `gu_skills.js`) |
| `SB_ROSTER.dress(kit,char,pid)` gắn hình cho kit dựng từ save; `matchup()` nhận profile id hoặc kit | `js/sandbox/roster.js` |
| Test: hợp luyện mất nút, hết lá, bị động, chấn thương, phím không trùng, thiếu `env.GU` báo lỗi, trận máy đấu máy với kit đầy không NaN | `tools/sandbox_regression.cjs` |

Kiểm: regression đạt; trace 45/45 trùng baseline; Chrome headless với save giả (profile tạm, không đụng save thật) hiện đúng 4 nút + lá + lướt, máu 160/220, và cảnh báo Cường Thủ.

**Số liệu (game):** sát thương = `GU.dmg` × 0,58, hệ số rút từ hai cổ đã chỉnh (Nguyệt Mang 36→21, Cứ Xỉ 58→34). Phí = `GU.cost` × 0,75. Hộ thể: `red` = 1 − tỉ lệ "chỉ nhận X%". Máu và chân nguyên tối đa dùng công thức `maxHp`/`maxEss` của engine. Trong `battle_sandbox.html` có bản chép của hai công thức này (ghi chú tại chỗ); sửa engine thì sửa cả đó. Campaign gọi `pnKitFromSave(S,{GU,maxHp,maxEss})` trực tiếp.

**Chưa có chiêu (ghi trong `PENDING`):**
- Cường Thủ: canon là đứng vận để đoạt cổ (§9.1.4), cần thiết kế channel.
- Đao Sí Huyết Bức: cần summon và hút máu.
- Mộc Mị: cần transform.
- Hỏa Lô: cần phản sát thương.
- Thanh Ti: hộ thể kèm hồi máu.
- Âm Dương Chuyển Thân: cổ cốt truyện.

**Blue kiểm giúp:**
- Mỗi `src` hiện ghi "data.js GU.k + số liệu game". Đối chiếu chương để thêm `VN ch.N` cho cơ chế (tầm Nguyệt Quang 10 m và Nguyệt Ngân 20 m, Nguyệt Toàn bay vòng cung, Toàn Phong làm chậm). Ghi lại chỗ nào `data.js` lệch truyện.
- Nguyệt Nghê Thường và Băng Đao: `data.js` ghi là cổ của Phương Chính / BNB. PN chỉ có nút khi save có cổ đó, nên không cần chặn; nếu truyện nói cổ này không chuyển chủ được thì báo Orange.

## 13. Orange — B1 + C + D cho đợt 1 (03/10/2026)

Người dùng: "làm thay cho Bluechan B1 rồi làm tiếp CD luôn". Chưa commit/push.

### B1: đã đọc truyện (bản Việt, cache ch.1–480)
Dossier: mục "Kit battle (Orange đọc thay Blue)" trong `docs/roster/<id>.md`. Mỗi cổ/đòn có owner, chương chứng minh, thời điểm có và trích ngắn.

| id | Kết luận | Cặp nguyên tác |
|---|---|---|
| thach_hau | Không cổ: phóng vồ từ hốc đá, đuôi lật người né đạn (ch.79); sống thành bầy, đuổi một đoạn rồi về (ch.80) | PN ch.79 |
| dien_lang | Không cổ: nhào cắn, rất nhanh, khứu giác kém (ch.127, 130). **Điện lang thường không phóng điện**; phóng điện là Hào Điện Lang (ch.132–134), chưa có id | PN ch.130 |
| dian_lang_boss | Cắn, giáp lôi điện, đuôi phun điện tương, cổ trị liệu ký sinh, tru lên tăng tốc gấp bội, Điện Nhãn (ch.127, 163–164) | tộc trưởng + gia lão (không phải PN) |
| hac_hung | Gấu thường bị Ngự Hùng điều khiển (ch.146, 151); vả, lao | đàn điện lang (ch.146) |
| mac_bac | Nguyệt Quang + Hoàng Lạc Thiên Ngưu (sức bền), Nhất chuyển, tư chất Ất | thua PC (ch.83) |
| xich_thanh | Nguyệt Quang + Long Hoàn Khúc Khúc (nhảy lui mười thước, tốn chân nguyên); tư chất thật Bính | thua PC (ch.83) |
| phuong_chinh | Nguyệt Quang, Ngọc Bì, lộn người; Nhị chuyển; đánh tầm sáu thước | thắng MB/XT, thua PN (ch.83–84) |
| thanh_thu | Thanh Đằng, Tùng Châm, Nguyệt Toàn, Mộc Mị, Sinh Cơ Diệp (ch.104, 126, 139–142) | BNB sau nổ tay (ch.140–142) |
| co_kim_sinh | `khong_dau`: bị PN ám sát bằng hai nguyệt nhận (ch.46), không giao chiến | — |
| hoc_duong_gia_lao | `khong_dau`: Tam chuyển dạy Nguyệt Quang (ch.22), không giao chiến; boss `EN.gialao` là thiết kế game | — |

**Phát hiện phụ:**
- **BNB Q1 có Băng Trùy:** ch.141, năm mũi khoan băng sau khi nổ tay. Kit `bnb_q1` từng bỏ chiêu này vì thiếu nguồn; nay thêm vào profile mới `bnb_q1_ch140` (mất Sương Yêu, cụt tay, còn Lam Điểu (ch.140), Thủy Tráo, Lốc).
- **Preset PN theo cảnh** (`pn_ch70/79/84/130`) dựng bằng save giả qua cùng adapter với campaign. Chi tiết ở `docs/roster/phuong_nguyen.md`.

### C: đã nhập 13 profile vào `js/sandbox/roster.js`
- Gồm: `thach_hau_q1`, `dien_lang_q1`, `dian_lang_boss_q1`, `hac_hung_q1`, `mac_bac_ch83`, `xich_thanh_ch83`, `phuong_chinh_ch83`, `thanh_thu_ch141`, `bnb_q1_ch140` và 4 preset PN.
- Mỗi profile có `vs` theo cặp nguyên tác. Trang roster hiện 22 profile đấu được.
- Thêm `SB_GU.campaignMax`: một chỗ duy nhất chép công thức máu/chân nguyên của engine, dùng cho NPC người, preset và save.

### D: kiểu mới cho đợt 1 (có test hiệu lực)
- **`transform` (Mộc Mị):** hồi chân nguyên và máu; chiêu cùng tag mạnh hơn; khí huyết tối đa giảm dần, có sàn; hết hạn có sự kiện.
- **`kit.regen`:** cổ trị liệu ký sinh.
- **Pha `enrage`:** tốc độ và sát thương tăng, kích hoạt một lần, không chặn đòn kết liễu.
- **Đạn nhiều mũi** (`count`, `spread`): mỗi mũi một hid.
- **`kit.ai.stand`:** khoảng giữ cho nhân vật đánh xa.
- **View:** đạn theo hệ (thunder, wood, ice, blood, fire), vòng lá khi biến thân, tia điện khi cuồng nộ, chữ nổi khi đổi pha.

**Kiểm:**
- Regression đạt.
- Trace PN/BNB 45/45 trùng baseline.
- Chrome localhost không lỗi JS.
- Máy đấu máy 60 trận mỗi cặp nguyên tác, bên thắng khớp truyện:
  - PN ch.70 thắng lợn rừng 50/60;
  - PN thắng Thạch Hầu và điện lang 60/60;
  - Hắc Hùng thắng điện lang 60/60;
  - PC thắng Mạc Bắc và Xích Thành 60/60;
  - PN ch.84 thắng PC 60/60;
  - BNB ch.140 thắng Thanh Thư 38/60.

**Kind chưa làm vì đợt 1 không cần:** `zone`, `seal`, `stun`, `charge`, `armorGrow`, `summon`, `petrify`. Làm khi đợt 2–4 có dossier.

### Blue đối chiếu lại (vai kiểm chéo)
- Kiểm các dòng trích và thời điểm có cổ trong 10 dossier ở trên.
- Đặc biệt: `hacthi` trong `pn_ch130`. Ch.127 đã đổi Hắc Thỉ lấy Ngư Lân, nhưng ch.130 vẫn tả "hai trư lực".
- Đề xuất thêm id `hao_dien_lang` (ch.130–134, có phóng điện và giáp điện) nếu muốn có trận sói phóng điện.
- Ảnh: Lôi Quan Đầu Lang trong truyện to như ngọn núi nhỏ; sprite cũ đã chuẩn hóa nên chưa thể hiện được. Cần `size` khi có bộ hình mới.

## 14. Blue — review triển khai hiện hành và bản thử cỡ nhỏ (03/10/2026)

Đã đọc §11–13 và đối chiếu code. Đồng ý registry/profile/save/trace hiện tại. [Bàn giao chi tiết](NOTE_THU_NHO_BATTLE_VA_REVIEW_ROSTER.md) gồm thử cỡ hình 66% trong sandbox và các điểm cần xử lý: cổ PN bị bỏ vì hết ô phím; AI style chưa đầy đủ chỉ qua tags; `size` roster chưa áp; bảng trạng thái/Hướng dẫn import assets đã cũ; bench cặp nguyên tác không thay kiểm cân bằng với save và người thật. Chưa kiểm chéo tất cả nguồn chương của bảng cổ.

Bản thử chỉ đổi hiển thị, có lựa chọn cỡ cũ để đối chứng; không đổi sim/kit/AI, không làm map/camera mới.
