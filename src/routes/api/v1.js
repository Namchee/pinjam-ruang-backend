import express from 'express';

const router = express.Router();

router.use('')

router.get('/get_user', userController.findAllUsers);
router.get('/get_acara', acaraController.findAcara);
router.get('/get_acara/:name', acaraController.findAcara);
router.get('/get_my_acara/:userId', acaraController.findAcara);
router.get('/edit_acara/:id', acaraController.getAcaraForEdit);

router.get('/test_gan/:id', acaraController.checkExistence);

router.post('/create_acara', acaraController.createAcara);

router.delete('/delete_acara', acaraController.deleteAcara);

router.patch('/update_acara', acaraController.updateAcaraInfo);

export { router as v1 };
