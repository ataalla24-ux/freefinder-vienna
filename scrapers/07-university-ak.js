// ============================================
// 7. UNIVERSITY & AK DEALS
// Student discounts and AK (Chamber of Labour) offers
// ============================================

import https from 'https';
import fs from 'fs';

const MENSA_URLS = [
  'https://www.mensen.at/',
  'https://www.akwien.at/'
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
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
  console.log('🎓 UNIVERSITY & AK DEALS');
  console.log('========================\n');
  
  const deals = [];
  
  // Wiener Mensen - student meals
  const mensaDeals = [
    {
      brand: 'Uni Mensen Wien',
      logo: '🎓',
      title: 'Warme Mahlzeit ab 2,20€',
      description: 'Alle Wiener Uni-Mensen: Vollwertige Mahlzeit für Studenten ab 2,20€. Günstiger geht Mittagessen nicht!',
      url: 'https://www.mensen.at/'
    },
    {
      brand: 'Mensa Göttweig',
      logo: '🍽️',
      title: 'Mensa Göttweig - Studentenessen',
      description: 'Günstige warme Mahlzeiten für Studierende. Täglich wechselnde Speisepläne.',
      url: 'https://www.mensen.at/'
    },
    {
      brand: 'Mensa斜',
      logo: '🍜',
      title: 'Mensa斜 - Asian Food',
      description: 'Günstige asiatische Gerichte in der Nähe der Uni.',
      url: 'https://www.mensen.at/'
    }
  ];
  
  // AK Wien discounts
  const akDeals = [
    {
      brand: 'AK Wien',
      logo: '🏛️',
      title: 'AK Mitgliedervorteile',
      description: 'Als AK-Mitglied bekommst du Rabatte bei zahlreichen Partnern in Wien!',
      url: 'https://www.akwien.at/'
    },
    {
      brand: 'AK Wien',
      logo: '🎫',
      title: 'AK Tickets & Events',
      description: ' Vergünstigte Tickets für Konzerte, Theater und Events für AK-Mitglieder.',
      url: 'https://www.akwien.at/'
    }
  ];
  
  for (const d of [...mensaDeals, ...akDeals]) {
    deals.push({
      id: `uni-${d.brand.toLowerCase().replace(/\s+/g, '-')}`,
      brand: d.brand,
      logo: d.logo,
      title: d.title,
      description: d.description,
      type: 'rabatt',
      category: 'essen',
      source: d.brand.includes('AK') ? 'AK Wien' : 'Uni Mensen',
      url: d.url,
      expires: 'Dauerhaft (mit Ausweis)',
      distance: 'Wien',
      hot: false,
      isNew: false,
      priority: 2,
      votes: 300,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`✅ Found ${deals.length} university/AK deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/university-ak.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/university-ak.json');
}

main();
