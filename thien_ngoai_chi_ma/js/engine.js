let S, META;
const $=id=>document.getElementById(id);
const rand=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

/* ---------- lưu trữ ---------- */
function freshMeta(){
  return {life:1,wins:[],codex:['dihon']};
}
function saveAll(){
  try{
    localStorage.setItem('tncm-save',JSON.stringify(S));
    localStorage.setItem('tncm-meta',JSON.stringify(META));
  }catch(e){}
}
function loadAll(){
  try{
    const m=JSON.parse(localStorage.getItem('tncm-meta'));
    const s=JSON.parse(localStorage.getItem('tncm-save'));
    if(m&&s&&s.v===1)return {m,s};
  }catch(e){}
  return null;
}

/* ---------- tra cứu ---------- */
function meet(k){S.met[k]=1;if(S.rel[k]===undefined)S.rel[k]=0}
function rel(k,v){meet(k);S.rel[k]=clamp(S.rel[k]+v,-100,100)}
function hasGu(k){return S.gu.some(g=>g.k===k)}
function gainGu(k,silent){
  S.gu.push({k,h:0});
  if(META){
    if(!META.codex) META.codex=['dihon'];
    if(!META.codex.includes(k)) META.codex.push(k);
  }
  if(window.SFX) SFX.coin();
  if(!silent)log(`Thu phục ${GU[k].n}.`,'good');
}
function maxHp(){return 70+35*S.chuyen}
function maxEss(){
  const base=MAXE[S.chuyen];
  const tcMod=(S.tuchat||55)/50;
  return Math.round(base*tcMod);
}
function need(){return NEED[S.chuyen][S.giai]}
function passAtk(){return S.gu.reduce((s,g)=>s+(GU[g.k].atk||0),0)}
function baseAtk(){return 5+S.satphat+4*S.chuyen+passAtk()}
function cultMult(){
  const perkBonus = S.perk === 'science' ? 0.25 : 0;
  return 1+S.gu.reduce((s,g)=>s+(GU[g.k].cult||0),0)+perkBonus;
}
function foodCost(){
  return S.gu.reduce((s,g)=>s+(GU[g.k].food||0),0);
}
function rankName(){return `${CH[S.chuyen]} chuyển ${GIAI[S.giai]} giai`}
function talentName(tc){
  tc=tc||55;
  if(tc>=85) return `Giáp đẳng (${tc}%)`;
  if(tc>=65) return `Ất đẳng (${tc}%)`;
  if(tc>=40) return `Bính đẳng (${tc}%)`;
  return `Đinh đẳng (${tc}%)`;
}
function month(){return Math.ceil(S.turn/3)}
function tuan(){return TUAN[(S.turn-1)%3]}
function log(t,c){if(!t)return;S.log.push({t,c:c||''});if(S.log.length>180)S.log.splice(0,S.log.length-180)}

function chance(a,dc,b){return clamp(Math.round((21-(dc-S[a]-(b||0)))/20*100),5,100)}
function roll(a,dc,b){
  b=b||0;const d=rand(1,20),tot=d+S[a]+b,ok=tot>=dc;
  return {ok,text:`${ATTR[a]} ${S[a]}${b?' + '+b:''} + xúc xắc ${d} = ${tot}, cần ${dc}: ${ok?'thành công':'thất bại'}.`};
}

/* ---------- tạo nhân vật ---------- */
function initNewCharacter(name, originId, perkId){
  const origin = ORIGINS[originId] || ORIGINS.cuyet;
  const perk = OTHERWORLDLY_PERKS[perkId] || OTHERWORLDLY_PERKS.science;

  S = {
    v: 1,
    name: name || 'Lâm Tiêu',
    origin: originId,
    perk: perkId,
    turn: 0,
    chuyen: 1,
    giai: 0,
    prog: 0,
    tuchat: 60,
    ess: 30,
    hp: 105,
    stones: origin.stones,
    blood: 0,
    tamco: 8 + (origin.bonusAttr.tamco || 0),
    satphat: 5 + (origin.bonusAttr.satphat || 0),
    ngo: 7 + (origin.bonusAttr.ngo || 0) + (perkId === 'science' ? 3 : 0),
    dao: 0,
    danh: 5,
    susp: 0,
    suspPN: 0, // Hiềm nghi từ Phương Nguyên
    gu: [{k:'dihon',h:0}],
    rel: {},
    met: {},
    f: {},
    shop: [],
    evq: [],
    combat: null,
    panel: null,
    over: null,
    ending: null,
    acted: false,
    refined: false,
    log: []
  };
  window.S = S;

  if(!META) META = freshMeta();
  if(!META.codex) META.codex = ['dihon'];
  if(!META.codex.includes('dihon')) META.codex.push('dihon');
  if(!META.codex.includes(origin.initGu)) META.codex.push(origin.initGu);

  log(`Linh hồn dị giới tỉnh giấc trong thân xác thiếu niên ${S.name} thuộc ${origin.n}.`,'big');
  log(`Thiên phú dị giới thức tỉnh: 【${perk.n}】 - ${perk.d}`,'gold');

  if(window.SFX) SFX.soul();
  rollShop();
  startTurn();
}

