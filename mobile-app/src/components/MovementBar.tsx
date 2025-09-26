// src/components/MovementBar.tsx
// Reusable component for displaying individual art movements on the timeline

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Movement, TimePeriod } from '../types';
import { getMovementStartY, getMovementHeight, formatYearRange, TIMELINE_CONFIG } from '../utils/timeline';

interface MovementBarProps {
  movement: Movement;
  timeRange: TimePeriod;
  columnIndex: number;
  onPress?: (movement: Movement) => void;
  showLabel?: boolean;
  barWidth?: number;
  config?: typeof TIMELINE_CONFIG;
}

const MovementBar: React.FC<MovementBarProps> = ({
  movement,
  timeRange,
  columnIndex,
  onPress,
  showLabel = true,
  barWidth = MOVEMENT_BAR_WIDTH,
  config = TIMELINE_CONFIG,
}) => {
  const startY = getMovementStartY(movement, timeRange, config);
  const height = getMovementHeight(movement, config);

  // Calculate center-aligned positioning
  const screenWidth = Dimensions.get('window').width;
  const centerX = screenWidth / 2;
  const barWithSpacing = barWidth + COLUMN_SPACING;

  // Calculate offset from center based on column index
  // columnIndex 0 = center, negative = left side, positive = right side
  let leftOffset;
  if (columnIndex === 0) {
    leftOffset = centerX - (barWidth / 2); // Center the bar
  } else if (columnIndex < 0) {
    // Left side: move left from center
    leftOffset = centerX - (barWidth / 2) + (columnIndex * barWithSpacing);
  } else {
    // Right side: move right from center
    leftOffset = centerX - (barWidth / 2) + (columnIndex * barWithSpacing);
  }

  const handlePress = () => {
    onPress?.(movement);
  };

  return (
    <View
      style={[styles.wrapper, { top: startY, left: leftOffset }]}
      testID={`movement-wrapper-${movement.id}`}
    >
      {/* Movement Color Bar */}
      <TouchableOpacity
        style={[
          styles.colorBar,
          {
            height: height,
            width: barWidth,
            backgroundColor: movement.color,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        testID={`movement-bar-${movement.id}`}
      />

      {/* Label positioned to the right of the bar */}
      {showLabel && (
        <View style={[styles.labelContainer, { left: barWidth + LABEL_OFFSET }]}>
          <Text style={styles.name} numberOfLines={1}>
            {movement.name}
          </Text>
          <Text style={styles.period}>
            {formatYearRange(movement.period)}
          </Text>
          <Text style={styles.shortDescription} numberOfLines={2}>
            {movement.shortDescription}
          </Text>
        </View>
      )}
    </View>
  );
};

const MOVEMENT_BAR_WIDTH = 20;
const COLUMN_SPACING = 30;
const LABEL_OFFSET = 8;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  colorBar: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    minHeight: 60,
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    justifyContent: 'flex-start',
    minWidth: 100,
  },
  name: {
    color: '#333',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  period: {
    color: '#666',
    fontSize: 9,
    fontWeight: '400',
  },
  shortDescription: {
    color: '#777',
    fontSize: 8,
    fontWeight: '300',
    marginTop: 2,
    lineHeight: 10,
  },
});

export default MovementBar;