import Joi from 'joi';
import { THEMES } from '../constants/index.js';

export const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(32),
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^\S+$/, 'no spaces')
    .pattern(/[A-Z]/, 'uppercase letter')
    .pattern(/[0-9]/, 'digit'),
  theme: Joi.string().valid(...THEMES),
});
