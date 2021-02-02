'use strict';

function makeProductsArray() {
  return [
    {
      product_name: 'First product test!',
    },
    {
      product_name: 'Second product test!',
    },
    {
      product_name: 'Third product test!',
    },
    {
      product_name: 'Fourth product test!',
    },
  ];
}

function makeWeekDayUseArray() {
  return [
    { week_day: 'monday', morning: true, completed: true, week_product: 1 },
    { week_day: 'wednesday', morning: true, completed: false, week_product: 2 },
    { week_day: 'friday', morning: true, completed: false, week_product: 3 },
    { week_day: 'sunday', morning: true, completed: false, week_product: 4 },
  ];
}

module.exports = {
  makeProductsArray,
  makeWeekDayUseArray
};
