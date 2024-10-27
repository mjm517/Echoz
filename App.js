import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './screens/MapScreen/index';
import AddNoteScreen from './screens/AddNoteScreen/index';
import ViewNoteScreen from './screens/ViewNoteScreen/index';
import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator intialRouteName="Map">
        <Stack.Screen name ="Map" component={MapScreen} />
        <Stack.Screen name ="AddNote" component={AddNoteScreen} />
        <Stack.Screen name ="ViewNote" component={ViewNoteScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>

    // <View style={styles.container}>
    //   <Text>Hello</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
