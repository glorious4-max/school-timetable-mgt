import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats`);
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading statistics...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.statsGrid}>
              <StatCard
                title="Teachers"
                value={stats?.teacher_count || 0}
              />
              <StatCard
                title="Classes"
                value={stats?.class_count || 0}
              />
              <StatCard
                title="Unique Subjects"
                value={stats?.subject_count || 0}
              />
              <StatCard
                title="Schedule Entries"
                value={stats?.schedule_count || 0}
              />
            </div>

            <div className={styles.navigation}>
              <Link to="/teachers" className={styles.navCard}>
                <div className={styles.navIcon}>👩‍🏫</div>
                <div className={styles.navContent}>
                  <h3 className={styles.navTitle}>Manage Teachers</h3>
                  <p className={styles.navDescription}>
                    View and manage teacher profiles and schedules
                  </p>
                </div>
              </Link>

              <Link to="/classes" className={styles.navCard}>
                <div className={styles.navIcon}>🏫</div>
                <div className={styles.navContent}>
                  <h3 className={styles.navTitle}>Manage Classes</h3>
                  <p className={styles.navDescription}>
                    View class schedules and assignments
                  </p>
                </div>
              </Link>

              <Link to="/timetable" className={styles.navCard}>
                <div className={styles.navIcon}>📅</div>
                <div className={styles.navContent}>
                  <h3 className={styles.navTitle}>Timetable</h3>
                  <p className={styles.navDescription}>
                    Create and manage class schedules
                  </p>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}