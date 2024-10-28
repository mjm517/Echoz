import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NoteCard from '../../components/notes/NoteCard';
import styles from './styles';



const ViewNoteScreen = ({ route, navigation }) => {
  const { allMarkers, initialIndex } = route.params;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Get the current marker's data
  const currentMarker = allMarkers[currentIndex];
  
  // Format the date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDate(currentMarker.created_at);

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
        date={date}
        time={time}
        imageUrl={currentMarker.image_url}
        address={currentMarker.location}
        description={currentMarker.description}
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
