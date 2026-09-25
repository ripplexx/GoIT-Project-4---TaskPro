import Joi from 'joi';

export const helpSchema = Joi.object({
  email: Joi.string().email().required(),
  comment: Joi.string().min(10).required(),
});
