// Cánh bướm (BAN_GIAO_2, PR 2 và PR 3).
// - Mốc nguyên tác có biến thể (S.var). Ký ức kiếp trước là ký ức về bản nguyên tác (VARIANTS.def).
//   Mỗi lần chơi lại từ đầu, quang âm nghịch chuyển làm 2–3 mốc lệch sẵn; phần còn lại lệch dần theo việc người chơi làm.
// - S.drift (0–100, không hiện số): thế giới đã lệch khỏi ký ức bao nhiêu. Vượt 25/50/75 thì một mốc chưa tới đổi biến thể.
// - Lựa chọn ký ức (trường mem) dựa trên bản nguyên tác: mốc đã đổi thì lựa chọn đó phản tác dụng.
// - Hậu quả trễ later() và sự kiện dị số (loc:'diso') chỉ xuất hiện khi thế giới đã lệch.
// Nạp sau cicada.js, trước engine.js.

// k: khóa trong S.var · def: bản nguyên tác (đúng ký ức) · alt: các bản lệch · ev: mốc · n: tên mốc khi được gợi ý
const VARIANTS={
  giasan:{def:'yeu',alt:['manh'],ev:'c_giasan',n:'chuyện đòi gia sản'},
  gate:{def:'thuong',alt:['mac'],ev:'c_conghocduong',n:'chuyện ở cổng học đường'},
  kimsinh:{def:'alone',alt:['guard','trap'],ev:'c_kimsinh',n:'chuyện của Giả Kim Sinh'},
  baigia:{def:'thuong',alt:['phuc'],ev:'c_baigia',n:'đường tuần của Bạch gia'},
  bai:{def:'tomo',alt:['satý'],ev:'c_bai',n:'lần gặp Bạch Ngưng Băng'},
  lang:{def:'bac',alt:['tay'],ev:'c_lang1',n:'hướng lang triều'},
  huyethai:{def:'thuong',alt:['bay'],ev:'c_huyetdong',n:'cấm chế trong lăng mộ'},
};
const DRIFT_STEPS=[25,50,75];

// Biến thể đầu mỗi lần chơi: đúng ký ức, trừ 2–3 mốc đã lệch vì quang âm nghịch chuyển
function initVariants(){
  const v={};for(const k in VARIANTS)v[k]=VARIANTS[k].def;
  const ks=Object.keys(VARIANTS).sort(()=>Math.random()-.5).slice(0,rand(2,3));
  ks.forEach(k=>v[k]=pick(VARIANTS[k].alt));
  return v;
}
function varShifted(k){return !!(S.var&&VARIANTS[k]&&S.var[k]!==VARIANTS[k].def)}
// Mức lệch để hiện cho người chơi (không hiện con số)
function driftTier(){const d=S.drift||0;return d<25?0:d<60?1:2}
const DRIFT_LABEL=['Ký ức khớp','Có chỗ lạ','Tương lai mờ mịt'];

