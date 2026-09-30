// Quyển 2: khung chương (KE_HOACH_Q2.md, mục 1.3).
// S.book=2 thì engine chuyển sang startTurn2(), act2(), renderMap2(). Quyển 1 giữ nguyên.
// Mỗi chương là một mục trong CHAPTERS (khai báo ở events2.js): lịch mốc, nơi chốn, độ dài, chương kế.
// Đầu mỗi chương lưu một mốc vào META.chapSave (dùng cho Thiền lần ba). Chết thật thì chơi lại từ đầu Quyển 2, mất ký ức.
// Nạp sau butterfly.js, trước events2.js và engine.js.

const CHAPTERS={};
// Kết Quyển 1 dẫn sang Quyển 2 (Phương Nguyên rời núi theo ma đạo hoặc cùng Bạch Ngưng Băng)
const Q2_GATE=['ma','bai_dong','huyetlo','huyetlo_bai','tien_lo','phan_toc'];
const Q2_FIRST='q2_hoanglong';
// Bản thử: hiện nút vào thẳng Quyển 2 ở màn hình mở đầu kể cả khi chưa thắng Quyển 1. Tắt khi phát hành.
const Q2_TEST=true;

function curChap(){return S&&S.book===2?CHAPTERS[S.chap]:null}
function curFinal(){const c=curChap();return c?c.turns:FINAL_TURN}
function timeLabel(){
  const c=curChap();
  return c?`${c.n} · ${c.unit} ${S.turn}`:`Tháng ${month()} · ${tuan()}`;
}
function hudTimeHTML(){
  const c=curChap();
  if(c)return `<div><b>${c.unit[0].toUpperCase()+c.unit.slice(1)} ${S.turn}/${c.turns}</b><small>${S.combat?'Giao chiến':c.n}</small></div>`;
  return `<div><b>Tháng ${month()}</b><small>${S.combat?'Giao chiến':tuan()}</small></div>`;
}

