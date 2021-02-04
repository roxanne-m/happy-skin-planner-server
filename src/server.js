'use strict';
const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const pg = require('pg'); pg.defaults.ssl = process.env.NODE_ENV === "production"
const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

// use express feature to set a property on the app instance from server.js file
app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
