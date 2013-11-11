module.exports = {
  index: function index(cb) {
    var path = '/merchants/' + this.opts.merchantId + this.basePath;
    return this.get({ path: path }, cb);
  },

  cancel: function cancel(opts, cb) {
    var path = this.basePath + '/' + opts.id + '/cancel';
    return this.put({ path: path }, cb);
  }
};
