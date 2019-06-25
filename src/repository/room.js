export const RoomRepository = (function() {
  let connection = undefined;

  const queryDB = function(query, params) {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, res) => {
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

    findAll: function() {
      const query = `
        SELECT
          ??
        FROM
          room
      `;

      const params = ['name',];

      return queryDB(query, params);
    },

    findByName: function({ name }) {
      const query = `
        SELECT
          ??
        FROM
          room
        WHERE
          ?? = ?
      `;

      const params = ['name', 'name', `%${name}%`,];

      return queryDB(query, params);
    },

    findById: function({ id }) {
      const query = `
        SELECT
          ??
        FROM
          room
        WHERE
          ?? = ?
      `;

      const params = ['name', 'id', id,];

      return queryDB(query, params);
    },

    createRoom: function({ name }) {
      const query = `
        INSERT INTO 
          room
        (??)
        VALUES (
          ?
        )`;

      const params = ['name', name,];

      return queryDB(query, params);
    },

    updateRoom: function({ id, name }) {
      const query = `
        UPDATE 
          room
        SET
          ?? = ?
        WHERE
          ?? = ?
      `;

      const params = ['name', name, 'id', id,];

      return queryDB(params, query);
    },

    deleteRoom: function({ id }) {
      const query = `
        DELETE FROM 
          room
        WHERE
          ?? = ?
      `;

      const params = ['id', id,];

      return queryDB(params, query);
    },

    exist: function({ id }) {
      const query = `
        SELECT
          COUNT(??) as jml
        FROM
          room
        WHERE
          ?? = ?`;

      const params = ['id', 'id', id,];

      return queryDB(query, params);
    }
  };
})();