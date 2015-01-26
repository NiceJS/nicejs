'use strict';
/*jshint expr: true*/

var path = require('path');
var proxyquire = require('proxyquire');

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.should();
chai.use(sinonChai);

describe('#compileStylus', function() {
    var stylus;
    var setStub;
    var stylusStub;

    beforeEach(function() {
        stylusStub = sinon.stub();
        setStub = sinon.stub();
        
        stylusStub.returns({
            set: setStub
        });

        stylus = proxyquire(path.join(process.env.PWD, 'config', 'stylus'), {
            'stylus': stylusStub
        });

    });

    it('should compress compiled stylus files', function() {
        // Arrange
        var str = 'str';
        
        // Act
        stylus.compileStylus(str);
        
        // Assert
        setStub.should.have.been.calledWithExactly('compress', true);
    });
});