'use strict';

const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
  try {
    ApiConnector.login(data, loginCallback);
  } catch (err) {
    console.log(err);
  }
};

userForm.registerFormCallback = (data) => {
  try {
    ApiConnector.register(data, registerCallback);
  } catch (err) {
    console.log(err);
  }
};

function loginCallback(response) {
  if (!response.success) {
    userForm.setLoginErrorMessage(response.error);
  } else {
    location.reload();
  }
}

function registerCallback(response) {
  if (!response.success) {
    userForm.setRegisterErrorMessage(response.error);
  } else {
    location.reload();
  }
}
