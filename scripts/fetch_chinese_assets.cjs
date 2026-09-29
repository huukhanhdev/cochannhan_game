const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CHINESE_CATEGORIES = [
  {
    name: 'fang_yuan',
    query: '古月方源',
    folder: 'assets/chinese_sources/fang_yuan',
    mainDest: 'assets/local/_scraped/p_hero_chinese.jpg'
  },
  {
    name: 'bai_ning_bing',
    query: '白凝冰',
    folder: 'assets/chinese_sources/bai_ning_bing',
    mainDest: 'assets/local/_scraped/p_bai_chinese.jpg'
  },
  {
    name: 'chun_qiu_chan',
    query: '春秋蝉',
    folder: 'assets/chinese_sources/chun_qiu_chan',
    mainDest: 'assets/local/_scraped/g_chun_qiu_chan.jpg'
  },
  {
    name: 'shang_xin_ci',
    query: '商心慈',
    folder: 'assets/chinese_sources/shang_xin_ci',
    mainDest: 'assets/local/_scraped/p_shangxinci.jpg'
  },
  {
    name: 'tie_xue_leng',
    query: '铁血冷',
    folder: 'assets/chinese_sources/tie_xue_leng',
    mainDest: 'assets/local/_scraped/p_tiexueleng.jpg'
  },
  {
    name: 'qing_shu',
    query: '古月青书',
    folder: 'assets/chinese_sources/qing_shu',
    mainDest: 'assets/local/_scraped/p_qingshu.jpg'
  },
  {
    name: 'lang_trieu',
    query: '妖狼 狼潮',
    folder: 'assets/chinese_sources/lang_trieu',
    mainDest: 'assets/local/_scraped/p_wolfking_chinese.jpg'
  },
  {
    name: 'thanh_mao_son',
    query: '青茅山 古风',
    folder: 'assets/chinese_sources/thanh_mao_son',
    mainDest: 'assets/local/_scraped/bg_qingmao_chinese.jpg'
  },
  {
    name: 'co_trung',
    query: '月光蛊',
    folder: 'assets/chinese_sources/co_trung',
    mainDest: 'assets/local/_scraped/g_nguyetquang_chinese.jpg'
  }
];

function getRefererForUrl(url) {
  if (url.includes('hdslb.com') || url.includes('bilibili.com')) return 'https://www.bilibili.com/';
  if (url.includes('huashi6.com')) return 'https://www.huashi6.com/';
  if (url.includes('zhimg.com')) return 'https://www.zhihu.com/';
  if (url.includes('iqiyi')) return 'https://www.iqiyi.com/';
  if (url.includes('haowallpaper.com')) return 'https://haowallpaper.com/';
  return 'https://www.bing.com/';
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const client = url.startsWith('https') ? https : http;
    const referer = getRefererForUrl(url);

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': referer
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const ct = res.headers['content-type'] || '';
      if (!ct.includes('image') && !ct.includes('octet-stream')) {
        return reject(new Error(`Not image: ${ct}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stat = fs.statSync(destPath);
        if (stat.size < 15000) {
          try { fs.unlinkSync(destPath); } catch(e){}
          return reject(new Error(`Too small (${stat.size}B)`));
        }
        resolve(stat.size);
      });
      fileStream.on('error', (err) => {
        try { fs.unlinkSync(destPath); } catch(e){}
        reject(err);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

(async () => {
  console.log('🇨🇳 Starting Authentic Chinese Asset Harvester...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  for (const cat of CHINESE_CATEGORIES) {
    console.log(`\n🔍 Searching Chinese sources for [${cat.name}]: "${cat.query}"...`);
    try {
      const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(cat.query)}&first=1`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 25000 });
      await new Promise(r => setTimeout(r, 2500));

      const candidates = await page.evaluate(() => {
        const list = [];
        document.querySelectorAll('a').forEach(a => {
          try {
            const m = JSON.parse(a.getAttribute('m'));
            if (m && m.murl && m.murl.startsWith('http')) {
              list.push({ title: m.t || '', url: m.murl });
            }
          } catch(e){}
        });
        return list;
      });

      console.log(`  Found ${candidates.length} candidates from Chinese web.`);

      let saved = 0;
      for (let i = 0; i < candidates.length && saved < 3; i++) {
        const cand = candidates[i];
        const ext = cand.url.includes('.png') ? 'png' : 'jpg';
        const targetPath = path.join(__dirname, '..', cat.folder, `${cat.name}_cn_${saved + 1}.${ext}`);
        
        try {
          const size = await downloadFile(cand.url, targetPath);
          console.log(`  ✓ Saved [${saved + 1}]: ${targetPath} (${Math.round(size / 1024)} KB) - ${cand.title.slice(0, 40)}`);
          
          if (saved === 0 && cat.mainDest) {
            const mainPath = path.join(__dirname, '..', cat.mainDest);
            fs.copyFileSync(targetPath, mainPath);
            console.log(`    ⭐ Set canonical asset: ${cat.mainDest}`);
          }
          saved++;
        } catch(e) {
          // ignore error and try next candidate
        }
      }
    } catch(err) {
      console.error(`  Error in category ${cat.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n✨ Authentic Chinese Asset Harvester completed successfully!');
})();
