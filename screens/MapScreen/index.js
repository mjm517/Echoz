import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import styles from './styles';

const MapScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Map Screen Here</Text>
      <Button
        title="Add Note Screen"
        onPress={() => navigation.navigate('AddNote')}
      />
      <Button
        title="View Note Screen"
        onPress={() => navigation.navigate('ViewNote')}
      />
    </View>
  );
};

export default MapScreen;