function startTurn(){
  S.turn++;S.acted=false;S.refined=false;
  log(`Tháng ${month()} · ${tuan()}`,'day');
  if(S.turn>1){
    const essRecover = Math.round(maxEss() * (0.55 + (S.tuchat||55)*0.003));
    S.ess = Math.min(maxEss(), S.ess + essRecover);
    S.hp = Math.min(maxHp(), S.hp + Math.round(maxHp()*.25));
    S.susp = Math.max(0, S.susp - 5);
    if(S.turn%3===1){
      S.stones += 15;
      log('Nhận trợ cấp tài nguyên tháng: 15 nguyên thạch.','gold');
      rollShop();
    }
  }
  const cid=CANON[S.turn];
  if(cid&&(!EV[cid].cond||EV[cid].cond()))S.evq.push(cid);
}

function endTurn(){
  const cost=foodCost();
  if(S.stones>=cost){
    S.stones-=cost;S.gu.forEach(g=>g.h=0);
    if(cost)log(`Nuôi cổ tiêu hao ${cost} nguyên thạch.`,'sys');
  }else{
    let left=S.stones;
    S.gu.forEach(g=>{
      const f=GU[g.k].food;
      if(!f)return;
      if(left>=f){left-=f;g.h=0}else g.h++;
    });
    S.stones=left;
    log('Không đủ nguyên thạch nuôi cổ. Cổ trùng đang đói!','danger');
    S.gu.filter(g=>g.h>=3).forEach(g=>log(`${GU[g.k].n} chết đói!`,'danger'));
    S.gu=S.gu.filter(g=>g.h<3);
  }
  startTurn();
}

function advance(){
  if(S.over||S.combat||S.evq.length||S.panel==='tuluyen')return;
  if(S.acted)endTurn();
}

/* ---------- sự kiện ---------- */
function choicesOf(ev){return typeof ev.choices==='function'?ev.choices():ev.choices}
function choose(i){
  const id=S.evq[0],ev=EV[id];if(!ev)return;
  const chs=choicesOf(ev),c=chs[i];
  if(!c||(c.req&&!c.req()))return;
  S.evq.shift();
  if(c.tag==='ma')S.dao=clamp(S.dao+8,-100,100);
  if(c.tag==='chinh')S.dao=clamp(S.dao-8,-100,100);
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
  if(S.hp<=0&&!S.combat){die(`${ev.title}`);return}
  saveAll();advance();render();
}

/* ---------- hành động tuần ---------- */
const ACTS=[
  {id:'tuluyen',n:'Bế quan tu luyện',icon:'🧘',d:'Hấp thu chân nguyên vào không khiếu.'},
  {id:'luyenkiem',n:'Diễn võ trường',icon:'⚔️',d:'Luyện tập đòn đánh, tăng Sát phạt.'},
  {id:'trai',n:'Dạo quanh sơn trại',icon:'🏮',d:'Dò la động tĩnh Phương Nguyên và gia tộc.'},
  {id:'nui',n:'Vào núi săn thú',icon:'🌲',d:'Săn heo rừng, điện lang, tìm kiếm cơ duyên.'},
  {id:'chotroi',n:'Ghé chợ cổ sư',icon:'⛺',d:'Mua bán cổ trùng và tài nguyên.'},
  {id:'nghi',n:'Tĩnh dưỡng hồi sức',icon:'🍵',d:'Hồi phục toàn bộ khí huyết.'},
];

function act(id){
  if(S.combat||S.over||S.evq.length||S.acted)return;
  S.panel=null;
  switch(id){
    case 'tuluyen':S.panel='tuluyen';render();return;
    case 'luyenkiem':
      S.satphat++;
      if(window.SFX) SFX.blade();
      log('Luyện kiếm cả ngày, kiếm khí càng thêm sắc bén. Sát phạt +1.','good');
      break;
    case 'trai':
      if(Math.random()<0.4){
        meet('phuongnguyen');
        log('Bắt gặp Phương Nguyên lầm lũi đi qua con hẻm, hắn liếc nhìn ngươi đầy cảnh giác.','sys');
      } else {
        log('Dạo một vòng sơn trại, nghe Cổ sư bàn tán về khảo hạch sắp tới.','sys');
      }
      break;
    case 'nui':
      fight(pick(S.chuyen===1?['heorung','dienlang','tanbinh']:['dienlang','hachung','loiquan']),{scale:1});
      break;
    case 'chotroi':
      S.panel='market';render();return;
    case 'nghi':
      S.hp=maxHp();S.ess=Math.min(maxEss(),S.ess+Math.round(maxEss()*.4));
      log('Ngươi điều dưỡng tâm thần, thể lực phục hồi hoàn toàn.','sys');
      break;
  }
  S.acted=true;
  saveAll();advance();render();
}

function cultivate(st){
  if(st>S.stones)return;
  const e=Math.floor(S.ess);S.stones-=st;
  const gain=Math.round((e+st*5)*cultMult());
  S.ess=0;S.prog+=gain;
  log(`Bế quan mười ngày. Tu vi +${gain}.`);
  levelUp();
  S.panel=null;S.acted=true;
  saveAll();advance();render();
}
function levelUp(){
  while(S.prog>=need()){
    if(S.giai<3){
      S.prog-=need();S.giai++;
      if(window.SFX) SFX.levelUp();
      log(`Bích khiếu rung động! Đạt ${rankName()}.`,'good');
    }
    else if(S.chuyen<3){
      const ch=.65+(S.ngo-7)*.02+((S.tuchat||55)-50)*0.005;
      if(Math.random()<ch){
        S.chuyen++;S.giai=0;S.prog=0;S.ess=Math.round(maxEss()*.4);S.hp=maxHp();
        if(window.SFX) SFX.levelUp();
        log(`Đột phá đại cảnh giới! Chân nguyên hóa ${ESS[S.chuyen].n}. ${rankName()}!`,'big');
      }else{
        S.prog=Math.floor(need()*.5);S.hp=Math.max(1,S.hp-Math.round(maxHp()*.3));
        log(`Đột phá thất bại. Chân nguyên phản phệ, tu vi tổn hao một nửa.`,'danger');
      }
      break;
    }else{S.prog=need();break}
  }
}

/* ---------- chợ & hợp luyện ---------- */
function rollShop(){
  const pool=[...(S.chuyen>1?CARAVAN:SHOP)];S.shop=[];
  for(let i=0;i<4&&pool.length;i++)S.shop.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
}
function buyGu(i){
  const k=S.shop[i];if(!k||S.stones<GU[k].p)return;
  S.stones-=GU[k].p;gainGu(k,true);S.shop.splice(i,1);
  if(window.SFX) SFX.coin();
  log(`Mua ${GU[k].n} giá ${GU[k].p} nguyên thạch.`,'gold');saveAll();render();
}
function sellGu(i){
  const g=S.gu[i];if(!g||GU[g.k].t==='fate')return;
  const v=Math.floor(GU[g.k].p*.45);S.stones+=v;S.gu.splice(i,1);
  if(window.SFX) SFX.coin();
  log(`Bán ${GU[g.k].n} được ${v} nguyên thạch.`,'gold');saveAll();render();
}

function refine(i){
  const r=RECIPES[i];
  if(S.refined||!hasGu(r.from)||S.stones<r.st)return;
  if(r.extraGu&&!hasGu(r.extraGu))return;
  S.stones-=r.st;S.refined=true;
  S.gu.splice(S.gu.findIndex(g=>g.k===r.from),1);
  if(r.extraGu){
    const idx=S.gu.findIndex(g=>g.k===r.extraGu);
    if(idx!==-1) S.gu.splice(idx,1);
  }
  const ch = Math.min(.95, r.ch + (S.ngo-7)*.03 + (S.perk==='science'?0.2:0));
  if(Math.random()<ch){
    gainGu(r.id,true);
    if(window.SFX) SFX.levelUp();
    log(`Luyện cổ thành công: ${GU[r.id].n}!`,'big');
  }else{
    log(`Luyện cổ thất bại. Nguyên liệu tan biến!`,'danger');
  }
  saveAll();render();
}

/* ---------- chiến đấu ---------- */
function fight(k,o){
  o=o||{};
  const e=EN[k]||EN.heorung;
  const sc=o.scale?1+.45*(S.chuyen-1):1,f=sc*(o.mod||1);
  S.combat={k,n:e.n,wolf:!!e.wolf,hp:Math.round(e.hp*f),max:Math.round(e.hp*f),
    atk:[Math.round(e.atk[0]*f),Math.round(e.atk[1]*f)],st:[Math.round(e.st[0]*sc),Math.round(e.st[1]*sc)],
    bl:e.bl,drop:e.drop||0,after:o.after||null,flee:o.flee!==false,
    shield:0,stun:0,bleed:0,reflect:0,intent:'atk'};
  S.panel=null;
  nextIntent();
  log(e.i,'danger');
}
function nextIntent(){const r=Math.random();S.combat.intent=r<.2?'heavy':r<.35?'guard':'atk'}

