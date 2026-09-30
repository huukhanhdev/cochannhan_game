let S, META;
const $=id=>document.getElementById(id);
const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

/* ---------- hiệu ứng hình ảnh & rung ---------- */
function triggerShake(){
  const el=$('mainPanel')||$('stage');
  if(el){
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(()=>el.classList.remove('shake'),300);
  }
}

/* ---------- lưu trữ ---------- */
function freshMeta(){
  return {life:1,mem:{},deaths:[],wins:[],codex:['xuanthu','nguyetquang']};
}
function saveAll(){
  try{
    localStorage.setItem('tms2-save',JSON.stringify(S));
    localStorage.setItem('tms2-meta',JSON.stringify(META));
  }catch(e){}
}
function loadAll(){
  try{
    const m=JSON.parse(localStorage.getItem('tms2-meta'));
    const s=JSON.parse(localStorage.getItem('tms2-save'));
    if(m&&s&&s.v===2){
      if(!m.codex) m.codex=['xuanthu','nguyetquang'];
      return {m,s};
    }
  }catch(e){}
  return null;
}

/* ---------- Cổ Đồ Giám ---------- */
function discoverGu(k){
  if(!META.codex) META.codex=['xuanthu','nguyetquang'];
  if(GU[k]&&!META.codex.includes(k)){
    META.codex.push(k);
    log(`Ghi chép Cổ Đồ Giám: ${GU[k].n}.`,'mem');
  }
}

/* ---------- tra cứu ---------- */
// Ký ức chỉ sống trong một đời. Xuân Thu Thiền quay ngược quang âm thì mang theo; chết thật là mất sạch.
function mem(k){return !!(S&&S.mem&&S.mem[k])}
function W(k){return !!(S&&S.world&&S.world.includes(k))}
function guPrice(k){return Math.round(GU[k].p*(W('dichco')?.8:1))}
function itemPrice(t){return {herb:W('dathan')?3:6,blood:8,wine:15}[t]}
// Lịch mốc nguyên tác của kiếp này (thiên cơ có thể đẩy sớm)
function buildCanon(){
  const sh={};
  if(W('thuongsom'))['c_thuongdoi','c_kimsinh','c_dieutra','c_thuongdoiroi'].forEach(id=>sh[id]=-3);
  if(W('langsom'))['c_lang1','c_lang2','c_lang3','c_luancong'].forEach(id=>sh[id]=-2);
  const out={};
  Object.entries(CANON).sort((a,b)=>a[0]-b[0]).forEach(([t,id])=>{let tt=+t+(sh[id]||0);while(out[tt])tt++;out[tt]=id});
  return out;
}
function learn(k){
  S.mem=S.mem||{};
  if(!S.mem[k]){
    S.mem[k]=1;
    log(`Ký ức khắc sâu: ${MEM[k]?MEM[k].n:k}. Xuân Thu Thiền quay ngược quang âm thì ngươi vẫn nhớ.`,'mem');
  }
}
function meet(k){S.met[k]=1;if(S.rel[k]===undefined)S.rel[k]=0}
function rel(k,v){meet(k);S.rel[k]=clamp(S.rel[k]+v,-100,100)}
function hasGu(k){return S.gu.some(g=>g.k===k)}
function gainGu(k,silent){
  S.gu.push({k,h:0});
  discoverGu(k);
  if(window.SFX) SFX.coin();
  if(!silent)log(`Nhận ${GU[k].n}.`,'good');
}
function maxHp(){return Math.round((70+70*S.chuyen+10*(S.giai||0)+S.gu.reduce((s,g)=>s+((GU[g.k]||{}).hp||0),0))*((S.mod&&S.mod.hp)||1))}
function maxEss(){
  const base=MAXE[S.chuyen];
  const tcMod=(S.tuchat||44)/44;
  return Math.round(base*tcMod*((S.mod&&S.mod.ess)||1));
}
function injMat(){return S.inj&&S.inj.k==='mat'?2:0}
function need(){return NEED[S.chuyen][S.giai]}
function passAtk(){return S.gu.reduce((s,g)=>s+(GU[g.k].atk||0),0)}
// Tổng một chỉ số bị động của các cổ đang có (pow: tinh luyện chân nguyên, moonAtk: thưởng nguyệt nhận, armor: giáp, refine: luyện cổ)
function guSum(k){return S.gu.reduce((s,g)=>s+((GU[g.k]||{})[k]||0),0)}
// Cảnh giới: mỗi tiểu cảnh giới chân nguyên tinh thuần hơn (cổ +8%), thân thể được tẩm bổ (+10 khí huyết, +1 sát lực).
// Mỗi đại cảnh giới: chân nguyên đổi chất (cổ +50%), +70 khí huyết, +6 sát lực, không khiếu rộng hơn.
// Đỉnh phong lên sơ kỳ cảnh giới sau vẫn tăng rõ: +40 khí huyết, +26% uy lực cổ, +3 sát lực.
function rankMult(){return 1+.5*(S.chuyen-1)+.08*S.giai}
function realmSnap(){return {hp:maxHp(),atk:baseAtk(),m:rankMult(),e:maxEss()}}
function realmGain(a){const b=realmSnap(),o=[];
  if(b.hp>a.hp)o.push(`khí huyết tối đa +${b.hp-a.hp}`);if(b.atk>a.atk)o.push(`sát lực +${b.atk-a.atk}`);
  if(b.m>a.m)o.push(`uy lực cổ +${Math.round((b.m-a.m)*100)}%`);if(b.e>a.e)o.push(`chân nguyên tối đa +${b.e-a.e}`);
  return o.length?o.join(', ').replace(/^./,c=>c.toUpperCase())+'.':''}
function baseAtk(){return Math.max(1,4+S.satphat+6*S.chuyen+(S.giai||0)+passAtk()-(S.inj&&S.inj.k==='tay'?3:0))}
function cultMult(){
  const tcBonus=((S.tuchat||44)-44)*0.01;
  return (1+S.gu.reduce((s,g)=>s+(GU[g.k].cult||0),0)+tcBonus)*(S.inj&&S.inj.k==='kinh'?.7:1)*(W('linhmach')?1.15:1);
}
function foodCost(){
  return S.gu.reduce((s,g)=>s+(g.k==='nguyetquang'&&S.f.freeMoon?0:(GU[g.k].food||0)*(g.k==='nguyetquang'&&W('dathan')?2:1)+(W('dichco')&&GU[g.k].t!=='fate'?1:0)),0)+((S.mod&&S.mod.food)||0);
}
function rankName(){return `${CH[S.chuyen]} chuyển ${GIAI[S.giai]}`}
function talentName(tc){
  tc=tc||44;
  if(tc>=85) return `Giáp đẳng (${tc}%)`;
  if(tc>=65) return `Ất đẳng (${tc}%)`;
  if(tc>=40) return `Bính đẳng (${tc}%)`;
  return `Đinh đẳng (${tc}%)`;
}
function month(){return Math.ceil(S.turn/3)}
function tuan(){return TUAN[(S.turn-1)%3]}
/* ---------- điều kiện của lựa chọn ---------- */
// need:{chuyen, stones, herbs, blood, gu, mem, rel:[npc,giá trị], danh, tamco, ngo, satphat, tuchat, flag, chose, t}
//  - gu: mã cổ hoặc mảng mã cổ cần có · flag: tên cờ trong S.f ('!x' là phải chưa có)
//  - chose: 'mã sự kiện:khóa' hoặc mảng, lựa chọn đã chọn trước đó trong kiếp này (khóa = c.k, hoặc nút go của cảnh, hoặc chữ lựa chọn)
//  - t: câu giải thích thay cho câu tự sinh (dùng cho flag, chose)
// Không đủ thì lựa chọn vẫn hiện nhưng bị khóa, ghi rõ còn thiếu gì: người chơi biết có nhánh đó để lần sau đi tới.
const NEED_STAT={danh:'danh vọng',tamco:'tâm cơ',ngo:'ngộ tính',satphat:'sát phạt',tuchat:'tư chất',herbs:'linh dược',blood:'huyết khí'};
function needMiss(n){
  if(!n)return [];
  const m=[],arr=x=>Array.isArray(x)?x:[x];
  if(n.chuyen&&S.chuyen<n.chuyen)m.push(`Cần ${CH[n.chuyen]} chuyển`);
  if(n.stones&&S.stones<n.stones)m.push(`Cần ${n.stones} nguyên thạch`);
  for(const k in NEED_STAT)if(n[k]!==undefined&&(S[k]||0)<n[k])m.push(`Cần ${NEED_STAT[k]} ${n[k]}`);
  if(n.gu)arr(n.gu).forEach(k=>{if(!hasGu(k))m.push(`Cần ${GU[k]?GU[k].n:k}`)});
  if(n.mem)arr(n.mem).forEach(k=>{if(!mem(k))m.push(`Cần ký ức: ${MEM[k]?MEM[k].n:k}`)});
  if(n.rel&&((S.rel||{})[n.rel[0]]||0)<n.rel[1])m.push(`Cần ${NPC[n.rel[0]]?NPC[n.rel[0]].n:n.rel[0]} tin ngươi (${n.rel[1]})`);
  const flagOk=f=>f[0]==='!'?!S.f[f.slice(1)]:!!S.f[f];
  if(n.flag&&!arr(n.flag).every(flagOk))m.push(n.t||'Chưa đủ điều kiện');
  if(n.chose&&!arr(n.chose).every(x=>{const [e,k]=x.split(':');return ((S.chosen||{})[e]||[]).includes(k)}))m.push(n.t||'Cần một lựa chọn trước đó');
  return m;
}
// Gắn need vào req/reqT để giao diện khóa lựa chọn và ghi lý do
function withNeed(list){
  return (list||[]).map(c=>{
    if(!c||!c.need)return c;
    const miss=needMiss(c.need),r0=c.req;
    return Object.assign({},c,{req:()=>!needMiss(c.need).length&&(!r0||r0()),reqT:miss.length?miss.join(' · '):c.reqT});
  });
}
// Ghi lại lựa chọn đã chọn trong kiếp này (Thiền quay ngược thì ảnh chụp tuần tự khôi phục)
function remember(evId,c){if(!c)return;const k=c.k||c.go||c.t;(S.chosen=S.chosen||{})[evId]=((S.chosen||{})[evId]||[]).concat(k)}

