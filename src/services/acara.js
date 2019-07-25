import { Promise } from 'bluebird';

import { validateData } from './../helpers/api';
import { checkRoomExistence } from './room';
import { checkUserExistence } from './user';
import { createAcaraSchema, deleteAcaraSchema, updateAcaraSchema, findConflictSchema } from './../schemas/acara';
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
  return async function(params) {
    try {
      if (params && 
        Object.keys(params).length === 1 && 
        params.id) {
        
        const res = await acaraRepository.exist(params);
        
        return res[0].jml > 0;
      } else {
        const err = new Error('Invalid parameters');
        err.statusCode = 422;
  
        throw err;
      }
    } catch (err) {
      throw err;
    }
  };
}

export function findAcara(acaraRepository) {
  return async function(params) {
    try {
      if (params && Object.keys(params).length === 1) {
        if (params.name) {
          const res = await acaraRepository.findByName(params);
          
          return toDataArray(res);
        } else if (params.userId) {
          const res = await acaraRepository.findUserAcara(params);
          
          return toDataArray(res);
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
        const res = await acaraRepository.findUserAcara(params);

        return toDataArray(res);
      } else if (params
        && Object.keys(params).length === 0) {
        const res = await acaraRepository.findAll();
        
        return toDataArray(res);
      } else {
        const err = new Error('Invalid parameters');
        err.statusCode = 422;
  
        throw err;
      }
    } catch (err) {
      throw err;
    }
  };
}

export function findConflicts(acaraRepository, roomRepository) {
  return async function(params) {
    try {
      await validateData(params, findConflictSchema);
      
      const exist = await checkRoomExistence(roomRepository)({ id: params.id });
      
      if (!exist) {
        const err = new Error('Room doesn\'t exist');
        err.statusCode = 404;

        throw err;
      }

      const res = await acaraRepository.findConflicts(params);

      return toDataArray(res);
    } catch (err) {
      throw err;
    }
  };
}

export function getAcara(acaraRepository) {
  return async function(params, auth) {
    try {
      const res = await acaraRepository.get(params);
      const acara = res[0];

      hasRights(acara, auth);

      return toDTO(acara);
    } catch (err) {
      throw err;
    }
  };
}

export function createAcara(acaraRepository, roomRepository, userRepository) {
  return async function(params) {
    try {
      await validateData(params, createAcaraSchema);

      const [room, user, conflicts,] = await Promise.all([
        checkRoomExistence(roomRepository)({ id: params.roomId }),
        checkUserExistence(userRepository)({ id: params.userId }),
        findConflicts(acaraRepository, roomRepository)({
          startTime: params.startTime,
          endTime: params.endTime,
          room: params.roomId,
        }),
      ]);

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

      if (conflicts) {
        const err = new Error('Schedule conflicted with other acara');
        err.statusCode = 422;

        throw err;
      }

      const start = new Date(params.startTime);
      const end = new Date(params.endTime);

      if (start.getTime() > end.getTime()) {
        const err = new Error('Invalid duration');
        err.statusCode = 422;

        throw err;
      }

      return await acaraRepository.create(params);
    } catch (err) {
      throw err;
    }
  };
}

export function deleteAcara(acaraRepository) {
  return async function(params, auth) {
    try {
      await validateData(params, deleteAcaraSchema);
      
      const [exist, acara,] = await Promise.all([
        checkAcaraExistence(acaraRepository)({ id: params.id }),
        acaraRepository.getAcara({ id: params.id })
      ]);

      if (!exist) {
        const err = new Error('Acara doesn\'t exist');
        err.statusCode = 404;

        throw err;
      }

      hasRights(acara[0], auth);

      return await acaraRepository.deleteAcara(params);
    } catch (err) {
      throw err;
    }
  };
}

export function updateAcara(acaraRepository, roomRepository, userRepository) {
  return async function(params, auth) {
    try {
      await validateData(params, updateAcaraSchema);
      
      const [room, user, acara,] = Promise.all([
        checkRoomExistence(roomRepository)({ id: params.roomId }),
        checkUserExistence(userRepository)({ id: params.userId }),
        acaraRepository.getAcara({ id: params.id })
      ]);

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

      const start = new Date(params.startTime);
      const end = new Date(params.endTime);

      if (start.getTime() > end.getTime()) {
        const err = new Error('Invalid duration');
        err.statusCode = 422;

        throw err;
      }

      hasRights(acara[0], auth);
        
      return await acaraRepository.updateAcara(params);
    } catch (err) {
      throw err;
    }
  };
}

export function createAcaraService(acaraRepository, userRepository, roomRepository) {
  return {
    findAcara: findAcara(acaraRepository),
    findConflicts: findConflicts(acaraRepository, roomRepository),
    getAcara: getAcara(acaraRepository),
    createAcara: createAcara(acaraRepository, roomRepository, userRepository),
    deleteAcara: deleteAcara(acaraRepository),
    updateAcara: updateAcara(acaraRepository, roomRepository),
  };
}
