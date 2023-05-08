const axios = require("axios")
const cheerio = require("cheerio")
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Danny:kuGQ8J04owk8XidB@cluster0.yhcwz4g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const keywords = ['Cotton', 'Polyester', 'Linen', 'Viscose', 'Wool']; // Clothing materials to extract
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
    const $ = cheerio.load(data);
    const materialElements = $('dd');
    // Stores data for all materials
    let materials = new Map();
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
      percent = percent + parseInt(materialObj[key]);
      if (percent <= 100) {
        materialSimp[key] = materialObj[key]
      }
    }
    let score = 0.76 + 1 + 0.28;
    async function run() {
      try {
        const db = client.db('db');
        const coll = db.collection('Materials');
        const query = coll.find({});

        for (const key in materialSimp) {
          await query.forEach(function (materials) {
            if (materials.name === key) {
              score = score + materials.score * (parseInt(materialSimp[key]) / 100);
            }
          });
        };

      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        return {score: score, materials: materials};
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
    let imageUrl = "";
    const imageElements = $('img');
    imageElements.each((index, element) => {
      let imageSrc = $(element).attr('src');
      if (imageSrc.includes('hm.com')) {
        imageUrl = imageSrc;
      }
    });
    return imageUrl;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  scrapeImage,
  scrapeMaterials,
  scrapeName
}