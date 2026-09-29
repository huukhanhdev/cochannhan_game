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
for(const f of ['data.js','events.js','battle.js','minigame.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
// Giao diện không cần trong mô phỏng
vm.runInContext('function render(){} function showToast(){}',ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/engine.js'),'utf8').replace(/window\.claude\?\.hot[\s\S]*$/,''),ctx,{filename:'engine.js'});

const run=code=>vm.runInContext(code,ctx);
// Người chơi máy
const bot=`
function botCombat(){
  const c=S.combat,hpR=S.hp/maxHp();
  const gus=S.gu.map((g,i)=>({i,k:g.k,d:GU[g.k]}));
  const ready=x=>guReady(x.k)&&S.ess>=costOf(x.d.cost||0);
  const guard=gus.find(x=>x.d.t==='guard'&&ready(x));
  const heal=gus.find(x=>x.d.t==='heal'&&ready(x));
  const atks=gus.filter(x=>x.d.t==='attack'&&ready(x)).sort((a,b)=>b.d.dmg-a.d.dmg);
  const combo=COMBOS.find(cb=>(META.combos||{})[cb.id]&&cb.req.every(k=>hasGu(k))&&guReady(cb.id)&&S.ess>=costOf(cb.cost)&&cb.dmg);
  if(c.flee&&hpR<.3&&c.boss)return playerAct('flee');
  if(hpR<.35&&heal)return playerAct('gu',heal.i);
  if(hpR<.35&&S.herbs>0&&guReady('herb'))return playerAct('herb');
  if((c.intent==='heavy'||(c.intent==='skill'&&['thunder','charge','rage'].includes(c.sk)))&&guard&&c.shield<=0)return playerAct('gu',guard.i);
  if(c.intent==='guard'&&!(c.stun>0)){
    if(S.ess<maxEss()*.6&&S.stones>=5)return playerAct('absorb');
    if(guard&&c.shield<=0)return playerAct('gu',guard.i);
    if(heal&&hpR<.8)return playerAct('gu',heal.i);
  }
  if(combo)return playerAct('combo',combo.id);
  if(atks.length)return playerAct('gu',atks[0].i);
  if(S.stones>=5&&S.ess<10)return playerAct('absorb');
  return playerAct('strike');
}
function botEvent(){
  const ev=EV[S.evq[0]],chs=choicesOf(ev);
  const ok=chs.map((c,i)=>({c,i})).filter(x=>!x.c.req||x.c.req());
  // Ưu tiên lựa chọn có tỉ lệ cao; đôi khi theo nguyên tác
  const sc=x=>(x.c.check?chance(x.c.check[0],x.c.check[1],x.c.bonus?x.c.bonus():0):70)+(x.c.canon?15:0)+Math.random()*25;
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

const N=+process.argv[2]||200,MAXLIFE=+process.argv[3]||8;
const res={r11:[],deathRank:[],reach27:0,finalDeaths:0,lives:0,wins:0,firstWinLife:[],deathTurn:[],cause:{},rankAt19:[],rankEnd:[],lifeWins:{}};
for(let n=0;n<N;n++){
  run('META=freshMeta();newLife();');
  let won=false;
  for(let life=1;life<=MAXLIFE&&!won;life++){
    let steps=0;
    while(!run('S.over')&&steps<4000){
      run('botTurn()');steps++;
      if(run('S.turn')===11&&!run('S._r11')){res.r11.push(run('S.chuyen+S.giai/4'));run('S._r11=1')}
      if(run('S.turn')===27&&!run('S._r27')){res.reach27++;run('S._r27=1')}
      if(run('S.turn')===19&&!run('S._r19')){res.rankAt19.push(run('S.chuyen+S.giai/4'));run('S._r19=1')}
    }
    res.lives++;
    const over=run('S.over');
    if(over==='win'){won=true;res.wins++;res.firstWinLife.push(life);res.lifeWins[life]=(res.lifeWins[life]||0)+1;res.rankEnd.push(run('S.chuyen+S.giai/4'))}
    else if(over==='dead'){
      const d=run('META.deaths[META.deaths.length-1]');res.deathTurn.push(d.turn);res.deathRank.push(run('S.chuyen+S.giai/4'));if(d.turn>=27)res.finalDeaths++;
      const key=d.cause+(d.turn>=19&&d.turn<=21?' (lang triều)':'');res.cause[key]=(res.cause[key]||0)+1;
      run('rebirth()');
    }else{res.cause['kẹt vòng lặp']=(res.cause['kẹt vòng lặp']||0)+1;run('rebirth()')}
  }
}
const avg=a=>a.length?(a.reduce((s,x)=>s+x,0)/a.length).toFixed(2):'-';
console.log(`Chiến dịch: ${N}, tổng kiếp: ${res.lives}`);
console.log(`Thắng trong ${MAXLIFE} kiếp: ${(res.wins/N*100).toFixed(1)}%`);
console.log('Thắng ở kiếp thứ:',JSON.stringify(res.lifeWins));
console.log(`Tỉ lệ thắng kiếp đầu: ${((res.lifeWins[1]||0)/N*100).toFixed(1)}%`);
console.log(`Cảnh giới trung bình lúc lang triều (chuyển + giai/4): ${avg(res.rankAt19)}`);
console.log(`Cảnh giới lúc thắng: ${avg(res.rankEnd)}, tuần chết trung bình: ${avg(res.deathTurn)}`);
console.log(`Cảnh giới tuần 11: ${avg(res.r11)}, lúc chết: ${avg(res.deathRank)}, tới tuần 27: ${res.reach27}, chết ở trận cuối: ${res.finalDeaths}`);
console.log('Nguyên nhân chết:',Object.entries(res.cause).sort((a,b)=>b[1]-a[1]).slice(0,12));
