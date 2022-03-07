"use strict"

// logout
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};

// виджет текущего пользователя
ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// виджет для фактического курса
const ratesBoard = new RatesBoard();

const currencyRatesRequest = () => {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
};

currencyRatesRequest();

setInterval(currencyRatesRequest, 60000);

// управление деньгами
const moneyManager = new MoneyManager();

// пополнение счета
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success,
                `Ваш счет был пополнен на ${data.amount} ${data.currency}.`);
        } else {
            moneyManager.setMessage(response.success,
                `Произошла ошибка: "${response.error}"`);
        }
    });
};

// обмен валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success,
                `Конвертация из ${data.fromCurrency} в ${data.targetCurrency} прошла без ошибок.`);
        } else {
            moneyManager.setMessage(response.success,
                `В процессе конвертации из ${data.fromCurrency} в ${data.targetCurrency} произошла ошибка: "${response.error}."`);
        }
    });
};

// денежный перевод
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success,
            `Средства переведены успешно.`);
        } else {
            moneyManager.setMessage(response.success,
                `При переводе средств произошла ошибка: "${response.error}."`);
        }
    });
};

// управление избранным
const favoritesWidget = new FavoritesWidget();

// получение избранного
const getFavorites = () => {
    ApiConnector.getFavorites((response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
};

getFavorites();

// добавление пользователя в избранное
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {getFavorites();
            favoritesWidget.setMessage(response.success,
                `Пользователь ${data.name} с ID ${data.id} успешно добавлен в избранное.`);
        } else {
            favoritesWidget.setMessage(response.success,
                `Попытка добавить пользователя в избранное завершилась ошибкой: ${response.error}.`);
        }
    });
};

// удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            getFavorites();
            favoritesWidget.setMessage(response.success,
                `Пользователь с ID ${data} был успешно удален из избранного.`);
        } else {
            favoritesWidget.setMessage(response.success,
                `Попытка удалить пользователя из избранного завершилась ошибкой: ${response.error}.`);
        }
    });
};