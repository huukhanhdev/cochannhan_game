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
function mem(k){return !!META.mem[k]}
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
  if(!META.mem[k]){
    META.mem[k]=1;
    log(`Ký ức khắc sâu: ${MEM[k]?MEM[k].n:k}. Kiếp sau vẫn còn nhớ.`,'mem');
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
function maxHp(){return Math.round((70+40*S.chuyen+S.gu.reduce((s,g)=>s+((GU[g.k]||{}).hp||0),0))*((S.mod&&S.mod.hp)||1))}
function maxEss(){
  const base=MAXE[S.chuyen];
  const tcMod=(S.tuchat||44)/44;
  return Math.round(base*tcMod*((S.mod&&S.mod.ess)||1));
}
function injMat(){return S.inj&&S.inj.k==='mat'?2:0}
function need(){return NEED[S.chuyen][S.giai]}
function passAtk(){return S.gu.reduce((s,g)=>s+(GU[g.k].atk||0),0)}
function rankMult(){return 1+.45*(S.chuyen-1)+.05*S.giai}
function baseAtk(){return Math.max(1,4+S.satphat+3*S.chuyen+passAtk()-(S.inj&&S.inj.k==='tay'?3:0))}
function cultMult(){
  const tcBonus=((S.tuchat||44)-44)*0.01;
  return (1+S.gu.reduce((s,g)=>s+(GU[g.k].cult||0),0)+.05*Math.min(META.life-1,5)+tcBonus)*(S.inj&&S.inj.k==='kinh'?.7:1)*(W('linhmach')?1.15:1);
}
function foodCost(){
  return S.gu.reduce((s,g)=>s+(g.k==='nguyetquang'&&S.f.freeMoon?0:(GU[g.k].food||0)*(g.k==='nguyetquang'&&W('dathan')?2:1)+(W('dichco')&&GU[g.k].t!=='fate'?1:0)),0)+((S.mod&&S.mod.food)||0);
}
function rankName(){return `${CH[S.chuyen]} chuyển ${GIAI[S.giai]} giai`}
function talentName(tc){
  tc=tc||44;
  if(tc>=85) return `Giáp đẳng (${tc}%)`;
  if(tc>=65) return `Ất đẳng (${tc}%)`;
  if(tc>=40) return `Bính đẳng (${tc}%)`;
  return `Đinh đẳng (${tc}%)`;
}
function month(){return Math.ceil(S.turn/3)}
function tuan(){return TUAN[(S.turn-1)%3]}
function log(t,c){if(!t)return;S.log.push({t,c:c||''});if(S.log.length>160)S.log.splice(0,S.log.length-160)}
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
function newLife(){
  const startTalent = 44;
  S={v:2,turn:0,chuyen:1,giai:0,prog:0,ess:25,hp:90,stones:20,blood:0,wine:0,herbs:1,
    tuchat:startTalent,tamco:8,satphat:3,ngo:6,dao:0,danh:10,susp:0,canonHit:0,canonMiss:0,
    gu:[{k:'xuanthu',h:0}],rel:{},met:{},f:{hs:0},shop:[],evq:[],combat:null,panel:null,
    over:null,ending:null,acted:false,refined:false,log:[],mod:{},inj:null,
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
    log(`Lần thử thứ ${META.life}. Xuân Thu Thiền đã không kịp cứu ngươi, mọi thứ bắt đầu lại từ lễ khai khiếu.`,'big');
    const n=Object.keys(META.mem).length;
    log(`Tu vi, nguyên thạch, cổ trùng đều tan biến. Chỉ còn ${n} mảnh ký ức và đạo tâm vững hơn (tu luyện +${5*Math.min(META.life-1,5)}%).`,'sys');
  }
  S.path=[];S.ffOffer=META.life>1&&ffAvailable();S.cicada={charge:0};S.snaps=[];S.rewinds=0;S.drift=0;S.driftStep=0;S.later=[];
  S.world=Object.keys(WORLD).sort(()=>Math.random()-.5).slice(0,2);
  if(W('thuongsom')&&W('langsom'))S.world[1]='hunggia';
  S.canon=buildCanon();
  if(META.life>1)echoApply();
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
  S.turn++;S.acted=false;S.refined=false;
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
  laterTick();
  const cid=(S.canon||CANON)[S.turn];
  if(cid&&(!EV[cid].cond||EV[cid].cond()))S.evq.push(cid);
  if((S.f.killedJKS||S.f.jksEscaped)&&!S.f.giaveDone&&S.turn>=14&&(S.susp>=45||S.turn>=18)&&!S.evq.includes('x_giave')){S.f.giaveDone=1;S.evq.push('x_giave')}
  if(S.f.tramthuyAmbush&&S.turn>=22&&!S.evq.length&&Math.random()<.5){S.f.tramthuyAmbush=0;S.evq.push('x_tramthuy')}
  // Dị số chen vào trước tuyến NPC khi tuần này chưa có mốc nguyên tác
  disoTick();
  if(!S.evq.length){
    if(!S.npcProg)S.npcProg={phuongchinh:1,thanhthu:0,bai:0,xich_mac:0,caumo:1};
    for(const qid of NPC_POOL){
      if(EV[qid]&&(!EV[qid].cond||EV[qid].cond())&&!S.f[qid]&&!S.evq.includes(qid)){
        S.evq.push(qid);
        break;
      }
    }
  }
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
  if(S.acted)endTurn();
}

/* ---------- sự kiện ---------- */
function choicesOf(ev){const c=typeof ev.choices==='function'?ev.choices():ev.choices;return typeof probeChoices==='function'?probeChoices(ev,c):c}
function choose(i){
  if(S.traitOpts)return;
  const id=S.evq[0],ev=EV[id];if(!ev)return;
  (META.seen=META.seen||{})[id]=1;
  const chs=choicesOf(ev),c=chs[i];
  if(!c||(c.req&&!c.req()))return;
  // Lựa chọn phụ (stay): cảnh vẫn mở, lựa chọn đó biến mất
  if(c.stay){(S.picked=S.picked||{})[id+':'+c.stay]=1;log(`【${ev.title}】 ${c.t}.`,'choice');log(c.eff());saveAll();render();return}
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
  saveAll();advance();render();
}
// Rút một sự kiện ngẫu nhiên của nơi chốn loc.
// Chống lặp: sự kiện vừa ra phải chờ hồi chiêu (mặc định nửa cỡ kho, tối đa 6 tuần);
// gặp càng nhiều thì càng hiếm; kiếp sau ưu tiên chuyện chưa từng thấy.
function randomEvent(loc){
  S.evLast=S.evLast||{};S.evSeen=S.evSeen||{};
  const all=Object.entries(EV).filter(([id,e])=>e.loc===loc&&(!e.cond||e.cond())&&!(e.once&&S.f['ev_'+id]));
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
  if(S.combat||S.over||S.evq.length||S.acted||S.traitOpts||S.mg)return;
  ffRecord('act',{a:id});
  if(S.book===2&&act2(id))return;
  S.panel=null;
  const ci=(S.cache||[]).findIndex(c=>c.loc===id&&!c.done&&S.turn>=c.from&&S.turn<=c.to);
  if(ci>=0&&Math.random()<(S.cache[ci].rumor?.85:.4)){S.curCache=ci;S.evq.push('x_cache');S.acted=true;saveAll();advance();render();return}
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
    case 'hauson':S.evq.push(['hs_khe','hs_bich','hs_ngam','hs_dong','hs_mo'][Math.min(S.f.hs||0,4)]);break;
    case 'nhiemvu':
      if(Math.random()<.45&&randomEvent('nhiemvu'))break;
      AFTER.nv();break;
    case 'robgate':S.dao=clamp(S.dao+3,-100,100);S.susp+=W('hocnghiem')?10:5;S.danh-=3;fight('hoctro',{scale:1});break;
    case 'nghi':
      S.hp=Math.min(maxHp(),S.hp+Math.round(maxHp()*.5));S.ess=Math.min(maxEss(),S.ess+Math.round(maxEss()*.4));
      if(S.inj){S.inj.t-=2;log(`Tĩnh dưỡng giúp ${INJURY[S.inj.k].n} mau lành.`,'good');if(S.inj.t<=0)healInjury()}
      log('Ngươi tĩnh dưỡng, nghe gió núi thổi qua rừng trúc.','sys');break;
  }
  S.acted=true;
  saveAll();advance();render();
}

