module.exports = function (grunt) {
  // Full list of files that must be included by RequireJS
  includes = [
    'jquery.select2.optgroupSelect'
  ];

  grunt.initConfig({
    package: grunt.file.readJSON('package.json'),

    concat: {
      'dist': {
        src: [
          'src/js/optgroup-data.js',
          'src/js/optgroup-results.js'
        ],
        dest: 'dist/select2.optgroupSelect.js'
      }
    },

    sass: {
        dev: {
          options: {
            outputStyle: 'nested'
          },
          files: {
            'dist/select2.css': [
              'src/scss/styles.scss',
            ]
          }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs'); 
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('compile', [
    'concat:dist', 'sass:dev'
  ]);
};