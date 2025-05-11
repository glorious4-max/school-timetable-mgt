import { useNavigate } from 'react-router-dom';
import styles from './ClassCard.module.css';

export default function ClassCard({ classItem, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    const message = `Are you sure you want to delete Class ${classItem.name}?\n\nNote: This action cannot be performed if the class has existing schedule entries.`;
    if (window.confirm(message)) {
      onDelete(classItem.id);
    }
  };

  const formatClassName = (name, grade) => {
    return `${name} (Grade ${grade})`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3 className={styles.name}>{formatClassName(classItem.name, classItem.grade)}</h3>
      </div>
      <div className={styles.subjects}>
        {classItem.total_subjects || 0} {classItem.total_subjects === 1 ? 'subject' : 'subjects'}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.viewButton}
          onClick={() => navigate(`/classes/${classItem.id}`)}
          title="View class details and schedule"
        >
          View
        </button>
        <button
          className={styles.editButton}
          onClick={() => navigate(`/classes/${classItem.id}/edit`)}
          title="Edit class information"
        >
          Edit
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          title="Delete class (only possible if no schedules exist)"
        >
          Delete
        </button>
      </div>
    </div>
  );
}