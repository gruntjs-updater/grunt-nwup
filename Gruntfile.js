/*
 * grunt-nwup
 * https://github.com/xqwzts/grunt-nwup
 *
 * Copyright (c) 2015 Victor Choueiri
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nwup: {
      options: {
        location: 'http://www.example.com:port/updates/',
        nw: 'path/to/nw.exe',
        updateDir: 'updates/',
      },
      src: ['./build/**/*']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['nwup']);

};
