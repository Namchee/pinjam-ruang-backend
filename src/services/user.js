import { UserRepository } from './../repository/user';

export class UserService {
  constructor(conn) {
    this.repository = new UserRepository(conn);
  }

  async findAll() {
    return await this.repository.findAll();
  }
}