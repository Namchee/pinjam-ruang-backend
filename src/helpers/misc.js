/**
 * misc.js
 * This file contains various useful helper functions
 * Useful for generating 'readable' code
 * And (maybe) reduce code repetition
 * Author: Namchee
 */

import Joi from '@hapi/joi';
import { Promise } from 'bluebird';

export function getNextExpirationDate(date = Date.now()) {
  return new Date(date + (7 * 24 * 60 * 60 * 1000));
}

export function validateData(data, schema) {
  return new Promise((resolve, reject) => {
    Joi.validate(data, schema, (err, res) => {
      if (err) {
        err.statusCode = 422;
        reject(err);
      }

      resolve(res);
    });
  });
}

export function asyncWrapper(promise) {
  return promise
    .then(res => {
      return {
        res,
      };
    })
    .catch(err => {
      let error = err;
      if (error instanceof Error) {
        error = err.message;
      }

      return {
        err: error,
      };
    });
}