/* ---------- thẻ kết quả ---------- */
// Sau mỗi lựa chọn, cảnh, việc trong tuần, trận thắng: hiện rõ chuyện gì vừa xảy ra và chỉ số đổi thế nào.
// Nhật ký chỉ để tra lại. Chuỗi sự kiện nối nhau (việc → sự kiện → trận) gom thành một thẻ.
const RES_STATS=[['stones','nguyên thạch'],['hp','khí huyết'],['ess','chân nguyên'],['prog','tu vi'],['danh','danh vọng'],['susp','hiềm nghi',1],
  ['tamco','tâm cơ'],['ngo','ngộ tính'],['satphat','sát phạt'],['tuchat','tư chất'],['blood','huyết khí'],['herbs','linh dược'],['wine','tứ vị tửu']];
function resSnap(){const o={gu:S.gu.map(g=>g.k),mem:Object.keys(S.mem||{}),rel:Object.assign({},S.rel),rank:S.chuyen*4+S.giai};RES_STATS.forEach(([k])=>o[k]=S[k]||0);return o}
function resBegin(title){if(!S||S.ff)return;if(S.rcap){if(title)S.rcap.title=title;return}S.rcap={q:S.logSeq||0,snap:resSnap(),title:title||'',skip:[],from:null}}
function resFightStart(){if(S.rcap&&S.rcap.from==null)S.rcap.from=S.logSeq||0}
function resFightEnd(){if(S.rcap&&S.rcap.from!=null){S.rcap.skip.push([S.rcap.from,S.logSeq||0]);S.rcap.from=null}}
function resEnd(){
  const r=S.rcap;if(!r)return;
  if(S.combat||S.mg||S.traitOpts||S.evq.length)return; // chuyện còn tiếp: gom vào cùng một thẻ
  S.rcap=null;if(S.over||S.ff)return;
  const skip=q=>r.skip.some(([a,b])=>q>a&&q<=b);
  const all=S.log.filter(l=>l.q>r.q&&!skip(l.q)&&l.c!=='day');
  const choice=all.filter(l=>l.c==='choice').map(l=>l.t.replace(/^【[^】]*】\s*/,''));
  const lines=all.filter(l=>l.c!=='choice').map(l=>({t:l.t,c:l.c}));
  const a=r.snap,chips=[],rank=S.chuyen*4+S.giai;
  for(const [k,n,bad] of RES_STATS){
    if(k==='prog'&&rank!==a.rank)continue;
    const d=Math.round((S[k]||0)-a[k]);if(!d)continue;
    chips.push({t:`${n} ${d>0?'+':'−'}${Math.abs(d)}`,good:bad?d<0:d>0});
  }
  if(rank!==a.rank)chips.unshift({t:`Đạt ${rankName()}`,good:rank>a.rank});
  const had=a.gu.slice();
  S.gu.forEach(g=>{const i=had.indexOf(g.k);if(i>=0)had.splice(i,1);else chips.push({t:`Nhận ${GU[g.k].n}`,good:true,gu:1})});
  had.forEach(k=>chips.push({t:`Mất ${GU[k]?GU[k].n:k}`,good:false,gu:1}));
  Object.keys(S.mem||{}).filter(k=>!a.mem.includes(k)).forEach(k=>chips.push({t:`Ký ức: ${MEM[k]?MEM[k].n:k}`,good:true,mem:1}));
  for(const k in S.rel){const d=(S.rel[k]||0)-(a.rel[k]||0);if(d)chips.push({t:`${NPC[k]?NPC[k].n:k} ${d>0?'+':'−'}${Math.abs(d)}`,good:d>0,rel:1})}
  if(!lines.length&&!chips.length)return;
  // Hiện kết quả dưới dạng toast nhỏ, không chặn stage
  if(typeof showResultToast==='function'){
    showResultToast({title:r.title,choice:choice[choice.length-1]||'',lines:lines.slice(-8),chips});
  }
}
function log(t,c){if(!t)return;S.logSeq=(S.logSeq||0)+1;S.log.push({t,c:c||'',q:S.logSeq});if(S.log.length>160)S.log.splice(0,S.log.length-160)}
function chance(a,dc,b){return clamp(Math.round((21-(dc-S[a]-(b||0)))/20*100),5,100)}
function roll(a,dc,b){
  b=b||0;const d=rand(1,20),tot=d+S[a]+b,ok=tot>=dc;
  return {ok,text:`${ATTR[a]} ${S[a]}${b?' + '+b:''} + xúc xắc ${d} = ${tot}, cần ${dc}: ${ok?'thành công':'thất bại'}.`};
}
function rollShop(){
  const pool=[...(S.f.caravan?CARAVAN:SHOP)];S.shop=[];
  for(let i=0;i<(W('thuhoach')?5:4)&&pool.length;i++)S.shop.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
}

/* ---------- vòng đời ---------- */
// Mỗi tuần (10 ngày) có AP_WEEK việc. Mốc nguyên tác không bật ra đầu tuần mà chờ trong S.pend:
// người chơi tự đối mặt lúc nào cũng được, hoặc hết việc thì nó tự tới. Mốc trong URGENT ập tới ngay đầu tuần.
const AP_WEEK=3;
const URGENT=new Set(['c_khaikhieu','c_lang1','c_lang2','c_lang3','c_thietvay','c_nhatdai','c_final']);
function newLife(){
  const startTalent = 44;
  S={v:2,turn:0,chuyen:1,giai:0,prog:0,ess:25,hp:90,stones:20,blood:0,wine:0,herbs:1,
    tuchat:startTalent,tamco:8,satphat:3,ngo:6,dao:0,danh:10,susp:0,canonHit:0,canonMiss:0,
    gu:[{k:'xuanthu',h:0}],rel:{},met:{},f:{hs:0},shop:[],evq:[],combat:null,panel:null,
    over:null,ending:null,ap:AP_WEEK,pend:null,sc:null,refined:false,log:[],mod:{},inj:null,
    traitOpts:Object.keys(TRAITS).sort(()=>Math.random()-.5).slice(0,3),
    npcProg:{phuongchinh:1,thanhthu:0,bai:0,xich_mac:0,caumo:1},
    // Mốc nguyên tác: đúng ký ức trừ 1–2 mốc đã lệch (butterfly.js). Tuyến NPC vẫn rút ngẫu nhiên.
    var:{...initVariants(),
      phuongchinh_route:Math.random()<.5?'kieu_ngao':'tu_ti',thanhthu_route:Math.random()<.5?'trach_nhiem':'u_uat',bai_route:Math.random()<.5?'sat_y':'co_doc',xich_mac_route:pick(['xich_the','mac_the','tranh_doat']),caumo_route:Math.random()<.5?'phan_don':'suy_tan'}};
  discoverGu('xuanthu');
  meet('phuongchinh');meet('caumo');meet('xichthanh');meet('xichluyen');meet('mactran');
  if(META.life===1){
    log('Năm trăm năm sau, Huyết Ma Phương Nguyên bị chính đạo vây giết. Trước lúc chết, hắn luyện thành Xuân Thu Thiền.','sys');
    log('Mở mắt ra, ngươi đang đứng giữa Cổ Nguyệt sơn trại, năm mười lăm tuổi, sáng ngày khai khiếu.','big');
  }else{
    if(window.SFX) SFX.cicada();
    log(`Lần thử thứ ${META.life}. Phương Nguyên đời trước đã chết thật. Mọi thứ bắt đầu lại từ lễ khai khiếu.`,'big');
    log('Tu vi, nguyên thạch, cổ trùng, ký ức về những gì đã trải qua: không còn gì cả. Chỉ còn năm trăm năm ký ức Huyết Ma như lần đầu.','sys');
  }
  S.mem={};S.combos={};S.path=[];S.ffOffer=false;S.cicada={charge:0};S.snaps=[];S.rewinds=0;S.drift=0;S.driftStep=0;S.later=[];
  S.world=Object.keys(WORLD).sort(()=>Math.random()-.5).slice(0,2);
  if(W('thuongsom')&&W('langsom'))S.world[1]='hunggia';
  S.canon=buildCanon();
  S.tideT=+Object.keys(S.canon).find(t=>S.canon[t]==='c_lang1')||19;
  const locs=['nui','hauson','trai','nhiemvu'];
  S.cache=Object.keys(CACHE).sort(()=>Math.random()-.5).slice(0,2).map(kind=>{const from=rand(3,20);return {kind,loc:pick(CACHE_LOCS[kind]||locs),from,to:from+rand(3,6),done:0,rumor:0}});
  if(W('muadam'))S.f.hsBonus=(S.f.hsBonus||0)-3;
  S.hp=maxHp();
  rollShop();
  startTurn();
}

function startTurn(){
  if(S.book===2)return startTurn2();
  S.turn++;S.ap=AP_WEEK;S.pend=null;S.refined=false;
  log(`Tháng ${month()} · ${tuan()}`,'day');
  if(S.turn>1){
    const essRecover = Math.round(maxEss() * (0.5 + (S.tuchat||44)*0.003) * (S.inj&&S.inj.k==='noi'?.5:1));
    S.ess=Math.min(maxEss(),S.ess+essRecover);
    S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.25));
    S.susp=Math.max(0,S.susp-(hasGu('liemtuc')?10:hasGu('anlan')?8:5));
    if(S.inj){S.inj.t--;if(S.inj.t<=0)healInjury()}
    if(hasGu('cuudiep')){S.herbs=(S.herbs||0)+1;log('Cửu Diệp Sinh Cơ Thảo ngưng kết ra 1 phiến Sinh Cơ Diệp (linh dược).','good')}
    if(S.f.tuulau){const n=S.f.tuulau===2?6:3;S.stones+=n;log(`Tửu lâu nộp ${n} nguyên thạch.`,'gold')}
    if(S.f.blackmailXich){S.stones+=10;log(`Cổ Nguyệt Xích Luyện lén gửi 10 nguyên thạch bịt miệng.`,'gold')}
    if(S.turn%3===1){
      if(S.susp<60){const n=(S.danh>=30?14:9)-(S.f.tideDone?5:0)+(W('hocnghiem')?4:0)-(W('pcthientai')?4:0);S.stones+=n;log(`Gia tộc phát trợ cấp tháng: ${n} nguyên thạch.`,'gold')}
      if(S.f.phe){S.stones+=6;log(`${S.f.phe} chu cấp 6 nguyên thạch.`,'gold')}
      if(W('thuhoach')){S.f.freeMoon=Math.max(S.f.freeMoon||0,1)}
      if(S.f.pcSupply){S.herbs++;log('Phương Chính lén gửi cho ngươi một gốc linh dược.','good')}
      if(!S.f.caravan)rollShop();
    }
    if(S.f.freeMoon)S.f.freeMoon--;
    if(S.f.tieHunt&&!S.f.tieGone){const p=hasGu('liemtuc')?3:6;S.susp+=p;log(`Thiết Huyết Lãnh vẫn đang lần theo dấu vết. Hiềm nghi +${p}.`,'danger')}
  }
  guRecover(35);
  laterTick();
  const cid=(S.canon||CANON)[S.turn];
  if(cid&&(!EV[cid].cond||EV[cid].cond())){if(URGENT.has(cid))S.evq.push(cid);else S.pend=cid}
  // Nhân tới muộn: có Tửu Trùng sau tuần của mốc, Kim Sinh vẫn tìm tới khi thương đội còn trên núi (một lần)
  if(!S.pend&&S.f.caravan&&S.turn>canonTurnOf('c_kimsinh')&&EV.c_kimsinh.cond())S.pend='c_kimsinh';
  if((S.f.killedJKS||S.f.jksEscaped)&&!S.f.giaveDone&&S.turn>=14&&(S.susp>=45||S.turn>=18)&&!S.evq.includes('x_giave')){S.f.giaveDone=1;S.evq.push('x_giave')}
  if(S.f.tramthuyAmbush&&S.turn>=22&&!S.evq.length&&Math.random()<.5){S.f.tramthuyAmbush=0;S.evq.push('x_tramthuy')}
  // Dị số chen vào trước tuyến NPC khi tuần này chưa có mốc nguyên tác
  disoTick();
  S.npcWeek=0;
  if(!S.evq.length&&(!S.pend||Math.random()<.5))npcPoolTick();
  if(S.turn>=(S.tideT||19)-3&&S.turn<(S.tideT||19)&&!S.f.tideDone){
    if(window.SFX) SFX.thunder();
    log('Đêm nào cũng nghe tiếng sói tru gần hơn.','danger');
  }
  if(S.turn>1)cicadaTick();
  cicadaSnap();
}

