import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, Image, SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../context/UserContext';
import { SCREEN_NAMES } from '../navigation';

const AccountScreen = ({ navigation }: any) => {
  const userCtx = useContext(UserContext);
  const user = userCtx?.currentUser;

  const [name, setName]   = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phoneNumber ?? '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phoneNumber);
    }
  }, [user]);

  const initials = (user?.name ?? 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    await userCtx?.updateCurrentUser({ name: name.trim(), email: email.trim(), phoneNumber: phone.trim() });
    setEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: async () => {
        await userCtx?.logout();
        navigation.replace(SCREEN_NAMES.WELCOME);
      }},
    ]);
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Icon name="account-circle" size={80} color="#dfe6e9" />
        <Text style={styles.notLoggedText}>Not logged in</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace(SCREEN_NAMES.ENROLLMENT)}>
          <Text style={styles.loginBtnText}>Sign Up / Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
            <Text style={styles.editText}>{editing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.initials}>{initials}</Text>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Fields */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>PERSONAL INFO</Text>

          <View style={styles.field}>
            <View style={styles.fieldLeft}>
              <Icon name="person-outline" size={18} color="#636e72" />
              <Text style={styles.fieldTitle}>Name</Text>
            </View>
            {editing
              ? <TextInput style={styles.fieldInput} value={name} onChangeText={setName} autoCapitalize="words" />
              : <Text style={styles.fieldValue}>{user.name}</Text>}
          </View>

          <View style={styles.separator} />

          <View style={styles.field}>
            <View style={styles.fieldLeft}>
              <Icon name="email" size={18} color="#636e72" />
              <Text style={styles.fieldTitle}>Email</Text>
            </View>
            {editing
              ? <TextInput style={styles.fieldInput} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              : <Text style={styles.fieldValue}>{user.email}</Text>}
          </View>

          <View style={styles.separator} />

          <View style={styles.field}>
            <View style={styles.fieldLeft}>
              <Icon name="phone" size={18} color="#636e72" />
              <Text style={styles.fieldTitle}>Phone</Text>
            </View>
            {editing
              ? <TextInput style={styles.fieldInput} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              : <Text style={styles.fieldValue}>{user.phoneNumber}</Text>}
          </View>
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#d63031" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  notLoggedText: { fontSize: 18, color: '#636e72', marginTop: 16, marginBottom: 24 },
  loginBtn: { backgroundColor: '#00b894', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#e9ecef',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1e272e' },
  editText: { fontSize: 16, fontWeight: '700', color: '#0984e3' },

  avatarSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#fff', marginBottom: 12 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#00b894',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
    elevation: 4, shadowColor: '#00b894', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  avatarImg: { width: 90, height: 90, borderRadius: 45 },
  initials: { fontSize: 32, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '700', color: '#1e272e', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#636e72' },

  card: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: '#b2bec3', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  field: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  fieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fieldTitle: { fontSize: 15, color: '#2d3436', fontWeight: '500' },
  fieldValue: { fontSize: 15, color: '#636e72', flex: 1, textAlign: 'right' },
  fieldInput: { flex: 1, textAlign: 'right', fontSize: 15, color: '#0984e3', fontWeight: '600' },
  separator: { height: 1, backgroundColor: '#f1f2f6', marginVertical: 10 },

  saveBtn: {
    backgroundColor: '#0984e3', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12,
    elevation: 3, shadowColor: '#0984e3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, marginTop: 8,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ffeaea',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#d63031' },
});

export default AccountScreen;
