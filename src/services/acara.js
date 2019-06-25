import Joi from '@hapi/joi';

import { AcaraRepository } from './../repository/acara';
import { RoomRepository } from './../repository/room';
import { createAcaraSchema, deleteAcaraSchema, updateAcaraSchema, changeAcaraStatusSchema, findConflictSchema } from './../schemas/acara';
import { Acara } from './../model/acara';
import { UserRepository } from '../repository/user';

export const AcaraService = (function() {
  let acaraRepository = undefined;
  let roomRepository = undefined;
  let userRepository = undefined;

  const toDTO = function(data) {
    return new Acara(data);
  };

  const toDataArray = function(result) {
    const arr = [];

    for (const data of result) {
      arr.push(toDTO(data));
    }

    return arr;
  };

  const validate = function(data, schema) {
    return new Promise((resolve, reject) => {
      Joi.validate(data, schema, (err, res) => {
        if (err) {
          err.statusCode = 422;
          reject(err);
        }

        resolve(res);
      });
    });
  };

  const acaraExist = function(params) {
    return acaraRepository.exist(params)
      .then(res => res[0].jml)
      .catch(err => {
        throw err;
      });
  };

  const roomExist = function(params) {
    return roomRepository.exist(params)
      .then(res => res[0].jml)
      .catch(err => {
        throw err;
      });
  };

  const userExist = function(params) {
    return userRepository.exist(params)
      .then(res => res[0].jml)
      .catch(err => {
        throw err;
      });
  };

  return {
    inject: function(conn) {
      roomRepository = RoomRepository.inject(conn);
      userRepository = UserRepository.inject(conn);
      acaraRepository = AcaraRepository.inject(conn);

      return this;
    },

    find: function(params) {
      if (params && Object.keys(params).length === 1) {
        if (params.name) {
          return acaraRepository.findAcaraByName(params) 
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else if (params.userId) {
          return acaraRepository.findUserAcara(params)
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else {
          const error = new Error('Invalid parameters');
          error.statusCode = 422;

          throw error;
        }
      } else if (params && 
        Object.keys(params).length === 2 &&
        params.userId &&
        params.status
      ) {
        return acaraRepository.findUserAcara(params)
          .then(res => toDataArray(res))
          .catch(err => {
            throw err;
          });
      } else if (params && Object.keys(params).length === 0) {
        return acaraRepository.findAllAcara()
          .then(res => toDataArray(res))
          .catch(err => {
            throw err;
          });
      } else {
        const err = new Error('Invalid parameters');
        err.statusCode = 422;

        throw err;
      }
    },

    findConflicting: function(params) {
      return validate(params, findConflictSchema)
        .then(() => roomExist({ id: params.roomId }))
        .then(res => {
          if (!res) {
            const err = new Error('Room doesn\'t exist');
            err.statusCode = 404;

            throw err;
          }

          return acaraRepository.findConflictingAcara(params);
        })
        .then(res => res[0].conflicts)
        .catch(err => {
          throw err;
        });
    },

    get: function(params) {
      return acaraRepository.getAcara(params)
        .then(res => toDTO(res))
        .catch(err => {
          throw err;
        });
    },

    create: function(params) {
      return validate(params, createAcaraSchema)
        .then(() => Promise.all([
          roomExist({ id: params.roomId }),
          userExist({ id: params.userId }),
        ]))
        .then(([room, user,]) => {
          if (!room) {
            const err = new Error('Room doesn\'t exist');
            err.statusCode = 404;

            throw err;
          }

          if (!user) {
            const err = new Error('User doesn\'t exist');
            err.statusCode = 404;

            throw err;
          }

          return acaraRepository.createAcara(params);
        })
        .catch(err => {
          throw err;
        });
    },

    delete: function(params, auth) {
      return validate(params, deleteAcaraSchema)
        .then(() => Promise.all[
          acaraExist({ id: params.id }),
          acaraRepository.getAcara({ id: params.id })
        ])
        .then(([exist, owner,]) => {
          if (!exist) {
            const err = new Error('Acara doesn\'t exist');
            err.statusCode = 422;

            throw err;
          }

          if (!auth.isAdmin && owner.user_id !== auth.id) {
            const err = new Error('Access denied');
            err.statusCode = 403;

            throw err;
          }

          return acaraRepository.deleteAcara(params);
        })
        .catch(err => {
          throw err;
        });
    },

    update: function(params, auth) {
      return validate(params, updateAcaraSchema)
        .then(() => Promise.all([
          roomExist({ id: params.roomId }),
          userExist({ id: params.userId }),
          acaraRepository.getAcara({ id: params.id })
        ]))
        .then(([room, user, owner,]) => {
          if (!room) {
            const err = new Error('Room doesn\'t exist');
            err.statusCode = 404;

            throw err;
          }

          if (!user) {
            const err = new Error('User doesn\'t exist');
            err.statusCode = 404;

            throw err;
          }

          if (!owner.isAdmin && owner.user_id !== auth.id) {
            const err = new Error('Access denied');
            err.statusCode = 403;

            throw err;
          }

          return acaraRepository.updateAcara(params);
        })
        .catch(err => {
          throw err;
        });
    },

    changeStatus: function(params) {
      return validate(params, changeAcaraStatusSchema)
        .then(() => acaraExist({ id: params.id }))
        .then(res => {
          if (!res) {
            const err = new Error('Invalid parameters');
            err.statusCode = 422;

            throw err;
          }
        })
        .then(() => acaraRepository.changeAcaraStatus(params))
        .catch(err => {
          throw err;
        });
    },
  };
})();
