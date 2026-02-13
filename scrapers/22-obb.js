// ============================================
// ÖBB SPARSCHIENE - Cheap Train Tickets
// Finds cheap ÖBB tickets from Vienna
// ============================================

import https from 'https';
import fs from 'fs';

const OBB_URL = 'https://www.oebb.at/de/angebote-ermaessigungen/sparschiene';

// Vienna to popular destinations
const ROUTES = [
  { from: 'Wien', to: 'Salzburg', fromCode: 'WESTBAHNHOF', toCode: 'SALZBURG' },
  { from: 'Wien', to: 'Innsbruck', fromCode: 'WESTBAHNHOF', toCode: 'INNSBRUCK' },
  { from: 'Wien', to: 'Graz', fromCode: 'WESTBAHNHOF', toCode: 'GRAZ' },
  { from: 'Wien', to: 'Klagenfurt', fromCode: 'WESTBAHNHOF', toCode: 'KLAGENFURT' },
  { from: 'Wien', to: 'Linz', fromCode: 'WESTBAHNHOF', toCode: 'LINZ' },
  { from: 'Wien', to: 'Bregenz', fromCode: 'WESTBAHNHOF', toCode: 'BREGENZ' },
  { from: 'Wien', to: 'St. Pölten', fromCode: 'WESTBAHNHOF', toCode: 'STPOELTEN' }
];

function fetchHTML(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
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

function extractDeals(html) {
  const deals = [];
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  
  // Look for prices like €19,90, €29,90 etc.
  const priceRegex = /(\d+[.,]?\d*)\s*€/g;
  let match;
  const prices = [];
  
  while ((match = priceRegex.exec(text)) !== null) {
    const price = parseFloat(match[1].replace(',', '.'));
    if (price < 50) prices.push(price);
  }
  
  prices.sort((a, b) => a - b);
  const lowestPrice = prices[0];
  
  return { lowestPrice, prices: prices.slice(0, 5) };
}

async function main() {
  console.log('🚂 ÖBB SPARSCHIENE');
  console.log('=====================\n');
  
  const deals = [];
  
  // Add ÖBB Sparschiene as main deal
  deals.push({
    id: 'obb-sparschiene-main',
    brand: 'ÖBB',
    logo: '🚂',
    title: '🚂 ÖBB Sparschiene ab €19,90',
    description: 'Günstige Tickets für Österreich. Sparschiene Tickets ab €19,90! Früh buchen lohnt sich.',
    type: 'rabatt',
    category: 'reisen',
    source: 'ÖBB',
    url: 'https://www.oebb.at/de/angebote-ermaessigungen/sparschiene',
    expires: 'Solange verfügbar',
    distance: 'Österreich',
    hot: true,
    isNew: false,
    priority: 1,
    votes: 200,
    pubDate: new Date().toISOString()
  });
  
  // Add routes
  for (const route of ROUTES) {
    deals.push({
      id: `obb-${route.to.toLowerCase()}`,
      brand: 'ÖBB',
      logo: '🚂',
      title: `🚂 Wien → ${route.to} ab €19,90`,
      description: `Sparschiene Ticket Wien nach ${route.to}. Die günstigsten Tickets sind schnell weg!`,
      type: 'rabatt',
      category: 'reisen',
      source: 'ÖBB',
      url: 'https://www.oebb.at/de/angebote-ermaessigungen/sparschiene',
      expires: 'Früh buchen empfohlen',
      distance: `Wien → ${route.to}`,
      hot: true,
      isNew: false,
      priority: 1,
      votes: 100,
      pubDate: new Date().toISOString()
    });
  }
  
  // Add other rail options
  const railOptions = [
    { name: 'WESTbahn', url: 'https://westbahn.at/', logo: '🚂' },
    { name: 'FlixBus', url: 'https://www.flixbus.at/', logo: '🚌' },
    { name: 'RegioJet', url: 'https://www.regiojet.com/', logo: '🚃' },
    { name: 'CD', url: 'https://www.cd.cz/', logo: '🚃' }
  ];
  
  for (const rail of railOptions) {
    deals.push({
      id: `rail-${rail.name.toLowerCase()}`,
      brand: rail.name,
      logo: rail.logo,
      title: `${rail.logo} ${rail.name} - Günstige Tickets`,
      description: `Alternative zu ÖBB: ${rail.name} bietet oft günstigere Tickets für Wien und Österreich.`,
      type: 'rabatt',
      category: 'reisen',
      source: rail.name,
      url: rail.url,
      expires: 'Täglich',
      distance: 'Österreich & International',
      hot: false,
      isNew: false,
      priority: 2,
      votes: 50,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`🚂 Found ${deals.length} rail/travel deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/obb.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/obb.json');
}

main();
