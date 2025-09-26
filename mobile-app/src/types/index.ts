// src/types/index.ts
// Core data types for the Art Timeline App

/**
 * Represents a time period (year or year range)
 */
export interface TimePeriod {
  start: number; // Year (e.g., 1850)
  end?: number;  // Optional end year for movements that span multiple years
}

/**
 * Represents an art or architecture movement
 */
export interface Movement {
  id: string;
  name: string;
  period: TimePeriod;
  description: string;
  shortDescription: string; // For timeline display
  color: string; // Hex color for visual identification
  region?: string; // Optional geographic region
  keyArtists?: string[]; // Notable artists/architects
  keyWorks?: string[]; // Famous works/buildings
  imageUrl?: string; // Representative image
}

/**
 * Timeline context (e.g., "European Art", "London Architecture")
 */
export interface TimelineContext {
  id: string;
  name: string;
  description: string;
  movements: Movement[];
  timeRange: TimePeriod; // Overall time range for this context
}

/**
 * Position on timeline (for scroll calculations)
 */
export interface TimelinePosition {
  year: number;
  scrollOffset: number; // Pixel offset from top
}

/**
 * Screen navigation types
 */
export type RootStackParamList = {
  Timeline: { contextId: string };
  MovementDetail: { movementId: string };
  ContextSelector: undefined;
};