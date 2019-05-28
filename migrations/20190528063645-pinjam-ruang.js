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

      room: {
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

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, cb) {
  return createRoomTable(db)
    .then(() => createUserTable(db))
    .then(() => createAcaraTable(db))
    .then(() => cb())
    .catch(err => cb(err));
};

exports.down = function (db, cb) {
  return db.dropTable('acara')
    .then(() => db.dropTable('room'))
    .then(() => db.dropTable('user'))
    .then(() => cb())
    .catch(err => cb(err));
};

exports._meta = {
  'version': 1
};
