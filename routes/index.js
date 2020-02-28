import router, { use, get } from 'express';
import getStocks from './stocks';
import user from './user';
import favorites from './favorites';
import money from './money';

use('/user', user);
use('/favorites', favorites);
use('/money', money);

get('/stocks', (request, response) => {
  getStocks((data) => response.json(data));
});

export default router;
