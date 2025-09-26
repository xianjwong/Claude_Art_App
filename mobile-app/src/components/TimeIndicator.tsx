// src/components/TimeIndicator.tsx
// Fixed HUD component that shows the visible time range to the user

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimePeriod } from '../types';

interface TimeIndicatorProps {
  visibleRange: TimePeriod;
  position?: 'top' | 'bottom';
  style?: object;
}

const TimeIndicator: React.FC<TimeIndicatorProps> = ({
  visibleRange,
  position = 'top',
  style,
}) => {
  const formatRange = (range: TimePeriod): string => {
    const { start, end } = range;
    if (!end || start === end) {
      return start.toString();
    }
    return `${start} - ${end}`;
  };

  const positionStyle = position === 'top' ? styles.topPosition : styles.bottomPosition;

  return (
    <View
      style={[styles.container, positionStyle, style]}
      testID="time-indicator"
    >
      <View style={styles.background}>
        <Text style={styles.rangeText} testID="time-range-text">
          {formatRange(visibleRange)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  topPosition: {
    top: 60, // Below status bar and navigation
  },
  bottomPosition: {
    bottom: 100, // Above bottom navigation/tabs
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rangeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default TimeIndicator;