'use strict';

// This file will store the productsService object
// We will put methods on this object that store our transactions.
const productsService = {
  getAllProducts(knex) {
    return knex.select('*').from('product').join('week_day_use', 'week_day_use.week_product', '=', 'product.product_id');
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

  updateCompleted(knex, week_id, updatedInfo) {
    return knex('week_day_use').where( 'week_id', week_id ).update(updatedInfo);
  },


};

module.exports = productsService;
