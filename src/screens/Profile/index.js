import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSelector from '../../components/LanguageSelector';
import { supabase } from '../../config/supabase';
import { fetchUserProgress, updateUserLanguage } from '../../services/api';

const ProfileScreen = () => {
  const [userLanguage, setUserLanguage] = useState('Romanian');
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Get userId from Redux store
  const userId = useSelector(state => state.auth?.user?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      loadUserProgress();
    }
  }, [userLanguage, userId]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Dispatch user data to Redux store
      dispatch({ type: 'auth/setUser', payload: data.user });
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert('Success', 'Account created! Please check your email for verification.');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!userId) {
      console.warn('No user ID available');
      return;
    }

    try {
      setIsLoading(true);
      const userProgress = await fetchUserProgress(userId, userLanguage);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading user progress:', error);
      Alert.alert('Error', 'Failed to load progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    if (!userId) {
      Alert.alert('Error', 'Please sign in to change your language preference.');
      return;
    }

    try {
      setIsLoading(true);
      await updateUserLanguage(userId, newLanguage);
      setUserLanguage(newLanguage);
      Alert.alert('Success', `Language updated to ${newLanguage}`);
    } catch (error) {
      console.error('Error updating language:', error);
      Alert.alert('Error', 'Failed to update language. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressSection = () => {
    if (!progress) return null;

    const masteredPhrases = progress.filter(p => p.mastery_level >= 3).length;
    const inProgressPhrases = progress.filter(p => p.mastery_level < 3).length;
    const totalPhrases = progress.length;

    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Learning Progress</Text>
        
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{masteredPhrases}</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{inProgressPhrases}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPhrases}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(masteredPhrases / totalPhrases) * 100}%` }
            ]} 
          />
        </View>
      </View>
    );
  };

  if (!userId) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
          <Text style={styles.sectionDescription}>
            {isSignUp 
              ? 'Create an account to track your progress and save your preferences.'
              : 'Sign in to access your profile and language preferences.'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.authButton}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.authButtonText}>
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchAuthButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchAuthText}>
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Language</Text>
        <Text style={styles.sectionDescription}>
          Select the language you want to learn. All phrases will be shown in English and your selected language.
        </Text>
        <LanguageSelector
          userId={userId}
          currentLanguage={userLanguage}
          onLanguageChange={handleLanguageChange}
          disabled={isLoading}
        />
      </View>

      {renderProgressSection()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => Alert.alert('Coming Soon', 'Account settings will be available soon!')}
        >
          <Text style={styles.settingButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
        >
          <Text style={styles.settingButtonText}>Notification Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  settingButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchAuthText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default ProfileScreen; 