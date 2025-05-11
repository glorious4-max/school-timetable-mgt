import { useNavigate } from 'react-router-dom';
import styles from './TimetableEntryCard.module.css';

export default function TimetableEntryCard({ entry, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this schedule entry?')) {
      onDelete(entry.id);
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.timeInfo}>
        <div className={styles.time}>
          {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
        </div>
      </div>
      <div className={styles.mainInfo}>
        <div className={styles.subject}>{entry.subject}</div>
        <div className={styles.teacher}>{entry.teacher_name}</div>
        <div className={styles.class}>
          Class {entry.class_name} (Grade {entry.grade})
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.editButton}
          onClick={() => navigate(`/timetable/${entry.id}/edit`)}
          title="Edit schedule entry"
        >
          Edit
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Delete schedule entry"
        >
          Delete
        </button>
      </div>
    </div>
  );
}