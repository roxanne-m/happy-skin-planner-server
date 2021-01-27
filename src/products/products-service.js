'use strict';

// This file will store the productsService object
// We will put methods on this object that store our transactions.
const productsService = {
  getAllProducts(knex) {
    return knex.select('*').from('product');
  },

  addProduct(knex, newProduct) {
    return knex('product')
      .insert(newProduct)
      .into('product')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  addWeekUse(knex, newWeekUse) {
    return knex('week_day_use')
      .insert(newWeekUse)
      .into('week_day_use')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getByProductId(knex, product_id) {
    return knex('product').select('*').where('product_id', product_id).first();
  },

  deleteProduct(knex, product_id) {
    return knex('product').where({ product_id }).delete();
  },

  updateProduct(knex, product_id, newProductInfo) {
    return knex('product').where({ product_id }).update(newProductInfo);
  },
};

module.exports = productsService;
