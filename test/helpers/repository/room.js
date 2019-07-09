import { createConnection, queryDB } from '../../../src/helpers/database'; 

const connection = createConnection('dev');

export function truncate() {
  const query = `
    SET FOREIGN_KEY_CHECKS = 0; 

    TRUNCATE TABLE room;

    SET FOREIGN_KEY_CHECKS = 1;`;

  return queryDB(connection, query);
}

export function seed() {
  const query = `
    INSERT INTO 
      room
      (??)
    VALUES
      (?)`;

  const params1 = ['name', '9121',];
  const params2 = ['name', '10316',];

  return Promise.all([
    queryDB(connection, query, params1),
    queryDB(connection, query, params2),
  ]);
}
