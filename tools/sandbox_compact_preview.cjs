const assert=require('node:assert/strict'),fs=require('node:fs'),puppeteer=require('puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
 const errors=[],bad=[],reports=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)bad.push({url:r.url(),status:r.status()})});
  for(const mobile of [false,true]){
   await page.setViewport(mobile?{width:390,height:844,isMobile:true,hasTouch:true}:{width:1280,height:900});
   for(const fig of ['original','small']){
    await page.goto('http://127.0.0.1:8765/battle_sandbox.html?fig='+fig,{waitUntil:'networkidle2'});
    await page.waitForFunction(()=>window.SB&&SBView.app&&document.querySelector('#figure-size').value);
    await page.evaluate(()=>{window.requestAnimationFrame=()=>0});await new Promise(r=>setTimeout(r,80));
    const result=await page.evaluate(()=>{
     const B=window.SB;for(const a of Object.values(B.actors)){a.ai=false;a.act=null;a.state='idle';a.moveTo=null;a.shield=null;a.empower=null;a.transform=null}
     SBInput.stop();const p=B.actors[B.ids.player],e=B.actors[B.ids.enemy];p.x=450;p.z=130;e.x=730;e.z=130;B.t=0;
     SBView.render([]);SBView.app.renderer.render(SBView.app.stage);
     const r=SBView.app.view.getBoundingClientRect();
     const c=SBView.app.stage.children[3].children.find(c=>c.children[2]?.texture&&Math.abs(SBView.toWorld(r.left+c.x/960*r.width,r.top+c.y/430*r.height).x-p.x)<1e-6),s=c.children[2],k=Math.abs(s.scale.y);
     const px=c.x,py=c.y-50*k,cx=r.left+px/960*r.width,cy=r.top+py/430*r.height;
     return {fig:document.querySelector('#figure-size').value,arena:B.arena,scale:k,shadow:c.children[0].scale.x,actorHit:SBView.hitActor(cx,cy),player:B.ids.player,pick:SBView.toWorld(r.left+c.x/960*r.width,r.top+c.y/430*r.height),pixelX:c.x,pixelY:c.y,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.equal(result.fig,fig);assert.equal(result.actorHit,result.player);assert.equal(result.overflow,false);assert.equal(result.pick.inGround,true);assert(Math.abs(result.pick.x-450)<1e-8);assert(Math.abs(result.pick.z-130)<1e-8);
    await page.$('#arena').then(el=>el.screenshot({path:'previews/battle-compact-v01/'+(mobile?'mobile':'desktop')+'-'+fig+'.png'}));
    reports.push({mobile,...result});
   }
   const [old,small]=reports.slice(-2);assert(Math.abs(small.scale/old.scale-.74/1.12)<1e-8);assert(Math.abs(small.shadow/old.shadow-.74/1.12)<1e-8);assert.deepEqual(old.arena,small.arena);assert.equal(old.pixelX,small.pixelX);assert.equal(old.pixelY,small.pixelY);
  }
  // Invalid size falls back to compact; exercise actual selector navigation preserving roster parameters.
  await page.goto('http://127.0.0.1:8765/battle_sandbox.html?fig=bad&p=pn_demo&e=heo_rung_q1',{waitUntil:'networkidle2'});
  await page.waitForFunction(()=>document.querySelector('#figure-size').onchange);assert.equal(await page.$eval('#figure-size',e=>e.value),'small');
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle2'}),page.select('#figure-size','original')]);
  const query=new URL(page.url()).searchParams;assert.equal(query.get('fig'),'original');assert.equal(query.get('e'),'heo_rung_q1');
  assert.deepEqual(errors,[]);
  const unexpected=bad.filter(x=>!x.url.includes('/assets/battle_fx/'));assert.deepEqual(unexpected,[]);
  fs.writeFileSync('previews/battle-compact-v01/browser_report.json',JSON.stringify({reports,errors,badResponses:bad,limits:'Visual scale, shadow scale, inverse projection, actor selection and selector navigation. No balance or real-device approval.'},null,2));
  console.log(JSON.stringify({reports,errors,badResponses:bad},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
