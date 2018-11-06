const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
});

app.use(morgan('dev'));
mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true });


// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

const apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// set up our one route to the index.html file
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
});


// start the server on port 8080 (http://localhost:8080)
app.listen(config.port);
console.log(`Magic happens on ${config.port}`);
