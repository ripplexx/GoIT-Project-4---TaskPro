import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { BoardsCollection } from '../db/models/board.js';

async function findOwnedBoard(ownerId, boardId) {
  if (!mongoose.isValidObjectId(boardId)) {
    throw createHttpError(404, 'Board not found');
  }

  const board = await BoardsCollection.findOne({ _id: boardId, owner: ownerId });
  if (!board) {
    throw createHttpError(404, 'Board not found');
  }
  return board;
}

function findColumn(board, columnId) {
  const column = board.columns.id(columnId);
  if (!column) {
    throw createHttpError(404, 'Column not found');
  }
  return column;
}

function findCard(column, cardId) {
  const card = column.cards.id(cardId);
  if (!card) {
    throw createHttpError(404, 'Card not found');
  }
  return card;
}

export async function getBoards(ownerId) {
  return BoardsCollection.find({ owner: ownerId }).sort({ createdAt: 1 });
}

export async function getBoard(ownerId, boardId) {
  return findOwnedBoard(ownerId, boardId);
}

export async function createBoard(ownerId, { title, icon, background }) {
  return BoardsCollection.create({ owner: ownerId, title, icon, background });
}

export async function updateBoard(ownerId, boardId, data) {
  const board = await findOwnedBoard(ownerId, boardId);
  Object.assign(board, data);
  await board.save();
  return board;
}

export async function deleteBoard(ownerId, boardId) {
  const board = await findOwnedBoard(ownerId, boardId);
  await board.deleteOne();
}

export async function addColumn(ownerId, boardId, { title }) {
  const board = await findOwnedBoard(ownerId, boardId);
  board.columns.push({ title });
  await board.save();
  return board.columns[board.columns.length - 1];
}

export async function updateColumn(ownerId, boardId, columnId, { title }) {
  const board = await findOwnedBoard(ownerId, boardId);
  const column = findColumn(board, columnId);
  column.title = title;
  await board.save();
  return column;
}

export async function deleteColumn(ownerId, boardId, columnId) {
  const board = await findOwnedBoard(ownerId, boardId);
  findColumn(board, columnId).deleteOne();
  await board.save();
}

export async function addCard(ownerId, boardId, columnId, cardData) {
  const board = await findOwnedBoard(ownerId, boardId);
  const column = findColumn(board, columnId);
  column.cards.push(cardData);
  await board.save();
  return column.cards[column.cards.length - 1];
}

export async function updateCard(ownerId, boardId, columnId, cardId, data) {
  const board = await findOwnedBoard(ownerId, boardId);
  const column = findColumn(board, columnId);
  const card = findCard(column, cardId);
  Object.assign(card, data);
  await board.save();
  return card;
}

export async function deleteCard(ownerId, boardId, columnId, cardId) {
  const board = await findOwnedBoard(ownerId, boardId);
  const column = findColumn(board, columnId);
  findCard(column, cardId).deleteOne();
  await board.save();
}

export async function moveCard(ownerId, boardId, { fromColumnId, toColumnId, cardId, toIndex }) {
  const board = await findOwnedBoard(ownerId, boardId);
  const fromColumn = findColumn(board, fromColumnId);
  const toColumn = findColumn(board, toColumnId);
  const card = findCard(fromColumn, cardId);

  const cardData = card.toObject();
  card.deleteOne();
  toColumn.cards.splice(toIndex, 0, cardData);

  await board.save();
  return board;
}
