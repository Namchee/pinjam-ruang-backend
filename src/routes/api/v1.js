import express from 'express';
import { createConnection } from './../../helpers/connection';
import { UserController } from './../../controller/user';
import { AcaraController } from './../../controller/acara';

const router = express.Router();

const userController = UserController.inject(createConnection());
const acaraController = AcaraController.inject(createConnection());

router.get('/get_user', userController.findAllUsers);
router.get('/get_acara', acaraController.find);
router.get('/get_acara/:name', acaraController.find);
router.get('/get_my_acara/:userId', acaraController.find);
router.get('/edit_acara/:id', acaraController.get);

export { router as v1 };
