'use strict';

describe('#error page', function () {
    it('should be displayed if path does not match a valid route', function () {
        // Arrange
        
        // Act
        browser.get('nonsense');

        // Assert
        expect(element(by.css('.page-header')).getText()).toEqual('OOPS!');
    });
});