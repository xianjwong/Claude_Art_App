// src/components/Timeline.tsx
// Main scrollable timeline component that brings everything together

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { Movement, TimePeriod } from '../types';
import {
  calculateTimelineHeight,
  scrollOffsetToYear,
  yearToScrollOffset,
  arrangeMovementsInColumns,
  TIMELINE_CONFIG,
} from '../utils/timeline';
import MovementBar from './MovementBar';
import TimeIndicator from './TimeIndicator';

interface TimelineProps {
  movements: Movement[];
  timeRange: TimePeriod;
  onMovementPress?: (movement: Movement) => void;
  onVisibleRangeChange?: (range: TimePeriod) => void;
  showTimeIndicator?: boolean;
  timeIndicatorPosition?: 'top' | 'bottom';
  initialYear?: number;
  zoomLevel?: number;
  onZoomChange?: (newZoomLevel: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  movements,
  timeRange,
  onMovementPress,
  onVisibleRangeChange,
  showTimeIndicator = true,
  timeIndicatorPosition = 'top',
  initialYear,
  zoomLevel = 1,
  onZoomChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [visibleRange, setVisibleRange] = useState<TimePeriod>(timeRange);

  const screenHeight = Dimensions.get('window').height;

  // Create zoomed timeline configuration
  const zoomedConfig = useMemo(() => ({
    ...TIMELINE_CONFIG,
    PIXELS_PER_YEAR: TIMELINE_CONFIG.PIXELS_PER_YEAR * zoomLevel,
  }), [zoomLevel]);

  // Calculate timeline height with zoom
  const timelineHeight = calculateTimelineHeight(timeRange, zoomedConfig);

  // Calculate visible range based on scroll position
  const updateVisibleRange = useCallback((offset: number) => {
    const viewportHeight = screenHeight - 200; // Account for UI elements

    const startYear = scrollOffsetToYear(offset, timeRange, zoomedConfig);
    const endYear = scrollOffsetToYear(
      offset + viewportHeight,
      timeRange,
      zoomedConfig
    );

    const newRange = {
      start: Math.max(startYear, timeRange.start),
      end: Math.min(endYear, timeRange.end || timeRange.start),
    };
    setVisibleRange(newRange);
    onVisibleRangeChange?.(newRange);
  }, [screenHeight, timeRange, zoomedConfig]);

  // Handle scroll events
  const handleScroll = useCallback((event: any) => {
    const offset = event.nativeEvent.contentOffset.y;
    setScrollOffset(offset);
    updateVisibleRange(offset);
  }, [updateVisibleRange]);

  // Arrange movements in columns to handle overlaps
  const columnAssignments = arrangeMovementsInColumns(movements);

  // Generate half-century markers (every 50 years)
  const generateHalfCenturyMarkers = useCallback(() => {
    const markers = [];
    const startHalfCentury = Math.floor(timeRange.start / 50) * 50;
    const endHalfCentury = Math.ceil((timeRange.end || timeRange.start) / 50) * 50;

    for (let year = startHalfCentury; year <= endHalfCentury; year += 50) {
      if (year >= timeRange.start && year <= (timeRange.end || timeRange.start)) {
        const yPosition = yearToScrollOffset(year, timeRange, zoomedConfig);
        markers.push(
          <View key={year} style={[styles.halfCenturyMarker, { top: yPosition }]}>
            <View style={styles.halfCenturyLine} />
            <Text style={styles.halfCenturyText}>{year}</Text>
          </View>
        );
      }
    }
    return markers;
  }, [timeRange, zoomedConfig]);

  // Scroll to initial year if provided
  useEffect(() => {
    if (initialYear && scrollViewRef.current) {
      const offset = yearToScrollOffset(initialYear, timeRange, zoomedConfig);
      scrollViewRef.current.scrollTo({ y: offset, animated: false });
    }
  }, [initialYear, timeRange, zoomedConfig]);

  // Update visible range when zoom changes
  useEffect(() => {
    updateVisibleRange(scrollOffset);
  }, [zoomLevel, scrollOffset, updateVisibleRange]);

  // Handle pinch gesture for zoom
  const baseZoomLevel = useRef(zoomLevel);

  const handlePinchGestureEvent = useCallback((event: any) => {
    if (onZoomChange) {
      const { scale } = event.nativeEvent;
      const newZoomLevel = Math.max(0.5, Math.min(3, baseZoomLevel.current * scale));
      onZoomChange(newZoomLevel);
    }
  }, [onZoomChange]);

  const handlePinchGestureStateChange = useCallback((event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      baseZoomLevel.current = zoomLevel;
    }
  }, [zoomLevel]);

  return (
    <View style={styles.container} testID="timeline-container">
      {showTimeIndicator && (
        <TimeIndicator
          visibleRange={visibleRange}
          position={timeIndicatorPosition}
        />
      )}

      <PinchGestureHandler
        onGestureEvent={handlePinchGestureEvent}
        onHandlerStateChange={handlePinchGestureStateChange}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { height: timelineHeight }
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          testID="timeline-scroll-view"
        >
          <View style={styles.timelineContent}>
            {/* Half-century markers */}
            {generateHalfCenturyMarkers()}

            {/* Movement bars */}
            {movements.map((movement, index) => (
              <MovementBar
                key={movement.id}
                movement={movement}
                timeRange={timeRange}
                columnIndex={columnAssignments[index]}
                onPress={onMovementPress}
                barWidth={20 * zoomLevel}
                config={zoomedConfig}
              />
            ))}
          </View>
        </ScrollView>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  timelineContent: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 20,
  },
  halfCenturyMarker: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 0, // Behind movement bars
  },
  halfCenturyLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#bbb',
    marginRight: 10,
  },
  halfCenturyText: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Timeline;