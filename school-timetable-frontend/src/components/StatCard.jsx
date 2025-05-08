import styles from './StatCard.module.css';

export default function StatCard({ title, value }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.value}>{value}</div>
    </div>
  );
}