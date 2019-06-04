/**
 * api.js
 * API Routing file
 * This file routes ALL REST API request
 * Author: Namchee
 */

import express from 'express';

const router = express.Router();

router.get('/v1', (req, res, next) => {
  res.send({
    data: 'Hello World!',
  });
});

export default router;
