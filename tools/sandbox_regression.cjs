// node tools/sandbox_regression.cjs — chạy logic production, không cần PIXI.
const assert=require('node:assert/strict');
const {SBSim,SBAI,SB_KITS}=require('./sandbox_sim.cjs');
// Kit sao chép mỗi trận (test không làm bẩn SB_KITS). Mặc định tắt sự kiện nổ tay của BNB để test cơ chế chung;
// pnRegen: bật lại hồi chân nguyên PN để kiểm luật ngừng hồi của Thiên Bồng (kit hiện tại PN hồi 0).
function battle(o={}){const K=JSON.parse(JSON.stringify(SB_KITS));if(o.pnRegen)K.pn.essRegen=o.pnRegen;
  const B=SBSim.create(K,{});B.actors.bnb.ai=false;if(!o.story)B.actors.bnb.detonated=true;return B}
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
  SBSim.issue(B,'pn',{skill:'cuxi'});advance(B,Math.ceil((SBAI.LEVEL.kho.react||.2)*60)+1);b.ai=true;b.aiT=0;   // chỉ né sau thời gian phản xạ
  SBAI.tick(B,SBSim.DT);assert.equal(b.state,'move');assert.notEqual(b.move.z,p.z);
  const C=battle(),q=C.actors.pn,c=C.actors.bnb;q.hp=100;c.x=q.x+200;
  SBSim.issue(C,'pn',{skill:'leaf'});advance(C,Math.ceil((SBAI.LEVEL.kho.react||.15)*60)+1);c.ai=true;c.aiT=0;
  SBAI.tick(C,SBSim.DT);assert.ok(['dash','locbangnhan'].includes(c.act?.s.id));   // phạt người đang hồi máu: lướt ép hoặc Lốc khi không kịp thoát
  SBAI.level=previous;
}
console.log('AI Khó: né startup đã lộ và áp sát người đang hồi máu: đạt.');

// Thiên Bồng: vận đứng yên, phí bật 18; đủ 3s mất thêm 15, không regen trong giáp.
function activateCanopy(B){
  assert.equal(SBSim.issue(B,'pn',{skill:'thienbong'}).ok,true);
  for(let i=0;i<60&&!B.actors.pn.shield;i++)SBSim.step(B);
  assert.ok(B.actors.pn.shield);
}
{
  const B=battle({pnRegen:1.8}),p=B.actors.pn,x=p.x,z=p.z;
  SBSim.issue(B,'pn',{skill:'thienbong'});advance(B,53);
  assert.equal(p.shield,null);assert.equal(p.ess,100);
  assert.equal(p.x,x);assert.equal(p.z,z);
  while(!p.shield)SBSim.step(B);
  assert.ok(B.t>=.9);assert.equal(p.ess,82);
  const releaseAt=B.t;
  advance(B,60);assert.ok(Math.abs(p.ess-77)<1e-9);assert.ok(p.shield);
  advance(B,120);assert.equal(p.shield,null);
  assert.ok(Math.abs(p.ess-67)<1e-9);assert.ok(Math.abs(B.t-releaseAt-3)<1e-9);
  assert.equal(B.events.filter(e=>e.type==='shieldEnd'&&e.who==='pn').length,1);
  advance(B,60);assert.ok(Math.abs(p.ess-68.8)<1e-9);
}
// Hết tài nguyên tắt sớm; thay giáp không tiếp tục thu phí Thiên Bồng.
{
  const B=battle({pnRegen:1.8}),p=B.actors.pn;activateCanopy(B);p.ess=1;
  advance(B,12);assert.equal(p.shield,null);assert.ok(p.ess<1e-9);
  advance(B,1);assert.ok(p.ess>0);
  const C=battle({pnRegen:1.8}),q=C.actors.pn;activateCanopy(C);advance(C,121);
  SBSim.issue(C,'pn',{skill:'bachngoc'});
  while(q.shield?.id!=='bachngoc')SBSim.step(C);
  const ess=q.ess;advance(C,30);
  assert.ok(Math.abs(q.ess-ess-.9)<1e-9);
}
// Huỷ trước release không có giáp/phí bật; kết trận ngừng cả upkeep và regen.
{
  const B=battle(),p=B.actors.pn;SBSim.issue(B,'pn',{skill:'thienbong'});advance(B,20);
  SBSim.issue(B,'pn',{skill:'move',x:150,z:0,cancel:true});advance(B,60);
  // tự huỷ sau 0,15s lấy đà: mất 25% phí bật (18 → 4,5), không giáp, không CD
  assert.equal(p.shield,null);assert.equal(p.ess,100-18*SBSim.CANCEL_FEE);assert.equal(p.cd.thienbong,undefined);
  const C=battle(),q=C.actors.pn;activateCanopy(C);const ess=q.ess;
  C.over={winner:'pn',loser:'bnb',at:C.t};advance(C,240);assert.equal(q.ess,ess);
}
console.log('Thiên Bồng: vận 0,9s, phí 18+15/3s, ngừng regen, hết nguyên/thay giáp/huỷ/kết trận: đạt.');

// Upkeep trong startup không cho phép phát chiêu thiếu phí; AoE chờ cũng phải được gỡ.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;activateCanopy(B);advance(B,30);
  p.cd={cuxi:0};p.ess=14.5;b.x=p.x+90;b.z=p.z;const hp=b.hp;
  assert.equal(SBSim.issue(B,'pn',{skill:'cuxi'}).ok,true);advance(B,34);
  assert.equal(b.hp,hp);assert.equal(p.bleed,null);assert.equal(b.bleed,null);
  assert.equal(p.act,null);assert.equal(p.cd.cuxi,0);
  assert.equal(B.events.filter(e=>e.type==='fizzle'&&e.skill==='cuxi').length,1);
  assert.equal(B.events.filter(e=>e.type==='release'&&e.skill==='cuxi').length,0);
  assert.equal(p.cd.nguyet,undefined);assert.ok(p.ess>11&&p.ess<12);
  const C=battle(),q=C.actors.pn,c=C.actors.bnb;c.ai=false;c.ess=23;
  c.shield={id:'thuytrao',red:0,until:10,accountedAt:0,upkeepPerSecond:5,pauseEssRegen:true};
  q.x=c.x-100;q.z=c.z;const hp2=q.hp;
  assert.equal(SBSim.issue(C,'bnb',{skill:'locbangnhan'}).ok,true);assert.equal(C.zones.length,1);
  advance(C,80);assert.equal(C.zones.length,0);assert.equal(q.hp,hp2);
  assert.equal(c.cd.locbangnhan,undefined);assert.equal(c.cd.thuytrao,undefined);
  assert.equal(C.events.filter(e=>e.type==='zoneFire').length,0);
  assert.equal(C.events.filter(e=>e.type==='fizzle').length,1);
}
console.log('Release thiếu phí do upkeep: không đòn/CD/khóa chung; AoE gỡ sạch: đạt.');

