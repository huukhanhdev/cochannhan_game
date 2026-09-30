// Chiến đấu thời gian thực (KE_HOACH_CHIEN_DAU.md, bản nâng cấp).
// Lấy yếu đối mạnh theo nguyên tác: đọc đòn và cắt đòn, hộ thể đúng khoảnh khắc, giữ khoảng cách và dùng địa hình,
// phục kích trước khi địch kịp trở tay, và mỗi trận lớn có cách thắng riêng thay vì đua máu.
// Cổ trùng có độ bền: đỡ đòn nặng, dùng sát chiêu liên tục, đánh khi đang đói đều làm cổ bị thương, về 0 thì chết.
//
// Logic chạy theo nhịp rtTick(dt) và không đụng tới DOM, nên tools/sim.cjs chơi được bằng rtBot().
// Phần vẽ (rtRender) chỉ cập nhật chữ và thanh; đấu trường PixiJS (battle.js) vẫn phát hiệu ứng qua Arena.play.
// Nạp sau battle.js và auto.js, trước engine.js. Chỉ gọi hàm của engine lúc chạy.

/* ---------- hằng số ---------- */
const RT={
  gcd:.95,          // nghỉ giữa hai hành động của người chơi (giây)
  move:.5,          // thời gian đổi tầm
  perfect:.45,      // cửa sổ hộ thể đúng khoảnh khắc
  secPerTurn:2.2,   // một "lượt" cũ tương ứng bao nhiêu giây (hồi chiêu, hộ thể, choáng)
  cast:{atk:1.1,heavy:1.8,skill:2.2,guard:2.0},
  idle:[.4,.9],
  hpMul:2.2,        // máu địch so với kiểu theo lượt (trận thời gian thực dài hơn, có chỗ cho kỹ năng)
  atkMul:1.8,       // sức đánh địch so với kiểu theo lượt
  stag:2.6,         // thời gian lộ sơ hở
  furyAt:45,        // trận thường kéo quá 45 giây thì địch cuồng nộ
};
const RANGE_N=['Gần','Trung','Xa'];
// Cổ chỉ dùng được khi áp sát
const RT_MELEE=new Set(['cuongthu']);
// Kỹ năng tầm xa của địch (trúng ở mọi tầm); còn lại là đòn cận chiến
const RT_RANGED_SK=new Set(['howl','poison','freeze','drain','suppress','thunder','regen']);
const RT_SK_COST={charge:1,rage:1,howl:1,poison:20,freeze:25,drain:15,suppress:25,thunder:1,regen:1};
// Người (Cổ sư) có chân nguyên; thú, khôi lỗi, huyết thi có thể lực
function rtIsBeast(k){return BEASTS.has(k)||['tuukhoi','huyetkhoi','nhatdai','hauquan','bachmaon'].includes(k)||/lang|thu|ho|ngac|tuong|kho|sau|trư|tru/.test(k)&&!EAI[k]}
function rtRangedFoe(k){return !rtIsBeast(k)}

/* ---------- trận có cách thắng riêng ---------- */
// type: survive (trụ N giây), escape (lấp đầy đường thoát), nodes (phá N mạch trước), kill (mặc định)
const RT_OBJ={
  langvuong:{type:'survive',sec:40,t:'Cầm chân Lang Vương cho tới khi gia lão rảnh tay',win:'win'},
  loiquan:{type:'survive',sec:30,t:'Giữ đoạn tường này cho tới khi đội khác tới thay',win:'win'},
  bai:{type:'survive',sec:25,brk:1,t:'Trụ vững, hoặc làm hắn lộ sơ hở một lần: hắn chỉ muốn xem ngươi có "thú vị" không',win:'win'},
  tiexueleng:{type:'escape',rate:6,t:'Thần bổ Ngũ chuyển: đứng ở tầm xa và không trúng đòn để mở đường thoát',win:'escape'},
  nhatdai:{type:'nodes',n:3,part:.08,sec:32,t:'Phá ba mạch máu nuôi Huyết Cương, hoặc cầm chân tới khi Hạc Tai giáng xuống',win:'win'},
  baitruonglao:{type:'escape',rate:5,t:'Mở đường máu xuống núi: trụ vững, đỡ đúng lúc, làm hắn lộ sơ hở để đi nhanh hơn',win:'win'},
  madutam:{type:'drain',t:'Hạ hắn, hoặc ép hắn cạn chân nguyên rồi bỏ chạy',win:'escape'},
};
// Điểm yếu theo nguyên tác (hiện khi đã dò xét hoặc có ký ức)
const RT_WEAK={
  bai:{gu:['hoalo'],t:'Hỏa Lô Cổ chặn hàn khí; sau mỗi đòn băng hắn khựng nửa nhịp',known:()=>mem('bai')||(S.chosen&&S.chosen.c_lang2)},
  langvuong:{gu:['cuongnham','thietbi'],t:'Giáp hành thổ (Cương Nham, Thiết Bì) đỡ được lôi bạo; chảy máu làm nó ngừng tru gọi bầy',known:()=>mem('langtrieu')||S.f.wolfPrep},
  loiquan:{gu:['cuongnham','thietbi'],t:'Giáp hành thổ đỡ được lôi bạo',known:()=>mem('langtrieu')||S.f.wolfPrep},
  nhatdai:{gu:[],t:'Vết nứt giữa ngực: đánh vào mạch máu thì thế của hắn vỡ gấp đôi',known:()=>S.f.soiNd||mem('huyethai')},
  huyetkhoi:{gu:[],t:'Đang chảy máu thì không tái tụ được',known:()=>mem('huyethai')},
  madutam:{gu:['trilieu','amduong'],t:'Hắn sống bằng hút máu; cổ trị liệu làm đòn hút mất tác dụng',known:()=>mem('madutam')},
};
// Địa hình: lấy từ cảnh của trận (ART.sc) hoặc tùy chọn o.terrain
const RT_TERRAIN={
  forest:{n:'Rừng trúc',d:'Dễ lùi xa: đổi tầm nhanh hơn.'},
  snow:{n:'Tuyết',d:'Hàn khí rút dần chân nguyên, trừ khi có Hỏa Lô Cổ.'},
  tide:{n:'Tường trại',d:'Thú phải leo tường mới áp sát được: chậm hơn khi tiến lên.'},
  blood:{n:'Huyết trì',d:'Địch hồi máu từ hồ máu, trừ khi đang chảy máu.'},
  fire:{n:'Biển lửa',d:'Cả hai bên mất máu dần.'},
  wine:{n:'Động đá',d:'Chật hẹp: không lùi xa quá tầm trung.'},
  khe:{n:'Khe đá hẹp',d:'Kẻ to lớn khó xoay trở: vận chiêu chậm hơn.'},
  village:{n:'Sơn trại',d:''},
};

/* ---------- độ bền cổ trùng ---------- */
function guHp(g){return g.hp===undefined?100:g.hp}
function guEff(g){return guHp(g)<35?.6:1}
// Cổ bị thương; về 0 thì chết. why: lý do để ghi nhật ký
function guWear(i,amt,why){
  const g=S.gu[i];if(!g||GU[g.k].t==='fate'||amt<=0)return;
  const was=guHp(g);g.hp=Math.max(0,was-amt*((g.h||0)>0?1.8:1));
  if(g.hp<=0){
    S.gu.splice(i,1);
    log(`${GU[g.k].n} ${why||'chịu không nổi'}, vỡ nát mà chết.`,'danger');
    FX.toastMsg={g:'殁',t:`${GU[g.k].n} đã chết`,sub:why||'',cls:'run'};
    FX.q({type:'text',on:'p',t:GU[g.k].n+' chết'});
  }else if(was>=35&&g.hp<35){
    log(`${GU[g.k].n} trọng thương: sức còn sáu phần, cần vài tuần được nuôi mới hồi lại.`,'danger');
    FX.q({type:'text',on:'p',t:GU[g.k].n+' trọng thương'});
  }
}
function guWearKey(k,amt,why){const i=S.gu.findIndex(g=>g.k===k);if(i>=0)guWear(i,amt,why)}
// Đầu tuần: cổ được nuôi no hồi phục, cổ đói thì không
function guRecover(n){for(const g of S.gu){if(g.hp===undefined||g.hp>=100)continue;if(!(g.h>0))g.hp=Math.min(100,g.hp+n)}}