function endTurn(){
  const cost=foodCost();
  if(S.stones>=cost){
    S.stones-=cost;S.gu.forEach(g=>g.h=0);
    if(cost)log(`Nuôi cổ tốn ${cost} nguyên thạch.`,'sys');
  }else{
    let left=S.stones;
    S.gu.forEach(g=>{
      const f=(g.k==='nguyetquang'&&S.f.freeMoon)?0:GU[g.k].food;
      if(!f)return;
      if(left>=f){left-=f;g.h=0}else g.h++;
    });
    S.stones=left;
    log('Không đủ nguyên thạch nuôi cổ. Cổ trùng đang đói.','danger');
    S.gu.filter(g=>g.h>=3).forEach(g=>log(`${GU[g.k].n} chết đói.`,'danger'));
    S.gu=S.gu.filter(g=>g.h<3);
  }
  if(S.susp>=100&&S.book!==2)S.evq.push('x_thamvan');
  startTurn();
}

function advance(){
  if(S.mg)return;
  if(S.over||S.combat||S.evq.length||S.panel==='tuluyen'||S.panel==='gamble')return;
  // Hết việc trong tuần: đại sự đang chờ tự tìm tới trước khi sang tuần
  if(S.ap<=0&&S.pend){firePend();if(S.evq.length)return}
  if(S.ap<=0)endTurn();
}
// Tuyến NPC: mỗi tuần tối đa một chuyện. Đầu tuần bận (mốc chính ập tới) thì chuyện NPC tới sau việc đầu tiên.
function npcPoolTick(){
  if(S.book===2||S.npcWeek===S.turn)return false;
  if(!S.npcProg)S.npcProg={phuongchinh:1,thanhthu:0,bai:0,xich_mac:0,caumo:1};
  for(const qid of NPC_POOL){
    if(EV[qid]&&(!EV[qid].cond||EV[qid].cond())&&!S.f[qid]&&!S.evq.includes(qid)){S.evq.push(qid);S.npcWeek=S.turn;return true}
  }
  return false;
}
function firePend(){const id=S.pend;S.pend=null;if(id&&EV[id]&&(!EV[id].cond||EV[id].cond()))S.evq.push(id)}
// Người chơi chủ động đối mặt với đại sự của tuần
function goPend(){
  if(!S.pend||S.evq.length||S.combat||S.over||S.mg||S.traitOpts)return;
  ffRecord('pend',{});S.panel=null;firePend();saveAll();render();
}
// Bỏ các việc còn lại trong tuần
function endWeek(){
  if(S.combat||S.over||S.evq.length||S.mg||S.traitOpts)return;
  ffRecord('skip',{});S.panel=null;S.ap=0;saveAll();advance();render();
}

/* ---------- máy cảnh hội thoại đa bước (Scene Engine) ---------- */
function initScene(id){
  const ev=EV[id];
  if(!ev||!ev.scene)return null;
  if(S.sc&&S.sc.id===id)return S.sc;
  resBegin(ev.title);
  S.sc={
    id,
    node:typeof ev.scene.start==='function'?ev.scene.start():ev.scene.start,
    budget:ev.scene.budget!==undefined?ev.scene.budget:3,
    tense:0,
    flags:{},
    talkIdx:0,
    subTalk:null,
    subIdx:0,
    picked:{},
    res:[]
  };
  return S.sc;
}
// Thoại của nút: mảng, hoặc hàm trả về mảng (thoại đổi theo trạng thái)
function scTalk(node){const t=node&&node.talk;return (typeof t==='function'?t():t)||[]}
function scCurrentNode(ev){
  if(!S.sc||!ev||!ev.scene||!ev.scene.nodes)return null;
  return ev.scene.nodes[S.sc.node]||null;
}
function scChoices(ev){
  const node=scCurrentNode(ev);
  if(!node||!node.choices)return [];
  const list=typeof node.choices==='function'?node.choices():node.choices;
  // _i: vị trí gốc trong nút, để đánh dấu lựa chọn dò xét đã dùng không bị lệch khi danh sách co lại
  return withNeed(list).map((c,i)=>Object.assign({},c,{_i:i})).filter(c=>{
    if(c.hidden&&(!S.sc.flags||!S.sc.flags[c.hidden]))return false;
    if(c.stay&&((S.sc.budget||0)<=0||(S.sc.picked&&S.sc.picked[S.sc.node+':'+c._i])))return false;
    if(c.mem&&!mem(c.mem))return false;
    return true;
  });
}
function scNextTalk(){
  if(!S.sc)return;
  const ev=EV[S.sc.id];if(!ev||!ev.scene)return;
  const node=scCurrentNode(ev);if(!node)return;
  if(S.sc.subTalk){
    if(S.sc.subIdx<S.sc.subTalk.length-1){
      S.sc.subIdx++;
    }else{
      S.sc.subTalk=null;S.sc.subIdx=0;
    }
    saveAll();render();return;
  }
  const talk=scTalk(node);
  if(S.sc.talkIdx<talk.length){
    S.sc.talkIdx++;
  }
  saveAll();render();
}
function scSkipTalk(){
  if(!S.sc)return;
  const ev=EV[S.sc.id];if(!ev||!ev.scene)return;
  const node=scCurrentNode(ev);if(!node)return;
  S.sc.subTalk=null;
  S.sc.talkIdx=scTalk(node).length;
  saveAll();render();
}
function scChoose(i){
  if(S.traitOpts||!S.sc)return;
  const id=S.sc.id,ev=EV[id];if(!ev||!ev.scene)return;
  const node=scCurrentNode(ev);if(!node)return;
  const chs=scChoices(ev);
  if(!chs.length){scFinish();return}
  const c=chs[i];
  if(!c||(c.req&&!c.req()))return;

  if(c.stay){
    if(S.sc.budget<=0)return;
    S.sc.budget--;
    (S.sc.picked=S.sc.picked||{})[S.sc.node+':'+c._i]=1;
    if(c.flag&&!c.check)(S.sc.flags=S.sc.flags||{})[c.flag]=1;
    if(c.tense)S.sc.tense=Math.min(3,(S.sc.tense||0)+c.tense);
    if(c.drift)driftAdd(c.drift);
    log(`【${ev.title}】 ${c.t}.`,'choice');
    const said=[];
    if(c.check){
      const r=roll(c.check[0],c.check[1],c.bonus?c.bonus():0);
      log(r.text,'roll');said.push(r.text);
      const txt=r.ok?(c.ok?c.ok():(typeof c.say==='function'?c.say():c.say)||''):(c.fail?c.fail():'Ngươi không nhận ra điều gì.');
      if(txt){log(txt);said.push(txt)}
      if(r.ok&&c.flag)(S.sc.flags=S.sc.flags||{})[c.flag]=1;
    }else{
      if(c.say){const t=typeof c.say==='function'?c.say():c.say;log(t);said.push(t)}
      if(c.eff){const txt=c.eff();if(txt){log(txt);said.push(txt)}}
    }
    if(c.talk){
      S.sc.subTalk=c.talk;
      S.sc.subIdx=0;
    }else if(said.length){
      S.sc.subTalk=said.map(t=>['',t]);S.sc.subIdx=said.length-1;
    }
    saveAll();render();
    return;
  }

  log(`【${ev.title}】 ${c.t}.`,'choice');remember(id,c);
  if(c.flag)(S.sc.flags=S.sc.flags||{})[c.flag]=1;
  if(c.tense)S.sc.tense=Math.min(3,(S.sc.tense||0)+c.tense);
  if(c.tag==='ma')S.dao=clamp(S.dao+(c.dao||8),-100,100);
  if(c.tag==='chinh')S.dao=clamp(S.dao-(c.dao||8),-100,100);
  if(c.drift)driftAdd(c.drift);
  if(c.canon)S.canonHit=(S.canonHit||0)+1;
  else if(ev.canon&&scChoices(ev).some(x=>x.canon))S.canonMiss=(S.canonMiss||0)+1;

  let nextTarget=c.go;
  if(c.check){
    const r=roll(c.check[0],c.check[1],c.bonus?c.bonus():0);
    log(r.text,'roll');
    if(r.ok){
      if(c.ok){const txt=c.ok();if(txt)log(txt)}
      if(c.okGo)nextTarget=c.okGo;
    }else{
      if(c.fail){const txt=c.fail();if(txt)log(txt)}
      if(c.failGo)nextTarget=c.failGo;
    }
  }else if(c.eff){
    const txt=c.eff();if(txt)log(txt);
  }

  if(nextTarget&&ev.scene.nodes[nextTarget])scGoto(nextTarget);
  else scFinish();
}
// Sang nút khác của cảnh. Nút có fight thì mở trận ngay (fight.o: tùy chọn của fight(), như mod, flee, spare)
function scGoto(target){
  const ev=EV[S.sc.id];
  S.sc.node=target;S.sc.talkIdx=0;S.sc.subTalk=null;
  const nd=ev.scene.nodes[target];
  if(nd&&nd.fight){
    const f=nd.fight;saveAll();
    fight(f.foe,Object.assign({},f.o||{},{sceneWin:f.win,sceneFlee:f.flee}));
    render();return;
  }
  saveAll();render();
}
// Nút không có lựa chọn nhưng có check: bấm "Tiếp tục" thì tung xúc xắc, rồi sang okGo hoặc failGo
function scNodeCheck(ev,node){
  const r=roll(node.check[0],node.check[1],node.bonus?node.bonus():0);
  log(r.text,'roll');
  const t=r.ok?node.okGo:node.failGo;
  if(t&&ev.scene.nodes[t])scGoto(t);else scFinish(true);
}
function scFinish(noCheck){
  if(!S.sc)return;
  const id=S.sc.id,ev=EV[id];
  const node=ev&&ev.scene&&ev.scene.nodes?ev.scene.nodes[S.sc.node]:null;
  // Nút tung xúc xắc (check + okGo/failGo) chưa kết thúc cảnh: "Tiếp tục" là lúc tung
  if(!noCheck&&node&&node.check&&(node.okGo||node.failGo)){scNodeCheck(ev,node);return}
  if(node&&node.eff){
    const txt=node.eff();
    if(txt)log(txt);
  }
  if(ev&&ev.post)ev.post();
  S.evq.shift();
  S.sc=null;
  S.sceneN=(S.sceneN||0)+1;
  S.stones=Math.max(0,S.stones);
  if(S.hp<=0&&!S.combat){die(`${ev?ev.title:'Số mệnh'}`);return}
  resEnd();saveAll();advance();render();
}

