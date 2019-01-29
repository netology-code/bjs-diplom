class ApiConnector {
    /**
     * Tries to parse response body if it exists
     *
     * @static
     * @param {*} response body of response (empty object if does not exist)
     * @returns {Promise<Object>} parsed body
     * @memberof ApiConnector
     */
    static async _parseResponseBody(response) {
        try {
            return { response, responseBody: await response.json() };
        } catch (e) {
            return { responseBody: {}, response };
        }
    }

    /**
     * Sends a login call
     *
     * @static
     * @param {*} { username, password }
     * @param {Function} callback function with `error` as a first param (null if no errors) and body `data` as a second param
     * @memberof ApiConnector
     */
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

    /**
     * Sends a call to create a user with a given parameters
     *
     * @static
     * @param {*} { username, name: { firstName, lastName }, password }
     * @param {Function} callback function with `error` as a first param (null if no errors) and body `data` as a second param
     * @memberof ApiConnector
     */
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

    /**
     * Sends a call to transfer money from a logged in user and a user mentioned in parameters
     *
     * @static
     * @param {*} { to, amount }
     * @param {Function} callback function with `error` as a first param (null if no errors) and body `data` as a second param
     * @memberof ApiConnector
     */
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

    /**
     * Sends a call to add money to a logged in user
     *
     * @static
     * @param {*} { currency, amount }
     * @param {Function} callback function with `error` as a first param (null if no errors) and body `data` as a second param
     * @memberof ApiConnector
     */
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

    /**
     * Sends a call to convert money of a logged in user from one currency to another based on stocks
     *
     * @static
     * @param {*} { fromCurrency, targetCurrency, targetAmount }
     * @param {Function} callback function with `error` as a first param (null if no errors) and body `data` as a second param
     * @memberof ApiConnector
     */
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

    /**
     * Sends a call to get stocks (last 100 entries)
     *
     * @static
     * @param {Function} callback function with `error` as a first param (null if no errors) and body `data` as a second param
     * @memberof ApiConnector
     */
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
