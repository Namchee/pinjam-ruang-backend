import express from 'express';
import { createConnection } from './../../helpers/connection';
import { UserController } from './../../controller/user';
import { AcaraController } from './../../controller/acara';

const router = express.Router();

const userController = UserController.inject(createConnection());
const acaraController = AcaraController.inject(createConnection());

router.get('/get_user', userController.findAllUsers);
router.get('/get_acara', acaraController.findAcara);
router.get('/get_acara/:name', acaraController.findAcara);
router.get('/get_my_acara/:userId', acaraController.findAcara);
router.get('/edit_acara/:id', acaraController.getAcaraForEdit);

router.post('/create_acara', acaraController.createAcara);

router.delete('/delete_acara', acaraController.deleteAcara);

router.patch('/update_acara', acaraController.updateAcaraInfo);

export { router as v1 };
