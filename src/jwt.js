const jwt = require('jsonwebtoken'),
    SECRET = 'SUPERSECRET';

function sign(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, SECRET, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

module.exports.sign = sign;
module.exports.verify = verify;
