import Joi from '@hapi/joi';

export const createAcaraSchema = Joi.object().keys({
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  name: Joi.string().max(50).required(),
  status: Joi.number().allow(0, 1, 2).required(),
  desc: Joi.string().max(100).required(),
  userId: Joi.number().required(),
  roomId: Joi.number().required(),
});

export const deleteAcaraSchema = Joi.object().keys({
  id: Joi.number().required(),
});

export const updateAcaraSchema = Joi.object().keys({
  id: Joi.number().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  name: Joi.string().max(50).required(),
  status: Joi.number().allow(0, 1, 2),
  desc: Joi.string().max(100).required(),
  userId: Joi.number().required(),
  roomId: Joi.number().required(),
});

export const changeAcaraStatusSchema = Joi.object().keys({
  id: Joi.number().required(),
  status: Joi.number().allow(0, 1, 2).required(),
});
