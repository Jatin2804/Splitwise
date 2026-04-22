import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AppContext } from '../context/AppContext';
import { SCREEN_NAMES } from '../navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof SCREEN_NAMES.CREATE_GROUP
>;

interface Props {
  navigation: NavigationProp;
}

const CreateGroupScreen = ({ navigation }: Props) => {
  const context = useContext(AppContext);
  const [groupName, setGroupName] = useState('');
  const [selectedType, setSelectedType] = useState('Trip');
  const [avatarUri, setAvatarUri] = useState('');

  const groupTypes = [
    { name: 'Trip', icon: 'flight' },
    { name: 'Home', icon: 'home' },
    { name: 'Couple', icon: 'favorite' },
    { name: 'Other', icon: 'list' },
  ];

  const handleDone = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (context) {
      try {
        const newGroup = await context.addGroup({
          name: groupName,
          type: selectedType,
          avatar: avatarUri,
          totalspend: 0,
          createdBy: 'user',
          totalMembers: 1,
          members: [],
          setteledAmount: 0,
          unsetteledAmount: 0,
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
        });

        navigation.replace(SCREEN_NAMES.GROUP_DETAILS, {
          groupId: newGroup.id,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to create group');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a group</Text>
        <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Group name</Text>
            <TextInput
              style={styles.textInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g. Goa Trip"
              placeholderTextColor="#b2bec3"
              autoFocus
            />
          </View>
        </View>

        <Text style={styles.typeSectionTitle}>Type</Text>
        <View style={styles.typeContainer}>
          {groupTypes.map(type => (
            <TouchableOpacity
              key={type.name}
              style={[
                styles.typeBox,
                selectedType === type.name && styles.typeBoxSelected,
              ]}
              onPress={() => setSelectedType(type.name)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconCircle,
                  selectedType === type.name && styles.iconCircleSelected,
                ]}
              >
                <Icon
                  name={type.icon}
                  size={24}
                  color={selectedType === type.name ? '#fff' : '#636e72'}
                />
              </View>
              <Text
                style={[
                  styles.typeText,
                  selectedType === type.name && styles.typeTextSelected,
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>What is App Lifecycle in React Native?
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  headerButton: {
    padding: 4,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  doneText: {
    fontSize: 16,
    color: '#0984e3',
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  photoBox: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#0984e3',
    paddingBottom: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: '#636e72',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 24,
    color: '#2d3436',
    padding: 0,
    fontWeight: '500',
  },
  typeSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeBox: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },
  typeBoxSelected: {
    backgroundColor: '#f0f8ff',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircleSelected: {
    backgroundColor: '#0984e3',
  },
  typeText: {
    fontSize: 13,
    color: '#636e72',
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#0984e3',
    fontWeight: '600',
  },
});

export default CreateGroupScreen;