/* ---------- vào Quyển 2 ---------- */
// Trạng thái đầu Quyển 2 theo canon VN 207–210: vừa dùng Xuân Thu Thiền lần hai, tụt về Nhất chuyển sơ kỳ,
// còn Thiên Nguyên Bảo Liên, Đâu Suất Hoa, Tửu trùng. Cổ khác từ Thanh Mao đi theo nhưng sẽ chết đói dần.
// Cổ từ Quyển 1 theo sang Quyển 2 (canon VN 207: 12 con cổ + Thiên Nguyên Bảo Liên)
const Q2_CORE=['thiennguyen','dausuat'],Q2_CARRY=['tuvi','tuutrung','thienbong','huyetnguyet','cuxikimngo','cuongthu','diathinh','anlan','huyetlo','duongco'];
function q2Inherit(old,from){
  if(!old){
    const bai=['bai_dong','huyetlo_bai'].includes(from);
    return {core:[...Q2_CORE,'tuutrung'],keep:['huyetnguyet','thienbong','cuxikimngo','cuongthu','diathinh',...(bai?['duongco']:[])].map(k=>({k,h:1})),miss:[]};
  }
  const has=k=>old.gu.some(g=>g.k===k);
  const core=Q2_CORE.filter(has),miss=Q2_CORE.filter(k=>!has(k));
  // Âm cổ chưa dùng: coi như đã dùng lên Bạch Ngưng Băng nếu kết cục có nàng
  const carry=Q2_CARRY.filter(k=>has(k)||(k==='duongco'&&has('amduong')&&['bai_dong','huyetlo_bai'].includes(from)));
  if(!carry.includes('tuvi')&&!carry.includes('tuutrung'))core.push('tuutrung');
  const extra=[...new Set(old.gu.map(g=>g.k))].filter(k=>GU[k]&&!carry.includes(k)&&!Q2_CORE.includes(k)&&['attack','guard','heal'].includes(GU[k].t)).slice(0,2);
  return {core,keep:[...carry,...extra].map(k=>({k,h:1})),miss};
}
function startQ2(ending){
  const from=ending||'ma';
  META.q2Unlocked=1;META.q2From=from;
  if(S&&S.over==='win'&&S.book!==2)META.wins.push(from);
  const old=S&&S.book!==2&&S.over==='win'?S:null;
  const lo=['huyetlo','huyetlo_bai','tien_lo'].includes(from);
  // Canon VN 207–213: kho cổ lấy từ Quyển 1 thật. Vào thẳng từ menu (không có Quyển 1) thì phát bộ nguyên tác.
  const {core,keep,miss}=q2Inherit(old,from);
  S={v:2,book:2,chap:null,turn:0,chuyen:1,giai:0,prog:0,ess:20,hp:90,stones:40,blood:0,wine:0,herbs:2,
    tuchat:lo?90:Math.max(62,old?old.tuchat:62),
    tamco:Math.max(12,old?old.tamco:12),satphat:Math.max(8,old?old.satphat:8),ngo:Math.max(9,old?old.ngo:9),
    dao:Math.max(20,old?old.dao:30),danh:0,susp:0,canonHit:0,canonMiss:0,
    gu:[{k:'xuanthu',h:0},...core.map(k=>({k,h:0})),...keep],
    rel:{bainu:lo||from==='bai_dong'||from==='huyetlo_bai'?10:0},met:{},f:{q2From:from},shop:[],evq:[],combat:null,panel:null,
    over:null,ending:null,ap:AP_WEEK,pend:null,refined:false,log:(old?old.log.slice(-6):[]),mod:old?old.mod||{}:{},inj:null,trait:old?old.trait:null,
    traitOpts:null,npcProg:{},var:{},world:[],cache:[],path:[],ffOffer:false,
    mem:old?Object.assign({},old.mem):{},combos:old?Object.assign({},old.combos):{},
    cicada:{charge:0},snaps:[],rewinds:0,drift:0,driftStep:0,later:[],evLast:{},evSeen:{}};
  S.hp=maxHp();S.ess=maxEss();
  S.gu.forEach(g=>discoverGu(g.k));
  if(miss.includes('thiennguyen')){S.stones+=120;log('Không có Thiên Nguyên Bảo Liên, ngươi chỉ còn túi nguyên thạch vét được lúc chạy khỏi núi (+120). Từ nay phải tự kiếm.','danger')}
  meet('bainu');
  log('Quyển hai · Xuân Thu Thiền đã dùng lần thứ hai. Tu vi tan gần hết, ngươi trở lại Nhất chuyển sơ kỳ.','big');
  if(keep.length)log(`Theo ngươi xuống núi còn ${keep.map(g=>GU[g.k].n).join(', ')}. Không có nguyên thạch nuôi, chúng sẽ chết đói.`,'danger');
  enterChapter(Q2_FIRST);
}
// Bắt đầu chương k: đặt lại lượt, lịch mốc, ảnh chụp quay ngược; lưu mốc chơi lại.
function enterChapter(k){
  const ch=CHAPTERS[k];if(!ch)return;
  S.f.inHoiCot=0;S.chap=k;S.turn=0;S.evq=[];S.panel=null;S.ap=AP_WEEK;S.pend=null;S.pendingChap=null;S.snaps=[];S.later=[];S.evLast={};S.over=null;S.combat=null;
  S.canon=Object.assign({},ch.canon);
  if(ch.shop)rollShop2();
  log(`— ${ch.title} —`,'big');
  if(ch.intro)log(ch.intro,'sys');
  if(ch.start)ch.start();
  startTurn2();
  META.q2Chap=k;META.chapSave=META.chapSave||{};
  const {log:_l,snaps:_s,...rest}=S;META.chapSave[k]=JSON.stringify(rest);
  saveAll();render();
}
// Chết thật ở Quyển 2: chơi lại từ đầu Quyển 2 với kho cổ nhận từ Quyển 1. Ký ức đời đã chết mất sạch.
function restartChapter(){
  const raw=META.chapSave&&META.chapSave[Q2_FIRST];
  if(!raw)return startQ2(META.q2From);
  const lg=S.log;S=JSON.parse(raw);S.log=lg.slice(-20);S.snaps=[];
  META.chapSave={[Q2_FIRST]:raw};
  META.q2Retry=(META.q2Retry||0)+1;
  log(`Chết là chết thật. Làm lại từ đầu Quyển hai, ngày rời Thanh Mao Sơn. Những gì đời trước đã thấy không còn nhớ.`,'big');
  cicadaSnap();saveAll();render();
}
// Gọi trong hiệu ứng lựa chọn hoặc sau trận để kết thúc chương: sang chương k ở lượt kế
function chapEnd(k){S.pendingChap=k;S.ap=0;S.pend=null}
// Kết Quyển 2 (hoặc điểm "còn tiếp")
function q2Ending(k){S.over='win';S.ending=k}

