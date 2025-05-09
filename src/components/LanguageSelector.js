import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { updateUserLanguage } from '../services/api';

const SUPPORTED_LANGUAGES = [
  { code: 'Romanian', name: 'Romanian' },
  { code: 'Spanish', name: 'Spanish' },
  { code: 'French', name: 'French' },
  { code: 'German', name: 'German' },
  { code: 'Italian', name: 'Italian' }
];

const LanguageSelector = ({ userId, currentLanguage, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageSelect = async (language) => {
    try {
      await updateUserLanguage(userId, language);
      setSelectedLanguage(language);
      onLanguageChange(language);
      Alert.alert('Success', `Language updated to ${language}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update language. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Learning Language</Text>
      <View style={styles.languageGrid}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              selectedLanguage === lang.code && styles.selectedLanguage
            ]}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === lang.code && styles.selectedLanguageText
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageButton: {
    width: '48%',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
  },
});

export default LanguageSelector; 