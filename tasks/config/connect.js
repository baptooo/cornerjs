'use strict';

module.exports = function (grunt) {
  grunt.config.set('connect', {
    options: {
      port: 1990,
      hostname: 'localhost'
    },
    dev: {
      options: {
        base: 'app/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
};