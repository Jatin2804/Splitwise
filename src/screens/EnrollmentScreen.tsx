import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const EnrollmentScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrollment</Text>
      <Button title="Finish & Go to App" onPress={() => navigation.replace('MainApp')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default EnrollmentScreen;
