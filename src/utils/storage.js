// localStorage işlemlerini burada tek bir yerde topladım, hem JSON.parse/stringify tekrarını
// önledim hem de bozuk/eski bir değer varsa try/catch ile uygulamayı çökertmeden null dönmesini sağladım
export const KEYS = {
  THEME: 'taskpro_theme',
};

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};
