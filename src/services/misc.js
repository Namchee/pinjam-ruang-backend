/**
 * misc.js
 * This file contains various useful helper functions
 * Useful for generating 'readable' code
 * And (maybe) reduce code repetition
 * Author: Namchee
 */

export function getNextDay(date = Date.now()) {
  return new Date(date + 24 * 60 * 60 * 1000);
}

export function asyncWrapper(promise) {
  return promise
    .then(res => {
      return {
        res,
      };
    })
    .catch(err => {
      return {
        err,
      };
    });
}
