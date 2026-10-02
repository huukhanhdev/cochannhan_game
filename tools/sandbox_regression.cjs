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
// Bộ não có chủ đích (Thường/Khó/Cao thủ): không đọc đích đi/aim ẩn; giữ thế đứng, không lao vào PN đứng yên ngoài tầm.
for(const lv of ['thuong','kho','cao']){
  const old=SBAI.level;SBAI.level=lv;
  const B=battle(),p=B.actors.pn,b=B.actors.bnb;b.ai=true;b.aiT=0;B.rng=()=>.99;b.ess=0;   // không đủ phí Lam Điểu/Lốc
  p.x=400;b.x=800;p.z=b.z=120;Object.defineProperty(p,'move',{get(){throw Error('AI đọc đích đi ẩn')}});
  for(let i=0;i<120;i++){SBSim.step(B);b.ess=0}
  const gap=Math.abs(b.x-p.x);assert.ok(gap>b.sk.atk.range&&gap<b.sk.atk.range+90,lv+' giữ thế đứng: '+gap);
  assert.equal(B.events.filter(e=>e.type==='act'&&e.who==='bnb'&&e.skill==='atk').length,0);
  // PN vận Thiên Bồng 0,9s trong tầm lướt: BNB phạt (lướt vào hoặc đánh), sau thời gian phản xạ
  SBSim.issue(B,'pn',{skill:'thienbong'});for(let i=0;i<70;i++){SBSim.step(B);b.ess=0}
  assert.ok(B.events.some(e=>e.who==='bnb'&&e.type==='act'&&['dash','atk'].includes(e.skill)),lv+' phạt khi PN vận');
  SBAI.level=old;
}
console.log('Sân cấu hình/id riêng, telegraph công khai, cắt góc từ quan sát; BNB giữ thế đứng và phạt khi PN vận: đạt.');
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
