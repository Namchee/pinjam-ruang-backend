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
        next(401);
      }

      if (res.status == 2) {
        req.refresh = true;
        req.token = token;
      } else {
        req.auth = result;
      }

      next();
    } else {
      next(401);
    }
  },

  sendRefresh: async (req, res, next) => {
    if (!req.refresh) {
      next();
    }

    const { err, res: result } = await asyncWrapper(tp.refreshToken(req.token));
    if (err) {
      next(500);
    }

    return res.status(400)
      .send({
        status: false,
        message: 'Token Refreshed',
        data: result,
      });
  },
};
