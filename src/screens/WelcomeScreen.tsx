import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SCREEN_NAMES } from '../navigation';
import { UserContext } from '../context/UserContext';

const WelcomeScreen = ({ navigation }: any) => {
  const userCtx = useContext(UserContext);

  useEffect(() => {
    if (userCtx?.isLoading) return;

    const timer = setTimeout(() => {
      if (userCtx?.isLoggedIn) {
        navigation.replace(SCREEN_NAMES.MAIN_APP);
      } else {
        navigation.replace(SCREEN_NAMES.ENROLLMENT);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userCtx?.isLoading, userCtx?.isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Splitwise</Text>
      <Text style={styles.subtitle}>Split bills. Stay friends.</Text>
      <ActivityIndicator style={styles.loader} size="small" color="#00b894" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: { width: 120, height: 120 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e272e',
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: { fontSize: 16, color: '#636e72', marginTop: 8 },
  loader: { marginTop: 40 },
});

export default WelcomeScreen;
