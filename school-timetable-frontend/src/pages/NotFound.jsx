import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Page not found</p>
      <Link to="/dashboard" className={styles.button}>
        Return to Dashboard
      </Link>
    </div>
  );
}