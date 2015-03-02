/*
 * grunt-extract-cldr-data
 *
 *
 * Copyright (c) 2014 Yahoo Inc.
 * Licensed under the Yahoo BSD license.
 */

'use strict';

module.exports = function (grunt) {

  grunt.registerMultiTask('extract_cldr_data', 'Extract CLDR data and transform it for use in JavaScript.', function () {

    var extractData = require('formatjs-extract-cldr-data');
    var path        = require('path');
    var serialize   = require('serialize-javascript');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      locales       : undefined,
      pluralRules   : false,
      relativeFields: false,
      prelude       : '',
    });

    var data      = extractData(options);
    var dest      = this.data.dest;
    var destIsDir = path.extname(dest) === '';

    function serializeEntry(entry) {
      var serialized = serialize(entry);

      if (options.wrapEntry) {
        return options.wrapEntry(serialized);
      }

      return serialized;
    }

    var files = Object.keys(data).reduce(function (files, locale) {
      var root = locale.split('-')[0];
      files[root] = (files[root] || '') + serializeEntry(data[locale]) + '\n';
      return files;
    }, {});

    if (destIsDir) {
      Object.keys(files).forEach(function (rootLocale) {
        var entryDest = path.join(dest, rootLocale + '.js');
        var file      = options.prelude + files[rootLocale];

        grunt.file.write(entryDest, file, {encoding: 'utf8'});
      });

      grunt.log.ok(files.length + ' locale files written to: ' + dest);
    } else {
      var file = options.prelude;

      file += Object.keys(files).reduce(function (file, rootLocale) {
        return file + files[rootLocale];
      }, '');

      grunt.file.write(dest, file, {encoding: 'utf8'});
      grunt.log.ok('wrote locale data to: ' + dest);
    }

  });

};
