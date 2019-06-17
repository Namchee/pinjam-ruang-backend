export const AcaraRepository = (function() {
  let connection = undefined;

  return {
    inject: function(conn) {
      connection = conn;
      return this;
    }

    findAll: function() {
      const query = 'SELECT '
    }
  }
})();