/**
 * MET (Metabolic Equivalent of Task) values for different activities
 * Reference: Compendium of Physical Activities
 */
const MET_VALUES = {
  sitting: 1.3,
  standing: 1.8,
  walking: 3.5,  // ~3 mph
  'running-slow': 8.0,  // ~5 mph
  'running-medium': 9.8,  // ~6 mph
  'running-fast': 11.0,  // ~7 mph
  'running-very-fast': 12.5  // ~8 mph
};

/**
 * Calculate calories burned using the MET formula
 * Formula: Calories/minute = (MET × 3.5 × Weight in kg) / 200
 *
 * @param {number} metValue - MET value for the activity
 * @param {number} weightKg - User's weight in kilograms
 * @param {number} durationMinutes - Duration of activity in minutes
 * @returns {number} Calories burned (rounded to 2 decimal places)
 */
function calculateCalories(metValue, weightKg, durationMinutes) {
  const caloriesPerMinute = (metValue * 3.5 * weightKg) / 200;
  const totalCalories = caloriesPerMinute * durationMinutes;
  return Math.round(totalCalories * 100) / 100;
}

/**
 * Get MET value for an activity type
 * For running, calculates based on speed (distance/duration)
 *
 * @param {string} activityType - Type of activity
 * @param {number} distance - Distance in km (optional, for running)
 * @param {number} duration - Duration in minutes (optional, for running)
 * @returns {number} MET value
 */
function getMETValue(activityType, distance = null, duration = null) {
  if (activityType === 'running' && distance && duration) {
    // Calculate speed in mph
    const speedKmh = (distance / duration) * 60;
    const speedMph = speedKmh * 0.621371;

    // Determine MET based on speed
    if (speedMph < 5.5) return MET_VALUES['running-slow'];
    if (speedMph < 6.5) return MET_VALUES['running-medium'];
    if (speedMph < 7.5) return MET_VALUES['running-fast'];
    return MET_VALUES['running-very-fast'];
  }

  return MET_VALUES[activityType] || MET_VALUES.sitting;
}

/**
 * Calculate calories for an activity
 *
 * @param {Object} params - Activity parameters
 * @param {string} params.activityType - Type of activity
 * @param {number} params.weightKg - User's weight in kg
 * @param {number} params.durationMinutes - Duration in minutes
 * @param {number} params.distance - Distance in km (optional, for running)
 * @returns {Object} { caloriesBurned, metValue }
 */
function calculateActivityCalories({ activityType, weightKg, durationMinutes, distance = null }) {
  const metValue = getMETValue(activityType, distance, durationMinutes);
  const caloriesBurned = calculateCalories(metValue, weightKg, durationMinutes);

  return {
    caloriesBurned,
    metValue
  };
}

module.exports = {
  MET_VALUES,
  calculateCalories,
  getMETValue,
  calculateActivityCalories
};