function playerAct(type,arg){
  const c=S.combat;if(!c)return;
  const vary=()=>.85+Math.random()*.3;
  if(type==='strike'){
    if(window.SFX) SFX.blade();
    const d=Math.round(baseAtk()*vary());
    c.hp-=d;
    if(window.FX) FX.q({type:'patk',kind:'fist',dmg:d});
    log(`Ngươi xuất quyền. ${c.n} mất ${d} khí huyết.`);
  }else if(type==='gu'){
    const g=GU[S.gu[arg].k];
    if(S.ess<g.cost)return;
    S.ess-=g.cost;
    if(g.t==='attack'){
      if(window.SFX) SFX.blade();
      const d=Math.round((g.dmg*(1+.3*(S.chuyen-1))+passAtk())*vary());
      c.hp-=d;
      if(window.FX) FX.q({type:'patk',kind:S.gu[arg].k,dmg:d});
      log(`${g.n}! ${c.n} mất ${d} khí huyết.`,'good');
    }else if(g.t==='guard'){
      if(window.SFX) SFX.impact();
      c.shield=2;
      if(window.FX) FX.q({type:'shield'});
      log(`${g.n} hộ thể, giảm 60% sát thương 2 lượt.`,'good');
    }else if(g.t==='heal'){
      if(window.SFX) SFX.soul();
      const h=30+15*S.chuyen;S.hp=Math.min(maxHp(),S.hp+h);
      if(window.FX) FX.q({type:'heal',amt:h});
      log(`Khí huyết hồi phục +${h}.`,'good');
    }
  }else if(type==='combo'){
    const cb=COMBOS.find(x=>x.id===arg);
    if(!cb||S.ess<cb.cost)return;
    S.ess-=cb.cost;
    if(window.SFX) SFX.thunder();
    const d=Math.round((cb.dmg*(1+.3*(S.chuyen-1))+passAtk())*vary());
    c.hp-=d;
    if(window.FX) FX.q({type:'combo',id:cb.id,dmg:d});
    log(`【Sát Chiêu · ${cb.n}】 bộc phát! ${c.n} mất ${d} khí huyết!`,'big');
    if(cb.stun) c.stun=cb.stun;
    if(cb.shield) c.shield=cb.shield;
    if(cb.reflect) c.reflect=cb.reflect;
  }else if(type==='absorb'){
    if(S.stones<5 || S.ess>=maxEss()) return;
    S.stones-=5;
    S.ess=Math.min(maxEss(), S.ess+20);
    if(window.SFX) SFX.coin();
    if(window.FX) FX.q({type:'text',on:'p',t:'+20 Nguyên'});
    log('Bóp nát 5 viên nguyên thạch, bổ sung chân nguyên không khiếu.','gold');
    saveAll();render();return;
  }else if(type==='flee'){
    const bonus = S.gu.reduce((s,g)=>s+(GU[g.k].fleeMod||0),0);
    if(Math.random() < 0.5 + bonus + S.satphat*0.01){
      log('Ngươi luồn lách qua ngọn trúc cắt đuôi đối thủ!','sys');
      S.combat=null;saveAll();advance();render();return;
    }
    log('Chạy trốn thất bại!','danger');
  }

  if(c.hp<=0){
    if(window.FX && window.PIXI && $('arena') && !RM){
      c.hp=0; FX.q({type:'ko'}); saveAll(); render(); setTimeout(()=>win(), 900); return;
    }
    win();return;
  }

  // Địch hành động
  if(c.stun>0){
    c.stun--;
    if(window.FX) FX.q({type:'text',on:'e',t:'Choáng'});
    log(`${c.n} bị choáng váng không thể xuất chiêu!`,'good');
  }else if(c.intent!=='guard'){
    let d=rand(c.atk[0],c.atk[1]);
    if(c.intent==='heavy') d=Math.round(d*1.8);
    if(c.shield>0){ d=Math.round(d*0.4); c.shield--; }
    S.hp-=d;
    if(window.SFX) SFX.impact();
    if(window.FX) FX.q({type:'eatk',dmg:d,heavy:c.intent==='heavy'});
    log(`${c.n} phản kích! Khí huyết −${d}.`,'danger');
    if(c.reflect>0){
      const refDmg=Math.round(d*c.reflect);
      c.hp-=refDmg;
      if(window.FX) FX.q({type:'dot',dmg:refDmg,cls:'reflect'});
      log(`Giáp băng phản kích ${refDmg} sát thương lên ${c.n}!`,'good');
      if(c.hp<=0){
        if(window.FX && window.PIXI && $('arena') && !RM){
          c.hp=0; FX.q({type:'ko'}); saveAll(); render(); setTimeout(()=>win(), 900); return;
        }
        win();return;
      }
    }
    if(S.hp<=0){
      if(window.FX && window.PIXI && $('arena') && !RM){
        FX.q({type:'pdie'}); saveAll(); render(); setTimeout(()=>die(c.n), 1000); return;
      }
      die(c.n);return;
    }
  }else{
    if(window.FX) FX.q({type:'text',on:'e',t:'Thủ thế'});
    log(`${c.n} thủ thế quan sát ngươi.`,'sys');
  }

  nextIntent();
  saveAll();render();
}

function win(){
  const c=S.combat;S.combat=null;
  const st=rand(c.st[0],c.st[1]);
  S.stones+=st;
  if(window.SFX) SFX.coin();
  log(`${c.n} ngã xuống! Nhận +${st} nguyên thạch.`,'gold');
  if(Math.random()<0.3){S.satphat++;log('Sát phạt +1 sau trận huyết chiến.','good')}
  if(c.after&&AFTER[c.after])AFTER[c.after]();
  saveAll();advance();render();
}

