var Resource = require('./resource');

module.exports = function merchantResourceFactory(client, ownId) {
  return new Resource('/merchants', client, { ownId: ownId });
};
