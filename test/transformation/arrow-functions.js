var expect = require('chai').expect;
var
  Transformer = require('./../../lib/transformer'),
  arrowTransformation = require('./../../lib/transformation/arrow-functions'),
  transformer = new Transformer({formatter: false});

function test(script) {
  transformer.read(script);
  transformer.applyTransformation(arrowTransformation);
  return transformer.out();
}

describe('Callback to Arrow transformation', function () {

  it('should convert simple callbacks', function () {
    var script = 'setTimeout(function() { return 2 })';

    expect(test(script)).to.equal('setTimeout(() => {\n    return 2;\n});');
  });

  it('should convert callbacks with a single argument', function () {
    var script = 'a(function(b) { return b });';

    expect(test(script)).to.equal('a(b => {\n    return b;\n});');
  });

  it('should convert callbacks with a single argument', function () {
    var script = 'a(function(b, c) { return b });';

    expect(test(script)).to.equal('a((b, c) => {\n    return b;\n});');
  });


  it('shouldn\'t convert other forms of functions', function () {
    var script = 'var x = function () {\n};';

    expect(test(script)).to.equal(script);
  });

  it('shouldn\'t convert functions using `this` keyword', function () {
    var script = 'a(function (b) {\n    this.x = 2;\n});';

    expect(test(script)).to.equal(script);
    transformer.read('var x = 2; x = 5');
  });

});