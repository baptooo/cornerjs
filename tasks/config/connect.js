'use strict';

module.exports = function (grunt) {
  grunt.config.set('connect', {
    options: {
      port: 1990,
      hostname: 'localhost',
      keepalive: true
    },
    dev: {
      options: {
        base: 'app/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
};