/* ---------- lượt ---------- */
function startTurn2(){
  if(S.pendingChap){const k=S.pendingChap;S.pendingChap=null;return enterChapter(k)}
  const ch=curChap();
  S.turn++;S.ap=AP_WEEK;S.pend=null;S.refined=false;
  log(timeLabel(),'day');
  if(S.turn>1){
    S.ess=Math.min(maxEss(),S.ess+Math.round(maxEss()*(0.5+(S.tuchat||44)*0.003)*(S.inj&&S.inj.k==='noi'?.5:1)));
    S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.25));
    S.susp=Math.max(0,S.susp-(hasGu('liemtuc')?10:5));
    if(S.inj){S.inj.t--;if(S.inj.t<=0)healInjury()}
    const inc=S.gu.reduce((s,g)=>s+((GU[g.k]||{}).income||0),0);
    if(inc){S.stones+=inc;log(`Thiên Nguyên Bảo Liên nhả ra ${inc} nguyên thạch.`,'gold')}
    if(ch.shop&&S.turn%3===1)rollShop2();
    if(ch.tick)ch.tick();
    cicadaTick();
  }
  laterTick();
  const cid=S.canon[S.turn];
  // Như Quyển 1: mốc chờ người chơi đối mặt, hết việc thì tự tới; mốc trong URGENT hoặc ch.urgent ập tới ngay
  if(cid&&EV[cid]&&(!EV[cid].cond||EV[cid].cond())){if(URGENT.has(cid)||(ch.urgent||[]).includes(cid))S.evq.push(cid);else S.pend=cid}
  // Quá hạn chương mà chưa kết (ví dụ chạy khỏi trận cuối): gặp lại mốc cuối
  if(S.turn>ch.turns&&!S.evq.length&&!S.pendingChap){const last=ch.canon[ch.turns];if(last)S.evq.push(last)}
  // Chuyện bên lề của chương: mỗi chuyện một lần, theo thứ tự, khi tuần này chưa có gì
  if(!S.evq.length&&(!S.pend||Math.random()<.5))for(const id of ch.side||[]){const e=EV[id];if(e&&!S.f['ev_'+id]&&(!e.cond||e.cond())){S.f['ev_'+id]=1;S.evq.push(id);break}}
  cicadaSnap();
}
function rollShop2(){const pool=[...(curChap().shop||[])];S.shop=[];for(let i=0;i<4&&pool.length;i++)S.shop.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])}

// Hành động riêng của chương. Trả false để engine xử lý hành động chung (bế quan, tĩnh dưỡng).
function act2(id){
  const sp=(curChap().spots||[]).find(s=>s.id===id);
  if(!sp||(!sp.run&&!sp.loc))return false;
  S.panel=null;
  if(sp.run)sp.run();
  else if(!(Math.random()<(sp.evP??.6)&&randomEvent(sp.loc))){
    if(sp.foes&&Math.random()<(sp.foeP??.6))fight2(pick(sp.foes),{elite:Math.random()<.12});
    else log(sp.quiet||'Không có chuyện gì.','sys');
  }
  spendAct();resEnd();saveAll();advance();render();return true;
}

