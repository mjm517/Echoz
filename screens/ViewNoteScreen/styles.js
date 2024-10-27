import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#504D5A',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 1000,
    },
    stackedShadow: {
      position: 'absolute',
      width: SCREEN_WIDTH * .9, // Scale based on the original width
      height: SCREEN_HEIGHT * 0.53,
      backgroundColor: '#D4C079',
      borderRadius: 0,
    },
    stackedShadow2: {
      position: 'absolute',
      width: SCREEN_WIDTH * 0.9, // Scale based on the original width
      height: SCREEN_HEIGHT * 0.57,
      backgroundColor: '#8F7F46',
      borderRadius: 0,
    },
    backButtonContainer: {
      position: 'absolute',
      bottom: '5.5%', // Adjust this value as needed for your layout
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4284FF',
      borderRadius: 10,
      width: '55%',
      height: '110%',
      elevation: 5,
    },
    backButtonText: {
      fontSize: 54,
      color: '#fff',
    },
    innerShadowOverlay: {
      position: 'absolute',
      top: 0, // Extend slightly outside to soften the inner shadow
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 10,
    },
  });

export default styles;