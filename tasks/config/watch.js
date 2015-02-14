'use strict';

module.exports = function (grunt) {
  grunt.config.set('watch', {
    scss: {
      files: ['app/styles/**/*.scss'],
      tasks: ['build']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};