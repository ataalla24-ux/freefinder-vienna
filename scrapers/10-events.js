// ============================================
// 10. VIENNA EVENTS - Opening Deals
// Free events, museum openings, festivals
// ============================================

import https from 'https';
import fs from 'fs';

const EVENT_SOURCES = [
  {
    name: 'Wien Events',
    url: 'https://events.wien.info/de/',
    logo: '🎭'
  },
  {
    name: 'Wien Kultur',
    url: 'https://www.wien.gv.at/kultur-freizeit/kalender.html',
    logo: '🏛️'
  },
  {
    name: 'Wiener Festwochen',
    url: 'https://www.festwochen.at/',
    logo: '🎪'
  },
  {
    name: 'Donauinselfest',
    url: 'https://donauinselfest.at/',
    logo: '🎸'
  },
  {
    name: 'Film Festival Rathausplatz',
    url: 'https://www.filmfestival-rathausplatz.at/',
    logo: '🎬'
  }
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'de-AT'
      },
      timeout: 10000
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(10000, () => { req.destroy(); resolve(''); });
  });
}

async function main() {
  console.log('🎪 VIENNA EVENTS & OPENINGS');
  console.log('============================\n');
  
  const deals = [];
  
  // Known event deals
  const eventDeals = [
    {
      brand: 'Donauinselfest',
      logo: '🎸',
      title: 'GRATIS Festival 3 Tage',
      description: 'Europas größtes Gratis-Open-Air Festival! 3 Tage Musik, komplett kostenlos. J Juni.',
      url: 'https://donauinselfest.at/',
      hot: true
    },
    {
      brand: 'Film Festival',
      logo: '🎬',
      title: 'GRATIS Open-Air Kino',
      description: 'Jeden Sommer am Rathausplatz: Gratis Filmvorführungen unter freiem Himmel!',
      url: 'https://www.filmfestival-rathausplatz.at/',
      hot: true
    },
    {
      brand: 'Wiener Eistraum',
      logo: '⛸️',
      title: 'Eislaufen am Rathausplatz',
      description: '9000m² Eisfläche vor dem Rathaus! Eintritt gratis, Leihschuhe ab 7€. Jänner bis März.',
      url: 'https://www.wienereistraum.com/',
      hot: false
    },
    {
      brand: 'Lange Nacht der Museen',
      logo: '🌙',
      title: '1 Ticket für alle Museen',
      description: 'Eine Nacht, alle Museen! Tickets gibts für ca. 15€ - otherwise hundreds gratis.',
      url: 'https://langenacht.orf.at/',
      hot: false
    },
    {
      brand: 'Bundesmuseen',
      logo: '🏛️',
      title: 'GRATIS Eintritt unter 19',
      description: 'Alle Bundesmuseen (KHM, Belvedere, Albertina...) sind für unter 19-Jährige gratis!',
      url: 'https://www.bundesmuseen.at/',
      hot: true
    },
    {
      brand: 'Wiener Rathaus',
      logo: '🏛️',
      title: 'GRATIS Rathausführungen',
      description: 'Mo, Mi, Fr um 13:00: Kostenlose Führung durch das Wiener Rathaus. Ohne Anmeldung!',
      url: 'https://www.wien.gv.at/politik/rathaus/fuehrung.html',
      hot: false
    },
    {
      brand: 'Wiener Staatsoper',
      logo: '🎭',
      title: 'Stehplätze ab nur 3€',
      description: 'Staatsoper, Volksoper, Burgtheater: Weltklasse-Kultur ab 3€! Stehplätze 80 Min vor Beginn.',
      url: 'https://www.wiener-staatsoper.at/',
      hot: true
    },
    {
      brand: 'Büchereien Wien',
      logo: '📚',
      title: 'GRATIS Mitgliedschaft unter 18',
      description: 'Büchereien Wien: Gratis Mitgliedschaft für alle unter 18! Bücher, DVDs, Spiele ausleihen.',
      url: 'https://buechereien.wien.gv.at/',
      hot: false
    },
    {
      brand: 'WienMobil Rad',
      logo: '🚴',
      title: 'Erste 30 Min gratis Radfahren',
      description: 'WienMobil Rad: Erste 30 Minuten jeder Fahrt kostenlos! Über 200 Stationen in Wien.',
      url: 'https://www.wienerlinien.at/wienmobil-rad',
      hot: false
    },
    {
      brand: 'Wiener Linien',
      logo: '🚇',
      title: '1€ pro Tag - Klimaticket',
      description: '365€/Jahr = 1€ pro Tag für alle U-Bahnen, Busse, Straßenbahnen!',
      url: 'https://www.wienerlinien.at/',
      hot: true
    }
  ];
  
  for (const d of eventDeals) {
    deals.push({
      id: `event-${d.brand.toLowerCase().replace(/\s+/g, '-')}`,
      brand: d.brand,
      logo: d.logo,
      title: d.title,
      description: d.description,
      type: d.hot ? 'gratis' : 'rabatt',
      category: 'wien',
      source: 'Vienna Events',
      url: d.url,
      expires: 'Siehe Website',
      distance: 'Wien',
      hot: d.hot,
      isNew: false,
      priority: d.hot ? 1 : 2,
      votes: d.hot ? 500 : 200,
      pubDate: new Date().toISOString()
    });
  }
  
  console.log(`✅ Found ${deals.length} event deals`);
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/events.json', JSON.stringify(deals, null, 2));
  console.log('💾 Saved to output/events.json');
}

main();
