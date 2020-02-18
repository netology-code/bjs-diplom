"use strict";

const logoutB = new LogoutButton();

//(response) => console.log(response)

logoutB.action = () => ApiConnector.logout(() => location.reload());
ApiConnector.current((response) => 
                                {
                                    if (response.success == true) {ProfileWidget.showProfile(response.data);}
                                });
                          
//ivan@demo.ru
const ratesBoard = new RatesBoard();
const runRate = () => ApiConnector.getStocks((response) => 
                        {
                            if (response.success==true) {
                                ratesBoard.clearTable();
                                ratesBoard.fillTable(response.data);
                            }
                        });
runRate();                        
setInterval(runRate,60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => { 
                                              ApiConnector.addMoney(data,(response) =>
                                                     {
                                                        if (response.success==false) 
                                                        {
                                                           moneyManager.setMessage(true,response.data);
                                                        }
                                                        else 
                                                        {
                                                           ApiConnector.current((response) => 
                                                        {
                                                            if (response.success == true) {ProfileWidget.showProfile(response.data);}
                                                        });
                                                        moneyManager.setMessage(false,'Баланс успешно пополнен');
                                                        }
                                                    })            
                                           };


moneyManager.conversionMoneyCallback = (data) =>    { 
                                               ApiConnector.convertMoney(data,(response) =>                                                                                  
                                                        {
                                                            if (response.success==false) 
                                                            {
                                                                moneyManager.setMessage(true,response.data);
                                                            }
                                                            else 
                                                            {
                                                                ApiConnector.current((response) => 
                                                            {
                                                                if (response.success == true) {ProfileWidget.showProfile(response.data);}
                                                            });
                                                                moneyManager.setMessage(false,'Конвертация успешно произведена');
                                                            }                                                                              
                                                        } )                                                                            
                                                    }

moneyManager.sendMoneyCallback  = (data) => { 
                                                ApiConnector.transferMoney(data,(response) =>                                                                                  
                                                    {
                                                        if (response.success==false) 
                                                        {
                                                            moneyManager.setMessage(true,response.data);
                                                        }
                                                        else 
                                                        {
                                                            ApiConnector.current((response) => 
                                                        {
                                                            if (response.success == true) {ProfileWidget.showProfile(response.data);}
                                                        });
                                                            moneyManager.setMessage(false,'Перевод успешно произведен');
                                                        }                                                                              
                                                    } )                                                                            
                                            }                                       
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
                                        if (response.success === true) {
                                            favoritesWidget.clearTable();
                                            favoritesWidget.fillTable(response.data);
                                            moneyManager.updateUsersList(response.data);
                                        }
                                        }
                        );     

favoritesWidget.addUserCallback = (data) => { 
                                                ApiConnector.addUserToFavorites(data,(response) =>                                                                                  
                                                {
                                                    if (response.success==false) 
                                                    {
                                                        favoritesWidget.setMessage(true,response.data);
                                                    }
                                                    else 
                                                    {
                                                    favoritesWidget.clearTable();
                                                    favoritesWidget.fillTable(response.data);
                                                    moneyManager.updateUsersList(response.data);
                                                    favoritesWidget.setMessage(false,'Пользователь добавлен');
                                                    }
                                                })
                                            }
favoritesWidget.removeUserCallback = (data) =>  { 
                                                    ApiConnector.removeUserFromFavorites(data,(response) =>                                                                                  
                                                    {
                                                        if (response.success==false) 
                                                        {
                                                            favoritesWidget.setMessage(true,response.data);
                                                        }
                                                        else 
                                                        {
                                                        favoritesWidget.clearTable();
                                                        favoritesWidget.fillTable(response.data);
                                                        moneyManager.updateUsersList(response.data);
                                                        favoritesWidget.setMessage(false,'Пользователь удален');
                                                        }
                                                    })
                                            }                                          

