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

  // 1. If "Bắt đầu" is on screen, click it
  const startBtn = await page.$('button[data-title="intro"]');
  if (startBtn) {
    await startBtn.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // 2. If intro is playing and there's a "Bỏ qua" button, click it
  const skipBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Bỏ qua')) || null;
  });
  if (skipBtn && skipBtn.asElement()) {
    console.log('Found skip button, clicking...');
    await skipBtn.asElement().click();
    await new Promise(r => setTimeout(r, 600));
  }

  // 3. Pick trait if trait selection is shown
  const traitCard = await page.$('.trait-card');
  if (traitCard) {
    const tText = await page.evaluate(b => b.innerText.split('\n')[1] || b.innerText, traitCard);
    console.log('Picking trait:', tText);
    await traitCard.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // 4. Capture Event: Lễ Khai Khiếu
  await page.screenshot({ path: path.join(__dirname, 'shot_event_khaikhieu.png') });
  console.log('Saved shot_event_khaikhieu.png');

  const evData = await page.evaluate(() => {
    const st = document.querySelector('.story');
    if (!st) return { hasStory: false };
    return {
      hasStory: true,
      title: st.querySelector('h2') ? st.querySelector('h2').innerText : '',
      speaker: st.querySelector('.spk-name') ? st.querySelector('.spk-name').innerText : '',
      text: st.querySelector('.story-text') ? st.querySelector('.story-text').innerText : '',
      choices: Array.from(st.querySelectorAll('.choices button')).map(b => b.innerText.trim())
    };
  });
  console.log('Event Data:', evData);

  // 5. Click choice 1 in Lễ Khai Khiếu
  const choiceBtn = await page.$('.story .choices button');
  if (choiceBtn) {
    const cText = await page.evaluate(b => b.innerText, choiceBtn);
    console.log('Selected Choice:', cText);
    await choiceBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // 6. Capture Map View
  await page.screenshot({ path: path.join(__dirname, 'shot_map_view.png') });
  console.log('Saved shot_map_view.png');

  const mapData = await page.evaluate(() => {
    return {
      turn: S.turn,
      month: Math.ceil(S.turn / 3),
      tuan: (S.turn - 1) % 3,
      hp: S.hp,
      ess: S.ess,
      stones: S.stones,
      evq: S.evq,
      acted: S.acted,
      spots: Array.from(document.querySelectorAll('.map-spot')).map(s => s.innerText.trim().replace(/\n/g, ' '))
    };
  });
  console.log('Map Data:', mapData);

  // 7. Click a side action on map (e.g., 'Dạo sơn trại' or 'Học đường')
  const spots = await page.$$('.map-spot');
  if (spots.length > 0) {
    const spotText = await page.evaluate(s => s.innerText.replace(/\n/g, ' '), spots[1] || spots[0]);
    console.log('Clicking Map Spot:', spotText);
    await (spots[1] || spots[0]).click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // 8. Capture what happens right after clicking side action
  await page.screenshot({ path: path.join(__dirname, 'shot_after_action.png') });
  console.log('Saved shot_after_action.png');

  const afterActData = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      turn: S.turn,
      evq: S.evq,
      hasStory: !!st,
      title: st && st.querySelector('h2') ? st.querySelector('h2').innerText : 'None',
      text: st && st.querySelector('.story-text') ? st.querySelector('.story-text').innerText : 'None',
      log: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-4).map(p => p.innerText.trim())
    };
  });
  console.log('After Act Data:', afterActData);

  await browser.close();
})();
