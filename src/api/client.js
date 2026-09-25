const BASE_URL = import.meta.env.VITE_API_URL || '/api';

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const json = await res.json();
        setAccessToken(json.data.accessToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, { method = 'GET', body, isFormData = false, skipAuthRetry = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    // FormData için Content-Type'ı tarayıcı boundary'siyle birlikte kendi set etmeli,
    // o yüzden burada stringify etmeden olduğu gibi gönderiyoruz
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !skipAuthRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(path, { method, body, isFormData, skipAuthRetry: true });
    }
  }

  const payload = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    // Joi validasyon hatalarında backend errors[] dizisinde alana özel mesaj döner;
    // genel "Validation failed" yerine bunu göstermek teşhisi kolaylaştırıyor
    const detail = payload?.errors?.[0];
    throw new Error(detail || payload?.message || `Request failed with status ${res.status}`);
  }

  return payload?.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => request(path, { method: 'PATCH', body: formData, isFormData: true }),
  refreshAccessToken,
};
