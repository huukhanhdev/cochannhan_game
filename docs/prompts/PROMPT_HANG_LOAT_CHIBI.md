# 📜 DANH SÁCH PROMPT TẠO HÀNG LOẠT ASSET CHIBI PIXEL (QUYỂN 1 & 2)

> **Thử battle đầy đủ hai nhân vật trước khi hàng loạt:** dùng [bộ PN / BNB nam — click-to-move, 51 actor action](PROMPT_FULL_BATTLE_CLICKMOVE_PN_BNB_NAM.md). Chuột phải di chuyển, chuột trái đánh tay, phím cổ/kỹ năng/sát chiêu mở và rebind, không giới hạn QWER. Bộ prompt mới copy độc lập kèm ảnh thật; không dùng đường dẫn reference local trong bảng cũ bên dưới làm đầu vào cho AI ngoài project.

> **Khi làm battle animation:** dùng [quy chuẩn sideview + 6 trạng thái × 8 frame](PROMPT_FULL_ANIMATIONS_BATTLE_Q1_Q2.md). File này là gợi ý tạo hình/master và tách layer; canvas 1376×1824 không phải kích thước frame runtime. Ưu tiên dùng lại sideview hợp lệ, khóa pose B, không sinh lại nhân vật độc lập cho từng action. Các tên chiêu/chi tiết tạo hình chưa xác minh phải đối chiếu nguồn Q1/Q2; không coi toàn bộ mô tả dưới đây là canon.

> **Mục đích**: Cung cấp sẵn prompt chuẩn hóa, tên ID và đặc điểm nhận diện cho toàn bộ dàn nhân vật và Boss cốt lõi của Cổ Chân Nhân.  
> **Quy chuẩn kỹ thuật**: Tỷ lệ 2.5 đầu, Canvas `1376x1824`, nền trong suốt (transparent), góc nhìn nghiêng (Side-view Profile facing right) và chính diện (Front-view).

---

## 🛠️ THÔNG SỐ CẤU HÌNH DÙNG CHUNG (MASTER CONFIG)

| Thông Số | Giá Trị Cố Định |
| :--- | :--- |
| **Kích thước ảnh** | `1376 x 1824 px` (Tỷ lệ 3:4) |
| **Định dạng** | PNG Transparent (Nền trong suốt) |
| **Góc nhìn** | `side view profile facing right` (Nghiêng nhìn sang phải) HOẶC `front view` (Chính diện) |
| **Tỷ lệ Chibi** | `chibi proportion (2.5 heads tall)` |
| **Phong cách** | `Retro 16-bit / 32-bit pixel art style, clean outline, isolated on transparent background` |
| **Ảnh tham chiếu (Ref)** | `assets/chibi_side/phuong_nguyen_side_full.png` hoặc `assets/chibi/bnb_nam_side_full.png` |
| **Yêu cầu tách 7 layer** | `head.png`, `hair.png`, `torso.png`, `armF.png`, `armB.png`, `legF.png`, `legB.png` |

---

## 📋 DANH SÁCH 15 NHÂN VẬT & BOSS CẦN TẠO

### 🐺 NHÓM 1: CÁC ĐỐI THỦ & BOSS QUYỂN 1 (THANH MAO SƠN)

#### 1. `dian_lang_boss` — Điện Lang / Lôi Quan Lang Vương (Lang Triều)
* **Vai trò**: Boss dã thú chiến dịch Lang Triều.
* **Side-view Prompt**:
```text
2D pixel art creature sprite, chibi wolf boss, side view profile facing right, four-legged standing prowling combat stance. Giant electric wolf (Lightning Crown Wolf / Điện Lang) from Reverend Insanity, ferocious dark-blue and teal spiky fur, crackling yellow electric sparks and lightning crown horns on forehead, glowing yellow eyes, sharp fangs. Retro pixel art style, clean outline, isolated on transparent background, canvas size 1376x1824.
```

