const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  await page.goto('http://localhost:8088/', { waitUntil: 'networkidle2' });

  // Dismiss title layer completely
  await page.evaluate(() => {
    UI.title = false;
    UI.intro = false;
    renderTitle();
    render();
  });
  await new Promise(r => setTimeout(r, 600));

  // 1. Pick trait if traitOpts exists
  await page.evaluate(() => {
    if (S.traitOpts && S.traitOpts.length) {
      pickTrait(S.traitOpts[0]);
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Capture Event 1: Lễ khai khiếu
  await page.screenshot({ path: path.join(__dirname, 'real_1_khaikhieu.png') });
  console.log('Saved real_1_khaikhieu.png');

  const ev1Data = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      title: st ? st.querySelector('h2').innerText : 'None',
      text: st ? st.querySelector('.story-text').innerText : 'None',
      choices: st ? Array.from(st.querySelectorAll('.choices button')).map(b => b.innerText.trim()) : []
    };
  });
  console.log('Event 1 Data:', ev1Data);

  // 3. Make choice 0 in Lễ khai khiếu
  await page.evaluate(() => {
    choose(0);
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Capture Map screen
  await page.screenshot({ path: path.join(__dirname, 'real_2_map.png') });
  console.log('Saved real_2_map.png');

  const mapData = await page.evaluate(() => {
    return {
      turn: S.turn,
      month: Math.ceil(S.turn/3),
      tuan: (S.turn-1)%3,
      evq: S.evq,
      acted: S.acted,
      panel: S.panel,
      mapSpots: Array.from(document.querySelectorAll('.map-spot, .act-card-rich')).map(s => s.innerText.trim().replace(/\n/g, ' ')),
      log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
    };
  });
  console.log('Map Data:', mapData);

  // 5. Trigger side action: act('hocduong') or act('trai')
  console.log('Triggering act("hocduong")...');
  await page.evaluate(() => {
    act('hocduong');
  });
  await new Promise(r => setTimeout(r, 600));

  // 6. Capture after action
  await page.screenshot({ path: path.join(__dirname, 'real_3_after_act.png') });
  console.log('Saved real_3_after_act.png');

  const afterAct = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      turn: S.turn,
      evq: S.evq,
      hasStory: !!st,
      title: st ? st.querySelector('h2').innerText : 'None',
      text: st ? st.querySelector('.story-text').innerText : 'None',
      choices: st ? Array.from(st.querySelectorAll('.choices button')).map(b => b.innerText.trim()) : [],
      log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
    };
  });
  console.log('After Act State:', afterAct);

  // 7. Resolve event if any, or trigger advance
  if (afterAct.hasStory) {
    console.log('Resolving side event with choice 0...');
    await page.evaluate(() => {
      choose(0);
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(__dirname, 'real_4_after_side_event.png') });
    console.log('Saved real_4_after_side_event.png');

    const nextState = await page.evaluate(() => {
      const st = document.querySelector('.story');
      return {
        turn: S.turn,
        evq: S.evq,
        hasStory: !!st,
        title: st ? st.querySelector('h2').innerText : 'None',
        text: st ? st.querySelector('.story-text').innerText : 'None',
        log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
      };
    });
    console.log('Next State (Next Turn Main Event?):', nextState);
  }

  await browser.close();
})();
