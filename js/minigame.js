// Minigame: luyện cổ, mổ thạch, đột phá bích khiếu.
// Trạng thái lưu ở S.mg để tải lại giữa chừng vẫn tiếp tục được.

/* ================= LUYỆN CỔ =================
   Nguyên liệu mất ngay khi bắt đầu, đúng như nguyên tác: luyện hỏng là mất sạch.
   Mỗi lượt chọn cách rót chân nguyên. Dung hợp đủ 100 thì thành, ổn định về 0 thì nổ. */
const REFINE_TELLS=[
  {k:'calm',t:'Cổ trùng nằm yên, nguyên liệu tan đều.',prog:1,stab:1},
  {k:'resist',t:'Cổ trùng giãy giụa phản kháng: rót chân nguyên lượt này mất ổn định gấp đôi.',prog:1,stab:2},
  {k:'surge',t:'Linh quang lóe lên trong lò: dung hợp lượt này tăng mạnh.',prog:1.6,stab:1},
  {k:'crack',t:'Nguyên liệu nứt rạn: trấn áp lượt này hiệu quả gấp đôi.',prog:1,stab:1,calm:2},
];
// Random tell events giữa lượt
const REFINE_MID_EVENTS=[
  {t:'Cổ trùng hấp thu mạnh, dung hợp tăng vọt', eff: m=>m.prog+=rand(8,15)},
  {t:'Dung hợp phản ứng gay gắt, ổn định giảm', eff: m=>m.stab-=rand(5,12)},
  {t:'Kinh nghiệm tích lũy, Ngộ tính tăng', eff: m=>{S.ngo=Math.min(10,S.ngo+1);log('Ngộ tính +1','good')}},
  {t:'Cổ trùng buồn ngủ, không có gì xảy ra', eff: m=>{}},
];
function refineOdds(r){return refineChance(r)}
function startRefine(i){
  const r=RECIPES[i];if(!canRefine(r))return;
  S.stones-=r.st;S.wine-=(r.wine||0);S.blood-=(r.bl||0);S.refined=true;
  S.gu.splice(S.gu.findIndex(g=>g.k===r.from),1);
  if(r.extraGu){const x=S.gu.findIndex(g=>g.k===r.extraGu);if(x!==-1)S.gu.splice(x,1)}
  S.panel=null;
  S.mg={type:'refine',r:i,round:1,max:6,prog:0,stab:70,tell:pick(REFINE_TELLS).k,log:[]};
  log(`Bắt đầu luyện ${GU[r.id].n}. Nguyên liệu đã bỏ vào, không thể quay đầu.`,'sys');
  saveAll();render();
}
function refineAct(a){
  const m=S.mg,r=RECIPES[m.r],tell=REFINE_TELLS.find(t=>t.k===m.tell);
  const ngo=(S.ngo-6)*1.5;
  let line='';
  if(a==='auto'){
    return refineEnd(Math.random()<refineOdds(r),'Ngươi luyện theo thói quen, không để tâm từng nhịp.');
  }
  if(a==='pour'){
    if(S.ess<8)return;
    S.ess-=8;const p=Math.round(rand(16,24)*tell.prog+ngo),s=Math.round(rand(8,14)*tell.stab);
    m.prog+=p;m.stab-=s;line=`Rót chân nguyên đều tay: dung hợp +${p}, ổn định −${s}.`;
  }else if(a==='surge'){
    if(S.ess<16)return;
    S.ess-=16;const p=Math.round(rand(30,42)*tell.prog+ngo),s=Math.round(rand(18,28)*tell.stab);
    m.prog+=p;m.stab-=s;line=`Dồn mạnh chân nguyên: dung hợp +${p}, ổn định −${s}.`;
  }else if(a==='calm'){
    const s=Math.round((rand(10,16)+S.tamco)*(tell.calm||1));
    m.stab=Math.min(100,m.stab+s);m.prog+=3;line=`Trấn áp ý niệm của cổ: ổn định +${s}.`;
  }else if(a==='absorb'){
    if(S.stones<5)return;
    S.stones-=5;S.ess=Math.min(maxEss(),S.ess+20);line='Bóp nát 5 nguyên thạch, chân nguyên +20. Lửa lò hơi chùng xuống (ổn định −4).';m.stab-=4;
  }else return;
  m.log.push(line);
  // Random event giữa lượt (15% cơ hội)
  if(Math.random()<0.15){
    const ev=pick(REFINE_MID_EVENTS);
    line=ev.t; ev.eff(m); m.log.push(line);
  }
  if(m.stab<=0)return refineEnd(false,'Lò luyện nổ tung. Phản phệ khiến ngươi bị thương.',true);
  if(m.prog>=100)return refineEnd(true,'Ánh sáng thu lại. Cổ trùng mới mở mắt.');
  m.round++;
  if(m.round>m.max)return refineEnd(false,'Chân nguyên cạn, nguyên liệu nguội lạnh rồi tan thành tro.');
  m.tell=pick(REFINE_TELLS).k;
  saveAll();render();
}
function refineEnd(ok,msg,boom){
  const r=RECIPES[S.mg.r];S.mg=null;
  log(msg,ok?'good':'danger');
  if(ok){gainGu(r.id,true);if(window.SFX)SFX.levelUp();log(`Luyện cổ thành công: ${GU[r.id].n}!`,'big');FX.toastMsg={g:'炉',t:'Luyện thành '+GU[r.id].n,cls:'win'}}
  else{log(`Luyện cổ thất bại. ${GU[r.from].n} chết, nguyên liệu mất sạch.`,'danger');if(boom){S.hp=Math.max(1,S.hp-15);log('Khí huyết −15.','danger')}}
  saveAll();advance();render();
}

