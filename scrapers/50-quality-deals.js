// ============================================
// HIGH QUALITY DEALS - ONLY REAL FREE & DISCOUNTS
// Template: OMV €1 Coffee, Free Food, etc.
// ============================================

import fs from 'fs';

// ===== REAL FREE STUFF IN VIENNA =====
const DEALS = [
  // === FOODSHARING - 100% FREE ===
  { brand: 'Foodsharing Wien', logo: '🍏', title: '🍏 Foodsharing - Gerettetes Essen', desc: 'KOSTENLOS! Lebensmittel von Fairteiler holen', type: 'gratis', cat: 'essen', url: 'https://foodsharing.at/', votes: 500 },
  { brand: 'Foodsharing Wien', logo: '🥖', title: '🥖 Brot & Backwaren', desc: 'KOSTENLOS! Gerettetes Brot täglich', type: 'gratis', cat: 'essen', url: 'https://foodsharing.at/', votes: 400 },
  { brand: 'Foodsharing Wien', logo: '🍎', title: '🍎 Obst & Gemüse', desc: 'KOSTENLOS! Gerettetes Obst & Gemüse', type: 'gratis', cat: 'essen', url: 'https://foodsharing.at/', votes: 400 },
  
  // === WIENER TAFEL - 100% FREE ===
  { brand: 'Wiener Tafel', logo: '🥫', title: '🥫 Wiener Tafel - Kostenlos', desc: 'KOSTENLOS! Gerettete Lebensmittel', type: 'gratis', cat: 'essen', url: 'https://www.wienertafel.at/', votes: 500 },
  { brand: 'Wiener Tafel', logo: '🍞', title: '🍞 Wiener Tafel Ausgabe', desc: 'KOSTENLOS! Mehrere Standorte in Wien', type: 'gratis', cat: 'essen', url: 'https://www.wienertafel.at/', votes: 400 },
  
  // === TISCHLEIN DECK DICH - 100% FREE ===
  { brand: 'Tischlein deck dich', logo: '🍽️', title: '🍽️ Tischlein deck dich', desc: 'KOSTENLOS! Gerettetes Essen', type: 'gratis', cat: 'essen', url: 'https://www.tischlein.at/', votes: 400 },
  
  // === TOO GOOD TO GO - DISCOUNTED ===
  { brand: 'Too Good To Go', logo: '🥡', title: '🥡 TGTG - Gerettetes Essen ab €2,99', desc: 'Restaurants retten Essen - ab nur €2,99!', type: 'rabatt', cat: 'essen', url: 'https://toogoodtogo.at/', votes: 300 },
  { brand: 'Too Good To Go', logo: '🥐', title: '🥐 TGTG Bäckereien ab €2,99', desc: 'Übriggebliebenes Brot & Gebäck', type: 'rabatt', cat: 'essen', url: 'https://toogoodtogo.at/', votes: 250 },
  { brand: 'Too Good To Go', logo: '🛒', title: '🛒 TGTG Supermärkte ab €2,99', desc: 'Übriggebliebenes vom Tag', type: 'rabatt', cat: 'essen', url: 'https://toogoodtogo.at/', votes: 250 },
  
  // === MUSEEN - FREE ON 1ST SUNDAY ===
  { brand: 'Kunsthistorisches Museum', logo: '🏛️', title: '🏛️ KHM - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag: FREIER EINTRITT!', type: 'gratis', cat: 'kultur', url: 'https://www.khm.at/', votes: 400 },
  { brand: 'Naturhistorisches Museum', logo: '🦕', title: '🦕 NHM - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag: FREIER EINTRITT!', type: 'gratis', cat: 'kultur', url: 'https://www.nhm-wien.ac.at/', votes: 400 },
  { brand: 'Belvedere', logo: '🎨', title: '🎨 Belvedere - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag frei!', type: 'gratis', cat: 'kultur', url: 'https://www.belvedere.at/', votes: 350 },
  { brand: 'Albertina', logo: '🖼️', title: '🖼️ Albertina - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag frei!', type: 'gratis', cat: 'kultur', url: 'https://www.albertina.at/', votes: 350 },
  { brand: 'MUMOK', logo: '🎭', title: '🎭 MUMOK - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag frei!', type: 'gratis', cat: 'kultur', url: 'https://www.mumok.at/', votes: 300 },
  { brand: 'Leopold Museum', logo: '🖌️', title: '🖌️ Leopold Museum - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag frei!', type: 'gratis', cat: 'kultur', url: 'https://www.leopoldmuseum.org/', votes: 300 },
  { brand: 'Technisches Museum', logo: '🔧', title: '🔧 TechMuseum - 1. Sonntag FREI', desc: 'Jeden 1. Sonntag frei!', type: 'gratis', cat: 'kultur', url: 'https://www.tmw.ac.at/', votes: 300 },
  
  // === BUNDESMUSEEN - FREE UNDER 19 ===
  { brand: 'Bundesmuseen', logo: '🎓', title: '🎓 ALLE Bundesmuseen FREI unter 19', desc: 'KHM, NHM, Belvedere, Albertina - ALLE frei für unter 19!', type: 'gratis', cat: 'kultur', url: 'https://www.bundesmuseen.at/', votes: 400 },
  
  // === EVENTS - FREE ===
  { brand: 'Donauinselfest', logo: '🎸', title: '🎸 DONAUINSELFEST - 3 Tage FREE', desc: 'Europas größtes Gratis-Open-Air!', type: 'gratis', cat: 'events', url: 'https://donauinselfest.at/', votes: 500 },
  { brand: 'Film Festival', logo: '🎬', title: '🎬 Film Festival Rathausplatz', desc: 'KOSTENLOS: Open-Air Kino!', type: 'gratis', cat: 'events', url: 'https://www.filmfestival-rathausplatz.at/', votes: 400 },
  { brand: 'Wiener Festwochen', logo: '🎭', title: '🎭 Wiener Festwochen', desc: 'Viele VORSTELLUNGEN sind FREI!', type: 'gratis', cat: 'events', url: 'https://www.festwochen.at/', votes: 300 },
  { brand: 'MuseumsQuartier', logo: '🎨', title: '🎨 MQ - Kostenlose Events', desc: 'KOSTENLOS: Hoftheater, Lesungen!', type: 'gratis', cat: 'events', url: 'https://www.mqw.at/', votes: 250 },
  { brand: 'Christkindlmarkt', logo: '🎄', title: '🎄 Christkindlmarkt', desc: 'KOSTENLOS: Weihnachtsstimmung!', type: 'gratis', cat: 'events', url: 'https://www.christkindlmarkt.at/', votes: 350 },
  { brand: 'Silvesterpfad', logo: '🎆', title: '🎆 Silvesterpfad', desc: 'KOSTENLOS: Live-Musik!', type: 'gratis', cat: 'events', url: 'https://www.wien.gv.at/', votes: 300 },
  
  // === STUDENT DEALS ===
  { brand: 'Uni Wien Mensa', logo: '🎓', title: '🎓 Uni Wien Mensa - Günstig', desc: 'Mensa-Essen für Studenten', type: 'rabatt', cat: 'student', url: 'https://univie.ac.at/', votes: 200 },
  { brand: 'TU Wien Mensa', logo: '🔬', title: '🔬 TU Wien Mensa - Günstig', desc: 'Mensa-Essen für Studenten', type: 'rabatt', cat: 'student', url: 'https://tuwien.ac.at/', votes: 200 },
  { brand: 'WU Wien Mensa', logo: '📈', title: '📈 WU Wien Mensa - Günstig', desc: 'Mensa-Essen für Studenten', type: 'rabatt', cat: 'student', url: 'https://wu.ac.at/', votes: 200 },
  { brand: 'AK Wien', logo: '🎪', title: '🎪 AK Wien - Services', desc: 'Gratis Services für Mitglieder!', type: 'gratis', cat: 'service', url: 'https://wien.arbeiterkammer.at/', votes: 200 },
  
  // === MOBILITY ===
  { brand: 'CityBike', logo: '🚲', title: '🚲 CityBike Wien - 30min FREE', desc: 'ERSTE 30 MINUTEN FREI!', type: 'gratis', cat: 'mobilität', url: 'https://www.citybikewien.at/', votes: 300 },
  { brand: 'Wiener Linien', logo: '🚇', title: '🚇 KlimaTicket - 1€/Tag', desc: '365€/Jahr = 1€ pro Tag für ALLE!', type: 'rabatt', cat: 'mobilität', url: 'https://www.wienerlinien.at/', votes: 500 },
  
  // === TRAVEL - DISCOUNTS ===
  { brand: 'ÖBB', logo: '🚂', title: '🚂 ÖBB Sparschiene ab €19,90', desc: 'Günstige Tickets ab €19,90!', type: 'rabatt', cat: 'reisen', url: 'https://www.oebb.at/', votes: 300 },
  { brand: 'WESTbahn', logo: '🚃', title: '🚃 WESTbahn ab €9,90', desc: 'Günstige Tickets!', type: 'rabatt', cat: 'reisen', url: 'https://westbahn.at/', votes: 200 },
  { brand: 'FlixBus', logo: '🚌', title: '🚌 FlixBus ab €4,99', desc: 'Günstige Fernbusse!', type: 'rabatt', cat: 'reisen', url: 'https://www.flixbus.at/', votes: 150 },
  
  // === PARKS & OUTDOOR - FREE ===
  { brand: 'Schönbrunn', logo: '🌳', title: '🌳 Schönbrunner Schlosspark', desc: 'KOSTENLOS!', type: 'gratis', cat: 'outdoor', url: 'https://www.schoenbrunn.at/', votes: 400 },
  { brand: 'Prater', logo: '🎡', title: '🎡 Prater Hauptallee', desc: 'KOSTENLOS!', type: 'gratis', cat: 'outdoor', url: 'https://www.prater.at/', votes: 350 },
  { brand: 'Donauinsel', logo: '🏊', title: '🏊 Donauinsel Baden', desc: 'KOSTENLOS: Baden & Radfahren!', type: 'gratis', cat: 'outdoor', url: 'https://www.wien.gv.at/', votes: 400 },
  { brand: 'Kahlenberg', logo: '🏔️', title: '🏔️ Kahlenberg Aussicht', desc: 'KOSTENLOS: Blick über Wien!', type: 'gratis', cat: 'outdoor', url: 'https://www.wien.gv.at/', votes: 300 },
  
  // === LIBRARIES - FREE ===
  { brand: 'Stadtbibliothek', logo: '📚', title: '📚 Wiener Stadtbibliothek', desc: 'KOSTENLOS: Bücher & Medien!', type: 'gratis', cat: 'bildung', url: 'https://www.wienbibliothek.at/', votes: 200 },
];

function main() {
  console.log('🎯 HIGH QUALITY DEALS');
  console.log('=====================\n');
  
  const deals = DEALS.map((d, i) => ({
    id: `quality-${i + 1}`,
    brand: d.brand,
    logo: d.logo,
    title: d.title,
    description: d.desc,
    type: d.type,
    category: d.cat,
    source: 'Quality Deals',
    url: d.url,
    expires: d.type === 'gratis' ? 'Dauerhaft' : 'Begrenzt',
    distance: 'Wien',
    hot: d.votes > 300,
    isNew: false,
    priority: d.votes > 300 ? 1 : 2,
    votes: d.votes,
    pubDate: new Date().toISOString()
  }));
  
  // Sort by votes
  deals.sort((a, b) => b.votes - a.votes);
  
  console.log(`✅ Created ${deals.length} high quality deals`);
  
  const output = {
    lastUpdated: new Date().toISOString(),
    totalDeals: deals.length,
    deals: deals
  };
  
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/quality-deals.json', JSON.stringify(output, null, 2));
  fs.writeFileSync('output/deals.json', JSON.stringify(output, null, 2));
  fs.copyFileSync('output/deals.json', 'docs/deals.json');
  console.log('💾 Saved!');
}

main();
