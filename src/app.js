'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const productsRouter = require('./products/products-router');
const productsService = require('./products/products-service');
const jsonParser = express.json();

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/products', productsRouter);

// made a new route for updating week use
app.patch('/api/weekly-planner/:week_id', jsonParser, (req, res) => {
  const updatedInfo = req.body;
  const completedToUpdate = updatedInfo;

  productsService
    .updateCompleted(req.app.get('db'), req.params.week_id, completedToUpdate)
    .then((numRowsAffected) => {
      res.status(204).end();
    })
    .catch();
});


app.get('/', (req, res) => {
  res.send('Hello, Happy Skin Planner user!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(error);
});

module.exports = app;
