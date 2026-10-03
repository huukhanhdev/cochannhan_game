// Chạy sandbox E không cần trình duyệt: node tools/sandbox_sim.cjs [số trận]
// Nạp js/sandbox/*.js như script trình duyệt (gắn lên global) vì thư mục cha khai báo "type":"module".
const fs=require('fs'),path=require('path');
function load(f){const m={exports:{}};new Function('module','require',fs.readFileSync(path.join(__dirname,'..',f),'utf8'))(m,require);return m.exports}
global.SB_KITS=load('js/sandbox/kits.js');global.SB_STATUS=load('js/sandbox/status.js');global.SBSim=load('js/sandbox/sim.js');global.SBAI=load('js/sandbox/ai.js');
// GU/MAXE của data.js (preset PN và PN từ save cần): chỉ lấy hai hằng số, không chạy phần còn lại của data.js.
{const src=fs.readFileSync(path.join(__dirname,'..','js/data.js'),'utf8');
  global.GU=new Function('return ({'+src.match(/const GU=\{([\s\S]*?)\n\};/)[1]+'})')();
  global.MAXE=new Function('return '+src.match(/const MAXE=(\[[^\]]*\])/)[1])();}
global.SB_SPRITES=load('js/sandbox/sprites.js');global.SB_GU=load('js/sandbox/gu_skills.js');global.SB_ROSTER=load('js/sandbox/roster.js');
module.exports={SB_STATUS:global.SB_STATUS,SBSim:global.SBSim,SBAI:global.SBAI,SB_KITS:global.SB_KITS,SB_SPRITES:global.SB_SPRITES,SB_ROSTER:global.SB_ROSTER,SB_GU:global.SB_GU};
if(require.main===module){
  // Kiểm tra nhanh: BNB (máy) tiến lại đánh PN đứng yên tới khi gục
  const B=SBSim.create(SB_KITS,{});let n=0;const ev={};
  while(!B.over&&n<60*120){SBSim.step(B);n++;B.events.splice(0).forEach(e=>ev[e.type]=(ev[e.type]||0)+1)}
  console.log('BNB đánh PN đứng yên:',B.t.toFixed(1)+'s',B.over,ev);
  for(let i=0;i<90;i++)SBSim.step(B);
  console.log('  sau trận:',B.actors.bnb.state,B.actors.pn.state);
  const C=SBSim.create(SB_KITS,{});C.actors.bnb.ai=false;C.actors.bnb.x=360;
  console.log('PN đánh trong tầm:',SBSim.issue(C,'pn',{skill:'fist'}));for(let i=0;i<40;i++)SBSim.step(C);
  console.log('  BNB hp',C.actors.bnb.hp,C.events.map(e=>e.type).join(','));
  C.actors.bnb.x=700;console.log('PN đánh ngoài tầm:',SBSim.check(C,C.actors.pn,{skill:'fist'}));
  console.log('Chiêu chưa mở:',SBSim.check(C,C.actors.pn,{skill:'nguyetmang'}));
}
