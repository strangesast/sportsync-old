var config = {};

config.PORT = 3000;
config.DB_URL = 'mongodb://localhost:27017/sportsync';
config.SCOREBOARD_API_PORT = 3020;
config.SOCKET_URL = '/sockets';

// bluetooth
config.settings = {
  serviceUuid: 'dacb29c4-7eaf-11e6-ae22-56b6b6499611',
  characteristicUuid: 'dacb2d52-7eaf-11e6-ae22-56b6b6499611',
  serviceName: 'Scoreboard service'
};

module.exports = config;
