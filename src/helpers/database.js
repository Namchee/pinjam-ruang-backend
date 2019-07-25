"use strict";
exports.__esModule = true;
var mysql_1 = require("mysql");
var bluebird_1 = require("bluebird");
var database_json_1 = require("./../../database.json");
var config_1 = require("../../config/config");
/**
 * Creates a database connection
 *
 * @param {string} [preset=config.db] The database identifier from database configuration
 * @return {mysql.Connection} A database connection object
 */
function createConnection(preset) {
    if (preset === void 0) { preset = config_1.config.db; }
    var settings = database_json_1["default"][preset];
    delete settings['driver'];
    return mysql_1["default"].createConnection(settings);
}
exports.createConnection = createConnection;
/**
 * Query the database
 *
 * @param {mysql.Connection} connection The database connection
 * @param {string} query Database query, must be escaped
 * @param {string[]} params Query parameters
 * @return {Promise<object[]>} Row packets if promise is fulfilled
 */
function queryDB(connection, query, params) {
    return new bluebird_1.Promise(function (resolve, reject) {
        connection.query(query, params, function (err, res) {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}
exports.queryDB = queryDB;
