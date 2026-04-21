import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../context/UserContext';
import { SCREEN_NAMES } from '../navigation';

const EnrollmentScreen = ({ navigation }: any) => {
  const userCtx = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await userCtx?.register(name.trim(), email.trim(), phone.trim());
      navigation.replace(SCREEN_NAMES.MAIN_APP);
    } catch (e) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoArea}>
              <View style={styles.logoCircle}>
                <Icon name="people" size={52} color="#fff" />
              </View>
              <Text style={styles.title}>Join Splitwise</Text>
              <Text style={styles.subtitle}>
                Create your account to start splitting
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.field}>
                <Icon
                  name="person-outline"
                  size={20}
                  color="#636e72"
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#b2bec3"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.field}>
                <Icon
                  name="email"
                  size={20}
                  color="#636e72"
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#b2bec3"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.field}>
                <Icon
                  name="phone"
                  size={20}
                  color="#636e72"
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#b2bec3"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Get Started</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { 
    flexGrow: 1,
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  logoArea: { 
    alignItems: 'center', 
    marginBottom: 40,
    marginTop: Platform.OS === 'ios' ? 0 : 20,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#00b894',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1e272e', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 15, 
    color: '#636e72',
    textAlign: 'center',
  },
  form: { 
    gap: 16,
    marginBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    height: 54,
  },
  fieldIcon: { marginRight: 12 },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: '#2d3436',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  btn: {
    backgroundColor: '#00b894',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnDisabled: { backgroundColor: '#b2bec3' },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default EnrollmentScreen;