/* ---------- sự kiện ---------- */
function choicesOf(ev){
  if(ev&&ev.scene){
    initScene(S.evq[0]);
    const chs=scChoices(ev);
    if(!chs.length)return [{t:'Tiếp tục',go:null}];
    return chs;
  }
  let c=typeof ev.choices==='function'?ev.choices():ev.choices;c=typeof probeChoices==='function'?probeChoices(ev,c):c;c=withNeed(c);
  // Không lựa chọn nào làm được thì luôn có đường bỏ qua, tránh kẹt
  if(c.length&&c.every(x=>x.stay||(x.req&&!x.req())))c=[...c,{t:'Không làm được gì, đành bỏ qua',eff:()=>'Ngươi đành để cơ hội trôi qua.'}];
  return c}
function choose(i){
  if(S.traitOpts)return;
  const id=S.evq[0],ev=EV[id];if(!ev)return;
  if(ev.scene)return scChoose(i);
  (META.seen=META.seen||{})[id]=1;
  const chs=choicesOf(ev),c=chs[i];
  if(!c||(c.req&&!c.req()))return;
  // Lựa chọn phụ (stay): cảnh vẫn mở, lựa chọn đó biến mất
  if(c.stay){(S.picked=S.picked||{})[id+':'+c.stay]=1;log(`【${ev.title}】 ${c.t}.`,'choice');if(c.check){const r=roll(c.check[0],c.check[1],c.bonus?c.bonus():0);log(r.text,'roll');log(r.ok?c.ok():c.fail())}else log(c.eff());saveAll();render();return}
  resBegin(ev.title);remember(id,c);
  ffRememberChoice(id,c);
  S.evq.shift();S.sceneN=(S.sceneN||0)+1;
  if(ev.canon&&chs.some(x=>x.canon)){if(c.canon)S.canonHit++;else S.canonMiss++}
  if(c.drift)driftAdd(c.drift);
  if(ev.loc==='diso'&&MEM['ds_'+id])learn('ds_'+id);
  if(c.tag==='ma')S.dao=clamp(S.dao+(c.dao||8),-100,100);
  if(c.tag==='chinh')S.dao=clamp(S.dao-(c.dao||8),-100,100);
  log(`【${ev.title}】 ${c.t}.`,'choice');
  let txt;
  if(c.check){
    const r=roll(c.check[0],c.check[1],c.bonus?c.bonus():0);
    log(r.text,'roll');
    txt=r.ok?c.ok():c.fail();
  } else {
    txt=c.eff?c.eff():'';
  }
  log(txt);
  if(ev.post)ev.post();
  S.stones=Math.max(0,S.stones);
  if(S.hp<=0&&!S.combat){die(`${ev.title}`);return}
  resEnd();saveAll();advance();render();
}
// Rút một sự kiện ngẫu nhiên của nơi chốn loc.
// Chống lặp: sự kiện vừa ra phải chờ hồi chiêu (mặc định nửa cỡ kho, tối đa 6 tuần);
// gặp càng nhiều thì càng hiếm; kiếp sau ưu tiên chuyện chưa từng thấy.
function randomEvent(loc){
  S.evLast=S.evLast||{};S.evSeen=S.evSeen||{};
  const all=Object.entries(EV).filter(([id,e])=>e.loc===loc&&!e.chain&&(!e.cond||e.cond())&&!(e.once&&S.f['ev_'+id]));
  const cd=Math.min(6,Math.ceil(all.length/2));
  const pool=all.filter(([id,e])=>S.evLast[id]===undefined||S.turn-S.evLast[id]>=(e.cd||cd));
  const wt=(id,e)=>(typeof e.w==='function'?e.w():(e.w||1))*(S.world||[]).reduce((m,k)=>m*((WORLD_WEIGHT[k]||{})[id]||1),1)
    /(1+(S.evSeen[id]||0))*((META.seen||{})[id]?1:1.5);
  const tot=pool.reduce((s,[id,e])=>s+wt(id,e),0);
  let r=Math.random()*tot;
  for(const [id,e] of pool){
    r-=wt(id,e);
    if(r<=0){
      if(e.once)S.f['ev_'+id]=1;
      S.evLast[id]=S.turn;S.evSeen[id]=(S.evSeen[id]||0)+1;
      S.evq.push(id);
      return true;
    }
  }
  return false;
}
// Bước tiếp theo của một chuyện nhiều bước: hiện ngay sau lựa chọn vừa rồi
function thenEv(id){S.evq.unshift(id)}
// Câu chữ của sự kiện. text có thể là mảng hàm: lần gặp thứ n dùng bản thứ n
function evText(id){
  const t=EV[id].text,om=typeof varOmen==='function'?varOmen(id):'';
  if(!Array.isArray(t))return t()+om;
  return t[Math.max(0,((S.evSeen||{})[id]||1)-1)%t.length]()+om;
}

/* ---------- hành động ---------- */
const ACTS=[
  {id:'tuluyen',n:'Bế quan tu luyện',d:'Dồn chân nguyên và nguyên thạch vào tu vi.'},
  {id:'hocduong',n:'Đến học đường',d:'Nghe giảng, gặp bạn học. Có thể tăng ngộ tính.',show:()=>S.turn<=18},
  {id:'trai',n:'Dạo sơn trại',d:'Tửu lâu, tin đồn, đấu đá nội bộ.'},
  {id:'nui',n:'Vào núi Thanh Mao',d:'Săn thú, tìm cổ hoang. Nguy hiểm.'},
  {id:'hauson',n:'Thám hiểm hậu sơn',d:'Động phủ Hoa Tửu Hành Giả, từng tầng một.',show:()=>(S.f.hs||0)<5},
  {id:'nhiemvu',n:'Nhiệm vụ gia tộc',d:'Nguyên thạch và danh vọng.'},
  {id:'robgate',n:'Chặn cổng học đường',d:'Cướp nguyên thạch bạn học. Danh vọng giảm.',tag:'ma',show:()=>S.f.gate&&S.turn<=18},
  {id:'nghi',n:'Tĩnh dưỡng',d:'Hồi khí huyết và chân nguyên.'},
];
function act(id){
  if(S.combat||S.over||S.evq.length||S.traitOpts||S.mg)return;
  if(S.ap<=0){
    if(typeof toast==='function')toast('Hết việc tuần này',S.pend?'Hãy bấm "Đối mặt" sự kiện hoặc "Qua tuần" ở cuối trang.':'Hãy bấm "Qua tuần" ở cuối trang để sang tuần mới.','休','warn');
    const pb=document.querySelector('.pend-btn')||document.querySelector('[data-a="endweek"]');
    if(pb){pb.classList.remove('pulse-btn');void pb.offsetWidth;pb.classList.add('pulse-btn')}
    return;
  }
  ffRecord('act',{a:id});
  // Quyển 2 chỉ có hành động của chương, cộng bế quan và tĩnh dưỡng
  resBegin((ACTS.find(a=>a.id===id)||{}).n||'');
  if(S.book===2&&(act2(id)||!['tuluyen','nghi'].includes(id)))return;
  S.panel=null;
  const ci=(S.cache||[]).findIndex(c=>c.loc===id&&!c.done&&S.turn>=c.from&&S.turn<=c.to);
  if(ci>=0&&Math.random()<(S.cache[ci].rumor?.85:.4)){S.curCache=ci;S.evq.push('x_cache');S.ap--;saveAll();advance();render();return}
  switch(id){
    case 'tuluyen':S.panel='tuluyen';render();return;
    case 'hocduong':
      if(Math.random()<(S.f.studious?.5:.3)){S.ngo++;log('Nghe giảng có chỗ ngộ ra. Ngộ tính +1.','good')}
      if(Math.random()<.7)randomEvent('hocduong');else log('Một buổi học bình lặng.','sys');break;
    case 'trai':if(!randomEvent('trai'))log('Sơn trại yên ả. Ngươi uống một chén trà rồi về.','sys');break;
    case 'nui':
      if(hasGu('diathinh')&&Math.random()<.4){
        log('Địa Thính Nhục Nhĩ Thảo động đậy: phát hiện dấu vết bãi nguyệt lan hoang!','good');
        S.f.freeMoon=(S.f.freeMoon||0)+3;
        break;
      }
      if(hasGu('anlan')&&Math.random()<.35){
        log('Ẩn Lân Cổ phát huy tác dụng: thân hình hòa vào vách đá rừng trúc, nhẹ nhàng né tránh một đợt phục kích dã thú.','good');
        break;
      }
      if(Math.random()<.55&&randomEvent('nui'))break;
      fight(pick((S.chuyen===1?['heorung','heorung','dienlang','tanbinh','docxa','bao']:['dienlang','hachung','tanbinh','loiquan','bao']).concat(W('hunggia')?['hunggia','hunggia']:[],W('hanthu')&&S.turn>=8?['baitrinhsat']:[])),{scale:1,elite:Math.random()<(S.turn>=12?.3:S.turn>=6?.15:.05)*((S.mod&&S.mod.elite)||1)});break;
    case 'hauson':
      // Mỗi tuần chỉ xuống sâu thêm một tầng; lần đi thứ hai trong tuần gặp chuyện quanh cửa động
      if(S.f.hsT===S.turn){if(!randomEvent('hauson'))log('Khe đá im lìm. Tầng sâu hơn phải đợi hôm khác.','sys');break}
      S.f.hsT=S.turn;S.evq.push(['hs_khe','hs_bich','hs_ngam','hs_dong','hs_mo'][Math.min(S.f.hs||0,4)]);break;
    case 'nhiemvu':
      if(Math.random()<.45&&randomEvent('nhiemvu'))break;
      AFTER.nv();break;
    case 'robgate':S.dao=clamp(S.dao+3,-100,100);S.susp+=W('hocnghiem')?10:5;S.danh-=3;fight('hoctro',{scale:1});break;
    case 'nghi':
      S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.5));S.ess=Math.min(maxEss(),S.ess+Math.round(maxEss()*.4));guRecover(25);
      if(S.inj){S.inj.t-=2;log(`Tĩnh dưỡng giúp ${INJURY[S.inj.k].n} mau lành.`,'good');if(S.inj.t<=0)healInjury()}
      log('Ngươi tĩnh dưỡng, nghe gió núi thổi qua rừng trúc.','sys');break;
  }
  spendAct();
  if(!S.evq.length&&!S.combat&&S.ap===AP_WEEK-1)npcPoolTick();
  resEnd();saveAll();advance();render();
}
// Mỗi tuần (Quyển 2: mỗi đơn vị thời gian của chương) có AP_WEEK việc
function spendAct(all){S.ap=all?0:S.ap-1}
function apLeft(){return S.ap}

