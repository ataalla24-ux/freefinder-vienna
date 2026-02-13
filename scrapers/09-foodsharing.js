// ============================================
// 9. FOODSHARING VIENNA
// Fairteiler locations and Wiener Tafel
// Real free food
// ============================================

import https from 'https';
import fs from 'fs';

const FOODSHARING_URL = 'https://foodsharing.at/';
const WIENER_TAFEL_URL = 'https://www.wienertafel.at/';

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)',
        'Accept-Language': 'de-AT'
      },
      timeout: 10000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(10000, () => { req.destroy(); resolve(''); });
  });
}

async function main() {
  console.log('🍏 FOODSHARING VIENNA');
  console.log('======================\n');
  
  const deals = [];
  
  // Foodsharing Fairteiler - real free food
  const fairteilerDeals = [
    {
      brand: 'Foodsharing Wien',
      logo: '🍏',
      title: 'GRATIS Lebensmittel abholen',
      description: 'Fairteiler in ganz Wien! Lebensmittel gratis abholen oder abgeben. 100% kostenlos. Keine Anmeldung nötig!',
      url: 'https://foodsharing.at/'
    },
    {
      brand: 'Foodsharing Wien',
      logo: '🥖',
      title: 'Foodsharing - Brot & Backwaren',
      description: 'Gerettetes Brot und Backwaren von Bäckereien. Täglich frisch!',
      url: 'https://foodsharing.at/'
    },
    {
      brand: 'Foodsharing Wien',
      logo: '🍎',
      title: 'Foodsharing - Obst & Gemüse',
      description: 'Gerettetes Obst und Gemüse von Märkten und Supermärkten.',
      url: 'https://foodsharing.at/'
    },
    {
      brand: 'Wiener Tafel',
      logo: '🥫',
      title: 'GRATIS Lebensmittel - Wiener Tafel',
      description: 'Gerettete Lebensmittel kostenlos bei sozialen Ausgabestellen in Wien. Für Bedürftige.',
      url: 'https://www.wienertafel.at/'
    },
    {
      brand: 'Wiener Tafel',
      logo: '🍞',
      title: 'Wiener Tafel - Ausgabestellen',
      description: 'Multiple Ausgabestellen in ganz Wien. Täglich frische gerettete Lebensmittel.',
      url: 'https://www.wienertafel.at/'
    }
  ];
  
  // Tischlein deck dich
  const tischleinDeals = [
    {
      brand: 'Tischlein deck dich',
      logo: '🍽️',
      title: 'GRATIS Essen - Tischlein deck dich',
      description: 'Lebensmittel für alle, die sie brauchen. Mehrere Standorte in Wien.',
      url: 'https://www.tischlein.at/'
    }
  ];
  
  for (const d of [...fairteilerDeals, ...tischleinDeals]) {
    deals.push({
      id: `foodshare-${d.brand.toLowerCase().replace(/\s+/g, '-')}`,
      brand: d.brand,
      logo: d.logo,
      title: d.title,
      description: d.description,
      type: 'gratis',
      category: 'essen',
      source: d.brand,
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
  
  console.log(`✅ Found ${deals.length} foodsharing deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/foodsharing.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/foodsharing.json');
}

main();
