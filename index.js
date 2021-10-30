const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');


require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middleWare
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnlpi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        console.log('CONNECTED TO DATABASE')
        const database = client.db('Travelo')
        const servicesCollection = database.collection('services')
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.send(result)
        })

        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
        // GET Orders API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // DELETE Orders API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })
    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is Running')
});
app.listen(port, () => {
    console.log('SERVER RUNNING AT', port)
})