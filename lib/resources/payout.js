var util = require('util');
var Resource = require('./resource');

function Payout() {
  Resource.apply(this, arguments);
}

util.inherits(Payout, Resource);

Payout.prototype.index = function index(cb) {
  var path = '/merchants/' + this.opts.merchantId + '/payouts';
  return this.get({ path: path }, cb);
};

module.exports = function payoutResourceFactory(client, merchantId) {
  return new Payout('/payouts', client, { merchantId: merchantId });
};
