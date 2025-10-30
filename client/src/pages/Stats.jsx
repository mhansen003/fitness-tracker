import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { activityAPI } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Stats.css';

const COLORS = {
  sitting: '#94a3b8',
  standing: '#60a5fa',
  walking: '#34d399',
  running: '#f97316',
};

export default function Stats() {
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState([]);
  const [activityBreakdown, setActivityBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();

      if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeRange === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const response = await activityAPI.getStats(
        startDate.toISOString(),
        endDate.toISOString(),
        'day'
      );

      setStats(response.data.stats || []);
      setActivityBreakdown(response.data.activityBreakdown || []);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = stats.map((stat) => ({
    date: formatDate(stat._id),
    calories: Math.round(stat.totalCalories),
    duration: Math.round(stat.totalDuration),
  }));

  const pieData = activityBreakdown.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: Math.round(item.totalCalories),
    color: COLORS[item._id] || '#667eea',
  }));

  const totalCalories = stats.reduce((sum, stat) => sum + stat.totalCalories, 0);
  const totalDuration = stats.reduce((sum, stat) => sum + stat.totalDuration, 0);
  const totalActivities = stats.reduce((sum, stat) => sum + stat.activityCount, 0);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Layout>
      <div className="stats-page">
        <div className="stats-header">
          <div>
            <h1>Statistics</h1>
            <p>Track your progress over time</p>
          </div>

          <div className="time-range-selector">
            <button
              className={timeRange === 'week' ? 'active' : ''}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              className={timeRange === 'month' ? 'active' : ''}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              className={timeRange === 'year' ? 'active' : ''}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : stats.length > 0 ? (
          <>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-value">{Math.round(totalCalories)}</div>
                <div className="summary-label">Total Calories Burned</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{formatDuration(totalDuration)}</div>
                <div className="summary-label">Total Duration</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{totalActivities}</div>
                <div className="summary-label">Total Activities</div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-card">
                <h2>Calories Burned Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="#667eea"
                      strokeWidth={2}
                      name="Calories"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h2>Activity Duration Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="duration" fill="#764ba2" name="Duration (minutes)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h2>Calories by Activity Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data-message">
            <p>No data available for the selected time range</p>
            <p>Start tracking activities to see your statistics!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
