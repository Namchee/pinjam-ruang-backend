// Why the hell does the name sounds ambiguistic?
import Joi from '@hapi/joi';

import { RoomRepository } from './../repository/room';
import { createRoomSchema, updateRoomSchema, deleteRoomSchema } from './../schemas/room';
import { Room } from '../model/room';

export const RoomService = (function() {
  let repository = undefined;

  const toDTO = function(data) {
    return new Room(data);
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

  return {
    inject: function(conn) {
      repository = RoomRepository.inject(conn);
      return this;
    },

    find: function(params) {
      if (params && Object.keys(params).length === 1) {
        if (params.name) {
          return repository.findByName(params.name)
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else {
          const err = new Error('Invalid parameters');
          err.statusCode = 422;

          throw err;
        }
      } else if (params && Object.keys(params).length === 0) {
        return repository.findAll()
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

    create: function(params) {
      return validate(params, createRoomSchema)
        .then(() => repository.createRoom(params))
        .catch(err => {
          throw err;
        });
    },

    update: function(params) {
      return validate(params, updateRoomSchema)
        .then(() => repository.updateRoom(params))
        .catch(err => {
          throw err;
        });
    },

    delete: function(params) {
      return validate(params, deleteRoomSchema)
        .then(() => repository.deleteRoom(params))
        .catch(err => {
          throw err;
        });
    },
  };
})();
