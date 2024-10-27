import React, { useState, useEffect, useRef } from 'react'; // Make sure useRef is imported
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import NoteForm from '../../components/notes/NoteForm';
import styles from './styles';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const AddNoteScreen = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(); // Create the ref

  // Function to format date
  const formatDate = (date) => {
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
                   'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  // Function to get ordinal suffix for date
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Function to format time
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes}${ampm}`;
  };

  // Function to get current location and address
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        const formattedAddress = `${address.streetNumber || ''} ${address.street || ''}`.trim();
        setCurrentAddress(formattedAddress);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch location');
      console.error(error);
    }
  };
  const handleShare = async () => {
    if (isSubmitting) return;

    if (!formRef.current?.getFormData) {
      console.error('Form reference not properly set up');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = await formRef.current.getFormData(); // Note the await here
      
      if (!formData.title || !formData.description) {
        Alert.alert('Missing Information', 'Please fill in both title and description.');
        return;
      }

      const requestBody = {
        title: formData.title,
        description: formData.description,
        location: currentAddress,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        image: formData.image // This will now be a base64 string with data URI prefix
      };

      console.log('Making fetch request with image data length:', 
        requestBody.image ? requestBody.image.length : 'no image');
      
      const response = await fetch('https://memory-keeper-tarive22.replit.app/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} body: ${responseText}`);
      }

      Alert.alert('Success', 'Note shared successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Failed to share note: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update date and time every minute
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(formatDate(now));
      setCurrentTime(formatTime(now));
    };

    // Initial update
    updateDateTime();

    // Set up interval for updates
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    // Get initial location
    getCurrentLocation();

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E1B22', 'transparent']}
          locations={[0.19, 1]} 
          style={styles.background}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <NoteForm
            ref={formRef} // Attach the ref here
            initialDate={currentDate}
            initialTime={currentTime}
            initialAddress={currentAddress}
            initialDescription="What happened?"
          />
        </KeyboardAvoidingView>

        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={[styles.backButton, isSubmitting && styles.disabledButton]} 
            onPress={handleShare} // Share button now correctly triggers handleShare
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={['rgba(19, 13, 107, 0.5)', 'transparent']}
              style={styles.innerShadowOverlay}
            />
            <Text style={styles.backButtonText}>
              {isSubmitting ? 'Sharing...' : 'Share'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddNoteScreen;