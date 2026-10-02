// node tools/sandbox_regression.cjs — chạy logic production, không cần PIXI.
const assert=require('node:assert/strict');
const {SBSim,SB_KITS}=require('./sandbox_sim.cjs');
function battle(){const B=SBSim.create(SB_KITS,{});B.actors.bnb.ai=false;return B}
function advance(B,n){for(let i=0;i<n;i++)SBSim.step(B)}

// Hai DOT cùng tới hạn: kết quả đầu tiên phải giữ nguyên, người thắng còn sống.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;
  p.hp=b.hp=1;
  p.bleed={dps:60,until:10,acc:0};b.bleed={dps:60,until:10,acc:0};
  SBSim.step(B);const result={...B.over};
  assert.equal(result.winner,'bnb');assert.equal(b.hp,1);
  advance(B,180);
  assert.deepEqual(B.over,result);assert.equal(b.hp,1);assert.equal(b.state,'win');
  assert.equal(B.events.filter(e=>e.type==='ko').length,1);
}
// Đạn đối phương đang bay không được giết người thắng sau đòn kết liễu.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;
  p.hp=b.hp=1;p.z=b.z=120;p.x=300;b.x=360;
  assert.equal(SBSim.issue(B,'pn',{skill:'atk'}).ok,true);
  advance(B,Math.ceil(p.sk.atk.startup*60)-1);       // ngay trước khi đòn tay phát (theo kit hiện tại)
  B.projs.push({owner:'bnb',x:p.x-620/60,z:p.z,vx:620,vz:0,left:100,
    s:{dmg:10},hid:999});
  advance(B,2);assert.equal(B.over.winner,'pn');assert.equal(p.hp,1);
  assert.equal(B.projs.length,0);assert.equal(B.zones.length,0);
  advance(B,90);assert.equal(p.state,'win');assert.equal(b.state,'ko');
  assert.equal(p.hp,1);assert.equal(B.events.filter(e=>e.type==='release').length,1);
}
// Chiêu không hợp lệ không mất tài nguyên; bị ngắt chiêu hồi máu vẫn mất lá đã dùng.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;
  p.ess=0;assert.equal(SBSim.issue(B,'pn',{skill:'nguyet'}).ok,false);
  assert.equal(p.ess,0);assert.equal(p.cd.nguyet,undefined);
  assert.equal(SBSim.issue(B,'pn',{skill:'leaf'}).ok,false);assert.equal(p.uses.leaf,2);
  p.hp=100;p.z=b.z=120;b.x=p.x+80;
  assert.equal(SBSim.issue(B,'pn',{skill:'leaf'}).ok,true);
  assert.equal(SBSim.issue(B,'bnb',{skill:'atk'}).ok,true);
  advance(B,Math.ceil(b.sk.atk.startup*60)+2);assert.equal(p.state,'hit');assert.equal(p.uses.leaf,1);   // sau khi băng nhận phát
  assert.equal(B.events.filter(e=>e.type==='heal').length,0);
}
console.log('Sandbox regression: 3 nhóm kiểm thử đạt.');
// Di chuyển có cancel huỷ pha lấy đà: không mất chân nguyên, không vào hồi chiêu; lệnh không cancel chỉ xếp hàng.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.ai=false;b.x=800;
  const ess=p.ess;
  assert.equal(SBSim.issue(B,'pn',{skill:'nguyet',x:800,z:p.z}).ok,true);advance(B,5);
  assert.equal(SBSim.issue(B,'pn',{skill:'move',x:200,z:p.z}).queued,true);assert.equal(p.state,'act');
  SBSim.issue(B,'pn',{skill:'move',x:200,z:p.z,cancel:true});
  assert.equal(p.state,'move');assert.equal(p.ess>=ess-0.5,true);assert.equal(p.cd.nguyet||0,0);
  assert.equal(B.events.filter(e=>e.type==='cancel').length,1);assert.equal(B.projs.length,0);
}
console.log('Huỷ chiêu bằng di chuyển: đạt.');

