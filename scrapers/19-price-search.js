// ============================================
// PRECISe PRICE SEARCH
// Only finds places with SPECIFIC prices in name
// Like: "1€ Kebab", "2€ Pizza"
// ============================================

import https from 'https';
import fs from 'fs';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

// EXACT price queries - these MUST find real deals
const PRICE_QUERIES = [
  // The holy grail - specific prices
  '"1€ kebab" wien',
  '"1€ pizza" wien',
  '"2€ kebab" wien',
  '"2€ pizza" wien',
  '"1,50€" wien',
  '"1,90€" wien',
  '"2,50€" wien',
  '"3€" wien essen',
  
  // Opening specific
  '"eröffnung" "gratis" wien',
  '"gratis" "probieren" wien',
  '"1+1 gratis" wien',
  
  // Specific cheap eats
  '"1 euro" kebab wien',
  '"2 euro" pizza wien',
  '"billig" essen wien',
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function searchPlaces(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=48.2082,16.3738&radius=10000&key=${GOOGLE_PLACES_API_KEY}&language=de`;
  return fetchJSON(url);
}

function getLogo(name) {
  const n = name.toLowerCase();
  if (n.includes('kebab') || n.includes('döner')) return '🥙';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger')) return '🍔';
  if (n.includes('cafe') || n.includes('coffee')) return '☕';
  return '🏷️';
}

function extractPrice(query) {
  const match = query.match(/"([^"]+)"/);
  return match ? match[1] : query;
}

async function main() {
  console.log('💶 PRECISE PRICE SEARCH');
  console.log('==========================\n');
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('❌ GOOGLE_PLACES_API_KEY not set');
    process.exit(0);
  }

  const deals = [];
  const seen = new Set();
  
  for (const query of PRICE_QUERIES) {
    console.log(`🔍 "${query}"`);
    
    try {
      const results = await searchPlaces(query);
      const places = results.results || [];
      
      for (const place of places.slice(0, 3)) {
        if (seen.has(place.place_id)) continue;
        seen.add(place.place_id);
        
        const address = place.vicinity || place.formatted_address || 'Wien';
        
        deals.push({
          id: `price-${place.place_id.substring(0, 10)}`,
          brand: place.name,
          logo: getLogo(place.name),
          title: `💶 ${place.name}`,
          description: `Gefunden bei Suche: "${query}". ${address}. ⭐ ${place.rating || 'N/A'}`,
          type: query.includes('gratis') ? 'gratis' : 'super-günstig',
          category: 'essen',
          source: 'Price Search',
          url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          expires: 'Anrufen & Bestätigen',
          distance: address.split(',')[0] || 'Wien',
          hot: true,
          isNew: true,
          priority: 1,
          votes: place.user_ratings_total || 0,
          searchQuery: query,
          pubDate: new Date().toISOString()
        });
      }
      
      console.log(`   → ${places.length} results`);
      
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }

  console.log(`\n💶 Found ${deals.length} precise price deals!`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/price-search.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/price-search.json');
}

main().catch(console.error);
