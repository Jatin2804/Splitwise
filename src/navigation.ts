export const SCREEN_NAMES = {
  // Root Navigator Screens
  WELCOME: 'Welcome',
  ENROLLMENT: 'Enrollment',
  MAIN_APP: 'MainApp',
  EMAIL_DETAILS: 'EmailDetails',
  LOGOUT_LOGIN: 'LogoutLogin',

  // Tab Navigator Screens
  GROUPS: 'Groups',
  FRIENDS: 'Friends',
  ACTIVITY: 'Activity',
  ACCOUNT: 'Account',

  // Group Flow Screens
  CREATE_GROUP: 'CreateGroup',
  GROUP_DETAILS: 'GroupDetails',
  ADD_MEMBERS: 'AddMembers',
  GROUP_SETTINGS: 'GroupSettings',
} as const;

export type RootStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.ENROLLMENT]: undefined;
  [SCREEN_NAMES.MAIN_APP]: undefined;
  [SCREEN_NAMES.EMAIL_DETAILS]: undefined;
  [SCREEN_NAMES.LOGOUT_LOGIN]: undefined;
  [SCREEN_NAMES.CREATE_GROUP]: undefined;
  [SCREEN_NAMES.GROUP_DETAILS]: { groupId: string };
  [SCREEN_NAMES.ADD_MEMBERS]: { groupId: string };
  [SCREEN_NAMES.GROUP_SETTINGS]: { groupId: string };
};

export type TabParamList = {
  [SCREEN_NAMES.GROUPS]: undefined;
  [SCREEN_NAMES.FRIENDS]: undefined;
  [SCREEN_NAMES.ACTIVITY]: undefined;
  [SCREEN_NAMES.ACCOUNT]: undefined;
};
