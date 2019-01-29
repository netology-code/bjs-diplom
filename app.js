const express = require('express'),
    app = express(),
    market = require('./src/stocks'),
    profile = require('./src/profile'),
    jwt = require('./src/jwt'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    PORT = process.env.PORT || 1337;

const handleError = (error, res) => {
    console.error(error);
    res.status(error.code || 500);
    res.send(error);
};

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        const decoded = await jwt.verify(token);
        const user = await profile.findById(decoded._id);
        if (!user) {
            throw {
                code: 404,
                message: 'No such user',
            };
        }
        req._user = user;
        next();
    } catch (e) {
        handleError(
            {
                code: 403,
                message: 'Auth error',
                payload: {
                    ...e,
                },
            },
            res
        );
    }
};

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api/stocks', (req, res, next) => {
    const history = market.history;
    res.send(history);
});

app.post('/api/profile/create', async (req, res, next) => {
    try {
        const newProfile = await profile.registerNew({ ...req.body });
        res.send(newProfile.toJSON());
    } catch (e) {
        handleError(e, res);
    }
});

app.post('/api/profile/login', async (req, res, next) => {
    try {
        await profile.checkPassword({ ...req.body });
        const user = await profile.findOne({ username: req.body.username });
        const token = await jwt.sign({ ...user._doc });
        res.cookie('token', token, {
            httpOnly: true,
            path: '/api/',
        });
        res.sendStatus(204);
    } catch (e) {
        handleError(e, res);
    }
});

app.post('/api/wallet/convert', authenticate, async (req, res, next) => {
    const user = req._user;

    try {
        const resp = await user.convertCurrency({
            ...req.body,
            ...user,

            stocks: market.history[market.history.length - 1],
        });
        res.send(resp);
    } catch (e) {
        handleError(e, res);
    }
});

app.post('/api/wallet/transfer', authenticate, async (req, res, next) => {
    const user = req._user;

    try {
        const resp = await user.transfer({ ...req.body });
        res.send(resp);
    } catch (e) {
        handleError(e, res);
    }
});

app.post('/api/wallet/add-money', authenticate, async (req, res, next) => {
    const user = req._user;

    try {
        const resp = await user.addMoney({
            ...req.body,
        });
        res.send(resp);
    } catch (e) {
        handleError(e, res);
    }
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
