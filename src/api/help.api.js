
import { api } from './client';

export const sendHelpRequest = (data) => api.post('/help', data);
