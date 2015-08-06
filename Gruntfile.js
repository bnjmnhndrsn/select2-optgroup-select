module.exports = function (grunt) {
  // Full list of files that must be included by RequireJS
  includes = [
    'jquery.select2.optgroupSelect'
  ];

  grunt.initConfig({
    package: grunt.file.readJSON('package.json'),

    concat: {
      'dist': {
        options: {
          banner: grunt.file.read('src/js/wrapper.start.js'),
        },
        src: [
          'dist/select2.optgroupSelect.js',
          'src/js/wrapper.end.js'
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
    },
    requirejs: {
      'dist': {
        options: {
          baseUrl: 'src/js',
          optimize: 'none',
          name: 'jquery.select2.optgroupSelect',
          out: 'dist/select2.optgroupSelect.js',
          include: includes,
          namespace: 'S2',
          wrap: {
            startFile: 'src/js/banner.start.js',
            endFile: 'src/js/banner.end.js'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs'); 
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('compile', [
    'requirejs:dist', 'concat:dist', 'sass:dev'
  ]);
};