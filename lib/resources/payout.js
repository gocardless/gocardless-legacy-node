var util = require('util');

var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');

function Payout() {
  Resource.apply(this, arguments);
}

util.inherits(Payout, Resource);
_.extend(Payout.prototype, indexBehaviour);

module.exports = function payoutResourceFactory(client, merchantId) {
  return new Payout('/payouts', client, { merchantId: merchantId });
};
