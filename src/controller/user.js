/**
 * user.js
 * Contains anything related to user-targeting operation
 * Author: Namchee
 */
import { TokenProcessor } from './../helpers/token';
import { getNextExpirationDate, handleError, handleSuccess } from './../helpers/api';

export function UserController(services) {
  const service = services;

  return {
    authenticate: (req, res, next) => {
      service.authenticate(req.body)
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
      service.findUser(req.params)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    createUser: (req, res, next) => {
      service.createUser(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    updateUserRole: (req, res, next) => {
      service.updateUserRole(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },

    deleteUser: (req, res, next) => {
      service.deleteUser(req.body)
        .then(result => res.status(200)
          .json(handleSuccess(result)))
        .catch(err => next(handleError(err)));
    },
  };
}
