const express = require('express');
const mp3API = require('./routes/mp3API');
const mongo = require('./managers/mongoAcces');

const app = express();
async function start() {
  await mongo.mongoStart();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/', mp3API);

  app.listen(5500, () => { console.log('App listens...'); });
}

start();
