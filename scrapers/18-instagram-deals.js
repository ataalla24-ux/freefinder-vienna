// ============================================
// INSTAGRAM HASHTAG SCRAPER - Using Apify
// Scrapes TOP posts from Vienna deal hashtags
// ============================================

import https from 'https';
import fs from 'fs';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || '';

// Top Vienna deal hashtags
const HASHTAGS = [
  'gratiswien',
  'gratisessenwien',
  'wiengratis',
  'kostenloswien',
  'neueröffnungwien',
  'wienisst',
  'kebabwien',
  'pizzawien',
  'burgerwien',
  'wienfood'
];

// Keywords that indicate a REAL deal
const DEAL_KEYWORDS = [
  'gratis', 'kostenlos', '0€', 'free',
  '1€', '2€', '3€', '4€', '5€',
  'aktion', 'rabatt', 'eröffnung', 'deal'
];

const FOOD_KEYWORDS = [
  'kebab', 'pizza', 'burger', 'coffee', 'kaffee', 'essen',
  'döner', 'sushi', 'eis', 'cafe', 'restaurant', 'food',
  'dürüm', 'wrap', 'falafel', 'salat', 'noodle'
];

function apifyRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_TOKEN}`
      },
      timeout: 60000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({});
        }
      });
    });
    req.on('error', (e) => resolve({}));
    req.setTimeout(60000, () => { req.destroy(); resolve({}); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function isDealPost(caption) {
  if (!caption) return false;
  const c = caption.toLowerCase();
  const hasDeal = DEAL_KEYWORDS.some(k => c.includes(k));
  const hasFood = FOOD_KEYWORDS.some(f => c.includes(f));
  return hasDeal && hasFood;
}

function getLogo(caption) {
  const c = caption?.toLowerCase() || '';
  if (c.includes('kebab') || c.includes('döner')) return '🥙';
  if (c.includes('pizza')) return '🍕';
  if (c.includes('burger')) return '🍔';
  if (c.includes('coffee') || c.includes('kaffee')) return '☕';
  if (c.includes('eis')) return '🍦';
  if (c.includes('sushi')) return '🍣';
  return '🎁';
}

async function scrapeHashtag(hashtag) {
  console.log(`🔍 #${hashtag}...`);
  
  try {
    // Use Apify's generic Instagram scraper - different actor
    const actorId = 'apify/instagram-scraper';
    
    // Start the actor
    const startUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_API_TOKEN}`;
    
    const startResult = await apifyRequest(startUrl, 'POST', {
      directUrls: [`https://www.instagram.com/explore/tags/${hashtag}/`],
      resultsPerPage: 20
    });
    
    if (!startResult.data?.id) {
      console.log(`   ❌ Could not start`);
      return [];
    }
    
    const runId = startResult.data.id;
    
    // Wait for completion (max 2 min)
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 10000));
      
      const statusUrl = `https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${APIFY_API_TOKEN}`;
      const status = await apifyRequest(statusUrl);
      
      if (status.data?.status === 'SUCCEEDED') {
        // Get the data
        const datasetId = status.data.defaultDatasetId;
        const resultsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}&limit=30`;
        const results = await apifyRequest(resultsUrl);
        
        return results || [];
      }
    }
    
    console.log(`   ⏰ Timeout`);
    return [];
    
  } catch (e) {
    console.log(`   ❌ ${e.message}`);
    return [];
  }
}

async function main() {
  console.log('📸 INSTAGRAM HASHTAG SCRAPER (APIFY)');
  console.log('======================================\n');
  
  if (!APIFY_API_TOKEN) {
    console.log('❌ APIFY_API_TOKEN not set!');
    return;
  }
  
  console.log(`🎯 Scraping ${HASHTAGS.length} hashtags...\n`);
  
  const allPosts = [];
  
  for (const tag of HASHTAGS) {
    const posts = await scrapeHashtag(tag);
    
    for (const post of posts) {
      const caption = post.caption || post.title || '';
      
      if (isDealPost(caption)) {
        allPosts.push({
          id: post.id || Date.now(),
          shortCode: post.shortCode,
          caption: caption,
          username: post.username,
          likes: post.likesCount || 0,
          url: post.url
        });
      }
    }
    
    await new Promise(r => setTimeout(r, 3000));
  }
  
  // Remove duplicates
  const uniquePosts = [];
  const seen = new Set();
  for (const p of allPosts) {
    if (!seen.has(p.shortCode)) {
      seen.add(p.shortCode);
      uniquePosts.push(p);
    }
  }
  
  // Convert to deals format
  const deals = uniquePosts.slice(0, 20).map(p => ({
    id: `ig-${p.shortCode || Date.now()}`,
    brand: `@${p.username}`,
    logo: getLogo(p.caption),
    title: `${getLogo(p.caption)} @${p.username}`,
    description: p.caption?.substring(0, 150) || 'Deal found on Instagram',
    type: 'gratis',
    category: 'essen',
    source: 'Instagram',
    url: p.url || `https://instagram.com/p/${p.shortCode}`,
    expires: 'Begrenzt',
    distance: 'Wien',
    hot: true,
    isNew: true,
    priority: 1,
    votes: p.likes || 0,
    pubDate: new Date().toISOString()
  }));
  
  console.log(`\n📸 Found ${deals.length} deals from Instagram!`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/instagram-real.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/instagram-real.json');
}

main().catch(console.error);
