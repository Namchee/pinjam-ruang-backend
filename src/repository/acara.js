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

  const commonParams = [
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
    inject: function(conn) {
      connection = conn;
      return this;
    },

    findAll: function() {
      const query = `
        SELECT 
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE 
          ?? = ?`;

      const params = [
        ...commonParams, 
        'status', 1,
      ];

      return queryDB(query, params);
    },

    findByName: function({ name }) {
      const query = `
        SELECT 
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE 
          ?? LIKE ?
          AND ?? = ?`;

      const params = [
        ...commonParams, 
        'name', ('%' + name + '%'), 
        'status', 1,
      ];

      return queryDB(query, params);
    },

    findConflictingAcara: function({ startTime, endTime, roomId }) {
      const query = `
        SELECT
          COUNT(??) as conflicts
        FROM 
          acara_detail
        WHERE
          (?? < STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000') 
          OR ?? > STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'))
          AND ?? = ? 
          AND ?? = ?
        GROUP BY 
          ?`;

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

    findUserAcara: function({ id, status }) {
      let query = `
        SELECT
          ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE 
          ?? = ?`;

      const params = [
        ...commonParams, 
        'user_id', id
      ];

      if (status) {
        query += ' AND ?? =  ?';
        params.push('status', status);
      }

      return queryDB(query, params);
    },

    getAcara: function({ id }) {
      const query = `
        SELECT
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE 
          ?? = ?`;

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

      return queryDB(query, params);
    },

    createAcara: function(acaraInfo) {
      const query = `
        INSERT INTO 
          acara
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

    deleteAcara: function({ id }) {
      const query = `
        DELETE FROM 
          acara
        WHERE 
          ?? = ?`;

      const params = [
        'id', id,
      ];

      return queryDB(query, params);
    },

    updateAcara: function(acaraInfo) {
      const query = `
        UPDATE
          acara
        SET
          ?? = ?,
          ?? = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'),
          ?? = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s+0000'),
          ?? = ?,
          ?? = ?,
          ?? = ?,
          ?? = ?
        WHERE 
          ?? = ?`;

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

    changeAcaraStatus: function(acaraInfo) {
      const query = `UPDATE acara
        SET
          ?? = ?
        WHERE
          ?? = ?`;

      const params = [
        'status', acaraInfo.status,
        'id', acaraInfo.id,
      ];

      return queryDB(query, params);
    },

    exist: function({ id }) {
      const query = `
        SELECT
          COUNT(??) as jml
        FROM
          acara
        WHERE
          ?? = ?`;

      const params = ['id', 'id', id,];

      return queryDB(query, params);
    },
  };
})();
