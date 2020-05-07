"use strict"

//libraries
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');
//routes
const users_route = require('./api/routes/users');
const fish_route = require('./api/routes/fish');
const location_route = require('./api/routes/locations');
var app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json()); // IDEA: add limit

//API routes
app.use('/users', users_route);
app.use('/fish', fish_route);
app.use('/locations', location_route);
//Static files
app.use('/public', express.static('public'));

//error handling (should always be last!)
app.use((req, res, next) => {
  console.log(req);
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile("favicon.ico");
});

module.exports = app;