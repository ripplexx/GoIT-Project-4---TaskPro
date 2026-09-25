import { Schema, model } from 'mongoose';
import { PRIORITIES, BOARD_ICONS, BOARD_BACKGROUNDS } from '../../constants/index.js';

const idTransform = {
  virtuals: false,
  versionKey: false,
  transform: (_doc, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    return obj;
  },
};

const cardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: null, maxlength: 1000 },
    priority: { type: String, enum: PRIORITIES, default: 'without' },
    deadline: { type: String, default: null },
  },
  { timestamps: true, toJSON: idTransform },
);

const columnSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    cards: { type: [cardSchema], default: [] },
  },
  { timestamps: true, toJSON: idTransform },
);

const boardSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    icon: { type: String, enum: BOARD_ICONS, required: true },
    background: { type: String, enum: BOARD_BACKGROUNDS, default: '' },
    columns: { type: [columnSchema], default: [] },
  },
  { timestamps: true, toJSON: idTransform },
);

export const BoardsCollection = model('boards', boardSchema);
