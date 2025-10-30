import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ActivityTracker from '../components/ActivityTracker';
import { activityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if profile is complete
    if (!user?.profile?.weight) {
      navigate('/profile-setup');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      // Get today's activities
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [activitiesRes, statsRes] = await Promise.all([
        activityAPI.getActivities(today.toISOString(), tomorrow.toISOString()),
        activityAPI.getStats(today.toISOString(), tomorrow.toISOString()),
      ]);

      setRecentActivities(activitiesRes.data.activities || []);
      setTodayStats(statsRes.data.stats[0] || null);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.email}!</p>

        <div className="dashboard-grid">
          <div className="dashboard-card stats-card">
            <h2>Today's Summary</h2>
            {loading ? (
              <p>Loading...</p>
            ) : todayStats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{Math.round(todayStats.totalCalories)}</div>
                  <div className="stat-label">Calories Burned</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{formatDuration(todayStats.totalDuration)}</div>
                  <div className="stat-label">Total Duration</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{todayStats.activityCount}</div>
                  <div className="stat-label">Activities</div>
                </div>
              </div>
            ) : (
              <p className="no-data">No activities tracked today</p>
            )}
          </div>

          <ActivityTracker onActivitySaved={loadData} />
        </div>

        <div className="recent-activities">
          <h2>Today's Activities</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentActivities.length > 0 ? (
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-info">
                    <div className="activity-type">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </div>
                    <div className="activity-details">
                      <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
                      <span>{formatDuration(activity.duration)}</span>
                      {activity.distance && <span>{activity.distance} km</span>}
                    </div>
                  </div>
                  <div className="activity-calories">
                    <span className="calories-value">{Math.round(activity.caloriesBurned)}</span>
                    <span className="calories-label">calories</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No activities yet. Start tracking!</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
