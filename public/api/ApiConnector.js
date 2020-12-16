class ApiConnector {
  /**
   * Пробует парсить тело ответа, если оно существует
   *
   * @static
   * @param {*} response body of response (empty object if does not exist)
   * @returns {Promise<Object>} parsed body
   * @memberof ApiConnector
   */
  static async parseResponseBody(response) {
    try {
      return { response, responseBody: await response.json() };
    } catch (e) {
      return { responseBody: {}, response };
    }
  }

  /**
   * Отправляет запрос на авторизацию пользователя
   *
   * @static
   * @param {*} { username, password }
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static login({ login, password }, callback) {
    const asyncPart = async () => {
      const body = JSON.stringify({ login, password });

      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };

    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на создание пользователя с переданными параметрами
   *
   * @static
   * @param {*} { username, password }
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static register({ login, password }, callback) {
    const asyncPart = async () => {
      const body = JSON.stringify({ login, password });

      const response = await fetch('user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на получение текущего авторизованного пользователя
   *
   * @static
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static current(callback) {
    const asyncPart = async () => {
      const response = await fetch('user/current', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос деавторизацию пользователя
   *
   * @static
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static logout(callback) {
    const asyncPart = async () => {
      const response = await fetch('user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на получение списка избранного
   *
   * @static
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static getFavorites(callback) {
    const asyncPart = async () => {
      const response = await fetch('favorites/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на добавление пользователя в список избранного
   *
   * @static
   * @param {*} { id, name }
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static addUserToFavorites({ id, name }, callback) {
    const asyncPart = async () => {
      const response = await fetch('favorites/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на удаление пользователя из списка избранного
   *
   * @static
   * @param {*} id
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static removeUserFromFavorites(id, callback) {
    const asyncPart = async () => {
      const response = await fetch('favorites/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на перевод денег авторизованного пользователя тому пользователю,
   * чье имя передано
   *
   * @static
   * @param {*} { to, amount }
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static transferMoney({ to, currency, amount }, callback) {
    const asyncPart = async () => {
      const body = JSON.stringify({ to, currency, amount });

      const response = await fetch('/money/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на добавление денег авторизованному пользователю
   *
   * @static
   * @param {*} { currency, amount }
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static addMoney({ currency, amount }, callback) {
    const asyncPart = async () => {
      const body = JSON.stringify({ currency, amount });

      const response = await fetch('/money/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на конвертацию денег авторизованного пользователя из одной валюты в другую
   *
   * @static
   * @param {*} { fromCurrency, targetCurrency, fromAmount }
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static convertMoney({ fromCurrency, targetCurrency, fromAmount }, callback) {
    const asyncPart = async () => {
      const body = JSON.stringify({ fromCurrency, targetCurrency, fromAmount });

      const response = await fetch('/money/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }

  /**
   * Отправляет запрос на получение курсов валют (последние 100 записей)
   *
   * @static
   * @param {Function} callback-функция с ошибкой `error` в качестве первого параметра
   * (null если ошибки нет) и телом `data` в качестве второго параметра
   * @memberof ApiConnector
   */
  static getStocks(callback) {
    const asyncPart = async () => {
      const response = await fetch('/stocks', {
        method: 'GET',
      });
      const result = await ApiConnector.parseResponseBody(response);
      return result;
    };
    asyncPart()
      .then(({ responseBody }) => {
        callback(responseBody);
      })
      .catch((e) => {
        console.error("Произошла ошибка: ", e);
      });
  }
}