// passive: lệch không do người chơi chọn (quay ngược, hậu quả trễ, dư âm) chỉ đẩy tới PASSIVE_CAP
const PASSIVE_CAP=50;
function driftAdd(n,why,passive){
  if(!S||!n)return;
  const was=S.drift||0;
  if(passive&&n>0)n=Math.min(n,Math.max(0,PASSIVE_CAP-was));
  if(!n)return;
  S.drift=clamp(was+n,0,100);
  S.driftStep=S.driftStep||0;
  while(S.driftStep<DRIFT_STEPS.length&&S.drift>=DRIFT_STEPS[S.driftStep]){
    S.driftStep++;
    shiftVariant(why);
    if(S.driftStep===3)shiftSchedule();
  }
}
// Mốc chưa diễn ra ở tuần nào (theo lịch kiếp này)
function canonTurnOf(id){const e=Object.entries(S.canon||CANON).find(([t,x])=>x===id);return e?+e[0]:0}
// Đổi biến thể của một mốc chưa tới
function shiftVariant(why){
  const ks=Object.keys(VARIANTS).filter(k=>canonTurnOf(VARIANTS[k].ev)>S.turn&&VARIANTS[k].alt.some(a=>a!==S.var[k]));
  if(!ks.length)return;
  const k=pick(ks),V=VARIANTS[k];
  S.var[k]=pick([V.def,...V.alt].filter(a=>a!==S.var[k]));
  log(S.tamco>=12?`Thiên cơ xoay chuyển. Ngươi cảm thấy ${V.n} sẽ không còn như ký ức.`:'Thiên cơ xoay chuyển. Có điều gì đó trong ký ức của ngươi không còn đúng nữa.','mem');
  if(S.ff&&typeof ffStop==='function')ffStop('thế cục vừa xoay chuyển, ký ức không còn dẫn đường chắc chắn.');
}
// Lệch nặng: một mốc tương lai xê dịch một tuần (không đụng lang triều, lăng mộ, trận cuối)
const MOVABLE=['c_tramthuy','c_khaohach','c_baigia','c_bai','c_thiet'];
function shiftSchedule(){
  const c=S.canon||(S.canon=Object.assign({},CANON));
  const opts=[];
  for(const id of MOVABLE){const t=canonTurnOf(id);if(t>S.turn+1)[-1,1].forEach(d=>{if(!c[t+d]&&t+d>S.turn)opts.push([id,t,t+d])})}
  if(!opts.length)return;
  const [id,t,t2]=pick(opts);delete c[t];c[t2]=id;
  log(`Lịch trong ký ức đã lệch: ${EV[id].hint||EV[id].title} sẽ tới ${t2<t?'sớm':'muộn'} hơn một tuần.`,'mem');
}

/* ---------- PR 3: hậu quả trễ ---------- */
// later(id,min,max,cond): sau min..max tuần, đẩy sự kiện id vào tuần đó nếu cờ cond còn đúng.
// cond là tên cờ trong S.f (thêm '!' ở đầu để phủ định), không phải hàm, để lưu được bằng JSON.
function later(id,min,max,cond){(S.later=S.later||[]).push({t:S.turn+rand(min,max),id,cond:cond||''})}
function condOk(c){if(!c)return true;const neg=c[0]==='!',k=neg?c.slice(1):c;return neg?!S.f[k]:!!S.f[k]}
// Gọi đầu tuần, trước mốc nguyên tác
function laterTick(){
  if(!S.later||!S.later.length)return;
  const due=S.later.filter(x=>x.t<=S.turn);
  S.later=S.later.filter(x=>x.t>S.turn);
  for(const x of due)if(EV[x.id]&&condOk(x.cond)&&(!EV[x.id].cond||EV[x.id].cond())){S.evq.push(x.id);driftAdd(2,'',1)}
}

/* ---------- PR 3: dị số ---------- */
// Tuần chưa có chuyện gì, thế giới đã lệch nhiều: có thể xảy ra chuyện kiếp trước chưa từng có
function disoTick(){
  if(S.evq.length||(S.drift||0)<25||Math.random()>=S.drift/120)return;
  if(randomEvent('diso')&&!(META.seen||{})[S.evq[S.evq.length-1]])log('Kiếp trước chưa từng có chuyện này.','mem');
}

/* ---------- PR 3: dư âm xuyên kiếp ---------- */
// Cờ lớn của kiếp trước. Kiếp sau mỗi cờ có 20% làm thế giới lệch sẵn 5. NPC không nhớ gì, chỉ Phương Nguyên nhớ.
const ECHO_FLAGS=['killedJKS','qingshuAlive','qingshuDead','pcAlly','pcHate','baiAlly','tramthuyGone','tieGone','huyethai','hoatuu'];
function echoSave(){META.lastEchoes=ECHO_FLAGS.filter(k=>S.f[k])}
function echoApply(){
  const n=(META.lastEchoes||[]).filter(()=>Math.random()<.2).length;
  if(n){driftAdd(5*n,'',1);log('Có điều gì đó khác ký ức của ngươi. Những việc làm ở kiếp trước vẫn để lại gợn sóng.','mem')}
}

