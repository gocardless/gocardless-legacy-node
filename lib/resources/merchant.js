var util = require('util');
var Resource = require('./resource');

function Merchant() {
  Resource.apply(this, arguments);
}

util.inherits(Merchant, Resource);

Merchant.prototype.getSelf = function getSelf(cb) {
  return this.get({ id: this.opts.ownId }, cb);
}

module.exports = function merchantResourceFactory(client, ownId) {
  return new Merchant('/merchants', client, { ownId: ownId });
};
