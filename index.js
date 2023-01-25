const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require("dotenv").config();


// middleware
const app = express();
const port = process.env.PORT || 5000;


// mongodb connection 
const uri = "mongodb+srv://storedata:ayw4AJOgzeEFMgu7@cluster0.tfoqdw4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const dataCollection = client.db("formdata").collection("storedata");

      app.get("/get-data", async(req,res)=>{
        const result = await dataCollection.find({}).toArray();
        res.send(result)
      })    
      app.post("/store-data", async(req,res)=>{
          const data = req.body;
          const result = await dataCollection.insertOne(data);
          res.send(result)    
      })
      app.patch("/update-data/:id", async(req,res)=>{
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: ObjectId(id)};      
        const options = { upsert: true };
        const updateDoc = {
          $set: data,
        };
        const result = await dataCollection.updateOne(filter, updateDoc, options);       
        res.send(result);
      })
    } finally {
    }
  }
  run().catch(console.dir);


app.use(cors());
app.use(express.json());
// root api 
app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})