import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherCard from '../../components/TeacherCard';
import styles from './TeacherList.module.css';

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`);
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load teachers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`);
      // Refresh the list after successful deletion
      fetchTeachers();
    } catch (err) {
      setError('Failed to delete teacher. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading teachers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Teachers</h1>
          <button
            className={styles.addButton}
            onClick={() => navigate('/teachers/new')}
          >
            Add Teacher
          </button>
        </div>

        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.grid}>
            {teachers.map(teacher => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onDelete={handleDelete}
              />
            ))}
            {teachers.length === 0 && (
              <div className={styles.error}>No teachers found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}