import Joi from '@hapi/joi';

export const createRoomSchema = Joi.object().keys({
  name: Joi.string().max(10).required(),
});

export const updateRoomSchema = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().max(10).required(),
});

export const deleteRoomSchema = Joi.object().keys({
  id: Joi.number().required(),
});
