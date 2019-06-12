/**
 * user.js
 * Contains anything related to user-targeting operation
 * Author: Namchee
 */

import { UserService } from './../services/user';

export const UserController = (function() {
  let service = undefined;
  
  return {
    create: function(conn) {
      service = UserService.create(conn);
      return this;
    },

    findAllUsers: (req, res, next) => {
      return service.findAllUsers()
        .then(res => {
          console.log(res);
        });
    }
  };
})();
