/**
 * api.js
 * This file contains various useful helper functions
 * For formatting REST I/O
 * Author: Namchee
 */

import Joi from '@hapi/joi';
import { Promise } from 'bluebird';

/**
 * Get the next expiration date for token
 * @param {Date} date date object representing current date
 * @return {Date} a date object representing the next expiration date
 */
export function getNextExpirationDate(date = new Date()) {
  return new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000));
}

/**
 * Validate an input data against a provided schema
 * @param {object} data Input data
 * @param {Joi.ObjectSchema} schema A Joi Object schema to be compared
 * @return {Promise<object>} The validated data is promise is fulfilled
 */
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

/**
 * Formats an Error object for REST purposes
 * @param {Error} err Error object
 * @return {Error} Reformatted Error object
 */
export function handleError(err) {
  err.statusCode = err.statusCode || 500;

  return err;
}

/**
 * Formats data object for REST purposes
 * @param {object} data Data to be formatted
 * @return {{ status: boolean, data: object, message: null }} Response object, containing status, data, and message
 */
export function handleSuccess(data) {
  return {
    status: true,
    data,
    message: null,
  };
}
