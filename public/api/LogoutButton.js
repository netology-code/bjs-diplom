'use strict';

class LogoutButton {
    constructor(){
        this.logoutBtn = document.getElementsByClassName('logout')[0];
        this.action = f => f;
        this.logoutBtn.addEventListener('click', this.logoutClick.bind(this));
    }

    logoutClick(){
        this.action();
    }
}