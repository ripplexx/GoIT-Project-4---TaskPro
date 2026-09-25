/**
 * Board API layer — gerçek backend'e bağlanıyor.
 * BoardContext'in çağırdığı fonksiyon imzaları mock dönemiyle birebir aynı.
 */
import { api } from './client';

export const getBoards = () => api.get('/boards');
export const createBoard = (data) => api.post('/boards', data);
export const updateBoard = (boardId, data) => api.patch(`/boards/${boardId}`, data);
export const deleteBoard = (boardId) => api.delete(`/boards/${boardId}`);

export const addColumn = (boardId, data) => api.post(`/boards/${boardId}/columns`, data);
export const updateColumn = (boardId, columnId, data) =>
  api.patch(`/boards/${boardId}/columns/${columnId}`, data);
export const deleteColumn = (boardId, columnId) =>
  api.delete(`/boards/${boardId}/columns/${columnId}`);

export const addCard = (boardId, columnId, data) =>
  api.post(`/boards/${boardId}/columns/${columnId}/cards`, data);
export const updateCard = (boardId, columnId, cardId, data) =>
  api.patch(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data);
export const deleteCard = (boardId, columnId, cardId) =>
  api.delete(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`);
export const moveCard = (boardId, moveData) =>
  api.patch(`/boards/${boardId}/move-card`, moveData);
