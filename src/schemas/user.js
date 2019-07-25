import Joi from '@hapi/joi';

export const authenticationSchema = Joi.object().keys({
  token: Joi.string().required(),
});

export const createUserSchema = Joi.object().keys({
  username: Joi.string().max(20).required(),
  name: Joi.string().max(50).required(),
  password: Joi.string().max(72).required(),
  email: Joi.string().email().required(),
  isAdmin: Joi.boolean().required(),
});

export const updateInfoSchema = Joi.object().keys({
  id: Joi.number().positive().required(),
  username: Joi.string().max(20).required(),
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
});

export const updatePasswordSchema = Joi.object().keys({
  id: Joi.number().positive().required(),
  oldPassword: Joi.string().max(72).required(),
  newPassword: Joi.string().max(72).required(),
  confirmPassword: Joi.string().max(72).required(),
});

export const deleteUserSchema = Joi.object().keys({
  id: Joi.number().positive().required(),
});
