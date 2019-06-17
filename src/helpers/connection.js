import dbConf from './../../database.json';
import mysql from 'mysql';

export function createConnection() {
  const settings = dbConf[process.env.DB];
  delete settings['driver'];

  return mysql.createConnection(settings);
}
