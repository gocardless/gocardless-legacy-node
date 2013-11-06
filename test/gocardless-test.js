var expect = require('expect.js');
var gocardless = require('../lib/gocardless.js');

describe('gocardless', function() {
  it('is an object', function() {
    expect(gocardless).to.be.a(Function);
  });

  it('throws an error if incorrect config options are passed', function() {
    var opts = {};
    expect(gocardless(opts)).to.throwError();
  });
});
