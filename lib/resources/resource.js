var path = require('path');
var _ = require('lodash');
var request = require('request');

function buildPath(basePath, id) {
  id && (basePath = basePath + '/' + id);
  return path.normalize(basePath);
}

function Resource(basePath, client, opts) {
  this.basePath = basePath;
  this.client = client;
  this.opts = opts;
}

Resource.prototype.get = function get(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(this.basePath, opts.id);
  opts.method = 'GET';

  return this.client.request(opts, cb);
};

Resource.prototype.put = function put(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(this.basePath, opts.id);
  opts.method = 'PUT';

  return this.client.request(opts, cb);
};

Resource.prototype.post = function post(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(this.basePath, opts.id);
  opts.method = 'POST';

  return this.client.request(opts, cb);
};

Resource.prototype.del = function del(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(this.basePath, opts.id);
  opts.method = 'DELETE';

  return this.client.request(opts, cb);
};

module.exports = Resource;
