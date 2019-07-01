import dbConf from './../../database.json';
import mysql from 'mysql';

export function createConnection(preset = process.env.DB) {
  const settings = dbConf[preset];
  delete settings['driver'];

  return mysql.createConnection(settings);
}
