import { createContext, useContext, useEffect, useState } from 'react';
import { storage, KEYS } from '../utils/storage';
import { useAuth } from './AuthContext';

// İzin verilen temaları sabit bir listede tutuyorum, çünkü localStorage'dan okunan
// değer elle bozulmuş/eski bir değer olabilir, geçersizse sessizce 'dark'a düşmesini istiyorum
const VALID_THEMES = ['dark', 'light', 'violet'];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user, isLoggedIn, updateProfile } = useAuth();

  const [theme, setThemeState] = useState(() => {
    const saved = storage.get(KEYS.THEME);
    return VALID_THEMES.includes(saved) ? saved : 'dark';
  });

  // data-theme attribute'unu burada, tek bir yerde set ediyorum; eskiden hem App.jsx'te
  // hem Redux slice içinde set ediliyordu, bu da gereksiz tekrara yol açıyordu
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Giriş yapınca temanın tek doğru kaynağı backend olsun ki kullanıcı başka bir
  // cihazda seçtiği temayı da görsün; localStorage sadece misafir/offline önbelleği
  useEffect(() => {
    if (isLoggedIn && user?.theme && VALID_THEMES.includes(user.theme)) {
      storage.set(KEYS.THEME, user.theme);
      setThemeState(user.theme);
    }
  }, [isLoggedIn, user?.theme]);

  function setTheme(next) {
    if (!VALID_THEMES.includes(next)) return;
    // Tema seçimini localStorage'a yazıyorum ki sayfa yenilendiğinde kullanıcı tekrar seçmek zorunda kalmasın
    storage.set(KEYS.THEME, next);
    setThemeState(next);
    if (isLoggedIn) {
      // Sessizce yutuyorum: tema kaydı başarısız olsa bile kullanıcı arayüzde
      // seçimini görmeye devam etmeli, bir sonraki girişte tekrar denenir
      updateProfile({ theme: next }).catch(() => {});
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
