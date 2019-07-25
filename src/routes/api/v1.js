import express from 'express';
import { acaraRoutes } from './v1/acara';
import { userRoutes } from './v1/user';
import { roomRoutes } from './v1/room';

const router = express.Router();

router.use(acaraRoutes, userRoutes, roomRoutes);

export { router as v1 };
