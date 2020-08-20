const router = require('express').Router();
const multer = require('multer');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const upload = multer();
const adapter = new FileSync('db.json');
const db = low(adapter);

router.post('/register', upload.none(), (request, response) => {
  const { login, password } = request.body;
  let error = '';
  if (login === '') {
    error += 'Поле "Логин" обязательно для заполнения.';
  }

  if (password === '') {
    error += ' Поле "Пароль" обязательно для заполнения.';
  }

  if (error !== '') {
    response.json({ success: false, error: error });
    return;
  }

  const userDb = db.get('users');
  const user = userDb.find({ login }).value();
  if (!user) {
    const allUsers = userDb.value();
    let maxId = 0;
    allUsers.forEach((element) => {
      if (+element.id > maxId) {
        maxId = element.id;
      }
    });
    maxId += 1;
    const registerUser = {
      created_at: new Date().toISOString(),
      login,
      password,
      id: maxId,
      balance: {
        RUB: 0,
        USD: 0,
        EUR: 0,
        NTC: 0,
      },
    };
    db.get('users').push(registerUser).write();

    request.session.authorized = true;
    request.session.login = login;
    response.json({ success: true, userId: registerUser.id });
  } else {
    response.json({ success: false, error: `Логин ${login} уже существует.` });
  }
});

router.post('/login', upload.none(), (request, response) => {
  const { login, password } = request.body;
  let error = '';
  if (login === '') {
    error += 'Поле "Логин" обязательно для заполнения.';
  }

  if (password === '') {
    error += ' Поле "Пароль" обязательно для заполнения.';
  }

  if (error !== '') {
    response.json({ success: false, error: error });
    return;
  }

  const user = db.get('users').find({ login, password }).value();
  if (user) {
    request.session.authorized = true;
    request.session.login = login;
    response.json({ success: true, userId: user.id });
  } else {
    response.json({ success: false, error: `Пользователь c логином ${login} и указанным паролем не найден` });
  }
});

router.post('/logout', (request, response) => {
  if (request.session.authorized) {
    delete request.session.authorized;
    delete request.session.login;
    response.json({ success: true });
  } else {
    response.json({ success: false, error: 'Пользователь не авторизован' });
  }
});

router.get('/current', (request, response) => {
  const user = db.get('users').find({ login: request.session.login }).value();
  if (user) {
    response.json({ success: true, data: user });
  } else {
    response.json({ success: false, error: 'Пользователь не авторизован' });
  }
});

module.exports = router;
