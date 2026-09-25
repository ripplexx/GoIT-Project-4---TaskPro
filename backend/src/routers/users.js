import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { uploadAvatar } from '../middlewares/uploadAvatar.js';
import { updateMeSchema } from '../validation/users.js';
import {
  getMeController,
  updateMeController,
  patchAvatarController,
} from '../controllers/users.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Not authenticated }
 */
router.get('/me', ctrlWrapper(getMeController));

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update the currently authenticated user's profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               theme: { type: string, enum: [dark, light, violet] }
 *     responses:
 *       200: { description: Updated user }
 */
router.patch('/me', validateBody(updateMeSchema), ctrlWrapper(updateMeController));

/**
 * @swagger
 * /users/me/avatar:
 *   patch:
 *     summary: Upload and set the currently authenticated user's avatar
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200: { description: Updated user }
 */
router.patch('/me/avatar', uploadAvatar, ctrlWrapper(patchAvatarController));

export default router;
