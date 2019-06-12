import express from 'express';
import { createConnection } from './../../helpers/connection';
import { UserController } from './../../controller/user';

const router = express.Router();

const userController = UserController.create(createConnection());

router.get('/get_user', userController.findAllUsers);

export { router as v1 };
