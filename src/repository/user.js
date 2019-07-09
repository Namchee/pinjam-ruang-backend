import { queryDB as queryWrapper } from './../helpers/misc';

export const UserRepository = function(connection) {
  const queryDB = (query, params) => {
    return queryWrapper(connection, query, params);
  };

  const findParams = [
    'id',
    'name',
    'email',
    'is_admin',
  ];

  return {
    findAll: function() {
      const query = `
        SELECT 
          ??, ??, ??, ??
        FROM 
          user
        ORDER BY
          ??`;

      const params = [...findParams, 'id',];

      return queryDB(query, params);
    },

    findByEmail: function({ email }) {
      const query = `
        SELECT  
          ??, ??, ??, ??
        FROM
          user
        WHERE
          ?? LIKE ?
        ORDER BY
          ??`;

      const params = [...findParams, 'email', `%${email}%`, 'id'];

      return queryDB(query, params);
    },

    findByName: function({ name }) {
      const query = `
        SELECT  
          ??, ??, ??, ??
        FROM
          user
        WHERE
          ?? LIKE ?
        ORDER BY
          ??`;

      const params = [...findParams, 'name', `%${name}%`, 'id',];

      return queryDB(query, params);
    },

    findById: function({ id }) {
      const query = `
        SELECT
          ??, ??, ??, ??
        FROM
          user
        WHERE
          ?? = ?`;
        
      const params = [...findParams, 'id', id,];

      return queryDB(query, params);
    },

    create: function({ email, name, isAdmin }) {
      const query = `
        INSERT INTO user
          (??, ??, ??)
        VALUES
          (?, ?, ?)`;
      
      const params = [
        'email',
        'name',
        'is_admin',
        email,
        name,
        isAdmin,
      ];

      return queryDB(query, params);
    },

    updateRole: function({ id, isAdmin }) {
      const query = `
        UPDATE
          user
        SET
          ?? = ?
        WHERE
          ?? = ?`;

      const params = [
        'is_admin', isAdmin,
        'id', id,
      ];

      return queryDB(query, params);
    },

    delete: function({ id }) {
      const query = `
        DELETE FROM 
          user
        WHERE 
          ?? = ?`;

      const params = ['id', id,];

      return queryDB(query, params);
    },

    exist: function({ id }) {
      const query = `
        SELECT
          COUNT(??) as jml
        FROM
          user
        WHERE
          ?? = ?
      `;

      const params = ['id', 'id', id,];

      return queryDB(query, params);
    }
  };
};
