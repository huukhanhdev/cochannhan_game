// scripts/fetch_openaccess.cjs
// Thu thập tranh CC0 / Public Domain từ Met Museum, Cleveland Museum of Art, Art Institute of Chicago.
// Không tự ý ghi đè asset của game, lưu vào assets/openaccess/<chủ đề>/ kèm manifest.json.

const fs = require('fs');
const path = require('path');
const https = require('https');

const TOPICS = [
  {
    topic: 'thao_trung', // Ve sầu, bọ, dế, bướm, thảo trùng dùng cho Cổ Trùng
    queries: ['cicada chinese painting', 'insects chinese painting', 'grasshopper chinese painting', 'butterfly album chinese']
  },
  {
    topic: 'npc_chan_dung', // Đạo sĩ, thư sinh, võ tướng
    queries: ['chinese portrait painting', 'daoist immortal portrait', 'scholar portrait chinese', 'general portrait ming qing']
  },
  {
    topic: 'son_thuy', // Cảnh nền núi rừng, sương mù, thác nước
    queries: ['chinese landscape hanging scroll', 'misty mountain landscape song ming', 'landscape handscroll']
  },
  {
    topic: 'linh_thu', // Sói, hổ, báo, ưng, thú hoang
    queries: ['tiger chinese painting', 'wolf chinese ink', 'eagle falcon chinese painting', 'boar animal ming']
  }
];

const BASE_DIR = path.resolve(__dirname, '..', 'assets', 'openaccess');

function httpsGet(url, options = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Node.js OpenAccess Bot)' }, ...options }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, options).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function searchMet(query, max = 3) {
  try {
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&q=${encodeURIComponent(query)}`;
    const buf = await httpsGet(url);
    const data = JSON.parse(buf.toString());
    if (!data.objectIDs || !data.objectIDs.length) return [];
    const ids = data.objectIDs.slice(0, max);
    const results = [];
    for (const id of ids) {
      try {
        const itemBuf = await httpsGet(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        const item = JSON.parse(itemBuf.toString());
        if (item.isPublicDomain && item.primaryImageSmall) {
          results.push({
            id: `met_${id}`,
            source: 'The Metropolitan Museum of Art',
            title: item.title || 'Untitled',
            artist: item.artistDisplayName || 'Unknown',
            date: item.objectDate || '',
            url: item.primaryImageSmall,
            pageUrl: item.objectURL || '',
            license: 'CC0 / Public Domain'
          });
        }
      } catch (err) {
        // Skip individual failure
      }
    }
    return results;
  } catch (e) {
    console.warn(`[Met] Search failed for "${query}":`, e.message);
    return [];
  }
}

async function searchCleveland(query, max = 3) {
  try {
    const url = `https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(query)}&cc0=1&has_image=1&limit=${max}`;
    const buf = await httpsGet(url);
    const data = JSON.parse(buf.toString());
    if (!data.data || !data.data.length) return [];
    return data.data.map(item => ({
      id: `cma_${item.id}`,
      source: 'Cleveland Museum of Art',
      title: item.title || 'Untitled',
      artist: item.creators && item.creators[0] ? item.creators[0].description : 'Unknown',
      date: item.creation_date || '',
      url: item.images && item.images.web ? item.images.web.url : '',
      pageUrl: item.url || '',
      license: 'CC0'
    })).filter(x => x.url);
  } catch (e) {
    console.warn(`[Cleveland] Search failed for "${query}":`, e.message);
    return [];
  }
}

async function downloadItem(item, dir) {
  const filename = `${item.id}.jpg`;
  const destPath = path.join(dir, filename);
  if (fs.existsSync(destPath)) return filename;
  try {
    const buf = await httpsGet(item.url);
    fs.writeFileSync(destPath, buf);
    console.log(`  -> Downloaded: ${filename} (${item.title.substring(0, 40)})`);
    return filename;
  } catch (e) {
    console.warn(`  -> Failed to download ${item.url}: ${e.message}`);
    return null;
  }
}

async function run() {
  console.log('=== Khởi động thu thập OpenAccess CC0 ===');
  if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });

  for (const t of TOPICS) {
    console.log(`\n[Chủ đề: ${t.topic}]`);
    const topicDir = path.join(BASE_DIR, t.topic);
    if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });

    const manifestPath = path.join(topicDir, 'manifest.json');
    let manifest = [];
    if (fs.existsSync(manifestPath)) {
      try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) {}
    }

    const items = [];
    for (const q of t.queries) {
      console.log(` Đang tìm: "${q}"...`);
      const metResults = await searchMet(q, 2);
      const cmaResults = await searchCleveland(q, 2);
      items.push(...metResults, ...cmaResults);
    }

    // Lọc trùng theo id
    const unique = [];
    const seen = new Set(manifest.map(m => m.id));
    for (const it of items) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        unique.push(it);
      }
    }

    console.log(` Tìm thấy ${unique.length} tranh mới.`);
    for (const it of unique) {
      const fn = await downloadItem(it, topicDir);
      if (fn) {
        manifest.push({
          id: it.id,
          file: fn,
          title: it.title,
          artist: it.artist,
          date: it.date,
          source: it.source,
          pageUrl: it.pageUrl,
          license: it.license
        });
      }
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(` Cập nhật manifest: ${manifestPath} (${manifest.length} mục)`);
  }

  console.log('\n=== Thu thập OpenAccess CC0 hoàn tất ===');
}

run().catch(console.error);
