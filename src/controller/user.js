/**
 * user.js
 * Contains anything related to user-targeting operation
 * Author: Namchee
 */

import { UserService } from './../services/user';
import { TokenProcessor } from './../helpers/token';
import { getNextExpirationDate } from './../helpers/misc';

export const UserController = (function() {
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
      service = UserService.inject(conn);
      return this;
    },

    login: (req, res, next) => {
      service.login(req.body)
        .then(result => {
          const user = {
            id: result.id,
            isAdmin: result.isAdmin,
            ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
          };

          return {
            user: result,
            token: TokenProcessor.generateToken(user),
          };
        })
        .then(({ user, token }) => {
          res.cookie('synchro', token.sync, { 
            expires: getNextExpirationDate(), 
            httpOnly: true,
          });

          const data = {
            user,
            token,
          };

          return res.status(200)
            .json(handleSuccess(data));
        })
        .catch(err => next(handleError(err)));
    },

    findUser: (req, res, next) => {
      service.find(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    createUser: (req, res, next) => {
      service.create(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateUserInfo: (req, res, next) => {
      service.updateInsensitive(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateUserPassword: (req, res, next) => {
      service.updatePassword(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    powerUpdate: (req, res, next) => {
      service.powerUpdate(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    checkCredentials: (req, res, next) => {
      service.checkCredentials(req.body)
        .then(() => res.status(200)
          .json(handleSuccess(true)))
        .catch(() => res.status(403)
          .json(handleSuccess(false)));
    },
    
    deleteUser: (req, res, next) => {
      service.delete(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },
  };
})();
