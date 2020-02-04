const request = require('request');

getStocks = function(callback){
    const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
    request({
        method: 'GET',
        url: url,
    }, function (error, bankResponse, body) {
        if (!error && bankResponse.statusCode == 200) {
            parsed = JSON.parse(body);
            let usd = parsed.Valute.USD.Value;
            let eur = parsed.Valute.EUR.Value;
            let ntc = Number.parseFloat((parsed.Valute.XDR.Value / 10).toFixed(4));
            callback({ success: true, data: {
                RUB_USD:usd,
                RUB_EUR:eur,
                RUB_NTC:ntc,
                
                USD_RUB:+(1/usd).toFixed(5),
                USD_EUR:+(usd/eur).toFixed(5),
                USD_NTC:+(usd/ntc).toFixed(5),

                EUR_RUB:+(1/eur).toFixed(5),
                EUR_USD:+(eur/usd).toFixed(5),
                EUR_NTC:+(eur/ntc).toFixed(5),

                NTC_RUB:+(1/ntc).toFixed(5),
                NTC_USD:+(ntc/usd).toFixed(5),
                NTC_EUR:+(ntc/eur).toFixed(5)
            }});
        }
        else
            callback({success: false, data: error})
    })
}

module.exports = getStocks;
