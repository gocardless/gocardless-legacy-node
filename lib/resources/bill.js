var util = require('util');

var _ = require('lodash');

var Resource = require('./resource');
var Signer = require('../helpers/request-signer');
var indexBehaviour = require('./shared/index-behaviour');

function Bill(/* client, opts */) {
  this.basePath = '/bills';
  Resource.apply(this, arguments);
}

util.inherits(Bill, Resource);
_.extend(Bill.prototype, indexBehaviour);

// Create a new bill against an existing pre-authorization. Params must contain
// pre_authorization_id key
Bill.prototype.create = function create(params, cb) {
  return this.post({ json: { bill: params } }, cb);
};

// Create a new one off bill
Bill.prototype.createOneOff = function createOneOff(params, cb) {
  var path = '/connect/bills/new';
  params.merchant_id = this.opts.merchantId;

  var signature = Signer.toQuery(params);
  signature = Signer.sign(signature, this.opts.secret);

  var qs = { bill: params, signature: signature };

  return this.get({ path: path, qs: qs }, cb);
};

Bill.prototype.retry = function retry(params, cb) {
  var path = '/api/v1/bills/' + params.id + '/retry';
  return this.post({ path: path }, cb);
};

module.exports = Bill;