function absorb(){
  if(S.stones<5||S.ess>=maxEss()||S.combat)return;
  S.stones-=5;S.ess=Math.min(maxEss(),S.ess+25);
  if(window.SFX) SFX.coin();
  log(`Hấp thu 5 nguyên thạch. Chân nguyên ${ESS[S.chuyen].n} +25.`);saveAll();render();
}

/* ---------- tu luyện ---------- */
function cultMaxStones(){return Math.ceil(maxEss()/5)}
function cultivate(st){
  S.stones=Math.max(0,S.stones);
  if(st>S.stones||st>cultMaxStones())return;
  ffRecord('cult',{n:st});
  const e=Math.floor(S.ess);S.stones-=st;
  const gain=Math.round((e+st*5)*cultMult());
  S.ess=0;S.prog+=gain;
  log(`Bế quan mười ngày. Dùng ${e} chân nguyên${st?` và ${st} nguyên thạch`:''}. Tu vi +${gain}.`);
  META.combos=META.combos||{};
  COMBOS.filter(cb=>!META.combos[cb.id]&&cb.req.every(k=>hasGu(k))).forEach(cb=>{
    if(Math.random()<.3+(S.ngo-6)*.05){META.combos[cb.id]=1;log(`Trong lúc bế quan, ngươi ngộ ra sát chiêu【${cb.n}】. Kiếp sau vẫn nhớ.`,'mem');FX.toastMsg={g:'悟',t:'Ngộ ra '+cb.n,cls:'win'}}
  });
  levelUp();
  S.panel=null;S.acted=true;
  saveAll();advance();render();
}
function levelUp(){
  while(S.prog>=need()){
    if(S.giai<3){
      S.prog-=need();S.giai++;
      if(window.SFX) SFX.levelUp();
      log(`Bích khiếu rung động. Đạt ${rankName()}.`,'good');
    }
    else if(S.chuyen<maxChuyen()){
      if(typeof startBreak==='function'){log('Tu vi đã đầy. Đến lúc xung kích bích khiếu.','big');startBreak();break}
      const ch=.65+(S.ngo-6)*.02+((S.tuchat||44)-44)*0.005;
      if(Math.random()<ch){
        S.chuyen++;S.giai=0;S.prog=0;S.ess=Math.round(maxEss()*.4);S.hp=maxHp();
        if(window.SFX) SFX.levelUp();
        log(`Đột phá! Chân nguyên hóa thành ${ESS[S.chuyen].n}. ${rankName()}.`,'big');
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
  const need_={xaloi1:1,xaloi2:2,xaloi3:3}[g.k]||2;
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
function refineChance(r){return Math.min(.95,r.ch+(S.ngo-6)*.03+(S.f.refineBonus||0)/100)}
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
  o=o||{};
  const e=EN[k],ai=EAI[k]||{},sc=o.scale?1+.45*(S.chuyen-1):1,elite=!!o.elite;
  const f=sc*(o.mod||1)*(elite?1.3:1);
  S.combat={id:Date.now(),k,n:(elite?'Tinh anh · ':'')+e.n,wolf:!!e.wolf,
    hp:Math.round(e.hp*f*DIFF.hp),max:Math.round(e.hp*f*DIFF.hp),
    atk:[Math.round(e.atk[0]*f*DIFF.atk),Math.round(e.atk[1]*f*DIFF.atk)],
    def:Math.round((ai.def||0)*Math.sqrt(sc)*(elite?1.3:1)),sk:ai.sk||null,boss:!!ai.boss,tr:foeTraits(k),
    st:[Math.round(e.st[0]*sc*(elite?1.6:1)),Math.round(e.st[1]*sc*(elite?1.6:1))],
    bl:e.bl+(elite?2:0),drop:(e.drop||0)+(elite?.3:0),after:o.after||null,spare:o.spare||0,spareT:o.spareT||'',spareAfter:o.spareAfter||null,flee:o.flee!==false&&(!ai.noflee||!!o.canFlee),
    shield:0,shieldRed:.4,bleed:0,stun:0,reflect:0,poison:0,suppress:0,atkBuff:0,turn:0,cd:{},frozen:{},phase2:false,intent:'atk'};
  S.panel=null;
  nextIntent();
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
  S.hp=Math.max(1,S.hp);log(c.spareT||`${c.n} thu tay, bỏ đi.`,'danger');
  if(c.spareAfter&&AFTER[c.spareAfter])AFTER[c.spareAfter]();
  S.combat=null;checkInjury();saveAll();advance();render();return true;
}
function playerAct(type,arg){
  const c=S.combat;if(!c||FX.busy||c.ko)return;
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
    const d=hitFoe(baseAtk()*vary(),false,{type:'patk',kind:'fist'});
    if(d)log(`Ngươi xuất quyền. ${c.n} mất ${d}.`);
  }else if(type==='gu'){
    const key=S.gu[arg]&&S.gu[arg].k,g=GU[key];
    if(!g||!guReady(key))return;
    const hung=(S.gu[arg].h||0);
    const cost=guCostIdx(arg);if(S.ess<cost)return;
    S.ess-=cost;c.cd[key]=(CD[key]??2)+1;
    if(hung)log(`${g.n} đang đói, sức yếu hẳn đi.`,'danger');
    if(g.t==='attack'){
      if(window.SFX)SFX.blade();
      const d=hitFoe((g.dmg*rankMult()*(1-.25*hung)+passAtk())*vary(),!!g.pierce,{type:'patk',kind:key},!!g.aoe);
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
      c.shield=key==='thienbong'||key==='mokmi'?3:2;
      c.shieldRed=SHIELD_RED[key]||.4;
      c.reflect=key==='thienbong'?.25:key==='mokmi'?.3:(g.reflect||0);c.warm=!!g.warm;
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
    if(Math.random()<.45+S.satphat*.01-(c.boss?.15:0)+((S.mod&&S.mod.flee)||0)+(hasGu('anlan')?.2:0)){
      log('Ngươi rút vào rừng trúc, cắt đuôi được đối thủ.','sys');
      FX.toastMsg={g:'走',t:'Thoát khỏi '+c.n,cls:'run'};
      S.combat=null;checkInjury();saveAll();advance();render();return;
    }
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
  saveAll();advance();render();
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
  if(S.combat&&!S.combat.pko&&window.PIXI&&$('arena')&&!RM){const c=S.combat;c.pko=1;c.cause=cause;FX.busy=true;FX.q({type:'pdie'});saveAll();render();setTimeout(()=>{FX.busy=false;if(S.combat===c)die(cause)},1100);return}
  const back=cicadaReady()&&(S.snaps||[]).length>0,foe=S.combat&&S.combat.k;
  S.combat=null;S.hp=0;S.evq=[];S.over=back?'rewind':'dead';S.ff=null;FX.queue.length=0;
  META.deaths.push({life:META.life,turn:S.turn,cause,rewind:back});
  // Chết dưới tay ai thì nhớ được thói quen kẻ đó
  if(foe&&DEATH_MEM[foe])learn(DEATH_MEM[foe]);
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
      case 'close':S.panel=null;render();return;
      case 'market':S.panel='market';render();return;
      case 'gamble':S.panel='gamble';render();return;
      case 'refine':S.panel='refine';render();return;
      case 'absorb':absorb();return;
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
  if(d.trait)return pickTrait(d.trait);
  if(d.ch!==undefined)return choose(+d.ch);
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

function start(data){
  if(data&&data.S&&data.META){S=data.S;META=data.META}
  else{const l=loadAll();if(l){S=l.s;META=l.m}else{META=freshMeta();newLife()}}
  S.mod=S.mod||{};S.var=S.var||{};S.world=S.world||[];S.cache=S.cache||[];META.combos=META.combos||{};
  S.drift=S.drift||0;S.driftStep=S.driftStep||0;S.later=S.later||[];
  // Tải lại giữa lúc đang tua thì trả quyền điều khiển cho người chơi
  if(S.ff)S.ff=null;
  // Save cũ có thể còn cổ trùng hoặc sát chiêu đã bị bỏ khỏi dữ liệu: lọc đi để không lỗi khi hiển thị
  S.gu=(S.gu||[]).filter(g=>GU[g.k]);S.shop=(S.shop||[]).filter(k=>GU[k]);META.codex=(META.codex||[]).filter(k=>GU[k]);
  for(const id in META.combos)if(!COMBOS.some(c=>c.id===id))delete META.combos[id];
  if(S.combat){const c=S.combat;c.tr=c.tr||foeTraits(c.k);c.cd=c.cd||{};c.frozen=c.frozen||{};c.def=c.def||0;c.turn=c.turn||0;c.atkBuff=c.atkBuff||0;c.poison=c.poison||0;c.suppress=c.suppress||0;c.shieldRed=c.shieldRed||.4}
  // Tải lại giữa lúc đang diễn đòn kết liễu
  if(S.combat&&S.combat.hp<=0){S.combat.ko=1;win();return}
  if(S.combat&&S.hp<=0){S.combat.pko=1;die(S.combat.cause||S.combat.n);return}
  render();
}
window.claude?.hot?.snapshot?.(()=>({S,META}));
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
