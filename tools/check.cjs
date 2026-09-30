// Kiểm tra dữ liệu: không tham chiếu tới cổ, địch, sự kiện, ký ức, kết cục không tồn tại.
// node tools/check.cjs  → mã thoát 1 nếu có lỗi
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),noop=()=>{};
const ctx={console,Math,JSON,Date,setTimeout:noop,clearTimeout:noop,localStorage:{getItem:()=>null,setItem:noop},
  document:{getElementById:()=>null,addEventListener:noop,querySelectorAll:()=>[],createElement:()=>({getContext:()=>null})},
  matchMedia:()=>({matches:true}),performance:{now:()=>0}};
ctx.window=ctx;vm.createContext(ctx);
const files=['data.js','events.js','living.js','battle.js','minigame.js','auto.js','ff.js','cicada.js','butterfly.js','q2/core.js','q2/data2.js','q2/luc.js','q2/truyenthua.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js','q2/ch4_thanh.js','q2/ch5_thieuchu.js','q2/ch6_tamxoa.js','q2/ch7_ngu.js','q2/ch8_baquy.js','q2/ch9_phanboi.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
const run=c=>vm.runInContext(c,ctx);
const GU=run('GU'),EN=run('EN'),EV=run('EV'),MEM=run('MEM'),ENDINGS=run('ENDINGS'),AFTER=run('AFTER'),NPC=run('NPC');
const src=['events.js','engine.js','data.js','minigame.js','auto.js','q2/core.js','q2/data2.js','q2/luc.js','q2/truyenthua.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js','q2/ch4_thanh.js','q2/ch5_thieuchu.js','q2/ch6_tamxoa.js','q2/ch7_ngu.js','q2/ch8_baquy.js','q2/ch9_phanboi.js'].map(f=>fs.readFileSync(path.join(root,'js',f),'utf8')).join('\n');
const errs=[],warn=[];
const chk=(kind,set,re)=>{for(const m of src.matchAll(re))if(!(m[1] in set))errs.push(`${kind} không tồn tại: ${m[1]}`)};
chk('cổ',GU,/gainGu\('([a-z0-9_]+)'/g);chk('cổ',GU,/hasGu\('([a-z0-9_]+)'/g);
chk('địch',EN,/fight\('([a-z0-9_]+)'/g);
chk('sự kiện',EV,/evq\.push\('([a-z0-9_]+)'/g);chk('sự kiện',EV,/thenEv\('([a-z0-9_]+)'/g);
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

// Kiểm tra máy cảnh (scene)
for(const [evId, ev] of Object.entries(EV)){
  if(ev.scene){
    const sc=ev.scene;
    if(!sc.nodes) errs.push(`sự kiện ${evId}: scene thiếu nodes`);
    else {
      if(!sc.start || !sc.nodes[sc.start]) errs.push(`sự kiện ${evId}: scene.start không có: ${sc.start}`);
      const reachable = new Set();
      const q = [sc.start];
      while(q.length){
        const curr = q.shift();
        if(!curr || reachable.has(curr)) continue;
        reachable.add(curr);
        const node = sc.nodes[curr];
        if(!node) continue;
        if(node.choices){
          for(const c of node.choices){
            if(c.go){
              if(!sc.nodes[c.go]) errs.push(`sự kiện ${evId}, nút ${curr}: go trỏ tới nút không có: ${c.go}`);
              else if(!reachable.has(c.go)) q.push(c.go);
            }
            if(c.mem && !MEM[c.mem]) errs.push(`sự kiện ${evId}, nút ${curr}: mem trỏ tới ký ức không có: ${c.mem}`);
            if(c.rel && (!NPC[c.rel[0]])) errs.push(`sự kiện ${evId}, nút ${curr}: rel trỏ tới NPC không có: ${c.rel[0]}`);
          }
        }
        if(node.go){
          if(!sc.nodes[node.go]) errs.push(`sự kiện ${evId}, nút ${curr}: go trỏ tới nút không có: ${node.go}`);
          else if(!reachable.has(node.go)) q.push(node.go);
        }
        if(node.okGo){
          if(!sc.nodes[node.okGo]) errs.push(`sự kiện ${evId}, nút ${curr}: okGo trỏ tới nút không có: ${node.okGo}`);
          else if(!reachable.has(node.okGo)) q.push(node.okGo);
        }
        if(node.failGo){
          if(!sc.nodes[node.failGo]) errs.push(`sự kiện ${evId}, nút ${curr}: failGo trỏ tới nút không có: ${node.failGo}`);
          else if(!reachable.has(node.failGo)) q.push(node.failGo);
        }
        if(node.fight){
          const f = node.fight;
          if(!EN[f.foe]) errs.push(`sự kiện ${evId}, nút ${curr}: fight.foe không có: ${f.foe}`);
          if(!sc.nodes[f.win]) errs.push(`sự kiện ${evId}, nút ${curr}: fight.win trỏ tới nút không có: ${f.win}`);
          else if(!reachable.has(f.win)) q.push(f.win);
          if(f.flee){
            if(!sc.nodes[f.flee]) errs.push(`sự kiện ${evId}, nút ${curr}: fight.flee trỏ tới nút không có: ${f.flee}`);
            else if(!reachable.has(f.flee)) q.push(f.flee);
          }
        }
      }
      for(const k of Object.keys(sc.nodes)){
        if(!reachable.has(k)) warn.push(`sự kiện ${evId}: nút mồ côi (không đi tới được): ${k}`);
      }
    }
  }
}

// Nguồn cổ trùng: tính từ sự kiện, công thức luyện, chợ, dã ngoại, rơi từ quái, Quyển 2
const story=new Set([
  ...src.matchAll(/gainGu\('([a-z0-9_]+)'/g),
  ...src.matchAll(/pick\(\[([^\]]+)\]\)/g)
].flatMap(m=>{
  if(m[1].includes("'")) return [...m[1].matchAll(/'([a-z0-9_]+)'/g)].map(x=>x[1]);
  return [m[1]];
}));
for(const r of run('RECIPES')) story.add(r.id);
for(const k of [...run('SHOP'),...run('CARAVAN'),...run('WILD')]) story.add(k);
for(const ks of Object.values(run('DROP_POOL'))) for(const k of ks) story.add(k);
for(const ch of Object.values(run('CHAPTERS'))){
  for(const g of ch.shop||[]) story.add(g);
  for(const g of ch.rewards||[]) story.add(g);
}
// Các cổ để dành cho giai đoạn sau hoặc định mệnh
for(const [k,g] of Object.entries(GU)){
  if(g.later || g.t==='fate' || k==='nole') story.add(k);
}
const noStory=Object.keys(GU).filter(k=>!story.has(k));
console.log(errs.length?errs.join('\n'):'Dữ liệu: không có lỗi.');
if(warn.length)console.log('Cảnh báo:\n'+warn.join('\n'));
if(noStory.length)console.log(`Cổ chưa gắn sự kiện cốt truyện (${noStory.length}): ${noStory.join(', ')}`);
process.exit(errs.length?1:0);
