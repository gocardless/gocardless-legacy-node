// Shared behaviour applies to User, Bill and Payout
var constants = require('../../constants');

module.exports = {
  index: function index(cb) {
    var path = constants.API_ROOT + '/merchants/' + this.opts.merchantId +
                 this.basePath;
    return this.get({ path: path }, cb);
  }
};
