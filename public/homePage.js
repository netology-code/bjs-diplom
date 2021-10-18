'use strict';

// logoutButton
const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    if (!response.success) {
      return false;
    } else {
      location.reload();
    }
  });
};

// current Profile
ApiConnector.current((response) => ProfileWidget.showProfile(response.data));

// ratesBoard
const ratesBoard = new RatesBoard();
const getStocksInterval = 60000;

const getStocks = () => {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
};

getStocks();
setInterval(getStocks, getStocksInterval);

// moneyManager
const moneyManager = new MoneyManager();
const mmResponseUpdate = (response) => {
  if (!response.success) {
    moneyManager.setMessage(false, response.error);
  } else {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true, `Операция прошла успешно`); // почему сервер не врозвращает сообщение от успехе
  }
};

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, mmResponseUpdate);
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, mmResponseUpdate);
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, mmResponseUpdate);
};

// FavoritesWidget
const favoritesWidget = new FavoritesWidget();
const updateFavorites = (response) => {
  if (!response.success) {
    favoritesWidget.setMessage(false, response.error);
  } else {
    let message;
    if (favoritesWidget.favoritesTableBody.children.length < Object.keys(response.data).length) {
      message = 'Пользователь успешно добавлен';
    } else {
      message = 'Пользователь успешно Удален';
    }
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(true, message); // тоже самое почему сервер не врозвращает сообщение от успехе
  }
};

ApiConnector.getFavorites((response) => {
  // Пришлось написать отдельную функцию иначе setMessage из updateFavorites
  // выскакивает при первом обновлении страницы
  if (!response.success) {
    favoritesWidget.setMessage(false, response.error);
  } else {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = (user) => {
  try {
    ApiConnector.addUserToFavorites(user, updateFavorites);
  } catch (err) {
    console.error(err.message);
  }
};

favoritesWidget.removeUserCallback = (userId) => {
  try {
    ApiConnector.removeUserFromFavorites(userId, updateFavorites);
  } catch (err) {
    console.error(err.message);
  }
};
