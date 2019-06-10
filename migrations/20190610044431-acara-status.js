'use strict';

var dbm;
var type;
var seed;

function addStatusColumn(db) {
  return db.addColumn('acara', 'status', {
    type: 'int',
    unsigned: true,
    notNull: true,
  });
}

function removeStatusColumn(db) {
  return db.removeColumn('acara', 'status');
}

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, cb) {
  return addStatusColumn(db)
    .then(() => cb())
    .catch(err => cb(err));
};

exports.down = function (db, cb) {
  return removeStatusColumn(db)
    .then(cb => cb())
    .catch(err => cb(err));
};

exports._meta = {
  "version": 1
};
