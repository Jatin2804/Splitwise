import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SCREEN_NAMES } from '../navigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type GroupSettingsRouteProp = RouteProp<
  RootStackParamList,
  typeof SCREEN_NAMES.GROUP_SETTINGS
>;
type GroupSettingsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof SCREEN_NAMES.GROUP_SETTINGS
>;

interface Props {
  route: GroupSettingsRouteProp;
  navigation: GroupSettingsNavigationProp;
}

const GroupSettingsScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;
  const context = useContext(AppContext);
  const group = context?.getGroupById(groupId);

  const [groupName, setGroupName] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (group) {
      setGroupName(group.name);
      setAvatarUri(group.avatar || '');
    }
  }, [group]);

  if (!group || !context) {
    return (
      <View style={styles.centerContainer}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const handleSaveName = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await context.updateGroup(groupId, { name: groupName });
      Alert.alert('Success', 'Group name updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update group name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone and all expenses will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await context.deleteGroup(groupId);
              navigation.navigate(SCREEN_NAMES.MAIN_APP); // Go back to main tabs
            } catch (error) {
              Alert.alert('Error', 'Failed to delete group');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Icon name="arrow-back" size={24} color="#2d3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Settings</Text>
          <View style={styles.headerButton} />{' '}
          {/* Empty view for flex balance */}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Group Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter group name"
                placeholderTextColor="#b2bec3"
              />
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isSaving && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveName}
                disabled={isSaving || groupName === group.name}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate(SCREEN_NAMES.ADD_MEMBERS, { groupId })
              }
            >
              <View style={styles.actionButtonLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: '#e8f8f5' },
                  ]}
                >
                  <Icon name="person-add" size={20} color="#00b894" />
                </View>
                <Text style={styles.actionButtonText}>Add Members</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#b2bec3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteGroup}
            >
              <View style={styles.actionButtonLeft}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: '#ffefef' },
                  ]}
                >
                  <Icon name="delete-outline" size={20} color="#d63031" />
                </View>
                <Text style={styles.deleteButtonText}>Delete Group</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#636e72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#dfe6e9',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoText: {
    marginTop: 8,
    fontSize: 12,
    color: '#636e72',
    fontWeight: '500',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0984e3',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fafbfc',
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2d3436',
  },
  saveButton: {
    backgroundColor: '#0984e3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#b2bec3',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
  },
  deleteButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d63031',
  },
});

export default GroupSettingsScreen;
