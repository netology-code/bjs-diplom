class MarketValue {
  static getNewValue() {
    // получаем отношение неткоина к УЕ (от 0 до 10)
    const netcoinToStandardCurrency = Math.floor(Math.random() * 10);

    return {
      NET_RUB: netcoinToStandardCurrency * 100,
      NET_USD: (netcoinToStandardCurrency * 100) / 66,
      NET_EUR: (netcoinToStandardCurrency * 100) / 72
    };
  }
}
class Market {
  constructor(maxHistoryLenght = 100) {
    this.work = false;
    this.maxHistoryLenght = maxHistoryLenght;
    this.history = new Array(this.maxHistoryLenght);
    for (let index = 0; index < this.history.length; index++) {
      this.history[index] = MarketValue.getNewValue();
    }
  }

  generateNewMarketValues() {
    const newValue = MarketValue.getNewValue();
    if (this.history.length >= this.maxHistoryLenght - 1) {
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
