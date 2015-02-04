'use strict';

// logout.js
var mongoose = require('mongoose');
var _db;
var _users;

var correctPassword = 'qwerty';

var correctUser = {
    email: 'supertest@supertest',
    hash: 'd36ba0820df55fde332cf32c9782951e8810f04b12f06b8f559f42722ceec5b2d230af001b7cad3e0255b5d3430df90a3ee084c3987fdf33950b52eb6d9c1e290f0f78ea45fc690a02c253d25e8f3bb7a0847804f8b3bc7f81bbc0f7a47100eb137fa70e782325dd344dc4a77ad738dfe4034637163df0e70d1d3d7ac114429100fb0359ee3eaae6aeeb12461f42cfd129f600c95c9add2358f9160ff5e1fde639f4dc23066742367a155e632cd7e040f1d9e821acf1352e9396e258b61199bc81b3e34800ad29b60761a13b64cc40d6aaac6dab88386d99d6673a447da5f87b10820dcdc486a249052be23f45150daec184a05ec1a17a0dd7ef608165212bdf8e4f2365d0b6b5ac68859ffe0ad2a88f3d10ebcead1eaed8cebfd2a64b8efb2161411f470dd0ddbfb33d9b69c2d8e96275924fe18b5a582a6de2a4b885634ebe0d293bc311d79a297bd1621122867cc8e23929d93f6e15af45bc2e4b13e6ef14793e4685265f304c078055ef642fd92e94fd6889f596377b2e1ecbf6a992efd6564017e953917da96b6f85f84640d5f080524c4374c6c7b1ccf14b2f7f2b4320c5880ade1d15a16979cb657644cc7e9ca8517590b7add6b7377ab165d25f5e19df6764d2f6481363cd979d3631ea3cd6dfc44bafd92b38f6c50ab64c373d8a3fd198fb96f257cf65558559b3eb1c88a10360d7d9c62b397bf0edf0132ce08d1f',
    salt: '2e6cb68958c9199563e3a19d0fa1e04caa7141f79f85072f8ab956407a66ace6'
};

describe('#Logout', function() {

  beforeEach(function(done) {
    _db = mongoose.createConnection('mongodb://localhost:27017/nicejs-test');
    _users = _db.collection('users');

    _users.insert(correctUser, function (err) {
        if (err) {
            done(err);
        }

        done();
    });

    browser.get('http://localhost:3002/#/');

    element(by.id('navbarLogin')).click();
    element(by.css('input[name=username]')).sendKeys(correctUser.email);
    element(by.css('input[name=password]')).sendKeys(correctPassword);

    element(by.css('button[name="loginBtn"]')).click();

    expect(
      element(by.xpath('//*[contains(text(),\'You are now logged in\')]'))
      .isPresent()
    )
    .toBe(true);
  });

  afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
    browser.manage().deleteAllCookies();

    _users.drop();
    _db.close();
  });

  it('should succeed to log user out correctly', function() {
    // Arrange
    element(by.id('navbarSetting')).click();
    browser.sleep(500);

    // Act
    element(by.id('navbarLogout')).click();

    // Assert
    expect(
      element(by.xpath('//*[contains(text(),\'You have been logged out\')]'))
      .isPresent()
    )
    .toBe(true);

  });

});
