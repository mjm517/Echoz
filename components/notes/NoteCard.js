import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const NoteCard = ({ date, time, imageUrl, address, description }) => {
  return (

    <ImageBackground 
      source={imageSource}
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
      width: (SCREEN_WIDTH * .9),
      height: (SCREEN_HEIGHT * .64),
      backgroundColor: 'transparent',
      borderRadius: 0,
      padding: SCREEN_WIDTH * .045,
      paddingTop: SCREEN_WIDTH * 0.108,
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      position: 'absolute',
      top: '6%',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '94%',
        alignSelf: 'center',
      },
    dateText: {
      fontSize: SCREEN_WIDTH * 0.04,
      color: '#666',
      fontStyle: 'italic',
      alignSelf: 'flex-start',
    },
    timeText: {
      fontSize: SCREEN_WIDTH * 0.04,
      color: '#666',
      fontStyle: 'italic',
      alignSelf: 'flex-end',
    },
    image: {
      width: SCREEN_WIDTH * 0.8, // Scale based on the original width
      height: SCREEN_WIDTH * 0.68,
      borderRadius: 8,
      marginVertical: '2%',
      alignSelf: 'center',
    },
    addressText: {
      fontSize: SCREEN_WIDTH * 0.05,
      fontWeight: 'bold',
      marginTop: '1%',
      marginBottom: '-4%',
      textAlign: 'left',
      padding: '2%',
    },
    descriptionText: {
      fontSize: SCREEN_WIDTH * 0.035,
      color: '#333',
      marginTop: '2%',
      textAlign: 'justify',
      padding: '2%',
      lineHeight: SCREEN_WIDTH * 0.06,
    },
});

export default NoteCard;