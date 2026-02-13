// ============================================
// 2. JÖ CLUB SCRAPER
// Real-time offers from Austrian chains
// BILLA, OMV, BIPA, etc.
// ============================================

import https from 'https';
import fs from 'fs';

const JÖ_URL = 'https://www.jo-club.at/aktionen';

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'de-AT,de;q=0.9'
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

function extractDeals(html) {
  const deals = [];
  
  // Patterns for jö deals
  const dealPatterns = [
    /(\d+)\s*jö\s*Punkte.*?(gratis|kostenlos)/gi,
    /gratis.*?(\d+)\s*jö/gi,
    /(\d+)\s*€.*?(gratis|kostenlos)/gi
  ];
  
  // Extract deal-like sections
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  
  // Known jö partners
  const partners = [
    { brand: 'BILLA', logo: '🛒' },
    { brand: 'OMV', logo: '⛽' },
    { brand: 'BIPA', logo: '💄' },
    { brand: 'NORM', logo: '🛒' },
    { brand: 'Spar', logo: '🛒' },
    { brand: 'Shell', logo: '⛽' }
  ];
  
  for (const partner of partners) {
    if (text.toLowerCase().includes(partner.brand.toLowerCase())) {
      deals.push({
        id: `jo-${partner.brand.toLowerCase()}-${Date.now()}`,
        brand: partner.brand,
        logo: partner.logo,
        title: `jö: ${partner.brand} Aktion`,
        description: `Aktuelle jö Club Punkte-Angebote bei ${partner.brand}`,
        type: 'rabatt',
        category: 'essen',
        source: 'jö Club',
        url: JÖ_URL,
        expires: 'Siehe App',
        distance: 'Wien',
        hot: true,
        isNew: true,
        priority: 1,
        votes: 100,
        pubDate: new Date().toISOString()
      });
    }
  }
  
  return deals;
}

async function main() {
  console.log('🎫 JÖ CLUB SCRAPER');
  console.log('====================\n');
  
  try {
    const html = await fetchHTML(JÖ_URL);
    const deals = extractDeals(html);
    
    console.log(`✅ Found ${deals.length} jö deals`);
    
    fs.mkdirSync('output', { recursive: true });
    fs.writeFileSync('output/jo-club.json', JSON.stringify(deals, null, 2));
    console.log('💾 Saved to output/jo-club.json');
    
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
  }
}

main();