/* ================= MỔ THẠCH =================
   Nội dung đá quyết định ngay khi mua (ẩn). Mỗi nhát cắt lộ một dấu hiệu, có thể nhìn nhầm.
   Sau mỗi nhát, người thu mua của Cổ gia trả giá; bán ngay hoặc cắt tiếp. */
const STONE_CLUE={
  phe:['Mặt cắt xám đục, không chút linh khí.','Vân đá thô, có vết nứt rỗng bên trong.','Bụi vôi bay ra, mùi ẩm mốc.'],
  thach:['Có ánh lục nhạt lấp lánh như tinh thể.','Vân đá mịn, sờ vào thấy mát lạnh.','Lõi đá sáng lên khi hắt đèn.'],
  co:['Có vệt đỏ sẫm uốn lượn như mạch máu.','Nghe tiếng rì rì rất khẽ từ trong lõi.','Mặt cắt có dấu vết như vỏ côn trùng hóa thạch.'],
  doc:['Có đốm tím li ti, mùi tanh nồng.','Lõi đá âm ấm bất thường.','Vân đá xoắn ốc, như có thứ gì từng cựa quậy.'],
};
function stoneAccuracy(){return clamp(.55+(S.ngo-6)*.05+(mem('doanthach')?.2:0),.4,.95)}
// Người thu mua Cổ gia định giá theo dấu hiệu đã lộ (họ cũng có thể nhìn nhầm như ngươi).
// Họ là thương nhân: luôn ép giá dưới giá gốc, nên bán giữa chừng chỉ để cắt lỗ, không phải để kiếm lời.
function stoneOffer(m,st){
  const score=m.clues.reduce((s,c)=>s+({phe:-1,thach:1.2,co:1.6,doc:.2}[c.k]),0)/m.clues.length;
  const sure=.6+.2*m.clues.length/m.max; // càng nhiều nhát cắt, họ càng dám trả
  return Math.max(2,Math.round(st.price*clamp((.3+score*.3)*sure,.1,.9)));
}
function stonesLeft(){return S.stoneBuys&&S.stoneBuys.t===S.turn?STONE_WEEKLY-S.stoneBuys.n:STONE_WEEKLY}
function startStone(id){
  const st=STONES_GAMBLE.find(x=>x.id===id);if(!st||S.stones<st.price||stonesLeft()<=0)return;
  S.stoneBuys={t:S.turn,n:stonesLeft()===STONE_WEEKLY?1:(S.stoneBuys.n+1)};
  S.stones-=st.price;if(window.SFX)SFX.crack();
  // Ngộ tính và kinh nghiệm mổ thạch giúp chọn được khối đá tốt hơn ngay từ lúc mua
  const r=Math.random(),good=Math.min(.92,st.goodP+(S.ngo-6)*.015+(mem('doanthach')?.08:0));
  const content=r<good*.55?'thach':r<good?'co':r<good+.1?'doc':'phe';
  S.panel=null;
  S.mg={type:'stone',id,content,cuts:0,max:3,clues:[],offer:Math.round(st.price*.4),hired:false};
  log(`Mua khối ${st.n} giá ${st.price} nguyên thạch.`,'gold');
  saveAll();render();
}
function stoneAct(a){
  const m=S.mg,st=STONES_GAMBLE.find(x=>x.id===m.id);
  if(a==='cut'){
    if(m.cuts>=m.max)return;
    m.cuts++;if(window.SFX)SFX.crack();
    const truth=Math.random()<stoneAccuracy();
    const shown=truth?m.content:pick(['phe','thach','co','doc'].filter(k=>k!==m.content));
    m.clues.push({k:shown,t:pick(STONE_CLUE[shown])});
    m.offer=stoneOffer(m,st);
    if(m.cuts>=m.max)return stoneOpen();
  }else if(a==='sell'){
    S.stones+=m.offer;log(`Bán khối đá đang cắt dở cho Cổ gia được ${m.offer} nguyên thạch.`,'gold');
    S.mg=null;S.panel='gamble';saveAll();render();return;
  }else if(a==='open'){return stoneOpen()}
  else if(a==='hire'){
    m.hired=!m.hired;
  }
  saveAll();render();
}
function stoneOpen(){
  const m=S.mg,st=STONES_GAMBLE.find(x=>x.id===m.id);S.mg=null;S.panel='gamble';
  const hireBonus = m.hired ? 0.3 : 0;
  const succRate = m.content==='thach'?0.9: m.content==='co'?0.8: m.content==='doc'?0.3:0;
  // Hire expert increases success rate for identifying
  if(m.hired){
    S.stones -= st.price; // Pay double
    if(window.SFX)SFX.coin();
  }
  if(m.content==='thach'){const v=Math.round(st.price*(1.4+Math.random()*1.0));S.stones+=v;if(v>=60)S.f.stoneWin=Math.max(S.f.stoneWin||0,v);learn('doanthach');log(`Mổ thạch đại hỷ! Lõi đá là tinh thạch thuần, bán được ${v} nguyên thạch.`,'gold');FX.toastMsg={g:'石',t:'Tinh thạch',sub:`+${v} nguyên thạch`,cls:'win'}}
  else if(m.content==='co'){
    const k=pick(STONE_POOL[m.id]||STONE_POOL.thach_re);gainGu(k,true);if((GU[k].r||1)>=2||(GU[k].p||0)>=100)S.f.stoneGu=k;learn('doanthach');log(`Mổ thạch chấn động! Một con ${GU[k].n} còn sống giữa lòng đá.`,'big');FX.toastMsg={g:'蛊',t:GU[k].n,sub:'Còn sống trong lòng đá',cls:'win'};
  }else if(m.content==='doc'){S.hp=Math.max(1,S.hp-20);log('Một con độc cổ ngủ đông trong đá cắn trúng tay ngươi. Khí huyết −20.','danger')}
  else log('Đá vỡ ra toàn vụn vôi. Mất trắng.','danger');
  saveAll();render();
}

