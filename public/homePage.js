"use strict";

const logoutBtn = new LogoutButton();
logoutBtn.action = () => {
    ApiConnector.logout(response => {
		if(response.success) {
			location.reload();
        }
    });
}

ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
function getCurse() {
ApiConnector.getStocks(response => {
    if(response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    }
});
}
getCurse();
setTimeout(getCurse, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) =>{
    ApiConnector.addMoney = (data, response => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            errorMessageBlock.setMessage(response.success, 'Пополнение счёта');
        }  
        else{
            errorMessageBlock.setMessage(response.success, 'Произошла ошибка');
        }
    });
}

moneyManager.conversionMoneyCallback = (data) =>{
    ApiConnector.convertMoney = (data, response => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Конвертирование валюты');
        }  
        else{
            moneyManager.setMessage(response.success, 'Произошла ошибка');
        }
    });
}

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
    }
}
);
// *Заполните выпадающий список для перевода денег (updateUsersList). Не поняла как это можно реализовать
//moneyManager.updateUsersList(data); в условии это тоже прописать при успешном запросе? Просто список и так уже с данными. 

favoritesWidget.addUserCallback = (data)=>{
    ApiConnector.addUserToFavorites(data, response => {
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(data);
            favoritesWidget.setMessage(response.success, 'Пользователь добавлен');
        }  
        else{
            favoritesWidget.setMessage(response.success, 'Произошла ошибка');
        }
    }); 
}

favoritesWidget.removeUserCallback = (data)=>{
    ApiConnector.removeUserFromFavorites(data, response => {
        if(response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(data);
            favoritesWidget.setMessage(response.success, 'Пользователь удалён');
        }  
        else{
            favoritesWidget.setMessage(response.success, 'Произошла ошибка');
        }
    });
}