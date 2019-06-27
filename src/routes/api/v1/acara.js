import express from 'express';
import { AcaraController } from './../../../controller/acara';
import { createConnection } from './../../../helpers/connection';
import auth from './../../../middlewares/auth';

const router = express.Router();
const acaraController = AcaraController.inject(createConnection());

router.post('*', auth.loginCheck);
router.patch('*', auth.loginCheck);
router.delete('*', auth.loginCheck);

router.get('/get_acara', acaraController.findAcara);
router.get('/get_acara/:name', acaraController.findAcara);
router.get('/get_user_acara/:userId', acaraController.findAcara);
router.get('/edit_acara/:id', auth.loginCheck, acaraController.getAcaraForEdit);

router.post('/create_acara', acaraController.createAcara);

router.delete('/delete_acara', acaraController.deleteAcara);

router.patch('/update_acara', acaraController.updateAcaraInfo);

router.patch('/change_acara_status', auth.adminAuth, acaraController.changeAcaraStatus);

export { router as acaraRoutes };
