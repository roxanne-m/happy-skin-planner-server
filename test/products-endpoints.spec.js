'use strict';

const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const { post } = require('../src/app');
const app = require('../src/app');
const {
  makeProductsArray,
  makeWeekDayUseArray,
} = require('./products.fixtures');

describe('Products Endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  // move clean the table to beforeEach line 25
  before('clean the table', () =>
    db.raw('TRUNCATE product, week_day_use RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE product, week_day_use RESTART IDENTITY CASCADE')
  );

  context('Given there are products in the database', () => {
    const testProduct = makeProductsArray();

    beforeEach('insert products', () => {
      return db.into('product').insert(testProduct);
    });

    it('responds with 200 and all of the products', () => {
      return supertest(app)
        .get('/api/products')
        .expect(200)
        .expect((res) => {
          for (const i in res.body) {
            let product = res.body[i];
            expect(product).to.satisfy((product) =>
              testProduct.find((p) => p.product_name === product.product_name)
            );
          }
        });
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
        const productId = 3;
        const expectedProduct = testProduct[productId - 1];

        return supertest(app)
          .get(`/api/products/${productId}`)
          .expect(200)
          .expect((res) => {
            return res.body.product_name === expectedProduct.product_name;
          });
      });
    });
  });
  //////////////////////////////////////////////////////////////////////////////
  describe('Post /api/products', () => {
    context('Given there are products in the database', () => {
      const testProduct = makeProductsArray();

      beforeEach('insert products', () => {
        db.into('product')
          .insert(testProduct)
          .returning('*')
          .then((data) => console.log('after inserting data', data));
        // return db.into('product').insert(testProduct);
      });

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
              error: { message: `Missing '${field}' in request body` },
            });
        });
      });
    });
  });

  describe(`DELETE /api/products/:product_id`, () => {
    context(`Given no products`, () => {
      it(`responds with 404`, () => {
        const productId = 987654321;
        return supertest(app)
          .delete(`/api/products/${productId}`)
          .expect(404, { error: { message: `Product doesn't exist` } });
      });
    });

    context('Given there are products in the database', () => {
      const testProduct = makeProductsArray();

      beforeEach('insert products', () => {
        return db.into('product').insert(testProduct);
      });
      it('responds with 204 and removes the product', () => {
        const idToRemove = 2;
        let deletedProduct = testProduct.find(
          (product) => product.id === idToRemove
        );
        const expectedProducts = testProduct.filter(
          (product) => product.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/products/${idToRemove}`)
          .send()
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/products`)
              .then((res) => {
                // checks if each response from server exists in our testProducts array
                for (const i in res.body) {
                  expect(res.body[i]).to.satisfy(
                    (p) =>
                      testProduct.find((p2) => {
                        return p.product_name === p2.product_name;
                      }) !== undefined
                  );
                }

                // checking if deleted product was actually deleted
                expect(res.body).to.satisfy((products) => {
                  return !products.find((p) => p.product_id === idToRemove);
                });
              })
          );
      });
    });
  });

  describe(`PATCH /api/products/:product_id`, () => {
    context(`Given no products`, () => {
      it(`responds with 404`, () => {
        const productId = 1234567;
        return supertest(app)
          .delete(`/api/products/${productId}`)
          .expect(404, { error: { message: `Product doesn't exist` } });
      });
    });

    // //////////////////////////////////////////////////////////////////////
    context('Given there are products in the database', () => {
      const testProduct = makeProductsArray();

      beforeEach('insert products', () => {
        // db.select('*').from('product').then((data) => console.log( 'before truncating data', data))
        // db.raw('TRUNCATE product, week_day_use RESTART IDENTITY CASCADE')
        // db.select('*').from('product').then((data) => console.log( 'after truncating data', data))
        db.into('product')
          .insert(testProduct)
          .returning('*')
          .then((data) => console.log('after inserting data', data));
        return db.into('product').insert(testProduct);
      });

      it.only('responds with 204 and update the article', () => {
        const idToUpdate = 1;
        const updateProduct = {
          product_name: 'updated product name',
        };

        const expectedProduct = {
          id: idToUpdate,
          ...updateProduct,
        }; 
        return (
          supertest(app)
            .patch(`/api/products/${idToUpdate}`)
            .send(updateProduct)
            .expect(204)
            .then((res) =>
              supertest(app)
                .get(`/api/products/${idToUpdate}`)
                .expect(expectedProduct)
            )
        );
      });
    });
  });
});
