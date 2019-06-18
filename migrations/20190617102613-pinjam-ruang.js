'use strict';

var dbm;
var type;
var seed;

function createRoomTable(db) {
  return db.createTable('room', {
    columns: {
      id: {
        type: 'int',
        primaryKey: true,
        unsigned: true,
        notNull: true,
        autoIncrement: true
      },

      name: {
        type: 'string',
        notNull: true,
        length: 10
      }
    },

    ifNotExists: true
  });
}

function createUserTable(db) {
  return db.createTable('user', {
    columns: {
      id: {
        type: 'int',
        primaryKey: true,
        notNull: true,
        unsigned: true,
        autoIncrement: true
      },

      username: {
        type: 'string',
        notNull: true,
        unique: true,
        length: 20
      },

      name: {
        type: 'string',
        notNull: true,
        length: 50
      },

      email: {
        type: 'string',
        notNull: true,
        length: 50
      },

      password: {
        type: 'string',
        notNull: true,
        length: 56
      },

      isAdmin: {
        type: 'boolean',
        notNull: true
      }
    },

    ifNotExists: true
  });
}

function createAcaraTable(db) {
  return db.createTable('acara', {
    columns: {
      id: {
        type: 'int',
        primaryKey: true,
        unsigned: true,
        notNull: true,
        autoIncrement: true
      },

      start_time: {
        type: 'datetime',
        notNull: true
      },

      end_time: {
        type: 'datetime',
        notNull: true
      },

      name: {
        type: 'string',
        notNull: true,
        length: 50
      },

      status: {
        type: 'int',
        notNull: true,
        unsigned: true
      },

      desc: {
        type: 'string',
        notNull: true,
        length: 100
      },

      user_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: 'fk_acara_user_id',
          table: 'user',
          rules: {
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
          },
          mapping: 'id'
        }
      },

      room_id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        foreignKey: {
          name: 'fk_acara_room_id',
          table: 'room',
          rules: {
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
          },
          mapping: 'id'
        }
      }
    },

    ifNotExists: true
  });
}

function insertDummyUser(db) {
  return db.insert('user', [
    'username',
    'name',
    'email',
    'password',
    'isAdmin'
  ], [
    'namchee', 
    'Cristopher Namchee', 
    'cristophernamchee12@gmail.com', 
    'test', 
    false])
    .then(() => {
      db.insert('user', [
        'username',
        'name',
        'email',
        'password',
        'isAdmin'
      ], [
        'chez14',
        'Gunawan Christanto',
        'master@gmail.com',
        'inijugatest',
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

function createAcaraDetailView(db) {
  return db.runSql(`CREATE VIEW acara_detail AS 
    SELECT 
      acara.id,
      acara.name,
      acara.start_time,
      acara.end_time,
      acara.status,
      acara.desc,
      user.id as user_id,
      room.id as room_id,
      user.name as user_name,
      room.name as room_name
    FROM
      acara INNER JOIN user
        ON acara.user_id = user.id
      INNER JOIN room
        ON acara.room_id = room.id
  `);
}

function dropAcaraDetailView(db) {
  return db.runSql('DROP VIEW acara_detail');
}

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, cb) {
  return createRoomTable(db)
    .then(() => createUserTable(db))
    .then(() => createAcaraTable(db))
    .then(() => createAcaraDetailView(db))
    .then(() => insertDummyRoom(db))
    .then(() => insertDummyUser(db))
    .then(() => insertDummyAcara(db))
    .then(() => cb())
    .catch(err => cb(err));
};

exports.down = function (db, cb) {
  return db.dropTable('acara')
    .then(() => dropAcaraDetailView(db))
    .then(() => db.dropTable('room'))
    .then(() => db.dropTable('user'))
    .then(() => cb())
    .catch(err => cb(err));
};

exports._meta = {
  'version': 1
};
