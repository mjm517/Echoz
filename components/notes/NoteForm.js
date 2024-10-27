import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ImageBackground, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Keyboard } from 'react-native';

const NoteForm = ({ initialDate, initialTime, initialAddress, initialDescription }) => {
    const [date] = useState(initialDate);
    const [time] = useState(initialTime);
    const [title, setTitle] = useState(initialAddress);
    const [description, setDescription] = useState(initialDescription);
    const [imageUri, setImageUri] = useState(null);
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [350, 300],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    const handleKeyPress = ({ nativeEvent }) => {
        if (nativeEvent.key === 'Enter') {
          Keyboard.dismiss();
        }
      };

    return (
        <ImageBackground
            source={require('../../assets/NoteSmall.png')} // Background image for the card
            style={styles.noteCard}
            imageStyle={{ borderRadius: 0 }}
        >

          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.timeText}>{time}</Text>
          </View>
    
          {/* <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.addImageText}>+</Text>
            )}
          </TouchableOpacity> */}

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                <Text style={styles.addImageText}>+</Text>
                )}
            </TouchableOpacity>

                {/* {!imageUri && (
                    <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                )}
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={{ width: 350, height: 300, marginTop: -30, borderRadius: 8 }} />
                )} */}
            </View>
        
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="done"
          />
    
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            onKeyPress={handleKeyPress}
            returnKeyType="done"
          />
        </ImageBackground>
      );
    };

    const styles = StyleSheet.create({
        noteCard: {
          width: 390,
          height: 600,
          backgroundColor: 'transparent',
          padding: 15,
          paddingTop: 48,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          marginBottom: 100,
        },
        dateTimeContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '95%',
        },
        dateText: {
          fontSize: 16,
          color: '#666',
          fontStyle: 'italic',
        },
        timeText: {
          fontSize: 16,
          color: '#666',
          fontStyle: 'italic',
        },
        imagePlaceholder: {
          width: 350,
          height: 300,
          backgroundColor: '#B9A86A', // Light yellow background
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          borderRadius: 8,
          marginTop: 10,
        },
        addImageText: {
          fontSize: 140,
          color: '#FFF1C0',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: 8,
        },
        titleInput: {
          fontSize: 20,
          fontWeight: 'bold',
          width: '96%',
          textAlign: 'left',
          marginBottom: 10,
          backgroundColor: '#E6D493',
          padding: 8,
          borderRadius: 8,
        },
        descriptionInput: {
          fontSize: 14,
          color: '#333',
          textAlign: 'justify',
          width: '96%',
          lineHeight: 25,
          height: 150,
          borderRadius: 8,
          padding: 10,
          backgroundColor: '#E6D493',
        },
        shareButton: {
          backgroundColor: '#4284FF',
          borderRadius: 10,
          width: 250,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        },
        shareButtonText: {
          fontSize: 20,
          color: '#fff',
        },
      });
      
    export default NoteForm;

