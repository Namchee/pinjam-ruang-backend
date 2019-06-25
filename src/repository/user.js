export const UserRepository = (function() {
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

  const commonParams = [
    'id',
    'username',
    'name',
    'email',
    'is_admin',
  ];

  return {
    inject: function(conn) {
      connection = conn;
      return this;
    },

    findAll: function() {
      const query = `
        SELECT 
          ??, ??, ??, ??, ?? 
        FROM 
          user`;

      return queryDB(query, commonParams);
    },

    findByUsername: function({ username }) {
      const query = `
        SELECT  
          ??, ??, ??, ??, ??
        FROM
          user
        WHERE
          ?? LIKE ?`;

      const params = [...commonParams, 'username', `%${username}%`,];

      return queryDB(query, params);
    },

    findByName: function({ name }) {
      const query = `
        SELECT  
          ??, ??, ??, ??, ??
        FROM
          user
        WHERE
          ?? LIKE ?`;

      const params = [...commonParams, 'name', `%${name}%`,];

      return queryDB(query, params);
    },

    findById: function({ id }) {
      const query = `
        SELECT
          ??, ??, ??, ??, ??
        FROM
          user
        WHERE
          ?? = ?`;
        
      const params = [...commonParams, 'id', id,];

      return queryDB(query, params);
    },

    create: function(userInfo) {
      const query = `
        INSERT INTO user
          (??, ??, ??, ??, ??)
        VALUES
          (?, ?, ?, ?, ?)`;
      
      const params = [
        'username',
        'name',
        'password',
        'email',
        'is_admin',
        userInfo.username,
        userInfo.name,
        userInfo.password,
        userInfo.email,
        userInfo.isAdmin,
      ];

      return queryDB(query, params);
    },

    updateInsensitive: function(userInfo) {
      const query = `
        UPDATE
          user
        SET
          ?? = ?
          ?? = ?
          ?? = ?
        WHERE
          ?? = ?
      `;

      const params = [
        'username', userInfo.username,
        'name', userInfo.name,
        'email', userInfo.email,
        'id', userInfo.id,
      ];

      return queryDB(query, params);
    },

    updatePassword: function(userInfo) {
      const query = `
        UPDATE
          user
        SET
          ?? = ?
        WHERE
          ?? = ?`;

      const params = [
        'password', userInfo.password,
        'id', userInfo.id,
      ];

      return queryDB(query, params);
    },

    powerUpdate: function(userInfo) {
      const query = `
        UPDATE 
          user
        SET
          ?? = ?
          ?? = ?
          ?? = ?
          ?? = ?
          ?? = ?
        WHERE
          ?? = ?`;

      const params = [
        'username', userInfo.username,
        'name', userInfo.name,
        'password', userInfo.password,
        'email', userInfo.email,
        'is_admin', userInfo.isAdmin,
        'id', userInfo.id,
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
})();
