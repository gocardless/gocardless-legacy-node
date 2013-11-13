// Shared behaviour applies to Subscription and PreAuthorization

module.exports = {
  cancel: function cancel(opts, cb) {
    var path = '/api/v1' + this.basePath + '/' + opts.id + '/cancel';
    return this.put({ path: path }, cb);
  }
};
