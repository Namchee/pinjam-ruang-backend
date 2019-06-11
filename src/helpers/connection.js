import dbConf from './../../database.json';
import mysql from 'mysql';

export function createConnection(profile = 'dev') {
  const settings = dbConf[profile];
  delete settings['driver'];

  return mysql.createConnection(settings);
}
