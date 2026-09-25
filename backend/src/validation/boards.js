import Joi from 'joi';
import { PRIORITIES, BOARD_ICONS, BOARD_BACKGROUNDS } from '../constants/index.js';

export const createBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  icon: Joi.string()
    .valid(...BOARD_ICONS)
    .required(),
  background: Joi.string()
    .valid(...BOARD_BACKGROUNDS)
    .default(''),
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100),
  icon: Joi.string().valid(...BOARD_ICONS),
  background: Joi.string().valid(...BOARD_BACKGROUNDS),
});

export const createColumnSchema = Joi.object({
  title: Joi.string().trim().min(1).max(80).required(),
});

export const updateColumnSchema = Joi.object({
  title: Joi.string().trim().min(1).max(80).required(),
});

export const createCardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).allow(null, '').default(null),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .default('without'),
  deadline: Joi.string().allow(null),
});

export const updateCardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(1000).allow(null, ''),
  priority: Joi.string().valid(...PRIORITIES),
  deadline: Joi.string().allow(null),
});

export const moveCardSchema = Joi.object({
  fromColumnId: Joi.string().required(),
  toColumnId: Joi.string().required(),
  cardId: Joi.string().required(),
  toIndex: Joi.number().integer().min(0).required(),
});
