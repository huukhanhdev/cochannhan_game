# Plan Blue: đảm nhận toàn bộ VFX

Orange-kun, 03/10/2026.

**Phân việc người dùng chốt:**
- **Blue làm hết FX**: gen, nhập, đóng gói, sửa.
- Muse chuyển sang sprite nhân vật (`PLAN_MUSE_SPRITE_BATTLE.md`).
- Orange review và nối runtime.
- Blue tự review plan này và plan Muse (mục 8).

**Tài liệu gốc:**
- brief prompt: `docs/prompts/PROMPT_MUSE_VFX_V2_HANG_LOAT.md` (vẫn dùng, Blue gen bằng công cụ của mình);
- checklist nguồn: `docs/undone/BLUE_RECHECK_VFX_SKILL.md`;
- hợp đồng event: `previews/blue-handoff-v05/README.md` §4 (rắn lửa neo `mouth`);
- plan trạng thái: `docs/undone/KE_HOACH_TRANG_THAI_HIEU_UNG.md`.

## 1. Đã có (không làm lại)
| Nhóm | FX | Nguồn chọn |
|---|---|---|
| Thử v1/v2 | fx_bang_truy, fx_hit_nguyet, fx_nguyet_nhan (v2), fx_st_choang, fx_st_troi, fx_st_phong_cam (v2, cần căn frame) | `previews/fx-trial-v1` |
| A1 | **Blue:** fx_hit_chem, fx_tung_cham, fx_thanh_dang, fx_loi_giap, fx_hap_thu. **Muse:** fx_hit_dam, fx_dien_tuong, fx_lam_dieu | `previews/fx-batch-a1/README.md` |
| C | fx_huyet_buc, fx_ran_lua, fx_o_that, fx_tran_ma_chain | `previews/blue-handoff-v06/fx` |

## 2. Việc của Blue
1. **Đóng gói chung:** đưa 6 FX thử + 3 FX A1 của Muse về cùng chuẩn của Blue:
   - sidecar, phase loop/tan, anchor, palette ≤16, hash;
   - xuất vùng review `previews/fx-review/<id>/`, không ghi `assets/`.
2. **Sửa (một lượt):**
   - `fx_cuxi`: chân gợn sóng so le, thân uốn;
   - `fx_st_phong_cam`: căn frame theo tâm giấy, xóa mảnh vụn.
3. **Importer FX** (`tools/fx_import.py`):
   - gộp bước thu nhỏ BOX + palette chung + unkey;
   - thêm `center_on`, `min_blob`, `display_scale_y` (vòng trói ép dẹt);
   - giữ `phases` (active/dissolve/tile/head);
   - regression cho từng tùy chọn.
4. **Lô A2** (13 FX, brief §3).
   - Trước khi gen **fx_nguyet_mang, fx_huyet_nguyet, fx_loc_bang**, xác nhận màu/hình theo truyện (checklist recheck); đối chiếu truyện lệch `data.js` thì theo truyện.
   - Các FX còn lại gen luôn.
5. **Lô B** (7 icon/trạng thái, brief §4): mù, suy yếu, phá giáp, cấm hồi, độc, hóa tượng, vỡ tượng. Làm sau khi Orange chốt danh sách trạng thái đợt tiếp (hiện sim có choáng/trói/phong cấm).
6. **Icon HUD trạng thái 16–20px** (tĩnh, không animation) cho mọi trạng thái đang có + lô B, dùng trên thanh máu.
7. **FX cho cổ đợt 2–4:** khi Orange chốt kit từng đợt, Blue đề xuất FX còn thiếu theo dossier (Bàn Tay Lửa, Nhiên Du, Quán Lực, Bá Lực…), ghi nguồn chương, gen theo cùng chuẩn.
8. **Đối chiếu nguồn** trong `BLUE_RECHECK_VFX_SKILL.md` và ghi kết quả ở mục 4 của file đó.

## 3. Quy tắc
- Mỗi FX ghi `source` (`VN ch.N` / `data.js` / `art`) trong manifest.
- Mỗi FX **tối đa một lượt sửa** sau review. Lỗi nhỏ chỉ ghi chú (người dùng không muốn sửa vòng vòng).
- Không ghi `assets/battle_fx` khi người dùng chưa duyệt.
- Không nối runtime: Orange làm, theo event và neo của hợp đồng.

## 4. Bàn giao mỗi lô
- Một thư mục `previews/fx-review/` gồm:
  - `catalog.json` (id, frames, phases, anchor, palette, hash, source);
  - trang xem animation (lặp + tan, lật hướng, cỡ 1×, nền battle);
  - README ngắn (đã làm / cần Orange xem).
- Orange review theo bảng chặn (sai truyện, không đọc được ở cỡ thật, loop giật, tràn ô, viền hồng). Cái khác ghi chú.

## 5. Orange làm song song
- Nối runtime theo thứ tự:
  - trúng đòn (đấm/chém/nguyệt/băng);
  - đạn (nguyệt, băng trùy, tùng châm, điện tương, lam điểu);
  - trạng thái (choáng/trói/phong cấm);
  - hào quang (lôi giáp, hấp thu);
  - dây leo, con cổ (khi có kind summon/zone).
- Mở rộng hệ trạng thái (S1b, mù…), đưa danh sách trạng thái cho lô B.

## 6. Ưu tiên
1. Đóng gói chung + sửa rết/phong cấm + importer (để Orange nối được ngay).
2. A2.
3. Icon HUD.
4. B.
5. FX đợt 2–4.

## 7. Nghiệm thu chung
- Đọc rõ ở cỡ trong trận (nhân vật nhỏ 0,74).
- Không viền hồng, ≤16 màu.
- Loop không đổi hướng/cỡ/origin; không tràn ô.
- Đúng nguồn ghi trong manifest.

## 8. Blue review (Blue điền)
_(Blue review một lượt cả file này và `PLAN_MUSE_SPRITE_BATTLE.md`: tính khả thi, tham chiếu, danh sách clip/FX, chỗ nào trùng hoặc thiếu. Ghi vào đây.)_
