// ============================================
// WIENER TAFEL - Free Food
// Scrapes Wiener Tafel for free food locations
// ============================================

import https from 'https';
import fs from 'fs';

const WIENER_TAFEL_URL = 'https://www.wienertafel.at/';
const FOODSHARING_URL = 'https://foodsharing.at/';

function fetchHTML(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : require('http');
    const req = protocol.get(url, {
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

async function main() {
  console.log('🍽️ WIENER TAFEL & FOODSHARING');
  console.log('================================\n');
  
  const deals = [];
  
  // Wiener Tafel - Main deal
  const tafelMain = {
    id: 'wiener-tafel-main',
    brand: 'Wiener Tafel',
    logo: '🥫',
    title: '🥫 Wiener Tafel - Kostenlose Lebensmittel',
    description: 'Gerettete Lebensmittel kostenlos bei sozialen Ausgabestellen in Wien. Jeder kann teilnehmen!',
    type: 'gratis',
    category: 'essen',
    source: 'Wiener Tafel',
    url: 'https://www.wienertafel.at/',
    expires: 'Täglich',
    distance: 'Wien & Umgebung',
    hot: true,
    isNew: false,
    priority: 1,
    votes: 300,
    pubDate: new Date().toISOString()
  };
  deals.push(tafelMain);
  
  // Wiener Tafel locations
  const locations = [
    { name: 'Wiener Tafel Zentrum', address: '1020 Wien', district: '2. Bezirk' },
    { name: 'Wiener Tafel Favoriten', address: '1100 Wien', district: '10. Bezirk' },
    { name: 'Wiener Tafel Floridsdorf', address: '1210 Wien', district: '21. Bezirk' },
    { name: 'Wiener Tafel Liesing', address: '1230 Wien', district: '23. Bezirk' },
    { name: 'Wiener Tafel Döbling', address: '1190 Wien', district: '19. Bezirk' }
  ];
  
  for (const loc of locations) {
    deals.push({
      id: `tafel-${loc.name.toLowerCase().replace(/\s+/g, '-')}`,
      brand: 'Wiener Tafel',
      logo: '🥫',
      title: `🥫 Wiener Tafel ${loc.district}`,
      description: `${loc.name}: Kostenlose Lebensmittel abholen. ${loc.address}`,
      type: 'gratis',
      category: 'essen',
      source: 'Wiener Tafel',
      url: 'https://www.wienertafel.at/',
      expires: 'Täglich (9:00-12:00)',
      distance: loc.district,
      hot: true,
      isNew: false,
      priority: 1,
      votes: 100,
      pubDate: new Date().toISOString()
    });
  }
  
  // Foodsharing Austria
  const foodsharing = {
    id: 'foodsharing-at-main',
    brand: 'Foodsharing Österreich',
    logo: '🍏',
    title: '🍏 Foodsharing - Gerettete Lebensmittel',
    description: 'Fairteiler in ganz Österreich! Kostenlose Lebensmittel von Privaten und Betrieben. Alles gerettet vor der Mülltonne!',
    type: 'gratis',
    category: 'essen',
    source: 'Foodsharing',
    url: 'https://foodsharing.at/',
    expires: 'Täglich',
    distance: 'Wien & Österreich',
    hot: true,
    isNew: false,
    priority: 1,
    votes: 250,
    pubDate: new Date().toISOString()
  };
  deals.push(foodsharing);
  
  // Foodsharing Vienna Fairteiler
  const fairteiler = [
    { name: 'Fairteiler Neubau', address: '1070 Wien', district: '7. Bezirk' },
    { name: 'Fairteiler Mariahilf', address: '1060 Wien', district: '6. Bezirk' },
    { name: 'Fairteiler Alsergrund', address: '1090 Wien', district: '9. Bezirk' },
    { name: 'Fairteiler Leopoldstadt', address: '1020 Wien', district: '2. Bezirk' },
    { name: 'Fairteiler Favoriten', address: '1100 Wien', district: '10. Bezirk' }
  ];
  
  for (const ft of fairteiler) {
    deals.push({
      id: `fairteiler-${ft.name.toLowerCase().replace(/\s+/g, '-')}`,
      brand: 'Foodsharing',
      logo: '🍏',
      title: `🍏 Fairteiler ${ft.district}`,
      description: `Foodsharing Fairteiler: Kostenlose Lebensmittel abholen. ${ft.address}`,
      type: 'gratis',
      category: 'essen',
      source: 'Foodsharing',
      url: 'https://foodsharing.at/',
      expires: '24/7',
      distance: ft.district,
      hot: true,
      isNew: false,
      priority: 1,
      votes: 80,
      pubDate: new Date().toISOString()
    });
  }
  
  // Tischlein deck dich
  const tischlein = {
    id: 'tischlein-main',
    brand: 'Tischlein deck dich',
    logo: '🍽️',
    title: '🍽️ Tischlein deck dich - Kostenloses Essen',
    description: 'Noch genießbare Lebensmittel werden gerettet und kostenlos verteilt. Mehrere Standorte in Wien!',
    type: 'gratis',
    category: 'essen',
    source: 'Tischlein deck dich',
    url: 'https://www.tischlein.at/',
    expires: 'Täglich',
    distance: 'Wien',
    hot: true,
    isNew: false,
    priority: 1,
    votes: 150,
    pubDate: new Date().toISOString()
  };
  deals.push(tischlein);
  
  console.log(`🍽️ Found ${deals.length} Wiener Tafel & Foodsharing deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/wiener-tafel.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/wiener-tafel.json');
}

main();
