import { StyleSheet } from 'react-native';

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
      width: 390,
      height: 500,
      backgroundColor: '#D4C079',
      borderRadius: 0,
    },
    stackedShadow2: {
      position: 'absolute',
      width: 390,
      height: 530,
      backgroundColor: '#8F7F46',
      borderRadius: 0,
    },
    backButtonContainer: {
      position: 'absolute',
      bottom: 50, // Adjust this value as needed for your layout
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
      width: 250,
      height: 70,
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