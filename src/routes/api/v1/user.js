import express from 'express';
import auth from './../../../middlewares/auth';
import { UserRepository } from './../../../repository/user';
import { createUserService } from './../../../services/user';
import { UserController } from './../../../controller/user';
import { createConnection } from './../../../helpers/database';

const router = express.Router();
const conn = createConnection();

const userRepo = UserRepository(conn);
const userService = createUserService(userRepo);
const userController = UserController(userService);

router.post('/login', userController.authenticate);

router.post('*', auth.loginCheck);
router.patch('*', auth.loginCheck);
router.delete('*', auth.loginCheck);

router.get('/get_user', userController.findUser);
router.get('/get_user_by_id/:id', userController.findUser);
router.get('/get_user_by_name/:name', userController.findUser);
router.get('/get_user_by_email/:email', userController.findUser);

router.patch('/update_user', auth.adminAuth, userController.updateUserRole);

router.delete('/delete_user', auth.adminAuth, userController.deleteUser);

export { router as userRoutes };
