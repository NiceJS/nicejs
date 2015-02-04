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
 * Route: /views/*
 * Method: GET
 */
root.wildcard = function(req, res) {    
    // Remove prefixed /views/ in path so that we render the correct jade template
    return res.render(req.path.replace('/views/', ''));
};