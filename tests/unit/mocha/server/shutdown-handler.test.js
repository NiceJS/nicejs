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

describe('shutdown-handler', function () {
    var gracefulExitStub;
    var shutdownHandler;

    beforeEach(function () {
        gracefulExitStub = sinon.stub();

        shutdownHandler = proxyquire(path.join(process.env.PWD, 'shutdown-handler'), {
            'express-graceful-exit': {
                gracefulExitHandler: gracefulExitStub
            }
        });
    });

    describe('#gracefulExit', function () {
        it('should not exit if message is not shutdown', function () {
            // Arrange
            var app = {};
            var server = {};
            var message = 'lalalala';

            // Act
            shutdownHandler.gracefulExit(app, server, message);

            // Assert
            chai.expect(gracefulExitStub).to.not.have.been.called;
        });

        it('should gracefully exit if message is shutdown and environment is production', function () {
            // Arrange
            process.env.NODE_ENV = 'production';
            var app = {};
            var server = {};
            var message = 'shutdown';

            // Act
            shutdownHandler.gracefulExit(app, server, message);

            // Assert
            chai.expect(gracefulExitStub).to.have.been.called;
            process.env.NODE_ENV = 'test';
        });

        it('graceful exit should log when called', function () {
            // Arrange
            process.env.NODE_ENV = 'production';
            var app = {};
            var server = {};
            var message = 'shutdown';

            // Act
            shutdownHandler.gracefulExit(app, server, message);

            // Assert
            var logArg = gracefulExitStub.lastCall.args[2];

            chai.expect(logArg.log).to.be.true;
            process.env.NODE_ENV = 'test';
        });
    });
});
