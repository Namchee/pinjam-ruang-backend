/**
 * acara.js
 * Contains anything related to acara-targeting operation
 * Author: Namchee
 */

import { AcaraService } from './../services/acara';

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
      service = AcaraService.inject(conn);
      return this;
    },

    findAcara: (req, res, next) => {
      service.find(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    getAcaraForEdit: (req, res, next) => {
      service.get(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    createAcara: (req, res, next) => {
      req.body['status'] = 1;

      service.create(req.body)
        .then(result => res.status(200)
          .send(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    deleteAcara: (req, res, next) => {
      service.delete(req.body, req.auth)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateAcaraInfo: (req, res, next) => {
      req.body['status'] = 1; // test mode

      service.update(req.body, req.auth)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    changeAcaraStatus: (req, res, next) => {
      service.changeStatus(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },
  };
})();
