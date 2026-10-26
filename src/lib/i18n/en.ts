/**
 * English strings. This file defines the keys; every other language must have the same keys,
 * which the type of `tr.ts` enforces.
 */
export const en = {
  'app.name': 'Starter',

  'auth.signIn.title': 'Welcome back',
  'auth.signIn.subtitle': 'Sign in to see your tasks.',
  'auth.signIn.submit': 'Sign in',
  'auth.signIn.switch': 'New here? Create an account',
  'auth.signUp.title': 'Create an account',
  'auth.signUp.subtitle': 'Your tasks are kept on your own server.',
  'auth.signUp.submit': 'Create account',
  'auth.signUp.switch': 'Have an account? Sign in',

  'fields.name': 'Name',
  'fields.email': 'E-mail',
  'fields.password': 'Password',
  'fields.passwordHint': 'At least 8 characters.',

  'tasks.title': 'Tasks',
  'tasks.greeting': 'Hi, {name}',
  'tasks.open': '{count} open',
  'tasks.newPlaceholder': 'Add a task',
  'tasks.add': 'Add',
  'tasks.empty': 'No tasks yet',
  'tasks.emptyHint': 'Add your first task above.',
  'tasks.delete': 'Delete {title}',
  'tasks.toggle': 'Mark {title} as done',
  'tasks.toggleBack': 'Mark {title} as not done',
  'tasks.loadError': 'The tasks could not be loaded.',

  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.appearance.system': 'System',
  'settings.appearance.light': 'Light',
  'settings.appearance.dark': 'Dark',
  'settings.language': 'Language',
  'settings.language.system': 'System',
  'settings.account': 'Account',
  'settings.signOut': 'Sign out',
  'settings.about': 'About',
  'settings.version': 'Version',
  'settings.server': 'Server',
  'settings.sameOrigin': 'This website',
  'settings.notConfigured': 'Not configured',

  'common.retry': 'Try again',
  'notFound.title': 'This screen does not exist.',
  'notFound.link': 'Go to the start screen',

  'validation.required': 'Fill in this field.',
  'validation.tooLong': 'This is too long.',
  'validation.email': 'Enter an e-mail address such as name@example.com.',
  'validation.emailTaken': 'An account with this e-mail address exists. Sign in instead.',
  'validation.passwordTooShort': 'Use at least 8 characters.',
  'validation.invalidCharacters': 'Remove line breaks and invisible control characters.',
  'validation.nothingToUpdate': 'Nothing to change.',
  'validation.invalid': 'This value is not valid.',

  'errors.config': 'The app has no server address. Set EXPO_PUBLIC_API_URL and rebuild.',
  'errors.network': 'No connection to the server. Check your network and try again.',
  'errors.timeout': 'The server took too long to answer. Try again.',
  'errors.invalidResponse': 'The server sent an unexpected answer.',
  'errors.server': 'Something went wrong on the server. Try again later.',
  'errors.invalidCredentials': 'The e-mail address or the password is wrong.',
  'errors.tooManyAttempts': 'Too many failed attempts. Wait a few minutes and try again.',
  'errors.taskLimit': 'You have reached the maximum number of tasks. Delete some first.',
  'errors.unknown': 'Something went wrong. Try again.',
} as const;

/** A translation key. */
export type MessageKey = keyof typeof en;
