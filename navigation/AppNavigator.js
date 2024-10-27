// navigation/AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MapScreen from '../screens/MapScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import ShareNoteScreen from '../screens/ShareNoteScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            headerShown: false // Since your map screen appears to be full-screen
          }}
        />
        <Stack.Screen 
          name="ViewNote" 
          component={ViewNoteScreen}
          options={{
            presentation: 'modal', // Makes it slide up like a modal
            title: '' // Empty title since your design shows no header
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
    </NavigationContainer>
  );
}
