const client = require('superagent');
const $ = require('cheerio');

(async () => {
//   46 = Lux slabs
  const resp = await client.get('https://my.frantech.ca/cart.php?gid=46');

// Product 1 = 256gb block
  const sliceSel = $('#product1 .package-qty', resp.text);
  const sliceText = sliceSel.text().trim();

  let availableCount = parseInt(sliceText.split(' ')[0], 10);
  
  // Sanity check for unspecified number of available stock.
  // This rarely happens to LU region. Grab as many slices as you can!
  if(sliceSel.length == 0) {
    availableCount = Infinity;
  }
  console.log('Selector text: %o', sliceText);
  console.log('Inferred count: %o', availableCount);

  if(availableCount > 0) {
    console.log('LUX Slabs are in stock!');
    // Send webhook
    await client.post(`${process.env.WEBHOOK_URL}`, {"content": `${availableCount} LUX slabs are in stock! https://my.frantech.ca/cart.php?gid=46`})
  }
})();


