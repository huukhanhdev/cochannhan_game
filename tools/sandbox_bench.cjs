// Đo cân bằng sandbox E: PN do script giả lập người chơi đấu BNB do AI.
// node tools/sandbox_bench.cjs [số trận] [mức: de|thuong|kho] [kiểu: move|spam]
//   spam : đứng ra chiêu liên tục, không né (cách chơi cũ)
//   move : phản xạ trễ 0,2s: bước ra khỏi ô đòn đỏ / vòng Lốc, giữ khoảng cách rồi phóng Nguyệt Mang (thả diều)
// So hai kiểu để biết di chuyển có quyết định trận hay không.
const {SBSim,SBAI,SB_KITS}=require('./sandbox_sim.cjs');
const N=+process.argv[2]||300;SBAI.level=process.argv[3]||'thuong';const style=process.argv[4]||'move';
const K=JSON.parse(JSON.stringify(SB_KITS)),dk=SBAI.LEVEL[SBAI.level].dmgK;[K.bnb.atk,...K.bnb.skills].forEach(s=>{if(s.dmg)s.dmg=Math.round(s.dmg*dk)});
const REACT=.2;
let w={pn:0,bnb:0},T=0,hpLeft=0;const ev={};
function spamBot(B){
  const p=B.actors.pn,b=B.actors.bnb,d=Math.abs(b.x-p.x);
  const tryS=id=>SBSim.check(B,p,{skill:id}).ok&&SBSim.issue(B,'pn',{skill:id,x:b.x,z:b.z}).ok;
  if(p.hp<p.maxHp*.45&&tryS('leaf'))return;
  if(p.hp<p.maxHp*.6&&!p.shield&&(tryS('thienbong')||tryS('bachngoc')))return;
  if(d<120&&tryS('cuxi'))return;if(d<190&&tryS('cuongthu'))return;if(d>150&&tryS('nguyet'))return;
  SBSim.issue(B,'pn',{skill:'atk'});
}
function moveBot(B){
  const p=B.actors.pn,b=B.actors.bnb,dx=b.x-p.x,d=Math.abs(dx),dir=Math.sign(dx)||1,A=b.act;
  const tryS=(id,x=b.x,z=b.z)=>SBSim.check(B,p,{skill:id}).ok&&SBSim.issue(B,'pn',{skill:id,x,z}).ok;
  const away=(dist,dz=0)=>SBSim.issue(B,'pn',{skill:'move',x:p.x-dir*dist,z:Math.max(0,Math.min(SBSim.Z1,p.z+dz)),cancel:true});
  // 1. né: vòng Lốc đang chờ và mình ở trong → lướt ra (hoặc chạy)
  for(const z of B.zones)if(B.t-z.from>=REACT&&Math.hypot(p.x-z.x,(p.z-z.z)*1.6)<z.r+20){
    if(!tryS('dash',p.x-dir*200,p.z))away(160,p.z>120?-60:60);return}
  // 2. né: đòn cận chiến địch đang lấy đà, mình trong ô → lùi ra khỏi tầm
  if(A&&A.phase==='startup'&&A.t>=REACT&&A.s.kind==='melee'&&d<=A.s.range+15&&Math.abs(b.z-p.z)<=A.s.depth+10){away(90);return}
  // 3. phản đòn: địch đang thu chiêu sau đòn trượt, mình trong tầm → đánh
  if(A&&A.phase==='recovery'&&d<=110){if(tryS('cuxi'))return;SBSim.issue(B,'pn',{skill:'atk'});return}
  if(p.state==='act')return;
  if(p.hp<p.maxHp*.45&&d>200&&tryS('leaf'))return;
  if(p.hp<p.maxHp*.55&&!p.shield&&d<220&&(tryS('thienbong')||tryS('bachngoc')))return;
  // 4. thả diều: quá gần mà địch rảnh → lùi giữ khoảng 200–300; xa thì phóng Nguyệt Mang
  if(d<150&&!A){away(120,(Math.random()-.5)*80);return}
  if(d>=180&&tryS('nguyet'))return;
  if(d<190&&d>120&&tryS('cuongthu'))return;
  if(d>320)SBSim.issue(B,'pn',{skill:'move',x:b.x-dir*240,z:b.z});
}
for(let n=0;n<N;n++){const B=SBSim.create(K,{});let i=0,th=0;
  while(!B.over&&i<60*240){SBSim.step(B);i++;th-=1/60;
    if(th<=0){th=style==='spam'?.45+Math.random()*.2:.12;(style==='spam'?spamBot:moveBot)(B)}
    B.events.splice(0).forEach(e=>ev[e.type]=(ev[e.type]||0)+1)}
  if(B.over){w[B.over.winner]++;if(B.over.winner==='pn')hpLeft+=B.actors.pn.hp}T+=B.t}
const hits=ev.dmg||0,miss=ev.miss||0;
console.log(`mức ${SBAI.level} · kiểu ${style} · PN thắng ${(w.pn/N*100).toFixed(1)}% · TB ${(T/N).toFixed(1)}s · máu PN còn TB khi thắng ${(hpLeft/Math.max(1,w.pn)).toFixed(0)}`);
console.log(`  đòn trúng ${hits} · trượt ${miss} · huỷ chiêu ${ev.cancel||0} · lốc nổ ${ev.zoneFire||0} · thoát thân ${ev.escape||0}`);
