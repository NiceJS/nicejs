'use strict';

var stylus = require('stylus');

/**
 * returns compressed css when contents of styl file is passed in
 */
exports.compileStylus = function(styl) {
    return stylus(styl).set('compress', true);
};