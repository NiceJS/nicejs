'use strict';

/* global jasmine */

var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
  specs: ['tests/functional/frontend/**/*.js'],
  baseUrl: 'http://localhost:3002/#/',
  capabilities: {
    'browserName': 'chrome'
  },
  seleniumPort: 4444,
  onPrepare: function() {
      jasmine.getEnv().addReporter(new ScreenShotReporter({
         baseDirectory: 'tests/coverage/screenshots'
      }));
   }
};
