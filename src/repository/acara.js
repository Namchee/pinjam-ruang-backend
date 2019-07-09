import { queryDB as queryWrapper } from './../helpers/database';

export const AcaraRepository = function(connection) {
  const queryDB = (query, params) => {
    return queryWrapper(connection, query, params);
  };

  const findParams = [
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
    findAll: function() {
      const query = `
        SELECT 
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        ORDER BY
          ??`;

      const params = [...findParams, 'id',];

      return queryDB(query, params);
    },

    findByStatus: function({ status }) {
      const query = `
        SELECT 
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE
          ?? = ?
        ORDER BY
          ??`;

      const params = [
        ...findParams, 
        'status', 
        status, 
        'id',
      ];

      return queryDB(query, params);
    },

    findByName: function({ name, status }) {
      let query = `
        SELECT 
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE 
          ?? LIKE ?`;

      const params = [
        ...findParams, 
        'name', `%${name}%`, 
      ];

      if (status) {
        query += ' AND ?? = ?';
        params.push('status', status);
      }

      query += ' ORDER BY ??';

      params.push('id');

      return queryDB(query, params);
    },

    findConflicts: function({ startTime, endTime, roomId }) {
      const query = `
        SELECT
          ??
        FROM 
          acara_detail
        WHERE
          (?? < ? OR ?? > ?)
          AND ?? = ? 
          AND ?? = ?
        GROUP BY 
          ?`;

      const params = [
        'name',
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
          ??, ??, ??, ??, ??, ??, ??, ??
        FROM 
          acara_detail
        WHERE 
          ?? = ?`;

      const params = [
        ...findParams,
        'user_id', id,
      ];

      if (status) {
        query += ' AND ?? =  ?';
        params.push('status', status);
      }

      return queryDB(query, params);
    },

    get: function({ id }) {
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

    create: function(acaraInfo) {
      const query = `
        INSERT INTO 
          acara
          (??, ??, ??, ??, ??, ??, ??)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?)`;

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

    delete: function({ id }) {
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

    update: function(acaraInfo) {
      const query = `
        UPDATE
          acara
        SET
          ?? = ?,
          ?? = ?,
          ?? = ?,
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

    changeStatus: function({ id, status }) {
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
};
