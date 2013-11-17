var util = require('util');
var crypto = require('crypto');

var _ = require('lodash');
var qs = require('qs');

var Resource = require('./resource');
var Signer = require('../helpers/request-signer');
var indexBehaviour = require('./shared/index-behaviour');

function Bill(/* client, opts */) {
  this.basePath = '/bills';
  this.paramName = 'bill';
  Resource.apply(this, arguments);
}

util.inherits(Bill, Resource);
_.extend(Bill.prototype, indexBehaviour);

// Create a new bill against an existing pre-authorization. Params must contain
// pre_authorization_id key
Bill.prototype.create = function create(params, cb) {
  return this.post({ json: { bill: params } }, cb);
};

// Generate a new one off bill url
Bill.prototype.newUrl = function newUrl(params) {
  var path = '/connect' + this.basePath + '/new';
  params.merchantId = this.opts.merchantId;

  var query = {
    client_id: this.opts.appId,
    timestamp: (new Date()).toISOString(),
    nonce: crypto.randomBytes(32).toString('base64')
  };
  query[this.paramName] = params;

  var signature = Signer.toQuery(query);
  query.signature = Signer.sign(signature, this.opts.secret);

  return this.opts.baseUrl + path + '?' + qs.stringify(query);
};

Bill.prototype.retry = function retry(params, cb) {
  var path = '/api/v1/bills/' + params.id + '/retry';
  return this.post({ path: path }, cb);
};

module.exports = Bill;
