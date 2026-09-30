// Sơ đồ rẽ nhánh: đọc toàn bộ sự kiện, mỗi lựa chọn bật cờ gì, cờ đó làm sự kiện nào về sau đổi lời hoặc mở nhánh.
// node tools/branchmap.cjs  → ghi BRANCH_MAP.html (mở bằng trình duyệt)
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),noop=()=>{};
const ctx={console,Math,JSON,Date,setTimeout:noop,clearTimeout:noop,localStorage:{getItem:()=>null,setItem:noop},
  document:{getElementById:()=>null,addEventListener:noop,querySelectorAll:()=>[],createElement:()=>({getContext:()=>null})},
  matchMedia:()=>({matches:true}),performance:{now:()=>0}};
ctx.window=ctx;vm.createContext(ctx);
const files=['data.js','events.js','living.js','battle.js','minigame.js','auto.js','rt.js','ff.js','cicada.js','butterfly.js',
  'q2/core.js','q2/data2.js','q2/luc.js','q2/truyenthua.js','q2/ch1_hoanglong.js','q2/ch2_bachcot.js','q2/ch3_thuongdoi.js','q2/ch4_thanh.js',
  'q2/ch5_thieuchu.js','q2/ch6_tamxoa.js','q2/ch7_ngu.js','q2/ch8_baquy.js','q2/ch9_phanboi.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
const run=c=>vm.runInContext(c,ctx);
const EV=run('EV'),CANON=run('CANON'),CH=run('CHAPTERS'),AFTER=run('AFTER'),GU=run('GU'),EN=run('EN'),MEM=run('MEM');
const src=x=>typeof x==='function'?x.toString():JSON.stringify(x||'');
const uniq=a=>[...new Set(a)];
// Cờ bật / đọc trong một đoạn mã. jksIs(...) và jksSet(...) quy về cờ jks.
function sets(code){
  const f=[...code.matchAll(/S\.f\.([a-zA-Z0-9_]+)\s*=(?!=)/g)].map(m=>m[1]);
  if(/jksSet\(/.test(code))f.push('jks');
  return uniq(f);
}
function reads(code){
  const f=[...code.matchAll(/S\.f\.([a-zA-Z0-9_]+)(?!\s*=[^=])/g)].map(m=>m[1]);
  if(/jksIs\(/.test(code))f.push('jks');
  [...code.matchAll(/flag:\s*'!?([a-zA-Z0-9_]+)'/g)].forEach(m=>f.push(m[1]));
  return uniq(f);
}
// Hậu quả của một đoạn mã: sự kiện hẹn, bước tiếp, trận, hàm sau trận, cổ nhận, ký ức
function effects(code){
  const o=[];
  [...code.matchAll(/later\('([a-z0-9_]+)'/g)].forEach(m=>o.push(['later',m[1]]));
  [...code.matchAll(/thenEv\('([a-z0-9_]+)'/g)].forEach(m=>o.push(['then',m[1]]));
  [...code.matchAll(/fight2?\('([a-z0-9_]+)'(?:,\{[^}]*after:'([a-z0-9_]+)')?/g)].forEach(m=>o.push(['fight',m[1],m[2]]));
  [...code.matchAll(/gainGu\('([a-z0-9_]+)'/g)].forEach(m=>o.push(['gu',m[1]]));
  [...code.matchAll(/learn\('([a-z0-9_]+)'/g)].forEach(m=>o.push(['mem',m[1]]));
  [...code.matchAll(/chapEnd\('([a-z0-9_]+)'/g)].forEach(m=>o.push(['chap',m[1]]));
  [...code.matchAll(/S\.ending='([a-z0-9_]+)'/g)].forEach(m=>o.push(['end',m[1]]));
  return o;
}
// Tách lựa chọn từ mã nguồn (kể cả lựa chọn trong hàm và nhánh ...(điều kiện?[...]:[]))
function choicesFrom(code){
  const parts=code.split(/\{t:/).slice(1);
  return parts.map(p=>{
    const t=(p.match(/^\s*(?:S\.f\.[a-zA-Z]+\?)?[`'"]([^`'"]*)[`'"]/)||[])[1]||(p.match(/^[^,]*/)||[''])[0].slice(0,80);
    return {t,code:p,go:(p.match(/\bgo:'([a-z0-9_]+)'/)||[])[1],need:(p.match(/need:\{([^}]*)\}/)||[])[1]};
  });
}
// Ai đọc cờ nào (để nói "bật cờ X thì về sau sự kiện Y đổi")
const READERS={};
for(const [id,e] of Object.entries(EV)){
  let code=src(e.cond)+src(e.text)+src(e.choices)+src(e.post);
  if(e.scene)for(const n of Object.values(e.scene.nodes))code+=src(n.talk)+src(n.choices)+src(n.eff)+src(n.check);
  for(const f of reads(code))(READERS[f]=READERS[f]||new Set()).add(id);
}
// Hàm sau trận cũng bật cờ
const AFTER_SETS={};for(const [k,f] of Object.entries(AFTER))AFTER_SETS[k]=sets(src(f));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const name=id=>EV[id]?esc(EV[id].title||id):esc(id);
const link=id=>EV[id]?`<a href="#${id}">${name(id)}</a>`:esc(id);
function effHTML(code,self){
  const out=[];
  const fl=sets(code);
  const fx=effects(code);
  fx.filter(x=>x[0]==='fight'&&x[2]&&AFTER_SETS[x[2]]).forEach(x=>fl.push(...AFTER_SETS[x[2]]));
  uniq(fl).forEach(f=>{const r=[...(READERS[f]||[])].filter(x=>x!==self);out.push(`<li class="flag">bật <code>${f}</code>${r.length?` → về sau đổi: ${r.slice(0,8).map(link).join(', ')}${r.length>8?` (+${r.length-8})`:''}`:' <em>(chưa sự kiện nào đọc)</em>'}</li>`)});
  fx.forEach(x=>{
    if(x[0]==='later')out.push(`<li class="ev">hẹn vài tuần sau: ${link(x[1])}</li>`);
    if(x[0]==='then')out.push(`<li class="ev">ngay sau đó: ${link(x[1])}</li>`);
    if(x[0]==='fight')out.push(`<li class="fight">trận: ${esc(EN[x[1]]?EN[x[1]].n:x[1])}${x[2]?` (sau trận: <code>${x[2]}</code>)`:''}</li>`);
    if(x[0]==='gu')out.push(`<li class="gu">nhận ${esc(GU[x[1]]?GU[x[1]].n:x[1])}</li>`);
    if(x[0]==='mem')out.push(`<li class="mem">ký ức: ${esc(MEM[x[1]]?MEM[x[1]].n:x[1])}</li>`);
    if(x[0]==='chap')out.push(`<li class="ev">sang chương: ${esc(x[1])}</li>`);
    if(x[0]==='end')out.push(`<li class="end">kết cục: ${esc(x[1])}</li>`);
  });
  return out.length?`<ul>${out.join('')}</ul>`:'';
}
function eventHTML(id){
  const e=EV[id];if(!e)return '';
  const rd=reads(src(e.cond)+src(e.text)).filter(f=>f);
  let h=`<details id="${id}"><summary><b>${name(id)}</b> <code>${id}</code>${e.cond?` · điều kiện: <code>${esc(src(e.cond).replace(/^\(\)=>/,'').slice(0,90))}</code>`:''}</summary>`;
  if(rd.length)h+=`<p class="rd">Lời mở đổi theo: ${rd.map(f=>`<code>${f}</code>`).join(' ')}</p>`;
  if(e.scene){
    for(const [nid,n] of Object.entries(e.scene.nodes)){
      const cs=n.choices?choicesFrom(src(n.choices)):[];
      h+=`<div class="node"><b>Bước ${esc(nid)}</b>${n.check?` · tung xúc xắc → ${esc(n.okGo||'')} / ${esc(n.failGo||'')}`:''}${n.fight?` · trận ${esc(n.fight.foe)}`:''}`;
      if(n.eff)h+=`<div class="term">Kết thúc bước:${effHTML(src(n.eff),id)}</div>`;
      h+=cs.map(c=>`<div class="ch">▸ ${esc(c.t)}${c.go?` <span class="go">→ bước ${esc(c.go)}</span>`:''}${c.need?` <span class="need">cần {${esc(c.need)}}</span>`:''}${effHTML(c.code,id)}</div>`).join('')+'</div>';
    }
  }else{
    h+=choicesFrom(src(e.choices)).map(c=>`<div class="ch">▸ ${esc(c.t)}${c.need?` <span class="need">cần {${esc(c.need)}}</span>`:''}${effHTML(c.code,id)}</div>`).join('');
    if(e.post){const p=effHTML(src(e.post),id);if(p)h+=`<div class="term">Sau mọi lựa chọn:${p}</div>`}
  }
  return h+'</details>';
}
// Bố cục: Quyển 1 theo tuần, tuyến NPC, hậu quả trễ, chuyện nhiều bước; Quyển 2 theo chương
const sec=[];
const canonIds=Object.entries(CANON).sort((a,b)=>a[0]-b[0]);
sec.push(`<h2>Quyển 1 · Mốc chính theo tuần</h2>`+canonIds.map(([t,id])=>`<h3>Tuần ${t}</h3>${eventHTML(id)}`).join(''));
const q1=Object.keys(EV).filter(k=>!k.startsWith('q2'));
const grp=(title,filter)=>{const ids=q1.filter(filter);if(ids.length)sec.push(`<h2>${title}</h2>`+ids.map(eventHTML).join(''))};
grp('Quyển 1 · Tuyến NPC',k=>k.startsWith('npc_'));
grp('Quyển 1 · Hậu quả trễ và chuyện đi kèm',k=>/^(q|x)_/.test(k)||(/^c_/.test(k)&&!Object.values(CANON).includes(k)));
grp('Quyển 1 · Chuyện nhiều bước (kỳ ngộ)',k=>/^k_/.test(k)&&(EV[k].chain||/thenEv|later\(/.test(src(EV[k].choices))));
for(const [ck,c] of Object.entries(CH)){
  const ids=Object.values(c.canon||{});
  const side=(c.side||[]);
  sec.push(`<h2>Quyển 2 · ${esc(c.title||ck)}</h2>`+ids.map(eventHTML).join('')+(side.length?`<h3>Chuyện bên lề</h3>`+side.map(eventHTML).join(''):''));
}
// Bảng cờ: ai bật, ai đọc
const SETTERS={};
for(const [id,e] of Object.entries(EV)){let code=src(e.choices)+src(e.post);if(e.scene)for(const n of Object.values(e.scene.nodes))code+=src(n.choices)+src(n.eff);for(const f of sets(code))(SETTERS[f]=SETTERS[f]||new Set()).add(id)}
for(const [k,fl] of Object.entries(AFTER_SETS))for(const f of fl)(SETTERS[f]=SETTERS[f]||new Set()).add('AFTER.'+k);
const flags=uniq([...Object.keys(SETTERS),...Object.keys(READERS)]).sort();
const deadRead=flags.filter(f=>READERS[f]&&!SETTERS[f]);
// Đọc ở bất kỳ đâu trong code (engine, kết cục, Quyển 2...), không chỉ trong sự kiện
const ALL=files.concat(['engine.js','ui.js','present.js']).map(f=>{try{return fs.readFileSync(path.join(root,'js',f),'utf8')}catch(e){return ''}}).join('\n');
const readAnywhere=f=>new RegExp('S\\.f\\.'+f+'(?!\\s*=[^=])').test(ALL)||(f==='jks'&&/jksIs\(/.test(ALL));
const deadSet=flags.filter(f=>SETTERS[f]&&!readAnywhere(f));
sec.push(`<h2>Bảng cờ</h2><p>Cờ được bật nhưng không sự kiện nào đọc (nhánh không để lại hậu quả): ${deadSet.map(f=>`<code>${f}</code>`).join(' ')||'không có'}</p>
<p>Cờ được đọc nhưng không thấy chỗ bật (có thể bật trong engine): ${deadRead.map(f=>`<code>${f}</code>`).join(' ')||'không có'}</p>
<table><tr><th>Cờ</th><th>Bật ở</th><th>Đọc ở</th></tr>${flags.map(f=>`<tr><td><code>${f}</code></td><td>${[...(SETTERS[f]||[])].map(x=>x.startsWith('AFTER.')?esc(x):link(x)).join(', ')}</td><td>${[...(READERS[f]||[])].map(link).join(', ')}</td></tr>`).join('')}</table>`);
const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sơ đồ rẽ nhánh</title>
<style>
:root{--bg:#101416;--fg:#e8e2d0;--dim:#9a9486;--gold:#d6ae60;--line:#2a3236}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,sans-serif}
main{max-width:980px;margin:0 auto;padding:16px}
h1{font-size:24px}h2{margin-top:32px;border-bottom:1px solid var(--line);padding-bottom:4px;color:var(--gold)}h3{font-size:15px;color:var(--dim);margin:14px 0 4px}
details{border:1px solid var(--line);border-radius:6px;margin:6px 0;padding:6px 10px;background:#141a1d}
summary{cursor:pointer}code{color:#9fd8ff;font-size:.88em}
.ch{margin:6px 0 6px 10px}.node{border-left:2px solid var(--line);padding-left:10px;margin:8px 0}
.go{color:#b9a8e8}.need{color:#e8b07a;font-size:.9em}.rd{color:var(--dim);font-size:.9em;margin:4px 0}
ul{margin:2px 0 2px 18px;padding:0}li{font-size:.9em}li.flag{color:#cfe8c0}li.fight{color:#e8847a}li.gu{color:#e8cf8a}li.mem{color:#b9a8e8}li.end{color:#fff1b8;font-weight:600}
.term{margin:4px 0 4px 10px;color:var(--dim)}table{border-collapse:collapse;width:100%;font-size:.85em}td,th{border:1px solid var(--line);padding:4px 6px;vertical-align:top}
a{color:#e8cf8a}
@media (max-width:640px){main{padding:12px}}
</style></head><body><main><h1>Sơ đồ rẽ nhánh · Thanh Mao Sơn Ký</h1>
<p>Tạo tự động từ code bởi <code>tools/branchmap.cjs</code>. Mỗi lựa chọn: bật cờ nào, cờ đó làm sự kiện nào về sau đổi lời hoặc mở nhánh, hẹn sự kiện nào, vào trận nào. Bấm tên sự kiện để mở.</p>
${sec.join('\n')}</main></body></html>`;
fs.writeFileSync(path.join(root,'BRANCH_MAP.html'),html);
console.log(`Đã ghi BRANCH_MAP.html: ${Object.keys(EV).length} sự kiện, ${flags.length} cờ. Cờ bật mà không ai đọc: ${deadSet.length}.`);