function absorb(){
  if(S.stones<5||S.ess>=maxEss()||S.combat)return;
  S.stones-=5;S.ess=Math.min(maxEss(),S.ess+25);
  if(window.SFX) SFX.coin();
  log(`Hấp thu 5 nguyên thạch. Chân nguyên ${ESS[S.chuyen].n} +25.`);saveAll();render();
}

/* ---------- tu luyện ---------- */
function cultMaxStones(){return Math.ceil(maxEss()/5)}
function cultivate(st){
  resBegin('Bế quan');
  S.stones=Math.max(0,S.stones);
  if(st>S.stones||st>cultMaxStones())return;
  ffRecord('cult',{n:st});
  const e=Math.floor(S.ess);S.stones-=st;
  const gain=Math.round((e+st*5)*cultMult()*(.4+.2*apLeft()));
  S.ess=0;S.prog+=gain;
  log(`Bế quan ${['','ba','bảy','mười'][apLeft()]||'mười'} ngày. Dùng ${e} chân nguyên${st?` và ${st} nguyên thạch`:''}. Tu vi +${gain}.`);
  S.combos=S.combos||{};
  COMBOS.filter(cb=>!S.combos[cb.id]&&cb.req.every(k=>hasGu(k))).forEach(cb=>{
    if(Math.random()<.3+(S.ngo-6)*.05){S.combos[cb.id]=1;log(`Trong lúc bế quan, ngươi ngộ ra sát chiêu【${cb.n}】.`,'mem');FX.toastMsg={g:'悟',t:'Ngộ ra '+cb.n,cls:'win'}}
  });
  levelUp();
  S.panel=null;spendAct(true);
  resEnd();saveAll();advance();render();
}
function levelUp(){
  while(S.prog>=need()){
    if(S.giai<3){
      const a=realmSnap();S.prog-=need();S.giai++;S.hp+=maxHp()-a.hp;
      if(window.SFX) SFX.levelUp();
      log(`Bích khiếu rung động. Đạt ${rankName()}. ${realmGain(a)}`,'good');
    }
    else if(S.chuyen<maxChuyen()){
      if(typeof startBreak==='function'){log('Tu vi đã đầy. Đến lúc xung kích bích khiếu.','big');startBreak();break}
      const ch=.65+(S.ngo-6)*.02+((S.tuchat||44)-44)*0.005;
      if(Math.random()<ch){
        const a=realmSnap();S.chuyen++;S.giai=0;S.prog=0;S.ess=Math.round(maxEss()*.4);S.hp=maxHp();
        if(window.SFX) SFX.levelUp();
        log(`Đột phá! Chân nguyên hóa thành ${ESS[S.chuyen].n}. ${rankName()}. ${realmGain(a)}`,'big');
      }else{
        S.prog=Math.floor(need()*.5);S.hp=Math.max(1,S.hp-Math.round(maxHp()*.3));
        triggerShake();
        log(`Đột phá thất bại (tỉ lệ ${Math.round(ch*100)}%). Chân nguyên phản phệ, tu vi mất một nửa.`,'danger');
      }
      break;
    }else{S.prog=need();break}
  }
}
function useGu(i){
  const g=S.gu[i];if(!g||GU[g.k].t!=='use'||S.combat)return;
  if(g.k==='thachkhieu'){
    S.gu.splice(i,1);S.prog=Math.max(S.prog,need());S.f.thachkhieu=1;
    if(window.SFX) SFX.levelUp();
    log('Thạch Khiếu Cổ nổ thành bột đá xám trắng, như sương như khói, tràn khắp biển chân nguyên. Tu vi đầy. Vách không khiếu hóa đá: về sau khó lên Tứ chuyển.','big');
    saveAll();render();return;
  }
  const need_={xaloi1:1,xaloi2:2,xaloi3:3,xaloi4:4}[g.k]||2;
  if(S.chuyen!==need_){log(`${GU[g.k].n} chỉ dùng được ở ${CH[need_]} chuyển.`,'danger');render();return}
  S.gu.splice(i,1);
  if(window.SFX) SFX.levelUp();
  if(S.giai<3){S.giai++;log(`${GU[g.k].n} tan vào không khiếu. Đạt ${rankName()}.`,'big')}
  else{S.prog=need();log(`${GU[g.k].n} tan vào không khiếu. Tu vi đã đầy, sẵn sàng đột phá.`,'big')}
  saveAll();render();
}

/* ---------- chợ và mổ thạch ---------- */
function buyGu(i){
  const k=S.shop[i];if(!k||S.stones<guPrice(k))return;
  S.stones-=guPrice(k);gainGu(k,true);S.shop.splice(i,1);
  if(window.SFX) SFX.coin();
  log(`Mua ${GU[k].n} giá ${guPrice(k)} nguyên thạch.`,'gold');saveAll();render();
}
function sellGu(i){
  const g=S.gu[i];if(!g||GU[g.k].t==='fate')return;
  const v=Math.floor(GU[g.k].p*.4);S.stones+=v;S.gu.splice(i,1);
  if(window.SFX) SFX.coin();
  log(`Bán ${GU[g.k].n} được ${v} nguyên thạch.`,'gold');saveAll();render();
}
function buyItem(t){
  if(t==='herb'&&S.stones>=itemPrice('herb')){S.stones-=itemPrice('herb');S.herbs++;log('Mua một gốc linh dược.','gold');if(window.SFX) SFX.coin();}
  if(t==='wine'&&S.stones>=15&&S.f.caravan){S.stones-=15;S.wine++;log('Mua một vò tứ vị tửu: chua, ngọt, đắng, cay.','gold');if(window.SFX) SFX.coin();}
  if(t==='blood'&&S.stones>=8){S.stones-=8;S.blood++;log('Mua một phần huyết khí.','gold');if(window.SFX) SFX.coin();}
  saveAll();render();
}

function gambleStone(id){
  const st=STONES_GAMBLE.find(x=>x.id===id);
  if(!st||S.stones<st.price)return;
  S.stones-=st.price;
  if(window.SFX) SFX.crack();
  let winP=st.goodP+(S.ngo-6)*0.03+(mem('doanthach')?0.35:0);
  winP=clamp(winP,0.15,0.95);
  if(Math.random()<winP){
    learn('doanthach');
    if(window.SFX) SFX.coin();
    if(Math.random()<0.45){
      const profit=Math.round(st.price*(1.3+Math.random()*1.0));
      S.stones+=profit;
      log(`Mổ thạch đại hỷ! Khối ${st.n} chứa tinh thạch thuần túy, bán ngay được ${profit} nguyên thạch!`,'gold');
    }else{
      const k=pick(STONE_POOL[id]||STONE_POOL.thach_re);
      gainGu(k);
      log(`Mổ thạch chấn động! Một con ${GU[k].n} còn nguyên vẹn nằm giữa lòng đá!`,'big');
    }
  }else{
    log(`Đá vỡ tan thành vụn vôi xám. Bên trong rỗng tuếch, mất ${st.price} nguyên thạch.`,'danger');
  }
  saveAll();render();
}

/* ---------- luyện cổ ---------- */
function refineChance(r){return Math.min(.95,r.ch+(S.ngo-6)*.03+(S.f.refineBonus||0)/100+guSum('refine'))}
function canRefine(r){
  if(S.refined) return false;
  if(!hasGu(r.from)) return false;
  if(r.extraGu && !hasGu(r.extraGu)) return false;
  if(r.id==='tuvi' && !S.f.tuviRecipe) return false;
  return S.stones>=r.st && S.wine>=(r.wine||0) && S.blood>=(r.bl||0) && S.herbs>=(r.hb||0);
}
function refine(i){
  const r=RECIPES[i];if(!canRefine(r))return;
  S.stones-=r.st;S.wine-=(r.wine||0);S.blood-=(r.bl||0);S.herbs-=(r.hb||0);S.refined=true;
  S.gu.splice(S.gu.findIndex(g=>g.k===r.from),1);
  if(r.extraGu){
    const idx=S.gu.findIndex(g=>g.k===r.extraGu);
    if(idx!==-1) S.gu.splice(idx,1);
  }
  if(Math.random()<refineChance(r)){
    gainGu(r.id,true);
    if(window.SFX) SFX.levelUp();
    log(`Luyện cổ thành công: ${GU[r.id].n}!`,'big');
  }else{
    log(`Luyện cổ thất bại. Cổ gốc tan thành tro, nguyên liệu mất sạch.`,'danger');
  }
  saveAll();render();
}

