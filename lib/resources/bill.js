var util = require('util');
var Resource = require('./resource');

function Bill() {
  Resource.apply(this, arguments);
}

util.inherits(Bill, Resource);

Bill.prototype.index = function index(cb) {
  var path = '/merchants/' + this.opts.merchantId + '/bills';
  return this.get({ path: path }, cb);
};

Bill.prototype.create = function create(params, cb) {
  return this.post({ json: { bill: params } }, cb);
};

module.exports = function billResourceFactory(client, merchantId) {
  return new Bill('/bills', client, { merchantId: merchantId });
};
