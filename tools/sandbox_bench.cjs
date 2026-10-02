// Đo cân bằng sandbox E: PN do script giả lập người chơi (khá giỏi) đấu BNB do AI.
// node tools/sandbox_bench.cjs [số trận] [mức: de|thuong|kho]
const {SBSim,SBAI,SB_KITS}=require('./sandbox_sim.cjs');
const N=+process.argv[2]||300;SBAI.level=process.argv[3]||'thuong';
const K=JSON.parse(JSON.stringify(SB_KITS)),dk=SBAI.LEVEL[SBAI.level].dmgK;[K.bnb.atk,...K.bnb.skills].forEach(s=>{if(s.dmg)s.dmg=Math.round(s.dmg*dk)});
let w={pn:0,bnb:0},T=0,hpLeft=0;const ev={};
for(let n=0;n<N;n++){const B=SBSim.create(K,{});let i=0,th=0;
  while(!B.over&&i<60*180){SBSim.step(B);i++;th-=1/60;
    if(th<=0){th=.45+Math.random()*.2;const p=B.actors.pn,b=B.actors.bnb,d=Math.abs(b.x-p.x);
      const tryS=id=>SBSim.check(B,p,{skill:id}).ok&&SBSim.issue(B,'pn',{skill:id,x:b.x,z:b.z}).ok;
      if(B.zones.length&&Math.random()<.7&&tryS('dash')){}
      else if(p.hp<p.maxHp*.45&&tryS('leaf')){}
      else if(p.hp<p.maxHp*.6&&!p.shield&&(tryS('thienbong')||tryS('bachngoc'))){}
      else if(d<120&&tryS('cuxi')){}else if(d<190&&tryS('cuongthu')){}else if(d>150&&tryS('nguyet')){}
      else SBSim.issue(B,'pn',{skill:'atk'})}
    B.events.splice(0).forEach(e=>ev[e.type]=(ev[e.type]||0)+1)}
  if(B.over){w[B.over.winner]++;if(B.over.winner==='pn')hpLeft+=B.actors.pn.hp}T+=B.t}
console.log('mức',SBAI.level,'· PN thắng',(w.pn/N*100).toFixed(1)+'%','· TB',(T/N).toFixed(1)+'s','· máu PN còn TB khi thắng',(hpLeft/Math.max(1,w.pn)).toFixed(0));
console.log('lốc nổ',ev.zoneFire||0,'bị huỷ',ev.zoneCancel||0,'· ngắt',ev.interrupt||0,'· thoát thân',ev.escape||0);
