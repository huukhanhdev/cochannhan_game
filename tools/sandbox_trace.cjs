// Baseline diễn biến trận để refactor không đổi hành vi (bước A0, KE_HOACH_DUA_ROSTER_VAO_BATTLE).
// node tools/sandbox_trace.cjs            → so với tools/reports/sandbox_trace_baseline.json, lệch thì exit 1
// node tools/sandbox_trace.cjs --write    → ghi lại baseline (chỉ khi cố ý đổi hành vi, ghi lý do vào commit)
// Mỗi trận: seed cố định, bot người chơi đơn giản + máy BNB; trace = chuỗi sự kiện (t, who, type, skill, amount)
// và HP/chân nguyên mỗi 0,5s. So bằng hash từng trận để chỉ ra trận nào lệch.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {SBSim,SBAI,SB_KITS}=require('./sandbox_sim.cjs');
const OUT=path.join(__dirname,'reports','sandbox_trace_baseline.json');
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
// Bot người chơi: đủ đa dạng để chạm mọi nhánh (đạn, hộ thể, chộp, rết, lá, lướt, né), nhưng quyết định chỉ dựa state + rng riêng.
function bot(B,r,P,E){
  const p=B.actors[P],b=B.actors[E],dir=Math.sign(b.x-p.x)||1,d=Math.abs(b.x-p.x);
  const tryS=(id,x=b.x,z=b.z)=>p.sk[id]&&SBSim.check(B,p,{skill:id}).ok&&SBSim.issue(B,P,{skill:id,x,z}).ok;
  const A=b.act;
  if(A&&A.phase==='startup'&&A.t>=.3&&A.s.kind==='melee'&&SBSim.inMelee(b,p,A.s,false)&&r()<.6){
    SBSim.issue(B,P,{skill:'move',x:p.x,z:p.z+(p.z>B.arena.Z1/2?-1:1)*(A.s.depth+35),cancel:true});return}
  if(p.state!=='idle'&&p.state!=='move')return;
  if(p.hp<p.maxHp*.45&&tryS('leaf'))return;
  if(p.hp<p.maxHp*.6&&!p.shield&&(tryS('thienbong')||tryS('bachngoc')))return;
  const roll=r();
  if(roll<.2&&d>=150&&tryS('nguyet'))return;
  if(roll<.35&&tryS('cuxi'))return;
  if(roll<.45&&d>120&&d<190&&tryS('cuongthu'))return;
  if(roll<.5&&tryS('dash',p.x-dir*150,p.z))return;
  if(roll<.7){SBSim.issue(B,P,{skill:'move',x:p.x-dir*120,z:Math.max(0,Math.min(B.arena.Z1,p.z+(r()-.5)*160)),cancel:true});return}
  tryS('atk');
}
function fight({seed,level,arena,mode}){
  SBAI.level=level;
  const K=JSON.parse(JSON.stringify(SB_KITS)),dk=SBAI.LEVEL[level].dmgK;
  [K.bnb.atk,...K.bnb.skills].forEach(s=>{if(s.dmg)s.dmg=Math.round(s.dmg*dk)});
  const B=SBSim.create(K,{rng:rng(seed),arena:SBSim.ARENAS[arena]});B.aiMode=mode;
  const P=B.ids.player,E=B.ids.enemy,r=rng(seed^0x9e3779b9),lines=[];let think=0,snap=0;
  for(let i=0;!B.over&&i<60*90;i++){
    SBSim.step(B);think-=SBSim.DT;snap-=SBSim.DT;
    if(think<=0){think=.15;bot(B,r,P,E)}
    for(const e of B.events.splice(0))lines.push([e.t.toFixed(3),e.who===P?'P':'E',e.type,e.skill||'',e.amount??'',e.fee??''].join(','));
    if(snap<=0){snap=.5;const a=B.actors[P],b=B.actors[E];lines.push(['s',a.hp.toFixed(2),a.ess.toFixed(2),a.x.toFixed(1),a.z.toFixed(1),b.hp.toFixed(2),b.ess.toFixed(2),b.x.toFixed(1),b.z.toFixed(1)].join(','))}
  }
  const over=B.over?{winner:B.over.winner===P?'P':'E',at:+B.over.at.toFixed(3),retreat:!!B.over.retreat}:null;
  const text=lines.join('\n');
  return {hash:crypto.createHash('sha256').update(text).digest('hex').slice(0,16),events:lines.length,over};
}
const CASES=[];
for(const level of ['thuong','cao','de'])for(const arena of ['wide','classic'])for(const mode of ['pressure','legacy'])
  for(let k=0;k<(level==='thuong'&&arena==='wide'&&mode==='pressure'?12:3);k++)CASES.push({seed:20261003+k*7919,level,arena,mode});
const res=CASES.map(c=>({...c,...fight(c)}));
if(process.argv.includes('--write')){
  fs.writeFileSync(OUT,JSON.stringify({note:'Baseline trace PN/BNB trước refactor roster (A0). So bằng node tools/sandbox_trace.cjs',
    created:new Date().toISOString(),cases:res},null,1));
  console.log('Đã ghi baseline',res.length,'trận →',path.relative(process.cwd(),OUT));
}else{
  const base=JSON.parse(fs.readFileSync(OUT,'utf8')).cases;let bad=0;
  res.forEach((r,i)=>{const b=base[i];if(!b||b.hash!==r.hash){bad++;console.log('LỆCH',JSON.stringify({case:{seed:r.seed,level:r.level,arena:r.arena,mode:r.mode},base:b&&{hash:b.hash,over:b.over},now:{hash:r.hash,over:r.over}}))}});
  if(bad){console.log(`Trace: ${bad}/${res.length} trận lệch baseline.`);process.exit(1)}
  console.log(`Trace: ${res.length}/${res.length} trận trùng baseline (sự kiện + HP/chân nguyên/vị trí mỗi 0,5s).`);
}
