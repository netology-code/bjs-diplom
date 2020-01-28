'use strict';

class Profile {
  static login(userData, callback) {
    console.log('Authorizing user: ', userData);
        return ApiConnector.login(userData, (err, data) => {
            console.log('Authorized user: ', userData);
            callback(err, data);
        });
  }

  static register(userData, callback) {
         console.log("Register new user: ", userData);
         return ApiConnector.register(userData, (err, data) => {
          console.log("Registed new user: ", userData);
          callback(err, data);
        });
     }

  addMoney({ currency, amount }, callback) {
        console.log(`Adding ${amount} of ${currency} to ${this.user.username}`);
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Added ${amount} of ${currency} to ${this.user.username}`);
            callback(err, data);
        });
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
      console.log(`Converting ${targetAmount} of ${fromCurrency} to ${targetCurrency}`);
      return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
        console.log(`Converted ${targetAmount} of ${fromCurrency} to ${targetCurrency}`);
        callback(err, data);
      });
    }

    transferMoney({ to, amount }, callback) {
      console.log(`Transfering ${amount} to ${to}`);
      return ApiConnector.transferMoney( {to, amount}, (err, data) => {
        console.log(`Transfered ${amount} to ${to}`);
        callback(err, data);
      });
    }
}

const getStocks = (callback) => {
  console.log(`Запрос курсов валют с сервера`);
  return ApiConnector.getStocks((err, data) => {
    callback(err, data);
  })
}

getStocks((err, data) => console.log(data))

Profile.login({login: "oleg@demo.ru", password: "demo"}, (err, data) => console.log(data));

//Profile.register({login: "test@demo.ru", password: "test"}, (err, data) => console.log(data));
//ApiConnector.current((err, data) => console.log(data));
//ApiConnector.logout((err, data) => console.log(data));


// FAVORITES:
// ApiConnector.getFavorites((err, data) => console.log(data));
// ApiConnector.addUserToFavorites({id:"1", name: "Братан"}, (err, data) => console.log(data));
// ApiConnector.removeUserFromFavorites("1", (err, data) => console.log(data));

// MONEY:
// ApiConnector.addMoney({currency: "USD", amount: 10}, (err, data) => console.log(data));
// ApiConnector.transferMoney({to: "2", currency: "USD", amount: 10}, (err, data) => console.log(data));
/*ApiConnector.convertMoney(
  {fromCurrency: "RUB", targetCurrency: "USD", fromAmount: 150 },
  (err, data) => console.log(data)
);*/
/*ApiConnector.convertMoney(
  {fromCurrency: "RUB", targetCurrency: "USD", fromAmount: 15000 },
  (err, data) => console.log(data)
);*/