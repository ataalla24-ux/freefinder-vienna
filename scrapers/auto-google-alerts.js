// ============================================
// AUTO-GOOGLE-ALERTS SCRAPER
// Automatisiertes Sammeln von Deals aus Web-Suchen
// Nutzt web_search (Brave) wenn verfügbar, sonst kompiliert es existierende Deals
// ============================================

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OUTPUT_DIR = path.join(process.cwd(), 'output');
const GOOGLE_ALERTS_FILE = path.join(OUTPUT_DIR, 'google-alerts.json');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'auto-google-deals.json');

// Lade Google Alert Begriffe
function loadGoogleAlerts() {
  try {
    const data = fs.readFileSync(GOOGLE_ALERTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('❌ Fehler beim Laden der Google Alerts:', e.message);
    return [];
  }
}

// Lade existierende Deals aus anderen Quellen
function loadExistingDeals() {
  const sources = [
    'toogoodtogo.json',
    'foodsharing.json',
    'wiener-tafel.json',
    'events.json',
    'obb.json',
    'markets.json',
    'supermarkets.json',
    'chains.json'
  ];
  
  const allDeals = [];
  
  for (const source of sources) {
    try {
      const filePath = path.join(OUTPUT_DIR, source);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const deals = Array.isArray(data) ? data : (data.deals || []);
        
        // Markiere als "Auto-Google-Search" kompatibel
        deals.forEach(deal => {
          allDeals.push({
            ...deal,
            source: deal.source || source.replace('.json', ''),
            searchTerms: getMatchingSearchTerms(deal)
          });
        });
      }
    } catch (e) {
      // Ignoriere fehlgeschlagene Quellen
    }
  }
  
  return allDeals;
}

// Finde passende Suchbegriffe für einen Deal
function getMatchingSearchTerms(deal) {
  const alerts = loadGoogleAlerts();
  const dealText = `${deal.title || ''} ${deal.description || ''} ${deal.brand || ''}`.toLowerCase();
  const matched = [];
  
  for (const alert of alerts) {
    const query = alert.query.toLowerCase();
    if (dealText.includes(query.replace(' wien', '').replace(' wien', ''))) {
      matched.push(alert.query);
    }
  }
  
  return matched;
}

// Kategorie-Mapping
function mapCategory(alertCategory) {
  const mapping = {
    'gratis': 'essen',
    'gratis-essen': 'essen',
    'gratis-trinken': 'trinken',
    'super-guenstig': 'essen',
    'guenstig': 'essen',
    'eroeffnung': 'event',
    'student': 'shopping',
    'food-rescue': 'essen',
    'kultur': 'event',
    'shopping': 'shopping',
    'events': 'event',
    'mobilitaet': 'event',
    'spezial': 'shopping',
    'sport': 'event',
    'outdoor': 'event'
  };
  return mapping[alertCategory] || 'shopping';
}

// Erstelle Deal-Objekt
function createDealFromResult(result, alertTerm, category) {
  const now = new Date().toISOString();
  
  return {
    id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    brand: extractBrand(result.title || result.url),
    logo: getCategoryEmoji(category),
    title: result.title || 'Deal gefunden',
    description: result.snippet || result.description || `Deal für: ${alertTerm}`,
    price: extractPrice(result.title || result.snippet || ''),
    originalPrice: null,
    type: isGratis(result.title || result.snippet || '') ? 'gratis' : 'rabatt',
    category: mapCategory(category),
    source: 'Auto-Google-Search',
    url: result.url,
    expires: extractExpiry(result.snippet || '') || 'Unbekannt',
    location: 'Wien',
    hot: true,
    isNew: true,
    priority: 1,
    votes: Math.floor(Math.random() * 100) + 10,
    pubDate: now,
    searchTerm: alertTerm,
    originalCategory: category
  };
}

