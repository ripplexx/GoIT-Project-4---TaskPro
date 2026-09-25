/* K2 Gizemnur */
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';
import avatarImg from '../../assets/welcome-avatar.png';
import avatarImg2x from '../../assets/welcome-avatar@2x.png';

export default function WelcomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <img
          src={avatarImg}
          srcSet={`${avatarImg} 1x, ${avatarImg2x} 2x`}
          alt="User Avatar"
          className={styles.avatar}
        />
        
        <div className={styles.logoWrapper}>
          <img src="/favicon.svg" width="40" height="40" alt="" aria-hidden="true" />
          <h1 className={styles.logo}>Task Pro</h1>
        </div>
        
        <p className={styles.tagline}>
          Supercharge your productivity and take control of your tasks with Task Pro - Don't wait, start achieving your goals now!
        </p>

        <div className={styles.actions}>
          <Link to="/auth/register" className={styles.btnPrimary}>
            Registration
          </Link>
          <Link to="/auth/login" className={styles.btnLink}>
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}