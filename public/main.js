'use strict';

class Profile {
  constructor(user) {
  this.user = user;
  }

  performLogin(callback) {
    console.log(`User ${this.user.username} is authorizing`);
        return ApiConnector.performLogin(this.user, (err, data) => {
            console.log(`User ${this.user.username} authorized`);
            callback(err, data);
        });
  }

  createUser(callback) {
         console.log(`Adding new user ${this.user.username}`);
         return ApiConnector.createUser(this.user, (err, data) => {
            console.log(`Added new user ${this.user.username}`);
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
  return ApiConnector.getStocks((err, data) => {
    console.log(`Запрос курсов валют с сервера`);
    callback(err, data);
  })
}

function main() {
    const Alex = new Profile({
                    username: 'alex',
                    name: { firstName: 'Alex', lastName: 'Alexeev' },
                    password: 'alex5555',
                });
    const Semen = new Profile({
                    username: 'semen',
                    name: { firstName: 'Semen', lastName: 'Bondarev' },
                    password: 'semen5555',
                });
    // сначала создаем и авторизуем пользователя
    Alex.createUser((err, data) => {
          if (err) {
            console.error(`Error adding new user`);
          } else {
            console.log(`Added new user Alex`);

            Alex.performLogin((err, data) => {
                 if (err) {
                 console.error(`Error authorizing new user`);
                 } else {
                 console.log(`Authorized new user Alex`);

                 let startCapital = { currency: 'RUB', amount: 100 };

                  Alex.addMoney(startCapital, (err, data) => {
                         if (err) {
                           console.error(`Error during adding money to ${username}`);
                         } else {
                           console.log(`Added ${startCapital.amount} ${startCapital.currency} to Alex`);

                           getStocks((err, data) => {
                              if (err) {
                                console.error(`Error getting stocks`);
                              } else {
                                console.log(`Got stocks`);
                                console.log(data);
                              }
                             });
                           let targetCapital = { fromCurrency: 'RUB', targetCurrency: 'NETCOIN', targetAmount: 0.1 };

                            Alex.convertMoney(targetCapital, (err, data) => {
                                if (err) {
                                  console.error(`Error converting money to Alex`);
                                } else {
                                   console.log(`Converted ${targetCapital.targetAmount} of ${targetCapital.fromCurrency} to ${targetCapital.targetCurrency}`); 

                                   Semen.createUser((err, data) => {
                                        if (err) {
                                            console.error(`Error adding new user`);
                                        } else {
                                        console.log(`Added new user Semen`);
                                       }
                                   });

                                   let transfering = { to: Semen, amount: 0.1};

                                   Alex.transferMoney(transfering, (err, data) => {
                                          if (err) {
                                            console.error(`Error transfering money`);
                                        } else {
                                            console.log(`Transfered ${transfering.amount} to ${transfering.to}`);
                                        }
                                  });
                               }
                          });

                         }
                  });
                }
          });
         }
       });
}

           

main();