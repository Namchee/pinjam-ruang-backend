export class BaseRepository {
  constructor(conn) {
    this.__connection__ = conn;

    this.connection.connect(err => {
      if (err) {
        throw err;
      }
    });
  }

  get connection() {
    return this.__connection__;
  }
}
