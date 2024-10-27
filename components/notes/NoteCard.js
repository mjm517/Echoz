import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';

const NoteCard = ({ date, time, imageUrl, address, description }) => {
  return (

    <ImageBackground 
      source={require('../../assets/NoteSmall.png')}
      style={styles.noteCard}
      imageStyle={{ borderRadius: 0 }} // Adjust the border radius if needed
    >

    <View style={styles.dateTimeContainer}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.timeText}>{time}</Text>
    </View>

      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
      />

      <Text style={styles.addressText}>{address}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    noteCard: {
      width: 390,
      height: 600,
      backgroundColor: 'transparent',
      borderRadius: 0,
      padding: 15,
      paddingTop: 48,
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      position: 'absolute',
      top: 50,
    },
    triangleCorner: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 30, // Adjust to control the size of the triangle
        borderTopWidth: 30, // Adjust to control the size of the triangle
        borderRightColor: 'transparent',
        borderTopColor: '#1E1B22', // Same color as the card background
        transform: [{ rotate: '90deg' }],
      },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',
      },
    dateText: {
      fontSize: 16,
      color: '#666',
      fontStyle: 'italic',
      alignSelf: 'flex-start',
    },
    timeText: {
      fontSize: 16,
      color: '#666',
      fontStyle: 'italic',
      alignSelf: 'flex-end',
    },
    image: {
      width: 350,
      height: 300,
      borderRadius: 8,
      marginVertical: 10,
      alignSelf: 'center',
    },
    addressText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 5,
      marginBottom: -15,
      textAlign: 'left',
      padding: 5,
    },
    descriptionText: {
      fontSize: 14,
      color: '#333',
      marginTop: 10,
      textAlign: 'justify',
      padding: 8,
      lineHeight: 25,
    },
});

export default NoteCard;