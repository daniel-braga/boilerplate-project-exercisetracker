const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const User = require('./app.js').UserModel

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

const createUser = require('./app.js').createAndSaveUser
app.post('/api/users', (req, res, next) => {
  User.findOne({username: req.body.username}, (error, user) => {
    if (error) {
      return next(error)
    }
    if (user) {
      return next({status: 400, message: "Username already taken"})
    }
    createUser(req.body.username, (error, user) => {
      if (error) {
        return next(error)
      }
      return res.json(user)
    })
  })
})

const getAllUsers = require('./app.js').getAllUsers
app.get('/api/users', (req, res, next) => {
  getAllUsers((error, users) => {
    if (error) {
      return next(error)
    }
    res.json(users);
  });
})

const createAndSaveLog = require('./app.js').createAndSaveLog
app.post('/api/users/:_id/exercises', (req, res, next) => {
  createAndSaveLog(req.params._id, req.body, (error, log) => {
    if (error) {
      return next(error)
    }
    res.json(log);
  })
})

const getLogs = require('./app.js').getLogs
app.get('/api/users/:_id/logs', (req, res, next) => {
  //req.query.from
  //req.query.to
  //req.query.limit

  getLogs(req.params._id, req.query, (error, logs) => {
    if (error) {
      return next(error)
    }
    res.json(logs);
  })
})

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR")
  }
});

// Unmatched routes handler
app.use(function (req, res) {
  if (req.method.toLowerCase() === "options") {
    res.end()
  } else {
    res.status(404).type("txt").send("Not Found")
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
