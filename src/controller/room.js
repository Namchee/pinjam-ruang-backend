/**
 * room.js
 * Contains anything related to room-targeting operation
 * Author: Namchee
 */

import { RoomService } from './../services/room';

export const AcaraController = (function() {
  let service = undefined;

  const handleError = function(err) {
    err.statusCode = err.statusCode || 500;

    return err;
  };

  const handleSuccess = function(data) {
    return {
      status: true,
      message: null,
      data,
    };
  };

  return {
    inject: function(conn) {
      service = RoomService.inject(conn);
      return this;
    },

    findRoom: (req, res, next) => {
      service.find(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    createRoom: (req, res, next) => {
      service.find(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateRoomInfo: (req, res, next) => {
      service.update(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    deleteRoom: (req, res, next) => {
      service.delete(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    }
  };
})();