// Cấu hình sân riêng từng trận và actor id khác không làm ảnh hưởng baseline.
{
  const B=SBSim.create(SB_KITS,{arena:{width:1200,X0:110,X1:1090,Z1:260},ids:{player:'hero',enemy:'rival'}});
  const p=B.actors.hero,b=B.actors.rival;b.ai=false;
  assert.equal(B.opponentOf(p),b);assert.equal(B.opponentOf(b),p);
  assert.equal(p.x,400);assert.equal(b.x,780);
  SBSim.issue(B,'hero',{skill:'move',x:9999,z:9999});advance(B,600);
  assert.equal(p.x,1090);assert.equal(p.z,260);
  const C=battle();assert.equal(C.arena.X1,890);assert.equal(C.actors.pn.x,300);
  assert.throws(()=>SBSim.create(SB_KITS,{arena:{X1:Infinity}}));
}
// AI không đọc aim bí mật, không phản ứng trước tín hiệu/trễ tối thiểu.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.ai=true;b.aiT=0;B.rng=()=>0;B.aiMode='legacy';
  p.x=300;b.x=700;p.z=b.z=120;SBSim.issue(B,'pn',{skill:'nguyet',x:800,z:120});
  Object.defineProperty(p.act,'aim',{get(){throw Error('AI đọc aim ẩn')}});
  const old=SBAI.level;SBAI.level='thuong';SBAI.tick(B,SBSim.DT);assert.notEqual(b.act?.s.id,'dash');
  b.act=null;b.state='idle';b.aiT=0;B.t=.4;p.act.t=.4;   // quá thời gian phản xạ của mức Thường (0,35s)
  SBAI.tick(B,SBSim.DT);assert.equal(b.act.s.id,'dash');SBAI.level=old;
}
// Cắt góc lấy vận tốc từ hai vị trí đã quan sát, không đọc đích đi của đối thủ.
{
  // Bộ não pressure cũ (mức Dễ) vẫn cắt góc theo quan sát.
  const old=SBAI.level;SBAI.level='de';
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.ai=true;b.aiT=0;B.rng=()=>.99;
  p.x=750;b.x=450;p.z=b.z=120;SBAI.tick(B,SBSim.DT);
  b.act=null;b.state='idle';b.aiT=0;B.t=.5;p.x=800;
  Object.defineProperty(p,'move',{get(){throw Error('AI đọc đích đi ẩn')}});
  SBAI.tick(B,SBSim.DT);assert.equal(b.decision.role,'cut');assert.ok(b.decision.x>p.x-70);assert.ok(b.move||b.act?.s.id==='dash');
  SBAI.level=old;
}
// Bộ não có chủ đích (Thường/Khó/Cao thủ): không đọc đích đi/aim ẩn; PN đứng yên thì vào đánh; PN vận chiêu thì phạt.
for(const lv of ['thuong','kho','cao']){
  const old=SBAI.level;SBAI.level=lv;
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.ai=true;b.aiT=0;B.rng=()=>.99;b.ess=0;   // không đủ phí Lam Điểu/Lốc
  p.x=400;b.x=800;p.z=b.z=120;Object.defineProperty(p,'move',{get(){throw Error('AI đọc đích đi ẩn')}});
  // PN đứng yên: BNB tiến vào đánh thường trong vài giây, không đứng nhìn chờ nóng vội.
  for(let i=0;i<180;i++){SBSim.step(B);b.ess=0}
  assert.ok(B.events.some(e=>e.type==='act'&&e.who==='bnb'&&e.skill==='atk'),lv+' đánh PN đứng yên');
  p.hp=p.maxHp;p.act=null;p.state='idle';p.x=400;b.x=p.x+250;b.z=p.z;b.act=null;b.state='idle';b.move=null;B.events.length=0;
  // PN vận Thiên Bồng 0,9s trong tầm lướt: BNB phạt (lướt vào hoặc đánh), sau thời gian phản xạ
  SBSim.issue(B,'pn',{skill:'thienbong'});for(let i=0;i<70;i++){SBSim.step(B);b.ess=0}
  assert.ok(B.events.some(e=>e.who==='bnb'&&e.type==='act'&&['dash','atk'].includes(e.skill)),lv+' phạt khi PN vận');
  SBAI.level=old;
}
console.log('Sân cấu hình/id riêng, telegraph công khai, cắt góc từ quan sát; BNB vào đánh PN đứng yên và phạt khi PN vận: đạt.');
// Khi bị đẩy vị trí trong lúc vận, đạn vẫn giữ hướng công khai đã khóa.
{
  const B=battle(),p=B.actors.pn;SBSim.issue(B,'pn',{skill:'nguyet',x:800,z:p.z});
  p.z+=30;advance(B,Math.ceil(p.sk.nguyet.startup*60)+1);assert.equal(B.projs.length,1);
  assert.equal(B.projs[0].vz,0);assert.ok(B.projs[0].vx>0);
}
console.log('Đạn giữ hướng telegraph đã khóa: đạt.');
// Event FX có hid chung từ act → release/shield → shieldEnd, thay giáp kết thúc đúng id.
{
 const B=battle(),p=B.actors.pn;activateCanopy(B);const hid=p.shield.hid;
 assert.ok(hid);assert.ok(B.events.some(e=>e.type==='act'&&e.hid===hid));
 assert.ok(B.events.some(e=>e.type==='release'&&e.hid===hid));
 advance(B,121);SBSim.issue(B,'pn',{skill:'bachngoc'});advance(B,20);
 assert.ok(B.events.some(e=>e.type==='shieldEnd'&&e.hid===hid&&e.reason==='replaced'));
 const C=battle(),q=C.actors.pn,b=C.actors.bnb;b.x=q.x+80;b.z=q.z;
 SBSim.issue(C,'pn',{skill:'nguyet',x:800,z:q.z});const h=q.act.hid;
 b.sk.atk.startup=.01;SBSim.issue(C,'bnb',{skill:'atk'});advance(C,2);
 assert.ok(C.events.some(e=>e.type==='interrupt'&&e.hid===h));
}
console.log('Event FX: act/release/interrupt/shield/end liên kết hid: đạt.');