/* ---------- chiến đấu ---------- */
function fight(k,o){
  o=o||{};resFightStart();
  const e=EN[k],ai=EAI[k]||{},sc=o.scale?1+.45*(S.chuyen-1):1,elite=!!o.elite;
  // Quyển 1: độ khó tăng dần theo tuần (tuần 1 ×0,8, tuần 27 ×1,2 so với DIFF)
  const f=sc*(o.mod||1)*(elite?1.3:1)*(S.book===2?DIFF.q2:.8+.4*Math.min(1,S.turn/FINAL_TURN));
  S.combat={id:Date.now(),k,n:(elite?'Tinh anh · ':'')+e.n,wolf:!!e.wolf,
    hp:Math.round(e.hp*f*DIFF.hp),max:Math.round(e.hp*f*DIFF.hp),
    atk:[Math.round(e.atk[0]*f*DIFF.atk),Math.round(e.atk[1]*f*DIFF.atk)],
    def:Math.round((ai.def||0)*Math.sqrt(sc)*(elite?1.3:1)),sk:ai.sk||null,boss:!!ai.boss,tr:foeTraits(k),
    st:[Math.round(e.st[0]*sc*(elite?1.6:1)),Math.round(e.st[1]*sc*(elite?1.6:1))],
    bl:e.bl+(elite?2:0),drop:(e.drop||0)+(elite?.3:0),after:o.after||null,sceneWin:o.sceneWin||null,sceneFlee:o.sceneFlee||null,spare:o.spare||0,spareT:o.spareT||'',spareAfter:o.spareAfter||null,flee:o.flee!==false&&(!ai.noflee||!!o.canFlee),
    shield:0,shieldRed:.4,bleed:0,stun:0,reflect:0,poison:0,suppress:0,atkBuff:0,turn:0,cd:{},frozen:{},phase2:false,intent:'atk'};
  S.panel=null;
  nextIntent();
  if(rtOn())rtInit(S.combat,o);
  log(e.i,'danger');
  if(elite)log('Đây là một con tinh anh, mạnh hơn hẳn đồng loại.','danger');
  if(!S.combat.flee)log('Không có đường lui.','danger');
}
function nextIntent(){
  const c=S.combat;
  const w={atk:46,heavy:18+(c.phase2?8:0),guard:14,skill:c.sk?22+(c.phase2?10:0):0};
  let r=Math.random()*(w.atk+w.heavy+w.guard+w.skill);
  for(const k of ['atk','heavy','guard','skill']){r-=w[k];if(r<=0){c.intent=k;return}}
  c.intent='atk';
}
const INTENT={atk:'Sắp tấn công',heavy:'Dồn lực: đòn ×2, nên hộ thể',guard:'Thế thủ phản kích: đánh vào sẽ bị phản đòn'};
function intentText(c){return c.intent==='skill'&&c.sk?SK[c.sk].i:INTENT[c.intent]||''}
function dmgMult(){
  const c=S.combat;let m=1;
  if(c.wolf){if(mem('langtrieu'))m+=.25;if(S.f.wolfPrep)m+=.15}
  if(c.intent==='guard'&&!(c.stun>0))m*=.5;
  m*=1+guSum('pow');
  // Khổ Lực: mất bao nhiêu phần trăm khí huyết thì đòn nặng thêm bấy nhiêu, tối đa 80%
  if(hasGu('kholuc'))m*=1+Math.min(.8,Math.max(0,1-S.hp/maxHp()));
  return m;
}
function chillFoe(c,v){
  const before=c.atkBuff;c.atkBuff=Math.max(-.3,c.atkBuff-v);
  if(c.atkBuff<before)log(`Hàn khí làm ${c.n} cứng đờ, lực đánh giảm.`,'good');
}
function healAmt(k){const g=GU[k]||{};if(g.healAmt)return g.healAmt;return g.heal?g.heal[0]+g.heal[1]*S.chuyen:22+12*S.chuyen}
function fury(c){return c.turn>=DIFF.furyTurn?(c.turn-DIFF.furyTurn+1)*.1:0}
function costOf(base){return Math.ceil(base*(S.combat&&S.combat.suppress>0?1.5:1))}
// Chân nguyên thật khi thúc cổ thứ i: cổ đói tốn thêm 2 mỗi mức đói
function guCostIdx(i){const g=S.gu[i];return g?costOf(GU[g.k].cost||0)+(g.h||0)*2:0}
function guReady(key){const c=S.combat;return !(c&&((c.cd[key]||0)>0||(c.frozen[key]||0)>0))}

// Đòn của địch đánh vào người chơi (qua hộ thể nếu có)
function enemyHit(c,mult,opt){
  opt=opt||{};
  let d=rand(c.atk[0],c.atk[1])*mult*(1+c.atkBuff+fury(c));
  if(c.shield>0&&!opt.pierce){d*=c.shieldRed;c.shield--}
  d*=1-Math.min(.4,guSum('armor'));
  d=Math.max(1,Math.round(d));
  S.hp-=d;
  FX.q({type:'eatk',dmg:d,heavy:!!opt.heavy});
  if(window.SFX)SFX.hit();
  if(c.reflect>0&&!opt.counter){
    const r=Math.round(d*c.reflect);c.hp-=r;FX.q({type:'dot',dmg:r,cls:'reflect'});
    log(`Hư ảnh phản phệ ${r} sát thương ngược lại ${c.n}.`,'good');
  }
  return d;
}

function enemySkill(c){
  const nm=SK[c.sk].n;
  FX.q({type:'text',on:'e',t:nm});
  switch(c.sk){
    case 'charge':{const d=enemyHit(c,1.7,{heavy:true});log(`${c.n} ${nm}! Khí huyết −${d}.`,'danger');break}
    case 'howl':c.atkBuff=Math.min(.6,c.atkBuff+.15);{const d=enemyHit(c,.6);log(`${c.n} ${nm}, sức mạnh tăng thêm. Khí huyết −${d}.`,'danger')}break;
    case 'rage':c.atkBuff=Math.min(.6,c.atkBuff+.1);{const d=enemyHit(c,1.5,{heavy:true});log(`${c.n} ${nm}! Khí huyết −${d}.`,'danger')}break;
    case 'poison':{c.poison=3;const d=enemyHit(c,.6);log(`${c.n} phóng độc cổ. Ngươi trúng độc 3 lượt. Khí huyết −${d}.`,'danger')}break;
    case 'freeze':{
      if(c.shield>0&&c.warm){const d=enemyHit(c,.6);log(`${nm} chạm vào hỏa khí của Hỏa Lô Cổ rồi tan thành hơi nước. Khí huyết −${d}.`,'good');break}
      const opts=S.gu.map(g=>g.k).filter(k=>['attack','guard','heal'].includes(GU[k].t));
      if(opts.length){const k=pick(opts);c.frozen[k]=3;log(`${nm}: ${GU[k].n} bị băng phong 2 lượt.`,'danger')}
      const d=enemyHit(c,.6);log(`Hàn khí thấu xương. Khí huyết −${d}.`,'danger');break}
    case 'drain':{const amt=Math.min(Math.floor(S.ess),Math.round(maxEss()*.2));S.ess-=amt;const d=enemyHit(c,.5);log(`${c.n} ${nm}: mất ${amt} chân nguyên, khí huyết −${d}.`,'danger');break}
    case 'regen':{const bl=c.bleed>0,h=Math.round(c.max*((EAI[c.k]||{}).regen||.12)*(bl?.35:1));c.hp=Math.min(c.max,c.hp+h);FX.q({type:'text',on:'e',t:'+'+h});log(`${c.n} ${nm}, hồi ${h} máu.${bl?' Vết thương chảy máu không chịu khép lại.':''}`,bl?'good':'danger');break}
    case 'thunder':{const d=enemyHit(c,1.6,{pierce:true,heavy:true});log(`${nm} xuyên qua hộ thể! Khí huyết −${d}.`,'danger');break}
    case 'suppress':{c.suppress=3;const d=enemyHit(c,.5);log(`${c.n} tỏa ${nm}: cổ trùng run rẩy, tốn gấp rưỡi chân nguyên. Khí huyết −${d}.`,'danger');break}
  }
}

