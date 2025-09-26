// src/screens/TimelineScreen.tsx
// Main screen component that hosts the timeline with React Navigation integration

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Timeline } from '../components';
import { Movement, TimelineContext, RootStackParamList, TimePeriod } from '../types';
import { europeanArtContext } from '../data/european-art-movements';

type TimelineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Timeline'
>;

type TimelineScreenRouteProp = RouteProp<RootStackParamList, 'Timeline'>;

interface TimelineScreenProps {
  navigation: TimelineScreenNavigationProp;
  route: TimelineScreenRouteProp;
  timelineContext?: TimelineContext; // Could be passed as prop or fetched by contextId
}

const TimelineScreen: React.FC<TimelineScreenProps> = ({
  navigation,
  route,
  timelineContext,
}) => {
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2); // Start more zoomed in

  // Get contextId from route params
  const { contextId } = route.params;

  // Get the appropriate context based on contextId
  const context = useMemo(() => {
    if (timelineContext) {
      return timelineContext;
    }

    // Map contextId to available contexts
    switch (contextId) {
      case 'european-art':
        return europeanArtContext;
      default:
        // Fallback context
        return {
          id: 'placeholder',
          name: 'Art Timeline',
          description: 'Explore art movements through time',
          movements: [],
          timeRange: { start: 1400, end: 1920 },
        } as TimelineContext;
    }
  }, [contextId, timelineContext]);

  // Initialize visible range state
  const [visibleRange, setVisibleRange] = useState<TimePeriod>({ start: 1400, end: 1920 });

  // Update visible range when context changes
  React.useEffect(() => {
    setVisibleRange(context.timeRange);
  }, [context.timeRange]);

  // Update navigation header with current time range
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Art Timeline</Text>
          <Text style={styles.headerSubtitle}>
            {visibleRange.start}
            {visibleRange.end && visibleRange.end !== visibleRange.start
              ? ` - ${visibleRange.end}`
              : ''}
          </Text>
        </View>
      ),
    });
  }, [navigation, visibleRange]);

  // Handle visible range updates from Timeline
  const handleVisibleRangeChange = useCallback((newRange: TimePeriod) => {
    setVisibleRange(newRange);
  }, []);

  // Handle movement selection
  const handleMovementPress = useCallback((movement: Movement) => {
    setSelectedMovement(movement);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedMovement(null);
  }, []);

  // Navigate to movement detail screen
  const handleViewDetails = useCallback(() => {
    if (selectedMovement) {
      setSelectedMovement(null);
      navigation.navigate('MovementDetail', { movementId: selectedMovement.id });
    }
  }, [selectedMovement, navigation]);

  // Handle zoom controls (for future expansion)
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.5, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Main Timeline */}
      <Timeline
        movements={context.movements}
        timeRange={context.timeRange}
        onMovementPress={handleMovementPress}
        onVisibleRangeChange={handleVisibleRangeChange}
        showTimeIndicator={false} // Disabled floating indicator
        zoomLevel={zoomLevel}
      />

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={[styles.zoomButton, zoomLevel <= 0.5 && styles.zoomButtonDisabled]}
          onPress={handleZoomOut}
          disabled={zoomLevel <= 0.5}
        >
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.zoomLevel}>{zoomLevel.toFixed(1)}x</Text>
        <TouchableOpacity
          style={[styles.zoomButton, zoomLevel >= 3 && styles.zoomButtonDisabled]}
          onPress={handleZoomIn}
          disabled={zoomLevel >= 3}
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Movement Detail Modal */}
      {selectedMovement && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseModal}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedMovement.name}</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={handleViewDetails}
              >
                <Text style={styles.detailButtonText}>Details</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.movementHeader}>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: selectedMovement.color }
                  ]}
                />
                <View style={styles.movementInfo}>
                  <Text style={styles.movementName}>{selectedMovement.name}</Text>
                  <Text style={styles.movementPeriod}>
                    {selectedMovement.period.start}
                    {selectedMovement.period.end &&
                      ` - ${selectedMovement.period.end}`}
                  </Text>
                  {selectedMovement.region && (
                    <Text style={styles.movementRegion}>
                      {selectedMovement.region}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                  {selectedMovement.description}
                </Text>
              </View>

              {selectedMovement.keyArtists && selectedMovement.keyArtists.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Key Artists</Text>
                  {selectedMovement.keyArtists.map((artist, index) => (
                    <Text key={index} style={styles.listItem}>• {artist}</Text>
                  ))}
                </View>
              )}

              {selectedMovement.keyWorks && selectedMovement.keyWorks.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Notable Works</Text>
                  {selectedMovement.keyWorks.map((work, index) => (
                    <Text key={index} style={styles.listItem}>• {work}</Text>
                  ))}
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  movementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  movementInfo: {
    flex: 1,
  },
  movementName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  movementPeriod: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  movementRegion: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 4,
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonDisabled: {
    backgroundColor: '#ccc',
  },
  zoomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
  },
  zoomLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
});

export default TimelineScreen;