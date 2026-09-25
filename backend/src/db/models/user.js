import { Schema, model } from 'mongoose';
import { THEMES } from '../../constants/index.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 32 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    theme: { type: String, enum: THEMES, default: 'dark' },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', userSchema);