// Địch chỉ thử tay (spare): khi khí huyết ngươi tụt dưới ngưỡng thì dừng, không giết
function spared(c){
  if(!c.spare||S.hp>maxHp()*c.spare)return false;
  resBegin(c.n);resFightEnd();
  S.hp=Math.max(1,S.hp);log(c.spareT||`${c.n} thu tay, bỏ đi.`,'danger');
  if(c.spareAfter&&AFTER[c.spareAfter])AFTER[c.spareAfter]();
  S.combat=null;checkInjury();resEnd();saveAll();advance();render();return true;
}
// Thoát khỏi trận (chạy trốn thành công, hoặc mục tiêu thoát thân của trận thời gian thực)
function fleeSuccess(c){
  resBegin('Thoát khỏi '+c.n);resFightEnd();
  log('Ngươi rút vào rừng trúc, cắt đuôi được đối thủ.','sys');
  FX.toastMsg={g:'走',t:'Thoát khỏi '+c.n,cls:'run'};
  if(S.sc&&c.sceneFlee){
    const scEv=EV[S.sc.id];
    if(scEv&&scEv.scene&&scEv.scene.nodes&&scEv.scene.nodes[c.sceneFlee]){
      S.sc.node=c.sceneFlee;S.sc.talkIdx=0;S.sc.subTalk=null;
    }
  }
  S.combat=null;checkInjury();resEnd();saveAll();advance();render();
}
function playerAct(type,arg){
  const c=S.combat;if(!c||FX.busy||c.ko)return;
  // Trận thời gian thực: lệnh cũ (tua nhanh, bot) chạy người chơi máy một đoạn
  if(c.rt){rtRun(type==='flee'?3:1.5);return}
  const vary=()=>.85+Math.random()*.3;
  let attacked=false;
  const hitFoe=(raw,pierce,ev,aoe)=>{
    attacked=true;
    if(foeCanDodge(c)&&!aoe&&Math.random()<DODGE){
      ev.dmg=0;ev.miss=1;FX.q(ev);
      log(`${c.n} lách người, đòn đánh trượt.`,'danger');return 0;
    }
    let d=raw*(pierce?1:dmgMult())*counterMult(c,aoe);
    if(!pierce)d-=c.def;
    d=Math.max(1,Math.round(d));
    c.hp-=d;ev.dmg=d;FX.q(ev);return d;
  };
  if(type==='strike'){
    if(window.SFX)SFX.blade();
    const lm=typeof lucStrike==='function'?lucStrike():{m:1};
    const d=hitFoe(baseAtk()*vary()*lm.m,false,{type:'patk',kind:'fist'});
    if(d)log(lm.t?`${lm.t} ${c.n} mất ${d}.`:`Ngươi xuất quyền. ${c.n} mất ${d}.`);
  }else if(type==='gu'){
    const key=S.gu[arg]&&S.gu[arg].k,g=GU[key];
    if(!g||!guReady(key))return;
    const hung=(S.gu[arg].h||0);
    const cost=guCostIdx(arg);if(S.ess<cost)return;
    S.ess-=cost;c.cd[key]=(CD[key]??2)+1;
    if(hung)log(`${g.n} đang đói, sức yếu hẳn đi.`,'danger');
    if(g.t==='attack'){
      if(window.SFX)SFX.blade();
      const d=hitFoe((g.dmg*rankMult()*(1-.25*hung)+passAtk()+(g.nguyet?guSum('moonAtk'):0))*vary(),!!g.pierce,{type:'patk',kind:key},!!g.aoe);
      if(d){
      log(`${g.n}! ${c.n} mất ${d}.${g.pierce?' (Xuyên giáp)':c.def?` (giáp chặn ${c.def})`:''}${g.aoe&&foeHas(c,'bay')?' (Quét cả bầy)':''}`,'good');
      if(g.stun&&!hung){c.stun+=g.stun;log(`${c.n} bị trói chặt, choáng ${g.stun} lượt.`,'good')}
      if(g.chill)chillFoe(c,g.chill);
      if(g.slow)chillFoe(c,g.slow);
      if(g.bleed){c.bleed=(c.bleed||0)+g.bleed;log(`${c.n} bị Chảy Máu dữ dội ${c.bleed} lượt.`,'good')}
      if(g.lifesteal){
        const heal=Math.max(1,Math.round(d*g.lifesteal));
        S.hp=Math.min(maxHp(),S.hp+heal);
        FX.q({type:'heal',amt:heal});
        log(`${g.n} hút ${heal} khí huyết phản bổ bản thân.`,'good');
      }}
    }else if(g.t==='guard'){
      if(window.SFX)SFX.bell();
      c.shield=g.turns||2;c.drainPct=g.drainPct||0;
      if(g.selfHeal){S.hp=Math.min(maxHp(),S.hp+g.selfHeal);FX.q({type:'heal',amt:g.selfHeal})}
      c.shieldRed=SHIELD_RED[key]||.4;
      c.reflect=g.reflect||0;c.warm=!!g.warm;
      FX.q({type:'shield',k:key});
      log(`${g.n} hộ thể: chỉ nhận ${Math.round(c.shieldRed*100)}% sát thương trong ${c.shield} lượt${c.reflect?` (phản ${Math.round(c.reflect*100)}% sát thương)`:''}.`,'good');
    }else if(g.t==='heal'){
      if(window.SFX)SFX.bell();
      const h=healAmt(key);S.hp=Math.min(maxHp(),S.hp+h);if(c.poison)c.poison=g.cure?0:Math.max(0,c.poison-2);
      FX.q({type:'heal',amt:h});log(`${g.n} tỏa ánh xanh. Khí huyết +${h}.`,'good');
    }
  }else if(type==='combo'){
    const cb=COMBOS.find(x=>x.id===arg);
    if(!cb||!guReady(cb.id))return;
    const cost=costOf(cb.cost);if(S.ess<cost)return;
    S.ess-=cost;c.cd[cb.id]=COMBO_CD+1;
    if(window.SFX)SFX.blade();
    let d=0;
    if(cb.dmg){
      d=hitFoe((cb.dmg*rankMult()+passAtk())*vary(),!!cb.pierce,{type:'combo',id:cb.id},!!cb.aoe);
      if(d)log(`【Sát chiêu · ${cb.n}】 ${c.n} mất ${d}!`,'good');
      if(cb.lifesteal){
        const heal=Math.max(1,Math.round(d*cb.lifesteal));
        S.hp=Math.min(maxHp(),S.hp+heal);
        FX.q({type:'heal',amt:heal});
        log(`Sát chiêu hút ${heal} khí huyết phản bổ bản thân!`,'good');
      }
    }else FX.q({type:'combo',id:cb.id});
    if(cb.shield){c.shield=Math.max(c.shield,cb.shield);c.shieldRed=Math.min(c.shieldRed,.4);FX.q({type:'shield'})}
    if(!cb.dmg||d){
    if(cb.bleed){c.bleed+=cb.bleed;log(`${c.n} bị chảy máu ${c.bleed} lượt.`,'good')}
    if(cb.stun){c.stun+=cb.stun;log(`${c.n} bị choáng ${cb.stun} lượt.`,'good')}
    if(cb.chill)chillFoe(c,cb.chill);
    if(cb.reflect){c.reflect=cb.reflect;log(`Hư ảnh phản phệ ${Math.round(cb.reflect*100)}% sát thương.`,'good')}}
  }else if(type==='herb'){
    if(S.herbs<1||!guReady('herb'))return;
    S.herbs--;c.cd.herb=CD.herb+1;S.hp=Math.min(maxHp(),S.hp+30);if(c.poison)c.poison=0;
    FX.q({type:'heal',amt:30});if(window.SFX)SFX.bell();
    log('Nhai một gốc linh dược. Khí huyết +30, giải độc.','good');
  }else if(type==='absorb'){
    if(S.stones<5||S.ess>=maxEss())return;
    S.stones-=5;S.ess=Math.min(maxEss(),S.ess+20);if(window.SFX)SFX.coin();
    log('Giữa trận, ngươi bóp nát 5 viên nguyên thạch. Chân nguyên +20.','sys');
  }else if(type==='flee'){
    if(!c.flee)return;
    const fleeBonus=(hasGu('anlan')?.2:0)+(hasGu('tienlydilang')?.5:0);
    if(Math.random()<.45+S.satphat*.01-(c.boss?.15:0)+((S.mod&&S.mod.flee)||0)+fleeBonus)return fleeSuccess(c);
    log('Chạy trốn thất bại!','danger');
  }

  // Đánh vào thế thủ thì bị phản đòn
  if(attacked&&c.intent==='guard'&&!(c.stun>0)&&c.hp>0){
    const d=enemyHit(c,.7,{counter:true});
    log(`${c.n} đang thủ thế, phản kích ngay. Khí huyết −${d}.`,'danger');
    if(spared(c))return;
    if(S.hp<=0){die(c.n);return}
  }
  if(c.hp>0&&c.bleed>0){
    const b=Math.max(6,Math.round(c.max*.06));c.hp-=b;c.bleed--;FX.q({type:'dot',dmg:b,cls:'bleed'});
    log(`${c.n} chảy máu, mất ${b}.`,'good');
  }
  if(c.hp<=0){win();return}
  if(c.boss&&!c.phase2&&c.hp<c.max/2){
    c.phase2=true;c.atkBuff+=.25;c.stun=0;
    FX.q({type:'text',on:'e',t:'Cuồng hóa'});
    log(`${c.n} gầm lên, khí thế tăng vọt. Giai đoạn hai!`,'big');
  }

  // Lượt của địch
  if(c.stun>0){
    c.stun--;FX.q({type:'text',on:'e',t:'Choáng'});log(`${c.n} choáng váng, không ra tay được.`,'good');
  }else if(c.intent==='atk'){
    const d=enemyHit(c,1);log(`${c.n} tấn công. Khí huyết −${d}.`,'danger');
  }else if(c.intent==='heavy'){
    const d=enemyHit(c,2,{heavy:true});log(`${c.n} tung đòn toàn lực. Khí huyết −${d}.`,'danger');
  }else if(c.intent==='skill'&&c.sk){
    enemySkill(c);
  }else if(!attacked){
    FX.q({type:'text',on:'e',t:'Thủ thế'});log(`${c.n} thủ thế, dò xét ngươi.`,'sys');
  }
  if(c.hp<=0){win();return}

  if(c.poison>0){
    const p=Math.max(3,Math.round(maxHp()*.04));S.hp-=p;c.poison--;
    FX.q({type:'text',on:'p',t:'Độc −'+p});log(`Độc phát tác. Khí huyết −${p}.`,'danger');
  }
  if(spared(c))return;
  if(S.hp<=0){die(c.n);return}

  // Cuối lượt
  if(c.shield>0&&c.drainPct){const p=Math.round(maxHp()*c.drainPct);S.hp-=p;log(`Cấm cổ nuốt sinh mệnh. Khí huyết −${p}.`,'danger');if(S.hp<=0){die(c.n);return}}
  for(const k in c.cd)if(c.cd[k]>0)c.cd[k]--;
  for(const k in c.frozen)if(c.frozen[k]>0)c.frozen[k]--;
  if(c.suppress>0)c.suppress--;
  c.turn++;
  if(c.turn===DIFF.furyTurn)log(`Trận đánh kéo dài. ${c.n} bắt đầu cuồng nộ, mỗi lượt mạnh thêm 10%.`,'danger');
  nextIntent();
  saveAll();render();
}

function win(){
  const c=S.combat;
  // Hẹn giờ của đòn kết liễu có thể chạy trễ sau khi trận đã xong (chết, quay ngược, sang kiếp mới)
  if(!c||S.over)return;
  // Cho đòn kết liễu diễn xong rồi mới rời đấu trường
  if(c&&!c.ko&&window.PIXI&&$('arena')&&!RM){c.ko=1;c.hp=Math.min(c.hp,0);FX.busy=true;FX.q({type:'ko'});saveAll();render();setTimeout(()=>{FX.busy=false;if(S.combat===c)win()},950);return}
  S.combat=null;
  if(S.sc&&c.sceneWin){
    const scEv=EV[S.sc.id];
    if(scEv&&scEv.scene&&scEv.scene.nodes&&scEv.scene.nodes[c.sceneWin]){
      S.sc.node=c.sceneWin;S.sc.talkIdx=0;S.sc.subTalk=null;
    }
  }
  resBegin('Hạ gục '+c.n);resFightEnd();
  const st=Math.round(rand(c.st[0],c.st[1])*((S.mod&&S.mod.win)||1)*(W('linhmach')?.8:1));
  const bl=c.bl+(S.f.hunter&&BEASTS.has(c.k)?1:0);
  S.stones+=st;S.blood+=bl;
  checkInjury();
  if(window.SFX) SFX.coin();
  FX.toastMsg={g:(ART[c.k]||{g:'敌'}).g,t:'Hạ gục '+c.n,sub:[st?`+${st} nguyên thạch`:'',bl?`+${bl} huyết khí`:''].filter(Boolean).join(' · '),cls:'win'};
  log(`${c.n} gục ngã.${st?` +${st} nguyên thạch.`:''}${bl?` +${bl} huyết khí.`:''}`,'gold');
  if(c.drop&&Math.random()<c.drop){
    const k=pick(DROP_POOL[c.k]||SHOP);gainGu(k,true);log(`Trên người đối thủ có một con ${GU[k].n}. Ngươi luyện hóa nó.`,'good');
  }
  if(Math.random()<.25){S.satphat++;log('Trận chiến mài giũa bản năng. Sát phạt +1.','good')}
  if(c.after&&AFTER[c.after])AFTER[c.after]();
  resEnd();saveAll();advance();render();
}

