// locationService.tsx
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

interface LocationResult {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

class LocationService {
  static async getCurrentLocation(): Promise<LocationResult> {
    try {
      // Check and request permissions
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Location permission denied');
        }
      } else {
        // iOS permission request
        await new Promise<void>((resolve) => {
          Geolocation.requestAuthorization();
          resolve();
        });
      }

      // Get current position
      return new Promise<LocationResult>((resolve) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null
            });
          },
          (error) => {
            resolve({
              latitude: null,
              longitude: null,
              error: error.message
            });
          },
          { 
            enableHighAccuracy: true, 
            timeout: 15000, 
            maximumAge: 10000 
          }
        );
      });
    } catch (error) {
      return {
        latitude: null,
        longitude: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default LocationService;
