import express from 'express';

const router = express.Router();

router.get('/v1', (req, res) => {
  res.send({
    data: 'Hello World!'
  });
});

export default router;