import express from 'express';
import { acaraRoutes } from './v1/acara';
import { userRoutes } from './v1/user';
import { roomRoutes } from './v1/room';

const router = express.Router();

router.use('(acara)', acaraRoutes);
router.use('(user|login)', userRoutes);
router.use('(room)', roomRoutes);

export { router as v1 };
