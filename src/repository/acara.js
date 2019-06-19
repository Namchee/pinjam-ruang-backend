export const AcaraRepository = (function () {
  let connection = undefined;

  const queryDB = function (query, params) {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res);
      });
    });
  };

  const findID = [
    'id',
    'name',
    'start_time',
    'end_time',
    'status',
    'desc',
    'user_name',
    'room_name',
  ];

  return {
    inject: function (conn) {
      connection = conn;
      return this;
    },

    findAllAcara: function () {
      const query = `SELECT 
        ??, ??, ??, ??, ??, ??, ??, ??
        FROM acara_detail
        WHERE ?? = ?`;

      const params = [
        ...findID, 
        'status', 1,
      ];

      return queryDB(query, params);
    },

    findAcaraByName: function (name) {
      const query = `SELECT 
        ??, ??, ??, ??, ??, ??, ??, ??
        FROM acara_detail
        WHERE ?? LIKE ?
        AND ?? = ?`;

      const params = [
        ...findID, 
        'name', ('%' + name + '%'), 
        'status', 1,
      ];

      return queryDB(query, params);
    },

    findConflictingAcara: function (startTime, endTime, roomId) {
      const query = `SELECT
        COUNT(??)
        FROM acara_detail
        WHERE (?? < ? OR ?? > ?)
        AND ?? = ? AND ?? = ?
        GROUP BY ?`;

      const params = [
        'id',
        'start_time', endTime,
        'end_time', startTime,
        'room_id', roomId,
        'status', 1,
        'id',
      ];

      return queryDB(query, params);
    },

    findUserAcara: function (userId) {
      const query = `SELECT
        ??, ??, ??, ??, ??, ??, ??
        FROM acara_detail
        WHERE ?? = ?`;

      const params = [
        ...findID, 
        'user_id', userId
      ];

      return queryDB(query, params);
    },

    getAcara: function(id, status = undefined) {
      let query = `SELECT
        ??, ??, ??, ??, ??, ??, ??, ??
        FROM acara_detail
        WHERE id = ${id}`;

      const params = [
        'id',
        'name',
        'start_time',
        'end_time',
        'desc',
        'user_id',
        'user_name',
        'room_id',
        'id', id,
      ];

      if (status) {
        query += ' AND ?? = ?';
        params.push('status', status);
      }

      return queryDB(query, params);
    },

    createAcara: function(acaraInfo) {
      const query = `INSERT INTO acara
        (??, ??, ??, ??, ??, ??, ??)
        VALUES (
          STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'),
          STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'),
          ?,
          ?,
          ?,
          ?,
          ?
        )`;

      const params = [
        'start_time',
        'end_time',
        'name',
        'status',
        'desc',
        'user_id',
        'room_id',
        acaraInfo.startTime,
        acaraInfo.endTime,
        acaraInfo.name,
        acaraInfo.status,
        acaraInfo.desc,
        acaraInfo.userId,
        acaraInfo.roomId,
      ];

      return queryDB(query, params);
    },

    deleteAcara: function(id) {
      const query = `DELETE FROM acara
        WHERE ?? = ?`;

      const params = [
        'id', id,
      ];

      return queryDB(query, params);
    },

    updateAcara: function(acaraInfo) {
      const query = `UPDATE acara
        SET
          ?? = ?,
          ?? = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'),
          ?? = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'),
          ?? = ?,
          ?? = ?,
          ?? = ?,
          ?? = ?
        WHERE ?? = ?`;

      const params = [
        'name', acaraInfo.name,
        'start_time', acaraInfo.startTime,
        'end_time', acaraInfo.endTime,
        'status', acaraInfo.status,
        'desc', acaraInfo.desc,
        'user_id', acaraInfo.userId,
        'room_id', acaraInfo.roomId,
        'id', acaraInfo.id,
      ];

      return queryDB(query, params);
    },

    changeAcaraStatus: function (id, status) {
      const query = `UPDATE acara
        SET
          ?? = ?
        WHERE
          ?? = ?`;

      const params = [
        'status', status,
        'id', id,
      ];

      return queryDB(query, params);
    },
  };
})();
