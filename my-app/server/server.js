var express = require("express")
const http = require("http")  
const { MongoClient } = require("mongodb");
bodyParser = require('body-parser');

var app = express()

const uri = "mongodb+srv://Danny:kuGQ8J04owk8XidB@cluster0.yhcwz4g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.json() );       // support parsing of incoming JSON data
app.use(express.urlencoded({     // to support URL-encoded data such as form data
  extended: false
})); 

app.use(bodyParser.json());


app.get('/todos', function(req, res) {
  console.log(req.body);
  
  let score = 0.76 + 1 + 0.28;
  async function run() {
    try {
      const db = client.db('db');
      const coll = db.collection('Materials');
      // Query
      // const filter = {};
      const query = coll.find({});
      // console.log(query);

      for (const key in req.body) {
        await query.forEach(function(material) {
          if (material.name === key) {
              score = score + material.score * (parseInt(req.body[key])/100);
          }
        });
      };

    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  // run().catch(console.dir);

  run().then(() => {
    res.send("" + score);
})
});


/*
app.get('/:materialName', function(req, res) {
    let htmlvar = "<p>"
      async function run() {
        try {
          const db = client.db('db');
          const coll = db.collection('Materials');
          // Query
          // const filter = {};
          const query = coll.find({});
          // console.log(query);
  
          await query.forEach(function(material) {
                if (material.name === req.params.materialName) {
                    htmlvar =  htmlvar + "Name: " + material.name + '</br>'
                    + "score: " + material.score + '</br>'
                    + '</br>';
                }
          });
          htmlvar += "</p>"
        } finally {
          // Ensures that the client will close when you finish/error
          // await client.close();
        }
      }
      // run().catch(console.dir);
  
      run().then(() => {
        res.send("list of materials" + htmlvar)
    })
});
*/

app.listen(5000)