/* ---------- nối vào dữ liệu có sẵn ---------- */
// Dị số đã gặp thành ký ức 'ds_<id>'
for(const [id,e] of Object.entries(EV))if(e.loc==='diso')MEM['ds_'+id]={n:'Dị số: '+e.title,d:e.memD||'Chuyện không có trong ký ức kiếp trước.'};
// Những kết quả làm thế cục đổi lớn (cứu hay giết người mà nguyên tác không làm, đổi phe)
const AFTER_DRIFT={cuu_pc:10,bai3:8,tiefight:12,elder:12,tramthuy:6,nhatdai_lienthu:0};
for(const [k,n] of Object.entries(AFTER_DRIFT))if(AFTER[k]&&n){const f=AFTER[k];AFTER[k]=(...a)=>{f(...a);driftAdd(n)}}

// Nhãn trên thanh trạng thái: chỉ mức độ, không hiện con số
function driftChip(){
  const t=driftTier();
  const tip=['Thế giới vẫn như ký ức kiếp trước. Lựa chọn ký ức đáng tin.','Có vài chỗ đã khác ký ức. Lựa chọn ký ức có thể phản tác dụng.','Thế giới đã lệch xa khỏi ký ức. Dị số xuất hiện, ký ức khó tin.'][t];
  return `<span class="drift-chip t${t}" title="${tip}"><i>憶</i>${DRIFT_LABEL[t]}</span>`;
}

/* ---------- Phần 0 (KE_HOACH_Q2): ký ức sai có dấu hiệu, và có thể dò trước ---------- */
// Ký ức nào dẫn tới mốc nào
const VAR_MEM={giasan:'giasan',gate:'gate',kimsinh:'jks',baigia:'baigia',bai:'bai',lang:'langtrieu',huyethai:'huyethai'};
// Câu dẫn lạ khi mốc đã khác ký ức: người tinh ý còn kịp đổi ý
const VAR_OMEN={
  giasan:'Nhà cậu hôm nay đông khách lạ, trà trên bàn là loại đắt tiền.',
  gate:'Đám học trò hôm nay túm tụm lại, không ai đi lẻ như ngươi nhớ.',
  kimsinh:'Bờ sông yên tĩnh hơn ngươi nhớ. Yên tĩnh quá.',
  baigia:'Khe suối không còn dấu chân mới. Người ta không đi lối này nữa.',
  bai:'Hàn khí đến trước cả bóng người, lạnh hơn lần ngươi nhớ.',
  lang:'Gió đêm đổi chiều. Mùi sói không tới từ phía bắc.',
  huyethai:'Huyết văn trên cửa đá còn ướt, như vừa có ai chạm vào.',
};
function varOfEv(id){return Object.keys(VARIANTS).find(k=>VARIANTS[k].ev===id)}
// Thêm vào lời dẫn của mốc
function varOmen(id){const k=varOfEv(id);return k&&mem(VAR_MEM[k])&&varShifted(k)&&!(S.picked||{})[id+':probe']?' '+VAR_OMEN[k]:''}
// Lựa chọn phụ "dò xét": tốn nguyên thạch mua tin, cho biết mốc còn như ký ức không
const PROBE_COST=6;
function probeChoices(ev,chs){
  const id=Object.keys(EV).find(k=>EV[k]===ev),k=id&&varOfEv(id);
  if(!k||!mem(VAR_MEM[k])||(S.picked||{})[id+':probe']||!chs.some(c=>c.mem))return chs;
  return [{t:`Dò xét trước khi làm (${PROBE_COST} nguyên thạch)`,stay:'probe',req:()=>S.stones>=PROBE_COST,reqT:`Cần ${PROBE_COST} nguyên thạch`,
    eff:()=>{S.stones-=PROBE_COST;
      if(varShifted(k)){learn(VAR_MEM[k]);return `Ngươi bỏ thạch mua tin. Kết quả làm ngươi lạnh gáy: ${VARIANTS[k].n} kiếp này đã khác ký ức. Đừng làm theo ký ức.`}
      return `Ngươi bỏ thạch mua tin. ${VARIANTS[k].n[0].toUpperCase()+VARIANTS[k].n.slice(1)} vẫn y như ký ức.`}},...chs];
}
