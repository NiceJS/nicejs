/**
 * @file functions to handle gracefully shutdown of server when terminated by naught
 */

'use strict';

var shutdown = module.exports = {};
var gracefulExit = require('express-graceful-exit');

/**
 * Gracefully closes the server if message is shutdown.
 * @param {object} app The express app (required by express-graceful-exit)
 * @param {object} server The server (required by express-graceful-exit)
 * @param {string} message The message emitted by naught to the server process
 */
shutdown.gracefulExit = function (app, server, message) {
    if (message === 'shutdown') {

        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
            process.exit(0);
        }

        gracefulExit.gracefulExitHandler(app, server, { log: true });
    }
};
