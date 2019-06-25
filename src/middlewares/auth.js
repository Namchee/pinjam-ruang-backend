/**
 * auth.js
 * This file contains anything related to authentication for the application
 * Author: Namchee
 */

import tp from './../services/token';
import { asyncWrapper } from './../services/misc';

export default {
  loginCheck: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const sync = req.cookies.sync;

    if (token && sync) {
      const { err, res: result } = await asyncWrapper(tp.verifyToken(token, sync));
      if (err) {
        req.err = 'Invalid Token';
        next(err);
      }

      if (res.status == 2) {
        return res.status(401)
          .json({
            status: false,
            data: null,
            message: 'Token Expired',
          });
      } else {
        req.auth = result;
      }

      next();
    } else {
      const err = new Error('Invalid token');
      err.statusCode = 401;

      next(err);
    }
  },

  sendRefresh: async (req, res, next) => {
    const { err, res: result } = await asyncWrapper(tp.refreshToken(req.token));
    if (err) {
      next(err);
    }

    return res.status(400)
      .json({
        status: false,
        message: 'Token Refreshed',
        data: result,
      });
  },

  adminAuth: (req, res, next) => {
    if (!req.auth.isAdmin) {
      return res.status(403)
        .json({
          status: false,
          data: null,
          message: 'Access denied',
        });
    }

    next();
  }
};
