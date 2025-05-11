import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ClassList.module.css';

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes`);
      setClasses(response.data);
      setError(null);
      setDeleteError(null);
    } catch (err) {
      setError('Failed to load classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteError(null);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/classes/${id}`);
      fetchClasses();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete class. Please try again.';
      setDeleteError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading classes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Classes</h1>
          <button
            className={styles.addButton}
            onClick={() => navigate('/classes/new')}
          >
            Add Class
          </button>
        </div>

        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            {deleteError && <div className={styles.error}>{deleteError}</div>}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Grade</th>
                    <th>Total Subjects</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(classItem => (
                    <tr key={classItem.id}>
                      <td>{classItem.name}</td>
                      <td>{classItem.grade}</td>
                      <td>{classItem.total_subjects || 0}</td>
                      <td className={styles.actions}>
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
                          onClick={() => {
                            const message = `Are you sure you want to delete Class ${classItem.name}?\n\nNote: This action cannot be performed if the class has existing schedule entries.`;
                            if (window.confirm(message)) {
                              handleDelete(classItem.id);
                            }
                          }}
                          title="Delete class (only possible if no schedules exist)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {classes.length === 0 && (
                    <tr>
                      <td colSpan="4" className={styles.emptyState}>
                        No classes found. Click "Add Class" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}