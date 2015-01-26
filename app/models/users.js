'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    role: {
      type: String,
      default: 'customer'
    }
});

var passportLocalMongoose = require('passport-local-mongoose');

var options = {
    usernameField: 'email'
};

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('users', userSchema);