/* ---------- vào trận ---------- */
function rtOn(){return !(META&&META.opt&&META.opt.turn)}
function rtFoeRank(c){return clamp(Math.round(c.atk[1]/(12*DIFF.atk))+(c.boss?1:0),1,6)}
function rtInit(c,o){
  const art=ART[c.k]||{sc:'forest'},beast=rtIsBeast(c.k);
  const obj=RT_OBJ[c.k]&&!o.noObj?Object.assign({prog:0},RT_OBJ[c.k]):null;
  const r={t:0,d:beast?1:2,moving:0,moveTo:null,busy:0,cast:null,next:.8,poise:0,poiseMax:c.boss?110:c.elite?70:45,stag:0,stunT:0,
    fess:beast?null:(c.boss?160:80)+(c.elite?30:0),stam:beast?3:null,stamT:0,guard:null,cd:{},frozen:{},poison:0,poisonT:0,bleedT:0,
    fleeT:0,alert:0,lastPoise:0,obj,terrain:o.terrain||art.sc||'village',allies:(o.allies||[]).map(k=>({k,t:1.5+Math.random()})),
    rank:0,sneak:null,phase:'fight',hits:0,paused:false,speed:1,lastHurt:-9,swarm:foeHas(c,'bay')};
  r.fessMax=r.fess;r.poise=r.poiseMax;r.rank=rtFoeRank(c);
  c.max=Math.round(c.max*RT.hpMul);c.hp=Math.round(c.hp*RT.hpMul);
  if(obj&&obj.type==='nodes'){obj.nodes=Array.from({length:obj.n},()=>{const m=Math.round(c.max*obj.part);return {hp:m,max:m}})}
  // Phục kích: có cổ ẩn thân, hoặc cảnh cho phép, và không phải thủ lĩnh
  if(o.ambush||(!c.boss&&!o.noSneak&&(hasGu('liemtuc')||hasGu('anlan'))&&c.flee))r.phase='offer';
  if(o.stun)r.stunT=1.2*o.stun;
  c.rt=r;
  // Lợi thế đầu trận
  const adv=[];
  if(RT_WEAK[c.k]&&RT_WEAK[c.k].known())adv.push('Biết điểm yếu: '+RT_WEAK[c.k].t);
  if(c.wolf&&S.f.wolfPrep)adv.push('Đã nghiên cứu cách săn của sói: sát thương lên sói +15%');
  if(c.wolf&&mem('langtrieu'))adv.push('Ký ức lang triều: sát thương lên sói +25%');
  if(o.adv)adv.push(o.adv);
  const T=RT_TERRAIN[r.terrain];if(T&&T.d)adv.push(`Địa hình ${T.n}: ${T.d}`);
  r.adv=adv;
  if(adv.length)log('Lợi thế: '+adv.join(' · '),'good');
  if(obj)log('Mục tiêu: '+obj.t,'big');
}

/* ---------- tiện ích ---------- */
function rtCD(key){const base=key==='herb'?(CD.herb||3):COMBOS.some(x=>x.id===key)?COMBO_CD:(CD[key]??2);return Math.max(2,base*RT.secPerTurn)}
function rtReady(key){const r=S.combat&&S.combat.rt;return !r||(!(r.cd[key]>0)&&!(r.frozen[key]>0))}
function rtCanAct(){const c=S.combat,r=c&&c.rt;return !!(r&&r.phase==='fight'&&r.busy<=0&&r.moving<=0&&!c.ko&&!c.pko&&!r.fleeing)}
function rtHasWeak(c,k){const w=RT_WEAK[c.k];return !!(w&&w.gu.includes(k))}
function rtEv(e){FX.q(e)}
function rtPoise(c,n,why){
  const r=c.rt;if(r.stag>0||n<=0)return;
  r.poise-=n;r.lastPoise=r.t;
  if(r.poise<=0){
    r.poise=0;r.stag=c.boss?RT.stag+.4:RT.stag;
    if(r.cast){log(`${c.n} bị phá thế giữa lúc ${r.cast.n.toLowerCase()}!`,'good');r.cast=null}
    log(`SƠ HỞ! ${c.n} lộ sơ hở ${r.stag.toFixed(1)} giây${why?' ('+why+')':''}: không ra tay được, nhận thêm 50% sát thương.`,'big');
    rtEv({type:'text',on:'e',t:'Sơ hở'});
    const o=r.obj;if(o&&o.brk)return rtObjDone(c);
    if(o&&o.type==='escape')o.prog=Math.min(100,o.prog+12);
  }
}

