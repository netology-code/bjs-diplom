class MarketValue {
  static getNewValue() {
    // получаем отношение неткоина к УЕ (от 0 до 10)
    const netcoinToStandardCurrency = Math.floor(Math.random() * 10 + 1);

    return {
      NETCOIN_RUB: netcoinToStandardCurrency * 100,
      NETCOIN_USD: (netcoinToStandardCurrency * 100) / 66,
      NETCOIN_EUR: (netcoinToStandardCurrency * 100) / 72,
      RUB_NETCOIN: 1 / (netcoinToStandardCurrency * 100),
      USD_NETCOIN: 1 / ((netcoinToStandardCurrency * 100) / 66),
      EUR_NETCOIN: 1 / ((netcoinToStandardCurrency * 100) / 72)
    };
  }
}
class Market {
  constructor(maxHistoryLength = 100) {
    this.work = false;
    this.maxHistoryLength = maxHistoryLength;
    this.history = new Array(this.maxHistoryLength);
    for (let index = 0; index < this.history.length; index++) {
      this.history[index] = MarketValue.getNewValue();
    }
  }

  generateNewMarketValues() {
    const newValue = MarketValue.getNewValue();
    if (this.history.length >= this.maxHistoryLength - 1) {
      this.history.splice(0, 1);
    }
    this.history.push(newValue);
  }

  stop() {
    this.work = false;
  }
  start(interval = 3000) {
    this.work = true;

    this.refreshIntervalId = setInterval(() => {
      if (this.work) {
        this.generateNewMarketValues();
      } else {
        clearInterval(this.refreshIntervalId);
      }
    }, interval);
  }
}

const market = new Market();

market.start();

module.exports = market;
