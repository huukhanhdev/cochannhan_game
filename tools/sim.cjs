// Chạy engine thật trong Node để đo độ khó: node tools/sim.cjs [số chiến dịch] [số kiếp tối đa mỗi chiến dịch]
// Không dùng trong game; chỉ để cân bằng.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const noop=()=>{};
const store={};
const ctx={
  console,Math,JSON,Date,setTimeout:(f)=>f(),clearTimeout:noop,
  localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},
  document:{getElementById:()=>null,addEventListener:noop,querySelectorAll:()=>[],createElement:()=>({getContext:()=>null})},
  matchMedia:()=>({matches:true}),performance:{now:()=>Date.now()},
};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','events.js','living.js','battle.js','minigame.js','auto.js','ff.js','cicada.js','butterfly.js','q2/core.js','q2/data2.js','q2/luc.js','q2/truyenthua.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js','q2/ch4_thanh.js','q2/ch5_thieuchu.js','q2/ch6_tamxoa.js','q2/ch7_ngu.js','q2/ch8_baquy.js','q2/ch9_phanboi.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
// Giao diện không cần trong mô phỏng
vm.runInContext('function render(){} function showToast(){}',ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/engine.js'),'utf8').replace(/window\.claude\?\.hot[\s\S]*$/,''),ctx,{filename:'engine.js'});

const run=code=>vm.runInContext(code,ctx);
ctx.__lech=!!process.env.LECH;
// Người chơi máy
const bot=`
function botCombat(){
  const c=S.combat;
  // Người chơi thật sẽ chạy khi sắp chết, trừ khi không có đường lui
  if(c.flee&&S.hp/maxHp()<.3)return playerAct('flee');
  return autoAct();
}
function botEvent(){
  const ev=EV[S.evq[0]],chs=choicesOf(ev);
  const ok=chs.map((c,i)=>({c,i})).filter(x=>!x.c.req||x.c.req());
  // Ưu tiên lựa chọn có tỉ lệ cao; đôi khi theo nguyên tác
  // LECH=1: người chơi cố tình đi khác nguyên tác
  const sc=x=>(x.c.check?chance(x.c.check[0],x.c.check[1],x.c.bonus?x.c.bonus():0):70)+(x.c.canon?(globalThis.__lech&&ev.canon?-40:15):0)+(globalThis.__lech&&x.c.drift?30:0)+(x.c.mem&&(S.picked||{})[S.evq[0]+':probe']&&varShifted(varOfEv(S.evq[0]))?-80:0)+Math.random()*25;
  ok.sort((a,b)=>sc(b)-sc(a));
  choose(ok[0].i);
}
function botMG(){
  const m=S.mg;
  if(m.type==='break'){mgAct(m.wall<=35?'soft':m.weak||S.hp>maxHp()*.6?'mid':'soft');return}
  if(m.type==='refine'){
    if(m.stab<35)return mgAct('calm');
    if(S.ess<8)return S.stones>=5?mgAct('absorb'):mgAct('calm');
    return mgAct(100-m.prog>30&&m.stab>60&&S.ess>=16?'surge':'pour');
  }
  mgAct('open');
}
function botTurn(){
  if(S.traitOpts)return pickTrait(pick(S.traitOpts));
  if(S.mg)return botMG();
  if(S.combat)return botCombat();
  if(S.evq.length)return botEvent();
  if(S.panel==='tuluyen'){const keep=foodCost()*2+10;const cap=cultMaxStones();const n=[cap,Math.ceil(cap/2),0].find(n=>S.stones-n>=keep)||0;return cultivate(n)}
  if(S.panel){S.panel=null;return}
  // Việc phụ: mua cổ, luyện cổ
  if(S.stones>90){const k=S.shop.find(k=>['attack','guard','heal'].includes(GU[k].t)&&!hasGu(k)&&guPrice(k)<S.stones-40);if(k){buyGu(S.shop.indexOf(k))}}
  const ri=RECIPES.findIndex(r=>canRefine(r));if(ri>=0&&S.stones>r0(ri))return startRefine(ri);
  if(S.herbs<2&&S.stones>30)buyItem('herb');
  const hpR=S.hp/maxHp();
  if(hpR<.45||(S.inj&&Math.random()<.5))return act('nghi');
  if(S.ess>=maxEss()*.7)return act('tuluyen');
  if(!S.f.hoatuu&&Math.random()<.35)return act('hauson');
  return act(pick(['nui','nui','nhiemvu','nhiemvu','hocduong','trai'].filter(a=>a!=='hocduong'||S.turn<=18)));
}
function r0(i){return RECIPES[i].st+40}
`;
run(bot);
// Đếm dị số, hậu quả trễ, lựa chọn ký ức theo từng kiếp
run(`var __bf={diso:0,q:0,memOk:0,memBad:0,lives:0,shift:0};const __ch=choose;choose=function(i){const id=S.evq[0],ev=EV[id];if(ev){const c=choicesOf(ev)[i];if(id.startsWith('d_'))__bf.diso++;if(id.startsWith('q_'))__bf.q++;if(c&&c.mem){const k=Object.keys(VARIANTS).find(k=>VARIANTS[k].ev===id);if(k&&varShifted(k))__bf.memBad++;else __bf.memOk++}}return __ch(i)};const __sv=shiftVariant;shiftVariant=function(w){__bf.shift++;return __sv(w)}`);
// Đo lặp sự kiện ngẫu nhiên: khoảng cách ngắn nhất (tuần) giữa hai lần cùng một sự kiện trong một kiếp
run(`var __rep={n:0,gaps:{}};const __re=randomEvent;randomEvent=function(loc){const ok=__re(loc);if(ok){const id=S.evq[S.evq.length-1];S.__ev=S.__ev||{};if(S.__ev[id]!==undefined){const g=S.turn-S.__ev[id];__rep.gaps[g]=(__rep.gaps[g]||0)+1}S.__ev[id]=S.turn;__rep.n++}return ok}`);

const N=+process.argv[2]||200,MAXLIFE=+process.argv[3]||8;
const res={r11:[],deathRank:[],reach27:0,finalDeaths:0,lives:0,wins:0,firstWinLife:[],deathTurn:[],cause:{},rankAt19:[],rankEnd:[],lifeWins:{},replay:[],firstWin:[]};
for(let n=0;n<N;n++){
  run('META=freshMeta();newLife();');
  let won=false,replay=0;
  for(let life=1;life<=MAXLIFE&&!won;life++){
    let steps=0;
    while(steps<4000){
      const o=run('S.over');
      if(o==='rewind'){const t0=run('S.turn');run('rewindTime(false)');replay+=t0-run('S.turn');res.rewinds=(res.rewinds||0)+1;steps++;continue}
      if(o)break;
      run('botTurn()');steps++;
      if(run('S.turn')===11&&!run('S._r11')){res.r11.push(run('S.chuyen+S.giai/4'));run('S._r11=1')}
      if(run('S.turn')===27&&!run('S._r27')){res.reach27++;run('S._r27=1')}
      if(run('S.turn')===19&&!run('S._r19')){res.rankAt19.push(run('S.chuyen+S.giai/4'));run('S._r19=1')}
    }
    res.lives++;
    const over=run('S.over');(res.drift=res.drift||{win:[],dead:[]})[over==='win'?'win':'dead'].push(run('S.drift||0'));
    if(over==='win'){won=true;res.wins++;for(const k of JSON.parse(run('JSON.stringify(S.gu.map(g=>g.k))')))(res.guWin=res.guWin||{})[k]=(res.guWin[k]||0)+1;const en=run('S.ending');(res.end=res.end||{})[en]=(res.end[en]||0)+1;res.firstWinLife.push(life);res.lifeWins[life]=(res.lifeWins[life]||0)+1;res.rankEnd.push(run('S.chuyen+S.giai/4'))}
    else if(over==='dead'){
      const d=run('META.deaths[META.deaths.length-1]');res.deathTurn.push(d.turn);res.deathRank.push(run('S.chuyen+S.giai/4'));if(d.turn>=27)res.finalDeaths++;
      const key=d.cause+(d.turn>=19&&d.turn<=21?' (lang triều)':'');res.cause[key]=(res.cause[key]||0)+1;
      replay+=d.turn-1;run('rebirth()');
    }else{res.cause['kẹt vòng lặp']=(res.cause['kẹt vòng lặp']||0)+1;run('rebirth()')}
  }
  res.replay.push(replay);res.firstWin.push(won?res.firstWinLife[res.firstWinLife.length-1]:MAXLIFE+1);
}
const avg=a=>a.length?(a.reduce((s,x)=>s+x,0)/a.length).toFixed(2):'-';
console.log(`Chiến dịch: ${N}, tổng kiếp: ${res.lives}`);
console.log(`Thắng trong ${MAXLIFE} kiếp: ${(res.wins/N*100).toFixed(1)}%`);
console.log('Thắng ở kiếp thứ:',JSON.stringify(res.lifeWins));
console.log(`Tỉ lệ thắng kiếp đầu: ${((res.lifeWins[1]||0)/N*100).toFixed(1)}%`);
console.log(`Cảnh giới trung bình lúc lang triều (chuyển + giai/4): ${avg(res.rankAt19)}`);
console.log(`Cảnh giới lúc thắng: ${avg(res.rankEnd)}, tuần chết trung bình: ${avg(res.deathTurn)}`);
console.log(`Cảnh giới tuần 11: ${avg(res.r11)}, lúc chết: ${avg(res.deathRank)}, tới tuần 27: ${res.reach27}, chết ở trận cuối: ${res.finalDeaths}`);
const q=(a,p)=>{const b=[...a].sort((x,y)=>x-y);return b[Math.min(b.length-1,Math.floor(p*b.length))]};
console.log(`Số lần chơi tới lần thắng đầu: trung vị ${q(res.firstWin,.5)}, 80% người chơi ${q(res.firstWin,.8)} (${MAXLIFE+1} = chưa thắng)`);
console.log(`Số tuần phải chơi lại mỗi chiến dịch: trung bình ${avg(res.replay)}, trung vị ${q(res.replay,.5)}. Thiền cứu: ${res.rewinds||0} lần`);
{const r=run('__rep'),g=Object.entries(r.gaps).sort((a,b)=>a[0]-b[0]);console.log(`Sự kiện ngẫu nhiên: ${r.n} lần; lặp lại sau (tuần: số lần):`,g.slice(0,6).map(x=>x.join(':')).join(' '))}
{const b=run('__bf');console.log(`Cánh bướm: lệch TB lúc chết ${avg(res.drift.dead)}, lúc thắng ${avg(res.drift.win)}; mỗi kiếp: dị số ${(b.diso/res.lives).toFixed(2)}, hậu quả trễ ${(b.q/res.lives).toFixed(2)}, thế giới xoay chuyển ${(b.shift/res.lives).toFixed(2)}; lựa chọn ký ức đúng ${b.memOk}, phản tác dụng ${b.memBad}`)}
console.log('Kết cục:',JSON.stringify(res.end||{}));
console.log('Cổ lúc thắng:',JSON.stringify(Object.entries(res.guWin||{}).sort((a,b)=>b[1]-a[1])));
console.log('Nguyên nhân chết:',Object.entries(res.cause).sort((a,b)=>b[1]-a[1]).slice(0,12));
