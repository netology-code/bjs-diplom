const router = require("express").Router();
const getStocks = require('./stocks');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
  });
const adapter = new FileSync('db.json');
const db = low(adapter);

router.post("/add", function(request, response) {
    let { currency, amount } = request.body;

    amount = Number.parseFloat(amount);
    console.log(amount);
    if(Number.isNaN(amount)){
        response.json({ success: false, data: 'Ошибка при переводе значения в число'});
        return;
    }

    if(amount < 0){
        response.json({ success: false, data: 'Невозможно добавить отрицательное число'});
        return;
    }

    if(!["RUB", "EUR", "USD", "NTC"].includes(currency)){
        response.json({ success: false, data: 'Такая валюта не существует'});
        return;
    }

    let userDb = db.get("users").find({login: request.session.login});
    let user = userDb.value();

    if(!user){
        response.json({ success: false, data: 'Пользователь не найден'});
        return;
    }

    const countMoney = (user.balance[currency] || 0) + amount;
    user.balance[currency] = countMoney;

    userDb.assign({...user}).write();
    response.json({ success: true, data: userDb.value()});
});

router.post("/transfer", function(request, response) {
    let { to, currency, amount } = request.body;
    let sourceUserDb = db.get("users").find({login: request.session.login});
    let targetUserDb = db.get("users").find({id: to});
    let sourceUser = sourceUserDb.value();
    let targetUser = targetUserDb.value();

    amount = Number.parseFloat(amount);
    if(Number.isNaN(amount)){
        response.json({ success: false, data: 'Ошибка при переводе значения в число'});
        return;
    }

    if(amount < 0){
        response.json({ success: false, data: 'Невозможно перевести отрицательное число'});
        return;
    }

    if(!sourceUser){
        response.json({ success: false, data: 'Пользователь не найден'});
        return;
    }

    if(!targetUser){
        response.json({ success: false, data: 'Получатель не найден'});
        return;
    }

    if(sourceUser.balance[currency] < amount){
        response.json({ success: false, data: 'Не хватает денег для перевода'});
        return;
    }

    sourceUser.balance[currency] = sourceUser.balance[currency] - amount;
    targetUser.balance[currency] = (targetUser.balance[currency] || 0) + amount;
    
    sourceUserDb.assign({...sourceUser}).write();
    targetUserDb.assign({...targetUser}).write();

    response.json({ success: true, data: sourceUserDb.value()});
});

router.post("/convert", function(request, response) {
    let { fromCurrency, targetCurrency, fromAmount } = request.body;

    fromAmount = Number.parseFloat(fromAmount);
    if(Number.isNaN(fromAmount)){
        response.json({ success: false, data: 'Ошибка при переводе значения в число'});
        return;
    }

    if(fromAmount < 0){
        response.json({ success: false, data: 'Невозможно конвертировать отрицательное число'});
        return;
    }
    
    let userDb = db.get("users").find({login: request.session.login});
    let user = userDb.value();

    if(!user){
        response.json({ success: false, data: 'Пользователь не найден'});
        return;
    }

    if(user.balance[fromCurrency] < fromAmount){
        response.json({
            success: false, 
            data: `Не хватает денег для конвертации из ${fromCurrency} в ${targetCurrency}`
        });
        return;
    }

    if(fromCurrency === targetCurrency){
        response.json({success: false, data: 'Нельзя перевести в такую же валюту'});
        return;
    }

    getStocks((data) => {
        if(!data.success){
            response.json(data)
            return;
        }

        currency = data.data[`${fromCurrency}_${targetCurrency}`];
        const countConvertedMoney = fromAmount / currency;
        user.balance[fromCurrency] -= fromAmount;
        user.balance[targetCurrency] += countConvertedMoney;

        userDb.assign({...user}).write();
        response.json({ success: true, data: userDb.value()});
    });
});

module.exports = router;