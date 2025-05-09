import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SUPPORTED_LANGUAGES = [
  { code: 'Romanian', name: 'Romanian', flag: '🇷🇴' },
  { code: 'Spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'French', name: 'French', flag: '🇫🇷' },
  { code: 'German', name: 'German', flag: '🇩🇪' },
  { code: 'Italian', name: 'Italian', flag: '🇮🇹' }
];

const LanguageSelector = ({ userId, currentLanguage, onLanguageChange, disabled = false }) => {
  const handleLanguageSelect = async (language) => {
    if (disabled || language === currentLanguage) return;
    await onLanguageChange(language);
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageGrid}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLanguage === lang.code && styles.selectedLanguage,
              disabled && styles.disabledButton
            ]}
            onPress={() => handleLanguageSelect(lang.code)}
            disabled={disabled}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text
              style={[
                styles.languageText,
                currentLanguage === lang.code && styles.selectedLanguageText
              ]}
            >
              {lang.name}
            </Text>
            {disabled && currentLanguage === lang.code && (
              <ActivityIndicator size="small" color="#fff" style={styles.loader} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageButton: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedLanguage: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  disabledButton: {
    opacity: 0.7,
  },
  flag: {
    fontSize: 24,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  loader: {
    position: 'absolute',
    right: 12,
  },
});

export default LanguageSelector; 