function die(cause){
  S.combat=null;S.hp=0;S.evq=[];S.over='dead';
  log(`Thân thể ngã xuống trước ${cause}. Linh hồn dị giới phiêu dạt trong hư vô...`,'big');
  saveAll();render();
}

/* ---------- vẽ giao diện ---------- */
function renderStats(){
  const e=ESS[S.chuyen];
  $('stats').innerHTML=`
    <div class="stat"><span class="label">Tu vi</span><div class="rank">${rankName()}</div>
      <div class="row dimt"><span>Tiến độ</span><span>${S.prog} / ${need()}</span></div></div>
    
    <div class="aperture-wrap">
      <canvas id="apertureCanvas"></canvas>
      <div class="aperture-overlay">KHÔNG KHIẾU HẢI · ${Math.floor(S.ess)} / ${maxEss()}</div>
    </div>

    <div class="stat"><div class="row"><span>Chân nguyên</span><span>${Math.floor(S.ess)} / ${maxEss()}</span></div></div>
    <div class="stat"><div class="row"><span>Khí huyết</span><span>${Math.max(0,S.hp)} / ${maxHp()}</span></div></div>
    <div class="stat"><div class="row"><span>Tư chất</span><span class="gold">${talentName(S.tuchat)}</span></div></div>
    
    <div class="attrs">
      <div><span class="label">Tâm cơ</span><b>${S.tamco}</b></div>
      <div><span class="label">Sát phạt</span><b>${S.satphat}</b></div>
      <div><span class="label">Ngộ tính</span><b>${S.ngo}</b></div>
    </div>

    <div class="kv">
      <div class="row"><span>Nguyên thạch</span><b class="gold">${S.stones}</b></div>
      <div class="row"><span>Nuôi cổ/tuần</span><span>${foodCost()}</span></div>
      <div class="row"><span>Danh vọng</span><span>${S.danh}</span></div>
      <div class="row"><span>Hiềm nghi Phương Nguyên</span><span class="${(S.suspPN||0)>=40?'danger':''}">${S.suspPN||0}%</span></div>
    </div>`;

  if(window.Aperture) Aperture.init();
}

function renderSide(){
  const npcs=Object.keys(S.met);
  $('side').innerHTML=`
    <div class="headrow"><h2>Cổ trùng</h2><span class="pill">${S.gu.length} con</span></div>
    <div class="gu">${S.gu.map((g,i)=>{
      const d=GU[g.k];
      const img=typeof guImgUrl==='function'?guImgUrl(g.k):'';
      const hungerTag=g.h?`<span class="hunger-pill hunger-bad">Đói ${g.h}/3 tuần</span>`:`<span class="hunger-pill hunger-ok">No nê</span>`;
      return `<div class="gucard-rich rank-${d.r}">
        <div class="gu-emblem"${img?` style="background-image:url('${img}')"`:''}>${img?'':(d.t==='fate'?'🌌':'🪲')}</div>
        <div class="gu-body">
          <div class="gu-top"><span class="gu-name">${d.n}</span><span class="pill">${CH[d.r]} chuyển</span></div>
          <div class="gu-desc">${d.d}</div>
          <div class="gu-footer"><small class="dimt">Ăn ${d.fn}</small>${hungerTag}</div>
        </div>
      </div>`;
    }).join('')}</div>
    <div class="headrow" style="margin-top:12px"><h2>Nhân vật tiếp xúc</h2></div>
    <div class="npc-list">${npcs.length?npcs.map(k=>{
      const n=NPC[k]||{n:k,d:''};
      const v=S.rel[k]||0;
      return `<div class="npc-item">
        <span class="npc-ava">👤</span>
        <div class="npc-info"><b>${n.n}</b><small>${n.d}</small></div>
        <span style="font-weight:600;color:${v>=10?'var(--jade)':v<=-10?'var(--blood)':'var(--dim)'}">${v>0?'+':''}${v}</span>
      </div>`;
    }).join(''):'<small class="dimt">Chưa gặp ai.</small>'}</div>`;
}

