import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SCREEN_NAMES } from '../navigation';
import groupBg from '../assets/groupBg.jpg';

type GroupDetailsRouteProp = RouteProp<RootStackParamList, typeof SCREEN_NAMES.GROUP_DETAILS>;
type GroupDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, typeof SCREEN_NAMES.GROUP_DETAILS>;

interface Props {
  route: GroupDetailsRouteProp;
  navigation: GroupDetailsNavigationProp;
}

const TABS = ['Settle up', 'Charts', 'Balances', 'Totals'];

const GroupDetailsScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Settle up');

  const group = context?.getGroupById(groupId);

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTabContent = () => {
    return (
      <View style={styles.fallbackContainer}>
        <Icon name="insert-chart-outlined" size={64} color="#dfe6e9" />
        <Text style={styles.fallbackText}>No {activeTab.toLowerCase()} data available yet.</Text>
        <Text style={styles.fallbackSubText}>Add expenses to see details here.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <ImageBackground source={groupBg} style={styles.headerImage}>
          <View style={styles.headerOverlay}>
            <SafeAreaView>
              <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                  <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="settings" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>

            <View style={styles.headerBottom}>
              <Text style={styles.groupName}>{group.name}</Text>
              
              <View style={styles.groupMetaContainer}>
                <View style={styles.metaItem}>
                  <Icon name="event" size={14} color="#fff" style={styles.metaIcon} />
                  <Text style={styles.metaText}>
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Icon name="people" size={16} color="#fff" style={styles.metaIcon} />
                  <Text style={styles.metaText}>{group.totalMembers} people</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        {group.members.length === 0 && (
          <View style={styles.addMembersContainer}>
            <TouchableOpacity 
              style={styles.addMembersButton}
              onPress={() => navigation.navigate(SCREEN_NAMES.ADD_MEMBERS, { groupId: group.id })}
              activeOpacity={0.8}
            >
              <Icon name="person-add" size={24} color="#fff" />
              <Text style={styles.addMembersText}>Add Members</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.statusSection, group.members.length > 0 && { marginTop: -16 }]}>
          <View style={styles.statusIconContainer}>
            <Icon name="check-circle" size={32} color="#00b894" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>You are all settled up!</Text>
            <Text style={styles.statusSubtitle}>You are settled up in this group as of now.</Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.pillTab,
                  activeTab === tab && styles.activePillTab
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[
                  styles.pillTabText,
                  activeTab === tab && styles.activePillTabText
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentSection}>
          {renderTabContent()}
        </View>

      </ScrollView>

      {/* Floating Action Button for Add Expense */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.fabText}>Add expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#d63031',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0984e3',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  headerBottom: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  groupMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 12,
  },
  addMembersContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  addMembersButton: {
    backgroundColor: '#00b894',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addMembersText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f8f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#636e72',
    lineHeight: 18,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  pillTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  activePillTab: {
    backgroundColor: '#2d3436',
    borderColor: '#2d3436',
  },
  pillTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636e72',
  },
  activePillTabText: {
    color: '#fff',
  },
  contentSection: {
    padding: 20,
    minHeight: 300,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackSubText: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#00b894',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default GroupDetailsScreen;
