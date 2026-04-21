import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { UserContext } from '../context/UserContext';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SCREEN_NAMES } from '../navigation';
import { Group, User } from '../data/types';

type AddExpenseRouteProp = RouteProp<
  RootStackParamList,
  typeof SCREEN_NAMES.ADD_EXPENSE
>;
type AddExpenseNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof SCREEN_NAMES.ADD_EXPENSE
>;

interface Props {
  route: AddExpenseRouteProp;
  navigation: AddExpenseNavProp;
}

const CATEGORIES = [
  'Food',
  'Travel',
  'Accommodation',
  'Entertainment',
  'Other',
];

const AddExpenseScreen = ({ route, navigation }: Props) => {
  const appCtx = useContext(AppContext);
  const userCtx = useContext(UserContext);
  const preselectedGroupId = route.params?.groupId;

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    preselectedGroupId
      ? appCtx?.getGroupById(preselectedGroupId) ?? null
      : null,
  );
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // When a group is picked, default-select all members
  const handleSelectGroup = (g: Group) => {
    setSelectedGroup(g);
    setSelectedMembers(g.members.map(m => m.id));
    setShowGroupPicker(false);
  };

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const splitAmount = useMemo(() => {
    const n = selectedMembers.length;
    const a = parseFloat(amount);
    if (!n || isNaN(a)) return 0;
    return parseFloat((a / n).toFixed(2));
  }, [selectedMembers, amount]);

  const handleSubmit = async () => {
    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a group');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member to split with');
      return;
    }

    const payer =
      userCtx?.currentUser?.id ?? selectedGroup.members[0]?.id ?? '';
    const splits = selectedMembers.map(uid => ({
      userId: uid,
      amount: splitAmount,
    }));

    setSubmitting(true);
    try {
      await appCtx?.addExpense(selectedGroup.id, {
        name: name.trim(),
        description: description.trim(),
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        paidBy: payer,
        category,
        splits,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Icon name="close" size={26} color="#2d3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.headerBtn}
          >
            <Text style={[styles.saveText, submitting && { color: '#b2bec3' }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Group selector (only if not pre-selected) */}
          {!preselectedGroupId && (
            <TouchableOpacity
              style={styles.groupSelector}
              onPress={() => setShowGroupPicker(true)}
            >
              <Icon name="group" size={20} color="#636e72" />
              <Text
                style={[
                  styles.groupSelectorText,
                  !selectedGroup && styles.placeholder,
                ]}
              >
                {selectedGroup ? selectedGroup.name : 'Select a group'}
              </Text>
              <Icon name="expand-more" size={20} color="#b2bec3" />
            </TouchableOpacity>
          )}
          {preselectedGroupId && selectedGroup && (
            <View style={styles.groupTag}>
              <Icon name="group" size={16} color="#0984e3" />
              <Text style={styles.groupTagText}>{selectedGroup.name}</Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.inputCard}>
            <Icon
              name="description"
              size={20}
              color="#636e72"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Expense name (e.g. Dinner)"
              placeholderTextColor="#b2bec3"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Amount */}
          <View style={styles.inputCard}>
            <Text style={styles.rupeeSign}>₹</Text>
            <TextInput
              style={[styles.inputField, styles.amountInput]}
              placeholder="0.00"
              placeholderTextColor="#b2bec3"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Extra description */}
          <View
            style={[
              styles.inputCard,
              { alignItems: 'flex-start', paddingVertical: 12 },
            ]}
          >
            <Icon
              name="notes"
              size={20}
              color="#636e72"
              style={[styles.inputIcon, { marginTop: 2 }]}
            />
            <TextInput
              style={[styles.inputField, { minHeight: 60 }]}
              placeholder="Note (optional)"
              placeholderTextColor="#b2bec3"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Category pills */}
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryRow}
          >
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.pill, category === c && styles.pillActive]}
                onPress={() => setCategory(c)}
              >
                <Text
                  style={[
                    styles.pillText,
                    category === c && styles.pillTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Split with members */}
          {selectedGroup && (
            <>
              <View style={styles.splitHeader}>
                <Text style={styles.sectionLabel}>Split with</Text>
                {parseFloat(amount) > 0 && selectedMembers.length > 0 && (
                  <Text style={styles.splitPerPerson}>
                    ₹{splitAmount.toLocaleString('en-IN')} / person
                  </Text>
                )}
              </View>
              {selectedGroup.members.map(member => {
                const selected = selectedMembers.includes(member.id);
                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberRow,
                      selected && styles.memberRowSelected,
                    ]}
                    onPress={() => toggleMember(member.id)}
                  >
                    <Image
                      source={{ uri: member.avatar }}
                      style={styles.memberAvatar}
                    />
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View
                      style={[
                        styles.checkbox,
                        selected && styles.checkboxActive,
                      ]}
                    >
                      {selected && <Icon name="check" size={14} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* Group Picker Modal */}
        <Modal
          visible={showGroupPicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Group</Text>
              <TouchableOpacity onPress={() => setShowGroupPicker(false)}>
                <Icon name="close" size={24} color="#2d3436" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={appCtx?.groups ?? []}
              keyExtractor={g => g.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.groupRow}
                  onPress={() => handleSelectGroup(item)}
                >
                  <View style={styles.groupRowIcon}>
                    <Icon name="group" size={22} color="#0984e3" />
                  </View>
                  <View>
                    <Text style={styles.groupRowName}>{item.name}</Text>
                    <Text style={styles.groupRowSub}>
                      {item.totalMembers} members
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', marginTop: 20 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  headerBtn: { minWidth: 48, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2d3436' },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0984e3',
    textAlign: 'right',
  },
  content: { padding: 20, gap: 14 },
  groupSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  groupSelectorText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
  placeholder: { color: '#b2bec3', fontWeight: '400' },
  groupTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  groupTagText: { fontSize: 14, color: '#0984e3', fontWeight: '600' },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    paddingHorizontal: 16,
    minHeight: 54,
  },
  inputIcon: { marginRight: 12 },
  inputField: { flex: 1, fontSize: 16, color: '#2d3436' },
  amountInput: { fontSize: 28, fontWeight: '700', color: '#2d3436' },
  rupeeSign: {
    fontSize: 24,
    fontWeight: '700',
    color: '#636e72',
    marginRight: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#636e72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryRow: { flexGrow: 0 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  pillActive: { backgroundColor: '#0984e3', borderColor: '#0984e3' },
  pillText: { fontSize: 14, color: '#636e72', fontWeight: '600' },
  pillTextActive: { color: '#fff' },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitPerPerson: { fontSize: 14, color: '#00b894', fontWeight: '700' },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  memberRowSelected: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  memberName: { flex: 1, fontSize: 15, color: '#2d3436', fontWeight: '500' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#0984e3', borderColor: '#0984e3' },
  modalSafe: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#2d3436' },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  groupRowIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  groupRowName: { fontSize: 16, fontWeight: '600', color: '#2d3436' },
  groupRowSub: { fontSize: 13, color: '#636e72', marginTop: 2 },
});

export default AddExpenseScreen;
