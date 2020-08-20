// eslint-disable-next-line no-unused-vars
class MoneyManager {
  constructor() {
    this.addMoneyForm = document.getElementById('addMoney');
    this.conversionMoneyForm = document.getElementById('conversionMoney');
    this.sendMoneyForm = document.getElementById('sendMoney');

    this.addMoneyForm.querySelector('.button').addEventListener('click', this.addMoneyAction.bind(this));
    this.conversionMoneyForm.querySelector('.button').addEventListener('click', this.conversionMoneyAction.bind(this));
    this.sendMoneyForm.querySelector('.button').addEventListener('click', this.sendMoneyAction.bind(this));

    this.errorMessageBlock = document.getElementById('moneyMessageBox');
    this.errorMessageBlock.style.display = 'none';

    this.addMoneyCallback = (f) => f;
    this.conversionMoneyCallback = (f) => f;
    this.sendMoneyCallback = (f) => f;
  }

  addMoneyAction() {
    const amount = this.addMoneyForm.querySelector('[placeholder="Сумма"]').value;
    const currency = this.addMoneyForm.getElementsByTagName('select')[0].value;
    this.addMoneyCallback({ currency, amount });
    this.addMoneyForm.reset();
    const select = this.addMoneyForm.querySelector('.text');
    select.innerText = 'Валюта';
    select.classList.add('default');
  }

  conversionMoneyAction() {
    const fromAmount = this.conversionMoneyForm.querySelector('[placeholder="Сумма"]').value;
    const fromCurrency = this.conversionMoneyForm.getElementsByTagName('select')[0].value;
    const targetCurrency = this.conversionMoneyForm.getElementsByTagName('select')[1].value;
    this.conversionMoneyCallback({ fromCurrency, targetCurrency, fromAmount });
    this.conversionMoneyForm.reset();
    const selects = this.conversionMoneyForm.querySelectorAll('.text');
    selects[0].innerText = 'Из';
    selects[0].classList.add('default');
    selects[1].innerText = 'В';
    selects[1].classList.add('default');
  }

  sendMoneyAction() {
    const amount = this.sendMoneyForm.querySelector('[placeholder="Сумма"]').value;
    const to = +this.sendMoneyForm.getElementsByTagName('select')[0].value;
    const currency = this.sendMoneyForm.getElementsByTagName('select')[1].value;
    this.sendMoneyCallback({ to, amount, currency });

    this.sendMoneyForm.reset();
    const selects = this.sendMoneyForm.querySelectorAll('.text');
    selects[0].innerText = 'Выберите пользователя';
    selects[0].classList.add('default');
    selects[1].innerText = 'Валюта';
    selects[1].classList.add('default');
  }

  setMessage(isSuccess, message) {
    if (isSuccess) {
      this.errorMessageBlock.className = 'ui message fluid success';
    } else {
      this.errorMessageBlock.className = 'ui message fluid error';
    }

    this.errorMessageBlock.innerText = message;
    this.errorMessageBlock.style.display = 'block';
    setTimeout(() => { this.errorMessageBlock.style.display = 'none'; }, 5000);
  }

  // обновляет выпадающий список пользователей
  updateUsersList(data) {
    const select = this.sendMoneyForm.querySelector('.ui.dropdown select');
    select.innerHTML = '<option value="">Выберите пользователя</option>';
    Object.keys(data).forEach((key) => {
      const element = data[key];
      select.innerHTML += `<option value="${+key}">${element}</option>`;
    });
  }
}
