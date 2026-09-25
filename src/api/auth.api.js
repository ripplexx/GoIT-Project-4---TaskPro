/**
 * Auth API layer — gerçek backend'e bağlanıyor.
 * Fonksiyon imzaları AuthContext'in beklediğiyle aynı, mock dönemiyle birebir uyumlu.
 */
import { api, setAccessToken, clearAccessToken } from './client';

export async function loginUser({ email, password }) {
  const result = await api.post('/auth/login', { email, password });
  setAccessToken(result.accessToken);
  return result.user;
}

export async function registerUser({ name, email, password }) {
  const result = await api.post('/auth/register', { name, email, password });
  setAccessToken(result.accessToken);
  return result.user;
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAccessToken();
  }
}

export async function updateUserProfile(data) {
  return api.patch('/users/me', data);
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.upload('/users/me/avatar', formData);
}

// AuthContext sayfa her açıldığında bunu parametresiz çağırıp oturumun hâlâ
// geçerli olup olmadığına bakıyor; bu yüzden burası asla throw etmemeli —
// refreshToken cookie'si geçerliyse yeni bir accessToken alıp /users/me'den
// kullanıcıyı döner, geçersizse (veya hiç cookie yoksa) sessizce null döner.
export async function getCurrentUser() {
  try {
    const refreshed = await api.refreshAccessToken();
    if (!refreshed) return null;
    return await api.get('/users/me');
  } catch {
    return null;
  }
}
