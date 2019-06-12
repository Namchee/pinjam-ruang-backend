/**
 * token.js
 * This file contains all functions which are related to jwt-token processing
 * Author: Namchee
 */

import { asyncWrapper } from './misc';
import jwt from 'jsonwebtoken';

export const TokenProcessor = (function(){
  const options = {
    issuer: process.env.ISSUER || '',
    expiresIn: '5m',
  };

  const primarySecret = process.env.PRIMARY_SECRET || 'thisisasecret';
  const syncSecret = process.env.SYNC_SECRET || 'thisisanothersecret';

  const isPrimaryToken = function(decoded) {
    return decoded &&
      typeof decoded === 'object' &&
      Object.keys(decoded).length == 2 &&
      'id' in decoded &&
      'isAdmin' in decoded &&
      typeof decoded['id'] === 'number' &&
      typeof decoded['isAdmin'] === 'boolean';
  };
  
  const isSyncToken = function(decoded) {
    return decoded &&
      typeof decoded === 'string';
  };

  const signToken = function(payload, secret, options = undefined) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, res) => {
        if (err) {
          reject(err);
        }
  
        resolve(res);
      });
    });  
  };

  const decodePrimaryToken = function(token) {
    return new Promise((resolve, reject) => {
      jwt.decode(token, (err, res) => {
        if (err) {
          reject(err);
        }
  
        if (!isPrimaryToken(res)) {
          reject(new Error('Invalid Primary Token'));
        }
  
        resolve(res);
      });
    });
  };

  const verifyPrimaryToken = function(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, res) => {
        if (err) {
          reject(err);
        }
        if (!isPrimaryToken(res)) {
          reject(new Error('Invalid Primary Token'));
        }
  
        resolve(res);
      });
    });
  };

  const verifySyncToken = function(token, secret, comparator) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, res) => {
        if (err) {
          reject(err);
        }
  
        if (!isSyncToken(res) || res !== comparator) {
          reject(new Error('Invalid Sync Token'));
        }
  
        resolve(res);
      });
    });
  };

  return {
    generateToken: async function(user) {
      if (!isPrimaryToken(user)) {
        throw new Error('Invalid primary payload');
      }

      const { err: primaryErr, res: primaryRes } = await asyncWrapper(
        signToken(user, primarySecret, options)
      );

      if (primaryErr) {
        throw new Error(`Cannot generate primary token: ${primaryErr}`);
      }

      if (!isSyncToken(primaryRes)) {
        throw new Error('Invalid sync payload');
      }

      const { err: syncErr, res: syncRes } = await asyncWrapper(
        signToken(primaryRes, syncSecret)
      );

      if (syncErr) {
        throw new Error(`Cannot generate sync token: ${syncErr}`);
      }

      return {
        primary: primaryRes,
        sync: syncRes,
      };
    },

    refreshToken: async function(token) {
      const { err: decodeErr, res: decoded } = await asyncWrapper(
        decodePrimaryToken(token)
      );

      if (decodeErr) {
        throw new Error(`Cannot refresh token: ${decodeErr}`);
      }

      return this.generateToken(decoded);
    },

    verifyToken: async function verifyToken(token, sync) {
      const verifyPrimary = verifyPrimaryToken(token);
      const verifySync = verifySyncToken(sync, token);
  
      return Promise.all([verifyPrimary, verifySync])
        .then(([{ err: primaryErr, res: primaryRes }, { err: syncErr }]) => {
          if (primaryErr) {
            if (primaryErr.name !== 'TokenExpiredError') {
              throw new Error(`Invalid primary token: ${primaryErr.message}`);
            }
  
            if (syncErr) {
              throw new Error(`Invalid sync token: ${syncErr.message}`);
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
  };
})();
