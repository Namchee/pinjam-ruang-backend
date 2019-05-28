import express from 'express';

const router = express.Router();

router.use((req, res) => {
  return res.status(404).send({
    status: false,
    message: 'Resources not found',
    data: null
  });
});

export default router;