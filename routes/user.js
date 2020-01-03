const router = require("express").Router();
const multer  = require('multer');
const upload = multer();
const uniqid = require('uniqid');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
  });
const adapter = new FileSync('db.json');
const db = low(adapter);

router.post("/register",upload.none(), function(request, response) {
    const { name, email, password } = request.body;
    error = {};
    if(name === "")
        error.name = [ 'Поле Имя обязательно для заполнения.' ];

    if(email === "")
        error.email = [ 'Поле E-Mail адрес для заполнения.' ];

    if(password === "")
        error.password = [ 'Поле Пароль обязательно для заполнения.' ];
    
    if(JSON.stringify(error) !== "{}")
        response.json({ success: false, error});

    let user = db.get("users").find({email}).value();
    if(!user){
        user = { 
            created_at: new Date().toISOString(), 
            name, 
            email, 
            password, 
            id:uniqid(), 
            isAuthorized:true,
            balance: {RUB: 0, USD: 0, EUR: 0, NTC: 0}
        };
        db.get("users").push(user).write();
        response.json({ success: true, user});
    }
    else{
        response.json({ success: false, error: { email:`E-Mail адрес ${email} уже существует.`}});
    }
})

router.post("/login",upload.none(), function(request, response) {
    const { email, password } = request.body;
    let user = db.get("users").find({email, password});
    if(!!user.value()){
        user.assign({isAuthorized: true}).write();
        response.json({ success: true, user: user.value()});
    }
    else
        response.json({ success: false, error:`Пользователь c email ${email} и паролем ${password} не найден`});
})

router.post("/logout", function(request, response) {
    db.get("users").find({isAuthorized: true}).assign({isAuthorized: false}).write();
    response.json({ success: true});
})

router.get("/current", function(request, response) {
    let user = db.get("users").find({isAuthorized: true});
    let userValue = user.value();
    response.json({ success: !!userValue, user: userValue });
})


module.exports = router;