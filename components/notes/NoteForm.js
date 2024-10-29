import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ImageBackground, Button, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Keyboard } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
          width: (SCREEN_WIDTH * .9),
          height: (SCREEN_HEIGHT * .64),
          backgroundColor: 'transparent',
          padding: SCREEN_WIDTH * .045,
          paddingTop: SCREEN_WIDTH * 0.108,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          marginBottom: '25%',
        },
        dateTimeContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '95%',
        },
        dateText: {
          fontSize: SCREEN_WIDTH * 0.04,
          color: '#666',
          fontStyle: 'italic',
        },
        timeText: {
          fontSize: SCREEN_WIDTH * 0.04,
          color: '#666',
          fontStyle: 'italic',
        },
        imagePlaceholder: {
          width: SCREEN_WIDTH * 0.8, // Scale based on the original width
          height: SCREEN_WIDTH * 0.68,
          backgroundColor: '#B9A86A', // Light yellow background
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: '2%',
          borderRadius: 8,
          marginTop: '1%',
        },
        addImageText: {
          fontSize: SCREEN_WIDTH * 0.4,
          color: '#FFF1C0',
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: 8,
        },
        titleInput: {
          fontSize: SCREEN_WIDTH * 0.05,
          fontWeight: 'bold',
          width: '98%',
          textAlign: 'left',
          marginBottom: '3%',
          backgroundColor: '#E6D493',
          padding: '2.5%',
          borderRadius: 8,
        },
        descriptionInput: {
          fontSize: SCREEN_WIDTH * 0.035,
          color: '#333',
          textAlign: 'justify',
          width: '98%',
          lineHeight: 25,
          height: '28%',
          borderRadius: 8,
          padding: '2.5%',
          backgroundColor: '#E6D493',
        },
      });
      
    export default NoteForm;

