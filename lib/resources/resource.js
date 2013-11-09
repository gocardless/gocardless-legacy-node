var path = require('path');
var request = require('request');

function buildPath(basePath, id) {
  return path.normalize(basePath + '/' + id);
}

function Resource(basePath, client) {
  this.basePath = basePath;
  this.client = client;
}

Resource.prototype.get = function get(id) {
  return this.client.request({
    method: 'GET',
    path: buildPath(this.basePath, id)
  });
};

Resource.prototype.put = function put(id, params) {
  return this.client.request({
    method: 'PUT',
    path: buildPath(this.basePath, id),
    json: params
  });
};

Resource.prototype.post = function post(id, params) {
  return this.client.request({
    method: 'POST',
    path: buildPath(this.basePath, id),
    json: params
  });
};

Resource.prototype.del = function del(id) {
  return this.client.request({
    method: 'DELETE',
    path: buildPath(this.basePath, id)
  });
};

module.exports = Resource;
