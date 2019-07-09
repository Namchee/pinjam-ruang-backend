import { createConnection, queryDB } from './../../../src/helpers/database';

const connection = createConnection('dev');

export function truncate() {
  const query = `
    SET FOREIGN_KEY_CHECKS = 0; 

    TRUNCATE TABLE user;

    SET FOREIGN_KEY_CHECKS = 1;
  `;

  return queryDB(connection, query);
}

export function seed() {
  const query = `
    INSERT INTO
      user
      (??, ??, ??)
    VALUES
      (?, ?, ?)
  `;

  const params1 = [
    'email', 'name', 'is_admin',
    'haha@gmail.com', 'Cristopher Namchee', false,
  ];
  const params2 = [
    'email', 'name', 'is_admin',
    'testmail@gmail.com', 'Gunawan Christanto', true,
  ];

  return Promise.all([
    queryDB(connection, query, params1),
    queryDB(connection, query, params2),
  ]);
}