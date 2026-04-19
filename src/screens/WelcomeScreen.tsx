import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SCREEN_NAMES } from '../navigation';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View style={styles.buttonContainer}>
        <Button title="Go to Enrollment" onPress={() => navigation.navigate(SCREEN_NAMES.ENROLLMENT)} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Go to Main App" onPress={() => navigation.navigate(SCREEN_NAMES.MAIN_APP)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { marginVertical: 10, width: '100%' }
});

export default WelcomeScreen;
