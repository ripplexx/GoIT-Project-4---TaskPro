import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.text}>This page doesn&apos;t exist.</p>
        <Link to="/" className={styles.link}>Back to TaskPro</Link>
      </div>
    </main>
  );
}
