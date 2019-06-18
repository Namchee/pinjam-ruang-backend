import { AcaraRepository } from './../repository/acara';
import Acara from './../model/acara';

export const AcaraService = (function() {
  let repository = undefined;

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

  return {
    inject: function(conn) {
      repository = AcaraRepository.inject(conn);
      return this;
    },

    find: function(params) {
      if (params && Object.keys(params).length !== 0) {
        if (params.name) {
          return repository.findAcaraByName(params.id) 
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else if (params.userId) {
          return repository.findUserAcara(params.userId)
            .then(res => toDataArray(res))
            .catch(err => {
              throw err;
            });
        } else {
          throw new Error('Invalid parameters');
        }
      } else {
        return repository.findAllAcara()
          .then(res => toDataArray(res))
          .catch(err => {
            throw err;
          });
      }
    },

    get: function(id) {
      return repository.getAcara(id)
        .then(res => toDataArray(res))
        .catch(err => {
          throw err;
        });
    },

    create: function(params) {
      return repository.create(params)
        .then()
        .catch();
    }
  };
})();