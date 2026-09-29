const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CATEGORIES = [
  {
    name: 'fang_yuan',
    query: 'Fang Yuan Reverend Insanity fanart',
    dest: 'assets/local/_scraped/p_hero_fy.jpg',
    extraFolder: 'assets/pinterest/fang_yuan'
  },
  {
    name: 'bai_ning_bing',
    query: 'Bai Ning Bing Reverend Insanity fanart',
    dest: 'assets/local/_scraped/p_bai_alt.jpg',
    extraFolder: 'assets/pinterest/bai_ning_bing'
  },
  {
    name: 'thien_ngoai_chi_ma',
    query: 'Dark Xianxia cultivator male black hair purple aura fantasy',
    dest: 'assets/local/_scraped/p_alien.jpg',
    extraFolder: 'assets/pinterest/thien_ngoai_chi_ma'
  },
  {
    name: 'lang_trieu',
    query: 'fantasy horned lightning wolf demon wolf art',
    dest: 'assets/local/_scraped/p_wolf_thunder.jpg',
    extraFolder: 'assets/pinterest/lang_trieu'
  },
  {
    name: 'cu_luc_gu',
    query: 'fantasy glowing horned rhinoceros beetle insect macro art',
    dest: 'assets/local/_scraped/g_cu_luc.jpg',
    extraFolder: 'assets/pinterest/co_trung'
  },
  {
    name: 'xuan_loi_gu',
    query: 'electric lightning beetle fantasy insect glowing blue',
    dest: 'assets/local/_scraped/g_xuan_loi.jpg',
    extraFolder: 'assets/pinterest/co_trung'
  },
  {
    name: 'xuan_kiem_gu',
    query: 'metallic gold mantis sword insect fantasy glowing jade',
    dest: 'assets/local/_scraped/g_xuan_kiem.jpg',
    extraFolder: 'assets/pinterest/co_trung'
  },
  {
    name: 'xuan_kim_gu',
    query: 'golden metallic scarab beetle glowing rune fantasy insect',
    dest: 'assets/local/_scraped/g_xuan_kim.jpg',
    extraFolder: 'assets/pinterest/co_trung'
  },
  {
    name: 'xuan_thao_gu',
    query: 'magical glowing green herb nine leaf fantasy plant art',
    dest: 'assets/local/_scraped/g_xuan_thao.jpg',
    extraFolder: 'assets/pinterest/co_trung'
  },
  {
    name: 'thanh_mao_mountain',
    query: 'Chinese misty mountain dark ink wash bamboo xianxia landscape art',
    dest: 'assets/local/_scraped/bg_qingmao_panoramic.jpg',
    extraFolder: 'assets/pinterest/scenery'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stat = fs.statSync(destPath);
        if (stat.size < 10000) {
          fs.unlinkSync(destPath);
          return reject(new Error(`File too small (${stat.size} bytes)`));
        }
        resolve(stat.size);
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

(async () => {
  console.log('🚀 Starting Pinterest Asset Downloader...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  for (const cat of CATEGORIES) {
    console.log(`\n🔍 Searching [${cat.name}]: "${cat.query}"...`);
    try {
      const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(cat.query)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2500));

      // Scroll to trigger lazy loading
      await page.evaluate(() => window.scrollBy(0, 800));
      await new Promise(r => setTimeout(r, 1500));

      const imgUrls = await page.evaluate(() => {
        const set = new Set();
        document.querySelectorAll('img').forEach(img => {
          const src = img.src || img.getAttribute('src');
          if (src && src.includes('pinimg.com') && !src.includes('/60x60/') && !src.includes('/75x75/')) {
            // Convert to 736x for full crisp resolution
            const highRes = src.replace(/\/\d+x\d*\//, '/736x/');
            set.add(highRes);
          }
        });
        return Array.from(set);
      });

      console.log(`Found ${imgUrls.length} candidate pins for ${cat.name}`);

      let downloadedCount = 0;
      for (let i = 0; i < imgUrls.length && downloadedCount < 3; i++) {
        const url = imgUrls[i];
        const extraPath = path.join(__dirname, '..', cat.extraFolder, `${cat.name}_${i + 1}.jpg`);
        try {
          const size = await downloadFile(url, extraPath);
          console.log(`  ✓ Saved to ${extraPath} (${Math.round(size / 1024)} KB)`);
          
          // Copy first valid image to main game asset destination
          if (downloadedCount === 0 && cat.dest) {
            const mainDestPath = path.join(__dirname, '..', cat.dest);
            fs.copyFileSync(extraPath, mainDestPath);
            console.log(`  ⭐ Set main asset: ${cat.dest}`);
          }
          downloadedCount++;
        } catch (err) {
          // ignore failed single image download and try next
        }
      }
    } catch (e) {
      console.error(`Failed category ${cat.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('\n✨ All categories processed successfully!');
})();
