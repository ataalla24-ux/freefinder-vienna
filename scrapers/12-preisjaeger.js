// ============================================
// PREISJÄGER SCRAPER - More Categories
// More aggressive scraping of deal categories
// ============================================

import https from 'https';
import fs from 'fs';

// More Preisjaeger RSS feeds
const PREISJAEGER_FEEDS = [
  { name: 'Gratis', url: 'https://www.preisjaeger.at/rss/gruppe/gratisartikel', category: 'gratis' },
  { name: 'Wien', url: 'https://www.preisjaeger.at/rss/gruppe/lokal', category: 'wien' },
  { name: 'Elektronik', url: 'https://www.preisjaeger.at/rss/gruppe/elektronik', category: 'technik' },
  { name: 'Reisen', url: 'https://www.preisjaeger.at/rss/gruppe/reisen', category: 'reisen' },
  { name: 'Essen', url: 'https://www.preisjaeger.at/rss/gruppe/essen-trinken', category: 'essen' },
  { name: 'Fashion', url: 'https://www.preisjaeger.at/rss/gruppe/mode', category: 'mode' },
];

function fetchXML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
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

function parseRSS(xml, source) {
  const deals = [];
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];
  
  for (const item of items.slice(0, 15)) { // More items per feed
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const pubMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    
    if (titleMatch && linkMatch) {
      let title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      const link = linkMatch[1].trim();
      let desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      desc = desc.substring(0, 150);
      
      // Check if it's relevant to Vienna or Austria
      const text = (title + ' ' + desc).toLowerCase();
      const isVienna = text.includes('wien') || text.includes('österreich') || text.includes('austria');
      const isGratis = text.includes('gratis') || text.includes('kostenlos') || text.includes('0€');
      
      // Get logo based on category
      let logo = '🏷️';
      if (text.includes('pizza') || text.includes('kebab') || text.includes('essen')) logo = '🍕';
      if (text.includes('hotel') || text.includes('reise') || text.includes('urlaub')) logo = '✈️';
      if (text.includes('handy') || text.includes('tech') || text.includes('elektronik')) logo = '📱';
      if (text.includes('fashion') || text.includes('kleidung')) logo = '👕';
      if (isGratis) logo = '🎁';
      
      deals.push({
        id: `pj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        brand: 'Preisjäger',
        logo: logo,
        title: title.substring(0, 70),
        description: desc || `Deal von Preisjäger: ${title.substring(0, 50)}`,
        type: isGratis ? 'gratis' : 'rabatt',
        category: source.category,
        source: `Preisjäger: ${source.name}`,
        url: link,
        expires: 'Siehe Link',
        distance: isVienna ? 'Wien' : 'Österreich',
        hot: isGratis,
        isNew: true,
        priority: isGratis ? 1 : 2,
        votes: 100,
        pubDate: pubMatch ? pubMatch[1] : new Date().toISOString()
      });
    }
  }
  return deals;
}

async function main() {
  console.log('💰 PREISJÄGER SCRAPER - More Categories');
  console.log('========================================\n');
  
  const allDeals = [];
  
  for (const feed of PREISJAEGER_FEEDS) {
    console.log(`📥 Fetching ${feed.name}...`);
    
    try {
      const xml = await fetchXML(feed.url);
      const deals = parseRSS(xml, feed);
      allDeals.push(...deals);
      console.log(`   → ${deals.length} deals`);
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  
  console.log(`\n💰 Total: ${allDeals.length} Preisjäger deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/preisjaeger.json', JSON.stringify(allDeals, null, 2));
  console.log('💾 Saved to output/preisjaeger.json');
}

main();