/* ================= ĐỘT PHÁ =================
   Dùng chân nguyên xung kích bích khiếu. Mỗi nhát mạnh hơn thì dễ phản phệ hơn.
   Ngộ tính giảm rủi ro và cho thấy chỗ bích khiếu mỏng.
   Thêm: Timing minigame - nhấn đúng lúc kim vào vùng xanh để tăng % thành công. */
const IMPACT={
  soft:{n:'Xung kích nhẹ',dmg:[18,26],risk:.05},
  mid:{n:'Xung kích vừa',dmg:[28,40],risk:.15},
  hard:{n:'Toàn lực xung kích',dmg:[42,60],risk:.32},
};
const BREAK_BASE_SUCC = 0.65;
const BREAK_MAX_SUCC = 0.95;
const BREAK_TIMING_BONUS = 0.15; // +15% nếu timing đúng
function startBreak(){
  S.mg={type:'break',wall:100,tries:4,weak:Math.random()<.35+(S.ngo-6)*.04,log:[],timingActive:false,timingHit:false};
}
function breakRisk(k){return clamp(IMPACT[k].risk-(S.ngo-6)*.015-((S.tuchat||44)-44)*.002,.02,.6)}
function breakAct(a){
  const m=S.mg;
  if(a==='auto'){
    const ch=BREAK_BASE_SUCC+(S.ngo-6)*.02+((S.tuchat||44)-44)*0.005 + m.failStreak*0.15;
    return breakEnd(Math.random()<Math.min(BREAK_MAX_SUCC,ch));
  }
  const im=IMPACT[a];if(!im)return;
  let d=rand(im.dmg[0],im.dmg[1]);if(m.weak){d=Math.round(d*1.3)}
  m.tries--;
  // Apply timing bonus if hit
  const timingBonus = m.timingHit ? BREAK_TIMING_BONUS : 0;
  m.timingHit = false; // Reset
  const risk = Math.max(0.02, breakRisk(a) - timingBonus);
  
  if(Math.random()<risk){
    const loss=Math.round(maxHp()*.2);S.hp=Math.max(1,S.hp-loss);m.wall=Math.min(100,m.wall+15);
    m.log.push(`${im.n}: chân nguyên phản phệ! Khí huyết −${loss}, bích khiếu liền lại một phần.`);
    m.failStreak = (m.failStreak||0) + 1;
    triggerShake();
  }else{
    m.wall-=d;m.log.push(`${im.n}: bích khiếu −${d}.`);
    m.failStreak = 0;
  }
  if(m.wall<=0)return breakEnd(true);
  if(m.tries<=0)return breakEnd(false);
  m.weak=Math.random()<.3+(S.ngo-6)*.04;
  saveAll();render();
}
function breakEnd(ok){
  S.mg=null;
  if(ok){
    const a=realmSnap();S.chuyen++;S.giai=0;S.prog=0;S.ess=Math.round(maxEss()*.4);S.hp=maxHp();
    if(window.SFX)SFX.levelUp();
    log(`Đột phá! Chân nguyên hóa thành ${ESS[S.chuyen].n}. ${rankName()}. ${realmGain(a)}`,'big');
    FX.toastMsg={g:CH[S.chuyen],t:'Đột phá '+rankName(),cls:'win'};
  }else{
    S.prog=Math.floor(need()*.5);S.hp=Math.max(1,S.hp-Math.round(maxHp()*.15));
    log('Chân nguyên cạn trước khi bích khiếu vỡ. Đột phá thất bại, tu vi mất một nửa.','danger');
  }
  saveAll();advance();render();
}

