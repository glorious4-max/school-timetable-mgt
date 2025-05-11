import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TimetableView.module.css';

export default function TimetableView() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/timetable`);
      setTimetable(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load timetable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule entry?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/timetable/${id}`);
      fetchTimetable();
    } catch (err) {
      setError('Failed to delete schedule entry. Please try again.');
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

  const groupByDay = (entries) => {
    return entries.reduce((acc, entry) => {
      const day = entry.day_of_week;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(entry);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading timetable...</div>
        </div>
      </div>
    );
  }

  const groupedTimetable = groupByDay(timetable);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>School Timetable</h1>
          <button
            className={styles.addButton}
            onClick={() => navigate('/timetable/new')}
          >
            Add Schedule Entry
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.timetableGrid}>
          {[1, 2, 3, 4, 5].map((day) => (
            <div key={day} className={styles.dayColumn}>
              <h2 className={styles.dayTitle}>{getDayName(day)}</h2>
              <div className={styles.scheduleList}>
                {groupedTimetable[day]?.map((entry) => (
                  <div key={entry.id} className={styles.scheduleCard}>
                    <div className={styles.scheduleTime}>
                      {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                    </div>
                    <div className={styles.scheduleClass}>
                      Class: {entry.class_name} (Grade {entry.grade})
                    </div>
                    <div className={styles.scheduleTeacher}>
                      Teacher: {entry.teacher_name}
                    </div>
                    <div className={styles.scheduleSubject}>
                      Subject: {entry.subject}
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => navigate(`/timetable/${entry.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(entry.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {(!groupedTimetable[day] || groupedTimetable[day].length === 0) && (
                  <div className={styles.emptyDay}>No classes scheduled</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}