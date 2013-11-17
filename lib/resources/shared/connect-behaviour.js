var crypto = require('crypto');
var qs = require('qs');
var Signer = require('../../helpers/request-signer');

module.exports = {
  newUrl: function newUrl(params) {
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
  }
};
