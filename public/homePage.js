const logButton = new LogoutButton();
logButton.action = function () {
    ApiConnector.logout(function (response) {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current(function (response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const board = new RatesBoard();

function exchangeRate() {
    ApiConnector.getStocks(function (response) {
        if (response.success) {
            board.clearTable(response);
            board.fillTable(response.data);
        }
    });

}

exchangeRate();
setInterval(exchangeRate, 60000);

const moneyManager = new MoneyManager();

function messageManager(response) {
    moneyManager.setMessage(!response.success, !response.success ? response.data : 'Успех!');
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }

}

moneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data,function (response) {
      messageManager(response);
  })
};

moneyManager.conversionMoneyCallback = function (data) {
ApiConnector.convertMoney(data, function (response) {
    messageManager(response);
    })
}

moneyManager.sendMoneyCallback = function (data) {
    console.log(data);
ApiConnector.transferMoney(data,function (response) {
    messageManager(response);
})
}