/* ---------- người chơi ra tay ---------- */
// type: strike | gu | combo | herb | absorb | move(+1 lùi, -1 áp sát) | flee | guard dùng qua gu
function rtAct(type,arg){
  const c=S.combat,r=c&&c.rt;if(!r||c.ko||c.pko)return;
  if(r.phase==='offer'){if(type==='sneak')return rtSneakStart();if(type==='rush'){r.phase='fight';log('Ngươi xông thẳng vào.','sys');return rtAfter()}return}
  if(r.phase==='sneak'){if(type==='sneak')return rtSneakStep();if(type==='rush'){rtCaught();return rtAfter()}return}
  if(type==='pause'){r.paused=!r.paused;return rtAfter()}
  if(type==='speed'){r.speed=r.speed===1?.55:1;(META.opt=META.opt||{}).slow=r.speed<1;return rtAfter()}
  if(!rtCanAct())return;
  const vary=()=>.85+Math.random()*.3;
  const hit=(raw,pierce,ev,aoe,pd,melee)=>{
    if(melee&&r.d>0){log('Quá xa, đòn cận chiến không tới.','sys');return 0}
    if(foeHas(c,'nhanh')&&!aoe&&r.stag<=0&&r.stunT<=0&&c.atkBuff>=0&&Math.random()<DODGE){ev.dmg=0;ev.miss=1;rtEv(ev);log(`${c.n} lách người, đòn trượt.`,'danger');return 0}
    let m=(pierce?1:dmgMultRT(c))*counterMult(c,aoe);
    if(r.stag>0)m*=1.5;
    let d=raw*m;if(!pierce)d-=c.def;d=Math.max(1,Math.round(d));
    // Trận phá mạch: đòn đánh vào mạch máu trước, thân chỉ nhận 30%
    const o=r.obj;
    if(o&&o.type==='nodes'){const nd=o.nodes.find(n=>n.hp>0);if(nd){nd.hp-=d;ev.dmg=d;rtEv(ev);if(nd.hp<=0){log('Một mạch máu vỡ tung! Huyết Cương rú lên.','big');rtPoise(c,40,'mạch máu vỡ')}if(o.nodes.every(n=>n.hp<=0))rtObjDone(c);return d}}
    c.hp-=d;ev.dmg=d;rtEv(ev);
    // Thế: đòn đánh vào lúc địch đang vận chiêu vỡ thế nhiều hơn
    rtPoise(c,Math.round((pd||8)*(r.cast&&r.cast.k!=='atk'?1.6:1)*(o&&o.type==='nodes'&&S.f.soiNd?2:1)));
    return d;
  };
  if(type==='strike'){
    if(window.SFX)SFX.blade();
    const lm=typeof lucStrike==='function'?lucStrike():{m:1};
    const d=hit(baseAtk()*vary()*lm.m*1.2,false,{type:'patk',kind:'fist'},false,12,true);
    if(d)log(`Ngươi áp sát xuất quyền. ${c.n} mất ${d}.`);
    r.busy=RT.gcd;return rtAfter();
  }
  if(type==='gu'){
    const gi=S.gu[arg];if(!gi)return;const key=gi.k,g=GU[key];
    if(!rtReady(key))return;
    const cost=guCostIdx(arg);if(S.ess<cost)return;
    if(g.t==='attack'&&RT_MELEE.has(key)&&r.d>0){log(`${g.n} cần áp sát mới dùng được.`,'sys');return}
    S.ess-=cost;r.cd[key]=rtCD(key);r.busy=RT.gcd;
    const eff=guEff(gi),hung=gi.h||0;
    if(g.t==='attack'){
      if(window.SFX)SFX.blade();
      let pd=8+(g.stun?30:0)+(g.pierce?14:0)+(g.chill||g.slow?10:0);
      if(rtHasWeak(c,key))pd*=2;
      const d=hit((g.dmg*rankMult()*(1-.25*hung)*eff+passAtk()+(g.nguyet?guSum('moonAtk'):0))*vary(),!!g.pierce,{type:'patk',kind:key},!!g.aoe,pd,RT_MELEE.has(key));
      if(d){
        log(`${g.n}! ${c.n} mất ${d}.`,'good');
        if(g.stun&&!hung&&!c.boss){r.stunT+=1.1*g.stun;log(`${c.n} bị trói chặt ${(1.1*g.stun).toFixed(1)} giây.`,'good')}
        if(g.chill)chillFoe(c,g.chill);if(g.slow)chillFoe(c,g.slow);
        if(g.bleed){c.bleed=(c.bleed||0)+g.bleed;log(`${c.n} chảy máu.`,'good')}
        if(g.lifesteal){const h=Math.max(1,Math.round(d*g.lifesteal));S.hp=Math.min(maxHp(),S.hp+h);rtEv({type:'heal',amt:h})}
      }
      guWear(arg,1.5,'bị thúc quá sức');
    }else if(g.t==='guard'){
      if(window.SFX)SFX.bell();
      const red=1-(1-(SHIELD_RED[key]||.4))*eff;
      r.guard={k:key,perfect:RT.perfect,left:(g.turns||2)*RT.secPerTurn*.9,red,reflect:g.reflect||0,warm:!!g.warm,drainPct:g.drainPct||0};
      if(g.selfHeal){S.hp=Math.min(maxHp(),S.hp+g.selfHeal);rtEv({type:'heal',amt:g.selfHeal})}
      rtEv({type:'shield',k:key});
      log(`${g.n} hộ thể: nhận ${Math.round(red*100)}% sát thương.${r.cast?' Đỡ đúng lúc đòn trúng thì gần như không mất gì.':''}`,'good');
    }else if(g.t==='heal'){
      if(window.SFX)SFX.bell();
      const h=Math.round(healAmt(key)*eff);S.hp=Math.min(maxHp(),S.hp+h);
      if(r.poison)r.poison=g.cure?0:Math.max(0,r.poison-2);
      rtEv({type:'heal',amt:h});log(`${g.n}: khí huyết +${h}.`,'good');
    }
    return rtAfter();
  }
  if(type==='combo'){
    const cb=COMBOS.find(x=>x.id===arg);if(!cb||!rtReady(cb.id))return;
    const cost=costOf(cb.cost);if(S.ess<cost)return;
    S.ess-=cost;r.cd[cb.id]=rtCD(cb.id);r.busy=RT.gcd+.3;
    if(window.SFX)SFX.blade();
    if(cb.dmg){
      const d=hit((cb.dmg*rankMult()+passAtk())*vary(),!!cb.pierce,{type:'combo',id:cb.id},!!cb.aoe,30+(cb.stun?25:0));
      if(d){log(`【Sát chiêu · ${cb.n}】 ${c.n} mất ${d}!`,'good');
        if(cb.lifesteal){const h=Math.max(1,Math.round(d*cb.lifesteal));S.hp=Math.min(maxHp(),S.hp+h);rtEv({type:'heal',amt:h})}
        if(cb.bleed)c.bleed=(c.bleed||0)+cb.bleed;if(cb.stun&&!c.boss)r.stunT+=1.2*cb.stun;if(cb.chill)chillFoe(c,cb.chill)}
    }else rtEv({type:'combo',id:cb.id});
    if(cb.shield){r.guard={k:cb.id,perfect:RT.perfect,left:cb.shield*RT.secPerTurn,red:.3,reflect:cb.reflect||0,warm:false,drainPct:0};rtEv({type:'shield'})}
    // Sát chiêu vắt kiệt các con cổ tham gia
    cb.req.forEach(k=>guWearKey(k,10,'bị sát chiêu vắt kiệt'));
    return rtAfter();
  }
  if(type==='herb'){
    if(S.herbs<1||!rtReady('herb'))return;
    S.herbs--;r.cd.herb=rtCD('herb');r.busy=RT.gcd;S.hp=Math.min(maxHp(),S.hp+30);r.poison=0;
    rtEv({type:'heal',amt:30});log('Nhai một gốc linh dược. Khí huyết +30, giải độc.','good');return rtAfter();
  }
  if(type==='absorb'){
    if(S.stones<5||S.ess>=maxEss())return;
    S.stones-=5;S.ess=Math.min(maxEss(),S.ess+20);r.busy=1.2;if(window.SFX)SFX.coin();
    log('Bóp nát 5 viên nguyên thạch giữa trận. Chân nguyên +20.','sys');return rtAfter();
  }
  if(type==='move'){
    const to=clamp(r.d+arg,0,r.terrain==='wine'?1:2);if(to===r.d)return;
    r.moveTo=to;r.moving=RT.move*(r.terrain==='forest'?.7:1);return rtAfter();
  }
  if(type==='flee'){
    const canEsc=c.flee||(r.obj&&r.obj.type==='drain'&&r.fess<=0);
    if(!canEsc)return;
    if(r.d<2){log('Phải lùi ra xa rồi mới chạy được.','sys');return}
    r.fleeing=1.4;log('Ngươi quay người bỏ chạy…','sys');return rtAfter();
  }
}
function dmgMultRT(c){
  let m=1;const r=c.rt;
  if(c.wolf){if(mem('langtrieu'))m+=.25;if(S.f.wolfPrep)m+=.15}
  if(r.cast&&r.cast.k==='guard')m*=.5;
  m*=1+guSum('pow');
  if(hasGu('kholuc'))m*=1+Math.min(.8,Math.max(0,1-S.hp/maxHp()));
  return m;
}
function rtAfter(){if(typeof UI!=='undefined'&&!UI.batch)rtRender();return true}

/* ---------- phục kích ---------- */
function rtSafe(){return .32+(hasGu('liemtuc')?.14:0)+(hasGu('anlan')?.1:0)}
function rtVision(r){return (Math.sin(r.sneak.t*r.sneak.sp)+1)/2}
function rtSneakStart(){const r=S.combat.rt;r.phase='sneak';r.sneak={step:0,n:3,t:Math.random()*6,sp:1.6+Math.random()*.8};log('Ngươi nín thở, men theo bóng tối tiến lại gần.','sys');rtAfter()}
function rtSneakStep(){
  const c=S.combat,r=c.rt;
  if(rtVision(r)<rtSafe()){r.sneak.step++;log(`Tiến thêm một bước (${r.sneak.step}/${r.sneak.n}).`,'sys');
    if(r.sneak.step>=r.sneak.n){
      const d=Math.round(c.max*(c.boss?.1:.22));c.hp-=d;r.d=0;r.phase='fight';r.stag=RT.stag;r.poise=0;
      rtEv({type:'patk',kind:'fist',dmg:d});log(`Ám sát! Đòn đánh lén trúng chỗ hiểm: ${c.n} mất ${d} và chưa kịp trở tay.`,'big');
      if(c.hp<=0){win();return}
    }
  }else rtCaught();
  rtAfter();
}
function rtCaught(){const c=S.combat,r=c.rt;r.phase='fight';r.alert=15;r.d=1;r.next=0;log(`${c.n} phát hiện ra ngươi! Nó cảnh giác, đòn đánh mạnh hơn trong một lúc.`,'danger');rtEv({type:'text',on:'e',t:'Phát hiện'})}

