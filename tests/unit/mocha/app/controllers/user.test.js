'use strict';
/*jshint expr: true*/

var path = require('path');
var user = require(path.join(process.env.PWD, 'app', 'controllers', 'user'));
var params = require(path.join(process.env.PWD, 'config', 'params-test'));
var jwt = require('jsonwebtoken');
var proxyquire = require('proxyquire');

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.should();
chai.use(sinonChai);

describe('#user', function() {

    describe('#root', function() {

        var passportUseStub;
        var passportUseResponse;
        var passportAuthenticateStub;
        var passportAuthenticateResponse;

        var passportSerializeUserStub;
        var passportDeserializeUserStub;

        var authenticateStub;
        var serializeUserStub;
        var deserializeUserStub;

        var strategyResponse;
        var localStrategyStub;
        var strategyStub;

        beforeEach(function() {
            strategyResponse = {};

            localStrategyStub = sinon.stub();
            localStrategyStub.returns(strategyResponse);

            strategyStub = sinon.stub();
            strategyStub.returns('invalid response');
            strategyStub.withArgs(localStrategyStub).returns(strategyResponse);

            passportUseStub = sinon.stub();
            passportUseResponse = function () {};
            passportUseStub.returns(passportUseResponse);

            passportAuthenticateStub = sinon.stub();
            passportAuthenticateResponse = function () {};
            passportAuthenticateStub.returns(passportAuthenticateResponse);

            passportSerializeUserStub = sinon.stub();
            passportDeserializeUserStub = sinon.stub();

            authenticateStub = sinon.stub();
            serializeUserStub = sinon.stub();
            deserializeUserStub = sinon.stub();

            user = proxyquire(path.join(process.env.PWD, 'app', 'controllers', 'user'), {
                'passport': {
                    use: passportUseStub,
                    authenticate: passportAuthenticateStub,
                    serializeUser: passportSerializeUserStub,
                    deserializeUser: passportDeserializeUserStub
                },
                'passport-local': {
                    Strategy: strategyStub
                },
                '../models/users': {
                    authenticate: authenticateStub,
                    serializeUser: serializeUserStub,
                    deserializeUser: deserializeUserStub
                }
            });
        });

        it('should use a new passport local strategy', function() {
            // Arrange

            // Act

            // Assert
            passportUseStub.should.be.calledWithExactly(strategyResponse);
        });

        it('should return the user object to serialize the user', function() {
            // Arrange

            // Act

            // Assert
            passportSerializeUserStub.should.not.have.been.calledWithExactly(serializeUserStub);
        });

        it('should return the user object to deserialize the user', function() {
            // Arrange

            // Act

            // Assert
            passportDeserializeUserStub.should.not.have.been.calledWithExactly(deserializeUserStub);
        });

    });

    describe('#login', function() {
        var obj;
        var req;
        var res;
        var next;

        var passportUseStub;
        var passportUseResponse;
        var passportAuthenticateStub;
        var passportAuthenticateResponse;

        var serializeUserStub;
        var deserializeUserStub;
        var returnUserStub;
        var strategyStub;

        var statusStub;
        var jsonStub;

        beforeEach(function() {
            statusStub = sinon.stub();
            jsonStub = sinon.stub();

            obj = {
                status: statusStub,
                json: jsonStub
            };

            statusStub.returns(obj);
            jsonStub.returns(obj);

            req = {};
            res = obj;
            next = function() {};

            passportUseStub = sinon.stub();
            passportUseResponse = function () {};
            passportUseStub.returns(passportUseResponse);

            passportAuthenticateStub = sinon.stub();
            passportAuthenticateResponse = function () {};
            passportAuthenticateStub.returns(passportAuthenticateResponse);

            serializeUserStub = sinon.stub();
            deserializeUserStub = sinon.stub();
            returnUserStub = sinon.stub();

            user = proxyquire(path.join(process.env.PWD, 'app', 'controllers', 'user'), {
                'passport': {
                    use: passportUseStub,
                    authenticate: passportAuthenticateStub,
                    serializeUser: serializeUserStub,
                    deserializeUser: deserializeUserStub
                },
                'passport-local': {
                    Strategy: strategyStub
                }
            });
        });

        it('should authenticate only once', function() {
            // Arrange

            // Act
            user.login(req, res, next);
            // Assert
            passportAuthenticateStub.should.have.been.calledOnce;
        });

        it('should use passport middleware with local as the strategy', function() {
            // Arrange

            // Act
            user.login(req, res, next);
            // Assert
            passportAuthenticateStub.should.have.been.calledWith('local');
        });

        it('should return a status of 500 when an error occurs with passport authenticate', function() {
            // Arrange
            passportAuthenticateStub.yields('err', null);
            // Act
            user.login(req, res, next);
            // Assert
            statusStub.should.have.been.calledWithExactly(500);
        });

        it('should return a json message of `database` when an error occurs with passport authenticate', function() {
            // Arrange
            passportAuthenticateStub.yields('err', null);
            // Act
            user.login(req, res, next);
            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'database' });
        });

        it('should return a status of 401 when passport authenticate doesn\'t find a user', function() {
            // Arrange
            passportAuthenticateStub.yields(null, null);
            // Act
            user.login(req, res, next);
            // Assert
            statusStub.should.have.been.calledWithExactly(401);
        });

        it('should return a json message of `user` when passport authenticate doesn\'t find a user', function() {
            // Arrange
            passportAuthenticateStub.yields(null, null);
            // Act
            user.login(req, res, next);
            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'user' });
        });

        it('should not set res.user to be the returned user when passport authenticate succeeds', function() {
            // Arrange
            var ruser = 'this is the returned user';
            passportAuthenticateStub.yields(null, ruser);
            // Act
            user.login(req, res, next);
            // Assert
            chai.expect(res.user).to.not.exist;
        });

        it('should return a jwt token when passport authenticate succeeds', function() {
          // Arrange
          var ruser = 'this is the returned user';
          passportAuthenticateStub.yields(null, ruser);
          // Act
          user.login(req, res, next);
          // Assert
          chai.expect(jsonStub.lastCall.args[0].token).to.exist;
        });

        it('should return a jwt token that encapsulates the user object', function () {
          // Arrange
          var ruser = 'this is the returned user';
          passportAuthenticateStub.yields(null, ruser);
          // Act
          user.login(req, res, next);
          // Assert
          var returnedToken = jsonStub.lastCall.args[0].token;
          var decoded = jwt.verify(returnedToken, params.jwt_secret);

          chai.expect(decoded).to.equal(ruser);
        });
    });

    describe('#register', function() {
        var obj;
        var req;
        var res;

        var authoriseUserStub;
        var usersStub;
        var saveStub;
        var getStub;

        var statusStub;
        var jsonStub;

        beforeEach(function() {
            statusStub = sinon.stub();
            jsonStub = sinon.stub();

            obj = {
                user: 'blank user',
                status: statusStub,
                json: jsonStub
            };

            statusStub.returns(obj);
            jsonStub.returns(obj);

            req = {
                body: {
                    password: 'qwerty',
                    repeat_password: 'qwerty'
                }
            };
            res = obj;

            usersStub = sinon.stub();
            saveStub = sinon.stub();
            getStub = sinon.stub();

            getStub.returns('user');
        });

        it('should return a status of 401 when passwords do not match', function() {
            // Arrange
            req.body.repeat_password = 'passwordMismatch';

            // Act
            user.register(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(401);
        });

        it('should return a json message of `password` when passwords do not match', function() {
            // Arrange
            req.body.repeat_password = 'passwordMismatch';

            // Act
            user.register(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'password' });
        });

        it('should return a status of 500 when an error occurs saving user', function () {
            // Arrange

            // Act
            user.register(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(500);
        });

        // Added skip due to proxyquire issue thlorenz/proxyquire#42
        it.skip('should return a json message of `database` when an error occurs saving user', function() {
            // Arrange
            saveStub.yields('err', null);

            // Act
            user.register(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'database' });
        });

        // Added skip due to proxyquire issue thlorenz/proxyquire#42
        it.skip('should return a token when new user saves correctly', function() {
            // Arrange
            var ruser = 'this is the returned user';
            saveStub.yields(null, ruser);
            // Act
            user.register(req, res);
            // Assert
            var args = jsonStub.lastCall.args[0];

            chai.expect(args.token).to.exist;
        });

        // Added skip due to proxyquire issue thlorenz/proxyquire#42
        it.skip('returned token should contain username when new user saves correctly', function() {
          // Arrange
          var ruser = {
            username: 'bob',
            password: 'notsteve'
          };

          saveStub.yields(null, ruser);
          // Act
          user.register(req, res);
          // Assert
          var returnedToken = jsonStub.lastCall.args[0].token;
          var decoded = jwt.verify(returnedToken, params.jwt_secret);

          chai.expect(decoded.username).to.equal(ruser.username);
        });

        // Added skip due to proxyquire issue thlorenz/proxyquire#42
        it.skip('returned token should not contain password when new user saves correctly', function () {
          // Arrange
          var ruser = {
            username: 'bob',
            password: 'notsteve'
          };

          saveStub.yields(null, ruser);
          // Act
          user.register(req, res);
          // Assert
          var returnedToken = jsonStub.lastCall.args[0].token;
          var decoded = jwt.verify(returnedToken, params.jwt_secret);

          chai.expect(decoded.password).to.not.exist;
        });
    });

    describe('#changePassword', function() {
        var obj;
        var req;
        var res;

        var usersStub;
        var setPasswordStub;
        var saveStub;

        var passportUseStub;
        var passportUseResponse;
        var passportAuthenticateStub;
        var passportAuthenticateResponse;

        var serializeUserStub;
        var deserializeUserStub;
        var strategyStub;

        var jwtSigninStub;
        var jwtSigninResponse;

        var statusStub;
        var jsonStub;

        beforeEach(function() {

            usersStub = sinon.stub();
            setPasswordStub = sinon.stub();
            saveStub = sinon.stub();

            req = {
                user: {
                    username: 'jhankin',
                    password: 'oldpassword'
                },
                body: {
                    username: 'username',
                    password: 'password',
                    new_password: 'newpassword',
                    repeat_password: 'newpassword'
                }
            };

            statusStub = sinon.stub();
            jsonStub = sinon.stub();

            obj = {
                user: 'blank user',
                status: statusStub,
                json: jsonStub
            };

            statusStub.returns(obj);
            jsonStub.returns(obj);

            res = obj;

            passportUseStub = sinon.stub();
            passportUseResponse = function () {};
            passportUseStub.returns(passportUseResponse);

            passportAuthenticateStub = sinon.stub();
            passportAuthenticateResponse = function () {};
            passportAuthenticateStub.returns(passportAuthenticateResponse);

            serializeUserStub = sinon.stub();
            deserializeUserStub = sinon.stub();
            strategyStub = sinon.stub();

            jwtSigninStub = sinon.stub();
            jwtSigninResponse = 'This is the generated token';
            jwtSigninStub.returns(jwtSigninResponse);

            user = proxyquire(path.join(process.env.PWD, 'app', 'controllers', 'user'), {
                'passport': {
                    use: passportUseStub,
                    authenticate: passportAuthenticateStub,
                    serializeUser: serializeUserStub,
                    deserializeUser: deserializeUserStub
                },
                'passport-local': {
                    Strategy: strategyStub
                },
                'jsonwebtoken': {
                    sign: jwtSigninStub
                }
            });
        });

        it('should return a status of 401 when passwords do not match', function() {
            // Arrange
            req.body.repeat_password = 'passwordMismatch';

            // Act
            user.changePassword(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(401);
        });

        it('should return a json message of `password` when passwords do not match', function() {
            // Arrange
            req.body.repeat_password = 'passwordMismatch';

            // Act
            user.changePassword(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'matchpassword' });
        });

        it('should use passport middleware with local as the strategy', function() {
            // Arrange

            // Act
            user.changePassword(req, res);
            var arg = passportAuthenticateStub.lastCall.args;

            // Assert
            arg[0].should.eql('local');
        });

        it('should use passport middleware and yield to a function when complete', function() {
            // Arrange

            // Act
            user.changePassword(req, res);
            var arg = passportAuthenticateStub.lastCall.args;

            // Assert
            arg[1].should.be.a('function');
        });

        it('should return a status of 500 when an error occurs finding user', function () {
            // Arrange
            passportAuthenticateStub.yields('err', 'user');

            // Act
            user.changePassword(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(500);
        });

        it('should return a json message of `database` when an error occurs finding user', function() {
            // Arrange
            passportAuthenticateStub.yields('err', 'user');

            // Act
            user.changePassword(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'database' });
        });

        it('should return a status of 401 when a user is not found', function () {
            // Arrange
            passportAuthenticateStub.yields(null, null);

            // Act
            user.changePassword(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(401);
        });

        it('should return a json message of `database` when a user is not found', function() {
            // Arrange
            passportAuthenticateStub.yields(null, null);

            // Act
            user.changePassword(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'user' });
        });

        it('should set user.setPassword to be the new password when password match succeeds', function() {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);

            // Act
            user.changePassword(req, res);
            var arg = setPasswordStub.lastCall.args;

            // Assert
            arg[0].should.eql(req.body.new_password);
        });

        it('should yield to a function when password match succeeds', function() {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);

            // Act
            user.changePassword(req, res);
            var arg = setPasswordStub.lastCall.args;

            // Assert
            arg[1].should.be.a('function');
        });

        it('should return a status of 500 when a users fails to set new password', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields('err', null);

            // Act
            user.changePassword(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(500);
        });

        it('should return a json message of `database` when a users fails to set new password', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields('err', null);

            // Act
            user.changePassword(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'database' });
        });

        it('should yield to a function when saving the user', function() {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);

            // Act
            user.changePassword(req, res);
            var arg = saveStub.lastCall.args;

            // Assert
            arg[0].should.be.a('function');
        });

        it('should return a status of 500 when a users fails to save updated user', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);
            saveStub.yields('err');

            // Act
            user.changePassword(req, res);

            // Assert
            statusStub.should.have.been.calledWithExactly(500);
        });

        it('should return a json message of `database` when a users fails to save updated user', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);
            saveStub.yields('err');

            // Act
            user.changePassword(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ message: 'database' });
        });

        it('should generate a token passing in the user', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);
            saveStub.yields(null);

            // Act
            user.changePassword(req, res);
            var arg = jwtSigninStub.lastCall.args;

            // Assert
            arg[0].should.eql(ruser);
        });

        it('should generate a token passing in the jwt_secret', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);
            saveStub.yields(null);

            // Act
            user.changePassword(req, res);
            var arg = jwtSigninStub.lastCall.args;

            // Assert
            arg[1].should.eql(params.jwt_secret);
        });

        it('should generate a token setting the expiry for 60 minutes', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);
            saveStub.yields(null);

            // Act
            user.changePassword(req, res);
            var arg = jwtSigninStub.lastCall.args;

            // Assert
            arg[2].should.eql({ expiresInMinutes: 60 });
        });

        it('should return a token containing the updated user details', function () {
            // Arrange
            var ruser = {
                setPassword: setPasswordStub,
                save: saveStub
            };
            passportAuthenticateStub.yields(null, ruser);
            setPasswordStub.yields(null, ruser);
            saveStub.yields(null);

            // Act
            user.changePassword(req, res);

            // Assert
            jsonStub.should.have.been.calledWithExactly({ token: jwtSigninResponse });
        });

    });

});
