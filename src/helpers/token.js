import jwt from 'jsonwebtoken';
import { config } from './../../config/config';

/**
 * Contains anything related to jwt-processing function
 * Author: Namchee
 */
export const TokenProcessor = (function() {
  const primaryOptions = {
    issuer: config.tokenIssuer,
    expiresIn: '5m',
  };

  const primarySecret = config.primarySecret;
  const syncSecret = config.syncSecret;

  /**
   * Check if primary token is valid
   * @param {object} decoded Primary payload
   * @return {boolean} true if valid, false otherwise
   */
  const isPrimaryPayload = function(decoded) {
    return decoded &&
      typeof decoded === 'object' &&
      Object.keys(decoded).length == 3 &&
      'id' in decoded &&
      'isAdmin' in decoded &&
      'ip' in decoded &&
      typeof decoded['id'] === 'number' &&
      typeof decoded['isAdmin'] === 'boolean' &&
      typeof decoded['ip'] === 'string';
  };
  
  /**
   * Check if synchronizer token is valid
   * @param {string} decoded Sync payload
   * @return {boolean} true if valid, false otherwise
   */
  const isSyncPayload = function(decoded) {
    return decoded &&
      typeof decoded === 'string';
  };

  /**
   * Decode a primary token.
   * It DOESN'T check if token is valid or not
   * Returns a user object.
   * Else, throws an error IF payload is NOT a user object.
   * @param {string} token Primary token
   * @return {{ id: number, isAdmin: boolean, ip: string }} user object, containing ID, isAdmin, and IP
   */
  const decodePrimaryToken = function(token) {
    try {
      const result = jwt.decode(token);

      if (!isPrimaryPayload(result)) {
        const err = new Error('Invalid token');
        err.statusCode = 422;

        throw err;
      }

      return result;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Verify if primary token is valid.
   * It checks if the token is STILL VALID or NOT.
   * Returns a user object.
   * Else, throws an error.
   * @param {string} token Primary token
   * @param {string} secret Primary secret
   * @param {object} [options=primaryOptions] Token options
   * @return {{ id: number, isAdmin: boolean, ip: number }} user object, containing ID, isAdmin, and IP
   */
  const verifyPrimaryToken = function(token, secret, options = primaryOptions) {
    try {
      const result = jwt.verify(token, secret, options);

      if (!isPrimaryPayload(result)) {
        const err = new Error('Invalid token');
        err.statusCode = 422;

        throw err;
      }

      return result;
    } catch (err) {
      throw err;
    }
  };
  
  /**
   * Verify if synchronizer token is valid.
   * It checks if sync token is STILL VALID or NOT.
   * Returns a primary token.
   * Else, throws an error.
   * @param {string} token Synchronizer token
   * @param {string} secret Synchronizer secret
   * @param {string} comparator Value to compare with payload
   * @return {string} Primary token
   */
  const verifySyncToken = function(token, secret, comparator) {
    try {
      const result = jwt.verify(token, secret);

      if (!isSyncPayload(result) || result !== comparator) {
        const err = new Error('Invalid token');
        err.statusCode = 422;

        throw err;
      }

      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    /**
     * Generate token set for authentication purposes
     * @param {{ id: number, isAdmin: boolean, ip: string }} user User object, MUST contain ID, isAdmin, and IP address
     * @return {{ primary: string, sync: string }} primary and sync tokens 
     */
    generateToken: function(user) {
      try {
        if (!isPrimaryPayload(user)) {
          const err = new Error('Invalid primary payload');
          err.statusCode = 422;

          throw err;
        }

        const primaryRes = jwt.sign(user, primarySecret, primaryOptions);

        const syncRes = jwt.sign(primaryRes, syncSecret);
  
        return {
          primary: primaryRes,
          sync: syncRes,
        };
      } catch (err) {
        throw err;
      }
    },

    /**
     * Refresh a token, generating new set of primary and sync token.
     * @param {string} token Primary token
     * @return {{ primary: string, sync: string }} primary and sync tokens 
     */
    refreshToken: function(token) {
      try {
        const decoded = decodePrimaryToken(token);

        return this.generateToken(decoded);
      } catch (err) {
        throw err;
      }
    },

    /**
     * Verifies if BOTH token is valid for authentication purposes.
     * It will return a user object if valid.
     * Else, it will throw an error.
     * @param {string} token Primary token
     * @param {string} sync Synchronizer token
     * @return {{ id: number, isAdmin: boolean, ip: string }} A user object containing ID, isAdmin, and IP
     */
    verifyToken: function(token, sync) {  
      try {
        const verifyPrimary = verifyPrimaryToken(token, primarySecret);
        verifySyncToken(sync, syncSecret, token);

        return verifyPrimary;
      } catch (err) {
        throw err;
      }
    },

    /**
     * Check if token refresh request is valid.
     * It won't do anything if request is valid.
     * Else, it will throw an error.
     * @param {string} token Primary token 
     * @param {string} sync Synchronizer token
     */
    refreshable: async function(token, sync) {
      try {
        verifySyncToken(token, sync);
      } catch (err) {
        throw err;
      }
    },
  };
})();
