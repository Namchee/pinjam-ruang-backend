import { validateData } from './../helpers/misc';
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
  return function(params) {
    if (params &&
      Object.keys(params).length === 1 &&
      params.id) {
      return roomRepository.exist(params)
        .then(res => res[0].jml)
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

export function findRoom(roomRepository) {
  return function(params) {
    if (params && Object.keys(params).length === 1) {
      if (params.name) {
        return roomRepository.findByName(params.name)
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
      return roomRepository.findAll()
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

export function createRoom(roomRepository) {
  return function(params) {
    return validateData(params, createRoomSchema)
      .then(() => roomRepository.createRoom(params))
      .catch(err => {
        throw err;
      });
  };
}

export function updateRoom(roomRepository) {
  return function(params) {
    return validateData(params, updateRoomSchema)
      .then(() => checkRoomExistence(roomRepository)({ id: params.id }))
      .then(() => roomRepository.updateRoom(params))
      .catch(err => {
        throw err;
      });
  };
}

export function deleteRoom(roomRepository) {
  return function(params) {
    return validateData(params, deleteRoomSchema)
      .then(() => checkRoomExistence(roomRepository)({ id: params.id }))
      .then(() => roomRepository.deleteRoom(params))
      .catch(err => {
        throw err;
      });
  };
}