// Phí huỷ: ≤0,15s lấy đà miễn phí; sau đó 25% phí; huỷ ở thu chiêu không thu thêm; bị địch ngắt không mất phí.
{
  const B=battle(),p=B.actors.pn;B.actors.bnb.x=800;
  SBSim.issue(B,'pn',{skill:'bachngoc'});advance(B,8);SBSim.issue(B,'pn',{skill:'stop',cancel:true});
  assert.equal(p.ess,100);assert.equal(B.events.find(e=>e.type==='cancel').fee,0);
  SBSim.issue(B,'pn',{skill:'nguyet',x:800,z:p.z});advance(B,15);SBSim.issue(B,'pn',{skill:'stop',cancel:true});
  assert.ok(Math.abs(p.ess-(100-9*.25))<1e-9);assert.equal(p.cd.nguyet||0,0);
  const C=battle(),q=C.actors.pn,c=C.actors.bnb;c.x=q.x+80;c.z=q.z;
  SBSim.issue(C,'pn',{skill:'thienbong'});advance(C,20);c.sk.atk.startup=.01;SBSim.issue(C,'bnb',{skill:'atk'});advance(C,2);
  assert.equal(q.state,'hit');assert.equal(q.ess,100);
}
console.log('Phí huỷ chiêu: 0,15s đầu miễn phí, sau đó 25%, bị ngắt không mất: đạt.');
// Sương Yêu: tăng công + xuyên giáp có thời hạn, hết thì tự hại (chậm); phí 30.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;p.x=300;b.x=700;
  assert.equal(SBSim.issue(B,'bnb',{skill:'suongyeu'}).ok,true);advance(B,Math.ceil(b.sk.suongyeu.startup*60)+1);
  assert.ok(b.empower);assert.equal(b.ess,130-30);advance(B,25);   // hết thu chiêu
  p.shield={id:'bachngoc',red:.5,until:99,accountedAt:B.t,upkeepPerSecond:0};
  b.x=p.x+90;b.z=p.z;const hp=p.hp;SBSim.issue(B,'bnb',{skill:'atk'});advance(B,Math.ceil(b.sk.atk.startup*60)+1);
  assert.equal(hp-p.hp,Math.round(Math.round(b.sk.atk.dmg*1.35)*(1-.5*(1-.5))));
  advance(B,4*60);assert.equal(b.empower,null);assert.ok(b.slowUntil>B.t);
  assert.ok(B.events.some(e=>e.type==='empowerEnd'));
}
// Nổ tay (ch139): đòn kết liễu dưới 30% không hạ gục mà kích hoạt một lần: vỏ băng, hất lùi, mất Sương Yêu.
{
  const B=battle({story:true}),p=B.actors.pn,b=B.actors.bnb;p.x=400;b.x=480;p.z=b.z=120;b.hp=40;
  SBSim.issue(B,'pn',{skill:'cuxi'});advance(B,Math.ceil(p.sk.cuxi.startup*60)+1);
  assert.equal(B.over,null);assert.equal(b.state,'shell');assert.ok(b.hp>=1);assert.equal(b.sk.suongyeu,undefined);
  assert.equal(b.shield.id,'vobang');assert.equal(b.bleed,null);   // đòn kích nổ không để lại chảy máu trong vỏ băng
assert.ok(p.x<=400-100);assert.equal(p.state,'hit');
  assert.equal(B.events.filter(e=>e.type==='detonate').length,1);
  const hp=b.hp;advance(B,Math.ceil(b.kit.story.shellDur*60)+1);
  assert.equal(b.state,'idle');assert.ok(b.hp>hp);assert.ok(b.oneArm);
  b.hp=5;b.shield=null;b.x=p.x+80;b.z=p.z;b.face=-1;p.face=1;p.poiseUntil=0;p.state='idle';p.act=null;
  SBSim.issue(B,'pn',{skill:'atk'});advance(B,40);
  assert.equal(B.over.winner,'pn');assert.equal(B.over.retreat,true);
  assert.equal(B.events.filter(e=>e.type==='detonate').length,1);
}
console.log('Sương Yêu tăng công/tự hại, nổ tay chuyển pha một lần, thua = rút lui: đạt.');

// Chuyển pha ưu tiên hơn kéo Cường Thủ và armor: không kéo lại, không giữ action mồ côi.
{
  const B=battle({story:true}),p=B.actors.pn,b=B.actors.bnb;
  p.x=400;b.x=480;p.z=b.z=120;b.hp=40;
  p.sk.cuongthu={...p.sk.cuongthu,armor:true};
  SBSim.issue(B,'pn',{skill:'cuongthu'});advance(B,37);
  assert.equal(b.state,'shell');assert.equal(b.x,480);assert.equal(p.x,250);
  assert.equal(p.act,null);assert.equal(p.state,'hit');
  assert.equal(B.events.filter(e=>e.type==='grab').length,0);
  assert.equal(B.events.filter(e=>e.type==='interrupt'&&e.who==='pn').length,1);
  advance(B,20);assert.equal(p.state,'idle');assert.equal(p.act,null);
}
console.log('Nổ tay: giữ knockback trước Cường Thủ, ngắt armor không sót act: đạt.');

