import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const MapScreen = ( { navigation } ) => {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const innerRadius = 180; // Radius in meters for the clear inner circle
  
  const fetchNearbyMarkers = async (userLocation) => {
    try {
      const response = await fetch(`YOUR_API_ENDPOINT?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=${innerRadius}`);
      const data = await response.json();
      setMarkers(data);
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      if (location) {
        fetchNearbyMarkers(location);
      }
    })();
  }, [location]);

  const createCircleCoords = (center, radius, numPoints = 64) => {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * (2 * Math.PI);
      const latitude = center.latitude + (radius / 111320) * Math.cos(angle);
      const longitude = center.longitude + (radius / (111320 * Math.cos(center.latitude * (Math.PI / 180)))) * Math.sin(angle);
      points.push({ latitude, longitude });
    }
    return points;
  };

  const createRectangle = (center) => {
    const aspectRatio = width / height;
    const latDelta = 0.0922;
    const lngDelta = latDelta * aspectRatio;

    return [
      { latitude: center.latitude - latDelta, longitude: center.longitude - lngDelta },
      { latitude: center.latitude - latDelta, longitude: center.longitude + lngDelta },
      { latitude: center.latitude + latDelta, longitude: center.longitude + lngDelta },
      { latitude: center.latitude + latDelta, longitude: center.longitude - lngDelta },
    ];
  };

  const isWithinRadius = (markerCoords) => {
    if (!location) return false;
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = location.latitude * Math.PI / 180;
    const φ2 = markerCoords.latitude * Math.PI / 180;
    const Δφ = (markerCoords.latitude - location.latitude) * Math.PI / 180;
    const Δλ = (markerCoords.longitude - location.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance <= innerRadius;
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          mapType='satellite'
          showsPointsOfInterest={false}
          zoomEnabled={false}
          scrollEnabled={false}
          loadingEnabled={true}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0096,
            longitudeDelta: 0.0044,
          }}

          // iphone zoom
          cameraZoomRange={{
            minCenterCoordinateDistance: 1500 ,
            maxCenterCoordinateDistance: 1500
          }}
          // android zoom
          minZoomLevel={17}
          maxZoomLevel={17}
        >
          <Polygon
            coordinates={createRectangle(location)}
            holes={[createCircleCoords(location, innerRadius)]}
            fillColor="rgba(0, 0, 0, 0.5)"
            strokeColor="rgba(255, 255, 255, 0.9)"
            strokeWidth={1}
          />
          
          {markers.map((marker) => (
            (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.coordinates.latitude,
                  longitude: marker.coordinates.longitude
                }}
                onPress={() => navigation.navigate('ViewNote', { noteId: marker.id })}
              />
            )
          ))}
        </MapView>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddNote')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#4285F4',
    width: 300,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 50,
  },
});

export default MapScreen;