'use strict';

const path = require('path'); //creates proper string representing path to your file.
const express = require('express');
const xss = require('xss');
const productsService = require('./products-service');

const productsRouter = express.Router(); //used when you want to create a new router object in your program to handle requests.
const jsonParser = express.json(); //parses incoming requests with JSON payloads and is based on body-parser

const productFormat = (product) => ({
  product_id: product.product_id,
  product_name: xss(product.product_name),
  product_user: product.product_user,
});

// TODO: when authentication is ready, use a real id instead of 1

productsRouter
  .route('/')
  .get((req, res, next) => {
    productsService
      .getAllProducts(req.app.get('db'))
      .then((product) => {
        let products = [];

        for (let p of product) {
          let found = products.find((x) => x.product_id === p.product_id);

          if (!found) {
            let allRows = product.filter((x) => x.product_id === p.product_id);

            let newProduct = productFormat(p);
            newProduct.days = {};

            for (let row of allRows) {
              newProduct.days[row.week_day] = {
                morning: row.morning,
                week_id: row.week_id,
                completed: row.completed,
              };
            }
            products.push(newProduct);
          }
        }
        res.json(products);
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    //  created new variable named 'days' and stored in an object
    const { product_name, morning, days } = req.body;
    const newProduct = { product_name };
   

    if (!product_name) {
      return res.status(400).json({
        error: { message: `Missing 'product_name' in request body` },
      });
    }

    productsService
      .addProduct(req.app.get('db'), newProduct)
      .then((product) => {
        // for loop surrounding object only week_product & morning only & incorporate nested if statement that changes week_day
        // create array to store objects of week day use
        const daysToInsert = [];
        // for loop to iterate through the days passed in
        for (const key in days) {
          const val = days[key];
          // if statement that only executes if true, and pushes the days into object
          if (val) {
            // newWeekUse[key] = days[key]
            daysToInsert.push({
              week_product: product.product_id,
              morning: morning,
              week_day: key, //key is mon, tues, etc.
            });
          }
        }

        productsService
          .addWeekUse(req.app.get('db'), daysToInsert)
          .then((dayUse) => {
            res
              .status(201)
              .location(
                path.posix.join(req.originalUrl + `${product.product_id}`)
              )
              .json(productFormat(product));
          });
      })
      .catch(next);
  });

productsRouter
  .route('/:product_id')
  .all((req, res, next) => {
    productsService
      .getByProductId(req.app.get('db'), req.params.product_id)
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            error: { message: `Product doesn't exist` },
          });
        }
        res.product = product; // save the product for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(productFormat(res.product));
  })

  .delete((req, res, next) => {
    productsService
      .deleteProduct(req.app.get('db'), req.params.product_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });


/***** For future features that I want to incorporate into my app. User will be able to update product name *******/
// .patch(jsonParser, (req, res, next) => {
//   const updatedInfo = req.body;
//   const completedToUpdate = updatedInfo;

//   const numberOfValues = Object.values(completedToUpdate).filter(Boolean)
//     .length;
//   if (numberOfValues === 0) {
//     return res.status(400).json({
//       error: { message: 'Something went wrong.' },
//     });
//   }

//   productsService
//     .updateCompleted(
//       req.app.get('db'),
//       req.params.product_id,
//       completedToUpdate
//     )
//     .then((numRowsAffected) => {
//       res.status(204).end();
//     })
//     .catch(next);
// })

module.exports = productsRouter;
