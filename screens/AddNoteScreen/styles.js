import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#504D5A', //trivial commit
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 1000,
    },
    backButtonContainer: {
      position: 'absolute',
      bottom: '9.5%', // Adjust this value as needed for your layout
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
      height: '200%',
      elevation: 5,
    },
    backButtonText: {
      fontSize: 40,
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