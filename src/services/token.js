/**
 * token.js
 * This file contains all functions which are related to jwt-token processing
 * Author: Namchee
 */

import { asyncWrapper } from './misc';
import jwt from 'jsonwebtoken';
import util from 'util';

/**
 * TODO: Generate dis
 */
export class TokenProcessor {
  static get _OPTIONS() {
    return {
      issuer: process.env.ISSUER || '',
      expiresIn: '5m',
    };
  }

  static get _sign() {
    return util.promisify(jwt.sign);
  }

  static get _verify() {
    return util.promisify(jwt.verify);
  }

  static get _decode() {
    return util.promisify(jwt.decode);
  }

  static get _PRIMARY_SECRET() {
    return process.env.PRIMARY_SECRET || 'thisisasecret';
  }

  static get _SYNC_SECRET() {
    return process.env.SYNC_SECRET || 'thisisanothersecret';
  }

  static async _signToken(payload, secret, options = undefined) {
    const { err, res } = await asyncWrapper(
      TokenProcessor._sign(
        payload,
        secret,
        options,
      )
    );

    if (err) {
      throw new Error(err);
    }

    return res;
  }

  static async _verifyPrimaryToken(token) {
    const { err, res } = await asyncWrapper(
      TokenProcessor._verify(
        token,
        TokenProcessor._PRIMARY_SECRET,
        TokenProcessor._OPTIONS,
      )
    );

    if (err) {
      throw new Error(err);
    }

    return res;
  }

  static async _verifySyncToken(token, sync) {
    const { err, res } = await asyncWrapper(
      TokenProcessor._verify(
        sync,
        TokenProcessor._SYNC_SECRET
      )
    );

    if (err) {
      throw new Error(err);
    }

    if (res !== token) {
      throw new Error('Invalid Sync Token');
    }

    return res;
  }

  static async generateToken(user) {
    const { err: primaryErr, res: primaryRes } = await asyncWrapper(
      TokenProcessor._signToken(
        user,
        TokenProcessor._PRIMARY_SECRET,
        TokenProcessor._OPTIONS,
      )
    );

    if (primaryErr) {
      throw new Error(primaryErr);
    }

    const { err: syncErr, res: syncRes } = await asyncWrapper(
      TokenProcessor._signToken(
        primaryRes,
        TokenProcessor._SYNC_SECRET,
      )
    );

    if (syncErr) {
      throw new Error(syncErr);
    }

    return {
      primary: primaryRes,
      sync: syncRes,
    };
  }

  static async refreshToken(token) {
    const { err: decodeErr, res: decoded } = await asyncWrapper(
      TokenProcessor._decode(
        token
      )
    );

    if (decodeErr) {
      throw new Error(decodeErr);
    }

    return await TokenProcessor.generateToken(decoded);
  }

  static async verifyToken(token, sync) {
    const verifyPrimary = asyncWrapper(
      TokenProcessor._verifyPrimaryToken(
        token
      )
    );

    const verifySync = asyncWrapper(
      TokenProcessor._verifySyncToken(
        sync,
        token
      )
    );

    return Promise.all([verifyPrimary, verifySync])
      .then(([{ err: primaryErr, res: primaryRes }, { err: syncErr }]) => {
        if (primaryErr) {
          if (primaryErr.name !== 'TokenExpiredError') {
            throw new Error(primaryErr);
          }

          if (syncErr) {
            throw new Error(syncErr);
          }

          return {
            status: 2,
            data: null,
          };
        } else {
          return {
            status: 1,
            data: primaryRes,
          };
        }
      });
  }
}
