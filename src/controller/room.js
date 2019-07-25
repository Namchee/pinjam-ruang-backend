/**
 * room.js
 * Contains anything related to room-targeting operation
 * Author: Namchee
 */

import { handleError, handleSuccess } from './../helpers/api';

export function RoomController(service) {
  return {
    findRoom: (req, res, next) => {
      service.findRoom(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    createRoom: (req, res, next) => {
      service.createRoom(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateRoomInfo: (req, res, next) => {
      service.updateRoom(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    deleteRoom: (req, res, next) => {
      service.deleteRoom(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    }
  };
}
