/**
 * auth.js
 * This file contains anything related to authentication for the application
 * Author: Namchee
 */

import { TokenProcessor } from './../helpers/token';
import { asyncWrapper, getNextExpirationDate } from './../helpers/misc';

export default {
  loginCheck: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const sync = req.cookies.sync;

    if (token && sync) {
      const { err, res: result } = await asyncWrapper(
        TokenProcessor.verifyToken(
          token,
          sync
        )
      );

      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

      if (err || result.ip !== ip) {
        const error = new Error('Invalid token');
        error.statusCode = 401;

        next(error);
      }

      if (result.status == 2) {
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
    const { err, res: result } = await asyncWrapper(
      TokenProcessor.refreshToken(
        req.token
      )
    );

    if (err) {
      next(err);
    }

    const { primary, sync } = result;

    res.cookie('synchro', sync, { 
      expires: getNextExpirationDate(),
      httpOnly: true,
    });

    return res.status(200)
      .json({
        status: true,
        message: 'Token Refreshed',
        data: primary,
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
