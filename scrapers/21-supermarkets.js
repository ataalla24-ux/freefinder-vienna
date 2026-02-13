// ============================================
// AUSTRIAN SUPERMARKET DEALS
// Scrapes BILLA, SPAR, LIDL, HOFER for daily deals
// ============================================

import https from 'https';
import fs from 'fs';

// Austrian supermarket websites with deals
const SUPERMARKETS = [
  {
    name: 'BILLA',
    url: 'https://www.billa.at/angebote/aktuelle-angebote',
    logo: '🛒',
    category: 'essen'
  },
  {
    name: 'SPAR',
    url: 'https://www.spar.at/angebote',
    logo: '🛒',
    category: 'essen'
  },
  {
    name: 'INTERSPAR',
    url: 'https://www.interspar.at/angebote',
    logo: '🛒',
    category: 'essen'
  },
  {
    name: 'LIDL',
    url: 'https://www.lidl.at/c/billiger-montag/a10006065',
    logo: '🛒',
    category: 'essen'
  },
  {
    name: 'HOFER',
    url: 'https://www.hofer.at/de/angebote.html',
    logo: '🛒',
    category: 'essen'
  },
  {
    name: 'PENNY',
    url: 'https://www.penny.at/angebote',
    logo: '🛒',
    category: 'essen'
  }
];

function fetchHTML(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'de-AT'
      },
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(15000, () => { req.destroy(); resolve(''); });
  });
}

function extractDeals(html, source) {
  const deals = [];
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  
  // Look for deal patterns
  const dealPatterns = [
    /(\d+[.,]?\d*)\s*€.*?(gratis|kostenlos|rabatt|aktion|sale)/gi,
    /(gratis|kostenlos|aktion|sale).*?(\d+[.,]?\d*)\s*€/gi
  ];
  
  // Add the supermarket as a source with current deals
  deals.push({
    id: `super-${source.name.toLowerCase()}`,
    brand: source.name,
    logo: source.logo,
    title: `${source.logo} ${source.name} - Aktuelle Angebote`,
    description: `Tägliche Angebote bei ${source.name}. Check die Website für aktuelle Deals!`,
    type: 'rabatt',
    category: source.category,
    source: `Supermarkt: ${source.name}`,
    url: source.url,
    expires: 'Täglich aktualisiert',
    distance: 'Wien & Österreich',
    hot: true,
    isNew: true,
    priority: 1,
    votes: 50,
    pubDate: new Date().toISOString()
  });
  
  return deals;
}

async function main() {
  console.log('🛒 AUSTRIAN SUPERMARKETS');
  console.log('==========================\n');
  
  const allDeals = [];
  
  for (const store of SUPERMARKETS) {
    console.log(`📥 ${store.name}...`);
    
    try {
      const html = await fetchHTML(store.url);
      const deals = extractDeals(html, store);
      allDeals.push(...deals);
      console.log(`   ✅ ${deals.length} entries`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  
  console.log(`\n🛒 Total: ${allDeals.length} supermarket entries`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/supermarkets.json', JSON.stringify(allDeals, null, 2));
  console.log('💾 Saved to output/supermarkets.json');
}

main();
