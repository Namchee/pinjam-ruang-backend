/**
 * misc.js
 * This file contains various useful helper functions
 * Useful for generating 'readable' code
 * And (maybe) reduce code repetition
 * Author: Namchee
 */

export function getNextExpirationDate(date = Date.now()) {
  return new Date(date + (7 * 24 * 60 * 60 * 1000));
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
