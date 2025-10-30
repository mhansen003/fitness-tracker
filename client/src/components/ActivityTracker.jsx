import { useState, useEffect, useRef } from 'react';
import { activityAPI } from '../services/api';
import './ActivityTracker.css';

export default function ActivityTracker({ onActivitySaved }) {
  const [activityType, setActivityType] = useState('sitting');
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');
  const [showDistanceInput, setShowDistanceInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    setElapsedTime(0);
    setError('');

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const handleStop = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTracking(false);

    // Show distance input for running
    if (activityType === 'running') {
      setShowDistanceInput(true);
    } else {
      await saveActivity();
    }
  };

  const saveActivity = async () => {
    if (!startTime) return;

    setLoading(true);
    setError('');

    try {
      const endTime = new Date(startTime.getTime() + elapsedTime * 1000);

      const activityData = {
        type: activityType,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: notes || undefined,
      };

      if (activityType === 'running' && distance) {
        activityData.distance = parseFloat(distance);
      }

      await activityAPI.createActivity(activityData);

      // Reset form
      setElapsedTime(0);
      setStartTime(null);
      setDistance('');
      setNotes('');
      setShowDistanceInput(false);

      if (onActivitySaved) {
        onActivitySaved();
      }

      alert('Activity saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsTracking(false);
    setElapsedTime(0);
    setStartTime(null);
    setDistance('');
    setNotes('');
    setShowDistanceInput(false);
    setError('');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="activity-tracker">
      <h2>Track Activity</h2>

      {error && <div className="error-message">{error}</div>}

      {!showDistanceInput ? (
        <>
          <div className="activity-selector">
            <label>Activity Type:</label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              disabled={isTracking}
            >
              <option value="sitting">Sitting</option>
              <option value="standing">Standing</option>
              <option value="walking">Walking</option>
              <option value="running">Running</option>
            </select>
          </div>

          <div className="stopwatch">
            <div className="time-display">{formatTime(elapsedTime)}</div>

            <div className="stopwatch-controls">
              {!isTracking ? (
                <button onClick={handleStart} className="btn-start">
                  Start
                </button>
              ) : (
                <>
                  <button onClick={handleStop} className="btn-stop">
                    Stop
                  </button>
                  <button onClick={handleCancel} className="btn-cancel">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {!isTracking && elapsedTime === 0 && (
            <div className="form-group">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your activity..."
                rows="3"
              />
            </div>
          )}
        </>
      ) : (
        <div className="distance-input-container">
          <h3>Enter Running Details</h3>
          <div className="form-group">
            <label htmlFor="distance">Distance (km)</label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance in kilometers"
              step="0.1"
              min="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your run..."
              rows="3"
            />
          </div>

          <div className="distance-buttons">
            <button
              onClick={saveActivity}
              className="btn-primary"
              disabled={loading || !distance}
            >
              {loading ? 'Saving...' : 'Save Activity'}
            </button>
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
