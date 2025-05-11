import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ClassDetails.module.css';

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes/${id}`);
      setClassData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load class details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading class details...</div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.error}>{error || 'Class not found'}</div>
          <button
            onClick={() => navigate('/classes')}
            className={styles.backButton}
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Class Details</h1>
            <span className={styles.subtitle}>
              {`Class ${classData.name} - Grade ${classData.grade}`}
            </span>
          </div>
          <div className={styles.actions}>
            <button
              onClick={() => navigate(`/classes/${id}/edit`)}
              className={styles.editButton}
            >
              Edit Class
            </button>
            <button
              onClick={() => navigate('/classes')}
              className={styles.backButton}
            >
              Back to Classes
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <h2 className={styles.scheduleTitle}>Class Schedule</h2>
            {classData.schedule?.length > 0 ? (
              <div className={styles.scheduleGrid}>
                {classData.schedule
                  .sort((a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time))
                  .map((entry, index) => (
                    <div key={index} className={styles.scheduleItem}>
                      <div className={styles.dayTime}>
                        {getDayName(entry.day_of_week)}
                      </div>
                      <div className={styles.dayTime}>
                        {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                      </div>
                      <div className={styles.teacherName}>
                        {entry.teacher_name}
                      </div>
                      <div className={styles.subject}>{entry.subject}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className={styles.scheduleEmpty}>
                No classes scheduled. Schedule entries can be added from the Timetable section.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}