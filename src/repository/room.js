import { queryDB as queryWrapper } from './../helpers/database';

export const RoomRepository = function(connection) {
  const queryDB = (query, params) => {
    return queryWrapper(connection, query, params);
  };

  return {
    findAll: function() {
      const query = `
        SELECT
          ??, ??
        FROM
          room
        ORDER BY
          ??
      `;

      const params = ['id', 'name', 'id',];

      return queryDB(query, params);
    },

    findByName: function({ name }) {
      const query = `
        SELECT
          ??, ??
        FROM
          room
        WHERE
          ?? LIKE ?
        ORDER BY
          ??
      `;

      const params = ['id', 'name', 'name', `%${name}%`, 'id',];

      return queryDB(query, params);
    },

    findById: function({ id }) {
      const query = `
        SELECT
          ??, ??
        FROM
          room
        WHERE
          ?? = ?
      `;

      const params = ['id', 'name', 'id', id,];

      return queryDB(query, params);
    },

    create: function({ name }) {
      const query = `
        INSERT INTO 
          room
          (??)
        VALUES (
          ?
        );`;

      const params = ['name', name,];

      return queryDB(query, params);
    },

    update: function({ id, name }) {
      const query = `
        UPDATE 
          room
        SET
          ?? = ?
        WHERE
          ?? = ?
      `;

      const params = ['name', name, 'id', id,];

      return queryDB(query, params);
    },

    delete: function({ id }) {
      const query = `
        
        DELETE FROM 
          room
        WHERE
          ?? = ?
      `;

      const params = ['id', id,];

      return queryDB(query, params);
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
};