#### 2. `phuong_chinh` — Cổ Nguyệt Phương Chính (Em trai Phương Nguyên)
* **Vai trò**: Đối thủ học đường, thiên tài Giáp đẳng ngây thơ.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, full body neutral standing pose. Character: Gu Yue Fang Zheng (Cổ Nguyệt Phương Chính), handsome innocent teenage cultivation disciple, looks similar to Fang Yuan but with softer naive facial features, neat black hair tied with a green ribbon, wearing green and silver clan scholar cultivation robes with jade belt. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 3. `thanh_thu` — Cổ Nguyệt Thanh Thư (Đại ca ôn hòa)
* **Vai trò**: Trưởng tiểu tổ, hi sinh hóa thành cây Mộc Mị chặn Lang triều.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, full body standing pose. Character: Gu Yue Qing Shu (Cổ Nguyệt Thanh Thư), gentle and charismatic senior clan leader, warm smile, long brown hair half-tied, wearing dark-green nature-themed hanfu robes with leaf embroidery, wood element aura (Mộc Mị). Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 4. `nhat_dai_boss` — Cổ Nguyệt Nhất Đại (Boss Cuối Quyển 1)
* **Vai trò**: Thủy tổ ma đạo, sống lại từ huyết quan tài.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, menacing combat stance. Character: First Generation Gu Yue Ancestor (Cổ Nguyệt Nhất Đại), ancient blood sect vampire cultivator, pale ghastly face with fangs, long crimson blood-red hair, wearing ancient dark-red and gold imperial zombie burial robes, glowing red demonic eyes. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 5. `thiet_huyet_lanh` — Thiết Huyết Lãnh (Thần Bổ Thiết Gia)
* **Vai trò**: Cao thủ tra án, đại chiến Nhất Đại đồng quy vu tận.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, stalwart righteous pose. Character: Tie Xue Leng (Thiết Huyết Lãnh), legendary stern divine detective, square resolute jaw, sharp eagle-like eyes, gray-streaked dark hair, wearing bronze metal armor over dark-gray detective longcoat with iron chains and copper badge. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 6. `mac_bac` — Cổ Nguyệt Mạc Bắc
* **Vai trò**: Thiếu chủ Mạc gia, tính cách nóng nảy bộc trực.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, arrogant teenage stance. Character: Gu Yue Mo Bei (Cổ Nguyệt Mạc Bắc), fierce hot-tempered cultivation youth, spiky short black hair, wearing heavy red and bronze martial training robes, determined fighting look. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 7. `xich_thanh` — Cổ Nguyệt Xích Thành
* **Vai trò**: Thiếu chủ Xích gia, gian lận tư chất Thủy Khiếu Cổ.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, sneaky defensive stance. Character: Gu Yue Chi Cheng (Cổ Nguyệt Xích Thành), cunning short young disciple, slightly arrogant smirking face, wearing dark-yellow and brown silk cultivation robes with hidden pockets. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

---

### 🏛️ NHÓM 2: CÁC NHÂN VẬT & BOSS QUYỂN 2 (THƯƠNG GIA THÀNH & TAM VƯƠNG)