function renderStage(){
  const st=$('stage');
  if(!S){
    renderCreationScreen(st);
    return;
  }
  if(S.over==='win'){
    const E=ENDINGS[S.ending]||ENDINGS.solo;
    st.innerHTML=`<div class="over">
      <span class="label">Thanh Mao Sơn Kết Thúc · ${rankName()}</span>
      <h3>${E.t}</h3><p>${E.d}</p>
      <button class="btn big" data-a="newchar" style="margin-top:12px">Bắt đầu kiếp khác</button></div>`;
    return;
  }
  if(S.over==='dead'){
    st.innerHTML=`<div class="over">
      <span class="label">Tử Vong</span>
      <h3>Hồn đoạn Thanh Mao Sơn</h3>
      <p>Ngươi đã gục ngã trên con đường trường sinh tàn khốc của Cổ Giới.</p>
      <button class="btn big" data-a="newchar" style="margin-top:12px">Chuyển thế tái sinh</button></div>`;
    return;
  }
  if(S.combat){
    if(typeof renderCombat === 'function'){
      renderCombat(st);
      return;
    }
  }
  if(S.evq.length){
    const ev=EV[S.evq[0]];
    const bgUrl=typeof eventArt==='function'?eventArt(S.evq[0]):'';
    st.innerHTML=`<div class="event canonev">
      ${bgUrl?`<div class="evart" style="background-image:url('${bgUrl}')"></div>`:''}
      <div class="headrow"><h2>${ev.title}</h2><span class="pill canonp">Mốc Cốt Truyện</span></div>
      <p style="margin-top:8px">${esc(ev.text())}</p>
      <div class="choices" style="margin-top:12px">${choicesOf(ev).map(choiceBtn).join('')}</div>
    </div>`;
    return;
  }
  if(S.panel==='tuluyen'){
    const opts=[0,10,25,50].filter(n=>n<=S.stones);
    st.innerHTML=`<div class="headrow"><h2>Bế Quan Tu Luyện</h2><button class="btn" data-a="close">Đóng</button></div>
      <p class="dimt">Chân nguyên hiện có ${Math.floor(S.ess)}. Hệ số tu luyện ×${cultMult().toFixed(2)}.</p>
      <div class="act-grid-rich">${opts.map(n=>`<button class="act-card-rich" data-cult="${n}">
        <div class="act-icon">🧘</div>
        <div class="act-text"><b>${n?`Dùng thêm ${n} nguyên thạch`:'Chỉ dùng chân nguyên'}</b><small class="gold">Tu vi +${Math.round((Math.floor(S.ess)+n*5)*cultMult())}</small></div>
      </button>`).join('')}</div>`;
    return;
  }
  if(S.panel==='market'){
    st.innerHTML=`<div class="headrow"><h2>Chợ Cổ Sư</h2><button class="btn" data-a="close">Đóng</button></div>
      <div class="shop">${S.shop.map((k,i)=>`<div class="item">
        <div><b>${GU[k].n}</b><small>${GU[k].d} Ăn ${GU[k].fn}</small></div>
        <button class="btn" data-buy="${i}" ${S.stones<GU[k].p?'disabled':''}>🪙 ${GU[k].p} thạch</button>
      </div>`).join('')}
      <span class="label" style="margin-top:10px">Bán cổ</span>
      ${S.gu.filter(g=>GU[g.k].t!=='fate').map((g,i)=>`<div class="item">
        <div><b>${GU[g.k].n}</b></div>
        <button class="btn" data-sell="${i}">+${Math.floor(GU[g.k].p*.45)} thạch</button>
      </div>`).join('')}
      </div>`;
    return;
  }

  // Màn hình chọn hành động tuần
  st.innerHTML=`<div class="headrow"><h2>Tuần Này Định Làm Gì?</h2><span class="dimt small">Chọn hoạt động sinh tồn</span></div>
    <div class="act-grid-rich">${ACTS.map(a=>`<button class="act-card-rich" data-a="${a.id}">
      <div class="act-icon">${a.icon}</div>
      <div class="act-text"><b>${a.n}</b><small>${a.d}</small></div>
    </button>`).join('')}</div>
    <div class="minor" style="margin-top:12px">
      <button class="btn" data-a="market">Chợ Cổ Sư</button>
    </div>`;
}

function choiceBtn(c,i){
  const ok=!c.req||c.req();
  const chk=c.check?`<span class="cost">${ATTR[c.check[0]]} · ${chance(c.check[0],c.check[1],c.bonus?c.bonus():0)}% thành công</span>`:'';
  return `<button class="act" data-ch="${i}" ${ok?'':'disabled'}>
    <b>${esc(c.t)}</b>${chk}
    ${!ok&&c.reqT?`<small style="color:var(--blood)">${c.reqT}</small>`:''}
  </button>`;
}

