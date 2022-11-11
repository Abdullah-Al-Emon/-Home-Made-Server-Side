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

        app.post('/services', async (req, res) => {
            const reviews = req.body;
            const result = await serviceCollection.insertOne(reviews);
            res.send(result);
        })

        const reviewCollection = client.db('homeMade').collection('reviews');

        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            // const decoded = req.decoded;
            // console.log(decoded)
            // if(decoded.email !== req.query.email){
            //     res.status(403).send({message: 'unauthorized access'})
            // }
            let query = {};
            if(req.query.email){
                query ={
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        } )

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
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