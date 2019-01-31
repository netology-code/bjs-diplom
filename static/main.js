class Profile {
    constructor({ username, name: { firstName, lastName }, password }) {
        this.username = username;
        this.name = {
            firstName,
            lastName,
        };
        this.password = password;
    }
    create(callback) {
        return ApiConnector.createUser(
            {
                username: this.username,
                name: this.name,
                password: this.password,
            },
            (err, data) => {
                console.log(`Creating user ${this.username}`);
                callback(err, data);
            }
        );
    }

    authorize(callback) {
        return ApiConnector.performLogin(
            { username: this.username, password: this.password },
            (err, data) => {
                console.log(`Authorizing user ${this.username}`);
                callback(err, data);
            }
        );
    }

    addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    transferMoney({ to, amount }, callback) {
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            console.log(`Transfering ${amount} of Netcoins to ${to}`);
            callback(err, data);
        });
    }

    convertToCoins({ fromCurrency, targetAmount }, callback) {
        return ApiConnector.convertMoney(
            { fromCurrency, targetCurrency: 'NETCOIN', targetAmount },
            (err, data) => {
                console.log(`Converting ${fromCurrency} to ${targetAmount} Netcoins`);
                callback(err, data);
            }
        );
    }

    convertFromCoins({ targetCurrency, targetAmount }, callback) {
        return ApiConnector.convertMoney(
            { fromCurrency: 'NETCOINS', targetCurrency, targetAmount },
            (err, data) => {
                console.log(`Converting Netcoins to ${targetAmount} of ${targetCurrency}`);
                callback(err, data);
            }
        );
    }
}

function getStocks(callback) {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);
        callback(err, data[99]);
    });
}

window.onload = async () => {
    try {
        getStocks((err, data) => {
            if (err) {
                console.error('Error during getting stocks');
                throw err;
            }
            const stocksInfo = data;

            const Ivan = new Profile({
                username: 'ivan',
                name: { firstName: 'Ivan', lastName: 'Chernyshev' },
                password: 'ivanspass',
            });

            const Petya = new Profile({
                username: 'petya',
                name: { firstName: 'Pyotr', lastName: 'Pupkin' },
                password: 'pupkin123',
            });

            Ivan.create((err, data) => {
                if (err) {
                    console.error('Error during creating Ivan');
                    throw err;
                } else {
                    console.log('Ivan is created!');

                    Petya.create((err, data) => {
                        if (err) {
                            console.error('Error during creating Petya');
                            throw err;
                        } else {
                            console.log('Petya is created!');
                            Ivan.authorize((err, data) => {
                                if (err) {
                                    console.error('Error during authorizing Ivan');
                                    throw err;
                                } else {
                                    console.log('Ivan is authorized!');
                                    Ivan.addMoney(
                                        { currency: 'EUR', amount: 500000 },
                                        (err, data) => {
                                            if (err) {
                                                console.error('Error during adding money to Ivan');
                                                throw err;
                                            } else {
                                                console.log(`Added 500000 euros to Ivan`);
                                                const targetAmount =
                                                    stocksInfo['EUR_NETCOIN'] * 500000;
                                                Ivan.convertToCoins(
                                                    {
                                                        fromCurrency: 'EUR',
                                                        targetAmount,
                                                    },
                                                    (err, data) => {
                                                        if (err) {
                                                            console.error(
                                                                'Error during converting money'
                                                            );
                                                            throw err;
                                                        } else {
                                                            console.log(`Converted to coins`, data);
                                                            Ivan.transferMoney(
                                                                {
                                                                    to: Petya.username,
                                                                    amount: targetAmount,
                                                                },
                                                                (err, data) => {
                                                                    if (err) {
                                                                        console.error(
                                                                            'Error during transfering money'
                                                                        );
                                                                        throw err;
                                                                    } else {
                                                                        console.log(
                                                                            `Petya has got ${targetAmount} NETCOINS`
                                                                        );
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
            });
        });
    } catch (e) {
        console.error(e);
    }
};
