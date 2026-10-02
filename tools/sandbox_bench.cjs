// So sánh cùng nhịp quyết định, cùng seed và cùng chính sách hồi máu/hộ thể; move giữ khoảng cách và né, spam áp sát.
// node tools/sandbox_bench.cjs [N=300] [de|thuong|kho] [move|spam|stand|compare] [seed=20261002]
// spam có tự đuổi khi đánh thường; stand tuyệt đối không ra lệnh đi/lướt/đuổi.
const {SBSim,SBAI,SB_KITS}=require('./sandbox_sim.cjs');
const N=Number(process.argv[2]||300),level=process.argv[3]||'thuong',style=process.argv[4]||'compare',seed=Number(process.argv[5]||20261002);
if(!Number.isInteger(N)||N<1||!SBAI.LEVEL[level]||!['move','spam','stand','compare'].includes(style)||!Number.isFinite(seed))throw Error('Tham số benchmark không hợp lệ');
SBAI.level=level;
const K=JSON.parse(JSON.stringify(SB_KITS)),dk=SBAI.LEVEL[level].dmgK;
[K.bnb.atk,...K.bnb.skills].forEach(s=>{if(s.dmg)s.dmg=Math.round(s.dmg*dk)});
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
const THINK=.1,REACT=.15;
function bot(B,style){
  const p=B.actors.pn,b=B.actors.bnb,dir=Math.sign(b.x-p.x)||1,d=Math.abs(b.x-p.x);
  const tryS=(id,x=b.x,z=b.z)=>SBSim.check(B,p,{skill:id}).ok&&SBSim.issue(B,'pn',{skill:id,x,z}).ok;
  const go=(x,z)=>{B.evadeUntil=B.t+.65;return SBSim.issue(B,'pn',{skill:'move',x,z,cancel:true})};
  if(style==='move'&&B.t<(B.evadeUntil||0)&&p.state==='move')return;
  // Không tự huỷ lần né vừa bắt đầu; không xếp đòn đánh thay lệnh thoát vùng nguy hiểm.
  if(style==='move'&&!(p.act&&['dash','escape'].includes(p.act.s.kind))){
    const side=p.z>SBSim.Z1/2?-1:1;
    for(const zone of B.zones)if(B.t-zone.from>=REACT&&Math.hypot(p.x-zone.x,(p.z-zone.z)*1.6)<zone.r+12){
      // Ưu tiên chiều sâu: vòng Lốc có bán kính theo z nhỏ hơn theo x.
      const z=Math.max(0,Math.min(SBSim.Z1,zone.z+side*(zone.r/1.6+35)));
      if(Math.abs(z-p.z)>20){if(!tryS('dash',p.x,z))go(p.x,z)}
      else go(p.x-dir*(zone.r+45),p.z);
      return;
    }
    const A=b.act;
    if(A&&A.phase==='startup'&&A.t>=REACT&&A.s.kind==='melee'&&SBSim.inMelee(b,p,A.s,false)){
      go(p.x,p.z+side*(A.s.depth+35));return;
    }
  }
  // Các bot không liên tục đè bộ đệm và không liên tục đè bộ đệm lúc đang bận.
  if(p.state!=='idle'&&p.state!=='move')return;
  if(p.hp<p.maxHp*.45&&(style!=='move'||d>200)&&tryS('leaf'))return;
  if(p.hp<p.maxHp*.6&&!p.shield&&(tryS('thienbong')||tryS('bachngoc')))return;
  if(style==='move'){
    if(d<170&&!b.act){
      const cornered=dir>0?p.x<SBSim.X0+100:p.x>SBSim.X1-100;
      go(cornered?p.x+dir*160:p.x-dir*130,p.z+(p.z>SBSim.Z1/2?-90:90));return;
    }
    if(d>=170&&tryS('nguyet'))return;
    if(b.act?.phase==='recovery'){if(tryS('cuxi'))return;if(tryS('atk'))return;}
    if(d>120&&d<190&&tryS('cuongthu'))return;
    if(d>320)SBSim.issue(B,'pn',{skill:'move',x:b.x-dir*240,z:b.z});
    return;
  }
  if(tryS('cuxi'))return;
  if(tryS('cuongthu'))return;
  if(d>150&&tryS('nguyet'))return;
  if(style==='stand'){
    if(SBSim.inMelee(p,b,p.sk.atk,true))tryS('atk');
  }else tryS('atk');
}
function run(style){
  const stats={style,wins:0,losses:0,timeouts:0,seconds:0,hp:0,moving:0,events:{},pnDamage:0,bnbDamage:0,damageBySkill:{},cancelBySkill:{},cancelByPhase:{}};
  for(let n=0;n<N;n++){
    const B=SBSim.create(K,{rng:rng(seed+n)});let think=0;
    for(let i=0;!B.over&&i<60*120;i++){
      SBSim.step(B);think-=SBSim.DT;
      if(think<=0){think=THINK;bot(B,style)}
      if(B.actors.pn.state==='move')stats.moving+=SBSim.DT;
      for(const e of B.events.splice(0)){
        if(e.who==='pn')stats.events[e.type]=(stats.events[e.type]||0)+1;
        if(e.type==='dmg'){if(e.who==='pn')stats.pnDamage+=e.amount;else stats.bnbDamage+=e.amount;const key=(e.source||'dot')+':'+(e.skill||'bleed');stats.damageBySkill[key]=(stats.damageBySkill[key]||0)+e.amount}
        if(e.type==='cancel'&&e.who==='pn'){stats.cancelBySkill[e.skill]=(stats.cancelBySkill[e.skill]||0)+1;stats.cancelByPhase[e.phase]=(stats.cancelByPhase[e.phase]||0)+1;}
      }
    }
    if(!B.over)stats.timeouts++;else if(B.over.winner==='pn'){stats.wins++;stats.hp+=B.actors.pn.hp}else stats.losses++;
    stats.seconds+=B.t;
  }
  console.log(JSON.stringify({level,seed,N,think:THINK,...stats,winPercent:+(stats.wins/N*100).toFixed(1),meanSeconds:+(stats.seconds/N).toFixed(1),winnerHp:+(stats.hp/Math.max(1,stats.wins)).toFixed(1),movePercent:+(100*stats.moving/stats.seconds).toFixed(1)},null,2));
}
(style==='compare'?['stand','spam','move']:[style]).forEach(run);
