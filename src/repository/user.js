export const UserRepository = (function() {
  let connection = undefined;

  return {
    inject: function(conn) {
      connection = conn;
      return this;
    },

    findAll: function() {
      const query = 'SELECT id, username, name, email, isAdmin from user';

      return new Promise((resolve, reject) => {
        connection.query(query, (err, res) => {
          if (err) {
            reject(err);
          }

          resolve(res);
        });
      });
    }
  };
})();