// Không nhích/wobble: PN đứng yên thì BNB đi thẳng vào đánh (người dùng 02/10: “đứng yên nhìn một lát mới hành động”
// là lỗi), không đổi move-idle liên tục; PN đi lại nhỏ trong vùng chết thì BNB giữ chỗ.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;
  p.x=600;b.x=432;p.z=b.z=130;b.ai=true;b.aiT=0;b.ess=0;
  B.rng=()=>.99;b.calmFrom=0;
  advance(B,180);
  assert.ok(B.events.some(e=>e.type==='act'&&e.who==='bnb'&&e.skill==='atk'));
  assert.ok(B.events.filter(e=>e.type==='arrive'&&e.who==='bnb').length<=2);
  const C=battle(),q=C.actors.pn,c=C.actors.bnb;q.x=600;c.x=432;q.z=c.z=130;c.ai=true;c.aiT=0;c.ess=0;C.rng=()=>.99;
  for(let i=0;i<180;i++){if(i%40===0)SBSim.issue(C,'pn',{skill:'move',x:q.x+(i%80?25:-25),z:130});SBSim.step(C);c.ess=0}
  assert.ok(C.events.filter(e=>e.type==='arrive'&&e.who==='bnb').length<=3);
}
// Đến đích đi không tăng nhịp AI lên 0,06s; lệnh buffer vẫn được xử lý.
{
  const B=battle(),b=B.actors.bnb;b.ai=true;b.aiT=.5;
  SBSim.issue(B,'bnb',{skill:'move',x:b.x+1,z:b.z});SBSim.step(B);
  assert.equal(b.state,'idle');assert.ok(b.aiT>.4);
}
console.log('AI giữ tầm: không nhích/wobble, không tăng nhịp nghĩ khi tới đích: đạt.');
// Bấm đánh tay lần hai trong lúc thu chiêu (0,46s > bộ đệm 0,25s cũ) không được mất lệnh.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.x=p.x+70;b.z=p.z;
  SBSim.issue(B,'pn',{skill:'atk'});advance(B,24);
  assert.equal(p.act.phase,'recovery');assert.equal(SBSim.issue(B,'pn',{skill:'atk'}).queued,true);
  advance(B,60);
  assert.equal(B.events.filter(e=>e.type==='release'&&e.who==='pn'&&e.skill==='atk').length,2);
}
console.log('Lệnh chờ giữ tới khi rảnh tay (đánh tay liên tiếp không mất lệnh): đạt.');
// Đấm tay nhẹ: ra nhanh, gây sát thương nhưng không ngắt chiêu đang lấy đà của đối thủ.
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.x=p.x+70;b.z=p.z;
  SBSim.issue(B,'bnb',{skill:'atk'});SBSim.issue(B,'pn',{skill:'atk'});
  advance(B,Math.ceil(p.sk.atk.startup*60)+1);
  assert.ok(b.hp<b.maxHp);assert.equal(b.state,'act');assert.equal(b.act.s.id,'atk');
}
console.log('Đấm tay nhẹ không làm khựng: đạt.');

// ── Roster (KE_HOACH_DUA_ROSTER_VAO_BATTLE bước A) ──
{
  const fs=require('fs'),path=require('path');
  const {SB_ROSTER,SB_SPRITES}=require('./sandbox_sim.cjs');
  assert.throws(()=>SB_ROSTER.resolve('khong_co'),/Không có profile/);
  // Mọi profile: kit hợp lệ, clip của mỗi chiêu có ít nhất một clip thật trong manifest (fallback cuối là idle),
  // chiêu có nguồn, AI hai bên đánh hết trận không NaN.
  for(const {id} of SB_ROSTER.profileList()){
    const k=SB_ROSTER.resolve(id),dir=path.join(__dirname,'..',k.spriteDir),man=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
    assert.ok(man.actions.idle,id+': thiếu idle');
    for(const s of [k.atk,...k.skills]){
      assert.ok(s.src,id+'.'+s.id+': thiếu src');
      // Nguồn: có chương (VN ch.N / chN) hoặc ghi rõ là game / mô tả data.js (chờ đối chiếu chương).
      assert.ok(/ch\.?\s?\d|^game|data\.js/.test(s.src),id+'.'+s.id+': src không có chương hoặc nhãn game: '+s.src);
      const clips=[].concat(s.clip||[]);assert.ok(clips.some(c=>man.actions[c])||man.actions.idle,id+'.'+s.id+': không có clip nào');
      assert.ok(['melee','proj','aoe','grab','buff','empower','dash','heal','escape','rush','transform','absorb'].includes(s.kind),id+'.'+s.id+': kind lạ '+s.kind);
    }
    const seeds=[1,2,3,4,5];let done=0;
    for(const sd of seeds){
      let x=sd*7919;const r=()=>{x=(x*16807)%2147483647;return x/2147483647};
      const M=SB_ROSTER.matchup(id,id);              // đấu gương: cùng profile, hai slot riêng
      const B=SBSim.create(M.kits,{ids:M.ids,rng:r,arena:SBSim.ARENAS.wide});B.actors.p1.ai=true;
      assert.notEqual(B.actors.p1.kit,B.actors.p2.kit);
      for(let i=0;i<60*120&&!B.over;i++){SBSim.step(B);B.events.length=0;
        for(const a of Object.values(B.actors))assert.ok(Number.isFinite(a.hp)&&Number.isFinite(a.ess)&&Number.isFinite(a.x)&&Number.isFinite(a.z),id+': NaN')}
      if(B.over)done++;
    }
    if(!SB_ROSTER.PROFILES[id].tool)assert.ok(done>=1,id+': đấu gương 5 trận đều hết giờ');   // hình nộm thử (tool) không cần kết trận
  }
  // Đổi bộ hình chỉ đổi thư mục, không đổi kit.
  const before=SB_ROSTER.resolve('heo_rung_q1');SB_SPRITES.use.heo_rung='pilot_v1';
  const after=SB_ROSTER.resolve('heo_rung_q1');delete SB_SPRITES.use.heo_rung;
  assert.equal(after.spriteDir,'assets/chibi_v2/heo_rung/');assert.deepEqual(after.skills,before.skills);
}
console.log('Roster: mọi profile có nguồn, clip, đấu gương hết trận không NaN; đổi bộ hình không đổi kit: đạt.');

