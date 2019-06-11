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
  static get __OPTIONS__() {
    return {
      issuer: process.env.ISSUER || '',
      expiresIn: '5m',
    };
  }

  static get __sign() {
    return util.promisify(jwt.sign);
  }

  static get __verify() {
    return util.promisify(jwt.verify);
  }

  static get __decode() {
    return util.promisify(jwt.decode);
  }

  static get __PRIMARY_SECRET__() {
    return process.env.PRIMARY_SECRET || 'thisisasecret';
  }

  static get __SYNC_SECRET__() {
    return process.env.SYNC_SECRET || 'thisisanothersecret';
  }

  static async __signToken(payload, secret, options = undefined) {
    const { err, res } = await asyncWrapper(
      TokenProcessor.__sign(
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

  static async __verifyPrimaryToken(token) {
    const { err, res } = await asyncWrapper(
      TokenProcessor.__verify(
        token,
        TokenProcessor.__PRIMARY_SECRET__,
        TokenProcessor.__OPTIONS__,
      )
    );

    if (err) {
      throw new Error(err);
    }

    return res;
  }

  static async __verifySyncToken(token, sync) {
    const { err, res } = await asyncWrapper(
      TokenProcessor.__verify(
        sync,
        TokenProcessor.__SYNC_SECRET__
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
      TokenProcessor.__signToken(
        user,
        TokenProcessor.__PRIMARY_SECRET__,
        TokenProcessor.__OPTIONS__,
      )
    );

    if (primaryErr) {
      throw new Error(`Cannot generate primary token: ${primaryErr}`);
    }

    const { err: syncErr, res: syncRes } = await asyncWrapper(
      TokenProcessor.__signToken(
        primaryRes,
        TokenProcessor.__SYNC_SECRET__,
      )
    );

    if (syncErr) {
      throw new Error(`Cannot generate sync token: ${syncErr}`);
    }

    return {
      primary: primaryRes,
      sync: syncRes,
    };
  }

  static async refreshToken(token) {
    const { err: decodeErr, res: decoded } = await asyncWrapper(
      TokenProcessor.__decode(
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
      TokenProcessor.__verifyPrimaryToken(
        token
      )
    );

    const verifySync = asyncWrapper(
      TokenProcessor.__verifySyncToken(
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
