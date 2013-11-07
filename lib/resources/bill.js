var Resource = require('./resource');

module.exports = function billResourceFactory(client) {
  return new Resource('/bills', client);
};
