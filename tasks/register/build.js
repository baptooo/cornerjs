'use strict';

module.exports = function (grunt) {
  grunt.registerTask('build', [
    'sass:dev',
    'wiredep:dev'
  ])
};