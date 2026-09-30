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

  // 1. Skip intro / pick trait directly via evaluate
  await page.evaluate(() => {
    if (typeof S !== 'undefined' && S.traitOpts && S.traitOpts.length) {
      pickTrait(S.traitOpts[0]);
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot Event 1: Lễ khai khiếu
  await page.screenshot({ path: path.join(__dirname, 'shot_1_khaikhieu.png') });
  console.log('Saved shot_1_khaikhieu.png');

  const evInfo = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      title: st ? st.querySelector('h2').innerText : 'None',
      text: st ? st.querySelector('.story-text').innerText : 'None',
      choices: st ? Array.from(st.querySelectorAll('.choices button')).map(b => b.innerText.trim()) : []
    };
  });
  console.log('Event 1 (Lễ khai khiếu):', evInfo);

  // 2. Click Choice 1 in Lễ khai khiếu
  await page.evaluate(() => {
    choose(0);
  });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot Map View (Tuần 1 hoặc Tuần 2)
  await page.screenshot({ path: path.join(__dirname, 'shot_2_map.png') });
  console.log('Saved shot_2_map.png');

  const mapInfo = await page.evaluate(() => {
    return {
      turn: S.turn,
      month: Math.ceil(S.turn/3),
      tuan: (S.turn-1)%3,
      evq: S.evq,
      acted: S.acted,
      spots: Array.from(document.querySelectorAll('.map-spot, .act-card-rich')).map(s => s.innerText.trim().replace(/\n/g, ' ')),
      log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
    };
  });
  console.log('Map State (After Khai Khiếu):', mapInfo);

  // 3. Now perform 1 side action: 'trai' (Dạo sơn trại)
  console.log('--- Performing action: act(\"trai\") ---');
  await page.evaluate(() => {
    act('trai');
  });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot after act('trai')
  await page.screenshot({ path: path.join(__dirname, 'shot_3_after_act_trai.png') });
  console.log('Saved shot_3_after_act_trai.png');

  const afterActInfo = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      turn: S.turn,
      evq: S.evq,
      hasEvent: !!st,
      eventTitle: st ? st.querySelector('h2').innerText : 'No Event Popup',
      eventText: st ? st.querySelector('.story-text').innerText : '',
      eventChoices: st ? Array.from(st.querySelectorAll('.choices button')).map(b => b.innerText.trim()) : [],
      log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
    };
  });
  console.log('State After act(\"trai\"):', afterActInfo);

  // 4. If an event is triggered, choose choice 0 to see how turn advances
  if (afterActInfo.hasEvent) {
    console.log('--- Choosing choice 0 of this event ---');
    await page.evaluate(() => {
      choose(0);
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(__dirname, 'shot_4_after_resolving_event.png') });
    console.log('Saved shot_4_after_resolving_event.png');

    const nextState = await page.evaluate(() => {
      const st = document.querySelector('.story');
      return {
        turn: S.turn,
        evq: S.evq,
        hasEvent: !!st,
        eventTitle: st ? st.querySelector('h2').innerText : 'No Event Popup',
        log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
      };
    });
    console.log('State After Resolving Event:', nextState);
  }

  await browser.close();
})();
