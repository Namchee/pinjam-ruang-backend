import dbConf from './../../database.json';
import mysql from 'mysql';
import { Promise } from 'bluebird';

export function createConnection(preset = process.env.DB) {
  const settings = dbConf[preset];
  delete settings['driver'];

  return mysql.createConnection(settings);
}

export function queryDB(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}