/* ---------- nhịp của trận ---------- */
function rtTick(dt){
  const c=S.combat,r=c&&c.rt;if(!r||c.ko||c.pko||S.over)return;
  if(r.paused)return;
  dt=Math.min(dt,.25);
  if(r.phase==='offer')return;
  if(r.phase==='sneak'){r.sneak.t+=dt;return}
  r.t+=dt;
  // người chơi
  if(r.busy>0)r.busy-=dt;
  if(r.moving>0){r.moving-=dt;if(r.moving<=0){r.d=r.moveTo;r.moveTo=null;r.moving=0}}
  for(const k in r.cd)if(r.cd[k]>0)r.cd[k]-=dt;
  for(const k in r.frozen)if(r.frozen[k]>0)r.frozen[k]-=dt;
  if(r.guard){r.guard.perfect-=dt;r.guard.left-=dt;
    if(r.guard.drainPct){r.guard.dr=(r.guard.dr||0)+dt;if(r.guard.dr>=RT.secPerTurn){r.guard.dr=0;const p=Math.round(maxHp()*r.guard.drainPct);S.hp-=p;log(`Cấm cổ nuốt sinh mệnh. Khí huyết −${p}.`,'danger')}}
    if(r.guard.left<=0)r.guard=null}
  if(r.fleeing){r.fleeing-=dt;if(r.fleeing<=0){r.fleeing=0;return rtEscape(c)}}
  // địa hình
  if(r.terrain==='snow'&&!(r.guard&&r.guard.warm)&&!hasGu('hoalo'))S.ess=Math.max(0,S.ess-.35*dt);
  if(r.terrain==='fire'){S.hp-=maxHp()*.003*dt;c.hp-=c.max*.002*dt}
  if(r.terrain==='blood'&&!(c.bleed>0))c.hp=Math.min(c.max,c.hp+c.max*.004*dt);
  // độc và chảy máu: mỗi 2 giây một lần
  if(r.poison>0){r.poisonT+=dt;if(r.poisonT>=2){r.poisonT=0;r.poison--;const p=Math.max(3,Math.round(maxHp()*.04));S.hp-=p;rtEv({type:'text',on:'p',t:'Độc −'+p})}}
  if(c.bleed>0){r.bleedT+=dt;if(r.bleedT>=2){r.bleedT=0;c.bleed--;const b=Math.max(6,Math.round(c.max*.06));c.hp-=b;rtEv({type:'dot',dmg:b,cls:'bleed'})}}
  // đồng minh
  for(const a of r.allies)rtAlly(c,a,dt);
  // mục tiêu
  const o=r.obj;
  if(o){
    if(o.type==='survive'||(o.type==='nodes'&&o.sec)){o.prog=Math.min(100,r.t/(o.sec)*100);if(r.t>=o.sec)return rtObjDone(c)}
    if(o.type==='escape'){const safe=r.t-r.lastHurt>1.5;o.prog=Math.min(100,o.prog+dt*o.rate*(r.d===2?1.5:1)*(safe?1:.3));if(o.prog>=100)return rtObjDone(c)}
  }
  if(c.hp<=0)return win();
  if(S.hp<=0)return die(c.n);
  if(spared(c))return;
  // địch
  if(r.alert>0)r.alert-=dt;
  if(r.stag>0){r.stag-=dt;if(r.stag<=0){r.poise=r.poiseMax;r.next=.4}return}
  if(r.stunT>0){r.stunT-=dt;return}
  if(r.poise<r.poiseMax&&r.t-r.lastPoise>3)r.poise=Math.min(r.poiseMax,r.poise+8*dt);
  if(r.stam!==null&&r.stam<3){r.stamT+=dt;if(r.stamT>=5){r.stamT=0;r.stam++}}
  if(r.cast){
    r.cast.left-=dt;
    if(r.cast.left<=0){const k=r.cast;r.cast=null;rtResolve(c,k);r.next=(RT.idle[0]+Math.random()*(RT.idle[1]-RT.idle[0]))*(foeHas(c,'nhanh')?.8:1)}
    return;
  }
  // thú áp sát khi không vận chiêu
  if(!rtRangedFoe(c.k)&&r.d>0){r.approach=(r.approach||0)+dt;const need=r.terrain==='tide'?1.5:1;if(r.approach>=need){r.approach=0;r.d--;return}}
  r.next-=dt;if(r.next>0)return;
  rtChoose(c);
}
function rtChoose(c){
  const r=c.rt;
  const w={atk:46,heavy:18+(c.phase2?8:0),guard:12,skill:c.sk?22+(c.phase2?10:0):0};
  // Cạn chân nguyên hoặc thể lực: chỉ còn đánh thường và thủ
  if(r.fess!==null&&r.fess<15){w.heavy=0;w.skill=0}
  if(r.fess!==null&&c.sk&&r.fess<(RT_SK_COST[c.sk]||20))w.skill=0;
  if(r.stam!==null&&r.stam<1){w.heavy=0;w.skill=0;w.guard+=20}
  // Sói đang chảy máu thì không tru gọi bầy
  if(c.sk==='howl'&&c.bleed>0)w.skill=0;
  let x=Math.random()*(w.atk+w.heavy+w.guard+w.skill),k='atk';
  for(const q of ['atk','heavy','guard','skill']){x-=w[q];if(x<=0){k=q;break}}
  const slow=(r.terrain==='khe'&&!foeHas(c,'nhanh')?1.25:1)*(foeHas(c,'nhanh')?.8:1);
  const n=k==='skill'?SK[c.sk].n:k==='heavy'?'Dồn lực':k==='guard'?'Thủ thế':'Tấn công';
  r.cast={k,n,dur:RT.cast[k]*slow,left:RT.cast[k]*slow};
  c.intent=k;
  if(k==='heavy'){if(r.fess!==null)r.fess-=15;if(r.stam!==null)r.stam--}
  if(k==='skill'){if(r.fess!==null)r.fess-=RT_SK_COST[c.sk]||20;if(r.stam!==null&&['charge','rage','howl','thunder'].includes(c.sk))r.stam--}
  if(r.fess!==null&&r.fess<=0&&r.obj&&r.obj.type==='drain'&&!r.drainLog){r.drainLog=1;log(`${c.n} cạn chân nguyên! Giờ ngươi có thể bỏ chạy.`,'big')}
}
// Đòn của địch trúng người chơi, qua hộ thể
function rtFoeHit(c,mult,opt){
  opt=opt||{};const r=c.rt;
  // tầm: đòn cận chiến không tới nếu ngươi đang ở xa
  const reach=opt.reach===undefined?(rtRangedFoe(c.k)?2:0):opt.reach;
  if(r.d>reach){log(`${c.n} vồ hụt: ngươi ở ngoài tầm.`,'good');rtEv({type:'text',on:'e',t:'Hụt'});rtPoise(c,10);return 0}
  let d=rand(c.atk[0],c.atk[1])*RT.atkMul*mult*(1+c.atkBuff+(r.alert>0?.15:0)+rtFury(c));
  const G=r.guard;let perfect=false;
  if(G&&!opt.pierce){
    perfect=G.perfect>0;
    const before=d;d*=perfect?.1:G.red;
    const gi=S.gu.findIndex(g=>g.k===G.k);
    const rf=Math.max(.6,1+.4*(r.rank-(GU[G.k]?GU[G.k].r:1)));
    if(gi>=0)guWear(gi,(before-d)/maxHp()*120*rf*(perfect?.3:1),'đỡ đòn quá nặng');
    if(perfect){log('Hộ thể đúng khoảnh khắc! Đòn đánh gần như vô hiệu.','big');rtEv({type:'text',on:'p',t:'Đỡ chuẩn'});rtPoise(c,40,'đỡ đúng lúc');
      if(r.obj&&r.obj.type==='escape')r.obj.prog=Math.min(100,r.obj.prog+6)}
  }else if(G&&opt.pierce){const gi=S.gu.findIndex(g=>g.k===G.k);if(gi>=0)guWear(gi,15,'bị đánh xuyên hộ thể');r.guard=null}
  d*=1-Math.min(.4,guSum('armor'));
  d=Math.max(1,Math.round(d));
  S.hp-=d;r.lastHurt=r.t;
  if(r.fleeing&&!perfect){r.fleeing=0;log('Bị đánh trúng, ngươi không chạy được.','danger')}
  rtEv({type:'eatk',dmg:d,heavy:!!opt.heavy});if(window.SFX)SFX.hit();
  if(G&&G.reflect&&!opt.counter){const x=Math.round(d*G.reflect/(perfect?.1:G.red)*.5);c.hp-=x;rtEv({type:'dot',dmg:x,cls:'reflect'})}
  if(r.obj&&r.obj.type==='escape')r.obj.prog=Math.max(0,r.obj.prog-(perfect?0:10));
  return d;
}
function rtFury(c){const r=c.rt;return r.obj?0:r.t>=RT.furyAt?Math.floor((r.t-RT.furyAt)/10+1)*.1:0}
function rtResolve(c,k){
  const r=c.rt;
  if(k.k==='atk'){const d=rtFoeHit(c,1);if(d)log(`${c.n} tấn công. Khí huyết −${d}.`,'danger')}
  else if(k.k==='heavy'){const d=rtFoeHit(c,2,{heavy:true,reach:rtRangedFoe(c.k)?2:1});if(d)log(`${c.n} tung đòn toàn lực. Khí huyết −${d}.`,'danger')}
  else if(k.k==='guard'){rtEv({type:'text',on:'e',t:'Thủ thế'})}
  else if(k.k==='skill')rtSkill(c);
  if(r.swarm&&k.k==='atk'&&Math.random()<.35){const d=rtFoeHit(c,.5);if(d)log(`Một con khác trong bầy lao tới. Khí huyết −${d}.`,'danger')}
  if(S.hp<=0)return die(c.n);
  if(c.boss&&!c.phase2&&c.hp<c.max/2){c.phase2=true;c.atkBuff+=.25;log(`${c.n} gầm lên. Giai đoạn hai!`,'big');rtEv({type:'text',on:'e',t:'Cuồng hóa'})}
}
function rtSkill(c){
  const r=c.rt,nm=SK[c.sk].n;rtEv({type:'text',on:'e',t:nm});
  const ranged={reach:2};
  switch(c.sk){
    case 'charge':{r.d=0;const d=rtFoeHit(c,1.7,{heavy:true,reach:0});if(d)log(`${c.n} ${nm}! Khí huyết −${d}.`,'danger');break}
    case 'howl':{c.atkBuff=Math.min(.6,c.atkBuff+.15);const d=rtFoeHit(c,.6,ranged);log(`${c.n} ${nm}, sức mạnh tăng.${d?' Khí huyết −'+d+'.':''}`,'danger');break}
    case 'rage':{c.atkBuff=Math.min(.6,c.atkBuff+.1);const d=rtFoeHit(c,1.5,{heavy:true,reach:1});if(d)log(`${c.n} ${nm}! Khí huyết −${d}.`,'danger');break}
    case 'poison':{const d=rtFoeHit(c,.6,ranged);if(d){r.poison=3;log(`Trúng độc cổ. Khí huyết −${d}.`,'danger')}break}
    case 'freeze':{
      if(r.guard&&r.guard.warm){const d=rtFoeHit(c,.6,ranged);log(`${nm} chạm vào hỏa khí của Hỏa Lô Cổ rồi tan thành hơi nước.${d?' Khí huyết −'+d+'.':''}`,'good');break}
      const opts=S.gu.map((g,i)=>({g,i})).filter(x=>['attack','guard','heal'].includes(GU[x.g.k].t));
      if(opts.length){const x=pick(opts);r.frozen[x.g.k]=4.5;guWear(x.i,8,'bị hàn khí đông cứng');log(`${nm}: ${GU[x.g.k].n} bị băng phong.`,'danger')}
      const d=rtFoeHit(c,.6,ranged);if(d)log(`Hàn khí thấu xương. Khí huyết −${d}.`,'danger');break}
    case 'drain':{
      if(RT_WEAK[c.k]&&S.gu.some(g=>RT_WEAK[c.k].gu.includes(g.k))&&c.k==='madutam'){log('Sinh cơ của cổ trị liệu làm đòn hút máu trượt đi.','good');break}
      const amt=Math.min(Math.floor(S.ess),Math.round(maxEss()*.2));S.ess-=amt;if(r.fess!==null)r.fess=Math.min(r.fessMax,r.fess+amt);
      const d=rtFoeHit(c,.5,ranged);log(`${c.n} ${nm}: mất ${amt} chân nguyên.${d?' Khí huyết −'+d+'.':''}`,'danger');break}
    case 'regen':{const bl=c.bleed>0,h=Math.round(c.max*((EAI[c.k]||{}).regen||.12)*(bl?.35:1));c.hp=Math.min(c.max,c.hp+h);rtEv({type:'text',on:'e',t:'+'+h});log(`${c.n} ${nm}, hồi ${h} máu.`,bl?'good':'danger');break}
    case 'thunder':{
      const earth=r.guard&&['cuongnham','thietbi'].includes(r.guard.k);
      const d=rtFoeHit(c,1.6,{pierce:!earth,heavy:true,reach:2});if(d)log(`${nm}${earth?' đập vào giáp hành thổ, tản bớt lực':' xuyên qua hộ thể'}! Khí huyết −${d}.`,'danger');break}
    case 'suppress':{c.suppress=3;r.suppT=6;const d=rtFoeHit(c,.5,ranged);log(`${c.n} tỏa ${nm}: cổ trùng run rẩy, tốn gấp rưỡi chân nguyên.${d?' Khí huyết −'+d+'.':''}`,'danger');break}
    default:{const d=rtFoeHit(c,1.2);if(d)log(`${c.n} ${nm}. Khí huyết −${d}.`,'danger')}
  }
}
// Uy áp hết sau vài giây (costOf dùng c.suppress)
function rtSuppressTick(c,dt){const r=c.rt;if(c.suppress>0){r.suppAcc=(r.suppAcc||0)+dt;if(r.suppAcc>=RT.secPerTurn){r.suppAcc=0;c.suppress--}}}

