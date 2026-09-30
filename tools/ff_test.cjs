// Kiểm tra tính năng tua nhanh bằng ký ức (lộ trình 1.1): node tools/ff_test.cjs [số chiến dịch]
// Mỗi chiến dịch: người chơi máy chơi kiếp 1 tới khi chết, rồi kiếp 2 tua lại con đường cũ.
// In ra: tua được bao nhiêu tuần so với mục tiêu, lý do dừng, và có lỗi nào không.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');const noop=()=>{};const store={};
const ctx={console,Math,JSON,Date,setTimeout:noop,clearTimeout:noop,
  localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},
  document:{getElementById:()=>null,addEventListener:noop,querySelectorAll:()=>[],createElement:()=>({getContext:()=>null})},
  matchMedia:()=>({matches:true}),performance:{now:()=>Date.now()}};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['data.js','events.js','living.js','battle.js','minigame.js','auto.js','rt.js','ff.js','cicada.js','butterfly.js','q2/core.js','q2/data2.js','q2/luc.js','q2/truyenthua.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js','q2/ch4_thanh.js','q2/ch5_thieuchu.js','q2/ch6_tamxoa.js','q2/ch7_ngu.js','q2/ch8_baquy.js','q2/ch9_phanboi.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
vm.runInContext('function render(){} function showToast(){}',ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/engine.js'),'utf8').replace(/window\.claude\?\.hot[\s\S]*$/,''),ctx,{filename:'engine.js'});
// Người chơi máy của tools/sim.cjs
const simSrc=fs.readFileSync(path.join(root,'tools/sim.cjs'),'utf8');
vm.runInContext(simSrc.slice(simSrc.indexOf('const bot=`')+11,simSrc.indexOf('`;\nrun(bot)')),ctx);
const run=c=>vm.runInContext(c,ctx);
// Tua thủ công từng bước thay vì dùng hẹn giờ
run('ffSchedule=function(){}');
const N=+process.argv[2]||60,res={reasons:{},reach:[],target:[],errors:0,noOffer:0};
for(let n=0;n<N;n++){
  try{
    run('META=freshMeta();newLife();');
    let s=0;while(s++<4000){const o=run('S.over');if(o==='rewind'){run('rewindTime(false)');continue}if(o)break;run('botTurn()')}
    if(run('S.over')!=='dead')continue;
    run('rebirth();pickTrait(S.traitOpts[0])');
    if(!run('S.ffOffer')){res.noOffer++;continue}
    const target=run('ffDefaultWeek()');run(`ffStart(${target})`);
    let k=0;while(run('!!S.ff')&&k++<2000)run('ffStep()');
    const last=run('S.log.filter(l=>l.t.startsWith("Dừng tua"))').slice(-1)[0];
    const why=last?last.t.replace(/Dừng tua: /,'').replace(/【.*?】/,'【…】').replace(/\d+/g,'N').replace(/ với .*? /,' với … ').slice(0,60):'không rõ';
    res.reasons[why]=(res.reasons[why]||0)+1;res.reach.push(run('S.turn'));res.target.push(target);
  }catch(e){res.errors++;if(res.errors<4)console.log('Lỗi:',e.stack.split('\n').slice(0,3).join(' | '))}
}
const avg=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1):'-';
console.log(`Chiến dịch: ${N}, lỗi: ${res.errors}, không có đề nghị tua: ${res.noOffer}`);
console.log(`Tuần mục tiêu trung bình: ${avg(res.target)}, tua tới tuần trung bình: ${avg(res.reach)}`);
console.log(`Tới đúng mục tiêu: ${res.reach.filter((t,i)=>t>=res.target[i]).length}/${res.reach.length}`);
console.log('Lý do dừng:',Object.entries(res.reasons).sort((a,b)=>b[1]-a[1]));
