'use strict';

exports.notFound = function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

exports.internalError = function(environment) {
    // development error handler
    // will print stacktrace
    if (environment === 'development') {
        return function (err, req, res) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        };
    }
    // production error handler
    // no stacktraces leaked to user
    return function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    };
};