import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ClassForm.module.css';

export default function ClassForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    grade: ''
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchClassData();
    }
  }, [id]);

  const fetchClassData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/classes/${id}`);
      const { name, grade } = response.data;
      setFormData({ name, grade: grade.toString() });
      setError(null);
    } catch (err) {
      setError('Failed to load class data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        grade: parseInt(formData.grade, 10)
      };

      const url = id 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/classes/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/classes`;
      
      const method = id ? 'put' : 'post';
      await axios[method](url, dataToSubmit);
      
      navigate('/classes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save class. Please check your input and try again.');
    } finally {
      setLoading(false);
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
              {id ? 'Edit Class' : 'Add New Class'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Class Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., SOD"
                maxLength={50}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="grade" className={styles.label}>
                Grade
              </label>
              <input
                type="number"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 3"
                min="1"
                max="12"
                required
              />
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : (id ? 'Update Class' : 'Add Class')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}