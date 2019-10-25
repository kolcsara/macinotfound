var express = require('express');
var mp3API = require('./routes/mp3API');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', mp3API);

app.listen(5500,() => {console.log('App listens...');});
