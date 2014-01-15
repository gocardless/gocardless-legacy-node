var crypto = require('crypto');
var qs = require('qs');
var Signer = require('../../helpers/request-signer');

module.exports = {
  newUrl: function newUrl(params) {
    var path = '/connect' + this.basePath + '/new';
    params.merchant_id = this.opts.merchantId;

    var state = params.state;
    var cancel_uri = params.cancel_uri;
    var redirect_uri = params.redirect_uri;

    delete params.state;
    delete params.cancel_uri;
    delete params.redirect_uri;

    var query = {
      client_id: this.opts.appId,
      timestamp: (new Date()).toISOString(),
      nonce: crypto.randomBytes(32).toString('base64')
    };
    query[this.paramName] = params;

    state && (query.state = state);
    cancel_uri && (query.cancel_uri = cancel_uri);
    redirect_uri && (query.redirect_uri = redirect_uri);

    var signature = Signer.toQuery(query);
    query.signature = Signer.sign(signature, this.opts.secret);

    return this.opts.baseUrl + path + '?' + qs.stringify(query);
  }
};
