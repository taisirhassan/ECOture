const axios = require("axios")
const cheerio = require("cheerio")
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Danny:kuGQ8J04owk8XidB@cluster0.yhcwz4g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// const keywords = ['Cotton', 'Polyester', 'Linen', 'Viscose', 'Wool']; // Clothing materials to extract for H&M 
const keywords = ['cotton', 'polyester', 'linen', 'viscose', 'wool']; // Clothing materials to extract for Old Navy 
const config = {
  header: {
    "Access-Control-Allow-Origin": "*"
  },
};
const scrapeName = async (url) => {
  try {
    // Fetch HTML of the page we want to scrape
    let {data} = await axios.get(url, config);
    // Load HTML fetched in the previous line
    let $ = cheerio.load(data);
    // Select all the list items in the h1 class
    let name = $('h1').text();
    return name;
  } catch (err) {
    console.error(err);
  }
}
const scrapeMaterials = async (url) => {
  try {
    let {data} = await axios.get(url, config);
    // without xml :ture returned html would be incomplete
    const $ = cheerio.load(data, {
      xml: true,
    });
    const materialElements = $("button:contains('Materials & Care') + div div div ul li:first-child span");
    //const materialElements = $('h3 + ul li p'); // for H & M
    //const materialElements = $('h3')
    // Stores data for all materials
    let materials = new Map();
    // ssconsole.log(data)
    materialElements.each((index, element) => {
      let text = $(element).text();
      keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          // Extract percentage of material
          let percent = "";
          const index = text.lastIndexOf(keyword);
          if (index !== -1) {
            percent = text.substring(index + keyword.length + 1, index + keyword.length + 4).replace("%", "");
          }
          if (percent !== "") {
            // Populate materials dictionary
            materials.set(keyword, percent);
          }
        }
      });
    });
    let materialObj = Object.fromEntries(materials);
    let materialSimp = {};
    let percent = 0;

    for (const key in materialObj) {
    // total percentage of materialSimp can't go over 100
      percent = percent + parseInt(materialObj[key]);
      if (percent <= 100) {
        materialSimp[key] = materialObj[key]
      }
    }
    let score = 0.76 + 1 + 0.28;
    async function run() {
      try {
        // open connection to mongodb
        await client.connect();
        // find a database call "db"
        const db = client.db('db');
        const coll = db.collection('Materials');
        const query = coll.find({});

        console.log(materialSimp)
        //console.log(query)
        for (const key in materialSimp) {
          await query.forEach(function (materials) {
            // materials here is from the mongodb, it is all uppercase
            if (materials.name === key.toUpperCase()) {
              score = score + materials.score * (parseInt(materialSimp[key]) / 100);
            }
          });
        };

      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return {materialScore: score, materialList: materialSimp};
      }
    }
    // run().catch(console.dir);
    return await run();
  } catch (err) {
  console.error(err);
}
}

const scrapeImage = async (url) => {
  try {
    let {data} = await axios.get(url, config);
    const $ = cheerio.load(data);
    //const imageElements = $('img');
    // get the first <img> that contains the word webcontent in its src attribute
    const imageElements = $("img[src*='webcontent']")[0];
    let imageSrc = $(imageElements).attr('src');
    // need "https://" as part of the image link for the <img> tag to work!!!
    let imageUrl = 'https://oldnavy.gapcanada.ca'.concat(imageSrc);
    return imageUrl;
    /*
    imageElements.each((index, element) => {
      let imageSrc = $(element).attr('src');
      // if (imageSrc.includes('hm.com'))
      if (imageSrc.includes('webcontent')) {
        imageUrl = 'https://oldnavy.gapcanada.ca'.concat(imageSrc);
        console.log(imageUrl);
      }
    });
    return imageUrl;
    */
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  scrapeImage,
  scrapeMaterials,
  scrapeName
}