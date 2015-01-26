// conf.js
exports.config = {
    sauceUser: process.env.SAUCELABS_USERNAME,
    sauceKey: process.env.SAUCELABS_ACCESS_KEY,
    specs: ['tests/functional/frontend/**/*.js'],
    baseUrl: 'http://localhost:3002/#/',
    multiCapabilities: [
        {   'tunnel-identifier': 'saucelabs-tunnel-'+process.env.SAUCELABS_USERNAME,
            name: 'Functional Tests on Chrome',
            browserName: 'chrome'
        }
    ]
};
