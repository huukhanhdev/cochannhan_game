// Logic input thật + simulation thật; không thay thế playtest trình duyệt/điện thoại.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {SBSim,SB_KITS}=require('./sandbox_sim.cjs');
const win=new EventTarget(),doc=new EventTarget(),cv=new EventTarget();doc.hidden=false;
cv.setPointerCapture=()=>{};
const ctx={SBSim,AbortController,document:doc,addEventListener:win.addEventListener.bind(win),
  SBView:{app:{view:cv},setHover(){},pingGround(){},hitActor(){return null},
    toWorld(x,z){return {x,z,inGround:x>=110&&x<=890&&z>=0&&z<=240}}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/sandbox/input.js','utf8')+'\nglobalThis.input=SBInput;',ctx);
const I=ctx.input;
function event(target,type,props){const e=new Event(type,{cancelable:true});for(const [k,v] of Object.entries(props))Object.defineProperty(e,k,{value:v});target.dispatchEvent(e)}
function touch(type,x=500,z=120,id=1,primary=true){event(cv,type,{pointerType:'touch',pointerId:id,isPrimary:primary,clientX:x,clientY:z,button:0})}
function fresh(){const B=SBSim.create(JSON.parse(JSON.stringify(SB_KITS)),{});B.actors.bnb.ai=false;I.init(B,()=>{});return B}
{
  const B=fresh(),p=B.actors.pn;I.touchCast('nguyet');assert.equal(I.selected.id,'nguyet');
  touch('pointerdown');assert.equal(p.act,null);touch('pointerup');assert.equal(p.act.s.id,'nguyet');assert.equal(p.act.aim.x,500);assert.equal(I.selected,null);
  assert.equal(B.events.filter(e=>e.type==='act').length,1);
}
{
  const B=fresh(),p=B.actors.pn;I.touchCast('nguyet');touch('pointerdown');touch('pointercancel');touch('pointerup');assert.equal(p.act,null);
  touch('pointerdown',500,120,2,false);touch('pointerup',500,120,2,false);assert.equal(p.act,null);
  touch('pointerdown',0,0);touch('pointerup',0,0);assert.equal(p.act,null);assert.ok(I.selected);
  I.cancelAim();assert.equal(p.ess,100);assert.equal(I.selected,null);
}
{
  const B=fresh(),p=B.actors.pn;SBSim.issue(B,'pn',{skill:'move',x:500,z:200});I.touchCast('dash');assert.equal(p.act.s.id,'dash');assert.ok(p.act.aim.x>p.x&&p.act.aim.z>p.z);assert.ok(Math.abs((p.act.aim.z-p.z)/(p.act.aim.x-p.x)-(200-p.z)/(500-p.x))<1e-9);
  const C=fresh(),q=C.actors.pn;I.touchCast('dash');assert.equal(q.act.s.id,'dash');assert.ok(q.act.aim.x<q.x);
}
{
  const B=fresh(),p=B.actors.pn;I.cast('nguyet',true);I.stop();assert.equal(p.act,null);assert.equal(p.buffer,null);
  event(win,'keydown',{key:'ArrowRight',repeat:false});I.tick();assert.equal(p.state,'move');
  event(win,'keydown',{key:'s',repeat:false});I.tick();assert.equal(p.state,'idle');assert.equal(p.buffer,null);
}
{
  const B=fresh(),p=B.actors.pn;I.touchCast('nguyet');event(win,'blur',{});assert.equal(I.selected,null);
  event(cv,'pointerdown',{pointerType:'mouse',pointerId:1,isPrimary:true,clientX:500,clientY:120,button:0});assert.equal(p.state,'idle');
  event(cv,'pointerdown',{pointerType:'mouse',pointerId:1,isPrimary:true,clientX:500,clientY:120,button:2});assert.equal(p.state,'move');
  I.touchCast('nguyet');B.over={at:0,winner:'bnb'};I.tick();assert.equal(I.selected,null);
}
I.destroy();console.log('Input: touch commit/cancel/ngón phụ, nhắm Nguyệt, Lướt tức thì, S/Dừng, reset và chuột: đạt.');
