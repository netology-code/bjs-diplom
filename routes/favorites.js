import express from 'express';

const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

router.get('/', (request, response) => {
  const user = db.get('users').find({ login: request.session.login }).value();

  if (!user) {
    response.json({ success: false, data: 'Пользователь не найден' });
    return;
  }

  const favorites = db.get('favorites').value()[user.id];
  response.json({ success: true, data: favorites || {} });
});

router.post('/add', (request, response) => {
  const { id, name } = request.body;
  const user = db.get('users').find({ login: request.session.login }).value();

  if (!user) {
    response.json({ success: false, data: 'Пользователь не найден' });
    return;
  }

  if (id === '' || name === '') {
    response.json({ success: false, data: 'Поля для ввода должны быть заполенны' });
    return;
  }

  const favorites = db.get('favorites').value()[user.id] || {};
  if (favorites[id]) {
    response.json({ success: false, data: 'Такой пользователь уже есть в списке' });
    return;
  }

  if (id === user.id) {
    response.json({ success: false, data: 'Нельзя добавить себя в избранное' });
    return;
  }

  favorites[id] = name;
  db.set(`favorites.${user.id}`, favorites).write();
  response.json({ success: true, data: db.get('favorites').value()[user.id] });
});

router.post('/remove', (request, response) => {
  const { id } = request.body;
  const user = db.get('users').find({ login: request.session.login }).value();

  if (!user) {
    response.json({ success: false, data: 'Пользователь не найден' });
    return;
  }

  const favorites = db.get('favorites').value()[user.id];
  if (!favorites[id]) {
    response.json({ success: false, data: 'Удаляемый пользователь не найден' });
    return;
  }

  delete favorites[id];

  db.set(`favorites.${user.id}`, favorites).write();
  response.json({ success: true, data: db.get('favorites').value()[user.id] || {} });
});

module.exports = router;