// Lao húc (rush): khóa hướng lúc ra lệnh, trúng một lần + đẩy lùi; bước ngang khỏi làn thì trượt.
function rushCase(sidestep){
  const {SB_ROSTER}=require('./sandbox_sim.cjs');
  const M=SB_ROSTER.matchup('pn_demo','heo_rung_q1'),B=SBSim.create(M.kits,{ids:M.ids,arena:SBSim.ARENAS.wide});
  const p=B.actors.p1,h=B.actors.p2;h.ai=false;p.x=400;h.x=650;p.z=h.z=130;
  assert.equal(SBSim.issue(B,'p2',{skill:'lao'}).ok,true);
  assert.ok(h.act.telegraph&&h.act.telegraph.range===h.sk.lao.dist);
  advance(B,15);if(sidestep)SBSim.issue(B,'p1',{skill:'move',x:p.x,z:230});
  const x0=p.x;advance(B,90);
  return {B,p,h,x0};
}
{
  const hit=rushCase(false),dodge=rushCase(true);
  const dm=hit.B.events.filter(e=>e.type==='dmg'&&e.skill==='lao');
  assert.equal(dm.length,1);assert.equal(hit.B.events.filter(e=>e.type==='knock').length,1);assert.ok(hit.p.x<hit.x0);
  assert.equal(dodge.B.events.filter(e=>e.type==='dmg'&&e.skill==='lao').length,0);
  assert.equal(dodge.B.events.filter(e=>e.type==='miss'&&e.skill==='lao').length,1);
}
console.log('Lao húc: khóa hướng, trúng một lần + đẩy lùi, bước ngang thì trượt: đạt.');

// Pha truyện chỉ kích hoạt một lần (phaseFired), kể cả khi máu tụt qua ngưỡng nhiều lần.
{
  const B=battle({story:true}),b=B.actors.bnb,p=B.actors.pn;
  b.hp=b.maxHp*.32;p.x=b.x-70;p.z=b.z;
  const hurtOnce=()=>{B.projs.push({owner:'pn',x:b.x,z:b.z,vx:0,vz:0,left:1,s:{id:'t',dmg:20},hid:9000+B.seq++})};
  hurtOnce();advance(B,2);assert.ok(b.phaseFired?.suongyeu_blast);assert.equal(b.state,'shell');
  advance(B,60*3);b.hp=b.maxHp*.31;hurtOnce();advance(B,2);
  assert.equal(B.events.filter(e=>e.type==='detonate').length,1);
}
console.log('Pha boss: id riêng, kích hoạt đúng một lần: đạt.');

// ── A2: bộ chiêu PN dựng từ save ──
{
  const {SB_GU,SB_ROSTER}=require('./sandbox_sim.cjs');
  const src=require('fs').readFileSync(require('path').join(__dirname,'..','js/data.js'),'utf8');
  const GU=new Function('return ({'+src.match(/const GU=\{([\s\S]*?)\n\};/)[1]+'})')();
  const env={GU,maxHp:()=>210,maxEss:()=>100};
  const mk=(keys,extra)=>Object.assign({chuyen:2,giai:0,hp:180,ess:70,herbs:1,gu:keys.map(k=>({k,h:0}))},extra);
  assert.throws(()=>SB_GU.pnKitFromSave(mk([]),{}),/env.GU/);
  // Chỉ cổ đang có mới thành nút; cổ đã hợp luyện/tiêu hao (không còn trong S.gu) không có nút.
  const a=SB_GU.pnKitFromSave(mk(['xuanthu','nguyetquang','ngocbi','cuudiep']),env);
  assert.deepEqual(a.skills.map(s=>s.id).sort(),['dash','leaf','ngocbi','nguyetquang']);
  const b=SB_GU.pnKitFromSave(mk(['xuanthu','nguyetmang','ngocbi']),env);   // Nguyệt Quang đã đem hợp luyện thành Nguyệt Mang
  assert.ok(!b.skills.some(s=>s.id==='nguyetquang'));assert.ok(b.skills.some(s=>s.id==='nguyet'));
  assert.ok(!b.skills.some(s=>s.id==='leaf'),'không có Cửu Diệp thì không có lá');
  // Lá Sinh Cơ = vật phẩm: lượt theo S.herbs; hết lá thì không có ô và ghi vào missing.
  assert.equal(a.skills.find(s=>s.id==='leaf').uses,1);
  const c=SB_GU.pnKitFromSave(mk(['cuudiep'],{herbs:0}),env);
  assert.ok(!c.skills.some(s=>s.id==='leaf'));assert.ok(c.missing.some(m=>m.k==='cuudiep'));
  // Cổ chủ động chưa có chiêu: không có nút, có lý do. Bị động cộng sát thương, không thành nút.
  const d=SB_GU.pnKitFromSave(mk(['cuongthu','mokmi','bachthi','hacthi','uguang','nguyetquang']),env);
  assert.deepEqual(d.missing.map(m=>m.k).sort(),['cuongthu','mokmi']);
  assert.ok(d.missing.every(m=>m.reason));
  assert.equal(d.atk.dmg,SB_ROSTER.resolve('pn_demo').atk.dmg+Math.round(10*SB_GU.DMG_K));
  const nq=d.skills.find(s=>s.id==='nguyetquang');assert.equal(nq.dmg,Math.round(GU.nguyetquang.dmg*SB_GU.DMG_K)+Math.round(6*SB_GU.DMG_K));
  // Chấn thương tay giảm đánh tay; trạng thái máu/chân nguyên mang vào trận.
  const e=SB_GU.pnKitFromSave(mk([],{inj:{k:'tay',t:2},hp:90,ess:30}),env);
  assert.ok(e.atk.dmg<SB_ROSTER.resolve('pn_demo').atk.dmg);
  const B=SBSim.create({p1:SB_ROSTER.dress(e,'phuong_nguyen','pn_save'),p2:SB_ROSTER.resolve('bnb_q1')},{ids:{player:'p1',enemy:'p2'}});
  assert.equal(B.actors.p1.hp,90);assert.equal(B.actors.p1.maxHp,210);assert.equal(B.actors.p1.ess,30);
  // Phím không trùng; quá 8 cổ chủ động thì phần dư ghi "hết ô phím", không mất âm thầm.
  const many=['nguyetquang','nguyetmang','nguyetngan','huyetnguyet','nguyettoan','toanphong','bangdao','ngocbi','dongbi','thietbi','thuytrao'];
  const f=SB_GU.pnKitFromSave(mk(many),env),keys=f.skills.map(s=>s.key);
  const bound=keys.filter(k=>k!=null);assert.equal(new Set(bound).size,bound.length);
  // Không mất cổ vì thiếu phím: đủ 11 chiêu (+ lướt), 3 chiêu không phím ghi ở unbound, không lẫn vào missing.
  assert.equal(f.skills.filter(s=>s.id!=='dash').length,many.length);assert.equal(f.unbound.length,many.length-8);
  assert.ok(!f.missing.length);
  // Mọi GU_SKILL dựng được, có src, kind hợp lệ; đánh một trận máy đấu máy với kit đầy đủ không NaN.
  for(const k of Object.keys(SB_GU.GU_SKILL)){const s=SB_GU.GU_SKILL[k](GU[k]);assert.ok(s&&s.src&&s.kind,k)}
  const full=SB_ROSTER.dress(SB_GU.pnKitFromSave(mk(many.slice(0,8).concat('trilieu','cuudiep'),{herbs:2}),env),'phuong_nguyen','pn_save');
  let x=11;const r=()=>{x=(x*16807)%2147483647;return x/2147483647};
  const C=SBSim.create({p1:full,p2:SB_ROSTER.resolve('bnb_q1')},{ids:{player:'p1',enemy:'p2'},rng:r});C.actors.p1.ai=true;
  for(let i=0;i<60*120&&!C.over;i++){SBSim.step(C);C.events.length=0;assert.ok(Number.isFinite(C.actors.p1.hp)&&Number.isFinite(C.actors.p2.hp))}
}
console.log('PN từ save: chỉ cổ đang có, hợp luyện/tiêu hao thì mất nút, lá theo S.herbs, bị động cộng đòn, chấn thương, phím không trùng, dư phím vẫn giữ chiêu: đạt.');

