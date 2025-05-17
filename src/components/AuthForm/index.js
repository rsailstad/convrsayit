import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearError,
    clearMagicLinkStatus,
    clearPasswordResetStatus,
    resetPassword,
    signIn,
    signInWithMagicLink,
    signUp
} from '../../store/authSlice';
import { colors, spacing, typography } from '../../theme';

const AuthForm = () => {
  const dispatch = useDispatch();
  const { loading, error, magicLinkSent, passwordResetSent } = useSelector(state => state.auth);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (isResetPassword) {
      if (!email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }
      await dispatch(resetPassword(email));
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (isSignUp) {
      await dispatch(signUp({ email, password }));
    } else {
      await dispatch(signIn({ email, password }));
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    await dispatch(signInWithMagicLink(email));
  };

  const renderForm = () => {
    if (magicLinkSent) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Check your email for the magic link to sign in!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(clearMagicLinkStatus())}
          >
            <Text style={styles.buttonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (passwordResetSent) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Check your email for password reset instructions!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(clearPasswordResetStatus());
              setIsResetPassword(false);
            }}
          >
            <Text style={styles.buttonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        {!isResetPassword && (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        )}

        {isSignUp && !isResetPassword && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="password"
          />
        )}

        {error && (
          <Text style={styles.errorText} onPress={() => dispatch(clearError())}>
            {error}
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {isResetPassword
                ? 'Reset Password'
                : isSignUp
                ? 'Sign Up'
                : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        {!isResetPassword && (
          <TouchableOpacity
            style={styles.magicLinkButton}
            onPress={handleMagicLink}
            disabled={loading}
          >
            <Text style={styles.magicLinkText}>Sign in with Magic Link</Text>
          </TouchableOpacity>
        )}

        <View style={styles.switchContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
              setIsResetPassword(false);
              dispatch(clearError());
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Text>
          </TouchableOpacity>

          {!isSignUp && (
            <TouchableOpacity
              onPress={() => {
                setIsResetPassword(!isResetPassword);
                dispatch(clearError());
              }}
            >
              <Text style={styles.switchText}>
                {isResetPassword ? 'Back to Sign In' : 'Forgot Password?'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isResetPassword
          ? 'Reset Password'
          : isSignUp
          ? 'Create Account'
          : 'Welcome Back'}
      </Text>
      {renderForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.medium,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  magicLinkButton: {
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  magicLinkText: {
    color: colors.primary,
    fontSize: typography.fontSize.medium,
  },
  switchContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primary,
    fontSize: typography.fontSize.small,
    marginVertical: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.small,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  messageText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default AuthForm; 