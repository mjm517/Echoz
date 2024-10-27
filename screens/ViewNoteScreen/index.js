import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import styles from './styles';

const ViewNoteScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>View Note Screen</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default ViewNoteScreen;