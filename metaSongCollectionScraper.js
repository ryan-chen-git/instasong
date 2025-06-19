// Auto-scroller code

const scrollContainer = document.querySelector(".x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6");

let lastHeight = 0;
const scrollInterval = setInterval(() => {
  scrollContainer.scrollTo(0, scrollContainer.scrollHeight);

  const newHeight = scrollContainer.scrollHeight;
  if (newHeight === lastHeight) {
    clearInterval(scrollInterval);
    console.log("Done scrolling container.");
  } else {
    lastHeight = newHeight;
  }
}, 1500);


// Song scraping code

const rows = document.querySelectorAll('tr.xb9moi8.xe76qn7.x21b0me.x142aazg.xso031l.x1q0q8m5.x9f619');

const results = [];

for (let row of rows) {
  const title = row.querySelector('td[aria-colindex="1"] div._acho')?.innerText.trim() || "";
  const artist = row.querySelector('td[aria-colindex="2"] span.xsep4xg.x1lku1pv.x1ss5hae')?.innerText.trim() || "";

  const genreCell = row.querySelector('td[aria-colindex="3"]');
  const tempoCell = row.querySelector('td[aria-colindex="4"]');
  const lengthCell = row.querySelector('td[aria-colindex="5"]');

  const valueSelector = 'div.x1n2onr6.x1yc453h.x78zum5.x1nhvcw1.xb9moi8.xe76qn7.x21b0me.x142aazg.x1gzqxud.x108nfp6.x8t9es0.x1fvot60.xo1l8bm.xxio538.xyamay9.xv54qhq.x1l90r2v.xf7dkkf.x6s0dn4';

  const genre = genreCell?.querySelector(valueSelector)?.innerText.trim()
    || genreCell?.innerText.trim()
    || "";

  const tempo = tempoCell?.querySelector(valueSelector)?.innerText.trim()
    || tempoCell?.innerText.trim()
    || "";

  const length = lengthCell?.querySelector(valueSelector)?.innerText.trim()
    || lengthCell?.innerText.trim()
    || "";

  if (title || artist || genre || tempo || length) {
    results.push({ title, artist, genre, tempo, length });

    if (title === "Nami") { // Nami was the last song in the list the the time, obviously will change as MSC list is updated
      console.log("Scraping complete'");
      break;
    }
  }
}

console.log(`Scraped ${results.length} rows up to 'Nami'`);
console.log(results);

const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "meta_sound_collection.json";
link.click();

