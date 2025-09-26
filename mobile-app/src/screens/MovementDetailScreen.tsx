// src/screens/MovementDetailScreen.tsx
// Detailed view for individual art movements

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Movement } from '../types';
import { europeanArtMovements } from '../data/european-art-movements';

type MovementDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MovementDetail'
>;

type MovementDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovementDetail'>;

interface MovementDetailScreenProps {
  navigation: MovementDetailScreenNavigationProp;
  route: MovementDetailScreenRouteProp;
}

const MovementDetailScreen: React.FC<MovementDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { movementId } = route.params;

  // Find the movement by ID
  const movement = useMemo(() => {
    return europeanArtMovements.find(m => m.id === movementId);
  }, [movementId]);

  if (!movement) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Movement not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header with color indicator */}
        <View style={styles.header}>
          <View
            style={[styles.colorIndicator, { backgroundColor: movement.color }]}
          />
          <View style={styles.headerText}>
            <Text style={styles.movementName}>{movement.name}</Text>
            <Text style={styles.movementPeriod}>
              {movement.period.start}
              {movement.period.end && ` - ${movement.period.end}`}
            </Text>
            {movement.region && (
              <Text style={styles.movementRegion}>{movement.region}</Text>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Movement</Text>
          <Text style={styles.descriptionText}>{movement.description}</Text>
        </View>

        {/* Key Artists */}
        {movement.keyArtists && movement.keyArtists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Artists</Text>
            <View style={styles.listContainer}>
              {movement.keyArtists.map((artist, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{artist}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notable Works */}
        {movement.keyWorks && movement.keyWorks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notable Works</Text>
            <View style={styles.listContainer}>
              {movement.keyWorks.map((work, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>{work}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Short Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{movement.shortDescription}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colorIndicator: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  headerText: {
    flex: 1,
  },
  movementName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  movementPeriod: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  movementRegion: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#444',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    fontStyle: 'italic',
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listItemText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    flex: 1,
  },
});

export default MovementDetailScreen;