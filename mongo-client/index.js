const express = require('express')
const mongoose = require('mongoose');
const Kitten = require('./kitten');

const DATABASE_CONECTION = 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/test';

mongoose.connect(DATABASE_CONECTION, 
  { 
      // sets how many times to try reconnecting
      reconnectTries: Number.MAX_VALUE,
      // sets the delay between every retry (milliseconds)
      reconnectInterval: 1000 
  }  
);

const app = express()

app.get('/', function (req, res) {
  res.send('Hello Mongo!!! ( ͡° ͜ʖ ͡°)');
})

app.get('/find', function (req, res) {
  Kitten.find(function (err, kittens) {
    if (err) res.status(500).send({ error: err });
    console.log(kittens);
    res.json(kittens);
  })
})

app.get('/insert', function (req, res) {
  var silence = new Kitten({
    name: 'Silence' + Math.random()
  });

  silence.save(function (err, fluffy) {
    if (err) return console.error(err);
    console.log('There is a new random cat');
  });

  res.send('New record is inserted');

})

app.listen(9090, function () {
  console.log('App listening on port 9090!');
})