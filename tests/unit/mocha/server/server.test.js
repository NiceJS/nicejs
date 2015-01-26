'use strict';
/*jshint expr: true*/

var server;
var path = require('path');
var proxyquire = require('proxyquire');

var sinon = require('sinon');

var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.should();
chai.use(sinonChai);

describe('server.js', function () {
    var createServerStub;
    var appStub;
    var appGetStub;
    var listenStub;

    var TEST_PORT = 3002;

    beforeEach(function () {
        listenStub = sinon.stub();
        listenStub.yields(null);

        var addressStub = sinon.stub();
        addressStub.returns({
            port: TEST_PORT
        });

        //listenStub.returns(function () {});

        appStub = sinon.stub();
        appGetStub = sinon.stub();
        appGetStub.returns(TEST_PORT);

        appStub.get = appGetStub;
        appStub.listen = listenStub;
    });

    it('should listen on port defined by app', function () {
        // Arrange 

        // Act 
        server = proxyquire(path.join(process.env.PWD, 'server'), {
            './app': appStub
        });

        // Assert
        listenStub.should.have.been.calledWith(TEST_PORT);
    });

    // TODO: Use some proper logging dudette
    it.skip('should log on debug', function () {
        // Arrange 
        var debugStub = sinon.stub();

        // Act 
        server = proxyquire(path.join(process.env.PWD, 'server'), {
            './app': appStub,
            'debug': function () {
                return debugStub;
            }
        });

        // Assert
        debugStub.should.have.been.calledWithExactly('Express server listening on port ' + TEST_PORT);
    });

    describe('naught support', function () {
        it('should send online message once the server is listening', function () {
            // Arrange
            var sendSpy = sinon.spy();
            global.process.send = sendSpy;

            // Act 
            server = proxyquire(path.join(process.env.PWD, 'server'), {
                './app': appStub
            });

            // Assert
            sendSpy.should.have.been.called; 
        });

        it('should not send online message if `process.send` is undefined', function () {
            // Arrange
            var sendSpy = sinon.spy();
            global.process.send = null;

            // Act 
            server = proxyquire(path.join(process.env.PWD, 'server'), {
                './app': appStub
            });

            // Assert
            sendSpy.should.not.have.been.called; 
        });
    });
});
