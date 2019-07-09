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
        unique: true,
        notNull: true,
        length: 5,
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

      name: {
        type: 'string',
        notNull: true,
        length: 50
      },

      email: {
        type: 'string',
        notNull: true,
        unique: true,
        length: 254,
      },

      is_admin: {
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
        unique: true,
        length: 50,
      },

      status: {
        type: 'int',
        notNull: true,
        unsigned: true,
      },

      desc: {
        type: 'string',
        notNull: true,
        length: 100,
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
        },
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
        },
      }
    },

    ifNotExists: true
  });
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
  return Promise.all([
    createRoomTable(db),
    createUserTable(db),
  ])
    .then(() => createAcaraTable(db))
    .then(() => createAcaraDetailView(db))
    .then(() => cb())
    .catch(err => cb(err));
};

exports.down = function (db, cb) {
  return dropAcaraDetailView(db)
    .then(() => db.dropTable('acara'))
    .then(() => 
      Promise.all([
        db.dropTable('room'),
        db.dropTable('user')
      ]))
    .then(() => cb())
    .catch(err => cb(err));
};

exports._meta = {
  'version': 1
};
