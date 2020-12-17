const express = require('express');
const low = require('lowdb');
const getStocks = require('./stocks');
const FileSync = require('lowdb/adapters/FileSync');

const router = express.Router();

const adapter = new FileSync('db.json');
const db = low(adapter);

router.post('/add', (request, response) => {
  let { amount } = request.body;
  const { currency } = request.body;

  amount = Number.parseFloat(amount);
  if (Number.isNaN(amount)) {
    response.json({ success: false, error: 'Ошибка при переводе значения в число' });
    return;
  }

  if (amount < 0) {
    response.json({ success: false, error: 'Невозможно добавить отрицательное число' });
    return;
  }

  if (!['RUB', 'EUR', 'USD', 'NTC'].includes(currency)) {
    response.json({ success: false, error: 'Такая валюта не существует' });
    return;
  }

  const userDb = db.get('users').find({ login: request.session.login });
  const user = userDb.value();

  if (!user) {
    response.json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  const countMoney = (user.balance[currency] || 0) + amount;
  user.balance[currency] = countMoney;

  userDb.assign({ ...user }).write();
  response.json({ success: true, data: userDb.value() });
});

router.post('/transfer', (request, response) => {
  let { amount } = request.body;
  const { to, currency } = request.body;
  const sourceUserDb = db.get('users').find({ login: request.session.login });
  const targetUserDb = db.get('users').find({ id: to });
  const sourceUser = sourceUserDb.value();
  const targetUser = targetUserDb.value();

  amount = Number.parseFloat(amount);
  if (Number.isNaN(amount)) {
    response.json({ success: false, error: 'Ошибка при переводе значения в число' });
    return;
  }

  if (amount < 0) {
    response.json({ success: false, error: 'Невозможно перевести отрицательное число' });
    return;
  }

  if (!currency) {
    response.json({ success: false, error: 'Валюта для перевода не выбрана' });
    return;
  }

  if (!sourceUser) {
    response.json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  if (!targetUser) {
    response.json({ success: false, error: 'Получатель не найден' });
    return;
  }

  if (sourceUser.balance[currency] < amount) {
    response.json({ success: false, error: 'Не хватает денег для перевода' });
    return;
  }

  sourceUser.balance[currency] = (sourceUser.balance[currency] || 0) - amount;
  targetUser.balance[currency] = (targetUser.balance[currency] || 0) + amount;

  sourceUserDb.assign({ ...sourceUser }).write();
  targetUserDb.assign({ ...targetUser }).write();

  response.json({ success: true, data: sourceUserDb.value() });
});

router.post('/convert', (request, response) => {
  const { fromCurrency, targetCurrency } = request.body;
  let { fromAmount } = request.body;

  fromAmount = Number.parseFloat(fromAmount);
  if (Number.isNaN(fromAmount)) {
    response.json({ success: false, error: 'Ошибка при переводе значения в число' });
    return;
  }

  if (fromAmount < 0) {
    response.json({ success: false, error: 'Невозможно конвертировать отрицательное число' });
    return;
  }

  if(!fromCurrency){
    response.json({ success: false, error: 'Исходная валюта не была выбрана' });
    return;
  }
  
  if(!targetCurrency){
    response.json({ success: false, error: 'Целевая валюта не была выбрана' });
    return;
  }

  const userDb = db.get('users').find({ login: request.session.login });
  const user = userDb.value();

  if (!user) {
    response.json({ success: false, error: 'Пользователь не найден' });
    return;
  }

  if (user.balance[fromCurrency] < fromAmount) {
    response.json({
      success: false,
      error: `Не хватает денег для конвертации из ${fromCurrency} в ${targetCurrency}`,
    });
    return;
  }

  if (fromCurrency === targetCurrency) {
    response.json({ success: false, error: 'Нельзя перевести в такую же валюту' });
    return;
  }

  getStocks((data) => {
    if (!data.success) {
      response.json(data);
      return;
    }

    const currency = data.data[`${fromCurrency}_${targetCurrency}`];
    const countConvertedMoney = fromAmount / currency;
    user.balance[fromCurrency] -= fromAmount;
    user.balance[targetCurrency] += countConvertedMoney;

    userDb.assign({ ...user }).write();
    response.json({ success: true, data: userDb.value() });
  });
});

module.exports = router;
