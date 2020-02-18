"use strict";

const userForm = new UserForm();




userForm.loginFormCallback = data => {ApiConnector.login(data,(response) => {if (response.success===true) {location.reload();}
                                                                             else {alert(response.data);} })};
userForm.registerFormCallback = data => {ApiConnector.register(data, (response) => {
                                                                                        if (response.success===true)
                                                                                             {
                                                                                                alert(`Пользователь ${data.login} успешно зарегестрирован`)
                                                                                             }
                                                                                   
                                                                                        else {
                                                                                            alert(response.data);
                                                                                        }
                                                                                    }
                                                              )
                                        };
//userForm.registerFormCallback = data => {ApiConnector.register(data, (response) => console.log(response))};


//data => {ApiConnector.login(data,log_check)};

