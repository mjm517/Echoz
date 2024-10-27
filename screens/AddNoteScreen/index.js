import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import styles from './styles';

const AddNoteScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Add Note Screen</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default AddNoteScreen;