// Timing minigame handler
let breakTimingRAF = null;
function startBreakTiming(){
  const m=S.mg; if(!m||m.type!=='break') return;
  m.timingActive = true;
  const needle = document.getElementById('timing-needle');
  const bar = document.getElementById('timing-bar');
  if(!needle||!bar) return;
  bar.classList.remove('hidden');
  let pos = 0, dir = 1, speed = 1.5;
  const hitZone = {start:40, end:60};
  
  function animate(){
    if(!m.timingActive) return;
    pos += dir * speed;
    if(pos >= 100){pos=100; dir=-1;}
    if(pos <= 0){pos=0; dir=1;}
    needle.style.left = pos + '%';
    breakTimingRAF = requestAnimationFrame(animate);
  }
  animate();
  
  // Keydown handler
  window.breakTimingHandler = (e)=>{
    if(e.code==='Space' && S.mg===m && m.timingActive){
      const inZone = pos >= hitZone.start && pos <= hitZone.end;
      m.timingHit = inZone;
      m.timingBonus = inZone ? 15 : 0;
      m.timingActive = false;
      bar.classList.add('hidden');
      if(breakTimingRAF) cancelAnimationFrame(breakTimingRAF);
      window.removeEventListener('keydown', window.breakTimingHandler);
      renderMG(document.getElementById('stage'));
    }
  };
  window.addEventListener('keydown', window.breakTimingHandler);
}

