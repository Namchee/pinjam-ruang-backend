/**
 * api.js
 * API Routing file
 * This file routes ALL REST API requests to it's correct API version
 * Author: Namchee
 */

import express from 'express';
import { v1 } from './api/v1';

const router = express.Router();

router.use('/v1', v1);

export { router as api };