/* ---------- Bạch Ngưng Băng đồng hành ---------- */
// Nàng đi cùng thì mỗi trận nhẹ đi theo độ tin phục; lúc nàng bị thương hoặc bỏ đi thì không.
function baiWith(){return S.book===2&&!S.f.baiAway&&!S.f.baiHurt}
function allyMod(){if(!baiWith())return 1;const r=S.rel.bainu||0;return r>=40?.8:r>=15?.87:.93}
function fight2(k,o){
  o=Object.assign({},o||{});
  if(!o.solo&&baiWith()){o.mod=(o.mod||1)*allyMod();o.allies=(o.allies||[]).concat('bai');log('Bạch Ngưng Băng rút đao băng đứng cạnh ngươi.','sys')}
  fight(k,o);
}

/* ---------- giao diện ---------- */
function renderMap2(st){
  const ch=curChap();
  const spots=(ch.spots||[]).filter(s=>!s.show||s.show());
  st.innerHTML=`<div class="mapwrap">
    <div class="map ${mapMood()}" style="background-image:url('${asset('art/'+(ch.bg||'bg_forest')+'.jpg')}')">
      <div class="map-fx" aria-hidden="true"><i class="mist m1"></i><i class="mist m2"></i><i class="mist m3"></i></div>
      <div class="map-cap"><span class="label">${timeLabel()} · việc ${Math.min(AP_WEEK,AP_WEEK-S.ap+1)}/${AP_WEEK}</span><h2>${S.ap>=AP_WEEK?(ch.ask||'Lượt này làm gì?'):S.ap>0?`Còn ${S.ap} việc trong ${ch.unit} này`:(S.pend?'Đã hết việc · Bấm Đối mặt để tiếp tục':`Đã hết việc · Bấm Qua ${ch.unit} để tiếp tục`)}</h2></div>
      ${spots.map(s=>`<button class="spot ${s.minor?'minor':''} ${s.tag||''} ${!s.minor&&S.ap<=0?'exhausted':''}" data-a="${s.id}" style="left:${s.x}%;top:${s.y}%"><span class="sseal">${s.g}</span><span class="slbl">${s.n}</span><span class="stip">${s.d}${s.minor?'':s.id==='tuluyen'?' · dùng hết việc còn lại':' · 1 việc'}</span></button>`).join('')}
    </div>
    <div class="map-foot">
      <button class="btn" data-a="absorb" ${S.stones<5||S.ess>=maxEss()?'disabled':''}>Hấp thu 5 nguyên thạch (+25 chân nguyên)</button>
      ${S.pend?`<button class="btn active pend-btn" data-a="pend" title="Hết việc thì chuyện này tự tìm tới">Đối mặt: ${EV[S.pend].hint||EV[S.pend].title}</button>`:''}
      <button class="btn ghost" data-a="endweek">Qua ${ch.unit}</button>
      <span class="dimt small">${ch.foot||`Mỗi ${ch.unit} ${AP_WEEK} việc. Chợ và lò luyện không tốn việc.`}</span>
    </div></div>`;
}
function q2WinHTML(){
  const E=ENDINGS[S.ending]||{t:'Còn tiếp',d:''};
  return `<div class="over has-art" style="--art:url('${asset('art/p_hero.jpg')}')"><span class="label">Quyển hai · ${timeLabel()} · ${rankName()}</span>
    <h3>${E.t}</h3><p>${esc(endingText(S.ending))}</p>
    <p>Làm lại chương ${META.q2Retry||0} lần.</p>
    <button class="btn big" data-a="chapretry">Chơi lại chương này</button>
    <button class="btn ghost" data-a="newgame">Bắt đầu lại từ kiếp một</button></div>`;
}
function q2DeadHTML(){
  const d=META.deaths[META.deaths.length-1];
  return `<div class="over has-art dead" style="--art:url('${asset('art/bg_fire.jpg')}')"><span class="label">${timeLabel()} · ${rankName()}</span>
    <h3>Phương Nguyên đã chết</h3>
    <p>Ngươi chết dưới tay ${esc(d?d.cause:'số mệnh')}. Xuân Thu Thiền mới hồi phục ${Math.floor(cicadaCharge())}%, không đủ sức nghịch chuyển quang âm.</p>
    <p>Chết là chết thật. Làm lại từ đầu Quyển hai, ngày rời Thanh Mao Sơn. Ký ức về đời này mất sạch.</p>
    <button class="btn big" data-a="chapretry">Làm lại Quyển hai</button></div>`;
}
