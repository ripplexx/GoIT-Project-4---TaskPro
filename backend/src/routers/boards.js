import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createBoardSchema,
  updateBoardSchema,
  createColumnSchema,
  updateColumnSchema,
  createCardSchema,
  updateCardSchema,
  moveCardSchema,
} from '../validation/boards.js';
import {
  getBoardsController,
  getBoardController,
  createBoardController,
  updateBoardController,
  deleteBoardController,
  addColumnController,
  updateColumnController,
  deleteColumnController,
  addCardController,
  updateCardController,
  deleteCardController,
  moveCardController,
} from '../controllers/boards.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: List the current user's boards
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of boards }
 *   post:
 *     summary: Create a board
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, icon]
 *             properties:
 *               title: { type: string }
 *               icon: { type: string }
 *               background: { type: string }
 *     responses:
 *       201: { description: Created board }
 */
router.get('/', ctrlWrapper(getBoardsController));
router.post('/', validateBody(createBoardSchema), ctrlWrapper(createBoardController));

/**
 * @swagger
 * /boards/{boardId}:
 *   get:
 *     summary: Get a single board
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Board }
 *       404: { description: Board not found }
 *   patch:
 *     summary: Update a board
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated board }
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Deleted }
 */
router.get('/:boardId', ctrlWrapper(getBoardController));
router.patch('/:boardId', validateBody(updateBoardSchema), ctrlWrapper(updateBoardController));
router.delete('/:boardId', ctrlWrapper(deleteBoardController));

/**
 * @swagger
 * /boards/{boardId}/columns:
 *   post:
 *     summary: Add a column to a board
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created column }
 */
router.post(
  '/:boardId/columns',
  validateBody(createColumnSchema),
  ctrlWrapper(addColumnController),
);

/**
 * @swagger
 * /boards/{boardId}/columns/{columnId}:
 *   patch:
 *     summary: Update a column
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated column }
 *   delete:
 *     summary: Delete a column
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Deleted }
 */
router.patch(
  '/:boardId/columns/:columnId',
  validateBody(updateColumnSchema),
  ctrlWrapper(updateColumnController),
);
router.delete('/:boardId/columns/:columnId', ctrlWrapper(deleteColumnController));

/**
 * @swagger
 * /boards/{boardId}/columns/{columnId}/cards:
 *   post:
 *     summary: Add a card to a column
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created card }
 */
router.post(
  '/:boardId/columns/:columnId/cards',
  validateBody(createCardSchema),
  ctrlWrapper(addCardController),
);

/**
 * @swagger
 * /boards/{boardId}/columns/{columnId}/cards/{cardId}:
 *   patch:
 *     summary: Update a card
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Updated card }
 *   delete:
 *     summary: Delete a card
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Deleted }
 */
router.patch(
  '/:boardId/columns/:columnId/cards/:cardId',
  validateBody(updateCardSchema),
  ctrlWrapper(updateCardController),
);
router.delete(
  '/:boardId/columns/:columnId/cards/:cardId',
  ctrlWrapper(deleteCardController),
);

/**
 * @swagger
 * /boards/{boardId}/move-card:
 *   patch:
 *     summary: Move a card between columns (or reorder within one)
 *     tags: [Boards]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromColumnId, toColumnId, cardId, toIndex]
 *             properties:
 *               fromColumnId: { type: string }
 *               toColumnId: { type: string }
 *               cardId: { type: string }
 *               toIndex: { type: integer }
 *     responses:
 *       200: { description: Updated board }
 */
router.patch(
  '/:boardId/move-card',
  validateBody(moveCardSchema),
  ctrlWrapper(moveCardController),
);

export default router;
