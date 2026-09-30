// Tự đánh và khắc chế (lộ trình 2.1, 2.2).
// - Tính chất của địch (FOE_TR): mỗi loại địch cần một cách đối phó riêng, dùng cơ chế đã có trong nguyên tác:
//   xuyên giáp, chảy máu, choáng, hàn khí, hỏa khí, đòn đánh diện rộng.
// - autoAct(): một lượt đánh tự động. Dùng chung cho nút "Tự đánh", tua nhanh (ff.js) và người chơi máy (tools/sim.cjs).
// Nạp trước ff.js và engine.js; chỉ gọi hàm của engine lúc chạy.

const FOE_TR={
  giap:{g:'甲',n:'Giáp dày',d:'Mỗi đòn bị giáp chặn bớt. Cổ xuyên giáp đánh thẳng vào thịt.'},
  nhanh:{g:'疾',n:'Nhanh nhẹn',d:'Đòn đánh đơn dễ trượt. Choáng, hàn khí hoặc đòn diện rộng thì không né được.'},
  bay:{g:'群',n:'Cả bầy',d:'Đòn đánh đơn chỉ trúng vài con. Đòn diện rộng (gió, dơi, nguyệt nhận lượn vòng) mạnh hơn nhiều.'},
  han:{g:'寒',n:'Hàn khí',d:'Băng phong cổ trùng của ngươi. Hộ thể bằng Hỏa Lô Cổ thì hàn khí tan.'},
  hoimau:{g:'愈',n:'Tái tụ',d:'Tự hồi máu. Vết thương đang chảy máu thì hồi chậm hẳn.'},
};
const DODGE=.25,SWARM_AOE=1.4,SWARM_SINGLE=.85;

// Tính chất của một trận: từ EAI (nhanh, bay) và suy ra từ chiêu riêng, giáp
function foeTraits(k){
  const ai=EAI[k]||{},t=[];
  if((ai.def||0)>=3)t.push('giap');
  if(ai.fast)t.push('nhanh');
  if(ai.swarm)t.push('bay');
  if(ai.sk==='freeze')t.push('han');
  if(ai.sk==='regen')t.push('hoimau');
  return t;
}
function foeHas(c,t){return !!(c&&c.tr&&c.tr.includes(t))}
// Địch nhanh có né được không: đang choáng hoặc bị hàn khí làm chậm thì không
function foeCanDodge(c){return foeHas(c,'nhanh')&&!(c.stun>0)&&!(c.atkBuff<0)}
// Hệ số đòn đánh theo tính chất địch. aoe: đòn diện rộng
function counterMult(c,aoe){return foeHas(c,'bay')?(aoe?SWARM_AOE:SWARM_SINGLE):1}

