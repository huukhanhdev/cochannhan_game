// node tools/sandbox_regression.cjs — chạy logic production, không cần PIXI.
const assert=require('node:assert/strict');
const {SBSim,SBAI,SB_KITS}=require('./sandbox_sim.cjs');
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
  assert.equal(SBSim.issue(B,'bnb',{skill:'atk'}).ok,true);
  // Đòn địch đã lấy đà trước: phải chạm trước khi lá hồi máu phát, độc lập thời lượng kit.
  advance(B,Math.ceil(Math.max(0,b.sk.atk.startup-p.sk.leaf.startup+.1)*60));
  assert.equal(SBSim.issue(B,'pn',{skill:'leaf'}).ok,true);
  advance(B,Math.ceil((b.sk.atk.startup-b.act.t)*60)+2);assert.equal(p.state,'hit');assert.equal(p.uses.leaf,1);   // sau khi băng nhận phát
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
  assert.equal(p.cd.bachngoc,undefined);assert.equal(p.cd.cuxi,undefined);
}
console.log('Huỷ chiêu bằng di chuyển: đạt.');

// Bấm dồn bốn chiêu: một act đang chạy, một lệnh chờ cuối, không phát đồng thời.
{
  const B=battle(),p=B.actors.pn;B.actors.bnb.x=450;
  for(const skill of ['nguyet','bachngoc','cuxi','cuongthu'])SBSim.issue(B,'pn',{skill});
  assert.equal(p.act.s.id,'nguyet');assert.equal(p.buffer.cmd.skill,'cuongthu');
  advance(B,Math.ceil(p.sk.nguyet.startup*60)+1);
  assert.deepEqual(B.events.filter(e=>e.type==='release').map(e=>e.skill),['nguyet']);
  assert.ok(p.cd.cuxi>1.9&&p.cd.cuxi<=2);assert.ok(p.cd.cuongthu>1.9&&p.cd.cuongthu<=2);
}
// Cùng vị trí/cùng đòn: đứng yên ăn đòn, bước ngang sau 0,2s né được; đòn không bám theo z.
function iceHit(move){
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;p.x=300;b.x=390;p.z=b.z=120;
  SBSim.issue(B,'bnb',{skill:'atk'});advance(B,12);
  if(move)SBSim.issue(B,'pn',{skill:'move',x:p.x,z:215});
  advance(B,Math.ceil(b.sk.atk.startup*60));return B;
}
{
  const stand=iceHit(false),move=iceHit(true);
  assert.equal(stand.actors.pn.hp,stand.actors.pn.maxHp-stand.actors.bnb.sk.atk.dmg);
  assert.equal(move.actors.pn.hp,move.actors.pn.maxHp);
  assert.equal(move.events.filter(e=>e.type==='miss'&&e.who==='bnb').length,1);
}
// Vòng Lốc khóa vị trí ban đầu: đi ra ngoài vòng trong lúc báo trước không nhận sát thương.
for(const move of [false,true]){
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;p.x=300;b.x=500;p.z=b.z=120;
  SBSim.issue(B,'bnb',{skill:'locbangnhan'});advance(B,12);
  if(move)SBSim.issue(B,'pn',{skill:'move',x:110,z:0});
  advance(B,70);
  assert.equal(p.hp,p.maxHp-(move?0:b.sk.locbangnhan.dmg));
}
// Huỷ recovery của Lốc đã nổ không được splice(-1) xoá vòng khác.
{
  const B=battle(),b=B.actors.bnb;SBSim.issue(B,'bnb',{skill:'locbangnhan'});
  advance(B,Math.ceil((b.sk.locbangnhan.startup+b.sk.locbangnhan.active+b.sk.locbangnhan.recovery*.6)*60));
  const sentinel={owner:'pn'};B.zones.push(sentinel);
  SBSim.issue(B,'bnb',{skill:'move',x:800,z:100,cancel:true});
  assert.deepEqual(B.zones,[sentinel]);
}
console.log('Bấm dồn, né đòn tay/vòng Lốc, huỷ vòng đã nổ: đạt.');

// Cooldown chung tính tại release, giữ nguyên cooldown đang có và không khóa đi/lướt/đánh thường.
{
  const B=battle(),p=B.actors.pn;p.cd.cuxi=8;p.cd.cuongthu=.8;
  SBSim.issue(B,'pn',{skill:'nguyet'});
  advance(B,Math.ceil(p.sk.nguyet.startup*60)-1);
  assert.equal(p.cd.bachngoc,undefined);assert.equal(p.cd.leaf,undefined);
  const oldLong=p.cd.cuxi,oldShort=p.cd.cuongthu;SBSim.step(B);
  assert.ok(Math.abs(p.cd.cuxi-(oldLong-SBSim.DT))<1e-9);
  assert.ok(Math.abs(p.cd.cuongthu-(oldShort-SBSim.DT))<1e-9);
  assert.equal(p.cd.bachngoc,2);assert.equal(p.cd.leaf,2);
  assert.equal(p.cd.atk,undefined);assert.equal(p.cd.dash,undefined);
  assert.equal(p.cd.nguyet,p.sk.nguyet.cd);
  SBSim.issue(B,'pn',{skill:'move',x:150,z:0});assert.equal(p.buffer.cmd.skill,'move');
  advance(B,125);assert.equal(p.cd.bachngoc,0);
}
// Không khóa đối thủ; dash và đấm không kích hoạt khóa; hết lượt không nhận cooldown giả.
{
  const B=battle(),p=B.actors.pn;p.uses.leaf=0;
  SBSim.issue(B,'pn',{skill:'bachngoc'});advance(B,14);
  assert.equal(p.cd.leaf,undefined);assert.equal(B.actors.bnb.cd.locbangnhan,undefined);
  const C=battle();SBSim.issue(C,'pn',{skill:'dash',x:100,z:0});advance(C,8);
  assert.equal(C.actors.pn.cd.nguyet,undefined);
  const D=battle();D.actors.bnb.x=360;D.actors.bnb.z=D.actors.pn.z;
  SBSim.issue(D,'pn',{skill:'atk'});advance(D,20);assert.equal(D.actors.pn.cd.nguyet,undefined);
}
console.log('Cooldown chung 2s: release, cooldown cũ, miễn đi/lướt/đấm và hết lượt: đạt.');
// Boss Khó lách khỏi rết đã lấy đà và áp sát khi thấy người chơi đang dùng lá ở xa.
{
  const previous=SBAI.level;SBAI.level='kho';
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;p.z=b.z=120;b.x=p.x+90;
  SBSim.issue(B,'pn',{skill:'cuxi'});advance(B,14);b.ai=true;b.aiT=0;
  SBAI.tick(B,SBSim.DT);assert.equal(b.state,'move');assert.notEqual(b.move.z,p.z);
  const C=battle(),q=C.actors.pn,c=C.actors.bnb;q.hp=100;c.x=q.x+200;
  SBSim.issue(C,'pn',{skill:'leaf'});advance(C,10);c.ai=true;c.aiT=0;
  SBAI.tick(C,SBSim.DT);assert.equal(c.act.s.id,'dash');
  SBAI.level=previous;
}
console.log('AI Khó: né startup đã lộ và áp sát người đang hồi máu: đạt.');
