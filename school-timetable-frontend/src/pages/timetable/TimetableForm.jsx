import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './TimetableForm.module.css';

export default function TimetableForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    class_id: '',
    teacher_id: '',
    day_of_week: '1',
    start_time: '08:00',
    end_time: '09:00'
  });

  useEffect(() => {
    Promise.all([
      fetchTeachers(),
      fetchClasses(),
      id ? fetchTimetableEntry() : Promise.resolve()
    ]).finally(() => setLoading(false));
  }, [id]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/teachers`);
      setTeachers(response.data);
    } catch (err) {
      setError('Failed to load teachers. Please try again later.');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes`);
      setClasses(response.data);
    } catch (err) {
      setError('Failed to load classes. Please try again later.');
    }
  };

  const fetchTimetableEntry = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/timetable/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load timetable entry. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/timetable/${id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/timetable`, formData);
      }
      navigate('/timetable');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save timetable entry. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {id ? 'Edit Schedule Entry' : 'Add Schedule Entry'}
          </h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="class_id" className={styles.label}>
              Class
            </label>
            <select
              id="class_id"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select a class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} (Grade {cls.grade})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="teacher_id" className={styles.label}>
              Teacher
            </label>
            <select
              id="teacher_id"
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Select a teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.subject})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="day_of_week" className={styles.label}>
              Day of Week
            </label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
            </select>
          </div>

          <div className={styles.timeGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="start_time" className={styles.label}>
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="end_time" className={styles.label}>
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate('/timetable')}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {id ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}