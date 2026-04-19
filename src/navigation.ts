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
} as const;

export type RootStackParamList = {
  [SCREEN_NAMES.WELCOME]: undefined;
  [SCREEN_NAMES.ENROLLMENT]: undefined;
  [SCREEN_NAMES.MAIN_APP]: undefined;
  [SCREEN_NAMES.EMAIL_DETAILS]: undefined;
  [SCREEN_NAMES.LOGOUT_LOGIN]: undefined;
};

export type TabParamList = {
  [SCREEN_NAMES.GROUPS]: undefined;
  [SCREEN_NAMES.FRIENDS]: undefined;
  [SCREEN_NAMES.ACTIVITY]: undefined;
  [SCREEN_NAMES.ACCOUNT]: undefined;
};
