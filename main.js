const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { extractMachine } = require('./machine.js')
const fs = require('fs');


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

function random(low, high) {
  return Math.random() * (high - low) + low
}

const extractNameUrlImg = ($) => {
    const product_photos = $('.product-list-photo').toArray();
    return $('.product-list-name').map((i, product) => {
      const a_tag = $(product).find('a');
      return {
        'name' : a_tag.text().trim(),
        'websiteRef' : a_tag.attr('href'),
        'imageUrl' : $(product_photos[i]).find('img').attr('data-src')
      }
    }).get();
}



const scrapePage = async (page, href) => {
  let machines = [];

  try {

    let next_page = href;

    while (true){

      await page.goto(next_page, { waitUntil: 'load' });

      await sleep(random(1000,3000));

      let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    
      let $ = cheerio.load(bodyHTML);


      let index = 0;
      for (let element of extractNameUrlImg($)){
        try {
          await page.goto(element.websiteRef);

          await sleep(random(300,1900));

          let bodyHTML = await page.evaluate(() => document.body.innerHTML);
      
          let $ = cheerio.load(bodyHTML);

          machines.push(Object.assign(element, extractMachine($)));

        } catch (error) {
          console.log(`Error on website ${element.websiteRef}`)
          console.error(error);
        }

        index++;
        if (index == 2){
        	break;
        }
      }

      next_page = $('.fa.fa-chevron-right').parent().attr('href');
      console.log(next_page);
      if (! next_page){
        break;
      }

      break;
    }

  } catch (error) {
      console.error(error);
      return Promise.reject(error);        
  }

  return Promise.resolve(machines);
}


const scrapeUrl = async (url) => {

  let machines = [];

  const browser = await puppeteer.launch(), page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'load' });

  let bodyHTML = await page.evaluate(() => document.body.innerHTML);

  let $ = cheerio.load(bodyHTML);


  const elements = $('.home-cat-links-item.view-default').get();

  let hrefs = [], tasks = [];


  for (let element of elements){

    const href = $(element).attr('href');


    for (let category of categories){

      if (href.match(category)) {
        hrefs.push(href);

        tasks.push(browser.newPage().then( async page => {
          return await scrapePage(page, href);
        }));

      } 
    }
  }
                                                                                                              
  await Promise.all(tasks)
    .then((res) => {
      for (let i = 0; i < hrefs.length; i++) {
        machines = machines.concat(res[i]);
      }
    }).catch( (error) => {
       console.error(error);
    });  

  console.log(machines);

  await browser.close();

  return machines;
}

let categories = [
  'Lave-linge',
  'réfrigérateurs',
  'fours',
  'sèche-linge',
  'lave-vaisselle',
  'tv'
]

categories = categories.map((category) => category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));


(async () => {
  try {

    const url = 'https://www.electromenager-compare.com/';
    const url2 = 'https://www.lcd-compare.com/#';
    
    let data = await scrapeUrl(url2);

    data = data.concat(await scrapeUrl(url));
  
    fs.writeFileSync('data.json', JSON.stringify(data));

  } catch(error) {
 	  console.error(error);
  }

  return;
})();