/**
 * acara.js
 * Contains anything related to acara-targeting operation
 * Author: Namchee
 */

import { handleError, handleSuccess } from './../helpers/api';

/**
 * Creates a new Acara Controller
 * 
 * @param {object} service Acara service
 * @return {object} Controller methods
 */
export function AcaraController(service) {
  return {
    findAcara: (req, res, next) => {
      service.findAcara(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    getAcara: (req, res, next) => {
      service.getAcara(req.params, req.auth)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    createAcara: (req, res, next) => {
      service.createAcara(req.body)
        .then(result => res.status(200)
          .send(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    deleteAcara: (req, res, next) => {
      service.deleteAcara(req.body, req.auth)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateAcaraInfo: (req, res, next) => {
      service.updateAcara(req.body, req.auth)
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
}
