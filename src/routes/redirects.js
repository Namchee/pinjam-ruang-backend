import express from 'express';

const router = express.Router();

router.use((err, req, res, next) => {
  return res.status(err.status || 404)
    .send({
      status: false,
      data: null,
      message: req.err || '' || 'Resources Not Found',
    });
});

export default router;
