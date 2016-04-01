/*
 * grunt-sass-import
 * https://github.com/eduardoboucas/grunt-sass-import
 *
 * Copyright (c) 2015 Eduardo Boucas
 * Licensed under the MIT license.
 */

'use strict';

var nodePath = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('sass_import', 'Glob functionality for loading Sass partials', function() {

    var options = this.options({
      includeExtension: false,
      allowedExtensions: ['.scss', '.sass']
    });

    this.files.forEach(function (file) {
      var output = '';
      var destRoot = nodePath.dirname(file.dest);

      file.src.forEach(function (path) {

        // Simple syntax
        grunt.file.expand(path).forEach(function (match) {
          var includeName = '',
              fileParts = splitFilename(match);

          // Discard if extension is now allowed
          if (options.allowedExtensions.indexOf(fileParts.extension) == -1) {
            return;
          }

          // Disable Loop
          if (match === file.dest) {
            return;
          }

          includeName = options.includeExtension ? match : fileParts.name;
          output += buildOutputLine(nodePath.relative(destRoot, includeName));
        });

      });

      grunt.file.write(file.dest, output);
      grunt.log.writeln('File "' + file.dest + '" created.');
    });

    function splitFilename(filename) {
      var dot = filename.indexOf('.');

      return {name: filename.substring(0, dot), extension: filename.substring(dot)};
    }

    function buildOutputLine(file) {
      return '@import \'' + file + '\';\n';
    }
  });

};