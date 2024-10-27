import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import LocationService from '../components/locationService';
// import { LocationResult } from './locationService';

type LocationResult = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

const LocationTest: React.FC = () => {
  const [location, setLocation] = useState<LocationResult | null>(null);

  const getLocation = async () => {
    try {
      const result = await LocationService.getCurrentLocation();
      setLocation(result);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
          {location.error && `\nError: ${location.error}`}
        </Text>
      )}
    </View>
  );
};

export default LocationTest;
