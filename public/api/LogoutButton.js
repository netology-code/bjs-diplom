
// eslint-disable-next-line no-unused-vars
class LogoutButton {
  constructor() {
    [this.logoutBtn] = document.getElementsByClassName('logout');
    this.action = (f) => f;
    this.logoutBtn.addEventListener('click', this.logoutClick.bind(this));
  }

  logoutClick() {
    this.action();
  }
}
