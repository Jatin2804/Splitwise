export const SCREEN_NAMES = {
  // Root Navigator Screens
  WELCOME: 'Welcome',
  ENROLLMENT: 'Enrollment',
  MAIN_APP: 'MainApp',

  // Tab Navigator Screens
  GROUPS: 'Groups',
  FRIENDS: 'Friends',
  ACTIVITY: 'Activity',
  ACCOUNT_TAB: 'AccountTab',

  // Account Drawer Navigator Screens
  ACCOUNT: 'Account',
  EMAIL_DETAILS: 'EmailDetails',
  LOGOUT_LOGIN: 'LogoutLogin',
} as const;

export type RootStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.ENROLLMENT]: undefined;
  [SCREEN_NAMES.MAIN_APP]: undefined;
};

export type TabParamList = {
  [SCREEN_NAMES.GROUPS]: undefined;
  [SCREEN_NAMES.FRIENDS]: undefined;
  [SCREEN_NAMES.ACTIVITY]: undefined;
  [SCREEN_NAMES.ACCOUNT_TAB]: undefined;
};

export type AccountDrawerParamList = {
  [SCREEN_NAMES.ACCOUNT]: undefined;
  [SCREEN_NAMES.EMAIL_DETAILS]: undefined;
  [SCREEN_NAMES.LOGOUT_LOGIN]: undefined;
};
