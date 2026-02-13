// ============================================
// MASTER SCRAPER
// Runs all 13 scrapers and merges deals
// ============================================

import { execSync } from 'child_process';
import fs from 'fs';

// QUALITY ONLY - Only scrapers that find REAL deals
const SCRAPERS = [
  { name: 'Events', file: '10-events.js', key: 'events' },
  { name: 'Foodsharing', file: '09-foodsharing.js', key: 'foodsharing' },
  { name: 'Too Good To Go', file: '03-toogoodtogo.js', key: 'toogoodtogo' },
  { name: 'Preisjäger', file: '12-preisjaeger.js', key: 'preisjaeger' },
  { name: 'Austrian Chains', file: '17-chains.js', key: 'chains' },
  { name: 'Instagram Deals', file: '18-instagram-deals.js', key: 'instagram-deals' },
  { name: 'Markets', file: '08-markets.js', key: 'markets' },
  { name: 'University & AK', file: '07-university-ak.js', key: 'university-ak' },
  // DISABLED - Too much garbage:
  // { name: 'Aggressive Search', file: '11-aggressive-search.js', key: 'aggressive-search' },
  // { name: 'Google Reviews', file: '05-google-reviews.js', key: 'google-reviews' },
];

async function main() {
  console.log('🎯 FREEFINDER VIENNA - MASTER SCRAPER');
  console.log('=====================================\n');
  
  const allDeals = [];
  let successCount = 0;
  let failCount = 0;
  
  // Run each scraper
  for (const scraper of SCRAPERS) {
    console.log(`\n🔄 Running: ${scraper.name}...`);
    
    try {
      execSync(`node scrapers/${scraper.file}`, { 
        stdio: 'inherit',
        env: process.env 
      });
      
      // Try to read output
      const outputFile = `output/${scraper.key}.json`;
      if (fs.existsSync(outputFile)) {
        const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        if (Array.isArray(data)) {
          allDeals.push(...data);
          console.log(`   ✅ ${data.length} deals`);
          successCount++;
        }
      } else {
        console.log(`   ⚠️ No output file`);
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
      failCount++;
    }
  }
  
  // Deduplicate
  const uniqueDeals = [];
  const seen = new Set();
  
  for (const deal of allDeals) {
    const key = deal.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueDeals.push(deal);
    }
  }
  
  // Sort: gratis first, then by votes
  uniqueDeals.sort((a, b) => {
    if (a.type === 'gratis' && b.type !== 'gratis') return -1;
    if (b.type === 'gratis' && a.type !== 'gratis') return 1;
    return (b.votes || 0) - (a.votes || 0);
  });
  
  console.log('\n=====================================');
  console.log('📊 FINAL RESULTS:');
  console.log(`   ✅ Successful: ${successCount}/${SCRAPERS.length}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📦 Total Deals: ${allDeals.length}`);
  console.log(`   🔥 Unique Deals: ${uniqueDeals.length}`);
  console.log(`   ❤️  Gratis Deals: ${uniqueDeals.filter(d => d.type === 'gratis').length}`);
  console.log('=====================================\n');
  
  // Save merged deals
  const output = {
    lastUpdated: new Date().toISOString(),
    totalDeals: uniqueDeals.length,
    deals: uniqueDeals
  };
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/deals.json', JSON.stringify(output, null, 2));
  console.log('💾 Saved to output/deals.json');
  
  // Also copy to docs for GitHub Pages
  fs.mkdirSync('docs', { recursive: true });
  fs.copyFileSync('output/deals.json', 'docs/deals.json');
  console.log('💾 Copied to docs/deals.json');
}

main().catch(console.error);
