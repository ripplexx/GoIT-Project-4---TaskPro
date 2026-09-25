
/* K2 Gizemnur */
import { Link, Navigate, useParams } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from './AuthPage.module.css';

const AUTH_MODES = new Set(['login', 'register']);

export default function AuthPage() {
  const { mode } = useParams();

  if (!AUTH_MODES.has(mode)) {
    return <Navigate to="/auth/login" replace />;
  }

  const isLogin = mode === 'login';

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.kicker}></p>
          <h1 className={styles.title}></h1>
          <p className={styles.description}>
           
             
          </p>
        </div>

        <div className={styles.tabs} aria-label="Authentication mode">
          <Link to="/auth/register" className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`}>
            Registration
          </Link>
          <Link to="/auth/login" className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`}>
            Log In
          </Link>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </main>
  );
}
