const router = require('express').Router();
const getStocks = require('./stocks');
const user = require('./user');
const favorites = require('./favorites');
const money = require('./money');

router.use('/user', user);
router.use('/favorites', favorites);
router.use('/money', money);

router.get("/stocks", function(request, response) {
    getStocks((data) => response.json(data));
});

module.exports = router;
