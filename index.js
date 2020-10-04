const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config()


const port = 5000
const app = express()
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfyjq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });




client.connect(err => {
  const events = client.db("VolunteerDB").collection("activities");
  const userEvents = client.db("VolunteerDB").collection("userEvents");
    app.post('/addEvent',(req,res) => {
        const newEvent = req.body;
        events.insertOne(newEvent)
        .then(result => {
           res.send(result.insertedCount > 0);
        })
    })
      
    app.get('/events',(req,res) =>{
      events.find({})
      .toArray((err,documents) =>{
        res.send(documents);
      })
    })

    app.post('/registerEvent',(req,res) => {
      const newEvent = req.body;
      userEvents.insertOne(newEvent)
      .then(result => {
         res.send(result.insertedCount > 0);
      })
  })
  app.get('/userEvents', (req, res) => {
    userEvents.find({email: req.query.email})
              .toArray((err,documents) =>{
              res.send(documents);
        })

  })
  app.get('/userAllEvents', (req, res) => {
    userEvents.find({})
              .toArray((err,documents) =>{
              res.send(documents);
        })

  })


  app.delete('/deleteUserEvent/:id',(req,res)=>{
    userEvents.deleteOne({_id:ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0);
    })
  })
  

});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(process.env.PORT || port)