// Đo cách đánh của AI theo phong cách (kit.ai.style), không chỉ thắng/thua.
// node tools/sandbox_style_bench.cjs [N=60] [p1=pn_ch70] [p2=heo_rung_q1] [level=thuong]
// SB_NOSTYLE=1 để so với AI chung (không phong cách). In JSON từng bên:
//  actions: số lần ra chiêu theo id / trận · dist: khoảng cách trung bình tới đối thủ (đơn vị world)
//  hitRate: tỉ lệ đòn ra trúng · lowEss: số trận chân nguyên xuống < 10% · gapP50: thời gian trung vị giữa hai lần ra chiêu
const {SBSim,SBAI,SB_ROSTER}=require('./sandbox_sim.cjs');
const N=+(process.argv[2]||60),P1=process.argv[3]||'pn_ch70',P2=process.argv[4]||'heo_rung_q1';
SBAI.level=process.argv[5]||'thuong';
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
const side=()=>({actions:{},releases:0,hits:0,distSum:0,distN:0,lowEss:0,gaps:[],wins:0});
const R={p1:side(),p2:side()};let timeouts=0,secs=0;
for(let n=0;n<N;n++){
  const M=SB_ROSTER.matchup(P1,P2),B=SBSim.create(M.kits,{ids:M.ids,rng:rng(20261003+n*7919),arena:SBSim.ARENAS.wide});
  B.actors.p1.ai=true;const last={p1:null,p2:null},low={p1:false,p2:false};
  for(let i=0;i<60*120&&!B.over;i++){
    SBSim.step(B);
    const a=B.actors.p1,b=B.actors.p2,d=Math.hypot(a.x-b.x,a.z-b.z);
    for(const id of ['p1','p2']){R[id].distSum+=d;R[id].distN++;const x=B.actors[id];if(x.maxEss&&x.ess<x.maxEss*.1)low[id]=true}
    for(const e of B.events.splice(0)){
      const S=R[e.who];if(!S)continue;
      if(e.type==='act'){S.actions[e.skill]=(S.actions[e.skill]||0)+1;if(last[e.who]!=null)S.gaps.push(e.t-last[e.who]);last[e.who]=e.t}
      if(e.type==='release'&&e.kind!=='buff'&&e.kind!=='dash')S.releases++;
      if(e.type==='dmg'&&!e.dot&&e.source&&R[e.source])R[e.source].hits++;
    }
  }
  if(!B.over)timeouts++;else R[B.over.winner].wins++;
  for(const id of ['p1','p2'])if(low[id])R[id].lowEss++;
  secs+=B.t;
}
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?+s[s.length>>1].toFixed(2):null};
const out={pair:P1+' vs '+P2,level:SBAI.level,style:process.env.SB_NOSTYLE?'off':'on',N,timeouts,meanSeconds:+(secs/N).toFixed(1)};
for(const id of ['p1','p2']){const S=R[id];out[id]={wins:S.wins,actionsPerFight:Object.fromEntries(Object.entries(S.actions).map(([k,v])=>[k,+(v/N).toFixed(1)])),
  dist:Math.round(S.distSum/S.distN),hitRate:+(S.hits/Math.max(1,S.releases)).toFixed(2),lowEss:S.lowEss,gapP50:med(S.gaps)}}
console.log(JSON.stringify(out));