#### 8. `thuong_tam_tu` — Thương Tâm Từ (Nữ Chính Quyển 2)
* **Vai trò**: Thiếu chủ Thương gia, người mang thiện tâm thuần khiết.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, elegant gentle standing pose. Character: Shang Xin Ci (Thương Tâm Từ), compassionate and noble merchant clan lady, extraordinarily beautiful and gentle face, long silky black hair styled with pink jade hairpin, wearing graceful pastel-pink and soft lavender silk hanfu dress. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 9. `thiet_nhuoc_nam` — Thiết Nhược Nam (Con gái Thiết Huyết Lãnh)
* **Vai trò**: Đối thủ truyền kiếp của Phương Nguyên, kế thừa ý chí Thiết gia.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, proud disciplined stance. Character: Tie Ruo Nan (Thiết Nhược Nam), determined young female detective-cultivator, sharp intelligent eyes, high ponytail black hair, wearing light bronze scout armor over dark leather tunic, holding detective iron token. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 10. `cu_khai_bi` — Cự Khai Bi (Đại Lực Sĩ Diễn Võ Trường)
* **Vai trò**: Võ sư Lực đạo huyền thoại võ đài tầng 5 Thương gia thành.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, bulky muscular brawler stance. Character: Ju Kai Bei (Cự Khai Bi), veteran strength-path cultivator, massive muscular physique, shaved head with scar, wearing heavy bronze arm bracers and sleeveless martial artist beast-hide vest, stone path and brute strength aura. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 11. `bach_chien_liep` — Bách Chiến Liệp (Cao thủ trẻ Bách gia - 百战猎)
* **Vai trò**: Thiên tài kiêu ngạo của Bách gia trại tại Bạch Cốt Sơn, đố kỵ Phương Nguyên.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, arrogant combat stance. Character: Bai Zhan Lie (百战猎) from Reverend Insanity (蛊真人), proud young clan warrior, sharp fierce eyes, wearing white and brown bone-hunter martial armor-robes with animal fur collar and bone tooth necklace. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 12. `thiet_ba_tu` — Thiết Bá Tu ("Bá Vương Đương Thời")
* **Vai trò**: Võ thần Lực đạo Thiết gia, tử chiến tại Tam Vương Phúc Địa.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, overwhelming warlord combat stance. Character: Tie Ba Xiu (Thiết Bá Tu), renowned strength-path warlord, intimidating muscular giant, fierce scarred visage, wearing dark iron spiked heavy armor with fur mantle, earth and golden aura. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 13. `thiet_mo_bach` — Thiết Mộ Bạch (Cự Đầu Ngũ Chuyển Kim Đạo)
* **Vai trò**: Danh túc chính đạo, cựu tộc trưởng Thiết gia, bị ám sát bằng Khuyển Vương.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, supreme grandmaster pose. Character: Tie Mu Bai (Thiết Mộ Bạch), former Tie Clan leader, Rank 5 grandmaster, long flowing white beard and white hair, majestic golden and bronze ornate cultivation armor-robes, holding golden light aura. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 14. `vu_quy` — Vu Quỷ Ô Cật (Lão Quái Ngũ Chuyển Ma Đạo)
* **Vai trò**: Tà ma ngoại đạo hắc ám, đối thủ cướp đoạt truyền thừa Tam Vương.
* **Side-view Prompt**:
```text
2D pixel art character sprite, chibi proportion (2.5 heads tall), side view profile facing right, sinister wicked posture. Character: Wu Gui (Vu Quỷ), Rank 5 evil demonic recluse, hunched dark figure, withered wrinkled face with venomous grin, wearing tattered pitch-black ghost-smoke robes, green ghostly flame aura. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

#### 15. `ba_quy_spirit` — Bá Quy Địa Linh (Địa Linh Tam Vương)
* **Vai trò**: Địa linh rùa đá khổng lồ phong ấn Phúc địa Tam Vương.
* **Side-view Prompt**:
```text
2D pixel art creature sprite, chibi giant spirit turtle, side view profile facing right, ancient venerable resting stance. Character: Ba Gui Earth Spirit (Bá Quy Địa Linh), ancient giant mythical dragon-turtle with mossy stone shell and weathered stone scales, glowing mystical ancient runes, wise solemn eyes, immortal spirit aura. Retro pixel art, clean outline, transparent background, canvas size 1376x1824.
```

---

## 📥 CÁCH GỬI CHO AI ĐỂ NHẬN ĐÚNG 7 LAYER:

Khi dùng công cụ AI (ví dụ: Pixellab, Midjourney, Photoshop script, hoặc Stable Diffusion LayerDivider):
Dán kèm câu lệnh tách lớp này vào cuối:
```text
Export as 7 separate transparent PNG layers aligned on the same 1376x1824 canvas:
1. head.png
2. hair.png
3. torso.png
4. armF.png
5. armB.png
6. legF.png
7. legB.png
```
