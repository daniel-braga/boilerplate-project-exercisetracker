const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.post('/api/users', (req, res) => {
  res.json({
    "username": req.body.username,
    "_id": -1
  })
})

app.get('/api/users', (req, res) => {
  res.json([
    {
      "username": "user1",
      "_id": 1
    },
    {
      "username": "user2",
      "_id": 2
    },
    {
      "username": "user3",
      "_id": 3
    },
    {
      "username": "user4",
      "_id": 4
    }
  ])
})

app.post('/api/users/:_id/exercises', (req, res) => {
  res.json({
    "_id": req.params._id,
    "username": "user1",
    "description": req.body.description,
    "duration": req.body.duration,
    "date": req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
  })
})

app.get('/api/users/:_id/logs', (req, res) => {
  //req.query.from;
  //req.query.to;
  //req.query.limit;

  res.json({
    "_id": req.params._id,
    "username": "user1",
    "count": 2,
    "log": [
      {
        "description": "biking",
        "duration": 40,
        "date": new Date().toDateString()
      },
      {
        "description": "running",
        "duration": 30,
        "date": new Date().toDateString()
      }
    ]
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
