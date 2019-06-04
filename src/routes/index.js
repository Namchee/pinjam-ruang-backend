/**
 * index.js
 * General router file
 * It generates POST request guard
 * And redirects view requests
 * Author: Namchee
 */

import express from 'express';
import auth from './../middlewares/auth';

const router = express.Router();

// view code here
router.post('*', auth.loginCheck);

export default router;
