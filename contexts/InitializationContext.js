import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const InitializationContext = createContext();

export function InitializationProvider({ children }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initError, setInitError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Check location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);

        if (status !== 'granted') {
          setInitError('Location permission is required to use this app');
          return;
        }

        // Any other initialization tasks (e.g., loading fonts, initial data)
        // await Promise.all([
        //   Font.loadAsync(customFonts),
        //   // other async tasks
        // ]);

      } catch (e) {
        setInitError(e.message);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <InitializationContext.Provider 
      value={{ 
        appIsReady,
        initError,
        locationPermission
      }}
    >
      {children}
    </InitializationContext.Provider>
  );
}

export const useInitialization = () => useContext(InitializationContext);
