'use strict';

module.exports = function (grunt) {
  grunt.registerTask('serve', [
    'wiredep:dev',
    'connect:dev'
  ]);
};