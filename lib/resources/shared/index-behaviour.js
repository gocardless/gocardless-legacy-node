// Shared behaviour applies to User, Bill and Payout
var _ = require('lodash');
var constants = require('../../constants');

module.exports = {
  index: function index(params, cb) {
    if(_.isFunction(params)) {
      cb = params;
      params = void 0;
    }

    var path = constants.API_ROOT + '/merchants/' + this.opts.merchantId +
                 this.basePath;
    var opts = { path: path };
    params && (opts.qs = params);

    return this.get(opts, cb);
  }
};
