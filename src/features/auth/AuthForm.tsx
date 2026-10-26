import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { ApiError } from '@/lib/api-client';
import { useApi } from '@/lib/api-context';
import { errorMessageKey, isMessageKey, useTranslation } from '@/lib/i18n';
import { startSession } from '@/lib/session';
import { fieldErrors, signInSchema, signUpSchema } from '@/shared/schemas';
import { fontSize, space, useTheme } from '@/theme';

/** Props of {@link AuthForm}. */
export interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

type Field = 'name' | 'email' | 'password';

/**
 * The sign-in and sign-up form. Fields are checked with the same schemas the API uses, so most
 * mistakes are shown before a request is sent; errors the API finds (a taken e-mail address)
 * appear under the same fields.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const api = useApi();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const signUp = mode === 'sign-up';
  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field | '_form', string>>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      if (signUp) return api.signUp(values);
      return api.signIn({ email: values.email, password: values.password });
    },
    onSuccess: startSession,
    onError: (error) => {
      if (error instanceof ApiError && error.fields) setErrors(error.fields);
      else setErrors({ _form: errorMessageKey(error) });
    },
  });

  const submit = () => {
    const parsed = signUp
      ? signUpSchema.safeParse(values)
      : signInSchema.safeParse({ email: values.email, password: values.password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    mutation.mutate();
  };

  const message = (key: string | undefined) => (key && isMessageKey(key) ? t(key) : undefined);
  const update = (field: Field) => (text: string) =>
    setValues((current) => ({ ...current, [field]: text }));

  return (
    <Screen>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {t(signUp ? 'auth.signUp.title' : 'auth.signIn.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {t(signUp ? 'auth.signUp.subtitle' : 'auth.signIn.subtitle')}
        </Text>
      </View>

      {signUp ? (
        <TextField
          label={t('fields.name')}
          value={values.name}
          onChangeText={update('name')}
          error={message(errors.name)}
          autoComplete="name"
          textContentType="name"
          testID="name"
        />
      ) : null}
      <TextField
        label={t('fields.email')}
        value={values.email}
        onChangeText={update('email')}
        error={message(errors.email)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType={signUp ? 'emailAddress' : 'username'}
        testID="email"
      />
      <TextField
        label={t('fields.password')}
        value={values.password}
        onChangeText={update('password')}
        error={message(errors.password)}
        hint={signUp ? t('fields.passwordHint') : undefined}
        secureTextEntry
        autoComplete={signUp ? 'new-password' : 'current-password'}
        textContentType={signUp ? 'newPassword' : 'password'}
        onSubmitEditing={submit}
        testID="password"
      />

      {errors._form ? (
        <Text
          accessibilityLiveRegion="polite"
          role="alert"
          style={[styles.formError, { color: colors.danger }]}
        >
          {message(errors._form)}
        </Text>
      ) : null}

      <Button
        title={t(signUp ? 'auth.signUp.submit' : 'auth.signIn.submit')}
        onPress={submit}
        loading={mutation.isPending}
        testID="submit"
      />
      <Link
        href={signUp ? '/sign-in' : '/sign-up'}
        replace
        style={[styles.switch, { color: colors.accent }]}
      >
        {t(signUp ? 'auth.signUp.switch' : 'auth.signIn.switch')}
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.sm, marginTop: space.xxl, marginBottom: space.sm },
  title: { fontSize: fontSize.largeTitle, fontWeight: '700' },
  subtitle: { fontSize: fontSize.body },
  formError: { fontSize: fontSize.body },
  switch: { fontSize: fontSize.body, textAlign: 'center', paddingVertical: space.md },
});
