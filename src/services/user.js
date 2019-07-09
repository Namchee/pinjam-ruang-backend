import { authenticationSchema, createUserSchema, updateInfoSchema, adminCredentials, updatePasswordSchema, powerUpdateSchema, deleteUserSchema } from './../schemas/user';
import User from './../model/user';
import OAuthClient from 'google-auth-library';

function toDTO(data) {
  return new User(data);
}

function toDataArray(data) {
  const arr = [];

  for (const user of data) {
    arr.push(toDTO(user));
  }

  return arr;
}

export function authenticate(userRepository) {
  const client = new OAuthClient(process.env.CLIENT_ID);

  return function(params) {
    
  };
}

export const UserService = (function() {
  let repository = undefined;

  const toDTO = function(data) {
    return new User(data);
  };

  const toDataArray = function(data) {
    const arr = [];
    
    for (const user of data) {
      arr.push(toDTO(user));
    }

    return arr;
  };

  const hashPassword = function(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res);
      });
    });
  };

  const comparePassword = function(password, hashed) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashed, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res);
      });
    });
  };

  const validate = function(data, schema) {
    return new Promise((resolve, reject) => {
      Joi.validate(data, schema, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res);
      });
    });
  };

  return {
    inject: function(conn) {
      repository = UserRepository.inject(conn);
      return this;
    },

    login: function(params) {
      return validate(params, authenticationSchema)
        .then(() => repository.findByUsername(params.username))
        .then(res => {
          if (comparePassword(params.password, res.password)) {
            return toDTO(res);
          } else {
            const err = new Error('Password mismtach');
            err.statusCode = 401;

            throw err;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    find: function(params) {
      if (params && Object.keys(params).length !== 0) {
        if (Object.keys(params).length === 1) {
          if (params.id) {
            return repository.findById(params)
              .then(res => toDTO(res))
              .catch(err => {
                throw err;
              });
          } else if (params.name) {
            return repository.findByName(params)
              .then(res => toDataArray(res))
              .catch(err => {
                throw err;
              }) ;
          } else if (params.username) {
            return repository.findByUsername(params)
              .then(res => toDTO(res))
              .catch(err => {
                throw err;
              });
          } else {
            const err = new Error('Invalid parameters');
            err.statusCode = 422;

            throw err;
          }
        } else {
          const err = new Error('Invalid parameters');
          err.statusCode = 422;

          throw err;
        }
      } else {
        return repository.findAll()
          .then(res => toDataArray(res))
          .catch(err => {
            throw err;
          });
      }
    },

    create: function(params) {
      return validate(params, createUserSchema)
        .then(() => hashPassword(params.password))
        .then(res => {
          params.password = res;

          return repository.create(params);
        })
        .catch(err => {
          throw err;
        });
    },

    updateInfo: function(params, auth) {
      return validate(params, updateInfoSchema)
        .then(() => repository.findById(params.id))
        .then(res => {
          if (res.id !== auth.id) {
            const err = new Error('Access denied');
            err.statusCode = 403;

            throw err;
          }

          return repository.updateInsensitive(params);
        })
        .catch(err => {
          throw err;
        });
    },

    updatePassword: function(params, auth) {
      return validate(params, updatePasswordSchema)
        .then(() => {
          if (params.newPassword !== params.confirmPassword) {
            const err = new Error('Wrong confirmation');
            err.statusCode = 422;

            throw err;
          }
        })
        .then(() => repository.findById(auth.id))
        .then(res => {
          if (res.id !== auth.id || 
            !comparePassword(params.oldPassword, res.password)) {
            const err = new Error('Access denied');
            err.statusCode = 403;

            throw err;
          }
        })
        .then(() => hashPassword(params.newPassword))
        .then(res => {
          params.newPassword = res;

          return repository.updatePassword(params);
        })
        .catch(err => {
          throw err;
        });
    },

    powerUpdate: function(params) {
      return validate(params, powerUpdateSchema)
        .then(() => repository.powerUpdate(params))
        .catch(err => {
          throw err;
        });
    },

    // for admin rights ONLY
    checkCredentials: function(params, auth) {
      return validate(params, adminCredentials)
        .then(() => repository.findById(auth.id))
        .then(res => comparePassword(params.password, res.password))
        .catch(err => {
          throw err;
        });
    },

    delete: function(params) {
      return validate(params, deleteUserSchema)
        .then(() => repository.delete(params.id))
        .catch(err => {
          throw err;
        });
    }
  };
})();
