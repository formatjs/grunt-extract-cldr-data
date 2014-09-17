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

    var path      = require('path');
    var serialize = require('serialize-javascript');

    var extract = require('../lib/extract');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      locales: extract.rootLocales(),
      plurals: false,
      fields : false,
      prelude: ''
    });

    var dest      = this.data.dest;
    var destIsDir = path.extname(dest) === '';

    var entries = options.locales.map(function (locale) {
      var data = {locale: locale};

      if (options.plurals) {
        var pluralRuleFunction = extract.pluralRuleFunction(locale);
        if (pluralRuleFunction) {
          data.pluralRuleFunction = pluralRuleFunction;
        } else {
          return null;
        }
      }

      if (options.fields) {
        var fields = extract.fields(locale, options.fields);
        if (fields && Object.keys(fields).length) {
          data.fields = fields;
        } else {
          return null;
        }
      }

      return data;
    }).filter(function (localeData) {
      // Make sure there is data for the given locale.
      return !!localeData;
    });

    function serializeEntry(entry) {
      var serialized = serialize(entry);

      if (options.wrapEntry) {
        return options.wrapEntry(serialized);
      }

      return serialized;
    }

    if (destIsDir) {
      entries.forEach(function (entry) {
        var entryDest = path.join(dest, entry.locale + '.js');
        var file      = options.prelude + serializeEntry(entry);

        grunt.file.write(entryDest, file, {encoding: 'utf8'});
      });

      grunt.log.ok(entries.length + ' locale files written to: ' + dest);
    } else {
      var file = options.prelude + entries.map(serializeEntry).join('\n');
      grunt.file.write(dest, file, {encoding: 'utf8'});
      grunt.log.ok('wrote locale data to: ' + dest);
    }

  });

};
