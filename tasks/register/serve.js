'use strict';

module.exports = function (grunt) {
  grunt.registerTask('serve', [
    'build',
    'connect:dev',
    'watch'
  ]);
};