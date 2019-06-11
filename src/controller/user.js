/**
 * user.js
 * Contains anything related to user-targeting operation
 * Author: Namchee
 */

import { UserService } from './../services/user';

export class UserController {
  constructor(conn) {
    this.service = new UserService(conn);
  }

  getAllUsers(req, res, next) {
    this.service.findAll()
      .then((result, field) => {
        return res.status(200)
          .send({
            status: true,
            result,
            field,
            message: 'Success',
          });
      })
      .catch(err => {
        const error = {
          status: 500,
          message: err,
        };

        next(error);
      });
  }
}
