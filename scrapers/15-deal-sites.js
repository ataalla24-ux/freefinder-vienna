// ============================================
// DAILY DEAL SITES AUSTRIA
// Scrape multiple Austrian deal sites
// ============================================

import https from 'https';
import fs from 'fs';

const DEAL_SITES = [
  // Austrian deal forums and sites
  { name: 'Gutscheine.at', url: 'https://www.gutscheine.at/', category: 'gutscheine' },
  { name: 'Coupons.at', url: 'https://www.coupons.at/', category: 'coupons' },
  { name: 'Sparalarm', url: 'https://www.sparalarm.at/', category: 'supermarkt' },
  { name: 'MeinProspekt', url: 'https://www.meinprospekt.at/', category: 'prospekte' },
  { name: 'Marktplatz', url: 'https://www.marktplatz.at/', category: 'kleinanzeigen' },
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
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

function extractDeals(html, source) {
  const deals = [];
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  
  // Look for deal-like patterns
  const patterns = [
    /gratis/gi,
    /kostenlos/gi,
    /%\s*(rabatt|sparen)/gi,
    /aktion/gi,
    /angebot/gi
  ];
  
  // Add as a source (actual scraping would need site-specific parsing)
  deals.push({
    id: `dealsite-${source.name.toLowerCase().replace(/\s+/g, '-')}`,
    brand: source.name,
    logo: '🏷️',
    title: `${source.name} - ${source.category}`,
    description: `Aktuelle Deals und Rabatte bei ${source.name}`,
    type: 'rabatt',
    category: source.category,
    source: source.name,
    url: source.url,
    expires: 'Täglich aktualisiert',
    distance: 'Österreich',
    hot: false,
    isNew: true,
    priority: 2,
    votes: 50,
    pubDate: new Date().toISOString()
  });
  
  return deals;
}

async function main() {
  console.log('🏷️ AUSTRIAN DEAL SITES');
  console.log('========================\n');
  
  const allDeals = [];
  
  for (const site of DEAL_SITES) {
    console.log(`📥 ${site.name}...`);
    
    try {
      const html = await fetchHTML(site.url);
      const deals = extractDeals(html, site);
      allDeals.push(...deals);
      console.log(`   → Added ${deals.length} source`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  
  console.log(`\n🏷️ Total: ${allDeals.length} deal sites`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/deal-sites.json', JSON.stringify(allDeals, null, 2));
  console.log('💾 Saved to output/deal-sites.json');
}

main();
