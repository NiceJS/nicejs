/**
 * @file router.js. A central place for all of our routes. This makes testing
 * individual route logic easier along with storing backend routes in one place.
 *
 * Extend this into a router/ folder when necessary
 */

var express = require('express');
var router = express.Router();

var root = require('../controllers/root');
var user = require('../controllers/user');

// backend routes =========================================================

router.post('/api/register', user.register);
router.post('/api/login', user.login);
router.post('/api/p/change-password', user.changePassword);


// frontend routes =========================================================

// route to handle all angular partial requests
router.get('/', root.index);
router.get('*', root.wildcard);


module.exports = router;
