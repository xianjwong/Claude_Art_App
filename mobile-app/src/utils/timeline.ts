// src/utils/timeline.ts
// Utility functions for timeline calculations

import { Movement, TimePeriod, TimelinePosition } from '../types';

/**
 * Configuration for timeline display
 */
export const TIMELINE_CONFIG = {
  PIXELS_PER_YEAR: 2, // How many pixels represent one year
  TIMELINE_PADDING: 100, // Padding at top and bottom
  MOVEMENT_HEIGHT: 60, // Height of each movement bar
  MOVEMENT_SPACING: 10, // Space between movement bars
};

/**
 * Convert a year to a scroll offset position
 */
export function yearToScrollOffset(year: number, timeRange: TimePeriod, config = TIMELINE_CONFIG): number {
  const { start: startYear } = timeRange;
  const yearOffset = year - startYear;
  return config.TIMELINE_PADDING + (yearOffset * config.PIXELS_PER_YEAR);
}

/**
 * Convert a scroll offset to a year
 */
export function scrollOffsetToYear(scrollOffset: number, timeRange: TimePeriod, config = TIMELINE_CONFIG): number {
  const { start: startYear } = timeRange;
  const adjustedOffset = scrollOffset - config.TIMELINE_PADDING;
  const yearOffset = adjustedOffset / config.PIXELS_PER_YEAR;
  return Math.round(startYear + yearOffset);
}

/**
 * Calculate the total height needed for the timeline
 */
export function calculateTimelineHeight(timeRange: TimePeriod, config = TIMELINE_CONFIG): number {
  const { start, end = start } = timeRange;
  const totalYears = end - start;
  return (totalYears * config.PIXELS_PER_YEAR) + (2 * config.TIMELINE_PADDING);
}

/**
 * Get the Y position for a movement's start
 */
export function getMovementStartY(movement: Movement, timeRange: TimePeriod, config = TIMELINE_CONFIG): number {
  return yearToScrollOffset(movement.period.start, timeRange, config);
}

/**
 * Get the height of a movement bar
 */
export function getMovementHeight(movement: Movement, config = TIMELINE_CONFIG): number {
  const { start, end = start } = movement.period;
  const duration = end - start;

  // Minimum height for single-year movements
  const minHeight = config.MOVEMENT_HEIGHT;
  const calculatedHeight = duration * config.PIXELS_PER_YEAR;

  return Math.max(minHeight, calculatedHeight);
}

/**
 * Check if two movements overlap in time
 */
export function movementsOverlap(movement1: Movement, movement2: Movement): boolean {
  const { start: start1, end: end1 = start1 } = movement1.period;
  const { start: start2, end: end2 = start2 } = movement2.period;
  
  return !(end1 <= start2 || end2 <= start1);
}

/**
 * Arrange overlapping movements in columns to avoid visual collision
 * Returns an array of column assignments for each movement
 * Uses center-aligned layout with alternating left (-1, -2...) and right (1, 2...) positions
 */
export function arrangeMovementsInColumns(movements: Movement[]): number[] {
  // Sort movements by start year
  const sortedMovements = [...movements].sort((a, b) => a.period.start - b.period.start);
  const columnAssignments: number[] = new Array(movements.length).fill(0);

  // Track which columns are occupied at each time point
  // Use negative numbers for left side, positive for right side, 0 for center
  const columns: { [key: number]: { movement: Movement; originalIndex: number }[] } = {};

  sortedMovements.forEach((movement, sortedIndex) => {
    const originalIndex = movements.indexOf(movement);

    // First try center position (0)
    if (!columns[0]) {
      columns[0] = [];
    }

    const centerHasOverlap = columns[0].some(col =>
      movementsOverlap(movement, col.movement)
    );

    if (!centerHasOverlap) {
      columns[0].push({ movement, originalIndex });
      columnAssignments[originalIndex] = 0;
      return;
    }

    // If center is occupied, alternate between left and right
    let columnIndex = 1;
    let useLeftSide = true;

    while (true) {
      const currentColumn = useLeftSide ? -columnIndex : columnIndex;

      if (!columns[currentColumn]) {
        columns[currentColumn] = [];
      }

      const hasOverlap = columns[currentColumn].some(col =>
        movementsOverlap(movement, col.movement)
      );

      if (!hasOverlap) {
        columns[currentColumn].push({ movement, originalIndex });
        columnAssignments[originalIndex] = currentColumn;
        break;
      }

      // Alternate between left and right, then increase distance from center
      if (useLeftSide) {
        useLeftSide = false; // Next try right side
      } else {
        useLeftSide = true;  // Next try left side with increased distance
        columnIndex++;
      }
    }
  });

  return columnAssignments;
}

/**
 * Format a year range for display
 */
export function formatYearRange(period: TimePeriod): string {
  const { start, end } = period;
  if (!end || start === end) {
    return start.toString();
  }
  return `${start} - ${end}`;
}