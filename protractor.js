'use strict';

/* global jasmine */

var SpecReporter = require('jasmine-spec-reporter');
var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
  specs: ['tests/functional/protractor/**/*.js'],
  baseUrl: 'http://localhost:3002/#/',
  capabilities: {
    'browserName': 'chrome'
  },
  seleniumPort: 4444,
  onPrepare: function() {
      jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: true, displaySpecDuration: true }));
      jasmine.getEnv().addReporter(new ScreenShotReporter({
         baseDirectory: 'tests/coverage/screenshots'
      }));
   },
   jasmineNodeOpts: {
     print: function() {}
   }
};
