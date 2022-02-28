"use strict"

const userForm = new UserForm();

// вход зарегистрированного пользователя
userForm.loginFormCallback = (data) => {
  ApiConnector.login(data, (response) => {
    if (!response.success) {
      userForm.setLoginErrorMessage(
        `Ошибка входа: ${response.error}`);
    } else {
      location.reload();
      }
  });
};
 
// регистрация нового пользователя
userForm.registerFormCallback = (data) => {
  console.log(data);
  ApiConnector.register(data, (response) => {
    console.log(response);
    if (!response.success) {
      userForm.setRegisterErrorMessage(
        `Пользователь ${data.login} не может быть зарегистрирован: ${response.error}`
      );
    } else {
      location.reload();
    }
  });
};
