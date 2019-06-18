export const AcaraRepository = (function() {
  let connection = undefined;

  const queryDB = function(query) {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res);
      });
    });
  };

  return {
    inject: function(conn) {
      connection = conn;
      return this;
    },

    findAllAcara: function() {
      const query = `SELECT 
        id,
        name,
        start_time,
        end_time,
        status,
        acara_detail.desc,
        user_name,
        room_name
        FROM acara_detail
        WHERE status = 1`;

      return queryDB(query);
    },

    findAcaraByName: function(name) {
      const query = `SELECT 
        id,
        name,
        start_time,
        end_time,
        status,
        acara_detail.desc,
        user_name,
        room_name
        FROM acara_detail
        WHERE acara_name LIKE %${name}%
        AND status = 1`;

      return queryDB(query);
    },

    findConflictingAcara: function(startTime, endTime, roomId) {
      const query = `SELECT
        COUNT(id)
        FROM acara_detail
        WHERE (start_time < ${endTime} OR end_time > ${startTime})
        AND room_id = ${roomId} AND status = 1
        GROUP BY id`;

      return queryDB(query);
    },

    findUserAcara: function(userId) {
      const query = `SELECT
        id,
        name,
        start_time,
        end_time,
        status,
        acara_detail.desc,
        room_name,
        FROM acara_detail
        WHERE user_id = ${userId}`;

      return queryDB(query);
    },

    getAcara: function(id, status = undefined) {
      let query = `SELECT
        id,
        name,
        start_time,
        end_time,
        acara_detail.desc,
        user_id,
        user_name,
        room_id
        FROM acara_detail
        WHERE id = ${id}`;
      
      if (status) {
        query += ` AND status = ${status}`;
      }

      return queryDB(query);
    },

    createAcara: function(acaraInfo) {
      const query = `INSERT INTO acara
        (
          start_time,
          end_time,
          name,
          status,
          desc,
          user_id,
          room_id
        )
        VALUES (
          ${acaraInfo.startTime},
          ${acaraInfo.endTime},
          ${acaraInfo.name},
          ${acaraInfo.status},
          ${acaraInfo.desc},
          ${acaraInfo.userId},
          ${acaraInfo.roomId}
        )`;

      return queryDB(query);
    },

    deleteAcara: function(id) {
      const query = `DELETE FROM acara
        WHERE id = ${id}`;

      return queryDB(query);
    },

    updateAcara: function(id, acaraInfo) {
      const query = `UPDATE acara
        SET
          name = ${acaraInfo.name}
          start_time = ${acaraInfo.start_time}
          end_time = ${acaraInfo.end_time}
          status = 0
          desc = ${acaraInfo.desc}
          user_id = ${acaraInfo.user_id}
          room_id = ${acaraInfo.room_id}
        WHERE id = ${id}`;

      return queryDB(query);
    },

    changeAcaraStatus: function(id, status) {
      const query = `UPDATE acara
        SET
          status = ${status}
        WHERE
          id = ${id}`;

      return queryDB(query);
    },
  };
})();
