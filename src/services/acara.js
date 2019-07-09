import { Promise } from 'bluebird';

import { validateData } from './../helpers/misc';
import { checkRoomExistence } from './room';
import { createAcaraSchema, deleteAcaraSchema, updateAcaraSchema, changeAcaraStatusSchema, findConflictSchema } from './../schemas/acara';
import { Acara } from './../model/acara';

function hasRights(acara, auth) {
  if (!auth.isAdmin && acara.user_id !== auth.id) {
    const err = new Error('Access Denied');
    err.statusCode = 403;

    throw err;
  }
}

function toDTO(data) {
  return new Acara(data);
}

function toDataArray(dataArray) {
  const array = [];

  for (const acara of dataArray) {
    array.push(toDTO(acara));
  }

  return array;
}

function checkAcaraExistence(acaraRepository) {
  return function(params) {
    if (params && 
      Object.keys(params).length === 1 && 
      params.id) {
      
      return acaraRepository.exist(params)
        .then(res => res[0].jml > 0)
        .catch(err => {
          throw err;
        });
    } else {
      const err = new Error('Invalid parameters');
      err.statusCode = 422;

      throw err;
    }
  };
}

export function findAcara(acaraRepository) {
  return function(params) {
    if (params && Object.keys(params).length === 1) {
      if (params.name) {
        return acaraRepository.findByName(params)
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
    } else if (params
      && Object.keys(params).length === 0) {
      return acaraRepository.findAll()
        .then(res => toDataArray(res))
        .catch(err => {
          throw err;
        });
    } else {
      const err = new Error('Invalid parameters');
      err.statusCode = 422;

      throw err;
    }
  };
}

export function findConflicts(acaraRepository, roomRepository) {
  return function(params) {
    return validateData(params, findConflictSchema)
      .then(() => checkRoomExistence(roomRepository)({ id: params.id }))
      .then(res => {
        if (!res) {
          const err = new Error('Room doesn\'t exist');
          err.statusCode = 404;

          throw err;
        }

        return acaraRepository.findConflicts(params);
      })
      .then(res => toDataArray(res))
      .catch(err => {
        throw err;
      });
  };
}

export function getAcara(acaraRepository) {
  return function (params, auth) {
    return acaraRepository.getAcara(params)
      .then(res => {
        const acara = res[0];

        hasRights(acara, auth);

        return toDTO(acara);
      })
      .catch(err => {
        throw err;
      });
  };
}

export function createAcara(acaraRepository, roomRepository) {
  return function(params) {
    return validateData(params, createAcaraSchema)
      .then(() => Promise.all([
        checkRoomExistence(roomRepository)({ id: params.roomId }),
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

        return acaraRepository.create(params);
      })
      .catch(err => {
        throw err;
      });
  };
}

export function deleteAcara(acaraRepository) {
  return function(params, auth) {
    return validateData(params, deleteAcaraSchema)
      .then(() => Promise.all[
        checkAcaraExistence(acaraRepository)({ id: params.id }),
        acaraRepository.getAcara({ id: params.id })
      ])
      .then(([exist, acara,]) => {
        if (!exist) {
          const err = new Error('Acara doesn\'t exist');
          err.statusCode = 404;

          throw err;
        }

        hasRights(acara[0], auth);

        return acaraRepository.deleteAcara(params);
      })
      .catch(err => {
        throw err;
      });
  };
}

export function updateAcara(acaraRepository, roomRepository) {
  return function(params, auth) {
    return validateData(params, updateAcaraSchema)
      .then(() => Promise.all([
        roomExist(roomRepository)({ id: params.roomId }),
        userExist({ id: params.userId }),
        acaraRepository.getAcara({ id: params.id })
      ]))
      .then(([room, user, acara,]) => {
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

        hasRights(acara[0], auth);
        
        return acaraRepository.updateAcara(params);
      })
      .catch(err => {
        throw err;
      });
  };
}

export function changeAcaraStatus(acaraRepository) {
  return function(params) {
    return validateData(params, changeAcaraStatusSchema)
      .then(() => checkAcaraExistence(acaraRepository)({ id: params.id }))
      .then(res => {
        if (!res) {
          const err = new Error('Acara doesn\'t exist');
          err.statusCode = 404;

          throw err;
        }
      })
      .then(() => acaraRepository.changeAcaraStatus(params))
      .catch(err => {
        throw err;
      });
  };
}
