import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './TeacherForm.module.css';

export default function TeacherForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: ''
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchTeacher();
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`);
      const { name, email, subject } = response.data;
      setFormData({ name, email, subject });
      setError(null);
    } catch (err) {
      setError('Failed to load teacher information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/teachers/${id}`,
          formData
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/teachers`,
          formData
        );
      }
      navigate('/teachers');
    } catch (err) {
      setError('Failed to save teacher. Please try again.');
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
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isEditMode ? 'Edit Teacher' : 'Add New Teacher'}
            </h1>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => navigate('/teachers')}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                {isEditMode ? 'Save Changes' : 'Add Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}