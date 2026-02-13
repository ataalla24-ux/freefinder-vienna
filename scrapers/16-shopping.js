// ============================================
// GOOGLE SHOPPING & AMAZON DEALS
// Search for discounted products in Vienna
// ============================================

import https from 'https';
import fs from 'fs';

const GOOGLE_SHOPPING_QUERIES = [
  'kebab maschine preis',
  'pizzaofen preis',
  'gratis produkt',
  'gratis testen',
  'gratis probe',
  'günstig wien'
];

const AMAZON_DEALS = [
  'kebab',
  'pizza',
  'gratis',
  'deal'
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({}); }
      });
    });
    req.on('error', () => resolve({}));
    req.setTimeout(10000, () => { req.destroy(); resolve({}); });
  });
}

async function main() {
  console.log('🛒 GOOGLE SHOPPING + AMAZON');
  console.log('==============================\n');
  
  const deals = [];
  
  // Add known shopping deal sources
  const shoppingSources = [
    {
      brand: 'Amazon DE',
      logo: '📦',
      title: 'Amazon DE - Deals',
      description: 'Tägliche Deals und Blitzangebote bei Amazon Deutschland!',
      url: 'https://www.amazon.de/deals'
    },
    {
      brand: 'Amazon AT',
      logo: '📦',
      title: 'Amazon AT - Deals',
      description: 'Schnäppchen bei Amazon Österreich!',
      url: 'https://www.amazon.at/deals'
    },
    {
      brand: 'Google Shopping',
      logo: '🔍',
      title: 'Google Shopping Wien',
      description: 'Vergleiche Preise und finde Deals bei Google Shopping!',
      url: 'https://shopping.google.com'
    },
    {
      brand: 'Geizhals',
      logo: '💶',
      title: 'Geizhals - Preisvergleich',
      description: 'Der beste Preisvergleich für Technik in Österreich!',
      url: 'https://geizhals.at'
    },
    {
      brand: 'billiger.at',
      logo: '💰',
      title: 'billiger.at - Preisvergleich',
      description: 'Preisvergleich für Elektronik und mehr!',
      url: 'https://www.billiger.at'
    },
    {
      brand: 'Idealo',
      logo: '🏷️',
      title: 'Idealo - Preise vergleichen',
      description: 'Preise vergleichen und sparen!',
      url: 'https://www.idealo.at'
    }
  ];
  
  for (const s of shoppingSources) {
    deals.push({
      id: `shopping-${s.brand.toLowerCase().replace(/\s+/g, '-')}`,
      brand: s.brand,
      logo: s.logo,
      title: `${s.logo} ${s.title}`,
      description: s.description,
      type: 'rabatt',
      category: 'shopping',
      source: s.brand,
      url: s.url,
      expires: 'Täglich',
      distance: 'Online',
      hot: false,
      isNew: true,
      priority: 2,
      votes: 50,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`🛒 Found ${deals.length} shopping deal sources`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/shopping.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/shopping.json');
}

main();
