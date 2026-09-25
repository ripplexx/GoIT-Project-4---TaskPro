import * as boardsService from '../services/boards.js';

export async function getBoardsController(req, res) {
  const boards = await boardsService.getBoards(req.user._id);
  res.json({ status: 200, message: 'Boards retrieved', data: boards });
}

export async function getBoardController(req, res) {
  const board = await boardsService.getBoard(req.user._id, req.params.boardId);
  res.json({ status: 200, message: 'Board retrieved', data: board });
}

export async function createBoardController(req, res) {
  const board = await boardsService.createBoard(req.user._id, req.body);
  res.status(201).json({ status: 201, message: 'Board created', data: board });
}

export async function updateBoardController(req, res) {
  const board = await boardsService.updateBoard(req.user._id, req.params.boardId, req.body);
  res.json({ status: 200, message: 'Board updated', data: board });
}

export async function deleteBoardController(req, res) {
  await boardsService.deleteBoard(req.user._id, req.params.boardId);
  res.status(204).send();
}

export async function addColumnController(req, res) {
  const column = await boardsService.addColumn(req.user._id, req.params.boardId, req.body);
  res.status(201).json({ status: 201, message: 'Column created', data: column });
}

export async function updateColumnController(req, res) {
  const column = await boardsService.updateColumn(
    req.user._id,
    req.params.boardId,
    req.params.columnId,
    req.body,
  );
  res.json({ status: 200, message: 'Column updated', data: column });
}

export async function deleteColumnController(req, res) {
  await boardsService.deleteColumn(req.user._id, req.params.boardId, req.params.columnId);
  res.status(204).send();
}

export async function addCardController(req, res) {
  const card = await boardsService.addCard(
    req.user._id,
    req.params.boardId,
    req.params.columnId,
    req.body,
  );
  res.status(201).json({ status: 201, message: 'Card created', data: card });
}

export async function updateCardController(req, res) {
  const card = await boardsService.updateCard(
    req.user._id,
    req.params.boardId,
    req.params.columnId,
    req.params.cardId,
    req.body,
  );
  res.json({ status: 200, message: 'Card updated', data: card });
}

export async function deleteCardController(req, res) {
  await boardsService.deleteCard(
    req.user._id,
    req.params.boardId,
    req.params.columnId,
    req.params.cardId,
  );
  res.status(204).send();
}

export async function moveCardController(req, res) {
  const board = await boardsService.moveCard(req.user._id, req.params.boardId, req.body);
  res.json({ status: 200, message: 'Card moved', data: board });
}
