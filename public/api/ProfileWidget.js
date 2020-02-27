
// eslint-disable-next-line no-unused-vars
class ProfileWidget {
  static showProfile(data) {
    const profileList = document.querySelector('.list');
    const profileID = profileList.querySelector('[data-user-id]');
    const profileName = profileList.querySelector('[data-user-name]');
    const profileMoney = profileList.querySelector('ul');

    profileID.dataset.userId = data.id;
    profileID.innerText = data.id;
    profileName.dataset.userName = data.login;
    profileName.innerText = data.login;

    profileMoney.querySelector('[data-user-wallet-rub]').innerText = data.balance.RUB.toPrecision(5);
    profileMoney.querySelector('[data-user-wallet-eur]').innerText = data.balance.EUR.toPrecision(5);
    profileMoney.querySelector('[data-user-wallet-usd]').innerText = data.balance.USD.toPrecision(5);
    profileMoney.querySelector('[data-user-wallet-ntc]').innerText = data.balance.NTC.toPrecision(5);
  }
}
