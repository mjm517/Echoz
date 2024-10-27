import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { filterMemoriesByDistance } from '../../utils/locationUtils';

const { width, height } = Dimensions.get('window');
const FETCH_INTERVAL = 5 * 1000; // 5 seconds in milliseconds

const MapScreen = React.memo(({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const innerRadius = 180; // Radius in meters for the clear inner circle

  // Memoize the fetch function to prevent recreating on every render
  const fetchNearbyMarkers = useCallback(async (userLocation) => {
    try {
      const response = await fetch(`https://memory-keeper-tarive22.replit.app/api/memories`);
      const data = await response.json();
      const memories = data["memories"];
      const filteredMemories = filterMemoriesByDistance(memories, userLocation, innerRadius);
      setMarkers(filteredMemories);
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  }, [innerRadius]);

  // Set up location tracking
  useEffect(() => {
    let isMounted = true;

    const setupLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(currentLocation.coords);
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    setupLocation();

    // Set up location watching
    let locationSubscription;
    const watchLocation = async () => {
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1
        },
        (newLocation) => {
          if (isMounted) {
            setLocation(newLocation.coords);
          }
        }
      );
    };

    watchLocation();

    return () => {
      isMounted = false;
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Set up periodic marker fetching
  useEffect(() => {
    let intervalId;
    console.log("fetching markers");
    const startFetching = async () => {
      if (location) {
        await fetchNearbyMarkers(location); // Initial fetch
        
        // Set up interval for subsequent fetches
        intervalId = setInterval(async () => {
          await fetchNearbyMarkers(location);
        }, FETCH_INTERVAL);
      }
    };

    startFetching();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [location, fetchNearbyMarkers]); // Only run when location is first set or fetchNearbyMarkers changes

  // Memoize navigation handler to prevent recreating on every render
  const handleNavigateToAddNote = useCallback(() => {
    navigation.navigate('AddNote');
  }, [navigation]);

  // Memoize marker press handler
  const handleMarkerPress = useCallback((marker) => {
    navigation.navigate('ViewNote', {
      allMarkers: markers,
      initialIndex: markers.findIndex(m => m.id === marker.id)
    });
  }, [navigation, markers]);

  // Memoize circle coordinates calculation
  const createCircleCoords = useCallback((center, radius, numPoints = 64) => {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * (2 * Math.PI);
      const latitude = center.latitude + (radius / 111320) * Math.cos(angle);
      const longitude = center.longitude + (radius / (111320 * Math.cos(center.latitude * (Math.PI / 180)))) * Math.sin(angle);
      points.push({ latitude, longitude });
    }
    return points;
  }, []);

  // Memoize rectangle coordinates calculation
  const createRectangle = useCallback((center) => {
    const aspectRatio = width / height;
    const latDelta = 0.0922;
    const lngDelta = latDelta * aspectRatio;

    return [
      { latitude: center.latitude - latDelta, longitude: center.longitude - lngDelta },
      { latitude: center.latitude - latDelta, longitude: center.longitude + lngDelta },
      { latitude: center.latitude + latDelta, longitude: center.longitude + lngDelta },
      { latitude: center.latitude + latDelta, longitude: center.longitude - lngDelta },
    ];
  }, []);

  // Memoize initial region calculation
  const initialRegion = useMemo(() => location ? {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0096,
    longitudeDelta: 0.0044,
  } : null, [location]);

  // Memoize polygon coordinates
  const polygonCoordinates = useMemo(() => 
    location ? createRectangle(location) : [], 
    [location, createRectangle]
  );

  const polygonHoles = useMemo(() => 
    location ? [createCircleCoords(location, innerRadius)] : [], 
    [location, innerRadius, createCircleCoords]
  );

  if (!location) {
    return null; // or a loading component
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType='satellite'
        showsPointsOfInterest={false}
        zoomEnabled={false}
        scrollEnabled={false}
        loadingEnabled={true}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={initialRegion}
        cameraZoomRange={{
          minCenterCoordinateDistance: 1500,
          maxCenterCoordinateDistance: 1500
        }}
        minZoomLevel={17}
        maxZoomLevel={17}
      >
        <Polygon
          coordinates={polygonCoordinates}
          holes={polygonHoles}
          fillColor="rgba(0, 0, 0, 0.5)"
          strokeColor="rgba(255, 255, 255, 0.9)"
          strokeWidth={1}
        />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToAddNote}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

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