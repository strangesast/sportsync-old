var util = require('util');
var bleno = require('bleno');
var settings = require('../config').settings; // should probably be stored below
var Scoreboard = require('./scoreboard');
var util = require('util');

var Characteristic = require('./characteristic');

function Service(pizza) {
    bleno.PrimaryService.call(this, {
        uuid: settings.serviceUuid,
        characteristics: [
            new Characteristic(new Scoreboard())
        ]
    });
}

util.inherits(Service, bleno.PrimaryService);

module.exports = Service;
