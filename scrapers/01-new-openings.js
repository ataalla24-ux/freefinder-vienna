// ============================================
// 1. NEW OPENINGS RADAR
// Finds newly opened restaurants in Vienna
// They ALWAYS have opening deals
// ============================================

import https from 'https';
import fs from 'fs';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

const WIEN_CENTER = '48.2082,16.3738';
const RADIUS = 15000; // 15km around Vienna

// Search queries for new openings
const OPENING_QUERIES = [
  'neu eröffnung restaurant wien',
  'new restaurant vienna',
  'neues café wien',
  'neuimbau restaurant wien',
  'grand opening wien'
];

// Must have deal-like keywords in name or reviews
const DEAL_KEYWORDS = [
  'gratis', 'kostenlos', 'free', '1€', '2€', '3€', '5€',
  'eröffnung', 'opening', 'aktion', 'rabatt', 'sALE'
];

async function fetchPlaces(query) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${WIEN_CENTER}&radius=${RADIUS}&key=${GOOGLE_PLACES_API_KEY}&language=de`;
    
    const req = https.get(url, { timeout: 10000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results || []);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function getPlaceReviews(placeId) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}&language=de`;
    
    const req = https.get(url, { timeout: 10000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.result?.reviews || []);
        } catch (e) { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(10000, () => { req.destroy(); resolve([]); });
  });
}

async function main() {
  console.log('🎯 NEW OPENINGS RADAR - Vienna');
  console.log('==============================\n');
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('❌ GOOGLE_PLACES_API_KEY not set');
    process.exit(0);
  }

  const allPlaces = new Map();
  
  // Search for new openings
  for (const query of OPENING_QUERIES) {
    console.log(`🔍 Searching: "${query}"`);
    const places = await fetchPlaces(query);
    
    for (const place of places) {
      const ratings = place.user_ratings_total || 0;
      // New places typically have few ratings
      if (ratings < 50 && !allPlaces.has(place.place_id)) {
        allPlaces.set(place.place_id, place);
      }
    }
    console.log(`   → Found ${places.length} places (${allPlaces.size} new total)`);
  }

  console.log(`\n📍 Checking ${allPlaces.size} potential new openings for deals...\n`);

  const deals = [];
  
  for (const [placeId, place] of allPlaces) {
    const name = place.name.toLowerCase();
    const hasDealKeyword = DEAL_KEYWORDS.some(k => name.includes(k.toLowerCase()));
    
    // Check reviews for deal keywords
    let hasReviewDeal = false;
    if (!hasDealKeyword) {
      const reviews = await getPlaceReviews(placeId);
      const reviewText = reviews.map(r => r.text).join(' ').toLowerCase();
      hasReviewDeal = DEAL_KEYWORDS.some(k => reviewText.includes(k.toLowerCase()));
    }
    
    if (hasDealKeyword || hasReviewDeal) {
      const address = place.vicinity || place.formatted_address || 'Wien';
      const district = address.match(/(\d{4})\s*Wien/)?.[1] || '';
      
      deals.push({
        id: `opening-${place.place_id.substring(0, 10)}`,
        brand: place.name,
        logo: '🆕',
        title: `🆕 NEU: ${place.name}`,
        description: `${address}. ${hasDealKeyword ? 'Deal im Namen!' : 'Deal in Reviews gefunden!'}`,
        type: 'gratis',
        category: 'essen',
        source: 'New Openings Radar',
        url: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
        expires: 'Eröffnungswochen',
        distance: district ? `${district}. Bezirk` : 'Wien',
        hot: true,
        isNew: true,
        priority: 1,
        votes: place.user_ratings_total || 0,
        pubDate: new Date().toISOString()
      });
      console.log(`✅ ${place.name} - DEAL FOUND!`);
    }
  }

  console.log(`\n🎉 Found ${deals.length} deals from new openings!`);
  
  // Save to file (will be merged by main scraper)
  fs.writeFileSync('output/new-openings.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/new-openings.json');
}

main().catch(console.error);
