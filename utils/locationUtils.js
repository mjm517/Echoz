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
 * Filters memories that are within a specified distance from a given point
 * @param {Object[]} memories - Array of memory objects
 * @param {Object} point - Reference point with latitude and longitude
 * @param {number} point.latitude - Latitude of the reference point
 * @param {number} point.longitude - Longitude of the reference point
 * @param {number} maxDistance - Maximum distance in meters
 * @returns {Object[]} Filtered array of memories
 */
export const filterMemoriesByDistance = (memories, point, maxDistance) => {
  return memories.filter(memory => {
    // Extract coordinates from the memory object
    // const memoryCoords = memory.coordinates.coordinates;
    const memoryLon = memory.longitude;
    const memoryLat = memory.latitude;
    
    // Calculate distance between memory and reference point
    const distance = calculateDistance(
      point.latitude,
      point.longitude,
      memoryLat,
      memoryLon
    );
    
    // Return true if memory is within maxDistance
    return distance <= maxDistance;
  });
};