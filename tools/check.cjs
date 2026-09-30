// Kiểm tra dữ liệu: không tham chiếu tới cổ, địch, sự kiện, ký ức, kết cục không tồn tại.
// node tools/check.cjs  → mã thoát 1 nếu có lỗi
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),noop=()=>{};
const ctx={console,Math,JSON,Date,setTimeout:noop,clearTimeout:noop,localStorage:{getItem:()=>null,setItem:noop},
  document:{getElementById:()=>null,addEventListener:noop,querySelectorAll:()=>[],createElement:()=>({getContext:()=>null})},
  matchMedia:()=>({matches:true}),performance:{now:()=>0}};
ctx.window=ctx;vm.createContext(ctx);
const files=['data.js','events.js','living.js','battle.js','minigame.js','auto.js','ff.js','cicada.js','butterfly.js','q2/core.js','q2/data2.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
const run=c=>vm.runInContext(c,ctx);
const GU=run('GU'),EN=run('EN'),EV=run('EV'),MEM=run('MEM'),ENDINGS=run('ENDINGS'),AFTER=run('AFTER'),NPC=run('NPC');
const src=['events.js','engine.js','data.js','minigame.js','auto.js','q2/core.js','q2/data2.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js'].map(f=>fs.readFileSync(path.join(root,'js',f),'utf8')).join('\n');
const errs=[],warn=[];
const chk=(kind,set,re)=>{for(const m of src.matchAll(re))if(!(m[1] in set))errs.push(`${kind} không tồn tại: ${m[1]}`)};
chk('cổ',GU,/gainGu\('([a-z0-9_]+)'/g);chk('cổ',GU,/hasGu\('([a-z0-9_]+)'/g);
chk('địch',EN,/fight\('([a-z0-9_]+)'/g);
chk('sự kiện',EV,/evq\.push\('([a-z0-9_]+)'/g);
chk('ký ức',MEM,/learn\('([a-z0-9_]+)'\)/g);chk('ký ức',MEM,/mem\('([a-z0-9_]+)'\)/g);
chk('hàm sau trận',AFTER,/after:'([a-z0-9_]+)'/g);
chk('kết cục',ENDINGS,/ending='([a-z0-9_]+)'/g);
chk('nhân vật',NPC,/meet\('([a-z0-9_]+)'/g);
chk('hậu quả trễ',EV,/later\('([a-z0-9_]+)'/g);chk('ký ức',MEM,/mem:'([a-z0-9_]+)'/g);chk('người nói',NPC,/who:'([a-z0-9_]+)'/g);
for(const [k,v] of Object.entries(run('VARIANTS')))if(!EV[v.ev])errs.push('biến thể trỏ tới mốc không có: '+k);
for(const [e,k] of Object.entries(run('DEATH_MEM')))if(!MEM[k]||!EN[e])errs.push('DEATH_MEM sai: '+e+' → '+k);
for(const [k,ch] of Object.entries(run('CHAPTERS'))){for(const id of Object.values(ch.canon))if(!EV[id])errs.push(`chương ${k}: mốc không có: ${id}`);for(const id of ch.side||[])if(!EV[id])errs.push(`chương ${k}: chuyện bên lề không có: ${id}`);if(!ch.canon[ch.turns])errs.push(`chương ${k}: lượt cuối chưa có mốc kết chương`);for(const s of ch.spots)if(s.foes)for(const f of s.foes)if(!EN[f])errs.push(`chương ${k}: địch không có: ${f}`);for(const g of ch.shop||[])if(!GU[g])errs.push(`chương ${k}: chợ bán cổ không có: ${g}`)}
for(const k of src.matchAll(/chapEnd\('([a-z0-9_]+)'/g))if(!run('CHAPTERS')[k[1]])errs.push('chapEnd tới chương không có: '+k[1]);
for(const id of Object.values(run('CANON')))if(!EV[id])errs.push('CANON trỏ tới sự kiện không có: '+id);
for(const id of run('NPC_POOL'))if(!EV[id])errs.push('NPC_POOL trỏ tới sự kiện không có: '+id);
for(const r of run('RECIPES'))for(const k of [r.id,r.from,r.extraGu].filter(Boolean))if(!GU[k])errs.push('công thức dùng cổ không có: '+k);
for(const c of run('COMBOS'))for(const k of c.req)if(!GU[k])errs.push('sát chiêu dùng cổ không có: '+k);
for(const [e,ks] of Object.entries(run('DROP_POOL')))for(const k of ks)if(!GU[k])errs.push(`địch ${e} rơi cổ không có: ${k}`);
for(const k of [...run('SHOP'),...run('CARAVAN'),...run('WILD')])if(!GU[k])errs.push('chợ bán cổ không có: '+k);
for(const k of Object.keys(EN))if(!run('ART')[k])warn.push('địch chưa có ART: '+k);
// Cổ chỉ lấy được ở chợ, lò luyện, mổ đá
const story=new Set([...src.matchAll(/gainGu\('([a-z0-9_]+)'/g)].map(m=>m[1]));
const noStory=Object.keys(GU).filter(k=>!story.has(k)&&GU[k].t!=='fate');
console.log(errs.length?errs.join('\n'):'Dữ liệu: không có lỗi.');
if(warn.length)console.log('Cảnh báo:\n'+warn.join('\n'));
console.log(`Cổ chưa gắn sự kiện cốt truyện (${noStory.length}): ${noStory.join(', ')}`);
process.exit(errs.length?1:0);
