// ============================================
// GOOGLE ALERTS - Umfassende Wien-Deal Alerts
// Alle Begriffe für Google Alerts gesammelt
// ============================================

import fs from 'fs';

// Umfassende Liste aller Deal-Begriffe für Wien (50+)
// Kategorisiert nach Typ

const GOOGLE_ALERTS = {
  // ========== ESSEN & TRINKEN - Gratis/Kostenlos ==========
  gratisWien: {
    query: 'gratis wien',
    category: 'gratis',
    description: 'Alle Gratis-Angebote in Wien'
  },
  kostenlosEssenWien: {
    query: 'kostenlos essen wien',
    category: 'gratis',
    description: 'Kostenloses Essen in Wien'
  },
  kostenlosTrinkenWien: {
    query: 'kostenlos trinken wien',
    category: 'gratis',
    description: 'Kostenloses Trinken in Wien'
  },
  gratisPizzaWien: {
    query: 'gratis pizza wien',
    category: 'gratis-essen',
    description: 'Gratis Pizza Wien'
  },
  gratisKebabWien: {
    query: 'gratis kebab wien',
    category: 'gratis-essen',
    description: 'Gratis Kebab Wien'
  },
  gratisCafeWien: {
    query: 'gratis café wien',
    category: 'gratis-trinken',
    description: 'Gratis Kaffee Wien'
  },
  gratisBrunchWien: {
    query: 'gratis brunch wien',
    category: 'gratis-essen',
    description: 'Gratis Brunch Wien'
  },
  gratisEssenRestaurantWien: {
    query: 'gratis essen restaurant wien',
    category: 'gratis-essen',
    description: 'Gratis Essen im Restaurant'
  },

  // ========== PREIS-SPECIFISCHE SUCHEN ==========
  einEuroEssenWien: {
    query: '1€ essen wien',
    category: 'super-guenstig',
    description: 'Essen um 1€ in Wien'
  },
  einEuroKebabWien: {
    query: '1€ kebab wien',
    category: 'super-guenstig',
    description: '1€ Kebab Wien'
  },
  einEuroPizzaWien: {
    query: '1€ pizza wien',
    category: 'super-guenstig',
    description: '1€ Pizza Wien'
  },
  einEuroDonerWien: {
    query: '1€ döner wien',
    category: 'super-guenstig',
    description: '1€ Döner Wien'
  },
  einFuenfzigKebabWien: {
    query: '1,50€ kebab wien',
    category: 'guenstig',
    description: '1,50€ Kebab Wien'
  },
  einNeunzigKebabWien: {
    query: '1,90€ kebab wien',
    category: 'guenstig',
    description: '1,90€ Kebab Wien'
  },
  zweiEuroEssenWien: {
    query: '2€ essen wien',
    category: 'guenstig',
    description: '2€ Essen Wien'
  },
  zweiEuroKebabWien: {
    query: '2€ kebab wien',
    category: 'guenstig',
    description: '2€ Kebab Wien'
  },
  zweiEuroPizzaWien: {
    query: '2€ pizza wien',
    category: 'guenstig',
    description: '2€ Pizza Wien'
  },
  dreiEuroEssenWien: {
    query: '3€ essen wien',
    category: 'guenstig',
    description: '3€ Essen Wien'
  },
  fuenfEuroEssenWien: {
    query: '5€ essen wien',
    category: 'guenstig',
    description: '5€ Essen Wien'
  },
  guenstigEssenWien: {
    query: 'günstig essen wien',
    category: 'guenstig',
    description: 'Günstig essen Wien'
  },
  billigEssenWien: {
    query: 'billig essen wien',
    category: 'guenstig',
    description: 'Billig essen Wien'
  },

  // ========== ERÖFFNUNGEN ==========
  eroeffnungGratisWien: {
    query: 'eröffnung gratis wien',
    category: 'eroeffnung',
    description: 'Eröffnung mit Gratis-Angebot'
  },
  eroeffnungAngebotWien: {
    query: 'eröffnung angebot wien',
    category: 'eroeffnung',
    description: 'Eröffnungsangebote Wien'
  },
  eroeffnungRabattWien: {
    query: 'eröffnung rabatt wien',
    category: 'eroeffnung',
    description: 'Eröffnungsrabatte Wien'
  },
  neueroeffnungRestaurantWien: {
    query: 'neueröffnung restaurant wien',
    category: 'eroeffnung',
    description: 'Neueröffnete Restaurants'
  },
  openingDealWien: {
    query: 'opening deal wien',
    category: 'eroeffnung',
    description: 'Opening Deals Wien'
  },
  openingGratisWien: {
    query: 'opening gratis wien',
    category: 'eroeffnung',
    description: 'Opening Gratis Wien'
  },
  tagDerOffenenTuerWien: {
    query: 'tag der offenen tür wien',
    category: 'eroeffnung',
    description: 'Tag der offenen Tür'
  },

  // ========== STUDENTEN ==========
  studentenrabattWien: {
    query: 'studentenrabatt wien',
    category: 'student',
    description: 'Studentenrabatte Wien'
  },
  studentenEssenWien: {
    query: 'studenten essen wien',
    category: 'student',
    description: 'Studentenessen Wien'
  },
  studentenGuenstigWien: {
    query: 'studenten günstig wien',
    category: 'student',
    description: 'Günstig für Studenten'
  },
  uniMensaWien: {
    query: 'uni mensa wien preise',
    category: 'student',
    description: 'Uni Mensa Preise'
  },
  akademikerbundWien: {
    query: 'ak wien services gratis',
    category: 'student',
    description: 'AK Wien Gratis-Services'
  },

  // ========== FOOD RESCUE / GERETTETES ESSEN ==========
  foodsharingWien: {
    query: 'foodsharing wien',
    category: 'food-rescue',
    description: 'Foodsharing Wien'
  },
  tooGoodToGoWien: {
    query: 'too good to go wien',
    category: 'food-rescue',
    description: 'Too Good To Go Wien'
  },
  wienerTafelWien: {
    query: 'wiener tafel wien',
    category: 'food-rescue',
    description: 'Wiener Tafel'
  },
  brotRettenWien: {
    query: 'brot retten wien',
    category: 'food-rescue',
    description: 'Brot retten Wien'
  },
  lebensmittelKostenlosWien: {
    query: 'lebensmittel kostenlos wien',
    category: 'food-rescue',
    description: 'Kostenlose Lebensmittel'
  },
  tischleinDeckDichWien: {
    query: 'tischlein deck dich wien',
    category: 'food-rescue',
    description: 'Tischlein deck dich'
  },
  rescueFoodWien: {
    query: 'rescue food wien',
    category: 'food-rescue',
    description: 'Rescue Food Wien'
  },

  // ========== MUSEEN & KULTUR ==========
  gratisMuseumWien: {
    query: 'gratis museum wien',
    category: 'kultur',
    description: 'Gratis Museen Wien'
  },
  freierEintrittWien: {
    query: 'freier eintritt wien museen',
    category: 'kultur',
    description: 'Freier Eintritt Museen'
  },
  museumFreitagWien: {
    query: 'museum freitag wien',
    category: 'kultur',
    description: 'Gratis Museum am Freitag'
  },
  museumSonntagWien: {
    query: 'museum sonntag wien',
    category: 'kultur',
    description: 'Gratis Museum am Sonntag'
  },
  bundesmuseenGratis: {
    query: 'bundesmuseen gratis unter 19',
    category: 'kultur',
    description: 'Bundesmuseen gratis'
  },

  // ========== SHOPPING & RABATTE ==========
  wienCardVerguenstigung: {
    query: 'wien card vergünstigung',
    category: 'shopping',
    description: 'Wien Card Vergünstigungen'
  },
  saleWien: {
    query: 'sale wien',
    category: 'shopping',
    description: 'Sale in Wien'
  },
  rabattWien: {
    query: 'rabatt wien',
    category: 'shopping',
    description: 'Rabatte in Wien'
  },
  guenstigEinkaufenWien: {
    query: 'günstig einkaufen wien',
    category: 'shopping',
    description: 'Günstig einkaufen'
  },
  supermarktGratisWien: {
    query: 'gratis produkte supermarkt wien',
    category: 'shopping',
    description: 'Gratis Produkte im Supermarkt'
  },

  // ========== EVENTS & FREIZEIT ==========
  gratisEventWien: {
    query: 'gratis event wien',
    category: 'events',
    description: 'Gratis Events Wien'
  },
  gratisKonzertWien: {
    query: 'gratis konzert wien',
    category: 'events',
    description: 'Gratis Konzerte'
  },
  gratisFestivalWien: {
    query: 'gratis festival wien',
    category: 'events',
    description: 'Gratis Festivals'
  },
  openAirKinoWien: {
    query: 'open air kino wien gratis',
    category: 'events',
    description: 'Open Air Kino'
  },
  DONAUINSELFEST: {
    query: 'donauinselfest gratis',
    category: 'events',
    description: 'Donauinselfest'
  },
  filmfestivalRathausplatz: {
    query: 'filmfestival rathausplatz gratis',
    category: 'events',
    description: 'Film Festival Rathausplatz'
  },

  // ========== MOBILITÄT ==========
  einEuroTicketWien: {
    query: '1€ ticket wien',
    category: 'mobilitaet',
    description: '1€ Ticket Wien'
  },
  klimaTicketWien: {
    query: 'klima ticket wien',
    category: 'mobilitaet',
    description: 'KlimaTicket Wien'
  },
  sparpreisOebbWien: {
    query: 'sparpreis öbb wien',
    category: 'mobilitaet',
    description: 'ÖBB Sparpreise'
  },
  cityBikeGratis: {
    query: 'citybike wien gratis',
    category: 'mobilitaet',
    description: 'CityBike Wien'
  },

  // ========== SPEZIELLE ANGEBOTE ==========
  probierprobeWien: {
    query: 'gratis probieren wien',
    category: 'spezial',
    description: 'Gratis probieren'
  },
  einPlusEinsGratis: {
    query: '1+1 gratis wien',
    category: 'spezial',
    description: '1+1 Gratis Angebote'
  },
  giveawayWien: {
    query: 'giveaway wien',
    category: 'spezial',
    description: 'Giveaways Wien'
  },
  gratisProduktprobeWien: {
    query: 'gratis produktprobe wien',
    category: 'spezial',
    description: 'Gratis Produktproben'
  },
  omvEinEuroKaffee: {
    query: 'OMV 1€ kaffee wien',
    category: 'spezial',
    description: 'OMV 1€ Kaffee'
  },
  gratisWlanWien: {
    query: 'gratis wlan wien',
    category: 'spezial',
    description: 'Gratis WLAN'
  },

  // ========== SPASS & UNTERHALTUNG ==========
  gratisSchwimmenWien: {
    query: 'gratis schwimmen wien',
    category: 'sport',
    description: 'Gratis schwimmen'
  },
  gratisSportWien: {
    query: 'gratis sport wien',
    category: 'sport',
    description: 'Gratis Sport'
  },
  gratisParkWien: {
    query: 'gratis park wien',
    category: 'outdoor',
    description: 'Gratis Parks'
  },
  gratisAussichtspunktWien: {
    query: 'gratis aussicht wien',
    category: 'outdoor',
    description: 'Gratis Aussichtspunkte'
  }
};

