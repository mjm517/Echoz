import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NoteForm from '../../components/notes/NoteForm';
import styles from './styles';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const AddNoteScreen = ({ navigation }) => {
  
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
        initialDate="Oct. 26th, 2024"
        initialTime="03:46PM"
        initialAddress="17803 La Cantera Terrace"
        initialDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip."
    />

    </KeyboardAvoidingView>

<View style={styles.backButtonContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <LinearGradient
            colors={['rgba(19, 13, 107, 0.5)', 'transparent']}
            style={styles.innerShadowOverlay}
        />
        <Text style={styles.backButtonText}>share</Text>
      </TouchableOpacity>
    </View>

    </View>
    </TouchableWithoutFeedback>
  );
};

export default AddNoteScreen;
