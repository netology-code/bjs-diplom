require('dotenv').config();

const {
  PORT, PUBLIC_PATH, INDEX_FILE, HOME_FILE,
} = process.env;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync('db.json'));

function setDefaultUser(database) {
  database.defaults({
    users: [
      {
        created_at: '2019-10-15T05:28:25.593Z',
        login: 'oleg@demo.ru',
        password: 'demo',
        id: 1,
        balance: {
          RUB: 1000, USD: 20, EUR: 20, NTC: 3000,
        },
      }, {
        created_at: '2019-11-16T05:28:25.593Z',
        login: 'ivan@demo.ru',
        password: 'demo',
        id: 2,
        netocoins: 100,
        balance: {
          RUB: 20, USD: 0, EUR: 0, NTC: 100,
        },
      }, {
        created_at: '2019-5-14T05:28:25.593Z',
        login: 'petr@demo.ru',
        password: 'demo',
        id: 3,
        balance: {
          RUB: 20000, USD: 300, EUR: 500, NTC: 50000,
        },
      }, {
        created_at: '2020-1-15T05:28:25.593Z',
        login: 'galina@demo.ru',
        password: 'demo',
        id: 4,
        balance: {
          RUB: 30000, USD: 150, EUR: 300, NTC: 20000,
        },
      }, {
        created_at: '2020-2-16T05:28:25.593Z',
        login: 'vladimir@demo.ru',
        password: 'demo',
        id: 5,
        balance: {
          RUB: 60000, USD: 500, EUR: 600, NTC: 90000,
        },
      },
    ],
    favorites: {
      1: { 2: 'Ваня дурачок', 3: 'Пират Петр' },
      2: { 1: 'Чувак, который должен 20к неткойнов', 3: 'Партнёр по бизнесу' },
      3: { 2: 'Важный клиент' },
      5: { 1: 'Важный пацан', 3: 'Дедуля', 4: 'Галя' },
    },
  }).write();
}

if (!db.get('users').value()) setDefaultUser(db);

const app = express();
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['authorized', 'login'],
}));
app.use(morgan('tiny'));
app.use(express.static(`${__dirname}/${PUBLIC_PATH}`));

const api = require('./routes');

app.use(bodyParser.json());
app.use('/', api);
app.use(morgan('tiny'));

app.get('*', (request, response) => {
  if (request.session.authorized) {
    response.sendFile(path.resolve(`${__dirname}/${PUBLIC_PATH}`, HOME_FILE));
  } else {
    response.sendFile(path.resolve(`${__dirname}/${PUBLIC_PATH}`, INDEX_FILE));
  }
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