function checkInjury(){
  if(S.hp<maxHp()*.25&&!S.inj){
    const k=pick(Object.keys(INJURY));S.inj={k,t:3};if(k==='mat')S.ngo-=2;
    log(`Trận chiến để lại di chứng: ${INJURY[k].n} (${INJURY[k].d}) trong 3 tuần.`,'danger');
  }
}
function healInjury(){
  if(!S.inj)return;
  if(S.inj.k==='mat')S.ngo+=2;
  log(`${INJURY[S.inj.k].n} đã lành.`,'good');S.inj=null;
}
function pickTrait(k){
  if(!S.traitOpts||!S.traitOpts.includes(k))return;
  S.traitOpts=null;S.trait=k;TRAITS[k].ap();S.hp=maxHp();S.ess=Math.min(S.ess,maxEss());
  log(`Mệnh cách kiếp này: ${TRAITS[k].n}. ${TRAITS[k].up}; ${TRAITS[k].down}.`,'mem');
  cicadaSnap();saveAll();render();
}
function die(cause){
  S.rcap=null;S.result=null;
  if(S.combat&&!S.combat.pko&&window.PIXI&&$('arena')&&!RM){const c=S.combat;c.pko=1;c.cause=cause;FX.busy=true;FX.q({type:'pdie'});saveAll();render();setTimeout(()=>{FX.busy=false;if(S.combat===c)die(cause)},1100);return}
  const back=cicadaReady()&&(S.snaps||[]).length>0,foe=S.combat&&S.combat.k;
  S.combat=null;S.hp=0;S.evq=[];S.over=back?'rewind':'dead';S.ff=null;FX.queue.length=0;
  META.deaths.push({life:META.life,turn:S.turn,cause,rewind:back});
  // Chết dưới tay ai thì nhớ được thói quen kẻ đó
  if(back&&foe&&DEATH_MEM[foe])learn(DEATH_MEM[foe]);
  log('Mắt ngươi tối sầm. Tiếng tim đập chậm dần.','big');
  if(!back)log(`Xuân Thu Thiền mới hồi phục ${Math.floor(cicadaCharge())}%, không đủ sức nghịch chuyển quang âm.`,'danger');
  saveAll();render();
}
function rebirth(){
  ffSaveLife();echoSave();
  META.life++;newLife();saveAll();render();
}

/* ---------- Cổ Đồ Giám Modal ---------- */
function renderCodexModal(){
  const known=new Set(META.codex||[]);
  const list=Object.entries(GU).map(([k,d])=>{
    const has=known.has(k);
    const u=guImgUrl(k);
    return `<div class="codex-card ${has?'':'locked'}">
      ${u?`<div class="codex-img" style="background-image:url('${u}')"></div>`:''}
      <div class="row"><b>${has?d.n:'??? Cổ Trùng'}</b><span class="pill">${has?CH[d.r]+' chuyển':'Chưa biết'}</span></div>
      <small>${has?d.d:'Chưa từng sở hữu qua các kiếp.'}</small>
      <small class="dimt">${has?`Thức ăn: ${d.fn} · ${d.food?d.food+' thạch/tuần':'không tốn thạch'}`:'Cần tìm kiếm hoặc luyện thành'}</small>
    </div>`;
  }).join('');

  $('modalContainer').innerHTML=`
    <div class="modal-overlay" id="modalBackdrop">
      <div class="modal-box">
        <div class="modal-head">
          <h2>Cổ Đồ Giám (${known.size}/${Object.keys(GU).length})</h2>
          <button class="btn" id="closeModalBtn">Đóng</button>
        </div>
        <div class="modal-body">
          <p class="dimt">Tất cả những cổ trùng thiên địa mà ngươi từng luyện hóa qua các kiếp luân hồi.</p>
          <div class="codex-grid">${list}</div>
        </div>
      </div>
    </div>`;
}
function closeModal(){$('modalContainer').innerHTML='';}

/* Giao diện nằm trong js/ui.js */

let armed=null;
function confirm2(btn,key,label){
  if(armed===key){armed=null;return true}
  armed=key;btn.textContent=label;setTimeout(()=>{if(armed===key){armed=null;render()}},3000);return false;
}
document.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b||b.disabled)return;
  if(b.id==='resetBtn'){
    if(!confirm2(b,'reset','Bấm lần nữa để xóa hết'))return;
    try{sessionStorage.removeItem('tms-entered')}catch(e){}
    META=freshMeta();newLife();saveAll();render();b.textContent='Xóa toàn bộ, chơi lại';return;
  }
  if(b.id==='soundBtn'){
    if(window.SFX){
      const m=SFX.toggleMute();
      b.textContent=m?'Âm thanh: tắt':'Âm thanh: bật';
    }
    return;
  }
  if(b.id==='codexBtn'){
    renderCodexModal();
    return;
  }
  if(b.id==='closeModalBtn'||b.id==='modalBackdrop'){
    closeModal();
    return;
  }
  const d=b.dataset;
  if(d.a){
    switch(d.a){
      case 'close':S.panel=null;resEnd();saveAll();render();return;
      case 'resok':return; // kết quả giờ dùng toast, giữ lại cho tương thích
      case 'market':S.panel='market';render();return;
      case 'gamble':S.panel='gamble';render();return;
      case 'refine':S.panel='refine';render();return;
      case 'absorb':absorb();return;
      case 'pend':goPend();return;
      case 'fightmode':(META.opt=META.opt||{}).turn=!META.opt.turn;saveAll();render();return;
      case 'endweek':endWeek();return;
      case 'rebirth':cicadaScene('dead',rebirth);return;
      case 'chapretry':cicadaScene('dead',restartChapter);return;
      case 'q2':startQ2(S.ending);return;
      case 'rewind':cicadaScene('rewind',()=>rewindTime(false));return;
      case 'newgame':META.wins.push(S.ending);const w=META.wins;META=freshMeta();META.wins=w;newLife();saveAll();render();return;
      case 'thien':
        if(!confirm2(b,'thien','Bấm lần nữa: mất hết, quay về khai khiếu'))return;
        cicadaScene('rewind',()=>rewindTime(true));return;
      default:act(d.a);return;
    }
  }
  if(d.rt!==undefined)return rtAct(d.rt,d.i===undefined?undefined:(d.rt==='combo'?d.i:+d.i));
  if(d.trait)return pickTrait(d.trait);
  if(d.ch!==undefined)return choose(+d.ch);
  if(d.scCh!==undefined)return scChoose(+d.scCh);
  if(d.scFinish!==undefined)return scFinish();
  if(d.scNext!==undefined)return scNextTalk();
  if(d.scSkip!==undefined)return scSkipTalk();
  if(d.f)return playerAct(d.f,+d.i);
  if(d.combo)return playerAct('combo',d.combo);
  if(d.gamble)return startStone(d.gamble);
  if(d.cult!==undefined)return cultivate(+d.cult);
  if(d.buy!==undefined)return buyGu(+d.buy);
  if(d.sell!==undefined)return sellGu(+d.sell);
  if(d.item)return buyItem(d.item);
  if(d.refine!==undefined)return startRefine(+d.refine);
  if(d.use!==undefined)return useGu(+d.use);
});
document.addEventListener('click',ev=>{
  const talkBox=ev.target.closest('[data-sc-next]');
  if(talkBox&&!ev.target.closest('button'))scNextTalk();
});
document.addEventListener('keydown',ev=>{
  // Kết quả giờ dùng toast tự tắt, không cần phím tắt
  if((ev.key===' '||ev.key==='Enter')&&S&&S.sc&&!S.combat&&!S.over){
    const scEv=EV[S.sc.id];
    if(scEv&&scEv.scene){
      const node=scCurrentNode(scEv);
      const talk=S.sc.subTalk||scTalk(node);
      const activeIdx=S.sc.subTalk?S.sc.subIdx:S.sc.talkIdx;
      if(activeIdx<talk.length){
        ev.preventDefault();
        scNextTalk();
      }
    }
  }
});

function start(data){
  if(data&&data.S&&data.META){S=data.S;META=data.META}
  else{const l=loadAll();if(l){S=l.s;META=l.m}else{META=freshMeta();newLife()}}
  S.mod=S.mod||{};S.var=S.var||{};S.world=S.world||[];S.cache=S.cache||[];S.mem=S.mem||{};S.combos=S.combos||{};
  S.drift=S.drift||0;S.driftStep=S.driftStep||0;S.later=S.later||[];
  if(S.combat&&S.combat.rt)S.combat.rt.paused=true;
  if(S.ap===undefined)S.ap=S.acted?0:AP_WEEK;if(S.pend===undefined)S.pend=null;
  // Tải lại giữa lúc đang tua thì trả quyền điều khiển cho người chơi
  if(S.ff)S.ff=null;
  // Save cũ có thể còn cổ trùng hoặc sát chiêu đã bị bỏ khỏi dữ liệu: lọc đi để không lỗi khi hiển thị
  S.gu=(S.gu||[]).filter(g=>GU[g.k]);S.shop=(S.shop||[]).filter(k=>GU[k]);META.codex=(META.codex||[]).filter(k=>GU[k]);
  for(const id in S.combos)if(!COMBOS.some(c=>c.id===id))delete S.combos[id];
  if(S.combat){const c=S.combat;c.tr=c.tr||foeTraits(c.k);c.cd=c.cd||{};c.frozen=c.frozen||{};c.def=c.def||0;c.turn=c.turn||0;c.atkBuff=c.atkBuff||0;c.poison=c.poison||0;c.suppress=c.suppress||0;c.shieldRed=c.shieldRed||.4}
  // Tải lại giữa lúc đang diễn đòn kết liễu
  if(S.combat&&S.combat.hp<=0){S.combat.ko=1;win();return}
  if(S.combat&&S.hp<=0){S.combat.pko=1;die(S.combat.cause||S.combat.n);return}
  render();
}
window.claude?.hot?.snapshot?.(()=>({S,META}));
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
