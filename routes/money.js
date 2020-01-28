const router = require("express").Router();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
  });
const adapter = new FileSync('db.json');
const db = low(adapter);

router.post("/add", function(request, response) {
    const { currency, amount } = request.body;

    let userDb = db.get("users").find({login: request.session.login});
    let user = userDb.value();

    if(!user){
        response.json({ success: false, error: `Пользователь не найден`});
        return;
    }

    const countMoney = (user.balance[currency] || 0) + amount;
    user.balance[currency] = countMoney;

    userDb.assign({...user}).write();
    response.json({ success: true, data: userDb.value()});
});

router.post("/transfer", function(request, response) {
    const { to, currency, amount } = request.body;
    let sourceUserDb = db.get("users").find({login: request.session.login});
    let targetUserDb = db.get("users").find({id: to});
    let sourceUser = sourceUserDb.value();
    let targetUser = targetUserDb.value();

    if(!sourceUser){
        response.json({ success: false, error: `Пользователь не найден`});
        return;
    }

    if(!targetUser){
        response.json({ success: false, error: `Получатель не найден`});
        return;
    }

    if(sourceUser.balance[currency] < amount){
        response.json({ success: false, error: `Не хватает денег для перевода`});
        return;
    }

    sourceUser.balance[currency] = sourceUser.balance[currency] - amount;
    targetUser.balance[currency] = (targetUser.balance[currency] || 0) + amount;
    
    sourceUserDb.assign({...sourceUser}).write();
    targetUserDb.assign({...targetUser}).write();

    response.json({ success: true, data: sourceUserDb.value()});
});

router.post("/convert", function(request, response) {
    
});

module.exports = router;