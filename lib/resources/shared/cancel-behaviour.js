// Shared behaviour applies to Subscription and PreAuthorization

module.exports = {
  cancel: function cancel(opts, cb) {
    var path = this.basePath + '/' + opts.id + '/cancel';
    return this.put({ path: path }, cb);
  }
};
