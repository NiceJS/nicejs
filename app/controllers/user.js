'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var rek = require('rekuire');
var users = rek('users-model');

passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

var user = module.exports = {};

/**
 * Route: /api/login
 * Method: POST
 */
user.login = function(req, res) {
    passport.authenticate('local', function (err, user) {
        if (err) {
          return res.status(500).json({ message: 'database' });
        }
        if (!user) {
          return res.status(401).json({ message: 'user' });
        }

        var token = jwt.sign(user, process.env.JWT_SECRET, { expiresInMinutes: 60 });

        return res.json({ token: token });

    })(req, res);
};

/**
 * Route: /api/register
 * Method: POST
 */
user.register = function(req, res) {
    if (req.body.password !== req.body.repeat_password) {
      return res.status(401).json({ message: 'password' });
    }

    // Added ignores due to proxyquire issue thlorenz/proxyquire#42
    /* istanbul ignore next */
    var newUser = new users({ email: req.body.username });

    /* istanbul ignore next */
    users.register(newUser, req.body.password, function (err, user) {
      if (err) {
        return res.status(500).json({ message: 'database' });
      }

      var token = jwt.sign(user, process.env.JWT_SECRET, { expiresInMinutes: 60 });

      return res.json({token: token});
    });
};

/**
 * Route: /api/p/change-password
 * Method: POST
 */
user.changePassword = function(req, res){
    if (req.body.new_password !== req.body.repeat_password) {
      return res.status(401).json({ message: 'matchpassword' });
    }

    passport.authenticate('local', function (err, user) {
      if (err) {
        return res.status(500).json({ message: 'database' });
      }
      if (!user) {
        return res.status(401).json({ message: 'user' });
      }

      user.setPassword(req.body.new_password, function(err, user) {
        if (err) {
          return res.status(500).json({ message: 'database' });
        }

        user.save(function(err) {          
          if (err) {
            return res.status(500).json({ message: 'database' });
          }

          var token = jwt.sign(user, process.env.JWT_SECRET, { expiresInMinutes: 60 });

          return res.json({ token: token });

        });

      });

    })(req, res);
};
