import express from 'express';
import auth from './../../../middlewares/auth';
import { UserController } from './../../../controller/user';
import { createConnection } from './../../../helpers/connection';

const router = express.Router();
const userController = UserController.inject(createConnection());

router.post('/login', userController.login);

router.post('*', auth.loginCheck);
router.patch('*', auth.loginCheck);
router.delete('*', auth.loginCheck);

router.get('/get_user', userController.find);
router.get('/get_user_by_id/:id', userController.find);
router.get('/get_user_by_name/:name', userController.find);
router.get('/get_user_by_username/:username', userController.find);

router.post('/create_user', auth.adminAuth, userController.create);

router.patch('/update_info', userController.updateInfo);
router.patch('/change_password', userController.updatePassword);

router.patch('/update_user', auth.adminAuth, userController.powerUpdate);

router.delete('/delete_user', auth.adminAuth, userController.delete);

router.post('/check_credentials', userController.checkCredentials);

export { router as userRoutes };
