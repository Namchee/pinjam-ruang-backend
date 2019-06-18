/**
 * acara.js
 * Contains anything related to acara-targeting operation
 * Author: Namchee
 */

import { AcaraService } from './../services/acara';

export const AcaraController = (function() {
  let service = undefined;

  return {
    inject: function(conn) {
      service = AcaraService.inject(conn);
      return this;
    },

    find: (req, res, next) => {
      service.find(req.params)
        .then(result => {
          return res.status(200)
            .json({
              status: true,
              message: null,
              data: result,
            });
        })
        .catch(err => {
          const error = {
            status: 500,
            message: err.message,
          };

          next(error);
        });
    },

    get: (req, res, next) => {
      service.get(req.params.id)
        .then(result => {
          return res.status(200)
            .json({
              status: true,
              message: null,
              data: result,
            });
        })
        .catch(err => {
          const error = {
            status: 500,
            message: err.message,
          };

          next(error);
        });
    }
  };
})();