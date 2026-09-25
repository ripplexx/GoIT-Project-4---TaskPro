import createHttpError from 'http-errors';
import { updateMe, updateAvatar } from '../services/users.js';

export async function getMeController(req, res) {
  res.json({ status: 200, message: 'Current user', data: req.user });
}

export async function updateMeController(req, res) {
  const user = await updateMe(req.user._id, req.body);
  res.json({ status: 200, message: 'Profile updated', data: user });
}

export async function patchAvatarController(req, res) {
  if (!req.file) {
    throw createHttpError(400, 'No avatar file provided.');
  }
  const user = await updateAvatar(req.user._id, req.file.path);
  res.json({ status: 200, message: 'Avatar updated', data: user });
}
