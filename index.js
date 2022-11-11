const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
// const jwt = require('jsonwebtoken')

const app = express();
const port = process.env.PORT || 4000;


// middle wears
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dqljuns.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run()
{
    try {
        const serviceCollection = client.db('homeMade').collection('services');

        app.get('/services', async (req, res) => {
            const size = parseInt(req.query.size);
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(size).toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })
    }
    finally {

    }
}

run().catch(err => console.log(err))

app.get('/', (req, res) =>
{
    res.send('home made server is running')
})

app.listen(port, () =>
{
    console.log(`Home made service server ${port}`)
})