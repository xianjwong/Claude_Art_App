// src/__tests__/TimeIndicator.test.tsx
// Tests for TimeIndicator component

import React from 'react';
import { render } from '@testing-library/react-native';
import TimeIndicator from '../components/TimeIndicator';
import { TimePeriod } from '../types';

describe('TimeIndicator', () => {
  const mockVisibleRange: TimePeriod = {
    start: 1800,
    end: 1850,
  };

  const defaultProps = {
    visibleRange: mockVisibleRange,
  };

  it('should render without crashing', () => {
    const { getByTestId } = render(<TimeIndicator {...defaultProps} />);
    expect(getByTestId('time-indicator')).toBeTruthy();
  });

  it('should display the correct time range', () => {
    const { getByTestId } = render(<TimeIndicator {...defaultProps} />);
    const rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1800 - 1850');
  });

  it('should display single year when start equals end', () => {
    const singleYearRange: TimePeriod = {
      start: 1900,
      end: 1900,
    };

    const { getByTestId } = render(
      <TimeIndicator visibleRange={singleYearRange} />
    );
    const rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1900');
  });

  it('should display single year when end is not provided', () => {
    const singleYearRange: TimePeriod = {
      start: 1750,
    };

    const { getByTestId } = render(
      <TimeIndicator visibleRange={singleYearRange} />
    );
    const rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1750');
  });

  it('should position at top by default', () => {
    const { getByTestId } = render(<TimeIndicator {...defaultProps} />);
    const container = getByTestId('time-indicator');

    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          top: 60,
        })
      ])
    );
  });

  it('should position at bottom when specified', () => {
    const { getByTestId } = render(
      <TimeIndicator {...defaultProps} position="bottom" />
    );
    const container = getByTestId('time-indicator');

    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          bottom: 100,
        })
      ])
    );
  });

  it('should apply custom styles', () => {
    const customStyle = { opacity: 0.5 };
    const { getByTestId } = render(
      <TimeIndicator {...defaultProps} style={customStyle} />
    );
    const container = getByTestId('time-indicator');

    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('should have high z-index for HUD positioning', () => {
    const { getByTestId } = render(<TimeIndicator {...defaultProps} />);
    const container = getByTestId('time-indicator');

    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          zIndex: 1000,
        })
      ])
    );
  });

  it('should update when visible range changes', () => {
    const { getByTestId, rerender } = render(<TimeIndicator {...defaultProps} />);

    // Initial range
    let rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1800 - 1850');

    // Updated range
    const newRange: TimePeriod = { start: 1900, end: 1950 };
    rerender(<TimeIndicator visibleRange={newRange} />);

    rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1900 - 1950');
  });

  it('should handle wide ranges correctly', () => {
    const wideRange: TimePeriod = {
      start: 1400,
      end: 1920,
    };

    const { getByTestId } = render(
      <TimeIndicator visibleRange={wideRange} />
    );
    const rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1400 - 1920');
  });

  it('should handle narrow ranges correctly', () => {
    const narrowRange: TimePeriod = {
      start: 1850,
      end: 1851,
    };

    const { getByTestId } = render(
      <TimeIndicator visibleRange={narrowRange} />
    );
    const rangeText = getByTestId('time-range-text');
    expect(rangeText.props.children).toBe('1850 - 1851');
  });
});