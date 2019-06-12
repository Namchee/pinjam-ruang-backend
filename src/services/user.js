import { UserRepository } from './../repository/user';
import User from './../model/user';

export const UserService = (function() {
  let repository = undefined;

  return {
    create: function(conn) {
      repository = UserRepository.create(conn);
      return this;
    },

    findAllUsers: function() {
      return repository.findAll()
        .then(res => {
          const users = [];

          for (let i = 0; i < res.length; i++) {
            const user = res[i];

            users.push(new User(user.id, user.username, user.name, user.email, 'aaa', user.isAdmin));
          }

          return users;
        })
        .catch(err => {
          throw err;
        });
    }
  };
})();
