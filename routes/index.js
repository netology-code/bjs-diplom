import express from 'express';
import getStocks from './stocks';
import user from './user';
import favorites from './favorites';
import money from './money';

const router = express.Router();
router.use('/user', user);
router.use('/favorites', favorites);
router.use('/money', money);

router.get('/stocks', (request, response) => {
  getStocks((data) => response.json(data));
});

module.exports = router;
