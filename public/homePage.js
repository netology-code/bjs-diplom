'use strict'

const rates = new RatesBoard();
const money = new MoneyManager();
const favourite = new FavoritesWidget();

function logout3(data) {
  if(data.success) {
    location.reload()
  }
}

function logout2(data) {
 ApiConnector.logout(logout3)
}

const user2 = new LogoutButton();
user2.action = logout2

ApiConnector.current((data) => {
  if(data.success) {
    ProfileWidget.showProfile(data.data)
  }
})

function currency() {
  ApiConnector.getStocks((data) => {
    if(data.success) {
      rates.clearTable()
      rates.fillTable(data.data)
    }
  })
}

function moneyPlus(data) {
  let err
  if(data.success) {
    err = 'Успешно'
    ProfileWidget.showProfile(data.data)
  } else {
    err = data.error
  }

  money.setMessage(data.success, err)
}

function moneyConvert(data) {
  let err
  if (data.success) {
    err = 'Успешно'
    ProfileWidget.showProfile(data.data)
  } else {
    err = data.error
  }
  money.setMessage(data.succes, err)
}

function moneyTrans(data) {
  let err
  if(data.success) {
    err = 'Успешно'
    ProfileWidget.showProfile(data.data)
  } else {
    err = data.error
  }
  money.setMessage(data.success, err)
}

function favouriteAdd(data) {
  let err
  if (data.success) {
    err = 'Успешно'
    favourite.clearTable()
    favourite.fillTable(data.data)
    money.updateUsersList(data.data)
  } else {
    err = data.error
  }
  favourite.setMessage(data.success, err)
}

function favouriteRemove(data) {
  let err
  if (data.success) {
    err = 'Успешно'
    favourite.clearTable()
    favourite.fillTable(data.data)
    money.updateUsersList(data.data)
  } else {
    err = data.error
  }
  favourite.setMessage(data.success, err)
}

setInterval(currency, 1000)

money.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data,moneyPlus)
};
money.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, moneyConvert)
};
money.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, moneyTrans)
}

ApiConnector.getFavorites((data) => {
  if (data.success) {
    favourite.clearTable()
    favourite.fillTable(data.data)
    money.updateUsersList(data.data)
  }
})

favourite.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, favouriteAdd)
}

favourite.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, favouriteRemove)
}
