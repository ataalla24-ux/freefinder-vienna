// ============================================
// AUSTRIAN CHAIN PROMOTIONS
// Weekly deals from Austrian supermarket and retail chains
// ============================================

import fs from 'fs';

// Austrian chains with regular promotions
const AUSTRIAN_CHAINS = [
  // Supermarkets
  { name: 'BILLA', logo: '🛒', category: 'essen', url: 'https://www.billa.at/angebote' },
  { name: 'SPAR', logo: '🛒', category: 'essen', url: 'https://www.spar.at/angebote' },
  { name: 'INTERSPAR', logo: '🛒', category: 'essen', url: 'https://www.interspar.at/angebote' },
  { name: 'HOFER', logo: '🛒', category: 'essen', url: 'https://www.hofer.at/de/angebote.html' },
  { name: 'LIDL', logo: '🛒', category: 'essen', url: 'https://www.lidl.at/c/billiger-montag/a10006065' },
  { name: 'PENNY', logo: '🛒', category: 'essen', url: 'https://www.penny.at/angebote' },
  { name: 'UNIMARKT', logo: '🛒', category: 'essen', url: 'https://www.unimarkt.at/angebote' },
  
  // Electronics
  { name: 'MediaMarkt', logo: '📺', category: 'technik', url: 'https://www.mediamarkt.at/de/campaign/angebote' },
  { name: 'Saturn', logo: '📺', category: 'technik', url: 'https://www.saturn.at/de/campaign/angebote' },
  { name: 'Cyberport', logo: '💻', category: 'technik', url: 'https://www.cyberport.at/' },
  { name: 'Conrad', logo: '🔧', category: 'technik', url: 'https://www.conrad.at/' },
  
  // Drugstores
  { name: 'dm', logo: '💄', category: 'beauty', url: 'https://www.dm.at/angebote' },
  { name: 'BIPA', logo: '💅', category: 'beauty', url: 'https://www.bipa.at/angebote' },
  { name: 'Müller', logo: '🧴', category: 'beauty', url: 'https://www.mueller.at/angebote/' },
  
  // Fashion
  { name: 'H&M', logo: '👕', category: 'mode', url: 'https://www2.hm.com/de_at/sale.html' },
  { name: 'Zalando', logo: '👟', category: 'mode', url: 'https://www.zalando.at/sale/' },
  { name: 'About You', logo: '👔', category: 'mode', url: 'https://www.aboutyou.at/sale' },
  { name: 'C&A', logo: '👚', category: 'mode', url: 'https://www.c-und-a.com/' },
  
  // Home & Living
  { name: 'IKEA', logo: '🪑', category: 'home', url: 'https://www.ikea.com/at/de/' },
  { name: 'Möbelix', logo: '🛋️', category: 'home', url: 'https://www.moebelix.at/' },
  { name: 'XXXLutz', logo: '🛏️', category: 'home', url: 'https://www.xxxlutz.at/' },
  
  // Fast Food
  { name: "McDonald's", logo: '🍟', category: 'essen', url: 'https://www.mcdonalds.at/aktionen' },
  { name: 'Burger King', logo: '🍔', category: 'essen', url: 'https://www.burgerking.at/angebote' },
  { name: 'KFC', logo: '🍗', category: 'essen', url: 'https://www.kfc.at/angebote' },
  { name: 'Dominos', logo: '🍕', category: 'essen', url: 'https://www.dominos.at/speisekarte/angebote' },
  { name: 'Subway', logo: '🥪', category: 'essen', url: 'https://www.subway.at/de/angebote' },
];

function main() {
  console.log('🏭 AUSTRIAN CHAIN PROMOTIONS');
  console.log('==============================\n');
  
  const deals = [];
  
  for (const chain of AUSTRIAN_CHAINS) {
    const isGratis = chain.name === "McDonald's" || chain.name === 'IKEA';
    
    deals.push({
      id: `chain-${chain.name.toLowerCase().replace(/\s+/g, '-')}`,
      brand: chain.name,
      logo: chain.logo,
      title: `${chain.logo} ${chain.name} - Aktuelle Angebote`,
      description: `Die neuesten Deals und Aktionen bei ${chain.name}!`,
      type: 'rabatt',
      category: chain.category,
      source: chain.name,
      url: chain.url,
      expires: 'Wöchentlich',
      distance: 'Wien & Österreich',
      hot: isGratis,
      isNew: true,
      priority: isGratis ? 1 : 2,
      votes: 50,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`🏭 Found ${deals.length} Austrian chain promotions`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/chains.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/chains.json');
}

main();
