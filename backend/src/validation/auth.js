import Joi from 'joi';

// Frontend'in src/utils/validationSchemas.js'teki nameRules/passwordRules ile birebir aynı.
const name = Joi.string().min(2).max(32).required();
const password = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^\S+$/, 'no spaces')
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[0-9]/, 'digit')
  .required();

export const registerSchema = Joi.object({
  name,
  email: Joi.string().email().required(),
  password,
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
