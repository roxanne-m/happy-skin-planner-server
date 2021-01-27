'use strict';

const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const { post } = require('../src/app');
const app = require('../src/app');
const { makeProductsArray } = require('./products.fixtures');

describe('Products Endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE product, week_day_use RESTART IDENTITY CASCADE')
  );

  context('Given there are products in the database', () => {
    const testProduct = makeProductsArray();

    beforeEach('insert products', () => {
      return db.into('product').insert(testProduct);
    });

    it('responds with 200 and all of the products', () => {
      return supertest(app).get('/api/products').expect(200, testProduct);
    });
  });

  describe('GET /api/products/:product_id', () => {
    context('Given no articles', () => {
      it('responds with 404', () => {
        const testProductId = 123456789;
        return supertest(app)
          .get(`/api/products/${testProductId}`)
          .expect(404, { error: { message: `Product doesn't exist` } });
      });
    });

    context('Given there are products in the database', () => {
      const testProduct = makeProductsArray();

      beforeEach('insert products', () => {
        return db.into('product').insert(testProduct);
      });

      it('GET /api/products/:product_id responds with 200 and the specified product', () => {
        const productId = 2;
        const expectedProduct = testProduct[productId - 1];

        return supertest(app)
          .get(`/api/products/${productId}`)
          .expect(200, expectedProduct);
      });
    });
  });

  describe.only('Post /api/products', () => {
    it('creates a product, responding with 201 and the new product', function () {
      //   mocha method where we specify how many times to attempt the test before counting it as a failure
      this.retries(3);
      const newProductTest = {
        product_name: 'Test new product',
      };

      return supertest(app)
        .post('/api/products')
        .send(newProductTest)
        .expect(201)
        .expect((res) => {
          expect(res.body.product_name).to.eql(newProductTest.product_name);
        })
        .then((postRes) => {
          supertest(app)
            .get(`/api/products/${postRes.body.product_id}`)
            .expect(postRes.body);
        });
    });
    const requiredFields = ['product_name'];
    requiredFields.forEach((field) => {
      const newProduct = {
        product_name: 'Test new product',
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newProduct[field];

        return supertest(app)
          .post('/api/products')
          .send(newProduct)
          .expect(400, {
            error: { message: `Missing '${field}' is request body` },
          });
      });
    });
  });
});
