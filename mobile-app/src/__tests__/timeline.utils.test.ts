// src/__tests__/timeline.utils.test.ts
// Unit tests for timeline utility functions

import {
  yearToScrollOffset,
  scrollOffsetToYear,
  calculateTimelineHeight,
  getMovementStartY,
  getMovementHeight,
  movementsOverlap,
  arrangeMovementsInColumns,
  formatYearRange,
  TIMELINE_CONFIG,
} from '../utils/timeline';
import { Movement, TimePeriod } from '../types';

describe('Timeline Utilities', () => {
  const mockTimeRange: TimePeriod = { start: 1400, end: 1920 };

  describe('yearToScrollOffset', () => {
    it('should convert start year to initial offset', () => {
      const result = yearToScrollOffset(1400, mockTimeRange);
      expect(result).toBe(TIMELINE_CONFIG.TIMELINE_PADDING);
    });

    it('should convert year to correct pixel offset', () => {
      const result = yearToScrollOffset(1450, mockTimeRange);
      const expected = TIMELINE_CONFIG.TIMELINE_PADDING + (50 * TIMELINE_CONFIG.PIXELS_PER_YEAR);
      expect(result).toBe(expected);
    });
  });

  describe('scrollOffsetToYear', () => {
    it('should convert scroll offset back to year', () => {
      const offset = TIMELINE_CONFIG.TIMELINE_PADDING + (100 * TIMELINE_CONFIG.PIXELS_PER_YEAR);
      const result = scrollOffsetToYear(offset, mockTimeRange);
      expect(result).toBe(1500);
    });

    it('should round to nearest year', () => {
      const offset = TIMELINE_CONFIG.TIMELINE_PADDING + (100.7 * TIMELINE_CONFIG.PIXELS_PER_YEAR);
      const result = scrollOffsetToYear(offset, mockTimeRange);
      expect(result).toBe(1501);
    });
  });

  describe('calculateTimelineHeight', () => {
    it('should calculate correct total height', () => {
      const result = calculateTimelineHeight(mockTimeRange);
      const expectedYears = 1920 - 1400;
      const expected = (expectedYears * TIMELINE_CONFIG.PIXELS_PER_YEAR) + (2 * TIMELINE_CONFIG.TIMELINE_PADDING);
      expect(result).toBe(expected);
    });
  });

  describe('getMovementHeight', () => {
    it('should return minimum height for single-year movements', () => {
      const movement: Movement = {
        id: 'test',
        name: 'Test Movement',
        period: { start: 1900 },
        description: 'Test',
        shortDescription: 'Test',
        color: '#000000',
      };
      
      const result = getMovementHeight(movement);
      expect(result).toBe(TIMELINE_CONFIG.MOVEMENT_HEIGHT);
    });

    it('should calculate height based on duration for multi-year movements', () => {
      const movement: Movement = {
        id: 'test',
        name: 'Test Movement',
        period: { start: 1400, end: 1600 },
        description: 'Test',
        shortDescription: 'Test',
        color: '#000000',
      };
      
      const result = getMovementHeight(movement);
      const expectedHeight = 200 * TIMELINE_CONFIG.PIXELS_PER_YEAR; // 200 years
      expect(result).toBe(expectedHeight);
    });
  });

  describe('movementsOverlap', () => {
    const movement1: Movement = {
      id: 'test1',
      name: 'Movement 1',
      period: { start: 1400, end: 1500 },
      description: 'Test',
      shortDescription: 'Test',
      color: '#000000',
    };

    it('should detect overlapping movements', () => {
      const movement2: Movement = {
        ...movement1,
        id: 'test2',
        period: { start: 1450, end: 1550 },
      };
      
      expect(movementsOverlap(movement1, movement2)).toBe(true);
    });

    it('should detect non-overlapping movements', () => {
      const movement2: Movement = {
        ...movement1,
        id: 'test2',
        period: { start: 1600, end: 1700 },
      };
      
      expect(movementsOverlap(movement1, movement2)).toBe(false);
    });

    it('should handle touching periods as non-overlapping', () => {
      const movement2: Movement = {
        ...movement1,
        id: 'test2',
        period: { start: 1500, end: 1600 },
      };
      
      expect(movementsOverlap(movement1, movement2)).toBe(false);
    });
  });

  describe('arrangeMovementsInColumns', () => {
    it('should place non-overlapping movements in the same column', () => {
      const movements: Movement[] = [
        {
          id: 'test1',
          name: 'Movement 1',
          period: { start: 1400, end: 1500 },
          description: 'Test',
          shortDescription: 'Test',
          color: '#000000',
        },
        {
          id: 'test2',
          name: 'Movement 2',
          period: { start: 1600, end: 1700 },
          description: 'Test',
          shortDescription: 'Test',
          color: '#111111',
        },
      ];

      const result = arrangeMovementsInColumns(movements);
      expect(result).toEqual([0, 0]);
    });

    it('should place overlapping movements in different columns', () => {
      const movements: Movement[] = [
        {
          id: 'test1',
          name: 'Movement 1',
          period: { start: 1400, end: 1600 },
          description: 'Test',
          shortDescription: 'Test',
          color: '#000000',
        },
        {
          id: 'test2',
          name: 'Movement 2',
          period: { start: 1500, end: 1700 },
          description: 'Test',
          shortDescription: 'Test',
          color: '#111111',
        },
      ];

      const result = arrangeMovementsInColumns(movements);
      expect(result).toEqual([0, 1]);
    });
  });

  describe('formatYearRange', () => {
    it('should format single year', () => {
      const result = formatYearRange({ start: 1500 });
      expect(result).toBe('1500');
    });

    it('should format year range', () => {
      const result = formatYearRange({ start: 1400, end: 1600 });
      expect(result).toBe('1400 - 1600');
    });
  });
});