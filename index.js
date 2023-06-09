const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xclxsua.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const servicesCollection = client.db("carDoctorDB").collection("services");
    const appointmentsCollection = client.db("carDoctorDB").collection("appointments");

    app.get('/services', async (req, res) => {
      // const options = {
      //   projection: {
      //     _id: 1, title: 1, img: 1, price: 1, service_id: 0, description: 0, facility: 0
      //   },
      // };
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // const options = {
      //   projection: {
      //     _id: 1, title: 1, img: 1, price: 1, service_id: 0, description: 0, facility: 0
      //   },
      // };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    app.get('/appointments', async (req, res) => {
      const query = { email: req.query.email }
      const result = await appointmentsCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/appointments', async (req, res) => {
      const doc = req.body;
      const result = await appointmentsCollection.insertOne(doc);
      res.send(result);
    });

    app.delete('/appointments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await appointmentsCollection.deleteOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Doctor is running!!!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
