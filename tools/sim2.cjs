// Mô phỏng Quyển 2: node tools/sim2.cjs [số chiến dịch] [số lần làm lại tối đa mỗi chương]
// Bắt đầu từ kết Quyển 1 (huyetlo_bai), chơi bằng bot tới khi hết nội dung Quyển 2 hoặc hết lượt làm lại.
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
ctx.__q1min=process.env.Q1INV==='min';
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
  if(!ok.length)throw new Error('Kẹt: '+S.evq[0]+' · thạch '+S.stones);
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
  if(S.ess>=maxEss()*(S.book===2?.9:.7)&&Math.random()<(S.book===2?.5:1))return act('tuluyen');
  if(S.book!==2&&!S.f.hoatuu&&Math.random()<.35)return act('hauson');
  if(S.book===2){const sp=curChap().spots.filter(s=>!s.minor&&!['tuluyen','nghi'].includes(s.id)&&(!s.show||s.show()));const hot=sp.filter(s=>['dienvo','txvang','txlam','txdo'].includes(s.id));return act(pick(hot.length&&Math.random()<.6?hot:sp).id)}
  return act(pick(['nui','nui','nhiemvu','nhiemvu','hocduong','trai'].filter(a=>a!=='hocduong'||S.turn<=18)));
}
function r0(i){return RECIPES[i].st+40}
`;
run(bot);
// Đếm dị số, hậu quả trễ, lựa chọn ký ức theo từng kiếp
run(`var __bf={diso:0,q:0,memOk:0,memBad:0,lives:0,shift:0};const __ch=choose;choose=function(i){const id=S.evq[0],ev=EV[id];if(ev){const c=choicesOf(ev)[i];if(id.startsWith('d_'))__bf.diso++;if(id.startsWith('q_'))__bf.q++;if(c&&c.mem){const k=Object.keys(VARIANTS).find(k=>VARIANTS[k].ev===id);if(k&&varShifted(k))__bf.memBad++;else __bf.memOk++}}return __ch(i)};const __sv=shiftVariant;shiftVariant=function(w){__bf.shift++;return __sv(w)}`);
// Đo lặp sự kiện ngẫu nhiên: khoảng cách ngắn nhất (tuần) giữa hai lần cùng một sự kiện trong một kiếp
run(`var __rep={n:0,gaps:{}};const __re=randomEvent;randomEvent=function(loc){const ok=__re(loc);if(ok){const id=S.evq[S.evq.length-1];S.__ev=S.__ev||{};if(S.__ev[id]!==undefined){const g=S.turn-S.__ev[id];__rep.gaps[g]=(__rep.gaps[g]||0)+1}S.__ev[id]=S.turn;__rep.n++}return ok}`);


const N=+process.argv[2]||100,RETRY=+process.argv[3]||5;
const res={end:{},reach:{},retries:{},cause:{},stuck:0,turns:0,rewinds:0,rank:{}};
for(let n=0;n<N;n++){
  run("META=freshMeta();newLife();S.traitOpts=null;S.tamco=14;S.satphat=10;S.ngo=10;S.tuchat=90;S.gu=(__q1min?['xuanthu','nguyetquang']:['xuanthu','huyetnguyet','trilieu','cuongthu','huyetlo','thiennguyen','cuxikimngo','hacthi','dausuat','thienbong','diathinh','tuvi','amduong']).map(k=>({k,h:0}));S.over='win';S.ending='huyetlo_bai';startQ2('huyetlo_bai')");
  let steps=0,tries=0;const seen=new Set();
  while(steps<6000){
    const ch=run('S.chap');if(!seen.has(ch)){seen.add(ch);res.reach[ch]=(res.reach[ch]||0)+1}
    const o=run('S.over');
    if(o==='rewind'){run('rewindTime(false)');res.rewinds++;steps++;continue}
    if(o==='win'){const e=run('S.ending');res.end[e]=(res.end[e]||0)+1;(res.att=res.att||{})[tries+1]=(res.att[tries+1]||0)+1;break}
    if(o==='dead'){const d=run('META.deaths[META.deaths.length-1]');const k=ch+' · '+d.cause;res.cause[k]=(res.cause[k]||0)+1;res.retries[ch]=(res.retries[ch]||0)+1;
      if(++tries>RETRY)break;run('restartChapter()');steps++;continue}
    run('botTurn()');steps++;
  }
  if(steps>=6000)res.stuck++;
  (res.st=res.st||[]).push(run("({dv:S.f.dvRank||0,kv:(S.f.kv||{}).ai||0,tv:(S.f.tv||{}).ai||0,bv:(S.f.bv||{}).ai||0,batu:+!!S.f.batuChet,duc:+hasGu('cotduc'),toan:+hasGu('toanluc'),beast:beastCount()})"));
  const rk=run('S.chuyen+"."+S.giai');res.rank[rk]=(res.rank[rk]||0)+1;
}
console.log(`Chiến dịch: ${N}, chết thật thì làm lại từ đầu Quyển 2, tối đa ${RETRY} lần`);
console.log('Thắng ở lần thử:',JSON.stringify(res.att||{}));
console.log('Tới chương:',JSON.stringify(res.reach));
console.log('Số lần làm lại theo chương:',JSON.stringify(res.retries));
console.log('Kết:',JSON.stringify(res.end),'· kẹt vòng lặp:',res.stuck,'· Thiền cứu:',res.rewinds);
console.log('Cảnh giới cuối (chuyển.giai):',JSON.stringify(res.rank));
{const A=k=>(res.st.reduce((s,x)=>s+x[k],0)/res.st.length).toFixed(2);console.log('Trung bình: hạng diễn võ',A('dv'),'· ải Khuyển',A('kv'),'· ải Tín',A('tv'),'· ải Bạo',A('bv'),'· giết Bá Tu',A('batu'),'· Cốt Dực',A('duc'),'· Toàn Lực',A('toan'),'· hư ảnh',A('beast'))}
console.log('Nguyên nhân chết:',Object.entries(res.cause).sort((a,b)=>b[1]-a[1]).slice(0,12));
