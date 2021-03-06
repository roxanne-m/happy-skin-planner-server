'use strict';

const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 containing "Hello, Happy Skin Planner user!"', () => {
    return supertest(app).get('/').expect(200, 'Hello, Happy Skin Planner user!');
  });
});
