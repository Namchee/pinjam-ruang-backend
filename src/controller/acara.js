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

  const handleSuccess = function(res) {
    return {
      status: true,
      message: null,
      data: res,
    };
  };

  return {
    inject: function(conn) {
      service = AcaraService.inject(conn);
      return this;
    },

    findAcara: (req, res, next) => {
      service.find(req.params)
        .then(result => {
          return res.status(200)
            .json(handleSuccess(result));
        })
        .catch(err => {
          return next(handleError(err));
        });
    },

    getAcaraForEdit: (req, res, next) => {
      service.get(req.params.id)
        .then(result => {
          return res.status(200)
            .json(handleSuccess(result));
        })
        .catch(err => {
          return next(handleError(err));
        });
    },

    createAcara: (req, res, next) => {
      req.body['status'] = 1;

      service.create(req.body)
        .then(result => {
          return res.status(200)
            .send(handleSuccess(result));
        })
        .catch(err => {
          return next(handleError(err));
        });
    },

    deleteAcara: (req, res, next) => {
      service.delete(req.body)
        .then(result => {
          return res.status(200)
            .json(handleSuccess(result));
        })
        .catch(err => {
          return next(handleError(err));
        });
    },

    updateAcaraInfo: (req, res, next) => {
      req.body['status'] = 1; // test mode

      service.update(req.body)
        .then(result => {
          return res.status(200)
            .send(handleSuccess(result));
        })
        .catch(err => {
          return next(handleError(err));
        });
    },

    changeAcaraStatus: (req, res, next) => {
      service.changeStatus(req.body)
        .then(result => {
          return res.status(200)
            .send(handleSuccess(result));
        })
        .catch(err => {
          return next(handleError(err));
        });
    }
  };
})();
