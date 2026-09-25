import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { helpSchema } from '../validation/help.js';
import { sendHelpController } from '../controllers/help.js';

const router = Router();

/**
 * @swagger
 * /help:
 *   post:
 *     summary: Send a support/help request
 *     tags: [Help]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, comment]
 *             properties:
 *               email: { type: string }
 *               comment: { type: string }
 *     responses:
 *       200: { description: Request received }
 */
router.post('/', validateBody(helpSchema), ctrlWrapper(sendHelpController));

export default router;
