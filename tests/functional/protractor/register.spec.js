'use strict';

// signup.js
var mongoose = require('mongoose');
var _db;
var _users;

describe('#Register', function() {

  beforeEach(function() {
    _db = mongoose.createConnection('mongodb://localhost:27017/nicejs-test');
    _users = _db.collection('users');

    browser.get('/');
    element(by.id('navbarSignup')).click();
  });

  afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
    browser.manage().deleteAllCookies();

    _users.drop();
    _db.close();
  });

  it('should have a title of `Register`', function() {
    // Arrange

    // Act

    // Assert
    expect(element(by.css('.page-header')).getText()).toEqual('Register');
  });

  it('should fail to sign user up if their passwords do not match', function() {
    // Arrange

    // Act
    element(by.css('input[name=username]')).sendKeys('protractor1@protractor1');
    element(by.css('input[name=password]')).sendKeys('qwerty');
    element(by.css('input[name=repeat_password]')).sendKeys('wrongPassword');

    element(by.css('button[name="registerBtn"]')).click();

    // Assert
    expect(
      element(by.xpath('//*[contains(text(),\'Passwords do not match\')]'))
      .isPresent()
    )
    .toBe(true);

  });

  it('should sign user up successfully if credentials are filled in correctly', function() {
    // Arrange

    // Act
    element(by.css('input[name=username]')).sendKeys('protractor2@protractor2');
    element(by.css('input[name=password]')).sendKeys('qwerty');
    element(by.css('input[name=repeat_password]')).sendKeys('qwerty');

    element(by.css('button[name="registerBtn"]')).click();

    // Assert
    expect(
      element(by.xpath('//*[contains(text(),\'You have successfully registered\')]'))
      .isPresent()
    )
    .toBe(true);

  });

});
