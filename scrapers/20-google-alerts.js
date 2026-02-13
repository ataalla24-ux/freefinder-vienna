// ============================================
// GOOGLE ALERTS - Email Scraper
// Uses IFTTT or similar to get Google Alerts
// ============================================

import fs from 'fs';

// Google Alerts can be forwarded via IFTTT to a webhook
// This scraper checks a JSON file that IFTTT updates

// Setup: Set up Google Alert for "gratis wien" → IFTTT → Google Sheet → Export JSON
// For now, we'll add the Google Alerts as manual sources

const GOOGLE_ALERTS = [
  {
    query: 'gratis wien',
    name: 'Gratis Wien'
  },
  {
    query: '1€ kebab wien', 
    name: '1€ Kebab Wien'
  },
  {
    query: 'kostenlos essen wien',
    name: 'Kostenlos Essen Wien'
  },
  {
    query: 'eröffnung angebot wien',
    name: 'Eröffnung Angebote Wien'
  }
];

function main() {
  console.log('🔔 GOOGLE ALERTS');
  console.log('====================\n');
  
  const deals = [];
  
  // Add Google Alert sources as deals
  for (const alert of GOOGLE_ALERTS) {
    deals.push({
      id: `alert-${alert.query.replace(/\s+/g, '-')}`,
      brand: 'Google Alert',
      logo: '🔔',
      title: `🔔 Google Alert: ${alert.name}`,
      description: `Automatischer Alert für "${alert.query}". Richtest du ein unter google.com/alerts`,
      type: 'gratis',
      category: 'deals',
      source: 'Google Alerts',
      url: `https://www.google.com/alerts?search=${encodeURIComponent(alert.query)}`,
      expires: 'Automatisch',
      distance: 'Wien',
      hot: true,
      isNew: true,
      priority: 1,
      votes: 50,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`🔔 Added ${deals.length} Google Alert sources`);
  
  // HOW TO SET UP GOOGLE ALERTS:
  console.log('\n📋 ANLEITUNG:');
  console.log('1. Gehe auf google.com/alerts');
  console.log('2. Erstelle Alert für: "gratis wien", "1€ wien", etc.');
  console.log('3. Stelle auf "Alle" nicht "Nur die Besten"');
  console.log('4. Richte IFTTT ein: IF Google Alert THEN Google Sheet');
  console.log('5. Exportiere die Sheets als JSON');
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/google-alerts.json', JSON.stringify(deals, null, 2));
  console.log('\n💾 Saved to output/google-alerts.json');
}

main();