/* ================= HIỂN THỊ ================= */
function mgBar(label,v,cls){return `<div class="mg-bar ${cls}"><div class="mrow"><span>${label}</span><b>${Math.max(0,Math.round(v))}</b></div><div class="mtrack"><i style="width:${clamp(v,0,100)}%"></i></div></div>`}
function renderMG(st){
  const m=S.mg;
  if(m.type==='refine'){
    const r=RECIPES[m.r],tell=REFINE_TELLS.find(t=>t.k===m.tell);
    const baseRate = refineOdds(r);
    const estTurns = Math.ceil((m.max - m.round + 1) / (0.5 + S.ngo*0.1));
    st.innerHTML=`<div class="paper mg refine">
      <div class="headrow"><div><span class="label">Lượt ${m.round} / ${m.max} · Chân nguyên ${Math.floor(S.ess)}</span><h2 class="title">Luyện ${GU[r.id].n}</h2></div>
        ${guEmblem(r.id,'炉','lg')}</div>
      <div class="mg-furnace"><div class="flame" style="--p:${clamp(m.prog,0,100)}%;--s:${clamp(m.stab,0,100)}%"></div></div>
      ${mgBar('Dung hợp',m.prog,'prog')}${mgBar('Ổn định',m.stab,m.stab<30?'stab low':'stab')}
      <div class="mg-est">Ước tính: <b>~${estTurns} lượt</b> (Ngộ ${S.ngo}) | Tỷ lệ cơ bản: <b>${Math.round(baseRate*100)}%</b></div>
      <p class="mg-tell">${tell.t}</p>
      <div class="mg-acts">
        <button class="choice" data-mg="pour" ${S.ess<8?'disabled':''}><span class="ct">Rót chân nguyên đều tay</span><span class="cmeta"><span class="odds m">8 chân nguyên</span><span class="odds e">Dung hợp +16~24</span><span class="odds h">Ổn định −8~14</span></span></button>
        <button class="choice" data-mg="surge" ${S.ess<16?'disabled':''}><span class="ct">Dồn mạnh chân nguyên</span><span class="cmeta"><span class="odds m">16 chân nguyên</span><span class="odds e">Dung hợp +30~42</span><span class="odds x">Ổn định −18~28</span></span></button>
        <button class="choice" data-mg="calm"><span class="ct">Trấn áp ý niệm của cổ</span><span class="cmeta"><span class="odds e">Ổn định +${10+S.tamco}~${16+S.tamco} (Tâm cơ)</span></span></button>
        <button class="choice" data-mg="absorb" ${S.stones<5||S.ess>=maxEss()?'disabled':''}><span class="ct">Hấp thu 5 nguyên thạch</span><span class="cmeta"><span class="odds m">+20 chân nguyên, ổn định −4</span></span></button>
      </div>
      <div class="mg-log">${m.log.slice(-3).map(l=>`<p>${esc(l)}</p>`).join('')}</div>
      <div class="map-foot"><button class="btn ghost" data-mg="auto">Luyện nhanh (${Math.round(baseRate*100)}% theo ngộ tính)</button></div>
    </div>`;
  }else if(m.type==='stone'){
    const st_=STONES_GAMBLE.find(x=>x.id===m.id);
    const baseSucc = (m.content==='thach'?0.9: m.content==='co'?0.8: m.content==='doc'?0.3:0);
    const hireSucc = Math.min(0.95, baseSucc + 0.3);
    st.innerHTML=`<div class="paper mg stone">
      <div class="headrow"><div><span class="label">Phường Đoán Thạch · nhát ${m.cuts} / ${m.max}</span><h2 class="title">${st_.n}</h2></div></div>
      <div class="rock"><div class="rock-body cuts-${m.cuts}">${Array.from({length:m.cuts},(_,i)=>`<i class="cut c${i}"></i>`).join('')}</div></div>
      <div class="clues">${m.clues.length?m.clues.map((c,i)=>`<p><b>Nhát ${i+1}.</b> ${c.t}</p>`).join(''):'<p class="dimt">Khối đá còn nguyên. Độ chính xác nhìn: '+Math.round(stoneAccuracy()*100)+'% (ngộ tính, kinh nghiệm).</p>'}</div>
      <div class="mg-acts">
        <button class="choice" data-mg="cut" ${m.cuts>=m.max?'disabled':''}><span class="ct">${m.cuts?'Cắt nhát tiếp theo':'Cắt nhát đầu'}</span><span class="cmeta"><span class="odds m">Lộ thêm một dấu hiệu</span></span></button>
        <button class="choice" data-mg="sell"><span class="ct">Bán cho người thu mua Cổ gia</span><span class="cmeta"><span class="odds e">Trả ${m.offer} nguyên thạch</span></span></button>
        ${m.cuts?`<button class="choice" data-mg="open"><span class="ct">Bổ đôi, xem luôn lõi đá</span><span class="cmeta"><span class="odds h">Được ăn cả, ngã về không</span></span></button>`:''}
        <label class="hire-option"><input type="checkbox" data-mg="hire" ${m.hired?'checked':''}> Mượn người soi <span class="text-warning">(+${st_.price} NT, ${Math.round(hireSucc*100)}% thành công)</span></label>
      </div></div>`;
  }else if(m.type==='break'){
    const baseRate = BREAK_BASE_SUCC+(S.ngo-6)*.02+((S.tuchat||44)-44)*0.005 + (m.failStreak||0)*0.15;
    const estSucc = Math.min(BREAK_MAX_SUCC, baseRate + (m.timingBonus||0)*0.01);
    st.innerHTML=`<div class="paper mg break">
      <div class="headrow"><div><span class="label">${rankName()} · còn ${m.tries} lần xung kích</span><h2 class="title">Xung kích bích khiếu</h2></div></div>
      <div class="aperture-wall"><div class="wall" style="--w:${clamp(m.wall,0,100)}%"></div>${m.weak?'<span class="weak">Có chỗ mỏng</span>':''}</div>
      ${mgBar('Bích khiếu',m.wall,'wall')}
      <p class="mg-tell">${m.weak?'Ngộ tính cho ngươi thấy một chỗ bích khiếu mỏng: nhát này sát thương +30%.':'Bích khiếu dày đặc, chưa thấy kẽ hở.'}</p>
      <div id="timing-bar" class="mg-timing ${m.timingActive?'':'hidden'}">
        <div class="timing-track"><div id="timing-needle" class="needle"></div><div class="hit-zone"></div></div>
        <div class="mg-hint">Nhấn <kbd>Space</kbd> khi kim vào vùng xanh (+15% thành công)</div>
      </div>
      <div class="mg-succ-rate">Tỷ lệ ước tính: <b>${Math.round(estSucc*100)}%</b> ${m.timingBonus?`<span class="text-success">(+${m.timingBonus}% timing)</span>`:''}</div>
      <div class="mg-acts">${Object.entries(IMPACT).map(([k,v])=>`<button class="choice" data-mg="${k}"><span class="ct">${v.n}</span><span class="cmeta"><span class="odds e">Bích khiếu −${v.dmg[0]}~${v.dmg[1]}</span><span class="odds ${breakRisk(k)>.2?'x':breakRisk(k)>.1?'h':'m'}">Phản phệ ${Math.round(breakRisk(k)*100)}%</span></span></button>`).join('')}</div>
      <div class="mg-log">${m.log.slice(-3).map(l=>`<p>${esc(l)}</p>`).join('')}</div>
      <div class="map-foot"><button class="btn ghost" data-mg="auto">Đột phá nhanh (${Math.round(Math.min(BREAK_MAX_SUCC,baseRate)*100)}%)</button></div>
    </div>`;
    // Start timing animation after render
    setTimeout(startBreakTiming, 0);
  }
}
function mgAct(a){
  const m=S.mg;if(!m)return;
  if(m.type==='refine')refineAct(a);else if(m.type==='stone')stoneAct(a);else if(m.type==='break')breakAct(a);
}
if(typeof document!=='undefined')document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-mg]');if(!b||b.disabled)return;mgAct(b.dataset.mg);
});
