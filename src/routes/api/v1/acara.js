import express from 'express';
import { AcaraRepository } from './../../../repository/acara';
import { RoomRepository } from './../../../repository/room';
import { UserRepository } from './../../../repository/user';
import { createAcaraService } from './../../../services/acara';
import { AcaraController } from './../../../controller/acara';
import { createConnection } from './../../../helpers/database';
import auth from './../../../middlewares/auth';

const router = express.Router();
const conn = createConnection();

const acaraRepo = AcaraRepository(conn);
const roomRepo = RoomRepository(conn);
const userRepo = UserRepository(conn);

const acaraService = createAcaraService(acaraRepo, userRepo, roomRepo);

const acaraController = AcaraController(acaraService);

router.post('*', auth.loginCheck);
router.patch('*', auth.loginCheck);
router.delete('*', auth.loginCheck);

router.get('/get_acara', acaraController.findAcara);
router.get('/get_acara/:name', acaraController.findAcara);
router.get('/get_user_acara/:userId', acaraController.findAcara);
router.get('/edit_acara/:id', auth.loginCheck, acaraController.getAcara);

router.post('/create_acara', acaraController.createAcara);

router.delete('/delete_acara', acaraController.deleteAcara);

router.patch('/edit_acara', acaraController.updateAcaraInfo);

router.patch('/change_acara_status', auth.adminAuth, acaraController.changeAcaraStatus);

export { router as acaraRoutes };
