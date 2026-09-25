import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  uploadAvatar,
  getCurrentUser,
} from '../api/auth.api';

// Redux yerine Context kullanıyoruz, çünkü proje tek bir auth + board + theme state'i etrafında
// dönüyor ve bunlar için ayrı bir store/slice/dispatch katmanı kurmak gereksiz karmaşıklık olurdu
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // isRefreshing'i true başlatıyorum çünkü sayfa ilk açıldığında localStorage'dan
  // oturum bilgisini okuyana kadar kullanıcıyı yanlışlıkla "giriş yapmamış" sayıp
  // /welcome'a atmak istemiyorum
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState(null);

  // Uygulama her açıldığında (sayfa yenilenince) mock storage'da kayıtlı kullanıcı var mı diye bakıyorum
  useEffect(() => {
    getCurrentUser()
      .then(current => {
        setUser(current);
        setIsLoggedIn(!!current);
      })
      .finally(() => setIsRefreshing(false));
  }, []);

  // login/register/logout/updateProfile fonksiyonlarını useCallback'e aldım,
  // yoksa her render'da yeniden oluşup bunlara bağımlı useEffect'leri (örn. BoardContext) gereksiz tetikliyordu
  const login = useCallback(async credentials => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginUser(credentials);
      setUser(result);
      setIsLoggedIn(true);
      return result;
    } catch (err) {
      // Hata mesajını burada saklıyorum ki AuthPage hem context hatasını hem kendi local hatasını gösterebilsin
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async data => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerUser(data);
      setUser(result);
      setIsLoggedIn(true);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateProfile = useCallback(async data => {
    const result = await updateUserProfile(data);
    setUser(result);
    return result;
  }, []);

  const updateAvatar = useCallback(async file => {
    const result = await uploadAvatar(file);
    setUser(result);
    return result;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, isRefreshing, error, login, register, logout, updateProfile, updateAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  // Provider dışında kullanılırsa sessizce undefined dönmek yerine hemen hata fırlatıyorum,
  // çünkü bu hatayı geç fark etmek (örn. user.name patlaması) daha kafa karıştırıcı oluyor
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
