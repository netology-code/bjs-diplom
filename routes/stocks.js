const request = require('request');

function getStocks(callback) {
  const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
  request({
    method: 'GET',
    url,
  }, (error, bankResponse, body) => {
    if (!error && bankResponse.statusCode === 200) {
      const parsed = JSON.parse(body);
      const usd = parsed.Valute.USD.Value;
      const eur = parsed.Valute.EUR.Value;
      const ntc = Number.parseFloat((parsed.Valute.XDR.Value / 10).toFixed(4));
      callback({
        success: true,
        data: {
          RUB_USD: usd,
          RUB_EUR: eur,
          RUB_NTC: ntc,

          USD_RUB: +(1 / usd).toFixed(5),
          USD_EUR: +(usd / eur).toFixed(5),
          USD_NTC: +(usd / ntc).toFixed(5),

          EUR_RUB: +(1 / eur).toFixed(5),
          EUR_USD: +(eur / usd).toFixed(5),
          EUR_NTC: +(eur / ntc).toFixed(5),

          NTC_RUB: +(1 / ntc).toFixed(5),
          NTC_USD: +(ntc / usd).toFixed(5),
          NTC_EUR: +(ntc / eur).toFixed(5),
        },
      });
    } else callback({ success: false, error: error });
  });
}

module.exports = getStocks;