/* ---------- giao diện tạo nhân vật ---------- */
function renderCreationScreen(st){
  st.innerHTML=`<div class="creation-box">
    <div class="headrow"><h2>Giáng Lâm Cổ Giới - Thiên Ngoại Chi Ma</h2></div>
    <p class="dimt">Linh hồn của ngươi vượt qua rào cản không gian, rơi vào thân xác một thiếu niên trên Thanh Mao Sơn.</p>
    
    <div style="margin-top:14px">
      <label class="label">Đạo Hiệu / Họ Tên:</label>
      <input type="text" id="charNameInput" value="Lâm Tiêu" class="name-input" placeholder="Nhập tên nhân vật..."/>
    </div>

    <div style="margin-top:16px">
      <label class="label">Chọn Thân Phận Giáng Lâm:</label>
      <div class="act-grid-rich" id="originSelect" style="margin-top:6px">
        ${Object.values(ORIGINS).map(o=>`<button class="act-card-rich origin-btn ${o.id===selectedOrigin?'active':''}" data-origin="${o.id}">
          <div class="act-icon">${o.icon}</div>
          <div class="act-text"><b>${o.n}</b><small>${o.d}</small></div>
        </button>`).join('')}
      </div>
    </div>

    <div style="margin-top:16px">
      <label class="label">Thiên Phú Dị Giới:</label>
      <div class="act-grid-rich" id="perkSelect" style="margin-top:6px">
        ${Object.values(OTHERWORLDLY_PERKS).map(p=>`<button class="act-card-rich perk-btn ${p.id===selectedPerk?'active':''}" data-perk="${p.id}">
          <div class="act-icon">${p.icon}</div>
          <div class="act-text"><b>${p.n}</b><small>${p.d}</small></div>
        </button>`).join('')}
      </div>
    </div>

    <button class="btn big active" id="startJourneyBtn" style="margin-top:22px;width:100%;font-weight:600">⚡ Giáng Lâm Khai Khiếu (Bắt Đầu)</button>
  </div>`;
}

function renderLog(){
  const el=$('log');
  if(!el) return;
  if(!S || !S.log || !S.log.length){
    el.innerHTML='<p class="sys">Chờ đợi linh hồn dị giới giáng lâm...</p>';
    return;
  }
  el.innerHTML=S.log.map(l=>`<p class="${l.c}">${esc(l.t)}</p>`).join('');
  el.scrollTop=el.scrollHeight;
}

function renderFuture(){
  const fut=$('future');
  if(!fut) return;
  if(!S){ fut.innerHTML=''; return; }
  const up=Object.keys(CANON).map(Number).filter(t=>t>=S.turn).slice(0,4);
  fut.innerHTML=`<span class="label">Tiền Tri Kịch Bản</span>`+up.map(t=>{
    const m=Math.ceil(t/3),tu=TUAN[(t-1)%3].split(' ')[0];
    return `<span class="fut ${t===S.turn?'now':''}"><b>T${m} · ${tu}</b> ${EV[CANON[t]]?EV[CANON[t]].hint:''}</span>`;
  }).join('');
}

function renderMoon(){
  const moon=$('moon');
  if(!moon) return;
  if(!S){ moon.innerHTML=''; return; }
  const p=(((S.turn-1)%3)*10+5)/30,r=20,cx=23,cy=23;
  const off=2*r*(p<.5?p*2:(1-p)*2)*(p<.5?1:-1);
  moon.innerHTML=`<defs><clipPath id="mc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f0ecd8"/>
    <circle cx="${cx-off}" cy="${cy}" r="${r+.5}" fill="#172028" clip-path="url(#mc)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#25323d"/>`;
}

