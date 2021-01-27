'use strict';

const knex = require('knex');
const app = require('./app');
const { PORT, DB_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

// use express feature to set a property on the app instance from server.js file
app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
