window.onload = async () => {
    try {
        ApiConnector.getStocks((err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(data);
            }
        });

        /* await createUser({
            username: 'ivan-blacky',
            name: {
                firstName: 'Ivan',
                lastName: 'Chernyshev',
            },
            password: 'secret',
        }); */
        /* ApiConnector.performLogin(
            {
                username: 'ivan-blacky',
                password: 'secret',
            },
            (err, data) => {
                if (err) {
                    console.warn(err);
                } else {
                    console.log('Login performed', data);
                    ApiConnector.addMoney({ currency: 'RUB', amount: 250000000 }, (err, data) => {
                        if (err) {
                            console.warn(err);
                        } else {
                            console.log('Added money', data);
                            ApiConnector.convertMoney(
                                {
                                    fromCurrency: 'RUB',
                                    targetCurrency: 'NETCOIN',
                                    targetAmount: '250',
                                },
                                (err, data) => {
                                    if (err) {
                                        console.warn(err);
                                    } else {
                                        console.log('Performed money convert', data);
                                        ApiConnector.transferMoney(
                                            { to: 'another', amount: 250 },
                                            (err, data) => {
                                                console.log(data);

                                                if (err) {
                                                    console.warn(err);
                                                } else {
                                                    console.log('Performed money transfer', data);
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });
                }
            }
        ); */
    } catch (e) {
        console.error(e);
    }
};
