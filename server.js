'use strict';

var app = require('./app');
var shutdown = require('./shutdown-handler');

var server = app.listen(app.get('port'), function () {
    if (process.send) {
        process.send('online');
    }

    console.log('Express server listening on port ' + app.get('port'));
});

/* istanbul ignore next */
process.on('message', function (message) {
    shutdown.gracefulExit(app, server, message);
});

module.exports = server;