/* ---------- đồng minh ---------- */
const RT_ALLY={
  phuongchinh:{n:'Phương Chính',every:3,act:c=>{const d=Math.round(10+8*S.chuyen);c.hp-=d;rtEv({type:'dot',dmg:d,cls:'reflect'});return `Phương Chính phóng nguyệt nhận: ${c.n} mất ${d}.`}},
  thanhthu:{n:'Thanh Thư',every:6,act:c=>{if(c.boss)rtPoise(c,25,'dây leo quấn');else c.rt.stunT+=1.5;return `Dây leo của Thanh Thư quấn chặt ${c.n}.`}},
  tiexueleng:{n:'Thiết Huyết Lãnh',every:4,act:c=>{const d=Math.round(c.max*.04);c.hp-=d;rtEv({type:'dot',dmg:d,cls:'reflect'});if(c.rt.cast&&c.rt.cast.k==='skill'){c.rt.cast=null;return `Trấn Ma Thiết Tác khóa chặt chiêu của ${c.n}! Thần bổ chém thêm ${d}.`}return `Thiết Huyết Lãnh chém ${d}.`}},
  bai:{n:'Bạch Ngưng Băng',every:3.5,act:c=>{const d=Math.round(14+10*S.chuyen);c.hp-=d;chillFoe(c,.1);rtEv({type:'dot',dmg:d,cls:'reflect'});return `Băng tiễn của Bạch Ngưng Băng: ${c.n} mất ${d}.`}},
};
function rtAlly(c,a,dt){const A=RT_ALLY[a.k];if(!A)return;a.t-=dt;if(a.t>0)return;a.t=A.every;const t=A.act(c);if(t)log(t,'good')}

