import express from 'express';
import { createConnection } from './../../helpers/connection';
import { UserController } from './../../controller/user';

const router = express.Router();

const userController = new UserController(createConnection());

router.get('/get_user', userController.getAllUsers.bind(userController));

export { router as v1 };
