/**
 * index.js
 * General router file
 * It generates POST request guard
 * And redirects view requests
 * Author: Namchee
 */

import express from 'express';
// import auth from './../middlewares/auth';
import { api } from './api';
import { sanitize } from 'express-validator/filter';

const router = express.Router();

// sanitize ALL
router.use('*', [
  sanitize('*').trim().escape(),
], (req, res, next) => {
  next();
});

// view code here
router.use('/api', api);

export { router };
