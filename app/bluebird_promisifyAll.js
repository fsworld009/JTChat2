let Promise = require('bluebird');
let fs = require('fs');

module.exports = {
    fs : Promise.promisifyAll(fs)
};

