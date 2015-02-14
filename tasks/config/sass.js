'use strict';

module.exports = function (grunt) {
  grunt.config.set('sass', {
    dev: {
      files: {
        'app/css/main.css': ['app/styles/main.scss']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
};