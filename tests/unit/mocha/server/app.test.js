'use strict';

var path = require('path');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.should();
chai.use(sinonChai);

var app;

describe('app.js', function() {
    var expressStub;
    var setSpy;
    var useSpy;
    var getSpy;
    var routerSpy;
    var i18nSpy;

    var loggerStub;
    var loggerStubResponse;

    var urlencodedStub;
    var urlStubResponse;
    var jsonStub;
    var jsonStubResponse;

    var notFoundStub;
    var internalErrStub;
    var internalErrResponse;

    var cookieParserStub;
    var cookieParserResponse;

    var middlewareStub;
    var middlewareResponse;

    var passportInitializeStub;
    var passportInitializeResponse;

    var passportSessionStub;

    var compileStylusStub;

    var mongooseConnectStub;
    var mongooseConnectResponse;

    before(function () {
        expressStub = sinon.stub();
        setSpy = sinon.spy();
        useSpy = sinon.spy();
        getSpy = sinon.spy();
        routerSpy = sinon.spy();
        i18nSpy = sinon.spy();

        expressStub.returns({
            set: setSpy,
            use: useSpy,
            get: getSpy,
            router: routerSpy,
            i18n: i18nSpy
        });

        loggerStub = sinon.stub();
        loggerStubResponse = 'my logger stub response';
        loggerStub.returns(loggerStubResponse);

        jsonStub = sinon.stub();
        jsonStubResponse = 'my json stub response';
        jsonStub.returns(jsonStubResponse);

        urlencodedStub = sinon.stub();
        urlStubResponse = 'my url stub response';
        urlencodedStub.returns(urlStubResponse);

        cookieParserStub = sinon.stub();
        cookieParserResponse = 'my cookieParser stub response';
        cookieParserStub.returns(cookieParserResponse);

        middlewareStub = sinon.stub();
        middlewareResponse = 'my middleware stub response';
        middlewareStub.returns(middlewareResponse);

        passportInitializeStub = sinon.stub();
        passportInitializeResponse = 'my passport initialize stub response';
        passportInitializeStub.returns(passportInitializeResponse);

        notFoundStub = sinon.stub();
        internalErrStub = sinon.stub();
        internalErrResponse = 'some internal err response';
        internalErrStub.returns(internalErrResponse);

        compileStylusStub = sinon.stub();

        mongooseConnectStub = sinon.stub();
        mongooseConnectResponse = 'my mongoose connect stub response';
        mongooseConnectStub.returns(mongooseConnectResponse);

        app = proxyquire(path.join(process.env.PWD, 'app'), {
            'express': expressStub,
            'morgan': loggerStub,
            'body-parser': {
                json: jsonStub,
                urlencoded: urlencodedStub
            },
            'cookie-parser': cookieParserStub,
            'stylus': {
                middleware: middlewareStub
            },
            'mongoose': {
                connect: mongooseConnectStub
            },
            'passport': {
                initialize: passportInitializeStub
            },
            './config/errors': {
                notFound: notFoundStub,
                internalError: internalErrStub
            },
            './config/stylus': {
                compileStylus: compileStylusStub
            }
        });

    });

    it('should setup mongoose connection to mongoDB database `nicejs-` matching environment', function() {
        // Arrange

        // Act

        // Assert
        mongooseConnectStub.should.have.been.calledWithExactly('mongodb://localhost:27017/nicejs-test');
    });

    it('should add views from `app/views` folder', function() {
        // Arrange
        var absoluteBASE_DIR = process.env.PWD;

        // Act

        // Assert
        setSpy.should.have.been.calledWithExactly('views', path.join(absoluteBASE_DIR, 'app/views'));
    });

    it('should use jade as the view engine', function() {
        // Arrange

        // Act

        // Assert
        setSpy.should.have.been.calledWithExactly('view engine', 'jade');
    });

    it('should use the morgan logger', function() {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(loggerStubResponse);
    });

    it('should use logger when dev', function() {
        // Arrange

        // Act

        // Assert
        loggerStub.should.have.been.calledWithExactly('dev');
    });

    it('should use bodyParser to parse JSON requests', function() {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(jsonStubResponse);
    });

    it('should use bodyParser to parse urlencoded bodies with the querystring library', function () {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(urlStubResponse);
    });

    it('should set extended to false when bodyParser urlencoded is called', function() {
        // Arrange

        // Act

        // Assert
        urlencodedStub.should.have.been.calledWithExactly({ extended: false });
    });

    it('should use cookieParser to parse cookies with the application', function () {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(cookieParserResponse);
    });

    it('should initialize passport', function() {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(passportInitializeResponse);
    });

    it('should catch 404 and send to error handler', function () {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(notFoundStub);
    });

    it('should handle internal errors using `500.js`', function () {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(internalErrResponse);
    });

    it('should use stylus to compile css in the application', function () {
        // Arrange

        // Act

        // Assert
        useSpy.should.have.been.calledWithExactly(middlewareResponse);
    });

    it('should call stylus.middleware with compile function, src and dest', function () {
        var expected = {
          compile: compileStylusStub,
          dest: path.join(process.env.PWD, 'public'),
          src: path.join(process.env.PWD, 'public')
        };

        middlewareStub.should.have.been.calledWithExactly(expected);
    });

});
