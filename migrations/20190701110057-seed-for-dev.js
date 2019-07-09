'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */

function insertDummyUser(db) {
  return db.insert('user', [
    'name',
    'email',
    'is_admin',
  ], [
    'Cristopher Namchee',
    'cristophernamchee12@gmail.com',
    false])
    .then(() => {
      db.insert('user', [
        'name',
        'email',
        'is_admin'
      ], [
        'Gunawan Christanto',
        'master@gmail.com',
        true
      ]);
    });
}


function insertDummyRoom(db) {
  return db.insert('room', [
    'name'
  ], [
    '9121'
  ])
    .then(() => {
      db.insert('room', [
        'name'
      ], [
        '10316'
      ]);
    });
}

function insertDummyAcara(db) {
  return db.insert('acara', [
    'start_time',
    'end_time',
    'name',
    'status',
    'desc',
    'user_id',
    'room_id'
  ], [
    '2019-06-10 10:00:00',
    '2019-06-10 12:00:00',
    'Test acara',
    1,
    'Test description',
    2,
    1
  ]);
}

function truncateAcaraTable(db) {
  return db.runSql(`
    SET FOREIGN_KEY_CHECKS = 0; 

    TRUNCATE TABLE acara;
  
    SET FOREIGN_KEY_CHECKS = 1`
  );
}

function truncateRoomTable(db) {
  return db.runSql(`
    SET FOREIGN_KEY_CHECKS = 0; 

    TRUNCATE TABLE room;
  
    SET FOREIGN_KEY_CHECKS = 1;`
  );
}

function truncateUserTable(db) {
  return db.runSql(`
    SET FOREIGN_KEY_CHECKS = 0; 

    TRUNCATE TABLE user;
  
    SET FOREIGN_KEY_CHECKS = 1;`
  );
}

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, cb) {
  return insertDummyRoom(db)
    .then(() => insertDummyUser(db))
    .then(() => insertDummyAcara(db))
    .then(() => cb())
    .catch(err => cb(err));
};

exports.down = function(db, cb) {
  return truncateAcaraTable(db)
    .then(() => Promise.all([
      truncateRoomTable(db),
      truncateUserTable(db),
    ]))
    .then(() => cb())
    .catch(err => cb(err));
};

exports._meta = {
  "version": 1
};
