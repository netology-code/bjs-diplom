const express = require('express');
const getStocks = require('./stocks');
const user = require('./user');
const favorites = require('./favorites');
const money = require('./money');

const router = express.Router();
router.use('/user', user);
router.use('/favorites', favorites);
router.use('/money', money);

router.get('/stocks', (request, response) => {
  getStocks((data) => response.json(data));
});

module.exports = router;