// Alias für Abwärtskompatibilität
const GOOGLE_ALERTS_ARRAY = Object.entries(GOOGLE_ALERTS).map(([key, value]) => ({
  key,
  ...value
}));

function main() {
  console.log('🔔 GOOGLE ALERTS - Wien Deals');
  console.log('============================\n');
  
  console.log(`📊 Gesamtanzahl Alerts: ${GOOGLE_ALERTS_ARRAY.length}`);
  
  // Kategorien zusammenfassen
  const categories = {};
  for (const alert of GOOGLE_ALERTS_ARRAY) {
    if (!categories[alert.category]) {
      categories[alert.category] = [];
    }
    categories[alert.category].push(alert.query);
  }
  
  console.log('\n📂 Kategorien:');
  for (const [cat, queries] of Object.entries(categories)) {
    console.log(`   ${cat}: ${queries.length} Begriffe`);
  }
  
  // De als Google Alerts vorbereiten
  const alertsOutput = GOOGLE_ALERTS_ARRAY.map((alert, index) => ({
    id: `alert-${index + 1}`,
    key: alert.key,
    query: alert.query,
    googleAlertsUrl: `https://www.google.com/alerts?search=${encodeURIComponent(alert.query)}&hl=de&gl=AT`,
    category: alert.category,
    description: alert.description,
    status: 'einrichten',
    createdAt: new Date().toISOString()
  }));
  
  // Als menschenlesbare Liste für Einrichtung
  const setupGuide = {
    anleitung: 'Google Alerts einrichten',
    schritte: [
      '1. Gehe auf google.com/alerts',
      '2. Melde dich mit deinem Google-Konto an',
      '3. Füge jeden Suchbegriff einzeln ein',
      '4. Einstellungen: "Alle" nicht "Nur die Besten"',
      '5. Häufigkeit: "Sofort" für beste Deals',
      '6. Art: "E-Mail" oder "RSS Feed"'
    ],
    alerts: alertsOutput.map(a => ({
      query: a.query,
      url: a.googleAlertsUrl
    }))
  };
  
  console.log('\n📋 Google Alerts Setup:');
  for (const alert of GOOGLE_ALERTS_ARRAY.slice(0, 10)) {
    console.log(`   → ${alert.query}`);
  }
  console.log(`   ... und ${GOOGLE_ALERTS_ARRAY.length - 10} weitere`);
  
  // Speichern
  fs.mkdirSync('output', { recursive: true });
  
  // 1. Alle Alerts als JSON
  fs.writeFileSync('output/google-alerts.json', JSON.stringify(alertsOutput, null, 2));
  console.log('\n💾 Gespeichert: output/google-alerts.json');
  
  // 2. Setup-Guide als JSON
  fs.writeFileSync('output/google-alerts-setup.json', JSON.stringify(setupGuide, null, 2));
  console.log('💾 Gespeichert: output/google-alerts-setup.json');
  
  // 3. Einfache Liste für Copy/Paste
  const simpleList = GOOGLE_ALERTS_ARRAY.map(a => a.query).join('\n');
  fs.writeFileSync('output/google-alerts-queries.txt', simpleList);
  console.log('💾 Gespeichert: output/google-alerts-queries.txt');
  
  console.log('\n✅ Fertig! Google Alerts können jetzt eingerichtet werden.');
  console.log('\n💡 Tipp: Nutze die google-alerts-queries.txt für schnelles Copy/Paste bei Google Alerts.');
}

main();
