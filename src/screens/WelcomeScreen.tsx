import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SCREEN_NAMES } from '../navigation';

const WelcomeScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(SCREEN_NAMES.MAIN_APP);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>Splitwise</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ffffffff' 
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#000000ff',
    marginTop: 20,
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
