// ============================================
// INSTAGRAM HASHTAG SCRAPER - Simple Version
// Try fewer hashtags, more focused
// ============================================

import https from 'https';
import fs from 'fs';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || '';

// Only TOP 3 hashtags - less likely to hit rate limits
const HASHTAGS = [
  'gratiswien',
  'wienisst', 
  'neueröffnungwien'
];

const DEAL_KEYWORDS = ['gratis', 'kostenlos', '1€', '2€', 'aktion', 'eröffnung'];
const FOOD_KEYWORDS = ['kebab', 'pizza', 'burger', 'coffee', 'essen', 'food'];

function apifyRequest(url, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${APIFY_API_TOKEN}` },
      timeout: 90000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    });
    req.on('error', () => resolve({}));
    req.setTimeout(90000, () => { req.destroy(); resolve({}); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function isDeal(caption) {
  if (!caption) return false;
  const c = caption.toLowerCase();
  return DEAL_KEYWORDS.some(k => c.includes(k)) && FOOD_KEYWORDS.some(f => c.includes(f));
}

function getLogo(caption) {
  const c = (caption || '').toLowerCase();
  if (c.includes('kebab') || c.includes('döner')) return '🥙';
  if (c.includes('pizza')) return '🍕';
  if (c.includes('burger')) return '🍔';
  if (c.includes('coffee') || c.includes('kaffee')) return '☕';
  return '🎁';
}

async function main() {
  console.log('📸 INSTAGRAM SCRAPER (Simple)\n');
  
  if (!APIFY_API_TOKEN) { console.log('❌ No token'); return; }
  
  const deals = [];
  
  for (const tag of HASHTAGS) {
    console.log(`🔍 #${tag}...`);
    
    try {
      // Use Instagram Hashtag Scraper actor
      const start = await apifyRequest(
        `https://api.apify.com/v2/acts/apify/instagram-hashtag-scraper/runs?token=${APIFY_API_TOKEN}`,
        'POST',
        { hashtags: [tag], resultsPerHashtag: 15 }
      );
      
      if (!start.data?.id) { console.log(`   ❌ Can't start`); continue; }
      
      const runId = start.data.id;
      
      // Wait for result
      for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 8000));
        const status = await apifyRequest(
          `https://api.apify.com/v2/acts/apify/instagram-hashtag-scraper/runs/${runId}?token=${APIFY_API_TOKEN}`
        );
        
        if (status.data?.status === 'SUCCEEDED') {
          const data = await apifyRequest(
            `https://api.apify.com/v2/datasets/${status.data.defaultDatasetId}/items?token=${APIFY_API_TOKEN}&limit=30`
          );
          
          for (const post of data || []) {
            const caption = post.caption || '';
            if (isDeal(caption)) {
              deals.push({
                id: `ig-${post.shortCode || Date.now()}`,
                brand: post.ownerUsername || 'IG',
                logo: getLogo(caption),
                title: `${getLogo(caption)} @${post.ownerUsername}`,
                description: caption.substring(0, 150),
                type: 'gratis',
                category: 'essen',
                source: 'Instagram',
                url: post.url || `https://instagram.com/p/${post.shortCode}`,
                expires: 'Begrenzt',
                distance: 'Wien',
                hot: true,
                priority: 1,
                votes: post.likesCount || 0,
                pubDate: new Date().toISOString()
              });
            }
          }
          console.log(`   ✅ Found ${data?.length || 0} posts`);
          break;
        }
      }
    } catch (e) { console.log(`   ❌ ${e.message}`); }
    
    await new Promise(r => setTimeout(r, 5000));
  }
  
  console.log(`\n📸 Total: ${deals.length} deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/instagram-real.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved');
}

main();
