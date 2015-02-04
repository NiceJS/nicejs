
'use strict';

module.exports = function (grunt) {
    var watchFiles = {
        serverJS: ['*.js', 'app/**/*.js', 'routes/**/*.js', 'controllers/**/*.js'],
        unitTests: ['tests/unit/mocha/**/*.js'],
        functionalTests: ['tests/functional/server/**/*.js'],
        clientJS: ['public/app/*.js', 'public/app/**/*.js'],
        angularJS: ['public/lib/angular/*.min.js', 'node_modules/angular-mocks/angular-mocks.js'],
        karmaTests: ['tests/unit/karma/**/*.js'],
        protractorTests: ['tests/functional/frontend/**/*.js']
    };

    var allJS = watchFiles.serverJS
        .concat(watchFiles.unitTests)
        .concat(watchFiles.functionalTests)
        .concat(watchFiles.clientJS)
        .concat(watchFiles.karmaTests)
        .concat(watchFiles.protractorTests);

    grunt.initConfig({
        env: {
          dev: {
            NODE_ENV: 'development'
          },
          test: {
            NODE_ENV: 'test'
          },
          xvfb : {
            DISPLAY: ':1.5',
            NODE_ENV: 'test'
          }
        },
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            serverJS: {
                files: watchFiles.serverJS,
                tasks: ['default']
            },
            unitTests: {
                files: watchFiles.unitTests,
                tasks: ['default']
            },
            functionalTests: {
                files: watchFiles.functionalTests,
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
        shell: {
          xvfb: {
            command: 'Xvfb :1 -screen 5 1024x768x8',
            options: {
              async: true
            }
          },
          run_test_server: {
            command: 'node server.js',
            options: {
              async: true
            }
          },
          protractor_webdriver_manager_update: {
            options: {
              stdout: true
            },
            command: require('path').resolve(__dirname, 'node_modules', 'protractor', 'bin', 'webdriver-manager') + ' update'
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
        express: {
            test: {
                options: {
                    script: 'server.js',
                    node_env: 'test'
                }
            }
        },
        sauce_tunnel: {
            options: {
                username: process.env.SAUCELABS_USERNAME,
                key: process.env.SAUCELABS_ACCESS_KEY,
                identifier: 'saucelabs-tunnel-'+process.env.SAUCELABS_USERNAME,
                tunnelTimeout: 120 // whatever timeout you want to use
            },
            server: {}
        },
        sauce_tunnel_stop: {
            options: {
                username: process.env.SAUCELABS_USERNAME,
                key: process.env.SAUCELABS_ACCESS_KEY,
                identifier: 'saucelabs-tunnel-'+process.env.SAUCELABS_USERNAME
            },
            server: {}
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
        },
        protractor: {
          headless: {
            options: {
              configFile: 'protractor_local.js',
              keepAlive: true,
              noColor: false
            },
            run: {}
          },
          saucelabs: {
            options: {
              configFile: 'protractor.js',
              keepAlive: false,
              noColor: false
            },
            all: {}
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

    grunt.registerTask('default', ['forceOn','lint','test-local', 'forceOff','watch']);

    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('test', ['env:test', 'test-mocha', 'test-supertest', 'test-karma', 'test-protractor-local']);

    grunt.registerTask('test-unit', ['env:test', 'test-mocha', 'test-karma']);
    grunt.registerTask('test-functional', ['env:test', 'test-supertest', 'test-protractor']);
    grunt.registerTask('test-functional', ['env:test', 'test-supertest', 'test-protractor-local']);

    grunt.registerTask('test-mocha', ['env:test', 'mocha_istanbul:coverage']);
    grunt.registerTask('test-supertest', ['env:test', 'mochaTest:functional']);
    grunt.registerTask('test-karma', ['env:test', 'karma:unit']);

    grunt.registerTask('test-protractor', ['env:test', 'sauce_tunnel','express:test','protractor:saucelabs','sauce_tunnel_stop']);
    grunt.registerTask('test-protractor-local', ['shell:protractor_webdriver_manager_update','shell:xvfb', 'env:xvfb', 'shell:run_test_server', 'protractor:headless', 'shell:xvfb:kill', 'shell:run_test_server:kill']);
};
