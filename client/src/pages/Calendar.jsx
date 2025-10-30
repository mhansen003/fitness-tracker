import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { activityAPI } from '../services/api';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [selectedDateActivities, setSelectedDateActivities] = useState([]);
  const [activityDates, setActivityDates] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthActivities();
  }, [date]);

  const loadMonthActivities = async () => {
    setLoading(true);
    try {
      // Get activities for the current month
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const response = await activityAPI.getActivities(
        startOfMonth.toISOString(),
        endOfMonth.toISOString()
      );

      const acts = response.data.activities || [];
      setActivities(acts);

      // Create set of dates that have activities
      const dates = new Set();
      acts.forEach((activity) => {
        const actDate = new Date(activity.startTime);
        dates.add(actDate.toDateString());
      });
      setActivityDates(dates);

      // Load activities for selected date
      filterActivitiesByDate(date, acts);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivitiesByDate = (selectedDate, allActivities = activities) => {
    const filtered = allActivities.filter((activity) => {
      const actDate = new Date(activity.startTime);
      return actDate.toDateString() === selectedDate.toDateString();
    });
    setSelectedDateActivities(filtered);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    filterActivitiesByDate(newDate);
  };

  const tileClassName = ({ date: tileDate, view }) => {
    if (view === 'month') {
      if (activityDates.has(tileDate.toDateString())) {
        return 'has-activity';
      }
    }
    return null;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalCalories = selectedDateActivities.reduce(
    (sum, act) => sum + act.caloriesBurned,
    0
  );

  return (
    <Layout>
      <div className="calendar-page">
        <h1>Activity Calendar</h1>
        <p>View your activities by date</p>

        <div className="calendar-container">
          <div className="calendar-wrapper">
            <ReactCalendar
              onChange={handleDateChange}
              value={date}
              tileClassName={tileClassName}
            />
          </div>

          <div className="selected-date-activities">
            <h2>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>

            {loading ? (
              <p>Loading...</p>
            ) : selectedDateActivities.length > 0 ? (
              <>
                <div className="date-summary">
                  <div className="summary-stat">
                    <span className="summary-value">{Math.round(totalCalories)}</span>
                    <span className="summary-label">Total Calories</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-value">{selectedDateActivities.length}</span>
                    <span className="summary-label">Activities</span>
                  </div>
                </div>

                <div className="activity-list">
                  {selectedDateActivities.map((activity) => (
                    <div key={activity._id} className="activity-item">
                      <div className="activity-header">
                        <span className="activity-type">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </span>
                        <span className="activity-time">
                          {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                        </span>
                      </div>
                      <div className="activity-stats">
                        <span>Duration: {formatDuration(activity.duration)}</span>
                        {activity.distance && <span>Distance: {activity.distance} km</span>}
                        <span>Calories: {Math.round(activity.caloriesBurned)}</span>
                      </div>
                      {activity.notes && (
                        <div className="activity-notes">{activity.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="no-data">No activities on this date</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
