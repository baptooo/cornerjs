'use strict';

module.exports = function (grunt) {
  grunt.config.set('wiredep', {
    dev: {
      src: ['app/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
};