/* ---------- kết thúc ---------- */
function rtObjDone(c){
  const o=c.rt.obj;if(!o||o.done)return;o.done=1;o.prog=100;
  log({survive:'Ngươi đã trụ vững đủ lâu.',escape:'Đường thoát đã mở!',nodes:'Huyết Cương mất nguồn máu nuôi, tan rã.',drain:''}[o.type]||'Mục tiêu hoàn thành.','big');
  if(o.win==='escape')return rtEscape(c);
  if(c.k==='nhatdai'&&o.type==='nodes'&&c.rt.t>=o.sec&&!o.nodes.every(n=>n.hp<=0))log('Hạc Tai giáng xuống. Vạn con Phi Hạc Mỏ Thiết nhấn chìm Huyết Cương.','big');
  c.hp=Math.min(c.hp,0);win();
}
function rtEscape(c){
  if(typeof fleeSuccess==='function')return fleeSuccess(c);
}

/* ---------- người chơi máy: dùng cho nút Tự đánh, tua nhanh, tools/sim.cjs ---------- */
function rtBot(){
  const c=S.combat,r=c&&c.rt;if(!r)return;
  if(r.phase==='offer')return rtAct(hasGu('liemtuc')||hasGu('anlan')?'sneak':'rush');
  if(r.phase==='sneak'){if(rtVision(r)<rtSafe()-.06)rtSneakStep();return}
  if(!rtCanAct())return;
  const hpR=S.hp/maxHp(),gus=S.gu.map((g,i)=>({i,k:g.k,d:GU[g.k],g})).filter(x=>x.d);
  const ready=x=>rtReady(x.k)&&S.ess>=guCostIdx(x.i);
  const guards=gus.filter(x=>x.d.t==='guard'&&ready(x));
  const heal=gus.find(x=>x.d.t==='heal'&&ready(x));
  const cast=r.cast,danger=cast&&(cast.k==='heavy'||cast.k==='skill');
  const o=r.obj;
  if(hpR<.35&&heal)return rtAct('gu',heal.i);
  if(hpR<.35&&S.herbs>0&&rtReady('herb'))return rtAct('herb');
  if(hpR<.25&&(c.flee||(o&&o.type==='drain'&&r.fess<=0))){if(r.d<2)return rtAct('move',1);return rtAct('flee')}
  // đòn sắp trúng: hộ thể đúng lúc, hoặc lùi khỏi tầm cận chiến
  // Người chơi máy phản xạ như người: mỗi đòn chọn một thời điểm đỡ (có khi sớm, có khi muộn, có khi quên)
  if(cast&&cast!==r.botCast){r.botCast=cast;const q=Math.random(),sk=typeof RT_BOT_SKILL==='number'?RT_BOT_SKILL:.55;cast.botAt=q<sk?RT.perfect-.1:q<sk+.3?RT.perfect+.35+Math.random()*.4:-1}
  if(cast&&cast.k!=='guard'&&cast.botAt>0&&cast.left<=cast.botAt&&!r.guard){
    const warm=guards.find(x=>x.d.warm);
    const g=(c.sk==='freeze'&&cast.k==='skill'&&warm)||(c.sk==='thunder'&&guards.find(x=>['cuongnham','thietbi'].includes(x.k)))||guards.sort((a,b)=>(SHIELD_RED[a.k]||.4)-(SHIELD_RED[b.k]||.4))[0];
    if(g&&(danger||hpR<.7))return rtAct('gu',g.i);
  }
  if(cast&&danger&&!rtRangedFoe(c.k)&&r.d===0&&cast.left>RT.move+.1&&!guards.length)return rtAct('move',1);
  // trận thoát thân: lùi ra xa và giữ mạng
  if(o&&o.type==='escape'&&r.d<2)return rtAct('move',1);
  // phá thế khi địch đang vận chiêu
  const opts=gus.filter(x=>x.d.t==='attack'&&ready(x)&&!(RT_MELEE.has(x.k)&&r.d>0)).map(x=>{
    let s=autoScore(c,x.d,guCostIdx(x.i))*guEff(x.g);if(danger&&(x.d.stun||x.d.pierce))s*=1.8;if(rtHasWeak(c,x.k))s*=1.5;if(guHp(x.g)<25)s*=.4;return {s,go:()=>rtAct('gu',x.i)}})
    .concat(COMBOS.filter(cb=>(S.combos||{})[cb.id]&&cb.req.every(k=>hasGu(k))&&rtReady(cb.id)&&S.ess>=costOf(cb.cost)&&cb.dmg&&cb.req.every(k=>guHp(S.gu.find(g=>g.k===k))>30))
      .map(cb=>({s:autoScore(c,cb,costOf(cb.cost))*1.3*(r.stag>0?1.4:1),go:()=>rtAct('combo',cb.id)})));
  opts.sort((a,b)=>b.s-a.s);
  if(opts.length&&!(o&&o.type==='escape'&&r.stag<=0&&Math.random()<.5))return opts[0].go();
  if(S.stones>=5&&S.ess<12&&S.ess<maxEss())return rtAct('absorb');
  // hết chân nguyên: áp sát đánh tay nếu địch không quá nguy hiểm
  if(!(o&&o.type==='escape')){if(r.d>0)return rtAct('move',-1);return rtAct('strike')}
}
// Chạy trận nhanh t giây với người chơi máy (tua nhanh, sim, nút Tự đánh)
function rtRun(sec,stopHp){
  const c=S.combat;if(!c||!c.rt)return;
  const was=c.rt.paused;c.rt.paused=false;
  for(let t=0;t<sec&&S.combat===c&&!c.ko&&!S.over;t+=.1){
    if(stopHp&&S.hp<maxHp()*stopHp)break;
    rtBot();rtTick(.1);rtSuppressTick(c,.1);FX.queue.length=0;
  }
  if(S.combat===c)c.rt.paused=was;
}

