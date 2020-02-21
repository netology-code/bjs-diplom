const router = require("express").Router();
const multer  = require('multer');
const upload = multer();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
  });
const adapter = new FileSync('db.json');
const db = low(adapter);

router.post("/register",upload.none(), function(request, response) {
    const { login, password } = request.body;
    error = "";
    if(login === "")
        error += 'Поле "Логин" обязательно для заполнения.';

    if(password === "")
        error += ' Поле "Пароль" обязательно для заполнения.';
    
    if(error !== ""){
        response.json({ success: false, data: error});
        return;
    }

    const userDb = db.get("users");
    let user = userDb.find({login}).value();
    if(!user){
        allUsers = userDb.value();
        let maxId = 0;
        allUsers.forEach(element => {
            if(+element.id > maxId)
                maxId = element.id;
        });
        maxId++;
        user = { 
            created_at: new Date().toISOString(), 
            login, 
            password, 
            id: maxId, 
            balance: {RUB: 0, USD: 0, EUR: 0, NTC: 0}
        };
        db.get("users").push(user).write();
        
        request.session.authorized = true;
        request.session.login = login;
        response.json({ success: true, userId: user.id});
    }
    else{
        response.json({ success: false, data: `Логин ${login} уже существует.`});
    }
})

router.post("/login",upload.none(), function(request, response) {
    const { login, password } = request.body;
    error = "";
    if(login === "")
        error += 'Поле "Логин" обязательно для заполнения.';

    if(password === "")
        error += ' Поле "Пароль" обязательно для заполнения.';
    
    if(error !== ""){
        response.json({ success: false, data: error});
        return;
    }

    let user = db.get("users").find({login, password}).value();
    if(!!user){
        request.session.authorized = true;
        request.session.login = login;
        response.json({ success: true, userId: user.id});
    }
    else
        response.json({ success: false, data:`Пользователь c логином ${login} и указанным паролем не найден`});
})

router.post("/logout", function(request, response) {
    if(request.session.authorized){
        delete request.session.authorized;
        delete request.session.login;
        response.json({ success: true});
    }else{
        response.json({ success: false, data: `Пользователь не авторизован`});
    }
})

router.get("/current", function(request, response) {
    let user = db.get("users").find({login: request.session.login}).value();
    if(!!user){
        response.json({ success: true, data: user});
    }
    else
        response.json({ success: false, data: `Пользователь не авторизован`});
})


module.exports = router;