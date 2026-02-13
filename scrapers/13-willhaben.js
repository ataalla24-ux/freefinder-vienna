// ============================================
// WILLHABEN & EBAY KLEINANZEIGEN
// Free stuff in Vienna
// ============================================

import https from 'https';
import fs from 'fs';

// Willhaben categories (they have a "gratis" section)
const WILLHABEN_URLS = [
  { name: 'Gratis Wien', url: 'https://www.willhaben.at/iad/default/?sort=RELEVANCE&keyword=gratis&areaId=900&isNavigationSubmit=true', category: 'gratis' },
  { name: 'Verschenke Wien', url: 'https://www.willhaben.at/iad/verschenke-kaufen/verschenken/?keyword=&areaId=900', category: 'verschenken' },
];

// eBAY Kleinanzeigen Vienna
const EBAY_URLS = [
  { name: 'Gratis Berlin', url: 'https://www.ebay-kleinanzeigen.de/s-berlin/gratis/k0', category: 'gratis' }, // Berlin as example - need Vienna
  { name: 'Verschenke Wien', url: 'https://www.ebay-kleinanzeigen.de/s-wohnung-mieten/verschenken/anzeige:gratis?cId=900', category: 'verschenken' },
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'de-AT'
      },
      timeout: 15000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractWillhaben(html, source) {
  const deals = [];
  
  // Look for listing items - willhaben uses data-adid
  const itemRegex = /data-adid="(\d+)".*?<a[^>]*href="([^"]+)">([^<]+)</gi;
  let match;
  
  while ((match = itemRegex.exec(html)) !== null && deals.length < 10) {
    const title = match[3].trim();
    if (title.length > 5) {
      deals.push({
        id: `wh-${match[1]}`,
        brand: 'Willhaben',
        logo: '🎁',
        title: title.substring(0, 60),
        description: `Gratis / Verschenke auf Willhaben: ${title}`,
        type: 'gratis',
        category: source.category,
        source: 'Willhaben',
        url: 'https://www.willhaben.at' + match[2],
        expires: 'Sofort',
        distance: 'Wien',
        hot: true,
        isNew: true,
        priority: 1,
        votes: 50,
        pubDate: new Date().toISOString()
      });
    }
  }
  
  return deals;
}

async function main() {
  console.log('🎁 WILLHABEN - Free Stuff Vienna');
  console.log('=================================\n');
  
  const allDeals = [];
  
  for (const source of WILLHABEN_URLS) {
    console.log(`📥 Fetching ${source.name}...`);
    
    try {
      const html = await fetchHTML(source.url);
      const deals = extractWillhaben(html, source);
      allDeals.push(...deals);
      console.log(`   → ${deals.length} items`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  
  // Add some known good Willhaben sources as manual deals
  const manualDeals = [
    {
      brand: 'Willhaben',
      logo: '🎁',
      title: 'Gratis Verschenke Wien',
      description: 'Täglich neue kostenlose Dinge in Wien. Von Möbeln bis Elektronik!',
      url: 'https://www.willhaben.at/iad/verschenke-kaufen/verschenken/?keyword=&areaId=900'
    },
    {
      brand: 'Willhaben',
      logo: '🆓',
      title: 'Gratis Kleinanzeigen Wien',
      description: 'Gratis Inserate in Wien - von Food bis Möbel',
      url: 'https://www.willhaben.at/iad/default/?sort=RELEVANCE&keyword=gratis&areaId=900'
    }
  ];
  
  for (const d of manualDeals) {
    allDeals.push({
      id: `wh-manual-${d.brand.toLowerCase()}`,
      brand: d.brand,
      logo: d.logo,
      title: d.title,
      description: d.description,
      type: 'gratis',
      category: 'gratis',
      source: 'Willhaben',
      url: d.url,
      expires: 'Täglich',
      distance: 'Wien',
      hot: true,
      isNew: false,
      priority: 1,
      votes: 200,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`\n🎁 Total: ${allDeals.length} Willhaben deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/willhaben.json', JSON.stringify(allDeals, null, 2));
  console.log('💾 Saved to output/willhaben.json');
}

main();