/* ---------- giao diện ---------- */
let RT_LOOP=null,RT_LAST=0;
function rtStartLoop(){
  if(RT_LOOP||typeof document==='undefined'||!document.body)return;
  RT_LAST=performance.now();
  RT_LOOP=setInterval(()=>{
    const c=S&&S.combat;
    if(!c||!c.rt){clearInterval(RT_LOOP);RT_LOOP=null;return}
    const now=performance.now(),dt=(now-RT_LAST)/1000;RT_LAST=now;
    if(document.hidden||FX.busy||c.ko||c.pko||S.over||UI.title)return;
    const sp=c.rt.speed||1;
    rtTick(dt*sp);rtSuppressTick(c,dt*sp);
    if(S.combat!==c){return}
    const q=FX.queue.splice(0);q.forEach(e=>Arena.play(e));
    rtRender();showToast();
  },50);
}
function rtBar(cls,v,m,label,extra){return `<div class="mbar ${cls}"${extra||''}><i style="width:${clamp(v/m*100,0,100)}%"></i><em>${label}</em></div>`}
function rtRender(){
  const c=S.combat,r=c&&c.rt;if(!r||!document.getElementById('rtHud'))return;
  const e=ESS[S.chuyen];
  // người chơi
  const pc=[];
  if(r.guard)pc.push(`<span class="chip shield">${r.guard.perfect>0?'✦ Đỡ chuẩn':'玉 Hộ thể'} ${r.guard.left.toFixed(1)}s · nhận ${Math.round(r.guard.red*100)}%</span>`);
  if(r.poison>0)pc.push(`<span class="chip bleed">毒 Trúng độc</span>`);
  if(c.suppress>0)pc.push(`<span class="chip stun">压 Uy áp: cổ tốn ×1.5</span>`);
  if(r.fleeing)pc.push(`<span class="chip run">走 Đang chạy ${r.fleeing.toFixed(1)}s</span>`);
  $('pPlate').innerHTML=`<b>Phương Nguyên</b><span class="rk">${rankName()}</span>
    ${rtBar('hp',S.hp,maxHp(),`${Math.max(0,Math.round(S.hp))} / ${maxHp()}`)}
    ${rtBar('es',S.ess,maxEss(),`${Math.floor(S.ess)} / ${maxEss()} chân nguyên`,` style="--c:${e.c}"`)}
    ${pc.length?`<div class="chips">${pc.join('')}</div>`:''}`;
  // địch
  const st=[];
  if(r.stag>0)st.push(`<span class="chip crack">破 SƠ HỞ ${r.stag.toFixed(1)}s · +50%</span>`);
  if(r.stunT>0)st.push(`<span class="chip stun">晕 Bị trói ${r.stunT.toFixed(1)}s</span>`);
  if(c.bleed>0)st.push(`<span class="chip bleed">血 Chảy máu ${c.bleed}</span>`);
  if(c.atkBuff>0)st.push(`<span class="chip bleed">狂 +${Math.round(c.atkBuff*100)}%</span>`);
  if(r.alert>0)st.push(`<span class="chip bleed">警 Cảnh giác</span>`);
  if(rtFury(c)>0)st.push(`<span class="chip bleed">怒 Cuồng nộ +${Math.round(rtFury(c)*100)}%</span>`);
  (c.tr||[]).forEach(t=>{const d=FOE_TR[t];st.push(`<span class="chip trait" title="${esc(d.d)}">${d.g} ${d.n}</span>`)});
  const W=RT_WEAK[c.k];if(W&&W.known())st.push(`<span class="chip weak" title="${esc(W.t)}">弱 ${esc(W.t)}</span>`);
  const res=r.fess!==null?rtBar('fe',r.fess,r.fessMax,`${Math.max(0,Math.round(r.fess))} chân nguyên${r.fess<15?' · cạn':''}`):`<div class="pips">${'<i class="on"></i>'.repeat(Math.max(0,r.stam))}${'<i></i>'.repeat(3-Math.max(0,r.stam))}<small>thể lực</small></div>`;
  const o=r.obj;
  let objH='';
  if(o){
    if(o.type==='nodes')objH=`<div class="rt-obj"><b>Mục tiêu</b> ${esc(o.t)}<div class="nodes">${o.nodes.map(n=>`<span class="${n.hp<=0?'off':''}"><i style="width:${clamp(n.hp/n.max*100,0,100)}%"></i></span>`).join('')}</div>${rtBar('ob',o.prog,100,`Hạc Tai: ${Math.min(o.sec,Math.round(r.t))}/${o.sec}s`)}</div>`;
    else if(o.type==='drain')objH=`<div class="rt-obj"><b>Mục tiêu</b> ${esc(o.t)}</div>`;
    else objH=`<div class="rt-obj"><b>Mục tiêu</b> ${esc(o.t)}${rtBar('ob',o.prog,100,o.type==='survive'?`${Math.min(o.sec,Math.round(r.t))}/${o.sec} giây`:`Đường thoát ${Math.round(o.prog)}%`)}</div>`;
  }
  $('ePlate').innerHTML=`<b>${esc(c.n)}</b><span class="rk">Đòn ${c.atk[0]}–${c.atk[1]}${c.def?` · Giáp ${c.def}`:''}${c.boss?(c.phase2?' · Giai đoạn 2':' · Thủ lĩnh'):''}</span>
    ${rtBar('en',c.hp,c.max,`${Math.max(0,Math.round(c.hp))} / ${c.max}`)}
    ${rtBar('po',r.poise,r.poiseMax,r.stag>0?'Thế đã vỡ':`Thế ${Math.round(r.poise)}`)}
    ${res}
    ${st.length?`<div class="chips">${st.join('')}</div>`:''}`;
  // thanh vận chiêu và gợi ý
  const cast=r.cast;
  const hint=!cast?'':cast.k==='guard'?'Thủ thế: đánh vào chỉ nửa sức. Tranh thủ hồi phục, dựng hộ thể.':
    cast.k==='atk'?(r.d>(rtRangedFoe(c.k)?2:0)?'Ngoài tầm với của nó.':'Đòn thường. Có thể chịu, hoặc lùi ra.'):
    (rtRangedFoe(c.k)||c.sk==='thunder'?'':'Lùi ra xa để né, hoặc ')+'dựng hộ thể đúng lúc thanh đầy. Cổ có choáng hoặc xuyên giáp đánh vào lúc này sẽ phá thế.';
  $('rtCast').innerHTML=r.phase!=='fight'?'':cast?`<div class="cast ${cast.k}"><b>${esc(cast.n)}</b><div class="cbar"><i style="width:${clamp((1-cast.left/cast.dur)*100,0,100)}%"></i>${cast.left<=RT.perfect&&cast.k!=='guard'?'<span class="now">ĐỠ!</span>':''}</div><small>${esc(hint)}</small></div>`:
    r.stag>0?`<div class="cast stag"><b>Địch lộ sơ hở</b><small>Dồn sát chiêu ngay bây giờ.</small></div>`:`<div class="cast idle"><small>${esc(c.n)} đang dò xét…</small></div>`;
  $('rtCast').insertAdjacentHTML('beforeend',objH);
  // dải khoảng cách
  $('rtRange').innerHTML=[0,1,2].map(i=>`<span class="slot ${r.d===i?'on':''} ${r.moveTo===i?'to':''}"><em>${RANGE_N[i]}</em></span>`).join('')+`<span class="foe" title="${esc(c.n)}">${(ART[c.k]||{g:'敌'}).g}</span>`;
  // phục kích
  if(r.phase==='offer'||r.phase==='sneak'){
    const v=r.phase==='sneak'?rtVision(r):0,safe=rtSafe();
    $('rtSneak').innerHTML=`<div class="sneak"><b>${r.phase==='offer'?'Địch chưa thấy ngươi.':'Tiếp cận lén'}</b>
      ${r.phase==='sneak'?`<div class="vis"><span class="safe" style="width:${safe*100}%"></span><i style="left:${v*100}%"></i></div><small>Bấm "Lẻn tới" khi ánh mắt địch (vạch sáng) nằm trong vùng tối. ${r.sneak.step}/${r.sneak.n} bước.</small>`:'<small>Có cổ ẩn thân: có thể lẻn tới gần rồi ra một đòn ám sát.</small>'}
      <div class="ts-btns">${r.phase==='offer'?'<button class="btn big" data-rt="sneak">Lẻn tới gần</button>':'<button class="btn big" data-rt="sneak">Lẻn tới</button>'}<button class="btn ghost" data-rt="rush">Xông thẳng vào</button></div></div>`;
  }else $('rtSneak').innerHTML='';
  rtSkillbar(c,r);
}
function rtSkillbar(c,r){
  const gus=S.gu.map((g,i)=>({i,k:g.k,d:GU[g.k],g})).filter(x=>x.d&&['attack','guard','heal'].includes(x.d.t));
  const seen=new Set(),uniq=gus.filter(x=>!seen.has(x.k)&&seen.add(x.k));
  const can=rtCanAct();
  const lock=k=>(r.frozen[k]>0)?`Băng phong ${r.frozen[k].toFixed(1)}s`:(r.cd[k]>0)?`Hồi ${r.cd[k].toFixed(1)}s`:'';
  const sk=[];
  uniq.forEach(x=>{
    const cost=guCostIdx(x.i),lk=lock(x.k),hp=guHp(x.g),far=x.d.t==='attack'&&RT_MELEE.has(x.k)&&r.d>0;
    const base=rtCD(x.k),left=Math.max(0,r.cd[x.k]||0);
    sk.push({attr:`data-rt="gu" data-i="${x.i}"`,g:SKILL_GLYPH[x.k]||'蛊',img:guImgUrl(x.k),n:x.d.n,cost,dis:!can||!!lk||S.ess<cost||far,cdp:left/base,hp,
      s:lk||(far?'Cần áp sát':x.d.t==='attack'?`${Math.round(x.d.dmg*rankMult()*guEff(x.g)+passAtk())} sát thương${x.d.stun?' · phá thế':''}${x.d.pierce?' · xuyên':''}${x.d.aoe?' · diện rộng':''}`:x.d.t==='guard'?`Nhận ${Math.round((1-(1-(SHIELD_RED[x.k]||.4))*guEff(x.g))*100)}%${rtHasWeak(c,x.k)?' · khắc chế':''}`:`Hồi ${healAmt(x.k)}`),
      cls:x.d.t==='attack'?'atk':x.d.t==='guard'?'grd':'heal'});
  });
  COMBOS.filter(cb=>(S.combos||{})[cb.id]&&cb.req.every(k=>hasGu(k))).forEach(cb=>{const cost=costOf(cb.cost),lk=lock(cb.id);sk.push({attr:`data-rt="combo" data-i="${cb.id}"`,g:SKILL_GLYPH[cb.id]||'招',n:cb.n,cost,dis:!can||!!lk||S.ess<cost,cdp:Math.max(0,r.cd[cb.id]||0)/rtCD(cb.id),s:lk||'Sát chiêu · vắt sức các cổ tham gia',cls:'combo'})});
  sk.push({attr:'data-rt="strike"',g:'拳',n:'Đánh tay',s:r.d>0?'Cần áp sát':`${baseAtk()} sát thương`,dis:!can||r.d>0,cls:''});
  sk.push({attr:'data-rt="herb"',g:'药',n:'Linh dược',s:`Hồi 30 · còn ${S.herbs}`,dis:!can||S.herbs<1||!rtReady('herb'),cdp:Math.max(0,r.cd.herb||0)/rtCD('herb'),cls:'heal'});
  const html=sk.map((x,n)=>`<button class="skill ${x.cls}" ${x.attr} ${x.dis?'disabled':''}>
      <span class="sg${x.img?' has-img':''}"${x.img?` style="background-image:url('${x.img}')"`:''}>${x.img?'':x.g}</span><span class="st"><b>${esc(x.n)}</b><small>${esc(x.s)}</small></span>
      ${x.cost?`<span class="sc">${x.cost}</span>`:''}${n<9?`<kbd>${n+1}</kbd>`:''}${x.cdp>0?`<span class="cdv" style="height:${clamp(x.cdp*100,0,100)}%"></span>`:''}${x.hp!==undefined&&x.hp<100?`<span class="dur ${x.hp<35?'low':''}"><i style="width:${x.hp}%"></i></span>`:''}</button>`).join('');
  const ctrl=`<div class="rt-ctrl">
    <button class="btn" data-rt="move" data-i="-1" ${!can||r.d===0?'disabled':''}>◀ Áp sát <kbd>A</kbd></button>
    <button class="btn" data-rt="move" data-i="1" ${!can||r.d===2?'disabled':''}>Lùi xa ▶ <kbd>D</kbd></button>
    <button class="btn" data-rt="absorb" ${!can||S.stones<5||S.ess>=maxEss()?'disabled':''}>石 +20 chân nguyên (5 thạch)</button>
    ${c.flee||(r.obj&&r.obj.type==='drain'&&r.fess<=0)?`<button class="btn run" data-rt="flee" ${!can||r.d<2?'disabled':''}>走 Bỏ chạy${r.d<2?' (lùi xa trước)':''}</button>`:''}
    ${autoEligible(c)?`<button class="btn" data-auto="1">自 Tự đánh</button>`:''}
    <button class="btn ghost" data-rt="speed">${r.speed<1?'Tốc độ: thong thả':'Tốc độ: thường'}</button>
    <button class="btn ghost" data-rt="pause">${r.paused?'▶ Tiếp tục':'⏸ Tạm dừng'} <kbd>P</kbd></button>
  </div>`;
  const bar=$('skillbar');if(bar)bar.innerHTML=html+ctrl;
}
function renderRT(st){
  const c=S.combat,art=Object.assign({k:c.k},ART[c.k]||{g:'敌',sc:'forest',c:'#ddd6c0'});
  let arena=$('arena');
  if(!arena||arena.dataset.cid!==combatId(c)||!$('rtHud')){
    st.innerHTML=`
      <div class="arena rt" id="arena" data-cid="${esc(combatId(c))}" style="--foe:${art.c}">
        <div class="scene-name">${SCENE_NAME[art.sc]||''}${c.rt&&RT_TERRAIN[c.rt.terrain]&&c.rt.terrain!==art.sc?' · '+RT_TERRAIN[c.rt.terrain].n:''}</div>
        ${window.PIXI?'':`<div class="nofx"><span class="gl v">方源</span><span class="gl foe">${art.g}</span></div>`}
        <div class="plate p" id="pPlate"></div>
        <div class="plate e" id="ePlate"></div>
        <div class="rt-range" id="rtRange"></div>
        <div id="rtSneak"></div>
      </div>
      <div id="rtHud"><div id="rtCast"></div></div>
      <div class="skillbar rt" id="skillbar"></div>`;
    arena=$('arena');
    Arena.mount(arena,art);
  }
  Arena.sync({ess:ESS[S.chuyen].c,shield:!!(c.rt&&c.rt.guard),intent:c.rt&&c.rt.stag>0?'stun':c.rt&&c.rt.cast?(c.rt.cast.k==='skill'?'heavy':c.rt.cast.k):'atk'});
  rtRender();
  const q=FX.queue.splice(0);q.forEach(e=>Arena.play(e));
  rtStartLoop();
}
// Phím tắt: 1–9 dùng cổ, A áp sát, D lùi, P tạm dừng, Space hộ thể bằng con cổ phòng ngự tốt nhất
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('keydown',ev=>{
  const c=typeof S!=='undefined'&&S&&S.combat;if(!c||!c.rt||ev.metaKey||ev.ctrlKey||ev.altKey)return;
  const k=ev.key.toLowerCase();
  if(k==='a'){ev.preventDefault();rtAct('move',-1)}
  else if(k==='d'){ev.preventDefault();rtAct('move',1)}
  else if(k==='p'){ev.preventDefault();rtAct('pause')}
  else if(k===' '){ev.preventDefault();const g=S.gu.map((g,i)=>({i,d:GU[g.k],k:g.k})).filter(x=>x.d&&x.d.t==='guard'&&rtReady(x.k)&&S.ess>=guCostIdx(x.i)).sort((a,b)=>(SHIELD_RED[a.k]||.4)-(SHIELD_RED[b.k]||.4))[0];if(g)rtAct('gu',g.i)}
});
