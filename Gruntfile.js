/*
 * grunt-extract-cldr-data
 *
 *
 * Copyright (c) 2014 Yahoo Inc.
 * Licensed under the Yahoo BSD license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    extract_cldr_data: {
      en: {
        dest: 'tmp/',
        options: {
          locales: ['en'],
          fields : ['year', 'month', 'day', 'hour', 'minute', 'second'],
          plurals: true,

          wrapEntry: function (serialized) {
            return 'IntlRelativeFormat.__addLocaleData(' + serialized + ');';
          }
        }
      },

      all: {
        dest: 'tmp/locales.js',
        options: {
          plurals: true,

          prelude: [
            '// GENERATED FILE',
            'var IntlMessageFormat = require("intl-messageformat");\n\n'
          ].join('\n'),

          wrapEntry: function (serialized) {
            return 'IntlMessageFormat.__addLocaleData(' + serialized + ');';
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'extract_cldr_data', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
