// ============================================
// INSTAGRAM DEAL FINDER - USING APIFY
// Actually scrapes Instagram for real deal posts
// ============================================

import https from 'https';
import fs from 'fs';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || '';

// Vienna deal hashtags
const HASHTAGS = [
  'gratiswien',
  'gratisessenwien',
  'wiengratis',
  'kostenloswien',
  'neueröffnungwien',
  'wienisst',
  'wienfood',
  'kebabwien',
  'pizzawien',
  'burgerwien'
];

const DEAL_KEYWORDS = [
  'gratis', 'kostenlos', '0€', 'free',
  '1€', '2€', '3€', 'aktion', 'rabatt', 'eröffnung'
];

const FOOD_KEYWORDS = [
  'kebab', 'pizza', 'burger', 'coffee', 'kaffee', 'essen',
  'döner', 'sushi', 'eis', 'cafe', 'restaurant', 'food'
];

function apifyRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.apify.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_TOKEN}`
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function isRealDeal(caption) {
  if (!caption) return false;
  const c = caption.toLowerCase();
  return DEAL_KEYWORDS.some(k => c.includes(k)) && 
         FOOD_KEYWORDS.some(f => c.includes(f));
}

function getLogo(caption) {
  const c = caption.toLowerCase();
  if (c.includes('kebab') || c.includes('döner')) return '🥙';
  if (c.includes('pizza')) return '🍕';
  if (c.includes('burger')) return '🍔';
  if (c.includes('coffee') || c.includes('kaffee')) return '☕';
  if (c.includes('eis')) return '🍦';
  if (c.includes('sushi')) return '🍣';
  return '🎁';
}

async function scrapeHashtag(hashtag) {
  console.log(`📸 Scraping #${hashtag}...`);
  
  try {
    // Use Apify's Instagram Hashtag Scraper
    const runResult = await apifyRequest(
      `/v2/acts/apify~instagram-hashtag-scraper/runs?token=${APIFY_API_TOKEN}`,
      'POST',
      {
        hashtags: [hashtag],
        resultsPerHashtag: 20,
        searchType: 'posts'
      }
    );

    if (!runResult.data?.id) {
      console.log(`   ❌ Could not start scraper`);
      return [];
    }

    const runId = runResult.data.id;
    
    // Wait for completion (max 2 minutes)
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 10000));
      const status = await apifyRequest(`/v2/acts/apify~instagram-hashtag-scraper/runs/${runId}?token=${APIFY_API_TOKEN}`);
      
      if (status.data?.status === 'SUCCEEDED') {
        // Get results
        const datasetId = status.data.defaultDatasetId;
        const results = await apifyRequest(`/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}&limit=50`);
        
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
  console.log('📸 INSTAGRAM DEAL FINDER (APIFY)');
  console.log('====================================\n');
  
  if (!APIFY_API_TOKEN) {
    console.log('❌ APIFY_API_TOKEN not set!');
    process.exit(0);
  }

  const allPosts = [];
  
  // Scrape each hashtag
  for (const hashtag of HASHTAGS.slice(0, 5)) {
    const posts = await scrapeHashtag(hashtag);
    allPosts.push(...posts);
    await new Promise(r => setTimeout(r, 2000));
  }

  // Filter for real deals
  const deals = [];
  const seen = new Set();
  
  for (const post of allPosts) {
    const caption = post.caption || '';
    if (isRealDeal(caption) && !seen.has(post.shortCode)) {
      seen.add(post.shortCode);
      
      deals.push({
        id: `ig-${post.shortCode || Date.now()}`,
        brand: post.ownerUsername || 'Instagram',
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
        isNew: true,
        priority: 1,
        votes: post.likesCount || 0,
        pubDate: post.timestamp || new Date().toISOString()
      });
    }
  }

  console.log(`\n📸 Found ${deals.length} real Instagram deals!`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/instagram-real.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/instagram-real.json');
}

main().catch(console.error);
