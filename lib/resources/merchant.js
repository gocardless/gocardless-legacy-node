var util = require('util');
var Resource = require('./resource');

function Merchant() {
  this.basePath = '/merchants';
  Resource.apply(this, arguments);
}

util.inherits(Merchant, Resource);

Merchant.prototype.getSelf = function getSelf(cb) {
  return this.get({ id: this.opts.merchantId }, cb);
};

module.exports = Merchant;
