import express from 'express';
import { RoomController } from './../../../controller/room';
import { createConnection } from './../../../helpers/connection';
import auth from './../../../middlewares/auth';

const router = express.Router();
const roomController = RoomController.inject(createConnection());

router.post('*', auth.loginCheck, auth.adminAuth);
router.patch('*', auth.loginCheck, auth.adminAuth);
router.delete('*', auth.loginCheck, auth.adminAuth);

router.get('/get_room', roomController.findRoom);
router.get('/get_room/:name', roomController.findRoom);

router.post('/create_room', roomController.createRoom);

router.patch('/update_room', roomController.updateRoomInfo);

router.delete('/delete_room', roomController.deleteRoom);

export { router as roomRoutes };
