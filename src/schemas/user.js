import Joi from '@hapi/joi';

export const authenticationSchema = Joi.object().keys({
  token: Joi.string().required(),
});

export const updateRoleSchema = Joi.object().keys({
  id: Joi.number().positive().required(),
  role: Joi.number().allow(0, 1, 2).required(),
});

export const deleteUserSchema = Joi.object().keys({
  id: Joi.number().positive().required(),
});
