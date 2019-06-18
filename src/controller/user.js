/**
 * user.js
 * Contains anything related to user-targeting operation
 * Author: Namchee
 */

import { UserService } from './../services/user';

export const UserController = (function() {
  let service = undefined;
  
  return {
    inject: function(conn) {
      service = UserService.inject(conn);
      return this;
    },

    findAllUsers: (req, res, next) => {
      
    }
  };
})();
