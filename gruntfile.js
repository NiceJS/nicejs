
'use strict';

module.exports = function (grunt) {
    var watchFiles = {
        serverJS: ['*.js', 'app/**/*.js', 'routes/**/*.js', 'controllers/**/*.js'],
        unitTests: ['tests/unit/mocha/**/*.js'],
        functionalTests: ['tests/functional/supertest/**/*.js'],
        clientJS: ['public/app/*.js', 'public/app/**/*.js'],
        angularJS: ['public/lib/angular/*.min.js', 'node_modules/angular-mocks/angular-mocks.js'],
        karmaTests: ['tests/unit/karma/**/*.js'],
        configJS: ['config/**/*.js']
    };

    var allJS = watchFiles.serverJS
        .concat(watchFiles.unitTests)
        .concat(watchFiles.functionalTests)
        .concat(watchFiles.clientJS)
        .concat(watchFiles.karmaTests)
        .concat(watchFiles.configJS);

    grunt.initConfig({
        foreman: {
            dev: {
                env: ['.env'],
                procfile: 'Procfile',
                port: 3000
            },
            test: {
                env: ['test.env'],
                procfile: 'Procfile',
                port: 3002
            }
        },
        env: {
          test: {
            NODE_ENV: 'test',
            MONGOLAB_URI: 'mongodb://localhost:27017/nicejs-test',
            PORT: 3002,
            JWT_SECRET: 'test secret'
          }
        },
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            allJS: {
                files: watchFiles.allJS,
                tasks: ['default']
            }
        },
        jshint: {
            all: {
                src: allJS,
                options: {
                    jshintrc: true
                }
            }
        },
        uglify: {
          angular: {
            files: {
              'public/dist/app.min.js': watchFiles.clientJS
            }
          }
        },
        less: {
            compile: {
                options: {
                    compress: true
                },
                files: {
                    'public/lib/bootstrap-material-design/dist/css/material.min.css': 'public/lib/bootstrap-material-design/less/material.less'
                }
            }
        },
        'string-replace': {
            inline: {
                files: {
                    'public/lib/bootstrap-material-design/less/_variables.less': 'public/lib/bootstrap-material-design/less/_variables.less'
                },
                options: {
                    replacements: [
                        {
                            pattern: '@primary: @teal;',
                            replacement: '@primary: @indigo-900;'
                        }
                    ]
                }
            }
        },
        mochaTest : {
            options: {
                reporter: 'spec'
            },
            unit: {
                src: watchFiles.unitTests
            },
            functional: {
                src: watchFiles.functionalTests
            },
            all: {
                src: watchFiles.unitTests.concat(watchFiles.functionalTests)
            }
        },
        mocha_istanbul: {
            coverage: {
                src: watchFiles.unitTests,
                options: {
                    coverage: true,
                    coverageFolder: 'tests/coverage',
                    check: {
                        branches: 100
                    },
                    reportFormats: ['text', 'lcov']
                }
            }
        },
        karma: {
          unit: {
            options: {
              files: watchFiles.angularJS.concat(watchFiles.clientJS.concat(watchFiles.karmaTests)),
              basePath: '',
              frameworks: ['mocha', 'sinon-chai'],
              port: 9876,
              colors: true,
              browsers: ['PhantomJS'],
              singleRun: true,
              reporters: ['spec', 'coverage', 'threshold'],
              preprocessors: {
                'public/app/**/*.js': ['coverage']
              },
              coverageReporter: {
                reporters: [
                  { type: 'text', dir: 'tests/coverage/' },
                  { type: 'html', dir: 'tests/coverage/' }
                ]
              },
              thresholdReporter: {
                branches: 100
              }
            }
          }
        }
    });

    // Loads additional grunt plugins from our package.json
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('forceOn', 'turns the --force option ON',
        function() {
            if ( !grunt.option( 'force' ) ) {
                grunt.config.set('forceStatus', true);
                grunt.option( 'force', true );
            }
        });

    grunt.registerTask('forceOff', 'turns the --force option Off',
        function() {
            if ( grunt.config.get('forceStatus') ) {
                grunt.option( 'force', false );
            }
        });

    grunt.event.on('coverage', function(lcov, done){
        done();
    });

    grunt.registerTask('default', ['minify', 'foreman:dev']);

    grunt.registerTask('test-watch', ['forceOn','lint','test', 'forceOff','watch']);

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('bootstrap', ['string-replace', 'less']);
    grunt.registerTask('build', ['minify', 'bootstrap']);

    grunt.registerTask('test', ['env:test', 'test-unit', 'test-functional']);

    grunt.registerTask('test-unit', ['env:test', 'test-mocha', 'test-karma']);
    grunt.registerTask('test-functional', ['env:test', 'test-supertest']);

    grunt.registerTask('test-mocha', ['env:test', 'mocha_istanbul:coverage']);
    grunt.registerTask('test-karma', ['env:test', 'karma:unit']);

    grunt.registerTask('test-supertest', ['env:test', 'mochaTest:functional']);
};
