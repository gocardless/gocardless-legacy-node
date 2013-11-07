var Resource = require('./resource');

module.exports = function userResourceFactory(client) {
  return new Resource('/users', client);
};
