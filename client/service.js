var util = require('util');
var bleno = require('bleno');

var Characteristic = require('./characteristic');

function Service(pizza) {
    bleno.PrimaryService.call(this, {
        uuid: '13333333333333333333333333333337',
        characteristics: [
            new Characteristic()
        ]
    });
}

util.inherits(Service, bleno.PrimaryService);

module.exports = Service;
