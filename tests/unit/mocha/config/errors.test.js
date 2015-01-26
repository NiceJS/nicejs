'use strict';
/*jshint expr: true*/

var path = require('path');
var errors = require(path.join(process.env.PWD, 'config', 'errors'));

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.should();
chai.use(sinonChai);

describe('#errors', function () {
    describe('#notFound', function () {
        var spy;
        var req;
        var res;

        beforeEach(function () {
            spy = sinon.spy();
            req = {};
            res = {};
        });

        it('should pass an error to the `next` middleware', function () {
            // Arrange

            // Act
            errors.notFound(req, res, spy);

            // Assert
            chai.expect(spy).to.be.an.error;
        });

        it('the error should have `status 404`', function () {
             // Arrange

            // Act
            errors.notFound(req, res, spy);

            // Assert
            var error = spy.lastCall.args[0];
            chai.expect(error.status).to.equal(404);
        });

        it('the error should have `Not Found` message', function () {
             // Arrange

            // Act
            errors.notFound(req, res, spy);

            // Assert
            var error = spy.lastCall.args[0];
            chai.expect(error.message).to.equal('Not Found');
        });
    });

    describe('#internalError', function () {
        it('should have a response status matching error status if present', function () {
            // Arrange
            var statusSpy = sinon.spy();
            var renderSpy = sinon.spy();
            var expected = 500;

            var err = new Error('holy cow batman!');
            err.status = expected;
            var req = {};
            var res = {
                status: statusSpy,
                render: renderSpy
            };

            // Act
            var errFunction = errors.internalError('development');
            errFunction(err, req, res, null);

            // Assert
            chai.expect(statusSpy).to.have.been.calledWithExactly(expected);
        });

        it('should have a status of 500 if error status not present', function () {
            // Arrange
            var statusSpy = sinon.spy();
            var renderSpy = sinon.spy();
            var expected = 500;

            var err = new Error('holy cow batman!');
            err.status = null;
            var req = {};
            var res = {
                status: statusSpy,
                render: renderSpy
            };

            // Act
            var errFunction = errors.internalError('development');
            errFunction(err, req, res, null);

            // Assert
            chai.expect(statusSpy).to.have.been.calledWithExactly(expected);
        });

        it('should rendor `error` view', function () {
            // Arrange
            var statusSpy = sinon.spy();
            var renderSpy = sinon.spy();

            var err = new Error('holy cow batman!');
            var req = {};
            var res = {
                status: statusSpy,
                render: renderSpy
            };

            // Act
            var errFunction = errors.internalError('development');
            errFunction(err, req, res, null);

            // Assert
            var args = renderSpy.lastCall.args;

            chai.expect(args[0]).to.equal('error');
        });

        it('should render `message` of error message', function () {
            // Arrange
            var statusSpy = sinon.spy();
            var renderSpy = sinon.spy();
            var expected = 'Holy cow batman!';

            var err = new Error(expected);
            var req = {};
            var res = {
                status: statusSpy,
                render: renderSpy
            };

            // Act
            var errFunction = errors.internalError('development');
            errFunction(err, req, res, null);

            // Assert
            var args = renderSpy.lastCall.args;

            chai.expect(args[1].message).to.equal(expected);
        });

        it('should render stack trace as `error` in `development` environment', function () {
            // Arrange
            var statusSpy = sinon.spy();
            var renderSpy = sinon.spy();

            var expected = new Error('holy cow batman!');
            var req = {};
            var res = {
                status: statusSpy,
                render: renderSpy
            };

            // Act
            var errFunction = errors.internalError('development');
            errFunction(expected, req, res, null);

            // Assert
            var args = renderSpy.lastCall.args;

            chai.expect(args[1].error).to.equal(expected);
        });

        it('should render empty stack trace as `error` when not in `development` environment', function () {
            // Arrange
            var statusSpy = sinon.spy();
            var renderSpy = sinon.spy();
            var expected = {};

            var req = {};
            var res = {
                status: statusSpy,
                render: renderSpy
            };

            // Act
            var errFunction = errors.internalError('production');
            errFunction(expected, req, res, null);

            // Assert
            var args = renderSpy.lastCall.args;

            chai.expect(args[1].error).to.eql(expected);
        });
    });
});