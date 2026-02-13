// ============================================
// AGGRESSIVE GOOGLE PLACES SEARCH
// Searches for SPECIFIC deals: "1€ kebab", "gratis pizza", etc.
// ============================================

import https from 'https';
import fs from 'fs';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

// VERY specific search queries for REAL deals
const DEAL_QUERIES = [
  // Price-specific (the holy grail)
  '1€ kebab wien',
  '2€ kebab wien', 
  '1€ pizza wien',
  '2€ pizza wien',
  '1€ döner wien',
  '1,50€ kebab wien',
  '1,90€ kebab wien',
  
  // Free stuff
  'gratis essen wien',
  'gratis kebab wien',
  'gratis pizza wien',
  'gratis café wien',
  'kostenlos essen wien',
  
  // Opening deals
  'eröffnung angebot wien restaurant',
  'neueröffnung restaurant wien',
  'opening deal wien',
  
  // Cheap eats
  'günstig essen wien',
  'billig essen wien',
  '5€ essen wien'
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
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=48.2082,16.3738&radius=15000&key=${GOOGLE_PLACES_API_KEY}&language=de`;
  return fetchJSON(url);
}

function getLogo(name) {
  const n = name.toLowerCase();
  if (n.includes('kebab') || n.includes('döner') || n.includes('doner')) return '🥙';
  if (n.includes('pizza')) return '🍕';
  if (n.includes('burger')) return '🍔';
  if (n.includes('cafe') || n.includes('coffee') || n.includes('kaffee')) return '☕';
  if (n.includes('restaurant')) return '🍽️';
  if (n.includes('asia')) return '🥡';
  return '🏷️';
}

function extractDealType(query) {
  if (query.includes('gratis') || query.includes('kostenlos')) return 'gratis';
  if (query.includes('1€') || query.includes('1,')) return 'super-günstig';
  if (query.includes('2€') || query.includes('2,')) return 'günstig';
  return 'rabatt';
}

async function main() {
  console.log('🔥 AGGRESSIVE DEAL SEARCH - Vienna');
  console.log('==================================\n');
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('❌ GOOGLE_PLACES_API_KEY not set');
    process.exit(0);
  }

  const allDeals = [];
  const seen = new Set();
  
  for (const query of DEAL_QUERIES) {
    console.log(`🔍 "${query}"`);
    
    try {
      const results = await searchPlaces(query);
      const places = results.results || [];
      
      for (const place of places.slice(0, 5)) {
        if (seen.has(place.place_id)) continue;
        seen.add(place.place_id);
        
        const address = place.vicinity || place.formatted_address || 'Wien';
        const district = address.match(/(\d{4})\s*Wien/)?.[1] || '';
        
        // Extract the price/deal from the query
        const dealType = extractDealType(query);
        
        allDeals.push({
          id: `agg-${place.place_id.substring(0, 10)}`,
          brand: place.name,
          logo: getLogo(place.name),
          title: `${dealType === 'gratis' ? '🎁' : '🏷️'} ${place.name}`,
          description: `Gefunden bei Suche "${query}". ${address}. ${place.rating ? '⭐ ' + place.rating : ''} (${place.user_ratings_total || 0} Bewertungen)`,
          type: dealType,
          category: 'essen',
          source: 'Aggressive Search',
          url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          expires: 'Prüfen',
          distance: district ? `${district}. Bezirk` : 'Wien',
          hot: dealType === 'gratis',
          isNew: true,
          priority: dealType === 'gratis' ? 1 : 2,
          votes: place.user_ratings_total || 0,
          searchQuery: query,
          pubDate: new Date().toISOString()
        });
      }
      
      console.log(`   → ${places.length} places found`);
      
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }

  console.log(`\n🎉 Found ${allDeals.length} potential deals!`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/aggressive-search.json', JSON.stringify(allDeals, null, 2));
  console.log('💾 Saved to output/aggressive-search.json');
}

main().catch(console.error);
