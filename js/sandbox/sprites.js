// Registry hình: tách "nhân vật trông thế nào" khỏi kit/profile (KE_HOACH_DUA_ROSTER_VAO_BATTLE §2.1).
// Kit chỉ ghi visual id (vd 'heo_rung'); thư mục sprite do bộ hình (set) quyết định.
// ĐỔI BỘ HÌNH:
//   · cả roster: đổi SB_SPRITES.active (vd 'chibi_ref' → 'pilot_v1') khi bộ mới đã duyệt và import đủ.
//   · từng nhân vật: thêm vào SB_SPRITES.use, vd use.heo_rung='pilot_v1', để thay dần từng con khi clip mới xong.
//   · bộ mới chỉ cần cùng cấu trúc manifest.json + sheet PNG (keypose_import_v2) và đủ clip idle;
//     clip thiếu tự rơi về idle (view.pick), kit không phải sửa.
// Bộ hiện tại: chibi_ref = animation cũ tạo từ assets/chibi_ref (assets/chibi_kp/<id>/). Một số con sai truyện
// (Trần Thúy Hoa da xanh, Phỉ Hầu lông toàn thân, Thạch Hầu hóa đá sẵn) — chấp nhận tạm, thay khi có bộ pilot.
(function(root){
  const SB_SPRITES={
    active:'chibi_ref',
    sets:{
      chibi_ref:{dir:'assets/chibi_kp/',note:'Animation cũ từ chibi_ref (tạm thời).'},
      // Bộ mới (pilot chibi_ref style) khi đã import bằng keypose_import_v2. Đặt đúng thư mục thật rồi mới dùng.
      pilot_v1:{dir:'assets/chibi_v2/',note:'Roster mới theo pilot 03/10 (chưa có file).'},
    },
    use:{},                          // ghi đè từng visual: {visualId:'pilot_v1'}
    // visual id → tên thư mục khác trong set. Hai khôi tạm dùng chung sprite gộp cũ tới khi Blue tách hình.
    alias:{tuu_khoi:'tuu_khoi_huyet_khoi',huyet_khoi:'tuu_khoi_huyet_khoi',hinh_nom:'tuu_khoi_huyet_khoi'},
    resolve(visual){
      const set=SB_SPRITES.use[visual]||SB_SPRITES.active,S=SB_SPRITES.sets[set];
      if(!S)throw new Error('Bộ hình không tồn tại: '+set);
      return {set,dir:S.dir+(SB_SPRITES.alias[visual]||visual)+'/'};
    },
  };
  if(typeof module!=='undefined')module.exports=SB_SPRITES;else root.SB_SPRITES=SB_SPRITES;
})(this);
