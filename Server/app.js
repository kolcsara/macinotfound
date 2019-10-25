const express = require('express');
const mp3API = require('./routes/mp3API');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', mp3API);

app.listen(5500, () => { console.log('App listens...'); });
