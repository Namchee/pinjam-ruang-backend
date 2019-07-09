import { truncate as truncateUser, seed as seedUser } from './user';
import { truncate as truncateRoom, seed as seedRoom } from './room';

import { createConnection, queryDB } from './../../../src/helpers/database';

const connection = createConnection('dev');

export function truncate() {
  const query = `
    SET FOREIGN_KEY_CHECKS = 0;

    TRUNCATE TABLE acara;

    SET FOREIGN_KEY_CHECKS = 1;
  `;

  return queryDB(connection, query)
    .then(() => Promise.all([
      truncateRoom(),
      truncateUser(),
    ]));
}

export function seed() {
  const query = `
    INSERT INTO 
      acara
      (??, ??, ??, ??, ??, ??, ??)
    VALUES 
      (?, ?, ?, ?, ?, ?, ?)`;

  const params1 = [        
    'start_time',
    'end_time',
    'name',
    'status',
    'desc',
    'user_id',
    'room_id',
    '2019-06-10 10:00:00',
    '2019-06-10 12:00:00',
    'Test acara',
    1,
    'Test description',
    2,
    1,
  ];

  const params2 = [        
    'start_time',
    'end_time',
    'name',
    'status',
    'desc',
    'user_id',
    'room_id',
    '2019-06-12 10:00:00',
    '2019-06-12 12:00:00',
    'Test acara lagi beneran',
    1,
    'Test description lagi beneran',
    1,
    2,
  ];

  const params3 = [
    'start_time',
    'end_time',
    'name',
    'status',
    'desc',
    'user_id',
    'room_id',
    '2019-06-14 10:00:00',
    '2019-06-14 12:00:00',
    'Test acara lagi',
    2,
    'Test description lagi',
    1,
    2,
  ];

  return Promise.all([
    seedUser(),
    seedRoom(),
  ])
    .then(() => Promise.all([
      queryDB(connection, query, params1),
      queryDB(connection, query, params2),
      queryDB(connection, query, params3),
    ]));
}