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

  // Click "Bỏ qua" or "Bắt đầu"
  const startBtn = await page.$('button[data-title="intro"]');
  if (startBtn) await startBtn.click();
  await new Promise(r => setTimeout(r, 400));
  
  const skipBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Bỏ qua')) || null;
  });
  if (skipBtn && skipBtn.asElement()) {
    await skipBtn.asElement().click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Click on the trait button with data-trait
  const traitBtn = await page.$('button[data-trait]');
  if (traitBtn) {
    console.log('Clicking trait with data-trait...');
    await traitBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  // Now capture the screen!
  await page.screenshot({ path: path.join(__dirname, 'shot_trait_clicked.png') });
  console.log('Saved shot_trait_clicked.png');

  const storyInfo = await page.evaluate(() => {
    const st = document.querySelector('.story');
    if (!st) return { found: false, html: document.getElementById('story') ? document.getElementById('story').innerHTML.slice(0, 300) : '' };
    return {
      found: true,
      title: st.querySelector('h2') ? st.querySelector('h2').innerText : '',
      speaker: st.querySelector('.spk-name') ? st.querySelector('.spk-name').innerText : '',
      text: st.querySelector('.story-text') ? st.querySelector('.story-text').innerText : '',
      choices: Array.from(st.querySelectorAll('.choices button')).map(b => b.innerText.trim())
    };
  });
  console.log('Story Info:', storyInfo);

  // If choices exist, click choice 0
  const c0 = await page.$('.story .choices button');
  if (c0) {
    console.log('Clicking choice 0...');
    await c0.click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(__dirname, 'shot_after_khaikhieu_choice.png') });
    console.log('Saved shot_after_khaikhieu_choice.png');
  }

  // Now check what is on screen
  const screenInfo = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      turn: S.turn,
      evq: S.evq,
      hasStory: !!st,
      storyTitle: st && st.querySelector('h2') ? st.querySelector('h2').innerText : 'None',
      panel: S.panel,
      mapSpots: Array.from(document.querySelectorAll('.map-spot')).map(s => s.innerText.trim().replace(/\n/g, ' ')),
      logLatest: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-3).map(p => p.innerText.trim())
    };
  });
  console.log('Screen Info after choice 0:', screenInfo);

  // Now click on a map spot (e.g. Học đường or Dạo sơn trại)
  const spot = await page.$('.map-spot');
  if (spot) {
    const sName = await page.evaluate(s => s.innerText.replace(/\n/g, ' '), spot);
    console.log('Clicking map spot:', sName);
    await spot.click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(__dirname, 'shot_after_map_spot.png') });
    console.log('Saved shot_after_map_spot.png');
  }

  const afterSpotInfo = await page.evaluate(() => {
    const st = document.querySelector('.story');
    return {
      turn: S.turn,
      evq: S.evq,
      hasStory: !!st,
      storyTitle: st && st.querySelector('h2') ? st.querySelector('h2').innerText : 'None',
      storyText: st && st.querySelector('.story-text') ? st.querySelector('.story-text').innerText : 'None',
      logLatest: Array.from(document.querySelectorAll('.log-item, .log p')).slice(-3).map(p => p.innerText.trim())
    };
  });
  console.log('After Spot Info:', afterSpotInfo);

  await browser.close();
})();