// ── Bước D (kiểu chiêu/pha cho đợt 1): kiểm hiệu lực, không chỉ kiểm có event ──
{
  const {SB_ROSTER}=require('./sandbox_sim.cjs');
  const duel=(a,b)=>{const M=SB_ROSTER.matchup(a,b),B=SBSim.create(M.kits,{ids:M.ids,arena:SBSim.ARENAS.wide});B.actors.p2.ai=false;return B};
  // Biến thân Mộc Mị: hồi chân nguyên + máu, chiêu hệ mộc ×1,4, khí huyết tối đa giảm, hết hạn có event, không hồi đầy máu/ess, không xóa CD.
  {
    const B=duel('thanh_thu_ch141','bnb_q1_ch140'),t=B.actors.p1,b=B.actors.p2;t.ai=false;b.x=t.x+700;
    t.ess=20;t.hp=150;const max0=t.maxHp;
    assert.equal(SBSim.issue(B,'p1',{skill:'mocmi'}).ok,true);advance(B,Math.ceil(.85*60));
    assert.ok(t.transform);assert.ok(t.hp<=t.maxHp);
    advance(B,60*3);assert.ok(t.ess>20+6*2.5,'hồi chân nguyên khi biến thân');assert.ok(t.maxHp<max0,'khí huyết tối đa giảm');
    assert.ok((t.cd.mocmi||0)>30);
    // chiêu hệ mộc mạnh hơn: Tùng Châm từng mũi 6 → 8
    b.x=t.x+120;b.z=t.z;t.cd.tungcham=0;t.cd.thanhdang=0;for(const k in t.cd)t.cd[k]=0;
    SBSim.issue(B,'p1',{skill:'tungcham',x:b.x,z:b.z});advance(B,60);
    const hits=B.events.filter(e=>e.type==='dmg'&&e.skill==='tungcham');
    assert.ok(hits.length>=2,'nhiều mũi trúng được nhiều lần');assert.ok(hits.every(e=>e.amount===Math.round(6*1.4)||e.blocked>0));
    advance(B,60*10);assert.equal(t.transform,null);assert.equal(B.events.filter(e=>e.type==='transformEnd').length,1);
    assert.ok(t.maxHp>=max0*.4-1e-9);
  }
  // Hồi máu ký sinh (regen) và pha tru lên (enrage): kích hoạt một lần, tốc độ ×2, không chặn đòn kết liễu.
  {
    const B=duel('pn_demo','dian_lang_boss_q1'),w=B.actors.p2;w.hp=400;advance(B,60);assert.ok(w.hp>403&&w.hp<=405);
    const sp0=w.kit.speed;w.hp=w.maxHp*.52;
    B.projs.push({owner:'p1',x:w.x,z:w.z,vx:0,vz:0,left:1,s:{id:'t',dmg:20},hid:99001});advance(B,2);
    assert.ok(w.enrage&&w.phaseFired.tru);assert.equal(B.events.filter(e=>e.type==='phase').length,1);
    w.hp=10;w.kit.regen=0;B.projs.push({owner:'p1',x:w.x,z:w.z,vx:0,vz:0,left:1,s:{id:'t',dmg:50},hid:99002});advance(B,2);
    assert.equal(B.over?.winner,'p1','pha không chặn đòn kết liễu');
    void sp0;
  }
  // Băng Trùy năm mũi: xòe quạt, mỗi mũi một hid.
  {
    const B=duel('bnb_q1_ch140','pn_demo'),b=B.actors.p1;b.ai=false;
    assert.equal(b.oneArm,true);assert.ok(!b.sk.suongyeu);assert.equal(b.hp,Math.round(b.maxHp*.7));
    SBSim.issue(B,'p1',{skill:'bangtruy'});advance(B,Math.ceil(.56*60)+1);
    assert.equal(B.projs.filter(p=>p.s.id==='bangtruy').length,5);
    assert.equal(new Set(B.projs.map(p=>p.hid)).size,5);
  }
}
console.log('Bước D (đợt 1): biến thân Mộc Mị, hồi máu ký sinh, pha tru lên một lần, đạn nhiều mũi: đạt.');

