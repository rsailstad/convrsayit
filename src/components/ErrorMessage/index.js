/**
 * ErrorMessage Component
 * Displays error messages in a standardized format
 */

import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

/**
 * Parse and display error in a user-friendly format
 */
const ErrorMessage = ({ 
  error, 
  style,
  message, 
  showDetails = false,
  type = 'error', // error, warning, info
  onRetry
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Extract error message
  const errorMessage = message || 
    (typeof error === 'string' 
      ? error 
      : error?.message || 'An unexpected error occurred');
      
  // Determine error details
  const errorDetails = 
    typeof error === 'object' && error !== null
      ? JSON.stringify(error, null, 2)
      : String(error);
  
  // Set colors based on error type
  const containerStyle = [
    styles.container,
    type === 'warning' && styles.warningContainer,
    type === 'info' && styles.infoContainer,
    style,
  ];
  
  const textStyle = [
    styles.message,
    type === 'warning' && styles.warningText,
    type === 'info' && styles.infoText,
  ];
  
  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{errorMessage}</Text>
      
      {showDetails && (
        <>
          <TouchableOpacity 
            onPress={() => setExpanded(!expanded)}
            style={styles.detailsToggle}
          >
            <Text style={styles.detailsToggleText}>
              {expanded ? 'Hide Details' : 'Show Details'}
            </Text>
          </TouchableOpacity>
          
          {expanded && (
            <View style={styles.detailsContainer}>
              <Text style={styles.details}>{errorDetails}</Text>
            </View>
          )}
        </>
      )}
      
      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  warningContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderLeftColor: colors.warning || '#ffbb33',
  },
  infoContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderLeftColor: colors.info || '#2196f3',
  },
  message: {
    color: colors.error,
    fontSize: typography.fontSize.small,
    fontWeight: '500',
  },
  warningText: {
    color: colors.warning || '#ff8800',
  },
  infoText: {
    color: colors.info || '#0099cc',
  },
  detailsToggle: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  detailsToggleText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.small,
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  },
  details: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: typography.fontSize.xsmall,
    color: colors.text.secondary,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.small,
    fontWeight: 'bold',
  },
});

export default ErrorMessage; 