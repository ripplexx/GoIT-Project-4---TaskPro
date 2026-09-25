import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from '../controllers/auth.js';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: User registered, session created }
 *       409: { description: Email already in use }
 */
router.post('/register', authLimiter, validateBody(registerSchema), ctrlWrapper(registerController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in, session created }
 *       401: { description: Invalid email or password }
 */
router.post('/login', authLimiter, validateBody(loginSchema), ctrlWrapper(loginController));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current session
 *     tags: [Auth]
 *     responses:
 *       204: { description: Logged out }
 */
router.post('/logout', ctrlWrapper(logoutController));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rotate the access/refresh token pair using the session cookies
 *     tags: [Auth]
 *     responses:
 *       200: { description: New access token issued }
 *       401: { description: Session not found or expired }
 */
router.post('/refresh', ctrlWrapper(refreshController));

export default router;
