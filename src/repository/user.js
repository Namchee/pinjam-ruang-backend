import { BaseRepository } from './base';

export class UserRepository extends BaseRepository {
  constructor(conn) {
    super(conn);
  }

  findAll() {
    const query = "SELECT id, username, name, email, isAdmin FROM user";

    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, res, fields) => {
        if (err) {
          reject(err);
        }

        resolve(res, fields);
      });
    });
  }
}