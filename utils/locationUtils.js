/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  
  /**
   * Calculates the distance between two geographical points using the Haversine formula
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in meters
   */
  export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
             Math.cos(φ1) * Math.cos(φ2) *
             Math.sin(Δλ/2) * Math.sin(Δλ/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c; // Distance in meters
  };
  
  /**
   * Filters memories within a specified radius of a center point
   * @param {Object} data - Data object containing memories array
   * @param {number} centerLat - Latitude of center point
   * @param {number} centerLon - Longitude of center point
   * @param {number} [radiusMeters=180] - Radius in meters
   * @returns {Object} Filtered data object
   */
  export const filterMemoriesByRadius = (data, centerLat, centerLon, radiusMeters = 180) => {
    const memories = data.memories;
    
    return {
      ...data,
      memories: memories.filter(memory => {
        const distance = calculateDistance(
          centerLat,
          centerLon,
          memory.latitude,
          memory.longitude
        );
        return distance <= radiusMeters;
      })
    };
  };