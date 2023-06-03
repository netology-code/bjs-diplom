'use strict'
function login1(data) {
  console.log(data)
  ApiConnector.login(data, respon)
}

function regis(data) {
  console.log(data)
  ApiConnector.register(data, respawn)
}

function respon(info) {
  console.log(info)
  if(info.success) {
    location.reload()
  } else {
    user1.setLoginErrorMessage(info.error)
  }
}

function respawn(info) {
  console.log(info)
  if(info.succes) {
    location.reload()
  } else {
    user1.setRegisterErrorMessage(info.error)
  }
}

const user1 = new UserForm();
user1.loginFormCallback = login1;
user1.registerFormCallback = regis;
