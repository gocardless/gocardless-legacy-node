// Shared behaviour applies to User, Bill and Payout

module.exports = {
  index: function index(cb) {
    var path = '/merchants/' + this.opts.merchantId + this.basePath;
    return this.get({ path: path }, cb);
  }
}
