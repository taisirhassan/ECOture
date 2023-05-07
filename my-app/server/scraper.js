const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
var request = require("request")
var rp = require('request-promise');
bodyParser = require('body-parser');

// URL of the website to scrape
const url = 'https://www2.hm.com/en_ca/productpage.0993840013.html';

const keywords = ['Cotton', 'Polyester', 'Linen', 'Viscose', 'Elastane'];

const scrapeName = async () => {
  try {
      // Fetch HTML of the page we want to scrape
      const {data} = await axios.get(url);
      // Load HTML we fetched in the previous line
      const $ = cheerio.load(data);
      const name = $('h1').text();
      console.log(name);

    } catch (err) {
      console.error(err);
    }
}

const scrapeMaterials = async () => {
    try {
        // Fetch HTML of the page we want to scrape
        const {data} = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // Select all the list items in plainlist class
        const materialElements = $('dd');
        // Stores data for all countries
        var materials = new Map();
        // Use .each method to loop through the li we selected
        materialElements.each((index, element) => {
            // Object holding data for each country/jurisdiction
            const text = $(element).text();
            keywords.forEach((keyword) => {
                if (text.includes(keyword)) {
                  // Extract percentage of material
                    var percent = "";
                    const index = text.lastIndexOf(keyword);
                    if (index !== -1) {
                      percent = text.substring(index+keyword.length+1, index+keyword.length+4).replace("%", "");
                    }
                    if (percent != "") {
                      // Populate materials array with material data
                      materials.set(keyword, percent);
                    }
                }
            });
        });
        // Logs materials array to the console
        console.dir(materials);

        let materialObj = Object.fromEntries(materials);
        let materialSimp = {};
        let percent = 0;

        for (const key in materialObj) {
          percent = percent + parseInt(materialObj[key]);
          if (percent <= 100) {
            materialSimp[key] = materialObj[key]
          }
        }
        rp({
          url: 'http://localhost:5000/todos',
          method: "GET",
          body: materialSimp,
          json: true,
        }).then(function (parsedBody) {
          console.log("The score is: " + parsedBody);
          // POST succeeded...
      })
    } catch (err) {
      console.error(err);
    }
}

const scrapeImage = async () => {
    try {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        var imageUrl = "";
          const imageElements = $('img');
          imageElements.each((index, element) => {
            const imageSrc = $(element).attr('src');
            if (imageSrc.includes('hm.com')) {
              imageUrl = imageSrc;
            }
          });
          downloadImage(imageUrl, "test");
    } catch (err) {
      console.error(err);
    }
}

// Function to download an image given its URL
const downloadImage = async (imageUrl, imageName) => {
  try {
    const response = await axios.get(imageUrl, {responseType: 'stream'});
    const writer = fs.createWriteStream(imageName + '.png');
    response.data.pipe(writer);
    console.log(`Downloaded: ${imageName}`);
  } catch (error) {
    console.error(`Error downloading ${imageName}:`, error);
  }
};

/*
fetch('http://localhost:5000/todos', {
   headers: {
      'Accept': 'application/json'
   }
})
   .then(response => response.text())
   .then(text => console.log(text))
*/

var propertiesObject = { field1:'test1', field2:'test2' };

scrapeName();
scrapeMaterials();

