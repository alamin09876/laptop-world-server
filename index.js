const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config();

app.use(cors())
app.use(express.json())
// docPortal
// jVbZMY64PRrncRsv

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dotnzuk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {

    const usersCollection = client.db('laptopWorld').collection('users')
    const productsCollection = client.db('laptopWorld').collection('products')
    const bookingsCollection = client.db('laptopWorld').collection('bookings')
    const adverticesCollection = client.db('laptopWorld').collection('advertices')
    const categoriesCollection = client.db('laptopWorld').collection('categories')

    app.post('/categories', async (req, res) => {
      const category = req.body;
      const result = await categoriesCollection.insertOne(category);
      res.send(result)
    })

    app.get('/categories', async (req, res) => {
      const users = await categoriesCollection.find().toArray()
      res.send(users)
    })
    app.get('/categoryProduct/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { categoryId: id }
      const users = await productsCollection.find(query).toArray()
      res.send(users)
      console.log(users);
    })
    app.get('/userVerify/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await usersCollection.findOne(query);

      res.send(users);
    });

    app.get('/advertice', async (req, res) => {
      const query = { isAdvertice: true }
      const adverticeProduct = await productsCollection.find(query).toArray()
      res.send(adverticeProduct)
    })

// users
    app.get('/users', async (req, res) => {
      const query = {displayUser : 'user'}
      const users = await usersCollection.find(query).toArray()
      res.send(users)
    })
    app.get('/sellers', async (req, res) => {
      const query = { displayUser : 'seller'}
      const users = await usersCollection.find(query).toArray()
      res.send(users)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user)
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })
    app.get('/products', async (req, res) => {
      const query = {}
      const products = await productsCollection.find(query).toArray()
      res.send(products)
    })

    app.get('/products/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product)
    })
    //advertice
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = req.query;
      const filter = { _id: ObjectId(id) }
      let result
      if (query?.advertice) {
        result = await productsCollection.updateOne(filter, { $set: { isAdvertice: true } })

      }
      res.send(result)
    })
    app.get('/productsid/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product)
    })
    app.get('/productsid', async (req, res) => {
      const query = {}
      const products = await productsCollection.find(query).toArray()
      res.send(products)
    })


    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const product = req.body;
      const option = { upsert: true }
      const updateProduct = {
        $set: {
          price: product.price,
          location: product.location,

        }
      }
      const result = await productsCollection.updateOne(filter, updateProduct, option)
      res.send(result)
    })

    app.put('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id : ObjectId(id)}
      const product = req.body;
      const option = {upsert : true}
      const updateProduct = {
        $set : {
          isAdvertice : product.isAdvertice,

        }
      }
      const result = await productsCollection.updateOne(filter, updateProduct, option)
      res.send(result)
    })

   
    app.delete('/userDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })
    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log(product)
      const result = await productsCollection.insertOne(product);
      res.send(result)
    })
    // Bookings 

    app.get('/bookings', async (req, res) => {
      const query = {}
      const bookings = await bookingsCollection.find(query).toArray()
      res.send(bookings)
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body
      const bookings = await bookingsCollection.insertOne(booking)
      res.send(bookings)
    })




  }
  finally {

  }
}
run().catch(console.log);

app.get('/', (req, res) => {
  res.send('Doctors portal server is running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})