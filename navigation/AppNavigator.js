import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useInitialization } from '../contexts/InitializationContext';
import InitialLoadingScreen from '../screens/InitialLoadingScreen';
import PermissionScreen from '../screens/PermissionScreen';
import MapScreen from '../screens/MapScreen';
import ViewNoteScreen from '../screens/ViewNoteScreen';
import AddNoteScreen from '../screens/AddNoteScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { appIsReady, initError, locationPermission } = useInitialization();

  if (!appIsReady) {
    return <InitialLoadingScreen />;
  }

  if (locationPermission !== 'granted') {
    return <PermissionScreen error={initError} />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Map" 
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ViewNote" 
        component={ViewNoteScreen}
        options={{
          presentation: 'modal',
          title: ''
        }}
      />
      <Stack.Screen 
        name="AddNote" 
        component={AddNoteScreen}
        options={{
          presentation: 'modal',
          title: ''
        }}
      />
    </Stack.Navigator>
  );
}