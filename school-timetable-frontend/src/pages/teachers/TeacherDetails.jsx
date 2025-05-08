import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './TeacherDetails.module.css';

export default function TeacherDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`);
      setTeacher(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load teacher details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading teacher details...</div>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.error}>{error || 'Teacher not found'}</div>
          <button
            onClick={() => navigate('/teachers')}
            className={styles.backButton}
          >
            Back to Teachers
          </button>
        </div>
      </div>
    );
  }

  const getDayName = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber - 1] || 'Unknown';
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Teacher Details</h1>
          <button
            onClick={() => navigate('/teachers')}
            className={styles.backButton}
          >
            Back to Teachers
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{teacher.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{teacher.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Subject</span>
              <span className={styles.value}>{teacher.subject}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Assigned Classes</span>
              <span className={styles.value}>{teacher.assigned_classes}</span>
            </div>
          </div>

          <div>
            <h2 className={styles.scheduleTitle}>Class Schedule</h2>
            {teacher.schedule?.length > 0 ? (
              <div className={styles.scheduleGrid}>
                {teacher.schedule.map((entry, index) => (
                  <div key={index} className={styles.scheduleItem}>
                    <div className={styles.dayTime}>
                      {getDayName(entry.day_of_week)}
                    </div>
                    <div className={styles.dayTime}>
                      {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                    </div>
                    <div className={styles.className}>
                      {entry.class_name}
                    </div>
                    <div>{entry.subject}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.scheduleEmpty}>
                No classes scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}