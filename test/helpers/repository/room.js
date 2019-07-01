import { createConnection } from './../../../src/helpers/connection';

const connection = createConnection('dev');

function queryDB(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}

export function truncate() {
  const query = `
    SET FOREIGN_KEY_CHECKS = 0; 

    TRUNCATE TABLE room;

    SET FOREIGN_KEY_CHECKS = 1;`;

  return queryDB(query);
}

export function seed() {
  const query = `
    INSERT INTO 
      room
      (??)
    VALUES
      (?)`;

  const params = ['name', '9121',];

  return queryDB(query, params)
    .then(() => {
      params[1] = '10316';

      return queryDB(query, params);
    });
}