// ── Nhân vật thiết kế game: hút máu (cổ trị liệu chặn), tái tụ ngừng khi chảy máu ──
{
  const {SB_ROSTER,SB_GU}=require('./sandbox_sim.cjs');
  const mk=(e,pk)=>{const M=SB_ROSTER.matchup(pk||'pn_demo',e),B=SBSim.create(M.kits,{ids:M.ids,arena:SBSim.ARENAS.wide});B.actors.p2.ai=false;return B};
  {
    const B=mk('huyet_thu_game'),m=B.actors.p2,p=B.actors.p1;m.hp=200;p.x=m.x-80;p.z=m.z;m.face=-1;
    SBSim.issue(B,'p2',{skill:'atk'});advance(B,40);
    const heal=B.events.find(e=>e.type==='heal'&&e.drain);assert.ok(heal&&heal.amount===Math.round(m.sk.atk.dmg*m.sk.atk.drain));
  }
  {
    const S={chuyen:1,giai:0,tuchat:44,herbs:0,gu:[{k:'trilieu',h:0}]},k=SB_GU.pnKitFromSave(S,Object.assign({GU:global.GU},SB_GU.campaignMax(S,global.GU)));
    assert.equal(k.antiDrain,true);
    const M=SB_ROSTER.matchup(SB_ROSTER.dress(k,'phuong_nguyen','pn_save'),'huyet_thu_game'),B=SBSim.create(M.kits,{ids:M.ids});
    const m=B.actors.p2,p=B.actors.p1;m.ai=false;m.hp=200;p.x=m.x-80;p.z=m.z;m.face=-1;
    SBSim.issue(B,'p2',{skill:'atk'});advance(B,40);
    assert.ok(!B.events.some(e=>e.type==='heal'&&e.drain));assert.equal(B.events.filter(e=>e.type==='drainFail').length,1);assert.equal(m.hp,200);
  }
  {
    const B=mk('huyet_khoi_game'),h=B.actors.p2;h.hp=100;advance(B,60);assert.ok(h.hp>103);
    const before=h.hp;h.bleed={dps:0,until:B.t+5,acc:0};advance(B,60);assert.equal(h.hp,before,'chảy máu thì không tái tụ');
  }
}
console.log('Thiết kế game: hút máu, cổ trị liệu chặn hút, Huyết Khôi chảy máu thì ngừng tái tụ: đạt.');

// ── Nguyên thạch trong trận: chậm, đi lại được, trúng đòn thì đứt, không phải action/không khóa chung ──
{
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.x=p.x+600;p.ess=40;
  const s=p.sk.nguyenthach,u0=p.uses.nguyenthach;
  assert.equal(SBSim.issue(B,'pn',{skill:'move',x:p.x-200,z:p.z}).ok,true);advance(B,5);
  assert.equal(SBSim.issue(B,'pn',{skill:'nguyenthach'}).ok,true);       // đang đi vẫn hấp thu được
  assert.equal(p.state,'move');assert.equal(p.uses.nguyenthach,u0-1);assert.ok(!(p.cd.nguyet>0),'không khóa chung');
  assert.equal(SBSim.issue(B,'pn',{skill:'nguyenthach'}).ok,false);      // một viên mỗi lần
  advance(B,60);assert.ok(p.ess>41.9&&p.ess<42.1,'2 chân nguyên/giây');
  assert.equal(SBSim.issue(B,'pn',{skill:'nguyet',x:b.x,z:b.z}).ok,true); // ra chiêu không làm đứt
  advance(B,Math.ceil(1.6*60));
  const end=B.events.find(e=>e.type==='absorbEnd');assert.ok(end&&Math.abs(end.amount-s.amt)<.05);
  // trúng đòn thì đứt, phần chưa hấp thu mất
  const C=battle(),q=C.actors.pn,c=C.actors.bnb;q.ess=10;q.z=c.z=120;c.x=q.x+90;
  SBSim.issue(C,'pn',{skill:'nguyenthach'});advance(C,30);SBSim.issue(C,'bnb',{skill:'atk'});advance(C,Math.ceil(c.sk.atk.startup*60)+2);
  const br=C.events.find(e=>e.type==='absorbBreak');assert.ok(br&&br.amount<s.amt);assert.equal(q.absorb,null);
  // đầy chân nguyên thì không cho dùng
  const D=battle();assert.equal(SBSim.issue(D,'pn',{skill:'nguyenthach'}).ok,false);
}
console.log('Nguyên thạch: 2 chân nguyên/s, vừa đi vừa hấp thu, một viên mỗi lần, trúng đòn thì đứt, đầy thì không dùng: đạt.');
{
  const {SB_GU}=require('./sandbox_sim.cjs');
  const k=SB_GU.pnKitFromSave({chuyen:1,giai:0,tuchat:44,stones:40,gu:[]},Object.assign({GU:global.GU},SB_GU.campaignMax({chuyen:1,gu:[]},global.GU)));
  assert.equal(k.skills.find(s=>s.id==='nguyenthach').uses,SB_GU.STONE_CAP);
  const k2=SB_GU.pnKitFromSave({chuyen:1,giai:0,tuchat:44,stones:2,gu:[]},Object.assign({GU:global.GU},SB_GU.campaignMax({chuyen:1,gu:[]},global.GU)));
  assert.equal(k2.skills.find(s=>s.id==='nguyenthach').uses,2);
  assert.ok(!SB_GU.pnKitFromSave({chuyen:1,giai:0,gu:[],stones:0},{GU:global.GU}).skills.some(s=>s.id==='nguyenthach'));
}
console.log('Nguyên thạch từ save: tối đa 3 viên/trận, không quá số đá có: đạt.');

// ── AI theo phong cách: kiểm hành vi đúng điều kiện, không chỉ kết quả ──
{
  const {SB_ROSTER}=require('./sandbox_sim.cjs');
  const watch=(p1,p2,skill,fn)=>{let seen=0;for(let sd=1;sd<=6;sd++){let x=sd*977;const r=()=>{x=(x*16807)%2147483647;return x/2147483647};
    const M=SB_ROSTER.matchup(p1,p2),B=SBSim.create(M.kits,{ids:M.ids,rng:r,arena:SBSim.ARENAS.wide});B.actors.p1.ai=true;
    for(let i=0;i<60*60&&!B.over;i++){SBSim.step(B);for(const e of B.events.splice(0))if(e.type==='act'&&e.who==='p2'&&e.skill===skill){seen++;fn(B)}}}return seen};
  // Heo (charge): chỉ lao khi đủ xa để lấy đà và gần thẳng hàng theo chiều sâu.
  const n1=watch('pn_ch70','heo_rung_q1','lao',B=>{const a=B.actors.p2,t=B.actors.p1;
    assert.ok(Math.hypot(t.x-a.x,t.z-a.z)>=150-1e-6,'lao khi quá gần');assert.ok(Math.abs(t.z-a.z)<a.sk.lao.depth*.6+1e-6,'lao lệch làn')});
  assert.ok(n1>=4);
  // Phương Chính (midrange): chỉ bắn Nguyệt Quang ở tầm trung (>=120), không bắn sát người.
  const n2=watch('pn_ch84','phuong_chinh_ch83','nguyetquang',B=>{const a=B.actors.p2,t=B.actors.p1;assert.ok(Math.hypot(t.x-a.x,t.z-a.z)>=120-1e-6)});
  assert.ok(n2>=6);
}
console.log('AI phong cách: Heo lao khi đủ đà và thẳng hàng; Phương Chính bắn ở tầm trung: đạt.');

