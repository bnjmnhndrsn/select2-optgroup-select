module.exports = function (grunt) {
    // Full list of files that must be included by RequireJS
    var includes = [
        'jquery.select2.optgroupSelect'
    ];

    var testFiles = grunt.file.expand('tests/**/*.html');
    var testUrls = testFiles.map(function (filePath) {
        return 'http://localhost:9999/' + filePath;
    });

    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),

        concat: {
            'dist': {
                src: [
                    'src/js/wrapper-start.js',
                    'src/js/optgroup-data.js',
                    'src/js/optgroup-results.js',
                    'src/js/wrapper-end.js'
                ],
                dest: 'dist/select2.optgroupSelect.js'
            }
        },

        connect: {
            tests: {
                options: {
                    base: '.',
                    hostname: '127.0.0.1',
                    port: 9999
                }
            }
        },

        sass: {
            dev: {
                options: {
                    outputStyle: 'nested'
                },
                files: {
                    'dist/select2.optgroupSelect.css': [
                        'src/scss/styles.scss',
                    ]
                }
            }
        },
        qunit: {
            all: {
                options: {
                    urls: testUrls
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('compile', ['concat:dist', 'sass:dev']);
    grunt.registerTask('test', ['compile', 'connect:tests', 'qunit']);
};