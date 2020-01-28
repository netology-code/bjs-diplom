const router = require('express').Router();
const request = require('request');
const user = require('./user');
const favorites = require('./favorites');
const money = require('./money');

router.use('/user', user);
router.use('/favorites', favorites);
router.use('/money', money);

router.get("/stocks", function(requestData, responseData) {
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
            responseData.json({ success: true, data: {
                RUB_USD:usd,
                RUB_EUR:eur,
                RUB_NTC:ntc,
                USD_RUB:+(1/usd).toFixed(5),
                EUR_RUB:+(1/eur).toFixed(5),
                NTC_RUB:+(1/ntc).toFixed(5)
            }});
        }
        else
            responseData.json({success: false, data: error});
    })
})

module.exports = router;
