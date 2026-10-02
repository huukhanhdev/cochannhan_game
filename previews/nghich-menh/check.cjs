// Browser checks for the independent PR-01 prototype; no production game loaded.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const puppeteer=require('puppeteer');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8097/previews/nghich-menh/';
(async()=>{
  const browser=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox','--disable-setuid-sandbox']});
  try{
    const page=await browser.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    // Keep screenshot typography reproducible offline; browser fallback is intentional.
    await page.setRequestInterception(true);
    page.on('request',request=>{if(request.url().includes('fonts.googleapis.com')||request.url().includes('fonts.gstatic.com'))request.abort();else request.continue()});
    await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
    await page.goto(base,{waitUntil:'networkidle0'});
    await page.evaluate(()=>{localStorage.setItem('tms2-save','preview-sentinel');localStorage.setItem('tms2-meta','preview-meta-sentinel')});
    const shots=path.join(__dirname,'screenshots');fs.mkdirSync(shots,{recursive:true});
    for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
      await page.setViewport({width,height,deviceScaleFactor:1});
      for(const view of ['journey','story','gu','combat','journal']){
        await page.goto(base+'#'+view,{waitUntil:'networkidle0'});
        await page.evaluate(()=>document.body.classList.add('reduce-motion'));
        await page.evaluate(async()=>{await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode()}catch(_){}}))});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name}/${view}: overflow`);
        assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[],`${name}/${view}: missing image`);
        await page.screenshot({path:path.join(shots,`${name}-${view}.png`),fullPage:true});
      }
    }
    await page.setViewport({width:1440,height:1000});
    await page.goto(base+'#story',{waitUntil:'networkidle0'});
    await page.click('[data-choice="follow"]');
    assert.match(await page.$eval('.result',el=>el.textContent),/Một lối đi mở ra/);
    await page.click('[data-view="journey"]');
    await page.waitForSelector('.turn-control');
    assert.match(await page.$eval('.turn-control',el=>el.textContent),/2\/3/);
    await page.click('[data-action="next-turn"]');
    assert.equal(await page.$eval('dialog',d=>d.open),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('dialog',d=>d.open),false);
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'next-turn');
    await page.click('[data-action="next-turn"]');await page.click('[data-action="confirm-turn"]');
    assert.match(await page.$eval('.turn-control',el=>el.textContent),/3\/3/);
    await page.click('[data-book="2"]');assert.match(await page.$eval('h1',el=>el.textContent),/Thương gia/);
    await page.click('[data-view="gu"]');await page.waitForSelector('.gu-grid');
    await page.click('[data-filter="guard"]');assert.equal(await page.$$eval('.gu-card',els=>els.length),1);
    assert.match(await page.$eval('.gu-detail',el=>el.textContent),/Ngọc Bì/);
    await page.click('[data-view="combat"]');await page.waitForSelector('.skills');
    await page.click('[data-skill="attack"]');assert.match(await page.$eval('.combat-log',el=>el.textContent),/28/);
    for(let i=0;i<3;i++)await page.click('[data-skill="attack"]');
    assert.match(await page.$eval('.combat-log',el=>el.textContent),/hoàn tất/);
    await page.click('[data-action="reset-combat"]');assert.equal(await page.$eval('[data-skill="attack"]',el=>el.disabled),false);
    await page.click('[data-view="journal"]');await page.waitForSelector('.timeline-list');
    assert.match(await page.$eval('.timeline-list',el=>el.textContent),/Một lối đi mở ra/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('tms2-save')),'preview-sentinel');
    assert.equal(await page.evaluate(()=>localStorage.getItem('tms2-meta')),'preview-meta-sentinel');
    assert.equal(await page.evaluate(()=>[...document.scripts].some(s=>/ui-v2|engine\.js/.test(s.src))),false);
    assert.deepEqual(errors,[]);
    console.log('PASS: 5 screens × desktop/mobile; assets; no overflow; choice/AP/journal; Q2; filters; combat; modal/Escape/focus; production save isolation.');
    console.log('Screenshots: '+shots);
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
