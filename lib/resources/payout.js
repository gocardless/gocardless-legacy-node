var Resource = require('./resource');

module.exports = function payoutResourceFactory(client) {
  return new Resource('/payouts', client);
};