function renderCodexModal(){
  const known=new Set((META&&META.codex)||['dihon']);
  const list=Object.entries(GU).map(([k,d])=>{
    const has=known.has(k);
    const u=typeof guImgUrl==='function'?guImgUrl(k):'';
    return `<div class="codex-card ${has?'':'locked'}">
      ${u?`<div class="codex-img" style="background-image:url('${u}');height:110px;background-size:cover;background-position:center;border-radius:4px"></div>`:''}
      <div class="row"><b>${has?d.n:'??? Cổ Trùng'}</b><span class="pill">${has?CH[d.r]+' chuyển':'Chưa biết'}</span></div>
      <small>${has?d.d:'Chưa từng thu phục hoặc hợp luyện qua các kiếp luân hồi.'}</small>
      <small class="dimt">${has?`Thức ăn: ${d.fn} · ${d.food?d.food+' thạch/tuần':'không tốn thạch'}`:'Cần tìm kiếm hoặc hợp luyện'}</small>
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
          <p class="dimt">Tất cả những cổ trùng thiên địa mà ngươi từng thu phục hoặc hợp luyện qua các kiếp.</p>
          <div class="codex-grid">${list}</div>
        </div>
      </div>
    </div>`;
}
function closeModal(){ if($('modalContainer')) $('modalContainer').innerHTML=''; }

function render(){
  if(!S){
    const origin = ORIGINS[selectedOrigin] || ORIGINS.cuyet;
    const perk = OTHERWORLDLY_PERKS[selectedPerk] || OTHERWORLDLY_PERKS.science;
    if($('charName')) $('charName').textContent='Lâm Tiêu (Chờ tạo)';
    if($('dayLbl')) $('dayLbl').textContent='Khởi đầu';
    if($('canhLbl')) $('canhLbl').textContent='Dị Giới';
    renderFuture();
    renderMoon();
    if($('stats')) {
      $('stats').innerHTML=`
        <div class="stat">
          <span class="label">Trạng Thái Không Khiếu</span>
          <div class="rank" style="font-size:21px;color:var(--cyan)">Hỗn Độn Sơ Khai</div>
          <div class="row dimt"><span>Cảnh giới</span><span>Chưa khai khiếu</span></div>
        </div>
        
        <div class="aperture-wrap">
          <canvas id="apertureCanvas"></canvas>
          <div class="aperture-overlay">HƯ KHÔNG DỊ GIỚI · CHỜ KHAI KHIẾU</div>
        </div>

        <div class="stat" style="margin-top:4px">
          <div class="row"><span>Thân phận chọn</span><b class="gold">${origin.n}</b></div>
          <div class="row"><span>Bản mệnh cổ</span><span class="cyan">Dị Giới Hồn Ấn 🌌</span></div>
          <div class="row"><span>Cổ khởi đầu</span><span class="good">${GU[origin.initGu].n}</span></div>
          <div class="row"><span>Nguyên thạch ban đầu</span><b class="gold">${origin.stones} viên</b></div>
        </div>

        <div class="stat" style="margin-top:4px">
          <span class="label">Thiên Phú Dị Giới</span>
          <div style="font-size:13px;color:var(--gold);margin-top:2px">【${perk.n}】</div>
          <div class="dimt" style="font-size:12px;margin-top:2px;line-height:1.4">${perk.d}</div>
        </div>`;
      if(window.Aperture) Aperture.init();
    }
    if($('side')) $('side').innerHTML=`
      <div class="stat"><span class="label">Hướng Dẫn Khởi Đầu</span><div class="rank" style="font-size:20px">Nhập Môn Cổ Sư</div></div>
      <div class="dimt" style="line-height:1.6;font-size:13px">
        1. <b>Chọn Tên & Thân Phận</b>: Gia tộc quyết định tài nguyên ban đầu và trường phái tu luyện.<br><br>
        2. <b>Thiên Phú Dị Giới</b>: Tri thức khoa học, hồn phách dị thường hoặc đọc trước nguyên tác.<br><br>
        3. <b>Bấm [Giáng Lâm Khai Khiếu]</b>: Bước vào đàn Hy Vọng Cổ để định đoạt tư chất thiên phú!
      </div>`;
    renderLog();
    renderStage();
    return;
  }
  window.S = S;
  if($('charName')) $('charName').textContent=S.name;
  if($('dayLbl')) $('dayLbl').textContent='Tháng '+month();
  if($('canhLbl')) $('canhLbl').textContent=S.combat?'Giao chiến':tuan();
  if($('soundBtn')&&window.SFX){
    $('soundBtn').textContent=SFX.isMuted()?'🔇 Tắt tiếng':'🔊 Âm thanh';
  }
  renderFuture();
  renderMoon();
  renderStats();
  renderSide();
  renderLog();
  renderStage();
}

let selectedOrigin = 'cuyet';
let selectedPerk = 'science';

document.addEventListener('click',ev=>{
  if(ev.target && ev.target.id==='modalBackdrop'){
    closeModal();
    return;
  }
  const b=ev.target.closest('button');if(!b)return;
  const d=b.dataset;

  if(b.id==='codexBtn'){
    renderCodexModal();
    return;
  }
  if(b.id==='closeModalBtn'){
    closeModal();
    return;
  }
  if(b.id==='soundBtn'){
    if(window.SFX){
      const m=SFX.toggleMute();
      b.textContent=m?'🔇 Tắt tiếng':'🔊 Âm thanh';
    }
    return;
  }
  if(b.id==='resetBtn'){
    localStorage.removeItem('tncm-save');
    S=null;
    window.S=null;
    render();
    return;
  }
  if(d.origin){
    selectedOrigin = d.origin;
    const curName = $('charNameInput') ? $('charNameInput').value : '';
    render();
    if($('charNameInput') && curName) $('charNameInput').value = curName;
    return;
  }
  if(d.perk){
    selectedPerk = d.perk;
    const curName = $('charNameInput') ? $('charNameInput').value : '';
    render();
    if($('charNameInput') && curName) $('charNameInput').value = curName;
    return;
  }
  if(b.id==='startJourneyBtn'){
    const name = ($('charNameInput')&&$('charNameInput').value.trim())||'Lâm Tiêu';
    initNewCharacter(name, selectedOrigin, selectedPerk);
    saveAll();render();return;
  }

  if(!S) return;

  if(d.a){
    switch(d.a){
      case 'close':S.panel=null;render();return;
      case 'market':S.panel='market';render();return;
      case 'newchar':S=null;window.S=null;render();return;
      default:act(d.a);return;
    }
  }
  if(d.ch!==undefined)return choose(+d.ch);
  if(d.f)return playerAct(d.f,d.k?+d.k:undefined);
  if(d.combo)return playerAct('combo',d.combo);
  if(d.cult!==undefined)return cultivate(+d.cult);
  if(d.buy!==undefined)return buyGu(+d.buy);
  if(d.sell!==undefined)return sellGu(+d.sell);
});

function start(){
  const l=loadAll();
  if(l){ S=l.s; META=l.m; window.S=S; }
  else { META=freshMeta(); S=null; window.S=null; }
  render();
}
window.onload = start;
