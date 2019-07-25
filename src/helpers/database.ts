import mysql, { ConnectionConfig } from 'mysql';
import { Promise } from 'bluebird';

import dbConf from './../../database.json';
import { config } from '../../config/config';

/**
 * Creates a database connection
 * 
 * @param {string} [preset=config.db] The database identifier from database configuration
 * @return {mysql.Connection} A database connection object
 */
export function createConnection(preset: string = config.db): mysql.Connection {
  const settings: ConnectionConfig = dbConf[preset];
  delete settings['driver'];

  return mysql.createConnection(settings);
}

/**
 * Query the database
 * 
 * @param {mysql.Connection} connection The database connection
 * @param {string} query Database query, must be escaped
 * @param {string[]} params Query parameters
 * @return {Promise<object[]>} Row packets if promise is fulfilled
 */
export function queryDB(connection: mysql.Connection, query: string, params: string[]): Promise<any> {
  return new Promise((resolve, reject): void => {
    connection.query(query, params, (err, res): void => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}
