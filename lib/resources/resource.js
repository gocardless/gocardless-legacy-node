var path = require('path');
var _ = require('lodash');
var request = require('request');

function buildPath(basePath, id) {
  id && (basePath = basePath + '/' + id);
  return path.normalize(basePath);
}

function Resource(basePath, client) {
  this.basePath = basePath;
  this.client = client;
}

Resource.prototype.get = function get(id, cb) {
  cb = (_.isFunction(id) ? id : cb);

  return this.client.request({
    method: 'GET',
    path: buildPath(this.basePath, id)
  }, cb);
};

Resource.prototype.put = function put(id, params, cb) {
  cb = (_.isFunction(id) ? id : _.isFunction(params) ? params : cb);

  return this.client.request({
    method: 'PUT',
    path: buildPath(this.basePath, id),
    json: params
  }, cb);
};

Resource.prototype.post = function post(id, params, cb) {
  cb = (_.isFunction(id) ? id : _.isFunction(params) ? params : cb);

  return this.client.request({
    method: 'POST',
    path: buildPath(this.basePath, id),
    json: params
  }, cb);
};

Resource.prototype.del = function del(id, cb) {
  cb = (_.isFunction(id) ? id : cb);

  return this.client.request({
    method: 'DELETE',
    path: buildPath(this.basePath, id)
  }, cb);
};

module.exports = Resource;
