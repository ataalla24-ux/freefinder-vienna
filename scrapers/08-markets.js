// ============================================
// 8. VIENNA MARKETS SCRAPER
// Naschmarkt, Karmelitermarkt, etc.
// Closing time deals
// ============================================

import https from 'https';
import fs from 'fs';

const MARKETS = [
  {
    name: 'Naschmarkt',
    description: 'Wiens berühmtester Markt. Am Samstag Flohmarkt, unter der Woche Lebensmittel.',
    url: 'https://www.naschmarkt.at/'
  },
  {
    name: 'Karmelitermarkt',
    description: 'Ältester Wiener Markt. Frische Produkte täglich. Am Nachmittag oft günstiger!',
    url: 'https://www.wien.gv.at/markt/flaechen/karmelitermarkt.html'
  },
  {
    name: 'Brunnenmarkt',
    description: 'Einer der längsten Märkte Europas. Günstige Preise, viel Auswahl.',
    url: 'https://www.wien.gv.at/markt/flaechen/brunnenmarkt.html'
  },
  {
    name: 'Meidlinger Markt',
    description: 'Großer Wiener Markt mit frischem Obst, Gemüse und internationalen Spezialitäten.',
    url: 'https://www.wien.gv.at/markt/flaechen/meidlingermarkt.html'
  },
  {
    name: 'Friedrichsplatz Markt',
    description: 'Wochenmarkt mit Bio-Produkten und Spezialitäten.',
    url: 'https://www.wien.gv.at/markt/flaechen/friedrichsplatz.html'
  }
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(8000, () => { req.destroy(); resolve(''); });
  });
}

async function main() {
  console.log('🏪 VIENNA MARKETS SCRAPER');
  console.log('=========================\n');
  
  const deals = [];
  
  // Market deals - known info
  const marketDeals = [
    {
      brand: 'Naschmarkt',
      logo: '🥬',
      title: 'Naschmarkt - Samstag Flohmarkt',
      description: 'Wiens berühmtester Markt. Antiquitäten, Kleidung, Musik. Flohmarkt jeden Samstag!',
      url: 'https://www.naschmarkt.at/'
    },
    {
      brand: 'Karmelitermarkt',
      logo: '🥕',
      title: 'Karmelitermarkt - Günstig einkaufen',
      description: 'Ältester Wiener Markt. Frische Produkte täglich. Am späten Nachmittag oft reduziert!',
      url: 'https://www.wien.gv.at/markt/flaechen/karmelitermarkt.html'
    },
    {
      brand: 'Brunnenmarkt',
      logo: '🧅',
      title: 'Brunnenmarkt - International',
      description: 'Einer der längsten Märkte Europas. Günstige Preise, internationale Spezialitäten.',
      url: 'https://www.wien.gv.at/markt/flaechen/brunnenmarkt.html'
    },
    {
      brand: 'Foodsharing Fairteiler',
      logo: '🍏',
      title: 'GRATIS Lebensmittel - Foodsharing',
      description: 'Fairteiler in ganz Wien! Lebensmittel gratis abholen oder abgeben. 100% kostenlos!',
      url: 'https://foodsharing.at/'
    },
    {
      brand: 'Wiener Tafel',
      logo: '🥫',
      title: 'GRATIS Lebensmittel - Wiener Tafel',
      description: 'Gerettete Lebensmittel kostenlos bei sozialen Ausgabestellen in Wien. Für Bedürftige.',
      url: 'https://www.wienertafel.at/'
    }
  ];
  
  for (const d of marketDeals) {
    const isGratis = d.title.toLowerCase().includes('gratis');
    
    deals.push({
      id: `market-${d.brand.toLowerCase().replace(/\s+/g, '-')}`,
      brand: d.brand,
      logo: d.logo,
      title: d.title,
      description: d.description,
      type: isGratis ? 'gratis' : 'rabatt',
      category: 'essen',
      source: 'Vienna Markets',
      url: d.url,
      expires: 'Täglich',
      distance: 'Wien',
      hot: isGratis,
      isNew: false,
      priority: isGratis ? 1 : 2,
      votes: 150,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`✅ Found ${deals.length} market deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/markets.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/markets.json');
}

main();
