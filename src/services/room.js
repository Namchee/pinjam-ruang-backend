import { validateData } from '../helpers/api';
import { createRoomSchema, updateRoomSchema, deleteRoomSchema } from './../schemas/room';
import { Room } from '../model/room';

function toDTO(data) {
  return new Room(data);
}

function toDataArray(data) {
  const arr = [];

  for (const room of data) {
    arr.push(toDTO(room));
  }

  return arr;
}

export function checkRoomExistence(roomRepository) {
  return async function(params) {
    try {
      if (params &&
        Object.keys(params).length === 1 &&
        params.id) {
        const res = await roomRepository.exist(params);
        
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

export function findRoom(roomRepository) {
  return async function(params) {
    try {
      if (params && Object.keys(params).length === 1) {
        if (params.name) {
          const res = roomRepository.findByName(params.name);
          
          return toDataArray(res);
        } else {
          const err = new Error('Invalid parameters');
          err.statusCode = 422;
  
          throw err;
        }
      } else if (params && Object.keys(params).length === 0) {
        const res = await roomRepository.findAll();

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

export function createRoom(roomRepository) {
  return async function(params) {
    try {
      await validateData(params, createRoomSchema);

      return await roomRepository.create(params);
    } catch (err) {
      throw err;
    }
  };
}

export function updateRoom(roomRepository) {
  return async function(params) {
    try {
      await validateData(params, updateRoomSchema);
      await checkRoomExistence(roomRepository)({ id: params.id });

      return await roomRepository.update(params);
    } catch (err) {
      throw err;
    }
  };
}

export function deleteRoom(roomRepository) {
  return async function(params) {
    try {
      await validateData(params, deleteRoomSchema);
      await checkRoomExistence(roomRepository)({ id: params.id });

      return await roomRepository.delete(params);
    } catch (err) {
      throw err;
    }
  };
}

export function createRoomService(roomRepository) {
  return {
    findRoom: findRoom(roomRepository),
    createRoom: createRoom(roomRepository),
    updateRoom: updateRoom(roomRepository),
    deleteRoom: deleteRoom(roomRepository),
  };
}
