import Joi from '@hapi/joi';

import { AcaraRepository } from './../repository/acara';
import { RoomRepository } from './../repository/room';
import { createAcaraSchema, deleteAcaraSchema, updateAcaraSchema, changeAcaraStatusSchema } from './../schemas/acara';
import { Acara } from './../model/acara';

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

  return {
    inject: function(conn) {
      acaraRepository = AcaraRepository.inject(conn);
      return this;
    },

    find: function(params) {
      if (params && Object.keys(params).length !== 0) {
        if (params.name) {
          return acaraRepository.findAcaraByName(params.name) 
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else if (params.userId) {
          return acaraRepository.findUserAcara(params.userId)
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else {
          const error = new Error('Invalid parameters');
          error.statusCode = 422;

          throw error;
        }
      } else {
        return acaraRepository.findAllAcara()
          .then(res => toDataArray(res))
          .catch(err => {
            throw err;
          });
      }
    },

    get: function(id) {
      return acaraRepository.getAcara(id)
        .then(res => toDataArray(res))
        .catch(err => {
          throw err;
        });
    },

    create: function(params) {
      return validate(params, createAcaraSchema)
        .then(() => )
        .then(() => acaraRepository.createAcara(params))
        .catch(err => {
          throw err;
        });
    },

    delete: function(params) {
      return validate(params, deleteAcaraSchema)
        .then(() => acaraRepository.deleteAcara(params.id))
        .catch(err => {
          throw err;
        });
    },

    update: function(params) {
      return validate(params, updateAcaraSchema)
        .then(() => acaraRepository.updateAcara(params))
        .catch(err => {
          throw err;
        });
    },

    changeStatus: function(params) {
      return validate(params, changeAcaraStatusSchema)
        .then(() => acaraRepository.changeAcaraStatus(params.id, params.status))
        .catch(err => {
          throw err;
        });
    }
  };
})();
