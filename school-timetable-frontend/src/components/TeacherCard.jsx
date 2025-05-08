import { useNavigate } from 'react-router-dom';
import styles from './TeacherCard.module.css';

export default function TeacherCard({ teacher, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      onDelete(teacher.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3 className={styles.name}>{teacher.name}</h3>
        <p className={styles.email}>{teacher.email}</p>
        <p className={styles.subject}>{teacher.subject}</p>
      </div>
      <div className={styles.classCount}>
        {teacher.assigned_classes} {teacher.assigned_classes === 1 ? 'class' : 'classes'}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.viewButton}
          onClick={() => navigate(`/teachers/${teacher.id}`)}
        >
          View
        </button>
        <button
          className={styles.editButton}
          onClick={() => navigate(`/teachers/${teacher.id}/edit`)}
        >
          Edit
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}