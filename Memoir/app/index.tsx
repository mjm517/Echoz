import React, { useState, useEffect } from 'react';
import { Text, View } from "react-native";
import LocationService from '../components/locationService';

export default function Index() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await LocationService.getCurrentLocation();
        if (position.latitude != null && position.longitude != null) {
          setLocation({
            latitude: position.latitude,
            longitude: position.longitude,
          });
        } else {
          console.error('Invalid location data received');
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocation();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {location ? (
        <Text>
          Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
        </Text>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
}
