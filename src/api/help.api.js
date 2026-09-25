/**
 * Help API layer — gerçek backend'e bağlanıyor.
 */
import { api } from './client';

export const sendHelpRequest = (data) => api.post('/help', data);
