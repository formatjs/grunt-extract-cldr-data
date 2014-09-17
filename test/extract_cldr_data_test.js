'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.extract_cldr_data = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  en: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/en.js');
    var expected = grunt.file.read('test/expected/en.js');
    test.equal(actual, expected, 'should extract English CLDR data for IntlRelativeFormat.');

    test.done();
  },
  all: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/locales.js');
    var expected = grunt.file.read('test/expected/locales.js');
    test.equal(actual, expected, 'should extract CLDR data for all locales for IntlMessageFormat.');

    test.done();
  }
};