// Helper-Funktionen
function extractBrand(title) {
  if (!title) return 'Unbekannt';
  const knownBrands = [
    'McDonald', 'KFC', 'Burger King', 'Subway', 'Domino', 'Pizza Hut',
    'Müller', 'H&M', 'Zara', 'Mango', 'Primark', 'MediaMarkt', 'Saturn',
    'Hofer', 'Lidl', 'Billa', 'Spar', 'Merkur', 'Penny', 'Rewe',
    'OMV', 'Shell', 'BP', 'Total', 'Eni',
    'Cineplexx', 'Apollo', 'Village', 'Ullrich', 'Stadthalle',
    'Volksoper', 'Burgtheater', 'Theater', 'Museum', 'Zoo',
    'AK', 'ÖBB', 'Wien', 'Stadt'
  ];
  
  for (const brand of knownBrands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return title.split(' ').slice(0, 2).join(' ');
}

function getCategoryEmoji(category) {
  const emojis = {
    'gratis': '🎁', 'gratis-essen': '🍕', 'gratis-trinken': '☕',
    'super-guenstig': '💶', 'guenstig': '💰', 'eroeffnung': '🎉',
    'student': '🎓', 'food-rescue': '♻️', 'kultur': '🎭',
    'shopping': '🛍️', 'events': '📅', 'mobilitaet': '🚇',
    'spezial': '⭐', 'sport': '⚽', 'outdoor': '🌳'
  };
  return emojis[category] || '🏷️';
}

function extractPrice(text) {
  if (!text) return null;
  if (text.toLowerCase().includes('gratis') || text.toLowerCase().includes('kostenlos')) {
    return '€0';
  }
  const priceMatch = text.match(/(\d+[.,]?\d*)\s*€/);
  if (priceMatch) return `€${priceMatch[1].replace(',', '.')}`;
  return null;
}

function isGratis(text) {
  if (!text) return false;
  return text.toLowerCase().includes('gratis') || 
         text.toLowerCase().includes('kostenlos');
}

function extractExpiry(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('heute')) return 'Heute';
  if (lower.includes('morgen')) return 'Morgen';
  if (lower.includes('woche')) return 'Diese Woche';
  if (lower.includes('monat')) return 'Diesen Monat';
  if (lower.includes('dauerhaft')) return 'Dauerhaft';
  const dateMatch = text.match(/(\d{1,2}\.\d{1,2}\.)/);
  return dateMatch ? dateMatch[1] : null;
}

// Versuche Web-Suche (Brave API)
async function tryWebSearch(query) {
  // Diese Funktion würde web_search verwenden wenn verfügbar
  // Da kein API Key konfiguriert ist, geben wir null zurück
  console.log(`  🔍 Würde suchen: "${query}"`);
  return [];
}

// Speichere Deals
function saveDeals(deals) {
  const output = {
    totalDeals: deals.length,
    source: 'Auto-Google-Search',
    scrapedAt: new Date().toISOString(),
    searchTermsAvailable: loadGoogleAlerts().length,
    note: 'Kompiliert aus existierenden Quellen. Für aktive Suche: Brave API Key erforderlich.',
    deals: deals
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ ${deals.length} Deals gespeichert in ${OUTPUT_FILE}`);
}

// Hauptfunktion
async function scrapeDeals() {
  console.log('🔍 AUTO-GOOGLE-ALERTS SCRAPER');
  console.log('==============================\n');
  
  const alerts = loadGoogleAlerts();
  console.log(`📋 Geladene Suchbegriffe: ${alerts.length}`);
  
  // Zeige Kategorien
  const categories = {};
  alerts.forEach(alert => {
    if (!categories[alert.category]) categories[alert.category] = [];
    categories[alert.category].push(alert.query);
  });
  
  console.log('\n📌 Kategorien:');
  Object.entries(categories).forEach(([cat, queries]) => {
    console.log(`   ${cat}: ${queries.length} Begriffe`);
  });
  
  // Lade existierende Deals
  console.log('\n📥 Lade existierende Deals...');
  const existingDeals = loadExistingDeals();
  console.log(`   Gefunden: ${existingDeals.length} Deals`);
  
  // Da web_search nicht verfügbar ist (kein API Key), 
  // zeigen wir die Suchbegriffe und kompilieren existierende Deals
  console.log('\n⚠️  INFO: web_search (Brave API) nicht verfügbar.');
  console.log('   Für aktive Suche: Brave API Key erforderlich.');
  console.log('   Alternativ: Browser-Automation nutzen.');
  
  // Speichere kombinierte Deals
  if (existingDeals.length > 0) {
    saveDeals(existingDeals);
  } else {
    // Leere Datei mit Info
    saveDeals([]);
  }
  
  console.log('\n📝 Für Automatisierung konfigurieren:');
  console.log('   1. Brave API Key: openclaw configure --section web');
  console.log('   2. Oder: Browser starten für automatisierte Suche');
  
  return existingDeals;
}

// Export
export async function runScraper() {
  return await scrapeDeals();
}

scrapeDeals().catch(console.error);
