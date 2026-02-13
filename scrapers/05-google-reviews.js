// ============================================
// 5. GOOGLE MAPS REVIEWS PARSER
// Search places + parse reviews for deal keywords
// ============================================

import https from 'https';
import fs from 'fs';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

// Search terms that might have deals
const DEAL_SEARCH_TERMS = [
  'kebab wien',
  'pizza wien', 
  'burger wien',
  'cafe wien',
  'restaurant wien'
];

// Keywords that indicate deals in reviews
const REVIEW_DEAL_KEYWORDS = [
  'gratis',
  'kostenlos',
  'eröffnung',
  'aktion',
  '1€',
  '2€',
  '3€',
  '5€',
  'rabatt',
  'geschenk',
  'umsonst'
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

function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}&language=de`;
  return fetchJSON(url);
}

async function searchPlaces(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=48.2082,16.3738&radius=10000&key=${GOOGLE_PLACES_API_KEY}&language=de`;
  return fetchJSON(url);
}

function checkReviewsForDeals(reviews) {
  const deals = [];
  
  for (const review of reviews.slice(0, 5)) {
    const text = review.text.toLowerCase();
    const hasKeyword = REVIEW_DEAL_KEYWORDS.some(k => text.includes(k));
    
    if (hasKeyword) {
      // Extract the relevant sentence
      const sentences = review.text.split(/[.!?]/);
      for (const sent of sentences) {
        if (REVIEW_DEAL_KEYWORDS.some(k => sent.toLowerCase().includes(k))) {
          deals.push(sent.trim());
          break;
        }
      }
    }
  }
  
  return deals;
}

async function main() {
  console.log('🗣️ GOOGLE REVIEWS DEAL FINDER');
  console.log('=============================\n');
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('❌ GOOGLE_PLACES_API_KEY not set');
    process.exit(0);
  }
  
  const deals = [];
  
  for (const term of DEAL_SEARCH_TERMS) {
    console.log(`🔍 Searching: "${term}"`);
    
    try {
      const results = await searchPlaces(term);
      
      for (const place of results.results?.slice(0, 10) || []) {
        console.log(`   Checking: ${place.name}`);
        
        const details = await getPlaceDetails(place.place_id);
        const reviewDeals = checkReviewsForDeals(details.result?.reviews || []);
        
        if (reviewDeals.length > 0) {
          const address = details.result?.formatted_address || place.formatted_address || '';
          
          deals.push({
            id: `review-${place.place_id.substring(0, 10)}`,
            brand: place.name,
            logo: '⭐',
            title: `⭐ ${place.name}`,
            description: `Deal gefunden in Reviews: ${reviewDeals[0].substring(0, 100)}`,
            type: 'gratis',
            category: 'essen',
            source: 'Google Reviews',
            url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            expires: 'Prüfen',
            distance: address.split(',')[0] || 'Wien',
            hot: true,
            isNew: true,
            priority: 2,
            votes: place.user_ratings_total || 0,
            pubDate: new Date().toISOString()
          });
          
          console.log(`   ✅ DEAL: ${reviewDeals[0].substring(0, 50)}...`);
        }
      }
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  
  console.log(`\n✅ Found ${deals.length} deals from reviews`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/google-reviews.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/google-reviews.json');
}

main().catch(console.error);
