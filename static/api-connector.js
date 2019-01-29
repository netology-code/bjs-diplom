class ApiConnector {
    static async _parseResponseBody(response) {
        try {
            return { response, responseBody: await response.json() };
        } catch (e) {
            return { responseBody: {}, response };
        }
    }
    static performLogin({ username, password }, callback) {
        const asyncPart = async () => {
            const body = JSON.stringify({
                username,
                password,
            });

            const response = await fetch('/api/profile/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            return await ApiConnector._parseResponseBody(response);
        };
        asyncPart()
            .then(({ response, responseBody }) => {
                if (response.ok) {
                    callback(null, responseBody);
                } else {
                    callback(responseBody, null);
                }
            })
            .catch(e => {
                callback(e, null);
            });
    }

    static createUser(
        {
            username,
            name: { firstName, lastName },
            password,
        },
        callback
    ) {
        const asyncPart = async () => {
            const body = JSON.stringify({
                username,
                name: { firstName, lastName },
                password,
            });

            const response = await fetch('/api/profile/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            return await ApiConnector._parseResponseBody(response);
        };
        asyncPart()
            .then(({ response, responseBody }) => {
                if (response.ok) {
                    callback(null, responseBody);
                } else {
                    callback(responseBody, null);
                }
            })
            .catch(e => {
                callback(e, null);
            });
    }

    static transferMoney({ to, amount }, callback) {
        const asyncPart = async () => {
            const body = JSON.stringify({ to, amount });

            const response = await fetch('/api/wallet/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                credentials: 'include',
            });
            return await ApiConnector._parseResponseBody(response);
        };
        asyncPart()
            .then(({ response, responseBody }) => {
                if (response.ok) {
                    callback(null, responseBody);
                } else {
                    callback(responseBody, null);
                }
            })
            .catch(e => {
                callback(e, null);
            });
    }
    static addMoney({ currency, amount }, callback) {
        const asyncPart = async () => {
            const body = JSON.stringify({ currency, amount });

            const response = await fetch('/api/wallet/add-money', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                credentials: 'include',
            });
            return await ApiConnector._parseResponseBody(response);
        };
        asyncPart()
            .then(({ response, responseBody }) => {
                if (response.ok) {
                    callback(null, responseBody);
                } else {
                    callback(responseBody, null);
                }
            })
            .catch(e => {
                callback(e, null);
            });
    }
    static convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        const asyncPart = async () => {
            const body = JSON.stringify({ fromCurrency, targetCurrency, targetAmount });

            const response = await fetch('/api/wallet/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                credentials: 'include',
            });
            return await ApiConnector._parseResponseBody(response);
        };
        asyncPart()
            .then(({ response, responseBody }) => {
                if (response.ok) {
                    callback(null, responseBody);
                } else {
                    callback(responseBody, null);
                }
            })
            .catch(e => {
                callback(e, null);
            });
    }
    static getStocks(callback) {
        const asyncPart = async () => {
            const response = await fetch('/api/stocks', {
                method: 'GET',
            });
            return await ApiConnector._parseResponseBody(response);
        };
        asyncPart()
            .then(({ response, responseBody }) => {
                if (response.ok) {
                    callback(null, responseBody);
                } else {
                    callback(responseBody, null);
                }
            })
            .catch(e => {
                callback(e, null);
            });
    }
}