/* ---------- tự đánh một lượt ---------- */
// Ước lượng giá trị một đòn tấn công, có tính khắc chế
function autoScore(c,g,cost){
  let v=(g.dmg||0)*rankMult()+passAtk();
  if(g.pierce)v+=c.def*1.5;else v-=c.def;
  v*=counterMult(c,g.aoe);
  if(foeCanDodge(c)&&!g.aoe)v*=1-DODGE;
  if(foeHas(c,'nhanh')&&(g.stun||g.slow||g.chill))v*=1.25;
  if(g.bleed)v+=(foeHas(c,'hoimau')?2:1)*g.bleed*Math.max(6,c.max*.06)*.6;
  if(g.lifesteal&&S.hp<maxHp()*.7)v*=1.2;
  return v/Math.max(4,cost);
}
function autoAct(){
  const c=S.combat,hpR=S.hp/maxHp();
  const gus=S.gu.map((g,i)=>({i,k:g.k,d:GU[g.k]}));
  const ready=x=>guReady(x.k)&&S.ess>=guCostIdx(x.i);
  const guards=gus.filter(x=>x.d.t==='guard'&&ready(x));
  const warm=guards.find(x=>x.d.warm);
  const guard=(foeHas(c,'han')&&warm)||guards.sort((a,b)=>(SHIELD_RED[a.k]||.4)-(SHIELD_RED[b.k]||.4))[0];
  const heal=gus.find(x=>x.d.t==='heal'&&ready(x));
  const combos=COMBOS.filter(cb=>(META.combos||{})[cb.id]&&cb.req.every(k=>hasGu(k))&&guReady(cb.id)&&S.ess>=costOf(cb.cost)&&cb.dmg);
  if(hpR<.45&&heal)return playerAct('gu',heal.i);
  if(hpR<.45&&S.herbs>0&&guReady('herb'))return playerAct('herb');
  const big=c.intent==='heavy'||(c.intent==='skill'&&['thunder','charge','rage'].includes(c.sk));
  if(big&&guard&&c.shield<=0)return playerAct('gu',guard.i);
  // Hàn khí sắp tới: dựng Hỏa Lô trước để không bị băng phong
  if(c.intent==='skill'&&c.sk==='freeze'&&warm&&c.shield<=0)return playerAct('gu',warm.i);
  if(c.intent==='guard'&&!(c.stun>0)){
    if(guard&&c.shield<=0)return playerAct('gu',guard.i);
    if(heal&&hpR<.8)return playerAct('gu',heal.i);
    if(S.ess<maxEss()*.6&&S.stones>=5&&S.ess<maxEss())return playerAct('absorb');
  }
  // Lực tu có Toàn Lực Ứng Phó: quyền mạnh hơn cổ tấn công
  if(typeof lucPrefer==='function'&&lucPrefer())return playerAct('strike');
  const opts=gus.filter(x=>x.d.t==='attack'&&ready(x)).map(x=>({s:autoScore(c,x.d,guCostIdx(x.i)),go:()=>playerAct('gu',x.i)}))
    .concat(combos.map(cb=>({s:autoScore(c,cb,costOf(cb.cost))*1.3,go:()=>playerAct('combo',cb.id)})));
  opts.sort((a,b)=>b.s-a.s);
  if(opts.length)return opts[0].go();
  if(S.stones>=5&&S.ess<10&&S.ess<maxEss())return playerAct('absorb');
  return playerAct('strike');
}

/* ---------- nút Tự đánh ---------- */
const AUTO_STOP=.4;
// Chỉ trận thường: không phải thủ lĩnh, còn đường lui
function autoEligible(c){return !!(c&&!c.boss&&c.flee&&!c.ko&&!c.pko)}
function autoFight(){
  const c=S.combat;
  if(!autoEligible(c)||FX.busy||S.hp<maxHp()*AUTO_STOP)return;
  const hp0=S.hp;let n=0;
  log(`Ngươi để bản năng dẫn dắt trận với ${c.n}.`,'sys');
  // Chạy liền các lượt, không vẽ lại giữa chừng
  UI.batch=true;
  try{while(S.combat===c&&!c.ko&&!c.pko&&n++<80){
    if(S.hp<maxHp()*AUTO_STOP){
      FX.queue.length=0;UI.batch=false;
      FX.toastMsg={g:'停',t:'Dừng tự đánh',sub:`Khí huyết còn ${S.hp}/${maxHp()}. Ngươi tự quyết.`,cls:'run'};
      log('Khí huyết xuống thấp. Ngươi dừng lại, tự mình quyết định.','danger');
      saveAll();render();return;
    }
    FX.queue.length=0;FX.busy=false;
    autoAct();
  }}finally{UI.batch=false}
  if(!S.combat&&hp0>S.hp)log(`Tự đánh xong: mất ${hp0-S.hp} khí huyết.`,'sys');
  if(S.combat===c&&!c.ko&&!c.pko)FX.queue.length=0;
  saveAll();render();
}
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-auto]');if(!b||b.disabled)return;
  autoFight();
});
