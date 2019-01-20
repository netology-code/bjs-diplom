const mongoose = require("mongoose"),
  createHash = require("create-hash"),
  cryptoRandomString = require("crypto-random-string");

mongoose.connect(
  "mongodb://localhost:27017/netology",
  {
    useNewUrlParser: true
  }
);

const ProfileSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  wallet: {
    RUB: {
      type: Number,
      default: 0
    },
    USD: {
      type: Number,
      default: 0
    },
    EUR: {
      type: Number,
      default: 0
    },
    NETCOIN: {
      type: Number,
      default: 0
    }
  }
});

ProfileSchema.methods.addMoney = async function(currency, amount) {
  const allowedCurrencies = ["RUB", "USD", "EUR"];
  if (allowedCurrencies.indexOf(currency) === -1) {
    throw {
      code: 400,
      message: `Currency ${currency} is not one of allowed currencies: ${allowedCurrencies}`
    };
  }
  this.wallet[currency] += amount;
  return await this.save();
};

ProfileSchema.methods.checkAmount = function(currency) {
  const allowedCurrencies = ["RUB", "USD", "EUR", "NETCOIN"];
  if (allowedCurrencies.indexOf(currency) === -1) {
    throw {
      code: 400,
      message: `Currency ${currency} is not one of allowed currencies: ${allowedCurrencies}`
    };
  }
  return this.wallet[currency];
};

ProfileSchema.methods.convertCurrency = async function(
  fromCurrency,
  targetCurrency,
  targetAmount,
  stocks
) {
  const allowedCurrencies = ["RUB", "USD", "EUR", "NETCOIN"];

  if (allowedCurrencies.indexOf(fromCurrency) === -1) {
    throw {
      code: 400,
      message: `Currency ${fromCurrency} is not one of allowed currencies: ${allowedCurrencies}`
    };
  }
  if (allowedCurrencies.indexOf(targetCurrency) === -1) {
    throw {
      code: 400,
      message: `Currency ${fromCurrency} is not one of allowed currencies: ${allowedCurrencies}`
    };
  }
  if (!(fromCurrency === "NETCOIN" || targetCurrency === "NETCOIN")) {
    throw {
      code: 400,
      message: "NETCOIN should be one of currencies to convert"
    };
  }

  const exchangeType = `${fromCurrency}_${targetCurrency}`;

  const exchangeRate = stocks[exchangeType];

  const fromCurrencyAmount = this.checkAmount(fromCurrency);

  const shouldPay = exchangeRate * targetAmount;

  const isEnoughMoney = fromCurrencyAmount - shouldPay >= 0;

  if (!isEnoughMoney) {
    throw {
      code: 406,
      message: "Not enough money to complete the operation"
    };
  }

  this.wallet[fromCurrency] -= shouldPay;
  this.wallet[targetCurrency] += targetAmount;

  return await this.save();
};

const Profile = mongoose.model("Profile", ProfileSchema);

async function registerNew(user) {
  user.salt = cryptoRandomString(16);
  const hash = createHash("sha1");
  hash.update(user.password + user.salt);
  user.password = hash.digest().toString("hex");
  const newUser = new Profile(user);
  return await newUser.save();
}

async function checkPassword({ username, password }) {
  const profile = await Profile.findOne({ username });
  const salt = profile.salt;
  const hash = createHash("sha1");
  hash.update(password + salt);
  password = hash.digest().toString("hex");
  return profile.password === password;
}

module.exports = Profile;
module.exports = registerNew;
module.exports = checkPassword;
