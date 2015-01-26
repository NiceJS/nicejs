'use strict';

var root = module.exports = {};

/**
 * Route: /
 * Method: GET
 */
root.index = function(req, res) {
    return res.render('layout');
};

/**
 * Route: *
 * Method: GET
 */
root.wildcard = function(req, res) {
    // Remove prefixed / in path so that we render the correct dudette
    res.render(req.path.replace('/', ''));
};