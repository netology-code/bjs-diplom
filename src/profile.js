const mongoose = require('mongoose'),
    createHash = require('create-hash'),
    cryptoRandomString = require('crypto-random-string'),
    { Mockgoose } = require('mockgoose'),
    mockgoose = new Mockgoose(mongoose);

mockgoose.prepareStorage().then(() => {
    mongoose.connect('mongodb://127.0.0.1:27017/netology', {
        useNewUrlParser: true,
    });
    mongoose.connection.on('connected', () => {
        console.log('db connection is now open');
    });
});

const ProfileSchema = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    wallet: {
        RUB: {
            type: Number,
            default: 0,
        },
        USD: {
            type: Number,
            default: 0,
        },
        EUR: {
            type: Number,
            default: 0,
        },
        NETCOIN: {
            type: Number,
            default: 0,
        },
    },
});

ProfileSchema.methods.addMoney = async function({ currency, amount }) {
    const allowedCurrencies = ['RUB', 'USD', 'EUR'];
    if (allowedCurrencies.indexOf(currency) === -1) {
        throw {
            code: 400,
            message: `Currency ${currency} is not one of allowed currencies: ${allowedCurrencies}`,
        };
    }
    this.wallet[currency] = Number(this.wallet[currency]) + Number(amount);
    const savedProfile = await this.save();
    return {
        name: savedProfile.name,
        wallet: savedProfile.wallet,
        username: savedProfile.username,
    };
};

ProfileSchema.methods.checkAmount = function(currency) {
    const allowedCurrencies = ['RUB', 'USD', 'EUR', 'NETCOIN'];
    if (allowedCurrencies.indexOf(currency) === -1) {
        throw {
            code: 400,
            message: `Currency ${currency} is not one of allowed currencies: ${allowedCurrencies}`,
        };
    }
    return this.wallet[currency];
};

ProfileSchema.methods.transfer = async function({ to, amount }) {
    const toUser = await Profile.findOne({ username: to });
    if (!toUser) {
        throw {
            code: 404,
            message: `No user with such username: ${to}`,
        };
    }

    const isEnoughMoney = this.checkAmount('NETCOIN');

    if (!isEnoughMoney) {
        throw {
            code: 400,
            message: 'Not enough money',
        };
    } else {
        this.wallet.NETCOIN = Number(this.wallet.NETCOIN) - Number(amount);
        toUser.wallet.NETCOIN = Number(toUser.wallet.NETCOIN) + Number(amount);
        await toUser.save();
        const savedProfile = await this.save();

        return {
            name: savedProfile.name,
            wallet: savedProfile.wallet,
            username: savedProfile.username,
        };
    }
};

ProfileSchema.methods.convertCurrency = async function({
    fromCurrency,
    targetCurrency,
    targetAmount,
    stocks,
}) {
    const allowedCurrencies = ['RUB', 'USD', 'EUR', 'NETCOIN'];

    if (allowedCurrencies.indexOf(fromCurrency) === -1) {
        throw {
            code: 400,
            message: `Currency ${fromCurrency} is not one of allowed currencies: ${allowedCurrencies}`,
        };
    }
    if (allowedCurrencies.indexOf(targetCurrency) === -1) {
        throw {
            code: 400,
            message: `Currency ${targetCurrency} is not one of allowed currencies: ${allowedCurrencies}`,
        };
    }
    if (!(fromCurrency === 'NETCOIN' || targetCurrency === 'NETCOIN')) {
        throw {
            code: 400,
            message: 'NETCOIN should be one of currencies to convert',
        };
    }

    const exchangeType = `${fromCurrency}_${targetCurrency}`;

    const exchangeRate = stocks[exchangeType];

    const fromCurrencyAmount = this.checkAmount(fromCurrency);

    const shouldPay = targetAmount / exchangeRate;

    const isEnoughMoney = fromCurrencyAmount - shouldPay >= 0;

    if (!isEnoughMoney) {
        throw {
            code: 406,
            message: 'Not enough money to complete the operation',
        };
    }

    this.wallet[fromCurrency] = Number(this.wallet[fromCurrency]) - Number(shouldPay);
    this.wallet[targetCurrency] = Number(this.wallet[targetCurrency]) + Number(targetAmount);

    const savedProfile = await this.save();
    return {
        name: savedProfile.name,
        wallet: savedProfile.wallet,
        username: savedProfile.username,
    };
};

const Profile = mongoose.model('Profile', ProfileSchema);

async function registerNew(user) {
    const userExists = (await Profile.find({ username: user.username })).length > 0;
    if (userExists) {
        throw {
            code: 409,
            message: 'User already exists',
        };
    }
    user.salt = cryptoRandomString(16);
    const hash = createHash('sha1');
    hash.update(user.password + user.salt);
    user.password = hash.digest().toString('hex');
    const newUser = new Profile(user);
    return await newUser.save();
}

async function checkPassword({ username, password }) {
    const profile = await Profile.findOne({ username });
    if (!profile) {
        throw {
            code: 401,
            message: 'Login or password is incorrect',
        };
    }
    const salt = profile.salt;
    const hash = createHash('sha1');
    hash.update(password + salt);
    password = hash.digest().toString('hex');
    const passwordCorrect = profile.password === password;
    if (!passwordCorrect) {
        throw {
            code: 401,
            message: 'Login or password is incorrect',
        };
    } else {
        return {
            passwordCorrect: true,
        };
    }
}

module.exports = Profile;
module.exports.registerNew = registerNew;
module.exports.checkPassword = checkPassword;