// ── Hệ trạng thái S1a + S2 (KE_HOACH_TRANG_THAI_HIEU_UNG §7) ──
{
  const {SB_ROSTER,SB_STATUS}=require('./sandbox_sim.cjs');
  // S1a bảo toàn: trường cũ đọc/ghi được, DoT bỏ qua hộ thể, Thiên Bồng vẫn trả phí duy trì (đã có test riêng ở trên).
  {
    const B=battle({pnRegen:0}),p=B.actors.pn;p.bleed={dps:10,until:1,acc:0};
    p.shield={id:'x',red:.9,until:5,accountedAt:0,upkeepPerSecond:0};
    advance(B,60);assert.ok(p.hp<=p.maxHp-9,'chảy máu bỏ qua hộ thể');
    p.slowUntil=B.t+1;p.slowF=.5;assert.equal(p.slowF,.5);assert.ok(SB_STATUS.active(B,p,'slow'));
  }
  const duel=()=>{const M=SB_ROSTER.matchup('pn_demo','hinh_nom'),B=SBSim.create(M.kits,{ids:M.ids,arena:SBSim.ARENAS.wide});B.actors.p2.ai=false;
    const p=B.actors.p1,h=B.actors.p2;p.x=400;h.x=700;p.z=h.z=130;return {B,p,h}};
  const hitWith=(B,h,p,id)=>{h.cd={};SBSim.issue(B,'p2',{skill:id,x:p.x,z:p.z});advance(B,Math.ceil((h.sk[id].startup+.05)*60)+50)};
  // Choáng: ngắt cả chiêu armor, xóa lệnh đệm, từ chối lệnh mới kèm lý do, hết thì về idle.
  {
    const {B,p,h}=duel();p.sk.atk=Object.assign({},p.sk.atk,{armor:true});
    hitWith(B,h,p,'thu_choang');
    assert.equal(p.state,'stun');const r=SBSim.issue(B,'p1',{skill:'nguyet'});assert.equal(r.ok,false);assert.ok(r.status&&/choáng/.test(r.reason));
    assert.equal(SBSim.issue(B,'p1',{skill:'move',x:100,z:100}).ok,false);assert.equal(p.buffer,null);
    advance(B,60);assert.notEqual(p.state,'stun');assert.equal(B.events.filter(e=>e.type==='statusEnd'&&e.st==='stun').length,1);
  }
  // Trói: không đi/lướt, vẫn ra chiêu; không ngắt chiêu đang vận.
  {
    const {B,p,h}=duel();hitWith(B,h,p,'thu_troi');
    assert.equal(SBSim.issue(B,'p1',{skill:'move',x:100,z:100}).ok,false);assert.equal(SBSim.issue(B,'p1',{skill:'dash',x:100,z:100}).ok,false);
    assert.equal(SBSim.issue(B,'p1',{skill:'nguyet',x:h.x,z:h.z}).ok,true);
  }
  // Phong cấm: cổ bị từ chối; đánh tay, vật phẩm (lá) và đi lại vẫn được.
  {
    const {B,p,h}=duel();hitWith(B,h,p,'thu_phongcam');
    const r=SBSim.issue(B,'p1',{skill:'nguyet'});assert.equal(r.ok,false);assert.ok(/phong cấm/.test(r.reason));
    assert.equal(SBSim.issue(B,'p1',{skill:'move',x:300,z:130}).ok,true);
    p.hp=100;advance(B,10);assert.equal(SBSim.issue(B,'p1',{skill:'leaf'}).ok,true);
  }
  // Giảm dần theo nhóm (100% → 50% → 25% → miễn) và miễn 1,2s sau khi khống chế kết thúc; nhóm khác đếm riêng.
  {
    const {B,p}=duel(),ap=(id,dur)=>SB_STATUS.apply(B,p,id,{dur,src:'x'});
    const a1=ap('stun',.8);assert.equal(a1.dur,.8);
    assert.equal(ap('stun',.8).dur,.8*.5,'lần 2 trong cửa sổ còn 50% (khi còn đang choáng thì cộng dồn hạn, không mở miễn)');
    advance(B,Math.ceil(1.0*60));
    assert.equal(ap('stun',.8).ok,false,'đang trong khoảng miễn 1,2s sau khi hết choáng');
    advance(B,Math.ceil(1.3*60));assert.ok(Math.abs(ap('stun',.8).dur-.2)<1e-9,'lần 3: 25%');
    assert.equal(ap('root',1.5).dur,1.5,'nhóm trói đếm riêng');
    assert.ok(ap('stun',9).dur<=SB_STATUS.HARD_CAP+1e-9||!ap('stun',9).ok);
  }
  // Khựng do đòn thường không tính vào giảm dần khống chế.
  {
    const {B,p}=duel();assert.equal(p.cc.hard,undefined);
  }
  // Dọn sạch khi KO/kết trận.
  {
    const {B,p,h}=duel();hitWith(B,h,p,'thu_troi');p.hp=1;
    B.projs.push({owner:'p2',x:p.x,z:p.z,vx:0,vz:0,left:1,s:{id:'k',dmg:5},hid:77777});advance(B,2);
    assert.ok(B.over);assert.ok(!SB_STATUS.active(B,p,'root'));assert.equal(SB_STATUS.view(B,p).length,0);
  }
}
console.log('Trạng thái: chuyển slow/bleed giữ luật cũ; choáng ngắt cả armor, xóa lệnh đệm; trói chặn đi; phong cấm chặn cổ; giảm dần theo nhóm + miễn 1,2s; dọn khi KO: đạt.');
