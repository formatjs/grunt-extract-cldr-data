# grunt-extract-cldr-data

> Extract CLDR data and transform it for use in JavaScript. This a Grunt plugin for the [formatjs-extract-cldr-data][].

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Dependency Status][david-badge]][david]

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-extract-cldr-data --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-extract-cldr-data');
```

## The "extract_cldr_data" task

### Overview
In your project's Gruntfile, add a section named `extract_cldr_data` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  extract_cldr_data: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### `dest`

Each target must supply a `dest` property for the file path where the generated files should be outputted to. If `dest` is a directory, then a file will be generated per locale. If `dest` is a `.js` file, then _only one_ file will be generated and it will contain the data for all `options.locales`.

### Options

#### options.locales
Type: `Array`
Default value: All CLDR locales

An array of language tag strings strings for the locales to extract data for; e.g., `['en', 'fr', 'zh-Hant-HK', ...]`

#### options.pluralRules
Type: `Boolean`
Default value: `false`

Whether or not the `pluralRuleFunction` CLDR data should be extracted for each of the given `locales`.

#### options.relativeFields
Type: `Boolean`
Default value: `false`

Whether or not the relative-time `fields` CLDR data should be extracted for each of the given `locales`.

#### options.prelude
Type: `String`
Default value: `""`

A string that will be prepended to each of the generated files. This can be a code comment, or actual JavaScript code.

#### options.wrapEntry
Type: `Function`
Default value: `undefined`

A function that will be passed a string of serialized data for each each `option.locales`. This function must return a string. This is useful for wrapping the locale data with JavaScript code; e.g., assigning it to a `var`.

### Usage Examples

#### Extract Plural Rule Functions
In this example, the CLDR plural rule functions for all locales will be extracted and output into a single file which wraps each locale's data in a function call:

```js
grunt.initConfig({
  extract_cldr_data: {
    all: {
      dest: 'locale-data/locales.js',
      options: {
        pluralRules: true,

        prelude: [
          '// GENERATED FILE',
          'var IntlMessageFormat = require("intl-messageformat");\n\n'
        ].join('\n'),

        wrapEntry: function (serialized) {
          return 'IntlMessageFormat.__addLocaleData(' + serialized + ');';
        }
      }
    },
  },
})
```

#### Extract Fields and Plural Rule Functions
In this example, CLDR relative-time fields and plural rule functions for just English and French will be extracted and output into a one file per locale. Both of the locale's data is also wrapped in a function call:

```js
grunt.initConfig({
  extract_cldr_data: {
    en_and_fr: {
      dest: 'locale-data/',
      options: {
        locales       : ['en-US', 'fr-FR'],
        pluralRules   : true,
        relativeFields: true,

        wrapEntry: function (serialized) {
          return 'IntlRelativeFormat.__addLocaleData(' + serialized + ');';
        }
      }
    },
  },
})
```

**Note:** The `locale-data/` directory will contain two files: `en.js`, and `fr.js`. This is because the hierarchy in the language tags is leveraged to de-duplicate data at the language level.

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- `1.0.0`: Initial release.
- `1.0.1`: Update cldr package to fix issue with plural rule functions.
- `1.1.0`: Update and lock-down cldr package to latest.
- `2.0.0`: Refactored to use [formatjs-extract-cldr-data][].
- `2.1.0`: Upgrade to `formatjs-extract-cldr-data@v1.1.0`.
- `3.0.0`: Upgrade to `formatjs-extract-cldr-data@v2.0.0`.
- `4.0.0`: Upgrade to `formatjs-extract-cldr-data@v4.0.0`.
- `4.1.0`: Upgrade to `formatjs-extract-cldr-data@v4.1.0`.

## License
This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][LICENSE] for license text and copyright information.


[formatjs-extract-cldr-data]: https://github.com/yahoo/formatjs-extract-cldr-data
[npm]: https://www.npmjs.org/package/grunt-extract-cldr-data
[npm-badge]: https://img.shields.io/npm/v/grunt-extract-cldr-data.svg?style=flat-square
[travis]: https://travis-ci.org/yahoo/grunt-extract-cldr-data
[travis-badge]: https://img.shields.io/travis/yahoo/grunt-extract-cldr-data/master.svg?style=flat-square
[david]: https://david-dm.org/yahoo/grunt-extract-cldr-data
[david-badge]: https://img.shields.io/david/yahoo/grunt-extract-cldr-data.svg?style=flat-square
[LICENSE]: https://github.com/yahoo/grunt-extract-cldr-data/blob/master/LICENSE
