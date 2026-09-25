import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BoardProvider } from './context/BoardContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provider sırası rastgele değil: BoardProvider içeride useAuth() çağırıyor, o yüzden AuthProvider'ın altında olmak zorunda */}
    <AuthProvider>
      <BoardProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </BoardProvider>
    </AuthProvider>
  </React.StrictMode>
);
