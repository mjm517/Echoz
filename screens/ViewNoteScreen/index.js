import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NoteCard from '../../components/notes/NoteCard';
import styles from './styles';

const ViewNoteScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

    <LinearGradient
      colors={['#1E1B22', 'transparent']}
      locations={[0.19, 1]} 
      style={styles.background}
    />

    <View style={[styles.stackedShadow2]}/> 
    <View style={[styles.stackedShadow]}/> 

    <NoteCard
        date="Oct. 26th, 2024"
        time="03:46PM"
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/9/9e/Ours_brun_parcanimalierpyrenees_1.jpg"
        acceesibilityLabel = {`${address} ${description}`}
        address="17803 La Cantera Terrace"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip."
    />

    <View style={styles.backButtonContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <LinearGradient
            colors={['rgba(19, 13, 107, 0.5)', 'transparent']}
            style={styles.innerShadowOverlay}
        />
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>

    </View>
  );
};

export default ViewNoteScreen;