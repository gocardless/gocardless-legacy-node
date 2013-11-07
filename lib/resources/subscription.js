var Resource = require('./resource');

module.exports = function subscriptionResourceFactory(client) {
  return new Resource('/subscriptions', client);
};
