/**
 * auth.js
 * This file contains anything related to authentication for the application
 * Author: Namchee
 */

import { TokenProcessor } from './../helpers/token';
import { getNextExpirationDate } from './../helpers/api';
import { handleError } from '../helpers/api';

export default {
  loginCheck: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const sync = req.cookies.sync;

      if (token && sync) {
        const result = TokenProcessor.verifyToken(token, sync);

        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

        if (result.ip && result.ip !== ip) {
          const error = new Error('Invalid token');
          error.statusCode = 401;

          throw error;
        }

        req.auth = result;

        next();
      } else {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;

        throw error;
      }
    } catch (err) {
      return next(handleError(err));
    }
  },

  sendRefresh: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const refresh = req.cookies.sync;

      if (token && refresh) {
        TokenProcessor.refreshable(token, refresh);

        const { primary, sync } = TokenProcessor.refreshToken(token);

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
      } else {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;

        throw error;
      }
    } catch (err) {
      return next(handleError(err));
    }
  },

  adminAuth: (req, res, next) => {
    if (!req.auth.isAdmin) {
      const err = new Error('Administrator rights required');
      err.statusCode(403);
      
      next(handleError(err));
    }

    next();
  }
};
