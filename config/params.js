// config/params.js
var mongo_host = process.env.MONGO_HOST || 'localhost';
var mongo_port = process.env.MONGO_PORT || 27017;
var mongo_database = process.env.MONGO_DATABASE || 'nicejs';

module.exports = {
    dbUrl : 'mongodb://' + mongo_host + ':' + mongo_port + '/' + mongo_database,
    port: 3000,
    jwt_secret: 'some secret'
};
