// Xuân Thu Thiền theo nguyên tác: không dùng liên tục được, mỗi lần chỉ quay ngược một ít.
// - Thiền cần CICADA_WEEKS tuần để hồi phục. Đầu game Thiền đang kiệt sức vì vừa đưa Phương Nguyên từ 500 năm sau về.
// - Chết khi Thiền đã hồi phục: quang âm quay ngược REWIND_WEEKS tuần. Ký ức giữ lại, Thiền lại kiệt sức.
// - Chết khi Thiền chưa hồi phục: chết thật, chơi lại từ lễ khai khiếu (ký ức vẫn giữ cho lần chơi sau).
// Mỗi đầu tuần lưu một ảnh chụp trạng thái để có chỗ quay về. Nạp trước engine.js.

const CICADA_WEEKS=12,REWIND_WEEKS=3,CICADA_KEEP=REWIND_WEEKS+1;

function cicadaCharge(){return S&&S.cicada?S.cicada.charge:0}
function cicadaReady(){return cicadaCharge()>=100}
function cicadaWeeksLeft(){return Math.ceil((100-cicadaCharge())/(100/CICADA_WEEKS))}
// Gọi mỗi đầu tuần (từ tuần 2)
function cicadaTick(){
  S.cicada=S.cicada||{charge:0};
  const was=S.cicada.charge;
  S.cicada.charge=Math.min(100,was+100/CICADA_WEEKS);
  if(was<100&&S.cicada.charge>=100)log('Xuân Thu Thiền trong không khiếu khẽ rung cánh. Nó đã hồi phục.','mem');
}
// Ảnh chụp trạng thái đầu tuần (không gồm nhật ký và các ảnh chụp khác)
function cicadaSnap(){
  if(!S)return;
  const {log:_l,snaps:_s,...rest}=S;
  S.snaps=(S.snaps||[]).filter(x=>x.turn!==S.turn);
  S.snaps.push({turn:S.turn,data:JSON.stringify(rest)});
  if(S.snaps.length>CICADA_KEEP)S.snaps.splice(0,S.snaps.length-CICADA_KEEP);
}
// Quay ngược quang âm. manual: người chơi tự kích hoạt lúc còn sống.
function rewindTime(manual){
  if(!cicadaReady()||!(S.snaps||[]).length)return false;
  const target=Math.max(1,S.turn-REWIND_WEEKS);
  const snap=S.snaps.filter(x=>x.turn<=target).pop()||S.snaps[0];
  const old=S;
  S=JSON.parse(snap.data);
  S.log=old.log;S.snaps=old.snaps.filter(x=>x.turn<=snap.turn);
  S.cicada={charge:0};S.rewinds=(old.rewinds||0)+1;
  S.over=null;S.combat=null;S.mg=null;S.ff=null;S.ffOffer=false;S.traitOpts=null;
  if(window.SFX)SFX.cicada();
  FX.queue.length=0;FX.toastMsg=null;
  log(manual?'Ngươi thúc Xuân Thu Thiền. Con ve vàng vỗ cánh.':'Trước khi ý thức tắt hẳn, Xuân Thu Thiền vỗ cánh.','big');
  log(`Quang âm chảy ngược về tháng ${Math.ceil(snap.turn/3)}, ${TUAN[(snap.turn-1)%3].toLowerCase()}. Những gì có được sau đó đều tan biến, chỉ ký ức còn lại. Xuân Thu Thiền kiệt sức, cần ${CICADA_WEEKS} tuần để hồi phục.`,'sys');
  saveAll();render();
  return true;
}
function cicadaChip(){
  const c=Math.floor(cicadaCharge());
  return `<span class="cicada-chip ${c>=100?'ready':''}" title="${c>=100?'Xuân Thu Thiền đã hồi phục: chết sẽ quay ngược '+REWIND_WEEKS+' tuần':'Xuân Thu Thiền đang hồi phục: chết lúc này là chết thật'}"><i>蝉</i>${c>=100?'Sẵn sàng':c+'%'}</span>`;
}
